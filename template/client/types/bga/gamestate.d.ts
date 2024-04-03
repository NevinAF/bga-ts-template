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
 * 	};
 * 	11: 'nextPlayer';
 * }
 */
interface GameStates {
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
interface PlayerActions {
}

/**
 * The base data structure for a game state.
 */
interface GameState {
	/** The server side function that should be run when entering this state. If the state `type` is game, this is the only function called before waiting for the next state to be started. */
	action: string;
	/** The description that is automatically set on the title banner at the top of the board game area. This message is displayed for all used except active players when `descriptionmytrun` is defined. */
	description: string;
	/** The description that is automatically set on the title banner at the top of the board game area when this client is an active player. */
	descriptionmyturn?: string;
	/** The name of this game state. */
	name: GameStateName;
	/** The list of possible actions that the active player clients can call using the ajax method. See {@link Gamegui.ajaxcall} and {@link Gamegui.checkAction}. */
	possibleactions?: (keyof PlayerActions)[];
	/** The transitions that can be made from the current state. The action key in this dictionary is purely server side and is used of clarity. The name signifies the type of action/transition that should be made which pairs with the less readable ID of the target game state. */
	transitions?: { [action: string]: keyof GameStates };
	/** The type of game state. See {@link GameStateType} for more information on game state types. */
	type: GameStateType;
}

/**
 * The type of game state, which determines where the game evaluates the state:
 * - `activeplayer`: 1 player is active and must play. Server will run its `action` to initialize the state and wait for an ajax action call from the client of the active player.
 * - `multipleactiveplayer`: 1..N players can be active and must play. Server will run its `action` to initialize the state and wait for an ajax action call from the client of any of the active players. Usually, this is meant to wait for all player to send a response before moving to the next state, but this is not enforced by the server.
 * - `private`: during multiactive states players can independently move to different private parallel states. Server will run its `action` to initialize the state and wait for an ajax action call from the client of the specific active player.
 * - `game`: No player is active. The this is a server state for running game logic, usually called after every different kind of action to resolve any game events and/or setup the next input action.
 * - `managed`: This is specific to state 1 (gameSetup) and 99 (gameEnd). These states have actions defined by the framework and should not be changed in any way.
 */
type GameStateType = 'activeplayer' | 'multipleactiveplayer' | 'private' | 'game' | 'managed';

/**
 * The data structure for the current game state. This contains the base data from {@link GameState} and additional data that is passed to the client whenever the state changes.
 */
type CurrentStateArgs = GameState & {
	/** Id of the current state. The type of args will always match the type of `GameStateArgs<id>` */
	id: keyof GameStates;
	/** The id of the single active player for an activeplayer state. If this `type` is not activeplayer, this value will be 0 */
	active_player: number | 0;
	/** The arguments that were passed for this current state. This type will always match the type of `GameStateArgs<id>` and be null if the states.inc.php does not define an args function for this state. */
	args: AnyGameStateArgs | null;
	/** When the state is a multipleactiveplayer state, this will be an array of player ids that are active. */
	multiactive: number[];
	/** The timers foreach player in the game. This include the `initial` time in ms, the `initial_ts` timestamp in UNIX format, and the `total` time in ms. */
	reflexion: {
		initial: { [playerId: number]: number };
		initial_ts: { [playerId: number]: number };
		total: { [playerId: number]: number };
	}
	/** The estimated progress that this game has made to being complete. This value is only ever updated when the states.inc.php file enables the updateGameProgression flag. */
	updateGameProgression: number;
}

/**
 * The game data structure that is passed to the client when the page is first loaded, and partially update when new game states are entered. All properties that are not game specific are originally populated by the framework. All other properties, are populated by the game specific code in the `.game.php` file, under the Table::getAllDatas method.
 * 
 * All entries are in the form `[key: string | number]: object;` and custom properties can be added by expanding (not extending) this interface.
 * @example
 * // Example from the Reversi Tutorial
 * interface Gamedatas {
 * 	board: { x: number, y: number, player: number }[];
 * }
 */
interface Gamedatas {
	/** Not documented. */
	decision: {
		/** Not documented. */
		decision_type: string | 'none'
	};
	/** Not documented. Likely has something to do with players leaving the game, thus making the game results neutralized. The may be a boolean. */
	game_result_neutralized: string | '0';
	/** The current game state data. This is the same data that is passed to the `onEnteringState` method. */
	gamestate: CurrentStateArgs;

	/**
	 * A dictionary of all game states defined in the states.inc.php file. This should be the same as {@link GameStates} but possibly contain additional information based on what was included in the game specific interface. 
	 */
	gamestates: { [K in keyof GameStates]: GameState & {
		/** See {@link GameState.name}. */
		name: GameStateNameById<K>,
		/** The server side function used to generate the arguments for this state. If undefined, this state will always pass 'null' for the arguments, unless it is a client state. */
		args?: string,
		/** If defined and true, this state will call the server side `getGameProgression` progression and update the `CurrentStateArgs` with this value. */
		updateGameProgression?: boolean
	} };
	/** Not documented. Possibly something to do with players leaving the game. This looks to be a global php variable stored in the database. */
	neutralized_player_id: number | '0';
	/** The notification pointers used for evaluating notifications. */
	notifications: { last_packet_id: number, move_nbr: number };
	/** An ordered array of player ids which signify the current player order. */
	playerorder: number[];
	/** A dictionary of all player information. See {@link Player} for more information. */
	players: { [playerId: number]: Player };
	/** Not documented. */
	tablespeed: number;

