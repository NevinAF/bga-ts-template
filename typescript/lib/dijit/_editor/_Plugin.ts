// @ts-nocheck

import e = require("dojo/_base/connect");
import t = require("dojo/_base/declare");
import i = require("dojo/_base/lang");
import n = require("../Destroyable");
import o = require("../form/Button");

var a = t("dijit._editor._Plugin", n, {
	constructor: function (e) {
		this.params = e || {};
		i.mixin(this, this.params);
		this._attrPairNames = {};
	},
	editor: null,
	iconClassPrefix: "dijitEditorIcon",
	button: null,
	command: "",
	useDefaultCommand: true,
	buttonClass: o,
	disabled: false,
	getLabel: function (e) {
		return this.editor.commands[e];
	},
	_initButton: function () {
		if (this.command.length) {
			var e = this.getLabel(this.command),
				t = this.editor,
				n =
					this.iconClassPrefix +
					" " +
					this.iconClassPrefix +
					this.command.charAt(0).toUpperCase() +
					this.command.substr(1);
			if (!this.button) {
				var o = i.mixin(
					{
						label: e,
						ownerDocument: t.ownerDocument,
						dir: t.dir,
						lang: t.lang,
						showLabel: false,
						iconClass: n,
						dropDown: this.dropDown,
						tabIndex: "-1",
					},
					this.params || {}
				);
				delete o.name;
				this.button = new this.buttonClass(o);
			}
		}
		this.get("disabled") &&
			this.button &&
			this.button.set("disabled", this.get("disabled"));
	},
	destroy: function () {
		this.dropDown && this.dropDown.destroyRecursive();
		this.inherited(arguments);
	},
	connect: function (t, i, n) {
		this.own(e.connect(t, i, this, n));
	},
	updateState: function () {
		var e,
			t,
			i = this.editor,
			n = this.command;
		if (i && i.isLoaded && n.length) {
			var o = this.get("disabled");
			if (this.button)
				try {
					var a = i._implCommand(n);
					t =
						!o &&
						(this[a]
							? this[a](n)
							: i.queryCommandEnabled(n));
					if (this.enabled !== t) {
						this.enabled = t;
						this.button.set("disabled", !t);
					}
					if (
						t &&
						"boolean" == typeof this.button.checked
					) {
						e = i.queryCommandState(n);
						if (this.checked !== e) {
							this.checked = e;
							this.button.set(
								"checked",
								i.queryCommandState(n)
							);
						}
					}
				} catch (i) {}
		}
	},
	setEditor: function (e) {
		this.editor = e;
		this._initButton();
		this.button &&
			this.useDefaultCommand &&
			(this.editor.queryCommandAvailable(this.command)
				? this.own(
						this.button.on(
							"click",
							i.hitch(
								this.editor,
								"execCommand",
								this.command,
								this.commandArg
							)
						)
					)
				: (this.button.domNode.style.display = "none"));
		this.own(
			this.editor.on(
				"NormalizedDisplayChanged",
				i.hitch(this, "updateState")
			)
		);
	},
	setToolbar: function (e) {
		this.button && e.addChild(this.button);
	},
	set: function (e, t) {
		if ("object" == typeof e) {
			for (var i in e) this.set(i, e[i]);
			return this;
		}
		var n = this._getAttrNames(e);
		if (this[n.s])
			var o = this[n.s].apply(
				this,
				Array.prototype.slice.call(arguments, 1)
			);
		else this._set(e, t);
		return o || this;
	},
	get: function (e) {
		var t = this._getAttrNames(e);
		return this[t.g] ? this[t.g]() : this[e];
	},
	_setDisabledAttr: function (e) {
		this._set("disabled", e);
		this.updateState();
	},
	_getAttrNames: function (e) {
		var t = this._attrPairNames;
		if (t[e]) return t[e];
		var i = e.charAt(0).toUpperCase() + e.substr(1);
		return (t[e] = {
			s: "_set" + i + "Attr",
			g: "_get" + i + "Attr",
		});
	},
	_set: function (e, t) {
		this[e] = t;
	},
});
a.registry = {};

declare global {
	namespace DojoJS
	{
		interface Dijit_editor {
			_Plugin: typeof a;
		}
	}
}

export = a;