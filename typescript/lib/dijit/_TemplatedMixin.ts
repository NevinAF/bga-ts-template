
// @ts-nocheck

import e = require("dojo/cache");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-construct");
import n = require("dojo/_base/lang");
import o = require("dojo/on");
import a = require("dojo/sniff");
import s = require("dojo/string");
import r = require("./_AttachMixin");

var _TemplatedMixin = t("dijit._TemplatedMixin", r, {
	templateString: null,
	templatePath: null,
	_skipNodeCache: false,
	searchContainerNode: true,
	_stringRepl: function (e) {
		var t = this.declaredClass,
			i = this;
		return s.substitute(
			e,
			this,
			function (e, o) {
				"!" == o.charAt(0) &&
					(e = n.getObject(o.substr(1), false, i));
				if (undefined === e)
					throw new Error(t + " template:" + o);
				return null == e
					? ""
					: "!" == o.charAt(0)
					? e
					: this._escapeValue("" + e);
			},
			this
		);
	},
	_escapeValue: function (e) {
		return e.replace(/["'<>&]/g, function (e) {
			return {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#x27;",
			}[e];
		});
	},
	buildRendering: function () {
		if (!this._rendered) {
			this.templateString ||
				(this.templateString = e(this.templatePath, {
					sanitize: true,
				}));
			var t,
				o = _TemplatedMixin.getCachedTemplate(
					this.templateString,
					this._skipNodeCache,
					this.ownerDocument
				);
			if (n.isString(o)) {
				if (
					1 !=
					(t = i.toDom(
						this._stringRepl(o),
						this.ownerDocument
					)).nodeType
				)
					throw new Error("Invalid template: " + o);
			} else t = o.cloneNode(true);
			this.domNode = t;
		}
		this.inherited(arguments);
		this._rendered || this._fillContent(this.srcNodeRef);
		this._rendered = true;
	},
	_fillContent: function (e) {
		var t = this.containerNode;
		if (e && t)
			for (; e.hasChildNodes(); )
				t.appendChild(e.firstChild);
	},
}) as DijitJS._TemplatedMixinConstructor;
_TemplatedMixin._templateCache = {};
_TemplatedMixin.getCachedTemplate = function (e, t, n) {
	var o = _TemplatedMixin._templateCache,
		a = e,
		r = o[a];
	if (r) {
		try {
			if (
				!r.ownerDocument ||
				r.ownerDocument == (n || document)
			)
				return r;
		} catch (c) {}
		i.destroy(r);
	}
	e = s.trim(e);
	if (t || e.match(/\$\{([^\}]+)\}/g)) return (o[a] = e);
	var d = i.toDom(e, n);
	if (1 != d.nodeType)
		throw new Error("Invalid template: " + e);
	return (o[a] = d);
};
a("ie") &&
	o(window, "unload", function () {
		var e = _TemplatedMixin._templateCache;
		for (var t in e) {
			var n = e[t];
			"object" == typeof n && i.destroy(n);
			delete e[t];
		}
	});

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_TemplatedMixin: typeof _TemplatedMixin;
		}
	}
}

export = _TemplatedMixin;