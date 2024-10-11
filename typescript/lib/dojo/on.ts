// @ts-nocheck

// import e = require("./has!dom-addeventlistener?:./aspect"); // wtf is this?
import t = require("./_base/kernel");
import n = require("./sniff");

var r = window.ScriptEngineMajorVersion;
n.add("jscript", r && r() + ScriptEngineMinorVersion() / 10);
n.add("event-orientationchange", n("touch") && !n("android"));
n.add(
	"event-stopimmediatepropagation",
	window.Event &&
		!!window.Event.prototype &&
		!!window.Event.prototype.stopImmediatePropagation
);
n.add("event-focusin", function (e, t, n) {
	return "onfocusin" in n;
});
n("touch") &&
	n.add("touch-can-modify-event-delegate", function () {
		var e = function () {};
		e.prototype = document.createEvent("MouseEvents");
		try {
			var t = new e();
			t.target = null;
			return null === t.target;
		} catch (n) {
			return false;
		}
	});
// @ts-ignore
var on: DojoJS.On = function (e, t, n, r) {
	return "function" != typeof e.on ||
		"function" == typeof t ||
		e.nodeType
		? on.parse(e, t, n, a, r, this)
		: e.on(t, n);
};
on.pausable = function (e, t, n, r) {
	var i,
		a = on(
			e,
			t,
			function () {
				if (!i) return n.apply(this, arguments);
			},
			r
		);
	a.pause = function () {
		i = true;
	};
	a.resume = function () {
		i = false;
	};
	return a;
};
on.once = function (e, t, n, r) {
	var i = on(e, t, function () {
		i.remove();
		return n.apply(this, arguments);
	});
	return i;
};
on.parse = function (e, t, n, r, i, a) {
	var s;
	if (t.call) return t.call(a, e, n);
	t instanceof Array
		? (s = t)
		: t.indexOf(",") > -1 && (s = t.split(/\s*,\s*/));
	if (s) {
		for (var u, c = [], l = 0; (u = s[l++]); )
			c.push(on.parse(e, u, n, r, i, a));
		c.remove = function () {
			for (var e = 0; e < c.length; e++) c[e].remove();
		};
		return c;
	}
	return r(e, t, n, i, a);
};
var i = /^touch/;
function a(e, t, r, a, s) {
	var u = t.match(/(.*):(.*)/);
	if (u) {
		t = u[2];
		u = u[1];
		return on.selector(u, t).call(s, e, r);
	}
	if (n("touch")) {
		i.test(t) && (r = _(r));
		if (
			!n("event-orientationchange") &&
			"orientationchange" == t
		) {
			t = "resize";
			e = window;
			r = _(r);
		}
	}
	p && (r = p(r));
	if (e.addEventListener) {
		var c = t in f,
			l = c ? f[t] : t;
		e.addEventListener(l, r, c);
		return {
			remove: function () {
				e.removeEventListener(l, r, c);
			},
		};
	}
	t = "on" + t;
	if (m && e.attachEvent) return m(e, t, r);
	throw new Error("Target must be an event emitter");
}
on.matches = function (e, n, r, o, i) {
	i = i && "function" == typeof i.matches ? i : t.query;
	o = false !== o;
	1 != e.nodeType && (e = e.parentNode);
	for (; !i.matches(e, n, r); )
		if (
			e == r ||
			false === o ||
			!(e = e.parentNode) ||
			1 != e.nodeType
		)
			return false;
	return e;
};
on.selector = function (e, t, n) {
	return function (r, i) {
		var a = "function" == typeof e ? { matches: e } : this,
			s = t.bubble;
		function u(t) {
			return on.matches(t, e, r, n, a);
		}
		return s
			? on(r, s(u), i)
			: on(r, t, function (e) {
					var t = u(e.target);
					if (t) {
						e.selectorTarget = t;
						return i.call(t, e);
					}
				});
	};
};
function s() {
	this.cancelable = false;
	this.defaultPrevented = true;
}
function u() {
	this.bubbles = false;
}
var c = [].slice,
	l = (on.emit = function (e, t, n) {
		var r = c.call(arguments, 2),
			o = "on" + t;
		if ("parentNode" in e) {
			var i = (r[0] = {});
			for (var a in n) i[a] = n[a];
			i.preventDefault = s;
			i.stopPropagation = u;
			i.target = e;
			i.type = t;
			n = i;
		}
		do {
			e[o] && e[o].apply(e, r);
		} while (n && n.bubbles && (e = e.parentNode));
		return n && n.cancelable && n;
	}),
	f = n("event-focusin")
		? {}
		: { focusin: "focus", focusout: "blur" };
