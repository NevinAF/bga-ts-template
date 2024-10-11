import "exports";
declare class Props {
    private static u;
    private static c;
    private static l;
    private static f;
    names: Record<string, string>;
    /**
     * Gets a property on an HTML element.
     * @throws {TypeError} if node is not resolved to an element
     */
    get<T extends Element, U extends string>(node: T, name: U): U extends keyof T ? T[U] : undefined;
    get(node: string | Element, name: 'textContent' | 'textcontent'): (string | "") | throws<TypeError>;
    /**
     * Sets a property on an HTML element.
     * @throws {TypeError} if node is not resolved to an element
     */
    set<T extends Element, U extends keyof T>(node: T, name: U, value: T[U]): T;
    set<T extends Element, U extends {
        [K in keyof T]?: T[K];
    }>(node: T, name: U): T;
}
declare const _default: Props;
export = _default;
//# sourceMappingURL=dom-prop.d.ts.map