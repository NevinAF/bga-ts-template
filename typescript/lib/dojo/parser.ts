// @ts-nocheck

import _require = require("require");
import dojo = require("./_base/kernel");
import dlang = require("./_base/lang");
import darray = require("./_base/array");
import config = require("./_base/config");
import dom = require("./dom");
import dwindow = require("./_base/window");
import _Url = require("./_base/url");
import aspect = require("./aspect");
import all = require("./promise/all");
import dates = require("./date/stamp");
import Deferred = require("./Deferred");
import has = require("./has");
import query = require("./query");
import don = require("./on");
import ready = require("./ready");

type Promise<T> = typeof import("dojo/promise/Promise")<T>;

new Date("X");
function myEval(text: string) {
	return eval("(" + text + ")");
}
var extendCnt = 0;
aspect.after(
	dlang,
	"extend",
	function () {
		extendCnt++;
	},
	true
);
function getNameMap(e) {
	var t = e._nameCaseMap,
		i = e.prototype;
	if (!t || t._extendCnt < extendCnt) {
		t = e._nameCaseMap = {};
		for (var n in i)
			"_" !== n.charAt(0) && (t[n.toLowerCase()] = n);
		t._extendCnt = extendCnt;
	}
	return t;
}
function getCtor(e, t) {
	t || (t = _require);
	var i = t._dojoParserCtorMap || (t._dojoParserCtorMap = {}),
		n = e.join();
	if (!i[n]) {
		for (var o = [], a = 0, s = e.length; a < s; a++) {
			var r = e[a];
			o[o.length] = i[r] =
				i[r] ||
				dlang.getObject(r) ||
				(~r.indexOf("/") && t(r));
		}
		var l = o.shift();
		i[n] = o.length
			? l.createSubclass
				? l.createSubclass(o)
				: l.extend.apply(l, o)
			: l;
	}
	return i[n];
}
var parser = {
	_clearCache: function () {
		extendCnt++;
		_ctorMap = {};
	},
	_functionFromScript: function (e, t) {
		var i = "",
			n = "",
			o =
				e.getAttribute(t + "args") ||
				e.getAttribute("args"),
			a = e.getAttribute("with"),
			s = (o || "").split(/\s*,\s*/);
		a &&
			a.length &&
			darray.forEach(a.split(/\s*,\s*/), function (e) {
				i += "with(" + e + "){";
				n += "}";
			});
		return new Function(s, i + e.innerHTML + n);
	},
	instantiate: function (e, t, i) {
		t = t || {};
		var n =
				((i = i || {}).scope || dojo._scopeName) +
				"Type",
			o = "data-" + (i.scope || dojo._scopeName) + "-",
			a = o + "type",
			s = o + "mixins",
			r = [];
		darray.forEach(e, function (e) {
			var i =
				n in t
					? t[n]
					: e.getAttribute(a) || e.getAttribute(n);
			if (i) {
				var o = e.getAttribute(s),
					l = o
						? [i].concat(o.split(/\s*,\s*/))
						: [i];
				r.push({ node: e, types: l });
			}
		});
		return this._instantiate(r, t, i);
	},
	_instantiate: function (e, t, i, n) {
		var o = darray.map(
			e,
			function (e) {
				var n =
					e.ctor ||
					getCtor(e.types, i.contextRequire);
				if (!n)
					throw new Error(
						"Unable to resolve constructor for: '" +
							e.types.join() +
							"'"
					);
				return this.construct(
					n,
					e.node,
					t,
					i,
					e.scripts,
					e.inherited
				);
			},
			this
		);
		function a(e) {
			t._started ||
				i.noStart ||
				darray.forEach(e, function (e) {
					"function" != typeof e.startup ||
						e._started ||
						e.startup();
				});
			return e;
		}
		return n ? all(o).then(a) : a(o);
	},
	construct: function (e, t, i, n, o, a) {
		var s,
			r = e && e.prototype,
			l = {};
		(n = n || {}).defaults && dlang.mixin(l, n.defaults);
		a && dlang.mixin(l, a);
		if (has("dom-attributes-explicit")) s = t.attributes;
		else if (has("dom-attributes-specified-flag"))
			s = darray.filter(t.attributes, function (e) {
				return e.specified;
			});
		else {
			var d = (
				/^input$|^img$/i.test(t.nodeName)
					? t
					: t.cloneNode(false)
			).outerHTML
				.replace(/=[^\s"']+|="[^"]*"|='[^']*'/g, "")
				.replace(/^\s*<[a-zA-Z0-9]*\s*/, "")
				.replace(/\s*>.*$/, "");
			s = darray.map(d.split(/\s+/), function (e) {
				var i = e.toLowerCase();
				return {
					name: e,
					value:
						("LI" == t.nodeName && "value" == e) ||
						"enctype" == i
							? t.getAttribute(i)
							: t.getAttributeNode(i).value,
				};
			});
		}
		var c = n.scope || dojo._scopeName,
			h = "data-" + c + "-",
			u = {};
		if ("dojo" !== c) {
			u[h + "props"] = "data-dojo-props";
			u[h + "type"] = "data-dojo-type";
			u[h + "mixins"] = "data-dojo-mixins";
			u[c + "type"] = "dojotype";
			u[h + "id"] = "data-dojo-id";
		}
		for (var p, m, g, f = 0, _ = []; (p = s[f++]); ) {
			var v = p.name,
				b = v.toLowerCase(),
				y = p.value;
			switch (u[b] || b) {
				case "data-dojo-type":
				case "dojotype":
				case "data-dojo-mixins":
					break;
				case "data-dojo-props":
					g = y;
					break;
				case "data-dojo-id":
				case "jsid":
					m = y;
					break;
				case "data-dojo-attach-point":
				case "dojoattachpoint":
					l.dojoAttachPoint = y;
					break;
				case "data-dojo-attach-event":
				case "dojoattachevent":
					l.dojoAttachEvent = y;
					break;
				case "class":
					l.class = t.className;
					break;
				case "style":
					l.style = t.style && t.style.cssText;
					break;
				default:
					if (!(v in r)) {
						v = getNameMap(e)[b] || v;
					}
					if (v in r)
						switch (typeof r[v]) {
							case "string":
								l[v] = y;
								break;
							case "number":
								l[v] = y.length
									? Number(y)
									: NaN;
								break;
							case "boolean":
								l[v] =
									"false" != y.toLowerCase();
								break;
							case "function":
								"" === y ||
								-1 != y.search(/[^\w\.]+/i)
									? (l[v] = new Function(y))
									: (l[v] =
											dlang.getObject(
												y,
												false
											) ||
											new Function(y));
								_.push(v);
								break;
							default:
								var w = r[v];
								l[v] =
									w && "length" in w
										? y
											? y.split(/\s*,\s*/)
											: []
										: w instanceof Date
										? "" == y
											? new Date("")
											: "now" == y
											? new Date()
											: dates.fromISOString(
													y
												)
										: w instanceof _Url
										? dojo.baseUrl + y
										: myEval(y);
						}
					else l[v] = y;
			}
		}
		for (var C = 0; C < _.length; C++) {
			var k = _[C].toLowerCase();
			t.removeAttribute(k);
			t[k] = null;
		}
		if (g)
			try {
				g = myEval.call(n.propsThis, "{" + g + "}");
				dlang.mixin(l, g);
			} catch (O) {
				throw new Error(
					O.toString() +
						" in data-dojo-props='" +
						g +
						"'"
				);
			}
		dlang.mixin(l, i);
		o ||
			(o =
				e && (e._noScript || r._noScript)
					? []
					: query("> script[type^='dojo/']", t));
		var x = [],
			T = [],
			A = [],
			j = [];
		if (o)
			for (f = 0; f < o.length; f++) {
				var S = o[f];
				t.removeChild(S);
				var E =
						S.getAttribute(h + "event") ||
						S.getAttribute("event"),
					N = S.getAttribute(h + "prop"),
					M = S.getAttribute(h + "method"),
					D = S.getAttribute(h + "advice"),
					I = S.getAttribute("type"),
					$ = this._functionFromScript(S, h);
				E
					? "dojo/connect" == I
						? x.push({ method: E, func: $ })
						: "dojo/on" == I
						? j.push({ event: E, func: $ })
						: (l[E] = $)
					: "dojo/aspect" == I
					? x.push({ method: M, advice: D, func: $ })
					: "dojo/watch" == I
					? A.push({ prop: N, func: $ })
					: T.push($);
			}
		var L = e.markupFactory || r.markupFactory,
			P = L ? L(l, t, e) : new e(l, t);
		function R(e) {
			m && dlang.setObject(m, e);
			for (f = 0; f < x.length; f++)
				aspect[x[f].advice || "after"](
					e,
					x[f].method,
					dlang.hitch(e, x[f].func),
					true
				);
			for (f = 0; f < T.length; f++) T[f].call(e);
			for (f = 0; f < A.length; f++)
				e.watch(A[f].prop, A[f].func);
			for (f = 0; f < j.length; f++)
				don(e, j[f].event, j[f].func);
			return e;
		}
		return P.then ? P.then(R) : R(P);
	},
	scan: function (e, t) {
		var i = [],
			n = [],
			o = {},
			a = (t.scope || dojo._scopeName) + "Type",
			s = "data-" + (t.scope || dojo._scopeName) + "-",
			r = s + "type",
			l = s + "textdir",
			d = s + "mixins",
			c = e.firstChild,
			h = t.inherited;
		if (!h) {
			function u(e, t) {
				return (
					(e.getAttribute && e.getAttribute(t)) ||
					(e.parentNode && u(e.parentNode, t))
				);
			}
			h = {
				dir: u(e, "dir"),
				lang: u(e, "lang"),
				textDir: u(e, l),
			};
			for (var p in h) h[p] || delete h[p];
		}
		var m,
			g,
			f = { inherited: h };
		function _(e) {
			if (!e.inherited) {
				e.inherited = {};
				var t = e.node,
					i = _(e.parent),
					n = {
						dir: t.getAttribute("dir") || i.dir,
						lang: t.getAttribute("lang") || i.lang,
						textDir: t.getAttribute(l) || i.textDir,
					};
				for (var o in n)
					n[o] && (e.inherited[o] = n[o]);
			}
			return e.inherited;
		}
		for (;;)
			if (c)
				if (1 == c.nodeType)
					if (
						m &&
						"script" == c.nodeName.toLowerCase()
					) {
						(v = c.getAttribute("type")) &&
							/^dojo\/\w/i.test(v) &&
							m.push(c);
						c = c.nextSibling;
					} else if (g) c = c.nextSibling;
					else {
						var v =
								c.getAttribute(r) ||
								c.getAttribute(a),
							b = c.firstChild;
						if (
							v ||
							(b &&
								(3 != b.nodeType ||
									b.nextSibling))
						) {
							var y,
								w = null;
							if (v) {
								var C = c.getAttribute(d),
									k = C
										? [v].concat(
												C.split(
													/\s*,\s*/
												)
											)
										: [v];
								try {
									w = getCtor(
										k,
										t.contextRequire
									);
								} catch (A) {}
								w ||
									darray.forEach(
										k,
										function (e) {
											if (
												~e.indexOf(
													"/"
												) &&
												!o[e]
											) {
												o[e] = true;
												n[n.length] = e;
											}
										}
									);
								var x =
									w && !w.prototype._noScript
										? []
										: null;
								(y = {
									types: k,
									ctor: w,
									parent: f,
									node: c,
									scripts: x,
								}).inherited = _(y);
								i.push(y);
							} else
								y = {
									node: c,
									scripts: m,
									parent: f,
								};
							m = x;
							g =
								c.stopParser ||
								(w &&
									w.prototype.stopParser &&
									!t.template);
							f = y;
							c = b;
						} else c = c.nextSibling;
					}
				else c = c.nextSibling;
			else {
				if (!f || !f.node) break;
				c = f.node.nextSibling;
				g = false;
				m = (f = f.parent).scripts;
			}
		var T = new Deferred();
		if (n.length) {
			has("dojo-debug-messages") && n.join(", ");
			(t.contextRequire || _require)(n, function () {
				T.resolve(
					darray.filter(i, function (e) {
						if (!e.ctor)
							try {
								e.ctor = getCtor(
									e.types,
									t.contextRequire
								);
							} catch (A) {}
						for (var i = e.parent; i && !i.types; )
							i = i.parent;
						var n = e.ctor && e.ctor.prototype;
						e.instantiateChildren = !(
							n &&
							n.stopParser &&
							!t.template
						);
						e.instantiate =
							!i ||
							(i.instantiate &&
								i.instantiateChildren);
						return e.instantiate;
					})
				);
			});
		} else T.resolve(i);
		return T.promise;
	},
	_require: function (e, t) {
		var i = myEval("{" + e.innerHTML + "}"),
			n = [],
			o = [],
			a = new Deferred(),
			s = (t && t.contextRequire) || _require;
		for (var r in i) {
			n.push(r);
			o.push(i[r]);
		}
		s(o, function () {
			for (var e = 0; e < n.length; e++)
				dlang.setObject(n[e], arguments[e]);
			a.resolve(arguments);
		});
		return a.promise;
	},
	_scanAmd: function (e, t) {
		var i = new Deferred(),
			n = i.promise;
		i.resolve(true);
		var o = this;
		query("script[type='dojo/require']", e).forEach(
			function (e) {
				n = n.then(function () {
					return o._require(e, t);
				});
				e.parentNode.removeChild(e);
			}
		);
		return n;
	},
	parse: function (e, t) {
		e &&
			"string" != typeof e &&
			!("nodeType" in e) &&
			(e = (t = e).rootNode);
		var i = e ? dom.byId(e) : dwindow.body(),
			n = (t = t || {}).template ? { template: true } : {},
			o = [],
			a = this,
			s = this._scanAmd(i, t)
				.then(function () {
					return a.scan(i, t);
				})
				.then(function (e) {
					return a._instantiate(e, n, t, true);
				})
				.then(function (e) {
					return (o = o.concat(e));
				})
				.otherwise(function (e) {
					console.error(
						"dojo/parser::parse() error",
						e
					);
					throw e;
				});
		dlang.mixin(o, s);
		return o;
	},
} as DojoJS.Parser;
dojo.parser = parser;
config.parseOnLoad && ready(100, parser, "parse");

declare global {
	namespace DojoJS
	{
		interface ParserOptions { }

		interface ParserObjects {
			ctor?: Constructor<any>;
			types?: string[];
			node: Node;
			scripts?: HTMLScriptElement[];
			inherited?: { [prop: string]: any; };
		}

		interface InstancesArray extends Array<any>, Promise<any> {}

		interface Parser {
			/**
			 * Clear cached data.   Used mainly for benchmarking.
			 */
			_clearCache(): void;

			/**
			 * Convert a `<script type="dojo/method" args="a, b, c"> ... </script>`
			 * into a function
			 */
			_functionFromScript(node: HTMLScriptElement, attrData: string): Function;

			/**
			 * Takes array of nodes, and turns them into class instances and
			 * potentially calls a startup method to allow them to connect with
			 * any children.
			 */
			instantiate(nodes: Node[], mixin?: Object, options?: ParserOptions): any[];

			/**
			 * Takes array of objects representing nodes, and turns them into class instances and
			 * potentially calls a startup method to allow them to connect with
			 * any children.
			 */
			_instantiate(nodes: ParserObjects[], mixin?: Object, options?: ParserOptions, returnPromise?: boolean): any[] | Promise<any[]>;

			/**
			 * Calls new ctor(params, node), where params is the hash of parameters specified on the node,
			 * excluding data-dojo-type and data-dojo-mixins.   Does not call startup().
			 */
			construct<T>(
				ctor: Constructor<T>,
				node: Node, mixin?: Object,
				options?: ParserOptions,
				scripts?: HTMLScriptElement[],
				inherited?: { [prop: string]: any; }
			): Promise<T> | T;

			/**
			 * Scan a DOM tree and return an array of objects representing the DOMNodes
			 * that need to be turned into widgets.
			 */
			scan(root?: Node, options?: ParserOptions): Promise<ParserObjects[]>;

			/**
			 * Helper for _scanAMD().  Takes a `<script type=dojo/require>bar: "acme/bar", ...</script>` node,
			 * calls require() to load the specified modules and (asynchronously) assign them to the specified global
			 * variables, and returns a Promise for when that operation completes.
			 *
			 * In the example above, it is effectively doing a require(["acme/bar", ...], function(a){ bar = a; }).
			 */
			_require(script: HTMLScriptElement, options: ParserOptions): Promise<any>;

			/**
			 * Scans the DOM for any declarative requires and returns their values.
			 */
			_scanAmd(root?: Node, options?: ParserOptions): Promise<boolean>;

			/**
			 * Scan the DOM for class instances, and instantiate them.
			 */
			parse(rootNode?: Node, options?: ParserOptions): InstancesArray;
		}

		interface Dojo {
			parser: Parser;
		}
	}
}

export = parser;