if (!n("event-stopimmediatepropagation"))
	var d = function () {
			this.immediatelyStopped = true;
			this.modified = true;
		},
		p = function (e) {
			return function (t) {
				if (!t.immediatelyStopped) {
					t.stopImmediatePropagation = d;
					return e.apply(this, arguments);
				}
			};
		};
if (n("dom-addeventlistener"))
	on.emit = function (e, t, n) {
		if (e.dispatchEvent && document.createEvent) {
			var r = (e.ownerDocument || document).createEvent(
				"HTMLEvents"
			);
			r.initEvent(t, !!n.bubbles, !!n.cancelable);
			for (var i in n) i in r || (r[i] = n[i]);
			return e.dispatchEvent(r) && r;
		}
		return l.apply(on, arguments);
	};
else {
	on._fixEvent = function (e, t) {
		if (!e) {
			e = (
				(t &&
					(t.ownerDocument || t.document || t)
						.parentWindow) ||
				window
			).event;
		}
		if (!e) return e;
		try {
			h &&
				e.type == h.type &&
				e.srcElement == h.target &&
				(e = h);
		} catch (r) {}
		if (!e.target) {
			e.target = e.srcElement;
			e.currentTarget = t || e.srcElement;
			"mouseover" == e.type &&
				(e.relatedTarget = e.fromElement);
			"mouseout" == e.type &&
				(e.relatedTarget = e.toElement);
			if (!e.stopPropagation) {
				e.stopPropagation = y;
				e.preventDefault = b;
			}
			if ("keypress" === e.type) {
				var n =
					"charCode" in e ? e.charCode : e.keyCode;
				if (10 == n) {
					n = 0;
					e.keyCode = 13;
				} else
					13 == n || 27 == n
						? (n = 0)
						: 3 == n && (n = 99);
				e.charCode = n;
				v(e);
			}
		}
		return e;
	};
	var h,
		g = function (e) {
			this.handle = e;
		};
	g.prototype.remove = function () {
		delete _dojoIEListeners_[this.handle];
	};
	var m = function (t, r, i) {
			i = (function (e) {
				return function (t) {
					t = on._fixEvent(t, this);
					var n = e.call(this, t);
					if (t.modified) {
						h ||
							setTimeout(function () {
								h = null;
							});
						h = t;
					}
					return n;
				};
			})(i);
			if (
				((t.ownerDocument
					? t.ownerDocument.parentWindow
					: t.parentWindow || t.window || window) !=
					top ||
					n("jscript") < 5.8) &&
				!n("config-_allow_leaks")
			) {
				"undefined" == typeof _dojoIEListeners_ &&
					(_dojoIEListeners_ = []);
				var a,
					s = t[r];
				if (!s || !s.listeners) {
					var u = s;
					(s = Function(
						"event",
						"var callee = arguments.callee; for(var i = 0; i<callee.listeners.length; i++){var listener = _dojoIEListeners_[callee.listeners[i]]; if(listener){listener.call(this,event);}}"
					)).listeners = [];
					t[r] = s;
					s.global = this;
					u &&
						s.listeners.push(
							_dojoIEListeners_.push(u) - 1
						);
				}
				s.listeners.push(
					(a = s.global._dojoIEListeners_.push(i) - 1)
				);
				return new g(a);
			}
			return e.after(t, r, i, true);
		},
		v = function (e) {
			e.keyChar = e.charCode
				? String.fromCharCode(e.charCode)
				: "";
			e.charOrCode = e.keyChar || e.keyCode;
		},
		y = function () {
			this.cancelBubble = true;
		},
		b = (on._preventDefault = function () {
			this.bubbledKeyCode = this.keyCode;
			if (this.ctrlKey)
				try {
					this.keyCode = 0;
				} catch (e) {}
			this.defaultPrevented = true;
			this.returnValue = false;
			this.modified = true;
		});
}
if (n("touch"))
	var x = function () {},
		w = window.orientation,
		_ = function (e) {
			return function (t) {
				var r = t.corrected;
				if (!r) {
					var o = t.type;
					try {
						delete t.type;
					} catch (u) {}
					if (t.type) {
						if (
							n("touch-can-modify-event-delegate")
						) {
							x.prototype = t;
							r = new x();
						} else {
							r = {};
							for (var i in t) r[i] = t[i];
						}
						r.preventDefault = function () {
							t.preventDefault();
						};
						r.stopPropagation = function () {
							t.stopPropagation();
						};
					} else (r = t).type = o;
					t.corrected = r;
					if ("resize" == o) {
						if (w == window.orientation)
							return null;
						w = window.orientation;
						r.type = "orientationchange";
						return e.call(this, r);
					}
					if (!("rotation" in r)) {
						r.rotation = 0;
						r.scale = 1;
					}
					if (
						window.TouchEvent &&
						t instanceof TouchEvent
					) {
						var a = r.changedTouches[0];
						for (var s in a) {
							delete r[s];
							r[s] = a[s];
						}
					}
				}
				return e.call(this, r);
			};
		};

