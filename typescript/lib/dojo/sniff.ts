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

var nav = navigator,
	navUA = nav.userAgent,
	appVarsion = nav.appVersion,
	versionNumber = parseFloat(appVarsion);
has.add("air", navUA.indexOf("AdobeAIR") >= 0);
has.add("wp", parseFloat(navUA.split("Windows Phone")[1]!) || undefined);
has.add("msapp", parseFloat(navUA.split("MSAppHost/")[1]!) || undefined);
has.add("khtml", appVarsion.indexOf("Konqueror") >= 0 ? versionNumber : undefined);
has.add("edge", parseFloat(navUA.split("Edge/")[1]!) || undefined);
has.add("opr", parseFloat(navUA.split("OPR/")[1]!) || undefined);
has.add(
	"webkit",
	(!has("wp") &&
		!has("edge") &&
		parseFloat(navUA.split("WebKit/")[1]!)) ||
		undefined
);
has.add(
	"chrome",
	(!has("edge") &&
		!has("opr") &&
		parseFloat(navUA.split("Chrome/")[1]!)) ||
		undefined
);
has.add(
	"android",
	(!has("wp") && parseFloat(navUA.split("Android ")[1]!)) || undefined
);
has.add(
	"safari",
	!(appVarsion.indexOf("Safari") >= 0) ||
		has("wp") ||
		has("chrome") ||
		has("android") ||
		has("edge") ||
		has("opr")
		? undefined
		: parseFloat(appVarsion.split("Version/")[1]!)
);
has.add("mac", appVarsion.indexOf("Macintosh") >= 0);
has.add("quirks", "BackCompat" == document.compatMode);
if (!has("wp") && navUA.match(/(iPhone|iPod|iPad)/)) {
	var i = RegExp.$1.replace(/P/, "p"),
		a = navUA.match(/OS ([\d_]+)/) ? RegExp.$1 : "1",
		s = parseFloat(a.replace(/_/, ".").replace(/_/g, ""));
	has.add(i, s);
	has.add("ios", s);
}
has.add(
	"bb",
	((navUA.indexOf("BlackBerry") >= 0 || navUA.indexOf("BB10") >= 0) &&
		parseFloat(navUA.split("Version/")[1]!)) ||
		undefined
);
has.add("trident", parseFloat(appVarsion.split("Trident/")[1]!) || undefined);
has.add("svg", "undefined" != typeof SVGAngle);
if (!has("webkit")) {
	navUA.indexOf("Opera") >= 0 &&
		has.add(
			"opera",
			(versionNumber >= 9.8 && parseFloat(navUA.split("Version/")[1]!)) ||
				versionNumber
		);
	!(navUA.indexOf("Gecko") >= 0) ||
		has("wp") ||
		has("khtml") ||
		has("trident") ||
		has("edge") ||
		has.add("mozilla", versionNumber);
	has("mozilla") &&
		has.add(
			"ff",
			parseFloat(
				navUA.split("Firefox/")[1]! ||
					navUA.split("Minefield/")[1]!
			) || undefined
		);
	if (document.all && !has("opera")) {
		var u = parseFloat(appVarsion.split("MSIE ")[1]!) || undefined,
			// @ts-ignore
			c = document.documentMode;
		c && 5 != c && Math.floor(u!) != c && (u = c);
		has.add("ie", u);
	}
	has.add(
		"wii",
		// @ts-ignore
		"undefined" != typeof opera && opera.wiiremote
	);
}

export = has;