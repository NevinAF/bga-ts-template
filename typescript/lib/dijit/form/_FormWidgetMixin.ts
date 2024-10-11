
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-attr");
import n = require("dojo/dom-style");
import o = require("dojo/_base/lang");
import a = require("dojo/mouse");
import s = require("dojo/on");
import r = require("dojo/sniff");
import l = require("dojo/window");
import d = require("../a11y");

var _FormWidgetMixin = t("dijit.form._FormWidgetMixin", null, {
	name: "",
	alt: "",
	value: "",
	type: "text",
	"aria-label": "focusNode",
	tabIndex: "0",
	_setTabIndexAttr: "focusNode",
	disabled: false,
	intermediateChanges: false,
	scrollOnFocus: true,
	_setIdAttr: "focusNode",
	_setDisabledAttr: function (t) {
		this._set("disabled", t);
		if (
			/^(button|input|select|textarea|optgroup|option|fieldset)$/i.test(
				this.focusNode.tagName
			)
		) {
			i.set(this.focusNode, "disabled", t);
			r("trident") &&
				"readOnly" in this &&
				i.set(
					this.focusNode,
					"readonly",
					t || this.readOnly
				);
		} else
			this.focusNode.setAttribute(
				"aria-disabled",
				t ? "true" : "false"
			);
		this.valueNode && i.set(this.valueNode, "disabled", t);
		if (t) {
			this._set("hovering", false);
			this._set("active", false);
			var n =
				"tabIndex" in this.attributeMap
					? this.attributeMap.tabIndex
					: "_setTabIndexAttr" in this
					? this._setTabIndexAttr
					: "focusNode";
			e.forEach(
				o.isArray(n) ? n : [n],
				function (e) {
					var t = this[e];
					r("webkit") || d.hasDefaultTabStop(t)
						? t.setAttribute("tabIndex", "-1")
						: t.removeAttribute("tabIndex");
				},
				this
			);
		} else
			"" != this.tabIndex &&
				this.set("tabIndex", this.tabIndex);
	},
	_onFocus: function (e) {
		if ("mouse" == e && this.isFocusable())
			var t = this.own(
					s(this.focusNode, "focus", function () {
						n.remove();
						t.remove();
					})
				)[0],
				i = r("pointer-events")
					? "pointerup"
					: r("MSPointer")
					? "MSPointerUp"
					: r("touch-events")
					? "touchend, mouseup"
					: "mouseup",
				n = this.own(
					s(
						this.ownerDocumentBody,
						i,
						o.hitch(this, function (e) {
							n.remove();
							t.remove();
							this.focused &&
								("touchend" == e.type
									? this.defer("focus")
									: this.focus());
						})
					)
				)[0];
		this.scrollOnFocus &&
			this.defer(function () {
				l.scrollIntoView(this.domNode);
			});
		this.inherited(arguments);
	},
	isFocusable: function () {
		return (
			!this.disabled &&
			this.focusNode &&
			"none" != n.get(this.domNode, "display")
		);
	},
	focus: function () {
		if (!this.disabled && this.focusNode.focus)
			try {
				this.focusNode.focus();
			} catch (e) {}
	},
	compare: function (e, t) {
		return "number" == typeof e && "number" == typeof t
			? isNaN(e) && isNaN(t)
				? 0
				: e - t
			: e > t
			? 1
			: e < t
			? -1
			: 0;
	},
	onChange: function () {},
	_onChangeActive: false,
	_handleOnChange: function (e, t) {
		null != this._lastValueReported ||
			(null !== t && this._onChangeActive) ||
			(this._resetValue = this._lastValueReported = e);
		this._pendingOnChange =
			this._pendingOnChange ||
			typeof e != typeof this._lastValueReported ||
			0 != this.compare(e, this._lastValueReported);
		if (
			(this.intermediateChanges || t || undefined === t) &&
			this._pendingOnChange
		) {
			this._lastValueReported = e;
			this._pendingOnChange = false;
			if (this._onChangeActive) {
				this._onChangeHandle &&
					this._onChangeHandle.remove();
				this._onChangeHandle = this.defer(function () {
					this._onChangeHandle = null;
					this.onChange(e);
				});
			}
		}
	},
	create: function () {
		this.inherited(arguments);
		this._onChangeActive = true;
	},
	destroy: function () {
		if (this._onChangeHandle) {
			this._onChangeHandle.remove();
			this.onChange(this._lastValueReported);
		}
		this.inherited(arguments);
	},
} as DijitJS.form._FormWidgetMixin);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_FormWidgetMixin: typeof _FormWidgetMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _FormWidgetMixin;