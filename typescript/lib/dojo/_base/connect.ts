// @ts-nocheck

import dojo = require("./kernel");
import on = require("../on");
import n = require("../topic");
import aspect = require("../aspect");
import o = require("./event");
import mouse = require("../mouse");
import has = require("./sniff");
import lang = require("./lang");
import "../keys";


has.add("events-keypress-typed", function () {
	var e = { charCode: 0 };
	try {
		(
			(e = document.createEvent("KeyboardEvent"))
				.initKeyboardEvent || e.initKeyEvent
		).call(
			e,
			"keypress",
			true,
			true,
			null,
			false,
			false,
			false,
			false,
			9,
			3
		);
	} catch (t) {}
	return 0 == e.charCode && !has("opera");
});
var c: (object: any, listener: EventListener) => DojoJS.Handle,
	l = {
		106: 42,
		111: 47,
		186: 59,
		187: 43,
		188: 44,
		189: 45,
		190: 46,
		191: 47,
		192: 96,
		219: 91,
		220: 92,
		221: 93,
		222: 39,
		229: 113,
	},
	f = has("mac") ? "metaKey" : "ctrlKey",
	d = function (e, t) {
		var n = lang.mixin({}, e, t);
		p(n);
		n.preventDefault = function () {
			e.preventDefault();
		};
		n.stopPropagation = function () {
			e.stopPropagation();
		};
		return n;
	};
function p(e) {
	e.keyChar = e.charCode
		? String.fromCharCode(e.charCode)
		: "";
	e.charOrCode = e.keyChar || e.keyCode;
}
if (has("events-keypress-typed")) {
	c = function (e, n) {
		var r = on(e, "keydown", function (e) {
				var t = e.keyCode,
					r =
						13 != t &&
						32 != t &&
						(27 != t || !has("ie")) &&
						(t < 48 || t > 90) &&
						(t < 96 || t > 111) &&
						(t < 186 || t > 192) &&
						(t < 219 || t > 222) &&
						229 != t;
				if (r || e.ctrlKey) {
					var o = r ? 0 : t;
					if (e.ctrlKey) {
						if (3 == t || 13 == t)
							return n.call(e.currentTarget, e);
						o > 95 && o < 106
							? (o -= 48)
							: !e.shiftKey && o >= 65 && o <= 90
							? (o += 32)
							: (o = l[o] || o);
					}
					var i = d(e, {
						type: "keypress",
						faux: true,
						charCode: o,
					});
					n.call(e.currentTarget, i);
					has("ie") &&
						(function (e, t) {
							try {
								return (e.keyCode = t);
							} catch (e) {
								return 0;
							}
						})(e, i.keyCode);
				}
			}),
			o = on(e, "keypress", function (e) {
				var t = e.charCode;
				e = d(e, {
					charCode: (t = t >= 32 ? t : 0),
					faux: true,
				});
				return n.call(this, e);
			});
		return {
			remove: function () {
				r.remove();
				o.remove();
			},
		};
	};
} else
	c = has("opera")
		? function (e, n) {
				return on(e, "keypress", function (e) {
					var t = e.which;
					3 == t && (t = 99);
					t = t < 32 && !e.shiftKey ? 0 : t;
					e.ctrlKey &&
						!e.shiftKey &&
						t >= 65 &&
						t <= 90 &&
						(t += 32);
					return n.call(this, d(e, { charCode: t }));
				});
			}
		: function (e, n) {
				return on(e, "keypress", function (e) {
					p(e);
					return n.call(this, e);
				});
			};



class Connect {
	/**
	 * WIP: Type this better
	 */
	_keypress = c;

	/**
	 * `dojo.connect` is a deprecated event handling and delegation method in
	 * Dojo. It allows one function to "listen in" on the execution of
	 * any other, triggering the second whenever the first is called. Many
	 * listeners may be attached to a function, and source functions may
	 * be either regular function calls or DOM events.
	 */
	// Connect to global target using the name of a global method...
	connect<U extends keyof any, M extends keyof DojoJS.Global>(
		event: DojoJS.ConnectGlobalEvent<U>,
		method: DojoJS.Global extends DojoJS.WithFunc<null, M, DojoJS.ConnectGlobalEventParams<U>> ? M : never,
		dontFix?: boolean): DojoJS.Handle;
	// Connect to global target using the given function (which uses 'this' as global context)...
	connect<U extends keyof any, const M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<U>>>(
		event: DojoJS.ConnectGlobalEvent<U>,
		method: M,
		dontFix?: boolean): DojoJS.Handle;
	// Connect to global target using the name of a method on the scope...
	connect<U extends keyof any, S, M extends keyof any>(...[
		event, scope, method, dontFix]: [
			DojoJS.ConnectGlobalEvent<U>,
			...DojoJS.HitchedPair<S, M, DojoJS.ConnectGlobalEventParams<U>>,
			boolean?
		]): DojoJS.Handle;
	// Connect to global target using the given function (which uses scope as 'this')...
	connect<U extends keyof any, S, const M extends DojoJS.BoundFunc<S, DojoJS.ConnectGlobalEventParams<U>>>(
		event: DojoJS.ConnectGlobalEvent<U>,
		scope: S,
		method: M,
		dontFix?: boolean): DojoJS.Handle;

