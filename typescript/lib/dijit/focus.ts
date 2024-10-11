
// @ts-nocheck

import aspect = require("dojo/aspect");
import declare = require("dojo/_base/declare");
import dom = require("dojo/dom");
import domAttr = require("dojo/dom-attr");
import domClass = require("dojo/dom-class");
import domConstruct = require("dojo/dom-construct");
import Evented = require("dojo/Evented");
import lang = require("dojo/_base/lang");
import on = require("dojo/on");
import domReady = require("dojo/domReady");
import has = require("dojo/sniff");
import Stateful = require("dojo/Stateful");
import _baseWindow = require("dojo/_base/window");
import _window = require("dojo/window");
import a11y = require("./a11y");
import registry = require("./registry");
import dijit = require("./main");

var _,
	v,
	focus = new (declare([Stateful, Evented], {
		curNode: null,
		activeStack: [],
		constructor: function () {
			var t = lang.hitch(this, function (e) {
				dom.isDescendant(this.curNode, e) &&
					this.set("curNode", null);
				dom.isDescendant(this.prevNode, e) &&
					this.set("prevNode", null);
			});
			aspect.before(domConstruct, "empty", t);
			aspect.before(domConstruct, "destroy", t);
		},
		registerIframe: function (e) {
			return this.registerWin(e.contentWindow, e);
		},
		registerWin: function (e, t) {
			var i = this,
				n = e.document && e.document.body;
			if (n) {
				var o = has("pointer-events")
						? "pointerdown"
						: has("MSPointer")
						? "MSPointerDown"
						: has("touch-events")
						? "mousedown, touchstart"
						: "mousedown",
					a = on(e.document, o, function (e) {
						(e &&
							e.target &&
							null == e.target.parentNode) ||
							i._onTouchNode(
								t || e.target,
								"mouse"
							);
					}),
					s = on(n, "focusin", function (e) {
						if (e.target.tagName) {
							var n =
								e.target.tagName.toLowerCase();
							"#document" != n &&
								"body" != n &&
								(a11y.isFocusable(e.target)
									? i._onFocusNode(
											t || e.target
										)
									: i._onTouchNode(
											t || e.target
										));
						}
					}),
					r = on(n, "focusout", function (e) {
						i._onBlurNode(t || e.target);
					});
				return {
					remove: function () {
						a.remove();
						s.remove();
						r.remove();
						a = s = r = null;
						n = null;
					},
				};
			}
		},
		_onBlurNode: function (e) {
			var t = new Date().getTime();
			if (!(t < _ + 100)) {
				this._clearFocusTimer &&
					clearTimeout(this._clearFocusTimer);
				this._clearFocusTimer = setTimeout(
					lang.hitch(this, function () {
						this.set("prevNode", this.curNode);
						this.set("curNode", null);
					}),
					0
				);
				this._clearActiveWidgetsTimer &&
					clearTimeout(this._clearActiveWidgetsTimer);
				t < v + 100 ||
					(this._clearActiveWidgetsTimer = setTimeout(
						lang.hitch(this, function () {
							delete this
								._clearActiveWidgetsTimer;
							this._setStack([]);
						}),
						0
					));
			}
		},
		_onTouchNode: function (e, t) {
			v = new Date().getTime();
			if (this._clearActiveWidgetsTimer) {
				clearTimeout(this._clearActiveWidgetsTimer);
				delete this._clearActiveWidgetsTimer;
			}
			domClass.contains(e, "dijitPopup") && (e = e.firstChild);
			var i = [];
			try {
				for (; e; ) {
					var a = domAttr.get(e, "dijitPopupParent");
					if (a) e = registry.byId(a).domNode;
					else if (
						e.tagName &&
						"body" == e.tagName.toLowerCase()
					) {
						if (e === _baseWindow.body()) break;
						e = _window.get(e.ownerDocument).frameElement;
					} else {
						var s =
								e.getAttribute &&
								e.getAttribute("widgetId"),
							r = s && registry.byId(s);
						!r ||
							("mouse" == t &&
								r.get("disabled")) ||
							i.unshift(s);
						e = e.parentNode;
					}
				}
			} catch (l) {}
			this._setStack(i, t);
		},
		_onFocusNode: function (e) {
			if (e && 9 != e.nodeType) {
				_ = new Date().getTime();
				if (this._clearFocusTimer) {
					clearTimeout(this._clearFocusTimer);
					delete this._clearFocusTimer;
				}
				this._onTouchNode(e);
				if (e != this.curNode) {
					this.set("prevNode", this.curNode);
					this.set("curNode", e);
				}
			}
		},
		_setStack: function (e, t) {
			var i = this.activeStack,
				n = i.length - 1,
				o = e.length - 1;
			if (e[o] != i[n]) {
				this.set("activeStack", e);
				var a, s;
				for (s = n; s >= 0 && i[s] != e[s]; s--)
					if ((a = registry.byId(i[s]))) {
						a._hasBeenBlurred = true;
						a.set("focused", false);
						a._focusManager == this && a._onBlur(t);
						this.emit("widget-blur", a, t);
					}
				for (s++; s <= o; s++)
					if ((a = registry.byId(e[s]))) {
						a.set("focused", true);
						a._focusManager == this &&
							a._onFocus(t);
						this.emit("widget-focus", a, t);
					}
			}
		},
		focus: function (e) {
			if (e)
				try {
					e.focus();
				} catch (t) {}
		},
	} as DijitJS.Focus))();
domReady(function () {
	var e = focus.registerWin(_window.get(document));
	has("ie") &&
		on(window, "unload", function () {
			if (e) {
				e.remove();
				e = null;
			}
		});
});
dijit.focus = function (e) {
	focus.focus(e);
};
for (var y in focus)
	/^_/.test(y) ||
		(dijit.focus[y] =
			"function" == typeof focus[y] ? lang.hitch(focus, y) : focus[y]);
focus.watch(function (e, t, i) {
	dijit.focus[e] = i;
});

declare global {
	namespace DojoJS {
		interface Dijit {
			focus: typeof focus;
		}
	}
}

export = focus;