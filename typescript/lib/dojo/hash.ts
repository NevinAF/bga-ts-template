// @ts-nocheck

import dojo = require("./_base/kernel");
import t = require("require");
import i = require("./_base/config");
import n = require("./aspect");
import o = require("./_base/lang");
import a = require("./topic");
import s = require("./domReady");
import r = require("./sniff");

dojo.hash = function (e, t) {
	if (!arguments.length) return p();
	"#" == e.charAt(0) && (e = e.substring(1));
	t ? f(e) : (location.hash = "#" + e);
	return e;
};
var l,
	d,
	c,
	h = i.hashPollFrequency || 100;
function u(e, t) {
	var i = e.indexOf(t);
	return i >= 0 ? e.substring(i + 1) : "";
}
function p() {
	return u(location.href, "#");
}
function m() {
	a.publish("/dojo/hashchange", p());
}
function g() {
	if (p() !== l) {
		l = p();
		m();
	}
}
function f(e) {
	if (d) {
		if (d.isTransitioning()) {
			setTimeout(o.hitch(null, f, e), h);
			return;
		}
		var t = (i = d.iframe.location.href).indexOf("?");
		d.iframe.location.replace(i.substring(0, t) + "?" + e);
	} else {
		var i = location.href.replace(/#.*/, "");
		location.replace(i + "#" + e);
		!c && g();
	}
}
function _() {
	var n = document.createElement("iframe"),
		a = "dojo-hash-iframe",
		s =
			i.dojoBlankHtmlUrl ||
			t.toUrl("./resources/blank.html");
	i.useXDomain && i.dojoBlankHtmlUrl;
	n.id = a;
	n.src = s + "?" + p();
	n.style.display = "none";
	document.body.appendChild(n);
	this.iframe = dojo.global[a];
	var r,
		d,
		c,
		g,
		f,
		_ = this.iframe.location;
	function v() {
		l = p();
		r = f ? l : u(_.href, "?");
		d = false;
		c = null;
	}
	this.isTransitioning = function () {
		return d;
	};
	this.pollLocation = function () {
		if (!f)
			try {
				var e = u(_.href, "?");
				document.title != g &&
					(g = this.iframe.document.title =
						document.title);
			} catch (i) {
				f = true;
				console.error(
					"dojo/hash: Error adding history entry. Server unreachable."
				);
			}
		var t = p();
		if (d && l === t) {
			if (!f && e !== c) {
				setTimeout(o.hitch(this, this.pollLocation), 0);
				return;
			}
			v();
			m();
		} else if (l !== t || (!f && r !== e)) {
			if (l !== t) {
				l = t;
				d = true;
				c = t;
				n.src = s + "?" + c;
				f = false;
				setTimeout(o.hitch(this, this.pollLocation), 0);
				return;
			}
			if (!f) {
				location.href = "#" + _.search.substring(1);
				v();
				m();
			}
		} else;
		setTimeout(o.hitch(this, this.pollLocation), h);
	};
	v();
	setTimeout(o.hitch(this, this.pollLocation), h);
}
s(function () {
	if (
		"onhashchange" in dojo.global &&
		(!r("ie") ||
			(r("ie") >= 8 &&
				"BackCompat" != document.compatMode))
	)
		c = n.after(dojo.global, "onhashchange", m, true);
	else if (document.addEventListener) {
		l = p();
		setInterval(g, h);
	} else document.attachEvent && (d = new _());
});

declare global {
	namespace DojoJS {
		interface Dojo {
			hash: (hash?: string, replace?: boolean) => string;
		}
	}
}

export = dojo.hash;