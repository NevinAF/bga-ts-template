/// <reference path="index.ts" />

/**
 * @common The common module is a collection of wrappers and Gamegui-like methods that are directly defined on the cookbook page, and are recommended to be used in almost all games (sometimes depending on depth/complexity of the game).
 */
interface GameguiCookbook
{
	/**
	 * This method will attach mobile to a new_parent without destroying, unlike original attachToNewParent which destroys mobile and all its connectors (onClick, etc).
	 */
	attachToNewParentNoDestroy(mobile_in: string | HTMLElement, new_parent_in: string | HTMLElement, relation?: string | number, place_position?: string): dojo.DomGeometryBox;

	/**
	 * Typed `ajaxcallWrapper` method recommended by the BGA wiki. This method removes obsolete parameters, simplifies action url, and auto adds the lock parameter to the args if needed. This significantly reduces the amount of code needed to make an ajax call and makes the parameters much more readable.
	 * @param action The action to be called.
	 * @param args The arguments to be passed to the server for the action. This does not need to include the `lock` parameter, as it will be added automatically if needed.
	 * @param callback The callback to be called once a response is received from the server.
	 * @param ajax_method The method to use for the ajax call. See {@link Game.ajaxcall} for more information.
	 * @returns True if the action was called, false if the action was not called because it was not a valid player action (see {@link Game.checkAction}).
	 * @example
	 * // Arguments must match the arguments of the PlayerAction 'myAction'.
	 * this.ajaxAction( 'myAction', { myArgument1: arg1, myArgument2: arg2 }, (is_error) => {} );
	 */
	ajaxAction<T extends keyof PlayerActions>(action: T, args: PlayerActions[T] & { lock?: boolean | 'table' | 'player', action?: undefined, module?: undefined, class?: undefined }, callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any, ajax_method?: 'post' | 'get' | 'iframe'): boolean;

	/**
	 * Slightly simplified version of the dojo.subscribe method that is typed for notifications.
	 * @param event The event that you want to subscribe to.
	 * @param callback The callback to be called when the event is published. Note that the callback can be the same callback for multiple events as long as the expected parameters for the notifications are the same.
	 * @returns A handle that can be used to unsubscribe from the event. Not necessary to hold onto this handle if the subscription lasts for the lifetime of the game (or browser lifetime).
	 * @example
	 * setupNotifications() {
	 * 	this.subscribeNotif('cardPlayed', this.notif_cardPlayed);
	 * }
	 * // With any of the possible argument types for notifications
	 * notif_cardPlayed(notif: AnyNotif) { ... }
	 * // With manual argument type (must match a subset of the arguments for the 'cardPlayed' notification type)
	 * notif_cardPlayed(notif: Notif<{ player_id: number, card_id: number }>) { ... }
	 * // With defined argument type
	 * notif_cardPlayed(notif: Notif<NotifTypes['cardPlayed']>) { ... }
	 */
	subscribeNotif<T extends keyof NotifTypes>(event: T, callback: (notif: Notif<NotifTypes[T]>) => any): dojo.Handle;

