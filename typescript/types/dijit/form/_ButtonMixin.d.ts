declare var _ButtonMixin: DojoJS.DojoClass<DijitJS.form._ButtonMixin, []>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _ButtonMixin: typeof _ButtonMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _ButtonMixin;
//# sourceMappingURL=_ButtonMixin.d.ts.map