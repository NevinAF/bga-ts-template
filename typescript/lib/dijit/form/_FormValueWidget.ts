
// @ts-nocheck

import e = require("dojo/_base/declare");
import t = require("dojo/sniff");
import i = require("./_FormWidget");
import n = require("./_FormValueMixin");

var _FormValueWidgetConstructor = e("dijit.form._FormValueWidget", [i, n], {
	_layoutHackIE7: function () {
		if (7 == t("ie"))
			for (
				var e = this.domNode,
					i = e.parentNode,
					n = e.firstChild || e,
					o = n.style.filter,
					a = this;
				i && 0 == i.clientHeight;

			) {
				!(function () {
					var e = a.connect(
						i,
						"onscroll",
						function () {
							a.disconnect(e);
							n.style.filter =
								new Date().getMilliseconds();
							a.defer(function () {
								n.style.filter = o;
							});
						}
					);
				})();
				i = i.parentNode;
			}
	},
}) as DijitJS.form._FormValueWidgetConstructor;

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_FormValueWidgetConstructor: typeof _FormValueWidgetConstructor;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = _FormValueWidgetConstructor;