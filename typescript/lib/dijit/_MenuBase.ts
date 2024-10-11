
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom");
import n = require("dojo/dom-attr");
import o = require("dojo/dom-class");
import a = require("dojo/_base/lang");
import s = require("dojo/mouse");
import r = require("dojo/on");
import l = require("dojo/window");
import d = require("./a11yclick");
import c = require("./registry");
import h = require("./_Widget");
import u = require("./_CssStateMixin");
import p = require("./_KeyNavContainer");
import m = require("./_TemplatedMixin");

var _MenuBase = t("dijit._MenuBase", [h, m, p, u], {
	selected: null,
	_setSelectedAttr: function (e) {
		if (this.selected != e) {
			if (this.selected) {
				this.selected._setSelected(false);
				this._onChildDeselect(this.selected);
			}
			e && e._setSelected(true);
			this._set("selected", e);
		}
	},
	activated: false,
	_setActivatedAttr: function (e) {
		o.toggle(this.domNode, "dijitMenuActive", e);
		o.toggle(this.domNode, "dijitMenuPassive", !e);
		this._set("activated", e);
	},
	parentMenu: null,
	popupDelay: 500,
	passivePopupDelay: 1 / 0,
	autoFocus: false,
	childSelector: function (e) {
		var t = c.byNode(e);
		return (
			e.parentNode == this.containerNode && t && t.focus
		);
	},
	postCreate: function () {
		var e = this,
			t =
				"string" == typeof this.childSelector
					? this.childSelector
					: a.hitch(this, "childSelector");
		this.own(
			r(
				this.containerNode,
				r.selector(t, s.enter),
				function () {
					e.onItemHover(c.byNode(this));
				}
			),
			r(
				this.containerNode,
				r.selector(t, s.leave),
				function () {
					e.onItemUnhover(c.byNode(this));
				}
			),
			r(
				this.containerNode,
				r.selector(t, d),
				function (t) {
					e.onItemClick(c.byNode(this), t);
					t.stopPropagation();
				}
			),
			r(
				this.containerNode,
				r.selector(t, "focusin"),
				function () {
					e._onItemFocus(c.byNode(this));
				}
			)
		);
		this.inherited(arguments);
	},
	onKeyboardSearch: function (e, t, i, n) {
		this.inherited(arguments);
		e &&
			(-1 == n || (e.popup && 1 == n)) &&
			this.onItemClick(e, t);
	},
	_keyboardSearchCompare: function (e, t) {
		return e.shortcutKey
			? t == e.shortcutKey.toLowerCase()
				? -1
				: 0
			: this.inherited(arguments)
			? 1
			: 0;
	},
	onExecute: function () {},
	onCancel: function () {},
	_moveToPopup: function (e) {
		if (
			this.focusedChild &&
			this.focusedChild.popup &&
			!this.focusedChild.disabled
		)
			this.onItemClick(this.focusedChild, e);
		else {
			var t = this._getTopMenu();
			t && t._isMenuBar && t.focusNext();
		}
	},
	_onPopupHover: function () {
		this.set("selected", this.currentPopupItem);
		this._stopPendingCloseTimer();
	},
	onItemHover: function (e) {
		if (this.activated) {
			this.set("selected", e);
			!e.popup ||
				e.disabled ||
				this.hover_timer ||
				(this.hover_timer = this.defer(function () {
					this._openItemPopup(e);
				}, this.popupDelay));
		} else if (this.passivePopupDelay < 1 / 0) {
			this.passive_hover_timer &&
				this.passive_hover_timer.remove();
			this.passive_hover_timer = this.defer(function () {
				this.onItemClick(e, { type: "click" });
			}, this.passivePopupDelay);
		}
		this._hoveredChild = e;
		e._set("hovering", true);
	},
	_onChildDeselect: function (e) {
		this._stopPopupTimer();
		if (this.currentPopupItem == e) {
			this._stopPendingCloseTimer();
			this._pendingClose_timer = this.defer(function () {
				this._pendingClose_timer = null;
				this.currentPopupItem = null;
				e._closePopup();
			}, this.popupDelay);
		}
	},
	onItemUnhover: function (e) {
		this._hoveredChild == e && (this._hoveredChild = null);
		if (this.passive_hover_timer) {
			this.passive_hover_timer.remove();
			this.passive_hover_timer = null;
		}
		e._set("hovering", false);
	},
	_stopPopupTimer: function () {
		this.hover_timer &&
			(this.hover_timer = this.hover_timer.remove());
	},
	_stopPendingCloseTimer: function () {
		this._pendingClose_timer &&
			(this._pendingClose_timer =
				this._pendingClose_timer.remove());
	},
	_getTopMenu: function () {
		for (var e = this; e.parentMenu; e = e.parentMenu);
		return e;
	},
	onItemClick: function (e, t) {
		this.passive_hover_timer &&
			this.passive_hover_timer.remove();
		this.focusChild(e);
		if (e.disabled) return false;
		if (e.popup) {
			this.set("selected", e);
			this.set("activated", true);
			var i =
				/^key/.test(t._origType || t.type) ||
				(0 == t.clientX && 0 == t.clientY);
			this._openItemPopup(e, i);
		} else {
			this.onExecute();
			e._onClick ? e._onClick(t) : e.onClick(t);
		}
	},
	_openItemPopup: function (e, t) {
		if (e != this.currentPopupItem) {
			if (this.currentPopupItem) {
				this._stopPendingCloseTimer();
				this.currentPopupItem._closePopup();
			}
			this._stopPopupTimer();
			var i = e.popup;
			i.parentMenu = this;
			this.own(
				(this._mouseoverHandle = r.once(
					i.domNode,
					"mouseover",
					a.hitch(this, "_onPopupHover")
				))
			);
			var n = this;
			e._openPopup(
				{
					parent: this,
					orient: this._orient || ["after", "before"],
					onCancel: function () {
						t && n.focusChild(e);
						n._cleanUp();
					},
					onExecute: a.hitch(this, "_cleanUp", true),
					onClose: function () {
						if (n._mouseoverHandle) {
							n._mouseoverHandle.remove();
							delete n._mouseoverHandle;
						}
					},
				},
				t
			);
			this.currentPopupItem = e;
		}
	},
	onOpen: function () {
		this.isShowingNow = true;
		this.set("activated", true);
	},
	onClose: function () {
		this.set("activated", false);
		this.set("selected", null);
		this.isShowingNow = false;
		this.parentMenu = null;
	},
	_closeChild: function () {
		this._stopPopupTimer();
		if (this.currentPopupItem) {
			if (this.focused) {
				n.set(
					this.selected.focusNode,
					"tabIndex",
					this.tabIndex
				);
				this.selected.focusNode.focus();
			}
			this.currentPopupItem._closePopup();
			this.currentPopupItem = null;
		}
	},
	_onItemFocus: function (e) {
		this._hoveredChild &&
			this._hoveredChild != e &&
			this.onItemUnhover(this._hoveredChild);
		this.set("selected", e);
	},
	_onBlur: function () {
		this._cleanUp(true);
		this.inherited(arguments);
	},
	_cleanUp: function (e) {
		this._closeChild();
		undefined === this.isShowingNow &&
			this.set("activated", false);
		e && this.set("selected", null);
	},
}) as DijitJS._MenuBaseConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_MenuBase: typeof _MenuBase;
		}
	}
}

export = _MenuBase;