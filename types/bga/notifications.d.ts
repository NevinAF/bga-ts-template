/**
 * An interface type that represents all possible notification types. This is only used as a type for internal validation, ensuring the all notification string literal names and arguments are typed correctly.
 * 
 * All entries should follow the format as follows: `[name: string]: object | null;`. For notifications without arguments, use null and not an empty object. This format is omitted so coding intellisense can restrict parameters/types. At runtime, this may not accurately represent all possible notifications depending on if this matches the notify functions used with server code (<yourgame>.game.php).
 * 
 * Any notifications types can be added by expanding (not extending) this interface.
 * @example
 * interface NotifTypes {
 * 	'newHand': { cards: Card[] };
 * 	'playCard': { player_id: number, color: number, value: number, card_id: number };
 * 	'trickWin': { };
 * 	'giveAllCardsToPlayer': { player_id: number };
 * 	'newScores': { newScores: { [player_id: number]: number } };
 * }
 */
interface NotifTypes { }

/**
 * The type representing a notification where the generic type `T` represents the type of the arguments of the notification.
 * 
 * The generic argument is not a keyof NotifTypes (name of) so that one function can handle multiple notifications when the arguments are the same. You can also use the union/intersection operator to use one function for multiple notifications regardless of the arguments.
 */
interface Notif<T extends NotifTypes[keyof NotifTypes]> {
	/** The type of the notification (as passed by php function). */
	type: keyof NotifTypes;
	/** The arguments passed from the server for this notification. This type should always match the notif.type. */
	args: T extends AtLeastOne<T> ? T : null;
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
	h: any;

	/** Unknown as well. */
	lock_uuid: string;

	/** Unknown. Probably something to do with synchronizing notifications. */
	synchro: number;

	/** ID of the move associated with the notification. */
	move_id?: string;
	/** ID of the table (comes as string). */
	table_id?: string;
}

/** A Notif type without generic arguments, used to represent any notification type, where the args is an intersection of all possible args. */
type AnyNotif = AnyOf<Notif<NotifTypes[keyof NotifTypes]>>;