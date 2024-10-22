import dojo = require("dojo");
import declare = require("dojo/_base/declare");
import svelte = require("svelte/index");
import "ebg/core/common";
import "dojo/string";
import "dojo/fx";
import "dojo/fx/easing";
import "dojo/parser";
import "dojo/io/iframe";
import "dijit/Tooltip";
import "dojox/uuid/generateRandomUuid";
import "dijit/Dialog";
import "ebg/core/i18n";
import "ebg/webrtc";
import "ebg/webpush";
import "ebg/draggable";
import "ebg/resizable";
import "ebg/popindialog";

// #region Extend Dialog

interface ExtendDialog_Template extends InstanceType<typeof dijit.Dialog> {}
class ExtendDialog_Template
{
	/* override */ attr(name: string | { [attr: string]: any }, value?: any) {
		this.set(name, value);
	}

	/* override */ set(name: string | { [attr: string]: any }, value?: any): any {
		if (name === "content") {
			this.thisDlg = new ebg.popindialog();
			this.thisDlg.bCloseIsHiding = true;
			this.thisDlg.create(
				"dialog_" + this.id,
				$("main-content") !== null ? "main-content" : "left-side"
			);
			this.thisDlg.setTitle(this.title);
			if (this.onHide) {
				this.thisDlg.onHide = dojo.hitch(this, this.onHide);
			}
			this.thisDlg.setContent(value);
		}
	}

	/* override */ show(): any {
		if (this.thisDlg !== undefined) {
			this.thisDlg.show();
		}
	}

	/* override */ hide(): any {
		if (this.thisDlg !== undefined) {
			this.thisDlg.hide();
		}
	}

	/* override */ destroyRecursive() {
		if (this.thisDlg !== undefined) {
			this.thisDlg.destroy(false);
		}
	}

	/* override */ destroy() {
		if (this.thisDlg !== undefined) {
			this.thisDlg.destroy(false);
		}
	}
}

dojo.extend(dijit.Dialog, ExtendDialog_Template);

// TODO: Add this to the interface rather than the conglomerate declaration.
declare global {
	namespace DijitJS {
		interface Dialog {
			thisDlg?: InstanceType<BGA.PopinDialog>;
		}
	}
}

// #endregion

declare global {

	namespace BGA {

		/**
		 * Specifies game specific literal to help reduce spelling or expected values errors. Supported properties:
		 * - CounterNames: The keys for {@link Gamedatas.counters}, used with for several of the {@link BGA.CorePage} helper methods.
		 */
		interface GameSpecificIdentifiers { }

		type CounterNames = "CounterNames" extends infer K extends keyof GameSpecificIdentifiers
			? GameSpecificIdentifiers[K] extends string
				? GameSpecificIdentifiers[K]
				: string
			: string;

//#region Gamedatas/States

		/**
		 * An JSON like type that is a represents all possible game states. This is the exact type of the {@link Gamedatas#gamestates} and used to infer the exact information about a gamestate using typescript intellisense. For example, using an if statement when checking for a specific state name, all information inside the if statement will pertain to that exact state.
		 * 
		 * All entries should follow the format as {@link BGA.ID} => {@link IDefinedGameState}. The see the {@link IDefinedGameState} interface for the specific fields, but this matches the exact information that is defined within the state machine (states.inc.php).
		 * 
		 * All invalid key/value pairs will be ignored. The {@link ValidateGameStates} type can wrap the type to ensure that all keys/values are typed correctly. 
		 * 
		 * @example
		 * // Default (without specific state information)
		 * interface DefinedGameStates extends ValidateGameStates<{
		 * 	[id: BGA.ID]: IDefinedGameState;
		 * 	"1": {
		 * 		"name": "gameSetup",
		 * 		"description": "",
		 * 		"type": "manager",
		 * 		"action": "stGameSetup",
		 * 		"transitions": { "": BGA.ID }
		 * 	};
		 * 	"99": {
		 * 		"name": "gameEnd",
		 * 		"description": "End of game",
		 * 		"type": "manager",
		 * 		"action": "stGameEnd",
		 * 		"args": "argGameEnd"
		 * 	};
		 * }> {}
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
		interface DefinedGameStates {}

		/**
		 * A record for looking up the state specific argument types passed by the server. Each property name represents the server side 'args' function name and the property value is the typescript type returned by that function. When using the {@link BGA.Gamegui#onEnteringState} and {@link BGA.Gamegui#onUpdateActionButtons} methods, the args can be inferred to the respective state's argument type through the state's name.
		 * @example
		 * interface GameStateArgs {
		 * 	[funcName: string]: any;
		 * 	"argGameEnd": {
		 * 		result: Record<BGA.ID, {
		 * 			rank: BGA.ID;
		 * 			name: string;
		 * 			score: BGA.ID;
		 * 			score_aux: BGA.ID;
		 * 			color: HexString;
		 * 			color_back: HexString;
		 * 			player: BGA.ID;
		 * 		}>;
		 * 	};
		 * }
		 */
		interface GameStateArgs {
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
		interface GameStatePossibleActions {}

		/**
		 * The actual interface for a defined game state. This differs from {@link DefinedGameState} because all properties are generalized type rather than being a union of all of the defined types. For example, {@link IDefinedGameState.name} is any string but {@link DefinedGameState.name} must be one of the defined game state names (like 'gameSetup' | 'gameEnd' | ...).
		 */
		interface IDefinedGameState {
			/** The name of this game state. */
			name: string;
			/** The type of game state. See {@link GameStateType} for more information on game state types. */
			type: "activeplayer" | "multipleactiveplayer" | "private" | "game" | "manager";
			/** The description that is automatically set on the title banner at the top of the board game area. This message is displayed for all used except active players when `descriptionmytrun` is defined. */
			description?: string;
			/** The description that is automatically set on the title banner at the top of the board game area when this client is an active player. */
			descriptionmyturn?: string;
			/** The server side function that should be run when entering this state. If the state `type` is game, this is the only function called before waiting for the next state to be started. */
			action?: string;
			/** The transitions that can be made from the current state. The action key in this dictionary is purely server side and is used of clarity. The name signifies the type of action/transition that should be made which pairs with the less readable ID of the target game state. */
			transitions?: { [action: string]: Default<keyof DefinedGameStates, BGA.ID> };
			/** The list of possible actions that the active player clients can call using the ajax method. See {@link Gamegui.ajaxcall} and {@link Gamegui.checkAction}. */
			possibleactions?: Default<keyof GameStatePossibleActions, string>[];
			/** The server side function used to generate the arguments for this state. If undefined, this state will always pass 'null' for the arguments, unless it is a client state. */
			args?: keyof GameStateArgs;
			/** If defined and true, this state will call the server side `getGameProgression` progression and update the `CurrentStateArgs` with this value. */
			updateGameProgression?: boolean;
			initialprivate?: Default<keyof DefinedGameStates, string>;
		}

		/** The function {@link BGA.Gamegui#updatePageTitle}.updatePageTitle reuses the {@link IActiveGameState.args} to populate additional properties for formatting the title. This interface represents these additional properties that can be added/used when calling that function. */
		interface AdditionalGameStateArgs extends Type<{
			[titlearg: `titlearg${number}`]: string
		}> {
			/** An HTML span representing the first active player in the list of active players. Updated when a new state is entered or when {@link Gamegui}.updatePageTitle is called. */
			actplayer?: "" | `<span style="font-weight:bold;color:#'${string}';${string}">${string}</span>`;
			/** An HTML span representing the client player when the client is active and there is no descriptionmyturn defined. Updated when a new state is entered or when {@link BGA.Gamegui}.updatePageTitle is called. */
			you?: `<span style="font-weight:bold;color:#'${string}';${string}">${string}</span>`;
			/** An HTML span representing the 'otherplayer'. Updated when a new state is entered or when {@link BGA.Gamegui}.updatePageTitle is called. */
			otherplayer?: `<span style="font-weight:bold;color:#'${string}';${string}">${string}</span>`;
			/** The id of the 'otherplayer' used to populate the {@link otherplayer} HTML span field. */
			otherplayer_id?: BGA.ID;
	
			titlearg?: string;

			_private?: IActiveGameState['args'];
		}

		interface IActiveGameState extends Omit<IDefinedGameState, 'args' | 'updateGameProgression'> {
			/** Id of the current state. The type of args will always match the type of `GameStateArgs<id>` */
			id: ValidDefinedGameStateKeys;
			args: null | (AdditionalGameStateArgs & GameStateArgs[keyof GameStateArgs]);
			updateGameProgression?: BGA.ID;
			/** The id of the single active player for an activeplayer state. If this `type` is not activeplayer, this value will be 0 */
			active_player: BGA.ID | 0;
			/** When the state is a multipleactiveplayer state, this will be an array of player ids that are active. */
			multiactive?: BGA.ID[];
			/** The timers foreach player in the game. This include the `initial` time in ms, the `initial_ts` timestamp in UNIX format, and the `total` time in ms. */
			reflexion: {
				initial: { [playerId: BGA.ID]: number };
				initial_ts: { [playerId: BGA.ID]: number };
				total: { [playerId: BGA.ID]: number };
			}
		}
	
		/**
		 * A helper type used to make sure that the {@link DefinedGameStates} type is set up correctly.
		 * @example
		 * interface DefinedGameStates extends ValidateGameStates<{
		 * 	[id: BGA.ID]: GameState_Interface;
		 * 	"1": {
		 * 		"name": "gameSetup",
		 * 		"description": "",
		 * 		"type": "manager",
		 * 		"action": "stGameSetup",
		 * 		"transitions": { "": 2 }
		 * 	};
		 * 	"99": {
		 * 		"name": "gameEnd",
		 * 		"description": "End of game",
		 * 		"type": "manager",
		 * 		"action": "stGameEnd",
		 * 		"args": "argGameEnd"
		 * 	};
		 * }> {};
		 */
		type ValidateGameStates<T extends {
			[P in keyof DefinedGameStates]: P extends BGA.ID ? IDefinedGameState : never;
		}> = T;

		/** Used in place of 'keyof DefinedGameState' to ensure that all keys point to values extending {@link IDefinedGameState}. */
		type ValidDefinedGameStateKeys = {
			[P in keyof DefinedGameStates]:
				P extends BGA.ID ? // key must be a number
				DefinedGameStates[P] extends IDefinedGameState ? // value must be a valid IDefinedGameState
					P
				: never : never;
		}[keyof DefinedGameStates];

		type ActiveGameStates =
			// If gamestates are not defined or not specific
			number extends Default<ValidDefinedGameStateKeys, number>
				? { [K in BGA.ID]: IActiveGameState } 
			// If gamestates are not specific..
			: `${number}` extends ValidDefinedGameStateKeys
				? { [K in BGA.ID]: IActiveGameState } 
			: {
				[K in ValidDefinedGameStateKeys]: {
					/** A {@link IActiveGameState.id} but typed for a specific game state. */
					id: K;
					/** A {@link IActiveGameState.name} but typed for a specific game state. */
					name: DefinedGameStates[K]['name']; // Name must be defined, which is why it is not optional.
					/** A {@link IActiveGameState.type} but typed for a specific game state. */
					type: DefinedGameStates[K]['type']; // Type must be defined, which is why it is not optional.
					/** A {@link IActiveGameState.args} but typed for a specific game state. */
					args: ('args' extends keyof DefinedGameStates[K]
						? (DefinedGameStates[K]['args'] extends keyof GameStateArgs
							? (GameStateArgs[DefinedGameStates[K]['args']] & AdditionalGameStateArgs)
							: null)
						: null);

					active_player: DefinedGameStates[K]['type'] extends "activeplayer" ? BGA.ID : 0;
					/** The timers foreach player in the game. This include the `initial` time in ms, the `initial_ts` timestamp in UNIX format, and the `total` time in ms. */
					reflexion: {
						initial: { [playerId: BGA.ID]: number };
						initial_ts: { [playerId: BGA.ID]: number };
						total: { [playerId: BGA.ID]: number };
					}
				}
				& ('description' extends keyof DefinedGameStates[K]
					? { description: DefinedGameStates[K]['description'] | string } // this can/should be updated as needed
					: { description?: string })
				& ('descriptionmyturn' extends keyof DefinedGameStates[K]
					? { descriptionmyturn: DefinedGameStates[K]['descriptionmyturn'] | string } // this can/should be updated as needed
					: { descriptionmyturn?: string })
				& ('action' extends keyof DefinedGameStates[K]
					? { action: DefinedGameStates[K]['action'] }
					: { action?: never })
				& ('transitions' extends keyof DefinedGameStates[K]
					? { transitions: DefinedGameStates[K]['transitions'] }
					: { transitions?: never })
				& ('possibleactions' extends keyof DefinedGameStates[K]
					? { possibleactions: DefinedGameStates[K]['possibleactions'] }
					: { possibleactions?: never })
				& ('initialprivate' extends keyof DefinedGameStates[K]
					? { initialprivate: DefinedGameStates[K]['initialprivate'] }
					: { initialprivate?: never })
				& ('updateGameProgression' extends keyof DefinedGameStates[K]
					? { updateGameProgression: number }
					: { updateGameProgression?: never })
				& (DefinedGameStates[K]['type'] extends "multipleactiveplayer"
					? { multiactive: BGA.ID[] }
					: { multiactive?: never })
			};

		/** A helper type to generating the tuple portion of the {@link GameStateTuple} */
		type _GameStateTupleReducer<K extends keyof ActiveGameStates, Ks> =
			Ks extends [infer F, ...infer R]
				? [F extends keyof ActiveGameStates[K] ? ActiveGameStates[K][F] : ActiveGameStates[K], ..._GameStateTupleReducer<K, R>]
				: [];

		/** Used to create a tuple type where each index is the property of an ActiveGameState. This tuple is strongly coupled allowing types to be infer based on uses of other tuple elements, i.e, a switch statement on a state name will let cases to infer all of that specific state's types. */
		type GameStateTuple<Ks extends ((keyof ActiveGameStates[keyof ActiveGameStates]) | 'state')[]> = {
			[K in keyof ActiveGameStates]: _GameStateTupleReducer<K, Ks>
		}[keyof ActiveGameStates];

		/**
		 * The data structure for the current game state. This contains the base data from source {@link ValidateGameStates} and additional data that is passed to the client whenever the state changes.
		 */
		type ActiveGameState = ActiveGameStates[keyof ActiveGameStates];

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
			/** A dictionary of all player information. See {@link Player} for more information. */
			players: { [playerId: BGA.ID]: GamePlayer };
			/** The current game state data. This is the same data that is passed to the `onEnteringState` method. */
			gamestate: ActiveGameState & { private_state?: ActiveGameState };
			/** Not documented. */
			tablespeed: BGA.ID;
			/** Not documented. Likely has something to do with players leaving the game, thus making the game results neutralized. The may be a boolean. */
			game_result_neutralized?: BGA.ID | '0';
			/** Not documented. Possibly something to do with players leaving the game. This looks to be a global php variable stored in the database. */
			neutralized_player_id: BGA.ID | '0';
			/** An ordered array of player ids which signify the current player order. */
			playerorder: BGA.ID[];
			/**
			 * A dictionary of all game states defined in the states.inc.php file. This should be the same as {@link DefinedGameStates} but possibly contain additional information based on what was included in the game specific interface. 
			 */
			gamestates: [ValidDefinedGameStateKeys] extends [never]
				? Record<BGA.ID, IDefinedGameState> // If DefinedGameStates are not defined
				: { [K in ValidDefinedGameStateKeys]: DefinedGameStates[K] };
			/** The notification pointers used for evaluating notifications. */
			notifications: {
				last_packet_id: BGA.ID,
				move_nbr: BGA.ID,
				table_next_notification_no?: BGA.ID
			};
	
			/** Not documented. */
			decision?: NotifTypes['tableDecision'];
			/** The custom counters that are currently added to the game in the html by using the following format:
			 * ```html
			 * <div class="counter" id="bread"></div>
			 * <div class="counter" id="coin"></div>
			 * ```
			 * The keys of this record are the id of the element, and the value is the current state of the counter.
			 */
			counters?: { [K in CounterNames]: { counter_value: BGA.ID, counter_name: K } };
		}
	
		interface GamePlayer {
			/** The unique identifier for the player. */
			id: BGA.ID;
			/** This players current score. This is the score updated by game specific code in the `.game.php` file */
			score: BGA.ID;
			/** The color of the player as defined in `gameinfos.inc.php` assigned by the `.game.php` file. This should always be a hex string in RGB format: `RRGGBB`. */
			color: HexString;
			/** Not documented. This should always be a hex string in RGB format: `RRGGBB`. */
			color_back: HexString | null;
			/** The username of the player. */
			name: string;
			/** Not documented. */
			avatar: string | '000000';
			/** Not documented. Presumably represents if the player has disconnected and has begun taking 'zombie' actions. This is likely a boolean. */
			zombie: '0' | '1' | 0 | 1;
			/** Not documented. */
			eliminated: '0' | '1' | 0 | 1;
			/** Not documented. Presumably represents if the player is a bot. This is likely a boolean. */
			is_ai: '0' | '1' | 0 | 1;
			/** Not documented. This could represent a beginner to BGA or the game, and unsure how this is calculated. */
			beginner: boolean;
		
			/** Not documented. */
			ack?: string | 'ack';
			/** Not documented. */
			no?: string;
		}

		// Add all of the possible game state actions to the ajax list.
		interface AjaxActions extends Type<
			[keyof GameStatePossibleActions] extends [never] ? {
				[possibleAction: `/${string}/${string}/${string}.html`]: any;
			} : {
				[K in keyof GameStatePossibleActions as `/${string}/${string}/${K}.html`]: GameStatePossibleActions[K];
			}>{}

//#endregion

		interface AjaxActions {
			"/videochat/videochat/getRTCConfig.html": {
				_successargs: [{
					static_turn?: {
						urls?: string | "";
					},
					dynamic_iceservers?: string;
				}]
			};
			"/videochat/videochat/joinRoom.html": {
				_successargs: [{
					videochat_terms_accepted: 0 | 1,
					already_in: boolean,
					joined: boolean,
					in_room: BGA.ID[],
				}],
				room: BGA.RoomId | null,
				audio: boolean,
				video: boolean,
				accept?: boolean
			};
			"/table/table/startStopVideo.html": {
				_successargs: [{
					room_id: BGA.RoomId
				}],
				target_table: BGA.ID | null | undefined,
				target_player: BGA.ID | null | undefined
			}
			"/table/table/startStopAudio.html": {
				_successargs: [{
					room_id: BGA.RoomId
				}],
				target_table: BGA.ID | null | undefined,
				target_player: BGA.ID | null | undefined
			}
			"/videochat/videochat/leaveRoom.html": {
				room: BGA.RoomId | null
			}
		}

		type AjaxCallbackArgsMap = {
			[K in keyof AjaxActions]:
				'_successargs' extends keyof AjaxActions[K] ? (
					AjaxActions[K]['_successargs'] extends any[] ? AjaxActions[K]['_successargs'] : unknown[]
				) : unknown[];
		}
	
		interface AjaxAdditionalArgs {
			lock?: boolean | "table" | "player" | number;
			action?: undefined;
			module?: undefined;
			class?: undefined;
			noerrortracking?: boolean;
			form_id?: string;
			table?: BGA.ID | null;
		}
	
		type AjaxParams<Action extends keyof AjaxActions, Scope> = [
			url: Action,
			args: NoInfer<Omit<AjaxActions[Action], '_successargs'> & AjaxAdditionalArgs>,
			scope: Scope,
			onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, AjaxCallbackArgsMap[Action]>>,
			callback?: NoInfer<DojoJS.HitchMethod<Scope, [
				error: boolean,
				errorMessage?: string,
				errorCode?: number]>>,
			ajax_method?: "post" | "get" | "iframe"
		];
	}
}

interface CorePage_Template extends DojoJS.DojoClassObject {}

/**
 * The core for all bga web pages. This is interchangeable with {@link SiteCore} as this uses many functions/properties from {@link SiteCore}, and {@link SiteCore} is a direct extension of this class.
 *
 * All {@link Gamegui} objects are extensions of this.
 */
