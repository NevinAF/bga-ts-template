declare global {
    namespace DojoJS {
        interface Dojox_String {
            sprintf: {
                (e: string, t: any): string;
                Formatter: {
                    new (e: string): {
                        _mapped: boolean;
                        _format: string;
                        _tokens: any[];
                        _re: RegExp;
                        _parseDelim: (e: any, t: any, i: any, n: any, o: any, a: any, s: any) => {
                            mapping: any;
                            intmapping: any;
                            flags: any;
                            _minWidth: any;
                            period: any;
                            _precision: any;
                            specifier: any;
                        };
                        _specifiers: {
                            b: {
                                base: number;
                                isInt: boolean;
                            };
                            o: {
                                base: number;
                                isInt: boolean;
                            };
                            x: {
                                base: number;
                                isInt: boolean;
                            };
                            X: {
                                extend: string[];
                                toUpper: boolean;
                            };
                            d: {
                                base: number;
                                isInt: boolean;
                            };
                            i: {
                                extend: string[];
                            };
                            u: {
                                extend: string[];
                                isUnsigned: boolean;
                            };
                            c: {
                                setArg: (e: any) => void;
                            };
                            s: {
                                setMaxWidth: (e: any) => void;
                            };
                            e: {
                                isDouble: boolean;
                                doubleNotation: string;
                            };
                            E: {
                                extend: string[];
                                toUpper: boolean;
                            };
                            f: {
                                isDouble: boolean;
                                doubleNotation: string;
                            };
                            F: {
                                extend: string[];
                            };
                            g: {
                                isDouble: boolean;
                                doubleNotation: string;
                            };
                            G: {
                                extend: string[];
                                toUpper: boolean;
                            };
                        };
                        format: (e: any) => string;
                        _zeros10: string;
                        _spaces10: string;
                        formatInt: (e: any) => void;
                        formatDouble: (e: any) => void;
                        zeroPad: (e: any, t: any) => void;
                        fitField: (e: any) => string;
                        spacePad: (e: any, t: any) => void;
                    };
                };
            };
        }
        interface Dojox {
            string: Dojox_String;
        }
        var dojox: Dojox;
    }
}
declare const _default: {
    (e: string, t: any): string;
    Formatter: {
        new (e: string): {
            _mapped: boolean;
            _format: string;
            _tokens: any[];
            _re: RegExp;
            _parseDelim: (e: any, t: any, i: any, n: any, o: any, a: any, s: any) => {
                mapping: any;
                intmapping: any;
                flags: any;
                _minWidth: any;
                period: any;
                _precision: any;
                specifier: any;
            };
            _specifiers: {
                b: {
                    base: number;
                    isInt: boolean;
                };
                o: {
                    base: number;
                    isInt: boolean;
                };
                x: {
                    base: number;
                    isInt: boolean;
                };
                X: {
                    extend: string[];
                    toUpper: boolean;
                };
                d: {
                    base: number;
                    isInt: boolean;
                };
                i: {
                    extend: string[];
                };
                u: {
                    extend: string[];
                    isUnsigned: boolean;
                };
                c: {
                    setArg: (e: any) => void;
                };
                s: {
                    setMaxWidth: (e: any) => void;
                };
                e: {
                    isDouble: boolean;
                    doubleNotation: string;
                };
                E: {
                    extend: string[];
                    toUpper: boolean;
                };
                f: {
                    isDouble: boolean;
                    doubleNotation: string;
                };
                F: {
                    extend: string[];
                };
                g: {
                    isDouble: boolean;
                    doubleNotation: string;
                };
                G: {
                    extend: string[];
                    toUpper: boolean;
                };
            };
            format: (e: any) => string;
            _zeros10: string;
            _spaces10: string;
            formatInt: (e: any) => void;
            formatDouble: (e: any) => void;
            zeroPad: (e: any, t: any) => void;
            fitField: (e: any) => string;
            spacePad: (e: any, t: any) => void;
        };
    };
};
export = _default;
//# sourceMappingURL=sprintf.d.ts.map