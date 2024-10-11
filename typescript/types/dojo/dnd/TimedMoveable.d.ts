declare var TimedMoveable: DojoJS.DojoClass<import("../Evented") & DojoJS.dnd.Moveable & DojoJS.dnd.TimedMoveable, []>;
declare global {
    namespace DojoJS {
        interface DojoDND {
            TimedMoveable: typeof TimedMoveable;
        }
        interface Dojo {
            dnd: DojoDND;
        }
    }
}
export = TimedMoveable;
//# sourceMappingURL=TimedMoveable.d.ts.map