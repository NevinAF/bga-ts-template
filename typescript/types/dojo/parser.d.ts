declare var parser: DojoJS.Parser;
declare global {
    namespace DojoJS {
        interface ParserOptions {
        }
        interface ParserObjects {
            ctor?: Constructor<any>;
            types?: string[];
            node: Node;
            scripts?: HTMLScriptElement[];
            inherited?: {
                [prop: string]: any;
            };
        }
        interface InstancesArray extends Array<any>, Promise<any> {
        }
        interface Parser {
            /**
             * Clear cached data.   Used mainly for benchmarking.
             */
            _clearCache(): void;
            /**
             * Convert a `<script type="dojo/method" args="a, b, c"> ... </script>`
             * into a function
             */
            _functionFromScript(node: HTMLScriptElement, attrData: string): Function;
            /**
             * Takes array of nodes, and turns them into class instances and
             * potentially calls a startup method to allow them to connect with
             * any children.
             */
            instantiate(nodes: Node[], mixin?: Object, options?: ParserOptions): any[];
            /**
             * Takes array of objects representing nodes, and turns them into class instances and
             * potentially calls a startup method to allow them to connect with
             * any children.
             */
            _instantiate(nodes: ParserObjects[], mixin?: Object, options?: ParserOptions, returnPromise?: boolean): any[] | Promise<any[]>;
            /**
             * Calls new ctor(params, node), where params is the hash of parameters specified on the node,
             * excluding data-dojo-type and data-dojo-mixins.   Does not call startup().
             */
            construct<T>(ctor: Constructor<T>, node: Node, mixin?: Object, options?: ParserOptions, scripts?: HTMLScriptElement[], inherited?: {
                [prop: string]: any;
            }): Promise<T> | T;
            /**
             * Scan a DOM tree and return an array of objects representing the DOMNodes
             * that need to be turned into widgets.
             */
            scan(root?: Node, options?: ParserOptions): Promise<ParserObjects[]>;
            /**
             * Helper for _scanAMD().  Takes a `<script type=dojo/require>bar: "acme/bar", ...</script>` node,
             * calls require() to load the specified modules and (asynchronously) assign them to the specified global
             * variables, and returns a Promise for when that operation completes.
             *
             * In the example above, it is effectively doing a require(["acme/bar", ...], function(a){ bar = a; }).
             */
            _require(script: HTMLScriptElement, options: ParserOptions): Promise<any>;
            /**
             * Scans the DOM for any declarative requires and returns their values.
             */
            _scanAmd(root?: Node, options?: ParserOptions): Promise<boolean>;
            /**
             * Scan the DOM for class instances, and instantiate them.
             */
            parse(rootNode?: Node, options?: ParserOptions): InstancesArray;
        }
        interface Dojo {
            parser: Parser;
        }
    }
}
export = parser;
//# sourceMappingURL=parser.d.ts.map