// @ts-nocheck

import lang = require("./_base/lang");
import Evented = require("./Evented");
import dojo = require("./_base/kernel");
import n = require("./_base/array");
import o = require("./aspect");
import a = require("./_base/fx");
import s = require("./dom");
import r = require("./dom-style");
import l = require("./dom-geometry");
import d = require("./ready");
import c = require("require");

dojo.isAsync ||
	d(0, function () {
		c(["./fx/Toggler"]);
	});
dojo.fx = {};
var dfx = dojo.fx,
	u = {
		_fire: function (e, t) {
			this[e] && this[e].apply(this, t || []);
			return this;
		},
	},
	p = function (e) {
		this._index = -1;
		this._animations = e || [];
		this._current =
			this._onAnimateCtx =
			this._onEndCtx =
				null;
		this.duration = 0;
		n.forEach(
			this._animations,
			function (e) {
				if (e) {
					undefined !== e.duration &&
						(this.duration += e.duration);
					e.delay && (this.duration += e.delay);
				}
			},
			this
		);
	};
p.prototype = new Evented();
lang.extend(p, {
	_onAnimate: function () {
		this._fire("onAnimate", arguments);
	},
	_onEnd: function () {
		this._onAnimateCtx.remove();
		this._onEndCtx.remove();
		this._onAnimateCtx = this._onEndCtx = null;
		if (this._index + 1 == this._animations.length)
			this._fire("onEnd");
		else {
			this._current = this._animations[++this._index];
			this._onAnimateCtx = o.after(
				this._current,
				"onAnimate",
				lang.hitch(this, "_onAnimate"),
				true
			);
			this._onEndCtx = o.after(
				this._current,
				"onEnd",
				lang.hitch(this, "_onEnd"),
				true
			);
			this._current.play(0, true);
		}
	},
	play: function (t, i) {
		this._current ||
			(this._current =
				this._animations[(this._index = 0)]);
		if (!i && "playing" == this._current.status())
			return this;
		var n = o.after(
				this._current,
				"beforeBegin",
				lang.hitch(this, function () {
					this._fire("beforeBegin");
				}),
				true
			),
			a = o.after(
				this._current,
				"onBegin",
				lang.hitch(this, function (e) {
					this._fire("onBegin", arguments);
				}),
				true
			),
			s = o.after(
				this._current,
				"onPlay",
				lang.hitch(this, function (e) {
					this._fire("onPlay", arguments);
					n.remove();
					a.remove();
					s.remove();
				})
			);
		this._onAnimateCtx && this._onAnimateCtx.remove();
		this._onAnimateCtx = o.after(
			this._current,
			"onAnimate",
			lang.hitch(this, "_onAnimate"),
			true
		);
		this._onEndCtx && this._onEndCtx.remove();
		this._onEndCtx = o.after(
			this._current,
			"onEnd",
			lang.hitch(this, "_onEnd"),
			true
		);
		this._current.play.apply(this._current, arguments);
		return this;
	},
	pause: function () {
		if (this._current) {
			var t = o.after(
				this._current,
				"onPause",
				lang.hitch(this, function (e) {
					this._fire("onPause", arguments);
					t.remove();
				}),
				true
			);
			this._current.pause();
		}
		return this;
	},
	gotoPercent: function (e, t) {
		this.pause();
		var i = this.duration * e;
		this._current = null;
		n.some(
			this._animations,
			function (e, t) {
				if (i <= e.duration) {
					this._current = e;
					this._index = t;
					return true;
				}
				i -= e.duration;
				return false;
			},
			this
		);
		this._current &&
			this._current.gotoPercent(
				i / this._current.duration
			);
		t && this.play();
		return this;
	},
	stop: function (t) {
		if (this._current) {
			if (t) {
				for (
					;
					this._index + 1 < this._animations.length;
					++this._index
				)
					this._animations[this._index].stop(true);
				this._current = this._animations[this._index];
			}
			var i = o.after(
				this._current,
				"onStop",
				lang.hitch(this, function (e) {
					this._fire("onStop", arguments);
					i.remove();
				}),
				true
			);
			this._current.stop();
		}
		return this;
	},
	status: function () {
		return this._current
			? this._current.status()
			: "stopped";
	},
	destroy: function () {
		this.stop();
		this._onAnimateCtx && this._onAnimateCtx.remove();
		this._onEndCtx && this._onEndCtx.remove();
	},
});
lang.extend(p, u);
dfx.chain = function (t) {
	return new p(
		lang.isArray(t) ? t : Array.prototype.slice.call(t, 0)
	);
};
var m = function (t) {
	this._animations = t || [];
	this._connects = [];
	this._finished = 0;
	this.duration = 0;
	n.forEach(
		t,
		function (t) {
			var i = t.duration;
			t.delay && (i += t.delay);
			this.duration < i && (this.duration = i);
			this._connects.push(
				o.after(t, "onEnd", lang.hitch(this, "_onEnd"), true)
			);
		},
		this
	);
	this._pseudoAnimation = new a.Animation({
		curve: [0, 1],
		duration: this.duration,
	});
	var i = this;
	n.forEach(
		[
			"beforeBegin",
			"onBegin",
			"onPlay",
			"onAnimate",
			"onPause",
			"onStop",
			"onEnd",
		],
		function (e) {
			i._connects.push(
				o.after(
					i._pseudoAnimation,
					e,
					function () {
						i._fire(e, arguments);
					},
					true
				)
			);
		}
	);
};
lang.extend(m, {
	_doAction: function (e, t) {
		n.forEach(this._animations, function (i) {
			i[e].apply(i, t);
		});
		return this;
	},
	_onEnd: function () {
		++this._finished > this._animations.length &&
			this._fire("onEnd");
	},
	_call: function (e, t) {
		var i = this._pseudoAnimation;
		i[e].apply(i, t);
	},
	play: function (e, t) {
		this._finished = 0;
		this._doAction("play", arguments);
		this._call("play", arguments);
		return this;
	},
	pause: function () {
		this._doAction("pause", arguments);
		this._call("pause", arguments);
		return this;
	},
	gotoPercent: function (e, t) {
		var i = this.duration * e;
		n.forEach(this._animations, function (e) {
			e.gotoPercent(
				e.duration < i ? 1 : i / e.duration,
				t
			);
		});
		this._call("gotoPercent", arguments);
		return this;
	},
	stop: function (e) {
		this._doAction("stop", arguments);
		this._call("stop", arguments);
		return this;
	},
	status: function () {
		return this._pseudoAnimation.status();
	},
	destroy: function () {
		this.stop();
		n.forEach(this._connects, function (e) {
			e.remove();
		});
	},
});
lang.extend(m, u);
dfx.combine = function (t) {
	return new m(
		lang.isArray(t) ? t : Array.prototype.slice.call(t, 0)
	);
};
dfx.wipeIn = function (t) {
	var i,
		n = (t.node = s.byId(t.node)),
		l = n.style,
		d = a.animateProperty(
			lang.mixin(
				{
					properties: {
						height: {
							start: function () {
								i = l.overflow;
								l.overflow = "hidden";
								if (
									"hidden" == l.visibility ||
									"none" == l.display
								) {
									l.height = "1px";
									l.display = "";
									l.visibility = "";
									return 1;
								}
								var e = r.get(n, "height");
								return Math.max(e, 1);
							},
							end: function () {
								return n.scrollHeight;
							},
						},
					},
				},
				t
			)
		),
		c = function () {
			l.height = "auto";
			l.overflow = i;
		};
	o.after(d, "onStop", c, true);
	o.after(d, "onEnd", c, true);
	return d;
};
dfx.wipeOut = function (t) {
	var i,
		n = (t.node = s.byId(t.node)).style,
		r = a.animateProperty(
			lang.mixin({ properties: { height: { end: 1 } } }, t)
		);
	o.after(
		r,
		"beforeBegin",
		function () {
			i = n.overflow;
			n.overflow = "hidden";
			n.display = "";
		},
		true
	);
	var l = function () {
		n.overflow = i;
		n.height = "auto";
		n.display = "none";
	};
	o.after(r, "onStop", l, true);
	o.after(r, "onEnd", l, true);
	return r;
};
dfx.slideTo = function (options) {
	var i,
		n = (options.node = s.byId(options.node)),
		d = null,
		c = null,
		h =
			((i = n),
			function () {
				var e = r.getComputedStyle(i),
					t = e.position;
				d =
					"absolute" == t
						? i.offsetTop
						: parseInt(e.top) || 0;
				c =
					"absolute" == t
						? i.offsetLeft
						: parseInt(e.left) || 0;
				if ("absolute" != t && "relative" != t) {
					var n = l.position(i, true);
					d = n.y;
					c = n.x;
					i.style.position = "absolute";
					i.style.top = d + "px";
					i.style.left = c + "px";
				}
			});
	h();
	var u = a.animateProperty(
		lang.mixin(
			{
				properties: {
					top: options.top || 0,
					left: options.left || 0,
				},
			},
			options
		)
	);
	o.after(u, "beforeBegin", h, true);
	return u;
};

declare global {
	namespace DojoJS
	{
		interface DojoFx extends Type<typeof import("dojo/_base/fx")> {}

		interface Dojo {
			fx: DojoFx;
		}
	}
}

export = dfx;