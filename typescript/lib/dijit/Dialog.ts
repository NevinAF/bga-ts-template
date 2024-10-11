
// @ts-nocheck

import _require = require("require");
import array = require("dojo/_base/array");
import aspect = require("dojo/aspect");
import declare = require("dojo/_base/declare");
import Deferred = require("dojo/Deferred");
import dom = require("dojo/dom");
import domClass = require("dojo/dom-class");
import domGeo = require("dojo/dom-geometry");
import domStyle = require("dojo/dom-style");
import fx = require("dojo/_base/fx");
import i18n = require("dojo/i18n");
import keys = require("dojo/keys");
import lang = require("dojo/_base/lang");
import on = require("dojo/on");
import ready = require("dojo/ready");
import has = require("dojo/sniff");
import touch = require("dojo/touch");
import window = require("dojo/window");
import Movable = require("dojo/dnd/Moveable");
import TimedMovable = require("dojo/dnd/TimedMoveable");
import focus = require("./focus");
import manager = require("./_base/manager");
import _Widget = require("./_Widget");
import _TemplatedMixin = require("./_TemplatedMixin");
import _CssStateMixin = require("./_CssStateMixin");
import _FormMixin = require("./form/_FormMixin");
import _DialogMixin = require("./_DialogMixin");
import DialogUnderlay_Template = require("./DialogUnderlay");
import ContentPane = require("./layout/ContentPane");
import utils = require("./layout/utils");
var template_DialogHTML: string = "<import?>"; // import N = require("dojo/text!./templates/Dialog.html"); TODO: Wtf is this?
import "./a11yclick";
// import "dojo/i18n!./nls/common"; TODO: Wtf is this?

