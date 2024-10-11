
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/_base/kernel");
import i = require("dojo/_base/lang");
import n = require("dojo/query");
import o = require("../registry");
import a = require("../popup");
import s = require("./Button");
import r = require("../_Container");
import l = require("../_HasDropDown");
import d = require("dojo/text"); //  import d = require("dojo/text!./templates/DropDownButton.html");
import "../a11yclick";

var DropDownButton = e("dijit.form.DropDownButton", [s, r, l], {
	baseClass: "dijitDropDownButton",
	templateString: d,
	_fillContent: function () {
		var e = this.srcNodeRef,
			i = this.containerNode;
		if (e && i)
			for (; e.hasChildNodes(); ) {
				var n = e.firstChild;
				if (
					n.hasAttribute &&
					(n.hasAttribute("data-dojo-type") ||
						n.hasAttribute("dojoType") ||
						n.hasAttribute(
							"data-" + t._scopeName + "-type"
						) ||
						n.hasAttribute(t._scopeName + "Type"))
				) {
					this.dropDownContainer =
						this.ownerDocument.createElement("div");
					this.dropDownContainer.appendChild(n);
				} else i.appendChild(n);
			}
	},
	startup: function () {
		if (!this._started) {
			if (!this.dropDown && this.dropDownContainer) {
				this.dropDown = o.byNode(
					this.dropDownContainer.firstChild
				);
				delete this.dropDownContainer;
			}
			this.dropDown && a.hide(this.dropDown);
			this.inherited(arguments);
		}
	},
	isLoaded: function () {
		var e = this.dropDown;
		return !!e && (!e.href || e.isLoaded);
	},
	loadDropDown: function (e) {
		var t = this.dropDown,
			n = t.on(
				"load",
				i.hitch(this, function () {
					n.remove();
					e();
				})
			);
		t.refresh();
	},
	isFocusable: function () {
		return this.inherited(arguments) && !this._mouseDown;
	},
}) as DijitJS.form.DropDownButtonConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			DropDownButton: typeof DropDownButton;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = DropDownButton;