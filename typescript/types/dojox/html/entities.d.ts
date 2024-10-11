declare var entities: {
    encode: (e: string, t?: any) => string;
    decode: (e: string, t?: any) => string;
    html: string[][];
    latin: string[][];
};
declare global {
    namespace DojoJS {
        interface DojoHTML {
            entities: typeof entities;
        }
        interface Dojo {
            html: DojoHTML;
        }
    }
}
export = entities;
//# sourceMappingURL=entities.d.ts.map