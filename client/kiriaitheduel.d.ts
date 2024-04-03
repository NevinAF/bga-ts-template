/// <reference path="build/index.d.ts" />

/** @gameSpecific Add additional dojo dependency types here. See {@link DojoDependencies} for more information. */
interface DojoDependencies {}

/** @gameSpecific Add game specific notifications / arguments here. See {@link NotifTypes} for more information. */
interface NotifTypes {
	// [name: string]: object; // Uncomment to remove type safety on notification names and arguments
	'starting special card': { card_name: string } & GameStateData;
	'battlefield setup': GameStateData;
	'played card': GameStateData;
	'undo card': GameStateData;
	'before first resolve': GameStateData;
	'before second resolve': GameStateData;
	'after resolve': GameStateData;
	'player(s) charged': GameStateData;
	'player(s) moved': GameStateData;
	'player(s) changed stance': GameStateData;
	'player(s) attacked': GameStateData;
	'player(s) hit': GameStateData & { redScore?: number, blueScore?: number };

	'log': any;
}

/** @gameSpecific Add game specific gamedatas arguments here. See {@link Gamedatas} for more information. */
interface Gamedatas extends GameStateData {
	// [key: string | number]: object; // Uncomment to remove type safety on game state arguments
}

interface GameStateData {
	battlefield: number;
	cards: number;
}

type ValueOf<T> = T[keyof T];

interface Stance
{
	HEAVEN: 0;
	EARTH: 1;
}

interface PlayedCard
{
	NOT_PLAYED: 0;
	HIDDEN: 9;

	APPROACH: 1;
	CHARGE: 2;
	HIGH_STRIKE: 3;
	LOW_STRIKE: 4;
	BALANCED_STRIKE: 5;
	RETREAT: 6;
	CHANGE_STANCE: 7;
	SPECIAL: 8;
}

interface Discarded
{
	NONE: 0;

	APPROACH_RETREAT: 1;
	CHARGE_CHANGE_STANCE: 2;
	HIGH_STRIKE: 3;
	LOW_STRIKE: 4;
	BALANCED_STRIKE: 5;
}

interface SpecialCard
{
	HIDDEN: 0;
	KESA_STRIKE: 1;
	ZAN_TETSU_STRIKE: 2;
	COUNTERATTACK: 3;
}