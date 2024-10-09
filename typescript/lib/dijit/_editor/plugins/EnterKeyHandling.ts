// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/dom-construct");
import i = require("dojo/keys");
import n = require("dojo/_base/lang");
import o = require("dojo/on");
import a = require("dojo/sniff");
import s = require("dojo/_base/window");
import r = require("dojo/window");
import l = require("../_Plugin");
import d = require("../RichText");
import c = require("../range");

var EnterKeyHandling = e("dijit._editor.plugins.EnterKeyHandling", l, {
	blockNodeForEnter: "BR",
	constructor: function (e) {
		if (e) {
			"blockNodeForEnter" in e &&
				(e.blockNodeForEnter =
					e.blockNodeForEnter.toUpperCase());
			n.mixin(this, e);
		}
	},
	setEditor: function (e) {
		if (this.editor !== e) {
			this.editor = e;
			if ("BR" == this.blockNodeForEnter) {
				this.editor.customUndo = true;
				e.onLoadDeferred.then(
					n.hitch(this, function (t) {
						this.own(
							o(
								e.document,
								"keydown",
								n.hitch(this, function (e) {
									if (e.keyCode == i.ENTER) {
										var t = n.mixin({}, e);
										t.shiftKey = true;
										if (
											!this.handleEnterKey(
												t
											)
										) {
											e.stopPropagation();
											e.preventDefault();
										}
									}
								})
							)
						);
						a("ie") >= 9 &&
							a("ie") <= 10 &&
							this.own(
								o(
									e.document,
									"paste",
									n.hitch(this, function (e) {
										setTimeout(
											n.hitch(
												this,
												function () {
													var e =
														this.editor.document.selection.createRange();
													e.move(
														"character",
														-1
													);
													e.select();
													e.move(
														"character",
														1
													);
													e.select();
												}
											),
											0
										);
									})
								)
							);
						return t;
					})
				);
			} else if (this.blockNodeForEnter) {
				var t = n.hitch(this, "handleEnterKey");
				e.addKeyHandler(13, 0, 0, t);
				e.addKeyHandler(13, 0, 1, t);
				this.own(
					this.editor.on(
						"KeyPressed",
						n.hitch(this, "onKeyPressed")
					)
				);
			}
		}
	},
	onKeyPressed: function () {
		if (this._checkListLater) {
			if (this.editor.selection.isCollapsed()) {
				var e =
					this.editor.selection.getAncestorElement(
						"LI"
					);
				if (e) {
					a("mozilla") &&
						"LI" ==
							e.parentNode.parentNode.nodeName &&
						(e = e.parentNode.parentNode);
					var t = e.firstChild;
					if (
						t &&
						1 == t.nodeType &&
						("UL" == t.nodeName ||
							"OL" == t.nodeName)
					) {
						e.insertBefore(
							t.ownerDocument.createTextNode(" "),
							t
						);
						var i = c.create(this.editor.window);
						i.setStart(e.firstChild, 0);
						var n = c.getSelection(
							this.editor.window,
							true
						);
						n.removeAllRanges();
						n.addRange(i);
					}
				} else {
					d.prototype.execCommand.call(
						this.editor,
						"formatblock",
						this.blockNodeForEnter
					);
					var o =
						this.editor.selection.getAncestorElement(
							this.blockNodeForEnter
						);
					if (o) {
						o.innerHTML = this.bogusHtmlContent;
						if (a("ie") <= 9) {
							var s =
								this.editor.document.selection.createRange();
							s.move("character", -1);
							s.select();
						}
					} else
						console.error(
							"onKeyPressed: Cannot find the new block node"
						);
				}
			}
			this._checkListLater = false;
		}
		if (this._pressedEnterInBlock) {
			this._pressedEnterInBlock.previousSibling &&
				this.removeTrailingBr(
					this._pressedEnterInBlock.previousSibling
				);
			delete this._pressedEnterInBlock;
		}
	},
	bogusHtmlContent: "&#160;",
	blockNodes: /^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,
	handleEnterKey: function (e) {
		var i,
			n,
			o,
			s,
			l,
			h,
			u,
			p = this.editor.document;
		if (e.shiftKey) {
			var m = this.editor.selection.getParentElement(),
				g = c.getAncestor(m, this.blockNodes);
			if (g) {
				if ("LI" == g.tagName) return true;
				if (
					!(n = (i = c.getSelection(
						this.editor.window
					)).getRangeAt(0)).collapsed
				) {
					n.deleteContents();
					n = (i = c.getSelection(
						this.editor.window
					)).getRangeAt(0);
				}
				if (
					c.atBeginningOfContainer(
						g,
						n.startContainer,
						n.startOffset
					)
				) {
					l = p.createElement("br");
					o = c.create(this.editor.window);
					g.insertBefore(l, g.firstChild);
					o.setStartAfter(l);
					i.removeAllRanges();
					i.addRange(o);
				} else {
					if (
						!c.atEndOfContainer(
							g,
							n.startContainer,
							n.startOffset
						)
					) {
						if (
							(h = n.startContainer) &&
							3 == h.nodeType
						) {
							u = h.nodeValue;
							s = p.createTextNode(
								u.substring(0, n.startOffset)
							);
							b = p.createTextNode(
								u.substring(n.startOffset)
							);
							v = p.createElement("br");
							"" == b.nodeValue &&
								a("webkit") &&
								(b = p.createTextNode(" "));
							t.place(s, h, "after");
							t.place(v, s, "after");
							t.place(b, v, "after");
							t.destroy(h);
							(o = c.create(
								this.editor.window
							)).setStart(b, 0);
							i.removeAllRanges();
							i.addRange(o);
							return false;
						}
						return true;
					}
					o = c.create(this.editor.window);
					l = p.createElement("br");
					g.appendChild(l);
					g.appendChild(p.createTextNode(" "));
					o.setStart(g.lastChild, 0);
					i.removeAllRanges();
					i.addRange(o);
				}
			} else if (
				(i = c.getSelection(this.editor.window))
					.rangeCount
			) {
				if ((n = i.getRangeAt(0)) && n.startContainer) {
					if (!n.collapsed) {
						n.deleteContents();
						n = (i = c.getSelection(
							this.editor.window
						)).getRangeAt(0);
					}
					if (
						(h = n.startContainer) &&
						3 == h.nodeType
					) {
						var f = n.startOffset;
						if (h.length < f) {
							h = (A = this._adjustNodeAndOffset(
								h,
								f
							)).node;
							f = A.offset;
						}
						u = h.nodeValue;
						s = p.createTextNode(u.substring(0, f));
						b = p.createTextNode(u.substring(f));
						v = p.createElement("br");
						b.length || (b = p.createTextNode(" "));
						s.length
							? t.place(s, h, "after")
							: (s = h);
						t.place(v, s, "after");
						t.place(b, v, "after");
						t.destroy(h);
						(o = c.create(
							this.editor.window
						)).setStart(b, 0);
						o.setEnd(b, b.length);
						i.removeAllRanges();
						i.addRange(o);
						this.editor.selection.collapse(true);
					} else {
						var _;
						n.startOffset >= 0 &&
							(_ = h.childNodes[n.startOffset]);
						var v = p.createElement("br"),
							b = p.createTextNode(" ");
						if (_) {
							t.place(v, _, "before");
							t.place(b, v, "after");
						} else {
							h.appendChild(v);
							h.appendChild(b);
						}
						(o = c.create(
							this.editor.window
						)).setStart(b, 0);
						o.setEnd(b, b.length);
						i.removeAllRanges();
						i.addRange(o);
						this.editor.selection.collapse(true);
					}
				}
			} else
				d.prototype.execCommand.call(
					this.editor,
					"inserthtml",
					"<br>"
				);
			return false;
		}
		var y = true;
		if (
			!(n = (i = c.getSelection(
				this.editor.window
			)).getRangeAt(0)).collapsed
		) {
			n.deleteContents();
			n = (i = c.getSelection(
				this.editor.window
			)).getRangeAt(0);
		}
		var w = c.getBlockAncestor(
				n.endContainer,
				null,
				this.editor.editNode
			),
			C = w.blockNode;
		if (
			(this._checkListLater =
				C &&
				("LI" == C.nodeName ||
					"LI" == C.parentNode.nodeName))
		) {
			a("mozilla") && (this._pressedEnterInBlock = C);
			if (
				/^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(
					C.innerHTML
				)
			) {
				C.innerHTML = "";
				if (a("webkit")) {
					(o = c.create(this.editor.window)).setStart(
						C,
						0
					);
					i.removeAllRanges();
					i.addRange(o);
				}
				this._checkListLater = false;
			}
			return true;
		}
		if (
			!w.blockNode ||
			w.blockNode === this.editor.editNode
		) {
			try {
				d.prototype.execCommand.call(
					this.editor,
					"formatblock",
					this.blockNodeForEnter
				);
			} catch (L) {}
			if (
				(w = {
					blockNode:
						this.editor.selection.getAncestorElement(
							this.blockNodeForEnter
						),
					blockContainer: this.editor.editNode,
				}).blockNode
			) {
				if (
					w.blockNode != this.editor.editNode &&
					!(
						w.blockNode.textContent ||
						w.blockNode.innerHTML
					).replace(/^\s+|\s+$/g, "").length
				) {
					this.removeTrailingBr(w.blockNode);
					return false;
				}
			} else w.blockNode = this.editor.editNode;
			n = (i = c.getSelection(
				this.editor.window
			)).getRangeAt(0);
		}
		var k = p.createElement(this.blockNodeForEnter);
		k.innerHTML = this.bogusHtmlContent;
		this.removeTrailingBr(w.blockNode);
		var x = n.endOffset,
			T = n.endContainer;
		if (T.length < x) {
			var A = this._adjustNodeAndOffset(T, x);
			T = A.node;
			x = A.offset;
		}
		if (c.atEndOfContainer(w.blockNode, T, x)) {
			w.blockNode === w.blockContainer
				? w.blockNode.appendChild(k)
				: t.place(k, w.blockNode, "after");
			y = false;
			(o = c.create(this.editor.window)).setStart(k, 0);
			i.removeAllRanges();
			i.addRange(o);
			this.editor.height && r.scrollIntoView(k);
		} else if (
			c.atBeginningOfContainer(
				w.blockNode,
				n.startContainer,
				n.startOffset
			)
		) {
			t.place(
				k,
				w.blockNode,
				w.blockNode === w.blockContainer
					? "first"
					: "before"
			);
			if (k.nextSibling && this.editor.height) {
				(o = c.create(this.editor.window)).setStart(
					k.nextSibling,
					0
				);
				i.removeAllRanges();
				i.addRange(o);
				r.scrollIntoView(k.nextSibling);
			}
			y = false;
		} else {
			w.blockNode === w.blockContainer
				? w.blockNode.appendChild(k)
				: t.place(k, w.blockNode, "after");
			y = false;
			w.blockNode.style &&
				k.style &&
				w.blockNode.style.cssText &&
				(k.style.cssText = w.blockNode.style.cssText);
			var j, S;
			if ((h = n.startContainer) && 3 == h.nodeType) {
				var E, N;
				x = n.endOffset;
				if (h.length < x) {
					h = (A = this._adjustNodeAndOffset(h, x))
						.node;
					x = A.offset;
				}
				u = h.nodeValue;
				s = p.createTextNode(u.substring(0, x));
				b = p.createTextNode(u.substring(x, u.length));
				t.place(s, h, "before");
				t.place(b, h, "after");
				t.destroy(h);
				for (
					var M = s.parentNode;
					M !== w.blockNode;

				) {
					var D = M.tagName,
						I = p.createElement(D);
					M.style &&
						I.style &&
						M.style.cssText &&
						(I.style.cssText = M.style.cssText);
					if ("FONT" === M.tagName) {
						M.color && (I.color = M.color);
						M.face && (I.face = M.face);
						M.size && (I.size = M.size);
					}
					E = b;
					for (; E; ) {
						N = E.nextSibling;
						I.appendChild(E);
						E = N;
					}
					t.place(I, M, "after");
					s = M;
					b = I;
					M = M.parentNode;
				}
				(1 == (E = b).nodeType ||
					(3 == E.nodeType && E.nodeValue)) &&
					(k.innerHTML = "");
				j = E;
				for (; E; ) {
					N = E.nextSibling;
					k.appendChild(E);
					E = N;
				}
			}
			o = c.create(this.editor.window);
			var $ = j;
			if ("BR" !== this.blockNodeForEnter) {
				for (; $; ) {
					S = $;
					$ = N = $.firstChild;
				}
				if (S && S.parentNode) {
					k = S.parentNode;
					o.setStart(k, 0);
					i.removeAllRanges();
					i.addRange(o);
					this.editor.height && r.scrollIntoView(k);
					a("mozilla") &&
						(this._pressedEnterInBlock =
							w.blockNode);
				} else y = true;
			} else {
				o.setStart(k, 0);
				i.removeAllRanges();
				i.addRange(o);
				this.editor.height && r.scrollIntoView(k);
				a("mozilla") &&
					(this._pressedEnterInBlock = w.blockNode);
			}
		}
		return y;
	},
	_adjustNodeAndOffset: function (e, t) {
		for (
			;
			e.length < t &&
			e.nextSibling &&
			3 == e.nextSibling.nodeType;

		) {
			t -= e.length;
			e = e.nextSibling;
		}
		return { node: e, offset: t };
	},
	removeTrailingBr: function (e) {
		var i = /P|DIV|LI/i.test(e.tagName)
			? e
			: this.editor.selection.getParentOfType(e, [
					"P",
					"DIV",
					"LI",
				]);
		if (i) {
			i.lastChild &&
				((i.childNodes.length > 1 &&
					3 == i.lastChild.nodeType &&
					/^[\s\xAD]*$/.test(
						i.lastChild.nodeValue
					)) ||
					"BR" == i.lastChild.tagName) &&
				t.destroy(i.lastChild);
			i.childNodes.length ||
				(i.innerHTML = this.bogusHtmlContent);
		}
	},
});

declare global {
	namespace DojoJS
	{
		interface Dijit_editorPlugins {
			EnterKeyHandling: typeof EnterKeyHandling;
		}

		interface Dijit_editor {
			plugins: Dijit_editorPlugins;
		}

		interface Dijit {
			_editor: Dijit_editor;
		}
	}
}

export = EnterKeyHandling;