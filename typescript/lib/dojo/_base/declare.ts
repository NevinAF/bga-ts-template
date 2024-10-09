// @ts-nocheck

import dojo = require("./kernel");
import has = require("../has");
import lang = require("./lang");

var EmptyClass = (has("csp-restrictions") ? function () {} : new Function()) as new () => any;
var nameUniqueId = 0;

function throwError(message: string, context?: string) {
	throw new Error("declare" + (context ? " " + context : "") + ": " + message);
}

function l(e, t, n, r) {
	var o,
		a,
		s,
		callee,
		f,
		d,
		p,
		h,
		g,
		m = (this._inherited = this._inherited || {});
	if ("string" == typeof e) {
		o = e;
		e = t;
		t = n;
		n = r;
	}
	if ("function" == typeof e) {
		callee = e;
		e = t;
		t = n;
	} else
		try {
			callee = e.callee;
		} catch (v) {
			if (!(v instanceof TypeError)) throw v;
			throwError(
				"strict mode inherited() requires the caller function to be passed before arguments",
				this.declaredClass
			);
		}
	(o = o || callee.nom) ||
		throwError(
			"can't deduce a name to call inherited()",
			this.declaredClass
		);
	n = r = 0;
	s = (f = this.constructor._meta).bases;
	g = m.p;
	if (o != "constructor") {
		if (m.c !== callee) {
			g = 0;
			if ((f = (d = s[0])._meta).hidden[o] !== callee) {
				(a = f.chains) &&
					"string" == typeof a[o] &&
					throwError(
						"calling chained method with inherited: " +
							o,
						this.declaredClass
					);
				do {
					f = d._meta;
					p = d.prototype;
					if (
						f &&
						((p[o] === callee && p.hasOwnProperty(o)) ||
							f.hidden[o] === callee)
					)
						break;
				} while ((d = s[++g]));
				g = d ? g : -1;
			}
		}
		if ((d = s[++g])) {
			p = d.prototype;
			if (d._meta && p.hasOwnProperty(o)) n = p[o];
			else {
				h = Object.prototype[o];
				do {
					if (
						(n = (p = d.prototype)[o]) &&
						(d._meta
							? p.hasOwnProperty(o)
							: n !== h)
					)
						break;
				} while ((d = s[++g]));
			}
		}
		n = (d && n) || Object.prototype[o];
	} else {
		if (m.c !== callee) {
			g = 0;
			if ((f = s[0]._meta) && f.ctor !== callee) {
				((a = f.chains) &&
					"manual" === a.constructor) ||
					throwError(
						"calling chained constructor with inherited",
						this.declaredClass
					);
				for (
					;
					(d = s[++g]) &&
					(!(f = d._meta) || f.ctor !== callee);

				);
				g = d ? g : -1;
			}
		}
		for (
			;
			(d = s[++g]) && !(n = (f = d._meta) ? f.ctor : d);

		);
		n = d && n;
	}
	m.c = n;
	m.p = g;
	if (n) return true === t ? n : n.apply(this, t || e);
}
function f(e, t, n) {
	return "string" == typeof e
		? "function" == typeof t
			? this.__inherited(e, t, n, true)
			: this.__inherited(e, t, true)
		: "function" == typeof e
		? this.__inherited(e, t, true)
		: this.__inherited(e, true);
}
var d = dojo.config.isDebug
	? function (e, t, n, r) {
			var o = this.getInherited(e, t, n);
			if (o) return o.apply(this, r || n || t || e);
		}
	: l;
