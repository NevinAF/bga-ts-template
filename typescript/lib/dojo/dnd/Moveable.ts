
// @ts-nocheck

import array = require("../_base/array");
import declare = require("../_base/declare");
import lang = require("../_base/lang");
import dom = require("../dom");
import domClass = require("../dom-class");
import Evented = require("../Evented");
import has = require("../has");
import on = require("../on");
import topic = require("../topic");
import touch = require("../touch");
import common = require("./common");
import Mover = require("./Mover");
import _baseWindow = require("../_base/window");

var p,
	m = function () {};
has("touch-action") &&
	(m = function () {
		"touchAction" in document.body.style
			? (p = "touchAction")
			: "msTouchAction" in document.body.style &&
				(p = "msTouchAction");
		(m = function (e, t) {
			e.style[p] = t;
		})(arguments[0], arguments[1]);
	});

var Moveable = declare("dojo.dnd.Moveable", [Evented], {
	handle: "",
	delay: 0,
	skip: false,
	constructor: function (e, t) {
		this.node = dom.byId(e);
		m(this.node, "none");
		t || (t = {});
		this.handle = t.handle ? dom.byId(t.handle) : null;
		this.handle || (this.handle = this.node);
		this.delay = t.delay > 0 ? t.delay : 0;
		this.skip = t.skip;
		this.mover = t.mover ? t.mover : Mover;
		this.events = [
			on(
				this.handle,
				touch.press,
				lang.hitch(this, "onMouseDown")
			),
			on(
				this.handle,
				"dragstart",
				lang.hitch(this, "onSelectStart")
			),
			on(
				this.handle,
				"selectstart",
				lang.hitch(this, "onSelectStart")
			),
		];
	},
	markupFactory: function (e, t, i) {
		return new i(t, e);
	},
	destroy: function () {
		array.forEach(this.events, function (e) {
			e.remove();
		});
		m(this.node, "");
		this.events = this.node = this.handle = null;
	},
	onMouseDown: function (e) {
		if (!this.skip || !common.isFormElement(e)) {
			if (this.delay) {
				this.events.push(
					on(
						this.handle,
						touch.move,
						lang.hitch(this, "onMouseMove")
					),
					on(
						this.handle.ownerDocument,
						touch.release,
						lang.hitch(this, "onMouseUp")
					)
				);
				this._lastX = e.pageX;
				this._lastY = e.pageY;
			} else this.onDragDetected(e);
			e.stopPropagation();
			e.preventDefault();
		}
	},
	onMouseMove: function (e) {
		if (
			Math.abs(e.pageX - this._lastX) > this.delay ||
			Math.abs(e.pageY - this._lastY) > this.delay
		) {
			this.onMouseUp(e);
			this.onDragDetected(e);
		}
		e.stopPropagation();
		e.preventDefault();
	},
	onMouseUp: function (e) {
		for (var t = 0; t < 2; ++t) this.events.pop().remove();
		e.stopPropagation();
		e.preventDefault();
	},
	onSelectStart: function (e) {
		if (!this.skip || !common.isFormElement(e)) {
			e.stopPropagation();
			e.preventDefault();
		}
	},
	onDragDetected: function (e) {
		new this.mover(this.node, e, this);
	},
	onMoveStart: function (e) {
		topic.publish("/dnd/move/start", e);
		domClass.add(_baseWindow.body(), "dojoMove");
		domClass.add(this.node, "dojoMoveItem");
	},
	onMoveStop: function (e) {
		topic.publish("/dnd/move/stop", e);
		domClass.remove(_baseWindow.body(), "dojoMove");
		domClass.remove(this.node, "dojoMoveItem");
	},
	onFirstMove: function () {},
	onMove: function (e, t) {
		this.onMoving(e, t);
		var i = e.node.style;
		i.left = t.l + "px";
		i.top = t.t + "px";
		this.onMoved(e, t);
	},
	onMoving: function () {},
	onMoved: function () {},
} as DojoJS.dnd.Moveable);

declare global {
	namespace DojoJS {
		interface DojoDND {
			Moveable: typeof Moveable;
		}
		interface Dojo {
			dnd: DojoDND;
		}
	}
}

export = Moveable;