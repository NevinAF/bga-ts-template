
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom");
import i = require("dojo/_base/lang");
import n = require("dojo/query");
import o = require("dojo/store/Memory");
import a = require("../registry");

function s(e) {
	return {
		id: e.value,
		value: e.value,
		name: i.trim(e.innerText || e.textContent || ""),
	};
}
var DataList = e("dijit.form.DataList", o, {
	constructor: function (e, o) {
		this.domNode = t.byId(o);
		i.mixin(this, e);
		this.id && a.add(this);
		this.domNode.style.display = "none";
		this.inherited(arguments, [
			{ data: n("option", this.domNode).map(s) },
		]);
	},
	destroy: function () {
		a.remove(this.id);
	},
	fetchSelectedItem: function () {
		var e =
			n("> option[selected]", this.domNode)[0] ||
			n("> option", this.domNode)[0];
		return e && s(e);
	},
}) as DijitJS.form.DataListConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			DataList: typeof DataList;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = DataList;