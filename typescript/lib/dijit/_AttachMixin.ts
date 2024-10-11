
// @ts-nocheck

import _require = require("require");
import t = require("dojo/_base/array");
import i = require("dojo/_base/connect");
import n = require("dojo/_base/declare");
import lang = require("dojo/_base/lang");
import a = require("dojo/mouse");
import s = require("dojo/on");
import r = require("dojo/touch");
import _WidgetBase = require("./_WidgetBase");

var d,
	c = lang.delegate(r, {
		mouseenter: a.enter,
		mouseleave: a.leave,
		keypress: i._keypress,
	}),
	_AttachMixin = n("dijit._AttachMixin", null, {
		constructor: function () {
			this._attachPoints = [];
			this._attachEvents = [];
		},
		buildRendering: function () {
			this.inherited(arguments);
			this._attachTemplateNodes(this.domNode);
			this._beforeFillContent();
		},
		_beforeFillContent: function () {},
		_attachTemplateNodes: function (e) {
			for (var t = e; ; )
				if (
					1 == t.nodeType &&
					(this._processTemplateNode(
						t,
						function (e, t) {
							return e.getAttribute(t);
						},
						this._attach
					) ||
						this.searchContainerNode) &&
					t.firstChild
				)
					t = t.firstChild;
				else {
					if (t == e) return;
					for (; !t.nextSibling; )
						if ((t = t.parentNode) == e) return;
					t = t.nextSibling;
				}
		},
		_processTemplateNode: function (e, t, i) {
			var n = true,
				a = this.attachScope || this,
				s =
					t(e, "dojoAttachPoint") ||
					t(e, "data-dojo-attach-point");
			if (s)
				for (
					var r, l = s.split(/\s*,\s*/);
					(r = l.shift());

				) {
					lang.isArray(a[r]) ? a[r].push(e) : (a[r] = e);
					n = "containerNode" != r;
					this._attachPoints.push(r);
				}
			var d =
				t(e, "dojoAttachEvent") ||
				t(e, "data-dojo-attach-event");
			if (d)
				for (
					var c, h = d.split(/\s*,\s*/), u = lang.trim;
					(c = h.shift());

				)
					if (c) {
						var p = null;
						if (-1 != c.indexOf(":")) {
							var m = c.split(":");
							c = u(m[0]);
							p = u(m[1]);
						} else c = u(c);
						p || (p = c);
						this._attachEvents.push(
							i(e, c, lang.hitch(a, p))
						);
					}
			return n;
		},
		_attach: function (t, i, n) {
			i =
				"dijitclick" ==
				(i = i.replace(/^on/, "").toLowerCase())
					? d || (d = _require("./a11yclick"))
					: c[i] || i;
			return s(t, i, n);
		},
		_detachTemplateNodes: function () {
			var e = this.attachScope || this;
			t.forEach(this._attachPoints, function (t) {
				delete e[t];
			});
			this._attachPoints = [];
			t.forEach(this._attachEvents, function (e) {
				e.remove();
			});
			this._attachEvents = [];
		},
		destroyRendering: function () {
			this._detachTemplateNodes();
			this.inherited(arguments);
		},
	} as DijitJS._AttachMixin);
lang.extend(_WidgetBase, { dojoAttachEvent: "", dojoAttachPoint: "" });

declare global {
	namespace DojoJS {
		interface Dijit {
			_AttachMixin: typeof _AttachMixin;
		}
	}
}

export = _AttachMixin;