// @ts-nocheck

declare namespace DojoJS
{
	interface Handle {
		remove(): void;
	}

	interface Require {
		(config: Record<string, any>, dependencies?: string | string[], callback?: (...args: any[]) => void): Require;
		(dependencies: string | string[], callback: (...args: any[]) => void): Require;
		async: number| boolean;
		has: DojoJS.Has;
		isXdurl(url: string): boolean;
		initSyncLoader(dojoRequirePlugin: any, checkDojoRequirePlugin: any, transformToAmd: any): Record<string, any>;
		getXhr(): XMLHttpRequest | /* ActiveXObject */ any;
		getText(url: string, async?: boolean, onLoad?: (responseText: string, async?: boolean) => void): string;
		eval(text: string, hint?: string): any;
		signal(type: string, args: any[]): void;
		on(type: string, listener: (...args: any[]) => void): Handle;
		map: { [id: string]: any };
		waitms?: number;
		legacyMode: boolean;
		rawConfig: DojoJS._base.Config;
		baseUrl: string;
		combo?: {
			add: () => void;
			done(callback: (mids: string[], url?: string) => void, req: Require): void;
			plugins?: Record<string, any>;
		};
		idle(): boolean;
		toAbsMid(mid: string, referenceModule?: string): string;
		toUrl(name: string, referenceModule?: string): string;
		undef(moduleId: string, referenceModule?: string): void;
		pageLoaded: number | boolean;
		injectUrl(url: string, callback?: () => void, owner?: HTMLScriptElement): HTMLScriptElement;
		log(...args: any[]): void;
		trace: {
			(group: string, args: any[]): void;
			on: boolean | number;
			group: Record<string, any>;
			set(group: string | Record<string, any>, value: any): void;
		};
		boot?: [string[], Function] | number;
	}

	interface Define {
		(mid: string, dependencies?: string[], factory?: any): void;
		(dependencies: string[], factory?: any): void;
		amd: string;
	}

	interface Dojo {}

	interface Dojox {}

	interface Dijit {}
}

var require: DojoJS.Require;
var define: DojoJS.Define;
var dojo: DojoJS.Dojo;
var dijit: DojoJS.Dijit;
var dojox: DojoJS.Dojox;

declare module "require" {
	export = require;
}

declare module "module" {
	var module: any;
	export = module;
}

declare module "exports" {
	var exports: any;
	export = exports;
}

declare module "dojo" {
	export = dojo;
}

declare module "dijit" {
	export = dijit;
}

declare module "dojox" {
	export = dojox;
}


