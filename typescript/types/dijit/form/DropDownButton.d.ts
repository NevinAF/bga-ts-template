import "../a11yclick";
declare var DropDownButton: DijitJS.form.DropDownButtonConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            DropDownButton: typeof DropDownButton;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = DropDownButton;
//# sourceMappingURL=DropDownButton.d.ts.map