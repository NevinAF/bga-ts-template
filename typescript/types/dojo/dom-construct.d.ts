import "exports";
interface DomConstruct {
    /**
     * instantiates an HTML fragment returning the corresponding DOM.
     */
    toDom(frag: string, doc?: Document): DocumentFragment | Node;
    /**
     * Attempt to insert node into the DOM, choosing from various positioning options.
     * Returns the first argument resolved to a DOM node.
     */
    place(node: Node | string | DocumentFragment, refNode: Node | string, position?: DojoJS.PlacePosition): HTMLElement;
    /**
     * Create an element, allowing for optional attribute decoration
     * and placement.
     */
    create(tag: Node | string, attrs?: Record<string, any>, refNode?: Node | string, pos?: DojoJS.PlacePosition): HTMLElement;
    /**
     * safely removes all children of the node.
     */
    empty(node: Node | string): void;
    /**
     * Removes a node from its parent, clobbering it and all of its
     * children.
     */
    destroy(node: Node | string): void;
}
declare global {
    namespace DojoJS {
        type PlacePosition = 'first' | 'after' | 'before' | 'last' | 'replace' | 'only' | number;
    }
}
declare const _default: DomConstruct;
export = _default;
//# sourceMappingURL=dom-construct.d.ts.map