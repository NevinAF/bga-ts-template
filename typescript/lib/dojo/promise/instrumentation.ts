// @ts-nocheck

import e = require("./tracer");
import t = require("../has");
import n = require("../_base/lang");
import r = require("../_base/array");

t.add(
	"config-useDeferredInstrumentation",
	"report-unhandled-rejections"
);
function o(e, t, n) {
	if (!e || false !== e.log) {
		var r = "";
		e && e.stack && (r += e.stack);
		t &&
			t.stack &&
			(r +=
				"\n    ----------------------------------------\n    rejected" +
				t.stack
					.split("\n")
					.slice(1)
					.join("\n")
					.replace(/^\s+/, " "));
		n &&
			n.stack &&
			(r +=
				"\n    ----------------------------------------\n" +
				n.stack);
		console.error(e, r);
	}
}
function i(e, t, n, r) {
	t || o(e, n, r);
}
var a = [],
	s = false,
	u = 1e3;
function c(e, t, n, o) {
	r.some(a, function (n) {
		if (n.error === e) {
			t && (n.handled = true);
			return true;
		}
	}) ||
		a.push({
			error: e,
			rejection: n,
			handled: t,
			deferred: o,
			timestamp: new Date().getTime(),
		});
	s || (s = setTimeout(l, u));
}
function l() {
	var e = new Date().getTime(),
		t = e - u;
	a = r.filter(a, function (e) {
		if (e.timestamp < t) {
			e.handled || o(e.error, e.rejection, e.deferred);
			return false;
		}
		return true;
	});
	s = !!a.length && setTimeout(l, a[0].timestamp + u - e);
}
function instrumentation(deferred: typeof import("../Deferred")) {
	var o = t("config-useDeferredInstrumentation");
	if (o) {
		e.on("resolved", n.hitch(console, "log", "resolved"));
		e.on("rejected", n.hitch(console, "log", "rejected"));
		e.on("progress", n.hitch(console, "log", "progress"));
		var a = [];
		if ("string" == typeof o) {
			a = o.split(",");
			o = a.shift();
		}
		if ("report-rejections" === o) deferred.instrumentRejected = i;
		else {
			if (
				"report-unhandled-rejections" !== o &&
				true !== o &&
				1 !== o
			)
				throw new Error(
					"Unsupported instrumentation usage <" +
						o +
						">"
				);
			deferred.instrumentRejected = c;
			u = parseInt(a[0], 10) || u;
		}
	}
};

declare global {
	namespace DojoJS
	{
	}
}

export = instrumentation;