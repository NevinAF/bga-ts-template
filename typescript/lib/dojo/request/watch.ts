// @ts-nocheck

import e = require("./util");
import t = require("../errors/RequestTimeoutError");
import n = require("../errors/CancelError");
import r = require("../_base/array");
import o = require("../_base/window");
import i = require("../on");

var a = null,
	s = [];
function u() {
	for (
		var e, n = +new Date(), r = 0;
		r < s.length && (e = s[r]);
		r++
	) {
		var o = e.response,
			i = o.options;
		if (
			(e.isCanceled && e.isCanceled()) ||
			(e.isValid && !e.isValid(o))
		) {
			s.splice(r--, 1);
			c._onAction && c._onAction();
		} else if (e.isReady && e.isReady(o)) {
			s.splice(r--, 1);
			e.handleResponse(o);
			c._onAction && c._onAction();
		} else if (
			e.startTime &&
			e.startTime + (i.timeout || 0) < n
		) {
			s.splice(r--, 1);
			e.cancel(new t("Timeout exceeded", o));
			c._onAction && c._onAction();
		}
	}
	c._onInFlight && c._onInFlight(e);
	if (!s.length) {
		clearInterval(a);
		a = null;
	}
}
function c(e) {
	e.response.options.timeout && (e.startTime = +new Date());
	if (!e.isFulfilled()) {
		s.push(e);
		a || (a = setInterval(u, 50));
		e.response.options.sync && u();
	}
}
c.cancelAll = function () {
	try {
		r.forEach(s, function (e) {
			try {
				e.cancel(new n("All requests canceled."));
			} catch (t) {}
		});
	} catch (e) {}
};
o &&
	i &&
	o.doc.attachEvent &&
	i(o.global, "unload", function () {
		c.cancelAll();
	});

export = c as {
	/**
	 * Watches the io request represented by dfd to see if it completes.
	 */
	<T>(dfd: Promise<T>): void;

	/**
	 * Cancels all pending IO requests, regardless of IO type
	 */
	cancelAll(): void;
};