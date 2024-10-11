// @ts-nocheck

import e = require("../errors/RequestError");
import t = require("./watch");
import n = require("./handlers");
import r = require("./util");
import o = require("../has");

o.add("native-xhr", function () {
	return "undefined" != typeof XMLHttpRequest;
});
o.add("dojo-force-activex-xhr", function () {
	return o("activex") && "file:" === window.location.protocol;
});
o.add("native-xhr2", function () {
	if (o("native-xhr") && !o("dojo-force-activex-xhr")) {
		var e = new XMLHttpRequest();
		return (
			undefined !== e.addEventListener &&
			("undefined" == typeof opera || undefined !== e.upload)
		);
	}
});
o.add("native-formdata", function () {
	return "undefined" != typeof FormData;
});
o.add("native-blob", function () {
	return "undefined" != typeof Blob;
});
o.add("native-arraybuffer", function () {
	return "undefined" != typeof ArrayBuffer;
});
o.add("native-response-type", function () {
	return (
		o("native-xhr") &&
		undefined !== new XMLHttpRequest().responseType
	);
});
o.add("native-xhr2-blob", function () {
	if (o("native-response-type")) {
		var e = new XMLHttpRequest();
		e.open("GET", "https://dojotoolkit.org/", true);
		e.responseType = "blob";
		var t = e.responseType;
		e.abort();
		return "blob" === t;
	}
});
var i,
	a,
	s,
	u,
	c = {
		blob: o("native-xhr2-blob") ? "blob" : "arraybuffer",
		document: "document",
		arraybuffer: "arraybuffer",
	};
function l(t, o) {
	var i,
		a = t.xhr;
	t.status = t.xhr.status;
	try {
		t.text = a.responseText;
	} catch (s) {}
	"xml" === t.options.handleAs && (t.data = a.responseXML);
	if (o) this.reject(o);
	else {
		try {
			n(t);
		} catch (s) {
			i = s;
		}
		if (r.checkStatus(a.status))
			i ? this.reject(i) : this.resolve(t);
		else if (i) {
			o = new e(
				"Unable to load " +
					t.url +
					" status: " +
					a.status +
					" and an error in handleAs: transformation of response",
				t
			);
			this.reject(o);
		} else {
			o = new e(
				"Unable to load " +
					t.url +
					" status: " +
					a.status,
				t
			);
			this.reject(o);
		}
	}
}
if (o("native-xhr2")) {
	i = function (e) {
		return !this.isFulfilled();
	};
	u = function (e, t) {
		t.xhr.abort();
	};
	s = function (t, n, r, o) {
		function i(e) {
			n.handleResponse(r);
		}
		function a(t) {
			var o = t.target,
				i = new e(
					"Unable to load " +
						r.url +
						" status: " +
						o.status,
					r
				);
			n.handleResponse(r, i);
		}
		function s(e, t) {
			r.transferType = e;
			if (t.lengthComputable) {
				r.loaded = t.loaded;
				r.total = t.total;
				n.progress(r);
			} else if (3 === r.xhr.readyState) {
				r.loaded =
					"loaded" in t ? t.loaded : t.position;
				n.progress(r);
			}
		}
		function u(e) {
			return s("download", e);
		}
		function c(e) {
			return s("upload", e);
		}
		t.addEventListener("load", i, false);
		t.addEventListener("error", a, false);
		t.addEventListener("progress", u, false);
		o &&
			t.upload &&
			t.upload.addEventListener("progress", c, false);
		return function () {
			t.removeEventListener("load", i, false);
			t.removeEventListener("error", a, false);
			t.removeEventListener("progress", u, false);
			t.upload.removeEventListener("progress", c, false);
			t = null;
		};
	};
} else {
	i = function (e) {
		return e.xhr.readyState;
	};
	a = function (e) {
		return 4 === e.xhr.readyState;
	};
	u = function (e, t) {
		var n = t.xhr,
			r = typeof n.abort;
		("function" !== r &&
			"object" !== r &&
			"unknown" !== r) ||
			n.abort();
	};
}
function f(e) {
	return this.xhr.getResponseHeader(e);
}
var d,
	p = { data: null, query: null, sync: false, method: "GET" };

var h: Xhr = function(n, g, m) {
	var v =
			o("native-formdata") &&
			g &&
			g.data &&
			g.data instanceof FormData,
		y = r.parseArgs(n, r.deepCreate(p, g), v);
	n = y.url;
	var b =
		!(g = y.options).data &&
		"POST" !== g.method &&
		"PUT" !== g.method;
	o("ie") <= 10 && (n = n.split("#")[0]);
	var x,
		w = r.deferred(y, u, i, a, l, function () {
			x && x();
		}),
		_ = (y.xhr = h._create());
	if (!_) {
		w.cancel(new e("XHR was not created"));
		return m ? w : w.promise;
	}
	y.getHeader = f;
	s && (x = s(_, w, y, g.uploadProgress));
	var j = undefined === g.data ? null : g.data,
		E = !g.sync,
		C = g.method;
	try {
		_.open(C, n, E, g.user || d, g.password || d);
		g.withCredentials &&
			(_.withCredentials = g.withCredentials);
		o("native-response-type") &&
			g.handleAs in c &&
			(_.responseType = c[g.handleAs]);
		var T = g.headers,
			A = !v && !b && "application/x-www-form-urlencoded";
		if (T)
			for (var k in T)
				"content-type" === k.toLowerCase()
					? (A = T[k])
					: T[k] && _.setRequestHeader(k, T[k]);
		A && false !== A && _.setRequestHeader("Content-Type", A);
		(T && "X-Requested-With" in T) ||
			_.setRequestHeader(
				"X-Requested-With",
				"XMLHttpRequest"
			);
		r.notify && r.notify.emit("send", y, w.promise.cancel);
		_.send(j);
	} catch (S) {
		w.reject(S);
	}
	t(w);
	_ = null;
	return m ? w : w.promise;
}
h._create = function () {
	throw new Error("XMLHTTP not available");
};
if (o("native-xhr") && !o("dojo-force-activex-xhr"))
	h._create = function () {
		return new XMLHttpRequest();
	};
else if (o("activex"))
	try {
		new ActiveXObject("Msxml2.XMLHTTP");
		h._create = function () {
			return new ActiveXObject("Msxml2.XMLHTTP");
		};
	} catch (g) {
		try {
			new ActiveXObject("Microsoft.XMLHTTP");
			h._create = function () {
				return new ActiveXObject("Microsoft.XMLHTTP");
			};
		} catch (g) {}
	}
r.addCommonMethods(h);



export = h as DojoJS.request.Xhr;