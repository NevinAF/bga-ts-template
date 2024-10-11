import d = require("./BackgroundIframe");
interface DialogUnderlay_Template extends DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin, []> {
}
declare class DialogUnderlay_Template {
    node: HTMLElement;
    templateString: string;
    dialogId: string;
    class: string;
    open?: boolean;
    _modalConnects: any[];
    bgIframe?: typeof d;
    _setDialogIdAttr(e: string): void;
    _setClassAttr(e: string): void;
    postCreate(): void;
    layout(): void;
    show(): void;
    hide(): void;
    destroy(): void;
    _onKeyDown(): void;
    static _singleton: DialogUnderlay_Template;
    static show(e: any, t: any): void;
    static hide(): void;
}
declare let DialogUnderlay: DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin & DialogUnderlay_Template, []>;
export = DialogUnderlay;
declare global {
    namespace DojoJS {
        interface Dijit {
            DialogUnderlay: typeof DialogUnderlay;
            _underlay: typeof DialogUnderlay_Template._singleton;
        }
    }
}
//# sourceMappingURL=DialogUnderlay.d.ts.map