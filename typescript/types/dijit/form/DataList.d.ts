declare var DataList: DijitJS.form.DataListConstructor;
declare global {
    namespace DojoJS {
        interface DijitForm {
            DataList: typeof DataList;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = DataList;
//# sourceMappingURL=DataList.d.ts.map