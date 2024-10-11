// @ts-nocheck

import e = require("./sniff");
import t = require("./_base/window");
import n = require("./dom");
import r = require("./dom-style");

var o: Partial<DojoJS.DomGeometry> = { boxModel: "content-box" };

e("ie") &&
	(o.boxModel =
		"BackCompat" == document.compatMode
			? "border-box"
			: "content-box");
o.getPadExtents = function (e, t) {
	e = n.byId(e);
	var o = t || r.getComputedStyle(e),
		i = r.toPixelValue,
		a = i(e, o.paddingLeft),
		s = i(e, o.paddingTop),
		u = i(e, o.paddingRight),
		c = i(e, o.paddingBottom);
	return { l: a, t: s, r: u, b: c, w: a + u, h: s + c };
};
var i = "none";
o.getBorderExtents = function (e, t) {
	e = n.byId(e);
	var o = r.toPixelValue,
		a = t || r.getComputedStyle(e),
		s =
			a.borderLeftStyle != i
				? o(e, a.borderLeftWidth)
				: 0,
		u = a.borderTopStyle != i ? o(e, a.borderTopWidth) : 0,
		c =
			a.borderRightStyle != i
				? o(e, a.borderRightWidth)
				: 0,
		l =
			a.borderBottomStyle != i
				? o(e, a.borderBottomWidth)
				: 0;
	return { l: s, t: u, r: c, b: l, w: s + c, h: u + l };
};
o.getPadBorderExtents = function (e, t) {
	e = n.byId(e);
	var i = t || r.getComputedStyle(e),
		a = o.getPadExtents(e, i),
		s = o.getBorderExtents(e, i);
	return {
		l: a.l + s.l,
		t: a.t + s.t,
		r: a.r + s.r,
		b: a.b + s.b,
		w: a.w + s.w,
		h: a.h + s.h,
	};
};
o.getMarginExtents = function (e, t) {
	e = n.byId(e);
	var o = t || r.getComputedStyle(e),
		i = r.toPixelValue,
		a = i(e, o.marginLeft),
		s = i(e, o.marginTop),
		u = i(e, o.marginRight),
		c = i(e, o.marginBottom);
	return { l: a, t: s, r: u, b: c, w: a + u, h: s + c };
};
o.getMarginBox = function (t, a) {
	t = n.byId(t);
	var s,
		u = a || r.getComputedStyle(t),
		c = o.getMarginExtents(t, u),
		l = t.offsetLeft - c.l,
		f = t.offsetTop - c.t,
		d = t.parentNode,
		p = r.toPixelValue;
	if (8 == e("ie") && !e("quirks") && d) {
		l -=
			(s = r.getComputedStyle(d)).borderLeftStyle != i
				? p(t, s.borderLeftWidth)
				: 0;
		f -= s.borderTopStyle != i ? p(t, s.borderTopWidth) : 0;
	}
	return {
		l: l,
		t: f,
		w: t.offsetWidth + c.w,
		h: t.offsetHeight + c.h,
	};
};
o.getContentBox = function (t, a) {
	t = n.byId(t);
	var s,
		u = a || r.getComputedStyle(t),
		c = t.clientWidth,
		l = o.getPadExtents(t, u),
		f = o.getBorderExtents(t, u),
		d = t.offsetLeft + l.l + f.l,
		p = t.offsetTop + l.t + f.t;
	if (c) s = t.clientHeight;
	else {
		c = t.offsetWidth - f.w;
		s = t.offsetHeight - f.h;
	}
	if (8 == e("ie") && !e("quirks")) {
		var h,
			g = t.parentNode,
			m = r.toPixelValue;
		if (g) {
			d -=
				(h = r.getComputedStyle(g)).borderLeftStyle != i
					? m(t, h.borderLeftWidth)
					: 0;
			p -=
				h.borderTopStyle != i
					? m(t, h.borderTopWidth)
					: 0;
		}
	}
	return { l: d, t: p, w: c - l.w, h: s - l.h };
};
function a(e, t, n, r, o, i) {
	i = i || "px";
	var a = e.style;
	isNaN(t) || (a.left = t + i);
	isNaN(n) || (a.top = n + i);
	r >= 0 && (a.width = r + i);
	o >= 0 && (a.height = o + i);
}
function s(e) {
	return (
		"button" == e.tagName.toLowerCase() ||
		("input" == e.tagName.toLowerCase() &&
			"button" ==
				(e.getAttribute("type") || "").toLowerCase())
	);
}
function u(e) {
	return (
		"border-box" == o.boxModel ||
		"table" == e.tagName.toLowerCase() ||
		s(e)
	);
}
o.setContentSize = function (e, t, r) {
	e = n.byId(e);
	var i = t.w,
		s = t.h;
	if (u(e)) {
		var c = o.getPadBorderExtents(e, r);
		i >= 0 && (i += c.w);
		s >= 0 && (s += c.h);
	}
	a(e, NaN, NaN, i, s);
};
var c = { l: 0, t: 0, w: 0, h: 0 };
o.setMarginBox = function (t, i, l) {
	t = n.byId(t);
	var f = l || r.getComputedStyle(t),
		d = i.w,
		p = i.h,
		h = u(t) ? c : o.getPadBorderExtents(t, f),
		g = o.getMarginExtents(t, f);
	if (e("webkit") && s(t)) {
		var m = t.style;
		d >= 0 && !m.width && (m.width = "4px");
		p >= 0 && !m.height && (m.height = "4px");
	}
	d >= 0 && (d = Math.max(d - h.w - g.w, 0));
	p >= 0 && (p = Math.max(p - h.h - g.h, 0));
	a(t, i.l, i.t, d, p);
};
o.isBodyLtr = function (e) {
	e = e || t.doc;
	return (
		"ltr" ==
		(
			t.body(e).dir ||
			e.documentElement.dir ||
			"ltr"
		).toLowerCase()
	);
};
o.docScroll = function (n) {
	n = n || t.doc;
	var r = t.doc.parentWindow || t.doc.defaultView;
	return "pageXOffset" in r
		? { x: r.pageXOffset, y: r.pageYOffset }
		: (r = e("quirks") ? t.body(n) : n.documentElement) && {
				x: o.fixIeBiDiScrollLeft(r.scrollLeft || 0, n),
				y: r.scrollTop || 0,
			};
};
o.getIeDocumentElementOffset = function (e) {
	return { x: 0, y: 0 };
};
o.fixIeBiDiScrollLeft = function (n, r) {
	r = r || t.doc;
	var i = e("ie");
	if (i && !o.isBodyLtr(r)) {
		var a = e("quirks"),
			s = a ? t.body(r) : r.documentElement,
			u = t.global;
		6 == i &&
			!a &&
			u.frameElement &&
			s.scrollHeight > s.clientHeight &&
			(n += s.clientLeft);
		return i < 8 || a
			? n + s.clientWidth - s.scrollWidth
			: -n;
	}
	return n;
};
o.position = function (r, i) {
	r = n.byId(r);
	var a = t.body(r.ownerDocument),
		s = r.getBoundingClientRect();
	s = {
		x: s.left,
		y: s.top,
		w: s.right - s.left,
		h: s.bottom - s.top,
	};
	if (e("ie") < 9) {
		s.x -= e("quirks") ? a.clientLeft + a.offsetLeft : 0;
		s.y -= e("quirks") ? a.clientTop + a.offsetTop : 0;
	}
	if (i) {
		var u = o.docScroll(r.ownerDocument);
		s.x += u.x;
		s.y += u.y;
	}
	return s;
};
o.getMarginSize = function (e, t) {
	e = n.byId(e);
	var i = o.getMarginExtents(e, t || r.getComputedStyle(e)),
		a = e.getBoundingClientRect();
	return {
		w: a.right - a.left + i.w,
		h: a.bottom - a.top + i.h,
	};
};
o.normalizeEvent = function (t) {
	if (!("layerX" in t)) {
		t.layerX = t.offsetX;
		t.layerY = t.offsetY;
	}
	if (!("pageX" in t)) {
		var n = t.target,
			r = (n && n.ownerDocument) || document,
			i = e("quirks") ? r.body : r.documentElement;
		t.pageX =
			t.clientX +
			o.fixIeBiDiScrollLeft(i.scrollLeft || 0, r);
		t.pageY = t.clientY + (i.scrollTop || 0);
	}
};

