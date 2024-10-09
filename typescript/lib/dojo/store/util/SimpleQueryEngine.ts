// @ts-nocheck

import e = require("../../_base/array");

function SimpleQueryEngine<O extends DojoJS.QueryOptions>(query: string | Object | Function, options?: O): {
	(array: Object[]): Object[];
	matches(object: Object): boolean;
} {
	switch (typeof query) {
		default:
			throw new Error("Can not query with a " + typeof query);
		case "object":
		case "undefined":
			var n = query;
			query = function (e) {
				for (var t in n) {
					var i = n[t];
					if (i && i.test) {
						if (!i.test(e[t], e)) return false;
					} else if (i != e[t]) return false;
				}
				return true;
			};
			break;
		case "string":
			if (!this[query])
				throw new Error(
					"No filter function " +
						query +
						" was found in store"
				);
			query = this[query];
		case "function":
	}
	function o(n) {
		var o = e.filter(n, query),
			a = options && options.sort;
		a &&
			o.sort(
				"function" == typeof a
					? a
					: function (e, t) {
							for (
								var i, n = 0;
								(i = a[n]);
								n++
							) {
								var o = e[i.attribute],
									s = t[i.attribute];
								if (
									(o =
										null != o
											? o.valueOf()
											: o) !=
									(s =
										null != s
											? s.valueOf()
											: s)
								)
									return !!i.descending ==
										(null == o || o > s)
										? -1
										: 1;
							}
							return 0;
						}
			);
		if (options && (options.start || options.count)) {
			var s = o.length;
			(o = o.slice(
				options.start || 0,
				(options.start || 0) + (options.count || 1 / 0)
			)).total = s;
		}
		return o;
	}
	o.matches = query;
	return o;
};

declare global {
	namespace DojoJS
	{
		interface DojoStoreUtil {
			SimpleQueryEngine: typeof SimpleQueryEngine;
		}

		interface DojoStore {
			util: DojoStoreUtil;
		}

		interface Dojo {
			store: DojoStore;
		}
	}
}

export = SimpleQueryEngine;