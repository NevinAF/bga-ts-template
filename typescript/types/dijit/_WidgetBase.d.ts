declare var _WidgetBase: DojoJS.DojoClass<DojoJS.Stateful & {
    destroy: (e: any) => void;
    own: () => IArguments;
}, []>;
declare global {
    namespace DojoJS {
        interface Dijit {
            _WidgetBase: typeof _WidgetBase;
        }
    }
}
export = _WidgetBase;
//# sourceMappingURL=_WidgetBase.d.ts.map