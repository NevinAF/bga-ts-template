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
	"gameStateChange": { id?: keyof GameStates };
	"gameStateChangePrivateArg": AnyGameStateArgs;
	"gameStateMultipleActiveUpdate": number[];
	"newActivePlayer": number;
	"playerstatus": { player_id: number, status: 'online' | 'offline' | 'inactive' };
	"yourturnack": { player: number };
	"clockalert": null;
	/** Sent to update a player's zombie or eliminated status. */
	"tableInfosChanged": { reload_reason: 'playerQuitGame' | 'playerElimination', who_quits: number };
	/** Sent whenever a player is eliminated. This calls the {@link Gamequi.showEliminated}. */
	"playerEliminated": { who_quits: number };
	"tableDecision": { decision_type: 'none' | 'abandon' | 'switch_tb', decision_taken: boolean, decision_refused: boolean, players: Record<number, string> };
	/** Logs the 'log' of the notifications, substituting any args in the log. */
	"infomsg": Record<keyof any, string>;
	"archivewaitingdelay": null;
	"end_archivewaitingdelay": null;
	"replaywaitingdelay": null;
	"end_replaywaitingdelay": null;
	"replayinitialwaitingdelay": null;
	"end_replayinitialwaitingdelay": null;
	/** Normally a noop function, used with {@link GameNotif.setSynchronous} to automatically create a 'delay' notification. */
	"aiPlayerWaitingDelay": null;
	"replay_has_ended": null;
	"updateSpectatorList": Record<number, string>;
	/** Creates a {@link PopInDialog} with the given parameters. */
	"tableWindow": { id: string, title: string, table: Record<string, Record<string, Record<keyof any, any> | string>>, header?: string, footer?: string, closing?: string; };
	/** Sets {@link Gamegui.lastWouldLikeThinkBlinking}, kicking off the blinking animation. */
	"wouldlikethink": null;
	"updateReflexionTime": { player_id: number, delta: number, max: number };
	/** Only affects {@link g_archive_mode}. */
	"undoRestorePoint": null;
	"resetInterfaceWithAllDatas": Record<string, PlayerMetadata>;
	"zombieModeFail": null;
	"zombieModeFailWarning": null;
	"aiError": { error: string };
	"skipTurnOfPlayer": { player_id: number, zombie: boolean };
	"zombieBack": { player_id: number };
	"allPlayersAreZombie": null;
	"gameResultNeutralized": { progression: number, player_id: number };
	"playerConcedeGame": { player_name: string } & Record<keyof any, any>;
	"showTutorial": { delay?: number };
	"showCursor": { player_id: number, path: Record<keyof any, { id: string, x: number, y: number }> };
	"showCursorClick": { player_id: number, path: Record<keyof any, { id: string, x: number, y: number }> };
	"skipTurnOfPlayerWarning": { player_id: number, delay: number };
	"simplePause": { time: number };
	"banFromTable": { from: number };
	"resultsAvailable": null;
	"switchToTurnbased": null;
	/** All other args on this object are later copied from {@link CurrentStateArgs} */
	"newPrivateState": { id?: keyof GameStates };

	"chat": ChatNotifArgs;
	"groupchat": ChatNotifArgs & { gamesession?: string; gamesessionadmin?: string, group_id: number };
	"chatmessage": ChatNotifArgs;
	"tablechat": ChatNotifArgs;
	"privatechat": ChatNotifArgs & { target_id: number };
	"stopWriting": ChatNotifArgs;
	"startWriting": ChatNotifArgs;
	"newRTCMode": { rtc_mode: number, player_id: number, target_id: number, room_creator: number, table_id: number, mread?: boolean | null };
	"history_history": { is_new?: boolean, mread?: boolean | null };
}

/**
 * A loosely typed structure that represents all possible arguments for a notification. This is an intersection of all possible arguments, which prevents the need to cast the args to a specific type. Use {@link NotifAs} or {@link NotifFrom} to represent a specific notification type(s).
 * 
 * Because this is one big intersection, it can suffer from a {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#intersections-reduced-by-discriminant-properties | intersections reduced by discriminant properties} issue. If this is the case, you should either change argument properties so they don't share names with differing types (T1 & T2 == never), or add them here as an omitted type, and manually intersect like with 'id' below.
 */
type AnyNotifArgs = AnyOf<Omit<NotifTypes[keyof NotifTypes], 'id'>> & { id: number | string };

