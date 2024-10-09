// @ts-nocheck

import _require = require("require");
import dijit = require("./main");
import i = require("dojo/_base/config");
import n = require("dojo/dom-construct");
import o = require("dojo/dom-style");
import a = require("dojo/_base/lang");
import s = require("dojo/on");
import has = require("dojo/sniff");

has.add(
	"config-bgIframe",
	(has("ie") || has("trident")) &&
		!/IEMobile\/10\.0/.test(navigator.userAgent)
);
var l = new (function () {
	var t = [];
	this.pop = function () {
		var a;
		if (t.length) (a = t.pop()).style.display = "";
		else {
			if (has("ie") < 9) {
				var s =
					"<iframe src='" +
					(i.dojoBlankHtmlUrl ||
						_require.toUrl("dojo/resources/blank.html") ||
						'javascript:""') +
					"' role='presentation' style='position: absolute; left: 0px; top: 0px;z-index: -1; filter:Alpha(Opacity=\"0\");'>";
				a = document.createElement(s);
			} else {
				(a = n.create("iframe")).src = 'javascript:""';
				a.className = "dijitBackgroundIframe";
				a.setAttribute("role", "presentation");
				o.set(a, "opacity", 0.1);
			}
			a.tabIndex = -1;
		}
		return a;
	};
	this.push = function (e) {
		e.style.display = "none";
		t.push(e);
	};
})();
dijit.BackgroundIframe = function (e) {
	if (!e.id) throw new Error("no id");
	if (has("config-bgIframe")) {
		var t = (this.iframe = l.pop());
		e.appendChild(t);
		if (has("ie") < 7 || has("quirks")) {
			this.resize(e);
			this._conn = s(
				e,
				"resize",
				a.hitch(this, "resize", e)
			);
		} else o.set(t, { width: "100%", height: "100%" });
	}
};
a.extend(dijit.BackgroundIframe, {
	resize: function (e) {
		this.iframe &&
			o.set(this.iframe, {
				width: e.offsetWidth + "px",
				height: e.offsetHeight + "px",
			});
	},
	destroy: function () {
		if (this._conn) {
			this._conn.remove();
			this._conn = null;
		}
		if (this.iframe) {
			this.iframe.parentNode.removeChild(this.iframe);
			l.push(this.iframe);
			delete this.iframe;
		}
	},
});

declare global {
	namespace DojoJS
	{
		interface Dijit {
			BackgroundIframe: Constructor<{
				pop: (...args: any[]) => any;
				push: (...args: any[]) => any;
				resize: (...args: any[]) => any;
				destroy: () => void;
			}>;
		}
	}
}

export = dijit.BackgroundIframe;