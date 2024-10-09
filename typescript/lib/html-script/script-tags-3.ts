var jstpl_token =
	'<div class="token-container tokencolor_${color}" id="token_${x_y}"><div class="token-flip"><div class="token-white"></div><div class="token-black"></div></div></div>';

// Create browser compatible event handler.
// @ts-ignore: This is always defined on modern browsers.
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod as "addEventListener"];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
// Listen for a message from the iframe.
eventer(
	messageEvent,
	function (e: any) {
		if (isNaN(e.data)) return;
		(document.getElementById("tournament_frame") as HTMLElement).style.height =
			e.data + "px";
	},
	false
);

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
var $: typeof dojo.byId;

require(["dojo/parser", "dojo/dom", "dojo/domReady!"], function (parser: typeof import("dojo/parser"), dom: typeof import("dojo/dom")) {
	console.log("After first require");
	console.dir("Dojo configuration:");
	console.log(dojo.config);

	$ = dom.byId;

	window.onerror = function (msg, url, linenumber) {
		if (typeof gameui != "undefined") {
			gameui.onScriptError(msg, url!, linenumber);
		} else if (typeof mainsite != "undefined") {
			mainsite.onScriptError(msg, url!, linenumber);
		} else if ($("globalerrormsg")) {
			$("globalerrormsg")!.innerHTML = msg as string;
		}
	};

	// Parse the page
	parser.parse();
});

/**
 * The js template html for creating an action button.
 */
var jstpl_action_button =
	'<a href="#" class="action-button ${addclass}" onclick="return false;" id="${id}">${label}</a>';

/**
 * The js template html for creating a score entry. See {@link jstpl_score_entry_specific} for overriding this template.
 */
var jstpl_score_entry =
	'<div class="score-entry">\
			<div class="rank">${rank}</div>\
			<div class="name" style="color:#${color};${color_back}">${name}</div>\
			<div class="score" id="score_${id}">\
				${score}  <i class="fa fa-lg fa-star"></i>\
				<span class="score_aux score_aux_${score} tttiebraker" id="score_aux_${index}">(${score_aux}<i class="fa fa-star tiebreaker"></i>)</span>\
			</div>\
		</div>';

/**
 * The images that should be preloaded when the page loads.
 */
var g_img_preload: string[] = [
	// Images to preload....
];

/**
 * The non-game specific theme url. This should be used just like {@link g_gamethemeurl} but for assets that are not specific to the game, that is shared assets.
 * @example
 * const image = "<img class='imgtext' src='" + g_themeurl + "img/layout/help_click.png' alt='action' /> <span class='tooltiptext'>" + text + "</span>""
 */
var g_themeurl: string = `https://${'<boardgamearena-domain>'}/data/themereleases/${'<theme-number>'}/`;

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
var g_gamethemeurl: string = `https://${'<boardgamearena-domain>'}/data/themereleases/current/games/${'<game-name>'}/${'<gametheme-number>'}/`;

/** Defined as null after loading the page. This seems to have no use and is likely misspelled version of {@link gameui}. */
var gamegui: null = null;

/** Global counter for tracking the uid for the msg that are dispatched. */
var g_last_msg_dispatched_uid: BGA.ID | HexString = 0;

/** The static assets for the current page. This is only used with {@link getStateAssetUrl} to help load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file). */
var g_staticassets: { file: string, version: string }[] = [];
try {
	g_staticassets = [];
} catch (error) {
	console.error("Invalid JSON for static assets versions", error);
}

