import e = require("dojo");
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
declare global {
    namespace BGA {
        interface UserPreference {
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
        interface UserPreferences {
            "200": {
                name: "Display tooltips";
                needReload: false;
                generic: true;
                values: [{
                    name: "Enabled";
                }, {
                    name: "Disabled";
                }];
                value: 0;
            };
        }
        interface IntrinsicGameAjaxActions {
            showCursorClick: {
                path: string;
            };
            startgame: {};
            wakeup: {
                myturnack: true;
                table: BGA.ID;
            };
            wakeupPlayers: {};
            aiNotPlaying: {
                table: BGA.ID;
            };
            skipPlayersOutOfTime: {
                _successargs: [
                    {
                        data: {
                            names: string[];
                            delay: number;
                        };
                    }
                ];
                warn?: boolean;
            };
            zombieBack: {};
            gamedatas: {};
            activeTutorial: {
                active: 0 | 1;
            };
            seenTutorial: {
                id: BGA.ID;
            };
            endLockScreen: {};
            onGameUserPreferenceChanged: {
                id: BGA.ID;
                value: BGA.ID;
            };
        }
        interface AjaxActions extends Type<{
            [K in keyof IntrinsicGameAjaxActions as `/${string}/${string}/${K}.html`]: IntrinsicGameAjaxActions[K];
        }> {
            "/table/table/checkNextMove.html": {
                _successargs: [status: 'ok' | string];
            };
            "/table/table/concede.html?src=menu": {
                table: BGA.ID;
            };
            "/table/table/concede.html?src=alt": {
                table: BGA.ID;
            };
            "/table/table/concede.html?src=top": {
                table: BGA.ID;
            };
            "/table/table/decide.html": {
                type: 'none' | "abandon" | "switch_tb" | null;
                decision: 0 | 1;
                table: BGA.ID;
            };
            "/table/table/decide.html?src=menu": {
                type: 'none' | "abandon" | "switch_tb" | null;
                decision: 0 | 1;
                table: BGA.ID;
            };
            "/archive/archive/fastRegistration.html": {
                email: string;
            };
            "/table/table/expressGameStopTable.html": {
                table: BGA.ID;
            };
            "/table/table/tableinfos.html": {
                _successargs: [TableResultsData];
                id: BGA.ID;
                nosuggest: true;
            };
            "/playernotif/playernotif/getNotificationsToBeSplashDisplayed.html": {
                _successargs: [Record<string, SplashNotifsToDisplay>];
            };
            "/table/table/createnew.html": {
                game: BGA.ID;
                rematch: BGA.ID;
                src: "R";
            };
            "/table/table/wouldlikethink.html": {};
            "/archive/archive/rateTutorial.html": {
                id: BGA.ID;
                rating: BGA.ID;
                move: number;
            };
            "/archive/archive/addArchiveComment.html": {
                table: BGA.ID;
                viewpoint: BGA.ID;
                move: number;
                text: string;
                anchor: string | "archivecontrol_editmode_centercomment" | "page-title";
                aftercomment: BGA.ID;
                afteruid: BGA.ID | HexString;
                continuemode: string;
                displaymode: string;
                pointers: string;
            };
            "/archive/archive/updateArchiveComment.html": {
                comment_id: BGA.ID;
                text: string;
                anchor: string | "archivecontrol_editmode_centercomment" | "page-title";
                continuemode?: string;
                displaymode?: string;
                pointers?: string;
            };
            "/archive/archive/deleteArchiveComment.html": {
                id: BGA.ID;
            };
            "/archive/archive/publishTutorial.html": {
                id: BGA.ID;
                intro: "";
                lang: BGA.LanguageCode;
                viewpoint: BGA.ID;
            };
            "/table/table/debugSaveState.html": {
                table: BGA.ID;
                state: BGA.ID | string;
            };
            "/table/table/loadSaveState.html": {
                table: BGA.ID;
                state: BGA.ID | string;
            };
            "/table/table/loadBugReport.html": {
                table: BGA.ID;
                bugReportId: BGA.ID;
            };
            "/table/table/updateTurnBasedNotes.html": {
                value: string;
                table: BGA.ID;
            };
            "/table/table/thumbUpLink.html": {
                id: BGA.ID;
            };
            "/table/table/changeGlobalPreference.html": {
                id: BGA.ID;
                value: string;
            };
            "/table/table/changePreference.html": {
                id: BGA.ID;
                value: number;
                game: string;
            };
            "/gamepanel/gamepanel/getRanking.html": {
                game: BGA.ID;
                start: number;
                mode: "arena" | "elo";
            };
            "/table/table/judgegivevictory.html": {
                id: BGA.ID;
                winner: BGA.ID;
            };
            "/gamepanel/gamepanel/getWikiHelp.html": {
                gamename: string;
                section: "help" | "tips";
            };
            "/table/table/quitgame.html?src=panel": {
                table: BGA.ID;
                neutralized: boolean;
                s: "gameui_neutralized";
            };
        }
        interface TopicArgs {
            "lockInterface": [
                {
                    status: "outgoing" | "queued" | "dispatched" | "updated" | "recorded";
                    uuid: string;
                    bIsTableMsg?: boolean;
                    type?: "player" | "table" | null;
                }
            ];
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
interface Gamegui_Template extends Type<InstanceType<typeof ebg.core.sitecore> & {
    game_name: string;
    gamedatas: BGA.Gamedatas | null;
    player_id: BGA.ID | null;
    table_id: BGA.ID | null;
    isSpectator: boolean;
}> {
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
declare class Gamegui_Template {
    /** The human readable name which should be displayed to the user. (Looks like it is already translated, but could wrong) */
    game_name_displayed: string;
    /** The channel for this game's table. This will always match `table/t${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
    channel: `/table/t${number}` | null;
    /** The channel for the current player. This will always match `player/p${private_channel_id}`. This is null only when accessing from within the constructor. */
    privatechannel: `/player/p${HexString}` | null;
    /** The channel for this game's table spectators. This will always match `table/ts${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
    tablechannelSpectators: `/table/ts${number}` | null;
    /** Unmodified clone of the gamedatas gamestate. See {@link restoreServerGameState} for more information. This is null only when accessing from within the constructor. */
    last_server_state: BGA.IActiveGameState | null;
    /** Boolean indicating that the current game state is a client state, i.e. we have called {@link setClientState} and have not yet sent anything to the server. */
    on_client_state: boolean;
    /** How the log is currently layed out within the DOM. */
    log_mode: 'normal' | '2cols';
    /** The current status, almost entirely used for managing the interface lock. */
    interface_status: 'updated' | 'outgoing' | 'recorded' | 'queued' | 'dispatched';
    /** If the interface lock should lock the table or the player. */
    interface_locking_type: null | 'table' | 'player';
    /** True if an element with the id 'notifwindow_beacon' exits. Used for game setup. */
    isNotifWindow: boolean;
    /** When not null, this is a counter used to blink the current active player based on the 'wouldlikethink_button'. */
    lastWouldLikeThinkBlinking: number | null;
    /** Buy Link Id. The url for the buy link. */
    blinkid: string | null;
    /** The human readable target for the {@link blinkid}. */
    blinkdomain?: string;
    /** Boolean for if this game is currently in developermode. This is the game as checking if element id 'debug_output' exists. */
    developermode: boolean;
    /** If true, this is a sandbox game. Sandbox games are mostly non-scripted and act like a table top simulator rather than a traditional BGA game. */
    is_sandbox: boolean;
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
    GAMEPREFERENCE_DISPLAYTOOLTIPS: 200;
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
    scoreCtrl: Record<BGA.ID, InstanceType<BGA.Counter>>;
    /** The html loaded into the 'game_play_area' element on completesetup. */
    original_game_area_html?: string;
    players_metadata?: Record<BGA.ID, BGA.PlayerMetadata>;
    constructor();
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
    setup(gamedatas: BGA.Gamedatas, keep_existing_gamedatas_limited: boolean): void;
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
    onEnteringState(...[stateName, state]: BGA.GameStateTuple<['name', 'state']>): void;
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
    onLeavingState(stateName: BGA.ActiveGameState["name"]): void;
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
    onUpdateActionButtons(...[stateName, args]: BGA.GameStateTuple<['name', 'args']>): void;
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
    /**
     * Returns true if the player on whose browser the code is running is currently active (it's his turn to play). Note: see remarks above about usage of this function inside onEnteringState method.
     * @returns true if the player on whose browser the code is running is currently active (it's his turn to play).
     * @example if (this.isCurrentPlayerActive()) { ... }
     */
    isCurrentPlayerActive(): boolean;
    /**
     * Returns the id of the active player. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
     * @returns The id of the active player.
     */
    getActivePlayerId(): BGA.ID | null;
    /**
     * Returns the ids of the active players. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
     * @returns The ids of the active players.
     */
    getActivePlayers(): BGA.ID[];
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
    checkAction(e: Default<keyof BGA.GameStatePossibleActions, string>, nomessage?: true): boolean;
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
    checkPossibleActions(action: Default<keyof BGA.GameStatePossibleActions, string>): boolean;
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
    checkLock(nomessage?: true): boolean;
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
    showMoveUnauthorized(): void;
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
    addActionButton(id: string, label: string, method: keyof this | DojoJS.BoundFunc<this, [GlobalEventHandlersEventMap['click']]>, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none'): void;
    /** Removes all buttons from the title bar. */
    removeActionButtons(): void;
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
    updatePageTitle(stateArgs?: BGA.IActiveGameState | null): void;
    /**
     * Disables the player panel for a given player. Usually, this is used to signal that this player passes, or will be inactive during a while. Note that the only effect of this is visual. There are no consequences on the behaviour of the panel itself.
     * @param player_id The id of the player to disable the panel for.
     */
    disablePlayerPanel(player_id: number): void;
    /**
     * Enables a player panel that has been {@link disablePlayerPanel | disabled} before.
     * @param player_id The id of the player to enable the panel for.
     */
    enablePlayerPanel(player_id: number): void;
    /**
     * Enables all player panels that have been {@link disablePlayerPanel | disabled} before.
     */
    enableAllPlayerPanels(): void;
    /**
     * Updates the player ordering in the player's panel to match the current player order. This is normally called by the framework, but you can call it yourself if you change `this.gamedatas.playerorder` from a notification. Also you can override this function to change defaults OR insert a non-player panel.
     */
    updatePlayerOrdering(): void;
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
    dontPreloadImage(image_file_name: string): void;
    /**
     * Ensures specific images are loaded. This is the opposite of {@link dontPreloadImage | dontPreloadImage} - it ensures specific images are loaded. Note: only makes sense if preload list is empty, otherwise everything is loaded anyway.
     * @param list The list of images to ensure are loaded.
     * @example
     * this.ensureSpecificGameImageLoading( to_preload );
     */
    ensureSpecificGameImageLoading(list: string[]): void;
    /** Disables the standard "move" sound or this move (so it can be replaced with a custom sound). This only disables the sound for the next move. */
    disableNextMoveSound(): void;
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
    setClientState(newState: BGA.IActiveGameState['name'], args: BGA.IActiveGameState['args']): void;
    /** If you are in client state it will restore the current server state (cheap undo). */
    restoreServerGameState(): void;
    /** A function that can be overridden to manage some resizing on the client side when the browser window is resized. This function is also triggered at load time, so it can be used to adapt to the viewport size at the start of the game too. */
    onScreenWidthChange(): void;
    /** Returns "studio" for studio and "prod" for production environment (i.e. where games current runs). Only useful for debbugging hooks. Note: alpha server is also "prod" */
    getBgaEnvironment(): 'studio' | 'prod';
    /** Not officially documented! Forces all resize events to activate. */
    sendResizeEvent(): void;
    /** Not officially documented! Gets the html element for the replay log. */
    getReplayLogNode(): HTMLElement | undefined | null;
    onGameUserPreferenceChanged?: (pref_id: number, value: number) => void;
    /** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
    currentPlayerReflexionTime: {
        positive: boolean;
        mn: number;
        s: number;
    };
    /** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
    activePlayerReflexionTime: {
        positive: boolean;
        mn: number;
        s: number;
    };
    /** Internal. The `setTimeout` used for updating the reflexion time. This is called every 100ms whenever a timer is running. */
    clock_timeout: number | null;
    /** Internal. @deprecated This has been joined with {@link clock_timeout}. */
    clock_opponent_timeout: null;
    /** Internal. Timout for automatically calling {@link sendWakeUpSignal}. See {@link sendWakeupInTenSeconds} for more information. */
    wakeup_timeout: number | null;
    /** Internal. @deprecated This is not used within the main code file anymore. */
    wakupchek_timeout: null;
    /** Internal. This is the user id that is appended as a ajax argument to replay from messages. */
    forceTestUser: BGA.ID | null;
    /** Internal. When about to switch to a private game state, this will be populated with the arguments for that state. Next time the game state is changed, this will be consumed. */
    next_private_args: BGA.ActiveGameState['args'];
    /** Internal. Counter for the index of archived log messages. Used to populating notifications that have passed any don't need to be processed like normal. */
    next_archive_index: number;
    /** Internal. When in archive mode, this is used to manage the state of the archive playback. */
    archive_playmode: 'stop' | 'goto' | 'nextlog' | 'nextturn' | 'play' | 'nextcomment';
    /** Internal. The move id that should be used when starting archive playback. */
    archive_gotomove: number | null;
    /** Internal. The previous active player, use for updating the archive playback correctly. */
    archive_previous_player: BGA.ID | null;
    /** Internal. Special UID counter used for archive messages. */
    archive_uuid: number;
    /** Internal. Used to manage archive comments. */
    archiveCommentNew: DijitJS.TooltipDialog | null;
    /** Internal. Used to manage archive comments. */
    archiveCommentNewAnchor: string | "archivecontrol_editmode_centercomment" | "page-title";
    /** Internal. Used to manage archive comments. */
    archiveCommentNo: number;
    /** Internal. Used to manage archive comments. */
    archiveCommentNbrFromStart: number;
    /** Internal. Used to manage archive comments. */
    archiveCommentLastDisplayedNo: BGA.ID;
    /** Internal. Used to manage archive comments. */
    archiveCommentLastDisplayedId: string | number;
    /** Internal. Used to manage archive comments. */
    archiveCommentMobile: {
        id: string | number;
        anchor: string | "archivecontrol_editmode_centercomment" | "page-title";
        bCenter: boolean;
        lastX: number;
        lastY: number;
        timeout?: number;
    };
    /** Internal. Used to manage archive comments. */
    archiveCommentPosition: string[];
    /** Internal. Used to manage archive comments. */
    bJumpToNextArchiveOnUnlock: boolean;
    /** Internal. Used to manage archive comments. */
    archiveCommentAlreadyDisplayed: Record<string, boolean>;
    /** Internal. Used to manage tutorial elements. */
    tuto_pointers_types_nbr: 20;
    /** Internal. Used to manage tutorial elements. */
    tuto_textarea_maxlength: 400;
    /** Internal. The chat component for the table. */
    tablechat: InstanceType<BGA.ChatInput> | null;
    /** Internal. Used to pass video/audio chat between links. */
    mediaRatingParams: string;
    /** Internal. @deprecated This is not used within the main code file anymore. */
    quitDlg: null;
    /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */
    nextPubbanner: null | number;
    /** Internal. If not null, then the interface is locked and this represent the id of the lock (some unique key). The interface can only be unlocked by this same id. See {@link isInterfaceLocked}, {@link isInterfaceUnlocked}, {@link unlockInterface}, {@link lockInterface}. */
    interface_locked_by_id: number | string | object | null | undefined;
    /** Internal. @deprecated This is not used within the main code file anymore. I believe this was replaced by ajax calls and the newer way to check preferences. */
    gamepreferences_control: {};
    /** Internal. The last notification containing the spectator list. This is used when re-updating the list. */
    last_visitorlist: BGA.NotifTypes['updateSpectatorList'] | null;
    /** Internal. The js template for player tooltips. Note that this is left as a string literal for convenience but may have been changed. */
    jstpl_player_tooltip: string;
    /** Internal. This is not set anywhere in the source code, but looks like it should be a playerlocation component. */
    playerlocation: null;
    /** Internal. A record for looking up replay points. When the user click on a replay button, this is used to find the id to replay from. */
    log_to_move_id: Record<number, BGA.ID>;
    /** Internal. A record of tutorial dialogs. This is used for managing dialogs by id rather than reference. */
    tutorialItem: Record<string, DijitJS.Dialog | DijitJS.TooltipDialog>;
    /** Internal. True if this was previously the current active player. Updated whenever a notification packet is successfully dispatched. */
    current_player_was_active: boolean;
    /** Internal. Represents if this game client is *visually* the active player. This is only updated after {@link updateActivePlayerAnimation}. */
    current_player_is_active: boolean;
    /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
    showOpponentCursorMouveOver: DojoJS.Handle | null;
    /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
    showOpponentCursorClickHook: DojoJS.Handle | null;
    /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
    showOpponentCursorClickCounter: number;
    /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
    showOpponentCursorClickCooldown: number | null;
    /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
    showOpponentCursorClickNumberSinceCooldown: number;
    /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
    showOpponentCursorTimeout?: number | null;
    /** Internal. Used purely for {@link registerEbgControl} and {@link destroyAllEbgControls}. */
    ebgControls: {
        destroy?(): any;
    }[];
    /** Internal. @deprecated This is not used within the main code file anymore. */
    bThisGameSupportFastReplay: boolean;
    /** Internal. Record for the loading status for an image url, where false is not loaded and true is loaded. */
    images_loading_status: Record<string, boolean>;
    /** Internal. Used for presentation when resynchronizing notifications (re-downloading). */
    log_history_loading_status: {
        downloaded: number;
        total: number;
        loaded: number;
    };
    /** Internal. The js template for player ranking. Note that this is left as a string literal for convenience but may have been changed. */
    jstpl_player_ranking: string;
    /** Internal. The js template for a hotseat player. Note that this is left as a string literal for convenience but may have been changed. */
    jstpl_hotseat_interface: string;
    /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
    control3dxaxis: number;
    /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
    control3dzaxis: number;
    /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
    control3dxpos: number;
    /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
    control3dypos: number;
    /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
    control3dscale: number;
    /** Internal. If 3d controls are enabled. See {@link init3d}. */
    control3dmode3d: boolean | 0 | 1;
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
    hotseat_interface?: 'normal' | 'hotseataccount' | 'single_screen';
    /** Internal. WIP */
    hotseatplayers?: number[];
    bDisableNextMoveOnNextSound?: boolean;
    lockScreenTimeout?: number;
    turnBasedNotesPopupIncent?: DijitJS.TooltipDialog;
    /** If the game/table being viewed is an outdated version of the game. */
    gameUpgraded?: boolean;
    paymentbuttons?: InstanceType<BGA.PaymentButtons>;
    playingHours?: {
        0: boolean;
        1: boolean;
        2: boolean;
        3: boolean;
        4: boolean;
        5: boolean;
        6: boolean;
        7: boolean;
        8: boolean;
        9: boolean;
        10: boolean;
        11: boolean;
        12: boolean;
        13: boolean;
        14: boolean;
        15: boolean;
        16: boolean;
        17: boolean;
        18: boolean;
        19: boolean;
        20: boolean;
        21: boolean;
        22: boolean;
        23: boolean;
    };
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
    archiveCommentImageToAnchor?: string;
    updatedReflexionTime?: {
        initial: {
            [playerId: BGA.ID]: number;
        };
        initial_ts: {
            [playerId: BGA.ID]: number;
        };
        total: {
            [playerId: BGA.ID]: number;
        };
    };
    currentPlayerReflexionStartAt?: number;
    wakeupcheck_timeout?: number | null;
    fireDlg?: InstanceType<BGA.PopinDialog> & {
        telParentPage: Gamegui_Template;
    };
    fireDlgStatus?: string;
    list_of_players_to_expel?: string[];
    savedSynchronousNotif?: {
        [K in keyof BGA.NotifTypes]?: number;
    };
    archiveCommentPointElementMouseEnterEvt?: DojoJS.Handle | null;
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
    completesetup(game_name: string, game_name_displayed: string, table_id: BGA.ID, player_id: BGA.ID, credentials: HexString | null, privatechannel_id: HexString | null, cometd_service: "keep_existing_gamedatas_limited" | "socketio" | string, gamedatas: BGA.Gamedatas, players_metadata: Record<BGA.ID, BGA.PlayerMetadata> | null, socket_uri: `https://${string}:${number}` | null, socket_path?: 'r' | string): void;
    onReconnect(): void;
    onGsSocketIoConnectionStatusChanged(statusType: 'connect' | 'connect_error' | 'connect_timeout' | 'reconnect' | 'reconnect_attempt' | 'reconnect_error' | 'reconnect_failed', errorMessage?: any): void;
    updatePremiumEmblemLinks(): void;
    onGameUiWidthChange(): void;
    onZoomToggle(t: Event): void;
    adaptStatusBar(): void;
    adaptPlayersPanels(): void;
    activeShowOpponentCursor(): void;
    showOpponentCursorClick(t: MouseEvent): void;
    unactiveShowOpponentCursor(): void;
    onShowMyCursor(t: MouseEvent): void;
    onHideCursor(t: MouseEvent): void;
    getCursorInfos(e: boolean): {
        id: string;
        x: number;
        y: number;
    }[] | null;
    showOpponentCursorSendInfos(): void;
    onShowOpponentCursorMouseOver(e: MouseEvent): void;
    getGameStandardUrl(): string;
    showIngameMenu(): void;
    hideIngameMenu(): void;
    toggleIngameMenu(t: MouseEvent): void;
    getPlayerTooltip(player_metadata: BGA.PlayerMetadata): string;
    onStartGame(): void;
    onNotificationPacketDispatched(): void;
    updateActivePlayerAnimation(): boolean;
    isPlayerActive(playerId: BGA.ID | null | undefined): boolean;
    updateVisitors(t: Record<BGA.ID, string>): void;
    onBanSpectator(t: MouseEvent): void;
    switchToGameResults(): void;
    eloEndOfGameAnimation(): void;
    eloEndOfGameAnimationWorker(): void;
    updateResultPage(): void;
    loadTrophyToSplash(e: Record<BGA.ID, BGA.TableResultTrophies>): void;
    displayScores(): void;
    buildScoreDlgHtmlContent(t: BGA.GameStateArgs['argGameEnd']['result']): {
        html: string;
        title: string | null;
        result_for_current_player: string;
        tied_scores: (string | number)[];
    };
    onFBReady(): void;
    onShowGameResults(): void;
    onGameEnd(): void;
    prepareMediaRatingParams(): void;
    getMediaRatingParams(firstParam?: boolean): string;
    redirectToTablePage(): void;
    redirectToTournamentPage(): void;
    redirectToLobby(): void;
    redirectToMainsite(): void;
    redirectToGamePage(): void;
    doRedirectToMetasite(): void;
    onBackToMetasite(event: Event): void;
    onCreateNewTable(): void;
    onProposeRematch(): void;
    onBuyThisGame(): void;
    ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(...[url, args, scope, onSuccess, callback, ajax_method]: BGA.AjaxParams<Action, Scope>): unknown;
    onGlobalActionPause(e: MouseEvent): void;
    onGlobalActionFullscreen(t: MouseEvent): boolean;
    switchLogModeTo(t: 0 | 1 | boolean): void;
    onGlobalActionPreferences(): void;
    onGlobalActionHelp(): void;
    onGlobalActionBack(t: MouseEvent): void;
    onGlobalActionQuit(t: MouseEvent): void;
    onNewLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): void;
    addMoveToLog(t: number, i: BGA.ID): void;
    onChangeContentHeight(): void;
    onReplayFromPoint(t: MouseEvent): void;
    updateDecisionPanel(t: BGA.NotifTypes['tableDecision']): void;
    onPlayerDecide(e: MouseEvent): void;
    updateReflexionTimeDisplay(): void;
    updateReflexionTime(t: boolean): void;
    shouldDisplayClockAlert(player_id: BGA.ID): boolean;
    updateFirePlayerLink(): void;
    onWouldLikeToThink(e: MouseEvent): void;
    sendWakeupInTenSeconds(): void;
    sendWakeUpSignal(): void;
    cancelPlannedWakeUp(): void;
    checkWakupUpInFourteenSeconds(): void;
    checkWakups(): void;
    cancelPlannedWakeUpCheck(): void;
    isInterfaceLocked(): boolean;
    isInterfaceUnlocked(): boolean;
    lockInterface(lock?: Gamegui_Template["interface_locked_by_id"]): void;
    unlockInterface(lock?: Gamegui_Template["interface_locked_by_id"]): void;
    onLockInterface(...[t]: BGA.TopicArgs['lockInterface']): void;
    onAiNotPlaying(t: MouseEvent): void;
    onNotPlayingHelp(e: MouseEvent): void;
    onSkipPlayersOutOfTime(e: MouseEvent): void;
    onWouldFirePlayer(t: MouseEvent): void;
    onDecreaseExpelTime(t: number): void;
    onMove(): void;
    onNextMove(e: BGA.ID): void;
    initArchiveIndex(): void;
    sendNextArchive(): boolean;
    onArchiveNext(e: MouseEvent): void;
    onArchiveNextLog(e: MouseEvent): void;
    doArchiveNextLog(): void;
    onArchiveNextTurn(e: MouseEvent): void;
    onArchiveHistory(t: MouseEvent): void;
    setModeInstataneous(): void;
    unsetModeInstantaneous(): void;
    onLastArchivePlayed(): void;
    onArchiveToEnd(e: MouseEvent): void;
    onArchiveToEndSlow(e: MouseEvent): void;
    onArchiveGoTo(t: MouseEvent): void;
    onEndDisplayLastArchive(): void;
    onArchiveGoToMoveDisplay(): void;
    archiveGoToMove(e: BGA.ID, t: boolean): void;
    showArchiveComment(t: 'saved' | 'edit' | any, i?: number): boolean | {
        notif_uid: string;
    };
    getCommentsViewedFromStart(): number;
    onArchiveCommentMinimize(t: MouseEvent): void;
    onArchiveCommentMaximize(t: MouseEvent): void;
    applyArchiveCommentMarkup(e: string): string;
    onArchiveCommentPointElementOnMouseEnter(t: MouseEvent): void;
    removeArchiveCommentPointElement(): void;
    archiveCommentAttachImageToElement(t: HTMLElement, i?: string, n?: string): void;
    onArchiveCommentPointElementClick(t: MouseEvent): void;
    onArchiveCommentContinueModeChange(t?: Event): void;
    onArchiveCommentDisplayModeChange(e: Event): void;
    onTutoRatingEnter(t: MouseEvent): void;
    onTutoRatingLeave(t: MouseEvent): void;
    onTutoRatingClick(t: MouseEvent): void;
    onRepositionPopop(): void;
    clearArchiveCommentTooltip(): void;
    removeArchiveCommentAssociatedElements(): void;
    onArchiveAddComment(e: MouseEvent): void;
    onNewArchiveCommentCancel(t: MouseEvent): void;
    onNewArchiveCommentSave(t: MouseEvent): void;
    newArchiveCommentSave(): void;
    onNewArchiveCommentSaveModify(t: MouseEvent): void;
    newArchiveCommentSaveModify(t: BGA.ID): void;
    getArchiveCommentsPointers(): string;
    onKeyPressTutorial(t: KeyboardEvent): false | void;
    onKeyUpTutorial(t: KeyboardEvent): false | void;
    onNewArchiveCommentNext(t: MouseEvent): void;
    doNewArchiveCommentNext(): void;
    onNewArchiveCommentDelete(t: MouseEvent): void;
    onNewArchiveCommentModify(t: MouseEvent): void;
    onNewArchiveCommentStartDrag(t: MouseEvent): void;
    onNewArchiveCommentEndDrag(t: MouseEvent): void;
    onNewArchiveCommentDrag(t: MouseEvent): void;
    initCommentsForMove(e: BGA.ID): void;
    onEndOfNotificationDispatch(): void;
    checkIfArchiveCommentMustBeDisplayed(): boolean;
    onHowToTutorial(t: MouseEvent): void;
    onTutoPointerClick(t: MouseEvent): void;
    onPublishTutorial(t: MouseEvent): void;
    onQuitTutorial(t: MouseEvent): void;
    loadReplayLogs(): void;
    replaceArchiveCursor(): void;
    onEditReplayLogsComment(t: MouseEvent): void;
    onRemoveReplayLogsComment(t: MouseEvent): void;
    onEditReplayLogsCommentSave(t: MouseEvent): void;
    onReplayLogClick(t: MouseEvent): void;
    ensureImageLoading(): void;
    ensureSpecificImageLoading(t: string[]): void;
    onLoadImageOk(e: Event): void;
    onLoadImageNok(e: Event): void;
    updateLoaderPercentage(): void;
    displayTableWindow(t: BGA.ID, i: string, n: any, o: any, a: string, s: string): {
        id: string | null;
        target_id: string | null;
        container_id: string;
        resizeHandle: DojoJS.Handle | null;
        closeHandle: DojoJS.Handle | null;
        bCloseIsHiding: boolean;
        onShow: (() => any) | null;
        onHide: (() => any) | null;
        jstpl_standard_popin: string;
        tableModule?: InstanceType<BGA.CorePage>;
        create(id: string, container_div?: string | HTMLElement): void;
        destroy(animate?: boolean): void;
        setCloseCallback(callback: (event: MouseEvent) => any): void;
        hideCloseIcon(): void;
        setTitle(title?: string): void;
        setMaxWidth(maxWidth: number): void;
        setHelpLink(link: string): void;
        setContent(content: string | Node): void;
        show(animate?: boolean): void;
        hide(animate?: boolean): void;
    } & DojoJS.DojoClassObject<{
        id: string | null;
        target_id: string | null;
        container_id: string;
        resizeHandle: DojoJS.Handle | null;
        closeHandle: DojoJS.Handle | null;
        bCloseIsHiding: boolean;
        onShow: (() => any) | null;
        onHide: (() => any) | null;
        jstpl_standard_popin: string;
        tableModule?: InstanceType<BGA.CorePage>;
        create(id: string, container_div?: string | HTMLElement): void;
        destroy(animate?: boolean): void;
        setCloseCallback(callback: (event: MouseEvent) => any): void;
        hideCloseIcon(): void;
        setTitle(title?: string): void;
        setMaxWidth(maxWidth: number): void;
        setHelpLink(link: string): void;
        setContent(content: string | Node): void;
        show(animate?: boolean): void;
        hide(animate?: boolean): void;
    }>;
    updatePubBanner(): void;
    onSaveState(e: MouseEvent): void;
    onLoadState(e: MouseEvent): void;
    onLoadBugReport(e: MouseEvent): void;
    onReloadCss(e: MouseEvent): void;
    getScriptErrorModuleInfos(): string;
    showTutorial(): void;
    onCloseTutorial(t: MouseEvent): void;
    onBeforeChatInput(t: any): boolean;
    showEliminated(): void;
    setLoader(t: number, i: number): void;
    displayZombieBack(): void;
    onZombieBack(t: MouseEvent): void;
    showNeutralizedGamePanel(t: BGA.ID, i: BGA.ID): void;
    setupCoreNotifications(): void;
    ntf_gameStateChange(t: BGA.Notif<'gameStateChange'>): void;
    ntf_gameStateChangePrivateArgs(e: BGA.Notif<'gameStateChangePrivateArg'>): void;
    ntf_gameStateMultipleActiveUpdate(e: BGA.Notif<'gameStateMultipleActiveUpdate'>): void;
    ntf_newActivePlayer(e: BGA.Notif<'newActivePlayer'>): void;
    ntf_playerStatusChanged(t: BGA.Notif<'playerstatus'>): void;
    ntf_yourTurnAck(e: BGA.Notif<'yourturnack'>): void;
    ntf_clockalert(e: BGA.Notif<'clockalert'>): void;
    ntf_tableInfosChanged(e: BGA.Notif<'tableInfosChanged'>): void;
    ntf_playerEliminated(e: BGA.Notif<'playerEliminated'>): void;
    ntf_tableDecision(e: BGA.Notif<'tableDecision'>): void;
    ntf_infomsg(t: BGA.Notif<'infomsg'>): void;
    ntf_archivewaitingdelay(e: BGA.Notif<'archivewaitingdelay'>): void;
    ntf_end_archivewaitingdelay(e: BGA.Notif<'end_archivewaitingdelay'>): void;
    ntf_replaywaitingdelay(e: BGA.Notif<'replaywaitingdelay'>): void;
    ntf_end_replaywaitingdelay(e: BGA.Notif<'end_replaywaitingdelay'>): void;
    ntf_replayinitialwaitingdelay(e: BGA.Notif<'replayinitialwaitingdelay'>): void;
    ntf_end_replayinitialwaitingdelay(e: BGA.Notif<'end_replayinitialwaitingdelay'>): void;
    ntf_replay_has_ended(e: BGA.Notif<'replay_has_ended'>): void;
    onEndOfReplay(): void;
    ntf_updateSpectatorList(e: BGA.Notif<'updateSpectatorList'>): void;
    ntf_tableWindow(e: BGA.Notif<'tableWindow'>): void;
    ntf_wouldlikethink(e: BGA.Notif<'wouldlikethink'>): void;
    ntf_updateReflexionTime(e: BGA.Notif<'updateReflexionTime'>): void;
    ntf_undoRestorePoint(t: BGA.Notif<'undoRestorePoint'>): void;
    ntf_resetInterfaceWithAllDatas(t: BGA.Notif<'resetInterfaceWithAllDatas'>): void;
    ntf_zombieModeFailWarning(e: BGA.Notif<'zombieModeFailWarning'>): void;
    ntf_zombieModeFail(e: BGA.Notif<'zombieModeFail'>): void;
    ntf_aiError(t: BGA.Notif<'aiError'>): void;
    ntf_skipTurnOfPlayer(e: BGA.Notif<'skipTurnOfPlayer'>): void;
    ntf_zombieBack(t: BGA.Notif<'zombieBack'>): void;
    ntf_gameResultNeutralized(e: BGA.Notif<'gameResultNeutralized'>): void;
    ntf_allPlayersAreZombie(t: BGA.Notif<'allPlayersAreZombie'>): void;
    ntf_simplePause(e: BGA.Notif<'simplePause'>): void;
    ntf_showTutorial(t: BGA.Notif<'showTutorial'>): void;
    showTutorialActivationDlg(): void;
    showTutorialItem(t: BGA.Notif<'showTutorial'>): void;
    onTutorialClose(e: MouseEvent): void;
    onTutorialDlgClose(e: MouseEvent): void;
    markTutorialAsSeen(t: BGA.ID): void;
    toggleTurnBasedNotes(): void;
    closeTurnBasedNotes(): void;
    openTurnBasedNotes(t?: string): void;
    onSaveNotes(t: MouseEvent): void;
    onClearNotes(e: MouseEvent): void;
    onSeeMoreLink(t: MouseEvent): void;
    onThumbUpLink(t: MouseEvent): void;
    onChangePreference(e: Event): void;
    handleGameUserPreferenceChangeEvent(pref_id: number, newValue: number): void;
    getGameUserPreference(e: BGA.ID): number;
    setGameUserPreference(e: number, t: number): void;
    getRanking(): void;
    insert_rankings(t: any): void;
    onSeeMoreRanking(t: MouseEvent): void;
    onChangeRankMode(t: MouseEvent): void;
    ntf_aiPlayerWaitingDelay(_: BGA.Notif<'aiPlayerWaitingDelay'>): void;
    ntf_playerConcedeGame(t: BGA.Notif<'playerConcedeGame'>): void;
    ntf_skipTurnOfPlayerWarning(t: BGA.Notif<'skipTurnOfPlayerWarning'>): void;
    ntf_showCursorClick(e: BGA.Notif<'showCursorClick'>): void;
    ntf_showCursor(t: BGA.Notif<'showCursor'>): void;
    onChatKeyDown(t: KeyboardEvent): void;
    onChatInputBlur(e: Event): void;
    onJudgeDecision(e: Event): void;
    registerEbgControl(e: {
        destroy?: () => void;
    }): void;
    destroyAllEbgControls(): void;
    playMusic(_?: unknown): void;
    onShowGameHelp(): void;
    onShowStrategyHelp(): void;
    onShowCompetition(): void;
    onShowTournament(): void;
    lockScreenCounter(): void;
    bgaPerformAction<K extends Default<keyof BGA.GameStatePossibleActions, string>>(e: K, t: BGA.AjaxParams<`/${string}/${string}/${K}.html`, this>[1], i?: {
        lock?: boolean;
        checkAction?: boolean;
        checkPossibleActions?: boolean;
    }): Promise<void> | void;
    /**
     * Return the div on the player board where the dev can add counters and other game specific indicators.
     *
     * @param playerId the player id
     * @returns the div element for game specific content on player panels
     */
    getPlayerPanelElement(playerId: BGA.ID): Element | null;
    loadBgaGameLib(e: string, t: string): Promise<[unknown, unknown]>;
    registerBgaGameLibs(libs: [string, string][]): Promise<void>;
    initHotseat(): void;
    onHotseatPlayButton(t: MouseEvent): void;
    checkHotseatFocus(): void;
    giveHotseatFocusTo(t: BGA.ID): void;
    init3d(): void;
    change3d(t: number, i: number, n: number, o: number, a: number, s: 0 | 1 | boolean, r: 0 | 1 | boolean): void;
    enter3dButton(e: MouseEvent): void;
    leave3dButton(e: MouseEvent): void;
    ntf_banFromTable(e: BGA.Notif<'banFromTable'>): void;
    ntf_resultsAvailable(_: BGA.Notif<'resultsAvailable'>): void;
    ntf_switchToTurnbased(_: BGA.Notif<'switchToTurnbased'>): void;
    ntf_newPrivateState(t: BGA.Notif<'newPrivateState'>): void;
    saveclient(): void;
    restoreClient(): void;
    decodeHtmlEntities(e: string): string;
    applyTranslationsOnLoad(): void;
    showGameRatingDialog(): void;
}
declare let Gamegui: DojoJS.DojoClass<{
    gamedatas?: BGA.Gamedatas | null;
    subscriptions: DojoJS.Handle[];
    tooltips: Record<string, DijitJS.Tooltip>;
    bHideTooltips: boolean;
    screenMinWidth: number;
    currentZoom: number;
    connections: {
        element: any;
        event: string;
        handle: DojoJS.Handle;
    }[];
    instantaneousMode: boolean | 0 | 1;
    webrtc: InstanceType<BGA.WebRTC> | null;
    webrtcmsg_ntf_handle: DojoJS.
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
    Handle | null;
    rtc_mode: 0 | 1 | 2;
    mediaConstraints: BGA.WebRTCMediaConstraints;
    gameMasculinePlayers: string[];
    gameFemininePlayers: string[];
    gameNeutralPlayers: string[];
    emoticons: {
        readonly ":)": "smile";
        readonly ":-)": "smile";
        readonly ":D": "bigsmile";
        readonly ":-D": "bigsmile";
        readonly ":(": "unsmile";
        readonly ":-(": "unsmile";
        readonly ";)": "blink";
        readonly ";-)": "blink";
        readonly ":/": "bad";
        readonly ":-/": "bad";
        readonly ":s": "bad";
        readonly ":-s": "bad";
        readonly ":P": "mischievous";
        readonly ":-P": "mischievous";
        readonly ":p": "mischievous";
        readonly ":-p": "mischievous";
        readonly ":$": "blushing";
        readonly ":-$": "blushing";
        readonly ":o": "surprised";
        readonly ":-o": "surprised";
        readonly ":O": "shocked";
        readonly ":-O": "shocked";
        readonly o_o: "shocked";
        readonly O_O: "shocked";
        readonly "8)": "sunglass";
        readonly "8-)": "sunglass";
    };
    defaultTooltipPosition: DijitJS.PlacePositions[];
    metasiteurl?: string;
    ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
    format_block(template: string, args: Record<string, any>): string;
    format_string(template: string, args: Record<string, any>): string;
    format_string_recursive(template: string, args: Record<string, any> & {
        i18n?: Record<string, any>;
        type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
        message?: string;
        text?: string;
    }): string;
    clienttranslate_string(text: string): string;
    translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
    register_subs(...handles: DojoJS.Handle[]): void;
    unsubscribe_all(): void;
    register_cometd_subs(...comet_ids: string[]): string | string[];
    showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
    placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
    placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
    disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
    enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
    getComputedTranslateZ(element: Element): number;
    transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
    slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
    slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
    slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
    toRadians(angle: number): number;
    vector_rotate(vector: {
        x: number;
        y: number;
    }, angle: number): {
        x: number;
        y: number;
    };
    attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
    attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
    slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
    slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
    fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
    rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
    rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
    rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
    getAbsRotationAngle(target: string | Element | null): number;
    addClassToClass<T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]): void;
    connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
    connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U, method: keyof any): void;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>, any>>(targetObject: T, event: U, method: M, dontFix?: boolean): void;
    disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
    disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U): void;
    connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
    connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
    connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
    connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M): void;
    addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
    addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
    disconnectAll(): void;
    setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
    incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
    decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
    updateCounters(counters?: Partial<{
        [x: string]: {
            counter_value: BGA.ID;
            counter_name: string;
        };
    } | undefined>): void;
    getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
    addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
    addTooltipHtml(target: string, html: string, delay?: number): void;
    addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
    addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
    removeTooltip(target: string): void;
    switchDisplayTooltips(displayType: 0 | 1): void;
    applyCommentMarkup(text: string): string;
    confirmationDialog<T = null>(message: string, yesHandler: (param: T) => any, noHandler?: ((param: T) => any) | undefined, param?: T | undefined): void;
    warningDialog(message: string, callback: () => any): void;
    infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
    multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
    askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
    displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
    showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
    showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
    getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
    getKarmaLabel(karma: number | string): {
        label: "Perfect" | string;
        css: "exceptional";
    } | {
        label: "Excellent" | string;
        css: "perfect";
    } | {
        label: "Very good" | string;
        css: "verygood";
    } | {
        label: "Good" | string;
        css: "good";
    } | {
        label: "Average" | string;
        css: "average";
    } | {
        label: "Not good" | string;
        css: "notgood";
    } | {
        label: "Bad" | string;
        css: "bad";
    } | {
        label: "Very bad" | string;
        css: "verybad";
    } | undefined;
    getObjectLength(obj: object): number;
    comet_subscriptions: string[];
    unload_in_progress: boolean;
    bCancelAllAjax: boolean;
    tooltipsInfos: Record<string, {
        hideOnHoverEvt: DojoJS.Handle | null;
    }>;
    mozScale: number;
    rotateToPosition: Record<string, number>;
    room: BGA.RoomId | null;
    already_accepted_room: BGA.RoomId | null;
    webpush: InstanceType<BGA.WebPush> | null;
    interface_min_width?: number;
    confirmationDialogUid?: number;
    confirmationDialogUid_called?: number;
    discussionTimeout?: Record<string, number>;
    showclick_circles_no?: number;
    number_of_tb_table_its_your_turn?: number;
    prevent_error_rentry?: number;
    transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
    onresizePlayerAwardsEvent?: DojoJS.Handle;
    gameinterface_zoomFactor?: number;
    ajaxpageload<Scope>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope, callback: DojoJS.HitchMethod<Scope, [data: any], any>): {
        new (): import("../../dojo/promise/Promise")<any>;
    };
    displayUserHttpError(error_code: string | number | null): void;
    cancelAjaxCall(): void;
    applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
    adaptScreenToMinWidth(min_width: number): void;
    adaptScreenToMinWidthWorker(): void;
    getObjPosition(obj: HTMLElement | string): {
        x: number;
        y: number;
    };
    doShowBubble(anchor: string, message: string, custom_class?: string): void;
    getGameNameDisplayed(text: string): string;
    formatReflexionTime(time: number): {
        string: string;
        mn: number;
        s: (string | number);
        h: number;
        positive: boolean;
    };
    strip_tags(e: string, t?: string): string;
    validURL(e: any): boolean;
    nl2br(e: any, t: any): string;
    htmlentities(e: string, t: any, i: any, n: any): string | false;
    html_entity_decode(e: any, t: any): string | false;
    get_html_translation_table(e: any, t: any): Record<string, string>;
    ucFirst(e: any): any;
    setupWebPush(): Promise<void>;
    refreshWebPushWorker(): void;
    getRTCTemplate(e: any, t: any, i: any): string;
    setupRTCEvents(t: string): void;
    getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
        mandatory: {
            minAspectRatio: number;
            maxAspectRatio: number;
            maxWidth: number;
            maxFrameRate: number;
        };
        optional: never[];
    };
    startRTC(): void;
    doStartRTC(): void;
    onGetUserMediaSuccess(): void;
    onGetUserMediaError(): void;
    onJoinRoom(t: any, i: any): void;
    onClickRTCVideoMax(t: Event): void;
    maximizeRTCVideo(t: any, i: any): void;
    onClickRTCVideoMin(t: any): void;
    onClickRTCVideoSize(t: any): void;
    onClickRTCVideoMic(t: any): void;
    onClickRTCVideoSpk(t: any): void;
    onClickRTCVideoCam(t: any): void;
    onLeaveRoom(t: any, i: any): void;
    onLeaveRoomImmediate(e: any): void;
    doLeaveRoom(e?: any): void;
    clearRTC(): void;
    ntf_webrtcmsg(e: any): void;
    addSmileyToText(e: string): string;
    getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
    makeClickableLinks(e: any, t: any): any;
    makeBgaLinksLocalLinks(e: any): any;
    ensureEbgObjectReinit(e: any): void;
    getRankClassFromElo(e: any): string;
    getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
    getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
    eloToBarPercentage(e: any, t?: boolean): number;
    formatElo(e: string): number;
    formatEloDecimal(e: any): number;
    getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
    getArenaLabel(e: any, t?: any): string;
    insertParamIntoCurrentURL(e: any, t: any): void;
    playerawardsCollapsedAlignement(): void;
    playerawardCollapsedAlignement(t: any): void;
    arenaPointsDetails(e: any, t?: any): {
        league: 0 | 1 | 2 | 3 | 4 | 5;
        league_name: string;
        league_shortname: string;
        league_promotion_shortname: string;
        points: number;
        arelo: number;
    };
    arenaPointsHtml(t: {
        league_name: string;
        league: 0 | 1 | 2 | 3 | 4 | 5;
        arelo: number;
        points: number | null;
        league_promotion_shortname?: string | null;
    }): {
        bar_content: string;
        bottom_infos: string;
        bar_pcent: string;
        bar_pcent_number: string | number;
    };
    declaredClass: string;
    inherited<U>(args: IArguments): U;
    inherited<U>(args: IArguments, newArgs: any[]): U;
    inherited(args: IArguments, get: true): Function | void;
    inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
    inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
    __inherited: DojoJS.DojoClassObject["inherited"];
    getInherited(args: IArguments): Function | void;
    getInherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments): DojoJS.Hitched<any, T, []>;
    isInstanceOf(cls: any): boolean;
} & {
    game_name?: string;
    notifqueue: {
        synchronous_notifs: { [K in keyof BGA.NotifTypes]?: number; };
        ignoreNotificationChecks: { [T in keyof BGA.NotifTypes]?: ((notif: BGA.Notif<T>) => boolean); };
        setIgnoreNotificationCheck<T extends keyof BGA.NotifTypes>(notif_type: T, predicate: ((notif: BGA.Notif<T>) => boolean)): void;
        setSynchronous(notif_type: keyof BGA.NotifTypes, duration?: number): void;
        setSynchronousDuration(duration: number): void;
        queue: BGA.Notif[];
        next_log_id: number;
        game: InstanceType<BGA.SiteCore> | null;
        dispatchedNotificationUids: string[];
        checkSequence: boolean;
        last_packet_id: BGA.ID;
        notificationResendInProgress: boolean;
        waiting_from_notifend: null | BGA.Notif;
        playerBufferQueue: Record<string, {
            notifs: BGA.NotifsPacket;
            counter: number;
        }>;
        debugnotif_i: number;
        currentNotifCallback: keyof BGA.NotifTypes | null;
        onPlaceLogOnChannel: ((chatnotif: BGA.ChatNotif) => void) | null;
        lastMsgTime: number;
        logs_to_load?: BGA.NotifsPacket[];
        logs_to_load_sortedNotifsKeys?: string[];
        logs_to_load_loadhistory?: number;
        bStopAfterOneNotif?: boolean;
        cometd_service?: "keep_existing_gamedatas_limited" | "socketio" | string;
        onNotification(notifs_or_json: BGA.NotifsPacket | string): void;
        resynchronizeNotifications(isHistory: boolean): void;
        pullResynchronizeLogsToDisplay(): void;
        dispatchNotifications(): boolean;
        formatLog(message: string, args: {
            player_name: string;
            player_id: BGA.ID;
            i18n?: string;
            [key: string]: any;
        }): string;
        dispatchNotification(notif: BGA.Notif, disableSound?: boolean): boolean;
        addChatToLog(message: string, seeMore?: boolean, translateIcon?: boolean, extraClasses?: string): void;
        onTranslateLog(event: Event): void;
        addToLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): number;
        playerNameFilter(args: {
            player_name?: string;
            player_id?: BGA.ID;
            is_admin?: boolean;
        }): {
            player_name?: string;
            player_id?: BGA.ID;
            is_admin?: boolean;
        };
        playerNameFilterGame(args: undefined): void;
        isSynchronousNotifProcessed(): boolean;
        onSynchronousNotificationEnd(): void;
        debugReplayNotif(event: Event): void;
    } & DojoJS.DojoClassObject<{
        synchronous_notifs: { [K in keyof BGA.NotifTypes]?: number; };
        ignoreNotificationChecks: { [T in keyof BGA.NotifTypes]?: ((notif: BGA.Notif<T>) => boolean); };
        setIgnoreNotificationCheck<T extends keyof BGA.NotifTypes>(notif_type: T, predicate: ((notif: BGA.Notif<T>) => boolean)): void;
        setSynchronous(notif_type: keyof BGA.NotifTypes, duration?: number): void;
        setSynchronousDuration(duration: number): void;
        queue: BGA.Notif[];
        next_log_id: number;
        game: InstanceType<BGA.SiteCore> | null;
        dispatchedNotificationUids: string[];
        checkSequence: boolean;
        last_packet_id: BGA.ID;
        notificationResendInProgress: boolean;
        waiting_from_notifend: null | BGA.Notif;
        playerBufferQueue: Record<string, {
            notifs: BGA.NotifsPacket;
            counter: number;
        }>;
        debugnotif_i: number;
        currentNotifCallback: keyof BGA.NotifTypes | null;
        onPlaceLogOnChannel: ((chatnotif: BGA.ChatNotif) => void) | null;
        lastMsgTime: number;
        logs_to_load?: BGA.NotifsPacket[];
        logs_to_load_sortedNotifsKeys?: string[];
        logs_to_load_loadhistory?: number;
        bStopAfterOneNotif?: boolean;
        cometd_service?: "keep_existing_gamedatas_limited" | "socketio" | string;
        onNotification(notifs_or_json: BGA.NotifsPacket | string): void;
        resynchronizeNotifications(isHistory: boolean): void;
        pullResynchronizeLogsToDisplay(): void;
        dispatchNotifications(): boolean;
        formatLog(message: string, args: {
            player_name: string;
            player_id: BGA.ID;
            i18n?: string;
            [key: string]: any;
        }): string;
        dispatchNotification(notif: BGA.Notif, disableSound?: boolean): boolean;
        addChatToLog(message: string, seeMore?: boolean, translateIcon?: boolean, extraClasses?: string): void;
        onTranslateLog(event: Event): void;
        addToLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): number;
        playerNameFilter(args: {
            player_name?: string;
            player_id?: BGA.ID;
            is_admin?: boolean;
        }): {
            player_name?: string;
            player_id?: BGA.ID;
            is_admin?: boolean;
        };
        playerNameFilterGame(args: undefined): void;
        isSynchronousNotifProcessed(): boolean;
        onSynchronousNotificationEnd(): void;
        debugReplayNotif(event: Event): void;
    }> & {
        log_notification_name?: boolean;
    };
    isTouchDevice?: boolean;
    player_id?: BGA.ID | null;
    current_player_id?: number;
    isSpectator?: boolean;
    table_id?: BGA.ID | null;
    showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
    ajaxcall_running: number;
    active_menu_label: BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings] | "";
    next_headmsg_id: number;
    cometd_is_connected: boolean;
    page_is_unloading: boolean;
    cometd_first_connect: boolean;
    cometd_subscriptions: Record<string, number>;
    reportErrorTimeout: boolean;
    next_log_id: number;
    chatbarWindows: Record<BGA.ChannelInfos["window_id"], BGA.ChatWindowMetadata>;
    jstpl_chatwindow: string;
    dockedChat?: boolean;
    dockedChatInitialized: boolean;
    groupToCometdSubs: Record<string, `/group/g${number}`>;
    window_visibility: "visible" | "hidden";
    premiumMsgAudioVideo: string | null;
    badWordList: readonly ["youporn", "redtube", "pornotube", "pornhub", "xtube", "a-hole", "dumb", "fool", "imbecile", "nutcase", "dipstick", "lunatic", "weirdo", "dork", "dope", "dimwit", "half-wit", "oaf", "bimbo", "jerk", "numskull", "numbskull", "goof", "suck", "moron", "morons", "idiot", "idi0t", "rape", "rapist", "hitler", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck ", "cocksucked ", "cocksucker", "cocksucking", "cocksucks ", "cocksuka", "cocksukka", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick ", "cuntlicker ", "cuntlicking ", "cunts", "cyalis", "cyberfuc", "cyberfuck ", "cyberfucked ", "cyberfucker", "cyberfuckers", "cyberfucking ", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates ", "ejaculating ", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck ", "fingerfucked ", "fingerfucker ", "fingerfuckers", "fingerfucking ", "fingerfucks ", "fistfuck", "fistfucked ", "fistfucker ", "fistfuckers ", "fistfucking ", "fistfuckings ", "fistfucks ", "flange", "fook", "fooker", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckings", "fuckingshitmotherfucker", "fuckme ", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged ", "gangbangs ", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex ", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off ", "jackoff", "jap", "jerk-off ", "jism", "jiz ", "jizm ", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lmfao", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked ", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking ", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers ", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim ", "orgasims ", "orgasm", "orgasms ", "p0rn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses ", "pissflaps", "pissin ", "pissing", "pissoff ", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks ", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys ", "rectum", "retards", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters ", "shitting", "shittings", "shitty ", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "enculé", "baiser", "nique", "niquer", "salope", "pute", "fuck", "f*ck", "f**k", "noob"];
    tutorialHighlightedQueue: {
        id: string;
        text: string;
        optclass: string;
    }[];
    browser_inactivity_time: number;
    bInactiveBrowser: boolean;
    red_thumbs_given: {};
    red_thumbs_taken: {};
    chatDetached?: false | {
        type: "table" | "player" | "chat" | "general" | "group" | null;
        id: number;
        chatname: string;
    };
    bChatDetached?: boolean;
    predefinedTextMessages?: BGA.SiteCorePredefinedTextMessages & Record<string, string>;
    predefinedTextMessages_untranslated?: {
        "Sorry I will continue to play later.": "tbleave";
        "Sorry I have an emergency: I'm back in few seconds...": "goodmove";
        "Good move!": "gm";
        "I would like to think a little, thank you": "think";
        "Yeah, still there, just thinking.": "stillthinkin";
        "Hey, are you still there?": "stillthere";
        "Good Game!": "gg";
        "Good luck, have fun!": "glhf";
        "Have fun!": "hf";
        "Thanks for the game!": "tftg";
    } & Record<string, string>;
    predefinedTextMessages_target_translation?: Record<keyof BGA.SiteCorePredefinedTextMessages, string>;
    timezoneDelta?: number;
    splashNotifToDisplay?: BGA.SplashNotifsToDisplay[];
    splashNotifRead?: Record<string, any>;
    bgaUniversalModals?: any;
    bgaToastHolder?: any;
    reportJsError?: boolean | "show";
    discussblock?: boolean;
    autoChatWhilePressingKey?: DijitJS.TooltipDialog;
    groupList?: (1 | null)[];
    allGroupList?: any;
    allLanguagesList?: any;
    pma?: any;
    rtc_room?: any;
    domain?: string;
    cometd_service?: "socketio" | string;
    socket?: socket.IO.Socket;
    mediaChatRating?: boolean;
    rating_step1?: InstanceType<BGA.PopinDialog>;
    rating_step2?: InstanceType<BGA.PopinDialog>;
    rating_step3?: InstanceType<BGA.PopinDialog>;
    rating_step4?: InstanceType<BGA.PopinDialog>;
    playerRating?: BGA.SiteCorePlayerRating;
    gamecanapprove?: boolean;
    gameisalpha?: boolean;
    hideSoundControlsTimer?: number;
    game_group?: string;
    displaySoundControlsTimer?: number;
    tutorial?: Record<number, number>;
    metasite_tutorial?: Record<number, number>;
    bHighlightPopinTimeoutInProgress?: boolean;
    highlightFadeInInProgress?: boolean;
    currentTutorialDialog?: DijitJS.TooltipDialog | null;
    current_hightlighted_additional_class?: string;
    init_core(): void;
    unload(): void;
    updateAjaxCallStatus(): void;
    changeActiveMenuItem(key: ""): "";
    changeActiveMenuItem<T extends BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings]>(key: T): T;
    subscribeCometdChannel<T extends string>(event: T, _1?: any, _2?: any): void | T;
    subscribeCometdChannels<const T extends Record<string, string>>(events: T, _1?: any, _2?: any): {} | T;
    unsubscribeCometdChannel(event: string): void;
    reconnectAllSubscriptions(): void;
    onSocketIoConnectionStatusChanged(status: "connect" | "connect_error" | "connect_timeout" | "reconnect" | "reconnect_failed" | "reconnect_attempt" | string, error?: string): void;
    onFirstConnectedToComet(): void;
    leaveTable(table_id: BGA.ID, success_callback: () => void): void;
    onSeeMoreLogs(event: Event): void;
    onIncreaseContentHeight(heightIncrease: number): void;
    onScriptError(error: ErrorEvent | string | Event, url: string, line?: number | string): void;
    initChatDockedSystem(): void;
    extractChannelInfosFromNotif(notif: BGA.ChatNotif): BGA.ChannelInfos | null;
    getChatInputArgs(channel: BGA.ChannelInfos): BGA.ChatInputArgs | null;
    onPlaceLogOnChannel(chatnotif: BGA.ChatNotif): boolean;
    onUpdateIsWritingStatus(window_id: BGA.ChannelInfos["window_id"]): void;
    createChatBarWindow(channel: BGA.ChannelInfos, subscribe?: boolean): boolean;
    onStartChatAccept(event: Event): void;
    onStartChatBlock(event: Event): void;
    onChangeStopNotifGeneralBox(event: Event): void;
    onChangeStopNotifGeneralLabel(event: Event): void;
    checkAVFrequencyLimitation(): boolean;
    setAVFrequencyLimitation(): void;
    onStartStopAudioChat(event: Event): void;
    onStartStopVideoChat(event: Event): void;
    setNewRTCMode(table_id: BGA.ID | null, target_player_id: BGA.ID | null, rtc_id: 0 | 1 | 2, connecting_player_id?: BGA.ID): void;
    onLoadPreviousMessages(event: Event): void;
    loadPreviousMessage(type: BGA.ChannelInfos["type"], id: BGA.ID): void;
    loadPreviousMessageCallback(args: {
        type: BGA.ChannelInfos["type"];
        id: number;
        status?: "underage" | "admin" | "newchat" | "newchattoconfirm" | string;
        history: BGA.ChatNotifArgs[];
    }): void;
    stackOrUnstackIfNeeded(): void;
    onUnstackChatWindow(event: Event): void;
    unstackChatWindow(window_id: BGA.ChannelInfos["window_id"], state?: BGA.ChannelInfos["start"] | "automatic"): void;
    stackChatWindowsIfNeeded(state?: BGA.ChannelInfos["start"]): void;
    stackOneChatWindow(): void;
    getNeededChatbarWidth(): number;
    adaptChatbarDock(): void;
    countStackedWindows(): number;
    closeChatWindow(window_id: BGA.ChannelInfos["window_id"]): void;
    onCloseChatWindow(event: Event): void;
    onCollapseChatWindow(event: Event): void | true;
    collapseChatWindow(window_id: BGA.ChannelInfos["window_id"], checkBottom?: any): void;
    onExpandChatWindow(event: Event): void;
    onCollapseAllChatWindow(event: Event): void;
    updateChatBarStatus(): void;
    expandChatWindow(window_id: BGA.ChannelInfos["window_id"], autoCollapseAfterMessage?: boolean): void;
    makeSureChatBarIsOnTop(window_id: BGA.ChannelInfos["window_id"]): void;
    makeSureChatBarIsOnBottom(window_id: BGA.ChannelInfos["window_id"]): void;
    onScrollDown(event: Event): void;
    onToggleStackMenu(event: Event): void;
    onCallbackBeforeChat(args: any & {
        table?: number;
    }, channel_url: string): boolean;
    isBadWorkInChat(text: string | null): boolean;
    onCallbackAfterChat(_1?: any): void;
    callbackAfterChatError(args: {
        table?: number;
    }): void;
    onDockedChatFocus(event: Event): void;
    onDockedChatInputKey(event: KeyboardEvent): void;
    onShowPredefined(event: Event): void;
    onInsertPredefinedMessage(event: Event): void;
    onInsertPredefinedTextMessage(event: Event): void;
    setGroupList(groupList: (1 | null)[] | undefined, allGroupList?: any, red_thumbs_given?: {}, red_thumbs_taken?: {}): void;
    setLanguagesList(allLanguagesList: any): void;
    setPma(pma: any): void;
    setRtcMode(rtc_mode: 0 | 1 | 2, rtc_room: any): void;
    takeIntoAccountAndroidIosRequestDesktopWebsite(e: Document): void;
    traceLoadingPerformances(): void;
    getCurrentPlayerId(): BGA.ID | undefined;
    tutorialShowOnce(e: number, t?: boolean): boolean;
    highligthElementwaitForPopinToClose(): void;
    highlightElementTutorial(id: string, text: string, optClass?: string): void;
    onElementTutorialNext(t?: Event): void;
    websiteWindowVisibilityChange(e?: {
        type: string;
    } | undefined): void;
    ackUnreadMessage(t: BGA.ChannelInfos["window_id"], i?: "unsub" | string): void;
    ackMessagesWithPlayer(e: BGA.ID, t: string[]): void;
    ackMessagesOnTable(table: BGA.ID, list: string[], unsub: boolean): void;
    onAckMsg(t: BGA.Notif): void;
    initMonitoringWindowVisibilityChange(): void;
    playingHoursToLocal(e: string, t?: false): string;
    playingHoursToLocal(e: string, t: true): string | {
        start_hour: string;
        end_hour: string;
    };
    showSplashedPlayerNotifications(t: any): void;
    displayNextSplashNotif(): void;
    onNewsRead(t: string): void;
    onDisplayNextSplashNotif(t: Event): void;
    onSkipAllSplashNotifs(t: Event): void;
    markSplashNotifAsRead(t: BGA.ID, i: boolean): void;
    inactivityTimerIncrement(): void;
    resetInactivityTimer(): void;
    onForceBrowserReload(t: BGA.Notif): void;
    doForceBrowserReload(e?: boolean): void;
    onDebugPing(): void;
    onNewRequestToken(e: BGA.Notif): void;
    onDisplayDebugFunctions(e: Event): void;
    showDebugParamsPopin(e: string, t: any[]): void;
    triggerDebug(e: string, t: string[]): void;
    onMuteSound(t?: boolean): void;
    onSetSoundVolume(e?: boolean): void;
    onToggleSound(e: Event): void;
    onDisplaySoundControls(_: Event): void;
    displaySoundControls(_: Event): void;
    onHideSoundControls(_: Event): void;
    hideSoundControls(): void;
    onStickSoundControls(_: Event): void;
    onUnstickSoundControls(event: Event): void;
    onSoundVolumeControl(_: Event): void;
    displayRatingContent(t: "video" | "audio" | "support" | "game", i: BGA.SiteCorePlayerRating | undefined): void;
    sendRating(e: "video" | "audio" | "support" | "game"): void;
    onGameRatingEnter(e: Event): void;
    onVideoRatingEnter(e: Event): void;
    onAudioRatingEnter(e: Event): void;
    onSupportRatingEnter(e: Event): void;
    processRatingEnter(rating: BGA.ID, type: "video" | "audio" | "support" | "game"): void;
    onRatingLeave(t: Event): void;
    onVideoRatingClick(e: Event): void;
    onAudioRatingClick(e: Event): void;
    onGameRatingClick(e: Event): void;
    onSupportRatingClick(e: Event): void;
    completeRatingClick(e: Event, t: "video" | "audio" | "support" | "game"): void;
    showRatingDialog_step2(t: "video" | "audio" | "support" | "game"): void;
    onAudioRatingClickIssue(e: Event): void;
    onVideoRatingClickIssue(e: Event): void;
    onGameRatingClickIssue(e: Event): void;
    completeRatingClickIssue(e: Event, t: "video" | "audio" | "support" | "game"): void;
    showRatingDialog_step3(t: "video" | "audio" | "support" | "game"): void;
    showGameRatingDialog_step4(): void;
    recordMediaStats(e: BGA.ID, t: "start" | "stop"): void;
    gamedatas?: BGA.Gamedatas | null;
    subscriptions: DojoJS.Handle[];
    tooltips: Record<string, DijitJS.Tooltip>;
    bHideTooltips: boolean;
    screenMinWidth: number;
    currentZoom: number;
    connections: {
        element: any;
        event: string;
        handle: DojoJS.Handle;
    }[];
    instantaneousMode: boolean | 0 | 1;
    webrtc: InstanceType<BGA.WebRTC> | null;
    webrtcmsg_ntf_handle: DojoJS.
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
    Handle | null;
    rtc_mode: 0 | 1 | 2;
    mediaConstraints: BGA.WebRTCMediaConstraints;
    gameMasculinePlayers: string[];
    gameFemininePlayers: string[];
    gameNeutralPlayers: string[];
    emoticons: {
        readonly ":)": "smile";
        readonly ":-)": "smile";
        readonly ":D": "bigsmile";
        readonly ":-D": "bigsmile";
        readonly ":(": "unsmile";
        readonly ":-(": "unsmile";
        readonly ";)": "blink";
        readonly ";-)": "blink";
        readonly ":/": "bad";
        readonly ":-/": "bad";
        readonly ":s": "bad";
        readonly ":-s": "bad";
        readonly ":P": "mischievous";
        readonly ":-P": "mischievous";
        readonly ":p": "mischievous";
        readonly ":-p": "mischievous";
        readonly ":$": "blushing";
        readonly ":-$": "blushing";
        readonly ":o": "surprised";
        readonly ":-o": "surprised";
        readonly ":O": "shocked";
        readonly ":-O": "shocked";
        readonly o_o: "shocked";
        readonly O_O: "shocked";
        readonly "8)": "sunglass";
        readonly "8-)": "sunglass";
    };
    defaultTooltipPosition: DijitJS.PlacePositions[];
    metasiteurl?: string;
    ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
    format_block(template: string, args: Record<string, any>): string;
    format_string(template: string, args: Record<string, any>): string;
    format_string_recursive(template: string, args: Record<string, any> & {
        i18n?: Record<string, any>;
        type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
        message?: string;
        text?: string;
    }): string;
    clienttranslate_string(text: string): string;
    translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
    register_subs(...handles: DojoJS.Handle[]): void;
    unsubscribe_all(): void;
    register_cometd_subs(...comet_ids: string[]): string | string[];
    placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
    placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
    disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
    enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
    getComputedTranslateZ(element: Element): number;
    transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
    slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
    slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
    slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
    toRadians(angle: number): number;
    vector_rotate(vector: {
        x: number;
        y: number;
    }, angle: number): {
        x: number;
        y: number;
    };
    attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
    attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
    slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
    slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
    fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
    rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
    rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
    rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
    getAbsRotationAngle(target: string | Element | null): number;
    addClassToClass<T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]): void;
    connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
    connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U, method: keyof any): void;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>, any>>(targetObject: T, event: U, method: M, dontFix?: boolean): void;
    disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
    disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U): void;
    connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
    connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
    connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
    connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M): void;
    addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
    addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
    disconnectAll(): void;
    setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
    incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
    decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
    updateCounters(counters?: Partial<{
        [x: string]: {
            counter_value: BGA.ID;
            counter_name: string;
        };
    } | undefined>): void;
    getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
    addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
    addTooltipHtml(target: string, html: string, delay?: number): void;
    addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
    addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
    removeTooltip(target: string): void;
    switchDisplayTooltips(displayType: 0 | 1): void;
    applyCommentMarkup(text: string): string;
    confirmationDialog<T = null>(message: string, yesHandler: (param: T) => any, noHandler?: ((param: T) => any) | undefined, param?: T | undefined): void;
    warningDialog(message: string, callback: () => any): void;
    infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
    multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
    askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
    displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
    showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
    showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
    getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
    getKarmaLabel(karma: number | string): {
        label: "Perfect" | string;
        css: "exceptional";
    } | {
        label: "Excellent" | string;
        css: "perfect";
    } | {
        label: "Very good" | string;
        css: "verygood";
    } | {
        label: "Good" | string;
        css: "good";
    } | {
        label: "Average" | string;
        css: "average";
    } | {
        label: "Not good" | string;
        css: "notgood";
    } | {
        label: "Bad" | string;
        css: "bad";
    } | {
        label: "Very bad" | string;
        css: "verybad";
    } | undefined;
    getObjectLength(obj: object): number;
    comet_subscriptions: string[];
    unload_in_progress: boolean;
    bCancelAllAjax: boolean;
    tooltipsInfos: Record<string, {
        hideOnHoverEvt: DojoJS.Handle | null;
    }>;
    mozScale: number;
    rotateToPosition: Record<string, number>;
    room: BGA.RoomId | null;
    already_accepted_room: BGA.RoomId | null;
    webpush: InstanceType<BGA.WebPush> | null;
    interface_min_width?: number;
    confirmationDialogUid?: number;
    confirmationDialogUid_called?: number;
    discussionTimeout?: Record<string, number>;
    showclick_circles_no?: number;
    number_of_tb_table_its_your_turn?: number;
    prevent_error_rentry?: number;
    transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
    onresizePlayerAwardsEvent?: DojoJS.Handle;
    gameinterface_zoomFactor?: number;
    ajaxpageload<Scope>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope, callback: DojoJS.HitchMethod<Scope, [data: any], any>): {
        new (): import("../../dojo/promise/Promise")<any>;
    };
    displayUserHttpError(error_code: string | number | null): void;
    cancelAjaxCall(): void;
    applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
    adaptScreenToMinWidth(min_width: number): void;
    adaptScreenToMinWidthWorker(): void;
    getObjPosition(obj: HTMLElement | string): {
        x: number;
        y: number;
    };
    doShowBubble(anchor: string, message: string, custom_class?: string): void;
    getGameNameDisplayed(text: string): string;
    formatReflexionTime(time: number): {
        string: string;
        mn: number;
        s: (string | number);
        h: number;
        positive: boolean;
    };
    strip_tags(e: string, t?: string): string;
    validURL(e: any): boolean;
    nl2br(e: any, t: any): string;
    htmlentities(e: string, t: any, i: any, n: any): string | false;
    html_entity_decode(e: any, t: any): string | false;
    get_html_translation_table(e: any, t: any): Record<string, string>;
    ucFirst(e: any): any;
    setupWebPush(): Promise<void>;
    refreshWebPushWorker(): void;
    getRTCTemplate(e: any, t: any, i: any): string;
    setupRTCEvents(t: string): void;
    getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
        mandatory: {
            minAspectRatio: number;
            maxAspectRatio: number;
            maxWidth: number;
            maxFrameRate: number;
        };
        optional: never[];
    };
    startRTC(): void;
    doStartRTC(): void;
    onGetUserMediaSuccess(): void;
    onGetUserMediaError(): void;
    onJoinRoom(t: any, i: any): void;
    onClickRTCVideoMax(t: Event): void;
    maximizeRTCVideo(t: any, i: any): void;
    onClickRTCVideoMin(t: any): void;
    onClickRTCVideoSize(t: any): void;
    onClickRTCVideoMic(t: any): void;
    onClickRTCVideoSpk(t: any): void;
    onClickRTCVideoCam(t: any): void;
    onLeaveRoom(t: any, i: any): void;
    onLeaveRoomImmediate(e: any): void;
    doLeaveRoom(e?: any): void;
    clearRTC(): void;
    ntf_webrtcmsg(e: any): void;
    addSmileyToText(e: string): string;
    getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
    makeClickableLinks(e: any, t: any): any;
    makeBgaLinksLocalLinks(e: any): any;
    ensureEbgObjectReinit(e: any): void;
    getRankClassFromElo(e: any): string;
    getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
    getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
    eloToBarPercentage(e: any, t?: boolean): number;
    formatElo(e: string): number;
    formatEloDecimal(e: any): number;
    getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
    getArenaLabel(e: any, t?: any): string;
    insertParamIntoCurrentURL(e: any, t: any): void;
    playerawardsCollapsedAlignement(): void;
    playerawardCollapsedAlignement(t: any): void;
    arenaPointsDetails(e: any, t?: any): {
        league: 0 | 1 | 2 | 3 | 4 | 5;
        league_name: string;
        league_shortname: string;
        league_promotion_shortname: string;
        points: number;
        arelo: number;
    };
    arenaPointsHtml(t: {
        league_name: string;
        league: 0 | 1 | 2 | 3 | 4 | 5;
        arelo: number;
        points: number | null;
        league_promotion_shortname?: string | null;
    }): {
        bar_content: string;
        bottom_infos: string;
        bar_pcent: string;
        bar_pcent_number: string | number;
    };
    declaredClass: string;
    inherited: {
        <U>(args: IArguments): U;
        <U>(args: IArguments, newArgs: any[]): U;
        (args: IArguments, get: true): Function | void;
        <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
        <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
    } & {
        <U>(args: IArguments): U;
        <U>(args: IArguments, newArgs: any[]): U;
        (args: IArguments, get: true): Function | void;
        <T extends DojoJS.InheritedMethod<{
            gamedatas?: BGA.Gamedatas | null;
            subscriptions: DojoJS.Handle[];
            tooltips: Record<string, DijitJS.Tooltip>;
            bHideTooltips: boolean;
            screenMinWidth: number;
            currentZoom: number;
            connections: {
                element: any;
                event: string;
                handle: DojoJS.Handle;
            }[];
            instantaneousMode: boolean | 0 | 1;
            webrtc: InstanceType<BGA.WebRTC> | null;
            webrtcmsg_ntf_handle: DojoJS.
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
            Handle | null;
            rtc_mode: 0 | 1 | 2;
            mediaConstraints: BGA.WebRTCMediaConstraints;
            gameMasculinePlayers: string[];
            gameFemininePlayers: string[];
            gameNeutralPlayers: string[];
            emoticons: {
                readonly ":)": "smile";
                readonly ":-)": "smile";
                readonly ":D": "bigsmile";
                readonly ":-D": "bigsmile";
                readonly ":(": "unsmile";
                readonly ":-(": "unsmile";
                readonly ";)": "blink";
                readonly ";-)": "blink";
                readonly ":/": "bad";
                readonly ":-/": "bad";
                readonly ":s": "bad";
                readonly ":-s": "bad";
                readonly ":P": "mischievous";
                readonly ":-P": "mischievous";
                readonly ":p": "mischievous";
                readonly ":-p": "mischievous";
                readonly ":$": "blushing";
                readonly ":-$": "blushing";
                readonly ":o": "surprised";
                readonly ":-o": "surprised";
                readonly ":O": "shocked";
                readonly ":-O": "shocked";
                readonly o_o: "shocked";
                readonly O_O: "shocked";
                readonly "8)": "sunglass";
                readonly "8-)": "sunglass";
            };
            defaultTooltipPosition: DijitJS.PlacePositions[];
            metasiteurl?: string;
            ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
            format_block(template: string, args: Record<string, any>): string;
            format_string(template: string, args: Record<string, any>): string;
            format_string_recursive(template: string, args: Record<string, any> & {
                i18n?: Record<string, any>;
                type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                message?: string;
                text?: string;
            }): string;
            clienttranslate_string(text: string): string;
            translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
            register_subs(...handles: DojoJS.Handle[]): void;
            unsubscribe_all(): void;
            register_cometd_subs(...comet_ids: string[]): string | string[];
            showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
            placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
            placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
            disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
            enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
            getComputedTranslateZ(element: Element): number;
            transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
            slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            toRadians(angle: number): number;
            vector_rotate(vector: {
                x: number;
                y: number;
            }, angle: number): {
                x: number;
                y: number;
            };
            attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
            slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
            fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
            rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
            rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            getAbsRotationAngle(target: string | Element | null): number;
            addClassToClass<T_1 extends keyof CSSStyleDeclaration>(className: string, property: T_1, value: CSSStyleDeclaration[T_1]): void;
            connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T_1, event: U, method: keyof any): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U_1>, U_1 extends string, S, M_1 extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T_1, U_1>, any>>(targetObject: T_1, event: U_1, method: M_1, dontFix?: boolean): void;
            disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
            disconnect<T_1 extends DojoJS.ConnectMethodTarget<U_2>, U_2 extends string>(targetObject: T_1, event: U_2): void;
            connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            connectClass<K extends keyof DojoJS.AllEvents, M_2 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_2): void;
            connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
            connectQuery<K extends keyof DojoJS.AllEvents, M_3 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M_3): void;
            addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            addEventToClass<K extends keyof DojoJS.AllEvents, M_4 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_4): void;
            disconnectAll(): void;
            setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
            incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            updateCounters(counters?: Partial<{
                [x: string]: {
                    counter_value: BGA.ID;
                    counter_name: string;
                };
            } | undefined>): void;
            getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
            addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtml(target: string, html: string, delay?: number): void;
            addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
            removeTooltip(target: string): void;
            switchDisplayTooltips(displayType: 0 | 1): void;
            applyCommentMarkup(text: string): string;
            confirmationDialog<T_1 = null>(message: string, yesHandler: (param: T_1) => any, noHandler?: ((param: T_1) => any) | undefined, param?: T_1 | undefined): void;
            warningDialog(message: string, callback: () => any): void;
            infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
            multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
            askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
            displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
            showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
            showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
            getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
            getKarmaLabel(karma: number | string): {
                label: "Perfect" | string;
                css: "exceptional";
            } | {
                label: "Excellent" | string;
                css: "perfect";
            } | {
                label: "Very good" | string;
                css: "verygood";
            } | {
                label: "Good" | string;
                css: "good";
            } | {
                label: "Average" | string;
                css: "average";
            } | {
                label: "Not good" | string;
                css: "notgood";
            } | {
                label: "Bad" | string;
                css: "bad";
            } | {
                label: "Very bad" | string;
                css: "verybad";
            } | undefined;
            getObjectLength(obj: object): number;
            comet_subscriptions: string[];
            unload_in_progress: boolean;
            bCancelAllAjax: boolean;
            tooltipsInfos: Record<string, {
                hideOnHoverEvt: DojoJS.Handle | null;
            }>;
            mozScale: number;
            rotateToPosition: Record<string, number>;
            room: BGA.RoomId | null;
            already_accepted_room: BGA.RoomId | null;
            webpush: InstanceType<BGA.WebPush> | null;
            interface_min_width?: number;
            confirmationDialogUid?: number;
            confirmationDialogUid_called?: number;
            discussionTimeout?: Record<string, number>;
            showclick_circles_no?: number;
            number_of_tb_table_its_your_turn?: number;
            prevent_error_rentry?: number;
            transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
            onresizePlayerAwardsEvent?: DojoJS.Handle;
            gameinterface_zoomFactor?: number;
            ajaxpageload<Scope_1>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope_1, callback: DojoJS.HitchMethod<Scope_1, [data: any], any>): {
                new (): import("../../dojo/promise/Promise")<any>;
            };
            displayUserHttpError(error_code: string | number | null): void;
            cancelAjaxCall(): void;
            applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
            adaptScreenToMinWidth(min_width: number): void;
            adaptScreenToMinWidthWorker(): void;
            getObjPosition(obj: HTMLElement | string): {
                x: number;
                y: number;
            };
            doShowBubble(anchor: string, message: string, custom_class?: string): void;
            getGameNameDisplayed(text: string): string;
            formatReflexionTime(time: number): {
                string: string;
                mn: number;
                s: (string | number);
                h: number;
                positive: boolean;
            };
            strip_tags(e: string, t?: string): string;
            validURL(e: any): boolean;
            nl2br(e: any, t: any): string;
            htmlentities(e: string, t: any, i: any, n: any): string | false;
            html_entity_decode(e: any, t: any): string | false;
            get_html_translation_table(e: any, t: any): Record<string, string>;
            ucFirst(e: any): any;
            setupWebPush(): Promise<void>;
            refreshWebPushWorker(): void;
            getRTCTemplate(e: any, t: any, i: any): string;
            setupRTCEvents(t: string): void;
            getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: never[];
            };
            startRTC(): void;
            doStartRTC(): void;
            onGetUserMediaSuccess(): void;
            onGetUserMediaError(): void;
            onJoinRoom(t: any, i: any): void;
            onClickRTCVideoMax(t: Event): void;
            maximizeRTCVideo(t: any, i: any): void;
            onClickRTCVideoMin(t: any): void;
            onClickRTCVideoSize(t: any): void;
            onClickRTCVideoMic(t: any): void;
            onClickRTCVideoSpk(t: any): void;
            onClickRTCVideoCam(t: any): void;
            onLeaveRoom(t: any, i: any): void;
            onLeaveRoomImmediate(e: any): void;
            doLeaveRoom(e?: any): void;
            clearRTC(): void;
            ntf_webrtcmsg(e: any): void;
            addSmileyToText(e: string): string;
            getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
            makeClickableLinks(e: any, t: any): any;
            makeBgaLinksLocalLinks(e: any): any;
            ensureEbgObjectReinit(e: any): void;
            getRankClassFromElo(e: any): string;
            getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
            getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
            eloToBarPercentage(e: any, t?: boolean): number;
            formatElo(e: string): number;
            formatEloDecimal(e: any): number;
            getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
            getArenaLabel(e: any, t?: any): string;
            insertParamIntoCurrentURL(e: any, t: any): void;
            playerawardsCollapsedAlignement(): void;
            playerawardCollapsedAlignement(t: any): void;
            arenaPointsDetails(e: any, t?: any): {
                league: 0 | 1 | 2 | 3 | 4 | 5;
                league_name: string;
                league_shortname: string;
                league_promotion_shortname: string;
                points: number;
                arelo: number;
            };
            arenaPointsHtml(t: {
                league_name: string;
                league: 0 | 1 | 2 | 3 | 4 | 5;
                arelo: number;
                points: number | null;
                league_promotion_shortname?: string | null;
            }): {
                bar_content: string;
                bottom_infos: string;
                bar_pcent: string;
                bar_pcent_number: string | number;
            };
            declaredClass: string;
            inherited<U_3>(args: IArguments): U_3;
            inherited<U_3>(args: IArguments, newArgs: any[]): U_3;
            inherited(args: IArguments, get: true): Function | void;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T_1, []>> | undefined): ReturnType<DojoJS.Hitched<any, T_1, []>>;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, get: true): DojoJS.Hitched<any, T_1, []>;
            __inherited: DojoJS.DojoClassObject["inherited"];
            getInherited(args: IArguments): Function | void;
            getInherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments): DojoJS.Hitched<any, T_1, []>;
            isInstanceOf(cls: any): boolean;
        }>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<{
            gamedatas?: BGA.Gamedatas | null;
            subscriptions: DojoJS.Handle[];
            tooltips: Record<string, DijitJS.Tooltip>;
            bHideTooltips: boolean;
            screenMinWidth: number;
            currentZoom: number;
            connections: {
                element: any;
                event: string;
                handle: DojoJS.Handle;
            }[];
            instantaneousMode: boolean | 0 | 1;
            webrtc: InstanceType<BGA.WebRTC> | null;
            webrtcmsg_ntf_handle: DojoJS.
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
            Handle | null;
            rtc_mode: 0 | 1 | 2;
            mediaConstraints: BGA.WebRTCMediaConstraints;
            gameMasculinePlayers: string[];
            gameFemininePlayers: string[];
            gameNeutralPlayers: string[];
            emoticons: {
                readonly ":)": "smile";
                readonly ":-)": "smile";
                readonly ":D": "bigsmile";
                readonly ":-D": "bigsmile";
                readonly ":(": "unsmile";
                readonly ":-(": "unsmile";
                readonly ";)": "blink";
                readonly ";-)": "blink";
                readonly ":/": "bad";
                readonly ":-/": "bad";
                readonly ":s": "bad";
                readonly ":-s": "bad";
                readonly ":P": "mischievous";
                readonly ":-P": "mischievous";
                readonly ":p": "mischievous";
                readonly ":-p": "mischievous";
                readonly ":$": "blushing";
                readonly ":-$": "blushing";
                readonly ":o": "surprised";
                readonly ":-o": "surprised";
                readonly ":O": "shocked";
                readonly ":-O": "shocked";
                readonly o_o: "shocked";
                readonly O_O: "shocked";
                readonly "8)": "sunglass";
                readonly "8-)": "sunglass";
            };
            defaultTooltipPosition: DijitJS.PlacePositions[];
            metasiteurl?: string;
            ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
            format_block(template: string, args: Record<string, any>): string;
            format_string(template: string, args: Record<string, any>): string;
            format_string_recursive(template: string, args: Record<string, any> & {
                i18n?: Record<string, any>;
                type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                message?: string;
                text?: string;
            }): string;
            clienttranslate_string(text: string): string;
            translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
            register_subs(...handles: DojoJS.Handle[]): void;
            unsubscribe_all(): void;
            register_cometd_subs(...comet_ids: string[]): string | string[];
            showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
            placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
            placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
            disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
            enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
            getComputedTranslateZ(element: Element): number;
            transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
            slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            toRadians(angle: number): number;
            vector_rotate(vector: {
                x: number;
                y: number;
            }, angle: number): {
                x: number;
                y: number;
            };
            attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
            slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
            fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
            rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
            rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            getAbsRotationAngle(target: string | Element | null): number;
            addClassToClass<T_1 extends keyof CSSStyleDeclaration>(className: string, property: T_1, value: CSSStyleDeclaration[T_1]): void;
            connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T_1, event: U, method: keyof any): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U_1>, U_1 extends string, S, M_1 extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T_1, U_1>, any>>(targetObject: T_1, event: U_1, method: M_1, dontFix?: boolean): void;
            disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
            disconnect<T_1 extends DojoJS.ConnectMethodTarget<U_2>, U_2 extends string>(targetObject: T_1, event: U_2): void;
            connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            connectClass<K extends keyof DojoJS.AllEvents, M_2 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_2): void;
            connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
            connectQuery<K extends keyof DojoJS.AllEvents, M_3 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M_3): void;
            addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            addEventToClass<K extends keyof DojoJS.AllEvents, M_4 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_4): void;
            disconnectAll(): void;
            setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
            incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            updateCounters(counters?: Partial<{
                [x: string]: {
                    counter_value: BGA.ID;
                    counter_name: string;
                };
            } | undefined>): void;
            getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
            addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtml(target: string, html: string, delay?: number): void;
            addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
            removeTooltip(target: string): void;
            switchDisplayTooltips(displayType: 0 | 1): void;
            applyCommentMarkup(text: string): string;
            confirmationDialog<T_1 = null>(message: string, yesHandler: (param: T_1) => any, noHandler?: ((param: T_1) => any) | undefined, param?: T_1 | undefined): void;
            warningDialog(message: string, callback: () => any): void;
            infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
            multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
            askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
            displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
            showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
            showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
            getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
            getKarmaLabel(karma: number | string): {
                label: "Perfect" | string;
                css: "exceptional";
            } | {
                label: "Excellent" | string;
                css: "perfect";
            } | {
                label: "Very good" | string;
                css: "verygood";
            } | {
                label: "Good" | string;
                css: "good";
            } | {
                label: "Average" | string;
                css: "average";
            } | {
                label: "Not good" | string;
                css: "notgood";
            } | {
                label: "Bad" | string;
                css: "bad";
            } | {
                label: "Very bad" | string;
                css: "verybad";
            } | undefined;
            getObjectLength(obj: object): number;
            comet_subscriptions: string[];
            unload_in_progress: boolean;
            bCancelAllAjax: boolean;
            tooltipsInfos: Record<string, {
                hideOnHoverEvt: DojoJS.Handle | null;
            }>;
            mozScale: number;
            rotateToPosition: Record<string, number>;
            room: BGA.RoomId | null;
            already_accepted_room: BGA.RoomId | null;
            webpush: InstanceType<BGA.WebPush> | null;
            interface_min_width?: number;
            confirmationDialogUid?: number;
            confirmationDialogUid_called?: number;
            discussionTimeout?: Record<string, number>;
            showclick_circles_no?: number;
            number_of_tb_table_its_your_turn?: number;
            prevent_error_rentry?: number;
            transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
            onresizePlayerAwardsEvent?: DojoJS.Handle;
            gameinterface_zoomFactor?: number;
            ajaxpageload<Scope_1>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope_1, callback: DojoJS.HitchMethod<Scope_1, [data: any], any>): {
                new (): import("../../dojo/promise/Promise")<any>;
            };
            displayUserHttpError(error_code: string | number | null): void;
            cancelAjaxCall(): void;
            applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
            adaptScreenToMinWidth(min_width: number): void;
            adaptScreenToMinWidthWorker(): void;
            getObjPosition(obj: HTMLElement | string): {
                x: number;
                y: number;
            };
            doShowBubble(anchor: string, message: string, custom_class?: string): void;
            getGameNameDisplayed(text: string): string;
            formatReflexionTime(time: number): {
                string: string;
                mn: number;
                s: (string | number);
                h: number;
                positive: boolean;
            };
            strip_tags(e: string, t?: string): string;
            validURL(e: any): boolean;
            nl2br(e: any, t: any): string;
            htmlentities(e: string, t: any, i: any, n: any): string | false;
            html_entity_decode(e: any, t: any): string | false;
            get_html_translation_table(e: any, t: any): Record<string, string>;
            ucFirst(e: any): any;
            setupWebPush(): Promise<void>;
            refreshWebPushWorker(): void;
            getRTCTemplate(e: any, t: any, i: any): string;
            setupRTCEvents(t: string): void;
            getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: never[];
            };
            startRTC(): void;
            doStartRTC(): void;
            onGetUserMediaSuccess(): void;
            onGetUserMediaError(): void;
            onJoinRoom(t: any, i: any): void;
            onClickRTCVideoMax(t: Event): void;
            maximizeRTCVideo(t: any, i: any): void;
            onClickRTCVideoMin(t: any): void;
            onClickRTCVideoSize(t: any): void;
            onClickRTCVideoMic(t: any): void;
            onClickRTCVideoSpk(t: any): void;
            onClickRTCVideoCam(t: any): void;
            onLeaveRoom(t: any, i: any): void;
            onLeaveRoomImmediate(e: any): void;
            doLeaveRoom(e?: any): void;
            clearRTC(): void;
            ntf_webrtcmsg(e: any): void;
            addSmileyToText(e: string): string;
            getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
            makeClickableLinks(e: any, t: any): any;
            makeBgaLinksLocalLinks(e: any): any;
            ensureEbgObjectReinit(e: any): void;
            getRankClassFromElo(e: any): string;
            getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
            getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
            eloToBarPercentage(e: any, t?: boolean): number;
            formatElo(e: string): number;
            formatEloDecimal(e: any): number;
            getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
            getArenaLabel(e: any, t?: any): string;
            insertParamIntoCurrentURL(e: any, t: any): void;
            playerawardsCollapsedAlignement(): void;
            playerawardCollapsedAlignement(t: any): void;
            arenaPointsDetails(e: any, t?: any): {
                league: 0 | 1 | 2 | 3 | 4 | 5;
                league_name: string;
                league_shortname: string;
                league_promotion_shortname: string;
                points: number;
                arelo: number;
            };
            arenaPointsHtml(t: {
                league_name: string;
                league: 0 | 1 | 2 | 3 | 4 | 5;
                arelo: number;
                points: number | null;
                league_promotion_shortname?: string | null;
            }): {
                bar_content: string;
                bottom_infos: string;
                bar_pcent: string;
                bar_pcent_number: string | number;
            };
            declaredClass: string;
            inherited<U_3>(args: IArguments): U_3;
            inherited<U_3>(args: IArguments, newArgs: any[]): U_3;
            inherited(args: IArguments, get: true): Function | void;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T_1, []>> | undefined): ReturnType<DojoJS.Hitched<any, T_1, []>>;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, get: true): DojoJS.Hitched<any, T_1, []>;
            __inherited: DojoJS.DojoClassObject["inherited"];
            getInherited(args: IArguments): Function | void;
            getInherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments): DojoJS.Hitched<any, T_1, []>;
            isInstanceOf(cls: any): boolean;
        }, T, []>> | undefined): ReturnType<DojoJS.Hitched<{
            gamedatas?: BGA.Gamedatas | null;
            subscriptions: DojoJS.Handle[];
            tooltips: Record<string, DijitJS.Tooltip>;
            bHideTooltips: boolean;
            screenMinWidth: number;
            currentZoom: number;
            connections: {
                element: any;
                event: string;
                handle: DojoJS.Handle;
            }[];
            instantaneousMode: boolean | 0 | 1;
            webrtc: InstanceType<BGA.WebRTC> | null;
            webrtcmsg_ntf_handle: DojoJS.
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
            Handle | null;
            rtc_mode: 0 | 1 | 2;
            mediaConstraints: BGA.WebRTCMediaConstraints;
            gameMasculinePlayers: string[];
            gameFemininePlayers: string[];
            gameNeutralPlayers: string[];
            emoticons: {
                readonly ":)": "smile";
                readonly ":-)": "smile";
                readonly ":D": "bigsmile";
                readonly ":-D": "bigsmile";
                readonly ":(": "unsmile";
                readonly ":-(": "unsmile";
                readonly ";)": "blink";
                readonly ";-)": "blink";
                readonly ":/": "bad";
                readonly ":-/": "bad";
                readonly ":s": "bad";
                readonly ":-s": "bad";
                readonly ":P": "mischievous";
                readonly ":-P": "mischievous";
                readonly ":p": "mischievous";
                readonly ":-p": "mischievous";
                readonly ":$": "blushing";
                readonly ":-$": "blushing";
                readonly ":o": "surprised";
                readonly ":-o": "surprised";
                readonly ":O": "shocked";
                readonly ":-O": "shocked";
                readonly o_o: "shocked";
                readonly O_O: "shocked";
                readonly "8)": "sunglass";
                readonly "8-)": "sunglass";
            };
            defaultTooltipPosition: DijitJS.PlacePositions[];
            metasiteurl?: string;
            ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
            format_block(template: string, args: Record<string, any>): string;
            format_string(template: string, args: Record<string, any>): string;
            format_string_recursive(template: string, args: Record<string, any> & {
                i18n?: Record<string, any>;
                type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                message?: string;
                text?: string;
            }): string;
            clienttranslate_string(text: string): string;
            translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
            register_subs(...handles: DojoJS.Handle[]): void;
            unsubscribe_all(): void;
            register_cometd_subs(...comet_ids: string[]): string | string[];
            showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
            placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
            placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
            disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
            enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
            getComputedTranslateZ(element: Element): number;
            transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
            slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            toRadians(angle: number): number;
            vector_rotate(vector: {
                x: number;
                y: number;
            }, angle: number): {
                x: number;
                y: number;
            };
            attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
            slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
            fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
            rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
            rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            getAbsRotationAngle(target: string | Element | null): number;
            addClassToClass<T_1 extends keyof CSSStyleDeclaration>(className: string, property: T_1, value: CSSStyleDeclaration[T_1]): void;
            connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T_1, event: U, method: keyof any): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U_1>, U_1 extends string, S, M_1 extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T_1, U_1>, any>>(targetObject: T_1, event: U_1, method: M_1, dontFix?: boolean): void;
            disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
            disconnect<T_1 extends DojoJS.ConnectMethodTarget<U_2>, U_2 extends string>(targetObject: T_1, event: U_2): void;
            connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            connectClass<K extends keyof DojoJS.AllEvents, M_2 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_2): void;
            connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
            connectQuery<K extends keyof DojoJS.AllEvents, M_3 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M_3): void;
            addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            addEventToClass<K extends keyof DojoJS.AllEvents, M_4 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_4): void;
            disconnectAll(): void;
            setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
            incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            updateCounters(counters?: Partial<{
                [x: string]: {
                    counter_value: BGA.ID;
                    counter_name: string;
                };
            } | undefined>): void;
            getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
            addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtml(target: string, html: string, delay?: number): void;
            addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
            removeTooltip(target: string): void;
            switchDisplayTooltips(displayType: 0 | 1): void;
            applyCommentMarkup(text: string): string;
            confirmationDialog<T_1 = null>(message: string, yesHandler: (param: T_1) => any, noHandler?: ((param: T_1) => any) | undefined, param?: T_1 | undefined): void;
            warningDialog(message: string, callback: () => any): void;
            infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
            multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
            askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
            displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
            showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
            showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
            getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
            getKarmaLabel(karma: number | string): {
                label: "Perfect" | string;
                css: "exceptional";
            } | {
                label: "Excellent" | string;
                css: "perfect";
            } | {
                label: "Very good" | string;
                css: "verygood";
            } | {
                label: "Good" | string;
                css: "good";
            } | {
                label: "Average" | string;
                css: "average";
            } | {
                label: "Not good" | string;
                css: "notgood";
            } | {
                label: "Bad" | string;
                css: "bad";
            } | {
                label: "Very bad" | string;
                css: "verybad";
            } | undefined;
            getObjectLength(obj: object): number;
            comet_subscriptions: string[];
            unload_in_progress: boolean;
            bCancelAllAjax: boolean;
            tooltipsInfos: Record<string, {
                hideOnHoverEvt: DojoJS.Handle | null;
            }>;
            mozScale: number;
            rotateToPosition: Record<string, number>;
            room: BGA.RoomId | null;
            already_accepted_room: BGA.RoomId | null;
            webpush: InstanceType<BGA.WebPush> | null;
            interface_min_width?: number;
            confirmationDialogUid?: number;
            confirmationDialogUid_called?: number;
            discussionTimeout?: Record<string, number>;
            showclick_circles_no?: number;
            number_of_tb_table_its_your_turn?: number;
            prevent_error_rentry?: number;
            transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
            onresizePlayerAwardsEvent?: DojoJS.Handle;
            gameinterface_zoomFactor?: number;
            ajaxpageload<Scope_1>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope_1, callback: DojoJS.HitchMethod<Scope_1, [data: any], any>): {
                new (): import("../../dojo/promise/Promise")<any>;
            };
            displayUserHttpError(error_code: string | number | null): void;
            cancelAjaxCall(): void;
            applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
            adaptScreenToMinWidth(min_width: number): void;
            adaptScreenToMinWidthWorker(): void;
            getObjPosition(obj: HTMLElement | string): {
                x: number;
                y: number;
            };
            doShowBubble(anchor: string, message: string, custom_class?: string): void;
            getGameNameDisplayed(text: string): string;
            formatReflexionTime(time: number): {
                string: string;
                mn: number;
                s: (string | number);
                h: number;
                positive: boolean;
            };
            strip_tags(e: string, t?: string): string;
            validURL(e: any): boolean;
            nl2br(e: any, t: any): string;
            htmlentities(e: string, t: any, i: any, n: any): string | false;
            html_entity_decode(e: any, t: any): string | false;
            get_html_translation_table(e: any, t: any): Record<string, string>;
            ucFirst(e: any): any;
            setupWebPush(): Promise<void>;
            refreshWebPushWorker(): void;
            getRTCTemplate(e: any, t: any, i: any): string;
            setupRTCEvents(t: string): void;
            getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: never[];
            };
            startRTC(): void;
            doStartRTC(): void;
            onGetUserMediaSuccess(): void;
            onGetUserMediaError(): void;
            onJoinRoom(t: any, i: any): void;
            onClickRTCVideoMax(t: Event): void;
            maximizeRTCVideo(t: any, i: any): void;
            onClickRTCVideoMin(t: any): void;
            onClickRTCVideoSize(t: any): void;
            onClickRTCVideoMic(t: any): void;
            onClickRTCVideoSpk(t: any): void;
            onClickRTCVideoCam(t: any): void;
            onLeaveRoom(t: any, i: any): void;
            onLeaveRoomImmediate(e: any): void;
            doLeaveRoom(e?: any): void;
            clearRTC(): void;
            ntf_webrtcmsg(e: any): void;
            addSmileyToText(e: string): string;
            getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
            makeClickableLinks(e: any, t: any): any;
            makeBgaLinksLocalLinks(e: any): any;
            ensureEbgObjectReinit(e: any): void;
            getRankClassFromElo(e: any): string;
            getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
            getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
            eloToBarPercentage(e: any, t?: boolean): number;
            formatElo(e: string): number;
            formatEloDecimal(e: any): number;
            getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
            getArenaLabel(e: any, t?: any): string;
            insertParamIntoCurrentURL(e: any, t: any): void;
            playerawardsCollapsedAlignement(): void;
            playerawardCollapsedAlignement(t: any): void;
            arenaPointsDetails(e: any, t?: any): {
                league: 0 | 1 | 2 | 3 | 4 | 5;
                league_name: string;
                league_shortname: string;
                league_promotion_shortname: string;
                points: number;
                arelo: number;
            };
            arenaPointsHtml(t: {
                league_name: string;
                league: 0 | 1 | 2 | 3 | 4 | 5;
                arelo: number;
                points: number | null;
                league_promotion_shortname?: string | null;
            }): {
                bar_content: string;
                bottom_infos: string;
                bar_pcent: string;
                bar_pcent_number: string | number;
            };
            declaredClass: string;
            inherited<U_3>(args: IArguments): U_3;
            inherited<U_3>(args: IArguments, newArgs: any[]): U_3;
            inherited(args: IArguments, get: true): Function | void;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T_1, []>> | undefined): ReturnType<DojoJS.Hitched<any, T_1, []>>;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, get: true): DojoJS.Hitched<any, T_1, []>;
            __inherited: DojoJS.DojoClassObject["inherited"];
            getInherited(args: IArguments): Function | void;
            getInherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments): DojoJS.Hitched<any, T_1, []>;
            isInstanceOf(cls: any): boolean;
        }, T, []>>;
        <T extends DojoJS.InheritedMethod<{
            gamedatas?: BGA.Gamedatas | null;
            subscriptions: DojoJS.Handle[];
            tooltips: Record<string, DijitJS.Tooltip>;
            bHideTooltips: boolean;
            screenMinWidth: number;
            currentZoom: number;
            connections: {
                element: any;
                event: string;
                handle: DojoJS.Handle;
            }[];
            instantaneousMode: boolean | 0 | 1;
            webrtc: InstanceType<BGA.WebRTC> | null;
            webrtcmsg_ntf_handle: DojoJS.
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
            Handle | null;
            rtc_mode: 0 | 1 | 2;
            mediaConstraints: BGA.WebRTCMediaConstraints;
            gameMasculinePlayers: string[];
            gameFemininePlayers: string[];
            gameNeutralPlayers: string[];
            emoticons: {
                readonly ":)": "smile";
                readonly ":-)": "smile";
                readonly ":D": "bigsmile";
                readonly ":-D": "bigsmile";
                readonly ":(": "unsmile";
                readonly ":-(": "unsmile";
                readonly ";)": "blink";
                readonly ";-)": "blink";
                readonly ":/": "bad";
                readonly ":-/": "bad";
                readonly ":s": "bad";
                readonly ":-s": "bad";
                readonly ":P": "mischievous";
                readonly ":-P": "mischievous";
                readonly ":p": "mischievous";
                readonly ":-p": "mischievous";
                readonly ":$": "blushing";
                readonly ":-$": "blushing";
                readonly ":o": "surprised";
                readonly ":-o": "surprised";
                readonly ":O": "shocked";
                readonly ":-O": "shocked";
                readonly o_o: "shocked";
                readonly O_O: "shocked";
                readonly "8)": "sunglass";
                readonly "8-)": "sunglass";
            };
            defaultTooltipPosition: DijitJS.PlacePositions[];
            metasiteurl?: string;
            ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
            format_block(template: string, args: Record<string, any>): string;
            format_string(template: string, args: Record<string, any>): string;
            format_string_recursive(template: string, args: Record<string, any> & {
                i18n?: Record<string, any>;
                type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                message?: string;
                text?: string;
            }): string;
            clienttranslate_string(text: string): string;
            translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
            register_subs(...handles: DojoJS.Handle[]): void;
            unsubscribe_all(): void;
            register_cometd_subs(...comet_ids: string[]): string | string[];
            showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
            placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
            placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
            disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
            enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
            getComputedTranslateZ(element: Element): number;
            transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
            slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            toRadians(angle: number): number;
            vector_rotate(vector: {
                x: number;
                y: number;
            }, angle: number): {
                x: number;
                y: number;
            };
            attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
            slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
            fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
            rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
            rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            getAbsRotationAngle(target: string | Element | null): number;
            addClassToClass<T_1 extends keyof CSSStyleDeclaration>(className: string, property: T_1, value: CSSStyleDeclaration[T_1]): void;
            connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T_1, event: U, method: keyof any): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U_1>, U_1 extends string, S, M_1 extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T_1, U_1>, any>>(targetObject: T_1, event: U_1, method: M_1, dontFix?: boolean): void;
            disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
            disconnect<T_1 extends DojoJS.ConnectMethodTarget<U_2>, U_2 extends string>(targetObject: T_1, event: U_2): void;
            connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            connectClass<K extends keyof DojoJS.AllEvents, M_2 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_2): void;
            connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
            connectQuery<K extends keyof DojoJS.AllEvents, M_3 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M_3): void;
            addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            addEventToClass<K extends keyof DojoJS.AllEvents, M_4 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_4): void;
            disconnectAll(): void;
            setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
            incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            updateCounters(counters?: Partial<{
                [x: string]: {
                    counter_value: BGA.ID;
                    counter_name: string;
                };
            } | undefined>): void;
            getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
            addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtml(target: string, html: string, delay?: number): void;
            addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
            removeTooltip(target: string): void;
            switchDisplayTooltips(displayType: 0 | 1): void;
            applyCommentMarkup(text: string): string;
            confirmationDialog<T_1 = null>(message: string, yesHandler: (param: T_1) => any, noHandler?: ((param: T_1) => any) | undefined, param?: T_1 | undefined): void;
            warningDialog(message: string, callback: () => any): void;
            infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
            multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
            askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
            displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
            showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
            showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
            getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
            getKarmaLabel(karma: number | string): {
                label: "Perfect" | string;
                css: "exceptional";
            } | {
                label: "Excellent" | string;
                css: "perfect";
            } | {
                label: "Very good" | string;
                css: "verygood";
            } | {
                label: "Good" | string;
                css: "good";
            } | {
                label: "Average" | string;
                css: "average";
            } | {
                label: "Not good" | string;
                css: "notgood";
            } | {
                label: "Bad" | string;
                css: "bad";
            } | {
                label: "Very bad" | string;
                css: "verybad";
            } | undefined;
            getObjectLength(obj: object): number;
            comet_subscriptions: string[];
            unload_in_progress: boolean;
            bCancelAllAjax: boolean;
            tooltipsInfos: Record<string, {
                hideOnHoverEvt: DojoJS.Handle | null;
            }>;
            mozScale: number;
            rotateToPosition: Record<string, number>;
            room: BGA.RoomId | null;
            already_accepted_room: BGA.RoomId | null;
            webpush: InstanceType<BGA.WebPush> | null;
            interface_min_width?: number;
            confirmationDialogUid?: number;
            confirmationDialogUid_called?: number;
            discussionTimeout?: Record<string, number>;
            showclick_circles_no?: number;
            number_of_tb_table_its_your_turn?: number;
            prevent_error_rentry?: number;
            transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
            onresizePlayerAwardsEvent?: DojoJS.Handle;
            gameinterface_zoomFactor?: number;
            ajaxpageload<Scope_1>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope_1, callback: DojoJS.HitchMethod<Scope_1, [data: any], any>): {
                new (): import("../../dojo/promise/Promise")<any>;
            };
            displayUserHttpError(error_code: string | number | null): void;
            cancelAjaxCall(): void;
            applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
            adaptScreenToMinWidth(min_width: number): void;
            adaptScreenToMinWidthWorker(): void;
            getObjPosition(obj: HTMLElement | string): {
                x: number;
                y: number;
            };
            doShowBubble(anchor: string, message: string, custom_class?: string): void;
            getGameNameDisplayed(text: string): string;
            formatReflexionTime(time: number): {
                string: string;
                mn: number;
                s: (string | number);
                h: number;
                positive: boolean;
            };
            strip_tags(e: string, t?: string): string;
            validURL(e: any): boolean;
            nl2br(e: any, t: any): string;
            htmlentities(e: string, t: any, i: any, n: any): string | false;
            html_entity_decode(e: any, t: any): string | false;
            get_html_translation_table(e: any, t: any): Record<string, string>;
            ucFirst(e: any): any;
            setupWebPush(): Promise<void>;
            refreshWebPushWorker(): void;
            getRTCTemplate(e: any, t: any, i: any): string;
            setupRTCEvents(t: string): void;
            getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: never[];
            };
            startRTC(): void;
            doStartRTC(): void;
            onGetUserMediaSuccess(): void;
            onGetUserMediaError(): void;
            onJoinRoom(t: any, i: any): void;
            onClickRTCVideoMax(t: Event): void;
            maximizeRTCVideo(t: any, i: any): void;
            onClickRTCVideoMin(t: any): void;
            onClickRTCVideoSize(t: any): void;
            onClickRTCVideoMic(t: any): void;
            onClickRTCVideoSpk(t: any): void;
            onClickRTCVideoCam(t: any): void;
            onLeaveRoom(t: any, i: any): void;
            onLeaveRoomImmediate(e: any): void;
            doLeaveRoom(e?: any): void;
            clearRTC(): void;
            ntf_webrtcmsg(e: any): void;
            addSmileyToText(e: string): string;
            getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
            makeClickableLinks(e: any, t: any): any;
            makeBgaLinksLocalLinks(e: any): any;
            ensureEbgObjectReinit(e: any): void;
            getRankClassFromElo(e: any): string;
            getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
            getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
            eloToBarPercentage(e: any, t?: boolean): number;
            formatElo(e: string): number;
            formatEloDecimal(e: any): number;
            getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
            getArenaLabel(e: any, t?: any): string;
            insertParamIntoCurrentURL(e: any, t: any): void;
            playerawardsCollapsedAlignement(): void;
            playerawardCollapsedAlignement(t: any): void;
            arenaPointsDetails(e: any, t?: any): {
                league: 0 | 1 | 2 | 3 | 4 | 5;
                league_name: string;
                league_shortname: string;
                league_promotion_shortname: string;
                points: number;
                arelo: number;
            };
            arenaPointsHtml(t: {
                league_name: string;
                league: 0 | 1 | 2 | 3 | 4 | 5;
                arelo: number;
                points: number | null;
                league_promotion_shortname?: string | null;
            }): {
                bar_content: string;
                bottom_infos: string;
                bar_pcent: string;
                bar_pcent_number: string | number;
            };
            declaredClass: string;
            inherited<U_3>(args: IArguments): U_3;
            inherited<U_3>(args: IArguments, newArgs: any[]): U_3;
            inherited(args: IArguments, get: true): Function | void;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T_1, []>> | undefined): ReturnType<DojoJS.Hitched<any, T_1, []>>;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, get: true): DojoJS.Hitched<any, T_1, []>;
            __inherited: DojoJS.DojoClassObject["inherited"];
            getInherited(args: IArguments): Function | void;
            getInherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments): DojoJS.Hitched<any, T_1, []>;
            isInstanceOf(cls: any): boolean;
        }>>(method: T, args: IArguments, get: true): DojoJS.Hitched<{
            gamedatas?: BGA.Gamedatas | null;
            subscriptions: DojoJS.Handle[];
            tooltips: Record<string, DijitJS.Tooltip>;
            bHideTooltips: boolean;
            screenMinWidth: number;
            currentZoom: number;
            connections: {
                element: any;
                event: string;
                handle: DojoJS.Handle;
            }[];
            instantaneousMode: boolean | 0 | 1;
            webrtc: InstanceType<BGA.WebRTC> | null;
            webrtcmsg_ntf_handle: DojoJS.
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
            Handle | null;
            rtc_mode: 0 | 1 | 2;
            mediaConstraints: BGA.WebRTCMediaConstraints;
            gameMasculinePlayers: string[];
            gameFemininePlayers: string[];
            gameNeutralPlayers: string[];
            emoticons: {
                readonly ":)": "smile";
                readonly ":-)": "smile";
                readonly ":D": "bigsmile";
                readonly ":-D": "bigsmile";
                readonly ":(": "unsmile";
                readonly ":-(": "unsmile";
                readonly ";)": "blink";
                readonly ";-)": "blink";
                readonly ":/": "bad";
                readonly ":-/": "bad";
                readonly ":s": "bad";
                readonly ":-s": "bad";
                readonly ":P": "mischievous";
                readonly ":-P": "mischievous";
                readonly ":p": "mischievous";
                readonly ":-p": "mischievous";
                readonly ":$": "blushing";
                readonly ":-$": "blushing";
                readonly ":o": "surprised";
                readonly ":-o": "surprised";
                readonly ":O": "shocked";
                readonly ":-O": "shocked";
                readonly o_o: "shocked";
                readonly O_O: "shocked";
                readonly "8)": "sunglass";
                readonly "8-)": "sunglass";
            };
            defaultTooltipPosition: DijitJS.PlacePositions[];
            metasiteurl?: string;
            ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
            format_block(template: string, args: Record<string, any>): string;
            format_string(template: string, args: Record<string, any>): string;
            format_string_recursive(template: string, args: Record<string, any> & {
                i18n?: Record<string, any>;
                type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                message?: string;
                text?: string;
            }): string;
            clienttranslate_string(text: string): string;
            translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
            register_subs(...handles: DojoJS.Handle[]): void;
            unsubscribe_all(): void;
            register_cometd_subs(...comet_ids: string[]): string | string[];
            showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
            placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
            placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
            disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
            enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
            getComputedTranslateZ(element: Element): number;
            transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
            slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            toRadians(angle: number): number;
            vector_rotate(vector: {
                x: number;
                y: number;
            }, angle: number): {
                x: number;
                y: number;
            };
            attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
            slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
            fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
            rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
            rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            getAbsRotationAngle(target: string | Element | null): number;
            addClassToClass<T_1 extends keyof CSSStyleDeclaration>(className: string, property: T_1, value: CSSStyleDeclaration[T_1]): void;
            connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T_1, event: U, method: keyof any): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U_1>, U_1 extends string, S, M_1 extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T_1, U_1>, any>>(targetObject: T_1, event: U_1, method: M_1, dontFix?: boolean): void;
            disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
            disconnect<T_1 extends DojoJS.ConnectMethodTarget<U_2>, U_2 extends string>(targetObject: T_1, event: U_2): void;
            connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            connectClass<K extends keyof DojoJS.AllEvents, M_2 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_2): void;
            connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
            connectQuery<K extends keyof DojoJS.AllEvents, M_3 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M_3): void;
            addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            addEventToClass<K extends keyof DojoJS.AllEvents, M_4 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_4): void;
            disconnectAll(): void;
            setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
            incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            updateCounters(counters?: Partial<{
                [x: string]: {
                    counter_value: BGA.ID;
                    counter_name: string;
                };
            } | undefined>): void;
            getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
            addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtml(target: string, html: string, delay?: number): void;
            addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
            removeTooltip(target: string): void;
            switchDisplayTooltips(displayType: 0 | 1): void;
            applyCommentMarkup(text: string): string;
            confirmationDialog<T_1 = null>(message: string, yesHandler: (param: T_1) => any, noHandler?: ((param: T_1) => any) | undefined, param?: T_1 | undefined): void;
            warningDialog(message: string, callback: () => any): void;
            infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
            multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
            askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
            displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
            showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
            showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
            getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
            getKarmaLabel(karma: number | string): {
                label: "Perfect" | string;
                css: "exceptional";
            } | {
                label: "Excellent" | string;
                css: "perfect";
            } | {
                label: "Very good" | string;
                css: "verygood";
            } | {
                label: "Good" | string;
                css: "good";
            } | {
                label: "Average" | string;
                css: "average";
            } | {
                label: "Not good" | string;
                css: "notgood";
            } | {
                label: "Bad" | string;
                css: "bad";
            } | {
                label: "Very bad" | string;
                css: "verybad";
            } | undefined;
            getObjectLength(obj: object): number;
            comet_subscriptions: string[];
            unload_in_progress: boolean;
            bCancelAllAjax: boolean;
            tooltipsInfos: Record<string, {
                hideOnHoverEvt: DojoJS.Handle | null;
            }>;
            mozScale: number;
            rotateToPosition: Record<string, number>;
            room: BGA.RoomId | null;
            already_accepted_room: BGA.RoomId | null;
            webpush: InstanceType<BGA.WebPush> | null;
            interface_min_width?: number;
            confirmationDialogUid?: number;
            confirmationDialogUid_called?: number;
            discussionTimeout?: Record<string, number>;
            showclick_circles_no?: number;
            number_of_tb_table_its_your_turn?: number;
            prevent_error_rentry?: number;
            transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
            onresizePlayerAwardsEvent?: DojoJS.Handle;
            gameinterface_zoomFactor?: number;
            ajaxpageload<Scope_1>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope_1, callback: DojoJS.HitchMethod<Scope_1, [data: any], any>): {
                new (): import("../../dojo/promise/Promise")<any>;
            };
            displayUserHttpError(error_code: string | number | null): void;
            cancelAjaxCall(): void;
            applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
            adaptScreenToMinWidth(min_width: number): void;
            adaptScreenToMinWidthWorker(): void;
            getObjPosition(obj: HTMLElement | string): {
                x: number;
                y: number;
            };
            doShowBubble(anchor: string, message: string, custom_class?: string): void;
            getGameNameDisplayed(text: string): string;
            formatReflexionTime(time: number): {
                string: string;
                mn: number;
                s: (string | number);
                h: number;
                positive: boolean;
            };
            strip_tags(e: string, t?: string): string;
            validURL(e: any): boolean;
            nl2br(e: any, t: any): string;
            htmlentities(e: string, t: any, i: any, n: any): string | false;
            html_entity_decode(e: any, t: any): string | false;
            get_html_translation_table(e: any, t: any): Record<string, string>;
            ucFirst(e: any): any;
            setupWebPush(): Promise<void>;
            refreshWebPushWorker(): void;
            getRTCTemplate(e: any, t: any, i: any): string;
            setupRTCEvents(t: string): void;
            getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: never[];
            };
            startRTC(): void;
            doStartRTC(): void;
            onGetUserMediaSuccess(): void;
            onGetUserMediaError(): void;
            onJoinRoom(t: any, i: any): void;
            onClickRTCVideoMax(t: Event): void;
            maximizeRTCVideo(t: any, i: any): void;
            onClickRTCVideoMin(t: any): void;
            onClickRTCVideoSize(t: any): void;
            onClickRTCVideoMic(t: any): void;
            onClickRTCVideoSpk(t: any): void;
            onClickRTCVideoCam(t: any): void;
            onLeaveRoom(t: any, i: any): void;
            onLeaveRoomImmediate(e: any): void;
            doLeaveRoom(e?: any): void;
            clearRTC(): void;
            ntf_webrtcmsg(e: any): void;
            addSmileyToText(e: string): string;
            getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
            makeClickableLinks(e: any, t: any): any;
            makeBgaLinksLocalLinks(e: any): any;
            ensureEbgObjectReinit(e: any): void;
            getRankClassFromElo(e: any): string;
            getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
            getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
            eloToBarPercentage(e: any, t?: boolean): number;
            formatElo(e: string): number;
            formatEloDecimal(e: any): number;
            getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
            getArenaLabel(e: any, t?: any): string;
            insertParamIntoCurrentURL(e: any, t: any): void;
            playerawardsCollapsedAlignement(): void;
            playerawardCollapsedAlignement(t: any): void;
            arenaPointsDetails(e: any, t?: any): {
                league: 0 | 1 | 2 | 3 | 4 | 5;
                league_name: string;
                league_shortname: string;
                league_promotion_shortname: string;
                points: number;
                arelo: number;
            };
            arenaPointsHtml(t: {
                league_name: string;
                league: 0 | 1 | 2 | 3 | 4 | 5;
                arelo: number;
                points: number | null;
                league_promotion_shortname?: string | null;
            }): {
                bar_content: string;
                bottom_infos: string;
                bar_pcent: string;
                bar_pcent_number: string | number;
            };
            declaredClass: string;
            inherited<U_3>(args: IArguments): U_3;
            inherited<U_3>(args: IArguments, newArgs: any[]): U_3;
            inherited(args: IArguments, get: true): Function | void;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T_1, []>> | undefined): ReturnType<DojoJS.Hitched<any, T_1, []>>;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, get: true): DojoJS.Hitched<any, T_1, []>;
            __inherited: DojoJS.DojoClassObject["inherited"];
            getInherited(args: IArguments): Function | void;
            getInherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments): DojoJS.Hitched<any, T_1, []>;
            isInstanceOf(cls: any): boolean;
        }, T, []>;
    };
    __inherited: DojoJS.DojoClassObject["inherited"];
    getInherited: {
        (args: IArguments): Function | void;
        <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments): DojoJS.Hitched<any, T, []>;
    } & {
        (args: IArguments): Function | void;
        <T extends DojoJS.InheritedMethod<{
            gamedatas?: BGA.Gamedatas | null;
            subscriptions: DojoJS.Handle[];
            tooltips: Record<string, DijitJS.Tooltip>;
            bHideTooltips: boolean;
            screenMinWidth: number;
            currentZoom: number;
            connections: {
                element: any;
                event: string;
                handle: DojoJS.Handle;
            }[];
            instantaneousMode: boolean | 0 | 1;
            webrtc: InstanceType<BGA.WebRTC> | null;
            webrtcmsg_ntf_handle: DojoJS.
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
            Handle | null;
            rtc_mode: 0 | 1 | 2;
            mediaConstraints: BGA.WebRTCMediaConstraints;
            gameMasculinePlayers: string[];
            gameFemininePlayers: string[];
            gameNeutralPlayers: string[];
            emoticons: {
                readonly ":)": "smile";
                readonly ":-)": "smile";
                readonly ":D": "bigsmile";
                readonly ":-D": "bigsmile";
                readonly ":(": "unsmile";
                readonly ":-(": "unsmile";
                readonly ";)": "blink";
                readonly ";-)": "blink";
                readonly ":/": "bad";
                readonly ":-/": "bad";
                readonly ":s": "bad";
                readonly ":-s": "bad";
                readonly ":P": "mischievous";
                readonly ":-P": "mischievous";
                readonly ":p": "mischievous";
                readonly ":-p": "mischievous";
                readonly ":$": "blushing";
                readonly ":-$": "blushing";
                readonly ":o": "surprised";
                readonly ":-o": "surprised";
                readonly ":O": "shocked";
                readonly ":-O": "shocked";
                readonly o_o: "shocked";
                readonly O_O: "shocked";
                readonly "8)": "sunglass";
                readonly "8-)": "sunglass";
            };
            defaultTooltipPosition: DijitJS.PlacePositions[];
            metasiteurl?: string;
            ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
            format_block(template: string, args: Record<string, any>): string;
            format_string(template: string, args: Record<string, any>): string;
            format_string_recursive(template: string, args: Record<string, any> & {
                i18n?: Record<string, any>;
                type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                message?: string;
                text?: string;
            }): string;
            clienttranslate_string(text: string): string;
            translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
            register_subs(...handles: DojoJS.Handle[]): void;
            unsubscribe_all(): void;
            register_cometd_subs(...comet_ids: string[]): string | string[];
            showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
            placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
            placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
            disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
            enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
            getComputedTranslateZ(element: Element): number;
            transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
            slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            toRadians(angle: number): number;
            vector_rotate(vector: {
                x: number;
                y: number;
            }, angle: number): {
                x: number;
                y: number;
            };
            attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
            slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
            fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
            rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
            rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            getAbsRotationAngle(target: string | Element | null): number;
            addClassToClass<T_1 extends keyof CSSStyleDeclaration>(className: string, property: T_1, value: CSSStyleDeclaration[T_1]): void;
            connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T_1, event: U, method: keyof any): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U_1>, U_1 extends string, S, M_1 extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T_1, U_1>, any>>(targetObject: T_1, event: U_1, method: M_1, dontFix?: boolean): void;
            disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
            disconnect<T_1 extends DojoJS.ConnectMethodTarget<U_2>, U_2 extends string>(targetObject: T_1, event: U_2): void;
            connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            connectClass<K extends keyof DojoJS.AllEvents, M_2 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_2): void;
            connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
            connectQuery<K extends keyof DojoJS.AllEvents, M_3 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M_3): void;
            addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            addEventToClass<K extends keyof DojoJS.AllEvents, M_4 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_4): void;
            disconnectAll(): void;
            setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
            incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            updateCounters(counters?: Partial<{
                [x: string]: {
                    counter_value: BGA.ID;
                    counter_name: string;
                };
            } | undefined>): void;
            getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
            addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtml(target: string, html: string, delay?: number): void;
            addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
            removeTooltip(target: string): void;
            switchDisplayTooltips(displayType: 0 | 1): void;
            applyCommentMarkup(text: string): string;
            confirmationDialog<T_1 = null>(message: string, yesHandler: (param: T_1) => any, noHandler?: ((param: T_1) => any) | undefined, param?: T_1 | undefined): void;
            warningDialog(message: string, callback: () => any): void;
            infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
            multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
            askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
            displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
            showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
            showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
            getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
            getKarmaLabel(karma: number | string): {
                label: "Perfect" | string;
                css: "exceptional";
            } | {
                label: "Excellent" | string;
                css: "perfect";
            } | {
                label: "Very good" | string;
                css: "verygood";
            } | {
                label: "Good" | string;
                css: "good";
            } | {
                label: "Average" | string;
                css: "average";
            } | {
                label: "Not good" | string;
                css: "notgood";
            } | {
                label: "Bad" | string;
                css: "bad";
            } | {
                label: "Very bad" | string;
                css: "verybad";
            } | undefined;
            getObjectLength(obj: object): number;
            comet_subscriptions: string[];
            unload_in_progress: boolean;
            bCancelAllAjax: boolean;
            tooltipsInfos: Record<string, {
                hideOnHoverEvt: DojoJS.Handle | null;
            }>;
            mozScale: number;
            rotateToPosition: Record<string, number>;
            room: BGA.RoomId | null;
            already_accepted_room: BGA.RoomId | null;
            webpush: InstanceType<BGA.WebPush> | null;
            interface_min_width?: number;
            confirmationDialogUid?: number;
            confirmationDialogUid_called?: number;
            discussionTimeout?: Record<string, number>;
            showclick_circles_no?: number;
            number_of_tb_table_its_your_turn?: number;
            prevent_error_rentry?: number;
            transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
            onresizePlayerAwardsEvent?: DojoJS.Handle;
            gameinterface_zoomFactor?: number;
            ajaxpageload<Scope_1>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope_1, callback: DojoJS.HitchMethod<Scope_1, [data: any], any>): {
                new (): import("../../dojo/promise/Promise")<any>;
            };
            displayUserHttpError(error_code: string | number | null): void;
            cancelAjaxCall(): void;
            applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
            adaptScreenToMinWidth(min_width: number): void;
            adaptScreenToMinWidthWorker(): void;
            getObjPosition(obj: HTMLElement | string): {
                x: number;
                y: number;
            };
            doShowBubble(anchor: string, message: string, custom_class?: string): void;
            getGameNameDisplayed(text: string): string;
            formatReflexionTime(time: number): {
                string: string;
                mn: number;
                s: (string | number);
                h: number;
                positive: boolean;
            };
            strip_tags(e: string, t?: string): string;
            validURL(e: any): boolean;
            nl2br(e: any, t: any): string;
            htmlentities(e: string, t: any, i: any, n: any): string | false;
            html_entity_decode(e: any, t: any): string | false;
            get_html_translation_table(e: any, t: any): Record<string, string>;
            ucFirst(e: any): any;
            setupWebPush(): Promise<void>;
            refreshWebPushWorker(): void;
            getRTCTemplate(e: any, t: any, i: any): string;
            setupRTCEvents(t: string): void;
            getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: never[];
            };
            startRTC(): void;
            doStartRTC(): void;
            onGetUserMediaSuccess(): void;
            onGetUserMediaError(): void;
            onJoinRoom(t: any, i: any): void;
            onClickRTCVideoMax(t: Event): void;
            maximizeRTCVideo(t: any, i: any): void;
            onClickRTCVideoMin(t: any): void;
            onClickRTCVideoSize(t: any): void;
            onClickRTCVideoMic(t: any): void;
            onClickRTCVideoSpk(t: any): void;
            onClickRTCVideoCam(t: any): void;
            onLeaveRoom(t: any, i: any): void;
            onLeaveRoomImmediate(e: any): void;
            doLeaveRoom(e?: any): void;
            clearRTC(): void;
            ntf_webrtcmsg(e: any): void;
            addSmileyToText(e: string): string;
            getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
            makeClickableLinks(e: any, t: any): any;
            makeBgaLinksLocalLinks(e: any): any;
            ensureEbgObjectReinit(e: any): void;
            getRankClassFromElo(e: any): string;
            getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
            getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
            eloToBarPercentage(e: any, t?: boolean): number;
            formatElo(e: string): number;
            formatEloDecimal(e: any): number;
            getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
            getArenaLabel(e: any, t?: any): string;
            insertParamIntoCurrentURL(e: any, t: any): void;
            playerawardsCollapsedAlignement(): void;
            playerawardCollapsedAlignement(t: any): void;
            arenaPointsDetails(e: any, t?: any): {
                league: 0 | 1 | 2 | 3 | 4 | 5;
                league_name: string;
                league_shortname: string;
                league_promotion_shortname: string;
                points: number;
                arelo: number;
            };
            arenaPointsHtml(t: {
                league_name: string;
                league: 0 | 1 | 2 | 3 | 4 | 5;
                arelo: number;
                points: number | null;
                league_promotion_shortname?: string | null;
            }): {
                bar_content: string;
                bottom_infos: string;
                bar_pcent: string;
                bar_pcent_number: string | number;
            };
            declaredClass: string;
            inherited<U_3>(args: IArguments): U_3;
            inherited<U_3>(args: IArguments, newArgs: any[]): U_3;
            inherited(args: IArguments, get: true): Function | void;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T_1, []>> | undefined): ReturnType<DojoJS.Hitched<any, T_1, []>>;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, get: true): DojoJS.Hitched<any, T_1, []>;
            __inherited: DojoJS.DojoClassObject["inherited"];
            getInherited(args: IArguments): Function | void;
            getInherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments): DojoJS.Hitched<any, T_1, []>;
            isInstanceOf(cls: any): boolean;
        }>>(method: T, args: IArguments): DojoJS.Hitched<{
            gamedatas?: BGA.Gamedatas | null;
            subscriptions: DojoJS.Handle[];
            tooltips: Record<string, DijitJS.Tooltip>;
            bHideTooltips: boolean;
            screenMinWidth: number;
            currentZoom: number;
            connections: {
                element: any;
                event: string;
                handle: DojoJS.Handle;
            }[];
            instantaneousMode: boolean | 0 | 1;
            webrtc: InstanceType<BGA.WebRTC> | null;
            webrtcmsg_ntf_handle: DojoJS.
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
            Handle | null;
            rtc_mode: 0 | 1 | 2;
            mediaConstraints: BGA.WebRTCMediaConstraints;
            gameMasculinePlayers: string[];
            gameFemininePlayers: string[];
            gameNeutralPlayers: string[];
            emoticons: {
                readonly ":)": "smile";
                readonly ":-)": "smile";
                readonly ":D": "bigsmile";
                readonly ":-D": "bigsmile";
                readonly ":(": "unsmile";
                readonly ":-(": "unsmile";
                readonly ";)": "blink";
                readonly ";-)": "blink";
                readonly ":/": "bad";
                readonly ":-/": "bad";
                readonly ":s": "bad";
                readonly ":-s": "bad";
                readonly ":P": "mischievous";
                readonly ":-P": "mischievous";
                readonly ":p": "mischievous";
                readonly ":-p": "mischievous";
                readonly ":$": "blushing";
                readonly ":-$": "blushing";
                readonly ":o": "surprised";
                readonly ":-o": "surprised";
                readonly ":O": "shocked";
                readonly ":-O": "shocked";
                readonly o_o: "shocked";
                readonly O_O: "shocked";
                readonly "8)": "sunglass";
                readonly "8-)": "sunglass";
            };
            defaultTooltipPosition: DijitJS.PlacePositions[];
            metasiteurl?: string;
            ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
            format_block(template: string, args: Record<string, any>): string;
            format_string(template: string, args: Record<string, any>): string;
            format_string_recursive(template: string, args: Record<string, any> & {
                i18n?: Record<string, any>;
                type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                message?: string;
                text?: string;
            }): string;
            clienttranslate_string(text: string): string;
            translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
            register_subs(...handles: DojoJS.Handle[]): void;
            unsubscribe_all(): void;
            register_cometd_subs(...comet_ids: string[]): string | string[];
            showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
            placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
            placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
            disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
            enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
            getComputedTranslateZ(element: Element): number;
            transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */>;
            slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
            toRadians(angle: number): number;
            vector_rotate(vector: {
                x: number;
                y: number;
            }, angle: number): {
                x: number;
                y: number;
            };
            attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
            slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
            slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
            fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
            rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
            rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
            getAbsRotationAngle(target: string | Element | null): number;
            addClassToClass<T_1 extends keyof CSSStyleDeclaration>(className: string, property: T_1, value: CSSStyleDeclaration[T_1]): void;
            connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T_1, event: U, method: keyof any): void;
            connect<T_1 extends DojoJS.ConnectMethodTarget<U_1>, U_1 extends string, S, M_1 extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T_1, U_1>, any>>(targetObject: T_1, event: U_1, method: M_1, dontFix?: boolean): void;
            disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
            disconnect<T_1 extends DojoJS.ConnectMethodTarget<U_2>, U_2 extends string>(targetObject: T_1, event: U_2): void;
            connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            connectClass<K extends keyof DojoJS.AllEvents, M_2 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_2): void;
            connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
            connectQuery<K extends keyof DojoJS.AllEvents, M_3 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M_3): void;
            addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
            addEventToClass<K extends keyof DojoJS.AllEvents, M_4 extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M_4): void;
            disconnectAll(): void;
            setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
            incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
            updateCounters(counters?: Partial<{
                [x: string]: {
                    counter_value: BGA.ID;
                    counter_name: string;
                };
            } | undefined>): void;
            getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
            addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtml(target: string, html: string, delay?: number): void;
            addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
            addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
            removeTooltip(target: string): void;
            switchDisplayTooltips(displayType: 0 | 1): void;
            applyCommentMarkup(text: string): string;
            confirmationDialog<T_1 = null>(message: string, yesHandler: (param: T_1) => any, noHandler?: ((param: T_1) => any) | undefined, param?: T_1 | undefined): void;
            warningDialog(message: string, callback: () => any): void;
            infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
            multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
            askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
            displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
            showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
            showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
            getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
            getKarmaLabel(karma: number | string): {
                label: "Perfect" | string;
                css: "exceptional";
            } | {
                label: "Excellent" | string;
                css: "perfect";
            } | {
                label: "Very good" | string;
                css: "verygood";
            } | {
                label: "Good" | string;
                css: "good";
            } | {
                label: "Average" | string;
                css: "average";
            } | {
                label: "Not good" | string;
                css: "notgood";
            } | {
                label: "Bad" | string;
                css: "bad";
            } | {
                label: "Very bad" | string;
                css: "verybad";
            } | undefined;
            getObjectLength(obj: object): number;
            comet_subscriptions: string[];
            unload_in_progress: boolean;
            bCancelAllAjax: boolean;
            tooltipsInfos: Record<string, {
                hideOnHoverEvt: DojoJS.Handle | null;
            }>;
            mozScale: number;
            rotateToPosition: Record<string, number>;
            room: BGA.RoomId | null;
            already_accepted_room: BGA.RoomId | null;
            webpush: InstanceType<BGA.WebPush> | null;
            interface_min_width?: number;
            confirmationDialogUid?: number;
            confirmationDialogUid_called?: number;
            discussionTimeout?: Record<string, number>;
            showclick_circles_no?: number;
            number_of_tb_table_its_your_turn?: number;
            prevent_error_rentry?: number;
            transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
            onresizePlayerAwardsEvent?: DojoJS.Handle;
            gameinterface_zoomFactor?: number;
            ajaxpageload<Scope_1>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope_1, callback: DojoJS.HitchMethod<Scope_1, [data: any], any>): {
                new (): import("../../dojo/promise/Promise")<any>;
            };
            displayUserHttpError(error_code: string | number | null): void;
            cancelAjaxCall(): void;
            applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
            adaptScreenToMinWidth(min_width: number): void;
            adaptScreenToMinWidthWorker(): void;
            getObjPosition(obj: HTMLElement | string): {
                x: number;
                y: number;
            };
            doShowBubble(anchor: string, message: string, custom_class?: string): void;
            getGameNameDisplayed(text: string): string;
            formatReflexionTime(time: number): {
                string: string;
                mn: number;
                s: (string | number);
                h: number;
                positive: boolean;
            };
            strip_tags(e: string, t?: string): string;
            validURL(e: any): boolean;
            nl2br(e: any, t: any): string;
            htmlentities(e: string, t: any, i: any, n: any): string | false;
            html_entity_decode(e: any, t: any): string | false;
            get_html_translation_table(e: any, t: any): Record<string, string>;
            ucFirst(e: any): any;
            setupWebPush(): Promise<void>;
            refreshWebPushWorker(): void;
            getRTCTemplate(e: any, t: any, i: any): string;
            setupRTCEvents(t: string): void;
            getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                mandatory: {
                    minAspectRatio: number;
                    maxAspectRatio: number;
                    maxWidth: number;
                    maxFrameRate: number;
                };
                optional: never[];
            };
            startRTC(): void;
            doStartRTC(): void;
            onGetUserMediaSuccess(): void;
            onGetUserMediaError(): void;
            onJoinRoom(t: any, i: any): void;
            onClickRTCVideoMax(t: Event): void;
            maximizeRTCVideo(t: any, i: any): void;
            onClickRTCVideoMin(t: any): void;
            onClickRTCVideoSize(t: any): void;
            onClickRTCVideoMic(t: any): void;
            onClickRTCVideoSpk(t: any): void;
            onClickRTCVideoCam(t: any): void;
            onLeaveRoom(t: any, i: any): void;
            onLeaveRoomImmediate(e: any): void;
            doLeaveRoom(e?: any): void;
            clearRTC(): void;
            ntf_webrtcmsg(e: any): void;
            addSmileyToText(e: string): string;
            getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
            makeClickableLinks(e: any, t: any): any;
            makeBgaLinksLocalLinks(e: any): any;
            ensureEbgObjectReinit(e: any): void;
            getRankClassFromElo(e: any): string;
            getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
            getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
            eloToBarPercentage(e: any, t?: boolean): number;
            formatElo(e: string): number;
            formatEloDecimal(e: any): number;
            getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
            getArenaLabel(e: any, t?: any): string;
            insertParamIntoCurrentURL(e: any, t: any): void;
            playerawardsCollapsedAlignement(): void;
            playerawardCollapsedAlignement(t: any): void;
            arenaPointsDetails(e: any, t?: any): {
                league: 0 | 1 | 2 | 3 | 4 | 5;
                league_name: string;
                league_shortname: string;
                league_promotion_shortname: string;
                points: number;
                arelo: number;
            };
            arenaPointsHtml(t: {
                league_name: string;
                league: 0 | 1 | 2 | 3 | 4 | 5;
                arelo: number;
                points: number | null;
                league_promotion_shortname?: string | null;
            }): {
                bar_content: string;
                bottom_infos: string;
                bar_pcent: string;
                bar_pcent_number: string | number;
            };
            declaredClass: string;
            inherited<U_3>(args: IArguments): U_3;
            inherited<U_3>(args: IArguments, newArgs: any[]): U_3;
            inherited(args: IArguments, get: true): Function | void;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T_1, []>> | undefined): ReturnType<DojoJS.Hitched<any, T_1, []>>;
            inherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments, get: true): DojoJS.Hitched<any, T_1, []>;
            __inherited: DojoJS.DojoClassObject["inherited"];
            getInherited(args: IArguments): Function | void;
            getInherited<T_1 extends DojoJS.InheritedMethod<any>>(method: T_1, args: IArguments): DojoJS.Hitched<any, T_1, []>;
            isInstanceOf(cls: any): boolean;
        }, T, []>;
    };
    isInstanceOf(cls: any): boolean;
} & Gamegui_Template, []>;
export = Gamegui;
declare global {
    namespace BGA {
        type Gamegui = typeof Gamegui;
        interface EBG {
            core: EBG_CORE;
        }
        interface EBG_CORE {
            gamegui: Gamegui;
        }
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
    var g_gamelogs: Record<BGA.ID, BGA.NotifsPacket> | {
        data: {
            data: Record<BGA.ID, BGA.NotifsPacket>;
        };
    };
    /** A global variable caused by bad code in ebg/core/gamegui:displayTableWindow. Don't use a global variable with this name or it may unexpectedly be overriden. */
    var col_id: string | undefined;
    interface Window extends Type<{
        [hotseat_iframe: `hotseat_iframe_${number}`]: HTMLIFrameElement;
    }> {
    }
}
//# sourceMappingURL=gamegui.d.ts.map