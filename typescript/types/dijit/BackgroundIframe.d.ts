declare global {
    namespace DojoJS {
        interface Dijit {
            BackgroundIframe: Constructor<{
                pop: (...args: any[]) => any;
                push: (...args: any[]) => any;
                resize: (...args: any[]) => any;
                destroy: () => void;
            }>;
        }
    }
}
declare const _default: Constructor<{
    pop: (...args: any[]) => any;
    push: (...args: any[]) => any;
    resize: (...args: any[]) => any;
    destroy: () => void;
}>;
export = _default;
//# sourceMappingURL=BackgroundIframe.d.ts.map