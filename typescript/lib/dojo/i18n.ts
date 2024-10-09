// @ts-nocheck

import dojo = require("./_base/kernel");
import _require = require("require");
import has = require("./has");
import array = require("./_base/array");
import config = require("./_base/config");
import lang = require("./_base/lang");
import xhr = require("./_base/xhr");
import json = require("./json");
import module = require("module");

has.add("dojo-preload-i18n-Api", 1);
var i18n = (dojo.i18n = {}),
	c = /(^.*(^|\/)nls)(\/|$)([^\/]*)\/?([^\/]*)/,
	h = {},
	u = function (t, i, n) {
		n = n ? n.toLowerCase() : dojo.locale;
		t = t.replace(/\./g, "/");
		i = i.replace(/\./g, "/");
		return /root/i.test(n)
			? t + "/nls/" + i
			: t + "/nls/" + n + "/" + i;
	},
	p = (dojo.getL10nName = function (e, t, i) {
		return module.id + "!" + u(e, t, i);
	}),
	m = function (t, s, l) {
		var d = c.exec(t),
			u = d[1] + "/",
			p = d[5] || d[4],
			m = u + p,
			g = d[5] && d[4],
			f = g || dojo.locale || "",
			_ = m + "/" + f,
			v = g
				? [f]
				: (function (e) {
						var t = config.extraLocale || [];
						(t = lang.isArray(t) ? t : [t]).push(e);
						return t;
					})(f),
			b = v.length,
			k = function () {
				--b || l(lang.delegate(h[_]));
			},
			x = t.split("*"),
			T = "preload" == x[1];
		if (has("dojo-preload-i18n-Api")) {
			if (T) {
				if (!h[t]) {
					h[t] = 1;
					y(x[2], json.parse(x[3]), 1, s);
				}
				l(1);
			}
			if (T || (w(t, s, l) && !h[_])) return;
		} else if (T) {
			l(1);
			return;
		}
		array.forEach(v, function (e) {
			var t = m + "/" + e;
			has("dojo-preload-i18n-Api") && C(t);
			h[t]
				? k()
				: (function (e, t, i, n, o, s) {
						e([t], function (r) {
							var l =
									undefined === r.root
										? r
										: lang.clone(
												r.root || r.ROOT
											),
								d = (function (e, t, i, n) {
									for (
										var o = [i + n],
											a = t.split("-"),
											s = "",
											r = 0;
										r < a.length;
										r++
									) {
										s +=
											(s ? "-" : "") +
											a[r];
										if (!e || e[s]) {
											o.push(
												i + s + "/" + n
											);
											o.specificity = s;
										}
									}
									return o;
								})(!r._v1x && r, o, i, n);
							e(d, function () {
								for (
									var e = 1;
									e < d.length;
									e++
								)
									l = lang.mixin(
										lang.clone(l),
										arguments[e]
									);
								h[t + "/" + o] = l;
								l.$locale = d.specificity;
								s();
							});
						});
					})(s, m, u, p, e, k);
		});
	};
