
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/_base/kernel");
import i = require("./Button");
import n = require("./_ToggleButtonMixin");

var ToggleButton = e("dijit.form.ToggleButton", [i, n], {
	baseClass: "dijitToggleButton",
	setChecked: function (e) {
		t.deprecated(
			"setChecked(" +
				e +
				") is deprecated. Use set('checked'," +
				e +
				") instead.",
			"",
			"2.0"
		);
		this.set("checked", e);
	},
}) as DijitJS.form.ToggleButtonConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			ToggleButton: typeof ToggleButton;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = ToggleButton;