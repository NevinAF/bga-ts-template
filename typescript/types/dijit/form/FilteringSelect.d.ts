declare var FilteringSelect: DijitJS.form.FilteringSelectConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            FilteringSelect: typeof FilteringSelect;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = FilteringSelect;
//# sourceMappingURL=FilteringSelect.d.ts.map