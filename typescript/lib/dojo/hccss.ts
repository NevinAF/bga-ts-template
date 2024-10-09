// @ts-nocheck

import e = require("require");
import t = require("./_base/config");
import i = require("./dom-class");
import n = require("./dom-style");
import has = require("./has");
import a = require("./domReady");
import s = require("./_base/window");

has.add("highcontrast", function () {
	var i = s.doc.createElement("div");
	try {
		i.style.cssText =
			'border: 1px solid; border-color:red green; position: absolute; height: 5px; top: -999px;background-image: url("' +
			(t.blankGif || e.toUrl("./resources/blank.gif")) +
			'");';
		s.body().appendChild(i);
		var a = n.getComputedStyle(i),
			r = a.backgroundImage;
		return (
			a.borderTopColor == a.borderRightColor ||
			(r && ("none" == r || "url(invalid-url:)" == r))
		);
	} catch (l) {
		l.toString();
		return false;
	} finally {
		has("ie") <= 8
			? (i.outerHTML = "")
			: s.body().removeChild(i);
	}
});
a(function () {
	has("highcontrast") && i.add(s.body(), "dj_a11y");
});

declare global {
	namespace DojoJS
	{
		interface Has {
			(name: 'highcontrast'): void | boolean;
		}
	}
}

export = has;