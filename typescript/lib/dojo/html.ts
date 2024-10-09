// @ts-nocheck

import dojo = require("./_base/kernel");
import lang = require("./_base/lang");
import i = require("./_base/array");
import declare = require("./_base/declare");
import o = require("./dom");
import a = require("./dom-construct");
import s = require("./parser");

type Promise<T> = typeof import("dojo/promise/Promise")<T>;

var r = 0,
	html = {
		_secureForInnerHtml: function (e) {
			return e.replace(
				/(?:\s*<!DOCTYPE\s[^>]+>|<title[^>]*>[\s\S]*?<\/title>)/gi,
				""
			);
		},
		_emptyNode: a.empty,
		_setNodeContent: function<T extends Node>(node: Node, cont: string | Node | ArrayLike<T> | number) {
			a.empty(node);
			if (cont) {
				"number" == typeof cont && (cont = cont.toString());
				"string" == typeof cont &&
					(cont = a.toDom(cont, node.ownerDocument!));
				// @ts-ignore
				if (!cont.nodeType && lang.isArrayLike(cont)) {
					cont = cont as ArrayLike<T>;
					for (
						var n = cont.length, o = 0;
						o < cont.length;
						o = n == cont.length ? o + 1 : 0
					)
						a.place(cont[o]!, node, "last");
				}
				else a.place(cont as Node, node, "last");
			}
			return node;
		},
		_ContentSetter: declare("dojo.html._ContentSetter", null, {
			node: "",
			content: "",
			id: "",
			cleanContent: false,
			extractContent: false,
			parseContent: false,
			parserScope: dojo._scopeName,
			startup: true,
			constructor: function (e, i) {
				lang.mixin(this, e || {});
				i = this.node = o.byId(this.node || i);
				this.id ||
					(this.id = [
						"Setter",
						i ? i.id || i.tagName : "",
						r++,
					].join("_"));
			},
			set: function (e, t) {
				undefined !== e && (this.content = e);
				"number" == typeof e && (e = e.toString());
				t && this._mixin(t);
				this.onBegin();
				this.setContent();
				var i = this.onEnd();
				return i && i.then ? i : this.node;
			},
			setContent: function () {
				var e = this.node;
				if (!e)
					throw new Error(
						this.declaredClass +
							": setContent given no node"
					);
				try {
					e = html._setNodeContent(e, this.content);
				} catch (i) {
					var t = this.onContentError(i);
					try {
						e.innerHTML = t;
					} catch (i) {
						console.error(
							"Fatal " +
								this.declaredClass +
								".setContent could not change content due to " +
								i.message,
							i
						);
					}
				}
				this.node = e;
			},
			empty: function () {
				if (this.parseDeferred) {
					this.parseDeferred.isResolved() ||
						this.parseDeferred.cancel();
					delete this.parseDeferred;
				}
				if (
					this.parseResults &&
					this.parseResults.length
				) {
					i.forEach(this.parseResults, function (e) {
						e.destroy && e.destroy();
					});
					delete this.parseResults;
				}
				a.empty(this.node);
			},
			onBegin: function () {
				var e = this.content;
				if (lang.isString(e)) {
					this.cleanContent &&
						(e = html._secureForInnerHtml(e));
					if (this.extractContent) {
						var i = e.match(
							/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im
						);
						i && (e = i[1]);
					}
				}
				this.empty();
				this.content = e;
				return this.node;
			},
			onEnd: function () {
				this.parseContent && this._parse();
				return this.node;
			},
			tearDown: function () {
				delete this.parseResults;
				delete this.parseDeferred;
				delete this.node;
				delete this.content;
			},
			onContentError: function (e) {
				return "Error occurred setting content: " + e;
			},
			onExecError: function (e) {
				return "Error occurred executing scripts: " + e;
			},
			_mixin: function (e) {
				var t,
					i = {};
				for (t in e) t in i || (this[t] = e[t]);
			},
			_parse: function () {
				var e = this.node;
				try {
					var t = {};
					i.forEach(
						["dir", "lang", "textDir"],
						function (e) {
							this[e] && (t[e] = this[e]);
						},
						this
					);
					var n = this;
					this.parseDeferred = s
						.parse({
							rootNode: e,
							noStart: !this.startup,
							inherited: t,
							scope: this.parserScope,
						})
						.then(
							function (e) {
								return (n.parseResults = e);
							},
							function (e) {
								n._onError(
									"Content",
									e,
									"Error parsing in _ContentSetter#" +
										n.id
								);
							}
						);
				} catch (o) {
					this._onError(
						"Content",
						o,
						"Error parsing in _ContentSetter#" +
							this.id
					);
				}
			},
			_onError: function (e, t, i) {
				var n = this["on" + e + "Error"].call(this, t);
				i
					? console.error(i, t)
					: n && html._setNodeContent(this.node, n, true);
			},
		}),
		set: function (e, i, n) {
			null == i && (i = "");
			"number" == typeof i && (i = i.toString());
			if (n) {
				return new html._ContentSetter(
					lang.mixin(n, { content: i, node: e })
				).set();
			}
			return html._setNodeContent(e, i, true);
		},
	} as Html;
