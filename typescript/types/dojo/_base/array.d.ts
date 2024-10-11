import dojo = require("./kernel");
/**
 * This contains functions similar to Array.prototype, but also caches the functions for performance. Modern code should not be used over standard Array.prototype functions.
 */
declare class DojoArray {
    private static cache;
    private static pushCache;
    /**
     * Determines whether or not every item in arr satisfies the condition implemented by callback.
     * @param {T[] | string} arr the array to iterate on. If a string, operates on individual characters.
     * @param {Function | string} callback a  function is invoked with three arguments: item, index, and
     *                                     array and returns true if the condition is met.
     * @param {object} thisObj may be used to scope the call to callback
     */
    every<T, U extends ((item: T, idx: number, arr: T[]) => boolean) | string, V extends (U extends keyof V ? {
        [k in U]: ((item: T, idx: number, arr: T[]) => boolean);
    } : never)>(arr: T[] | string, callback: U, thisObj?: V): boolean;
    /**
     * Determines whether or not any item in arr satisfies the condition implemented by callback.
     */
    some<T, U extends ((item: T, idx: number, arr: T[]) => boolean) | string, V extends (U extends keyof V ? {
        [k in U]: ((item: T, idx: number, arr: T[]) => boolean);
    } : never)>(arr: T[] | string, callback: U, thisObj?: V): boolean;
    /**
     * locates the last index of the provided value in the passed array. If the value is not found, -1
     * is returned.
     * @param {boolean} findLast Makes indexOf() work like lastIndexOf().  Used internally; not meant
     *                           for external usage.
     */
    indexOf<T>(arr: T[] | string, value: T, fromIndex?: number, findLast?: boolean): number;
    /**
     * locates the first index of the provided value in the passed array. If the value is not found,
     * -1 is returned.
     */
    lastIndexOf<T>(arr: T[] | string, value: T, fromIndex?: number): number;
    /**
     * locates the last index of the provided value in the passed array. If the value is not found,
     * -1 is returned.
     */
    forEach<T>(arr: ArrayLike<T>, callback: string | ((item: T, idx: number, arr: ArrayLike<T>) => void), thisObj?: Object): void;
    /**
     * for every item in arr, callback is invoked. Return values are ignored. If you want to break
     * out of the loop, consider using array.every() or array.some().
     */
    map<T, U>(arr: T[] | string, callback: string | ((item: T, idx: number, arr: T[]) => U), thisObj?: Object, Ctr?: Constructor<U[]>): U[];
    /**
     * Returns a new Array with those items from arr that match the condition implemented by
     * callback.
     */
    filter<T>(arr: T[] | string, callback: string | ((item: T, idx: number, arr: T[]) => boolean), thisObj?: Object): T[];
    clearCache(): void;
}
declare global {
    namespace DojoJS {
        interface Dojo extends DojoArray {
        }
    }
}
/**
 * Adds the array API to the base dojo object.
 */
export = dojo;
//# sourceMappingURL=array.d.ts.map