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
 * All clients automatically load the Dojo framework, so all games can use the functions to do more coimplex things more easily. The BGA framework uses Dojo extensively. See {@link http://dojotoolkit.org/ | Dojo Javascript framework} for more information.
 * In addition, the BGA framework defines a jQuery-like function $ that you can use to access the DOM. This function is available in all BGA pages and is the standard way to access the DOM in BGA. You can use getElementById but a longer to type and less handy as it does not do some checks.
 * 
 * For performance reasons, when deploying a game the javascript code is minimized using {@link https://github.com/terser/terser | terser}. This minifier works with modern javascript syntax. From your project "Manage game" page, you can now test a minified version of your javascript on the studio (and revert to the original).
 * 
 * @constructor
 * Initialize and define global variables. No base class fields are initialized yet! Use `setup` for any initialization that needs base fields.
 * Any global variables should be added to the class as fields, like normal for typescript.
 * @example
 * constructor(){
 * 	super();
 * 	console.log('yourgamename constructor');
 * 
 * 	this.myGlobalValue = 0;
 * }
 */
interface Gamegui {

	/** The name of the game currently being played. */
	game_name: string;

	/** The component used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
	notifqueue: GameNotif;

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
	 * This method associates notifications with notification handlers. For each game notification, you can trigger a javascript method to handle it and update the game interface. This method should be manually invoked during the `setup` function. This method technically should not be included on the base class as it should never be called outside of the game class.
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
	 * The id of the player using the current client. The player may not be playing the game, but instead a spectator!
	 * @example if (notif.args.player_id == this.player_id) { ... }
	 */
	player_id: number;

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

	/**
	 * The data from the server that is used to initialize the game client. This is the same as `gamedatas` in the `setup` method and is untouched after the `setup` method is called.
	 * @example
	 * for (var player_id in this.gamedatas.players) { 
	 * 	var playerInfo = this.gamedatas.players [player_id];
	 * 	var c = playerInfo.color;
	 * 	var name = playerInfo.name;
	 * 	// do something 
	 * }
	 */
	gamedatas: Gamedatas;

	/**
	 * Returns true if the player on whose browser the code is running is currently active (it's his turn to play). Note: see remarks above about usage of this function inside onEnteringState method.
	 * @returns true if the player on whose browser the code is running is currently active (it's his turn to play).
	 * @example if (this.isCurrentPlayerActive()) { ... }
	 */
	isCurrentPlayerActive: () => boolean;

	/**
	 * Returns the id of the active player. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
	 * @returns The id of the active player.
	 */
	getActivePlayerId: () => number;

	/**
	 * Returns the ids of the active players. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
	 * @returns The ids of the active players.
	 */
	getActivePlayers: () => number[];

	//#endregion

	//#region DOM Manipulation

	/**
	 * Formats the global string variable named `var_template` with the values from `args` using ${key} syntax. This is a simple templating system that is generally used to format HTML blocks. The `var_template` is a string that contains ${key} placeholders, and `args` is an object that contains the values to replace the placeholders with. The method returns the formatted string. Note: result is trimmed.
	 * This should be used when templates are defined in the .tpl file, i.e. they are hydrated by the server in some way.
	 * @param var_template The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 * @example
	 * var player = gamedatas.players[this.player_id];
	 * var div = this.format_block('jstpl_player_board', player ); // var jstpl_player_board = ... is defined in .tpl file 
	 */
	format_block: (var_template: string, args: { [key: string]: object }) => string;

	/**
	 * Formats the string with the values from `args` using ${key} syntax. This is a simple templating system that is generally used to format HTML blocks. The `format` is a string that contains ${key} placeholders, and `args` is an object that contains the values to replace the placeholders with. The method returns the formatted string. Note: result is trimmed.
	 * This should be used when templates are defined in the .tpl file, i.e. they are hydrated by the server in some way.
	 * @param format The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 * @example var div = this.format_string('<div color="${player_color}"></div>', {player_color: '#ff0000'} );
	 */
	format_string: (format: string, args: { [key: string]: object }) => string;

	/**
	 * Same as `format_string` but recursively formats until no more placeholders are found. This is useful for nested templates, like with server notifications.
	 * @param format The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 */
	format_string_recursive: (format: string, args: { [key: string]: object }) => string;

	/**
	 * Moves an element such that the visual position of the `target` element is located at the top-left of the `location` element. This is not really an animation, but placeOnObject is frequently used to set up the initial position of an element before an animation is performed.
	 * @param target The element to move.
	 * @param location The element to move the target to.
	 * @example this.placeOnObject('my_element', 'my_location');
	 */
	placeOnObject: (target: string | HTMLElement, location: string | HTMLElement) => void;

	/**
	 * Moves an element such that the visual position of the `target` element is located at the top-left of the `location` element, with an offset. This is not really an animation, but placeOnObject is frequently used to set up the initial position of an element before an animation is performed.
	 * @param target The element to move.
	 * @param location The element to move the target to.
	 * @param relativeX The x offset from the top-left of the location element.
	 * @param relativeY The y offset from the top-left of the location element.
	 * @example this.placeOnObjectPos('my_element', 'my_location', 10, 10);
	 */
	placeOnObjectPos: (target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number) => void;

	/**
	 * This destroys the `target` element and all its connectors (onClick, etc), then places a clone positioned at the original location but attached to the `newParent` element. This is useful for moving elements between different containers. See {@link GameguiCookbook.attachToNewParentNoDestroy} for a version that does not destroy the target element.
	 * Changing the HTML parent of an element can be useful for the following reasons:
	 * - When the HTML parent moves, all its child are moving with them. If some game elements is no more linked with a parent HTML object, you may want to attach it to another place.
	 * - The z_order (vertical order of display) depends on the position in the DOM, so you may need to change the parent of some game elements when they are moving in your game area.
	 * @param target The element to move.
	 * @param newParent The new parent element to attach the target to. Note that the position of the target will remain visually the same.
	 */
	attachToNewParent: (target: string | HTMLElement, newParent: string | HTMLElement) => void;

	/**
	 * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
	 * @param target The element to move. This object must be "relative" or "absolute" positioned.
	 * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
	 * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
	 * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @example this.slideToObject( "some_token", "some_place_on_board" ).play();
	 */
	slideToObject: (target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number) => Animation;

	/**
	 * Slides a new element from a source location to a destination location. The temporary object created from an html string. This is useful when you want to slide a temporary HTML object from one place to another. As this object does not exists before the animation and won't remain after, it could be complex to create this object (with dojo.place), to place it at its origin (with placeOnObject) to slide it (with slideToObject) and to make it disappear at the end.
	 * @param temporaryHTML A piece of HTML code that represents the object to slide.
	 * @param parent The ID of an HTML element of your interface that will be the parent of this temporary HTML object.
	 * @param sourceLocation The element representing the origin of the slide.
	 * @param destinationLocation The element representing the target of the slide.
	 * @param duration (optional) The duration in milliseconds of the slide. The default is 500 milliseconds.
	 * @param delay (optional) If you define a delay, the slide will start only after this delay. This is particularly useful when you want to slide several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @example this.slideTemporaryObject('<div class="token_icon"></div>', 'tokens', 'my_origin_div', 'my_target_div').play();
	 */
	slideTemporaryObject: (temporaryHTML: string, parent: string | HTMLElement, sourceLocation: string | HTMLElement, destinationLocation: string | HTMLElement, duration?: number, delay?: number) => Animation;

	/**
	 * Slides an existing html element to some destination and destroys it upon arrival. This is a handy shortcut to slide an existing HTML object to some place then destroy it upon arrival. It can be used for example to move a victory token or a card from the board to the player panel to show that the player earns it, then destroy it when we don't need to keep it visible on the player panel.
	 * This works the same as `slideToObject` and takes the same arguments, however, it plays the animation immediately and destroys the object upon arrival.
	 * CAREFUL: Make sure nothing is creating the same object at the same time the animation is running, because this will cause some random disappearing effects.
	 * @param target The element to move.
	 * @param destination The element to move the target to.
	 * @param duration (optional) The duration in milliseconds of the slide. The default is 500 milliseconds.
	 * @param delay (optional) If you define a delay, the slide will start only after this delay. This is particularly useful when you want to slide several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @example this.slideToObjectAndDestroy( "some_token", "some_place_on_board", 1000, 0 );
	 */
	slideToObjectAndDestroy: (target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number) => void;

	/**
	 * Fades out the target node, then destroys it. This call starts the animation.
	 * CAREFUL: the HTML node still exists until during few milliseconds, until the fadeOut has been completed. Make sure nothing is creating same object at the same time as animation is running, because you will be some random disappearing effects.
	 * @param target The element to fade out and destroy.
	 * @param duration (optional) The duration in milliseconds of the fade out. The default is 500 milliseconds.
	 * @param delay (optional) If you define a delay, the fade out will start only after this delay. This is particularly useful when you want to fade out several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the fade out.
	 * @example this.fadeOutAndDestroy( "a_card_that_must_disappear" );
	 */
	fadeOutAndDestroy: (target: string | HTMLElement, duration?: number, delay?: number) => void;

	/**
	 * Rotates an element to a target degree using an animation. It starts the animation, and stored the rotation degree in the class, so next time you rotate object - it is additive. There is no animation hooks in this one.
	 * @param target The element to rotate.
	 * @param degree The degree to rotate the element to.
	 * @example this.rotateTo( "a_card_that_must_rotate", 90 );
	 * 
	 * // Same as follows:
	 * var animation = new dojo.Animation({
	 * 	curve: [fromDegree, toDegree],
	 * 	onAnimate: (v) => {
	 * 		target.style.transform = 'rotate(' + v + 'deg)';
	 * 	} 
	 * });
		
	 * animation.play();
	 */
	rotateTo: (target: string | HTMLElement, degree: number) => void;

	/**
	 * Rotates an element to a target degree without using an animation.
	 * @param target The element to rotate.
	 * @param degree The degree to rotate the element to.
	 * @example this.rotateInstantTo( "a_card_that_must_rotate", 90 );
	 */
	rotateInstantTo: (target: string | HTMLElement, degree: number) => void;

	/**
	 * A wrapper for dojo.connect which maintains a list of all connections for easier cleanup and disconnecting. This is the recommended way to connect events in BGA when connecting permanent objects - if you just want to connect the temp object you should probably not use this method but use dojo.connect which won't require any clean-up. If you plan to destroy the element you connected, you must call this.disconnect() to prevent memory leaks.
	 * 
	 * Note: dynamic connect/disconnect is for advanced cases ONLY, you should always connect elements statically if possible, i.e. in setup() method.
	 * @param target The element to connect the event to.
	 * @param event The event to connect to.
	 * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
	 * @example this.connect( $('my_element'), 'onclick', 'onClickOnMyElement' );
	 * @example this.connect( $('my_element'), 'onclick', (e) => { console.log('boo'); } );
	 */
	connect: (target: string | HTMLElement, event: string, method: string | Function) => void;

	/**
	 * Same as `connect` but for all the nodes set with the specified css className.
	 * @param className The class name of the elements to connect the event to.
	 * @param event The event to connect to.
	 * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
	 * @example this.connectClass('pet', 'onclick', 'onPet');
	 */
	connectClass: (className: string, event: string, method: string | Function) => void;

	/**
	 * Disconnects an event handler previously registered with `connect` or `connectClass`.
	 * @param target The element to disconnect the event from.
	 * @param event The event to disconnect.
	 * @example this.disconnect( $('my_element'), 'onclick');
	 */
	disconnect: (target: string | HTMLElement, event: string) => void;

	/**
	 * Disconnects all previously registed event handlers (registered via `connect` or `connectClass`).
	 * @example this.disconnectAll();
	 */
	disconnectAll: () => void;

	//#endregion

	//#region Player Actions

	/**
	 * Sends a client side notification to the server in the form of a player action. This should be used only in reaction to a user action in the interface to prevent race conditions or breaking replay game and tutorial features.
	 * @param actionURL The relative URL of the action to perform. Usually, it must be: "/<mygame>/<mygame>/myAction.html"
	 * @param args An array of parameter to send to the game server. Note that "lock: true" must always be specified in this list of parameters in order the interface can be locked during the server call. Cannot use lock: false - to not lock it has to be undefined.
	 * @param source (non-optional) The object that triggered the action. This is usually `this`.
	 * @param onSuccess (non-optional but rarely used) A function to trigger when the server returns result and everything went fine (not used, as all data handling is done via notifications).
	 * @param callback (optional) A function to trigger when the server returns ok OR error. If no error this function is called with parameter value false. If an error occurred, the first parameter will be set to true, the second will contain the error message sent by the PHP back-end, and the third will contain an error code.
	 * @param ajax_method (optional and rarely used) If you need to send large amounts of data (over 2048 bytes), you can set this parameter to 'post' (all lower-case) to send a POST request as opposed to the default GET. This works, but was not officially documented, so only use if you really need to.
	 * @example
	 * this.ajaxcall( '/mygame/mygame/myaction.html', { lock: true,
	 * 	arg1: myarg1,
	 * 	arg2: myarg2
	 * }, this, (result) => {} );
	 */
	ajaxcall: <T extends keyof PlayerActions>(actionURL: string, args: PlayerActions[T] & { lock: boolean }, source: Gamegui, onSuccess?: Function, callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any, ajax_method?: 'post' | 'get') => void;

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
	checkAction: (action: keyof PlayerActions, nomessage?: boolean) => boolean;

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
	checkPossibleActions: (action: keyof PlayerActions) => boolean;

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
	checkLock: (nomessage?: boolean) => boolean;

	//#endregion

	//#region Builtin DOM Controls

	/**
	 * Adds a tooltip to the DOM element. This is a simple text tooltip to display some information about "what is this game element?" and "what happens when I click on this element?". You must specify both of the strings. You can only use one and specify an empty string for the other one. When you pass text directly function _() must be used for the text to be marked for translation! Except for empty string. Parameter "delay" is optional. It is primarily used to specify a zero delay for some game element when the tooltip gives really important information for the game - but remember: no essential information must be placed in tooltips as they won't be displayed in some browsers (see Guidelines).
	 * @param target The DOM element to add the tooltip to.
	 * @param helpStringTranslated The information about "what is this game element?".
	 * @param actionStringTranslated The information about "what happens when I click on this element?".
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltip( 'cardcount', _('Number of cards in hand'), '' );
	 */
	addTooltip: (target: string | HTMLElement, helpStringTranslated: string, actionStringTranslated: string, delay?: number) => void;

	/**
	 * Adds an HTML tooltip to the DOM element. This is for more elaborate content such as presenting a bigger version of a card.
	 * @param target The DOM element to add the tooltip to.
	 * @param html The HTML content of the tooltip.
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltipHtml( 'cardcount', '<div>Number of cards in hand</div>' );
	 */
	addTooltipHtml: (target: string | HTMLElement, html: string, delay?: number) => void;

	/**
	 * Adds a simple text tooltip to all the DOM elements set with the specified css class. This is for more elaborate content such as presenting a bigger version of a card.
	 * @param className The class name of the elements to add the tooltip to.
	 * @param helpStringTranslated The information about "what is this game element?".
	 * @param actionStringTranslated The information about "what happens when I click on this element?".
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltipToClass( 'meeple', _('This is A Meeple'), _('Click to tickle') );
	 */
	addTooltipToClass: (className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number) => void;

	/**
	 * Adds an HTML tooltip to all the DOM elements set with the specified css class. This is for more elaborate content such as presenting a bigger version of a card.
	 * @param className The class name of the elements to add the tooltip to.
	 * @param html The HTML content of the tooltip.
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltipHtmlToClass( 'meeple', '<div>This is A Meeple</div>' );
	 */
	addTooltipHtmlToClass: (className: string, html: string, delay?: number) => void;

	/**
	 * Removes a tooltip from the DOM element.
	 * @param target The DOM element to remove the tooltip from.
	 * @example this.removeTooltip('cardcount');
	 */
	removeTooltip: (target: string | HTMLElement) => void;

	/**
	 * Shows a message in a big rectangular area on the top of the screen of the current player, and it disappears after few seconds (also it will be in the log in some cases).
	 * Important: the normal way to inform players about the progression of the game is the game log. The "showMessage" is intrusive and should not be used often.
	 * @param message The string to display. It should be translated.
	 * @param type The type of message to display. If set to "info", the message will be an informative message on a white background. If set to "error", the message will be an error message on a red background and it will be added to log. If set to "only_to_log", the message will be added to the game log but will not popup at the top of the screen. If set to custom string, it will be transparent, to use custom type define "head_xxx" in css, where xxx is the type. For example if you want yellow warning, use "warning" as type and add this to css: `.head_warning { background-color: #e6c66e; }`
	 * @example this.showMessage('This is a message', 'info');
	 * @example
	 * // Show message could be used on the client side to prevent user wrong moves before it is send to server. Example from 'battleship':
	 * onGrid: function(event) {
	 * 	if (checkIfPlayerTriesToFireOnThemselves(event)) {
	 * 		this.showMessage(_('This is your own board silly!'), 'error');
	 * 		return;
	 * 	}
	 * 	...
	 * },
	 */
	showMessage: (message: string, type: 'info' | 'error' | 'only_to_log' | string) => void;

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
	showMoveUnauthorized: () => void;

	/**
	 * Shows a confirmation dialog to the user.
	 * 
	 * CAREFUL: the general guideline of BGA is to AVOID the use of confirmation dialogs. Confirmation dialogs slow down the game and bother players. The players know that they have to pay attention to each move when they are playing online. The situations where you should use a confirmation dialog are the following:
	 * - It must not happen very often during a game.
	 * - It must be linked to an action that can really "kill a game" if the player does not pay attention.
	 * - It must be something that can be done by mistake (ex: a link on the action status bar).
	 * @param message The message to show to the user. Use _() to translate.
	 * @param yesHandler The handler to be called on yes.
	 * @param noHandler (optional) The handler to be called on no.
	 * @param param (optional) If specified, it will be passed to both handlers.
	 * @example
	 * this.confirmationDialog(_("Are you sure you want to bake the pie?"), () => {
	 * 	this.bakeThePie();
	 * });
	 * return; // nothing should be called or done after calling this, all action must be done in the handler
	 */
	confirmationDialog: <T>(message: string, yesHandler: (param: T) => any, noHandler?: (param: T) => any, param?: T) => void;

	/**
	 * Shows a multiple choice dialog to the user. Note: there is no cancel handler, so make sure you gave user a choice to get out of it.
	 * @param message The message to show to the user. Use _() to translate.
	 * @param choices An array of choices.
	 * @param callback The handler to be called on choice made. The choice parameter is the INDEX of the choice from the array of choices.
	 * @example
	 * const keys = ["0", "1", "5", "10"];
	 * this.multipleChoiceDialog(_("How many bugs to fix?"), keys, (choice) => {
	 * 	if (choice==0) return; // cancel operation, do not call server action
	 * 	var bugchoice = keys[choice]; // choice will be 0,1,2,3 here
	 * 	this.ajaxcallwrapper("fixBugs", { number: bugchoice });
	 * });
	 * return; // must return here
	 */
	multipleChoiceDialog: (message: string, choices: string[], callback: (choice: number) => void) => void;

	/**
	 * Displays a score value over an element to make the scoring easier to follow for the players. This is particularly useful for final scoring or other important scoring events.
	 * @param anchor The html element to place the animated score onto.
	 * @param color The hexadecimal RGB representation of the color (should be the color of the scoring player), but without a leading '#'. For instance, 'ff0000' for red.
	 * @param score The numeric score to display, prefixed by a '+' or '-'.
	 * @param duration (optional) The animation duration in milliseconds. The default is 1000.
	 * @param offset_x (optional) The x offset in pixels to apply to the scoring animation.
	 * @param offset_y (optional) The y offset in pixels to apply to the scoring animation.
	 * @example this.displayScoring('my_element', 'ff0000', '+5', 1000, 10, 10);
	 * @example
	 * // If you want to display successively each score, you can use this.notifqueue.setSynchronous() function.
	 * setupNotifications: function()   {
	 * 	dojo.subscribe( 'displayScoring', this, "notif_displayScoring" );
	 * 	...
	 * },
	 * notif_displayScoring: function(notif) {
	 * 	const duration = notif.args.duration ?? 1000;
	 * 	this.notifqueue.setSynchronous('displayScoring', duration );
	 * 	this.displayScoring( notif.args.target, notif.args.color, notif.args.score, duration);
	 * },
	 */
	displayScoring: (anchor: string | HTMLElement, color: string, score: number | string, duration?: number, offset_x?: number, offset_y?: number) => void;

	/**
	 * Shows a bubble with a message in it. This is a comic book style speech bubble to express the players voices.
	 * Warning: if your bubble could overlap other active elements of the interface (buttons in particular), as it stays in place even after disappearing, you should use a custom class to give it the style "pointer-events: none;" in order to intercept click events.
	 * Note: If you want this visually, but want to take complete control over this bubble and its animation (for example to make it permanent) you can just use div with 'discussion_bubble' class on it, and content of div is what will be shown.
	 * @param anchor The id of the element to attach the bubble to.
	 * @param message The text to put in the bubble. It can be HTML.
	 * @param delay (optional) The delay in milliseconds. The default is 0.
	 * @param duration (optional) The duration of the animation in milliseconds. The default is 3000.
	 * @param custom_class (optional) An extra class to add to the bubble. If you need to override the default bubble style.
	 * @example this.showBubble('meeple_2', _('Hello'), 0, 1000, 'pink_bubble');
	 * @example
	 * // If you want to display successively each bubble, you can use this.notifqueue.setSynchronous() function.
	 * setupNotifications: function()   {
	 * 	dojo.subscribe( 'showBubble', this, "notif_showBubble" );
	 * 	...
	 * },
	 * notif_showBubble: function(notif) {
	 * 	const duration = notif.args.duration ?? 3000;
	 * 	this.notifqueue.setSynchronous('showBubble', duration );
	 * 	this.showBubble( notif.args.target, notif.args.text, notif.args.delay ?? 0, duration, notif.args.custom_class );
	 * },
	 */
	showBubble: (anchor: string, message: string, delay?: number, duration?: number, custom_class?: string) => void;

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
	addActionButton: (id: string, label: string, method: string | Function, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none') => void;

	/** Removes all buttons from the title bar. */
	removeActionButtons: () => void;

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
	updatePageTitle: () => void;

	//#endregion

	//#region Player Panel and Score Counters

	/**
	 * A dictionary of {@link Counter} objects which show on the built-in player cards. The dictionary key is the player id. This is initialized by the framework but manually needs to be updated when a player's score changes.
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
	scoreCtrl: { [key: number]: Counter };

	/**
	 * Disables the player panel for a given player. Usually, this is used to signal that this player passes, or will be inactive during a while. Note that the only effect of this is visual. There are no consequences on the behaviour of the panel itself.
	 * @param player_id The id of the player to disable the panel for.
	 */
	disablePlayerPanel: (player_id: number) => void;

	/**
	 * Enables a player panel that has been {@link disablePlayerPanel | disabled} before.
	 * @param player_id The id of the player to enable the panel for.
	 */
	enablePlayerPanel: (player_id: number) => void;

	/**
	 * Enables all player panels that have been {@link disablePlayerPanel | disabled} before.
	 */
	enableAllPlayerPanels: () => void;

	/**
	 * Updates the player ordering in the player's panel to match the current player order. This is normally called by the framework, but you can call it yourself if you change `this.gamedatas.playerorder` from a notification. Also you can override this function to change defaults OR insert a non-player panel.
	 */
	updatePlayerOrdering: () => void;

	/**
	 * Updates the global `this.gamedatas.counters` and sets the element `counter_name` to the new value.
	 * @param counter_name The counter to update.
	 * @param new_value The new value of the counter.
	 */
	setCounter: (counter_name: string, new_value: string | number) => void;

	/**
	 * Increments the global `this.gamedatas.counters` and the value of the element `counter_name` by `delta`.
	 * @param counter_name The counter to increment.
	 * @param delta The amount to increment the counter by.
	 */
	incCounter: (counter_name: string, delta: number) => void;

	/**
	 * Updates game counters in the player panel (such as resources). The `counters` argument is a map of counters (the key must match counter_name).
	 * @param counters A map of counters to update.
	 */
	updateCounters: (counters: { [key: string]: { counter_name: string, counter_value: string | number }}) => void;

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
	dontPreloadImage: (image_file_name: string) => void;

	/**
	 * Ensures specific images are loaded. This is the opposite of {@link dontPreloadImage | dontPreloadImage} - it ensures specific images are loaded. Note: only makes sense if preload list is empty, otherwise everything is loaded anyway.
	 * @param list The list of images to ensure are loaded.
	 * @example
	 * this.ensureSpecificGameImageLoading( to_preload );
	 */
	ensureSpecificGameImageLoading: (list: string[]) => void;

	/** Disables the standard "move" sound or this move (so it can be replaced with a custom sound). This only disables the sound for the next move. */
	disableNextMoveSound: () => void;

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
	setClientState: <T extends GameStateName>(newState: T, args: GameStateArgs<T>) => void;

	/** If you are in client state it will restore the current server state (cheap undo). */
	restoreServerGameState: () => void;

	/** Boolean indicating that we are in client state, i.e. we have called {@link setClientState} and have not yet sent anything to the server. */
	on_client_state: boolean;

	//#endregion

	//#region Environment State and Callbacks

	/** A function that can be overridden to manage some resizing on the client side when the browser window is resized. This function is also triggered at load time, so it can be used to adapt to the viewport size at the start of the game too. */
	onScreenWidthChange: () => void;

	/** True if the game is in realtime. Note that having a distinct behavior in realtime and turn-based should be exceptional. */
	bRealtime: boolean;

	/** True during replay/archive mode if animations should be skipped. Only needed if you are doing custom animations. (The BGA-provided animation functions like this.slideToObject() automatically handle instantaneous mode.) */
	instantaneousMode: boolean;

	/** Returns "studio" for studio and "prod" for production environment (i.e. where games current runs). Only useful for debbugging hooks. Note: alpha server is also "prod" */
	getBgaEnvironment: () => 'studio' | 'prod';

	/** Not officially documented! Forces all resize events to activate. */
	sendResizeEvent: () => void;

	/** Not officially documented! Gets the html element for the replay log. */
	getReplayLogNode: () => HTMLElement | null;

	//#endregion
}