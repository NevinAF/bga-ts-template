import dojo = require("./kernel");
import lang = require("./lang");
import array = require("./array");
import config = require("./config");

var _baseColorNames = {
	black: [0, 0, 0],
	silver: [192, 192, 192],
	gray: [128, 128, 128],
	white: [255, 255, 255],
	maroon: [128, 0, 0],
	red: [255, 0, 0],
	purple: [128, 0, 128],
	fuchsia: [255, 0, 255],
	green: [0, 128, 0],
	lime: [0, 255, 0],
	olive: [128, 128, 0],
	yellow: [255, 255, 0],
	navy: [0, 0, 128],
	blue: [0, 0, 255],
	teal: [0, 128, 128],
	aqua: [0, 255, 255],
	transparent: config.transparentColor || [0, 0, 0, 0],
}

// Generate the class from the above js code and interfaces
class Color {
	/** The red component of the color as an RGBA value. Always between 0-255. */
	r: number = 255;
	/** The green component of the color as an RGBA value. Always between 0-255. */
	g: number = 255;
	/** The blue component of the color as an RGBA value. Always between 0-255. */
	b: number = 255;
	/** The alpha component of the color as an RGBA value. Always between 0-1. */
	a: number = 1;

	/** Creates a new color object using the {@link setColor} method. */
	constructor(color?: any[] | string | { r: number, g: number, b: number, a: number }) {
		this.setColor(color);
	}

	/** Takes a named string, hex string, array of rgb or rgba values,
	 * an object with r, g, b, and a properties, or another `Color` object
	 * and sets this color instance to that value.
	 */
	setColor(color?: any[] | string | { r: number, g: number, b: number, a: number }): Color {
		if (lang.isString(color)) {
			Color.fromString(color as string, this);
		} else if (lang.isArray(color)) {
			Color.fromArray(color as number[], this);
		} else {
			// @ts-ignore - TODO: does this actually just throw an error? Does new Color() throw an error?
			this._set(color.r, color.g, color.b, color.a);
			if (!(color instanceof Color)) {
				this.sanitize();
			}
		}
		return this;
	}

	/**
	 * Ensures the object has correct attributes and all values are within the required ranges.
	 */
	sanitize(): Color {
		// This function is defined in "dojo/colors"
		return this;
	}

	/**
	 * Returns 3 component array of rgb values
	 */
	toRgb(): [number, number, number] {
		return [this.r, this.g, this.b];
	}

	/**
	 * Returns a 4 component array of rgba values from the color represented by
	 * this object.
	 */
	toRgba(): [number, number, number, number] {
		return [this.r, this.g, this.b, this.a];
	}

	/**
	 * Returns a CSS color string in hexadecimal representation
	 */
	toHex(): string {
		return "#" + array.map(["r", "g", "b"], function (this: Color, e: keyof Color) {
			var t = this[e].toString(16);
			return t.length < 2 ? "0" + t : t;
		}, this).join("");
	}

	/**
	 * Returns a css color string in rgb(a) representation
	 */
	toCss(includeAlpha?: boolean): string {
		var n = this.r + ", " + this.g + ", " + this.b;
		return (includeAlpha ? "rgba(" + n + ", " + this.a : "rgb(" + n) + ")";
	}

	/**
	 * Returns the css color string representation with alpha
	 */
	toString(): string {
		return this.toCss(true);
	}

	/**
	 * Sets the properties of the color object matching the given arguments.
	 */
	_set(r: number, g: number, b: number, a: number): void {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	/**
	 * Dictionary list of all CSS named colors, by name. Values are 3-item arrays with corresponding RG and B values.
	 */
	// @ts-ignore - As long as all imports are made, this is valid, but this could possibly be missing colors based on import order.
	static named: DojoJS.ColorNames = _baseColorNames;

	/**
	 * Blend colors end and start with weight from 0 to 1, 0.5 being a 50/50 blend,
	 * can reuse a previously allocated Color object for the result
	 */
	static blendColors(start: Color, end: Color, weight: number, obj?: Color): Color {
		var i = obj || new Color();
		i.r = Math.round(start.r + (end.r - start.r) * weight);
		i.g = Math.round(start.g + (end.g - start.g) * weight);
		i.b = Math.round(start.b + (end.b - start.b) * weight);
		i.a = start.a + (end.a - start.a) * weight;
		return i.sanitize();
	}

	/**
	 * Returns a `Color` instance from a string of the form
	 * "rgb(...)" or "rgba(...)". Optionally accepts a `Color`
	 * object to update with the parsed value and return instead of
	 * creating a new object.
	 */
	static fromRgb(color: string, obj?: Color): Color | null {
		var n = color.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);
		return n && Color.fromArray(n[1]!.split(/\s*,\s*/), obj);
	}

	/**
	 * Converts a hex string with a '#' prefix to a color object.
	 * Supports 12-bit #rgb shorthand. Optionally accepts a
	 * `Color` object to update with the parsed value.
	 */
	static fromHex<T extends string>(color: T, obj?: Color): T extends InferHexColor<T> ? Color : (Color | null) {
		var r = obj || new Color(),
			i = 4 == color.length ? 4 : 8,
			a = (1 << i) - 1;
		let hex = Number("0x" + color.substr(1));
		// @ts-ignore
		if (isNaN(hex)) return null;
		array.forEach(["b", "g", "r"], function (t: keyof Color) {
			var n = hex & a;
			hex >>= i;
			// @ts-ignore
			r[t] = 4 == i ? 17 * n : n;
		});
		r.a = 1;
		// @ts-ignore
		return r;
	}

	/**
	 * Builds a `Color` from a 3 or 4 element array, mapping each
	 * element in sequence to the rgb(a) values of the color.
	 */
	static fromArray(color: any[], obj?: Color): Color {
		var n = obj || new Color();
		n._set(
			Number(color[0]),
			Number(color[1]),
			Number(color[2]),
			Number(color[3])
		);
		isNaN(n.a) && (n.a = 1);
		return n.sanitize();
	}

	/**
	 * Parses `str` for a color value. Accepts named color, hex, rgb, and rgba
	 * style color values.
	 */
	static fromString<T extends string>(str: T, obj?: Color):
		T extends keyof DojoJS.ColorNames ? Color : (T extends InferHexColor<T> ? Color : (Color | null))
	{
		// @ts-ignore - this is a test for if the named string exists in the named colors
		var n: number[] | undefined = Color.named[str];
		// @ts-ignore
		return (
			(n && Color.fromArray(n, obj)) ||
			Color.fromRgb(str, obj) ||
			Color.fromHex(str, obj)
		);
	}

	/**
	 * Returns a new `Color` instance based on the provided value (brightness) of a grayscale color.
	 * @throws {Error} "dojo/colors" has not been loaded and is needed to use this function
	 */
	static makeGrey(value: string | number, alpha: string | number): Color {
		throw new Error("\"dojo/colors\" has not been loaded and is needed to use this function");
	}
}

var test0 = Color.fromString("red");
var test1 = Color.fromString("#aaa354");

type BaseColorNames = typeof _baseColorNames;

declare global {
	namespace DojoJS
	{
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

		interface ColorNames extends BaseColorNames {}
	}
}

dojo.Color = Color;
dojo.blendColors = Color.blendColors;
dojo.colorFromRgb = Color.fromRgb;
dojo.colorFromHex = Color.fromHex;
dojo.colorFromArray = Color.fromArray;
dojo.colorFromString = Color.fromString;

export = Color;