import dojo = require("./_base/kernel");
import has = require("./has");
import _require = require("require");
import domReady = require("./domReady");
import lang = require("./_base/lang");


var i = 0,
	readyCallbacks: (CallableFunction & { priority: number })[] = [],
	s = 0,
	u = function () {
		i = 1;
		dojo._postLoad = dojo.config.afterOnLoad = true;
		c();
	},
	c = function () {
		if (!s) {
			s = 1;
			for (
				;
				i &&
				(!domReady || 0 == domReady._Q.length) &&
				(!_require.idle || _require.idle()) &&
				readyCallbacks.length;

			) {
				var e = readyCallbacks.shift()!;
				try {
					e();
				} catch (t: any) {
					t.info = t.message;
					if (!_require.signal) throw t;
					_require.signal("error", t);
				}
			}
			s = 0;
		}
	};
_require.on && _require.on("idle", c);
domReady && (domReady._onQEmpty = c);


/**
 * Add a function to execute on DOM content loaded and all requested modules have arrived and been evaluated.
 * In most cases, the `domReady` plug-in should suffice and this method should not be needed.
 *
 * When called in a non-browser environment, just checks that all requested modules have arrived and been
 * evaluated.
 */
function ready(callback: Function): any;
function ready(context: Object, callback: Function | string): void;
function ready(priority: number, callback: Function): void;
function ready(priority: number, context: Object, callback: Function | string): void;
function ready(priority: number | object | Function, context?: Object, callback?: Function | string): void {
	var i = lang._toArray(arguments);
	if ("number" != typeof priority) {
		callback = context as any;
		context = priority;
		priority = 1e3;
	} else i.shift();
	(callback = callback
		? lang.hitch.apply(dojo, i as any)
		: function () {
				(context as any)();
			// @ts-ignore - this is a function
			}).priority = priority;
	for (
		var s = 0;
		s < readyCallbacks.length && priority >= readyCallbacks[s]!.priority;
		s++
	);
	readyCallbacks.splice(s, 0, callback as any);
	c();
}
dojo.ready = dojo.addOnLoad = ready;

var f = dojo.config.addOnLoad;
// @ts-ignore - this hooks the addOnLoad function
f && ready[lang.isArray(f) ? "apply" : "call"](dojo, f);

dojo.config.parseOnLoad &&
	!dojo.isAsync &&
	ready(99, function () {
		// @ts-ignore - this is checking if parser is loaded
		if (!dojo.parser) {
			dojo.deprecated(
				"Add explicit require(['dojo/parser']);",
				"",
				"2.0"
			);
			_require(["dojo/parser"]);
		}
	});
domReady ? domReady(u) : u();

declare global {
	namespace DojoJS
	{
		interface Dojo {
			ready: typeof ready;
			addOnLoad: typeof ready;
			_postLoad: boolean;
		}
	}
}

export = ready;