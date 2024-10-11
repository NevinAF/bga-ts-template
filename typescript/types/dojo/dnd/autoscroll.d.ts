declare var autoscroll: DojoJS.dnd.AutoScroll;
declare global {
    namespace DojoJS {
        interface DojoDND {
            autoscroll: typeof autoscroll;
        }
        interface Dojo {
            dnd: DojoDND;
        }
    }
}
export = autoscroll;
//# sourceMappingURL=autoscroll.d.ts.map