/** The dojo handle used for catching errors when loading modules. */
var handle = require.on("error", function (error) {
	console.error("Error while loading a required module");
	console.error(error);
	console.error(error.src);
	console.error(error.id);
	var moduleUrl = "";

	if (
		typeof error.message === "string" &&
		error.message.substring(0, 11) === "scriptError"
	) {
		moduleUrl = error.info[0].slice(0, -3);
	}

	if (dojo.style("connect_status_fail_text", "display") == "none") {
		// Sometimes we have successive errors, update the message only once, with the ressource originally missing
		var html = document.getElementById(
			"connect_status_fail_text"
		)!.innerHTML; // We use document.getElementById() because in case of an early error $() may not be defined yet
		html = html.replace(/%module_url%/g, moduleUrl);
		html = html.replace(
			"%switchlang_url%",
			"/2/tstemplatereversi?table=575997&lang=en"
		);
		html = html.replace(
			"%reportbug_url%",
			"https://studio.boardgamearena.com/bug?id=0&table=575997"
		);
		document.getElementById("connect_status_fail_text")!.innerHTML = html;
	}

	dojo.style("connect_status_text", "display", "none");
	dojo.style("connect_status_fail_text", "display", "block");

	dojo.style("loader_mask", "display", "none");
});


/** The global game object that is currently running. */
var gameui: InstanceType<BGA.Gamegui>;

/** The global translation module. For usage, the aliases {@line _} and {@link __} should normally be used instead. */
var g_i18n: InstanceType<BGA.I18n>;

/** The global {@link SoundManager} for the game. */
var soundManager: InstanceType<BGA.SoundManager>;

/** True if the game is in archive mode after the game (the game has ended). */
var g_archive_mode: boolean;

/**
 * The replay number in live game. It is set to undefined (i.e. not set) when it is not a replay mode, so the good check is `typeof g_replayFrom != 'undefined'` which returns true if the game is in replay mode during the game (the game is ongoing but the user clicked "reply from this move" in the log). 
 * This is never declared when the game is not in replay mode.
 */
var g_replayFrom: number | undefined;

/**
 * An object if the game is in tutorial mode, or undefined otherwise. Tutorial mode is a special case of archive mode where comments have been added to a previous game to teach new players the rules.
 * This is never declared when the game tutorials are not loaded/active/existing.
 */
var g_tutorialwritten: {
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
	}
} | undefined;

var gotourl: (relative_url: string) => void | undefined;

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
var bgagame: Record<string, BGA.Gamegui> | undefined;

