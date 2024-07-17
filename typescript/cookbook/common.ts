/// <amd-module name="cookbook/common"/>

import Gamegui = require("ebg/core/gamegui");
import dojo = require("dojo");

/**
 * A typescript mixin function that add all `Common` methods to the given `Gamegui` class. The `common` module is a collection of wrappers and Gamegui-like methods that are directly defined on the cookbook page, and are recommended to be used in almost all games (sometimes depending on depth/complexity of the game).
 * @see README.md for more information on using cookbook mixins.
 */
const CommonMixin = <TBase extends new (...args: any[]) => Gamegui>(Base: TBase) => class Common extends Base
{
	/**
	 * This method will attach mobile to a new_parent without destroying, unlike original attachToNewParent which destroys mobile and all its connectors (onClick, etc).
	 */
	attachToNewParentNoDestroy(mobile_in: string | HTMLElement, new_parent_in: string | HTMLElement, relation?: dojo.PosString | number, place_position?: string): dojo.DomGeometryBox
	{
		const mobile = $(mobile_in);
		const new_parent = $(new_parent_in);
	
		if (!mobile || !new_parent) {
			console.error("attachToNewParentNoDestroy: mobile or new_parent was not found on dom.", mobile_in, new_parent_in);
			return { l: NaN, t: NaN, w: NaN, h: NaN };
		}
	
		let src = dojo.position(mobile);
		if (place_position)
			mobile.style.position = place_position;
		dojo.place(mobile, new_parent, relation);
		mobile.offsetTop;//force re-flow
		let tgt = dojo.position(mobile);
		let box = dojo.marginBox(mobile);
		let cbox = dojo.contentBox(mobile);
	
		if (!box.t || !box.l || !box.w || !box.h || !cbox.w || !cbox.h) {
			console.error("attachToNewParentNoDestroy: box or cbox has an undefined value (t-l-w-h). This should not happen.", box, cbox);
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

	/**
	 * Typed `ajaxcallWrapper` method recommended by the BGA wiki. This method removes obsolete parameters, simplifies action url, and auto adds the lock parameter to the args if needed. This significantly reduces the amount of code needed to make an ajax call and makes the parameters much more readable.
	 * @param action The action to be called.
	 * @param args The arguments to be passed to the server for the action. This does not need to include the `lock` parameter, as it will be added automatically if needed.
	 * @param callback The callback to be called once a response is received from the server.
	 * @param ajax_method The method to use for the ajax call. See {@link CoreCore.ajaxcall} for more information.
	 * @returns True if the action was called, false if the action was not called because it was not a valid player action (see {@link Gamegui.checkAction}).
	 * @example
	 * // Arguments must match the arguments of the PlayerAction 'myAction'.
	 * this.ajaxAction( 'myAction', { myArgument1: arg1, myArgument2: arg2 }, (is_error) => {} );
	 */
	ajaxAction<T extends keyof PlayerActions>(action: T, args: PlayerActions[T] & { lock?: true | 'table' | 'player', action?: undefined, module?: undefined, class?: undefined }, callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any, ajax_method?: 'post' | 'get'): boolean
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
	subscribeNotif<T extends keyof NotifTypes>(event: T, callback: (notif: NotifAs<T>) => any): dojo.Handle
	{
		return dojo.subscribe(event, this, callback);
	}

	/**
	 * This method can be used instead of addActionButton, to add a button which is an image (i.e. resource). Can be useful when player
	 * need to make a choice of resources or tokens.
	 * @param id The id of the button to be added.
	 * @param label The label to be displayed on the button.
	 * @param method The method to be called when the button is clicked.
	 * @param destination The destination to be used for the button. See {@link Gamegui.addActionButton} for more information.
	 * @param blinking If the button should blink when added. See {@link Gamegui.addActionButton} for more information.
	 * @param color The color of the button. See {@link Gamegui.addActionButton} for more information.
	 * @param tooltip The tooltip to be displayed when hovering over the button.
	 * @returns The HTMLElement of the button that was added. Null if the button was not found on the dom.
	 */
	addImageActionButton(id: string, label: string, method: string | Function, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none', tooltip?: string): HTMLElement | null
	{
		if (!color) color = "gray";
		this.addActionButton(id, label, method, destination, blinking, color);
	
		const div = $(id);
	
		if (div === null) {
			console.error("addImageActionButton: id was not found on dom", id);
			return null;
		}
		if (!(div instanceof HTMLElement)) {
			console.error("addImageActionButton: id was not an HTMLElement", id, div);
			return null;
		}
	
		dojo.style(div, "border", "none");
		dojo.addClass(div, "shadow bgaimagebutton");
	
		if (tooltip) {
			dojo.attr(div, "title", tooltip);
		}
		return div;
	}

	/** If the current game should never be interactive, i.e., the game is not in a playable/editable state. Returns true for spectators, instant replay (during game), archive mode (after game end). */
	isReadOnly(): boolean
	{
		return this.isSpectator || typeof g_replayFrom !== 'undefined' || g_archive_mode;
	}

	/** Scrolls a target element into view after a delay. If the game is in instant replay mode, the scroll will be instant. */
	scrollIntoViewAfter(target: string | HTMLElement, delay?: number): void
	{
		if (this.instantaneousMode)
			return;
	
		let target_div = $(target);
	
		if (target_div === null) {
			console.error("scrollIntoViewAfter: target was not found on dom", target);
			return;
		}
	
		if (typeof g_replayFrom != "undefined" || !delay || delay <= 0)
		{
			target_div.scrollIntoView();
			return;
		}
	
		setTimeout(() => {
			target_div.scrollIntoView({ behavior: "smooth", block: "center" });
		}, delay);
	}

	/** Gets an html span with the text 'You' formatted and highlighted to match the default styling for `descriptionmyturn` messages with the word `You`. This does preform language translations. */
	divYou(): string
	{
		return this.divColoredPlayer(this.player_id, __("lang_mainsite", "You"));
	}

	/**
	 * Gets an html span with the text `text` highlighted to match the default styling for the given player, like with the `description` messages that show on the title card.
	 * @param player_id The player id to get the color for.
	 * @param text The text to be highlighted. If undefined, the {@link Player.name} will be used instead.
	 */
	divColoredPlayer(player_id: number, text?: string): string
	{
		const player = this.gamedatas.players[player_id];
		if (player === undefined)
			return "--unknown player--";

		return `<span style="color:${player.color};background-color:#${player.color_back};">${text ?? player.name}</span>`;
	}

	/**
	 * Sets the description of the main title card to the given html. This change is only visual and will be replaced on page reload or when the game state changes.
	 * @param html The html to set the main title to.
	 */
	setMainTitle(html: string): void
	{
		$('pagemaintitletext')!.innerHTML = html;
	}

	/**
	 * Sets the description of the main title card to the given string, formatted using the current {@link CurrentStateArgs.args}. This should only be changed when it is this players turn and you want to display a client only change while the client is making a decision.
	 * @param description The string to set the main title to.
	 */
	setDescriptionOnMyTurn(description: string): void
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

	/** Initializes an observer that listens for changes to the preferences and calls the callback method when a preference changes. */
	addPreferenceListener(callback: (prefId: number) => void): void
	{
		dojo.query('.preference_control').on('change', (e: Event) => {
			const target = e.target;
			if (!(target instanceof HTMLSelectElement))
			{
				console.error("Preference control class is not a valid element to be listening to events from. The target of the event does not have an id.", e.target);
				return;
			}

			const match = target.id.match(/^preference_[cf]ontrol_(\d+)$/)?.[1];
			if (!match)
				return;

			const matchId = parseInt(match);
			if (isNaN(matchId))
			{
				console.error("Preference control id was not a valid number.", match);
				return;
			}

			const pref = this.prefs[matchId];
			if (!pref)
			{
				console.warn("Preference was changed but somehow the preference id was not found.", matchId, this.prefs);
				return;
			}

			const value = target.value as `${number}`;
			if (!pref.values[value]) {
				console.warn("Preference value was changed but somehow the value is not a valid value.", value, pref.values);
			}

			pref.value = value;
			callback(matchId);
		});
	}

	override onScriptError(error: string | ErrorEvent, url: string, line: number): void
	{
		if (this.page_is_unloading) return;

		console.error("Script error:", error);
		super.onScriptError(error, url, line);
	}

	showError(log: string, args: Record<keyof any, any> = {})
	{
		args['you'] = this.divYou();
		var message = this.format_string_recursive(log, args);
		this.showMessage(message, "error");
		console.error(message);
	}

	getPlayerColor(player_id: number): string | null
	{
		return this.gamedatas.players[player_id]?.color ?? null;
	}

	getPlayerName(player_id: number): string | null
	{
		return this.gamedatas.players[player_id]?.name ?? null;
	}

	getPlayerFromColor(color: string): Player | null
	{
		for (const id in this.gamedatas.players)
		{
			const player = this.gamedatas.players[id];
			if (player?.color === color)
				return player;
		}
		return null;
	}

	getPlayerFromName(name: string): Player | null
	{
		for (const id in this.gamedatas.players)
		{
			const player = this.gamedatas.players[id];
			if (player?.name === name)
				return player;
		}
		return null;
	}
}

export = CommonMixin;