/// <reference path="index.d.ts" />

// @ts-nocheck

import array = require("dojo/_base/array");
import declare = require("dojo/_base/declare");
import lang = require("dojo/_base/lang");
import has = require("dojo/sniff");
import _baseWindow = require("dojo/_base/window");
import dom = require("dojo/dom");
import domGeo = require("dojo/dom-geometry");
import domStyle = require("dojo/dom-style");
import Evented = require("dojo/Evented");
import on = require("dojo/on");
import touch = require("dojo/touch");
import common = require("./common");
import autoscroll = require("./autoscroll");

var Mover = declare("dojo.dnd.Mover", [Evented], {
	constructor: function (e, t, n) {
		this.node = dom.byId(e);
		this.marginBox = { l: t.pageX, t: t.pageY };
		this.mouseButton = t.button;
		var o = (this.host = n),
			s = e.ownerDocument;
		function r(e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.events = [
			on(s, touch.move, lang.hitch(this, "onFirstMove")),
			on(s, touch.move, lang.hitch(this, "onMouseMove")),
			on(s, touch.release, lang.hitch(this, "onMouseUp")),
			on(s, "dragstart", r),
			on(s.body, "selectstart", r),
		];
		autoscroll.autoScrollStart(s);
		o && o.onMoveStart && o.onMoveStart(this);
	},
	onMouseMove: function (e) {
		autoscroll.autoScroll(e);
		var t = this.marginBox;
		this.host.onMove(
			this,
			{ l: t.l + e.pageX, t: t.t + e.pageY },
			e
		);
		e.preventDefault();
		e.stopPropagation();
	},
	onMouseUp: function (e) {
		(has("webkit") && has("mac") && 2 == this.mouseButton
			? 0 == e.button
			: this.mouseButton == e.button) && this.destroy();
		e.preventDefault();
		e.stopPropagation();
	},
	onFirstMove: function (e) {
		var t,
			i,
			n = this.node.style,
			a = this.host;
		switch (n.position) {
			case "relative":
			case "absolute":
				t = Math.round(parseFloat(n.left)) || 0;
				i = Math.round(parseFloat(n.top)) || 0;
				break;
			default:
				n.position = "absolute";
				var l = domGeo.getMarginBox(this.node),
					d = _baseWindow.doc.body,
					c = domStyle.getComputedStyle(d),
					h = domGeo.getMarginBox(d, c),
					u = domGeo.getContentBox(d, c);
				t = l.l - (u.l - h.l);
				i = l.t - (u.t - h.t);
		}
		this.marginBox.l = t - this.marginBox.l;
		this.marginBox.t = i - this.marginBox.t;
		a && a.onFirstMove && a.onFirstMove(this, e);
		this.events.shift().remove();
	},
	destroy: function () {
		array.forEach(this.events, function (e) {
			e.remove();
		});
		var t = this.host;
		t && t.onMoveStop && t.onMoveStop(this);
		this.events = this.node = this.host = null;
	},
} as DojoJS.dnd.Mover);

declare global {
	namespace DojoJS {
		interface DojoDND {
			Mover: typeof Mover;
		}
		interface Dojo {
			dnd: DojoDND;
		}
	}
}

export = Mover;