function p(e) {
	for (
		var t = this.constructor._meta.bases,
			n = 0,
			r = t.length;
		n < r;
		++n
	)
		if (t[n] === e) return true;
	return this instanceof e;
}
function metaMixin(dest: any, source: any) {
	for (let key in source)
		key != "constructor" && source.hasOwnProperty(key) && (dest[key] = source[key]);

	if (!has("bug-for-in-skips-shadowed"))
		return;

	for (var i = lang._extraNames, a = i.length; a; )
	{
		let key = i[--a]!;
		if (key != "constructor" && source.hasOwnProperty(key))
			(dest[key] = source[key]);
	}
}
function g(e) {
	declare.safeMixin(this.prototype, e);
	return this;
}
function m(e, t) {
	if (!(e instanceof Array || "function" == typeof e)) {
		t = e;
		e = undefined;
	}
	t = t || {};
	return declare([this].concat((e = e || [])), t);
}
function v(e, t, n) {
	return function () {
		var r,
			o,
			i,
			a = 0,
			s = 1;
		if (n) {
			a = t.length - 1;
			s = -1;
		}
		for (; (r = t[a]); a += s)
			(i = ((o = r._meta) ? o.hidden : r.prototype)[e]) &&
				i.apply(this, arguments);
	};
}
function deriveProto(baseClass: Constructor<any>) {
	EmptyClass.prototype = baseClass.prototype;
	var t = new EmptyClass();
	EmptyClass.prototype = null;
	return t;
}
function b(e: IArguments) {
	var t = e.callee as Constructor<any>,
		n = deriveProto(t);
	t.apply(n, e as any);
	return n;
}
// @ts-ignore
var declare: DojoJS.Declare = function(name, dependencies, obj) {
	if ("string" != typeof name) {
		obj = dependencies;
		dependencies = name;
		name = "";
	}
	obj = obj || {};
	var classBuilder,
		j,
		temp,
		result: DojoJS.DojoClass<any>,
		T,
		expandedDependencies,
		chainsBuilder,
		dependencyCount = 1,
		parents = dependencies;
	if ("[object Array]" == Object.prototype.toString.call(dependencies)) {
		expandedDependencies = (function (dependencies, name) {
			for (
				var inheritIndex,
					inheritedBases,
					dependency,
					i,
					inherited,
					cacheElm,
					inheritedName,
					d,
					p = [],
					h = [{ cls: 0, refs: [] }],
					classCache = {},
					totalInherited = 1,
					numDependencies = dependencies.length,
					depIndex = 0;
				depIndex < numDependencies;
				++depIndex
			) {
				(dependency = dependencies[depIndex])
					? "[object Function]" != Object.prototype.toString.call(dependency) &&
						throwError(`mixin #${depIndex} is not a callable constructor.`, name)
					: throwError(`mixin #${depIndex} is unknown. Did you use dojo.require to pull it in?`, name);
				i = 0;
				for (
					inheritIndex =
						(inheritedBases = dependency._meta ? dependency._meta.bases : [dependency]).length - 1;
					inheritIndex >= 0;
					--inheritIndex
				) {
					(inherited = inheritedBases[inheritIndex].prototype).hasOwnProperty(
						"declaredClass"
					) || (inherited.declaredClass = "uniqName_" + nameUniqueId++);
					inheritedName = inherited.declaredClass;
					if (!classCache.hasOwnProperty(inheritedName)) {
						classCache[inheritedName] = {
							count: 0,
							refs: [],
							cls: inheritedBases[inheritIndex],
						};
						++totalInherited;
					}
					cacheElm = classCache[inheritedName];
					if (i && i !== cacheElm) {
						cacheElm.refs.push(i);
						++i.count;
					}
					i = cacheElm;
				}
				++i.count;
				h[0].refs.push(i);
			}
			for (; h.length; ) {
				i = h.pop();
				p.push(i.cls);
				--totalInherited;
				for (; 1 == (d = i.refs).length; ) {
					if (!(i = d[0]) || --i.count) {
						i = 0;
						break;
					}
					p.push(i.cls);
					--totalInherited;
				}
				if (i)
					for (depIndex = 0, numDependencies = d.length; depIndex < numDependencies; ++depIndex)
						--(i = d[depIndex]).count || h.push(i);
			}
			totalInherited && throwError("can't build consistent linearization", name);
			dependency = dependencies[0];
			p[0] = dependency
				? dependency._meta &&
					dependency === p[p.length - dependency._meta.bases.length]
					? dependency._meta.bases.length
					: 1
				: 0;
			return p;
		})(dependencies, name);
		temp = expandedDependencies[0];
		dependencies = expandedDependencies[(dependencyCount = expandedDependencies.length - temp)];
	} else {
		expandedDependencies = [0];
		if (dependencies)
			if ("[object Function]" == Object.prototype.toString.call(dependencies)) {
				temp = dependencies._meta;
				expandedDependencies = expandedDependencies.concat(temp ? temp.bases : dependencies);
			} else
				throwError(
					"base class is not a callable constructor.",
					name
				);
		else
			null !== dependencies &&
				throwError(
					"unknown base class. Did you use dojo.require to pull it in?",
					name
				);
	}
	if (dependencies)
		for (j = dependencyCount - 1; ; --j) {
			classBuilder = deriveProto(dependencies);
			if (!j) break;
			((temp = expandedDependencies[j])._meta ? metaMixin : lang.mixin)(classBuilder, temp.prototype);
			(result = has("csp-restrictions")
				? function () {}
				: new Function()).superclass = dependencies;
			result.prototype = classBuilder;
			dependencies = classBuilder.constructor = result;
		}
	else classBuilder = {};
	declare.safeMixin(classBuilder, obj);
	if ((temp = obj.constructor) !== Object.prototype.constructor) {
		temp.nom = "constructor";
		classBuilder.constructor = temp;
	}
	for (j = dependencyCount - 1; j; --j)
		(temp = expandedDependencies[j]._meta) &&
			temp.chains &&
			(chainsBuilder = lang.mixin(chainsBuilder || {}, temp.chains));
	classBuilder["-chains-"] && (chainsBuilder = lang.mixin(chainsBuilder || {}, classBuilder["-chains-"]));
	dependencies &&
		dependencies.prototype &&
		dependencies.prototype["-chains-"] &&
		(chainsBuilder = lang.mixin(chainsBuilder || {}, dependencies.prototype["-chains-"]));
	temp = !chainsBuilder || !chainsBuilder.hasOwnProperty("constructor");
	expandedDependencies[0] = result =
		chainsBuilder && "manual" === chainsBuilder.constructor
			? (function (e) {
					return function () {
						var t,
							n,
							r = arguments,
							o = 0;
						if (!(this instanceof r.callee))
							return b(r);
						for (; (t = e[o]); ++o)
							if (
								(t = (n = t._meta) ? n.ctor : t)
							) {
								t.apply(this, r);
								break;
							}
						(t = this.postscript) &&
							t.apply(this, r);
					};
				})(expandedDependencies)
			: 1 == expandedDependencies.length
			? (function (e, noChains: boolean) {
					return function () {
						var n,
							args = arguments,
							o = args,
							i = args[0];
						if (!(this instanceof args.callee))
							return b(args);
						if (noChains) {
							i &&
								(n = i.preamble) &&
								(o = n.apply(this, o) || o);
							(n = this.preamble) &&
								n.apply(this, o);
						}
						e && e.apply(this, args);
						(n = this.postscript) &&
							n.apply(this, args);
					};
				})(obj.constructor, temp)
			: (function (expandedDependencies, noChains: boolean) {
					return function () {
						var n,
							r,
							o,
							i,
							args = arguments,
							s = args,
							firstArg = args[0];
						if (!(this instanceof args.callee))
							return b(args);
						if (
							noChains &&
							((firstArg && firstArg.preamble) || this.preamble)
						) {
							(i = new Array(expandedDependencies.length))[0] = args;
							for (r = 0; ; ) {
								(firstArg = args[0]) &&
									(n = firstArg.preamble) &&
									(args = n.apply(this, args) || args);
								(n =
									(n =
										expandedDependencies[r]
											.prototype).hasOwnProperty(
										"preamble"
									) && n.preamble) &&
									(args = n.apply(this, args) || args);
								if (++r == expandedDependencies.length) break;
								i[r] = args;
							}
						}
						for (r = expandedDependencies.length - 1; r >= 0; --r)
							(n = (o = (n = expandedDependencies[r])._meta)
								? o.ctor
								: n) &&
								n.apply(this, i ? i[r] : args);
						(n = this.postscript) &&
							n.apply(this, s);
					};
				})(expandedDependencies, temp);
	result._meta = {
		bases: expandedDependencies,
		hidden: obj,
		chains: chainsBuilder,
		parents: parents,
		ctor: obj.constructor,
	};
	result.superclass = dependencies && dependencies.prototype;
	result.extend = g;
	result.createSubclass = m;
	result.prototype = classBuilder;
	classBuilder.constructor = result;
	classBuilder.getInherited = f;
	classBuilder.isInstanceOf = p;
	classBuilder.inherited = d;
	classBuilder.__inherited = l;
	if (name) {
		classBuilder.declaredClass = name;
		lang.setObject(name, result);
	}
	if (chainsBuilder)
		for (T in chainsBuilder)
			classBuilder[T] &&
				"string" == typeof chainsBuilder[T] &&
				T != "constructor" &&
				((temp = classBuilder[T] = v(T, expandedDependencies, "after" === chainsBuilder[T])).nom =
					T);
	return result;
}
dojo.safeMixin = declare.safeMixin = function (e, r) {
	var o, s;
	for (o in r)
		if (((s = r[o]) !== Object.prototype[o] || !(o in Object.prototype)) && o != "constructor") {
			"[object Function]" == Object.prototype.toString.call(s) && (s.nom = o);
			e[o] = s;
		}
	if (has("bug-for-in-skips-shadowed") && r)
		for (var c = lang._extraNames, l = c.length; l; )
			if (
				((s = r[(o = c[--l])]) !== Object.prototype[o] || !(o in Object.prototype)) &&
				o != "constructor"
			) {
				"[object Function]" == Object.prototype.toString.call(s) && (s.nom = o);
				e[o] = s;
			}
	return e;
};
dojo.declare = declare;


