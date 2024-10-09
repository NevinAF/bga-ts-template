import dojo = require("dojo");
import "dojo/date";

declare global {
	/**
	 * Returns a formatted url for the specified file. This is used to load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file).
	 * @param file The file to get the url for. This does not include the game theme url. For example, 'img/cards.jpg'.
	 * @returns The formatted url for the specified file in the following format: `{game theme name}{file version}/{file path}`. If the file is not included in the static assets, the {@link g_gamethemeurl} + {file} is returned instead.
	 */
	var getStaticAssetUrl: (file: string) => string;
}

getStaticAssetUrl = (file: string) =>
{
	var t = "./" + file;
	if (null === g_staticassets) {
		console.error("Error: g_staticassets is null", file);
		return g_themeurl + file;
	}
	var i = g_staticassets.find(function (e) {
		return e.file == t;
	});
	return undefined !== i
		? g_themeurl.substr(0, g_themeurl.length - 12) + i.version + "/" + file
		: g_themeurl + file;
}

declare global {
	/**
	 * Publishes the `notifEnd` event which ends the current asynchronous notification. This should only be called when wanting to interrupt a notification that has been marked as synchronous with {@link GameNotif.setSynchronous}.
	 * ```js
	 * dojo.publish('notifEnd', null);
	 * ```
	 */
	var endnotif: () => void;
}

endnotif = () => dojo.publish("notifEnd", null);

declare global {
	/**
	 * Formats the given bga string format with the given arguments. There are a few special formatting options, but this mostly just adds classes to bits of text based on the syntax of the format.
	 * @example
	 * bga_format("Hello, [world]!", {
	 * 	"[": "highlight"
	 * });
	 * // Returns: "Hello, <span class='highlight'>world</span>!"
	 */
	var bga_format: (format: string, classes: Record<string, string | ((t: string) => string)>) => string;
}

bga_format = (format, classes) =>
{
	for (const key in classes) {
		if (1 !== key.length) continue;
		const endChar = { "{": "}", "[": "]", "(": ")" }[key] || key,
			escChar = (e: string) =>
				["-", "[", "]", "{", "}", "(", ")", "*", "+", "?", ".", ",", "\\", "^", "$", "|", "#", " "].includes(e)
					? "\\" + e
					: e,
			regexp = new RegExp(`${escChar(key)}(.*?)${escChar(endChar)}`, "g");
		let value = classes[key];
		if ("function" != typeof value) {
			const _value = value;
			value = (content) => `<span class="${_value}">${content}</span>`;
		}
		format = format.replace(regexp, (_, content) => value(content));
	}
	return format;
}

declare global {
	/**
	 * Formats the given duration in minutes to human readable format.
	 * @example
	 * time_format(17); // Returns: "17mn"
	 * time_format(65); // Returns: "1h"
	 * time_format(233); // Returns: "4h"
	 */
	var time_format: (minutes: number) => string;
}

time_format = (minutes) =>
{
	if (minutes < 60) return minutes + "mn";
	if (minutes < 75) return "1h";
	if (minutes < 105) return "1h30";
	const hours = Math.round(minutes / 60);
	if (hours < 24) return hours + "h";
	const days = Math.round(hours / 24);
	if (1 === days) return " " + __("lang_mainsite", "one day");
	if (days < 60) return days + " " + __("lang_mainsite", "days");
	if (days < 366) return Math.round(days / 30.5) + " " + __("lang_mainsite", "months");
	const years = Math.round(days / 365.25);
	return 1 === years ? __("lang_mainsite", "one year") : years + " " + __("lang_mainsite", "years");
}

declare global {
	/**
	 * Same as {@link time_format}, but with more features and always makes the time negative (x ago).
	 */
	var time_ago_format: (minutes: number) => string;
}

time_ago_format = (minutes) =>
{
	if (isNaN(minutes)) return "";
	const locale = "zh" === dojoConfig.locale ? "zh-tw" : dojoConfig.locale;
	// @ts-ignore - Date - number is a good operation.
	if (!Intl || !Intl.RelativeTimeFormat) return new Date(new Date() - 6e4 * minutes).toLocaleString();
	const formatter = new Intl.RelativeTimeFormat(locale, { style: "long" });
	if (minutes < 60) return formatter.format(-1 * minutes, "minute");
	if (minutes < 75) return formatter.format(-1, "hour");
	if (minutes < 105) return __("lang_mainsite", "${hour}h${mn} ago").replace("${hour}", "1").replace("${mn}", "30");
	const hours = Math.round(minutes / 60);
	if (hours < 24) return formatter.format(-1 * hours, "hour");
	const days = Math.round(hours / 24);
	if (days < 60) return formatter.format(-1 * days, "day");
	if (days < 366) {
		const months = Math.round(days / 30.5);
		return formatter.format(-1 * months, "month");
	}
	const years = Math.round(days / 365.25);
	return formatter.format(-1 * years, "year");
}

declare global {
	/**
	 * Formats a given timestamp into a human-readable date/time string.
	 * @param timestamp A timestamp in seconds.
	 * @param minFlag If true and the time differences is less than 4 hours, the time will include the minutes.
	 * @param dateFormat If true, the date will be formatted as a date given the current locale. Either `${Y}-${M}-${D}` or `${M}/${D}/${Y}`
	 * @param includeTimezone If true, the timezone will be included in the date string. If this is true, there may be an error if the {@link mainsite} object is not defined or does not have a timezone property.
	 * @returns The formatted date string.
	 */
	var date_format: (timestamp: number, minFlag?: boolean, dateFormat?: boolean, includeTimezone?: boolean) => string;
}

date_format = (timestamp, minFlag, dateFormat, includeTimezone) =>
{
	const now = new Date(),
		date = new Date(1e3 * timestamp);
	if (undefined === includeTimezone) includeTimezone = false;
	let isoFlag = false;
	if (undefined !== globalUserInfos && undefined !== globalUserInfos.date_use_iso) isoFlag = globalUserInfos.date_use_iso;
	let timezone = "";
	if (includeTimezone) timezone = " (" + mainsite.timezone.replace("_", " ") + ")";
	const diff = Math.abs(now.getTime() - date.getTime()) / 1e3,
		isFuture = date.getTime() >= now.getTime();
	if (dateFormat) return dojo.string.substitute(isoFlag ? "${Y}-${M}-${D}" : __("lang_mainsite", "${M}/${D}/${Y}"), {
		M: zeroFill(date.getMonth() + 1, 2),
		D: zeroFill(date.getDate(), 2),
		Y: 1900 + date.getFullYear()
	});
	if (diff < 3600) {
		const minutes = Math.round(diff / 60);
		return isFuture ? dojo.string.substitute(__("lang_mainsite", "in ${mn} min"), { mn: minutes }) : dojo.string.substitute(__("lang_mainsite", "${mn} min ago"), { mn: minutes });
	}
	if (diff < 14400) {
		if (minFlag) {
			const hours = Math.floor(diff / 3600),
				minutes = zeroFill(Math.round((diff - 3600 * hours) / 60), 2);
			return isFuture ? dojo.string.substitute(__("lang_mainsite", "in ${hour}h${mn}"), { hour: hours, mn: minutes }) : dojo.string.substitute(__("lang_mainsite", "${hour}h${mn} ago"), { hour: hours, mn: minutes });
		}
		const hours = Math.round(diff / 3600);
		return isFuture ? 1 === hours ? __("lang_mainsite", "in one hour") : dojo.string.substitute(__("lang_mainsite", "in ${hour} hours"), { hour: hours }) : 1 === hours ? __("lang_mainsite", "one hour ago") : dojo.string.substitute(__("lang_mainsite", "${hour} hours ago"), { hour: hours });
	}
	if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) return dojo.string.substitute(__("lang_mainsite", "today at ${H}:${m}"), { H: zeroFill(date.getHours(), 2), m: zeroFill(date.getMinutes(), 2) }) + timezone;
	const tomorrow = dojo.date.add(now, "day", 1);
	if (date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate()) return dojo.string.substitute(__("lang_mainsite", "tomorrow at ${H}:${m}"), { H: zeroFill(date.getHours(), 2), m: zeroFill(date.getMinutes(), 2) }) + timezone;
	const yesterday = dojo.date.add(now, "day", -1);
	if (date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()) return dojo.string.substitute(__("lang_mainsite", "yesterday at ${H}:${m}"), { H: zeroFill(date.getHours(), 2), m: zeroFill(date.getMinutes(), 2) }) + timezone;
	return dojo.string.substitute(isoFlag ? __("lang_mainsite", "${Y}-${M}-${D} at ${H}:${m}") : __("lang_mainsite", "${M}/${D}/${Y} at ${H}:${m}"), {
		M: zeroFill(date.getMonth() + 1, 2),
		D: zeroFill(date.getDate(), 2),
		Y: 1900 + date.getFullYear(),
		H: zeroFill(date.getHours(), 2),
		m: zeroFill(date.getMinutes(), 2)
	}) + timezone;
}

