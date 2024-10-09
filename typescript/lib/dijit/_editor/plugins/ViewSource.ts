// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/aspect");
import i = require("dojo/_base/declare");
import n = require("dojo/dom-attr");
import o = require("dojo/dom-construct");
import a = require("dojo/dom-geometry");
import s = require("dojo/dom-style");
import r = require("dojo/i18n");
import l = require("dojo/keys");
import d = require("dojo/_base/lang");
import c = require("dojo/on");
import h = require("dojo/sniff");
import u = require("dojo/window");
import p = require("../../focus");
import m = require("../_Plugin");
import g = require("../../form/ToggleButton");
import f = require("../../main");
import _ = require("../../registry");
import "dojo/i18n"; // import "dojo/i18n!../nls/commands";

var ViewSource = i("dijit._editor.plugins.ViewSource", m, {
	stripScripts: true,
	stripComments: true,
	stripIFrames: true,
	stripEventHandlers: true,
	readOnly: false,
	_fsPlugin: null,
	toggle: function () {
		h("webkit") && (this._vsFocused = true);
		this.button.set("checked", !this.button.get("checked"));
	},
	_initButton: function () {
		var e = r.getLocalization("dijit._editor", "commands"),
			t = this.editor;
		this.button = new g({
			label: e.viewSource,
			ownerDocument: t.ownerDocument,
			dir: t.dir,
			lang: t.lang,
			showLabel: false,
			iconClass:
				this.iconClassPrefix +
				" " +
				this.iconClassPrefix +
				"ViewSource",
			tabIndex: "-1",
			onChange: d.hitch(this, "_showSource"),
		});
		this.button.set("readOnly", false);
	},
	setEditor: function (e) {
		this.editor = e;
		this._initButton();
		this.editor.addKeyHandler(
			l.F12,
			true,
			true,
			d.hitch(this, function (e) {
				this.button.focus();
				this.toggle();
				e.stopPropagation();
				e.preventDefault();
				setTimeout(
					d.hitch(this, function () {
						this.editor.focused &&
							this.editor.focus();
					}),
					100
				);
			})
		);
	},
	_showSource: function (i) {
		var n,
			o = this.editor,
			a = o._plugins;
		this._sourceShown = i;
		var r = this;
		try {
			this.sourceArea || this._createSourceView();
			if (i) {
				o._sourceQueryCommandEnabled =
					o.queryCommandEnabled;
				o.queryCommandEnabled = function (e) {
					return "viewsource" === e.toLowerCase();
				};
				this.editor.onDisplayChanged();
				n = o.get("value");
				n = this._filter(n);
				o.set("value", n);
				e.forEach(a, function (e) {
					!e ||
						e instanceof ViewSource ||
						!e.isInstanceOf(m) ||
						e.set("disabled", true);
				});
				this._fsPlugin &&
					(this._fsPlugin._getAltViewNode =
						function () {
							return r.sourceArea;
						});
				this.sourceArea.value = n;
				this.sourceArea.style.height =
					o.iframe.style.height;
				this.sourceArea.style.width =
					o.iframe.style.width;
				o.iframe.parentNode.style.position = "relative";
				s.set(o.iframe, {
					position: "absolute",
					top: 0,
					visibility: "hidden",
				});
				s.set(this.sourceArea, { display: "block" });
				this._resizeHandle = c(
					window,
					"resize",
					d.hitch(this, function () {
						var e = u.getBox(o.ownerDocument);
						if (
							"_prevW" in this &&
							"_prevH" in this
						) {
							if (
								e.w === this._prevW &&
								e.h === this._prevH
							)
								return;
							this._prevW = e.w;
							this._prevH = e.h;
						} else {
							this._prevW = e.w;
							this._prevH = e.h;
						}
						if (this._resizer) {
							clearTimeout(this._resizer);
							delete this._resizer;
						}
						this._resizer = setTimeout(
							d.hitch(this, function () {
								delete this._resizer;
								this._resize();
							}),
							10
						);
					})
				);
				setTimeout(d.hitch(this, this._resize), 100);
				this.editor.onNormalizedDisplayChanged();
				this.editor.__oldGetValue =
					this.editor.getValue;
				this.editor.getValue = d.hitch(
					this,
					function () {
						var e = this.sourceArea.value;
						return (e = this._filter(e));
					}
				);
				this._setListener = t.after(
					this.editor,
					"setValue",
					d.hitch(this, function (e) {
						e = e || "";
						e = this._filter(e);
						this.sourceArea.value = e;
					}),
					true
				);
			} else {
				if (!o._sourceQueryCommandEnabled) return;
				this._setListener.remove();
				delete this._setListener;
				this._resizeHandle.remove();
				delete this._resizeHandle;
				if (this.editor.__oldGetValue) {
					this.editor.getValue =
						this.editor.__oldGetValue;
					delete this.editor.__oldGetValue;
				}
				o.queryCommandEnabled =
					o._sourceQueryCommandEnabled;
				if (!this._readOnly) {
					n = this.sourceArea.value;
					n = this._filter(n);
					o.beginEditing();
					o.set("value", n);
					o.endEditing();
				}
				e.forEach(a, function (e) {
					e &&
						e.isInstanceOf(m) &&
						e.set("disabled", false);
				});
				s.set(this.sourceArea, "display", "none");
				s.set(o.iframe, {
					position: "relative",
					visibility: "visible",
				});
				delete o._sourceQueryCommandEnabled;
				this.editor.onDisplayChanged();
			}
			setTimeout(
				d.hitch(this, function () {
					var e = o.domNode.parentNode;
					if (e) {
						var t = _.getEnclosingWidget(e);
						t && t.resize && t.resize();
					}
					o.resize();
				}),
				300
			);
		} catch (l) {}
	},
	updateState: function () {
		this.button.set("disabled", this.get("disabled"));
	},
	_resize: function () {
		var e = this.editor,
			t = e.getHeaderHeight(),
			i = e.getFooterHeight(),
			n = a.position(e.domNode),
			o = a.getPadBorderExtents(e.iframe.parentNode),
			s = a.getMarginExtents(e.iframe.parentNode),
			r = a.getPadBorderExtents(e.domNode),
			l = { w: n.w - r.w, h: n.h - (t + r.h + i) };
		if (this._fsPlugin && this._fsPlugin.isFullscreen) {
			var d = u.getBox(e.ownerDocument);
			l.w = d.w - r.w;
			l.h = d.h - (t + r.h + i);
		}
		a.setMarginBox(this.sourceArea, {
			w: Math.round(l.w - (o.w + s.w)),
			h: Math.round(l.h - (o.h + s.h)),
		});
	},
	_createSourceView: function () {
		var e = this.editor,
			t = e._plugins;
		this.sourceArea = o.create("textarea");
		if (this.readOnly) {
			n.set(this.sourceArea, "readOnly", true);
			this._readOnly = true;
		}
		s.set(this.sourceArea, {
			padding: "0px",
			margin: "0px",
			borderWidth: "0px",
			borderStyle: "none",
		});
		n.set(this.sourceArea, "aria-label", this.editor.id);
		o.place(this.sourceArea, e.iframe, "before");
		h("ie") &&
			e.iframe.parentNode.lastChild !== e.iframe &&
			s.set(e.iframe.parentNode.lastChild, {
				width: "0px",
				height: "0px",
				padding: "0px",
				margin: "0px",
				borderWidth: "0px",
				borderStyle: "none",
			});
		e._viewsource_oldFocus = e.focus;
		var i,
			a,
			r = this;
		e.focus = function () {
			if (r._sourceShown) r.setSourceAreaCaret();
			else
				try {
					if (this._vsFocused) {
						delete this._vsFocused;
						p.focus(e.editNode);
					} else e._viewsource_oldFocus();
				} catch (t) {}
		};
		for (i = 0; i < t.length; i++)
			if (
				(a = t[i]) &&
				("dijit._editor.plugins.FullScreen" ===
					a.declaredClass ||
					a.declaredClass ===
						f._scopeName +
							"._editor.plugins.FullScreen")
			) {
				this._fsPlugin = a;
				break;
			}
		if (this._fsPlugin) {
			this._fsPlugin._viewsource_getAltViewNode =
				this._fsPlugin._getAltViewNode;
			this._fsPlugin._getAltViewNode = function () {
				return r._sourceShown
					? r.sourceArea
					: this._viewsource_getAltViewNode();
			};
		}
		this.own(
			c(
				this.sourceArea,
				"keydown",
				d.hitch(this, function (t) {
					if (
						this._sourceShown &&
						t.keyCode == l.F12 &&
						t.ctrlKey &&
						t.shiftKey
					) {
						this.button.focus();
						this.button.set("checked", false);
						setTimeout(
							d.hitch(this, function () {
								e.focus();
							}),
							100
						);
						t.stopPropagation();
						t.preventDefault();
					}
				})
			)
		);
	},
	_stripScripts: function (e) {
		e &&
			(e = (e = (e = e.replace(
				/<\s*script[^>]*>((.|\s)*?)<\\?\/\s*script\s*>/gi,
				""
			)).replace(
				/<\s*script\b([^<>]|\s)*>?/gi,
				""
			)).replace(
				/<[^>]*=(\s|)*[("|')]javascript:[^$1][(\s|.)]*[$1][^>]*>/gi,
				""
			));
		return e;
	},
	_stripComments: function (e) {
		e && (e = e.replace(/<!--(.|\s){1,}?-->/g, ""));
		return e;
	},
	_stripIFrames: function (e) {
		e &&
			(e = e.replace(
				/<\s*iframe[^>]*>((.|\s)*?)<\\?\/\s*iframe\s*>/gi,
				""
			));
		return e;
	},
	_stripEventHandlers: function (e) {
		if (e) {
			var t = e.match(
				/<[a-z]+?\b(.*?on.*?(['"]).*?\2.*?)+>/gim
			);
			if (t)
				for (var i = 0, n = t.length; i < n; i++) {
					var o = t[i],
						a = o.replace(
							/\s+on[a-z]*\s*=\s*(['"])(.*?)\1/gim,
							""
						);
					e = e.replace(o, a);
				}
		}
		return e;
	},
	_filter: function (e) {
		if (e) {
			this.stripScripts && (e = this._stripScripts(e));
			this.stripComments && (e = this._stripComments(e));
			this.stripIFrames && (e = this._stripIFrames(e));
			this.stripEventHandlers &&
				(e = this._stripEventHandlers(e));
		}
		return e;
	},
	setSourceAreaCaret: function () {
		var e = this.sourceArea;
		p.focus(e);
		if (this._sourceShown && !this.readOnly)
			if (e.setSelectionRange) e.setSelectionRange(0, 0);
			else if (this.sourceArea.createTextRange) {
				var t = e.createTextRange();
				t.collapse(true);
				t.moveStart("character", -99999);
				t.moveStart("character", 0);
				t.moveEnd("character", 0);
				t.select();
			}
	},
	destroy: function () {
		if (this._resizer) {
			clearTimeout(this._resizer);
			delete this._resizer;
		}
		if (this._resizeHandle) {
			this._resizeHandle.remove();
			delete this._resizeHandle;
		}
		if (this._setListener) {
			this._setListener.remove();
			delete this._setListener;
		}
		this.inherited(arguments);
	},
});
m.registry.viewSource = m.registry.viewsource = function (e) {
	return new ViewSource({
		readOnly: "readOnly" in e && e.readOnly,
		stripComments:
			!("stripComments" in e) || e.stripComments,
		stripScripts: !("stripScripts" in e) || e.stripScripts,
		stripIFrames: !("stripIFrames" in e) || e.stripIFrames,
		stripEventHandlers:
			!("stripEventHandlers" in e) ||
			e.stripEventHandlers,
	});
};
return ViewSource;

declare global {
	namespace DojoJS
	{
		interface Dijit_editorPlugins {
			ViewSource: typeof ViewSource;
		}

		interface Dijit_editor {
			plugins: Dijit_editorPlugins;
		}

		interface Dijit {
			_editor: Dijit_editor;
		}
	}
}

export = ViewSource;