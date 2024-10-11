declare var _window: WindowModule;
interface WindowModule {
    /**
     * Returns the dimensions and scroll position of the viewable area of a browser window
     */
    getBox(doc?: Document): {
        l: number;
        t: number;
        w: number;
        h: number;
    };
    /**
     * Get window object associated with document doc.
     */
    get(doc?: Document): Window;
    /**
     * Scroll the passed node into view using minimal movement, if it is not already.
     */
    scrollIntoView(node: Element, pos?: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): void;
}
declare global {
    namespace DojoJS {
        interface Dojo {
            window: WindowModule;
        }
    }
}
export = _window;
//# sourceMappingURL=window.d.ts.map