import e = require("dojo");
import declare = require("dojo/_base/declare");

type CorePage = InstanceType<typeof import("ebg/core/core")>;

interface XYWH { x: number; y: number; w: number; h: number }

/**
 * The Zone component is meant to organise items of the same type inside a predefined space.
 * 
 * Zones are not great at responsive design and are intended for fixed-size spaces. If you want a responsive zone-like structure, you should use the {@link Stock} component instead.
 * @example
 * // Zone's always target an existing HTML element. In your template file, define the area you want to use as a zone. This should be styled to have a fixed size, or us should use the 'SetFluidWidth' method to make it responsive.
 * <div id="my_zone" style="width: 100px;"></div>
 * 
 * // Then create the zone and set the pattern you want to use to organize the items.
 * this.my_zone = new ebg.zone();
 * this.my_zone.create(this, $('my_zone'), <item_width>, <item_height>);
 * this.my_zone.setPattern( <mode> ); // See 'setPattern' for available modes.
 * 
 * // Then you can add and remove items using their DOM ids:
 * this.my_zone.placeInZone( <item_id> );
 * this.my_zone.removeFromZone( <item_id> );
* The interface for the `ebg/zone` module.
* Partial: This has been partially typed based on a subset of the BGA source code.
*/
class Zone_Template
{
	page: CorePage | null = null;
	container_div: HTMLElement | null = null;
	item_height: number | null = null;
	item_width: number | null = null;
	instantaneous: boolean = true;
	items: { id: string; weight: number }[] = [];
	control_name: string | null = null;
	item_margin: number = 5;
	autowidth: boolean = false;
	autoheight: boolean = true;
	item_pattern: 'grid' | 'diagonal' | 'verticalfit' | 'horizontalfit' | 'ellipticalfit' | 'custom' = 'grid';

	/**
	 * Initializes the field values for this zone, and updates the container_div position type if needed.
	 * @param page The game which this zone is a part of.
	 * @param container_div The div that will contain the items in this zone.
	 * @param item_width An integer for the width of the objects you want to organize in this zone.
	 * @param item_height An integer for the height of the objects you want to organize in this zone.
	 */
	create(page: CorePage, container_div: HTMLElement, item_width: number, item_height: number): void
	{
		if (container_div === null) {
			console.error("Null container in zone::create");
		}
		this.page = page;
		this.container_div = container_div;
		this.item_width = item_width;
		this.item_height = item_height;
		this.control_name = container_div.id;
		if (e.style(this.container_div, "position") !== "absolute") {
			e.style(this.container_div, "position", "relative");
		}
	}

	/** Connects an `onresize` event to the window which will update this zone's display. */
	setFluidWidth(): void
	{
		e.connect(window, "onresize", this as Zone_Template, "updateDisplay");
	}

	/**
	 * Sets what pattern the zone uses to position and arrange elements. The zone package comes with many positioning patterns pre-coded; these allow your items to take on a variety of arrangements.
	 * @param pattern The pattern to use for this zone. The following patterns are available:
	 * - 'grid' (which is the default, if you never actually call setPattern)
	 * - 'diagonal'
	 * - 'verticalfit'
	 * - 'horizontalfit'
	 * - 'ellipticalfit'
	 * - 'custom'
	*/
	setPattern(pattern: typeof this.item_pattern): void
	{
		switch (pattern) {
			case 'grid':
			case 'diagonal':
				this.autoheight = true;
				this.item_pattern = pattern;
				break;
			case 'verticalfit':
			case 'horizontalfit':
			case 'ellipticalfit':
				this.autoheight = false;
				this.item_pattern = pattern;
				break;
			case 'custom':
				break;
			default:
				console.error("zone::setPattern: unknow pattern: " + e);
		}
	}

	/** Checks if this zone contains an item with the matching DOM id. */
	isInZone(id: string): boolean
	{
		for (const item of this.items) {
			if (item.id === id) return true;
		}
		return false;
	}