(function (e: any, t) {
	var n = (function (): Window & typeof globalThis {
		// @ts-ignore - This check if g is undefined
		return undefined !== windowRef && "function" != typeof windowRef
			? windowRef
			: "undefined" != typeof window
			? window
			: "undefined" != typeof self
			? self
			// @ts-ignore - this is the same as self.
			: this;
	})();
	var noop = function () {};
	var isObjectEmpty = function (obj: object | null): 0 | 1 {
		for (var _ in obj) return 0;
		return 1;
	};
	var objToString = {}.toString;
	var isFunc = function (e: any): boolean {
		return "[object Function]" == objToString.call(e);
	};
	var isString = function (e: any): boolean {
		return "[object String]" == objToString.call(e);
	};
	var isArray = function (e: any): boolean {
		return "[object Array]" == objToString.call(e);
	};
	var arrForeach = function<T>(e: Array<T> | null, t: (e: T) => void): void {
		if (e) for (var n = 0; n < e.length; ) t(e[n++]!);
	};
	var merge = function<T extends object, E extends object>(dest: T, other: E): T & E {
		// @ts-ignore - This is a helper function to merge two objects.
		for (var n in other) dest[n] = other[n];
		return dest as T & E;
	};
	var createLoaderError = function<T>(message: string, info: T): Error & { src: string; info: T } {
		return merge(new Error(message), { src: "dojoLoader", info: info });
	};
	var uid_tag_counter = 1;
	var generateUniqueIdTag = function (): `_${number}` {
		return ("_" + uid_tag_counter++) as `_${number}`;
	};
	// @ts-ignore - Require is not fully defined yet, but don't use partial to keep things clean.
	var h: DojoJS.Require = function (e: any, t: any, n: any) {
		return he(e, t, n, 0, h);
	};
	var windowRef = n;
	var docRef = windowRef.document;
	var divElement = docRef && docRef.createElement("DiV");
	// @ts-ignore - Has is not fully defined yet, but don't use partial to keep things clean.
	var lazyLoader: DojoJS.Has = (h.has = function (e: string) {
		return isFunc(loaderCache[e]) ? (loaderCache[e] = loaderCache[e](windowRef, docRef, divElement)) : loaderCache[e];
	});
	var loaderCache: Record<string, any> = (lazyLoader.cache = t.hasCache);
	isFunc(e) && (e = e(n));
	lazyLoader.add = function (name: any, test: any, n: any, r: any) {
		(undefined === loaderCache[name] || r) && (loaderCache[name] = test);
		return n && lazyLoader(name);
	};
	0;
	lazyLoader.add(
		"host-webworker",
		// @ts-ignore -  WorkerGlobalScope is not a valid type.
		"undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope
	);
	if (lazyLoader("host-webworker")) {
		merge(t.hasCache, {
			"host-browser": 0,
			dom: 0,
			"dojo-dom-ready-api": 0,
			"dojo-sniff": 0,
			"dojo-inject-api": 1,
			"host-webworker": 1,
			"dojo-guarantee-console": 0,
		});
		t.loaderPatch = {
			injectUrl: function (script: string, callback: () => any) {
				try {
					// @ts-ignore - this is meant to fail if importScripts is not defined.
					importScripts(script);
					callback();
				} catch (n) {
					console.error(n);
				}
			},
		};
	}
	// @ts-ignore - misuse of add parameters
	for (var x in e.has) lazyLoader.add(x, e.has[x], 0, 1);
	var w = 1,
		_ = 2,
		j = 3,
		E = 4,
		C = 5;
	0;
	var T: any,
		A = 0,
		k = "sync",
		S: object[] = [],
		L = 0,
		M = noop,
		q = noop;
	// @ts-ignore - not sure about this error
	h.isXdUrl = noop;
	h.initSyncLoader = function (e: any, t: any, n: any) {
		if (!L) {
			L = e;
			M = t;
			q = n;
		}
		return {
			sync: k,
			requested: w,
			arrived: _,
			nonmodule: j,
			executing: E,
			executed: C,
			syncExecStack: S,
			modules: J,
			execQ: me,
			getModule: Se,
			injectModule: Ye,
			setArrived: xe,
			signal: U,
			finishExec: Be,
			execModule: He,
			dojoRequirePlugin: L,
			getLegacyMode: function () {
				return A;
			},
			guardCheckComplete: Xe,
		};
	};
	var D = location.protocol,
		O = location.host;
	// @ts-ignore - duplicate identifier?
	h.isXdUrl = function (e) {
		if (/^\./.test(e)) return false;
		if (/^\/\//.test(e)) return true;
		var t = e.match(/^([^\/\:]+\:)\/+([^\/]+)/);
		return (t && (t[1] != D || (O && t[2] != O))) as boolean;
	};
	lazyLoader.add(
		"dojo-force-activex-xhr",
		!docRef.addEventListener && "file:" == window.location.protocol
	);
	lazyLoader.add("native-xhr", "undefined" != typeof XMLHttpRequest);
	if (lazyLoader("native-xhr") && !lazyLoader("dojo-force-activex-xhr"))
		T = function () {
			return new XMLHttpRequest();
		};
	else {
		for (
			var P: any,
				R = [
					"Msxml2.XMLHTTP",
					"Microsoft.XMLHTTP",
					"Msxml2.XMLHTTP.4.0",
				],
				I = 0;
			I < 3;

		)
			try {
				P = R[I++];
				if (new ActiveXObject(P)) break;
			} catch (lt) {}
		T = function () {
			return new ActiveXObject(P);
		};
	}
	h.getXhr = T;
	lazyLoader.add("dojo-gettext-api", 1);
	h.getText = function (e, t, n) {
		var r = T();
		r.open("GET", ze(e), false);
		r.send(null);
		if (200 != r.status && (location.host || r.status))
			throw createLoaderError("xhrFailed", r.status);
		n && n(r.responseText, t);
		return r.responseText;
	};
	var N = lazyLoader("csp-restrictions")
		? function () {}
		: new Function("return eval(arguments[0]);");
	h.eval = function (e, t) {
		return N(e + "\r\n//# sourceURL=" + t);
	};
	var F = {},
		B = "error",
		U = (h.signal = function (e, t) {
			var n = F[e];
			arrForeach(n && n.slice(0), function (e) {
				e.apply(null, isArray(t) ? t : [t]);
			});
		}),
		H = (h.on = function (e, t) {
			var n = F[e] || (F[e] = []);
			n.push(t);
			return {
				remove: function () {
					for (var e = 0; e < n.length; e++)
						if (n[e] === t) {
							n.splice(e, 1);
							return;
						}
				},
			};
		}),
		V = [],
		X = {},
		W = [],
		z = {},
		Q = (h.map = {}),
		K = [],
		J = {},
		G = "",
		$ = {},
		Y = "url:",
		Z = {},
		ee = {},
		te = 0;
	if (!lazyLoader("foreign-loader"))
		var ne = function (e, t) {
			t = false !== t;
			var n, r, o, i, a;
			for (n in Z) {
				r = Z[n];
				if ((o = n.match(/^url\:(.+)/))) $[Y + Me(o[1], e)] = r;
				else if ("*now" == n) i = r;
				else if ("*noref" != n) {
					a = Te(n, e, true);
					$[a.mid] = $[Y + a.url] = r;
				}
			}
			i && i(ge(e));
			t && (Z = {});
		};
	var re = function (e) {
			return e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function (e) {
				return "\\" + e;
			});
		},
		oe = function (e, t) {
			t.splice(0, t.length);
			for (var n in e)
				t.push([n, e[n], new RegExp("^" + re(n) + "(/|$)"), n.length]);
			t.sort(function (e, t) {
				return t[3] - e[3];
			});
			return t;
		},
		ie = function (e, t) {
			arrForeach(e, function (e) {
				t.push([
					isString(e[0]) ? new RegExp("^" + re(e[0]) + "$") : e[0],
					e[1],
				]);
			});
		},
		ae = function (e) {
			var t = e.name;
			t || (e = { name: (t = e) });
			(e = merge({ main: "main" }, e)).location = e.location ? e.location : t;
			e.packageMap && (Q[t] = e.packageMap);
			e.main.indexOf("./") || (e.main = e.main.substring(2));
			z[t] = e;
		},
		se = [],
		ue = function (e, t, n) {
			for (var r in e) {
				"waitSeconds" == r && (h.waitms = 1e3 * (e[r] || 0));
				"cacheBust" == r &&
					(G = e[r]
						? isString(e[r])
							? e[r]
							: new Date().getTime() + ""
						: "");
				("baseUrl" != r && "combo" != r) || (h[r] = e[r]);
				if ("async" == r) {
					var o = e[r];
					h.legacyMode = A =
						isString(o) && /sync|legacyAsync/.test(o) ? o : !o && k;
					h.async = !A;
				}
				if (e[r] !== loaderCache) {
					h.rawConfig[r] = e[r];
					"has" != r && lazyLoader.add("config-" + r, e[r], 0, t);
				}
			}
			h.baseUrl || (h.baseUrl = "./");
			/\/$/.test(h.baseUrl) || (h.baseUrl += "/");
			for (r in e.has) lazyLoader.add(r, e.has[r], 0, t);
			arrForeach(e.packages, ae);
			for (var i in e.packagePaths)
				arrForeach(e.packagePaths[i], function (e) {
					var t = i + "/" + e;
					isString(e) && (e = { name: e });
					e.location = t;
					ae(e);
				});
			oe(merge(Q, e.map), K);
			arrForeach(K, function (e) {
				e[1] = oe(e[1], []);
				"*" == e[0] && (K.star = e);
			});
			oe(merge(X, e.paths), W);
			ie(e.aliases, V);
			if (!lazyLoader("foreign-loader")) {
				if (t) se.push({ config: e.config });
				else
					for (r in e.config) {
						var a = Se(r, n);
						a.config = merge(a.config || {}, e.config[r]);
					}
				if (e.cache) {
					ne();
					Z = e.cache;
					ne(0, !!e.cache["*noref"]);
				}
			}
			U("config", [e, h.rawConfig]);
		};
	lazyLoader("dojo-cdn");
	var ce,
		le,
		fe,
		de = docRef.getElementsByTagName("script");
	for (I = 0; I < de.length; ) {
		if (
			(le = (ot = de[I++]).getAttribute("src")) &&
			(fe = le.match(/(((.*)\/)|^)dojo\.js(\W|$)/i))
		) {
			ce = fe[3] || "";
			t.baseUrl = t.baseUrl || ce;
			te = ot;
		}
		if (
			(le =
				ot.getAttribute("data-dojo-config") ||
				ot.getAttribute("djConfig"))
		) {
			ee = h.eval("({ " + le + " })", "data-dojo-config");
			te = ot;
		}
		0;
	}
	h.rawConfig = {};
	ue(t, 1);
	if (lazyLoader("dojo-cdn")) {
		z.dojo.location = ce;
		ce && (ce += "/");
		z.dijit.location = ce + "../dijit/";
		z.dojox.location = ce + "../dojox/";
	}
	ue(e, 1);
	ue(ee, 1);
	if (!lazyLoader("foreign-loader"))
		var pe = function (e) {
				Xe(function () {
					arrForeach(e.deps, Ye);
					0;
				});
			},
			he = function (dependencies: string | string[] | Record<string, any>, loadCallback: (...args: any[]) => any, n, o, returnContext: Require): Require {
				var a, c;
				if (isString(dependencies)) {
					if ((a = Se(dependencies, o, true)) && a.executed) return a.result;
					throw createLoaderError("undefinedModule", dependencies);
				}
				if (!isArray(dependencies)) {
					ue(dependencies, 0, o);
					dependencies = loadCallback;
					loadCallback = n;
				}
				if (isArray(dependencies))
					if (dependencies.length) {
						c = "require*" + generateUniqueIdTag();
						for (var d, g = [], m = 0; m < dependencies.length; ) {
							d = dependencies[m++];
							g.push(Se(d, o));
						}
						a = merge(Ee("", c, 0, ""), {
							injected: _,
							deps: g,
							def: loadCallback || noop,
							require: o ? o.require : h,
							gc: 1,
						});
						J[a.mid] = a;
						pe(a);
						var v = Ve && A != k;
						Xe(function () {
							He(a, v);
						});
						a.executed || me.push(a);
						We();
					} else loadCallback && loadCallback();
				return returnContext;
			},
			ge = function (e) {
				if (!e) return h;
				var t = e.require;
				if (!t) {
					t = function (n, r, o) {
						return he(n, r, o, e, t);
					};
					e.require = merge(t, h);
					t.module = e;
					t.toUrl = function (t) {
						return Me(t, e);
					};
					t.toAbsMid = function (t) {
						return Le(t, e);
					};
					0;
					t.syncLoadNls = function (t) {
						var n = Te(t, e),
							r = J[n.mid];
						if (
							(!r || !r.executed) &&
							(Ke = $[n.mid] || $[Y + n.url])
						) {
							$e(Ke);
							r = J[n.mid];
						}
						return r && r.executed && r.result;
					};
				}
				return t;
			},
			me: any[] = [],
			ve: any[] = [],
			ye: any = {},
			be = function (e: any) {
				e.injected = w;
				ye[e.mid] = 1;
				e.url && (ye[e.url] = e.pack || 1);
				rt();
			},
			xe = function (e) {
				e.injected = _;
				delete ye[e.mid];
				e.url && delete ye[e.url];
				if (isObjectEmpty(ye)) {
					nt();
					"xd" == A && (A = k);
				}
			},
			we = (h.idle = function () {
				return !ve.length && isObjectEmpty(ye) && !me.length && !Ve;
			});
	var _e = function (e, t) {
			if (t)
				for (var n = 0; n < t.length; n++)
					if (t[n][2].test(e)) return t[n];
			return 0;
		},
		je = function (e) {
			var t,
				n,
				r = [];
			e = e.replace(/\\/g, "/").split("/");
			for (; e.length; )
				if (".." == (t = e.shift()) && r.length && ".." != n) {
					r.pop();
					n = r[r.length - 1];
				} else "." != t && r.push((n = t));
			return r.join("/");
		},
		Ee = function (e, t, n, r) {
			var o = h.isXdUrl(r);
			return {
				pid: e,
				mid: t,
				pack: n,
				url: r,
				executed: 0,
				def: 0,
				isXd: o,
				isAmd: !!(o || (z[e] && z[e].isAmd)),
			};
		},
		Ce = function (e, t, n, r, o, i, s, u, l, d) {
			var p, h, g, m, v, b, x;
			e;
			x = /^\./.test(e);
			if (/(^\/)|(\:)|(\.js$)/.test(e) || (x && !t))
				return Ee(0, e, 0, e);
			e = je(x ? t.mid + "/../" + e : e);
			if (/^\./.test(e)) throw createLoaderError("irrationalPath", e);
			d || x || !i.star || (m = _e(e, i.star[1]));
			!m && t && (m = (m = _e(t.mid, i)) && _e(e, m[1]));
			m && (e = m[1] + e.substring(m[3]));
			(h = n[(p = (fe = e.match(/^([^\/]+)(\/(.+))?$/)) ? fe[1] : "")])
				? (e = p + "/" + (g = fe[3] || h.main))
				: (p = "");
			var w = 0;
			arrForeach(u, function (t) {
				var n = e.match(t[0]);
				n &&
					n.length > 0 &&
					(w = isFunc(t[1]) ? e.replace(t[0], t[1]) : t[1]);
			});
			if (w) return Ce(w, 0, n, r, o, i, s, u, l);
			if ((b = r[e])) return l ? Ee(b.pid, b.mid, b.pack, b.url) : r[e];
			v = (m = _e(e, s))
				? m[1] + e.substring(m[3])
				: p
				? ("/" === h.location.slice(-1)
						? h.location.slice(0, -1)
						: h.location) +
				  "/" +
				  g
				: lazyLoader("config-tlmSiblingOfDojo")
				? "../" + e
				: e;
			/(^\/)|(\:)/.test(v) || (v = o + v);
			return Ee(p, e, h, je((v += ".js")));
		},
		Te = function (e, t, n) {
			return Ce(e, t, z, J, h.baseUrl, K, W, V, undefined, n);
		};
	if (!lazyLoader("foreign-loader"))
		var Ae = function (e, t, n) {
				return e.normalize
					? e.normalize(t, function (e) {
							return Le(e, n);
					  })
					: Le(t, n);
			},
			ke = 0,
			Se = function (e, t, n) {
				var r, o, i, a;
				if ((r = e.match(/^(.+?)\!(.*)$/))) {
					o = Se(r[1], t, n);
					if (A == k && !o.executed) {
						Ye(o);
						o.injected !== _ ||
							o.executed ||
							Xe(function () {
								He(o);
							});
						o.executed ? Fe(o) : me.unshift(o);
					}
					o.executed !== C || o.load || Fe(o);
					if (o.load) {
						i = Ae(o, r[2], t);
						e = o.mid + "!" + (o.dynamic ? ++ke + "!" : "") + i;
					} else {
						i = r[2];
						e = o.mid + "!" + ++ke + "!waitingForPlugin";
					}
					a = { plugin: o, mid: e, req: ge(t), prid: i };
				} else a = Te(e, t);
				return J[a.mid] || (!n && (J[a.mid] = a));
			};
	var Le = (h.toAbsMid = function (e, t) {
			return Te(e, t).mid;
		}),
		Me = (h.toUrl = function (e, t) {
			var n = Te(e + "/x", t),
				r = n.url;
			return ze(0 === n.pid ? e : r.substring(0, r.length - 5));
		});
	if (!lazyLoader("foreign-loader"))
		var qe = { injected: _, executed: C, def: j, result: j },
			De = function (e) {
				return (J[e] = merge({ mid: e }, qe));
			},
			Oe = De("require"),
			Pe = De("exports"),
			Re = De("module"),
			Ie = {},
			Ne = 0,
			Fe = function (e) {
				var t = e.result;
				e.dynamic = t.dynamic;
				e.normalize = t.normalize;
				e.load = t.load;
				return e;
			},
			Be = function (e) {
				h.trace("loader-finish-exec", [e.mid]);
				e.executed = C;
				e.defOrder = Ne++;
				arrForeach(e.provides, function (e) {
					e();
				});
				if (e.loadQ) {
					Fe(e);
					!(function (e) {
						var t = {};
						arrForeach(e.loadQ, function (n) {
							var r = Ae(e, n.prid, n.req.module),
								o = e.dynamic
									? n.mid.replace(/waitingForPlugin$/, r)
									: e.mid + "!" + r,
								i = merge(merge({}, n), {
									mid: o,
									prid: r,
									injected: 0,
								});
							(J[o] && J[o].injected) || Qe((J[o] = i));
							t[n.mid] = J[o];
							xe(n);
							delete J[n.mid];
						});
						e.loadQ = 0;
						var n = function (e) {
							for (
								var n, r = e.deps || [], o = 0;
								o < r.length;
								o++
							)
								(n = t[r[o].mid]) && (r[o] = n);
						};
						for (var r in J) n(J[r]);
						arrForeach(me, n);
					})(e);
				}
				for (I = 0; I < me.length; )
					me[I] === e ? me.splice(I, 1) : I++;
				/^require\*/.test(e.mid) && delete J[e.mid];
			},
			Ue = [],
			He = function (e, t) {
				if (e.executed === E) {
					h.trace("loader-circular-dependency", [
						Ue.concat(e.mid).join("->"),
					]);
					return !e.def || t ? Ie : e.cjs && e.cjs.exports;
				}
				if (!e.executed) {
					if (!e.def) return Ie;
					var n,
						r,
						o = e.mid,
						i = e.deps || [],
						s = [],
						u = 0;
					0;
					e.executed = E;
					for (; (n = i[u++]); ) {
						if (
							(r =
								n === Oe
									? ge(e)
									: n === Pe
									? e.cjs.exports
									: n === Re
									? e.cjs
									: He(n, t)) === Ie
						) {
							e.executed = 0;
							h.trace("loader-exec-module", ["abort", o]);
							return Ie;
						}
						s.push(r);
					}
					!(function (e, t) {
						h.trace("loader-run-factory", [e.mid]);
						var n,
							r = e.def;
						S.unshift(e);
						if (lazyLoader("config-dojo-loader-catches"))
							try {
								n = isFunc(r) ? r.apply(null, t) : r;
							} catch (lt) {
								U(B, (e.result = createLoaderError("factoryThrew", [e, lt])));
							}
						else n = isFunc(r) ? r.apply(null, t) : r;
						e.result = undefined === n && e.cjs ? e.cjs.exports : n;
						S.shift(e);
					})(e, s);
					Be(e);
				}
				return e.result;
			},
			Ve = 0,
			Xe = function (e) {
				try {
					Ve++;
					e();
				} catch (lt) {
					throw lt;
				} finally {
					Ve--;
				}
				we() && U("idle", []);
			},
			We = function () {
				Ve ||
					Xe(function () {
						M();
						for (var e, t, n = 0; n < me.length; ) {
							e = Ne;
							t = me[n];
							He(t);
							if (e != Ne) {
								M();
								n = 0;
							} else n++;
						}
					});
			};
	var ze =
		"function" == typeof e.fixupUrl
			? e.fixupUrl
			: function (e) {
					return (
						(e += "") + (G ? (/\?/.test(e) ? "&" : "?") + G : "")
					);
			  };
	0;
	undefined === lazyLoader("dojo-loader-eval-hint-url") &&
		lazyLoader.add("dojo-loader-eval-hint-url", 1);
	var Qe = function (e) {
			var t = e.plugin;
			t.executed !== C || t.load || Fe(t);
			if (t.load)
				t.load(e.prid, e.req, function (t) {
					e.result = t;
					xe(e);
					Be(e);
					We();
				});
			else if (t.loadQ) t.loadQ.push(e);
			else {
				t.loadQ = [e];
				me.unshift(t);
				Ye(t);
			}
		},
		Ke = 0,
		Je = 0,
		Ge = 0,
		$e = function (e, t) {
			lazyLoader("config-stripStrict") &&
				(e = e.replace(/(["'])use strict\1/g, ""));
			Ge = 1;
			if (lazyLoader("config-dojo-loader-catches"))
				try {
					e === Ke
						? Ke.call(null)
						: h.eval(
								e,
								lazyLoader("dojo-loader-eval-hint-url") ? t.url : t.mid
						  );
				} catch (lt) {
					U(B, createLoaderError("evalModuleThrew", t));
				}
			else
				e === Ke
					? Ke.call(null)
					: h.eval(e, lazyLoader("dojo-loader-eval-hint-url") ? t.url : t.mid);
			Ge = 0;
		},
		Ye = function (e) {
			var t = e.mid,
				n = e.url;
			if (
				!(
					e.executed ||
					e.injected ||
					ye[t] ||
					(e.url &&
						((e.pack && ye[e.url] === e.pack) || 1 == ye[e.url]))
				)
			) {
				be(e);
				if (e.plugin) Qe(e);
				else {
					var r = function () {
						et(e);
						if (e.injected !== _) {
							if (lazyLoader("dojo-enforceDefine")) {
								U(B, createLoaderError("noDefine", e));
								return;
							}
							xe(e);
							merge(e, qe);
							h.trace("loader-define-nonmodule", [e.url]);
						}
						A ? !S.length && We() : We();
					};
					if ((Ke = $[t] || $[Y + e.url])) {
						h.trace("loader-inject", ["cache", e.mid, n]);
						$e(Ke, e);
						r();
					} else {
						if (A)
							if (e.isXd) A == k && (A = "xd");
							else if (!e.isAmd || A == k) {
								var o = function (o) {
									if (A == k) {
										S.unshift(e);
										$e(o, e);
										S.shift();
										et(e);
										if (!e.cjs) {
											xe(e);
											Be(e);
										}
										if (e.finish) {
											var i = t + "*finish",
												a = e.finish;
											delete e.finish;
											st(
												i,
												[
													"dojo",
													(
														"dojo/require!" +
														a.join(",")
													).replace(/\./g, "/"),
												],
												function (e) {
													arrForeach(a, function (t) {
														e.require(t);
													});
												}
											);
											me.unshift(Se(i));
										}
										r();
									} else if ((o = q(e, o))) {
										$e(o, e);
										r();
									} else {
										Je = e;
										h.injectUrl(ze(n), r, e);
										Je = 0;
									}
								};
								h.trace("loader-inject", [
									"xhr",
									e.mid,
									n,
									A != k,
								]);
								if (lazyLoader("config-dojo-loader-catches"))
									try {
										h.getText(n, A != k, o);
									} catch (lt) {
										U(B, createLoaderError("xhrInjectFailed", [e, lt]));
									}
								else h.getText(n, A != k, o);
								return;
							}
						h.trace("loader-inject", ["script", e.mid, n]);
						Je = e;
						h.injectUrl(ze(n), r, e);
						Je = 0;
					}
				}
			}
		},
		Ze = function (e, t, n) {
			h.trace("loader-define-module", [e.mid, t]);
			0;
			var r = e.mid;
			if (e.injected === _) {
				U(B, createLoaderError("multipleDefine", e));
				return e;
			}
			merge(e, {
				deps: t,
				def: n,
				cjs: {
					id: e.mid,
					uri: e.url,
					exports: (e.result = {}),
					setExports: function (t) {
						e.cjs.exports = t;
					},
					config: function () {
						return e.config;
					},
				},
			});
			for (var o = 0; t[o]; o++) t[o] = Se(t[o], e);
			if (A && !ye[r]) {
				pe(e);
				me.push(e);
				We();
			}
			xe(e);
			if (!isFunc(n) && !t.length) {
				e.result = n;
				Be(e);
			}
			return e;
		},
		et = function (e, t) {
			for (var n, r, o = []; ve.length; ) {
				r = ve.shift();
				t && (r[0] = t.shift());
				n = (r[0] && Se(r[0])) || e;
				o.push([n, r[1], r[2]]);
			}
			ne(e);
			arrForeach(o, function (e) {
				pe(Ze.apply(null, e));
			});
		},
		tt = 0,
		nt = noop,
		rt = noop;
	nt = function () {
		tt && clearTimeout(tt);
		tt = 0;
	};
	rt = function () {
		nt();
		h.waitms &&
			(tt = windowRef.setTimeout(function () {
				nt();
				U(B, createLoaderError("timeout", ye));
			}, h.waitms));
	};
	lazyLoader.add(
		"ie-event-behavior",
		docRef.attachEvent &&
			"undefined" == typeof Windows &&
			("undefined" == typeof opera ||
				"[object Opera]" != opera.toString())
	);
	var ot,
		it = function (e, t, n, r) {
			if (lazyLoader("ie-event-behavior")) {
				e.attachEvent(n, r);
				return function () {
					e.detachEvent(n, r);
				};
			}
			e.addEventListener(t, r, false);
			return function () {
				e.removeEventListener(t, r, false);
			};
		},
		at = it(window, "load", "onload", function () {
			h.pageLoaded = 1;
			try {
				"complete" != docRef.readyState && (docRef.readyState = "complete");
			} catch (lt) {}
			at();
		});
	for (de = docRef.getElementsByTagName("script"), I = 0; !te; )
		/^dojo/.test((ot = de[I++]) && ot.type) || (te = ot);
	h.injectUrl = function (e, t, n) {
		var r = (n.node = docRef.createElement("script")),
			o = it(r, "load", "onreadystatechange", function (e) {
				var n = (e = e || window.event).target || e.srcElement;
				if ("load" === e.type || /complete|loaded/.test(n.readyState)) {
					o();
					i();
					t && t();
				}
			}),
			i = it(r, "error", "onerror", function (t) {
				o();
				i();
				U(B, createLoaderError("scriptError: " + e, [e, t]));
			});
		r.type = "text/javascript";
		r.charset = "utf-8";
		r.src = e;
		te.parentNode.insertBefore(r, te);
		return r;
	};
	h.log = function () {
		try {
			for (var e = 0; e < arguments.length; e++);
		} catch (lt) {}
	};
	h.trace = noop;
	if (lazyLoader("foreign-loader")) st = noop;
	else {
		var st = function (e, t, n) {
			var r = arguments.length,
				o = ["require", "exports", "module"],
				i = [0, e, t];
			1 == r
				? (i = [0, isFunc(e) ? o : [], e])
				: 2 == r && isString(e)
				? (i = [e, isFunc(t) ? o : [], t])
				: 3 == r && (i = [e, t, n]);
			0;
			h.trace("loader-define", i.slice(0, 2));
			var u,
				c = i[0] && Se(i[0]);
			if (c && !ye[c.mid]) pe(Ze(c, i[1], i[2]));
			else if (!lazyLoader("ie-event-behavior") || Ge) ve.push(i);
			else {
				if (!(c = c || Je)) {
					for (e in ye)
						if (
							(u = J[e]) &&
							u.node &&
							"interactive" === u.node.readyState
						) {
							c = u;
							break;
						}
				}
				if (c) {
					ne(c);
					pe(Ze(c, i[1], i[2]));
				} else U(B, createLoaderError("ieDefineFailed", i[0]));
				We();
			}
		};
		st.amd = { vendor: "dojotoolkit.org" };
		0;
	}
	merge(merge(h, t.loaderPatch), e.loaderPatch);
	H(B, function (e) {
		try {
			console.error(e);
			if (e instanceof Error) for (var t in e) e[t];
		} catch (lt) {}
	});
	merge(h, { uid: generateUniqueIdTag, cache: $, packs: z });
	0;
	if (windowRef.define) U(B, createLoaderError("defineAlreadyDefined", 0));
	else {
		windowRef.define = st;
		windowRef.require = h;
		0;
		if (!lazyLoader("foreign-loader")) {
			arrForeach(se, function (e) {
				ue(e);
			});
			var ut = ee.deps || e.deps || t.deps,
				ct = ee.callback || e.callback || t.callback;
			h.boot = ut || ct ? [ut || [], ct] : 0;
		}
		0;
	}
})(
	function (e: any) {
		return e.dojoConfig || e.djConfig || e.require || {};
	},
	{
		async: 0,
		hasCache: {
			"config-selectorEngine": "acme",
			"config-tlmSiblingOfDojo": 1,
			"dojo-built": 1,
			"dojo-loader": 1,
			dom: 1,
			"host-browser": 1,
		},
		packages: [
			{ location: "../dijit", name: "dijit" },
			{ location: "../dojox", name: "dojox" },
			{ location: "../ebg", name: "ebg" },
			{ location: "../ebgcss", name: "ebgcss" },
			{ location: "../img", name: "img" },
			{ location: "../svelte", name: "svelte" },
			{ location: ".", name: "dojo" },
		],
		loaderPatch: undefined as unknown as ({ injectUrl: (e: any, t: any) => void })
	}
);

// Add dojo modules to the require cache::
// "dojo/main"
// "dojo/_base/kernel"
// "dojo/global"
// "dojo/has"
// "dojo/_base/config"
// "dojo/sniff"
// "dojo/_base/lang"
// "dojo/_base/array"
// "dojo/ready"
// "dojo/domReady"
// "dojo/_base/declare"
// "dojo/_base/connect"
// "dojo/on"
// "dojo/topic"
// "dojo/Evented"
// "dojo/aspect"
// "dojo/_base/event"
// "dojo/dom-geometry"
// "dojo/_base/window"
// "dojo/dom"
// "dojo/dom-style"
// "dojo/mouse"
// "dojo/_base/sniff"
// "dojo/keys"
// "dojo/_base/Deferred"
// "dojo/Deferred"
// "dojo/errors/CancelError"
// "dojo/errors/create"
// "dojo/promise/Promise"
// "dojo/promise/instrumentation"
// "dojo/promise/tracer"
// "dojo/when"
// "dojo/_base/json"
// "dojo/json"
// "dojo/_base/Color"
// "dojo/_base/browser"
// "dojo/_base/unload"
// "dojo/_base/html"
// "dojo/dom-attr"
// "dojo/dom-prop"
// "dojo/dom-construct"
// "dojo/dom-class"
// "dojo/_base/NodeList"
// "dojo/query"
// "dojo/selector/_loader"
// "dojo/NodeList-dom"
// "dojo/_base/xhr"
// "dojo/io-query"
// "dojo/dom-form"
// "dojo/request/watch"
// "dojo/request/util"
// "dojo/errors/RequestError"
// "dojo/errors/RequestTimeoutError"
// "dojo/request/xhr"
// "dojo/request/handlers"
// "dojo/_base/fx"
// "dojo/_base/loader"

// This function immediately loads the dojo and require.boot modules.
(function () {
	var e = window.require;
	e({ cache: {} });
	!e.async && e(["dojo"]);
	e.boot && e.apply(null, e.boot);
})();