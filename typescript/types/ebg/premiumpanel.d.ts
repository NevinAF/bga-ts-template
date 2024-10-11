import "dojox/fx";
declare class PremiumPanel_Template {
    page: InstanceType<BGA.SiteCore> | null;
    currentpanel: BGA.ID | null;
    create(page: InstanceType<BGA.SiteCore>): void;
    panel_id_to_name(panel_id: BGA.ID): 'premiumtime' | 'premiumconfig' | `premiumplayer_${number}`;
    switchToPanel(panel_id: BGA.ID): void;
    onMenuItemClick(e: Event): void;
    seePlayerStats(e: Event): void;
}
declare let PremiumPanel: DojoJS.DojoClass<PremiumPanel_Template, []>;
export = PremiumPanel;
declare global {
    namespace BGA {
        type PremiumPanel = typeof PremiumPanel;
        interface EBG {
            premiumpanel: PremiumPanel;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=premiumpanel.d.ts.map