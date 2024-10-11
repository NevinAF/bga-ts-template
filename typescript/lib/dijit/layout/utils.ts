// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/dom-class");
import i = require("dojo/dom-geometry");
import n = require("dojo/dom-style");
import o = require("dojo/_base/lang");

function a(e, t) {
	var n = e.resize
		? e.resize(t)
		: i.setMarginBox(e.domNode, t);
	if (n) o.mixin(e, n);
	else {
		o.mixin(e, i.getMarginBox(e.domNode));
		o.mixin(e, t);
	}
}
var s = {
	marginBox2contentBox: function (e, t) {
		var o = n.getComputedStyle(e),
			a = i.getMarginExtents(e, o),
			s = i.getPadBorderExtents(e, o);
		return {
			l: n.toPixelValue(e, o.paddingLeft),
			t: n.toPixelValue(e, o.paddingTop),
			w: t.w - (a.w + s.w),
			h: t.h - (a.h + s.h),
		};
	},
	layoutChildren: function (i, n, s, r, l) {
		n = o.mixin({}, n);
		t.add(i, "dijitLayoutContainer");
		s = e
			.filter(s, function (e) {
				return (
					"center" != e.region &&
					"client" != e.layoutAlign
				);
			})
			.concat(
				e.filter(s, function (e) {
					return (
						"center" == e.region ||
						"client" == e.layoutAlign
					);
				})
			);
		e.forEach(s, function (e) {
			var i = e.domNode,
				o = e.region || e.layoutAlign;
			if (!o)
				throw new Error(
					"No region setting for " + e.id
				);
			var s,
				d = i.style;
			d.left = n.l + "px";
			d.top = n.t + "px";
			d.position = "absolute";
			t.add(
				i,
				"dijitAlign" +
					((s = o).substring(0, 1).toUpperCase() +
						s.substring(1))
			);
			var c = {};
			r &&
				r == e.id &&
				(c[
					"top" == e.region || "bottom" == e.region
						? "h"
						: "w"
				] = l);
			"leading" == o &&
				(o = e.isLeftToRight() ? "left" : "right");
			"trailing" == o &&
				(o = e.isLeftToRight() ? "right" : "left");
			if ("top" == o || "bottom" == o) {
				c.w = n.w;
				a(e, c);
				n.h -= e.h;
				"top" == o
					? (n.t += e.h)
					: (d.top = n.t + n.h + "px");
			} else if ("left" == o || "right" == o) {
				c.h = n.h;
				a(e, c);
				n.w -= e.w;
				"left" == o
					? (n.l += e.w)
					: (d.left = n.l + n.w + "px");
			} else ("client" != o && "center" != o) || a(e, n);
		});
	},
};
o.setObject("dijit.layout.utils", s);

declare global {
	namespace DojoJS
	{
		interface _ContentPaneResizeMixin extends Type<typeof s> {}

		interface DijitLayout {
			_ContentPaneResizeMixin: _ContentPaneResizeMixin;
		}

		interface Dijit {
			layout: DijitLayout;
		}
	}
}

export = s;