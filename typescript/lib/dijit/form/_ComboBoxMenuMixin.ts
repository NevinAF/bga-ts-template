
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-attr");
import n = require("dojo/has");
import o = require("dojo/i18n");
// import "dojo/i18n!./nls/ComboBox";

var _ComboBoxMenuMixin = t(
	"dijit.form._ComboBoxMenuMixin" +
		(n("dojo-bidi") ? "_NoBidi" : ""),
	null,
	{
		_messages: null,
		postMixInProperties: function () {
			this.inherited(arguments);
			this._messages = o.getLocalization(
				"dijit.form",
				"ComboBox",
				this.lang
			);
		},
		buildRendering: function () {
			this.inherited(arguments);
			this.previousButton.innerHTML =
				this._messages.previousMessage;
			this.nextButton.innerHTML =
				this._messages.nextMessage;
		},
		_setValueAttr: function (e) {
			this._set("value", e);
			this.onChange(e);
		},
		onClick: function (e) {
			if (e == this.previousButton) {
				this._setSelectedAttr(null);
				this.onPage(-1);
			} else if (e == this.nextButton) {
				this._setSelectedAttr(null);
				this.onPage(1);
			} else this.onChange(e);
		},
		onChange: function () {},
		onPage: function () {},
		onClose: function () {
			this._setSelectedAttr(null);
		},
		_createOption: function (e, t) {
			var i = this._createMenuItem(),
				n = t(e);
			n.html
				? (i.innerHTML = n.label)
				: i.appendChild(
						i.ownerDocument.createTextNode(n.label)
					);
			"" == i.innerHTML && (i.innerHTML = "&#160;");
			return i;
		},
		createOptions: function (t, n, o) {
			this.items = t;
			this.previousButton.style.display =
				0 == n.start ? "none" : "";
			i.set(this.previousButton, "id", this.id + "_prev");
			e.forEach(
				t,
				function (e, t) {
					var n = this._createOption(e, o);
					n.setAttribute("item", t);
					i.set(n, "id", this.id + t);
					this.nextButton.parentNode.insertBefore(
						n,
						this.nextButton
					);
				},
				this
			);
			var a = false;
			t.total && !t.total.then && -1 != t.total
				? (n.start + n.count < t.total ||
						(n.start + n.count > t.total &&
							n.count == t.length)) &&
					(a = true)
				: n.count == t.length && (a = true);
			this.nextButton.style.display = a ? "" : "none";
			i.set(this.nextButton, "id", this.id + "_next");
		},
		clearResultList: function () {
			for (
				var e = this.containerNode;
				e.childNodes.length > 2;

			)
				e.removeChild(
					e.childNodes[e.childNodes.length - 2]
				);
			this._setSelectedAttr(null);
		},
		highlightFirstOption: function () {
			this.selectFirstNode();
		},
		highlightLastOption: function () {
			this.selectLastNode();
		},
		selectFirstNode: function () {
			this.inherited(arguments);
			this.getHighlightedOption() ==
				this.previousButton && this.selectNextNode();
		},
		selectLastNode: function () {
			this.inherited(arguments);
			this.getHighlightedOption() == this.nextButton &&
				this.selectPreviousNode();
		},
		getHighlightedOption: function () {
			return this.selected;
		},
	} as DijitJS.form._ComboBoxMenuMixin
);
n("dojo-bidi") &&
	(_ComboBoxMenuMixin = t("dijit.form._ComboBoxMenuMixin", _ComboBoxMenuMixin, {
		_createOption: function () {
			var e = this.inherited(arguments);
			this.applyTextDir(e);
			return e;
		},
	}));



declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_ComboBoxMenuMixin: typeof _ComboBoxMenuMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _ComboBoxMenuMixin;