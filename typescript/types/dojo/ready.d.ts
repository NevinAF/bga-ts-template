/**
 * Add a function to execute on DOM content loaded and all requested modules have arrived and been evaluated.
 * In most cases, the `domReady` plug-in should suffice and this method should not be needed.
 *
 * When called in a non-browser environment, just checks that all requested modules have arrived and been
 * evaluated.
 */
declare function ready(callback: Function): any;
declare function ready(context: Object, callback: Function | string): void;
declare function ready(priority: number, callback: Function): void;
declare function ready(priority: number, context: Object, callback: Function | string): void;
declare global {
    namespace DojoJS {
        interface Dojo {
            ready: typeof ready;
            addOnLoad: typeof ready;
            _postLoad: boolean;
        }
    }
}
export = ready;
//# sourceMappingURL=ready.d.ts.map