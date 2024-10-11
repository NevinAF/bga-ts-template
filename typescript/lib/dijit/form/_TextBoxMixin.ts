
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/dom");
import n = require("dojo/sniff");
import o = require("dojo/keys");
import a = require("dojo/_base/lang");
import s = require("dojo/on");
import dijit = require("../main");

var _TextBoxMixin = t(
	"dijit.form._TextBoxMixin" +
		(n("dojo-bidi") ? "_NoBidi" : ""),
	null,
	{
		trim: false,
		uppercase: false,
		lowercase: false,
		propercase: false,
		maxLength: "",
		selectOnClick: false,
		placeHolder: "",
		_getValueAttr: function () {
			return this.parse(
				this.get("displayedValue"),
				this.constraints
			);
		},
		_setValueAttr: function (e, t, i) {
			var n;
			if (undefined !== e) {
				n = this.filter(e);
				if ("string" != typeof i) {
					i =
						null === n ||
						("number" == typeof n && isNaN(n))
							? ""
							: this.filter(
									this.format(
										n,
										this.constraints
									)
								);
					0 !=
						this.compare(
							n,
							this.filter(
								this.parse(i, this.constraints)
							)
						) && (i = null);
				}
			}
			if (
				null != i &&
				("number" != typeof i || !isNaN(i)) &&
				this.textbox.value != i
			) {
				this.textbox.value = i;
				this._set(
					"displayedValue",
					this.get("displayedValue")
				);
			}
			this.inherited(arguments, [n, t]);
		},
		displayedValue: "",
		_getDisplayedValueAttr: function () {
			return this.filter(this.textbox.value);
		},
		_setDisplayedValueAttr: function (e) {
			null == e
				? (e = "")
				: "string" != typeof e && (e = String(e));
			this.textbox.value = e;
			this._setValueAttr(this.get("value"), undefined);
			this._set(
				"displayedValue",
				this.get("displayedValue")
			);
		},
		format: function (e) {
			return null == e
				? ""
				: e.toString
				? e.toString()
				: e;
		},
		parse: function (e) {
			return e;
		},
		_refreshState: function () {},
		onInput: function () {},
		_onInput: function (e) {
			this._lastInputEventValue = this.textbox.value;
			this._processInput(
				this._lastInputProducingEvent || e
			);
			delete this._lastInputProducingEvent;
			this.intermediateChanges &&
				this._handleOnChange(this.get("value"), false);
		},
		_processInput: function () {
			this._refreshState();
			this._set(
				"displayedValue",
				this.get("displayedValue")
			);
		},
		postCreate: function () {
			this.textbox.setAttribute(
				"value",
				this.textbox.value
			);
			this.inherited(arguments);
			this.own(
				s(
					this.textbox,
					"keydown, keypress, paste, cut, compositionend",
					a.hitch(this, function (e) {
						var t;
						if (
							"keydown" == e.type &&
							229 != e.keyCode
						) {
							switch ((t = e.keyCode)) {
								case o.SHIFT:
								case o.ALT:
								case o.CTRL:
								case o.META:
								case o.CAPS_LOCK:
								case o.NUM_LOCK:
								case o.SCROLL_LOCK:
									return;
							}
							if (
								!e.ctrlKey &&
								!e.metaKey &&
								!e.altKey
							) {
								switch (t) {
									case o.NUMPAD_0:
									case o.NUMPAD_1:
									case o.NUMPAD_2:
									case o.NUMPAD_3:
									case o.NUMPAD_4:
									case o.NUMPAD_5:
									case o.NUMPAD_6:
									case o.NUMPAD_7:
									case o.NUMPAD_8:
									case o.NUMPAD_9:
									case o.NUMPAD_MULTIPLY:
									case o.NUMPAD_PLUS:
									case o.NUMPAD_ENTER:
									case o.NUMPAD_MINUS:
									case o.NUMPAD_PERIOD:
									case o.NUMPAD_DIVIDE:
										return;
								}
								if (
									(t >= 65 && t <= 90) ||
									(t >= 48 && t <= 57) ||
									t == o.SPACE
								)
									return;
								var i = false;
								for (var r in o)
									if (o[r] === e.keyCode) {
										i = true;
										break;
									}
								if (!i) return;
							}
						}
						(t =
							e.charCode >= 32
								? String.fromCharCode(
										e.charCode
									)
								: e.charCode) ||
							(t =
								(e.keyCode >= 65 &&
									e.keyCode <= 90) ||
								(e.keyCode >= 48 &&
									e.keyCode <= 57) ||
								e.keyCode == o.SPACE
									? String.fromCharCode(
											e.keyCode
										)
									: e.keyCode);
						t || (t = 229);
						if ("keypress" == e.type) {
							if ("string" != typeof t) return;
							if (
								((t >= "a" && t <= "z") ||
									(t >= "A" && t <= "Z") ||
									(t >= "0" && t <= "9") ||
									" " === t) &&
								(e.ctrlKey ||
									e.metaKey ||
									e.altKey)
							)
								return;
						}
						var l,
							d = { faux: true };
						for (l in e)
							if (
								!/^(layer[XY]|returnValue|keyLocation)$/.test(
									l
								)
							) {
								var c = e[l];
								"function" != typeof c &&
									undefined !== c &&
									(d[l] = c);
							}
						a.mixin(d, {
							charOrCode: t,
							_wasConsumed: false,
							preventDefault: function () {
								d._wasConsumed = true;
								e.preventDefault();
							},
							stopPropagation: function () {
								e.stopPropagation();
							},
						});
						this._lastInputProducingEvent = d;
						if (false === this.onInput(d)) {
							d.preventDefault();
							d.stopPropagation();
						}
						if (!d._wasConsumed && n("ie") <= 9)
							switch (e.keyCode) {
								case o.TAB:
								case o.ESCAPE:
								case o.DOWN_ARROW:
								case o.UP_ARROW:
								case o.LEFT_ARROW:
								case o.RIGHT_ARROW:
									break;
								default:
									if (
										e.keyCode == o.ENTER &&
										"textarea" !=
											this.textbox.tagName.toLowerCase()
									)
										break;
									this.defer(function () {
										this.textbox.value !==
											this
												._lastInputEventValue &&
											s.emit(
												this.textbox,
												"input",
												{ bubbles: true }
											);
									});
							}
					})
				),
				s(
					this.textbox,
					"input",
					a.hitch(this, "_onInput")
				),
				s(this.domNode, "keypress", function (e) {
					e.stopPropagation();
				})
			);
		},
		_blankValue: "",
		filter: function (e) {
			if (null === e) return this._blankValue;
			if ("string" != typeof e) return e;
			this.trim && (e = a.trim(e));
			this.uppercase && (e = e.toUpperCase());
			this.lowercase && (e = e.toLowerCase());
			this.propercase &&
				(e = e.replace(/[^\s]+/g, function (e) {
					return (
						e.substring(0, 1).toUpperCase() +
						e.substring(1)
					);
				}));
			return e;
		},
		_setBlurValue: function () {
			this._setValueAttr(this.get("value"), true);
		},
		_onBlur: function (e) {
			if (!this.disabled) {
				this._setBlurValue();
				this.inherited(arguments);
			}
		},
		_isTextSelected: function () {
			return (
				this.textbox.selectionStart !=
				this.textbox.selectionEnd
			);
		},
		_onFocus: function (e) {
			if (!this.disabled && !this.readOnly) {
				if (this.selectOnClick && "mouse" == e) {
					this._selectOnClickHandle = s.once(
						this.domNode,
						"mouseup, touchend",
						a.hitch(this, function (e) {
							this._isTextSelected() ||
								_TextBoxMixin.selectInputText(this.textbox);
						})
					);
					this.own(this._selectOnClickHandle);
					this.defer(function () {
						if (this._selectOnClickHandle) {
							this._selectOnClickHandle.remove();
							this._selectOnClickHandle = null;
						}
					}, 500);
				}
				this.inherited(arguments);
				this._refreshState();
			}
		},
		reset: function () {
			this.textbox.value = "";
			this.inherited(arguments);
		},
	}
) as DojoJS.DojoClass<DijitJS.form._TextBoxMixin<any>> & {
	_setSelectionRange: (e: HTMLInputElement, t: number, i: number) => void;
	selectInputText: (e: string | HTMLElement, t?: number, n?: number) => void;
};
n("dojo-bidi") &&
	(_TextBoxMixin = t("dijit.form._TextBoxMixin", _TextBoxMixin, {
		_setValueAttr: function () {
			this.inherited(arguments);
			this.applyTextDir(this.focusNode);
		},
		_setDisplayedValueAttr: function () {
			this.inherited(arguments);
			this.applyTextDir(this.focusNode);
		},
		_onInput: function () {
			this.applyTextDir(this.focusNode);
			this.inherited(arguments);
		},
	}));
_TextBoxMixin._setSelectionRange = dijit._setSelectionRange = function (
	e,
	t,
	i
) {
	e.setSelectionRange && e.setSelectionRange(t, i);
};
_TextBoxMixin.selectInputText = dijit.selectInputText = function (e, t, n) {
	e = i.byId(e);
	isNaN(t) && (t = 0);
	isNaN(n) && (n = e.value ? e.value.length : 0);
	try {
		e.focus();
		_TextBoxMixin._setSelectionRange(e, t, n);
	} catch (o) {}
};

declare global {
	namespace DojoJS
	{
		interface DijitForm {
			_TextBoxMixin: typeof _TextBoxMixin;
		}

		interface Dijit {
			form: DijitForm;
			_setSelectionRange: typeof _TextBoxMixin._setSelectionRange;
			selectInputText: typeof _TextBoxMixin.selectInputText;
		}
	}
}

export = _TextBoxMixin;