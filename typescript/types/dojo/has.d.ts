declare global {
    namespace DojoJS {
        interface Has {
            /**
             * Return the current value of the named feature.
             * @param {string | number} name The name (if a string) or identifier (if an integer) of the feature to test.
             */
            (name: string | number): any;
            (name: 'host-browser'): boolean;
            (name: 'host-node'): any;
            (name: 'host-rhino'): boolean;
            (name: 'dom'): boolean;
            (name: 'dojo-dom-ready-api'): 1;
            (name: 'dojo-sniff'): 1;
            (name: 'dom-addeventlistener'): void | boolean;
            (name: 'touch'): void | boolean;
            (name: 'touch-events'): void | boolean;
            (name: 'pointer-events'): void | boolean;
            (name: 'MSPointer'): void | boolean;
            (name: 'device-width'): void | number;
            (name: 'dom-attributes-explicit'): void | boolean;
            (name: 'dom-attributes-specified-flag'): void | boolean;
            (name: 'config-selectorEngine'): string;
            cache: Record<string, any>;
            /**
             * Register a new feature test for some named feature.
             */
            add(name: string | number, test: (global: Window & typeof globalThis, doc?: Document, element?: Element) => any, now?: boolean, force?: boolean): any;
            add<T extends (Object | string | number | boolean | null | void)>(name: string | number, test: T, now?: boolean, force?: boolean): any;
            /**
             * Deletes the contents of the element passed to test functions.
             */
            clearElement(element: HTMLElement): HTMLElement;
            /**
             * Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
             */
            normalize(id: string, toAbsMid: Function): string;
            /**
             * Conditional loading of AMD modules based on a has feature test value.
             */
            load(id: string, parentRequire: Function, loaded: Function): void;
        }
    }
}
declare var r: DojoJS.Has;
export = r;
//# sourceMappingURL=has.d.ts.map