// @ts-nocheck

import dojo = require("dojo");
import declare = require("dojo/_base/declare");

declare global {
	namespace BGA {
		interface AjaxActions {
			"/table/table/changeReputation.html": {
				player: BGA.ID,
				value: number,
				category?: string | "personal",
				f?: 1
			};
		}
	}
}

/**
 * The Thumb class represents a thumbs-up/thumbs-down control for player reputation in a game.
 */
class Thumb_Template {
	page: InstanceType<BGA.CorePage> | null = null;
	div_id: string | null = null;
	div: HTMLElement | null = null;
	value: number = 0;
	target_player: BGA.ID | null = null;
	staticControl: boolean = false;
	bForceThumbDown: boolean = false;

	thumbdownDlg: InstanceType<BGA.PopinDialog> | null = null;

	/**
	 * Initializes the Thumb control.
	 * @param page - The game GUI page.
	 * @param div_id - The ID of the div element where the control will be placed.
	 * @param target_player - The target player for the thumb control.
	 * @param value - The initial value of the thumb control (as a string).
	 */
	create(page: InstanceType<BGA.CorePage>, div_id: string, target_player: BGA.ID, value: BGA.ID) {
		this.page = page;
		this.div_id = div_id;
		this.div = $(this.div_id) as HTMLElement;
		this.value = parseInt(String(value));
		this.target_player = target_player;
		dojo.style(this.div, "display", "inline-block");
		this.updateControl();
	}

	updateControl() {
		if (null !== $(this.div_id)) {
			let t = "<div>",
				i = false;
			if (1 == this.value || (0 == this.value && !this.staticControl)) {
				t += '<div class="icon16 icon16_reputup givethumb" id="' + this.div_id + '_up"></div>';
				i = true;
			}
			if (-1 == this.value || (0 == this.value && !this.staticControl)) {
				i && (t += "&nbsp;&nbsp;");
				t += '<div class="icon16 icon16_reputdown givethumb" id="' + this.div_id + '_down"></div>';
			}
			dojo.place(t, this.div_id, "only");
			if (1 == this.value) {
				this.page!.addTooltip(this.div_id + "_up", __("lang_mainsite", "I like and recommend to play with this player"), this.staticControl ? "" : __("lang_mainsite", "Cancel"));
				this.staticControl || dojo.connect($(this.div_id + "_up"), "onclick", this, "onCancelOpinion");
			} else if (0 != this.value || this.staticControl) {
				if (-1 == this.value) {
					this.page.addTooltip(this.div_id + "_down", __("lang_mainsite", "I dislike to play with this player"), this.staticControl ? "" : __("lang_mainsite", "Cancel"));
					this.staticControl || dojo.connect($(this.div_id + "_down"), "onclick", this, "onCancelOpinion");
				}
			} else {
				this.page!.addTooltip(this.div_id + "_up", "", __("lang_mainsite", "I like and recommend to play with this player"));
				this.page!.addTooltip(this.div_id + "_down", "", __("lang_mainsite", "I dislike to play with this player"));
				dojo.connect($(this.div_id + "_up"), "onclick", this, "onGiveThumbUp");
				dojo.connect($(this.div_id + "_down"), "onclick", this, "onGiveThumbDown");
			}
		}
	}

	onCancelOpinion(event: Event) {
		event.preventDefault();
		this.page.ajaxcall(
			"/table/table/changeReputation.html",
			{ player: this.target_player!, value: 0 },
			this,
			function (e) {
				this.value = 0;
				this.updateControl();
			}
		);
	}

	onGiveThumbUp(e: Event) {
		e.preventDefault();
		this.page.ajaxcall("/table/table/changeReputation.html", { player: this.target_player!, value: 1 }, this, function (e) {
			this.value = 1;
			this.updateControl();
		});
	}

