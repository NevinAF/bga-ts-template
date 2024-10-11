declare var s: {
    marginBox2contentBox: (e: any, t: any) => {
        l: number;
        t: number;
        w: number;
        h: number;
    };
    layoutChildren: (i: any, n: any, s: any, r: any, l: any) => void;
};
declare global {
    namespace DojoJS {
        interface _ContentPaneResizeMixin extends Type<typeof s> {
        }
        interface DijitLayout {
            _ContentPaneResizeMixin: _ContentPaneResizeMixin;
        }
        interface Dijit {
            layout: DijitLayout;
        }
    }
}
export = s;
//# sourceMappingURL=utils.d.ts.map