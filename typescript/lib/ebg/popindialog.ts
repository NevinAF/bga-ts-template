// @ts-nocheck

import e = require("dojo");
import declare = require("dojo/_base/declare");

type Core = InstanceType<typeof import('ebg/core/core')>;

/**
 * A helper class for creating and managing pop-in dialogs. See {@link https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js#Generic_Dialogs | yourgamename.js: Generic Dialogs} for more information.
 */
class PopinDialog_Template {
	id: string | null = null;
	target_id: string | null = null;
	container_id: string = "ebd-body";
	resizeHandle: DojoJS.Handle | null = null;
	closeHandle: DojoJS.Handle | null = null;
	bCloseIsHiding: boolean = false;
	onShow: (() => any) | null = null;
	onHide: (() => any) | null = null;
	jstpl_standard_popin: string = '<div id="popin_${id}" class="standard_popin"><h2 id="popin_${id}_title" class="standard_popin_title"></h2><a href="#" target="_blank" id="popin_${id}_help" class="standard_popin_helpicon"><i class="fa fa-question-circle-o fa-2x" aria-hidden="true"></i></a><a href="#" id="popin_${id}_close" class="standard_popin_closeicon"><i class="fa fa-times-circle fa-2x" aria-hidden="true"></i></a><div id="popin_${id}_contents" class="clear"></div></div>';
	tableModule?: Core;

	/**
	 * Creates the dialog div in a hidden state. This should only be called once and used as an initializer for the dialog.
	 * @param id The unique id of the dialog.
	 * @param container_div where this dialog should be created. This will block all input and add a lighten the entire container. If this value is not set, the dialog will be created on the 'main-content' if it exists, or the 'left-side' otherwise.
	 */
	create(id: string, container_div?: string | HTMLElement) {
		this.id = id;
		this.target_id = container_div;
		if (this.target_id === undefined) {
			this.target_id = $("main-content") !== null ? "main-content" : "left-side";
		}
		e.destroy("popin_" + this.id + "_underlay");
		e.place('<div id="popin_' + this.id + '_underlay" class="standard_popin_underlay"></div>', this.container_id);
		e.destroy("popin_" + this.id);
		e.place(e.string.substitute(this.jstpl_standard_popin, { id: this.id }), this.container_id);
		e.style("popin_" + this.id + "_help", "display", "none");
		this.closeHandle = e.connect($("popin_" + this.id + "_close"), "onclick", this, function (event) {
			e.stopEvent(event);
			if (this.bCloseIsHiding) {
				this.hide();
			} else {
				this.destroy();
			}
		});
		this.resizeHandle = e.connect(window, "onresize", this, "adjustSizeAndPosition");
	}

	/**
	 * Destroys all components created for the dialog and removes the dialog from the DOM.
	 * @param animate If true, the dialog will fade out before being removed.
	 */
	destroy(animate: boolean = true) {
		if (this.id !== null) {
			if (animate) {
				if ($("popin_" + this.id)) {
					var fadeOut = e.fadeOut({ node: "popin_" + this.id });
					e.connect(fadeOut, "onEnd", this, function (event) {
						if ($("popin_" + this.id)) {
							e.destroy("popin_" + this.id);
						}
					});
					fadeOut.play();
				}
				if ($("popin_" + this.id + "_underlay")) {
					var fadeOut = e.fadeOut({ node: "popin_" + this.id + "_underlay" });
					e.connect(fadeOut, "onEnd", this, function (event) {
						if ($("popin_" + this.id + "_underlay")) {
							e.destroy("popin_" + this.id + "_underlay");
						}
						this.id = null;
					});
					fadeOut.play();
				}
			} else {
				if ($("popin_" + this.id)) {
					e.destroy("popin_" + this.id);
				}
				if ($("popin_" + this.id + "_underlay")) {
					e.destroy("popin_" + this.id + "_underlay");
				}
			}
		}
	}

	/**
	 * Replaces the 'onclick' event for the dialog's close button with the provided function. This will not have any impact if the close button was hidden using {@link hideCloseIcon}.
	 * @param callback The function to call when the close button is clicked.
	 */
	setCloseCallback(callback: (event: MouseEvent) => any) {
		e.disconnect(this.closeHandle);
		this.closeHandle = e.connect($("popin_" + this.id + "_close"), "onclick", this, callback);
	}

	/**
	 * Hides the close icon. This dialog will not be closable except through game specific code. It is always recommended to provide buttons or other methods to close the dialog so the user isn't completely stuck in a dialog.
	 */
	hideCloseIcon() {
		e.style("popin_" + this.id + "_close", "display", "none");
	}

	/**
	 * Sets the inner html of the title on the dialog.
	 * @param title The html to set the title to.
	 */
	setTitle(title?: string) {
		if (this.id === null) {
			console.error("You should CREATE this popindialog first");
			throw "You should CREATE this popindialog first";
		}
		$("popin_" + this.id + "_title").innerHTML = title;
	}

	/**
	 * Sets the maximum width of the dialog by setting the 'maxWidth' css property.
	 * @param maxWidth The maximum width of the dialog in pixels.
	 */
	setMaxWidth(maxWidth: number) {
		if (this.id === null) {
			console.error("You should CREATE this popindialog first");
			throw "You should CREATE this popindialog first";
		}
		e.style("popin_" + this.id, "maxWidth", maxWidth + "px");
	}

