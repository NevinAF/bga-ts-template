declare namespace BGA {
	type CounterNames = string;

	

	/**
	 * An interface type that represents all possible game states. This is only used as a type for internal validation, ensuring the all string literal state names, numeric state IDs, and state arguments are typed correctly.
	 * 
	 * All entries should follow the format as follows: `[id: number]: string | { name: string, args: object};`. All entries in the form `id: name` will be inferred as `id: { name: name, args: {} }`. This format is omitted so coding intellisense can restrict parameters/types. At runtime, this may not accurately represent the game state id/name depending on if this matches the state machine (states.inc.php). Note that you can include any additional properties (usually as string literals) without any ts issues as long as the format is omitted or updated correctly.
	 * 
	 * 1: 'gameSetup'; and 99: 'gameEnd'; are already defined in the framework, and should not be modified as stated in the states.inc.php file. Any custom game states can be added by expanding (not extending) this interface.
	 * 
	 * There are a handful of helper types that are used to pull the types from this interface. They are: {@link GameStateName}, {@link AnyGameStateArgs}, {@link GameStateNameById}, {@link GameStateArgs}.
	 * 
	 * @example
	 * // Example from the Hearts Tutorial.
	 * interface GameState {
	 * 	2: 'newHand';
	 * 	21: 'giveCards';
	 * 	22: 'takeCards';
	 * 	30: 'newTrick';
	 * 	31: 'playerTurn';
	 * 	32: 'nextPlayer';
	 * 	40: 'endHand';
	 * }
	 * @example
	 * // Example from Reversi Tutorial
	 * interface GameState {
	 * 	10: { name: 'playerTurn', args: {
	 * 		possibleMoves: {
	 * 			[x: number]: {
	 * 				[y: number]: boolean;
	 * 			};
	 * 		}
	 * 	} };
	 * 	11: 'nextPlayer';
	 * }
	 */
	type GameStates = ValidateGameStates<{
		// [id: BGA.ID]: GameState_Interface;
		"1": {
			"name": "gameSetup",
			"description": "",
			"type": "manager",
			"action": "stGameSetup",
			"transitions": { "": number }
		};
		"99": {
			"name": "gameEnd",
			"description": "End of game",
			"type": "manager",
			"action": "stGameEnd",
			"args": "argGameEnd"
		};
	}>;

	interface GameStateArgs {
		[funcName: string]: any;
		"argGameEnd": {
			result: Record<BGA.ID, {
				rank: BGA.ID;
				name: string;
				score: BGA.ID;
				score_aux: BGA.ID;
				color: HexString;
				color_back: HexString;
				player: BGA.ID;
			}>;
		};
	}

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
	interface GameStatePossibleActions {
		[action: string]: any;
	}

	interface Gamedatas extends Record<string, any> {}
}