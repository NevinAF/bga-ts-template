
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/on");
import i = require("dojo/touch");
import n = require("./_ListBase");

var _ListMouseMixin = e("dijit.form._ListMouseMixin", n, {
	postCreate: function () {
		this.inherited(arguments);
		this.domNode.dojoClick = true;
		this._listConnect("click", "_onClick");
		this._listConnect("mousedown", "_onMouseDown");
		this._listConnect("mouseup", "_onMouseUp");
		this._listConnect("mouseover", "_onMouseOver");
		this._listConnect("mouseout", "_onMouseOut");
	},
	_onClick: function (e, t) {
		this._setSelectedAttr(t, false);
		this._deferredClick && this._deferredClick.remove();
		this._deferredClick = this.defer(function () {
			this._deferredClick = null;
			this.onClick(t);
		});
	},
	_onMouseDown: function (e, t) {
		if (this._hoveredNode) {
			this.onUnhover(this._hoveredNode);
			this._hoveredNode = null;
		}
		this._isDragging = true;
		this._setSelectedAttr(t, false);
	},
	_onMouseUp: function (e, t) {
		this._isDragging = false;
		var i = this.selected,
			n = this._hoveredNode;
		i && t == i
			? this.defer(function () {
					this._onClick(e, i);
				})
			: n &&
				this.defer(function () {
					this._onClick(e, n);
				});
	},
	_onMouseOut: function (e, t) {
		if (this._hoveredNode) {
			this.onUnhover(this._hoveredNode);
			this._hoveredNode = null;
		}
		this._isDragging &&
			(this._cancelDrag = new Date().getTime() + 1e3);
	},
	_onMouseOver: function (e, t) {
		if (this._cancelDrag) {
			new Date().getTime() > this._cancelDrag &&
				(this._isDragging = false);
			this._cancelDrag = null;
		}
		this._hoveredNode = t;
		this.onHover(t);
		this._isDragging && this._setSelectedAttr(t, false);
	},
} as DijitJS.form._ListMouseMixin);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_ListMouseMixin: typeof _ListMouseMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _ListMouseMixin;