var M = new Deferred();
M.resolve(true);
function D() {}
// TODO: This does not output with "DojoClass" when not forcibly typed.
var DialogBase: DojoJS.DojoClass<DijitJS._TemplatedMixin & DijitJS.form._FormMixin & DijitJS._DialogMixin & [DijitJS._CssStateMixin] & {
	templateString: string;
	baseClass: string;
	cssStateNodes: {
		closeButtonNode: string;
	};
	_setTitleAttr: {
		node: string;
		type: string;
	};
	open: boolean;
	duration: number;
	refocus: boolean;
	autofocus: boolean;
	_firstFocusItem: null;
	_lastFocusItem: null;
	draggable: boolean;
	_setDraggableAttr: (e: any) => void;
	maxRatio: number;
	closable: boolean;
	_setClosableAttr: (e: any) => void;
	postMixInProperties: () => void;
	postCreate: () => void;
	onLoad: () => void;
	focus: () => void;
	_endDrag: () => void;
	_setup: () => void;
	_size: () => void;
	_position: () => void;
	_onKey: (e: any) => void;
	show: () => any;
	hide: () => any;
	resize: (e: any) => void;
	_layoutChildren: () => void;
	destroy: () => void;
}, [params?: (Partial<DijitJS._TemplatedMixin> & ThisType<DijitJS._TemplatedMixin>) | undefined, srcNodeRef?: string | Node | undefined]> = declare(
	"dijit._DialogBase" + (has("dojo-bidi") ? "_NoBidi" : ""),
	[_TemplatedMixin, _FormMixin, _DialogMixin, _CssStateMixin],
	{
		templateString: template_DialogHTML,
		baseClass: "dijitDialog",
		cssStateNodes: {
			closeButtonNode: "dijitDialogCloseIcon",
		},
		_setTitleAttr: { node: "titleNode", type: "innerHTML" },
		open: false,
		duration: manager.defaultDuration,
		refocus: true,
		autofocus: true,
		_firstFocusItem: null,
		_lastFocusItem: null,
		draggable: true,
		_setDraggableAttr: function (e) {
			this._set("draggable", e);
		},
		maxRatio: 0.9,
		closable: true,
		_setClosableAttr: function (e) {
			this.closeButtonNode.style.display = e
				? ""
				: "none";
			this._set("closable", e);
		},
		postMixInProperties: function () {
			var e = i18n.getLocalization("dijit", "common");
			lang.mixin(this, e);
			this.inherited(arguments);
		},
		postCreate: function () {
			domStyle.set(this.domNode, {
				display: "none",
				position: "absolute",
			});
			this.ownerDocumentBody.appendChild(this.domNode);
			this.inherited(arguments);
			aspect.after(
				this,
				"onExecute",
				lang.hitch(this, "hide"),
				true
			);
			aspect.after(
				this,
				"onCancel",
				lang.hitch(this, "hide"),
				true
			);
			on(this.closeButtonNode, touch.press, function (e) {
				e.stopPropagation();
			});
			this._modalconnects = [];
		},
		onLoad: function () {
			this.resize();
			this._position();
			if (this.autofocus && L.isTop(this)) {
				this._getFocusItems();
				focus.focus(this._firstFocusItem);
			}
			this.inherited(arguments);
		},
		focus: function () {
			this._getFocusItems();
			focus.focus(this._firstFocusItem);
		},
		_endDrag: function () {
			var e = domGeo.position(this.domNode),
				t = window.getBox(this.ownerDocument);
			e.y = Math.min(Math.max(e.y, 0), t.h - e.h);
			e.x = Math.min(Math.max(e.x, 0), t.w - e.w);
			this._relativePosition = e;
			this._position();
		},
		_setup: function () {
			var e = this.domNode;
			if (this.titleBar && this.draggable) {
				this._moveable = new (6 == has("ie") ? TimedMovable : Movable)(e, {
					handle: this.titleBar,
				});
				aspect.after(
					this._moveable,
					"onMoveStop",
					lang.hitch(this, "_endDrag"),
					true
				);
			} else domClass.add(e, "dijitDialogFixed");
			this.underlayAttrs = {
				dialogId: this.id,
				class: array
					.map(this.class.split(/\s/), function (e) {
						return e + "_underlay";
					})
					.join(" "),
				_onKeyDown: lang.hitch(this, "_onKey"),
				ownerDocument: this.ownerDocument,
			};
		},
		_size: function () {
			this.resize();
		},
		_position: function () {
			if (
				!domClass.contains(this.ownerDocumentBody, "dojoMove")
			) {
				var e = this.domNode,
					t = window.getBox(this.ownerDocument),
					i = this._relativePosition,
					n = domGeo.position(e),
					o = Math.floor(
						t.l +
							(i
								? Math.min(i.x, t.w - n.w)
								: (t.w - n.w) / 2)
					),
					a = Math.floor(
						t.t +
							(i
								? Math.min(i.y, t.h - n.h)
								: (t.h - n.h) / 2)
					);
				domStyle.set(e, { left: o + "px", top: a + "px" });
			}
		},
		_onKey: function (e) {
			if (e.keyCode == keys.TAB) {
				this._getFocusItems();
				var t = e.target;
				if (
					this._firstFocusItem == this._lastFocusItem
				) {
					e.stopPropagation();
					e.preventDefault();
				} else if (
					t == this._firstFocusItem &&
					e.shiftKey
				) {
					focus.focus(this._lastFocusItem);
					e.stopPropagation();
					e.preventDefault();
				} else if (
					t == this._lastFocusItem &&
					!e.shiftKey
				) {
					focus.focus(this._firstFocusItem);
					e.stopPropagation();
					e.preventDefault();
				}
			} else if (this.closable && e.keyCode == keys.ESCAPE) {
				this.onCancel();
				e.stopPropagation();
				e.preventDefault();
			}
		},
		show: function () {
			if (this.open) return M.promise;
			this._started || this.startup();
			if (!this._alreadyInitialized) {
				this._setup();
				this._alreadyInitialized = true;
			}
			if (this._fadeOutDeferred) {
				this._fadeOutDeferred.cancel();
				L.hide(this);
			}
			var e,
				t = window.get(this.ownerDocument);
			this._modalconnects.push(
				on(t, "scroll", lang.hitch(this, "resize", null))
			);
			this._modalconnects.push(
				on(
					this.domNode,
					"keydown",
					lang.hitch(this, "_onKey")
				)
			);
			domStyle.set(this.domNode, { opacity: 0, display: "" });
			this._set("open", true);
			this._onShow();
			this.resize();
			this._position();
			this._fadeInDeferred = new Deferred(
				lang.hitch(this, function () {
					e.stop();
					delete this._fadeInDeferred;
				})
			);
			this._fadeInDeferred.then(undefined, D);
			var i = this._fadeInDeferred.promise;
			e = fx
				.fadeIn({
					node: this.domNode,
					duration: this.duration,
					beforeBegin: lang.hitch(this, function () {
						L.show(this, this.underlayAttrs);
					}),
					onEnd: lang.hitch(this, function () {
						if (this.autofocus && L.isTop(this)) {
							this._getFocusItems();
							focus.focus(this._firstFocusItem);
						}
						this._fadeInDeferred.resolve(true);
						delete this._fadeInDeferred;
					}),
				})
				.play();
			return i;
		},
		hide: function () {
			if (!this._alreadyInitialized || !this.open)
				return M.promise;
			this._fadeInDeferred &&
				this._fadeInDeferred.cancel();
			var e;
			this._fadeOutDeferred = new Deferred(
				lang.hitch(this, function () {
					e.stop();
					delete this._fadeOutDeferred;
				})
			);
			this._fadeOutDeferred.then(undefined, D);
			this._fadeOutDeferred.then(lang.hitch(this, "onHide"));
			var t,
				i = this._fadeOutDeferred.promise;
			e = fx
				.fadeOut({
					node: this.domNode,
					duration: this.duration,
					onEnd: lang.hitch(this, function () {
						this.domNode.style.display = "none";
						L.hide(this);
						this._fadeOutDeferred.resolve(true);
						delete this._fadeOutDeferred;
					}),
				})
				.play();
			this._scrollConnected &&
				(this._scrollConnected = false);
			for (; (t = this._modalconnects.pop()); )
				t.remove();
			this._relativePosition &&
				delete this._relativePosition;
			this._set("open", false);
			return i;
		},
		resize: function (e) {
			if ("none" != this.domNode.style.display) {
				this._checkIfSingleChild();
				if (!e) {
					if (this._shrunk) {
						if (
							this._singleChild &&
							undefined !==
								this._singleChildOriginalStyle
						) {
							this._singleChild.domNode.style.cssText =
								this._singleChildOriginalStyle;
							delete this
								._singleChildOriginalStyle;
						}
						array.forEach(
							[
								this.domNode,
								this.containerNode,
								this.titleBar,
								this.actionBarNode,
							],
							function (e) {
								e &&
									domStyle.set(e, {
										position: "static",
										width: "auto",
										height: "auto",
									});
							}
						);
						this.domNode.style.position =
							"absolute";
					}
					var i = window.getBox(this.ownerDocument);
					i.w *= this.maxRatio;
					i.h *= this.maxRatio;
					var n = domGeo.position(this.domNode);
					this._shrunk = false;
					if (n.w >= i.w) {
						e = { w: i.w };
						domGeo.setMarginBox(this.domNode, e);
						n = domGeo.position(this.domNode);
						this._shrunk = true;
					}
					if (n.h >= i.h) {
						e || (e = { w: n.w });
						e.h = i.h;
						this._shrunk = true;
					}
					if (e) {
						e.w || (e.w = n.w);
						e.h || (e.h = n.h);
					}
				}
				if (e) {
					domGeo.setMarginBox(this.domNode, e);
					var o = [];
					this.titleBar &&
						o.push({
							domNode: this.titleBar,
							region: "top",
						});
					this.actionBarNode &&
						o.push({
							domNode: this.actionBarNode,
							region: "bottom",
						});
					var a = {
						domNode: this.containerNode,
						region: "center",
					};
					o.push(a);
					var s = utils.marginBox2contentBox(
						this.domNode,
						e
					);
					utils.layoutChildren(this.domNode, s, o);
					if (this._singleChild) {
						var d = utils.marginBox2contentBox(
							this.containerNode,
							a
						);
						this._singleChild.resize({
							w: d.w,
							h: d.h,
						});
					} else {
						this.containerNode.style.overflow =
							"auto";
						this._layoutChildren();
					}
				} else this._layoutChildren();
				has("touch") || e || this._position();
			}
		},
		_layoutChildren: function () {
			array.forEach(this.getChildren(), function (e) {
				e.resize && e.resize();
			});
		},
		destroy: function () {
			this._fadeInDeferred &&
				this._fadeInDeferred.cancel();
			this._fadeOutDeferred &&
				this._fadeOutDeferred.cancel();
			this._moveable && this._moveable.destroy();
			for (var e; (e = this._modalconnects.pop()); )
				e.remove();
			L.hide(this);
			this.inherited(arguments);
		},
	}
);
has("dojo-bidi") &&
	(DialogBase = declare("dijit._DialogBase", DialogBase, {
		_setTitleAttr: function (e) {
			this._set("title", e);
			this.titleNode.innerHTML = e;
			this.applyTextDir(this.titleNode);
		},
		_setTextDirAttr: function (e) {
			if (this._created && this.textDir != e) {
				this._set("textDir", e);
				this.set("title", this.title);
			}
		},
	}));

