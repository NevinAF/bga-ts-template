import "dojo/_base/lang";
declare global {
    namespace DojoJS {
        interface Dojox_UUID {
            NIL_UUID: "00000000-0000-0000-0000-000000000000";
            version: {
                UNKNOWN: 0;
                TIME_BASED: 1;
                DCE_SECURITY: 2;
                NAME_BASED_MD5: 3;
                RANDOM: 4;
                NAME_BASED_SHA1: 5;
            };
            variant: {
                NCS: "0";
                DCE: "10";
                MICROSOFT: "110";
                UNKNOWN: "111";
            };
            _ourVariantLookupTable: Buffer<Dojox_UUID["variant"][keyof Dojox_UUID["variant"]], 16>;
            assert: (condition: boolean, error?: any) => void | throws<Error>;
            generateNilUuid: () => "00000000-0000-0000-0000-000000000000";
            isValid: (uuid: string) => boolean;
            getVariant: (uuid: string) => "0" | "10" | "110" | "111" | throws<Error>;
            getVersion: (uuid: string) => number | throws<Error>;
            getNode: (uuid: string) => string | throws<Error>;
            getTimestamp: <T extends 'string' | 'hex' | 'date' | DateConstructor | StringConstructor | null = null>(uuid: string, type?: T | null) => (T extends Falsy ? Date : T extends ('string' | StringConstructor | 'hex') ? string : Date) | throws<Error>;
        }
        interface Dojox {
            uuid: Dojox_UUID;
        }
    }
    var dojox: DojoJS.Dojox;
}
declare const _default: DojoJS.Dojox_UUID;
export = _default;
//# sourceMappingURL=_base.d.ts.map