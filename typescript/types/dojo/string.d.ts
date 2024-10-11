interface DojoString {
    /**
     * Efficiently escape a string for insertion into HTML (innerHTML or attributes), replacing &, <, >, ", ', and / characters.
     */
    escape(str: string): string;
    /**
     * Efficiently replicate a string `n` times.
     */
    rep(str: string, num: number): string;
    /**
     * Pad a string to guarantee that it is at least `size` length by
     * filling with the character `ch` at either the start or end of the
     * string. Pads at the start, by default.
     */
    pad(text: string, size: number, ch?: string, end?: boolean): string;
    /**
     * Performs parameterized substitutions on a string. Throws an
     * exception if any parameter is unmatched.
     */
    substitute(template: string, map: Object | any[], transform?: (value: any, key: string) => any, thisObject?: Object): string;
    /**
     * Trims whitespace from both sides of the string
     */
    trim(str: string): string;
}
declare var string: DojoString;
declare global {
    namespace DojoJS {
        interface Dojo {
            string: typeof string;
        }
    }
}
export = string;
//# sourceMappingURL=string.d.ts.map