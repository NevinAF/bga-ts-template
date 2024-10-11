
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-attr");
import n = require("dojo/keys");
import o = require("dojo/_base/lang");
import a = require("dojo/on");
import s = require("dijit/registry");
import r = require("dijit/_FocusMixin");

var _KeyNavMixin = t("dijit._KeyNavMixin", r, {
	tabIndex: "0",
	childSelector: null,
	postCreate: function () {
		this.inherited(arguments);
		i.set(this.domNode, "tabIndex", this.tabIndex);
		if (!this._keyNavCodes) {
			var e = (this._keyNavCodes = {});
			e[n.HOME] = o.hitch(this, "focusFirstChild");
			e[n.END] = o.hitch(this, "focusLastChild");
			e[
				this.isLeftToRight()
					? n.LEFT_ARROW
					: n.RIGHT_ARROW
			] = o.hitch(this, "_onLeftArrow");
			e[
				this.isLeftToRight()
					? n.RIGHT_ARROW
					: n.LEFT_ARROW
			] = o.hitch(this, "_onRightArrow");
			e[n.UP_ARROW] = o.hitch(this, "_onUpArrow");
			e[n.DOWN_ARROW] = o.hitch(this, "_onDownArrow");
		}
		var t = this,
			r =
				"string" == typeof this.childSelector
					? this.childSelector
					: o.hitch(this, "childSelector");
		this.own(
			a(
				this.domNode,
				"keypress",
				o.hitch(this, "_onContainerKeypress")
			),
			a(
				this.domNode,
				"keydown",
				o.hitch(this, "_onContainerKeydown")
			),
			a(
				this.domNode,
				"focus",
				o.hitch(this, "_onContainerFocus")
			),
			a(
				this.containerNode,
				a.selector(r, "focusin"),
				function (e) {
					t._onChildFocus(
						s.getEnclosingWidget(this),
						e
					);
				}
			)
		);
	},
	_onLeftArrow: function () {},
	_onRightArrow: function () {},
	_onUpArrow: function () {},
	_onDownArrow: function () {},
	focus: function () {
		this.focusFirstChild();
	},
	_getFirstFocusableChild: function () {
		return this._getNextFocusableChild(null, 1);
	},
	_getLastFocusableChild: function () {
		return this._getNextFocusableChild(null, -1);
	},
	focusFirstChild: function () {
		this.focusChild(this._getFirstFocusableChild());
	},
	focusLastChild: function () {
		this.focusChild(this._getLastFocusableChild());
	},
	focusChild: function (e, t) {
		if (e) {
			this.focusedChild &&
				e !== this.focusedChild &&
				this._onChildBlur(this.focusedChild);
			e.set("tabIndex", this.tabIndex);
			e.focus(t ? "end" : "start");
		}
	},
	_onContainerFocus: function (e) {
		e.target !== this.domNode ||
			this.focusedChild ||
			this.focus();
	},
	_onFocus: function () {
		i.set(this.domNode, "tabIndex", "-1");
		this.inherited(arguments);
	},
	_onBlur: function (e) {
		i.set(this.domNode, "tabIndex", this.tabIndex);
		if (this.focusedChild) {
			this.focusedChild.set("tabIndex", "-1");
			this.lastFocusedChild = this.focusedChild;
			this._set("focusedChild", null);
		}
		this.inherited(arguments);
	},
	_onChildFocus: function (e) {
		if (e && e != this.focusedChild) {
			this.focusedChild &&
				!this.focusedChild._destroyed &&
				this.focusedChild.set("tabIndex", "-1");
			e.set("tabIndex", this.tabIndex);
			this.lastFocused = e;
			this._set("focusedChild", e);
		}
	},
	_searchString: "",
	multiCharSearchDuration: 1e3,
	onKeyboardSearch: function (e, t, i, n) {
		e && this.focusChild(e);
	},
	_keyboardSearchCompare: function (e, t) {
		var i = e.domNode,
			n = (
				e.label ||
				(i.focusNode ? i.focusNode.label : "") ||
				i.innerText ||
				i.textContent ||
				""
			)
				.replace(/^\s+/, "")
				.substr(0, t.length)
				.toLowerCase();
		return t.length && n == t ? -1 : 0;
	},
	_onContainerKeydown: function (e) {
		var t = this._keyNavCodes[e.keyCode];
		if (t) {
			t(e, this.focusedChild);
			e.stopPropagation();
			e.preventDefault();
			this._searchString = "";
		} else if (
			e.keyCode == n.SPACE &&
			this._searchTimer &&
			!(e.ctrlKey || e.altKey || e.metaKey)
		) {
			e.stopImmediatePropagation();
			e.preventDefault();
			this._keyboardSearch(e, " ");
		}
	},
	_onContainerKeypress: function (e) {
		if (
			!(
				e.charCode <= n.SPACE ||
				e.ctrlKey ||
				e.altKey ||
				e.metaKey
			)
		) {
			e.preventDefault();
			e.stopPropagation();
			this._keyboardSearch(
				e,
				String.fromCharCode(e.charCode).toLowerCase()
			);
		}
	},
	_keyboardSearch: function (e, t) {
		var i,
			n = null,
			a = 0;
		o.hitch(this, function () {
			this._searchTimer && this._searchTimer.remove();
			this._searchString += t;
			var e = /^(.)\1*$/.test(this._searchString)
				? 1
				: this._searchString.length;
			i = this._searchString.substr(0, e);
			this._searchTimer = this.defer(function () {
				this._searchTimer = null;
				this._searchString = "";
			}, this.multiCharSearchDuration);
			var o = this.focusedChild || null;
			if (
				(1 != e && o) ||
				(o = this._getNextFocusableChild(o, 1))
			) {
				var s = o;
				do {
					var r = this._keyboardSearchCompare(o, i);
					r && 0 == a++ && (n = o);
					if (-1 == r) {
						a = -1;
						break;
					}
					o = this._getNextFocusableChild(o, 1);
				} while (o && o != s);
			}
		})();
		this.onKeyboardSearch(n, e, i, a);
	},
	_onChildBlur: function () {},
	_getNextFocusableChild: function (e, t) {
		var i = e;
		do {
			if (e) e = this._getNext(e, t);
			else if (
				!(e = this[t > 0 ? "_getFirst" : "_getLast"]())
			)
				break;
			if (null != e && e != i && e.isFocusable())
				return e;
		} while (e != i);
		return null;
	},
	_getFirst: function () {
		return null;
	},
	_getLast: function () {
		return null;
	},
	_getNext: function (e, t) {
		if (e) {
			e = e.domNode;
			for (; e; )
				if (
					(e =
						e[
							t < 0
								? "previousSibling"
								: "nextSibling"
						]) &&
					"getAttribute" in e
				) {
					var i = s.byNode(e);
					if (i) return i;
				}
		}
		return null;
	},
}) as DijitJS._KeyNavMixinConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_KeyNavMixin: typeof _KeyNavMixin;
		}
	}
}

export = _KeyNavMixin;