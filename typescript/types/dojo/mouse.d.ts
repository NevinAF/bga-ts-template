declare function s(e: any, n: any): (o: any, i: any) => DojoJS.Handle;
declare global {
    namespace DojoJS {
        interface MouseButtons {
            LEFT: 1;
            MIDDLE: 2;
            RIGHT: 4;
            /**
             * Test an event object (from a mousedown event) to see if the left button was pressed.
             */
            isLeft(e: MouseEvent): boolean;
            /**
             * Test an event object (from a mousedown event) to see if the middle button was pressed.
             */
            isMiddle(e: MouseEvent): boolean;
            /**
             * Test an event object (from a mousedown event) to see if the right button was pressed.
             */
            isRight(e: MouseEvent): boolean;
        }
        interface Mouse extends MouseButtons {
            _eventHandler(type: string, selectHandler?: (evt: MouseEvent, listener: EventListener) => void): MouseEvent;
            /**
             * This is an extension event for the mouseenter that IE provides, emulating the
             * behavior on other browsers.
             */
            enter: MouseEvent;
            /**
             * This is an extension event for the mouseleave that IE provides, emulating the
             * behavior on other browsers.
             */
            leave: MouseEvent;
            /**
             * This is an extension event for the mousewheel that non-Mozilla browsers provide,
             * emulating the behavior on Mozilla based browsers.
             */
            wheel: string | ExtensionEvent;
        }
        interface Dojo {
            mouseButtons: MouseButtons;
        }
    }
}
declare const _default: {
    _eventHandler: typeof s;
    enter: (o: any, i: any) => DojoJS.Handle;
    leave: (o: any, i: any) => DojoJS.Handle;
    wheel: string | ((e: any, n: any) => DojoJS.Handle);
    isLeft: ((e: any) => number) | ((e: any) => boolean);
    isMiddle: ((e: any) => number) | ((e: any) => boolean);
    isRight: ((e: any) => number) | ((e: any) => boolean);
};
export = _default;
//# sourceMappingURL=mouse.d.ts.map