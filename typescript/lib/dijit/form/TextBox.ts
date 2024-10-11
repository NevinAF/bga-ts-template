
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom-construct");
import i = require("dojo/dom-style");
import n = require("dojo/_base/kernel");
import o = require("dojo/_base/lang");
import a = require("dojo/on");
import s = require("dojo/sniff");
import r = require("./_FormValueWidget");
import l = require("./_TextBoxMixin");
import d = require("dojo/text"); // import d = require("dojo/text!./templates/TextBox.html"); TODO
import dijit = require("../main");

var TextBox = e(
	"dijit.form.TextBox" + (s("dojo-bidi") ? "_NoBidi" : ""),
	[r, l],
	{
		templateString: d,
		_singleNodeTemplate:
			'<input class="dijit dijitReset dijitLeft dijitInputField" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="${type}" ${!nameAttrSetting} />',
		_buttonInputDisabled: s("ie") ? "disabled" : "",
		baseClass: "dijitTextBox",
		postMixInProperties: function () {
			var e = this.type.toLowerCase();
			((this.templateString &&
				"input" == this.templateString.toLowerCase()) ||
				(("hidden" == e || "file" == e) &&
					this.templateString ==
						this.constructor.prototype
							.templateString)) &&
				(this.templateString =
					this._singleNodeTemplate);
			this.inherited(arguments);
		},
		postCreate: function () {
			this.inherited(arguments);
			s("ie") < 9 &&
				this.defer(function () {
					try {
						var e = i.getComputedStyle(
							this.domNode
						);
						if (e) {
							var t = e.fontFamily;
							if (t) {
								var n =
									this.domNode.getElementsByTagName(
										"INPUT"
									);
								if (n)
									for (
										var o = 0;
										o < n.length;
										o++
									)
										n[o].style.fontFamily =
											t;
							}
						}
					} catch (a) {}
				});
		},
		_setPlaceHolderAttr: function (e) {
			this._set("placeHolder", e);
			if (!this._phspan) {
				this._attachPoints.push("_phspan");
				this._phspan = t.create(
					"span",
					{
						className:
							"dijitPlaceHolder dijitInputField",
					},
					this.textbox,
					"after"
				);
				this.own(
					a(this._phspan, "mousedown", function (e) {
						e.preventDefault();
					}),
					a(
						this._phspan,
						"touchend, pointerup, MSPointerUp",
						o.hitch(this, function () {
							this.focus();
						})
					)
				);
			}
			this._phspan.innerHTML = "";
			this._phspan.appendChild(
				this._phspan.ownerDocument.createTextNode(e)
			);
			this._updatePlaceHolder();
		},
		_onInput: function (e) {
			this.inherited(arguments);
			this._updatePlaceHolder();
		},
		_updatePlaceHolder: function () {
			this._phspan &&
				(this._phspan.style.display =
					this.placeHolder && !this.textbox.value
						? ""
						: "none");
		},
		_setValueAttr: function (e, t, i) {
			this.inherited(arguments);
			this._updatePlaceHolder();
		},
		getDisplayedValue: function () {
			n.deprecated(
				this.declaredClass +
					"::getDisplayedValue() is deprecated. Use get('displayedValue') instead.",
				"",
				"2.0"
			);
			return this.get("displayedValue");
		},
		setDisplayedValue: function (e) {
			n.deprecated(
				this.declaredClass +
					"::setDisplayedValue() is deprecated. Use set('displayedValue', ...) instead.",
				"",
				"2.0"
			);
			this.set("displayedValue", e);
		},
		_onBlur: function (e) {
			if (!this.disabled) {
				this.inherited(arguments);
				this._updatePlaceHolder();
				s("mozilla") &&
					this.selectOnClick &&
					(this.textbox.selectionStart =
						this.textbox.selectionEnd =
							undefined);
			}
		},
		_onFocus: function (e) {
			if (!this.disabled && !this.readOnly) {
				this.inherited(arguments);
				this._updatePlaceHolder();
			}
		},
	}
) as DijitJS.form.TextBoxConstructor;
if (s("ie") < 9) {
	TextBox.prototype._isTextSelected = function () {
		var e = this.ownerDocument.selection.createRange();
		return (
			e.parentElement() == this.textbox &&
			e.text.length > 0
		);
	};
	dijit._setSelectionRange = l._setSelectionRange = function (
		e,
		t,
		i
	) {
		if (e.createTextRange) {
			var n = e.createTextRange();
			n.collapse(true);
			n.moveStart("character", -99999);
			n.moveStart("character", t);
			n.moveEnd("character", i - t);
			n.select();
		}
	};
}
s("dojo-bidi") &&
	(TextBox = e("dijit.form.TextBox", TextBox, {
		_setPlaceHolderAttr: function (e) {
			this.inherited(arguments);
			this.applyTextDir(this._phspan);
		},
	}));

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			TextBox: typeof TextBox;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = TextBox;