	/**
	 * This method can be used instead of addActionButton, to add a button which is an image (i.e. resource). Can be useful when player
	 * need to make a choice of resources or tokens.
	 */
	addImageActionButton(id: string, label: string, method: string | Function, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none', tooltip?: string): HTMLElement;

	/** If the current game should never be interactive, i.e., the game is not in a playable/editable state. Returns true for spectators, instant replay (during game), archive mode (after game end). */
	isReadOnly(): boolean;

	/** Scrolls a target element into view after a delay. If the game is in instant replay mode, the scroll will be instant. */
	scrollIntoViewAfter(target: string | HTMLElement, delay?: number): void;

	/**
	 * Returns a URL for the player avatar image. If the avatar for the player id is not found (element with id `avatar_${playerId}`), then the default avatar picture will be returned.
	 * @param playerId The player id for the avatar.
	 * @param size The size of the avatar. Either 32 or 184. Defaults to 184.
	 * @returns The URL for the player avatar image.
	 */
	getPlayerAvatar(playerId: number | string, size?: '32' | '184'): string;

	/** Gets an html span with the text 'You' formatted and highlighted to match the default styling for `descriptionmyturn` messages with the word `You`. This does preform language translations. */
	divYou(): string;

	/**
	 * Gets an html span with the text `text` highlighted to match the default styling for the given player, like with the `description` messages that show on the title card.
	 * @param player_id The player id to get the color for.
	 * @param text The text to be highlighted. If undefined, the {@link Player.name} will be used instead.
	 */
	divColoredPlayer(player_id: number, text?: string): string;

	/**
	 * Sets the description of the main title card to the given html. This change is only visual and will be replaced on page reload or when the game state changes.
	 * @param html The html to set the main title to.
	 */
	setMainTitle(html: string): void;

	/**
	 * Sets the description of the main title card to the given string, formatted using the current {@link CurrentStateArgs.args}. This should only be changed when it is this players turn and you want to display a client only change while the client is making a decision.
	 * @param description The string to set the main title to.
	 */
	setDescriptionOnMyTurn(description: string): void;

	/**
	 * Creates a dialog with the message and title, and a single button that says "Ok". The dialog can only be closed by clicking the "Ok" button and will call the callback if it is provided.
	 * @param message The message to display in the dialog.
	 * @param title The title of the dialog.
	 * @param callback The callback to call when the "Ok" button is clicked.
	 * @returns The dialog that was created.
	 * @example
	 * this.infoDialog("You need to reload the page because the game is out of sync.", "Out of Sync", () => window.location.reload());
	 */
	infoDialog(message: string, title: string, callback?: () => any): PopInDialog
}

GameguiCookbook.prototype.attachToNewParentNoDestroy = function(this: GameguiCookbook, mobile_in: string | HTMLElement, new_parent_in: string | HTMLElement, relation?: string | number, place_position?: string): dojo.DomGeometryBox
{
	const mobile = $(mobile_in);
	const new_parent = $(new_parent_in);

	let src = dojo.position(mobile);
	if (place_position)
		mobile.style.position = place_position;
	dojo.place(mobile, new_parent, relation);
	mobile.offsetTop;//force re-flow
	let tgt = dojo.position(mobile);
	let box = dojo.marginBox(mobile);
	let cbox = dojo.contentBox(mobile);

	if (!box.t || !box.l || !box.w || !box.h || !cbox.w || !cbox.h) {
		console.error("attachToNewParentNoDestroy: box or cbox has an undefined value (t-l-w-h). This should not happen.");
		return box;
	}

	let left = box.l + src.x - tgt.x;
	let top = box.t + src.y - tgt.y;

	mobile.style.position = "absolute";
	mobile.style.left = left + "px";
	mobile.style.top = top + "px";
	box.l += box.w - cbox.w;
	box.t += box.h - cbox.h;
	mobile.offsetTop;//force re-flow
	return box;
}

GameguiCookbook.prototype.ajaxAction = function<T extends keyof PlayerActions>(this: GameguiCookbook, action: T, args: PlayerActions[T] & { lock?: true | 'table' | 'player', action?: undefined, module?: undefined, class?: undefined }, callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any, ajax_method?: 'post' | 'get'): boolean
{
	if (!this.checkAction(action))
		return false;

	if (!args)
		args = {} as any;

	// @ts-ignore - Prevents error when no PlayerActions are defined.
	if (!args.lock) args.lock = true;

	this.ajaxcall(
		`/${this.game_name}/${this.game_name}/${action}.html`,
		// @ts-ignore - Prevents error when no PlayerActions are defined and stating that 'lock' might not be defined.
		args,
		this, () => {}, callback, ajax_method
	);

	return true;
}

GameguiCookbook.prototype.subscribeNotif = function<T extends keyof NotifTypes>(this: GameguiCookbook, event: T, callback: (notif: Notif<NotifTypes[T]>) => any): dojo.Handle
{
	return dojo.subscribe(event, this, callback);
}

GameguiCookbook.prototype.addImageActionButton = function(this: GameguiCookbook, id: string, label: string, method: string | Function, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none', tooltip?: string): HTMLElement
{
	if (!color) color = "gray";
	this.addActionButton(id, label, method, destination, blinking, color);

	const div = $(id);

	dojo.style(div, "border", "none");
	dojo.addClass(div, "shadow bgaimagebutton");

	if (tooltip) {
		dojo.attr(div, "title", tooltip);
	}
	return div;
}

GameguiCookbook.prototype.isReadOnly = function(this: GameguiCookbook): boolean
{
	return this.isSpectator || typeof g_replayFrom !== 'undefined' || g_archive_mode;
}

GameguiCookbook.prototype.scrollIntoViewAfter = function(this: GameguiCookbook, target: string | HTMLElement, delay?: number): void
{
	if (this.instantaneousMode)
	  return;

	if (typeof g_replayFrom != "undefined" || !delay || delay <= 0)
	{
		$(target).scrollIntoView();
		return;
	}

	setTimeout(() => {
		$(target).scrollIntoView({ behavior: "smooth", block: "center" });
	}, delay);
}

GameguiCookbook.prototype.getPlayerAvatar = function(this: GameguiCookbook, playerId: number | string, size: '32' | '184' = '184'): string
{
	let avatarDiv = $('avatar_' + playerId);

	if (avatarDiv == null)
		return 'https://x.boardgamearena.net/data/data/avatar/default_184.jpg';
	
	let smallAvatarURL = dojo.attr(avatarDiv, 'src');
	if (size === '184')
		smallAvatarURL = smallAvatarURL.replace('_32.', '_184.');

	return smallAvatarURL;
}

GameguiCookbook.prototype.divYou = function(this: GameguiCookbook): string
{
	return this.divColoredPlayer(this.player_id, __("lang_mainsite", "You"));
}

GameguiCookbook.prototype.divColoredPlayer = function(this: GameguiCookbook, player_id: number, text?: string): string
{
	const player = this.gamedatas.players[player_id];
	if (player === undefined)
		return "--unknown player--";

	return `<span style="color:${player.color};background-color:#${player.color_back};">${text ?? player.name}</span>`;
}

GameguiCookbook.prototype.setMainTitle = function(this: GameguiCookbook, html: string): void
{
	$('pagemaintitletext').innerHTML = html;
}

GameguiCookbook.prototype.setDescriptionOnMyTurn = function(this: GameguiCookbook, description: string): void
{
	this.gamedatas.gamestate.descriptionmyturn = description;

	let tpl: any = dojo.clone(this.gamedatas.gamestate.args);
	if (tpl === null)
		tpl = {};

	if (this.isCurrentPlayerActive() && description !== null)
		tpl.you = this.divYou(); 

	const title = this.format_string_recursive(description, tpl);
	this.setMainTitle(title ?? '');
}

GameguiCookbook.prototype.infoDialog = function(this: GameguiCookbook, message: string, title: string, callback?: (evt: any) => any): PopInDialog
{
	// Create the new dialog over the play zone. You should store the handler in a member variable to access it later
	const myDlg = new ebg.popindialog();
	console.log(myDlg);
	myDlg.create( 'myDialogUniqueId' );
	myDlg.setTitle( _(title) );
	myDlg.setMaxWidth( 500 ); // Optional
	
	// Create the HTML of my dialog. 
	// The best practice here is to use Javascript templates
	var html = '<div>' + message + '</div><a href="#" id="info_dialog_button" class="bgabutton bgabutton_blue"><span>Ok</span></a>';
	
	// Show the dialog
	myDlg.setContent( html ); // Must be set before calling show() so that the size of the content is defined before positioning the dialog
	myDlg.show(!1);

	// Removes the default close icon
	myDlg.hideCloseIcon();

	// Add a callback to the button
	dojo.connect($('info_dialog_button'), 'onclick', this, (event) =>
	{
		event.preventDefault();
		callback?.(event);
		myDlg.destroy();
	});

	return myDlg;
}