import dojo = require("./kernel");
declare global {
    namespace DojoJS {
        interface Dojo {
            /**
             * Alias for the current document. 'doc' can be modified
             * for temporary context shifting. See also withDoc().
             */
            doc: Document;
            /**
             * Return the body element of the specified document or of dojo/_base/window::doc.
             */
            body(doc?: Document): HTMLBodyElement;
            /**
             * changes the behavior of many core Dojo functions that deal with
             * namespace and DOM lookup, changing them to work in a new global
             * context (e.g., an iframe). The varibles dojo.global and dojo.doc
             * are modified as a result of calling this function and the result of
             * `dojo.body()` likewise differs.
             */
            setContext(globalObject: Record<string, any>, globalDocument: Document): void;
            /**
             * Invoke callback with globalObject as dojo.global and
             * globalObject.document as dojo.doc.
             */
            withGlobal<T>(globalObject: Record<string, any>, callback: (...args: any[]) => T, thisObject?: Object, cbArguments?: any[]): T;
            /**
             * Invoke callback with documentObject as dojo/_base/window::doc.
             */
            withDoc<T>(documentObject: Document, callback: (...args: any[]) => T, thisObject?: Object, cbArguments?: any[]): T;
        }
    }
}
export = dojo;
//# sourceMappingURL=window.d.ts.map