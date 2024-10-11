import dojo = require("./kernel");
declare class EventModule {
    /**
     * normalizes properties on the event object including event
     * bubbling methods, keystroke normalization, and x/y positions
     */
    fixEvent(evt: Event, sender: Element): Event;
    /**
     * prevents propagation and clobbers the default action of the
     * passed event
     */
    stopEvent(evt: Event): void;
}
declare global {
    namespace DojoJS {
        interface Dojo extends EventModule {
        }
    }
}
export = dojo;
//# sourceMappingURL=event.d.ts.map