class CorePage_Template {
	/**
	 * The data from the server that is used to initialize the game client. This is the same as `gamedatas` in the `setup` method and is untouched after the `setup` method is called.
	 * 
	 * This is defined in CorePage because the property is used when available, but is only set when this is also a {@link BGA.Gamegui} object.
	 * @example
	 * for (var player_id in this.gamedatas.players) { 
	 * 	var playerInfo = this.gamedatas.players [player_id];
	 * 	var c = playerInfo.color;
	 * 	var name = playerInfo.name;
	 * 	// do something 
	 * }
	 */
	gamedatas?: BGA.Gamedatas | null;

	/** The list of subscriptions managed by {@link register_subs} and {@link unsubscribe_all}. */
	subscriptions: DojoJS.Handle[] = [];
	/** Record of the tooltips added by using functions of same flavor of {@link addTooltip} and {@link removeTooltip}. The key is the element id for the tooltip. */
	tooltips: Record<string, DijitJS.Tooltip> = {};
	/** If true, all tooltips (existing and future) stored in {@link tooltips} will be closed as soon as it tries to open. See {@link switchDiplaytooltips} for modifying this value. */
	bHideTooltips: boolean = false;
	/** The minimum width of the game as defined by game_infos>game_interface_width */
	screenMinWidth: number = 0;
	/** Percentage to zoom to make all game components fit within the min {@link screenMinWidth}. */
	currentZoom: number = 1;
	/** All dojo handles that are managed by {@link connect} and {@link disconnect} and their other flavors. */
	connections: {
		element: any;
		event: string;
		handle: DojoJS.Handle;
	}[] = [];
	/** True during replay/archive mode if animations should be skipped. Only needed if you are doing custom animations. (The BGA-provided animation functions like this.slideToObject() automatically handle instantaneous mode.) */
	instantaneousMode: boolean | 0 | 1 = false;
	/** The real-time communications object for the game room. See {@link BGA.WebRTC} for more information. */
	webrtc: InstanceType<BGA.WebRTC> | null = null;
	/** Handle for the rtc notification. Used if/when the rtc is disconnected. */
	webrtcmsg_ntf_handle: DojoJS.Handle | null = null;
	/** An enumeration representing the real-time communications type: 0 = disabled, 1 = voice only?, 2 = video? */
	rtc_mode: 0 | 1 | 2 = 0;
	/** An object stating which media devices can be accessed. */
	mediaConstraints: BGA.WebRTCMediaConstraints = { video: false, audio: false };
	/** The list of player that have marked themselves as this gender. */
	gameMasculinePlayers: string[] = [];
	/** The list of player that have marked themselves as this gender. */
	gameFemininePlayers: string[] = [];
	/** The list of player that have marked themselves as this gender (or have it default). */
	gameNeutralPlayers: string[] = [];
	/** The of emoticons usable with BGA chat windows. This is fully defined for convenience, but this may not match actual source if it changes. */
	emoticons = {
		":)": "smile",
		":-)": "smile",
		":D": "bigsmile",
		":-D": "bigsmile",
		":(": "unsmile",
		":-(": "unsmile",
		";)": "blink",
		";-)": "blink",
		":/": "bad",
		":-/": "bad",
		":s": "bad",
		":-s": "bad",
		":P": "mischievous",
		":-P": "mischievous",
		":p": "mischievous",
		":-p": "mischievous",
		":$": "blushing",
		":-$": "blushing",
		":o": "surprised",
		":-o": "surprised",
		":O": "shocked",
		":-O": "shocked",
		o_o: "shocked",
		O_O: "shocked",
		"8)": "sunglass",
		"8-)": "sunglass",
	} as const;

	/** The default order to try to position tooltips. */
	defaultTooltipPosition: DijitJS.PlacePositions[] = [
		"above",
		"below",
		"after",
		"before",
	];

	/** The url for BGA, used to create urls for players, upgrading to premium, creating a new account, and more.  */
	metasiteurl?: string;

	/**
	 * Sends a client side notification to the server in the form of a player action. This should be used only in reaction to a user action in the interface to prevent race conditions or breaking replay game and tutorial features.
	 * @param url The relative URL of the action to perform. Usually, it must be: "/<mygame>/<mygame>/myAction.html"
	 * @param args An array of parameter to send to the game server. Note that `lock` must always be specified when calling player actions. Though not a required parameter, `lock` has been added here to prevent errors: Player actions must always be accompanied by a uuid lock parameter else the server will respond with a lock error. NOTE: If you are seeing an error here, it is likely that you are using a reserved args property (e.g. action/module/class). Make sure no player action arguments have these properties.
	 * @param scope (non-optional) The object that triggered the action. This is usually `this`.
	 * @param onSuccess (non-optional but rarely used) A function to trigger when the server returns result and everything went fine (not used, as all data handling is done via notifications).
	 * @param callback (optional) A function to trigger when the server returns ok OR error. If no error this function is called with parameter value false. If an error occurred, the first parameter will be set to true, the second will contain the error message sent by the PHP back-end, and the third will contain an error code.
	 * @param ajax_method (optional and rarely used) If you need to send large amounts of data (over 2048 bytes), you can set this parameter to 'post' (all lower-case) to send a POST request as opposed to the default GET. This works, but was not officially documented, so only use if you really need to.
	 * @example
	 * this.ajaxcall( '/mygame/mygame/myaction.html', { lock: true,
	 * 	arg1: myarg1,
	 * 	arg2: myarg2
	 * }, this, (result) => {} );
	 */
	ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(...[
		url,
		args,
		scope,
		onSuccess,
		callback,
		ajax_method
	]: BGA.AjaxParams<Action, Scope>): void {
		g_sitecore.ajaxcall_running++;
		g_sitecore.updateAjaxCallStatus();
		if (typeof args !== "object") {
			console.error("ajaxcall : params should be an object. param =");
			console.error(args);
		}
		if (args.action !== undefined) {
			console.error(
				"ajaxcall : sorry you cannot use 'action' argument (reserved)"
			);
			this.showMessage(
				"Ajaxcall : sorry you cannot use 'action' argument (reserved keyword)",
				"error"
			);
			return;
		}
		if (args.module !== undefined) {
			console.error(
				"ajaxcall : sorry you cannot use 'module' argument (reserved)"
			);
			this.showMessage(
				"Ajaxcall : sorry you cannot use 'module' argument (reserved keyword)",
				"error"
			);
			return;
		}
		if (args.class !== undefined) {
			console.error(
				"ajaxcall : sorry you cannot use 'class' argument (reserved)"
			);
			this.showMessage(
				"Ajaxcall : sorry you cannot use 'class' argument (reserved keyword)",
				"error"
			);
			return;
		}

		if (args.lock) {
			let type =
				args.lock === "table"
					? "table"
					: args.lock === "player"
					? "player"
					: null;
			// @ts-ignore - lock is changing types.
			args.lock = dojox.uuid.generateRandomUuid();
			dojo.publish("lockInterface", [
				{
					status: "outgoing",
					uuid: args.lock,
					type: type,
				},
			]);
		}
		var handle = dojo.hitch(
			this,
			function (this: CorePage_Template, data: any, result: any) {
				if (data && data.status === 1) {
					if (data.profilingd !== undefined) {
						$("ajax_call_profiling")!.innerHTML += data.profilingd;
					}
					if (result.args.content.lock) {
						dojo.publish("lockInterface", [
							{
								status: "recorded",
								uuid: result.args.content.lock,
							},
						]);
					}
					if (
						typeof data.data === "object" &&
						data.data !== null &&
						typeof data.data.data === "object" &&
						data.data.data !== null &&
						data.data.data.tbyt !== undefined
					) {
						this.number_of_tb_table_its_your_turn =
							data.data.data.tbyt;
					}
					if (!this.bCancelAllAjax) {
						try {
							dojo.hitch(scope, onSuccess as any)(data.data);
							if (callback !== undefined) {
								dojo.hitch(scope, callback as any)(false);
							}
						} catch (error: any) {
							console.error(
								"Exception during callback " +
									onSuccess?.toString() +
									" after a call to URL " +
									url
							);
							console.error(
								"Exception message : " + error.message
							);
							console.error("URL = " + url);
							console.error("Ajaxcall params :");
							console.error(args);
							console.error("Ajaxcall result :");
							console.error(data);
							error.message =
								"Error during callback from url " +
								url +
								". " +
								error.message;
							throw error;
						}
					}
				} else {
					if (data === null) {
						this.showMessage(
							_("Ajaxcall error: empty answer"),
							"error"
						);
						this.showMessage(
							_(
								"If your game interface seems unstable, press F5 or <a href='javascript:location.reload(true)'>click here</a>"
							),
							"info"
						);
						console.error(
							"Ajaxcall error: empty answer from " + url
						);
						if (!args.noerrortracking) {
							analyticsPush({
								errorURL: url || "",
								errorCode: "",
								errorExpected: "",
								event: "page_error",
							});
						}
					} else {
						if (!args.noerrortracking) {
							analyticsPush({
								errorURL: url || "",
								errorCode: data.code ? data.code : "",
								errorExpected: data.expected
									? data.expected
									: "",
								event: "page_error",
							});
						}
						if (data.code === 800)
							dojo.publish("signalVisitorNotAllowed");
						else if (data.code === 801) {
							this.showMessage(data.error, "error");
							if (typeof gotourl !== "undefined") {
								gotourl("premium?src=notallowed");
							} else if (this.metasiteurl !== undefined) {
								setTimeout(
									dojo.hitch(this, function(this: CorePage_Template) {
										document.location.href =
											this.metasiteurl +
											"/premium?src=redirect";
									}),
									2000
								);
							}
						} else if (data.code === 806) {
							this.infoDialog(
								_("Please click the button below to continue."),
								_("Update needed!"),
								function () {
									window.location.reload();
								},
								true
							);
						} else if (data.code === 114) {
							if (typeof gotourl !== "undefined") {
								gotourl("account?page=newuser");
								this.showMessage(data.error, "error");
							} else if (this.metasiteurl !== undefined) {
								this.showMessage(data.error, "error");
								setTimeout(
									dojo.hitch(this, function (this: CorePage_Template) {
										document.location.href =
											this.metasiteurl +
											"/account?page=newuser";
									}),
									2000
								);
							}
						} else if (toint(data.expected) === 0) {
							this.showMessage(
								_("Unexpected error: ") + data.error,
								"error"
							);
							this.showMessage(
								_(
									"If your game interface seems unstable, press F5 or <a href='javascript:location.reload(true)'>click here</a>"
								),
								"info"
							);
							console.error("Unexpected error:  " + data.error);
						} else {
							this.showMessage(data.error, "error");
						}
					}
					if (result.args.content.lock) {
						dojo.publish("lockInterface", [
							{
								status: "updated",
								uuid: result.args.content.lock,
							},
						]);
					}
					if (!this.bCancelAllAjax) {
						if (callback !== undefined) {
							dojo.hitch(scope, callback as any)(
								true,
								data.error,
								data.code === undefined ? 0 : data.code
							);
						}
					}
				}
			}
		);
		var errorHandle = dojo.hitch(
			this,
			function (this: CorePage_Template, error: any, result: any) {
				if (result.xhr) {
					if (result.xhr.status === 200) {
						var response = result.xhr.responseText.replace(
							/^\s+/g,
							""
						);
						if (response[0] !== "{") {
							this.showMessage(
								__("lang_mainsite", "Server syntax error: ") +
									result.xhr.responseText,
								"error"
							);
							this.showMessage(
								__(
									"lang_mainsite",
									"If your game interface seems unstable, press F5 or <a href='javascript:location.reload(true)'>click here</a>"
								),
								"info"
							);
							console.error(
								"Server syntax error: " +
									url +
									" " +
									error +
									" / " +
									result.xhr.responseText
							);
							if (!args.noerrortracking) {
								analyticsPush({
									errorURL: url || "",
									errorCode: "Server syntax error",
									errorExpected: 0,
									event: "page_error",
								});
							}
						} else {
							this.showMessage(
								__("lang_mainsite", "Client error: ") +
									error +
									". During " +
									result.args.url +
									" Received: " +
									result.xhr.responseText,
								"only_to_log"
							);
							this.showMessage(
								__(
									"lang_mainsite",
									"If your game interface seems unstable, press F5 or <a href='javascript:location.reload(true)'>click here</a>"
								),
								"only_to_log"
							);
							console.error(
								"Error during callback error: " +
									url +
									" / " +
									error
							);
							console.error(result);
							if (!args.noerrortracking) {
								analyticsPush({
									errorURL: url || "",
									errorCode: "Client error",
									errorExpected: 0,
									event: "page_error",
								});
							}
						}
					} else {
						console.error(
							"HTTP code " + result.xhr.status + " " + url
						);
						this.displayUserHttpError(result.xhr.status);
						if (!args.noerrortracking) {
							analyticsPush({
								errorURL: url || "",
								errorCode: "HTTP" + result.xhr.status,
								errorExpected: 0,
								event: "page_error",
							});
						}
					}
				} else {
					console.error("Server error: " + error);
					if (result.error !== undefined) {
						this.showMessage(result.error.toString(), "error");
					}
					if (args.table === undefined) {
						analyticsPush({
							errorURL: url || "",
							errorCode: "Server error",
							errorExpected: 0,
							event: "page_error",
						});
					}
				}
				if (result.args.content.lock) {
					dojo.publish("lockInterface", [
						{
							status: "updated",
							uuid: result.args.content.lock,
						},
					]);
				}
				if (!this.bCancelAllAjax) {
					if (callback !== undefined) {
						dojo.hitch(scope, callback as any)(true, error, 0);
					}
				}
			}
		);
		var finallyHandle = dojo.hitch(
			this,
			function (this: CorePage_Template, error: any, result: any) {
				g_sitecore.ajaxcall_running--;
				g_sitecore.updateAjaxCallStatus();
			}
		);
		var h: any = null;
		if ($("debug_output")) {
			var u = url.lastIndexOf("/");
			var p = url.substring(u + 1);
			var m = dojo.clone(args);
			if (m.lock) {
				delete m.lock;
			}
			var g = "<div>> <b>" + p + "</b>?" + dojo.objectToQuery(m) + "</div>";
			dojo.place(g, "debug_output", "first");
		}
		if (ajax_method != "post" && ajax_method != "iframe") {
			// @ts-ignore - TODO: Fix xhrGet to be typed correctly.
			dojo.xhrGet({
				url: url,
				handleAs: "json",
				preventCache: true,
				content: args,
				headers: { "X-Requested-With": bgaConfig.requestToken },
				load: handle,
				error: errorHandle,
				handle: finallyHandle,
				timeout: 2e4,
			});
		} else if (ajax_method == "post") {
			if (args.form_id !== undefined && args.form_id !== null) {
				h = args.form_id;
			}
			// @ts-ignore - TODO: Fix xhrPost to be typed correctly.
			dojo.xhrPost({
				url: url,
				handleAs: "json",
				preventCache: true,
				content: args,
				headers: { "X-Requested-With": bgaConfig.requestToken },
				form: h,
				load: handle,
				error: errorHandle,
				handle: finallyHandle,
				timeout: 2e4,
			});
		} else if (ajax_method == "iframe") {
			if (args.form_id !== null) {
				h = args.form_id;
			}
			// @ts-ignore - TODO: Fix io.iframe.send to be typed correctly.
			dojo.io.iframe.send({
				url: url,
				handleAs: "json",
				preventCache: true,
				content: args,
				form: h,
				load: handle,
				error: errorHandle,
				handle: finallyHandle,
				timeout: 2e4,
			});
		}
	}

	/**
	 * Formats the global string variable named `var_template` with the values from `args` using ${key} syntax. This is a simple templating system that is generally used to format HTML blocks. The `var_template` is a string that contains ${key} placeholders, and `args` is an object that contains the values to replace the placeholders with. The method returns the formatted string. Note: result is trimmed.
	 * This should be used when templates are defined in the .tpl file, i.e. they are hydrated by the server in some way.
	 * @param template The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 * @example
	 * var player = gamedatas.players[this.player_id];
	 * var div = this.format_block('jstpl_player_board', player ); // var jstpl_player_board = ... is defined in .tpl file
	 */
	format_block(template: string, args: Record<string, any>): string {
		return dojo.trim(dojo.string.substitute(dojo.eval(template), args));
	}

	/**
	 * Formats the string with the values from `args` using ${key} syntax. This is a simple templating system that is generally used to format HTML blocks. The `format` is a string that contains ${key} placeholders, and `args` is an object that contains the values to replace the placeholders with. The method returns the formatted string. Note: result is trimmed.
	 * This should be used when templates are defined in the .tpl file, i.e. they are hydrated by the server in some way.
	 * @param template The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 * @example var div = this.format_string('<div color="${player_color}"></div>', {player_color: '#ff0000'} );
	 */
	format_string(template: string, args: Record<string, any>): string {
		return dojo.trim(dojo.string.substitute(template, args));
	}

	/**
	 * Same as `format_string` but recursively formats until no more placeholders are found. This is useful for nested templates, like with server notifications.
	 * @param template The template string to format.
	 * @param args The values to replace the placeholders with.
	 * @returns The formatted string.
	 */
	format_string_recursive(
		template: string,
		args: Record<string, any> & {
			/** Works just like args entries, but translates the strings before inserting strings. */
			i18n?: Record<string, any>;
			type?:
				| string
				| "chatmessage"
				| "tablechat"
				| "privatechat"
				| "groupchat";
			message?: string;
			text?: string;
		}
	): string {
		if (null === template) {
			console.error(
				"format_string_recursive called with a null string with args:"
			);
			console.error(args);
			return "null_tr_string";
		}
		var result = "";
		if ("" != template) {
			var temp;
			var translated_template = this.clienttranslate_string(template);
			if (null === translated_template) {
				this.showMessage(
					"Missing translation for `" + template + "`",
					"error"
				);
				console.error(
					"Missing translation for `" + template + "`",
					"error"
				);
				return "";
			}
			if (undefined !== args.i18n)
				for (let key in args.i18n)
					args[(temp = args.i18n[key])] = this.clienttranslate_string(
						args[temp]
					);
			for (let key in args)
				"i18n" != key &&
					"object" == typeof args[key] &&
					null !== args[key] &&
					undefined !== args[key].log &&
					undefined !== args[key].args &&
					(args[key] = this.format_string_recursive(
						args[key].log,
						args[key].args
					));
			try {
				result = dojo.string.substitute(translated_template, args);
			} catch (r) {
				if (undefined === this.prevent_error_rentry)
					this.prevent_error_rentry = 0;
				this.prevent_error_rentry++;
				this.prevent_error_rentry >= 10
					? console.error("Preventing error rentry => ABORTING")
					: this.showMessage(
							"Invalid or missing substitution argument for log message: " +
								translated_template,
							"error"
					  );
				this.prevent_error_rentry--;
				console.error(
					"Invalid or missing substitution argument for log message: " +
						translated_template,
					"error"
				);
				result = translated_template;
			}
		}
		if (
			(undefined !== args.type &&
				("chatmessage" == args.type ||
					"tablechat" == args.type ||
					"privatechat" == args.type ||
					"groupchat" == args.type)) ||
			(undefined !== args.message &&
				"${player_name} ${message}" == template) ||
			(undefined !== args.text && "${player_name} ${text}" == template)
		) {
			result = this.applyGenderRegexps(result);
		}
		return result;
	}

	/**
	 * Translates a string. This is a simple function that tries to use the current page translations, {@link _}, and if that fails, it uses the global translations, {@link __}.
	 * @param text The text to translate.
	 * @returns The translated text.
	 * @example
	 * let text = 'Hello world';
	 * // The following two lines have equivalent results.
	 * this.clienttranslate(text)
	 * text == _(text) ? __('lang_mainsite', text) : _(text);
	 */
	clienttranslate_string(text: string): string {
		var translate = _(text);
		return translate == text ? __("lang_mainsite", text) : translate;
	}

