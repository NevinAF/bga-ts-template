import has = require("./has");

var hasJSON = "undefined" != typeof JSON;
has.add("json-parse", hasJSON);
has.add(
	"json-stringify",
	hasJSON &&
		'{"a":1}' ==
			JSON.stringify({ a: 0 }, function (e, t) {
				return t || 1;
			})
);

var escapeString = function (e: string) {
	return ('"' + e.replace(/(["\\])/g, "\\$1") + '"')
		.replace(/[\f]/g, "\\f")
		.replace(/[\b]/g, "\\b")
		.replace(/[\n]/g, "\\n")
		.replace(/[\t]/g, "\\t")
		.replace(/[\r]/g, "\\r");
};

class DojoJSON {
	/**
	 * Parses a [JSON](http://json.org) string to return a JavaScript object.
	 */
	parse = has("json-parse")
		? JSON.parse
		: (str: string, strict?: boolean): any =>
		{
			if (
				strict &&
				!/^([\s\[\{]*(?:"(?:\\.|[^"])*"|-?\d[\d\.]*(?:[Ee][+-]?\d+)?|null|true|false|)[\s\]\}]*(?:,|:|$))+$/.test(
					str
				)
			)
				throw new SyntaxError(
					"Invalid characters in JSON"
				);
			return eval("(" + str + ")");
		};

	/**
	 * Returns a [JSON](http://json.org) serialization of an object.
	 */
	stringify(e: any, t: any, n: any): string {
		if ("string" == typeof t) {
			n = t;
			t = null;
		}
		return (function e(r, o, i: number | string): string {
			t && (r = t(i, r));
			var a,
				s = typeof r;
			if ("number" == s)
				return isFinite(r) ? r + "" : "null";
			if ("boolean" == s) return r + "";
			if (null === r) return "null";
			if ("string" == typeof r) return escapeString(r);
			if ("function" != s && "undefined" != s) {
				if ("function" == typeof r.toJSON)
					return e(r.toJSON(i), o, i);
				if (r instanceof Date)
					return '"{FullYear}-{Month+}-{Date}T{Hours}:{Minutes}:{Seconds}Z"'.replace(
						/\{(\w+)(\+)?\}/g,
						function (e, t, n) {
							var o =
								(r as Record<string, any>)["getUTC" + t]() + (n ? 1 : 0);
							return o < 10 ? "0" + o : o;
						}
					);
				if (r.valueOf() !== r)
					return e(r.valueOf(), o, i);
				var u = n ? o + n : "",
					c = n ? " " : "",
					l = n ? "\n" : "";
				if (r instanceof Array) {
					var f = r.length,
						d = [];
					for (let i = 0; i < f; i++) {
						"string" !=
							typeof (a = e(r[i], u, i)) &&
							(a = "null");
						d.push(l + u + a);
					}
					return "[" + d.join(",") + l + o + "]";
				}
				var p = [];
				for (let i in r) {
					var h;
					if (r.hasOwnProperty(i)) {
						if ("number" == typeof i)
							h = '"' + i + '"';
						else {
							if ("string" != typeof i) continue;
							h = escapeString(i);
						}
						if (
							"string" !=
							typeof (a = e(r[i], u, i))
						)
							continue;
						p.push(l + u + h + ":" + c + a);
					}
				}
				return "{" + p.join(",") + l + o + "}";
			}
			throw new Error("Invalid value type");
		})(e, "", "");
	}
}

export = has("json-stringify") ? JSON : new DojoJSON();