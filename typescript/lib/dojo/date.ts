// @ts-nocheck

import e = require("./has");
import t = require("./_base/lang");

var date = {
	getDaysInMonth: function (e) {
		var t = e.getMonth();
		return 1 == t && date.isLeapYear(e)
			? 29
			: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
					t
				];
	},
	isLeapYear: function (e) {
		var t = e.getFullYear();
		return !(t % 400 && (t % 4 || !(t % 100)));
	},
	getTimezoneName: function (e) {
		var t,
			i = e.toString(),
			n = "",
			o = i.indexOf("(");
		if (o > -1) n = i.substring(++o, i.indexOf(")"));
		else {
			var a = /([A-Z\/]+) \d{4}$/;
			if ((t = i.match(a))) n = t[1];
			else {
				a = / ([A-Z\/]+)$/;
				(t = (i = e.toLocaleString()).match(a)) &&
					(n = t[1]);
			}
		}
		return "AM" == n || "PM" == n ? "" : n;
	},
	compare: function (e, t, i) {
		e = new Date(+e);
		t = new Date(+(t || new Date()));
		if ("date" == i) {
			e.setHours(0, 0, 0, 0);
			t.setHours(0, 0, 0, 0);
		} else if ("time" == i) {
			e.setFullYear(0, 0, 0);
			t.setFullYear(0, 0, 0);
		}
		return e > t ? 1 : e < t ? -1 : 0;
	},
	add: function (e, t, i) {
		var n = new Date(+e),
			o = false,
			a = "Date";
		switch (t) {
			case "day":
				break;
			case "weekday":
				var s,
					r,
					l = i % 5;
				if (l) {
					s = l;
					r = parseInt(i / 5);
				} else {
					s = i > 0 ? 5 : -5;
					r = i > 0 ? (i - 5) / 5 : (i + 5) / 5;
				}
				var d = e.getDay(),
					c = 0;
				6 == d && i > 0
					? (c = 1)
					: 0 == d && i < 0 && (c = -1);
				var h = d + s;
				(0 != h && 6 != h) || (c = i > 0 ? 2 : -2);
				i = 7 * r + s + c;
				break;
			case "year":
				a = "FullYear";
				o = true;
				break;
			case "week":
				i *= 7;
				break;
			case "quarter":
				i *= 3;
			case "month":
				o = true;
				a = "Month";
				break;
			default:
				a =
					"UTC" +
					t.charAt(0).toUpperCase() +
					t.substring(1) +
					"s";
		}
		a && n["set" + a](n["get" + a]() + i);
		o && n.getDate() < e.getDate() && n.setDate(0);
		return n;
	},
	difference: function (e, t, n) {
		n = n || "day";
		var o =
				(t = t || new Date()).getFullYear() -
				e.getFullYear(),
			a = 1;
		switch (n) {
			case "quarter":
				var s = e.getMonth(),
					r = t.getMonth(),
					l = Math.floor(s / 3) + 1,
					d = Math.floor(r / 3) + 1;
				a = (d += 4 * o) - l;
				break;
			case "weekday":
				var c = Math.round(date.difference(e, t, "day")),
					h = parseInt(date.difference(e, t, "week")),
					u = c % 7;
				if (0 == u) c = 5 * h;
				else {
					var p = 0,
						m = e.getDay(),
						g = t.getDay();
					h = parseInt(c / 7);
					u = c % 7;
					var f = new Date(e);
					f.setDate(f.getDate() + 7 * h);
					var _ = f.getDay();
					if (c > 0)
						switch (true) {
							case 6 == m:
								p = -1;
								break;
							case 0 == m:
								p = 0;
								break;
							case 6 == g:
								p = -1;
								break;
							case 0 == g:
							case _ + u > 5:
								p = -2;
						}
					else if (c < 0)
						switch (true) {
							case 6 == m:
								p = 0;
								break;
							case 0 == m:
								p = 1;
								break;
							case 6 == g:
								p = 2;
								break;
							case 0 == g:
								p = 1;
								break;
							case _ + u < 0:
								p = 2;
						}
					c += p;
					c -= 2 * h;
				}
				a = c;
				break;
			case "year":
				a = o;
				break;
			case "month":
				a = t.getMonth() - e.getMonth() + 12 * o;
				break;
			case "week":
				a = parseInt(date.difference(e, t, "day") / 7);
				break;
			case "day":
				a /= 24;
			case "hour":
				a /= 60;
			case "minute":
				a /= 60;
			case "second":
				a /= 1e3;
			case "millisecond":
				a *= t.getTime() - e.getTime();
		}
		return Math.round(a);
	},
} as DateBase;
t.mixin(t.getObject("dojo.date", true), date);

type DatePortion = 'date' | 'time' | 'datetime';
type DateInterval = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' | 'quarter' | 'week' | 'weekday';

interface DateBase {
	/**
	 * Returns the number of days in the month used by dateObject
	 */
	getDaysInMonth(dateObject: Date): number;

	/**
	 * Determines if the year of the dateObject is a leap year
	 */
	isLeapYear(dateObject: Date): boolean;

	/**
	 * Get the user's time zone as provided by the browser
	 */
	getTimezoneName(dateObject: Date): string;

	/**
	 * Compare two date objects by date, time, or both.
	 *
	 */
	compare(date1: Date, date2: Date, portion?: DatePortion): number;

	/**
	 * Add to a Date in intervals of different size, from milliseconds to years
	 */
	add(date: Date, interval: DateInterval, amount: number): Date;

	/**
	 * Get the difference in a specific unit of time (e.g., number of
	 * months, weeks, days, etc.) between two dates, rounded to the
	 * nearest integer.
	 */
	difference(date1: Date, date2?: Date, interval?: DateInterval): number;
}

declare global {
	namespace DojoJS {

		interface DojoDate extends Type<typeof date> {
		}

		interface Dojo {
			date: DojoDate;
		}
	}
}


export = date;