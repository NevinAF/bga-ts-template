declare var _ComboBoxMenu: any;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _ComboBoxMenu: typeof _ComboBoxMenu;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _ComboBoxMenu;
//# sourceMappingURL=_ComboBoxMenu.d.ts.map