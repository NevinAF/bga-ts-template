/** Utility type which converts a union of object types to an intersection of object types. This allows for all possible properties to be accessible on a type without needing to do any casting. */
type AnyOf<T> = 
	(T extends {} ? (x: T) => any : never) extends 
	(x: infer R) => void ? R : never;

/** Utility type which returns all keys of an object type that have a value type of ValueType. */
type KeysWithType<T, ValueType> = {
	[K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T];

/** Utility type that filters a union type for all types that contain at least one of U. */
type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

/** Utility Type that filters all empty types from a union type. */
type ExcludeEmpty<T> = T extends AtLeastOne<T> ? T : never;

/**
 * Utility type that filters for the keys of an interface type which have a 'null' literal type. Used to fix typescript limitations regarding complex intersections on interfaces.
 * @example
 * interface Test { a: string | null, b: number, c: null, d: string | null }
 * type NullableKeysTest = NullableKeys<Test>; // 'c'
 */
type NullableKeys<T> = {
	[K in keyof T]: T[K] extends null ? K : never;
}[keyof T];

/**
 * Utility type that filters for the keys of an interface type which don't have a 'null' literal type. Used to fix typescript limitations regarding complex intersections on interfaces.
 * @example
 * interface Test { a: string | null, b: number, c: null, d: string | null }
 * type NullableKeysTest = NullableKeys<Test>; // 'a', 'b', 'd'
 */
type NotNullableKeys<T> = {
	[K in keyof T]: T[K] extends null ? never : K;
}[keyof T];

/**
 * Utility type that filters removes all properties with a 'null' literal type from an interface type. Used to fix typescript limitations regarding complex intersections on interfaces.
 * @example
 * type ExampleInterface = {
 * 	1: { c: number },
 * 	2: null,
 * 	3: { a: string | null, b: null },
 * }
 * 
 * KeysWithType<ExampleInterface, { c: number }> // 1 | 2
 * KeysWithType<ExcludeNull<ExampleInterface>, { c: number }> // 1
 */
type ExcludeNull<T> = Omit<T, NullableKeys<T>>;

/**
 * Utility type that returns the indices of a tuple type. This is similar to the `keyof` operator for objects, but tuples would normally return all other keys on an array type like `length`, `push`, `pop`, etc.
 * @example
 * type Tuple = [string, number, boolean];
 * type TupleIndices = TupleIndices<Tuple>; // 0 | 1 | 2
 */
type TupleIndices<T extends readonly any[]> =
	Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;