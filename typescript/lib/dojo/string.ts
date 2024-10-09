import dojo = require("./_base/kernel");
import lang = require("./_base/lang");

interface DojoString {

	/**
	 * Efficiently escape a string for insertion into HTML (innerHTML or attributes), replacing &, <, >, ", ', and / characters.
	 */
	escape(str: string): string;

	/**
	 * Efficiently replicate a string `n` times.
	 */
	rep(str: string, num: number): string;

	/**
	 * Pad a string to guarantee that it is at least `size` length by
	 * filling with the character `ch` at either the start or end of the
	 * string. Pads at the start, by default.
	 */
	pad(text: string, size: number, ch?: string, end?: boolean): string;

	/**
	 * Performs parameterized substitutions on a string. Throws an
	 * exception if any parameter is unmatched.
	 */
	substitute(template: string, map: Object | any[], transform?: (value: any, key: string) => any, thisObject?: Object): string;

	/**
	 * Trims whitespace from both sides of the string
	 */
	trim(str: string): string;
}

var i = /[&<>'"\/]/g,
	n: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#x27;",
		"/": "&#x2F;",
	},
	string = {} as DojoString;
lang.setObject("dojo.string", string);
string.escape = function (e) {
	return e
		? e.replace(i, function (e) {
				return n[e]!;
			})
		: "";
};
string.rep = function (e, t) {
	if (t <= 0 || !e) return "";
	for (var i = []; ; ) {
		1 & t && i.push(e);
		if (!(t >>= 1)) break;
		e += e;
	}
	return i.join("");
};
string.pad = function (e, t, i, n) {
	i || (i = "0");
	var a = String(e),
		s = string.rep(i, Math.ceil((t - a.length) / i.length));
	return n ? a + s : s + a;
};
string.substitute = function (i, n, o, a) {
	a = a || dojo.global;
	o = o
		? lang.hitch(a, o)
		: function (e) {
				return e;
			};
	return i.replace(
		/\$\{([^\s\:\}]*)(?:\:([^\s\:\}]+))?\}/g,
		function (e, i, s) {
			if ("" == i) return "$";
			var r = lang.getObject(i, false, n);
			s && (r = lang.getObject(s, false, a).call(a, r, i));
			var l = o(r, i);
			if (undefined === l)
				throw new Error(
					'string.substitute could not find key "' +
						i +
						'" in template'
				);
			return l.toString();
		}
	);
};
// @ts-ignore
string.trim = String.prototype.trim
	? lang.trim
	: function (e) {
			for (
				var t = (e = e.replace(/^\s+/, "")).length - 1;
				t >= 0;
				t--
			)
				if (/\S/.test(e.charAt(t))) {
					e = e.substring(0, t + 1);
					break;
				}
			return e;
		};

declare global {
	namespace DojoJS {
		interface Dojo {
			string: typeof string;
		}
	}
}

export = string;