/**
 * Internal. A wrapper for {@link dojo.i18n} that is used to handle translations in BGA pages. This is used to define the bundles which can be used to find translations for a given key. This is used to create the global translation functions {@link _} and {@link __}.
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/core/i18n must be included in the define as a dependency.
 */
interface I18n {
	/** The record bundles that holds a record of translations based on the client local settings. */
	nlsStrings: Record<string, Record<string, string>>;
	/** The active bundle that is currently being used for translations. This is usually used for page specific translations. */
	activeBundle: string;
	/** The version of the js bundle. */
	jsbundleversion: string;
	/**
	 * Loads all translations from the given bundle from the dojo i18n.
	 * @param bundle The name of the bundle to load.
	 * ```js
	 * this.nlsStrings[t] = dojo.i18n.getLocalization("ebg", t)
	 * ```
	 */
	loadBundle: (bundle: string) => void;

	/**
	 * Gets the translation for the given key from the active bundle.
	 * @param bundle The name of the bundle to load.
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 */
	getTranslation: (bundle: string, key: string) => string;

	/**
	 * Sets the active bundle to the given bundle. This is used as a default for when using the getSimpleTranslation function.
	 * @param bundle The name of the bundle to set as active.
	 */
	setActiveBundle: (bundle: string) => void;

	/**
	 * Gets the translation for the given key from the active bundle.
	 * @param key The key to get the translation for.
	 * @returns The translation for the given key.
	 */
	getSimpleTranslation: (key: string) => string;
}

declare module "ebg/core/i18n" {
	const I18n: new () => I18n;
	export = I18n;
}