/** Draggable it was created long time ago when HTML5 did not have such support, it probably best to use direct html5 spec now */
interface Resizable
{
	/** Creates event handlers for the listener_div and caches the target and page for handling. */
	create: (page: Gamegui, target_id: string, listener_div?: string | HTMLElement, widthResizable?: boolean, heightResizable?: boolean, resizeParent?: boolean) => void;

	/** Destroys the event handlers for the listener_div. */
	destroy: () => void;

	enable: () => void;
	disable: (cursorStyle?: CursorStyle) => void;

	onStartDragging: (item_id: string, left: number, top: number) => void;
	onEndDragging: (item_id: string, left: number, top: number) => void;
	onDragging: (item_id: string, left: number, top: number) => void;
}