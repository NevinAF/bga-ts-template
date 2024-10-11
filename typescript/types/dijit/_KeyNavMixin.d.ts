declare var _KeyNavMixin: DijitJS._KeyNavMixinConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _KeyNavMixin: typeof _KeyNavMixin;
        }
    }
}
export = _KeyNavMixin;
//# sourceMappingURL=_KeyNavMixin.d.ts.map