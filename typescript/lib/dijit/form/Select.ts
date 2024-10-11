
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-attr");
import n = require("dojo/dom-class");
import o = require("dojo/dom-geometry");
import a = require("dojo/i18n");
import s = require("dojo/keys");
import r = require("dojo/_base/lang");
import l = require("dojo/on");
import d = require("dojo/sniff");
import c = require("./_FormSelectWidget");
import h = require("../_HasDropDown");
import u = require("../DropDownMenu");
import p = require("../MenuItem");
import m = require("../MenuSeparator");
import g = require("../Tooltip");
import f = require("../_KeyNavMixin");
import _ = require("../registry");
import v = require("dojo/text"); // import v = require("dojo/text!./templates/Select.html");
import "dojo/i18n"; // import y = require("dojo/i18n!./nls/validate");

// TODO: This does not output with "DojoClass" when not forcibly typed.
var _SelectMenu: DojoJS.DojoClass<DijitJS.DropDownMenu & {
	autoFocus: boolean;
	buildRendering: () => void;
	postCreate: () => void;
	focus: () => void;
}> = t("dijit.form._SelectMenu", u, {
		autoFocus: true,
		buildRendering: function () {
			this.inherited(arguments);
			this.domNode.setAttribute("role", "listbox");
		},
		postCreate: function () {
			this.inherited(arguments);
			this.own(
				l(this.domNode, "selectstart", function (e) {
					e.preventDefault();
					e.stopPropagation();
				})
			);
		},
		focus: function () {
			var t = false,
				i = this.parentWidget.value;
			r.isArray(i) && (i = i[i.length - 1]);
			i &&
				e.forEach(
					this.parentWidget._getChildren(),
					function (e) {
						if (e.option && i === e.option.value) {
							t = true;
							this.focusChild(e, false);
						}
					},
					this
				);
			t || this.inherited(arguments);
		},
	}),
	Select = t(
		"dijit.form.Select" + (d("dojo-bidi") ? "_NoBidi" : ""),
		[c, h, f],
		{
			baseClass: "dijitSelect dijitValidationTextBox",
			templateString: v,
			_buttonInputDisabled: d("ie") ? "disabled" : "",
			required: false,
			state: "",
			message: "",
			tooltipPosition: [],
			emptyLabel: "&#160;",
			_isLoaded: false,
			_childrenLoaded: false,
			labelType: "html",
			_fillContent: function () {
				this.inherited(arguments);
				if (
					this.options.length &&
					!this.value &&
					this.srcNodeRef
				) {
					var e = this.srcNodeRef.selectedIndex || 0;
					this._set(
						"value",
						this.options[e >= 0 ? e : 0].value
					);
				}
				this.dropDown = new _SelectMenu({
					id: this.id + "_menu",
					parentWidget: this,
				});
				n.add(
					this.dropDown.domNode,
					this.baseClass.replace(/\s+|$/g, "Menu ")
				);
			},
			_getMenuItemForOption: function (e) {
				if (e.value || e.label) {
					var t = r.hitch(this, "_setValueAttr", e),
						i = new p({
							option: e,
							label:
								("text" === this.labelType
									? (e.label || "")
											.toString()
											.replace(
												/&/g,
												"&amp;"
											)
											.replace(
												/</g,
												"&lt;"
											)
									: e.label) ||
								this.emptyLabel,
							onClick: t,
							ownerDocument: this.ownerDocument,
							dir: this.dir,
							textDir: this.textDir,
							disabled: e.disabled || false,
						});
					i.focusNode.setAttribute("role", "option");
					return i;
				}
				return new m({
					ownerDocument: this.ownerDocument,
				});
			},
			_addOptionItem: function (e) {
				this.dropDown &&
					this.dropDown.addChild(
						this._getMenuItemForOption(e)
					);
			},
			_getChildren: function () {
				return this.dropDown
					? this.dropDown.getChildren()
					: [];
			},
			focus: function () {
				if (!this.disabled && this.focusNode.focus)
					try {
						this.focusNode.focus();
					} catch (e) {}
			},
			focusChild: function (e) {
				e && this.set("value", e.option);
			},
			_getFirst: function () {
				var e = this._getChildren();
				return e.length ? e[0] : null;
			},
			_getLast: function () {
				var e = this._getChildren();
				return e.length ? e[e.length - 1] : null;
			},
			childSelector: function (e) {
				return (
					(e = _.byNode(e)) &&
					e.getParent() == this.dropDown
				);
			},
			onKeyboardSearch: function (e, t, i, n) {
				e && this.focusChild(e);
			},
			_loadChildren: function (t) {
				if (true === t) {
					if (this.dropDown) {
						delete this.dropDown.focusedChild;
						this.focusedChild = null;
					}
					if (this.options.length)
						this.inherited(arguments);
					else {
						e.forEach(
							this._getChildren(),
							function (e) {
								e.destroyRecursive();
							}
						);
						var i = new p({
							ownerDocument: this.ownerDocument,
							label: this.emptyLabel,
						});
						this.dropDown.addChild(i);
					}
				} else this._updateSelection();
				this._isLoaded = false;
				this._childrenLoaded = true;
				this._loadingStore ||
					this._setValueAttr(this.value, false);
			},
			_refreshState: function () {
				this._started && this.validate(this.focused);
			},
			startup: function () {
				this.inherited(arguments);
				this._refreshState();
			},
			_setValueAttr: function (e) {
				this.inherited(arguments);
				i.set(
					this.valueNode,
					"value",
					this.get("value")
				);
				this._refreshState();
			},
			_setNameAttr: "valueNode",
			_setDisabledAttr: function (e) {
				this.inherited(arguments);
				this._refreshState();
			},
			_setRequiredAttr: function (e) {
				this._set("required", e);
				this.focusNode.setAttribute("aria-required", e);
				this._refreshState();
			},
			_setOptionsAttr: function (e) {
				this._isLoaded = false;
				this._set("options", e);
			},
			_setDisplay: function (e) {
				var t =
					("text" === this.labelType
						? (e || "")
								.replace(/&/g, "&amp;")
								.replace(/</g, "&lt;")
						: e) || this.emptyLabel;
				this.containerNode.innerHTML =
					'<span role="option" aria-selected="true" class="dijitReset dijitInline ' +
					this.baseClass.replace(/\s+|$/g, "Label ") +
					'">' +
					t +
					"</span>";
			},
			validate: function (e) {
				var t = this.disabled || this.isValid(e);
				this._set(
					"state",
					t
						? ""
						: this._hasBeenBlurred
						? "Error"
						: "Incomplete"
				);
				this.focusNode.setAttribute(
					"aria-invalid",
					t ? "false" : "true"
				);
				var i = t ? "" : this._missingMsg;
				i && this.focused && this._hasBeenBlurred
					? g.show(
							i,
							this.domNode,
							this.tooltipPosition,
							!this.isLeftToRight()
						)
					: g.hide(this.domNode);
				this._set("message", i);
				return t;
			},
			isValid: function () {
				return (
					!this.required ||
					0 === this.value ||
					!/^\s*$/.test(this.value || "")
				);
			},
			reset: function () {
				this.inherited(arguments);
				g.hide(this.domNode);
				this._refreshState();
			},
			postMixInProperties: function () {
				this.inherited(arguments);
				this._missingMsg = a.getLocalization(
					"dijit.form",
					"validate",
					this.lang
				).missingMessage;
			},
			postCreate: function () {
				this.inherited(arguments);
				this.own(
					l(
						this.domNode,
						"selectstart",
						function (e) {
							e.preventDefault();
							e.stopPropagation();
						}
					)
				);
				this.domNode.setAttribute(
					"aria-expanded",
					"false"
				);
				var e = this._keyNavCodes;
				delete e[s.LEFT_ARROW];
				delete e[s.RIGHT_ARROW];
			},
			_setStyleAttr: function (e) {
				this.inherited(arguments);
				n.toggle(
					this.domNode,
					this.baseClass.replace(
						/\s+|$/g,
						"FixedWidth "
					),
					!!this.domNode.style.width
				);
			},
			isLoaded: function () {
				return this._isLoaded;
			},
			loadDropDown: function (e) {
				this._loadChildren(true);
				this._isLoaded = true;
				e();
			},
			destroy: function (e) {
				if (
					this.dropDown &&
					!this.dropDown._destroyed
				) {
					this.dropDown.destroyRecursive(e);
					delete this.dropDown;
				}
				g.hide(this.domNode);
				this.inherited(arguments);
			},
			_onFocus: function () {
				this.validate(true);
			},
			_onBlur: function () {
				g.hide(this.domNode);
				this.inherited(arguments);
				this.validate(false);
			},
		}
	) as DijitJS.form.SelectConstructor & {
		_Menu: typeof _SelectMenu;
	};
d("dojo-bidi") &&
	(Select = t("dijit.form.Select", Select, {
		_setDisplay: function (e) {
			this.inherited(arguments);
			this.applyTextDir(this.containerNode);
		},
	}));
Select._Menu = _SelectMenu;
function w(e) {
	return function (t) {
		this._isLoaded
			? this.inherited(e, arguments)
			: this.loadDropDown(r.hitch(this, e, t));
	};
}
Select.prototype._onContainerKeydown = w("_onContainerKeydown");
Select.prototype._onContainerKeypress = w("_onContainerKeypress");


declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_SelectMenu: typeof _SelectMenu;
			Select: typeof Select;
		}

		interface Dijit {
			form: DijitForm;
		}
	}
}

export = Select;