	/**
	 * After creating an object that you want to add to the zone as a classic HTML template (dojo.place / this.format_block), this is used to add and position the object in the zone.
	 * @param target_id The DOM id of the object to add to the zone.
	 * @param weight The weight of the object to add to the zone. This is used to determine the order of the items in the zone. Whenever a new item is added, all elements in the items array is sorted by weight, in ascending order with ties broken by the order they were added.
	 */
	placeInZone(target_id: string, weight?: number): void
	{
		if (weight === undefined) weight = 0;
		if (!this.isInZone(target_id)) {
			this.items.push({ id: target_id, weight });
			this.page!.attachToNewParent($(target_id)!, this.container_div!);
			this.items.sort((a, b) => a.weight - b.weight);
			this.updateDisplay();
		}
	}

	/**
	 * Removes the object with the matching DOM id from the zone.
	 * @param target The DOM id of the object to remove from the zone.
	 * @param destroy If true, the object will be removed from the DOM entirely. If false, the object will be removed from the zone but remain in the DOM.
	 * @param animateTo If set, the object will animate to the specified DOM element (using {@link Gamegui.slideToObject}). This happens before the object is destroyed if destroy is true.
	 */
	removeFromZone(target: string | HTMLElement, destroy: boolean, animateTo: string | HTMLElement): void
	{
		const destroyFunc = (target: Element) => e.destroy(target);
		for (const key in this.items) {
			const item = this.items[key]!;
			if (item.id === target) {
				let anim: InstanceType<typeof dojo.Animation> | null = null;
				if (animateTo) {
					let duration = 500;
					if (this.instantaneous) duration = 1;
					anim = this.page!.slideToObject($(item.id)!, animateTo, duration).play();
					if (destroy) e.connect(anim, "onEnd", destroyFunc);
					anim.play();
				} else if (destroy) {
					let duration = 500;
					if (this.page!.instantaneousMode || this.instantaneous) duration = 1;
					anim = e.fadeOut({ node: $(item.id)!, duration, onEnd: destroyFunc });
					anim.play();
				}
				this.items.splice(Number(key), 1);
				this.updateDisplay();
				return;
			}
		}
	}

	/**
	 * Removes and destroys all objects from the zone.
	 */
	removeAll(): void
	{
		const destroyFunc = (target: HTMLElement) => e.destroy(target);
		for (const key in this.items) {
			const item = this.items[key]!;
			const anim = e.fadeOut({ node: $(item.id)!, onEnd: destroyFunc });
			anim.play();
		}
		this.items = [];
		this.updateDisplay();
	}

	/**
	 * Repositions all objects in the zone. This is useful if the zone's size has changed, or if the pattern has changed.
	 */
	updateDisplay(): void
	{
		const containerId = this.container_div!.id;
		const containerPos = e.position(this.container_div!);
		let pos_width = containerPos.w!;
		if (this.autowidth) {
			pos_width = e.position($("page-content")!).w!;
		}
		let height = 0;
		let width = 0;
		let count = 0;
		for (const key in this.items) {
			const item = this.items[key]!;
			const itemDiv = $(item.id);
			if (itemDiv) {
				const coords = this.itemIdToCoords(count, pos_width, containerPos.h!, this.items.length);
				count++;
				width = Math.max(width, coords.x + coords.w);
				height = Math.max(height, coords.y + coords.h);
				let duration = 1000;
				if (this.page!.instantaneousMode || this.instantaneous) duration = 2;
				let anim = e.fx.slideTo({
					node: itemDiv,
					top: coords.y,
					left: coords.x,
					duration,
					// @ts-ignore - unit is not a valid property in this version of dojo
					unit: "px"
				});
				anim = this.page!.transformSlideAnimTo3d(anim, itemDiv, duration, Number(null));
				anim.play();
			}
		}
		if (this.autoheight)
			e.style(this.container_div!, "height", height + "px");
		if (this.autowidth)
			e.style(this.container_div!, "width", pos_width + "px");
	}

