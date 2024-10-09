// @ts-nocheck

import dojo = require("./kernel");
import config = require("./config");
import lang = require("./lang");
import Evented = require("../Evented");
import Color = require("./Color");
import aspect = require("../aspect");
import has = require("../sniff");
import dom = require("../dom");
import domStyle = require("../dom-style");

var mixin = lang.mixin,
	fx: DojoJS.Fx = {},
	f = (fx._Line = function (e, t) {
		this.start = e;
		this.end = t;
	});
f.prototype.getValue = function (e) {
	return (this.end - this.start) * e + this.start;
};
var Animation = (fx.Animation = function (e) {
	mixin(this, e);
	lang.isArray(this.curve) &&
		(this.curve = new f(this.curve[0], this.curve[1]));
});
Animation.prototype = new Evented();
lang.extend(Animation, {
	duration: 350,
	repeat: 0,
	rate: 20,
	_percent: 0,
	_startRepeatCount: 0,
	_getStep: function () {
		var e = this._percent,
			t = this.easing;
		return t ? t(e) : e;
	},
	_fire: function (e, n) {
		var r = n || [];
		if (this[e])
			if (config.debugAtAllCosts) this[e].apply(this, r);
			else
				try {
					this[e].apply(this, r);
				} catch (o) {
					console.error(
						"exception in animation handler for:",
						e
					);
					console.error(o);
				}
		return this;
	},
	play: function (e, t) {
		var r = this;
		r._delayTimer && r._clearTimer();
		if (t) {
			r._stopTimer();
			r._active = r._paused = false;
			r._percent = 0;
		} else if (r._active && !r._paused) return r;
		r._fire("beforeBegin", [r.node]);
		var o = e || r.delay,
			i = lang.hitch(r, "_play", t);
		if (o > 0) {
			r._delayTimer = setTimeout(i, o);
			return r;
		}
		i();
		return r;
	},
	_play: function (e) {
		var t = this;
		t._delayTimer && t._clearTimer();
		t._startTime = new Date().valueOf();
		t._paused && (t._startTime -= t.duration * t._percent);
		t._active = true;
		t._paused = false;
		var n = t.curve.getValue(t._getStep());
		if (!t._percent) {
			t._startRepeatCount ||
				(t._startRepeatCount = t.repeat);
			t._fire("onBegin", [n]);
		}
		t._fire("onPlay", [n]);
		t._cycle();
		return t;
	},
	pause: function () {
		var e = this;
		e._delayTimer && e._clearTimer();
		e._stopTimer();
		if (!e._active) return e;
		e._paused = true;
		e._fire("onPause", [e.curve.getValue(e._getStep())]);
		return e;
	},
	gotoPercent: function (e, t) {
		var n = this;
		n._stopTimer();
		n._active = n._paused = true;
		n._percent = e;
		t && n.play();
		return n;
	},
	stop: function (e) {
		var t = this;
		t._delayTimer && t._clearTimer();
		if (!t._timer) return t;
		t._stopTimer();
		e && (t._percent = 1);
		t._fire("onStop", [t.curve.getValue(t._getStep())]);
		t._active = t._paused = false;
		return t;
	},
	destroy: function () {
		this.stop();
	},
	status: function () {
		return this._active
			? this._paused
				? "paused"
				: "playing"
			: "stopped";
	},
	_cycle: function () {
		var e = this;
		if (e._active) {
			var t = new Date().valueOf(),
				n =
					0 === e.duration
						? 1
						: (t - e._startTime) / e.duration;
			n >= 1 && (n = 1);
			e._percent = n;
			e.easing && (n = e.easing(n));
			e._fire("onAnimate", [e.curve.getValue(n)]);
			if (e._percent < 1) e._startTimer();
			else {
				e._active = false;
				if (e.repeat > 0) {
					e.repeat--;
					e.play(null, true);
				} else if (-1 == e.repeat) e.play(null, true);
				else if (e._startRepeatCount) {
					e.repeat = e._startRepeatCount;
					e._startRepeatCount = 0;
				}
				e._percent = 0;
				e._fire("onEnd", [e.node]);
				!e.repeat && e._stopTimer();
			}
		}
		return e;
	},
	_clearTimer: function () {
		clearTimeout(this._delayTimer);
		delete this._delayTimer;
	},
});
var p = 0,
	h = null,
	g = { run: function () {} };
lang.extend(Animation, {
	_startTimer: function () {
		if (!this._timer) {
			this._timer = aspect.after(
				g,
				"run",
				lang.hitch(this, "_cycle"),
				true
			);
			p++;
		}
		h || (h = setInterval(lang.hitch(g, "run"), this.rate));
	},
	_stopTimer: function () {
		if (this._timer) {
			this._timer.remove();
			this._timer = null;
			p--;
		}
		if (p <= 0) {
			clearInterval(h);
			h = null;
			p = 0;
		}
	},
});
var m = has("ie")
	? function (e) {
			var t = e.style;
			t.width.length ||
				"auto" != domStyle.get(e, "width") ||
				(t.width = "auto");
		}
	: function () {};
