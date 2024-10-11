declare global {
    namespace DojoJS {
        interface Dojo {
            provide(moduleName: string): any;
            require(e: string, t?: boolean): any;
            loadInit(e: () => void): void;
            registerModulePath(path: string, obj: any): void;
            platformRequire(e: {
                common?: string[];
                default?: string[];
            } & Record<string, string[]>): void;
            requireIf(condition: boolean, mid: string, require: any): void;
            requireAfterIf(condition: boolean, mid: string, require: any): void;
            requireLocalization(moduleName: string, bundleName: string, locale?: string): any;
        }
    }
}
declare const _default: {
    extractLegacyApiApplications(text: string, noCommentText?: string): any;
    require(mid: string, require: any, loaded: (...modules: any[]) => void): void;
    loadInit(mid: string, require: any, loaded: (...modules: any[]) => void): void;
};
export = _default;
//# sourceMappingURL=loader.d.ts.map