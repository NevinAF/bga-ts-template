declare var _ListMouseMixin: DojoJS.DojoClass<DijitJS.form._ListBase & DijitJS.form._ListMouseMixin, []>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _ListMouseMixin: typeof _ListMouseMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _ListMouseMixin;
//# sourceMappingURL=_ListMouseMixin.d.ts.map