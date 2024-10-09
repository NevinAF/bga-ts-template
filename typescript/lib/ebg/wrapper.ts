import dojo = require("dojo");
import declare = require("dojo/_base/declare");

class Wrapper_Template {
	page: any = null;
	container_div: HTMLElement | null = null;
	container_id: string | null = null;
	container_inner_div: HTMLElement | null = null;
	container_inner_id: string | null = null;
	item_size = 95;

	create(page: any, id: string, inner: HTMLElement) {
		this.page = page;
		this.container_div = inner;
		this.container_id = id;
		this.container_inner_div = inner;
		this.container_inner_id = id;
		if (dojo.style(this.container_div, "position") !== "absolute") {
			dojo.style(this.container_div, "position", "relative");
		}
		dojo.style(this.container_inner_div, "position", "absolute");
		dojo.style(this.container_inner_div, "top", "0px");
		dojo.style(this.container_inner_div, "left", "0px");
	}

	rewrap() {
		const tiles = dojo.query<HTMLElement>(
			`#${this.container_inner_id} .building_tile`
		);
		let left: number | null = null;
		let top: number | null = null;
		let right: number | null = null;
		let bottom: number | null = null;
		tiles.forEach((tile) => {
			const tileLeft = dojo.style(tile, "left");
			const tileTop = dojo.style(tile, "top");
			if (left === null) {
				left = Number(tileLeft);
				top = Number(tileTop);
				right = toint(tileLeft)! + this.item_size;
				bottom = toint(tileTop)! + this.item_size;
			} else {
				left = Math.min(left!,  Number(tileLeft));
				top = Math.min(top!,  Number(tileTop));
				right = Math.max(right!, toint(tileLeft)! + this.item_size);
				bottom = Math.max(bottom!, toint(tileTop)! + this.item_size);
			}
		});
		dojo.style(this.container_div!, "width", right! - left! + "px");
		dojo.style(this.container_div!, "height", bottom! - top! + "px");
		const topOffset = -left!;
		const leftOffset = -top!;
		dojo.style(this.container_inner_div!, "top", leftOffset + "px");
		dojo.style(this.container_inner_div!, "left", topOffset + "px");
	}
}

let Wrapper = declare("ebg.wrapper", Wrapper_Template);
export = Wrapper;

declare global {
	namespace BGA {
		type Wrapper = typeof Wrapper;
		interface EBG { wrapper: Wrapper; }
	}
	var ebg: BGA.EBG;
}