has("dojo-preload-i18n-Api");
var g,
	f = (i18n.normalizeLocale = function (t) {
		var i = t ? t.toLowerCase() : dojo.locale;
		return "root" == i ? "ROOT" : i;
	}),
	_ = function (e, i) {
		return i.isXdUrl(_require.toUrl(e + ".js"));
	},
	v = 0,
	b = [],
	y = (i18n._preloadLocalizations = function (i, o, s, r) {
		r = r || _require;
		function l(e, t) {
			for (var i = e.split("-"); i.length; ) {
				if (t(i.join("-"))) return;
				i.pop();
			}
			t("ROOT");
		}
		function d() {
			v++;
		}
		function c() {
			--v;
			for (; !v && b.length; ) m.apply(null, b.shift());
		}
		function u(e, t, i, n) {
			return n.toAbsMid(e + t + "/" + i);
		}
		function p(e) {
			l((e = f(e)), function (p) {
				if (array.indexOf(o, p) >= 0) {
					var m = i.replace(/\./g, "/") + "_" + p;
					d();
					!(function (e, t) {
						_(e, r) || s ? r([e], t) : T([e], t, r);
					})(m, function (i) {
						for (var n in i) {
							var o,
								s,
								m = i[n],
								g = n.match(/(.+)\/([^\/]+)$/);
							if (g) {
								o = g[2];
								s = g[1] + "/";
								if (m._localized) {
									var f;
									if ("ROOT" === p) {
										var _ = (f =
											m._localized);
										delete m._localized;
										_.root = m;
										h[_require.toAbsMid(n)] = _;
									} else {
										f = m._localized;
										h[u(s, o, p, _require)] = m;
									}
									if (p !== e) {
										function v(i, n, o, s) {
											var p = [],
												m = [];
											l(e, function (e) {
												if (s[e]) {
													p.push(
														_require.toAbsMid(
															i +
																e +
																"/" +
																n
														)
													);
													m.push(
														u(
															i,
															n,
															e,
															_require
														)
													);
												}
											});
											if (p.length) {
												d();
												r(
													p,
													function () {
														for (
															var s =
																p.length -
																1;
															s >=
															0;
															s--
														) {
															o =
																lang.mixin(
																	lang.clone(
																		o
																	),
																	arguments[
																		s
																	]
																);
															h[
																m[
																	s
																]
															] =
																o;
														}
														h[
															u(
																i,
																n,
																e,
																_require
															)
														] =
															lang.clone(
																o
															);
														c();
													}
												);
											} else
												h[
													u(
														i,
														n,
														e,
														_require
													)
												] = o;
										}
										v(s, o, m, f);
									}
								}
							}
						}
						c();
					});
					return true;
				}
				return false;
			});
		}
		p();
		array.forEach(dojo.config.extraLocale, p);
	}),
	w = function (e, t, i) {
		v && b.push([e, t, i]);
		return v;
	},
	C = function () {},
	k = {},
	x = {},
	T = function (e, t, i) {
		var o = [];
		array.forEach(e, function (e) {
			var t = i.toUrl(e + ".js");
			function n(i) {
				g ||
					(g = new Function(
						"__bundle",
						"__checkForLegacyModules",
						"__mid",
						"__amdValue",
						"var define = function(mid, factory){define.called = 1; __amdValue.result = factory || mid;},\t   require = function(){define.called = 1;};try{define.called = 0;eval(__bundle);if(define.called==1)return __amdValue;if((__checkForLegacyModules = __checkForLegacyModules(__mid)))return __checkForLegacyModules;}catch(e){}try{return eval('('+__bundle+')');}catch(e){return e;}"
					));
				var n = g(i, C, e, k);
				if (n === k) o.push((h[t] = k.result));
				else {
					if (n instanceof Error) {
						console.error(
							"failed to evaluate i18n bundle; url=" +
								t,
							n
						);
						n = {};
					}
					o.push(
						(h[t] = /nls\/[^\/]+\/[^\/]+$/.test(t)
							? n
							: { root: n, _v1x: 1 })
					);
				}
			}
			if (h[t]) o.push(h[t]);
			else {
				var a = i.syncLoadNls(e);
				a ||
					(a = C(
						e.replace(
							/nls\/([^\/]*)\/([^\/]*)$/,
							"nls/$2/$1"
						)
					));
				if (a) o.push(a);
				else if (xhr)
					xhr.get({
						url: t,
						sync: true,
						load: n,
						error: function () {
							o.push((h[t] = {}));
						},
					});
				else
					try {
						i.getText(t, true, n);
					} catch (r) {
						o.push((h[t] = {}));
					}
			}
		});
		t && t.apply(null, o);
	};
C = function (t) {
	for (
		var i, n = t.split("/"), o = dojo.global[n[0]], a = 1;
		o && a < n.length - 1;
		o = o[n[a++]]
	);
	if (o) {
		(i = o[n[a]]) || (i = o[n[a].replace(/-/g, "_")]);
		i && (h[t] = i);
	}
	return i;
};
i18n.getLocalization = function (e, i, n) {
	var o,
		a = u(e, i, n);
	if (x[a]) return x[a];
	m(
		a,
		_(a, _require)
			? _require
			: function (e, i) {
					T(e, i, _require);
				},
		function (e) {
			x[a] = e;
			o = e;
		}
	);
	return o;
};

declare global {
	namespace DojoJS
	{
		interface I18n {
			getLocalization(moduleName: string, bundleName: string, locale?: string): any;
	
			dynamic: boolean;
	
			/**
			 * Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
			 */
			normalize(id: string, toAbsMid: Function): string; /* WIP: Align with loader api */
	
			normalizeLocale(locale?: string): string;
	
			/**
			 * Conditional loading of AMD modules based on a has feature test value.
			 */
			load(id: string, parentRequire: Function, loaded: Function): void; /* WIP: Align with loader api */
	
			cache: { [bundle: string]: any };
	
			getL10nName(moduleName: string, bundleName: string, locale?: string): string;
		}

		interface Dojo {
			i18n: I18n;
			getL10nName: I18n["getL10nName"];
		}
	}
}

export = lang.mixin(i18n, {
	dynamic: true,
	normalize: function (e, t) {
		return /^\./.test(e) ? t(e) : e;
	},
	load: m,
	cache: h,
	getL10nName: p,
}) as DojoJS.I18n;