// @ts-nocheck

import e = require("./query");
import t = require("./_base/lang");
import i = require("./_base/array");
import n = require("./dom-construct");
import o = require("./dom-attr");
import "./NodeList-dom";

function s(e) {
	for (; e.childNodes[0] && 1 == e.childNodes[0].nodeType; )
		e = e.childNodes[0];
	return e;
}
function r(e, t) {
	"string" == typeof e
		? 11 ==
				(e = n.toDom(e, t && t.ownerDocument))
					.nodeType && (e = e.childNodes[0])
		: 1 == e.nodeType &&
			e.parentNode &&
			(e = e.cloneNode(false));
	return e;
}
t.extend(e.NodeList, {
	_placeMultiple: function (t, i) {
		for (
			var o =
					"string" == typeof t || t.nodeType
						? e(t)
						: t,
				a = [],
				s = 0;
			s < o.length;
			s++
		)
			for (
				var r, l = o[s], d = this.length, c = d - 1;
				(r = this[c]);
				c--
			) {
				if (s > 0) {
					r = this._cloneNode(r);
					a.unshift(r);
				}
				c == d - 1
					? n.place(r, l, i)
					: l.parentNode.insertBefore(r, l);
				l = r;
			}
		if (a.length) {
			a.unshift(0);
			a.unshift(this.length - 1);
			Array.prototype.splice.apply(this, a);
		}
		return this;
	},
	innerHTML: function (e) {
		return arguments.length
			? this.addContent(e, "only")
			: this[0].innerHTML;
	},
	text: function (e) {
		if (arguments.length) {
			for (var t, i = 0; (t = this[i]); i++)
				1 == t.nodeType && o.set(t, "textContent", e);
			return this;
		}
		var n = "";
		for (i = 0; (t = this[i]); i++)
			n += o.get(t, "textContent");
		return n;
	},
	val: function (e) {
		if (arguments.length) {
			for (
				var n, o = t.isArray(e), a = 0;
				(n = this[a]);
				a++
			) {
				var s = n.nodeName.toUpperCase(),
					r = n.type,
					l = o ? e[a] : e;
				if ("SELECT" == s)
					for (
						var d = n.options, c = 0;
						c < d.length;
						c++
					) {
						var h = d[c];
						n.multiple
							? (h.selected =
									-1 != i.indexOf(e, h.value))
							: (h.selected = h.value == l);
					}
				else
					"checkbox" == r || "radio" == r
						? (n.checked = n.value == l)
						: (n.value = l);
			}
			return this;
		}
		if ((n = this[0]) && 1 == n.nodeType) {
			e = n.value || "";
			if (
				"SELECT" == n.nodeName.toUpperCase() &&
				n.multiple
			) {
				e = [];
				d = n.options;
				for (c = 0; c < d.length; c++)
					(h = d[c]).selected && e.push(h.value);
				e.length || (e = null);
			}
			return e;
		}
	},
	append: function (e) {
		return this.addContent(e, "last");
	},
	appendTo: function (e) {
		return this._placeMultiple(e, "last");
	},
	prepend: function (e) {
		return this.addContent(e, "first");
	},
	prependTo: function (e) {
		return this._placeMultiple(e, "first");
	},
	after: function (e) {
		return this.addContent(e, "after");
	},
	insertAfter: function (e) {
		return this._placeMultiple(e, "after");
	},
	before: function (e) {
		return this.addContent(e, "before");
	},
	insertBefore: function (e) {
		return this._placeMultiple(e, "before");
	},
	remove: e.NodeList.prototype.orphan,
	wrap: function (e) {
		if (this[0]) {
			e = r(e, this[0]);
			for (var t, i = 0; (t = this[i]); i++) {
				var n = this._cloneNode(e);
				t.parentNode && t.parentNode.replaceChild(n, t);
				s(n).appendChild(t);
			}
		}
		return this;
	},
	wrapAll: function (e) {
		if (this[0]) {
			e = r(e, this[0]);
			this[0].parentNode.replaceChild(e, this[0]);
			for (var t, i = s(e), n = 0; (t = this[n]); n++)
				i.appendChild(t);
		}
		return this;
	},
	wrapInner: function (e) {
		if (this[0]) {
			e = r(e, this[0]);
			for (var i = 0; i < this.length; i++) {
				var n = this._cloneNode(e);
				this._wrap(
					t._toArray(this[i].childNodes),
					null,
					this._NodeListCtor
				).wrapAll(n);
			}
		}
		return this;
	},
	replaceWith: function (e) {
		e = this._normalize(e, this[0]);
		for (var t, i = 0; (t = this[i]); i++) {
			this._place(e, t, "before", i > 0);
			t.parentNode.removeChild(t);
		}
		return this;
	},
	replaceAll: function (t) {
		for (
			var i,
				n = e(t),
				o = this._normalize(this, this[0]),
				a = 0;
			(i = n[a]);
			a++
		) {
			this._place(o, i, "before", a > 0);
			i.parentNode.removeChild(i);
		}
		return this;
	},
	clone: function () {
		for (var e = [], t = 0; t < this.length; t++)
			e.push(this._cloneNode(this[t]));
		return this._wrap(e, this, this._NodeListCtor);
	},
});
e.NodeList.prototype.html || (e.NodeList.prototype.html = e.NodeList.prototype.innerHTML);

