
// @ts-nocheck

import e = require("dojo/_base/kernel");
import t = require("dojo/_base/lang");
import i = require("../_Widget");
import n = require("../_Container");
import o = require("./_ContentPaneResizeMixin");
import a = require("dojo/string");
import s = require("dojo/html");
import r = require("dojo/_base/array");
import l = require("dojo/_base/declare");
import d = require("dojo/_base/Deferred");
import c = require("dojo/dom");
import h = require("dojo/dom-attr");
import u = require("dojo/dom-construct");
import p = require("dojo/_base/xhr");
import m = require("dojo/i18n");
import g = require("dojo/when");
import "dojo/i18n"; // TODO "dojo/i18n!../nls/loading"

var ContentPane = l("dijit.layout.ContentPane", [i, n, o], {
	href: "",
	content: "",
	extractContent: false,
	parseOnLoad: true,
	parserScope: e._scopeName,
	preventCache: false,
	preload: false,
	refreshOnShow: false,
	loadingMessage:
		"<span class='dijitContentPaneLoading'><span class='dijitInline dijitIconLoading'></span>${loadingState}</span>",
	errorMessage:
		"<span class='dijitContentPaneError'><span class='dijitInline dijitIconError'></span>${errorState}</span>",
	isLoaded: false,
	baseClass: "dijitContentPane",
	ioArgs: {},
	onLoadDeferred: null,
	_setTitleAttr: null,
	stopParser: true,
	template: false,
	markupFactory: function (e, t, i) {
		var n = new i(e, t);
		return !n.href &&
			n._contentSetter &&
			n._contentSetter.parseDeferred &&
			!n._contentSetter.parseDeferred.isFulfilled()
			? n._contentSetter.parseDeferred.then(function () {
					return n;
				})
			: n;
	},
	create: function (e, i) {
		if (
			(!e || !e.template) &&
			i &&
			!("href" in e) &&
			!("content" in e)
		) {
			for (
				var n = (i =
					c.byId(
						i
					)).ownerDocument.createDocumentFragment();
				i.firstChild;

			)
				n.appendChild(i.firstChild);
			e = t.delegate(e, { content: n });
		}
		this.inherited(arguments, [e, i]);
	},
	postMixInProperties: function () {
		this.inherited(arguments);
		var e = m.getLocalization(
			"dijit",
			"loading",
			this.lang
		);
		this.loadingMessage = a.substitute(
			this.loadingMessage,
			e
		);
		this.errorMessage = a.substitute(this.errorMessage, e);
	},
	buildRendering: function () {
		this.inherited(arguments);
		this.containerNode ||
			(this.containerNode = this.domNode);
		this.domNode.removeAttribute("title");
	},
	startup: function () {
		this.inherited(arguments);
		this._contentSetter &&
			r.forEach(
				this._contentSetter.parseResults,
				function (e) {
					if (
						!e._started &&
						!e._destroyed &&
						t.isFunction(e.startup)
					) {
						e.startup();
						e._started = true;
					}
				},
				this
			);
	},
	_startChildren: function () {
		r.forEach(this.getChildren(), function (e) {
			if (
				!e._started &&
				!e._destroyed &&
				t.isFunction(e.startup)
			) {
				e.startup();
				e._started = true;
			}
		});
		this._contentSetter &&
			r.forEach(
				this._contentSetter.parseResults,
				function (e) {
					if (
						!e._started &&
						!e._destroyed &&
						t.isFunction(e.startup)
					) {
						e.startup();
						e._started = true;
					}
				},
				this
			);
	},
	setHref: function (t) {
		e.deprecated(
			"dijit.layout.ContentPane.setHref() is deprecated. Use set('href', ...) instead.",
			"",
			"2.0"
		);
		return this.set("href", t);
	},
	_setHrefAttr: function (e) {
		this.cancel();
		this.onLoadDeferred = new d(t.hitch(this, "cancel"));
		this.onLoadDeferred.then(t.hitch(this, "onLoad"));
		this._set("href", e);
		this.preload || (this._created && this._isShown())
			? this._load()
			: (this._hrefChanged = true);
		return this.onLoadDeferred;
	},
	setContent: function (t) {
		e.deprecated(
			"dijit.layout.ContentPane.setContent() is deprecated.  Use set('content', ...) instead.",
			"",
			"2.0"
		);
		this.set("content", t);
	},
	_setContentAttr: function (e) {
		this._set("href", "");
		this.cancel();
		this.onLoadDeferred = new d(t.hitch(this, "cancel"));
		this._created &&
			this.onLoadDeferred.then(t.hitch(this, "onLoad"));
		this._setContent(e || "");
		this._isDownloaded = false;
		return this.onLoadDeferred;
	},
	_getContentAttr: function () {
		return this.containerNode.innerHTML;
	},
	cancel: function () {
		this._xhrDfd &&
			-1 == this._xhrDfd.fired &&
			this._xhrDfd.cancel();
		delete this._xhrDfd;
		this.onLoadDeferred = null;
	},
	destroy: function () {
		this.cancel();
		this.inherited(arguments);
	},
	destroyRecursive: function (e) {
		this._beingDestroyed || this.inherited(arguments);
	},
	_onShow: function () {
		this.inherited(arguments);
		if (
			this.href &&
			!this._xhrDfd &&
			(!this.isLoaded ||
				this._hrefChanged ||
				this.refreshOnShow)
		)
			return this.refresh();
	},
	refresh: function () {
		this.cancel();
		this.onLoadDeferred = new d(t.hitch(this, "cancel"));
		this.onLoadDeferred.then(t.hitch(this, "onLoad"));
		this._load();
		return this.onLoadDeferred;
	},
	_load: function () {
		this._setContent(this.onDownloadStart(), true);
		var e = this,
			i = {
				preventCache:
					this.preventCache || this.refreshOnShow,
				url: this.href,
				handleAs: "text",
			};
		t.isObject(this.ioArgs) && t.mixin(i, this.ioArgs);
		var n,
			o = (this._xhrDfd = (this.ioMethod || p.get)(i));
		o.then(
			function (t) {
				n = t;
				try {
					e._isDownloaded = true;
					return e._setContent(t, false);
				} catch (i) {
					e._onError("Content", i);
				}
			},
			function (t) {
				o.canceled || e._onError("Download", t);
				delete e._xhrDfd;
				return t;
			}
		).then(function () {
			e.onDownloadEnd();
			delete e._xhrDfd;
			return n;
		});
		delete this._hrefChanged;
	},
	_onLoadHandler: function (e) {
		this._set("isLoaded", true);
		try {
			this.onLoadDeferred.resolve(e);
		} catch (t) {
			console.error(
				"Error " +
					(this.widgetId || this.id) +
					" running custom onLoad code: " +
					t.message
			);
		}
	},
	_onUnloadHandler: function () {
		this._set("isLoaded", false);
		try {
			this.onUnload();
		} catch (e) {
			console.error(
				"Error " +
					this.widgetId +
					" running custom onUnload code: " +
					e.message
			);
		}
	},
	destroyDescendants: function (e) {
		this.isLoaded && this._onUnloadHandler();
		var t = this._contentSetter;
		r.forEach(this.getChildren(), function (t) {
			t.destroyRecursive
				? t.destroyRecursive(e)
				: t.destroy && t.destroy(e);
			t._destroyed = true;
		});
		if (t) {
			r.forEach(t.parseResults, function (t) {
				if (!t._destroyed) {
					t.destroyRecursive
						? t.destroyRecursive(e)
						: t.destroy && t.destroy(e);
					t._destroyed = true;
				}
			});
			delete t.parseResults;
		}
		e || u.empty(this.containerNode);
		delete this._singleChild;
	},
	_setContent: function (e, i) {
		e = this.preprocessContent(e);
		this.destroyDescendants();
		var n = this._contentSetter;
		(n && n instanceof s._ContentSetter) ||
			(n = this._contentSetter =
				new s._ContentSetter({
					node: this.containerNode,
					_onError: t.hitch(this, this._onError),
					onContentError: t.hitch(this, function (e) {
						var t = this.onContentError(e);
						try {
							this.containerNode.innerHTML = t;
						} catch (e) {
							console.error(
								"Fatal " +
									this.id +
									" could not change content due to " +
									e.message,
								e
							);
						}
					}),
				}));
		var o = t.mixin(
				{
					cleanContent: this.cleanContent,
					extractContent: this.extractContent,
					parseContent:
						!e.domNode && this.parseOnLoad,
					parserScope: this.parserScope,
					startup: false,
					dir: this.dir,
					lang: this.lang,
					textDir: this.textDir,
				},
				this._contentSetterParams || {}
			),
			a = n.set(
				t.isObject(e) && e.domNode ? e.domNode : e,
				o
			),
			r = this;
		return g(
			a && a.then ? a : n.parseDeferred,
			function () {
				delete r._contentSetterParams;
				if (!i) {
					if (r._started) {
						r._startChildren();
						r._scheduleLayout();
					}
					r._onLoadHandler(e);
				}
			}
		);
	},
	preprocessContent: function (e) {
		return e;
	},
	_onError: function (e, t, i) {
		this.onLoadDeferred.reject(t);
		var n = this["on" + e + "Error"].call(this, t);
		i ? console.error(i, t) : n && this._setContent(n, true);
	},
	onLoad: function () {},
	onUnload: function () {},
	onDownloadStart: function () {
		return this.loadingMessage;
	},
	onContentError: function () {},
	onDownloadError: function () {
		return this.errorMessage;
	},
	onDownloadEnd: function () {},
}) as DijitJS.layout.ContentPaneConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitLayout {
			ContentPane: typeof ContentPane;
		}

		interface Dijit {
			layout: DijitLayout;
		}
	}
}

export = ContentPane;