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