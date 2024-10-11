// @ts-nocheck

import e = require("require");
import t = require("dojo/_base/declare");
import i = require("dojo/dom-attr");
import n = require("dojo/keys");
import o = require("dojo/_base/lang");
import a = require("dojo/on");
import s = require("dojo/sniff");
import r = require("dojo/query");
import l = require("dojo/string");
import d = require("../_Plugin");
import c = require("../../form/DropDownButton");
import h = require("../range");

// TODO: This does not output with "DojoClass" when not forcibly typed.
var LinkDialog: any = t("dijit._editor.plugins.LinkDialog", d, {
		buttonClass: c,
		useDefaultCommand: false,
		urlRegExp:
			"((https?|ftps?|file)\\://|./|../|/|)(/[a-zA-Z]{1,1}:/|)(((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)*(?:[a-zA-Z](?:[-\\da-zA-Z]{0,80}[\\da-zA-Z])?)\\.?)|(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])|(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]|(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]|(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])|0[xX]0*[\\da-fA-F]{1,8}|([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}|([\\da-fA-F]{1,4}\\:){6}((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])))(\\:\\d+)?(/(?:[^?#\\s/]+/)*(?:[^?#\\s/]{0,}(?:\\?[^?#\\s/]*)?(?:#.*)?)?)?",
		emailRegExp:
			"<?(mailto\\:)([!#-'*+\\-\\/-9=?A-Z^-~]+[.])*[!#-'*+\\-\\/-9=?A-Z^-~]+@((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)+(?:[a-zA-Z](?:[-\\da-zA-Z]{0,6}[\\da-zA-Z])?)\\.?)|localhost|^[^-][a-zA-Z0-9_-]*>?",
		htmlTemplate:
			'<a href="${urlInput}" _djrealurl="${urlInput}" target="${targetSelect}">${textInput}</a>',
		tag: "a",
		_hostRxp:
			/^((([^\[:]+):)?([^@]+)@)?(\[([^\]]+)\]|([^\[:]*))(:([0-9]+))?$/,
		_userAtRxp:
			/^([!#-'*+\-\/-9=?A-Z^-~]+[.])*[!#-'*+\-\/-9=?A-Z^-~]+@/i,
		linkDialogTemplate: [
			"<table role='presentation'><tr><td>",
			"<label for='${id}_urlInput'>${url}</label>",
			"</td><td>",
			"<input data-dojo-type='dijit.form.ValidationTextBox' required='true' id='${id}_urlInput' name='urlInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"<label for='${id}_textInput'>${text}</label>",
			"</td><td>",
			"<input data-dojo-type='dijit.form.ValidationTextBox' required='true' id='${id}_textInput' name='textInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"<label for='${id}_targetSelect'>${target}</label>",
			"</td><td>",
			"<select id='${id}_targetSelect' name='targetSelect' data-dojo-type='dijit.form.Select'>",
			"<option selected='selected' value='_self'>${currentWindow}</option>",
			"<option value='_blank'>${newWindow}</option>",
			"<option value='_top'>${topWindow}</option>",
			"<option value='_parent'>${parentWindow}</option>",
			"</select>",
			"</td></tr><tr><td colspan='2'>",
			"<button data-dojo-type='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>",
			"<button data-dojo-type='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>",
			"</td></tr></table>",
		].join(""),
		_initButton: function () {
			this.inherited(arguments);
			this.button.loadDropDown = o.hitch(
				this,
				"_loadDropDown"
			);
			this._connectTagEvents();
		},
		_loadDropDown: function (t) {
			e(
				[
					"dojo/i18n",
					"../../TooltipDialog",
					"../../registry",
					"../../form/Button",
					"../../form/Select",
					"../../form/ValidationTextBox",
					"dojo/i18n!../../nls/common",
					"dojo/i18n!../nls/LinkDialog",
				],
				o.hitch(this, function (e, i, s) {
					var r = this;
					this.tag =
						"insertImage" == this.command
							? "img"
							: "a";
					var d = o.delegate(
							e.getLocalization(
								"dijit",
								"common",
								this.lang
							),
							e.getLocalization(
								"dijit._editor",
								"LinkDialog",
								this.lang
							)
						),
						c =
							(this.dropDown =
							this.button.dropDown =
								new i({
									title: d[
										this.command + "Title"
									],
									ownerDocument:
										this.editor
											.ownerDocument,
									dir: this.editor.dir,
									execute: o.hitch(
										this,
										"setValue"
									),
									onOpen: function () {
										r._onOpenDialog();
										i.prototype.onOpen.apply(
											this,
											arguments
										);
									},
									onCancel: function () {
										setTimeout(
											o.hitch(
												r,
												"_onCloseDialog"
											),
											0
										);
									},
								}));
					d.urlRegExp = this.urlRegExp;
					d.id = s.getUniqueId(this.editor.id);
					this._uniqueId = d.id;
					this._setContent(
						c.title +
							"<div style='border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'></div>" +
							l.substitute(
								this.linkDialogTemplate,
								d
							)
					);
					c.startup();
					this._urlInput = s.byId(
						this._uniqueId + "_urlInput"
					);
					this._textInput = s.byId(
						this._uniqueId + "_textInput"
					);
					this._setButton = s.byId(
						this._uniqueId + "_setButton"
					);
					this.own(
						s
							.byId(
								this._uniqueId + "_cancelButton"
							)
							.on(
								"click",
								o.hitch(
									this.dropDown,
									"onCancel"
								)
							)
					);
					this._urlInput &&
						this.own(
							this._urlInput.on(
								"change",
								o.hitch(
									this,
									"_checkAndFixInput"
								)
							)
						);
					this._textInput &&
						this.own(
							this._textInput.on(
								"change",
								o.hitch(
									this,
									"_checkAndFixInput"
								)
							)
						);
					this._urlRegExp = new RegExp(
						"^" + this.urlRegExp + "$",
						"i"
					);
					this._emailRegExp = new RegExp(
						"^" + this.emailRegExp + "$",
						"i"
					);
					this._urlInput.isValid = o.hitch(
						this,
						function () {
							var e = this._urlInput.get("value");
							return (
								this._urlRegExp.test(e) ||
								this._emailRegExp.test(e)
							);
						}
					);
					this.own(
						a(
							c.domNode,
							"keydown",
							o.hitch(
								this,
								o.hitch(this, function (e) {
									if (
										e &&
										e.keyCode == n.ENTER &&
										!e.shiftKey &&
										!e.metaKey &&
										!e.ctrlKey &&
										!e.altKey &&
										!this._setButton.get(
											"disabled"
										)
									) {
										c.onExecute();
										c.execute(
											c.get("value")
										);
									}
								})
							)
						)
					);
					t();
				})
			);
		},
		_checkAndFixInput: function () {
			var e = this,
				t = this._urlInput.get("value");
			if (this._delayedCheck) {
				clearTimeout(this._delayedCheck);
				this._delayedCheck = null;
			}
			this._delayedCheck = setTimeout(function () {
				!(function (t) {
					var i = false,
						n = false;
					t &&
						t.length > 1 &&
						0 !==
							(t = o.trim(t)).indexOf(
								"mailto:"
							) &&
						(t.indexOf("/") > 0
							? -1 === t.indexOf("://") &&
								"/" !== t.charAt(0) &&
								t.indexOf("./") &&
								0 !== t.indexOf("../") &&
								e._hostRxp.test(t) &&
								(i = true)
							: e._userAtRxp.test(t) && (n = true));
					i &&
						e._urlInput.set("value", "http://" + t);
					n &&
						e._urlInput.set("value", "mailto:" + t);
					e._setButton.set("disabled", !e._isValid());
				})(t);
			}, 250);
		},
		_connectTagEvents: function () {
			this.editor.onLoadDeferred.then(
				o.hitch(this, function () {
					this.own(
						a(
							this.editor.editNode,
							"mouseup",
							o.hitch(this, "_onMouseUp")
						)
					);
					this.own(
						a(
							this.editor.editNode,
							"dblclick",
							o.hitch(this, "_onDblClick")
						)
					);
				})
			);
		},
		_isValid: function () {
			return (
				this._urlInput.isValid() &&
				this._textInput.isValid()
			);
		},
		_setContent: function (e) {
			this.dropDown.set({
				parserScope: "dojo",
				content: e,
			});
		},
		_checkValues: function (e) {
			e &&
				e.urlInput &&
				(e.urlInput = e.urlInput.replace(
					/"/g,
					"&quot;"
				));
			return e;
		},
		_createlinkEnabledImpl: function () {
			return true;
		},
		setValue: function (e) {
			this._onCloseDialog();
			if (s("ie") < 9) {
				var t = h
					.getSelection(this.editor.window)
					.getRangeAt(0).endContainer;
				3 === t.nodeType && (t = t.parentNode);
				t &&
					t.nodeName &&
					t.nodeName.toLowerCase() !== this.tag &&
					(t =
						this.editor.selection.getSelectedElement(
							this.tag
						));
				if (
					t &&
					t.nodeName &&
					t.nodeName.toLowerCase() === this.tag &&
					this.editor.queryCommandEnabled("unlink")
				) {
					this.editor.selection.selectElementChildren(
						t
					);
					this.editor.execCommand("unlink");
				}
			}
			e = this._checkValues(e);
			this.editor.execCommand(
				"inserthtml",
				l.substitute(this.htmlTemplate, e)
			);
			r("a", this.editor.document).forEach(function (e) {
				e.innerHTML ||
					i.has(e, "name") ||
					e.parentNode.removeChild(e);
			}, this);
		},
		_onCloseDialog: function () {
			this.editor.focused && this.editor.focus();
		},
		_getCurrentValues: function (e) {
			var t, i, n;
			if (e && e.tagName.toLowerCase() === this.tag) {
				t =
					e.getAttribute("_djrealurl") ||
					e.getAttribute("href");
				n = e.getAttribute("target") || "_self";
				i = e.textContent || e.innerText;
				this.editor.selection.selectElement(e, true);
			} else i = this.editor.selection.getSelectedText();
			return {
				urlInput: t || "",
				textInput: i || "",
				targetSelect: n || "",
			};
		},
		_onOpenDialog: function () {
			var e, t, i;
			if (s("ie")) {
				var n = h.getSelection(this.editor.window);
				if (n.rangeCount) {
					var o = n.getRangeAt(0);
					3 === (e = o.endContainer).nodeType &&
						(e = e.parentNode);
					e &&
						e.nodeName &&
						e.nodeName.toLowerCase() !== this.tag &&
						(e =
							this.editor.selection.getSelectedElement(
								this.tag
							));
					if (
						!e ||
						(e.nodeName &&
							e.nodeName.toLowerCase() !==
								this.tag)
					)
						if (
							(t =
								this.editor.selection.getAncestorElement(
									this.tag
								)) &&
							t.nodeName &&
							t.nodeName.toLowerCase() == this.tag
						) {
							e = t;
							this.editor.selection.selectElement(
								e
							);
						} else if (
							o.startContainer ===
								o.endContainer &&
							(i = o.startContainer.firstChild) &&
							i.nodeName &&
							i.nodeName.toLowerCase() == this.tag
						) {
							e = i;
							this.editor.selection.selectElement(
								e
							);
						}
				}
			} else
				e = this.editor.selection.getAncestorElement(
					this.tag
				);
			this.dropDown.reset();
			this._setButton.set("disabled", true);
			this.dropDown.set(
				"value",
				this._getCurrentValues(e)
			);
		},
		_onDblClick: function (e) {
			if (e && e.target) {
				var t = e.target;
				if (
					(t.tagName
						? t.tagName.toLowerCase()
						: "") === this.tag &&
					i.get(t, "href")
				) {
					var n = this.editor;
					this.editor.selection.selectElement(t);
					n.onDisplayChanged();
					if (n._updateTimer) {
						n._updateTimer.remove();
						delete n._updateTimer;
					}
					n.onNormalizedDisplayChanged();
					var o = this.button;
					setTimeout(function () {
						o.set("disabled", false);
						o.loadAndOpenDropDown().then(
							function () {
								o.dropDown.focus &&
									o.dropDown.focus();
							}
						);
					}, 10);
				}
			}
		},
		_onMouseUp: function () {
			if (s("ff")) {
				var e =
					this.editor.selection.getAncestorElement(
						this.tag
					);
				if (e) {
					var t = h
						.getSelection(this.editor.window)
						.getRangeAt(0);
					if (t.collapsed && e.childNodes.length) {
						var i = t.cloneRange();
						i.selectNodeContents(
							e.childNodes[
								e.childNodes.length - 1
							]
						);
						i.setStart(e.childNodes[0], 0);
						1 !==
						t.compareBoundaryPoints(
							i.START_TO_START,
							i
						)
							? t.setStartBefore(e)
							: -1 !==
									t.compareBoundaryPoints(
										i.END_TO_START,
										i
									) && t.setStartAfter(e);
					}
				}
			}
		},
	}),
	// TODO: This does not output with "DojoClass" when not forcibly typed.
	ImgLinkDialog: any = t("dijit._editor.plugins.ImgLinkDialog", [LinkDialog], {
		linkDialogTemplate: [
			"<table role='presentation'><tr><td>",
			"<label for='${id}_urlInput'>${url}</label>",
			"</td><td>",
			"<input dojoType='dijit.form.ValidationTextBox' regExp='${urlRegExp}' required='true' id='${id}_urlInput' name='urlInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"<label for='${id}_textInput'>${text}</label>",
			"</td><td>",
			"<input data-dojo-type='dijit.form.ValidationTextBox' required='false' id='${id}_textInput' name='textInput' data-dojo-props='intermediateChanges:true'/>",
			"</td></tr><tr><td>",
			"</td><td>",
			"</td></tr><tr><td colspan='2'>",
			"<button data-dojo-type='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>",
			"<button data-dojo-type='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>",
			"</td></tr></table>",
		].join(""),
		htmlTemplate:
			'<img src="${urlInput}" _djrealurl="${urlInput}" alt="${textInput}" />',
		tag: "img",
		_getCurrentValues: function (e) {
			var t, i;
			if (e && e.tagName.toLowerCase() === this.tag) {
				t =
					e.getAttribute("_djrealurl") ||
					e.getAttribute("src");
				i = e.getAttribute("alt");
				this.editor.selection.selectElement(e, true);
			} else i = this.editor.selection.getSelectedText();
			return { urlInput: t || "", textInput: i || "" };
		},
		_isValid: function () {
			return this._urlInput.isValid();
		},
		_connectTagEvents: function () {
			this.inherited(arguments);
			this.editor.onLoadDeferred.then(
				o.hitch(this, function () {
					this.own(
						a(
							this.editor.editNode,
							"mousedown",
							o.hitch(this, "_selectTag")
						)
					);
				})
			);
		},
		_selectTag: function (e) {
			if (e && e.target) {
				var t = e.target;
				(t.tagName ? t.tagName.toLowerCase() : "") ===
					this.tag &&
					this.editor.selection.selectElement(t);
			}
		},
		_checkValues: function (e) {
			e &&
				e.urlInput &&
				(e.urlInput = e.urlInput.replace(
					/"/g,
					"&quot;"
				));
			e &&
				e.textInput &&
				(e.textInput = e.textInput.replace(
					/"/g,
					"&quot;"
				));
			return e;
		},
		_onDblClick: function (e) {
			if (e && e.target) {
				var t = e.target;
				if (
					(t.tagName
						? t.tagName.toLowerCase()
						: "") === this.tag &&
					i.get(t, "src")
				) {
					var n = this.editor;
					this.editor.selection.selectElement(t);
					n.onDisplayChanged();
					if (n._updateTimer) {
						n._updateTimer.remove();
						delete n._updateTimer;
					}
					n.onNormalizedDisplayChanged();
					var o = this.button;
					setTimeout(function () {
						o.set("disabled", false);
						o.loadAndOpenDropDown().then(
							function () {
								o.dropDown.focus &&
									o.dropDown.focus();
							}
						);
					}, 10);
				}
			}
		},
	});
d.registry.createLink = function () {
	return new LinkDialog({ command: "createLink" });
};
d.registry.insertImage = function () {
	return new ImgLinkDialog({ command: "insertImage" });
};
LinkDialog.ImgLinkDialog = ImgLinkDialog;

declare global {
	namespace DojoJS
	{
		interface Dijit_editorPlugins {
			LinkDialog: typeof LinkDialog;
			ImgLinkDialog: typeof ImgLinkDialog;
		}

		interface Dijit_editor {
			plugins: Dijit_editorPlugins;
		}

		interface Dijit {
			_editor: Dijit_editor;
		}
	}
}

export = LinkDialog;