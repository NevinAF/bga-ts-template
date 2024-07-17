import "dojo";
import "dojo/_base/declare";
import "dojo/query";
import "dijit/DialogUnderlay";
import "dijit/TooltipDialog";
import SiteCore = require("ebg/core/sitecore");
import "ebg/gamenotif";
import ChatInput = require("ebg/chatinput");
import "dijit/Dialog";
import "ebg/playerlocation";
import "ebg/pageheader";
import "ebg/draggable";
import "ebg/tableresults";
import "ebg/paymentbuttons";


import Counter = require("ebg/counter"); // Not imported in source code but there are no circular dependencies. Likely an internal oversight.

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
* Partial: This has been partially typed based on a subset of the BGA source code.
*/
declare class Gamegui extends SiteCore {

	/** The name of the game currently being played. This will always be the lowercase and spaceless version: 'yourgamename'. */
	game_name: string;
	/** The human readable name which should be displayed to the user. (Looks like it is already translated, but could wrong) */
	game_name_displayed: string;

	/**
	 * The data from the server that is used to initialize the game client. This is the same as `gamedatas` in the `setup` method and is untouched after the `setup` method is called.
	 * 
	 * This is null only when accessing from within the constructor.
	 * @example
	 * for (var player_id in this.gamedatas.players) { 
	 * 	var playerInfo = this.gamedatas.players [player_id];
	 * 	var c = playerInfo.color;
	 * 	var name = playerInfo.name;
	 * 	// do something 
	 * }
	 */
	gamedatas: Gamedatas /* | null */;
	/** The channel for this game's table. This will always match `table/t${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
	channel: `table/t${number}` /* | null */;
	/** The channel for the current player. This will always match `player/p${private_channel_id}`. This is null only when accessing from within the constructor. */
	privatechannel: `/player/p${number}` /* | null */;
	/** The channel for this game's table spectators. This will always match `table/ts${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
	tablechannelSpectators: `table/ts${number}` /* | null */;
	/**
	 * The id of the player using the current client. The player may not be playing the game, but instead a spectator! This is null only when accessing from within the constructor.
	 * @example if (notif.args.player_id == this.player_id) { ... }
	 */
	player_id: number /* | null */;
	/** The id for the current game's table. This is null only when accessing from within the constructor. */
	table_id: number /* | null */;
	/** The name of this player using this game client. */
	current_player_name: string;

	/** Unmodified clone of the gamedatas gamestate. See {@link restoreServerGameState} for more information. This is null only when accessing from within the constructor. */
	last_server_state: CurrentStateArgs /* | null */;
	/** Boolean indicating that the current game state is a client state, i.e. we have called {@link setClientState} and have not yet sent anything to the server. */
	on_client_state: boolean;
	/**
	 * If the current player is a spectator. Note: If you want to hide an element from spectators, you should use CSS 'spectatorMode' class.
	 * @example
	 * if (this.isSpectator) {
	 * 	this.player_color = 'ffffff';
	 * } else {
	 * 	this.player_color = gamedatas.players[this.player_id].color;
	 * }
	 */
	isSpectator: boolean;
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
	blinkid: string;
	/** The human readable target for the {@link blinkid}. */
	blinkdomain: string;
	/** Boolean for if this game is currently in developermode. This is the game as checking if element id 'debug_output' exists. */
	developermode: boolean;
	/** If true, this is a sandbox game. Sandbox games are mostly non-scripted and act like a table top simulator rather than a traditional BGA game. */
	is_sandbox: boolean;
	/** The id for this game, mostly used for generating the table results and loading game statistics. */
	game_id: number;
	/** If the current game that is being played is a coop game. This is different than if the game can be played coop. */
	is_coop: boolean;
	/** If the current game that is being played is a solo game. This is different than if the game can be played solo. */
	is_solo: boolean;
	/**
	 * The user preferences for the specific client.
	 * @example
	 * // If display tooltips is Enabled
	 * if (this.prefs[200].value == 0) 
	 * 	...
	 */
	prefs: Record<number | `${number}`, Preference>;
	/** The description for tiebreakers as found in the gameinfos file. This is in english and is translated when needed by the {@link TableResults} component. */
	tiebreaker: string;
	/** If defined and true, the table results will show the tie breaker scores as needed. Otherwise, no tiebreaker content is added. */
	tiebreaker_split?: boolean;
	/** If losers should not be ranked, as defined in the gameinfos file. If in the game, all losers are equal (no score to rank them or explicit in the rules that losers are not ranked between them), set this to true  The game end result will display 'Winner' for the 1st player and 'Loser' for all other players. Your can view core.core getRankString() (CoreCore) for more information. */
	losers_not_ranked: boolean;
	/** Defines if this page represents a tutorial version of the game. */
	bTutorial: boolean;

	/** The id for the display tooltips preference. */
	GAMEPREFERENCE_DISPLAYTOOLTIPS: 200;

