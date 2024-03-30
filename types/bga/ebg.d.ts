/**
 * A namespace that represents the module's defined by BGA. All components below, should always be defined within the game specific 'define' function as a dependency if they are used.
 */
declare namespace ebg {
	/** Defines the module that the game needs to be defined inside by using the dojo 'define' function. */
	namespace core {
		/** Creates a new gamegui. This should only ever be used in the 'define' function. */
		const gamegui: new () => Gamegui;
	}

	/** Creates a new {@link Counter}. */
	const counter: new () => Counter;

	/** Creates a new {@link Draggable}. */
	const draggable: new () => Draggable;

	/** Creates a new {@link PopInDialog}. */
	const popindialog: new () => PopInDialog;

	/** Creates a new {@link Resizable}. */
	const resizable: new () => Resizable;

	/** Creates a new {@link ScrollMap}. */
	const scrollmap: new () => ScrollMap;

	/** Creates a new {@link Stock}. */
	const stock: new () => Stock;

	/** Creates a new {@link Zone}. */
	const zone: new () => Zone;

	/** Creates a new {@link ChatInput}. */
	const chatinput: new () => ChatInput;

	/** Creates a new {@link PaymentButtons}. */
	const paymentbuttons: new () => PaymentButtons;

	/** Creates a new {@link PageHeader}. */
	const pageheader: new () => PageHeader;

	/** Creates a new {@link Thumb}. */
	const thumb: new () => Thumb;

	/** Creates a new {@link TableResults}. */
	const tableresults: new () => TableResults;
}