
// @ts-nocheck

import e = require("dojo/keys");
import t = require("dojo/mouse");
import i = require("dojo/on");
import n = require("dojo/touch");

function o(t) {
	if (
		(t.keyCode === e.ENTER || t.keyCode === e.SPACE) &&
		!/input|button|textarea/i.test(t.target.nodeName)
	)
		for (var i = t.target; i; i = i.parentNode)
			if (i.dojoClick) return true;
}
var a;
i(document, "keydown", function (e) {
	if (o(e)) {
		a = e.target;
		e.preventDefault();
	} else a = null;
});
i(document, "keyup", function (e) {
	if (o(e) && e.target == a) {
		a = null;
		i.emit(e.target, "click", {
			cancelable: true,
			bubbles: true,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
			metaKey: e.metaKey,
			altKey: e.altKey,
			_origType: e.type,
		});
	}
});
var a11yclick: DijitJS.A11yClick = function (e, t) {
	e.dojoClick = true;
	return i(e, "click", t);
};
a11yclick.click = a11yclick;
a11yclick.press = function (o, a) {
	var s = i(o, n.press, function (e) {
			("mousedown" != e.type || t.isLeft(e)) && a(e);
		}),
		r = i(o, "keydown", function (t) {
			(t.keyCode !== e.ENTER && t.keyCode !== e.SPACE) ||
				a(t);
		});
	return {
		remove: function () {
			s.remove();
			r.remove();
		},
	};
};
a11yclick.release = function (o, a) {
	var s = i(o, n.release, function (e) {
			("mouseup" != e.type || t.isLeft(e)) && a(e);
		}),
		r = i(o, "keyup", function (t) {
			(t.keyCode !== e.ENTER && t.keyCode !== e.SPACE) ||
				a(t);
		});
	return {
		remove: function () {
			s.remove();
			r.remove();
		},
	};
};
a11yclick.move = n.move;

export = a11yclick;