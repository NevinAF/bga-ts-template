
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/aspect");
import i = require("dojo/_base/declare");
import n = require("dojo/dom");
import o = require("dojo/dom-attr");
import a = require("dojo/dom-construct");
import s = require("dojo/dom-geometry");
import r = require("dojo/dom-style");
import l = require("dojo/has");
import d = require("dojo/keys");
import c = require("dojo/_base/lang");
import h = require("dojo/on");
import u = require("./place");
import p = require("./BackgroundIframe");
import m = require("./Viewport");
import dijit = require("./main");
import "dojo/touch";

function f() {
	if (this._popupWrapper) {
		a.destroy(this._popupWrapper);
		delete this._popupWrapper;
	}
}
// TODO: This does not output with "DojoClass" when not forcibly typed.
var popup: DojoJS.DojoClass<DijitJS.Popup, []> = i(null, {
	_stack: [],
	_beginZIndex: 1e3,
	_idGen: 1,
	_repositionAll: function () {
		if (this._firstAroundNode) {
			var e = this._firstAroundPosition,
				t = s.position(this._firstAroundNode, true),
				i = t.x - e.x,
				n = t.y - e.y;
			if (i || n) {
				this._firstAroundPosition = t;
				for (var o = 0; o < this._stack.length; o++) {
					var a = this._stack[o].wrapper.style;
					a.top = parseFloat(a.top) + n + "px";
					"auto" == a.right
						? (a.left =
								parseFloat(a.left) + i + "px")
						: (a.right =
								parseFloat(a.right) - i + "px");
				}
			}
			this._aroundMoveListener = setTimeout(
				c.hitch(this, "_repositionAll"),
				i || n ? 10 : 50
			);
		}
	},
	_createWrapper: function (e) {
		var i = e._popupWrapper,
			n = e.domNode;
		if (!i) {
			(i = a.create(
				"div",
				{
					class: "dijitPopup",
					style: { display: "none" },
					role: "region",
					"aria-label":
						e["aria-label"] ||
						e.label ||
						e.name ||
						e.id,
				},
				e.ownerDocumentBody
			)).appendChild(n);
			var o = n.style;
			o.display = "";
			o.visibility = "";
			o.position = "";
			o.top = "0px";
			e._popupWrapper = i;
			t.after(e, "destroy", f, true);
			"ontouchend" in document &&
				h(i, "touchend", function (e) {
					/^(input|button|textarea)$/i.test(
						e.target.tagName
					) || e.preventDefault();
				});
			i.dojoClick = true;
		}
		return i;
	},
	moveOffScreen: function (e) {
		var t = this._createWrapper(e),
			i = s.isBodyLtr(e.ownerDocument),
			n = {
				visibility: "hidden",
				top: "-9999px",
				display: "",
			};
		n[i ? "left" : "right"] = "-9999px";
		n[i ? "right" : "left"] = "auto";
		r.set(t, n);
		return t;
	},
	hide: function (e) {
		var t = this._createWrapper(e);
		r.set(t, {
			display: "none",
			height: "auto",
			overflowY: "visible",
			border: "",
		});
		var i = e.domNode;
		"_originalStyle" in i &&
			(i.style.cssText = i._originalStyle);
	},
	getTopPopup: function () {
		for (
			var e = this._stack, t = e.length - 1;
			t > 0 && e[t].parent === e[t - 1].widget;
			t--
		);
		return e[t];
	},
	open: function (e) {
		for (
			var t = this._stack,
				i = e.popup,
				a = i.domNode,
				g = e.orient || [
					"below",
					"below-alt",
					"above",
					"above-alt",
				],
				f = e.parent
					? e.parent.isLeftToRight()
					: s.isBodyLtr(i.ownerDocument),
				_ = e.around,
				v =
					e.around && e.around.id
						? e.around.id + "_dropdown"
						: "popup_" + this._idGen++;
			t.length &&
			(!e.parent ||
				!n.isDescendant(
					e.parent.domNode,
					t[t.length - 1].widget.domNode
				));

		)
			this.close(t[t.length - 1].widget);
		var b = this.moveOffScreen(i);
		i.startup && !i._started && i.startup();
		var y,
			w = s.position(a);
		if ("maxHeight" in e && -1 != e.maxHeight)
			y = e.maxHeight || 1 / 0;
		else {
			var C = m.getEffectiveBox(this.ownerDocument),
				k = _
					? s.position(_, false)
					: {
							y: e.y - (e.padding || 0),
							h: 2 * (e.padding || 0),
						};
			y = Math.floor(Math.max(k.y, C.h - (k.y + k.h)));
		}
		if (w.h > y) {
			var x = r.getComputedStyle(a),
				T =
					x.borderLeftWidth +
					" " +
					x.borderLeftStyle +
					" " +
					x.borderLeftColor;
			r.set(b, {
				overflowY: "scroll",
				height: y + "px",
				border: T,
			});
			a._originalStyle = a.style.cssText;
			a.style.border = "none";
		}
		o.set(b, {
			id: v,
			style: { zIndex: this._beginZIndex + t.length },
			class:
				"dijitPopup " +
				(i.baseClass || i.class || "").split(" ")[0] +
				"Popup",
			dijitPopupParent: e.parent ? e.parent.id : "",
		});
		if (0 == t.length && _) {
			this._firstAroundNode = _;
			this._firstAroundPosition = s.position(_, true);
			this._aroundMoveListener = setTimeout(
				c.hitch(this, "_repositionAll"),
				50
			);
		}
		l("config-bgIframe") &&
			!i.bgIframe &&
			(i.bgIframe = new p(b));
		var A = i.orient ? c.hitch(i, "orient") : null,
			j = _
				? u.around(b, _, g, f, A)
				: u.at(
						b,
						e,
						"R" == g
							? ["TR", "BR", "TL", "BL"]
							: ["TL", "BL", "TR", "BR"],
						e.padding,
						A
					);
		b.style.visibility = "visible";
		a.style.visibility = "visible";
		var S = [];
		S.push(
			h(
				b,
				"keydown",
				c.hitch(this, function (t) {
					if (t.keyCode == d.ESCAPE && e.onCancel) {
						t.stopPropagation();
						t.preventDefault();
						e.onCancel();
					} else if (t.keyCode == d.TAB) {
						t.stopPropagation();
						t.preventDefault();
						var i = this.getTopPopup();
						i && i.onCancel && i.onCancel();
					}
				})
			)
		);
		i.onCancel &&
			e.onCancel &&
			S.push(i.on("cancel", e.onCancel));
		S.push(
			i.on(
				i.onExecute ? "execute" : "change",
				c.hitch(this, function () {
					var e = this.getTopPopup();
					e && e.onExecute && e.onExecute();
				})
			)
		);
		t.push({
			widget: i,
			wrapper: b,
			parent: e.parent,
			onExecute: e.onExecute,
			onCancel: e.onCancel,
			onClose: e.onClose,
			handlers: S,
		});
		i.onOpen && i.onOpen(j);
		return j;
	},
	close: function (t) {
		for (
			var i = this._stack;
			(t &&
				e.some(i, function (e) {
					return e.widget == t;
				})) ||
			(!t && i.length);

		) {
			var n,
				o = i.pop(),
				a = o.widget,
				s = o.onClose;
			if (a.bgIframe) {
				a.bgIframe.destroy();
				delete a.bgIframe;
			}
			a.onClose && a.onClose();
			for (; (n = o.handlers.pop()); ) n.remove();
			a && a.domNode && this.hide(a);
			s && s();
		}
		if (0 == i.length && this._aroundMoveListener) {
			clearTimeout(this._aroundMoveListener);
			this._firstAroundNode =
				this._firstAroundPosition =
				this._aroundMoveListener =
					null;
		}
	},
} as DijitJS.Popup);

declare global {
	namespace DojoJS
	{
		interface Dijit
		{
			popup: InstanceType<typeof popup>;
		}
	}
}

export = (dijit.popup = new popup());