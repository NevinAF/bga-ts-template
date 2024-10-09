import e = require("dojo");
import declare = require("dojo/_base/declare");

type ExtendedPushSubscription = PushSubscription & { keys: { auth: string; p256dh: string; }; };

declare global {
	namespace BGA {
		interface AjaxActions {
			"/player/profile/savePushSubscription.html": {
				isnewbrowser: boolean,
				browser: string,
				endpoint: ExtendedPushSubscription['endpoint'],
				auth: string,
				p256dh: string,
			};
		}
	}
}



class WebPush_Template {
	ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
	serviceWorkerRegistered: boolean = false;
	permissionAlreadyGranted: boolean = false;
	permissionGranted: boolean = false;
	pushSubscription: ExtendedPushSubscription | null = null;
	l_serviceworker_url: string = "/theme/js/bgaserviceworker.js";
	browser: string =
		e.isChrome ? "Google Chrome v" + e.isChrome :
		e.isIE ? "Internet Explorer v" + e.isIE :
		e.isFF ? "Mozilla Firefox v" + e.isFF :
		e.isSafari ? "Safari v" + e.isSafari :
		e.isMozilla ? "Mozilla v" + e.isMozilla :
		e.isOpera ? "Opera v" + e.isOpera : "";



	constructor(callback: InstanceType<BGA.CorePage>["ajaxcall"]) {
		this.ajaxcall_callback = callback;

		var i = "/data/themereleases/";
		g_themeurl.substr(g_themeurl.indexOf(i) + 20, 11);
	}

	init(): Promise<void> {
		if (!this.isSupported())
			return Promise.reject(
				new Error("Web push is not supported")
			);
		this.isAuthorized() &&
			(this.permissionAlreadyGranted = true);
		return this.registerServiceWorker()
			.then(
				e.hitch(this, function () {
					return this.askPermission();
				})
			)
			.then(
				e.hitch(this, function () {
					return this.subscribeUserToPush();
				})
			)
			.then(
				e.hitch(this, function (e) {
					return this.savePushSubscription(e);
				})
			);
	}

	refresh(): Promise<never> | void {
		if (!this.isSupported())
			return Promise.reject(
				new Error("Web push is not supported")
			);
		var t = location.href.split("/")[2],
			i = g_sitecore.domain,
			n = "https://" + i + "/";
		try {
			navigator.serviceWorker.getRegistrations().then(
				e.hitch(this, function (e) {
					for (var o = false, a = 0; a < e.length; ++a) {
						var s = e[a];
						s.scope;
						if (s.scope != n) {
							s.unregister();
							s.scope;
						} else o = true;
					}
					o || t != i || this.registerServiceWorker();
				})
			);
		} catch (o: any) {
			console.error(
				"Exception unregistering obsolete service workers: " +
					o.message
			);
		}
	}

	revoke() {}

	isSupported() {
		return (
			"undefined" != typeof Promise &&
			-1 !==
				Promise.toString().indexOf("[native code]") &&
			"serviceWorker" in navigator &&
			"PushManager" in window &&
			"Notification" in window
		);
	}

	isAuthorized() {
		return "granted" == Notification.permission;
	}

	registerServiceWorker() {
		return navigator.serviceWorker
			.register(this.l_serviceworker_url, {
				scope: "../../",
			})
			.then(function (this: WebPush_Template, e) {
				this.serviceWorkerRegistered = true;
				e.update();
				return e;
			})
			.then(null, function (this: WebPush_Template, e) {
				this.serviceWorkerRegistered = false;
				console.error(
					"Unable to register service worker.",
					e
				);
			});
	}

	askPermission() {
		return new Promise(function (e, t) {
			var i = Notification.requestPermission(function (
				t
			) {
				e(t);
			});
			i && i.then(e, t);
		}).then(function (this: WebPush_Template, e) {
			if ("granted" === e) this.permissionGranted = true;
			else {
				this.permissionGranted = false;
				console.error("We weren't granted permission.");
			}
		});
	}

	subscribeUserToPush() {
		return navigator.serviceWorker
			.register(this.l_serviceworker_url, {
				scope: "../../",
			})
			.then(function (e) {
				var t = {
					userVisibleOnly: true,
					applicationServerKey: (function (e) {
						for (
							var t = (
									e +
									"=".repeat(
										(4 - (e.length % 4)) % 4
									)
								)
									.replace(/\-/g, "+")
									.replace(/_/g, "/"),
								i = window.atob(t),
								n = new Uint8Array(i.length),
								o = 0;
							o < i.length;
							++o
						)
							n[o] = i.charCodeAt(o);
						return n;
					})(
						"BKh3NNRk5O5wx1_qS_TlvqadCSZ_GmdwpYYfsVMurznZ03mn0wgvh-lK84IMaljkLFfYEQpxN_e4mwrUwYAfbwU"
					),
				};
				return e.pushManager.subscribe(t);
			})
			.then(function (e) {
				JSON.stringify(e);
				return e;
			});
	}

	savePushSubscription(e: any) {
		this.pushSubscription = JSON.parse(JSON.stringify(e)) as ExtendedPushSubscription;
		this.ajaxcall_callback(
			"/player/profile/savePushSubscription.html",
			{
				isnewbrowser: !this.permissionAlreadyGranted,
				browser: this.browser,
				endpoint: this.pushSubscription.endpoint,
				auth: this.pushSubscription.keys.auth,
				p256dh: this.pushSubscription.keys.p256dh,
				lock: false,
			},
			this,
			function (e) {},
			function (e) {},
			"post"
		);
	}
}

let WebPush = declare("ebg.webpush", WebPush_Template);
export = WebPush;

declare global {
	namespace BGA {
		type WebPush = typeof WebPush;
		interface EBG { webpush: WebPush; }
	}
	var ebg: BGA.EBG;
}