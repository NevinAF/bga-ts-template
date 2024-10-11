interface NodeListFilterCallback<T extends Node> {
    (item: T, idx: number, nodeList: this): boolean;
}
type NodeListFilter<T extends Node> = string | NodeListFilterCallback<T>;
declare global {
    namespace DojoJS {
        interface Dojo {
            /**
             * Provides a mechanism to filter a NodeList based on a selector or filtering function.
             */
            query: Query;
        }
        interface NodeListConstructor {
            new <T extends Node>(array: number | Array<T>): DojoJS.NodeList<T>;
            new <T extends Node>(...args: T[]): DojoJS.NodeList<T>;
            <T extends Node>(array: number | Array<T>): DojoJS.NodeList<T>;
            <T extends Node>(...args: T[]): DojoJS.NodeList<T>;
            prototype: NodeList<any>;
            /**
             * decorate an array to make it look like a `dojo/NodeList`.
             */
            _wrap<U extends Node, V extends Node>(a: U[], parent?: DojoJS.NodeList<V>, NodeListCtor?: NodeListConstructor): DojoJS.NodeList<U>;
            /**
             * adapts a single node function to be used in the map-type
             * actions. The return is a new array of values, as via `dojo/_base/array.map`
             */
            _adaptAsMap<T extends Node, U extends Node>(f: (node: T) => U, o?: Object): DojoJS.NodeList<U>;
            /**
             * adapts a single node function to be used in the forEach-type
             * actions. The initial object is returned from the specialized
             * function.
             */
            _adaptAsForEach<T extends Node>(f: (node: T) => void, o?: Object): this;
            /**
             * adapts a single node function to be used in the filter-type actions
             */
            _adaptAsFilter<T extends Node>(f: (node: T) => boolean, o?: Object): this;
            /**
             * adapts a single node function to be used in the map-type
             * actions, behaves like forEach() or map() depending on arguments
             */
            _adaptWithCondition<T extends Node, U extends Node>(f: (node: T) => U | void, g: (...args: any[]) => boolean, o?: Object): DojoJS.NodeList<U> | this;
        }
        interface Query {
            /**
             * Returns nodes which match the given CSS selector, searching the
             * entire document by default but optionally taking a node to scope
             * the search by. Returns an instance of NodeList.
             */
            <T extends Node>(query: string, root?: Node | string): DojoJS.NodeList<T>;
            /**
             * Test to see if a node matches a selector
             */
            matches(node: Node, selector: string, root?: Node | string): boolean;
            /**
             * Filters an array of nodes. Note that this does not guarantee to return a NodeList, just an array.
             */
            filter<T extends Node>(nodes: DojoJS.NodeList<T> | T[], select: string, root?: Node | string): T[] | DojoJS.NodeList<T>;
            /**
             * can be used as AMD plugin to conditionally load new query engine
             */
            load(id: string, parentRequire: Function, loaded: Function): void;
            NodeList: NodeListConstructor;
        }
        interface NodeList<T extends Node> extends ArrayLike<T> {
            /**
             * decorate an array to make it look like a `dojo/NodeList`.
             */
            _wrap<U extends Node, V extends Node>(a: U[], parent?: NodeList<V>, NodeListCtor?: NodeListConstructor): NodeList<U>;
            _NodeListCtor: NodeListConstructor;
            toString(): string;
            /**
             * private function to hold to a parent NodeList. end() to return the parent NodeList.
             */
            _stash(parent: Node): this;
            /**
             * Listen for events on the nodes in the NodeList.
             */
            on(eventName: string, listener: EventListener): Handle[];
            /**
             * Ends use of the current `NodeList` by returning the previous NodeList
             * that generated the current NodeList.
             */
            end<U extends Node>(): NodeList<U>;
            /**
             * Returns a new NodeList, maintaining this one in place
             */
            slice(begin: number, end?: number): this;
            /**
             * Returns a new NodeList, manipulating this NodeList based on
             * the arguments passed, potentially splicing in new elements
             * at an offset, optionally deleting elements
             */
            splice(index: number, howmany?: number, ...items: T[]): this;
            /**
             * see `dojo/_base/array.indexOf()`. The primary difference is that the acted-on
             * array is implicitly this NodeList
             */
            indexOf(value: T, fromIndex?: number, findLast?: boolean): number;
            /**
             * see `dojo/_base/array.lastIndexOf()`. The primary difference is that the
             * acted-on array is implicitly this NodeList
             */
            lastIndexOf(value: T, fromIndex?: number): number;
            /**
             * see `dojo/_base/array.every()` and the [Array.every
             * docs](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every).
             * Takes the same structure of arguments and returns as
             * dojo/_base/array.every() with the caveat that the passed array is
             * implicitly this NodeList
             */
            every(callback: (item: T, idx: number, nodeList: this) => boolean | string, thisObj?: Object): boolean;
            /**
             * Takes the same structure of arguments and returns as
             * `dojo/_base/array.some()` with the caveat that the passed array as
             * implicitly this NodeList.  See `dojo/_base/array.some()` and Mozillaas
             * [Array.soas
             * documentation](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some).
             */
            some(callback: (item: T, idx: number, nodeList: this) => boolean | string, thisObj?: Object): boolean;
            /**
             * Returns a new NodeList comprised of items in this NodeList
             * as well as items passed in as parameters
             */
            concat(...items: T[]): this;
            /**
             * see `dojo/_base/array.map()`. The primary difference is that the acted-on
             * array is implicitly this NodeList and the return is a
             * NodeList (a subclass of Array)
             */
            map<U extends Node>(func: (item: T, idx: number, nodeList: this) => U, obj?: Object): NodeList<U>;
            /**
             * see `dojo/_base/array.forEach()`. The primary difference is that the acted-on
             * array is implicitly this NodeList. If you want the option to break out
             * of the forEach loop, use every() or some() instead.
             */
            forEach(callback: (item: T, idx: number, nodeList: this) => void, thisObj?: Object): this;
            /**
             * "masks" the built-in javascript filter() method (supported
             * in Dojo via `dojo/_base/array.filter`) to support passing a simple
             * string filter in addition to supporting filtering function
             * objects.
             */
            filter<U extends Node>(filter: NodeListFilter<T>, thisObj?: Object): NodeList<U>;
            /**
             * Create a new instance of a specified class, using the
             * specified properties and each node in the NodeList as a
             * srcNodeRef.
             */
            instantiate(declaredClass: string | Constructor<any>, properties?: Object): this;
            /**
             * Returns a new NodeList comprised of items in this NodeList
             * at the given index or indices.
             */
            at(...indices: number[]): this;
        }
    }
}
declare const _default: DojoJS.Query;
export = _default;
//# sourceMappingURL=query.d.ts.map