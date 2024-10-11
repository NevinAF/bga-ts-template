declare var TextBox: DijitJS.form.TextBoxConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            TextBox: typeof TextBox;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = TextBox;
//# sourceMappingURL=TextBox.d.ts.map