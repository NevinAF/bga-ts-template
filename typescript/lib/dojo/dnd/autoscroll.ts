// @ts-nocheck

import lang = require("../_base/lang");
import has = require("../sniff");
import _baseWindow = require("../_base/window");
import domGeo = require("../dom-geometry");
import domStyle = require("../dom-style");
import _window = require("../window");


var autoscroll = {} as DojoJS.dnd.AutoScroll;
lang.setObject("dojo.dnd.autoscroll", autoscroll);
autoscroll.getViewport = _window.getBox;
autoscroll.V_TRIGGER_AUTOSCROLL = 32;
autoscroll.H_TRIGGER_AUTOSCROLL = 32;
autoscroll.V_AUTOSCROLL_VALUE = 16;
autoscroll.H_AUTOSCROLL_VALUE = 16;
var r,
	l = _baseWindow.doc,
	d = 1 / 0,
	c = 1 / 0;
autoscroll.autoScrollStart = function (e) {
	l = e;
	r = _window.getBox(l);
	var t = _baseWindow.body(l).parentNode;
	d = Math.max(t.scrollHeight - r.h, 0);
	c = Math.max(t.scrollWidth - r.w, 0);
};
autoscroll.autoScroll = function (e) {
	var t = r || _window.getBox(l),
		n = _baseWindow.body(l).parentNode,
		o = 0,
		h = 0;
	e.clientX < autoscroll.H_TRIGGER_AUTOSCROLL
		? (o = -autoscroll.H_AUTOSCROLL_VALUE)
		: e.clientX > t.w - autoscroll.H_TRIGGER_AUTOSCROLL &&
			(o = Math.min(
				autoscroll.H_AUTOSCROLL_VALUE,
				c - n.scrollLeft
			));
	e.clientY < autoscroll.V_TRIGGER_AUTOSCROLL
		? (h = -autoscroll.V_AUTOSCROLL_VALUE)
		: e.clientY > t.h - autoscroll.V_TRIGGER_AUTOSCROLL &&
			(h = Math.min(autoscroll.V_AUTOSCROLL_VALUE, d - n.scrollTop));
	window.scrollBy(o, h);
};
autoscroll._validNodes = { div: 1, p: 1, td: 1 };
autoscroll._validOverflow = { auto: 1, scroll: 1 };
autoscroll.autoScrollNodes = function (e) {
	for (
		var a, r, l, d, c, h, u = 0, p = 0, m = e.target;
		m;

	) {
		if (
			1 == m.nodeType &&
			m.tagName.toLowerCase() in autoscroll._validNodes
		) {
			var g = domStyle.getComputedStyle(m),
				f =
					g.overflowX.toLowerCase() in
					autoscroll._validOverflow,
				_ =
					g.overflowY.toLowerCase() in
					autoscroll._validOverflow;
			if (f || _) {
				a = domGeo.getContentBox(m, g);
				r = domGeo.position(m, true);
			}
			if (f) {
				l = Math.min(autoscroll.H_TRIGGER_AUTOSCROLL, a.w / 2);
				c = e.pageX - r.x;
				(has("webkit") || has("opera")) &&
					(c += _baseWindow.body().scrollLeft);
				u = 0;
				if (c > 0 && c < a.w) {
					c < l ? (u = -l) : c > a.w - l && (u = l);
					m.scrollLeft;
					m.scrollLeft = m.scrollLeft + u;
				}
			}
			if (_) {
				d = Math.min(autoscroll.V_TRIGGER_AUTOSCROLL, a.h / 2);
				h = e.pageY - r.y;
				(has("webkit") || has("opera")) &&
					(h += _baseWindow.body().scrollTop);
				p = 0;
				if (h > 0 && h < a.h) {
					h < d ? (p = -d) : h > a.h - d && (p = d);
					m.scrollTop;
					m.scrollTop = m.scrollTop + p;
				}
			}
			if (u || p) return;
		}
		try {
			m = m.parentNode;
		} catch (v) {
			m = null;
		}
	}
	autoscroll.autoScroll(e);
};

declare global {
	namespace DojoJS {
		interface DojoDND {
			autoscroll: typeof autoscroll;
		}
		interface Dojo {
			dnd: DojoDND;
		}
	}
}

export = autoscroll;