import "dojo";
import "dojo/_base/declare";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class WebPush {

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<WebPush>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<WebPush>['createSubclass'];
}

interface WebPush extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { webpush: typeof WebPush; }
	interface Window { ebg: EBG; }
}

export = WebPush;