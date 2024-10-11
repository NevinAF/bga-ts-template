
// @ts-nocheck

import array = require("dojo/_base/array");
import _baseWindow = require("dojo/_base/window");
import dijit = require("./main");

var n = {},
	o = {},
	registry = {
		length: 0,
		add: function (e) {
			if (o[e.id])
				throw new Error(
					"Tried to register widget with id==" +
						e.id +
						" but that id is already registered"
				);
			o[e.id] = e;
			this.length++;
		},
		remove: function (e) {
			if (o[e]) {
				delete o[e];
				this.length--;
			}
		},
		byId: function (e) {
			return "string" == typeof e ? o[e] : e;
		},
		byNode: function (e) {
			return o[e.getAttribute("widgetId")];
		},
		toArray: function () {
			var e = [];
			for (var t in o) e.push(o[t]);
			return e;
		},
		getUniqueId: function (e) {
			var t;
			do {
				t = e + "_" + (e in n ? ++n[e] : (n[e] = 0));
			} while (o[t]);
			return "dijit" == dijit._scopeName
				? t
				: dijit._scopeName + "_" + t;
		},
		findWidgets: function (e, t) {
			var i = [];
			!(function e(n) {
				for (var a = n.firstChild; a; a = a.nextSibling)
					if (1 == a.nodeType) {
						var s = a.getAttribute("widgetId");
						if (s) {
							var r = o[s];
							r && i.push(r);
						} else a !== t && e(a);
					}
			})(e);
			return i;
		},
		_destroyAll: function () {
			dijit._curFocus = null;
			dijit._prevFocus = null;
			dijit._activeStack = [];
			array.forEach(registry.findWidgets(_baseWindow.body()), function (e) {
				e._destroyed ||
					(e.destroyRecursive
						? e.destroyRecursive()
						: e.destroy && e.destroy());
			});
		},
		getEnclosingWidget: function (e) {
			for (; e; ) {
				var t =
					1 == e.nodeType &&
					e.getAttribute("widgetId");
				if (t) return o[t];
				e = e.parentNode;
			}
			return null;
		},
		_hash: o,
	} as DijitJS.Registry;
dijit.registry = registry;

declare global {
	namespace DojoJS
	{
		interface Registry extends DijitJS.Registry {}
	}
}

export = registry;