	/**
	 * Translates ALL elements with the 'clienttranslatetarget' class.
	 * @param args The translation keys to translate. The key is the element id, and the value is the translation key.
	 * @param translationFrom The translation source to use. This will use the game translations if not specified.
	 */
	translate_client_targets(
		args: Record<string, any>,
		translationFrom?: string
	): void {
		var func = dojo.hitch(this, function (item: HTMLElement) {
			item.innerHTML;
			var o = item.innerHTML;
			// TODO: Does this really throw an error because of bad code? Check the translation func and test this.
			o = undefined !== typeof translationFrom ? __(translationFrom!, o) : _(o);
			item.innerHTML = dojo.string.substitute(o, args);
		});
		dojo.query<HTMLElement>(".clienttranslatetarget").forEach(func);
	}

	/** Registers a dojo.Handle to this object, under the {@link subscriptions} array. This will unsubscribe this listener when using the {@link unsubscribe_all} function. */
	register_subs(...handles: DojoJS.Handle[]): void {
		this.subscriptions.push(...handles);
	}

	/** Unsubscribes all listeners registered with {@link register_subs}. */
	unsubscribe_all(): void {
		this.subscriptions;
		this.comet_subscriptions;
		for (let t = null; this.subscriptions.length > 0; ) {
			t = this.subscriptions.shift()!;
			dojo.unsubscribe(t);
		}
		for (; this.comet_subscriptions.length > 0; ) {
			sub_id = this.comet_subscriptions.shift()!;
			g_sitecore.unsubscribeCometdChannel(sub_id);
		}
	}

	/** Registers a cometd subscription to the given comet id. This will unsubscribe this listener when using the {@link unsubscribe_all} function. */
	register_cometd_subs(...comet_ids: string[]): string | string[] {
		this.comet_subscriptions.push(...comet_ids);
		return comet_ids;
	}

	/** Although this function is defined on core, it is a wrapper for the {@link SiteCore.showMessage} function and always overridden. */
	showMessage(
		message: string,
		type?: "info" | "error" | "only_to_log" | string
	): void {
		g_sitecore.showMessage(message, type);
	}

	/**
	 * Moves an element such that the visual position of the `target` element is located at the top-left of the `location` element. This is not really an animation, but placeOnObject is frequently used to set up the initial position of an element before an animation is performed.
	 * @param target The element to move.
	 * @param location The element to move the target to.
	 * @example this.placeOnObject('my_element', 'my_location');
	 */
	placeOnObject(
		target: string | HTMLElement,
		location: string | HTMLElement
	): void {
		null === target &&
			console.error("placeOnObject: mobile obj is null");
		null === location &&
			console.error("placeOnObject: target obj is null");
		if ("string" == typeof target)
			var n = $(target)!;
		else n = target;
		var o = this.disable3dIfNeeded(),
			a = dojo.position(location),
			s = dojo.position(target),
			r = dojo.style(target, "left"),
			l = dojo.style(target, "top"),
			d = {
				x: a.x - s.x + (a.w! - s.w!) / 2,
				y: a.y - s.y + (a.h! - s.h!) / 2,
			},
			c = this.getAbsRotationAngle(n.parentNode as Element),
			h = this.vector_rotate(d, c);
		r += h.x;
		l += h.y;
		dojo.style(target, "top", l + "px");
		dojo.style(target, "left", r + "px");
		this.enable3dIfNeeded(o);
	}

	/**
	 * Moves an element such that the visual position of the `target` element is located at the top-left of the `location` element, with an offset. This is not really an animation, but placeOnObject is frequently used to set up the initial position of an element before an animation is performed.
	 * @param target The element to move.
	 * @param location The element to move the target to.
	 * @param relativeX The x offset from the top-left of the location element.
	 * @param relativeY The y offset from the top-left of the location element.
	 * @example this.placeOnObjectPos('my_element', 'my_location', 10, 10);
	 * @throws TypeError if target or location is null.
	 */
	placeOnObjectPos(
		target: string | HTMLElement,
		location: string | HTMLElement,
		relativeX: number,
		relativeY: number
	): void | throws<TypeError> {
		null === target &&
			console.error("placeOnObject: mobile obj is null");
		null === location &&
			console.error("placeOnObject: target obj is null");
		if ("string" == typeof target) var a = $(target)!;
		else a = target;
		var s = this.disable3dIfNeeded(),
			r = dojo.position(location),
			l = dojo.position(target),
			d = dojo.style(target, "left"),
			c = dojo.style(target, "top"),
			h = {
				x: r.x - l.x + (r.w! - l.w!) / 2 + relativeX,
				y: r.y - l.y + (r.h! - l.h!) / 2 + relativeY,
			},
			u = this.getAbsRotationAngle(a.parentNode as Element),
			p = this.vector_rotate(h, u);
		d += p.x;
		c += p.y;
		dojo.style(target, "top", c + "px");
		dojo.style(target, "left", d + "px");
		this.enable3dIfNeeded(s);
	}

	/** If 3D is enabled (that is, the 'ebd-body' element has the 'mode_3d' class), disable the 3d and return the previous transform value. This is useful for translating DOM elements in 2d space, then re-enabling using {@link enable3dIfNeeded}. */
	disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null {
		if (dojo.hasClass("ebd-body", "mode_3d")) {
			dojo.removeClass("ebd-body", "enableTransitions");
			var t = $("game_play_area")!.style.transform;
			dojo.removeClass("ebd-body", "mode_3d");
			dojo.style(
				"game_play_area",
				"transform",
				"rotatex(0deg) translate(0px,0px) rotateZ(0deg)"
			);
			return t;
		}
		return null;
	}

	/** Adds the  'mode_3d' class to the 'ebd-body' element if needed, and sets the transform style. If the transform is undefined/null, then this will have no effect. */
	enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void {
		if (null !== transform) {
			dojo.style("game_play_area", "transform", transform);
			dojo.addClass("ebd-body", "mode_3d");
		}
	};

	/** Gets the Z position of an element by using window.getComputedStyle() and pulling it from the view matrix. */
	// TODO: Does this really throw an error when a string is passed for the element?
	getComputedTranslateZ(element: Element): number {
		// @ts-ignore - Always true on modern browsers.
		if (window.getComputedStyle) {
			var t = getComputedStyle(element),
				i = (
					t.transform ||
					t.webkitTransform ||
					// @ts-ignore - obsolete
					t.mozTransform
				).match(/^matrix3d\((.+)\)$/);
			return i ? ~~i[1].split(", ")[14] : 0;
		}
		return undefined as any;
	}

	/**
	 * Slides an element to a target element on the z axis.
	 */
	transformSlideAnimTo3d(
		baseAnimation: InstanceType<typeof dojo.Animation>,
		target: HTMLElement, // TODO: see getComputedTranslateZ
		duration: number,
		delay: number,
		x?: number,
		y?: number
	): InstanceType<typeof dojo.Animation> {
		if (dojo.hasClass("ebd-body", "mode_3d")) {
			if (undefined === x || undefined === y) var r = 50;
			else {
				var l = Math.sqrt(x * x + y * y);
				r = Math.max(
					20,
					Math.min(80, Math.round(l / 2))
				);
			}
			var d = this.getComputedTranslateZ(target);
			null == duration && (duration = 500);
			null == delay && (delay = 0);
			"string" == typeof target && (target = $(target)!);
			var c = new dojo.Animation({
					curve: [d, d + r],
					delay: delay,
					duration: duration / 2,
					onAnimate: dojo.hitch(this, function (e: number) {
						target.style.transform =
							"translateZ(" + e + "px)";
					}),
				}),
				h = new dojo.Animation({
					curve: [d + r, d],
					delay: delay + duration / 2,
					duration: duration / 2,
					onAnimate: dojo.hitch(this, function (e: number) {
						target.style.transform =
							"translateZ(" + e + "px)";
					}),
				});
			return dojo.fx.combine([baseAnimation, c, h]);
		}
		return baseAnimation;
	}

	/**
	 * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
	 * @param target The element to move. This object must be "relative" or "absolute" positioned.
	 * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
	 * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
	 * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @throws TypeError if target/destination is not a valid element.
	 * @example this.slideToObject( "some_token", "some_place_on_board" ).play();
	 */
	slideToObject(
		target: string | HTMLElement,
		destination: string | HTMLElement,
		duration?: number,
		delay?: number
	): InstanceType<typeof dojo.Animation> | throws<TypeError> {
		null === target &&
			console.error("slideToObject: mobile obj is null");
		null === destination &&
			console.error("slideToObject: target obj is null");
		if ("string" == typeof target) var a = $(target) as HTMLElement;
		else a = target;
		var s = this.disable3dIfNeeded(),
			r = dojo.position(destination),
			l = dojo.position(target);
		undefined === duration && (duration = 500);
		undefined === delay && (delay = 0);
		if (this.instantaneousMode) {
			delay = Math.min(1, delay);
			duration = Math.min(1, duration);
		}
		var d = dojo.style(target, "left"),
			c = dojo.style(target, "top"),
			h = {
				x: r.x - l.x + (r.w! - l.w!) / 2,
				y: r.y - l.y + (r.h! - l.h!) / 2,
			},
			u = this.getAbsRotationAngle(a.parentNode as Element),
			p = this.vector_rotate(h, u);
		d += p.x;
		c += p.y;
		this.enable3dIfNeeded(s);
		var m = dojo.fx.slideTo({
			node: target,
			top: c,
			left: d,
			delay: delay,
			duration: duration,
			// @ts-ignore - this should be "units" but is incorrect.
			unit: "px",
		});
		null !== s &&
			(m = this.transformSlideAnimTo3d(
				m,
				a,
				duration,
				delay,
				p.x,
				p.y
			));
		return m;
	}

	/**
	 * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
	 * @param target The element to move. This object must be "relative" or "absolute" positioned.
	 * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
	 * @param x Defines the x offset in pixels to apply to the target position.
	 * @param y Defines the y offset in pixels to apply to the target position.
	 * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
	 * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @throws TypeError if target/destination is not a valid element, x/y is not a number, or the 'left'/'top' style properties are not numbers.
	 * @example this.slideToObjectPos( "some_token", "some_place_on_board", x, y ).play();
	 */
	slideToObjectPos(
		target: string | HTMLElement,
		destination: string | HTMLElement,
		x: Parameters<typeof toint>[0],
		y: Parameters<typeof toint>[0],
		duration?: number,
		delay?: number
	): InstanceType<typeof dojo.Animation> | throws<TypeError> {
		null === target &&
			console.error(
				"slideToObjectPos: mobile obj is null"
			);
		null === destination &&
			console.error(
				"slideToObjectPos: target obj is null"
			);
		null === x &&
			console.error("slideToObjectPos: target x is null");
		null === y &&
			console.error("slideToObjectPos: target y is null");
		if ("string" == typeof target) var r = $(target) as HTMLElement;
		else r = target;
		var l = this.disable3dIfNeeded(),
			d = dojo.position(destination),
			c = dojo.position(target);
		undefined === duration && (duration = 500);
		undefined === delay && (delay = 0);
		if (this.instantaneousMode) {
			delay = Math.min(1, delay);
			duration = Math.min(1, duration);
		}
		var h = dojo.style(target, "left"),
			u = dojo.style(target, "top"),
			p = {
				x: d.x - c.x + toint(x)!,
				y: d.y - c.y + toint(y)!,
			},
			m = this.getAbsRotationAngle(r.parentNode as Element),
			g = this.vector_rotate(p, m);
		h += g.x;
		u += g.y;
		this.enable3dIfNeeded(l);
		var f = dojo.fx.slideTo({
			node: target,
			top: u,
			left: h,
			delay: delay,
			duration: duration,
			easing: dojo.fx.easing.cubicInOut,
			// @ts-ignore - this should be "units" but is incorrect.
			unit: "px",
		});
		null !== l &&
			(f = this.transformSlideAnimTo3d(
				f,
				r,
				duration,
				delay,
				g.x,
				g.y
			));
		return f;
	}

	/**
	 * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
	 * @param target The element to move. This object must be "relative" or "absolute" positioned.
	 * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
	 * @param xpercent Defines the x offset in percent to apply to the target position.
	 * @param ypercent Defines the y offset in percent to apply to the target position.
	 * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
	 * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @throws TypeError if target/destination is not a valid element or the 'left'/'top' style properties are not numbers.
	 * @example this.slideToObjectPos( "some_token", "some_place_on_board", 50, 50 ).play();
	 */
	slideToObjectPctPos(
		target: string | HTMLElement,
		destination: string | HTMLElement,
		xpercent: number,
		ypercent: number,
		duration?: number,
		delay?: number
	): InstanceType<typeof dojo.Animation> | throws<TypeError> {
		null === destination &&
			console.error(
				"slideToObjectPctPos: target obj is null"
			);
		var r = dojo.position(destination),
			l = Math.round((r.w! * xpercent) / 100),
			d = Math.round((r.h! * ypercent) / 100);
		return this.slideToObjectPos(target, destination, l, d, duration, delay);
	}

	/** Converts the given angle in degrees to radians. Same as `angle * Math.PI / 180`. */
	toRadians(angle: number): number {
		return angle * (Math.PI / 180);
	}

	/** Rotates the vector by the given angle in degrees. */
	vector_rotate(
		vector: { x: number; y: number },
		angle: number
	): { x: number; y: number } {
		if (0 == angle) return vector;
		var i = -this.toRadians(angle);
		return {
			x: vector.x * Math.cos(i) - vector.y * Math.sin(i),
			y: vector.x * Math.sin(i) + vector.y * Math.cos(i),
		};
	}

	/**
	 * This destroys the `target` element and all its connectors (onClick, etc), then places a clone positioned at the original location but attached to the `newParent` element. This is useful for moving elements between different containers. See {@link GameguiCookbook.attachToNewParentNoDestroy} for a version that does not destroy the target element.
	 * Changing the HTML parent of an element can be useful for the following reasons:
	 * - When the HTML parent moves, all its child are moving with them. If some game elements is no more linked with a parent HTML object, you may want to attach it to another place.
	 * - The z_order (vertical order of display) depends on the position in the DOM, so you may need to change the parent of some game elements when they are moving in your game area.
	 * @param target The element to move.
	 * @param newParent The new parent element to attach the target to. Note that the position of the target will remain visually the same.
	 * @param position The child index which this should be inserted at. If a string, it will be inserted matching the type, otherwise it will be inserted at the given index.
	 * @returns The new element that was created.
	 * @throws TypeError if target or newParent is not a valid element id.
	 */
	attachToNewParent(
		target: string | HTMLElement,
		newParent: string | HTMLElement,
		position?: DojoJS.PlacePosition
	): HTMLElement | throws<TypeError> {
		"string" == typeof target && (target = $(target) as HTMLElement);
		"string" == typeof newParent && (newParent = $(newParent) as HTMLElement);
		undefined === position && (position = "last");
		null === target &&
			console.error(
				"attachToNewParent: mobile obj is null"
			);
		null === newParent &&
			console.error(
				"attachToNewParent: new_parent is null"
			);
		var o = this.disable3dIfNeeded(),
			a = dojo.position(target),
			s = this.getAbsRotationAngle(target),
			r = dojo.clone(target);
		dojo.destroy(target);
		dojo.place(r, newParent, position);
		var l = dojo.position(r),
			d = dojo.style(r, "left"),
			c = dojo.style(r, "top"),
			h = this.getAbsRotationAngle(r),
			u = this.getAbsRotationAngle(newParent),
			p = {
				x: a.x - l.x + (a.w! - l.w!) / 2,
				y: a.y - l.y + (a.h! - l.h!) / 2,
			},
			m = this.vector_rotate(p, u);
		d += m.x;
		c += m.y;
		dojo.style(r, "top", c + "px");
		dojo.style(r, "left", d + "px");
		h != s && this.rotateInstantDelta(r, s - h);
		this.enable3dIfNeeded(o);
		return r;
	}

	/**
	 * This destroys the `target` element and all its connectors (onClick, etc), then places a clone positioned and attached to the `newParent` element.
	 * Changing the HTML parent of an element can be useful for the following reasons:
	 * - When the HTML parent moves, all its child are moving with them. If some game elements is no more linked with a parent HTML object, you may want to attach it to another place.
	 * - The z_order (vertical order of display) depends on the position in the DOM, so you may need to change the parent of some game elements when they are moving in your game area.
	 * @param target The element to move.
	 * @param newParent The new parent element to attach the target to. Note that the position of the target will remain visually the same.
	 * @param position The child index which this should be inserted at. If a string, it will be inserted matching the type, otherwise it will be inserted at the given index.
	 * @returns The new element that was created.
	 * @throws TypeError if target or newParent is not a valid element id.
	 */
	attachToNewParentNoReplace(
		target: string | HTMLElement,
		newParent: string | HTMLElement,
		position: DojoJS.PlacePosition
	): HTMLElement | throws<TypeError> {
		"string" == typeof target && (target = $(target) as HTMLElement);
		"string" == typeof newParent && (newParent = $(newParent) as HTMLElement);
		undefined === position && (position = "last");
		null === target &&
			console.error(
				"attachToNewParent: mobile obj is null"
			);
		null === newParent &&
			console.error(
				"attachToNewParent: new_parent is null"
			);
		var o = dojo.clone(target);
		dojo.destroy(target);
		dojo.place(o, newParent, position);
		return o;
	}

	/**
	 * Slides a new element from a source location to a destination location. The temporary object created from an html string. This is useful when you want to slide a temporary HTML object from one place to another. As this object does not exists before the animation and won't remain after, it could be complex to create this object (with dojo.place), to place it at its origin (with placeOnObject) to slide it (with slideToObject) and to make it disappear at the end.
	 * @param temporaryHTML HTML string or a node that represents the object to slide. This will be destroyed after the animation ends.
	 * @param parent The ID of an HTML element of your interface that will be the parent of this temporary HTML object.
	 * @param from The element representing the origin of the slide.
	 * @param to The element representing the target of the slide.
	 * @param duration (optional) The duration in milliseconds of the slide. The default is 500 milliseconds.
	 * @param delay (optional) If you define a delay, the slide will start only after this delay. This is particularly useful when you want to slide several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @returns The animation object that can be played.
	 * @example this.slideTemporaryObject('<div class="token_icon"></div>', 'tokens', 'my_origin_div', 'my_target_div').play();
	 */
	slideTemporaryObject(
		temporaryHTML: Node | string | DocumentFragment,
		parent: string | HTMLElement,
		from: string | HTMLElement,
		to: string | HTMLElement,
		duration?: number,
		delay?: number
	): InstanceType<typeof dojo.Animation> {
		var r = dojo.place(temporaryHTML, parent);
		dojo.style(r, "position", "absolute");
		dojo.style(r, "left", "0px");
		dojo.style(r, "top", "0px");
		this.placeOnObject(r, from);
		var l = this.slideToObject(r, to, duration, delay);
		dojo.connect(l, "onEnd", function (t) {
			dojo.destroy(t);
		});
		l.play();
		return l;
	}


	/**
	 * Slides an existing html element to some destination and destroys it upon arrival. This is a handy shortcut to slide an existing HTML object to some place then destroy it upon arrival. It can be used for example to move a victory token or a card from the board to the player panel to show that the player earns it, then destroy it when we don't need to keep it visible on the player panel.
	 * This works the same as `slideToObject` and takes the same arguments, however, it plays the animation immediately and destroys the object upon arrival.
	 * CAREFUL: Make sure nothing is creating the same object at the same time the animation is running, because this will cause some random disappearing effects.
	 * @param target The element to move.
	 * @param destination The element to move the target to.
	 * @param duration (optional) The duration in milliseconds of the slide. The default is 500 milliseconds.
	 * @param delay (optional) If you define a delay, the slide will start only after this delay. This is particularly useful when you want to slide several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
	 * @example this.slideToObjectAndDestroy( "some_token", "some_place_on_board", 1000, 0 );
	 */
	slideToObjectAndDestroy(
		target: string | HTMLElement,
		destination: string | HTMLElement,
		duration?: number,
		delay?: number
	): void {
		dojo.style(target, "zIndex", 100 as any);
		var a = this.slideToObject(target, destination, duration, delay);
		dojo.connect(a, "onEnd", function (t) {
			dojo.destroy(t);
		});
		a.play();
	}

