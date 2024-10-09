import has = require("../has");
import _require = require("require");

if ("undefined" != typeof document) {
	var n = document.createElement("div");
	has.add("dom-qsa2.1", !!n.querySelectorAll);
	has.add("dom-qsa3", function () {
		try {
			n.innerHTML = "<p class='TEST'></p>";
			return (
				1 == n.querySelectorAll(".TEST:empty").length
			);
		} catch (e) {
			return false;
		}
	});
}

class Loader {
	private static r: any;
	private static o = "./acme";
	private static i = "./lite";

	load(n: string, a: any, s: Function, u: any) {
		if (u && u.isBuild) s();
		else {
			var c = _require;
			let l: boolean | undefined;
			if ("?" == (n = "css2" == (n = "default" == n ? has("config-selectorEngine") || "css3" : n) || "lite" == n ? Loader.i : "css2.1" == n ? has("dom-qsa2.1") ? Loader.i : Loader.o : "css3" == n ? has("dom-qsa3") ? Loader.i : Loader.o : "acme" == n ? Loader.o : (c = a) && n).charAt(n.length - 1)) {
				n = n.substring(0, n.length - 1);
				l = true;
			}
			if (l && (has("dom-compliant-qsa") || Loader.r)) return s(Loader.r);
			c([n], function (e) {
				"./lite" != n && (Loader.r = e);
				s(e);
			});
		}
	}
}

export = new Loader();