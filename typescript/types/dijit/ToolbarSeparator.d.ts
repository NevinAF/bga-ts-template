declare var ToolbarSeparator: DijitJS.ToolbarSeparatorConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            ToolbarSeparator: typeof ToolbarSeparator;
        }
    }
}
export = ToolbarSeparator;
//# sourceMappingURL=ToolbarSeparator.d.ts.map