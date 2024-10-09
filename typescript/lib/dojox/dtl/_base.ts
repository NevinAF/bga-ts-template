// @ts-nocheck

import e = require("dojo/_base/kernel");
import lang = require("dojo/_base/lang");
import n = require("dojox/string/tokenize");
import o = require("dojo/_base/json");
import a = require("dojo/dom");
import s = require("dojo/_base/xhr");
import r = require("dojox/string/Builder");
import l = require("dojo/_base/Deferred");

e.experimental("dojox.dtl");
var dtl = lang.getObject("dojox.dtl", true);
dtl._base = {};
dtl.TOKEN_BLOCK = -1;
dtl.TOKEN_VAR = -2;
dtl.TOKEN_COMMENT = -3;
dtl.TOKEN_TEXT = 3;
dtl._Context = lang.extend(
	function (e) {
		if (e) {
			lang._mixin(this, e);
			if (e.get) {
				this._getter = e.get;
				delete this.get;
			}
		}
	},
	{
		push: function () {
			var e = this,
				i = lang.delegate(this);
			i.pop = function () {
				return e;
			};
			return i;
		},
		pop: function () {
			throw new Error("pop() called on empty Context");
		},
		get: function (e, t) {
			var i = this._normalize;
			if (this._getter) {
				var n = this._getter(e);
				if (undefined !== n) return i(n);
			}
			return undefined !== this[e] ? i(this[e]) : t;
		},
		_normalize: function (e) {
			if (e instanceof Date) {
				e.year = e.getFullYear();
				e.month = e.getMonth() + 1;
				e.day = e.getDate();
				e.date =
					e.year +
					"-" +
					("0" + e.month).slice(-2) +
					"-" +
					("0" + e.day).slice(-2);
				e.hour = e.getHours();
				e.minute = e.getMinutes();
				e.second = e.getSeconds();
				e.microsecond = e.getMilliseconds();
			}
			return e;
		},
		update: function (e) {
			var i = this.push();
			e && lang._mixin(this, e);
			return i;
		},
	}
);
var c =
		/("(?:[^"\\]*(?:\\.[^"\\]*)*)"|'(?:[^'\\]*(?:\\.[^'\\]*)*)'|[^\s]+)/g,
	h = /\s+/g,
	u = function (e, t) {
		(e = e || h) instanceof RegExp ||
			(e = new RegExp(e, "g"));
		if (!e.global)
			throw new Error(
				"You must use a globally flagged RegExp with split " +
					e
			);
		e.exec("");
		for (
			var i, n = [], o = 0, a = 0;
			(i = e.exec(this));

		) {
			n.push(this.slice(o, e.lastIndex - i[0].length));
			o = e.lastIndex;
			if (t && ++a > t - 1) break;
		}
		n.push(this.slice(o));
		return n;
	};
dtl.Token = function (e, i) {
	this.token_type = e;
	this.contents = new String(lang.trim(i));
	this.contents.split = u;
	this.split = function () {
		return String.prototype.split.apply(
			this.contents,
			arguments
		);
	};
};
dtl.Token.prototype.split_contents = function (e) {
	var t,
		i = [],
		n = 0;
	e = e || 999;
	for (; n++ < e && (t = c.exec(this.contents)); )
		'"' == (t = t[0]).charAt(0) && '"' == t.slice(-1)
			? i.push(
					'"' +
						t
							.slice(1, -1)
							.replace('\\"', '"')
							.replace("\\\\", "\\") +
						'"'
				)
			: "'" == t.charAt(0) && "'" == t.slice(-1)
			? i.push(
					"'" +
						t
							.slice(1, -1)
							.replace("\\'", "'")
							.replace("\\\\", "\\") +
						"'"
				)
			: i.push(t);
	return i;
};
var p = (dtl.text = {
	_get: function (e, i, n) {
		var o = dtl.register.get(e, i.toLowerCase(), n);
		if (!o) {
			if (!n) throw new Error("No tag found for " + i);
			return null;
		}
		var a,
			s = o[1],
			r = o[2];
		if (-1 != s.indexOf(":")) {
			a = s.split(":");
			s = a.pop();
		}
		var l = r;
		/\./.test(r) && (r = r.replace(/\./g, "/"));
		require([r], function () {});
		var c = lang.getObject(l);
		return c[s || i] || c[i + "_"] || c[s + "_"];
	},
	getTag: function (e, t) {
		return p._get("tag", e, t);
	},
	getFilter: function (e, t) {
		return p._get("filter", e, t);
	},
	getTemplate: function (e) {
		return new dtl.Template(p.getTemplateString(e));
	},
	getTemplateString: function (e) {
		return s._getText(e.toString()) || "";
	},
	_resolveLazy: function (e, t, i) {
		return t
			? i
				? i.fromJson(s._getText(e)) || {}
				: dtl.text.getTemplateString(e)
			: s.get({ handleAs: i ? "json" : "text", url: e });
	},
	_resolveTemplateArg: function (e, t) {
		if (p._isTemplate(e)) {
			if (!t) {
				var i = new l();
				i.callback(e);
				return i;
			}
			return e;
		}
		return p._resolveLazy(e, t);
	},
	_isTemplate: function (e) {
		return (
			undefined === e ||
			("string" == typeof e &&
				(e.match(/^\s*[<{]/) || -1 != e.indexOf(" ")))
		);
	},
	_resolveContextArg: function (e, t) {
		if (e.constructor == Object) {
			if (!t) {
				var i = new l();
				i.callback(e);
				return i;
			}
			return e;
		}
		return p._resolveLazy(e, t, true);
	},
	_re: /(?:\{\{\s*(.+?)\s*\}\}|\{%\s*(load\s*)?(.+?)\s*%\})/g,
	tokenize: function (e) {
		return n(e, p._re, p._parseDelims);
	},
	_parseDelims: function (e, i, n) {
		if (e) return [dtl.TOKEN_VAR, e];
		if (!i) return [dtl.TOKEN_BLOCK, n];
		for (
			var o, a = lang.trim(n).split(/\s+/g), s = 0;
			(o = a[s]);
			s++
		) {
			/\./.test(o) && (o = o.replace(/\./g, "/"));
			require([o]);
		}
	},
});
dtl.Template = lang.extend(
	function (e, t) {
		var i = t ? e : p._resolveTemplateArg(e, true) || "",
			n = p.tokenize(i),
			o = new dtl._Parser(n);
		this.nodelist = o.parse();
	},
	{
		update: function (e, t) {
			return p
				._resolveContextArg(t)
				.addCallback(this, function (t) {
					var i = this.render(new dtl._Context(t));
					e.forEach
						? e.forEach(function (e) {
								e.innerHTML = i;
							})
						: (a.byId(e).innerHTML = i);
					return this;
				});
		},
		render: function (e, t) {
			t = t || this.getBuffer();
			e = e || new dtl._Context({});
			return this.nodelist.render(e, t) + "";
		},
		getBuffer: function () {
			return new r();
		},
	}
);
var m = /\{\{\s*(.+?)\s*\}\}/g;
dtl.quickFilter = function (e) {
	return e
		? -1 == e.indexOf("{%")
			? new dtl._QuickNodeList(
					n(e, m, function (e) {
						return new dtl._Filter(e);
					})
				)
			: undefined
		: new dtl._NodeList();
};
dtl._QuickNodeList = lang.extend(
	function (e) {
		this.contents = e;
	},
	{
		render: function (e, t) {
			for (
				var i = 0, n = this.contents.length;
				i < n;
				i++
			)
				t = this.contents[i].resolve
					? t.concat(this.contents[i].resolve(e))
					: t.concat(this.contents[i]);
			return t;
		},
		dummyRender: function (e) {
			return this.render(
				e,
				dtl.Template.prototype.getBuffer()
			).toString();
		},
		clone: function (e) {
			return this;
		},
	}
);
dtl._Filter = lang.extend(
	function (e) {
		if (!e)
			throw new Error(
				"Filter must be called with variable name"
			);
		this.contents = e;
		var t = this._cache[e];
		if (t) {
			this.key = t[0];
			this.filters = t[1];
		} else {
			this.filters = [];
			n(e, this._re, this._tokenize, this);
			this._cache[e] = [this.key, this.filters];
		}
	},
	{
		_cache: {},
		_re: /(?:^_\("([^\\"]*(?:\\.[^\\"])*)"\)|^"([^\\"]*(?:\\.[^\\"]*)*)"|^([a-zA-Z0-9_.]+)|\|(\w+)(?::(?:_\("([^\\"]*(?:\\.[^\\"])*)"\)|"([^\\"]*(?:\\.[^\\"]*)*)"|([a-zA-Z0-9_.]+)|'([^\\']*(?:\\.[^\\']*)*)'))?|^'([^\\']*(?:\\.[^\\']*)*)')/g,
		_values: { 0: '"', 1: '"', 2: "", 8: '"' },
		_args: { 4: '"', 5: '"', 6: "", 7: "'" },
		_tokenize: function () {
			for (
				var e, i, n = 0, o = [];
				n < arguments.length;
				n++
			)
				o[n] =
					undefined !== arguments[n] &&
					"string" == typeof arguments[n] &&
					arguments[n];
			if (this.key) {
				for (e in this._args)
					if (o[e]) {
						var a = arguments[e];
						"'" == this._args[e]
							? (a = a.replace(/\\'/g, "'"))
							: '"' == this._args[e] &&
								(a = a.replace(/\\"/g, '"'));
						i = [!this._args[e], a];
						break;
					}
				var s = p.getFilter(arguments[3]);
				if (!lang.isFunction(s))
					throw new Error(
						arguments[3] +
							" is not registered as a filter"
					);
				this.filters.push([s, i]);
			} else
				for (e in this._values)
					if (o[e]) {
						this.key =
							this._values[e] +
							arguments[e] +
							this._values[e];
						break;
					}
		},
		getExpression: function () {
			return this.contents;
		},
		resolve: function (e) {
			if (undefined === this.key) return "";
			for (
				var t, i = this.resolvePath(this.key, e), n = 0;
				(t = this.filters[n]);
				n++
			)
				i = t[1]
					? t[1][0]
						? t[0](i, this.resolvePath(t[1][1], e))
						: t[0](i, t[1][1])
					: t[0](i);
			return i;
		},
		resolvePath: function (e, i) {
			var n,
				o,
				a = e.charAt(0),
				s = e.slice(-1);
			if (isNaN(parseInt(a)))
				if ('"' == a && a == s) n = e.slice(1, -1);
				else {
					if ("true" == e) return true;
					if ("false" == e) return false;
					if ("null" == e || "None" == e) return null;
					o = e.split(".");
					n = i.get(o[0]);
					if (lang.isFunction(n)) {
						var r = i.getThis && i.getThis();
						n = n.alters_data
							? ""
							: r
							? n.call(r)
							: "";
					}
					for (var l = 1; l < o.length; l++) {
						var c = o[l];
						if (!n) return "";
						var h = n;
						if (
							lang.isObject(n) &&
							"items" == c &&
							undefined === n[c]
						) {
							var u = [];
							for (var p in n) u.push([p, n[p]]);
							n = u;
						} else {
							if (
								n.get &&
								lang.isFunction(n.get) &&
								n.get.safe
							)
								n = n.get(c);
							else {
								if (undefined === n[c]) {
									n = n[c];
									break;
								}
								n = n[c];
							}
							lang.isFunction(n)
								? (n = n.alters_data
										? ""
										: n.call(h))
								: n instanceof Date &&
									(n =
										dtl._Context.prototype._normalize(
											n
										));
						}
					}
				}
			else
				n =
					-1 == e.indexOf(".")
						? parseInt(e)
						: parseFloat(e);
			return n;
		},
	}
);
dtl._TextNode = dtl._Node = lang.extend(
	function (e) {
		this.contents = e;
	},
	{
		set: function (e) {
			this.contents = e;
			return this;
		},
		render: function (e, t) {
			return t.concat(this.contents);
		},
		isEmpty: function () {
			return !lang.trim(this.contents);
		},
		clone: function () {
			return this;
		},
	}
);
dtl._NodeList = lang.extend(
	function (e) {
		this.contents = e || [];
		this.last = "";
	},
	{
		push: function (e) {
			this.contents.push(e);
			return this;
		},
		concat: function (e) {
			this.contents = this.contents.concat(e);
			return this;
		},
		render: function (e, t) {
			for (var i = 0; i < this.contents.length; i++)
				if (!(t = this.contents[i].render(e, t)))
					throw new Error(
						"Template must return buffer"
					);
			return t;
		},
		dummyRender: function (e) {
			return this.render(
				e,
				dtl.Template.prototype.getBuffer()
			).toString();
		},
		unrender: function () {
			return arguments[1];
		},
		clone: function () {
			return this;
		},
		rtrim: function () {
			for (;;) {
				i = this.contents.length - 1;
				if (
					!(
						this.contents[i] instanceof
							dtl._TextNode &&
						this.contents[i].isEmpty()
					)
				)
					break;
				this.contents.pop();
			}
			return this;
		},
	}
);
dtl._VarNode = lang.extend(
	function (e) {
		this.contents = new dtl._Filter(e);
	},
	{
		render: function (e, t) {
			var i = this.contents.resolve(e);
			null == i && (i = "");
			i.safe || (i = dtl._base.escape("" + i));
			return t.concat(i);
		},
	}
);
dtl._noOpNode = new (function () {
	this.render = this.unrender = function () {
		return arguments[1];
	};
	this.clone = function () {
		return this;
	};
})();
dtl._Parser = lang.extend(
	function (e) {
		this.contents = e;
	},
	{
		i: 0,
		parse: function (e) {
			var t,
				i = {};
			e = e || [];
			for (var n = 0; n < e.length; n++) i[e[n]] = true;
			for (
				var o = new dtl._NodeList();
				this.i < this.contents.length;

			)
				if (
					"string" ==
					typeof (t = this.contents[this.i++])
				)
					o.push(new dtl._TextNode(t));
				else {
					var a = t[0],
						s = t[1];
					if (a == dtl.TOKEN_VAR)
						o.push(new dtl._VarNode(s));
					else if (a == dtl.TOKEN_BLOCK) {
						if (i[s]) {
							--this.i;
							return o;
						}
						var r = s.split(/\s+/g);
						if (r.length) {
							r = r[0];
							var l = p.getTag(r);
							l &&
								o.push(
									l(this, new dtl.Token(a, s))
								);
						}
					}
				}
			if (e.length)
				throw new Error(
					"Could not find closing tag(s): " +
						e.toString()
				);
			this.contents.length = 0;
			return o;
		},
		next_token: function () {
			var e = this.contents[this.i++];
			return new dtl.Token(e[0], e[1]);
		},
		delete_first_token: function () {
			this.i++;
		},
		skip_past: function (e) {
			for (; this.i < this.contents.length; ) {
				var t = this.contents[this.i++];
				if (t[0] == dtl.TOKEN_BLOCK && t[1] == e) return;
			}
			throw new Error(
				"Unclosed tag found when looking for " + e
			);
		},
		create_variable_node: function (e) {
			return new dtl._VarNode(e);
		},
		create_text_node: function (e) {
			return new dtl._TextNode(e || "");
		},
		getTemplate: function (e) {
			return new dtl.Template(e);
		},
	}
);
dtl.register = {
	_registry: { attributes: [], tags: [], filters: [] },
	get: function (e, t) {
		for (
			var i, n = dtl.register._registry[e + "s"], o = 0;
			(i = n[o]);
			o++
		)
			if ("string" == typeof i[0]) {
				if (i[0] == t) return i;
			} else if (t.match(i[0])) return i;
	},
	getAttributeTags: function () {
		for (
			var e,
				i = [],
				n = dtl.register._registry.attributes,
				o = 0;
			(e = n[o]);
			o++
		)
			if (3 == e.length) i.push(e);
			else {
				var a = lang.getObject(e[1]);
				if (a && lang.isFunction(a)) {
					e.push(a);
					i.push(e);
				}
			}
		return i;
	},
	_any: function (e, i, n) {
		for (var o in n)
			for (var a, s = 0; (a = n[o][s]); s++) {
				var r = a;
				if (lang.isArray(a)) {
					r = a[0];
					a = a[1];
				}
				if ("string" == typeof r) {
					if ("attr:" == r.substr(0, 5)) {
						var l = a;
						"attr:" == l.substr(0, 5) &&
							(l = l.slice(5));
						dtl.register._registry.attributes.push([
							l.toLowerCase(),
							i + "." + o + "." + l,
						]);
					}
					r = r.toLowerCase();
				}
				dtl.register._registry[e].push([
					r,
					a,
					i + "." + o,
				]);
			}
	},
	tags: function (e, t) {
		dtl.register._any("tags", e, t);
	},
	filters: function (e, t) {
		dtl.register._any("filters", e, t);
	},
};
var g = /&/g,
	f = /</g,
	_ = />/g,
	v = /'/g,
	b = /"/g;
dtl._base.escape = function (e) {
	return dtl.mark_safe(
		e
			.replace(g, "&amp;")
			.replace(f, "&lt;")
			.replace(_, "&gt;")
			.replace(b, "&quot;")
			.replace(v, "&#39;")
	);
};
dtl._base.safe = function (e) {
	"string" == typeof e && (e = new String(e));
	"object" == typeof e && (e.safe = true);
	return e;
};
dtl.mark_safe = dtl._base.safe;
dtl.register.tags("dojox.dtl.tag", {
	date: ["now"],
	logic: ["if", "for", "ifequal", "ifnotequal"],
	loader: ["extends", "block", "include", "load", "ssi"],
	misc: [
		"comment",
		"debug",
		"filter",
		"firstof",
		"spaceless",
		"templatetag",
		"widthratio",
		"with",
	],
	loop: ["cycle", "ifchanged", "regroup"],
});
dtl.register.filters("dojox.dtl.filter", {
	dates: ["date", "time", "timesince", "timeuntil"],
	htmlstrings: [
		"linebreaks",
		"linebreaksbr",
		"removetags",
		"striptags",
	],
	integers: ["add", "get_digit"],
	lists: [
		"dictsort",
		"dictsortreversed",
		"first",
		"join",
		"length",
		"length_is",
		"random",
		"slice",
		"unordered_list",
	],
	logic: [
		"default",
		"default_if_none",
		"divisibleby",
		"yesno",
	],
	misc: [
		"filesizeformat",
		"pluralize",
		"phone2numeric",
		"pprint",
	],
	strings: [
		"addslashes",
		"capfirst",
		"center",
		"cut",
		"fix_ampersands",
		"floatformat",
		"iriencode",
		"linenumbers",
		"ljust",
		"lower",
		"make_list",
		"rjust",
		"slugify",
		"stringformat",
		"title",
		"truncatewords",
		"truncatewords_html",
		"upper",
		"urlencode",
		"urlize",
		"urlizetrunc",
		"wordcount",
		"wordwrap",
	],
});
dtl.register.filters("dojox.dtl", { _base: ["escape", "safe"] });

declare global {
	namespace DojoJS
	{
		interface Dojox {
			dtl: Dojox_DTL;
		}

		interface Dojox_DTL {
			_base: any;
			TOKEN_BLOCK: -1;
			TOKEN_VAR: -2;
			TOKEN_COMMENT: -3;
			TOKEN_TEXT: 3;
			_Context: Constructor<any>;
			Token: Constructor<any>;
			text: any;
			Template: Constructor<any>;
			quickFilter: (e: string) => any;
			_QuickNodeList: Constructor<any>;
			_Filter: Constructor<any>;
			_NodeList: Constructor<any>;
			_VarNode: Constructor<any>;
			_noOpNode: any;
			_Parser: Constructor<any>;
			register: {
				_registry: {
					attributes: any[];
					tags: any[];
					filters: any[];
				};
				get: (e: string, t: string) => any;
				getAttributeTags: () => any[];
				_any: (e: string, i: string, n: any) => void;
				tags: (e: string, t: any) => void;
				filters: (e: string, t: any) => void;
			};
			escape: (e: string) => any;
			safe: (e: any) => any;
			mark_safe: (e: any) => any;
		}

		var dojox: Dojox;
	}
}

export = dtl;