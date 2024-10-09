// @ts-nocheck

import dojo = require("dojo");
import declare = require("dojo/_base/declare");

type ScriptLogger = InstanceType<typeof import("ebg/scriptlogger")>;

class PeerConnect_Template {
	peerId: BGA.ID;
	localStream: MediaStream;
	remoteVideo: HTMLVideoElement | null = null;
	remoteStream: MediaStream | null = null;
	pc: RTCPeerConnection | null = null;
	started: boolean = false;
	logger: ScriptLogger;
	sendPlayerMessage_callback: unknown;
	pcConfig: RTCConfiguration;
	pcConstraints: RTCConfiguration;
	mediaConstraints: MediaStreamConstraints;
	stereo: boolean;
	offerConstraints: RTCOfferOptions = { mandatory: {}, optional: [] };
	sdpConstraints: RTCOfferOptions = {
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true,
		},
	};

	constructor(
		peerId: BGA.ID,
		pcConfig: RTCConfiguration,
		pcConstraints: any,
		mediaConstraints: MediaStreamConstraints,
		stereo: boolean,
		localStream: MediaStream,
		logger: ScriptLogger,
		sendPlayerMessage_callback: any
	) {
		this.peerId = peerId;
		this.localStream = localStream;
		this.logger = logger;
		this.sendPlayerMessage_callback = sendPlayerMessage_callback;
		this.pcConfig = pcConfig;
		this.pcConstraints = pcConstraints;
		this.mediaConstraints = mediaConstraints;
		this.stereo = stereo;
	}

	maybeStart() {
		if (!this.started) {
			this.logger.log("(ebg.peerconnect) Starting peer connection...");
			this.pc = this.createPeerConnection();
			if (this.pc) {
				try {
					this.pc.addStream(this.localStream);
				} catch (e: any) {
					this.logger.log("(ebg.peerconnect) PeerConnection.addStream failed with exception: " + e.message + (e.stack ? " | " + e.stack : "")
					);
					this.logger.flush();
				}
				this.started = true;
				this.logger.log(
					"(ebg.peerconnect) Peer connection started"
				);
			} else
				this.logger.log(
					"(ebg.peerconnect) Peer connection failed"
				);
		} else
			this.logger.log(
				"(ebg.peerconnect) Peer connection already started"
			);
	}

	requestCall() {
		this.logger.log(
			"(ebg.peerconnect) Sending call request to peer " +
				this.peerId
		);
		this.sendPlayerMessage_callback(
			this.peerId,
			"new client requesting offer"
		);
	}

	doCall() {
		this.maybeStart();
		if (this.started) {
			const constraints = this.mergeConstraints(
				this.offerConstraints,
				this.sdpConstraints
			);
			this.logger.log(
				"(ebg.peerconnect) Sending offer to peer " +
					this.peerId +
					", with constraints " +
					JSON.stringify(constraints)
			);
			try {
				this.pc.createOffer(
					dojo.hitch(this, "setLocalSessionDescription"),
					dojo.hitch(this, "handleCreateOfferError"),
					constraints
				);
			} catch (e: any) {
				this.logger.log(
					"(ebg.peerconnect) PeerConnection.createOffer failed with exception: " +
						e.message +
						(e.stack ? " | " + e.stack : "")
				);
				this.logger.flush();
			}
		}
	}

	mergeConstraints(e: RTCOfferOptions, t: RTCOfferOptions) {
		const constraints = e;
		for (const key in t.mandatory)
			constraints.mandatory[key] = t.mandatory[key];
		constraints.optional.concat(t.optional);
		return constraints;
	}

	handleCreateOfferError(e: any) {
		try {
			this.logger.log(
				"(ebg.peerconnect) Create offer error: " +
					JSON.stringify(e)
			);
		} catch (t: any) {
			this.logger.log(
				"(ebg.peerconnect) Exception raised while logging handleCreateOfferError: " +
					t.message
			);
		}
		this.logger.flush();
	}

	doAnswer() {
		if (this.started) {
			this.logger.log(
				"(ebg.peerconnect) Sending answer to peer " +
					this.peerId
			);
			try {
				this.pc.createAnswer(
					dojo.hitch(this, "setLocalSessionDescription"),
					dojo.hitch(this, "onCreateAnswerError"),
					this.sdpConstraints
				);
			} catch (e: any) {
				this.logger.log(
					"(ebg.peerconnect) PeerConnection.createAnswer failed with exception: " +
						e.message +
						(e.stack ? " | " + e.stack : "")
				);
				this.logger.flush();
			}
		} else
			this.logger.log(
				"(ebg.peerconnect) Connection must be started before sending an answer"
			);
	}

	onCreateAnswerError(e: any) {
		this.logger.log(
			"(ebg.peerconnect) Create answer error: " +
				JSON.stringify(e)
		);
		this.logger.flush();
	}

	stop() {
		if (this.started) {
			this.logger.log(
				"(ebg.peerconnect) Closing peer connection..."
			);
			this.started = false;
			this.getConnectionDetails(this.pc).then(
				dojo.hitch(this, function (e) {
					this.logger.log(
						"(ebg.peerconnect) ICE connection details: " +
							JSON.stringify(e)
					);
					this.logger.flush();
				})
			);
			try {
				this.pc.close();
			} catch (e: any) {
				this.logger.log(
					"(ebg.peerconnect) PeerConnection.close failed with exception: " +
						e.message +
						(e.stack ? " | " + e.stack : "")
				);
				this.logger.flush();
			} finally {
				this.pc = null;
				this.logger.log(
					"(ebg.peerconnect) Peer connection closed"
				);
			}
		} else
			this.logger.log(
				"(ebg.peerconnect) Connection must be started before stopping it"
			);
	}

	handleMessage(t: any) {
		this.logger.log(
			"(ebg.peerconnect) Client handling message from player " +
				this.peerId +
				": " +
				JSON.stringify(t)
		);
		if (null === t)
			this.logger.log(
				"(ebg.peerconnect) Message is null"
			);
		else if ("new client requesting offer" === t) {
			this.logger.log(
				"(ebg.peerconnect) Request received, sending an offer"
			);
			this.started && this.stop();
			this.maybeStart();
			this.doCall();
		} else if ("offer" === t.type) {
			this.logger.log(
				"(ebg.peerconnect) Registering offer and sending an answer"
			);
			this.started && this.stop();
			this.maybeStart();
			if (this.started) {
				if (this.stereo) {
					t.sdp = addStereo(t.sdp);
					t.sdp = maybePreferAudioSendCodec(t.sdp);
				}
				try {
					this.pc.setRemoteDescription(
						new RTCSessionDescription(t),
						dojo.hitch(
							this,
							"onSetRemoteSessionDescriptionSuccess"
						),
						dojo.hitch(
							this,
							"onSetRemoteSessionDescriptionError"
						)
					);
				} catch (n: any) {
					this.logger.log(
						"(ebg.peerconnect) PeerConnection.setRemoteDescription failed with exception: " +
							n.message +
							(n.stack ? " | " + n.stack : "")
					);
					this.logger.flush();
				}
				this.doAnswer();
			} else
				this.logger.log(
					"(ebg.peerconnect) No peerconnection available. Aborting."
				);
		} else if ("answer" === t.type) {
			this.logger.log(
				"(ebg.peerconnect) Registering answer"
			);
			if (this.started) {
				if (this.stereo) {
					t.sdp = addStereo(t.sdp);
					t.sdp = maybePreferAudioSendCodec(t.sdp);
				}
				try {
					this.pc.setRemoteDescription(
						new RTCSessionDescription(t),
						dojo.hitch(
							this,
							"onSetRemoteSessionDescriptionSuccess"
						),
						dojo.hitch(
							this,
							"onSetRemoteSessionDescriptionError"
						)
					);
				} catch (n: any) {
					this.logger.log(
						"(ebg.peerconnect) PeerConnection.setRemoteDescription failed with exception: " +
							n.message +
							(n.stack ? " | " + n.stack : "")
					);
					this.logger.flush();
				}
			} else
				this.logger.log(
					"(ebg.peerconnect) No peerconnection available. Aborting."
				);
		} else if ("candidate" === t.type) {
			this.logger.log(
				"(ebg.peerconnect) Registering candidate"
			);
			if (this.started) {
				const i = new RTCIceCandidate({
					sdpMLineIndex: t.label,
					candidate: t.candidate,
				});
				try {
					this.pc.addIceCandidate(
						i,
						dojo.hitch(
							this,
							"onAddIceCandidateSuccess"
						),
						dojo.hitch(this, "onAddIceCandidateError")
					);
				} catch (n: any) {
					this.logger.log(
						"(ebg.peerconnect) PeerConnection.addIceCandidate failed with exception: " +
							n.message +
							(n.stack ? " | " + n.stack : "")
					);
					this.logger.flush();
				}
			} else
				this.logger.log(
					"(ebg.peerconnect) No peerconnection available. Aborting."
				);
		} else
			this.logger.log(
				"(ebg.peerconnect) Unknown message type"
			);
	}

	onSetLocalSessionDescriptionSuccess() {
		this.logger.log(
			"(ebg.peerconnect) Set local session description successfully"
		);
		!webrtcConfig.iceTricklingEnabled &&
			this.sendLocalSessionDescription();
	}

	onSetLocalSessionDescriptionError(e: any) {
		this.logger.log(
			"(ebg.peerconnect) Failed to set local session description with error: " +
				JSON.stringify(e)
		);
		this.logger.flush();
	}

	onSetRemoteSessionDescriptionSuccess() {
		this.logger.log(
			"(ebg.peerconnect) Set remote session description successfully"
		);
	}

	onSetRemoteSessionDescriptionError(e: any) {
		this.logger.log(
			"(ebg.peerconnect) Failed to set remote session description with error: " +
				JSON.stringify(e)
		);
		this.logger.flush();
	}

	onAddIceCandidateSuccess() {
		this.logger.log(
			"(ebg.peerconnect) Added ice candidate successfully"
		);
	}

	onAddIceCandidateError(e: any) {
		this.logger.log(
			"(ebg.peerconnect) Failed to add ice candidate with error: " +
				JSON.stringify(e)
		);
		this.logger.flush();
	}

	createPeerConnection() {
		let pc = null;
		try {
			pc = new RTCPeerConnection(
				this.pcConfig,
				this.pcConstraints
			);
			pc.onicecandidate = dojo.hitch(
				this,
				"handleIceCandidate"
			);
			pc.onaddstream = dojo.hitch(
				this,
				"handleRemoteStreamAdded"
			);
			pc.onremovestream = dojo.hitch(
				this,
				"handleRemoteStreamRemoved"
			);
			pc.onsignalingstatechange = dojo.hitch(
				this,
				"onSignalingStateChanged"
			);
			pc.oniceconnectionstatechange = dojo.hitch(
				this,
				"onIceConnectionStateChanged"
			);
			const config = JSON.parse(
				JSON.stringify(this.pcConfig)
			);
			for (let i = 0; i < config.iceServers.length; i++)
				if (config.iceServers[i].credential) {
					config.iceServers[i].username = "********";
					config.iceServers[i].credential = "********";
				}
			this.logger.log(
				"(ebg.peerconnect) Created RTCPeerConnnection with config " +
					JSON.stringify(config) +
					" and constraints " +
					JSON.stringify(this.pcConstraints)
			);
		} catch (e: any) {
			this.logger.log(
				"(ebg.peerconnect) Failed to create PeerConnection with exception: " +
					e.message +
					(e.stack ? " | " + e.stack : "")
			);
			this.logger.flush();
			alert(
				"Error: failed to create the audio/video connection. Maybe you are using Edge? To use audio/video on BGA, we recommend Firefox or Chrome."
			);
		}
		return pc;
	}

	handleIceCandidate(e: RTCPeerConnectionIceEvent) {
		if (!e.candidate) {
			this.logger.log(
				"(ebg.peerconnect) End of candidates"
			);
			!webrtcConfig.iceTricklingEnabled &&
				this.sendLocalSessionDescription();
		} else if (webrtcConfig.iceTricklingEnabled) {
			this.logger.log(
				"(ebg.peerconnect) Handling ICE candidate"
			);
			this.sendPlayerMessage_callback(this.peerId, {
				type: "candidate",
				label: e.candidate.sdpMLineIndex,
				id: e.candidate.sdpMid,
				candidate: e.candidate.candidate,
			});
		}
	}

	handleRemoteStreamAdded(e: RTCTrackEvent) {
		this.logger.log(
			"(ebg.peerconnect) Remote stream added"
		);
		this.remoteVideo = $("videofeed_" + this.peerId);
		if (this.remoteVideo) {
			this.remoteVideo.srcObject = e.streams[0];
			this.remoteStream = e.streams[0];
		} else
			this.logger.log(
				"(ebg.peerconnect) No remote video object available. Aborting."
			);
	}

	handleRemoteStreamRemoved(e: RTCTrackEvent) {
		this.logger.log(
			"(ebg.peerconnect) Remote stream removed"
		);
	}

	onSignalingStateChanged(e: Event) {
		if (this.pc)
			this.logger.log(
				"(ebg.peerconnect) Signaling state changed to: " +
					this.pc.signalingState
			);
		else
			this.logger.log(
				"(ebg.peerconnect) onSignalingStateChanged fired, but peerconnect object is null!"
			);
	}

	onIceConnectionStateChanged(e: Event) {
		if (this.pc) {
			this.logger.log(
				"(ebg.peerconnect) ICE connection state changed to: " +
					this.pc.iceConnectionState
			);
			if (
				"connected" == this.pc.iceConnectionState ||
				"completed" == this.pc.iceConnectionState
			) {
				this.getConnectionDetails(this.pc).then(
					e.hitch(this, function (e) {
						this.logger.log(
							"(ebg.peerconnect) ICE connection details: " +
								JSON.stringify(e)
						);
						this.logger.flush();
					})
				);
				if (
					$("videofeed_" + this.peerId + "_spk")
				) {
					e.addClass(
						$("videofeed_" + this.peerId + "_spk"),
						"rtc_video_spk_on"
					);
					e.removeClass(
						$("videofeed_" + this.peerId + "_spk"),
						"rtc_video_spk_off"
					);
				}
				if (
					$("videofeed_" + this.peerId + "_cam")
				) {
					e.addClass(
						$("videofeed_" + this.peerId + "_cam"),
						"rtc_video_cam_on"
					);
					e.removeClass(
						$("videofeed_" + this.peerId + "_cam"),
						"rtc_video_cam_off"
					);
				}
			} else {
				if (
					$("videofeed_" + this.peerId + "_spk")
				) {
					e.addClass(
						$("videofeed_" + this.peerId + "_spk"),
						"rtc_video_spk_off"
					);
					e.removeClass(
						$("videofeed_" + this.peerId + "_spk"),
						"rtc_video_spk_on"
					);
				}
				if (
					$("videofeed_" + this.peerId + "_cam")
				) {
					e.addClass(
						$("videofeed_" + this.peerId + "_cam"),
						"rtc_video_cam_off"
					);
					e.removeClass(
						$("videofeed_" + this.peerId + "_cam"),
						"rtc_video_cam_on"
					);
				}
			}
		} else
			this.logger.log(
				"(ebg.peerconnect) onIceConnectionStateChanged fired, but peerconnect object is null!"
			);
	}

	getConnectionDetails(e: RTCPeerConnection) {
		const details: any = {};
		if (window.chrome) {
			const keys = [
				"googLocalAddress",
				"googLocalCandidateType",
				"googRemoteAddress",
				"googRemoteCandidateType",
				"bytesReceived",
				"bytesSent",
			];
			return new Promise(function (resolve, reject) {
				e.getStats(function (stats) {
					const result = stats.result().filter(function (e) {
						return e.stat("googActiveConnection") == "true";
					})[0];
					if (!result) return reject("Something is wrong...");
					keys.forEach(function (key) {
						details[key.replace("goog", "")] = result.stat(key);
					});
					resolve(details);
				});
			});
		}
		return e.getStats(null).then(function (stats) {
			const selected = Object.keys(stats).filter(function (key) {
				return stats[key].selected;
			})[0];
			const local = stats[selected.localCandidateId];
			const remote = stats[selected.remoteCandidateId];
			details.LocalAddress = [local.ipAddress, local.portNumber].join(
				":"
			);
			details.RemoteAddress = [remote.ipAddress, remote.portNumber].join(
				":"
			);
			details.LocalCandidateType = local.candidateType;
			details.RemoteCandidateType = remote.candidateType;
			details.bytesReceived = selected.bytesReceived;
			details.bytesSent = selected.bytesSent;
			return details;
		});
	}

	setLocalSessionDescription(t: RTCSessionDescriptionInit) {
		try {
			this.pc.setLocalDescription(
				t,
				dojo.hitch(
					this,
					"onSetLocalSessionDescriptionSuccess"
				),
				dojo.hitch(
					this,
					"onSetLocalSessionDescriptionError"
				)
			);
		} catch (e: any) {
			this.logger.log(
				"(ebg.peerconnect) PeerConnection.setLocalDescription failed with exception: " +
					e.message +
					(e.stack ? " | " + e.stack : "")
			);
			this.logger.flush();
		}
	}

	sendLocalSessionDescription() {
		this.logger.log(
			"(ebg.peerconnect) Sending message with session description " +
				JSON.stringify(this.pc.localDescription)
		);
		this.sendPlayerMessage_callback(
			this.peerId,
			this.pc.localDescription
		);
	}
}

let PeerConnect = declare("ebg.peerconnect", PeerConnect_Template);
export = PeerConnect;

declare global {
	namespace BGA {
		type PeerConnect = typeof PeerConnect;
		interface EBG { peerconnect: PeerConnect; }
	}
	var ebg: BGA.EBG;
}