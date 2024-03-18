/// <reference path="types/index.d.ts" />

/** @gameSpecific Add additional dojo dependency types here. See {@link DojoDependencies} for more information. */
interface DojoDependencies {}

/** @gameSpecific Add game specific states here. See {@link GameStates} for more information. */
interface GameStates {
	// [id: number]: string | { name: string, args: object} | any; // Uncomment to remove type safety with ids, names, and arguments for game states
	2: 'drawSpecialCards';
	3: 'pickCards';
	4: 'resolveCards';
}

/** @gameSpecific Add game specific player actions / arguments here. See {@link PlayerActions} for more information. */
interface PlayerActions {
	// [action: string]: object; // Uncomment to remove type safety on player action names and arguments
	'pickedCards': { firstCard: number, secondCard: number };
}

/** @gameSpecific Add game specific notifications / arguments here. See {@link NotifTypes} for more information. */
interface NotifTypes {
	// [name: string]: object; // Uncomment to remove type safety on notification names and arguments
	'playCards': { state: StateData };
	'cardsResolved': { state: StateData };
	'drawSpecialCard': { state: StateData };
	'cardsPlayed': null;
	'cardFlipped': { back_card_id: number; card_id: number };
}

/** @gameSpecific Add game specific gamedatas arguments here. See {@link Gamedatas} for more information. */
interface Gamedatas {
	// [key: string | number]: object; // Uncomment to remove type safety on game state arguments
	redPlayer: number;
	bluePlayer: number;
	state: StateData;
}

interface StateData {
	cards: {
		redHand?: number[];
		blueHand?: number[];
		redPlayed?: number[];
		bluePlayed?: number[];
		redDiscard?: number[];
		blueDiscard?: number[];
		deck?: number[];
	},
	flippedState: {
		redPlayed_0_Flipped: number;
		redPlayed_1_Flipped: number;
		bluePlayed_0_Flipped: number;
		bluePlayed_1_Flipped: number;
	},
	stances: {
		red_samurai: number;
		blue_samurai: number;
	},
	positions: {
		red_samurai: number;
		blue_samurai: number;
	},
	damage: {
		red_samurai: number;
		blue_samurai: number;
	}
}