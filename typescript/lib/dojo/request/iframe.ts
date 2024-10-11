// @ts-nocheck

import e = require("module");
import t = require("require");
import i = require("./watch");
import n = require("./util");
import o = require("./handlers");
import a = require("../_base/lang");
import s = require("../io-query");
import r = require("../query");
import l = require("../has");
import d = require("../dom");
import c = require("../dom-construct");
import h = require("../_base/window");
import "../NodeList-dom";
import "../NodeList-manipulate";

var u = e.id.replace(/[\/\.\-]/g, "_"),
	p = u + "_onload";
h.global[p] ||
	(h.global[p] = function () {
		var e = iframe._currentDfd;
		if (e) {
			var t = e.response.options,
				i = d.byId(t.form) || e._tmpForm;
			if (i) {
				for (
					var n = e._contentToClean, o = 0;
					o < n.length;
					o++
				)
					for (
						var a = n[o], s = 0;
						s < i.childNodes.length;
						s++
					) {
						var r = i.childNodes[s];
						if (r.name === a) {
							c.destroy(r);
							break;
						}
					}
				e._originalAction &&
					i.setAttribute("action", e._originalAction);
				if (e._originalMethod) {
					i.setAttribute("method", e._originalMethod);
					i.method = e._originalMethod;
				}
				if (e._originalTarget) {
					i.setAttribute("target", e._originalTarget);
					i.target = e._originalTarget;
				}
			}
			if (e._tmpForm) {
				c.destroy(e._tmpForm);
				delete e._tmpForm;
			}
			e._finished = true;
		} else iframe._fireNextRequest();
	});
function m(e) {
	return !this.isFulfilled();
}
function g(e) {
	return !!this._finished;
}
function f(e, t) {
	if (!t)
		try {
			var i = e.options,
				n = iframe.doc(iframe._frame),
				s = i.handleAs;
			if ("html" !== s) {
				if ("xml" === s)
					if (
						"html" ===
						n.documentElement.tagName.toLowerCase()
					) {
						r("a", n.documentElement).orphan();
						var l =
							n.documentElement.innerText ||
							n.documentElement.textContent;
						l = l.replace(/>\s+</g, "><");
						e.text = a.trim(l);
					} else e.data = n;
				else
					e.text =
						n.getElementsByTagName(
							"textarea"
						)[0].value;
				o(e);
			} else e.data = n;
		} catch (d) {
			t = d;
		}
	t
		? this.reject(t)
		: this._finished
		? this.resolve(e)
		: this.reject(
				new Error(
					"Invalid dojo/request/iframe request state"
				)
			);
}
function _(e) {
	this._callNext();
}
var v = { method: "POST" };
function iframe(e, t, o) {
	var a = n.parseArgs(e, n.deepCreate(v, t), true);
	e = a.url;
	if ("GET" !== (t = a.options).method && "POST" !== t.method)
		throw new Error(
			t.method + " not supported by dojo/request/iframe"
		);
	iframe._frame || (iframe._frame = iframe.create(iframe._iframeName, p + "();"));
	var s = n.deferred(a, null, m, g, f, _);
	s._callNext = function () {
		if (!this._calledNext) {
			this._calledNext = true;
			iframe._currentDfd = null;
			iframe._fireNextRequest();
		}
	};
	s._legacy = o;
	iframe._dfdQueue.push(s);
	iframe._fireNextRequest();
	i(s);
	return o ? s : s.promise;
}
iframe.create = function (e, i, n) {
	if (h.global[e]) return h.global[e];
	if (h.global.frames[e]) return h.global.frames[e];
	if (!n) {
		l("config-useXDomain") && l("config-dojoBlankHtmlUrl");
		n =
			l("config-dojoBlankHtmlUrl") ||
			t.toUrl("dojo/resources/blank.html");
	}
	var o = c.place(
		'<iframe id="' +
			e +
			'" name="' +
			e +
			'" src="' +
			n +
			'" onload="' +
			i +
			'" style="position: absolute; left: 1px; top: 1px; height: 1px; width: 1px; visibility: hidden">',
		h.body()
	);
	h.global[e] = o;
	return o;
};
iframe.doc = function (e) {
	if (e.contentDocument) return e.contentDocument;
	var t = e.name;
	if (t) {
		var i = h.doc.getElementsByTagName("iframe");
		if (
			e.document &&
			i[t].contentWindow &&
			i[t].contentWindow.document
		)
			return i[t].contentWindow.document;
		if (h.doc.frames[t] && h.doc.frames[t].document)
			return h.doc.frames[t].document;
	}
	return null;
};
iframe.setSrc = function (e, t, i) {
	var n = h.global.frames[e.name];
	n.contentWindow && (n = n.contentWindow);
	try {
		i ? n.location.replace(t) : (n.location = t);
	} catch (o) {}
};
iframe._iframeName = u + "_IoIframe";
iframe._notifyStart = function () {};
iframe._dfdQueue = [];
iframe._currentDfd = null;
iframe._fireNextRequest = function () {
	var e;
	try {
		if (iframe._currentDfd || !iframe._dfdQueue.length) return;
		do {
			e = iframe._currentDfd = iframe._dfdQueue.shift();
		} while (
			e &&
			(e.canceled || (e.isCanceled && e.isCanceled())) &&
			iframe._dfdQueue.length
		);
		if (
			!e ||
			e.canceled ||
			(e.isCanceled && e.isCanceled())
		) {
			iframe._currentDfd = null;
			return;
		}
		var t,
			i = e.response,
			o = i.options,
			l = (e._contentToClean = []),
			p = d.byId(o.form),
			m = n.notify,
			g = o.data || null;
		if (e._legacy || "POST" !== o.method || p) {
			if (
				"GET" === o.method &&
				p &&
				i.url.indexOf("?") > -1
			) {
				t = i.url.slice(i.url.indexOf("?") + 1);
				g = a.mixin(s.queryToObject(t), g);
			}
		} else
			p = e._tmpForm = c.create(
				"form",
				{
					name: u + "_form",
					style: {
						position: "absolute",
						top: "-1000px",
						left: "-1000px",
					},
				},
				h.body()
			);
		if (p) {
			if (!e._legacy) {
				var f = p;
				do {
					f = f.parentNode;
				} while (f && f !== h.doc.documentElement);
				if (!f) {
					p.style.position = "absolute";
					p.style.left = "-1000px";
					p.style.top = "-1000px";
					h.body().appendChild(p);
				}
				p.name || (p.name = u + "_form");
			}
			if (g) {
				var _ = function (e, t) {
					c.create(
						"input",
						{ type: "hidden", name: e, value: t },
						p
					);
					l.push(e);
				};
				for (var v in g) {
					var y = g[v];
					if (a.isArray(y) && y.length > 1)
						for (var w = 0; w < y.length; w++)
							_(v, y[w]);
					else {
						var C = r("input[name='" + v + "']", p);
						-1 == C.indexOf() ? _(v, y) : C.val(y);
					}
				}
			}
			var k = p.getAttributeNode("action"),
				x = p.getAttributeNode("method"),
				T = p.getAttributeNode("target");
			if (i.url) {
				e._originalAction = k ? k.value : null;
				k
					? (k.value = i.url)
					: p.setAttribute("action", i.url);
			}
			if (e._legacy)
				(x && x.value) ||
					(x
						? (x.value = o.method)
						: p.setAttribute("method", o.method));
			else {
				e._originalMethod = x ? x.value : null;
				x
					? (x.value = o.method)
					: p.setAttribute("method", o.method);
			}
			e._originalTarget = T ? T.value : null;
			T
				? (T.value = iframe._iframeName)
				: p.setAttribute("target", iframe._iframeName);
			p.target = iframe._iframeName;
			m && m.emit("send", i, e.promise.cancel);
			iframe._notifyStart(i);
			p.submit();
		} else {
			var A = "";
			i.options.data &&
				"string" != typeof (A = i.options.data) &&
				(A = s.objectToQuery(A));
			var j =
				i.url +
				(i.url.indexOf("?") > -1 ? "&" : "?") +
				A;
			m && m.emit("send", i, e.promise.cancel);
			iframe._notifyStart(i);
			iframe.setSrc(iframe._frame, j, true);
		}
	} catch (S) {
		e.reject(S);
	}
};
n.addCommonMethods(iframe, ["GET", "POST"]);

