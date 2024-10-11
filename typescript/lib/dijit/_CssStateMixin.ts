
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom");
import n = require("dojo/dom-class");
import o = require("dojo/has");
import a = require("dojo/_base/lang");
import s = require("dojo/on");
import r = require("dojo/domReady");
import l = require("dojo/touch");
import d = require("dojo/_base/window");
import c = require("./a11yclick");
import h = require("./registry");

var _CssStateMixin = t("dijit._CssStateMixin", [], {
	hovering: false,
	active: false,
	_applyAttributes: function () {
		this.inherited(arguments);
		e.forEach(
			[
				"disabled",
				"readOnly",
				"checked",
				"selected",
				"focused",
				"state",
				"hovering",
				"active",
				"_opened",
			],
			function (e) {
				this.watch(e, a.hitch(this, "_setStateClass"));
			},
			this
		);
		for (var t in this.cssStateNodes || {})
			this._trackMouseState(
				this[t],
				this.cssStateNodes[t]
			);
		this._trackMouseState(this.domNode, this.baseClass);
		this._setStateClass();
	},
	_cssMouseEvent: function (e) {
		if (!this.disabled)
			switch (e.type) {
				case "mouseover":
				case "MSPointerOver":
				case "pointerover":
					this._set("hovering", true);
					this._set("active", this._mouseDown);
					break;
				case "mouseout":
				case "MSPointerOut":
				case "pointerout":
					this._set("hovering", false);
					this._set("active", false);
					break;
				case "mousedown":
				case "touchstart":
				case "MSPointerDown":
				case "pointerdown":
				case "keydown":
					this._set("active", true);
					break;
				case "mouseup":
				case "dojotouchend":
				case "MSPointerUp":
				case "pointerup":
				case "keyup":
					this._set("active", false);
			}
	},
	_setStateClass: function () {
		var t = this.baseClass.split(" ");
		function i(i) {
			t = t.concat(
				e.map(t, function (e) {
					return e + i;
				}),
				"dijit" + i
			);
		}
		this.isLeftToRight() || i("Rtl");
		var n =
			"mixed" == this.checked
				? "Mixed"
				: this.checked
				? "Checked"
				: "";
		this.checked && i(n);
		this.state && i(this.state);
		this.selected && i("Selected");
		this._opened && i("Opened");
		this.disabled
			? i("Disabled")
			: this.readOnly
			? i("ReadOnly")
			: this.active
			? i("Active")
			: this.hovering && i("Hover");
		this.focused && i("Focused");
		var o = this.stateNode || this.domNode,
			a = {};
		e.forEach(o.className.split(" "), function (e) {
			a[e] = true;
		});
		"_stateClasses" in this &&
			e.forEach(this._stateClasses, function (e) {
				delete a[e];
			});
		e.forEach(t, function (e) {
			a[e] = true;
		});
		var s = [];
		for (var r in a) s.push(r);
		o.className = s.join(" ");
		this._stateClasses = t;
	},
	_subnodeCssMouseEvent: function (e, t, i) {
		if (!this.disabled && !this.readOnly)
			switch (i.type) {
				case "mouseover":
				case "MSPointerOver":
				case "pointerover":
					o(true);
					break;
				case "mouseout":
				case "MSPointerOut":
				case "pointerout":
					o(false);
					a(false);
					break;
				case "mousedown":
				case "touchstart":
				case "MSPointerDown":
				case "pointerdown":
				case "keydown":
					a(true);
					break;
				case "mouseup":
				case "MSPointerUp":
				case "pointerup":
				case "dojotouchend":
				case "keyup":
					a(false);
					break;
				case "focus":
				case "focusin":
					s(true);
					break;
				case "blur":
				case "focusout":
					s(false);
			}
		function o(i) {
			n.toggle(e, t + "Hover", i);
		}
		function a(i) {
			n.toggle(e, t + "Active", i);
		}
		function s(i) {
			n.toggle(e, t + "Focused", i);
		}
	},
	_trackMouseState: function (e, t) {
		e._cssState = t;
	},
} as DijitJS._CssStateMixin);
r(function () {
	function e(e, t, n) {
		if (!n || !i.isDescendant(n, t))
			for (var o = t; o && o != n; o = o.parentNode)
				if (o._cssState) {
					var a = h.getEnclosingWidget(o);
					a &&
						(o == a.domNode
							? a._cssMouseEvent(e)
							: a._subnodeCssMouseEvent(
									o,
									o._cssState,
									e
								));
				}
	}
	var t,
		n = d.body();
	s(n, l.over, function (t) {
		e(t, t.target, t.relatedTarget);
	});
	s(n, l.out, function (t) {
		e(t, t.target, t.relatedTarget);
	});
	s(n, c.press, function (i) {
		e(i, (t = i.target));
	});
	s(n, c.release, function (i) {
		e(i, t);
		t = null;
	});
	s(n, "focusin, focusout", function (e) {
		var t = e.target;
		if (t._cssState && !t.getAttribute("widgetId")) {
			var i = h.getEnclosingWidget(t);
			i && i._subnodeCssMouseEvent(t, t._cssState, e);
		}
	});
});

declare global {
	namespace DojoJS {
		interface Dijit {
			_CssStateMixin: typeof _CssStateMixin
		}
	}
}


export = _CssStateMixin;