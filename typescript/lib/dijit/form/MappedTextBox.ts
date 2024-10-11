
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/sniff");
import i = require("dojo/dom-construct");
import n = require("./ValidationTextBox");

var MappedTextBox = e("dijit.form.MappedTextBox", n, {
	postMixInProperties: function () {
		this.inherited(arguments);
		this.nameAttrSetting = "";
	},
	_setNameAttr: "valueNode",
	serialize: function (e) {
		return e.toString ? e.toString() : "";
	},
	toString: function () {
		var e = this.filter(this.get("value"));
		return null != e
			? "string" == typeof e
				? e
				: this.serialize(e, this.constraints)
			: "";
	},
	validate: function () {
		this.valueNode.value = this.toString();
		return this.inherited(arguments);
	},
	buildRendering: function () {
		this.inherited(arguments);
		this.valueNode = i.place(
			"<input type='hidden'" +
				(this.name && !t("msapp")
					? ' name="' +
						this.name.replace(/"/g, "&quot;") +
						'"'
					: "") +
				"/>",
			this.textbox,
			"after"
		);
	},
	reset: function () {
		this.valueNode.value = "";
		this.inherited(arguments);
	},
}) as DijitJS.form.MappedTextBoxConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			MappedTextBox: typeof MappedTextBox;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = MappedTextBox;