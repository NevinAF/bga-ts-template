
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/_base/Deferred");
import i = require("dojo/dom");
import n = require("dojo/dom-attr");
import o = require("dojo/dom-class");
import a = require("dojo/dom-geometry");
import s = require("dojo/dom-style");
import r = require("dojo/has");
import l = require("dojo/keys");
import d = require("dojo/_base/lang");
import c = require("dojo/on");
import h = require("dojo/touch");
import u = require("./registry");
import p = require("./focus");
import m = require("./popup");
import g = require("./_FocusMixin");

var _HasDropDown = e("dijit._HasDropDown", g, {
	_buttonNode: null,
	_arrowWrapperNode: null,
	_popupStateNode: null,
	_aroundNode: null,
	dropDown: null,
	autoWidth: true,
	forceWidth: false,
	maxHeight: -1,
	dropDownPosition: ["below", "above"],
	_stopClickEvents: true,
	_onDropDownMouseDown: function (e) {
		if (!this.disabled && !this.readOnly) {
			"MSPointerDown" != e.type && e.preventDefault();
			this.own(
				c.once(
					this.ownerDocument,
					h.release,
					d.hitch(this, "_onDropDownMouseUp")
				)
			);
			this.toggleDropDown();
		}
	},
	_onDropDownMouseUp: function (e) {
		var t = this.dropDown,
			i = false;
		if (e && this._opened) {
			var n = a.position(this._buttonNode, true);
			if (
				!(
					e.pageX >= n.x &&
					e.pageX <= n.x + n.w &&
					e.pageY >= n.y &&
					e.pageY <= n.y + n.h
				)
			) {
				for (var s = e.target; s && !i; )
					o.contains(s, "dijitPopup")
						? (i = true)
						: (s = s.parentNode);
				if (i) {
					s = e.target;
					if (t.onItemClick) {
						for (var r; s && !(r = u.byNode(s)); )
							s = s.parentNode;
						r &&
							r.onClick &&
							r.getParent &&
							r.getParent().onItemClick(r, e);
					}
					return;
				}
			}
		}
		this._opened
			? t.focus &&
				(false !== t.autoFocus ||
					("mouseup" == e.type && !this.hovering)) &&
				(this._focusDropDownTimer = this.defer(
					function () {
						t.focus();
						delete this._focusDropDownTimer;
					}
				))
			: this.focus && this.defer("focus");
	},
	_onDropDownClick: function (e) {
		if (this._stopClickEvents) {
			e.stopPropagation();
			e.preventDefault();
		}
	},
	buildRendering: function () {
		this.inherited(arguments);
		this._buttonNode =
			this._buttonNode || this.focusNode || this.domNode;
		this._popupStateNode =
			this._popupStateNode ||
			this.focusNode ||
			this._buttonNode;
		var e =
			{
				after: this.isLeftToRight() ? "Right" : "Left",
				before: this.isLeftToRight() ? "Left" : "Right",
				above: "Up",
				below: "Down",
				left: "Left",
				right: "Right",
			}[this.dropDownPosition[0]] ||
			this.dropDownPosition[0] ||
			"Down";
		o.add(
			this._arrowWrapperNode || this._buttonNode,
			"dijit" + e + "ArrowButton"
		);
	},
	postCreate: function () {
		this.inherited(arguments);
		var e = this.focusNode || this.domNode;
		this.own(
			c(
				this._buttonNode,
				h.press,
				d.hitch(this, "_onDropDownMouseDown")
			),
			c(
				this._buttonNode,
				"click",
				d.hitch(this, "_onDropDownClick")
			),
			c(e, "keydown", d.hitch(this, "_onKey")),
			c(e, "keyup", d.hitch(this, "_onKeyUp"))
		);
	},
	destroy: function () {
		this._opened && this.closeDropDown(true);
		if (this.dropDown) {
			this.dropDown._destroyed ||
				this.dropDown.destroyRecursive();
			delete this.dropDown;
		}
		this.inherited(arguments);
	},
	_onKey: function (e) {
		if (!this.disabled && !this.readOnly) {
			var t = this.dropDown,
				i = e.target;
			if (
				t &&
				this._opened &&
				t.handleKey &&
				false === t.handleKey(e)
			) {
				e.stopPropagation();
				e.preventDefault();
			} else if (
				t &&
				this._opened &&
				e.keyCode == l.ESCAPE
			) {
				this.closeDropDown();
				e.stopPropagation();
				e.preventDefault();
			} else if (
				!this._opened &&
				(e.keyCode == l.DOWN_ARROW ||
					((e.keyCode == l.ENTER ||
						(e.keyCode == l.SPACE &&
							(!this._searchTimer ||
								e.ctrlKey ||
								e.altKey ||
								e.metaKey))) &&
						("input" !==
							(i.tagName || "").toLowerCase() ||
							(i.type &&
								"text" !==
									i.type.toLowerCase()))))
			) {
				this._toggleOnKeyUp = true;
				e.stopPropagation();
				e.preventDefault();
			}
		}
	},
	_onKeyUp: function () {
		if (this._toggleOnKeyUp) {
			delete this._toggleOnKeyUp;
			this.toggleDropDown();
			var e = this.dropDown;
			e && e.focus && this.defer(d.hitch(e, "focus"), 1);
		}
	},
	_onBlur: function () {
		this.closeDropDown(false);
		this.inherited(arguments);
	},
	isLoaded: function () {
		return true;
	},
	loadDropDown: function (e) {
		e();
	},
	loadAndOpenDropDown: function () {
		var e = new t(),
			i = d.hitch(this, function () {
				this.openDropDown();
				e.resolve(this.dropDown);
			});
		this.isLoaded() ? i() : this.loadDropDown(i);
		return e;
	},
	toggleDropDown: function () {
		this.disabled ||
			this.readOnly ||
			(this._opened
				? this.closeDropDown(true)
				: this.loadAndOpenDropDown());
	},
	openDropDown: function () {
		var e = this.dropDown,
			t = e.domNode,
			i = this._aroundNode || this.domNode,
			s = this,
			r = m.open({
				parent: this,
				popup: e,
				around: i,
				orient: this.dropDownPosition,
				maxHeight: this.maxHeight,
				onExecute: function () {
					s.closeDropDown(true);
				},
				onCancel: function () {
					s.closeDropDown(true);
				},
				onClose: function () {
					n.set(s._popupStateNode, "popupActive", false);
					o.remove(
						s._popupStateNode,
						"dijitHasDropDownOpen"
					);
					s._set("_opened", false);
				},
			});
		if (
			this.forceWidth ||
			(this.autoWidth &&
				i.offsetWidth > e._popupWrapper.offsetWidth)
		) {
			var l = i.offsetWidth - e._popupWrapper.offsetWidth,
				c = { w: e.domNode.offsetWidth + l };
			this._origStyle = t.style.cssText;
			d.isFunction(e.resize)
				? e.resize(c)
				: a.setMarginBox(t, c);
			"R" == r.corner[1] &&
				(e._popupWrapper.style.left =
					e._popupWrapper.style.left.replace(
						"px",
						""
					) -
					l +
					"px");
		}
		n.set(this._popupStateNode, "popupActive", "true");
		o.add(this._popupStateNode, "dijitHasDropDownOpen");
		this._set("_opened", true);
		this._popupStateNode.setAttribute(
			"aria-expanded",
			"true"
		);
		this._popupStateNode.setAttribute("aria-owns", e.id);
		"presentation" === t.getAttribute("role") ||
			t.getAttribute("aria-labelledby") ||
			t.setAttribute("aria-labelledby", this.id);
		return r;
	},
	closeDropDown: function (e) {
		if (this._focusDropDownTimer) {
			this._focusDropDownTimer.remove();
			delete this._focusDropDownTimer;
		}
		if (this._opened) {
			this._popupStateNode.setAttribute(
				"aria-expanded",
				"false"
			);
			e && this.focus && this.focus();
			m.close(this.dropDown);
			this._opened = false;
		}
		if (this._origStyle) {
			this.dropDown.domNode.style.cssText =
				this._origStyle;
			delete this._origStyle;
		}
	},
} as DijitJS._HasDropDown<any>);

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_HasDropDown: typeof _HasDropDown;
		}
	}
}

export = _HasDropDown;