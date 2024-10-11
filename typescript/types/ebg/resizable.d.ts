declare class Resizable_Template {
    page: InstanceType<BGA.CorePage> | null;
    item_id: string | null;
    item_div: HTMLElement | null;
    mouse_x_origin: number | null;
    mouse_y_origin: number | null;
    element_x_origin: number | null;
    element_y_origin: number | null;
    is_dragging: boolean;
    is_disabled: boolean;
    element_w_origin: number | null;
    element_h_origin: number | null;
    dragging_handler: any;
    width_resize: boolean;
    height_resize: boolean;
    resize_parent: boolean;
    automatic_z_index: boolean;
    onStartDragging: (e: string, t: number, i: number) => any;
    onEndDragging: (e: string, t: number, i: number) => any;
    onDragging: (e: string, t: number, i: number) => any;
    create(page: InstanceType<BGA.CorePage>, item_id: string, interact_element?: HTMLElement | string | null, width_resize?: boolean, height_resize?: boolean, resize_parent?: boolean): void;
    onMouseDown(t: MouseEvent): void;
    onMouseUp(t: MouseEvent): void;
    onMouseMove(t: MouseEvent): void;
    disable(t: string): void;
    enable(): void;
}
declare let Resizable: DojoJS.DojoClass<Resizable_Template, []>;
export = Resizable;
declare global {
    namespace BGA {
        type Resizable = typeof Resizable;
        interface EBG {
            resizable: Resizable;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=resizable.d.ts.map