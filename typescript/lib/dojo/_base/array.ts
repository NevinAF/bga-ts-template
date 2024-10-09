import dojo = require("./kernel");
import has = require("../has");
import lang = require("./lang");
// lang == dojo

/**
 * This contains functions similar to Array.prototype, but also caches the functions for performance. Modern code should not be used over standard Array.prototype functions.
 */
class DojoArray {
	private static cache: Record<string, Function> = {};
	private static pushCache(e: string): Function {
		return (DojoArray.cache[e] = new Function("item", "index", "array", e));
	}

	/**
	 * Determines whether or not every item in arr satisfies the condition implemented by callback.
	 * @param {T[] | string} arr the array to iterate on. If a string, operates on individual characters.
	 * @param {Function | string} callback a  function is invoked with three arguments: item, index, and
	 *                                     array and returns true if the condition is met.
	 * @param {object} thisObj may be used to scope the call to callback
	 */
	every<T, U extends ((item: T, idx: number, arr: T[]) => boolean) | string, V extends (U extends keyof V ? { [k in U]: ((item: T, idx: number, arr: T[]) => boolean) } : never)>(arr: T[] | string, callback: U, thisObj?: V): boolean {
		var s;
		var u = 0;
		var c = (arr && arr.length) || 0;
		// @ts-ignore - array is changed to a string array
		c && "string" == typeof arr && (arr = arr.split(""));
		"string" == typeof callback && (callback = DojoArray.cache[callback as string] as any || DojoArray.pushCache(callback));
		if (thisObj)
			for (; u < c; ++u) {
				s = !(callback as Function).call(thisObj, arr[u], u, arr);
				if (s) return true;
			}
		else
			for (; u < c; ++u) {
				s = !(callback as Function)(arr[u], u, arr);
				if (s) return true;
			}
		return false;
	}

	/**
	 * Determines whether or not any item in arr satisfies the condition implemented by callback.
	 */
	some<T, U extends ((item: T, idx: number, arr: T[]) => boolean) | string, V extends (U extends keyof V ? { [k in U]: ((item: T, idx: number, arr: T[]) => boolean) } : never)>(arr: T[] | string, callback: U, thisObj?: V): boolean
	{
		var s;
		var u = 0;
		var c = (arr && arr.length) || 0;
		// @ts-ignore - array is changed to a string array
		c && "string" == typeof arr && (arr = arr.split(""));
		"string" == typeof callback && (callback = DojoArray.cache[callback as string] as any || DojoArray.pushCache(callback));
		if (thisObj)
			for (; u < c; ++u) {
				s = (callback as Function).call(thisObj, arr[u], u, arr);
				if (s) return true;
			}
		else
			for (; u < c; ++u) {
				s = (callback as Function)(arr[u], u, arr);
				if (s) return true;
			}
		return false;
	}

	/**
	 * locates the last index of the provided value in the passed array. If the value is not found, -1
	 * is returned.
	 * @param {boolean} findLast Makes indexOf() work like lastIndexOf().  Used internally; not meant
	 *                           for external usage.
	 */
	indexOf<T>(arr: T[] | string, value: T, fromIndex?: number, findLast?: boolean): number
	{
		var t = 1;
		var n = 0;
		var r = 0;
		if (!findLast) t = n = r = -1;
		if (fromIndex && t > 0) return this.lastIndexOf(arr, value, fromIndex);
		var o;
		var i = (arr && arr.length) || 0;
		var a = findLast ? i + r : n;
		undefined === fromIndex
			? (o = findLast ? n : i + r)
			: fromIndex < 0
			? (o = i + fromIndex) < 0 && (o = n)
			: (o = fromIndex >= i ? i + r : fromIndex);
		// @ts-ignore - array is changed to a string array
		i && "string" == typeof arr && (arr = arr.split(""));
		for (; o != a; o += t) if (arr[o] == value) return o;
		return -1;
	}

	/**
	 * locates the first index of the provided value in the passed array. If the value is not found,
	 * -1 is returned.
	 */
	lastIndexOf<T>(arr: T[] | string, value: T, fromIndex?: number): number
	{
		return this.indexOf(arr, value, fromIndex, true);
	}

	/**
	 * locates the last index of the provided value in the passed array. If the value is not found,
	 * -1 is returned.
	 */
	forEach<T>(arr: ArrayLike<T>, callback: string | ((item: T, idx: number, arr: ArrayLike<T>) => void), thisObj?: Object): void
	{
		var i = 0;
		var a = (arr && arr.length) || 0;
		// @ts-ignore - array is changed to a string array
		a && "string" == typeof arr && (arr = arr.split(""));
		"string" == typeof callback && (callback = DojoArray.cache[callback as string] as any || DojoArray.pushCache(callback));
		if (thisObj)
			for (; i < a; ++i) (callback as Function).call(thisObj, arr[i], i, arr);
		else for (; i < a; ++i) (callback as Function)(arr[i], i, arr);
	}

	/**
	 * for every item in arr, callback is invoked. Return values are ignored. If you want to break
	 * out of the loop, consider using array.every() or array.some().
	 */
	map<T, U>(arr: T[] | string, callback: string | ((item: T, idx: number, arr: T[]) => U), thisObj?: Object, Ctr?: Constructor<U[]>): U[]
	{
		var i = 0;
		var a = (arr && arr.length) || 0;
		var s: any = new (Ctr || DojoArray)(a);
		// @ts-ignore - array is changed to a string array
		a && "string" == typeof arr && (arr = arr.split(""));
		"string" == typeof callback && (callback = DojoArray.cache[callback as string] as any || DojoArray.pushCache(callback));
		if (thisObj)
			for (; i < a; ++i) s[i] = (callback as Function).call(thisObj, arr[i], i, arr);
		else for (; i < a; ++i) s[i] = (callback as Function)(arr[i], i, arr);
		return s;
	}

	/**
	 * Returns a new Array with those items from arr that match the condition implemented by
	 * callback.
	 */
	filter<T>(arr: T[] | string, callback: string | ((item: T, idx: number, arr: T[]) => boolean), thisObj?: Object): T[]
	{
		var i;
		var a = 0;
		var s = (arr && arr.length) || 0;
		var u: T[] = [];
		// @ts-ignore - array is changed to a string array
		s && "string" == typeof arr && (arr = arr.split(""));
		"string" == typeof callback && (callback = DojoArray.cache[callback as string] as any || DojoArray.pushCache(callback));
		if (thisObj)
			for (; a < s; ++a) {
				i = arr[a]!;
		// @ts-ignore - array is changed to a string array
				(callback as Function).call(thisObj, i, a, arr) && u.push(i);
			}
		// @ts-ignore - array is changed to a string array
		else for (; a < s; ++a) (callback as Function)(i = arr[a]!, a, arr) && u.push(i);
		return u;
	}

	clearCache(): void
	{
		DojoArray.cache = {};
	}
}


declare global {
	namespace DojoJS
	{
		interface Dojo extends DojoArray {}
	}
}

var array = new DojoArray();
lang.mixin(dojo, array);

/**
 * Adds the array API to the base dojo object.
 */
export = dojo; // this is the same as returning lang, array, or the result of the mixin.