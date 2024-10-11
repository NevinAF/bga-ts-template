
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/dom");
import i = require("dojo/_base/lang");
import n = require("dojo/sniff");
import o = require("dojo/_base/window");
import a = require("dijit/focus");

interface SelectionConstructor {
	new (s: Window): Selection;
	getType(): string;
	getSelectedText(): string;
	getSelectedHtml(): string;
	getSelectedElement(): Element;
	getParentElement(): Element;
	hasAncestorElement(e: string): boolean;
	getAncestorElement(e: string): Element;
	isTag(e: Element, t: string[]): string;
	getParentOfType(e: Element, t: string[]): Element;
	collapse(e: boolean): void;
	remove(): void;
	selectElementChildren(e: string, i: boolean): void;
	selectElement(e: string, i: boolean): void;
	inSelection(e: Element): boolean;
	getBookmark(): { isCollapsed: boolean; mark: any };
	moveToBookmark(t: { isCollapsed: boolean; mark: any }): void;
	isCollapsed(): boolean;
}

var selectionConstructor: SelectionConstructor = function (s) {
		var r = s.document;
		this.getType = function () {
			if (r.getSelection) {
				var e,
					t = "text";
				try {
					e = s.getSelection();
				} catch (n) {}
				if (e && 1 == e.rangeCount) {
					var i = e.getRangeAt(0);
					i.startContainer == i.endContainer &&
						i.endOffset - i.startOffset == 1 &&
						3 != i.startContainer.nodeType &&
						(t = "control");
				}
				return t;
			}
			return r.selection.type.toLowerCase();
		};
		this.getSelectedText = function () {
			if (r.getSelection) {
				var e = s.getSelection();
				return e ? e.toString() : "";
			}
			return "control" == this.getType()
				? null
				: r.selection.createRange().text;
		};
		this.getSelectedHtml = function () {
			if (r.getSelection) {
				var e = s.getSelection();
				if (e && e.rangeCount) {
					var t,
						i = "";
					for (t = 0; t < e.rangeCount; t++) {
						var n = e.getRangeAt(t).cloneContents(),
							o = r.createElement("div");
						o.appendChild(n);
						i += o.innerHTML;
					}
					return i;
				}
				return null;
			}
			return "control" == this.getType()
				? null
				: r.selection.createRange().htmlText;
		};
		this.getSelectedElement = function () {
			if ("control" == this.getType()) {
				if (r.getSelection) {
					var e = s.getSelection();
					return e.anchorNode.childNodes[
						e.anchorOffset
					];
				}
				var t = r.selection.createRange();
				if (t && t.item)
					return r.selection.createRange().item(0);
			}
			return null;
		};
		this.getParentElement = function () {
			if ("control" == this.getType()) {
				var e = this.getSelectedElement();
				if (e) return e.parentNode;
			} else {
				if (!r.getSelection) {
					var t = r.selection.createRange();
					t.collapse(true);
					return t.parentElement();
				}
				var i = r.getSelection();
				if (i) {
					for (
						var n = i.anchorNode;
						n && 1 != n.nodeType;

					)
						n = n.parentNode;
					return n;
				}
			}
			return null;
		};
		this.hasAncestorElement = function (e) {
			return (
				null !=
				this.getAncestorElement.apply(this, arguments)
			);
		};
		this.getAncestorElement = function (e) {
			var t =
				this.getSelectedElement() ||
				this.getParentElement();
			return this.getParentOfType(t, arguments);
		};
		this.isTag = function (e, t) {
			if (e && e.tagName)
				for (
					var i = e.tagName.toLowerCase(), n = 0;
					n < t.length;
					n++
				) {
					var o = String(t[n]).toLowerCase();
					if (i == o) return o;
				}
			return "";
		};
		this.getParentOfType = function (e, t) {
			for (; e; ) {
				if (this.isTag(e, t).length) return e;
				e = e.parentNode;
			}
			return null;
		};
		this.collapse = function (e) {
			if (r.getSelection) {
				var t = s.getSelection();
				t.removeAllRanges
					? e
						? t.collapseToStart()
						: t.collapseToEnd()
					: t.collapse(e);
			} else {
				var i = r.selection.createRange();
				i.collapse(e);
				i.select();
			}
		};
		this.remove = function () {
			var e = r.selection;
			if (r.getSelection) {
				(e = s.getSelection()).deleteFromDocument();
				return e;
			}
			"none" != e.type.toLowerCase() && e.clear();
			return e;
		};
		this.selectElementChildren = function (e, i) {
			var o;
			e = t.byId(e);
			if (r.getSelection) {
				var a = s.getSelection();
				if (n("opera")) {
					(o = a.rangeCount
						? a.getRangeAt(0)
						: r.createRange()).setStart(e, 0);
					o.setEnd(
						e,
						3 == e.nodeType
							? e.length
							: e.childNodes.length
					);
					a.addRange(o);
				} else a.selectAllChildren(e);
			} else {
				(o =
					e.ownerDocument.body.createTextRange()).moveToElementText(
					e
				);
				if (!i)
					try {
						o.select();
					} catch (l) {}
			}
		};
		this.selectElement = function (e, i) {
			var a;
			e = t.byId(e);
			if (r.getSelection) {
				var s = r.getSelection();
				a = r.createRange();
				if (s.removeAllRanges) {
					n("opera") &&
						s.getRangeAt(0) &&
						(a = s.getRangeAt(0));
					a.selectNode(e);
					s.removeAllRanges();
					s.addRange(a);
				}
			} else
				try {
					var l = e.tagName
						? e.tagName.toLowerCase()
						: "";
					(a =
						"img" === l || "table" === l
							? o.body(r).createControlRange()
							: o
									.body(r)
									.createRange()).addElement(
						e
					);
					i || a.select();
				} catch (d) {
					this.selectElementChildren(e, i);
				}
		};
		this.inSelection = function (e) {
			if (e) {
				var t, i;
				if (r.getSelection) {
					var n = s.getSelection();
					n &&
						n.rangeCount > 0 &&
						(i = n.getRangeAt(0));
					if (
						i &&
						i.compareBoundaryPoints &&
						r.createRange
					)
						try {
							(t = r.createRange()).setStart(
								e,
								0
							);
							if (
								1 ===
								i.compareBoundaryPoints(
									i.START_TO_END,
									t
								)
							)
								return true;
						} catch (o) {}
				} else {
					i = r.selection.createRange();
					try {
						(t =
							e.ownerDocument.body.createTextRange()).moveToElementText(
							e
						);
					} catch (a) {}
					if (
						i &&
						t &&
						1 ===
							i.compareEndPoints("EndToStart", t)
					)
						return true;
				}
			}
			return false;
		};
		this.getBookmark = function () {
			var e,
				t,
				i,
				n = r.selection,
				o = a.curNode;
			if (r.getSelection) {
				if ((n = s.getSelection()))
					if (n.isCollapsed) {
						if (
							(i = o ? o.tagName : "") &&
							("textarea" ==
								(i = i.toLowerCase()) ||
								("input" == i &&
									(!o.type ||
										"text" ==
											o.type.toLowerCase())))
						)
							return {
								isCollapsed:
									(n = {
										start: o.selectionStart,
										end: o.selectionEnd,
										node: o,
										pRange: true,
									}).end <= n.start,
								mark: n,
							};
						e = { isCollapsed: true };
						n.rangeCount &&
							(e.mark = n
								.getRangeAt(0)
								.cloneRange());
					} else
						e = {
							isCollapsed: false,
							mark: (t =
								n.getRangeAt(0)).cloneRange(),
						};
			} else if (n) {
				i = (i = o ? o.tagName : "").toLowerCase();
				if (
					o &&
					i &&
					("button" == i ||
						"textarea" == i ||
						"input" == i)
				)
					return n.type &&
						"none" == n.type.toLowerCase()
						? { isCollapsed: true, mark: null }
						: {
								isCollapsed:
									!(t = n.createRange())
										.text || !t.text.length,
								mark: { range: t, pRange: true },
							};
				e = {};
				try {
					t = n.createRange();
					e.isCollapsed = !("Text" == n.type
						? t.htmlText.length
						: t.length);
				} catch (c) {
					e.isCollapsed = true;
					return e;
				}
				if ("CONTROL" == n.type.toUpperCase())
					if (t.length) {
						e.mark = [];
						for (var l = 0, d = t.length; l < d; )
							e.mark.push(t.item(l++));
					} else {
						e.isCollapsed = true;
						e.mark = null;
					}
				else e.mark = t.getBookmark();
			}
			return e;
		};
		this.moveToBookmark = function (t) {
			var n = t.mark;
			if (n)
				if (r.getSelection) {
					var o = s.getSelection();
					if (o && o.removeAllRanges)
						if (n.pRange) {
							var a = n.node;
							a.selectionStart = n.start;
							a.selectionEnd = n.end;
						} else {
							o.removeAllRanges();
							o.addRange(n);
						}
				} else if (r.selection && n) {
					var l;
					if (n.pRange) l = n.range;
					else if (i.isArray(n)) {
						l = r.body.createControlRange();
						e.forEach(n, function (e) {
							l.addElement(e);
						});
					} else
						(l =
							r.body.createTextRange()).moveToBookmark(
							n
						);
					l.select();
				}
		};
		this.isCollapsed = function () {
			return this.getBookmark().isCollapsed;
		};
	},
	selection = new selectionConstructor(window) as InstanceType<SelectionConstructor> & { SelectionManager: SelectionConstructor };
selection.SelectionManager = selectionConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			selection: typeof selection;
		}
	}
}

export = selection;