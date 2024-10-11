
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/_base/lang");
import i = require("dojo/when");
import n = require("./MappedTextBox");
import o = require("./ComboBoxMixin");

var FilteringSelect = e("dijit.form.FilteringSelect", [n, o], {
	required: true,
	_lastDisplayedValue: "",
	_isValidSubset: function () {
		return this._opened;
	},
	isValid: function () {
		return (
			!!this.item ||
			(!this.required && "" == this.get("displayedValue"))
		);
	},
	_refreshState: function () {
		this.searchTimer || this.inherited(arguments);
	},
	_callbackSetLabel: function (e, t, i, n) {
		(t && t[this.searchAttr] !== this._lastQuery) ||
			(!t &&
				e.length &&
				this.store.getIdentity(e[0]) !=
					this._lastQuery) ||
			(e.length
				? this.set("item", e[0], n)
				: this.set(
						"value",
						"",
						n || (undefined === n && !this.focused),
						this.textbox.value,
						null
					));
	},
	_openResultList: function (e, t, i) {
		if (t[this.searchAttr] === this._lastQuery) {
			this.inherited(arguments);
			undefined === this.item && this.validate(true);
		}
	},
	_getValueAttr: function () {
		return this.valueNode.value;
	},
	_getValueField: function () {
		return "value";
	},
	_setValueAttr: function (e, n, o, a) {
		this._onChangeActive || (n = null);
		if (undefined === a) {
			if (null === e || "" === e) {
				e = "";
				if (!t.isString(o)) {
					this._setDisplayedValueAttr(o || "", n);
					return;
				}
			}
			var s = this;
			this._lastQuery = e;
			i(this.store.get(e), function (e) {
				s._callbackSetLabel(
					e ? [e] : [],
					undefined,
					undefined,
					n
				);
			});
		} else {
			this.valueNode.value = e;
			this.inherited(arguments, [e, n, o, a]);
		}
	},
	_setItemAttr: function (e, t, i) {
		this.inherited(arguments);
		this._lastDisplayedValue = this.textbox.value;
	},
	_getDisplayQueryString: function (e) {
		return e.replace(/([\\\*\?])/g, "\\$1");
	},
	_setDisplayedValueAttr: function (e, n) {
		null == e && (e = "");
		if (!this._created) {
			if (!("displayedValue" in this.params)) return;
			n = false;
		}
		if (this.store) {
			this.closeDropDown();
			var o,
				a = t.clone(this.query),
				s = this._getDisplayQueryString(e);
			this.store._oldAPI
				? (o = s)
				: ((o = this._patternToRegExp(s)).toString =
						function () {
							return s;
						});
			this._lastQuery = a[this.searchAttr] = o;
			this.textbox.value = e;
			this._lastDisplayedValue = e;
			this._set("displayedValue", e);
			var r = this,
				l = {
					queryOptions: {
						ignoreCase: this.ignoreCase,
						deep: true,
					},
				};
			t.mixin(l, this.fetchProperties);
			this._fetchHandle = this.store.query(a, l);
			i(
				this._fetchHandle,
				function (e) {
					r._fetchHandle = null;
					r._callbackSetLabel(e || [], a, l, n);
				},
				function (e) {
					r._fetchHandle = null;
					r._cancelingQuery ||
						console.error(
							"dijit.form.FilteringSelect: " +
								e.toString()
						);
				}
			);
		}
	},
	undo: function () {
		this.set("displayedValue", this._lastDisplayedValue);
	},
}) as DijitJS.form.FilteringSelectConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			FilteringSelect: typeof FilteringSelect;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = FilteringSelect;