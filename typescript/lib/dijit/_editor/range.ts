// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/_base/lang");

var range = {
	getIndex: function (e, t) {
		for (var i, n, o = [], a = [], s = e; e != t; ) {
			var r = 0;
			i = e.parentNode;
			for (; (n = i.childNodes[r++]); )
				if (n === e) {
					--r;
					break;
				}
			o.unshift(r);
			a.unshift(r - i.childNodes.length);
			e = i;
		}
		if (o.length > 0 && 3 == s.nodeType) {
			n = s.previousSibling;
			for (; n && 3 == n.nodeType; ) {
				o[o.length - 1]--;
				n = n.previousSibling;
			}
			n = s.nextSibling;
			for (; n && 3 == n.nodeType; ) {
				a[a.length - 1]++;
				n = n.nextSibling;
			}
		}
		return { o: o, r: a };
	},
	getNode: function (t, n) {
		if (!i.isArray(t) || 0 == t.length) return n;
		var o = n;
		e.every(t, function (e) {
			if (!(e >= 0 && e < o.childNodes.length)) {
				o = null;
				return false;
			}
			o = o.childNodes[e];
			return true;
		});
		return o;
	},
	getCommonAncestor: function (e, t, i) {
		i = i || e.ownerDocument.body;
		for (
			var n = function (e) {
					for (var t = []; e; ) {
						t.unshift(e);
						if (e === i) break;
						e = e.parentNode;
					}
					return t;
				},
				o = n(e),
				a = n(t),
				s = Math.min(o.length, a.length),
				r = o[0],
				l = 1;
			l < s && o[l] === a[l];
			l++
		)
			r = o[l];
		return r;
	},
	getAncestor: function (e, t, i) {
		i = i || e.ownerDocument.body;
		for (; e && e !== i; ) {
			var n = e.nodeName.toUpperCase();
			if (t.test(n)) return e;
			e = e.parentNode;
		}
		return null;
	},
	BlockTagNames:
		/^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/,
	getBlockAncestor: function (e, t, i) {
		i = i || e.ownerDocument.body;
		t = t || range.BlockTagNames;
		for (var o, a = null; e && e !== i; ) {
			var s = e.nodeName.toUpperCase();
			!a && t.test(s) && (a = e);
			!o && /^(?:BODY|TD|TH|CAPTION)$/.test(s) && (o = e);
			e = e.parentNode;
		}
		return {
			blockNode: a,
			blockContainer: o || e.ownerDocument.body,
		};
	},
	atBeginningOfContainer: function (e, t, i) {
		var n = false,
			o = 0 == i;
		o ||
			3 != t.nodeType ||
			(/^[\s\xA0]+$/.test(t.nodeValue.substr(0, i)) &&
				(o = true));
		if (o) {
			var a = t;
			n = true;
			for (; a && a !== e; ) {
				if (a.previousSibling) {
					n = false;
					break;
				}
				a = a.parentNode;
			}
		}
		return n;
	},
	atEndOfContainer: function (e, t, i) {
		var n = false,
			o = i == (t.length || t.childNodes.length);
		o ||
			3 != t.nodeType ||
			(/^[\s\xA0]+$/.test(t.nodeValue.substr(i)) &&
				(o = true));
		if (o) {
			var a = t;
			n = true;
			for (; a && a !== e; ) {
				if (a.nextSibling) {
					n = false;
					break;
				}
				a = a.parentNode;
			}
		}
		return n;
	},
	adjacentNoneTextNode: function (e, t) {
		for (
			var i = e,
				n = 0 - e.length || 0,
				o = t ? "nextSibling" : "previousSibling";
			i && 3 == i.nodeType;

		) {
			n += i.length;
			i = i[o];
		}
		return [i, n];
	},
	create: function (e) {
		return (e = e || window).getSelection
			? e.document.createRange()
			: new a();
	},
	getSelection: function (e, t) {
		if (e.getSelection) return e.getSelection();
		var i = new o.selection(e);
		t || i._getCurrentSelection();
		return i;
	},
};
if (!window.getSelection)
	var o = (range.ie = {
			cachedSelection: {},
			selection: function (e) {
				this._ranges = [];
				this.addRange = function (e, t) {
					this._ranges.push(e);
					t || e._select();
					this.rangeCount = this._ranges.length;
				};
				this.removeAllRanges = function () {
					this._ranges = [];
					this.rangeCount = 0;
				};
				this.getRangeAt = function (e) {
					return this._ranges[e];
				};
				this._getCurrentSelection = function () {
					this.removeAllRanges();
					var t = (function () {
						var t =
								e.document.selection.createRange(),
							i =
								e.document.selection.type.toUpperCase();
						return new a(
							"CONTROL" == i
								? o.decomposeControlRange(t)
								: o.decomposeTextRange(t)
						);
					})();
					if (t) {
						this.addRange(t, true);
						this.isCollapsed = t.collapsed;
					} else this.isCollapsed = true;
				};
			},
			decomposeControlRange: function (e) {
				var t = e.item(0),
					i = e.item(e.length - 1),
					o = t.parentNode,
					a = i.parentNode;
				return [
					o,
					range.getIndex(t, o).o[0],
					a,
					range.getIndex(i, a).o[0] + 1,
				];
			},
			getEndPoint: function (t, i) {
				var o = t.duplicate();
				o.collapse(!i);
				var a,
					s,
					r,
					l = "EndTo" + (i ? "End" : "Start"),
					d = o.parentElement();
				if (d.childNodes.length > 0)
					e.every(d.childNodes, function (e, i) {
						var c;
						if (3 != e.nodeType) {
							o.moveToElementText(e);
							if (o.compareEndPoints(l, t) > 0) {
								if (!r || 3 != r.nodeType) {
									a = d;
									s = i;
									return false;
								}
								a = r;
								c = true;
							} else if (
								i ==
								d.childNodes.length - 1
							) {
								a = d;
								s = d.childNodes.length;
								return false;
							}
						} else if (
							i ==
							d.childNodes.length - 1
						) {
							a = e;
							c = true;
						}
						if (c && a) {
							var h =
								range.adjacentNoneTextNode(a)[0];
							a = h
								? h.nextSibling
								: d.firstChild;
							var u = range.adjacentNoneTextNode(a);
							h = u[0];
							var p = u[1];
							if (h) {
								o.moveToElementText(h);
								o.collapse(false);
							} else o.moveToElementText(d);
							o.setEndPoint(l, t);
							s = o.text.length - p;
							return false;
						}
						r = e;
						return true;
					});
				else {
					a = d;
					s = 0;
				}
				if (
					!i &&
					1 == a.nodeType &&
					s == a.childNodes.length
				) {
					var c = a.nextSibling;
					if (c && 3 == c.nodeType) {
						a = c;
						s = 0;
					}
				}
				return [a, s];
			},
			setEndPoint: function (e, t, i) {
				var o,
					a,
					s = e.duplicate();
				if (3 != t.nodeType)
					if (i > 0) {
						if ((o = t.childNodes[i - 1]))
							if (3 == o.nodeType) {
								t = o;
								i = o.length;
							} else if (
								o.nextSibling &&
								3 == o.nextSibling.nodeType
							) {
								t = o.nextSibling;
								i = 0;
							} else {
								s.moveToElementText(
									o.nextSibling ? o : t
								);
								var r = o.parentNode,
									l = r.insertBefore(
										o.ownerDocument.createTextNode(
											" "
										),
										o.nextSibling
									);
								s.collapse(false);
								r.removeChild(l);
							}
					} else {
						s.moveToElementText(t);
						s.collapse(true);
					}
				if (3 == t.nodeType) {
					var d = range.adjacentNoneTextNode(t),
						c = d[0];
					a = d[1];
					if (c) {
						s.moveToElementText(c);
						s.collapse(false);
						"inherit" != c.contentEditable && a++;
					} else {
						s.moveToElementText(t.parentNode);
						s.collapse(true);
						s.move("character", 1);
						s.move("character", -1);
					}
					(i += a) > 0 &&
						s.move("character", i) != i &&
						console.error("Error when moving!");
				}
				return s;
			},
			decomposeTextRange: function (e) {
				var t = o.getEndPoint(e),
					i = t[0],
					n = t[1],
					a = t[0],
					s = t[1];
				e.htmlText.length &&
					(e.htmlText == e.text
						? (s = n + e.text.length)
						: ((a = (t = o.getEndPoint(e, true))[0]),
							(s = t[1])));
				return [i, n, a, s];
			},
			setRange: function (e, t, i, n, a, s) {
				var r = o.setEndPoint(e, t, i);
				e.setEndPoint("StartToStart", r);
				if (!s) var l = o.setEndPoint(e, n, a);
				e.setEndPoint("EndToEnd", l || r);
				return e;
			},
		}),
		a = (range.W3CRange = t(null, {
			constructor: function () {
				if (arguments.length > 0) {
					this.setStart(
						arguments[0][0],
						arguments[0][1]
					);
					this.setEnd(
						arguments[0][2],
						arguments[0][3]
					);
				} else {
					this.commonAncestorContainer = null;
					this.startContainer = null;
					this.startOffset = 0;
					this.endContainer = null;
					this.endOffset = 0;
					this.collapsed = true;
				}
			},
			_updateInternal: function () {
				this.startContainer !== this.endContainer
					? (this.commonAncestorContainer =
							range.getCommonAncestor(
								this.startContainer,
								this.endContainer
							))
					: (this.commonAncestorContainer =
							this.startContainer);
				this.collapsed =
					this.startContainer === this.endContainer &&
					this.startOffset == this.endOffset;
			},
			setStart: function (e, t) {
				t = parseInt(t);
				if (
					this.startContainer !== e ||
					this.startOffset != t
				) {
					delete this._cachedBookmark;
					this.startContainer = e;
					this.startOffset = t;
					this.endContainer
						? this._updateInternal()
						: this.setEnd(e, t);
				}
			},
			setEnd: function (e, t) {
				t = parseInt(t);
				if (
					this.endContainer !== e ||
					this.endOffset != t
				) {
					delete this._cachedBookmark;
					this.endContainer = e;
					this.endOffset = t;
					this.startContainer
						? this._updateInternal()
						: this.setStart(e, t);
				}
			},
			setStartAfter: function (e, t) {
				this._setPoint("setStart", e, t, 1);
			},
			setStartBefore: function (e, t) {
				this._setPoint("setStart", e, t, 0);
			},
			setEndAfter: function (e, t) {
				this._setPoint("setEnd", e, t, 1);
			},
			setEndBefore: function (e, t) {
				this._setPoint("setEnd", e, t, 0);
			},
			_setPoint: function (e, t, i, o) {
				var a = range.getIndex(t, t.parentNode).o;
				this[e](t.parentNode, a.pop() + o);
			},
			_getIERange: function () {
				var e = (
					this._body ||
					this.endContainer.ownerDocument.body
				).createTextRange();
				o.setRange(
					e,
					this.startContainer,
					this.startOffset,
					this.endContainer,
					this.endOffset,
					this.collapsed
				);
				return e;
			},
			getBookmark: function () {
				this._getIERange();
				return this._cachedBookmark;
			},
			_select: function () {
				this._getIERange().select();
			},
			deleteContents: function () {
				var e = this.startContainer,
					t = this._getIERange();
				3 !== e.nodeType ||
					this.startOffset ||
					this.setStartBefore(e);
				t.pasteHTML("");
				this.endContainer = this.startContainer;
				this.endOffset = this.startOffset;
				this.collapsed = true;
			},
			cloneRange: function () {
				var e = new a([
					this.startContainer,
					this.startOffset,
					this.endContainer,
					this.endOffset,
				]);
				e._body = this._body;
				return e;
			},
			detach: function () {
				this._body = null;
				this.commonAncestorContainer = null;
				this.startContainer = null;
				this.startOffset = 0;
				this.endContainer = null;
				this.endOffset = 0;
				this.collapsed = true;
			},
		}));
i.setObject("dijit.range", range);

declare global {
	namespace DojoJS
	{

		interface Dijit {
			range: typeof range;
		}
	}
}

export = range;