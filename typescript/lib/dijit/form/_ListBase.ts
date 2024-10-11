
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/on");
import i = require("dojo/window");

var _ListBase = e("dijit.form._ListBase", null, {
	selected: null,
	_listConnect: function (e, i) {
		var n = this;
		return n.own(
			t(
				n.containerNode,
				t.selector(function (e, t, i) {
					return e.parentNode == i;
				}, e),
				function (e) {
					n[i](e, this);
				}
			)
		);
	},
	selectFirstNode: function () {
		for (
			var e = this.containerNode.firstChild;
			e && "none" == e.style.display;

		)
			e = e.nextSibling;
		this._setSelectedAttr(e, true);
	},
	selectLastNode: function () {
		for (
			var e = this.containerNode.lastChild;
			e && "none" == e.style.display;

		)
			e = e.previousSibling;
		this._setSelectedAttr(e, true);
	},
	selectNextNode: function () {
		var e = this.selected;
		if (e) {
			for (
				var t = e.nextSibling;
				t && "none" == t.style.display;

			)
				t = t.nextSibling;
			t
				? this._setSelectedAttr(t, true)
				: this.selectFirstNode();
		} else this.selectFirstNode();
	},
	selectPreviousNode: function () {
		var e = this.selected;
		if (e) {
			for (
				var t = e.previousSibling;
				t && "none" == t.style.display;

			)
				t = t.previousSibling;
			t
				? this._setSelectedAttr(t, true)
				: this.selectLastNode();
		} else this.selectLastNode();
	},
	_setSelectedAttr: function (e, t) {
		if (this.selected != e) {
			var n = this.selected;
			n && this.onDeselect(n);
			if (e) {
				t && i.scrollIntoView(e);
				this.onSelect(e);
			}
			this._set("selected", e);
		} else e && this.onSelect(e);
	},
} as DijitJS.form._ListBase);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_ListBase: typeof _ListBase;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _ListBase;