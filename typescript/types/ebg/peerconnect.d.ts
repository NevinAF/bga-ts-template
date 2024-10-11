declare class PeerConnect_Template {
    peerId: BGA.ID;
    localStream: MediaStream;
    remoteVideo: HTMLVideoElement | null;
    remoteStream: MediaStream | null;
    pc: RTCPeerConnection | null;
    started: boolean;
    logger: InstanceType<BGA.ScriptLogger>;
    sendPlayerMessage_callback: unknown;
    pcConfig: RTCConfiguration;
    pcConstraints: RTCConfiguration;
    mediaConstraints: MediaStreamConstraints;
    stereo: boolean;
    offerConstraints: RTCOfferOptions;
    sdpConstraints: RTCOfferOptions;
    constructor(peerId: BGA.ID, pcConfig: RTCConfiguration, pcConstraints: any, mediaConstraints: MediaStreamConstraints, stereo: boolean, localStream: MediaStream, logger: InstanceType<BGA.ScriptLogger>, sendPlayerMessage_callback: any);
    maybeStart(): void;
    requestCall(): void;
    doCall(): void;
    mergeConstraints(e: RTCOfferOptions, t: RTCOfferOptions): RTCOfferOptions;
    handleCreateOfferError(e: any): void;
    doAnswer(): void;
    onCreateAnswerError(e: any): void;
    stop(): void;
    handleMessage(t: any): void;
    onSetLocalSessionDescriptionSuccess(): void;
    onSetLocalSessionDescriptionError(e: any): void;
    onSetRemoteSessionDescriptionSuccess(): void;
    onSetRemoteSessionDescriptionError(e: any): void;
    onAddIceCandidateSuccess(): void;
    onAddIceCandidateError(e: any): void;
    createPeerConnection(): RTCPeerConnection | null;
    handleIceCandidate(e: RTCPeerConnectionIceEvent): void;
    handleRemoteStreamAdded(e: RTCTrackEvent): void;
    handleRemoteStreamRemoved(e: RTCTrackEvent): void;
    onSignalingStateChanged(e: Event): void;
    onIceConnectionStateChanged(e: Event): void;
    getConnectionDetails(e: RTCPeerConnection): Promise<any>;
    setLocalSessionDescription(t: RTCSessionDescriptionInit): void;
    sendLocalSessionDescription(): void;
}
declare let PeerConnect: DojoJS.DojoClass<PeerConnect_Template, [peerId: BGA.ID, pcConfig: RTCConfiguration, pcConstraints: any, mediaConstraints: MediaStreamConstraints, stereo: boolean, localStream: MediaStream, logger: {
    logName: string;
    logBuffer: string | null;
    identifier: string;
    ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
    log(e: string): void;
    flush(): void;
} & DojoJS.DojoClassObject<{
    logName: string;
    logBuffer: string | null;
    identifier: string;
    ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
    log(e: string): void;
    flush(): void;
}>, sendPlayerMessage_callback: any]>;
export = PeerConnect;
declare global {
    namespace BGA {
        type PeerConnect = typeof PeerConnect;
        interface EBG {
            peerconnect: PeerConnect;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=peerconnect.d.ts.map