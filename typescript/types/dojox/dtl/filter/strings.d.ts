declare var filter: any;
declare global {
    namespace DojoJS {
        interface Dojox_DTL_Filter {
            strings: {
                _urlquote: (e: string, t?: string) => string;
                addslashes: (e: string) => string;
                capfirst: (e: string) => string;
                center: (e: string, t?: number) => string;
                cut: (e: string, t: string) => string;
                fix_ampersands: (e: string) => string;
                floatformat: (e: string, t: number) => string;
                iriencode: (e: string) => string;
                linenumbers: (e: string) => string;
                ljust: (e: string, t: number) => string;
                lower: (e: string) => string;
                make_list: (e: any) => any[];
                rjust: (e: string, t: number) => string;
                slugify: (e: string) => string;
                stringformat: (e: string, t: string) => string;
                title: (e: string) => string;
                truncatewords: (e: string, t: number) => string;
                truncatewords_html: (e: string, t: number) => string;
                upper: (e: string) => string;
                urlencode: (e: string) => string;
                urlize: (e: string) => string;
                urlizetrunc: (e: string, t: number) => string;
                wordcount: (t: string) => number;
                wordwrap: (e: string, t: number) => string;
                _strings: any;
            };
        }
        interface Dojox_DTL {
            filter: Dojox_DTL_Filter;
        }
    }
}
export = filter;
//# sourceMappingURL=strings.d.ts.map