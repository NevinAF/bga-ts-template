import "dojo/i18n";
declare var ViewSource: DojoJS.DojoClass<{
    destroy: (e: any) => void;
    own: () => IArguments;
} & {
    constructor: (e: any) => void;
    editor: null;
    iconClassPrefix: string;
    button: null;
    command: string;
    useDefaultCommand: boolean;
    buttonClass: DijitJS.form.ButtonConstructor;
    disabled: boolean;
    getLabel: (e: any) => any;
    _initButton: () => void;
    destroy: () => void;
    connect: (t: any, i: any, n: any) => void;
    updateState: () => void;
    setEditor: (e: any) => void;
    setToolbar: (e: any) => void;
    set: (e: any, t: any) => any;
    get: (e: any) => any;
    _setDisabledAttr: (e: any) => void;
    _getAttrNames: (e: any) => any;
    _set: (e: any, t: any) => void;
} & {
    stripScripts: boolean;
    stripComments: boolean;
    stripIFrames: boolean;
    stripEventHandlers: boolean;
    readOnly: boolean;
    _fsPlugin: null;
    toggle: () => void;
    _initButton: () => void;
    setEditor: (e: any) => void;
    _showSource: (i: any) => void;
    updateState: () => void;
    _resize: () => void;
    _createSourceView: () => void;
    _stripScripts: (e: any) => any;
    _stripComments: (e: any) => any;
    _stripIFrames: (e: any) => any;
    _stripEventHandlers: (e: any) => any;
    _filter: (e: any) => any;
    setSourceAreaCaret: () => void;
    destroy: () => void;
}, [e: any]>;
declare global {
    namespace DojoJS {
        interface Dijit_editorPlugins {
            ViewSource: typeof ViewSource;
        }
        interface Dijit_editor {
            plugins: Dijit_editorPlugins;
        }
        interface Dijit {
            _editor: Dijit_editor;
        }
    }
}
export = ViewSource;
//# sourceMappingURL=ViewSource.d.ts.map