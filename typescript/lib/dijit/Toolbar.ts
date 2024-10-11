
import e = require("require");
import t = require("dojo/_base/declare");
import i = require("dojo/has");
import n = require("dojo/keys");
import o = require("dojo/ready");
import a = require("./_Widget");
import s = require("./_KeyNavContainer");
import r = require("./_TemplatedMixin");

i("dijit-legacy-requires") &&
	o(0, function () {
		e(["dijit/ToolbarSeparator"]);
	});
var Toolbar = t("dijit.Toolbar", [a, r, s], {
	templateString:
		'<div class="dijit" role="toolbar" tabIndex="${tabIndex}" data-dojo-attach-point="containerNode"></div>',
	baseClass: "dijitToolbar",
	_onLeftArrow: function () {
		this.focusPrev();
	},
	_onRightArrow: function () {
		this.focusNext();
	},
}) as DijitJS.ToolbarConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			Toolbar: typeof Toolbar;
		}
	}
}

export = Toolbar;