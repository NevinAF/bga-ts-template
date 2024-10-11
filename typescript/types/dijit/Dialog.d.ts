import "./a11yclick";
declare var DialogBase: DojoJS.DojoClass<DijitJS._TemplatedMixin & DijitJS.form._FormMixin & DijitJS._DialogMixin & [DijitJS._CssStateMixin] & {
    templateString: string;
    baseClass: string;
    cssStateNodes: {
        closeButtonNode: string;
    };
    _setTitleAttr: {
        node: string;
        type: string;
    };
    open: boolean;
    duration: number;
    refocus: boolean;
    autofocus: boolean;
    _firstFocusItem: null;
    _lastFocusItem: null;
    draggable: boolean;
    _setDraggableAttr: (e: any) => void;
    maxRatio: number;
    closable: boolean;
    _setClosableAttr: (e: any) => void;
    postMixInProperties: () => void;
    postCreate: () => void;
    onLoad: () => void;
    focus: () => void;
    _endDrag: () => void;
    _setup: () => void;
    _size: () => void;
    _position: () => void;
    _onKey: (e: any) => void;
    show: () => any;
    hide: () => any;
    resize: (e: any) => void;
    _layoutChildren: () => void;
    destroy: () => void;
}, [params?: (Partial<DijitJS._TemplatedMixin> & ThisType<DijitJS._TemplatedMixin>) | undefined, srcNodeRef?: string | Node | undefined]>;
declare var Dialog: DijitJS.DialogConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _DialogBase: typeof DialogBase;
            Dialog: typeof Dialog;
        }
    }
}
export = Dialog;
//# sourceMappingURL=Dialog.d.ts.map