declare global {
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
	var date_format_simple: (timestamp: number) => string;
}

date_format_simple = (timestamp) =>
{
	const date = new Date(1e3 * timestamp);
	return dojo.string.substitute(globalUserInfos.date_use_iso ? __("lang_mainsite", "${Y}-${M}-${D} at ${H}:${m}") : __("lang_mainsite", "${M}/${D}/${Y} at ${H}:${m}"), {
		M: zeroFill(date.getMonth() + 1, 2),
		D: zeroFill(date.getDate(), 2),
		Y: 1900 + date.getFullYear(),
		H: zeroFill(date.getHours(), 2),
		m: zeroFill(date.getMinutes(), 2)
	});
}

declare global {
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
	var daytime_format: (timestamp: number) => string;
}

daytime_format = (timestamp) =>
{
	const date = new Date(1e3 * timestamp);
	return dojo.string.substitute("${H}:${m}", {
		H: zeroFill(date.getHours(), 2),
		m: zeroFill(date.getMinutes(), 2)
	});
}

declare global {
	/**
	 * Checks if the given value is undefined.
	 * @param value The value to check.
	 * @returns True if the value is undefined, false otherwise.
	 */
	var isset: <T>(value: T) => value is T & ({} | null);
}

isset = (value) => undefined !== value;

declare global {
	/**
	 * Converts the given value (base 10) to a number. If the value is null, it is returned as null.
	 * This is simply a wrapper for the `parseInt` function, but with a null check.
	 * @param value The value to convert to a number.
	 * @returns The value as a number, or null if the value is null.
	 */
	var toint: {
		(value: null): null;
		(value: number): number;
		(value: string | number | undefined): number | typeof NaN;
		(value: string | number | null | undefined): number | typeof NaN | null;
	};
}

// @ts-ignore - This is a function overload.
toint = (value) => null === value ? null : parseInt(String(value), 10);

declare global {
	/**
	 * Converts the given value to a floating point number. If the value is null, it is returned as null.
	 * This is simply a wrapper for the `parseFloat` function, but with a null check.
	 * @param value The value to convert to a number.
	 * @returns The value as a number, or null if the value is null.
	 */
	var tofloat: {
		(value: null): null;
		(value: number): number;
		(value: string | number | undefined): number | typeof NaN;
		(value: string | number | null | undefined): number | typeof NaN | null;
	}
}

// @ts-ignore - This is a function overload.
tofloat = (value) => null === value ? null : parseFloat(String(value));

declare global {
	/**
	 * Pads the start of the string with zeros until it reaches the given length.
	 * This is the equivalent of the {@link String.prototype.padStart} function, using {length} and '0' as the arguments.
	 * @param str The string to pad with zeros
	 * @param width The width to pad the number to.
	 * @returns The new string with the padded zeros. The length of the string will be at least the width. (if it was already longer, it will not be shortened)
	 */
	var zeroFill: (str: any, width: number) => string;
}

zeroFill = (str, width) =>
{
	return (width -= str.toString().length) > 0 ?
		new Array(width + (/\./.test(str) ? 2 : 1)).join("0") + str :
		str;
}

declare global {
	/**
	 * Capitalizes the first letter of the given string.
	 * @param str The string to capitalize.
	 * @returns The string with the first letter capitalized.
	 */
	var ucFirst: (str: string) => string;
}

ucFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

declare global {
	/**
	 * Formats the given number with the given number by adding spaces after every 3 digits.
	 * @param number The number to format.
	 * @returns The formatted number.
	 */
	var format_number: (number: number) => string;
}

format_number = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

declare global {
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
	var playSound: (sound: string) => void;
}

playSound = (sound) =>
{
	if (soundManager.flashMedia && soundManager.flashMedia.doPlay && "function" == typeof soundManager.flashMedia.doPlay) {
		if (soundManager.bMuteSound) return;
		try {
			undefined !== soundManager.volume ? soundManager.doPlay({ id: sound, volume: soundManager.volume }) : soundManager.doPlay({ id: sound });
		} catch (e) {}
	}
	soundManager.html5 && soundManager.doPlay({ id: sound });
}

declare global {
	/**
	 * Called from {@link playSound} to actually play the sound. Unlike using {@link playSound}, this function does not check for the muted status, does not catch errors, and does not use {@link SoundManager.getSoundIdFromEvent} to update sound aliases.
	 * 
	 * This is an alias for {@link SoundManager.doPlayFile}.
	 * 
	 * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
	 */
	var playSoundFile: (sound: string) => void;
}

playSoundFile = (sound) =>
{
	soundManager.html5 && soundManager.doPlayFile(sound);
}

declare global {
	/**
	 * Stops the sound with the given name. This is done by pausing the audio element with the given id.
	 * 
	 * This is an alias for {@link SoundManager.stop}.
	 * 
	 * @param sound The name of the sound file to stop in the form '<gamename>_<soundname>'.
	 * @example
	 * stopSound('yourgamename_yoursoundname');
	 */
	var stopSound: (sound: string) => void;
}

stopSound= (sound) =>
{
	if (soundManager.flashMedia && soundManager.flashMedia.doPlay && "function" == typeof soundManager.flashMedia.doPlay)
		try {
			soundManager.stop({ id: sound });
		} catch (e) {}
	soundManager.html5 && soundManager.stop({ id: sound });
}

declare global {
	/**
	 * The global translation function for page specific elements, used to translate a key (usually English string).
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 * 
	 * This is an alias for {@link g_i18n.getSimpleTranslation}, with checks to ensure the translation is not undefined.
	 */
	var _: (key: string) => string;
}

_ = (key) =>
{
	if ("undefined" == typeof g_i18n) {
		console.error("Try to use a translated string in JS object declaration : impossible => string is NOT translated");
		console.error("String not translated : " + key);
		return key;
	}
	return g_i18n.getSimpleTranslation(key);
}

declare global {
	/**
	 * The global translation dictionary, where the first key is the bundle to pull translations from, and the second is the key in that bundle.
	 * @param bundle The bundle to pull translations from.
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 * 
	 * This is an alias for {@link g_i18n.getTranslation}, with checks to ensure the translation is not undefined.
	 */
	var __: (bundle: string, key: string) => string
}

__ = (bundle, key) =>
{
	if ("undefined" == typeof g_i18n) {
		console.error("Try to use a translated string in JS object declaration : impossible => string is NOT translated");
		console.error("String not translated : " + key);
		return key;
	}
	return g_i18n.getTranslation(bundle, key);
}

declare global {
	/**
	 * Gets the location description from the given result. This is done by concatenating the long names of each address component.
	 * @param result The result to get the location description from.
	 * @returns The location description.
	 * WIP: The arg type is based on the Google Maps API, but the API type is not fully implemented.
	 */
	var getLocationDescriptionFromResult: (result: { address_components: { long_name: string }[] }) => string;
}

getLocationDescriptionFromResult = (result) =>
{
	let description = "";
	for (const component of result.address_components) {
		if (description) description += ", ";
		description += component.long_name;
	}
	return description;
}

declare global {
	/**
	 * Analyzes the location description from the given result. This is done by extracting the city, area1, area2, and country from the address components.
	 * @param result The result to analyze the location description from.
	 * @returns The analyzed location description.
	 * WIP: The arg type is based on the Google Maps API, but the API type is not fully implemented.
	 */
	var analyseLocationDescriptionFromResult: (result: { address_components: { long_name: string, short_name: string, types: string[] }[] }) => { city: string, area1: string, area2: string, country: string };
}

analyseLocationDescriptionFromResult = (result) =>
{
	const description = { city: "", area1: "", area2: "", country: "" };
	for (const component of result.address_components) {
		for (const type of component.types) {
			if ("administrative_area_level_1" === type) description.area1 = component.long_name;
			else if ("administrative_area_level_2" === type) description.area2 = component.long_name;
			else if ("locality" === type) description.city = component.long_name;
			else if ("country" === type) description.country = component.short_name;
		}
	}
	return description;
}

declare global {
	/**
	 * Converts the given id to a path in the form `x/y/z`, where z is the last 3 digits of the id, y is the next 3 digits, and x is the remaining digits.
	 * @param id The id to convert to a path.
	 * @returns The path in the form `x/y/z`.
	 */
	var id_to_path: (id: number) => string;
}

id_to_path = (id) =>
{
	return Math.floor(id / 1e9) + "/" + Math.floor(id / 1e6) + "/" + Math.floor(id / 1e3);
}

declare global {
	/**
	 * Converts the given player device to an icon name. This is done by returning 'circle' for desktop, 'tablet' for tablet, and 'mobile' for mobile.
	 * @param device The device to convert to an icon name.
	 * @returns The icon name for the given device.
	 */
	var playerDeviceToIcon: (device: 'desktop' | 'tablet' | 'mobile') => string;
}

