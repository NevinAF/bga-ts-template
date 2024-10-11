import Evented = require("dojo/Evented");
declare var s: Evented & {
    _rlh: any;
    getEffectiveBox: (e: any) => any;
};
declare global {
    namespace DojoJS {
    }
}
export = s;
//# sourceMappingURL=Viewport.d.ts.map