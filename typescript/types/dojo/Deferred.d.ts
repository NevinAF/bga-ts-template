import Promise = require("./promise/Promise");
type Deferred<T> = {
    /**
     * The public promise object that clients can add callbacks to.
     */
    promise: Promise<T>;
    /**
     * Checks whether the deferred has been resolved.
     */
    isResolved(): boolean;
    /**
     * Checks whether the deferred has been rejected.
     */
    isRejected(): boolean;
    /**
     * Checks whether the deferred has been resolved or rejected.
     */
    isFulfilled(): boolean;
    /**
     * Checks whether the deferred has been canceled.
     */
    isCanceled(): boolean;
    /**
     * Emit a progress update on the deferred.
     */
    progress(update: any, strict?: boolean): Promise<T>;
    /**
     * Resolve the deferred.
     */
    resolve(value?: T, strict?: boolean): Promise<T>;
    /**
     * Reject the deferred.
     */
    reject(error?: any, strict?: boolean): Promise<T>;
    /**
     * Inform the deferred it may cancel its asynchronous operation.
     */
    cancel(reason?: any, strict?: boolean): any;
    /**
     * Returns `[object Deferred]`.
     */
    toString(): string;
} & Promise<T>['then'];
interface DeferredConstructor {
    /**
     * Creates a new deferred. This API is preferred over
     * `dojo/_base/Deferred`.
     */
    new <T>(canceller?: (reason: any) => void): Deferred<T>;
    prototype: Deferred<any>;
    instrumentRejected: any;
}
type _Deferred<T> = Deferred<T>;
declare const _Deferred: DeferredConstructor;
export = _Deferred;
//# sourceMappingURL=Deferred.d.ts.map