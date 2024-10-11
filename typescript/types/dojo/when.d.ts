import Promise = require("./promise/Promise");
declare function when<T, U = T>(value: T | Promise<T>, callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null, progback?: ((progress: any) => void) | null): U | Promise<U>;
export = when;
//# sourceMappingURL=when.d.ts.map