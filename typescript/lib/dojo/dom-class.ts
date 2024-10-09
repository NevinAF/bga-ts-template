// @ts-nocheck

import lang = require("./_base/lang");
import t = require("./_base/array");
import n = require("./dom");

var o = "className",
	i = /\s+/,
	a = [""];
function s(e) {
	if ("string" == typeof e || e instanceof String) {
		if (e && !i.test(e)) {
			a[0] = e;
			return a;
		}
		var n = e.split(i);
		n.length && !n[0] && n.shift();
		n.length && !n[n.length - 1] && n.pop();
		return n;
	}
	return e
		? t.filter(e, function (e) {
				return e;
			})
		: [];
}
var u = {};
var r: DojoJS.DomClass = {
	contains: function (e, t) {
		return (
			(" " + n.byId(e)[o] + " ").indexOf(" " + t + " ") >=
			0
		);
	},
	add: function (e, t) {
		e = n.byId(e);
		t = s(t);
		var r,
			i = e[o];
		r = (i = i ? " " + i + " " : " ").length;
		for (var a, u = 0, c = t.length; u < c; ++u)
			(a = t[u]) &&
				i.indexOf(" " + a + " ") < 0 &&
				(i += a + " ");
		r < i.length && (e[o] = i.substr(1, i.length - 2));
	},
	remove: function (t, r) {
		t = n.byId(t);
		var i;
		if (undefined !== r) {
			r = s(r);
			i = " " + t[o] + " ";
			for (var a = 0, u = r.length; a < u; ++a)
				i = i.replace(" " + r[a] + " ", " ");
			i = lang.trim(i);
		} else i = "";
		t[o] != i && (t[o] = i);
	},
	replace: function (e, t, i) {
		e = n.byId(e);
		u[o] = e[o];
		r.remove(u, i);
		r.add(u, t);
		e[o] !== u[o] && (e[o] = u[o]);
	},
	toggle: function (e, t, o) {
		e = n.byId(e);
		if (undefined === o)
			for (
				var i, a = 0, u = (t = s(t)).length;
				a < u;
				++a
			) {
				i = t[a];
				r[r.contains(e, i) ? "remove" : "add"](e, i);
			}
		else r[o ? "add" : "remove"](e, t);
		return o;
	},
};

declare global {
	namespace DojoJS
	{
		interface DomClass {
			/**
			 * Returns whether or not the specified classes are a portion of the
			 * class list currently applied to the node.
			 */
			contains(node: Node | string, classStr: string): boolean;
	
			/**
			 * Adds the specified classes to the end of the class list on the
			 * passed node. Will not re-apply duplicate classes.
			 */
			add(node: Node | string, classStr: string | string[]): void;
	
			/**
			 * Removes the specified classes from node. No `contains()`
			 * check is required.
			 */
			remove(node: Node | string, classStr?: string | string[]): void;
	
			/**
			 * Replaces one or more classes on a node if not present.
			 * Operates more quickly than calling dojo.removeClass and dojo.addClass
			 */
			replace(node: Node | string, addClassStr: string | string[], removeClassStr?: string | string[]): void;
	
			/**
			 * Adds a class to node if not present, or removes if present.
			 * Pass a boolean condition if you want to explicitly add or remove.
			 * Returns the condition that was specified directly or indirectly.
			 */
			toggle(node: Node | string, classStr: string | string[], condition?: boolean): boolean;
		}
	}
}

export = r;