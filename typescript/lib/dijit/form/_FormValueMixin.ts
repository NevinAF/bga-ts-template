
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom-attr");
import i = require("dojo/keys");
import n = require("dojo/_base/lang");
import o = require("dojo/on");
import a = require("dojo/sniff");
import s = require("./_FormWidgetMixin");

var _FormValueMixin = e("dijit.form._FormValueMixin", s, {
	readOnly: false,
	_setReadOnlyAttr: function (e) {
		a("trident") && "disabled" in this
			? t.set(
					this.focusNode,
					"readOnly",
					e || this.disabled
				)
			: t.set(this.focusNode, "readOnly", e);
		this._set("readOnly", e);
	},
	postCreate: function () {
		this.inherited(arguments);
		undefined === this._resetValue &&
			(this._lastValueReported = this._resetValue =
				this.value);
	},
	_setValueAttr: function (e, t) {
		this._handleOnChange(e, t);
	},
	_handleOnChange: function (e, t) {
		this._set("value", e);
		this.inherited(arguments);
	},
	undo: function () {
		this._setValueAttr(this._lastValueReported, false);
	},
	reset: function () {
		this._hasBeenBlurred = false;
		this._setValueAttr(this._resetValue, true);
	},
} as DijitJS.form._FormValueMixin);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_FormValueMixin: typeof _FormValueMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _FormValueMixin;