	/**
	 * Fades out the target node, then destroys it. This call starts the animation.
	 * CAREFUL: the HTML node still exists until during few milliseconds, until the fadeOut has been completed. Make sure nothing is creating same object at the same time as animation is running, because you will be some random disappearing effects.
	 * @param target The element to fade out and destroy.
	 * @param duration (optional) The duration in milliseconds of the fade out. The default is 500 milliseconds.
	 * @param delay (optional) If you define a delay, the fade out will start only after this delay. This is particularly useful when you want to fade out several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the fade out.
	 * @example this.fadeOutAndDestroy( "a_card_that_must_disappear" );
	 */
	fadeOutAndDestroy(
		target: string | HTMLElement,
		duration: number = 500,
		delay: number = 0
	): void {
		undefined === duration && (duration = 500);
		undefined === delay && (delay = 0);
		this.instantaneousMode && (duration = Math.min(1, duration));
		var o = dojo.fadeOut({ node: target, duration: duration, delay: delay });
		dojo.connect(o, "onEnd", function (t) {
			dojo.destroy(t);
		});
		o.play();
	}

	/**
	 * Rotates an element to a target degree without using an animation.
	 * @param target The element to rotate.
	 * @param degree The degree to rotate the element to.
	 * @example this.rotateInstantTo( "a_card_that_must_rotate", 90 );
	 */
	rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void {
		"string" == typeof target && (target = $(target) as HTMLElement);
		degree = tofloat(degree)!;
		var n: number = 0;
		undefined !== this.rotateToPosition[target.id] &&
			(n = this.rotateToPosition[target.id]!);
		if (degree != n) {
			var o: typeof this.transform;
			dojo.forEach(
				[
					"transform",
					"WebkitTransform",
					"msTransform",
					"MozTransform",
					"OTransform",
				],
				function (test) {
					// @ts-ignore - This is testing if the style property exists.
					undefined !== dojo.body().style[test] && (o = test);
				}
			);
			this.transform = o!;
			dojo.style(target, this.transform, "rotate(" + degree + "deg)");
			this.rotateToPosition[target.id] = degree;
		}
	}

	/**
	 * Rotates an element by a delta degree using an animation. It starts the animation, and stored the rotation degree in the class, so next time you rotate object - it is additive. There is no animation hooks in this one.
	 * @param target The element to rotate.
	 * @param delta The degree to rotate the element by.
	 * @example this.rotateDelta( "a_card_that_must_rotate", 90 );
	 */
	rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void {
		"string" == typeof target && (target = $(target) as HTMLElement);
		delta = tofloat(delta)!;
		undefined !== this.rotateToPosition[target.id]
			? this.rotateInstantTo(
					target,
					this.rotateToPosition[target.id]! + delta
			  )
			: this.rotateInstantTo(target, delta);
	}

	/**
	 * Rotates an element to a target degree using an animation. It starts the animation, and stored the rotation degree in the class, so next time you rotate object - it is additive. There is no animation hooks in this one.
	 * @param target The element to rotate.
	 * @param degree The degree to rotate the element to.
	 * @example this.rotateTo( "a_card_that_must_rotate", 90 );
	 * 
	 * // Same as follows:
	 * var animation = new dojo.Animation({
	 * 	curve: [fromDegree, toDegree],
	 * 	onAnimate: (v) => {
	 * 		target.style.transform = 'rotate(' + v + 'deg)';
	 * 	} 
	 * });
		
	* animation.play();
	*/
	rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void {
		"string" == typeof target && (target = $(target) as HTMLElement);
		degree = tofloat(degree)!;
		var n: typeof this.transform;
		dojo.forEach(
			[
				"transform",
				"WebkitTransform",
				"msTransform",
				"MozTransform",
				"OTransform",
			],
			function (t) {
				// @ts-ignore - This is testing if the style property exists.
				undefined !== dojo.body().style[t] && (n = t);
			}
		);
		this.transform = n!;
		var o = 0;
		undefined !== this.rotateToPosition[target.id] &&
			(o = this.rotateToPosition[target.id]!);
		if (degree != o) {
			for (; degree > o + 180; ) degree -= 360;
			for (; degree < o - 180; ) degree += 360;
			this.rotateToPosition[target.id] = degree;
			new dojo.Animation({
				curve: [o, degree],
				onAnimate: dojo.hitch(this, function (e) {
					target.style[this.transform!] =
						"rotate(" + e + "deg)";
				}),
			}).play();
		}
	}

	/**
	 * Returns the rotation angle of the given element as it is stored in the {@link rotateToPosition} record. If the object does not have a stored rotation it will default to 0. This recursively sum the rotation of all parent elements.
	 * @param target The element to get the rotation of.
	 * @returns The rotation angle of the element.
	 */
	getAbsRotationAngle(target: string | Element | null): number {
		var t: number | undefined = 0;
		"string" == typeof target && (target = $(target));
		if (null === target) return 0;
		if (undefined !== target.id) {
			undefined !== this.rotateToPosition[target.id] &&
				(t = this.rotateToPosition[target.id]);
			// @ts-ignore - This is a bug in the source code.
			if ("overall-content" == typeof target.id) return 0;
		}
		return undefined !== target.parentNode
			? t! + this.getAbsRotationAngle(target.parentNode as Element)
			: 0;
	}

	/**
	 * Adds the given style to all elements with the given class. This uses the dojo.query and dojo.style functions to apply the style to all elements with the given class.
	 * @param className The class name of the
	 * @param property The style property to apply.
	 * @param value The value to apply to the style property.
	 * @example this.addClassToClass( 'my_class', 'color', 'red' );
	 */
	addClassToClass<T extends keyof CSSStyleDeclaration>(
		className: string,
		property: T,
		value: CSSStyleDeclaration[T]
	): void {
		for (var o = dojo.query("." + className), a = 0; a < o.length; a++)
			dojo.style(o[a] as Element, property, value);
	}

	/**
	 * A wrapper for dojo.connect which maintains a list of all connections for easier cleanup and disconnecting. This is the recommended way to connect events in BGA when connecting permanent objects - if you just want to connect the temp object you should probably not use this method but use dojo.connect which won't require any clean-up. If you plan to destroy the element you connected, you must call this.disconnect() to prevent memory leaks.
	 *
	 * Note: dynamic connect/disconnect is for advanced cases ONLY, you should always connect elements statically if possible, i.e. in setup() method.
	 * @param target The element to connect the event to.
	 * @param event The event to connect to.
	 * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
	 * @example this.connect( $('my_element'), 'onclick', 'onClickOnMyElement' );
	 * @example this.connect( $('my_element'), 'onclick', (e) => { console.log('boo'); } );
	 */
	
	// Connect to specified target that contains the 'addEventListener' method using the name of a method on the scope...
	connect<K extends keyof DojoJS.AllEvents>(
		targetObject: DojoJS.ConnectListenerTarget<K>,
		event: K | `on${K}`,
		method: keyof this): void;
	// Connect to specified target that contains the 'addEventListener' method using the given function (which uses scope as 'this')...
	connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(
		targetObject: DojoJS.ConnectListenerTarget<K>,
		event: K | `on${K}`,
		method: M,
		dontFix?: boolean): void;
	// Connect to a specified target's method/event name using the name of a method on the scope...
	connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(
		targetObject: T,
		event: U,
		method: keyof this): void;
	// Connect to a specified target's method/event name using the given function (which uses scope as 'this')...
	connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>>>(
		targetObject: T,
		event: U,
		method: M,
		dontFix?: boolean): void;

	connect(
		targetObject: any,
		event: string,
		method: any): void {
		if (null != targetObject)
			this.connections.push({
				element: targetObject,
				event: event,
				handle: dojo.connect(targetObject, event, this, method),
			});
	}

	/**
	 * Disconnects any event handler previously registered with `connect` or `connectClass` that matches the element and event.
	 * @param target The element to disconnect the event from.
	 * @param event The event to disconnect.
	 * @example this.disconnect( $('my_element'), 'onclick');
	*/
	disconnect<K extends keyof DojoJS.AllEvents>(
		targetObject: DojoJS.ConnectListenerTarget<K>,
		event: K | `on${K}`): void;
	disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(
		targetObject: T,
		event: U): void;
	disconnect(targetObject: any, event: string): void {
		dojo.forEach(this.connections, function (n) {
			n.element == targetObject &&
				n.event == event &&
				dojo.disconnect(n.handle);
		});
	}

	/**
	 * Same as `connect` but for all the nodes set with the specified css className.
	 * @param className The class name of the elements to connect the event to.
	 * @param event The event to connect to.
	 * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
	 * @example this.connectClass('pet', 'onclick', 'onPet');
	 */
	connectClass<K extends keyof DojoJS.AllEvents>(
		className: string,
		event: K | `on${K}`,
		method: keyof this): void;
	connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(
		className: string,
		event: K | `on${K}`,
		method: M): void;
	
	connectClass(className: string, event: keyof DojoJS.AllEvents, method: any): void {
		this.connectQuery("." + className, event, method);
	}

	/**
	 * Connects an event to a query selector. This is a wrapper for dojo.connect that uses dojo.query to find the elements to connect the event to. This is useful for connecting events to elements that are created dynamically.
	 * @param selector The query selector to find the elements to connect the event to.
	 * @param event The event to connect to.
	 * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
	 */
	connectQuery<K extends keyof DojoJS.AllEvents>(
		selector: string,
		event: K | `on${K}`,
		method: keyof this): void;
	connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(
		selector: string,
		event: K | `on${K}`,
		method: M): void;
	connectQuery(selector: string, event: keyof DojoJS.AllEvents, method: any): void {
		for (var o = dojo.query(selector), a = 0; a < o.length; a++) {
			var s = o[a]!;
			this.connections.push({
				element: s,
				event: event,
				handle: dojo.connect(s as any, event, this, method),
			});
		}
	}

	/** Alias for {@link connectClass}. See {@link connectClass} for more information. */
	addEventToClass<K extends keyof DojoJS.AllEvents>(
		className: string,
		event: K | `on${K}`,
		method: keyof this): void;
	addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(
		className: string,
		event: K | `on${K}`,
		method: M): void;
	
	addEventToClass(className: string, event: keyof DojoJS.AllEvents, method: any): void {
		this.connectClass(className, event, method);
	}

	/**
	 * Disconnects all previously registed event handlers (registered via `connect` or `connectClass`).
	 * @example this.disconnectAll();
	 */
	disconnectAll(): void {
		dojo.forEach(this.connections, function (t) {
			dojo.disconnect(t.handle);
		});
		this.connections = [];
	}

	/**
	 * Updates the global `this.gamedatas.counters` and sets the element `counter_name` to the new value.
	 * @param counter_name The counter to update.
	 * @param new_value The new value of the counter.
	 * @throws TypeError if the counter does not exist in `this.gamedatas.counters` or if the `counter_name` does not refer to a valid element.
	 */
	setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError> {
		var i = this.gamedatas!.counters![counter_name]!;
		i.counter_value = new_value;
		$(i.counter_name)!.innerHTML = String(i.counter_value);
	}

	/**
	 * Increments the global `this.gamedatas.counters` and the value of the element `counter_name` by `delta`.
	 * @param counter_name The counter to increment.
	 * @param delta The amount to increment the counter by.
	 * @throws TypeError if the counter does not exist in `this.gamedatas.counters` or if the `counter_name` does not refer to a valid element.
	 */
	incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void {
		var i = this.gamedatas!.counters![counter_name]!;
		i.counter_value =
			parseInt(String(i.counter_value)) + parseInt(String(delta));
		$(i.counter_name)!.innerHTML = String(i.counter_value);
	}

	/**
	 * Decrements the global `this.gamedatas.counters` and the value of the element `counter_name` by `delta`. Unlike {@link incCounter}, this will not allow the counter to go below 0.
	 * @param counter_name The counter to decrement.
	 * @param delta The amount to decrement the counter by.
	 * @throws TypeError if the counter does not exist in `this.gamedatas.counters` or if the `counter_name` does not refer to a valid element.
	 */
	decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void {
		var i = this.gamedatas!.counters![counter_name]!;
		i.counter_value =
			parseInt(i.counter_value.toString()) - parseInt(delta as string);
		i.counter_value < 0 && (i.counter_value = 0);
		$(i.counter_name)!.innerHTML = i.counter_value.toString();
	}

	/**
	 * Updates game counters in the player panel (such as resources). The `counters` argument is a map of counters (the key must match counter_name).
	 * @param counters A map of counters to update.
	 */
	updateCounters(counters?: Partial<BGA.Gamedatas["counters"]>): void {
		if (undefined !== counters)
		{
			var key: BGA.CounterNames;
			for (key in counters) {
				var val = counters[key]!;
				this.gamedatas!.counters![key] &&
					null != val.counter_value &&
					this.setCounter(
						val.counter_name,
						val.counter_value
					);
			}
		}
	}

	/**
	 * Creates the HTML used for {@link addTooltip} from the given content.
	 * @param helpStringTranslated The information about "what is this game element?".
	 * @param actionStringTranslated The information about "what happens when I click on this element?".
	 * @returns The HTML content of the tooltip.
	 */
	getHtmlFromTooltipinfos(
		helpStringTranslated: string,
		actionStringTranslated: string
	): string {
		var i = '<div class="midSizeDialog">';
		if ("" != helpStringTranslated) {
			i +=
				"<img class='imgtext' src='" +
				getStaticAssetUrl("img/layout/help_info.png") +
				"' alt='info' /> <span class='tooltiptext'>" +
				helpStringTranslated +
				"</span>";
			"" != actionStringTranslated && (i += "<br/>");
		}
		"" != actionStringTranslated &&
			(i +=
				"<img class='imgtext' src='" +
				getStaticAssetUrl("img/layout/help_click.png") +
				"' alt='action' /> <span class='tooltiptext'>" +
				actionStringTranslated +
				"</span>");
		return (i += "</div>");
	}

	/**
	 * Adds a tooltip to the DOM element. This is a simple text tooltip to display some information about "what is this game element?" and "what happens when I click on this element?". You must specify both of the strings. You can only use one and specify an empty string for the other one. When you pass text directly function _() must be used for the text to be marked for translation! Except for empty string. Parameter "delay" is optional. It is primarily used to specify a zero delay for some game element when the tooltip gives really important information for the game - but remember: no essential information must be placed in tooltips as they won't be displayed in some browsers (see Guidelines).
	 * @param target The id of the DOM element to add the tooltip to. This id is used for a dictionary lookup and using an id that already has a tooltip will overwrite the previous tooltip.
	 * @param helpStringTranslated The information about "what is this game element?".
	 * @param actionStringTranslated The information about "what happens when I click on this element?".
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltip( 'cardcount', _('Number of cards in hand'), '' );
	 */
	addTooltip(
		target: string,
		helpStringTranslated: string,
		actionStringTranslated: string,
		delay?: number
	): void {
		"string" != typeof target &&
			console.error(
				"Call addTooltip with an id that is not a string !"
			);
		this.tooltips[target] && this.tooltips[target].destroy();
		var a = 400;
		undefined !== delay && (a = delay);
		this.tooltips[target] = new dijit.Tooltip({
			connectId: [target],
			label: this.getHtmlFromTooltipinfos(helpStringTranslated, actionStringTranslated),
			showDelay: a,
		});
		this.bHideTooltips &&
			(this.tooltips[target].onShow = dojo.hitch(
				this.tooltips[target],
				function () {
					this.close();
				}
			) as () => void);
		dojo.connect($(target) as HTMLElement, "onclick", this.tooltips[target], "close");
		this.tooltipsInfos[target] = { hideOnHoverEvt: null };
		dojo.connect(
			this.tooltips[target],
			"_onHover",
			dojo.hitch(this, function () {
				null === this.tooltipsInfos[target]!.hideOnHoverEvt &&
					$("dijit__MasterTooltip_0") &&
					(this.tooltipsInfos[target]!.hideOnHoverEvt =
						dojo.connect(
							$("dijit__MasterTooltip_0") as HTMLElement,
							"onmouseenter",
							this.tooltips[target]!,
							"close"
						));
			})
		);
	}

	/**
	 * Adds an HTML tooltip to the DOM element. This is for more elaborate content such as presenting a bigger version of a card.
	 * @param target The id of the DOM element to add the tooltip to. This id is used for a dictionary lookup and using an id that already has a tooltip will overwrite the previous tooltip.
	 * @param html The HTML content of the tooltip.
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltipHtml( 'cardcount', '<div>Number of cards in hand</div>' );
	 */
	addTooltipHtml(target: string, html: string, delay?: number): void {
		html = '<div class="midSizeDialog">' + html + "</div>";
		this.tooltips[target] && this.tooltips[target].destroy();
		var o = 400;
		undefined !== delay && (o = delay);
		this.tooltips[target] = new dijit.Tooltip({
			connectId: [target],
			label: html,
			position: this.defaultTooltipPosition,
			showDelay: o,
		});
		this.bHideTooltips &&
			(this.tooltips[target].onShow = dojo.hitch(
				this.tooltips[target],
				function () {
					this.close();
				}
			));
		dojo.connect($(target)!, "onclick", this.tooltips[target], "close");
		this.tooltipsInfos[target] = { hideOnHoverEvt: null };
		dojo.connect(
			this.tooltips[target],
			"_onHover",
			dojo.hitch(this, function () {
				null === this.tooltipsInfos[target]!.hideOnHoverEvt &&
					$("dijit__MasterTooltip_0") &&
					(this.tooltipsInfos[target]!.hideOnHoverEvt =
						dojo.connect(
							$("dijit__MasterTooltip_0")!,
							"onmouseenter",
							this.tooltips[target]!,
							"close"
						));
			})
		);
	}

	/**
	 * Adds a simple text tooltip to all the DOM elements set with the specified css class. This is for more elaborate content such as presenting a bigger version of a card.
	 * @param className The class name of the elements to add the tooltip to.
	 * @param helpStringTranslated The information about "what is this game element?".
	 * @param actionStringTranslated The information about "what happens when I click on this element?".
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltipToClass( 'meeple', _('This is A Meeple'), _('Click to tickle') );
	 */
	addTooltipToClass(
		className: string,
		helpStringTranslated: string,
		actionStringTranslated: string,
		delay?: number
	): void {
		"." == className[0] && (className = className.substr(1));
		for (
			var a = dojo.query<HTMLElement>("." + className), s = 0;
			s < a.length;
			s++
		) {
			"" == a[s]!.id &&
				(a[s]!.id = dojox.uuid.generateRandomUuid());
			this.addTooltip(a[s]!.id, helpStringTranslated, actionStringTranslated, delay);
		}
	}

	/**
	 * Adds an HTML tooltip to all the DOM elements set with the specified css class. This is for more elaborate content such as presenting a bigger version of a card.
	 * @param className The class name of the elements to add the tooltip to.
	 * @param html The HTML content of the tooltip.
	 * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
	 * @example this.addTooltipHtmlToClass( 'meeple', '<div>This is A Meeple</div>' );
	 */
	addTooltipHtmlToClass(
		className: string,
		html: string,
		delay?: number
	): void {
		"." == className[0] && (className = className.substr(1));
		for (var o = dojo.query<HTMLElement>("." + className), a = 0; a < o.length; a++)
			"" != o[a]!.id
				? this.addTooltipHtml(o[a]!.id, html, delay)
				: console.error(
						"Add tooltip to an element with no id during addTooltipToClass " +
							className
				  );
	}

	/**
	 * Removes a tooltip from the DOM element.
	 * @param target The DOM element to remove the tooltip from.
	 * @example this.removeTooltip('cardcount');
	 */
	removeTooltip(target: string): void {
		this.tooltips[target] && this.tooltips[target].destroy();
	}

