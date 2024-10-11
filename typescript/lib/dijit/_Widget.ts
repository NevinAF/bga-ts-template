
// @ts-nocheck

import aspect = require("dojo/aspect");
import config = require("dojo/_base/config");
import connect = require("dojo/_base/connect");
import declare = require("dojo/_base/declare");
import has = require("dojo/has");
import dojo = require("dojo/_base/kernel");
import lang = require("dojo/_base/lang");
import query = require("dojo/query");
import ready = require("dojo/ready");
import registry = require("./registry");
import _WidgetBase = require("./_WidgetBase");
import _OnDijitClickMixin = require("./_OnDijitClickMixin");
import _FocusMixin = require("./_FocusMixin");
import "dojo/uacss";
import "./hccss";

function p() {}
function m(e) {
	return function (t, n, o, a) {
		return t && "string" == typeof n && t[n] == p
			? t.on(n.substring(2).toLowerCase(), lang.hitch(o, a))
			: e.apply(connect, arguments);
	};
}
aspect.around(connect, "connect", m);
dojo.connect && aspect.around(dojo, "connect", m);
var _Widget = declare("dijit._Widget", [_WidgetBase, _OnDijitClickMixin, _FocusMixin], {
	onClick: p,
	onDblClick: p,
	onKeyDown: p,
	onKeyPress: p,
	onKeyUp: p,
	onMouseDown: p,
	onMouseMove: p,
	onMouseOut: p,
	onMouseOver: p,
	onMouseLeave: p,
	onMouseEnter: p,
	onMouseUp: p,
	constructor: function (e) {
		this._toConnect = {};
		for (var t in e)
			if (this[t] === p) {
				this._toConnect[
					t.replace(/^on/, "").toLowerCase()
				] = e[t];
				delete e[t];
			}
	},
	postCreate: function () {
		this.inherited(arguments);
		for (var e in this._toConnect)
			this.on(e, this._toConnect[e]);
		delete this._toConnect;
	},
	on: function (e, t) {
		return this[this._onMap(e)] === p
			? connect.connect(this.domNode, e.toLowerCase(), this, t)
			: this.inherited(arguments);
	},
	_setFocusedAttr: function (e) {
		this._focused = e;
		this._set("focused", e);
	},
	setAttribute: function (e, t) {
		dojo.deprecated(
			this.declaredClass +
				"::setAttribute(attr, value) is deprecated. Use set() instead.",
			"",
			"2.0"
		);
		this.set(e, t);
	},
	attr: function (e, t) {
		return arguments.length >= 2 || "object" == typeof e
			? this.set.apply(this, arguments)
			: this.get(e);
	},
	getDescendants: function () {
		dojo.deprecated(
			this.declaredClass +
				"::getDescendants() is deprecated. Use getChildren() instead.",
			"",
			"2.0"
		);
		return this.containerNode
			? query("[widgetId]", this.containerNode).map(registry.byNode)
			: [];
	},
	_onShow: function () {
		this.onShow();
	},
	onShow: function () {},
	onHide: function () {},
	onClose: function () {
		return true;
	},
}) as DojoJS.DojoClass<DijitJS._Widget>;
has("dijit-legacy-requires") &&
	ready(0, function () {
		require(["dijit/_base"]);
	});

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_Widget: typeof _Widget;
		}
	}
}

export = _Widget;