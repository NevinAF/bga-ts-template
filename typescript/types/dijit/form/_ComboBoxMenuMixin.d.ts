declare var _ComboBoxMenuMixin: any;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _ComboBoxMenuMixin: typeof _ComboBoxMenuMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _ComboBoxMenuMixin;
//# sourceMappingURL=_ComboBoxMenuMixin.d.ts.map