declare var dtl: any;
declare global {
    namespace DojoJS {
        interface Dojox {
            dtl: Dojox_DTL;
        }
        interface Dojox_DTL {
            _base: any;
            TOKEN_BLOCK: -1;
            TOKEN_VAR: -2;
            TOKEN_COMMENT: -3;
            TOKEN_TEXT: 3;
            _Context: Constructor<any>;
            Token: Constructor<any>;
            text: any;
            Template: Constructor<any>;
            quickFilter: (e: string) => any;
            _QuickNodeList: Constructor<any>;
            _Filter: Constructor<any>;
            _NodeList: Constructor<any>;
            _VarNode: Constructor<any>;
            _noOpNode: any;
            _Parser: Constructor<any>;
            register: {
                _registry: {
                    attributes: any[];
                    tags: any[];
                    filters: any[];
                };
                get: (e: string, t: string) => any;
                getAttributeTags: () => any[];
                _any: (e: string, i: string, n: any) => void;
                tags: (e: string, t: any) => void;
                filters: (e: string, t: any) => void;
            };
            escape: (e: string) => any;
            safe: (e: any) => any;
            mark_safe: (e: any) => any;
        }
        var dojox: Dojox;
    }
}
export = dtl;
//# sourceMappingURL=_base.d.ts.map