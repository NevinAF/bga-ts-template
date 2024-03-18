/**
 * A helper class for creating and managing pop-in dialogs. See {@link https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js#Generic_Dialogs | yourgamename.js: Generic Dialogs} for more information.
 */
interface PopInDialog
{
	/** Callback for when the dialog is shown. */
	onShow?: () => any | null;

	/** Callback for when the dialog is hidden. This is not called when the dialog is destroyed. */
	onHide?: () => any | null;

	/**
	 * If the dialog is created and the display is not set to none, this will reshow the dialog, forcing a reposition.
	 */
	adjustSizeAndPosition: () => void;

	/**
	 * Creates the dialog div in a hidden state. This should only be called once and used as an initializer for the dialog.
	 * @param id The unique id of the dialog.
	 * @param container_div where this dialog should be created. This will block all input and add a lighten the entire container. If this value is not set, the dialog will be created on the 'main-content' if it exists, or the 'left-side' otherwise.
	 */
	create: (id: string, container_div?: string | HTMLElement) => void;

	/**
	 * Destroys all components created for the dialog and removes the dialog from the DOM.
	 * @param animate If true, the dialog will fade out before being removed.
	 */
	destroy: (animate?: boolean) => void;

	/**
	 * Replaces the 'onclick' event for the dialog's close button with the provided function. This will not have any impact if the close button was hidden using {@link hideCloseIcon}.
	 * @param callback The function to call when the close button is clicked.
	 */
	setCloseCallback: (callback: (event: MouseEvent) => any) => void;

	/**
	 * Hides the close icon. This dialog will not be closable except through game specific code. It is always recommended to provide buttons or other methods to close the dialog so the user isn't completely stuck in a dialog.
	 */
	hideCloseIcon: () => void;

	/**
	 * Sets the inner html of the title on the dialog.
	 * @param title The html to set the title to.
	 */
	setTitle: (title: string) => void;

	/**
	 * Sets the maximum width of the dialog by setting the 'maxWidth' css property.
	 * @param maxWidth The maximum width of the dialog in pixels.
	 */
	setMaxWidth: (maxWidth: number) => void;

	/**
	 * Sets the help link for this dialog. This will also show the help icon if it was previously not set. This will set the 'href' attribute of the help icon to the provided link.
	 * @param link The link to the help page for this dialog.
	 */
	setHelpLink: (link: string) => void;

	/**
	 * Sets the inner html of the dialog.
	 * @param content The html to set the dialog to.
	 */
	setContent: (content: string) => void;

	/**
	 * Shows the dialog. If the dialog was not created, this will create the dialog and show it.
	 * @param animate If true, the dialog will fade in when shown.
	 */
	show: (animate?: boolean) => void;

	/**
	 * Hides the dialog. If the dialog was not created, this will do nothing.
	 * @param animate If true, the dialog will fade out when hidden.
	 */
	hide: (animate?: boolean) => void;
}