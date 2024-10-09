// @ts-nocheck

import dojo = require("./kernel");
import lang = require("./lang");
import sniff = require("../sniff");

var r = {
	global: dojo.global,
	doc: dojo.global.document || null,
	body: function (t) {
		return (
			(t = t || dojo.doc).body ||
			t.getElementsByTagName("body")[0]
		);
	},
	setContext: function (t, n) {
		dojo.global = r.global = t;
		dojo.doc = r.doc = n;
	},
	withGlobal: function (t, n, o, i) {
		var a = dojo.global;
		try {
			dojo.global = r.global = t;
			return r.withDoc.call(null, t.document, n, o, i);
		} finally {
			dojo.global = r.global = a;
		}
	},
	withDoc: function (t, o, i, a) {
		var s,
			u,
			c,
			l = r.doc,
			f = sniff("quirks"),
			d = sniff("ie");
		try {
			dojo.doc = r.doc = t;
			dojo.isQuirks = sniff.add(
				"quirks",
				"BackCompat" == dojo.doc.compatMode,
				true,
				true
			);
			if (
				sniff("ie") &&
				(c = t.parentWindow) &&
				c.navigator
			) {
				s =
					parseFloat(
						c.navigator.appVersion.split("MSIE ")[1]
					) || undefined;
				(u = t.documentMode) &&
					5 != u &&
					Math.floor(s) != u &&
					(s = u);
				dojo.isIE = sniff.add("ie", s, true, true);
			}
			i && "string" == typeof o && (o = i[o]);
			return o.apply(i, a || []);
		} finally {
			dojo.doc = r.doc = l;
			dojo.isQuirks = sniff.add("quirks", f, true, true);
			dojo.isIE = sniff.add("ie", d, true, true);
		}
	},
};

declare global {
	namespace DojoJS
	{
		interface Dojo {

			/**
			 * Alias for the current document. 'doc' can be modified
			 * for temporary context shifting. See also withDoc().
			 */
			doc: Document;

			/**
			 * Return the body element of the specified document or of dojo/_base/window::doc.
			 */
			body(doc?: Document): HTMLBodyElement;

			/**
			 * changes the behavior of many core Dojo functions that deal with
			 * namespace and DOM lookup, changing them to work in a new global
			 * context (e.g., an iframe). The varibles dojo.global and dojo.doc
			 * are modified as a result of calling this function and the result of
			 * `dojo.body()` likewise differs.
			 */
			setContext(globalObject: Record<string, any>, globalDocument: Document): void;

			/**
			 * Invoke callback with globalObject as dojo.global and
			 * globalObject.document as dojo.doc.
			 */
			withGlobal<T>(globalObject: Record<string, any>, callback: (...args: any[]) => T, thisObject?: Object, cbArguments?: any[]): T;

			/**
			 * Invoke callback with documentObject as dojo/_base/window::doc.
			 */
			withDoc<T>(documentObject: Document, callback: (...args: any[]) => T, thisObject?: Object, cbArguments?: any[]): T;
		}
	}
}


lang.mixin(dojo, r);
export = dojo; // this is the same as returning lang or the result of the mixin.