import dojo = require("dojo");
import declare = require("dojo/_base/declare");

declare global {
	namespace BGA {
		interface PageHeaderButton {
			btn: string;
			section: string | string[];
			defaults?: boolean;
			onShow?: () => void;
			onHide?: () => void;
		}
	}
}

class PageHeader_Template {
	page: any = null;
	div_id: string | null = null;
	adaptsubtrigger: DojoJS.Handle | null = null;
	bDisableAdaptMenu: boolean = false;
	bUpdateQueryString: boolean = false;

	buttons?: Record<string, BGA.PageHeaderButton>;
	bAllByDefault: boolean = false;

	onSectionChanged: () => void = function () {};

	create(page: any, id: string, buttons: Record<string, BGA.PageHeaderButton>, allByDefault: boolean, updateQueryString?: boolean) {
		this.page = page;
		this.div_id = id;
		this.buttons = buttons;
		this.bAllByDefault = allByDefault;
		this.bUpdateQueryString = updateQueryString === undefined || updateQueryString;
		allByDefault || this.hideAllSections();
		for (var s in buttons) {
			var r = buttons[s]!;
			dojo.connect(
				$(r.btn)!,
				"onclick",
				this as PageHeader_Template,
				"onClickButton"
			);
			if (r.defaults !== undefined && r.defaults) {
				this.showSection(r.section, r.btn);
			}
		}
		dojo.query<HTMLElement>("#" + id + " h2").connect(
			"onclick",
			this as PageHeader_Template,
			"onClickHeader"
		);
		this.adaptsubtrigger = dojo.connect(
			window,
			"onresize",
			this as PageHeader_Template,
			dojo.hitch(this as PageHeader_Template, "adaptSubmenu")
		);
		this.adaptSubmenu();
	}

	destroy() {
		if (this.adaptsubtrigger !== null) {
			dojo.disconnect(this.adaptsubtrigger);
			this.adaptsubtrigger = null;
		}
	}

	adaptSubmenu() {
		if (!this.bDisableAdaptMenu && $(this.div_id)) {
			dojo.removeClass(
				this.div_id!,
				"pageheader_menu_smallwidth"
			);
			var t: number | null = null,
				i = false;
			dojo.query<HTMLElement>(
				"#" + this.div_id + " .pageheader_menuitem"
			).forEach(function (n) {
				if (dojo.style(n, "display") !== "none") {
					var o = dojo.position(n);
					if (t === null) {
						t = o.y;
					} else if (Math.abs(t - o.y) > 10) {
						i = true;
					}
				}
			});
			if (i) {
				dojo.addClass(
					this.div_id!,
					"pageheader_menu_smallwidth"
				);
			}
		}
	}

	getSelected() {
		var t = dojo.query<HTMLElement>(
			"#" + this.div_id + " .pageheader_menuitemselected"
		);
		return t.length !== 1 ? null : t[0]!.id;
	}

	getNumberSelected() {
		return dojo.query<HTMLElement>(
			"#" + this.div_id + " .pageheader_menuitemselected"
		).length;
	}

	hideAllSections() {
		for (var t in this.buttons) {
			dojo.query<HTMLElement>(
				"#" +
					this.div_id +
					" .pageheader_menuitemselected"
			).removeClass("pageheader_menuitemselected");
			let section = this.buttons[t]!.section;
			if (typeof section === "object") {
				for (var i in section) {
					if ($(section[i])) {
						dojo.style(
							section[i]!,
							"display",
							"none"
						);
					} else {
						console.error(
							"pageheader coulnd find : " +
								section[i]
						);
					}
				}
			} else {
				if ($(section)) {
					dojo.style(
						section,
						"display",
						"none"
					);
				} else {
					console.error(
						"pageheader: " +
							section +
							" does not exists"
					);
				}
			}
		}
		dojo.query<HTMLElement>(
			"#" +
				this.div_id +
				" .pageheader_hide_if_not_active"
		).style("display", "none");
	}

	showDefault() {
		if (this.bAllByDefault) {
			for (var t in this.buttons) {
				let section = this.buttons[t]!.section;
				if (typeof this.buttons[t] === "object") { // Typo?
					// @ts-ignore - TODO: issue caused by typo above
					for (var t in section) {
						if ($(section[t])) {
							dojo.style(
								section[t]!,
								"display",
								"block"
							);
						} else {
							console.error(
								"pageheader coulnd find : " +
									section[t]
							);
						}
					}
				} else {
					// @ts-ignore - TODO: issue caused by typo above
					dojo.style(section, "display", "block");
				}
			}
			dojo.query<HTMLElement>(
				"#" +
					this.div_id +
					" .pageheader_menuitemselected"
			).removeClass("pageheader_menuitemselected");
			dojo.query<HTMLElement>(
				"#" +
					this.div_id +
					" .pageheader_hide_if_not_active"
			).style("display", "block");
			this.updateQueryString("");
		} else {
			this.hideAllSections();
			for (var t in this.buttons) {
				var i = this.buttons[t]!;
				if (i.defaults !== undefined) {
					this.showSection(i.section, i.btn);
				}
			}
		}
	}

	showSection(t: string | string[], i: string) {
		if (t !== null && $(t)) {
			if (typeof t === "object") {
				for (var n in t) {
					dojo.style(t[n]!, "display", "block");
				}
			} else {
				dojo.style(t, "display", "block");
			}
		}
		dojo.addClass(i, "pageheader_menuitemselected");
		this.updateQueryString(i);
		this.onSectionChanged();
	}


	onClickButton(t: Event) {
		dojo.stopEvent(t);
		this.showSectionFromButton((t.currentTarget as Element).id);
	}

	showSectionFromButton(e: string) {
		for (var t in this.buttons) {
			var i = this.buttons[t]!;
			if (i.btn == e) {
				this.hideAllSections();
				this.showSection(i.section, i.btn);
				if (i.onShow !== undefined) {
					i.onShow();
				}
				if (i.onHide !== undefined) {
					i.onHide();
				}
			}
		}
	}

	onClickHeader(e: Event) {
		this.showDefault();
	}

	updateQueryString(t: string) {
		if (this.bUpdateQueryString) {
			var i = "",
				n = window.location.search,
				o = n.split("?"),
				module: string;
			if (o.length >= 2 && o[1]!.length > 0) {
				for (var a = 1; a < o.length; a++) {
					if (a > 1) {
						i += "%3F";
					}
					i += o[a];
				}
				module = o[0]!;
			} else {
				module = n;
			}
			var s = dojo.queryToObject(i);
			if (t === "" || this.getNumberSelected() !== 1) {
				// @ts-ignore code not needed.
				s.section = null;
				delete s["section"];
			} else {
				s["section"] = t.substr(11);
			}
			i = dojo.objectToQuery(s);
			var r = module;
			if (i !== "") {
				r += "?" + i;
			}
			if (
				window.location.search != r &&
				"undefined" != typeof mainsite
			) {
				mainsite.disableNextHashChange = true;
				history.pushState(
					null,
					"",
					window.location.pathname + r
				);
			}
		}
	}
}

let PageHeader = declare("ebg.pageheader", PageHeader_Template);
export = PageHeader;

declare global {
	namespace BGA {
		type PageHeader = typeof PageHeader;
		interface EBG { pageheader: PageHeader; }
	}
	var ebg: BGA.EBG;
}