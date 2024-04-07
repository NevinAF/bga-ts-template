//#region Preload Script

/** The dojoConfig object sets options and default behavior for various aspects of the dojo toolkit. This is the same object as {@link dojo.config}, but loaded before. */
declare const dojoConfig: dojo._base.Config;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const bgaConfig: {
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
declare const webrtcConfig: {
	pcConfig: RTCConfiguration,
	pcConstraints: object,
	audioSendCodec: string,
	audioReceiveCodec: string,
	iceTricklingEnabled: boolean,
}

/** Partial: This has been partially typed based on a subset of the BGA source code. */
// TODO: socket.io stuff...

declare const dojo: BGA_DOJO_IMPORTS;
declare const dijit: BGA_DIJIT_IMPORTS;
// @ts-ignore - TODO: No idea why this one is throwing an error
declare const dojox: BGA_DOJOX_IMPORTS;

declare module "dojo" {
	export = dojo;
}

declare module "dijit/main" {
	export = dijit;
}

//#endregion

//#region BGA Main Script

/**
 * The global jQuery-like selector function included in all BGA pages, used to resolve an id to an element if not already an element. 
 * 
 * This is an alias for {@link dojo.byId}.
 * ```js
 * return ("string" == typeof idOrElement ? (n || document).getElementById(idOrElement) : idOrElement) || null
 * ```
*/
declare const $: dojo.Dom['byId'];

/**
 * The global translation function for page specific elements, used to translate a key (usually English string).
 * @param key The key to get the translation for.
 * @returns The translation for the given key.
 * 
 * This is an alias for {@link g_i18n.getSimpleTranslation}.
 */
declare const _: I18n['getSimpleTranslation'];

/**
 * The global translation dictionary, where the first key is the bundle to pull translations from, and the second is the key in that bundle.
 * @param bundle The bundle to pull translations from.
 * @param key The key to get the translation for.
 * @returns The translation for the given key.
 * 
 * This is an alias for {@link g_i18n.getTranslation}.
 */
declare const __: I18n['getTranslation'];

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

/**The main site object that is currently running. This is the same as the {@link gameui} object when on a game page. */
declare const g_sitecore: Sitecore;

/** The global sound manager object for playing/stopping sounds. */
declare const soundManager: SoundManager;

/**
 * Returns a formatted url for the specified file. This is used to load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file).
 * @param file The file to get the url for. This does not include the game theme url. For example, 'img/cards.jpg'.
 * @returns The formatted url for the specified file in the following format: `{game theme name}{file version}/{file path}`. If the file is not included in the static assets, the {@link g_gamethemeurl} + {file} is returned instead.
 */
declare function getStaticAssetUrl(file: string): string;

/**
 * Publishes the `notifEnd` event which ends the current asynchronous notification. This should only be called when wanting to interrupt a notification that has been marked as synchronous with {@link GameNotif.setSynchronous}.
 * ```js
 * dojo.publish('notifEnd', null);
 * ```
 */
declare function endnotif(): void;

/**
 * Formats the given bga string format with the given arguments. There are a few special formatting options, but this mostly just adds classes to bits of text based on the syntax of the format.
 * @example
 * bga_format("Hello, [world]!", {
 * 	"[": "highlight"
 * });
 * // Returns: "Hello, <span class='highlight'>world</span>!"
 */
declare function bga_format(format: string, classes: Record<string, string>): string;

/**
 * Formats the given duration in minutes to human readable format.
 * @example
 * time_format(17); // Returns: "17mn"
 * time_format(65); // Returns: "1h"
 * time_format(233); // Returns: "4h"
 */
declare function time_format(time: number): string;

/** Same as {@link time_format}, but with more features and always makes the time negative (x ago). */
declare function time_ago_format(time: number): string;

/**
 * Formats a given timestamp into a human-readable date/time string.
 * @param timestamp A timestamp in seconds.
 * @param minFlag If true and the time differences is less than 4 hours, the time will include the minutes.
 * @param dateFormat If true, the date will be formatted as a date given the current locale. Either `${Y}-${M}-${D}` or `${M}/${D}/${Y}`
 * @param includeTimezone If true, the timezone will be included in the date string.
 * @returns The formatted date string.
 */
declare function date_format(timestamp: number, minFlag: boolean, dateFormat: boolean, includeTimezone: boolean): string;

/**
 * Formats a given timestamp into a human-readable date/time string.
 *
 * @param timestamp The timestamp in seconds.
 * @returns The formatted date/time string.
 *
 * @example
 * // returns "01/01/1970 at 00:00" or "1970-01-01 at 00:00" depending on user's preference
 * date_format_simple(0);
 */
declare function date_format_simple(timestamp: number): string;

/**
 * Formats a given timestamp into a human-readable time string.
 *
 * @param timestamp - The timestamp in seconds.
 * @returns The formatted time string in the format "HH:mm".
 *
 * @example
 * // returns "00:00"
 * daytime_format(0);
 */
declare function daytime_format(timestamp: number): string;

/**
 * Checks if the given value is undefined.
 * @param value The value to check.
 * @returns True if the value is undefined, false otherwise.
 * ```js
 * return void 0 !== value
 * ```
 */
declare function isset(value: any): boolean;

/**
 * Converts the given value (base 10) to a number. If the value is null, it is returned as null.
 * This is simply a wrapper for the `parseInt` function, but with a null check.
 * @param value The value to convert to a number.
 * @returns The value as a number, or null if the value is null.
 * ```js
 * return null === value ? null : parseInt(value, 10)
 * ```
 */
declare function toint(value: string | null | number): number | null;

/**
 * Converts the given value to a floating point number. If the value is null, it is returned as null.
 * This is simply a wrapper for the `parseFloat` function, but with a null check.
 * @param value The value to convert to a number.
 * @returns The value as a number, or null if the value is null.
 * ```js
 * return null === value ? null : parseFloat(value)
 * ```
 */
declare function tofloat(value: string | null | number): number | null;

// zeroFill
/**
 * Pads the start of the string with zeros until it reaches the given length.
 * This is the equivalent of the {@link String.prototype.padStart} function, using {length} and '0' as the arguments.
 * @param str The string to pad with zeros
 * @param width The width to pad the number to.
 * @returns The new string with the padded zeros. The length of the string will be at least the width. (if it was already longer, it will not be shortened)
 * ```js
 * return (t -= str.toString().length) > 0 ? new Array(t + (/\./.test(str) ? 2 : 1)).join("0") + str : str
 * ```
 */
declare function zeroFill(str: string, width: number): string;

/**
 * Capitalizes the first letter of the given string.
 * @param str The string to capitalize.
 * @returns The string with the first letter capitalized.
 * ```js
 * return str.charAt(0).toUpperCase() + str.slice(1)
 * ```
 */
declare function ucfirst(str: string): string;

/**
 * Formats the given number with the given number by adding spaces after every 3 digits.
 * @param number The number to format.
 * @returns The formatted number.
 * ```js
 * return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
 * ```
 */
declare function format_number(number: number | string): string;

/**
 * Play a sound file. This file must have both a .mp3 and a .ogg file with the names <gamename>_<soundname>[.ogg][.mp3] amd must be defined in the .tpl file:
 * 
 * `<audio id="audiosrc_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.mp3" preload="none" autobuffer></audio>	
 * `<audio id="audiosrc_o_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.ogg" preload="none" autobuffer></audio>`
 * 
 * This is an alias for {@link SoundManager.doPlay}.
 * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
 * @example
 * playSound('kiriaitheduel_yoursoundname');
 */
declare const playSound: SoundManager['doPlay'];

/**
 * Called from {@link playSound} to actually play the sound. Unlike using {@link playSound}, this function does not check for the muted status, does not catch errors, and does not use {@link SoundManager.getSoundIdFromEvent} to update sound aliases.
 * 
 * This is an alias for {@link SoundManager.doPlayFile}.
 * 
 * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
 */
declare const playSoundFile: SoundManager['doPlayFile'];

/**
 * Stops the sound with the given name. This is done by pausing the audio element with the given id.
 * 
 * This is an alias for {@link SoundManager.stop}.
 * 
 * @param sound The name of the sound file to stop in the form '<gamename>_<soundname>'.
 * @example
 * stopSound('kiriaitheduel_yoursoundname');
 */
declare const stopSound: SoundManager['stop'];

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function getLocationDescriptionFromResult(result: { address_components: Record<string, any> }): string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function analyseLocationDescriptionFromResult(result: { address_components: Record<string, any> }): { city: string, country: string, area1: string, area2: string };

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function id_to_path(id: number): string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function playerDeviceToIcon(device: 'desktop' | 'tablet' | 'mobile'): 'circle' | 'tablet' | 'mobile';

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const jzTimezoneDetector: object;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function setCaretPosition(e: any, t: any): void;

/**
 * Replaces all instances of the given string in the source string with the given replacement string. This is the same as using the {@link String.prototype.replace} function, but escapes punctuation in the find string.
 * @param str The source string to replace in.
 * @param find The string to find in the source string.
 * @param replace The string to replace the found string with.
 * @returns The source string with all instances of the find string replaced with the replace string.
 * ```js
 * return str.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), replace)
 * ```
*/
declare function replaceAll(str: string, find: string, replace: string): string;

/**
 * Filters all duplicate values from the given array using the {@link Array.filter} function.
 * @param array The array to filter.
 * @returns The array with all duplicate values removed.
 */
declare function array_unique(array: any[]): any[];

/**
 * Returns the domain of the given url. This is done by extracting the domain from the url using a regular expression.
 * @param url The url to extract the domain from.
 * @returns The domain of the given url.
 */
declare function extractDomain(url: string): string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function cookieConsentInit(): void;

/**
 * Returns the given string with all accent characters replaced with their non-accented counterparts.
 * @param str The string to remove accents from.
 * @returns The string with all accent characters replaced with their non-accented counterparts.
 */
declare function removeAccents(str: string): string;

/**
 * Returns a URL for the player avatar image. If the avatar for the player id is not found (element with id `avatar_${playerId}`), then the default avatar picture will be returned.
 * @param playerId The player id for the avatar.
 * @param avatar The avatar for the player.
 * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
 * @returns The URL for the player avatar image.
 */
declare function getPlayerAvatar(playerId: number | string, avatar: string, size?: '32' | '50' | '92' | '184'): string;

/**
 * Returns a URL for the group avatar image. If the avatar for the group is not found, then the default avatar picture will be returned.
 * @param playerId The player id for the avatar.
 * @param avatar The avatar for the player.
 * @param type The type of group. Either 'tournament' or 'group'. Defaults to 'group'.
 * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
 * @returns The URL for the player avatar image.
 */
declare function getGroupAvatar(playerId: number | string, avatar: string, type: 'tournament' | 'group', size?: '32' | '50' | '92' | '184'): string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function getMediaUrl(folder1: string, folder2: string, underscore?: string | null, type?: 'default' | string, h?: string | null): string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare function analyticsPush(e: any): void;

//#endregion

//#region Post Load

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

/** The global game object that is currently running. */
declare const gameui: Gamegui;

/** Defined as null after loading the page. This seems to have no use and is likely misspelled version of {@link gameui}. */
declare const gamegui: null;

/** The static assets for the current page. This is only used with {@link getStateAssetUrl} to help load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file). */
declare const g_staticassets: { file: string, version: string }[];

/** The global translation module. For usage, the aliases {@line _} and {@link __} should normally be used instead. */
declare const g_i18n: I18n;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const g_last_msg_dispatched_uid: number;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const g_img_preload: string[];

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const jstpl_action_button: string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const jstpl_score_entry: string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const jstpl_audiosrc: string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const head_errmsg: string;

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare const head_infomsg: string;