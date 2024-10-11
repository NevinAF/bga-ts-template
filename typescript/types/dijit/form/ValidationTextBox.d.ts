import "dojo/i18n";
declare var ValidationTextBox: DijitJS.form.ValidationTextBoxConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            ValidationTextBox: typeof ValidationTextBox;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = ValidationTextBox;
//# sourceMappingURL=ValidationTextBox.d.ts.map