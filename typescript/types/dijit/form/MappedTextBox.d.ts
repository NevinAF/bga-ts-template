declare var MappedTextBox: DijitJS.form.MappedTextBoxConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            MappedTextBox: typeof MappedTextBox;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = MappedTextBox;
//# sourceMappingURL=MappedTextBox.d.ts.map