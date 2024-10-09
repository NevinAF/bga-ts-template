import e = require("../_base/lang");

var t: Easing = {
	linear: function (e) {
		return e;
	},
	quadIn: function (e) {
		return Math.pow(e, 2);
	},
	quadOut: function (e) {
		return e * (e - 2) * -1;
	},
	quadInOut: function (e) {
		return (e *= 2) < 1
			? Math.pow(e, 2) / 2
			: (-1 * (--e * (e - 2) - 1)) / 2;
	},
	cubicIn: function (e) {
		return Math.pow(e, 3);
	},
	cubicOut: function (e) {
		return Math.pow(e - 1, 3) + 1;
	},
	cubicInOut: function (e) {
		if ((e *= 2) < 1) return Math.pow(e, 3) / 2;
		e -= 2;
		return (Math.pow(e, 3) + 2) / 2;
	},
	quartIn: function (e) {
		return Math.pow(e, 4);
	},
	quartOut: function (e) {
		return -1 * (Math.pow(e - 1, 4) - 1);
	},
	quartInOut: function (e) {
		if ((e *= 2) < 1) return Math.pow(e, 4) / 2;
		e -= 2;
		return -0.5 * (Math.pow(e, 4) - 2);
	},
	quintIn: function (e) {
		return Math.pow(e, 5);
	},
	quintOut: function (e) {
		return Math.pow(e - 1, 5) + 1;
	},
	quintInOut: function (e) {
		if ((e *= 2) < 1) return Math.pow(e, 5) / 2;
		e -= 2;
		return (Math.pow(e, 5) + 2) / 2;
	},
	sineIn: function (e) {
		return -1 * Math.cos(e * (Math.PI / 2)) + 1;
	},
	sineOut: function (e) {
		return Math.sin(e * (Math.PI / 2));
	},
	sineInOut: function (e) {
		return (-1 * (Math.cos(Math.PI * e) - 1)) / 2;
	},
	expoIn: function (e) {
		return 0 == e ? 0 : Math.pow(2, 10 * (e - 1));
	},
	expoOut: function (e) {
		return 1 == e ? 1 : -1 * Math.pow(2, -10 * e) + 1;
	},
	expoInOut: function (e) {
		if (0 == e) return 0;
		if (1 == e) return 1;
		if ((e *= 2) < 1) return Math.pow(2, 10 * (e - 1)) / 2;
		--e;
		return (-1 * Math.pow(2, -10 * e) + 2) / 2;
	},
	circIn: function (e) {
		return -1 * (Math.sqrt(1 - Math.pow(e, 2)) - 1);
	},
	circOut: function (e) {
		e -= 1;
		return Math.sqrt(1 - Math.pow(e, 2));
	},
	circInOut: function (e) {
		if ((e *= 2) < 1)
			return -0.5 * (Math.sqrt(1 - Math.pow(e, 2)) - 1);
		e -= 2;
		return 0.5 * (Math.sqrt(1 - Math.pow(e, 2)) + 1);
	},
	backIn: function (e) {
		var t = 1.70158;
		return Math.pow(e, 2) * ((t + 1) * e - t);
	},
	backOut: function (e) {
		e -= 1;
		var t = 1.70158;
		return Math.pow(e, 2) * ((t + 1) * e + t) + 1;
	},
	backInOut: function (e) {
		var t = 2.5949095;
		if ((e *= 2) < 1)
			return (Math.pow(e, 2) * ((t + 1) * e - t)) / 2;
		e -= 2;
		return (Math.pow(e, 2) * ((t + 1) * e + t) + 2) / 2;
	},
	elasticIn: function (e) {
		if (0 == e || 1 == e) return e;
		e -= 1;
		return (
			-1 *
			Math.pow(2, 10 * e) *
			Math.sin(((e - 0.075) * (2 * Math.PI)) / 0.3)
		);
	},
	elasticOut: function (e) {
		if (0 == e || 1 == e) return e;
		return (
			Math.pow(2, -10 * e) *
				Math.sin(((e - 0.075) * (2 * Math.PI)) / 0.3) +
			1
		);
	},
	elasticInOut: function (e) {
		if (0 == e) return 0;
		if (2 == (e *= 2)) return 1;
		var t = 0.3 * 1.5,
			i = t / 4;
		if (e < 1) {
			e -= 1;
			return (
				Math.pow(2, 10 * e) *
				Math.sin(((e - i) * (2 * Math.PI)) / t) *
				-0.5
			);
		}
		e -= 1;
		return (
			Math.pow(2, -10 * e) *
				Math.sin(((e - i) * (2 * Math.PI)) / t) *
				0.5 +
			1
		);
	},
	bounceIn: function (e) {
		return 1 - t.bounceOut(1 - e);
	},
	bounceOut: function (e) {
		var t,
			i = 7.5625,
			n = 2.75;
		if (e < 1 / n) t = i * Math.pow(e, 2);
		else if (e < 2 / n) {
			e -= 1.5 / n;
			t = i * Math.pow(e, 2) + 0.75;
		} else if (e < 2.5 / n) {
			e -= 2.25 / n;
			t = i * Math.pow(e, 2) + 0.9375;
		} else {
			e -= 2.625 / n;
			t = i * Math.pow(e, 2) + 0.984375;
		}
		return t;
	},
	bounceInOut: function (e) {
		return e < 0.5
			? t.bounceIn(2 * e) / 2
			: t.bounceOut(2 * e - 1) / 2 + 0.5;
	},
};
e.setObject("dojo.fx.easing", t);

interface Easing {
	linear(n: number): number;
	quadIn(n: number): number;
	quadOut(n: number): number;
	quadInOut(n: number): number;
	cubicIn(n: number): number;
	cubicOut(n: number): number;
	cubicInOut(n: number): number;
	quartIn(n: number): number;
	quartOut(n: number): number;
	quartInOut(n: number): number;
	quintIn(n: number): number;
	quintOut(n: number): number;
	quintInOut(n: number): number;
	sineIn(n: number): number;
	sineOut(n: number): number;
	sineInOut(n: number): number;
	expoIn(n: number): number;
	expoOut(n: number): number;
	expoInOut(n: number): number;
	circIn(n: number): number;
	circOut(n: number): number;
	circInOut(n: number): number;

	/**
	 * An easing function that starts away from the target,
	 * and quickly accelerates towards the end value.
	 *
	 * Use caution when the easing will cause values to become
	 * negative as some properties cannot be set to negative values.
	 */
	backIn(n: number): number;

	/**
	 * An easing function that pops past the range briefly, and slowly comes back.
	 */
	backOut(n: number): number;

	/**
	 * An easing function combining the effects of `backIn` and `backOut`
	 */
	backInOut(n: number): number;

	/**
	 * An easing function the elastically snaps from the start value
	 */
	elasticIn(n: number): number;

	/**
	 * An easing function that elasticly snaps around the target value,
	 * near the end of the Animation
	 */
	elasticOut(n: number): number;

	/**
	 * An easing function that elasticly snaps around the value, near
	 * the beginning and end of the Animation.
	 */
	elasticInOut(n: number): number;

	/**
	 * An easing function that 'bounces' near the beginning of an Animation
	 */
	bounceIn(n: number): number;

	/**
	 * An easing function that 'bounces' near the end of an Animation
	 */
	bounceOut(n: number): number;

	/**
	 * An easing function that 'bounces' at the beginning and end of the Animation
	 */
	bounceInOut(n: number): number;
}

declare global {
	namespace DojoJS {
		interface DojoFx {
			easing: Easing;
		}

		interface Dojo {
			fx: DojoFx;
		}
	}
}

export = {};