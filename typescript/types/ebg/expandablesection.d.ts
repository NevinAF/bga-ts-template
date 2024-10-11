declare class ExpandableSection_Template {
    page: any;
    div_id: string | null;
    create(t: any, i: string): void;
    destroy(): void;
    toggle(t: Event): void;
    expand(): void;
    collapse(): void;
}
declare let ExpandableSection: DojoJS.DojoClass<ExpandableSection_Template, []>;
export = ExpandableSection;
declare global {
    namespace BGA {
        type ExpandableSection = typeof ExpandableSection;
        interface EBG {
            expandablesection: ExpandableSection;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=expandablesection.d.ts.map