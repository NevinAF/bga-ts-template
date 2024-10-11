import when = require("../when");
declare global {
    namespace DojoJS {
        interface Deferred<T> extends Thenable<T> {
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
             * The results of the Defereed
             */
            results: [T, any];
            /**
             * Adds callback and error callback for this deferred instance.
             */
            addCallbacks<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;
            /**
             * Cancels the asynchronous operation
             */
            cancel(): void;
            /**
             * Adds successful callback for this deferred instance.
             */
            addCallback<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null): Deferred<U>;
            /**
             * Adds error callback for this deferred instance.
             */
            addErrback<U>(errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;
            /**
             * Add handler as both successful callback and error callback for this deferred instance.
             */
            addBoth<U>(errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;
            fired: number;
        }
        interface DeferredConstructor {
            /**
             * Deprecated.   This module defines the legacy dojo/_base/Deferred API.
             * New code should use dojo/Deferred instead.
             */
            new <T>(canceller?: (reason: any) => void): Deferred<T>;
            prototype: Deferred<any>;
            /** See {@link when} for more information. */
            when: typeof when;
        }
        interface Dojo {
            Deferred: typeof import("./Deferred");
        }
    }
}
type Deferred<T> = DojoJS.Deferred<T>;
declare const Deferred: DojoJS.DeferredConstructor;
export = Deferred;
//# sourceMappingURL=Deferred.d.ts.map