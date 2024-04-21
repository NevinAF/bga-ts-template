import "dojo";
import "dojo/_base/declare";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class Wrapper {
	create(...args: any[]): any;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<Wrapper>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<Wrapper>['createSubclass'];
}

interface Wrapper extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { wrapper: typeof Wrapper; }
	interface Window { ebg: EBG; }
}

export = Wrapper;