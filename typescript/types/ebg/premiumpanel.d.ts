import "dojo";
import "dojo/_base/declare";
import "dojox/fx";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class PremiumPanel {
	create(...args: any[]): any;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<PremiumPanel>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<PremiumPanel>['createSubclass'];
}

interface PremiumPanel extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { premiumpanel: typeof PremiumPanel; }
	interface Window { ebg: EBG; }
}

export = PremiumPanel;