	onGiveThumbDown(t: Event) {
		t.preventDefault();
		this.thumbdownDlg = new ebg.popindialog();
		this.thumbdownDlg.create("thumbdownDialog");
		this.thumbdownDlg.setTitle(__("lang_mainsite", "You are about to give a thumb down."));
		this.thumbdownDlg.setMaxWidth(600);
		let i = '<div id="thumbdownDialog" class="midSizeDialog">';
		i += __("lang_mainsite", "You are about to give a red thumb.") + "<br/><br/>";
		i += __("lang_mainsite", "If you confirm BGA will make sure you won't play at the same table again.") + " ";
		i += __("lang_mainsite", "This player won't be able to send you a message (or speak as a spectator at your table).") + " ";
		i += "<p>";
		i += "<a class='bgabutton bgabutton_blue bgabutton_big' id='thumbdown_confirm' href='#'><span>" + __("lang_mainsite", "I don't want to play with this player, ever") + "</span></a> ";
		i += "<a class='bgabutton bgabutton_gray bgabutton_big' id='thumbdown_cancel' href='#'><span>" + __("lang_mainsite", "Cancel") + "</span></a>";
		i += "</p>";
		i += "</div>";
		this.thumbdownDlg.setContent(i);
		this.thumbdownDlg.show();
		dojo.connect($("thumbdown_cancel"), "onclick", dojo.hitch(this.thumbdownDlg, function (e) {
			e.preventDefault();
			this.destroy();
		}));
		dojo.connect($("thumbdown_confirm"), "onclick", dojo.hitch(this, function (e) {
			e.preventDefault();
			this.thumbdownDlg.destroy();
			this.onGiveThumbDownStep2();
		}));
	}

	onGiveThumbDownStep2(t: Event) {
		this.thumbdownDlg = new ebg.popindialog();
		this.thumbdownDlg.create("thumbdownDialog2");
		this.thumbdownDlg.setTitle(__("lang_mainsite", "You are about to give a thumb down."));
		this.thumbdownDlg.setMaxWidth(600);
		let i = '<div id="thumbdownDialog2" class="midSizeDialog">';
		i += __("lang_mainsite", "Is this a personal opinion or should everyone avoid this player?") + "<br/><br/>";
		i += "<p>";
		i += "<a class='bgabutton bgabutton_blue bgabutton_big' id='thumbdown_personal' href='#'><span>" + __("lang_mainsite", "This is my personal opinion") + "</span></a><br/>";
		i += "<a class='bgabutton bgabutton_blue bgabutton_big' id='thumbdown_community' href='#'><span>" + __("lang_mainsite", "Everyone should avoid this person") + "</span></a><br/>";
		i += "<a class='bgabutton bgabutton_gray bgabutton_big' id='thumbdown_cancel2' href='#'><span>" + __("lang_mainsite", "Cancel") + "</span></a>";
		i += "</p>";
		i += "</div>";
		this.thumbdownDlg.setContent(i);
		this.thumbdownDlg.show();
		dojo.connect(
			$("thumbdown_personal"),
			"onclick",
				dojo.hitch(this, function (e) {
				e.preventDefault();
				this.thumbdownDlg.destroy();
				let t = { player: this.target_player, value: -1, category: "personal" } as BGA.AjaxActions["/table/table/changeReputation.html"];
				this.bForceThumbDown && (t.f = 1);
				this.page.ajaxcall("/table/table/changeReputation.html", t, this, function (e) {
					this.value = -1;
					this.updateControl();
				});
			})
		);
		dojo.connect(
			$("thumbdown_cancel2"),
			"onclick",
			dojo.hitch(this, function (e) {
				e.preventDefault();
				this.thumbdownDlg.destroy();
			})
		);
		dojo.connect(
			$("thumbdown_community"),
			"onclick",
			dojo.hitch(this, function (e) {
				e.preventDefault();
				this.thumbdownDlg.destroy();
				this.onGiveThumbDownStep3();
			})
		);
	}

