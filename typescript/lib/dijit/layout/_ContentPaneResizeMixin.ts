
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-class");
import n = require("dojo/dom-geometry");
import o = require("dojo/dom-style");
import a = require("dojo/_base/lang");
import s = require("dojo/query");
import r = require("../registry");
import l = require("../Viewport");
import d = require("./utils");

var _ContentPaneResizeMixin = t("dijit.layout._ContentPaneResizeMixin", null, {
	doLayout: true,
	isLayoutContainer: true,
	startup: function () {
		if (!this._started) {
			var e = this.getParent();
			this._childOfLayoutWidget =
				e && e.isLayoutContainer;
			this._needLayout = !this._childOfLayoutWidget;
			this.inherited(arguments);
			this._isShown() && this._onShow();
			this._childOfLayoutWidget ||
				this.own(
					l.on("resize", a.hitch(this, "resize"))
				);
		}
	},
	_checkIfSingleChild: function () {
		if (this.doLayout) {
			var e = [],
				t = false;
			s("> *", this.containerNode).some(function (i) {
				var n = r.byNode(i);
				n && n.resize
					? e.push(n)
					: !/script|link|style/i.test(i.nodeName) &&
						i.offsetHeight &&
						(t = true);
			});
			this._singleChild =
				1 != e.length || t ? null : e[0];
			i.toggle(
				this.containerNode,
				this.baseClass + "SingleChild",
				!!this._singleChild
			);
		}
	},
	resize: function (e, t) {
		this._resizeCalled = true;
		this._scheduleLayout(e, t);
	},
	_scheduleLayout: function (e, t) {
		if (this._isShown()) this._layout(e, t);
		else {
			this._needLayout = true;
			this._changeSize = e;
			this._resultSize = t;
		}
	},
	_layout: function (e, t) {
		delete this._needLayout;
		this._wasShown || false === this.open || this._onShow();
		e && n.setMarginBox(this.domNode, e);
		var i = this.containerNode;
		if (i === this.domNode) {
			var o = t || {};
			a.mixin(o, e || {});
			("h" in o && "w" in o) ||
				(o = a.mixin(n.getMarginBox(i), o));
			this._contentBox = d.marginBox2contentBox(i, o);
		} else this._contentBox = n.getContentBox(i);
		this._layoutChildren();
	},
	_layoutChildren: function () {
		this._checkIfSingleChild();
		if (this._singleChild && this._singleChild.resize) {
			var e =
				this._contentBox ||
				n.getContentBox(this.containerNode);
			this._singleChild.resize({ w: e.w, h: e.h });
		} else
			for (
				var t, i = this.getChildren(), o = 0;
				(t = i[o++]);

			)
				t.resize && t.resize();
	},
	_isShown: function () {
		if (this._childOfLayoutWidget)
			return this._resizeCalled && "open" in this
				? this.open
				: this._resizeCalled;
		if ("open" in this) return this.open;
		var e = this.domNode,
			t = this.domNode.parentNode;
		return (
			"none" != e.style.display &&
			"hidden" != e.style.visibility &&
			!i.contains(e, "dijitHidden") &&
			t &&
			t.style &&
			"none" != t.style.display
		);
	},
	_onShow: function () {
		this._wasShown = true;
		this._needLayout &&
			this._layout(this._changeSize, this._resultSize);
		this.inherited(arguments);
	},
}) as DijitJS.layout._ContentPaneResizeMixinConstructor;

declare global {
	namespace DojoJS
	{
		interface _ContentPaneResizeMixin extends Type<typeof _ContentPaneResizeMixin> {}
		interface DijitLayout {
			_ContentPaneResizeMixin: _ContentPaneResizeMixin;
		}

		interface Dijit {
			layout: DijitLayout;
		}
	}
}

export = _ContentPaneResizeMixin;