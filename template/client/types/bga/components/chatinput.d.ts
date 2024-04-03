/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/chatinput must be included in the define as a dependency.
 */
declare class ChatInput {
	detachType: string | 'playtable';
	detachTypeGame: string;
	detachId: string;
	create: (game: Gamegui, type: string, url: string, title: string) => void;
	baseparams: { table: number; }
	callbackBeforeChat: (arg: { msg: string}) => boolean;
}