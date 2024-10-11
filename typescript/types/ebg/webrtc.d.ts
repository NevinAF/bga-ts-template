import "ebg/peerconnect";
import "ebg/scriptlogger";
declare global {
    namespace BGA {
        type RoomId = `T${number}` | `P${number}_${number}`;
        interface AjaxActions {
            "/videochat/videochat/relayPlayerMessage.html": {
                player_id: BGA.ID;
                room: BGA.RoomId;
                message: string;
            };
            "/videochat/videochat/relayRoomMessage.html": {
                room: BGA.RoomId;
                message: string;
            };
        }
        /** This is an extension of the {@link MediaStreamConstraints} interface that adds more properties to the video property. */
        interface WebRTCMediaConstraints {
            audio: boolean | MediaTrackConstraints;
            peerIdentity?: string;
            preferCurrentTab?: boolean;
            video: boolean | MediaTrackConstraints & {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: any[];
            };
        }
    }
}
declare class WebRTC_Template {
    player_id: BGA.ID;
    room: BGA.RoomId;
    in_room: BGA.ID[];
    logger: InstanceType<BGA.ScriptLogger>;
    connections: Record<BGA.ID, InstanceType<BGA.PeerConnect>>;
    pcConfig: RTCConfiguration;
    pcConstraints: RTCOfferOptions;
    mediaConstraints: BGA.WebRTCMediaConstraints;
    stereo: boolean;
    ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
    getUserMediaSuccess_callback: () => void;
    getUserMediaError_callback: () => void;
    onJoinRoom_callback: (player_id: BGA.ID, is_new: boolean) => void;
    onLeaveRoom_callback: (player_id: BGA.ID) => void;
    localVideo: HTMLVideoElement | null;
    localStream: MediaStream & {
        stop: Function;
    } | null;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    sdpConstraints: {
        mandatory: {
            OfferToReceiveAudio: boolean;
            OfferToReceiveVideo: boolean;
        };
    };
    constructor(player_id: BGA.ID, room: BGA.RoomId, pcConfig: RTCConfiguration, pcConstraints: RTCOfferOptions, mediaConstraints: BGA.WebRTCMediaConstraints, _: any, ajaxCall: InstanceType<BGA.CorePage>["ajaxcall"], r: () => void, l: () => void, d: (player_id: BGA.ID, is_new: boolean) => void, c: (player_id: BGA.ID) => void);
    isInRoom(player_id: BGA.ID): boolean;
    addToRoom(player_id: BGA.ID): void;
    removeFromRoom(player_id: BGA.ID): boolean;
    setMediaConstraints(mediaConstraints: BGA.WebRTCMediaConstraints): void;
    setLocalFeed(localVideo: HTMLVideoElement): void;
    doGetUserMedia(): void;
    onUserMediaSuccess(stream: MediaStream & {
        stop: Function;
    }): void;
    onUserMediaError(error: Error): void;
    maybeConnect(player_id: BGA.ID, is_new: boolean): void;
    hangup(): void;
    handleRemoteHangup(player_id: BGA.ID): void;
    toggleVideoMute(player_id: BGA.ID): boolean;
    toggleAudioMute(player_id?: BGA.ID): boolean;
    sendPlayerMessage(player_id: number, message: any): void;
    sendRoomMessage(message: any): void;
    onMessageReceived(message: {
        from: BGA.ID;
        to: BGA.ID;
        message: any;
    }): void;
}
declare let WebRTC: DojoJS.DojoClass<WebRTC_Template, [player_id: BGA.ID, room: BGA.RoomId, pcConfig: RTCConfiguration, pcConstraints: RTCOfferOptions, mediaConstraints: BGA.WebRTCMediaConstraints, _: any, ajaxCall: <Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined) => void, r: () => void, l: () => void, d: (player_id: BGA.ID, is_new: boolean) => void, c: (player_id: BGA.ID) => void]>;
export = WebRTC;
declare global {
    namespace BGA {
        type WebRTC = typeof WebRTC;
        interface EBG {
            webrtc: WebRTC;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=webrtc.d.ts.map