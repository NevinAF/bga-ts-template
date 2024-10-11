declare var r: DojoJS.DomClass;
declare global {
    namespace DojoJS {
        interface DomClass {
            /**
             * Returns whether or not the specified classes are a portion of the
             * class list currently applied to the node.
             */
            contains(node: Node | string, classStr: string): boolean;
            /**
             * Adds the specified classes to the end of the class list on the
             * passed node. Will not re-apply duplicate classes.
             */
            add(node: Node | string, classStr: string | string[]): void;
            /**
             * Removes the specified classes from node. No `contains()`
             * check is required.
             */
            remove(node: Node | string, classStr?: string | string[]): void;
            /**
             * Replaces one or more classes on a node if not present.
             * Operates more quickly than calling dojo.removeClass and dojo.addClass
             */
            replace(node: Node | string, addClassStr: string | string[], removeClassStr?: string | string[]): void;
            /**
             * Adds a class to node if not present, or removes if present.
             * Pass a boolean condition if you want to explicitly add or remove.
             * Returns the condition that was specified directly or indirectly.
             */
            toggle(node: Node | string, classStr: string | string[], condition?: boolean): boolean;
        }
    }
}
export = r;
//# sourceMappingURL=dom-class.d.ts.map