declare global {
	namespace DojoJS
	{
		interface DomGeometryWidthHeight {
			w?: number;
			h?: number;
		}
	
		interface DomGeometryBox extends DomGeometryWidthHeight {
			l?: number;
			t?: number;
		}
	
		interface DomGeometryBoxExtents extends DomGeometryBox {
			r?: number;
			b?: number;
		}
	
		interface Point {
			x: number;
			y: number;
		}
	
		interface DomGeometryXYBox extends DomGeometryWidthHeight, Point {
		}
	
		interface DomGeometry {
			boxModel: 'border-box' | 'content-box';
	
			/**
			 * Returns object with special values specifically useful for node
			 * fitting.
			 */
			getPadExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
	
			/**
			 * returns an object with properties useful for noting the border
			 * dimensions.
			 */
			getBorderExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
	
			/**
			 * Returns object with properties useful for box fitting with
			 * regards to padding.
			 */
			getPadBorderExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
	
			/**
			 * returns object with properties useful for box fitting with
			 * regards to box margins (i.e., the outer-box).
			 * - l/t = marginLeft, marginTop, respectively
			 * - w = total width, margin inclusive
			 * - h = total height, margin inclusive
			 * The w/h are used for calculating boxes.
			 * Normally application code will not need to invoke this
			 * directly, and will use the ...box... functions instead.
			 */
			getMarginExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
	
			/**
			 * returns an object that encodes the width, height, left and top
			 * positions of the node's margin box.
			 */
			getMarginBox(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBox | throws<TypeError>;
	
			/**
			 * Returns an object that encodes the width, height, left and top
			 * positions of the node's content box, irrespective of the
			 * current box model.
			 */
			getContentBox(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBox | throws<TypeError>;
	
			/**
			 * Sets the size of the node's contents, irrespective of margins,
			 * padding, or borders.
			 */
			setContentSize(node: Element | string, box: DomGeometryWidthHeight, computedStyle?: CSSStyleDeclaration): void | throws<TypeError>;
	
			/**
			 * sets the size of the node's margin box and placement
			 * (left/top), irrespective of box model. Think of it as a
			 * passthrough to setBox that handles box-model vagaries for
			 * you.
			 */
			setMarginBox(node: Element | string, box: DomGeometryBox, computedStyle?: CSSStyleDeclaration): void | throws<TypeError>;
	
			/**
			 * Returns true if the current language is left-to-right, and false otherwise.
			 */
			isBodyLtr(doc?: Document): boolean;
	
			/**
			 * Returns an object with {node, x, y} with corresponding offsets.
			 */
			docScroll(doc?: Document): Point;
	
			/**
			 * Deprecated method previously used for IE6-IE7.  Now, just returns `{x:0, y:0}`.
			 */
			getIeDocumentElementOffset(doc: Document): Point;
	
			/**
			 * In RTL direction, scrollLeft should be a negative value, but IE
			 * returns a positive one. All codes using documentElement.scrollLeft
			 * must call this function to fix this error, otherwise the position
			 * will offset to right when there is a horizontal scrollbar.
			 */
			fixIeBiDiScrollLeft(scrollLeft: number, doc?: Document): number;
	
			/**
			 * Gets the position and size of the passed element relative to
			 * the viewport (if includeScroll==false), or relative to the
			 * document root (if includeScroll==true).
			 */
			position(node: Element | string, includeScroll?: boolean): DomGeometryXYBox | throws<TypeError>;
	
			/**
			 * returns an object that encodes the width and height of
			 * the node's margin box
			 */
			getMarginSize(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryWidthHeight | throws<TypeError>;
	
			/**
			 * Normalizes the geometry of a DOM event, normalizing the pageX, pageY,
			 * offsetX, offsetY, layerX, and layerX properties
			 */
			normalizeEvent(event: Event | string): void | throws<TypeError>;
		}
	}
}

export = o as DojoJS.DomGeometry;