// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/lang");
import i = require("dojo/sniff");

var html = {};
t.setObject("dijit._editor.html", html);
var o = (html.escapeXml = function (e, t) {
	e = e
		.replace(/&/gm, "&amp;")
		.replace(/</gm, "&lt;")
		.replace(/>/gm, "&gt;")
		.replace(/"/gm, "&quot;");
	t || (e = e.replace(/'/gm, "&#39;"));
	return e;
});
html.getNodeHtml = function (e) {
	var t = [];
	html.getNodeHtmlHelper(e, t);
	return t.join("");
};
html.getNodeHtmlHelper = function (t, a) {
	switch (t.nodeType) {
		case 1:
			var s = t.nodeName.toLowerCase();
			if (!s || "/" == s.charAt(0)) return "";
			a.push("<", s);
			var r,
				l = [],
				d = {};
			if (
				i("dom-attributes-explicit") ||
				i("dom-attributes-specified-flag")
			)
				for (var c = 0; (r = t.attributes[c++]); ) {
					var h = r.name;
					if (
						"_dj" !== h.substr(0, 3) &&
						(!i("dom-attributes-specified-flag") ||
							r.specified) &&
						!(h in d)
					) {
						var u = r.value;
						("src" != h && "href" != h) ||
							(t.getAttribute("_djrealurl") &&
								(u =
									t.getAttribute(
										"_djrealurl"
									)));
						8 === i("ie") &&
							"style" === h &&
							(u = u
								.replace("HEIGHT:", "height:")
								.replace("WIDTH:", "width:"));
						l.push([h, u]);
						d[h] = u;
					}
				}
			else {
				var p = (
						/^input$|^img$/i.test(t.nodeName)
							? t
							: t.cloneNode(false)
					).outerHTML,
					m = p.match(
						/[\w-]+=("[^"]*"|'[^']*'|\S*)/gi
					);
				p = p.substr(0, p.indexOf(">"));
				e.forEach(
					m,
					function (e) {
						if (e) {
							var i = e.indexOf("=");
							if (i > 0) {
								var n = e.substring(0, i);
								if ("_dj" != n.substr(0, 3)) {
									if (
										("src" == n ||
											"href" == n) &&
										t.getAttribute(
											"_djrealurl"
										)
									) {
										l.push([
											n,
											t.getAttribute(
												"_djrealurl"
											),
										]);
										return;
									}
									var o, a;
									switch (n) {
										case "style":
											o =
												t.style.cssText.toLowerCase();
											break;
										case "class":
											o = t.className;
											break;
										case "width":
											if ("img" === s) {
												(a =
													/width=(\S+)/i.exec(
														p
													)) &&
													(o = a[1]);
												break;
											}
										case "height":
											if ("img" === s) {
												(a =
													/height=(\S+)/i.exec(
														p
													)) &&
													(o = a[1]);
												break;
											}
										default:
											o =
												t.getAttribute(
													n
												);
									}
									null != o &&
										l.push([
											n,
											o.toString(),
										]);
								}
							}
						}
					},
					this
				);
			}
			l.sort(function (e, t) {
				return e[0] < t[0] ? -1 : e[0] == t[0] ? 0 : 1;
			});
			for (var g = 0; (r = l[g++]); )
				a.push(
					" ",
					r[0],
					'="',
					"string" == typeof r[1]
						? o(r[1], true)
						: r[1],
					'"'
				);
			switch (s) {
				case "br":
				case "hr":
				case "img":
				case "input":
				case "base":
				case "meta":
				case "area":
				case "basefont":
					a.push(" />");
					break;
				case "script":
					a.push(">", t.innerHTML, "</", s, ">");
					break;
				default:
					a.push(">");
					t.hasChildNodes() &&
						html.getChildrenHtmlHelper(t, a);
					a.push("</", s, ">");
			}
			break;
		case 4:
		case 3:
			a.push(o(t.nodeValue, true));
			break;
		case 8:
			a.push("\x3c!--", o(t.nodeValue, true), "--\x3e");
			break;
		default:
			a.push(
				"\x3c!-- Element not recognized - Type: ",
				t.nodeType,
				" Name: ",
				t.nodeName,
				"--\x3e"
			);
	}
};
html.getChildrenHtml = function (e) {
	var t = [];
	html.getChildrenHtmlHelper(e, t);
	return t.join("");
};
html.getChildrenHtmlHelper = function (e, t) {
	if (e)
		for (
			var o,
				a = e.childNodes || e,
				s = !i("ie") || a !== e,
				r = 0;
			(o = a[r++]);

		)
			(s && o.parentNode != e) ||
				html.getNodeHtmlHelper(o, t);
};

declare global {
	namespace DojoJS
	{
		interface Dijit_editor {
			html: typeof html;
		}

		interface Dijit {
			_editor: Dijit_editor;
		}
	}
}

export = html;