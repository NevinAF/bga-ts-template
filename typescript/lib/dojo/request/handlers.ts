// @ts-nocheck

import e = require("../json");
import t = require("../_base/kernel");
import n = require("../_base/array");
import r = require("../has");
import "../selector/_loader";

r.add("activex", "undefined" != typeof ActiveXObject);
r.add("dom-parser", function (e) {
	return "DOMParser" in e;
});
var o;
if (r("activex")) {
	var i,
		a = [
			"Msxml2.DOMDocument.6.0",
			"Msxml2.DOMDocument.4.0",
			"MSXML2.DOMDocument.3.0",
			"MSXML.DOMDocument",
		];
	o = function (e) {
		var t = e.data,
			o = e.text;
		t &&
			r("dom-qsa2.1") &&
			!t.querySelectorAll &&
			r("dom-parser") &&
			(t = new DOMParser().parseFromString(
				o,
				"application/xml"
			));
		function s(e) {
			try {
				var n = new ActiveXObject(e);
				n.async = false;
				n.loadXML(o);
				t = n;
				i = e;
			} catch (r) {
				return false;
			}
			return true;
		}
		(t && t.documentElement) || (i && s(i)) || n.some(a, s);
		return t;
	};
}
var s = function (e) {
		return r("native-xhr2-blob") ||
			"blob" !== e.options.handleAs ||
			"undefined" == typeof Blob
			? e.xhr.response
			: new Blob([e.xhr.response], {
					type: e.xhr.getResponseHeader(
						"Content-Type"
					),
				});
	},
	u = {
		javascript: function (e) {
			return t.eval(e.text || "");
		},
		json: function (t) {
			return e.parse(t.text || null);
		},
		xml: o,
		blob: s,
		arraybuffer: s,
		document: s,
	};
function Handlers(e) {
	var t = u[e.options.handleAs];
	e.data = t ? t(e) : e.data || e.text;
	return e;
}
Handlers.register = function (e, t) {
	u[e] = t;
};

export = Handlers as {
	<T>(response: DojoJS.Response<any>): DojoJS.Response<T>;
	register(name: string, handler: (response: DojoJS.Response<any>) => DojoJS.Response<any>): void;
}