import dojo = require("./kernel");
import on = require("../on");
import has = require("../has");
import domGeo = require("../dom-geometry");

if (on._fixEvent) {
	var o = on._fixEvent;
	on._fixEvent = function (e, t) {
		(e = o(e, t)) && domGeo.normalizeEvent(e);
		return e;
	};
}

class EventModule {
	/**
	 * normalizes properties on the event object including event
	 * bubbling methods, keystroke normalization, and x/y positions
	 */
	fixEvent(evt: Event, sender: Element): Event
	{
		return on._fixEvent ? on._fixEvent(evt, sender) : evt;
	}

	/**
	 * prevents propagation and clobbers the default action of the
	 * passed event
	 */
	stopEvent(evt: Event): void
	{
		if (has("dom-addeventlistener") || (evt && evt.preventDefault)) {
			evt.preventDefault();
			evt.stopPropagation();
		} else {
			(evt = evt || window.event).cancelBubble = true;
			on._preventDefault.call(evt);
		}
	}
}

declare global {
	namespace DojoJS
	{
		interface Dojo extends EventModule {}
	}
}

dojo.mixin(dojo, new EventModule());
export = dojo; // Same as exporting the result of the mixin, but this is more explicit