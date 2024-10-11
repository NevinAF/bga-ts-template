// @ts-nocheck

import global = require("../global");
import has = require("../has");
import config = require("./config");
import _require = require("require");
import module = require("module");

var i,
	a,
	s,
	u = {},
	c = {},
	dojo: Partial<DojoJS.Dojo> = { config: config, global: global, dijit: u, dojox: c },
	f = {
		dojo: ["dojo", dojo],
		dijit: ["dijit", u],
		dojox: ["dojox", c],
	},
	d = _require.map && _require.map[module.id.match(/[^\/]+/)[0]];
for (a in d) f[a] ? (f[a][0] = d[a]) : (f[a] = [d[a], {}]);
for (a in f) {
	(s = f[a])[1]._scopeName = s[0];
	config.noGlobals || (global[s[0]] = s[1]);
}
dojo.scopeMap = f;
dojo.baseUrl = dojo.config.baseUrl = _require.baseUrl;
dojo.isAsync = _require.async;
dojo.locale = config.locale;
var p = "$Rev:$".match(/[0-9a-f]{7,}/);
dojo.version = {
	major: 1,
	minor: 15,
	patch: 0,
	flag: "",
	revision: p ? p[0] : NaN,
	toString: function () {
		var e = dojo.version;
		return (
			e.major +
			"." +
			e.minor +
			"." +
			e.patch +
			e.flag +
			" (" +
			e.revision +
			")"
		);
	},
};
has("csp-restrictions") ||
	Function(
		"d",
		"d.eval = function(){return d.global.eval ? d.global.eval(arguments[0]) : eval(arguments[0]);}"
	)(dojo);
dojo.exit = function () {};
has("host-webworker");
has.add("console-as-object", function () {
	return (
		Function.prototype.bind &&
		console &&
		"object" == typeof console.log
	);
});
"undefined" != typeof console || (console = {});
var h,
	g = [
		"assert",
		"count",
		"debug",
		"dir",
		"dirxml",
		"error",
		"group",
		"groupEnd",
		"info",
		"profile",
		"profileEnd",
		"time",
		"timeEnd",
		"trace",
		"warn",
		"log",
	];
i = 0;
for (; (h = g[i++]); )
	console[h]
		? has("console-as-object") &&
			(console[h] = Function.prototype.bind.call(
				console[h],
				console
			))
		: (function () {
				var e = h + "";
				console[e] =
					"log" in console
						? function () {
								var t =
									Array.prototype.slice.call(
										arguments
									);
								t.unshift(e + ":");
								t.join(" ");
							}
						: function () {};
				console[e]._fake = true;
			})();
has.add("dojo-debug-messages", !!config.isDebug);
dojo.deprecated = dojo.experimental = function () {};
if (has("dojo-debug-messages")) {
	dojo.deprecated = function (e, t, n) {
		t && " " + t;
		n && " -- will be removed in version: " + n;
	};
	dojo.experimental = function (e, t) {
		t && " " + t;
	};
}
if (config.modulePaths) {
	dojo.deprecated("dojo.modulePaths", "use paths configuration");
	var m = {};
	for (a in config.modulePaths)
		m[a.replace(/\./g, "/")] = config.modulePaths[a];
	_require({ paths: m });
}
dojo.moduleUrl = function (e, t) {
	dojo.deprecated(
		"dojo.moduleUrl()",
		"use require.toUrl",
		"2.0"
	);
	var n = null;
	e &&
		(n =
			_require
				.toUrl(
					e.replace(/\./g, "/") +
						(t ? "/" + t : "") +
						"/*.*"
				)
				.replace(/\/\*\.\*/, "") + (t ? "" : "/"));
	return n;
};
dojo._hasResource = {};

declare global {
	namespace DojoJS
	{
		interface Dojo {
			config: typeof import("./config");
			global: typeof import("../global");
			dijit: DojoJS.Dijit;
			dojox: DojoxJS.DojoX;

			/**
			 * a map from a name used in a legacy module to the (global variable name, object addressed by that name)
			 * always map dojo, dijit, and dojox
			 */
			scopeMap: {
				[scope: string]: [string, any];
				dojo: [string, Dojo];
				dijit: [string, DojoJS.Dijit];
				dojox: [string, DojoxJS.DojoX];
			};

			baseUrl: string;
			isAsync: boolean;
			locale: string;
			version: {
				major: number;
				minor: number;
				patch: number;
				flag: string;
				revision: number;
				toString(): string;
			};

			/**
			 * A legacy method created for use exclusively by internal Dojo methods. Do not use this method
			 * directly unless you understand its possibly-different implications on the platforms your are targeting.
			 */
			eval(scriptText: string): any;

			exit(exitcode?: number): void;

			/**
			 * Log a debug message to indicate that a behavior has been
			 * deprecated.
			 */
			deprecated(behaviour: string, extra?: string, removal?: string): void;

			/**
			 * Marks code as experimental.
			 */
			experimental(moduleName: string, extra?: string): void;

			/**
			 * Returns a URL relative to a module.
			 */
			moduleUrl(module: string, url?: string): any;

			/**
			 * for backward compatibility with layers built with 1.6 tooling
			 */
			_hasResource: any;

			_scopeName: "dojo"; // TODO: Defining modules seems to automatically add the "_scopeName" property to the module.
		}
	}

	namespace DijitJS
	{
		interface Dijit {}
	}

	namespace DojoxJS
	{
		interface DojoX {}
	}
}

export = dojo as DojoJS.Dojo;