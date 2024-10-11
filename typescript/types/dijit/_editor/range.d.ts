declare var range: {
    getIndex: (e: any, t: any) => {
        o: number[];
        r: number[];
    };
    getNode: (t: any, n: any) => any;
    getCommonAncestor: (e: any, t: any, i: any) => any;
    getAncestor: (e: any, t: any, i: any) => any;
    BlockTagNames: RegExp;
    getBlockAncestor: (e: any, t: any, i: any) => {
        blockNode: any;
        blockContainer: any;
    };
    atBeginningOfContainer: (e: any, t: any, i: any) => boolean;
    atEndOfContainer: (e: any, t: any, i: any) => boolean;
    adjacentNoneTextNode: (e: any, t: any) => any[];
    create: (e: any) => any;
    getSelection: (e: any, t: any) => any;
};
declare global {
    namespace DojoJS {
        interface Dijit {
            range: typeof range;
        }
    }
}
export = range;
//# sourceMappingURL=range.d.ts.map