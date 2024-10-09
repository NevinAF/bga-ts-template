import e = require("exports");
import t = require("./sniff");
import n = require("./_base/lang");
import r = require("./dom");
import o = require("./dom-style");
import prop = require("./dom-prop");

class Attr {
	private static a: Record<string, 0 | 1> = {
		innerHTML: 1,
		textContent: 1,
		className: 1,
		htmlFor: t("ie") ? 1 : 0,
		value: 1,
	};
	
	private static s: Record<string, string> = {
		classname: "class",
		htmlfor: "for",
		tabindex: "tabIndex",
		readonly: "readOnly",
	};

	private static u(e: Element, t: string): boolean {
		var n = e.getAttributeNode && e.getAttributeNode(t);
		return !!n && n.specified;
	}

	/**
	 * Returns true if the requested attribute is specified on the given element, and false otherwise.
	 * @throws {TypeError} if node is not resolved to an element
	 */
	has(node: Element | string, name: string): boolean | throws<TypeError> {
		var n = name.toLowerCase();
		return !!Attr.a[prop.names[n] || name] || Attr.u(r.byId(node)!, Attr.s[n] || name);
	}

	/**
	 * Gets the value of the named property from the provided element.
	 * @throws {TypeError} if node is not resolved to an element
	 */
	get<T extends Element, U extends string>(node: T, name: U): U extends keyof T ? T[U] : unknown;
	get(node: string | Element, name: 'textContent' | 'textcontent'): (string | "") | throws<TypeError>;
	get<T extends Element, U extends string>(elmID: string, name: string): (U extends keyof T ? T[U] : any) | throws<TypeError>
	{
		var node = r.byId(elmID) as Record<string, any> & Element;
		var lc = name.toLowerCase();
		var propName: string = prop.names[lc] || name;
		if (Attr.a[propName] && node[propName] !== undefined) {
			return node[propName];
		}
		if (propName == "textContent") {
			// @ts-ignore - this is text context return
			return prop.get(node, propName);
		}
		if (typeof node[propName] == "boolean" || n.isFunction(node[propName])) {
			return node[propName];
		}
		var attr = Attr.s[lc] || name;
		// @ts-ignore
		return Attr.u(node, attr) ? node.getAttribute(attr) : null;
	}

	/**
	 * Sets the value of a property on an HTML element.
	 * @throws {TypeError} if node is not resolved to an element
	 */
	set<T extends Element, U extends keyof T>(node: T, name: U, value: T[U]): T;
	set<T extends Element, U extends {[K in keyof T]?: T[K]}>(node: T, name: U): T;
	set<T extends Element>(node: T | string, name: string | Record<string, any>, value?: any): T | throws<TypeError>
	{
		var eNode = r.byId(node)!;
		if (2 == arguments.length && "string" != typeof name) {
			for (let prop in name) {
				this.set(eNode as any, prop, name[prop]);
			}
			// @ts-ignore
			return eNode;
		}
		name = name as string;
		var lc = name.toLowerCase();
		var propName = prop.names[lc] || name;
		if (Attr.a[propName] || typeof value == "boolean" || n.isFunction(value)) {
			return prop.set(eNode as any, name, value);
		}
		eNode.setAttribute(Attr.s[lc] || name, value);
		// @ts-ignore
		return eNode;
	}

	/**
	 * Removes an attribute from an HTML element.
	 * @throws {TypeError} if node is not resolved to an element
	 */
	remove(node: Element | string, name: string): void | throws<TypeError>
	{
		r.byId(node)!.removeAttribute(prop.names[name.toLowerCase()] || name);
	}

	/**
	 * Returns the value of a property on an HTML element.
	 * @throws {TypeError} if node is not resolved to an element
	 */
	getNodeProp(node: Element | string, name: string): any | throws<TypeError>
	{
		node = r.byId(node)!;
		var lc = name.toLowerCase();
		var propName = prop.names[lc] || name;
		if (propName in node && propName != "href") {
			return (node as any)[propName];
		}
		var attr = Attr.s[lc] || name;
		return Attr.u(node, attr) ? node.getAttribute(attr) : null;
	}
}

export = new Attr();