import e = require("./_base/kernel");
import t = require("./has");
import _require = require("require");
import r = require("./sniff");
import o = require("./_base/lang");
import i = require("./_base/array");
import config = require("./_base/config");
import s = require("./ready");
import "./_base/declare";
import "./_base/connect";
import "./_base/Deferred";
import "./_base/json";
import "./_base/Color";
// import "./has!dojo-firebug?./_firebug/firebug"; // TODO: Fix the weird imports
import "./_base/browser";
import "./_base/loader";

config.isDebug && _require(["./_firebug/firebug"]);
var configRequire = config.require;
if (configRequire) {
	configRequire = i.map(o.isArray(configRequire) ? configRequire : [configRequire], function (e) {
		return e.replace(/\./g, "/");
	});
	e.isAsync
		? _require(configRequire)
		: s(1, function () {
				_require(configRequire);
			});
}

export = config;