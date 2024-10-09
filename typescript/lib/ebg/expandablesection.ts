import e = require("dojo");
import declare = require("dojo/_base/declare");

class ExpandableSection_Template
{
	page: any = null;
	div_id: string | null = null;

	create(t: any, i: string) {
		this.page = t;
		this.div_id = i;
		e.query<HTMLElement>(
			"#" + this.div_id + " .expandabletoggle"
		).connect("onclick", this as ExpandableSection_Template, "toggle");
	}

	destroy() {}

	toggle(t: Event) {
		undefined !== t && t.preventDefault();
		var i = e.query<Element>(
			"#" + this.div_id + " .expandablecontent"
		)[0]!;
		e.style(i, "display") == "none"
			? this.expand()
			: this.collapse();
	}

	expand() {
		var t = e.query<Element>(
				"#" + this.div_id + " .expandablecontent"
			)[0]!,
			i = e.query<Element>(
				"#" + this.div_id + " .expandablearrow div"
			)[0]!;
		e.style(t, "display", "block");
		e.removeClass(i, "icon20_expand");
		e.addClass(i, "icon20_collapse");
	}

	collapse() {
		var t = e.query<Element>(
				"#" + this.div_id + " .expandablecontent"
			)[0]!,
			i = e.query<Element>(
				"#" + this.div_id + " .expandablearrow div"
			)[0]!;
		e.style(t, "display", "none");
		e.removeClass(i, "icon20_collapse");
		e.addClass(i, "icon20_expand");
	}
}


let ExpandableSection = declare("ebg.expandablesection", ExpandableSection_Template);
export = ExpandableSection;

declare global {
	namespace BGA {
		type ExpandableSection = typeof ExpandableSection;
		interface EBG { expandablesection: ExpandableSection; }
	}
	var ebg: BGA.EBG;
}