import e = require("./_base/lang");

class IoQuery {
	private static t: Record<string, any> = {};

	/**
	 * takes a name/value mapping object and returns a string representing
	 * a URL-encoded version of that object.
	 */
	objectToQuery(n: Record<string, any>): string {
		var r = encodeURIComponent,
			o = [];
		for (var i in n) {
			var a = n[i];
			if (a != IoQuery.t[i]) {
				var s = r(i) + "=";
				if (e.isArray(a))
					for (var u = 0, c = a.length; u < c; ++u)
						o.push(s + r(a[u]));
				else o.push(s + r(a));
			}
		}
		return o.join("&");
	}

	/**
	 * Create an object representing a de-serialized query section of a URL.
	 */
	queryToObject(t: string): Record<string, any>
	{
		var s: Record<string, any> = {};
		for (
			let n,
				r,
				o,
				i = decodeURIComponent,
				a = t.split("&"),
				u = 0,
				c = a.length;
			u < c;
			++u
		)
			if ((o = a[u]!).length) {
				var l = o.indexOf("=");
				if (l < 0) {
					n = i(o);
					r = "";
				} else {
					n = i(o.slice(0, l));
					r = i(o.slice(l + 1));
				}
				"string" == typeof s[n] && (s[n] = [s[n]]);
				e.isArray(s[n]) ? s[n].push(r) : (s[n] = r);
			}
		return s;
	}
}

export = new IoQuery();