declare global {
	namespace DojoJS
	{
		type InheritedMethod<T> = HitchMethod<Omit<T,'inherited' | 'getInherited' | '__inherited'>>;

		/**
		 * dojo/_base/declare() returns a constructor `C`.   `new C()` returns an Object with the following
		 * methods, in addition to the methods and properties specified via the arguments passed to declare().
		 */
		interface DojoClassObject {
			declaredClass: string;

			/**
			 * Calls a super method.
			 *
			 * This method is used inside method of classes produced with
			 * declare() to call a super method (next in the chain). It is
			 * used for manually controlled chaining. Consider using the regular
			 * chaining, because it is faster. Use "this.inherited()" only in
			 * complex cases.
			 *
			 * This method cannot me called from automatically chained
			 * constructors including the case of a special (legacy)
			 * constructor chaining. It cannot be called from chained methods.
			 *
			 * If "this.inherited()" cannot find the next-in-chain method, it
			 * does nothing and returns "undefined". The last method in chain
			 * can be a default method implemented in Object, which will be
			 * called last.
			 *
			 * If "name" is specified, it is assumed that the method that
			 * received "args" is the parent method for this call. It is looked
			 * up in the chain list and if it is found the next-in-chain method
			 * is called. If it is not found, the first-in-chain method is
			 * called.
			 *
			 * If "name" is not specified, it will be derived from the calling
			 * method (using a methoid property "nom").
			 */
			inherited<U>(args: IArguments): U;
			inherited<U>(args: IArguments, newArgs: any[]): U;
			inherited(args: IArguments, get: true): Function | void;
			inherited<T extends InheritedMethod<this>>(method: T, args: IArguments, newArgs?: Parameters<Hitched<this, T>>): ReturnType<Hitched<this, T>>;
			inherited<T extends InheritedMethod<this>>(method: T, args: IArguments, get: true): Hitched<this, T>;

			/** Same as {@link inherited}, but always does not have debugging */
			__inherited: this['inherited'];

			/**
			 * Returns a super method.
			 *
			 * This method is a convenience method for "this.inherited()".
			 * It uses the same algorithm but instead of executing a super
			 * method, it returns it, or "undefined" if not found.
			 */
			getInherited(args: IArguments): Function | void;
			getInherited<T extends InheritedMethod<this>>(method: T, args: IArguments): Hitched<this, T>;

			/**
			 * Checks the inheritance chain to see if it is inherited from this class.
			 *
			 * This method is used with instances of classes produced with
			 * declare() to determine of they support a certain interface or
			 * not. It models "instanceof" operator.
			 */
			isInstanceOf(cls: any): boolean;
		}

		interface DojoClass<T = any, Args extends any[] = any[]> {
			new (...args: Args): T & DojoClassObject;
			prototype: T;

			/**
			 * Adds all properties and methods of source to constructor's
			 * prototype, making them available to all instances created with
			 * constructor. This method is specific to constructors created with
			 * declare().
			 *
			 * Adds source properties to the constructor's prototype. It can
			 * override existing properties.
			 *
			 * This method is similar to dojo.extend function, but it is specific
			 * to constructors produced by declare(). It is implemented
			 * using dojo.safeMixin, and it skips a constructor property,
			 * and properly decorates copied functions.
			 */
			extend<U>(source: U): DojoClass<T & U>;

			/**
			 * Create a subclass of the declared class from a list of base classes.
			 *
			 * Create a constructor using a compact notation for inheritance and
			 * prototype extension.
			 *
			 * Mixin ancestors provide a type of multiple inheritance.
			 * Prototypes of mixin ancestors are copied to the new class:
			 * changes to mixin prototypes will not affect classes to which
			 * they have been mixed in.
			 */
			createSubclass<U, V, X>(mixins: [DojoClass<U>, DojoClass<V>], props: X & ThisType<T & U & V & X>): DojoClass<T & U & V & X>;
			createSubclass<U, V>(mixins: [DojoClass<U>], props: V & ThisType<T & U & V>): DojoClass<T & U & V>;
			createSubclass<U, V>(mixins: DojoClass<U>, props: V & ThisType<T & U & V>): DojoClass<T & U & V>;
			createSubclass<U>(mixins: [DojoClass<U>]): DojoClass<T & U>;
			createSubclass<U>(mixins: DojoClass<U>): DojoClass<T & U>;
			createSubclass<U>(mixins: any, props: U & ThisType<T & U>): DojoClass<T & U>;

			_meta: {
				bases: Constructor<any>[],
				hidden: object,
				chains: Record<string, 'after' | 'before'>,
				parents: Constructor<any>[],
				ctor: Constructor<any>,
			};
			superclass: object;
		}

		type PropsCtorArgs<T> = T extends { constructor: (...args: infer A) => any } ? A : [];

		type VanillaClass<Proto = any, Args extends any[] = any[]> = {
			new (...args: Args): Proto;
			prototype: Proto;
		};

		type _DeclareSubclass<T, P> =
		// if P is a DeclareConstructor
			P extends DojoClass<infer PA, infer PB>
				? (T extends DojoClass<infer A, infer B>
					? DojoClass<A & PA, UnionTuple<B, PB>>
					: T extends VanillaClass<infer A, infer B>
						? DojoClass<A & PA, UnionTuple<B, PB>>
						: never)
			// if P is a RawConstructor
			: P extends VanillaClass<infer PA, infer PB>
				? (T extends DojoClass<infer A, infer B>
					? DojoClass<A & PA, UnionTuple<B, PB>>
					: T extends VanillaClass<infer A, infer B>
						? DojoClass<A & PA, UnionTuple<B, PB>>
						: never)
			// P is a Props object
			: T extends DojoClass<infer A, infer B>
				? DojoClass<A & P, UnionTuple<B, PropsCtorArgs<P>>>
				: T extends VanillaClass<infer A, infer B>
					? DojoClass<A & P, UnionTuple<B, PropsCtorArgs<P>>>
					: never;

		type DojoClassFrom<T> = T extends [infer A extends (DojoClass | VanillaClass), infer B, ...infer Rest extends any[]]
			? DojoClassFrom<[_DeclareSubclass<A, B>, ...Rest]>
			: T extends [infer A extends DojoClass] ? A
			: T extends object ? DojoClass<T, PropsCtorArgs<T>>
			: never;

		type DeclareProps<T, C = null> = C extends any[]
			? T & ThisType<InstanceType<DojoClassFrom<[...C, T]>>>
			: T & ThisType<T & DojoClassObject>

		/**
		 * Create a feature-rich constructor from compact notation.
		 */
		interface Declare {

			<P>(superClass: null, props: DeclareProps<P>): DojoClassFrom<P>;
			<P>(setGlobalName: string, superClass: null, props: DeclareProps<P>): DojoClassFrom<P>;

			<T extends DojoClass | VanillaClass>(superClass: T): DojoClassFrom<[T, {}]>;
			<T extends DojoClass | VanillaClass>(setGlobalName: string, superClass: T): DojoClassFrom<[T, {}]>;
			<T extends DojoClass | VanillaClass, P>(superClass: T, props: DeclareProps<P, [T]>): DojoClassFrom<[T, P]>;
			<T extends DojoClass | VanillaClass, P>(setGlobalName: string, superClass: T, props: DeclareProps<P, [T]>): DojoClassFrom<[T, P]>;
			<const T extends (DojoClass | VanillaClass)[]>(superClasses: T): DojoClassFrom<[...T, {}]>;
			<const T extends (DojoClass | VanillaClass)[]>(setGlobalName: string, superClasses: T): DojoClassFrom<[...T, {}]>;
			<const T extends (DojoClass | VanillaClass)[], P>(superClasses: T, props: DeclareProps<P, T>): DojoClassFrom<[...T, P]>;
			<const T extends (DojoClass | VanillaClass)[], P>(setGlobalName: string, superClasses: T, props: DeclareProps<P, T>): DojoClassFrom<[...T, P]>;

			/**
			 * Mix in properties skipping a constructor and decorating functions
			 * like it is done by declare().
			 */
			safeMixin<A, B>(target: A, source: B): A & B;
		}

		interface Dojo {
			declare: Declare;
			safeMixin: Declare['safeMixin'];
		}
	}
}


export = declare;