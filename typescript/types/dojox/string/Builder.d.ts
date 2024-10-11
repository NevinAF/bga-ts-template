declare var Builder: DojoJS.StringBuilder;
declare global {
    namespace DojoJS {
        interface StringBuilder {
            length: number;
            append: (...args: any[]) => this;
            concat: (...args: any[]) => this;
            appendArray: (e: any[]) => this;
            clear: () => this;
            replace: (e: any, i: any) => this;
            remove: (e: number, i?: number) => this;
            insert: (e: number, i: string) => this;
            toString: () => string;
        }
        interface Dojox_String {
            Builder: {
                new (e: string): StringBuilder;
            };
        }
        interface Dojox {
            string: Dojox_String;
        }
        var dojox: Dojox;
    }
}
export = Builder;
//# sourceMappingURL=Builder.d.ts.map