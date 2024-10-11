import "exports";
import dojo = require("./_base/kernel");
import has = require("./sniff");
import r = require("./_base/lang");
import o = require("./dom");
import i = require("./dom-style");
import a = require("./dom-construct");
import s = require("./_base/connect");

class Props {
	private static u: Record<string, Record<string, DojoJS.Handle>> = {};
	private static c = 1;
	private static l = dojo._scopeName + "attrid";

	private static f(e: Element): string {
		for (
			var t, n = "", r = e.childNodes, o = 0;
			(t = r[o]);
			o++
		)
			8 != t.nodeType &&
				(1 == t.nodeType
					? (n += Props.f(t as Element))
					: (n += t.nodeValue));
		return n;
	}

	names: Record<string, string> = {
		class: "className",
		for: "htmlFor",
		tabindex: "tabIndex",
		readonly: "readOnly",
		colspan: "colSpan",
		frameborder: "frameBorder",
		rowspan: "rowSpan",
		textcontent: "textContent",
		valuetype: "valueType",
	};

	/**
	 * Gets a property on an HTML element.
	 * @throws {TypeError} if node is not resolved to an element
	 */
	get<T extends Element, U extends string>(node: T, name: U): U extends keyof T ? T[U] : undefined;
	get(node: string | Element, name: 'textContent' | 'textcontent'): (string | "") | throws<TypeError>;
	get<T extends Element, U extends string>(elmID: string, name: string): (U extends keyof T ? T[U] : any) | throws<TypeError>
	{
		var node = o.byId(elmID)!;
		var lc = name.toLowerCase();
		var prop = this.names[lc] || name;
		if (prop == "textContent" && !has("dom-textContent")) {
			// @ts-ignore - this is text context return
			return Props.f(node);
		}
		// @ts-ignore
		return node[prop];
	}

	/**
	 * Sets a property on an HTML element.
	 * @throws {TypeError} if node is not resolved to an element
	 */
	set<T extends Element, U extends keyof T>(node: T, name: U, value: T[U]): T;
	set<T extends Element, U extends {[K in keyof T]?: T[K]}>(node: T, name: U): T;
	set(node: Element | string, name: string | Record<string, any>, value?: any): Element | throws<TypeError>
	{
		var eNode = o.byId(node)!;
		if (2 == arguments.length && "string" != typeof name) {
			for (let prop in name) {
				this.set(eNode, prop as any, name[prop]);
			}
			return eNode;
		}
		var lc = name.toLowerCase();
		var prop: string = this.names[lc] || name as string;
		if (prop == "style" && "string" != typeof value) {
			i.set(eNode, value);
			return eNode;
		}
		if (prop == "innerHTML") {
			if (
				has("ie") &&
				eNode.tagName.toLowerCase() in
					{
						col: 1,
						colgroup: 1,
						table: 1,
						tbody: 1,
						tfoot: 1,
						thead: 1,
						tr: 1,
						title: 1,
					}
			) {
				a.empty(eNode);
				eNode.appendChild(a.toDom(value, eNode.ownerDocument));
			} else eNode[prop] = value;
			return eNode;
		}
		if (prop == "textContent" && !has("dom-textContent")) {
			a.empty(eNode);
			eNode.appendChild(eNode.ownerDocument.createTextNode(value));
			return eNode;
		}
		if (r.isFunction(value)) {
			var attrId = (eNode as any)[Props.l];
			if (!attrId) {
				attrId = Props.c++;
				(eNode as any)[Props.l] = attrId;
			}
			Props.u[attrId] || (Props.u[attrId] = {});
			var h = Props.u[attrId]![prop];
			if (h) s.disconnect(h);
			else
				try {
					delete (eNode as any)[prop];
				} catch (e) {}
			// @ts-ignore - Prop exists on eNode
			value ? (Props.u[attrId]![prop] = s.connect(eNode, prop, value)) : ((eNode)[prop] = null);
			return eNode;
		}
		(eNode as any)[prop] = value;
		return eNode;
	}
}

export = new Props();