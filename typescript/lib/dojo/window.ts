// @ts-nocheck

import lang = require("./_base/lang");
import has = require("./sniff");
import window = require("./_base/window");
import dom = require("./dom");
import domGeo = require("./dom-geometry");
import domStyle = require("./dom-style");
import domConstruct = require("./dom-construct");

has.add(
	"rtl-adjust-position-for-verticalScrollBar",
	function (e, t) {
		var n = window.body(t),
			a = domConstruct.create(
				"div",
				{
					style: {
						overflow: "scroll",
						overflowX: "visible",
						direction: "rtl",
						visibility: "hidden",
						position: "absolute",
						left: "0",
						top: "0",
						width: "64px",
						height: "64px",
					},
				},
				n,
				"last"
			),
			r = domConstruct.create(
				"div",
				{
					style: {
						overflow: "hidden",
						direction: "ltr",
					},
				},
				a,
				"last"
			),
			l = 0 != domGeo.position(r).x;
		a.removeChild(r);
		n.removeChild(a);
		return l;
	}
);
has.add("position-fixed-support", function (e, t) {
	var n = window.body(t),
		a = domConstruct.create(
			"span",
			{
				style: {
					visibility: "hidden",
					position: "fixed",
					left: "1px",
					top: "1px",
				},
			},
			n,
			"last"
		),
		r = domConstruct.create(
			"span",
			{
				style: {
					position: "fixed",
					left: "0",
					top: "0",
				},
			},
			a,
			"last"
		),
		l = domGeo.position(r).x != domGeo.position(a).x;
	a.removeChild(r);
	n.removeChild(a);
	return l;
});
var _window: WindowModule = {
	getBox: function (e) {
		var n,
			a,
			s =
				"BackCompat" == (e = e || window.doc).compatMode
					? window.body(e)
					: e.documentElement,
			l = domGeo.docScroll(e);
		if (has("touch")) {
			var d = _window.get(e);
			n = d.innerWidth || s.clientWidth;
			a = d.innerHeight || s.clientHeight;
		} else {
			n = s.clientWidth;
			a = s.clientHeight;
		}
		return { l: l.x, t: l.y, w: n, h: a };
	},
	get: function (e) {
		if (has("ie") && _window !== document.parentWindow) {
			e.parentWindow.execScript(
				"document._parentWindow = window;",
				"Javascript"
			);
			var i = e._parentWindow;
			e._parentWindow = null;
			return i;
		}
		return e.parentWindow || e.defaultView;
	},
	scrollIntoView: function (e, s) {
		try {
			var r = (e = dom.byId(e)).ownerDocument || window.doc,
				l = window.body(r),
				d = r.documentElement || l.parentNode,
				c = has("ie") || has("trident"),
				h = has("webkit");
			if (e == l || e == d) return;
			if (
				!(
					has("mozilla") ||
					c ||
					h ||
					has("opera") ||
					has("trident") ||
					has("edge")
				) &&
				"scrollIntoView" in e
			) {
				e.scrollIntoView(false);
				return;
			}
			var u = "BackCompat" == r.compatMode,
				p = Math.min(
					l.clientWidth || d.clientWidth,
					d.clientWidth || l.clientWidth
				),
				m = Math.min(
					l.clientHeight || d.clientHeight,
					d.clientHeight || l.clientHeight
				),
				g = h || u ? l : d,
				f = s || domGeo.position(e),
				_ = e.parentNode,
				v = function (e) {
					return (
						!(c <= 6 || (7 == c && u)) &&
						has("position-fixed-support") &&
						"fixed" ==
							domStyle.get(e, "position").toLowerCase()
					);
				},
				b = this,
				y = function (e, t, i) {
					if (
						"BODY" == e.tagName ||
						"HTML" == e.tagName
					)
						b.get(e.ownerDocument).scrollBy(t, i);
					else {
						t && (e.scrollLeft += t);
						i && (e.scrollTop += i);
					}
				};
			if (v(e)) return;
			for (; _; ) {
				_ == l && (_ = g);
				var w = domGeo.position(_),
					C = v(_),
					k =
						"rtl" ==
						domStyle
							.getComputedStyle(_)
							.direction.toLowerCase();
				if (_ == g) {
					w.w = p;
					w.h = m;
					g == d &&
						(c || has("trident")) &&
						k &&
						(w.x += g.offsetWidth - w.w);
					w.x = 0;
					w.y = 0;
				} else {
					var x = domGeo.getPadBorderExtents(_);
					w.w -= x.w;
					w.h -= x.h;
					w.x += x.l;
					w.y += x.t;
					var T = _.clientWidth,
						A = w.w - T;
					if (T > 0 && A > 0) {
						k &&
							has(
								"rtl-adjust-position-for-verticalScrollBar"
							) &&
							(w.x += A);
						w.w = T;
					}
					T = _.clientHeight;
					A = w.h - T;
					T > 0 && A > 0 && (w.h = T);
				}
				if (C) {
					if (w.y < 0) {
						w.h += w.y;
						w.y = 0;
					}
					if (w.x < 0) {
						w.w += w.x;
						w.x = 0;
					}
					w.y + w.h > m && (w.h = m - w.y);
					w.x + w.w > p && (w.w = p - w.x);
				}
				var j,
					S,
					E = f.x - w.x,
					N = f.y - w.y,
					M = E + f.w - w.w,
					D = N + f.h - w.h;
				if (
					M * E > 0 &&
					(_.scrollLeft ||
						_ == g ||
						_.scrollWidth > _.offsetHeight)
				) {
					j = Math[E < 0 ? "max" : "min"](E, M);
					k &&
						((8 == c && !u) || has("trident") >= 5) &&
						(j = -j);
					S = _.scrollLeft;
					y(_, j, 0);
					j = _.scrollLeft - S;
					f.x -= j;
				}
				if (
					D * N > 0 &&
					(_.scrollTop ||
						_ == g ||
						_.scrollHeight > _.offsetHeight)
				) {
					j = Math.ceil(
						Math[N < 0 ? "max" : "min"](N, D)
					);
					S = _.scrollTop;
					y(_, 0, j);
					j = _.scrollTop - S;
					f.y -= j;
				}
				_ = _ != g && !C && _.parentNode;
			}
		} catch (I) {
			console.error("scrollIntoView: " + I);
			e.scrollIntoView(false);
		}
	},
};
lang.setObject("dojo.window", _window);

interface WindowModule {

	/**
	 * Returns the dimensions and scroll position of the viewable area of a browser window
	 */
	getBox(doc?: Document): { l: number; t: number; w: number; h: number; };

	/**
	 * Get window object associated with document doc.
	 */
	get(doc?: Document): Window;

	/**
	 * Scroll the passed node into view using minimal movement, if it is not already.
	 */
	scrollIntoView(node: Element, pos?: { x: number; y: number, w: number; h: number; }): void;
}

declare global {
	namespace DojoJS {
		interface Dojo {
			window: WindowModule;
		}
	}
}

export = _window;