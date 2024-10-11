
// @ts-nocheck

import e = require("./focus");
import _WidgetBase = require("./_WidgetBase");
import i = require("dojo/_base/declare");
import n = require("dojo/_base/lang");

n.extend(_WidgetBase, {
	focused: false,
	onFocus: function () {},
	onBlur: function () {},
	_onFocus: function () {
		this.onFocus();
	},
	_onBlur: function () {
		this.onBlur();
	},
});
var _FocusMixin = i("dijit._FocusMixin", null, { _focusManager: e });

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_FocusMixin: typeof _FocusMixin;
		}
	}
}

export = _FocusMixin;