var Dialog = declare("dijit.Dialog", [ContentPane, DialogBase], {}) as DijitJS.DialogConstructor;
Dialog._DialogBase = DialogBase;
var L = (Dialog._DialogLevelManager = {
		_beginZIndex: 950,
		show: function (e, t) {
			P[P.length - 1].focus = focus.curNode;
			var i = P[P.length - 1].dialog
				? P[P.length - 1].zIndex + 2
				: Dialog._DialogLevelManager._beginZIndex;
			domStyle.set(e.domNode, "zIndex", i);
			DialogUnderlay_Template.show(t, i - 1);
			P.push({ dialog: e, underlayAttrs: t, zIndex: i });
		},
		hide: function (e) {
			if (P[P.length - 1].dialog == e) {
				P.pop();
				var i = P[P.length - 1];
				1 == P.length
					? DialogUnderlay_Template.hide()
					: DialogUnderlay_Template.show(i.underlayAttrs, i.zIndex - 1);
				if (e.refocus) {
					var n = i.focus;
					if (
						i.dialog &&
						(!n ||
							!dom.isDescendant(
								n,
								i.dialog.domNode
							))
					) {
						i.dialog._getFocusItems();
						n = i.dialog._firstFocusItem;
					}
					if (n)
						try {
							n.focus();
						} catch (s) {}
				}
			} else {
				var o = array.indexOf(
					array.map(P, function (e) {
						return e.dialog;
					}),
					e
				);
				-1 != o && P.splice(o, 1);
			}
		},
		isTop: function (e) {
			return P[P.length - 1].dialog == e;
		},
	}),
	P = (Dialog._dialogStack = [
		{ dialog: null, focus: null, underlayAttrs: null },
	]);
has("dijit-legacy-requires") &&
	ready(0, function () {
		_require(["dijit/TooltipDialog"]);
	});

declare global {
	namespace DojoJS {
		interface Dijit {
			_DialogBase: typeof DialogBase;
			Dialog: typeof Dialog;
		}
	}
}

export = Dialog;