declare global {
	namespace DojoJS
	{
		interface PauseHandle extends Handle {
			pause(): void;
			resume(): void;
		}
	
		interface MatchesTarget {
			matches(node: Element, selector: string, context?: any): any[];
			[id: string]: any;
		}
	
		interface On {
			/**
			 * A function that provides core event listening functionality. With this function
			 * you can provide a target, event type, and listener to be notified of
			 * future matching events that are fired.
			 */
			(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): Handle;
	
			/**
			 * This function acts the same as on(), but with pausable functionality. The
			 * returned signal object has pause() and resume() functions. Calling the
			 * pause() method will cause the listener to not be called for future events.
			 */
			pausable(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): PauseHandle;
	
			/**
			 * This function acts the same as on(), but will only call the listener once. The
			 * listener will be called for the first
			 * event that takes place and then listener will automatically be removed.
			 */
			once(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): Handle;
	
			parse(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix: boolean, matchesTarget: Element | Record<string, any>): Handle;
	
			/**
			 * Check if a node match the current selector within the constraint of a context
			 */
			matches(node: Element, selector: string, context: Element, children: boolean, matchesTarget?: MatchesTarget): Element | boolean;
	
			/**
			 * Creates a new extension event with event delegation. This is based on
			 * the provided event type (can be extension event) that
			 * only calls the listener when the CSS selector matches the target of the event.
			 *
			 * The application must require() an appropriate level of dojo/query to handle the selector.
			 */
			selector(selector: string, type: string | ExtensionEvent, children?: boolean): ExtensionEvent;
	
			/**
			 * Fires an event on the target object.
			 */
			emit(target: Element | Record<string, any>, type: string | ExtensionEvent, event?: any): boolean;
	
			/**
			 * normalizes properties on the event object including event
			 * bubbling methods, keystroke normalization, and x/y positions
			 */
			_fixEvent(evt: any, sender: any): any;

			/**  */
			_preventDefault(): void;
		}
	}
}

export = on;