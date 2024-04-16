declare global {
	//#region Preload Globals

	/** The pages name using the {@link location} global. */
	const pagename: string;

	/** If cookie consent is still needed for the specific browser user. */
	const bConsentNeeded: boolean;

	/** gtag is a global function that is used to send data to Google Analytics. */
	function gtag(...args: any[]): void;

	/** A callback function for when the user grants their consent with their cookie banner */
	function setCookies(): void;

	/** Resets the document.cookie object for this domain. */
	function resetCookieConsent(): void;

	/** If true, the browser has at least one extension that is incompatible with the BGA site. */
	const bAtLeastOneIncompatibility: boolean;

	/** A helper object used to build html string for several uses within the script tags on the html page. */
	var html: string;

	/** The dojoConfig object sets options and default behavior for various aspects of the dojo toolkit. This is the same object as {@link dojo.config}, but loaded before. */
	const dojoConfig: dojo._base.Config;

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const bgaConfig: {
		webrtcEnabled: boolean;
		facebookAppId: string | 'replace_with_real_id';
		googleAppId: string | 'replace_with_real_id';
		requestToken: string;
		genderRegexps: { [local: string]: {
			'forMasculine': Record<string, string>,
			'forFeminine': Record<string, string>
			'forNeutral': Record<string, string>
		}};
	}

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const webrtcConfig: {
		pcConfig: RTCConfiguration,
		pcConstraints: object,
		audioSendCodec: string,
		audioReceiveCodec: string,
		iceTricklingEnabled: boolean,
	}

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	// TODO: socket.io stuff...

	//#endregion

	//#region Postload Globals

	/**
	 * The url to the game source folder. This should be used for loading images and sounds.
	 * @example
	 * // Player hand
	 * this.playerHand = new ebg.stock();
	 * this.playerHand.create( this, $('myhand'), this.cardwidth, this.cardheight );
	 * // Create cards types:
	 * for (var color = 1; color <= 4; color++) {
	 * 	for (var value = 2; value <= 14; value++) {
	 * 		// Build card type id
	 * 		var card_type_id = this.getCardUniqueId(color, value);
	 * 		this.playerHand.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/cards.jpg', card_type_id);
	 * 	}
	 * }
	 */
	const g_gamethemeurl: string;

	/**
	 * The non-game specific theme url. This should be used just like {@link g_gamethemeurl} but for assets that are not specific to the game, that is shared assets.
	 * @example
	 * const image = "<img class='imgtext' src='" + g_themeurl + "img/layout/help_click.png' alt='action' /> <span class='tooltiptext'>" + text + "</span>""
	 */
	const g_themeurl: string;

	/** The replay number in live game. It is set to undefined (i.e. not set) when it is not a replay mode, so the good check is `typeof g_replayFrom != 'undefined'` which returns true if the game is in replay mode during the game (the game is ongoing but the user clicked "reply from this move" in the log). */
	const g_replayFrom: number | undefined;

	/** True if the game is in archive mode after the game (the game has ended). */
	const g_archive_mode: boolean;

	/** An object if the game is in tutorial mode, or undefined otherwise. Tutorial mode is a special case of archive mode where comments have been added to a previous game to teach new players the rules. */
	const g_tutorialwritten: {
		author: string;
		id: number;
		mode: string;
		status: string;
		version_override: string | null;
		viewer_id: string;
	} | undefined;

	/** Defined as null after loading the page. This seems to have no use and is likely misspelled version of {@link gameui}. */
	const gamegui: null;

	/** The static assets for the current page. This is only used with {@link getStateAssetUrl} to help load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file). */
	const g_staticassets: { file: string, version: string }[];

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const g_last_msg_dispatched_uid: number;

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const g_img_preload: string[];

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const jstpl_action_button: string;

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const jstpl_score_entry: string;

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const jstpl_audiosrc: string;

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const head_errmsg: string;

	/** Partial: This has been partially typed based on a subset of the BGA source code. */
	const head_infomsg: string;

	//#endregion
}

export {};