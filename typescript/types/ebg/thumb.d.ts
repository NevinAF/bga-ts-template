declare global {
    namespace BGA {
        interface AjaxActions {
            "/table/table/changeReputation.html": {
                player: BGA.ID;
                value: number;
                category?: string | "personal";
                f?: 1;
            };
        }
    }
}
/**
 * The Thumb class represents a thumbs-up/thumbs-down control for player reputation in a game.
 */
declare class Thumb_Template {
    page: InstanceType<BGA.CorePage> | null;
    div_id: string | null;
    div: HTMLElement | null;
    value: number;
    target_player: BGA.ID | null;
    staticControl: boolean;
    bForceThumbDown: boolean;
    thumbdownDlg: InstanceType<BGA.PopinDialog> | null;
    /**
     * Initializes the Thumb control.
     * @param page - The game GUI page.
     * @param div_id - The ID of the div element where the control will be placed.
     * @param target_player - The target player for the thumb control.
     * @param value - The initial value of the thumb control (as a string).
     */
    create(page: InstanceType<BGA.CorePage>, div_id: string, target_player: BGA.ID, value: BGA.ID): void;
    updateControl(): void;
    onCancelOpinion(event: Event): void;
    onGiveThumbUp(e: Event): void;
    onGiveThumbDown(t: Event): void;
    onGiveThumbDownStep2(t: Event): void;
    onGiveThumbDownStep3(t: Event): void;
    onGiveThumbDownFinal(): void;
}
declare let Thumb: DojoJS.DojoClass<Thumb_Template, []>;
export = Thumb;
declare global {
    namespace BGA {
        type Thumb = typeof Thumb;
        interface EBG {
            thumb: Thumb;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=thumb.d.ts.map