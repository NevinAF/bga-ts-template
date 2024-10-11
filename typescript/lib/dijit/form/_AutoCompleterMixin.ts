
// @ts-nocheck

import e = require("dojo/aspect");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-attr");
import n = require("dojo/keys");
import o = require("dojo/_base/lang");
import a = require("dojo/query");
import s = require("dojo/regexp");
import r = require("dojo/sniff");
import l = require("./DataList");
import d = require("./_TextBoxMixin");
import c = require("./_SearchMixin");

var _AutoCompleterMixin = t("dijit.form._AutoCompleterMixin", c, {
	item: null,
	autoComplete: true,
	highlightMatch: "first",
	labelAttr: "",
	labelType: "text",
	maxHeight: -1,
	_stopClickEvents: false,
	_getCaretPos: function (e) {
		var t = 0;
		if ("number" == typeof e.selectionStart)
			t = e.selectionStart;
		else if (r("ie")) {
			var i = e.ownerDocument.selection
					.createRange()
					.duplicate(),
				n = e.createTextRange();
			i.move("character", 0);
			n.move("character", 0);
			try {
				n.setEndPoint("EndToEnd", i);
				t = String(n.text).replace(/\r/g, "").length;
			} catch (o) {}
		}
		return t;
	},
	_setCaretPos: function (e, t) {
		t = parseInt(t);
		d.selectInputText(e, t, t);
	},
	_setDisabledAttr: function (e) {
		this.inherited(arguments);
		this.domNode.setAttribute(
			"aria-disabled",
			e ? "true" : "false"
		);
	},
	_onKey: function (e) {
		if (!(e.charCode >= 32)) {
			var t = e.charCode || e.keyCode;
			if (
				t != n.ALT &&
				t != n.CTRL &&
				t != n.META &&
				t != n.SHIFT
			) {
				var i = this.dropDown,
					o = null;
				this._abortQuery();
				this.inherited(arguments);
				if (!(e.altKey || e.ctrlKey || e.metaKey)) {
					this._opened &&
						(o = i.getHighlightedOption());
					switch (t) {
						case n.PAGE_DOWN:
						case n.DOWN_ARROW:
						case n.PAGE_UP:
						case n.UP_ARROW:
							this._opened &&
								this._announceOption(o);
							e.stopPropagation();
							e.preventDefault();
							break;
						case n.ENTER:
							if (o) {
								if (o == i.nextButton) {
									this._nextSearch(1);
									e.stopPropagation();
									e.preventDefault();
									break;
								}
								if (o == i.previousButton) {
									this._nextSearch(-1);
									e.stopPropagation();
									e.preventDefault();
									break;
								}
								e.stopPropagation();
								e.preventDefault();
							} else {
								this._setBlurValue();
								this._setCaretPos(
									this.focusNode,
									this.focusNode.value.length
								);
							}
						case n.TAB:
							var a = this.get("displayedValue");
							if (
								i &&
								(a ==
									i._messages
										.previousMessage ||
									a ==
										i._messages.nextMessage)
							)
								break;
							o && this._selectOption(o);
						case n.ESCAPE:
							if (this._opened) {
								this._lastQuery = null;
								this.closeDropDown();
							}
					}
				}
			}
		}
	},
	_autoCompleteText: function (e) {
		var t = this.focusNode;
		d.selectInputText(t, t.value.length);
		var i = this.ignoreCase ? "toLowerCase" : "substr";
		if (0 == e[i](0).indexOf(this.focusNode.value[i](0))) {
			var n = this.autoComplete
				? this._getCaretPos(t)
				: t.value.length;
			if (n + 1 > t.value.length) {
				t.value = e;
				d.selectInputText(t, n);
			}
		} else {
			t.value = e;
			d.selectInputText(t);
		}
	},
	_openResultList: function (e, t, i) {
		var n = this.dropDown.getHighlightedOption();
		this.dropDown.clearResultList();
		if (e.length || 0 != i.start) {
			this._nextSearch = this.dropDown.onPage = o.hitch(
				this,
				function (t) {
					e.nextPage(-1 !== t);
					this.focus();
				}
			);
			this.dropDown.createOptions(
				e,
				i,
				o.hitch(this, "_getMenuLabelFromItem")
			);
			this._showResultList();
			if ("direction" in i) {
				i.direction
					? this.dropDown.highlightFirstOption()
					: i.direction ||
						this.dropDown.highlightLastOption();
				n &&
					this._announceOption(
						this.dropDown.getHighlightedOption()
					);
			} else
				!this.autoComplete ||
					this._prev_key_backspace ||
					/^[*]+$/.test(
						t[this.searchAttr].toString()
					) ||
					this._announceOption(
						this.dropDown.containerNode.firstChild
							.nextSibling
					);
		} else this.closeDropDown();
	},
	_showResultList: function () {
		this.closeDropDown(true);
		this.openDropDown();
		this.domNode.setAttribute("aria-expanded", "true");
	},
	loadDropDown: function () {
		this._startSearchAll();
	},
	isLoaded: function () {
		return false;
	},
	closeDropDown: function () {
		this._abortQuery();
		if (this._opened) {
			this.inherited(arguments);
			this.domNode.setAttribute("aria-expanded", "false");
		}
	},
	_setBlurValue: function () {
		var e = this.get("displayedValue"),
			t = this.dropDown;
		if (
			!t ||
			(e != t._messages.previousMessage &&
				e != t._messages.nextMessage)
		)
			if (undefined === this.item) {
				this.item = null;
				this.set("displayedValue", e);
			} else {
				this.value != this._lastValueReported &&
					this._handleOnChange(this.value, true);
				this._refreshState();
			}
		else this._setValueAttr(this._lastValueReported, true);
		this.focusNode.removeAttribute("aria-activedescendant");
	},
	_setItemAttr: function (e, t, i) {
		var n = "";
		if (e) {
			i ||
				(i = this.store._oldAPI
					? this.store.getValue(e, this.searchAttr)
					: e[this.searchAttr]);
			n =
				this._getValueField() != this.searchAttr
					? this.store.getIdentity(e)
					: i;
		}
		this.set("value", n, t, i, e);
	},
	_announceOption: function (e) {
		if (e) {
			var t;
			if (
				e == this.dropDown.nextButton ||
				e == this.dropDown.previousButton
			) {
				t = e.innerHTML;
				this.item = undefined;
				this.value = "";
			} else {
				var n =
					this.dropDown.items[e.getAttribute("item")];
				t = (
					this.store._oldAPI
						? this.store.getValue(
								n,
								this.searchAttr
							)
						: n[this.searchAttr]
				).toString();
				this.set("item", n, false, t);
			}
			this.focusNode.value =
				this.focusNode.value.substring(
					0,
					this._lastInput.length
				);
			this.focusNode.setAttribute(
				"aria-activedescendant",
				i.get(e, "id")
			);
			this._autoCompleteText(t);
		}
	},
	_selectOption: function (e) {
		this.closeDropDown();
		e && this._announceOption(e);
		this._setCaretPos(
			this.focusNode,
			this.focusNode.value.length
		);
		this._handleOnChange(this.value, true);
		this.focusNode.removeAttribute("aria-activedescendant");
	},
	_startSearchAll: function () {
		this._startSearch("");
	},
	_startSearchFromInput: function () {
		this.item = undefined;
		this.inherited(arguments);
	},
	_startSearch: function (e) {
		if (!this.dropDown) {
			var t = this.id + "_popup",
				i = o.isString(this.dropDownClass)
					? o.getObject(this.dropDownClass, false)
					: this.dropDownClass;
			this.dropDown = new i({
				onChange: o.hitch(this, this._selectOption),
				id: t,
				dir: this.dir,
				textDir: this.textDir,
			});
		}
		this._lastInput = e;
		this.inherited(arguments);
	},
	_getValueField: function () {
		return this.searchAttr;
	},
	postMixInProperties: function () {
		this.inherited(arguments);
		if (!this.store && this.srcNodeRef) {
			var e = this.srcNodeRef;
			this.store = new l({}, e);
			if (!("value" in this.params)) {
				var t = (this.item =
					this.store.fetchSelectedItem());
				if (t) {
					var i = this._getValueField();
					this.value = this.store._oldAPI
						? this.store.getValue(t, i)
						: t[i];
				}
			}
		}
	},
	postCreate: function () {
		var t = a('label[for="' + this.id + '"]');
		if (t.length) {
			t[0].id || (t[0].id = this.id + "_label");
			this.domNode.setAttribute(
				"aria-labelledby",
				t[0].id
			);
		}
		this.inherited(arguments);
		e.after(
			this,
			"onSearch",
			o.hitch(this, "_openResultList"),
			true
		);
	},
	_getMenuLabelFromItem: function (e) {
		var t = this.labelFunc(e, this.store),
			i = this.labelType;
		if (
			"none" != this.highlightMatch &&
			"text" == this.labelType &&
			this._lastInput
		) {
			t = this.doHighlight(t, this._lastInput);
			i = "html";
		}
		return { html: "html" == i, label: t };
	},
	doHighlight: function (e, t) {
		var i =
				(this.ignoreCase ? "i" : "") +
				("all" == this.highlightMatch ? "g" : ""),
			n = this.queryExpr.indexOf("${0}");
		t = s.escapeString(t);
		return this._escapeHtml(
			e.replace(
				new RegExp(
					(0 == n ? "^" : "") +
						"(" +
						t +
						")" +
						(n == this.queryExpr.length - 4
							? "$"
							: ""),
					i
				),
				"￿$1￿"
			)
		).replace(
			/\uFFFF([^\uFFFF]+)\uFFFF/g,
			'<span class="dijitComboBoxHighlightMatch">$1</span>'
		);
	},
	_escapeHtml: function (e) {
		return (e = String(e)
			.replace(/&/gm, "&amp;")
			.replace(/</gm, "&lt;")
			.replace(/>/gm, "&gt;")
			.replace(/"/gm, "&quot;"));
	},
	reset: function () {
		this.item = null;
		this.inherited(arguments);
	},
	labelFunc: function (e, t) {
		return (
			t._oldAPI
				? t.getValue(
						e,
						this.labelAttr || this.searchAttr
					)
				: e[this.labelAttr || this.searchAttr]
		).toString();
	},
	_setValueAttr: function (e, t, i, n) {
		this._set("item", n || null);
		null == e && (e = "");
		this.inherited(arguments);
	},
} as DijitJS.form._AutoCompleterMixin);
r("dojo-bidi") &&
	_AutoCompleterMixin.extend({
		_setTextDirAttr: function (e) {
			this.inherited(arguments);
			this.dropDown && this.dropDown._set("textDir", e);
		},
	});

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_AutoCompleterMixin: typeof _AutoCompleterMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _AutoCompleterMixin;