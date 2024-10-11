
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/keys");
import i = require("dojo/text"); // import i = require("dojo/text!./templates/Menu.html");
import n = require("./_MenuBase");

var DropDownMenu = e("dijit.DropDownMenu", n, {
	templateString: i,
	baseClass: "dijitMenu",
	_onUpArrow: function () {
		this.focusPrev();
	},
	_onDownArrow: function () {
		this.focusNext();
	},
	_onRightArrow: function (e) {
		this._moveToPopup(e);
		e.stopPropagation();
		e.preventDefault();
	},
	_onLeftArrow: function (e) {
		if (this.parentMenu)
			this.parentMenu._isMenuBar
				? this.parentMenu.focusPrev()
				: this.onCancel(false);
		else {
			e.stopPropagation();
			e.preventDefault();
		}
	},
}) as DijitJS.DropDownMenuConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			DropDownMenu: typeof DropDownMenu;
		}
	}
}

export = DropDownMenu;