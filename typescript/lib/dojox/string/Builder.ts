// @ts-nocheck

import e = require("dojo/_base/lang");

var Builder = (e.getObject("string", true, dojox).Builder = function (
	e
) {
	var t = "";
	this.length = 0;
	this.append = function (e) {
		if (arguments.length > 1) {
			var i = "";
			switch (arguments.length) {
				case 9:
					i = "" + arguments[8] + i;
				case 8:
					i = "" + arguments[7] + i;
				case 7:
					i = "" + arguments[6] + i;
				case 6:
					i = "" + arguments[5] + i;
				case 5:
					i = "" + arguments[4] + i;
				case 4:
					i = "" + arguments[3] + i;
				case 3:
					i = "" + arguments[2] + i;
				case 2:
					t += "" + arguments[0] + arguments[1] + i;
					break;
				default:
					for (var n = 0; n < arguments.length; )
						i += arguments[n++];
					t += i;
			}
		} else t += e;
		this.length = t.length;
		return this;
	};
	this.concat = function (e) {
		return this.append.apply(this, arguments);
	};
	this.appendArray = function (e) {
		return this.append.apply(this, e);
	};
	this.clear = function () {
		t = "";
		this.length = 0;
		return this;
	};
	this.replace = function (e, i) {
		t = t.replace(e, i);
		this.length = t.length;
		return this;
	};
	this.remove = function (e, i) {
		undefined === i && (i = t.length);
		if (0 == i) return this;
		t = t.substr(0, e) + t.substr(e + i);
		this.length = t.length;
		return this;
	};
	this.insert = function (e, i) {
		t = 0 == e ? i + t : t.slice(0, e) + i + t.slice(e);
		this.length = t.length;
		return this;
	};
	this.toString = function () {
		return t;
	};
	e && this.append(e);
} as DojoJS.StringBuilder);

declare global {
	namespace DojoJS
	{
		interface StringBuilder {
			length: number;
			append: (... args: any[]) => this;
			concat: (... args: any[]) => this;
			appendArray: (e: any[]) => this;
			clear: () => this;
			replace: (e: any, i: any) => this;
			remove: (e: number, i?: number) => this;
			insert: (e: number, i: string) => this;
			toString: () => string;
		}

		interface Dojox_String {
			Builder: {
				new (e: string): StringBuilder;
			};
		}
		interface Dojox {
			string: Dojox_String;
		}
		var dojox: Dojox;
	}
}

export = Builder;