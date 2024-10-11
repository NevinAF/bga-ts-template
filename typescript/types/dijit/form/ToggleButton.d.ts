declare var ToggleButton: DijitJS.form.ToggleButtonConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            ToggleButton: typeof ToggleButton;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = ToggleButton;
//# sourceMappingURL=ToggleButton.d.ts.map