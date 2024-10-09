// @ts-nocheck

import e = require("./sniff");
import t = require("./dom");
import n = require("./_base/window");

var r,
	o,
	i: Partial<DojoJS.DomStyle> = {};
r = e("webkit")
	? function (e) {
			var t;
			if (1 == e.nodeType) {
				var n = e.ownerDocument.defaultView;
				if (
					!(t = n.getComputedStyle(e, null)) &&
					e.style
				) {
					e.style.display = "";
					t = n.getComputedStyle(e, null);
				}
			}
			return t || {};
		}
	: e("ie") && (e("ie") < 9 || e("quirks"))
	? function (e) {
			return 1 == e.nodeType && e.currentStyle
				? e.currentStyle
				: {};
		}
	: function (e) {
			if (1 === e.nodeType) {
				var t = e.ownerDocument.defaultView;
				return (
					t.opener ? t : n.global.window
				).getComputedStyle(e, null);
			}
			return {};
		};
i.getComputedStyle = r;
o = e("ie")
	? function (e, t) {
			if (!t) return 0;
			if ("medium" == t) return 4;
			if (t.slice && "px" == t.slice(-2))
				return parseFloat(t);
			var n = e.style,
				r = e.runtimeStyle,
				o = e.currentStyle,
				i = n.left,
				a = r.left;
			r.left = o.left;
			try {
				n.left = t;
				t = n.pixelLeft;
			} catch (s) {
				t = 0;
			}
			n.left = i;
			r.left = a;
			return t;
		}
	: function (e, t) {
			return parseFloat(t) || 0;
		};
i.toPixelValue = o;
var a = "DXImageTransform.Microsoft.Alpha",
	s = function (e, t) {
		try {
			return e.filters.item(a);
		} catch (n) {
			return t ? {} : null;
		}
	},
	u =
		e("ie") < 9 || (e("ie") < 10 && e("quirks"))
			? function (e) {
					try {
						return s(e).Opacity / 100;
					} catch (t) {
						return 1;
					}
				}
			: function (e) {
					return r(e).opacity;
				},
	c =
		e("ie") < 9 || (e("ie") < 10 && e("quirks"))
			? function (e, t) {
					"" === t && (t = 1);
					var n = 100 * t;
					if (1 === t) {
						e.style.zoom = "";
						s(e) &&
							(e.style.filter =
								e.style.filter.replace(
									new RegExp(
										"\\s*progid:" +
											a +
											"\\([^\\)]+?\\)",
										"i"
									),
									""
								));
					} else {
						e.style.zoom = 1;
						s(e)
							? (s(e, 1).Opacity = n)
							: (e.style.filter +=
									" progid:" +
									a +
									"(Opacity=" +
									n +
									")");
						s(e, 1).Enabled = true;
					}
					if ("tr" == e.tagName.toLowerCase())
						for (
							var r = e.firstChild;
							r;
							r = r.nextSibling
						)
							"td" == r.tagName.toLowerCase() &&
								c(r, t);
					return t;
				}
			: function (e, t) {
					return (e.style.opacity = t);
				},
	l = { left: true, top: true },
	f = /margin|padding|width|height|max|min|offset/;
var d = { cssFloat: 1, styleFloat: 1, float: 1 };
i.get = function (e, n) {
	var r = t.byId(e),
		a = arguments.length;
	if (2 == a && "opacity" == n) return u(r);
	n = d[n]
		? "cssFloat" in r.style
			? "cssFloat"
			: "styleFloat"
		: n;
	var s = i.getComputedStyle(r);
	return 1 == a
		? s
		: (function (e, t, n) {
				t = t.toLowerCase();
				if ("auto" == n) {
					if ("height" == t) return e.offsetHeight;
					if ("width" == t) return e.offsetWidth;
				}
				if ("fontweight" == t)
					return 700 === n ? "bold" : "normal";
				t in l || (l[t] = f.test(t));
				return l[t] ? o(e, n) : n;
			})(r, n, s[n] || r.style[n]);
};
i.set = function (e, n, r) {
	var o = t.byId(e),
		a = arguments.length,
		s = "opacity" == n;
	n = d[n]
		? "cssFloat" in o.style
			? "cssFloat"
			: "styleFloat"
		: n;
	if (3 == a) return s ? c(o, r) : (o.style[n] = r);
	for (var u in n) i.set(e, u, n[u]);
	return i.getComputedStyle(o);
};

declare global {
	namespace DojoJS
	{	
		interface DomStyle {
			/**
			 * Returns a "computed style" object.
			 */
			getComputedStyle(node: Node): CSSStyleDeclaration;
	
			/**
			 * Accesses styles on a node.
			 */
			get(node: Element | string): CSSStyleDeclaration;
			get<T extends keyof CSSStyleDeclaration>(node: Element | string, name: T): CSSStyleDeclaration[T];
	
			/**
			 * Sets styles on a node.
			 */
			set(node: Element | string, props: Partial<CSSStyleDeclaration>): CSSStyleDeclaration;
			set(node: Element | string, name: 'opacity', value: number): number;
			set<T extends keyof CSSStyleDeclaration>(node: Element | string, name: T, value: CSSStyleDeclaration[T]): CSSStyleDeclaration[T];
	
			/**
			 * converts style value to pixels on IE or return a numeric value.
			 */
			toPixelValue(element: Element, value: string): number;
		}
	}
}

export = i as DojoJS.DomStyle;