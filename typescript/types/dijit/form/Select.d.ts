import "dojo/i18n";
declare var _SelectMenu: DojoJS.DojoClass<DijitJS.DropDownMenu & {
    autoFocus: boolean;
    buildRendering: () => void;
    postCreate: () => void;
    focus: () => void;
}>, Select: DijitJS.form.SelectConstructor & {
    _Menu: typeof _SelectMenu;
};
declare global {
    namespace DojoJS {
        interface DijitForm {
            _SelectMenu: typeof _SelectMenu;
            Select: typeof Select;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = Select;
//# sourceMappingURL=Select.d.ts.map