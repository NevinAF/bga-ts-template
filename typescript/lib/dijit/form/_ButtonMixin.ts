
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom");
import i = require("dojo/has");
import n = require("../registry");

var _ButtonMixin = e(
	"dijit.form._ButtonMixin" +
		(i("dojo-bidi") ? "_NoBidi" : ""),
	null,
	{
		label: "",
		type: "button",
		__onClick: function (e) {
			e.stopPropagation();
			e.preventDefault();
			this.disabled || this.valueNode.click(e);
			return false;
		},
		_onClick: function (e) {
			if (this.disabled) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
			false === this.onClick(e) && e.preventDefault();
			var t = e.defaultPrevented;
			if (
				!t &&
				"submit" == this.type &&
				!(this.valueNode || this.focusNode).form
			)
				for (
					var i = this.domNode;
					i.parentNode;
					i = i.parentNode
				) {
					var o = n.byNode(i);
					if (o && "function" == typeof o._onSubmit) {
						o._onSubmit(e);
						e.preventDefault();
						t = true;
						break;
					}
				}
			return !t;
		},
		postCreate: function () {
			this.inherited(arguments);
			t.setSelectable(this.focusNode, false);
		},
		onClick: function () {
			return true;
		},
		_setLabelAttr: function (e) {
			this._set("label", e);
			(this.containerNode || this.focusNode).innerHTML =
				e;
			this.onLabelSet();
		},
		onLabelSet: function () {},
	} as DijitJS.form._ButtonMixin);
i("dojo-bidi") &&
	(_ButtonMixin = e("dijit.form._ButtonMixin", _ButtonMixin, {
		onLabelSet: function () {
			this.inherited(arguments);
			var e = this.containerNode || this.focusNode;
			this.applyTextDir(e);
		},
	}));

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_ButtonMixin: typeof _ButtonMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _ButtonMixin;