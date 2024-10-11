declare var _DialogMixin: DojoJS.DojoClass<DijitJS._DialogMixin, []>;
declare global {
    namespace DojoJS {
        interface Dijit {
            _DialogMixin: typeof _DialogMixin;
        }
    }
}
export = _DialogMixin;
//# sourceMappingURL=_DialogMixin.d.ts.map