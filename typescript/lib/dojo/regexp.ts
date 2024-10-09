import dojo = require("./_base/kernel");
import t = require("./_base/lang");

var regexp = {} as DojoJS.RegExpModule;
t.setObject("dojo.regexp", regexp);
regexp.escapeString = function (e, t) {
	return e.replace(
		/([\.$?*|{}\(\)\[\]\\\/\+\-^])/g,
		function (e) {
			return t && -1 != t.indexOf(e) ? e : "\\" + e;
		}
	);
};
regexp.buildGroupRE = function (e, t, n) {
	if (!(e instanceof Array)) return t(e);
	for (var o = [], a = 0; a < e.length; a++) o.push(t(e[a]));
	return regexp.group(o.join("|"), n);
};
regexp.group = function (e, t) {
	return "(" + (t ? "?:" : "") + e + ")";
};

declare global {
	namespace DojoJS
	{
		interface RegExpModule {
			/**
			 * Adds escape sequences for special characters in regular expressions
			 */
			escapeString(str: string, except?: string): string;
	
			/**
			 * Builds a regular expression that groups subexpressions
			 */
			buildGroupRE(arr: any[] | Object, re: (item: any) => string, nonCapture?: boolean): string;
	
			/**
			 * adds group match to expression
			 */
			group(expression: string, nonCapture?: boolean): string;
		}

		interface Dojo {
			regexp: typeof regexp;
		}
	}
}

export = regexp;