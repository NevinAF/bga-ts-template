
// @ts-nocheck

import e = require("dojo/on");
import t = require("dojo/_base/array");
import i = require("dojo/keys");
import n = require("dojo/_base/declare");
import o = require("dojo/has");
import a = require("./a11yclick");

var _OnDijitClickMixin = n("dijit._OnDijitClickMixin", null, {
	connect: function (e, t, i) {
		return this.inherited(arguments, [
			e,
			"ondijitclick" == t ? a : t,
			i,
		]);
	},
}) as DijitJS._OnDijitClickMixinConstructor;
_OnDijitClickMixin.a11yclick = a;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_OnDijitClickMixin: typeof _OnDijitClickMixin;
		}
	}
}

export = _OnDijitClickMixin;