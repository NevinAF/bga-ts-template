import "exports";
import Deferred = require("../Deferred");
declare class Util {
    private static c;
    private static l;
    private static f;
    deepCopy<T extends Record<string, any>, S extends Record<string, any>>(target: T, source: S): T & S;
    deepCopyArray<T>(t: T[]): T[];
    deepCreate<T extends Record<string, any>, P extends Record<string, any>>(source: T, properties?: P): T & P;
    deferred<T>(response: DojoJS.Response<T>, cancel: (def: Deferred<DojoJS.Response<T>>, response: DojoJS.Response<T>) => void, isValid: (response: DojoJS.Response<T>) => boolean, isReady: (response: DojoJS.Response<T>) => boolean, last?: boolean): DojoJS.RequestDeferred<DojoJS.Response<T>>;
    addCommonMethods<T extends Object>(provider: T, methods: string[]): T;
    parseArgs(url: string, options: DojoJS.BaseOptions, skipData?: boolean): ParsedArgs;
    checkStatus(): boolean;
}
interface ParsedArgs {
    url: string;
    options: DojoJS.RequestOptions;
    getHeader(headerName: string): string;
}
declare global {
    namespace DojoJS {
        interface Response<T> extends ParsedArgs {
            xhr?: XMLHttpRequest;
            requestOptions?: DojoJS.BaseOptions & {
                socketPath?: string;
                headers?: {
                    [header: string]: string;
                };
                agent?: string;
                pfx?: any;
                key?: string;
                passphrase?: string;
                cert?: any;
                ca?: any;
                ciphers?: string;
                rejectUnauthorized?: boolean;
                path?: string;
                auth?: string;
                username?: string;
                password?: string;
                socketOptions?: {
                    timeout: number;
                    noDelay: number;
                    keepAlive: number;
                };
            };
            clientRequest?: any;
            hasSocket?: boolean;
            clientResponse?: any;
            status?: number;
            text?: string;
            data?: T;
        }
        interface RequestOptions extends BaseOptions, MethodOptions {
        }
        interface Request {
            /**
             * Send a request using the default transport for the current platform.
             */
            <T>(url: string, options?: RequestOptions): Promise<T>;
            /**
             * Send an HTTP GET request using the default transport for the current platform.
             */
            get<T>(url: string, options?: BaseOptions): Promise<T>;
            /**
             * Send an HTTP POST request using the default transport for the current platform.
             */
            post<T>(url: string, options?: BaseOptions): Promise<T>;
            /**
             * Send an HTTP PUT request using the default transport for the current platform.
             */
            put<T>(url: string, options?: BaseOptions): Promise<T>;
            /**
             * Send an HTTP DELETE request using the default transport for the current platform.
             */
            del<T>(url: string, options?: BaseOptions): Promise<T>;
        }
    }
}
declare const _default: Util;
export = _default;
//# sourceMappingURL=util.d.ts.map