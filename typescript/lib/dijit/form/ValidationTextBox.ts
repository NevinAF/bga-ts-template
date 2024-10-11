
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/_base/kernel");
import i = require("dojo/_base/lang");
import n = require("dojo/i18n");
import o = require("./TextBox");
import a = require("../Tooltip");
import s = require("dojo/text"); // import s = require("dojo/text!./templates/ValidationTextBox.html");
import "dojo/i18n" // import "dojo/i18n!./nls/validate"; TODO

var ValidationTextBox = e("dijit.form.ValidationTextBox", o, {
	templateString: s,
	required: false,
	promptMessage: "",
	invalidMessage: "$_unset_$",
	missingMessage: "$_unset_$",
	message: "",
	constraints: {},
	pattern: ".*",
	regExp: "",
	regExpGen: function () {},
	state: "",
	tooltipPosition: [],
	_deprecateRegExp: function (e, i) {
		if (i != ValidationTextBox.prototype[e]) {
			t.deprecated(
				"ValidationTextBox id=" +
					this.id +
					", set('" +
					e +
					"', ...) is deprecated.  Use set('pattern', ...) instead.",
				"",
				"2.0"
			);
			this.set("pattern", i);
		}
	},
	_setRegExpGenAttr: function (e) {
		this._deprecateRegExp("regExpGen", e);
		this._set("regExpGen", this._computeRegexp);
	},
	_setRegExpAttr: function (e) {
		this._deprecateRegExp("regExp", e);
	},
	_setValueAttr: function () {
		this.inherited(arguments);
		this._refreshState();
	},
	validator: function (e, t) {
		return (
			new RegExp(
				"^(?:" +
					this._computeRegexp(t) +
					")" +
					(this.required ? "" : "?") +
					"$"
			).test(e) &&
			(!this.required || !this._isEmpty(e)) &&
			(this._isEmpty(e) || undefined !== this.parse(e, t))
		);
	},
	_isValidSubset: function () {
		return 0 == this.textbox.value.search(this._partialre);
	},
	isValid: function () {
		return this.validator(
			this.textbox.value,
			this.get("constraints")
		);
	},
	_isEmpty: function (e) {
		return (this.trim ? /^\s*$/ : /^$/).test(e);
	},
	getErrorMessage: function () {
		var e =
				"$_unset_$" == this.invalidMessage
					? this.messages.invalidMessage
					: this.invalidMessage
					? this.invalidMessage
					: this.promptMessage,
			t =
				"$_unset_$" == this.missingMessage
					? this.messages.missingMessage
					: this.missingMessage
					? this.missingMessage
					: e;
		return this.required &&
			this._isEmpty(this.textbox.value)
			? t
			: e;
	},
	getPromptMessage: function () {
		return this.promptMessage;
	},
	_maskValidSubsetError: true,
	validate: function (e) {
		var t = "",
			i = this.disabled || this.isValid(e);
		i && (this._maskValidSubsetError = true);
		var n = this._isEmpty(this.textbox.value),
			o = !i && e && this._isValidSubset();
		this._set(
			"state",
			i
				? ""
				: (((!this._hasBeenBlurred || e) && n) || o) &&
					(this._maskValidSubsetError ||
						(o && !this._hasBeenBlurred && e))
				? "Incomplete"
				: "Error"
		);
		this.focusNode.setAttribute(
			"aria-invalid",
			"Error" == this.state ? "true" : "false"
		);
		if ("Error" == this.state) {
			this._maskValidSubsetError = e && o;
			t = this.getErrorMessage(e);
		} else if ("Incomplete" == this.state) {
			t = this.getPromptMessage(e);
			this._maskValidSubsetError =
				!this._hasBeenBlurred || e;
		} else n && (t = this.getPromptMessage(e));
		this.set("message", t);
		return i;
	},
	displayMessage: function (e) {
		e && this.focused
			? a.show(
					e,
					this.domNode,
					this.tooltipPosition,
					!this.isLeftToRight()
				)
			: a.hide(this.domNode);
	},
	_refreshState: function () {
		this._created && this.validate(this.focused);
		this.inherited(arguments);
	},
	constructor: function (e) {
		this.constraints = i.clone(this.constraints);
		this.baseClass += " dijitValidationTextBox";
	},
	startup: function () {
		this.inherited(arguments);
		this._refreshState();
	},
	_setConstraintsAttr: function (e) {
		!e.locale && this.lang && (e.locale = this.lang);
		this._set("constraints", e);
		this._refreshState();
	},
	_setPatternAttr: function (e) {
		this._set("pattern", e);
		this._refreshState();
	},
	_computeRegexp: function (e) {
		var t = this.pattern;
		"function" == typeof t && (t = t.call(this, e));
		if (t != this._lastRegExp) {
			var i = "";
			this._lastRegExp = t;
			".*" != t &&
				t.replace(
					/\\.|\[\]|\[.*?[^\\]{1}\]|\{.*?\}|\(\?[=:!]|./g,
					function (e) {
						switch (e.charAt(0)) {
							case "{":
							case "+":
							case "?":
							case "*":
							case "^":
							case "$":
							case "|":
							case "(":
								i += e;
								break;
							case ")":
								i += "|$)";
								break;
							default:
								i += "(?:" + e + "|$)";
						}
					}
				);
			try {
				"".search(i);
			} catch (n) {
				i = this.pattern;
				this.declaredClass, this.pattern;
			}
			this._partialre = "^(?:" + i + ")$";
		}
		return t;
	},
	postMixInProperties: function () {
		this.inherited(arguments);
		this.messages = n.getLocalization(
			"dijit.form",
			"validate",
			this.lang
		);
		this._setConstraintsAttr(this.constraints);
	},
	_setDisabledAttr: function (e) {
		this.inherited(arguments);
		this._refreshState();
	},
	_setRequiredAttr: function (e) {
		this._set("required", e);
		this.focusNode.setAttribute("aria-required", e);
		this._refreshState();
	},
	_setMessageAttr: function (e) {
		this._set("message", e);
		this.displayMessage(e);
	},
	reset: function () {
		this._maskValidSubsetError = true;
		this.inherited(arguments);
	},
	_onBlur: function () {
		this.displayMessage("");
		this.inherited(arguments);
	},
	destroy: function () {
		a.hide(this.domNode);
		this.inherited(arguments);
	},
}) as DijitJS.form.ValidationTextBoxConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			ValidationTextBox: typeof ValidationTextBox;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = ValidationTextBox;