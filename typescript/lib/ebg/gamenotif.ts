// @ts-nocheck

import dojo = require("dojo");
import declare = require("dojo/_base/declare");

declare global {
	namespace BGA {
		interface IntrinsicGameAjaxActions {
			notificationHistory: {
				_successargs: [{
					data: any[]
				}],
				table: BGA.ID,
				from: number,
				privateinc: 1,
				history: 0 | 1,
			}
		}

		interface AjaxActions extends Type<{
			[scriptlogger: `/web/scriptlogger/${string}.html`]: { log: string };
		}> { }

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
		interface NotifTypes
		{
			/** All other args on this object are later copied from {@link CurrentStateArgs} */
			"gameStateChange": BGA.IActiveGameState;
			"gameStateChangePrivateArg": BGA.IActiveGameState['args'];
			"gameStateMultipleActiveUpdate": BGA.ID[];
			"newActivePlayer": BGA.ID;
			"playerstatus": { player_id: BGA.ID, player_status: 'online' | 'offline' | 'inactive' };
			"yourturnack": { player: BGA.ID };
			"clockalert": null;
			/** Sent to update a player's zombie or eliminated status. */
			"tableInfosChanged": { reload_reason: 'playerQuitGame' | 'playerElimination', who_quits: BGA.ID };
			/** Sent whenever a player is eliminated. This calls the {@link Gamequi.showEliminated}. */
			"playerEliminated": { who_quits: BGA.ID };
			"tableDecision": {
				decision_type: 'none' | 'abandon' | 'switch_tb' | string,
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
			"tableWindow": { id: BGA.ID, title: string, table: Record<string, Record<string, Record<keyof any, any> | string>>, header?: string, footer?: string, closing?: string; };
			/** Sets {@link Gamegui.lastWouldLikeThinkBlinking}, kicking off the blinking animation. */
			"wouldlikethink": null;
			"updateReflexionTime": { player_id: BGA.ID, delta: number, max: number };
			/** Only affects {@link g_archive_mode}. */
			"undoRestorePoint": null;
			"resetInterfaceWithAllDatas": BGA.Gamedatas;
			"zombieModeFail": null;
			"zombieModeFailWarning": null;
			"aiError": { error: string };
			"skipTurnOfPlayer": { player_id: BGA.ID, zombie: boolean };
			"zombieBack": { player_id: BGA.ID };
			"allPlayersAreZombie": null;
			"gameResultNeutralized": { progression: number, player_id: BGA.ID };
			"playerConcedeGame": { player_name: string } & Record<keyof any, any>;
			"showTutorial": { delay?: number, id: BGA.ID, text: string, calltoaction: string, attachement: string };
			"showCursor": { player_id: BGA.ID, path: Record<keyof any, { id: string, x: number, y: number }> };
			"showCursorClick": { player_id: BGA.ID, path: Record<keyof any, { id: string, x: number, y: number }> };
			"skipTurnOfPlayerWarning": { player_id: BGA.ID, delay: number };
			"simplePause": { time: number };
			"banFromTable": { from: number };
			"resultsAvailable": null;
			"switchToTurnbased": null;
			/** All other args on this object are later copied from {@link CurrentStateArgs} */
			"newPrivateState": BGA.IActiveGameState;

			"chat": ChatNotifArgs;
			"groupchat": ChatNotifArgs & { gamesession?: string; gamesessionadmin?: string, group_id: BGA.ID, group_avatar: string, group_type: "group" | "tournament", group_name: string, seemore?: string };
			"chatmessage": ChatNotifArgs;
			"tablechat": ChatNotifArgs & { game_name_ori?: string, game_name?: string }
			"privatechat": ChatNotifArgs & { target_id: BGA.ID, target_name: string, target_avatar: string, player_id: BGA.ID, player_name: string, avatar: string };
			"stopWriting": ChatNotifArgs;
			"startWriting": ChatNotifArgs;
			"newRTCMode": { rtc_mode: 0 | 1 | 2, player_id: BGA.ID, target_id: BGA.ID, room_creator: BGA.ID, table_id: BGA.ID };
			"history_history": { };
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
			message?: string | { log?: boolean };
			/** Populated after receiving notif, represents if message has been read. */
			mread?: boolean | null;

			was_expected?: boolean;
			players?: Record<BGA.ID, PlayerMetadata>;
			reload_reason?: "playerElimination" | "playerQuitGame" | "cancelGameStart";
			is_new?: boolean | 1 | 0;
			logaction?: LogAction
			type?: string;
			time?: number;
		}

		interface LogAction<T extends keyof AjaxActions = keyof AjaxActions> {
			log: string;
			args: { player_name: string, player_id: BGA.ID, i18n?: string, [key: string]: any };
			action_analytics?: any;
			action: T;
			action_arg: AjaxActions[T];
		}


		/**
		 * A loosely typed structure that represents all possible arguments for a notification. This is an intersection of all possible arguments, which prevents the need to cast the args to a specific type. Use {@link NotifFrom} to represent a specific arguments rather then the specific notif type(s).
		 * 
		 * Because this is one big intersection, it can suffer from a {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#intersections-reduced-by-discriminant-properties | intersections reduced by discriminant properties} issue. If this is the case, you should either change argument properties so they don't share names with differing types (T1 & T2 == never), or add them here as an omitted type, and manually intersect like with 'id' below.
		 */

		/** A loosely typed structure that represents the data of a network message. This is used to represent any notification type, where the args is an intersection of all possible args. */
		interface Notif<T extends keyof NotifTypes = keyof NotifTypes>
		{
			/** The type of the notification (as passed by php function). */
			type: T;
			/** The arguments passed from the server for this notification. This type should always match the notif.type. */
			args: keyof NotifTypes extends T
				? (Record<keyof any, any> & BGA.ID) | null // It is fairly easy to create a too complex type that results in unknown/never. Instead, cast as a simple record.
				: AnyOf<NotifTypes[T]>;
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

		/**
		 * Internal. A group of notifications which are sent to the client. This is almost always a network message of several notifications.
		 * 
		 * Partial: This has been partially typed based on a subset of the BGA source code.
		 */
		interface NotifsPacket
		{
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

		interface ChatNotif extends Notif<"chat" | "groupchat" | "chatmessage" | "tablechat" | "privatechat" | "startWriting" | "stopWriting" | "newRTCMode" | "history_history"> {
			channel?: ChannelInfos['channel'];
			loadprevious?: boolean;
			mread?: boolean | null | undefined;
			donotpreview?: any;
		}
	}
}

/** The class used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
class GameNotif_Template {

	/** Record of notification types that should be evaluated synchronously (one after the other). The value of each key represents the duration that should be waited before processing the next notification. */
	synchronous_notifs: { [K in keyof BGA.NotifTypes]?: number } = {};
	
	/** Record of notification predicates which defining when a notification should be suppressed (prevent synchronous behaviour and prevent callbacks). */
	ignoreNotificationChecks: {
		[T in keyof BGA.NotifTypes]?: ((notif: BGA.Notif<T>) => boolean);
	} = {};

	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * 
	 * IMPORTANT: Remember that this notification is ignored on the client side, but was still received by the client. Therefore it shouldn't contain any private information as cheaters can get it. In other words this is not a way to hide information.
	 * IMPORTANT: When a game is reloaded with F5 or when opening a turn based game, old notifications are replayed as history notification. They are used just to update the game log and are stripped of all arguments except player_id, i18n and any argument present in message. If you use and other argument in your predicate you should preserve it as explained here.
	 * @param notif_type The type of the notification.
	 * @param predicate A function that will receive notif object and will return true if this specific notification should be ignored.
	 * @example this.notifqueue.setIgnoreNotificationCheck( 'dealCard', (notif) => (notif.args.player_id == this.player_id) );
	 */
	setIgnoreNotificationCheck<T extends keyof BGA.NotifTypes>(notif_type: T, predicate: ((notif: BGA.Notif<T>) => boolean)): void {
		// @ts-ignore - This assignment fails to type check because type T can represent a union of keys, but only one can functionally be used.
		this.ignoreNotificationChecks[notif_type] = predicate;
	}

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
	setSynchronous(notif_type: keyof BGA.NotifTypes, duration?: number): void {
		this.synchronous_notifs[notif_type] = undefined === duration ? -1 : duration;
	}

	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * @param duration The duration in milliseconds to wait after executing the notification handler.
	 * @see {@link setSynchronous}
	 */
	setSynchronousDuration(duration: number): void {
		this.game && this.game.instantaneousMode && (duration = 1);
		setTimeout("endnotif()", duration);
	}

	//#region Internal

	/** Internal. Contains all notifications received that have not yet been dispatched, excluding all player moves which are held until a table move with the same move id is sent. */
	queue: BGA.Notif[] = [];
	/** Internal. The id of the next log message. */
	next_log_id: number = 0;
	/** Internal. The reference to the game that manages this. Usually this is for validation, filtering (like players), or checking if the game is in {@link BGA.SiteCore.instantaneousMode}. */
	game: InstanceType<BGA.SiteCore> | null = null;
	/** Internal. Ordered list of hex uids for notifications that have been dispatched. This is automatically truncated to the last 50 dispatched notifications. */
	dispatchedNotificationUids: string[] = [];
	/** Internal. If true, 'sequence' packets will be resynchronized when queued if needed. */
	checkSequence: boolean = false;
	/** Internal. The id of the last packet which is marked as 'sequence' or 'resend'. Helper used for sequencing notifications. */
	last_packet_id: BGA.ID = 0;
	/** Internal. If true, the notifications are currently being resynchronized. */
	notificationResendInProgress: boolean = false;
	/** Internal. The current synchronous notification that is being processed. Used to prevent group dispatching any further notification (and dispatching single synchronous notifications). */
	waiting_from_notifend: null | BGA.Notif = null;
	/** Internal. A record of non-table moves ids paired with their notifications. This is similar to */
	playerBufferQueue: Record<string, { notifs: BGA.NotifsPacket, counter: number }> = {}
	/** Internal. Like {@link next_log_id}, is a counter for specifically debugging notifications. */
	debugnotif_i: number = 1;
	/** Internal. */
	currentNotifCallback: keyof BGA.NotifTypes | null = null;
	/** Internal. This is a reference to the {@link BGA.SiteCore.onPlaceLogOnChannel} method. */
	onPlaceLogOnChannel: ((chatnotif: BGA.ChatNotif) => void) | null = null;
	/** Internal. The last time that {@link addToLog} was called with valid parameters. */
	lastMsgTime: number = 0;
	logs_to_load?: BGA.NotifsPacket[];
	logs_to_load_sortedNotifsKeys?: string[];
	logs_to_load_loadhistory?: number;
	bStopAfterOneNotif?: boolean;
	cometd_service?: "keep_existing_gamedatas_limited" | "socketio" | string;

	constructor() {
		dojo.subscribe("notifEnd", this as GameNotif_Template, "onSynchronousNotificationEnd");
	}

	/** Internal. Handles getting a new packet of notifications. */
	onNotification(notifs_or_json: BGA.NotifsPacket | string): void {
		let notifs: BGA.NotifsPacket;
		if ("string" == typeof notifs_or_json)
			notifs = dojo.fromJson(notifs_or_json);
		else notifs = notifs_or_json;

		try {
			var i = false;
			"/table" == notifs.channel.substr(0, 6) && (i = true);
			if (
				"/player" == notifs.channel.substr(0, 7) &&
				undefined !== notifs.table_id &&
				null !== notifs.table_id &&
				(null === this.game ||
					this.game.table_id != notifs.table_id)
			)
				return;
			if ("single" == notifs.packet_type) {}
			else if (
				"sequence" == notifs.packet_type &&
				this.checkSequence
			) {
				var n: null | BGA.ID = null;
				notifs.prevpacket &&
					i &&
					(notifs.prevpacket[0]
						? (n = toint(notifs.prevpacket[0]))
						: notifs.prevpacket[this.game!.player_id!] &&
							(n = toint(
								notifs.prevpacket[this.game!.player_id!]
							)));
				if (null !== n)
					if (
						toint(this.last_packet_id) == toint(n)
					) {
						notifs.packet_id;
						this.last_packet_id = toint(
							notifs.packet_id
						);
					} else {
						if (
							toint(n) >
							toint(this.last_packet_id)
						) {
							this.last_packet_id;
							this.resynchronizeNotifications(false);
							return;
						}
						if (
							toint(this.last_packet_id) >
							toint(n)
						) {
							notifs.packet_id;
							this.last_packet_id = toint(
								notifs.packet_id
							);
						}
					}
			} else if ("resend" == notifs.packet_type) {
				if (
					toint(notifs.packet_id) >
					toint(this.last_packet_id)
				) {
					notifs.packet_id;
					this.last_packet_id = notifs.packet_id;
				}
			} else if ("history" == notifs.packet_type)
				for (let o in notifs.data) {
					var a = notifs.data[o]!.type;
					if (
						"chatmessage" == a ||
						"wouldlikethink" == a
					) {}
					else {
						notifs.data[o]!.args!["originalType"] =
							notifs.data[o]!.type;
						notifs.data[o]!.type = "history_history";
						null !== this.game &&
							(notifs.data[o]!.gamenameorig =
								this.game.game_name!);
					}
				}
			else notifs.packet_type;
			var s = notifs.data.length;
			for (let o = 0; o < s; o++) {
				notifs.data[o]!.channelorig = notifs.channel;
				undefined !== notifs.gamename &&
					(notifs.data[o]!.gamenameorig = notifs.gamename);
				undefined !== notifs.time && (notifs.data[o]!.time = notifs.time);
				undefined !== notifs.move_id &&
					i &&
					(notifs.data[o]!.move_id = notifs.move_id);
			}
			if (
				notifs.chatmessage ||
				"history" == notifs.packet_type ||
				"single" == notifs.packet_type
			)
				for (let o = 0; o < s; o++)
					this.dispatchNotification(notifs.data[o]!);
			else if (!i && notifs.move_id)
				this.playerBufferQueue[notifs.move_id] = {
					notifs: notifs,
					counter: 0,
				};
			else {
				for (let o = 0; o <= s; o++) {
					if (notifs.move_id)
						if (
							o < s &&
							("replaywaitingdelay" ==
								notifs.data[o]!.type ||
								"end_replaywaitingdelay" ==
									notifs.data[o]!.type ||
								"replayinitialwaitingdelay" ==
									notifs.data[o]!.type ||
								"end_replayinitialwaitingdelay" ==
									notifs.data[o]!.type)
						) {}
						else if (
							this.playerBufferQueue[notifs.move_id]
						) {
							for (
								var r =
										this.playerBufferQueue[
											notifs.move_id
										]!.counter,
									l =
										this.playerBufferQueue[
											notifs.move_id
										]!.notifs,
									d = 0;
								d < l.data.length;
								d++
							)
								if (
									toint(l.data[d]!.synchro) ==
									toint(r)
								) {
									l.data[d]!.bIsTableMsg = false;
									this.queue.push(l.data[d]!);
									l.data[d]!.lock_uuid &&
										dojo.publish(
											"lockInterface",
											[
												{
													status: "queued",
													bIsTableMsg:
														false,
													uuid: l
														.data[d]!
														.lock_uuid,
												},
											]
										);
								}
							this.playerBufferQueue[notifs.move_id]!
								.counter++;
						}
					if (o < s) {
						notifs.data[o]!.bIsTableMsg = i;
						i &&
							notifs.move_id &&
							(notifs.data[o]!.move_id = notifs.move_id);
						i &&
							notifs.table_id &&
							(notifs.data[o]!.table_id = notifs.table_id);
						this.queue.push(notifs.data[o]!);
						notifs.data[o]!.lock_uuid &&
							dojo.publish("lockInterface", [
								{
									status: "queued",
									bIsTableMsg: i,
									uuid: notifs.data[o]!.lock_uuid,
								},
							]);
					}
				}
				notifs.move_id &&
					this.playerBufferQueue[notifs.move_id] &&
					delete this.playerBufferQueue[notifs.move_id];
				this.queue.length;
				this.dispatchNotifications();
			}
		} catch (h: any) {
			var c = "";
			$("logs") && dojo.style("logs", "display", "block");
			this.currentNotifCallback &&
				(c +=
					"During notification " +
					this.currentNotifCallback +
					"\n");
			c += h.message + "\n";
			c += h.stack || h.stacktrace || "no_stack_avail";
			this.game
				? this.game.onScriptError(c, "", "")
				: mainsite.onScriptError(c, "", "");
		}
	}
	/** Internal. Resynchronizes the network packets, usually used for replaying events. */
	resynchronizeNotifications(isHistory: boolean): void {
		if (!this.notificationResendInProgress) {
			this.notificationResendInProgress = true;
			var t = this.game!.game_name,
				i: 0 | 1 = isHistory ? 1 : 0;
			"undefined" != typeof g_replayFrom && (i = 0);
			this.game!.ajaxcall(
				`/${t}/${t}/notificationHistory.html`,
				{
					table: this.game!.table_id!,
					from: toint(this.last_packet_id) + 1,
					privateinc: 1,
					history: i,
				},
				this,
				function (e) {
					0 == e.data.length &&
						"undefined" != typeof g_replayFrom &&
						this.game.onEndOfReplay();
					var t = [];
					for (var n in e.data) t.push(n);
					t.sort(function (t, i) {
						return e.data[i] - e.data[t];
					});
					if (
						"undefined" != typeof gameui &&
						0 ==
							gameui.log_history_loading_status
								.downloaded
					) {
						gameui.log_history_loading_status.downloaded = 1;
						gameui.log_history_loading_status.total =
							t.length;
						gameui.updateLoaderPercentage();
					}
					this.logs_to_load = e.data;
					this.logs_to_load_sortedNotifsKeys = t;
					this.logs_to_load_loadhistory = i;
					this.logs_to_load_bMaskStillActive = true;
					this.logs_to_load_bFirst = true;
					this.pullResynchronizeLogsToDisplay();
				},
				function (e) {
					this.notificationResendInProgress = false;
				}
			);
		}
	}
	/** Internal. Asynchronously tries to pull logs from history to display. Keeps trying until it succeeds. */
	pullResynchronizeLogsToDisplay(): void {
		for (var t, i = 0; i < 10; i++) {
			if (
				undefined ===
				(t = this.logs_to_load_sortedNotifsKeys.shift())
			) {
				if (
					this.logs_to_load_loadhistory &&
					this.game &&
					$("move_nbr") &&
					toint($("move_nbr").innerHTML) > 1
				) {
					var n =
						"/" +
						this.game.gameserver +
						"/" +
						this.game.game_name +
						"?table=" +
						this.game.table_id +
						"&replayLastTurn=1&replayLastTurnPlayer=" +
						this.game.player_id;
					this.addToLog(
						'<p style="text-align:center;"><a href="' +
							n +
							'" class="bgabutton bgabutton_gray replay_last_move_button"><span class="textalign"><span class="icon32 icon32_replaylastmoves textalign_inner"></span></span> ' +
							__(
								"lang_mainsite",
								"Replay last moves"
							) +
							"</a></p>",
						false,
						false,
						"replay_last_moves"
					);
				}
				gameui.log_history_loading_status.loaded =
					gameui.log_history_loading_status.total;
				gameui.updateLoaderPercentage();
				return;
			}
			if (
				this.game &&
				"undefined" != typeof g_replayFrom
			) {
				bLast = t == this.logs_to_load.length - 1;
				if (this.logs_to_load_bFirst)
					this.logs_to_load_bFirst = false;
				else if (
					null !== this.logs_to_load[t].move_id
				) {
					this.logs_to_load[t].data.unshift({
						args: {},
						bIsTableMsg: true,
						lock_uuid: "dummy",
						log: "",
						type: "end_replaywaitingdelay",
						uid: this.archive_uuid + 10,
					});
					this.logs_to_load[t].data.unshift({
						args: {},
						bIsTableMsg: true,
						lock_uuid: "dummy",
						log: "",
						type: "replaywaitingdelay",
						uid: this.archive_uuid + 11,
					});
				}
				if (
					this.logs_to_load_bMaskStillActive &&
					toint(this.logs_to_load[t].move_id) >=
						toint(g_replayFrom)
				) {
					this.logs_to_load_bMaskStillActive = false;
					this.logs_to_load[t].data.unshift({
						args: {},
						bIsTableMsg: true,
						lock_uuid: "dummy",
						log: "",
						type: "end_replayinitialwaitingdelay",
						uid: this.archive_uuid + 20,
					});
					this.logs_to_load[t].data.unshift({
						args: {},
						bIsTableMsg: true,
						lock_uuid: "dummy",
						log: "",
						type: "replayinitialwaitingdelay",
						uid: this.archive_uuid + 21,
					});
				}
				bLast &&
					this.game &&
					"undefined" != typeof g_replayFrom &&
					this.logs_to_load[t].data.push({
						args: {},
						bIsTableMsg: true,
						lock_uuid: "dummy",
						log: "",
						type: "replay_has_ended",
						uid: this.archive_uuid + 30,
					});
			}
			this.onNotification(this.logs_to_load[t]);
		}
		if ("undefined" != typeof gameui) {
			gameui.log_history_loading_status.loaded =
				parseInt(t) + 1;
			gameui.updateLoaderPercentage();
		}
		setTimeout(
			dojo.hitch(this as GameNotif_Template, "pullResynchronizeLogsToDisplay"),
			0
		);
	}
	/** Internal. Dispatches all queued notifications. */
	dispatchNotifications(): boolean {
		this.waiting_from_notifend, this.queue.length;
		$("logs") && dojo.style("logs", "display", "none");
		for (var t = false, i = false; this.queue.length > 0; ) {
			if (null !== this.waiting_from_notifend) {
				this.waiting_from_notifend;
				dojo.style("logs", "display", "block");
				return i;
			}
			var n = this.queue.shift();
			n.type;
			if (
				n.uid &&
				this.dispatchedNotificationUids.includes(n.uid)
			);
			else {
				t = this.dispatchNotification(n, t);
				i = true;
				if (
					undefined !== this.synchronous_notifs[n.type]
				) {
					$("synchronous_notif_icon") &&
						dojo.style(
							"synchronous_notif_icon",
							"display",
							"inline"
						);
					dojo.style("logs", "display", "block");
					return i;
				}
				"undefined" != typeof gameui &&
					gameui &&
					gameui.onEndOfNotificationDispatch &&
					gameui.onEndOfNotificationDispatch();
				if (
					undefined !== this.bStopAfterOneNotif &&
					this.bStopAfterOneNotif
				)
					break;
			}
		}
		i &&
			this.game &&
			this.game.onNotificationPacketDispatched();
		$("logs") && dojo.style("logs", "display", "block");
		return i;
	}
	/** Internal. Formats and prints the given log message. */
	formatLog(message: string, args: { player_name: string, player_id: BGA.ID, i18n?: string, [key: string]: any }): string {
		var i = "";
		if ("" != message)
			if (this.game) {
				if (undefined !== args) {
					args = this.playerNameFilterGame(args);
					i = this.game.format_string_recursive(message, args);
				}
			} else {
				args = this.playerNameFilter(args);
				i = mainsite.format_string_recursive(message, args);
			}
		return i;
	}
	/**
	 * Internal. Dispatches a single notification.
	 * @returns True if a sound was played.
	 */
	dispatchNotification(notif: BGA.Notif, disableSound?: boolean): boolean {
		this.currentNotifCallback = notif.type;
		if (
			"undefined" != typeof mainsite &&
			mainsite.filterNotification(notif)
		)
			return false;
		if (
			notif.uid &&
			this.dispatchedNotificationUids.includes(notif.uid)
		)
			return false;
		if ($("debug_output")) {
			var n =
				'<div>< <i><a href="#" id="replay_notif_' +
				this.debugnotif_i +
				'">' +
				notif.type +
				'</a></i><br/><div class="notifparams" id="debugnotif_' +
				this.debugnotif_i +
				'">' +
				dojo.toJson(notif.args) +
				"</div></div>";
			dojo.place(n, "debug_output", "first");
			dojo.connect(
				$("replay_notif_" + this.debugnotif_i),
				"onclick",
				this,
				"debugReplayNotif"
			);
			this.debugnotif_i++;
		}
		if (
			this.game &&
			undefined !==
				this.game.players_metadata[
					this.game.player_id
				] &&
			undefined !==
				this.game.players_metadata[this.game.player_id]
					.bl &&
			this.game.players_metadata[this.game.player_id]
				.bl &&
			Math.random() < 0.1
		)
			return false;
		notif.bIsTableMsg &&
			!this.game &&
			"tablechat" != notif.type &&
			"tableInfosChanged" != notif.type &&
			"refuseGameStart" != notif.type &&
			"newRTCMode" != notif.type &&
			(notif.log = "");
		"undefined" != typeof mainsite &&
			"privatechat" == notif.type &&
			"player" == mainsite.chatDetached.type &&
			toint(notif.args.player_id) !=
				toint(mainsite.chatDetached.id) &&
			toint(notif.args.target_id) !=
				toint(mainsite.chatDetached.id) &&
			(notif.log = "");
		if (
			"undefined" != typeof mainsite &&
			mainsite.bUnderage &&
			"chat" == notif.type &&
			"/chat/general" == notif.channelorig
		)
			return false;
		var o =
			!!this.ignoreNotificationChecks[notif.type] &&
			this.ignoreNotificationChecks[notif.type](notif);
		"history_history" == notif.type &&
			(o =
				!!this.ignoreNotificationChecks[
					notif.args.originalType
				] &&
				this.ignoreNotificationChecks[
					notif.args.originalType
				](notif));
		if (undefined !== notif.log && undefined !== notif.args && !o)
			if (
				"" != notif.log ||
				"startWriting" == notif.type ||
				"stopWriting" == notif.type
			) {
				var a = false;
				null !== this.onPlaceLogOnChannel &&
					undefined !== notif.channelorig &&
					(a = this.onPlaceLogOnChannel(dojo.clone(notif)));
				if (!a) {
					var s = notif.args.logaction;
					n = this.formatLog(notif.log, notif.args);
					"undefined" != typeof mainsite &&
						(n = mainsite.makeClickableLinks(
							n,
							true
						));
					if (
						("chatmessage" != notif.type &&
							"wouldlikethink" != notif.type) ||
						null === this.game
					) {
						var r = this.addToLog(
							n,
							notif.args.seemore,
							s,
							null !== this.game,
							"chat" == notif.type ||
								"groupchat" == notif.type ||
								"chatmessage" == notif.type ||
								"tablechat" == notif.type ||
								"privatechat" == notif.type ||
								"startWriting" == notif.type ||
								"stopWriting" == notif.type,
							"history_history" == notif.type ||
								undefined !== notif.loadprevious,
							notif.time
						);
						undefined !== notif.move_id &&
							dojo.publish("addMoveToLog", [
								r,
								notif.move_id,
							]);
					} else this.addToLog(n, notif.args.seemore);
				}
			} else
				(this.log_notification_name, 1) &&
					this.log_notification_name &&
					this.addToLog(
						"<i>(" + notif.type + ")</i>",
						""
					);
		if (undefined !== notif.move_id && $("move_nbr")) {
			if ($("move_nbr").innerHTML != notif.move_id) {
				$("move_nbr").innerHTML = notif.move_id;
				$("images_status_text") &&
					null !== notif.move_id &&
					($("images_status_text").innerHTML =
						_("Move") + " " + notif.move_id);
				this.game && this.game.onNextMove(notif.move_id);
			}
			this.game && this.game.onMove();
			if (
				this.game &&
				1 == this.game.instantaneousMode &&
				"undefined" != typeof g_replayFrom
			)
				if (toint(notif.move_id) >= toint(g_replayFrom)) {
					this.game.instantaneousMode = false;
					dojo.query(".dijitDialog").forEach(dojo.destroy);
					dojo.query(
						".dijitDialogUnderlayWrapper"
					).forEach(dojo.destroy);
					setTimeout(
						dojo.hitch(this, function () {
							this.game.setLoader(100);
						}),
						1500
					);
					this.game.setLoader(100);
				} else {
					var l = Math.floor(
						(100 * toint(notif.move_id)) /
							toint(g_replayFrom)
					);
					this.game.setLoader(l);
				}
		}
		notif.lock_uuid &&
			dojo.publish("lockInterface", [
				{
					status: "dispatched",
					uuid: notif.lock_uuid,
					bIsTableMsg: notif.bIsTableMsg,
				},
			]);
		if (undefined !== this.synchronous_notifs[notif.type]) {
			null !== this.waiting_from_notifend &&
				console.error(
					"Setting a synchronous notification while another one is in progress !"
				);
			notif.uid;
			this.waiting_from_notifend = notif;
			var d = this.synchronous_notifs[notif.type];
			if (d > 0) {
				((this.game &&
					1 == this.game.instantaneousMode) ||
					o) &&
					(d = 1);
				setTimeout("endnotif()", d);
			} else o && setTimeout("endnotif()", 1);
		}
		if (
			"string" == typeof notif.uid &&
			notif.uid &&
			"archivewaitingdelay" != notif.uid.substr(0, 19)
		) {
			g_last_msg_dispatched_uid = notif.uid;
			this.dispatchedNotificationUids.push(notif.uid);
			this.dispatchedNotificationUids.length > 50 &&
				this.dispatchedNotificationUids.shift();
		}
		!o && dojo.publish(notif.type, [notif]);
		undefined === this.synchronous_notifs[notif.type] &&
			notif.lock_uuid &&
			dojo.publish("lockInterface", [
				{
					status: "updated",
					uuid: notif.lock_uuid,
					bIsTableMsg: notif.bIsTableMsg,
				},
			]);
		if (o);
		else if (this.game && 1 == this.game.instantaneousMode);
		else if (
			this.game &&
			undefined !== this.game.bDisableSoundOnMove &&
			this.game.bDisableSoundOnMove
		) {}
		else if (
			"chatmessage" == notif.type ||
			"tablechat" == notif.type ||
			"privatechat" == notif.type ||
			"groupchat" == notif.type
		) {
			var c = 0;
			"undefined" != typeof current_player_id &&
				(c = current_player_id);
			"undefined" != typeof gameui &&
				undefined !== gameui.player_id &&
				(c = gameui.player_id);
			(undefined !== notif.args.text && null === notif.args.text) ||
				(undefined !== notif.args.player_id &&
					notif.args.player_id == c) ||
				playSound("chatmessage");
		} else if (
			!disableSound &&
			null !== this.game &&
			"playerstatus" != notif.type &&
			notif.log
		) {
			disableSound = true;
			"undefined" != typeof gameui &&
			gameui.bDisableNextMoveOnNextSound
				? (gameui.bDisableNextMoveOnNextSound = false)
				: playSound("move");
		}
		if (this.game) {
			this.game.adaptPlayersPanels();
			this.game.adaptStatusBar();
		}
		this.currentNotifCallback = null;
		return disableSound;
	}

	/** Adds the given message to the game chat based on the parameters given. */
	addChatToLog(message: string, seeMore?: boolean, translateIcon?: boolean, extraClasses?: string): void {
		undefined === translateIcon && (translateIcon = true);
		undefined === extraClasses && (extraClasses = "");
		if ($("chatlogs")) {
			var a = this.next_log_id;
			this.next_log_id++;
			var s = "chatlogs",
				r = 15e3;
			if (this.game && this.game.instantaneousMode) {
				r = 0;
				s = "logs";
			}
			var l =
				'<div class="roundedbox roundedboxenlighted log logchat ' +
				extraClasses +
				'" id="log_' +
				a +
				'"><div class="roundedbox_top"><div class="roundedbox_topleft"></div><div class="roundedbox_topmain"></div><div class="roundedbox_topright"></div></div><div class="roundedbox_main"></div><div class="roundedbox_bottom"><div class="roundedbox_bottomleft"></div><div class="roundedbox_bottommain"></div><div class="roundedbox_bottomright"></div></div><div class="roundedboxinner">';
			seeMore &&
				(this.game
					? (l +=
							'<a href="' +
							this.game.metasiteurl +
							"/" +
							seeMore +
							'" target="_blank" class="seemore"><div class="icon16 icon16_seemore"></div></a>')
					: (l +=
							'<a href="' +
							seeMore +
							'" class="seemore"><div class="icon16 icon16_seemore"></div></a>'));
			this.game
				? (l += this.game.addSmileyToText(message))
				: (l += mainsite.addSmileyToText(message));
			translateIcon &&
				(l +=
					'<div class="translate_icon" id="logtr_' +
					a +
					'" title="' +
					_("Translate with Google") +
					'"></div>');
			l += "</div></div>";
			dojo.place(l, s, "first");
			translateIcon &&
				$("logtr_" + a) &&
				dojo.connect(
					$("logtr_" + a),
					"onclick",
					this,
					"onTranslateLog"
				);
			var d = "log_" + a;
			dojo.style(d, "display", "none");
			dojo.fx
				.chain([
					dojo.fx.wipeIn({ node: d }),
					dojo.animateProperty({
						node: $(d),
						delay: 5e3,
						properties: {
							color: { end: "#000000" },
							onEnd(t) {
								dojo.style(t, "display", "block");
							},
						},
					}),
				])
				.play();
			r > 0 &&
				setTimeout(
					dojo.hitch(this, function () {
						var t = dojo.clone($(d));
						dojo.destroy(d);
						dojo.place(t, "logs", "first");
						dojo.style(t, "position", "relative");
						dojo.style(t, "top", "-10px");
						dojo.animateProperty({
							node: t,
							delay: 200,
							properties: {
								top: { end: 0, unit: "px" },
							},
						}).play();
						$("logtr_" + a) &&
							dojo.connect(
								$("logtr_" + a),
								"onclick",
								this,
								"onTranslateLog"
							);
					}),
					r
				);
		}
	}

	/** Internal. Translates the inner html of the target element for the event. This opens a new window on google translate with the source text? */
	onTranslateLog(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		var t = event.currentTarget.parentElement,
			i = t.innerHTML;
		i = (i = (i = (i = (i = (i = i.replace(
			/<!--PNS.*--PNE-->/gi,
			""
		)).replace(/<b><a.*a><\/b> /gi, "")).replace(
			/<a href.*<br>/gi,
			""
		)).replace(/<span.*span> /gi, "")).replace(
			/<div.*div>/gi,
			""
		)).replace(/&nbsp;/gi, " ");
		var n = encodeURIComponent(i),
			o = dojoConfig.locale;
		switch (o) {
			case "zh":
				o = "zh-TW";
				break;
			case "zh-cn":
				o = "zh-CN";
				break;
			case "he":
				o = "iw";
		}
		var a = "translateChat",
			s = n;
		s += " " + n.length;
		s += " " + o;
		if (this.game) {
			s =
				"[P" +
				this.game.player_id +
				"@T" +
				this.game.table_id +
				"] " +
				s;
			this.game.ajaxcall(
				`/web/scriptlogger/${a}.html`,
				{ log: s, lock: false },
				this,
				function (e) {},
				function (e) {},
				"post"
			);
		} else {
			var r = t.parentElement.parentElement.id,
				l = r.split("_")[2],
				d = r.split("_")[3];
			"privatechat" != l &&
				"table" != l &&
				(l = "generalchat");
			s =
				"[P" +
				current_player_id +
				"@" +
				("table" == l ? "T" + d : l) +
				"] " +
				s;
			mainsite.ajaxcall(
				`/web/scriptlogger/${a}.html`,
				{ log: s, lock: false },
				this,
				function (e) {},
				function (e) {
					e || mainsite;
				},
				"post"
			);
		}
		window.open(
			"http://translate.google.com/#auto/" + o + "/" + n
		);
	}

	/** Adds the given message to the game log based on the parameters given. */
	addToLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): number {
		undefined === isSpectator && (isSpectator = false);
		undefined === instantaneous && (instantaneous = false);
		var l = "";
		isSpectator && (l = "spectator_chat");
		if ($("logs")) {
			var d = this.next_log_id;
			this.next_log_id++;
			var c =
				'<div class="log ' +
				l +
				'" id="log_' +
				d +
				'"><div class="roundedbox">';
			seeMore &&
				(this.game
					? (c +=
							'<a href="' +
							this.game.metasiteurl +
							"/" +
							seeMore +
							'" target="_blank" class="seemore"><div class="icon16 icon16_seemore"></div></a>')
					: (c +=
							'<a href="' +
							seeMore +
							'" class="seemore"><div class="icon16 icon16_seemore"></div></a>'));
			isSpectator && "undefined" != typeof mainsite
				? (c += mainsite.addSmileyToText(message))
				: isSpectator && this.game
				? (c += this.game.addSmileyToText(message))
				: (c += message);
			isSpectator &&
				(translateIcon ||
					(c +=
						'<div class="translate_icon ' +
						(seeMore ? "translate_icon_seemore" : "") +
						'" id="logtr_' +
						d +
						'" title="' +
						_("Translate with Google") +
						'"></div>'));
			if (null == this.game && notif) {
				c +=
					'<div class="logaction"><a href="#" id="logaction_' +
					d +
					'">[' +
					(message = this.formatLog(notif.log, notif.args)) +
					"]</a></div>";
			}
			c += "</div>";
			if (undefined !== timestamp) {
				var h = this.lastMsgTime,
					u = timestamp;
				if (Math.floor(h / 60) != Math.floor(u / 60)) {
					var p = new Date(1e3 * h),
						m = new Date(1e3 * u);
					if (
						p.toLocaleDateString() !=
						m.toLocaleDateString()
					)
						var g =
							m.toLocaleDateString() +
							" " +
							m.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							});
					else
						g = m.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						});
					c +=
						'<div class="timestamp">' +
						g +
						"</div>";
					this.lastMsgTime = u;
				}
			}
			c += "</div>";
			dojo.place(c, "logs", "first");
			translateIcon ||
				($("logtr_" + d) &&
					dojo.connect(
						$("logtr_" + d),
						"onclick",
						this,
						"onTranslateLog"
					));
			null == this.game &&
				notif &&
				$("logaction_" + d) &&
				dojo.connect(
					$("logaction_" + d),
					"onclick",
					this,
					function (t) {
						dojo.stopEvent(t);
						notif.action_analytics &&
							analyticsPush(notif.action_analytics);
						mainsite.ajaxcall(
							notif.action,
							notif.action_arg,
							this,
							function () {}
						);
					}
				);
			var f = "log_" + d;
			dojo.style(f, "display", "none");
			if (instantaneous) {
				dojo.style(f, "color", "black");
				dojo.style(f, "display", "block");
			} else
				dojo.fx
					.chain([
						dojo.fx.wipeIn({ node: f }),
						dojo.animateProperty({
							node: $(f),
							delay: 5e3,
							properties: {
								color: { end: "#000000" },
								onEnd(t) {
									dojo.style(
										t,
										"display",
										"block"
									);
								},
							},
						}),
					])
					.play();
		} else if (null !== this.onPlaceLogOnChannel) {
			var v = {
				channelorig: "/chat/general",
				args: {},
				log: message,
				type: "service",
				time: Math.min(new Date().getTime() / 1e3),
			};
			bNotifSend = this.onPlaceLogOnChannel(v);
		}
		return d;
	}

	/** Changed the player name to an HTML string with a link to the player account, and red style if the player is an admin. */
	playerNameFilter(args: { player_name?: string, player_id?: BGA.ID, is_admin?: boolean; }): typeof args {
		if (args.player_name && args.player_id) {
			var t = "";
			args.is_admin && (t = ' style="color: red;"');
			args.player_name =
				'<b><a href="/player?id=' +
				args.player_id +
				'" class="playername"' +
				t +
				">" +
				args.player_name +
				"</a></b>";
		}
		return args;
	}

	/** Changes the properties on this object to strings tha tare formatted to match the player color. */
	playerNameFilterGame(args: undefined): void
	// @ts-ignore
	playerNameFilterGame<T extends Record<string, any>>(args: T): T
	{
		if (undefined !== args) {
			if (this.game)
				for (argname in args)
					if (
						"i18n" != argname &&
						"object" == typeof args[argname]
					)
						null !== args[argname] &&
							undefined !== args[argname].log &&
							undefined !== args[argname].args &&
							(args[argname].args =
								this.playerNameFilterGame(
									args[argname].args
								));
					else if (
						argname.match(/^player_name(\d+)?$/)
					) {
						var t = "",
							i = "";
						for (var n in this.game.gamedatas
							.players)
							if (
								this.game.gamedatas.players[n]
									.name == args[argname]
							) {
								t =
									this.game.gamedatas.players[
										n
									].color;
								i = "";
								this.game.gamedatas.players[n]
									.color_back &&
									(i =
										"background-color:#" +
										this.game.gamedatas
											.players[n]
											.color_back +
										";");
								break;
							}
						args[argname] =
							"" != t
								? '\x3c!--PNS--\x3e<span class="playername" style="color:#' +
									t +
									";" +
									i +
									'">' +
									args[argname] +
									"</span>\x3c!--PNE--\x3e"
								: '\x3c!--PNS--\x3e<span class="playername">' +
									args[argname] +
									"</span>\x3c!--PNE--\x3e";
					}
			return args;
		}
	}

	/** Internal. Check if there is a notification currently being processed. This is the same as {@link waiting_from_notifend} !== null. */
	isSynchronousNotifProcessed(): boolean {
		return null !== this.waiting_from_notifend;
	}

	/** Internal. Callback for the internal timeout when the {@link waiting_from_notifend} has finished (the time has elapsed). This dispatches the next notification if needed. */
	onSynchronousNotificationEnd(): void {
		if (null !== this.waiting_from_notifend) {
			this.waiting_from_notifend.uid;
			this.waiting_from_notifend.lock_uuid &&
				dojo.publish("lockInterface", [
					{
						status: "updated",
						uuid: this.waiting_from_notifend
							.lock_uuid,
						bIsTableMsg:
							this.waiting_from_notifend
								.bIsTableMsg,
					},
				]);
			$("synchronous_notif_icon") &&
				dojo.style(
					"synchronous_notif_icon",
					"display",
					"none"
				);
			this.waiting_from_notifend = null;
			"undefined" != typeof gameui &&
				gameui &&
				gameui.onEndOfNotificationDispatch &&
				gameui.onEndOfNotificationDispatch();
			(undefined !== this.bStopAfterOneNotif &&
				this.bStopAfterOneNotif) ||
				this.dispatchNotifications();
		} else
			console.error(
				"Received a notifEnd message while not waiting for a notification !!"
			);
	}

	/** Internal. A callback for replaying the game from a specific state (based on the id of the target element). */
	debugReplayNotif(event: Event): void {
		event.preventDefault();
		var i = event.currentTarget.id.substr(13),
			n = {};
		n.type = $("replay_notif_" + i).innerHTML;
		var o = $("debugnotif_" + i).innerHTML;
		n.args = dojo.fromJson(o);
		this.dispatchNotification(n, false);
	}

	//#endregion
}

let GameNotif = declare("ebg.gamenotif", GameNotif_Template);
export = GameNotif;

declare global {
	namespace BGA {
		type GameNotif = typeof GameNotif;
		interface EBG { gamenotif: GameNotif; }
	}
	var ebg: BGA.EBG;
}