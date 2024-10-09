// @ts-nocheck

import dojo = require("dojo/_base/kernel");
import t = require("../query");
import n = require("dojo/_base/array");
import "dojo/_base/html";
import "../NodeList-dom";

var r: typeof t.NodeList = t.NodeList,
	o = r.prototype;
o.connect = r._adaptAsForEach(function () {
	return dojo.connect.apply(this, arguments);
});
o.coords = r._adaptAsMap(dojo.coords);
r.events = [
	"blur",
	"focus",
	"change",
	"click",
	"error",
	"keydown",
	"keypress",
	"keyup",
	"load",
	"mousedown",
	"mouseenter",
	"mouseleave",
	"mousemove",
	"mouseout",
	"mouseover",
	"mouseup",
	"submit",
];
n.forEach(r.events, function (e) {
	var t = "on" + e;
	o[t] = function (e, n) {
		return this.connect(t, e, n);
	};
});
dojo.NodeList = r;

declare global {
	namespace DojoJS
	{
		interface Dojo {
			NodeList: typeof r;
		}

		interface NodeList<T extends Node> extends ArrayLike<T> {

			// connect to a specified target that contains the 'addEventListener' method using the name of a global method...
			connect<K extends keyof DojoJS.AllEvents, M extends keyof DojoJS.Global>(
				event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never,
				method: DojoJS.Global extends DojoJS.WithFunc<null, M, [DojoJS.AllEvents[K]]> ? M : never,
				dontFix?: boolean): this;
			// connect to a specified target that contains the 'addEventListener' method using the given function (which uses 'this' as global context)...
			connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<U>>>(
				event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never,
				method: M,
				dontFix?: boolean): this;
			// Connect to specified target that contains the 'addEventListener' method using the name of a method on the scope...
			connect<K extends keyof DojoJS.AllEvents, S, M extends keyof any>(...[
				event, scope, method, dontFix]: [
					T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never,
					...DojoJS.HitchedPair<S, M, [DojoJS.AllEvents[K]]>,
					boolean?
				]): this;
			// Connect to specified target that contains the 'addEventListener' method using the given function (which uses scope as 'this')...
			connect<K extends keyof DojoJS.AllEvents, S, M extends DojoJS.BoundFunc<S, [DojoJS.AllEvents[K]]>>(
				event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never,
				scope: S,
				method: M,
				dontFix?: boolean): this;

			// Connect to a specified target's method/event name using the name of a global method...
			connect<U extends string, M extends keyof DojoJS.Global>(
				event: T extends DojoJS.ConnectMethodTarget<U> ? U : never,
				method: DojoJS.Global extends DojoJS.WithFunc<null, M, DojoJS.ConnectMethodParams<T, U>> ? M : never,
				dontFix?: boolean): this;
			// Connect to a specified target's method/event name using the given function (which uses 'this' as global context)...
			connect<U extends string, M extends DojoJS.BoundFunc<null, DojoJS.ConnectMethodParams<T, U>>>(
				event: T extends DojoJS.ConnectMethodTarget<U> ? U : never,
				method: M,
				dontFix?: boolean): this;
			// Connect to a specified target's method/event name using the name of a method on the scope...
			connect<U extends string, S, M extends keyof any>(...[
				event, scope, method, dontFix]: [
					T extends DojoJS.ConnectMethodTarget<U> ? U : never,
					...DojoJS.HitchedPair<S, M, DojoJS.ConnectMethodParams<T, U>>,
					boolean?
				]): this;
			// Connect to a specified target's method/event name using the given function (which uses scope as 'this')...
			connect<U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>>>(
				event: T extends DojoJS.ConnectMethodTarget<U> ? U : never,
				scope: S,
				method: M,
				dontFix?: boolean): this;

			coords: typeof o.coords;
			events: string[];
		}
	}
}

export = r;