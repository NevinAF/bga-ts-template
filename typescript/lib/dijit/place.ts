
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/dom-geometry");
import i = require("dojo/dom-style");
import n = require("dojo/_base/kernel");
import o = require("dojo/_base/window");
import a = require("./Viewport");
import dijit = require("./main");

function r(n, s, r, l) {
	var d = a.getEffectiveBox(n.ownerDocument);
	(n.parentNode &&
		"body" == String(n.parentNode.tagName).toLowerCase()) ||
		o.body(n.ownerDocument).appendChild(n);
	var c = null;
	e.some(s, function (e) {
		var i = e.corner,
			o = e.pos,
			a = 0,
			s = {
				w: { L: d.l + d.w - o.x, R: o.x - d.l, M: d.w }[
					i.charAt(1)
				],
				h: { T: d.t + d.h - o.y, B: o.y - d.t, M: d.h }[
					i.charAt(0)
				],
			},
			h = n.style;
		h.left = h.right = "auto";
		if (r) {
			var u = r(n, e.aroundCorner, i, s, l);
			a = undefined === u ? 0 : u;
		}
		var p = n.style,
			m = p.display,
			g = p.visibility;
		if ("none" == p.display) {
			p.visibility = "hidden";
			p.display = "";
		}
		var f = t.position(n);
		p.display = m;
		p.visibility = g;
		var _ = {
				L: o.x,
				R: o.x - f.w,
				M: Math.max(
					d.l,
					Math.min(d.l + d.w, o.x + (f.w >> 1)) - f.w
				),
			}[i.charAt(1)],
			v = {
				T: o.y,
				B: o.y - f.h,
				M: Math.max(
					d.t,
					Math.min(d.t + d.h, o.y + (f.h >> 1)) - f.h
				),
			}[i.charAt(0)],
			b = Math.max(d.l, _),
			y = Math.max(d.t, v),
			w = Math.min(d.l + d.w, _ + f.w) - b,
			C = Math.min(d.t + d.h, v + f.h) - y;
		a += f.w - w + (f.h - C);
		(null == c || a < c.overflow) &&
			(c = {
				corner: i,
				aroundCorner: e.aroundCorner,
				x: b,
				y: y,
				w: w,
				h: C,
				overflow: a,
				spaceAvailable: s,
			});
		return !a;
	});
	c.overflow &&
		r &&
		r(n, c.aroundCorner, c.corner, c.spaceAvailable, l);
	var h = c.y,
		u = c.x,
		p = o.body(n.ownerDocument);
	if (/relative|absolute/.test(i.get(p, "position"))) {
		h -= i.get(p, "marginTop");
		u -= i.get(p, "marginLeft");
	}
	var m = n.style;
	m.top = h + "px";
	m.left = u + "px";
	m.right = "auto";
	return c;
}
var l = { TL: "BR", TR: "BL", BL: "TR", BR: "TL" },
	place = {
		at: function (t, i, n, o, a) {
			return r(
				t,
				e.map(n, function (e) {
					var t = {
						corner: e,
						aroundCorner: l[e],
						pos: { x: i.x, y: i.y },
					};
					if (o) {
						t.pos.x +=
							"L" == e.charAt(1) ? o.x : -o.x;
						t.pos.y +=
							"T" == e.charAt(0) ? o.y : -o.y;
					}
					return t;
				}),
				a
			);
		},
		around: function (o, a, s, l, d) {
			var c;
			if (
				"string" == typeof a ||
				"offsetWidth" in a ||
				"ownerSVGElement" in a
			) {
				c = t.position(a, true);
				if (/^(above|below)/.test(s[0])) {
					var h = t.getBorderExtents(a),
						u = a.firstChild
							? t.getBorderExtents(a.firstChild)
							: { t: 0, l: 0, b: 0, r: 0 },
						p = t.getBorderExtents(o),
						m = o.firstChild
							? t.getBorderExtents(o.firstChild)
							: { t: 0, l: 0, b: 0, r: 0 };
					c.y += Math.min(h.t + u.t, p.t + m.t);
					c.h -=
						Math.min(h.t + u.t, p.t + m.t) +
						Math.min(h.b + u.b, p.b + m.b);
				}
			} else c = a;
			if (a.parentNode)
				for (
					var g =
							"absolute" ==
							i.getComputedStyle(a).position,
						f = a.parentNode;
					f &&
					1 == f.nodeType &&
					"BODY" != f.nodeName;

				) {
					var _ = t.position(f, true),
						v = i.getComputedStyle(f);
					/relative|absolute/.test(v.position) &&
						(g = false);
					if (
						!g &&
						/hidden|auto|scroll/.test(v.overflow)
					) {
						var b = Math.min(c.y + c.h, _.y + _.h),
							y = Math.min(c.x + c.w, _.x + _.w);
						c.x = Math.max(c.x, _.x);
						c.y = Math.max(c.y, _.y);
						c.h = b - c.y;
						c.w = y - c.x;
					}
					"absolute" == v.position && (g = true);
					f = f.parentNode;
				}
			var w = c.x,
				C = c.y,
				k = "w" in c ? c.w : (c.w = c.width),
				x =
					"h" in c
						? c.h
						: (n.deprecated(
								"place.around: dijit/place.__Rectangle: { x:" +
									w +
									", y:" +
									C +
									", height:" +
									c.height +
									", width:" +
									k +
									" } has been deprecated.  Please use { x:" +
									w +
									", y:" +
									C +
									", h:" +
									c.height +
									", w:" +
									k +
									" }",
								"",
								"2.0"
							),
							(c.h = c.height)),
				T = [];
			function A(e, t) {
				T.push({
					aroundCorner: e,
					corner: t,
					pos: {
						x: { L: w, R: w + k, M: w + (k >> 1) }[
							e.charAt(1)
						],
						y: { T: C, B: C + x, M: C + (x >> 1) }[
							e.charAt(0)
						],
					},
				});
			}
			e.forEach(s, function (e) {
				var t = l;
				switch (e) {
					case "above-centered":
						A("TM", "BM");
						break;
					case "below-centered":
						A("BM", "TM");
						break;
					case "after-centered":
						t = !t;
					case "before-centered":
						A(t ? "ML" : "MR", t ? "MR" : "ML");
						break;
					case "after":
						t = !t;
					case "before":
						A(t ? "TL" : "TR", t ? "TR" : "TL");
						A(t ? "BL" : "BR", t ? "BR" : "BL");
						break;
					case "below-alt":
						t = !t;
					case "below":
						A(t ? "BL" : "BR", t ? "TL" : "TR");
						A(t ? "BR" : "BL", t ? "TR" : "TL");
						break;
					case "above-alt":
						t = !t;
					case "above":
						A(t ? "TL" : "TR", t ? "BL" : "BR");
						A(t ? "TR" : "TL", t ? "BR" : "BL");
						break;
					default:
						A(e.aroundCorner, e.corner);
				}
			});
			var j = r(o, T, d, { w: k, h: x });
			j.aroundNodePos = c;
			return j;
		},
	} as DijitJS.Place;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			place: typeof place;
		}
	}
}

export = place;