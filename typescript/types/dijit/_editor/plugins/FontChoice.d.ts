declare var _FontDropDown: any, _FontNameDropDown: any, _FontSizeDropDown: any, _FormatBlockDropDown: any, FontChoice: any;
declare global {
    namespace DojoJS {
        interface Dijit_editorPlugins {
            _FontDropDown: typeof _FontDropDown;
            _FontNameDropDown: typeof _FontNameDropDown;
            _FontSizeDropDown: typeof _FontSizeDropDown;
            _FormatBlockDropDown: typeof _FormatBlockDropDown;
        }
        interface Dijit_editor {
            plugins: Dijit_editorPlugins;
        }
        interface Dijit {
            _editor: Dijit_editor;
        }
    }
}
export = FontChoice;
//# sourceMappingURL=FontChoice.d.ts.map