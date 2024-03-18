type CursorStyle = 'default' | 'pointer' | 'move' | 'text' | 'wait' | 'help' | 'progress' | 'crosshair' | 'not-allowed' | 'e-resize' | 'ne-resize' | 'nw-resize' | 'n-resize' | 'se-resize' | 'sw-resize' | 's-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';

/** Draggable it was created long time ago when HTML5 did not have such support, it probably best to use direct html5 spec now */
interface Draggable
{
	/** Creates event handlers for the listener_div and caches the target and page for handling. */
	create: (page: Gamegui, target_id: string, listener_div?: string | HTMLElement) => void;

	/** Destroys the event handlers for the listener_div. */
	destroy: () => void;

	enable: () => void;
	disable: (cursorStyle?: CursorStyle) => void;

	onStartDragging: (item_id: string, left: number, top: number) => void;
	onEndDragging: (item_id: string, left: number, top: number, bDragged: boolean) => void;
	onDragging: (item_id: string, left: number, top: number, dx: number, dy: number) => void;
}