declare global {
	namespace DojoJS
	{
		interface NodeList<T extends Node> {

			/**
			 * private method for inserting queried nodes into all nodes in this NodeList
			 * at different positions. Differs from NodeList.place because it will clone
			 * the nodes in this NodeList if the query matches more than one element.
			 */
			_placeMultiple(query: string | Node | ArrayLike<Node>, position?: PlacePosition): this;
	
			/**
			 * allows setting the innerHTML of each node in the NodeList,
			 * if there is a value passed in, otherwise, reads the innerHTML value of the first node.
			 */
			innerHTML(): string;
			innerHTML(value: string | Node | ArrayLike<Node>): this;
	
			/* if dojo/NodeList-html isn't loaded, this module creates an alias to innerHTML as html.
			  This is stupid and confusing, but likely for backwards compatability, but going to ommit
			  it from the typings, but can be commented out, just to confuse someone */
			/*
			html(): string;
			html(value: string | Node | ArrayLike<Node>): this;
			*/
	
			/**
			 * Allows setting the text value of each node in the NodeList,
			 * if there is a value passed in.  Otherwise, returns the text value for all the
			 * nodes in the NodeList in one string.
			 */
			text(): string;
			text(value: string): this;
	
			/**
			 * If a value is passed, allows setting the value property of form elements in this
			 * NodeList, or properly selecting/checking the right value for radio/checkbox/select
			 * elements. If no value is passed, the value of the first node in this NodeList
			 * is returned.
			 */
			val(): string | string[];
			val(value: string | string[]): this;
	
			/**
			 * appends the content to every node in the NodeList.
			 */
			append(content: string | Node | ArrayLike<Node>): this;
	
			/**
			 * appends nodes in this NodeList to the nodes matched by
			 * the query passed to appendTo.
			 */
			appendTo(query: string): this;
	
			/**
			 * prepends the content to every node in the NodeList.
			 */
			prepend(content: string | Node | ArrayLike<Node>): this;
	
			/**
			 * prepends nodes in this NodeList to the nodes matched by
			 * the query passed to prependTo.
			 */
			prependTo(query: string): this;
	
			/**
			 * Places the content after every node in the NodeList.
			 */
			after(content: string | Node | ArrayLike<Node>): this;
	
			/**
			 * The nodes in this NodeList will be placed after the nodes
			 * matched by the query passed to insertAfter.
			 */
			insertAfter(query: string): this;
	
			/**
			 * Places the content before every node in the NodeList.
			 */
			before(content: string | Node | ArrayLike<Node>): this;
	
			/**
			 * The nodes in this NodeList will be placed after the nodes
			 * matched by the query passed to insertAfter.
			 */
			insertBefore(query: string): this;
	
			/**
			 * alias for dojo/NodeList's orphan method. Removes elements
			 * in this list that match the simple filter from their parents
			 * and returns them as a new NodeList.
			 */
			remove(filter?: string | ((item: T, idx: number, nodeList: this) => boolean)): this;
	
			/**
			 * Wrap each node in the NodeList with html passed to wrap.
			 */
			wrap(html: Node | string): this;
	
			/**
			 * Insert html where the first node in this NodeList lives, then place all
			 * nodes in this NodeList as the child of the html.
			 */
			wrapAll(html: Node | string): this;
	
			/**
			 * For each node in the NodeList, wrap all its children with the passed in html.
			 */
			wrapInner(html: Node | string): this;
	
			/**
			 * Replaces each node in ths NodeList with the content passed to replaceWith.
			 */
			replaceWith<T extends Node>(content: string | Node | ArrayLike<Node>): NodeList<T>;
	
			/**
			 * replaces nodes matched by the query passed to replaceAll with the nodes
			 * in this NodeList.
			 */
			replaceAll(query: string): this;
	
			/**
			 * Clones all the nodes in this NodeList and returns them as a new NodeList.
			 */
			clone(): this;
		}
	}
}

export = e.NodeList;