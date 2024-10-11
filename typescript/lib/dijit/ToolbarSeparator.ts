
import e = require("dojo/_base/declare");
import t = require("dojo/dom");
import i = require("./_Widget");
import n = require("./_TemplatedMixin");

var ToolbarSeparator = e("dijit.ToolbarSeparator", [i, n], {
	templateString:
		'<div class="dijitToolbarSeparator dijitInline" role="presentation"></div>',
	buildRendering: function () {
		this.inherited(arguments);
		t.setSelectable(this.domNode, false);
	},
	isFocusable: function () {
		return false;
	},
}) as DijitJS.ToolbarSeparatorConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			ToolbarSeparator: typeof ToolbarSeparator;
		}
	}
}

export = ToolbarSeparator;