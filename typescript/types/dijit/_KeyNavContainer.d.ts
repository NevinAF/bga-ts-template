declare var _KeyNavContainer: DijitJS._KeyNavContainerConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _KeyNavContainer: typeof _KeyNavContainer;
        }
    }
}
export = _KeyNavContainer;
//# sourceMappingURL=_KeyNavContainer.d.ts.map