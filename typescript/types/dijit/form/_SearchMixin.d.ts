declare var _SearchMixin: DojoJS.DojoClass<DijitJS.form._SearchMixin<any, any, any>, []>;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _SearchMixin: typeof _SearchMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _SearchMixin;
//# sourceMappingURL=_SearchMixin.d.ts.map