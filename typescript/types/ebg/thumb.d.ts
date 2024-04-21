import "dojo";
import "dojo/_base/declare";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class Thumb {
	create(...args: any[]): any;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<Thumb>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<Thumb>['createSubclass'];
}

interface Thumb extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { thumb: typeof Thumb; }
	interface Window { ebg: EBG; }
}

export = Thumb;