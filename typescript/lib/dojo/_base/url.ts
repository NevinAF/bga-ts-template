// @ts-nocheck

import e = require("./kernel");

var t = new RegExp(
		"^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"
	),
	i = new RegExp(
		"^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$"
	),
	n = function () {
		for (
			var e = null, o = arguments, a = [o[0]], s = 1;
			s < o.length;
			s++
		)
			if (o[s]) {
				var r = new n(o[s] + ""),
					l = new n(a[0] + "");
				if (
					"" != r.path ||
					r.scheme ||
					r.authority ||
					r.query
				) {
					if (!r.scheme) {
						r.scheme = l.scheme;
						if (!r.authority) {
							r.authority = l.authority;
							if ("/" != r.path.charAt(0)) {
								for (
									var d = (
											l.path.substring(
												0,
												l.path.lastIndexOf(
													"/"
												) + 1
											) + r.path
										).split("/"),
										c = 0;
									c < d.length;
									c++
								)
									if ("." == d[c])
										if (c == d.length - 1)
											d[c] = "";
										else {
											d.splice(c, 1);
											c--;
										}
									else if (
										c > 0 &&
										(1 != c ||
											"" != d[0]) &&
										".." == d[c] &&
										".." != d[c - 1]
									)
										if (c == d.length - 1) {
											d.splice(c, 1);
											d[c - 1] = "";
										} else {
											d.splice(c - 1, 2);
											c -= 2;
										}
								r.path = d.join("/");
							}
						}
					}
				} else {
					r.fragment != e &&
						(l.fragment = r.fragment);
					r = l;
				}
				a = [];
				r.scheme && a.push(r.scheme, ":");
				r.authority && a.push("//", r.authority);
				a.push(r.path);
				r.query && a.push("?", r.query);
				r.fragment && a.push("#", r.fragment);
			}
		this.uri = a.join("");
		var h = this.uri.match(t);
		this.scheme = h[2] || (h[1] ? "" : e);
		this.authority = h[4] || (h[3] ? "" : e);
		this.path = h[5];
		this.query = h[7] || (h[6] ? "" : e);
		this.fragment = h[9] || (h[8] ? "" : e);
		if (this.authority != e) {
			h = this.authority.match(i);
			this.user = h[3] || e;
			this.password = h[4] || e;
			this.host = h[6] || h[7];
			this.port = h[9] || e;
		}
	} as UrlConstructor;
n.prototype.toString = function () {
	return this.uri;
};


interface Url {
	uri: string;
	scheme: string;
	authority: string;
	path: string;
	query: string;
	fragment: string;
	user?: string;
	password?: string;
	host?: string;
	port?: string;
	toString(): string;
}

interface UrlConstructor {
	new (...args: any[]): Url;
	prototype: Url;
}

declare global {
	namespace DojoJS {
		interface Dojo {
			_Url: typeof n;
		}
	}
}

export = n;