import "dojo";
import "dojo/_base/declare";
import "ebg/thumb";
import "ebg/core/core";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class TableResults {
	create(...args: any[]): any;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<TableResults>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<TableResults>['createSubclass'];
}

interface TableResults extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { tableresults: typeof TableResults; }
	interface Window { ebg: EBG; }
}

export = TableResults;