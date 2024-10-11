declare var on: DojoJS.On;
declare global {
    namespace DojoJS {
        interface PauseHandle extends Handle {
            pause(): void;
            resume(): void;
        }
        interface MatchesTarget {
            matches(node: Element, selector: string, context?: any): any[];
            [id: string]: any;
        }
        interface On {
            /**
             * A function that provides core event listening functionality. With this function
             * you can provide a target, event type, and listener to be notified of
             * future matching events that are fired.
             */
            (target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): Handle;
            /**
             * This function acts the same as on(), but with pausable functionality. The
             * returned signal object has pause() and resume() functions. Calling the
             * pause() method will cause the listener to not be called for future events.
             */
            pausable(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): PauseHandle;
            /**
             * This function acts the same as on(), but will only call the listener once. The
             * listener will be called for the first
             * event that takes place and then listener will automatically be removed.
             */
            once(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): Handle;
            parse(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix: boolean, matchesTarget: Element | Record<string, any>): Handle;
            /**
             * Check if a node match the current selector within the constraint of a context
             */
            matches(node: Element, selector: string, context: Element, children: boolean, matchesTarget?: MatchesTarget): Element | boolean;
            /**
             * Creates a new extension event with event delegation. This is based on
             * the provided event type (can be extension event) that
             * only calls the listener when the CSS selector matches the target of the event.
             *
             * The application must require() an appropriate level of dojo/query to handle the selector.
             */
            selector(selector: string, type: string | ExtensionEvent, children?: boolean): ExtensionEvent;
            /**
             * Fires an event on the target object.
             */
            emit(target: Element | Record<string, any>, type: string | ExtensionEvent, event?: any): boolean;
            /**
             * normalizes properties on the event object including event
             * bubbling methods, keystroke normalization, and x/y positions
             */
            _fixEvent(evt: any, sender: any): any;
            /**  */
            _preventDefault(): void;
        }
    }
}
export = on;
//# sourceMappingURL=on.d.ts.map