require([
	"dojo",
	"dojo/_base/unload",
	"dojo/i18n!ebg/nls/lang_mainsite",
	`dojo/i18n!ebg/nls/lang_${'yourgamename'}`,
	`bgagame/${'yourgamename'}`,
	"ebg/core/soundManager",
	"dojo/domReady!",
], function (dojo: DojoJS.Dojo, baseUnload: InstanceType<DojoJS.Unload>) {
	// Load translation bundle here to ensure they are all load on asynchronous XDomain load

	console.log("Main page addOnLoad");

	(function () {
		var dconnect = dojo.connect;
		// @ts-ignore
		dojo.connect = function (obj, event, context, method, dontFix) {
			try {
				if (context[method as string]) {
					return dconnect.call(
						this,
						obj,
						event,
						context,
						function () {
							try {
								context[method as string].apply(context, arguments);
							} catch (e: any) {
								if (gameui) {
									var msg =
										"During callback: " +
										event +
										" / " +
										method +
										"\n" +
										e.message +
										"\n";
									msg +=
										e.stack ||
										e.stacktrace ||
										"no_stack_avail";
									gameui.onScriptError(msg, "", "");
								} else {
									throw e;
								}
							}
						},
						// @ts-ignore
						dontFix
					);
				} else {
					return dconnect.call(
						this,
						obj,
						event,
						context,
						method,
						// @ts-ignore
						dontFix
					);
				}
			} catch (e) {
				// In case of ANY error during our method, we fallback to normal dojo.connect method
				return dconnect.call(
					this,
					obj,
					event,
					context,
					method,
					// @ts-ignore
					dontFix
				);
			}
		};
	})();

	// @ts-ignore yourgamename is replaced by the actual game name
	gameui = new bgagame.yourgamename();
	g_i18n = new ebg.core.i18n();

	try {
		console.log(gameui);

		soundManager = new ebg.core.soundManager();
		soundManager.soundMode = 0;
		soundManager.init();
		soundManager.bMuteSound = localStorage.getItem("sound_muted") == (1).toString();
		soundManager.volume =
			localStorage.getItem("sound_volume") === null
				? 70 / 100
				// @ts-ignore this is converted to a number
				: localStorage.getItem("sound_volume") / 100;
		if ($("soundVolumeControl") !== null) {
			$<HTMLInputElement>("soundVolumeControl")!.value = (soundManager.bMuteSound
				? 0
				: soundManager.volume * 100).toString();
		}
		soundManager.sounds = {
			yourturn: "main_Star",
			chatmessage: "alt_Plop",
			move: "move",
			joinTable: "door-knock-1",
			tableReady: "main_Star",
			victory: "main_Win",
			lose: "main_Fail",
			tie: "main_Victory",
			elochange: "main_Points",
			new_trophy: "main_Reward",
			time_alarm: "alt_Countdown",
			gain_arena: "punch",
			lose_arena: "main_Glass Break",
		};

		g_archive_mode = false;
		gameui.mediaChatRating = true;
		gameui.current_player_name = "NevinAF0";
		gameui.blinkid =
			"https://www.amazon.com/dp/B00004TQMQ?tag=itemtext-boardgamegeek-20&linkCode=ogi&th=1&psc=1";
		gameui.blinkdomain = "Buy on Amazon";
		gameui.game_id = 10385;
		gameui.is_coop = false;
		gameui.is_solo = false;
		gameui.is_sandbox = false;
		gameui.reportJsError = "show";
		gameui.decision = { decision_type: "none" };
		gameui.prefs = {
			"200": {
				name: "Display tooltips",
				needReload: false,
				generic: true,
				values: [{ name: "Enabled" }, { name: "Disabled" }],
				value: 0,
			},
			/* GAME SPECIFIC PREFERENCES */
		};
		gameui.metasiteurl = "https://studio.boardgamearena.com";
		gameui.gameserver = "2";
		gameui.tiebreaker = "";
		gameui.tiebreaker_split = false;
		gameui.losers_not_ranked = false;
		gameui.bTutorial = false;
		gameui.jsbundlesversion = "";
		gameui.bActiveEvents = false;
		gameui.bRealtime = 1;
		gameui.quickGameEnd = false;
		gameui.quickGameEndUrl = "";
		gameui.chatDetached = false;
		gameui.interface_min_width = 740;
		gameui.dockedChat = true;
		gameui.bTimerCommon = false;
		gameui.pma = 1;
		gameui.rtc_mode = 0;
		gameui.rtc_room = "T575997";

		gameui.turnBasedNotes = "";
		gameui.gameeval = false;
		gameui.gameisalpha = false;
		gameui.gamecanapprove = false;
		gameui.number_of_tb_table_its_your_turn = 0;
		gameui.bUseWebStockets = false;
		gameui.metasite_tutorial = [
			4158644223, 4294967295, 4294967295, 4294967295,
		];
		gameui.tournament_id = null;
		gameui.lockts = -1713219672;
		gameui.mslobby = "lobby";
		gameui.game_status = "public";
		gameui.game_group = "1018430";
		gameui.emergencymsg = [];
		gameui.hotseat = [];
		gameui.hotseat_interface = "normal";
		gameui.hotseatplayers = [];
		gameui.gs_socketio_url = "";
		gameui.gs_socketio_path = "r";
		gameui.debug_from_chat = true;
		gameui.completesetup(
			""/* GAME SPECIFIC GAME NAME */,
			""/* GAME SPECIFIC GAME NAME */,
			575997,
			2395746,
			/*archivemask_begin*/ "93d073feabeb9b0021169beca1cb2aec" /*archivemask_end*/,
			"3441c0da883b203d6b7b41df68b526da",
			"socketio",
			{
				players: {
					"2395747": {
						id: "2395747",
						score: "0",
						color: "cbcbcb",
						color_back: null,
						name: "NevinAF1",
						avatar: "000000",
						zombie: 0,
						eliminated: 0,
						is_ai: "0",
						beginner: false,
					},
					"2395746": {
						id: "2395746",
						score: "0",
						color: "363636",
						color_back: null,
						name: "NevinAF0",
						avatar: "000000",
						zombie: 0,
						eliminated: 0,
						is_ai: "0",
						beginner: false,
					},
				},
				/* GAME SPECIFIC GAMEDATAS ARGS DATA ON LOAD */
				gamestate: {/* GAME SPECIFIC GAMESTATE DATA ON LOAD */} as any,
				tablespeed: "1",
				game_result_neutralized: "0",
				neutralized_player_id: "0",
				playerorder: [/* GAME SPECIFIC PLAYER ORDER */],
				gamestates: {
					"1": {
						name: "gameSetup",
						description: "",
						type: "manager",
						action: "stGameSetup",
						transitions: { "": /* GAME SPECIFIC */ 0 },
					},
					/* GAME SPECIFIC GAMESTATE DATA ON LOAD */
					"99": {
						name: "gameEnd",
						description: "End of game",
						type: "manager",
						action: "stGameEnd",
						args: "argGameEnd",
					},
				},
				notifications: { last_packet_id: "1", move_nbr: "1" },
			},
			{/* GAME SPECIFIC PLAYERS ON LOAD */},
			"https://studio.boardgamearena.com:3000",
			"r"
		);
		gameui.setGroupList([]);
	} catch (e: any) {
		var msg = "During pageload\n" + e.message + "\n";
		msg += e.stack || e.stacktrace || "no_stack_avail";
		gameui.onScriptError(msg, "", "");
	}

	baseUnload.addOnUnload(function () {
		if (gameui) {
			gameui.unload();
		}
	});
});

