import "../NodeList-dom";
import "../NodeList-manipulate";
declare global {
    namespace DojoJS {
        interface IFrameBaseOptions extends DojoJS.BaseOptions {
            form?: HTMLFormElement;
            data?: string | Object;
        }
        interface RequestDeferred<T> extends DojoJS.Deferred<T> {
            response: DojoJS.Response<T>;
            isValid(response: DojoJS.Response<T>): boolean;
            isReady(response: DojoJS.Response<T>): boolean;
            handleResponse(response: DojoJS.Response<T>): DojoJS.Response<T>;
        }
        interface IFrameOptions extends IFrameBaseOptions, DojoJS.MethodOptions {
        }
        interface IFrame {
            <T>(url: string, options: IFrameOptions, returnDeferred: boolean): RequestDeferred<T>;
            <T>(url: string, options?: IFrameOptions): Promise<T>;
            create(name: string, onloadstr?: string, uri?: string): HTMLIFrameElement;
            doc(iframenode: HTMLIFrameElement): Document;
            setSrc(_iframe: HTMLIFrameElement, src: string, replace?: boolean): void;
            _iframeName: string;
            _notifyStart: Function;
            _dfdQueue: RequestDeferred<any>[];
            _currentDfd: RequestDeferred<any>;
            _fireNextRequest(): void;
            /**
             * Send an HTTP GET request using the default transport for the current platform.
             */
            get<T>(url: string, options?: IFrameBaseOptions): Promise<T>;
            /**
             * Send an HTTP POST request using the default transport for the current platform.
             */
            post<T>(url: string, options?: IFrameBaseOptions): Promise<T>;
        }
    }
}
declare const _default: DojoJS.IFrame;
export = _default;
//# sourceMappingURL=iframe.d.ts.map