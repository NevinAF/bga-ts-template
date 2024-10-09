declare global {
	namespace DojoJS
	{
		interface Has {
			/**
			 * Return the current value of the named feature.
			 * @param {string | number} name The name (if a string) or identifier (if an integer) of the feature to test.
			 */
			(name: string | number): any;
			(name: 'host-browser'): boolean;
			(name: 'host-node'): any;
			(name: 'host-rhino'): boolean;
			(name: 'dom'): boolean;
			(name: 'dojo-dom-ready-api'): 1;
			(name: 'dojo-sniff'): 1;
			// if host-browser is true
			(name: 'dom-addeventlistener'): void | boolean;
			(name: 'touch'): void | boolean;
			(name: 'touch-events'): void | boolean;
			(name: 'pointer-events'): void | boolean;
			(name: 'MSPointer'): void | boolean;
			(name: 'device-width'): void | number;
			(name: 'dom-attributes-explicit'): void | boolean;
			(name: 'dom-attributes-specified-flag'): void | boolean;
			// dojo/_base/browser
			(name: 'config-selectorEngine'): string;

			cache: Record<string, any>;

			/**
			 * Register a new feature test for some named feature.
			 */
			add(name: string | number, test: (global: Window & typeof globalThis, doc?: Document, element?: Element) => any, now?: boolean, force?: boolean): any;
			add<T extends (Object | string | number | boolean | null | void)>(name: string | number, test: T, now?: boolean, force?: boolean): any;

			/**
			 * Deletes the contents of the element passed to test functions.
			 */
			clearElement(element: HTMLElement): HTMLElement;

			/**
			 * Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
			 */
			normalize(id: string, toAbsMid: Function): string; /* WIP: Align with loader api */

			/**
			 * Conditional loading of AMD modules based on a has feature test value.
			 */
			load(id: string, parentRequire: Function, loaded: Function): void; /* WIP: Align with loader api */
		}
	}
}

import e = require("./global");
import t = require("require");
import n = require("module");

var r = t.has || function () {};
r.add("dom-addeventlistener", !!document.addEventListener);
r.add(
	"touch",
	"ontouchstart" in document ||
		("onpointerdown" in document &&
			navigator.maxTouchPoints > 0) ||
			// @ts-ignore - msMaxTouchPoints is not defined on Navigator
		window.navigator.msMaxTouchPoints
);
r.add("touch-events", "ontouchstart" in document);
r.add(
	"pointer-events",
	("pointerEnabled" in window.navigator
		? window.navigator.pointerEnabled
		: "PointerEvent" in window) as boolean
);
// @ts-ignore - msPointerEnabled is not defined on Navigator
r.add("MSPointer", window.navigator.msPointerEnabled);
r.add("touch-action", r("touch") && r("pointer-events"));
r.add("device-width", screen.availWidth || innerWidth);
var o = document.createElement("form");
r.add("dom-attributes-explicit", 0 == o.attributes.length);
r.add(
	"dom-attributes-specified-flag",
	o.attributes.length > 0 && o.attributes.length < 40
);

r.clearElement = function (e) {
	e.innerHTML = "";
	return e;
};
r.normalize = function (e, t) {
	var n = e.match(/[\?:]|[^:\?]*/g)!,
		o = 0,
		i = function (e?: boolean): any {
			var t = n[o++]!;
			if (":" == t) return 0;
			if ("?" == n[o++]) {
				if (!e && r(t)) return i();
				i(true);
				return i(e);
			}
			return t || 0;
		};
	return (e = i()) && t(e);
};
r.load = function (e, t, n) {
	e ? t([e], n) : n();
};

export = r;
