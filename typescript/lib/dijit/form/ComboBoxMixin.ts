
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/Deferred");
import i = require("dojo/_base/kernel");
import n = require("dojo/_base/lang");
import o = require("dojo/store/util/QueryResults");
import a = require("./_AutoCompleterMixin");
import s = require("./_ComboBoxMenu");
import r = require("../_HasDropDown");
import l = require("dojo/text"); // import l = require("dojo/text!./templates/DropDownBox.html");

var ComboBoxMixin = e("dijit.form.ComboBoxMixin", [r, a], {
	dropDownClass: s,
	hasDownArrow: true,
	templateString: l,
	baseClass: "dijitTextBox dijitComboBox",
	cssStateNodes: { _buttonNode: "dijitDownArrowButton" },
	_setHasDownArrowAttr: function (e) {
		this._set("hasDownArrow", e);
		this._buttonNode.style.display = e ? "" : "none";
	},
	_showResultList: function () {
		this.displayMessage("");
		this.inherited(arguments);
	},
	_setStoreAttr: function (e) {
		e.get ||
			n.mixin(e, {
				_oldAPI: true,
				get: function (e) {
					var i = new t();
					this.fetchItemByIdentity({
						identity: e,
						onItem: function (e) {
							i.resolve(e);
						},
						onError: function (e) {
							i.reject(e);
						},
					});
					return i.promise;
				},
				query: function (e, i) {
					var a = new t(function () {
						s.abort && s.abort();
					});
					a.total = new t();
					var s = this.fetch(
						n.mixin(
							{
								query: e,
								onBegin: function (e) {
									a.total.resolve(e);
								},
								onComplete: function (e) {
									a.resolve(e);
								},
								onError: function (e) {
									a.reject(e);
								},
							},
							i
						)
					);
					return o(a);
				},
			});
		this._set("store", e);
	},
	postMixInProperties: function () {
		var e = this.params.store || this.store;
		e && this._setStoreAttr(e);
		this.inherited(arguments);
		if (
			!this.params.store &&
			this.store &&
			!this.store._oldAPI
		) {
			var t = this.declaredClass;
			n.mixin(this.store, {
				getValue: function (e, n) {
					i.deprecated(
						t +
							".store.getValue(item, attr) is deprecated for builtin store.  Use item.attr directly",
						"",
						"2.0"
					);
					return e[n];
				},
				getLabel: function (e) {
					i.deprecated(
						t +
							".store.getLabel(item) is deprecated for builtin store.  Use item.label directly",
						"",
						"2.0"
					);
					return e.name;
				},
				fetch: function (e) {
					i.deprecated(
						t +
							".store.fetch() is deprecated for builtin store.",
						"Use store.query()",
						"2.0"
					);
					require(["dojo/data/ObjectStore"], n.hitch(
						this,
						function (t) {
							new t({ objectStore: this }).fetch(
								e
							);
						}
					));
				},
			});
		}
	},
	buildRendering: function () {
		this.inherited(arguments);
		this.focusNode.setAttribute(
			"aria-autocomplete",
			this.autoComplete ? "both" : "list"
		);
	},
}) as DijitJS.form.ComboBoxMixinConstructor<any, any, any>;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			ComboBoxMixin: typeof ComboBoxMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = ComboBoxMixin;