	/**
	 * Changes the {@link bHideTooltips} property and overrides all tooltips 'onShow' event to either block or unblock all tooltips from showing.
	 * @param displayType The type of display to set. 0 = unblock, 1 = block.
	 *
	 * Specific tooltips can be hidden by either calling {@link removeTooltip} or by setting the 'onShow' event to a noop function. This will be reverted whenever this function is called:
	 * @example this.tooltips['some_id'].onShow = () => {};
	 */
	switchDisplayTooltips(displayType: 0 | 1): void {
		this.bHideTooltips = 0 != displayType;
		if (this.bHideTooltips)
			for (let key in this.tooltips)
				this.tooltips[key]!.onShow = dojo.hitch(
					this.tooltips[key],
					function () {
						this.close();
					}
				);
		else
			for (let key in this.tooltips)
				this.tooltips[key]!.onShow = function () {};
	}

	/**
	 * Replaces a pseudo markup text with a proper html string, designed for comments. This function replaces the following:
	 * - `*<text>*`: bold
	 * - `---`: horizontal line
	 * - `[<color>]<text>[/color]`: Colored text, supporting red, green, and blue.
	 * - `!!!`: Warning icon from fa icons.
	 * - `[tip]`: A lightbulb icon from fa icons.
	 * @param text The text to apply the markup to.
	 * @returns The HTML string with the markup applied.
	 */
	applyCommentMarkup(text: string): string {
		text = text.replace(/\*(.*?)\*/g, "<b>$1</b>");
		text = replaceAll(text, "---", "<hr/>");
		text = replaceAll(text, "[red]", "<span style='color:red'>");
		text = replaceAll(text, "[/red]", "</span>");
		text = replaceAll(
			text,
			"[green]",
			"<span style='color:green'>"
		);
		text = replaceAll(text, "[/green]", "</span>");
		text = replaceAll(
			text,
			"[blue]",
			"<span style='color:blue'>"
		);
		text = replaceAll(text, "[/blue]", "</span>");
		text = replaceAll(
			text,
			"!!!",
			"<i class='fa  fa-exclamation-triangle'></i>"
		);
		return (text = replaceAll(
			text,
			"[tip]",
			"<i class='fa  fa-lightbulb-o'></i>"
		));
	}

	/**
	 * Shows a confirmation dialog to the user, with a yes and no button.
	 *
	 * CAREFUL: the general guideline of BGA is to AVOID the use of confirmation dialogs. Confirmation dialogs slow down the game and bother players. The players know that they have to pay attention to each move when they are playing online. The situations where you should use a confirmation dialog are the following:
	 * - It must not happen very often during a game.
	 * - It must be linked to an action that can really "kill a game" if the player does not pay attention.
	 * - It must be something that can be done by mistake (ex: a link on the action status bar).
	 * @param message The message to show to the user. Use _() to translate.
	 * @param yesHandler The handler to be called on yes.
	 * @param noHandler (optional) The handler to be called on no.
	 * @param param (optional) If specified, it will be passed to both handlers. If param is not defined, null will be passed instead.
	 * @example
	 * this.confirmationDialog(_("Are you sure you want to bake the pie?"), () => {
	 * 	this.bakeThePie();
	 * });
	 * return; // nothing should be called or done after calling this, all action must be done in the handler
	 */
	confirmationDialog<T = null>(
		message: string,
		yesHandler: (param: T) => any,
		noHandler?: (param: T) => any,
		param?: T
	): void {
		undefined === param && (param = null as T);
		undefined === this.confirmationDialogUid &&
			(this.confirmationDialogUid = 0);
		undefined === this.confirmationDialogUid_called &&
			(this.confirmationDialogUid_called = 0);
		this.confirmationDialogUid++;
		var a = new ebg.popindialog();
		a.create(
			"confirmation_dialog_" + this.confirmationDialogUid,
			null !== $("main-content")
				? "main-content"
				: "left-side"
		);
		a.setTitle(__("lang_mainsite", "Are you sure ?"));
		a.setMaxWidth(500);
		var s =
			"<div id='confirmation_dialog_" +
			this.confirmationDialogUid +
			"'>";
		s += message;
		s += "<br/><br/><div style='text-align: center;'>";
		s +=
			"<a class='bgabutton bgabutton_gray' id='infirm_btn_" +
			this.confirmationDialogUid +
			"' href='#'><span>" +
			__("lang_mainsite", "Please, no") +
			"</span></a> &nbsp; ";
		s +=
			"<a class='bgabutton bgabutton_blue' id='confirm_btn_" +
			this.confirmationDialogUid +
			"' href='#'><span>" +
			__("lang_mainsite", "I confirm") +
			"</span></a>";
		s += "</div></div>";
		a.setContent(s);
		a.hideCloseIcon();
		a.show();
		dojo.connect(
			$("confirm_btn_" + this.confirmationDialogUid) as HTMLElement,
			"onclick",
			this,
			function (e) {
				e.preventDefault();
				a.destroy();
				if (
					this.confirmationDialogUid_called ==
					this.confirmationDialogUid
				)
					undefined;
				else {
					this.confirmationDialogUid_called =
						this.confirmationDialogUid!;
					yesHandler(param);
				}
			}
		);
		dojo.connect(
			$("infirm_btn_" + this.confirmationDialogUid) as HTMLElement,
			"onclick",
			this,
			function (e) {
				e.preventDefault();
				a.destroy();
				if (null != noHandler)
					if (
						this.confirmationDialogUid_called ==
						this.confirmationDialogUid
					)
						undefined;
					else {
						this.confirmationDialogUid_called =
							this.confirmationDialogUid!;
						noHandler(param);
					}
			}
		);
	}

	/**
	 * Shows a warning dialog single 'duly noted' button. The di
	 *
	 */
	warningDialog(message: string, callback: () => any): void {
		var n = new ebg.popindialog();
		n.create("warning_dialog");
		n.setTitle(__("lang_mainsite", "Warning notice"));
		var o = "<div id='warning_dialog'>";
		o += message;
		o += "<br/><br/><div style='text-align: center'>";
		o +=
			"<a class='bgabutton bgabutton_blue' id='warning_btn' href='#'><span>" +
			__("lang_mainsite", "Duly noted!") +
			"</span></a>";
		o += "</div></div>";
		n.setContent(o);
		n.show();
		dojo.connect(
			$("warning_btn") as HTMLElement,
			"onclick",
			this,
			function (e) {
				e.preventDefault();
				n.destroy();
				callback();
			}
		);
	}

	/**
	 * Creates a dialog with the message and title, and a single button that says "Ok".
	 * (TODO This may be incorrect based on source ->) The dialog can only be closed by clicking the "Ok" button and will call the callback if it is provided. This is useful for displaying information to the user before preforming a possibly confusing action like reloading the page.
	 *
	 * {@link warningDialog} is similar but has difference styling.
	 * @param message The message to display in the dialog.
	 * @param title The title of the dialog.
	 * @param callback The callback to call when the "Ok" button is clicked.
	 * @param useSiteDialog (optional) If true, the dialog will be presented using the bgaConfirm function from the sites index.js file. Otherwise, a popup dialog with the id 'info_dialog' will be created.
	 * @returns The dialog that was created.
	 * @example
	 * this.infoDialog(_("You need to reload the page because the game is out of sync."), _("Out of Sync"), () => window.location.reload());
	 */
	infoDialog(
		message: string,
		title: string,
		callback?: () => any,
		useSiteDialog: boolean = true
	): void {
		if (useSiteDialog)
			svelte.bgaConfirm({
				title: title,
				description: message,
				noButton: false,
				yesButton: _("Ok"),
			}).then(callback);
		else {
			var s = new ebg.popindialog();
			s.create("info_dialog");
			s.setTitle(title);
			var r = "<div id='info_dialog'>";
			r += message;
			r += "<br/><br/><div style='text-align: center'>";
			r +=
				"<a class='bgabutton bgabutton_blue' id='info_btn' href='#'><span>" +
				__("lang_mainsite", "Ok") +
				"</span></a>";
			r += "</div></div>";
			s.setContent(r);
			s.show();
			dojo.connect(
				$("info_btn") as HTMLElement,
				"onclick",
				this,
				function (e) {
					e.preventDefault();
					s.destroy();
					undefined !== callback && callback();
				}
			);
		}
	}

	/**
	 * Shows a multiple choice dialog to the user. Note: there is no cancel handler, so make sure you gave user a choice to get out of it.
	 * @param message The message to show to the user. Use _() to translate.
	 * @param choices An array of choices.
	 * @param callback The handler to be called on choice made. The choice parameter is the INDEX of the choice from the array of choices.
	 * @example
	 * const keys = ["0", "1", "5", "10"];
	 * this.multipleChoiceDialog(_("How many bugs to fix?"), keys, (choice) => {
	 * 	if (choice==0) return; // cancel operation, do not call server action
	 * 	var bugchoice = keys[choice]; // choice will be 0,1,2,3 here
	 * 	this.ajaxcallwrapper("fixBugs", { number: bugchoice });
	 * });
	 * return; // must return here
	 */
	multipleChoiceDialog(
		message: string,
		choices: string[],
		callback: (choice: string) => void
	): void {
		var o = new ebg.popindialog();
		o.create("multipleChoice_dialog");
		o.setTitle(message);
		var a = "<div id='multipleChoice_dialog'>";
		a += "<br/><ul style='text-align:center'>";
		for (var s in choices)
			a +=
				"<li><a class='multiplechoice_btn bgabutton bgabutton_blue' id='choice_btn_" +
				s +
				"' href='#'><span>" +
				choices[s] +
				"</span></a></li>";
		a += "</ul>";
		a += "<br/>";
		a += "</div>";
		o.setContent(a);
		o.show();
		dojo.query<HTMLElement>(".multiplechoice_btn").connect(
			"onclick",
			this,
			function (e) {
				e.preventDefault();
				o.destroy();
				var t = (e.currentTarget as HTMLElement).id.substr(11);
				callback(t);
			}
		);
	}

	/**
	 * Shows a info dialog that also has a text field. See {@link infoDialog} for more information.
	 * @param title The title of the dialog.
	 * @param callback The callback to call when the "Ok" button is clicked. This is passed the unmodified value of the text field.
	 * @param message The message to display in the dialog. If omitted, the dialog will not have a message.
	 */
	askForValueDialog(
		title: string,
		callback: (value: string) => void,
		message?: string
	): void {
		var o = new ebg.popindialog();
		o.create("askforvalue_dialog");
		o.setTitle(title);
		undefined === message && (message = "");
		var a = "<div id='askforvalue_dialog'>";
		a += "<p>" + message + "</p>";
		a +=
			"<br/><input id='choicedlg_value' type='text' style='width:100%;height:30px'>";
		a += "<br/>";
		a +=
			"<a class='bgabutton bgabutton_blue' id='ok_btn' href='#'><span>" +
			__("lang_mainsite", "Ok") +
			"</span></a>";
		a += "</div>";
		o.setContent(a);
		o.show();
		($("choicedlg_value") as HTMLInputElement).focus();
		var s = function (t: Event) {
			dojo.stopEvent(t);
			o.destroy();
			var n = ($("choicedlg_value") as HTMLInputElement).value;
			callback(n);
		};
		dojo.connect(
			($("choicedlg_value") as HTMLInputElement),
			"onkeyup",
			this,
			dojo.hitch(this, function (e) {
				"Enter" === e.key && s(e);
			})
		);
		dojo.connect(
			$("ok_btn") as HTMLElement,
			"onclick",
			this,
			dojo.hitch(this, s)
		);
	}

	/**
	 * Displays a score value over an element to make the scoring easier to follow for the players. This is particularly useful for final scoring or other important scoring events.
	 * @param anchor The html element to place the animated score onto.
	 * @param color The hexadecimal RGB representation of the color (should be the color of the scoring player), but without a leading '#'. For instance, 'ff0000' for red.
	 * @param score The numeric score to display, prefixed by a '+' or '-'.
	 * @param duration (optional) The animation duration in milliseconds. The default is 1000.
	 * @param offset_x (optional) The x offset in pixels to apply to the scoring animation.
	 * @param offset_y (optional) The y offset in pixels to apply to the scoring animation.
	 * @example this.displayScoring('my_element', 'ff0000', '+5', 1000, 10, 10);
	 * @example
	 * // If you want to display successively each score, you can use this.notifqueue.setSynchronous() function.
	 * setupNotifications: function()   {
	 * 	dojo.subscribe( 'displayScoring', this, "notif_displayScoring" );
	 * 	...
	 * },
	 * notif_displayScoring: function(notif) {
	 * 	const duration = notif.args.duration ?? 1000;
	 * 	this.notifqueue.setSynchronous('displayScoring', duration );
	 * 	this.displayScoring( notif.args.target, notif.args.color, notif.args.score, duration);
	 * },
	 */
	displayScoring(
		anchor: string | HTMLElement,
		color: string,
		score: number,
		duration?: number,
		offset_x?: number,
		offset_y?: number
	): void {
		(undefined !== duration && null != duration) || (duration = 1e3);
		var r = dojo.place(
			this.format_string(
				'<div class="scorenumber">' +
					(score >= 0 ? "+" : "-") +
					"${score_number}</div>",
				{ score_id: anchor, score_number: Math.abs(score) }
			),
			anchor
		);
		undefined !== offset_x && undefined !== offset_y && null !== offset_x && null !== offset_y
			? this.placeOnObjectPos(r, anchor, offset_x, offset_y)
			: this.placeOnObject(r, anchor);
		dojo.style(r, "color", "#" + color);
		dojo.addClass(r, "scorenumber_anim");
		this.fadeOutAndDestroy(r, duration, 2e3);
	}

	/**
	 * Shows a bubble with a message in it. This is a comic book style speech bubble to express the players voices.
	 * Warning: if your bubble could overlap other active elements of the interface (buttons in particular), as it stays in place even after disappearing, you should use a custom class to give it the style "pointer-events: none;" in order to intercept click events.
	 * Note: If you want this visually, but want to take complete control over this bubble and its animation (for example to make it permanent) you can just use div with 'discussion_bubble' class on it, and content of div is what will be shown.
	 * @param anchor The id of the element to attach the bubble to.
	 * @param message The text to put in the bubble. It can be HTML.
	 * @param delay (optional) The delay in milliseconds. The default is 0.
	 * @param duration (optional) The duration of the animation in milliseconds. The default is 3000.
	 * @param custom_class (optional) An extra class to add to the bubble. If you need to override the default bubble style.
	 * @example this.showBubble('meeple_2', _('Hello'), 0, 1000, 'pink_bubble');
	 * @example
	 * // If you want to display successively each bubble, you can use this.notifqueue.setSynchronous() function.
	 * setupNotifications: function()   {
	 * 	dojo.subscribe( 'showBubble', this, "notif_showBubble" );
	 * 	...
	 * },
	 * notif_showBubble: function(notif) {
	 * 	const duration = notif.args.duration ?? 3000;
	 * 	this.notifqueue.setSynchronous('showBubble', duration );
	 * 	this.showBubble( notif.args.target, notif.args.text, notif.args.delay ?? 0, duration, notif.args.custom_class );
	 * },
	 */
	showBubble(
		anchor: string,
		message: string,
		delay?: number,
		duration?: number,
		custom_class?: string
	): void {
		undefined === this.discussionTimeout &&
			(this.discussionTimeout = {});
		undefined === delay && (delay = 0);
		undefined === duration && (duration = 3e3);
		delay > 0
			? setTimeout(
					dojo.hitch(this, function () {
						this.doShowBubble(anchor, message, custom_class);
					}),
					delay
			  )
			: this.doShowBubble(anchor, message, custom_class);
		if (this.discussionTimeout[anchor]) {
			clearTimeout(this.discussionTimeout[anchor]);
			delete this.discussionTimeout[anchor];
		}
		"" != message &&
			(this.discussionTimeout[anchor] = setTimeout(
				dojo.hitch(this, function () {
					this.doShowBubble(anchor, "");
				}),
				delay + duration
			));
	}

	/**
	 * Creates an concentric circles animated effect at the specified location relative to the anchor. This is useful for showing a point of interest or a special event, usually use to represent a mouse click of a player.
	 * @param anchor The id of the element to attach the effect to. The left and top are relative to this element.
	 * @param left The left offset.
	 * @param top The top offset.
	 * @param backgroundColor (optional) The background color of the circles. The default is 'red'.
	 */
	showClick(
		anchor: string,
		left: CSSStyleDeclaration["left"] | number,
		top: CSSStyleDeclaration["top"] | number,
		backgroundColor?: CSSStyleDeclaration["backgroundColor"]
	): void {
		undefined === backgroundColor && (backgroundColor = "red");
		undefined === this.showclick_circles_no
			? (this.showclick_circles_no = 0)
			: this.showclick_circles_no++;
		dojo.place(
			'<div id="showclick_circles_' +
				this.showclick_circles_no +
				'" class="concentric-circles" style="background-color:' +
				backgroundColor +
				";left:" +
				left +
				"px;top:" +
				top +
				'px"></div>',
			anchor
		);
		var a = this.showclick_circles_no;
		setTimeout(
			dojo.hitch(this, function () {
				dojo.destroy("showclick_circles_" + a);
			}),
			2200
		);
	}

	/**
	 * Returns a translated string representing the `rank` of the given placement.
	 * @param player_rank A number representing the placement of the player: 1 = 1st, 2 = 2nd, etc.
	 * @param dontOrderLosers If true, all players will be marked in the 1st, 2nd, 3rd, etc. order. If false, 1 = Winner and 2+ = Loser.
	 * @returns The translated string representing the rank.
	 */
	getRankString(
		player_rank: string | number,
		dontOrderLosers?: boolean | any
	): (typeof dontOrderLosers extends Falsy
		? "1st" | "2nd" | "3rd" | `${number}th`
		: "Winner" | "Loser") | "not ranked" | string
	{
		if (null === player_rank || "" === player_rank)
			return __("lang_mainsite", "not ranked");
		var i = "";
		1 == (player_rank = toint(player_rank)!)
			? (i =
					undefined !== dontOrderLosers && dontOrderLosers
						? __("lang_mainsite", "Winner")
						: __("lang_mainsite", "1st"))
			: 2 == player_rank
			? (i =
					undefined !== dontOrderLosers && dontOrderLosers
						? __("lang_mainsite", "Loser")
						: __("lang_mainsite", "2nd"))
			: 3 == player_rank
			? (i =
					undefined !== dontOrderLosers && dontOrderLosers
						? __("lang_mainsite", "Loser")
						: __("lang_mainsite", "3rd"))
			: player_rank > 3 &&
			  (i =
					undefined !== dontOrderLosers && dontOrderLosers
						? __("lang_mainsite", "Loser")
						: player_rank + __("lang_mainsite", "th"));
		return i;
	}

	/** Turns the number 0-100 into a translated karma label. If the number is out of range, undefined is returned. */
	getKarmaLabel(
		karma: number | string
	): { label: 'Perfect' | string; css: 'exceptional' } |
		{ label: 'Excellent' | string; css: 'perfect' } |
		{ label: 'Very good' | string; css: 'verygood' } |
		{ label: 'Good' | string; css: 'good' } |
		{ label: 'Average' | string; css: 'average' } |
		{ label: 'Not good' | string; css: 'notgood' } |
		{ label: 'Bad' | string; css: 'bad' } |
		{ label: 'Very bad' | string; css: 'verybad' }
		| undefined {
			return 100 == (karma = toint(karma)!)
				? { label: _("Perfect"), css: "exceptional" }
				: karma >= 90
				? { label: _("Excellent"), css: "perfect" }
				: karma >= 80
				? { label: _("Very good"), css: "verygood" }
				: karma >= 75
				? { label: _("Good"), css: "good" }
				: karma >= 65
				? { label: _("Average"), css: "average" }
				: karma >= 50
				? { label: _("Not good"), css: "notgood" }
				: karma >= 25
				? { label: _("Bad"), css: "bad" }
				: karma >= 0
				? { label: _("Very bad"), css: "verybad" }
				: undefined;
		}

	/**
	 * Returns the number of keys in an object by iteratively counting.
	 * @deprecated You should use Object.keys(obj).length instead.
	 */
	getObjectLength(obj: object): number {
		var t = 0;
		for (var _ in obj) t++;
		return t;
	}

	//#region Internal

