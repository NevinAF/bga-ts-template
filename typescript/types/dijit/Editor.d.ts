import "dojo/i18n";
declare var Editor: DojoJS.DojoClass<DijitJS._Widget & [DijitJS._CssStateMixin] & {
    constructor: (e: any) => void;
    baseClass: string;
    inheritWidth: boolean;
    focusOnLoad: boolean;
    name: string;
    styleSheets: string;
    height: string;
    minHeight: string;
    isClosed: boolean;
    isLoaded: boolean;
    _SEPARATOR: string;
    _NAME_CONTENT_SEP: string;
    onLoadDeferred: null;
    isTabIndent: boolean;
    disableSpellCheck: boolean;
    postCreate: () => void;
    startup: () => void;
    setupDefaultShortcuts: () => void;
    events: string[];
    captureEvents: never[];
    _editorCommandsLocalized: boolean;
    _localizeEditorCommands: () => void;
    open: (e: any) => void;
    _local2NativeFormatNames: {};
    _native2LocalFormatNames: {};
    _getIframeDocTxt: () => string;
    _applyEditingAreaStyleSheets: () => string;
    addStyleSheet: (t: any) => void;
    removeStyleSheet: (t: any) => void;
    disabled: boolean;
    _mozSettingProps: {
        styleWithCSS: boolean;
    };
    _setDisabledAttr: (e: any) => void;
    onLoad: (t: any) => void;
    onKeyDown: (t: any) => true;
    onKeyUp: () => void;
    setDisabled: (e: any) => void;
    _setValueAttr: (e: any) => void;
    _setDisableSpellCheckAttr: (e: any) => void;
    addKeyHandler: (e: any, t: any, i: any, n: any) => void;
    onKeyPressed: () => void;
    onClick: (e: any) => void;
    _onIEMouseDown: () => void;
    _onBlur: (e: any) => void;
    _onFocus: (e: any) => void;
    blur: () => void;
    focus: () => void;
    updateInterval: number;
    _updateTimer: null;
    onDisplayChanged: () => void;
    onNormalizedDisplayChanged: () => void;
    onChange: () => void;
    _normalizeCommand: (e: any, t: any) => any;
    _implCommand: (e: any) => string;
    _qcaCache: {};
    queryCommandAvailable: (e: any) => any;
    _queryCommandAvailable: (e: any) => number | boolean | undefined;
    execCommand: (e: any, t: any) => any;
    queryCommandEnabled: (e: any) => any;
    queryCommandState: (e: any) => any;
    queryCommandValue: (e: any) => any;
    _sCall: (e: any, t: any) => any;
    placeCursorAtStart: () => void;
    placeCursorAtEnd: () => void;
    getValue: (e: any) => any;
    _getValueAttr: () => any;
    setValue: (e: any) => void;
    replaceValue: (e: any) => void;
    _preFilterContent: (t: any) => any;
    _preDomFilterContent: (t: any) => void;
    _postFilterContent: (t: any, i: any) => any;
    _saveContent: () => void;
    escapeXml: (e: any, t: any) => any;
    getNodeHtml: (e: any) => any;
    getNodeChildrenHtml: (e: any) => any;
    close: (e: any) => void;
    destroy: () => void;
    _removeMozBogus: (e: any) => any;
    _removeWebkitBogus: (e: any) => any;
    _normalizeFontStyle: (e: any) => any;
    _preFixUrlAttributes: (e: any) => any;
    _browserQueryCommandEnabled: (e: any) => any;
    _createlinkEnabledImpl: () => boolean;
    _unlinkEnabledImpl: () => any;
    _inserttableEnabledImpl: () => any;
    _cutEnabledImpl: () => boolean;
    _copyEnabledImpl: () => boolean;
    _pasteEnabledImpl: () => any;
    _inserthorizontalruleImpl: (e: any) => any;
    _unlinkImpl: (e: any) => any;
    _hilitecolorImpl: (e: any) => any;
    _backcolorImpl: (e: any) => boolean;
    _forecolorImpl: (e: any) => boolean;
    _inserthtmlImpl: (e: any) => boolean;
    _boldImpl: (e: any) => boolean;
    _italicImpl: (e: any) => boolean;
    _underlineImpl: (e: any) => boolean;
    _strikethroughImpl: (e: any) => boolean;
    _superscriptImpl: (e: any) => boolean;
    _subscriptImpl: (e: any) => boolean;
    _fontnameImpl: (e: any) => any;
    _fontsizeImpl: (e: any) => any;
    _insertorderedlistImpl: (e: any) => boolean;
    _insertunorderedlistImpl: (e: any) => boolean;
    getHeaderHeight: () => number;
    getFooterHeight: () => number;
    _getNodeChildrenHeight: (e: any) => number;
    _isNodeEmpty: (e: any, t: any) => any;
    _removeStartingRangeFromRange: (e: any, t: any) => any;
    _adaptIESelection: () => void;
    _adaptIEFormatAreaAndExec: (t: any) => boolean | undefined;
    _adaptIEList: (e: any) => boolean;
    _handleTextColorOrProperties: (e: any, t: any) => boolean;
    _adjustNodeAndOffset: (e: any, t: any) => {
        node: any;
        offset: any;
    };
    _tagNamesForCommand: (e: any) => string[];
    _stripBreakerNodes: (e: any) => any;
    _stripTrailingEmptyNodes: (e: any) => any;
    _setTextDirAttr: (e: any) => void;
} & {
    plugins: null;
    extraPlugins: null;
    constructor: () => void;
    postMixInProperties: () => void;
    postCreate: () => void;
    startup: () => void;
    destroy: () => void;
    addPlugin: (t: any, i: any) => void;
    resize: (e: any) => void;
    layout: () => void;
    _onIEMouseDown: (e: any) => void;
    onBeforeActivate: () => void;
    onBeforeDeactivate: (e: any) => void;
    customUndo: boolean;
    editActionInterval: number;
    beginEditing: (e: any) => void;
    _steps: never[];
    _undoedSteps: never[];
    execCommand: (e: any) => any;
    _pasteImpl: () => any;
    _cutImpl: () => any;
    _copyImpl: () => any;
    _clipboardCommand: (e: any) => any;
    queryCommandEnabled: (e: any) => any;
    _moveToBookmark: (e: any) => void;
    _changeToStep: (e: any, t: any) => void;
    undo: () => boolean;
    redo: () => boolean;
    endEditing: (e: any) => void;
    _getBookmark: () => any;
    _beginEditing: () => void;
    _endEditing: () => void;
    onKeyDown: (e: any) => void;
    _onBlur: () => void;
    _saveSelection: () => void;
    _restoreSelection: () => void;
    onClick: () => void;
    replaceValue: (e: any) => void;
    _setDisabledAttr: (e: any) => void;
    _setStateClass: () => void;
}, [...any[], e: any]>;
declare global {
    namespace DojoJS {
        interface DojoDijit {
            Editor: typeof Editor;
        }
    }
}
export = Editor;
//# sourceMappingURL=Editor.d.ts.map