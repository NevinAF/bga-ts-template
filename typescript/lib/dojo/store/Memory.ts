// @ts-nocheck

import declare = require("../_base/declare");
import t = require("./util/QueryResults");
import i = require("./util/SimpleQueryEngine");

var memory = declare("dojo.store.Memory", null, {
	constructor: function (e) {
		for (var t in e) this[t] = e[t];
		this.setData(this.data || []);
	},
	data: null,
	idProperty: "id",
	index: null,
	queryEngine: i,
	get: function (e) {
		return this.data[this.index[e]];
	},
	getIdentity: function (e) {
		return e[this.idProperty];
	},
	put: function (e, t) {
		var i = this.data,
			n = this.index,
			o = this.idProperty,
			a = (e[o] =
				t && "id" in t
					? t.id
					: o in e
					? e[o]
					: Math.random());
		if (a in n) {
			if (t && false === t.overwrite)
				throw new Error("Object already exists");
			i[n[a]] = e;
		} else n[a] = i.push(e) - 1;
		return a;
	},
	add: function (e, t) {
		(t = t || {}).overwrite = false;
		return this.put(e, t);
	},
	remove: function (e) {
		var t = this.index,
			i = this.data;
		if (e in t) {
			i.splice(t[e], 1);
			this.setData(i);
			return true;
		}
	},
	query: function (e, i) {
		return t(this.queryEngine(e, i)(this.data));
	},
	setData: function (e) {
		if (e.items) {
			this.idProperty = e.identifier || this.idProperty;
			e = this.data = e.items;
		} else this.data = e;
		this.index = {};
		for (var t = 0, i = e.length; t < i; t++)
			this.index[e[t][this.idProperty]] = t;
	},
});

interface MemoryOptions<T extends Object> {
	data?: T[];
	idProperty?: string;
	queryEngine?: typeof import("./util/SimpleQueryEngine");
	setData?: (data: T[]) => void;
}

interface PutDirectives<T extends Object> {

	/**
	 * Indicates the identity of the object if a new object is created
	 */
	id?: string | number;

	/**
	 * If the collection of objects in the store has a natural ordering,
	 * this indicates that the created or updated object should be placed before the
	 * object specified by the value of this property. A value of null indicates that the
	 * object should be last.
	 */
	before?: T;

	/**
	 * If the store is hierarchical (with single parenting) this property indicates the
	 * new parent of the created or updated object.
	 */
	parent?: T;

	/**
	 * If this is provided as a boolean it indicates that the object should or should not
	 * overwrite an existing object. A value of true indicates that a new object
	 * should not be created, the operation should update an existing object. A
	 * value of false indicates that an existing object should not be updated, a new
	 * object should be created (which is the same as an add() operation). When
	 * this property is not provided, either an update or creation is acceptable.
	 */
	overwrite?: boolean;
}

interface Memory<T extends Object>
{
	/**
	 * If the store has a single primary key, this indicates the property to use as the
	 * identity property. The values of this property should be unique.
	 */
	idProperty: string;

	/**
	 * If the store can be queried locally (on the client side in JS), this defines
	 * the query engine to use for querying the data store.
	 * This takes a query and query options and returns a function that can execute
	 * the provided query on a JavaScript array. The queryEngine may be replace to
	 * provide more sophisticated querying capabilities. For example:
	 * | var query = store.queryEngine({foo:"bar"}, {count:10});
	 * | query(someArray) -> filtered array
	 * The returned query function may have a "matches" property that can be
	 * used to determine if an object matches the query. For example:
	 * | query.matches({id:"some-object", foo:"bar"}) -> true
	 * | query.matches({id:"some-object", foo:"something else"}) -> false
	 */
	queryEngine: typeof import("./util/SimpleQueryEngine");

	/**
	 * Retrieves an object by its identity
	 */
	get(id: string | number): T;

	/**
	 * Returns an object's identity
	 */
	getIdentity(object: T): string | number;

	/**
	 * Stores an object
	 */
	put<D extends PutDirectives<T>>(object: T, directives?: D): string | number;

	/**
	 * Creates an object, throws an error if the object already exists
	 */
	add<D extends PutDirectives<T>>(object: T, directives?: D): string | number;

	/**
	 * Deletes an object by its identity
	 */
	remove(id: string | number): void;

	/**
	 * Queries the store for objects. This does not alter the store, but returns a
	 * set of data from the store.
	 */
	query(query: string | Object | Function, options?: DojoJS.QueryOptions): DojoJS.QueryResults<T>;

	/**
	 * Starts a new transaction.
	 * Note that a store user might not call transaction() prior to using put,
	 * delete, etc. in which case these operations effectively could be thought of
	 * as "auto-commit" style actions.
	 */
	transaction(): Transaction;

	/**
	 * Retrieves the children of an object.
	 */
	getChildren(parent: T, options?: DojoJS.QueryOptions): DojoJS.QueryResults<T>;

	/**
	 * Returns any metadata about the object. This may include attribution,
	 * cache directives, history, or version information.
	 */
	getMetadata(object: T): Object;
	/**
	 * The array of all the objects in the memory store
	 */
	data: T[];

	/**
	 * An index of data indices into the data array by id
	 */
	index: { [id: string]: number };

	/**
	 * Sets the given data as the source for this store, and indexes it
	 */
	setData(data: T[]): void;
}

interface Transaction {
	/**
	 * Commits the transaction. This may throw an error if it fails. Of if the operation
	 * is asynchronous, it may return a promise that represents the eventual success
	 * or failure of the commit.
	 */
	commit(): void;

	/**
	 * Aborts the transaction. This may throw an error if it fails. Of if the operation
	 * is asynchronous, it may return a promise that represents the eventual success
	 * or failure of the abort.
	 */
	abort(): void;
}

interface MemoryConstructor extends DojoJS.DojoClass<Memory<Object>> {
	/**
	 * This is a basic in-memory object store. It implements dojo/store/api/Store.
	 */
	new <T extends Object>(options?: MemoryOptions<T>): Memory<T>;
}

declare global {
	namespace DojoJS {
		interface DojoStore {
			Memory: MemoryConstructor;
		}
		interface Dojo {
			store: DojoStore;
		}
	}
}

export = memory as MemoryConstructor;