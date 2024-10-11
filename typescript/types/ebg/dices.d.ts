declare class Dices_Template {
    div_id: string | null;
    div: HTMLElement | null;
    dice_nbr: number;
    dice_type: number;
    create(t: string, i: number, n: number): void;
    setValue(t: Record<string, number>): void;
}
declare let Dices: DojoJS.DojoClass<Dices_Template, []>;
export = Dices;
declare global {
    namespace BGA {
        type Dices = typeof Dices;
        interface EBG {
            dices: Dices;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=dices.d.ts.map