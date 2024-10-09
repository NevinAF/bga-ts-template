// @ts-nocheck

import e = require("./_base/config");
import t = require("./_base/lang");
import i = require("./sniff");
import n = require("./dom");
import o = require("./dom-construct");
import a = require("./_base/window");
import s = require("require");

var back = {} as DojoJS.Back;
t.setObject("dojo.back", back);
var l = (back.getHash = function () {
		var e = window.location.hash;
		"#" == e.charAt(0) && (e = e.substring(1));
		return i("mozilla") ? e : decodeURIComponent(e);
	}),
	d = (back.setHash = function (e) {
		e || (e = "");
		window.location.hash = encodeURIComponent(e);
		history.length;
	}),
	c =
		"undefined" != typeof window
			? window.location.href
			: "",
	h = "undefined" != typeof window ? l() : "",
	u = null,
	p = null,
	m = null,
	g = null,
	f = [],
	_ = [],
	v = false,
	b = false;
function y() {
	var e = _.pop();
	if (e) {
		var t = _[_.length - 1];
		t || 0 != _.length || (t = u);
		t &&
			(t.kwArgs.back
				? t.kwArgs.back()
				: t.kwArgs.backButton
				? t.kwArgs.backButton()
				: t.kwArgs.handle && t.kwArgs.handle("back"));
		f.push(e);
	}
}
back.goBack = y;
function w() {
	var e = f.pop();
	if (e) {
		e.kwArgs.forward
			? e.kwArgs.forward()
			: e.kwArgs.forwardButton
			? e.kwArgs.forwardButton()
			: e.kwArgs.handle && e.kwArgs.handle("forward");
		_.push(e);
	}
}
back.goForward = w;
function C(e, t, i) {
	return { url: e, kwArgs: t, urlHash: i };
}
function k(e) {
	var t = e.split("?");
	return t.length < 2 ? null : t[1];
}
function x() {
	var t =
		(e.dojoIframeHistoryUrl ||
			s.toUrl("./resources/iframe_history.html")) +
		"?" +
		new Date().getTime();
	v = true;
	g &&
		(i("webkit")
			? (g.location = t)
			: (window.frames[g.name].location = t));
	return t;
}
function T() {
	if (!b) {
		var e = _.length,
			t = l();
		if ((t === h || window.location.href == c) && 1 == e) {
			y();
			return;
		}
		if (f.length > 0 && f[f.length - 1].urlHash === t) {
			w();
			return;
		}
		e >= 2 && _[e - 2] && _[e - 2].urlHash === t && y();
	}
}
back.init = function () {
	if (!n.byId("dj_history")) {
		var t =
			e.dojoIframeHistoryUrl ||
			s.toUrl("./resources/iframe_history.html");
		e.afterOnLoad
			? console.error(
					"dojo/back::init() must be called before the DOM has loaded. Include dojo/back in a build layer."
				)
			: document.write(
					'<iframe style="border:0;width:1px;height:1px;position:absolute;visibility:hidden;bottom:0;right:0;" name="dj_history" id="dj_history" src="' +
						t +
						'"></iframe>'
				);
	}
};
back.setInitialState = function (e) {
	u = C(c, e, h);
};
back.addToHistory = function (t) {
	f = [];
	var n = null,
		s = null;
	if (!g) {
		e.useXDomain && e.dojoIframeHistoryUrl;
		g = window.frames.dj_history;
	}
	m ||
		(m = o.create(
			"a",
			{ style: { display: "none" } },
			a.body()
		));
	if (t.changeUrl) {
		n =
			"" +
			(true !== t.changeUrl
				? t.changeUrl
				: new Date().getTime());
		if (0 == _.length && u.urlHash == n) {
			u = C(s, t, n);
			return;
		}
		if (_.length > 0 && _[_.length - 1].urlHash == n) {
			_[_.length - 1] = C(s, t, n);
			return;
		}
		b = true;
		setTimeout(function () {
			d(n);
			b = false;
		}, 1);
		m.href = n;
		if (i("ie")) {
			s = x();
			var r = t.back || t.backButton || t.handle,
				c = function (e) {
					"" != l() &&
						setTimeout(function () {
							d(n);
						}, 1);
					r.apply(this, [e]);
				};
			t.back
				? (t.back = c)
				: t.backButton
				? (t.backButton = c)
				: t.handle && (t.handle = c);
			var h = t.forward || t.forwardButton || t.handle,
				v = function (e) {
					"" != l() && d(n);
					h && h.apply(this, [e]);
				};
			t.forward
				? (t.forward = v)
				: t.forwardButton
				? (t.forwardButton = v)
				: t.handle && (t.handle = v);
		} else i("ie") || p || (p = setInterval(T, 200));
	} else s = x();
	_.push(C(s, t, n));
};
back._iframeLoaded = function (e, t) {
	var i = k(t.href);
	null != i
		? v
			? (v = false)
			: _.length >= 2 && i == k(_[_.length - 2].url)
			? y()
			: f.length > 0 && i == k(f[f.length - 1].url) && w()
		: 1 == _.length && y();
};

declare global {
	namespace DojoJS
	{
		interface BackArgs {
			back?: (... args: any[]) => void;
			forward?: (... args: any[]) => void;
			changeUrl?: boolean | string;
		}
	
		interface Back {
			getHash(): string;
			setHash(h: string): void;
	
			/**
			 * private method. Do not call this directly.
			 */
			goBack(): void;
	
			/**
			 * private method. Do not call this directly.
			 */
			goForward(): void;
	
			/**
			 * Initializes the undo stack. This must be called from a <script>
			 * block that lives inside the `<body>` tag to prevent bugs on IE.
			 * Only call this method before the page's DOM is finished loading. Otherwise
			 * it will not work. Be careful with xdomain loading or djConfig.debugAtAllCosts scenarios,
			 * in order for this method to work, dojo/back will need to be part of a build layer.
			 */
			init(): void;
	
			/**
			 * Sets the state object and back callback for the very first page
			 * that is loaded.
			 * It is recommended that you call this method as part of an event
			 * listener that is registered via dojo/ready.
			 */
			setInitialState(args: BackArgs): void;
	
			/**
			 * adds a state object (args) to the history list.
			 */
			addToHistory(args: BackArgs): void;
	
			/**
			 * private method. Do not call this directly.
			 */
			_iframeLoaded(evt: Event, ifrLoc: Location): void;
		}
	}
}

export = back;