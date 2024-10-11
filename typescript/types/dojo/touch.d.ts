interface Touch {
    press: DojoJS.ExtensionEvent;
    move: DojoJS.ExtensionEvent;
    release: DojoJS.ExtensionEvent;
    cancel: DojoJS.ExtensionEvent;
    over: DojoJS.ExtensionEvent;
    out: DojoJS.ExtensionEvent;
    enter: DojoJS.ExtensionEvent;
    leave: DojoJS.ExtensionEvent;
}
declare global {
    namespace DojoJS {
        interface Dojo {
            touch: Touch;
        }
    }
}
declare const _default: Touch;
export = _default;
//# sourceMappingURL=touch.d.ts.map