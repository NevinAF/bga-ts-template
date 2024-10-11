declare var iframe: IFrame;
interface IFrameIoArgs extends DojoJS.IoArgs {
    /**
     * The HTTP method to use. "GET" or "POST" are the only supported
     * values.  It will try to read the value from the form node's
     * method, then try this argument. If neither one exists, then it
     * defaults to POST.
     */
    method?: string;
    /**
     * Specifies what format the result data should be given to the
     * load/handle callback. Valid values are: text, html, xml, json,
     * javascript. IMPORTANT: For all values EXCEPT html and xml, The
     * server response should be an HTML file with a textarea element.
     * The response data should be inside the textarea element. Using an
     * HTML document the only reliable, cross-browser way this
     * transport can know when the response has loaded. For the html
     * handleAs value, just return a normal HTML document.  NOTE: xml
     * is now supported with this transport (as of 1.1+); a known issue
     * is if the XML document in question is malformed, Internet Explorer
     * will throw an uncatchable error.
     */
    handleAs?: string;
    /**
     * If "form" is one of the other args properties, then the content
     * object properties become hidden form form elements. For
     * instance, a content object of {name1 : "value1"} is converted
     * to a hidden form element with a name of "name1" and a value of
     * "value1". If there is not a "form" property, then the content
     * object is converted into a name=value&name=value string, by
     * using xhr.objectToQuery().
     */
    content?: Object;
}
interface IFrame {
    /**
     * Creates a hidden iframe in the page. Used mostly for IO
     * transports.  You do not need to call this to start a
     * dojo/io/iframe request. Just call send().
     */
    create(fname: string, onloadstr: string, uri: string): HTMLIFrameElement;
    /**
     * Sets the URL that is loaded in an IFrame. The replace parameter
     * indicates whether location.replace() should be used when
     * changing the location of the iframe.
     */
    setSrc(iframe: HTMLIFrameElement, src: string, replace?: boolean): void;
    /**
     * Returns the document object associated with the iframe DOM Node argument.
     */
    doc(iframeNode: HTMLIFrameElement): Document;
    /**
     * Function that sends the request to the server.
     * This transport can only process one send() request at a time, so if send() is called
     * multiple times, it will queue up the calls and only process one at a time.
     */
    send<T>(args: IFrameIoArgs): DojoJS.Deferred<T>;
    _iframeOnload: any;
}
declare global {
    namespace DojoJS {
        interface DojoIo {
            iframe: typeof iframe;
        }
        interface Dojo {
            io: DojoIo;
        }
    }
}
export = iframe;
//# sourceMappingURL=iframe.d.ts.map