declare var _MenuBase: DijitJS._MenuBaseConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _MenuBase: typeof _MenuBase;
        }
    }
}
export = _MenuBase;
//# sourceMappingURL=_MenuBase.d.ts.map