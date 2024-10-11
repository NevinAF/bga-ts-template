interface AcmeQueryEngine {
    <T extends Node>(query: string, root?: Node | string): T[];
    filter<T extends Node>(nodeList: T[], filter: string, root?: Node | string): T[];
}
declare const _default: AcmeQueryEngine;
export = _default;
//# sourceMappingURL=acme.d.ts.map