	/**
	 * A record of {@link Counter} objects which show on the built-in player cards. The record key is the player id. This is initialized by the framework but manually needs to be updated when a player's score changes.
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
	scoreCtrl: { [player_id: number]: Counter };

	//#region Core Functions

	/** Defines the constructor for classes that implement this interface. This comment is not visible in mode current versions of JSDoc. See the interface comment instead. */
	new(): Gamegui;

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
	setup(gamedatas: Gamedatas): void;

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
	onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void;
	
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
	onLeavingState(stateName: GameStateName): void;

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
	onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void

	/**
	 * This method associates notifications with notification handlers. For each game notification, you can trigger a javascript method to handle it and update the game interface. This method should be manually invoked during the `setup` function.
	 * 
	 * This method is overridden as need by the framework to prevent oddities in specific situation, like when viewing the game in {@link g_archive_mode}.
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
	setupNotifications(): void;

	//#endregion

	//#region Player Information

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
	getActivePlayerId(): number;

	/**
	 * Returns the ids of the active players. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
	 * @returns The ids of the active players.
	 */
	getActivePlayers(): number[];

	//#endregion

	//#region DOM Manipulation

	//#endregion

	//#region Player Actions

	// This is an override such that enforces the table/noerrortracking options not be defined in the args parameter.
	// @ts-ignore
	ajaxcall(
		url: string,
		args: (PlayerActions[keyof PlayerActions] | Record<keyof any, any>) & { lock: boolean | 'table' | 'player', action?: undefined, module?: undefined, class?: undefined, noerrortracking?: undefined, table?: undefined },
		source: Gamegui,
		onSuccess?: Function | string,
		callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any,
		ajax_method?: 'post' | 'get' | 'iframe'): void;

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
	checkAction(action: keyof PlayerActions, nomessage?: boolean): boolean;

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
	checkPossibleActions(action: keyof PlayerActions): boolean;

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
	checkLock(nomessage?: boolean): boolean;

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
	addActionButton(id: string, label: string, method: string | Function, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none'): void;

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
	updatePageTitle(stateArgs?: CurrentStateArgs): void;

	//#endregion

	//#region Player Panel and Score Counters

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
	setClientState<T extends GameStateName>(newState: T, args: GameStateArgs<T>): void;

	/** If you are in client state it will restore the current server state (cheap undo). */
	restoreServerGameState(): void;

	//#endregion

	//#region Environment State and Callbacks

	/** A function that can be overridden to manage some resizing on the client side when the browser window is resized. This function is also triggered at load time, so it can be used to adapt to the viewport size at the start of the game too. */
	onScreenWidthChange(): void;

	/** True if the game is in realtime. Note that having a distinct behavior in realtime and turn-based should be exceptional. */
	bRealtime: boolean;

	/** Returns "studio" for studio and "prod" for production environment (i.e. where games current runs). Only useful for debbugging hooks. Note: alpha server is also "prod" */
	getBgaEnvironment(): 'studio' | 'prod';

	/** Not officially documented! Forces all resize events to activate. */
	sendResizeEvent(): void;

	/** Not officially documented! Gets the html element for the replay log. */
	getReplayLogNode(): HTMLElement | null;

	//#endregion

	//#region Internal

	/** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
	currentPlayerReflexionTime: { positive: boolean, mn: number, s: number };
	/** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
	activePlayerReflexionTime: { positive: boolean, mn: number, s: number };
	/** Internal. The `setTimeout` used for updating the reflexion time. This is called every 100ms whenever a timer is running. */
	clock_timeout: number | null;
	/** Internal. @deprecated This has been joined with {@link clock_timeout}. */
	clock_opponent_timeout: null;
	/** Internal. Timout for automatically calling {@link sendWakeUpSignal}. See {@link sendWakeupInTenSeconds} for more information. */
	wakeup_timeout: number | null;
	/** Internal. @deprecated This is not used within the main code file anymore. */
	wakupchek_timeout: null;
	/** Internal. This is the user id that is appended as a ajax argument to replay from messages. */
	forceTestUser: number | null;
	/** Internal. When about to switch to a private game state, this will be populated with the arguments for that state. Next time the game state is changed, this will be consumed. */
	next_private_args: any | null;
	/** Internal. Counter for the index of archived log messages. Used to populating notifications that have passed any don't need to be processed like normal. */
	next_archive_index: number;
	/** Internal. When in archive mode, this is used to manage the state of the archive playback. */
	archive_playmode: 'stop' | 'goto' | 'nextlog' | 'nextturn' | 'play' | 'nextcomment';
	/** Internal. The move id that should be used when starting archive playback. */
	archive_gotomove: number;
	/** Internal. The previous active player, use for updating the archive playback correctly. */
	archive_previous_player: number /* | null */;
	/** Internal. Special UID counter used for archive messages. */
	archive_uuid: number;
	/** Internal. Used to manage archive comments. */
	archiveCommentNew: dijit.TooltipDialog | null;
	/** Internal. Used to manage archive comments. */
	archiveCommentNewAnchor: string | "archivecontrol_editmode_centercomment" | "page-title"
	/** Internal. Used to manage archive comments. */
	archiveCommentNo: number;
	/** Internal. Used to manage archive comments. */
	archiveCommentNbrFromStart: number;
	/** Internal. Used to manage archive comments. */
	archiveCommentLastDisplayedNo: number;
	/** Internal. Used to manage archive comments. */
	archiveCommentLastDisplayedId: number;
	/** Internal. Used to manage archive comments. */
	archiveCommentMobile: { id: number, anchor: string | "archivecontrol_editmode_centercomment" | "page-title", bCenter: boolean, lastX: number, lastY: number };
	/** Internal. Used to manage archive comments. */
	archiveCommentPosition: ["below", "above", "after", "before"];
	/** Internal. Used to manage archive comments. */
	bJumpToNextArchiveOnUnlock: boolean;
	/** Internal. Used to manage archive comments. */
	archiveCommentAlreadyDisplayed: Record<string, boolean>;
	/** Internal. Used to manage tutorial elements. */
	tuto_pointers_types_nbr: 20;
	/** Internal. Used to manage tutorial elements. */
	tuto_textarea_maxlength: 400;
	/** Internal. The chat component for the table. */
	tablechat: ChatInput /* | null */;
	/** Internal. Represents if a video/audio chat is in progress */
	mediaChatRating: boolean;
	/** Internal. Used to pass video/audio chat between links. */
	mediaRatingParams: string;
	/** Internal. @deprecated This is not used within the main code file anymore. */
	quitDlg: null;
	/** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */
	nextPubbanner: null | number;
	/** Internal. If not null, then the interface is locked and this represent the id of the lock. The interface can only be unlocked by this same id. See {@link isInterfaceLocked}, {@link isInterfaceUnlocked}, {@link unlockInterface}, {@link lockInterface}. */
	interface_locked_by_id: number | null;
	/** Internal. @deprecated This is not used within the main code file anymore. I believe this was replaced by ajax calls and the newer way to check preferences. */
	gamepreferences_control: {};
	/** Internal. The last notification containing the spectator list. This is used when re-updating the list. */
	last_visitorlist: NotifTypes['updateSpectatorList'] | null;
	/** Internal. The js template for player tooltips. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_player_tooltip: '<div class="active_player_iconinfos"><div class="emblemwrap_xxl"><img class="emblem" src="${avatarurl}"></img></div><div class="active_player_small_infos_block"><p><div class="bga-flag" data-country="${flag}" id="flag_${player_id}"></div> ${country} ${city}</p><p><div class="fa fa-comment-o languages_spoken" id="ttspeak_${player_id}"></div> <span id="speak_${player_id}">${languages}</span></p><p><div class="fa ${genderclass}" id="gender_${player_id}"></div></p> </div><div id="reputationbar_${player_id}" class="progressbar progressbar_reputation reputation_${karma_class}" style="display:${progressbardisplay}"><div class="progressbar_label"><span class="symbol">☯</span><span class="value">${karma}%</span></div><div class="progressbar_bar"><span class="progressbar_valuename">${karma_label}</span><div class="progressbar_content" style="width:${karma}%"><span class="progressbar_valuename">${karma_label}</span></div></div></div></div>';
	/** Internal. This is not set anywhere in the source code, but looks like it should be a playerlocation component. */
	playerlocation: null;
	/** Internal. A record for looking up replay points. When the user click on a replay button, this is used to find the id to replay from. */
	log_to_move_id: Record<string, number>;
	/** Internal. A record of tutorial dialogs. This is used for managing dialogs by id rather than reference. */
	tutorialItem: Record<string, dijit.Dialog>;
	/** Internal. True if this was previously the current active player. Updated whenever a notification packet is successfully dispatched. */
	current_player_was_active: boolean;
	/** Internal. Represents if this game client is *visually* the active player. This is only updated after {@link updateActivePlayerAnimation}. */
	current_player_is_active: boolean;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorMouveOver: dojo.Handle | null;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickHook: dojo.Handle | null;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickCounter: number;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickCooldown: number;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorClickNumberSinceCooldown: number;
	/** Internal. Used for managing the opponent mouse state when we should show their cursor. */
	showOpponentCursorTimeout: number | null;
	/** Internal. Used purely for {@link registerEbgControl} and {@link destroyAllEbgControls}. */
	ebgControls: { destroy?(): any }[];
	/** Internal. @deprecated This is not used within the main code file anymore. */
	bThisGameSupportFastReplay: boolean;
	/** Internal. Record for the loading status for an image url, where false is not loaded and true is loaded. */
	images_loading_status: Record<string, boolean>;
	/** Internal. Used for presentation when resynchronizing notifications (re-downloading). */
	log_history_loading_status: { downloaded: number, total: number, loaded: number };
	/** Internal. The js template for player ranking. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_player_ranking: '<div class="player_in_list player_in_list_withbaseline player_in_list_fullwidth player_in_list_rank ${add_class}">                    <div class="rank">${rank}</div>                    <div class="emblemwrap ${premium}">                        <img class="pl_avatar emblem" src="${avatar}"/>                        <div class="emblempremium"></div>                        <i class="fa fa-${device} playerstatus status_${status}"></i>                    </div>                    <a href="/player?id=${id}" class="playername">${name}</a>                    <div class="player_baseline"><div class="bga-flag" data-country="${flag}" id="flag_${id}" style="display:${flagdisplay}"></div></div>                    <div class="ranking ${additional_ranking}">${ranking}</div>                </div>';
	/** Internal. The js template for a hotseat player. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_hotseat_interface: '<iframe src="${url}" frameborder="0"  class="hotseat_iframe" id="hotseat_iframe_${player_id}"></iframe>';
	/** Internal. Automatic zoom factor applied to displays. This is usually used to scale down elements on smaller displays, like mobile. 1 == 100% normal scale. */
	gameinterface_zoomFactor: number;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dxaxis: number;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dzaxis: number;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dxpos: number;
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dypos: number
	/** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
	control3dscale: number;
	/** Internal. If 3d controls are enabled. See {@link init3d}. */
	control3dmode3d: boolean;
	/** Internal. The cometd_service to be used with the gamenotif. See {@link GameNotif.cometd_service} for more information. */
	cometd_service: any | null;
	/** Internal. The socket used for this game. This looks like a Socket.IO type, but not work npm this type that will never be used in a game. */
	socket: { on(event: string, callback: Function): void };
	/** Internal. This looks like a Socket.IO type, but not work npm this type that will never be used in a game. */
	gs_socket: { on(event: string, callback: Function): void };
	/** Internal. */
	gs_socketio_url: string;
	/** Internal. */
	gs_socketio_path: string;
	/** Internal. */
	debug_from_chat?: boolean;
	/** Internal. */
	chat_on_gs_side?: boolean;
	/** Internal. WIP. */
	decision: { decision_type: 'none' | 'abandon' | string, decision_taken?: boolean | 'true'; decision_refused?: boolean | 'true'; players?: number[]; };
	/** Internal. The current server number this game is being played on. */
	gameserver: number;
	/** Internal. The bundle version for js. */
	jsbundlesversion: string;
	/** Internal. @deprecated This is not used anywhere in the game code. */
	bActiveEvents: boolean;
	/** Internal. Helper for where to send the user when on quick game ends. */
	quickGameEnd: boolean;
	/** Internal. Helper for where to send the user when on quick game ends. */
	quickGameEndUrl?: string;
	/** Internal. WIP */
	bTimerCommon: boolean;
	/** Internal. WIP */
	turnBasedNotes: boolean;
	/** Internal. WIP */
	gameeval: boolean;
	/** Internal. WIP */
	gameisalpha: boolean;
	/** Internal. WIP */
	gamecanapprove: boolean;
	/** Internal. WIP */
	number_of_tb_table_its_your_turn: number;
	/** Internal. WIP */
	bUseWebStockets: boolean;
	/** Internal. WIP */
	metasite_tutorial: number[];
	/** Internal. WIP */
	tournament_id: null | number;
	/** Internal. WIP */
	lockts: number;
	/** Internal. WIP */
	mslobby: 'lobby';
	/** Internal. WIP */
	game_status: 'public' | 'beta_restricted' | 'beta' | 'private';
	/** Internal. WIP */
	game_group: number;
	/** Internal. WIP */
	emergencymsg: [];
	/** Internal. WIP */
	hotseat: [];
	/** Internal. WIP */
	hotseat_interface: 'normal' | 'hotseataccount' | 'single_screen'
	/** Internal. WIP */
	hotseatplayers: number[];


	/** Internal. WIP */
	completesetup(...args: any[]): any;
	/** Internal. WIP */
	onReconnect(...args: any[]): any;
	/** Internal. WIP */
	onGsSocketIoConnectionStatusChanged(...args: any[]): any;
	/** Internal. WIP */
	updatePremiumEmblemLinks(...args: any[]): any;
	/** Internal. WIP */
	onGameUiWidthChange(...args: any[]): any;
	/** Internal. WIP */
	onZoomToggle(...args: any[]): any;
	/** Internal. WIP */
	adaptStatusBar(...args: any[]): any;
	/** Internal. WIP */
	adaptPlayersPanels(...args: any[]): any;
	/** Internal. WIP */
	activeShowOpponentCursor(...args: any[]): any;
	/** Internal. WIP */
	showOpponentCursorClick(...args: any[]): any;
	/** Internal. WIP */
	unactiveShowOpponentCursor(...args: any[]): any;
	/** Internal. WIP */
	onShowMyCursor(...args: any[]): any;
	/** Internal. WIP */
	onHideCursor(...args: any[]): any;
	/** Internal. WIP */
	getCursorInfos(...args: any[]): any;
	/** Internal. WIP */
	showOpponentCursorSendInfos(...args: any[]): any;
	/** Internal. WIP */
	onShowOpponentCursorMouseOver(...args: any[]): any;
	/** Internal. WIP */
	getGameStandardUrl(...args: any[]): any;
	/** Internal. WIP */
	showIngameMenu(...args: any[]): any;
	/** Internal. WIP */
	hideIngameMenu(...args: any[]): any;
	/** Internal. WIP */
	toggleIngameMenu(...args: any[]): any;
	/** Internal. WIP */
	getPlayerTooltip(...args: any[]): any;
	/** Internal. WIP */
	onStartGame(...args: any[]): any;
	/** Internal. WIP */
	onNotificationPacketDispatched(...args: any[]): any;
	/** Internal. WIP */
	updateActivePlayerAnimation(...args: any[]): any;
	/** Internal. WIP */
	isPlayerActive(...args: any[]): any;
	/** Internal. WIP */
	updateVisitors(...args: any[]): any;
	/** Internal. WIP */
	onBanSpectator(...args: any[]): any;
	/** Internal. WIP */
	switchToGameResults(...args: any[]): any;
	/** Internal. WIP */
	eloEndOfGameAnimation(...args: any[]): any;
	/** Internal. WIP */
	eloEndOfGameAnimationWorker(...args: any[]): any;
	/** Internal. WIP */
	updateResultPage(...args: any[]): any;
	/** Internal. WIP */
	loadTrophyToSplash(...args: any[]): any;
	/** Internal. WIP */
	displayScores(...args: any[]): any;
	/** Internal. WIP */
	buildScoreDlgHtmlContent(...args: any[]): any;
	/** Internal. WIP */
	onFBReady(...args: any[]): any;
	/** Internal. WIP */
	onShowGameResults(...args: any[]): any;
	/** Internal. WIP */
	onGameEnd(...args: any[]): any;
	/** Internal. WIP */
	prepareMediaRatingParams(...args: any[]): any;
	/** Internal. WIP */
	getMediaRatingParams(...args: any[]): any;
	/** Internal. WIP */
	redirectToTablePage(...args: any[]): any;
	/** Internal. WIP */
	redirectToTournamentPage(...args: any[]): any;
	/** Internal. WIP */
	redirectToLobby(...args: any[]): any;
	/** Internal. WIP */
	redirectToMainsite(...args: any[]): any;
	/** Internal. WIP */
	redirectToGamePage(...args: any[]): any;
	/** Internal. WIP */
	doRedirectToMetasite(...args: any[]): any;
	/** Internal. WIP */
	onBackToMetasite(...args: any[]): any;
	/** Internal. WIP */
	onCreateNewTable(...args: any[]): any;
	/** Internal. WIP */
	onProposeRematch(...args: any[]): any;
	/** Internal. WIP */
	onBuyThisGame(...args: any[]): any;
	/** Internal. WIP */
	onGlobalActionPause(...args: any[]): any;
	/** Internal. WIP */
	onGlobalActionFullscreen(...args: any[]): any;
	/** Internal. WIP */
	switchLogModeTo(...args: any[]): any;
	/** Internal. WIP */
	onGlobalActionPreferences(...args: any[]): any;
	/** Internal. WIP */
	onGlobalActionHelp(...args: any[]): any;
	/** Internal. WIP */
	onGlobalActionBack(...args: any[]): any;
	/** Internal. WIP */
	onGlobalActionQuit(...args: any[]): any;
	/** Internal. WIP */
	onNewLog(...args: any[]): any;
	/** Internal. WIP */
	addMoveToLog(...args: any[]): any;
	/** Internal. WIP */
	onChangeContentHeight(...args: any[]): any;
	/** Internal. WIP */
	onReplayFromPoint(...args: any[]): any;
	/** Internal. WIP */
	updateDecisionPanel(...args: any[]): any;
	/** Internal. WIP */
	onPlayerDecide(...args: any[]): any;
	/** Internal. WIP */
	updateReflexionTimeDisplay(...args: any[]): any;
	/** Internal. WIP */
	updateReflexionTime(...args: any[]): any;
	/** Internal. WIP */
	shouldDisplayClockAlert(...args: any[]): any;
	/** Internal. WIP */
	updateFirePlayerLink(...args: any[]): any;
	/** Internal. WIP */
	onWouldLikeToThink(...args: any[]): any;
	/** Internal. WIP */
	sendWakeupInTenSeconds(...args: any[]): any;
	/** Internal. WIP */
	sendWakeUpSignal(...args: any[]): any;
	/** Internal. WIP */
	cancelPlannedWakeUp(...args: any[]): any;
	/** Internal. WIP */
	checkWakupUpInFourteenSeconds(...args: any[]): any;
	/** Internal. WIP */
	checkWakups(...args: any[]): any;
	/** Internal. WIP */
	cancelPlannedWakeUpCheck(...args: any[]): any;
	/** Internal. WIP */
	isInterfaceLocked(...args: any[]): any;
	/** Internal. WIP */
	isInterfaceUnlocked(...args: any[]): any;
	/** Internal. WIP */
	lockInterface(...args: any[]): any;
	/** Internal. WIP */
	unlockInterface(...args: any[]): any;
	/** Internal. WIP */
	onLockInterface(...args: any[]): any;
	/** Internal. WIP */
	onAiNotPlaying(...args: any[]): any;
	/** Internal. WIP */
	onNotPlayingHelp(...args: any[]): any;
	/** Internal. WIP */
	onSkipPlayersOutOfTime(...args: any[]): any;
	/** Internal. WIP */
	onWouldFirePlayer(...args: any[]): any;
	/** Internal. WIP */
	onDecreaseExpelTime(...args: any[]): any;
	/** Internal. WIP */
	onMove(...args: any[]): any;
	/** Internal. WIP */
	onNextMove(...args: any[]): any;
	/** Internal. WIP */
	initArchiveIndex(...args: any[]): any;
	/** Internal. WIP */
	sendNextArchive(...args: any[]): any;
	/** Internal. WIP */
	onArchiveNext(...args: any[]): any;
	/** Internal. WIP */
	onArchiveNextLog(...args: any[]): any;
	/** Internal. WIP */
	doArchiveNextLog(...args: any[]): any;
	/** Internal. WIP */
	onArchiveNextTurn(...args: any[]): any;
	/** Internal. WIP */
	onArchiveHistory(...args: any[]): any;
	/** Internal. WIP */
	setModeInstataneous(...args: any[]): any;
	/** Internal. WIP */
	unsetModeInstantaneous(...args: any[]): any;
	/** Internal. WIP */
	onLastArchivePlayed(...args: any[]): any;
	/** Internal. WIP */
	onArchiveToEnd(...args: any[]): any;
	/** Internal. WIP */
	onArchiveToEndSlow(...args: any[]): any;
	/** Internal. WIP */
	onArchiveGoTo(...args: any[]): any;
	/** Internal. WIP */
	onEndDisplayLastArchive(...args: any[]): any;
	/** Internal. WIP */
	onArchiveGoToMoveDisplay(...args: any[]): any;
	/** Internal. WIP */
	archiveGoToMove(...args: any[]): any;
	/** Internal. WIP */
	showArchiveComment(...args: any[]): any;
	/** Internal. WIP */
	getCommentsViewedFromStart(...args: any[]): any;
	/** Internal. WIP */
	onArchiveCommentMinimize(...args: any[]): any;
	/** Internal. WIP */
	onArchiveCommentMaximize(...args: any[]): any;
	/** Internal. WIP */
	applyArchiveCommentMarkup(...args: any[]): any;
	/** Internal. WIP */
	onArchiveCommentPointElementOnMouseEnter(...args: any[]): any;
	/** Internal. WIP */
	removeArchiveCommentPointElement(...args: any[]): any;
	/** Internal. WIP */
	archiveCommentAttachImageToElement(...args: any[]): any;
	/** Internal. WIP */
	onArchiveCommentPointElementClick(...args: any[]): any;
	/** Internal. WIP */
	onArchiveCommentContinueModeChange(...args: any[]): any;
	/** Internal. WIP */
	onArchiveCommentDisplayModeChange(...args: any[]): any;
	/** Internal. WIP */
	onTutoRatingEnter(...args: any[]): any;
	/** Internal. WIP */
	onTutoRatingLeave(...args: any[]): any;
	/** Internal. WIP */
	onTutoRatingClick(...args: any[]): any;
	/** Internal. WIP */
	onRepositionPopop(...args: any[]): any;
	/** Internal. WIP */
	clearArchiveCommentTooltip(...args: any[]): any;
	/** Internal. WIP */
	removeArchiveCommentAssociatedElements(...args: any[]): any;
	/** Internal. WIP */
	onArchiveAddComment(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentCancel(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentSave(...args: any[]): any;
	/** Internal. WIP */
	newArchiveCommentSave(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentSaveModify(...args: any[]): any;
	/** Internal. WIP */
	newArchiveCommentSaveModify(...args: any[]): any;
	/** Internal. WIP */
	getArchiveCommentsPointers(...args: any[]): any;
	/** Internal. WIP */
	onKeyPressTutorial(...args: any[]): any;
	/** Internal. WIP */
	onKeyUpTutorial(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentNext(...args: any[]): any;
	/** Internal. WIP */
	doNewArchiveCommentNext(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentDelete(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentModify(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentStartDrag(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentEndDrag(...args: any[]): any;
	/** Internal. WIP */
	onNewArchiveCommentDrag(...args: any[]): any;
	/** Internal. WIP */
	initCommentsForMove(...args: any[]): any;
	/** Internal. WIP */
	onEndOfNotificationDispatch(...args: any[]): any;
	/** Internal. WIP */
	checkIfArchiveCommentMustBeDisplayed(...args: any[]): any;
	/** Internal. WIP */
	onHowToTutorial(...args: any[]): any;
	/** Internal. WIP */
	onTutoPointerClick(...args: any[]): any;
	/** Internal. WIP */
	onPublishTutorial(...args: any[]): any;
	/** Internal. WIP */
	onQuitTutorial(...args: any[]): any;
	/** Internal. WIP */
	loadReplayLogs(...args: any[]): any;
	/** Internal. WIP */
	replaceArchiveCursor(...args: any[]): any;
	/** Internal. WIP */
	onEditReplayLogsComment(...args: any[]): any;
	/** Internal. WIP */
	onRemoveReplayLogsComment(...args: any[]): any;
	/** Internal. WIP */
	onEditReplayLogsCommentSave(...args: any[]): any;
	/** Internal. WIP */
	onReplayLogClick(...args: any[]): any;
	/** Internal. WIP */
	ensureImageLoading(...args: any[]): any;
	/** Internal. WIP */
	ensureSpecificImageLoading(...args: any[]): any;
	/** Internal. WIP */
	onLoadImageOk(...args: any[]): any;
	/** Internal. WIP */
	onLoadImageNok(...args: any[]): any;
	/** Internal. WIP */
	updateLoaderPercentage(...args: any[]): any;
	/** Internal. WIP */
	displayTableWindow(...args: any[]): any;
	/** Internal. WIP */
	updatePubBanner(...args: any[]): any;
	/** Internal. WIP */
	onSaveState(...args: any[]): any;
	/** Internal. WIP */
	onLoadState(...args: any[]): any;
	/** Internal. WIP */
	getScriptErrorModuleInfos(...args: any[]): any;
	/** Internal. WIP */
	showTutorial(...args: any[]): any;
	/** Internal. WIP */
	onCloseTutorial(...args: any[]): any;
	/** Internal. WIP */
	onBeforeChatInput(...args: any[]): any;
	/** Internal. WIP */
	showEliminated(...args: any[]): any;
	/** Internal. WIP */
	setLoader(...args: any[]): any;
	/** Internal. WIP */
	displayZombieBack(...args: any[]): any;
	/** Internal. WIP */
	onZombieBack(...args: any[]): any;
	/** Internal. WIP */
	showNeutralizedGamePanel(...args: any[]): any;
	/** Internal. WIP */
	setupCoreNotifications(...args: any[]): any;
	/** Internal. WIP */
	ntf_gameStateChange(...args: any[]): any;
	/** Internal. WIP */
	ntf_gameStateChangePrivateArgs(...args: any[]): any;
	/** Internal. WIP */
	ntf_gameStateMultipleActiveUpdate(...args: any[]): any;
	/** Internal. WIP */
	ntf_newActivePlayer(...args: any[]): any;
	/** Internal. WIP */
	ntf_playerStatusChanged(...args: any[]): any;
	/** Internal. WIP */
	ntf_yourTurnAck(...args: any[]): any;
	/** Internal. WIP */
	ntf_clockalert(...args: any[]): any;
	/** Internal. WIP */
	ntf_tableInfosChanged(...args: any[]): any;
	/** Internal. WIP */
	ntf_playerEliminated(...args: any[]): any;
	/** Internal. WIP */
	ntf_tableDecision(...args: any[]): any;
	/** Internal. WIP */
	ntf_infomsg(...args: any[]): any;
	/** Internal. WIP */
	ntf_archivewaitingdelay(...args: any[]): any;
	/** Internal. WIP */
	ntf_end_archivewaitingdelay(...args: any[]): any;
	/** Internal. WIP */
	ntf_replaywaitingdelay(...args: any[]): any;
	/** Internal. WIP */
	ntf_end_replaywaitingdelay(...args: any[]): any;
	/** Internal. WIP */
	ntf_replayinitialwaitingdelay(...args: any[]): any;
	/** Internal. WIP */
	ntf_end_replayinitialwaitingdelay(...args: any[]): any;
	/** Internal. WIP */
	ntf_replay_has_ended(...args: any[]): any;
	/** Internal. WIP */
	onEndOfReplay(...args: any[]): any;
	/** Internal. WIP */
	ntf_updateSpectatorList(...args: any[]): any;
	/** Internal. WIP */
	ntf_tableWindow(...args: any[]): any;
	/** Internal. WIP */
	ntf_wouldlikethink(...args: any[]): any;
	/** Internal. WIP */
	ntf_updateReflexionTime(...args: any[]): any;
	/** Internal. WIP */
	ntf_undoRestorePoint(...args: any[]): any;
	/** Internal. WIP */
	ntf_resetInterfaceWithAllDatas(...args: any[]): any;
	/** Internal. WIP */
	ntf_zombieModeFailWarning(...args: any[]): any;
	/** Internal. WIP */
	ntf_zombieModeFail(...args: any[]): any;
	/** Internal. WIP */
	ntf_aiError(...args: any[]): any;
	/** Internal. WIP */
	ntf_skipTurnOfPlayer(...args: any[]): any;
	/** Internal. WIP */
	ntf_zombieBack(...args: any[]): any;
	/** Internal. WIP */
	ntf_gameResultNeutralized(...args: any[]): any;
	/** Internal. WIP */
	ntf_allPlayersAreZombie(...args: any[]): any;
	/** Internal. WIP */
	ntf_simplePause(...args: any[]): any;
	/** Internal. WIP */
	ntf_showTutorial(...args: any[]): any;
	/** Internal. WIP */
	showTutorialActivationDlg(...args: any[]): any;
	/** Internal. WIP */
	showTutorialItem(...args: any[]): any;
	/** Internal. WIP */
	onTutorialClose(...args: any[]): any;
	/** Internal. WIP */
	onTutorialDlgClose(...args: any[]): any;
	/** Internal. WIP */
	markTutorialAsSeen(...args: any[]): any;
	/** Internal. WIP */
	toggleTurnBasedNotes(...args: any[]): any;
	/** Internal. WIP */
	closeTurnBasedNotes(...args: any[]): any;
	/** Internal. WIP */
	openTurnBasedNotes(...args: any[]): any;
	/** Internal. WIP */
	onSaveNotes(...args: any[]): any;
	/** Internal. WIP */
	onClearNotes(...args: any[]): any;
	/** Internal. WIP */
	onSeeMoreLink(...args: any[]): any;
	/** Internal. WIP */
	onThumbUpLink(...args: any[]): any;
	/** Internal. WIP */
	onChangePreference(...args: any[]): any;
	/** Internal. WIP */
	getRanking(...args: any[]): any;
	/** Internal. WIP */
	insert_rankings(...args: any[]): any;
	/** Internal. WIP */
	onSeeMoreRanking(...args: any[]): any;
	/** Internal. WIP */
	onChangeRankMode(...args: any[]): any;
	/** Internal. WIP */
	ntf_aiPlayerWaitingDelay(...args: any[]): any;
	/** Internal. WIP */
	ntf_playerConcedeGame(...args: any[]): any;
	/** Internal. WIP */
	ntf_skipTurnOfPlayerWarning(...args: any[]): any;
	/** Internal. WIP */
	ntf_showCursorClick(...args: any[]): any;
	/** Internal. WIP */
	ntf_showCursor(...args: any[]): any;
	/** Internal. WIP */
	onChatKeyDown(...args: any[]): any;
	/** Internal. WIP */
	onChatInputBlur(...args: any[]): any;
	/** Internal. WIP */
	onJudgeDecision(...args: any[]): any;
	/** Internal. WIP */
	registerEbgControl(...args: any[]): any;
	/** Internal. WIP */
	destroyAllEbgControls(...args: any[]): any;
	/** Internal. WIP */
	playMusic(...args: any[]): any;
	/** Internal. WIP */
	onShowGameHelp(...args: any[]): any;
	/** Internal. WIP */
	onShowStrategyHelp(...args: any[]): any;
	/** Internal. WIP */
	lockScreenCounter(...args: any[]): any;
	/** Internal. WIP */
	initHotseat(...args: any[]): any;
	/** Internal. WIP */
	onHotseatPlayButton(...args: any[]): any;
	/** Internal. WIP */
	checkHotseatFocus(...args: any[]): any;
	/** Internal. WIP */
	giveHotseatFocusTo(...args: any[]): any;
	/** Internal. WIP */
	init3d(...args: any[]): any;
	/** Internal. WIP */
	change3d(...args: any[]): any;
	/** Internal. WIP */
	enter3dButton(...args: any[]): any;
	/** Internal. WIP */
	leave3dButton(...args: any[]): any;
	/** Internal. WIP */
	ntf_banFromTable(...args: any[]): any;
	/** Internal. WIP */
	ntf_resultsAvailable(...args: any[]): any;
	/** Internal. WIP */
	ntf_switchToTurnbased(...args: any[]): any;
	/** Internal. WIP */
	ntf_newPrivateState(...args: any[]): any;
	/** Internal. WIP */
	saveclient(...args: any[]): any;
	/** Internal. WIP */
	restoreClient(...args: any[]): any;
	/** Internal. WIP */
	decodeHtmlEntities(...args: any[]): any;
	/** Internal. WIP */
	applyTranslationsOnLoad(...args: any[]): any;
	/** Internal. WIP */
	showGameRatingDialog(...args: any[]): any;

	//#endregion

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<Gamegui>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<Gamegui>['createSubclass'];
}

declare global {
	/** The global game object that is currently running. */
	const gameui: Gamegui;

	/**
	 * A record of all game specific classes. Usually, this will only only be defined when on a game page, and the record will only contain one entry for the current game.
	 * 
	 * This value should be updated by game specific code by using one of the following expressions:
	 * ```js
	 * // Using Dojo (default when using dojo.declare)
	 * dojo.setObject( "bgagame.___yourgamename___", ___YourGameName___ );
	 * // Manually (less abstracted, but possibly less clear)
	 * (window.bgagame ??= {}).___yourgamename___ = ___YourGameName___;
	 * ```
	 */
	var bgagame: Record<string, typeof Gamegui> | undefined;

	interface EBG_CORE { gamegui: typeof Gamegui; }
	interface EBG { core: EBG_CORE; }
}

export = Gamegui;