
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-construct");
import n = require("dojo/_base/kernel");

var _Container = t("dijit._Container", null, {
	buildRendering: function () {
		this.inherited(arguments);
		this.containerNode ||
			(this.containerNode = this.domNode);
	},
	addChild: function (e, t) {
		var n = this.containerNode;
		if (t > 0) {
			n = n.firstChild;
			for (; t > 0; ) {
				1 == n.nodeType && t--;
				n = n.nextSibling;
			}
			if (n) t = "before";
			else {
				n = this.containerNode;
				t = "last";
			}
		}
		i.place(e.domNode, n, t);
		this._started && !e._started && e.startup();
	},
	removeChild: function (e) {
		"number" == typeof e && (e = this.getChildren()[e]);
		if (e) {
			var t = e.domNode;
			t && t.parentNode && t.parentNode.removeChild(t);
		}
	},
	hasChildren: function () {
		return this.getChildren().length > 0;
	},
	_getSiblingOfChild: function (t, i) {
		var n = this.getChildren();
		return n[e.indexOf(n, t) + i];
	},
	getIndexOfChild: function (t) {
		return e.indexOf(this.getChildren(), t);
	},
}) as DijitJS._ContainerConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_Container: typeof _Container;
		}
	}
}

export = _Container;