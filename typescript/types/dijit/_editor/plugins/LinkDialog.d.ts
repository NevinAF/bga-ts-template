declare var LinkDialog: any, ImgLinkDialog: any;
declare global {
    namespace DojoJS {
        interface Dijit_editorPlugins {
            LinkDialog: typeof LinkDialog;
            ImgLinkDialog: typeof ImgLinkDialog;
        }
        interface Dijit_editor {
            plugins: Dijit_editorPlugins;
        }
        interface Dijit {
            _editor: Dijit_editor;
        }
    }
}
export = LinkDialog;
//# sourceMappingURL=LinkDialog.d.ts.map