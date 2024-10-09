// @ts-nocheck

import lang = require("../_base/lang");
import t = require("../_base/array");

var stamp = {} as Stamp;
lang.setObject("dojo.date.stamp", stamp);
stamp.fromISOString = function (e, n) {
	stamp._isoRegExp ||
		(stamp._isoRegExp =
			/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/);
	var o = stamp._isoRegExp.exec(e),
		a = null;
	if (o) {
		o.shift();
		o[1] && o[1]--;
		o[6] && (o[6] *= 1e3);
		if (n) {
			n = new Date(n);
			t.forEach(
				t.map(
					[
						"FullYear",
						"Month",
						"Date",
						"Hours",
						"Minutes",
						"Seconds",
						"Milliseconds",
					],
					function (e) {
						return n["get" + e]();
					}
				),
				function (e, t) {
					o[t] = o[t] || e;
				}
			);
		}
		a = new Date(
			o[0] || 1970,
			o[1] || 0,
			o[2] || 1,
			o[3] || 0,
			o[4] || 0,
			o[5] || 0,
			o[6] || 0
		);
		o[0] < 100 && a.setFullYear(o[0] || 1970);
		var s = 0,
			r = o[7] && o[7].charAt(0);
		if ("Z" != r) {
			s = 60 * (o[8] || 0) + (Number(o[9]) || 0);
			"-" != r && (s *= -1);
		}
		r && (s -= a.getTimezoneOffset());
		s && a.setTime(a.getTime() + 6e4 * s);
	}
	return a;
};
stamp.toISOString = function (e, t) {
	var i = function (e) {
			return e < 10 ? "0" + e : e;
		},
		n = [],
		o = (t = t || {}).zulu ? "getUTC" : "get",
		a = "";
	if ("time" != t.selector) {
		var s = e[o + "FullYear"]();
		a = [
			"0000".substr((s + "").length) + s,
			i(e[o + "Month"]() + 1),
			i(e[o + "Date"]()),
		].join("-");
	}
	n.push(a);
	if ("date" != t.selector) {
		var r = [
				i(e[o + "Hours"]()),
				i(e[o + "Minutes"]()),
				i(e[o + "Seconds"]()),
			].join(":"),
			l = e[o + "Milliseconds"]();
		t.milliseconds &&
			(r += "." + (l < 100 ? "0" : "") + i(l));
		if (t.zulu) r += "Z";
		else if ("time" != t.selector) {
			var d = e.getTimezoneOffset(),
				c = Math.abs(d);
			r +=
				(d > 0 ? "-" : "+") +
				i(Math.floor(c / 60)) +
				":" +
				i(c % 60);
		}
		n.push(r);
	}
	return n.join("T");
};

interface StampFormatOptions {

	/**
	 * "date" or "time" for partial formatting of the Date object.
	 * Both date and time will be formatted by default.
	 */
	selector?:  'time' | 'date';

	/**
	 * if true, UTC/GMT is used for a timezone
	 */
	zulu?: boolean;

	/**
	 * if true, output milliseconds
	 */
	milliseconds?: boolean;
}

interface Stamp {
	/**
	 * Returns a Date object given a string formatted according to a subset of the ISO-8601 standard.
	 */
	fromISOString(formattedString: string, defaultTime?: number): Date;

	/**
	 * Format a Date object as a string according a subset of the ISO-8601 standard
	 */
	toISOString(dateObject: Date, options?: StampFormatOptions): string;
}

declare global {
	namespace DojoJS {
		interface DojoDate {
			stamp: typeof stamp;
		}

		interface Dojo {
			date: DojoDate;
		}
	}
}

export = stamp;