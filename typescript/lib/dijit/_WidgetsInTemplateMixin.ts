
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/aspect");
import i = require("dojo/_base/declare");
import n = require("dojo/_base/lang");
import o = require("dojo/parser");

var _WidgetsInTemplateMixin = i("dijit._WidgetsInTemplateMixin", null, {
	_earlyTemplatedStartup: false,
	contextRequire: null,
	_beforeFillContent: function () {
		if (
			/dojoType|data-dojo-type/i.test(
				this.domNode.innerHTML
			)
		) {
			var e = this.domNode;
			this.containerNode &&
				!this.searchContainerNode &&
				(this.containerNode.stopParser = true);
			o.parse(e, {
				noStart: !this._earlyTemplatedStartup,
				template: true,
				inherited: {
					dir: this.dir,
					lang: this.lang,
					textDir: this.textDir,
				},
				propsThis: this,
				contextRequire: this.contextRequire,
				scope: "dojo",
			}).then(
				n.hitch(this, function (e) {
					this._startupWidgets = e;
					for (var t = 0; t < e.length; t++)
						this._processTemplateNode(
							e[t],
							function (e, t) {
								return e[t];
							},
							function (e, t, i) {
								return t in e
									? e.connect(e, t, i)
									: e.on(t, i, true);
							}
						);
					this.containerNode &&
						this.containerNode.stopParser &&
						delete this.containerNode.stopParser;
				})
			);
			if (!this._startupWidgets)
				throw new Error(
					this.declaredClass +
						": parser returned unfilled promise (probably waiting for module auto-load), unsupported by _WidgetsInTemplateMixin.   Must pre-load all supporting widgets before instantiation."
				);
		}
	},
	_processTemplateNode: function (e, t, i) {
		return (
			!(!t(e, "dojoType") && !t(e, "data-dojo-type")) ||
			this.inherited(arguments)
		);
	},
	startup: function () {
		e.forEach(this._startupWidgets, function (e) {
			e && !e._started && e.startup && e.startup();
		});
		this._startupWidgets = null;
		this.inherited(arguments);
	},
}) as DijitJS._WidgetsInTemplateMixinConstructor;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			_WidgetsInTemplateMixin: typeof _WidgetsInTemplateMixin;
		}
	}
}

export = _WidgetsInTemplateMixin;