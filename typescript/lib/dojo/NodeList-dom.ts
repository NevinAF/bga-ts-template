// @ts-nocheck

import dojo = require("./_base/kernel");
import t = require("./query");
import n = require("./_base/array");
import r = require("./_base/lang");
import o = require("./dom-class");
import i = require("./dom-construct");
import a = require("./dom-geometry");
import s = require("./dom-attr");
import u = require("./dom-style");

var c = function (e) {
		return 1 == e.length && "string" == typeof e[0];
	},
	l = function (e) {
		var t = e.parentNode;
		t && t.removeChild(e);
	},
	f: typeof t.NodeList = t.NodeList,
	d = f._adaptWithCondition,
	p = f._adaptAsForEach,
	h = f._adaptAsMap;
function g(e) {
	return function (t, n, r) {
		return 2 == arguments.length
			? e["string" == typeof n ? "get" : "set"](t, n)
			: e.set(t, n, r);
	};
}
r.extend(f, {
	_normalize: function (t, n) {
		var o = true === t.parse;
		if ("string" == typeof t.template) {
			var a =
				t.templateFunc ||
				(dojo.string && dojo.string.substitute);
			t = a ? a(t.template, t) : t;
		}
		var s = typeof t;
		"string" == s || "number" == s
			? (t =
					11 ==
					(t = i.toDom(t, n && n.ownerDocument))
						.nodeType
						? r._toArray(t.childNodes)
						: [t])
			: r.isArrayLike(t)
			? r.isArray(t) || (t = r._toArray(t))
			: (t = [t]);
		o && (t._runParse = true);
		return t;
	},
	_cloneNode: function (e: Node) {
		return e.cloneNode(true);
	},
	_place: function (t, n, r, o) {
		if (1 == n.nodeType || "only" != r)
			for (
				var a, s = n, u = t.length, c = u - 1;
				c >= 0;
				c--
			) {
				var l = o ? this._cloneNode(t[c]) : t[c];
				if (t._runParse && dojo.parser && dojo.parser.parse) {
					a ||
						(a =
							s.ownerDocument.createElement(
								"div"
							));
					a.appendChild(l);
					dojo.parser.parse(a);
					l = a.firstChild;
					for (; a.firstChild; )
						a.removeChild(a.firstChild);
				}
				c == u - 1
					? i.place(l, s, r)
					: s.parentNode.insertBefore(l, s);
				s = l;
			}
	},
	position: h(a.position),
	attr: d(g(s), c),
	style: d(g(u), c),
	addClass: p(o.add),
	removeClass: p(o.remove),
	toggleClass: p(o.toggle),
	replaceClass: p(o.replace),
	empty: p(i.empty),
	removeAttr: p(s.remove),
	marginBox: h(a.getMarginBox),
	place: function (e, n) {
		var r = t(e)[0];
		return this.forEach(function (e) {
			i.place(e, r, n);
		});
	},
	orphan: function (e) {
		return (e ? t._filterResult(this, e) : this).forEach(l);
	},
	adopt: function (e, n) {
		return t(e).place(this[0], n)._stash(this);
	},
	query: function (e) {
		if (!e) return this;
		var n = new f();
		this.map(function (r) {
			t(e, r).forEach(function (e) {
				undefined !== e && n.push(e);
			});
		});
		return n._stash(this);
	},
	filter: function (e) {
		var r = arguments,
			o = this,
			i = 0;
		if ("string" == typeof e) {
			o = t._filterResult(this, r[0]);
			if (1 == r.length) return o._stash(this);
			i = 1;
		}
		return this._wrap(n.filter(o, r[i], r[i + 1]), this);
	},
	addContent: function (e, t) {
		e = this._normalize(e, this[0]);
		for (var n, r = 0; (n = this[r]); r++)
			e.length ? this._place(e, n, t, r > 0) : i.empty(n);
		return this;
	},
});

