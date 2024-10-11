declare var TextColor: DojoJS.DojoClass<{
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
    buttonClass: DijitJS.form.DropDownButtonConstructor;
    colorPicker: string;
    useDefaultCommand: boolean;
    _initButton: () => void;
    updateState: () => void;
}, [e: any]>;
declare global {
    namespace DojoJS {
        interface Dijit_editorPlugins {
            TextColor: typeof TextColor;
        }
        interface Dijit_editor {
            plugins: Dijit_editorPlugins;
        }
        interface Dijit {
            _editor: Dijit_editor;
        }
    }
}
export = TextColor;
//# sourceMappingURL=TextColor.d.ts.map