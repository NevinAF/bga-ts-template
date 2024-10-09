/// <reference path="facebook-sdk.ts" />
/// <reference path="google-gsi-client.ts" />
/// <reference path="google-analytics.ts" />

/** The pages name using the {@link location} global. */
var pagename: string = location.pathname + location.search + location.hash;

/**
 * The data layer for Google Tag Manager. See {@link gtag}/{@link analyticsPush} for modification, and {@link https://developers.google.com/tag-manager/devguide} for purpose.
 */
var dataLayer: any[] = window.dataLayer || [{
	'page_name': pagename,
	'page_siteSection': '',
	'user_environment': 'dev',
	'user_country': 'US',
	'user_lang': 'en',
	'user_status': 'logged_visit',
	'user_id': '2395746',
	'user_is_premium': 'true',
	'player_status': 'regular'
}];

/**
 * gtag is a global function that is used to send data to Google Analytics. See {@link https://developers.google.com/analytics/devguides/collection/gtagjs} for more information on how this data is used.
 * @param args The arguments to pass to the dataLayer. Same as {@link dataLayer.push}.
 */
function gtag(...args: any[]) { dataLayer.push(arguments); }

/** If cookie consent is still needed for the specific browser user. */
var bConsentNeeded: boolean = false;
if (bConsentNeeded) {
	var bConsentGranted = (document.cookie.indexOf('cC=dismiss') != -1); // User has granted their consent already
	gtag('consent', 'default', {
		'ad_storage': 'denied',
		'analytics_storage': (bConsentGranted ? 'granted' : 'denied')
	});
	gtag('set', 'ads_data_redaction', true);
}

/** A callback function for when the user grants their consent with their cookie banner */
function setCookies() {
	gtag('consent', 'update', {
		'analytics_storage': 'granted'
	});
}

/** Resets the document.cookie object for this domain. */
function resetCookieConsent() {
	document.cookie = 'cC=; Max-Age=-99999999; path=/; domain=studio.boardgamearena.com';
}


(function<T extends keyof HTMLElementTagNameMap>(w: Window, d: Document, element_type: T, dataVarName: string, tag_manager_id: string) {
	// @ts-ignore - Assume that the dataVarName is a valid property of the window object.
	w[dataVarName] = w[dataVarName] || []; w[dataVarName].push({
		'gtm.start':
			new Date().getTime(), event: 'gtm.js'
	}); var f = d.getElementsByTagName(element_type)[0] as HTMLScriptElement,
		j = d.createElement(element_type) as HTMLScriptElement, dl = dataVarName != 'dataLayer' ? '&l=' + dataVarName : ''; j.async = true; j.src =
			'https://www.googletagmanager.com/gtm.js?id=' + tag_manager_id + dl; f.parentNode!.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-M8Q8TH8');