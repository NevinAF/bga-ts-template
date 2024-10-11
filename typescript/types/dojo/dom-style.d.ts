declare global {
    namespace DojoJS {
        interface DomStyle {
            /**
             * Returns a "computed style" object.
             */
            getComputedStyle(node: Node): CSSStyleDeclaration;
            /**
             * Accesses styles on a node.
             */
            get(node: Element | string): CSSStyleDeclaration;
            get<T extends keyof CSSStyleDeclaration>(node: Element | string, name: T): CSSStyleDeclaration[T];
            /**
             * Sets styles on a node.
             */
            set(node: Element | string, props: Partial<CSSStyleDeclaration>): CSSStyleDeclaration;
            set(node: Element | string, name: 'opacity', value: number): number;
            set<T extends keyof CSSStyleDeclaration>(node: Element | string, name: T, value: CSSStyleDeclaration[T]): CSSStyleDeclaration[T];
            /**
             * converts style value to pixels on IE or return a numeric value.
             */
            toPixelValue(element: Element, value: string): number;
        }
    }
}
declare const _default: DojoJS.DomStyle;
export = _default;
//# sourceMappingURL=dom-style.d.ts.map