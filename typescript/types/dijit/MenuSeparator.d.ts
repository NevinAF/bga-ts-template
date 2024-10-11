declare var MenuSeparator: DijitJS.MenuSeparatorConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            MenuSeparator: typeof MenuSeparator;
        }
    }
}
export = MenuSeparator;
//# sourceMappingURL=MenuSeparator.d.ts.map