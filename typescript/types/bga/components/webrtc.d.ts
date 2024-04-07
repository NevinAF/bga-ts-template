/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/webrtc must be included in the define as a dependency.
 */
interface WebRTC {
}

declare module "ebg/webrtc" {
	const WebRTC: new () => WebRTC;
	export = WebRTC;
}