	/**
	 * Sets the help link for this dialog. This will also show the help icon if it was previously not set. This will set the 'href' attribute of the help icon to the provided link.
	 * @param link The link to the help page for this dialog.
	 */
	setHelpLink(link: string) {
		$("popin_" + this.id + "_help").href = link;
		e.style("popin_" + this.id + "_help", "display", "block");
	}

	/**
	 * Sets the inner html of the dialog.
	 * @param content The html to set the dialog to.
	 */
	setContent(content: string | Node) {
		if (this.id === null) {
			console.error("You should CREATE this popindialog first");
			throw "You should CREATE this popindialog first";
		}
		$("popin_" + this.id + "_contents").innerHTML = content;
	}

	/**
	 * Shows the dialog. If the dialog was not created, this will create the dialog and show it.
	 * @param animate If true, the dialog will fade in when shown.
	 */
	show(animate: boolean = true) {
		if (this.id === null) {
			console.error("You should CREATE this popindialog first");
			throw "You should CREATE this popindialog first";
		}
		e.style("popin_" + this.id + "_underlay", "opacity", "0");
		e.style("popin_" + this.id + "_underlay", "display", "block");
		e.style("popin_" + this.id, "opacity", "0");
		e.style("popin_" + this.id, "display", "inline-block");
		e.style("popin_" + this.id, "transform", "");
		var containerPosition = e.position(this.container_id);
		var targetPosition = e.position(this.target_id);
		var dialogPosition = e.position("popin_" + this.id);
		var windowBox = e.window.getBox();
		var topOffset = 43;
		if (typeof gameui !== "undefined") {
			topOffset = 65;
		}
		var topPosition = Math.max(windowBox.t + topOffset, (windowBox.h - dialogPosition.h) / 2 + windowBox.t);
		e.style("popin_" + this.id, "top", topPosition + "px");
		var leftPosition = targetPosition.x + targetPosition.w / 2 - dialogPosition.w / 2;
		if (leftPosition < 0) {
			leftPosition = Math.max(0, windowBox.w / 2 - dialogPosition.w / 2);
		}
		e.style("popin_" + this.id, "left", leftPosition + "px");
		if (e.hasClass("ebd-body", "mobile_version") && leftPosition + dialogPosition.w > containerPosition.w) {
			e.style("popin_" + this.id, "left", "5px");
			var scale = containerPosition.w / (dialogPosition.w + 10);
			e.style("popin_" + this.id, "transform", "scale(" + scale + ")");
			e.style("popin_" + this.id, "transform-origin", "left center");
		}
		e.style("popin_" + this.id + "_underlay", "width", containerPosition.w + "px");
		e.style("popin_" + this.id + "_underlay", "height", containerPosition.h - topOffset + "px");
		if (animate) {
			e.fadeIn({ node: "popin_" + this.id + "_underlay" }).play();
			var fadeIn = e.animateProperty({ node: "popin_" + this.id + "_underlay", properties: { opacity: 0.7 } });
			e.connect(fadeIn, "onEnd", this, function (event) {
				var containerPosition = e.position(this.container_id);
				e.style("popin_" + this.id + "_underlay", "width", containerPosition.w + "px");
				e.style("popin_" + this.id + "_underlay", "height", containerPosition.h - topOffset + "px");
			});
			fadeIn.play();
			e.fadeIn({ node: "popin_" + this.id }).play();
		}
		else {
			e.style("popin_" + this.id + "_underlay", "opacity", 0.7);
			e.style("popin_" + this.id, "opacity", 1);
		}
		if (this.onShow !== null) {
			this.onShow();
		}
	}

	/**
	 * Hides the dialog. If the dialog was not created, this will do nothing.
	 * @param animate If true, the dialog will fade out when hidden.
	 */
	hide(animate: boolean = true) {
		if (this.id === null) {
			console.error("You should CREATE this popindialog first");
			throw "You should CREATE this popindialog first";
		}
		if (animate) {
			if ($("popin_" + this.id + "_underlay")) {
				e.fadeOut({ node: "popin_" + this.id + "_underlay" }).play();
				var fadeOut = e.animateProperty({ node: "popin_" + this.id + "_underlay", properties: { opacity: 0 } });
				e.connect(fadeOut, "onEnd", this, function (event) {
					e.style("popin_" + this.id + "_underlay", "display", "none");
					e.style("popin_" + this.id, "display", "none");
				});
				fadeOut.play();
			}
			if ($("popin_" + this.id)) {
				e.fadeOut({ node: "popin_" + this.id }).play();
			}
		}
		else {
			if ($("popin_" + this.id + "_underlay")) {
				e.style("popin_" + this.id + "_underlay", "opacity", 0);
				e.style("popin_" + this.id + "_underlay", "display", "none");
			}
			if ($("popin_" + this.id)) {
				e.style("popin_" + this.id, "opacity", 0);
				e.style("popin_" + this.id, "display", "none");
			}
		}
		if (this.onHide !== null) {
			this.onHide();
		}
	}
}

let PopinDialog = declare("ebg.popindialog", PopinDialog_Template);
export = PopinDialog;

declare global {
	namespace BGA {
		type PopinDialog = typeof PopinDialog;
		interface EBG { popindialog: PopinDialog; }
	}
	var ebg: BGA.EBG;
}