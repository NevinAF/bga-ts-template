declare var QueryReadStore: DojoJS.DojoClass<{
    url: string;
    requestMethod: string;
    _className: string;
    _items: never[];
    _lastServerQuery: null;
    _numRows: number;
    lastRequestHash: null;
    doClientPaging: boolean;
    doClientSorting: boolean;
    _itemsByIdentity: null;
    _identifier: null;
    _features: {
        "dojo.data.api.Read": boolean;
        "dojo.data.api.Identity": boolean;
    };
    _labelAttr: string;
    constructor: (t: any) => void;
    getValue: (t: any, i: any, n: any) => any;
    getValues: (e: any, t: any) => any[];
    getAttributes: (e: any) => string[];
    hasAttribute: (e: any, t: any) => boolean;
    containsValue: (e: any, t: any, i: any) => boolean;
    isItem: (e: any) => boolean;
    isItemLoaded: (e: any) => boolean;
    loadItem: (e: any) => void;
    fetch: (t: any) => any;
    getFeatures: () => {
        "dojo.data.api.Read": boolean;
        "dojo.data.api.Identity": boolean;
    };
    close: (e: any) => void;
    getLabel: (e: any) => any;
    getLabelAttributes: (e: any) => string[] | null;
    _xhrFetchHandler: (t: any, i: any, n: any, o: any) => void;
    _fetchItems: (t: any, i: any, n: any) => void;
    _filterResponse: (e: any) => any;
    _assertIsItem: (e: any) => void;
    _assertIsAttribute: (e: any) => void;
    fetchItemByIdentity: (t: any) => void;
    getIdentity: (e: any) => any;
    getIdentityAttributes: (e: any) => null[];
}, [t: any]>;
declare global {
    namespace DojoJS {
        interface Dojox {
            data: {
                QueryReadStore: typeof QueryReadStore;
            };
        }
    }
}
export = QueryReadStore;
//# sourceMappingURL=QueryReadStore.d.ts.map