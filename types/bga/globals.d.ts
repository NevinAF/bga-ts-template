/** The global jQuery-like selector function included in all BGA pages, used to resolve an id to an element if not already an element. */
declare const $: (selectorOrElement: string | HTMLElement) => HTMLElement;

/** The global translation function included in all BGA pages, used to translate a string. */
declare const _: (source: string) => string;

/** The global translation function included in all BGA pages. This is used to target non game translations. */
declare const __: (translationFrom: string, source: string) => string;
/**
 * Play a sound file. This file must have both a .mp3 and a .ogg file with the names <gamename>_<soundname>[.ogg][.mp3] amd must be defined in the .tpl file:
 * 
 * `<audio id="audiosrc_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.mp3" preload="none" autobuffer></audio>	
 * `<audio id="audiosrc_o_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.ogg" preload="none" autobuffer></audio>`
 * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
 * @example
 * playSound('kiriaitheduel_yoursoundname');
 */
declare const playSound: (sound: string) => void;

/** The replay number in live game. It is set to undefined (i.e. not set) when it is not a replay mode, so the good check is `typeof g_replayFrom != 'undefined'` which returns true if the game is in replay mode during the game (the game is ongoing but the user clicked "reply from this move" in the log). */
declare const g_replayFrom: number | undefined;

/** True if the game is in archive mode after the game (the game has ended). */
declare const g_archive_mode: boolean;

/** An object if the game is in tutorial mode, or undefined otherwise. Tutorial mode is a special case of archive mode where comments have been added to a previous game to teach new players the rules. */
declare const g_tutorialwritten: {
	author: string;
	id: number;
	mode: string;
	status: string;
	version_override: string | null;
	viewer_id: string;
} | undefined;

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
declare const g_gamethemeurl: string;