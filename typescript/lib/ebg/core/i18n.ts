import DojoJS = require("dojo");
import declare = require("dojo/_base/declare");
import "dojo/i18n";

/**
 * Internal. A wrapper for {@link DojoJS.i18n} that is used to handle translations in BGA pages. This is used to define the bundles which can be used to 
find translations for a given key. This is used to create the global translation functions {@link _} and {@link __}.
 */
class I18n_Template
{
	/** The record bundles that holds a record of translations based on the client local settings. */
	nlsStrings: Record<string, Record<string, string>> = {};
	/** The active bundle that is currently being used for translations. This is usually used for page specific translations. */
	activeBundle: string = "";
	/** The version of the js bundle. */
	jsbundlesversion: string = "";

	/**
	 * Loads all translations from the given bundle from the dojo i18n.
	 * @param bundle The name of the bundle to load.
	 * ```js
	 * this.nlsStrings[t] = dojo.i18n.getLocalization("ebg", t)
	 * ```
	 */
	loadBundle(bundle: string): void
	{
		"" != this.jsbundlesversion && (bundle += "-" + this.jsbundlesversion);
		dojo.config.locale.substr(0, 2);
		this.nlsStrings[bundle] = dojo.i18n.getLocalization("ebg", bundle);
	}

	/**
	 * Gets the translation for the given key from the active bundle.
	 * @param bundle The name of the bundle to load.
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 * @throws {TypeError} if the bundle has not been loaded.
	 */
	getTranslation(bundle: string, key: string): string | throws<TypeError>
	{
		"" != this.jsbundlesversion && (bundle += "-" + this.jsbundlesversion);
		if (!this.nlsStrings[bundle]) {
			console.error("Bundle " + bundle + " has not been loaded (for string " + key + ")");
			return key;
		}
		var translation = this.nlsStrings[bundle]![key];
		return translation || key;
	}

	/**
	 * Sets the active bundle to the given bundle. This is used as a default for when using the getSimpleTranslation function.
	 * @param bundle The name of the bundle to set as active.
	 */
	setActiveBundle(bundle: string): void
	{
		"" != this.jsbundlesversion && (bundle += "-" + this.jsbundlesversion);
		this.activeBundle = bundle;
	}

	/**
	 * Gets the translation for the given key from the active bundle.
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 * @throws {TypeError} if the {@link activeBundle} has not been loaded.
	 */
	getSimpleTranslation(key: string, failWithError: boolean = false): string | throws<TypeError>
	{
		if ("" == this.activeBundle) {
			console.error("No active bundle (string " + key + ")");
			return key;
		}
		if (!this.nlsStrings[this.activeBundle]) {
			console.error("Bundle " + this.activeBundle + " has not been loaded (string = " + key + ")");
			return key;
		}
		var translation = this.nlsStrings[this.activeBundle]![key];
		if (translation) return translation;
		if (failWithError && "en" !== dojo.config.locale) throw new Error("String not translated: " + key);
		return key;
	}
}

let I18n = declare("ebg.core.i18n", I18n_Template);
export = I18n;

declare global {
	namespace BGA {
		type I18n = typeof I18n;
		interface EBG { core: EBG_CORE; }
		interface EBG_CORE { i18n: I18n; }
	}

	var ebg: BGA.EBG;
}