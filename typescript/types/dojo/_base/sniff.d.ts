import has = require("../sniff");
declare global {
    namespace DojoJS {
        interface Dojo {
            _name: "browser";
            /**
             * True if the client is a web-browser
             */
            isBrowser: boolean;
            /**
             * Version as a Number if client is FireFox. undefined otherwise. Corresponds to
             * major detected FireFox version (1.5, 2, 3, etc.)
             */
            isFF?: number;
            /**
             * Version as a Number if client is MSIE(PC). undefined otherwise. Corresponds to
             * major detected IE version (6, 7, 8, etc.)
             */
            isIE?: number;
            /**
             * Version as a Number if client is a KHTML browser. undefined otherwise. Corresponds to major
             * detected version.
             */
            isKhtml?: number;
            /**
             * Version as a Number if client is a WebKit-derived browser (Konqueror,
             * Safari, Chrome, etc.). undefined otherwise.
             */
            isWebKit?: number;
            /**
             * Version as a Number if client is a Mozilla-based browser (Firefox,
             * SeaMonkey). undefined otherwise. Corresponds to major detected version.
             */
            isMozilla?: number;
            /**
             * Version as a Number if client is a Mozilla-based browser (Firefox,
             * SeaMonkey). undefined otherwise. Corresponds to major detected version.
             */
            isMoz?: number;
            /**
             * Version as a Number if client is Opera. undefined otherwise. Corresponds to
             * major detected version.
             */
            isOpera?: number;
            /**
             * Version as a Number if client is Safari or iPhone. undefined otherwise.
             */
            isSafari?: number;
            /**
             * Version as a Number if client is Chrome browser. undefined otherwise.
             */
            isChrome?: number;
            /**
             * True if the client runs on Mac
             */
            isMac: boolean;
            /**
             * Version as a Number if client is iPhone, iPod, or iPad. undefined otherwise.
             */
            isIos?: number;
            /**
             * Version as a Number if client is android browser. undefined otherwise.
             */
            isAndroid?: number;
            /**
             * True if client is Wii
             */
            isWii: boolean | any;
            /**
             * Page is in quirks mode.
             */
            isQuirks: boolean;
            /**
             * True if client is Adobe Air
             */
            isAir: boolean;
        }
    }
}
export = has;
//# sourceMappingURL=sniff.d.ts.map