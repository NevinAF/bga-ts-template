// @ts-nocheck
/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * ___YourGameName___ implementation : © ___developers___
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
declare namespace BGA {

	/** Goto {@link Gamedatas} or hover name for info. */
	interface Gamedatas extends Record<string, any> {}

	/** Goto {@link NotifTypes} or hover name for info. */
	interface NotifTypes {
		[name: string]: any; // RECOMMENDED: comment out this line to type notifications specific to it's name using BGA.Notif<"name">.
	}

	/** Goto {@link GameSpecificIdentifiers} or hover name for info. */
	interface GameSpecificIdentifiers {
		// CounterNames: 'foo' | 'bar' | 'bread' | 'butter';
	}

// #region !gamestates.jsonc!
// The following interfaces are automatically generated when using the 'gamestates.jsonc' option is enabled (or file exists). Consider enabling this to ensure that server-side and client-side states are equal.

	/** Goto {@link DefinedGameStates} or hover name for info. */
	interface DefinedGameStates extends ValidateGameStates<{
		[id: BGA.ID]: IDefinedGameState; // RECOMMENDED: comment out this line for specific typing on gamestates.
		"1": {
			"name": "gameSetup",
			"description": "",
			"type": "manager",
			"action": "stGameSetup",
			"transitions": { "": BGA.ID }
		};
		"99": {
			"name": "gameEnd",
			"description": "End of game",
			"type": "manager",
			"action": "stGameEnd",
			"args": "argGameEnd"
		};
	}> {}

	/** Goto {@link GameStateArgs} or hover name for info. */
	interface GameStateArgs {
		[funcName: string]: any; // RECOMMENDED: comment out this line to type gamestate args specific to the gamestate.
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

	/** Goto {@link GameStatePossibleActions} or hover name for info. */
	interface GameStatePossibleActions {
		[action: string]: any; // RECOMMENDED: comment out this line to type ajax calls for specific action names.
	}

// #endregion !gamestates.jsonc!
}