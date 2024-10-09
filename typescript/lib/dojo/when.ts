import Deferred = require("./Deferred");
import Promise = require("./promise/Promise");

function when<T, U = T>(value: T | Promise<T>, callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null, progback?: ((progress: any) => void) | null): U | Promise<U>
{
	// @ts-ignore - checking if value has a 'then' method
	var isThenable = value && "function" == typeof value.then,
		isPromise = isThenable && value instanceof Promise;
	if (!isThenable)
		return arguments.length > 1
			? callback
				? callback(value as T) as unknown as Promise<U>
				: value as unknown as U
			: new Deferred<T>().resolve(value as T) as unknown as Promise<U>;
	if (!isPromise) {
		// @ts-ignore - checks if 'cancel' is a value.
		var u = new Deferred(value.cancel);
		// @ts-ignore - we know that 'then' must exist
		value.then(u.resolve, u.reject, u.progress);
		value = u.promise as Promise<T>;
	}
	// @ts-ignore - we know that 'then' must exist
	return callback || errback || progback ? value.then(callback, errback, progback) : value;
};

export = when;