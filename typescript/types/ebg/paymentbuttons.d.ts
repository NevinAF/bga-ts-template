import "dojo";
import "dojo/_base/declare";
import "svelte/index";
import "ebg/expandablesection";
import "ebg/comboajax";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class PaymentButtons {
	create(...args: any[]): any;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<PaymentButtons>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<PaymentButtons>['createSubclass'];
}

interface PaymentButtons extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { paymentbuttons: typeof PaymentButtons; }
	interface Window { ebg: EBG; }
}

export = PaymentButtons;