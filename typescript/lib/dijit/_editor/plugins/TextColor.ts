// @ts-nocheck

import e = require("require");
import t = require("dojo/colors");
import i = require("dojo/_base/declare");
import n = require("dojo/_base/lang");
import o = require("../_Plugin");
import a = require("../../form/DropDownButton");

var TextColor = i("dijit._editor.plugins.TextColor", o, {
	buttonClass: a,
	colorPicker: "dijit/ColorPalette",
	useDefaultCommand: false,
	_initButton: function () {
		this.command = this.name;
		this.inherited(arguments);
		var t = this;
		this.button.loadDropDown = function (i) {
			function n(e) {
				t.button.dropDown = new e({
					dir: t.editor.dir,
					ownerDocument: t.editor.ownerDocument,
					value: t.value,
					onChange: function (e) {
						t.editor.execCommand(t.command, e);
					},
					onExecute: function () {
						t.editor.execCommand(
							t.command,
							this.get("value")
						);
					},
				});
				i();
			}
			"string" == typeof t.colorPicker
				? e([t.colorPicker], n)
				: n(t.colorPicker);
		};
	},
	updateState: function () {
		var e = this.editor,
			i = this.command;
		if (e && e.isLoaded && i.length) {
			if (this.button) {
				var n,
					o = this.get("disabled");
				this.button.set("disabled", o);
				if (o) return;
				try {
					n = e.queryCommandValue(i) || "";
				} catch (s) {
					n = "";
				}
			}
			"" == n && (n = "#000000");
			"transparent" == n && (n = "#ffffff");
			if ("string" == typeof n)
				n.indexOf("rgb") > -1 &&
					(n = t.fromRgb(n).toHex());
			else {
				n = (n =
					((255 & n) << 16) |
					(65280 & n) |
					((16711680 & n) >>> 16)).toString(16);
				n = "#000000".slice(0, 7 - n.length) + n;
			}
			this.value = n;
			var a = this.button.dropDown;
			a &&
				a.get &&
				n !== a.get("value") &&
				a.set("value", n, false);
		}
	},
});
o.registry.foreColor = function (e) {
	return new TextColor(e);
};
o.registry.hiliteColor = function (e) {
	return new TextColor(e);
};

declare global {
	namespace DojoJS
	{
		interface Dijit_editorPlugins {
			TextColor: typeof TextColor;
		}

		interface Dijit_editor {
			plugins: Dijit_editorPlugins;
		}

		interface Dijit {
			_editor: Dijit_editor;
		}
	}
}

export = TextColor;