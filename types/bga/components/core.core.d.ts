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
	connections: dojo.Handle[];
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
	 * @param actionURL The relative URL of the action to perform. Usually, it must be: "/<mygame>/<mygame>/myAction.html"
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
		actionURL: string,
		args: (PlayerActions[keyof PlayerActions] | Record<keyof any, any>) & { lock: boolean | 'table' | 'player', action?: undefined, module?: undefined, class?: undefined, noerrortracking?: boolean },
		source: Gamegui,
		onSuccess?: Function,
		callback?: (error: boolean, errorMessage?: string, errorCode?: number) => any,
		ajax_method?: 'post' | 'get' | 'iframe') => void;

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

	//#endregion
}