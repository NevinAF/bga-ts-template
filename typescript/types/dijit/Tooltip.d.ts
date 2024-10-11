declare var v: DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin & {
    duration: number;
    templateString: {
        dynamic: boolean;
        normalize: (e: any, t: any) => string;
        load: (e: any, t: any, i: any) => void;
    };
    postCreate: () => void;
    show: (e: any, t: any, i: any, n: any, o: any, a: any, l: any) => void;
    orient: (e: any, t: any, i: any, n: any, o: any) => number;
    _onShow: () => void;
    hide: (e: any) => void;
    _onHide: () => void;
}, any[]>;
declare var x: DijitJS.TooltipConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            Tooltip: typeof x;
            _MasterTooltip: typeof v;
            showTooltip: (innerHTML: string, aroundNode: {
                x: number;
                y: number;
                w: number;
                h: number;
            }, position?: DijitJS.PlacePositions[], rtl?: boolean, textDir?: string, onMouseEnter?: Function, onMouseLeave?: Function) => void;
            hideTooltip: (aroundNode: {
                x: number;
                y: number;
                w: number;
                h: number;
            }) => void;
        }
    }
}
export = x;
//# sourceMappingURL=Tooltip.d.ts.map