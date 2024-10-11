
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom-attr");

var _ToggleButtonMixin = e("dijit.form._ToggleButtonMixin", null, {
	checked: false,
	_aria_attr: "aria-pressed",
	_onClick: function (e) {
		var t = this.checked;
		this._set("checked", !t);
		var i = this.inherited(arguments);
		this.set("checked", i ? this.checked : t);
		return i;
	},
	_setCheckedAttr: function (e, i) {
		this._set("checked", e);
		var n = this.focusNode || this.domNode;
		this._created &&
			t.get(n, "checked") != !!e &&
			t.set(n, "checked", !!e);
		n.setAttribute(this._aria_attr, String(e));
		this._handleOnChange(e, i);
	},
	postCreate: function () {
		this.inherited(arguments);
		var e = this.focusNode || this.domNode;
		this.checked && e.setAttribute("checked", "checked");
		undefined === this._resetValue &&
			(this._lastValueReported = this._resetValue =
				this.checked);
	},
	reset: function () {
		this._hasBeenBlurred = false;
		this.set("checked", this.params.checked || false);
	},
} as DijitJS.form._ToggleButtonMixin);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_ToggleButtonMixin: typeof _ToggleButtonMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _ToggleButtonMixin;