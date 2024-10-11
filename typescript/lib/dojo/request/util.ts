// @ts-nocheck

import "exports";
import RequestError = require("../errors/RequestError");
import CancelError = require("../errors/CancelError");
import Deferred = require("../Deferred");
import ioQuery = require("../io-query");
import array = require("../_base/array");
import lang = require("../_base/lang");
import Promise = require("../promise/Promise");
import has = require("../has");

class Util {
	private static c<T>(e: T): boolean & (T extends ArrayBuffer ? true : false) {
		return has("native-arraybuffer") && e instanceof ArrayBuffer;
	}

	private static l<T>(e: T): boolean & (T extends Blob ? true : false) {
		return has("native-blob") && e instanceof Blob;
	}

	private static f<T>(e: T): boolean {
		return (
			e &&
			"object" == typeof e &&
			!(has("native-formdata") && e instanceof FormData) &&
			!(e instanceof HTMLFormElement) &&
			!Util.l(e) &&
			!Util.c(e)
		);
	}

	deepCopy<T extends Record<string, any>, S extends Record<string, any>>(target: T, source: S): T & S {
		for (var r in source) {
			var o = target[r],
				i = source[r];
			if (o !== i) {
				if (Util.f(i)) {
					if (Object.prototype.toString.call(i) === "[object Date]") {
						target[r] = new Date(i);
					} else if (lang.isArray(i)) {
						target[r] = Util.deepCopyArray(i);
					} else if (o && "object" == typeof o) {
						this.deepCopy(o, i);
					} else {
						target[r] = this.deepCopy({}, i);
					}
				} else {
					target[r] = i;
				}
			}
		}
		return target;
	}

	deepCopyArray<T>(t: T[]): T[] {
		var n: T[] = [];
		for (var r = 0, o = t.length; r < o; r++) {
			var i = t[r];
			if ("object" == typeof i) {
				n.push(this.deepCopy({}, i));
			} else {
				n.push(i);
			}
		}
		return n;
	}

	deepCreate<T extends Record<string, any>, P extends Record<string, any>>(source: T, properties?: P): T & P {
		properties = properties || {};
		var i = lang.delegate(source);
		for (var r in source) {
			var o = source[r];
			if (o && "object" == typeof o) {
				i[r] = this.deepCreate(o, properties[r]);
			}
		}
		return this.deepCopy(i, properties);
	}

	deferred<T>(
		response: DojoJS.Response<T>,
		cancel: (def: Deferred<DojoJS.Response<T>>, response: DojoJS.Response<T>) => void,
		isValid: (response: DojoJS.Response<T>) => boolean,
		isReady: (response: DojoJS.Response<T>) => boolean,
		last?: boolean
	): DojoJS.RequestDeferred<DojoJS.Response<T>> {
		var def = new Deferred(function (e) {
			cancel && cancel(def, response);
			return e && (e instanceof RequestError || e instanceof CancelError)
				? e
				: new CancelError("Request canceled", response);
		});
		def.response = response;
		def.isValid = isValid;
		def.isReady = isReady;
		def.handleResponse = last;
		var promise = def.then(Util.clone);
		if (this.notify) {
			promise.then(
				lang.hitch(this.notify, "emit", "load"),
				lang.hitch(this.notify, "emit", "error")
			);
		}
		var lastFn = promise.then(h);
		var newPromise = new Promise();
		for (var prop in lastFn) {
			if (lastFn.hasOwnProperty(prop)) {
				newPromise[prop] = lastFn[prop];
			}
		}
		newPromise.response = lastFn;
		return newPromise;
	}

	addCommonMethods<T extends Object>(provider: T, methods: string[]): T;
	addCommonMethods<T extends Object>(provider: T, methods?: string[]): T & CommonMethods<DojoJS.BaseOptions> {
		array.forEach(
			methods || ["GET", "POST", "PUT", "DELETE"],
			function (method) {
				provider[(method === "DELETE" ? "DEL" : method).toLowerCase()] = function (url: string, options: DojoJS.BaseOptions) {
					options = lang.delegate(options || {});
					options.method = method;
					return provider(url, options);
				};
			}
		);
		return provider as T & CommonMethods<DojoJS.BaseOptions>;
	}

	parseArgs(url: string, options: DojoJS.BaseOptions, skipData?: boolean): ParsedArgs {
		var data = options.data,
			query = options.query;
		if (data && !skipData) {
			if (
				"object" != typeof data ||
				(Util.c(data) || Util.l(data)) ||
				(options.data = ioQuery.objectToQuery(data))
			);
		}
		if (query) {
			if ("object" == typeof query) {
				query = ioQuery.objectToQuery(query);
			}
			if (options.preventCache) {
				query += (query ? "&" : "") + "request.preventCache=" + +new Date();
			}
		} else if (options.preventCache) {
			query = "request.preventCache=" + +new Date();
		}
		if (url && query) {
			url += (~url.indexOf("?") ? "&" : "?") + query;
		}
		return {
			url: url,
			options: options,
			getHeader: function (headerName: string) {
				return null;
			},
		};
	}

	checkStatus(): boolean {
		return (
			(status >= 200 && status < 300) ||
			status === 304 ||
			status === 1223 ||
			!status
		);
	}
}

interface CommonMethods<O extends DojoJS.BaseOptions> {

	/**
	 * Send an HTTP GET request using XMLHttpRequest with the given URL and options.
	 */
	get<T>(url: string, options?: O): Promise<T>;

	/**
	 * Send an HTTP POST request using XMLHttpRequest with the given URL and options.
	 */
	post<T>(url: string, options?: O): Promise<T>;

	/**
	 * Send an HTTP PUT request using XMLHttpRequest with the given URL and options.
	 */
	put<T>(url: string, options?: O): Promise<T>;

	/**
	 * Send an HTTP DELETE request using XMLHttpRequest with the given URL and options.
	 */
	del<T>(url: string, options?: O): Promise<T>;
}

interface ParsedArgs {
	url: string;
	options: DojoJS.RequestOptions;
	getHeader(headerName: string): string;
}

declare global {
	namespace DojoJS
	{
		interface Response<T> extends ParsedArgs {
			xhr?: XMLHttpRequest;
			requestOptions?: DojoJS.BaseOptions & {
				socketPath?: string;
				headers?: { [header: string]: string };
				agent?: string;
				pfx?: any;
				key?: string;
				passphrase?: string;
				cert?: any;
				ca?: any;
				ciphers?: string;
				rejectUnauthorized?: boolean;
				path?: string;
				auth?: string;
				username?: string;
				password?: string;
				socketOptions?: { timeout: number, noDelay: number, keepAlive: number };
			};
			clientRequest?: any;
			hasSocket?: boolean;
			clientResponse?: any;
			status?: number;
			text?: string;
			data?: T;
		}

		interface RequestOptions extends BaseOptions, MethodOptions { }

		interface Request {
			/**
			 * Send a request using the default transport for the current platform.
			 */
			<T>(url: string, options?: RequestOptions): Promise<T>;

			/**
			 * Send an HTTP GET request using the default transport for the current platform.
			 */
			get<T>(url: string, options?: BaseOptions): Promise<T>;

			/**
			 * Send an HTTP POST request using the default transport for the current platform.
			 */
			post<T>(url: string, options?: BaseOptions): Promise<T>;

			/**
			 * Send an HTTP PUT request using the default transport for the current platform.
			 */
			put<T>(url: string, options?: BaseOptions): Promise<T>;

			/**
			 * Send an HTTP DELETE request using the default transport for the current platform.
			 */
			del<T>(url: string, options?: BaseOptions): Promise<T>;
		}
	}
}

export = new Util();