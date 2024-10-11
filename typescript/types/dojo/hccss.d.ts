import has = require("./has");
declare global {
    namespace DojoJS {
        interface Has {
            (name: 'highcontrast'): void | boolean;
        }
    }
}
export = has;
//# sourceMappingURL=hccss.d.ts.map