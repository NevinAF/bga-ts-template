// @ts-nocheck

import dojo = require("./_base/kernel");
import has = require("./has");
import dom = require("./dom");
import on = require("./on");
import array = require("./_base/array");
import lang = require("./_base/lang");
import loader = require("./selector/_loader");
var s: any; // require("./selector/_loader!default");

has.add("array-extensible", function () {
	return (
		1 == lang.delegate([], { length: 1 }).length &&
		!has("bug-for-in-skips-shadowed")
	);
});
var u = Array.prototype,
	c = u.slice,
	l = u.concat,
	f = array.forEach,
	d = function (t, n, r) {
		n = [0].concat(c.call(n, 0));
		r = r || dojo.global;
		return function (e) {
			n[0] = e;
			return t.apply(r, n);
		};
	},
	nodeList = function (e) {
		var n = this instanceof h && has("array-extensible");
		"number" == typeof e && (e = Array(e));
		var r = e && "length" in e ? e : arguments;
		if (n || !r.sort) {
			for (
				var o = n ? this : [],
					a = (o.length = r.length),
					s = 0;
				s < a;
				s++
			)
				o[s] = r[s];
			if (n) return o;
			r = o;
		}
		lang._mixin(r, g);
		r._NodeListCtor = function (e) {
			return h(e);
		};
		return r;
	},
	h = nodeList,
	g = (h.prototype = has("array-extensible") ? [] : {});
h._wrap = g._wrap = function (e, t, n) {
	var r = new (n || this._NodeListCtor || h)(e);
	return t ? r._stash(t) : r;
};
h._adaptAsMap = function (e, t) {
	return function () {
		return this.map(d(e, arguments, t));
	};
};
h._adaptAsForEach = function (e, t) {
	return function () {
		this.forEach(d(e, arguments, t));
		return this;
	};
};
h._adaptAsFilter = function (e, t) {
	return function () {
		return this.filter(d(e, arguments, t));
	};
};
h._adaptWithCondition = function (t, n, r) {
	return function () {
		var o = arguments,
			i = d(t, o, r);
		if (n.call(r || dojo.global, o)) return this.map(i);
		this.forEach(i);
		return this;
	};
};
f(["slice", "splice"], function (e) {
	var t = u[e];
	g[e] = function () {
		return this._wrap(
			t.apply(this, arguments),
			"slice" == e ? this : null
		);
	};
});
f(["indexOf", "lastIndexOf", "every", "some"], function (t) {
	var n = array[t];
	g[t] = function () {
		return n.apply(dojo, [this].concat(c.call(arguments, 0)));
	};
});
lang.extend(nodeList, {
	constructor: h,
	_NodeListCtor: h,
	toString: function () {
		return this.join(",");
	},
	_stash: function (e) {
		this._parent = e;
		return this;
	},
	on: function (e, t) {
		var n = this.map(function (n) {
			return on(n, e, t);
		});
		n.remove = function () {
			for (var e = 0; e < n.length; e++) n[e].remove();
		};
		return n;
	},
	end: function () {
		return this._parent
			? this._parent
			: new this._NodeListCtor(0);
	},
	concat: function (e) {
		var t = c.call(this, 0),
			n = array.map(arguments, function (e) {
				return c.call(e, 0);
			});
		return this._wrap(l.apply(t, n), this);
	},
	map: function (e, t) {
		return this._wrap(array.map(this, e, t), this);
	},
	forEach: function (e, t) {
		f(this, e, t);
		return this;
	},
	filter: function (e) {
		var t = arguments,
			n = this,
			r = 0;
		if ("string" == typeof e) {
			n = query._filterResult(this, t[0]);
			if (1 == t.length) return n._stash(this);
			r = 1;
		}
		return this._wrap(array.filter(n, t[r], t[r + 1]), this);
	},
	instantiate: function (e, t) {
		var n = lang.isFunction(e) ? e : lang.getObject(e);
		t = t || {};
		return this.forEach(function (e) {
			new n(t, e);
		});
	},
	at: function () {
		var e = new this._NodeListCtor(0);
		f(
			arguments,
			function (t) {
				t < 0 && (t = this.length + t);
				this[t] && e.push(this[t]);
			},
			this
		);
		return e._stash(this);
	},
});
function m(e, t) {
	var r = function (r, o) {
		if ("string" == typeof o && !(o = dom.byId(o)))
			return new t([]);
		var i =
			"string" == typeof r
				? e(r, o)
				: r
				? r.end && r.on
					? r
					: [r]
				: [];
		return i.end && i.on ? i : new t(i);
	};
	r.matches =
		e.match ||
		function (e, t, n) {
			return r.filter([e], t, n).length > 0;
		};
	r.filter =
		e.filter ||
		function (e, t, n) {
			return r(t, n).filter(function (t) {
				return array.indexOf(e, t) > -1;
			});
		};
	if ("function" != typeof e) {
		var i = e.search;
		e = function (e, t) {
			return i(t || document, e);
		};
	}
	return r;
}
var query = m(s, nodeList);
dojo.query = m(s, function (e) {
	return nodeList(e);
});
query.load = function (e, t, n) {
	loader.load(e, t, function (e) {
		n(m(e, nodeList));
	});
};
dojo._filterQueryResult = query._filterResult = function (e, t, n) {
	return new nodeList(query.filter(e, t, n));
};
dojo.NodeList = query.NodeList = nodeList;


