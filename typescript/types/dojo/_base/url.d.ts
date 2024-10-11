declare var n: UrlConstructor;
interface Url {
    uri: string;
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
    user?: string;
    password?: string;
    host?: string;
    port?: string;
    toString(): string;
}
interface UrlConstructor {
    new (...args: any[]): Url;
    prototype: Url;
}
declare global {
    namespace DojoJS {
        interface Dojo {
            _Url: typeof n;
        }
    }
}
export = n;
//# sourceMappingURL=url.d.ts.map