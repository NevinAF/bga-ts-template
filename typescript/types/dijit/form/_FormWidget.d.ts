declare var _FormWidgetConstructor: DijitJS.form._FormWidgetConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _FormWidgetConstructor: typeof _FormWidgetConstructor;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _FormWidgetConstructor;
//# sourceMappingURL=_FormWidget.d.ts.map