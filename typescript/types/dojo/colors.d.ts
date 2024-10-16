import Color = require("./_base/Color");
declare var colors: {
    makeGrey: (value: string | number, alpha: string | number) => Color;
};
declare var _extendedColorNames: {
    aliceblue: number[];
    antiquewhite: number[];
    aquamarine: number[];
    azure: number[];
    beige: number[];
    bisque: number[];
    blanchedalmond: number[];
    blueviolet: number[];
    brown: number[];
    burlywood: number[];
    cadetblue: number[];
    chartreuse: number[];
    chocolate: number[];
    coral: number[];
    cornflowerblue: number[];
    cornsilk: number[];
    crimson: number[];
    cyan: number[];
    darkblue: number[];
    darkcyan: number[];
    darkgoldenrod: number[];
    darkgray: number[];
    darkgreen: number[];
    darkgrey: number[];
    darkkhaki: number[];
    darkmagenta: number[];
    darkolivegreen: number[];
    darkorange: number[];
    darkorchid: number[];
    darkred: number[];
    darksalmon: number[];
    darkseagreen: number[];
    darkslateblue: number[];
    darkslategray: number[];
    darkslategrey: number[];
    darkturquoise: number[];
    darkviolet: number[];
    deeppink: number[];
    deepskyblue: number[];
    dimgray: number[];
    dimgrey: number[];
    dodgerblue: number[];
    firebrick: number[];
    floralwhite: number[];
    forestgreen: number[];
    gainsboro: number[];
    ghostwhite: number[];
    gold: number[];
    goldenrod: number[];
    greenyellow: number[];
    grey: number[];
    honeydew: number[];
    hotpink: number[];
    indianred: number[];
    indigo: number[];
    ivory: number[];
    khaki: number[];
    lavender: number[];
    lavenderblush: number[];
    lawngreen: number[];
    lemonchiffon: number[];
    lightblue: number[];
    lightcoral: number[];
    lightcyan: number[];
    lightgoldenrodyellow: number[];
    lightgray: number[];
    lightgreen: number[];
    lightgrey: number[];
    lightpink: number[];
    lightsalmon: number[];
    lightseagreen: number[];
    lightskyblue: number[];
    lightslategray: number[];
    lightslategrey: number[];
    lightsteelblue: number[];
    lightyellow: number[];
    limegreen: number[];
    linen: number[];
    magenta: number[];
    mediumaquamarine: number[];
    mediumblue: number[];
    mediumorchid: number[];
    mediumpurple: number[];
    mediumseagreen: number[];
    mediumslateblue: number[];
    mediumspringgreen: number[];
    mediumturquoise: number[];
    mediumvioletred: number[];
    midnightblue: number[];
    mintcream: number[];
    mistyrose: number[];
    moccasin: number[];
    navajowhite: number[];
    oldlace: number[];
    olivedrab: number[];
    orange: number[];
    orangered: number[];
    orchid: number[];
    palegoldenrod: number[];
    palegreen: number[];
    paleturquoise: number[];
    palevioletred: number[];
    papayawhip: number[];
    peachpuff: number[];
    peru: number[];
    pink: number[];
    plum: number[];
    powderblue: number[];
    rosybrown: number[];
    royalblue: number[];
    saddlebrown: number[];
    salmon: number[];
    sandybrown: number[];
    seagreen: number[];
    seashell: number[];
    sienna: number[];
    skyblue: number[];
    slateblue: number[];
    slategray: number[];
    slategrey: number[];
    snow: number[];
    springgreen: number[];
    steelblue: number[];
    tan: number[];
    thistle: number[];
    tomato: number[];
    turquoise: number[];
    violet: number[];
    wheat: number[];
    whitesmoke: number[];
    yellowgreen: number[];
};
type ExtendedColorNames = typeof _extendedColorNames;
declare global {
    namespace DojoJS {
        interface Dojo {
            colors: typeof colors;
        }
        interface ColorNames extends ExtendedColorNames {
        }
    }
}
export = Color;
//# sourceMappingURL=colors.d.ts.map