playerDeviceToIcon = (device) =>
{
	return "desktop" === device ? "circle" : "tablet" === device ? "tablet" : "mobile";
}

class TimeZone {
	utc_offset: string;
	olson_tz: string;
	uses_dst: boolean;

	constructor(utc_offset: string, olson_tz: string, uses_dst: boolean)
	{
		this.utc_offset = utc_offset;
		this.olson_tz = olson_tz;
		this.uses_dst = uses_dst;
	}

	display(): string
	{
		this.ambiguity_check();
		let e = "<b>UTC-offset</b>: " + this.utc_offset + "<br/>";
		e += "<b>Zoneinfo key</b>: " + this.olson_tz + "<br/>";
		return (e += "<b>Zone uses DST</b>: " + (this.uses_dst ? "yes" : "no") + "<br/>");
	}
	ambiguity_check()
	{
		const e = window.jzTimezoneDetector.olson.ambiguity_list[this.olson_tz];
		if (undefined !== e)
			for (let t = e.length, i = 0; i < t; i++) {
				// @ts-ignore - e at index i is a string, not undefined.
				const n: string = e[i];
				// @ts-ignore - dst_start_dates does contain the key n.
				if (window.jzTimezoneDetector.date_is_dst(window.jzTimezoneDetector.olson.dst_start_dates[n])) {
					this.olson_tz = n;
					return;
				}
			}
	}
}

jzTimezoneDetector.date_is_dst = (date) =>
{
	const t = date.getMonth() > 5 ? jzTimezoneDetector.get_june_offset() : jzTimezoneDetector.get_january_offset(),
		i = jzTimezoneDetector.get_date_offset(date);
	return 0 !== toint(t - i);
}

jzTimezoneDetector.get_date_offset = (date) =>
{
	return -date.getTimezoneOffset();
}

jzTimezoneDetector.get_timezone_info = () =>
{
	const e = jzTimezoneDetector.get_january_offset(),
		t = jzTimezoneDetector.get_june_offset(),
		i = e - t;
	return i < 0 ? {
		utc_offset: e,
		dst: 1,
		hemisphere: jzTimezoneDetector.HEMISPHERE_NORTH
	} : i > 0 ? {
		utc_offset: t,
		dst: 1,
		hemisphere: jzTimezoneDetector.HEMISPHERE_SOUTH
	} : {
		utc_offset: e,
		dst: 0,
		hemisphere: jzTimezoneDetector.HEMISPHERE_UNKNOWN
	};
}

jzTimezoneDetector.get_january_offset = () =>
{
	return jzTimezoneDetector.get_date_offset(new Date(2011, 0, 1, 0, 0, 0, 0));
}

jzTimezoneDetector.get_june_offset = () =>
{
	return jzTimezoneDetector.get_date_offset(new Date(2011, 5, 1, 0, 0, 0, 0));
}

jzTimezoneDetector.determine_timezone = () =>
{
	let e = jzTimezoneDetector.get_timezone_info(),
		t = "";
	e.hemisphere === jzTimezoneDetector.HEMISPHERE_SOUTH && (t = ",s");
	const i = e.utc_offset + "," + e.dst + t;
	// @ts-ignore - timezones does contain the key i.
	return { timezone: jzTimezoneDetector.olson.timezones[i], key: i };
}

declare global {
	/**
	 * Helper object for detecting the timezone of the user, and relevant timezone information.
	 */
	var jzTimezoneDetector: {
		HEMISPHERE_SOUTH: "SOUTH";
		HEMISPHERE_NORTH: "NORTH";
		HEMISPHERE_UNKNOWN: "N/A";
		olson: {
			ambiguity_list: Record<string, string[]>;
			dst_start_dates: Record<string, Date>;
			timezones: Record<`${"-" | ""}${number},${0 | 1}${",s" | ""}`, TimeZone>;
		};
		TimeZone: typeof TimeZone;
		date_is_dst: (date: Date) => boolean;
		get_date_offset: (date: Date) => number;
		get_timezone_info: () => { utc_offset: number, dst: number, hemisphere: "SOUTH" | "NORTH" | "N/A" };
		get_january_offset: () => number;
		get_june_offset: () => number;
		determine_timezone: () => { timezone: TimeZone, key: string };
	}
}

declare global {
	/**
	 * Focuses and sets the selection range for the given input element using {@link HTMLInputElement.setSelectionRange}.
	 * This has a fallback for older browsers using `createTextRange`.
	 * @param element The input element to set the selection range for.
	 * @param position The position to set the caret to.
	 */
	var setCaretPosition: (element: HTMLInputElement | { createTextRange: () => object }, position: number) => void;
}

setCaretPosition = (element, position) =>
{
	if ((element as HTMLInputElement).setSelectionRange) {
		(element as HTMLInputElement).focus();
		(element as HTMLInputElement).setSelectionRange(position, position);
	// @ts-ignore.
	} else if (element.createTextRange) {
		// @ts-ignore.
		const range = element.createTextRange();
		range.collapse(true);
		range.moveEnd("character", position);
		range.moveStart("character", position);
		range.select();
	}
}

declare global {
	/**
	 * Replaces all instances of the given substring in the given string with the new substring. This is the same as using the {@link String.prototype.replace} function, but escapes punctuation in the find string.
	 * @param str The string to replace the substrings in.
	 * @param find The substring to find.
	 * @param replace The substring to replace the found substrings with.
	 * @returns The string with all instances of the find substring replaced with the replace substring.
	 */
	var replaceAll: (str: string, find: string, replace: string) => string;
}

replaceAll = (str, find, replace) =>
{
	const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return str.replace(new RegExp(escapedFind, "g"), replace);
}

declare global {
	/**
	 * Removes all duplicate elements from the given array.
	 * @param array The array to remove duplicates from.
	 * @returns The array with all duplicate elements removed.
	 */
	var array_unique: <T extends keyof any>(array: T[]) => T[];
}

array_unique = (array) =>
{
	const unique: Record<keyof any, boolean> = {};
	return array.filter((item) => {
		return !unique.hasOwnProperty(item) &&
			(unique[item] = true);
	});
}

declare global {
	/**
	 * Extracts the domain from the given url. This is done by returning the protocol and domain of the url.
	 * @param url The url to extract the domain from.
	 * @returns The domain of the url.
	 * @example
	 * extractDomain('https://www.example.com/path/to/file.html'); // Returns: 'https://www.example.com'
	 */
	var extractDomain: (url: string) => string | undefined;
}

extractDomain = (url) =>
{
	return url.indexOf("://") > -1 ?
		url.split("/")[0] + "/" + url.split("/")[1] + "/" + url.split("/")[2] :
		url.split("/")[0];
}

//
//#region Cookie Consent
//

class CookieConsentUtils
{
	escapeRegExp(e: string): string
	{
		return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	hasClass(e: HTMLElement, t: string): boolean
	{
		const i = " ";
		return 1 === e.nodeType &&
			(i + e.className + i)
				.replace(/[\n\t]/g, i)
				.indexOf(i + t + i) >= 0;
	}

	addClass(e: HTMLElement, t: string): void
	{
		e.className += " " + t;
	}

	removeClass(e: HTMLElement, t: string): void
	{
		// @ts-ignore - this context is the utils object.
		const i = new RegExp("\\b" + this.escapeRegExp(t) + "\\b");
		e.className = e.className.replace(i, "");
	}

	interpolateString(e: string, t: Function): string
	{
		return e.replace(/{{([a-z][a-z0-9\-_]*)}}/gi, function (e) {
			return t(arguments[1]) || "";
		});
	}

	getCookie(e: string): string | undefined
	{
		const t = ("; " + document.cookie).split("; " + e + "=");
		// @ts-ignore - pop will always return a string.
		return 2 != t.length ? undefined : t.pop().split(";").shift();
	}

	setCookie(e: string, t: string, i: number, n: string, o: string): void
	{
		const a = new Date();
		a.setDate(a.getDate() + (i || 365));
		const s = [
			e + "=" + t,
			"expires=" + a.toUTCString(),
			"path=" + (o || "/")
		];
		n && s.push("domain=" + n), (document.cookie = s.join(";"));
	}

	deepExtend(e: Record<string, any>, t: Record<string, any>): Record<string, any>
	{
		for (const i in t)
			t.hasOwnProperty(i) &&
				(i in e &&
				this.isPlainObject(e[i]) &&
				this.isPlainObject(t[i])
					? this.deepExtend(e[i], t[i])
					: (e[i] = t[i]));
		return e;
	}

	throttle(e: Function, t: number): Function
	{
		let i = false;
		return function (this: any) {
			i ||
				(e.apply(this, arguments),
				(i = true),
				setTimeout(function () {
					i = false;
				}, t));
		};
	}

	hash(e: string): number
	{
		let t: number = 0, i = e.length, n = 0;
		if (0 === e.length) return n;
		for (; t < i; ++t)
			(n = (n << 5) - n + e.charCodeAt(t)), (n |= 0);
		return n;
	}

	normaliseHex(e: string): string
	{
		return (
			"#" == e[0] && (e = e.substr(1)),
			3 == e.length &&
				// @ts-ignore - string is length 3 so no undefined error.
				(e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]),
			e
		);
	}