	onGiveThumbDownStep3(t: Event) {
		this.thumbdownDlg = new ebg.popindialog();
		this.thumbdownDlg.create("thumbdownDialog3");
		this.thumbdownDlg.setTitle(__("lang_mainsite", "You are about to give a thumb down."));
		this.thumbdownDlg.setMaxWidth(600);
		let i = '<div id="thumbdownDialog3" class="midSizeDialog">';
		i += __("lang_mainsite", "Please tell us why nobody should play with X?") + "<br/><br/>";
		i += "<p>";
		i += "<a class='bgabutton bgabutton_blue thumbdown_apply' id='thumbdown_chat' href='#'><span>" + __("lang_mainsite", "This player is aggressive/insulting or said innapropriate things in the chat") + "</span></a>";
		i += "<a class='bgabutton bgabutton_blue thumbdown_apply' id='thumbdown_slow'  href='#'><span>" + __("lang_mainsite", "This player plays too slowly and/or has frequent disconnections") + "</span></a>";
		i += "<a class='bgabutton bgabutton_blue thumbdown_apply' id='thumbdown_leave' href='#'><span>" + __("lang_mainsite", "This player quits/abandoned the game on purpose") + "</span></a>";
		i += "<a class='bgabutton bgabutton_blue thumbdown_apply' id='thumbdown_kingmaking' href='#'><span>" + __("lang_mainsite", "This player is doing some Kingmaking / team play.") + "</span></a>";
		i += "<a class='bgabutton bgabutton_blue thumbdown_apply' id='thumbdown_other'  href='#'><span>" + __("lang_mainsite", "This player should be avoided for another reason") + "</span></a>";
		i += "<a class='bgabutton bgabutton_gray thumbdown_apply' id='thumbdown_personal' href='#'><span>" + __("lang_mainsite", "Nevermind, this is just my opinion finally") + "</span></a>";
		i += "</p>";
		i += "</div>";
		this.thumbdownDlg.setContent(i);
		this.thumbdownDlg.show();
		dojo.query(".thumbdown_apply").connect(
			"onclick", 
			dojo.hitch(this, function (e) {
				e.preventDefault();
				this.thumbdownDlg.destroy();
				let t = e.currentTarget.id.substr(10),
					i = { player: this.target_player, value: -1, category: t } as BGA.AjaxActions["/table/table/changeReputation.html"];
				this.bForceThumbDown && (i.f = 1);
				this.page.ajaxcall("/table/table/changeReputation.html", i, this, function (e) {
					this.value = -1;
					this.updateControl();
					"personal" != t && this.onGiveThumbDownFinal();
				});
			})
		);
	}

	onGiveThumbDownFinal() {
		this.thumbdownDlg = new ebg.popindialog();
		this.thumbdownDlg.create("thumbdownDialog4");
		this.thumbdownDlg.setTitle(__("lang_mainsite", "Thank you"));
		this.thumbdownDlg.setMaxWidth(600);
		let t = '<div id="thumbdownDialog4" class="midSizeDialog">';
		t += dojo.string.substitute(__("lang_mainsite", "Thanks. Eventually, if you think this player violated our Terms of Service (ex : insults / verbal aggression), you should ${action} to moderators in addition."), {
			action: '<a class="bga-link" href="/newreport?player=' + this.target_player + '" id="thumbdown_report">' + __("lang_mainsite", "Report this player") + "</a>"
		});
		t += "<p>";
		t += "</p>";
		t += "</div>";
		this.thumbdownDlg.setContent(t);
		this.thumbdownDlg.show();
		dojo.connect(
			$("thumbdown_cancel"),
			"onclick",
			dojo.hitch(this.thumbdownDlg, function (e) {
				e.preventDefault();
				this.destroy();
			})
		);
		dojo.connect(
			$("thumbdown_report"),
			"onclick",
			dojo.hitch(this.thumbdownDlg, function (e) {
				dojo.destroy("thumbdownDialog4");
				this.destroy();
			})
		);
	}
}

let Thumb = declare("ebg.thumb", Thumb_Template);
export = Thumb;

declare global {
	namespace BGA {
		type Thumb = typeof Thumb;
		interface EBG { thumb: Thumb; }
	}
	var ebg: BGA.EBG;
}