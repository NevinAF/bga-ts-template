declare class Evented {
    private static n;
    constructor();
    on(type: string | DojoJS.ExtensionEvent, listener: EventListener | Function): DojoJS.Handle;
    emit(type: string | DojoJS.ExtensionEvent, events: any[]): boolean;
}
export = Evented;
//# sourceMappingURL=Evented.d.ts.map