fx._fade = function (e) {
	e.node = dom.byId(e.node);
	var t = mixin({ properties: {} }, e),
		r = (t.properties.opacity = {});
	r.start =
		"start" in t
			? t.start
			: function () {
					return +domStyle.get(t.node, "opacity") || 0;
				};
	r.end = t.end;
	var o = fx.animateProperty(t);
	aspect.after(o, "beforeBegin", lang.partial(m, t.node), true);
	return o;
};
fx.fadeIn = function (e) {
	return fx._fade(mixin({ end: 1 }, e));
};
fx.fadeOut = function (e) {
	return fx._fade(mixin({ end: 0 }, e));
};
fx._defaultEasing = function (e) {
	return 0.5 + Math.sin((e + 1.5) * Math.PI) / 2;
};
var v = function (e) {
	this._properties = e;
	for (var t in e) {
		var n = e[t];
		n.start instanceof Color && (n.tempColor = new Color());
	}
};
v.prototype.getValue = function (e) {
	var t = {};
	for (var r in this._properties) {
		var i = this._properties[r],
			a = i.start;
		a instanceof Color
			? (t[r] = Color
					.blendColors(a, i.end, e, i.tempColor)
					.toCss())
			: lang.isArray(a) ||
				(t[r] =
					(i.end - a) * e +
					a +
					("opacity" != r ? i.units || "px" : 0));
	}
	return t;
};
fx.animateProperty = function (t) {
	var r = (t.node = dom.byId(t.node));
	t.easing || (t.easing = dojo._defaultEasing);
	var a = new Animation(t);
	aspect.after(
		a,
		"beforeBegin",
		lang.hitch(a, function () {
			var e = {};
			for (var t in this.properties) {
				("width" != t && "height" != t) ||
					(this.node.display = "block");
				var i = this.properties[t];
				lang.isFunction(i) && (i = i(r));
				i = e[t] = mixin(
					{},
					lang.isObject(i) ? i : { end: i }
				);
				lang.isFunction(i.start) && (i.start = i.start(r));
				lang.isFunction(i.end) && (i.end = i.end(r));
				var a = t.toLowerCase().indexOf("color") >= 0;
				function s(e, t) {
					var n = {
						height: e.offsetHeight,
						width: e.offsetWidth,
					}[t];
					if (undefined !== n) return n;
					n = domStyle.get(e, t);
					return "opacity" == t
						? +n
						: a
						? n
						: parseFloat(n);
				}
				"end" in i
					? "start" in i || (i.start = s(r, t))
					: (i.end = s(r, t));
				if (a) {
					i.start = new Color(i.start);
					i.end = new Color(i.end);
				} else
					i.start =
						"opacity" == t
							? +i.start
							: parseFloat(i.start);
			}
			this.curve = new v(e);
		}),
		true
	);
	aspect.after(a, "onAnimate", lang.hitch(domStyle, "set", a.node), true);
	return a;
};
fx.anim = function (e, t, n, r, o, i) {
	return fx
		.animateProperty({
			node: e,
			duration: n || Animation.prototype.duration,
			properties: t,
			easing: r,
			onEnd: o,
		})
		.play(i || 0);
};
mixin(dojo, fx);
dojo._Animation = Animation;

interface Line {
	/**
	 * Returns the point on the line
	 * @param {number} n a floating point number greater than 0 and less than 1
	 */
	getValue(n: number): number;
}

/**
 * Object used to generate values from a start value to an end value
 */
interface LineConstructor {
	new (start: number, end: number): Line;
}

interface EasingFunction {
	(n: number): number;
}

/**
 * A generic animation class that fires callbacks into its handlers
 * object at various states.
 */
interface AnimationConstructor {
	new (args: any): DojoJS.Animation;
	prototype: DojoJS.Animation;
}

interface AnimationCallback {
	(node: HTMLElement): void;
}

interface FadeArguments {
	node: HTMLElement | string;
	duration?: number;
	easing?: EasingFunction;

	start?: Function;
	end?: Function;
	delay?: number;
}

interface AnimationArgumentsProperties extends Partial<AnimationArguments> {
	[name: string]: any;
}

interface AnimationArguments extends FadeArguments {
	properties?: AnimationArgumentsProperties;
	onEnd?: AnimationCallback;
	onAnimate?: AnimationCallback;
}

