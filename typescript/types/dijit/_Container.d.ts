declare var _Container: DijitJS._ContainerConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _Container: typeof _Container;
        }
    }
}
export = _Container;
//# sourceMappingURL=_Container.d.ts.map