declare class Attr {
    private static a;
    private static s;
    private static u;
    /**
     * Returns true if the requested attribute is specified on the given element, and false otherwise.
     * @throws {TypeError} if node is not resolved to an element
     */
    has(node: Element | string, name: string): boolean | throws<TypeError>;
    /**
     * Gets the value of the named property from the provided element.
     * @throws {TypeError} if node is not resolved to an element
     */
    get<T extends Element, U extends string>(node: T, name: U): U extends keyof T ? T[U] : unknown;
    get(node: string | Element, name: 'textContent' | 'textcontent'): (string | "") | throws<TypeError>;
    /**
     * Sets the value of a property on an HTML element.
     * @throws {TypeError} if node is not resolved to an element
     */
    set<T extends Element, U extends keyof T>(node: T, name: U, value: T[U]): T;
    set<T extends Element, U extends {
        [K in keyof T]?: T[K];
    }>(node: T, name: U): T;
    /**
     * Removes an attribute from an HTML element.
     * @throws {TypeError} if node is not resolved to an element
     */
    remove(node: Element | string, name: string): void | throws<TypeError>;
    /**
     * Returns the value of a property on an HTML element.
     * @throws {TypeError} if node is not resolved to an element
     */
    getNodeProp(node: Element | string, name: string): any | throws<TypeError>;
}
declare const _default: Attr;
export = _default;
//# sourceMappingURL=dom-attr.d.ts.map