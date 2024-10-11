declare var _ToggleButtonMixin: DojoJS.DojoClass<DijitJS.form._ToggleButtonMixin, []>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _ToggleButtonMixin: typeof _ToggleButtonMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _ToggleButtonMixin;
//# sourceMappingURL=_ToggleButtonMixin.d.ts.map