	getContrast(e: string): string
	{
		// @ts-ignore - this context is the utils object.
		e = this.normaliseHex(e);
		return (299 * parseInt(e.substr(0, 2), 16) +
			587 * parseInt(e.substr(2, 2), 16) +
			114 * parseInt(e.substr(4, 2), 16)) / 1e3 >=
			128
			? "#000"
			: "#fff";
	}

	getLuminance(e: string): string
	{
		const t = parseInt(this.normaliseHex(e), 16),
			i = 38 + (t >> 16),
			n = 38 + ((t >> 8) & 255),
			o = 38 + (255 & t);
		return (
			"#" +
			(
				16777216 +
				65536 * (i < 255 ? (i < 1 ? 0 : i) : 255) +
				256 * (n < 255 ? (n < 1 ? 0 : n) : 255) +
				(o < 255 ? (o < 1 ? 0 : o) : 255)
			)
				.toString(16)
				.slice(1)
		);
	}

	isMobile(): boolean
	{
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}

	isPlainObject(e: any): boolean
	{
		return (
			"object" == typeof e && null !== e && e.constructor == Object
		);
	}
}

declare var e: CookieConsent;
declare var t: CookieConsentUtils;
declare var i: string[];

class CookieConsent
{
	hasInitialised: boolean = true;
	status = {
		deny: "deny",
		allow: "allow",
		dismiss: "dismiss",
	};
	/**
	 * The css property used on this browser for ending transitions.
	 */
	transitionEnd: string = (function () {
		const testElement = document.createElement("div");
		const transitionEndNames = {
			t: "transitionend",
			OT: "oTransitionEnd",
			msT: "MSTransitionEnd",
			MozT: "transitionend",
			WebkitT: "webkitTransitionEnd"
		};
		for (const i in transitionEndNames)
			// @ts-ignore - testing if style exists
			if (transitionEndNames.hasOwnProperty(i) && undefined !== testElement.style[i + "ransition"])
				// @ts-ignore - always returns
				return transitionEndNames[i];
	})();
	hasTransition: boolean = !!cookieconsent.transitionEnd;
	customStyles: Record<string, { references: number, element: CSSStyleSheet | null } | null> = {};
	Popup = CookieConsentPopup;
	Location = CookieConsentLocation;
	Law = CookieConsentLaw;

	initialise(
		t: any,
		i?: ((popup: CookieConsentPopup) => void) | (() => void) | null,
		n?: ((error: Error, popup: CookieConsentPopup) => void) | (() => void)): void
	{
		var o = new e.Law(t.law);
		i || (i = function () {}),
		n || (n = function () {}),
		e.getCountryCode(
			t,
			function (n: { code?: string | null }) {
				delete t.law,
				delete t.location,
				n.code && (t = o.applyLaw(t, n.code)),
				// @ts-ignore - function is not falsy
				i(new e.Popup(t));
			},
			function (i: any) {
				// @ts-ignore - function is not falsy
				delete t.law, delete t.location, n(i, new e.Popup(t));
			}
		);
	}

	getCountryCode(t: any, i: Function, errorCallback: (t: any) => void): void
	{
		if (t.law && t.law.countryCode) i({ code: t.law.countryCode });
		else if (t.location) {
			new e.Location(t.location).locate(function (e) {
				i(e || {});
			}, errorCallback);
		} else i({});
	}

	utils = t;
}

class CookieConsentPopup
{
	private openingTimeout: number | null = null;
	private afterTransition: EventListener | null = null;
	private onButtonClick: ((n: MouseEvent) => void) | null = null;
	private customStyleSelector: string | null = null;
	private element: HTMLElement | null = null;
	private revokeBtn: HTMLElement | null = null;
	private dismissTimeout: number | null = null;
	private onWindowScroll: EventListener | null = null;
	private onMouseMove: ((ev: MouseEvent) => any) | null = null;
	// @ts-ignore - options not set until initialise is called.
	private options: {
		enabled: boolean;
		container: HTMLElement | null;
		cookie: {
			name: string;
			path: string;
			domain: string;
			expiryDays: number;
		};
		onPopupOpen: () => void;
		onPopupClose: () => void;
		onInitialise: (status: string) => void;
		onStatusChange: (status: string, hasAnswered: boolean) => void;
		onRevokeChoice: () => void;
		content: {
			header: string;
			message: string;
			dismiss: string;
			allow: string;
			deny: string;
			link: string;
			href: string;
			close: string;
		};
		elements: {
			header: string;
			message: string;
			messagelink: string;
			dismiss: string;
			allow: string;
			deny: string;
			link: string;
			close: string;
		};
		window: string;
		revokeBtn: string;
		compliance: {
			info: string;
			"opt-in": string;
			"opt-out": string;
		};
		type: string;
		layouts: {
			basic: string;
			"basic-close": string;
			"basic-header": string;
		};
		layout: string;
		position: string;
		theme: string;
		static: boolean;
		palette: Record<string, any> | null;
		revokable: boolean;
		animateRevokable: boolean;
		showLink: boolean;
		dismissOnScroll: boolean;
		dismissOnTimeout: boolean;
		autoOpen: boolean;
		autoAttach: boolean;
		whitelistPage: string[];
		blacklistPage: string[];
		overrideHTML: string | null;
	};


	private n() {
		// @ts-ignore - ignoring arguments match
		this.initialise.apply(this, arguments);
	}

	private o(e: HTMLElement) {
		(this.openingTimeout = null),
			t.removeClass(e, "cc-invisible");
	}

	private a(t: HTMLElement) {
		(t.style.display = "none"),
			t.removeEventListener(
				e.transitionEnd,
				this.afterTransition as EventListener
			),
			(this.afterTransition = null);
	}

	private s() {
		var t = this.options.onInitialise.bind(this);
		if (!window.navigator.cookieEnabled)
			return t(e.status.deny), true;
		// @ts-ignore - navigator does not have CookiesOK property.
		if (window.CookiesOK || window.navigator.CookiesOK)
			return t(e.status.allow), true;
		var i = Object.keys(e.status),
			n = this.getStatus() as string,
			o = i.indexOf(n) >= 0;
		return o && t(n), o;
	}

	private r() {
		var e = this.options.position.split("-"),
			t: string[] = [];
		return (
			e.forEach(function (e: string) {
				t.push("cc-" + e);
			}),
			t
		);
	}

	private l() {
		var e = this.options,
			i =
				"top" == e.position || "bottom" == e.position
					? "banner"
					: "floating";
		t.isMobile() && (i = "floating");
		var n = [
			"cc-" + i,
			"cc-type-" + e.type,
			"cc-theme-" + e.theme,
		];
		e.static && n.push("cc-static"),
			n.push.apply(n, this.r());
		this.u.call(this, this.options.palette!);
		return (
			this.customStyleSelector &&
			n.push(this.customStyleSelector),
			n
		);
	}

	private d() {
		var e: Record<string, string> = {},
			i = this.options;
		i.showLink ||
			((i.elements.link = ""),
				(i.elements.messagelink = i.elements.message)),
			Object.keys(i.elements).forEach(function (n) {
				// @ts-ignore - ignoring undefined for elements
				e[n] = t.interpolateString(i.elements[n], function (e: keyof typeof i.content) {
					var t = i.content[e];
					return e && "string" == typeof t && t.length ? t : "";
				});
			});
		// @ts-ignore - ignoring undefined for compliance
		var n: string = i.compliance[i.type];
		n || (n = i.compliance.info),
			(e['compliance'] = t.interpolateString(n, function (t: keyof typeof i.content) {
				return e[t];
			}));
		// @ts-ignore - ignoring undefined for layouts
		var o = i.layouts[i.layout];
		return (
			o || (o = i.layouts.basic),
			t.interpolateString(o, function (t: keyof typeof e) {
				return e[t];
			})
		);
	}

	private c(i: string): HTMLElement {
		var n = this.options,
			o = document.createElement("div"),
			a =
				n.container && 1 === n.container.nodeType
					? n.container
					: document.body;
		o.innerHTML = i;
		var s = o.children[0] as HTMLElement;
		return (
			(s.style.display = "none"),
			t.hasClass(s, "cc-window") &&
			e.hasTransition &&
			t.addClass(s, "cc-invisible"),
			(this.onButtonClick = this.h.bind(this)),
			s.addEventListener("click", this.onButtonClick),
			n.autoAttach &&
			(a.firstChild
				? a.insertBefore(s, a.firstChild)
				: a.appendChild(s)),
			s
		) as HTMLElement;
	}