declare global {
	namespace DojoJS
	{
		interface Dojo extends Fx {
			_Animation: AnimationConstructor;
		}

		interface Fx {
			_Line: LineConstructor;
		
			Animation: AnimationConstructor;
		
			_fade(args: any): DojoJS.Animation;
		
			/**
			 * Returns an animation that will fade node defined in 'args' from
			 * its current opacity to fully opaque.
			 */
			fadeIn(args: AnimationArguments): DojoJS.Animation;
		
			/**
			 * Returns an animation that will fade node defined in 'args'
			 * from its current opacity to fully transparent.
			 */
			fadeOut(args: AnimationArguments): DojoJS.Animation;
		
			_defaultEasing(n?: number): number;
		
			/**
			 * Returns an animation that will transition the properties of
			 * node defined in `args` depending how they are defined in
			 * `args.properties`
			 */
			animateProperty(args: AnimationArguments): DojoJS.Animation;
		
			/**
			 * A simpler interface to `animateProperty()`, also returns
			 * an instance of `Animation` but begins the animation
			 * immediately, unlike nearly every other Dojo animation API.
			 */
			anim(
				node: HTMLElement | string,
				properties: { [name: string]: any },
				duration?: number,
				easing?: Function,
				onEnd?: AnimationCallback,
				delay?: number): DojoJS.Animation;
		
			/**
			 * Chain a list of `dojo/_base/fx.Animation`s to run in sequence
			 */
			chain(animations: DojoJS.Animation[]): DojoJS.Animation;
			chain(...animations: DojoJS.Animation[]): DojoJS.Animation;
		
			/**
			 * Combine a list of `dojo/_base/fx.Animation`s to run in parallel
			 */
			combine(animations: DojoJS.Animation[]): DojoJS.Animation;
			combine(...animations: DojoJS.Animation[]): DojoJS.Animation;
		
			/**
			 * Expand a node to it's natural height.
			 */
			wipeIn(args: AnimationArguments): DojoJS.Animation;
		
			/**
			 * Shrink a node to nothing and hide it.
			 */
			wipeOut(args: AnimationArguments): DojoJS.Animation;
		
			/**
			 * Slide a node to a new top/left position
			 */
			slideTo(args: AnimationArguments & { left?: number | string, top?: number | string }): DojoJS.Animation;
		}

		interface Animation extends Evented {
			/**
			 * The time in milliseconds the animation will take to run
			 */
			duration: number;
		
			/**
			 * A two element array of start and end values, or a `_Line` instance to be
			 * used in the Animation.
			 */
			curve: Line | [number, number];
		
			/**
			 * A Function to adjust the acceleration (or deceleration) of the progress
			 * across a _Line
			 */
			easing?: EasingFunction;
		
			/**
			 * The number of times to loop the animation
			 */
			repeat: number;
		
			/**
			 * the time in milliseconds to wait before advancing to next frame
			 * (used as a fps timer: 1000/rate = fps)
			 */
			rate: number;
		
			/**
			 * The time in milliseconds to wait before starting animation after it
			 * has been .play()'ed
			 */
			delay?: number;
		
			/**
			 * Synthetic event fired before a Animation begins playing (synchronous)
			 */
			beforeBegin: Event;
		
			/**
			 * Synthetic event fired as a Animation begins playing (useful?)
			 */
			onBegin: Event;
		
			/**
			 * Synthetic event fired at each interval of the Animation
			 */
			onAnimate: Event;
		
			/**
			 * Synthetic event fired after the final frame of the Animation
			 */
			onEnd: Event;
		
			/**
			 * Synthetic event fired any time the Animation is play()'ed
			 */
			onPlay: Event;
		
			/**
			 * Synthetic event fired when the Animation is paused
			 */
			onPause: Event;
		
			/**
			 * Synthetic event fires when the Animation is stopped
			 */
			onStop: Event;
		
			_precent: number;
			_startRepeatCount: number;
			_getStep(): number;
		
			/**
			 * Convenience function.  Fire event "evt" and pass it the
			 * arguments specified in "args".
			 */
			_fire(evt: Event, args?: any[]): this;
		
			/**
			 * Start the animation.
			 */
			play(delay?: number, gotoStart?: boolean): this;
		
			_play(gotoStart?: boolean): this;
		
			/**
			 * Pauses a running animation.
			 */
			pause(): this;
		
			/**
			 * Sets the progress of the animation.
			 */
			gotoPercent(precent: number, andPlay?: boolean): this;
		
			/**
			 * Stops a running animation.
			 */
			stop(gotoEnd?: boolean): DojoJS.Animation;
		
			/**
			 * cleanup the animation
			 */
			destroy(): void;
		
			/**
			 * Returns a string token representation of the status of
			 * the animation, one of: "paused", "playing", "stopped"
			 */
			status(): string;
		
			_cycle(): DojoJS.Animation;
			_clearTimer(): void;
			_startTimer(): void;
			_stopTimer(): void;
		}
	}
}

export = fx;