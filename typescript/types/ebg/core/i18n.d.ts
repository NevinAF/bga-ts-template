import "dojo/i18n";
/**
 * Internal. A wrapper for {@link DojoJS.i18n} that is used to handle translations in BGA pages. This is used to define the bundles which can be used to
find translations for a given key. This is used to create the global translation functions {@link _} and {@link __}.
 */
declare class I18n_Template {
    /** The record bundles that holds a record of translations based on the client local settings. */
    nlsStrings: Record<string, Record<string, string>>;
    /** The active bundle that is currently being used for translations. This is usually used for page specific translations. */
    activeBundle: string;
    /** The version of the js bundle. */
    jsbundlesversion: string;
    /**
     * Loads all translations from the given bundle from the dojo i18n.
     * @param bundle The name of the bundle to load.
     * ```js
     * this.nlsStrings[t] = dojo.i18n.getLocalization("ebg", t)
     * ```
     */
    loadBundle(bundle: string): void;
    /**
     * Gets the translation for the given key from the active bundle.
     * @param bundle The name of the bundle to load.
     * @param key The key to get the translation for.
     * @returns The translation for the given key.
     * @throws {TypeError} if the bundle has not been loaded.
     */
    getTranslation(bundle: string, key: string): string | throws<TypeError>;
    /**
     * Sets the active bundle to the given bundle. This is used as a default for when using the getSimpleTranslation function.
     * @param bundle The name of the bundle to set as active.
     */
    setActiveBundle(bundle: string): void;
    /**
     * Gets the translation for the given key from the active bundle.
     * @param key The key to get the translation for.
     * @returns The translation for the given key.
     * @throws {TypeError} if the {@link activeBundle} has not been loaded.
     */
    getSimpleTranslation(key: string, failWithError?: boolean): string | throws<TypeError>;
}
declare let I18n: DojoJS.DojoClass<I18n_Template, []>;
export = I18n;
declare global {
    namespace BGA {
        type I18n = typeof I18n;
        interface EBG {
            core: EBG_CORE;
        }
        interface EBG_CORE {
            i18n: I18n;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=i18n.d.ts.map