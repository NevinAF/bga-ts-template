import "dojo";
import "dojo/_base/declare";
import "ebg/peerconnect";
import "ebg/scriptlogger";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class WebRTC {

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<WebRTC>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<WebRTC>['createSubclass'];
}

interface WebRTC extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { webrtc: typeof WebRTC; }
	interface Window { ebg: EBG; }
}

export = WebRTC;