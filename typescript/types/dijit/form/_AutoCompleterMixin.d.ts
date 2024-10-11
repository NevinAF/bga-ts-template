declare var _AutoCompleterMixin: any;
declare global {
    namespace DojoJS {
        interface DijitForm {
            _AutoCompleterMixin: typeof _AutoCompleterMixin;
        }
        interface Dijit {
            form: DijitForm;
        }
    }
}
export = _AutoCompleterMixin;
//# sourceMappingURL=_AutoCompleterMixin.d.ts.map