import dojo = require('dojo');
import declare = require('dojo/_base/declare');

/**
 * Draggable it was created long time ago when HTML5 did not have such support, it probably best to use direct html5 spec now.
 */
class Draggable_Template {
	page: InstanceType<BGA.CorePage> | null = null;
	item_id: string | null = null;
	item_div: HTMLElement | null = null;
	mouse_x_origin: number | null = null;
	mouse_y_origin: number | null = null;
	element_x_origin: string | null = null;
	element_y_origin: string | null = null;
	is_dragging: boolean = false;
	is_disabled: boolean = false;
	dragging_handler: any = null;
	dragging_handler_touch: any = null;
	bUseAutomaticZIndex: boolean = true;
	automatic_z_index: boolean = false;
	bGrid: boolean = false;
	bSnap: boolean = false;
	gridSize: number = 10;
	draggedThisTime: boolean = false;
	zoomFactorOriginalElement: number = 1;
	parentRotation: number = 0;
	event_handlers: DojoJS.Handle[] = [];

	snapCallback: ((x: number, y: number) => { x: number; y: number }) | null = null;
	onStartDragging = (e: string, t: string, i: string): any => {};
	onEndDragging = (e: string, t: number, i: number, n: boolean): any => {};
	onDragging = (e: string, t: number, i: number, n: number, o: number): any => {};

	create(page: InstanceType<BGA.CorePage>, item_id: string, interact_element?: HTMLElement |string | null) {
		this.page = page;
		this.item_id = item_id;
		this.item_div = $(item_id) as HTMLElement;
		if (interact_element) {
			this.event_handlers.push(
				dojo.connect(
					$(interact_element) as HTMLElement,
					"onmousedown",
					this as Draggable_Template,
					"onMouseDown"
				)
			);
			this.event_handlers.push(
				dojo.connect(
					$(interact_element) as HTMLElement,
					"ontouchstart",
					this as Draggable_Template,
					"onMouseDown"
				)
			);
			dojo.style($(interact_element) as HTMLElement, "cursor", "move");
		} else {
			this.event_handlers.push(
				dojo.connect(
					this.item_div,
					"onmousedown",
					this as Draggable_Template,
					"onMouseDown"
				)
			);
			this.event_handlers.push(
				dojo.connect(
					this.item_div,
					"ontouchstart",
					this as Draggable_Template,
					"onMouseDown"
				)
			);
			dojo.style(this.item_div, "cursor", "move");
		}
		this.event_handlers.push(
			dojo.connect(
				$("ebd-body") as HTMLElement,
				"onmouseup",
				this as Draggable_Template,
				"onMouseUp"
			)
		);
		this.event_handlers.push(
			dojo.connect(
				$("ebd-body") as HTMLElement,
				"ontouchend",
				this as Draggable_Template,
				"onMouseUp"
			)
		);
	}

	/**
	 * Clears all event handlers from this draggable object. To reuse it, you need to call {@link create} again.
	 * Note, this does not destroy any elements, simply disconnects all event handlers.
	 */
	destroy() {
		for (const key in this.event_handlers)
			dojo.disconnect(this.event_handlers[key]!);
	}

	changeDraggableItem(item_id: string) {
		this.item_id = item_id;
		this.item_div = $(item_id);
	}

	onMouseDown(t: MouseEvent | TouchEvent) {
		dojo.stopEvent(t);
		if (!this.is_disabled) {
			this.mouse_x_origin = (t as MouseEvent).pageX;
			this.mouse_y_origin = (t as MouseEvent).pageY;
			this.element_x_origin = dojo.style(
				this.item_div!,
				"left"
			);
			this.element_y_origin = dojo.style(
				this.item_div!,
				"top"
			);
			this.is_dragging = true;
			this.parentRotation = this.page!.getAbsRotationAngle(
				this.item_div!.parentNode as HTMLElement
			);
			this.dragging_handler &&
				dojo.disconnect(this.dragging_handler);
			this.dragging_handler_touch &&
				dojo.disconnect(this.dragging_handler_touch);
			this.dragging_handler = dojo.connect(
				$("ebd-body") as HTMLElement,
				"onmousemove",
				this as Draggable_Template,
				"onMouseMove"
			);
			this.dragging_handler_touch = dojo.connect(
				$("ebd-body") as HTMLElement,
				"ontouchmove",
				this as Draggable_Template,
				"onMouseMove"
			);
			let i = 1;
			for (let n = this.item_div!; n.parentNode; ) {
				let o = dojo.style(n, "zoom");
				if (typeof o === "number" || typeof o === "string")
					i *= o as any;
				let a = dojo.style(n, "transform");
				if (
					a !== "none" &&
					a.substr(0, 7) === "matrix("
				) {
					let s: number = a.substr(7).split(",")[0] as any,
						r: number = a.substr(7).split(",")[2] as any,
						l = Math.sqrt(s * s + r * r);
					if (l > 1e-4) i *= l;
				}
				if (
					(n = n.parentNode as HTMLElement).id &&
					n.id === "game_play_area" ||
					n.tagName === "BODY"
				)
					break;
			}
			this.zoomFactorOriginalElement = i;
			this.draggedThisTime = false;
			this.onStartDragging(
				this.item_id!,
				this.element_x_origin!,
				this.element_y_origin!
			);
		}
	}

