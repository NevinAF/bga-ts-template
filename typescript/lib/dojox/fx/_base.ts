// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/lang");
import i = require("dojo/_base/fx");
import dojoFx = require("dojo/fx");
import o = require("dojo/dom");
import a = require("dojo/dom-style");
import s = require("dojo/dom-geometry");
import r = require("dojo/_base/connect");
import l = require("dojo/_base/html");

var dojoxFx = t.getObject("dojox.fx", true) as {
	anim: typeof i.anim;
	animateProperty: typeof i.animateProperty;
	fadeTo: typeof i._fade;
	fadeIn: typeof i.fadeIn;
	fadeOut: typeof i.fadeOut;
	combine: typeof dojoFx.combine;
	chain: typeof dojoFx.chain;
	slideTo: typeof dojoFx.slideTo;
	wipeIn: typeof dojoFx.wipeIn;
	wipeOut: typeof dojoFx.wipeOut;
	sizeTo: (e: { node: string | HTMLElement; method?: string; duration?: number; width?: number; height?: number }) => typeof dojoFx.Animation;
	slideBy: (e: { node: string | HTMLElement; top?: number; left?: number }) => typeof dojoFx.Animation;
	crossFade: (e: { nodes: (string | HTMLElement)[]; duration?: number; color?: string }) => typeof dojoFx.Animation;
	highlight: (e: { node: string | HTMLElement; duration?: number; color?: string }) => typeof dojoFx.Animation;
	wipeTo: (e: { node: string | HTMLElement; width?: number; height?: number; duration?: number }) => typeof dojoFx.Animation;
}
t.mixin(dojoxFx, {
	anim: i.anim,
	animateProperty: i.animateProperty,
	fadeTo: i._fade,
	fadeIn: i.fadeIn,
	fadeOut: i.fadeOut,
	combine: dojoFx.combine,
	chain: dojoFx.chain,
	slideTo: dojoFx.slideTo,
	wipeIn: dojoFx.wipeIn,
	wipeOut: dojoFx.wipeOut,
});
dojoxFx.sizeTo = function (e) {
	var s = (e.node = o.byId(e.node)),
		r = "absolute",
		l = e.method || "chain";
	e.duration || (e.duration = 500);
	"chain" == l && (e.duration = Math.floor(e.duration / 2));
	var d,
		c,
		h,
		u,
		p,
		m,
		g = null,
		f =
			((m = s),
			function () {
				var t = a.getComputedStyle(m),
					i = t.position,
					n = t.width,
					o = t.height;
				d = i == r ? m.offsetTop : parseInt(t.top) || 0;
				h =
					i == r
						? m.offsetLeft
						: parseInt(t.left) || 0;
				p = "auto" == n ? 0 : parseInt(n);
				g = "auto" == o ? 0 : parseInt(o);
				u = h - Math.floor((e.width - p) / 2);
				c = d - Math.floor((e.height - g) / 2);
				if (i != r && "relative" != i) {
					var s = a.coords(m, true);
					d = s.y;
					h = s.x;
					m.style.position = r;
					m.style.top = d + "px";
					m.style.left = h + "px";
				}
			}),
		_ = i.animateProperty(
			t.mixin(
				{
					properties: {
						height: function () {
							f();
							return {
								end: e.height || 0,
								start: g,
							};
						},
						top: function () {
							return { start: d, end: c };
						},
					},
				},
				e
			)
		),
		v = i.animateProperty(
			t.mixin(
				{
					properties: {
						width: function () {
							return {
								start: p,
								end: e.width || 0,
							};
						},
						left: function () {
							return { start: h, end: u };
						},
					},
				},
				e
			)
		);
	return dojoFx["combine" == e.method ? "combine" : "chain"]([
		_,
		v,
	]);
};
dojoxFx.slideBy = function (e) {
	var n,
		l,
		d,
		c = (e.node = o.byId(e.node)),
		h =
			((d = c),
			function () {
				var e = a.getComputedStyle(d),
					t = e.position;
				n =
					"absolute" == t
						? d.offsetTop
						: parseInt(e.top) || 0;
				l =
					"absolute" == t
						? d.offsetLeft
						: parseInt(e.left) || 0;
				if ("absolute" != t && "relative" != t) {
					var i = s.coords(d, true);
					n = i.y;
					l = i.x;
					d.style.position = "absolute";
					d.style.top = n + "px";
					d.style.left = l + "px";
				}
			});
	h();
	var u = i.animateProperty(
		t.mixin(
			{
				properties: {
					top: n + (e.top || 0),
					left: l + (e.left || 0),
				},
			},
			e
		)
	);
	r.connect(u, "beforeBegin", u, h);
	return u;
};
dojoxFx.crossFade = function (e) {
	var a = (e.nodes[0] = o.byId(e.nodes[0])),
		s = l.style(a, "opacity"),
		r = (e.nodes[1] = o.byId(e.nodes[1]));
	l.style(r, "opacity");
	return dojoFx.combine([
		i[0 == s ? "fadeIn" : "fadeOut"](
			t.mixin({ node: a }, e)
		),
		i[0 == s ? "fadeOut" : "fadeIn"](
			t.mixin({ node: r }, e)
		),
	]);
};
dojoxFx.highlight = function (e) {
	var n = (e.node = o.byId(e.node));
	e.duration = e.duration || 400;
	var a = e.color || "#ffff99",
		s = l.style(n, "backgroundColor");
	"rgba(0, 0, 0, 0)" == s && (s = "transparent");
	var d = i.animateProperty(
		t.mixin(
			{
				properties: {
					backgroundColor: { start: a, end: s },
				},
			},
			e
		)
	);
	"transparent" == s &&
		r.connect(d, "onEnd", d, function () {
			n.style.backgroundColor = s;
		});
	return d;
};
dojoxFx.wipeTo = function (e) {
	e.node = o.byId(e.node);
	var n = e.node,
		a = n.style,
		s = e.width ? "width" : "height",
		r = e[s],
		d = {};
	d[s] = {
		start: function () {
			a.overflow = "hidden";
			if (
				"hidden" == a.visibility ||
				"none" == a.display
			) {
				a[s] = "1px";
				a.display = "";
				a.visibility = "";
				return 1;
			}
			var e = l.style(n, s);
			return Math.max(e, 1);
		},
		end: r,
	};
	return i.animateProperty(t.mixin({ properties: d }, e));
};

declare global {
	namespace DojoJS
	{
		interface Dojox {
			fx: typeof dojoxFx;
		}
	}
}

export = dojoxFx;