	private h(n: MouseEvent) {
		var o = n.target as HTMLElement;
		if (t.hasClass(o, "cc-btn")) {
			var a = o.className.match(
				new RegExp("\\bcc-(" + i.join("|") + ")\\b")
			),
				s = (a && a[1]) || false;
			s && (this.setStatus(s), this.close(true));
		}
		t.hasClass(o, "cc-close") &&
			(this.setStatus(e.status.dismiss), this.close(true)),
			t.hasClass(o, "cc-revoke") && this.revokeChoice();
	}

	private u(e: Record<string, any>) {
		var i = t.hash(JSON.stringify(e)),
			n = "cc-color-override-" + i,
			o = t.isPlainObject(e);
		return (
			(this.customStyleSelector = o ? n : null),
			o && this.p(i, e, "." + n),
			o
		);
	}

	private p(i: number, n: { popup?: any, button?: any, highlight?: any }, o: string) {
		if (e.customStyles[i]) ++e.customStyles[i].references;
		else {
			var a: Record<string, string[]> = {},
				s = n.popup,
				r = n.button,
				l = n.highlight;
			s &&
				((s.text = s.text ? s.text : t.getContrast(s.background)),
					(s.link = s.link ? s.link : s.text),
					(a[o + ".cc-window"] = [
						"color: " + s.text,
						"background-color: " + s.background,
					]),
					(a[o + ".cc-revoke"] = [
						"color: " + s.text,
						"background-color: " + s.background,
					]),
					(a[
						o +
						" .cc-link," +
						o +
						" .cc-link:active," +
						o +
						" .cc-link:visited"
					] = ["color: " + s.link]),
					r &&
					((r.text = r.text
						? r.text
						: t.getContrast(r.background)),
						(r.border = r.border ? r.border : "transparent"),
						(a[o + " .cc-btn"] = [
							"color: " + r.text,
							"border-color: " + r.border,
							"background-color: " + r.background,
						]),
						"transparent" != r.background &&
						(a[o + " .cc-btn:hover, " + o + " .cc-btn:focus"] = [
							"background-color: " + this.m(r.background),
						]),
						l
							? ((l.text = l.text
								? l.text
								: t.getContrast(l.background)),
								(l.border = l.border ? l.border : "transparent"),
								(a[o + " .cc-highlight .cc-btn:first-child"] = []))
							: (a[o + " .cc-highlight .cc-btn:first-child"] =
								[])));
			var d = document.createElement("style");
			document.head.appendChild(d),
				(e.customStyles[i] = { references: 1, element: d.sheet });
			var c = -1;
			for (var h in a)
				a.hasOwnProperty(h) &&
					// @ts-ignore - sheet is already defined and property must exist.
					d.sheet.insertRule(h + "{" + a[h].join(";") + "}", ++c);
		}
	}

	private m(e: string) {
		return "000000" == (e = t.normaliseHex(e))
			? "#222"
			: t.getLuminance(e);
	}

	private g(e: (string | RegExp)[], t: string) {
		for (var i = 0, n = e.length; i < n; ++i) {
			var o = e[i];
			if (
				(o instanceof RegExp && o.test(t)) ||
				("string" == typeof o && o.length && o === t)
			)
				return true;
		}
		return false;
	}

	private _() {
		var t = this.setStatus.bind(this),
			i = this.options.dismissOnTimeout;
		"number" == typeof i &&
			i >= 0 &&
			(this.dismissTimeout = window.setTimeout(function () {
				t(e.status.dismiss);
			}, Math.floor(i)));
		var n: number | boolean = this.options.dismissOnScroll;
		if ("number" == typeof n && n >= 0) {
			var o = function (this: CookieConsentPopup, i: Event) {
				window.pageYOffset > Math.floor(n as number) &&
					(t(e.status.dismiss),
						window.removeEventListener("scroll", o),
						(this.onWindowScroll = null));
			};
			(this.onWindowScroll = o),
				window.addEventListener("scroll", o);
		}
	}

	private f() {
		if (
			"info" != this.options.type &&
			(this.options.revokable = true),
			t.isMobile() && (this.options.animateRevokable = false),
			this.options.revokable
		) {
			var e = this.r.call(this);
			this.options.animateRevokable && e.push("cc-animate"),
				this.customStyleSelector &&
				e.push(this.customStyleSelector);
			var i = this.options.revokeBtn.replace(
				"{{classes}}",
				e.join(" ")
			);
			this.revokeBtn = this.c.call(this, i);
			var n = this.revokeBtn;
			if (this.options.animateRevokable) {
				var o = t.throttle(function (e: MouseEvent) {
					var i = false,
						o = window.innerHeight - 20;
					t.hasClass(n, "cc-top") && e.clientY < 20 && (i = true),
						t.hasClass(n, "cc-bottom") &&
						e.clientY > o &&
						(i = true),
						i
							? t.hasClass(n, "cc-active") ||
							t.addClass(n, "cc-active")
							: t.hasClass(n, "cc-active") &&
							t.removeClass(n, "cc-active");
				}, 200);
				(this.onMouseMove = o as ((ev: MouseEvent) => any)),
					window.addEventListener("mousemove", this.onMouseMove);
			}
		}
	}

	private static v = {
		enabled: true,
		container: null,
		cookie: {
			name: "cookieconsent_status",
			path: "/",
			domain: "",
			expiryDays: 365,
		},
		onPopupOpen: function () { },
		onPopupClose: function () { },
		onInitialise: function (e: string) { },
		onStatusChange: function (e: string, t: boolean) { },
		onRevokeChoice: function () { },
		content: {
			header: "Cookies used on the website!",
			message:
				"This website uses cookies to ensure you get the best experience on our website.",
			dismiss: "Got it!",
			allow: "Allow cookies",
			deny: "Decline",
			link: "Learn more",
			href: "http://cookiesandyou.com",
			close: "&#x274c;",
		},
		elements: {
			header: '<span class="cc-header">{{header}}</span>&nbsp;',
			message:
				'<span id="cookieconsent:desc" class="cc-message">{{message}}</span>',
			messagelink:
				'<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" role=button tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a></span>',
			dismiss:
				'<a aria-label="dismiss cookie message" role=button tabindex="0" class="cc-btn cc-dismiss">{{dismiss}}</a>',
			allow:
				'<a aria-label="allow cookies" role=button tabindex="0"  class="cc-btn cc-allow">{{allow}}</a>',
			deny: '<a aria-label="deny cookies" role=button tabindex="0" class="cc-btn cc-deny">{{deny}}</a>',
			link: '<a aria-label="learn more about cookies" role=button tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a>',
			close:
				'<span aria-label="dismiss cookie message" role=button tabindex="0" class="cc-close">{{close}}</span>',
		},
		window:
			'<div role="dialog" aria-live="polite" aria-label="cookieconsent" aria-describedby="cookieconsent:desc" class="cc-window {{classes}}">\x3c!--googleoff: all--\x3e{{children}}\x3c!--googleon: all--\x3e</div>',
		revokeBtn:
			'<div class="cc-revoke {{classes}}">Cookie Policy</div>',
		compliance: {
			info: '<div class="cc-compliance">{{dismiss}}</div>',
			"opt-in":
				'<div class="cc-compliance cc-highlight">{{dismiss}}{{allow}}</div>',
			"opt-out":
				'<div class="cc-compliance cc-highlight">{{deny}}{{dismiss}}</div>',
		},
		type: "info",
		layouts: {
			basic: "{{messagelink}}{{compliance}}",
			"basic-close": "{{messagelink}}{{compliance}}{{close}}",
			"basic-header":
				"{{header}}{{message}}{{link}}{{compliance}}",
		},
		layout: "basic",
		position: "bottom",
		theme: "block",
		static: false,
		palette: null,
		revokable: false,
		animateRevokable: true,
		showLink: true,
		dismissOnScroll: false,
		dismissOnTimeout: false,
		autoOpen: true,
		autoAttach: true,
		whitelistPage: [],
		blacklistPage: [],
		overrideHTML: null,
	};

	public initialise(e: Record<string, any>) {
		this.options && this.destroy(),
			t.deepExtend((this.options = CookieConsentPopup.v), CookieConsentPopup.v),
			t.isPlainObject(e) && t.deepExtend(this.options, e),
			this.s() && (this.options.enabled = false),
			this.g(this.options.blacklistPage, location.pathname) &&
			(this.options.enabled = false),
			this.g(this.options.whitelistPage, location.pathname) &&
			(this.options.enabled = true);
		var i = this.options.window
			.replace("{{classes}}", this.l().join(" "))
			.replace("{{children}}", this.d()),
			n = this.options.overrideHTML;
		if (
			"string" == typeof n && n.length && (i = n),
			this.options.static
		) {
			var o = this.c(
				'<div class="cc-grower">' + i + "</div>"
			);
			(o.style.display = ""),
				(this.element = o.firstChild as HTMLElement),
				(this.element.style.display = "none"),
				t.addClass(this.element, "cc-invisible");
		} else this.element = this.c(i);
		this._(),
			this.f(),
			this.options.autoOpen && this.autoOpen();
	}

