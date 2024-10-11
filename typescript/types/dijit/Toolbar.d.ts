declare var Toolbar: DijitJS.ToolbarConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            Toolbar: typeof Toolbar;
        }
    }
}
export = Toolbar;
//# sourceMappingURL=Toolbar.d.ts.map