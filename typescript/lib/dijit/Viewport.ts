// @ts-nocheck

import Evented = require("dojo/Evented");
import t = require("dojo/on");
import i = require("dojo/domReady");
import has = require("dojo/sniff");
import o = require("dojo/window");

var a,
	s = new Evented() as Evented & {
		_rlh: any;
		getEffectiveBox: (e: any) => any;
	};
i(function () {
	var e = o.getBox();
	s._rlh = t(window, "resize", function () {
		var t = o.getBox();
		if (e.h != t.h || e.w != t.w) {
			e = t;
			s.emit("resize");
		}
	});
	if (8 == has("ie")) {
		var i = screen.deviceXDPI;
		setInterval(function () {
			if (screen.deviceXDPI != i) {
				i = screen.deviceXDPI;
				s.emit("resize");
			}
		}, 500);
	}
	if (has("ios")) {
		t(document, "focusin", function (e) {
			a = e.target;
		});
		t(document, "focusout", function (e) {
			a = null;
		});
	}
});
s.getEffectiveBox = function (e) {
	var t = o.getBox(e),
		i = a && a.tagName && a.tagName.toLowerCase();
	if (
		has("ios") &&
		a &&
		!a.readOnly &&
		("textarea" == i ||
			("input" == i &&
				/^(color|email|number|password|search|tel|text|url)$/.test(
					a.type
				)))
	) {
		t.h *=
			0 == orientation || 180 == orientation ? 0.66 : 0.4;
		var s = a.getBoundingClientRect();
		t.h = Math.max(t.h, s.top + s.height);
	}
	return t;
};

declare global {
	namespace DojoJS
	{
	}
}

export = s;