	public destroy() {
		this.onButtonClick &&
			this.element &&
			(this.element.removeEventListener(
				"click",
				this.onButtonClick
			),
				(this.onButtonClick = null)),
			this.dismissTimeout &&
			(clearTimeout(this.dismissTimeout),
				(this.dismissTimeout = null)),
			this.onWindowScroll &&
			(window.removeEventListener(
				"scroll",
				this.onWindowScroll
			),
				(this.onWindowScroll = null)),
			this.onMouseMove &&
			(window.removeEventListener(
				"mousemove",
				this.onMouseMove
			),
				(this.onMouseMove = null)),
			this.element &&
			this.element.parentNode &&
			this.element.parentNode.removeChild(this.element),
			(this.element = null),
			this.revokeBtn &&
			this.revokeBtn.parentNode &&
			this.revokeBtn.parentNode.removeChild(this.revokeBtn),
			(this.revokeBtn = null),
			(function (i) {
				if (t.isPlainObject(i)) {
					var n = t.hash(JSON.stringify(i)),
						o = e.customStyles[n];
					if (o && !--o.references) {
						var a = o.element!.ownerNode;
						a && a.parentNode && a.parentNode.removeChild(a),
							(e.customStyles[n] = null);
					}
				}
			})(this.options.palette),
			// @ts-ignore - ignoring setting options null
			(this.options = null);
	}

	public open(_?: any) {
		if (this.element)
			return (
				this.isOpen() ||
				(e.hasTransition
					? this.fadeIn()
					: (this.element.style.display = ""),
					this.options.revokable && this.toggleRevokeButton(),
					this.options.onPopupOpen.call(this)),
				this
			);
		return undefined;
	}

	public close(t: boolean) {
		if (this.element)
			return (
				this.isOpen() &&
				(e.hasTransition
					? this.fadeOut()
					: (this.element.style.display = "none"),
					t &&
					this.options.revokable &&
					this.toggleRevokeButton(true),
					this.options.onPopupClose.call(this)),
				this
			);
		return undefined;
	}

	public fadeIn() {
		var i = this.element;
		if (
			e.hasTransition &&
			i &&
			(this.afterTransition && this.a(i),
				t.hasClass(i, "cc-invisible"))
		) {
			if (((i.style.display = ""), this.options.static)) {
				var n = this.element!.clientHeight;
				(this.element!.parentNode as HTMLElement).style.maxHeight = n + "px";
			}
			this.openingTimeout = setTimeout(this.o.bind(this, i), 20);
		}
	}

	public fadeOut() {
		var i = this.element;
		e.hasTransition &&
			i &&
			(this.openingTimeout &&
				(clearTimeout(this.openingTimeout), this.o(i)),
				t.hasClass(i, "cc-invisible") ||
				(this.options.static &&
					((this.element!.parentNode as HTMLElement).style.maxHeight = ""),
					(this.afterTransition = this.a.bind(this, i)),
					i.addEventListener(
						e.transitionEnd,
						this.afterTransition
					),
					t.addClass(i, "cc-invisible")));
	}

	public isOpen() {
		return (
			this.element &&
			"" == this.element.style.display &&
			(!e.hasTransition ||
				!t.hasClass(this.element, "cc-invisible"))
		);
	}

	public toggleRevokeButton(e?: boolean) {
		this.revokeBtn &&
			(this.revokeBtn.style.display = e ? "" : "none");
	}

	public revokeChoice(e?: any) {
		(this.options.enabled = true),
			this.clearStatus(),
			this.options.onRevokeChoice.call(this),
			e || this.autoOpen();
	}

	public hasAnswered(_?: any) {
		// @ts-ignore - ignoring undefined for getStatus
		return Object.keys(e.status).indexOf(this.getStatus()) >= 0;
	}

	public hasConsented(_?: any) {
		var i = this.getStatus();
		return i == e.status.allow || i == e.status.dismiss;
	}

	public autoOpen(_?: any) {
		!this.hasAnswered() && this.options.enabled && this.open();
	}

	public setStatus(i: string) {
		var n = this.options.cookie,
			o = t.getCookie(n.name),
			// @ts-ignore - ignoring undefined for getCookie
			a = Object.keys(e.status).indexOf(o) >= 0;
		Object.keys(e.status).indexOf(i) >= 0
			? (t.setCookie(n.name, i, n.expiryDays, n.domain, n.path),
				this.options.onStatusChange.call(this, i, a))
			: this.clearStatus();
	}

	public getStatus() {
		return t.getCookie(this.options.cookie.name);
	}

	public clearStatus() {
		var e = this.options.cookie;
		t.setCookie(e.name, "", -1, e.domain, e.path);
	}
}

interface CookieConsentLocationServiceContext {
	url: string;
	callback?: (e: any, t: string) => any;
	isScript?: boolean;
	data?: Document | XMLHttpRequestBodyInit | null;
	headers?: string[];
	__JSONP_DATA?: string;
}

class CookieConsentLocation {
	options: Record<string, any> & {
		timeout?: number;
		services?: (string | Function | { name: string })[];
		serviceDefinitions?: Record<string, any>;
	} = {};
	currentServiceIndex: number = -1;
	callbackComplete?: ((e: any) => void) | null;
	callbackError?: ((e: any) => void) | null;

	constructor(e: Record<string, any>) {
		t.deepExtend((this.options = {}), CookieConsentLocation.a),
			t.isPlainObject(e) && t.deepExtend(this.options, e),
			(this.currentServiceIndex = -1);
	}

	private i(e: { type?: string, src: string } | string, t: ((arg?: any) => void) & { done?: boolean }, i: number) {
		var n: number,
			o = document.createElement("script") as HTMLScriptElement & XMLHttpRequest;
		// @ts-ignore - checking if type exists
		(o.type = "text/" + (e.type || "javascript")),
			// @ts-ignore - checking if src exists
			(o.src = e.src || e),
			(o.async = false),
			(o.onreadystatechange = o.onload =
				function () {
					var e = o.readyState;
					clearTimeout(n),
						t.done ||
						(e && !/loaded|complete/.test(e.toString())) ||
						((t.done = true),
							t(),
							(o.onreadystatechange = o.onload = null));
				}),
			document.body.appendChild(o),
			(n = setTimeout(function () {
				(t.done = true),
					t(),
					(o.onreadystatechange = o.onload = null);
			}, i));
	}

	private n(e: string, t: (a: any) => void, i: boolean, n: Document | XMLHttpRequestBodyInit | null, o: string[] | any) {
		// @ts-ignore - Extra param when using window
		var a = new (window.XMLHttpRequest || window.ActiveXObject)("MSXML2.XMLHTTP.3.0");
		if (
			(a.open(n ? "POST" : "GET", e, true),
				a.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
				a.setRequestHeader(
					"Content-type",
					"application/x-www-form-urlencoded"
				),
				Array.isArray(o))
		)
			for (var s = 0, r = o.length; s < r; ++s) {
				// @ts-ignore - index is always valid
				var l = o[s].split(":", 2);
				a.setRequestHeader(
					// @ts-ignore - split is always valid
					l[0].replace(/^\s+|\s+$/g, ""),
					// @ts-ignore - split is always valid
					l[1].replace(/^\s+|\s+$/g, "")
				);
			}
		"function" == typeof t &&
			(a.onreadystatechange = function () {
				a.readyState > 3 && t(a);
			}),
			a.send(n);
	}

	private o(e: { code?: string, error: string }) {
		return new Error(
			"Error [" + (e.code || "UNKNOWN") + "]: " + e.error
		);
	}