lang.setObject("dojo.html", html);

type ContentSetterContent = string | Node | ArrayLike<Node>;

interface ContentSetterParams {
	node?: Node | string;
	content?: ContentSetterContent;
	id?: string;
	cleanContent?: boolean;
	extractContent?: boolean;
	parseContent?: boolean;
	parserScope?: boolean;
	startup?: boolean;
	onBegin?: Function;
	onEnd?: Function;
	tearDown?: Function;
	onContentError?: Function;
	onExecError?: Function;
}

interface ContentSetter {

	/**
	 * An node which will be the parent element that we set content into
	 */
	node: Node | string;

	/**
	 * The content to be placed in the node. Can be an HTML string, a node reference, or a enumerable list of nodes
	 */
	content: ContentSetterContent;

	/**
	 * Usually only used internally, and auto-generated with each instance
	 */
	id: string;

	/**
	 * Should the content be treated as a full html document,
	 * and the real content stripped of <html>, <body> wrapper before injection
	 */
	cleanContent: boolean;

	/**
	 * Should the content be treated as a full html document,
	 * and the real content stripped of `<html> <body>` wrapper before injection
	 */
	extractContent: boolean;

	/**
	 * Should the node by passed to the parser after the new content is set
	 */
	parseContent: boolean;

	/**
	 * Flag passed to parser.	Root for attribute names to search for.	  If scopeName is dojo,
	 * will search for data-dojo-type (or dojoType).  For backwards compatibility
	 * reasons defaults to dojo._scopeName (which is "dojo" except when
	 * multi-version support is used, when it will be something like dojo16, dojo20, etc.)
	 */
	parserScope: string;

	/**
	 * Start the child widgets after parsing them.	  Only obeyed if parseContent is true.
	 */
	startup: boolean;

	/**
	 * front-end to the set-content sequence
	 */
	set(cont?: ContentSetterContent, params?: ContentSetterParams): Promise<Node> | Node;

	/**
	 * sets the content on the node
	 */
	setContent(): void;

	/**
	 * cleanly empty out existing content
	 */
	empty(): void;

	/**
	 * Called after instantiation, but before set();
	 * It allows modification of any of the object properties -
	 * including the node and content provided - before the set operation actually takes place
	 */
	onBegin(): Node;

	/**
	 * Called after set(), when the new content has been pushed into the node
	 * It provides an opportunity for post-processing before handing back the node to the caller
	 * This default implementation checks a parseContent flag to optionally run the dojo parser over the new content
	 */
	onEnd(): Node;

	/**
	 * manually reset the Setter instance if its being re-used for example for another set()
	 */
	tearDown(): void;

	onContentError(): string;
	onExecError(): string;
	_mixin(params: ContentSetterParams): void;
	parseDeferred: DojoJS.Deferred<any[]>;

	/**
	 * runs the dojo parser over the node contents, storing any results in this.parseResults
	 */
	_parse(): void;

	/**
	 * shows user the string that is returned by on[type]Error
	 * override/implement on[type]Error and return your own string to customize
	 */
	_onError(type: string, err: Error, consoleText?: string): void;
}

interface ContentSetterConstructor extends DojoJS.DojoClass<ContentSetter> {
	new (params?: ContentSetterParams, node?: Node | string): ContentSetter;
}

interface Html {
	/**
	 * removes !DOCTYPE and title elements from the html string.
	 *
	 * khtml is picky about dom faults, you can't attach a style or `<title>` node as child of body
	 * must go into head, so we need to cut out those tags
	 */
	_secureForInnerHtml(cont: string): string;

	/**
	 * Deprecated, should use dojo/dom-constuct.empty() directly, remove in 2.0.
	 */
	_emptyNode(node: Node | string): void;

	/**
	 * inserts the given content into the given node
	 */
	_setNodeContent<T extends Node>(node: Node, cont: string | Node | ArrayLike<T> | number): Node;

	_ContentSetter: ContentSetterConstructor;

	/**
	 * inserts (replaces) the given content into the given node. dojo/dom-construct.place(cont, node, "only")
	 * may be a better choice for simple HTML insertion.
	 */
	set(node: Node, cont?: ContentSetterContent, params?: ContentSetterParams): Promise<Node> | Node;
}

declare global {
	namespace DojoJS {
		interface DojoHTML extends Type<typeof html> {}
		interface Dojo {
			html: DojoHTML;
		}
	}
}

export = html;