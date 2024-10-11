import dojo = require("./kernel");
import "../sniff";
declare class Lang {
    /**
     * Lists property names that must be explicitly processed during for-in iteration
     * in environments that have has("bug-for-in-skips-shadowed") true.
     */
    _extraNames: string[];
    /**
     * Copies/adds all properties of one or more sources to dest; returns dest.
     */
    _mixin<T extends Record<string, any>, U extends Record<string, any>>(dest: T, source: U, copyFunc?: (s: any) => any): typeof copyFunc extends Falsy ? T & U : Record<keyof T, any> & U;
    /**
     * Copies/adds all properties of one or more sources to dest; returns dest.
     */
    mixin<T extends Record<string, any>, const U extends Record<string, any>[]>(dest: T | Falsy, ...sources: U): T & AnyOf<U[number]>;
    /**
     * Set a property of a context object from a dot-separated string, such as "A.B.C": context.A.B.C = value.
     * @param name
     * @param value
     * @param context
     * @returns If the value was successfully set, the value is returned. Otherwise, undefined is returned.
     */
    setObject<T>(name: string, value: T, context?: Record<string, any>): T | undefined;
    /**
     * Get a property from a dot-separated string, such as "A.B.C"
     */
    getObject<P extends string | Falsy, C extends Record<string, any>>(name: P, create?: boolean, context?: C): P extends Falsy ? C : any;
    /**
     * determine if an object supports a given method
     */
    exists(name: string, obj?: Record<string, any>): boolean;
    /**
     * Return true if it is a String
     */
    isString(it: any): it is string;
    /**
     * Return true if it is an Array.
     */
    isArray(it: any): it is any[];
    /**
     * Return true if it is a Function
     */
    isFunction(it: any): it is Function;
    /**
     * Returns true if it is a JavaScript object (or an Array, a Function
     * or null)
     */
    isObject(it: any): it is (null | object | any[] | Function);
    /**
     * similar to isArray() but more permissive
     */
    isArrayLike(it: any): boolean;
    /**
     * Returns true if it is a built-in function or some other kind of
     * oddball that *should* report as a function but doesn't
     */
    isAlien(it: any): boolean;
    /**
     * Adds all properties and methods of props to constructor's
     * prototype, making them available to all instances created with
     * constructor.
     */
    extend<T extends DojoJS.DojoClass, const U>(ctor: T, ...props: DojoJS.DeclareProps<U, [T]>[]): DojoJS._DeclareSubclass<T, U>;
    _hitchArgs<S, M extends string, Args extends any[]>(...[scope, method, ...args]: [...DojoJS.HitchedPair<S, M, Args>, ...Args]): DojoJS.HitchResult<S, M, Args>;
    /**
     * Returns a function that will only ever execute in the given scope.
     * This allows for easy use of object member functions
     * in callbacks and other places in which the "this" keyword may
     * otherwise not reference the expected scope.
     * Any number of default positional arguments may be passed as parameters
     * beyond "method".
     * Each of these values will be used to "placehold" (similar to curry)
     * for the hitched function.
     */
    /**
     * Returns a function that will only ever execute in the given scope ('this' is always the scope).
     * @param scope The 'this' context which should be used when method executes.
     * @param method The property name which is a function that should be executed in scope.
     * @returns The 'method' property on 'scope', bound to 'scope'.
    */
    hitch<M extends keyof DojoJS.Global, Args extends any[]>(method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never, buffer?: any, // scope will be null, but this is not used for hitching the first x params.
    ...args: Args): DojoJS.HitchResult<null, M, Args>;
    hitch<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[]>(method: M, buffer?: any, // scope will be null, but this is not used for hitching the first x params.
    ...args: Args): DojoJS.HitchResult<null, M, Args>;
    hitch<S, M extends keyof any, Args extends any[]>(...[scope, method, ...args]: [...DojoJS.HitchedPair<S, M, Args>, ...Args]): DojoJS.HitchResult<S, M, Args>;
    hitch<S, const M extends DojoJS.BoundFunc<S, Args>, Args extends any[]>(scope: S, method: M, ...args: Args): DojoJS.HitchResult<S, M, Args>;
    /**
     * Returns a new object which "looks" to obj for properties which it
     * does not have a value for. Optionally takes a bag of properties to
     * seed the returned object with initially.
     */
    delegate<T, U>(obj: T, props?: U): T & U;
    /**
     * Converts an array-like object (i.e. arguments, DOMCollection) to an
     * array. Returns a new Array with the elements of obj.
     */
    _toArray(obj: any, offset?: number, startWith?: any[]): any[];
    /**
     * similar to hitch() except that the scope object is left to be
     * whatever the execution context eventually becomes.
     */
    partial<U extends Function>(method: Function | string, ...args: any[]): U;
    /**
     * Clones objects (including DOM nodes) and all children.
     * Warning: do not clone cyclic structures.
     */
    clone<T>(src: T): T;
    /**
     * Trims whitespace from both sides of the string
     */
    trim(str: string): string;
    /**
     * Performs parameterized substitutions on a string. Throws an
     * exception if any parameter is unmatched.
     */
    replace(tmpl: string, map: Record<string, any> | ((match: string, name: string, offset: number, tmpl: string) => string), pattern?: RegExp): string;
}
declare global {
    namespace DojoJS {
        interface Dojo extends Lang {
        }
        type HitchMethod<Scope, Args extends any[] = any[], Rtn extends any = any> = BoundFunc<Scope, Args, Rtn> | (Scope extends DojoJS.WithFunc<Scope, infer X, Args> ? X : never) | KeysWithType<Scope, BoundFunc<Scope, Args, Rtn>>;
        type Hitched<T, U, P extends any[] = []> = U extends BoundFunc<T, infer Args, infer R> ? ((...args: Skip<Args, Length<P>>) => R) : U extends keyof FalsyAsGlobal<T> ? (FalsyAsGlobal<T>[U] extends BoundFunc<T, infer Args, infer R> ? ((...args: Skip<Args, Length<P>>) => R) : never) : never;
        type FalsyAsGlobal<T> = T extends Falsy ? DojoJS.Global : T;
        /**
         * A function that is bound to a given scope.
         * @template Scope The scope to bind to. This is the 'this' context that the function will execute in. If null, the global scope is used.
         * @template Args The required first arguments for the function. The function can have any number of additional arguments (optional or not).
         * @template R The return type of the function.
         */
        type BoundFunc<Scope, Args extends any[] = [], R extends any = any> = (this: FalsyAsGlobal<Scope>, ...args: [...Args, ...any[]]) => R;
        type WithFunc<S, M extends keyof any, Args extends any[]> = {
            [k in M]: BoundFunc<S, Args> | null;
        };
        type HitchedPair<S, M extends keyof any, Args extends any[]> = [
            /** When the second parameter is a string, the first param must be a object with the matching func, OR... */
            scope: DojoJS.WithFunc<S, M, Args> | 
            /** the first param must be null and the matching func exists on the global this. */
            (typeof import("../global") extends DojoJS.WithFunc<null, M, Args> ? null : never),
            method: M
        ] | [
            scope: S,
            method: KeysWithType<S, DojoJS.BoundFunc<S, Args>>
        ];
        type GlobalHitchedFunc<M, Args extends any[]> = M extends BoundFunc<null, Args> ? M : M extends string ? (typeof import("../global") extends WithFunc<null, M, Args> ? M : never) : never;
        type HitchResult<Scope, Method, Args extends any[] = []> = Method extends BoundFunc<Scope, Args, infer R> ? ((...args: Skip<Parameters<Method>, Length<Args>>) => R) : Method extends string ? (FalsyAsGlobal<Scope> extends {
            [k in Method]: (infer F extends BoundFunc<Scope, Args>) | null;
        } ? ((...args: Skip<Parameters<F>, Length<Args>>) => ReturnType<F>) : never) : never;
    }
}
export = dojo;
//# sourceMappingURL=lang.d.ts.map