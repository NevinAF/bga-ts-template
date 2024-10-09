// @ts-nocheck

import e = require("dojo/_base/kernel");
import t = require("dojo/_base/lang");
import i = require("dojo/_base/sniff");
import n = require("./tokenize");

var o = t.getObject("string", true, dojox) as DojoJS.Dojox_String;
o.sprintf = function (e, t) {
	for (var i = [], n = 1; n < arguments.length; n++)
		i.push(arguments[n]);
	var a = new o.sprintf.Formatter(e);
	return a.format.apply(a, i);
};
o.sprintf.Formatter = function (e) {
	this._mapped = false;
	this._format = e;
	this._tokens = n(e, this._re, this._parseDelim, this);
};
t.extend(o.sprintf.Formatter, {
	_re: /\%(?:\(([\w_]+)\)|([1-9]\d*)\$)?([0 +\-\#]*)(\*|\d+)?(\.)?(\*|\d+)?[hlL]?([\%scdeEfFgGiouxX])/g,
	_parseDelim: function (e, t, i, n, o, a, s) {
		e && (this._mapped = true);
		return {
			mapping: e,
			intmapping: t,
			flags: i,
			_minWidth: n,
			period: o,
			_precision: a,
			specifier: s,
		};
	},
	_specifiers: {
		b: { base: 2, isInt: true },
		o: { base: 8, isInt: true },
		x: { base: 16, isInt: true },
		X: { extend: ["x"], toUpper: true },
		d: { base: 10, isInt: true },
		i: { extend: ["d"] },
		u: { extend: ["d"], isUnsigned: true },
		c: {
			setArg: function (e) {
				if (!isNaN(e.arg)) {
					var t = parseInt(e.arg);
					if (t < 0 || t > 127)
						throw new Error(
							"invalid character code passed to %c in sprintf"
						);
					e.arg = isNaN(t)
						? "" + t
						: String.fromCharCode(t);
				}
			},
		},
		s: {
			setMaxWidth: function (e) {
				e.maxWidth = "." == e.period ? e.precision : -1;
			},
		},
		e: { isDouble: true, doubleNotation: "e" },
		E: { extend: ["e"], toUpper: true },
		f: { isDouble: true, doubleNotation: "f" },
		F: { extend: ["f"] },
		g: { isDouble: true, doubleNotation: "g" },
		G: { extend: ["g"], toUpper: true },
	},
	format: function (e) {
		if (this._mapped && "object" != typeof e)
			throw new Error("format requires a mapping");
		for (
			var i, n = "", o = 0, a = 0;
			a < this._tokens.length;
			a++
		)
			if ("string" == typeof (i = this._tokens[a]))
				n += i;
			else {
				if (this._mapped) {
					if (undefined === e[i.mapping])
						throw new Error(
							"missing key " + i.mapping
						);
					i.arg = e[i.mapping];
				} else {
					if (i.intmapping)
						o = parseInt(i.intmapping) - 1;
					if (o >= arguments.length)
						throw new Error(
							"got " +
								arguments.length +
								" printf arguments, insufficient for '" +
								this._format +
								"'"
						);
					i.arg = arguments[o++];
				}
				if (!i.compiled) {
					i.compiled = true;
					i.sign = "";
					i.zeroPad = false;
					i.rightJustify = false;
					i.alternative = false;
					for (
						var s = {}, r = i.flags.length;
						r--;

					) {
						var l = i.flags.charAt(r);
						s[l] = true;
						switch (l) {
							case " ":
								i.sign = " ";
								break;
							case "+":
								i.sign = "+";
								break;
							case "0":
								i.zeroPad = !s["-"];
								break;
							case "-":
								i.rightJustify = true;
								i.zeroPad = false;
								break;
							case "#":
								i.alternative = true;
								break;
							default:
								throw Error(
									"bad formatting flag '" +
										i.flags.charAt(r) +
										"'"
								);
						}
					}
					i.minWidth = i._minWidth
						? parseInt(i._minWidth)
						: 0;
					i.maxWidth = -1;
					i.toUpper = false;
					i.isUnsigned = false;
					i.isInt = false;
					i.isDouble = false;
					i.precision = 1;
					"." == i.period &&
						(i._precision
							? (i.precision = parseInt(
									i._precision
								))
							: (i.precision = 0));
					var d = this._specifiers[i.specifier];
					if (undefined === d)
						throw new Error(
							"unexpected specifier '" +
								i.specifier +
								"'"
						);
					if (d.extend) {
						t.mixin(d, this._specifiers[d.extend]);
						delete d.extend;
					}
					t.mixin(i, d);
				}
				"function" == typeof i.setArg && i.setArg(i);
				"function" == typeof i.setMaxWidth &&
					i.setMaxWidth(i);
				if ("*" == i._minWidth) {
					if (this._mapped)
						throw new Error(
							"* width not supported in mapped formats"
						);
					i.minWidth = parseInt(arguments[o++]);
					if (isNaN(i.minWidth))
						throw new Error(
							"the argument for * width at position " +
								o +
								" is not a number in " +
								this._format
						);
					if (i.minWidth < 0) {
						i.rightJustify = true;
						i.minWidth = -i.minWidth;
					}
				}
				if ("*" == i._precision && "." == i.period) {
					if (this._mapped)
						throw new Error(
							"* precision not supported in mapped formats"
						);
					i.precision = parseInt(arguments[o++]);
					if (isNaN(i.precision))
						throw Error(
							"the argument for * precision at position " +
								o +
								" is not a number in " +
								this._format
						);
					if (i.precision < 0) {
						i.precision = 1;
						i.period = "";
					}
				}
				if (i.isInt) {
					"." == i.period && (i.zeroPad = false);
					this.formatInt(i);
				} else if (i.isDouble) {
					"." != i.period && (i.precision = 6);
					this.formatDouble(i);
				}
				this.fitField(i);
				n += "" + i.arg;
			}
		return n;
	},
	_zeros10: "0000000000",
	_spaces10: "          ",
	formatInt: function (e) {
		var t = parseInt(e.arg);
		if (!isFinite(t)) {
			if ("number" != typeof e.arg)
				throw new Error(
					"format argument '" +
						e.arg +
						"' not an integer; parseInt returned " +
						t
				);
			t = 0;
		}
		t < 0 &&
			(e.isUnsigned || 10 != e.base) &&
			(t = 4294967295 + t + 1);
		if (t < 0) {
			e.arg = (-t).toString(e.base);
			this.zeroPad(e);
			e.arg = "-" + e.arg;
		} else {
			e.arg = t.toString(e.base);
			t || e.precision ? this.zeroPad(e) : (e.arg = "");
			e.sign && (e.arg = e.sign + e.arg);
		}
		if (16 == e.base) {
			e.alternative && (e.arg = "0x" + e.arg);
			e.arg = e.toUpper
				? e.arg.toUpperCase()
				: e.arg.toLowerCase();
		}
		8 == e.base &&
			e.alternative &&
			"0" != e.arg.charAt(0) &&
			(e.arg = "0" + e.arg);
	},
	formatDouble: function (e) {
		var t = parseFloat(e.arg);
		if (!isFinite(t)) {
			if ("number" != typeof e.arg)
				throw new Error(
					"format argument '" +
						e.arg +
						"' not a float; parseFloat returned " +
						t
				);
			t = 0;
		}
		switch (e.doubleNotation) {
			case "e":
				e.arg = t.toExponential(e.precision);
				break;
			case "f":
				e.arg = t.toFixed(e.precision);
				break;
			case "g":
				Math.abs(t) < 1e-4
					? (e.arg = t.toExponential(
							e.precision > 0
								? e.precision - 1
								: e.precision
						))
					: (e.arg = t.toPrecision(e.precision));
				if (!e.alternative) {
					e.arg = e.arg.replace(/(\..*[^0])0*/, "$1");
					e.arg = e.arg
						.replace(/\.0*e/, "e")
						.replace(/\.0$/, "");
				}
				break;
			default:
				throw new Error(
					"unexpected double notation '" +
						e.doubleNotation +
						"'"
				);
		}
		e.arg = e.arg
			.replace(/e\+(\d)$/, "e+0$1")
			.replace(/e\-(\d)$/, "e-0$1");
		i("opera") && (e.arg = e.arg.replace(/^\./, "0."));
		if (e.alternative) {
			e.arg = e.arg.replace(/^(\d+)$/, "$1.");
			e.arg = e.arg.replace(/^(\d+)e/, "$1.e");
		}
		t >= 0 && e.sign && (e.arg = e.sign + e.arg);
		e.arg = e.toUpper
			? e.arg.toUpperCase()
			: e.arg.toLowerCase();
	},
	zeroPad: function (e, t) {
		t = 2 == arguments.length ? t : e.precision;
		"string" != typeof e.arg && (e.arg = "" + e.arg);
		for (var i = t - 10; e.arg.length < i; )
			e.arg = e.rightJustify
				? e.arg + this._zeros10
				: this._zeros10 + e.arg;
		var n = t - e.arg.length;
		e.arg = e.rightJustify
			? e.arg + this._zeros10.substring(0, n)
			: this._zeros10.substring(0, n) + e.arg;
	},
	fitField: function (e) {
		if (e.maxWidth >= 0 && e.arg.length > e.maxWidth)
			return e.arg.substring(0, e.maxWidth);
		e.zeroPad
			? this.zeroPad(e, e.minWidth)
			: this.spacePad(e);
	},
	spacePad: function (e, t) {
		t = 2 == arguments.length ? t : e.minWidth;
		"string" != typeof e.arg && (e.arg = "" + e.arg);
		for (var i = t - 10; e.arg.length < i; )
			e.arg = e.rightJustify
				? e.arg + this._spaces10
				: this._spaces10 + e.arg;
		var n = t - e.arg.length;
		e.arg = e.rightJustify
			? e.arg + this._spaces10.substring(0, n)
			: this._spaces10.substring(0, n) + e.arg;
	},
});

declare global {
	namespace DojoJS
	{
		interface Dojox_String {
			sprintf: {
				(e: string, t: any): string;
				Formatter: {
					new (e: string): {
						_mapped: boolean;
						_format: string;
						_tokens: any[];
						_re: RegExp;
						_parseDelim: (e: any, t: any, i: any, n: any, o: any, a: any, s: any) => { mapping: any; intmapping: any; flags: any; _minWidth: any; period: any; _precision: any; specifier: any; };
						_specifiers: {
							b: { base: number; isInt: boolean; };
							o: { base: number; isInt: boolean; };
							x: { base: number; isInt: boolean; };
							X: { extend: string[]; toUpper: boolean; };
							d: { base: number; isInt: boolean; };
							i: { extend: string[]; };
							u: { extend: string[]; isUnsigned: boolean; };
							c: {
								setArg: (e: any) => void;
							};
							s: {
								setMaxWidth: (e: any) => void;
							};
							e: { isDouble: boolean; doubleNotation: string; };
							E: { extend: string[]; toUpper: boolean; };
							f: { isDouble: boolean; doubleNotation: string; };
							F: { extend: string[]; };
							g: { isDouble: boolean; doubleNotation: string; };
							G: { extend: string[]; toUpper: boolean; };
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

export = o.sprintf;