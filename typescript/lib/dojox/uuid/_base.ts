import dojo = require("dojo/_base/kernel");
import "dojo/_base/lang";

dojo.getObject("uuid", true, dojox);
dojox.uuid.NIL_UUID = "00000000-0000-0000-0000-000000000000";
dojox.uuid.version = {
	UNKNOWN: 0,
	TIME_BASED: 1,
	DCE_SECURITY: 2,
	NAME_BASED_MD5: 3,
	RANDOM: 4,
	NAME_BASED_SHA1: 5,
};
dojox.uuid.variant = {
	NCS: "0",
	DCE: "10",
	MICROSOFT: "110",
	UNKNOWN: "111",
};
dojox.uuid.assert = function (e, t) {
	if (!e) {
		t ||
			(t =
				"An assert statement failed.\nThe method dojox.uuid.assert() was called with a 'false' value.\n");
		throw new Error(t);
	}
};
dojox.uuid.generateNilUuid = function () {
	return dojox.uuid.NIL_UUID;
};
dojox.uuid.isValid = function (t) {
	t = t.toString();
	var i =
		dojo.isString(t) && 36 == t.length && t == t.toLowerCase();
	if (i) {
		var split = t.split("-");
		i =
			5 == split.length &&
			8 == split[0]!.length &&
			4 == split[1]!.length &&
			4 == split[2]!.length &&
			4 == split[3]!.length &&
			12 == split[4]!.length;
		for (var key in split) {
			var a = split[key]!,
				s = parseInt(a, 16);
			i = i && isFinite(s);
		}
	}
	return i;
};
dojox.uuid.getVariant = function (uuid) {
	if (!dojox.uuid._ourVariantLookupTable) {
		var t = dojox.uuid.variant,
			i = new Array(16) as DojoJS.Dojox_UUID["_ourVariantLookupTable"];
		i[0] = t.NCS;
		i[1] = t.NCS;
		i[2] = t.NCS;
		i[3] = t.NCS;
		i[4] = t.NCS;
		i[5] = t.NCS;
		i[6] = t.NCS;
		i[7] = t.NCS;
		i[8] = t.DCE;
		i[9] = t.DCE;
		i[10] = t.DCE;
		i[11] = t.DCE;
		i[12] = t.MICROSOFT;
		i[13] = t.MICROSOFT;
		i[14] = t.UNKNOWN;
		i[15] = t.UNKNOWN;
		dojox.uuid._ourVariantLookupTable = i;
	}
	var n = (uuid = uuid.toString()).charAt(19),
		o = parseInt(n, 16);
	dojox.uuid.assert(o >= 0 && o <= 16);
	return dojox.uuid._ourVariantLookupTable[o]!;
};
dojox.uuid.getVersion = function (e) {
	dojox.uuid.assert(
		dojox.uuid.getVariant(e) == dojox.uuid.variant.DCE,
		"dojox.uuid.getVersion() was not passed a DCE Variant UUID."
	);
	var t = (e = e.toString()).charAt(14);
	return parseInt(t, 16);
};
dojox.uuid.getNode = function (uuid) {
	dojox.uuid.assert(
		dojox.uuid.getVersion(uuid) ==
			dojox.uuid.version.TIME_BASED,
		"dojox.uuid.getNode() was not passed a TIME_BASED UUID."
	);
	return uuid.toString().split("-")[4]!;
};
dojox.uuid.getTimestamp = function (uuid, type) {
	dojox.uuid.assert(
		dojox.uuid.getVersion(uuid) ==
			dojox.uuid.version.TIME_BASED,
		"dojox.uuid.getTimestamp() was not passed a TIME_BASED UUID."
	);
	uuid = uuid.toString();
	switch (type) {
		case "string":
		case String:
			return dojox.uuid
				.getTimestamp(uuid, null)
				.toUTCString();
		case "hex":
			var i = uuid.split("-"),
				n = i[0]!,
				o = i[1]!,
				a = i[2]!,
				s = (a = a.slice(1)) + o + n;
			dojox.uuid.assert(15 == s.length);
			return s;
		case null:
		case undefined:
		case "date":
		case Date:
			var r = uuid.split("-"),
				l = parseInt(r[0]!, 16),
				d = parseInt(r[1]!, 16),
				c = 4095 & parseInt(r[2]!, 16);
			c <<= 16;
			c += d;
			c *= 4294967296;
			c += l;
			return new Date(c / 1e4 - 122192928e5);
		default:
			dojox.uuid.assert(
				false,
				"dojox.uuid.getTimestamp was not passed a valid returnType: " +
					type
			);
			throw new Error();
	}
} as DojoJS.Dojox_UUID["getTimestamp"];

declare global {
	namespace DojoJS
	{
		interface Dojox_UUID
		{
			NIL_UUID: "00000000-0000-0000-0000-000000000000";
			version: { UNKNOWN: 0, TIME_BASED: 1, DCE_SECURITY: 2, NAME_BASED_MD5: 3, RANDOM: 4, NAME_BASED_SHA1: 5 };
			variant: { NCS: "0", DCE: "10", MICROSOFT: "110", UNKNOWN: "111" };
			_ourVariantLookupTable: Buffer<Dojox_UUID["variant"][keyof Dojox_UUID["variant"]], 16>;
			assert: (condition: boolean, error?: any) => void | throws<Error>;
			generateNilUuid: () => "00000000-0000-0000-0000-000000000000";
			isValid: (uuid: string) => boolean;
			getVariant: (uuid: string) => "0" | "10" | "110" | "111" | throws<Error>;
			getVersion: (uuid: string) => number | throws<Error>;
			getNode: (uuid: string) => string | throws<Error>;
			getTimestamp: <T extends 'string' | 'hex' | 'date' | DateConstructor | StringConstructor | null = null>(uuid: string, type?: T | null) => (T extends Falsy ? Date : T extends ('string' | StringConstructor | 'hex') ? string : Date) | throws<Error>;
		}

		interface Dojox
		{
			uuid: Dojox_UUID;
		}
	}

	var dojox: DojoJS.Dojox;
}

export = dojox.uuid;