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


declare global {
	namespace DojoJS
	{
		interface QueryResults<T extends Object> extends ArrayLike<T> {

			/**
			 * Iterates over the query results, based on
			 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach.
			 * Note that this may executed asynchronously. The callback may be called
			 * after this function returns.
			 */
			forEach(callback: (item: T, id: string | number, results: this) => void, thisObject?: Object): void | this;
		
			/**
			 * Filters the query results, based on
			 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter.
			 * Note that this may executed asynchronously. The callback may be called
			 * after this function returns.
			 */
			filter(callback: (item: T, id: string | number, results: this) => boolean, thisObject?: Object): this;
		
			/**
			 * Maps the query results, based on
			 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map.
			 * Note that this may executed asynchronously. The callback may be called
			 * after this function returns.
			 */
			map<U extends object>(callback: (item: T, id: string | number, results: this) => U, thisObject?: Object): QueryResults<U>;
		
			/**
			 * This registers a callback for when the query is complete, if the query is asynchronous.
			 * This is an optional method, and may not be present for synchronous queries.
			 */
			then?: <U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null) => Promise<U>;
		
			/**
			 * This registers a callback for notification of when data is modified in the query results.
			 * This is an optional method, and is usually provided by dojo/store/Observable.
			 */
			total: number | Promise<number>;
		}

		interface QueryOptions {
			/**
			 * A list of attributes to sort on, as well as direction
			 * For example:
			 * | [{attribute:"price", descending: true}].
			 * If the sort parameter is omitted, then the natural order of the store may be
			 * applied if there is a natural order.
			 */
			sort?: {
				/**
				 * The name of the attribute to sort on.
				 */
				attribute: string;
		
				/**
				 * The direction of the sort.  Default is false.
				 */
				descending?: boolean;
			}[];
		
			/**
			 * The first result to begin iteration on
			 */
			start?: number;
		
			/**
			 * The number of how many results should be returned.
			 */
			count?: number;
		}

		interface DojoStoreUtil {
			QueryResults: QueryResultsFunction;
		}

		interface DojoStore {
			util: DojoStoreUtil;
		}

		interface Dojo {
			store: DojoStore;
		}
	}
}

export = QueryResults;