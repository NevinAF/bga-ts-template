interface IoCallbackArgs {
    /**
     * the original object argument to the IO call.
     */
    args: Record<string, any>;
    /**
     * For XMLHttpRequest calls only, the
     * XMLHttpRequest object that was used for the
     * request.
     */
    xhr: XMLHttpRequest;
    /**
     * The final URL used for the call. Many times it
     * will be different than the original args.url
     * value.
     */
    url: string;
    /**
     * For non-GET requests, the
     * name1=value1&name2=value2 parameters sent up in
     * the request.
     */
    query: string;
    /**
     * The final indicator on how the response will be
     * handled.
     */
    handleAs: string;
    /**
     * For dojo/io/script calls only, the internal
     * script ID used for the request.
     */
    id?: string;
    /**
     * For dojo/io/script calls only, indicates
     * whether the script tag that represents the
     * request can be deleted after callbacks have
     * been called. Used internally to know when
     * cleanup can happen on JSONP-type requests.
     */
    canDelete?: boolean;
    /**
     * For dojo/io/script calls only: holds the JSON
     * response for JSONP-type requests. Used
     * internally to hold on to the JSON responses.
     * You should not need to access it directly --
     * the same object should be passed to the success
     * callbacks directly.
     */
    json?: Record<string, any>;
}
interface XhrArgs extends DojoJS.IoArgs {
    /**
     * Acceptable values are: text (default), json, json-comment-optional,
     * json-comment-filtered, javascript, xml. See `dojo/_base/xhr.contentHandlers`
     */
    handleAs?: string;
    /**
     * false is default. Indicates whether the request should
     * be a synchronous (blocking) request.
     */
    sync?: boolean;
    /**
     * Additional HTTP headers to send in the request.
     */
    headers?: Record<string, any>;
    /**
     * false is default. Indicates whether a request should be
     * allowed to fail (and therefore no console error message in
     * the event of a failure)
     */
    failOk?: boolean;
    /**
     * "application/x-www-form-urlencoded" is default. Set to false to
     * prevent a Content-Type header from being sent, or to a string
     * to send a different Content-Type.
     */
    contentType: boolean | string;
}
interface ContentHandlers {
    [type: string]: (xhr: {
        responseText?: string;
        responseXML?: string;
    }) => any;
    'text': (xhr: {
        responseText?: string;
    }) => string;
    'json': (xhr: {
        responseText?: string;
    }) => Record<string, any>;
    'json-comment-filtered': (xhr: {
        responseText?: string;
    }) => Record<string, any>;
    'javascript': (xhr: {
        responseText?: string;
    }) => any;
    'xml': (xhr: {
        responseXML?: string;
    }) => Document;
    'json-comment-optional': (xhr: {
        responseText?: string;
    }) => Record<string, any>;
}
interface Xhr {
    (method: string, args: XhrArgs, hasBody?: boolean): DojoJS.Deferred<any>;
    /**
     * does the work of portably generating a new XMLHTTPRequest object.
     */
    _xhrObj(): XMLHttpRequest | any;
    /**
     * Serialize a form field to a JavaScript object.
     */
    fieldToObject(inputNode: HTMLElement | string): Record<string, any>;
    /**
     * Serialize a form node to a JavaScript object.
     */
    formToObject(fromNode: HTMLFormElement | string): Record<string, any>;
    /**
     * takes a name/value mapping object and returns a string representing
     * a URL-encoded version of that object.
     */
    objectToQuery(map: Record<string, any>): string;
    /**
     * Returns a URL-encoded string representing the form passed as either a
     * node or string ID identifying the form to serialize
     */
    formToQuery(fromNode: HTMLFormElement | string): string;
    /**
     * Create a serialized JSON string from a form node or string
     * ID identifying the form to serialize
     */
    formToJson(formNode: HTMLFormElement | string): string;
    /**
     * Create an object representing a de-serialized query section of a
     * URL. Query keys with multiple values are returned in an array.
     */
    queryToObject(str: string): Record<string, any>;
    /**
     * A map of available XHR transport handle types. Name matches the
     * `handleAs` attribute passed to XHR calls.
     */
    contentHandlers: ContentHandlers;
    _ioCancelAll(): void;
    /**
     * If dojo.publish is available, publish topics
     * about the start of a request queue and/or the
     * the beginning of request.
     *
     * Used by IO transports. An IO transport should
     * call this method before making the network connection.
     */
    _ioNotifyStart<T>(dfd: DojoJS.Promise<T>): void;
    /**
     * Watches the io request represented by dfd to see if it completes.
     */
    _ioWatch<T>(dfd: DojoJS.Promise<T>, validCheck: Function, ioCheck: Function, resHandle: Function): void;
    /**
     * Adds query params discovered by the io deferred construction to the URL.
     * Only use this for operations which are fundamentally GET-type operations.
     */
    _ioAddQueryToUrl(ioArgs: IoCallbackArgs): void;
    /**
     * sets up the Deferred and ioArgs property on the Deferred so it
     * can be used in an io call.
     */
    _ioSetArgs(args: DojoJS.IoArgs, canceller: Function, okHandler: Function, errHandler: Function): DojoJS.Deferred<any>;
    _isDocumentOk(x: Document): boolean;
    _getText(url: string): string;
    /**
     * Send an HTTP GET request using the default transport for the current platform.
     */
    get<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
    /**
     * Send an HTTP POST request using the default transport for the current platform.
     */
    post<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
    /**
     * Send an HTTP PUT request using the default transport for the current platform.
     */
    put<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
    /**
     * Send an HTTP DELETE request using the default transport for the current platform.
     */
    del<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
}
type DojoXhr = Omit<Xhr, 'get' | 'post' | 'put' | 'del'> & {
    _blockAsync: boolean;
    _contentHandlers: Xhr['contentHandlers'];
    xhrDelete: Xhr["del"];
    xhrGet: Xhr["get"];
    xhrPost: Xhr["post"];
    xhrPut: Xhr["put"];
    rawXhrPost: Xhr["post"];
    rawXhrPut: Xhr["put"];
    xhr: Xhr;
};
declare global {
    namespace DojoJS {
        interface Dojo extends DojoXhr {
        }
        interface IoArgs {
            /**
             * URL to server endpoint.
             */
            url: string;
            /**
             * Contains properties with string values. These
             * properties will be serialized as name1=value2 and
             * passed in the request.
             */
            content?: Record<string, any>;
            /**
             * Milliseconds to wait for the response. If this time
             * passes, the then error callbacks are called.
             */
            timeout?: number;
            /**
             * DOM node for a form. Used to extract the form values
             * and send to the server.
             */
            form?: HTMLFormElement;
            /**
             * Default is false. If true, then a
             * "dojo.preventCache" parameter is sent in the requesa
             * with a value that changes with each requesa
             * (timestamp). Useful only with GET-type requests.
             */
            preventCache?: boolean;
            /**
             * Acceptable values depend on the type of IO
             * transport (see specific IO calls for more information).
             */
            handleAs?: string;
            /**
             * Sets the raw body for an HTTP request. If this is used, then the content
             * property is ignored. This is mostly useful for HTTP methods that have
             * a body to their requests, like PUT or POST. This property can be used instead
             * of postData and putData for dojo/_base/xhr.rawXhrPost and dojo/_base/xhr.rawXhrPut respectively.
             */
            rawBody?: string;
            /**
             * Set this explicitly to false to prevent publishing of topics related to
             * IO operations. Otherwise, if djConfig.ioPublish is set to true, topics
             * will be published via dojo/topic.publish() for different phases of an IO operation.
             * See dojo/main.__IoPublish for a list of topics that are published.
             */
            ioPublish?: boolean;
            /**
             * This function will be
             * called on a successful HTTP response code.
             */
            load?: (response: any, ioArgs: IoCallbackArgs) => void;
            /**
             * This function will
             * be called when the request fails due to a network or server error, the url
             * is invalid, etc. It will also be called if the load or handle callback throws an
             * exception, unless djConfig.debugAtAllCosts is true.	 This allows deployed applications
             * to continue to run even when a logic error happens in the callback, while making
             * it easier to troubleshoot while in debug mode.
             */
            error?: (response: any, ioArgs: IoCallbackArgs) => void;
            /**
             * This function will
             * be called at the end of every request, whether or not an error occurs.
             */
            handle?: (loadOrError: string, response: any, ioArgs: IoCallbackArgs) => void;
        }
    }
}
declare const _default: Xhr;
export = _default;
//# sourceMappingURL=xhr.d.ts.map