/** A loosely typed structure that represents the data of a network message. This is used to represent any notification type, where the args is an intersection of all possible args. */
interface Notif
{
	/** The type of the notification (as passed by php function). */
	type: keyof NotifTypes;
	/** The arguments passed from the server for this notification. This type should always match the notif.type. */
	args: AnyNotifArgs | null;
	/** The message string passed from php notification. */
	log: string;
	/** True when NotifyAllPlayers method is used (false otherwise), i.e. if all player are receiving this notification. */
	bIsTableMsg: boolean;
	/** Information about table ID (formatted as : "/table/t[TABLE_NUMBER]" or "/player/p[PLAYER_ID]"). */
	channelorig: string;
	/** Name of the game. */
	gamenameorig: string;
	/** UNIX GMT timestamp. */
	time: number;
	/** Unique identifier of the notification in hex */
	uid: string;
	/** Unknown in hex. */
	h: string;

	/** Unknown as well. */
	lock_uuid: string;

	/** Unknown. Probably something to do with synchronizing notifications. */
	synchro: number;

	/** ID of the move associated with the notification, if any. */
	move_id?: string;
	/** ID of the table (comes as string), if any. */
	table_id?: string;
}

/**
 * A typed Notif. This is used to represent a subset of notifications that match the arguments of any of the given notification names or argument types.
 * 
 * This differs from {@link Notif} because it has strict typing on which args are available based on the generic parameter.
 * This differs from {@link NotifAs} because it represent any notification that matches the arguments, rather than specific notification types.
 * @example
 * interface NotifTypes {
 * 	ex0: { card: number };
 * 	ex1: { card: number, color: number };
 * 	ex2: { message: string };
 * }
 * 
 * // Notif examples where .args = { card: number } and .type = 'ex0' | 'ex1'
 * type CardNotif = Notif<{ card: number }>;
 * type CardNotif = Notif<'ex0'>;
 * 
 * // Notif example where .args = { message: string } and .type = 'ex2'
 * type MessageNotif = Notif<'ex2'>;
 * type MessageNotif = Notif<{ message: string }>;
 * 
 * // Notif example where .args = { card: number, color: number } and .type = 'ex1'
 * type Card2Notif = Notif<'ex1'>;
 * 
 * // Notif example where .args = { color: number } and .type = 'ex1'
 * type CardColorNotif = Notif<{ color: number }>;
 * 
 * // Notif example where .args = { } and .type = 'ex0', 'ex1', or 'ex2'
 * type JoinNotif = Notif<{ card: number } | 'ex2'>;
 */
type NotifFrom<T extends NotifTypes[NotNullableKeys<NotifTypes>] | keyof NotifTypes> = (
	T extends null ? { type: NullableKeys<NotifTypes>, args: null } :
	T extends NotNullableKeys<NotifTypes> ? { type: KeysWithType<ExcludeNull<NotifTypes>, NotifTypes[T]>, args: NotifTypes[T] } :
	T extends keyof NotifTypes ? { type: NullableKeys<NotifTypes>, args: null } :
	{ type: KeysWithType<ExcludeNull<NotifTypes>, T>, args: T }
) & Omit<Notif, 'args' | 'type'>;

/**
 * A typed Notif. This is used to represent a set of specific notification types.
 * 
 * This differs from {@link Notif} because it has strict typing on which args are available based on the generic parameter.
 * This differs from {@link NotifFrom} because it represent a specific notification type, rather than any notification that matches the arguments of given types.
 * @example
 * interface NotifTypes {
 * 	ex0: { card: number };
 * 	ex1: { card: number, color: number };
 * 	ex2: { message: string };
 * }
 * 
 * // Notif example where .args = { card: number } and .type = 'ex0'
 * type CardNotif = NotifAs<'ex0'>;
 * 
 * // Notif example where .args = { card: number, color: number } and .type = 'ex1'
 * type Card2Notif = NotifAs<'ex1'>;
 * 
 * // Notif example where .args = { message: string } and .type = 'ex2'
 * type MessageNotif = NotifAs<'ex2'>;
 * 
 * // Notif examples where .args = { card: number } and .type = never
 * type CardNotif = NotifAs<'ex0' | 'ex1'>;
 * 
 * // Notif examples where .args = { card: number, color: number } and .type = 'ex0' | 'ex1'
 * type CardNotif = NotifAs<'ex0'> & NotifAs<'ex1'>;
 */
type NotifAs<T extends keyof NotifTypes> = {
	type: AnyOf<T>;
	args: NotifTypes[T];
} & Omit<Notif, 'args' | 'type'>;

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
	channel: `/${'table' | 'player' | 'chat' | 'general' | 'group'}/${string}`;

	/** The unique id of the move that these notifications represent. Note that when receiving a new notifs packet, this is immediately copied to each notif entry in {@link data}. */
	move_id?: string;
	/** The unique id of the table that these notifications represent. Note that when receiving a new notifs packet, this is immediately copied to each notif entry in {@link data}. */
	table_id?: string;
}
