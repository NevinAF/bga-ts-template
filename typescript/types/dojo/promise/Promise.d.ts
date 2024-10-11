declare class Promise<T> implements DojoJS.Thenable<T> {
    /**
     * Add new callbacks to the promise.
     */
    then<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null, progback?: ((progress: any) => void) | null): Promise<U>;
    /**
     * Inform the deferred it may cancel its asynchronous operation.
     */
    cancel(reason?: any, strict?: boolean): any;
    /**
     * Checks whether the promise has been resolved.
     */
    isResolved(): boolean;
    /**
     * Checks whether the promise has been rejected.
     */
    isRejected(): boolean;
    /**
     * Checks whether the promise has been resolved or rejected.
     */
    isFulfilled(): boolean;
    /**
     * Checks whether the promise has been canceled.
     */
    isCanceled(): boolean;
    /**
     * Add a callback to be invoked when the promise is resolved
     * or rejected.
     */
    always<U>(callbackOrErrback: (result: T) => U | DojoJS.Thenable<U> | void): Promise<U | void>;
    /**
     * Add new errbacks to the promise. Follows ECMA specification naming.
     */
    catch<U>(errback: (error: any) => U | DojoJS.Thenable<U>): Promise<U>;
    /**
     * Add new errbacks to the promise.
     */
    otherwise<U>(errback: (error: any) => U | DojoJS.Thenable<U>): Promise<U>;
    trace(): this;
    traceRejected(): this;
    toString(): string;
}
declare global {
    namespace DojoJS {
        interface Thenable<T> {
            /**
             * Add new callbacks to the promise.
             */
            then<U>(callback?: ((result: T) => U | Thenable<U>) | null, errback?: ((error: any) => U | Thenable<U> | void) | null, progback?: ((progress: any) => void) | null): Promise<U>;
        }
        type Promise<T> = InstanceType<typeof Promise<T>>;
    }
}
export = Promise;
//# sourceMappingURL=Promise.d.ts.map