import e = require("./kernel");
import t = require("./lang");
import n = require("../on");

class Unload {
	private static r = window;

	/**
	 * Registers a function to be triggered when window.onunload fires.
	 * @deprecated use on(window, "unload", lang.hitch(obj, functionName)) instead.
	 */
	addOnWindowUnload(obj: Record<string, any> | Function, functionName?: string | Function) {
		e.windowUnloaded ||
			n(
				Unload.r,
				"unload",
				(e.windowUnloaded = function () {})
			);
		n(Unload.r, "unload", t.hitch(obj as any, functionName));
	}

	/**
	 * Registers a function to be triggered when the page unloads.
	 * @deprecated use on(window, "beforeunload", lang.hitch(obj, functionName))
	 */
	addOnUnload(obj: Record<string, any> | Function, functionName?: string | Function) {
		n(Unload.r, "beforeunload", t.hitch(obj as any, functionName));
	}
}


declare global {
	namespace DojoJS
	{
		type Unload = typeof Unload;

		interface Dojo {
			/**
			 * Registers a function to be triggered when window.onunload fires.
			 * @deprecated use on(window, "unload", lang.hitch(obj, functionName)) instead.
			 */
			addOnWindowUnload: InstanceType<Unload>["addOnWindowUnload"];
			/**
			 * Registers a function to be triggered when the page unloads.
			 * @deprecated use on(window, "beforeunload", lang.hitch(obj, functionName))
			 */
			addOnUnload: InstanceType<Unload>["addOnUnload"];
			windowUnloaded?: () => void;
		}

	}
}

var unload = new Unload();
e.addOnWindowUnload = unload.addOnWindowUnload;
e.addOnUnload = unload.addOnUnload;
export = unload;