declare var _TextBoxMixin: DojoJS.DojoClass<DijitJS.form._TextBoxMixin<any>> & {
    _setSelectionRange: (e: HTMLInputElement, t: number, i: number) => void;
    selectInputText: (e: string | HTMLElement, t?: number, n?: number) => void;
};
declare global {
    namespace DojoJS {
        interface DijitForm {
            _TextBoxMixin: typeof _TextBoxMixin;
        }
        interface Dijit {
            form: DijitForm;
            _setSelectionRange: typeof _TextBoxMixin._setSelectionRange;
            selectInputText: typeof _TextBoxMixin.selectInputText;
        }
    }
}
export = _TextBoxMixin;
//# sourceMappingURL=_TextBoxMixin.d.ts.map