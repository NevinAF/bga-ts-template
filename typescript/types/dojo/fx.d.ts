declare var dfx: DojoJS.DojoFx;
declare global {
    namespace DojoJS {
        interface DojoFx extends Type<typeof import("dojo/_base/fx")> {
        }
        interface Dojo {
            fx: DojoFx;
        }
    }
}
export = dfx;
//# sourceMappingURL=fx.d.ts.map