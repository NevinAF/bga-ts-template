// @ts-nocheck

import e = require("require");
import t = require("dojo/_base/array");
import i = require("dojo/_base/declare");
import n = require("dojo/Deferred");
import o = require("dojo/i18n");
import a = require("dojo/dom-attr");
import s = require("dojo/dom-class");
import r = require("dojo/dom-geometry");
import l = require("dojo/dom-style");
import d = require("dojo/keys");
import c = require("dojo/_base/lang");
import h = require("dojo/sniff");
import u = require("dojo/string");
import p = require("dojo/topic");
import m = require("./_Container");
import g = require("./Toolbar");
import f = require("./ToolbarSeparator");
import _ = require("./layout/_LayoutWidget");
import v = require("./form/ToggleButton");
import _Plugin = require("./_editor/_Plugin");
import y = require("./_editor/plugins/EnterKeyHandling");
import w = require("./_editor/html");
import C = require("./_editor/range");
import k = require("./_editor/RichText");
import dijit = require("./main");
import "dojo/i18n"; // import "dojo/i18n!./_editor/nls/commands";

var Editor = i("dijit.Editor", k, {
	plugins: null,
	extraPlugins: null,
	constructor: function () {
		c.isArray(this.plugins) ||
			(this.plugins = [
				"undo",
				"redo",
				"|",
				"cut",
				"copy",
				"paste",
				"|",
				"bold",
				"italic",
				"underline",
				"strikethrough",
				"|",
				"insertOrderedList",
				"insertUnorderedList",
				"indent",
				"outdent",
				"|",
				"justifyLeft",
				"justifyRight",
				"justifyCenter",
				"justifyFull",
				y,
			]);
		this._plugins = [];
		this._editInterval = 1e3 * this.editActionInterval;
		if (h("ie") || h("trident") || h("edge")) {
			this.events.push("onBeforeDeactivate");
			this.events.push("onBeforeActivate");
		}
	},
	postMixInProperties: function () {
		this.setValueDeferred = new n();
		this.inherited(arguments);
	},
	postCreate: function () {
		this.inherited(arguments);
		this._steps = this._steps.slice(0);
		this._undoedSteps = this._undoedSteps.slice(0);
		c.isArray(this.extraPlugins) &&
			(this.plugins = this.plugins.concat(
				this.extraPlugins
			));
		this.commands = o.getLocalization(
			"dijit._editor",
			"commands",
			this.lang
		);
		h("webkit") &&
			l.set(this.domNode, "KhtmlUserSelect", "none");
	},
	startup: function () {
		this.inherited(arguments);
		if (!this.toolbar) {
			this.toolbar = new g({
				ownerDocument: this.ownerDocument,
				dir: this.dir,
				lang: this.lang,
				"aria-label": this.id,
			});
			this.header.appendChild(this.toolbar.domNode);
		}
		t.forEach(this.plugins, this.addPlugin, this);
		this.setValueDeferred.resolve(true);
		s.add(
			this.iframe.parentNode,
			"dijitEditorIFrameContainer"
		);
		s.add(this.iframe, "dijitEditorIFrame");
		a.set(this.iframe, "allowTransparency", true);
		this.toolbar.startup();
		this.onNormalizedDisplayChanged();
	},
	destroy: function () {
		t.forEach(this._plugins, function (e) {
			e && e.destroy && e.destroy();
		});
		this._plugins = [];
		this.toolbar.destroyRecursive();
		delete this.toolbar;
		this.inherited(arguments);
	},
	addPlugin: function (t, i) {
		var n = c.isString(t)
			? { name: t }
			: c.isFunction(t)
			? { ctor: t }
			: t;
		if (!n.setEditor) {
			var o = { args: n, plugin: null, editor: this };
			n.name &&
				(_Plugin.registry[n.name]
					? (o.plugin = _Plugin.registry[n.name](n))
					: p.publish(
							dijit._scopeName + ".Editor.getPlugin",
							o
						));
			if (!o.plugin)
				try {
					var a =
						n.ctor ||
						c.getObject(n.name) ||
						e(n.name);
					a && (o.plugin = new a(n));
				} catch (s) {
					throw new Error(
						this.id +
							": cannot find plugin [" +
							n.name +
							"]"
					);
				}
			if (!o.plugin)
				throw new Error(
					this.id +
						": cannot find plugin [" +
						n.name +
						"]"
				);
			t = o.plugin;
		}
		arguments.length > 1
			? (this._plugins[i] = t)
			: this._plugins.push(t);
		t.setEditor(this);
		c.isFunction(t.setToolbar) &&
			t.setToolbar(this.toolbar);
	},
	resize: function (e) {
		e && _.prototype.resize.apply(this, arguments);
	},
	layout: function () {
		var e =
			this._contentBox.h -
			(this.getHeaderHeight() +
				this.getFooterHeight() +
				r.getPadBorderExtents(this.iframe.parentNode)
					.h +
				r.getMarginExtents(this.iframe.parentNode).h);
		this.editingArea.style.height = e + "px";
		this.iframe && (this.iframe.style.height = "100%");
		this._layoutMode = true;
	},
	_onIEMouseDown: function (e) {
		var t,
			i = this.document.body,
			n = i.clientWidth,
			o = i.clientHeight,
			a = i.clientLeft,
			s = i.offsetWidth,
			r = i.offsetHeight,
			l = i.offsetLeft;
		/^rtl$/i.test(i.dir || "")
			? n < s && e.x > n && e.x < s && (t = true)
			: e.x < a && e.x > l && (t = true);
		t || (o < r && e.y > o && e.y < r && (t = true));
		if (!t) {
			delete this._cursorToStart;
			delete this._savedSelection;
			"BODY" == e.target.tagName &&
				this.defer("placeCursorAtEnd");
			this.inherited(arguments);
		}
	},
	onBeforeActivate: function () {
		this._restoreSelection();
	},
	onBeforeDeactivate: function (e) {
		this.customUndo && this.endEditing(true);
		"BODY" != e.target.tagName && this._saveSelection();
	},
	customUndo: true,
	editActionInterval: 3,
	beginEditing: function (e) {
		if (!this._inEditing) {
			this._inEditing = true;
			this._beginEditing(e);
		}
		if (this.editActionInterval > 0) {
			this._editTimer && this._editTimer.remove();
			this._editTimer = this.defer(
				"endEditing",
				this._editInterval
			);
		}
	},
	_steps: [],
	_undoedSteps: [],
	execCommand: function (e) {
		if (!this.customUndo || ("undo" != e && "redo" != e)) {
			if (this.customUndo) {
				this.endEditing();
				this._beginEditing();
			}
			var t = this.inherited(arguments);
			this.customUndo && this._endEditing();
			return t;
		}
		return this[e]();
	},
	_pasteImpl: function () {
		return this._clipboardCommand("paste");
	},
	_cutImpl: function () {
		return this._clipboardCommand("cut");
	},
	_copyImpl: function () {
		return this._clipboardCommand("copy");
	},
	_clipboardCommand: function (e) {
		var t;
		try {
			t = this.document.execCommand(e, false, null);
			if (h("webkit") && !t) throw {};
		} catch (n) {
			var i = u.substitute;
			alert(
				i(this.commands.systemShortcut, [
					this.commands[e],
					i(
						this.commands[
							h("mac") ? "appleKey" : "ctrlKey"
						],
						[{ cut: "X", copy: "C", paste: "V" }[e]]
					),
				])
			);
			t = false;
		}
		return t;
	},
	queryCommandEnabled: function (e) {
		return !this.customUndo || ("undo" != e && "redo" != e)
			? this.inherited(arguments)
			: "undo" == e
			? this._steps.length > 1
			: this._undoedSteps.length > 0;
	},
	_moveToBookmark: function (e) {
		var i,
			n,
			o,
			a,
			s = e.mark,
			r = e.mark,
			l = e.isCollapsed;
		if (r)
			if (h("ie") < 9 || (9 === h("ie") && h("quirks"))) {
				if (c.isArray(r)) {
					s = [];
					t.forEach(
						r,
						function (e) {
							s.push(C.getNode(e, this.editNode));
						},
						this
					);
					this.selection.moveToBookmark({
						mark: s,
						isCollapsed: l,
					});
				} else if (
					r.startContainer &&
					r.endContainer &&
					(a = C.getSelection(this.window)) &&
					a.removeAllRanges
				) {
					a.removeAllRanges();
					i = C.create(this.window);
					n = C.getNode(
						r.startContainer,
						this.editNode
					);
					o = C.getNode(
						r.endContainer,
						this.editNode
					);
					if (n && o) {
						i.setStart(n, r.startOffset);
						i.setEnd(o, r.endOffset);
						a.addRange(i);
					}
				}
			} else if (
				(a = C.getSelection(this.window)) &&
				a.removeAllRanges
			) {
				a.removeAllRanges();
				i = C.create(this.window);
				n = C.getNode(r.startContainer, this.editNode);
				o = C.getNode(r.endContainer, this.editNode);
				if (n && o) {
					i.setStart(n, r.startOffset);
					i.setEnd(o, r.endOffset);
					a.addRange(i);
				}
			}
	},
	_changeToStep: function (e, t) {
		this.setValue(t.text);
		var i = t.bookmark;
		i && this._moveToBookmark(i);
	},
	undo: function () {
		var e = false;
		if (!this._undoRedoActive) {
			this._undoRedoActive = true;
			this.endEditing(true);
			var t = this._steps.pop();
			if (t && this._steps.length > 0) {
				this.focus();
				this._changeToStep(
					t,
					this._steps[this._steps.length - 1]
				);
				this._undoedSteps.push(t);
				this.onDisplayChanged();
				delete this._undoRedoActive;
				e = true;
			}
			delete this._undoRedoActive;
		}
		return e;
	},
	redo: function () {
		var e = false;
		if (!this._undoRedoActive) {
			this._undoRedoActive = true;
			this.endEditing(true);
			var t = this._undoedSteps.pop();
			if (t && this._steps.length > 0) {
				this.focus();
				this._changeToStep(
					this._steps[this._steps.length - 1],
					t
				);
				this._steps.push(t);
				this.onDisplayChanged();
				e = true;
			}
			delete this._undoRedoActive;
		}
		return e;
	},
	endEditing: function (e) {
		this._editTimer &&
			(this._editTimer = this._editTimer.remove());
		if (this._inEditing) {
			this._endEditing(e);
			this._inEditing = false;
		}
	},
	_getBookmark: function () {
		var e = this.selection.getBookmark(),
			i = [];
		if (e && e.mark) {
			var n = e.mark;
			if (h("ie") < 9 || (9 === h("ie") && h("quirks"))) {
				var o = C.getSelection(this.window);
				if (c.isArray(n)) {
					t.forEach(
						e.mark,
						function (e) {
							i.push(
								C.getIndex(e, this.editNode).o
							);
						},
						this
					);
					e.mark = i;
				} else if (o) {
					var a;
					o.rangeCount && (a = o.getRangeAt(0));
					e.mark = a
						? a.cloneRange()
						: this.selection.getBookmark();
				}
			}
			try {
				if (e.mark && e.mark.startContainer) {
					i = C.getIndex(
						e.mark.startContainer,
						this.editNode
					).o;
					e.mark = {
						startContainer: i,
						startOffset: e.mark.startOffset,
						endContainer:
							e.mark.endContainer ===
							e.mark.startContainer
								? i
								: C.getIndex(
										e.mark.endContainer,
										this.editNode
									).o,
						endOffset: e.mark.endOffset,
					};
				}
			} catch (s) {
				e.mark = null;
			}
		}
		return e;
	},
	_beginEditing: function () {
		0 === this._steps.length &&
			this._steps.push({
				text: w.getChildrenHtml(this.editNode),
				bookmark: this._getBookmark(),
			});
	},
	_endEditing: function () {
		var e = w.getChildrenHtml(this.editNode);
		this._undoedSteps = [];
		this._steps.push({
			text: e,
			bookmark: this._getBookmark(),
		});
	},
	onKeyDown: function (e) {
		h("ie") ||
			this.iframe ||
			e.keyCode != d.TAB ||
			this.tabIndent ||
			this._saveSelection();
		if (this.customUndo) {
			var t = e.keyCode;
			if (e.ctrlKey && !e.shiftKey && !e.altKey) {
				if (90 == t || 122 == t) {
					e.stopPropagation();
					e.preventDefault();
					this.undo();
					return;
				}
				if (89 == t || 121 == t) {
					e.stopPropagation();
					e.preventDefault();
					this.redo();
					return;
				}
			}
			this.inherited(arguments);
			switch (t) {
				case d.ENTER:
				case d.BACKSPACE:
				case d.DELETE:
					this.beginEditing();
					break;
				case 88:
				case 86:
					if (e.ctrlKey && !e.altKey && !e.metaKey) {
						this.endEditing();
						88 == e.keyCode
							? this.beginEditing("cut")
							: this.beginEditing("paste");
						this.defer("endEditing", 1);
						break;
					}
				default:
					if (
						!e.ctrlKey &&
						!e.altKey &&
						!e.metaKey &&
						(e.keyCode < d.F1 || e.keyCode > d.F15)
					) {
						this.beginEditing();
						break;
					}
				case d.ALT:
					this.endEditing();
					break;
				case d.UP_ARROW:
				case d.DOWN_ARROW:
				case d.LEFT_ARROW:
				case d.RIGHT_ARROW:
				case d.HOME:
				case d.END:
				case d.PAGE_UP:
				case d.PAGE_DOWN:
					this.endEditing(true);
				case d.CTRL:
				case d.SHIFT:
				case d.TAB:
			}
		} else this.inherited(arguments);
	},
	_onBlur: function () {
		this.inherited(arguments);
		this.endEditing(true);
	},
	_saveSelection: function () {
		try {
			this._savedSelection = this._getBookmark();
		} catch (e) {}
	},
	_restoreSelection: function () {
		if (this._savedSelection) {
			delete this._cursorToStart;
			this.selection.isCollapsed() &&
				this._moveToBookmark(this._savedSelection);
			delete this._savedSelection;
		}
	},
	onClick: function () {
		this.endEditing(true);
		this.inherited(arguments);
	},
	replaceValue: function (e) {
		if (this.customUndo)
			if (this.isClosed) this.setValue(e);
			else {
				this.beginEditing();
				e || (e = "&#160;");
				this.setValue(e);
				this.endEditing();
			}
		else this.inherited(arguments);
	},
	_setDisabledAttr: function (e) {
		this.setValueDeferred.then(
			c.hitch(this, function () {
				(!this.disabled && e) ||
				(!this._buttonEnabledPlugins && e)
					? t.forEach(this._plugins, function (e) {
							e.set("disabled", true);
						})
					: this.disabled &&
						!e &&
						t.forEach(this._plugins, function (e) {
							e.set("disabled", false);
						});
			})
		);
		this.inherited(arguments);
	},
	_setStateClass: function () {
		try {
			this.inherited(arguments);
			if (this.document && this.document.body) {
				l.set(
					this.document.body,
					"color",
					l.get(this.iframe, "color")
				);
				l.set(
					this.document.body,
					"background-color",
					l.get(this.iframe, "background-color")
				);
			}
		} catch (e) {}
	},
});
function A(e) {
	return new _Plugin({ command: e.name });
}
function j(e) {
	return new _Plugin({ buttonClass: v, command: e.name });
}
c.mixin(_Plugin.registry, {
	undo: A,
	redo: A,
	cut: A,
	copy: A,
	paste: A,
	insertOrderedList: A,
	insertUnorderedList: A,
	indent: A,
	outdent: A,
	justifyCenter: A,
	justifyFull: A,
	justifyLeft: A,
	justifyRight: A,
	delete: A,
	selectAll: A,
	removeFormat: A,
	unlink: A,
	insertHorizontalRule: A,
	bold: j,
	italic: j,
	underline: j,
	strikethrough: j,
	subscript: j,
	superscript: j,
	"|": function () {
		return new _Plugin({
			setEditor: function (e) {
				this.editor = e;
				this.button = new f({
					ownerDocument: e.ownerDocument,
				});
			},
		});
	},
});

declare global {
	namespace DojoJS
	{
		interface DojoDijit
		{
			Editor: typeof Editor;
		}
	}
}

export = Editor;