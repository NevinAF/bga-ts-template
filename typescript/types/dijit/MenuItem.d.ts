declare var MenuItem: DijitJS.MenuItemConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            MenuItem: typeof MenuItem;
        }
    }
}
export = MenuItem;
//# sourceMappingURL=MenuItem.d.ts.map