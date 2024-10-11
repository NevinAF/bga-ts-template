interface SelectionConstructor {
    new (s: Window): Selection;
    getType(): string;
    getSelectedText(): string;
    getSelectedHtml(): string;
    getSelectedElement(): Element;
    getParentElement(): Element;
    hasAncestorElement(e: string): boolean;
    getAncestorElement(e: string): Element;
    isTag(e: Element, t: string[]): string;
    getParentOfType(e: Element, t: string[]): Element;
    collapse(e: boolean): void;
    remove(): void;
    selectElementChildren(e: string, i: boolean): void;
    selectElement(e: string, i: boolean): void;
    inSelection(e: Element): boolean;
    getBookmark(): {
        isCollapsed: boolean;
        mark: any;
    };
    moveToBookmark(t: {
        isCollapsed: boolean;
        mark: any;
    }): void;
    isCollapsed(): boolean;
}
declare var selection: InstanceType<SelectionConstructor> & {
    SelectionManager: SelectionConstructor;
};
declare global {
    namespace DojoJS {
        interface Dijit {
            selection: typeof selection;
        }
    }
}
export = selection;
//# sourceMappingURL=selection.d.ts.map