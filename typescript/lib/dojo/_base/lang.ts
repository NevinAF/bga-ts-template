import dojo = require("./kernel");
import has = require("../has");
import "../sniff";

has.add("bug-for-in-skips-shadowed", function () {
	for (var e in { toString: 1 }) return 0;
	return 1;
});

var extraNames = has("bug-for-in-skips-shadowed")
	? ["hasOwnProperty", "valueOf", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "constructor"]
	: [];

function resolvePropertyPath<T>(
	path: string[],
	createMissing?: boolean,
	root?: any
): T | null {
	root = root || (path[0] && dojo.scopeMap[path[0]]
		? dojo.scopeMap[path.shift()!]![1]
		: dojo.global);

	try {
		for (let i = 0; i < path.length; i++) {
			const key = path[i]!;
			if (!(key in root)) {
				if (!createMissing) return null;
				root[key] = {};
			}
			root = root[key];
		}
		return root;
	} catch (error) {}
	return null;
}

class Lang {
	/**
	 * Lists property names that must be explicitly processed during for-in iteration
	 * in environments that have has("bug-for-in-skips-shadowed") true.
	 */
	_extraNames: string[] = extraNames;

	/**
	 * Copies/adds all properties of one or more sources to dest; returns dest.
	 */
	_mixin<T extends Record<string, any>, U extends Record<string, any>>(dest: T, source: U, copyFunc?: (s: any) => any): typeof copyFunc extends Falsy ? T & U : Record<keyof T, any> & U
	{
		var name: string;
		var s: any;
		var d: any = {};
		for (name in source)
		{
			s = source[name];
			if (!(name in dest) || (dest[name] !== s && (!(name in d) || d[name] !== s)))
			{
				// @ts-ignore - this is a shallow object copy
				dest[name] = copyFunc ? copyFunc(s) : s;
			}
		}
		if (has("bug-for-in-skips-shadowed") && source)
		{
			for (var i = 0; i < extraNames.length; i++)
			{
				name = extraNames[i]!;
				s = source[name];
				if (!(name in dest) || (dest[name] !== s && (!(name in d) || d[name] !== s)))
				{
					// @ts-ignore - this is a shallow object copy
					dest[name] = copyFunc ? copyFunc(s) : s;
				}
			}
		}
		return dest as T & U;
	}

	/**
	 * Copies/adds all properties of one or more sources to dest; returns dest.
	 */
	mixin<T extends Record<string, any>, const U extends Record<string, any>[]>(dest: T | Falsy, ...sources: U): T & AnyOf<U[number]>
	{
		// @ts-ignore - allow for creation of new destination if falsy
		if(!dest)
			dest = {} as T;
		for (var n = 1, r = arguments.length; n < r; n++)
			this._mixin(dest!, arguments[n]);
		return dest as T & AnyOf<U[number]>;
	}

	/**
	 * Set a property of a context object from a dot-separated string, such as "A.B.C": context.A.B.C = value.
	 * @param name
	 * @param value
	 * @param context
	 * @returns If the value was successfully set, the value is returned. Otherwise, undefined is returned.
	 */
	setObject<T>(name: string, value: T, context?: Record<string, any>): T | undefined
	{
		var parts = name.split(".");
		var p = parts.pop();
		var obj = resolvePropertyPath<Record<string, any>>(parts, true, context);
		return obj && p ? (obj[p] = value) : undefined;
	}

	/**
	 * Get a property from a dot-separated string, such as "A.B.C"
	 */
	getObject<P extends string | Falsy, C extends Record<string, any>>(name: P, create?: boolean, context?: C): P extends Falsy ? C : any
	{
		return name ? resolvePropertyPath<any>(name.split("."), create, context) : context;
	}

	/**
	 * determine if an object supports a given method
	 */
	exists(name: string, obj?: Record<string, any>): boolean
	{
		return this.getObject(name, false, obj) !== undefined;
	}

	/**
	 * Return true if it is a String
	 */
	isString(it: any): it is string
	{
		return typeof it == "string" || it instanceof String;
	}

	/**
	 * Return true if it is an Array.
	 */
	isArray(it: any): it is any[]
	{
		return Object.prototype.toString.call(it) == "[object Array]";
	}

	/**
	 * Return true if it is a Function
	 */
	isFunction(it: any): it is Function
	{
		return Object.prototype.toString.call(it) === "[object Function]";
	}

	/**
	 * Returns true if it is a JavaScript object (or an Array, a Function
	 * or null)
	 */
	isObject(it: any): it is (null | object | any[] | Function)
	{
		return it !== undefined &&
			(it === null || typeof it == "object" || this.isArray(it) || this.isFunction(it));
	}

