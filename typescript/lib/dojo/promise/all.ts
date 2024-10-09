// @ts-nocheck

import e = require("../_base/array");
import t = require("../_base/lang");
import i = require("../Deferred");
import n = require("../when");

type Promise<T> = typeof import("dojo/promise/Promise")<T>;

var o = e.some;
/**
 * Takes multiple promises and returns a new promise that is fulfilled
 * when all promises have been resolved or one has been rejected.
 * @param objectOrArray The promise will be fulfilled with a list of results if invoked with an
 * 						array, or an object of results when passed an object (using the same
 * 						keys). If passed neither an object or array it is resolved with an
 * 						undefined value.
 */
function all<T>(array: DojoJS.Thenable<T>[]): Promise<T[]>;
function all<T>(object: { [name: string]: DojoJS.Thenable<T> }): Promise<{ [name: string]: T }>;
function all(array: DojoJS.Thenable<any>[]): Promise<any[]>;
function all(object: { [name: string]: DojoJS.Thenable<any> }): Promise<{ [name: string]: any }>;
function all<T>(object: { [name: string]: DojoJS.Thenable<T> } | DojoJS.Thenable<T>[]): Promise<{ [name: string]: T }> {
	var a, s, r;
	t.isArray(object)
		? (s = object)
		: object && "object" == typeof object && (a = object);
	var l = [];
	if (a) {
		s = [];
		for (var d in a)
			if (Object.hasOwnProperty.call(a, d)) {
				l.push(d);
				s.push(a[d]);
			}
		r = {};
	} else s && (r = []);
	if (!s || !s.length) return new i().resolve(r);
	var c = new i();
	c.promise.always(function () {
		r = l = null;
	});
	var h = s.length;
	o(s, function (e, t) {
		a || l.push(t);
		n(
			e,
			function (e) {
				if (!c.isFulfilled()) {
					r[l[t]] = e;
					0 == --h && c.resolve(r);
				}
			},
			c.reject
		);
		return c.isFulfilled();
	});
	return c.promise;
};


export = all;