declare class IoQuery {
    private static t;
    /**
     * takes a name/value mapping object and returns a string representing
     * a URL-encoded version of that object.
     */
    objectToQuery(n: Record<string, any>): string;
    /**
     * Create an object representing a de-serialized query section of a URL.
     */
    queryToObject(t: string): Record<string, any>;
}
declare const _default: IoQuery;
export = _default;
//# sourceMappingURL=io-query.d.ts.map