
// @ts-nocheck

import e = require("dojo/_base/lang");
import t = require("../_Widget");
import i = require("../_Container");
import n = require("../_Contained");
import o = require("../Viewport");
import a = require("dojo/_base/declare");
import s = require("dojo/dom-class");
import r = require("dojo/dom-geometry");
import l = require("dojo/dom-style");

var _LayoutWidget = a("dijit.layout._LayoutWidget", [t, i, n], {
	baseClass: "dijitLayoutContainer",
	isLayoutContainer: true,
	_setTitleAttr: null,
	buildRendering: function () {
		this.inherited(arguments);
		s.add(this.domNode, "dijitContainer");
	},
	startup: function () {
		if (!this._started) {
			this.inherited(arguments);
			var t = this.getParent && this.getParent();
			if (!t || !t.isLayoutContainer) {
				this.resize();
				this.own(
					o.on("resize", e.hitch(this, "resize"))
				);
			}
		}
	},
	resize: function (t, i) {
		var n = this.domNode;
		t && r.setMarginBox(n, t);
		var o = i || {};
		e.mixin(o, t || {});
		("h" in o && "w" in o) ||
			(o = e.mixin(r.getMarginBox(n), o));
		var a = l.getComputedStyle(n),
			s = r.getMarginExtents(n, a),
			d = r.getBorderExtents(n, a),
			c = (this._borderBox = {
				w: o.w - (s.w + d.w),
				h: o.h - (s.h + d.h),
			}),
			h = r.getPadExtents(n, a);
		this._contentBox = {
			l: l.toPixelValue(n, a.paddingLeft),
			t: l.toPixelValue(n, a.paddingTop),
			w: c.w - h.w,
			h: c.h - h.h,
		};
		this.layout();
	},
	layout: function () {},
	_setupChild: function (e) {
		var t =
			this.baseClass +
			"-child " +
			(e.baseClass
				? this.baseClass + "-" + e.baseClass
				: "");
		s.add(e.domNode, t);
	},
	addChild: function (e, t) {
		this.inherited(arguments);
		this._started && this._setupChild(e);
	},
	removeChild: function (e) {
		var t =
			this.baseClass +
			"-child" +
			(e.baseClass
				? " " + this.baseClass + "-" + e.baseClass
				: "");
		s.remove(e.domNode, t);
		this.inherited(arguments);
	},
}) as DijitJS.layout._LayoutWidgetConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitLayout {
			_LayoutWidget: typeof _LayoutWidget
		}

		interface Dijit {
			layout: DijitLayout
		}
	}
}

export = _LayoutWidget;