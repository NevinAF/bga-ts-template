declare var html: {};
declare global {
    namespace DojoJS {
        interface Dijit_editor {
            html: typeof html;
        }
        interface Dijit {
            _editor: Dijit_editor;
        }
    }
}
export = html;
//# sourceMappingURL=html.d.ts.map