	// connect to a specified target that contains the 'addEventListener' method using the name of a global method...
	connect<K extends keyof DojoJS.AllEvents, M extends keyof DojoJS.Global>(
		targetObject: DojoJS.ConnectListenerTarget<K>,
		event: K | `on${K}`,
		method: DojoJS.Global extends DojoJS.WithFunc<null, M, [DojoJS.AllEvents[K]]> ? M : never,
		dontFix?: boolean): DojoJS.Handle;
	// connect to a specified target that contains the 'addEventListener' method using the given function (which uses 'this' as global context)...
	connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<K>>>(
		targetObject: DojoJS.ConnectListenerTarget<K>,
		event: K | `on${K}`,
		method: M,
		dontFix?: boolean): DojoJS.Handle;
	// Connect to specified target that contains the 'addEventListener' method using the name of a method on the scope...
	connect<K extends keyof DojoJS.AllEvents, S, M extends keyof any>(...[
		targetObject, event, scope, method, dontFix]: [
			DojoJS.ConnectListenerTarget<K>,
			K | `on${K}`,
			...DojoJS.HitchedPair<S, M, [DojoJS.AllEvents[K]]>,
			boolean?
		]): DojoJS.Handle;
	// Connect to specified target that contains the 'addEventListener' method using the given function (which uses scope as 'this')...
	connect<K extends keyof DojoJS.AllEvents, S, M extends DojoJS.BoundFunc<S, [DojoJS.AllEvents[K]]>>(
		targetObject: DojoJS.ConnectListenerTarget<K>,
		event: K | `on${K}`,
		scope: S,
		method: M,
		dontFix?: boolean): DojoJS.Handle;

	// Connect to a specified target's method/event name using the name of a global method...
	connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, M extends keyof DojoJS.Global>(
		targetObject: T,
		event: U,
		method: DojoJS.Global extends DojoJS.WithFunc<null, M, DojoJS.ConnectMethodParams<T, U>> ? M : never,
		dontFix?: boolean): DojoJS.Handle;
	// Connect to a specified target's method/event name using the given function (which uses 'this' as global context)...
	connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, M extends DojoJS.BoundFunc<null, DojoJS.ConnectMethodParams<T, U>>>(
		targetObject: T,
		event: U,
		method: M,
		dontFix?: boolean): DojoJS.Handle;
	// Connect to a specified target's method/event name using the name of a method on the scope...
	connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends keyof any>(...[
		targetObject, event, scope, method, dontFix]: [
			T,
			U,
			...DojoJS.HitchedPair<S, M, DojoJS.ConnectMethodParams<T, U>>,
			boolean?
		]): DojoJS.Handle;
	// Connect to a specified target's method/event name using the given function (which uses scope as 'this')...
	connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>>>(
		targetObject: T,
		event: U,
		scope: S,
		method: M,
		dontFix?: boolean): DojoJS.Handle;

	connect<T = null>(
		targetObject: Record<string, any> | null | string | DojoJS.ExtensionEvent,
		event: string | null | DojoJS.BoundFunc<null> | DojoJS.ExtensionEvent,
		scope?: T | null | string | DojoJS.BoundFunc<null>,
		method?: string | DojoJS.BoundFunc<T> | boolean,
		dontFix?: boolean): DojoJS.Handle
	{
		function _connect<T>(targetObject: Element | Record<string, any> | null, event: string | DojoJS.ExtensionEvent, scope: T, method: string | DojoJS.BoundFunc<T>, dontFix?: boolean) {
			var hitched = lang.hitch(scope, method);
			if (!targetObject || (!targetObject.addEventListener && !("attachEvent" in targetObject)))
				// @ts-ignore
				return aspect.after(targetObject || dojo.global, event as any, hitched, true);
			"string" == typeof event &&
				"on" == event.substring(0, 2) &&
				(event = event.substring(2));
			targetObject || (targetObject = dojo.global);
			if (!dontFix)
				switch (event) {
					case "keypress":
						event = c;
						break;
					case "mouseenter":
						event = mouse.enter;
						break;
					case "mouseleave":
						event = mouse.leave;
				}
			return on(targetObject, event, hitched, dontFix);
		}

		var i = arguments,
			a = [],
			s = 0;
		a.push("string" == typeof i[0] ? null : i[s++], i[s++]);
		a.push(
			"string" == typeof i[s + 1] || "function" == typeof i[s + 1]
				? i[s++]
				: null,
			i[s++]
		);
		for (var l = i.length; s < l; s++) a.push(i[s]);
		// @ts-ignore
		return _connect.apply(this, a);
	}

