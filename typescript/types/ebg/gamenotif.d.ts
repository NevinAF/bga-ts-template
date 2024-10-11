declare global {
    namespace BGA {
        interface IntrinsicGameAjaxActions {
            notificationHistory: {
                _successargs: [
                    {
                        data: any[];
                    }
                ];
                table: BGA.ID;
                from: number;
                privateinc: 1;
                history: 0 | 1;
            };
        }
        interface AjaxActions extends Type<{
            [scriptlogger: `/web/scriptlogger/${string}.html`]: {
                log: string;
            };
        }> {
        }
        /**
         * An interface type that represents all possible notification types. This is only used as a type for internal validation, ensuring the all notification string literal names and arguments are typed correctly.
         *
         * All entries should follow the format as follows: `[name: string]: object | null;`. For notifications without arguments, use null and not an empty object. This format is omitted so coding intellisense can restrict parameters/types. At runtime, this may not accurately represent all possible notifications depending on if this matches the notify functions used with server code (<yourgame>.game.php).
         *
         * Any notifications types can be added by expanding (not extending) this interface.
         *
         * The built-in notifications are added here to prevent reuse of an existing notification name. There are very few situation where you will want to add listeners for the built-in notifications, as they are handled by the game engine.
         * @example
         * interface NotifTypes {
         * 	'newHand': { cards: Card[] };
         * 	'playCard': { player_id: number, color: number, value: number, card_id: number };
         * 	'trickWin': { };
         * 	'giveAllCardsToPlayer': { player_id: number };
         * 	'newScores': { newScores: { [player_id: number]: number } };
         * }
         */
        interface NotifTypes {
            /** All other args on this object are later copied from {@link CurrentStateArgs} */
            "gameStateChange": BGA.IActiveGameState;
            "gameStateChangePrivateArg": BGA.IActiveGameState['args'];
            "gameStateMultipleActiveUpdate": BGA.ID[];
            "newActivePlayer": BGA.ID;
            "playerstatus": {
                player_id: BGA.ID;
                player_status: 'online' | 'offline' | 'inactive';
            };
            "yourturnack": {
                player: BGA.ID;
            };
            "clockalert": null;
            /** Sent to update a player's zombie or eliminated status. */
            "tableInfosChanged": {
                reload_reason: 'playerQuitGame' | 'playerElimination';
                who_quits: BGA.ID;
            };
            /** Sent whenever a player is eliminated. This calls the {@link Gamequi.showEliminated}. */
            "playerEliminated": {
                who_quits: BGA.ID;
            };
            "tableDecision": {
                decision_type: 'none' | 'abandon' | 'switch_tb' | string;
                decision_taken?: boolean | 'true';
                decision_refused?: boolean | 'true';
                players?: Record<BGA.ID, string>;
            };
            /** Logs the 'log' of the notifications, substituting any args in the log. */
            "infomsg": Record<keyof any, string> & {
                player: BGA.ID;
            };
            "archivewaitingdelay": null;
            "end_archivewaitingdelay": null;
            "replaywaitingdelay": null;
            "end_replaywaitingdelay": null;
            "replayinitialwaitingdelay": null;
            "end_replayinitialwaitingdelay": null;
            /** Normally a noop function, used with {@link GameNotif.setSynchronous} to automatically create a 'delay' notification. */
            "aiPlayerWaitingDelay": null;
            "replay_has_ended": null;
            "updateSpectatorList": Record<BGA.ID, string>;
            /** Creates a {@link PopInDialog} with the given parameters. */
            "tableWindow": {
                id: BGA.ID;
                title: string;
                table: Record<string, Record<string, Record<keyof any, any> | string>>;
                header?: string;
                footer?: string;
                closing?: string;
            };
            /** Sets {@link Gamegui.lastWouldLikeThinkBlinking}, kicking off the blinking animation. */
            "wouldlikethink": null;
            "updateReflexionTime": {
                player_id: BGA.ID;
                delta: number;
                max: number;
            };
            /** Only affects {@link g_archive_mode}. */
            "undoRestorePoint": null;
            "resetInterfaceWithAllDatas": BGA.Gamedatas;
            "zombieModeFail": null;
            "zombieModeFailWarning": null;
            "aiError": {
                error: string;
            };
            "skipTurnOfPlayer": {
                player_id: BGA.ID;
                zombie: boolean;
            };
            "zombieBack": {
                player_id: BGA.ID;
            };
            "allPlayersAreZombie": null;
            "gameResultNeutralized": {
                progression: number;
                player_id: BGA.ID;
            };
            "playerConcedeGame": {
                player_name: string;
            } & Record<keyof any, any>;
            "showTutorial": {
                delay?: number;
                id: BGA.ID;
                text: string;
                calltoaction: string;
                attachement: string;
            };
            "showCursor": {
                player_id: BGA.ID;
                path: Record<keyof any, {
                    id: string;
                    x: number;
                    y: number;
                }>;
            };
            "showCursorClick": {
                player_id: BGA.ID;
                path: Record<keyof any, {
                    id: string;
                    x: number;
                    y: number;
                }>;
            };
            "skipTurnOfPlayerWarning": {
                player_id: BGA.ID;
                delay: number;
            };
            "simplePause": {
                time: number;
            };
            "banFromTable": {
                from: number;
            };
            "resultsAvailable": null;
            "switchToTurnbased": null;
            /** All other args on this object are later copied from {@link CurrentStateArgs} */
            "newPrivateState": BGA.IActiveGameState;
            "chat": ChatNotifArgs;
            "groupchat": ChatNotifArgs & {
                gamesession?: string;
                gamesessionadmin?: string;
                group_id: BGA.ID;
                group_avatar: string;
                group_type: "group" | "tournament";
                group_name: string;
                seemore?: string;
            };
            "chatmessage": ChatNotifArgs;
            "tablechat": ChatNotifArgs & {
                game_name_ori?: string;
                game_name?: string;
            };
            "privatechat": ChatNotifArgs & {
                target_id: BGA.ID;
                target_name: string;
                target_avatar: string;
                player_id: BGA.ID;
                player_name: string;
                avatar: string;
            };
            "stopWriting": ChatNotifArgs;
            "startWriting": ChatNotifArgs;
            "newRTCMode": {
                rtc_mode: 0 | 1 | 2;
                player_id: BGA.ID;
                target_id: BGA.ID;
                room_creator: BGA.ID;
                table_id: BGA.ID;
            };
            "history_history": {};
        }
        /** Partial: This has been partially typed based on a subset of the BGA source code. */
        interface ChatNotifArgs {
            /** The text for this chat message. This is null if the chat message type does not log an actual message (like 'startWriting'). */
            text?: string;
            player_id?: BGA.ID;
            player_name?: string;
            /** Populated after receiving notif, represents the unique identifier for this message, used for linking html events and getting message elements. */
            id?: BGA.ID;
            /** Populated after receiving notif, represents the html version of text? */
            message?: string | {
                log?: boolean;
            };
            /** Populated after receiving notif, represents if message has been read. */
            mread?: boolean | null;
            was_expected?: boolean;
            players?: Record<BGA.ID, PlayerMetadata>;
            reload_reason?: "playerElimination" | "playerQuitGame" | "cancelGameStart";
            is_new?: boolean | 1 | 0;
            logaction?: LogAction;
            type?: string;
            time?: number;
        }
        interface LogAction<T extends keyof AjaxActions = keyof AjaxActions> {
            log: string;
            args: {
                player_name: string;
                player_id: BGA.ID;
                i18n?: string;
                [key: string]: any;
            };
            action_analytics?: any;
            action: T;
            action_arg: AjaxActions[T];
        }
        interface BaseNotif {
            /** The message string passed from php notification. */
            log: string;
            /** True when NotifyAllPlayers method is used (false otherwise), i.e. if all player are receiving this notification. */
            bIsTableMsg?: boolean;
            /** Information about channel which this notification was sent from, formatted as : "/<type>/<prefix>[ID]". */
            channelorig?: ChannelInfos['channel'];
            /** Name of the game which this notification is coming from. Undefined when this is not associated with a game. */
            gamenameorig?: string;
            /** UNIX GMT timestamp. */
            time: number;
            /** Unique identifier of the notification in hex */
            uid: HexString | 0;
            /** Unknown in hex. */
            h?: HexString;
            /** Unknown as well. */
            lock_uuid: string;
            /** Unknown. Probably something to do with synchronizing notifications. */
            synchro?: number;
            /** ID of the move associated with the notification, if any. */
            move_id?: BGA.ID;
            /** ID of the table (comes as string), if any. */
            table_id?: BGA.ID;
        }
        /** A loosely typed structure that represents the data of a network message. This is used to represent any notification type, where the args is an intersection of all possible args. */
        type Notif<T extends keyof NotifTypes = keyof NotifTypes> = BaseNotif & (keyof NotifTypes extends T ? {
            /** The type of the notification (as passed by php function). */
            type: T;
            /** The arguments passed from the server for this notification. This type should always match the notif.type. */
            args: (Record<keyof any, any> & BGA.ID) | null;
        } : {
            [K in T]: {
                /** The type of the notification (as passed by php function). */
                type: K;
                /** The arguments passed from the server for this notification. This type should always match the notif.type. */
                args: NotifTypes[K];
            };
        }[T]);
        /**
         * Internal. A group of notifications which are sent to the client. This is almost always a network message of several notifications.
         *
         * Partial: This has been partially typed based on a subset of the BGA source code.
         */
        interface NotifsPacket {
            /** The type of the packet which is used for determining how these notif should be dispatched (mainly timing). */
            packet_type: 'single' | 'sequence' | 'resend' | 'history';
            /** The notifications that are sent to the client. */
            data: Notif[];
            /** The channel that this notification targets. */
            channel: ChannelInfos['channel'];
            /** The unique id of the move that these notifications represent. Note that when receiving a new notifs packet, this is immediately copied to each notif entry in {@link data}. */
            move_id?: BGA.ID;
            /** The unique id of the table that these notifications represent. Note that when receiving a new notifs packet, this is immediately copied to each notif entry in {@link data}. */
            table_id?: BGA.ID;
            packet_id: BGA.ID;
            prevpacket?: Record<BGA.ID, BGA.ID>;
            chatmessage?: boolean;
            time?: number;
        }
        /**
         * A notification that represents one of the chat types. This types is defined instead of using the type parameter on {@link Notif} because it makes it much easier to check IF properties exist (without getting a type error saying property is not possible on the union).
         */
        type ChatNotif = {
            /** The type of the notification (as passed by php function). */
            type: "chat" | "groupchat" | "chatmessage" | "tablechat" | "privatechat" | "startWriting" | "stopWriting" | "newRTCMode" | "history_history";
            /** The arguments passed from the server for this notification. This type should always match the notif.type. */
            args: AnyOf<NotifTypes["chat" | "groupchat" | "chatmessage" | "tablechat" | "privatechat" | "startWriting" | "stopWriting" | "newRTCMode" | "history_history"]>;
            /** ID of the move associated with the notification, if any. */
            move_id?: BGA.ID;
            /** ID of the table (comes as string), if any. */
            table_id?: BGA.ID;
            channel?: ChannelInfos['channel'];
            loadprevious?: boolean;
            mread?: boolean | null | undefined;
            donotpreview?: any;
        } & BaseNotif;
    }
}
/** The class used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
declare class GameNotif_Template {
    /** Record of notification types that should be evaluated synchronously (one after the other). The value of each key represents the duration that should be waited before processing the next notification. */
    synchronous_notifs: {
        [K in keyof BGA.NotifTypes]?: number;
    };
    /** Record of notification predicates which defining when a notification should be suppressed (prevent synchronous behaviour and prevent callbacks). */
    ignoreNotificationChecks: {
        [T in keyof BGA.NotifTypes]?: ((notif: BGA.Notif<T>) => boolean);
    };
    /**
     * This method will set a check whether any of notifications of specific type should be ignored.
     *
     * IMPORTANT: Remember that this notification is ignored on the client side, but was still received by the client. Therefore it shouldn't contain any private information as cheaters can get it. In other words this is not a way to hide information.
     * IMPORTANT: When a game is reloaded with F5 or when opening a turn based game, old notifications are replayed as history notification. They are used just to update the game log and are stripped of all arguments except player_id, i18n and any argument present in message. If you use and other argument in your predicate you should preserve it as explained here.
     * @param notif_type The type of the notification.
     * @param predicate A function that will receive notif object and will return true if this specific notification should be ignored.
     * @example this.notifqueue.setIgnoreNotificationCheck( 'dealCard', (notif) => (notif.args.player_id == this.player_id) );
     */
    setIgnoreNotificationCheck<T extends keyof BGA.NotifTypes>(notif_type: T, predicate: ((notif: BGA.Notif<T>) => boolean)): void;
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
     * setupNotifications() {
     * 	dojo.subscribe( 'cardPlayed', this, 'notif_cardPlayed' );
     * 	this.notifqueue.setSynchronous( 'cardPlayed' ); // wait time is dynamic
     * 	...
     * },
     * notif_cardPlayed(notif) {
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
    setSynchronous(notif_type: keyof BGA.NotifTypes, duration?: number): void;
    /**
     * This method will set a check whether any of notifications of specific type should be ignored.
     * @param duration The duration in milliseconds to wait after executing the notification handler.
     * @see {@link setSynchronous}
     */
    setSynchronousDuration(duration: number): void;
    /** Internal. Contains all notifications received that have not yet been dispatched, excluding all player moves which are held until a table move with the same move id is sent. */
    queue: BGA.Notif[];
    /** Internal. The id of the next log message. */
    next_log_id: number;
    /** Internal. The reference to the game that manages this. Usually this is for validation, filtering (like players), or checking if the game is in {@link BGA.SiteCore.instantaneousMode}. */
    game: InstanceType<BGA.SiteCore> | null;
    /** Internal. Ordered list of hex uids for notifications that have been dispatched. This is automatically truncated to the last 50 dispatched notifications. */
    dispatchedNotificationUids: string[];
    /** Internal. If true, 'sequence' packets will be resynchronized when queued if needed. */
    checkSequence: boolean;
    /** Internal. The id of the last packet which is marked as 'sequence' or 'resend'. Helper used for sequencing notifications. */
    last_packet_id: BGA.ID;
    /** Internal. If true, the notifications are currently being resynchronized. */
    notificationResendInProgress: boolean;
    /** Internal. The current synchronous notification that is being processed. Used to prevent group dispatching any further notification (and dispatching single synchronous notifications). */
    waiting_from_notifend: null | BGA.Notif;
    /** Internal. A record of non-table moves ids paired with their notifications. This is similar to */
    playerBufferQueue: Record<string, {
        notifs: BGA.NotifsPacket;
        counter: number;
    }>;
    /** Internal. Like {@link next_log_id}, is a counter for specifically debugging notifications. */
    debugnotif_i: number;
    /** Internal. */
    currentNotifCallback: keyof BGA.NotifTypes | null;
    /** Internal. This is a reference to the {@link BGA.SiteCore.onPlaceLogOnChannel} method. */
    onPlaceLogOnChannel: ((chatnotif: BGA.ChatNotif) => void) | null;
    /** Internal. The last time that {@link addToLog} was called with valid parameters. */
    lastMsgTime: number;
    logs_to_load?: BGA.NotifsPacket[];
    logs_to_load_sortedNotifsKeys?: string[];
    logs_to_load_loadhistory?: number;
    bStopAfterOneNotif?: boolean;
    cometd_service?: "keep_existing_gamedatas_limited" | "socketio" | string;
    constructor();
    /** Internal. Handles getting a new packet of notifications. */
    onNotification(notifs_or_json: BGA.NotifsPacket | string): void;
    /** Internal. Resynchronizes the network packets, usually used for replaying events. */
    resynchronizeNotifications(isHistory: boolean): void;
    /** Internal. Asynchronously tries to pull logs from history to display. Keeps trying until it succeeds. */
    pullResynchronizeLogsToDisplay(): void;
    /** Internal. Dispatches all queued notifications. */
    dispatchNotifications(): boolean;
    /** Internal. Formats and prints the given log message. */
    formatLog(message: string, args: {
        player_name: string;
        player_id: BGA.ID;
        i18n?: string;
        [key: string]: any;
    }): string;
    /**
     * Internal. Dispatches a single notification.
     * @returns True if a sound was played.
     */
    dispatchNotification(notif: BGA.Notif, disableSound?: boolean): boolean;
    /** Adds the given message to the game chat based on the parameters given. */
    addChatToLog(message: string, seeMore?: boolean, translateIcon?: boolean, extraClasses?: string): void;
    /** Internal. Translates the inner html of the target element for the event. This opens a new window on google translate with the source text? */
    onTranslateLog(event: Event): void;
    /** Adds the given message to the game log based on the parameters given. */
    addToLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): number;
    /** Changed the player name to an HTML string with a link to the player account, and red style if the player is an admin. */
    playerNameFilter(args: {
        player_name?: string;
        player_id?: BGA.ID;
        is_admin?: boolean;
    }): typeof args;
    /** Changes the properties on this object to strings tha tare formatted to match the player color. */
    playerNameFilterGame(args: undefined): void;
    /** Internal. Check if there is a notification currently being processed. This is the same as {@link waiting_from_notifend} !== null. */
    isSynchronousNotifProcessed(): boolean;
    /** Internal. Callback for the internal timeout when the {@link waiting_from_notifend} has finished (the time has elapsed). This dispatches the next notification if needed. */
    onSynchronousNotificationEnd(): void;
    /** Internal. A callback for replaying the game from a specific state (based on the id of the target element). */
    debugReplayNotif(event: Event): void;
}
declare let GameNotif: DojoJS.DojoClass<GameNotif_Template, []>;
export = GameNotif;
declare global {
    namespace BGA {
        type GameNotif = typeof GameNotif;
        interface EBG {
            gamenotif: GameNotif;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=gamenotif.d.ts.map