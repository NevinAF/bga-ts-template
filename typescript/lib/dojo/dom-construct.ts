// @ts-nocheck

import "exports";
import t = require("./_base/kernel");
import n = require("./sniff");
import r = require("./_base/window");
import o = require("./dom");
import i = require("./dom-attr");

var domConstruct: Partial<DomConstruct> = {};

var a,
	s = {
		option: ["select"],
		tbody: ["table"],
		thead: ["table"],
		tfoot: ["table"],
		tr: ["table", "tbody"],
		td: ["table", "tbody", "tr"],
		th: ["table", "thead", "tr"],
		legend: ["fieldset"],
		caption: ["table"],
		colgroup: ["table"],
		col: ["table", "colgroup"],
		li: ["ul"],
	},
	u = /<\s*([\w\:]+)/,
	c = {},
	l = 0,
	f = "__" + t._scopeName + "ToDomId";
for (var d in s)
	if (s.hasOwnProperty(d)) {
		var p = s[d];
		p.pre =
			"option" == d
				? '<select multiple="multiple">'
				: "<" + p.join("><") + ">";
		p.post = "</" + p.reverse().join("></") + ">";
	}
n("ie") <= 8 &&
	(a = function (e) {
		e.__dojo_html5_tested = "yes";
		var t = g(
			"div",
			{
				innerHTML: "<nav>a</nav>",
				style: { visibility: "hidden" },
			},
			e.body
		);
		1 !== t.childNodes.length &&
			"abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".replace(
				/\b\w+\b/g,
				function (t) {
					e.createElement(t);
				}
			);
		v(t);
	});
function h(e, t) {
	var n = t.parentNode;
	n && n.insertBefore(e, t);
}
domConstruct.toDom = function (e, t) {
	var o = (t = t || r.doc)[f];
	if (!o) {
		t[f] = o = ++l + "";
		c[o] = t.createElement("div");
	}
	n("ie") <= 8 && !t.__dojo_html5_tested && t.body && a(t);
	var i,
		d,
		p,
		h,
		g = (e += "").match(u),
		m = g ? g[1].toLowerCase() : "",
		v = c[o];
	if (g && s[m]) {
		i = s[m];
		v.innerHTML = i.pre + e + i.post;
		for (d = i.length; d; --d) v = v.firstChild;
	} else v.innerHTML = e;
	if (1 == v.childNodes.length)
		return v.removeChild(v.firstChild);
	h = t.createDocumentFragment();
	for (; (p = v.firstChild); ) h.appendChild(p);
	return h;
};
domConstruct.place = function (t, n, r) {
	n = o.byId(n);
	"string" == typeof t &&
		(t = /^\s*</.test(t)
			? domConstruct.toDom(t, n.ownerDocument)
			: o.byId(t));
	if ("number" == typeof r) {
		var i = n.childNodes;
		!i.length || i.length <= r
			? n.appendChild(t)
			: h(t, i[r < 0 ? 0 : r]);
	} else
		switch (r) {
			case "before":
				h(t, n);
				break;
			case "after":
				!(function (e, t) {
					var n = t.parentNode;
					n &&
						(n.lastChild == t
							? n.appendChild(e)
							: n.insertBefore(e, t.nextSibling));
				})(t, n);
				break;
			case "replace":
				n.parentNode.replaceChild(t, n);
				break;
			case "only":
				domConstruct.empty(n);
				n.appendChild(t);
				break;
			case "first":
				if (n.firstChild) {
					h(t, n.firstChild);
					break;
				}
			default:
				n.appendChild(t);
		}
	return t;
};
var g = (domConstruct.create = function (t, n, a, s) {
	var u = r.doc;
	a && (u = (a = o.byId(a)).ownerDocument);
	"string" == typeof t && (t = u.createElement(t));
	n && i.set(t, n);
	a && domConstruct.place(t, a, s);
	return t;
});
function m(e) {
	if ("innerHTML" in e)
		try {
			e.innerHTML = "";
			return;
		} catch (n) {}
	for (var t; (t = e.lastChild); ) e.removeChild(t);
}
domConstruct.empty = function (e) {
	m(o.byId(e));
};
var v = (domConstruct.destroy = function (e) {
	(e = o.byId(e)) &&
		(function (e, t) {
			e.firstChild && m(e);
			t &&
				(n("ie") &&
				t.canHaveChildren &&
				"removeNode" in e
					? e.removeNode(false)
					: t.removeChild(e));
		})(e, e.parentNode);
});

interface DomConstruct {

	/**
	 * instantiates an HTML fragment returning the corresponding DOM.
	 */
	toDom(frag: string, doc?: Document): DocumentFragment | Node;

	/**
	 * Attempt to insert node into the DOM, choosing from various positioning options.
	 * Returns the first argument resolved to a DOM node.
	 */
	place(node: Node | string | DocumentFragment, refNode: Node | string, position?: DojoJS.PlacePosition): HTMLElement;

	/**
	 * Create an element, allowing for optional attribute decoration
	 * and placement.
	 */
	create(tag: Node | string, attrs?: Record<string, any>, refNode?: Node | string, pos?: DojoJS.PlacePosition): HTMLElement;

	/**
	 * safely removes all children of the node.
	 */
	empty(node: Node | string): void;

	/**
	 * Removes a node from its parent, clobbering it and all of its
	 * children.
	 */
	destroy(node: Node | string): void;
}

declare global {
	declare namespace DojoJS {
		type PlacePosition = 'first' | 'after' | 'before' | 'last' | 'replace' | 'only' | number;
	}
}

export = domConstruct as DomConstruct;