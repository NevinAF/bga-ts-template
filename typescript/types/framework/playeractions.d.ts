declare global {
	/**
	 * An interface type that represents all possible player actions. This is only used as a type for internal validation, ensuring the all player action string literal names and arguments are typed correctly.
	 * 
	 * All entries should follow the format as follows: `[action: string]: object;`. This format is omitted so coding intellisense can restrict parameters/types. At runtime, this may not accurately represent the possible actions for a player depending on if this matches the state machine (states.inc.php).
	 * 
	 * Any player actions can be added by expanding (not extending) this interface.
	 * @example
	 * // Example from the Hearts Tutorial.
	 * interface GameStateArgs {
	 * 	'giveCards': { cards: number[] };
	 * 	'playCard': { id: number };
	 * }
	 */
	interface PlayerActions {
	}
}

export {};