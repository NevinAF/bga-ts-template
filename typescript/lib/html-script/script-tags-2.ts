/// <reference path="socket.io.ts" />
/// <reference path="../svelte/index.ts" />
/// <reference path="dojo.ts" />

// add modules from "ebg/layer/nls/ly_studio_ROOT"
// add modules from "sveltec/dist/index"
// add modules from "yourgamename"
// add modules from "dojo/firebug"
// add modules from "modules/nls/ly_mainsite"
// add modules from "modules/nls/lang_yourgamename"
// add modules from "modules/nls/en/lang_yourgamename"
// add modules from "modules/nls/en/lang_mainsite"
// add modules from "dojo/dojo"
// add modules from "modules/layer/ly_studio"

(function () {
	var initCookieConsent = function () {
		cookieConsentInit();
		window.cookieconsent.initialise({
			enabled: false,
			cookie: {
				name: "cC",
				domain: "studio.boardgamearena.com",
				expiryDays: 182,
			},
			palette: {
				popup: {
					background: "#4871b6",
				},
				button: {
					background: "#fff",
					text: "#4871b6",
				},
			},
			revokable: false,
			revokeBtn: "<span></<span>",
			theme: "classic",
			type: "opt-out",
			content: {
				message:
					"We are using cookies for analytics on this website (sorry you cannot eat them 🙂 )<br /><span style='font-size:0.8em;line-height:1.1em;'> This site uses analytical cookies (from the site and from third parties), intended to understand and optimize the navigation experience of its users. If you wish to oppose the use of these cookies, please click on \"Decline\". For more information, please check out our cookie policy:</span>",
				link: "<span style='font-size:0.8em;line-height:1.1em;'>Read more</span>",
				dismiss: "Accept",
				deny: "Decline",
				href: "/legal?section=cook",
			},
			onInitialise: function (status: string) {
				if (status == cookieconsent.status.allow) setCookies();
			},
			onStatusChange: function (status: string) {
				if (this.hasConsented()) setCookies();
			},
		});
	};
	if (document.readyState == "complete") {
		initCookieConsent();
	} else {
		document.addEventListener("readystatechange", function () {
			if (document.readyState == "complete") {
				initCookieConsent();
			}
		});
	}
})();
