// @ts-nocheck

import dojo = require("./_base/kernel");
import _require = require("require");
import has = require("./has");
import request = require("./request");

var o;
o = function (e, t, i) {
	request(e, {
		sync: !!t,
		headers: { "X-Requested-With": null },
	}).then(i);
};
var a = {},
	s = function (e) {
		if (e) {
			var t = (e = e.replace(
				/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
				""
			)).match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
			t && (e = t[1]);
		} else e = "";
		return e;
	},
	r = {},
	l = {};
dojo.cache = function (e, i, n) {
	var r;
	if ("string" == typeof e)
		if (/\//.test(e)) {
			r = e;
			n = i;
		} else
			r = _require.toUrl(
				e.replace(/\./g, "/") + (i ? "/" + i : "")
			);
	else {
		r = e + "";
		n = i;
	}
	var l = null != n && "string" != typeof n ? n.value : n,
		d = n && n.sanitize;
	if ("string" == typeof l) {
		a[r] = l;
		return d ? s(l) : l;
	}
	if (null === l) {
		delete a[r];
		return null;
	}
	r in a ||
		o(r, true, function (e) {
			a[r] = e;
		});
	return d ? s(a[r]) : a[r];
};
export = {
	/**
	 * the dojo/text caches it's own resources because of dojo.cache
	 */
	dynamic: true,
	normalize: function (e, t) {
		var i = e.split("!"),
			n = i[0];
		return (
			(/^\./.test(n) ? t(n) : n) +
			(i[1] ? "!" + i[1] : "")
		);
	},
	load: function (e, t, i) {
		var n = e.split("!"),
			d = n.length > 1,
			c = n[0],
			h = t.toUrl(n[0]),
			u = "url:" + h,
			p = r,
			m = function (e) {
				i(d ? s(e) : e);
			};
		c in a
			? (p = a[c])
			: t.cache && u in t.cache
			? (p = t.cache[u])
			: h in a && (p = a[h]);
		if (p === r)
			if (l[h]) l[h].push(m);
			else {
				var g = (l[h] = [m]);
				o(h, !t.async, function (e) {
					a[c] = a[h] = e;
					for (var t = 0; t < g.length; ) g[t++](e);
					delete l[h];
				});
			}
		else m(p);
	},
};

declare global {
	namespace DojoJS
	{
		interface Dojo {
			/**
			 * A getter and setter for storing the string content associated with the
			 * module and url arguments.
			 */
			cache: (module: string | Record<string, any>, url: string, value?: string | { value: string, sanitize?: boolean }) => string;
		}
	}
}