	/** Internal. The list of comet subscriptions managed by {@link register_cometd_subs} and {@link unsubscribe_all}. The key is the comet id used for emits, and the number is the amount of subscriptions to that id. */
	comet_subscriptions: string[] = [];
	/** Internal. @deprecated This is not used within the main code file anymore. */
	unload_in_progress: boolean = false;
	/** Internal. See {@link cancelAjaxCall} form more information. Looks like this prevent callbacks on ajax calls. */
	bCancelAllAjax: boolean = false;
	/** Internal. Extra info about tooltips, used for events. */
	tooltipsInfos: Record<string, { hideOnHoverEvt: DojoJS.Handle | null }> = {};
	/** Internal. */
	mozScale: number = 1;
	/** Internal. Saved states for rotate functions (so preform quick translations). See {@link rotateTo}, {@link rotateInstantDelta}, and other flavors for more info. */
	rotateToPosition: Record<string, number> = {};
	/** Internal. The type and identifier for the room (T{table_id} = table, P{player_id}_{player_id} = private). */
	room: BGA.RoomId | null = null;
	/** Internal. The room that has been accepted by the player. Used for keeping the current room up to date. */
	already_accepted_room: BGA.RoomId | null = null;
	/** Internal. The {@link WebPush} object for this. This is initialized within {@link setupWebPush} */
	webpush: InstanceType<BGA.WebPush> | null = null;
	/** Internal. The currently set min width for this interface. This is different then {@link screenMinWidth} which is constant. */
	interface_min_width?: number;
	/** Internal. A counter used to create unique ids for confirmation dialogs that open at the same time (to maintain functionality). If undefined, no confirmation dialogs have been created. See {@link confirmationDialog} for more information. */
	confirmationDialogUid?: number;
	/** Internal. The uid for the last dialog that was confirmed, used to prevent double calling functions. If undefined, no confirmation dialogs have been created. See {@link confirmationDialog} for more information. */
	confirmationDialogUid_called?: number;
	/** Internal. Used to managed the state of bubbles from {@link showBubble} and {@link doShowBubble}. The keys of this record represent all active bubbles, and the value is the timeout that is currently running on that bubble. */
	discussionTimeout?: Record<string, number>;
	/** A counter representing the number of times {@link showClick} has been called. Used to create custom element id's for maintaining callbacks. */
	showclick_circles_no?: number;
	/** Internal. */
	number_of_tb_table_its_your_turn?: number;
	/** Internal. */
	prevent_error_rentry?: number;
	transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
	onresizePlayerAwardsEvent?: DojoJS.Handle;
	/** Internal. Automatic zoom factor applied to displays. This is usually used to scale down elements on smaller displays, like mobile. 1 == 100% normal scale. */
	gameinterface_zoomFactor?: number;

	/** Internal. Makes an ajax page request and loads the content into the given part of the DOM. The {@param loadTo} will be emptied before any new elements are added. */
	ajaxpageload<Scope>(
		requestUrl: string,
		requestData: object | string,
		loadOnto: string | HTMLElement,
		callbackScope: Scope,
		callback: DojoJS.HitchMethod<Scope, [data: any]>,
	): typeof import ("dojo/promise/Promise")<any> {
		g_sitecore.ajaxcall_running++;
		g_sitecore.updateAjaxCallStatus();
		// @ts-ignore - TODO: fix the xhrGet type
		return dojo.xhrGet({
			url: requestUrl,
			handleAs: "text",
			preventCache: true,
			content: requestData,
			timeout: 20000,
			load: dojo.hitch(this, function (response: any, ioArgs: any) {
				if (window.URL) {
					var currentUrl = new URL(ioArgs.xhr.responseURL);
					var requestedUrl = new URL(
						requestUrl,
						window.location.href
					);
					if (currentUrl.pathname != requestedUrl.pathname) {
						gotourl!(
							currentUrl.pathname +
								currentUrl.search +
								currentUrl.hash
						);
						return;
					}
				}
				dojo.empty(loadOnto);
				dojo.place(response, loadOnto);
				if ($("bga_fatal_error")) {
					if (800 == toint($("bga_fatal_error_code")!.innerHTML))
						dojo.publish("signalVisitorNotAllowed");
					else if (802 == toint($("bga_fatal_error_code")!.innerHTML))
						if (
							-1 != requestUrl.indexOf("preferences?section") ||
							"preferences" === requestUrl.substr(-11) ||
							"support" === requestUrl.substr(-7) ||
							"contact" === requestUrl.substr(-7)
						) {
						} else {
							var errorDescription = $(
								"bga_fatal_error_descr"
							)!.innerHTML.split(":");
							gotourl!(errorDescription[1]!);
						}
				} else dojo.hitch(callbackScope, callback as any)(response.data);
			}),
			error: dojo.hitch(
				this,
				function (this: CorePage_Template, error: Error, ioArgs: any) {
					if ("Request canceled" != error.message) {
						if (200 == ioArgs.xhr.status) {
							var responseText = ioArgs.xhr.responseText;
							if (
								"<" !=
								(responseText = responseText
									.replace(/^\s+/g, "")
									.replace(/\s+$/g, ""))[0]
							)
								this.showMessage(
									"Server syntax error: " +
										ioArgs.xhr.responseText,
									"error"
								);
							else {
								this.showMessage(
									"Callback error: " + error,
									"error"
								);
								console.error("Callback error: " + error);
							}
						} else {
							console.error(
								"HTTP code " +
									ioArgs.xhr.status +
									" " +
									requestUrl
							);
							this.displayUserHttpError(ioArgs.xhr.status);
						}
						console.error(
							"Error during ajaxpageload. HTTP status code: ",
							ioArgs.xhr.status
						);
					}
				}
			),
			handle: dojo.hitch(this, function (this: CorePage_Template, _0: any, _1: any) {
				g_sitecore.ajaxcall_running--;
				g_sitecore.updateAjaxCallStatus();
			}),
		});
	}

	/** Internal. Helper function for ajax calls used to present HTTP errors. This calls the {@link showMessage} function with a custom translated error matching the error code. */
	displayUserHttpError(error_code: string | number | null): void {
		if (!g_sitecore.page_is_unloading) {
			var message = "";
			switch ((error_code = toint(error_code))) {
				case 404:
					message = __(
						"lang_mainsite",
						"The requested page was not found"
					);
					break;
				case 500:
					message = __(
						"lang_mainsite",
						"The server reported an error."
					);
					break;
				case 407:
					message = __(
						"lang_mainsite",
						"You need to authenticate with a proxy."
					);
					break;
				case 0:
					message = __(
						"lang_mainsite",
						"Unable to contact the server. Are you connected ?"
					);
					break;
				default:
					message =
						__("lang_mainsite", "Unknown network error") +
						" (" +
						error_code +
						")";
			}
			this.showMessage(message, "error");
		}
	}

	/** Internal. Enables the {@link bCancelAllAjax} property which modifies how ajax callbacks are attached to the ajax requests. */
	cancelAjaxCall(): void {
		this.bCancelAllAjax = true;
	}

	/** Internal. Apply gender regex to some text. */
	applyGenderRegexps(t: string, i?: null | 0 | 1 | '0' | '1'): string {
		var n = bgaConfig.genderRegexps[dojo.config.locale.substr(0, 2)];
		if (undefined !== n) {
			var o = n.forMasculine;
			if (undefined !== o) {
				var a = false;
				if (undefined !== i && 1 == parseInt(i!.toString())) a = true;
				else
					for (var s = 0; s < this.gameMasculinePlayers.length; s++)
						t.match(
							new RegExp(">" + this.gameMasculinePlayers[s] + "<")
						) && (a = true);
				if (a)
					for (
						var r = Object.keys(o), l = Object.values(o), d = 0;
						d < r.length;
						d++
					)
						t = t.replace(
							new RegExp(replaceAll(r[d]!, "~", ""), "g"),
							l[d]!
						);
			}
			var c = n.forFeminine;
			if (undefined !== c) {
				a = false;
				if (undefined !== i && 0 == parseInt(i!.toString())) a = true;
				else
					for (s = 0; s < this.gameFemininePlayers.length; s++)
						t.match(
							new RegExp(">" + this.gameFemininePlayers[s] + "<")
						) && (a = true);
				if (a)
					for (
						r = Object.keys(c), l = Object.values(c), d = 0;
						d < r.length;
						d++
					)
						t = t.replace(
							new RegExp(replaceAll(r[d]!, "~", ""), "g"),
							l[d]!
						);
			}
			var h = n.forNeutral;
			if (undefined !== h) {
				a = false;
				if (undefined !== i && null === i) a = true;
				else
					for (s = 0; s < this.gameNeutralPlayers.length; s++)
						t.match(
							new RegExp(">" + this.gameNeutralPlayers[s] + "<")
						) && (a = true);
				if (a)
					for (
						r = Object.keys(h), l = Object.values(h), d = 0;
						d < r.length;
						d++
					)
						t = t.replace(
							new RegExp(replaceAll(r[d]!, "~", ""), "g"),
							l[d]!
						);
			}
		}
		return t;
	}

	/** Internal. Sets the {@link interface_min_width}. */
	adaptScreenToMinWidth(min_width: number): void {
		this.interface_min_width = min_width;
	}

	/** Internal. Preforms screen resizing by styling the body element with a zoom equal to a newly computed {@link currentZoom}. */
	adaptScreenToMinWidthWorker(): void {
		var t = dojo.position("ebd-body");
		if (dojo.isMozilla)
			console.error(
				"BGA Screen adaptation NOT SUPPORTED FOR MOZILLA BASED BROWSER"
			);
		else {
			var i = t.w! * this.currentZoom,
				n = this.screenMinWidth;
			dojo.hasClass("ebd-body", "game_interface") &&
				dojo.hasClass("ebd-body", "mobile_version") &&
				(n -= 240);
			this.currentZoom = i <= n ? i / n : 1;
			dojo.style("ebd-body", "zoom", this.currentZoom.toString());
		}
	}

	/** @deprecated This looks like it is using an old version of dojo position, and not called withing the source code. */
	getObjPosition(obj: HTMLElement | string): { x: number; y: number } {
		// @ts-ignore - this is no longer a function on the dojo object.
		var i = dojo.oldPosition(obj);
		if (1 != this.mozScale) {
			i.x /= this.mozScale;
			i.y /= this.mozScale;
			return i;
		}
		return i;
	}

	/** Internal. A purely helper function for {@link showBubble}. This is used like a local function would be to prevent duplication. Always used {@link showBubble} instead. */
	doShowBubble(anchor: string, message: string, custom_class?: string): void {
		if ("" == message) {
			this.discussionTimeout![anchor] &&
				delete this.discussionTimeout![anchor];
			var o = dojo.fadeOut({
				node: "discussion_bubble_" + anchor,
				duration: 100,
			});
			dojo.connect(o, "onEnd", function () {});
			o.play();
		} else {
			if (!$("discussion_bubble_" + anchor)) {
				var a = undefined === custom_class ? "" : custom_class;
				dojo.place(
					'<div id="discussion_bubble_' +
						anchor +
						'" class="discussion_bubble ' +
						a +
						'"></div>',
					anchor
				);
			}
			($("discussion_bubble_" + anchor) as HTMLElement).innerHTML = message;
			dojo.style(
				"discussion_bubble_" + anchor,
				"display",
				"block"
			);
			dojo.style("discussion_bubble_" + anchor, "opacity", 0);
			dojo.fadeIn({
				node: "discussion_bubble_" + anchor,
				duration: 100,
			}).play();
		}
	}

	/** Internal. Returns the translated <text>_displayed string. */
	getGameNameDisplayed(text: string): string {
		var t = __("lang_mainsite", text + "_displayed");
		return t == text + "_displayed" ? text : t;
	}

	formatReflexionTime(time: number) {
		var t = {
				string: "-- : --",
				mn: 0,
				s: 0 as (string | number),
				h: 0,
				positive: true,
			},
			i = true;
		if ((time = Math.round(time)) < 0) {
			time = -time;
			i = false;
		}
		var n = Math.floor(time / 60),
			o: string | number = time - 60 * n;
		o < 10 && (o = "0" + o);
		var a = Math.floor(n / 60),
			s = Math.floor(n / 1440);
		n -= 60 * a;
		t.mn = n;
		t.s = o;
		t.h = a;
		t.positive = i;
		if (isNaN(n) || isNaN(o as number)) t.string = "-- : --";
		else if (0 == a)
			t.string = i ? n + ":" + o : "-" + n + ":" + o;
		else if (s < 2) {
			var _n = n < 10 ? ("0" + n) : n;
			t.string = i ? a + "h" + _n : "-" + a + "h" + _n;
		} else
			t.string = i
				? s + " " + __("lang_mainsite", "days")
				: "-" + s + " " + __("lang_mainsite", "days");
		return t;
	}

	strip_tags(e: string, t?: string) {
		var i = "",
			n = false,
			o: any = [],
			a: any = [],
			s = "",
			r = 0,
			l = "",
			d = "",
			c = function (e: string, t: string, i: string) {
				return i.split(e).join(t);
			};
		t && (a = t.match(/([a-zA-Z0-9]+)/gi));
		o = (e += "").match(/(<\/?[\S][^>]*>)/gi);
		for (i in o)
			if (!isNaN(i as any)) {
				d = o[i].toString();
				n = false;
				for (l in a) {
					s = a[l];
					(r = -1) &&
						(r = d
							.toLowerCase()
							.indexOf("<" + s + ">"));
					r ||
						(r = d
							.toLowerCase()
							.indexOf("<" + s + " "));
					r &&
						(r = d.toLowerCase().indexOf("</" + s));
					if (!r) {
						n = true;
						break;
					}
				}
				n || (e = c(d, "", e));
			}
		return e;
	}

	validURL(e: any) {
		return !!new RegExp(
			"^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
			"i"
		).test(e);
	}

	nl2br(e: any, t: any) {
		return (e + "").replace(
			/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
			"$1" + (t || undefined === t ? "" : "<br>") + "$2"
		);
	}

	htmlentities(e: string, t: any, i: any, n: any) {
		var o = this.get_html_translation_table(
				"HTML_ENTITIES",
				t
			),
			a = "";
		e = null == e ? "" : e + "";
		if (!o) return false;
		t && "ENT_QUOTES" === t && (o["'"] = "&#039;");
		if (n || null == n)
			for (a in o)
				o.hasOwnProperty(a) &&
					(e = e.split(a).join(o[a]));
		else
			e = e.replace(
				/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g,
				function (e, t, i) {
					for (a in o)
						o.hasOwnProperty(a) &&
							(t = t.split(a).join(o[a]));
					return t + i;
				}
			);
		return e;
	}

	html_entity_decode(e: any, t: any) {
		var i: ReturnType<CorePage_Template['get_html_translation_table']> = {},
			n = "",
			o = "",
			a = "";
		o = e.toString();
		if (
			// @ts-ignore - this is a bad check.
			false === (i = this.get_html_translation_table(
				"HTML_ENTITIES",
				t
			))
		)
			return false;
		delete i["&"];
		i["&"] = "&amp;";
		for (n in i) {
			a = i[n]!;
			o = o.split(a).join(n);
		}
		return (o = o.split("&#039;").join("'"));
	}

	get_html_translation_table(e: any, t: any) {
		var n,
			o,
			a = {} as Buffer<string, 256>,
			s = {} as Record<string, string>,
			r = {} as string[],
			l = {} as string[];
		r[0] = "HTML_SPECIALCHARS";
		r[1] = "HTML_ENTITIES";
		l[0] = "ENT_NOQUOTES";
		l[2] = "ENT_COMPAT";
		l[3] = "ENT_QUOTES";
		n = isNaN(e)
			? e
				? e.toUpperCase()
				: "HTML_SPECIALCHARS"
			: r[e];
		o = isNaN(t)
			? t
				? t.toUpperCase()
				: "ENT_COMPAT"
			: l[t];
		if ("HTML_SPECIALCHARS" !== n && "HTML_ENTITIES" !== n)
			throw new Error("Table: " + n + " not supported");
		a[38] = "&amp;";
		if ("HTML_ENTITIES" === n) {
			a[160] = "&nbsp;";
			a[161] = "&iexcl;";
			a[162] = "&cent;";
			a[163] = "&pound;";
			a[164] = "&curren;";
			a[165] = "&yen;";
			a[166] = "&brvbar;";
			a[167] = "&sect;";
			a[168] = "&uml;";
			a[169] = "&copy;";
			a[170] = "&ordf;";
			a[171] = "&laquo;";
			a[172] = "&not;";
			a[173] = "&shy;";
			a[174] = "&reg;";
			a[175] = "&macr;";
			a[176] = "&deg;";
			a[177] = "&plusmn;";
			a[178] = "&sup2;";
			a[179] = "&sup3;";
			a[180] = "&acute;";
			a[181] = "&micro;";
			a[182] = "&para;";
			a[183] = "&middot;";
			a[184] = "&cedil;";
			a[185] = "&sup1;";
			a[186] = "&ordm;";
			a[187] = "&raquo;";
			a[188] = "&frac14;";
			a[189] = "&frac12;";
			a[190] = "&frac34;";
			a[191] = "&iquest;";
			a[192] = "&Agrave;";
			a[193] = "&Aacute;";
			a[194] = "&Acirc;";
			a[195] = "&Atilde;";
			a[196] = "&Auml;";
			a[197] = "&Aring;";
			a[198] = "&AElig;";
			a[199] = "&Ccedil;";
			a[200] = "&Egrave;";
			a[201] = "&Eacute;";
			a[202] = "&Ecirc;";
			a[203] = "&Euml;";
			a[204] = "&Igrave;";
			a[205] = "&Iacute;";
			a[206] = "&Icirc;";
			a[207] = "&Iuml;";
			a[208] = "&ETH;";
			a[209] = "&Ntilde;";
			a[210] = "&Ograve;";
			a[211] = "&Oacute;";
			a[212] = "&Ocirc;";
			a[213] = "&Otilde;";
			a[214] = "&Ouml;";
			a[215] = "&times;";
			a[216] = "&Oslash;";
			a[217] = "&Ugrave;";
			a[218] = "&Uacute;";
			a[219] = "&Ucirc;";
			a[220] = "&Uuml;";
			a[221] = "&Yacute;";
			a[222] = "&THORN;";
			a[223] = "&szlig;";
			a[224] = "&agrave;";
			a[225] = "&aacute;";
			a[226] = "&acirc;";
			a[227] = "&atilde;";
			a[228] = "&auml;";
			a[229] = "&aring;";
			a[230] = "&aelig;";
			a[231] = "&ccedil;";
			a[232] = "&egrave;";
			a[233] = "&eacute;";
			a[234] = "&ecirc;";
			a[235] = "&euml;";
			a[236] = "&igrave;";
			a[237] = "&iacute;";
			a[238] = "&icirc;";
			a[239] = "&iuml;";
			a[240] = "&eth;";
			a[241] = "&ntilde;";
			a[242] = "&ograve;";
			a[243] = "&oacute;";
			a[244] = "&ocirc;";
			a[245] = "&otilde;";
			a[246] = "&ouml;";
			a[247] = "&divide;";
			a[248] = "&oslash;";
			a[249] = "&ugrave;";
			a[250] = "&uacute;";
			a[251] = "&ucirc;";
			a[252] = "&uuml;";
			a[253] = "&yacute;";
			a[254] = "&thorn;";
			a[255] = "&yuml;";
		}
		"ENT_NOQUOTES" !== o && (a[34] = "&quot;");
		"ENT_QUOTES" === o && (a[39] = "&#39;");
		a[60] = "&lt;";
		a[62] = "&gt;";
		for (let i in a)
			a.hasOwnProperty(i) &&
				(s[String.fromCharCode(i as any)] = a[i]!);
		return s;
	}

	ucFirst(e: any) {
		return e.charAt(0).toUpperCase() + e.slice(1);
	}

	setupWebPush() {
		null == this.webpush &&
			(this.webpush = new ebg.webpush(
				dojo.hitch(this, "ajaxcall")
			));
		return this.webpush.init();
	}

