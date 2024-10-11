// @ts-nocheck

import e = require("../_base/declare");
import t = require("./Moveable");

var i = t.prototype.onMove;
var TimedMoveable = e("dojo.dnd.TimedMoveable", t, {
	timeout: 40,
	constructor: function (e, t) {
		t || (t = {});
		t.timeout &&
			"number" == typeof t.timeout &&
			t.timeout >= 0 &&
			(this.timeout = t.timeout);
	},
	onMoveStop: function (e) {
		if (e._timer) {
			clearTimeout(e._timer);
			i.call(this, e, e._leftTop);
		}
		t.prototype.onMoveStop.apply(this, arguments);
	},
	onMove: function (e, t) {
		e._leftTop = t;
		if (!e._timer) {
			var n = this;
			e._timer = setTimeout(function () {
				e._timer = null;
				i.call(n, e, e._leftTop);
			}, this.timeout);
		}
	},
} as DojoJS.dnd.TimedMoveable);

declare global {
	namespace DojoJS {
		interface DojoDND {
			TimedMoveable: typeof TimedMoveable;
		}
		interface Dojo {
			dnd: DojoDND;
		}
	}
}

export = TimedMoveable;