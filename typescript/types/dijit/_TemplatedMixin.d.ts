declare var _TemplatedMixin: DijitJS._TemplatedMixinConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _TemplatedMixin: typeof _TemplatedMixin;
        }
    }
}
export = _TemplatedMixin;
//# sourceMappingURL=_TemplatedMixin.d.ts.map