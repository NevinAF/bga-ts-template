import t = require("./query");
declare var f: typeof t.NodeList;
declare global {
    namespace DojoJS {
        interface NodeList<T extends Node> extends ArrayLike<T> {
            _normalize(e: any, doc: Document): any;
            _cloneNode(e: Node): Node;
            _place(t: Node[], n: Node, r: string, o: boolean): void;
            /**
             * Gets the position and size of the passed element relative to
             * the viewport (if includeScroll==false), or relative to the
             * document root (if includeScroll==true).
             */
            position(includeScroll?: boolean): ArrayLike<DomGeometryXYBox> | throws<TypeError>;
            /**
             * Gets or sets an attribute on an HTML element.
             */
            attr<U extends string>(name: U): ArrayLike<U extends keyof T ? T[U] : unknown>;
            attr(name: 'textContent' | 'textcontent'): ArrayLike<(string | "")>;
            attr<U extends keyof T>(name: U, value: T[U]): this;
            attr<U extends {
                [K in keyof T]?: T[K];
            }>(name: U): this;
            attr(name: string | Record<string, any>, value?: any): this;
            /**
             * Gets or sets the style of an HTML element.
             */
            style(): this;
            style<U extends keyof CSSStyleDeclaration>(name: U): ArrayLike<CSSStyleDeclaration[U]>;
            style(props: Partial<CSSStyleDeclaration>): this;
            style(name: 'opacity', value: number): this;
            style<U extends keyof CSSStyleDeclaration>(name: U, value: CSSStyleDeclaration[U]): this;
            /**
             * Adds the specified class to every node in the list.
             * @param className The class to add.
             * @returns This NodeList instance.
             */
            addClass(className: string | string[]): this;
            /**
             * Removes the specified class from every node in the list.
             * @param className The class to remove.
             * @returns This NodeList instance.
             */
            removeClass(className: string | string[]): this;
            /**
             * Toggles the specified class on every node in the list.
             * @param className The class to toggle.
             * @returns This NodeList instance.
             */
            toggleClass(classStr: string | string[], condition?: boolean): this;
            /**
             * Replaces the specified class on every node in the list.
             * @param addClass The class to add.
             * @param removeClass The class to remove.
             * @returns This NodeList instance.
             */
            replaceClass(addClassStr: string | string[], removeClassStr?: string | string[]): this;
            /**
             * Empties every node in the list.
             * @returns This NodeList instance.
             */
            empty(): this;
            /**
             * Removes the specified attribute from every node in the list.
             * @param name The attribute to remove.
             * @returns This NodeList instance.
             */
            removeAttr(name: string): this;
            /**
             * returns an object that encodes the width, height, left and top
             * positions of the node's margin box.
             */
            getMarginBox(node: Element | string, computedStyle?: CSSStyleDeclaration): ArrayLike<DomGeometryBox>;
            /**
             * Places every node in the list relative to the first node in the list.
             * @param position The position to place the nodes.
             * @returns This NodeList instance.
             */
            place(position: string): this;
            /**
             * Removes every node in the list from the DOM.
             * @returns This NodeList instance.
             */
            orphan(): this;
            /**
             * Appends every node in the list to the specified node.
             * @param node The node to append to.
             * @param position The position to place the nodes.
             * @returns This NodeList instance.
             */
            adopt(node: Node, position?: string): this;
            /**
             * Filters the list of nodes in the NodeList.
             * @param filter The filter to apply.
             * @returns This NodeList instance.
             */
            filter(filter: string | ((node: T, index: number, array: T[]) => boolean), thisArg?: any): this;
            /**
             * Adds the specified content to every node in the list.
             * @param content The content to add.
             * @param position The position to place the content.
             * @returns This NodeList instance.
             */
            addContent(content: string | Node, position?: string): this;
            addContent(content: NodeList<Node>, position?: string): this;
            addContent(content: NodeList<Node>[], position?: string): this;
        }
    }
}
export = f;
//# sourceMappingURL=NodeList-dom.d.ts.map