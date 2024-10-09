import dojo = require("./kernel");
import json = require("../json");

dojo.fromJson = function (js) {
	return eval("(" + js + ")");
};
dojo._escapeString = json.stringify;
dojo.toJsonIndentStr = "\t";
dojo.toJson = function (e, t) {
	return json.stringify(
		e,
		function (e: any, t: any) {
			if (t) {
				var n = t.__json__ || t.json;
				if ("function" == typeof n) return n.call(t);
			}
			return t;
		},
		t && dojo.toJsonIndentStr
	);
};

declare global {
	namespace DojoJS
	{
		interface Dojo {
			fromJson<T>(js: string): T;
			_escapeString: (arg0: any, arg1: any, arg2: any) => string;
			toJsonIndentStr: string;
			toJson(e: any, t?: any): string;
		}
	}
}

export = dojo;