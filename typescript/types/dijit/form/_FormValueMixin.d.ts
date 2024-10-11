declare var _FormValueMixin: DojoJS.DojoClass<DijitJS.form._FormWidgetMixin & DijitJS.form._FormValueMixin, []>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _FormValueMixin: typeof _FormValueMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _FormValueMixin;
//# sourceMappingURL=_FormValueMixin.d.ts.map