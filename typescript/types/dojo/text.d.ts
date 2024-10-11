declare const _default: {
    /**
     * the dojo/text caches it's own resources because of dojo.cache
     */
    dynamic: boolean;
    normalize: (e: any, t: any) => string;
    load: (e: any, t: any, i: any) => void;
};
export = _default;
declare global {
    namespace DojoJS {
        interface Dojo {
            /**
             * A getter and setter for storing the string content associated with the
             * module and url arguments.
             */
            cache: (module: string | Record<string, any>, url: string, value?: string | {
                value: string;
                sanitize?: boolean;
            }) => string;
        }
    }
}
//# sourceMappingURL=text.d.ts.map