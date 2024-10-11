
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("./registry");

var _Contained = e("dijit._Contained", null, {
	_getSibling: function (e) {
		var t = this.getParent();
		return (
			(t &&
				t._getSiblingOfChild &&
				t._getSiblingOfChild(
					this,
					"previous" == e ? -1 : 1
				)) ||
			null
		);
	},
	getPreviousSibling: function () {
		return this._getSibling("previous");
	},
	getNextSibling: function () {
		return this._getSibling("next");
	},
	getIndexInParent: function () {
		var e = this.getParent();
		return e && e.getIndexOfChild
			? e.getIndexOfChild(this)
			: -1;
	},
}) as DijitJS._ContainedConstructor;

declare global {
	namespace DojoJS {
		interface Dijit {
			_Contained: typeof _Contained;
		}
	}
}

export = _Contained;