	private static a = {
		timeout: 5e3,
		services: ["freegeoip", "ipinfo", "maxmind"],
		serviceDefinitions: {
			freegeoip: function () {
				return {
					url: "//freegeoip.net/json/?callback={callback}",
					isScript: true,
					callback: function (this: CookieConsentLocation, _: any, t: string) {
						try {
							var i = JSON.parse(t);
							return i.error ? this.o(i) : { code: i.country_code };
						} catch (n) {
							return this.o({ error: "Invalid response (" + n + ")" });
						}
					},
				};
			},
			ipinfo: function () {
				return {
					url: "//ipinfo.io",
					headers: ["Accept: application/json"],
					callback: function (this: CookieConsentLocation, _: any, t: string) {
						try {
							var i = JSON.parse(t);
							return i.error ? this.o(i) : { code: i.country };
						} catch (n) {
							return this.o({ error: "Invalid response (" + n + ")" });
						}
					},
				};
			},
			ipinfodb: function (_?: any) {
				return {
					url: "//api.ipinfodb.com/v3/ip-country/?key={api_key}&format=json&callback={callback}",
					isScript: true,
					callback: function (this: CookieConsentLocation, _: any, t: string) {
						try {
							var i = JSON.parse(t);
							return "ERROR" == i.statusCode
								? this.o({ error: i.statusMessage })
								: { code: i.countryCode };
						} catch (n) {
							return this.o({ error: "Invalid response (" + n + ")" });
						}
					},
				};
			},
			maxmind: function () {
				return {
					url: "//js.maxmind.com/js/apis/geoip2/v2.1/geoip2.js",
					isScript: true,
					callback: function (this: CookieConsentLocation, e: any) {
						// @ts-ignore - checking for geoip2
						return window.geoip2
							// @ts-ignore - geoip2 was valid
							? void geoip2.country(
								function (this: CookieConsentLocation, t: any) {
									try {
										e({ code: t.country.iso_code });
									} catch (i: any) {
										e(this.o(i));
									}
								},
								function (this: CookieConsentLocation, t: any) {
									e(this.o(t));
								}
							)
							: void e(
								new Error(
									"Unexpected response format. The downloaded script should have exported `geoip2` to the global scope"
								)
							);
					}
				};
			}
		}
	};

	public getNextService() {
		var e;
		do {
			e = this.getServiceByIdx(++this.currentServiceIndex);
		} while (
			this.currentServiceIndex < this.options.services!.length &&
			!e
		);
		return e;
	}

	public getServiceByIdx(e: number) {
		var i = this.options.services![e]!;
		if ("function" == typeof i) {
			var n = i();
			return (
				n.name &&
				t.deepExtend(
					n,
					this.options.serviceDefinitions![n.name](n)
				),
				n
			);
		}
		return "string" == typeof i
			? this.options.serviceDefinitions![i]()
			: t.isPlainObject(i)
				? this.options.serviceDefinitions![i.name](i)
				: null;
	}

	public locate(succussCallback: (e: any) => void, errorCallback: (t: any) => void) {
		var i = this.getNextService();
		return i
			? ((this.callbackComplete = succussCallback),
				(this.callbackError = errorCallback),
				void this.runService(
					i,
					this.runNextServiceOnError.bind(this)
				))
			: void errorCallback(new Error("No services to run"));
	}

	public setupUrl(e: CookieConsentLocationServiceContext) {
		var t = this.getCurrentServiceOpts();
		return e.url.replace(/\{(.*?)\}/g, function (i, n) {
			if ("callback" === n) {
				var o = "callback" + Date.now();
				return (
					// @ts-ignore - window[o] is being set
					(window[o] = function (t: any) {
						e.__JSONP_DATA = JSON.stringify(t);
					}),
					o
				);
			}
			if (n in t.interpolateUrl) return t.interpolateUrl[n];
		});
	}

	public runService(e: CookieConsentLocationServiceContext, t: (e: any, t: any) => void) {
		var o = this;
		if (e && e.url && e.callback) {
			(e.isScript ? this.i : this.n)(
				this.setupUrl(e),
				function (i: any) {
					var n = i ? i.responseText : "";
					e.__JSONP_DATA &&
						((n = e.__JSONP_DATA), delete e.__JSONP_DATA),
						o.runServiceCallback.call(o, t, e, n);
				},
				// @ts-ignore - timeout is typechecked when passed to function
				this.options.timeout,
				e.data,
				e.headers
			);
		}
	}

	public runServiceCallback(callback: (succuss_data: any, error_data?: any) => void, t: CookieConsentLocationServiceContext, i: string) {
		var n = this,
			// @ts-ignore - callback is being set
			callbackArg = t.callback(function (callbackArg) {
				callbackArg || n.onServiceResult.call(n, callback, callbackArg);
			}, i);
		callbackArg && this.onServiceResult.call(this, callback, callbackArg);
	}

	public onServiceResult(callback: (succuss_data: any, error_data?: any) => void, callbackArg?: any) {
		callbackArg instanceof Error || (callbackArg && callbackArg.error)
			? callback.call(this, callbackArg, null)
			: callback.call(this, null, callbackArg);
	}

	public runNextServiceOnError(data: any, callbackArg?: any) {
		if (data) {
			this.logError(data);
			var i = this.getNextService();
			i
				? this.runService(
					i,
					this.runNextServiceOnError.bind(this)
				)
				: this.completeService.call(
					this,
					this.callbackError,
					new Error("All services failed")
				);
		} else
			this.completeService.call(this, this.callbackComplete, callbackArg);
	}

	public getCurrentServiceOpts() {
		var service = this.options.services![this.currentServiceIndex];
		return "string" == typeof service
			? { name: service }
			: "function" == typeof service
				? service()
				: t.isPlainObject(service)
					? service
					: {};
	}

	public completeService(callback?: ((succuss_data: any, error_data?: any) => void) | null, callbackArg?: any) {
		(this.currentServiceIndex = -1), callback && callback(callbackArg);
	}

	public logError(data: any) {
		var t = this.currentServiceIndex,
			i = this.getServiceByIdx(t);
		console.error(
			"The service[" +
			t +
			"] (" +
			i.url +
			") responded with the following error",
			data
		);
	}
}

class CookieConsentLaw
{
	constructor(e: any) {
		// @ts-ignore - this is a constructor
		this.initialise.apply(this, arguments);
	}

	private static i = {
		regionalLaw: true,
		hasLaw: [
			"AT",
			"BE",
			"BG",
			"HR",
			"CZ",
			"CY",
			"DK",
			"EE",
			"FI",
			"FR",
			"DE",
			"EL",
			"HU",
			"IE",
			"IT",
			"LV",
			"LT",
			"LU",
			"MT",
			"NL",
			"PL",
			"PT",
			"SK",
			"SI",
			"ES",
			"SE",
			"GB",
			"UK",
		],
		revokable: [
			"HR",
			"CY",
			"DK",
			"EE",
			"FR",
			"DE",
			"LV",
			"LT",
			"NL",
			"PT",
			"ES",
		],
		explicitAction: ["HR", "IT", "ES"],
	};

	// @ts-ignore - options is set on initialise
	options: typeof CookieConsentLaw.i = {};

	initialise(e: any) {
		t.deepExtend(this.options, CookieConsentLaw.i);
		if (t.isPlainObject(e))
			t.deepExtend(this.options, e);
	}

	get(e: string) {
		var t = this.options;
		return {
			hasLaw: t.hasLaw.indexOf(e) >= 0,
			revokable: t.revokable.indexOf(e) >= 0,
			explicitAction: t.explicitAction.indexOf(e) >= 0,
		};
	}

	applyLaw(e: { enabled: boolean, revokable: boolean, dismissOnScroll: boolean, dismissOnTimeout: boolean }, t: string) {
		var i = this.get(t);
		if (!i.hasLaw)
			e.enabled = false;
		if (this.options.regionalLaw)
		{
			if (i.revokable)
				e.revokable = true;
			if (i.explicitAction)
			{
				e.dismissOnScroll = false;
				e.dismissOnTimeout = false;
			}
		}
		return e;
	}
}

declare global {
	/**
	 * Initializes the {@link cookieconsent} object by creating a new object.
	 */
	var cookieConsentInit: () => void;

	/** If the Cookies have been okayed on the window. */
	var CookiesOK: boolean;

	interface Window {
		/** The cookieconsent callback object based on the Date.now() value. */
		[callback_number: `callback${number}`]: (arg: any) => void;
	}

	/**
	 * The cookieconsent object that is used to manage the cookie consent popup.
	 */
	var cookieconsent: CookieConsent;
}

cookieConsentInit = () =>
{
	// The classes defined above are actually defined here.
	e = window.cookieconsent || {};
	t = new CookieConsentUtils();
	i = Object.keys(e.status).map(t.escapeRegExp);

	if (e.hasInitialised)
	{
		// Copies the init properties to the existing object.
		t.deepExtend(e, new CookieConsent());
		e.hasInitialised = true;
	}
}

//
// #endregion
//


declare global {
	/**
	 * Returns the given string with all accent characters replaced with their non-accented counterparts.
	 * @param str The string to remove accents from.
	 * @returns The string with all accent characters replaced with their non-accented counterparts.
	 */
	var removeAccents: (str: string) => string;
}

