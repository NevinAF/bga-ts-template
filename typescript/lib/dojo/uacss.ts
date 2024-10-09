// @ts-nocheck

import e = require("./dom-geometry");
import t = require("./_base/lang");
import i = require("./domReady");
import has = require("./sniff");
import o = require("./_base/window");

var a = o.doc.documentElement,
	s = has("ie"),
	r = has("trident"),
	l = has("opera"),
	d = Math.floor,
	c = has("ff"),
	h = e.boxModel.replace(/-/, ""),
	u = {
		dj_quirks: has("quirks"),
		dj_opera: l,
		dj_khtml: has("khtml"),
		dj_webkit: has("webkit"),
		dj_safari: has("safari"),
		dj_chrome: has("chrome"),
		dj_edge: has("edge"),
		dj_gecko: has("mozilla"),
		dj_ios: has("ios"),
		dj_android: has("android"),
	};
if (s) {
	u.dj_ie = true;
	u["dj_ie" + d(s)] = true;
	u.dj_iequirks = has("quirks");
}
if (r) {
	u.dj_trident = true;
	u["dj_trident" + d(r)] = true;
}
c && (u["dj_ff" + d(c)] = true);
u["dj_" + h] = true;
var p = "";
for (var m in u) u[m] && (p += m + " ");
a.className = t.trim(a.className + " " + p);
i(function () {
	if (!e.isBodyLtr()) {
		var i = "dj_rtl dijitRtl " + p.replace(/ /g, "-rtl ");
		a.className = t.trim(
			a.className +
				" " +
				i +
				"dj_rtl dijitRtl " +
				p.replace(/ /g, "-rtl ")
		);
	}
});

export = has;