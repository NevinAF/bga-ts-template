import dojo = require("dojo");
import declare = require("dojo/_base/declare");

/**
 * Scrollmap is a BGA client side component to display an infinite game area. It supports Scrolling and Panning. Scrolling - allows user to scroll area inside the view port using the buttons drawn on the top/bottom/left/right. Panning - allows user to drag the surface area (using mouse).
 * 
 * Examples of game that use Scrollmap (try on BGA or watch):
 * - Carcassonn
 * - Saboteu
 * - Takenok
 * - Taluva
 * 
 * @see {@link https://en.doc.boardgamearena.com/Scrollmap for more information}
 * 
 * @example
 * // Add this to the .tpl file or anywhere using html js.
 * <div id="map_container">
 * 	<div id="map_scrollable"></div>
 * 	<div id="map_surface"></div>
 * 	<div id="map_scrollable_oversurface"></div>
 * 	<div class="movetop"></div> 
 * 	<div class="movedown"></div> 
 * 	<div class="moveleft"></div> 
 * 	<div class="moveright"></div> 
 * </div>
 * 
 * // Add something like this to the .css file
 * // Scrollable area 
 * 
 * #map_container {
 * 	position: relative;
 * 	overflow: hidden;
 * 
 * 	width: 100%;
 * 	height: 400px;
 * }
 * #map_scrollable, #map_scrollable_oversurface {
 * 	position: absolute;
 * }
 * #map_surface {
 * 	position: absolute;
 * 	top: 0px;
 * 	left: 0px;
 * 	width: 100%;
 * 	height: 100%;
 * 	cursor: move;
 * }
 * 
 * // This is some extra stuff to extend the container/
 * 
 * #map_footer {
 *     text-align: center;
 * }
 * 
 * // Move arrows
 * 
 * .movetop,.moveleft,.moveright,.movedown {
 * 	display: block;
 * 	position: absolute;
 * 	background-image: url('../../../img/common/arrows.png');
 * 	width: 32px;
 * 	height: 32px;
 * }
 * 
 * .movetop {
 * 	top: 0px;
 * 	left: 50%;
 * 	background-position: 0px 32px;
 * }
 * .moveleft {
 * 	top: 50%;
 * 	left: 0px;
 * 	background-position: 32px 0px;
 * }
 * .moveright {
 * 	top: 50%;
 * 	right: 0px;
 * 	background-position: 0px 0px;
 * }
 * .movedown {
 * 	bottom: 0px;
 * 	left: 50%;
 * 	background-position: 32px 32px;
 * }
 * 
 * // Add this to the define function as a dependency
 * define([
 * 	"dojo","dojo/_base/declare",
 * 	"ebg/core/gamegui",
 * 	"ebg/counter",
 * 	"ebg/scrollmap"     /// <==== HERE
 * ], ...
 * 
 * // Finally, to link your HTML code with your Javascript, place this in your Javascript "Setup" method:
 * this.scrollmap = new ebg.scrollmap(); // declare an object (this can also go in constructor)
 * // Make map scrollable
 * this.scrollmap.create( $('map_container'),$('map_scrollable'),$('map_surface'),$('map_scrollable_oversurface') ); // use ids from template
 * this.scrollmap.setupOnScreenArrows( 150 ); // this will hook buttons to onclick functions with 150px scroll step
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
class ScrollMap_Template
{
	container_div: HTMLElement | null = null;
	scrollable_div: HTMLElement | null = null;
	surface_div: HTMLElement | null = null;
	onsurface_div: HTMLElement | null = null;
	isdragging: boolean = false;
	dragging_offset_x: number = 0;
	dragging_offset_y: number = 0;
	dragging_handler: DojoJS.Handle | null = null;
	dragging_handler_touch: DojoJS.Handle | null = null;
	board_x: number = 0;
	board_y: number = 0;
	bEnableScrolling: boolean = true;
	options = {
		disableVerticalScrolling: false,
		onsurfaceDragEnabled: false
	};

	scrollDelta?: number;

	/** Creates event handlers for all divs for handling. */
	create(container_div: HTMLElement, scrollable_div: HTMLElement, surface_div: HTMLElement, onsurface_div: HTMLElement, options: { disableVerticalScrolling?: boolean, onsurfaceDragEnabled?: boolean } = {}): void
	{
		this.options = Object.assign(this.options, options);
		this.container_div = container_div;
		this.scrollable_div = scrollable_div;
		this.surface_div = surface_div;
		this.onsurface_div = onsurface_div;
		dojo.connect(this.surface_div, "onmousedown", this as ScrollMap_Template, "onMouseDown");
		dojo.connect(this.surface_div, "ontouchstart", this as ScrollMap_Template, "onMouseDown");
		dojo.connect($("ebd-body")!, "onmouseup", this as ScrollMap_Template, "onMouseUp");
		dojo.connect($("ebd-body")!, "ontouchend", this as ScrollMap_Template, "onMouseUp");
		if (this.options.onsurfaceDragEnabled) {
			dojo.connect(this.onsurface_div, "onmousedown", this as ScrollMap_Template, "onMouseDown");
			dojo.connect(this.onsurface_div, "ontouchstart", this as ScrollMap_Template, "onMouseDown");
		}
		this.scrollto(0, 0);
	}

	/** Handles the mouse down event. */
	onMouseDown(t: MouseEvent | TouchEvent): void
	{
		if (this.bEnableScrolling) {
			this.isdragging = true;
			const i = dojo.position(this.scrollable_div!);
			const n = dojo.position(this.container_div!);
			// @ts-ignore - Is touch this a bug? pageX is not a property of TouchEvent
			this.dragging_offset_x = t.pageX - (i.x - n.x);
			// @ts-ignore - Is touch this a bug? pageY is not a property of TouchEvent
			this.dragging_offset_y = t.pageY - (i.y - n.y);
			this.dragging_handler = dojo.connect($("ebd-body")!, "onmousemove", this as ScrollMap_Template, "onMouseMove");
			this.dragging_handler_touch = dojo.connect($("ebd-body")!, "ontouchmove", this as ScrollMap_Template, "onMouseMove");
		}
	}

	/** Handles the mouse up event. */
	onMouseUp(t: MouseEvent | TouchEvent): void
	{
		if (this.isdragging) {
			this.isdragging = false;
			dojo.disconnect(this.dragging_handler);
			dojo.disconnect(this.dragging_handler_touch);
		}
	}

	/** Handles the mouse move event. */
	onMouseMove(t: MouseEvent | TouchEvent): void
	{
		if (this.isdragging) {
			const i = dojo.style(this.container_div!, "width");
			const n = dojo.style(this.container_div!, "height");
			// @ts-ignore - Is touch this a bug? pageX is not a property of TouchEvent
			const o = t.pageX - this.dragging_offset_x;
			dojo.style(this.scrollable_div!, "left", o + "px");
			dojo.style(this.onsurface_div!, "left", o + "px");
			this.board_x = o - Number(i) / 2;
			let a = -1 * this.dragging_offset_y;
			if (!this.options.disableVerticalScrolling) {
				// @ts-ignore - Is touch this a bug? pageY is not a property of TouchEvent
				a = t.pageY - this.dragging_offset_y;
				dojo.style(this.scrollable_div!, "top", a + "px");
				dojo.style(this.onsurface_div!, "top", a + "px");
				this.board_y = a - Number(n) / 2;
			}
			dojo.style(dojo.body(), "backgroundPosition", o + "px " + a + "px");
			dojo.stopEvent(t);
		}
	}

	/**
	 * Scrolls to the specified position. This is animated unless duration is 0.
	 * @param xpos The x position to scroll to.
	 * @param ypos The y position to scroll to.
	 * @param duration The duration of the animation in milliseconds. Default is 350ms.
	 * @param delay The delay before the animation starts in milliseconds. Default is 0ms.
	 */
	scrollto(xpos: number, ypos: number, duration?: number, delay?: number): void
	{
		if (duration === undefined) duration = 350;
		if (delay === undefined) delay = 0;
		const a = xpos + Number(dojo.style(this.container_div!, "width")) / 2;
		const s = ypos + Number(dojo.style(this.container_div!, "height")) / 2;
		this.board_x = xpos;
		this.board_y = ypos;
		dojo.fx.combine([
			dojo.fx.slideTo({
				node: this.scrollable_div!,
				top: s,
				left: a,
				// @ts-ignore - unit is not a valid option on this version of DojoJS
				unit: "px",
				duration,
				delay,
			}),
			dojo.fx.slideTo({
				node: this.onsurface_div!,
				top: s,
				left: a,
				// @ts-ignore - unit is not a valid option on this version of DojoJS
				unit: "px",
				duration,
				delay,
			}),
		]).play();
	}

	/**
	 * Offsets the scroll position by the specified amount. This is animated unless duration is 0.
	 * @param xoffset The amount to offset the x position by.
	 * @param yoffset The amount to offset the y position by.
	 * @param duration The duration of the animation in milliseconds. Default is 350ms.
	 * @param delay The delay before the animation starts in milliseconds. Default is 0ms.
	 */
	scroll(xoffset: number, yoffset: number, duration?: number, delay?: number): void
	{
		this.scrollto(this.board_x + xoffset, this.board_y + yoffset, duration, delay);
	}

	/**
	 * Scrolls the the center of all elements matching the querySelector. The center is the center of the bounds these object occupy, not the average center. This is always animated with the default duration of 350ms.
	 * @param querySelector The query selector to match elements to scroll to. If undefined, this will find the center of all elements in the scrollable div.
	*/
	scrollToCenter(querySelector?: string): void
	{
		let left = 0;
		let top = 0;
		let right = 0;
		let bottom = 0;
		let query = "#" + this.scrollable_div!.id + " > *";
		if (querySelector !== undefined) query = querySelector;
		dojo.query<HTMLElement>(query).forEach((t) => {
			left = Math.max(left, Number(dojo.style(t, "left")) + Number(dojo.style(t, "width")));
			right = Math.min(right, Number(dojo.style(t, "left")));
			top = Math.max(top, Number(dojo.style(t, "top")) + Number(dojo.style(t, "height")));
			bottom = Math.min(bottom, Number(dojo.style(t, "top")));
		});
		this.scrollto(-(right + left) / 2, -(bottom + top) / 2);
	}

	/**
	 * Adds clickable NWSE controls this scrollmap.
	 * @param scrollDelta The amount to scroll when any control is clicked. This value is in pixels.
	*/
	setupOnScreenArrows(scrollDelta: number): void
	{
		this.scrollDelta = scrollDelta;
		if ($("movetop"))
			dojo.connect($("movetop")!, "onclick", this as ScrollMap_Template, "onMoveTop");
		if ($("moveleft"))
			dojo.connect($("moveleft")!, "onclick", this as ScrollMap_Template, "onMoveLeft");
		if ($("moveright"))
			dojo.connect($("moveright")!, "onclick", this as ScrollMap_Template, "onMoveRight");
		if ($("movedown"))
			dojo.connect($("movedown")!, "onclick", this as ScrollMap_Template, "onMoveDown");
		
		dojo.query<HTMLElement>("#" + this.container_div!.id + " .movetop").connect("onclick", this as ScrollMap_Template, "onMoveTop").style("cursor", "pointer");
		if (!this.options.disableVerticalScrolling)
			dojo.query<HTMLElement>("#" + this.container_div!.id + " .movedown").connect("onclick", this as ScrollMap_Template, "onMoveDown").style("cursor", "pointer");

		dojo.query<HTMLElement>("#" + this.container_div!.id + " .moveleft").connect("onclick", this as ScrollMap_Template, "onMoveLeft").style("cursor", "pointer");
		if (!this.options.disableVerticalScrolling)
			dojo.query<HTMLElement>("#" + this.container_div!.id + " .moveright").connect("onclick", this as ScrollMap_Template, "onMoveRight").style("cursor", "pointer");
	}

	onMoveTop(e: MouseEvent): void
	{
		e.preventDefault();
		this.scroll(0, this.scrollDelta!);
	}

	onMoveLeft(e: MouseEvent): void
	{
		e.preventDefault();
		this.scroll(this.scrollDelta!, 0);
	}

	onMoveRight(e: MouseEvent): void
	{
		e.preventDefault();
		this.scroll(-this.scrollDelta!, 0);
	}

	onMoveDown(e: MouseEvent): void
	{
		e.preventDefault();
		this.scroll(0, -this.scrollDelta!);
	}

	/**
	 * Checks if the specified position is visible on the screen.
	 * @param x The x position to check.
	 * @param y The y position to check.
	*/
	isVisible(x: number, y: number): boolean
	{
		const n = Number(dojo.style(this.container_div!, "width"));
		const o = Number(dojo.style(this.container_div!, "height"));
		return x >= -this.board_x - n / 2 && x <= -this.board_x + n / 2 && y >= -this.board_y - o / 2 && y < -this.board_y + o / 2;
	}

	/** Enables all scrolling functionality.{@link disableScrolling} for more info. */
	enableScrolling(): void
	{
		if (!this.bEnableScrolling) {
			this.bEnableScrolling = true;
			if (!this.options.disableVerticalScrolling)
				dojo.query("#" + this.container_div!.id + " .movetop").style("display", "block");
			dojo.query("#" + this.container_div!.id + " .moveleft").style("display", "block");
			dojo.query("#" + this.container_div!.id + " .moveright").style("display", "block");
			if (!this.options.disableVerticalScrolling)
				dojo.query("#" + this.container_div!.id + " .movedown").style("display", "block");
		}
	}

	/** Disables all scrolling functionality. This will prevent all interaction with the scrollmap and hide all scroll controls. */
	disableScrolling(): void
	{
		if (this.bEnableScrolling) {
			this.bEnableScrolling = false;
			dojo.query("#" + this.container_div!.id + " .movetop").style("display", "none");
			dojo.query("#" + this.container_div!.id + " .moveleft").style("display", "none");
			dojo.query("#" + this.container_div!.id + " .moveright").style("display", "none");
			dojo.query("#" + this.container_div!.id + " .movedown").style("display", "none");
		}
	}
}

let ScrollMap = declare("ebg.scrollmap", ScrollMap_Template);
export = ScrollMap;

declare global {
	namespace BGA {
		type ScrollMap = typeof ScrollMap;
		interface EBG { scrollmap: ScrollMap; }
	}
	var ebg: BGA.EBG;
}