/** The dojoConfig object sets options and default behavior for various aspects of the dojo toolkit. This is the same object as {@link DojoJS.config}, but loaded before. */
declare var dojoConfig: DojoJS._base.Config;
/**
 * The configuration object for bga
 */
declare var bgaConfig: {
    webrtcEnabled: boolean;
    facebookAppId: string;
    googleAppId: string;
    requestToken: string;
    genderRegexps: {
        [local: string]: {
            'forMasculine': Record<string, string>;
            'forFeminine': Record<string, string>;
            'forNeutral'?: Record<string, string>;
        };
    };
};
declare var webrtcConfig: {
    pcConfig: RTCConfiguration;
    pcConstraints: object;
    audioSendCodec: string;
    audioReceiveCodec: string;
    iceTricklingEnabled: boolean;
};
/** If true, the browser has at least one extension that is incompatible with the BGA site. */
declare var bAtLeastOneIncompatibility: boolean;
/** A helper object used to build html string for several uses within the script tags on the html page. */
declare var html: string;
declare var testArray: string[];
declare var testObject: {};
//# sourceMappingURL=script-tags-1.d.ts.map