declare global {
    namespace DojoJS {
        interface Dojo {
            config: typeof import("./config");
            global: typeof import("../global");
            dijit: DojoJS.Dijit;
            dojox: DojoxJS.DojoX;
            /**
             * a map from a name used in a legacy module to the (global variable name, object addressed by that name)
             * always map dojo, dijit, and dojox
             */
            scopeMap: {
                [scope: string]: [string, any];
                dojo: [string, Dojo];
                dijit: [string, DojoJS.Dijit];
                dojox: [string, DojoxJS.DojoX];
            };
            baseUrl: string;
            isAsync: boolean;
            locale: string;
            version: {
                major: number;
                minor: number;
                patch: number;
                flag: string;
                revision: number;
                toString(): string;
            };
            /**
             * A legacy method created for use exclusively by internal Dojo methods. Do not use this method
             * directly unless you understand its possibly-different implications on the platforms your are targeting.
             */
            eval(scriptText: string): any;
            exit(exitcode?: number): void;
            /**
             * Log a debug message to indicate that a behavior has been
             * deprecated.
             */
            deprecated(behaviour: string, extra?: string, removal?: string): void;
            /**
             * Marks code as experimental.
             */
            experimental(moduleName: string, extra?: string): void;
            /**
             * Returns a URL relative to a module.
             */
            moduleUrl(module: string, url?: string): any;
            /**
             * for backward compatibility with layers built with 1.6 tooling
             */
            _hasResource: any;
            _scopeName: "dojo";
        }
    }
    namespace DijitJS {
        interface Dijit {
        }
    }
    namespace DojoxJS {
        interface DojoX {
        }
    }
}
declare const _default: DojoJS.Dojo;
export = _default;
//# sourceMappingURL=kernel.d.ts.map