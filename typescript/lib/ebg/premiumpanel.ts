import e = require("dojo");
import declare = require("dojo/_base/declare");
import "dojox/fx";


class PremiumPanel_Template {
	page: InstanceType<BGA.SiteCore> | null = null;
	currentpanel: BGA.ID | null = null;

	create(page: InstanceType<BGA.SiteCore>) {
		this.page = page;
		e.query<HTMLElement>(".premiummenuitem").connect(
			"onclick",
			this as PremiumPanel_Template,
			"onMenuItemClick"
		);
		this.switchToPanel(0);
	}

	panel_id_to_name(panel_id: BGA.ID): 'premiumtime' | 'premiumconfig' | `premiumplayer_${number}` {
		return 0 === toint(panel_id)
			? "premiumtime"
			: -1 === toint(panel_id)
			? "premiumconfig"
			: `premiumplayer_${panel_id}`;
	}

	switchToPanel(panel_id: BGA.ID) {
		let panel_name: string;
		if (null !== this.currentpanel) {
			this.currentpanel;
			panel_name = this.panel_id_to_name(this.currentpanel);
			e.style(panel_name + "_title", "display", "none");
		}
		this.currentpanel = panel_id;
		panel_name = this.panel_id_to_name(this.currentpanel);
		$(panel_name + "_title");
		e.style(panel_name + "_title", "display", "inline-block");
		e.query(".premiuminfopanel").style("display", "none");
		if (0 === toint(panel_id))
			e.style("premiumtimepanel", "display", "block");
		else if (-1 === toint(panel_id))
			e.style("premiumconfigpanel", "display", "block");
		else {
			e.style("premiumplayerpanel", "display", "block");
			if (!this.page!.gamedatas!.players[panel_id]) {
				console.error("Invalid panel id: " + panel_id);
				return;
			}
			$<HTMLAnchorElement>("pr_seeplayerstat")!.href =
				"/playerstat?id=" +
				panel_id +
				"&gamename=" +
				this.page!.game_name;
		}
	}

	onMenuItemClick(e: Event) {
		e.preventDefault();
		if ("premiumtime" == (e.currentTarget as Element).id)
			this.switchToPanel(0);
		else if ("premiumconfig" == (e.currentTarget as Element).id)
			this.switchToPanel(-1);
		else {
			var t = (e.currentTarget as Element).id.substr(14);
			this.switchToPanel(Number(t));
		}
	}

	seePlayerStats(e: Event) {
		e.preventDefault();
		this.currentpanel, this.page!.game_name;
	}
}

let PremiumPanel = declare("ebg.premiumpanel", PremiumPanel_Template);
export = PremiumPanel;

declare global {
	namespace BGA {
		type PremiumPanel = typeof PremiumPanel;
		interface EBG { premiumpanel: PremiumPanel; }
	}
	var ebg: BGA.EBG;
}