// @ts-nocheck

import e = require("dojo/_base/lang");
import t = require("dojo/_base/array");
import i = require("dojox/string/tokenize");
import n = require("dojox/string/sprintf");
import o = require("../filter/htmlstrings");
import a = require("../_base");

var filter = e.getObject("filter.strings", true, a);
e.mixin(filter, {
	_urlquote: function (e, t) {
		t || (t = "/");
		return i(e, /([^\w-_.])/g, function (e) {
			if (-1 == t.indexOf(e)) {
				if (" " == e) return "+";
				for (
					var i = e
						.charCodeAt(0)
						.toString(16)
						.toUpperCase();
					i.length < 2;

				)
					i = "0" + i;
				return "%" + i;
			}
			return e;
		}).join("");
	},
	addslashes: function (e) {
		return e
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"')
			.replace(/'/g, "\\'");
	},
	capfirst: function (e) {
		return (
			(e = "" + e).charAt(0).toUpperCase() +
			e.substring(1)
		);
	},
	center: function (e, t) {
		var i = (t = t || e.length) - (e += "").length;
		if (i % 2) {
			e += " ";
			i -= 1;
		}
		for (var n = 0; n < i; n += 2) e = " " + e + " ";
		return e;
	},
	cut: function (e, t) {
		t = t + "" || "";
		return (e += "").replace(new RegExp(t, "g"), "");
	},
	_fix_ampersands: /&(?!(\w+|#\d+);)/g,
	fix_ampersands: function (e) {
		return e.replace(filter._fix_ampersands, "&amp;");
	},
	floatformat: function (e, t) {
		t = parseInt(t || -1, 10);
		if (!((e = parseFloat(e)) - e.toFixed(0)) && t < 0)
			return e.toFixed();
		e = e.toFixed(Math.abs(t));
		return t < 0 ? parseFloat(e) + "" : e;
	},
	iriencode: function (e) {
		return filter._urlquote(e, "/#%[]=:;$&()+,!");
	},
	linenumbers: function (e) {
		for (
			var t,
				i = dojox.dtl.filter,
				n = e.split("\n"),
				o = [],
				a = (n.length + "").length,
				s = 0;
			s < n.length;
			s++
		) {
			t = n[s];
			o.push(
				i.strings.ljust(s + 1, a) +
					". " +
					dojox.dtl._base.escape(t)
			);
		}
		return o.join("\n");
	},
	ljust: function (e, t) {
		e += "";
		t = parseInt(t, 10);
		for (; e.length < t; ) e += " ";
		return e;
	},
	lower: function (e) {
		return (e + "").toLowerCase();
	},
	make_list: function (e) {
		var t = [];
		"number" == typeof e && (e += "");
		if (e.charAt) {
			for (var i = 0; i < e.length; i++)
				t.push(e.charAt(i));
			return t;
		}
		if ("object" == typeof e) {
			for (var n in e) t.push(e[n]);
			return t;
		}
		return [];
	},
	rjust: function (e, t) {
		e += "";
		t = parseInt(t, 10);
		for (; e.length < t; ) e = " " + e;
		return e;
	},
	slugify: function (e) {
		return (e = e
			.replace(/[^\w\s-]/g, "")
			.toLowerCase()).replace(/[\-\s]+/g, "-");
	},
	_strings: {},
	stringformat: function (e, t) {
		t = "" + t;
		var i = filter._strings;
		i[t] || (i[t] = new n.Formatter("%" + t));
		return i[t].format(e);
	},
	title: function (e) {
		for (var t, i, n = "", o = 0; o < e.length; o++) {
			i = e.charAt(o);
			n +=
				" " != t && "\n" != t && "\t" != t && t
					? i.toLowerCase()
					: i.toUpperCase();
			t = i;
		}
		return n;
	},
	_truncatewords: /[ \n\r\t]/,
	truncatewords: function (e, t) {
		if (!(t = parseInt(t, 10))) return e;
		for (
			var i, n, o = 0, a = e.length, r = 0;
			o < e.length;
			o++
		) {
			i = e.charAt(o);
			if (filter._truncatewords.test(n)) {
				if (!filter._truncatewords.test(i) && ++r == t)
					return e.substring(0, a + 1) + " ...";
			} else filter._truncatewords.test(i) || (a = o);
			n = i;
		}
		return e;
	},
	_truncate_words: /(&.*?;|<.*?>|(\w[\w\-]*))/g,
	_truncate_tag: /<(\/)?([^ ]+?)(?: (\/)| .*?)?>/,
	_truncate_singlets: {
		br: true,
		col: true,
		link: true,
		base: true,
		img: true,
		param: true,
		area: true,
		hr: true,
		input: true,
	},
	truncatewords_html: function (e, n) {
		if ((n = parseInt(n, 10)) <= 0) return "";
		var o = 0,
			a = [],
			r = i(e, filter._truncate_words, function (e, i) {
				if (i) {
					if (++o < n) return i;
					if (o == n) return i + " ...";
				}
				var r = e.match(filter._truncate_tag);
				if (r && !(o >= n)) {
					var l = r[1],
						d = r[2].toLowerCase();
					r[3];
					if (l || filter._truncate_singlets[d]);
					else if (l) {
						var c = t.indexOf(a, d);
						-1 != c && (a = a.slice(c + 1));
					} else a.unshift(d);
					return e;
				}
			}).join("");
		r = r.replace(/\s+$/g, "");
		for (var l, d = 0; (l = a[d]); d++) r += "</" + l + ">";
		return r;
	},
	upper: function (e) {
		return e.toUpperCase();
	},
	urlencode: function (e) {
		return filter._urlquote(e);
	},
	_urlize: /^((?:[(>]|&lt;)*)(.*?)((?:[.,)>\n]|&gt;)*)$/,
	_urlize2: /^\S+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+$/,
	urlize: function (e) {
		return filter.urlizetrunc(e);
	},
	urlizetrunc: function (e, t) {
		t = parseInt(t);
		return i(e, /(\S+)/g, function (e) {
			var i = filter._urlize.exec(e);
			if (!i) return e;
			i[1];
			var n = i[2],
				o = (i[3], 0 == n.indexOf("www.")),
				a = -1 != n.indexOf("@"),
				r = -1 != n.indexOf(":"),
				l = 0 == n.indexOf("http://"),
				d = 0 == n.indexOf("https://"),
				c = /[a-zA-Z0-9]/.test(n.charAt(0)),
				h = n.substring(n.length - 4),
				u = n;
			t > 3 && (u = u.substring(0, t - 3) + "...");
			return o ||
				(!a &&
					!l &&
					n.length &&
					c &&
					(".org" == h || ".net" == h || ".com" == h))
				? '<a href="http://' +
						n +
						'" rel="nofollow">' +
						u +
						"</a>"
				: l || d
				? '<a href="' +
					n +
					'" rel="nofollow">' +
					u +
					"</a>"
				: a && !o && !r && filter._urlize2.test(n)
				? '<a href="mailto:' + n + '">' + n + "</a>"
				: e;
		}).join("");
	},
	wordcount: function (t) {
		return (t = e.trim(t)) ? t.split(/\s+/g).length : 0;
	},
	wordwrap: function (e, t) {
		t = parseInt(t);
		var i = [],
			n = e.split(/\s+/g);
		if (n.length) {
			var o = n.shift();
			i.push(o);
			for (
				var a = o.length - o.lastIndexOf("\n") - 1,
					s = 0;
				s < n.length;
				s++
			) {
				if (-1 != (o = n[s]).indexOf("\n"))
					var r = o.split(/\n/g);
				else r = [o];
				a += r[0].length + 1;
				if (t && a > t) {
					i.push("\n");
					a = r[r.length - 1].length;
				} else {
					i.push(" ");
					r.length > 1 &&
						(a = r[r.length - 1].length);
				}
				i.push(o);
			}
		}
		return i.join("");
	},
});

declare global {
	namespace DojoJS
	{
		interface Dojox_DTL_Filter {
			strings: {
				_urlquote: (e: string, t?: string) => string;
				addslashes: (e: string) => string;
				capfirst: (e: string) => string;
				center: (e: string, t?: number) => string;
				cut: (e: string, t: string) => string;
				fix_ampersands: (e: string) => string;
				floatformat: (e: string, t: number) => string;
				iriencode: (e: string) => string;
				linenumbers: (e: string) => string;
				ljust: (e: string, t: number) => string;
				lower: (e: string) => string;
				make_list: (e: any) => any[];
				rjust: (e: string, t: number) => string;
				slugify: (e: string) => string;
				stringformat: (e: string, t: string) => string;
				title: (e: string) => string;
				truncatewords: (e: string, t: number) => string;
				truncatewords_html: (e: string, t: number) => string;
				upper: (e: string) => string;
				urlencode: (e: string) => string;
				urlize: (e: string) => string;
				urlizetrunc: (e: string, t: number) => string;
				wordcount: (t: string) => number;
				wordwrap: (e: string, t: number) => string;
				_strings: any;
			};
		}

		interface Dojox_DTL {
			filter: Dojox_DTL_Filter;
		}
	}
}

export = filter;