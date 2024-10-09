// @ts-nocheck

import e = require("dojo");
import t = require("dojox");
import i = require("dojo/data/util/sorter");
import n = require("dojo/string");

var QueryReadStore = e.declare("dojox.data.QueryReadStore", null, {
	url: "",
	requestMethod: "get",
	_className: "dojox.data.QueryReadStore",
	_items: [],
	_lastServerQuery: null,
	_numRows: -1,
	lastRequestHash: null,
	doClientPaging: false,
	doClientSorting: false,
	_itemsByIdentity: null,
	_identifier: null,
	_features: {
		"dojo.data.api.Read": true,
		"dojo.data.api.Identity": true,
	},
	_labelAttr: "label",
	constructor: function (t) {
		e.mixin(this, t);
	},
	getValue: function (t, i, n) {
		this._assertIsItem(t);
		if (!e.isString(i))
			throw new Error(
				this._className +
					".getValue(): Invalid attribute, string expected!"
			);
		return !this.hasAttribute(t, i) && n ? n : t.i[i];
	},
	getValues: function (e, t) {
		this._assertIsItem(e);
		var i = [];
		this.hasAttribute(e, t) && i.push(e.i[t]);
		return i;
	},
	getAttributes: function (e) {
		this._assertIsItem(e);
		var t = [];
		for (var i in e.i) t.push(i);
		return t;
	},
	hasAttribute: function (e, t) {
		return this.isItem(e) && undefined !== e.i[t];
	},
	containsValue: function (e, t, i) {
		for (
			var n = this.getValues(e, t), o = n.length, a = 0;
			a < o;
			a++
		)
			if (n[a] == i) return true;
		return false;
	},
	isItem: function (e) {
		return !!e && undefined !== e.r && e.r == this;
	},
	isItemLoaded: function (e) {
		return this.isItem(e);
	},
	loadItem: function (e) {
		this.isItemLoaded(e.item);
	},
	fetch: function (t) {
		(t = t || {}).store || (t.store = this);
		var i = this;
		this._fetchItems(
			t,
			function (t, n, o) {
				var a = n.abort || null,
					s = false,
					r = n.start ? n.start : 0;
				0 == i.doClientPaging && (r = 0);
				var l = n.count ? r + n.count : t.length;
				n.abort = function () {
					s = true;
					a && a.call(n);
				};
				var d = n.scope || e.global;
				n.store || (n.store = i);
				n.onBegin && n.onBegin.call(d, o, n);
				n.sort &&
					i.doClientSorting &&
					t.sort(
						e.data.util.sorter.createSortFunction(
							n.sort,
							i
						)
					);
				if (n.onItem)
					for (
						var c = r;
						c < t.length && c < l;
						++c
					) {
						var h = t[c];
						s || n.onItem.call(d, h, n);
					}
				if (n.onComplete && !s) {
					var u = null;
					n.onItem || (u = t.slice(r, l));
					n.onComplete.call(d, u, n);
				}
			},
			function (t, i) {
				if (i.onError) {
					var n = i.scope || e.global;
					i.onError.call(n, t, i);
				}
			}
		);
		return t;
	},
	getFeatures: function () {
		return this._features;
	},
	close: function (e) {},
	getLabel: function (e) {
		if (this._labelAttr && this.isItem(e))
			return this.getValue(e, this._labelAttr);
	},
	getLabelAttributes: function (e) {
		return this._labelAttr ? [this._labelAttr] : null;
	},
	_xhrFetchHandler: function (t, i, n, o) {
		(t = this._filterResponse(t)).label &&
			(this._labelAttr = t.label);
		var a = t.numRows || -1;
		this._items = [];
		e.forEach(
			t.items,
			function (e) {
				this._items.push({ i: e, r: this });
			},
			this
		);
		var s = t.identifier;
		this._itemsByIdentity = {};
		if (s) {
			this._identifier = s;
			var r;
			for (r = 0; r < this._items.length; ++r) {
				var l = this._items[r].i,
					d = l[s];
				if (this._itemsByIdentity[d])
					throw new Error(
						this._className +
							":  The json data as specified by: [" +
							this.url +
							"] is malformed.  Items within the list have identifier: [" +
							s +
							"].  Value collided: [" +
							d +
							"]"
					);
				this._itemsByIdentity[d] = l;
			}
		} else {
			this._identifier = Number;
			for (r = 0; r < this._items.length; ++r)
				this._items[r].n = r;
		}
		a = this._numRows = -1 === a ? this._items.length : a;
		n(this._items, i, a);
		this._numRows = a;
	},
	_fetchItems: function (t, i, n) {
		var o = t.serverQuery || t.query || {};
		if (!this.doClientPaging) {
			o.start = t.start || 0;
			t.count && (o.count = t.count);
		}
		if (!this.doClientSorting && t.sort) {
			var a = [];
			e.forEach(t.sort, function (e) {
				e &&
					e.attribute &&
					a.push(
						(e.descending ? "-" : "") + e.attribute
					);
			});
			o.sort = a.join(",");
		}
		if (
			this.doClientPaging &&
			null !== this._lastServerQuery &&
			e.toJson(o) == e.toJson(this._lastServerQuery)
		) {
			this._numRows =
				-1 === this._numRows
					? this._items.length
					: this._numRows;
			i(this._items, t, this._numRows);
		} else {
			var s = (
				"post" == this.requestMethod.toLowerCase()
					? e.xhrPost
					: e.xhrGet
			)({
				url: this.url,
				handleAs: "json-comment-optional",
				content: o,
				failOk: true,
			});
			t.abort = function () {
				s.cancel();
			};
			s.addCallback(
				e.hitch(this, function (e) {
					this._xhrFetchHandler(e, t, i, n);
				})
			);
			s.addErrback(function (e) {
				n(e, t);
			});
			this.lastRequestHash =
				new Date().getTime() +
				"-" +
				String(Math.random()).substring(2);
			this._lastServerQuery = e.mixin({}, o);
		}
	},
	_filterResponse: function (e) {
		return e;
	},
	_assertIsItem: function (e) {
		if (!this.isItem(e))
			throw new Error(
				this._className + ": Invalid item argument."
			);
	},
	_assertIsAttribute: function (e) {
		if ("string" != typeof e)
			throw new Error(
				this._className +
					": Invalid attribute argument ('" +
					e +
					"')."
			);
	},
	fetchItemByIdentity: function (t) {
		if (this._itemsByIdentity) {
			var i = this._itemsByIdentity[t.identity];
			if (undefined !== i) {
				if (t.onItem) {
					var n = t.scope ? t.scope : e.global;
					t.onItem.call(n, { i: i, r: this });
				}
				return;
			}
		}
		var o = { serverQuery: { id: t.identity } };
		this._fetchItems(
			o,
			function (i, n) {
				var o = t.scope ? t.scope : e.global;
				try {
					var a = null;
					i && 1 == i.length && (a = i[0]);
					t.onItem && t.onItem.call(o, a);
				} catch (s) {
					t.onError && t.onError.call(o, s);
				}
			},
			function (i, n) {
				var o = t.scope ? t.scope : e.global;
				t.onError && t.onError.call(o, i);
			}
		);
	},
	getIdentity: function (e) {
		return this._identifier === Number
			? e.n
			: e.i[this._identifier];
	},
	getIdentityAttributes: function (e) {
		return [this._identifier];
	},
});

declare global {
	namespace DojoJS
	{
		interface Dojox {
			data: {
				QueryReadStore: typeof QueryReadStore;
			}
		}
	}
}

export = QueryReadStore;