interface NodeListFilterCallback<T extends Node> {
	(item: T, idx: number, nodeList: this): boolean;
}

type NodeListFilter<T extends Node> = string | NodeListFilterCallback<T>;

declare global {
	namespace DojoJS
	{
		interface Dojo {
			/**
			 * Provides a mechanism to filter a NodeList based on a selector or filtering function.
			 */
			query: Query;
		}

		interface NodeListConstructor {
			new <T extends Node>(array: number | Array<T>): DojoJS.NodeList<T>;
			new <T extends Node>(...args: T[]): DojoJS.NodeList<T>;
			<T extends Node>(array: number | Array<T>): DojoJS.NodeList<T>;
			<T extends Node>(...args: T[]): DojoJS.NodeList<T>;
		
			prototype: NodeList<any>;
		
			/**
			 * decorate an array to make it look like a `dojo/NodeList`.
			 */
			_wrap<U extends Node, V extends Node>(a: U[], parent?: DojoJS.NodeList<V>, NodeListCtor?: NodeListConstructor): DojoJS.NodeList<U>;
		
			/**
			 * adapts a single node function to be used in the map-type
			 * actions. The return is a new array of values, as via `dojo/_base/array.map`
			 */
			_adaptAsMap<T extends Node, U extends Node>(f: (node: T) => U, o?: Object): DojoJS.NodeList<U>;
		
			/**
			 * adapts a single node function to be used in the forEach-type
			 * actions. The initial object is returned from the specialized
			 * function.
			 */
			_adaptAsForEach<T extends Node>(f: (node: T) => void, o?: Object): this;
		
			/**
			 * adapts a single node function to be used in the filter-type actions
			 */
			_adaptAsFilter<T extends Node>(f: (node: T) => boolean, o?: Object): this;
		
			/**
			 * adapts a single node function to be used in the map-type
			 * actions, behaves like forEach() or map() depending on arguments
			 */
			_adaptWithCondition<T extends Node, U extends Node>(f: (node: T) => U | void, g: (...args: any[]) => boolean, o?: Object): DojoJS.NodeList<U> | this;
		}

		interface Query {
			/**
			 * Returns nodes which match the given CSS selector, searching the
			 * entire document by default but optionally taking a node to scope
			 * the search by. Returns an instance of NodeList.
			 */
			<T extends Node>(query: string, root?: Node | string): DojoJS.NodeList<T>;
		
			/**
			 * Test to see if a node matches a selector
			 */
			matches(node: Node, selector: string, root?: Node | string): boolean;
		
			/**
			 * Filters an array of nodes. Note that this does not guarantee to return a NodeList, just an array.
			 */
			filter<T extends Node>(nodes: DojoJS.NodeList<T> | T[], select: string, root?: Node | string): T[] | DojoJS.NodeList<T>;
		
			/**
			 * can be used as AMD plugin to conditionally load new query engine
			 */
			load(id: string, parentRequire: Function, loaded: Function): void; /* WIP: Align with loader api */
		
			NodeList: NodeListConstructor;
		}

		interface NodeList<T extends Node> extends ArrayLike<T> {
			/**
			 * decorate an array to make it look like a `dojo/NodeList`.
			 */
			_wrap<U extends Node, V extends Node>(a: U[], parent?: NodeList<V>, NodeListCtor?: NodeListConstructor): NodeList<U>;
		
			_NodeListCtor: NodeListConstructor;
			toString(): string;
		
			/**
			 * private function to hold to a parent NodeList. end() to return the parent NodeList.
			 */
			_stash(parent: Node): this;
		
			/**
			 * Listen for events on the nodes in the NodeList.
			 */
			on(eventName: string, listener: EventListener): Handle[];
		
			/**
			 * Ends use of the current `NodeList` by returning the previous NodeList
			 * that generated the current NodeList.
			 */
			end<U extends Node>(): NodeList<U>;
		
			/**
			 * Returns a new NodeList, maintaining this one in place
			 */
			slice(begin: number, end?: number): this;
		
			/**
			 * Returns a new NodeList, manipulating this NodeList based on
			 * the arguments passed, potentially splicing in new elements
			 * at an offset, optionally deleting elements
			 */
			splice(index: number, howmany?: number, ...items: T[]): this;
		
			/**
			 * see `dojo/_base/array.indexOf()`. The primary difference is that the acted-on
			 * array is implicitly this NodeList
			 */
			indexOf(value: T, fromIndex?: number, findLast?: boolean): number;
		
			/**
			 * see `dojo/_base/array.lastIndexOf()`. The primary difference is that the
			 * acted-on array is implicitly this NodeList
			 */
			lastIndexOf(value: T, fromIndex?: number): number;
		
			/**
			 * see `dojo/_base/array.every()` and the [Array.every
			 * docs](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every).
			 * Takes the same structure of arguments and returns as
			 * dojo/_base/array.every() with the caveat that the passed array is
			 * implicitly this NodeList
			 */
			every(callback: (item: T, idx: number, nodeList: this) => boolean | string, thisObj?: Object): boolean;
		
			/**
			 * Takes the same structure of arguments and returns as
			 * `dojo/_base/array.some()` with the caveat that the passed array as
			 * implicitly this NodeList.  See `dojo/_base/array.some()` and Mozillaas
			 * [Array.soas
			 * documentation](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some).
			 */
			some(callback: (item: T, idx: number, nodeList: this) => boolean | string, thisObj?: Object): boolean;
		
			/**
			 * Returns a new NodeList comprised of items in this NodeList
			 * as well as items passed in as parameters
			 */
			concat(...items: T[]): this;
		
			/**
			 * see `dojo/_base/array.map()`. The primary difference is that the acted-on
			 * array is implicitly this NodeList and the return is a
			 * NodeList (a subclass of Array)
			 */
			map<U extends Node>(func: (item: T, idx: number, nodeList: this) => U, obj?: Object): NodeList<U>;
		
			/**
			 * see `dojo/_base/array.forEach()`. The primary difference is that the acted-on
			 * array is implicitly this NodeList. If you want the option to break out
			 * of the forEach loop, use every() or some() instead.
			 */
			forEach(callback: (item: T, idx: number, nodeList: this) => void, thisObj?: Object): this;
		
			/**
			 * "masks" the built-in javascript filter() method (supported
			 * in Dojo via `dojo/_base/array.filter`) to support passing a simple
			 * string filter in addition to supporting filtering function
			 * objects.
			 */
			filter<U extends Node>(filter: NodeListFilter<T>, thisObj?: Object): NodeList<U>;
		
			/**
			 * Create a new instance of a specified class, using the
			 * specified properties and each node in the NodeList as a
			 * srcNodeRef.
			 */
			instantiate(declaredClass: string | Constructor<any>, properties?: Object): this;
		
			/**
			 * Returns a new NodeList comprised of items in this NodeList
			 * at the given index or indices.
			 */
			at(...indices: number[]): this;
		}
	}
}

export = query as DojoJS.Query;