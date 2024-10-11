declare function SimpleQueryEngine<O extends DojoJS.QueryOptions>(query: string | Object | Function, options?: O): {
    (array: Object[]): Object[];
    matches(object: Object): boolean;
};
declare global {
    namespace DojoJS {
        interface DojoStoreUtil {
            SimpleQueryEngine: typeof SimpleQueryEngine;
        }
        interface DojoStore {
            util: DojoStoreUtil;
        }
        interface Dojo {
            store: DojoStore;
        }
    }
}
export = SimpleQueryEngine;
//# sourceMappingURL=SimpleQueryEngine.d.ts.map