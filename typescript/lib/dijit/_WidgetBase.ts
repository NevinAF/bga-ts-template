
// @ts-nocheck

import e = require("require");
import t = require("dojo/_base/array");
import i = require("dojo/aspect");
import n = require("dojo/_base/config");
import o = require("dojo/_base/connect");
import declare = require("dojo/_base/declare");
import s = require("dojo/dom");
import r = require("dojo/dom-attr");
import l = require("dojo/dom-class");
import d = require("dojo/dom-construct");
import c = require("dojo/dom-geometry");
import h = require("dojo/dom-style");
import u = require("dojo/has");
import p = require("dojo/_base/kernel");
import m = require("dojo/_base/lang");
import g = require("dojo/on");
import f = require("dojo/ready");
import _ = require("dojo/Stateful");
import v = require("dojo/topic");
import b = require("dojo/_base/window");
import y = require("./Destroyable");
import w = require("dojo/has!dojo-bidi?./_BidiMixin");
import C = require("./registry");

u.add("dijit-legacy-requires", !p.isAsync);
u.add("dojo-bidi", false);
u("dijit-legacy-requires") &&
	f(0, function () {
		e(["dijit/_base/manager"]);
	});
var k = {};
function x(e) {
	return function (t) {
		r[t ? "set" : "remove"](this.domNode, e, t);
		this._set(e, t);
	};
}
var _WidgetBase = declare("dijit._WidgetBase", [_, y], {
	id: "",
	_setIdAttr: "domNode",
	lang: "",
	_setLangAttr: x("lang"),
	dir: "",
	_setDirAttr: x("dir"),
	class: "",
	_setClassAttr: { node: "domNode", type: "class" },
	_setTypeAttr: null,
	style: "",
	title: "",
	tooltip: "",
	baseClass: "",
	srcNodeRef: null,
	domNode: null,
	containerNode: null,
	ownerDocument: null,
	_setOwnerDocumentAttr: function (e) {
		this._set("ownerDocument", e);
	},
	attributeMap: {},
	_blankGif:
		n.blankGif || e.toUrl("dojo/resources/blank.gif"),
	textDir: "",
	_introspect: function () {
		var e = this.constructor;
		if (!e._setterAttrs) {
			var t = e.prototype,
				i = (e._setterAttrs = []),
				n = (e._onMap = {});
			for (var o in t.attributeMap) i.push(o);
			for (o in t) {
				/^on/.test(o) &&
					(n[o.substring(2).toLowerCase()] = o);
				if (/^_set[A-Z](.*)Attr$/.test(o)) {
					o =
						o.charAt(4).toLowerCase() +
						o.substr(5, o.length - 9);
					(t.attributeMap && o in t.attributeMap) ||
						i.push(o);
				}
			}
		}
	},
	postscript: function (e, t) {
		this.create(e, t);
	},
	create: function (e, t) {
		this._introspect();
		this.srcNodeRef = s.byId(t);
		this._connects = [];
		this._supportingWidgets = [];
		this.srcNodeRef &&
			this.srcNodeRef.id &&
			"string" == typeof this.srcNodeRef.id &&
			(this.id = this.srcNodeRef.id);
		if (e) {
			this.params = e;
			m.mixin(this, e);
		}
		this.postMixInProperties();
		if (!this.id) {
			this.id = C.getUniqueId(
				this.declaredClass.replace(/\./g, "_")
			);
			this.params && delete this.params.id;
		}
		this.ownerDocument =
			this.ownerDocument ||
			(this.srcNodeRef
				? this.srcNodeRef.ownerDocument
				: document);
		this.ownerDocumentBody = b.body(this.ownerDocument);
		C.add(this);
		this.buildRendering();
		var i;
		if (this.domNode) {
			this._applyAttributes();
			var n = this.srcNodeRef;
			if (n && n.parentNode && this.domNode !== n) {
				n.parentNode.replaceChild(this.domNode, n);
				i = true;
			}
			this.domNode.setAttribute("widgetId", this.id);
		}
		this.postCreate();
		i && delete this.srcNodeRef;
		this._created = true;
	},
	_applyAttributes: function () {
		var e = {};
		for (var i in this.params || {}) e[i] = this._get(i);
		t.forEach(
			this.constructor._setterAttrs,
			function (t) {
				if (!(t in e)) {
					var i = this._get(t);
					i && this.set(t, i);
				}
			},
			this
		);
		for (i in e) this.set(i, e[i]);
	},
	postMixInProperties: function () {},
	buildRendering: function () {
		this.domNode ||
			(this.domNode =
				this.srcNodeRef ||
				this.ownerDocument.createElement("div"));
		if (this.baseClass) {
			var e = this.baseClass.split(" ");
			this.isLeftToRight() ||
				(e = e.concat(
					t.map(e, function (e) {
						return e + "Rtl";
					})
				));
			l.add(this.domNode, e);
		}
	},
	postCreate: function () {},
	startup: function () {
		if (!this._started) {
			this._started = true;
			t.forEach(this.getChildren(), function (e) {
				if (
					!e._started &&
					!e._destroyed &&
					m.isFunction(e.startup)
				) {
					e.startup();
					e._started = true;
				}
			});
		}
	},
	destroyRecursive: function (e) {
		this._beingDestroyed = true;
		this.destroyDescendants(e);
		this.destroy(e);
	},
	destroy: function (e) {
		this._beingDestroyed = true;
		this.uninitialize();
		function i(t) {
			t.destroyRecursive
				? t.destroyRecursive(e)
				: t.destroy && t.destroy(e);
		}
		t.forEach(this._connects, m.hitch(this, "disconnect"));
		t.forEach(this._supportingWidgets, i);
		this.domNode &&
			t.forEach(
				C.findWidgets(this.domNode, this.containerNode),
				i
			);
		this.destroyRendering(e);
		C.remove(this.id);
		this._destroyed = true;
	},
	destroyRendering: function (e) {
		if (this.bgIframe) {
			this.bgIframe.destroy(e);
			delete this.bgIframe;
		}
		if (this.domNode) {
			e
				? r.remove(this.domNode, "widgetId")
				: d.destroy(this.domNode);
			delete this.domNode;
		}
		if (this.srcNodeRef) {
			e || d.destroy(this.srcNodeRef);
			delete this.srcNodeRef;
		}
	},
	destroyDescendants: function (e) {
		t.forEach(this.getChildren(), function (t) {
			t.destroyRecursive && t.destroyRecursive(e);
		});
	},
	uninitialize: function () {
		return false;
	},
	_setStyleAttr: function (e) {
		var t = this.domNode;
		m.isObject(e)
			? h.set(t, e)
			: t.style.cssText
			? (t.style.cssText += "; " + e)
			: (t.style.cssText = e);
		this._set("style", e);
	},
	_attrToDom: function (e, i, n) {
		n = arguments.length >= 3 ? n : this.attributeMap[e];
		t.forEach(
			m.isArray(n) ? n : [n],
			function (t) {
				var n = this[t.node || t || "domNode"];
				switch (t.type || "attribute") {
					case "attribute":
						m.isFunction(i) &&
							(i = m.hitch(this, i));
						var o = t.attribute
							? t.attribute
							: /^on[A-Z][a-zA-Z]*$/.test(e)
							? e.toLowerCase()
							: e;
						n.tagName
							? r.set(n, o, i)
							: n.set(o, i);
						break;
					case "innerText":
						n.innerHTML = "";
						n.appendChild(
							this.ownerDocument.createTextNode(i)
						);
						break;
					case "textContent":
						n.textContent = i;
						break;
					case "innerHTML":
						n.innerHTML = i;
						break;
					case "class":
						l.replace(n, i, this[e]);
						break;
					case "toggleClass":
						l.toggle(n, t.className || e, i);
				}
			},
			this
		);
	},
	get: function (e) {
		var t = this._getAttrNames(e);
		return this[t.g] ? this[t.g]() : this._get(e);
	},
	set: function (e, t) {
		if ("object" == typeof e) {
			for (var i in e) this.set(i, e[i]);
			return this;
		}
		var n = this._getAttrNames(e),
			o = this[n.s];
		if (m.isFunction(o))
			var a = o.apply(
				this,
				Array.prototype.slice.call(arguments, 1)
			);
		else {
			var s =
					this.focusNode &&
					!m.isFunction(this.focusNode)
						? "focusNode"
						: "domNode",
				r = this[s] && this[s].tagName,
				l =
					r &&
					(k[r] ||
						(k[r] = (function (e) {
							var t = {};
							for (var i in e)
								t[i.toLowerCase()] = true;
							return t;
						})(this[s]))),
				d =
					e in this.attributeMap
						? this.attributeMap[e]
						: n.s in this
						? this[n.s]
						: (l &&
								n.l in l &&
								"function" != typeof t) ||
							/^aria-|^data-|^role$/.test(e)
						? s
						: null;
			null != d && this._attrToDom(e, t, d);
			this._set(e, t);
		}
		return a || this;
	},
	_attrPairNames: {},
	_getAttrNames: function (e) {
		var t = this._attrPairNames;
		if (t[e]) return t[e];
		var i = e.replace(/^[a-z]|-[a-zA-Z]/g, function (e) {
			return e.charAt(e.length - 1).toUpperCase();
		});
		return (t[e] = {
			n: e + "Node",
			s: "_set" + i + "Attr",
			g: "_get" + i + "Attr",
			l: i.toLowerCase(),
		});
	},
	_set: function (e, t) {
		var i,
			n,
			o = this[e];
		this[e] = t;
		if (
			this._created &&
			!((i = o), (n = t), i === n || (i != i && n != n))
		) {
			this._watchCallbacks &&
				this._watchCallbacks(e, o, t);
			this.emit("attrmodified-" + e, {
				detail: { prevValue: o, newValue: t },
			});
		}
	},
	_get: function (e) {
		return this[e];
	},
	emit: function (e, t, i) {
		undefined === (t = t || {}).bubbles && (t.bubbles = true);
		undefined === t.cancelable && (t.cancelable = true);
		t.detail || (t.detail = {});
		t.detail.widget = this;
		var n,
			o = this["on" + e];
		o && (n = o.apply(this, i || [t]));
		this._started &&
			!this._beingDestroyed &&
			g.emit(this.domNode, e.toLowerCase(), t);
		return n;
	},
	on: function (e, t) {
		var n = this._onMap(e);
		return n
			? i.after(this, n, t, true)
			: this.own(g(this.domNode, e, t))[0];
	},
	_onMap: function (e) {
		var t = this.constructor,
			i = t._onMap;
		if (!i) {
			i = t._onMap = {};
			for (var n in t.prototype)
				/^on/.test(n) &&
					(i[n.replace(/^on/, "").toLowerCase()] = n);
		}
		return i["string" == typeof e && e.toLowerCase()];
	},
	toString: function () {
		return (
			"[Widget " +
			this.declaredClass +
			", " +
			(this.id || "NO ID") +
			"]"
		);
	},
	getChildren: function () {
		return this.containerNode
			? C.findWidgets(this.containerNode)
			: [];
	},
	getParent: function () {
		return C.getEnclosingWidget(this.domNode.parentNode);
	},
	connect: function (e, t, i) {
		return this.own(o.connect(e, t, this, i))[0];
	},
	disconnect: function (e) {
		e.remove();
	},
	subscribe: function (e, t) {
		return this.own(v.subscribe(e, m.hitch(this, t)))[0];
	},
	unsubscribe: function (e) {
		e.remove();
	},
	isLeftToRight: function () {
		return this.dir
			? "ltr" == this.dir.toLowerCase()
			: c.isBodyLtr(this.ownerDocument);
	},
	isFocusable: function () {
		return (
			this.focus &&
			"none" != h.get(this.domNode, "display")
		);
	},
	placeAt: function (e, t) {
		var i = !e.tagName && C.byId(e);
		if (!i || !i.addChild || (t && "number" != typeof t)) {
			var n =
				i && "domNode" in i
					? i.containerNode &&
						!/after|before|replace/.test(t || "")
						? i.containerNode
						: i.domNode
					: s.byId(e, this.ownerDocument);
			d.place(this.domNode, n, t);
			!this._started &&
				(this.getParent() || {})._started &&
				this.startup();
		} else i.addChild(this, t);
		return this;
	},
	defer: function (e, t) {
		var i = setTimeout(
			m.hitch(this, function () {
				if (i) {
					i = null;
					this._destroyed || m.hitch(this, e)();
				}
			}),
			t || 0
		);
		return {
			remove: function () {
				if (i) {
					clearTimeout(i);
					i = null;
				}
				return null;
			},
		};
	},
} as DijitJS._WidgetBase);
u("dojo-bidi") && _WidgetBase.extend(w);

declare global {
	namespace DojoJS
	{
		interface Dijit
		{
			_WidgetBase: typeof _WidgetBase;
		}
	}
}

export = _WidgetBase;