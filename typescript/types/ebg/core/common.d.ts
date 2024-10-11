import "dojo/date";
declare global {
    /**
     * Returns a formatted url for the specified file. This is used to load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file).
     * @param file The file to get the url for. This does not include the game theme url. For example, 'img/cards.jpg'.
     * @returns The formatted url for the specified file in the following format: `{game theme name}{file version}/{file path}`. If the file is not included in the static assets, the {@link g_gamethemeurl} + {file} is returned instead.
     */
    var getStaticAssetUrl: (file: string) => string;
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
declare global {
    /**
     * Same as {@link time_format}, but with more features and always makes the time negative (x ago).
     */
    var time_ago_format: (minutes: number) => string;
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
declare global {
    /**
     * Checks if the given value is undefined.
     * @param value The value to check.
     * @returns True if the value is undefined, false otherwise.
     */
    var isset: <T>(value: T) => value is T & ({} | null);
}
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
    };
}
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
declare global {
    /**
     * Capitalizes the first letter of the given string.
     * @param str The string to capitalize.
     * @returns The string with the first letter capitalized.
     */
    var ucFirst: (str: string) => string;
}
declare global {
    /**
     * Formats the given number with the given number by adding spaces after every 3 digits.
     * @param number The number to format.
     * @returns The formatted number.
     */
    var format_number: (number: number) => string;
}
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
declare global {
    /**
     * The global translation dictionary, where the first key is the bundle to pull translations from, and the second is the key in that bundle.
     * @param bundle The bundle to pull translations from.
     * @param key The key to get the translation for.
     * @returns The translation for the given key.
     *
     * This is an alias for {@link g_i18n.getTranslation}, with checks to ensure the translation is not undefined.
     */
    var __: (bundle: string, key: string) => string;
}
declare global {
    /**
     * Gets the location description from the given result. This is done by concatenating the long names of each address component.
     * @param result The result to get the location description from.
     * @returns The location description.
     * WIP: The arg type is based on the Google Maps API, but the API type is not fully implemented.
     */
    var getLocationDescriptionFromResult: (result: {
        address_components: {
            long_name: string;
        }[];
    }) => string;
}
declare global {
    /**
     * Analyzes the location description from the given result. This is done by extracting the city, area1, area2, and country from the address components.
     * @param result The result to analyze the location description from.
     * @returns The analyzed location description.
     * WIP: The arg type is based on the Google Maps API, but the API type is not fully implemented.
     */
    var analyseLocationDescriptionFromResult: (result: {
        address_components: {
            long_name: string;
            short_name: string;
            types: string[];
        }[];
    }) => {
        city: string;
        area1: string;
        area2: string;
        country: string;
    };
}
declare global {
    /**
     * Converts the given id to a path in the form `x/y/z`, where z is the last 3 digits of the id, y is the next 3 digits, and x is the remaining digits.
     * @param id The id to convert to a path.
     * @returns The path in the form `x/y/z`.
     */
    var id_to_path: (id: number) => string;
}
declare global {
    /**
     * Converts the given player device to an icon name. This is done by returning 'circle' for desktop, 'tablet' for tablet, and 'mobile' for mobile.
     * @param device The device to convert to an icon name.
     * @returns The icon name for the given device.
     */
    var playerDeviceToIcon: (device: 'desktop' | 'tablet' | 'mobile') => string;
}
declare class TimeZone {
    utc_offset: string;
    olson_tz: string;
    uses_dst: boolean;
    constructor(utc_offset: string, olson_tz: string, uses_dst: boolean);
    display(): string;
    ambiguity_check(): void;
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
        get_timezone_info: () => {
            utc_offset: number;
            dst: number;
            hemisphere: "SOUTH" | "NORTH" | "N/A";
        };
        get_january_offset: () => number;
        get_june_offset: () => number;
        determine_timezone: () => {
            timezone: TimeZone;
            key: string;
        };
    };
}
declare global {
    /**
     * Focuses and sets the selection range for the given input element using {@link HTMLInputElement.setSelectionRange}.
     * This has a fallback for older browsers using `createTextRange`.
     * @param element The input element to set the selection range for.
     * @param position The position to set the caret to.
     */
    var setCaretPosition: (element: HTMLInputElement | {
        createTextRange: () => object;
    }, position: number) => void;
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
declare global {
    /**
     * Removes all duplicate elements from the given array.
     * @param array The array to remove duplicates from.
     * @returns The array with all duplicate elements removed.
     */
    var array_unique: <T extends keyof any>(array: T[]) => T[];
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
declare class CookieConsentUtils {
    escapeRegExp(e: string): string;
    hasClass(e: HTMLElement, t: string): boolean;
    addClass(e: HTMLElement, t: string): void;
    removeClass(e: HTMLElement, t: string): void;
    interpolateString(e: string, t: Function): string;
    getCookie(e: string): string | undefined;
    setCookie(e: string, t: string, i: number, n: string, o: string): void;
    deepExtend(e: Record<string, any>, t: Record<string, any>): Record<string, any>;
    throttle(e: Function, t: number): Function;
    hash(e: string): number;
    normaliseHex(e: string): string;
    getContrast(e: string): string;
    getLuminance(e: string): string;
    isMobile(): boolean;
    isPlainObject(e: any): boolean;
}
declare class CookieConsent {
    hasInitialised: boolean;
    status: {
        deny: string;
        allow: string;
        dismiss: string;
    };
    /**
     * The css property used on this browser for ending transitions.
     */
    transitionEnd: string;
    hasTransition: boolean;
    customStyles: Record<string, {
        references: number;
        element: CSSStyleSheet | null;
    } | null>;
    Popup: typeof CookieConsentPopup;
    Location: typeof CookieConsentLocation;
    Law: typeof CookieConsentLaw;
    initialise(t: any, i?: ((popup: CookieConsentPopup) => void) | (() => void) | null, n?: ((error: Error, popup: CookieConsentPopup) => void) | (() => void)): void;
    getCountryCode(t: any, i: Function, errorCallback: (t: any) => void): void;
    utils: CookieConsentUtils;
}
declare class CookieConsentPopup {
    private openingTimeout;
    private afterTransition;
    private onButtonClick;
    private customStyleSelector;
    private element;
    private revokeBtn;
    private dismissTimeout;
    private onWindowScroll;
    private onMouseMove;
    private options;
    private n;
    private o;
    private a;
    private s;
    private r;
    private l;
    private d;
    private c;
    private h;
    private u;
    private p;
    private m;
    private g;
    private _;
    private f;
    private static v;
    initialise(e: Record<string, any>): void;
    destroy(): void;
    open(_?: any): this | undefined;
    close(t: boolean): this | undefined;
    fadeIn(): void;
    fadeOut(): void;
    isOpen(): boolean | null;
    toggleRevokeButton(e?: boolean): void;
    revokeChoice(e?: any): void;
    hasAnswered(_?: any): boolean;
    hasConsented(_?: any): boolean;
    autoOpen(_?: any): void;
    setStatus(i: string): void;
    getStatus(): string | undefined;
    clearStatus(): void;
}
interface CookieConsentLocationServiceContext {
    url: string;
    callback?: (e: any, t: string) => any;
    isScript?: boolean;
    data?: Document | XMLHttpRequestBodyInit | null;
    headers?: string[];
    __JSONP_DATA?: string;
}
declare class CookieConsentLocation {
    options: Record<string, any> & {
        timeout?: number;
        services?: (string | Function | {
            name: string;
        })[];
        serviceDefinitions?: Record<string, any>;
    };
    currentServiceIndex: number;
    callbackComplete?: ((e: any) => void) | null;
    callbackError?: ((e: any) => void) | null;
    constructor(e: Record<string, any>);
    private i;
    private n;
    private o;
    private static a;
    getNextService(): any;
    getServiceByIdx(e: number): any;
    locate(succussCallback: (e: any) => void, errorCallback: (t: any) => void): undefined;
    setupUrl(e: CookieConsentLocationServiceContext): string;
    runService(e: CookieConsentLocationServiceContext, t: (e: any, t: any) => void): void;
    runServiceCallback(callback: (succuss_data: any, error_data?: any) => void, t: CookieConsentLocationServiceContext, i: string): void;
    onServiceResult(callback: (succuss_data: any, error_data?: any) => void, callbackArg?: any): void;
    runNextServiceOnError(data: any, callbackArg?: any): void;
    getCurrentServiceOpts(): any;
    completeService(callback?: ((succuss_data: any, error_data?: any) => void) | null, callbackArg?: any): void;
    logError(data: any): void;
}
declare class CookieConsentLaw {
    constructor(e: any);
    private static i;
    options: typeof CookieConsentLaw.i;
    initialise(e: any): void;
    get(e: string): {
        hasLaw: boolean;
        revokable: boolean;
        explicitAction: boolean;
    };
    applyLaw(e: {
        enabled: boolean;
        revokable: boolean;
        dismissOnScroll: boolean;
        dismissOnTimeout: boolean;
    }, t: string): {
        enabled: boolean;
        revokable: boolean;
        dismissOnScroll: boolean;
        dismissOnTimeout: boolean;
    };
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
declare global {
    /**
     * Returns the given string with all accent characters replaced with their non-accented counterparts.
     * @param str The string to remove accents from.
     * @returns The string with all accent characters replaced with their non-accented counterparts.
     */
    var removeAccents: (str: string) => string;
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
declare global {
    /**
     * Pushes the given data to the data layer for analytics. See {@link https://developers.google.com/tag-manager/devguide#datalayer} for more information on how this data is used. This function is the same as {@link gtag} and {@link dataLayer.push}.
     * @param data The data to push to the data layer.
     */
    var analyticsPush: (data: any) => void;
}
export {};
//# sourceMappingURL=common.d.ts.map