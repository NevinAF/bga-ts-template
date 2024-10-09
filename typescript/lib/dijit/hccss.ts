import e = require("dojo/dom-class");
import has = require("dojo/hccss");
import i = require("dojo/domReady");
import n = require("dojo/_base/window");

i(function () {
	has("highcontrast") && e.add(n.body(), "dijit_a11y");
});

export = has;