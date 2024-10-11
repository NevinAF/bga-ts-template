import dojo = require("dojo");
import declare = require("dojo/_base/declare");

class Resizable_Template {
	page: InstanceType<BGA.CorePage> | null = null;
	item_id: string | null = null;
	item_div: HTMLElement | null = null;
	mouse_x_origin: number | null = null;
	mouse_y_origin: number | null = null;
	element_x_origin: number | null = null;
	element_y_origin: number | null = null;
	is_dragging: boolean = false;
	is_disabled: boolean = false;
	element_w_origin: number | null = null;
	element_h_origin: number | null = null;
	dragging_handler: any = null;
	width_resize: boolean = true;
	height_resize: boolean = true;
	resize_parent: boolean = false;
	automatic_z_index: boolean = true;

	onStartDragging = (e: string, t: number, i: number): any => {};
	onEndDragging = (e: string, t: number, i: number): any => {};
	onDragging = (e: string, t: number, i: number): any => {};

	create(page: InstanceType<BGA.CorePage>, item_id: string, interact_element?: HTMLElement | string | null, width_resize?: boolean, height_resize?: boolean, resize_parent?: boolean) {
		this.page = page;
		this.item_id = item_id;
		this.item_div = $(item_id) as HTMLElement;
		if (false === width_resize) {
			this.width_resize = false;
		}
		if (false === height_resize) {
			this.height_resize = false;
		}
		if (true === resize_parent) {
			this.resize_parent = true;
		}
		if (interact_element) {
			dojo.connect(
				$(interact_element) as HTMLElement,
				"onmousedown",
				this,
				"onMouseDown"
			);
		} else {
			dojo.connect(
				this.item_div,
				"onmousedown",
				this,
				"onMouseDown"
			);
		}
		dojo.connect(
			$("ebd-body") as HTMLElement,
			"onmouseup",
			this,
			"onMouseUp"
		);
	}

	onMouseDown(t: MouseEvent) {
		dojo.stopEvent(t);
		if (!this.is_disabled) {
			const i = dojo.marginBox(this.item_div!);
			this.element_w_origin = i.w!;
			this.element_h_origin = i.h!;
			this.mouse_x_origin = t.pageX;
			this.mouse_y_origin = t.pageY;
			const n = dojo.marginBox(this.item_div!);
			this.element_x_origin = n.l!;
			this.element_y_origin = n.t!;
			this.is_dragging = true;
			if (this.dragging_handler) {
				dojo.disconnect(this.dragging_handler);
			}
			this.dragging_handler = dojo.connect(
				$("ebd-body")!,
				"onmousemove",
				this,
				"onMouseMove"
			);
			this.onStartDragging(this.item_id!, this.element_x_origin, this.element_y_origin);
			// @ts-ignore
			if ("auto" == dojo.style(this.item_id, "zIndex")) {
				this.automatic_z_index = true;
				dojo.style(this.item_id!, "zIndex", "1000");
			}
		}
	}

	onMouseUp(t: MouseEvent) {
		if (!this.is_disabled && true === this.is_dragging) {
			const i = t.pageX - this.mouse_x_origin! + this.element_x_origin!,
				n = t.pageY - this.mouse_y_origin! + this.element_y_origin!;
			this.is_dragging = false;
			dojo.disconnect(this.dragging_handler);
			this.onEndDragging(this.item_id!, i, n);
			if (this.automatic_z_index) {
				dojo.style(this.item_id!, "zIndex", "auto");
			}
		}
	}

	onMouseMove(t: MouseEvent) {
		t.preventDefault();
		if (!this.is_disabled && true === this.is_dragging) {
			let i = 0;
			let n = 0;
			if (this.width_resize) {
				i = t.pageX - this.mouse_x_origin!;
				dojo.style(this.item_div!, "width", this.element_w_origin! + i + "px");
			}
			if (this.height_resize) {
				n = t.pageY - this.mouse_y_origin!;
				dojo.style(this.item_div!, "height", this.element_h_origin! + n + "px");
			}
			if (this.resize_parent && this.item_div!.parentNode) {
				const o = dojo.marginBox(this.item_div!);
				dojo.style(this.item_div!.parentNode as HTMLElement, "width", o.w + "px");
				dojo.style(this.item_div!.parentNode as HTMLElement, "height", o.h + "px");
			}
			this.onDragging(this.item_id!, i, n);
		}
	}

	disable(t: string) {
		this.is_disabled = true;
		if (this.item_div) {
			if (t) {
				dojo.style(this.item_div, "cursor", t);
			} else {
				dojo.style(this.item_div, "cursor", "default");
			}
		}
	}

	enable() {
		this.is_disabled = false;
		if (this.item_div) {
			dojo.style(this.item_div, "cursor", "move");
		}
	}
}

let Resizable = declare("ebg.resizable", Resizable_Template);
export = Resizable;

declare global {
	namespace BGA {
		type Resizable = typeof Resizable;
		interface EBG { resizable: Resizable; }
	}
	var ebg: BGA.EBG;
}