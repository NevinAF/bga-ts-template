import "dojo/_base/html";
import "../NodeList-dom";
declare var r: DojoJS.NodeListConstructor;
declare global {
    namespace DojoJS {
        interface Dojo {
            NodeList: typeof r;
        }
        interface NodeList<T extends Node> extends ArrayLike<T> {
            connect<K extends keyof DojoJS.AllEvents, M extends keyof DojoJS.Global>(event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never, method: DojoJS.Global extends DojoJS.WithFunc<null, M, [DojoJS.AllEvents[K]]> ? M : never, dontFix?: boolean): this;
            connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<K>>>(event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never, method: M, dontFix?: boolean): this;
            connect<K extends keyof DojoJS.AllEvents, S, M extends keyof any>(...[event, scope, method, dontFix]: [
                T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never,
                ...DojoJS.HitchedPair<S, M, [DojoJS.AllEvents[K]]>,
                boolean?
            ]): this;
            connect<K extends keyof DojoJS.AllEvents, S, M extends DojoJS.BoundFunc<S, [DojoJS.AllEvents[K]]>>(event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never, scope: S, method: M, dontFix?: boolean): this;
            connect<U extends string, M extends keyof DojoJS.Global>(event: T extends DojoJS.ConnectMethodTarget<U> ? U : never, method: DojoJS.Global extends DojoJS.WithFunc<null, M, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]> ? M : never, dontFix?: boolean): this;
            connect<U extends string>(event: T extends DojoJS.ConnectMethodTarget<U> ? U : never, method: DojoJS.BoundFunc<null, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]>, dontFix?: boolean): this;
            connect<U extends string, S, M extends keyof any>(...[event, scope, method, dontFix]: [
                T extends DojoJS.ConnectMethodTarget<U> ? U : never,
                ...DojoJS.HitchedPair<S, M, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]>,
                boolean?
            ]): this;
            connect<U extends string, S>(event: T extends DojoJS.ConnectMethodTarget<U> ? U : never, scope: S, method: DojoJS.BoundFunc<S, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]>, dontFix?: boolean): this;
            coords(includeScroll?: boolean): ArrayLike<{
                w?: number;
                h?: number;
                l?: number;
                t?: number;
                x?: number;
                y?: number;
            }>;
            events: string[];
        }
    }
}
export = r;
//# sourceMappingURL=NodeList.d.ts.map