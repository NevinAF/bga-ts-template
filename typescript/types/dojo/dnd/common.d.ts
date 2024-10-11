declare var o: DojoJS.dnd.Common;
declare global {
    namespace DojoJS {
        interface DojoDND extends DojoJS.dnd.Common {
        }
        interface Dojo {
            dnd: DojoDND;
        }
    }
}
export = o;
//# sourceMappingURL=common.d.ts.map