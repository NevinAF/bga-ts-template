
// @ts-nocheck

import array = require("dojo/_base/array");
import dom = require("dojo/dom");
import domAttr = require("dojo/dom-attr");
import domStyle = require("dojo/dom-style");
import lang = require("dojo/_base/lang");
import has = require("dojo/sniff");
import dijit = require("./main");

var r,
	a11y = {
		_isElementShown: function (e) {
			var t = domStyle.get(e);
			return (
				"hidden" != t.visibility &&
				"collapsed" != t.visibility &&
				"none" != t.display &&
				"hidden" != domAttr.get(e, "type")
			);
		},
		hasDefaultTabStop: function (e) {
			switch (e.nodeName.toLowerCase()) {
				case "a":
					return domAttr.has(e, "href");
				case "area":
				case "button":
				case "input":
				case "object":
				case "select":
				case "textarea":
					return true;
				case "iframe":
					var t;
					try {
						var n = e.contentDocument;
						if (
							"designMode" in n &&
							"on" == n.designMode
						)
							return true;
						t = n.body;
					} catch (o) {
						try {
							t = e.contentWindow.document.body;
						} catch (a) {
							return false;
						}
					}
					return (
						t &&
						("true" == t.contentEditable ||
							(t.firstChild &&
								"true" ==
									t.firstChild
										.contentEditable))
					);
				default:
					return "true" == e.contentEditable;
			}
		},
		effectiveTabIndex: function (e) {
			return domAttr.get(e, "disabled")
				? r
				: domAttr.has(e, "tabIndex")
				? +domAttr.get(e, "tabIndex")
				: a11y.hasDefaultTabStop(e)
				? 0
				: r;
		},
		isTabNavigable: function (e) {
			return a11y.effectiveTabIndex(e) >= 0;
		},
		isFocusable: function (e) {
			return a11y.effectiveTabIndex(e) >= -1;
		},
		_getTabNavigable: function (e) {
			var t,
				n,
				o,
				s,
				r,
				d,
				c = {};
			function h(e) {
				return (
					e &&
					"input" == e.tagName.toLowerCase() &&
					e.type &&
					"radio" == e.type.toLowerCase() &&
					e.name &&
					e.name.toLowerCase()
				);
			}
			var u = a11y._isElementShown,
				p = a11y.effectiveTabIndex,
				m = function (e) {
					for (
						var l = e.firstChild;
						l;
						l = l.nextSibling
					)
						if (
							!(
								1 != l.nodeType ||
								(has("ie") <= 9 &&
									"HTML" !== l.scopeName)
							) &&
							u(l)
						) {
							var g = p(l);
							if (g >= 0) {
								if (0 == g) {
									t || (t = l);
									n = l;
								} else if (g > 0) {
									if (!o || g < s) {
										s = g;
										o = l;
									}
									if (!r || g >= d) {
										d = g;
										r = l;
									}
								}
								var f = h(l);
								domAttr.get(l, "checked") &&
									f &&
									(c[f] = l);
							}
							"SELECT" !=
								l.nodeName.toUpperCase() &&
								m(l);
						}
				};
			u(e) && m(e);
			function g(e) {
				return c[h(e)] || e;
			}
			return {
				first: g(t),
				last: g(n),
				lowest: g(o),
				highest: g(r),
			};
		},
		getFirstInTabbingOrder: function (e, i) {
			var n = a11y._getTabNavigable(dom.byId(e, i));
			return n.lowest ? n.lowest : n.first;
		},
		getLastInTabbingOrder: function (e, i) {
			var n = a11y._getTabNavigable(dom.byId(e, i));
			return n.last ? n.last : n.highest;
		},
	};

type A11y = typeof a11y;

declare global {
	namespace DojoJS {
		interface Dijit extends A11y {}
	}
}

lang.mixin(dijit, a11y);
export = a11y; // 