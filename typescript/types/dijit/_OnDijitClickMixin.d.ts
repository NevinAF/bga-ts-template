declare var _OnDijitClickMixin: DijitJS._OnDijitClickMixinConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _OnDijitClickMixin: typeof _OnDijitClickMixin;
        }
    }
}
export = _OnDijitClickMixin;
//# sourceMappingURL=_OnDijitClickMixin.d.ts.map