import "dojo";
import "dojo/_base/declare";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/chatinput must be included in the define as a dependency.
 */
declare class ChatInput {
	detachType: string | 'playtable';
	detachTypeGame: string;
	detachId: string;
	create(game: any, type: string, url: string, title: string): void;
	baseparams: { table: number; }
	callbackBeforeChat(arg: { msg: string}): boolean;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<ChatInput>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<ChatInput>['createSubclass'];
}

interface ChatInput extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { chatinput: typeof ChatInput; }
	interface Window { ebg: EBG; }
}

export = ChatInput;