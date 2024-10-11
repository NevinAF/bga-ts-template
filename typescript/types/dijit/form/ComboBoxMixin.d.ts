declare var ComboBoxMixin: DijitJS.form.ComboBoxMixinConstructor<any, any, any>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            ComboBoxMixin: typeof ComboBoxMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = ComboBoxMixin;
//# sourceMappingURL=ComboBoxMixin.d.ts.map