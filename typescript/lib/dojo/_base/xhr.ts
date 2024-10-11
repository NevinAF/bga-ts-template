// @ts-nocheck

import e = require("./kernel");
import t = require("./sniff");
import n = require("require");
import r = require("../io-query");
import o = require("../dom");
import i = require("../dom-form");
import a = require("./Deferred");
import s = require("./config");
import u = require("./json");
import c = require("./lang");
import l = require("./array");
import f = require("../on");
import d = require("../aspect");
import p = require("../request/watch");
import h = require("../request/xhr");
import g = require("../request/util");

e._xhrObj = h._create;
var m = e.config;
e.objectToQuery = r.objectToQuery;
e.queryToObject = r.queryToObject;
e.fieldToObject = i.fieldToObject;
e.formToObject = i.toObject;
e.formToQuery = i.toQuery;
e.formToJson = i.toJson;
e._blockAsync = false;
var v =
	(e._contentHandlers =
	e.contentHandlers =
		{
			text: function (e) {
				return e.responseText;
			},
			json: function (e) {
				return u.fromJson(e.responseText || null);
			},
			"json-comment-filtered": function (e) {
				s.useCommentedJson;
				var t = e.responseText,
					n = t.indexOf("/*"),
					r = t.lastIndexOf("*/");
				if (-1 == n || -1 == r)
					throw new Error(
						"JSON was not comment filtered"
					);
				return u.fromJson(t.substring(n + 2, r));
			},
			javascript: function (t) {
				return e.eval(t.responseText);
			},
			xml: function (e) {
				var n = e.responseXML;
				n &&
					t("dom-qsa2.1") &&
					!n.querySelectorAll &&
					t("dom-parser") &&
					(n = new DOMParser().parseFromString(
						e.responseText,
						"application/xml"
					));
				if (t("ie") && (!n || !n.documentElement)) {
					var r = function (e) {
							return "MSXML" + e + ".DOMDocument";
						},
						o = [
							"Microsoft.XMLDOM",
							r(6),
							r(4),
							r(3),
							r(2),
						];
					l.some(o, function (t) {
						try {
							var r = new ActiveXObject(t);
							r.async = false;
							r.loadXML(e.responseText);
							n = r;
						} catch (o) {
							return false;
						}
						return true;
					});
				}
				return n;
			},
			"json-comment-optional": function (e) {
				return e.responseText &&
					/^[^{\[]*\/\*/.test(e.responseText)
					? v["json-comment-filtered"](e)
					: v.json(e);
			},
		});
e._ioSetArgs = function (t, n, s, u) {
	var l = { args: t, url: t.url },
		f = null;
	if (t.form) {
		var d = o.byId(t.form),
			p = d.getAttributeNode("action");
		l.url =
			l.url || (p ? p.value : e.doc ? e.doc.URL : null);
		f = i.toObject(d);
	}
	var h = {};
	f && c.mixin(h, f);
	t.content && c.mixin(h, t.content);
	t.preventCache &&
		(h["dojo.preventCache"] = new Date().valueOf());
	l.query = r.objectToQuery(h);
	l.handleAs = t.handleAs || "text";
	var g = new a(function (e) {
		e.canceled = true;
		n && n(e);
		var t = e.ioArgs.error;
		if (!t) {
			(t = new Error("request cancelled")).dojoType =
				"cancel";
			e.ioArgs.error = t;
		}
		return t;
	});
	g.addCallback(s);
	var v = t.load;
	v &&
		c.isFunction(v) &&
		g.addCallback(function (e) {
			return v.call(t, e, l);
		});
	var y = t.error;
	y &&
		c.isFunction(y) &&
		g.addErrback(function (e) {
			return y.call(t, e, l);
		});
	var b = t.handle;
	b &&
		c.isFunction(b) &&
		g.addBoth(function (e) {
			return b.call(t, e, l);
		});
	g.addErrback(function (e) {
		return u(e, g);
	});
	if (m.ioPublish && e.publish && false !== l.args.ioPublish) {
		g.addCallbacks(
			function (t) {
				e.publish("/dojo/io/load", [g, t]);
				return t;
			},
			function (t) {
				e.publish("/dojo/io/error", [g, t]);
				return t;
			}
		);
		g.addBoth(function (t) {
			e.publish("/dojo/io/done", [g, t]);
			return t;
		});
	}
	g.ioArgs = l;
	return g;
};
var y = function (e) {
		var t = v[e.ioArgs.handleAs](e.ioArgs.xhr);
		return undefined === t ? null : t;
	},
	b = function (e, t) {
		t.ioArgs.args.failOk || console.error(e);
		return e;
	},
	x = function (t) {
		if (w <= 0) {
			w = 0;
			m.ioPublish &&
				e.publish &&
				(!t || (t && false !== t.ioArgs.args.ioPublish)) &&
				e.publish("/dojo/io/stop");
		}
	},
	w = 0;
d.after(p, "_onAction", function () {
	w -= 1;
});
d.after(p, "_onInFlight", x);
e._ioCancelAll = p.cancelAll;
e._ioNotifyStart = function (t) {
	if (
		m.ioPublish &&
		e.publish &&
		false !== t.ioArgs.args.ioPublish
	) {
		w || e.publish("/dojo/io/start");
		w += 1;
		e.publish("/dojo/io/send", [t]);
	}
};
e._ioWatch = function (e, t, n, r) {
	e.ioArgs.options = e.ioArgs.args;
	c.mixin(e, {
		response: e.ioArgs,
		isValid: function (n) {
			return t(e);
		},
		isReady: function (t) {
			return n(e);
		},
		handleResponse: function (t) {
			return r(e);
		},
	});
	p(e);
	x(e);
};
e._ioAddQueryToUrl = function (e) {
	if (e.query.length) {
		e.url +=
			(-1 == e.url.indexOf("?") ? "?" : "&") + e.query;
		e.query = null;
	}
};
e.xhr = function (t, n, r) {
	var o,
		i = e._ioSetArgs(
			n,
			function (e) {
				o && o.cancel();
			},
			y,
			b
		),
		a = i.ioArgs;
	"postData" in n
		? (a.query = n.postData)
		: "putData" in n
		? (a.query = n.putData)
		: "rawBody" in n
		? (a.query = n.rawBody)
		: ((arguments.length > 2 && !r) ||
				-1 === "POST|PUT".indexOf(t.toUpperCase())) &&
			e._ioAddQueryToUrl(a);
	var s = {
		method: t,
		handleAs: "text",
		timeout: n.timeout,
		withCredentials: n.withCredentials,
		ioArgs: a,
	};
	undefined !== n.headers && (s.headers = n.headers);
	if (undefined !== n.contentType) {
		s.headers || (s.headers = {});
		s.headers["Content-Type"] = n.contentType;
	}
	undefined !== a.query && (s.data = a.query);
	undefined !== n.sync && (s.sync = n.sync);
	e._ioNotifyStart(i);
	try {
		o = h(a.url, s, true);
	} catch (u) {
		i.cancel();
		return i;
	}
	i.ioArgs.xhr = o.response.xhr;
	o.then(function () {
		i.resolve(i);
	}).otherwise(function (e) {
		a.error = e;
		if (e.response) {
			e.status = e.response.status;
			e.responseText = e.response.text;
			e.xhr = e.response.xhr;
		}
		i.reject(e);
	});
	return i;
};
e.xhrGet = function (t) {
	return e.xhr("GET", t);
};
e.rawXhrPost = e.xhrPost = function (t) {
	return e.xhr("POST", t, true);
};
e.rawXhrPut = e.xhrPut = function (t) {
	return e.xhr("PUT", t, true);
};
e.xhrDelete = function (t) {
	return e.xhr("DELETE", t);
};
e._isDocumentOk = function (e) {
	return g.checkStatus(e.status);
};
e._getText = function (t) {
	var n;
	e.xhrGet({
		url: t,
		sync: true,
		load: function (e) {
			n = e;
		},
	});
	return n;
};
c.mixin(e.xhr, {
	_xhrObj: e._xhrObj,
	fieldToObject: i.fieldToObject,
	formToObject: i.toObject,
	objectToQuery: r.objectToQuery,
	formToQuery: i.toQuery,
	formToJson: i.toJson,
	queryToObject: r.queryToObject,
	contentHandlers: v,
	_ioSetArgs: e._ioSetArgs,
	_ioCancelAll: e._ioCancelAll,
	_ioNotifyStart: e._ioNotifyStart,
	_ioWatch: e._ioWatch,
	_ioAddQueryToUrl: e._ioAddQueryToUrl,
	_isDocumentOk: e._isDocumentOk,
	_getText: e._getText,
	get: e.xhrGet,
	post: e.xhrPost,
	put: e.xhrPut,
	del: e.xhrDelete,
});
return e.xhr;

interface IoCallbackArgs {
	/**
	 * the original object argument to the IO call.
	 */
	args: Record<string, any>;

	/**
	 * For XMLHttpRequest calls only, the
	 * XMLHttpRequest object that was used for the
	 * request.
	 */
	xhr: XMLHttpRequest;

	/**
	 * The final URL used for the call. Many times it
	 * will be different than the original args.url
	 * value.
	 */
	url: string;

	/**
	 * For non-GET requests, the
	 * name1=value1&name2=value2 parameters sent up in
	 * the request.
	 */
	query: string;

	/**
	 * The final indicator on how the response will be
	 * handled.
	 */
	handleAs: string;

	/**
	 * For dojo/io/script calls only, the internal
	 * script ID used for the request.
	 */
	id?: string;

	/**
	 * For dojo/io/script calls only, indicates
	 * whether the script tag that represents the
	 * request can be deleted after callbacks have
	 * been called. Used internally to know when
	 * cleanup can happen on JSONP-type requests.
	 */
	canDelete?: boolean;

	/**
	 * For dojo/io/script calls only: holds the JSON
	 * response for JSONP-type requests. Used
	 * internally to hold on to the JSON responses.
	 * You should not need to access it directly --
	 * the same object should be passed to the success
	 * callbacks directly.
	 */
	json?: Record<string, any>;
}

interface XhrArgs extends DojoJS.IoArgs {
	/**
	 * Acceptable values are: text (default), json, json-comment-optional,
	 * json-comment-filtered, javascript, xml. See `dojo/_base/xhr.contentHandlers`
	 */
	handleAs?: string;

	/**
	 * false is default. Indicates whether the request should
	 * be a synchronous (blocking) request.
	 */
	sync?: boolean;

	/**
	 * Additional HTTP headers to send in the request.
	 */
	headers?: Record<string, any>;

	/**
	 * false is default. Indicates whether a request should be
	 * allowed to fail (and therefore no console error message in
	 * the event of a failure)
	 */
	failOk?: boolean;

	/**
	 * "application/x-www-form-urlencoded" is default. Set to false to
	 * prevent a Content-Type header from being sent, or to a string
	 * to send a different Content-Type.
	 */
	contentType: boolean | string;
}

interface ContentHandlers {
	[type: string]: (xhr: { responseText?: string, responseXML?: string }) => any;
	'text': (xhr: { responseText?: string }) => string;
	'json': (xhr: { responseText?: string }) => Record<string, any>;
	'json-comment-filtered': (xhr: { responseText?: string }) => Record<string, any>;
	'javascript': (xhr: { responseText?: string }) => any;
	'xml': (xhr: { responseXML?: string }) => Document;
	'json-comment-optional': (xhr: { responseText?: string }) => Record<string, any>;
}

interface Xhr {
	(method: string, args: XhrArgs, hasBody?: boolean): DojoJS.Deferred<any>;

	/**
	 * does the work of portably generating a new XMLHTTPRequest object.
	 */
	_xhrObj(): XMLHttpRequest | any;

	/**
	 * Serialize a form field to a JavaScript object.
	 */
	fieldToObject(inputNode: HTMLElement | string): Record<string, any>;

	/**
	 * Serialize a form node to a JavaScript object.
	 */
	formToObject(fromNode: HTMLFormElement | string): Record<string, any>;

	/**
	 * takes a name/value mapping object and returns a string representing
	 * a URL-encoded version of that object.
	 */
	objectToQuery(map: Record<string, any>): string;

	/**
	 * Returns a URL-encoded string representing the form passed as either a
	 * node or string ID identifying the form to serialize
	 */
	formToQuery(fromNode: HTMLFormElement | string): string;

	/**
	 * Create a serialized JSON string from a form node or string
	 * ID identifying the form to serialize
	 */
	formToJson(formNode: HTMLFormElement | string): string;

	/**
	 * Create an object representing a de-serialized query section of a
	 * URL. Query keys with multiple values are returned in an array.
	 */
	queryToObject(str: string): Record<string, any>;

	/**
	 * A map of available XHR transport handle types. Name matches the
	 * `handleAs` attribute passed to XHR calls.
	 */
	contentHandlers: ContentHandlers;

	_ioCancelAll(): void;

	/**
	 * If dojo.publish is available, publish topics
	 * about the start of a request queue and/or the
	 * the beginning of request.
	 *
	 * Used by IO transports. An IO transport should
	 * call this method before making the network connection.
	 */
	_ioNotifyStart<T>(dfd: DojoJS.Promise<T>): void;

	/**
	 * Watches the io request represented by dfd to see if it completes.
	 */
	_ioWatch<T>(dfd: DojoJS.Promise<T>, validCheck: Function, ioCheck: Function, resHandle: Function): void;

	/**
	 * Adds query params discovered by the io deferred construction to the URL.
	 * Only use this for operations which are fundamentally GET-type operations.
	 */
	_ioAddQueryToUrl(ioArgs: IoCallbackArgs): void;

	/**
	 * sets up the Deferred and ioArgs property on the Deferred so it
	 * can be used in an io call.
	 */
	_ioSetArgs(args: DojoJS.IoArgs, canceller: Function, okHandler: Function, errHandler: Function): DojoJS.Deferred<any>;

	_isDocumentOk(x: Document): boolean;

	_getText(url: string): string;

	/**
	 * Send an HTTP GET request using the default transport for the current platform.
	 */
	get<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;

	/**
	 * Send an HTTP POST request using the default transport for the current platform.
	 */
	post<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;

	/**
	 * Send an HTTP PUT request using the default transport for the current platform.
	 */
	put<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;

	/**
	 * Send an HTTP DELETE request using the default transport for the current platform.
	 */
	del<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
}


type DojoXhr = Omit<Xhr, 'get' | 'post' | 'put' | 'del'> & { _blockAsync: boolean, _contentHandlers: Xhr['contentHandlers'], xhrDelete: Xhr["del"], xhrGet: Xhr["get"], xhrPost: Xhr["post"], xhrPut: Xhr["put"], rawXhrPost: Xhr["post"], rawXhrPut: Xhr["put"], xhr: Xhr }


declare global {
	namespace DojoJS {
		interface Dojo extends DojoXhr {}

		interface IoArgs {
			/**
			 * URL to server endpoint.
			 */
			url: string;
		
			/**
			 * Contains properties with string values. These
			 * properties will be serialized as name1=value2 and
			 * passed in the request.
			 */
			content?: Record<string, any>;
		
			/**
			 * Milliseconds to wait for the response. If this time
			 * passes, the then error callbacks are called.
			 */
			timeout?: number;
		
			/**
			 * DOM node for a form. Used to extract the form values
			 * and send to the server.
			 */
			form?: HTMLFormElement;
		
			/**
			 * Default is false. If true, then a
			 * "dojo.preventCache" parameter is sent in the requesa
			 * with a value that changes with each requesa
			 * (timestamp). Useful only with GET-type requests.
			 */
			preventCache?: boolean;
		
			/**
			 * Acceptable values depend on the type of IO
			 * transport (see specific IO calls for more information).
			 */
			handleAs?: string;
		
			/**
			 * Sets the raw body for an HTTP request. If this is used, then the content
			 * property is ignored. This is mostly useful for HTTP methods that have
			 * a body to their requests, like PUT or POST. This property can be used instead
			 * of postData and putData for dojo/_base/xhr.rawXhrPost and dojo/_base/xhr.rawXhrPut respectively.
			 */
			rawBody?: string;
		
			/**
			 * Set this explicitly to false to prevent publishing of topics related to
			 * IO operations. Otherwise, if djConfig.ioPublish is set to true, topics
			 * will be published via dojo/topic.publish() for different phases of an IO operation.
			 * See dojo/main.__IoPublish for a list of topics that are published.
			 */
			ioPublish?: boolean;
		
			/**
			 * This function will be
			 * called on a successful HTTP response code.
			 */
			load?: (response: any, ioArgs: IoCallbackArgs) => void;
		
			/**
			 * This function will
			 * be called when the request fails due to a network or server error, the url
			 * is invalid, etc. It will also be called if the load or handle callback throws an
			 * exception, unless djConfig.debugAtAllCosts is true.	 This allows deployed applications
			 * to continue to run even when a logic error happens in the callback, while making
			 * it easier to troubleshoot while in debug mode.
			 */
			error?: (response: any, ioArgs: IoCallbackArgs) => void;
		
			/**
			 * This function will
			 * be called at the end of every request, whether or not an error occurs.
			 */
			handle?: (loadOrError: string, response: any, ioArgs: IoCallbackArgs) => void;
		}
	}
}

export = e.xhr as Xhr;