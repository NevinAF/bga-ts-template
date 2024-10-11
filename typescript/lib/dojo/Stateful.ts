// @ts-nocheck

import declare = require("./_base/declare");
import lang = require("./_base/lang");
import array = require("./_base/array");
import when = require("./when");

var Stateful = declare("dojo.Stateful", null, {
	_attrPairNames: {},
	_getAttrNames: function (e) {
		var t = this._attrPairNames;
		return t[e]
			? t[e]
			: (t[e] = {
					s: "_" + e + "Setter",
					g: "_" + e + "Getter",
				});
	},
	postscript: function (e) {
		e && this.set(e);
	},
	_get: function (e, t) {
		return "function" == typeof this[t.g]
			? this[t.g]()
			: this[e];
	},
	get: function (e) {
		return this._get(e, this._getAttrNames(e));
	},
	set: function (e, t) {
		if ("object" == typeof e) {
			for (var i in e)
				e.hasOwnProperty(i) &&
					"_watchCallbacks" != i &&
					this.set(i, e[i]);
			return this;
		}
		var o,
			a = this._getAttrNames(e),
			s = this._get(e, a),
			r = this[a.s];
		"function" == typeof r
			? (o = r.apply(
					this,
					Array.prototype.slice.call(arguments, 1)
				))
			: (this[e] = t);
		if (this._watchCallbacks) {
			var l = this;
			when(o, function () {
				l._watchCallbacks(e, s, t);
			});
		}
		return this;
	},
	_changeAttrValue: function (e, t) {
		var i = this.get(e);
		this[e] = t;
		this._watchCallbacks && this._watchCallbacks(e, i, t);
		return this;
	},
	watch: function (e, t) {
		var n = this._watchCallbacks;
		if (!n) {
			var o = this;
			n = this._watchCallbacks = function (e, t, i, a) {
				var s = function (n) {
					if (n)
						for (
							var a = 0,
								s = (n = n.slice()).length;
							a < s;
							a++
						)
							n[a].call(o, e, t, i);
				};
				s(n["_" + e]);
				a || s(n["*"]);
			};
		}
		if (t || "function" != typeof e) e = "_" + e;
		else {
			t = e;
			e = "*";
		}
		var a = n[e];
		"object" != typeof a && (a = n[e] = []);
		a.push(t);
		var s = {};
		s.unwatch = s.remove = function () {
			var e = array.indexOf(a, t);
			e > -1 && a.splice(e, 1);
		};
		return s;
	},
} as DojoJS.Stateful);

export = Stateful;