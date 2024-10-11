
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom");
import i = require("dojo/dom-attr");
import n = require("dojo/dom-class");
import o = require("dojo/_base/kernel");
import a = require("dojo/sniff");
import s = require("dojo/_base/lang");
import r = require("./_Widget");
import l = require("./_TemplatedMixin");
import d = require("./_Contained");
import c = require("./_CssStateMixin");
import h = require("dojo/text"); // import h = require("dojo/text!./templates/MenuItem.html");

var MenuItem = e(
	"dijit.MenuItem" + (a("dojo-bidi") ? "_NoBidi" : ""),
	[r, l, d, c],
	{
		templateString: h,
		baseClass: "dijitMenuItem",
		label: "",
		_setLabelAttr: function (e) {
			this._set("label", e);
			var t,
				i = "",
				n = e.search(/{\S}/);
			if (n >= 0) {
				i = e.charAt(n + 1);
				var o = e.substr(0, n),
					a = e.substr(n + 3);
				t = o + i + a;
				e =
					o +
					'<span class="dijitMenuItemShortcutKey">' +
					i +
					"</span>" +
					a;
			} else t = e;
			this.domNode.setAttribute(
				"aria-label",
				t + " " + this.accelKey
			);
			this.containerNode.innerHTML = e;
			this._set("shortcutKey", i);
		},
		iconClass: "dijitNoIcon",
		_setIconClassAttr: { node: "iconNode", type: "class" },
		accelKey: "",
		disabled: false,
		_fillContent: function (e) {
			e &&
				!("label" in this.params) &&
				this._set("label", e.innerHTML);
		},
		buildRendering: function () {
			this.inherited(arguments);
			var e = this.id + "_text";
			i.set(this.containerNode, "id", e);
			this.accelKeyNode &&
				i.set(
					this.accelKeyNode,
					"id",
					this.id + "_accel"
				);
			t.setSelectable(this.domNode, false);
		},
		onClick: function () {},
		focus: function () {
			try {
				8 == a("ie") && this.containerNode.focus();
				this.focusNode.focus();
			} catch (e) {}
		},
		_setSelected: function (e) {
			n.toggle(this.domNode, "dijitMenuItemSelected", e);
		},
		setLabel: function (e) {
			o.deprecated(
				"dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.",
				"",
				"2.0"
			);
			this.set("label", e);
		},
		setDisabled: function (e) {
			o.deprecated(
				"dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.",
				"",
				"2.0"
			);
			this.set("disabled", e);
		},
		_setDisabledAttr: function (e) {
			this.focusNode.setAttribute(
				"aria-disabled",
				e ? "true" : "false"
			);
			this._set("disabled", e);
		},
		_setAccelKeyAttr: function (e) {
			if (this.accelKeyNode) {
				this.accelKeyNode.style.display = e
					? ""
					: "none";
				this.accelKeyNode.innerHTML = e;
				i.set(
					this.containerNode,
					"colSpan",
					e ? "1" : "2"
				);
			}
			this._set("accelKey", e);
		},
	}
) as DijitJS.MenuItemConstructor;
a("dojo-bidi") &&
	(MenuItem = e("dijit.MenuItem", MenuItem, {
		_setLabelAttr: function (e) {
			this.inherited(arguments);
			"auto" === this.textDir &&
				this.applyTextDir(this.textDirNode);
		},
	}));

declare global {
	namespace DojoJS
	{
		interface Dijit {
			MenuItem: typeof MenuItem;
		}
	}
}

export = MenuItem;