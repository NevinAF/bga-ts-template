// @ts-nocheck

import e = require("../../_base/array");
import t = require("../../_base/lang");
import i = require("../../when");

var QueryResults = function (o) {
	if (!o) return o;
	var a = !!o.then;
	a && (o = t.delegate(o));
	function s(t) {
		o[t] = function () {
			var s = arguments,
				r = i(o, function (i) {
					Array.prototype.unshift.call(s, i);
					return QueryResults(e[t].apply(e, s));
				});
			if ("forEach" !== t || a) return r;
		};
	}
	s("forEach");
	s("filter");
	s("map");
	null == o.total &&
		(o.total = i(o, function (e) {
			return e.length;
		}));
	return o;
} as QueryResultsFunction;
t.setObject("dojo.store.util.QueryResults", QueryResults);

interface QueryResultsFunction {
	/**
	 * A function that wraps the results of a store query with additional
	 * methods.
	 */
	<T extends Object>(results: T[]): DojoJS.QueryResults<T>;
}

export = QueryResults;