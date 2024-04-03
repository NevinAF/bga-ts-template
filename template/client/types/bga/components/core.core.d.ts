interface BGACore {
	/** The list of subscriptions managed by {@link register_subs} and {@link unsubscribe_all}. */
	subscriptions: dojo.Handle[];
	/** Record of the tooltips added by using functions of same flavor of {@link addTooltip} and {@link removeTooltip}. The key is the element id for the tooltip. */
	tooltips: Record<string, dijit.Tooltip>;
	/** If true, all tooltips (existing and future) stored in {@link tooltips} will be closed as soon as it tries to open. See {@link switchDiplaytooltips} for modifying this value. */
	bHideTooltips: boolean;
	/** The minimum width of the game as defined by game_infos>game_interface_width */
	screenMinWidth: number;
	/** Percentage to zoom to make all game components fit within the min {@link screenMinWidth}. */
	currentZoom: number;
	/** All dojo handles that are managed by {@link connect} and {@link disconnect} and their other flavors. */
	connections: { element: HTMLElement, event: string, handle: dojo.Handle }[];
	/** True during replay/archive mode if animations should be skipped. Only needed if you are doing custom animations. (The BGA-provided animation functions like this.slideToObject() automatically handle instantaneous mode.) */
	instantaneousMode: boolean;
	/** The real-time communications object for the game room. See {@link WebRTC} for more information. */
	webrtc: WebRTC | null;
	/** Handle for the rtc notification. Used if/when the rtc is disconnected. */
	webrtcmsg_ntf_handle: dojo.Handle | null;
	/** An enumeration representing the real-time communications type: 0 = disabled, 1 = voice only?, 2 = video? */
	rtc_mode: 0 | 1 | 2;
	/** An object stating which media devices can be accessed. */
	mediaConstraints: { video: boolean, audio: boolean };
	/** The list of player that have marked themselves as this gender. */
	gameMasculinePlayers: number[];
	/** The list of player that have marked themselves as this gender. */
	gameFemininePlayers: number[];
	/** The list of player that have marked themselves as this gender (or have it default). */
	gameNeutralPlayers: number[];
	/** The of emoticons usable with BGA chat windows. This is fully defined for convenience, but this may not match actual source if it changes. */
	emoticons: { ":)": "smile", ":-)": "smile", ":D": "bigsmile", ":-D": "bigsmile", ":(": "unsmile", ":-(": "unsmile", ";)": "blink", ";-)": "blink", ":/": "bad", ":-/": "bad", ":s": "bad", ":-s": "bad", ":P": "mischievous", ":-P": "mischievous", ":p": "mischievous", ":-p": "mischievous", ":$": "blushing", ":-$": "blushing", ":o": "surprised", ":-o": "surprised", ":O": "shocked", ":-O": "shocked", "o_o": "shocked", "O_O": "shocked", "8)": "sunglass", "8-)": "sunglass" };
	/** The default order to try to position tooltips. */
	defaultTooltipPosition: ["above", "below", "after", "before"];
	/** The url for BGA, used to create urls for players, upgrading to premium, creating a new account, and more.  */
	metasiteurl?: string;

	/**
	 * Sends a client side notification to the server in the form of a player action. This should be used only in reaction to a user action in the interface to prevent race conditions or breaking replay game and tutorial features.
	 * @param url The relative URL of the action to perform. Usually, it must be: "/<mygame>/<mygame>/myAction.html"
	 * @param args An array of parameter to send to the game server. Note that `lock` must always be specified when calling player actions. Though not a required parameter, `lock` has been added here to prevent errors: Player actions must always be accompanied by a uuid lock parameter else the server will respond with a lock error. NOTE: If you are seeing an error here, it is likely that you are using a reserved args property (e.g. action/module/class). Make sure no player action arguments have these properties.
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
	ajaxcall: (
		url: string,
		args: (PlayerActions[keyof PlayerActions] | Record<keyof any, any>) & { lock: boolean | 'table' | 'player', action?: undefined, module?: undefined, class?: undefined, noerrortracking?: boolean },
		source: Gamegui,
		onSuccess?: Function,
		callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any,
		ajax_method?: 'post' | 'get' | 'iframe') => void;

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
	format_block: (var_template: string, args: Record<string, any>) => string;

	/**
	 * Formats the string with the values from `args` using ${key} syntax. This is a simple templating system that is generally used to format HTML blocks. The `format` is a string that contains ${key} placeholders, and `args` is an object that contains the values to replace the placeholders with. The method returns the formatted string. Note: result is trimmed.
	 * This should be used when templates are defined in the .tpl file, i.e. they are hydrated by the server in some way.
	 * @param format The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 * @example var div = this.format_string('<div color="${player_color}"></div>', {player_color: '#ff0000'} );
	 */
	format_string: (format: string, args: Record<string, any>) => string;

	/**
	 * Same as `format_string` but recursively formats until no more placeholders are found. This is useful for nested templates, like with server notifications.
	 * @param format The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 */
	format_string_recursive: (format: string, args: Record<string, any>) => string;

	/**
	 * Translates a string. This is a simple function that tries to use the current page translations, {@link _}, and if that fails, it uses the global translations, {@link __}.
	 * @param text The text to translate.
	 * @returns The translated text.
	 * @example
	 * let text = 'Hello world';
	 * // The following two lines have equivalent results.
	 * this.clienttranslate(text)
	 * text == _(text) ? __('lang_mainsite', text) : _(text);
	 */
	clienttranslate_string: (text: string) => string;

	/**
	 * Translates ALL elements with the 'clienttranslatetarget' class.
	 * @param args The translation keys to translate. The key is the element id, and the value is the translation key.
	 * @param translationFrom The translation source to use. This will use the game translations if not specified.
	 */
	translate_client_targets: (args: Record<string, any>, translationFrom?: string) => void;

	/** Registers a dojo.Handle to this object, under the {@link subscriptions} array. This will unsubscribe this listener when using the {@link unsubscribe_all} function. */
	register_subs: (handle: dojo.Handle) => void;

	/** Unsubscribes all listeners registered with {@link register_subs}. */
	unsubscribe_all: () => void;

	/** Registers a cometd subscription to the given comet id. This will unsubscribe this listener when using the {@link unsubscribe_all} function. */
	register_cometd_subs: (comet_id: string) => void;

	/**
	 * Shows a message in a big rectangular area on the top of the screen of the current player, and it disappears after few seconds (also it will be in the log in some cases).
	 * Important: the normal way to inform players about the progression of the game is the game log. The "showMessage" is intrusive and should not be used often.
	 * 
	 * Override this method to customize the message display, usually only used for handling specific custom messages.
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
	 * @example
	 * // This is an override example, presented by anewcar on discord.
	 * showMessage: function (msg, type) {
	 * 	if (type == "error" && msg && msg.includes("!!!club!!!")) {
	 * 		msg = msg.replace("!!!club!!!", this.getTokenDiv("club")); 
	 * 		//return; // suppress red banner and gamelog message
	 * 	}
	 * 	this.inherited(arguments);
	 * },
	  */
	showMessage: (message: string, type: 'info' | 'error' | 'only_to_log' | string) => void;

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

	/** If 3D is enabled (that is, the 'ebd-body' element has the 'mode_3d' class), disable the 3d and return the previous transform value. This is useful for translating DOM elements in 2d space, then re-enabling using {@link enable3dIfNeeded}. */
	disable3dIfNeeded: () => CSSStyleDeclaration['transform'] | null;

	/** Adds the  'mode_3d' class to the 'ebd-body' element if needed, and sets the transform style. If the transform is undefined/null, then this will have no effect. */
	enable3dIfNeeded: (transform?: CSSStyleDeclaration['transform'] | null) => void;

	/** Gets the Z position of an element by using window.getComputedStyle() and pulling it from the view matrix. */
	getComputedTranslateZ: () => number | null;

	/**
	 * Slides an element to a target element on the z axis.
	 */
	transformSlideAnimTo3d: (baseAnimation: dojo._base.Animation, target: string | HTMLElement, duration: number, delay: number, x: number, y: number) => dojo._base.Animation;

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
	 * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
	 * @param target The element to move. This object must be "relative" or "absolute" positioned.
	 * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
	 * @param x Defines the x offset in pixels to apply to the target position.
	 * @param y Defines the y offset in pixels to apply to the target position.
	 * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
	 * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @example this.slideToObjectPos( "some_token", "some_place_on_board", x, y ).play();
	 */
	slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: number, y: number, duration?: number, delay?: number): Animation;

	/**
	 * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
	 * @param target The element to move. This object must be "relative" or "absolute" positioned.
	 * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
	 * @param xpercent Defines the x offset in percent to apply to the target position.
	 * @param ypercent Defines the y offset in percent to apply to the target position.
	 * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
	 * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @example this.slideToObjectPos( "some_token", "some_place_on_board", 50, 50 ).play();
	 */
	slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): Animation;

	/** Converts the given angle in degrees to radians. Same as `angle * Math.PI / 180`. */
	toRadians: (angle: number) => number;

	/** Rotates the vector by the given angle in degrees. */
	vector_rotate: (vector: { x: number, y: number }, angle: number) => { x: number, y: number };

	/**
	 * This destroys the `target` element and all its connectors (onClick, etc), then places a clone positioned at the original location but attached to the `newParent` element. This is useful for moving elements between different containers. See {@link GameguiCookbook.attachToNewParentNoDestroy} for a version that does not destroy the target element.
	 * Changing the HTML parent of an element can be useful for the following reasons:
	 * - When the HTML parent moves, all its child are moving with them. If some game elements is no more linked with a parent HTML object, you may want to attach it to another place.
	 * - The z_order (vertical order of display) depends on the position in the DOM, so you may need to change the parent of some game elements when they are moving in your game area.
	 * @param target The element to move.
	 * @param newParent The new parent element to attach the target to. Note that the position of the target will remain visually the same.
	 * @param position The child index which this should be inserted at. If a string, it will be inserted matching the type, otherwise it will be inserted at the given index.
	 */
	attachToNewParent: (target: string | HTMLElement, newParent: string | HTMLElement, position: dojo.PosString | number) => void;

	/**
	 * This destroys the `target` element and all its connectors (onClick, etc), then places a clone positioned and attached to the `newParent` element.
	 * Changing the HTML parent of an element can be useful for the following reasons:
	 * - When the HTML parent moves, all its child are moving with them. If some game elements is no more linked with a parent HTML object, you may want to attach it to another place.
	 * - The z_order (vertical order of display) depends on the position in the DOM, so you may need to change the parent of some game elements when they are moving in your game area.
	 * @param target The element to move.
	 * @param newParent The new parent element to attach the target to. Note that the position of the target will remain visually the same.
	 * @param position The child index which this should be inserted at. If a string, it will be inserted matching the type, otherwise it will be inserted at the given index.
	 */
	attachToNewParentNoReplace: (target: string | HTMLElement, newParent: string | HTMLElement, position: dojo.PosString | number) => void;

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
	 * Slides a new element from a source location to a destination location. The temporary object created from an html string. This is useful when you want to slide a temporary HTML object from one place to another. As this object does not exists before the animation and won't remain after, it could be complex to create this object (with dojo.place), to place it at its origin (with placeOnObject) to slide it (with slideToObject) and to make it disappear at the end.
	 * @param temporaryHTML HTML string or a node that represents the object to slide. This will be destroyed after the animation ends.
	 * @param parent The ID of an HTML element of your interface that will be the parent of this temporary HTML object.
	 * @param from The element representing the origin of the slide.
	 * @param to The element representing the target of the slide.
	 * @param duration (optional) The duration in milliseconds of the slide. The default is 500 milliseconds.
	 * @param delay (optional) If you define a delay, the slide will start only after this delay. This is particularly useful when you want to slide several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @example this.slideTemporaryObject('<div class="token_icon"></div>', 'tokens', 'my_origin_div', 'my_target_div').play();
	 */
	slideTemporaryObject: (temporaryHTML: dojo.NodeFragmentOrString, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number) => Animation;

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
	 * Rotates an element by a delta degree using an animation. It starts the animation, and stored the rotation degree in the class, so next time you rotate object - it is additive. There is no animation hooks in this one.
	 * @param target The element to rotate.
	 * @param delta The degree to rotate the element by.
	 * @example this.rotateDelta( "a_card_that_must_rotate", 90 );
	 */
	rotateInstantDelta: (target: string | HTMLElement, delta: number) => void;

	/**
	 * Returns the rotation angle of the given element as it is stored in the {@link rotateToPosition} record. If the object does not have a stored rotation it will default to 0. This recursively sum the rotation of all parent elements.
	 * @param target The element to get the rotation of.
	 * @returns The rotation angle of the element.
	 */
	getAbsRotationAngle: (target: string | HTMLElement | null) => number;

	/**
	 * Adds the given style to all elements with the given class. This uses the dojo.query and dojo.style functions to apply the style to all elements with the given class.
	 * @param className The class name of the
	 * @param property The style property to apply.
	 * @param value The value to apply to the style property.
	 * @example this.addClassToClass( 'my_class', 'color', 'red' );
	 */
	addClassToClass: <T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]) => void;

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
	 * Disconnects any event handler previously registered with `connect` or `connectClass` that matches the element and event.
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

	/**
	 * Connects an event to a query selector. This is a wrapper for dojo.connect that uses dojo.query to find the elements to connect the event to. This is useful for connecting events to elements that are created dynamically.
	 * @param selector The query selector to find the elements to connect the event to.
	 * @param event The event to connect to.
	 * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
	 */
	connectQuery: (selector: string, event: string, method: string | Function) => void;

	/** Alias for {@link connectClass}. See {@link connectClass} for more information. */
	addEventToClass: (className: string, event: string, method: string | Function) => void;

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
	 * Decrements the global `this.gamedatas.counters` and the value of the element `counter_name` by `delta`. Unlike {@link incCounter}, this will not allow the counter to go below 0.
	 * @param counter_name The counter to decrement.
	 * @param delta The amount to decrement the counter by.
	 */
	decrCounter: (counter_name: string, delta: number) => void;

	/**
	 * Updates game counters in the player panel (such as resources). The `counters` argument is a map of counters (the key must match counter_name).
	 * @param counters A map of counters to update.
	 */
	updateCounters: (counters: { [key: string]: { counter_name: string, counter_value: string | number }}) => void;

	/**
	 * Creates the HTML used for {@link addTooltip} from the given content.
	 * @param helpStringTranslated The information about "what is this game element?".
	 * @param actionStringTranslated The information about "what happens when I click on this element?".
	 * @returns The HTML content of the tooltip.
	 */
	getHtmlFromTooltipinfos: (helpStringTranslated: string, actionStringTranslated: string) => string;

	/**
	 * Adds a tooltip to the DOM element. This is a simple text tooltip to display some information about "what is this game element?" and "what happens when I click on this element?". You must specify both of the strings. You can only use one and specify an empty string for the other one. When you pass text directly function _() must be used for the text to be marked for translation! Except for empty string. Parameter "delay" is optional. It is primarily used to specify a zero delay for some game element when the tooltip gives really important information for the game - but remember: no essential information must be placed in tooltips as they won't be displayed in some browsers (see Guidelines).
	 * @param target The id of the DOM element to add the tooltip to. This id is used for a dictionary lookup and using an id that already has a tooltip will overwrite the previous tooltip.
	 * @param helpStringTranslated The information about "what is this game element?".
	 * @param actionStringTranslated The information about "what happens when I click on this element?".
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltip( 'cardcount', _('Number of cards in hand'), '' );
	 */
	addTooltip: (target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number) => void;

	/**
	 * Adds an HTML tooltip to the DOM element. This is for more elaborate content such as presenting a bigger version of a card.
	 * @param target The id of the DOM element to add the tooltip to. This id is used for a dictionary lookup and using an id that already has a tooltip will overwrite the previous tooltip.
	 * @param html The HTML content of the tooltip.
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltipHtml( 'cardcount', '<div>Number of cards in hand</div>' );
	 */
	addTooltipHtml: (target: string, html: string, delay?: number) => void;

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
	 * Changes the {@link bHideTooltips} property and overrides all tooltips 'onShow' event to either block or unblock all tooltips from showing.
	 * @param displayType The type of display to set. 0 = unblock, 1 = block.
	 * 
	 * Specific tooltips can be hidden by either calling {@link removeTooltip} or by setting the 'onShow' event to a noop function. This will be reverted whenever this function is called:
	 * @example this.tooltips['some_id'].onShow = () => {};
	 */
	switchDisplayTooltips: (displayType: 0 | 1) => void;

	/**
	 * Replaces a pseudo markup text with a proper html string, designed for comments. This function replaces the following:
	 * - `*<text>*`: bold
	 * - `---`: horizontal line
	 * - `[<color>]<text>[/color]`: Colored text, supporting red, green, and blue.
	 * - `!!!`: Warning icon from fa icons.
	 * - `[tip]`: A lightbulb icon from fa icons.
	 * @param text The text to apply the markup to.
	 * @returns The HTML string with the markup applied.
	 */
	applyCommentMarkup: (text: string) => string;

	/**
	 * Shows a confirmation dialog to the user, with a yes and no button.
	 * 
	 * CAREFUL: the general guideline of BGA is to AVOID the use of confirmation dialogs. Confirmation dialogs slow down the game and bother players. The players know that they have to pay attention to each move when they are playing online. The situations where you should use a confirmation dialog are the following:
	 * - It must not happen very often during a game.
	 * - It must be linked to an action that can really "kill a game" if the player does not pay attention.
	 * - It must be something that can be done by mistake (ex: a link on the action status bar).
	 * @param message The message to show to the user. Use _() to translate.
	 * @param yesHandler The handler to be called on yes.
	 * @param noHandler (optional) The handler to be called on no.
	 * @param param (optional) If specified, it will be passed to both handlers. If param is not defined, null will be passed instead.
	 * @example
	 * this.confirmationDialog(_("Are you sure you want to bake the pie?"), () => {
	 * 	this.bakeThePie();
	 * });
	 * return; // nothing should be called or done after calling this, all action must be done in the handler
	 */
	confirmationDialog: <T>(message: string, yesHandler: (param: T) => any, noHandler?: (param: T) => any, param?: T) => void;

	/**
	 * Shows a warning dialog single 'duly noted' button. The di
	 * 
	 */
	warningDialog: (message: string, callback: () => any) => void;

	/**
	 * Creates a dialog with the message and title, and a single button that says "Ok".
	 * (TODO This may be incorrect based on source ->) The dialog can only be closed by clicking the "Ok" button and will call the callback if it is provided. This is useful for displaying information to the user before preforming a possibly confusing action like reloading the page.
	 * 
	 * {@link warningDialog} is similar but has difference styling.
	 * @param message The message to display in the dialog.
	 * @param title The title of the dialog.
	 * @param callback The callback to call when the "Ok" button is clicked.
	 * @param useSiteDialog (optional) If true, the dialog will be presented using the bgaConfirm function from the sites index.js file. Otherwise, a popup dialog with the id 'info_dialog' will be created.
	 * @returns The dialog that was created.
	 * @example
	 * this.infoDialog(_("You need to reload the page because the game is out of sync."), _("Out of Sync"), () => window.location.reload());
	 */
	infoDialog: (message: string, title: string, callback?: () => any, useSiteDialog?: boolean) => void;

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
	 * Shows a info dialog that also has a text field. See {@link infoDialog} for more information.
	 * @param title The title of the dialog.
	 * @param callback The callback to call when the "Ok" button is clicked. This is passed the unmodified value of the text field.
	 * @param message The message to display in the dialog. If omitted, the dialog will not have a message.
	 */
	askForValueDialog: (title: string, callback: (value: string) => void, message?: string) => void;

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
	 * Creates an concentric circles animated effect at the specified location relative to the anchor. This is useful for showing a point of interest or a special event, usually use to represent a mouse click of a player.
	 * @param anchor The id of the element to attach the effect to. The left and top are relative to this element.
	 * @param left The left offset.
	 * @param top The top offset.
	 * @param backgroundColor (optional) The background color of the circles. The default is 'red'.
	 */
	showClick: (anchor: string, left: CSSStyleDeclaration['left'], top: CSSStyleDeclaration['top'], backgroundColor?: CSSStyleDeclaration['backgroundColor']) => void;

	/**
	 * Returns a translated string representing the `rank` of the given placement.
	 * @param player_rank A number representing the placement of the player: 1 = 1st, 2 = 2nd, etc.
	 * @param losersOrdered If true, all players will be marked in the 1st, 2nd, 3rd, etc. order. If false, 1 = Winner and 2+ = Loser.
	 * @returns The translated string representing the rank.
	 */
	getRankString: (player_rank: number, losersOrdered?: boolean) => '1st' | '2nd' | '3rd' | `${number}th` | 'Winner' | 'Loser' | string;

	/** Turns the number 0-100 into a translated karma label. If the number is out of range, undefined is returned. */
	getKarmaLabel: (karma: number) => 'Very bad' | 'Bad' | 'Not good' | 'Average' | 'Good' | 'Very good' | 'Excellent' | 'Perfect' | string | undefined;

	/** Returns the number of keys in an object. @deprecated You should use Object.keys(obj).length instead. */
	getObjectLength(obj: object): number;

	// formatReflexionTime

	//#region Internal

	/** Internal. The list of comet subscriptions managed by {@link register_cometd_subs} and {@link unsubscribe_all}. The key is the comet id used for emits, and the number is the amount of subscriptions to that id. */
	comet_subscriptions: Record<string, number>;
	/** Internal. @deprecated This is not used within the main code file anymore. */
	unload_in_progress: boolean;
	/** Internal. See {@link cancelAjaxCall} form more information. Looks like this prevent callbacks on ajax calls. */
	bCancelAllAjax: boolean;
	/** Internal. Extra info about tooltips, used for events. */
	tooltipsInfos: Record<string, { hideOnHoverEvt: dojo.Handle }>;
	/** Internal. */
	mozScale: number;
	/** Internal. Saved states for rotate functions (so preform quick translations). See {@link rotateTo}, {@link rotateInstantDelta}, and other flavors for more info. */
	rotateToPosition: Record<string, number>;
	/** Internal. The type and identifier for the room (T{table_id} = table, P{player_id}_{player_id} = private). */
	room: `T${number}` | `P${number}_${number}` | null;
	/** Internal. The room that has been accepted by the player. Used for keeping the current room up to date. */
	already_accepted_room: `T${number}` | `P${number}_${number}` | null;
	/** Internal. The {@link WebPush} object for this. This is initialized within {@link setupWebPush} */
	webpush: WebPush | null;
	/** Internal. The currently set min width for this interface. This is different then {@link screenMinWidth} which is constant. */
	interface_min_width: number;
	/** Internal. A counter used to create unique ids for confirmation dialogs that open at the same time (to maintain functionality). If undefined, no confirmation dialogs have been created. See {@link confirmationDialog} for more information. */
	confirmationDialogUid?: number;
	/** Internal. The uid for the last dialog that was confirmed, used to prevent double calling functions. If undefined, no confirmation dialogs have been created. See {@link confirmationDialog} for more information. */
	confirmationDialogUid_called
	/** Internal. Used to managed the state of bubbles from {@link showBubble} and {@link doShowBubble}. The keys of this record represent all active bubbles, and the value is the timeout that is currently running on that bubble. */
	discussionTimeout: Record<string, number>;
	/** A counter representing the number of times {@link showClick} has been called. Used to create custom element id's for maintaining callbacks. */
	showclick_circles_no: number;


	/** Internal. Makes an ajax page request and loads the content into the given part of the DOM. The {@param loadTo} will be emptied before any new elements are added. */
	ajaxpageload: (url: string, content: object | string, loadTo: string | HTMLElement, callback_target: any, callback: string | ((data: any) => any)) => void;

	/** Internal. Helper function for ajax calls used to present HTTP errors. This calls the {@link showMessage} function with a custom translated error matching the error code. */
	displayUserHttpError: (error_code: number) => void;

	/** Internal. Enables the {@link bCancelAllAjax} property which modifies how ajax callbacks are attached to the ajax requests. */
	cancelAjaxCall: () => void;

	/** Internal. Apply gender regex to some text. */
	applyGenderRegexps: (text: string, apply_type?: null | 0 | 1) => string;
	
	/** Internal. Sets the {@link interface_min_width}. */
	adaptScreenToMinWidth: (min_width: number) => void;

	/** Internal. Preforms screen resizing by styling the body element with a zoom equal to a newly computed {@link currentZoom}. */
	adaptScreenToMinWidthWorker: () => void;

	/** Internal. @deprecated This looks like it is using an old version of dojo position, and not called withing the source code. */
	getObjPosition: (obj: HTMLElement | string) => { x: number, y: number };

	/** Internal. A purely helper function for {@link showBubble}. This is used like a local function would be to prevent duplication. Always used {@link showBubble} instead. */
	doShowBubble: (anchor: string, message: string, custom_class?: string) => void;

	/** Internal. Returns the translated <text>_displayed string. */
	getGameNameDisplayed: (text: string) => string;

	//#endregion
}