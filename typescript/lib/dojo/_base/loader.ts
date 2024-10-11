// @ts-nocheck

import dojo = require("./kernel");
import has = require("../has");
import _require = require("require");
import thisModule = require("module");
import json = require("../json");
import lang = require("./lang");
import array = require("./array");

var makeErrorToken = function (e) {
		return { src: thisModule.id, id: e };
	},
	slashName = function (e) {
		return e.replace(/\./g, "/");
	},
	buildDetectRe = /\/\/>>built/,
	dojoRequireCallbacks = [],
	dojoRequireModuleStack = [],
	dojoRequirePlugin = function (e, t, n) {
		dojoRequireCallbacks.push(n);
		array.forEach(e.split(","), function (e) {
			var n = getModule(e, t.module);
			dojoRequireModuleStack.push(n);
			injectModule(n);
		});
		checkDojoRequirePlugin();
	},
	checkDojoRequirePlugin = function () {
		var e, t;
		for (t in modules) {
			undefined === (e = modules[t]).noReqPluginCheck &&
				(e.noReqPluginCheck =
					/loadInit\!/.test(t) || /require\!/.test(t)
						? 1
						: 0);
			if (
				!e.executed &&
				!e.noReqPluginCheck &&
				e.injected == requested
			)
				return;
		}
		guardCheckComplete(function () {
			var e = dojoRequireCallbacks;
			dojoRequireCallbacks = [];
			array.forEach(e, function (e) {
				e(1);
			});
		});
	},
	dojoLoadInitPlugin = function (mid, require, loaded) {
		_require([mid], function (bundle) {
			_require(bundle.names, function () {
				for (
					var scopeText = "", args = [], i = 0;
					i < arguments.length;
					i++
				) {
					scopeText +=
						"var " +
						bundle.names[i] +
						"= arguments[" +
						i +
						"]; ";
					args.push(arguments[i]);
				}
				eval(scopeText);
				var callingModule = require.module,
					requireList = [],
					i18nDeps,
					syncLoaderApi = {
						provide: function (e) {
							e = slashName(e);
							var t = getModule(e, callingModule);
							t !== callingModule &&
								setArrived(t);
						},
						require: function (e, t) {
							e = slashName(e);
							t &&
								(getModule(
									e,
									callingModule
								).result = nonmodule);
							requireList.push(e);
						},
						requireLocalization: function (
							e,
							t,
							n
						) {
							i18nDeps ||
								(i18nDeps = ["dojo/i18n"]);
							n = (
								n || dojo.locale
							).toLowerCase();
							e =
								slashName(e) +
								"/nls/" +
								(/root/i.test(n)
									? ""
									: n + "/") +
								slashName(t);
							getModule(e, callingModule).isXd &&
								i18nDeps.push("dojo/i18n!" + e);
						},
						loadInit: function (e) {
							e();
						},
					},
					hold = {},
					p;
				try {
					for (p in syncLoaderApi) {
						hold[p] = dojo[p];
						dojo[p] = syncLoaderApi[p];
					}
					bundle.def.apply(null, args);
				} catch (e) {
					signal("error", [
						makeErrorToken("failedDojoLoadInit"),
						e,
					]);
				} finally {
					for (p in syncLoaderApi) dojo[p] = hold[p];
				}
				i18nDeps &&
					(requireList =
						requireList.concat(i18nDeps));
				requireList.length
					? dojoRequirePlugin(
							requireList.join(","),
							require,
							loaded
						)
					: loaded();
			});
		});
	},
	extractApplication = function (e, t, n) {
		var r,
			o = /\(|\)/g,
			i = 1;
		o.lastIndex = t;
		for (; (r = o.exec(e)); ) {
			")" == r[0] ? (i -= 1) : (i += 1);
			if (0 == i) break;
		}
		if (0 != i)
			throw (
				"unmatched paren around character " +
				o.lastIndex +
				" in: " +
				e
			);
		return [
			dojo.trim(e.substring(n, o.lastIndex)) + ";\n",
			o.lastIndex,
		];
	},
	removeCommentRe =
		/\/\/.*|\/\*[\s\S]*?\*\/|("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`)/gm,
	syncLoaderApiRe =
		/(^|\s)dojo\.(loadInit|require|provide|requireLocalization|requireIf|requireAfterIf|platformRequire)\s*\(/gm,
	amdLoaderApiRe = /(^|\s)(require|define)\s*\(/m,
	extractLegacyApiApplications = function (e, t) {
		var n,
			r,
			o,
			i,
			a = [],
			s = [],
			u = [];
		t = t || e.replace(removeCommentRe, "$1");
		for (; (n = syncLoaderApiRe.exec(t)); ) {
			o = (r = syncLoaderApiRe.lastIndex) - n[0].length;
			i = extractApplication(t, r, o);
			"loadInit" == n[2] ? a.push(i[0]) : s.push(i[0]);
			syncLoaderApiRe.lastIndex = i[1];
		}
		return (u = a.concat(s)).length ||
			!amdLoaderApiRe.test(t)
			? [
					e.replace(
						/(^|\s)dojo\.loadInit\s*\(/g,
						"\n0 && dojo.loadInit("
					),
					u.join(""),
					u,
				]
			: 0;
	},
	transformToAmd = function (e, t) {
		var n,
			r,
			o = [],
			i = [];
		if (
			buildDetectRe.test(t) ||
			!(n = extractLegacyApiApplications(t))
		)
			return 0;
		r = e.mid + "-*loadInit";
		for (var a in getModule("dojo", e).result.scopeMap) {
			o.push(a);
			i.push('"' + a + '"');
		}
		return (
			"// xdomain rewrite of " +
			e.mid +
			"\ndefine('" +
			r +
			"',{\n\tnames:" +
			json.stringify(o) +
			",\n\tdef:function(" +
			o.join(",") +
			"){" +
			n[1] +
			"}});\n\ndefine(" +
			json.stringify(o.concat(["dojo/loadInit!" + r])) +
			", function(" +
			o.join(",") +
			"){\n" +
			n[0] +
			"});"
		);
	},
	loaderVars = require.initSyncLoader(
		dojoRequirePlugin,
		checkDojoRequirePlugin,
		transformToAmd
	),
	sync = loaderVars.sync,
	requested = loaderVars.requested,
	arrived = loaderVars.arrived,
	nonmodule = loaderVars.nonmodule,
	executing = loaderVars.executing,
	executed = loaderVars.executed,
	syncExecStack = loaderVars.syncExecStack,
	modules = loaderVars.modules,
	execQ = loaderVars.execQ,
	getModule = loaderVars.getModule,
	injectModule = loaderVars.injectModule,
	setArrived = loaderVars.setArrived,
	signal = loaderVars.signal,
	finishExec = loaderVars.finishExec,
	execModule = loaderVars.execModule,
	getLegacyMode = loaderVars.getLegacyMode,
	guardCheckComplete = loaderVars.guardCheckComplete,
	touched,
	traverse;
dojoRequirePlugin = loaderVars.dojoRequirePlugin;
dojo.provide = function (e) {
	var t = syncExecStack[0],
		n = lang.mixin(
			getModule(slashName(e), require.module),
			{
				executed: executing,
				result: lang.getObject(e, true),
			}
		);
	setArrived(n);
	t &&
		(t.provides || (t.provides = [])).push(function () {
			n.result = lang.getObject(e);
			delete n.provides;
			n.executed !== executed && finishExec(n);
		});
	return n.result;
};
has.add("config-publishRequireResult", 1, 0, 0);
dojo.require = function (e, t) {
	var n = (function (e, t) {
		var n = getModule(slashName(e), require.module);
		if (syncExecStack.length && syncExecStack[0].finish)
			syncExecStack[0].finish.push(e);
		else {
			if (n.executed) return n.result;
			t && (n.result = nonmodule);
			var r = getLegacyMode();
			injectModule(n);
			r = getLegacyMode();
			n.executed !== executed &&
				n.injected === arrived &&
				loaderVars.guardCheckComplete(function () {
					execModule(n);
				});
			if (n.executed) return n.result;
			r == sync
				? n.cjs
					? execQ.unshift(n)
					: syncExecStack.length &&
						(syncExecStack[0].finish = [e])
				: execQ.push(n);
		}
	})(e, t);
	has("config-publishRequireResult") &&
		!lang.exists(e) &&
		undefined !== n &&
		lang.setObject(e, n);
	return n;
};
dojo.loadInit = function (e) {
	e();
};
dojo.registerModulePath = function (e, t) {
	var n = {};
	n[e.replace(/\./g, "/")] = t;
	_require({ paths: n });
};
dojo.platformRequire = function (e) {
	for (
		var t,
			n = (e.common || []).concat(
				e[dojo._name] || e.default || []
			);
		n.length;

	)
		lang.isArray((t = n.shift()))
			? dojo.require.apply(dojo, t)
			: dojo.require(t);
};
dojo.requireIf = dojo.requireAfterIf = function (e, t, n) {
	e && dojo.require(t, n);
};
dojo.requireLocalization = function (e, t, n) {
	_require(["../i18n"], function (r) {
		r.getLocalization(e, t, n);
	});
};

declare global {
	namespace DojoJS
	{
		interface Dojo {
			provide(moduleName: string): any;
			require(e: string, t?: boolean): any;
			loadInit(e: () => void): void;
			registerModulePath(path: string, obj: any): void;
			platformRequire(e: { common?: string[], default?: string[] } & Record<string, string[]>): void;
			requireIf(condition: boolean, mid: string, require: any): void;
			requireAfterIf(condition: boolean, mid: string, require: any): void;
			requireLocalization(moduleName: string, bundleName: string, locale?: string): any
		}
	}
}

export = {
	extractLegacyApiApplications: extractLegacyApiApplications,
	require: dojoRequirePlugin,
	loadInit: dojoLoadInitPlugin,
} as {
	extractLegacyApiApplications(text: string, noCommentText?: string): any;
	require(mid: string, require: any, loaded: (...modules: any[]) => void): void;
	loadInit(mid: string, require: any, loaded: (...modules: any[]) => void): void;
}