declare global {
	namespace DojoJS
	{
		interface NodeList<T extends Node> extends ArrayLike<T> {
			_normalize(e: any, doc: Document): any;
			_cloneNode(e: Node): Node;
			_place(t: Node[], n: Node, r: string, o: boolean): void;

			/**
			 * Gets the position and size of the passed element relative to
			 * the viewport (if includeScroll==false), or relative to the
			 * document root (if includeScroll==true).
			 */
			position(includeScroll?: boolean): ArrayLike<DomGeometryXYBox> | throws<TypeError>;

			/**
			 * Gets or sets an attribute on an HTML element.
			 */
			attr<U extends string>(name: U): ArrayLike<U extends keyof T ? T[U] : unknown>;
			attr(name: 'textContent' | 'textcontent'): ArrayLike<(string | "")>;
			attr<U extends keyof T>(name: U, value: T[U]): this;
			attr<U extends {[K in keyof T]?: T[K]}>(name: U): this;
			attr(name: string | Record<string, any>, value?: any): this;

			/**
			 * Gets or sets the style of an HTML element.
			 */
			style(): this;
			style<U extends keyof CSSStyleDeclaration>(name: U): ArrayLike<CSSStyleDeclaration[U]>;
			style(props: Partial<CSSStyleDeclaration>): this;
			style(name: 'opacity', value: number): this;
			style<U extends keyof CSSStyleDeclaration>(name: U, value: CSSStyleDeclaration[U]): this;

			/**
			 * Adds the specified class to every node in the list.
			 * @param className The class to add.
			 * @returns This NodeList instance.
			 */
			addClass(className: string | string[]): this;

			/**
			 * Removes the specified class from every node in the list.
			 * @param className The class to remove.
			 * @returns This NodeList instance.
			 */
			removeClass(className: string | string[]): this;

			/**
			 * Toggles the specified class on every node in the list.
			 * @param className The class to toggle.
			 * @returns This NodeList instance.
			 */
			toggleClass(classStr: string | string[], condition?: boolean): this;

			/**
			 * Replaces the specified class on every node in the list.
			 * @param addClass The class to add.
			 * @param removeClass The class to remove.
			 * @returns This NodeList instance.
			 */
			replaceClass(addClassStr: string | string[], removeClassStr?: string | string[]): this;

			/**
			 * Empties every node in the list.
			 * @returns This NodeList instance.
			 */
			empty(): this;

			/**
			 * Removes the specified attribute from every node in the list.
			 * @param name The attribute to remove.
			 * @returns This NodeList instance.
			 */
			removeAttr(name: string): this;

			/**
			 * returns an object that encodes the width, height, left and top
			 * positions of the node's margin box.
			 */
			getMarginBox(node: Element | string, computedStyle?: CSSStyleDeclaration): ArrayLike<DomGeometryBox>;

			/**
			 * Places every node in the list relative to the first node in the list.
			 * @param position The position to place the nodes.
			 * @returns This NodeList instance.
			 */
			place(position: string): this;

			/**
			 * Removes every node in the list from the DOM.
			 * @returns This NodeList instance.
			 */
			orphan(): this;

			/**
			 * Appends every node in the list to the specified node.
			 * @param node The node to append to.
			 * @param position The position to place the nodes.
			 * @returns This NodeList instance.
			 */
			adopt(node: Node, position?: string): this;

			/**
			 * Filters the list of nodes in the NodeList.
			 * @param filter The filter to apply.
			 * @returns This NodeList instance.
			 */
			filter(filter: string | ((node: T, index: number, array: T[]) => boolean), thisArg?: any): this;

			/**
			 * Adds the specified content to every node in the list.
			 * @param content The content to add.
			 * @param position The position to place the content.
			 * @returns This NodeList instance.
			 */
			addContent(content: string | Node, position?: string): this;
			addContent(content: NodeList<Node>, position?: string): this;
			addContent(content: NodeList<Node>[], position?: string): this;
		}
	}
}

export = f;