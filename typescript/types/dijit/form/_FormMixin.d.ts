declare var _FormMixin: DojoJS.DojoClass<DijitJS.form._FormMixin, []>;
declare global {
    namespace DojoJS {
        interface Dijit {
            _FormMixin: typeof _FormMixin;
        }
    }
}
export = _FormMixin;
//# sourceMappingURL=_FormMixin.d.ts.map