	/**
	 * Determines the position of an item based on the zone's pattern.
	 * @param index The index of the item in the zone.
	 * @param width The width of the zone.
	 * @param height The height of the zone.
	 * @param count The number of items in the zone.
	 */
	itemIdToCoords(index: number, width: number, height: number, count: number): XYWH
	{
		switch (this.item_pattern) {
			case 'grid':
				return this.itemIdToCoordsGrid(index, width);
			case 'diagonal':
				return this.itemIdToCoordsDiagonal(index, width);
			case 'verticalfit':
				return this.itemIdToCoordsVerticalFit(index, width, height, count);
			case 'horizontalfit':
				return this.itemIdToCoordsHorizontalFit(index, width, height, count);
			case 'ellipticalfit':
				return this.itemIdToCoordsEllipticalFit(index, width, height, count);
		}

		// @ts-ignore this function must be overridden by the user for custom patterns, but somehow the error is not thrown here but when using the result of this function
		return undefined;
	}

	itemIdToCoordsGrid(index: number, width: number): XYWH
	{
		const cols = Math.max(1, Math.floor(width / (this.item_width! + this.item_margin)));
		const row = Math.floor(index / cols);
		return {
			x: (index - row * cols) * (this.item_width! + this.item_margin),
			y: row * (this.item_height! + this.item_margin),
			w: this.item_width!,
			h: this.item_height!
		};
	}

	itemIdToCoordsDiagonal(index: number, width: number): XYWH
	{
		return {
			x: index * this.item_margin,
			y: index * this.item_margin,
			w: this.item_width!,
			h: this.item_height!
		};
	}

	itemIdToCoordsVerticalFit(index: number, width: number, height: number, count: number): XYWH
	{
		const totalHeight = count * this.item_height!;
		let step: number;
		let offset: number;
		if (totalHeight <= height) {
			step = this.item_height!;
			offset = (height - totalHeight) / 2;
		} else {
			step = (height - this.item_height!) / (count - 1);
			offset = 0;
		}

		return {
			x: 0,
			y: Math.round(index * step + offset),
			w: this.item_width!,
			h: this.item_height!
		};
	}

	itemIdToCoordsHorizontalFit(index: number, width: number, height: number, count: number): XYWH
	{
		const totalWidth = count * this.item_width!;
		let step: number;
		let offset: number;
		if (totalWidth <= width) {
			step = this.item_width!;
			offset = (width - totalWidth) / 2;
		} else {
			step = (width - this.item_width!) / (count - 1);
			offset = 0;
		}

		return {
			x: Math.round(index * step + offset),
			y: 0,
			w: this.item_width!,
			h: this.item_height!
		};
	}

	itemIdToCoordsEllipticalFit(index: number, width: number, height: number, count: number): XYWH
	{
		const halfWidth = width / 2;
		const halfHeight = height / 2;
		const pi = 3.1415927;
		let result = {
			w: this.item_width!,
			h: this.item_height!
		} as XYWH;

		const l = count - (index + 1);
		if (l <= 4) {
			let w = result.w;
			let h = (result.h * halfHeight) / halfWidth;
			let angle = pi + l * ((2 * pi) / 5);
			result.x = halfWidth + w * Math.cos(angle) - result.w / 2;
			result.y = halfHeight + h * Math.sin(angle) - result.h / 2;
		} else if (l > 4) {
			let w = 2 * result.w;
			let h = (2 * result.h * halfHeight) / halfWidth;
			let angle = pi - pi / 2 + (l - 4) * ((2 * pi) / Math.max(10, count - 5));
			result.x = halfWidth + w * Math.cos(angle) - result.w / 2;
			result.y = halfHeight + h * Math.sin(angle) - result.h / 2;
		}

		return result;
	}


	/** Returns the count of items within this zone. */
	getItemNumber(): number
	{
		return this.items.length;
	}

	/**
	 * Returns the DOM id for all elements in the zone, in order of how they are displayed (weight and order added).
	*/
	getItems(): string[]
	{
		let result: string[] = [];
		for (const item of this.items) {
			result.push(item.id);
		}
		return result;
	}
}

let Zone = declare("ebg.zone", Zone_Template);
export = Zone;

declare global {
	namespace BGA {
		type Zone = typeof Zone;
		interface EBG { zone: Zone; }
	}
	var ebg: BGA.EBG;
}