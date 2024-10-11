declare var TooltipDialog: DijitJS.TooltipDialogConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            TooltipDialog: typeof TooltipDialog;
        }
    }
}
export = TooltipDialog;
//# sourceMappingURL=TooltipDialog.d.ts.map