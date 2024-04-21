import "dojo";
import "dojo/_base/declare";
import "dijit/form/FilteringSelect";
import "dojox/data/QueryReadStore";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class ComboAjax {
	create(...args: any[]): any;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<ComboAjax>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<ComboAjax>['createSubclass'];
}

interface ComboAjax extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { ComboAjax: typeof ComboAjax; }
	interface Window { ebg: EBG; }
}

export = ComboAjax;
