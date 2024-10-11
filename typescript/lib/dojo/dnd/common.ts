import has = require("../sniff");
import dojo = require("../_base/kernel");
import lang = require("../_base/lang");
import dom = require("../dom");

var o = lang.getObject("dojo.dnd", true) as DojoJS.dnd.Common;
o.getCopyKeyState = function (t) {
	return (t as any)[has("mac") ? "metaKey" : "ctrlKey"];
};
o._uniqueId = 0;
o.getUniqueId = function () {
	var e;
	do {
		e = dojo._scopeName + "Unique" + ++o._uniqueId;
	} while (dom.byId(e));
	return e;
};
o._empty = {};
o.isFormElement = function (e) {
	var t = e.target as HTMLElement;
	3 == t.nodeType && (t = t.parentNode as HTMLElement);
	return (
		" a button textarea input select option ".indexOf(
			" " + t.tagName.toLowerCase() + " "
		) >= 0
	);
};

declare global {
	namespace DojoJS
	{
		interface DojoDND extends DojoJS.dnd.Common {}
		interface Dojo {
			dnd: DojoDND;
		}
	}
}

export = o;