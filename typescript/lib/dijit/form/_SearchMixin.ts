
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/keys");
import i = require("dojo/_base/lang");
import n = require("dojo/query");
import o = require("dojo/string");
import a = require("dojo/when");
import s = require("../registry");

var _SearchMixin = e("dijit.form._SearchMixin", null, {
	pageSize: 1 / 0,
	store: null,
	fetchProperties: {},
	query: {},
	list: "",
	_setListAttr: function (e) {
		this._set("list", e);
	},
	searchDelay: 200,
	searchAttr: "name",
	queryExpr: "${0}*",
	ignoreCase: true,
	_patternToRegExp: function (e) {
		return new RegExp(
			"^" +
				e.replace(
					/(\\.)|(\*)|(\?)|\W/g,
					function (e, t, i, n) {
						return i
							? ".*"
							: n
							? "."
							: t || "\\" + e;
					}
				) +
				"$",
			this.ignoreCase ? "mi" : "m"
		);
	},
	_abortQuery: function () {
		this.searchTimer &&
			(this.searchTimer = this.searchTimer.remove());
		this._queryDeferHandle &&
			(this._queryDeferHandle =
				this._queryDeferHandle.remove());
		if (this._fetchHandle) {
			if (this._fetchHandle.abort) {
				this._cancelingQuery = true;
				this._fetchHandle.abort();
				this._cancelingQuery = false;
			}
			if (this._fetchHandle.cancel) {
				this._cancelingQuery = true;
				this._fetchHandle.cancel();
				this._cancelingQuery = false;
			}
			this._fetchHandle = null;
		}
	},
	_processInput: function (e) {
		if (!this.disabled && !this.readOnly) {
			var i = e.charOrCode;
			this._prev_key_backspace = false;
			if (i == t.DELETE || i == t.BACKSPACE) {
				this._prev_key_backspace = true;
				this._maskValidSubsetError = true;
			}
			this.store
				? (this.searchTimer = this.defer(
						"_startSearchFromInput",
						1
					))
				: this.onSearch();
		}
	},
	onSearch: function () {},
	_startSearchFromInput: function () {
		this._startSearch(this.focusNode.value);
	},
	_startSearch: function (e) {
		this._abortQuery();
		var t,
			n = this,
			s = i.clone(this.query),
			r = {
				start: 0,
				count: this.pageSize,
				queryOptions: {
					ignoreCase: this.ignoreCase,
					deep: true,
				},
			},
			l = o.substitute(this.queryExpr, [
				e.replace(/([\\\*\?])/g, "\\$1"),
			]),
			d = function () {
				var e = (n._fetchHandle = n.store.query(s, r));
				n.disabled ||
					n.readOnly ||
					t !== n._lastQuery ||
					a(
						e,
						function (i) {
							n._fetchHandle = null;
							n.disabled ||
								n.readOnly ||
								t !== n._lastQuery ||
								a(e.total, function (e) {
									i.total = e;
									var t = n.pageSize;
									(isNaN(t) || t > i.total) &&
										(t = i.total);
									i.nextPage = function (e) {
										r.direction = e =
											false !== e;
										r.count = t;
										if (e) {
											r.start += i.length;
											r.start >=
												i.total &&
												(r.count = 0);
										} else {
											r.start -= t;
											if (r.start < 0) {
												r.count =
													Math.max(
														t +
															r.start,
														0
													);
												r.start = 0;
											}
										}
										if (r.count <= 0) {
											i.length = 0;
											n.onSearch(i, s, r);
										} else d();
									};
									n.onSearch(i, s, r);
								});
						},
						function (e) {
							n._fetchHandle = null;
							n._cancelingQuery ||
								console.error(
									n.declaredClass +
										" " +
										e.toString()
								);
						}
					);
			};
		i.mixin(r, this.fetchProperties);
		this.store._oldAPI
			? (t = l)
			: ((t = this._patternToRegExp(l)).toString =
					function () {
						return l;
					});
		this._lastQuery = s[this.searchAttr] = t;
		this._queryDeferHandle = this.defer(
			d,
			this.searchDelay
		);
	},
	constructor: function () {
		this.query = {};
		this.fetchProperties = {};
	},
	postMixInProperties: function () {
		if (!this.store) {
			var e = this.list;
			e && (this.store = s.byId(e));
		}
		this.inherited(arguments);
	},
} as DijitJS.form._SearchMixin<any, any, any>);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_SearchMixin: typeof _SearchMixin;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _SearchMixin;