	refreshWebPushWorker() {
		null == this.webpush &&
			(this.webpush = new ebg.webpush(
				dojo.hitch(this, "ajaxcall")
			));
		this.webpush.isSupported() && this.webpush.refresh();
	}

	getRTCTemplate(e: any, t: any, i: any) {
		var n =
			'<div id="rtc_container_${player_id}" class="rtc_container';
		if (!e && !t) return n + '"></div>';
		t
			? (n +=
					' rtc_video_container"><div id="videofeed_${player_id}_pulse"></div>' +
					(i
						? '<video id="videofeed_${player_id}" class="videofeed" autoplay ${muted}></video>'
						: '<video id="videofeed_${player_id}" class="videofeed videoflipped" autoplay ${muted}></video>') +
					'<div id="videofeed_${player_id}_name" class="rtc_video_name"></div><div id="videofeed_${player_id}_min" class="rtc_video_control rtc_video_min"></div><div id="videofeed_${player_id}_size" class="rtc_video_control rtc_video_size"></div><div id="videofeed_${player_id}_cam" class="rtc_video_control rtc_video_cam rtc_video_cam_off"></div>')
			: e &&
			  (n +=
					' rtc_audio_container"><video id="videofeed_${player_id}" class="videofeed" autoplay ${muted}></video>');
		e &&
			(n += i
				? '<div id="videofeed_${player_id}_spk" class="rtc_video_control rtc_video_spk rtc_video_spk_off"></div>'
				: '<div id="videofeed_${player_id}_mic" class="rtc_video_control rtc_video_mic rtc_video_mic_off"></div>');
		return (n += "</div>");
	}

	setupRTCEvents(t: string) {
		var i =
			"undefined" != typeof current_player_id
				? current_player_id
				// @ts-ignore
				: (this as typeof gameui).player_id;
		if (false !== this.mediaConstraints.video) {
			dojo.connect(
				$("rtc_container_" + t)!,
				"onclick",
				this,
				"onClickRTCVideoMax"
			);
			dojo.connect(
				$("videofeed_" + t + "_min")!,
				"onclick",
				this,
				"onClickRTCVideoMin"
			);
			dojo.connect(
				$("videofeed_" + t + "_size")!,
				"onclick",
				this,
				"onClickRTCVideoSize"
			);
			dojo.connect(
				$("videofeed_" + t + "_cam")!,
				"onclick",
				this,
				"onClickRTCVideoCam"
			);
			this.addTooltip(
				"videofeed_" + t + "_min",
				"",
				__("lang_mainsite", "Minimize video")
			);
			this.addTooltip(
				"videofeed_" + t + "_size",
				"",
				__("lang_mainsite", "Resize video")
			);
			t == String(i)
				? this.addTooltip(
						"videofeed_" + t + "_cam",
						"",
						__(
							"lang_mainsite",
							"Mute/Unmute your video camera"
						)
				  )
				: this.addTooltip(
						"videofeed_" + t + "_cam",
						"",
						__("lang_mainsite", "Mute/Unmute video")
				  );
			if ($("player_name_" + t)) {
				var n = dojo.getStyle("player_name_" + t, "color");
				dojo.setStyle(
					"videofeed_" + t + "_pulse",
					"borderColor",
					n
				);
				dojo.setStyle(
					"rtc_container_" + t,
					"borderColor",
					n
				);
				dojo.setStyle(
					"rtc_container_" + t,
					"boxShadow",
					"0px 0px 3px " + n
				);
			}
			if ($("player_name_" + t)) {
				n = dojo.getStyle("player_name_" + t, "color");
				dojo.setStyle(
					"videofeed_" + t + "_name",
					"color",
					n
				);
				for (
					var o = "",
						a = $("player_name_" + t)!,
						s = 0;
					s < a.childNodes.length;
					++s
				)
					3 === a.childNodes[s]!.nodeType &&
						(o += a.childNodes[s]!.textContent);
				($("videofeed_" + t + "_name") as HTMLElement).innerHTML = o;
			}
			if ($("emblem_" + t)) {
				o = dojo.getAttr($("emblem_" + t) as HTMLElement, "alt") as string;
				($("videofeed_" + t + "_name") as HTMLElement).innerHTML = o;
			}
			if (!dojo.hasClass("ebd-body", "mobile_version")) {
				new ebg.draggable().create(
					this,
					"rtc_container_" + t
				);
			}
		}
		if (false !== this.mediaConstraints.audio) {
			if (null != $("videofeed_" + t + "_mic")) {
				dojo.connect(
					$("videofeed_" + t + "_mic")!,
					"onclick",
					this,
					"onClickRTCVideoMic"
				);
				this.addTooltip(
					"videofeed_" + t + "_mic",
					"",
					__(
						"lang_mainsite",
						"Mute/Unmute your microphone"
					)
				);
			}
			if (null != $("videofeed_" + t + "_spk")) {
				dojo.connect(
					$("videofeed_" + t + "_spk")!,
					"onclick",
					this,
					"onClickRTCVideoSpk"
				);
				this.addTooltip(
					"videofeed_" + t + "_spk",
					"",
					__("lang_mainsite", "Mute/Unmute audio")
				);
			}
		}
	}

	getRtcVideoConstraints(rtc_id: 0 | 1 | 2) {
		if (2 === parseInt(rtc_id as any, 10))
			return {
				mandatory: {
					minAspectRatio: 1.333,
					maxAspectRatio: 1.334,
					maxWidth: 240,
					maxFrameRate: 30,
				},
				optional: [],
			};
		return false;
	}

	startRTC() {
		(false === this.mediaConstraints.video &&
			false === this.mediaConstraints.audio) ||
			require([
				g_themeurl + "js/webrtcadapter.js",
			], dojo.hitch(this, "doStartRTC"));
	}

	doStartRTC() {
		this.ajaxcall(
			"/videochat/videochat/getRTCConfig.html",
			{},
			this,
			function (t) {
				var i =
					"undefined" != typeof current_player_id
						? current_player_id
						// @ts-ignore
						: (this as typeof gameui).player_id;
				if (null !== $("videofeed_" + i)) {
					webrtcConfig.audioSendCodec = "";
					webrtcConfig.audioReceiveCodec =
						"opus/48000";
					var n = JSON.parse(
						JSON.stringify(webrtcConfig.pcConfig)
					);
					undefined !== t.static_turn &&
						undefined !== t.static_turn.urls &&
						"" !== t.static_turn.urls &&
						n.iceServers.push(t.static_turn);
					if (undefined !== t.dynamic_iceservers)
						try {
							dynamicConfig = JSON.parse(
								t.dynamic_iceservers
							);
							"ok" === dynamicConfig.s
								? (n = dynamicConfig.v)
								: alert(
										"Error: failed to retrieve RTC ICE servers dynamic configuration"
								  );
						} catch (o) {
							alert(
								"Error: failed to parse RTC ICE servers dynamic configuration"
							);
						}
					this.webrtc = new ebg.webrtc(
						i!,
						this.room!,
						n,
						webrtcConfig.pcConstraints,
						this.mediaConstraints,
						false,
						dojo.hitch(this, "ajaxcall"),
						dojo.hitch(this, "onGetUserMediaSuccess"),
						dojo.hitch(this, "onGetUserMediaError"),
						dojo.hitch(this, "onJoinRoom"),
						dojo.hitch(this, "onLeaveRoomImmediate")
					);
					this.webrtc.setLocalFeed(
						$("videofeed_" + i) as HTMLVideoElement
					);
					null === this.webrtcmsg_ntf_handle &&
						(this.webrtcmsg_ntf_handle =
							dojo.subscribe(
								"webrtcmsg",
								this,
								"ntf_webrtcmsg"
							));
				}
			},
			function (e) {}
		);
	}

	onGetUserMediaSuccess() {
		if (null !== this.room) {
			window.onbeforeunload = dojo.hitch(this, function (e) {
				null !== this.room && this.doLeaveRoom();
			});
			var t =
				"undefined" != typeof current_player_id
					? current_player_id
					// @ts-ignore
					: (this as typeof gameui).player_id;
			if (null != $("videofeed_" + t + "_mic")) {
				dojo.addClass(
					$("videofeed_" + t + "_mic") as HTMLElement,
					"rtc_video_mic_on"
				);
				dojo.removeClass(
					$("videofeed_" + t + "_mic") as HTMLElement,
					"rtc_video_mic_off"
				);
			}
			if (null != $("videofeed_" + t + "_cam")) {
				dojo.addClass(
					$("videofeed_" + t + "_cam") as HTMLElement,
					"rtc_video_cam_on"
				);
				dojo.removeClass(
					$("videofeed_" + t + "_cam") as HTMLElement,
					"rtc_video_cam_off"
				);
			}
			this.ajaxcall(
				"/videochat/videochat/joinRoom.html",
				{
					room: this.room,
					lock: false,
					audio: false !== this.mediaConstraints.audio,
					video: false !== this.mediaConstraints.video,
				},
				this,
				function (t) {
					if (1 == t.videochat_terms_accepted)
						if (t.already_in || t.joined)
							for (
								var i = 0;
								i < t.in_room.length;
								i++
							) {
								var n = t.in_room[i];
								this.onJoinRoom(n, false);
							}
						else if (
							this.room ===
							this.already_accepted_room
						)
							this.ajaxcall(
								"/videochat/videochat/joinRoom.html",
								{
									room: this.room,
									accept: true,
									lock: false,
									audio:
										false !==
										this.mediaConstraints
											.audio,
									video:
										false !==
										this.mediaConstraints
											.video,
								},
								this,
								function (e) {
									this.already_accepted_room =
										null;
									for (
										var t = 0;
										t < e.in_room.length;
										t++
									) {
										var i = e.in_room[t];
										this.onJoinRoom(i, false);
									}
								},
								function (e) {}
							);
						else {
							var o =
								'<div  class="rtc_dialog"><br />';
							o +=
								'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
								(false !==
								this.mediaConstraints.video
									? this.room!.indexOf("T") >=
									  0
										? __(
												"lang_mainsite",
												"A Premium user has set up a video chat session for this table!"
										  )
										: __(
												"lang_mainsite",
												"A Premium user has set up a video chat session with you!"
										  )
									: this.room!.indexOf("T") >=
									  0
									? __(
											"lang_mainsite",
											"A Premium user has set up an audio chat session for this table!"
									  )
									: __(
											"lang_mainsite",
											"A Premium user has set up an audio chat session with you!"
									  )) +
								"</i></div><br /><br />";
							o +=
								'<div style="text-align: center; font-weight: bold;">' +
								__(
									"lang_mainsite",
									"Do you want to join the call?"
								) +
								"</div><br /><br />";
							this.room!.indexOf("T") >= 0 &&
								(o += __(
									"lang_mainsite",
									'If you choose "no" then change your mind, just refresh the page (F5) to get this prompt again!'
								));
							o += "</div>";
							this.confirmationDialog(
								o,
								dojo.hitch(this, function () {
									null !== this.room &&
										this.ajaxcall(
											"/videochat/videochat/joinRoom.html",
											{
												room: this.room,
												accept: true,
												lock: false,
												audio:
													false !==
													this
														.mediaConstraints
														.audio,
												video:
													false !==
													this
														.mediaConstraints
														.video,
											},
											this,
											function (e) {
												for (
													var t = 0;
													t <
													e.in_room
														.length;
													t++
												) {
													var i =
														e
															.in_room[
															t
														];
													this.onJoinRoom(
														i,
														false
													);
												}
											},
											function (e) {}
										);
								}),
								dojo.hitch(this, function () {
									if (
										null !== this.room &&
										this.room.indexOf(
											"T"
										) >= 0
									)
										this.doLeaveRoom();
									else if (
										null !== this.room &&
										this.room.indexOf(
											"P"
										) >= 0
									) {
										var e = (this.room
												.substr(1)
												.split("_")) as [BGA.ID, BGA.ID],
											t =
												e[0] == n
													? e[1]
													: e[0];
										this.mediaConstraints
											.video
											? this.ajaxcall(
													"/table/table/startStopVideo.html",
													{
														target_table:
															null,
														target_player:
															t,
													},
													this,
													function (
														e
													) {
														this.doLeaveRoom();
													}
											  )
											: this
													.mediaConstraints
													.audio &&
											  this.ajaxcall(
													"/table/table/startStopAudio.html",
													{
														target_table:
															null,
														target_player:
															t,
													},
													this,
													function (
														e
													) {
														this.doLeaveRoom();
													}
											  );
									}
								})
							);
						}
					else {
						o = '<div  class="rtc_dialog"><br />';
						o +=
							'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
							(false !== this.mediaConstraints.video
								? this.room!.indexOf("T") >= 0
									? __(
											"lang_mainsite",
											"A Premium user has set up a video chat session for this table!"
									  )
									: __(
											"lang_mainsite",
											"A Premium user has set up a video chat session with you!"
									  )
								: this.room!.indexOf("T") >= 0
								? __(
										"lang_mainsite",
										"A Premium user has set up an audio chat session for this table!"
								  )
								: __(
										"lang_mainsite",
										"A Premium user has set up an audio chat session with you!"
								  )) +
							"</i></div><br /><br />";
						o +=
							"<b>" +
							__(
								"lang_mainsite",
								"You are about to enter a real time chat room on Board Game Arena for the first time."
							) +
							"</b><br /><br />";
						o +=
							__(
								"lang_mainsite",
								"Please note that any interaction between players in a real time chat room is private to and the sole responsability of those players."
							) + "<br /><br />";
						o +=
							__(
								"lang_mainsite",
								"Board Game Arena doesn't record real time chat activity, but you should be aware that any player in the chat room has the possibility to make such recordings. Thus, you shouldn't do or say anything that you wouldn't want on record (or on Youtube)."
							) + "<br /><br />";
						o +=
							__(
								"lang_mainsite",
								"You should also be aware that real time chat, be it voice or video, consumes more bandwidth than classic web browsing. It is your responsability to monitor your usage and check that it matches your contract with your internet provider so as not to incur unexpected fees."
							) + "<br /><br />";
						o +=
							"<b>" +
							__(
								"lang_mainsite",
								"By accepting to proceed, you state that you are an adult according to the laws of your country or that you received explicit permission to use this service from an adult legally responsible for you, and you recognise and attest that Board Game Arena won't be liable for any inconvenience or damage directly or indirectly linked to the use of this service."
							) +
							"</b>";
						o += "</div>";
						this.confirmationDialog(
							o,
							dojo.hitch(this, function () {
								null !== this.room &&
									this.ajaxcall(
										"/videochat/videochat/joinRoom.html",
										{
											room: this.room,
											accept: true,
											lock: false,
											audio:
												false !==
												this
													.mediaConstraints
													.audio,
											video:
												false !==
												this
													.mediaConstraints
													.video,
										},
										this,
										function (e) {
											for (
												var t = 0;
												t <
												e.in_room
													.length;
												t++
											) {
												var i =
													e.in_room[
														t
													];
												this.onJoinRoom(
													i,
													false
												);
											}
										},
										function (e) {}
									);
							}),
							dojo.hitch(this, function () {
								this.ajaxcall(
									"/videochat/videochat/joinRoom.html",
									{
										room: this.room,
										accept: false,
										lock: false,
										audio:
											false !==
											this
												.mediaConstraints
												.audio,
										video:
											false !==
											this
												.mediaConstraints
												.video,
									},
									this,
									function (e) {
										this.clearRTC();
									},
									function (e) {}
								);
							})
						);
					}
				},
				function (e) {}
			);
		}
	}

	onGetUserMediaError() {
		var e = '<div class="rtc_dialog"><br />';
		e +=
			"<b>" +
			__(
				"lang_mainsite",
				"Sorry, Board Game Arena failed to get access to your local camera/microphone..."
			) +
			"</b><br /><br />";
		e +=
			__(
				"lang_mainsite",
				"If you denied authorisation by mistake, please refresh the page to start over."
			) + " ";
		e +=
			__(
				"lang_mainsite",
				"If that fails, you should check your browser permissions in your browser's <i>%s</i> local configuration."
			).replace("%s", "") + "<br /><br />";
		e += __(
			"lang_mainsite",
			"Otherwise, please check that your camera/microphone is correctly plugged in, and that you are using a WebRTC capable browser: "
		);
		e +=
			'<a href="http://iswebrtcreadyyet.com/" target="_blank">http://iswebrtcreadyyet.com/</a>';
		e += "</div>";
		this.warningDialog(e, function () {});
	}

	onJoinRoom(t: any, i: any) {
		null == this.webrtc ||
			this.webrtc.isInRoom(t) ||
			this.webrtc.addToRoom(t);
		if (this.webrtc!.room.indexOf("T") >= 0)
			if (
				null !== $("rtc_container_" + t) ||
				(null === $("emblem_" + t) &&
					null === $("rtc_placeholder_" + t))
			) {
				if (null != $("videofeed_" + t + "_mic")) {
					dojo.addClass(
						$("videofeed_" + t + "_mic")!,
						"rtc_video_mic_off"
					);
					dojo.removeClass(
						$("videofeed_" + t + "_mic")!,
						"rtc_video_mic_on"
					);
				}
				if (null != $("videofeed_" + t + "_cam")) {
					dojo.addClass(
						$("videofeed_" + t + "_cam")!,
						"rtc_video_cam_off"
					);
					dojo.removeClass(
						$("videofeed_" + t + "_cam")!,
						"rtc_video_cam_on"
					);
				}
			} else {
				dojo.place(
					this.format_string(
						this.getRTCTemplate(
							this.mediaConstraints.audio,
							this.mediaConstraints.video,
							true
						),
						{ player_id: t, muted: "" }
					),
					null !== $("rtc_placeholder_" + t)
						? $("rtc_placeholder_" + t)!
						: $("table_rtc_placeholder")!
				);
				null !== $("emblem_" + t) &&
					this.placeOnObject(
						$("rtc_container_" + t) as HTMLElement,
						$("emblem_" + t) as HTMLElement
					);
				this.setupRTCEvents(t);
				undefined !== this.gamedatas &&
					t ==
						this.gamedatas!.gamestate
							.active_player &&
					$("videofeed_" + t + "_pulse") &&
					dojo.addClass(
						"videofeed_" + t + "_pulse",
						"rtc_video_pulsating"
					);
			}
		else if (
			this.webrtc!.room.indexOf("P") >= 0 &&
			null == $("rtc_container_" + t) &&
			null !== $("chatwindowlogs_zone_privatechat_" + t)
		) {
			dojo.place(
				this.format_string(
					this.getRTCTemplate(
						this.mediaConstraints.audio,
						this.mediaConstraints.video,
						true
					),
					{ player_id: t, muted: "" }
				),
				$("chatwindowlogs_privatechat_" + t)!
			);
			if (this.mediaConstraints.video)
				dojo.addClass(
					$("rtc_container_" + t)!,
					"rtc_video_container_privatechat"
				);
			else if (this.mediaConstraints.audio) {
				dojo.style(
					$("rtc_container_" + t)!,
					"top",
					"-13px"
				);
				dojo.style(
					$("rtc_container_" + t)!,
					"left",
					"110px"
				);
			}
			this.setupRTCEvents(t);
		}
		this.webrtc!.maybeConnect(t, i);
		this.webrtc!.isAudioMuted &&
			this.webrtc!.toggleAudioMute();
	}

	onClickRTCVideoMax(t: Event) {
		dojo.stopEvent(t);
		var i = t.currentTarget as HTMLElement,
			n = i.id.split("_")[2];
		this.maximizeRTCVideo(i, n);
	}