	/** The custom counters that are currently added to the game in the html by using the following format:
	 * ```html
	 * <div class="counter" id="bread"></div>
	 * <div class="counter" id="coin"></div>
	 * ```
	 * The keys of this record are the id of the element, and the value is the current state of the counter.
	  */
	counters: Record<string, { counter_value: number, counter_name: string }>;
}

/**
 * The interface for a player in a game. This is always stored in the {@link Gamedatas.players} object.
 */
interface Player {
	/** Not documented. */
	ack: string | 'ack';
	/** Not documented. */
	avatar: string | '000000';
	/** Not documented. This could represent a beginner to BGA or the game, and unsure how this is calculated. */
	beginner: boolean;
	/** The color of the player as defined in `gameinfos.inc.php` assigned by the `.game.php` file. This should always be a hex string in RGB format: `RRGGBB`. */
	color: string;
	/** Not documented. This should always be a hex string in RGB format: `RRGGBB`. */
	color_back: any | null;
	/** Not documented. */
	eliminated: number;
	/** The unique identifier for the player. */
	id: number;
	/** Not documented. Presumably represents if the player is a bot. This is likely a boolean. */
	is_ai: number;
	/** The username of the player. */
	name: string;
	/** This players current score. This is the score updated by game specific code in the `.game.php` file */
	score: number;
	/** Not documented. Presumably represents if the player has disconnected and has begun taking 'zombie' actions. This is likely a boolean. */
	zombie: number;
}

//
// Helper Types which select/extract types from the GameStates interface
//

/**
 * A helper type that must match one the of defined state names on the {@link GameStates} type.
 * @example
 * // This function can only accept state names that are defined in the GameStates type, like 'gameSetup' and 'gameEnd'. It will throw an error otherwise.
 * function doSomething(state: GameStateName) { ... }
 */
type GameStateName = {
	[K in keyof GameStates]:
		GameStates[K] extends string ? GameStates[K] :
		GameStates[K] extends { name: string } ? GameStates[K]['name'] :
		never;
}[keyof GameStates];

/**
 * A helper type which is the intersection of all game state arguments. This is used to avoid a mandatory cast and maintains much better type safety then using the 'any' type.
 * 
 * This type is intend {@link Gamegui.onEnteringState} and {@link Gamegui.onUpdateActionButtons} which cannot infer the arg types from the state name when preforming checks. That is, typescript isn't able to type the object based on the state name. Because of this, a cast would be required on a standard union type (type that matches only one or the args which is always an empty object, {}).
 * 
 * Note that any game state that is in the form number:string will have an empty object, {}, as the argument.
 * @example
 * // Because this is an intersection type, we can pull any of the possible args without a cast:
 * override onEnteringState(stateName: GameStateName, args?: { args: AnyGameStateArgs }): void
 * {
 * 	switch( stateName )
 * 	{
 * 		// Without any casting
 * 		case 'playerTurn':
 * 			this.updatePossibleMoves( args.args.possibleMoves );
 * 			break;
 * 		// With casting for type safety.
 * 		// This ensures that only the properties defined for this state are accessible.
 * 		case 'newHand':
 * 			const newHandArgs = args.args as GameStateArgs<'newHand'>;
 * 			this.onNewHand( newHandArgs.cards );
 * 			break;
 * 	...
 * 	}
 * }
 */
type AnyGameStateArgs = AnyOf<{
	[K in keyof GameStates]:
		GameStates[K] extends { argsType: infer T } ? T :
		GameStates[K] extends string ? {} :
		never;
}[keyof GameStates]>;

/**
 * A helper type for getting the string literal from a game state id. Generally not useful for game specific code.
 */
type GameStateNameById<K extends keyof GameStates> =
	GameStates[K] extends string ? GameStates[K] :
	GameStates[K] extends { name: string } ? GameStates[K]['name'] :
	never;

/**
 * A helper type for getting the argument types for a game state, usually used for casting the args in {@link Gamegui.onEnteringState} and {@link Gamegui.onUpdateActionButtons}. The generic parameter can be either a state name or a state id, and will throw an error if its neither.
 * @example
 * override onEnteringState(stateName: GameStateName, args?: { args: AnyGameStateArgs }): void
 * {
 * 	switch( stateName )
 * 	{
 * 		// This ensures that only the properties defined for this state are accessible.
 * 		case 'newHand':
 * 			const newHandArgs = args.args as GameStateArgs<'newHand'>;
 * 			this.onNewHand( newHandArgs.cards );
 * 			break;
 * 	...
 * 	}
 * }
 */
type GameStateArgs<N extends keyof GameStates | GameStateName> = 
	N extends keyof GameStates ?
		GameStates[N] extends string ? {} :
		GameStates[N] extends { argsType: infer T } ? T :
		never
	: {
		[K in keyof GameStates]:
			GameStates[K] extends N ? { } :
			GameStates[K] extends { name: N, argsType: infer T } ? T :
			never;
	}[keyof GameStates];