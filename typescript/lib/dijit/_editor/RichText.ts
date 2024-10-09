// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/config");
import i = require("dojo/_base/declare");
import n = require("dojo/_base/Deferred");
import o = require("dojo/dom");
import a = require("dojo/dom-attr");
import s = require("dojo/dom-class");
import r = require("dojo/dom-construct");
import l = require("dojo/dom-geometry");
import d = require("dojo/dom-style");
import c = require("dojo/_base/kernel");
import h = require("dojo/keys");
import u = require("dojo/_base/lang");
import p = require("dojo/on");
import m = require("dojo/query");
import g = require("dojo/domReady");
import f = require("dojo/sniff");
import _ = require("dojo/string");
import v = require("dojo/topic");
import b = require("dojo/_base/unload");
import y = require("dojo/_base/url");
import w = require("dojo/window");
import C = require("../_Widget");
import k = require("../_CssStateMixin");
import x = require("../selection");
import T = require("./range");
import A = require("./html");
import j = require("../focus");
import S = require("../main");

var RichText = i("dijit._editor.RichText", [C, k], {
	constructor: function (e) {
		this.contentPreFilters = [];
		this.contentPostFilters = [];
		this.contentDomPreFilters = [];
		this.contentDomPostFilters = [];
		this.editingAreaStyleSheets = [];
		this.events = [].concat(this.events);
		this._keyHandlers = {};
		e && u.isString(e.value) && (this.value = e.value);
		this.onLoadDeferred = new n();
	},
	baseClass: "dijitEditor",
	inheritWidth: false,
	focusOnLoad: false,
	name: "",
	styleSheets: "",
	height: "300px",
	minHeight: "1em",
	isClosed: true,
	isLoaded: false,
	_SEPARATOR: "@@**%%__RICHTEXTBOUNDRY__%%**@@",
	_NAME_CONTENT_SEP: "@@**%%:%%**@@",
	onLoadDeferred: null,
	isTabIndent: false,
	disableSpellCheck: false,
	postCreate: function () {
		this.domNode.tagName.toLowerCase();
		this.contentPreFilters = [
			u.trim,
			u.hitch(this, "_preFixUrlAttributes"),
		].concat(this.contentPreFilters);
		if (f("mozilla")) {
			this.contentPreFilters = [
				this._normalizeFontStyle,
			].concat(this.contentPreFilters);
			this.contentPostFilters = [
				this._removeMozBogus,
			].concat(this.contentPostFilters);
		}
		if (f("webkit")) {
			this.contentPreFilters = [
				this._removeWebkitBogus,
			].concat(this.contentPreFilters);
			this.contentPostFilters = [
				this._removeWebkitBogus,
			].concat(this.contentPostFilters);
		}
		if (f("ie") || f("trident")) {
			this.contentPostFilters = [
				this._normalizeFontStyle,
			].concat(this.contentPostFilters);
			this.contentDomPostFilters = [
				u.hitch(this, "_stripBreakerNodes"),
			].concat(this.contentDomPostFilters);
		}
		this.contentDomPostFilters = [
			u.hitch(this, "_stripTrailingEmptyNodes"),
		].concat(this.contentDomPostFilters);
		this.inherited(arguments);
		v.publish(
			S._scopeName + "._editor.RichText::init",
			this
		);
	},
	startup: function () {
		this.inherited(arguments);
		this.open();
		this.setupDefaultShortcuts();
	},
	setupDefaultShortcuts: function () {
		var e,
			t = u.hitch(this, function (e, t) {
				return function () {
					return !this.execCommand(e, t);
				};
			}),
			i = {
				b: t("bold"),
				i: t("italic"),
				u: t("underline"),
				a: t("selectall"),
				s: function () {
					this.save(true);
				},
				m: function () {
					this.isTabIndent = !this.isTabIndent;
				},
				1: t("formatblock", "h1"),
				2: t("formatblock", "h2"),
				3: t("formatblock", "h3"),
				4: t("formatblock", "h4"),
				"\\": t("insertunorderedlist"),
			};
		f("ie") || (i.Z = t("redo"));
		for (e in i) this.addKeyHandler(e, true, false, i[e]);
	},
	events: ["onKeyDown", "onKeyUp"],
	captureEvents: [],
	_editorCommandsLocalized: false,
	_localizeEditorCommands: function () {
		if (RichText._editorCommandsLocalized) {
			this._local2NativeFormatNames =
				RichText._local2NativeFormatNames;
			this._native2LocalFormatNames =
				RichText._native2LocalFormatNames;
		} else {
			RichText._editorCommandsLocalized = true;
			RichText._local2NativeFormatNames = {};
			RichText._native2LocalFormatNames = {};
			this._local2NativeFormatNames =
				RichText._local2NativeFormatNames;
			this._native2LocalFormatNames =
				RichText._native2LocalFormatNames;
			for (
				var e,
					t = [
						"div",
						"p",
						"pre",
						"h1",
						"h2",
						"h3",
						"h4",
						"h5",
						"h6",
						"ol",
						"ul",
						"address",
					],
					i = "",
					n = 0;
				(e = t[n++]);

			)
				"l" !== e.charAt(1)
					? (i +=
							"<" +
							e +
							"><span>content</span></" +
							e +
							"><br/>")
					: (i +=
							"<" +
							e +
							"><li>content</li></" +
							e +
							"><br/>");
			var o = r.create("div", {
				style: {
					position: "absolute",
					top: "0px",
					zIndex: 10,
					opacity: 0.01,
				},
				innerHTML: i,
			});
			this.ownerDocumentBody.appendChild(o);
			var a = u.hitch(this, function () {
				for (var e = o.firstChild; e; )
					try {
						this.selection.selectElement(
							e.firstChild
						);
						var t = e.tagName.toLowerCase();
						this._local2NativeFormatNames[t] =
							document.queryCommandValue(
								"formatblock"
							);
						this._native2LocalFormatNames[
							this._local2NativeFormatNames[t]
						] = t;
						e = e.nextSibling.nextSibling;
					} catch (i) {}
				r.destroy(o);
			});
			this.defer(a);
		}
	},
	open: function (e) {
		(!this.onLoadDeferred ||
			this.onLoadDeferred.fired >= 0) &&
			(this.onLoadDeferred = new n());
		this.isClosed || this.close();
		v.publish(
			S._scopeName + "._editor.RichText::open",
			this
		);
		1 === arguments.length &&
			e.nodeName &&
			(this.domNode = e);
		var i,
			l = this.domNode;
		if (u.isString(this.value)) {
			i = this.value;
			l.innerHTML = "";
		} else if (
			l.nodeName &&
			"textarea" == l.nodeName.toLowerCase()
		) {
			var c = (this.textarea = l);
			this.name = c.name;
			i = c.value;
			(l = this.domNode =
				this.ownerDocument.createElement(
					"div"
				)).setAttribute("widgetId", this.id);
			c.removeAttribute("widgetId");
			l.cssText = c.cssText;
			l.className += " " + c.className;
			r.place(l, c, "before");
			var h = u.hitch(this, function () {
				d.set(c, {
					display: "block",
					position: "absolute",
					top: "-1000px",
				});
				if (f("ie")) {
					var e = c.style;
					this.__overflow = e.overflow;
					e.overflow = "hidden";
				}
			});
			f("ie") ? this.defer(h, 10) : h();
			if (c.form) {
				var m = c.value;
				this.reset = function () {
					this.getValue() !== m &&
						this.replaceValue(m);
				};
				p(
					c.form,
					"submit",
					u.hitch(this, function () {
						a.set(c, "disabled", this.disabled);
						c.value = this.getValue();
					})
				);
			}
		} else {
			i = A.getChildrenHtml(l);
			l.innerHTML = "";
		}
		this.value = i;
		l.nodeName &&
			"LI" === l.nodeName &&
			(l.innerHTML = " <br>");
		this.header = l.ownerDocument.createElement("div");
		l.appendChild(this.header);
		this.editingArea = l.ownerDocument.createElement("div");
		l.appendChild(this.editingArea);
		this.footer = l.ownerDocument.createElement("div");
		l.appendChild(this.footer);
		this.name || (this.name = this.id + "_AUTOGEN");
		if (
			"" !== this.name &&
			(!t.useXDomain || t.allowXdRichTextSave)
		) {
			var g = o.byId(
				S._scopeName + "._editor.RichText.value"
			);
			if (g && "" !== g.value)
				for (
					var _,
						y = g.value.split(this._SEPARATOR),
						w = 0;
					(_ = y[w++]);

				) {
					var C = _.split(this._NAME_CONTENT_SEP);
					if (C[0] === this.name) {
						this.value = C[1];
						y = y.splice(w, 1);
						g.value = y.join(this._SEPARATOR);
						break;
					}
				}
			if (!RichText._globalSaveHandler) {
				RichText._globalSaveHandler = {};
				b.addOnUnload(function () {
					var e;
					for (e in RichText._globalSaveHandler) {
						var t = RichText._globalSaveHandler[e];
						u.isFunction(t) && t();
					}
				});
			}
			RichText._globalSaveHandler[this.id] = u.hitch(
				this,
				"_saveContent"
			);
		}
		this.isClosed = false;
		var k =
			(this.editorObject =
			this.iframe =
				this.ownerDocument.createElement("iframe"));
		k.id = this.id + "_iframe";
		k.style.border = "none";
		k.style.width = "100%";
		if (this._layoutMode) k.style.height = "100%";
		else if (f("ie") >= 7) {
			this.height && (k.style.height = this.height);
			this.minHeight &&
				(k.style.minHeight = this.minHeight);
		} else
			k.style.height = this.height
				? this.height
				: this.minHeight;
		k.frameBorder = 0;
		k._loadFunc = u.hitch(this, function (e) {
			this.window = e;
			this.document = e.document;
			this.selection = new x.SelectionManager(e);
			f("ie") && this._localizeEditorCommands();
			this.onLoad(this.get("value"));
		});
		var T,
			j = this._getIframeDocTxt()
				.replace(/\\/g, "\\\\")
				.replace(/'/g, "\\'");
		T =
			f("ie") < 11
				? 'javascript:document.open();try{parent.window;}catch(e){document.domain="' +
					document.domain +
					"\";}document.write('" +
					j +
					"');document.close()"
				: "javascript: '" + j + "'";
		this.editingArea.appendChild(k);
		k.src = T;
		"LI" === l.nodeName &&
			(l.lastChild.style.marginTop = "-1.2em");
		s.add(this.domNode, this.baseClass);
	},
	_local2NativeFormatNames: {},
	_native2LocalFormatNames: {},
	_getIframeDocTxt: function () {
		var e,
			t = d.getComputedStyle(this.domNode);
		if (this["aria-label"]) e = this["aria-label"];
		else {
			var i =
				m(
					'label[for="' + this.id + '"]',
					this.ownerDocument
				)[0] ||
				o.byId(
					this["aria-labelledby"],
					this.ownerDocument
				);
			i && (e = i.textContent || i.innerHTML || "");
		}
		var n =
				"<div id='dijitEditorBody' role='textbox' aria-multiline='true' " +
				(e ? " aria-label='" + _.escape(e) + "'" : "") +
				"></div>",
			a = [t.fontWeight, t.fontSize, t.fontFamily].join(
				" "
			),
			s = t.lineHeight;
		s =
			s.indexOf("px") >= 0
				? parseFloat(s) / parseFloat(t.fontSize)
				: s.indexOf("em") >= 0
				? parseFloat(s)
				: "normal";
		var r = "",
			l = this;
		this.style.replace(
			/(^|;)\s*(line-|font-?)[^;]+/gi,
			function (e) {
				var t = (e = e.replace(/^;/gi, "") + ";").split(
					":"
				)[0];
				if (t) {
					t = (t = u.trim(t)).toLowerCase();
					var i,
						n = "";
					for (i = 0; i < t.length; i++) {
						var o = t.charAt(i);
						if ("-" === o) {
							i++;
							o = t.charAt(i).toUpperCase();
						}
						n += o;
					}
					d.set(l.domNode, n, "");
				}
				r += e + ";";
			}
		);
		this.iframe.setAttribute("title", e);
		return [
			"<!DOCTYPE html>",
			"<html lang='" +
				(this.lang || c.locale.replace(/-.*/, "")) +
				"'" +
				(this.isLeftToRight() ? "" : " dir='rtl'") +
				">\n",
			"<head>\n",
			"<meta http-equiv='Content-Type' content='text/html'>\n",
			e ? "<title>" + _.escape(e) + "</title>" : "",
			"<style>\n",
			"\tbody,html {\n",
			"\t\tbackground:transparent;\n",
			"\t\tpadding: 1px 0 0 0;\n",
			"\t\tmargin: -1px 0 0 0;\n",
			"\t}\n",
			"\tbody,html,#dijitEditorBody { outline: none; }",
			"html { height: 100%; width: 100%; overflow: hidden; }\n",
			this.height
				? "\tbody,#dijitEditorBody { height: 100%; width: 100%; overflow: auto; }\n"
				: "\tbody,#dijitEditorBody { min-height: " +
					this.minHeight +
					"; width: 100%; overflow-x: auto; overflow-y: hidden; }\n",
			"\tbody{\n",
			"\t\ttop:0px;\n",
			"\t\tleft:0px;\n",
			"\t\tright:0px;\n",
			"\t\tfont:",
			a,
			";\n",
			this.height || f("opera")
				? ""
				: "\t\tposition: fixed;\n",
			"\t\tline-height:",
			s,
			";\n",
			"\t}\n",
			"\tp{ margin: 1em 0; }\n",
			"\tli > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; }\n",
			f("ie") || f("trident") || f("edge")
				? ""
				: "\tli{ min-height:1.2em; }\n",
			"</style>\n",
			this._applyEditingAreaStyleSheets(),
			"\n",
			"</head>\n<body role='application'",
			e ? " aria-label='" + _.escape(e) + "'" : "",
			"onload='try{frameElement && frameElement._loadFunc(window,document)}catch(e){document.domain=\"" +
				document.domain +
				"\";frameElement._loadFunc(window,document)}' ",
			"style='" + r + "'>",
			n,
			"</body>\n</html>",
		].join("");
	},
	_applyEditingAreaStyleSheets: function () {
		var e = [];
		if (this.styleSheets) {
			e = this.styleSheets.split(";");
			this.styleSheets = "";
		}
		e = e.concat(this.editingAreaStyleSheets);
		this.editingAreaStyleSheets = [];
		for (
			var t, i = "", n = 0, o = w.get(this.ownerDocument);
			(t = e[n++]);

		) {
			var a = new y(o.location, t).toString();
			this.editingAreaStyleSheets.push(a);
			i +=
				'<link rel="stylesheet" type="text/css" href="' +
				a +
				'"/>';
		}
		return i;
	},
	addStyleSheet: function (t) {
		var i = t.toString(),
			n = w.get(this.ownerDocument);
		("." === i.charAt(0) ||
			("/" !== i.charAt(0) && !t.host)) &&
			(i = new y(n.location, i).toString());
		if (!(e.indexOf(this.editingAreaStyleSheets, i) > -1)) {
			this.editingAreaStyleSheets.push(i);
			this.onLoadDeferred.then(
				u.hitch(this, function () {
					if (this.document.createStyleSheet)
						this.document.createStyleSheet(i);
					else {
						var e =
								this.document.getElementsByTagName(
									"head"
								)[0],
							t =
								this.document.createElement(
									"link"
								);
						t.rel = "stylesheet";
						t.type = "text/css";
						t.href = i;
						e.appendChild(t);
					}
				})
			);
		}
	},
	removeStyleSheet: function (t) {
		var i = t.toString(),
			n = w.get(this.ownerDocument);
		("." === i.charAt(0) ||
			("/" !== i.charAt(0) && !t.host)) &&
			(i = new y(n.location, i).toString());
		var o = e.indexOf(this.editingAreaStyleSheets, i);
		if (-1 !== o) {
			delete this.editingAreaStyleSheets[o];
			m(
				'link[href="' + i + '"]',
				this.window.document
			).orphan();
		}
	},
	disabled: false,
	_mozSettingProps: { styleWithCSS: false },
	_setDisabledAttr: function (e) {
		e = !!e;
		this._set("disabled", e);
		if (this.isLoaded) {
			var t =
				f("ie") && (this.isLoaded || !this.focusOnLoad);
			t && (this.editNode.unselectable = "on");
			this.editNode.contentEditable = !e;
			this.editNode.tabIndex = e ? "-1" : this.tabIndex;
			t &&
				this.defer(function () {
					this.editNode &&
						(this.editNode.unselectable = "off");
				});
			if (f("mozilla") && !e && this._mozSettingProps) {
				var i,
					n = this._mozSettingProps;
				for (i in n)
					if (n.hasOwnProperty(i))
						try {
							this.document.execCommand(
								i,
								false,
								n[i]
							);
						} catch (o) {}
			}
			this._disabledOK = true;
		}
	},
	onLoad: function (t) {
		if (!this.window.__registeredWindow) {
			this.window.__registeredWindow = true;
			this._iframeRegHandle = j.registerIframe(
				this.iframe
			);
		}
		this.editNode = this.document.body.firstChild;
		var i = this;
		this.beforeIframeNode = r.place(
			"<div tabIndex=-1></div>",
			this.iframe,
			"before"
		);
		this.afterIframeNode = r.place(
			"<div tabIndex=-1></div>",
			this.iframe,
			"after"
		);
		this.iframe.onfocus = this.document.onfocus =
			function () {
				i.editNode.focus();
			};
		this.focusNode = this.editNode;
		var n = this.events.concat(this.captureEvents),
			o = this.iframe ? this.document : this.editNode;
		this.own.apply(
			this,
			e.map(
				n,
				function (e) {
					var t = e.toLowerCase().replace(/^on/, "");
					return p(o, t, u.hitch(this, e));
				},
				this
			)
		);
		this.own(p(o, "mouseup", u.hitch(this, "onClick")));
		if (f("ie")) {
			this.own(
				p(
					this.document,
					"mousedown",
					u.hitch(this, "_onIEMouseDown")
				)
			);
			this.editNode.style.zoom = 1;
		}
		if (f("webkit")) {
			this._webkitListener = this.own(
				p(
					this.document,
					"mouseup",
					u.hitch(this, "onDisplayChanged")
				)
			)[0];
			this.own(
				p(
					this.document,
					"mousedown",
					u.hitch(this, function (e) {
						var t = e.target;
						!t ||
							(t !== this.document.body &&
								t !== this.document) ||
							this.defer("placeCursorAtEnd");
					})
				)
			);
		}
		if (f("ie"))
			try {
				this.document.execCommand(
					"RespectVisibilityInDesign",
					true,
					null
				);
			} catch (s) {}
		this.isLoaded = true;
		this.set("disabled", this.disabled);
		var a = u.hitch(this, function () {
			this.setValue(t);
			this.onLoadDeferred &&
				!this.onLoadDeferred.isFulfilled() &&
				this.onLoadDeferred.resolve(true);
			this.onDisplayChanged();
			this.focusOnLoad &&
				g(
					u.hitch(
						this,
						"defer",
						"focus",
						this.updateInterval
					)
				);
			this.value = this.getValue(true);
		});
		this.setValueDeferred
			? this.setValueDeferred.then(a)
			: a();
	},
	onKeyDown: function (t) {
		if (
			t.keyCode === h.SHIFT ||
			t.keyCode === h.ALT ||
			t.keyCode === h.META ||
			t.keyCode === h.CTRL
		)
			return true;
		if (t.keyCode === h.TAB && this.isTabIndent) {
			t.stopPropagation();
			t.preventDefault();
			this.queryCommandEnabled(
				t.shiftKey ? "outdent" : "indent"
			) &&
				this.execCommand(
					t.shiftKey ? "outdent" : "indent"
				);
		}
		if (
			t.keyCode == h.TAB &&
			!this.isTabIndent &&
			!t.ctrlKey &&
			!t.altKey
		) {
			t.shiftKey
				? this.beforeIframeNode.focus()
				: this.afterIframeNode.focus();
			return true;
		}
		if (
			f("ie") < 9 &&
			t.keyCode === h.BACKSPACE &&
			"Control" === this.document.selection.type
		) {
			t.stopPropagation();
			t.preventDefault();
			this.execCommand("delete");
		}
		f("ff") &&
			((t.keyCode !== h.PAGE_UP &&
				t.keyCode !== h.PAGE_DOWN) ||
				(this.editNode.clientHeight >=
					this.editNode.scrollHeight &&
					t.preventDefault()));
		var i = this._keyHandlers[t.keyCode],
			n = arguments;
		i &&
			!t.altKey &&
			e.some(
				i,
				function (e) {
					if (
						!(
							e.shift ^ t.shiftKey ||
							e.ctrl ^ (t.ctrlKey || t.metaKey)
						)
					) {
						e.handler.apply(this, n) ||
							t.preventDefault();
						return true;
					}
				},
				this
			);
		this.defer("onKeyPressed", 1);
		return true;
	},
	onKeyUp: function () {},
	setDisabled: function (e) {
		c.deprecated(
			"dijit.Editor::setDisabled is deprecated",
			'use dijit.Editor::attr("disabled",boolean) instead',
			2
		);
		this.set("disabled", e);
	},
	_setValueAttr: function (e) {
		this.setValue(e);
	},
	_setDisableSpellCheckAttr: function (e) {
		this.document
			? a.set(this.document.body, "spellcheck", !e)
			: this.onLoadDeferred.then(
					u.hitch(this, function () {
						a.set(
							this.document.body,
							"spellcheck",
							!e
						);
					})
				);
		this._set("disableSpellCheck", e);
	},
	addKeyHandler: function (e, t, i, n) {
		"string" == typeof e &&
			(e = e.toUpperCase().charCodeAt(0));
		u.isArray(this._keyHandlers[e]) ||
			(this._keyHandlers[e] = []);
		this._keyHandlers[e].push({
			shift: i || false,
			ctrl: t || false,
			handler: n,
		});
	},
	onKeyPressed: function () {
		this.onDisplayChanged();
	},
	onClick: function (e) {
		this.onDisplayChanged(e);
	},
	_onIEMouseDown: function () {
		this.focused || this.disabled || this.focus();
	},
	_onBlur: function (e) {
		(f("ie") || f("trident")) &&
			this.defer(function () {
				j.curNode || this.ownerDocumentBody.focus();
			});
		this.inherited(arguments);
		var t = this.getValue(true);
		t !== this.value && this.onChange(t);
		this._set("value", t);
	},
	_onFocus: function (e) {
		if (!this.disabled) {
			this._disabledOK || this.set("disabled", false);
			this.inherited(arguments);
		}
	},
	blur: function () {
		!f("ie") &&
		this.window.document.documentElement &&
		this.window.document.documentElement.focus
			? this.window.document.documentElement.focus()
			: this.ownerDocumentBody.focus &&
				this.ownerDocumentBody.focus();
	},
	focus: function () {
		this.isLoaded
			? f("ie") < 9
				? this.iframe.fireEvent(
						"onfocus",
						document.createEventObject()
					)
				: this.editNode.focus()
			: (this.focusOnLoad = true);
	},
	updateInterval: 200,
	_updateTimer: null,
	onDisplayChanged: function () {
		this._updateTimer && this._updateTimer.remove();
		this._updateTimer = this.defer(
			"onNormalizedDisplayChanged",
			this.updateInterval
		);
	},
	onNormalizedDisplayChanged: function () {
		delete this._updateTimer;
	},
	onChange: function () {},
	_normalizeCommand: function (e, t) {
		var i = e.toLowerCase();
		"formatblock" === i
			? f("safari") && undefined === t && (i = "heading")
			: "hilitecolor" !== i ||
				f("mozilla") ||
				(i = "backcolor");
		return i;
	},
	_implCommand: function (e) {
		return "_" + this._normalizeCommand(e) + "EnabledImpl";
	},
	_qcaCache: {},
	queryCommandAvailable: function (e) {
		var t = this._qcaCache[e];
		return undefined !== t
			? t
			: (this._qcaCache[e] =
					this._queryCommandAvailable(e));
	},
	_queryCommandAvailable: function (e) {
		switch (e.toLowerCase()) {
			case "bold":
			case "italic":
			case "underline":
			case "subscript":
			case "superscript":
			case "fontname":
			case "fontsize":
			case "forecolor":
			case "hilitecolor":
			case "justifycenter":
			case "justifyfull":
			case "justifyleft":
			case "justifyright":
			case "delete":
			case "selectall":
			case "toggledir":
			case "createlink":
			case "unlink":
			case "removeformat":
			case "inserthorizontalrule":
			case "insertimage":
			case "insertorderedlist":
			case "insertunorderedlist":
			case "indent":
			case "outdent":
			case "formatblock":
			case "inserthtml":
			case "undo":
			case "redo":
			case "strikethrough":
			case "tabindent":
			case "cut":
			case "copy":
			case "paste":
				return true;
			case "blockdirltr":
			case "blockdirrtl":
			case "dirltr":
			case "dirrtl":
			case "inlinedirltr":
			case "inlinedirrtl":
				return f("ie") || f("trident") || f("edge");
			case "inserttable":
			case "insertcell":
			case "insertcol":
			case "insertrow":
			case "deletecells":
			case "deletecols":
			case "deleterows":
			case "mergecells":
			case "splitcell":
				return !f("webkit");
			default:
				return false;
		}
	},
	execCommand: function (e, t) {
		var i;
		this.focused && this.focus();
		e = this._normalizeCommand(e, t);
		if (undefined !== t) {
			if ("heading" === e)
				throw new Error("unimplemented");
			"formatblock" === e &&
				(f("ie") || f("trident")) &&
				(t = "<" + t + ">");
		}
		var n = "_" + e + "Impl";
		this[n]
			? (i = this[n](t))
			: ((t = arguments.length > 1 ? t : null) ||
					"createlink" !== e) &&
				(i = this.document.execCommand(e, false, t));
		this.onDisplayChanged();
		return i;
	},
	queryCommandEnabled: function (e) {
		if (this.disabled || !this._disabledOK) return false;
		e = this._normalizeCommand(e);
		var t = this._implCommand(e);
		return this[t]
			? this[t](e)
			: this._browserQueryCommandEnabled(e);
	},
	queryCommandState: function (e) {
		if (this.disabled || !this._disabledOK) return false;
		e = this._normalizeCommand(e);
		try {
			return this.document.queryCommandState(e);
		} catch (t) {
			return false;
		}
	},
	queryCommandValue: function (e) {
		if (this.disabled || !this._disabledOK) return false;
		var t;
		e = this._normalizeCommand(e);
		if (f("ie") && "formatblock" === e)
			t =
				this._native2LocalFormatNames[
					this.document.queryCommandValue(e)
				];
		else if (f("mozilla") && "hilitecolor" === e) {
			var i;
			try {
				i =
					this.document.queryCommandValue(
						"styleWithCSS"
					);
			} catch (n) {
				i = false;
			}
			this.document.execCommand("styleWithCSS", false, true);
			t = this.document.queryCommandValue(e);
			this.document.execCommand("styleWithCSS", false, i);
		} else t = this.document.queryCommandValue(e);
		return t;
	},
	_sCall: function (e, t) {
		return this.selection[e].apply(this.selection, t);
	},
	placeCursorAtStart: function () {
		this.focus();
		var e = false;
		if (f("mozilla"))
			for (var t = this.editNode.firstChild; t; ) {
				if (3 === t.nodeType) {
					if (
						t.nodeValue.replace(/^\s+|\s+$/g, "")
							.length > 0
					) {
						e = true;
						this.selection.selectElement(t);
						break;
					}
				} else if (1 === t.nodeType) {
					e = true;
					var i = t.tagName
						? t.tagName.toLowerCase()
						: "";
					/br|input|img|base|meta|area|basefont|hr|link/.test(
						i
					)
						? this.selection.selectElement(t)
						: this.selection.selectElementChildren(
								t
							);
					break;
				}
				t = t.nextSibling;
			}
		else {
			e = true;
			this.selection.selectElementChildren(this.editNode);
		}
		e && this.selection.collapse(true);
	},
	placeCursorAtEnd: function () {
		this.focus();
		var e = false;
		if (f("mozilla"))
			for (var t = this.editNode.lastChild; t; ) {
				if (3 === t.nodeType) {
					if (
						t.nodeValue.replace(/^\s+|\s+$/g, "")
							.length > 0
					) {
						e = true;
						this.selection.selectElement(t);
						break;
					}
				} else if (1 === t.nodeType) {
					e = true;
					this.selection.selectElement(
						t.lastChild || t
					);
					break;
				}
				t = t.previousSibling;
			}
		else {
			e = true;
			this.selection.selectElementChildren(this.editNode);
		}
		e && this.selection.collapse(false);
	},
	getValue: function (e) {
		return !this.textarea ||
			(!this.isClosed && this.isLoaded)
			? this.isLoaded
				? this._postFilterContent(null, e)
				: this.value
			: this.textarea.value;
	},
	_getValueAttr: function () {
		return this.getValue(true);
	},
	setValue: function (e) {
		if (this.isLoaded) {
			if (
				!this.textarea ||
				(!this.isClosed && this.isLoaded)
			) {
				e = this._preFilterContent(e);
				var t = this.isClosed
					? this.domNode
					: this.editNode;
				t.innerHTML = e;
				this._preDomFilterContent(t);
			} else this.textarea.value = e;
			this.onDisplayChanged();
			this._set("value", this.getValue(true));
		} else
			this.onLoadDeferred.then(
				u.hitch(this, function () {
					this.setValue(e);
				})
			);
	},
	replaceValue: function (e) {
		if (this.isClosed) this.setValue(e);
		else if (
			this.window &&
			this.window.getSelection &&
			!f("mozilla")
		)
			this.setValue(e);
		else if (this.window && this.window.getSelection) {
			e = this._preFilterContent(e);
			this.execCommand("selectall");
			this.execCommand("inserthtml", e);
			this._preDomFilterContent(this.editNode);
		} else
			this.document &&
				this.document.selection &&
				this.setValue(e);
		this._set("value", this.getValue(true));
	},
	_preFilterContent: function (t) {
		var i = t;
		e.forEach(this.contentPreFilters, function (e) {
			e && (i = e(i));
		});
		return i;
	},
	_preDomFilterContent: function (t) {
		t = t || this.editNode;
		e.forEach(
			this.contentDomPreFilters,
			function (e) {
				e && u.isFunction(e) && e(t);
			},
			this
		);
	},
	_postFilterContent: function (t, i) {
		var n;
		if (u.isString(t)) n = t;
		else {
			t = t || this.editNode;
			if (this.contentDomPostFilters.length) {
				i && (t = u.clone(t));
				e.forEach(
					this.contentDomPostFilters,
					function (e) {
						t = e(t);
					}
				);
			}
			n = A.getChildrenHtml(t);
		}
		u.trim(
			n
				.replace(/^\xA0\xA0*/, "")
				.replace(/\xA0\xA0*$/, "")
		).length || (n = "");
		e.forEach(this.contentPostFilters, function (e) {
			n = e(n);
		});
		return n;
	},
	_saveContent: function () {
		var e = o.byId(
			S._scopeName + "._editor.RichText.value"
		);
		if (e) {
			e.value && (e.value += this._SEPARATOR);
			e.value +=
				this.name +
				this._NAME_CONTENT_SEP +
				this.getValue(true);
		}
	},
	escapeXml: function (e, t) {
		e = e
			.replace(/&/gm, "&amp;")
			.replace(/</gm, "&lt;")
			.replace(/>/gm, "&gt;")
			.replace(/"/gm, "&quot;");
		t || (e = e.replace(/'/gm, "&#39;"));
		return e;
	},
	getNodeHtml: function (e) {
		c.deprecated(
			"dijit.Editor::getNodeHtml is deprecated",
			"use dijit/_editor/html::getNodeHtml instead",
			2
		);
		return A.getNodeHtml(e);
	},
	getNodeChildrenHtml: function (e) {
		c.deprecated(
			"dijit.Editor::getNodeChildrenHtml is deprecated",
			"use dijit/_editor/html::getChildrenHtml instead",
			2
		);
		return A.getChildrenHtml(e);
	},
	close: function (e) {
		if (!this.isClosed) {
			arguments.length || (e = true);
			e && this._set("value", this.getValue(true));
			this.interval && clearInterval(this.interval);
			if (this._webkitListener) {
				this._webkitListener.remove();
				delete this._webkitListener;
			}
			f("ie") && (this.iframe.onfocus = null);
			this.iframe._loadFunc = null;
			if (this._iframeRegHandle) {
				this._iframeRegHandle.remove();
				delete this._iframeRegHandle;
			}
			if (this.textarea) {
				var t = this.textarea.style;
				t.position = "";
				t.left = t.top = "";
				if (f("ie")) {
					t.overflow = this.__overflow;
					this.__overflow = null;
				}
				this.textarea.value = this.value;
				r.destroy(this.domNode);
				this.domNode = this.textarea;
			} else this.domNode.innerHTML = this.value;
			delete this.iframe;
			s.remove(this.domNode, this.baseClass);
			this.isClosed = true;
			this.isLoaded = false;
			delete this.editNode;
			delete this.focusNode;
			this.window &&
				this.window._frameElement &&
				(this.window._frameElement = null);
			this.window = null;
			this.document = null;
			this.editingArea = null;
			this.editorObject = null;
		}
	},
	destroy: function () {
		this.isClosed || this.close(false);
		this._updateTimer && this._updateTimer.remove();
		this.inherited(arguments);
		RichText._globalSaveHandler &&
			delete RichText._globalSaveHandler[this.id];
	},
	_removeMozBogus: function (e) {
		return e
			.replace(/\stype="_moz"/gi, "")
			.replace(/\s_moz_dirty=""/gi, "")
			.replace(/_moz_resizing="(true|false)"/gi, "");
	},
	_removeWebkitBogus: function (e) {
		return (e = (e = (e = e.replace(
			/\sclass="webkit-block-placeholder"/gi,
			""
		)).replace(/\sclass="apple-style-span"/gi, "")).replace(
			/<meta charset=\"utf-8\" \/>/gi,
			""
		));
	},
	_normalizeFontStyle: function (e) {
		return e
			.replace(/<(\/)?strong([ \>])/gi, "<$1b$2")
			.replace(/<(\/)?em([ \>])/gi, "<$1i$2");
	},
	_preFixUrlAttributes: function (e) {
		return e
			.replace(
				/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,
				"$1$4$2$3$5$2 _djrealurl=$2$3$5$2"
			)
			.replace(
				/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,
				"$1$4$2$3$5$2 _djrealurl=$2$3$5$2"
			);
	},
	_browserQueryCommandEnabled: function (e) {
		if (!e) return false;
		var t =
			f("ie") < 9
				? this.document.selection.createRange()
				: this.document;
		try {
			return t.queryCommandEnabled(e);
		} catch (i) {
			return false;
		}
	},
	_createlinkEnabledImpl: function () {
		var e = true;
		if (f("opera")) {
			e =
				!!this.window.getSelection().isCollapsed ||
				this.document.queryCommandEnabled("createlink");
		} else
			e = this._browserQueryCommandEnabled("createlink");
		return e;
	},
	_unlinkEnabledImpl: function () {
		return f("mozilla") || f("webkit")
			? this.selection.hasAncestorElement("a")
			: this._browserQueryCommandEnabled("unlink");
	},
	_inserttableEnabledImpl: function () {
		return (
			!(!f("mozilla") && !f("webkit")) ||
			this._browserQueryCommandEnabled("inserttable")
		);
	},
	_cutEnabledImpl: function () {
		var e = true;
		if (f("webkit")) {
			var t = this.window.getSelection();
			t && (t = t.toString());
			e = !!t;
		} else e = this._browserQueryCommandEnabled("cut");
		return e;
	},
	_copyEnabledImpl: function () {
		var e = true;
		if (f("webkit")) {
			var t = this.window.getSelection();
			t && (t = t.toString());
			e = !!t;
		} else e = this._browserQueryCommandEnabled("copy");
		return e;
	},
	_pasteEnabledImpl: function () {
		return (
			!!f("webkit") ||
			this._browserQueryCommandEnabled("paste")
		);
	},
	_inserthorizontalruleImpl: function (e) {
		return f("ie")
			? this._inserthtmlImpl("<hr>")
			: this.document.execCommand(
					"inserthorizontalrule",
					false,
					e
				);
	},
	_unlinkImpl: function (e) {
		if (
			this.queryCommandEnabled("unlink") &&
			(f("mozilla") || f("webkit"))
		) {
			var t = this.selection.getAncestorElement("a");
			this.selection.selectElement(t);
			return this.document.execCommand(
				"unlink",
				false,
				null
			);
		}
		return this.document.execCommand("unlink", false, e);
	},
	_hilitecolorImpl: function (e) {
		var t;
		if (
			!this._handleTextColorOrProperties("hilitecolor", e)
		)
			if (f("mozilla")) {
				this.document.execCommand(
					"styleWithCSS",
					false,
					true
				);
				t = this.document.execCommand(
					"hilitecolor",
					false,
					e
				);
				this.document.execCommand(
					"styleWithCSS",
					false,
					false
				);
			} else
				t = this.document.execCommand(
					"hilitecolor",
					false,
					e
				);
		return t;
	},
	_backcolorImpl: function (e) {
		f("ie") && (e = e || null);
		var t = this._handleTextColorOrProperties(
			"backcolor",
			e
		);
		t ||
			(t = this.document.execCommand("backcolor", false, e));
		return t;
	},
	_forecolorImpl: function (e) {
		f("ie") && (e = e || null);
		var t = false;
		(t = this._handleTextColorOrProperties(
			"forecolor",
			e
		)) ||
			(t = this.document.execCommand("forecolor", false, e));
		return t;
	},
	_inserthtmlImpl: function (e) {
		e = this._preFilterContent(e);
		var t = true;
		if (f("ie") < 9) {
			var i = this.document.selection.createRange();
			if (
				"CONTROL" ===
				this.document.selection.type.toUpperCase()
			) {
				for (var n = i.item(0); i.length; )
					i.remove(i.item(0));
				n.outerHTML = e;
			} else i.pasteHTML(e);
			i.select();
		} else if (f("trident") < 8) {
			var o = T.getSelection(this.window);
			if (o && o.rangeCount && o.getRangeAt) {
				(i = o.getRangeAt(0)).deleteContents();
				var a,
					s,
					l = r.create("div");
				l.innerHTML = e;
				for (
					n = this.document.createDocumentFragment();
					(a = l.firstChild);

				)
					s = n.appendChild(a);
				i.insertNode(n);
				if (s) {
					(i = i.cloneRange()).setStartAfter(s);
					i.collapse(false);
					o.removeAllRanges();
					o.addRange(i);
				}
			}
		} else
			f("mozilla") && !e.length
				? this.selection.remove()
				: (t = this.document.execCommand(
						"inserthtml",
						false,
						e
					));
		return t;
	},
	_boldImpl: function (e) {
		var t = false;
		if (f("ie") || f("trident")) {
			this._adaptIESelection();
			t = this._adaptIEFormatAreaAndExec("bold");
		}
		t || (t = this.document.execCommand("bold", false, e));
		return t;
	},
	_italicImpl: function (e) {
		var t = false;
		if (f("ie") || f("trident")) {
			this._adaptIESelection();
			t = this._adaptIEFormatAreaAndExec("italic");
		}
		t || (t = this.document.execCommand("italic", false, e));
		return t;
	},
	_underlineImpl: function (e) {
		var t = false;
		if (f("ie") || f("trident")) {
			this._adaptIESelection();
			t = this._adaptIEFormatAreaAndExec("underline");
		}
		t ||
			(t = this.document.execCommand("underline", false, e));
		return t;
	},
	_strikethroughImpl: function (e) {
		var t = false;
		if (f("ie") || f("trident")) {
			this._adaptIESelection();
			t = this._adaptIEFormatAreaAndExec("strikethrough");
		}
		t ||
			(t = this.document.execCommand(
				"strikethrough",
				false,
				e
			));
		return t;
	},
	_superscriptImpl: function (e) {
		var t = false;
		if (f("ie") || f("trident")) {
			this._adaptIESelection();
			t = this._adaptIEFormatAreaAndExec("superscript");
		}
		t ||
			(t = this.document.execCommand(
				"superscript",
				false,
				e
			));
		return t;
	},
	_subscriptImpl: function (e) {
		var t = false;
		if (f("ie") || f("trident")) {
			this._adaptIESelection();
			t = this._adaptIEFormatAreaAndExec("subscript");
		}
		t ||
			(t = this.document.execCommand("subscript", false, e));
		return t;
	},
	_fontnameImpl: function (e) {
		var t;
		(f("ie") || f("trident")) &&
			(t = this._handleTextColorOrProperties(
				"fontname",
				e
			));
		t || (t = this.document.execCommand("fontname", false, e));
		return t;
	},
	_fontsizeImpl: function (e) {
		var t;
		(f("ie") || f("trident")) &&
			(t = this._handleTextColorOrProperties(
				"fontsize",
				e
			));
		t || (t = this.document.execCommand("fontsize", false, e));
		return t;
	},
	_insertorderedlistImpl: function (e) {
		var t = false;
		(f("ie") || f("trident") || f("edge")) &&
			(t = this._adaptIEList("insertorderedlist", e));
		t ||
			(t = this.document.execCommand(
				"insertorderedlist",
				false,
				e
			));
		return t;
	},
	_insertunorderedlistImpl: function (e) {
		var t = false;
		(f("ie") || f("trident") || f("edge")) &&
			(t = this._adaptIEList("insertunorderedlist", e));
		t ||
			(t = this.document.execCommand(
				"insertunorderedlist",
				false,
				e
			));
		return t;
	},
	getHeaderHeight: function () {
		return this._getNodeChildrenHeight(this.header);
	},
	getFooterHeight: function () {
		return this._getNodeChildrenHeight(this.footer);
	},
	_getNodeChildrenHeight: function (e) {
		var t = 0;
		if (e && e.childNodes) {
			var i;
			for (i = 0; i < e.childNodes.length; i++) {
				t += l.position(e.childNodes[i]).h;
			}
		}
		return t;
	},
	_isNodeEmpty: function (e, t) {
		return 1 === e.nodeType
			? !(e.childNodes.length > 0) ||
					this._isNodeEmpty(e.childNodes[0], t)
			: 3 === e.nodeType &&
					"" === e.nodeValue.substring(t);
	},
	_removeStartingRangeFromRange: function (e, t) {
		if (e.nextSibling) t.setStart(e.nextSibling, 0);
		else {
			for (
				var i = e.parentNode;
				i && null == i.nextSibling;

			)
				i = i.parentNode;
			i && t.setStart(i.nextSibling, 0);
		}
		return t;
	},
	_adaptIESelection: function () {
		var e = T.getSelection(this.window);
		if (e && e.rangeCount && !e.isCollapsed) {
			for (
				var t = e.getRangeAt(0),
					i = t.startContainer,
					n = t.startOffset;
				3 === i.nodeType &&
				n >= i.length &&
				i.nextSibling;

			) {
				n -= i.length;
				i = i.nextSibling;
			}
			for (
				var o = null;
				this._isNodeEmpty(i, n) && i !== o;

			) {
				o = i;
				i = (t = this._removeStartingRangeFromRange(
					i,
					t
				)).startContainer;
				n = 0;
			}
			e.removeAllRanges();
			e.addRange(t);
		}
	},
	_adaptIEFormatAreaAndExec: function (t) {
		var i,
			n,
			o,
			a,
			s,
			l,
			d,
			c,
			h = T.getSelection(this.window),
			u = this.document;
		if (!(t && h && h.isCollapsed)) return false;
		if (this.queryCommandValue(t)) {
			var p,
				m = this._tagNamesForCommand(t),
				g = (o = h.getRangeAt(0)).startContainer;
			if (3 === g.nodeType) {
				var f = o.endOffset;
				if (g.length < f) {
					g = (n = this._adjustNodeAndOffset(i, f))
						.node;
					f = n.offset;
				}
			}
			for (; g && g !== this.editNode; ) {
				var _ = g.tagName
					? g.tagName.toLowerCase()
					: "";
				if (e.indexOf(m, _) > -1) {
					p = g;
					break;
				}
				g = g.parentNode;
			}
			if (p) {
				i = o.startContainer;
				var v = u.createElement(p.tagName);
				r.place(v, p, "after");
				if (i && 3 === i.nodeType) {
					var b,
						y,
						w = o.endOffset;
					if (i.length < w) {
						i = (n = this._adjustNodeAndOffset(
							i,
							w
						)).node;
						w = n.offset;
					}
					a = i.nodeValue;
					s = u.createTextNode(a.substring(0, w));
					(N = a.substring(w, a.length)) &&
						(l = u.createTextNode(N));
					r.place(s, i, "before");
					if (l) {
						(d =
							u.createElement("span")).className =
							"ieFormatBreakerSpan";
						r.place(d, i, "after");
						r.place(l, d, "after");
						l = d;
					}
					r.destroy(i);
					for (
						var C, k = s.parentNode, x = [];
						k !== p;

					) {
						var A = k.tagName;
						C = { tagName: A };
						x.push(C);
						var j = u.createElement(A);
						if (
							k.style &&
							j.style &&
							k.style.cssText
						) {
							j.style.cssText = k.style.cssText;
							C.cssText = k.style.cssText;
						}
						if ("FONT" === k.tagName) {
							if (k.color) {
								j.color = k.color;
								C.color = k.color;
							}
							if (k.face) {
								j.face = k.face;
								C.face = k.face;
							}
							if (k.size) {
								j.size = k.size;
								C.size = k.size;
							}
						}
						if (k.className) {
							j.className = k.className;
							C.className = k.className;
						}
						if (l) {
							b = l;
							for (; b; ) {
								y = b.nextSibling;
								j.appendChild(b);
								b = y;
							}
						}
						if (j.tagName == k.tagName) {
							(d =
								u.createElement(
									"span"
								)).className =
								"ieFormatBreakerSpan";
							r.place(d, k, "after");
							r.place(j, d, "after");
						} else r.place(j, k, "after");
						s = k;
						l = j;
						k = k.parentNode;
					}
					if (l) {
						(1 === (b = l).nodeType ||
							(3 === b.nodeType &&
								b.nodeValue)) &&
							(v.innerHTML = "");
						for (; b; ) {
							y = b.nextSibling;
							v.appendChild(b);
							b = y;
						}
					}
					if (x.length) {
						C = x.pop();
						var S = u.createElement(C.tagName);
						C.cssText &&
							S.style &&
							(S.style.cssText = C.cssText);
						C.className &&
							(S.className = C.className);
						if ("FONT" === C.tagName) {
							C.color && (S.color = C.color);
							C.face && (S.face = C.face);
							C.size && (S.size = C.size);
						}
						r.place(S, v, "before");
						for (; x.length; ) {
							C = x.pop();
							var E = u.createElement(C.tagName);
							C.cssText &&
								E.style &&
								(E.style.cssText = C.cssText);
							C.className &&
								(E.className = C.className);
							if ("FONT" === C.tagName) {
								C.color && (E.color = C.color);
								C.face && (E.face = C.face);
								C.size && (E.size = C.size);
							}
							S.appendChild(E);
							S = E;
						}
						c = u.createTextNode(".");
						d.appendChild(c);
						S.appendChild(c);
						(M = T.create(this.window)).setStart(
							c,
							0
						);
						M.setEnd(c, c.length);
						h.removeAllRanges();
						h.addRange(M);
						this.selection.collapse(false);
						c.parentNode.innerHTML = "";
					} else {
						(d =
							u.createElement("span")).className =
							"ieFormatBreakerSpan";
						c = u.createTextNode(".");
						d.appendChild(c);
						r.place(d, v, "before");
						(M = T.create(this.window)).setStart(
							c,
							0
						);
						M.setEnd(c, c.length);
						h.removeAllRanges();
						h.addRange(M);
						this.selection.collapse(false);
						c.parentNode.innerHTML = "";
					}
					v.firstChild || r.destroy(v);
					return true;
				}
			}
			return false;
		}
		if (
			(i = (o = h.getRangeAt(0)).startContainer) &&
			3 === i.nodeType
		) {
			var N, M;
			f = o.startOffset;
			if (i.length < f) {
				i = (n = this._adjustNodeAndOffset(i, f)).node;
				f = n.offset;
			}
			a = i.nodeValue;
			s = u.createTextNode(a.substring(0, f));
			"" !== (N = a.substring(f)) &&
				(l = u.createTextNode(a.substring(f)));
			d = u.createElement("span");
			c = u.createTextNode(".");
			d.appendChild(c);
			s.length ? r.place(s, i, "after") : (s = i);
			r.place(d, s, "after");
			l && r.place(l, d, "after");
			r.destroy(i);
			(M = T.create(this.window)).setStart(c, 0);
			M.setEnd(c, c.length);
			h.removeAllRanges();
			h.addRange(M);
			u.execCommand(t);
			r.place(d.firstChild, d, "before");
			r.destroy(d);
			M.setStart(c, 0);
			M.setEnd(c, c.length);
			h.removeAllRanges();
			h.addRange(M);
			this.selection.collapse(false);
			c.parentNode.innerHTML = "";
			return true;
		}
	},
	_adaptIEList: function (e) {
		var t = T.getSelection(this.window);
		if (
			t.isCollapsed &&
			t.rangeCount &&
			!this.queryCommandValue(e)
		) {
			var i = t.getRangeAt(0),
				n = i.startContainer;
			if (n && 3 == n.nodeType && !i.startOffset) {
				var o = "ul";
				"insertorderedlist" === e && (o = "ol");
				var a = this.document.createElement(o),
					s = r.create("li", null, a);
				r.place(a, n, "before");
				s.appendChild(n);
				r.create("br", null, a, "after");
				var l = T.create(this.window);
				l.setStart(n, 0);
				l.setEnd(n, n.length);
				t.removeAllRanges();
				t.addRange(l);
				this.selection.collapse(true);
				return true;
			}
		}
		return false;
	},
	_handleTextColorOrProperties: function (e, t) {
		var i,
			n,
			o,
			a,
			s,
			l,
			c,
			h,
			u = T.getSelection(this.window),
			p = this.document;
		t = t || null;
		if (
			e &&
			u &&
			u.isCollapsed &&
			u.rangeCount &&
			(i = (o = u.getRangeAt(0)).startContainer) &&
			3 === i.nodeType
		) {
			var m = o.startOffset;
			if (i.length < m) {
				i = (n = this._adjustNodeAndOffset(i, m)).node;
				m = n.offset;
			}
			a = i.nodeValue;
			s = p.createTextNode(a.substring(0, m));
			"" !== a.substring(m) &&
				(l = p.createTextNode(a.substring(m)));
			c = p.createElement("span");
			h = p.createTextNode(".");
			c.appendChild(h);
			var g = p.createElement("span");
			c.appendChild(g);
			s.length ? r.place(s, i, "after") : (s = i);
			r.place(c, s, "after");
			l && r.place(l, c, "after");
			r.destroy(i);
			var _ = T.create(this.window);
			_.setStart(h, 0);
			_.setEnd(h, h.length);
			u.removeAllRanges();
			u.addRange(_);
			if (f("webkit")) {
				var v = "color";
				("hilitecolor" !== e && "backcolor" !== e) ||
					(v = "backgroundColor");
				d.set(c, v, t);
				this.selection.remove();
				r.destroy(g);
				c.innerHTML = "&#160;";
				this.selection.selectElement(c);
				this.focus();
			} else {
				this.execCommand(e, t);
				r.place(c.firstChild, c, "before");
				r.destroy(c);
				_.setStart(h, 0);
				_.setEnd(h, h.length);
				u.removeAllRanges();
				u.addRange(_);
				this.selection.collapse(false);
				h.parentNode.removeChild(h);
			}
			return true;
		}
		return false;
	},
	_adjustNodeAndOffset: function (e, t) {
		for (
			;
			e.length < t &&
			e.nextSibling &&
			3 === e.nextSibling.nodeType;

		) {
			t -= e.length;
			e = e.nextSibling;
		}
		return { node: e, offset: t };
	},
	_tagNamesForCommand: function (e) {
		return "bold" === e
			? ["b", "strong"]
			: "italic" === e
			? ["i", "em"]
			: "strikethrough" === e
			? ["s", "strike"]
			: "superscript" === e
			? ["sup"]
			: "subscript" === e
			? ["sub"]
			: "underline" === e
			? ["u"]
			: [];
	},
	_stripBreakerNodes: function (e) {
		if (this.isLoaded) {
			m(".ieFormatBreakerSpan", e).forEach(function (e) {
				for (; e.firstChild; )
					r.place(e.firstChild, e, "before");
				r.destroy(e);
			});
			return e;
		}
	},
	_stripTrailingEmptyNodes: function (e) {
		function t(e) {
			return (
				(/^(p|div|br)$/i.test(e.nodeName) &&
					0 == e.children.length &&
					/^[\s\xA0]*$/.test(
						e.textContent || e.innerText || ""
					)) ||
				(3 === e.nodeType &&
					/^[\s\xA0]*$/.test(e.nodeValue))
			);
		}
		for (; e.lastChild && t(e.lastChild); )
			r.destroy(e.lastChild);
		return e;
	},
	_setTextDirAttr: function (e) {
		this._set("textDir", e);
		this.onLoadDeferred.then(
			u.hitch(this, function () {
				this.editNode.dir = e;
			})
		);
	},
});

declare global {
	namespace DojoJS
	{

		interface Dijit_editor {
			RichText: typeof RichText;
		}

		interface Dijit {
			_editor: Dijit_editor;
		}
	}
}

export = RichText;