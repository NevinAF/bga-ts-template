// @ts-nocheck

import e = require("../../_base/lang");

var sorter = {} as Sorter;
e.setObject("dojo.data.util.sorter", sorter);
sorter.basicComparator = function (e, t) {
	var i = -1;
	null === e && (e = undefined);
	null === t && (t = undefined);
	e == t ? (i = 0) : (e > t || null == e) && (i = 1);
	return i;
};
sorter.createSortFunction = function (e, i) {
	var n,
		o = [];
	function a(e, t, i, n) {
		return function (o, a) {
			var s = n.getValue(o, e),
				r = n.getValue(a, e);
			return t * i(s, r);
		};
	}
	for (
		var s = i.comparatorMap, r = sorter.basicComparator, l = 0;
		l < e.length;
		l++
	) {
		var d = (n = e[l]).attribute;
		if (d) {
			var c = n.descending ? -1 : 1,
				h = r;
			if (s) {
				"string" != typeof d &&
					"toString" in d &&
					(d = d.toString());
				h = s[d] || r;
			}
			o.push(a(d, c, h, i));
		}
	}
	return function (e, t) {
		for (var i = 0; i < o.length; ) {
			var n = o[i++](e, t);
			if (0 !== n) return n;
		}
		return 0;
	};
};

interface SortFunction<T> {
	(a: T, b: T): number;
}

interface SortArg {
	attribute: string;
	descending?: boolean;
}

interface LoadItemArgs<T extends Record<string, any>> {
	item?: T;
	onItem?: (item: T) => void;
	onError?: (err: Error) => void;
	scope?: Object;
}

interface FetchArgs<T extends Record<string, any>> {
	query?: Object | string;
	queryOptions?: Object;
	onBegin?: (size: number, request: Request) => void;
	onItem?: (item: T, request: Request) => void;
	onComplete?: (items: T[], request: Request) => void;
	onError?: (errorData: Error, request: Request) => void;
	scope?: Object;
	start?: number;
	count?: number;
	sort?: SortArg[];
}

interface Read<T extends Record<string, any>> {

	/**
	 * Returns a single attribute value.
	 * Returns defaultValue if and only if *item* does not have a value for *attribute*.
	 * Returns null if and only if null was explicitly set as the attribute value.
	 * Returns undefined if and only if the item does not have a value for the
	 * given attribute (which is the same as saying the item does not have the attribute).
	 */
	getValue<U>(item: T, attribute: string, defaultValue?: U): U;

	/**
	 * This getValues() method works just like the getValue() method, but getValues()
	 * always returns an array rather than a single attribute value.  The array
	 * may be empty, may contain a single attribute value, or may contain
	 * many attribute values.
	 * If the item does not have a value for the given attribute, then getValues()
	 * will return an empty array: [].  (So, if store.hasAttribute(item, attribute)
	 * has a return of false, then store.getValues(item, attribute) will return [].)
	 */
	getValues<U>(item: T, attribute: string): U[];

	/**
	 * Returns an array with all the attributes that this item has.  This
	 * method will always return an array; if the item has no attributes
	 * at all, getAttributes() will return an empty array: [].
	 */
	getAttributes(item: T): string[];

	/**
	 * Returns true if the given *item* has a value for the given *attribute*.
	 */
	hasAttribute(item: T, attribute: string): boolean;

	/**
	 * Returns true if the given *value* is one of the values that getValues()
	 * would return.
	 */
	containsValue(item: T, attribute: string, value: any): boolean;

	/**
	 * Returns true if *something* is an item and came from the store instance.
	 * Returns false if *something* is a literal, an item from another store instance,
	 * or is any object other than an item.
	 */
	isItem(something: any): something is T;

	/**
	 * Returns false if isItem(something) is false.  Returns false if
	 * if isItem(something) is true but the the item is not yet loaded
	 * in local memory (for example, if the item has not yet been read
	 * from the server).
	 */
	isItemLoaded(something: any): boolean;

	/**
	 * Given an item, this method loads the item so that a subsequent call
	 * to store.isItemLoaded(item) will return true.  If a call to
	 * isItemLoaded() returns true before loadItem() is even called,
	 * then loadItem() need not do any work at all and will not even invoke
	 * the callback handlers.  So, before invoking this method, check that
	 * the item has not already been loaded.
	 */
	loadItem(keywordArgs: LoadItemArgs<T>): T;

	/**
	 * Given a query and set of defined options, such as a start and count of items to return,
	 * this method executes the query and makes the results available as data items.
	 * The format and expectations of stores is that they operate in a generally asynchronous
	 * manner, therefore callbacks are always used to return items located by the fetch parameters.
	 */
	fetch(keywordArgs: FetchArgs<T>): Request;

	/**
	 * The getFeatures() method returns an simple keyword values object
	 * that specifies what interface features the datastore implements.
	 * A simple CsvStore may be read-only, and the only feature it
	 * implements will be the 'dojo/data/api/Read' interface, so the
	 * getFeatures() method will return an object like this one:
	 * {'dojo.data.api.Read': true}.
	 * A more sophisticated datastore might implement a variety of
	 * interface features, like 'dojo.data.api.Read', 'dojo/data/api/Write',
	 * 'dojo.data.api.Identity', and 'dojo/data/api/Attribution'.
	 */
	getFeatures(): {
		'dojo.data.api.Read'?: boolean;
	};

	/**
	 * The close() method is intended for instructing the store to 'close' out
	 * any information associated with a particular request.
	 */
	close(request?: Request): void;

	/**
	 * Method to inspect the item and return a user-readable 'label' for the item
	 * that provides a general/adequate description of what the item is.
	 */
	getLabel(item: T): string;

	/**
	 * Method to inspect the item and return an array of what attributes of the item were used
	 * to generate its label, if any.
	 */
	getLabelAttributes(item: T): string[];
}

interface Sorter {

	/**
	 * Basic comparison function that compares if an item is greater or less than another item
	 */
	basicComparator: SortFunction<any>;

	/**
	 * Helper function to generate the sorting function based off the list of sort attributes.
	 */
	createSortFunction<T extends Record<string, any>>(attributes: SortArg[], store: Read<T>): SortFunction<T>;
}

declare global {
	namespace DojoJS {
		interface DojoDataUtil {
			sorter: typeof sorter;
		}

		interface DojoData {
			util: DojoDataUtil;
		}

		interface Dojo {
			data: DojoData;
		}

	}
}

export = sorter;