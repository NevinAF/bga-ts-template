import lang = require("dojo/_base/lang");
import has = require("dojo/_base/sniff");

lang.getObject("dojox.string", true).tokenize;
function tokenize(e: any, i: any, n: any, o: any): any {
	for (var a, s, r = [], l = 0; (a = i.exec(e)); ) {
		(s = e.slice(l, i.lastIndex - a[0].length)).length &&
			r.push(s);
		if (n) {
			if (has("opera")) {
				for (var d = a.slice(0); d.length < a.length; )
					d.push(null);
				a = d;
			}
			var c: any = n.apply(o, a.slice(1).concat(r.length));
			undefined !== c && r.push(c);
		}
		l = i.lastIndex;
	}
	(s = e.slice(l)).length && r.push(s);
	return r;
};

declare global {
	namespace DojoJS
	{
		interface Dojox_String {
		}
		interface Dojox {
			string: Dojox_String;
		}
		var dojox: Dojox;
	}
}

export = tokenize;