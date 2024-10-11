declare var _ListBase: DojoJS.DojoClass<DijitJS.form._ListBase, []>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _ListBase: typeof _ListBase;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _ListBase;
//# sourceMappingURL=_ListBase.d.ts.map