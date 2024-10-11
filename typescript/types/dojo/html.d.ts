type Promise<T> = typeof import("dojo/promise/Promise")<T>;
declare var html: Html;
type ContentSetterContent = string | Node | ArrayLike<Node>;
interface ContentSetterParams {
    node?: Node | string;
    content?: ContentSetterContent;
    id?: string;
    cleanContent?: boolean;
    extractContent?: boolean;
    parseContent?: boolean;
    parserScope?: boolean;
    startup?: boolean;
    onBegin?: Function;
    onEnd?: Function;
    tearDown?: Function;
    onContentError?: Function;
    onExecError?: Function;
}
interface ContentSetter {
    /**
     * An node which will be the parent element that we set content into
     */
    node: Node | string;
    /**
     * The content to be placed in the node. Can be an HTML string, a node reference, or a enumerable list of nodes
     */
    content: ContentSetterContent;
    /**
     * Usually only used internally, and auto-generated with each instance
     */
    id: string;
    /**
     * Should the content be treated as a full html document,
     * and the real content stripped of <html>, <body> wrapper before injection
     */
    cleanContent: boolean;
    /**
     * Should the content be treated as a full html document,
     * and the real content stripped of `<html> <body>` wrapper before injection
     */
    extractContent: boolean;
    /**
     * Should the node by passed to the parser after the new content is set
     */
    parseContent: boolean;
    /**
     * Flag passed to parser.	Root for attribute names to search for.	  If scopeName is dojo,
     * will search for data-dojo-type (or dojoType).  For backwards compatibility
     * reasons defaults to dojo._scopeName (which is "dojo" except when
     * multi-version support is used, when it will be something like dojo16, dojo20, etc.)
     */
    parserScope: string;
    /**
     * Start the child widgets after parsing them.	  Only obeyed if parseContent is true.
     */
    startup: boolean;
    /**
     * front-end to the set-content sequence
     */
    set(cont?: ContentSetterContent, params?: ContentSetterParams): Promise<Node> | Node;
    /**
     * sets the content on the node
     */
    setContent(): void;
    /**
     * cleanly empty out existing content
     */
    empty(): void;
    /**
     * Called after instantiation, but before set();
     * It allows modification of any of the object properties -
     * including the node and content provided - before the set operation actually takes place
     */
    onBegin(): Node;
    /**
     * Called after set(), when the new content has been pushed into the node
     * It provides an opportunity for post-processing before handing back the node to the caller
     * This default implementation checks a parseContent flag to optionally run the dojo parser over the new content
     */
    onEnd(): Node;
    /**
     * manually reset the Setter instance if its being re-used for example for another set()
     */
    tearDown(): void;
    onContentError(): string;
    onExecError(): string;
    _mixin(params: ContentSetterParams): void;
    parseDeferred: DojoJS.Deferred<any[]>;
    /**
     * runs the dojo parser over the node contents, storing any results in this.parseResults
     */
    _parse(): void;
    /**
     * shows user the string that is returned by on[type]Error
     * override/implement on[type]Error and return your own string to customize
     */
    _onError(type: string, err: Error, consoleText?: string): void;
}
interface ContentSetterConstructor extends DojoJS.DojoClass<ContentSetter> {
    new (params?: ContentSetterParams, node?: Node | string): ContentSetter;
}
interface Html {
    /**
     * removes !DOCTYPE and title elements from the html string.
     *
     * khtml is picky about dom faults, you can't attach a style or `<title>` node as child of body
     * must go into head, so we need to cut out those tags
     */
    _secureForInnerHtml(cont: string): string;
    /**
     * Deprecated, should use dojo/dom-constuct.empty() directly, remove in 2.0.
     */
    _emptyNode(node: Node | string): void;
    /**
     * inserts the given content into the given node
     */
    _setNodeContent<T extends Node>(node: Node, cont: string | Node | ArrayLike<T> | number): Node;
    _ContentSetter: ContentSetterConstructor;
    /**
     * inserts (replaces) the given content into the given node. dojo/dom-construct.place(cont, node, "only")
     * may be a better choice for simple HTML insertion.
     */
    set(node: Node, cont?: ContentSetterContent, params?: ContentSetterParams): Promise<Node> | Node;
}
declare global {
    namespace DojoJS {
        interface DojoHTML extends Type<typeof html> {
        }
        interface Dojo {
            html: DojoHTML;
        }
    }
}
export = html;
//# sourceMappingURL=html.d.ts.map