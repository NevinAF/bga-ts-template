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
declare class PageHeader_Template {
    page: any;
    div_id: string | null;
    adaptsubtrigger: DojoJS.Handle | null;
    bDisableAdaptMenu: boolean;
    bUpdateQueryString: boolean;
    buttons?: Record<string, BGA.PageHeaderButton>;
    bAllByDefault: boolean;
    onSectionChanged: () => void;
    create(page: any, id: string, buttons: Record<string, BGA.PageHeaderButton>, allByDefault: boolean, updateQueryString?: boolean): void;
    destroy(): void;
    adaptSubmenu(): void;
    getSelected(): string | null;
    getNumberSelected(): number;
    hideAllSections(): void;
    showDefault(): void;
    showSection(t: string | string[], i: string): void;
    onClickButton(t: Event): void;
    showSectionFromButton(e: string): void;
    onClickHeader(e: Event): void;
    updateQueryString(t: string): void;
}
declare let PageHeader: DojoJS.DojoClass<PageHeader_Template, []>;
export = PageHeader;
declare global {
    namespace BGA {
        type PageHeader = typeof PageHeader;
        interface EBG {
            pageheader: PageHeader;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=pageheader.d.ts.map