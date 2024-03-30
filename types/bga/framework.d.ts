/**
 * An interface representing the base structure of a deck item (usually a card). This matches the structure of the php component `deck` and the `deck` table in the database. Note that all properties will be passed as string from the server but JS is able to automatically convert to the correct type without needing to parse the integer values.
 * @see {@link https://en.doc.boardgamearena.com/Deck | PHP Deck Component} for more information.
 */
interface DeckItem {
	/** The unique identifier of the deck item. int(10) unsigned NOT NULL, primary key. */
	id: number;
	/** The type of the deck item. The meaning of this is game specific, however, 'deck' is always where the cards are created, and 'hand' is always where card go when drawn, and 'discard' is used for `autoreshuffle`. varchar(16) NOT NULL. */
	location: string;
	/** The location of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
	location_arg: number;
	/** The type of the deck item. The meaning of this is game specific. varchar(16) NOT NULL. */
	type: string;
	/** The type argument of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
	type_arg: number;
}

/** Partial: This has been partially typed based on a subset of the BGA source code. */
interface PlayerMetadata {
	is_premium: boolean;
	/** 0 = Female, 1 == Male, other = neutral. */
	gender: '0' | '1' | 'other';
	is_beginner: boolean;
	languages: Record<string, LanguageMetadata>;
	user_id: number;
	karma: number;
	country_infos: {
		code: string;
		name: string;
	};
	city: string;
}

/** Partial: This has been partially typed based on a subset of the BGA source code. */
interface LanguageMetadata {
	level: 0 | 1;
}

/** Partial: This has been partially typed based on a subset of the BGA source code. */
interface ChatNotifArgs {
	/** The text for this chat message. This is null if the chat message type does not log an actual message (like 'startWriting'). */
	text: string | null;
	player_id: number;
	player_name?: string;

	/** Populated after receiving notif, represents the unique identifier for this message, used for linking html events and getting message elements. */
	id?: number;
	/** Populated after receiving notif, represents the html version of text? */
	message?: string;
	/** Populated after receiving notif, represents if message has been read. */
	mread?: boolean | null;
}

/** Partial: This has been partially typed based on a subset of the BGA source code. */
interface ChatWindowMetadata {
	status: '';
	title: string;
	input: ChatInput;
	subscription: null;
	notifymethod: 'nurmal';
	autoShowOnKeyPress: boolean;
	lastMsgTime: number;
	lastMsgAuthor: number;
	is_writing_now: {};
}