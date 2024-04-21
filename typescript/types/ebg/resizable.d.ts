import "dojo";
import "dojo/_base/declare";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class Resizable
{
	create(...args: any[]): any;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<Resizable>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<Resizable>['createSubclass'];
}

interface Resizable extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { resizable: typeof Resizable; }
	interface Window { ebg: EBG; }
}

export = Resizable;