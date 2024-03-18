/// <reference path="types/index.d.ts" />

/** @gameSpecific Add additional dojo dependency types here. See {@link DojoDependencies} for more information. */
interface DojoDependencies {}

/** @gameSpecific Add game specific states here. See {@link GameStates} for more information. */
interface GameStates {
	// [id: number]: string | { name: string, args: object} | any; // Uncomment to remove type safety with ids, names, and arguments for game states
	'-1': 'dummmy'; // Added so 'dummy' case in examples can compile.
}

/** @gameSpecific Add game specific player actions / arguments here. See {@link PlayerActions} for more information. */
interface PlayerActions {
	// [action: string]: object; // Uncomment to remove type safety on player action names and arguments
}

/** @gameSpecific Add game specific notifications / arguments here. See {@link NotifTypes} for more information. */
interface NotifTypes {
	// [name: string]: object; // Uncomment to remove type safety on notification names and arguments
}

/** @gameSpecific Add game specific gamedatas arguments here. See {@link Gamedatas} for more information. */
interface Gamedatas {
	// [key: string | number]: object; // Uncomment to remove type safety on game state arguments
}