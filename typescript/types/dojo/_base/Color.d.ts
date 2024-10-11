declare var _baseColorNames: {
    black: number[];
    silver: number[];
    gray: number[];
    white: number[];
    maroon: number[];
    red: number[];
    purple: number[];
    fuchsia: number[];
    green: number[];
    lime: number[];
    olive: number[];
    yellow: number[];
    navy: number[];
    blue: number[];
    teal: number[];
    aqua: number[];
    transparent: [number, number, number] | [number, number, number, number];
};
declare class Color {
    /** The red component of the color as an RGBA value. Always between 0-255. */
    r: number;
    /** The green component of the color as an RGBA value. Always between 0-255. */
    g: number;
    /** The blue component of the color as an RGBA value. Always between 0-255. */
    b: number;
    /** The alpha component of the color as an RGBA value. Always between 0-1. */
    a: number;
    /** Creates a new color object using the {@link setColor} method. */
    constructor(color?: any[] | string | {
        r: number;
        g: number;
        b: number;
        a: number;
    });
    /** Takes a named string, hex string, array of rgb or rgba values,
     * an object with r, g, b, and a properties, or another `Color` object
     * and sets this color instance to that value.
     */
    setColor(color?: any[] | string | {
        r: number;
        g: number;
        b: number;
        a: number;
    }): Color;
    /**
     * Ensures the object has correct attributes and all values are within the required ranges.
     */
    sanitize(): Color;
    /**
     * Returns 3 component array of rgb values
     */
    toRgb(): [number, number, number];
    /**
     * Returns a 4 component array of rgba values from the color represented by
     * this object.
     */
    toRgba(): [number, number, number, number];
    /**
     * Returns a CSS color string in hexadecimal representation
     */
    toHex(): string;
    /**
     * Returns a css color string in rgb(a) representation
     */
    toCss(includeAlpha?: boolean): string;
    /**
     * Returns the css color string representation with alpha
     */
    toString(): string;
    /**
     * Sets the properties of the color object matching the given arguments.
     */
    _set(r: number, g: number, b: number, a: number): void;
    /**
     * Dictionary list of all CSS named colors, by name. Values are 3-item arrays with corresponding RG and B values.
     */
    static named: DojoJS.ColorNames;
    /**
     * Blend colors end and start with weight from 0 to 1, 0.5 being a 50/50 blend,
     * can reuse a previously allocated Color object for the result
     */
    static blendColors(start: Color, end: Color, weight: number, obj?: Color): Color;
    /**
     * Returns a `Color` instance from a string of the form
     * "rgb(...)" or "rgba(...)". Optionally accepts a `Color`
     * object to update with the parsed value and return instead of
     * creating a new object.
     */
    static fromRgb(color: string, obj?: Color): Color | null;
    /**
     * Converts a hex string with a '#' prefix to a color object.
     * Supports 12-bit #rgb shorthand. Optionally accepts a
     * `Color` object to update with the parsed value.
     */
    static fromHex<T extends string>(color: T, obj?: Color): T extends InferHexColor<T> ? Color : (Color | null);
    /**
     * Builds a `Color` from a 3 or 4 element array, mapping each
     * element in sequence to the rgb(a) values of the color.
     */
    static fromArray(color: any[], obj?: Color): Color;
    /**
     * Parses `str` for a color value. Accepts named color, hex, rgb, and rgba
     * style color values.
     */
    static fromString<T extends string>(str: T, obj?: Color): T extends keyof DojoJS.ColorNames ? Color : (T extends InferHexColor<T> ? Color : (Color | null));
    /**
     * Returns a new `Color` instance based on the provided value (brightness) of a grayscale color.
     * @throws {Error} "dojo/colors" has not been loaded and is needed to use this function
     */
    static makeGrey(value: string | number, alpha: string | number): Color;
}
type BaseColorNames = typeof _baseColorNames;
declare global {
    namespace DojoJS {
        interface Dojo {
            /**
             * The `Color` object provides various utility functions for creating and manipulating colors.
             */
            Color: typeof Color;
            blendColors: typeof Color.blendColors;
            colorFromRgb: typeof Color.fromRgb;
            colorFromHex: typeof Color.fromHex;
            colorFromArray: typeof Color.fromArray;
            colorFromString: typeof Color.fromString;
        }
        interface ColorNames extends BaseColorNames {
        }
    }
}
export = Color;
//# sourceMappingURL=Color.d.ts.map