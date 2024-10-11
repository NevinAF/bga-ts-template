declare global {
    namespace DojoJS {
        interface Dojox_DTL_Filter {
            htmlstrings: {
                _linebreaksrn: RegExp;
                _linebreaksn: RegExp;
                _linebreakss: RegExp;
                _linebreaksbr: RegExp;
                _removetagsfind: RegExp;
                _striptags: RegExp;
                linebreaks(e: string): string;
                linebreaksbr(e: string): string;
                removetags(e: string, t: string): string;
                striptags(e: string): string;
            };
        }
        interface Dojox_DTL {
            filter: Dojox_DTL_Filter;
        }
    }
}
declare const _default: DojoJS.Dojox_DTL_Filter["htmlstrings"];
export = _default;
//# sourceMappingURL=htmlstrings.d.ts.map