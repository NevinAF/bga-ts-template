
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/sniff");
import i = require("dojo/_base/kernel");
import n = require("dojo/ready");
import o = require("../_Widget");
import a = require("../_CssStateMixin");
import s = require("../_TemplatedMixin");
import r = require("./_FormWidgetMixin");

t("dijit-legacy-requires") &&
	n(0, function () {
		require(["dijit/form/_FormValueWidget"]);
	});
var _FormWidgetConstructor = e("dijit.form._FormWidget", [o, s, a, r], {
	setDisabled: function (e) {
		i.deprecated(
			"setDisabled(" +
				e +
				") is deprecated. Use set('disabled'," +
				e +
				") instead.",
			"",
			"2.0"
		);
		this.set("disabled", e);
	},
	setValue: function (e) {
		i.deprecated(
			"dijit.form._FormWidget:setValue(" +
				e +
				") is deprecated.  Use set('value'," +
				e +
				") instead.",
			"",
			"2.0"
		);
		this.set("value", e);
	},
	getValue: function () {
		i.deprecated(
			this.declaredClass +
				"::getValue() is deprecated. Use get('value') instead.",
			"",
			"2.0"
		);
		return this.get("value");
	},
	postMixInProperties: function () {
		this.nameAttrSetting =
			this.name && !t("msapp")
				? 'name="' +
					this.name.replace(/"/g, "&quot;") +
					'"'
				: "";
		this.inherited(arguments);
	},
}) as DijitJS.form._FormWidgetConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_FormWidgetConstructor: typeof _FormWidgetConstructor;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _FormWidgetConstructor;