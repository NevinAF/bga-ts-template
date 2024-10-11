import Evented = require("dojo/Evented");
declare var Mover: DojoJS.DojoClass<Evented, []>;
declare global {
    namespace DojoJS {
        interface DojoDND {
            Mover: typeof Mover;
        }
        interface Dojo {
            dnd: DojoDND;
        }
    }
}
export = Mover;
//# sourceMappingURL=Mover.d.ts.map