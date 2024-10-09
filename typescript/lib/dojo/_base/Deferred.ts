// @ts-nocheck

import dojo = require("./kernel");
import deferred = require("../Deferred");
import Promise = require("../promise/Promise");
import CancelError = require("../errors/CancelError");
import has = require("../has");
import lang = require("./lang");
import when = require("../when");

var s = function () {},
	u = Object.freeze || function () {},
	c = (dojo.Deferred = function (e) {
		var a,
			l,
			f,
			d,
			p,
			h,
			g,
			m = (this.promise = new Promise());
		function v(e) {
			if (l)
				throw new Error(
					"This deferred has already been resolved"
				);
			a = e;
			l = true;
			y();
		}
		function y() {
			for (var e; !e && g; ) {
				var n = g;
				g = g.next;
				(e = n.progress == s) && (l = false);
				var r = p ? n.error : n.resolved;
				has("config-useDeferredInstrumentation") &&
					p &&
					deferred.instrumentRejected &&
					deferred.instrumentRejected(a, !!r);
				if (r)
					try {
						var u = r(a);
						if (u && "function" == typeof u.then) {
							u.then(
								lang.hitch(n.deferred, "resolve"),
								lang.hitch(n.deferred, "reject"),
								lang.hitch(n.deferred, "progress")
							);
							continue;
						}
						var c = e && undefined === u;
						e && !c && (p = u instanceof Error);
						n.deferred[
							c && p ? "reject" : "resolve"
						](c ? a : u);
					} catch (f) {
						n.deferred.reject(f);
					}
				else
					p
						? n.deferred.reject(a)
						: n.deferred.resolve(a);
			}
		}
		this.isResolved = m.isResolved = function () {
			return 0 == d;
		};
		this.isRejected = m.isRejected = function () {
			return 1 == d;
		};
		this.isFulfilled = m.isFulfilled = function () {
			return d >= 0;
		};
		this.isCanceled = m.isCanceled = function () {
			return f;
		};
		this.resolve = this.callback = function (e) {
			this.fired = d = 0;
			this.results = [e, null];
			v(e);
		};
		this.reject = this.errback = function (e) {
			p = true;
			this.fired = d = 1;
			has("config-useDeferredInstrumentation") &&
				deferred.instrumentRejected &&
				deferred.instrumentRejected(e, !!g);
			v(e);
			this.results = [null, e];
		};
		this.progress = function (e) {
			for (var t = g; t; ) {
				var n = t.progress;
				n && n(e);
				t = t.next;
			}
		};
		this.addCallbacks = function (e, t) {
			this.then(e, t, s);
			return this;
		};
		m.then = this.then = function (e, t, n) {
			var r = n == s ? this : new c(m.cancel),
				o = {
					resolved: e,
					error: t,
					progress: n,
					deferred: r,
				};
			g ? (h = h.next = o) : (g = h = o);
			l && y();
			return r.promise;
		};
		var b = this;
		m.cancel = this.cancel = function () {
			if (!l) {
				var t = e && e(b);
				if (!l) {
					t instanceof Error || (t = new CancelError(t));
					t.log = false;
					b.reject(t);
				}
			}
			f = true;
		};
		u(m);
	});
lang.extend(c, {
	addCallback: function (t) {
		return this.addCallbacks(lang.hitch.apply(dojo, arguments));
	},
	addErrback: function (t) {
		return this.addCallbacks(
			null,
			lang.hitch.apply(dojo, arguments)
		);
	},
	addBoth: function (t) {
		var n = lang.hitch.apply(dojo, arguments);
		return this.addCallbacks(n, n);
	},
	fired: -1,
});
c.when = dojo.when = when;

declare global {
	namespace DojoJS
	{
		interface Deferred<T> extends Thenable<T> {

			promise: Promise<T>;

			/**
			 * Checks whether the deferred has been resolved.
			 */
			isResolved(): boolean;

			/**
			 * Checks whether the deferred has been rejected.
			 */
			isRejected(): boolean;

			/**
			 * Checks whether the deferred has been resolved or rejected.
			 */
			isFulfilled(): boolean;

			/**
			 * Checks whether the deferred has been canceled.
			 */
			isCanceled(): boolean;

			/**
			 * Emit a progress update on the deferred.
			 */
			progress(update: any, strict?: boolean): Promise<T>;

			/**
			 * Resolve the deferred.
			 */
			resolve(value?: T, strict?: boolean): Promise<T>;

			/**
			 * Reject the deferred.
			 */
			reject(error?: any, strict?: boolean): Promise<T>;

			/**
			 * The results of the Defereed
			 */
			results: [T, any];

			/**
			 * Adds callback and error callback for this deferred instance.
			 */
			addCallbacks<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;

			/**
			 * Cancels the asynchronous operation
			 */
			cancel(): void;

			/**
			 * Adds successful callback for this deferred instance.
			 */
			addCallback<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null): Deferred<U>;

			/**
			 * Adds error callback for this deferred instance.
			 */
			addErrback<U>(errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;

			/**
			 * Add handler as both successful callback and error callback for this deferred instance.
			 */
			addBoth<U>(errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;

			fired: number;
		}

		interface DeferredConstructor {
			/**
			 * Deprecated.   This module defines the legacy dojo/_base/Deferred API.
			 * New code should use dojo/Deferred instead.
			 */
			new <T>(canceller?: (reason: any) => void): Deferred<T>;

			prototype: Deferred<any>;

			/** See {@link when} for more information. */
			when: typeof when;
		}

		interface Dojo {
			Deferred: typeof import ("./Deferred");
		}
	}
}

type Deferred<T> = DojoJS.Deferred<T>;
const Deferred: DojoJS.DeferredConstructor = c as any;
export = Deferred;