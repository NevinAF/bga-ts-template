import lang = require("dojo/_base/lang");
import dtl = require("../_base");

var htmlstrings = lang.getObject("filter.htmlstrings", true, dtl);
lang.mixin(htmlstrings, {
	_linebreaksrn: /(\r\n|\n\r)/g,
	_linebreaksn: /\n{2,}/g,
	_linebreakss: /(^\s+|\s+$)/g,
	_linebreaksbr: /\n/g,
	_removetagsfind: /[a-z0-9]+/g,
	_striptags: /<[^>]*?>/g,
	linebreaks: function (e) {
		for (
			var t = [],
				n = htmlstrings,
				o = (e = e.replace(
					n._linebreaksrn,
					"\n"
				)).split(n._linebreaksn),
				a = 0;
			a < o.length;
			a++
		) {
			var s = o[a]!
				.replace(n._linebreakss, "")
				.replace(n._linebreaksbr, "<br />");
			t.push("<p>" + s + "</p>");
		}
		return t.join("\n\n");
	},
	linebreaksbr: function (e) {
		var t = htmlstrings;
		return e
			.replace(t._linebreaksrn, "\n")
			.replace(t._linebreaksbr, "<br />");
	},
	removetags: function (e, t) {
		for (
			var n, o = htmlstrings, a = [];
			(n = o._removetagsfind.exec(t));

		)
			a.push(n[0]);
		return e.replace(
			new RegExp("</?s*" + "(" + a.join("|") + ")" + "s*[^>]*>", "gi"),
			""
		);
	},
	striptags: function (e) {
		return e.replace(
			dojox.dtl.filter.htmlstrings._striptags,
			""
		);
	},
} as DojoJS.Dojox_DTL_Filter["htmlstrings"]);
		
declare global {
	namespace DojoJS
	{
		interface Dojox_DTL_Filter {
			htmlstrings: {
				_linebreaksrn: RegExp;
				_linebreaksn: RegExp;
				_linebreakss: RegExp;
				_linebreaksbr: RegExp;
				_removetagsfind: RegExp;
				_striptags: RegExp;
				linebreaks(e: string): string;
				linebreaksbr(e: string): string;
				removetags(e: string, t: string): string;
				striptags(e: string): string;
			};
		}

		interface Dojox_DTL {
			filter: Dojox_DTL_Filter;
		}
	}
}

export = htmlstrings as DojoJS.Dojox_DTL_Filter["htmlstrings"];