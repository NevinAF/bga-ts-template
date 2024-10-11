type Promise<T> = typeof import("dojo/promise/Promise")<T>;
/**
 * Takes multiple promises and returns a new promise that is fulfilled
 * when all promises have been resolved or one has been rejected.
 * @param objectOrArray The promise will be fulfilled with a list of results if invoked with an
 * 						array, or an object of results when passed an object (using the same
 * 						keys). If passed neither an object or array it is resolved with an
 * 						undefined value.
 */
declare function all<T>(array: DojoJS.Thenable<T>[]): Promise<T[]>;
declare function all<T>(object: {
    [name: string]: DojoJS.Thenable<T>;
}): Promise<{
    [name: string]: T;
}>;
declare function all(array: DojoJS.Thenable<any>[]): Promise<any[]>;
declare function all(object: {
    [name: string]: DojoJS.Thenable<any>;
}): Promise<{
    [name: string]: any;
}>;
export = all;
//# sourceMappingURL=all.d.ts.map