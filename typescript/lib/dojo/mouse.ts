// @ts-nocheck

import dojo = require("./_base/kernel");
import on = require("./on");
import has = require("./has");
import dom = require("./dom");
import window = require("./_base/window");

has.add("dom-quirks", window.doc && "BackCompat" == window.doc.compatMode);
has.add(
	"events-mouseenter",
	window.doc && "onmouseenter" in window.doc.createElement("div")
);
has.add("events-mousewheel", window.doc && "onmousewheel" in window.doc);
var i, a;
i =
	(has("dom-quirks") && has("ie")) || !has("dom-addeventlistener")
		? {
				LEFT: 1,
				MIDDLE: 4,
				RIGHT: 2,
				isButton: function (e, t) {
					return e.button & t;
				},
				isLeft: function (e) {
					return 1 & e.button;
				},
				isMiddle: function (e) {
					return 4 & e.button;
				},
				isRight: function (e) {
					return 2 & e.button;
				},
			}
		: {
				LEFT: 0,
				MIDDLE: 1,
				RIGHT: 2,
				isButton: function (e, t) {
					return e.button == t;
				},
				isLeft: function (e) {
					return 0 == e.button;
				},
				isMiddle: function (e) {
					return 1 == e.button;
				},
				isRight: function (e) {
					return 2 == e.button;
				},
			};
dojo.mouseButtons = i;
function s(e, n) {
	var o = function (o, i) {
		return on(o, e, function (e) {
			return n
				? n(e, i)
				: dom.isDescendant(e.relatedTarget, o)
				? undefined
				: i.call(this, e);
		});
	};
	o.bubble = function (t) {
		return s(e, function (e, n) {
			var r = t(e.target),
				o = e.relatedTarget;
			if (r && r != (o && 1 == o.nodeType && t(o)))
				return n.call(r, e);
		});
	};
	return o;
}
a = has("events-mousewheel")
	? "mousewheel"
	: function (e, n) {
			return on(e, "DOMMouseScroll", function (e) {
				e.wheelDelta = -e.detail;
				n.call(this, e);
			});
		};

declare global {
	namespace DojoJS
	{
		interface MouseButtons {
			LEFT: 1;
			MIDDLE: 2;
			RIGHT: 4;
	
			/**
			 * Test an event object (from a mousedown event) to see if the left button was pressed.
			 */
			isLeft(e: MouseEvent): boolean;
	
			/**
			 * Test an event object (from a mousedown event) to see if the middle button was pressed.
			 */
			isMiddle(e: MouseEvent): boolean;
	
			/**
			 * Test an event object (from a mousedown event) to see if the right button was pressed.
			 */
			isRight(e: MouseEvent): boolean;

		}

		interface Mouse extends MouseButtons {
			_eventHandler(type: string, selectHandler?: (evt: MouseEvent, listener: EventListener) => void): MouseEvent;
	
	
			/**
			 * This is an extension event for the mouseenter that IE provides, emulating the
			 * behavior on other browsers.
			 */
			enter: MouseEvent;
	
			/**
			 * This is an extension event for the mouseleave that IE provides, emulating the
			 * behavior on other browsers.
			 */
			leave: MouseEvent;
	
			/**
			 * This is an extension event for the mousewheel that non-Mozilla browsers provide,
			 * emulating the behavior on Mozilla based browsers.
			 */
			wheel: string | ExtensionEvent;
		}

		interface Dojo {
			mouseButtons: MouseButtons;
		}
	}
}

export = {
	_eventHandler: s,
	enter: s("mouseover"),
	leave: s("mouseout"),
	wheel: a,
	isLeft: i.isLeft,
	isMiddle: i.isMiddle,
	isRight: i.isRight,
};