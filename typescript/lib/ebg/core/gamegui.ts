import e = require("dojo");
import declare = require("dojo/_base/declare");
import i = require("dojo/query");
import "dijit/DialogUnderlay";
import "dijit/TooltipDialog";
import "ebg/core/sitecore";
import "ebg/gamenotif";
import "ebg/chatinput";
import "dijit/Dialog";
import "ebg/playerlocation";
import "ebg/pageheader";
import "ebg/draggable";
import "ebg/tableresults";
import "ebg/paymentbuttons";

// #region Extend Dialogs
// This has no typing impact on the two Dialog classes, but is included for completeness.

e.extend(dijit.DialogUnderlay, {
	layout: function() {
		var t = this.node.style,
			i = this.domNode.style;
		i.display = "none";
		var n = e.position("left-side", true),
			o = e.position("overall-header", true);
		i.top = n.y + o.h! + "px";
		i.left = n.x + "px";
		t.width = n.w + "px";
		t.height = n.h! - o.h! + "px";
		i.display = "block";
	},
});

e.extend(dijit.Dialog, {
	_position: function() {
		this.autofocus = false;
		if (!e.hasClass(e.body(), "dojoMove")) {
			var t = this.domNode,
				i = e.window.getBox(),
				n = e.position("left-side", true),
				o = e.position("topbar", true),
				a = this._relativePosition,
				s = (a ? null : e.position(t))!,
				r = Math.floor(
					n.x + (a ? a.x : (n.w! - s.w!) / 2)
				),
				l = Math.floor(
					i.t + (a ? a.y : (i.h - s.h!) / 2)
				);
			i.t <= o.h! &&
				!a &&
				(l = Math.floor(
					o.h! + (i.h - (o.h! - i.t) - s.h!) / 2
				));
			e.style(t, { left: r + "px", top: l + "px" });
		}
	},
});

//#endregion

declare global {
	namespace BGA {
		interface UserPreference
		{
			/** The name of the preference, automatically translated. */
			name: string;
			/** Whether the preference requires a reload to take effect. If true, the interface will auto reload when changed. */
			needReload: boolean;
			/** If the preference is a generic preference that applies to all game pages. For example, "Display Tooltips" (200) is a generic preference. */
			generic?: boolean;
			/** The array (map) of values with additional parameters per value. This acts like an enum where the key is the value and the 'name' is the value name. */
			values: Record<BGA.ID, {
				name: string;
				cssPref?: string;
				description?: string;
			}>;
			value: BGA.ID;
			default?: number;
		}

		// TODO: Set up game specific user preferences
		interface UserPreferences {
			"200": {
				name: "Display tooltips",
				needReload: false,
				generic: true,
				values: [{ name: "Enabled" }, { name: "Disabled" }],
				value: 0,
			}
		}

		interface IntrinsicGameAjaxActions {
			showCursorClick: { path: string };
			startgame: {};
			wakeup: { myturnack: true, table: BGA.ID };
			wakeupPlayers: {};
			aiNotPlaying: { table: BGA.ID };
			skipPlayersOutOfTime: {
				_successargs: [{
					data: {
						names: string[],
						delay: number
					}
				}]
				warn?: boolean
			};
			zombieBack: {};
			gamedatas: {};
			activeTutorial: { active: 0 | 1 };
			seenTutorial: { id: BGA.ID };
			endLockScreen: {};
			onGameUserPreferenceChanged: {
				id: BGA.ID,
				value: BGA.ID
			}
		}

		interface AjaxActions extends Type<{
			[K in keyof IntrinsicGameAjaxActions as `/${string}/${string}/${K}.html`]: IntrinsicGameAjaxActions[K];
		}> {
			"/table/table/checkNextMove.html": {
				_successargs: [status: 'ok' | string];
			}; // as any over args
			"/table/table/concede.html?src=menu": { table: BGA.ID };
			"/table/table/concede.html?src=alt": { table: BGA.ID };
			"/table/table/concede.html?src=top": { table: BGA.ID };
			"/table/table/decide.html": {
				type: 'none' | "abandon" | "switch_tb" | null,
				decision: 0 | 1,
				table: BGA.ID,
			};
			"/table/table/decide.html?src=menu": {
				type: 'none' | "abandon" | "switch_tb" | null,
				decision: 0 | 1,
				table: BGA.ID,
			};
			"/archive/archive/fastRegistration.html": { email: string };
			"/table/table/expressGameStopTable.html": { table: BGA.ID };
			"/table/table/tableinfos.html": {
				_successargs: [TableResultsData],
				id: BGA.ID,
				nosuggest: true
			};
			"/playernotif/playernotif/getNotificationsToBeSplashDisplayed.html": {
				_successargs: [Record<string, SplashNotifsToDisplay>],
			};
			"/table/table/createnew.html": {
				game: BGA.ID,
				rematch: BGA.ID,
				src: "R",
			};
			"/table/table/wouldlikethink.html": {};
			"/archive/archive/rateTutorial.html": {
				id: BGA.ID,
				rating: BGA.ID,
				move: number
			};
			"/archive/archive/addArchiveComment.html": {
				table: BGA.ID,
				viewpoint: BGA.ID,
				move: number,
				text: string,
				anchor: string | "archivecontrol_editmode_centercomment" | "page-title",
				aftercomment: BGA.ID,
				afteruid: BGA.ID | HexString,
				continuemode: string,
				displaymode: string,
				pointers: string
			};
			"/archive/archive/updateArchiveComment.html": {
				comment_id: BGA.ID,
				text: string,
				anchor: string | "archivecontrol_editmode_centercomment" | "page-title",
				continuemode?: string,
				displaymode?: string,
				pointers?: string
			}
			"/archive/archive/deleteArchiveComment.html": { id: BGA.ID };
			"/archive/archive/publishTutorial.html": {
				id: BGA.ID,
				intro: "",
				lang: BGA.LanguageCode,
				viewpoint: BGA.ID,
			};
			"/table/table/debugSaveState.html": {
				table: BGA.ID,
				state: BGA.ID | string // TODO: Can this be anything but a number?
			};
			"/table/table/loadSaveState.html": {
				table: BGA.ID,
				state: BGA.ID | string // TODO: Can this be anything but a number?
			};
			"/table/table/loadBugReport.html": {
				table: BGA.ID,
				bugReportId: BGA.ID
			};
			"/table/table/updateTurnBasedNotes.html": {
				value: string,
				table: BGA.ID
			};
			"/table/table/thumbUpLink.html": { id: BGA.ID };
			"/table/table/changeGlobalPreference.html": {
				id: BGA.ID,
				value: string
			};
			"/table/table/changePreference.html": {
				id: BGA.ID,
				value: number,
				game: string
			};
			"/gamepanel/gamepanel/getRanking.html": {
				game: BGA.ID,
				start: number,
				mode: "arena" | "elo",
			};
			"/table/table/judgegivevictory.html": {
				id: BGA.ID,
				winner: BGA.ID,
			};
			"/gamepanel/gamepanel/getWikiHelp.html": {
				gamename: string,
				section: "help" | "tips"
			};
			"/table/table/quitgame.html?src=panel": {
				table: BGA.ID,
				neutralized: boolean,
				s: "gameui_neutralized",
			}
		}

		// TODO: Add all built-in topics here and fix typing.
		interface TopicArgs {
			"lockInterface": [{
				status: "outgoing" | "queued" | "dispatched" | "updated" | "recorded",
				uuid: string,
				bIsTableMsg?: boolean,
				type?: "player" | "table" | null,
			}]
		}

		interface AjaxAdditionalArgs {
			__action__?: string;
			__move_id__?: number;
			__player_id__?: BGA.ID;
			h?: HexString | undefined;
			testuser?: BGA.ID;
		}
	}
}

interface Gamegui_Template extends InstanceType<typeof ebg.core.sitecore> {
	// game_name: string = ""; // can no longer be undefined.
	// gamedatas: Gamedatas | null = null; // can no longer be undefined.
	// player_id: BGA.ID | null = null; // can no longer be undefined.
	// table_id: BGA.ID | null = null; // can no longer be undefined.
	// isSpectator: boolean = true; // can no longer be undefined.
}

/**
 * The main class for a game interface. This should always define:
 * - How to setup user interface.
 * - Which actions on the page will generate calls to the server.
 * - What happens when you get a notification for a change from the server and how it will show in the browser.
 * 
 * In a bit more detail, it should include the following methods and sections:
 * - `constructor`: here you can define global variables for your whole interface.
 * - `setup`: this method is called when the page is refreshed, and sets up the game interface.
 * - `onEnteringState`: this method is called when entering a new game state. You can use it to customize the view for each game state.
 * - `onLeavingState`: this method is called when leaving a game state.
 * - `onUpdateActionButtons`: called on state changes, in order to add action buttons to the status bar. Note: in a multipleactiveplayer state, it will be called when another player has become inactive.
 * - (utility methods): this is where you can define your utility methods.
 * - (player's actions): this is where you can write your handlers for player actions on the interface (example: click on an item).
 * - `setupNotifications`: this method associates notifications with notification handlers. For each game notification, you can trigger a javascript method to handle it and update the game interface.
 * - (notification handlers): this is where you define the notifications handlers associated with notifications in setupNotifications, above.
 * 
 * All clients automatically load the Dojo framework, so all games can use the functions to do more coimplex things more easily. The BGA framework uses Dojo extensively. See {@link http://dojotoolkit.org/ | Dojo Javascript framework} for more information. In addition, the BGA framework defines a jQuery-like function $ that you can use to access the DOM. This function is available in all BGA pages and is the standard way to access the DOM in BGA. You can use getElementById but a longer to type and less handy as it does not do some checks.
 * 
 * For performance reasons, when deploying a game the javascript code is minimized using {@link https://github.com/terser/terser | terser}. This minifier works with modern javascript syntax. From your project "Manage game" page, you can now test a minified version of your javascript on the studio (and revert to the original).
 * 
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * 
 * Using the built-in dojo define method, you should usually define and initialize prototype variables using the constructor method; however, when using classes, any global variables should be added to the class as fields with initializers, like normal for typescript.
 * @example
 * // Dojo + Define
 * define(Gamegui, {
 * 	constructor(){
 * 		console.log('yourgamename constructor');
 * 		this.myGlobalValue = 0;
 * 	},
 * 	...
 * });
 * 
 * // TS Class
 * class YourGameName extends Gamegui {
 * 	myGlobalValue = 0;
 * 	constructor(){
 * 		super();
 * 		console.log('yourgamename constructor');
 * 	}
 * 	...
 * }
*/
class Gamegui_Template
{
	//#region Fields

	/** The human readable name which should be displayed to the user. (Looks like it is already translated, but could wrong) */
	game_name_displayed: string = "";
	/** The channel for this game's table. This will always match `table/t${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
	channel: `/table/t${number}` | null = null;
	/** The channel for the current player. This will always match `player/p${private_channel_id}`. This is null only when accessing from within the constructor. */
	privatechannel: `/player/p${HexString}` | null = null;
	/** The channel for this game's table spectators. This will always match `table/ts${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
	tablechannelSpectators: `/table/ts${number}` | null = null;

	/** Unmodified clone of the gamedatas gamestate. See {@link restoreServerGameState} for more information. This is null only when accessing from within the constructor. */
	last_server_state: BGA.GameState | null = null;
	/** Boolean indicating that the current game state is a client state, i.e. we have called {@link setClientState} and have not yet sent anything to the server. */
	on_client_state: boolean = false;
	/** How the log is currently layed out within the DOM. */
	log_mode: 'normal' | '2cols' = 'normal';
	/** The current status, almost entirely used for managing the interface lock. */
	interface_status: 'updated' | 'outgoing' | 'recorded' | 'queued' | 'dispatched' = 'updated';
	/** If the interface lock should lock the table or the player. */
	interface_locking_type: null | 'table' | 'player' = null;
	/** True if an element with the id 'notifwindow_beacon' exits. Used for game setup. */
	isNotifWindow: boolean = false;
	/** When not null, this is a counter used to blink the current active player based on the 'wouldlikethink_button'. */
	lastWouldLikeThinkBlinking: number | null = null;
	/** Buy Link Id. The url for the buy link. */
	blinkid: string | null = null;
	/** The human readable target for the {@link blinkid}. */
	blinkdomain?: string;
	/** Boolean for if this game is currently in developermode. This is the game as checking if element id 'debug_output' exists. */
	developermode: boolean = false;
	/** If true, this is a sandbox game. Sandbox games are mostly non-scripted and act like a table top simulator rather than a traditional BGA game. */
	is_sandbox: boolean = false;
	/** The id for this game, mostly used for generating the table results and loading game statistics. */
	game_id?: number;
	/** If the current game that is being played is a coop game. This is different than if the game can be played coop. */
	is_coop?: boolean;
	/** If the current game that is being played is a solo game. This is different than if the game can be played solo. */
	is_solo?: boolean;
	/**
	 * The user preferences for the specific client.
	 * @example
	 * // If display tooltips is Enabled
	 * if (this.prefs[200].value == 0) 
	 * 	...
	 */
	prefs?: Record<BGA.ID, BGA.UserPreference>;
	/** The description for tiebreakers as found in the gameinfos file. This is in english and is translated when needed by the {@link BGA.TableResults} component. */
	tiebreaker?: string;
	/** If defined and true, the table results will show the tie breaker scores as needed. Otherwise, no tiebreaker content is added. */
	tiebreaker_split?: boolean;
	/** If losers should not be ranked, as defined in the gameinfos file. If in the game, all losers are equal (no score to rank them or explicit in the rules that losers are not ranked between them), set this to true  The game end result will display 'Winner' for the 1st player and 'Loser' for all other players. Your can view core.core getRankString() (CoreCore) for more information. */
	losers_not_ranked?: boolean;
	/** Defines if this page represents a tutorial version of the game. */
	bTutorial?: boolean;

	/** The id for the display tooltips preference. */
	GAMEPREFERENCE_DISPLAYTOOLTIPS = 200 as const;

	current_player_name?: string;

	/** Truthy if the game is in realtime. Note that having a distinct behavior in realtime and turn-based should be exceptional. */
	bRealtime?: boolean | 0 | 1;

	/**
	 * A record of {@link Counter_Template} objects which show on the built-in player cards. The record key is the player id. This is initialized by the framework but manually needs to be updated when a player's score changes.
	 * 
	 * These counters will always have the id `player_score_` + player_id.
	 * @example
	 * // Increase a player score (with a positive or negative number).
	 * this.scoreCtrl[ player_id ].incValue( score_delta );
	 * @example
	 * // Set a player score to a specific value:
	 * this.scoreCtrl[ player_id ].setValue( new_score );
	 * @example
	 * // Set a player score to a specific value with animation:
	 * this.scoreCtrl[ player_id ].toValue( new_score );
	 * @example
	 * // Typical usage would be (that will process 'score' notification):
	 * setupNotifications : function() {
	 * 	...
	 * 	dojo.subscribe('score', this, "notif_score");
	 * },
	 * notif_score: function(notif) {
	 * 	this.scoreCtrl[notif.args.player_id].setValue(notif.args.player_score);
	 * },
	 */
	scoreCtrl: Record<BGA.ID, InstanceType<BGA.Counter>> = [];

	/** The html loaded into the 'game_play_area' element on completesetup. */
	original_game_area_html?: string;

	players_metadata?: Record<BGA.ID, BGA.PlayerMetadata>;

	//#endregion

	//#region Core Functions

	/**
	 * Called once as soon as the page is loaded and base fields have been defined. This method must set up the game user interface according to current game situation specified in parameters.
	 * - When the game starts.
	 * - When a player opens the game in the browser (or returns to the game after a refresh).
	 * - When player does a server side undo.
	 * @param gamedatas The data from the server that is used to initialize the game client. This is the same as `this.gamedatas`.
	 * @example
	 * setup(gamedatas: Gamedatas): void {
	 * 	console.log( "Starting game setup", gamedatas );
	 * 	
	 * 	// Setting up player boards
	 * 	for( var player_id in gamedatas.players )
	 * 	{
	 * 		var player = gamedatas.players[player_id];
	 * 		// Setting up players boards if needed
	 * 	}
	 * 	
	 * 	// Set up your game interface here, according to "gamedatas"
	 * 	
	 * 	// Setup game notifications to handle (see "setupNotifications" method below)
	 * 	this.setupNotifications();
	 * }
	 */
	setup(gamedatas: BGA.Gamedatas, keep_existing_gamedatas_limited: boolean): void { }

	/**
	 * This method is called each time we enter a new game state. You can use this method to perform some user interface changes at this moment. To access state arguments passed via calling php arg* method use args?.args. Typically you would do something only for active player, using this.isCurrentPlayerActive() check. It is also called (for the current game state only) when doing a browser refresh (after the setup method is called).
	 * 
	 * Warning: for multipleactiveplayer states: the active players are NOT active yet so you must use onUpdateActionButtons to perform the client side operation which depends on a player active/inactive status. If you are doing initialization of some structures which do not depend on the active player, you can just replace (this.isCurrentPlayerActive()) with (!this.isSpectator) for the main switch in that method.
	 * @param stateName The name of the state we are entering.
	 * @param args The arguments passed from the server for this state, or from this client if this is a client state.
	 * @see {@link https://en.doc.boardgamearena.com/Your_game_state_machine:_states.inc.php#Difference_between_Single_active_and_Multi_active_states|Difference between Single active and Multi active states}
	 * @example
	 * onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void
	 * {
	 * 	console.log( 'Entering state: ' + stateName, args );
	 * 	switch( stateName )
	 * 	{
	 * 	case 'myGameState':
	 * 		// Show some HTML block at this game state
	 * 		dojo.style( 'my_html_block_id', 'display', 'block' );
	 * 		break;
	 * 	case 'dummmy':
	 * 		break;
	 * 	}
	 * }
	 */
	onEnteringState(...[stateName, state]: BGA.GameStateTuple_NameState) { }

	/**
	 * This method is called each time we leave a game state. You can use this method to perform some user interface changes at this point (i.e. cleanup).
	 * @param stateName The name of the state we are leaving.
	 * @example
	 * onLeavingState(stateName: GameStateName): void
	 * {
	 * 	console.log( 'Leaving state: ' + stateName );
	 * 	switch( stateName )
	 * 	{
	 * 	case 'myGameState':
	 * 		// Hide the HTML block we are displaying only during this game state
	 * 		dojo.style( 'my_html_block_id', 'display', 'none' );
	 * 		break;
	 * 	case 'dummmy':
	 * 		break;
	 * 	}
	 * }
	 */
	onLeavingState(stateName: BGA.GameState["name"]) { }

	/**
	 * In this method you, can manage "action buttons" that are displayed in the action status bar and highlight active UI elements. To access state arguments passed via calling php arg* method use args parameter. Note: args can be null! For game states and when you don't supply state args function - it is null. This method is called when the active or multiactive player changes. In a classic "activePlayer" state this method is called before the onEnteringState state. In multipleactiveplayer state it is a mess. The sequencing of calls depends on whether you get into that state from transitions OR from reloading the whole game (i.e. F5).
	 * @param stateName The name of the state we are updating the button actions for.
	 * @param args The arguments passed from the server for this state, or from this client if this is a client state.
	 * @see {@link https://en.doc.boardgamearena.com/Your_game_state_machine:_states.inc.php#Difference_between_Single_active_and_Multi_active_states|Difference between Single active and Multi active states}
	 * @example
	 * onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
	 * {
	 * 	console.log( 'onUpdateActionButtons: ' + stateName, args );
	 * 	if( this.isCurrentPlayerActive() )
	 * 	{
	 * 		switch( stateName )
	 * 		{
	 * 		case 'myGameState':
	 * 			// Add 3 action buttons in the action status bar:
	 * 			this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
	 * 			this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
	 * 			this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
	 * 			break;
	 * 		}
	 * 	}
	 * }
	 */
	onUpdateActionButtons(...[stateName, args]: BGA.GameStateTuple_NameArgs) { }

	/**
	 * This method associates notifications with notification handlers. For each game notification, you can trigger a javascript method to handle it and update the game interface. This method should be manually invoked during the `setup` function.
	 * 
	 * This method is overridden as need by the framework to prevent oddities in specific situation, like when viewing the game in {@link g_archive_mode}.
	 * 
	 * Again, this function is not automatically called by the framework, but instead deleted in specific situations to avoid re-subscribing to notifications.
	 * @example
	 * setupNotifications()
	 * {
	 * 	console.log( 'notifications subscriptions setup' );
	 * 
	 * 	// Example 1: standard notification handling
	 * 	dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
	 * 
	 * 	// Example 2: standard notification handling + tell the user interface to wait during 3 seconds after calling the method in order to let the players see what is happening in the game.
	 * 	dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
	 * 	this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
	 * }
	 */
	setupNotifications?: () => void;

	//#endregion

	//#region Player Information

	/**
	 * Returns true if the player on whose browser the code is running is currently active (it's his turn to play). Note: see remarks above about usage of this function inside onEnteringState method.
	 * @returns true if the player on whose browser the code is running is currently active (it's his turn to play).
	 * @example if (this.isCurrentPlayerActive()) { ... }
	 */
	isCurrentPlayerActive(): boolean {
		return this.isPlayerActive(this.player_id);
	}

	/**
	 * Returns the id of the active player. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
	 * @returns The id of the active player.
	 */
	getActivePlayerId(): BGA.ID | null {
		return "activeplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type']
			? this.gamedatas!.gamestate.active_player
			: null;
	}

	/**
	 * Returns the ids of the active players. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
	 * @returns The ids of the active players.
	 */
	getActivePlayers(): BGA.ID[] {
		if ("activeplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type'])
			return [this.gamedatas!.gamestate.active_player];
		if ("multipleactiveplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type']) {
			var e: BGA.ID[] = [];
			for (var t in this.gamedatas!.gamestate.multiactive) e.push(this.gamedatas!.gamestate.multiactive[t]!);
			return e;
		}
		return [];
	}

	//#endregion

	//#region DOM Manipulation

	//#endregion

	//#region Player Actions

	// This is an override such that enforces the table/noerrortracking options not be defined in the args parameter.
	// @ts-ignore
	// ajaxcall(
	// 	url: string,
	// 	args: (PlayerActions[keyof PlayerActions] | Record<keyof any, any>) & { lock: boolean | 'table' | 'player', action?: undefined, module?: undefined, class?: undefined, noerrortracking?: undefined, table?: undefined },
	// 	source: Gamegui,
	// 	onSuccess?| string,
	// 	callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any,
	// 	ajax_method?: 'post' | 'get' | 'iframe'): void;

	/**
	 * Checks if the player can do the specified action by taking into account:
	 * - If the interface is locked it will return false and show message "An action is already in progress", unless nomessage set to true.
	 * - If the player is not active it will return false and show message "This is not your turn", unless nomessage set to true.
	 * - If action is not in list in possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
	 * - Otherwise returns true.
	 * @param action The action to check if the player can do.
	 * @param nomessage (optional) If true, it will not show any error messages.
	 * @returns true if the player can do the specified action.
	 * @example
	 * function onClickOnGameElement( evt )  {
	 * 	if( this.checkAction( "my_action" ) ) {
	 * 		// Do the action
	 * 	}
	 * }
	 */
	checkAction(e: keyof BGA.GameStatePossibleActions, nomessage?: true): boolean{
		if (!this.checkLock(nomessage)) {
			undefined === nomessage &&
				this.developermode &&
				this.showMessage(
					"(Generated by: checkAction/" + e + ")",
					"error"
				);
			return false;
		}
		if (!this.isCurrentPlayerActive()) {
			undefined === nomessage &&
				this.showMessage(
					__(
						"lang_mainsite",
						"This is not your turn"
					),
					"error"
				);
			return false;
		}
		if (this.checkPossibleActions(e)) return true;
		undefined === nomessage && this.showMoveUnauthorized();
		return false;
	}

	/**
	 * Similar to `checkAction` but only checks if the action is a valid player action given the current state. This is particularly useful for multiplayer states when the player is not active in a 'player may like to change their mind' scenario. Unlike `checkAction`, this function does NOT take interface locking into account.
	 * @param action The action to check if any player can do.
	 * @returns true if any player can do the specified action.
	 * @example
	 * function onChangeMyMind( evt )  {
	 * 	if( this.checkPossibleActions( "my_action" ) ) {
	 * 		// Do the action
	 * 	}
	 * }
	 */
	checkPossibleActions(action: keyof BGA.GameStatePossibleActions): boolean {
		var t: any = this.gamedatas!.gamestate.possibleactions;
		this.gamedatas!.gamestate.private_state &&
			this.isCurrentPlayerActive() &&
			(t =
				this.gamedatas!.gamestate.private_state
					.possibleactions);
		for (var i in t)
			if (t[i] == action)
				return true;
		return false;
	}

	/**
	 * Checks if the interface is in lock state. This check can be used to block some other interactions which do not result in ajaxcall or if you want to suppress errors. Note: normally you only need to use `checkAction(...)`, this is for advanced cases.
	 * @param nomessage (optional) If true, it will not show any error messages.
	 * @returns true if the interface is in lock state.
	 * @example
	 * function onChangeMyMind( evt )  {
	 * 	if( this.checkLock() ) {
	 * 		// Do the action
	 * 	}
	 * }
	 */
	checkLock(nomessage?: true): boolean {
		if (this.isInterfaceLocked()) {
			undefined === nomessage &&
				this.showMessage(
					__(
						"lang_mainsite",
						"Please wait, an action is already in progress"
					),
					"error"
				);
			return false;
		}
		return true;
	}
	//#endregion

	//#region Builtin DOM Controls

	/**
	 * Shows predefined user error that move is unauthorized now.
	 * @example
	 * onPet: function(event) {
	 * 	if (checkPet(event)==false) {
	 * 		this.showMoveUnauthorized();
	 * 		return;
	 * 	}
	 * 	...
	 * },
	 */
	showMoveUnauthorized(): void {
		this.showMessage(
			__(
				"lang_mainsite",
				"This move is not authorized now"
			),
			"error"
		);
	}


	/**
	 * Adds an action button to the main action status bar (or other places).
	 * @param id The id of the created button, which should be unique in your HTML DOM document.
	 * @param label The text of the button. Should be translatable (use _() function). Note: this can also be any html, such as "<img src='img.png'>", see example below on how to make image action buttons.
	 * @param method The name of your method that must be triggered when the player clicks on this button (can be name of the method on game class or handler).
	 * @param destination (optional) The id of the parent on where to add the button, ONLY use in rare cases if location is not action bar. Use null as value if you need to specify other arguments.
	 * @param blinking (optional) If set to true, the button is going blink to catch player's attention. Please DO NOT abuse blinking button. If you need button to blink after some time passed add class 'blinking' to the button later.
	 * @param color (optional) The color of the button. Could be blue (default), red, gray or none.
	 * @example
	 * this.addActionButton( 'giveCards_button', _('Give selected cards'), 'onGiveCards' );
	 * @example
	 * this.addActionButton( 'pass_button', _('Pass'), () => this.ajaxcallwrapper('pass') );
	 * @example
	 * // You should only use this method in your "onUpdateActionButtons" method. Usually, you use it like this:
	 * onUpdateActionButtons: function( stateName, args ) {
	 * 	if (this.isCurrentPlayerActive()) {
	 * 		switch( stateName ) {
	 * 		case 'giveCards':
	 * 			this.addActionButton( 'giveCards_button', _('Give selected cards'), 'onGiveCards' );
	 * 			this.addActionButton( 'pass_button', _('Pass'), () => this.ajaxcallwrapper('pass') );
	 * 			break;
	 * 		}
	 * 	}
	 * },
	 * // In the example above, we are adding a "Give selected cards" button in the case we are on game state "giveCards". When player clicks on this button, it triggers our "onGiveCards" method.
	 * @example
	 * // Example using blinking red button:
	 * this.addActionButton( 'button_confirm', _('Confirm?'), 'onConfirm', null, true, 'red');
	 * @example
	 * // If you want to call the handled with arguments, you can use arrow functions, like this:
	 * this.addActionButton( 'commit_button', _('Confirm'), () => this.onConfirm(this.selectedCardId), null, false, 'red');
	 */
	addActionButton(id: string, label: string, method: keyof this | DojoJS.BoundFunc<this, [GlobalEventHandlersEventMap['click']]>, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none'): void
	{
		undefined === blinking && (blinking = false);
		undefined === color && (color = "blue");
		tpl = {} as NonNullable<typeof tpl>;
		tpl.id = id;
		tpl.label = label;
		tpl.addclass = "bgabutton ";
		"gray" == color
			? (tpl.addclass += "bgabutton_gray")
			: "red" == color
			? (tpl.addclass += "bgabutton_red")
			: "none" == color
			? (tpl.addclass = "")
			: (tpl.addclass += "bgabutton_blue");
		blinking && (tpl.addclass += " blinking");
		destination || (destination = "generalactions");
		e.place(
			this.format_block("jstpl_action_button", tpl),
			destination
		);
		e.connect($(id)!, "onclick", this, method as any); // keyof this will not work, but using keyof prevents circular reference.
	}

	/** Removes all buttons from the title bar. */
	removeActionButtons(): void {
		e.empty("generalactions");
	}

	/**
	 * Updates the current page title and turn description according to the game state arguments. If the current game state description `this.gamedatas.gamestate.descriptionmyturn` is modified before calling this function it allows to update the turn description without changing state. This will handle arguments substitutions properly.
	 * Note: this functional also will calls `this.onUpdateActionButtons`, if you want different buttons then state defaults, use method in example to replace them, if it becomes too clumsy use client states (see above).
	 * @example
	 * onClickFavorTile: function( evt ) {
	 * 	...
	 * 	if ( ... ) {
	 * 		this.gamedatas.gamestate.descriptionmyturn = _('Special action: ') + _('Advance 1 space on a Cult track');
	 * 		this.updatePageTitle();
	 * 		this.removeActionButtons();
	 * 		this.addActionButton( ... );
	 * 		...
	 * 		return;
	 * 	}
	 * 	...
	 * }
	 */
	updatePageTitle(stateArgs: BGA.GameState | null = null): void {
		null === stateArgs && (stateArgs = this.gamedatas!.gamestate);
		var i: NonNullable<BGA.GameState['args']> = e.clone(stateArgs!.args) || ({} as any);
		var n = this.getActivePlayers();
		var o: BGA.ID | null;
		if (1 == n.length) o = n.pop()!;
		else o = null;
		var a: string, s: string = stateArgs!.description!;
		undefined === s && (s = "");
		"gameSetup" == stateArgs!.name &&
			(s =
				Number(this.lockts) <= 0
					? e.string.substitute(
							__(
								"lang_mainsite",
								"Your ${game_name} game is about to start ..."
							),
							{
								game_name:
									this.game_name_displayed,
							}
					  )
					: e.string.substitute(
							__(
								"lang_mainsite",
								"Your ${game_name} game will start in ${s} seconds"
							),
							{
								game_name:
									this.game_name_displayed,
								s:
									'<span class="locking_time">' +
									this.lockts +
									"</span>",
							}
					  ));
		var r = "";
		if (undefined !== o && 0 !== o && null !== o) {
			a = this.gamedatas!.players[o]!.color;
			this.gamedatas!.players[o]!.color_back &&
				(r =
					"background-color:#" +
					this.gamedatas!.players[o]!.color_back +
					";");
			this.gamedatas!.players[o]!.name;
			i.actplayer = `<span style="font-weight:bold;color:#'${a}';${r}">${this.gamedatas!.players[o]!.name}</span>`;
		} else i.actplayer = "";
		if (
			this.isCurrentPlayerActive() &&
			null !== stateArgs!.descriptionmyturn
		) {
			a = this.gamedatas!.players[this.player_id!]!.color;
			r = "";
			this.gamedatas!.players[this.player_id!]!.color_back &&
				(r =
					"background-color:#" +
					this.gamedatas!.players[this.player_id!]!
						.color_back +
					";");
			i.you = `<span style="font-weight:bold;color:#'${a}';${r}">${__("lang_mainsite", "You")}</span>`;
			s = stateArgs!.descriptionmyturn!;
		}
		if (i.otherplayer) {
			a = this.gamedatas!.players[i.otherplayer_id!]!.color;
			r = "";
			this.gamedatas!.players[i.otherplayer_id!]!
				.color_back &&
				(r =
					"background-color:#" +
					this.gamedatas!.players[i.otherplayer_id!]!
						.color_back +
					";");
			i.otherplayer = `<span style="font-weight:bold;color:#'${a}';${r}">${i.otherplayer}</span>`;
		}
		s = _(s);
		for (var l = 1; l <= 5; l++)
			i[`titlearg${l}`] = "<span id='titlearg" + l + "'>N</span>";
		s = this.format_string_recursive(s, i);
		$("pagemaintitletext")!.innerHTML =
			"" == s ? "&nbsp;" : s;
		e.empty("generalactions");
		this.instantaneousMode ||
			(document.title =
				this.strip_tags(s) +
				" • " +
				this.game_name_displayed +
				" • " +
				$("websitename")!.innerHTML);
		// @ts-ignore - typescript is unable to couple the name and state args for some reason.
		this.onUpdateActionButtons(stateArgs.name, stateArgs.args);
		if ($("gotonexttable_wrap"))
			if (
				this.isCurrentPlayerActive() ||
				this.bRealtime ||
				this.isSpectator
			) {
				if (!this.bRealtime && !this.isSpectator) {
					e.style(
						"gotonexttable_wrap",
						"display",
						"inline"
					);
					e.style(
						"go_to_next_table_inactive_player",
						"display",
						"none"
					);
					e.style(
						"go_to_next_table_active_player",
						"display",
						"inline"
					);
				}
			} else {
				e.style(
					"gotonexttable_wrap",
					"display",
					"inline"
				);
				e.style(
					"go_to_next_table_inactive_player",
					"display",
					"inline"
				);
				e.style(
					"go_to_next_table_active_player",
					"display",
					"none"
				);
				undefined !==
					this.number_of_tb_table_its_your_turn &&
					// @ts-ignore - This is a bad check which always seems to be true
					"-" != this.number_of_tb_table_its_your_turn
					? 1 == this.number_of_tb_table_its_your_turn
						? ($(
								"go_to_next_player_label"
						  )!.innerHTML = e.string.substitute(
								__(
									"lang_mainsite",
									"1 table is waiting for you"
								),
								{
									nbr: this
										.number_of_tb_table_its_your_turn,
								}
						  ))
						: this
								.number_of_tb_table_its_your_turn >
						  0
						? ($(
								"go_to_next_player_label"
						  )!.innerHTML = e.string.substitute(
								__(
									"lang_mainsite",
									"${nbr} tables are waiting for you"
								),
								{
									nbr: this
										.number_of_tb_table_its_your_turn,
								}
						  ))
						: ($(
								"go_to_next_player_label"
						  )!.innerHTML = __(
								"lang_mainsite",
								"Get back to tables list"
						  ))
					: ($("go_to_next_player_label")!.innerHTML =
							__(
								"lang_mainsite",
								"Go to next table"
							));
				if (
					e.hasClass(
						"ingame_menu_notes",
						"icon32_notes"
					) &&
					undefined === this.turnBasedNotesPopupIncent &&
					!e.hasClass("ebd-body", "mobile_version")
				) {
					var d =
						'<div id="turnBasedNotesPopupIncentContent">' +
						__(
							"lang_mainsite",
							"You may note something for the next time..."
						) +
						"</div>";
					e.style(
						"ingame_menu_notes_wrap",
						"display",
						"block"
					);
					this.turnBasedNotesPopupIncent =
						new dijit.TooltipDialog({
							id: "turnBasedNotesIncent",
							content: d,
							closable: true,
						});
					dijit.popup.open({
						popup: this.turnBasedNotesPopupIncent,
						// @ts-ignore - TODO: This looks like a bug in the framework as popup directly uses for around.id
						around: "ingame_menu_notes_wrap",
						orient: [
							"below",
							"below-alt",
							"above",
							"above-alt",
						],
					});
					e.connect(
						$("turnBasedNotesPopupIncentContent")!,
						"onclick",
						function () {
							dijit.popup.close(
								// @ts-ignore - This function is not hitched nor is 'this' passed as scope. This looks like a bug.
								this.turnBasedNotesPopupIncent
							);
						}
					);
					setTimeout(
						e.hitch(this, function () {
							this.turnBasedNotesPopupIncent &&
								dijit.popup.close(
									this
										.turnBasedNotesPopupIncent
								);
						}),
						2500
					);
				}
			}
	}

	//#endregion

	//#region Player Panel and Score Counters

	/**
	 * Disables the player panel for a given player. Usually, this is used to signal that this player passes, or will be inactive during a while. Note that the only effect of this is visual. There are no consequences on the behaviour of the panel itself.
	 * @param player_id The id of the player to disable the panel for.
	 */
	disablePlayerPanel(player_id: number): void {
		e.addClass(
			"overall_player_board_" + player_id,
			"roundedboxdisabled"
		);
	}

	/**
	 * Enables a player panel that has been {@link disablePlayerPanel | disabled} before.
	 * @param player_id The id of the player to enable the panel for.
	 */
	enablePlayerPanel(player_id: number): void {
		e.removeClass(
			"overall_player_board_" + player_id,
			"roundedboxdisabled"
		);
	}

	/**
	 * Enables all player panels that have been {@link disablePlayerPanel | disabled} before.
	 */
	enableAllPlayerPanels(): void {
		e.query(".roundedboxdisabled").removeClass(
			"roundedboxdisabled"
		);
	}

	/**
	 * Updates the player ordering in the player's panel to match the current player order. This is normally called by the framework, but you can call it yourself if you change `this.gamedatas.playerorder` from a notification. Also you can override this function to change defaults OR insert a non-player panel.
	 */
	updatePlayerOrdering(): void {
		var t = 0;
		for (var i in this.gamedatas!.playerorder) {
			var n = this.gamedatas!.playerorder[i];
			e.place(
				"overall_player_board_" + n,
				"player_boards",
				t
			);
			t++;
		}
	}

	

	//#endregion

	//#region Game Images and Sounds

	/**
	 * Sets an image to not be preloaded in the game. This is particularly useful if for example you have 2 different themes for a game. To accelerate the loading of the game, you can specify to not preload images corresponding to the other theme.
	 * @param image_file_name The name of the image file to not preload.
	 * @example
	 * this.dontPreloadImage( 'cards.png' );
	 * @example
	 * // By default, do not preload anything
	 * this.dontPreloadImage( 'cards.png' );
	 * this.dontPreloadImage( 'clan1.png' );
	 * this.dontPreloadImage( 'clan2.png' );
	 * this.dontPreloadImage( 'clan3.png' );
	 * this.dontPreloadImage( 'clan4.png' );
	 * this.dontPreloadImage( 'clan5.png' );
	 * this.dontPreloadImage( 'clan6.png' );
	 * this.dontPreloadImage( 'clan7.png' );
	 * this.dontPreloadImage( 'clan8.png' );
	 * this.dontPreloadImage( 'clan9.png' );
	 * this.dontPreloadImage( 'clan10.png' );
	 * var to_preload = [];
	 * for( i in this.gamedatas.clans )
	 * {
	 * 	var clan_id = this.gamedatas.clans[i];
	 * 	to_preload.push( 'clan'+clan_id+'.png' );
	 * }
	 * 
	 * this.ensureSpecificGameImageLoading( to_preload );
	 */
	dontPreloadImage(image_file_name: string): void {
		for (var t in g_img_preload) {
			g_img_preload[t] == image_file_name && g_img_preload.splice(Number(t), 1);
		}
	}

	/**
	 * Ensures specific images are loaded. This is the opposite of {@link dontPreloadImage | dontPreloadImage} - it ensures specific images are loaded. Note: only makes sense if preload list is empty, otherwise everything is loaded anyway.
	 * @param list The list of images to ensure are loaded.
	 * @example
	 * this.ensureSpecificGameImageLoading( to_preload );
	 */
	ensureSpecificGameImageLoading(list: string[]): void
	{
		for (var i in list) {
			var n = list[i];
			if ("" != n) {
				var o = new Image();
				e.connect(o, "onload", this, "onLoadImageOk");
				e.connect(o, "onerror", this, "onLoadImageNok");
				o.src = g_gamethemeurl + "img/" + n;
			}
		}
	}

	/** Disables the standard "move" sound or this move (so it can be replaced with a custom sound). This only disables the sound for the next move. */
	disableNextMoveSound(): void {
		this.bDisableNextMoveOnNextSound = true;
	}

	//#endregion

	//#region Client States

	/**
	 * Changes the current client state without sending anything to the server. Client states is a way to simulate the state transition but without actually going to server. It is useful when you need to ask user multiple questions before you send things to server.
	 * @param newState The new state to transition to.
	 * @param args The arguments to pass to the new state.
	 * @example
	 * this.setClientState("client_playerPicksLocation", {
	 * 	descriptionmyturn: _("${you} must select location"),
	 * });
	 * @see {@link https://en.doc.boardgamearena.com/BGA_Studio_Cookbook#Multi_Step_Interactions:_Select_Worker.2FPlace_Worker_-_Using_Client_States | Multi Step Interactions: Select Worker/Place Worker - Using Client States}
	 */
	setClientState(...[newState , args]: BGA.GameStateTuple_NameArgs): void {
		"gameSetup" == newState &&
			undefined !== this.lockScreenTimeout &&
			clearTimeout(this.lockScreenTimeout);
		e.removeClass(
			"overall-content",
			"gamestate_" + this.gamedatas!.gamestate.name
		);
		this.onLeavingState(this.gamedatas!.gamestate.name);
		this.on_client_state = true;
		this.gamedatas!.gamestate.name = newState;
		for (var n in args)
			// @ts-ignore - copy the gamestate arguments
			this.gamedatas!.gamestate[n] = args[n];
		this.updatePageTitle();
		e.addClass("overall-content", "gamestate_" + newState);
		// @ts-ignore - typescript is unable to couple the name and state for some reason.
		this.onEnteringState(newState, this.gamedatas!.gamestate);
	}

	/** If you are in client state it will restore the current server state (cheap undo). */
	restoreServerGameState(): void {
		e.removeClass(
			"overall-content",
			"gamestate_" + this.gamedatas!.gamestate.name
		);
		this.onLeavingState(this.gamedatas!.gamestate.name);
		this.last_server_state;
		var t = e.clone(this.gamedatas!.gamestate.reflexion);
		this.gamedatas!.gamestate = e.clone(this.last_server_state!);
		this.on_client_state = false;
		this.gamedatas!.gamestate.reflexion = t;
		this.gamedatas!.gamestate;
		this.updatePageTitle();
		e.addClass(
			"overall-content",
			"gamestate_" + this.gamedatas!.gamestate.name
		);

		// @ts-ignore - typescript is unable to couple the name and state for some reason.
		this.onEnteringState(this.gamedatas!.gamestate.name, this.gamedatas!.gamestate);
	}

	//#endregion

	//#region Environment State and Callbacks

	/** A function that can be overridden to manage some resizing on the client side when the browser window is resized. This function is also triggered at load time, so it can be used to adapt to the viewport size at the start of the game too. */
	onScreenWidthChange(): void {}

	/** Returns "studio" for studio and "prod" for production environment (i.e. where games current runs). Only useful for debbugging hooks. Note: alpha server is also "prod" */
	// @ts-ignore TODO: Expected based on the WIKI by not defined?
	getBgaEnvironment(): 'studio' | 'prod' {}

	/** Not officially documented! Forces all resize events to activate. */
	sendResizeEvent(): void {
		// @ts-ignore - These are not valid fields based on the Mozilla documentation.
		if (document.createEventObject) window.fireEvent("resize");
		else {
			var e = document.createEvent("HTMLEvents");
			e.initEvent("resize", false, true);
			window.dispatchEvent(e);
		}
	}

	/** Not officially documented! Gets the html element for the replay log. */
	getReplayLogNode(): HTMLElement | undefined | null {
		if ($("strategytips_content"))
			return $("strategytips_content");
		var t = e.query<HTMLElement>(
			"#pagesection_strategytips .pagesection"
		);
		return t.length > 0 ? t[0] : undefined;
	}

	onGameUserPreferenceChanged?: (pref_id: number, value: number) => void = () => {};

	//#endregion

	//#region Internal

	/** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
	currentPlayerReflexionTime = { positive: true, mn: 0, s: 0 };
	/** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
	activePlayerReflexionTime = { positive: true, mn: 0, s: 0 };
	/** Internal. The `setTimeout` used for updating the reflexion time. This is called every 100ms whenever a timer is running. */
	clock_timeout: number | null = null;
	/** Internal. @deprecated This has been joined with {@link clock_timeout}. */
	clock_opponent_timeout: null = null;
	/** Internal. Timout for automatically calling {@link sendWakeUpSignal}. See {@link sendWakeupInTenSeconds} for more information. */
	wakeup_timeout: number | null = null;
	/** Internal. @deprecated This is not used within the main code file anymore. */
	wakupchek_timeout: null = null;
	/** Internal. This is the user id that is appended as a ajax argument to replay from messages. */
	forceTestUser: BGA.ID | null = null;
	/** Internal. When about to switch to a private game state, this will be populated with the arguments for that state. Next time the game state is changed, this will be consumed. */
	next_private_args: BGA.GameStateMap[keyof BGA.GameStateMap]['args'] = null;
	/** Internal. Counter for the index of archived log messages. Used to populating notifications that have passed any don't need to be processed like normal. */
	next_archive_index: number = 0;
	/** Internal. When in archive mode, this is used to manage the state of the archive playback. */
	archive_playmode: 'stop' | 'goto' | 'nextlog' | 'nextturn' | 'play' | 'nextcomment' = 'stop';
	/** Internal. The move id that should be used when starting archive playback. */
	archive_gotomove: number | null = null;
	/** Internal. The previous active player, use for updating the archive playback correctly. */
	archive_previous_player: BGA.ID | null = null;
	/** Internal. Special UID counter used for archive messages. */
	archive_uuid: number = 999999;
	/** Internal. Used to manage archive comments. */
	archiveCommentNew: DijitJS.TooltipDialog | null = null;
	/** Internal. Used to manage archive comments. */
	archiveCommentNewAnchor: string | "archivecontrol_editmode_centercomment" | "page-title" = "";
	/** Internal. Used to manage archive comments. */
	archiveCommentNo: number = 0;
	/** Internal. Used to manage archive comments. */
	archiveCommentNbrFromStart: number = 0;
	/** Internal. Used to manage archive comments. */
	archiveCommentLastDisplayedNo: BGA.ID = 0;
	/** Internal. Used to manage archive comments. */
	archiveCommentLastDisplayedId: string | number = 0;
	/** Internal. Used to manage archive comments. */
	archiveCommentMobile: { id: string | number, anchor: string | "archivecontrol_editmode_centercomment" | "page-title", bCenter: boolean, lastX: number, lastY: number, timeout?: number } = { id: 0, anchor: "", bCenter: false, lastX: 0, lastY: 0 };
	/** Internal. Used to manage archive comments. */
	archiveCommentPosition = ["below", "above", "after", "before"];
	/** Internal. Used to manage archive comments. */
	bJumpToNextArchiveOnUnlock: boolean = false;
	/** Internal. Used to manage archive comments. */
	archiveCommentAlreadyDisplayed: Record<string, boolean> = {};
	/** Internal. Used to manage tutorial elements. */
	tuto_pointers_types_nbr = 20 as const;
	/** Internal. Used to manage tutorial elements. */
	tuto_textarea_maxlength = 400 as const;
	/** Internal. The chat component for the table. */
	tablechat: InstanceType<BGA.ChatInput> | null = null;
	/** Internal. Used to pass video/audio chat between links. */
	mediaRatingParams: string = "";
	/** Internal. @deprecated This is not used within the main code file anymore. */
	quitDlg: null = null;
	/** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */
	nextPubbanner: null | number = null;
	/** Internal. If not null, then the interface is locked and this represent the id of the lock (some unique key). The interface can only be unlocked by this same id. See {@link isInterfaceLocked}, {@link isInterfaceUnlocked}, {@link unlockInterface}, {@link lockInterface}. */
	interface_locked_by_id: number | string | object | null | undefined = null;
	/** Internal. @deprecated This is not used within the main code file anymore. I believe this was replaced by ajax calls and the newer way to check preferences. */
	gamepreferences_control = {};
	/** Internal. The last notification containing the spectator list. This is used when re-updating the list. */
	last_visitorlist: BGA.NotifTypes['updateSpectatorList'] | null = {};
	/** Internal. The js template for player tooltips. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_player_tooltip = '<div class="active_player_iconinfos"><div class="emblemwrap_xxl"><img class="emblem" src="${avatarurl}"></img></div><div class="active_player_small_infos_block"><p><div class="bga-flag" data-country="${flag}" id="flag_${player_id}"></div> ${country} ${city}</p><p><div class="fa fa-comment-o languages_spoken" id="ttspeak_${player_id}"></div> <span id="speak_${player_id}">${languages}</span></p><p><div class="fa ${genderclass}" id="gender_${player_id}"></div></p> </div><div id="reputationbar_${player_id}" class="progressbar progressbar_reputation reputation_${karma_class}" style="display:${progressbardisplay}"><div class="progressbar_label"><span class="symbol">☯</span><span class="value">${karma}%</span></div><div class="progressbar_bar"><span class="progressbar_valuename">${karma_label}</span><div class="progressbar_content" style="width:${karma}%"><span class="progressbar_valuename">${karma_label}</span></div></div></div></div>';
	/** Internal. This is not set anywhere in the source code, but looks like it should be a playerlocation component. */
	playerlocation: null = null;
	/** Internal. A record for looking up replay points. When the user click on a replay button, this is used to find the id to replay from. */
	log_to_move_id: Record<number, BGA.ID> = {};
	/** Internal. A record of tutorial dialogs. This is used for managing dialogs by id rather than reference. */
	tutorialItem: Record<string, DijitJS.Dialog | DijitJS.TooltipDialog> = {};
	/** Internal. True if this was previously the current active player. Updated whenever a notification packet is successfully dispatched. */
	current_player_was_active: boolean = false;
	/** Internal. Represents if this game client is *visually* the active player. This is only updated after {@link updateActivePlayerAnimation}. */
	current_player_is_active: boolean = false;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorMouveOver: DojoJS.Handle | null = null;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickHook: DojoJS.Handle | null = null;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickCounter: number = 0;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickCooldown: number | null = null;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickNumberSinceCooldown: number = 0;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorTimeout?: number | null;
	/** Internal. Used purely for {@link registerEbgControl} and {@link destroyAllEbgControls}. */
	ebgControls: { destroy?(): any }[] = [];
	/** Internal. @deprecated This is not used within the main code file anymore. */
	bThisGameSupportFastReplay: boolean = false;
	/** Internal. Record for the loading status for an image url, where false is not loaded and true is loaded. */
	images_loading_status: Record<string, boolean> = {};
	/** Internal. Used for presentation when resynchronizing notifications (re-downloading). */
	log_history_loading_status = { downloaded: 0, total: 0, loaded: 0 };
	/** Internal. The js template for player ranking. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_player_ranking = '<div class="player_in_list player_in_list_withbaseline player_in_list_fullwidth player_in_list_rank ${add_class}">                    <div class="rank">${rank}</div>                    <div class="emblemwrap ${premium}">                        <img class="pl_avatar emblem" src="${avatar}"/>                        <div class="emblempremium"></div>                        <i class="fa fa-${device} playerstatus status_${status}"></i>                    </div>                    <a href="/player?id=${id}" class="playername">${name}</a>                    <div class="player_baseline"><div class="bga-flag" data-country="${flag}" id="flag_${id}" style="display:${flagdisplay}"></div></div>                    <div class="ranking ${additional_ranking}">${ranking}</div>                </div>';
	/** Internal. The js template for a hotseat player. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_hotseat_interface = '<iframe src="${url}" frameborder="0"  class="hotseat_iframe" id="hotseat_iframe_${player_id}"></iframe>';
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dxaxis: number = 40;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dzaxis: number = 10;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dxpos: number = -25;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dypos: number = 0;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dscale: number = 1.4;
	/** Internal. If 3d controls are enabled. See {@link init3d}. */
	control3dmode3d: boolean | 0 | 1 = false;

	/** Internal. This looks like a Socket.IO type, but not work npm this type that will never be used in a game. */
	gs_socket?: socket.IO.Socket;
	/** Internal. */
	gs_socketio_url?: string;
	/** Internal. */
	gs_socketio_path?: 'r' | string;
	/** Internal. */
	debug_from_chat?: boolean;
	/** Internal. */
	chat_on_gs_side?: boolean;
	/** Internal. WIP. */
	decision?: BGA.Gamedatas['decision'];
	/** Internal. The current server number this game is being played on. */
	gameserver?: BGA.ID;
	/** Internal. The bundle version for js. */
	jsbundlesversion?: string;
	/** Internal. @deprecated This is not used anywhere in the game code. */
	bActiveEvents?: boolean;
	/** Internal. Helper for where to send the user when on quick game ends. */
	quickGameEnd?: boolean;
	/** Internal. Helper for where to send the user when on quick game ends. */
	quickGameEndUrl?: string;
	/** Internal. WIP */
	bTimerCommon?: boolean;
	/** Internal. WIP */
	turnBasedNotes?: string;
	/** Internal. WIP */
	gameeval?: boolean;
	/** Internal. WIP */
	gamecanapprove?: boolean;
	/** Internal. WIP */
	bUseWebStockets?: boolean;
	/** Internal. WIP */
	metasite_tutorial?: number[];
	/** Internal. WIP */
	tournament_id?: null | number;
	/** Internal. WIP */
	lockts?: number;
	/** Internal. WIP */
	mslobby?: 'lobby';
	/** Internal. WIP */
	game_status?: 'public' | 'beta_restricted' | 'beta' | 'private';
	/** Internal. WIP */
	game_group?: `${number}` | "";
	/** Internal. WIP */
	emergencymsg?: BGA.NotifTypes['chat'][];
	/** Internal. WIP */
	hotseat_interface?: 'normal' | 'hotseataccount' | 'single_screen'
	/** Internal. WIP */
	hotseatplayers?: number[];
	bDisableNextMoveOnNextSound?: boolean;
	lockScreenTimeout?: number;
	turnBasedNotesPopupIncent?: DijitJS.TooltipDialog;
	/** If the game/table being viewed is an outdated version of the game. */
	gameUpgraded?: boolean;
	paymentbuttons?: InstanceType<BGA.PaymentButtons>;
	playingHours?: { 0: boolean; 1: boolean; 2: boolean; 3: boolean; 4: boolean; 5: boolean; 6: boolean; 7: boolean; 8: boolean; 9: boolean; 10: boolean; 11: boolean; 12: boolean; 13: boolean; 14: boolean; 15: boolean; 16: boolean; 17: boolean; 18: boolean; 19: boolean; 20: boolean; 21: boolean; 22: boolean; 23: boolean; };
	bEnabledArchiveAdvancedFeatures?: boolean;
	archiveGotoMenu?: DijitJS.TooltipDialog;
	default_viewport?: string;
	bDisableSoundOnMove?: boolean;
	pageheader?: InstanceType<BGA.PageHeader>;
	pageheaderfooter?: InstanceType<BGA.PageHeader>;
	savePlayAreaXScroll?: number;
	bForceMobileHorizontalScroll?: boolean;
	showOpponentCursorLastEvent?: (MouseEvent & {
		path?: Node[];
	}) | null;
	showOpponentCursorLastInfosSendMark?: string | null;
	eloEndOfGameAnimationDatas?: Record<BGA.ID, {
		player_id: BGA.ID;
		from: number;
		to: number;
		current: number;
	}>;
	eloEndOfGameAnimationFrameCurrentDuration?: number;
	tableresults?: InstanceType<BGA.TableResults>;
	tableresults_datas?: BGA.TableResultsData;
	closeRankMenu?: DojoJS.Handle;
	bGameEndJustHappened?: boolean;
	end_of_game_timestamp?: number;
	archiveCommentImageToAnchor?: string; // url
	updatedReflexionTime?: {
		initial: { [playerId: BGA.ID]: number };
		initial_ts: { [playerId: BGA.ID]: number };
		total: { [playerId: BGA.ID]: number };
	};
	currentPlayerReflexionStartAt?: number;
	wakeupcheck_timeout?: number | null;
	fireDlg?: InstanceType<BGA.PopinDialog> & {
		telParentPage: Gamegui_Template;
	};
	fireDlgStatus?: string;
	list_of_players_to_expel?: string[];
	savedSynchronousNotif?: { [K in keyof BGA.NotifTypes]?: number } = {};
	archiveCommentPointElementMouseEnterEvt?: DojoJS.Handle | null = null;
	tutoratingDone?: boolean;
	bTutorialRatingStep?: boolean;
	archiveCommentDraggingInProgress?: boolean;
	archiveCommentPointElementMouseEnterItem?: string;
	bMustRemoveArchiveCommentImage?: boolean;
	addCommentDragMouseUpLink?: DojoJS.Handle;
	addCommentDragMouseOverLink?: DojoJS.Handle;
	publishTuto?: InstanceType<BGA.PopinDialog>;
	archiveCursorPos?: BGA.ID;
	expelledDlg?: InstanceType<BGA.PopinDialog>;
	tutorialActiveDlg?: InstanceType<BGA.PopinDialog>;
	turnBasedNotesIsOpen?: boolean;
	turnBasedNotesPopup?: DijitJS.TooltipDialog;
	last_rank_displayed?: number;
	ranking_mode_displayed?: 'arena' | 'elo';
	hotseat_focus?: BGA.ID | null;
	hotseat?: Record<BGA.ID, 0 | 1>;
	save?: HTMLElement;
	control3ddraggable?: InstanceType<BGA.Draggable>;

	completesetup(game_name: string, game_name_displayed: string, table_id: BGA.ID, player_id: BGA.ID, credentials: HexString | null, privatechannel_id: HexString | null, cometd_service: "keep_existing_gamedatas_limited" | "socketio" | string, gamedatas: BGA.Gamedatas, players_metadata: Record<BGA.ID, BGA.PlayerMetadata> | null, socket_uri: `https://${string}:${number}` | null, socket_path?: 'r' | string) {
		var u = "keep_existing_gamedatas_limited" == cometd_service;
		this.gamedatas = gamedatas;
		if (e.hasClass("ebd-body", "new_gameux")) {
			e.place($("upperrightmenu")!, "page-title");
			e.place($("reflexiontime_value")!, "page-title");
			e.place($("ingame_menu_content")!, "page-title");
		}
		var p: BGA.GameState[] = [this.gamedatas.gamestate];
		this.gamedatas.gamestate.private_state &&
			p.push(this.gamedatas.gamestate.private_state);
		p.forEach(
			function (this: Gamegui_Template, e: BGA.GameState) {
				if (undefined !== e.id) {
					undefined ===
						this.gamedatas!.gamestates[e.id] &&
						console.error(
							"Unknow gamestate: " + e.id
						);
					undefined !== this.gamedatas!.gamestates[e.id]!.args &&
						delete this.gamedatas!.gamestates[e.id]!.args;
					undefined !== this.gamedatas!.gamestates[e.id]!.updateGameProgression &&
						delete this.gamedatas!.gamestates[e.id]!.updateGameProgression;
					for (var t in this.gamedatas!.gamestates[e.id])
						// @ts-ignore - copy the gamestate props
						e[t] = this.gamedatas!.gamestates[e.id][t];
				}
			}.bind(this)
		);
		if (u) this.applyTranslationsOnLoad();
		else {
			this.game_name = game_name;
			this.game_name_displayed = game_name_displayed;
			this.player_id = player_id;
			this.table_id = table_id;
			this.original_game_area_html = $("game_play_area")!.innerHTML;
			this.setLoader(10, 10);
			for (var m in gamedatas.players)
				String(this.player_id) == m && (this.isSpectator = false);
			$("debug_output") && (this.developermode = true);
			$("notifwindow_beacon") &&
				(this.isNotifWindow = true);
			e.query(".expressswitch").length > 0 &&
				(g_archive_mode || (this.forceTestUser = player_id));
			if (this.discussblock && this.isSpectator) {
				this.showMessage(
					__(
						"lang_mainsite",
						"A player at thie table blocked you."
					),
					"error"
				);
				setTimeout(
					e.hitch(this, function () {
						window.location.href =
							this.metasiteurl +
							"/table?table=" +
							this.table_id;
					}),
					2e3
				);
				return;
			}
			g_i18n.jsbundlesversion = this.jsbundlesversion!;
			g_i18n.loadBundle("lang_mainsite");
			g_i18n.loadBundle("lang_" + game_name);
			g_i18n.setActiveBundle("lang_" + game_name);
			this.translate_client_targets(
				{ you: __("lang_mainsite", "You") },
				"lang_" + game_name
			);
			this.init_core();
			this.setupCoreNotifications();
			this.applyTranslationsOnLoad();
			if ("undefined" != typeof g_replayFrom) {
				this.lockInterface("replayFrom");
				this.instantaneousMode = true;
				if ($("current_header_infos_wrap")) {
					e.style(
						"current_header_infos_wrap",
						"display",
						"none"
					);
					e.style(
						"previously_on",
						"display",
						"block"
					);
				}
				if (this.gameUpgraded) {
					e.addClass(
						"loader_skip",
						"loader_skip_warning"
					);
					$("loader_skip")!.innerHTML =
						'<div class="icon20 icon20_warning"></div> ' +
						__(
							"lang_mainsite",
							"This game has been updated since game start: thus the replay is EXPERIMENTAL."
						) +
						"<br/>" +
						$("loader_skip")!.innerHTML;
					e.style("gameUpdated", "display", "block");
				}
			}
			this.onGameUiWidthChange();
		}
		Number(this.gamedatas.game_result_neutralized) > 0 &&
			this.showNeutralizedGamePanel(
				this.gamedatas.game_result_neutralized!,
				this.gamedatas.neutralized_player_id
			);
		this.isNotifWindow || this.setup(gamedatas, u);
		"function" == typeof this.onGameUserPreferenceChanged &&
			Object.entries(this.prefs!).forEach((e) =>
				this.onGameUserPreferenceChanged!(
					Number(e[0]),
					e[1].value as number
				)
			);
		for (m in gamedatas.players) {
			let g = gamedatas.players[m as BGA.ID]!;
			if (undefined === this.scoreCtrl[m as BGA.ID]) {
				$("player_score_" + m)!.innerHTML = String(g.score);
				this.scoreCtrl[m as BGA.ID] = new ebg.counter();
				this.scoreCtrl[m as BGA.ID]!.create(
					$("player_score_" + m)
				);
			}
			if (undefined !== g.score) {
				if (!this.is_sandbox) {
					this.scoreCtrl[m as BGA.ID]!.setValue(g.score);
					null === g.score &&
						this.scoreCtrl[m as BGA.ID]!.disable();
				}
			} else this.scoreCtrl[m as BGA.ID]!.disable();
			u || (this.gamedatas.players[m as BGA.ID]!.ack = "ack");
		}
		if (!u) {
			this.players_metadata = players_metadata!;
			for (m in players_metadata) {
				let g = players_metadata![m as BGA.ID]!;
				var f = this.getPlayerTooltip(g);
				this.addTooltipHtml("player_name_" + m, f);
				this.addTooltipHtml("avatar_" + m, f);
				String(1) == players_metadata![m as BGA.ID]!.is_premium &&
					e.addClass("avatarwrap_" + m, "is_premium");
				null !== g.gender &&
				String(0) == g.gender &&
				undefined !== gamedatas.players[m as BGA.ID]
					? this.gameFemininePlayers.push(
							gamedatas.players[m as BGA.ID]!.name
					  )
					: null !== g.gender &&
					  String(1) == g.gender &&
					  undefined !== gamedatas.players[m as BGA.ID]!
					? this.gameMasculinePlayers.push(
							gamedatas.players[m as BGA.ID]!.name
					  )
					: this.gameNeutralPlayers.push(
							gamedatas.players[m as BGA.ID]!.name
					  );
			}
			if (
				undefined !== this.gamedatas.players[player_id] &&
				1 != this.gamedatas.players[player_id]!.zombie &&
				this.rtc_mode > 0 &&
				null !== this.rtc_room
			)
				if (this.rtc_room.indexOf("T") >= 0)
					this.setNewRTCMode(
						this.table_id!,
						null,
						this.rtc_mode
					);
				else if (this.rtc_room.indexOf("P") >= 0) {
					var _ = this.rtc_room.substr(1).split("_") as [BGA.ID, BGA.ID],
						v = _[0] == player_id ? _[1] : _[0];
					this.createChatBarWindow(
						{
							type: "privatechat",
							id: v,
							label: "",
							game_name: "",
							url: "",
							channel: `/player/p${v}`,
							window_id: `privatechat_${v}`,
							subscribe: false,
							start: "expanded",
						},
						false
					);
					this.expandChatWindow(`privatechat_${v}`);
					this.setNewRTCMode(null, v, this.rtc_mode);
				}
			this.notifqueue.game = this;
		}
		this.last_server_state = e.clone(
			this.gamedatas.gamestate
		);
		this.updateActivePlayerAnimation() &&
			this.sendWakeUpSignal();
		this.updatePageTitle();
		this.gamedatas.decision = this.decision!;
		this.updateDecisionPanel(this.gamedatas.decision);
		"gameEnd" == gamedatas.gamestate.name
			? this.onGameEnd()
			// @ts-ignore - The user defined games states will not include this name (ignore infer always false)
			: "tutorialStart" == gamedatas.gamestate.name &&
			  this.isCurrentPlayerActive() &&
			  this.showTutorialActivationDlg();
		e.addClass(
			"overall-content",
			"gamestate_" + gamedatas.gamestate.name
		);
		// @ts-ignore - typescript is unable to couple the name and state for some reason.
		this.onEnteringState(gamedatas.gamestate.name, gamedatas.gamestate);
		if (null != gamedatas.gamestate.private_state) {
			this.updatePageTitle(gamedatas.gamestate.private_state);
			// @ts-ignore - typescript is unable to couple the name and state for some reason.
			this.onEnteringState( gamedatas.gamestate.private_state.name, gamedatas.gamestate.private_state);
		}
		if (
			"gameSetup" == gamedatas.gamestate.name &&
			!g_archive_mode
		) {
			this.paymentbuttons = new ebg.paymentbuttons();
			this.paymentbuttons.create(this);
			this.lockScreenCounter();
		}
		$("pr_gameprogression")!.innerHTML = String(gamedatas.gamestate.updateGameProgression);
		if (!u) {
			this.addTooltip(
				"game_progression_bar",
				__("lang_mainsite", "Current game progression"),
				""
			);
			this.addTooltip(
				"toggleSound",
				"",
				__("lang_mainsite", "Switch the sound on/off")
			);
			this.addTooltip(
				"globalaction_pause",
				"",
				__(
					"lang_mainsite",
					"Signals you want to pause the game"
				)
			);
			this.addTooltip(
				"globalaction_fullscreen",
				"",
				__("lang_mainsite", "Fullscreen mode")
			);
			this.addTooltip(
				"globalaction_help",
				"",
				__("lang_mainsite", "Help about this game")
			);
			this.addTooltip(
				"globalaction_preferences",
				"",
				__(
					"lang_mainsite",
					"Change your preferences for this game"
				)
			);
			this.addTooltip(
				"globalaction_quit",
				"",
				__("lang_mainsite", "Quit current game")
			);
			e.connect(
				$("globalaction_fullscreen")!,
				"onclick",
				this,
				"onGlobalActionFullscreen"
			);
			e.connect(
				$("globalaction_zoom_wrap")!,
				"onclick",
				this,
				"onZoomToggle"
			);
			e.connect(
				$("ingame_menu_quit")!,
				"onclick",
				this,
				"onGlobalActionQuit"
			);
			e.connect(
				$("ingame_menu_back")!,
				"onclick",
				this,
				"onGlobalActionBack"
			);
			e.connect(
				$("skip_player_turn")!,
				"onclick",
				this,
				"onWouldFirePlayer"
			);
			if (g_archive_mode) {
				this.setLoader(100, 100);
				e.style("connect_status", "display", "none");
				e.style("connect_gs_status", "display", "none");
				e.style("chatbar", "display", "none");
				$("gotonexttable_wrap") &&
					e.destroy("gotonexttable_wrap");
				if (e.hasClass("archivecontrol", "demomode")) {
					e.style(
						"archivecontrol",
						"display",
						"none"
					);
					if ($("demomode_registration_ok")) {
						e.connect(
							$("demomode_registration_email")!,
							"onfocus",
							this,
							function () {
								$<HTMLInputElement>(
									"demomode_registration_email"
								)!.value = "";
							}
						);
						e.connect(
							$("demomode_registration_ok")!,
							"onclick",
							this,
							function (t) {
								e.stopEvent(t);
								this.ajaxcall(
									"/archive/archive/fastRegistration.html",
									{
										email: $<HTMLInputElement>(
											"demomode_registration_email"
										)!.value,
									},
									this,
									function (e) {}
								);
							}
						);
					}
				}
				if ("edit" == g_tutorialwritten!.mode) {
					var b = __(
						"lang_mainsite",
						"Publish as tutorial"
					);
					g_tutorialwritten!.top_game &&
						e.place(
							'<div class="whiteblock"><p><i class="fa fa-warning"></i> ' +
								__(
									"lang_mainsite",
									"This game is one of the most played: admins may be particularly demanding and picky about tutorials written for this game."
								) +
								"</div>",
							"logs_wrap",
							"before"
						);
					g_tutorialwritten!.old_game &&
						e.place(
							'<div class="whiteblock"><p><i class="fa fa-warning"></i> ' +
								__(
									"lang_mainsite",
									"This replay is quite old and you may not benefit from the most recent tutorial creation tool features: we suggest you to choose a more recent one."
								) +
								"</div>",
							"logs_wrap",
							"before"
						);
					if ("private" == this.game_status)
						e.place(
							'<div class="whiteblock"><p><i class="fa fa-info-circle"></i> ' +
								__(
									"lang_mainsite",
									"You cannot publish a tutorial for a game in Alpha"
								) +
								"<p>",
							"logs_wrap",
							"before"
						);
					else if ("terramystica" == this.game_name)
						e.place(
							'<div class="whiteblock"><p><i class="fa fa-info-circle"></i> ' +
								__(
									"lang_mainsite",
									"Sorry, but for legal reasons we cannot propose tutorial for this game on BGA."
								) +
								"<p>",
							"logs_wrap",
							"before"
						);
					else if (
						null !== g_tutorialwritten!.status
					) {
						b = __(
							"lang_mainsite",
							"Update tutorial"
						);
						var y =
							window.location.href + "&tutorial";
						y = y.replace(
							"#&tutorial",
							"&tutorial"
						);
						if (
							"public" == g_tutorialwritten!.status
						) {
							e.place(
								'<div class="whiteblock"><p>' +
									__(
										"lang_mainsite",
										"Your tutorial is now available to everyone on BGA."
									) +
									'<p><a href="' +
									y +
									'" target="_blank">' +
									__(
										"lang_mainsite",
										"Preview tutorial"
									) +
									"</a></p></div>",
								"logs_wrap",
								"before"
							);
							e.place(
								'<div class="whiteblock"><p><i class="fa fa-warning"></i> ' +
									__(
										"lang_mainsite",
										"Any update you make is immediately applied to the published tutorial."
									) +
									"</div>",
								"logs_wrap",
								"before"
							);
						} else if (
							"rejected" ==
							g_tutorialwritten!.status
						)
							e.place(
								'<div class="whiteblock"><p>' +
									__(
										"lang_mainsite",
										"Your tutorial has unfortunately be rejected :("
									) +
									'<p><a href="' +
									y +
									'" target="_blank">' +
									__(
										"lang_mainsite",
										"Preview tutorial"
									) +
									"</a></p></div>",
								"logs_wrap",
								"before"
							);
						else if (
							"beta" == g_tutorialwritten!.status
						) {
							e.place(
								'<div class="whiteblock"><p>' +
									__(
										"lang_mainsite",
										"BETA: Your tutorial is now being tested with some random players on BGA."
									) +
									'<p><a href="' +
									y +
									'" target="_blank">' +
									__(
										"lang_mainsite",
										"Preview tutorial"
									) +
									"</a></p></div>",
								"logs_wrap",
								"before"
							);
							e.place(
								'<div class="whiteblock"><p><i class="fa fa-warning"></i> ' +
									__(
										"lang_mainsite",
										"Any update you make is immediately applied to the published tutorial."
									) +
									"</div>",
								"logs_wrap",
								"before"
							);
						} else if (
							"alpha" == g_tutorialwritten!.status
						) {
							e.place(
								'<div class="whiteblock"><p>' +
									__(
										"lang_mainsite",
										"ALPHA: Your tutorial is being reviewed by some expert players."
									) +
									'<p><p style="word-wrap: break-word;"><a href="' +
									y +
									'" target="_blank">' +
									y +
									"</a></p></div>",
								"logs_wrap",
								"before"
							);
							e.place(
								'<div class="whiteblock"><p><i class="fa fa-warning"></i> ' +
									__(
										"lang_mainsite",
										"Any update you make is immediately applied to the published tutorial."
									) +
									"</div>",
								"logs_wrap",
								"before"
							);
						}
					} else
						e.place(
							'<p style="text-align:center;display:none;" id="publishtutorial_block" style="display:none;"><a id="publishtutorial" class="bgabutton bgabutton_blue">' +
								b +
								"</a><p>",
							"logs_wrap",
							"before"
						);
					e.place(
						'<p style="text-align:center;display:block;"><a id="howto_tutorial" class="bgabutton bgabutton_gray"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' +
							__(
								"lang_mainsite",
								"How to build a tutorial?"
							) +
							"</a><p>",
						"logs_wrap",
						"before"
					);
					for (
						var w =
								'<div id="tuto_pointers_choice">',
							C = 1;
						C <= this.tuto_pointers_types_nbr;
						C++
					) {
						w +=
							'<div id="tuto_pointer_' +
							C +
							'" class="tuto_pointer tuto_pointer_' +
							C +
							'" style="background-position: -' +
							((C - 1) % 10) * 42 +
							"px -" +
							42 * Math.floor((C - 1) / 10) +
							'px"></div>';
					}
					w += "</div>";
					e.place(w, "logs_wrap", "before");
					e.query<HTMLElement>(".tuto_pointer").connect(
						"onclick",
						this,
						"onTutoPointerClick"
					);
					e.addClass("tuto_pointer_1", "selected");
					e.connect(
						$("howto_tutorial")!,
						"onclick",
						this,
						"onHowToTutorial"
					);
					$("publishtutorial") &&
						e.connect(
							$("publishtutorial")!,
							"onclick",
							this,
							"onPublishTutorial"
						);
					$("publishtutorial_block") &&
						e.style(
							"publishtutorial_block",
							"display",
							e.query(".archiveComment").length >
								0
								? "block"
								: "none"
						);
					e.style(
						"archivecontrol_editmode",
						"display",
						"block"
					);
					e.style(
						"archivecontrol_viewmode",
						"display",
						"none"
					);
				} else {
					if (
						g_tutorialwritten!.author ==
						g_tutorialwritten!.viewer_id
					) {
						if ($("bga_release_id"))
							var k =
								$("bga_release_id")!.innerHTML;
						else {
							var x = g_themeurl.split("/");
							x.pop();
							k = x.pop()!;
						}
						var T =
							"/archive/replay/" +
							k +
							"/?table=" +
							this.table_id +
							"&player=" +
							this.player_id +
							"&comments=" +
							g_tutorialwritten!.author +
							";";
						e.place(
							'<p style="text-align:center;display:block;"><a href="' +
								T +
								'" class="bgabutton bgabutton_gray"><i class="fa fa-pencil" aria-hidden="true"></i> ' +
								__(
									"lang_mainsite",
									"Edit tutorial"
								) +
								"</a><p>",
							"logs_wrap",
							"before"
						);
					}
					e.addClass(
						"ebd-body",
						"game_tutorial_mode"
					);
					e.style(
						"archivecontrol_editmode",
						"display",
						"none"
					);
					e.style(
						"archivecontrol_viewmode",
						"display",
						"block"
					);
					e.style("ingame_menu", "display", "none");
					e.style(
						"maingameview_menufooter",
						"display",
						"none"
					);
					e.style(
						"overall-footer",
						"display",
						"none"
					);
					e.style("tableinfos", "display", "none");
					e.query(
						".player_board_inner .emblempremium"
					).style("display", "none");
					e.query(
						".player_board_inner .timeToThink"
					).style("display", "none");
					e.query(
						".player_board_inner .player_status"
					).style("display", "none");
					e.query(
						".player_board_inner .bga-flag"
					).style("display", "none");
					e.query(
						".player_board_inner .player_elo_wrap"
					).style("display", "none");
					e.query(
						".player_board_inner .doubletime_infos"
					).style("display", "none");
					if ($("quitTutorialTop")) {
						e.connect(
							$("quitTutorialTop")!,
							"onclick",
							this,
							"onQuitTutorial"
						);
						e.connect(
							$("logoicon")!,
							"onclick",
							this,
							"onQuitTutorial"
						);
					}
					this.notifqueue.setSynchronous(
						"archivewaitingdelay",
						1e3
					);
					e.place(
						'<p style="text-align:center;display:block;"><a id="restart_tutorial" class="bgabutton bgabutton_gray" href="javascript:window.location.href=window.location.href"><i class="fa fa-undo" aria-hidden="true"></i> ' +
							__(
								"lang_mainsite",
								"Restart tutorial?"
							) +
							"</a><p>",
						"logs_wrap",
						"before"
					);
					e.connect(
						$("ebd-body")!,
						"onkeyup",
						this,
						"onKeyUpTutorial"
					);
					e.connect(
						$("ebd-body")!,
						"onkeypress",
						this,
						"onKeyPressTutorial"
					);
				}
				e.connect(
					$("archive_next")!,
					"onclick",
					this,
					"onArchiveNext"
				);
				e.connect(
					$("archive_next_turn")!,
					"onclick",
					this,
					"onArchiveNextTurn"
				);
				e.connect(
					$("archive_end_game")!,
					"onclick",
					this,
					"onArchiveGoTo"
				);
				e.connect(
					$("archive_go_to_nextComment")!,
					"onclick",
					this,
					"onNewArchiveCommentNext"
				);
				e.connect(
					$("archive_history")!,
					"onclick",
					this,
					"onArchiveHistory"
				);
				e.connect(
					$("archive_nextlog")!,
					"onclick",
					this,
					"onArchiveNextLog"
				);
				e.connect(
					$("archive_addcomment")!,
					"onclick",
					this,
					"onArchiveAddComment"
				);
				this.addTooltip(
					"archive_addcomment",
					"",
					__(
						"lang_mainsite",
						"Add some public comment"
					)
				);
				this.addTooltip(
					"archive_history",
					"",
					__("lang_mainsite", "Show game history")
				);
				this.addTooltip(
					"archive_nextlog",
					"",
					__("lang_mainsite", "Next visible change")
				);
				this.addTooltip(
					"archive_restart",
					"",
					__("lang_mainsite", "Go back to first move")
				);
				this.addTooltip(
					"archive_next",
					"",
					__("lang_mainsite", "Next move")
				);
				this.addTooltip(
					"archive_next_turn",
					"",
					__("lang_mainsite", "Next turn")
				);
				this.addTooltip(
					"archive_end_game",
					"",
					__("lang_mainsite", "Go to game end")
				);
				e.place(
					'<div id="archiveCommentMinimized"><div id="archiveCommentMinimizedIcon"><i class="fa fa-graduation-cap fa-2x"></i></div></div>',
					"maintitlebar_content"
				);
				e.connect(
					$("archiveCommentMinimizedIcon")!,
					"onclick",
					this,
					"onArchiveCommentMaximize"
				);
				e.style("archive_history", "display", "none");
				e.style("archive_next_turn", "display", "none");
				e.style("archive_nextlog", "display", "none");
				e.style(
					"archive_go_to_move_wrap",
					"display",
					"none"
				);
				e.style(
					"archive_go_to_move",
					"display",
					"none"
				);
				e.connect(
					$("advanced_replay_features")!,
					"onclick",
					this,
					function (t) {
						e.stopEvent(t);
						e.style(
							"archive_history",
							"display",
							"inline"
						);
						e.style(
							"archive_nextlog",
							"display",
							"inline"
						);
						e.style(
							"advanced_replay_features",
							"display",
							"none"
						);
						e.style(
							"archive_go_to_move_wrap",
							"display",
							"block"
						);
						this.bEnabledArchiveAdvancedFeatures =
							true;
						if (undefined !== this.archiveGotoMenu) {
							dijit.popup.close(
								this.archiveGotoMenu
							);
							this.archiveGotoMenu.destroy();
							delete this.archiveGotoMenu;
						}
					}
				);
			}
			e.connect(
				$("not_playing_help")!,
				"onclick",
				this,
				"onNotPlayingHelp"
			);
			e.connect(
				$("ai_not_playing")!,
				"onclick",
				this,
				"onAiNotPlaying"
			);
			e.connect(
				$("wouldlikethink_button")!,
				"onclick",
				this,
				"onWouldLikeToThink"
			);
			e.connect(
				$("decision_yes")!,
				"onclick",
				this,
				"onPlayerDecide"
			);
			e.connect(
				$("decision_no")!,
				"onclick",
				this,
				"onPlayerDecide"
			);
			e.connect(
				$("zombieBack_button")!,
				"onclick",
				this,
				"onZombieBack"
			);
		}
		this.isSpectator ||
			g_archive_mode ||
			1 != gamedatas.players[this.player_id!]!.zombie ||
			this.displayZombieBack();
		if (!u) {
			e.subscribe(
				"lockInterface",
				this,
				"onLockInterface"
			);
			this.channel = `/table/t${this.table_id!}`;
			this.tablechannelSpectators = `/table/ts${this.table_id!}`;
			this.privatechannel = `/player/p${privatechannel_id}`;
			this.notifqueue.checkSequence = true;
			gamedatas.notifications.table_next_notification_no
				? (this.notifqueue.last_packet_id =
						gamedatas.notifications.table_next_notification_no)
				: (this.notifqueue.last_packet_id =
						gamedatas.notifications.last_packet_id);
			e.connect(
				this.notifqueue,
				"addToLog",
				this,
				"onNewLog"
			);
			e.subscribe("addMoveToLog", this, "addMoveToLog");
		}
		$("move_nbr") &&
			($("move_nbr")!.innerHTML =
				String(gamedatas.notifications.move_nbr));
		if ($("menu_option_value_206")!) {
			$("menu_option_value_206")!.innerHTML =
				this.playingHoursToLocal(
					$("menu_option_value_206")!.innerHTML
				);
			var A = $("menu_option_value_206")!.innerHTML;
			if (-1 == A.indexOf(":"))
				this.playingHours = {
					0: true,
					1: true,
					2: true,
					3: true,
					4: true,
					5: true,
					6: true,
					7: true,
					8: true,
					9: true,
					10: true,
					11: true,
					12: true,
					13: true,
					14: true,
					15: true,
					16: true,
					17: true,
					18: true,
					19: true,
					20: true,
					21: true,
					22: true,
					23: true,
				};
			else {
				var j = toint(A.substr(0, A.indexOf(":")));
				this.playingHours = {
					0: false,
					1: false,
					2: false,
					3: false,
					4: false,
					5: false,
					6: false,
					7: false,
					8: false,
					9: false,
					10: false,
					11: false,
					12: false,
					13: false,
					14: false,
					15: false,
					16: false,
					17: false,
					18: false,
					19: false,
					20: false,
					21: false,
					22: false,
					23: false,
				};
				for (var S = 0; S < 12; S++)
					// @ts-ignore - % 24 ensures that the index is in the range of 0-23
					this.playingHours[(j + S) % 24] = true;
			}
		}
		$("footer_option_value_206") &&
			($("footer_option_value_206")!.innerHTML =
				this.playingHoursToLocal(
					$("footer_option_value_206")!.innerHTML
				));
		if (!u)
			if (g_archive_mode) {
				this.initArchiveIndex();
				this.notifqueue.checkSequence = false;
				this.initCommentsForMove(
					$("move_nbr")!.innerHTML as BGA.ID
				);
				this.checkIfArchiveCommentMustBeDisplayed();
			} else {
				this.cometd_service = cometd_service;
				var E = {
					user: this.player_id,
					name: this.current_player_name,
					credentials: credentials,
				};
				this.socket = io(socket_uri!, {
					query: e.objectToQuery(E),
					transports: ["websocket", "polling"],
					path: "/" + socket_path!,
				});
				this.socket.on(
					"bgamsg",
					e.hitch(this.notifqueue, "onNotification")
				);
				this.socket.on(
					"connect",
					e.hitch(this, function (e) {
						this.onSocketIoConnectionStatusChanged(
							"connect"
						);
					})
				);
				this.socket.on(
					"connect_error",
					e.hitch(this, function (e) {
						this.onSocketIoConnectionStatusChanged(
							"connect_error",
							e
						);
					})
				);
				this.socket.on(
					"connect_timeout",
					e.hitch(this, function (e) {
						this.onSocketIoConnectionStatusChanged(
							"connect_timeout"
						);
					})
				);
				this.socket.io.on(
					"reconnect",
					e.hitch(this, function (e) {
						this.onSocketIoConnectionStatusChanged(
							"reconnect",
							e
						);
					})
				);
				this.socket.io.on(
					"reconnect_attempt",
					e.hitch(this, function (e) {
						this.onSocketIoConnectionStatusChanged(
							"reconnect_attempt"
						);
					})
				);
				this.socket.io.on(
					"reconnect_error",
					e.hitch(this, function (e) {
						this.onSocketIoConnectionStatusChanged(
							"reconnect_error",
							e
						);
					})
				);
				this.socket.io.on(
					"reconnect_failed",
					e.hitch(this, function (e) {
						this.onSocketIoConnectionStatusChanged(
							"reconnect_failed"
						);
					})
				);
				this.subscribeCometdChannel(
					"/general/emergency",
					this.notifqueue,
					"onNotification"
				);
				this.subscribeCometdChannel(
					this.channel!,
					this.notifqueue,
					"onNotification"
				);
				this.subscribeCometdChannel(
					this.tablechannelSpectators!,
					this.notifqueue,
					"onNotification"
				);
				this.subscribeCometdChannel(
					"/player/p" + this.player_id,
					this.notifqueue,
					"onNotification"
				);
				this.notifqueue.cometd_service =
					this.cometd_service;
				if ("" != this.gs_socketio_url) {
					E = {
						user: this.player_id,
						name: this.current_player_name,
						credentials: credentials,
					};
					this.gs_socket = io(this.gs_socketio_url!, {
						query: e.objectToQuery(E),
						transports: ["websocket", "polling"],
						path: "/" + this.gs_socketio_path,
					});
					this.gs_socket.on(
						"bgamsg",
						e.hitch(
							this.notifqueue,
							"onNotification"
						)
					);
					this.gs_socket.on(
						"connect",
						e.hitch(this, function (e) {
							this.onGsSocketIoConnectionStatusChanged(
								"connect"
							);
						})
					);
					this.gs_socket.on(
						"connect_error",
						e.hitch(this, function (e) {
							this.onGsSocketIoConnectionStatusChanged(
								"connect_error",
								e
							);
						})
					);
					this.gs_socket.on(
						"connect_timeout",
						e.hitch(this, function (e) {
							this.onGsSocketIoConnectionStatusChanged(
								"connect_timeout"
							);
						})
					);
					this.gs_socket.io.on(
						"reconnect",
						e.hitch(this, function (e) {
							this.onGsSocketIoConnectionStatusChanged(
								"reconnect",
								e
							);
						})
					);
					this.gs_socket.io.on(
						"reconnect_attempt",
						e.hitch(this, function (e) {
							this.onGsSocketIoConnectionStatusChanged(
								"reconnect_attempt"
							);
						})
					);
					this.gs_socket.io.on(
						"reconnect_error",
						e.hitch(this, function (e) {
							this.onGsSocketIoConnectionStatusChanged(
								"reconnect_error",
								e
							);
						})
					);
					this.gs_socket.io.on(
						"reconnect_failed",
						e.hitch(this, function (e) {
							this.onGsSocketIoConnectionStatusChanged(
								"reconnect_failed"
							);
						})
					);
					this.gs_socket.emit("join", this.channel);
					this.gs_socket.emit(
						"join",
						this.tablechannelSpectators
					);
					this.gs_socket.emit(
						"join",
						"/player/p" + this.player_id
					);
				} else {
					e.style(
						"connect_gs_status",
						"display",
						"none"
					);
					this.gs_socket = this.socket;
				}
			}
		if (!u) {
			if (this.dockedChat) {
				var N: BGA.ChannelInfos = {
					type: "table",
					game_name: this.game_name!,
					id: this.table_id!,
					label: __(
						"lang_mainsite",
						"Discuss at this table"
					),
					url: null,
					channel: `/table/t${this.table_id!}`,
					window_id: `table_${this.table_id!}`,
					start: "collapsed",
					notifymethod: "title",
					autoShowOnKeyPress: true,
				};
				this.createChatBarWindow(N, false);
				e.connect(
					this.chatbarWindows[`table_${this.table_id!}`]!.input,
					"callbackBeforeChat",
					this,
					"onBeforeChatInput"
				);
				e.connect(
					$(
						"chatbarinput_table_" +
							this.table_id +
							"_input"
					)!,
					"onblur",
					this,
					"onChatInputBlur"
				);
				e.connect(
					document,
					"onkeydown",
					this,
					"onChatKeyDown"
				);
				e.connect(
					$(
						"chatbarinput_table_" +
							this.table_id +
							"_input"
					)!,
					"onkeydown",
					this,
					"onChatKeyDown"
				);
				this.loadPreviousMessage(
					"table",
					this.table_id!
				);
			} else {
				this.tablechat = new ebg.chatinput();
				this.tablechat.detachType = "playtable";
				this.tablechat.detachTypeGame = this.game_name!;
				this.tablechat.detachId = this.table_id!;
				this.tablechat.create(
					this,
					"chatinput",
					"/table/table/say.html",
					__("lang_mainsite", "Discuss at this table")
				);
				this.tablechat.baseparams = {
					table: this.table_id!,
				};
				this.tablechat.callbackBeforeChat = e.hitch(
					this,
					"onBeforeChatInput"
				);
			}
			this.updatePlayerOrdering();
			var M = [
					__(
						"lang_mainsite",
						"If the game seems blocked or buggy, please <b>refresh</b> the webpage or <b>press F5</b>."
					),
					__(
						"lang_mainsite",
						"Insults and aggressive behaviours are stricly forbidden in this chatroom. Please report us any incident: we take an immediate action againt all problematic players."
					),
					__(
						"lang_mainsite",
						"You can mute sound by clicking on:"
					) +
						' <div class="icon20 icon20_mute"></div>',
					__(
						"lang_mainsite",
						"To play in fullscreen, click on:"
					) +
						' <div class="icon20 icon20_fullscreen"></div>',
					__(
						"lang_mainsite",
						"You have a wide screen ? You can choose in preferences to display players information and game logs in 2 columns:"
					) +
						' <div class="icon20 icon20_config"></div>',
					__(
						"lang_mainsite",
						"You find a bug ? Please report it in BGA bug reporting system, a description and if possible a screenshot. Thank you."
					),
					__(
						"lang_mainsite",
						"If some player is not playing, just wait until he run out reflexion time, then kick him out the game."
					),
				],
				D = M.length,
				I = Math.floor(Math.random() * D) % D;
			g_archive_mode ||
				this.notifqueue.addToLog(
					"<b>" +
						__("lang_mainsite", "Did you know ?") +
						"</b><br/>" +
						M[I]
				);
			for (var L in { logsSecondColumn: {} }) {
				e.connect(
					$("preference_global_control_" + L)!,
					"onchange",
					this,
					"onChangePreference"
				);
				e.connect(
					$("preference_global_fontrol_" + L)!,
					"onchange",
					this,
					"onChangePreference"
				);
			}
			g_archive_mode ||
				"1" !=
					$<HTMLInputElement>(
						"preference_global_control_logsSecondColumn"
					)!.value ||
				this.switchLogModeTo(1);
			e.query(".reftime_format").forEach(
				e.hitch(this, function (e) {
					e.innerHTML = this.formatReflexionTime(
						e.innerHTML
					).string;
				})
			);
			for (var L in this.prefs) {
				var P = this.prefs[L as BGA.ID]!;
				P.values[P.value]!.cssPref &&
					e.addClass(
						e.doc.documentElement,
						P.values[P.value]!.cssPref!
					);
			}
			e.query(".game_preference_control").connect(
				"onchange",
				this,
				function (e) {
					var t = Number(
							(e.currentTarget as HTMLElement).dataset['preferenceId']
						),
						i = Number((e.currentTarget as HTMLInputElement).value);
					this.handleGameUserPreferenceChangeEvent(
						t,
						i
					);
				}
			);
			"1" ==
				$<HTMLInputElement>(
					"preference_control_" +
						this.GAMEPREFERENCE_DISPLAYTOOLTIPS
				)!.value && this.switchDisplayTooltips(1);
			e.query(".preference_control").style(
				"display",
				"block"
			);
			e.connect(
				$("ingame_menu_concede")!,
				"onclick",
				e.hitch(this, function (t) {
					t.preventDefault();
					this.confirmationDialog(
						__(
							"lang_mainsite",
							"You are about to concede this game. Are you sure?"
						),
						e.hitch(this, function () {
							this.ajaxcall(
								"/table/table/concede.html?src=menu",
								{ table: this.table_id! },
								this,
								function (e, t) {}
							);
						})
					);
				})
			);
			e.connect(
				$("ingame_menu_abandon")!,
				"onclick",
				e.hitch(this, function (e) {
					e.preventDefault();
					this.ajaxcall(
						"/table/table/decide.html?src=menu",
						{
							type: "abandon",
							decision: 1,
							table: this.table_id!,
						},
						this,
						function (e, t) {}
					);
				})
			);
			this.bRealtime
				? e.connect(
						$("ingame_menu_switch_tb")!,
						"onclick",
						e.hitch(this, function (e) {
							e.preventDefault();
							this.ajaxcall(
								"/table/table/decide.html?src=menu",
								{
									type: "switch_tb",
									decision: 1,
									table: this.table_id!,
								},
								this,
								function (e, t) {}
							);
						})
				  )
				: e.style(
						"ingame_menu_switch_tb",
						"display",
						"none"
				  );
			if (e.query(".expressswitch").length > 0) {
				e.style(
					"ingame_menu_expresstop",
					"display",
					"block"
				);
				e.connect(
					$("ingame_menu_expresstop")!,
					"onclick",
					e.hitch(this, function (t) {
						t.preventDefault();
						this.ajaxcall(
							"/table/table/expressGameStopTable.html",
							{ table: this.table_id! },
							this,
							e.hitch(this, function (t, i) {
								if (
									"undefined" !=
										typeof bgaConfig &&
									bgaConfig.webrtcEnabled &&
									null !== this.room
								) {
									this.prepareMediaRatingParams();
									this.doLeaveRoom(
										e.hitch(
											this,
											function () {
												this.redirectToTablePage();
											}
										)
									);
								} else this.redirectToTablePage();
							})
						);
					})
				);
			}
			if (!this.bRealtime && !this.isSpectator) {
				e.style(
					"ingame_menu_notes_wrap",
					"display",
					"block"
				);
				e.connect(
					$("ingame_menu_notes")!,
					"onclick",
					this,
					"toggleTurnBasedNotes"
				);
			}
			e.connect(
				$("ingame_menu")!,
				"onclick",
				this,
				"toggleIngameMenu"
			);
			e.connect(
				$("ingame_menu_content")!,
				"onclick",
				this,
				"hideIngameMenu"
			);
			e.connect(
				document,
				"onclick",
				this,
				"hideIngameMenu"
			);
			e.query<HTMLElement>(".preference_control").connect(
				"onclick",
				this,
				function (t) {
					e.stopEvent(t);
				}
			);
			this.updatePubBanner();
			this.isSpectator &&
				e.addClass("overall-content", "spectatorMode");
			e.query<HTMLElement>(
				".chatbarbelowinput_item_showcursor"
			).connect("onclick", this, "onShowMyCursor");
			e.query<HTMLElement>(".player_hidecursor").connect(
				"onclick",
				this,
				"onHideCursor"
			);
			this.addTooltipToClass(
				"chatbarbelowinput_item_showcursor",
				"",
				__(
					"lang_mainsite",
					"Show your mouse cursor to opponents"
				)
			);
			e.query<HTMLElement>(".debug_save").connect(
				"onclick",
				this,
				"onSaveState"
			);
			e.query<HTMLElement>(".debug_load").connect(
				"onclick",
				this,
				"onLoadState"
			);
			e.query<HTMLElement>("#debug_load_bug_report-btn").connect(
				"onclick",
				this,
				"onLoadBugReport"
			);
			e.query<HTMLElement>(".bga-reload-css").connect(
				"onclick",
				this,
				"onReloadCss"
			);
			if (!g_archive_mode) {
				this.notifqueue.resynchronizeNotifications(true);
				e.connect(
					this,
					"reconnectAllSubscriptions",
					this,
					"onReconnect"
				);
			}
			this.ensureImageLoading();
			e.connect(
				$("overall_footer_topbutton")!,
				"onclick",
				function () {
					window.scroll(0, 0);
				}
			);
			"" != this.turnBasedNotes &&
				this.openTurnBasedNotes(this.turnBasedNotes);
			g_archive_mode ||
				this.socket!.emit(
					"requestSpectators",
					this.table_id
				);
			this.updatePremiumEmblemLinks();
			e.connect(
				$("abandon_alternate_button")!,
				"onclick",
				e.hitch(this, function (e) {
					e.preventDefault();
					this.ajaxcall(
						"/table/table/decide.html",
						{
							type: "abandon",
							decision: 1,
							table: this.table_id!,
						},
						this,
						function (e, t) {}
					);
				})
			);
			e.connect(
				$("concede_alternate_button")!,
				"onclick",
				e.hitch(this, function (t) {
					t.preventDefault();
					this.confirmationDialog(
						__("lang_mainsite", "Are you sure?"),
						e.hitch(this, function () {
							this.ajaxcall(
								"/table/table/concede.html?src=alt",
								{ table: this.table_id! },
								this,
								function (e) {}
							);
						})
					);
				})
			);
			if (g_archive_mode) {
				e.hasClass("archivecontrol", "demomode");
				if (e.hasClass("archivecontrol", "autoplay")) {
					this.archive_playmode = "play";
					this.bDisableSoundOnMove = true;
					this.sendNextArchive();
					this.instantaneousMode ||
						this.notifqueue.setSynchronous(
							"archivewaitingdelay",
							1e3
						);
				}
			}
			this.is_solo && e.addClass("ebd-body", "solo_game");
			g_archive_mode ||
				(this.bTutorial && this.showTutorial());
			if ("cantstop" == this.game_name && this.is_solo) {
				e.style("its_your_turn", "display", "none");
				e.place(
					'<a href="#" id="quitFirstTutorialTop" class="bgabutton bgabutton_gray bgabutton_always_big" style="text-decoration:none;top:-9px;position:relative;">' +
						__("lang_mainsite", "Quit tutorial") +
						"</a> ",
					"reflexiontimevalues"
				);
				e.connect(
					$("quitFirstTutorialTop")!,
					"onclick",
					this,
					e.hitch(this, function (t) {
						e.stopEvent(t);
						e.style(
							"quitFirstTutorialTop",
							"display",
							"none"
						);
						this.ajaxcall(
							"/table/table/concede.html?src=top",
							{ table: this.table_id! },
							this,
							function (t) {
								window.location.href =
									this.metasiteurl +
									"/" +
									this.mslobby;
								e.style(
									"quitFirstTutorialTop",
									"display",
									"block"
								);
							}
						);
					})
				);
			}
			e.query<HTMLElement>(".judgegivevictory").connect(
				"onclick",
				this,
				"onJudgeDecision"
			);
			var R = 1;
			for (let C in this.emergencymsg) {
				var O = this.emergencymsg[C as any]!;
				if ("emergency" == O.type) {
					var B: BGA.NotifsPacket = {
						channel: "/general/emergency",
						packet_type: "single",
						data: [],
					} as any;
					B.data.push({
						args: O,
						bIsTableMsg: false,
						lock_uuid: "dummy",
						log: "${player_name} ${text}",
						type: "chat",
						time: O.time,
						loadprevious: true,
						uid: R++
					} as any);
					this.notifqueue.onNotification(B);
				}
			}
			this.onGameUiWidthChange();
			e.connect(
				window,
				"scroll",
				this,
				e.hitch(this, "adaptStatusBar")
			);
			e.connect(
				window,
				"orientationchange",
				this,
				e.hitch(this, "onGameUiWidthChange")
			);
			e.connect(
				window,
				"onresize",
				this,
				e.hitch(this, "onGameUiWidthChange")
			);
			if ($("go_to_next_table_active_player")) {
				e.connect(
					$("go_to_next_table_active_player")!,
					"onclick",
					e.hitch(this, function (t) {
						e.stopEvent(t);
						this.confirmationDialog(
							__(
								"lang_mainsite",
								"This is your turn. Do you really want to go to your next table?"
							),
							function () {
								document.location.href = $<HTMLAnchorElement>(
									"go_to_next_table_active_player"
								)!.href;
							}
						);
					})
				);
				this.addTooltip(
					"go_to_next_table_active_player",
					"",
					__(
						"lang_mainsite",
						"Go to next table (play later on this one)"
					)
				);
			}
			var H: BGA.PageHeaderButton[] = [
				{
					btn: "pageheader_gameresult",
					section: "pagesection_gameresult",
					onShow: e.hitch(this, "onShowGameResults"),
				},
				{
					btn: "pageheader_gameview",
					section: "pagesection_gameview",
					defaults: true,
				},
			];
			this.pageheader = new ebg.pageheader();
			this.pageheader.create(
				this,
				"maingameview_menuheader",
				H as any,
				false
			);
			var F =
				($("maingameview_menufooter") &&
					$("maingameview_menufooter")!.getAttribute(
						"data-default-tab"
					)) ||
				"competition";
			H = [
				{
					btn: "pageheader_howtoplay",
					section: "pagesection_howtoplay",
					onShow: e.hitch(this, "onShowGameHelp"),
					defaults: "howtoplay" == F,
				},
				{
					btn: "pageheader_competition",
					section: "pagesection_competition",
					onShow: e.hitch(this, "onShowCompetition"),
					defaults: "competition" == F,
				},
				{
					btn: "pageheader_tournament",
					section: "pagesection_tournament",
					onShow: e.hitch(this, "onShowTournament"),
					defaults: "tournament" == F,
				},
				{
					btn: "pageheader_strategytips",
					section: "pagesection_strategytips",
					onShow: e.hitch(this, "onShowStrategyHelp"),
					defaults: "strategytips" == F,
				},
				{
					btn: "pageheader_options",
					section: "pagesection_options",
					defaults: "options" == F,
				},
				{
					btn: "pageheader_credits",
					section: "pagesection_credits",
					defaults: "credits" == F,
				},
				{
					btn: "pageheader_music",
					section: "pagesection_music",
					onShow: e.hitch(this, "playMusic"),
					defaults: "music" == F,
				},
			];
			this.pageheaderfooter = new ebg.pageheader();
			this.pageheaderfooter.create(
				this,
				"maingameview_menufooter",
				H as any,
				false
			);
			for (let C in H)
				H[C]!.defaults && H[C]!.onShow && H[C]!.onShow();
			e.query<HTMLElement>(".seemore").connect(
				"onclick",
				this,
				"onSeeMoreLink"
			);
			this.addTooltipToClass(
				"thumbuplink",
				"",
				__("lang_mainsite", "Thumb up this item")
			);
			e.query<HTMLElement>(".thumbuplink").connect(
				"onclick",
				this,
				"onThumbUpLink"
			);
			e.connect(
				$("seemore_rankings")!,
				"onclick",
				this,
				"onSeeMoreRanking"
			);
			e.query<HTMLElement>(".sectiontitle_dropdown_command").connect(
				"onclick",
				this,
				function (t) {
					e.stopEvent(t);
					var i = ((t.currentTarget as Element).parentNode as Element).id;
					e.query(
						"#" + i + " .sectiontitle_dropdown_menu"
					).toggleClass(
						"sectiontitle_dropdown_menu_visible"
					);
				}
			);
			this.closeRankMenu = e.connect(
				$("overall-content")!,
				"onclick",
				this,
				function (t) {
					e.query(
						".sectiontitle_dropdown_menu_visible"
					).removeClass(
						"sectiontitle_dropdown_menu_visible"
					);
				}
			);
			e.query<HTMLElement>(".rank_season").connect(
				"onclick",
				this,
				"onChangeRankMode"
			);
			e.query<HTMLElement>(".trophytooltip").forEach(
				e.hitch(this, function (e) {
					var t = e.id.substr(14),
						i = $("trophytooltip_" + t)!.innerHTML;
					this.addTooltipHtml(
						"awardimg_" + t,
						'<div class="trophytooltip_displayed">' +
							i +
							"</div>"
					);
				})
			);
			this.playerawardsCollapsedAlignement();
			if (
				g_archive_mode &&
				"view" != g_tutorialwritten!.mode
			) {
				var z = this.getReplayLogNode();
				if (
					$("pageheader_strategytips") &&
					null !== z
				) {
					$("pageheader_strategytips")!.innerHTML =
						__("lang_mainsite", "Replay log") +
						'<div class="pageheader_menuitembar">';
					this.pageheaderfooter.showSectionFromButton(
						"pageheader_strategytips"
					);
					this.loadReplayLogs();
				}
			}
			e.hasClass("ebd-body", "new_gameux") &&
				this.pageheaderfooter.hideAllSections();
		}
		"gameSetup" == this.gamedatas.gamestate.name &&
			g_archive_mode &&
			this.sendNextArchive();
		if (
			g_archive_mode &&
			"" != $<HTMLInputElement>("archive_go_to_move_nbr")!.value
		) {
			this.archive_gotomove = toint(
				$<HTMLInputElement>("archive_go_to_move_nbr")!.value
			);
			this.archive_playmode = "goto";
			this.setModeInstataneous();
			this.sendNextArchive();
		}
		if (
			g_archive_mode &&
			"view" == g_tutorialwritten!.mode
		) {
			this.pageheaderfooter!.hideAllSections();
			$("table_ref_item_table_id") &&
				($("table_ref_item_table_id")!.innerHTML =
					e.string.substitute(
						__("lang_mainsite", "Tutorial #${id}"),
						{ id: g_tutorialwritten!.id }
					));
			if ($("newArchiveComment")) {}
			else {
				this.archive_playmode = "nextcomment";
				this.sendNextArchive();
			}
		}
		u || this.init3d();
		"gameEnd" == gamedatas.gamestate.name &&
			this.updateResultPage();
		u || this.initHotseat();
		this.sendResizeEvent();
	}

	onReconnect() {
		this.notifqueue.resynchronizeNotifications(false);
	}

	onGsSocketIoConnectionStatusChanged(statusType: 'connect' | 'connect_error' | 'connect_timeout' | 'reconnect' | 'reconnect_attempt' | 'reconnect_error' | 'reconnect_failed', errorMessage?: any) {
		if (this.page_is_unloading)
			e.style("connect_gs_status", "display", "none");
		else if ("connect" == statusType)
			e.style("connect_gs_status", "display", "none");
		else if ("connect_error" == statusType) {
			e.style("connect_gs_status", "display", "block");
			$("connect_gs_status_text")!.innerHTML = __(
				"lang_mainsite",
				"Disconnected from your game!"
			);
			console.error(
				"Disconnected from game server : " + errorMessage
			);
			g_sitecore.notifqueue.addToLog(
				$("connect_gs_status_text")!.innerHTML
			);
		} else if ("connect_timeout" == statusType) {
			e.style("connect_gs_status", "display", "block");
			$("connect_gs_status_text")!.innerHTML = __(
				"lang_mainsite",
				"Disconnected from your game!"
			);
			$("connect_gs_status_text")!.innerHTML +=
				" (timeout)";
			g_sitecore.notifqueue.addToLog(
				$("connect_gs_status_text")!.innerHTML
			);
		} else if ("reconnect" == statusType) {
			e.style("connect_gs_status", "display", "none");
			g_sitecore.notifqueue.addToLog(
				__("lang_mainsite", "You are connected again.")
			);
			this.gs_socket!.emit("join", this.channel);
			this.gs_socket!.emit(
				"join",
				this.tablechannelSpectators
			);
			this.gs_socket!.emit(
				"join",
				"/player/p" + this.player_id
			);
		} else if ("reconnect_error" == statusType) {
			e.style("connect_gs_status", "display", "block");
			$("connect_gs_status_text")!.innerHTML = __(
				"lang_mainsite",
				"Disconnected from your game!"
			);
			console.error(
				"Disconnected from game server : " + errorMessage
			);
			g_sitecore.notifqueue.addToLog(
				$("connect_gs_status_text")!.innerHTML
			);
		} else if ("reconnect_failed" == statusType) {
			e.style("connect_gs_status", "display", "block");
			$("connect_gs_status_text")!.innerHTML = __(
				"lang_mainsite",
				"Disconnected from your game!"
			);
			$("connect_gs_status_text")!.innerHTML +=
				" (reconnect failed)";
			g_sitecore.notifqueue.addToLog(
				$("connect_gs_status_text")!.innerHTML
			);
		}
	}

	updatePremiumEmblemLinks() {
		this.addTooltipToClass(
			"emblempremium",
			__(
				"lang_mainsite",
				"Premium member: this player helps us to develop this service :)"
			),
			__(
				"lang_mainsite",
				"Support Board Game Arena: go Premium!"
			)
		);
		e.query<HTMLElement>(".emblempremium").connect(
			"onclick",
			this,
			function () {
				window.open(
					this.metasiteurl +
						"/premium?src=emblempremium",
					"_blank"
				);
			}
		);
		e.query<HTMLElement>(".masqued_rank").connect(
			"onclick",
			this,
			function () {
				window.open(
					this.metasiteurl +
						"/premium?src=emblempremium",
					"_blank"
				);
			}
		);
	}

	onGameUiWidthChange() {
		if (!this.chatDetached) {
			if (undefined === this.default_viewport) {
				undefined !==
					(i = e.query<HTMLMetaElement>('meta[name="viewport"]'))[0] &&
					(this.default_viewport = i[0].content);
			}
			var t = false;
			if (undefined !== window.orientation) {
				var i;
				if (
					undefined !==
					(i = e.query<HTMLMetaElement>('meta[name="viewport"]'))[0]
				)
					if (0 !== window.orientation)
						i[0].content = "width=980";
					else {
						this.isTouchDevice && (t = true);
						null !== this.default_viewport &&
							(i[0].content =
								this.default_viewport!);
					}
			}
			var n = e.position("ebd-body"),
				o = 240;
			"2cols" == this.log_mode && (o = 490);
			var a = this.interface_min_width! + o;
			if (
				"2cols" == this.log_mode &&
				(n.w! < a || this.currentZoom < 1)
			)
				this.switchLogModeTo(0);
			else {
				if (e.hasClass("ebd-body", "mobile_version")) {
					if (
						n.w! >= a &&
						1 == this.currentZoom &&
						!t
					) {
						e.removeClass(
							"ebd-body",
							"mobile_version"
						);
						e.addClass(
							"ebd-body",
							"desktop_version"
						);
						this.adaptChatbarDock();
					}
				} else if (
					n.w! < a ||
					this.currentZoom < 1 ||
					t
				) {
					e.removeClass(
						"ebd-body",
						"desktop_version"
					);
					e.addClass("ebd-body", "mobile_version");
					this.adaptChatbarDock();
				}
				var s = 1,
					r = 1;
				n.w! < this.interface_min_width! &&
					(r = s = n.w! / this.interface_min_width!);
				if (
					s < 0.9 &&
					e.hasClass(
						"globalaction_zoom_icon",
						"fa-search-minus"
					)
				) {
					s = 1;
					e.style(
						"pagesection_gameview",
						"overflow",
						"auto"
					);
					e.style(
						"game_play_area",
						"minWidth",
						this.interface_min_width + "px"
					);
				} else {
					undefined !==
						this.bForceMobileHorizontalScroll &&
					e.hasClass("ebd-body", "mobile_version") &&
					this.bForceMobileHorizontalScroll
						? e.style(
								"pagesection_gameview",
								"overflow",
								"auto"
						  )
						: e.style(
								"pagesection_gameview",
								"overflow",
								"visible"
						  );
					e.style("game_play_area", "minWidth", String(0));
				}
				if (s != this.gameinterface_zoomFactor) {
					this.gameinterface_zoomFactor = s;
					e.style("page-content", "zoom", String(s));
					e.style("right-side-first-part", "zoom", String(s));
					e.style("page-title", "zoom", String(s));
				}
				if (r < 0.9) {
					e.style(
						"globalaction_zoom_wrap",
						"display",
						"inline-block"
					);
					e.style("toggleSound", "display", "none");
				} else {
					e.style(
						"globalaction_zoom_wrap",
						"display",
						"none"
					);
					e.style(
						"toggleSound",
						"display",
						"inline-block"
					);
				}
				this.adaptPlayersPanels();
				this.adaptStatusBar();
				this.onScreenWidthChange();
			}
		}
	}

	onZoomToggle(t: Event) {
		e.stopEvent(t);
		var i = Number(this.gameinterface_zoomFactor),
			n = Number(e.style("left-side", "marginTop"));
		if (
			e.hasClass(
				"globalaction_zoom_icon",
				"fa-search-plus"
			)
		) {
			e.removeClass(
				"globalaction_zoom_icon",
				"fa-search-plus"
			);
			e.addClass(
				"globalaction_zoom_icon",
				"fa-search-minus"
			);
		} else {
			e.removeClass(
				"globalaction_zoom_icon",
				"fa-search-minus"
			);
			e.addClass(
				"globalaction_zoom_icon",
				"fa-search-plus"
			);
			this.savePlayAreaXScroll = $(
				"pagesection_gameview"
			)!.scrollLeft;
		}
		this.onGameUiWidthChange();
		var o = Number(this.gameinterface_zoomFactor),
			a = Number(e.style("left-side", "marginTop")),
			s = e.window.getBox().h!,
			r =
				window.scrollY ||
				window.pageYOffset ||
				document.documentElement.scrollTop;
		if (o < i) {
			var l = r + (a - n);
			l *= o / i;
			l -= (s * (1 - o)) / 2;
		} else {
			l = r * (o / i) + (a - n);
			l += (s * (1 - i)) / 2;
			$("pagesection_gameview")!.scrollLeft =
				this.savePlayAreaXScroll!;
		}
		window.scroll(0, l);
	}

	adaptStatusBar() {
		var t = e.position("after-page-title"),
			i = e.position("page-title"),
			n = Number(e.style("page-title", "zoom"));
		undefined === n && (n = 1);
		var o = i.h! * n,
			a = e.window.getBox().h / 10;
		if (
			!e.hasClass("page-title", "fixed-page-title") &&
			t.y < 0 &&
			o < a
		)
			e.addClass("page-title", "fixed-page-title");
		else if (
			e.hasClass("page-title", "fixed-page-title") &&
			(t.y >= 0 || o >= a)
		) {
			e.removeClass("page-title", "fixed-page-title");
			e.style("page-title", "width", "auto");
			e.style("after-page-title", "height", "0px");
		}
		if (e.hasClass("page-title", "fixed-page-title")) {
			e.style(
				"page-title",
				"width",
				(t.w! - 10) / n + "px"
			);
			e.style("after-page-title", "height", i.h + "px");
		}
		if ($("archive_history_backtotop")) {
			var s = e.position("maingameview_menufooter");
			0 != s.y &&
				(s.y < 200
					? e.style(
							"archive_history_backtotop",
							"display",
							"block"
					  )
					: e.style(
							"archive_history_backtotop",
							"display",
							"none"
					  ));
		}
	}

	adaptPlayersPanels() {
		if (e.hasClass("ebd-body", "mobile_version")) {
			var t = e.position("right-side-first-part").w!,
				n = Math.floor(t / 243),
				o = e.query<HTMLElement>("#player_boards .player-board"),
				a = o.length,
				s = Math.ceil(a / n),
				r = Math.ceil(a / s),
				l = Math.floor(t / r) - 3 - 6,
				d = 0,
				c = 0,
				h = i.NodeList();
			o.style("height", "auto");
			for (var u in o)
				if (undefined !== o[u]!.id) {
					c = Math.max(Number(e.style(o[u]!, "height")), c);
					// @ts-ignore TODO: this does not exist and is not used
					h.push(o[u]);
					if (++d % r == 0 || d >= a) {
						h.style("height", c + "px");
						(c = 0), (h = i.NodeList());
					}
				}
			o.style("width", l + "px");
			var p = e.position("right-side").h;
			e.style("left-side", "marginTop", p + "px");
		} else {
			e.query("#player_boards .player-board").style(
				"width",
				"234px"
			);
			e.query("#player_boards .player-board").style(
				"height",
				"auto"
			);
			e.style("left-side", "marginTop", "0px");
		}
	}

	activeShowOpponentCursor() {
		if (null == this.showOpponentCursorMouveOver) {
			this.showOpponentCursorLastEvent = null;
			this.showOpponentCursorLastInfosSendMark = null;
			this.showOpponentCursorMouveOver = e.connect(
				$("ebd-body")!,
				"onmousemove",
				this,
				"onShowOpponentCursorMouseOver"
			);
			this.showOpponentCursorSendInfos();
			e.query(
				".chatbarbelowinput_item_showcursor"
			).addClass("audiovideo_active");
			this.showMessage(
				__(
					"lang_mainsite",
					"Your mouse cursor is now visible by other players."
				),
				"info"
			);
			this.showOpponentCursorClickHook = e.connect(
				document,
				"onmousedown",
				this,
				"showOpponentCursorClick"
			);
		}
	}

	showOpponentCursorClick(t: MouseEvent) {
		if ("mousedown" == t.type) {
			null === this.showOpponentCursorClickCooldown &&
				(this.showOpponentCursorClickCooldown =
					Date.now());
			this.showOpponentCursorClickNumberSinceCooldown++;
			if (
				Math.round(
					(Date.now() -
						this.showOpponentCursorClickCooldown) /
						1e3
				) < 5 &&
				this
					.showOpponentCursorClickNumberSinceCooldown >=
					10
			) {
				this.showMessage(
					__(
						"lang_mainsite",
						"We know this feature is fun, but please slow down! Don't bomb the screen with your clicks please ;)"
					),
					"info"
				);
				return;
			}
			this.showOpponentCursorClickCounter++;
			if (this.showOpponentCursorClickCounter % 10 == 1) {
				this.showOpponentCursorClickCooldown =
					Date.now();
				this.showOpponentCursorClickNumberSinceCooldown = 0;
			}
			this.onShowOpponentCursorMouseOver(t);
			var i = this.getCursorInfos(true);
			this.ajaxcall(
				`/${this.game_name}/${this.game_name}/showCursorClick.html`,
				{ path: e.toJson(i) },
				this,
				function (e) {}
			);
		}
	}

	unactiveShowOpponentCursor() {
		if (null !== this.showOpponentCursorMouveOver) {
			e.disconnect(this.showOpponentCursorMouveOver);
			e.disconnect(this.showOpponentCursorClickHook);
			clearTimeout(this.showOpponentCursorTimeout!);
			this.showOpponentCursorMouveOver = null;
			this.showOpponentCursorClickHook = null;
			this.showOpponentCursorTimeout = null;
			e.query(
				".chatbarbelowinput_item_showcursor"
			).removeClass("audiovideo_active");
			this.gs_socket!.emit("oppCursor", {
				table_id: this.table_id!,
				path: null,
			});
		}
	}

	onShowMyCursor(t: MouseEvent) {
		e.stopEvent(t);
		this.isSpectator
			? this.showMessage(
					__(
						"lang_mainsite",
						"You cannot do this as a spectator."
					),
					"error"
			  )
			: null == this.showOpponentCursorMouveOver
			? this.activeShowOpponentCursor()
			: this.unactiveShowOpponentCursor();
	}

	onHideCursor(t: MouseEvent) {
		var i = (t.currentTarget as Element).id.substr(18);
		e.style("player_showcursor_" + i, "display", "none");
		$("opponent_cursor_" + i) &&
			e.destroy("opponent_cursor_" + i);
	}

	getCursorInfos(e: boolean) {
		for (
			var t = this.showOpponentCursorLastEvent!,
				i = t.target as Element;
			!i.id;
		)
			i = i.parentNode as Element;
		var n = [],
			o = t.offsetX || t.layerX,
			a = t.offsetY || t.layerY,
			s = false;
		if (null === this.showOpponentCursorLastInfosSendMark)
			this.showOpponentCursorLastInfosSendMark =
				i.id + " " + o + "," + a;
		else if (
			this.showOpponentCursorLastInfosSendMark ==
			i.id + " " + o + "," + a
		)
			s = true;
		else
			this.showOpponentCursorLastInfosSendMark =
				i.id + " " + o + "," + a;
		if (!s || e) {
			if (undefined === t.path) {
				var r: Node[];
				var l: Node;
				for (r = [], l = i; l; ) {
					r.push(l);
					l = l.parentElement as Node;
				}
				-1 === r.indexOf(window as any) &&
					-1 === r.indexOf(document) &&
					r.push(document);
				-1 === r.indexOf(window as any) && r.push(window as any);
				t.path = r;
			}
			for (var d in t.path) {
				("<br/>");
				var c = t.path[d] as Element;
				c.id + " : " + o + "," + a;
				c.id && n.push({ id: c.id, x: o, y: a });
				var h = c.getBoundingClientRect(),
					u = (c.parentNode as Element).getBoundingClientRect(),
					p = {
						top: h.top - u.top,
						left: h.left - u.left,
					};
				o += p.left;
				a += p.top;
				if ("game_play_area" == c.id) break;
				if ("ebd-body" == c.id) break;
			}
			return n;
		}
		return null;
	}

	showOpponentCursorSendInfos() {
		if (null !== this.showOpponentCursorLastEvent) {
			var t = this.getCursorInfos(false);
			null === t ||
				this.gs_socket!.emit("oppCursor", {
					table_id: this.table_id,
					path: t,
				});
		}
		this.showOpponentCursorTimeout = setTimeout(
			e.hitch(this, "showOpponentCursorSendInfos"),
			500
		);
	}

	onShowOpponentCursorMouseOver(e: MouseEvent) {
		this.showOpponentCursorLastEvent = e;
	}

	getGameStandardUrl() {
		return (
			"/" +
			this.gameserver +
			"/" +
			this.game_name +
			"?table=" +
			this.table_id
		);
	}

	showIngameMenu() {
		e.style("ingame_menu_content", "display", "block");
		e.addClass("ingame_menu", "menu_open");
	}

	hideIngameMenu() {
		e.style("ingame_menu_content", "display", "none");
		e.removeClass("ingame_menu", "menu_open");
	}

	toggleIngameMenu(t: MouseEvent) {
		e.stopEvent(t);
		"none" == e.style("ingame_menu_content", "display")
			? this.showIngameMenu()
			: this.hideIngameMenu();
	}

	getPlayerTooltip(player_metadata: BGA.PlayerMetadata) {
		for (var t = "", i = 1; i >= 0; i--)
			var n: BGA.LanguageCode;
			for (n in player_metadata.languages)
				if (player_metadata.languages[n]!.level == i) {
					var o = n;
					1 === toint(player_metadata.languages[n]!.level) &&
						(o = "<b>" + n + "</b>");
					t +=
						'<span id="lang_' +
						player_metadata.user_id +
						"_" +
						n +
						'">' +
						o +
						"</span> ";
				}
		var a = "free";
		String(1) == player_metadata.is_beginner
			? (a = "beginner")
			: String(1) == player_metadata.is_premium && (a = "premium");
		var s = $<HTMLImageElement>("avatar_" + player_metadata.user_id)!.src;
		s = s.match(/\/default-\d+_32.jpg$/)
			? s.replace("_32.jpg", ".jpg")
			: s.replace("_32.jpg", "_184.jpg");
		undefined === player_metadata.karma && (player_metadata.karma = 100);
		var r = this.getKarmaLabel(player_metadata.karma)!,
			l = {
				player_id: player_metadata.user_id,
				genderclass:
					null === player_metadata.gender
						? "gender_not_specified"
						: String(1) == player_metadata.gender
						? "fa-mars male"
						: "fa-venus female",
				flag: player_metadata.country_infos.code,
				country: player_metadata.country_infos.name,
				city:
					null === player_metadata.city || "" == player_metadata.city
						? ""
						: "(" + player_metadata.city + ")",
				languages: t,
				accounttype: a,
				avatarurl: s,
				karma: player_metadata.karma,
				karma_label: r.label,
				karma_class: r.css,
				progressbardisplay: "block",
			};
		return this.format_string(this.jstpl_player_tooltip, l);
	}

	onStartGame() {
		this.ajaxcall(
			`/${this.game_name!}/${this.game_name!}/startgame.html`,
			{},
			this,
			function (e) {}
		);
	}

	onNotificationPacketDispatched() {
		if (
			!this.current_player_was_active &&
			this.current_player_is_active
		)
			if (
				this.instantaneousMode ||
				"undefined" != typeof g_replayFrom
			) {}
			else {
				stopSound("move");
				playSound("yourturn");
			}
		this.current_player_was_active =
			this.current_player_is_active;
	}

	updateActivePlayerAnimation() {
		var t,
			i: Record<BGA.ID, 1> = {},
			n = false,
			o = false;
		var a: BGA.ID;
		for (a in this.gamedatas!.players) {
			if (
				"none" == e.style("avatarwrap_" + a, "display")
			) {
				e.style("avatarwrap_" + a, "display", "block");
				e.style(
					"avatar_active_wrap_" + a,
					"display",
					"none"
				);
				i[a] = 1;
				a == this.player_id && (n = true);
			}
			if ($("player_table_status_" + a)) {
				var s = "";
				if (
					this.gamedatas!.players[a]!.beginner &&
					this.player_id != a
				)
					if (
						e.hasClass("ebd-body", "no_time_limit")
					) {
						s +=
							'<p class="boardblock doubletime_infos">';
						s +=
							__(
								"lang_mainsite",
								"This is my first game."
							) + "<br/>";
						s += __(
							"lang_mainsite",
							"Thanks for helping me!"
						);
						s += "</p>";
					} else {
						s +=
							'<p class="boardblock doubletime_infos">';
						s +=
							__(
								"lang_mainsite",
								"This is my first game : my time is doubled"
							) + "<br/>";
						s += __(
							"lang_mainsite",
							"Thanks for helping me!"
						);
						s += "</p>";
					}
				if (1 == this.gamedatas!.players[a]!.is_ai) {
					s += '<p class="boardblock">';
					s += __(
						"lang_mainsite",
						"This player is an artificial intelligence"
					);
					s += "</p>";
				}
				if (1 == this.gamedatas!.players[a]!.zombie) {
					s += '<p class="boardblock">';
					s += __(
						"lang_mainsite",
						"The turns of this player are skipped (this player left the game or was out of time)"
					);
					s += "</p>";
				}
				if (1 == this.gamedatas!.players[a]!.eliminated) {
					s += '<p class="boardblock">';
					s += __(
						"lang_mainsite",
						"This player has been eliminated from the game"
					);
					s += "</p>";
				}
				if (
					undefined !== this.hotseatplayers![a] &&
					this.player_id != a
				) {
					s += '<p class="boardblock">';
					s += __(
						"lang_mainsite",
						"This player is playing from the same seat than another (`hotseat`)"
					);
					s += "</p>";
				}
				if ("" != s) {
					$("player_table_status_" + a)!.innerHTML = s;
					e.style(
						"player_table_status_" + a,
						"display",
						"block"
					);
				} else
					e.style(
						"player_table_status_" + a,
						"display",
						"none"
					);
			}
		}
		if (!g_archive_mode) {
			e.query(".rtc_video_pulsating").removeClass(
				"rtc_video_pulsating"
			);
			if ("activeplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type']) {
				this.gamedatas!.gamestate.active_player;
				t = this.gamedatas!.gamestate.active_player;
				if (this.gamedatas!.players[t]) {
					if (
						"unavail" !=
						this.gamedatas!.players[t]!.ack
					) {
						this.shouldDisplayClockAlert(t)
							? ($<HTMLImageElement>("avatar_active_" + t)!.src =
									getStaticAssetUrl(
										"img/layout/active_player_clockalert.gif"
									))
							: ($<HTMLImageElement>("avatar_active_" + t)!.src =
									getStaticAssetUrl(
										"img/layout/active_player.gif"
									));
						$("videofeed_" + t + "_pulse") &&
							e.addClass(
								"videofeed_" + t + "_pulse",
								"rtc_video_pulsating"
							);
					} else
						$<HTMLImageElement>("avatar_active_" + t)!.src =
							getStaticAssetUrl(
								"img/layout/active_player_nonack.gif"
							);
					e.style(
						"avatarwrap_" + t,
						"display",
						"none"
					);
					e.style(
						"avatar_active_wrap_" + t,
						"display",
						"block"
					);
					t == this.player_id && (o = true);
				} else
					this.showMessage(
						"Error: there is no more active player!",
						"error"
					);
			} else if ("multipleactiveplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type'])
				for (var r in this.gamedatas!.gamestate.multiactive) {
					t = this.gamedatas!.gamestate.multiactive[r]!;
					this.gamedatas!.players[t];
					if (
						"unavail" !=
						this.gamedatas!.players[t]!.ack
					) {
						this.shouldDisplayClockAlert(t)
							? ($<HTMLImageElement>("avatar_active_" + t)!.src =
									getStaticAssetUrl(
										"img/layout/active_player_clockalert.gif"
									))
							: ($<HTMLImageElement>("avatar_active_" + t)!.src =
									getStaticAssetUrl(
										"img/layout/active_player.gif"
									));
						$("videofeed_" + t + "_pulse") &&
							e.addClass(
								"videofeed_" + t + "_pulse",
								"rtc_video_pulsating"
							);
					} else
						$<HTMLImageElement>("avatar_active_" + t)!.src =
							getStaticAssetUrl(
								"img/layout/active_player_nonack.gif"
							);
					e.style(
						"avatarwrap_" + t,
						"display",
						"none"
					);
					e.style(
						"avatar_active_wrap_" + t,
						"display",
						"block"
					);
					t == this.player_id && (o = true);
				}
			n && !o && this.updatePubBanner();
		}
		if (o) {
			this.shouldDisplayClockAlert(this.player_id!)
				? ($<HTMLImageElement>("active_player_statusbar_icon")!.src =
						getStaticAssetUrl(
							"img/layout/active_player_clockalert.gif"
						))
				: ($<HTMLImageElement>("active_player_statusbar_icon")!.src =
						getStaticAssetUrl(
							"img/layout/active_player.gif"
						));
			e.style(
				"active_player_statusbar",
				"display",
				"inline-block"
			);
			e.addClass("ebd-body", "current_player_is_active");
		} else {
			e.style(
				"active_player_statusbar",
				"display",
				"none"
			);
			e.removeClass(
				"ebd-body",
				"current_player_is_active"
			);
		}
		if ("cantstop" == this.game_name && this.is_solo) {}
		else if (o)
			if (n) {}
			else if (this.bRealtime) {
				e.addClass(
					"reflexiontimevalues",
					"yourturn_animation"
				);
				setTimeout(
					e.hitch(this, function () {
						e.removeClass(
							"reflexiontimevalues",
							"yourturn_animation"
						);
					}),
					800
				);
			}
		this.addTooltipToClass(
			"tt_timemove_time_bar",
			__(
				"lang_mainsite",
				"Remaining time to think for this move. When the bar is all red, you can expel inactive active players."
			),
			""
		);
		this.addTooltip(
			"reflexiontime_value",
			__(
				"lang_mainsite",
				"Remaining time to think for this game"
			),
			""
		);
		this.addTooltip(
			"current_player_reflexion_time",
			__(
				"lang_mainsite",
				"Remaining time to think for this game"
			),
			""
		);
		this.addTooltipToClass(
			"timeToThink",
			__(
				"lang_mainsite",
				"Remaining time to think for this game"
			),
			""
		);
		this.updateReflexionTimeDisplay();
		this.updateFirePlayerLink();
		this.current_player_is_active = o;
		this.checkHotseatFocus();
		return o;
	}

	isPlayerActive(playerId: BGA.ID | null | undefined): boolean {
		if ("activeplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type']) {
			if (this.gamedatas!.gamestate.active_player == playerId)
				return true;
		} else if ( "multipleactiveplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type'])
			for (var t in this.gamedatas!.gamestate.multiactive)
				if (this.gamedatas!.gamestate.multiactive[t] == playerId)
					return true;
		return false;
	}

	updateVisitors(t: Record<BGA.ID, string>) {
		var i = "",
			n = true;
		this.last_visitorlist = t;
		var o: BGA.ID;
		for (o in t) {
			var a = t[o]!;
			if (
				this.gamedatas!.players[o] &&
				"gameEnd" != this.gamedatas!.gamestate.name
			) {}
			else {
				n ? (n = false) : (i += " ");
				if (this.gamedatas!.players[o])
					var s =
						'<span style="white-space: nowrap"><span id="visitor_player_' +
						o +
						'" class="visitor_player">' +
						a +
						"</span></span>";
				else
					s =
						'<span style="white-space: nowrap"><span id="visitor_player_' +
						o +
						'" class="visitor_player">' +
						a +
						'</span> <a href="#" style="display:none" id="ban_spectator_' +
						o +
						'" class="ban_spectator"><i class="fa fa-times" aria-hidden="true"></i></a></span>';
				i += s;
			}
		}
		if (n) e.style($("spectatorbox")!, "display", "none");
		else {
			e.place(
				"<span>" +
					__("lang_mainsite", "Spectators:") +
					" " +
					i +
					"</span>",
				"spectatorlist",
				"only"
			);
			e.style($("spectatorbox")!, "display", "block");
			e.query<HTMLElement>(".ban_spectator").connect(
				"onclick",
				this,
				"onBanSpectator"
			);
		}
	}

	onBanSpectator(t: MouseEvent) {
		e.stopEvent(t);
		var i = (t.currentTarget as Element).id.substr(14) as BGA.ID;
		if (i != this.player_id) {
			this.showMessage(
				__(
					"lang_mainsite",
					"You can give this player a red thumb, so he won't be able to chat again at your table."
				),
				"info"
			);
			var n = new ebg.thumb();
			n.create(this, "ban_spectator_" + i, i, 0);
			e.style("ban_spectator_" + i, "display", "none");
			n.bForceThumbDown = true;
			n.onGiveThumbDown(t);
		}
	}

	switchToGameResults() {
		countVisibleDialog = 0;
		e.query<Element>(".dijitDialog").forEach(function (t) {
			"none" != e.style(t, "display") &&
				countVisibleDialog!++;
		});
		e.query<Element>(".standard_popin").forEach(function (t) {
			"none" != e.style(t, "display") &&
				countVisibleDialog!++;
		});
		var t = Math.floor(Date.now() / 1e3),
			i = t - 1e3,
			n = false;
		if (undefined !== this.end_of_game_timestamp) {
			n = true;
			i = this.end_of_game_timestamp + 3;
		}
		if (0 == countVisibleDialog && n && t >= i) {
			this.pageheader!.showSectionFromButton(
				"pageheader_gameresult"
			);
			e.hasClass("ebd-body", "arena_mode") ||
				this.eloEndOfGameAnimation();
			var o = this.tableresults_datas!,
				a = false,
				s: Record<BGA.ID, BGA.TableResultTrophies> = {};
			(e.hasClass("ebd-body", "arena_mode") ||
				(undefined !== o.result.trophies &&
					undefined !==
						o.result.trophies[this.player_id!] &&
					undefined !==
						o.result.trophies[this.player_id!])) &&
				(a = true);
			if (a) {
				undefined !== o.result.trophies &&
					undefined !==
						o.result.trophies[this.player_id!] &&
					undefined !==
						o.result.trophies[this.player_id!] &&
					(s = o.result.trophies[this.player_id!]!);
				setTimeout(
					e.hitch(this, function () {
						this.loadTrophyToSplash(s);
					}),
					2e3
				);
			}
			this.gameeval && this.showGameRatingDialog();
		} else
			setTimeout(
				e.hitch(this, function () {
					this.switchToGameResults();
				}),
				1e3
			);
	}

	eloEndOfGameAnimation() {
		if (this.tableresults) {
			this.eloEndOfGameAnimationDatas = {};
			var t = false;
			if (
				!this.tableresults.tableinfos!.game_hide_ranking
			) {
				e.query<HTMLElement>(
					"#pagesection_gameresult .newrank .gamerank_value"
				).forEach(
					e.hitch(this, function (e: HTMLElement) {
						var i = e.innerHTML;
						if ("" != i) {
							var n = (e.parentNode!.parentNode as Element).id.substr(8) as BGA.ID;
							if ($("player_elo_" + n)) {
								var o = $(
									"player_elo_" + n
								)!.innerHTML;
								this.eloEndOfGameAnimationDatas![n] = {
									player_id: n,
									from: toint(o),
									to: toint(i),
									current: toint(o),
								};
								t = true;
							}
						}
					})
				);
				if (t) {
					this.eloEndOfGameAnimationFrameCurrentDuration = 0;
					this.eloEndOfGameAnimationWorker();
					playSound("elochange");
				}
			}
		} else
			setTimeout(() => this.eloEndOfGameAnimation(), 100);
	}

	eloEndOfGameAnimationWorker() {
		var t: BGA.ID;
		for (t in this.eloEndOfGameAnimationDatas) {
			var i = this.eloEndOfGameAnimationDatas![t]!,
				n = Math.round(
					i.from +
						(this
							.eloEndOfGameAnimationFrameCurrentDuration! /
							1e3) *
							(i.to - i.from)
				);
			if (n != i.current) {
				if (n > i.current && t == this.player_id) {
					var o =
							'<div style="z-index:10000" class="icon20 icon20_rankwb"></div>',
						a = this.slideTemporaryObject(
							o,
							"page-content",
							"winpoints_value_" + t,
							"player_elo_" + t,
							1e3
						),
						s = n;
					e.connect(
						a,
						"onEnd",
						e.hitch(this, function () {
							$("player_elo_" + this.player_id)!.innerHTML = String(s);
							var t = this.getColorFromElo(
								s + 1300
							);
							e.style(
								$("player_elo_" + this.player_id)!.parentNode as HTMLElement,
								"backgroundColor",
								t
							);
							var i = e.query<HTMLElement>(
								"#player_board_" +
									this.player_id +
									" .gamerank"
							);
							e.removeClass(i[0]!, "rankbounce");
							i[0]!.offsetWidth;
							e.addClass(i[0]!, "rankbounce");
						})
					);
				} else if (
					n < i.current &&
					t == this.player_id
				) {
					(o =
						'<div style="z-index:10000" class="icon20 icon20_rankwb"></div>'),
						(a = this.slideTemporaryObject(
							o,
							"page-content",
							"player_elo_" + t,
							"winpoints_value_" + t,
							1e3
						)),
						(s = n);
					$("player_elo_" + this.player_id)!.innerHTML = String(s);
					var r = this.getColorFromElo(s + 1300);
					e.style(
						$("player_elo_" + this.player_id)!.parentNode as Element,
						"backgroundColor",
						r
					);
					var l = e.query<HTMLElement>(
						"#player_board_" +
							this.player_id +
							" .gamerank"
					);
					e.removeClass(l[0]!, "rankbounce");
					l[0]!.offsetWidth;
					e.addClass(l[0]!, "rankbounce");
				} else {
					$("player_elo_" + t)!.innerHTML = String(n);
					r = this.getColorFromElo(n + 1300);
					e.style(
						$("player_elo_" + t)!.parentNode as Element,
						"backgroundColor",
						r
					);
				}
				this.eloEndOfGameAnimationDatas![t]!.current = n;
			}
		}
		if (
			this.eloEndOfGameAnimationFrameCurrentDuration! >=
			1e3
		) {}
		else {
			this.eloEndOfGameAnimationFrameCurrentDuration! += 50;
			setTimeout(
				e.hitch(this, "eloEndOfGameAnimationWorker"),
				50
			);
		}
	}

	updateResultPage() {
		this.ajaxcall(
			"/table/table/tableinfos.html",
			{ id: this.table_id!, nosuggest: true },
			this,
			function (t) {
				if (
					"finished" != t.status &&
					"archive" != t.status
				) {}
				else {
					this.tableresults = new ebg.tableresults();
					this.tableresults.create(
						this,
						"game_result_panel",
						"statistics_content",
						t,
						this.pma
					);
					this.tableresults_datas = t;
					e.style("statistics", "display", "none");
					("normal_end" !== t.result.endgame_reason &&
						"normal_concede_end" !==
							t.result.endgame_reason &&
						"neutralized_after_skipturn" !==
							t.result.endgame_reason &&
						"neutralized_after_skipturn_error" !==
							t.result.endgame_reason) ||
						e.style(
							"statistics",
							"display",
							"block"
						);
					"undefined" != typeof FB &&
					undefined !== FB.XFBML
						? this.onFBReady()
						: e.subscribe(
								"FBReady",
								this,
								"onFBReady"
						  );
				}
			}
		);
		this.switchToGameResults();
	}

	loadTrophyToSplash(e: Record<BGA.ID, BGA.TableResultTrophies>) {
		var t: Record<BGA.ID, true> = {};
		var i: BGA.ID;
		for (i in e)
			t[e[i]!.id] = true;
		this.ajaxcall(
			"/playernotif/playernotif/getNotificationsToBeSplashDisplayed.html",
			{},
			this,
			function (e) {
				var i: BGA.SplashNotifsToDisplay[] = [];
				for (var n in e)
					28 == e[n]!.news_type && i.push(e[n]!);
				for (var n in e)
					undefined !== t[e[n]!.jargs.award_id_id] &&
						i.push(e[n]!);
				this.showSplashedPlayerNotifications(i);
			}
		);
	}

	displayScores() {
		e.style("maingameview_menuheader", "display", "block");
		var t = (this.gamedatas!.gamestate.args as BGA.GameStateArgs['argGameEnd']).result,
			i = this.buildScoreDlgHtmlContent(t);
		let n = Object.values(t).filter((e) => 1 == e.rank);
		if (null !== i.title) {
			$("pagemaintitletext")!.innerHTML += " : " + i.title;
			$("game_result_label")!.innerHTML = " : " + i.title;
		} else if (1 == n.length) {
			$("pagemaintitletext")!.innerHTML +=
				" : " +
				e.string.substitute(
					__("lang_mainsite", "${winner} wins"),
					{ winner: n[0]!.name }
				);
			$("game_result_label")!.innerHTML =
				" : " +
				e.string.substitute(
					__("lang_mainsite", "${winner} wins"),
					{ winner: n[0]!.name }
				);
		} else if (n.length == Object.values(t).length) {
			$("pagemaintitletext")!.innerHTML +=
				" : " + __("lang_mainsite", "Everybody wins");
			$("game_result_label")!.innerHTML =
				" : " + __("lang_mainsite", "Everybody wins");
		} else {
			let t = n.pop()!,
				i = "";
			// @ts-ignore - This looks like a bug where 'i' here should be 'n'
			i.forEach((e, t) => {
				0 != t && (i += ", ");
				i += e.name;
			});
			$("pagemaintitletext")!.innerHTML +=
				" : " +
				e.string.substitute(
					__(
						"lang_mainsite",
						"${winners_list} and ${winner_last_of_list} win"
					),
					{
						winners_list: i,
						winner_last_of_list: t.name,
					}
				);
			$("game_result_label")!.innerHTML =
				" : " +
				e.string.substitute(
					__(
						"lang_mainsite",
						"${winners_list} and ${winner_last_of_list} win"
					),
					{
						winners_list: i,
						winner_last_of_list: t.name,
					}
				);
		}
		undefined !== this.bGameEndJustHappened &&
			this.bGameEndJustHappened &&
			(g_archive_mode ||
				("victory" == i.result_for_current_player
					? playSound("victory")
					: "lose" == i.result_for_current_player
					? playSound("lose")
					: playSound("tie")));
		var o =
			this.metasiteurl +
			"/gamereview?table=" +
			this.table_id;
		this.notifqueue.addToLog(
			'<p style="text-align:center;"><a href="' +
				o +
				'" class="bgabutton bgabutton_gray replay_last_move_button"><span class="textalign"><span class="icon32 icon32_replaylastmoves textalign_inner"></span></span> ' +
				__("lang_mainsite", "Replay game") +
				"</a></p>",
			false,
			false
		);
	}

	buildScoreDlgHtmlContent(t: BGA.GameStateArgs['argGameEnd']['result']) {
		var i = "",
			n = null,
			o = [],
			a = 0,
			s = false,
			r = false,
			l = null,
			d = true,
			c = true,
			h = true,
			u = true;
		var p: BGA.ID;
		for (p in t) {
			var m = t[p]!;
			(0 == toint(m.score) &&
				-4242 == toint(m.score_aux)) ||
				(d = false);
			-4243 != toint(m.score_aux) && (c = false);
			-4244 != toint(m.score_aux) && (h = false);
			-4245 != toint(m.score_aux) && (u = false);
		}
		var g = null,
			f: BGA.ID | null = null;
		for (p in t) {
			m = t[p]!;
			rank = toint(m.rank)!;
			var v = this.getRankString(rank),
				b = "jstpl_score_entry";
			"undefined" != typeof jstpl_score_entry_specific &&
				(b = "jstpl_score_entry_specific");
			var y = "";
			m.color_back &&
				(y =
					"background-color: #" + m.color_back + ";");
			if (
				null !== n &&
				n == m.score &&
				null !== m.score_aux
			) {
				o.push(m.score);
				1 == rank && (s = true);
			}
			n = m.score;
			m.player == this.player_id && (g = rank);
			f = rank;
			if (!d) {
				undefined === m.player && (m.player = 0);
				i += this.format_block(b, {
					rank: v,
					name: m.name,
					color: m.color,
					color_back: y,
					score: m.score,
					score_aux: m.score_aux,
					index: a,
					id: m.player,
				});
			}
			toint(m.score) > 0 && (r = true);
			a++;
		}
		i += "<br class='clear' /><br/>";
		i += "<div style='text-align: center'>";
		var w = "neutral";
		null !== g && 1 == g && Number(f) > 1 && (w = "victory");
		null !== g && g == f && f > 1 && (w = "lose");
		s && (l = __("lang_mainsite", "End of game (tie)"));
		this.losers_not_ranked &&
			(l = this.isSpectator
				? __("lang_mainsite", "End of game")
				: "victory" == w
				? __("lang_mainsite", "End of game (victory)")
				: "neutral" == w && s
				? __("lang_mainsite", "End of game (tie)")
				: __("lang_mainsite", "End of game (defeat)"));
		d && (l = __("lang_mainsite", "End of game (abandon)"));
		c &&
			(l = __(
				"lang_mainsite",
				"End of game (tournament maximum time reached)"
			));
		h &&
			(l = __(
				"lang_mainsite",
				"End of game (players disagree on the game results)"
			));
		u &&
			(l = __(
				"lang_mainsite",
				"End of game (Arena season has ended)"
			));
		if (this.is_coop || this.is_solo)
			if (this.isSpectator)
				l = __("lang_mainsite", "End of game");
			else if (r) {
				l = __(
					"lang_mainsite",
					"End of game (victory)"
				);
				w = "victory";
			} else {
				l = __("lang_mainsite", "End of game (defeat)");
				w = "lose";
			}
		if (
			"block" ==
				e.style("neutralized_game_panel", "display") ||
			Number(this.gamedatas!.game_result_neutralized) > 0
		) {
			i += $("neutralized_explanation")!.innerHTML;
			l = __(
				"lang_mainsite",
				"End of game (game results neutralized)"
			);
			this.tiebreaker = "";
		}
		o.length > 0 &&
			"" != this.tiebreaker &&
			!d &&
			(i +=
				"<div class='smalltext'>(<i class='fa fa-star tiebreaker'></i>: " +
				__("lang_mainsite", "Tie breaker") +
				": " +
				_(this.tiebreaker!) +
				")</div><br/>");
		c &&
			(i +=
				"<div>(" +
				__(
					"lang_mainsite",
					"Game has been abandonned automatically because players did not managed to finish it before the next round of the tournament. The player with the most remaining reflexion time wins the game."
				) +
				")</div><br/>");
		h &&
			(i +=
				"<div>(" +
				__(
					"lang_mainsite",
					"Game has been abandonned automatically because players did not managed to agree on a game result."
				) +
				")</div><br/>");
		d ||
			(i +=
				'<div class="fb-share-button" data-href="https://boardgamearena.com/table?table=' +
				this.table_id +
				"table?table=" +
				this.table_id +
				'" data-layout="button" data-size="large"></div>');
		return {
			html: i,
			title: l,
			result_for_current_player: w,
			tied_scores: o,
		};
	}

	onFBReady() {
		e.query(".publishresult").style(
			"display",
			"inline-block"
		);
		e.forEach(e.query<HTMLElement>(".fb_button_text"), function (e) {
			e.innerHTML = __(
				"lang_mainsite",
				"Publish on my Facebook profile"
			);
		});
	}

	onShowGameResults() {}

	onGameEnd() {
		this.displayScores();
		$("pagemaintitletext")!.innerHTML += "<br/>";
		this.connect($('')!, "onclick", "onBackToMetasite");
		this.addActionButton(
			"backMetasite_btn",
			__("lang_mainsite", "Return to main site"),
			"onBackToMetasite"
		);
		this.addActionButton(
			"createNew_btn",
			__("lang_mainsite", "Play again"),
			"onCreateNewTable"
		);
		this.isSpectator ||
			this.addActionButton(
				"revenge_btn",
				__("lang_mainsite", "Propose a rematch"),
				"onProposeRematch"
			);
		this.blinkid;
		e.hasClass("archivecontrol", "demomode")
			? setTimeout(
					e.hitch(this, function () {
						parent.location.reload();
					}),
					1e3
			  )
			: e.hasClass("archivecontrol", "loop") &&
			  setTimeout(
					e.hitch(this, function () {
						window.location.reload();
					}),
					1e3
			  );
		"" != this.quickGameEndUrl &&
			setTimeout(
				e.hitch(this, function () {
					document.location.href =
						this.quickGameEndUrl +
						"?table=" +
						this.table_id;
				}),
				1e3
			);
		this.updateVisitors(this.last_visitorlist!);
	}

	prepareMediaRatingParams() {
		this.mediaRatingParams = "";
		"undefined" != typeof bgaConfig &&
			bgaConfig.webrtcEnabled &&
			this.mediaChatRating &&
			0 != this.rtc_mode &&
			null !== this.room &&
			(this.mediaRatingParams =
				"media_rating=" +
				(2 == this.rtc_mode ? "video" : "audio") +
				"&room=" +
				this.room);
	}

	getMediaRatingParams(firstParam?: boolean) {
		undefined === firstParam && (firstParam = false);
		return "undefined" != typeof bgaConfig &&
			bgaConfig.webrtcEnabled &&
			this.mediaChatRating &&
			"" != this.mediaRatingParams
			? firstParam
				? "?" + this.mediaRatingParams
				: "&" + this.mediaRatingParams
			: "";
	}

	redirectToTablePage() {
		document.location.href =
			this.metasiteurl +
			"/table?table=" +
			this.table_id +
			this.getMediaRatingParams(false);
	}

	redirectToTournamentPage() {
		document.location.href =
			this.metasiteurl +
			"/tournament?id=" +
			this.tournament_id +
			this.getMediaRatingParams(false);
	}

	redirectToLobby() {
		document.location.href =
			this.metasiteurl +
			"/" +
			this.mslobby +
			this.getMediaRatingParams(true);
	}

	redirectToMainsite() {
		document.location.href =
			this.metasiteurl +
			"/" +
			this.getMediaRatingParams(true);
	}

	redirectToGamePage() {
		document.location.href =
			this.metasiteurl +
			"/gamepanel?game=" +
			this.game_name +
			this.getMediaRatingParams(false);
	}

	doRedirectToMetasite() {
		"new" === localStorage.getItem("bga-lobby-type")
			? this.redirectToGamePage()
			: this.quickGameEnd
			? "" != this.quickGameEndUrl
				? this.redirectToTablePage()
				: this.redirectToMainsite()
			: null != this.tournament_id
			? this.redirectToTournamentPage()
			: this.redirectToLobby();
	}

	onBackToMetasite(event: Event) {
		if (
			"undefined" != typeof bgaConfig &&
			bgaConfig.webrtcEnabled &&
			null !== this.room
		) {
			this.prepareMediaRatingParams();
			this.doLeaveRoom(
				e.hitch(this, this.doRedirectToMetasite)
			);
		} else this.doRedirectToMetasite();
	}

	onCreateNewTable() {
		if (
			"undefined" != typeof bgaConfig &&
			bgaConfig.webrtcEnabled &&
			null !== this.room
		) {
			this.prepareMediaRatingParams();
			this.doLeaveRoom();
		}
		document.location.href =
			this.metasiteurl +
			"/gamepanel?game=" +
			this.game_name;
	}

	onProposeRematch() {
		if (
			"undefined" != typeof bgaConfig &&
			bgaConfig.webrtcEnabled &&
			null !== this.room
		) {
			this.prepareMediaRatingParams();
			this.doLeaveRoom();
		}
		this.ajaxcall(
			"/table/table/createnew.html",
			{
				game: this.game_id!,
				rematch: this.table_id!,
				src: "R",
			},
			this,
			function (e) {
				e.table;
				var t = e.table;
				document.location.href =
					this.metasiteurl +
					"/table?table=" +
					t +
					"&acceptinvit" +
					this.getMediaRatingParams(false);
			}
		);
	}

	onBuyThisGame() {
		document.location.href = this.blinkid!;
	}

	ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(...[
		url,
		args,
		scope,
		onSuccess,
		callback,
		ajax_method
	]: BGA.AjaxParams<Action, Scope>) {
		var t = arguments[0] as typeof url,
			i = `/${this.game_name}/${this.game_name}/`;
		if (g_archive_mode) {
			var n = arguments[1] as typeof args,
				o = arguments[2] as typeof scope,
				a = arguments[4] as typeof callback;
			if (0 == t.indexOf(i)) {
				var s = t.substr(i.length);
				s = s.replace(".html", "");
				delete n.lock;
				n.__action__ = s;
				n.__move_id__ =
					toint($("move_nbr")!.innerHTML) + 1;
				n.__player_id__ = this.player_id!;
				n.table = this.table_id!;
				n.h =
					(g_gamelogs as Record<BGA.ID, BGA.NotifsPacket>)[
						this.next_archive_index
					]!.data[0]!.h;
				if (this.notifqueue.queue.length > 0)
					for (var r in this.notifqueue.queue)
						if (
							undefined !==
							this.notifqueue.queue[r]!.h
						) {
							n.h = this.notifqueue.queue[r]!.h;
							break;
						}
				if (
					"view" == g_tutorialwritten!.mode &&
					!$("do_action_to_continue")
				) {
					this.showMessage(
						__(
							"lang_mainsite",
							"You must use Continue button to continue the tutorial"
						),
						"error"
					);
					return;
				}
				var l = null;
				this.notifqueue.queue.length > 0 &&
					undefined !==
						this.notifqueue.queue[0]!.move_id &&
					(l = toint(
						this.notifqueue.queue[0]!.move_id
					));
				if (n.__move_id__ === l) {
					this.showMessage(
						__(
							"lang_mainsite",
							'You are in the middle of reviewing a move, so you cannot play: use the "Next move" button to go to the end of this move'
						),
						"error"
					);
					return;
				}
				return ebg.core.sitecore.prototype.ajaxcall.call(
					this,
					"/table/table/checkNextMove.html",
					n,
					this,
					// @ts-ignore - this is caused by the complexity of the types
					function (this: Gamegui_Template, t) {
						if ("ok" == t) {
							this.archive_playmode =
								"nextcomment";
							e.style(
								"archiveCommentMinimizedIcon",
								"display",
								"none"
							);
							this.doNewArchiveCommentNext();
						}
					},
					function (t) {
						// @ts-ignore - this is caused by the complexity of the types
						undefined !== a && e.hitch(o, a)(true, t, 0);
					},
					"post"
				);
			}
		} else if ("/" == t.charAt(0)) {
			var d = "/" + this.game_name + "/" + this.game_name;
			t.substr(0, d.length) == d &&
				(arguments[0] = t.substr(1));
		}
		(arguments[1] as typeof args).table = this.table_id!;
		(arguments[1] as typeof args).noerrortracking = true;
		null !== this.forceTestUser &&
			((arguments[1] as typeof args).testuser = this.forceTestUser!);
		if (
			e.hasClass("ebd-body", "arena_cannot_play") &&
			0 == t.indexOf(i)
		) {
			n = (arguments[1] as typeof args);
			console.error(n);
			if (n.lock) {
				this.showMessage(
					_("You must play first on another table"),
					"error"
				);
				return;
			}
		}
		return this.inherited(arguments);
	}

	onGlobalActionPause(e: MouseEvent) {
		e.preventDefault();
	}

	onGlobalActionFullscreen(t: MouseEvent) {
		e.stopEvent(t);
		var i = document.documentElement;
		// @ts-ignore - is this a capitalization error?
		i.requestFullScreen
			// @ts-ignore - is this a capitalization error?
			? i.requestFullScreen()
			// @ts-ignore - not a part of the mozilla spec
			: i.webkitRequestFullScreen
			// @ts-ignore - not a part of the mozilla spec
			? i.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
			// @ts-ignore - not a part of the mozilla spec
			: i.mozRequestFullScreen
			// @ts-ignore - not a part of the mozilla spec
			? i.mozRequestFullScreen()
			: window.open(
				`/${this.gameserver}/${this.game_name}?table=${this.table_id}`,
				"",
				"fullscreen=yes,scrollbars=yes"
			);
		return false;
	}

	switchLogModeTo(t: 0 | 1 | boolean) {
		if (0 != t && "2cols" != this.log_mode) {
			this.log_mode = "2cols";
			e.addClass("ebd-body", "logs_on_additional_column");
			this.onGameUiWidthChange();
		} else if (0 == t && "normal" != this.log_mode) {
			this.log_mode = "normal";
			e.removeClass(
				"ebd-body",
				"logs_on_additional_column"
			);
			this.onGameUiWidthChange();
		}
	}

	onGlobalActionPreferences() {}
	onGlobalActionHelp() {}

	onGlobalActionBack(t: MouseEvent) {
		t.preventDefault();
		if (
			"undefined" != typeof bgaConfig &&
			bgaConfig.webrtcEnabled &&
			null !== this.room
		) {
			this.prepareMediaRatingParams();
			this.doLeaveRoom(
				e.hitch(this, function () {
					this.redirectToTablePage();
				})
			);
		} else this.redirectToTablePage();
	}

	onGlobalActionQuit(t: MouseEvent) {
		t.preventDefault();
		if (
			"gameEnd" == this.gamedatas!.gamestate.name ||
			g_archive_mode ||
			this.isSpectator
		)
			if (
				"undefined" != typeof bgaConfig &&
				bgaConfig.webrtcEnabled &&
				null !== this.room
			) {
				this.prepareMediaRatingParams();
				this.doLeaveRoom(
					e.hitch(this, function () {
						this.redirectToTablePage();
					})
				);
			} else this.redirectToTablePage();
		else
			this.leaveTable(
				this.table_id!,
				e.hitch(this, function () {
					if (
						"undefined" != typeof bgaConfig &&
						bgaConfig.webrtcEnabled &&
						null !== this.room
					) {
						this.prepareMediaRatingParams();
						this.doLeaveRoom(
							e.hitch(this, function () {
								this.redirectToTablePage();
							})
						);
					} else this.redirectToTablePage();
				})
			);
	}

	onNewLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number) {}
	addMoveToLog(t: number, i: BGA.ID) {
		this.addTooltip(
			"log_" + t,
			"",
			__("lang_mainsite", "Replay game from this point")
		);
		e.addClass("log_" + t, "log_replayable");
		this.log_to_move_id[t] = i;
		e.connect(
			$("log_" + t)!,
			"onclick",
			this,
			"onReplayFromPoint"
		);
	}

	onChangeContentHeight() {}
	onReplayFromPoint(t: MouseEvent) {
		var i = (t.target || t.srcElement) as Element;
		if ("A" != i.tagName && "a" != i.tagName) {
			var n = (t.currentTarget as Element).id.substr(4) as `${number}`;
			if (!e.hasClass("log_" + n, "replay_move_added")) {
				var o = this.log_to_move_id[n];
				o = Math.max(0, toint(o));
				var a =
					"/" +
					this.gameserver +
					"/" +
					this.game_name +
					"?table=" +
					this.table_id +
					"&replayFrom=" +
					o +
					(e.query(".expressswitch").length > 0
						? "&testuser=" + this.forceTestUser
						: "");
				e.place(
					'<p style="text-align:center;"><a href="' +
						a +
						'" class="bgabutton bgabutton_gray replay_last_move_button"><span class="textalign"><span class="icon32 icon32_replaylastmoves textalign_inner"></span></span> ' +
						__(
							"lang_mainsite",
							"Replay from this move"
						) +
						"</a></p>",
					"log_" + n
				);
				e.addClass("log_" + n, "replay_move_added");
			}
		}
	}

	updateDecisionPanel(t: BGA.NotifTypes['tableDecision']) {
		if ("none" == t.decision_type)
			e.style("table-decision", "display", "none");
		else if (
			true === t.decision_taken ||
			"true" == t.decision_taken
		) {
			e.style("table-decision", "display", "none");
			if ("abandon" == t.decision_type) {
				this.showMessage(
					this.is_coop
						? __(
								"lang_mainsite",
								"The decision to CONCEDE this game has been taken by all players."
						  )
						: __(
								"lang_mainsite",
								"The decision to ABANDON this game has been taken by all players"
						  ),
					"info"
				);
				this.isSpectator ||
					(this.gamedatas!.gamestate.reflexion.total[
						this.player_id!
					]! < 0 &&
						this.showMessage(
							this.is_coop
								? __(
										"lang_mainsite",
										"You were OUT OF TIME, therefore you automatically accepted to concede this game."
								  )
								: __(
										"lang_mainsite",
										"You were OUT OF TIME, therefore you automatically accepted to abandon this game."
								  ),
							"info"
						));
			}
		} else if (
			true === t.decision_refused ||
			"true" == t.decision_refused
		) {
			e.style("table-decision", "display", "none");
			this.notifqueue.addToLog(
				__(
					"lang_mainsite",
					"Decision on table has been refused"
				)
			);
		} else {
			e.style($("table-decision")!, "display", "block");
			this.isSpectator &&
				document
					.querySelectorAll<HTMLElement>("#table-decision a")
					.forEach((e) => (e.style.display = "none"));
			var i: BGA.ID,
				n = "";
			"abandon" == t.decision_type
				? (n = this.is_coop
						? __(
								"lang_mainsite",
								"Would you like to concede this game? This effectively means losing the game (ELO points loss)"
						  )
						: __(
								"lang_mainsite",
								"Would you like to abandon this game (no points loss) ?"
						  ))
				: "switch_tb" == t.decision_type &&
				  (n = __(
						"lang_mainsite",
						"Would you like to transform this table in a Turn-based table ?"
				  ));
			$("decision-title")!.innerHTML = n;
			$("decision-players-0")!.innerHTML = "-";
			$("decision-players-1")!.innerHTML = "-";
			$("decision-players-undecided")!.innerHTML = "-";
			for (i in t.players) {
				var o = t.players![i]!,
					a = this.gamedatas!.players[i]!.name,
					s = $("decision-players-" + o)!;
				"-" == s.innerHTML
					? (s.innerHTML = "<b>" + a + "</b>")
					: (s.innerHTML += ", <b>" + a + "</b>");
			}
			this.bRealtime ||
				(s!.innerHTML +=
					"<br/><br/><b>" +
					__("lang_mainsite", "Important") +
					":</b> " +
					__(
						"lang_mainsite",
						"Until all players agree you must continue to PLAY or you may get some penalties."
					));
		}
	}

	onPlayerDecide(e: MouseEvent) {
		e.preventDefault();
		var t: 0 | 1 = 0;
		"decision_yes" == (e.currentTarget as Element).id && (t = 1);
		this.ajaxcall(
			"/table/table/decide.html",
			{ type: null, decision: t, table: this.table_id! },
			this,
			function (e, t) {}
		);
	}

	updateReflexionTimeDisplay() {
		if (g_archive_mode) {
			e.style($("archivecontrol")!, "display", "block");
			e.hasClass("archivecontrol", "demomode") &&
				e.style("archivecontrol", "display", "none");
		} else {
			var t: BGA.ID;
			if ("undefined" == typeof g_replayFrom)
				for (t in this.gamedatas!.gamestate.reflexion
					.total) {
					var i = this.formatReflexionTime(
						this.gamedatas!.gamestate.reflexion
							.total[t]!
					);
					$("timeToThink_" + t)!.innerHTML = i.string;
				}
			else if (undefined !== this.updatedReflexionTime) {
				this.gamedatas!.gamestate.reflexion =
					this.updatedReflexionTime;
				for (t in this.gamedatas!.gamestate.reflexion
					.total) {
					i = this.formatReflexionTime(
						this.gamedatas!.gamestate.reflexion
							.total[t]!
					);
					$("timeToThink_" + t)!.innerHTML = i.string;
				}
			}
			if (
				this.isCurrentPlayerActive() ||
				this.bTimerCommon
			) {
				if (
					this.gamedatas!.gamestate.reflexion.total[
						this.player_id!
					]
				) {
					e.style(
						$("inactiveplayerpanel")!,
						"display",
						"none"
					);
					e.style(
						$("wouldlikethink_button")!,
						"display",
						"inline"
					);
					e.style(
						$("not_playing_help")!,
						"display",
						"none"
					);
					e.style(
						$("ai_not_playing")!,
						"display",
						"none"
					);
					e.style(
						$("reflexiontime")!,
						"display",
						"block"
					);
					e.style(
						$("its_your_turn")!,
						"visibility",
						"visible"
					);
					i = this.formatReflexionTime(
						this.gamedatas!.gamestate.reflexion
							.total[this.player_id!]!
					);
					$("reflexiontime_value")!.innerHTML =
						i.string;
					this.currentPlayerReflexionStartAt =
						this.gamedatas!.gamestate.reflexion.total[
							this.player_id!
						]!;
				}
				if (
					this.bTimerCommon &&
					!this.isCurrentPlayerActive()
				) {
					e.style(
						$("wouldlikethink_button")!,
						"display",
						"none"
					);
					e.style(
						$("its_your_turn")!,
						"visibility",
						"hidden"
					);
				}
			} else {
				e.style(
					$("inactiveplayerpanel")!,
					"display",
					"block"
				);
				e.style(
					$("wouldlikethink_button")!,
					"display",
					"none"
				);
				e.style($("ai_not_playing")!, "display", "none");
				e.style(
					$("not_playing_help")!,
					"display",
					"none"
				);
				e.style($("reflexiontime")!, "display", "none");
			}
			if (this.clock_timeout) {
				clearTimeout(this.clock_timeout);
				this.clock_timeout = null;
			}
			this.updateReflexionTime(true);
		}
	}

	updateReflexionTime(t: boolean) {
		this.clock_timeout = setTimeout(
			e.hitch(this, "updateReflexionTime"),
			1e3
		);
		var i = this.getActivePlayers();
		var n: BGA.ID;
		if (this.bTimerCommon) {
			i = [];
			for (n in this.gamedatas!.players) i.push(n);
		}
		var o = false,
			a = false;
		// @ts-ignore - n is a number
		for (n in i) {
			var s = i[n]!;
			undefined ===
				this.gamedatas!.gamestate.reflexion.total[s] &&
				console.error(
					"Try to active a player that is not around the table: " +
						s
				);
			if (undefined !== t && t) {
				if (
					undefined ===
					this.gamedatas!.gamestate.reflexion.initial
				) {
					this.gamedatas!.gamestate.reflexion.initial =
						{};
					this.gamedatas!.gamestate.reflexion.initial_ts =
						{};
				}
				this.gamedatas!.gamestate.reflexion.initial[s] =
					this.gamedatas!.gamestate.reflexion.total[s]!;
				this.gamedatas!.gamestate.reflexion.initial_ts[
					s
				] = new Date().getTime();
			} else {
				var r = true,
					l = new Date();
				undefined !== this.playingHours &&
					// @ts-ignore - hours will always be 0-23
					(r = this.playingHours[l.getHours()]);
				if (r) {
					var d = Math.floor(
						(l.getTime() -
							this.gamedatas!.gamestate.reflexion
								.initial_ts[s]!) /
							1e3
					);
					this.gamedatas!.gamestate.reflexion.total[
						s
					] =
						this.gamedatas!.gamestate.reflexion
							.initial[s]! - d;
				} else a = true;
			}
			var c = this.formatReflexionTime(
				this.gamedatas!.gamestate.reflexion.total[s]!
			);
			undefined !== this.gamedatas!.players[s]!.is_ai &&
				0 != this.gamedatas!.players[s]!.is_ai &&
				(o = true);
			if ($("timeToThink_" + s)) {
				$("timeToThink_" + s)!.innerHTML = a
					? '<i class="fa fa-moon-o" aria-hidden="true"></i> ' +
					  c.string
					: c.string;
				if (c.positive)
					e.style(
						$("timeToThink_" + s)!,
						"color",
						"inherit"
					);
				else {
					e.style(
						$("timeToThink_" + s)!,
						"color",
						"red"
					);
					this.bTimerCommon &&
						($("timeToThink_" + s)!.innerHTML =
							this.formatReflexionTime(0).string);
				}
			} else
				this.showMessage(
					"Unknow active player: " + s,
					"error"
				);
		}
		if (this.isCurrentPlayerActive() || this.bTimerCommon) {
			if (
				undefined !==
				this.gamedatas!.gamestate.reflexion.total[
					this.player_id!
				]
			) {
				c = this.formatReflexionTime(
					this.gamedatas!.gamestate.reflexion.total[
						this.player_id!
					]!
				);
				$("reflexiontime_value")!.innerHTML = a
					? '<div class="icon20 icon20_night this_is_night" style="top:1px"></div> ' +
					  c.string
					: c.string;
				if (
					this.gamedatas!.gamestate.reflexion.total[
						this.player_id!
					]! < 0
				) {
					e.fx
						.chain([
							e.fadeOut({
								node: "reflexiontime_value",
								duration: 200,
							}),
							e.fadeIn({
								node: "reflexiontime_value",
								duration: 200,
							}),
						])
						.play();
					this.bTimerCommon &&
						($("reflexiontime_value")!.innerHTML =
							this.formatReflexionTime(0).string);
				}
				if (this.bRealtime) {
					if (
						10 ==
						this.gamedatas!.gamestate.reflexion
							.total[this.player_id!]!
					) {
						playSound("time_alarm");
						this.notifqueue.addToLog(
							__(
								"lang_mainsite",
								"Warning: Your clock has only 10 seconds remaining!"
							)
						);
					}
					if (
						0 ==
						this.gamedatas!.gamestate.reflexion
							.total[this.player_id!]!
					) {
						playSound("time_alarm");
						this.notifqueue.addToLog(
							__(
								"lang_mainsite",
								"Warning: Your clock is negative: you should play now!"
							)
						);
					}
					if (
						undefined !==
							this
								.currentPlayerReflexionStartAt &&
						this.currentPlayerReflexionStartAt <
							0 &&
						this.gamedatas!.gamestate.reflexion
							.total[this.player_id!]! ==
							this.currentPlayerReflexionStartAt -
								10
					) {
						playSound("time_alarm");
						this.notifqueue.addToLog(
							__(
								"lang_mainsite",
								"Warning: Your clock is negative: you should play now!"
							)
						);
					}
				}
			}
			var h = document.title.substr(0, 2),
				u: Record<string, string> = {
					"◢ ": "◣ ",
					"◣ ": "◤ ",
					"◤ ": "◥ ",
					"◥ ": "◢ ",
				},
				p = "new";
			u[h] && (p = u[h]!);
			document.title =
				"new" == p
					? "◢ " + document.title
					: p + document.title.substr(2);
		}
		if (a) {
			e.addClass("ebd-body", "night_mode");
			this.addTooltipToClass(
				"this_is_night",
				e.string.substitute(
					__(
						"lang_mainsite",
						"Playing hours for this game are ${hours}: consequently, the timer is not decreasing at now."
					),
					{
						hours: $("menu_option_value_206")!
							.innerHTML,
					}
				),
				""
			);
		} else e.removeClass("ebd-body", "night_mode");
		this.updateFirePlayerLink();
		this.lastWouldLikeThinkBlinking!++;
		if (
			this.lastWouldLikeThinkBlinking! > 30 &&
			i.length > 0
		) {
			e.fx
				.chain([
					e.fadeOut({
						node: "wouldlikethink_button",
						duration: 200,
					}),
					e.fadeIn({
						node: "wouldlikethink_button",
						duration: 200,
					}),
				])
				.play();
			this.isCurrentPlayerActive() ||
				(o
					? e.style(
							$("ai_not_playing")!,
							"display",
							"inline"
					  )
					: e.style(
							$("not_playing_help")!,
							"display",
							"inline"
					  ));
		}
		e.query<HTMLElement>(".blinking").forEach(function (t) {
			e.fx
				.chain([
					e.fadeOut({ node: t, duration: 200 }),
					e.fadeIn({ node: t, duration: 200 }),
				])
				.play();
		});
	}

	shouldDisplayClockAlert(player_id: BGA.ID) {
		return this.gamedatas!.gamestate.reflexion.total[player_id]! <= 0;
	}

	updateFirePlayerLink() {
		e.style("skip_player_turn", "display", "none");
		var t = this.getActivePlayers();
		for (var i in t) {
			var n = t[i]!;
			toint(n) != toint(this.player_id) &&
				this.gamedatas!.gamestate.reflexion.total[n]! <
					0 &&
				(this.isSpectator ||
					e.style(
						"skip_player_turn",
						"display",
						"inline"
					));
		}
	}

	onWouldLikeToThink(e: MouseEvent) {
		e.preventDefault();
		this.ajaxcall(
			"/table/table/wouldlikethink.html",
			{},
			this,
			function (e, t) {}
		);
	}

	sendWakeupInTenSeconds() {
		this.cancelPlannedWakeUp();
		this.wakeup_timeout = setTimeout(
			e.hitch(this, "sendWakeUpSignal"),
			1e4
		);
	}

	sendWakeUpSignal() {
		this.cancelPlannedWakeUp();
		this.ajaxcall(
			`/${this.game_name}/${this.game_name}/wakeup.html`,
			{ myturnack: true, table: this.table_id! },
			this,
			function (e, t) {}
		);
	}

	cancelPlannedWakeUp() {
		if (this.wakeup_timeout) {
			clearTimeout(this.wakeup_timeout);
			this.wakeup_timeout = null;
		}
	}

	checkWakupUpInFourteenSeconds() {
		this.cancelPlannedWakeUpCheck();
		var t = 14e3 + 6e3 * Math.random();
		this.wakeupcheck_timeout = setTimeout(
			e.hitch(this, "checkWakups"),
			t
		);
	}

	checkWakups() {
		this.cancelPlannedWakeUpCheck();
		var e = false,
			t = this.getActivePlayers();
		for (var i in t) {
			var n = t[i]!;
			if ("wait" == this.gamedatas!.players[n]!.ack) {
				this.gamedatas!.players[n]!.ack = "unavail";
				$<HTMLImageElement>("avatar_active_" + n)!.src = getStaticAssetUrl(
					"img/layout/active_player_nonack.gif"
				);
				e = true;
			}
		}
		e &&
			(this.isSpectator ||
				this.ajaxcall(
					`/${this.game_name}/${this.game_name}/wakeupPlayers.html`,
					{},
					this,
					function (e, t) {}
				));
	}

	cancelPlannedWakeUpCheck() {
		if (this.wakeupcheck_timeout) {
			clearTimeout(this.wakeupcheck_timeout);
			this.wakeupcheck_timeout = null;
		}
	}

	isInterfaceLocked() {
		return null !== this.interface_locked_by_id;
	}

	isInterfaceUnlocked() {
		return null === this.interface_locked_by_id;
	}

	lockInterface(lock?: Gamegui_Template["interface_locked_by_id"]) {
		this.isInterfaceLocked() &&
			console.error(
				"Try to lock interface while it is already locked !"
			);
		e.addClass("ebd-body", "lockedInterface");
		this.interface_locked_by_id = lock;
	}

	unlockInterface(lock?: Gamegui_Template["interface_locked_by_id"]) {
		if (
			this.isInterfaceLocked() &&
			this.interface_locked_by_id == lock
		) {
			this.interface_locked_by_id = null;
			e.removeClass("ebd-body", "lockedInterface");
		}
	}

	onLockInterface(...[t]: BGA.TopicArgs['lockInterface']) {
		t.status, t.uuid, this.interface_locked_by_id;
		if ("outgoing" == t.status) {
			this.lockInterface(t.uuid);
			this.interface_locking_type = null;
			t.type && (this.interface_locking_type = t.type);
			e.style("pagemaintitle_wrap", "display", "none");
			e.style(
				"gameaction_status_wrap",
				"display",
				"block"
			);
			$("gameaction_status")!.innerHTML = __(
				"lang_mainsite",
				"Sending move to server ..."
			);
			this.interface_status = "outgoing";
		} else if (t.uuid == this.interface_locked_by_id) {
			if (
				"recorded" == t.status &&
				"outgoing" == this.interface_status
			) {
				$("gameaction_status")!.innerHTML = __(
					"lang_mainsite",
					"Move recorded, waiting for update ..."
				);
				this.interface_status = "recorded";
			}
			if (
				null === this.interface_locking_type ||
				("table" == this.interface_locking_type &&
					t.bIsTableMsg) ||
				("player" == this.interface_locking_type &&
					!t.bIsTableMsg)
			)
				if ("queued" == t.status) {
					if (
						"outgoing" == this.interface_status ||
						"recorded" == this.interface_status
					) {
						$("gameaction_status")!.innerHTML = __(
							"lang_mainsite",
							"Updating game situation ..."
						);
						this.interface_status = "queued";
					}
				} else if ("dispatched" == t.status)
					"queued" == this.interface_status &&
						(this.interface_status = "dispatched");
				else if ("updated" == t.status) {
					this.unlockInterface(t.uuid);
					this.interface_status = "updated";
					e.style(
						"pagemaintitle_wrap",
						"display",
						"block"
					);
					e.style(
						"gameaction_status_wrap",
						"display",
						"none"
					);
					e.style(
						"synchronous_notif_icon",
						"display",
						"none"
					);
				}
		} else if (
			"queued" == t.status &&
			this.isInterfaceUnlocked()
		) {
			this.lockInterface(t.uuid);
			this.interface_locking_type = null;
			t.type && (this.interface_locking_type = t.type);
			$("gameaction_status")!.innerHTML = __(
				"lang_mainsite",
				"Updating game situation ..."
			);
			this.interface_status = "queued";
			e.style("pagemaintitle_wrap", "display", "none");
			e.style(
				"gameaction_status_wrap",
				"display",
				"block"
			);
		}
	}

	onAiNotPlaying(t: MouseEvent) {
		e.stopEvent(t);
		this.lastWouldLikeThinkBlinking = 0;
		e.style($("ai_not_playing")!, "display", "none");
		this.ajaxcall(
			`/${this.game_name}/${this.game_name}/aiNotPlaying.html`,
			{ table: this.table_id! },
			this,
			function (e) {}
		);
	}

	onNotPlayingHelp(e: MouseEvent) {
		e.preventDefault();
		var t = new ebg.popindialog();
		t.create("fireHelpContent");
		t.setTitle(
			__("lang_mainsite", "Some player is not playing ?")
		);
		var i = "<div id='fireHelpContent'>";
		i += __(
			"lang_mainsite",
			"Some player is not playing ? Here is what you can do:"
		);
		i += "<ul>";
		i +=
			"<li>" +
			__(
				"lang_mainsite",
				"At first, remember that each player has the absolute right to think as long as he has some time left."
			) +
			"</li>";
		i +=
			"<li>" +
			__(
				"lang_mainsite",
				"Try to contact him with the chatroom."
			) +
			"</li>";
		i +=
			"<li>" +
			__(
				"lang_mainsite",
				"Maybe you are disconnected from the server and the other player is waiting for you: try to refresh the page (hit F5) to check."
			) +
			"</li>";
		i +=
			"<li>" +
			__(
				"lang_mainsite",
				"If the other player is definitely not there, you just have to wait until his time to think is over:"
			) +
			"</li>";
		i +=
			"<li>" +
			__(
				"lang_mainsite",
				"As soon as your opponent is out of time, you can make him skip his turn."
			) +
			"</li>";
		i +=
			"<li>" +
			__(
				"lang_mainsite",
				"DO NOT quit the game by yourself: you will get a leave penalty and not him."
			) +
			"</li>";
		i += "</ul></div>";
		t.setContent(i);
		t.show();
	}

	onSkipPlayersOutOfTime(e: MouseEvent) {
		e.preventDefault();
		this.ajaxcall(
			`/${this.game_name}/${this.game_name}/skipPlayersOutOfTime.html`,
			{},
			this,
			function (e) {}
		);
	}

	onWouldFirePlayer(t: MouseEvent) {
		t.preventDefault();
		this.fireDlg = new ebg.popindialog() as NonNullable<this['fireDlg']>;
		this.fireDlg.create("fireDlgContent");
		this.fireDlg.setTitle(
			__(
				"lang_mainsite",
				"Skip turn of players out of time"
			)
		);
		this.fireDlg.telParentPage = this;
		var i = '<div id="fireDlgContent">';
		i +=
			"<p>" +
			__(
				"lang_mainsite",
				"Skipping a player`s turn is an important decision. This player will get a `leave` penalty and will lose ELO if he/she doesn't comme back."
			) +
			"</p>";
		i +=
			"<p>" +
			e.string.substitute(
				__(
					"lang_mainsite",
					"You (and eventually all other opponents) will be considered as winner(s) of this game, and you'll get ${percent}% of ELO points you would have get for a normal victory."
				),
				{ percent: $("pr_gameprogression")!.innerHTML }
			) +
			" </p>";
		this.bRealtime &&
			(i +=
				"<p>" +
				e.string.substitute(
					__(
						"lang_mainsite",
						"A good option is to ${transform_to_tb}, so everyone can finish this game."
					),
					{
						transform_to_tb:
							'<a href="#" id="transform_to_tb_from_dialog">' +
							__(
								"lang_mainsite",
								"switch this game to Turn-based mode"
							) +
							"</a>",
					}
				) +
				" </p>");
		this.is_coop
			? (i +=
					"<p>" +
					e.string.substitute(
						__(
							"lang_mainsite",
							"Note that you may alternatively propose to ${abandon_this_game} (ELO points loss but no leave penalty)."
						),
						{
							abandon_this_game:
								'<a href="#" id="abandon_from_dialog">' +
								__(
									"lang_mainsite",
									"concede this game"
								) +
								"</a>",
						}
					) +
					" </p>")
			: (i +=
					"<p>" +
					e.string.substitute(
						__(
							"lang_mainsite",
							"Note that you may alternatively propose to ${abandon_this_game} (no penalty and no points for anyone)."
						),
						{
							abandon_this_game:
								'<a href="#" id="abandon_from_dialog">' +
								__(
									"lang_mainsite",
									"abandon this game"
								) +
								"</a>",
						}
					) +
					" </p>");
		i +=
			"<p>" +
			__(
				"lang_mainsite",
				"Note that the best option for everyone is to finish the game normally. Are you really sure you want to neutralize this game and skip this player's turn?"
			) +
			" </p>";
		i += "<br/>";
		i +=
			"<p><a class='bgabutton bgabutton_gray bgabutton_big' id='fireplayer_cancel'>" +
			__("lang_mainsite", "Continue waiting") +
			"</a> &nbsp; ";
		i +=
			"<a class='bgabutton bgabutton_blue bgabutton_big' id='fireplayer_confirm'>" +
			__("lang_mainsite", "Confirm") +
			"</a></p>";
		i += "</div>";
		this.fireDlg.setContent(i);
		this.fireDlg.show();
		this.fireDlgStatus = "confirm";
		e.connect(
			$("fireplayer_cancel")!,
			"onclick",
			e.hitch(this.fireDlg, function () {
				this.destroy();
			})
		);
		e.connect(
			$("abandon_from_dialog")!,
			"onclick",
			e.hitch(this, function () {
				this.fireDlg!.destroy();
				this.ajaxcall(
					"/table/table/decide.html",
					{
						type: "abandon",
						decision: 1,
						table: this.table_id!,
					},
					this,
					function (e, t) {}
				);
			})
		);
		$("transform_to_tb_from_dialog") &&
			e.connect(
				$("transform_to_tb_from_dialog")!,
				"onclick",
				e.hitch(this, function () {
					this.fireDlg!.destroy();
					this.ajaxcall(
						"/table/table/decide.html",
						{
							type: "switch_tb",
							decision: 1,
							table: this.table_id!,
						},
						this,
						function (e, t) {}
					);
				})
			);
		$("fireplayer_confirm") &&
			e.connect(
				$("fireplayer_confirm")!,
				"onclick",
				e.hitch(this.fireDlg, function () {
					var t = false;
					if (this.telParentPage.bRealtime)
						if (
							"confirm" ==
							this.telParentPage.fireDlgStatus
						)
							t = true;
						else {
							if (
								"expel" !=
								this.telParentPage.fireDlgStatus
							)
								return;
							t = false;
						}
					this.telParentPage.ajaxcall(
						`/${this.telParentPage.game_name!}/${this.telParentPage.game_name!}/skipPlayersOutOfTime.html`,
						{ warn: t },
						this,
						e.hitch(this, function (e, i) {
							if (t) {
								this.telParentPage.list_of_players_to_expel =
									e.data.names;
								this.telParentPage.onDecreaseExpelTime(
									e.data.delay
								);
							} else this.destroy();
						})
					);
				})
			);
	}

	onDecreaseExpelTime(t: number) {
		var i = "Players";
		undefined !== this.list_of_players_to_expel &&
			(i = this.list_of_players_to_expel.join(", "));
		if ($("fireplayer_confirm")) {
			$("fireplayer_confirm")!.innerHTML =
				e.string.substitute(
					__(
						"lang_mainsite",
						"${players} will be expelled in ${delay} seconds"
					),
					{ players: i, delay: t }
				);
			this.fireDlgStatus = "timer";
			if (0 == t) {
				$("fireplayer_confirm")!.innerHTML =
					e.string.substitute(
						__(
							"lang_mainsite",
							"Expel ${players} now"
						),
						{ players: i }
					);
				this.fireDlgStatus = "expel";
			} else
				setTimeout(
					e.hitch(this, function () {
						this.onDecreaseExpelTime(t - 1);
					}),
					1e3
				);
		}
	}

	onMove() {}
	onNextMove(e: BGA.ID) {
		g_archive_mode && this.initCommentsForMove(e);
		this.fireDlg && this.fireDlg.destroy();
	}

	initArchiveIndex() {
		g_gamelogs;
		// @ts-ignore - Reduce gameglogs down to the record of notifs
		"object" == typeof g_gamelogs && g_gamelogs.data && (g_gamelogs = g_gamelogs.data.data);
		this.notifqueue.last_packet_id;
		for (var e = true; e; ) {
			this.next_archive_index;
			if ((g_gamelogs as Record<BGA.ID, BGA.NotifsPacket>)[this.next_archive_index])
				if (
					toint(
						(g_gamelogs as Record<BGA.ID, BGA.NotifsPacket>)[this.next_archive_index]!
							.packet_id
					) > toint(this.notifqueue.last_packet_id)
				) {
					this.next_archive_index;
					e = false;
				} else this.next_archive_index++;
			else {
				console.error("Can't find the initial logs");
				this.showMessage(
					"Error during game archive initialization",
					"error"
				);
				e = false;
			}
		}
	}

	sendNextArchive() {
		if (-1 == this.next_archive_index) {
			this.showMessage(
				__("lang_mainsite", "End of game"),
				"info"
			);
			this.archive_playmode = "stop";
			this.onLastArchivePlayed();
			return false;
		}
		if (this.notifqueue.queue.length > 0) {
			this.notifqueue.dispatchNotifications();
			return true;
		}
		var t = (g_gamelogs as Record<BGA.ID, BGA.NotifsPacket>)[this.next_archive_index];
		if (t) {
			this.next_archive_index;
			t.data = t.data.filter(
				(e) => "switchToTurnbased" !== e.type
			);
			e.query(".dijitDialog").forEach(e.destroy);
			e.query(".dijitDialogUnderlayWrapper").forEach(
				e.destroy
			);
			e.query(".standard_popin").forEach(e.destroy);
			e.query(".standard_popin_underlay").forEach(
				e.destroy
			);
			var i = false;
			if ("/table" != t.channel.substr(0, 6)) {
				if (
					// @ts-ignore - Is this a typeo?
					t.channel != this.private_channel &&
					t.channel != "/player/p" + this.player_id
				) {
					this.next_archive_index++;
					this.sendNextArchive();
					return true;
				}
				t.move_id && (i = true);
			}
			if (!i && "nextlog" != this.archive_playmode) {
				t.data.push({
					args: {},
					bIsTableMsg: true,
					lock_uuid: "dummy",
					log: "",
					type: "archivewaitingdelay",
					uid:
						"archivewaitingdelay" +
						this.archive_uuid,
				} as any);
				t.data.push({
					args: {},
					bIsTableMsg: true,
					lock_uuid: "dummy",
					log: "",
					type: "end_archivewaitingdelay",
					uid:
						"archivewaitingdelay" +
						(this.archive_uuid + 1),
				} as any);
			}
			$("move_nbr")!.innerHTML;
			this.notifqueue.onNotification(t);
			this.next_archive_index++;
			this.archive_uuid += 2;
			if (t.move_id) {
				$("replaylogs_progression_" + t.move_id) &&
					this.slideToObjectPos(
						"archivecursor",
						"replaylogs_progression_" + t.move_id,
						-30,
						-23
					).play();
				$("replaylogs_move_" + t.move_id) &&
					e.addClass(
						"replaylogs_move_" + t.move_id,
						"viewed"
					);
			}
			i && this.sendNextArchive();
			return true;
		}
		this.next_archive_index = -1;
		this.showMessage(
			__("lang_mainsite", "End of game"),
			"info"
		);
		this.archive_playmode = "stop";
		this.onLastArchivePlayed();
		return false;
	}

	onArchiveNext(e: MouseEvent) {
		e.preventDefault();
		this.notifqueue.bStopAfterOneNotif = false;
		this.clearArchiveCommentTooltip();
		if (
			$("move_nbr") &&
			toint($("move_nbr")!.innerHTML) > 0
		) {
			this.archive_gotomove =
				toint($("move_nbr")!.innerHTML) + 1;
			this.archive_playmode = "goto";
			this.sendNextArchive();
		} else {
			this.archive_playmode = "stop";
			this.sendNextArchive();
		}
	}

	onArchiveNextLog(e: MouseEvent) {
		e.preventDefault();
		this.doArchiveNextLog();
	}

	doArchiveNextLog() {
		if (null === this.notifqueue.waiting_from_notifend) {
			this.archive_playmode = "nextlog";
			this.notifqueue.bStopAfterOneNotif = true;
			this.notifqueue.log_notification_name = true;
			this.clearArchiveCommentTooltip();
			this.notifqueue.dispatchNotifications() ||
				this.sendNextArchive();
			delete this.notifqueue.log_notification_name;
		} else
			this.showMessage(
				_("A notification is still in progress"),
				"error"
			);
	}

	onArchiveNextTurn(e: MouseEvent) {
		e.preventDefault();
		this.notifqueue.bStopAfterOneNotif = false;
		this.clearArchiveCommentTooltip();
		this.archive_playmode = "nextturn";
		this.archive_previous_player =
			this.gamedatas!.gamestate.active_player!;
		this.sendNextArchive();
	}

	onArchiveHistory(t: MouseEvent) {
		e.stopEvent(t);
		var i = e.position("archivecursor");
		window.scrollBy({ top: i.y - 200 });
	}

	setModeInstataneous() {
		if (0 == this.instantaneousMode) {
			this.instantaneousMode = true;
			this.savedSynchronousNotif = e.clone(
				this.notifqueue.synchronous_notifs
			);
			e.style(
				"leftright_page_wrapper",
				"visibility",
				"hidden"
			);
			e.style("loader_mask", "display", "block");
			e.style("loader_mask", "opacity", 1);
			var t: keyof BGA.NotifTypes;
			for (t in this.notifqueue.synchronous_notifs)
				-1 != this.notifqueue.synchronous_notifs[t] &&
					(this.notifqueue.synchronous_notifs[t] = 1);
		}
	}

	unsetModeInstantaneous() {
		if (this.instantaneousMode) {
			this.instantaneousMode = false;
			e.style(
				"leftright_page_wrapper",
				"visibility",
				"visible"
			);
			e.style("loader_mask", "display", "none");
			var t: keyof BGA.NotifTypes;
			for (t in this.notifqueue.synchronous_notifs)
				-1 != this.notifqueue.synchronous_notifs[t] &&
					(this.notifqueue.synchronous_notifs[t] =
						this.savedSynchronousNotif![t]!);
		}
	}

	onLastArchivePlayed() {
		this.unsetModeInstantaneous();
	}

	onArchiveToEnd(e: MouseEvent) {
		e.preventDefault();
		this.notifqueue.bStopAfterOneNotif = false;
		this.setModeInstataneous();
		this.archive_playmode = "play";
		this.sendNextArchive();
	}

	onArchiveToEndSlow(e: MouseEvent) {
		e.preventDefault();
		this.notifqueue.bStopAfterOneNotif = false;
		this.archive_playmode = "play";
		this.sendNextArchive();
	}

	onArchiveGoTo(t: MouseEvent) {
		t.preventDefault();
		var i = '<div id="archive_goto_menu">';
		undefined !== this.bEnabledArchiveAdvancedFeatures &&
			(i +=
				"<p><a href='#' id='go_to_game_end'>" +
				_("Go to end of game (fast)") +
				"</a></p><hr/>");
		i +=
			"<p><a href='#' id='go_to_game_end_slow'>" +
			_("Go to end of game") +
			"</a></p><hr/>";
		i +=
			"<p><a href='#' id='go_to_new_turn'>" +
			_("Go to next player's turn") +
			"</a></p><hr/>";
		undefined !== this.bEnabledArchiveAdvancedFeatures &&
			(i +=
				"<p><a href='#' id='go_to_specific_move'>" +
				_("Go to specific move (fast)") +
				"</a></p><hr/>");
		i +=
			"<p><a href='#' id='go_to_specific_move_slow'>" +
			_("Go to specific move") +
			"</a></p>";
		i += "</div>";
		if (undefined === this.archiveGotoMenu) {
			this.archiveGotoMenu = new dijit.TooltipDialog({
				id: "goto_menu",
				content: i,
				closable: true,
			});
			dijit.popup.open({
				popup: this.archiveGotoMenu,
				around: $("archive_end_game")!,
				orient: [
					"below",
					"below-alt",
					"above",
					"above-alt",
				],
			});
			e.query<Element>(".dijitTooltipDialogPopup").style(
				"zIndex",
				String(1055)
			);
			e.query<Element>("#archive_goto_menu a").connect(
				"onclick",
				this,
				function (e) {
					dijit.popup.close(this.archiveGotoMenu);
					this.archiveGotoMenu!.destroy();
					delete this.archiveGotoMenu;
				}
			);
			$("go_to_game_end") &&
				e.connect(
					$("go_to_game_end")!,
					"onclick",
					this,
					"onArchiveToEnd"
				);
			e.connect(
				$("go_to_game_end_slow")!,
				"onclick",
				this,
				"onArchiveToEndSlow"
			);
			e.connect(
				$("go_to_new_turn")!,
				"onclick",
				this,
				"onArchiveNextTurn"
			);
			$("go_to_specific_move") &&
				e.connect(
					$("go_to_specific_move")!,
					"onclick",
					this,
					e.hitch(this, function (t) {
						this.askForValueDialog(
							_(
								"Enter the move you want to go to"
							),
							e.hitch(this, function (e) {
								"" != e &&
									this.archiveGoToMove(
										toint(e)!,
										true
									);
							})
						);
					})
				);
			e.connect(
				$("go_to_specific_move_slow")!,
				"onclick",
				this,
				e.hitch(this, function (t) {
					this.askForValueDialog(
						_("Enter the move you want to go to"),
						e.hitch(this, function (e) {
							"" != e &&
								this.archiveGoToMove(e, false);
						})
					);
				})
			);
		} else {
			dijit.popup.close(this.archiveGotoMenu);
			this.archiveGotoMenu.destroy();
			delete this.archiveGotoMenu;
		}
	}

	onEndDisplayLastArchive() {
		switch (this.archive_playmode) {
			case "stop":
				return;
			case "nextturn":
				this.gamedatas!.gamestate.active_player !=
					this.archive_previous_player &&
				"activeplayer" == this.gamedatas!.gamestate.type as BGA.GameState_Interface['type']
					? (this.archive_playmode = "stop")
					: this.sendNextArchive();
				break;
			case "play":
				this.sendNextArchive();
				break;
			case "goto":
				if (-1 != this.next_archive_index) {
					var t = (g_gamelogs as Record<BGA.ID, BGA.NotifsPacket>)[this.next_archive_index];
					if (undefined !== t)
						if (t.move_id) {
							toint(t.move_id) <=
								this.archive_gotomove! &&
								this.sendNextArchive();
							toint(t.move_id) >=
								this.archive_gotomove! &&
								this.unsetModeInstantaneous();
						} else this.sendNextArchive();
				}
				break;
			case "nextcomment":
				if ($("newArchiveComment")) {}
				else {
					var i = e.query(".archiveComment").length;
					this.getCommentsViewedFromStart() >= i
						? this.showMessage(
								__(
									"lang_mainsite",
									"No more comments"
								),
								"info"
						  )
						: this.sendNextArchive();
				}
		}
	}

	onArchiveGoToMoveDisplay() {
		e.style(
			"archive_go_to_move_control",
			"display",
			"inline-block"
		);
		e.style("archive_go_to_move", "display", "none");
	}

	archiveGoToMove(e: BGA.ID, t: boolean) {
		if (toint(e) <= toint($("move_nbr")!.innerHTML))
			this.insertParamIntoCurrentURL("goto", toint(e));
		else {
			this.notifqueue.bStopAfterOneNotif = false;
			this.archive_gotomove = toint(e);
			this.archive_playmode = "goto";
			t && this.setModeInstataneous();
			this.sendNextArchive();
		}
	}

	showArchiveComment(t: 'saved' | 'edit' | any, i?: number) {
		null !== this.archiveCommentNew &&
			"do_not_show_only_infos" != t &&
			this.clearArchiveCommentTooltip();
		"saved" == t && (i = 0);
		"edit" == t
			? e.addClass("ebd-body", "archivecommentmode_edit")
			: e.removeClass(
					"ebd-body",
					"archivecommentmode_edit"
			  );
		var n = false;
		if (undefined !== i) {
			var o = $("move_nbr")!.innerHTML,
				a = e.query<HTMLElement>(".archiveComment_move" + o);
			if ("saved" == t) a = e.query<HTMLElement>(".archiveComment");
			else if ("edit" == t || "displayid" == t) {
				a = e.query<HTMLElement>("#archiveComment_" + i);
				i = 0;
			}
			if (!a[i]) return false;
			var s = a[i]!.id,
				r = e.query<HTMLElement>(
					"#" + s + " .archiveComment_author"
				);
			if (!r[0]) return false;
			var l = e.query<HTMLElement>(
				"#" + s + " .archiveComment_anchor"
			);
			if (!l[0]) return false;
			var d = e.query<HTMLElement>("#" + s + " .archiveComment_text");
			if (d[0]) {
				var c = e.query<HTMLElement>(
					"#" + s + " .archiveComment_uid"
				);
				if (!c[0]) return false;
				var h = e.query<HTMLElement>(
					"#" + s + " .archiveComment_no"
				);
				if (h[0]) {
					if ("do_not_show_only_infos" == t)
						return { notif_uid: c[0].innerHTML };
					n = true;
					this.archiveCommentLastDisplayedNo =
						h[0].innerHTML as BGA.ID;
					this.archiveCommentLastDisplayedId =
						s.substr(15) as BGA.ID;
				}
			}
			var u = 0,
				p = e.query<HTMLElement>(
					"#" + s + " .archiveComment_continuemode"
				);
			p[0] && (u = Number(p[0]!.innerHTML));
			var m = 0,
				g = e.query<HTMLElement>(
					"#" + s + " .archiveComment_displaymode"
				);
			g[0] && (m = Number(g[0]!.innerHTML));
			var f = "",
				v = e.query<HTMLElement>(
					"#" + s + " .archiveComment_pointers"
				);
			v[0] && (f = v[0]!.innerHTML);
			let _f = f.split(" ");
			var b: string | null = null;
			for (var y in _f)
				if (null === b)
					b = _f[y]!;
				else {
					var w =_f[y]!;
					if ($(b))
						if (isNaN(Number(w))) {
							var C = w.split("/");
							if (3 == C.length) {
								var k = atob(C[0]!),
									x = C[1],
									T = C[2];
								$(b)!.setAttribute("datasrc", k);
								this.archiveCommentAttachImageToElement(
									$(b)!,
									x,
									T
								);
							}
						} else {
							var A =
								'<div id="tuto_pointer_' +
								b +
								'" class="archiveCommentPointed archiveCommentPointed' +
								w +
								'"><div class="archiveCommentPointed_inner"></div></div>';
							e.place(A, $(b)!);
							"static" ==
								e.style(b, "position") &&
								e.style(
									b,
									"position",
									"relative"
								);
							"visible" !=
								e.style(b, "overflow") &&
								e.style(
									b,
									"overflow",
									"visible"
								);
						}
					b = null;
				}
			e.addClass(s, "commentviewed");
		}
		var j = n ? d![0]!.innerHTML : "";
		j = j.replace(new RegExp("ARCHIVECOMMENT_", "g"), "");
		var S = n
				? r![0]!.innerHTML
				: $("archiveViewerName")!.innerHTML,
			E = false;
		n &&
			(E =
				$("archiveViewerName")!.innerHTML ==
				r![0]!.innerHTML);
		var N = e.query(".archiveComment").length,
			M = this.getCommentsViewedFromStart(),
			D = n ? this.archiveCommentLastDisplayedId : 0;
		if ("display" == t && undefined !== i && N >= 2) {
			2 == M &&
				analyticsPush({
					game_name: this.game_name,
					event: "tutorial_start",
				});
			M == N &&
				analyticsPush({
					game_name: this.game_name,
					event: "tutorial_complete",
				});
			if (M >= 2) {
				(M - 1) / (N - 1) >= 0.05 &&
					(M - 2) / (N - 1) < 0.05 &&
					analyticsPush({
						game_name: this.game_name,
						progress_level: "5%",
						event: "tutorial_progress",
					});
				(M - 1) / (N - 1) >= 0.25 &&
					(M - 2) / (N - 1) < 0.25 &&
					analyticsPush({
						game_name: this.game_name,
						progress_level: "25%",
						event: "tutorial_progress",
					});
				(M - 1) / (N - 1) >= 0.5 &&
					(M - 2) / (N - 1) < 0.5 &&
					analyticsPush({
						game_name: this.game_name,
						progress_level: "50%",
						event: "tutorial_progress",
					});
				(M - 1) / (N - 1) >= 0.75 &&
					(M - 2) / (N - 1) < 0.75 &&
					analyticsPush({
						game_name: this.game_name,
						progress_level: "75%",
						event: "tutorial_progress",
					});
			}
		}
		var I = __("lang_mainsite", "Next comment");
		if ("view" == g_tutorialwritten!.mode) {
			I = __("lang_mainsite", "Continue");
			"archiveComment_intro" == String(s!) &&
				(I = __("lang_mainsite", "Start"));
		}
		A =
			"<div id='newArchiveComment' class='newArchiveComment'>                            <div class='archiveAuthor' style='display:none'>" +
			S +
			":</div>                            <div class='archiveComment_before'><p class='archiveComment_before_inner'><i class='fa fa-graduation-cap'></i></p></div>                            <div id='newArchiveCommentMove' class='icon20 icon20_move'></div>                            <textarea id='newArchiveCommentText' maxlength='" +
			this.tuto_textarea_maxlength +
			"'>" +
			j +
			"</textarea>                            <div id='newArchiveCommentOptions'>                                <select id='newArchiveCommentContinueMode'>                                    <option value='0'>" +
			__(
				"lang_mainsite",
				"Player must click on Continue button to continue."
			) +
			"</option>                                    <option value='1'>" +
			__(
				"lang_mainsite",
				"Player must DO the next game action with the game interface to continue."
			) +
			"</option>                                </select><br/>                                <select id='newArchiveCommentDisplayMode'>                                    <option value='0'>" +
			__(
				"lang_mainsite",
				"Display this comment with an arrow to the linked item."
			) +
			"</option>                                    <option value='1'>" +
			__(
				"lang_mainsite",
				"Display this comment centered over the linked item."
			) +
			"</option>                                </select><br/>                                <a id='newArchiveCommentAdditionalImage' href='#'><i class='fa fa-picture-o fa-2x'></i></a>                                 <a id='newArchiveCommentShowHelp' href='#'><i class='fa fa-info-circle fa-2x' ></i></a>                            </div>                            <div id='newArchiveCommentContinueModeWarning'><i class='fa fa-warning'></i> " +
			e.string.substitute(
				__(
					"lang_mainsite",
					"Do not forget to explain to the player which action to do in the text above. Note that the very next action in the replay MUST have been played by ${player}."
				),
				{
					player:
						"<b>" +
						$("archiveViewerName")!.innerHTML +
						"</b>",
				}
			) +
			"</div>                            <div id='newArchiveCommentHelp'><p>" +
			__(
				"lang_mainsite",
				"Note : you can click on any game element to highlight it when this step is displayed."
			) +
			"</p><p>" +
			__("lang_mainsite", "Available markup") +
			" :<br/>&nbsp;*text in bold*<br/>&nbsp;[red]text in red[/red]<br/>&nbsp;[green]text in green[/green]<br/>&nbsp;[blue]text in blue[/blue]<br/>&nbsp;!!! => <i class='fa fa-exclamation-triangle'></i><br/>&nbsp;[tip] => <i class='fa fa-lightbulb-o'></i><br/>&nbsp;[img]URL[/img] => Display an image. Tip: you may use <a href='https://snipboard.io/'>Snipboard.io</a> to upload an image, and then copy/paste the URL.<br/></p></div>                            <div id='newArchiveCommentTextDisplay'>" +
			this.applyArchiveCommentMarkup(j) +
			"</div>                            <div id='newArchiveCommentMoveHelp'>" +
			__(
				"lang_mainsite",
				"Place your mouse cursor on a game element to attach this comment"
			) +
			":</div>                            <div id='newArchiveCommentControls' class='newArchiveCommentControls'>                                <a class='bgabutton bgabutton_gray' href='#' id='newArchiveCommentCancel'><span>" +
			__("lang_mainsite", "Cancel") +
			"</span></a>                                <a class='bgabutton bgabutton_blue' href='#' id='newArchiveCommentSave'><span>" +
			__("lang_mainsite", "Save") +
			"</span></a>                                <a class='bgabutton bgabutton_blue' href='#' id='newArchiveCommentSaveModify_" +
			D +
			"'><span>" +
			__("lang_mainsite", "Save") +
			"</span></a>                            </div>                            <div id='newArchiveCommentDisplayControls'><a href='#' id='newArchiveCommentDelete' class='bgabutton bgabutton_gray'>" +
			__("lang_mainsite", "Delete") +
			"</a> <a href='#' id='newArchiveCommentModify' class='bgabutton bgabutton_gray'>" +
			__("lang_mainsite", "Modify") +
			"</a>&nbsp;&nbsp;<span class='newArchiveCommentNo'>" +
			M +
			"/" +
			N +
			"&nbsp;&nbsp; </span><a href='#' id='newArchiveCommentNext' class='bgabutton bgabutton_blue'>" +
			I +
			"</a></div><a href='#' id='newArchiveCommentMinimize' class='standard_popin_closeicon'><i class='fa fa-minus-square-o fa-lg'></i></a>                        </div>";
		this.archiveCommentNew = new dijit.TooltipDialog({
			id: "newArchiveComment",
			content: A,
			closable: true,
		});
		var L = n ? l![0]!.innerHTML : "page-title",
			P = false,
			R = null;
		if (
			!$(L) ||
			"page-title" == L ||
			"archivecontrol_editmode_centercomment" == L
		) {
			L = "archivecontrol_editmode_centercomment";
			R = "game_play_area";
			P = true;
		}
		if (1 == m!) {
			P = true;
			R = L;
		}
		if (P) {
			var O = e.position(R!);
			if ("game_play_area" == R) {
				var B = O.w! / 2 - 215;
				dijit.popup.open({
					popup: this.archiveCommentNew,
					x: 50,
					y: 180,
					orient: this.archiveCommentPosition,
				});
			} else {
				B = O.x! + O.w! / 2 - 215;
				var H = O.y! - O.h! / 2;
				dijit.popup.open({
					popup: this.archiveCommentNew,
					x: B,
					y: H,
					orient: "above-centered",
				});
			}
			this.archiveCommentNewAnchor =
				"archivecontrol_editmode_centercomment";
			this.archiveCommentMobile = {
				id: D as BGA.ID,
				anchor: R!,
				bCenter: P,
				lastX: B,
				lastY: 200,
			};
			e.query(".dijitTooltipConnector").style(
				"display",
				"none"
			);
		} else {
			dijit.popup.open({
				popup: this.archiveCommentNew,
				around: $(L)!,
				orient: this.archiveCommentPosition,
			});
			this.archiveCommentNewAnchor = "page-title";
			var F = e.position(L);
			this.archiveCommentMobile = {
				id: D,
				anchor: L,
				bCenter: P,
				lastX: F.x,
				lastY: F.y,
			};
			e.query(".dijitTooltipConnector").style(
				"display",
				"block"
			);
		}
		e.query(".dijitTooltipDialogPopup").addClass(
			"scale-in-center"
		);
		e.connect(
			$("newArchiveCommentContinueMode")!,
			"onchange",
			this,
			"onArchiveCommentContinueModeChange"
		);
		e.connect(
			$("newArchiveCommentDisplayMode")!,
			"onchange",
			this,
			"onArchiveCommentDisplayModeChange"
		);
		e.connect(
			$("newArchiveCommentMinimize")!,
			"onclick",
			this,
			"onArchiveCommentMinimize"
		);
		if (1 == u!) {
			$<HTMLInputElement>("newArchiveCommentContinueMode")!.value = String(1);
			e.place(
				'<span class="smalltext" id="do_action_to_continue">' +
					__(
						"lang_mainsite",
						"Do the action to continue"
					) +
					"</span>",
				"newArchiveCommentNext",
				"after"
			);
			e.destroy("newArchiveCommentNext");
		}
		1 == m! && ($<HTMLInputElement>("newArchiveCommentDisplayMode")!.value = String(1));
		this.archiveCommentMobile.timeout = setTimeout(
			e.hitch(this, "onRepositionPopop"),
			10
		);
		if ("edit" == t) {
			this.addTooltip(
				"newArchiveCommentMove",
				"",
				__(
					"lang_mainsite",
					"Attach this comment somewhere else"
				)
			);
			this.addTooltip(
				"newArchiveCommentAdditionalImage",
				"",
				__("lang_mainsite", "Add image on interface")
			);
			this.addTooltip(
				"newArchiveCommentShowHelp",
				"",
				__("lang_mainsite", "Show tips")
			);
			e.style(
				"newArchiveCommentMinimize",
				"display",
				"none"
			);
			e.style(
				"newArchiveCommentDisplayControls",
				"display",
				"none"
			);
			e.style(
				"newArchiveCommentTextDisplay",
				"display",
				"none"
			);
			e.style(
				"newArchiveCommentShowHelp",
				"display",
				"inline"
			);
			e.style(
				"newArchiveCommentAdditionalImage",
				"display",
				"inline"
			);
			e.style("newArchiveCommentHelp", "display", "none");
			e.addClass(
				"newArchiveComment",
				"newArchiveCommentEdit"
			);
			e.connect(
				$("newArchiveCommentCancel")!,
				"onclick",
				this,
				"onNewArchiveCommentCancel"
			);
			e.connect(
				$("newArchiveCommentMove")!,
				"onmousedown",
				this,
				"onNewArchiveCommentStartDrag"
			);
			e.connect(
				$("newArchiveCommentShowHelp")!,
				"onclick",
				this,
				e.hitch(this, function (t) {
					e.stopEvent(t);
					e.style(
						"newArchiveCommentShowHelp",
						"display",
						"none"
					);
					e.style(
						"newArchiveCommentHelp",
						"display",
						"block"
					);
				})
			);
			e.connect(
				$("newArchiveCommentAdditionalImage")!,
				"onclick",
				this,
				e.hitch(this, function (t) {
					e.stopEvent(t);
					this.askForValueDialog(
						_(
							"Please enter the URL of the image you want to add"
						),
						e.hitch(this, function (e) {
							if (this.validURL(e)) {
								this.archiveCommentImageToAnchor =
									e;
								this.showMessage(
									_(
										"Please click now on the game interface element where you want to anchor this image."
									),
									"info"
								);
							} else this.showMessage(_("Sorry this is not a valid image URL."), "error");
						}),
						e.string.substitute(
							_(
								"Tips: you may use ${url} to upload an image, and then copy/paste the URL."
							),
							{
								url: '<a href="https://snipboard.io/">Snipboard.io</a>',
							}
						)
					);
					e.style(
						"popin_askforvalue_dialog",
						"zIndex",
						String(1001)
					);
				})
			);
			$("newArchiveCommentText")!.focus();
			if ("" != $<HTMLInputElement>("newArchiveCommentText")!.value) {
				var z = $<HTMLInputElement>("newArchiveCommentText")!.value,
					q = new RegExp(
						"\\[img\\](http:|https:)\\/\\/.*?\\/data\\/tutorials\\/(.*?)\\[\\/img\\]",
						"g"
					);
				z = z.replace(q, "[img]$2[/img]");
				var W =
					$<HTMLInputElement>("newArchiveCommentText")!.value.length -
					z.length;
				W > 0 &&
					($<HTMLInputElement>("newArchiveCommentText")!.maxLength =
						this.tuto_textarea_maxlength + W);
			}
			if (n) {
				e.style(
					"newArchiveCommentSave",
					"display",
					"none"
				);
				this.archiveCommentNewAnchor = l![0]!.innerHTML;
				e.connect(
					$("newArchiveCommentSaveModify_" + D)!,
					"onclick",
					this,
					"onNewArchiveCommentSaveModify"
				);
			} else {
				e.style(
					"newArchiveCommentSaveModify_" + D,
					"display",
					"none"
				);
				e.connect(
					$("newArchiveCommentSave")!,
					"onclick",
					this,
					"onNewArchiveCommentSave"
				);
			}
			this.onArchiveCommentContinueModeChange();
			this.archiveCommentPointElementMouseEnterEvt =
				e.connect(
					window,
					"mouseover",
					this,
					"onArchiveCommentPointElementOnMouseEnter"
				);
		} else if (
			"display" == t ||
			"saved" == t ||
			"displayid" == t
		) {
			e.addClass(
				"newArchiveComment",
				"newArchiveCommentDisplay"
			);
			e.style(
				"newArchiveCommentControls",
				"display",
				"none"
			);
			e.style("newArchiveCommentMove", "display", "none");
			e.style(
				"newArchiveCommentMinimize",
				"display",
				"block"
			);
			e.style("newArchiveCommentText", "display", "none");
			e.style(
				"newArchiveCommentContinueMode",
				"display",
				"none"
			);
			e.style(
				"newArchiveCommentDisplayMode",
				"display",
				"none"
			);
			e.style(
				"newArchiveCommentOptions",
				"display",
				"none"
			);
			e.style("newArchiveCommentHelp", "display", "none");
			e.style(
				"newArchiveCommentShowHelp",
				"display",
				"none"
			);
			e.style(
				"newArchiveCommentAdditionalImage",
				"display",
				"none"
			);
			if (E && "view" != g_tutorialwritten!.mode) {
				e.connect(
					$("newArchiveCommentDelete")!,
					"onclick",
					this,
					"onNewArchiveCommentDelete"
				);
				e.connect(
					$("newArchiveCommentModify")!,
					"onclick",
					this,
					"onNewArchiveCommentModify"
				);
			} else {
				e.style(
					"newArchiveCommentDelete",
					"display",
					"none"
				);
				e.style(
					"newArchiveCommentModify",
					"display",
					"none"
				);
			}
			$("newArchiveCommentNext") &&
				e.connect(
					$("newArchiveCommentNext")!,
					"onclick",
					this,
					"onNewArchiveCommentNext"
				);
		}
		if ("conclusion" == D) {
			this.tutoratingDone = false;
			e.query(".tuto_rating").style("cursor", "pointer");
			e.query<Element>(".tuto_rating").connect(
				"onmouseenter",
				this,
				"onTutoRatingEnter"
			);
			e.query<Element>(".tuto_rating").connect(
				"onmouseleave",
				this,
				"onTutoRatingLeave"
			);
			e.query<Element>(".tuto_rating").connect(
				"onclick",
				this,
				"onTutoRatingClick"
			);
			e.style(
				"newArchiveCommentMinimize",
				"display",
				"none"
			);
			e.style("newArchiveComment", "textAlign", "center");
			e.destroy("newArchiveCommentNext");
			e.style(
				"newArchiveCommentDisplayControls",
				"display",
				"none"
			);
			$("end_tutorial_play_now") &&
				e.connect(
					$("newArchiveCommentTextDisplay")!,
					"onclick",
					this,
					function () {
						window.location.href = $<HTMLAnchorElement>(
							"end_tutorial_play_now"
						)!.href;
					}
				);
			e.query(".tuto_rating").length > 0 &&
				(this.bTutorialRatingStep = true);
		}
		if (
			"view" == g_tutorialwritten!.mode &&
			$("newArchiveCommentNext")
		) {
			e.connect(
				$("newArchiveComment")!,
				"onclick",
				this,
				"onNewArchiveCommentNext"
			);
			e.addClass(
				"newArchiveComment",
				"archiveCommentClickable"
			);
		}
		return true;
	}

	getCommentsViewedFromStart() {
		return e.query(".archiveComment.commentviewed").length;
	}

	onArchiveCommentMinimize(t: MouseEvent) {
		e.stopEvent(t);
		clearTimeout(this.archiveCommentMobile.timeout);
		e.style(
			"archiveCommentMinimizedIcon",
			"display",
			"block"
		);
		this.placeOnObject(
			"archiveCommentMinimizedIcon",
			"newArchiveComment"
		);
		this.slideToObjectPos(
			"archiveCommentMinimizedIcon",
			"archiveCommentMinimized",
			10,
			0
		).play();
		dijit.popup.close(this.archiveCommentNew!);
	}

	onArchiveCommentMaximize(t: MouseEvent) {
		e.stopEvent(t);
		this.showArchiveComment(
			"display",
			this.archiveCommentNo
		);
		e.style(
			"archiveCommentMinimizedIcon",
			"display",
			"none"
		);
	}

	applyArchiveCommentMarkup(e: string) {
		e = this.addSmileyToText(e);
		e = this.applyCommentMarkup(e);
		e = this.nl2br(e, false);
		var t = new RegExp(
			"\\[img\\]((http:|https:)\\/\\/.*?\\.jpg)\\[\\/img\\]",
			"g"
		);
		e = e.replace(
			t,
			'<img src="$1" style="max-width:100%;margin-top:10px;margin-bottom:10px;">'
		);
		t = new RegExp(
			"\\[img\\]((http:|https:)\\/\\/.*?\\.jpeg)\\[\\/img\\]",
			"g"
		);
		e = e.replace(
			t,
			'<img src="$1" style="max-width:100%;margin-top:10px;margin-bottom:10px;">'
		);
		t = new RegExp(
			"\\[img\\]((http:|https:)\\/\\/.*?\\.png)\\[\\/img\\]",
			"g"
		);
		e = e.replace(
			t,
			'<img src="$1" style="max-width:100%;margin-top:10px;margin-bottom:10px;">'
		);
		t = new RegExp(
			"\\[img\\]((http:|https:)\\/\\/.*?)\\[\\/img\\]",
			"g"
		);
		return (e = e.replace(
			t,
			"[img]Sorry we support only .jpg and .png images[/img]"
		));
	}

	onArchiveCommentPointElementOnMouseEnter(t: MouseEvent) {
		if (
			t.target &&
			(t.target as Element).id &&
			"archiveCommentElementPointerTarget" !=
				(t.target as Element).id &&
			"archiveCommentElementPointerTargetInner" !=
				(t.target as Element).id &&
			(undefined === this.archiveCommentDraggingInProgress ||
				!this.archiveCommentDraggingInProgress)
		) {
			for (var i = false, n: Element = t.target as Element; null != n; ) {
				n.id && "game_play_area" == n.id && (i = true);
				n.id && "page-title" == n.id && (i = true);
				n.id && "player_boards" == n.id && (i = true);
				n = n.parentNode as Element;
			}
			if (i) {
				var o = e.position(t.target as Element);
				if (!(o.w! > 300 && o.h! > 300)) {
					$("archiveCommentElementPointerTarget") ||
						e.place(
							'<div id="archiveCommentElementPointerTarget"><div id="archiveCommentElementPointerTargetInner"></div></div>',
							"page-content"
						);
					e.style(
						"archiveCommentElementPointerTargetInner",
						"width",
						o.w + "px"
					);
					e.style(
						"archiveCommentElementPointerTargetInner",
						"height",
						o.h + "px"
					);
					"static" == e.style(t.target as Element, "position") &&
						e.style(
							t.target as Element,
							"position",
							"relative"
						);
					"visible" !=
						e.style(t.target as Element, "overflow") &&
						e.style(
							t.target as Element,
							"overflow",
							"visible"
						);
					this.attachToNewParentNoReplace(
						"archiveCommentElementPointerTarget",
						t.target as HTMLElement,
						"first"
					);
					e.connect(
						$(
							"archiveCommentElementPointerTargetInner"
						)!,
						"onclick",
						this,
						"onArchiveCommentPointElementClick"
					);
					this.addTooltip(
						"archiveCommentElementPointerTargetInner",
						"",
						__(
							"lang_mainsite",
							"Click to highlight / unhighlight this element"
						)
					);
					this.archiveCommentPointElementMouseEnterItem =
						(t.target as Element).id;
				}
			}
		}
	}

	removeArchiveCommentPointElement() {
		e.disconnect(
			this.archiveCommentPointElementMouseEnterEvt!
		);
		this.archiveCommentPointElementMouseEnterEvt = null;
		e.destroy("archiveCommentElementPointerTarget");
	}

	archiveCommentAttachImageToElement(t: HTMLElement, i?: string, n?: string) {
		var o = t.getAttribute("datasrc")!,
			a = t.id + "_attached_webcommentimage";
		if (o.match(/.(jpg|jpeg|png)$/i))
			s =
				'<img id="' +
				a +
				'" src="' +
				o +
				'" class="archiveCommentAttachedImage"></img>';
		else
			var s =
				'<img id="' +
				a +
				'" src="' +
				getStaticAssetUrl(
					"img/mainsite/unsupported_types.jpg"
				) +
				'"  class="archiveCommentAttachedImage"></img>';
		e.place(s, t);
		e.connect(
			$(a)!,
			"onload",
			e.hitch(this, function () {
				if (undefined !== i && undefined !== n) {
					e.style(a, "left", i + "px");
					e.style(a, "top", n + "px");
				} else this.placeOnObject(a, t);
				var o = new ebg.draggable();
				o.create(this, a, a);
				this.bMustRemoveArchiveCommentImage = false;
				o.onStartDragging = e.hitch(this, function () {
					e.style(
						"archivecontrol_editmode",
						"display",
						"none"
					);
					e.style(
						"archivecontrol_editmode_dropcommentimage",
						"display",
						"block"
					);
					e.connect(
						$(
							"archivecontrol_editmode_dropcommentimage"
						)!,
						"mouseenter",
						e.hitch(this, function () {
							this.bMustRemoveArchiveCommentImage =
								false;
						})
					);
					e.connect(
						$(
							"archivecontrol_editmode_dropcommentimage"
						)!,
						"mouseleave",
						e.hitch(this, function () {
							this.bMustRemoveArchiveCommentImage =
								true;
						})
					);
				});
				o.onEndDragging = e.hitch(this, function (t) {
					e.style(
						"archivecontrol_editmode",
						"display",
						"block"
					);
					e.style(
						"archivecontrol_editmode_dropcommentimage",
						"display",
						"none"
					);
					this.bMustRemoveArchiveCommentImage &&
						e.destroy(t);
				});
			})
		);
	}

	onArchiveCommentPointElementClick(t: MouseEvent) {
		e.stopEvent(t);
		if (
			undefined !== this.archiveCommentImageToAnchor &&
			this.validURL(this.archiveCommentImageToAnchor)
		) {
			e.addClass(
				this.archiveCommentPointElementMouseEnterItem!,
				"archiveCommentPointedImage"
			);
			$(
				this.archiveCommentPointElementMouseEnterItem
			)!.setAttribute(
				"datasrc",
				this.archiveCommentImageToAnchor
			);
			this.archiveCommentAttachImageToElement(
				$(this.archiveCommentPointElementMouseEnterItem)!
			);
		} else {
			var i = e
					.query<Element>(".tuto_pointer.selected")[0]!
					.id.split("_")[2],
				n =
					this
						.archiveCommentPointElementMouseEnterItem;
			if (
				e.query("#" + n + " .archiveCommentPointed" + i)
					.length > 0
			)
				e.query(
					"#" + n + " .archiveCommentPointed"
				).forEach(e.destroy);
			else {
				e.query(
					"#" + n + " .archiveCommentPointed"
				).forEach(e.destroy);
				var o =
					'<div id="tuto_pointer_' +
					n +
					'" class="archiveCommentPointed archiveCommentPointed' +
					i +
					'"><div class="archiveCommentPointed_inner"></div></div>';
				e.place(
					o,
					this.archiveCommentPointElementMouseEnterItem!
				);
			}
		}
	}

	onArchiveCommentContinueModeChange(t?: Event) {
		if (String(0) == $<HTMLInputElement>("newArchiveCommentContinueMode")!.value)
			e.style(
				"newArchiveCommentContinueModeWarning",
				"display",
				"none"
			);
		else {
			e.style(
				"newArchiveCommentContinueModeWarning",
				"display",
				"block"
			);
			if (!this.isCurrentPlayerActive()) {
				alert(
					e.string.substitute(
						__(
							"lang_mainsite",
							"You can choose this option only if this is the turn of ${player}."
						),
						{
							player: $("archiveViewerName")!
								.innerHTML,
						}
					)
				);
				$<HTMLInputElement>("newArchiveCommentContinueMode")!.value = String(0);
				this.onArchiveCommentContinueModeChange();
			}
		}
	}

	onArchiveCommentDisplayModeChange(e: Event) {
		$<HTMLInputElement>("newArchiveCommentDisplayMode")!.value;
	}

	onTutoRatingEnter(t: MouseEvent) {
		if (!this.tutoratingDone) {
			for (
				var i = (t.currentTarget as Element).id.substr(11) as BGA.ID, n = 1;
				n <= Number(i);
				n++
			) {
				e.removeClass("tutorating_" + n, "fa-star-o");
				e.addClass("tutorating_" + n, "fa-star");
			}
			for (; n <= 5; n++) {
				e.removeClass("tutorating_" + n, "fa-star");
				e.addClass("tutorating_" + n, "fa-star-o");
			}
			1 == toint(i)
				? ($("rating_explanation")!.innerHTML = __(
						"lang_mainsite",
						"I still don't know how to play this game ..."
				  ))
				: 2 == toint(i)
				? ($("rating_explanation")!.innerHTML = __(
						"lang_mainsite",
						"I'm not really sure I can play this game."
				  ))
				: 3 == toint(i)
				? ($("rating_explanation")!.innerHTML = __(
						"lang_mainsite",
						"Imperfect, but at least I know how to play."
				  ))
				: 4 == toint(i)
				? ($("rating_explanation")!.innerHTML = __(
						"lang_mainsite",
						"Good tutorial."
				  ))
				: 5 == toint(i) &&
				  ($("rating_explanation")!.innerHTML = __(
						"lang_mainsite",
						"Perfect tutorial!"
				  ));
		}
	}

	onTutoRatingLeave(t: MouseEvent) {
		if (!this.tutoratingDone) {
			for (var i = 1; i <= 5; i++) {
				e.removeClass("tutorating_" + i, "fa-star");
				e.addClass("tutorating_" + i, "fa-star-o");
			}
			$("rating_explanation")!.innerHTML = "&nbsp;";
		}
	}

	onTutoRatingClick(t: MouseEvent) {
		e.stopEvent(t);
		this.tutoratingDone = true;
		var i = (t.currentTarget as Element).id.substr(11) as BGA.ID;
		this.ajaxcall(
			"/archive/archive/rateTutorial.html",
			{
				id: g_tutorialwritten!.id,
				rating: i,
				move: toint($("move_nbr")!.innerHTML),
			},
			this,
			function (e) {
				this.showMessage(
					__(
						"lang_mainsite",
						"Thanks for your feedback"
					),
					"info"
				);
				window.location.href = `/gamepanel?game=${this.game_name}#quick-play`;
			},
			function (e) {
				e && (this.tutoratingDone = false);
			}
		);
	}

	onRepositionPopop() {
		if ($(this.archiveCommentMobile.anchor))
			if (this.archiveCommentMobile.bCenter) {
				e.query(".dijitTooltipConnector").style(
					"display",
					"none"
				);
				if (
					"game_play_area" ==
					this.archiveCommentMobile.anchor
				) {}
				else {
					var t = e.position(
							this.archiveCommentMobile.anchor
						),
						i =
							(e
								.query(
									".dijitTooltipDialogPopup"
								)
								.style("height"),
							t.x + t.w! / 2 - 215),
						n = t.y - t.h! / 2;
					dijit.popup.close(this.archiveCommentNew!);
					dijit.popup.open({
						popup: this.archiveCommentNew!,
						x: i,
						y: n,
						orient: "above-centered",
					});
					(o = e.position(
						this.archiveCommentMobile.anchor
					)).x != this.archiveCommentMobile.lastX ||
					o.y != this.archiveCommentMobile.lastY
						? (this.archiveCommentMobile.timeout =
								setTimeout(
									e.hitch(
										this,
										"onRepositionPopop"
									),
									200
								))
						: (this.archiveCommentMobile.timeout =
								setTimeout(
									e.hitch(
										this,
										"onRepositionPopop"
									),
									1e3
								));
				}
			} else {
				e.query(".dijitTooltipConnector").style(
					"display",
					"block"
				);
				dijit.popup.close(this.archiveCommentNew!);
				dijit.popup.open({
					popup: this.archiveCommentNew!,
					around: $(this.archiveCommentMobile.anchor)!,
					orient: this.archiveCommentPosition,
				});
				var o;
				(o = e.position(
					this.archiveCommentMobile.anchor
				)).x != this.archiveCommentMobile.lastX ||
				o.y != this.archiveCommentMobile.lastY
					? (this.archiveCommentMobile.timeout =
							setTimeout(
								e.hitch(
									this,
									"onRepositionPopop"
								),
								200
							))
					: (this.archiveCommentMobile.timeout =
							setTimeout(
								e.hitch(
									this,
									"onRepositionPopop"
								),
								1e3
							));
			}
	}

	clearArchiveCommentTooltip() {
		clearTimeout(this.archiveCommentMobile.timeout);
		if (null !== this.archiveCommentNew) {
			this.archiveCommentNew.destroy();
			dijit.popup.close(this.archiveCommentNew);
			this.archiveCommentNew = null;
		}
		this.removeArchiveCommentAssociatedElements();
	}

	removeArchiveCommentAssociatedElements() {
		e.query(".archiveCommentPointed").forEach(e.destroy);
		e.query(".archiveCommentAttachedImage").forEach(
			e.destroy
		);
		e.query(".archiveCommentPointedImage").removeClass(
			"archiveCommentPointedImage"
		);
		e.style(
			"archiveCommentMinimizedIcon",
			"display",
			"none"
		);
	}

	onArchiveAddComment(e: MouseEvent) {
		e.preventDefault();
		this.showArchiveComment("edit");
	}

	onNewArchiveCommentCancel(t: MouseEvent) {
		e.stopEvent(t);
		this.removeArchiveCommentPointElement();
		this.removeArchiveCommentAssociatedElements();
		this.archiveCommentNew!.destroy();
		this.archiveCommentNew = null;
		this.showArchiveComment(
			"display",
			this.archiveCommentNo
		);
	}

	onNewArchiveCommentSave(t: MouseEvent) {
		e.stopEvent(t);
		this.removeArchiveCommentPointElement();
		this.newArchiveCommentSave();
	}

	newArchiveCommentSave() {
		var t = $<HTMLInputElement>("newArchiveCommentText")!.value;
		"" != t &&
			this.ajaxcall(
				"/archive/archive/addArchiveComment.html",
				{
					table: this.table_id!,
					viewpoint: this.player_id!,
					move: toint($("move_nbr")!.innerHTML),
					text: t,
					anchor: this.archiveCommentNewAnchor,
					aftercomment: this.archiveCommentLastDisplayedNo!,
					afteruid: g_last_msg_dispatched_uid,
					continuemode: $<HTMLInputElement>(
						"newArchiveCommentContinueMode"
					)!.value,
					displaymode: $<HTMLInputElement>(
						"newArchiveCommentDisplayMode"
					)!.value,
					pointers: this.getArchiveCommentsPointers(),
				},
				this,
				function (t) {
					$<HTMLInputElement>("newArchiveCommentText")!.value = "";
					e.place(t, "archiveComments", "first");
					this.archiveCommentNo++;
					this.showArchiveComment("saved");
					e.style(
						"publishtutorial_block",
						"display",
						e.query(".archiveComment").length > 0
							? "block"
							: "none"
					);
					if (this.tutorialShowOnce(23)) {
						var i = _("About making tutorials"),
							n = _(
								"Using game replays and comments, you can build tutorials for games on Board Game Arena!"
							);
						n += "<br/><br/>";
						n += e.string.substitute(
							_(
								"Before you start, please read carefully ${our_guidelines} to make sure your tutorial has a chance to be selected."
							),
							{
								our_guidelines:
									'<a href="/tutorialfaq" target="_blank">' +
									_("our guidelines") +
									"</a>",
							}
						);
						this.infoDialog(n, i);
					}
				}
			);
	}

	onNewArchiveCommentSaveModify(t: MouseEvent) {
		e.stopEvent(t);
		this.removeArchiveCommentPointElement();
		var i = (t.currentTarget as Element).id.substr(28) as BGA.ID;
		this.newArchiveCommentSaveModify(i);
	}

	newArchiveCommentSaveModify(t: BGA.ID) {
		var i = $<HTMLInputElement>("newArchiveCommentText")!.value;
		"" != i &&
			this.ajaxcall(
				"/archive/archive/updateArchiveComment.html",
				{
					comment_id: t,
					text: i,
					anchor: this.archiveCommentNewAnchor,
					continuemode: $<HTMLInputElement>(
						"newArchiveCommentContinueMode"
					)!.value,
					displaymode: $<HTMLInputElement>(
						"newArchiveCommentDisplayMode"
					)!.value,
					pointers: this.getArchiveCommentsPointers(),
				},
				this,
				function (i) {
					$<HTMLInputElement>("newArchiveCommentText")!.value = "";
					e.place(
						i,
						"archiveComment_" +
							this.archiveCommentLastDisplayedId,
						"replace"
					);
					this.showArchiveComment("displayid", Number(t));
				}
			);
	}

	getArchiveCommentsPointers() {
		var t = "";
		e.query<HTMLElement>(".archiveCommentPointed").forEach(function (e) {
			var i = e.className.split(" ");
			for (var n in i) {
				var o = i[n]!;
				if (
					"archiveCommentPointed" == o.substr(0, 21)
				) {
					var a = o.substr(21);
					"" == a ||
						isNaN(Number(a)) ||
						(t += (e.parentNode as Element).id + " " + a + " ");
				}
			}
		});
		e.query<Element>(".archiveCommentAttachedImage").forEach(
			function (i) {
				var n = btoa(i.getAttribute("src")!),
					o = Math.round(Number(e.style(i, "left"))),
					a = Math.round(Number(e.style(i, "top")));
				t +=
					(i.parentNode as Element).id +
					" " +
					n +
					"/" +
					o +
					"/" +
					a +
					" ";
			}
		);
		return t;
	}

	onKeyPressTutorial(t: KeyboardEvent): false | void {
		if (t.keyCode == e.keys.SPACE) {
			e.stopEvent(t);
			return false;
		}
	}

	onKeyUpTutorial(t: KeyboardEvent): false | void {
		if (t.keyCode == e.keys.SPACE) {
			if (null !== $("newArchiveCommentNext")) {
				e.stopEvent(t);
				this.doNewArchiveCommentNext();
				return false;
			}
			if ($("do_action_to_continue")) {
				this.showMessage(
					__(
						"lang_mainsite",
						"You must do the action to continue the tutorial"
					),
					"error"
				);
				return;
			}
		}
	}

	onNewArchiveCommentNext(t: MouseEvent) {
		e.stopEvent(t);
		this.doNewArchiveCommentNext();
	}

	doNewArchiveCommentNext() {
		if (this.checkLock(true)) {
			this.notifqueue.bStopAfterOneNotif = false;
			if (
				this.notifqueue.queue.length > 0 &&
				"archivewaitingdelay" ==
					this.notifqueue.queue[0]!.type
			) {
				this.notifqueue.queue.shift();
				this.notifqueue.queue.shift();
			}
			this.archiveCommentNo++;
			this.clearArchiveCommentTooltip();
			if (this.checkIfArchiveCommentMustBeDisplayed()) {}
			else {
				var t = e.query(".archiveComment").length;
				if (this.getCommentsViewedFromStart() >= t) {
					this.showMessage(
						__("lang_mainsite", "No more comments"),
						"info"
					);
					this.doArchiveNextLog();
				} else {
					this.archive_playmode = "nextcomment";
					this.sendNextArchive();
				}
			}
		} else this.bJumpToNextArchiveOnUnlock = true;
	}

	onNewArchiveCommentDelete(t: MouseEvent) {
		e.stopEvent(t);
		this.confirmationDialog(
			__("lang_mainsite", "Are you sure?"),
			e.hitch(this, function () {
				this.ajaxcall(
					"/archive/archive/deleteArchiveComment.html",
					{ id: this.archiveCommentLastDisplayedId as BGA.ID },
					this,
					function (i) {
						this.showMessage(
							__("lang_mainsite", "Done"),
							"info"
						);
						this.removeArchiveCommentPointElement();
						$(
							"gamelog_archiveComment_" +
								this
									.archiveCommentLastDisplayedId
						)
							? e.destroy(
									"gamelog_archiveComment_" +
										this
											.archiveCommentLastDisplayedId
							  )
							: e.destroy(
									"archiveComment_" +
										this
											.archiveCommentLastDisplayedId
							  );
						this.archiveCommentNo--;
						this.onNewArchiveCommentNext(t);
					}
				);
			})
		);
		e.query(".dijitDialog").style("zIndex", String(1010));
	}

	onNewArchiveCommentModify(t: MouseEvent) {
		e.stopEvent(t);
		this.showArchiveComment(
			"edit",
			Number(this.archiveCommentLastDisplayedId)
		);
	}

	onNewArchiveCommentStartDrag(t: MouseEvent) {
		e.addClass("overall-content", "disable_selection");
		e.style("newArchiveCommentControls", "display", "none");
		e.style("newArchiveCommentMove", "display", "none");
		e.style(
			"newArchiveCommentMoveHelp",
			"display",
			"block"
		);
		e.style("archivecontrol_editmode", "display", "none");
		e.style(
			"archivecontrol_editmode_centercomment",
			"display",
			"block"
		);
		e.query(".dijitTooltipConnector").style(
			"display",
			"block"
		);
		this.addCommentDragMouseUpLink = e.connect(
			$("ebd-body")!,
			"onmouseup",
			this,
			"onNewArchiveCommentEndDrag"
		);
		this.addCommentDragMouseOverLink = e.connect(
			$("ebd-body")!,
			"onmousemove",
			this,
			"onNewArchiveCommentDrag"
		);
		this.archiveCommentDraggingInProgress = true;
	}

	onNewArchiveCommentEndDrag(t: MouseEvent) {
		this.archiveCommentDraggingInProgress = false;
		e.removeClass("overall-content", "disable_selection");
		e.disconnect(this.addCommentDragMouseUpLink);
		e.disconnect(this.addCommentDragMouseOverLink);
		e.query(".newArchiveCommentMouseOver").removeClass(
			"newArchiveCommentMouseOver"
		);
		e.style(
			"newArchiveCommentControls",
			"display",
			"block"
		);
		e.style("newArchiveCommentMove", "display", "block");
		e.style("newArchiveCommentMoveHelp", "display", "none");
		e.style("archivecontrol_editmode", "display", "block");
		e.style(
			"archivecontrol_editmode_centercomment",
			"display",
			"none"
		);
		if (
			"archivecontrol_editmode_centercomment" ==
			this.archiveCommentMobile.anchor
		) {
			dijit.popup.close(this.archiveCommentNew!);
			dijit.popup.open({
				popup: this.archiveCommentNew!,
				x: 50,
				y: 180,
				orient: this.archiveCommentPosition,
			});
		} else this.onArchiveCommentPointElementOnMouseEnter(t);
		this.archiveCommentMobile.id;
	}

	onNewArchiveCommentDrag(t: MouseEvent) {
		(t.target as Element).id;
		for (var i = t.target as HTMLElement; !i.id; ) i = i.parentNode as HTMLElement;
		if (
			i.id &&
			!e.hasClass(i, "newArchiveCommentMouseOver")
		) {
			dijit.popup.close(this.archiveCommentNew!);
			e.query(".newArchiveCommentMouseOver").removeClass(
				"newArchiveCommentMouseOver"
			);
			e.addClass(i, "newArchiveCommentMouseOver");
			dijit.popup.open({
				popup: this.archiveCommentNew!,
				around: i,
				orient: this.archiveCommentPosition,
			});
			this.archiveCommentMobile.anchor = i.id;
			this.archiveCommentNewAnchor = i.id;
			this.archiveCommentMobile.bCenter =
				"archivecontrol_editmode_centercomment" == i.id;
		}
	}

	initCommentsForMove(e: BGA.ID) {
		this.archiveCommentNo = 0;
		this.archiveCommentLastDisplayedNo = 0;
		this.clearArchiveCommentTooltip();
	}

	onEndOfNotificationDispatch() {
		if (
			g_archive_mode &&
			this.checkIfArchiveCommentMustBeDisplayed() &&
			"nextcomment" == this.archive_playmode
		) {
			this.notifqueue.bStopAfterOneNotif = true;
			this.unlockInterface(this.interface_locked_by_id!);
		}
	}

	checkIfArchiveCommentMustBeDisplayed() {
		var e = this.showArchiveComment(
				"do_not_show_only_infos",
				this.archiveCommentNo
			) as { notif_uid: string | number; } | undefined,
			t = $("move_nbr")!.innerHTML;
		if (e && undefined !== e.notif_uid) {
			if (0 == e.notif_uid) {
				this.showArchiveComment(
					"display",
					this.archiveCommentNo
				);
				return true;
			}
			if (g_last_msg_dispatched_uid == e.notif_uid) {
				var i =
					t +
					"_" +
					this.archiveCommentNo +
					"_" +
					e.notif_uid;
				if (
					undefined !==
					this.archiveCommentAlreadyDisplayed[i]
				)
					return false;
				this.archiveCommentAlreadyDisplayed[i] = true;
				this.showArchiveComment(
					"display",
					this.archiveCommentNo
				);
				return true;
			}
		}
		return false;
	}

	onHowToTutorial(t: MouseEvent) {
		e.stopEvent(t);
		this.clearArchiveCommentTooltip();
		window.open("/tutorialfaq", "_blank");
	}

	onTutoPointerClick(t: MouseEvent) {
		e.stopEvent(t);
		e.query(".tuto_pointer.selected").removeClass(
			"selected"
		);
		e.addClass((t.currentTarget as Element).id, "selected");
	}

	onPublishTutorial(t: MouseEvent) {
		e.stopEvent(t);
		this.clearArchiveCommentTooltip();
		$("publishTuto") && e.destroy("publishTuto");
		if ("private" != this.game_status)
			if ("terramystica" != this.game_name) {
				this.publishTuto = new ebg.popindialog();
				this.publishTuto.create("publishTuto");
				this.publishTuto.setTitle(
					__("lang_mainsite", "Publish as tutorial")
				);
				this.publishTuto.setMaxWidth(600);
				var i = '<div id="publishTuto">';
				i +=
					"<p>" +
					__(
						"lang_mainsite",
						"This game and your comments will be proposed to beginners as a tutorial to learn this game."
					) +
					"</p>";
				i += "<br/>";
				i +=
					"<p>" +
					e.string.substitute(
						__(
							"lang_mainsite",
							"Before this, expert players (Gurus) will review your tutorial, evaluate it, and check that it respects <a href='${guidelines}' target='_blank'>BGA tutorial guidelines</a>."
						) + "</p>",
						{ guidelines: "/tutorialfaq" }
					);
				i += "<br/>";
				i +=
					'<input id="tuto_lang" type="checkbox"></input> ' +
					e.string.substitute(
						__(
							"lang_mainsite",
							"My tutorial is written in English."
						),
						{ guidelines: "/tutorialfaq" }
					);
				i += "<br/>";
				i +=
					'<input id="tuto_guidelines" type="checkbox"></input> ' +
					e.string.substitute(
						__(
							"lang_mainsite",
							"My tutorial respects <a href='${guidelines}' target='_blank'>BGA tutorial guidelines</a>."
						),
						{ guidelines: "/tutorialfaq" }
					);
				i += "<br/>";
				i += "<br/>";
				i += '<p id="publish_conclusion"></p>';
				i +=
					'<a id="closepublish_btn" class="bgabutton bgabutton_gray">' +
					__("lang_mainsite", "Close") +
					"</a> ";
				i +=
					'<a id="publishTuto_btn" class="bgabutton bgabutton_blue">' +
					__("lang_mainsite", "Publish as tutorial") +
					"</a>";
				i += "</div>";
				this.publishTuto.setContent(i);
				this.publishTuto.show();
				e.connect(
					$("closepublish_btn")!,
					"onclick",
					e.hitch(this, function () {
						"" !==
							$("publish_conclusion")!.innerHTML &&
							// @ts-ignore - Function expects no arguments.
							window.location.reload(false);
						this.publishTuto!.destroy();
					})
				);
				e.connect(
					$("publishTuto_btn")!,
					"onclick",
					e.hitch(this, function () {
						$<HTMLInputElement>("tuto_lang")!.checked &&
						$<HTMLInputElement>("tuto_guidelines")!.checked
							? this.ajaxcall(
									"/archive/archive/publishTutorial.html",
									{
										id: this.table_id!,
										intro: "",
										lang: "en",
										viewpoint: this.player_id!,
									},
									this,
									function (t) {
										this.showMessage(
											__(
												"lang_mainsite",
												"Done"
											),
											"info"
										);
										var i =
											window.location
												.href +
											"&tutorial";
										i = i.replace(
											"#&tutorial",
											"&tutorial"
										);
										$(
											"publish_conclusion"
										)!.innerHTML =
											__(
												"lang_mainsite",
												"You can test the tutorial from the following URL (or send it to friends for review) :"
											) +
											'<br/><a target="_blank" href="' +
											i +
											'">' +
											i +
											"</a>";
										e.destroy(
											"publishTuto_btn"
										);
									},
									function () {},
									"post"
							  )
							: this.showMessage(
									_(
										"You must check all the checkboxes"
									),
									"error"
							  );
					})
				);
			} else
				this.showMessage(
					__(
						"lang_mainsite",
						"Sorry, but for legal reasons we cannot propose tutorial for this game on BGA."
					),
					"error"
				);
		else
			this.showMessage(
				__(
					"lang_mainsite",
					"You cannot publish a tutorial for a game in Alpha"
				),
				"error"
			);
	}

	onQuitTutorial(t: MouseEvent) {
		e.stopEvent(t);
		if (
			undefined !== this.bTutorialRatingStep &&
			this.bTutorialRatingStep
		)
			this.showMessage(
				__(
					"lang_mainsite",
					"Please rate this tutorial to quit and return to BGA."
				),
				"error"
			);
		else {
			analyticsPush({
				game_name: this.game_name,
				event: "tutorial_quit",
			});
			window.location.href = `/gamepanel?game=${this.game_name}#quick-play`;
		}
	}

	loadReplayLogs() {
		var t = this.getReplayLogNode()!;
		e.empty(t);
		if ("public" == g_tutorialwritten!.status) {
			e.place(
				'<div class="row"><div id="replaylogs" class="col-md-8"></div><div id="tutorial_stats" class="col-md-4"><h4>' +
					__("lang_mainsite", "Tutorial statistics") +
					"</h4></div></div>",
				t
			);
			var i = "";
			i +=
				'<div class="row-data"><div class="row-label">Unique view</div><div class="row-value">' +
				g_tutorialwritten!.stats.viewed +
				"</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">Recent (<2 months)</div><div class="row-value">' +
				g_tutorialwritten!.stats.recentviewed +
				"</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">Average rating</div><div class="row-value">' +
				Math.round(
					10 * g_tutorialwritten!.stats.rating
				) /
					10 +
				" / 5</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">Viewed duration</div><div class="row-value">' +
				(null === g_tutorialwritten!.stats.duration
					? "-"
					: g_tutorialwritten!.stats.duration) +
				" mn</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></div><div class="row-value">' +
				g_tutorialwritten!.stats.rating5 +
				"</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></div><div class="row-value">' +
				g_tutorialwritten!.stats.rating4 +
				"</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></div><div class="row-value">' +
				g_tutorialwritten!.stats.rating3 +
				"</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-star"></i><i class="fa fa-star"></i></div><div class="row-value">' +
				g_tutorialwritten!.stats.rating2 +
				"</div></div>";
			i +=
				'<div class="row-data"><div class="row-label">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-star"></i></div><div class="row-value">' +
				g_tutorialwritten!.stats.rating1 +
				"</div></div>";
			var n: BGA.ID;
			for (n in g_tutorialwritten!.stats.steps) {
				var o = g_tutorialwritten!.stats.steps[n]!,
					a = Math.round(
						(100 * o) /
							Number(g_tutorialwritten!.stats.recentviewed)
					);
				i +=
					'<div class="row-data"><div class="row-label">Abandon on move ' +
					n +
					'</div><div class="row-value">' +
					o +
					" (" +
					a +
					"%)</div></div>";
			}
			e.place(i, "tutorial_stats");
		} else
			e.place(
				'<div class="row"><div class="col-md-1"></div><div id="replaylogs" class="col-md-10"></div></div>',
				t
			);
		var s = "",
			r = "",
			l = null,
			d: BGA.ID | null = ((i = ""), null),
			c = false,
			h = "";
		i +=
			'<div id="archivecursor"><i class="fa fa-caret-right fa-3x" aria-hidden="true"></i></div>';
		var u: BGA.ID;
		// @ts-ignore - Is this a typeo?
		for (u in g_gamelogs) {
			var p = (g_gamelogs as Record<BGA.ID, BGA.NotifsPacket>)[u]!,
				m = true;
			"/table" != p.channel.substr(0, 6) &&
				// @ts-ignore - Is this a typeo?
				(p.channel == this.private_channel ||
					p.channel == "/player/p" + this.player_id ||
					(m = false));
			if (m) {
				null !== p.move_id &&
					null !== l &&
					l != p.move_id &&
					(i += "</div>");
				var g = false;
				if (null !== p.move_id && l != p.move_id) {
					g = true;
					l = p.move_id;
					h = "";
					Number(p.move_id) <=
						toint($("move_nbr")!.innerHTML) &&
						(h = " viewed ");
					var f =
						'<div id="replaylogs_move_' +
						p.move_id +
						'" class="replaylogs_move ' +
						h +
						'"><div class="replaylogs_progression"><div id="replaylogs_progression_' +
						p.move_id +
						'" class="replaylogs_progression_bottom"></div></div><div class="smalltext">' +
						__("lang_mainsite", "Move") +
						" " +
						p.move_id +
						" :";
					if (undefined !== p.time) {
						var _ = new Date(1e3 * p.time);
						r = _.toLocaleDateString();
						f +=
							r != s
								? '<span style="float: right">' +
								  r +
								  " " +
								  _.toLocaleTimeString() +
								  "</span></div>"
								: '<span style="float: right">' +
								  _.toLocaleTimeString() +
								  "</span></div>";
					} else
						f +=
							'<span style="float: right">' +
							p.data[0]!.time +
							" GMT+1</span></div>";
					c = false;
				}
				for (var v in p.data) {
					var b = p.data[v]!;
					if ("" != b.log) {
						if (!c) {
							c = true;
							i += f!;
						}
						i +=
							'<div class="gamelogreview whiteblock">' +
							this.format_string_recursive(
								b.log,
								b.args!
							) +
							"</div>";
					}
				}
				if (c) {
					s = r;
					"" != h && (d = p.move_id!);
				}
				g &&
					e
						.query(
							".archiveComment_move" + p.move_id
						)
						.forEach(
							e.hitch(this, function (t) {
								if (!c) {
									c = true;
									i += f;
								}
								i +=
									'<div class="gamelogreview gamelog_archivecomment whiteblock"><i class="fa fa-graduation-cap" style="float:left;margin-right:8px;"></i>' +
									t.outerHTML +
									'<i class="fa fa-trash"></i></div>';
								e.destroy(t);
							})
						);
			}
		}
		null !== l && (i += "</div>");
		e.place(i, "replaylogs");
		e.query<Element>(".replaylogs_move").connect(
			"onclick",
			this,
			"onReplayLogClick"
		);
		if (null !== d) {
			this.archiveCursorPos = d;
			this.replaceArchiveCursor();
		}
		e.query<Element>(".own_comment").forEach(function (t) {
			e.addClass(t.parentNode as Element, "own_comment");
			(t.parentNode as Element).id = "gamelog_" + t.id;
		});
		e.query<Element>(".own_comment .archiveComment_text").connect(
			"onclick",
			this,
			"onEditReplayLogsComment"
		);
		e.query<Element>(".archiveComment").connect(
			"onclick",
			this,
			function (t) {
				e.stopEvent(t);
			}
		);
		e.query<Element>(".gamelog_archivecomment .fa-trash").connect(
			"onclick",
			this,
			"onRemoveReplayLogsComment"
		);
	}

	replaceArchiveCursor() {
		this.slideToObjectPos(
			"archivecursor",
			"replaylogs_progression_" + this.archiveCursorPos,
			-30,
			-23
		).play();
	}

	onEditReplayLogsComment(t: MouseEvent) {
		e.stopEvent(t);
		var i = (t.currentTarget as Element).id.substr(20);
		e.place(
			'<div id="replaylogs_edit_inplace_' +
				i +
				'" class="replaylogs_edit_inplace"><textarea  id="replaylogs_edit_text_' +
				i +
				'">' +
				(t.currentTarget as Element).innerHTML +
				'</textarea><br/><div id="replaylogs_edit_save_' +
				i +
				'" class="bgabutton bgabutton_blue">' +
				__("lang_mainsite", "Save") +
				"</div></div>",
			(t.currentTarget as Element).id,
			"after"
		);
		e.style((t.currentTarget as Element).id, "display", "none");
		e.connect(
			$("replaylogs_edit_save_" + i)!,
			"onclick",
			this,
			"onEditReplayLogsCommentSave"
		);
	}

	onRemoveReplayLogsComment(t: MouseEvent) {
		e.stopEvent(t);
		var i = ((t.currentTarget as Element).parentNode as Element).id.substr(23) as BGA.ID;
		this.confirmationDialog(
			__("lang_mainsite", "Are you sure?"),
			e.hitch(this, function () {
				this.ajaxcall(
					"/archive/archive/deleteArchiveComment.html",
					{ id: i },
					this,
					function (t) {
						this.showMessage(
							__("lang_mainsite", "Done"),
							"info"
						);
						e.destroy(
							"gamelog_archiveComment_" + i
						);
					}
				);
			})
		);
	}

	onEditReplayLogsCommentSave(t: MouseEvent) {
		e.stopEvent(t);
		var i = (t.currentTarget as Element).id.substr(21) as BGA.ID,
			n = $<HTMLInputElement>("replaylogs_edit_text_" + i)!.value;
		"" == n ||
			this.ajaxcall(
				"/archive/archive/updateArchiveComment.html",
				{ comment_id: i, text: n, anchor: "" },
				this,
				function (t) {
					e.style(
						"archiveComment_text_" + i,
						"display",
						"block"
					);
					$("archiveComment_text_" + i)!.innerHTML = n;
					e.destroy("replaylogs_edit_inplace_" + i);
				}
			);
	}

	onReplayLogClick(t: MouseEvent) {
		e.stopEvent(t);
		var i = (t.currentTarget as Element).id.substr(16) as BGA.ID;
		if (toint(i) - 1 < toint($("move_nbr")!.innerHTML))
			this.insertParamIntoCurrentURL("goto", Number(i) - 1);
		else if (
			toint(i) - 1 ==
			toint($("move_nbr")!.innerHTML)
		) {}
		else {
			$<HTMLInputElement>("archive_go_to_move_nbr")!.value = String(Number(i) - 1);
			this.archive_gotomove = toint(Number(i) - 1);
			this.archive_playmode = "goto";
			this.sendNextArchive();
		}
	}

	ensureImageLoading() {
		for (var t in g_img_preload) {
			var i = g_img_preload[t];
			if ("" != i) {
				var n = new Image();
				e.connect(n, "onload", this, "onLoadImageOk");
				e.connect(n, "onerror", this, "onLoadImageNok");
				var o = g_gamethemeurl + "img/" + i;
				this.images_loading_status[o] = false;
				n.src = g_gamethemeurl + "img/" + i;
			}
		}
	}

	ensureSpecificImageLoading(t: string[]) {
		for (var i in t) {
			var n = t[i];
			if ("" != n) {
				var o = new Image();
				e.connect(o, "onerror", this, "onLoadImageNok");
				o.src = getStaticAssetUrl(
					"img/" + this.game_name + "/" + n
				);
			}
		}
	}

	onLoadImageOk(e: Event) {
		var t = decodeURIComponent((e.target as HTMLImageElement).src);
		if (undefined !== this.images_loading_status[t]) {
			this.images_loading_status[t] = true;
			this.updateLoaderPercentage();
		}
	}

	onLoadImageNok(e: Event) {
		this.showMessage(
			__("lang_mainsite", "Can't load image:") +
				' <a href="' +
				(e.currentTarget as HTMLImageElement).src +
				'" target="_blank">' +
				(e.currentTarget as HTMLImageElement).src +
				"</a><br/>" +
				__(
					"lang_mainsite",
					"Please check your connexion or hard-refresh this web page (Ctrl+F5)"
				),
			"error"
		);
	}

	updateLoaderPercentage() {
		if ("undefined" == typeof g_replayFrom) {
			var e = 0,
				t = 0;
			for (var i in this.images_loading_status) {
				e++;
				this.images_loading_status[i] && t++;
			}
			if (0 == e) var n = 90;
			else n = (90 * t) / e;
			var o = 0;
			1 == this.log_history_loading_status.downloaded &&
				(o =
					0 == this.log_history_loading_status.total
						? 100
						: (this.log_history_loading_status
								.loaded /
								this.log_history_loading_status
									.total) *
						  100);
			this.setLoader(10 + n, o);
		}
	}

	displayTableWindow(t: BGA.ID, i: string, n: any, o: any, a:string, s: string) {
		undefined === o && (o = "");
		undefined === a && (a = "");
		if (undefined !== s) {
			a += "<br/><br/><div style='text-align: center'>";
			a +=
				"<a class='bgabutton bgabutton_blue' id='close_btn' href='#'><span>" +
				_(s) +
				"</span></a>";
			a += "</div>";
		}
		var r = new ebg.popindialog();
		r.create("tableWindow");
		r.setTitle(i);
		var l = "<div class='tableWindow'>";
		if ("object" == typeof o) {
			o.args = this.notifqueue.playerNameFilterGame(
				o.args
			);
			l += this.format_string_recursive(o.str, o.args);
		} else l += o;
		l += "<table>";
		for (var d in n) {
			var c = n[d]!;
			l += "<tr>";
			for (col_id in c) {
				var h = c[col_id];
				if ("object" == typeof h)
					if (h.str && h.args) {
						h.type && "header" == h.type
							? (l += "<th>")
							: (l += "<td>");
						h.args =
							this.notifqueue.playerNameFilterGame(
								h.args
							);
						l += this.format_string_recursive(
							h.str,
							h.args
						);
						h.type && "header" == h.type
							? (l += "</th>")
							: (l += "</td>");
					} else
						l +=
							"<td>invalid displayTable obj</td>";
				else l += "<td>" + h + "</td>";
			}
			l += "</tr>";
		}
		l += "</table>";
		l += a;
		l += "</div>";
		r.setContent(l);
		$("close_btn") &&
			e.connect(
				$("close_btn")!,
				"onclick",
				this,
				function (e) {
					e.preventDefault();
					r.destroy();
				}
			);
		r.show();
		return r;
	}

	updatePubBanner() {
		if (!g_archive_mode) {
			if (
				!this.isCurrentPlayerActive() &&
				!this.gameisalpha
			) {
				var t = e.query(".publisherannounce");
				if (0 == t.length) return;
				if (null === this.nextPubbanner)
					var i = Math.floor(
						Math.random() * t.length
					);
				else i = this.nextPubbanner % t.length;
				e.place(
					$("announce_" + i)!.innerHTML,
					"inactiveplayermessage",
					"only"
				);
				this.nextPubbanner!++;
			}
			if (
				!this.isCurrentPlayerActive() &&
				this.gameisalpha
			) {
				var n = '<div class="alphabanner">';
				n +=
					'  <div style="display:inline-block; vertical-align: middle;">';
				n +=
					'    <a href="#" class="emblemalpha emblemstatus emblemstatus_nofold" style="margin: 6px 8px 6px 8px;"></a>';
				n +=
					'  </div><div style="display:inline-block; vertical-align: middle;">';
				n +=
					'    <a target="_blank" href="' +
					this.metasiteurl +
					"/bug?id=0&table=" +
					this.table_id +
					'" class="bgabutton bgabutton_small bgabutton_small_margin bgabutton_blue">' +
					_("Report a bug") +
					"</a>";
				n +=
					'    <a target="_blank" href="' +
					this.metasiteurl +
					"/bug?id=0&table=" +
					this.table_id +
					'&suggest" class="bgabutton bgabutton_small bgabutton_small_margin bgabutton_blue">' +
					_("Make a suggestion") +
					"</a>";
				n += "    <br />";
				n +=
					'    <a target="_blank" href="' +
					this.metasiteurl +
					'/forum/viewtopic.php?f=240&t=17325" class="bgabutton bgabutton_small bgabutton_small_margin bgabutton_gray" style="margin-top: 0px;"> <i class="fa fa-info-circle"></i> ' +
					_("Guidelines") +
					"</a>";
				"" != this.game_group &&
					(n +=
						'    <a target="_blank" href="' +
						this.metasiteurl +
						"/group?id=" +
						this.game_group +
						'" class="bgabutton bgabutton_small bgabutton_small_margin bgabutton_gray" style="margin-top: 0px;"> <i class="fa fa-comment"></i> ' +
						_("Discuss") +
						"</a>");
				n += "  </div>";
				n += "</div>";
				e.place(n, "inactiveplayermessage", "only");
			}
		}
	}

	onSaveState(e: MouseEvent) {
		e.preventDefault();
		var t = (e.currentTarget as Element).id.substr(10);
		this.ajaxcall(
			"/table/table/debugSaveState.html",
			{ table: this.table_id!, state: t },
			this,
			function (e) {
				this.showMessage("Done", "info");
			}
		);
	}

	onLoadState(e: MouseEvent) {
		e.preventDefault();
		var t = (e.currentTarget as Element).id.substr(10);
		this.ajaxcall(
			"/table/table/loadSaveState.html",
			{ table: this.table_id!, state: t },
			this,
			function (e) {
				this.showMessage(
					"Done, reload in progress...",
					"info"
				);
				window.location.reload();
			}
		);
	}

	onLoadBugReport(e: MouseEvent) {
		e.preventDefault();
		var t = (document.getElementById(
			"debug_load_bug_report_id"
		) as HTMLInputElement).value;
		t && t.match(/^\d+$/)
			? this.ajaxcall(
					"/table/table/loadBugReport.html",
					{ table: this.table_id!, bugReportId: t as BGA.ID },
					this,
					function (e) {
						this.showMessage(
							"Done, reload in progress...",
							"info"
						);
						window.location.reload();
					}
			  )
			: this.showMessage("Invalid report id", "error");
	}

	onReloadCss(e: MouseEvent) {
		e.preventDefault();
		var t = document.getElementsByTagName("link");
		var i: HTMLLinkElement;
		// @ts-ignore - Why is this not working?
		for (i in t) {
			if (
				"stylesheet" === (i = t[i]!).rel &&
				i.href.includes("99999")
			) {
				var n = i.href.indexOf("?timestamp="),
					o = i.href;
				-1 !== n && (o = o.substring(0, n));
				i.href = o + "?timestamp=" + Date.now();
			}
		}
	}

	getScriptErrorModuleInfos() {
		return "U=" + this.player_id;
	}

	showTutorial() {}
	onCloseTutorial(t: MouseEvent) {
		e.stopEvent(t);
		e.destroy("tutorial_support");
	}

	onBeforeChatInput(t: any) {
		if (
			-1 !=
			(" " + t.msg.toLowerCase() + " ").indexOf(" bug ")
		) {
			var i =
				this.metasiteurl +
				"/bug?id=0&table=" +
				this.table_id;
			this.notifqueue.addChatToLog(
				"<b>" +
					e.string.substitute(
						__(
							"lang_mainsite",
							'Found a bug? Please report it using <a href="${url}">BGA bug reporting system</a>.'
						),
						{ url: i + '" target="_blank' }
					) +
					"</b>"
			);
		}
		return true;
	}

	showEliminated() {
		var t = new ebg.popindialog();
		t.create("eliminateDlg");
		t.setTitle(
			__("lang_mainsite", "You have been eliminated")
		);
		var i = '<div id="eliminateDlgContent">';
		i += "<div style='text-align: center'>";
		i +=
			"<p>" +
			__(
				"lang_mainsite",
				"You have been eliminated from this game."
			) +
			"</p><br/>";
		this.quickGameEnd
			? (i +=
					"<a href='" +
					this.metasiteurl +
					"/' class='bgabutton bgabutton_blue'>" +
					__("lang_mainsite", "Return to main site") +
					"</a><br/>" +
					__("lang_mainsite", "or") +
					"<br/>")
			: (i +=
					"<a href='" +
					this.metasiteurl +
					"/table?table=" +
					this.table_id +
					"' class='bgabutton bgabutton_blue'>" +
					__("lang_mainsite", "Return to main site") +
					"</a><br/>" +
					__("lang_mainsite", "or") +
					"<br/>");
		i +=
			"<a href='#' id='closeScoreDlg_btn_elim' onclick='return false;' class='bgabutton bgabutton_blue'>" +
			__("lang_mainsite", "Continue to watch the game") +
			"</a><br/>";
		this.blinkid &&
			"" != this.blinkid &&
			(i +=
				__("lang_mainsite", "or") +
				"<br/><a href='" +
				this.blinkid +
				"' target='_new' class='bgabutton bgabutton_blue'>" +
				this.blinkdomain +
				"</a>");
		i += "</div>";
		i += "</div>";
		t.setContent(i);
		t.show();
		e.connect(
			$("closeScoreDlg_btn_elim")!,
			"onclick",
			e.hitch(t, function () {
				e.destroy("eliminateDlgContent");
				this.destroy();
			})
		);
	}

	setLoader(t: number, i: number) {
		t = Math.round(t);
		i = Math.round(i);
		t < 8 && (t = 8);
		e.style("progress_bar_progress", "width", t + "%");
		e.style("game_box_loader_front_wrap", "width", t + "%");
		$("images_status_text")!.innerHTML =
			(null != $("loader_loading_art_text")
				? $("loader_loading_art_text")!.textContent
				: "Loading game art") +
			" (" +
			t +
			"%)";
		if (toint(t) >= 100) {
			var n = e.fadeOut({ node: "loader_mask" });
			e.connect(n, "onEnd", function () {
				e.style("loader_mask", "display", "none");
			});
			n.play();
		}
		$("log_history_status_text")!.innerHTML =
			(null != $("loader_loading_logs_text")
				? $("loader_loading_logs_text")!.textContent
				: "Loading game log history") +
			" (" +
			i +
			"%)";
		e.style(
			"log_history_progress_bar_progress",
			"width",
			i + "%"
		);
		toint(i) >= 100 &&
			e.style("log_history_status", "display", "none");
	}

	displayZombieBack() {
		e.style("zombieBack", "display", "block");
	}

	onZombieBack(t: MouseEvent) {
		e.stopEvent(t);
		this.confirmationDialog(
			__(
				"lang_mainsite",
				"You will get back into the game, but you will keep the penalty you received for quitting this game. Continue?"
			),
			e.hitch(this, function () {
				this.ajaxcall(
					`/${this.game_name}/${this.game_name}/zombieBack.html`,
					{},
					this,
					function (e) {}
				);
			})
		);
	}

	showNeutralizedGamePanel(t: BGA.ID, i: BGA.ID) {
		if (
			"block" !=
			e.style("neutralized_game_panel", "display")
		) {
			e.style(
				"neutralized_game_panel",
				"display",
				"block"
			);
			var n = "";
			n += "<div id='neutralized_explanation'>";
			n +=
				"<p>" +
				e.string.substitute(
					__(
						"lang_mainsite",
						"Player ${name} was out of time (or quit this game) and lost this game (at ${progression}% of the game progression)."
					),
					{
						name:
							"<b>" +
							(undefined ===
							this.gamedatas!.players[i]
								? "-inexistent player: " +
								  i +
								  "-"
								: this.gamedatas!.players[i]!
										.name) +
							"</b>",
						progression: Math.round(Number(t)),
					}
				);
			n += "</p>";
			if (e.hasClass("ebd-body", "training_mode"))
				n +=
					"<p>" +
					__(
						"lang_mainsite",
						"Training mode has been enabled for this table: no penalty will be applied."
					) +
					"</p>";
			else {
				n +=
					"<p>" +
					__(
						"lang_mainsite",
						"All other players will be considered winners."
					) +
					"</p>";
				n +=
					"<p>" +
					__(
						"lang_mainsite",
						"This may be frustrating, so quitting players gets a penalty on their Karma (☯). If you want to avoid this situation in the future, play with opponents with a good Karma."
					) +
					"</p>";
			}
			n += "</div>";
			this.player_id == i ||
				this.isSpectator ||
				(n += e.string.substitute(
					__(
						"lang_mainsite",
						"You may continue to play if you like, or ${quit} this game without any penalty."
					),
					{
						quit:
							'<div class="bgabutton bgabutton_blue" id="neutralized_quit">' +
							__("lang_mainsite", "quit") +
							"</div>",
					}
				));
			$("neutralized_game_panel")!.innerHTML = n;
			$("neutralized_quit") &&
				e.connect(
					$("neutralized_quit")!,
					"onclick",
					this,
					function () {
						this.ajaxcall(
							"/table/table/quitgame.html?src=panel",
							{
								table: this.table_id!,
								neutralized: true,
								s: "gameui_neutralized",
							},
							this,
							function (t) {
								if (
									"undefined" !=
										typeof bgaConfig &&
									bgaConfig.webrtcEnabled &&
									null !== this.room
								) {
									this.prepareMediaRatingParams();
									this.doLeaveRoom(
										e.hitch(
											this,
											function () {
												this.redirectToTablePage();
											}
										)
									);
								} else
									this.redirectToTablePage();
							}
						);
					}
				);
			if (
				this.player_id == i &&
				1 == this.gamedatas!.players[i]!.zombie
			) {
				this.expelledDlg = new ebg.popindialog();
				this.expelledDlg.create("expelledDlg");
				this.expelledDlg.setTitle(
					__("lang_mainsite", "You've been expelled")
				);
				n = "<div>";
				n +=
					"<p>" +
					_(
						"You had no more time and an opponent expelled you from the game :("
					) +
					"</p><br/>";
				n +=
					"<p>" +
					_(
						"Some tips to avoid this in the future (and avoid a bad reputation):"
					) +
					"</p>";
				n +=
					"<p>_ " +
					_(
						"Choose a slower game speed (ex: `Slow`) or play turn-based."
					) +
					"</p>";
				n +=
					"<p>_ " +
					_(
						"Make sure you are playing from a stable Internet and reliable device."
					) +
					"</p>";
				n +=
					"<p>_ " +
					_(
						"Discuss with your opponents and explain your difficulties."
					) +
					"</p>";
				n += "</div>";
				this.expelledDlg.setContent(n);
				this.expelledDlg.show();
			}
		}
	}

	setupCoreNotifications() {
		e.subscribe(
			"gameStateChange",
			this,
			"ntf_gameStateChange"
		);
		e.subscribe(
			"gameStateChangePrivateArg",
			this,
			"ntf_gameStateChangePrivateArgs"
		);
		e.subscribe(
			"gameStateMultipleActiveUpdate",
			this,
			"ntf_gameStateMultipleActiveUpdate"
		);
		e.subscribe(
			"newActivePlayer",
			this,
			"ntf_newActivePlayer"
		);
		e.subscribe(
			"playerstatus",
			this,
			"ntf_playerStatusChanged"
		);
		e.subscribe("yourturnack", this, "ntf_yourTurnAck");
		e.subscribe("clockalert", this, "ntf_clockalert");
		e.subscribe(
			"tableInfosChanged",
			this,
			"ntf_tableInfosChanged"
		);
		e.subscribe(
			"playerEliminated",
			this,
			"ntf_playerEliminated"
		);
		e.subscribe("tableDecision", this, "ntf_tableDecision");
		e.subscribe("infomsg", this, "ntf_infomsg");
		e.subscribe(
			"archivewaitingdelay",
			this,
			"ntf_archivewaitingdelay"
		);
		e.subscribe(
			"end_archivewaitingdelay",
			this,
			"ntf_end_archivewaitingdelay"
		);
		this.notifqueue.setSynchronous(
			"archivewaitingdelay",
			500
		);
		e.subscribe(
			"replaywaitingdelay",
			this,
			"ntf_replaywaitingdelay"
		);
		e.subscribe(
			"end_replaywaitingdelay",
			this,
			"ntf_end_replaywaitingdelay"
		);
		this.notifqueue.setSynchronous(
			"replaywaitingdelay",
			1500
		);
		e.subscribe(
			"replayinitialwaitingdelay",
			this,
			"ntf_replayinitialwaitingdelay"
		);
		e.subscribe(
			"end_replayinitialwaitingdelay",
			this,
			"ntf_end_replayinitialwaitingdelay"
		);
		this.notifqueue.setSynchronous(
			"replayinitialwaitingdelay",
			1500
		);
		e.subscribe(
			"aiPlayerWaitingDelay",
			this,
			"ntf_aiPlayerWaitingDelay"
		);
		this.notifqueue.setSynchronous(
			"aiPlayerWaitingDelay",
			2e3
		);
		e.subscribe(
			"replay_has_ended",
			this,
			"ntf_replay_has_ended"
		);
		e.subscribe(
			"updateSpectatorList",
			this,
			"ntf_updateSpectatorList"
		);
		e.subscribe("tableWindow", this, "ntf_tableWindow");
		e.subscribe(
			"wouldlikethink",
			this,
			"ntf_wouldlikethink"
		);
		e.subscribe(
			"updateReflexionTime",
			this,
			"ntf_updateReflexionTime"
		);
		e.subscribe(
			"undoRestorePoint",
			this,
			"ntf_undoRestorePoint"
		);
		e.subscribe(
			"resetInterfaceWithAllDatas",
			this,
			"ntf_resetInterfaceWithAllDatas"
		);
		e.subscribe(
			"zombieModeFail",
			this,
			"ntf_zombieModeFail"
		);
		e.subscribe(
			"zombieModeFailWarning",
			this,
			"ntf_zombieModeFailWarning"
		);
		e.subscribe("aiError", this, "ntf_aiError");
		e.subscribe(
			"skipTurnOfPlayer",
			this,
			"ntf_skipTurnOfPlayer"
		);
		e.subscribe("zombieBack", this, "ntf_zombieBack");
		e.subscribe(
			"allPlayersAreZombie",
			this,
			"ntf_allPlayersAreZombie"
		);
		e.subscribe(
			"gameResultNeutralized",
			this,
			"ntf_gameResultNeutralized"
		);
		e.subscribe(
			"playerConcedeGame",
			this,
			"ntf_playerConcedeGame"
		);
		e.subscribe("showTutorial", this, "ntf_showTutorial");
		this.notifqueue.setSynchronous("showTutorial");
		e.subscribe("showCursor", this, "ntf_showCursor");
		e.subscribe(
			"showCursorClick",
			this,
			"ntf_showCursorClick"
		);
		e.subscribe(
			"skipTurnOfPlayerWarning",
			this,
			"ntf_skipTurnOfPlayerWarning"
		);
		e.subscribe("simplePause", this, "ntf_simplePause");
		this.notifqueue.setSynchronous("simplePause");
		e.subscribe("banFromTable", this, "ntf_banFromTable");
		e.subscribe(
			"resultsAvailable",
			this,
			"ntf_resultsAvailable"
		);
		e.subscribe(
			"switchToTurnbased",
			this,
			"ntf_switchToTurnbased"
		);
		e.subscribe(
			"newPrivateState",
			this,
			"ntf_newPrivateState"
		);
	}

	ntf_gameStateChange(t: BGA.Notif<'gameStateChange'>) {
		if (undefined !== t.args.id) {
			undefined === this.gamedatas!.gamestates[t.args.id] &&
				console.error("Unknow gamestate: " + t.args.id);
			undefined !==
				this.gamedatas!.gamestates[t.args.id]!.args &&
				delete this.gamedatas!.gamestates[t.args.id]!
					.args;
			undefined !==
				this.gamedatas!.gamestates[t.args.id]!
					.updateGameProgression &&
				delete this.gamedatas!.gamestates[t.args.id]!
					.updateGameProgression;
			for (var i in this.gamedatas!.gamestates[t.args.id]!)
				// @ts-ignore - copy the args from the gamestate to the notif
				t.args[i] = this.gamedatas!.gamestates[t.args.id]![i];
		}
		if (this.gamedatas!.gamestate.private_state) {
			e.removeClass(
				"overall-content",
				"gamestate_" +
					this.gamedatas!.gamestate.private_state.name
			);
			this.onLeavingState(
				this.gamedatas!.gamestate.private_state.name
			);
		}
		e.removeClass(
			"overall-content",
			"gamestate_" + this.gamedatas!.gamestate.name
		);
		this.onLeavingState(this.gamedatas!.gamestate.name);
		if (null != this.next_private_args) {
			t.args.args!._private = this.next_private_args;
			this.next_private_args = null;
		}
		"gameSetup" == this.gamedatas!.gamestate.name &&
			this.sendResizeEvent();
		this.gamedatas!.gamestate = e.clone(t.args) as any;
		this.last_server_state = e.clone(
			this.gamedatas!.gamestate
		);
		this.gamedatas!.gamestate.name;
		t.args;
		this.on_client_state = false;
		var n: BGA.ID;
		for (n in this.gamedatas!.players)
			this.gamedatas!.players[n]!.ack = "wait";
		this.cancelPlannedWakeUp();
		this.cancelPlannedWakeUpCheck();
		this.updateActivePlayerAnimation() &&
			!g_archive_mode &&
			this.bRealtime &&
			this.sendWakeupInTenSeconds();
		this.bRealtime &&
			!g_archive_mode &&
			this.checkWakupUpInFourteenSeconds();
		this.updatePageTitle();
		e.style("pagemaintitle_wrap", "display", "block");
		e.style("gameaction_status_wrap", "display", "none");
		undefined !== t.args.updateGameProgression &&
			($("pr_gameprogression")!.innerHTML =
				String(t.args.updateGameProgression));
		if ("gameSetup" == t.args.name) {
			if (!g_archive_mode) {
				this.showMessage(
					"Game will start in few seconds ...",
					"error"
				);
				setTimeout("window.location.reload();", 3e3);
			}
		} else {
			this.lastWouldLikeThinkBlinking = 0;
			e.addClass(
				"overall-content",
				"gamestate_" + t.args.name
			);
			// @ts-ignore - typescript is unable to couple the name and state for some reason.
			this.onEnteringState(t.args.name, t.args);
			if ("gameEnd" == t.args.name) {
				this.bGameEndJustHappened = true;
				this.onGameEnd();
				undefined === this.end_of_game_timestamp &&
					(this.end_of_game_timestamp = Math.floor(
						Date.now() / 1e3
					));
			}
		}

		this.gamedatas!.gamestate.id 
	}

	ntf_gameStateChangePrivateArgs(e: BGA.Notif<'gameStateChangePrivateArg'>) {
		this.next_private_args = e.args;
	}

	ntf_gameStateMultipleActiveUpdate(e: BGA.Notif<'gameStateMultipleActiveUpdate'>) {
		this.gamedatas!.gamestate.multiactive = e.args;
		this.last_server_state!.multiactive = e.args;
		this.updateActivePlayerAnimation() &&
			this.sendWakeupInTenSeconds();
		var t = null;
		null != this.gamedatas!.gamestate.private_state &&
			this.isCurrentPlayerActive() &&
			(t = this.gamedatas!.gamestate.private_state);
		this.updatePageTitle(t);
	}

	ntf_newActivePlayer(e: BGA.Notif<'newActivePlayer'>) {
		this.gamedatas!.gamestate.active_player = e.args;
		this.gamedatas!.gamestate.active_player;
		this.updatePageTitle();
		this.updateActivePlayerAnimation();
	}

	ntf_playerStatusChanged(t: BGA.Notif<'playerstatus'>) {
		var i = "player_" + t.args.player_id + "_status";
		if ($(i)) {
			e.removeClass(i, "status_online");
			e.removeClass(i, "status_offline");
			e.removeClass(i, "status_inactive");
			e.addClass(i, "status_" + t.args.player_status);
		}
		this.updateFirePlayerLink();
	}

	ntf_yourTurnAck(e: BGA.Notif<'yourturnack'>) {
		var t = e.args.player;
		if (this.gamedatas!.players[t]) {
			this.gamedatas!.players[t]!.ack = "ack";
			-1 !=
				$<HTMLImageElement>("avatar_active_" + t)!.src.indexOf(
					"active_player"
				) &&
				(this.shouldDisplayClockAlert(t)
					? ($<HTMLImageElement>("avatar_active_" + t)!.src =
							getStaticAssetUrl(
								"img/layout/active_player_clockalert.gif"
							))
					: ($<HTMLImageElement>("avatar_active_" + t)!.src =
							getStaticAssetUrl(
								"img/layout/active_player.gif"
							)));
		}
	}

	ntf_clockalert(e: BGA.Notif<'clockalert'>) {}
	ntf_tableInfosChanged(e: BGA.Notif<'tableInfosChanged'>) {
		if ("playerQuitGame" == e.args.reload_reason) {
			this.gamedatas!.players[e.args.who_quits]!.zombie = 1;
			this.updateActivePlayerAnimation();
		} else if (
			"playerElimination" == e.args.reload_reason
		) {
			this.gamedatas!.players[
				e.args.who_quits
			]!.eliminated = 1;
			this.updateActivePlayerAnimation();
		}
	}

	ntf_playerEliminated(e: BGA.Notif<'playerEliminated'>) {
		e.args.who_quits == this.player_id &&
			this.showEliminated();
	}

	ntf_tableDecision(e: BGA.Notif<'tableDecision'>) {
		this.updateDecisionPanel(e.args);
	}

	ntf_infomsg(t: BGA.Notif<'infomsg'>) {
		if (t.args.player == this.player_id) {
			var i = e.string.substitute(t.log, t.args);
			this.showMessage(i, "info");
		}
	}

	ntf_archivewaitingdelay(e: BGA.Notif<'archivewaitingdelay'>) {
		this.lockInterface();
	}

	ntf_end_archivewaitingdelay(e: BGA.Notif<'end_archivewaitingdelay'>) {
		this.unlockInterface();
		if (this.bJumpToNextArchiveOnUnlock) {
			this.bJumpToNextArchiveOnUnlock = false;
			this.doNewArchiveCommentNext();
		}
		this.onEndDisplayLastArchive();
	}

	ntf_replaywaitingdelay(e: BGA.Notif<'replaywaitingdelay'>) {}
	ntf_end_replaywaitingdelay(e: BGA.Notif<'end_replaywaitingdelay'>) {}
	ntf_replayinitialwaitingdelay(e: BGA.Notif<'replayinitialwaitingdelay'>) {}
	ntf_end_replayinitialwaitingdelay(e: BGA.Notif<'end_replayinitialwaitingdelay'>) {}
	ntf_replay_has_ended(e: BGA.Notif<'replay_has_ended'>) {
		this.onEndOfReplay();
	}

	onEndOfReplay() {
		this.unlockInterface("replayFrom");
		this.setLoader(100, 100);
		g_replayFrom = undefined;
		if ($("current_header_infos_wrap")) {
			e.style(
				"current_header_infos_wrap",
				"display",
				"block"
			);
			e.style("previously_on", "display", "none");
		}
		this.gameUpgraded &&
			(window.location.href = this.getGameStandardUrl());
	}

	ntf_updateSpectatorList(e: BGA.Notif<'updateSpectatorList'>) {
		e.channelorig == "/table/ts" + this.table_id &&
			this.updateVisitors(e.args);
	}

	ntf_tableWindow(e: BGA.Notif<'tableWindow'>) {
		var t = "";
		undefined !== e.args.header && (t = e.args.header);
		var i = "";
		undefined !== e.args.footer && (i = e.args.footer);
		var n = "";
		undefined !== e.args.closing && (n = e.args.closing);
		this.displayTableWindow(
			e.args.id,
			_(e.args.title),
			e.args.table,
			_(t),
			_(i),
			_(n)
		);
	}

	ntf_wouldlikethink(e: BGA.Notif<'wouldlikethink'>) {
		this.lastWouldLikeThinkBlinking = 0;
	}

	ntf_updateReflexionTime(e: BGA.Notif<'updateReflexionTime'>) {
		if ("undefined" == typeof g_replayFrom) {
			var t = toint(
				this.gamedatas!.gamestate.reflexion.total[
					e.args.player_id
				]
			);
			this.gamedatas!.gamestate.reflexion.total[
				e.args.player_id
			] = t + toint(e.args.delta);
			null !== e.args.max &&
				(this.gamedatas!.gamestate.reflexion.total[
					e.args.player_id
				] = Math.min(
					toint(
						this.gamedatas!.gamestate.reflexion
							.total[e.args.player_id]
					),
					toint(e.args.max)
				));
			var i = toint(
				this.gamedatas!.gamestate.reflexion.total[
					e.args.player_id
				]
			);
			undefined !==
				this.gamedatas!.gamestate.reflexion.initial &&
				(this.gamedatas!.gamestate.reflexion.initial[
					e.args.player_id
				] =
					toint(
						this.gamedatas!.gamestate.reflexion
							.initial[e.args.player_id]
					) + toint(toint(i) - toint(t)));
		}
	}

	ntf_undoRestorePoint(t: BGA.Notif<'undoRestorePoint'>) {
		g_archive_mode ||
			this.ajaxcall(
				`/${this.game_name}/${this.game_name}/gamedatas.html`,
				{},
				this,
				function (t) {
					e.query(
						".player_board_content > *"
					).forEach(function (t) {
						e.hasClass(t, "player_score") ||
							e.hasClass(
								t,
								"player_table_status"
							) ||
							e.destroy(t);
					});
					e.empty("game_play_area");
					e.place(
						this.original_game_area_html!,
						"game_play_area"
					);
					e.removeClass(
						"overall-content",
						"gamestate_" +
							this.gamedatas!.gamestate.name
					);
					this.destroyAllEbgControls();
					this.setupNotifications = function () {};
					this.completesetup(
						this.game_name!,
						this.game_name_displayed,
						this.table_id!,
						this.player_id!,
						null,
						null,
						"keep_existing_gamedatas_limited",
						t.data,
						null,
						null
					);
				}
			);
	}

	ntf_resetInterfaceWithAllDatas(t: BGA.Notif<'resetInterfaceWithAllDatas'>) {
		e.query(".player_board_content > *").forEach(function (
			t
		) {
			e.hasClass(t, "player_score") ||
				e.hasClass(t, "player_table_status") ||
				e.destroy(t);
		});
		e.empty("game_play_area");
		e.place(this.original_game_area_html!, "game_play_area");
		e.removeClass(
			"overall-content",
			"gamestate_" + this.gamedatas!.gamestate.name
		);
		this.destroyAllEbgControls();
		this.setupNotifications = function () {};
		this.completesetup(
			this.game_name!,
			this.game_name_displayed,
			this.table_id!,
			this.player_id!,
			null,
			null,
			"keep_existing_gamedatas_limited",
			t.args,
			null,
			null
		);
	}

	ntf_zombieModeFailWarning(e: BGA.Notif<'zombieModeFailWarning'>) {
		this.showMessage(
			__(
				"lang_mainsite",
				"Error during Skip turn execution : if you are blocked please retry the same action and the game will be abandonned."
			),
			"info"
		);
	}

	ntf_zombieModeFail(e: BGA.Notif<'zombieModeFail'>) {
		this.showMessage(
			__(
				"lang_mainsite",
				"Error during Skip turn execution : this game has been cancelled. Please leave the game."
			),
			"info"
		);
	}

	ntf_aiError(t: BGA.Notif<'aiError'>) {
		this.showMessage(
			__(
				"lang_mainsite",
				"Artificial intelligence error:"
			) +
				" " +
				t.args.error,
			"error"
		);
		e.style("ai_not_playing", "display", "inline");
	}

	ntf_skipTurnOfPlayer(e: BGA.Notif<'skipTurnOfPlayer'>) {
		e.args.player_id == this.player_id &&
			e.args.zombie &&
			this.displayZombieBack();
		e.args.zombie &&
			(this.gamedatas!.players[
				e.args.player_id
			]!.zombie = 1);
		this.updateActivePlayerAnimation();
	}

	ntf_zombieBack(t: BGA.Notif<'zombieBack'>) {
		if (t.args.player_id == this.player_id) {
			e.style("zombieBack", "display", "none");
			this.setNewRTCMode(
				this.table_id!,
				null,
				this.rtc_mode
			);
		}
		this.gamedatas!.players[t.args.player_id]!.zombie = 0;
		this.updateActivePlayerAnimation();
	}

	ntf_gameResultNeutralized(e: BGA.Notif<'gameResultNeutralized'>) {
		this.showNeutralizedGamePanel(
			e.args.progression,
			e.args.player_id
		);
	}

	ntf_allPlayersAreZombie(t: BGA.Notif<'allPlayersAreZombie'>) {
		this.showMessage(
			__(
				"lang_mainsite",
				"All players are over time limit and all turns are skipped: game is abandonned."
			),
			"info"
		);
		if (
			"undefined" != typeof bgaConfig &&
			bgaConfig.webrtcEnabled &&
			null !== this.room
		) {
			this.prepareMediaRatingParams();
			this.doLeaveRoom(
				e.hitch(this, function () {
					this.quickGameEnd
						? this.redirectToMainsite()
						: this.redirectToTablePage();
				})
			);
		} else
			this.quickGameEnd
				? this.redirectToMainsite()
				: this.redirectToTablePage();
	}

	ntf_simplePause(e: BGA.Notif<'simplePause'>) {
		var t = e.args.time;
		t = Math.min(t, 1e4);
		this.notifqueue.setSynchronousDuration(t);
	}

	ntf_showTutorial(t: BGA.Notif<'showTutorial'>) {
		this.lockInterface();
		t.args.delay && t.args.delay > 0
			? setTimeout(
					e.hitch(this, function () {
						this.showTutorialItem(t);
					}),
					toint(t.args.delay)
			  )
			: this.showTutorialItem(t);
	}

	showTutorialActivationDlg() {
		if (this.is_solo)
			this.ajaxcall(
				`/${this.game_name}/${this.game_name}/activeTutorial.html`,
				{ active: 1 },
				this,
				function (e) {}
			);
		else {
			var t = "<div class='tutorial_ingame'>";
			t += e.string.substitute(
				__(
					"lang_mainsite",
					"Welcome on ${game}. Do you want to learn how to play?"
				),
				{ game: this.game_name_displayed }
			);
			t += "<div class='tutorial_footer'>";
			t +=
				"<a id='disable_tutorial' class='bgabutton bgabutton_gray' href='#'>";
			t +=
				"<span>" +
				__("lang_mainsite", "No, thanks") +
				"</span></a>&nbsp;&nbsp;";
			t +=
				"<a id='enable_tutorial' class='bgabutton bgabutton_blue' href='#'>";
			t +=
				"<span>" +
				__("lang_mainsite", "Yes") +
				"</span></a></div>";
			t += "</div>";
			t += "</div>";
			this.tutorialActiveDlg = new ebg.popindialog();
			this.tutorialActiveDlg.create("tutorialActiveDlg");
			this.tutorialActiveDlg.setTitle(
				__("lang_mainsite", "Tutorial")
			);
			this.tutorialActiveDlg.setContent(t);
			this.tutorialActiveDlg.show();
			e.connect(
				$("disable_tutorial")!,
				"onclick",
				this,
				function () {
					this.ajaxcall(
						`/${this.game_name}/${this.game_name}/activeTutorial.html`,
						{ active: 0 },
						this,
						function (e) {}
					);
					this.tutorialActiveDlg!.destroy();
				}
			);
			e.connect(
				$("enable_tutorial")!,
				"onclick",
				this,
				function () {
					this.ajaxcall(
						`/${this.game_name}/${this.game_name}/activeTutorial.html`,
						{ active: 1 },
						this,
						function (e) {}
					);
					this.tutorialActiveDlg!.destroy();
				}
			);
		}
	}

	showTutorialItem(t: BGA.Notif<'showTutorial'>) {
		if (undefined === this.tutorialItem[t.args.id]) {
			var i = "<div class='tutorial_ingame'>";
			i += _(t.args.text);
			i +=
				"<div class='tutorial_footer'><a id='close_tutorial_" +
				t.args.id +
				"' class='bgabutton bgabutton_blue' href='#'>";
			t.args.calltoaction
				? (i +=
						"<span>" +
						_(t.args.calltoaction) +
						"</span></a></div>")
				: (i +=
						"<span>" +
						__("lang_mainsite", "Ok") +
						"</span></a></div>");
			i += "</div>";
			var n = null;
			if (t.args.attachement) n = t.args.attachement;
			$(n) || (n = null);
			if (null === n) {
				$("tutorialDialogContent") &&
					e.destroy("tutorialDialogContent");
				this.tutorialItem[t.args.id] = new dijit.Dialog(
					{ title: __("lang_mainsite", "Tutorial") }
				);
				this.tutorialItem[t.args.id]!.set("content", i);
				(this.tutorialItem[t.args.id] as DijitJS.Dialog).show();
				e.connect(
					$("close_tutorial_" + t.args.id)!,
					"onclick",
					this,
					"onTutorialDlgClose"
				);
			} else {
				this.tutorialItem[t.args.id] =
					new dijit.TooltipDialog({
						id: "tutorial_item_" + t.args.id,
						content: i,
						closable: true,
					});
				dijit.popup.open({
					popup: this.tutorialItem[t.args.id] as DijitJS.TooltipDialog,
					around: (null !== n ? $(n) : null) as HTMLElement,
				});
				e.connect(
					$("close_tutorial_" + t.args.id)!,
					"onclick",
					this,
					"onTutorialClose"
				);
			}
		} else endnotif();
	}

	onTutorialClose(e: MouseEvent) {
		var t = (e.currentTarget as Element).id.substr(15) as BGA.ID;
		dijit.popup.close(this.tutorialItem[t]);
		this.tutorialItem[t]!.destroy();
		this.markTutorialAsSeen(t);
	}

	onTutorialDlgClose(e: MouseEvent) {
		var t = (e.currentTarget as Element).id.substr(15) as BGA.ID;
		(this.tutorialItem[t] as DijitJS.Dialog)!.hide();
		this.tutorialItem[t]!.destroy();
		this.markTutorialAsSeen(t);
	}

	markTutorialAsSeen(t: BGA.ID) {
		this.unlockInterface();
		this.interface_status = "updated";
		e.style("pagemaintitle_wrap", "display", "block");
		e.style("gameaction_status_wrap", "display", "none");
		e.style("synchronous_notif_icon", "display", "none");
		endnotif();
		this.ajaxcall(
		`/${this.game_name}/${this.game_name}/seenTutorial.html`,
			{ id: t },
			this,
			function (e) {}
		);
	}

	toggleTurnBasedNotes() {
		$("ingame_menu_notes");
		undefined === this.turnBasedNotes
			? this.openTurnBasedNotes()
			: this.turnBasedNotesIsOpen
			? this.closeTurnBasedNotes()
			: this.openTurnBasedNotes();
	}

	closeTurnBasedNotes() {
		if (
			undefined !== this.turnBasedNotes &&
			this.turnBasedNotesIsOpen
		) {
			dijit.popup.close(this.turnBasedNotesPopup);
			this.turnBasedNotesIsOpen = false;
			window.focus();
			document.activeElement &&
				(document.activeElement as HTMLElement).blur();
		}
	}

	openTurnBasedNotes(t?: string) {
		if (undefined === t) t = "";
		else {
			e.removeClass("ingame_menu_notes", "icon32_notes");
			e.addClass(
				"ingame_menu_notes",
				"icon32_notes_active"
			);
		}
		var i = $("ingame_menu_notes");
		if (undefined === this.turnBasedNotesPopup) {
			var n = '<div id="turnbased_notes">';
			n +=
				"<h3>" +
				__(
					"lang_mainsite",
					"My personal notes on this game"
				) +
				":</h3>";
			n += __(
				"lang_mainsite",
				"Note: your opponents CANNOT see your notes."
			);
			n += "<br/>";
			n += "<br/>";
			n +=
				"<textarea id='turnbased_notes_content'>" +
				t +
				"</textarea>";
			n += "<br/>";
			n += "<div id='turnbased_notes_commands'>";
			n +=
				"<a href='#' id='btn_clearmynotes' class='bgabutton bgabutton_gray' style='float:left'>" +
				__("lang_mainsite", "Clear my notes") +
				"</a> &nbsp;";
			n +=
				"<a href='#' id='btn_savemynotes' class='bgabutton bgabutton_blue'>" +
				__("lang_mainsite", "OK") +
				"</a> &nbsp;";
			n += "</div>";
			n += "<div class='clear'></div>";
			n += "</div>";
			this.turnBasedNotesPopup = new dijit.TooltipDialog({
				id: "turnBasedNotes",
				content: n,
				closable: true,
			});
			dijit.popup.open({
				popup: this.turnBasedNotesPopup,
				around: $(i)!,
				orient: [
					"below",
					"below-alt",
					"above",
					"above-alt",
				],
			});
			$("turnbased_notes_content")!.focus();
			setCaretPosition(
				$<HTMLInputElement>("turnbased_notes_content")!,
				9999
			);
			e.query(".dijitPopup").style("zIndex", String(1054));
			e.connect(
				$("btn_savemynotes")!,
				"onclick",
				this,
				"onSaveNotes"
			);
			e.connect(
				$("btn_clearmynotes")!,
				"onclick",
				this,
				"onClearNotes"
			);
			this.turnBasedNotesIsOpen = true;
		} else {
			dijit.popup.open({
				popup: this.turnBasedNotesPopup,
				around: $(i)!,
				orient: [
					"below",
					"below-alt",
					"above",
					"above-alt",
				],
			});
			this.turnBasedNotesIsOpen = true;
			$("turnbased_notes_content")!.focus();
			setCaretPosition(
				$<HTMLInputElement>("turnbased_notes_content")!,
				9999
			);
			e.query(".dijitPopup").style("zIndex", String(1054));
		}
	}

	onSaveNotes(t: MouseEvent) {
		e.stopEvent(t);
		var i = $<HTMLInputElement>("turnbased_notes_content")!.value;
		this.ajaxcall(
			"/table/table/updateTurnBasedNotes.html",
			{ value: i, table: this.table_id! },
			this,
			function (e) {}
		);
		if ("" != i) {
			e.removeClass("ingame_menu_notes", "icon32_notes");
			e.addClass(
				"ingame_menu_notes",
				"icon32_notes_active"
			);
		} else {
			e.removeClass(
				"ingame_menu_notes",
				"icon32_notes_active"
			);
			e.addClass("ingame_menu_notes", "icon32_notes");
		}
		this.closeTurnBasedNotes();
	}

	onClearNotes(e: MouseEvent) {
		$<HTMLInputElement>("turnbased_notes_content")!.value = "";
		this.onSaveNotes(e);
	}

	onSeeMoreLink(t: MouseEvent) {
		e.stopEvent(t);
		(t.currentTarget as Element).id.substr(7);
		e.query(".link_see_more").style("display", "block");
		e.style((t.currentTarget as Element).id, "display", "none");
	}

	onThumbUpLink(t: MouseEvent) {
		e.stopEvent(t);
		var i = (t.currentTarget as Element).id.substr(13) as BGA.ID;
		this.ajaxcall(
			"/table/table/thumbUpLink.html",
			{ id: i },
			this,
			function (e) {
				$("thumbup_current_" + i)!.innerHTML =
					String(toint($("thumbup_current_" + i)!.innerHTML) +
					1);
			}
		);
	}

	onChangePreference(e: Event) {
		var t = (e.currentTarget as Element).id.substr(26),
			i = (e.currentTarget as HTMLInputElement).value;
		$<HTMLInputElement>("preference_global_control_" + t)!.value = i;
		$<HTMLInputElement>("preference_global_fontrol_" + t)!.value = i;
		"logsSecondColumn" == t
			? this.switchLogModeTo(i as any)
			: "showOpponentCursor" == t
			? this.showMessage(
					__(
						"lang_mainsite",
						"Your preference will be applied starting next move"
					),
					"info"
			  )
			: "displayTooltips" == t &&
			  this.switchDisplayTooltips(i as any);
		this.hideIngameMenu();
		this.ajaxcall(
			"/table/table/changeGlobalPreference.html",
			{ id: t as BGA.ID, value: i },
			this,
			function (e) {}
		);
	}

	handleGameUserPreferenceChangeEvent(pref_id: number, newValue: number) {
		this.ajaxcall(
			"/table/table/changePreference.html",
			{ id: pref_id, value: newValue, game: this.game_name! },
			this,
			function (i) {
				if ("reload" == i.status) {
					this.showMessage(
						"Done, reload in progress...",
						"info"
					);
					location.hash = "";
					window.location.reload();
				} else {
					i.pref_id ==
						this.GAMEPREFERENCE_DISPLAYTOOLTIPS &&
						this.switchDisplayTooltips(i.value);
					"function" ==
						typeof this
							.onGameUserPreferenceChanged &&
						this.onGameUserPreferenceChanged(pref_id, newValue);
				}
			}
		);
		this.ajaxcall(
			`/${this.game_name!}/${this.game_name!}/onGameUserPreferenceChanged.html`,
			{ id: pref_id, value: newValue },
			this,
			function (e) {}
		);
	}

	getGameUserPreference(e: BGA.ID) {
		if (!$("preference_control_" + e))
			throw new Error(
				"User preference " + e + " doesn't exists!"
			);
		return Number($<HTMLInputElement>("preference_control_" + e)!.value);
	}

	setGameUserPreference(e: number, t: number) {
		if (!$("preference_control_" + e))
			throw new Error(
				"User preference " + e + " doesn't exists!"
			);
		$<HTMLInputElement>("preference_control_" + e)!.value = String(t);
		$<HTMLInputElement>("preference_fontrol_" + e)!.value = String(t);
		this.handleGameUserPreferenceChangeEvent(e, t);
	}

	getRanking() {
		if (undefined === this.last_rank_displayed) {
			this.last_rank_displayed = 0;
			this.ranking_mode_displayed = "arena";
		}
		this.ajaxcall(
			"/gamepanel/gamepanel/getRanking.html",
			{
				game: this.game_id!,
				start: this.last_rank_displayed,
				mode: this.ranking_mode_displayed!,
			},
			this,
			function (t) {
				this.insert_rankings(t.ranks);
				if (
					0 == e.query(".champion").length &&
					t.champion
				) {
					t.champion.rank = _("Reigning Champion");
					t.champion.premium =
						"emblemwrap_l player_in_list_l";
					t.champion.flag = t.champion.country.code;
					t.champion.flagdisplay = "inline-block";
					t.champion.additional_ranking = "";
					t.champion.ranking = "";
					t.champion.add_class = "champion";
					t.champion.avatar = getPlayerAvatar(
						t.champion.id,
						t.champion.avatar,
						32
					);
					t.champion.device = playerDeviceToIcon(
						t.champion.device
					);
					e.place(
						this.format_string(
							this.jstpl_player_ranking,
							t.champion
						),
						"players",
						"first"
					);
				}
			}
		);
	}

	insert_rankings(t: any) {
		var i = this.last_rank_displayed! + 1;
		for (var n in t) {
			var o = false,
				a = t[n];
			a.rank = this.getRankString(a.rank_no);
			a.additional_ranking = "";
			a.premium = "";
			a.add_class = "";
			a.avatar = getPlayerAvatar(a.id, a.avatar, 32);
			a.device = playerDeviceToIcon(a.device);
			if (a.ranking) {
				a.ranking = this.getEloLabel(a.ranking);
				a.link =
					this.metasiteurl + "/player?id=" + a.id;
				a.flag = a.country.code;
				a.flagdisplay = "inline-block";
			} else if (a.arena) {
				a.ranking = this.getArenaLabel(a.arena);
				a.arena >= 500 &&
					(a.ranking = this.getArenaLabel(
						a.arena,
						a.rank_no
					));
				a.link = "player?id=" + a.id;
				a.flag = a.country.code;
				a.flagdisplay = "inline-block";
				a.additional_ranking = "ranking_arena";
			} else {
				o = true;
				a.name =
					'<img class="masqued_rank" id="maskn_' +
					a.rank_no +
					'" src="' +
					getStaticAssetUrl(
						"img/common/rankmask.png"
					) +
					'"/>';
				a.ranking =
					'<a href="premium"><img class="masqued_rank" id="maskr_' +
					a.rank_no +
					'" src="' +
					getStaticAssetUrl(
						"img/common/rankmask.png"
					) +
					'"/></a>';
				a.link = "premium";
				a.flag = "XX";
				a.flagdisplay = "none";
				a.id = "";
			}
			e.place(
				this.format_string(
					this.jstpl_player_ranking,
					a
				),
				"players"
			);
			o ||
				this.addTooltip(
					"flag_" + a.id,
					a.country.name,
					""
				);
			this.last_rank_displayed = i;
			i++;
		}
	}

	onSeeMoreRanking(t: MouseEvent) {
		e.stopEvent(t);
		this.getRanking();
	}

	onChangeRankMode(t: MouseEvent) {
		e.stopEvent(t);
		e.query(
			".sectiontitle_dropdown_menu_visible"
		).removeClass("sectiontitle_dropdown_menu_visible");
		var i = (t.currentTarget as Element).id.split("_")[1];
		this.ranking_mode_displayed =
			"current" == i ? "arena" : "elo";
		e.query(
			"#ranking_menu .display_section .fa-check"
		).forEach(e.destroy);
		e.query(
			"#ranking_menu .display_section .rank_season"
		).removeClass("selected_");
		e.query(
			"#ranking_menu .display_section .rank_season"
		).addClass("notselected");
		$("ranking_menu_menu_title")!.innerHTML =
			(t.currentTarget as Element).innerHTML +
			' <i class="fa fa-caret-down" aria-hidden="true"></i>';
		e.place(
			' <i class="fa fa-check" aria-hidden="true"></i>',
			(t.currentTarget as Element)
		);
		this.last_rank_displayed = 0;
		e.empty("players");
		this.getRanking();
	}

	ntf_aiPlayerWaitingDelay(_: BGA.Notif<'aiPlayerWaitingDelay'>) {}

	ntf_playerConcedeGame(t: BGA.Notif<'playerConcedeGame'>) {
		this.showMessage(
			e.string.substitute(
				__(
					"lang_mainsite",
					"${player_name} concedes this game."
				),
				t.args
			),
			"info"
		);
	}

	ntf_skipTurnOfPlayerWarning(t: BGA.Notif<'skipTurnOfPlayerWarning'>) {
		t.args.player_id == this.player_id &&
			this.showMessage(
				e.string.substitute(
					__(
						"lang_mainsite",
						"You are out of time and an opponent is ready to EXPEL you from the game. You have ${delay} SECONDS to finish your turn or you'll lose this game."
					),
					{ delay: t.args.delay }
				),
				"error"
			);
		this.notifqueue.resynchronizeNotifications(false);
	}

	ntf_showCursorClick(e: BGA.Notif<'showCursorClick'>) {
		if (
			!$("player_hidecursor_" + e.args.player_id) ||
			$<HTMLInputElement>("player_hidecursor_" + e.args.player_id)!.checked
		) {
			var t = null,
				i: number | null = null,
				n: number | null = null;
			for (var o in e.args.path) {
				var a = e.args.path[o]!;
				if ($(a.id) && null !== $(a.id)!.offsetParent) {
					t = a.id;
					i = a.x;
					n = a.y;
					break;
				}
			}
			if (null !== t) {
				var s = e.args.player_id;
				this.showClick(
					t,
					i!,
					n!,
					"#" + this.gamedatas!.players[s]!.color
				);
			}
		}
	}

	ntf_showCursor(t: BGA.Notif<'showCursor'>) {
		if (
			!$("player_hidecursor_" + t.args.player_id) ||
			$<HTMLInputElement>("player_hidecursor_" + t.args.player_id)!.checked
		) {
			var i = null,
				n: number | null = null,
				o: number | null = null;
			if (null != t.args.path) {
				e.style(
					"player_showcursor_" + t.args.player_id,
					"display",
					"block"
				);
				for (var a in t.args.path) {
					var s = t.args.path[a]!;
					if (
						$(s.id) &&
						null !== $(s.id)!.offsetParent
					) {
						i = s.id;
						n = s.x;
						o = s.y;
						break;
					}
				}
				var r = t.args.player_id;
				if (!$("opponent_cursor_" + r)) {
					var l = "";
					this.gamedatas!.players[r] &&
						(l = this.gamedatas!.players[r]!.name);
					e.place(
						'<i id="opponent_cursor_' +
							r +
							'" class="opponent_cursor fa fa-hand-pointer-o"> ' +
							l +
							"</i>",
						"ebd-body"
					);
					null !== i &&
						this.placeOnObjectPos(
							$("opponent_cursor_" + r)!,
							i,
							n! + -10,
							o!
						);
				}
				e.style(
					"opponent_cursor_" + r,
					"display",
					"block"
				);
				e.style(
					"opponent_cursor_" + r,
					"color",
					"#" + this.gamedatas!.players[r]!.color
				);
				null !== i &&
					this.slideToObjectPos(
						$("opponent_cursor_" + r)!,
						i,
						n! + -10,
						o!,
						500
					).play();
			} else {
				$("opponent_cursor_" + t.args.player_id) &&
					e.destroy(
						"opponent_cursor_" + t.args.player_id
					);
				e.style(
					"player_showcursor_" + t.args.player_id,
					"display",
					"none"
				);
			}
		}
	}

	onChatKeyDown(t: KeyboardEvent) {
		if (
			this.control3dmode3d &&
			"ebd-body" == (t.target as Element).id &&
			(37 == t.keyCode ||
				38 == t.keyCode ||
				39 == t.keyCode ||
				40 == t.keyCode ||
				107 == t.keyCode ||
				109 == t.keyCode)
		) {
			if (Boolean(0) == t.ctrlKey)
				if (37 == t.keyCode)
					this.change3d(0, 0, 100, 0, 0, true, false);
				else if (38 == t.keyCode)
					this.change3d(0, 100, 0, 0, 0, true, false);
				else if (39 == t.keyCode)
					this.change3d(0, 0, -100, 0, 0, true, false);
				else if (40 == t.keyCode)
					this.change3d(0, -100, 0, 0, 0, true, false);
				else {
					if (107 == t.keyCode) {
						this.change3d(0, 0, 0, 0, 0.1, true, false);
						return;
					}
					if (109 == t.keyCode) {
						this.change3d(0, 0, 0, 0, -0.1, true, false);
						return;
					}
				}
			else
				37 == t.keyCode
					? this.change3d(0, 0, 0, -10, 0, true, false)
					: 38 == t.keyCode
					? this.change3d(-10, 0, 0, 0, 0, true, false)
					: 39 == t.keyCode
					? this.change3d(0, 0, 0, 10, 0, true, false)
					: 40 == t.keyCode &&
					  this.change3d(10, 0, 0, 0, 0, true, false);
			107 == t.keyCode ||
				109 == t.keyCode ||
				e.stopEvent(t);
		}
		"ebd-body" == (t.target as Element).id &&
			Boolean(0) == t.ctrlKey &&
			Boolean(0) == t.metaKey &&
			((t.keyCode >= 48 && t.keyCode <= 57) ||
				(t.keyCode >= 65 && t.keyCode <= 90) ||
				(t.keyCode >= 96 && t.keyCode <= 111) ||
				32 == t.keyCode ||
				59 == t.keyCode ||
				61 == t.keyCode ||
				173 == t.keyCode ||
				186 == t.keyCode ||
				187 == t.keyCode ||
				188 == t.keyCode ||
				189 == t.keyCode ||
				190 == t.keyCode ||
				191 == t.keyCode ||
				192 == t.keyCode ||
				219 == t.keyCode ||
				220 == t.keyCode ||
				221 == t.keyCode ||
				222 == t.keyCode) &&
			this.expandChatWindow(`table_${this.table_id!}`, true);
		27 == t.keyCode &&
			Boolean(0) == t.ctrlKey &&
			this.collapseChatWindow(`table_${this.table_id!}`);
	}

	onChatInputBlur(e: Event) {}

	onJudgeDecision(e: Event) {
		var t = (e.currentTarget as Element).id.substr(17) as BGA.ID;
		this.ajaxcall(
			"/table/table/judgegivevictory.html",
			{ id: this.table_id!, winner: t },
			this,
			function (e) {}
		);
	}

	registerEbgControl(e: {
		destroy?: () => void;
	}) {
		this.ebgControls.push(e);
	}

	destroyAllEbgControls() {
		for (var e in this.ebgControls)
			this.ensureEbgObjectReinit(this.ebgControls[e]);
		this.ebgControls = [];
	}

	playMusic(_?: unknown) {
		if (
			undefined !==
				$("melodice_frame")!.getAttribute(
					"to_be_loaded_src"
				) &&
			null !==
				$("melodice_frame")!.getAttribute(
					"to_be_loaded_src"
				)
		) {
			$<HTMLImageElement>("melodice_frame")!.src =
				$("melodice_frame")!.getAttribute(
					"to_be_loaded_src"
				)!;
			$("melodice_frame")!.removeAttribute(
				"to_be_loaded_src"
			);
		}
	}

	onShowGameHelp() {
		if (null != $("mediawiki_gamehelp_content")) {
			e.place(
				'<div class="loading_icon"></div>',
				"mediawiki_gamehelp_content"
			);
			this.ajaxcall(
				"/gamepanel/gamepanel/getWikiHelp.html",
				{ gamename: this.game_name!, section: "help" },
				this,
				function (t) {
					e.place(
						t.content,
						"mediawiki_gamehelp_content",
						"only"
					);
				}
			);
		}
	}

	onShowStrategyHelp() {
		if (null != $("mediawiki_strategy_content")) {
			e.place(
				'<div class="loading_icon"></div>',
				"mediawiki_strategy_content"
			);
			this.ajaxcall(
				"/gamepanel/gamepanel/getWikiHelp.html",
				{ gamename: this.game_name!, section: "tips" },
				this,
				function (t) {
					e.place(
						t.content,
						"mediawiki_strategy_content",
						"only"
					);
				}
			);
		}
	}

	onShowCompetition() {
		this.getRanking();
	}

	onShowTournament() {
		var e = $("tournament_frame")!;
		if (this.tournament_id && e) {
			window.addEventListener("message", (t) => {
				isNaN(t.data) ||
					(e.style.height = t.data + "px");
			});
			$<HTMLImageElement>("tournament_frame")!.src =
				this.metasiteurl +
				"/tournament/tournament/results.html?id=" +
				this.tournament_id;
		}
	}

	lockScreenCounter() {
		if (
			"gameSetup" == this.gamedatas!.gamestate.name &&
			!g_archive_mode
		) {
			this.updatePageTitle();
			this.lockts!--;
			this.lockts! <= 0 &&
				this.ajaxcall(
					`/${this.game_name}/${this.game_name}/endLockScreen.html`,
					{},
					this,
					function (e) {
						if (1 == e.data.c) {}
						else if (
							undefined !== this.lockScreenTimeout
						) {
							clearTimeout(
								this.lockScreenTimeout
							);
							return;
						}
					}
				);
			this.lockScreenTimeout = setTimeout(
				e.hitch(this, "lockScreenCounter"),
				1e3
			);
		}
	}

	bgaPerformAction<K extends keyof BGA.GameStatePossibleActions>(
		e: K,
		t: BGA.AjaxParams<`/${string}/${string}/${K}.html`, this>[1],
		i?: { lock?: boolean, checkAction?: boolean, checkPossibleActions?: boolean }
	): Promise<void> | void {
		if (
			(!(i = {
				lock: true,
				checkAction: true,
				checkPossibleActions: false,
				...i,
			}).checkAction ||
				this.checkAction(e)) &&
			(!i.checkPossibleActions ||
				this.checkPossibleActions(e))
		) {
			null == t && (t = {} as any);
			i.lock && (t.lock = true);
			return new Promise((i, n) => {
				this.ajaxcall(
					`/${this.game_name}/${this.game_name}/${e}.html`,
					t as any,
					this,
					() => {},
					(e, t) => (e ? n(t) : i())
				);
			});
		}
	}

	initHotseat() {
		this.hotseat_focus = null;
		for (var t in this.hotseat) {
			var i =
				"/" +
				this.gameserver +
				"/" +
				this.game_name +
				"?table=" +
				this.table_id +
				"&lang=" +
				dojoConfig.locale +
				"&testuser=" +
				t;
			if ("normal" == this.hotseat_interface) {
				e.place(
					e.string.substitute(
						this.jstpl_hotseat_interface,
						{ url: i, player_id: t }
					),
					"overall-footer",
					"before"
				);
				e.style("hotseat_mask", "display", "block");
			}
			this.hotseat_focus = this.player_id!;
		}
		null !== this.hotseat_focus &&
			(this.hotseat![this.player_id!]! = 1);
		"hotseataccount" == this.hotseat_interface &&
			(this.forceTestUser = this.player_id!);
		e.connect(
			$("hotseat_mask")!,
			"onclick",
			this,
			"onHotseatPlayButton"
		);
	}

	onHotseatPlayButton(t: MouseEvent) {
		e.stopEvent(t);
		e.style("hotseat_mask", "display", "none");
	}

	checkHotseatFocus() {
		if (
			null !== this.hotseat_focus &&
			!this.isPlayerActive(this.hotseat_focus)
		)
			var t: BGA.ID;
			for (t in this.hotseat)
				if (this.isPlayerActive(t)) {
					setTimeout(
						e.hitch(this, function () {
							this.giveHotseatFocusTo(t);
						}),
						1e3
					);
					return;
				}
	}

	giveHotseatFocusTo(t: BGA.ID) {
		if ("single_screen" == this.hotseat_interface) {
			this.hotseat_focus = t;
			this.player_id = t;
			this.forceTestUser = t;
			this.showMessage(
				e.string.substitute("This is ${player} turn!", {
					player: this.gamedatas!.players[t]!
						// @ts-ignore - TODO: is player_name added to the players somewhere?
						.player_name,
				}),
				"info"
			);
		} else {
			e.query(".hotseat_iframe").style("left", "200%");
			if (t != this.player_id) {
				e.style("hotseat_iframe_" + t, "left", "0px");
				e.addClass("ebd-body", "fullscreen_iframe");
			}
			this.hotseat_focus = t;
			if (this.hotseat_focus == this.player_id) {
				e.style("hotseat_mask", "display", "block");
				e.removeClass("ebd-body", "fullscreen_iframe");
			} else {
				var i =
					window.frames[
						`hotseat_iframe_${this.hotseat_focus!}`
					]!.contentDocument!.getElementById(
						"hotseat_mask"
					)!;
				e.style(i, "display", "block");
			}
		}
	}

	init3d() {
		e.connect(
			$("c3dAngleUp")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				-10,
				0,
				0,
				0,
				0,
				true,
				false
			)
		);
		e.connect(
			$("c3dAngleDown")!,
			"onclick",
			e.hitch(this, this.change3d, 10, 0, 0, 0, 0, true, false)
		);
		e.connect(
			$("c3dUp")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				0,
				100,
				0,
				0,
				0,
				true,
				false
			)
		);
		e.connect(
			$("c3dDown")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				0,
				-100,
				0,
				0,
				0,
				true,
				false
			)
		);
		e.connect(
			$("c3dLeft")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				0,
				0,
				100,
				0,
				0,
				true,
				false
			)
		);
		e.connect(
			$("c3dRight")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				0,
				0,
				-100,
				0,
				0,
				true,
				false
			)
		);
		e.connect(
			$("c3dRotateL")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				0,
				0,
				0,
				-10,
				0,
				true,
				false
			)
		);
		e.connect(
			$("c3dRotateR")!,
			"onclick",
			e.hitch(this, this.change3d, 0, 0, 0, 10, 0, true, false)
		);
		e.connect(
			$("ingame_menu_3d")!,
			"onclick",
			e.hitch(this, this.change3d, 0, 0, 0, 0, 0, false, false)
		);
		e.connect(
			$("c3dZoomIn")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				0,
				0,
				0,
				0,
				0.1,
				true,
				false
			)
		);
		e.connect(
			$("c3dZoomOut")!,
			"onclick",
			e.hitch(
				this,
				this.change3d,
				0,
				0,
				0,
				0,
				-0.1,
				true,
				false
			)
		);
		e.query<HTMLElement>(".control3d_command").connect(
			"onmouseenter",
			this,
			"enter3dButton"
		);
		e.query<HTMLElement>(".control3d_command").connect(
			"onmouseleave",
			this,
			"leave3dButton"
		);
		if (e.hasClass("ebd-body", "mobile_version")) {
			this.control3ddraggable = new ebg.draggable();
			this.control3ddraggable.create(
				this,
				"controls3d_wrap",
				"controls3d_img"
			);
		}
	}

	change3d(t: number, i: number, n: number, o: number, a: number, s: 0 | 1 | boolean, r:  0 | 1 | boolean) {
		0 == s &&
			(this.control3dmode3d = !this.control3dmode3d);
		if (0 == this.control3dmode3d) {
			e.hasClass("ebd-body", "mode_3d") &&
				e.removeClass("ebd-body", "mode_3d");
			$("ingame_menu_3d_label")!.innerHTML = __(
				"lang_mainsite",
				"3D mode"
			);
			$("game_play_area")!.style.transform =
				"rotatex(0deg) translate(0px,0px) rotateZ(0deg)";
		} else {
			e.hasClass("ebd-body", "mode_3d") ||
				e.addClass("ebd-body", "mode_3d");
			e.addClass("ebd-body", "enableTransitions");
			$("ingame_menu_3d_label")!.innerHTML = __(
				"lang_mainsite",
				"2D mode"
			);
			this.control3dxaxis += t;
			this.control3dxaxis >= 80 &&
				(this.control3dxaxis = 80);
			this.control3dxaxis <= 0 &&
				(this.control3dxaxis = 0);
			this.control3dscale < 0.5 &&
				(this.control3dscale = 0.5);
			this.control3dzaxis += o;
			this.control3dxpos += i;
			this.control3dypos += n;
			this.control3dscale += a;
			if (1 == r) {
				this.control3dxaxis = 0;
				this.control3dzaxis = 0;
				this.control3dxpos = 0;
				this.control3dypos = 0;
				this.control3dscale = 1;
			}
			$("game_play_area")!.style.transform =
				"rotatex(" +
				this.control3dxaxis +
				"deg) translate(" +
				this.control3dypos +
				"px," +
				this.control3dxpos +
				"px) rotateZ(" +
				this.control3dzaxis +
				"deg) scale3d(" +
				this.control3dscale +
				"," +
				this.control3dscale +
				"," +
				this.control3dscale +
				")";
		}
	}

	enter3dButton(e: MouseEvent) {
		"c3dLeft" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Left arrow"
			));
		"c3dRight" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Right arrow"
			));
		"c3dUp" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Up arrow"
			));
		"c3dDown" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Down arrow"
			));
		"c3dRotateL" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Ctrl+Left arrow"
			));
		"c3dRotateR" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Ctrl+Right arrow"
			));
		"c3dAngleDown" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Ctrl+Down arrow"
			));
		"c3dAngleUp" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : Ctrl+Up arrow"
			));
		"c3dZoomIn" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : +"
			));
		"c3dZoomOut" == (e.currentTarget as Element).id &&
			($("tooltip3d")!.innerHTML = __(
				"lang_mainsite",
				"Shortcut : -"
			));
	}

	leave3dButton(e: MouseEvent) {
		$("tooltip3d")!.innerHTML = __(
			"lang_mainsite",
			"Note: 3D is experimental"
		);
	}

	ntf_banFromTable(e: BGA.Notif<'banFromTable'>) {
		if (
			this.isSpectator &&
			undefined !== this.gamedatas!.players[e.args.from]
		) {
			location.hash = "";
			window.location.reload();
		}
	}

	ntf_resultsAvailable(_: BGA.Notif<'resultsAvailable'>) {
		this.updateResultPage();
	}

	ntf_switchToTurnbased(_: BGA.Notif<'switchToTurnbased'>) {
		this.showMessage(
			__(
				"lang_mainsite",
				"This Realtime table has been switched to Turnbased table."
			),
			"info"
		);
		setTimeout(
			e.hitch(this, function () {
				window.location.href =
					this.getGameStandardUrl();
			}),
			1e3
		);
	}

	ntf_newPrivateState(t: BGA.Notif<'newPrivateState'>) {
		if (undefined !== t.args.id) {
			undefined === this.gamedatas!.gamestates[t.args.id] &&
				console.error("Unknow gamestate: " + t.args.id);
			undefined !==
				this.gamedatas!.gamestates[t.args.id]!.args &&
				delete this.gamedatas!.gamestates[t.args.id]!
					.args;
			undefined !==
				this.gamedatas!.gamestates[t.args.id]!
					.updateGameProgression &&
				delete this.gamedatas!.gamestates[t.args.id]!
					.updateGameProgression;
			for (var i in this.gamedatas!.gamestates[t.args.id])
				// @ts-ignore - this is a copy
				t.args[i] = this.gamedatas!.gamestates[t.args.id][i];
		}
		if (this.gamedatas!.gamestate.private_state) {
			e.removeClass(
				"overall-content",
				"gamestate_" +
					this.gamedatas!.gamestate.private_state.name
			);
			this.onLeavingState(
				this.gamedatas!.gamestate.private_state.name
			);
		}
		this.gamedatas!.gamestate.private_state = e.clone(t.args) as any;
		this.gamedatas!.gamestate.private_state!.name;
		t.args;
		this.updatePageTitle(
			this.gamedatas!.gamestate.private_state
		);
		e.style("pagemaintitle_wrap", "display", "block");
		e.style("gameaction_status_wrap", "display", "none");
		e.addClass(
			"overall-content",
			"gamestate_" + t.args.name
		);
		// @ts-ignore - typescript is unable to couple the name and state for some reason.
		this.onEnteringState(t.args.name, t.args);
	}

	saveclient() {
		this.save = e.clone($("game_play_area")!);
	}

	restoreClient() {
		e.destroy("game_play_area");
		e.place(this.save!, "game_play_area_wrap");
	}

	decodeHtmlEntities(e: string) {
		var t = document.createElement("textarea");
		t.innerHTML = e;
		return t.value;
	}

	applyTranslationsOnLoad() {
		e.query<HTMLElement>(".to_translate").forEach(
			e.hitch(this, function (e) {
				var t = this.decodeHtmlEntities(e.innerHTML),
					i = t.split("£µ;");
				if (i.length > 1) {
					var n = _(i.shift()!);
					for (var o in i) {
						var a = i[o]!.split("µù;");
						2 == a.length &&
							(n = n.replace(a[0]!, a[1]!));
					}
					e.innerHTML = n;
				} else e.innerHTML = _(t);
			})
		);
	}

	showGameRatingDialog() {
		g_sitecore.displayRatingContent("game", {
			table: this.table_id!,
			rating: null,
			issue: null,
			text: null,
		});
	}

	//#endregion
}

let Gamegui = declare("ebg.core.gamegui", [ebg.core.sitecore, Gamegui_Template]);
export = Gamegui;

declare global {
	namespace BGA {
		type Gamegui = typeof Gamegui;
		interface EBG { core: EBG_CORE; }
		interface EBG_CORE { gamegui: Gamegui; }
	}

	var ebg: BGA.EBG;

	/** A global variable caused by bad code in ebg/core/gamegui:addActionButton. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var tpl: {
		id: string;
		label: string;
		addclass: string;
	} | undefined;

	/** A global variable caused by bad code in ebg/core/gamegui:switchToGameResults. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var countVisibleDialog: number | undefined;

	/** A global variable caused by bad code in ebg/core/gamegui:buildScoreDlgHtmlContent. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var rank: BGA.ID;

	/** A global variable representing the html score template. See {@link jstpl_score_entry} for the default score template. */
	var jstpl_score_entry_specific: string | undefined;

	var g_gamelogs: Record<BGA.ID, BGA.NotifsPacket> | { data: { data: Record<BGA.ID, BGA.NotifsPacket> } };

	/** A global variable caused by bad code in ebg/core/gamegui:displayTableWindow. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var col_id: string | undefined;

	interface Window extends Type<{
		[hotseat_iframe: `hotseat_iframe_${number}`]: HTMLIFrameElement
	}> {}
}
