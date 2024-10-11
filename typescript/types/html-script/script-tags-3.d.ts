declare var jstpl_token: string;
declare var eventMethod: string;
declare var eventer: {
    <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
} & typeof addEventListener;
declare var messageEvent: string;
/**
 * The global jQuery-like selector function included in all BGA pages, used to resolve an id to an element if not already an element.
 *
 * This is an alias for {@link DojoJS.byId}.
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
 * $('myElement')?.style.display = 'none';
*/
declare var $: typeof dojo.byId;
/**
 * The js template html for creating an action button.
 */
declare var jstpl_action_button: string;
/**
 * The js template html for creating a score entry. See {@link jstpl_score_entry_specific} for overriding this template.
 */
declare var jstpl_score_entry: string;
/**
 * The images that should be preloaded when the page loads.
 */
declare var g_img_preload: string[];
/**
 * The non-game specific theme url. This should be used just like {@link g_gamethemeurl} but for assets that are not specific to the game, that is shared assets.
 * @example
 * const image = "<img class='imgtext' src='" + g_themeurl + "img/layout/help_click.png' alt='action' /> <span class='tooltiptext'>" + text + "</span>""
 */
declare var g_themeurl: string;
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
declare var g_gamethemeurl: string;
/** Defined as null after loading the page. This seems to have no use and is likely misspelled version of {@link gameui}. */
declare var gamegui: null;
/** Global counter for tracking the uid for the msg that are dispatched. */
declare var g_last_msg_dispatched_uid: BGA.ID | HexString;
/** The static assets for the current page. This is only used with {@link getStateAssetUrl} to help load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file). */
declare var g_staticassets: {
    file: string;
    version: string;
}[];
/** The dojo handle used for catching errors when loading modules. */
declare var handle: DojoJS.Handle;
/** The global game object that is currently running. */
declare var gameui: InstanceType<BGA.Gamegui>;
/** The global translation module. For usage, the aliases {@line _} and {@link __} should normally be used instead. */
declare var g_i18n: InstanceType<BGA.I18n>;
/** The global {@link SoundManager} for the game. */
declare var soundManager: InstanceType<BGA.SoundManager>;
/** True if the game is in archive mode after the game (the game has ended). */
declare var g_archive_mode: boolean;
/**
 * The replay number in live game. It is set to undefined (i.e. not set) when it is not a replay mode, so the good check is `typeof g_replayFrom != 'undefined'` which returns true if the game is in replay mode during the game (the game is ongoing but the user clicked "reply from this move" in the log).
 * This is never declared when the game is not in replay mode.
 */
declare var g_replayFrom: number | undefined;
/**
 * An object if the game is in tutorial mode, or undefined otherwise. Tutorial mode is a special case of archive mode where comments have been added to a previous game to teach new players the rules.
 * This is never declared when the game tutorials are not loaded/active/existing.
 */
declare var g_tutorialwritten: {
    author: string;
    id: number;
    mode: string;
    status: string;
    version_override: string | null;
    viewer_id: string;
    top_game: boolean;
    old_game: boolean;
    stats: {
        viewed: BGA.ID;
        recentviewed: BGA.ID;
        rating: number;
        duration: null | BGA.ID;
        rating5: string;
        rating4: string;
        rating3: string;
        rating2: string;
        rating1: string;
        steps: Record<BGA.ID, number>;
    };
} | undefined;
declare var gotourl: (relative_url: string) => void | undefined;
/**
 * A record of all game specific classes. Usually, this will only only be defined when on a game page, and the record will only contain one entry for the current game.
 *
 * This value should be updated by game specific code by using one of the following expressions:
 * ```js
 * // Using BGA style dojo.declare:
 * declare("bgagame.___yourgamename___", [Gamegui, ___YourGameName___]);
 * // Using Dojo with Typescript extended class:
 * dojo.setObject( "bgagame.___yourgamename___", ___YourGameName___ );
 * // Manually with Typescript extended class (less abstracted, but possibly less clear)
 * (window.bgagame ??= {}).___yourgamename___ = ___YourGameName___;
 * ```
 */
declare var bgagame: Record<string, BGA.Gamegui> | undefined;
declare var head_errmsg: string;
declare var head_infomsg: string;
declare var jstpl_audiosrc: string;
declare function publishFBReady(): void;
declare var saveHashForLater: string;
declare function publishGPOReady(): void;
declare var ___gcfg: {
    lang: string;
    parsetags: string;
};
declare var onGoogleLibraryLoad: () => void;
//# sourceMappingURL=script-tags-3.d.ts.map