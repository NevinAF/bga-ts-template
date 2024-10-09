// @ts-nocheck

import e = require("../dom");
import t = require("../sniff");
import i = require("../_base/array");
import n = require("../_base/lang");
import o = require("../_base/window");

var a = n.trim,
	s = i.forEach,
	r = function () {
		return o.doc;
	},
	l = "BackCompat" == r().compatMode,
	d = ">~+",
	c = false,
	h = function () {
		return true;
	},
	u = function (e) {
		d.indexOf(e.slice(-1)) >= 0 ? (e += " * ") : (e += " ");
		for (
			var t,
				i,
				n = function (t, i) {
					return a(e.slice(t, i));
				},
				o = [],
				s = -1,
				r = -1,
				l = -1,
				h = -1,
				u = -1,
				p = -1,
				m = -1,
				g = "",
				f = "",
				_ = 0,
				v = e.length,
				b = null,
				y = null,
				w = function () {
					!(function () {
						if (p >= 0) {
							b.id = n(p, _).replace(/\\/g, "");
							p = -1;
						}
					})();
					!(function () {
						if (m >= 0) {
							var e = m == _ ? null : n(m, _);
							b[
								d.indexOf(e) < 0
									? "tag"
									: "oper"
							] = e;
							m = -1;
						}
					})();
					!(function () {
						if (u >= 0) {
							b.classes.push(
								n(u + 1, _).replace(/\\/g, "")
							);
							u = -1;
						}
					})();
				},
				C = function () {
					w();
					h >= 0 &&
						b.pseudos.push({ name: n(h + 1, _) });
					b.loops =
						b.pseudos.length ||
						b.attrs.length ||
						b.classes.length;
					b.oquery = b.query = n(i, _);
					b.otag = b.tag = b.oper
						? null
						: b.tag || "*";
					b.tag && (b.tag = b.tag.toUpperCase());
					if (o.length && o[o.length - 1].oper) {
						b.infixOper = o.pop();
						b.query =
							b.infixOper.query + " " + b.query;
					}
					o.push(b);
					b = null;
				};
			(g = f), (f = e.charAt(_)), _ < v;
			_++
		)
			if ("\\" != g) {
				if (!b) {
					i = _;
					b = {
						query: null,
						pseudos: [],
						attrs: [],
						classes: [],
						tag: null,
						oper: null,
						id: null,
						getTag: function () {
							return c ? this.otag : this.tag;
						},
					};
					m = _;
				}
				if (t) f == t && (t = null);
				else if ("'" != f && '"' != f)
					if (s >= 0) {
						if ("]" == f) {
							y.attr
								? (y.matchFor = n(
										l || s + 1,
										_
									))
								: (y.attr = n(s + 1, _));
							var k = y.matchFor;
							k &&
								(('"' != k.charAt(0) &&
									"'" != k.charAt(0)) ||
									(y.matchFor = k.slice(
										1,
										-1
									)));
							y.matchFor &&
								(y.matchFor =
									y.matchFor.replace(
										/\\/g,
										""
									));
							b.attrs.push(y);
							y = null;
							s = l = -1;
						} else if ("=" == f) {
							var x =
								"|~^$*".indexOf(g) >= 0
									? g
									: "";
							y.type = x + f;
							y.attr = n(s + 1, _ - x.length);
							l = _ + 1;
						}
					} else if (r >= 0) {
						if (")" == f) {
							h >= 0 && (y.value = n(r + 1, _));
							h = r = -1;
						}
					} else if ("#" == f) {
						w();
						p = _ + 1;
					} else if ("." == f) {
						w();
						u = _;
					} else if (":" == f) {
						w();
						h = _;
					} else if ("[" == f) {
						w();
						s = _;
						y = {};
					} else if ("(" == f) {
						if (h >= 0) {
							y = {
								name: n(h + 1, _),
								value: null,
							};
							b.pseudos.push(y);
						}
						r = _;
					} else " " == f && g != f && C();
				else t = f;
			}
		return o;
	},
	p = function (e, t) {
		return e
			? t
				? function () {
						return (
							e.apply(window, arguments) &&
							t.apply(window, arguments)
						);
					}
				: e
			: t;
	},
	m = function (e, t) {
		var i = t || [];
		e && i.push(e);
		return i;
	},
	g = function (e) {
		return 1 == e.nodeType;
	},
	f = function (e, t) {
		return e
			? "class" == t
				? e.className || ""
				: "for" == t
				? e.htmlFor || ""
				: "style" == t
				? e.style.cssText || ""
				: (c
						? e.getAttribute(t)
						: e.getAttribute(t, 2)) || ""
			: "";
	},
	_ = {
		"*=": function (e, t) {
			return function (i) {
				return f(i, e).indexOf(t) >= 0;
			};
		},
		"^=": function (e, t) {
			return function (i) {
				return 0 == f(i, e).indexOf(t);
			};
		},
		"$=": function (e, t) {
			return function (i) {
				var n = " " + f(i, e),
					o = n.lastIndexOf(t);
				return o > -1 && o == n.length - t.length;
			};
		},
		"~=": function (e, t) {
			var i = " " + t + " ";
			return function (t) {
				return (" " + f(t, e) + " ").indexOf(i) >= 0;
			};
		},
		"|=": function (e, t) {
			var i = t + "-";
			return function (n) {
				var o = f(n, e);
				return o == t || 0 == o.indexOf(i);
			};
		},
		"=": function (e, t) {
			return function (i) {
				return f(i, e) == t;
			};
		},
	},
	v = r().documentElement,
	b = !(v.nextElementSibling || "nextElementSibling" in v),
	y = b ? "nextSibling" : "nextElementSibling",
	w = b ? "previousSibling" : "previousElementSibling",
	C = b ? g : h,
	k = function (e) {
		for (; (e = e[w]); ) if (C(e)) return false;
		return true;
	},
	x = function (e) {
		for (; (e = e[y]); ) if (C(e)) return false;
		return true;
	},
	T = function (e) {
		var i = e.parentNode,
			n = 0,
			o =
				(i = 7 != i.nodeType ? i : i.nextSibling)
					.children || i.childNodes,
			a = e._i || e.getAttribute("_i") || -1,
			s =
				i._l ||
				(undefined !== i.getAttribute
					? i.getAttribute("_l")
					: -1);
		if (!o) return -1;
		var r = o.length;
		if (s == r && a >= 0 && s >= 0) return a;
		t("ie") && undefined !== i.setAttribute
			? i.setAttribute("_l", r)
			: (i._l = r);
		a = -1;
		for (
			var l = i.firstElementChild || i.firstChild;
			l;
			l = l[y]
		)
			if (C(l)) {
				t("ie")
					? l.setAttribute("_i", ++n)
					: (l._i = ++n);
				e === l && (a = n);
			}
		return a;
	},
	A = function (e) {
		return !(T(e) % 2);
	},
	j = function (e) {
		return T(e) % 2;
	},
	S = {
		checked: function (e, t) {
			return function (e) {
				return !!("checked" in e
					? e.checked
					: e.selected);
			};
		},
		disabled: function (e, t) {
			return function (e) {
				return e.disabled;
			};
		},
		enabled: function (e, t) {
			return function (e) {
				return !e.disabled;
			};
		},
		"first-child": function () {
			return k;
		},
		"last-child": function () {
			return x;
		},
		"only-child": function (e, t) {
			return function (e) {
				return k(e) && x(e);
			};
		},
		empty: function (e, t) {
			return function (e) {
				for (
					var t = e.childNodes,
						i = e.childNodes.length - 1;
					i >= 0;
					i--
				) {
					var n = t[i].nodeType;
					if (1 === n || 3 == n) return false;
				}
				return true;
			};
		},
		contains: function (e, t) {
			var i = t.charAt(0);
			('"' != i && "'" != i) || (t = t.slice(1, -1));
			return function (e) {
				return e.innerHTML.indexOf(t) >= 0;
			};
		},
		not: function (e, t) {
			var i = u(t)[0],
				n = { el: 1 };
			"*" != i.tag && (n.tag = 1);
			i.classes.length || (n.classes = 1);
			var o = N(i, n);
			return function (e) {
				return !o(e);
			};
		},
		"nth-child": function (e, t) {
			var i = parseInt;
			if ("odd" == t) return j;
			if ("even" == t) return A;
			if (-1 != t.indexOf("n")) {
				var n = t.split("n", 2),
					o = n[0] ? ("-" == n[0] ? -1 : i(n[0])) : 1,
					a = n[1] ? i(n[1]) : 0,
					s = 0,
					r = -1;
				if (o > 0) {
					if (a < 0) a = a % o && o + (a % o);
					else if (a > 0) {
						a >= o && (s = a - (a % o));
						a %= o;
					}
				} else if (o < 0) {
					o *= -1;
					if (a > 0) {
						r = a;
						a %= o;
					}
				}
				if (o > 0)
					return function (e) {
						var t = T(e);
						return (
							t >= s &&
							(r < 0 || t <= r) &&
							t % o == a
						);
					};
				t = a;
			}
			var l = i(t);
			return function (e) {
				return T(e) == l;
			};
		},
	},
	E =
		t("ie") < 9 || (9 == t("ie") && t("quirks"))
			? function (e) {
					var t = e.toLowerCase();
					"class" == t && (e = "className");
					return function (i) {
						return c
							? i.getAttribute(e)
							: i[e] || i[t];
					};
				}
			: function (e) {
					return function (t) {
						return (
							t &&
							t.getAttribute &&
							t.hasAttribute(e)
						);
					};
				},
	N = function (e, t) {
		if (!e) return h;
		var i = null;
		"el" in (t = t || {}) || (i = p(i, g));
		"tag" in t ||
			("*" != e.tag &&
				(i = p(i, function (t) {
					return (
						t &&
						(c
							? t.tagName
							: t.tagName.toUpperCase()) ==
							e.getTag()
					);
				})));
		"classes" in t ||
			s(e.classes, function (e, t, n) {
				var o = new RegExp(
					"(?:^|\\s)" + e + "(?:\\s|$)"
				);
				(i = p(i, function (e) {
					return o.test(e.className);
				})).count = t;
			});
		"pseudos" in t ||
			s(e.pseudos, function (e) {
				var t = e.name;
				S[t] && (i = p(i, S[t](t, e.value)));
			});
		"attrs" in t ||
			s(e.attrs, function (e) {
				var t,
					n = e.attr;
				e.type && _[e.type]
					? (t = _[e.type](n, e.matchFor))
					: n.length && (t = E(n));
				t && (i = p(i, t));
			});
		"id" in t ||
			(e.id &&
				(i = p(i, function (t) {
					return !!t && t.id == e.id;
				})));
		i || "default" in t || (i = h);
		return i;
	},
	M = function (e, t) {
		var n = function (e) {
			var t = [];
			try {
				t = Array.prototype.slice.call(e);
			} catch (o) {
				for (var i = 0, n = e.length; i < n; i++)
					t.push(e[i]);
			}
			return t;
		};
		e = e || h;
		return function (o, a, s) {
			var r,
				l = 0,
				d = [];
			d = n(o.children || o.childNodes);
			t &&
				i.forEach(d, function (e) {
					1 === e.nodeType &&
						(d = d.concat(
							n(e.getElementsByTagName("*"))
						));
				});
			for (; (r = d[l++]); )
				C(r) && (!s || K(r, s)) && e(r, l) && a.push(r);
			return a;
		};
	},
	D = function (e, t) {
		for (var i = e.parentNode; i && i != t; )
			i = i.parentNode;
		return !!i;
	},
	I = {},
	$ = function (t) {
		var n = I[t.query];
		if (n) return n;
		var o = t.infixOper,
			a = o ? o.oper : "",
			s = N(t, { el: 1 }),
			d = "*" == t.tag,
			c = r().getElementsByClassName;
		if (a) {
			var u = { el: 1 };
			d && (u.tag = 1);
			s = N(t, u);
			"+" == a
				? (n = (function (e) {
						return function (t, i, n) {
							for (; (t = t[y]); )
								if (!b || g(t)) {
									(n && !K(t, n)) ||
										!e(t) ||
										i.push(t);
									break;
								}
							return i;
						};
					})(s))
				: "~" == a
				? (n = (function (e) {
						return function (t, i, n) {
							for (var o = t[y]; o; ) {
								if (C(o)) {
									if (n && !K(o, n)) break;
									e(o) && i.push(o);
								}
								o = o[y];
							}
							return i;
						};
					})(s))
				: ">" == a && (n = M(s));
		} else if (t.id) {
			s = !t.loops && d ? h : N(t, { el: 1, id: 1 });
			n = function (n, o) {
				var a = e.byId(t.id, n.ownerDocument || n);
				if (n.ownerDocument && !D(n, n.ownerDocument)) {
					var r =
						11 === n.nodeType ? n.childNodes : [n];
					i.some(r, function (e) {
						var i = M(function (e) {
							return e.id === t.id;
						}, true)(e, []);
						if (i.length) {
							a = i[0];
							return false;
						}
					});
				}
				if (a && s(a))
					return 9 == n.nodeType || D(a, n)
						? m(a, o)
						: undefined;
			};
		} else if (
			c &&
			/\{\s*\[native code\]\s*\}/.test(String(c)) &&
			t.classes.length &&
			!l
		) {
			s = N(t, { el: 1, classes: 1, id: 1 });
			var p = t.classes.join(" ");
			n = function (e, t, i) {
				for (
					var n,
						o = m(0, t),
						a = 0,
						r = e.getElementsByClassName(p);
					(n = r[a++]);

				)
					s(n, e) && K(n, i) && o.push(n);
				return o;
			};
		} else if (d || t.loops) {
			s = N(t, { el: 1, tag: 1, id: 1 });
			n = function (e, i, n) {
				for (
					var o,
						a = m(0, i),
						r = 0,
						l = t.getTag(),
						d = l ? e.getElementsByTagName(l) : [];
					(o = d[r++]);

				)
					s(o, e) && K(o, n) && a.push(o);
				return a;
			};
		} else
			n = function (e, i, n) {
				for (
					var o,
						a = m(0, i),
						s = 0,
						r = t.getTag(),
						l = r ? e.getElementsByTagName(r) : [];
					(o = l[s++]);

				)
					K(o, n) && a.push(o);
				return a;
			};
		return (I[t.query] = n);
	},
	L = {},
	P = {},
	R = function (e) {
		var t = u(a(e));
		if (1 == t.length) {
			var i = $(t[0]);
			return function (e) {
				var t = i(e, []);
				t && (t.nozip = true);
				return t;
			};
		}
		return function (e) {
			return (function (e, t) {
				for (
					var i,
						n,
						o,
						a,
						s = m(e),
						r = t.length,
						l = 0;
					l < r;
					l++
				) {
					a = [];
					i = t[l];
					if (s.length - 1 > 0) {
						o = {};
						a.nozip = true;
					}
					for (var d = $(i), c = 0; (n = s[c]); c++)
						d(n, a, o);
					if (!a.length) break;
					s = a;
				}
				return a;
			})(e, t);
		};
	},
	O = t("ie") ? "commentStrip" : "nozip",
	B = "querySelectorAll",
	H = !!r()[B],
	F = /\\[>~+]|n\+\d|([^ \\])?([>~+])([^ =])?/g,
	z = function (e, t, i, n) {
		return i
			? (t ? t + " " : "") + i + (n ? " " + n : "")
			: e;
	},
	q = /([^[]*)([^\]]*])?/g,
	W = function (e, t, i) {
		return t.replace(F, z) + (i || "");
	},
	U = function (e, i) {
		e = e.replace(q, W);
		if (H) {
			var n = P[e];
			if (n && !i) return n;
		}
		var o = L[e];
		if (o) return o;
		var a = e.charAt(0),
			s = -1 == e.indexOf(" ");
		e.indexOf("#") >= 0 && s && (i = true);
		if (
			H &&
			!i &&
			-1 == d.indexOf(a) &&
			(!t("ie") || -1 == e.indexOf(":")) &&
			!(l && e.indexOf(".") >= 0) &&
			-1 == e.indexOf(":contains") &&
			-1 == e.indexOf(":checked") &&
			-1 == e.indexOf("|=")
		) {
			var r =
				d.indexOf(e.charAt(e.length - 1)) >= 0
					? e + " *"
					: e;
			return (P[e] = function (t) {
				if (9 == t.nodeType || s)
					try {
						var i = t[B](r);
						i[O] = true;
						return i;
					} catch (n) {}
				return U(e, true)(t);
			});
		}
		var c = e.match(
			/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g
		);
		return (L[e] =
			c.length < 2
				? R(e)
				: function (e) {
						for (
							var t, i = 0, n = [];
							(t = c[i++]);

						)
							n = n.concat(R(t)(e));
						return n;
					});
	},
	V = 0,
	G = t("ie")
		? function (e) {
				return c
					? e.getAttribute("_uid") ||
							e.setAttribute("_uid", ++V) ||
							V
					: e.uniqueID;
			}
		: function (e) {
				return e._uid || (e._uid = ++V);
			},
	K = function (e, t) {
		if (!t) return 1;
		var i = G(e);
		return t[i] ? 0 : (t[i] = 1);
	},
	Y = "_zipIdx",
	Z = function (e, i) {
		var n = (i = i || r()).ownerDocument || i;
		c = "div" === n.createElement("div").tagName;
		var o = U(e)(i);
		return o && o.nozip
			? o
			: (function (e) {
					if (e && e.nozip) return e;
					if (!e || !e.length) return [];
					if (e.length < 2) return [e[0]];
					var i,
						n,
						o = [];
					V++;
					if (t("ie") && c) {
						var a = V + "";
						for (i = 0; i < e.length; i++)
							if (
								(n = e[i]) &&
								n.getAttribute(Y) != a
							) {
								o.push(n);
								n.setAttribute(Y, a);
							}
					} else if (t("ie") && e.commentStrip)
						try {
							for (i = 0; i < e.length; i++)
								(n = e[i]) && g(n) && o.push(n);
						} catch (s) {}
					else
						for (i = 0; i < e.length; i++)
							if ((n = e[i]) && n[Y] != V) {
								o.push(n);
								n[Y] = V;
							}
					return o;
				})(o);
	};
Z.filter = function (t, n, o) {
	for (
		var a,
			s = [],
			r = u(n),
			l =
				1 != r.length || /[^\w#\.]/.test(n)
					? function (t) {
							return (
								-1 !=
								i.indexOf(Z(n, e.byId(o)), t)
							);
						}
					: N(r[0]),
			d = 0;
		(a = t[d]);
		d++
	)
		l(a) && s.push(a);
	return s;
};

interface AcmeQueryEngine {
	<T extends Node>(query: string, root?: Node | string): T[];
	filter<T extends Node>(nodeList: T[], filter: string, root?: Node | string): T[];
}

export = Z as AcmeQueryEngine;