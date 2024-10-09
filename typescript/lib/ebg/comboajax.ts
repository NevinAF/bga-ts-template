import e = require("dojo");
import declare = require("dojo/_base/declare");
import "dijit/form/FilteringSelect";
import "dojox/data/QueryReadStore";

interface HTMLValueElement extends HTMLElement {
	value?: string;
}

type FilteringSelectInstance = InstanceType<typeof dijit.form.FilteringSelect>;

class ComboAjax_Template
{
	div_id: string | null = null;
	div: HTMLValueElement | null = null;
	query_url: string = "";
	stateStore: InstanceType<typeof dojox.data.QueryReadStore> | null = null;
	filteringSelect: FilteringSelectInstance | null = null;
	currentSelection: string | null = null;
	disableNextOnChange: boolean = false;
	onChange: (e: string) => void = function (e) {};

	create(t: string, i: string, n: string | undefined, o: string | undefined) {
		this.div_id = t;
		this.div = $(t);
		if (this.div === null) {
			console.error("comboajax::create: " + this.div_id + " associated div is null");
		}
		this.query_url = i;
		this.stateStore = new dojox.data.QueryReadStore({
			url: this.query_url,
		});
		if (n === undefined) {
			n = __("lang_mainsite", "Start typing...");
		}
		if (o === undefined) {
			o = "";
		}
		this.filteringSelect = new dijit.form.FilteringSelect(
			{
				id: t,
				name: t,
				store: this.stateStore,
				searchAttr: "q",
				value: o,
				queryExpr: "${0}",
				hasDownArrow: false,
				invalidMessage: n,
			},
			t
		);
		this.div = $(t)!;
		this.div.value = n;
		e.connect(this.div, "onfocus", this, function (e) {
			this.div!.value = "";
			this.filteringSelect!.loadAndOpenDropDown();
		});
		e.connect(
			dijit.byId<FilteringSelectInstance>(this.div_id),
			"onChange",
			this,
			function (e) {
				var i = dijit.byId<FilteringSelectInstance>(t);
				if (i !== null && i.item !== null && i.item) {
					var n = i.item.i.id;
					this.currentSelection = n;
					if (!this.disableNextOnChange) {
						this.onChange(n);
					}
				}
				this.disableNextOnChange = false;
			}
		);
		e.connect(this.div, "onkeyup", this as ComboAjax_Template, "onKeyUp");
	}

	onKeyUp(e: KeyboardEvent) {
		var t = dijit.byId<FilteringSelectInstance>(this.div_id!);
		if (e.keyCode === 13 && t.item !== null) {
			var i = t.item.i.id;
			this.currentSelection = i;
			this.onChange(i);
		}
	}

	setValue(e: string) {
		this.filteringSelect!.attr("displayedValue", e);
	}

	destroy(e: any) {
		dijit.byId<FilteringSelectInstance>(this.div_id!).destroy();
	}

	getSelection() {
		return this.filteringSelect!.item &&
			this.filteringSelect!.item.i &&
			this.filteringSelect!.item.i.id
			? this.filteringSelect!.item.i.id
			: null;
	}
}


let ComboAjax = declare("ebg.comboajax", ComboAjax_Template);
export = ComboAjax;

declare global {
	namespace BGA {
		type ComboAjax = typeof ComboAjax;
		interface EBG { comboajax: ComboAjax; }
	}
	var ebg: BGA.EBG;
}
