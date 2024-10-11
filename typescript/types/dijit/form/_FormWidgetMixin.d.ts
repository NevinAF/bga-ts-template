declare var _FormWidgetMixin: DojoJS.DojoClass<DijitJS.form._FormWidgetMixin, []>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _FormWidgetMixin: typeof _FormWidgetMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _FormWidgetMixin;
//# sourceMappingURL=_FormWidgetMixin.d.ts.map