	onMouseUp(t: MouseEvent | TouchEvent) {
		if (!this.is_disabled && this.is_dragging) {
			let i = {
					x: (t as MouseEvent).pageX - this.mouse_x_origin!,
					y: (t as MouseEvent).pageY - this.mouse_y_origin!,
				},
				n = this.page!.vector_rotate(
					i,
					this.parentRotation
				);
			if (this.page!.gameinterface_zoomFactor !== undefined) {
				n.x = n.x / this.page!.gameinterface_zoomFactor;
				n.y = n.y / this.page!.gameinterface_zoomFactor;
			}
			if (1 != this.zoomFactorOriginalElement) {
				n.x = n.x / this.zoomFactorOriginalElement;
				n.y = n.y / this.zoomFactorOriginalElement;
			}
			let o = n.x + (this.element_x_origin as any),
				a = n.y + (this.element_y_origin as any);
			if (this.bGrid) {
				o =
					Math.round(o / this.gridSize) *
					this.gridSize;
				a =
					Math.round(a / this.gridSize) *
					this.gridSize;
			}
			this.is_dragging = false;
			dojo.disconnect(this.dragging_handler);
			dojo.disconnect(this.dragging_handler_touch);
			dojo.removeClass(
				this.item_div!,
				"dragging_in_progress"
			);
			this.onEndDragging(
				this.item_id!,
				o,
				a,
				this.draggedThisTime
			);
			this.dragging_handler = null;
			this.dragging_handler_touch = null;
			if (this.automatic_z_index) {
				dojo.style(this.item_id!, "zIndex", "auto");
				this.automatic_z_index = false;
			}
			let s =
				Math.abs(o - (this.element_x_origin as any)!) < 10 &&
				Math.abs(a - (this.element_y_origin as any)) < 10;
			if (s && t.type === "touchend") this.item_div!.click();
		}
	}

	onMouseMove(t: MouseEvent | TouchEvent) {
		if (!this.is_disabled && this.is_dragging) {
			let i = {
					x: (t as MouseEvent).pageX - this.mouse_x_origin!,
					y: (t as MouseEvent).pageY - this.mouse_y_origin!,
				},
				n = this.page!.vector_rotate(
					i,
					this.parentRotation
				);
			if (this.page!.gameinterface_zoomFactor !== undefined) {
				n.x = n.x / this.page!.gameinterface_zoomFactor;
				n.y = n.y / this.page!.gameinterface_zoomFactor;
			}
			if (1 != this.zoomFactorOriginalElement) {
				n.x = n.x / this.zoomFactorOriginalElement;
				n.y = n.y / this.zoomFactorOriginalElement;
			}
			let o = n.x + (this.element_x_origin as any),
				a = n.y + (this.element_y_origin as any);
			if (this.bSnap && this.parentRotation === 0) {
				let s = this.snapCallback!(o, a);
				o = s.x;
				a = s.y;
			} else if (this.bGrid) {
				a =
					Math.round(a / this.gridSize) *
					this.gridSize;
				o =
					Math.round(o / this.gridSize) *
					this.gridSize;
			}
			dojo.style(this.item_div!, "left", o + "px");
			dojo.style(this.item_div!, "top", a + "px");
			if (this.draggedThisTime === false) {
				dojo.addClass(
					this.item_div!,
					"dragging_in_progress"
				);
				this.draggedThisTime = true;
				if (
					this.bUseAutomaticZIndex &&
					dojo.style(this.item_id!, "zIndex") === "auto"
				) {
					this.automatic_z_index = true;
					dojo.style(this.item_id!, "zIndex", "100");
				}
			}
			this.onDragging(
				this.item_id!,
				o,
				a,
				o - (this.element_x_origin as any),
				a - (this.element_y_origin as any)
			);
			dojo.stopEvent(t);
		}
	}

	disable(t: string) {
		this.is_disabled = true;
		this.item_div &&
			(t
				? dojo.style(this.item_div, "cursor", t)
				: dojo.style(this.item_div, "cursor", "default"));
	}

	enable() {
		this.is_disabled = false;
		this.item_div &&
			dojo.style(this.item_div, "cursor", "move");
	}
}

let Draggable = declare("ebg.draggable", Draggable_Template);
export = Draggable;

declare global {
	namespace BGA {
		type Draggable = typeof Draggable;
		interface EBG { draggable: Draggable; }
	}
	var ebg: BGA.EBG;
}