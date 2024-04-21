import "dojo";
import "dojo/_base/declare";

/**
 * Draggable it was created long time ago when HTML5 did not have such support, it probably best to use direct html5 spec now.
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class Draggable
{
	/** Creates event handlers for the listener_div and caches the target and page for handling. */
	create(page: any, target_id: string, listener_div?: string | HTMLElement): void;

	/** Destroys the event handlers for the listener_div. */
	destroy(): void;

	enable(): void;
	disable(cursorStyle?: CSSStyleDeclaration['cursor']): void;

	onStartDragging(item_id: string, left: number, top: number): void;
	onEndDragging(item_id: string, left: number, top: number, bDragged: boolean): void;
	onDragging(item_id: string, left: number, top: number, dx: number, dy: number): void;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<Draggable>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<Draggable>['createSubclass'];
}

interface Draggable extends dojo._base.DeclareCreatedObject {}

declare global {
	interface EBG { draggable: typeof Draggable; }
	interface Window { ebg: EBG; }
}

export = Draggable;