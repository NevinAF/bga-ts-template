// @ts-nocheck

import e = require("./aspect");
import t = require("./on");


class Evented {
	private static n = e.after;
	constructor() {}

	on(type: string | DojoJS.ExtensionEvent, listener: EventListener | Function): DojoJS.Handle {
		return t.parse(this, type, listener, function (type, name) {
			return Evented.n(type, "on" + name, listener, true);
		});
	}

	emit(type: string | DojoJS.ExtensionEvent, events: any[]): boolean {
		var args = [this];
		args.push.apply(args, arguments);
		return t.emit.apply(t, args);
	}
}

export = Evented;