	/**
	 * similar to isArray() but more permissive
	 */
	isArrayLike(it: any): boolean
	{
		return it && it !== undefined && !this.isString(it) && !this.isFunction(it) &&
			(!(it.tagName && it.tagName.toLowerCase() == "form") &&
				(this.isArray(it) || isFinite(it.length)));
	}

	/**
	 * Returns true if it is a built-in function or some other kind of
	 * oddball that *should* report as a function but doesn't
	 */
	isAlien(it: any): boolean
	{
		return it && !this.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it));
	}

	/**
	 * Adds all properties and methods of props to constructor's
	 * prototype, making them available to all instances created with
	 * constructor.
	 */
	extend<T extends DojoJS.DojoClass, const U>(ctor: T, ...props: DojoJS.DeclareProps<U, [T]>[]): DojoJS._DeclareSubclass<T, U>
	extend<T extends { prototype: Record<string, any> }, const U extends Record<string, any>[]>(ctor: T, ...props: U[]): Omit<T, "prototype"> & { prototype: T["prototype"] & AnyOf<U[number]> }
	{
		for (var n = 1, r = arguments.length; n < r; n++)
			this._mixin(ctor.prototype, arguments[n]);
		return ctor as any;
	}

	_hitchArgs<S, M extends string, Args extends any[]>(...[
		scope,
		method,
		...args]: [...DojoJS.HitchedPair<S, M, Args>, ...Args]
	): DojoJS.HitchResult<S, M, Args> {
		var pre = this._toArray(arguments, 2);
		var named = this.isString(method);

		// @ts-ignore
		return function(this: Lang) // 'this' is converted to a const in TS, so this is a sort of binded function
		{
			var args = this._toArray(arguments);
			var f: DojoJS.BoundFunc<S> = named ? ((scope || dojo.global) as any)[method] : method;
			return f && f.apply((scope || this) as any, pre.concat(args));
		};
	}

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

	hitch<M extends keyof DojoJS.Global, Args extends any[]>(
		method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never,
		buffer?: any, // scope will be null, but this is not used for hitching the first x params.
		...args: Args): DojoJS.HitchResult<null, M, Args>;
	hitch<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[]>(
		method: M,
		buffer?: any, // scope will be null, but this is not used for hitching the first x params.
		...args: Args): DojoJS.HitchResult<null, M, Args>;
	hitch<S, M extends keyof any, Args extends any[]>(...[
		scope, method, ...args]: [...DojoJS.HitchedPair<S, M, Args>, ...Args]): DojoJS.HitchResult<S, M, Args>;
	hitch<S, const M extends DojoJS.BoundFunc<S, Args>, Args extends any[]>(
		scope: S, method: M, ...args: Args): DojoJS.HitchResult<S, M, Args>;

	hitch(scope: object | null | Function | string, method: any, ...args: any[]): Function
	{
		if (arguments.length > 2)
			return this._hitchArgs.apply(dojo, arguments as any) as any;

		if (!method)
		{
			method = scope as any;
			scope = null as any;
		}
		if (this.isString(method))
		{
			// @ts-ignore
			var func = (scope = scope || dojo.global)[method];
			if (!func)
			{
				throw new Error("lang.hitch: scope[" +(method as string) + "] is null (scope: " + scope + ")");
			}
			return function(...args: any[])
			{
				return func.apply(scope, args);
			};
		}

		return scope
			? function(...args: any[])
			{
				return method.apply(scope, args);
			}
			: method;
	}

	/**
	 * Returns a new object which "looks" to obj for properties which it
	 * does not have a value for. Optionally takes a bag of properties to
	 * seed the returned object with initially.
	 */
	delegate<T, U>(obj: T, props?: U): T & U
	{
		function F() {}
		F.prototype = obj;
		// @ts-ignore
		var tmp = new F();
		if (props)
		{
			this._mixin(tmp, props);
		}
		return tmp as T & U;
	}

	/**
	 * Converts an array-like object (i.e. arguments, DOMCollection) to an
	 * array. Returns a new Array with the elements of obj.
	 */
	_toArray(obj: any, offset?: number, startWith?: any[]): any[]
	{
		const a = (obj: any, offset?: number, startWith?: any[]) => (startWith || []).concat(Array.prototype.slice.call(obj, offset || 0))
		if (has("ie"))
		{
			var slow = (obj: any, offset: number, startWith: any[]): any[] =>
			{
				var arr = startWith || [];
				for (var x = offset || 0; x < obj.length; x++)
				{
					arr.push(obj[x]);
				}
				return arr;
			}
			return (obj.item ? slow : a).apply(this, arguments as any);
		}
		else return a(obj, offset, startWith);
	}

	/**
	 * similar to hitch() except that the scope object is left to be
	 * whatever the execution context eventually becomes.
	 */
	partial<U extends Function>(method: Function | string, ...args: any[]): U
	{
		// @ts-ignore
		return this.hitch.apply(dojo, [null].concat(this._toArray(arguments)));
	}

	/**
	 * Clones objects (including DOM nodes) and all children.
	 * Warning: do not clone cyclic structures.
	 */
	clone<T>(src: T): T
	{
		if (!src || typeof src != "object" || this.isFunction(src))
		{
			// null, undefined, any non-object, or function
			return src;
		}
		// @ts-ignore
		if (src.nodeType && "cloneNode" in src) return src.cloneNode(true) as any;
		if (src instanceof Date) return new Date(src.getTime()) as any;
		if (src instanceof RegExp) return new RegExp(src) as any;
		var result: any;
		if (this.isArray(src))
		{
			result = [];
			for (let i = 0, l = src.length; i < l; ++i)
				if (i in src)
					result[i] = this.clone(src[i]);
		}
		// @ts-ignore
		else result = src.constructor ? new src.constructor() : {};
		return this._mixin(result, src, this.clone);
	}

	/**
	 * Trims whitespace from both sides of the string
	 */
	trim(str: string): string
	{
		// @ts-ignore - Always true in modern contexts
		if (String.prototype.trim) return str.trim();
		return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
	}

	/**
	 * Performs parameterized substitutions on a string. Throws an
	 * exception if any parameter is unmatched.
	 */
	replace(tmpl: string, map: Record<string, any> | ((match: string, name: string, offset: number, tmpl: string) => string), pattern?: RegExp): string
	{
		// @ts-ignore
		return tmpl.replace(pattern || /\{([^\}]+)\}/g, this.isFunction(map) ? map : function (this: Lang, match: string, name: string)
		{
			return this.getObject(name, false, map) as string;
		});
	}
}

