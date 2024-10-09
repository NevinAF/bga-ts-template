// @ts-nocheck

import sniff = require("./sniff");
import window = require("./_base/window");
import dojo = require("./_base/kernel");

if (sniff("ie") <= 7)
	try {
		document.execCommand("BackgroundImageCache", false, true);
	} catch (a) {}
var r = {};
sniff("ie")
	? (r.byId = function (e, n) {
			if ("string" != typeof e) return e || null;
			var r = n || window.doc,
				o = e && r.getElementById(e);
			if (o && (o.attributes.id.value == e || o.id == e))
				return o;
			var i = r.all[e];
			(i && !i.nodeName) || (i = [i]);
			for (var a = 0; (o = i[a++]); )
				if (
					(o.attributes &&
						o.attributes.id &&
						o.attributes.id.value == e) ||
					o.id == e
				)
					return o;
			return null;
		})
	: (r.byId = function (e, n) {
			return (
				("string" == typeof e
					? (n || window.doc).getElementById(e)
					: e) || null
			);
		});
var o = dojo.global.document || null;
sniff.add("dom-contains", !(!o || !o.contains));
r.isDescendant = sniff("dom-contains")
	? function (e, t) {
			return !(
				!(t = r.byId(t)) || !t.contains(r.byId(e))
			);
		}
	: function (e, t) {
			try {
				e = r.byId(e);
				t = r.byId(t);
				for (; e; ) {
					if (e == t) return true;
					e = e.parentNode;
				}
			} catch (a) {}
			return false;
		};
sniff.add("css-user-select", function (e, t, n) {
	if (!n) return false;
	var r = n.style,
		o = ["Khtml", "O", "Moz", "Webkit"],
		i = o.length,
		a = "userSelect";
	do {
		if (undefined !== r[a]) return a;
	} while (i-- && (a = o[i] + "UserSelect"));
	return false;
});
var i = sniff("css-user-select");
r.setSelectable = i
	? function (e, t) {
			r.byId(e).style[i] = t ? "" : "none";
		}
	: function (e, t) {
			var n = (e = r.byId(e)).getElementsByTagName("*"),
				o = n.length;
			if (t) {
				e.removeAttribute("unselectable");
				for (; o--; )
					n[o].removeAttribute("unselectable");
			} else {
				e.setAttribute("unselectable", "on");
				for (; o--; )
					n[o].setAttribute("unselectable", "on");
			}
		};

interface Dom {
	/**
	 * Returns DOM node with matching `id` attribute or falsy value (ex: null or undefined)
	 * if not found. Internally if `id` is not a string then `id` returned.
	 */
	byId(falsy: Falsy, _?: any): null;
	byId<E extends HTMLElement>(id: string, doc?: Document): E | null;
	byId<T>(passthrough: Exclude<T, string>, _?: any): T;
	byId<E extends HTMLElement>(id: string | E, doc?: Document): E | null;
	// Full signature for union type support
	byId<T, E extends HTMLElement>(id_or_any: T, doc?: Document):
		T extends string ? (E | null) :
		T extends Falsy ? null :
		T;

	/**
	 * Returns true if node is a descendant of ancestor
	 */
	isDescendant(node: Node | string, ancestor: Node | string): boolean;

	/**
	 * Enable or disable selection on a node
	 */
	setSelectable(node: Element | string, selectable?: boolean): void;
}

export = r as Dom;