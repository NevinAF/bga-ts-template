declare var declare: DojoJS.Declare;
declare global {
    namespace DojoJS {
        type InheritedMethod<T> = HitchMethod<Omit<T, 'inherited' | 'getInherited' | '__inherited'>>;
        /**
         * dojo/_base/declare() returns a constructor `C`.   `new C()` returns an Object with the following
         * methods, in addition to the methods and properties specified via the arguments passed to declare().
         */
        interface DojoClassObject<This = any> {
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
            inherited<T extends InheritedMethod<This>>(method: T, args: IArguments, newArgs?: Parameters<Hitched<This, T>>): ReturnType<Hitched<This, T>>;
            inherited<T extends InheritedMethod<This>>(method: T, args: IArguments, get: true): Hitched<This, T>;
            /** Same as {@link inherited}, but always does not have debugging */
            __inherited: DojoClassObject['inherited'];
            /**
             * Returns a super method.
             *
             * This method is a convenience method for "this.inherited()".
             * It uses the same algorithm but instead of executing a super
             * method, it returns it, or "undefined" if not found.
             */
            getInherited(args: IArguments): Function | void;
            getInherited<T extends InheritedMethod<This>>(method: T, args: IArguments): Hitched<This, T>;
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
            new (...args: Args): T & DojoClassObject<T>;
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
                bases: Constructor<any>[];
                hidden: object;
                chains: Record<string, 'after' | 'before'>;
                parents: Constructor<any>[];
                ctor: Constructor<any>;
            };
            superclass: object;
        }
        type PropsCtorArgs<T> = T extends {
            constructor: (...args: infer A) => any;
        } ? A : [];
        type VanillaClass<Proto = any, Args extends any[] = any[]> = {
            new (...args: Args): Proto;
            prototype: Proto;
        };
        type _DeclareSubclass<T, P> = P extends DojoClass<infer PA, infer PB> ? (T extends DojoClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : T extends VanillaClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : never) : P extends VanillaClass<infer PA, infer PB> ? (T extends DojoClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : T extends VanillaClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : never) : T extends DojoClass<infer A, infer B> ? DojoClass<A & P, UnionTuple<B, PropsCtorArgs<P>>> : T extends VanillaClass<infer A, infer B> ? DojoClass<A & P, UnionTuple<B, PropsCtorArgs<P>>> : never;
        type DojoClassFrom<T> = T extends [infer A extends (DojoClass | VanillaClass), infer B, ...infer Rest extends any[]] ? DojoClassFrom<[_DeclareSubclass<A, B>, ...Rest]> : T extends [infer A extends DojoClass] ? A : T extends object ? DojoClass<T, PropsCtorArgs<T>> : never;
        type DeclareProps<T, C = null> = C extends any[] ? T & ThisType<InstanceType<DojoClassFrom<[...C, T]>>> : T & ThisType<T & DojoClassObject>;
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
//# sourceMappingURL=declare.d.ts.map