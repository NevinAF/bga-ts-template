// @ts-nocheck

import dojo = require("./_base/kernel");
import aspect = require("./aspect");
import dom = require("./dom");
import domClass = require("./dom-class");
import lang = require("./_base/lang");
import on = require("./on");
import has = require("./has");
import mouse = require("./mouse");
import domReady = require("./domReady");
import window = require("./_base/window");

var c,
	h,
	u,
	p,
	m,
	g,
	f,
	_,
	v,
	b,
	y = has("ios") < 5,
	w = has("pointer-events") || has("MSPointer"),
	C = (function () {
		var e = {};
		for (var t in {
			down: 1,
			move: 1,
			up: 1,
			cancel: 1,
			over: 1,
			out: 1,
		})
			e[t] = has("MSPointer")
				? "MSPointer" +
					t.charAt(0).toUpperCase() +
					t.slice(1)
				: "pointer" + t;
		return e;
	})(),
	k = has("touch-events"),
	x = false;
function T(e, t, i) {
	return w && i
		? function (e, t) {
				return on(e, i, t);
			}
		: k
		? function (i, n) {
				var o = on(i, t, function (e) {
						n.call(this, e);
						v = new Date().getTime();
					}),
					s = on(i, e, function (e) {
						(!v ||
							new Date().getTime() > v + 1e3) &&
							n.call(this, e);
					});
				return {
					remove: function () {
						o.remove();
						s.remove();
					},
				};
			}
		: function (t, i) {
				return on(t, e, i);
			};
}
function A(e, t, o) {
	if (!mouse.isRight(e)) {
		var s = (function (e) {
			do {
				if (undefined !== e.dojoClick) return e;
			} while ((e = e.parentNode));
		})(e.target);
		if ((h = !e.target.disabled && s && s.dojoClick)) {
			u = (x = "useTarget" == h) ? s : e.target;
			x && e.preventDefault();
			p = e.changedTouches
				? e.changedTouches[0].pageX -
					window.global.pageXOffset
				: e.clientX;
			m = e.changedTouches
				? e.changedTouches[0].pageY -
					window.global.pageYOffset
				: e.clientY;
			g =
				("object" == typeof h
					? h.x
					: "number" == typeof h
					? h
					: 0) || 4;
			f =
				("object" == typeof h
					? h.y
					: "number" == typeof h
					? h
					: 0) || 4;
			if (!c) {
				c = true;
				function l(e) {
					h = x
						? dom.isDescendant(
								window.doc.elementFromPoint(
									e.changedTouches
										? e.changedTouches[0]
												.pageX -
												window.global
													.pageXOffset
										: e.clientX,
									e.changedTouches
										? e.changedTouches[0]
												.pageY -
												window.global
													.pageYOffset
										: e.clientY
								),
								u
							)
						: h &&
							(e.changedTouches
								? e.changedTouches[0].target
								: e.target) == u &&
							Math.abs(
								(e.changedTouches
									? e.changedTouches[0]
											.pageX -
										window.global.pageXOffset
									: e.clientX) - p
							) <= g &&
							Math.abs(
								(e.changedTouches
									? e.changedTouches[0]
											.pageY -
										window.global.pageYOffset
									: e.clientY) - m
							) <= f;
				}
				window.doc.addEventListener(
					t,
					function (e) {
						if (!mouse.isRight(e)) {
							l(e);
							x && e.preventDefault();
						}
					},
					true
				);
				window.doc.addEventListener(
					o,
					function (e) {
						if (!mouse.isRight(e)) {
							l(e);
							if (h) {
								_ = new Date().getTime();
								var t = x ? u : e.target;
								"LABEL" === t.tagName &&
									(t =
										dom.byId(
											t.getAttribute(
												"for"
											)
										) || t);
								var n = e.changedTouches
									? e.changedTouches[0]
									: e;
								function o(t) {
									var i =
										document.createEvent(
											"MouseEvents"
										);
									i._dojo_click = true;
									i.initMouseEvent(
										t,
										true,
										true,
										e.view,
										e.detail,
										n.screenX,
										n.screenY,
										n.clientX,
										n.clientY,
										e.ctrlKey,
										e.altKey,
										e.shiftKey,
										e.metaKey,
										0,
										null
									);
									return i;
								}
								var s = o("mousedown"),
									d = o("mouseup"),
									c = o("click");
								setTimeout(function () {
									on.emit(t, "mousedown", s);
									on.emit(t, "mouseup", d);
									on.emit(t, "click", c);
									_ = new Date().getTime();
								}, 0);
							}
						}
					},
					true
				);
				function v(e) {
					window.doc.addEventListener(
						e,
						function (t) {
							var i = t.target;
							if (
								h &&
								!t._dojo_click &&
								new Date().getTime() <=
									_ + 1e3 &&
								("INPUT" != i.tagName ||
									!domClass.contains(
										i,
										"dijitOffScreen"
									))
							) {
								t.stopPropagation();
								t.stopImmediatePropagation &&
									t.stopImmediatePropagation();
								"click" == e &&
									("INPUT" != i.tagName ||
										("radio" == i.type &&
											(domClass.contains(
												i,
												"dijitCheckBoxInput"
											) ||
												domClass.contains(
													i,
													"mblRadioButton"
												))) ||
										("checkbox" == i.type &&
											(domClass.contains(
												i,
												"dijitCheckBoxInput"
											) ||
												domClass.contains(
													i,
													"mblCheckBox"
												)))) &&
									"TEXTAREA" != i.tagName &&
									"AUDIO" != i.tagName &&
									"VIDEO" != i.tagName &&
									t.preventDefault();
							}
						},
						true
					);
				}
				v("click");
				v("mousedown");
				v("mouseup");
			}
		}
	}
}
has("touch") &&
	domReady(
		w
			? function () {
					window.doc.addEventListener(
						C.down,
						function (e) {
							A(e, C.move, C.up);
						},
						true
					);
				}
			: function () {
					b = window.body();
					window.doc.addEventListener(
						"touchstart",
						function (e) {
							v = new Date().getTime();
							var t = b;
							b = e.target;
							on.emit(t, "dojotouchout", {
								relatedTarget: b,
								bubbles: true,
							});
							on.emit(b, "dojotouchover", {
								relatedTarget: t,
								bubbles: true,
							});
							A(e, "touchmove", "touchend");
						},
						true
					);
					function e(e) {
						var t = lang.delegate(e, { bubbles: true });
						if (has("ios") >= 6) {
							t.touches = e.touches;
							t.altKey = e.altKey;
							t.changedTouches = e.changedTouches;
							t.ctrlKey = e.ctrlKey;
							t.metaKey = e.metaKey;
							t.shiftKey = e.shiftKey;
							t.targetTouches = e.targetTouches;
						}
						return t;
					}
					on(window.doc, "touchmove", function (t) {
						v = new Date().getTime();
						var i = window.doc.elementFromPoint(
							t.pageX -
								(y ? 0 : window.global.pageXOffset),
							t.pageY -
								(y ? 0 : window.global.pageYOffset)
						);
						if (i) {
							if (b !== i) {
								on.emit(b, "dojotouchout", {
									relatedTarget: i,
									bubbles: true,
								});
								on.emit(i, "dojotouchover", {
									relatedTarget: b,
									bubbles: true,
								});
								b = i;
							}
							on.emit(i, "dojotouchmove", e(t)) ||
								t.preventDefault();
						}
					});
					on(window.doc, "touchend", function (t) {
						v = new Date().getTime();
						var i =
							window.doc.elementFromPoint(
								t.pageX -
									(y
										? 0
										: window.global.pageXOffset),
								t.pageY -
									(y
										? 0
										: window.global.pageYOffset)
							) || window.body();
						on.emit(i, "dojotouchend", e(t));
					});
				}
	);
var touch = {
	press: T("mousedown", "touchstart", C.down),
	move: T("mousemove", "dojotouchmove", C.move),
	release: T("mouseup", "dojotouchend", C.up),
	cancel: T(mouse.leave, "touchcancel", w ? C.cancel : null),
	over: T("mouseover", "dojotouchover", C.over),
	out: T("mouseout", "dojotouchout", C.out),
	enter: mouse._eventHandler(
		T("mouseover", "dojotouchover", C.over)
	),
	leave: mouse._eventHandler(
		T("mouseout", "dojotouchout", C.out)
	),
};
dojo.touch = touch;

interface Touch {
	press: DojoJS.ExtensionEvent;
	move: DojoJS.ExtensionEvent;
	release: DojoJS.ExtensionEvent;
	cancel: DojoJS.ExtensionEvent;
	over: DojoJS.ExtensionEvent;
	out: DojoJS.ExtensionEvent;
	enter: DojoJS.ExtensionEvent;
	leave: DojoJS.ExtensionEvent;
}

declare global {
	namespace DojoJS
	{
		interface Dojo {
			touch: Touch;
		}
	}
}

export = touch as Touch;