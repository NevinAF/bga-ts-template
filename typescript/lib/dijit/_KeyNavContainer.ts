
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-attr");
import n = require("dojo/_base/kernel");
import o = require("dojo/keys");
import a = require("dojo/_base/lang");
import s = require("./registry");
import r = require("./_Container");
import l = require("./_FocusMixin");
import d = require("./_KeyNavMixin");

var _KeyNavContainer = t("dijit._KeyNavContainer", [l, d, r], {
	connectKeyNavHandlers: function (t, i) {
		var n = (this._keyNavCodes = {}),
			s = a.hitch(this, "focusPrev"),
			r = a.hitch(this, "focusNext");
		e.forEach(t, function (e) {
			n[e] = s;
		});
		e.forEach(i, function (e) {
			n[e] = r;
		});
		n[o.HOME] = a.hitch(this, "focusFirstChild");
		n[o.END] = a.hitch(this, "focusLastChild");
	},
	startupKeyNavChildren: function () {
		n.deprecated(
			"startupKeyNavChildren() call no longer needed",
			"",
			"2.0"
		);
	},
	startup: function () {
		this.inherited(arguments);
		e.forEach(
			this.getChildren(),
			a.hitch(this, "_startupChild")
		);
	},
	addChild: function (e, t) {
		this.inherited(arguments);
		this._startupChild(e);
	},
	_startupChild: function (e) {
		e.set("tabIndex", "-1");
	},
	_getFirst: function () {
		var e = this.getChildren();
		return e.length ? e[0] : null;
	},
	_getLast: function () {
		var e = this.getChildren();
		return e.length ? e[e.length - 1] : null;
	},
	focusNext: function () {
		this.focusChild(
			this._getNextFocusableChild(this.focusedChild, 1)
		);
	},
	focusPrev: function () {
		this.focusChild(
			this._getNextFocusableChild(this.focusedChild, -1),
			true
		);
	},
	childSelector: function (e) {
		return (e = s.byNode(e)) && e.getParent() == this;
	},
}) as DijitJS._KeyNavContainerConstructor

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_KeyNavContainer: typeof _KeyNavContainer;
		}
	}
}

export = _KeyNavContainer;