declare var _FormSelectWidget: any;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _FormSelectWidget: typeof _FormSelectWidget;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _FormSelectWidget;
//# sourceMappingURL=_FormSelectWidget.d.ts.map