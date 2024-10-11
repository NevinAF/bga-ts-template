
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom-class");
import i = require("dojo/dom-style");
import n = require("dojo/keys");
import o = require("../_WidgetBase");
import a = require("../_TemplatedMixin");
import s = require("./_ComboBoxMenuMixin");
import r = require("./_ListMouseMixin");

var _ComboBoxMenu = e("dijit.form._ComboBoxMenu", [o, a, r, s], {
	templateString:
		"<div class='dijitReset dijitMenu' data-dojo-attach-point='containerNode' style='overflow: auto; overflow-x: hidden;' role='listbox'><div class='dijitMenuItem dijitMenuPreviousButton' data-dojo-attach-point='previousButton' role='option'></div><div class='dijitMenuItem dijitMenuNextButton' data-dojo-attach-point='nextButton' role='option'></div></div>",
	baseClass: "dijitComboBoxMenu",
	postCreate: function () {
		this.inherited(arguments);
		if (!this.isLeftToRight()) {
			t.add(this.previousButton, "dijitMenuItemRtl");
			t.add(this.nextButton, "dijitMenuItemRtl");
		}
		this.containerNode.setAttribute("role", "listbox");
	},
	_createMenuItem: function () {
		var e = this.ownerDocument.createElement("div");
		e.className =
			"dijitReset dijitMenuItem" +
			(this.isLeftToRight() ? "" : " dijitMenuItemRtl");
		e.setAttribute("role", "option");
		return e;
	},
	onHover: function (e) {
		t.add(e, "dijitMenuItemHover");
	},
	onUnhover: function (e) {
		t.remove(e, "dijitMenuItemHover");
	},
	onSelect: function (e) {
		t.add(e, "dijitMenuItemSelected");
	},
	onDeselect: function (e) {
		t.remove(e, "dijitMenuItemSelected");
	},
	_page: function (e) {
		var t = 0,
			n = this.domNode.scrollTop,
			o = i.get(this.domNode, "height");
		this.getHighlightedOption() || this.selectNextNode();
		for (; t < o; ) {
			var a = this.getHighlightedOption();
			if (e) {
				if (
					!a.previousSibling ||
					"none" == a.previousSibling.style.display
				)
					break;
				this.selectPreviousNode();
			} else {
				if (
					!a.nextSibling ||
					"none" == a.nextSibling.style.display
				)
					break;
				this.selectNextNode();
			}
			var s = this.domNode.scrollTop;
			t += (s - n) * (e ? -1 : 1);
			n = s;
		}
	},
	handleKey: function (e) {
		switch (e.keyCode) {
			case n.DOWN_ARROW:
				this.selectNextNode();
				return false;
			case n.PAGE_DOWN:
				this._page(false);
				return false;
			case n.UP_ARROW:
				this.selectPreviousNode();
				return false;
			case n.PAGE_UP:
				this._page(true);
				return false;
			default:
				return true;
		}
	},
} as DijitJS.form._ComboBoxMenuConstructor);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_ComboBoxMenu: typeof _ComboBoxMenu;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _ComboBoxMenu;