/** The interface used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
interface GameNotif {

	/** Record of notification types that should be evaluated synchronously (one after the other). The value of each key represents the duration that should be waited before processing the next notification. */
	synchronous_notifs: Record<keyof NotifTypes, number>;
	/** Record of notification predicates which defining when a notification should be suppressed (prevent synchronous behaviour and prevent callbacks). */
	ignoreNotificationChecks: Record<keyof NotifTypes, ((notif: Notif) => boolean)>;

	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * 
	 * IMPORTANT: Remember that this notification is ignored on the client side, but was still received by the client. Therefore it shouldn't contain any private information as cheaters can get it. In other words this is not a way to hide information.
	 * IMPORTANT: When a game is reloaded with F5 or when opening a turn based game, old notifications are replayed as history notification. They are used just to update the game log and are stripped of all arguments except player_id, i18n and any argument present in message. If you use and other argument in your predicate you should preserve it as explained here.
	 * @param notif_type The type of the notification.
	 * @param predicate A function that will receive notif object and will return true if this specific notification should be ignored.
	 * @example this.notifqueue.setIgnoreNotificationCheck( 'dealCard', (notif) => (notif.args.player_id == this.player_id) );
	 */
	setIgnoreNotificationCheck: <T extends keyof NotifTypes>(notif_type: T, predicate: ((notif: NotifFrom<T>) => boolean)) => void;

	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * @param notif_type The type of the notification.
	 * @param duration The duration in milliseconds to wait after executing the notification handler.
	 * @example
	 * // Here's how we do this, right after our subscription:
	 * dojo.subscribe( 'playDisc', this, "notif_playDisc" );
	 * this.notifqueue.setSynchronous( 'playDisc', 500 );   // Wait 500 milliseconds after executing the playDisc handler
	 * @example
	 * // For this case, use setSynchronous without specifying the duration and use setSynchronousDuration within the notification callback.
	 * // NOTE: If you forget to invoke setSynchronousDuration, the game will remain paused forever!
	 * setupNotifications: function () {
	 * 	dojo.subscribe( 'cardPlayed', this, 'notif_cardPlayed' );
	 * 	this.notifqueue.setSynchronous( 'cardPlayed' ); // wait time is dynamic
	 * 	...
	 * },
	 * notif_cardPlayed: function (notif) {
	 * 	// MUST call setSynchronousDuration
	 * 	// Example 1: From notification args (PHP)
	 * 	this.notifqueue.setSynchronousDuration(notif.args.duration);
	 * 	...
	 * 	// Or, example 2: Match the duration to a Dojo animation
	 * 	var anim = dojo.fx.combine([
	 * 	...
	 * 	]);
	 * 	anim.play();
	 * 	this.notifqueue.setSynchronousDuration(anim.duration);
	 * },
	 */
	setSynchronous: (notif_type: keyof NotifTypes, duration?: number) => void;

	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * @param duration The duration in milliseconds to wait after executing the notification handler.
	 * @see {@link setSynchronous}
	 */
	setSynchronousDuration: (duration: number) => void;

	//#region Internal

	/** Internal. Contains all notifications received that have not yet been dispatched, excluding all player moves which are held until a table move with the same move id is sent. */
	queue: [];
	/** Internal. The reference to the game that manages this. Usually this is for validation, filtering (like players), or checking if the game is in {@link BGACore.instantaneousMode}. */
	game: Gamegui;
	/** Internal. Ordered list of hex uids for notifications that have been dispatched. This is automatically truncated to the last 50 dispatched notifications. */
	dispatchedNotificationUids: string[];
	/** Internal. If true, 'sequence' packets will be resynchronized when queued if needed. */
	checkSequence: boolean;
	/** Internal. The id of the last packet which is marked as 'sequence' or 'resend'. Helper used for sequencing notifications. */
	last_packet_id: number;
	/** Internal. If true, the notifications are currently being resynchronized. */
	notificationResendInProgress: boolean;
	/** Internal. The current synchronous notification that is being processed. Used to prevent group dispatching any further notification (and dispatching single synchronous notifications). */
	waiting_from_notifend: null | Notif;
	/** Internal. A record of non-table moves ids paired with their notifications. This is similar to */
	playerBufferQueue: Record<string, { notifs: NotifsPacket, counter: number }>;
	/** Internal. Like {@link next_log_id}, is a counter for specifically debugging notifications. */
	debugnotif_i: number;
	/** Internal. */
	currentNotifCallback: keyof NotifTypes | null;
	/** Internal. */
	onPlaceLogOnChannel: (chatnotif: NotifFrom<ChatNotifArgs | 'newRTCMode'>) => void;
	/** Internal. The last time that {@link addToLog} was called with valid parameters. */
	lastMsgTime: number;
	/** Internal. */
	cometd_service: any | null;

	/** Internal. Handles getting a new packet of notifications. */
	onNotification: (notifs_or_json: NotifsPacket | string) => void;
	/** Internal. Resynchronizes the network packets, usually used for replaying events. */
	resynchronizeNotifications: (isHistory: boolean) => void;
	/** Internal. Asynchronously tries to pull logs from history to display. Keeps trying until it succeeds. */
	pullResynchronizeLogsToDisplay: () => void;
	/** Internal. Dispatches all queued notifications. */
	dispatchNotifications: () => void;
	/** Internal. Formats and prints the given log message. */
	formatLog: (message: string, args: { player_name: string, player_id?: number, i18n?: string, [key: string]: any }) => string;
	/**
	 * Internal. Dispatches a single notification.
	 * @returns True if a sound was played.
	 */
	dispatchNotification: (notif: Notif, disableSound?: boolean) => boolean;
	/** Adds the given message to the game chat based on the parameters given. */
	addChatToLog: (message: string, seeMore?: boolean, translateIcon?: boolean, extraClasses?: string) => void;
	/** Internal. Translates the inner html of the target element for the event. This opens a new window on google translate with the source text? */
	onTranslateLog: (event: Event) => void;
	/** Adds the given message to the game log based on the parameters given. */
	addToLog: (message: string, seeMore?: boolean, notif?: Notif | null, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number) => void;
	/** Changed the player name to an HTML string with a link to the player account, and red style if the player is an admin. */
	playerNameFilter: (args: { player_name: string, player_id: number }) => void;
	/** Changes the properties on this object to strings tha tare formatted to match the player color. */
	playerNameFilterGame: (args: { player_name: string, i18n?: string, [key: string]: any }) => void;
	/** Internal. Check if there is a notification currently being processed. This is the same as {@link waiting_from_notifend} !== null. */
	isSynchronousNotifProcessed: () => boolean;
	/** Internal. Callback for the internal timeout when the {@link waiting_from_notifend} has finished (the time has elapsed). This dispatches the next notification if needed. */
	onSynchronousNotificationEnd: () => void;
	/** Internal. A callback for replaying the game from a specific state (based on the id of the target element). */
	debugReplayNotif: (event: Event) => void;

	//#endregion
}

