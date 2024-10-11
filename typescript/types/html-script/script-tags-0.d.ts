/** The pages name using the {@link location} global. */
declare var pagename: string;
/**
 * The data layer for Google Tag Manager. See {@link gtag}/{@link analyticsPush} for modification, and {@link https://developers.google.com/tag-manager/devguide} for purpose.
 */
declare var dataLayer: any[];
/**
 * gtag is a global function that is used to send data to Google Analytics. See {@link https://developers.google.com/analytics/devguides/collection/gtagjs} for more information on how this data is used.
 * @param args The arguments to pass to the dataLayer. Same as {@link dataLayer.push}.
 */
declare function gtag(...args: any[]): void;
/** If cookie consent is still needed for the specific browser user. */
declare var bConsentNeeded: boolean;
/** A callback function for when the user grants their consent with their cookie banner */
declare function setCookies(): void;
/** Resets the document.cookie object for this domain. */
declare function resetCookieConsent(): void;
//# sourceMappingURL=script-tags-0.d.ts.map