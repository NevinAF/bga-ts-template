declare var global_result: Window & typeof globalThis;
export = global_result;
declare global {
    namespace DojoJS {
        type Global = typeof global_result;
    }
    /**
     * The global object used for dojo. If undefined, dojo will use try to use 'window', then 'self', then the global 'this'.
     */
    var global: (Window & typeof globalThis) | undefined | Function;
}
//# sourceMappingURL=global.d.ts.map