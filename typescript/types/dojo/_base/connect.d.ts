import "../keys";
declare class Connect {
    /**
     * WIP: Type this better
     */
    _keypress: (object: any, listener: EventListener) => DojoJS.Handle;
    /**
     * `dojo.connect` is a deprecated event handling and delegation method in
     * Dojo. It allows one function to "listen in" on the execution of
     * any other, triggering the second whenever the first is called. Many
     * listeners may be attached to a function, and source functions may
     * be either regular function calls or DOM events.
     */
    connect<U extends keyof any, M extends keyof DojoJS.Global>(event: DojoJS.ConnectGlobalEvent<U>, method: DojoJS.Global extends DojoJS.WithFunc<null, M, DojoJS.ConnectGlobalEventParams<U>> ? M : never, dontFix?: boolean): DojoJS.Handle;
    connect<U extends keyof any, const M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<U>>>(event: DojoJS.ConnectGlobalEvent<U>, method: M, dontFix?: boolean): DojoJS.Handle;
    connect<U extends keyof any, S, M extends keyof any>(...[event, scope, method, dontFix]: [
        DojoJS.ConnectGlobalEvent<U>,
        ...DojoJS.HitchedPair<S, M, DojoJS.ConnectGlobalEventParams<U>>,
        boolean?
    ]): DojoJS.Handle;
    connect<U extends keyof any, S, const M extends DojoJS.BoundFunc<S, DojoJS.ConnectGlobalEventParams<U>>>(event: DojoJS.ConnectGlobalEvent<U>, scope: S, method: M, dontFix?: boolean): DojoJS.Handle;
    connect<K extends keyof DojoJS.AllEvents, M extends keyof DojoJS.Global>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: DojoJS.Global extends DojoJS.WithFunc<null, M, [DojoJS.AllEvents[K]]> ? M : never, dontFix?: boolean): DojoJS.Handle;
    connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<K>>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): DojoJS.Handle;
    connect<K extends keyof DojoJS.AllEvents, S, M extends keyof any>(...[targetObject, event, scope, method, dontFix]: [
        DojoJS.ConnectListenerTarget<K>,
        K | `on${K}`,
        ...DojoJS.HitchedPair<S, M, [DojoJS.AllEvents[K]]>,
        boolean?
    ]): DojoJS.Handle;
    connect<K extends keyof DojoJS.AllEvents, S, M extends DojoJS.BoundFunc<S, [DojoJS.AllEvents[K]]>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, scope: S, method: M, dontFix?: boolean): DojoJS.Handle;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, M extends keyof DojoJS.Global>(targetObject: T, event: U, method: DojoJS.Global extends DojoJS.WithFunc<null, M, DojoJS.ConnectMethodParams<T, U>> ? M : never, dontFix?: boolean): DojoJS.Handle;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, M extends DojoJS.BoundFunc<null, DojoJS.ConnectMethodParams<T, U>>>(targetObject: T, event: U, method: M, dontFix?: boolean): DojoJS.Handle;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends keyof any>(...[targetObject, event, scope, method, dontFix]: [
        T,
        U,
        ...DojoJS.HitchedPair<S, M, DojoJS.ConnectMethodParams<T, U>>,
        boolean?
    ]): DojoJS.Handle;
    connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>>>(targetObject: T, event: U, scope: S, method: M, dontFix?: boolean): DojoJS.Handle;
    /**
     * Remove a link created by dojo.connect.
     */
    disconnect(handle: DojoJS.Handle | Falsy): void;
    /**
     * Attach a listener to a named topic. The listener function is invoked whenever the
     * named topic is published (see: dojo.publish).
     * Returns a handle which is needed to unsubscribe this listener.
     */
    subscribe<M extends keyof DojoJS.Global, Args extends any[] = any[]>(topic: string, method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never): DojoJS.Handle;
    subscribe<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[] = any[]>(topic: string, method: M): DojoJS.Handle;
    subscribe<S, M extends keyof any, Args extends any[] = any[]>(...[topic, scope, method]: [string, ...DojoJS.HitchedPair<S, M, Args>]): DojoJS.Handle;
    subscribe<S, const M extends DojoJS.BoundFunc<S, Args>, Args extends any[] = any[]>(topic: string, scope: S, method: M): DojoJS.Handle;
    unsubscribe(handle: DojoJS.Handle | null): void;
    /**
     * Invoke all listener method subscribed to topic.
     */
    publish(topic: string, args?: any[] | null): boolean;
    /**
     * Ensure that every time obj.event() is called, a message is published
     * on the topic. Returns a handle which can be passed to
     * dojo.disconnect() to disable subsequent automatic publication on
     * the topic.
     */
    connectPublisher<M extends keyof DojoJS.Global, Args extends any[] = any[]>(topic: string, event: any, method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never): DojoJS.Handle;
    connectPublisher<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[] = any[]>(topic: string, event: any, method: M): DojoJS.Handle;
    /**
     * Checks an event for the copy key (meta on Mac, and ctrl anywhere else)
     */
    isCopyKey(e: Event): boolean;
}
declare global {
    namespace DojoJS {
        interface Dojo extends Connect {
        }
        type AllEvents = WindowEventMap & GlobalEventHandlersEventMap & WindowEventHandlersEventMap & DocumentEventMap & ElementEventMap;
        type ConnectGlobalEvent<U extends keyof any> = keyof WindowEventMap | ((Window & typeof globalThis) extends {
            [K in U]: (((...args: any[]) => any) | Event);
        } ? U : never);
        type ConnectGlobalEventParams<U extends keyof any> = U extends keyof WindowEventMap ? [WindowEventMap[U]] : (Window & typeof globalThis) extends {
            [K in U]: infer F extends (((...args: any[]) => any) | Event);
        } ? F extends (...args: any[]) => any ? Parameters<F> : [Element] : never;
        type ConnectListenerTarget<K extends keyof AllEvents> = {
            addEventListener(e: keyof AllEvents, l: (evt: AllEvents[K]) => any): void;
        };
        type ConnectMethodTarget<U extends keyof any> = object & {
            [K in U]: ((...args: any[]) => any) | Event | null;
        };
        type ConnectMethodParams<T extends ConnectMethodTarget<U>, U extends keyof any> = Exclude<T[U], null> extends infer F extends (...args: any[]) => any ? Parameters<F> : [Element];
    }
}
declare var connect: Connect;
export = connect;
//# sourceMappingURL=connect.d.ts.map