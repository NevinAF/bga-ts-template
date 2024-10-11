import Evented = require("../Evented");
declare var Moveable: DojoJS.DojoClass<Evented & DojoJS.dnd.Moveable, []>;
declare global {
    namespace DojoJS {
        interface DojoDND {
            Moveable: typeof Moveable;
        }
        interface Dojo {
            dnd: DojoDND;
        }
    }
}
export = Moveable;
//# sourceMappingURL=Moveable.d.ts.map