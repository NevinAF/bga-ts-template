
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/Deferred");
import i = require("dojo/aspect");
import n = require("dojo/data/util/sorter");
import o = require("dojo/_base/declare");
import a = require("dojo/dom");
import s = require("dojo/dom-class");
import r = require("dojo/_base/kernel");
import l = require("dojo/_base/lang");
import d = require("dojo/query");
import c = require("dojo/when");
import h = require("dojo/store/util/QueryResults");
import u = require("./_FormValueWidget");

var _FormSelectWidget = o("dijit.form._FormSelectWidget", u, {
	multiple: false,
	options: null,
	store: null,
	_setStoreAttr: function (e) {
		this._created && this._deprecatedSetStore(e);
	},
	query: null,
	_setQueryAttr: function (e) {
		this._created &&
			this._deprecatedSetStore(
				this.store,
				this.selectedValue,
				{ query: e }
			);
	},
	queryOptions: null,
	_setQueryOptionsAttr: function (e) {
		this._created &&
			this._deprecatedSetStore(
				this.store,
				this.selectedValue,
				{ queryOptions: e }
			);
	},
	labelAttr: "",
	onFetch: null,
	sortByLabel: true,
	loadChildrenOnOpen: false,
	onLoadDeferred: null,
	getOptions: function (t) {
		var i = this.options || [];
		if (null == t) return i;
		if (l.isArrayLike(t))
			return e.map(
				t,
				"return this.getOptions(item);",
				this
			);
		l.isString(t) && (t = { value: t });
		l.isObject(t) &&
			(e.some(i, function (e, i) {
				for (var n in t)
					if (!(n in e) || e[n] != t[n]) return false;
				t = i;
				return true;
			}) ||
				(t = -1));
		return t >= 0 && t < i.length ? i[t] : null;
	},
	addOption: function (t) {
		e.forEach(
			l.isArrayLike(t) ? t : [t],
			function (e) {
				e && l.isObject(e) && this.options.push(e);
			},
			this
		);
		this._loadChildren();
	},
	removeOption: function (t) {
		var i = this.getOptions(l.isArrayLike(t) ? t : [t]);
		e.forEach(
			i,
			function (t) {
				if (t) {
					this.options = e.filter(
						this.options,
						function (e) {
							return (
								e.value !== t.value ||
								e.label !== t.label
							);
						}
					);
					this._removeOptionItem(t);
				}
			},
			this
		);
		this._loadChildren();
	},
	updateOption: function (t) {
		e.forEach(
			l.isArrayLike(t) ? t : [t],
			function (e) {
				var t,
					i = this.getOptions({ value: e.value });
				if (i) for (t in e) i[t] = e[t];
			},
			this
		);
		this._loadChildren();
	},
	setStore: function (e, t, i) {
		r.deprecated(
			this.declaredClass +
				"::setStore(store, selectedValue, fetchArgs) is deprecated. Use set('query', fetchArgs.query), set('queryOptions', fetchArgs.queryOptions), set('store', store), or set('value', selectedValue) instead.",
			"",
			"2.0"
		);
		this._deprecatedSetStore(e, t, i);
	},
	_deprecatedSetStore: function (o, a, s) {
		var r = this.store;
		s = s || {};
		if (r !== o) {
			for (var d; (d = this._notifyConnections.pop()); )
				d.remove();
			if (!o.get) {
				l.mixin(o, {
					_oldAPI: true,
					get: function (e) {
						var i = new t();
						this.fetchItemByIdentity({
							identity: e,
							onItem: function (e) {
								i.resolve(e);
							},
							onError: function (e) {
								i.reject(e);
							},
						});
						return i.promise;
					},
					query: function (e, i) {
						var n = new t(function () {
							o.abort && o.abort();
						});
						n.total = new t();
						var o = this.fetch(
							l.mixin(
								{
									query: e,
									onBegin: function (e) {
										n.total.resolve(e);
									},
									onComplete: function (e) {
										n.resolve(e);
									},
									onError: function (e) {
										n.reject(e);
									},
								},
								i
							)
						);
						return new h(n);
					},
				});
				o.getFeatures()["dojo.data.api.Notification"] &&
					(this._notifyConnections = [
						i.after(
							o,
							"onNew",
							l.hitch(this, "_onNewItem"),
							true
						),
						i.after(
							o,
							"onDelete",
							l.hitch(this, "_onDeleteItem"),
							true
						),
						i.after(
							o,
							"onSet",
							l.hitch(this, "_onSetItem"),
							true
						),
					]);
			}
			this._set("store", o);
		}
		this.options &&
			this.options.length &&
			this.removeOption(this.options);
		this._queryRes &&
			this._queryRes.close &&
			this._queryRes.close();
		if (this._observeHandle && this._observeHandle.remove) {
			this._observeHandle.remove();
			this._observeHandle = null;
		}
		s.query && this._set("query", s.query);
		s.queryOptions &&
			this._set("queryOptions", s.queryOptions);
		if (o && o.query) {
			this._loadingStore = true;
			this.onLoadDeferred = new t();
			this._queryRes = o.query(
				this.query,
				this.queryOptions
			);
			c(
				this._queryRes,
				l.hitch(this, function (t) {
					if (this.sortByLabel && !s.sort && t.length)
						if (o.getValue)
							t.sort(
								n.createSortFunction(
									[
										{
											attribute:
												o.getLabelAttributes(
													t[0]
												)[0],
										},
									],
									o
								)
							);
						else {
							var i = this.labelAttr;
							t.sort(function (e, t) {
								return e[i] > t[i]
									? 1
									: t[i] > e[i]
									? -1
									: 0;
							});
						}
					s.onFetch &&
						(t = s.onFetch.call(this, t, s));
					e.forEach(
						t,
						function (e) {
							this._addOptionForItem(e);
						},
						this
					);
					this._queryRes.observe &&
						(this._observeHandle =
							this._queryRes.observe(
								l.hitch(
									this,
									function (e, t, i) {
										if (t == i)
											this._onSetItem(e);
										else {
											-1 != t &&
												this._onDeleteItem(
													e
												);
											-1 != i &&
												this._onNewItem(
													e
												);
										}
									}
								),
								true
							));
					this._loadingStore = false;
					this.set(
						"value",
						"_pendingValue" in this
							? this._pendingValue
							: a
					);
					delete this._pendingValue;
					this.loadChildrenOnOpen
						? this._pseudoLoadChildren(t)
						: this._loadChildren();
					this.onLoadDeferred.resolve(true);
					this.onSetStore();
				}),
				l.hitch(this, function (e) {
					console.error(
						"dijit.form.Select: " + e.toString()
					);
					this.onLoadDeferred.reject(e);
				})
			);
		}
		return r;
	},
	_setValueAttr: function (t, i) {
		this._onChangeActive || (i = null);
		if (this._loadingStore) this._pendingValue = t;
		else if (null != t) {
			t = l.isArrayLike(t)
				? e.map(t, function (e) {
						return l.isObject(e) ? e : { value: e };
					})
				: l.isObject(t)
				? [t]
				: [{ value: t }];
			t = e.filter(this.getOptions(t), function (e) {
				return e && e.value;
			});
			var n = this.getOptions() || [];
			this.multiple ||
				(t[0] && t[0].value) ||
				!n.length ||
				(t[0] = n[0]);
			e.forEach(n, function (i) {
				i.selected = e.some(t, function (e) {
					return e.value === i.value;
				});
			});
			var o = e.map(t, function (e) {
				return e.value;
			});
			if (undefined !== o && undefined !== o[0]) {
				var a = e.map(t, function (e) {
					return e.label;
				});
				this._setDisplay(this.multiple ? a : a[0]);
				this.inherited(arguments, [
					this.multiple ? o : o[0],
					i,
				]);
				this._updateSelection();
			}
		}
	},
	_getDisplayedValueAttr: function () {
		var t = e.map(
			[].concat(this.get("selectedOptions")),
			function (e) {
				return e && "label" in e
					? e.label
					: e
					? e.value
					: null;
			},
			this
		);
		return this.multiple ? t : t[0];
	},
	_setDisplayedValueAttr: function (e) {
		this.set(
			"value",
			this.getOptions(
				"string" == typeof e ? { label: e } : e
			)
		);
	},
	_loadChildren: function () {
		if (!this._loadingStore) {
			e.forEach(this._getChildren(), function (e) {
				e.destroyRecursive();
			});
			e.forEach(this.options, this._addOptionItem, this);
			this._updateSelection();
		}
	},
	_updateSelection: function () {
		this.focusedChild = null;
		this._set("value", this._getValueFromOpts());
		var t = [].concat(this.value);
		if (t && t[0]) {
			var i = this;
			e.forEach(
				this._getChildren(),
				function (n) {
					var o = e.some(t, function (e) {
						return n.option && e === n.option.value;
					});
					o && !i.multiple && (i.focusedChild = n);
					s.toggle(
						n.domNode,
						this.baseClass.replace(
							/\s+|$/g,
							"SelectedOption "
						),
						o
					);
					n.domNode.setAttribute(
						"aria-selected",
						o ? "true" : "false"
					);
				},
				this
			);
		}
	},
	_getValueFromOpts: function () {
		var t = this.getOptions() || [];
		if (!this.multiple && t.length) {
			var i = e.filter(t, function (e) {
				return e.selected;
			})[0];
			if (i && i.value) return i.value;
			t[0].selected = true;
			return t[0].value;
		}
		return this.multiple
			? e.map(
					e.filter(t, function (e) {
						return e.selected;
					}),
					function (e) {
						return e.value;
					}
				) || []
			: "";
	},
	_onNewItem: function (e, t) {
		(t && t.parent) || this._addOptionForItem(e);
	},
	_onDeleteItem: function (e) {
		var t = this.store;
		this.removeOption({ value: t.getIdentity(e) });
	},
	_onSetItem: function (e) {
		this.updateOption(this._getOptionObjForItem(e));
	},
	_getOptionObjForItem: function (e) {
		var t = this.store,
			i =
				this.labelAttr && this.labelAttr in e
					? e[this.labelAttr]
					: t.getLabel(e);
		return {
			value: i ? t.getIdentity(e) : null,
			label: i,
			item: e,
		};
	},
	_addOptionForItem: function (e) {
		var t = this.store;
		if (!t.isItemLoaded || t.isItemLoaded(e)) {
			var i = this._getOptionObjForItem(e);
			this.addOption(i);
		} else
			t.loadItem({
				item: e,
				onItem: function (e) {
					this._addOptionForItem(e);
				},
				scope: this,
			});
	},
	constructor: function (e) {
		this._oValue = (e || {}).value || null;
		this._notifyConnections = [];
	},
	buildRendering: function () {
		this.inherited(arguments);
		a.setSelectable(this.focusNode, false);
	},
	_fillContent: function () {
		this.options ||
			(this.options = this.srcNodeRef
				? d("> *", this.srcNodeRef).map(function (e) {
						return "separator" ===
							e.getAttribute("type")
							? {
									value: "",
									label: "",
									selected: false,
									disabled: false,
								}
							: {
									value:
										e.getAttribute(
											"data-" +
												r._scopeName +
												"-value"
										) ||
										e.getAttribute("value"),
									label: String(e.innerHTML),
									selected:
										e.getAttribute(
											"selected"
										) || false,
									disabled:
										e.getAttribute(
											"disabled"
										) || false,
								};
					}, this)
				: []);
		this.value
			? this.multiple &&
				"string" == typeof this.value &&
				this._set("value", this.value.split(","))
			: this._set("value", this._getValueFromOpts());
	},
	postCreate: function () {
		this.inherited(arguments);
		i.after(
			this,
			"onChange",
			l.hitch(this, "_updateSelection")
		);
		var e = this.store;
		if (
			e &&
			(e.getIdentity ||
				e.getFeatures()["dojo.data.api.Identity"])
		) {
			this.store = null;
			this._deprecatedSetStore(e, this._oValue, {
				query: this.query,
				queryOptions: this.queryOptions,
			});
		}
		this._storeInitialized = true;
	},
	startup: function () {
		this._loadChildren();
		this.inherited(arguments);
	},
	destroy: function () {
		for (var e; (e = this._notifyConnections.pop()); )
			e.remove();
		this._queryRes &&
			this._queryRes.close &&
			this._queryRes.close();
		if (this._observeHandle && this._observeHandle.remove) {
			this._observeHandle.remove();
			this._observeHandle = null;
		}
		this.inherited(arguments);
	},
	_addOptionItem: function () {},
	_removeOptionItem: function () {},
	_setDisplay: function () {},
	_getChildren: function () {
		return [];
	},
	_getSelectedOptionsAttr: function () {
		return this.getOptions({ selected: true });
	},
	_pseudoLoadChildren: function () {},
	onSetStore: function () {},
} as DijitJS.form._FormSelectWidget);

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_FormSelectWidget: typeof _FormSelectWidget;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _FormSelectWidget;