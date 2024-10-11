/**
 * Draggable it was created long time ago when HTML5 did not have such support, it probably best to use direct html5 spec now.
 */
declare class Draggable_Template {
    page: InstanceType<BGA.CorePage> | null;
    item_id: string | null;
    item_div: HTMLElement | null;
    mouse_x_origin: number | null;
    mouse_y_origin: number | null;
    element_x_origin: string | null;
    element_y_origin: string | null;
    is_dragging: boolean;
    is_disabled: boolean;
    dragging_handler: any;
    dragging_handler_touch: any;
    bUseAutomaticZIndex: boolean;
    automatic_z_index: boolean;
    bGrid: boolean;
    bSnap: boolean;
    gridSize: number;
    draggedThisTime: boolean;
    zoomFactorOriginalElement: number;
    parentRotation: number;
    event_handlers: DojoJS.Handle[];
    snapCallback: ((x: number, y: number) => {
        x: number;
        y: number;
    }) | null;
    onStartDragging: (e: string, t: string, i: string) => any;
    onEndDragging: (e: string, t: number, i: number, n: boolean) => any;
    onDragging: (e: string, t: number, i: number, n: number, o: number) => any;
    create(page: InstanceType<BGA.CorePage>, item_id: string, interact_element?: HTMLElement | string | null): void;
    /**
     * Clears all event handlers from this draggable object. To reuse it, you need to call {@link create} again.
     * Note, this does not destroy any elements, simply disconnects all event handlers.
     */
    destroy(): void;
    changeDraggableItem(item_id: string): void;
    onMouseDown(t: MouseEvent | TouchEvent): void;
    onMouseUp(t: MouseEvent | TouchEvent): void;
    onMouseMove(t: MouseEvent | TouchEvent): void;
    disable(t: string): void;
    enable(): void;
}
declare let Draggable: DojoJS.DojoClass<Draggable_Template, []>;
export = Draggable;
declare global {
    namespace BGA {
        type Draggable = typeof Draggable;
        interface EBG {
            draggable: Draggable;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=draggable.d.ts.map