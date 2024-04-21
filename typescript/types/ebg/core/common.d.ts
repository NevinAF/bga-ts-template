import dojo = require("dojo");
import "dojo/date";
import SoundManager = require("ebg/core/soundManager"); // This is not actually imported due to circular dependencies, but is included here for type checking.

declare global {
	const ebg: EBG;

	/**
	 * The global jQuery-like selector function included in all BGA pages, used to resolve an id to an element if not already an element.
	 * 
	 * This is an alias for {@link dojo.byId}.
	 * ```js
	 * return ("string" == typeof idOrElement ? (n || document).getElementById(idOrElement) : idOrElement) || null
	 * ```
	 * 
	 * Usage of this function can cause some issues with type safety. Commonly:
	 * ```ts
	 * $('myElement').parent; // Error! $ may return null
	 * ```
	 * - With the typescript config 'strictNullChecks' enabled, the result of this function must be checked for null before using it. Fix by:
	 * 	- Adding `strictNullChecks: false` to the compiler options in the tsconfig.json file. OR
	 * 	- Redeclaring the function: `declare function $<E extends Element>(id: string | E): E;`
	 * ```ts
	 * $('myElement')?.style; // Error! `Element` does not have a `style` property
	 * ```
	 * - Without giving the template parameter, the result of this function will be typed as `Element` which means that common properties of HTMLElements will not be available. Fix by redeclaring the function:
	 * 	- `declare function $(id: string | HTMLElement): HTMLElement;` OR
	 * 	- `declare function $<E extends HTMLElement>(id: string | E): E;`
	 * @template E The type of the element expected to be returned. Note that there are no runtime checks on this type.
	 * @param id The id of the element to get.
	 * @returns The element with the given id, or null if no element is found.
	 * @example
	 * // Get the element with the id 'myElement'
	 * const element: Element = $('myElement');
	 * $<HTMLElement>('myElement')?.style.display = 'none';
	*/
	const $: dojo.Dom['byId'];

	/**
	 * The global translation function for page specific elements, used to translate a key (usually English string).
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 * 
	 * This is an alias for {@link g_i18n.getSimpleTranslation}, with checks to ensure the translation is not undefined.
	 */
	function _(key: string): string;

	/**
	 * The global translation dictionary, where the first key is the bundle to pull translations from, and the second is the key in that bundle.
	 * @param bundle The bundle to pull translations from.
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 * 
	 * This is an alias for {@link g_i18n.getTranslation}, with checks to ensure the translation is not undefined.
	 */
	function __(bundle: string, key: string): string;

	/**
	 * Returns a formatted url for the specified file. This is used to load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file).
	 * @param file The file to get the url for. This does not include the game theme url. For example, 'img/cards.jpg'.
	 * @returns The formatted url for the specified file in the following format: `{game theme name}{file version}/{file path}`. If the file is not included in the static assets, the {@link g_gamethemeurl} + {file} is returned instead.
	 */
	function getStaticAssetUrl(file: string): string;

	/**
	 * Publishes the `notifEnd` event which ends the current asynchronous notification. This should only be called when wanting to interrupt a notification that has been marked as synchronous with {@link GameNotif.setSynchronous}.
	 * ```js
	 * dojo.publish('notifEnd', null);
	 * ```
	 */
	function endnotif(): void;

	/**
	 * Formats the given bga string format with the given arguments. There are a few special formatting options, but this mostly just adds classes to bits of text based on the syntax of the format.
	 * @example
	 * bga_format("Hello, [world]!", {
	 * 	"[": "highlight"
	 * });
	 * // Returns: "Hello, <span class='highlight'>world</span>!"
	 */
	function bga_format(format: string, classes: Record<string, string>): string;

	/**
	 * Formats the given duration in minutes to human readable format.
	 * @example
	 * time_format(17); // Returns: "17mn"
	 * time_format(65); // Returns: "1h"
	 * time_format(233); // Returns: "4h"
	 */
	function time_format(time: number): string;

	/**
	 * Same as {@link time_format}, but with more features and always makes the time negative (x ago).
	 */
	function time_ago_format(time: number): string;

	/**
	 * Formats a given timestamp into a human-readable date/time string.
	 * @param timestamp A timestamp in seconds.
	 * @param minFlag If true and the time differences is less than 4 hours, the time will include the minutes.
	 * @param dateFormat If true, the date will be formatted as a date given the current locale. Either `${Y}-${M}-${D}` or `${M}/${D}/${Y}`
	 * @param includeTimezone If true, the timezone will be included in the date string.
	 * @returns The formatted date string.
	 */
	function date_format(timestamp: number, minFlag: boolean, dateFormat: boolean, includeTimezone: boolean): string;

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
	function date_format_simple(timestamp: number): string;

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
	function daytime_format(timestamp: number): string;

	/**
	 * Checks if the given value is undefined.
	 * @param value The value to check.
	 * @returns True if the value is undefined, false otherwise.
	 * ```js
	 * return void 0 !== value
	 * ```
	 */
	function isset(value: any): boolean;

	/**
	 * Converts the given value (base 10) to a number. If the value is null, it is returned as null.
	 * This is simply a wrapper for the `parseInt` function, but with a null check.
	 * @param value The value to convert to a number.
	 * @returns The value as a number, or null if the value is null.
	 * ```js
	 * return null === value ? null : parseInt(value, 10)
	 * ```
	 */
	function toint(value: string | null | number): number | null;

	/**
	 * Converts the given value to a floating point number. If the value is null, it is returned as null.
	 * This is simply a wrapper for the `parseFloat` function, but with a null check.
	 * @param value The value to convert to a number.
	 * @returns The value as a number, or null if the value is null.
	 * ```js
	 * return null === value ? null : parseFloat(value)
	 * ```
	 */
	function tofloat(value: string | null | number): number | null;

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
	function zeroFill(str: string, width: number): string;

	/**
	 * Capitalizes the first letter of the given string.
	 * @param str The string to capitalize.
	 * @returns The string with the first letter capitalized.
	 * ```js
	 * return str.charAt(0).toUpperCase() + str.slice(1)
	 * ```
	 */
	function ucfirst(str: string): string;

	/**
	 * Formats the given number with the given number by adding spaces after every 3 digits.
	 * @param number The number to format.
	 * @returns The formatted number.
	 * ```js
	 * return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
	 * ```
	 */
	function format_number(number: number | string): string;

	/**
	 * Play a sound file. This file must have both a .mp3 and a .ogg file with the names <gamename>_<soundname>[.ogg][.mp3] amd must be defined in the .tpl file:
	 * 
	 * `<audio id="audiosrc_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.mp3" preload="none" autobuffer></audio>	
	 * `<audio id="audiosrc_o_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.ogg" preload="none" autobuffer></audio>`
	 * 
	 * This is an alias for {@link SoundManager.doPlay}.
	 * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
	 * @example
	 * playSound('yourgamename_yoursoundname');
	 */
	function playSound(idOrEvent: string):void;

	/**
	 * Called from {@link playSound} to actually play the sound. Unlike using {@link playSound}, this function does not check for the muted status, does not catch errors, and does not use {@link SoundManager.getSoundIdFromEvent} to update sound aliases.
	 * 
	 * This is an alias for {@link SoundManager.doPlayFile}.
	 * 
	 * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
	 */
	function playSoundFile(soundId: string): void;

	/**
	 * Stops the sound with the given name. This is done by pausing the audio element with the given id.
	 * 
	 * This is an alias for {@link SoundManager.stop}.
	 * 
	 * @param sound The name of the sound file to stop in the form '<gamename>_<soundname>'.
	 * @example
	 * stopSound('yourgamename_yoursoundname');
	 */
	function stopSound(idOrEvent: string): void;

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function getLocationDescriptionFromResult(result: { address_components: Record<string, any> }): string;

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function analyseLocationDescriptionFromResult(result: { address_components: Record<string, any> }): { city: string, country: string, area1: string, area2: string };

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function id_to_path(id: number): string;

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function playerDeviceToIcon(device: 'desktop' | 'tablet' | 'mobile'): 'circle' | 'tablet' | 'mobile';

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	const jzTimezoneDetector: object;

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function setCaretPosition(e: any, t: any): void;

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
	function replaceAll(str: string, find: string, replace: string): string;

	/**
	 * Filters all duplicate values from the given array using the {@link Array.filter} function.
	 * @param array The array to filter.
	 * @returns The array with all duplicate values removed.
	 */
	function array_unique(array: any[]): any[];

	/**
	 * Returns the domain of the given url. This is done by extracting the domain from the url using a regular expression.
	 * @param url The url to extract the domain from.
	 * @returns The domain of the given url.
	 */
	function extractDomain(url: string): string;

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function cookieConsentInit(): void;

	/**
	 * Returns the given string with all accent characters replaced with their non-accented counterparts.
	 * @param str The string to remove accents from.
	 * @returns The string with all accent characters replaced with their non-accented counterparts.
	 */
	function removeAccents(str: string): string;

	/**
	 * Returns a URL for the player avatar image. If the avatar for the player id is not found (element with id `avatar_${playerId}`), then the default avatar picture will be returned.
	 * @param playerId The player id for the avatar.
	 * @param avatar The avatar for the player.
	 * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
	 * @returns The URL for the player avatar image.
	 */
	function getPlayerAvatar(playerId: number | string, avatar: string, size?: '32' | '50' | '92' | '184'): string;

	/**
	 * Returns a URL for the group avatar image. If the avatar for the group is not found, then the default avatar picture will be returned.
	 * @param playerId The player id for the avatar.
	 * @param avatar The avatar for the player.
	 * @param type The type of group. Either 'tournament' or 'group'. Defaults to 'group'.
	 * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
	 * @returns The URL for the player avatar image.
	 */
	function getGroupAvatar(playerId: number | string, avatar: string, type: 'tournament' | 'group', size?: '32' | '50' | '92' | '184'): string;

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function getMediaUrl(folder1: string, folder2: string, underscore?: string | null, type?: 'default' | string, h?: string | null): string;

	/**
	 * Partial: This has been partially typed based on a subset of the BGA source code.
	 */
	function analyticsPush(e: any): void;
}