var head_errmsg = "";
var head_infomsg = "";
var jstpl_audiosrc = "<img style='display:none;' src='https://studio.boardgamearena.com:8084/data/themereleases/240725-1000/sound/${file}'></img><audio id='${id}' src='https://studio.boardgamearena.com:8084/data/themereleases/240725-1000/sound/${file}'></audio>";

function publishFBReady() {
	if (typeof dojo != 'undefined') {
		console.log("Socialconnect: firing up dojo topic 'FB ready'");
		dojo.publish("FBReady", null);
		if (window.location.hash != window.saveHashForLater) { window.location.hash = window.saveHashForLater }; // FIX as loading FB script empties the hash starting 20190220
	} else {
		console.log("Socialconnect: delaying dojo topic 'FB ready' (dojo not loaded yet)");
		setTimeout(function () { window.publishFBReady(); }, 300);
	}
}

var saveHashForLater = window.location.hash;

window.fbAsyncInit = function () {
	console.log("Socialconnect: FB loaded");
	window.publishFBReady();
};
(function () {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js#version=v2.3&appId=' + bgaConfig.facebookAppId + '&status=false&cookie=true&xfbml=true';
	document.getElementById('fb-root')!.appendChild(e);
}());

function publishGPOReady() {
	if (typeof dojo != 'undefined') {
		console.log("Socialconnect: firing up dojo topic 'Google Identity Services library ready'");
		dojo.publish("GPOReady", null);
	} else {
		console.log("Socialconnect: delaying dojo topic 'Google Identity Services library ready' (dojo not loaded yet)");
		setTimeout(function () { window.publishGPOReady(); }, 300);
	}
}

// Specify the language code prior to loading the JavaScript API
var ___gcfg = {
	lang: 'en_US',
	parsetags: 'explicit'
};

var onGoogleLibraryLoad = function () {
	console.log("Socialconnect: Google Identity Services library loaded");
	window.publishGPOReady();
};
(function () {
	var po = document.createElement('script');
	po.type = 'text/javascript'; po.async = true;
	po.src = document.location.protocol + '//accounts.google.com/gsi/client';
	var s = document.getElementsByTagName('script')[0]!;
	s.parentNode!.insertBefore(po, s);
})();