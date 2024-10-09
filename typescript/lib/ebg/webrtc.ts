import dojo = require("dojo");
import declare = require("dojo/_base/declare");
import "ebg/peerconnect";
import "ebg/scriptlogger";

type PeerConnect = InstanceType<typeof import("ebg/peerconnect")>
type ScriptLogger = InstanceType<typeof import("ebg/scriptlogger")>

declare global {
	namespace BGA {
		type RoomId = `T${number}` | `P${number}_${number}`;

		interface AjaxActions {
			"/videochat/videochat/relayPlayerMessage.html": {
				player_id: BGA.ID,
				room: BGA.RoomId,
				message: string
			};
			"/videochat/videochat/relayRoomMessage.html": {
				room: BGA.RoomId,
				message: string
			};
		}

		/** This is an extension of the {@link MediaStreamConstraints} interface that adds more properties to the video property. */
		interface WebRTCMediaConstraints {
			audio: boolean | MediaTrackConstraints;
			peerIdentity?: string;
			preferCurrentTab?: boolean;
			video: boolean | MediaTrackConstraints & {
				mandatory: {
					minAspectRatio: number,
					maxAspectRatio: number,
					maxWidth: number,
					maxFrameRate: number,
				},
				optional: any[],
			}
		}
	}
}

class WebRTC_Template {
	player_id: BGA.ID;
	room: BGA.RoomId;
	in_room: BGA.ID[] = [];
	logger: ScriptLogger;
	connections: Record<BGA.ID, PeerConnect> = {};
	pcConfig: RTCConfiguration;
	pcConstraints: RTCOfferOptions;
	mediaConstraints: BGA.WebRTCMediaConstraints;
	stereo: boolean = false;
	ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
	getUserMediaSuccess_callback: () => void;
	getUserMediaError_callback: () => void;
	onJoinRoom_callback: (player_id: BGA.ID, is_new: boolean) => void;
	onLeaveRoom_callback: (player_id: BGA.ID) => void;
	localVideo: HTMLVideoElement | null = null;
	localStream: MediaStream & { stop: Function } | null = null;
	isAudioMuted: boolean = false;
	isVideoMuted: boolean = false;
	sdpConstraints = {
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true,
		}
	}

	constructor(player_id: BGA.ID, room: BGA.RoomId, pcConfig: RTCConfiguration, pcConstraints: RTCOfferOptions, mediaConstraints: BGA.WebRTCMediaConstraints, _: any, ajaxCall: InstanceType<BGA.CorePage>["ajaxcall"], r: () => void, l: () => void, d: (player_id: BGA.ID, is_new: boolean) => void, c: (player_id: BGA.ID) => void) {
		this.player_id = player_id;
		this.room = room;
		this.logger = new ebg.scriptlogger("webrtc", ajaxCall, "[P" + this.player_id + "@" + this.room + "]");
		this.logger.log("(ebg.webrtc)      WebRTC object created for player " + this.player_id + " and room " + this.room);
		this.pcConfig = pcConfig;
		this.pcConstraints = pcConstraints;
		this.mediaConstraints = mediaConstraints;
		this.ajaxcall_callback = ajaxCall;
		this.getUserMediaSuccess_callback = r;
		this.getUserMediaError_callback = l;
		this.onJoinRoom_callback = d;
		this.onLeaveRoom_callback = c;

		g_sitecore.recordMediaStats(this.player_id, "start");
	}

	isInRoom(player_id: BGA.ID): boolean {
		for (let i = 0; i < this.in_room.length; i++) {
			if (player_id == this.in_room[i]) {
				this.logger.log("(ebg.webrtc)      Player " + player_id + " is in the room");
				return true;
			}
		}
		this.logger.log("(ebg.webrtc)      Player " + player_id + " is not in the room");
		return false;
	}

	addToRoom(player_id: BGA.ID): void {
		this.logger.log("(ebg.webrtc)      Player " + player_id + " is added to the room");
		this.in_room.push(player_id);
	}

	removeFromRoom(player_id: BGA.ID): boolean {
		this.logger.log("(ebg.webrtc)      Player " + player_id + " is removed from the room");
		for (let i = 0; i < this.in_room.length; i++) {
			if (player_id == this.in_room[i]) {
				this.in_room.splice(i);
				return true;
			}
		}
		return false;
	}

	setMediaConstraints(mediaConstraints: BGA.WebRTCMediaConstraints): void {
		this.logger.log("(ebg.webrtc)      Setting the following media constraints " + JSON.stringify(mediaConstraints));
		this.mediaConstraints = mediaConstraints;
	}

	setLocalFeed(localVideo: HTMLVideoElement): void {
		this.logger.log("(ebg.webrtc)      Setting the local feed with the following HTML video node: " + localVideo.id);
		this.localVideo = localVideo;
		this.doGetUserMedia();
	}

	doGetUserMedia(): void {
		if (this.mediaConstraints.video !== false || this.mediaConstraints.audio !== false) {
			try {
				// @ts-ignore - for some reason, navigator does not have getUserMedia
				navigator.getUserMedia(
					this.mediaConstraints,
					dojo.hitch(this as WebRTC_Template, "onUserMediaSuccess"),
					dojo.hitch(this as WebRTC_Template, "onUserMediaError"));
				this.logger.log("(ebg.webrtc)      Requested access to local media with mediaConstraints: " + JSON.stringify(this.mediaConstraints));
			} catch (e) {
				this.logger.log("(ebg.webrtc)      getUserMedia() call failed with exception " + JSON.stringify(e));
				this.logger.flush();
				this.getUserMediaError_callback();
			}
		} else {
			this.logger.log("(ebg.webrtc)      According to media constraints, no media to get: aborting getUserMedia");
		}
	}

	onUserMediaSuccess(stream: MediaStream & { stop: Function }): void {
		this.logger.log("(ebg.webrtc)      User has granted access to local media");
		this.localVideo!.srcObject = stream;
		// @ts-ignore - stream.getTracks will always return true
		if (!stream.stop && stream.getTracks) {
			stream.stop = function () {
				this.getTracks().forEach(function (track: MediaStreamTrack) {
					track.stop();
				});
			};
		}
		this.localStream = stream;
		this.getUserMediaSuccess_callback();
	}

	onUserMediaError(error: Error): void {
		this.logger.log("(ebg.webrtc)      Failed to get access to local media with error: " + JSON.stringify(error));
		this.logger.flush();
		this.getUserMediaError_callback();
	}

	maybeConnect(player_id: BGA.ID, is_new: boolean): void {
		if (this.connections[player_id] === undefined) {
			this.connections[player_id] = new ebg.peerconnect(player_id, this.pcConfig, this.pcConstraints, this.mediaConstraints, this.stereo, this.localStream!, this.logger, dojo.hitch(this as WebRTC_Template, "sendPlayerMessage"));
		}
		if (is_new === false) {
			if (this.player_id > player_id) {
				this.connections[player_id]!.doCall();
			}
			if (this.player_id < player_id) {
				this.connections[player_id]!.requestCall();
			}
		}
	}

	hangup(): void {
		this.logger.log("(ebg.webrtc)      Hanging up & closing all connections");
		if (this.localStream !== null) {
			this.localStream.stop();
			this.localStream = null;
		}
		for (let i = 0; i < this.in_room.length; i++) {
			const player_id = this.in_room[i]!;
			if (this.connections[player_id] !== undefined) {
				this.logger.log("(ebg.webrtc)      Closing connection with player " + player_id);
				g_sitecore.recordMediaStats(player_id, "stop");
				this.connections[player_id]!.stop();
				(this.connections as any).splice(player_id);
			} else {
				this.logger.log("(ebg.webrtc)      No current connection with player " + player_id);
			}
		}
		g_sitecore.recordMediaStats(this.player_id, "stop");
		this.sendRoomMessage("bye");
		this.logger.flush();
	}

	handleRemoteHangup(player_id: BGA.ID): void {
		this.logger.log("(ebg.webrtc)      Player " + player_id + " signaled remote hang up on his end");
		if (this.connections[player_id] !== undefined) {
			this.logger.log("(ebg.webrtc)      Closing connection with player " + player_id);
			this.connections[player_id]!.stop();
			(this.connections as any).splice(player_id);
		} else {
			this.logger.log("(ebg.webrtc)      No current connection with player " + player_id);
		}
		g_sitecore.recordMediaStats(player_id, "stop");
		this.onLeaveRoom_callback(player_id);
	}

	toggleVideoMute(player_id: BGA.ID): boolean {
		let stream: MediaStream | null = null;
		if (player_id == this.player_id) {
			stream = this.localStream;
		} else if (this.connections[player_id] !== undefined) {
			stream = this.connections[player_id]!.remoteStream;
		}
		if (stream === null) {
			this.logger.log("(ebg.webrtc)      No video stream to mute for player " + player_id + ": aborting");
			return true;
		}
		const videoTracks = stream.getVideoTracks();
		if (videoTracks.length === 0) {
			this.logger.log("(ebg.webrtc)      No local video available: aborting");
			return true;
		}
		if (this.isVideoMuted) {
			for (let i = 0; i < videoTracks.length; i++) {
				videoTracks[i]!.enabled = true;
			}
			this.logger.log("(ebg.webrtc)      Video unmuted");
		} else {
			for (let i = 0; i < videoTracks.length; i++) {
				videoTracks[i]!.enabled = false;
			}
			this.logger.log("(ebg.webrtc)      Video muted");
		}
		this.isVideoMuted = !this.isVideoMuted;
		return this.isVideoMuted;
	}

	toggleAudioMute(player_id?: BGA.ID): boolean {
		let stream: MediaStream | null = null;
		if (player_id == this.player_id) {
			stream = this.localStream;
		}
		// @ts-ignore - player_id indirectly check for undefined here.
		else if (this.connections[player_id] !== undefined) {
			stream = this.connections[player_id!]!.remoteStream;
		}
		if (stream === null) {
			this.logger.log("(ebg.webrtc)      No audio stream to mute for player " + player_id + ": aborting");
			return true;
		}
		const audioTracks = stream.getAudioTracks();
		if (audioTracks.length === 0) {
			this.logger.log("(ebg.webrtc)      No local audio available: aborting");
			return true;
		}
		if (this.isAudioMuted) {
			for (let i = 0; i < audioTracks.length; i++) {
				audioTracks[i]!.enabled = true;
			}
			this.logger.log("(ebg.webrtc)      Audio unmuted");
		} else {
			for (let i = 0; i < audioTracks.length; i++) {
				audioTracks[i]!.enabled = false;
			}
			this.logger.log("(ebg.webrtc)      Audio muted");
		}
		this.isAudioMuted = !this.isAudioMuted;
		return this.isAudioMuted;
	}

	sendPlayerMessage(player_id: number, message: any): void {
		this.logger.log("(ebg.webrtc)      Client sending player message " + JSON.stringify(message));
		message = JSON.stringify(message);
		this.ajaxcall_callback("/videochat/videochat/relayPlayerMessage.html", { player_id: player_id, room: this.room, message: message, lock: false }, this, function () {}, function () {}, "post");
	}

	sendRoomMessage(message: any): void {
		this.logger.log("(ebg.webrtc)      Client sending room message " + JSON.stringify(message));
		message = JSON.stringify(message);
		this.ajaxcall_callback("/videochat/videochat/relayRoomMessage.html", { room: this.room, message: message, lock: false }, this, function () {}, function () {});
	}

	onMessageReceived(message: { from: BGA.ID, to: BGA.ID, message: any }): void {
		if (this.localStream !== null) {
			if (this.player_id == message.to) {
				const from = message.from;
				const data = JSON.parse(message.message);
				this.logger.log("(ebg.webrtc)      Client received message from player " + from + ": " + JSON.stringify(data));
				if (!this.isInRoom(from) && data !== "bye") {
					this.onJoinRoom_callback(from, true);
				}
				if (this.connections[from] !== undefined) {
					if (data === "bye") {
						this.handleRemoteHangup(from);
					} else {
						this.connections[from]!.handleMessage(data);
					}
				} else {
					this.logger.log("(ebg.webrtc)      Message received but no connection with player " + from + " (should never happen)");
				}
			} else {
				this.logger.log("(ebg.webrtc)      Received message dropped (destined to another player" + message.to + ")");
			}
		} else {
			this.logger.log("(ebg.webrtc)      Received message dropped (no localStream)");
		}
	}
}

let WebRTC = declare("ebg.webrtc", WebRTC_Template);
export = WebRTC;

declare global {
	namespace BGA {
		type WebRTC = typeof WebRTC;
		interface EBG { webrtc: WebRTC; }
	}
	var ebg: BGA.EBG;
}