declare global {
	namespace DojoJS {
		interface IFrameBaseOptions extends DojoJS.BaseOptions {
			form?: HTMLFormElement;
			data?: string | Object;
		}
		
		interface RequestDeferred<T> extends DojoJS.Deferred<T> {
			response: DojoJS.Response<T>;
			isValid(response: DojoJS.Response<T>): boolean;
			isReady(response: DojoJS.Response<T>): boolean;
			handleResponse(response: DojoJS.Response<T>): DojoJS.Response<T>;
		}
		
		interface IFrameOptions extends IFrameBaseOptions, DojoJS.MethodOptions { }
		
		interface IFrame {
			<T>(url: string, options: IFrameOptions, returnDeferred: boolean): RequestDeferred<T>;
			<T>(url: string, options?: IFrameOptions): Promise<T>;
		
			create(name: string, onloadstr?: string, uri?: string): HTMLIFrameElement;
			doc(iframenode: HTMLIFrameElement): Document;
			setSrc(_iframe: HTMLIFrameElement, src: string, replace?: boolean): void;
		
			_iframeName: string;
			_notifyStart: Function;
			_dfdQueue: RequestDeferred<any>[];
			_currentDfd: RequestDeferred<any>;
			_fireNextRequest(): void;
		
			/**
			 * Send an HTTP GET request using the default transport for the current platform.
			 */
			get<T>(url: string, options?: IFrameBaseOptions): Promise<T>;
		
			/**
			 * Send an HTTP POST request using the default transport for the current platform.
			 */
			post<T>(url: string, options?: IFrameBaseOptions): Promise<T>;
		}
	}
}

export = iframe as DojoJS.IFrame;