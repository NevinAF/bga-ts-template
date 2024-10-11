
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("./a11y");

var _DialogMixin = e("dijit._DialogMixin", null, {
	actionBarTemplate: "",
	execute: function () {},
	onCancel: function () {},
	onExecute: function () {},
	_onSubmit: function () {
		this.onExecute();
		this.execute(this.get("value"));
	},
	_getFocusItems: function () {
		var e = t._getTabNavigable(this.domNode);
		this._firstFocusItem =
			e.lowest ||
			e.first ||
			this.closeButtonNode ||
			this.domNode;
		this._lastFocusItem =
			e.last || e.highest || this._firstFocusItem;
	},
} as DijitJS._DialogMixin);
		

declare global {
	namespace DojoJS {
		interface Dijit {
			_DialogMixin: typeof _DialogMixin;
		}
	}
}
export = _DialogMixin;