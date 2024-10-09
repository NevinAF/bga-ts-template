import global = require("./global");
import has = require("./has");

interface DomReady {
	/**
	 * Plugin to delay require()/define() callback from firing until the DOM has finished
	 */
	(callback: (doc: Document) => any): void;

	load(id: string, parentRequire: Function, loaded: Function): void; /* WIP: Align with loader api */
	_Q: Function[];
	_onEmpty(): void;
	_onQEmpty(): void;
}

var n: undefined | boolean,
	docRef = document,
	// @ts-ignore - loaded is not a valid ready state
	readyStateMap: Record<DocumentReadyState, 0 | 1> = { loaded: 1, complete: 1 },
	i = "string" != typeof docRef.readyState,
	a: 0 | 1 | boolean = !!readyStateMap[docRef.readyState],
	domReadyCallbacks: Function[] = [];
// @ts-ignore
var domReady: DomReady = function(callback: (doc: Document) => any) {
	domReadyCallbacks.push(callback);
	a && c();
}
domReady.load = function (id, parentRequire, n: (doc: Document) => any) {
	domReady(n);
};
domReady._Q = domReadyCallbacks;
domReady._onQEmpty = function () {};
// @ts-ignore - this should be read-only
i && (docRef.readyState = "loading");
function c() {
	if (!n) {
		n = true;
		for (; domReadyCallbacks.length; )
			try {
				domReadyCallbacks.shift()!(docRef);
			} catch (e: any) {
				console.error(e, "in domReady callback", e.stack);
			}
		n = false;
		domReady._onQEmpty();
	}
}
if (!a) {
	var l: any[] = [],
		f = function (t?: Event) {
			t = t || global.event;
			if (
				!a &&
				("readystatechange" != t!.type ||
					readyStateMap[docRef.readyState])
			) {
				// @ts-ignore - this should be read-only
				i && (docRef.readyState = "complete");
				a = 1;
				c();
			}
		},
		d = function (e: any, t: any) {
			e.addEventListener(t, f, false);
			domReadyCallbacks.push(function () {
				e.removeEventListener(t, f, false);
			});
		};
	if (!has("dom-addeventlistener")) {
		d = function (e, t) {
			t = "on" + t;
			e.attachEvent(t, f);
			domReadyCallbacks.push(function () {
				e.detachEvent(t, f);
			});
		};
		var p = docRef.createElement("div") as any;
		try {
			p.doScroll &&
				null === global.frameElement &&
				l.push(function () {
					try {
						p.doScroll("left");
						return 1;
					} catch (e) {
						return 0;
					}
				});
		} catch (g) {}
	}
	d(docRef, "DOMContentLoaded");
	d(global, "load");
	"onreadystatechange" in docRef
		? d(docRef, "readystatechange")
		: i ||
			l.push(function () {
				return readyStateMap[docRef.readyState];
			});
	if (l.length) {
		var h = function () {
			if (!a) {
				for (var e = l.length; e--; )
					if (l[e]()) {
						// @ts-ignore
						f("poller");
						return;
					}
				setTimeout(h, 30);
			}
		};
		h();
	}
}

export = domReady;