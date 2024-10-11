declare global {
    namespace DojoJS {
        interface Has {
            (name: 'air'): boolean;
            (name: 'wp'): undefined | number;
            (name: 'msapp'): undefined | number;
            (name: 'khtml'): undefined | number;
            (name: 'edge'): undefined | number;
            (name: 'opr'): undefined | number;
            (name: 'webkit'): undefined | number;
            (name: 'chrome'): undefined | number;
            (name: 'android'): undefined | number;
            (name: 'safari'): undefined | number;
            (name: 'mac'): boolean;
            (name: 'quirks'): boolean;
            (name: 'iphone'): undefined | number;
            (name: 'ipod'): undefined | number;
            (name: 'ipad'): undefined | number;
            (name: 'ios'): undefined | number;
            (name: 'bb'): undefined | number | boolean;
            (name: 'trident'): undefined | number;
            (name: 'svg'): boolean;
            (name: 'opera'): undefined | number;
            (name: 'mozilla'): undefined | number;
            (name: 'ff'): undefined | number;
            (name: 'ie'): undefined | number;
            (name: 'wii'): boolean | any;
        }
    }
}
import has = require("./has");
export = has;
//# sourceMappingURL=sniff.d.ts.map