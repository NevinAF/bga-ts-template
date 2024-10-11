import "../a11yclick";
declare var Button: DijitJS.form.ButtonConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            Button: typeof Button;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = Button;
//# sourceMappingURL=Button.d.ts.map