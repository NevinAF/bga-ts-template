import dojo = require("./kernel");
declare global {
    namespace DojoJS {
        interface Dojo {
            fromJson<T>(js: string): T;
            _escapeString: (arg0: any, arg1: any, arg2: any) => string;
            toJsonIndentStr: string;
            toJson(e: any, t?: any): string;
        }
    }
}
export = dojo;
//# sourceMappingURL=json.d.ts.map