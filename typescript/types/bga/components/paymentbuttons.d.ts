/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/paymentbuttons must be included in the define as a dependency.
 */
interface PaymentButtons {
	create: (game: Gamegui) => void;
}

declare module "ebg/paymentbuttons" {
	const PaymentButtons: new () => PaymentButtons;
	export = PaymentButtons;
}