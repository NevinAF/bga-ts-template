// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-construct");
import n = require("dojo/i18n");
import o = require("dojo/_base/lang");
import a = require("dojo/string");
import s = require("dojo/store/Memory");
import r = require("../../registry");
import l = require("../../_Widget");
import d = require("../../_TemplatedMixin");
import c = require("../../_WidgetsInTemplateMixin");
import h = require("../../form/FilteringSelect");
import u = require("../_Plugin");
import p = require("../range");
import m = require("dojo/i18n"); // import m = require("dojo/i18n!../nls/FontChoice");

var _FontDropDown = i("dijit._editor.plugins._FontDropDown", [d, c, h], {
		label: "",
		plainText: false,
		templateString:
			"<span style='white-space: nowrap' class='dijit dijitReset dijitInline'><label class='dijitLeft dijitInline' for='${selectId}'>${label}</label><input data-dojo-type='../../form/FilteringSelect' required='false' data-dojo-props='labelType:\"html\", labelAttr:\"label\", searchAttr:\"name\"' class='${comboClass}' tabIndex='-1' id='${selectId}' data-dojo-attach-point='select' value=''/></span>",
		contextRequire: e,
		postMixInProperties: function () {
			this.inherited(arguments);
			this.strings = o.getLocalization(
				"dijit._editor",
				"FontChoice"
			);
			this.label = this.strings[this.command];
			this.id = l.getUniqueId(
				this.declaredClass.replace(/\./g, "_")
			);
			this.selectId = this.id + "_select";
			this.inherited(arguments);
		},
		postCreate: function () {
			this.select.set(
				"store",
				new r({
					idProperty: "value",
					data: t.map(
						this.values,
						function (e) {
							var t = this.strings[e] || e;
							return {
								label: this.getLabel(e, t),
								name: t,
								value: e,
							};
						},
						this
					),
				})
			);
			this.select.set("value", "", false);
			this.disabled = this.select.get("disabled");
		},
		_setValueAttr: function (e, i) {
			i = false !== i;
			this.select.set(
				"value",
				t.indexOf(this.values, e) < 0 ? "" : e,
				i
			);
			i || (this.select._lastValueReported = null);
		},
		_getValueAttr: function () {
			return this.select.get("value");
		},
		focus: function () {
			this.select.focus();
		},
		_setDisabledAttr: function (e) {
			this._set("disabled", e);
			this.select.set("disabled", e);
		},
	}),
	_FontNameDropDown = i("dijit._editor.plugins._FontNameDropDown", _FontDropDown, {
		generic: false,
		command: "fontName",
		comboClass: "dijitFontNameCombo",
		postMixInProperties: function () {
			this.values ||
				(this.values = this.generic
					? [
							"serif",
							"sans-serif",
							"monospace",
							"cursive",
							"fantasy",
						]
					: [
							"Arial",
							"Times New Roman",
							"Comic Sans MS",
							"Courier New",
						]);
			this.inherited(arguments);
		},
		getLabel: function (e, t) {
			return this.plainText
				? t
				: "<div style='font-family: " +
						e +
						"'>" +
						t +
						"</div>";
		},
		_normalizeFontName: function (e) {
			var i = this.values;
			if (!e || !i) return e;
			var n = e.split(",");
			if (n.length > 1)
				for (var o = 0, a = n.length; o < a; o++) {
					var r = s.trim(n[o]);
					if (t.indexOf(i, r) > -1) return r;
				}
			return e;
		},
		_setValueAttr: function (e, t) {
			t = false !== t;
			e = this._normalizeFontName(e);
			if (this.generic) {
				e =
					{
						Arial: "sans-serif",
						Helvetica: "sans-serif",
						Myriad: "sans-serif",
						Times: "serif",
						"Times New Roman": "serif",
						"Comic Sans MS": "cursive",
						"Apple Chancery": "cursive",
						Courier: "monospace",
						"Courier New": "monospace",
						Papyrus: "fantasy",
						"Estrangelo Edessa": "cursive",
						Gabriola: "fantasy",
					}[e] || e;
			}
			this.inherited(arguments, [e, t]);
		},
	}),
	_FontSizeDropDown = i("dijit._editor.plugins._FontSizeDropDown", _FontDropDown, {
		command: "fontSize",
		comboClass: "dijitFontSizeCombo",
		values: [1, 2, 3, 4, 5, 6, 7],
		getLabel: function (e, t) {
			return this.plainText
				? t
				: "<font size=" + e + "'>" + t + "</font>";
		},
		_setValueAttr: function (e, t) {
			t = false !== t;
			if (e.indexOf && -1 != e.indexOf("px")) {
				e =
					{
						10: 1,
						13: 2,
						16: 3,
						18: 4,
						24: 5,
						32: 6,
						48: 7,
					}[parseInt(e, 10)] || e;
			}
			this.inherited(arguments, [e, t]);
		},
	}),
	_FormatBlockDropDown = i("dijit._editor.plugins._FormatBlockDropDown", _FontDropDown, {
		command: "formatBlock",
		comboClass: "dijitFormatBlockCombo",
		values: ["noFormat", "p", "h1", "h2", "h3", "pre"],
		postCreate: function () {
			this.inherited(arguments);
			this.set("value", "noFormat", false);
		},
		getLabel: function (e, t) {
			return this.plainText || "noFormat" == e
				? t
				: "<" + e + ">" + t + "</" + e + ">";
		},
		_execCommand: function (e, i, n) {
			if ("noFormat" === n) {
				var o,
					s,
					r = m.getSelection(e.window);
				if (r && r.rangeCount > 0) {
					var l,
						d,
						c = r.getRangeAt(0);
					if (c) {
						o = c.startContainer;
						s = c.endContainer;
						for (
							;
							o &&
							o !== e.editNode &&
							o !== e.document.body &&
							1 !== o.nodeType;

						)
							o = o.parentNode;
						for (
							;
							s &&
							s !== e.editNode &&
							s !== e.document.body &&
							1 !== s.nodeType;

						)
							s = s.parentNode;
						var h = a.hitch(this, function (i, n) {
								if (
									i.childNodes &&
									i.childNodes.length
								) {
									var o;
									for (
										o = 0;
										o < i.childNodes.length;
										o++
									) {
										var a = i.childNodes[o];
										if (
											1 == a.nodeType &&
											e.selection.inSelection(
												a
											)
										) {
											var s = a.tagName
												? a.tagName.toLowerCase()
												: "";
											-1 !==
												t.indexOf(
													this.values,
													s
												) && n.push(a);
											h(a, n);
										}
									}
								}
							}),
							u = a.hitch(this, function (t) {
								if (t && t.length) {
									e.beginEditing();
									for (; t.length; )
										this._removeFormat(
											e,
											t.pop()
										);
									e.endEditing();
								}
							}),
							p = [];
						if (o == s) {
							var g;
							l = o;
							for (
								;
								l &&
								l !== e.editNode &&
								l !== e.document.body;

							) {
								if (1 == l.nodeType) {
									d = l.tagName
										? l.tagName.toLowerCase()
										: "";
									if (
										-1 !==
										t.indexOf(
											this.values,
											d
										)
									) {
										g = l;
										break;
									}
								}
								l = l.parentNode;
							}
							h(o, p);
							g && (p = [g].concat(p));
							u(p);
						} else {
							l = o;
							for (
								;
								e.selection.inSelection(l);

							) {
								if (1 == l.nodeType) {
									d = l.tagName
										? l.tagName.toLowerCase()
										: "";
									-1 !==
										t.indexOf(
											this.values,
											d
										) && p.push(l);
									h(l, p);
								}
								l = l.nextSibling;
							}
							u(p);
						}
						e.onDisplayChanged();
					}
				}
			} else e.execCommand(i, n);
		},
		_removeFormat: function (e, t) {
			if (e.customUndo) {
				for (; t.firstChild; )
					n.place(t.firstChild, t, "before");
				t.parentNode.removeChild(t);
			} else {
				e.selection.selectElementChildren(t);
				var i = e.selection.getSelectedHtml();
				e.selection.selectElement(t);
				e.execCommand("inserthtml", i || "");
			}
		},
	}),
	FontChoice = i("dijit._editor.plugins.FontChoice", p, {
		useDefaultCommand: false,
		_initButton: function () {
			var e = {
					fontName: _FontNameDropDown,
					fontSize: _FontSizeDropDown,
					formatBlock: _FormatBlockDropDown,
				}[this.command],
				t = this.params;
			this.params.custom &&
				(t.values = this.params.custom);
			var i = this.editor;
			this.button = new e(
				a.delegate({ dir: i.dir, lang: i.lang }, t)
			);
			this.own(
				this.button.select.on(
					"change",
					a.hitch(this, function (e) {
						this.editor.focused &&
							this.editor.focus();
						"fontName" == this.command &&
							-1 != e.indexOf(" ") &&
							(e = "'" + e + "'");
						this.button._execCommand
							? this.button._execCommand(
									this.editor,
									this.command,
									e
								)
							: this.editor.execCommand(
									this.command,
									e
								);
					})
				)
			);
		},
		updateState: function () {
			var e = this.editor,
				i = this.command;
			if (e && e.isLoaded && i.length && this.button) {
				var n,
					o = this.get("disabled");
				this.button.set("disabled", o);
				if (o) return;
				try {
					n = e.queryCommandValue(i) || "";
				} catch (h) {
					n = "";
				}
				var s =
					a.isString(n) &&
					(n.match(/'([^']*)'/) ||
						n.match(/"([^"]*)"/));
				s && (n = s[1]);
				"fontSize" !== i || n || (n = 3);
				if ("formatBlock" === i)
					if (n && "p" != n)
						t.indexOf(this.button.values, n) < 0 &&
							(n = "noFormat");
					else {
						n = null;
						var r,
							l = m.getSelection(
								this.editor.window
							);
						if (l && l.rangeCount > 0) {
							var d = l.getRangeAt(0);
							d && (r = d.endContainer);
						}
						for (
							;
							r &&
							r !== e.editNode &&
							r !== e.document;

						) {
							var c = r.tagName
								? r.tagName.toLowerCase()
								: "";
							if (
								c &&
								t.indexOf(
									this.button.values,
									c
								) > -1
							) {
								n = c;
								break;
							}
							r = r.parentNode;
						}
						n || (n = "noFormat");
					}
				n !== this.button.get("value") &&
					this.button.set("value", n, false);
			}
		},
	});
t.forEach(
	["fontName", "fontSize", "formatBlock"],
	function (e) {
		p.registry[e] = function (t) {
			return new FontChoice({
				command: e,
				plainText: t.plainText,
			});
		};
	}
);
FontChoice._FontDropDown = _FontDropDown;
FontChoice._FontNameDropDown = _FontNameDropDown;
FontChoice._FontSizeDropDown = _FontSizeDropDown;
FontChoice._FormatBlockDropDown = _FormatBlockDropDown;

declare global {
	namespace DojoJS
	{
		interface Dijit_editorPlugins {
			_FontDropDown: typeof _FontDropDown;
			_FontNameDropDown: typeof _FontNameDropDown;
			_FontSizeDropDown: typeof _FontSizeDropDown;
			_FormatBlockDropDown: typeof _FormatBlockDropDown;
		}

		interface Dijit_editor {
			plugins: Dijit_editorPlugins;
		}

		interface Dijit {
			_editor: Dijit_editor;
		}
	}
}

export = FontChoice;