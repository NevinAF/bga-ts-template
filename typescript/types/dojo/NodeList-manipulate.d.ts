import "./NodeList-dom";
declare global {
    namespace DojoJS {
        interface NodeList<T extends Node> {
            /**
             * private method for inserting queried nodes into all nodes in this NodeList
             * at different positions. Differs from NodeList.place because it will clone
             * the nodes in this NodeList if the query matches more than one element.
             */
            _placeMultiple(query: string | Node | ArrayLike<Node>, position?: PlacePosition): this;
            /**
             * allows setting the innerHTML of each node in the NodeList,
             * if there is a value passed in, otherwise, reads the innerHTML value of the first node.
             */
            innerHTML(): string;
            innerHTML(value: string | Node | ArrayLike<Node>): this;
            /**
             * Allows setting the text value of each node in the NodeList,
             * if there is a value passed in.  Otherwise, returns the text value for all the
             * nodes in the NodeList in one string.
             */
            text(): string;
            text(value: string): this;
            /**
             * If a value is passed, allows setting the value property of form elements in this
             * NodeList, or properly selecting/checking the right value for radio/checkbox/select
             * elements. If no value is passed, the value of the first node in this NodeList
             * is returned.
             */
            val(): string | string[];
            val(value: string | string[]): this;
            /**
             * appends the content to every node in the NodeList.
             */
            append(content: string | Node | ArrayLike<Node>): this;
            /**
             * appends nodes in this NodeList to the nodes matched by
             * the query passed to appendTo.
             */
            appendTo(query: string): this;
            /**
             * prepends the content to every node in the NodeList.
             */
            prepend(content: string | Node | ArrayLike<Node>): this;
            /**
             * prepends nodes in this NodeList to the nodes matched by
             * the query passed to prependTo.
             */
            prependTo(query: string): this;
            /**
             * Places the content after every node in the NodeList.
             */
            after(content: string | Node | ArrayLike<Node>): this;
            /**
             * The nodes in this NodeList will be placed after the nodes
             * matched by the query passed to insertAfter.
             */
            insertAfter(query: string): this;
            /**
             * Places the content before every node in the NodeList.
             */
            before(content: string | Node | ArrayLike<Node>): this;
            /**
             * The nodes in this NodeList will be placed after the nodes
             * matched by the query passed to insertAfter.
             */
            insertBefore(query: string): this;
            /**
             * alias for dojo/NodeList's orphan method. Removes elements
             * in this list that match the simple filter from their parents
             * and returns them as a new NodeList.
             */
            remove(filter?: string | ((item: T, idx: number, nodeList: this) => boolean)): this;
            /**
             * Wrap each node in the NodeList with html passed to wrap.
             */
            wrap(html: Node | string): this;
            /**
             * Insert html where the first node in this NodeList lives, then place all
             * nodes in this NodeList as the child of the html.
             */
            wrapAll(html: Node | string): this;
            /**
             * For each node in the NodeList, wrap all its children with the passed in html.
             */
            wrapInner(html: Node | string): this;
            /**
             * Replaces each node in ths NodeList with the content passed to replaceWith.
             */
            replaceWith<T extends Node>(content: string | Node | ArrayLike<Node>): NodeList<T>;
            /**
             * replaces nodes matched by the query passed to replaceAll with the nodes
             * in this NodeList.
             */
            replaceAll(query: string): this;
            /**
             * Clones all the nodes in this NodeList and returns them as a new NodeList.
             */
            clone(): this;
        }
    }
}
declare const _default: DojoJS.NodeListConstructor;
export = _default;
//# sourceMappingURL=NodeList-manipulate.d.ts.map