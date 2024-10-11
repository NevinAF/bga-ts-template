declare var _ContentPaneResizeMixin: DijitJS.layout._ContentPaneResizeMixinConstructor;
declare global {
    namespace DojoJS {
        interface _ContentPaneResizeMixin extends Type<typeof _ContentPaneResizeMixin> {
        }
        interface DijitLayout {
            _ContentPaneResizeMixin: _ContentPaneResizeMixin;
        }
        interface Dijit {
            layout: DijitLayout;
        }
    }
}
export = _ContentPaneResizeMixin;
//# sourceMappingURL=_ContentPaneResizeMixin.d.ts.map