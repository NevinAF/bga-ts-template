declare global {
    namespace DojoJS {
        interface I18n {
            getLocalization(moduleName: string, bundleName: string, locale?: string): any;
            dynamic: boolean;
            /**
             * Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
             */
            normalize(id: string, toAbsMid: Function): string;
            normalizeLocale(locale?: string): string;
            /**
             * Conditional loading of AMD modules based on a has feature test value.
             */
            load(id: string, parentRequire: Function, loaded: Function): void;
            cache: {
                [bundle: string]: any;
            };
            getL10nName(moduleName: string, bundleName: string, locale?: string): string;
        }
        interface Dojo {
            i18n: I18n;
            getL10nName: I18n["getL10nName"];
        }
    }
}
declare const _default: DojoJS.I18n;
export = _default;
//# sourceMappingURL=i18n.d.ts.map