declare global {
	namespace DojoJS
	{
		interface Dojo extends Lang {}

		type HitchMethod<Scope, Args extends any[] = any[], Rtn extends any = any> =
			BoundFunc<Scope, Args, Rtn> | 
			(Scope extends DojoJS.WithFunc<Scope, infer X, Args> ? X : never) |
			KeysWithType<Scope, BoundFunc<Scope, Args, Rtn>>;

		type Hitched<T, U, P extends any[] = []> =
			U extends BoundFunc<T, infer Args, infer R> ? ((...args: Skip<Args, Length<P>>) => R) :
			U extends keyof FalsyAsGlobal<T> ? (
				FalsyAsGlobal<T>[U] extends BoundFunc<T, infer Args, infer R> ? ((...args: Skip<Args, Length<P>>) => R) : never
			) : never;

		type FalsyAsGlobal<T> = T extends Falsy ? DojoJS.Global : T;

		/**
		 * A function that is bound to a given scope.
		 * @template Scope The scope to bind to. This is the 'this' context that the function will execute in. If null, the global scope is used.
		 * @template Args The required first arguments for the function. The function can have any number of additional arguments (optional or not).
		 * @template R The return type of the function.
		 */
		type BoundFunc<Scope, Args extends any[] = [], R extends any = any> =
			(this: FalsyAsGlobal<Scope>, ...args: [...Args, ...any[]]) => R;
		
		type WithFunc<S, M extends keyof any, Args extends any[]> =  {
			[k in M]: BoundFunc<S, Args> | null;
		}

		type HitchedPair<S, M extends keyof any, Args extends any[]> = [
			// Scope is defined in the following way because it allows for auto-completion when using a string.
			/** When the second parameter is a string, the first param must be a object with the matching func, OR... */
			scope: DojoJS.WithFunc<S, M, Args> |
				/** the first param must be null and the matching func exists on the global this. */
				(typeof import("../global") extends DojoJS.WithFunc<null, M, Args> ? null : never),
			method: M
		] | [
			scope: S,
			method: KeysWithType<S, DojoJS.BoundFunc<S, Args>>
		]
		
		type GlobalHitchedFunc<M, Args extends any[]> = 
			M extends BoundFunc<null, Args> ? M
			: M extends string ? (typeof import("../global") extends WithFunc<null, M, Args> ? M : never)
			: never;
		
		type HitchResult<Scope, Method, Args extends any[] = []> =
			Method extends BoundFunc<Scope, Args, infer R>
				? ((...args: Skip<Parameters<Method>, Length<Args>>) => R)
			: Method extends string ? (
				FalsyAsGlobal<Scope> extends {
				[k in Method]: (infer F extends BoundFunc<Scope, Args>) | null;
			} ? ((...args: Skip<Parameters<F>, Length<Args>>) => ReturnType<F>) : never)
			: never;

	}
}

var lang = new Lang();
lang.mixin(dojo, lang);
export = dojo; // this is the same as returning lang or the result of the mixin.