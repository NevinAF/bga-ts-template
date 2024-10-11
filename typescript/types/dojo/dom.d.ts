interface Dom {
    /**
     * Returns DOM node with matching `id` attribute or falsy value (ex: null or undefined)
     * if not found. Internally if `id` is not a string then `id` returned.
     */
    byId(falsy: Falsy, _?: any): null;
    byId<E extends HTMLElement>(id: string, doc?: Document): E | null;
    byId<T>(passthrough: Exclude<T, string>, _?: any): T;
    byId<E extends HTMLElement>(id: string | E, doc?: Document): E | null;
    byId<T, E extends HTMLElement>(id_or_any: T, doc?: Document): T extends string ? (E | null) : T extends Falsy ? null : T;
    /**
     * Returns true if node is a descendant of ancestor
     */
    isDescendant(node: Node | string, ancestor: Node | string): boolean;
    /**
     * Enable or disable selection on a node
     */
    setSelectable(node: Element | string, selectable?: boolean): void;
}
declare const _default: Dom;
export = _default;
//# sourceMappingURL=dom.d.ts.map