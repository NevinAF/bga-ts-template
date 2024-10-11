declare var _Contained: DijitJS._ContainedConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _Contained: typeof _Contained;
        }
    }
}
export = _Contained;
//# sourceMappingURL=_Contained.d.ts.map