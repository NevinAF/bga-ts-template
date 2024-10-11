declare var DropDownMenu: DijitJS.DropDownMenuConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            DropDownMenu: typeof DropDownMenu;
        }
    }
}
export = DropDownMenu;
//# sourceMappingURL=DropDownMenu.d.ts.map