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

type NullableKeys<T> = {
	[K in keyof T]: T[K] extends null ? K : never;
}[keyof T];

type NotNullableKeys<T> = {
	[K in keyof T]: T[K] extends null ? never : K;
}[keyof T];

type ExcludeNull<T> = Omit<T, NullableKeys<T>>;