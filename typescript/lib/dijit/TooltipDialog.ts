
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom-class");
import i = require("dojo/has");
import n = require("dojo/keys");
import o = require("dojo/_base/lang");
import a = require("dojo/on");
import s = require("./focus");
import r = require("./layout/ContentPane");
import l = require("./_DialogMixin");
import d = require("./form/_FormMixin");
import c = require("./_TemplatedMixin");
import h = require("dojo/text"); // import h = require("dojo/text!./templates/TooltipDialog.html");
import dijit = require("./main");

var TooltipDialog = e("dijit.TooltipDialog", [r, c, d, l], {
	title: "",
	doLayout: false,
	autofocus: true,
	baseClass: "dijitTooltipDialog",
	_firstFocusItem: null,
	_lastFocusItem: null,
	templateString: h,
	_setTitleAttr: "containerNode",
	postCreate: function () {
		this.inherited(arguments);
		this.own(
			a(this.domNode, "keydown", o.hitch(this, "_onKey"))
		);
	},
	orient: function (e, i, n) {
		var o = {
			"MR-ML": "dijitTooltipRight",
			"ML-MR": "dijitTooltipLeft",
			"TM-BM": "dijitTooltipAbove",
			"BM-TM": "dijitTooltipBelow",
			"BL-TL": "dijitTooltipBelow dijitTooltipABLeft",
			"TL-BL": "dijitTooltipAbove dijitTooltipABLeft",
			"BR-TR": "dijitTooltipBelow dijitTooltipABRight",
			"TR-BR": "dijitTooltipAbove dijitTooltipABRight",
			"BR-BL": "dijitTooltipRight",
			"BL-BR": "dijitTooltipLeft",
			"BR-TL": "dijitTooltipBelow dijitTooltipABLeft",
			"BL-TR": "dijitTooltipBelow dijitTooltipABRight",
			"TL-BR": "dijitTooltipAbove dijitTooltipABRight",
			"TR-BL": "dijitTooltipAbove dijitTooltipABLeft",
		}[i + "-" + n];
		t.replace(
			this.domNode,
			o,
			this._currentOrientClass || ""
		);
		this._currentOrientClass = o;
	},
	focus: function () {
		this._getFocusItems();
		s.focus(this._firstFocusItem);
	},
	onOpen: function (e) {
		this.orient(this.domNode, e.aroundCorner, e.corner);
		var t = e.aroundNodePos;
		if (
			"M" == e.corner.charAt(0) &&
			"M" == e.aroundCorner.charAt(0)
		) {
			this.connectorNode.style.top =
				t.y +
				((t.h - this.connectorNode.offsetHeight) >> 1) -
				e.y +
				"px";
			this.connectorNode.style.left = "";
		} else
			"M" == e.corner.charAt(1) &&
				"M" == e.aroundCorner.charAt(1) &&
				(this.connectorNode.style.left =
					t.x +
					((t.w - this.connectorNode.offsetWidth) >>
						1) -
					e.x +
					"px");
		this._onShow();
	},
	onClose: function () {
		this.onHide();
	},
	_onKey: function (e) {
		if (e.keyCode == n.ESCAPE) {
			this.defer("onCancel");
			e.stopPropagation();
			e.preventDefault();
		} else if (e.keyCode == n.TAB) {
			var t = e.target;
			this._getFocusItems();
			if (this._firstFocusItem == this._lastFocusItem) {
				e.stopPropagation();
				e.preventDefault();
			} else if (
				t == this._firstFocusItem &&
				e.shiftKey
			) {
				s.focus(this._lastFocusItem);
				e.stopPropagation();
				e.preventDefault();
			} else if (t != this._lastFocusItem || e.shiftKey)
				e.stopPropagation();
			else {
				s.focus(this._firstFocusItem);
				e.stopPropagation();
				e.preventDefault();
			}
		}
	},
}) as DijitJS.TooltipDialogConstructor;
i("dojo-bidi") &&
	TooltipDialog.extend({
		_setTitleAttr: function (e) {
			this.containerNode.title =
				this.textDir && this.enforceTextDirWithUcc
					? this.enforceTextDirWithUcc(null, e)
					: e;
			this._set("title", e);
		},
		_setTextDirAttr: function (e) {
			if (!this._created || this.textDir != e) {
				this._set("textDir", e);
				this.textDir &&
					this.title &&
					(this.containerNode.title =
						this.enforceTextDirWithUcc(
							null,
							this.title
						));
			}
		},
	});

declare global {
	namespace DojoJS
	{
		interface Dijit {
			TooltipDialog: typeof TooltipDialog;
		}
	}
}

export = TooltipDialog;