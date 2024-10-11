declare class Topic {
    private static t;
    /**
     * Publishes a message to a topic on the pub/sub hub. All arguments after
     * the first will be passed to the subscribers, so any number of arguments
     * can be provided (not just event).
     */
    publish(topic: string | DojoJS.ExtensionEvent, eventArgs: any[]): boolean;
    /**
     * Subscribes to a topic on the pub/sub hub
     */
    subscribe(topic: string | DojoJS.ExtensionEvent, listener: EventListener | Function): DojoJS.Handle;
}
declare const _default: Topic;
export = _default;
//# sourceMappingURL=topic.d.ts.map