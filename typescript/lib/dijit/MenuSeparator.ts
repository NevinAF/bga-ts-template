
import e = require("dojo/_base/declare");
import t = require("dojo/dom");
import i = require("./_WidgetBase");
import n = require("./_TemplatedMixin");
import o = require("./_Contained");
import a = require("dojo/text"); // import a = require("dojo/text!./templates/MenuSeparator.html");

var MenuSeparator = e("dijit.MenuSeparator", [i, n, o], {
	templateString: a,
	buildRendering: function () {
		this.inherited(arguments);
		// @ts-ignore
		t.setSelectable(this.domNode, false);
	},
	isFocusable: function () {
		return false;
	},
}) as unknown as DijitJS.MenuSeparatorConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			MenuSeparator: typeof MenuSeparator;
		}
	}
}

export = MenuSeparator;