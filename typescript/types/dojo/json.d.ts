declare class DojoJSON {
    /**
     * Parses a [JSON](http://json.org) string to return a JavaScript object.
     */
    parse: ((text: string, reviver?: (this: any, key: string, value: any) => any) => any) | ((str: string, strict?: boolean) => any);
    /**
     * Returns a [JSON](http://json.org) serialization of an object.
     */
    stringify(e: any, t: any, n: any): string;
}
declare const _default: JSON | DojoJSON;
export = _default;
//# sourceMappingURL=json.d.ts.map