removeAccents = (str) =>
{
	const accents = [
		{ base: "A", letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
		{ base: "AA", letters: /[\uA732]/g },
		{ base: "AE", letters: /[\u00C6\u01FC\u01E2]/g },
		{ base: "AO", letters: /[\uA734]/g },
		{ base: "AU", letters: /[\uA736]/g },
		{ base: "AV", letters: /[\uA738\uA73A]/g },
		{ base: "AY", letters: /[\uA73C]/g },
		{ base: "B", letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
		{ base: "C", letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
		{ base: "D", letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
		{ base: "DZ", letters: /[\u01F1\u01C4]/g },
		{ base: "Dz", letters: /[\u01F2\u01C5]/g },
		{
		base: "E",
		letters:
			/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
		},
		{ base: "F", letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
		{
		base: "G",
		letters:
			/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
		},
		{
		base: "H",
		letters:
			/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
		},
		{
		base: "I",
		letters:
			/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
		},
		{ base: "J", letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
		{
		base: "K",
		letters:
			/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
		},
		{
		base: "L",
		letters:
			/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
		},
		{ base: "LJ", letters: /[\u01C7]/g },
		{ base: "Lj", letters: /[\u01C8]/g },
		{
		base: "M",
		letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
		},
		{
		base: "N",
		letters:
			/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
		},
		{ base: "NJ", letters: /[\u01CA]/g },
		{ base: "Nj", letters: /[\u01CB]/g },
		{
		base: "O",
		letters:
			/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
		},
		{ base: "OI", letters: /[\u01A2]/g },
		{ base: "OO", letters: /[\uA74E]/g },
		{ base: "OU", letters: /[\u0222]/g },
		{
		base: "P",
		letters:
			/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
		},
		{ base: "Q", letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
		{
		base: "R",
		letters:
			/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
		},
		{
		base: "S",
		letters:
			/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
		},
		{
		base: "T",
		letters:
			/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
		},
		{ base: "TZ", letters: /[\uA728]/g },
		{
		base: "U",
		letters:
			/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
		},
		{
		base: "V",
		letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
		},
		{ base: "VY", letters: /[\uA760]/g },
		{
		base: "W",
		letters:
			/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
		},
		{ base: "X", letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
		{
		base: "Y",
		letters:
			/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
		},
		{
		base: "Z",
		letters:
			/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
		},
		{
		base: "a",
		letters:
			/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
		},
		{ base: "aa", letters: /[\uA733]/g },
		{ base: "ae", letters: /[\u00E6\u01FD\u01E3]/g },
		{ base: "ao", letters: /[\uA735]/g },
		{ base: "au", letters: /[\uA737]/g },
		{ base: "av", letters: /[\uA739\uA73B]/g },
		{ base: "ay", letters: /[\uA73D]/g },
		{
		base: "b",
		letters:
			/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
		},
		{
		base: "c",
		letters:
			/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
		},
		{
		base: "d",
		letters:
			/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
		},
		{ base: "dz", letters: /[\u01F3\u01C6]/g },
		{
		base: "e",
		letters:
			/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
		},
		{ base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
		{
		base: "g",
		letters:
			/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
		},
		{
		base: "h",
		letters:
			/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
		},
		{ base: "hv", letters: /[\u0195]/g },
		{
		base: "i",
		letters:
			/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
		},
		{ base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
		{
		base: "k",
		letters:
			/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
		},
		{
		base: "l",
		letters:
			/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
		},
		{ base: "lj", letters: /[\u01C9]/g },
		{
		base: "m",
		letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
		},
		{
		base: "n",
		letters:
			/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
		},
		{ base: "nj", letters: /[\u01CC]/g },
		{
		base: "o",
		letters:
			/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
		},
		{ base: "oi", letters: /[\u01A3]/g },
		{ base: "ou", letters: /[\u0223]/g },
		{ base: "oo", letters: /[\uA74F]/g },
		{
		base: "p",
		letters:
			/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
		},
		{ base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
		{
		base: "r",
		letters:
			/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
		},
		{
		base: "s",
		letters:
			/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
		},
		{
		base: "t",
		letters:
			/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
		},
		{ base: "tz", letters: /[\uA729]/g },
		{
		base: "u",
		letters:
			/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
		},
		{
		base: "v",
		letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
		},
		{ base: "vy", letters: /[\uA761]/g },
		{
		base: "w",
		letters:
			/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
		},
		{ base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
		{
		base: "y",
		letters:
			/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
		},
		{
		base: "z",
		letters:
			/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g,
		}
	];
	for (let i = 0; i < accents.length; i++) {
		// @ts-ignore - accents[i] is a valid object.
		str = str.replace(accents[i].letters, accents[i].base);
	}
	return str;
}

declare global {
	/**
	 * Returns a URL for the player avatar image. If the avatar for the player id is not found (element with id `avatar_${playerId}`), then the default avatar picture will be returned.
	 * @param playerId The player id for the avatar. If this the string representation of this value is not an integer, then playerId = 0.
	 * @param avatar The avatar for the player.
	 * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
	 * @returns The URL for the player avatar image.
	 */
	var getPlayerAvatar: (playerId?: number | any, avatar?: string, size?: 32 | 50 | 92 | 184 | '32' | '50' | '92' | '184') => string;
}

getPlayerAvatar = (playerId, avatar, size) =>
{
	avatar || (avatar = "000000");
	if (!/^[1-9]\d*$/.test(playerId as string)) {
		playerId = 0;
		avatar = "000000";
	}
	size || (size = 50);
	const defMatch = avatar.match(/^_def_(\d+)$/);
	if (defMatch) {
		let def = defMatch[1]!;
		def.length < 4 && (def = ("0000" + def).slice(-4));
		return `${g_themeurl}../../data/avatar/defaults/default-${def}${({ 32: "_32", 50: "_50", 92: "_92", 184: "" }[size] || "")}.jpg`;
	}
	return 0 === playerId || "000000" === avatar || "x00000" === avatar ?
		`${g_themeurl}../../data/avatar/default_${size}.jpg` :
		`${g_themeurl}../../data/avatar/${id_to_path(playerId)}/${playerId}_${size}.jpg?h=${avatar}`;
}

declare global {
	/**
	 * Returns a URL for the group avatar image. If the avatar for the group is not found, then the default avatar picture will be returned.
	 * @param groupId The group id for the avatar. If this the string representation of this value is not an integer, then groupId = 0.
	 * @param avatar The avatar for the player.
	 * @param avatar The avatar for the player.
	 * @param type The type of group. Either 'tournament' or 'group'. Defaults to 'group'.
	 * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
	 * @returns The URL for the player avatar image.
	 */
	var getGroupAvatar: (groupId?: number | any, avatar?: string, type?: 'tournament' | 'group', size?: 32 | 50 | 92 | 184 | '32' | '50' | '92' | '184') => string;
}

getGroupAvatar = (groupId, avatar, type, size) =>
{
	if (!/^[1-9]\d*$/.test(groupId as string)) {
		groupId = 0;
		avatar = "000000";
	}
	size || (size = 50);
	if (avatar && "000000" !== avatar) {
		const path = Math.floor(groupId as number / 1000);
		return `${g_themeurl}../../data/grouparms/${path}/group_${groupId}_${size}.jpg?h=${avatar}`;
	}
	return type === "tournament" ?
		`${g_themeurl}../../data/grouparms/noimage_tournament_${size}.png` :
		`${g_themeurl}../../data/grouparms/noimage_ ${size}.jpg`;
}

declare global {
	/**
	 * Returns a URL for the media image (game meta data image).
	 * @param gameName The name of the game.
	 * @param type The type of media.
	 * @param subscript The subscript for the media image, usually '280' for the box, '2000' for the title, and undefined otherwise.
	 * @param variation The variation of the media image. 'banner', 'box', and 'title' will usually use 'default' or a language code. 'display' and 'publisher' will usually use a number to represent the index of the image as it was uploaded.
	 * @param hParam (not sure) Some id/key for the image request, put in the URL as a query parameter. Seems to not change how the image is returned (possibly used to force a cache refresh).
	 * @returns The URL for the media image.
	 */
	var getMediaUrl: (gameName: string, type: 'banner' | 'display' | 'box' | 'publisher' | 'title' | 'icon', subscript?: number | string | null, variation?: 'default' | string | number | null, hParam?: number | null) => string;
}

getMediaUrl = (gameName, type, subscript = null, variation = "default", hParam = null) =>
{
	let query = "";
	hParam && (query = `?h=${hParam}`);
	let extension = "png";
	["banner", "display"].includes(type) && (extension = "jpg");
	let script = "";
	subscript && (script = `_${subscript}`);
	variation || (variation = "default");
	if (variation === "default" && type === "box") {
		variation = "en";
	}
	return `${g_themeurl}../../data/gamemedia/${gameName}/${type}/${variation}${script}.${extension}${query}`;
}

declare global {
	/**
	 * Pushes the given data to the data layer for analytics. See {@link https://developers.google.com/tag-manager/devguide#datalayer} for more information on how this data is used. This function is the same as {@link gtag} and {@link dataLayer.push}.
	 * @param data The data to push to the data layer.
	 */
	var analyticsPush: (data: any) => void;
}

analyticsPush = (data) =>
{
	dataLayer && dataLayer.push(data);
}