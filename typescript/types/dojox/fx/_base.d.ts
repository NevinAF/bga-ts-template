import i = require("dojo/_base/fx");
import dojoFx = require("dojo/fx");
declare var dojoxFx: {
    anim: typeof i.anim;
    animateProperty: typeof i.animateProperty;
    fadeTo: typeof i._fade;
    fadeIn: typeof i.fadeIn;
    fadeOut: typeof i.fadeOut;
    combine: typeof dojoFx.combine;
    chain: typeof dojoFx.chain;
    slideTo: typeof dojoFx.slideTo;
    wipeIn: typeof dojoFx.wipeIn;
    wipeOut: typeof dojoFx.wipeOut;
    sizeTo: (e: {
        node: string | HTMLElement;
        method?: string;
        duration?: number;
        width?: number;
        height?: number;
    }) => typeof dojoFx.Animation;
    slideBy: (e: {
        node: string | HTMLElement;
        top?: number;
        left?: number;
    }) => typeof dojoFx.Animation;
    crossFade: (e: {
        nodes: (string | HTMLElement)[];
        duration?: number;
        color?: string;
    }) => typeof dojoFx.Animation;
    highlight: (e: {
        node: string | HTMLElement;
        duration?: number;
        color?: string;
    }) => typeof dojoFx.Animation;
    wipeTo: (e: {
        node: string | HTMLElement;
        width?: number;
        height?: number;
        duration?: number;
    }) => typeof dojoFx.Animation;
};
declare global {
    namespace DojoJS {
        interface Dojox {
            fx: typeof dojoxFx;
        }
    }
}
export = dojoxFx;
//# sourceMappingURL=_base.d.ts.map