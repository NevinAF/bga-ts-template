declare class Unload {
    private static r;
    /**
     * Registers a function to be triggered when window.onunload fires.
     * @deprecated use on(window, "unload", lang.hitch(obj, functionName)) instead.
     */
    addOnWindowUnload(obj: Record<string, any> | Function, functionName?: string | Function): void;
    /**
     * Registers a function to be triggered when the page unloads.
     * @deprecated use on(window, "beforeunload", lang.hitch(obj, functionName))
     */
    addOnUnload(obj: Record<string, any> | Function, functionName?: string | Function): void;
}
declare global {
    namespace DojoJS {
        type Unload = typeof Unload;
        interface Dojo {
            /**
             * Registers a function to be triggered when window.onunload fires.
             * @deprecated use on(window, "unload", lang.hitch(obj, functionName)) instead.
             */
            addOnWindowUnload: InstanceType<Unload>["addOnWindowUnload"];
            /**
             * Registers a function to be triggered when the page unloads.
             * @deprecated use on(window, "beforeunload", lang.hitch(obj, functionName))
             */
            addOnUnload: InstanceType<Unload>["addOnUnload"];
            windowUnloaded?: () => void;
        }
    }
}
declare var unload: Unload;
export = unload;
//# sourceMappingURL=unload.d.ts.map