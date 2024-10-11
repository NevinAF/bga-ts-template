declare var Destroyable: DojoJS.DojoClass<{
    destroy: (e: any) => void;
    own: () => IArguments;
}, []>;
declare global {
    namespace DojoJS {
        interface Dijit {
            Destroyable: typeof Destroyable;
        }
    }
}
export = Destroyable;
//# sourceMappingURL=Destroyable.d.ts.map