	/**
	 * Remove a link created by dojo.connect.
	 */
	disconnect(handle: DojoJS.Handle | Falsy): void {
		handle && handle.remove();
	}

	/**
	 * Attach a listener to a named topic. The listener function is invoked whenever the
	 * named topic is published (see: dojo.publish).
	 * Returns a handle which is needed to unsubscribe this listener.
	 */
	subscribe<M extends keyof DojoJS.Global, Args extends any[] = any[]>(
		topic: string,
		method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never): DojoJS.Handle;
	subscribe<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[] = any[]>(
		topic: string,
		method: M): DojoJS.Handle;
	subscribe<S, M extends keyof any, Args extends any[] = any[]>(...[
		topic, scope, method
	]: [string, ...DojoJS.HitchedPair<S, M, Args>]): DojoJS.Handle;
	subscribe<S, const M extends DojoJS.BoundFunc<S, Args>, Args extends any[] = any[]>(
		topic: string,
		scope: S,
		method: M): DojoJS.Handle;

	subscribe(topic: string, scope: any, method?: any): DojoJS.Handle {
		return n.subscribe(topic, lang.hitch(scope, method));
	}

	unsubscribe(handle: DojoJS.Handle | null): void {
		handle && handle.remove();
	}

	/**
	 * Invoke all listener method subscribed to topic.
	 */
	publish(topic: string, args?: any[] | null): boolean {
		return n.publish.apply(n, [topic, args]);
	}

	/**
	 * Ensure that every time obj.event() is called, a message is published
	 * on the topic. Returns a handle which can be passed to
	 * dojo.disconnect() to disable subsequent automatic publication on
	 * the topic.
	 */
	connectPublisher<M extends keyof DojoJS.Global, Args extends any[] = any[]>(
		topic: string,
		event: any,
		method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never): DojoJS.Handle;
	connectPublisher<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[] = any[]>(
		topic: string,
		event: any,
		method: M): DojoJS.Handle;
	connectPublisher(topic: string, event: any, method?: string | Function): DojoJS.Handle {
		var r = function () {
			connect.publish(topic, arguments as any);
		};
		return method ? connect.connect(event, method, r) : connect.connect(event, r);
	}

	/**
	 * Checks an event for the copy key (meta on Mac, and ctrl anywhere else)
	 */
	isCopyKey(e: Event): boolean {
		// @ts-ignore
		return e[f];
	}
}

declare global {
	namespace DojoJS
	{
		interface Dojo extends Connect {}
		type AllEvents = WindowEventMap & GlobalEventHandlersEventMap & WindowEventHandlersEventMap & DocumentEventMap & ElementEventMap;
		type ConnectGlobalEvent<U extends keyof any> = keyof WindowEventMap | (
			(Window & typeof globalThis) extends { [K in U]: (((...args: any[]) => any) | Event) }
				? U
				: never
		)
		
		KeysWithType<Window & typeof globalThis, ((...args: any[]) => any) | Event>
		type ConnectGlobalEventParams<U extends keyof any> =
			// U extends keyof (Window & typeof globalThis) ? (
			// 	(Window & typeof globalThis)[U] extends (...args: any[]) => any
			// 		? Parameters<(Window & typeof globalThis)[U]>
			// 	: (Window & typeof globalThis)[U] extends Event ? [Element]
			// 	: never)
			// : U extends keyof WindowEventMap ? [WindowEventMap[U]]
			// : never;
			U extends keyof WindowEventMap ? [WindowEventMap[U]]
			: (Window & typeof globalThis) extends { [K in U]: infer F extends (((...args: any[]) => any) | Event) }
				? F extends (...args: any[]) => any
					? Parameters<F>
					: [Element]
			: never;


		type ConnectListenerTarget<K extends keyof AllEvents> = {
			addEventListener(e: keyof AllEvents, l: (evt: AllEvents[K]) => any): void
		}

		type ConnectMethodTarget<U extends keyof any> = object & { [K in U]: ((...args: any[]) => any) | Event | null }
		type ConnectMethodParams<T extends ConnectMethodTarget<U>, U extends keyof any> = Exclude<T[U], null> extends infer F extends (...args: any[]) => any
				? Parameters<F>
				: [Element];
	}
}

var connect = new Connect();
lang.mixin(dojo, connect);
export = connect;