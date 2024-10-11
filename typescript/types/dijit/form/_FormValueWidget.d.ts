declare var _FormValueWidgetConstructor: DijitJS.form._FormValueWidgetConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _FormValueWidgetConstructor: typeof _FormValueWidgetConstructor;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _FormValueWidgetConstructor;
//# sourceMappingURL=_FormValueWidget.d.ts.map