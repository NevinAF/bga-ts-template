declare var regexp: DojoJS.RegExpModule;
declare global {
    namespace DojoJS {
        interface RegExpModule {
            /**
             * Adds escape sequences for special characters in regular expressions
             */
            escapeString(str: string, except?: string): string;
            /**
             * Builds a regular expression that groups subexpressions
             */
            buildGroupRE(arr: any[] | Object, re: (item: any) => string, nonCapture?: boolean): string;
            /**
             * adds group match to expression
             */
            group(expression: string, nonCapture?: boolean): string;
        }
        interface Dojo {
            regexp: typeof regexp;
        }
    }
}
export = regexp;
//# sourceMappingURL=regexp.d.ts.map