// @ts-nocheck

import has = require("./has");
import lang = require("./_base/lang");
import CancelError = require("./errors/CancelError");
import Promise = require("./promise/Promise");
import instrumentation = require("./promise/instrumentation");

var i = "This deferred has already been fulfilled.",
	a = Object.freeze || function () {},
	s = function (e, t, n, r, o) {
		2 === t &&
			f.instrumentRejected &&
			0 === e.length &&
			f.instrumentRejected(n, false, r, o);
		for (var i = 0; i < e.length; i++) u(e[i], t, n, r);
	},
	u = function (e, t, n, r) {
		var o = e[t],
			i = e.deferred;
		if (o)
			try {
				var a = o(n);
				if (0 === t) undefined !== a && l(i, t, a);
				else {
					if (a && "function" == typeof a.then) {
						e.cancel = a.cancel;
						a.then(c(i, 1), c(i, 2), c(i, 0));
						return;
					}
					l(i, 1, a);
				}
			} catch (s) {
				l(i, 2, s);
			}
		else l(i, t, n);
		2 === t &&
			f.instrumentRejected &&
			f.instrumentRejected(n, !!o, r, i.promise);
	},
	c = function (e, t) {
		return function (n) {
			l(e, t, n);
		};
	},
	l = function (e, t, n) {
		if (!e.isCanceled())
			switch (t) {
				case 0:
					e.progress(n);
					break;
				case 1:
					e.resolve(n);
					break;
				case 2:
					e.reject(n);
			}
	},
	f = function (e) {
		var t,
			o,
			c,
			l = (this.promise = new Promise()),
			d = this,
			p = false,
			h = [];
		if (Error.captureStackTrace) {
			Error.captureStackTrace(d, f);
			Error.captureStackTrace(l, f);
		}
		this.isResolved = l.isResolved = function () {
			return 1 === t;
		};
		this.isRejected = l.isRejected = function () {
			return 2 === t;
		};
		this.isFulfilled = l.isFulfilled = function () {
			return !!t;
		};
		this.isCanceled = l.isCanceled = function () {
			return p;
		};
		this.progress = function (e, n) {
			if (t) {
				if (true === n) throw new Error(i);
				return l;
			}
			s(h, 0, e, null, d);
			return l;
		};
		this.resolve = function (e, n) {
			if (t) {
				if (true === n) throw new Error(i);
				return l;
			}
			s(h, (t = 1), (o = e), null, d);
			h = null;
			return l;
		};
		var g = (this.reject = function (e, n) {
			if (t) {
				if (true === n) throw new Error(i);
				return l;
			}
			Error.captureStackTrace &&
				Error.captureStackTrace((c = {}), g);
			s(h, (t = 2), (o = e), c, d);
			h = null;
			return l;
		});
		this.then = l.then = function (e, n, r) {
			var i = [r, e, n];
			i.cancel = l.cancel;
			i.deferred = new f(function (e) {
				return i.cancel && i.cancel(e);
			});
			t && !h ? u(i, t, o, c) : h.push(i);
			return i.deferred.promise;
		};
		this.cancel = l.cancel = function (r, a) {
			if (t) {
				if (true === a) throw new Error(i);
			} else {
				if (e) {
					var s = e(r);
					r = undefined === s ? r : s;
				}
				p = true;
				if (!t) {
					undefined === r && (r = new CancelError());
					g(r);
					return r;
				}
				if (2 === t && o === r) return r;
			}
		};
		a(l);
	};
f.prototype.toString = function () {
	return "[object Deferred]";
};
instrumentation && instrumentation(f);

type Deferred<T> = {

	/**
	 * The public promise object that clients can add callbacks to.
	 */
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
	 * Inform the deferred it may cancel its asynchronous operation.
	 */
	cancel(reason?: any, strict?: boolean): any;

	/**
	 * Returns `[object Deferred]`.
	 */
	toString(): string;

} & Promise<T>['then'];

interface DeferredConstructor {
	/**
	 * Creates a new deferred. This API is preferred over
	 * `dojo/_base/Deferred`.
	 */
	new <T>(canceller?: (reason: any) => void): Deferred<T>;
	prototype: Deferred<any>;
	instrumentRejected: any;
}


type _Deferred<T> = Deferred<T>;
const _Deferred: DeferredConstructor = f as any;
export = _Deferred;