import e = require("./Evented");

class Topic {
	private static t = new e();

	/**
	 * Publishes a message to a topic on the pub/sub hub. All arguments after
	 * the first will be passed to the subscribers, so any number of arguments
	 * can be provided (not just event).
	 */
	publish(topic: string | DojoJS.ExtensionEvent, eventArgs: any[]): boolean {
		return Topic.t.emit.apply(Topic.t, [topic, eventArgs]);
	}

	/**
	 * Subscribes to a topic on the pub/sub hub
	 */
	subscribe(topic: string | DojoJS.ExtensionEvent, listener: EventListener | Function): DojoJS.Handle {
		return Topic.t.on.apply(Topic.t, [topic, listener]);
	}
}

export = new Topic();