	maximizeRTCVideo(t: any, i: any) {
		if (dojo.hasClass(t, "rtc_video_container")) {
			dojo.addClass(t, "rtc_video_container_free");
			dojo.removeClass(t, "rtc_video_container");
			var n = dojo.hasClass(
				t,
				"rtc_video_container_privatechat"
			);
			if (undefined !== n && n) {
				dojo.addClass(
					t,
					"rtc_video_container_free_privatechat"
				);
				dojo.removeClass(
					t,
					"rtc_video_container_privatechat"
				);
				o = dojo.marginBox("videofeed_" + i);
				dojo.style(t, "width", o.w + "px");
				dojo.style(t, "height", o.h + "px");
			} else {
				var o = dojo.marginBox("videofeed_" + i);
				dojo.style(t, "width", o.w + "px");
				dojo.style(t, "height", o.h + "px");
			}
			$("rtc_placeholder_" + i)
				? dojo.style("rtc_placeholder_" + i, "zIndex", "497")
				: $("rtc_container_" + i) &&
				  dojo.style("rtc_container_" + i, "zIndex", "497");
			new ebg.resizable().create(
				this,
				"videofeed_" + i,
				"videofeed_" + i + "_size",
				true,
				false,
				true
			);
		}
	}

	onClickRTCVideoMin(t: any) {
		dojo.stopEvent(t);
		var i = t.currentTarget.parentNode,
			n = i.id.split("_")[2],
			o = dojo.hasClass(
				$("rtc_container_" + n)!.parentNode!,
				"chatwindowlogs"
			),
			a = dojo.hasClass(
				i,
				"rtc_video_container_free_privatechat"
			);
		dojo.addClass(i, "rtc_video_container");
		dojo.removeClass(i, "rtc_video_container_free");
		dojo.style(i, "width", "");
		dojo.style(i, "height", "");
		dojo.style(i, "left", "");
		dojo.style(i, "top", "");
		dojo.style($("videofeed_" + n)!, "width", "");
		dojo.style($("videofeed_" + n)!, "height", "");
		if (null === $("emblem_" + n) || o || a) {
			if (o && !a) {
				dojo.style($("rtc_container_" + n)!, "top", "-6px");
				dojo.style(
					$("rtc_container_" + n)!,
					"left",
					"115px"
				);
			}
		} else
			this.placeOnObject(
				$("rtc_container_" + n) as HTMLElement,
				$("emblem_" + n) as HTMLElement
			);
		null !== $("rtc_placeholder_" + n)
			? dojo.style("rtc_placeholder_" + n, "zIndex", "")
			: $("rtc_container_" + n) &&
			  dojo.style("rtc_container_" + n, "zIndex", "");
		if (a) {
			dojo.addClass(i, "rtc_video_container_privatechat");
			dojo.removeClass(
				i,
				"rtc_video_container_free_privatechat"
			);
		}
	}

	onClickRTCVideoSize(t: any) {
		dojo.stopEvent(t);
	}

	onClickRTCVideoMic(t: any) {
		dojo.stopEvent(t);
		var i = t.currentTarget.id.split("_")[1];
		if (this.webrtc!.toggleAudioMute(i)) {
			dojo.addClass(t.currentTarget, "rtc_video_mic_off");
			dojo.removeClass(t.currentTarget, "rtc_video_mic_on");
		} else {
			dojo.addClass(t.currentTarget, "rtc_video_mic_on");
			dojo.removeClass(t.currentTarget, "rtc_video_mic_off");
		}
	}

	onClickRTCVideoSpk(t: any) {
		dojo.stopEvent(t);
		var i = t.currentTarget.id.split("_")[1];
		if (this.webrtc!.toggleAudioMute(i)) {
			dojo.addClass(t.currentTarget, "rtc_video_spk_off");
			dojo.removeClass(t.currentTarget, "rtc_video_spk_on");
		} else {
			dojo.addClass(t.currentTarget, "rtc_video_spk_on");
			dojo.removeClass(t.currentTarget, "rtc_video_spk_off");
		}
	}

	onClickRTCVideoCam(t: any) {
		dojo.stopEvent(t);
		var i = t.currentTarget.id.split("_")[1];
		if (this.webrtc!.toggleVideoMute(i)) {
			dojo.addClass(t.currentTarget, "rtc_video_cam_off");
			dojo.removeClass(t.currentTarget, "rtc_video_cam_on");
		} else {
			dojo.addClass(t.currentTarget, "rtc_video_cam_on");
			dojo.removeClass(t.currentTarget, "rtc_video_cam_off");
		}
	}

	onLeaveRoom(t: any, i: any) {
		if (null != this.webrtc && this.webrtc.isInRoom(t)) {
			var n = $("rtc_container_" + t) as HTMLElement;
			if (true === i) dojo.destroy(n);
			else {
				var o = dojo.fadeOut({
					node: n,
					duration: 1e3,
					delay: 500,
				});
				dojo.connect(o, "onEnd", function (t) {
					dojo.destroy(t);
				});
				o.play();
			}
			this.webrtc.removeFromRoom(t);
		}
	}

	onLeaveRoomImmediate(e: any) {
		this.onLeaveRoom(e, true);
	}

	doLeaveRoom(e?: any) {
		this.clearRTC();
		null != this.room &&
			this.ajaxcall(
				"/videochat/videochat/leaveRoom.html",
				{ room: this.room, lock: false },
				this,
				function (t) {
					this.room = null;
					this.rtc_mode = 0;
					this.mediaConstraints = {
						video: false,
						audio: false,
					};
					undefined !== e && e();
				},
				function (e) {}
			);
	}

	clearRTC() {
		null != this.webrtc && this.webrtc.hangup();
		this.webrtc = null;
		dojo.unsubscribe(this.webrtcmsg_ntf_handle);
		this.webrtcmsg_ntf_handle = null;
		dojo.query(".rtc_container").forEach(function (t, i, n) {
			dojo.destroy(t);
		});
		dojo.query(".audiovideo_active")
			.removeClass("audiovideo_active")
			.addClass("audiovideo_inactive");
	}

	ntf_webrtcmsg(e: any) {
		null != this.webrtc &&
			undefined !== e.args.message &&
			this.webrtc.onMessageReceived(e.args);
	}

	addSmileyToText(e: string) {
		var emotes = this.emoticons,
			i = [],
			n = /[[\]{}()*+?.\\|^$\-,&#\s]/g;
		for (var o in emotes)
			emotes.hasOwnProperty(o) &&
				i.push(
					"(( +|^)" +
						o.replace(n, "\\$&") +
						"( +|$|\\s))"
				);
		return (e = e.replace(
			new RegExp(i.join("|"), "g"),
			function (e) {
				var i = e.trim();
				// @ts-ignore - this is checking if the key exists in the object
				return undefined !== emotes[i]
					? e.replace(
							i,
							'<div class="icon20_textalign"><div class="bgasmiley bgasmiley_' +
								(emotes as any)[i] +
								'"></div></div>'
					  )
					: e;
			}
		)).replace(new RegExp(i.join("|"), "g"), function (e) {
			var i = e.trim();
				// @ts-ignore - this is checking if the key exists in the object
			return undefined !== emotes[i]
				? e.replace(
						i,
						'<div class="icon20_textalign"><div class="bgasmiley bgasmiley_' +
							(emotes as any)[i] +
							'"></div></div>'
				  )
				: e;
		});
	}

	getSmileyClassToCodeTable() {
		var result: Record<string, keyof CorePage_Template["emoticons"]> = {};
		let t: keyof CorePage_Template["emoticons"];
		for (t in this.emoticons)
			if (undefined === result[this.emoticons[t]!])
				result[this.emoticons[t]!] = t;
		return result;
	}

	makeClickableLinks(e: any, t: any) {
		undefined === t && (t = true);
		if (t) {
			if (-1 != e.indexOf("boardgamearena.com")) {
				var i =
					/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*boardgamearena\.com[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
				return this.makeBgaLinksLocalLinks(
					e.replace(
						i,
						'<a class="bga-link" href="$1">$1</a>'
					)
				);
			}
			return this.makeBgaLinksLocalLinks(e);
		}
		var n = [
				"yucata.de",
				"boiteajeux",
				"tabletopia",
				"happymeeple",
				"dominion.games",
				"wakan.pl",
				"boardspace.net",
				"brettspielwelt.de",
				"littlegolem.net",
				"vassalengine.org",
				"sovranti",
				"interlude.games",
				"game-park",
				"playwithmeeps.com",
			],
			o = [
				"hanab.live",
				"hanabi.live",
				"hanabi.cards",
				"codenames.marplebot.com",
				"longwave.web.app",
				"setwithfriends.com",
				"oneword.games",
				"boredgames.gg",
				"freeboardgames.org",
				"colonist.io",
				"turnhero.com",
				"citadelsgame.herokuapp.com",
				"berserk-games",
				"tabletopsimulator.com",
			],
			a = "normal";
		for (var s in n)
			-1 != e.toLowerCase().indexOf(n[s]) && (a = "spam");
		for (var s in o)
			-1 != e.toLowerCase().indexOf(o[s]) &&
				(a = "spam_illegal");
		if ("normal" == a) {
			i =
				/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
			return this.makeBgaLinksLocalLinks(
				e.replace(
					i,
					'<a href="$1" class="bga-link" target="_blank">$1</a>'
				)
			);
		}
		if ("spam" == a) return this.makeBgaLinksLocalLinks(e);
		if ("spam_illegal" == a) {
			e +=
				"\n" +
				_(
					"WARNING: this service is not approved by game designers/publishers. We strongly discourage you to use it or to promote it on BGA. Thanks!"
				);
			return this.makeBgaLinksLocalLinks(e);
		}
	}

	makeBgaLinksLocalLinks(e: any) {
		return (e = (e = (e = (e = (e = (e = e.replace(
			"forum.boardgamearena.com",
			"SAVE_FORUM_URL_FROM_LOCAL"
		)).replace(
			"doc.boardgamearena.com",
			"SAVE_DOC_URL_FROM_LOCAL"
		)).replace(
			/(https?):\/\/[-a-zA-Z.]*boardgamearena\.com\//gim,
			"/"
		)).replace(
			/((https?):\/\/)[-a-zA-Z.]*.([0-9].boardgamearena\.com)/gim,
			"$1$3"
		)).replace(
			"SAVE_FORUM_URL_FROM_LOCAL",
			"forum.boardgamearena.com"
		)).replace(
			"SAVE_DOC_URL_FROM_LOCAL",
			"doc.boardgamearena.com"
		));
	}

	ensureEbgObjectReinit(e: any) {
		"object" == typeof e &&
			null !== e &&
			undefined !== e.destroy &&
			e.destroy();
	}

	getRankClassFromElo(e: any) {
		return 1300 == (e = parseFloat(e))
			? __("lang_mainsite", "Beginner")
			: e < 1400
			? __("lang_mainsite", "Apprentice")
			: e < 1500
			? __("lang_mainsite", "Average")
			: e < 1600
			? __("lang_mainsite", "Good")
			: e < 1800
			? __("lang_mainsite", "Strong")
			: e < 2e3
			? __("lang_mainsite", "Expert")
			: __("lang_mainsite", "Master");
	}

	getColorFromElo(e: any) {
		return 1300 == (e = parseFloat(e)) || e < 1400
			? "#74bed1"
			: e < 1500
			? "#84b8de"
			: e < 1600
			? "#94acd6"
			: e < 1800
			? "#9ba5d0"
			: e < 2e3
			? "#a99bc9"
			: "#b593c4";
	}

	getRankClassFromEloUntranslated(e: any) {
		return 1300 == (e = parseFloat(e))
			? "beginner"
			: e < 1400
			? "apprentice"
			: e < 1500
			? "average"
			: e < 1600
			? "good"
			: e < 1800
			? "strong"
			: e < 2e3
			? "expert"
			: "master";
	}

	eloToBarPercentage(e: any, t = false): number {
		e = parseFloat(e);
		if (t) {
			let t = 1300;
			e > 1300 && (t = 1400);
			e >= 1400 && (t = 1500);
			e >= 1500 && (t = 1600);
			e >= 1600 && (t = 1800);
			e >= 1800 && (t = 2e3);
			return this.eloToBarPercentage(t);
		}
		return e < 1400
			? (e - 1300) / 4
			: e > 2100
			? 100
			: Math.min(100, 25 + ((e - 1400) / 600) * 75);
	}

	formatElo(e: string) {
		return parseInt(
			Math.round(Math.max(0, parseFloat(e) - 1300)).toString()
		);
	}

	formatEloDecimal(e: any) {
		return Math.round(100 * (e - 1300)) / 100;
	}

	getEloLabel(e: any, t?: any, i?: any, n = false, o = false) {
		undefined === t && (t = false);
		undefined === i && (i = true);
		let a = t ? "gamerank_mini" : "",
			s = t ? "mini" : "",
			r = this.getRankClassFromEloUntranslated(e),
			l = i
				? this.formatElo(e)
				: this.formatEloDecimal(e),
			d = n ? this.getRankClassFromElo(e) : l,
			c = o ? `title="${d}"` : "";
		o && (d = "");
		return `<div class="gamerank gamerank_${r} ${a}">\n                        <span class="icon20 icon20_rankw${s}" ${c}></span> <span class="gamerank_value ${
			n ? "gamerank_value_textual" : ""
		}">${d}</span>\n                    </div>`;
	}

	getArenaLabel(e: any, t?: any) {
		var i = this.arenaPointsDetails(e),
			n =
				'<div class="myarena_league league_' +
				i.league +
				'">';
		if (5 != i.league)
			n +=
				'<div class="arena_label">' +
				i.points +
				"</div>";
		else if (undefined !== t) {
			n += '<div class="arena_label">' + t + "</div>";
			n +=
				'<div class="arena_points">' +
				Math.round(i.arelo) +
				"</div>";
		}
		return (n += "</div>");
	}

	insertParamIntoCurrentURL(e: any, t: any) {
		e = escape(e);
		t = escape(t);
		var i = document.location.search.substr(1).split("&");
		// @ts-ignore - This is a bad comparison.
		if ("" == i)
			document.location.search = "?" + e + "=" + t;
		else {
			for (var n, o = i.length; o--; )
				if ((n = i[o]!.split("="))[0] == e) {
					n[1] = t;
					i[o] = n.join("=");
					break;
				}
			o < 0 && (i[i.length] = [e, t].join("="));
			document.location.search = i.join("&");
		}
	}

	playerawardsCollapsedAlignement() {
		if (undefined === this.onresizePlayerAwardsEvent) {
			this.onresizePlayerAwardsEvent = dojo.connect(
				window,
				"onresize",
				this,
				dojo.hitch(this, "playerawardsCollapsedAlignement")
			);
			dojo.query<Element>(".show_awards_details").connect(
				"onclick",
				this,
				function (t) {
					dojo.stopEvent(t);
					for (
						var i = (t.currentTarget as HTMLElement).parentNode as HTMLElement;
						null !== i &&
						!dojo.hasClass(i, "playerawards");

					)
						i = i.parentNode as HTMLElement;
					if (null !== i) {
						dojo.removeClass(
							i,
							"playerawards_collapsed"
						);
						dojo.destroy(t.currentTarget as HTMLElement);
					}
				}
			);
		}
		if (0 == dojo.query(".playerawards_collapsed").length) {
			if (undefined !== this.onresizePlayerAwardsEvent) {
				dojo.disconnect(this.onresizePlayerAwardsEvent);
				delete this.onresizePlayerAwardsEvent;
			}
		} else
			dojo.query(".playerawards_collapsed").forEach(
				dojo.hitch(this, "playerawardCollapsedAlignement")
			);
	}

	playerawardCollapsedAlignement(t: any) {
		var i = -1,
			n = false;
		"" != t.id
			? dojo.query("#" + t.id + " .trophy_large").forEach(
					dojo.hitch(this, function (t) {
						var o = dojo.position(t);
						if (o.y != i) {
							n = !n;
							i = o.y;
						}
						dojo.removeClass(
							t,
							"oddawardline evenawardline"
						);
						dojo.addClass(
							t,
							n ? "oddawardline" : "evenawardline"
						);
					})
			  )
			: console.error(
					"Please specity an ID to playerawards to support playerawardCollapsedAlignement"
			  );
	}

	arenaPointsDetails(e: any, t?: any) {
		var i = {
				0: __("lang_mainsite", "Bronze league"),
				1: __("lang_mainsite", "Silver league"),
				2: __("lang_mainsite", "Gold league"),
				3: __("lang_mainsite", "Platinum league"),
				4: __("lang_mainsite", "Diamond league"),
				5: __("lang_mainsite", "Elite league"),
			},
			n = {
				0: __("lang_mainsite", "Bronze"),
				1: __("lang_mainsite", "Silver"),
				2: __("lang_mainsite", "Gold"),
				3: __("lang_mainsite", "Platinum"),
				4: __("lang_mainsite", "Diamond"),
				5: __("lang_mainsite", "Elite"),
			},
			o = toint(Math.floor(e / 100)) as keyof typeof i, // This is verified
			a = toint(Math.floor(e % 100)),
			s = (e % 1) * 1e4,
			r =
				undefined === i[o]
					? "Error: unknow league " + o
					: i[o],
			l =
				undefined === n[o]
					? "Error: unknow league " + o
					: n[o],
			d = "?";
		if (undefined !== t) {
			d =
				5 == o
					? ""
					: o >= t - 2
					? n[5]
					: n[(toint(o)! + 1) as keyof typeof n];
		}
		null === d && (d = "?");
		null === r && (r = "?");
		null === l && (l = "?");
		return {
			league: o,
			league_name: r,
			league_shortname: l,
			league_promotion_shortname: d,
			points: a,
			arelo: s,
		};
	}

	arenaPointsHtml(t: { league_name: string, league: 0 | 1 | 2 | 3 | 4 | 5; arelo: number; points: number | null, league_promotion_shortname?: string | null }) {
		var i = "",
			n = "",
			bar_style = (t.league_name, ""),
			bar_pcent: number | undefined = undefined,
			s = { 0: 10, 1: 10, 2: 10, 3: 10, 4: 10, 5: 0 }[
				t.league
			];
		if (0 == s) {
			i += Math.round(t.arelo) + " " + _("points");
			bar_pcent =
				30 +
				(70 *
					(Math.min(2100, Math.max(1200, t.arelo)) -
						1200)) /
					900;
			bar_style = "width:" + Math.round(bar_pcent) + "%";
		} else {
			for (
				var r = Math.floor((100 / s) * 100) / 100,
					l = 0;
				l < s;
				l++
			)
				l < Number(t.points)
					? (i +=
							'<div class="arena_point_wrap arena_point_wrap_' +
							l +
							'" style="width:' +
							r +
							'%"><div class="icon32 icon_arena arena_white"  style="opacity:0;"></div><div class="icon32 icon_arena arena_shadow"></div><div class="icon32 icon_arena arena_colored"></div></div>')
					: (i +=
							'<div class="arena_point_wrap arena_point_wrap_' +
							l +
							'" style="width:' +
							r +
							'%"><div class="icon32 icon_arena arena_white"></div><div class="icon32 icon_arena arena_shadow" style="opacity:0;"></div><div class="icon32 icon_arena arena_colored" style="opacity:0;"></div></div>');
			var d = s - Number(t.points);
			(undefined !== t.league_promotion_shortname &&
				null !== t.league_promotion_shortname) ||
				(t.league_promotion_shortname = "?");
			n =
				1 == d
					? dojo.string
							.substitute(
								_("1 point to ${league}"),
								{
									points: d,
									league: t.league_promotion_shortname,
								}
							)
							.replace(
								"1",
								'<span class="remain_arena_points">1</span>'
							)
					: dojo.string.substitute(
							_("${points} points to ${league}"),
							{
								points:
									'<span class="remain_arena_points">' +
									d +
									"</span>",
								league: t.league_promotion_shortname,
							}
					  );
		}
		return {
			bar_content: i,
			bottom_infos: n,
			bar_pcent: bar_style,
			bar_pcent_number: bar_pcent || "",
		};
	}

	//#endregion
}

let CorePage = declare("ebg.core.core", CorePage_Template);
export = CorePage;

declare global {
	namespace BGA {
		type CorePage = typeof CorePage;
		interface EBG_CORE { core: CorePage; }
		interface EBG { core: EBG_CORE; }
	}
	var ebg: BGA.EBG;

	/** A global variable caused by bad code in ebg/core/core:unsubscribe_all. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var sub_id: string;

	/** A global variable caused by bad code in ebg/core/core:unsubscribe_all. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var dynamicConfig: any;

	var current_player_id: number | undefined;
}
