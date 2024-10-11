
// @ts-nocheck

import e = require("dojo/_base/array");
import declare = require("dojo/_base/declare");
import dojo = require("dojo/_base/kernel");
import n = require("dojo/_base/lang");
import o = require("dojo/on");
import a = require("dojo/window");

var _FormMixin = declare("dijit.form._FormMixin", null, {
	state: "",
	_getDescendantFormWidgets: function (t) {
		var i = [];
		e.forEach(
			t || this.getChildren(),
			function (e) {
				"value" in e
					? i.push(e)
					: (i = i.concat(
							this._getDescendantFormWidgets(
								e.getChildren()
							)
						));
			},
			this
		);
		return i;
	},
	reset: function () {
		e.forEach(
			this._getDescendantFormWidgets(),
			function (e) {
				e.reset && e.reset();
			}
		);
	},
	validate: function () {
		var t = false;
		return e.every(
			e.map(
				this._getDescendantFormWidgets(),
				function (e) {
					e._hasBeenBlurred = true;
					var i =
						e.disabled ||
						!e.validate ||
						e.validate();
					if (!i && !t) {
						a.scrollIntoView(
							e.containerNode || e.domNode
						);
						e.focus();
						t = true;
					}
					return i;
				}
			),
			function (e) {
				return e;
			}
		);
	},
	setValues: function (e) {
		dojo.deprecated(
			this.declaredClass +
				"::setValues() is deprecated. Use set('value', val) instead.",
			"",
			"2.0"
		);
		return this.set("value", e);
	},
	_setValueAttr: function (t) {
		var i = {};
		e.forEach(
			this._getDescendantFormWidgets(),
			function (e) {
				if (e.name) {
					(i[e.name] || (i[e.name] = [])).push(e);
				}
			}
		);
		for (var o in i)
			if (i.hasOwnProperty(o)) {
				var a = i[o],
					s = n.getObject(o, false, t);
				if (undefined !== s) {
					s = [].concat(s);
					"boolean" == typeof a[0].checked
						? e.forEach(a, function (t) {
								t.set(
									"value",
									-1 !=
										e.indexOf(
											s,
											t._get("value")
										)
								);
							})
						: a[0].multiple
						? a[0].set("value", s)
						: e.forEach(a, function (e, t) {
								e.set("value", s[t]);
							});
				}
			}
	},
	getValues: function () {
		dojo.deprecated(
			this.declaredClass +
				"::getValues() is deprecated. Use get('value') instead.",
			"",
			"2.0"
		);
		return this.get("value");
	},
	_getValueAttr: function () {
		var t = {};
		e.forEach(
			this._getDescendantFormWidgets(),
			function (e) {
				var i = e.name;
				if (i && !e.disabled) {
					var o = e.get("value");
					if ("boolean" == typeof e.checked)
						if (/Radio/.test(e.declaredClass))
							false !== o
								? n.setObject(i, o, t)
								: undefined ===
										(o = n.getObject(
											i,
											false,
											t
										)) &&
									n.setObject(i, null, t);
						else {
							var a = n.getObject(i, false, t);
							if (!a) {
								a = [];
								n.setObject(i, a, t);
							}
							false !== o && a.push(o);
						}
					else {
						var s = n.getObject(i, false, t);
						undefined !== s
							? n.isArray(s)
								? s.push(o)
								: n.setObject(i, [s, o], t)
							: n.setObject(i, o, t);
					}
				}
			}
		);
		return t;
	},
	isValid: function () {
		return "" == this.state;
	},
	onValidStateChange: function () {},
	_getState: function () {
		var t = e.map(this._descendants, function (e) {
			return e.get("state") || "";
		});
		return e.indexOf(t, "Error") >= 0
			? "Error"
			: e.indexOf(t, "Incomplete") >= 0
			? "Incomplete"
			: "";
	},
	disconnectChildren: function () {},
	connectChildren: function (t) {
		this._descendants = this._getDescendantFormWidgets();
		e.forEach(this._descendants, function (e) {
			e._started || e.startup();
		});
		t || this._onChildChange();
	},
	_onChildChange: function (e) {
		(e && "state" != e && "disabled" != e) ||
			this._set("state", this._getState());
		if (
			!e ||
			"value" == e ||
			"disabled" == e ||
			"checked" == e
		) {
			this._onChangeDelayTimer &&
				this._onChangeDelayTimer.remove();
			this._onChangeDelayTimer = this.defer(function () {
				delete this._onChangeDelayTimer;
				this._set("value", this.get("value"));
			}, 10);
		}
	},
	startup: function () {
		this.inherited(arguments);
		this._descendants = this._getDescendantFormWidgets();
		this.value = this.get("value");
		this.state = this._getState();
		var e = this;
		this.own(
			o(
				this.containerNode,
				"attrmodified-state, attrmodified-disabled, attrmodified-value, attrmodified-checked",
				function (t) {
					t.target != e.domNode &&
						e._onChildChange(
							t.type.replace("attrmodified-", "")
						);
				}
			)
		);
		this.watch("state", function (e, t, i) {
			this.onValidStateChange("" == i);
		});
	},
	destroy: function () {
		this.inherited(arguments);
	},
} as DijitJS.form._FormMixin);

declare global {
	namespace DojoJS {
		interface Dijit {
			_FormMixin: typeof _FormMixin;
		}
	}
}

export = _FormMixin;