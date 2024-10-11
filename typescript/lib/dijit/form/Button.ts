
// @ts-nocheck

import e = require("require");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-class");
import n = require("dojo/has");
import o = require("dojo/_base/kernel");
import a = require("dojo/_base/lang");
import s = require("dojo/ready");
import r = require("./_FormWidget");
import l = require("./_ButtonMixin");
import d = require("dojo/text"); // import d = require("dojo/text!./templates/Button.html"); TODO
import "../a11yclick";

n("dijit-legacy-requires") &&
	s(0, function () {
		e([
			"dijit/form/DropDownButton",
			"dijit/form/ComboButton",
			"dijit/form/ToggleButton",
		]);
	});
var Button = t(
	"dijit.form.Button" + (n("dojo-bidi") ? "_NoBidi" : ""),
	[r, l],
	{
		showLabel: true,
		iconClass: "dijitNoIcon",
		_setIconClassAttr: { node: "iconNode", type: "class" },
		baseClass: "dijitButton",
		templateString: d,
		_setValueAttr: "valueNode",
		_setNameAttr: function (e) {
			this.valueNode &&
				this.valueNode.setAttribute("name", e);
		},
		postCreate: function () {
			this.inherited(arguments);
			this._setLabelFromContainer();
		},
		_setLabelFromContainer: function () {
			if (this.containerNode && !this.label) {
				this.label = a.trim(
					this.containerNode.innerHTML
				);
				this.onLabelSet();
			}
		},
		_setShowLabelAttr: function (e) {
			this.containerNode &&
				i.toggle(
					this.containerNode,
					"dijitDisplayNone",
					!e
				);
			this._set("showLabel", e);
		},
		setLabel: function (e) {
			o.deprecated(
				"dijit.form.Button.setLabel() is deprecated.  Use set('label', ...) instead.",
				"",
				"2.0"
			);
			this.set("label", e);
		},
		onLabelSet: function () {
			this.inherited(arguments);
			this.showLabel ||
				"title" in this.params ||
				(this.titleNode.title = a.trim(
					this.containerNode.innerText ||
						this.containerNode.textContent ||
						""
				));
		},
	}
) as DijitJS.form.ButtonConstructor;
n("dojo-bidi") &&
	(Button = t("dijit.form.Button", Button, {
		onLabelSet: function () {
			this.inherited(arguments);
			this.titleNode.title &&
				this.applyTextDir(
					this.titleNode,
					this.titleNode.title
				);
		},
		_setTextDirAttr: function (e) {
			if (this._created && this.textDir != e) {
				this._set("textDir", e);
				this._setLabelAttr(this.label);
			}
		},
	}));

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			Button: typeof Button;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = Button;