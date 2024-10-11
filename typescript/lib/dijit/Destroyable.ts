
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/aspect");
import i = require("dojo/_base/declare");

var Destroyable = i("dijit.Destroyable", null, {
	destroy: function (e) {
		this._destroyed = true;
	},
	own: function () {
		var i = ["destroyRecursive", "destroy", "remove"];
		e.forEach(
			arguments,
			function (n) {
				var o,
					a = t.before(this, "destroy", function (e) {
						n[o](e);
					}),
					s = [];
				function r() {
					a.remove();
					e.forEach(s, function (e) {
						e.remove();
					});
				}
				if (n.then) {
					o = "cancel";
					n.then(r, r);
				} else
					e.forEach(i, function (e) {
						if ("function" == typeof n[e]) {
							o || (o = e);
							s.push(t.after(n, e, r, true));
						}
					});
			},
			this
		);
		return arguments;
	},
});

declare global {
	namespace DojoJS
	{
		interface Dijit {
			Destroyable: typeof Destroyable;
		}
	}
}

export = Destroyable;