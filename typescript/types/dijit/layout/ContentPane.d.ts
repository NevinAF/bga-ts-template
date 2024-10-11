import "dojo/i18n";
declare var ContentPane: DijitJS.layout.ContentPaneConstructor;
declare global {
    namespace DojoJS {
        interface DijitLayout {
            ContentPane: typeof ContentPane;
        }
        interface Dijit {
            layout: DijitLayout;
        }
    }
}
export = ContentPane;
//# sourceMappingURL=ContentPane.d.ts.map