import "dojo";
import "dojo/_base/declare";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class ExpandableSection {

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<ExpandableSection>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<ExpandableSection>['createSubclass'];
}

interface ExpandableSection extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { expandablesection: typeof ExpandableSection; }
	interface Window { ebg: EBG; }
}

export = ExpandableSection;