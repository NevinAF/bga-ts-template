declare var _LayoutWidget: DijitJS.layout._LayoutWidgetConstructor;
declare global {
    namespace DojoJS {
        interface DijitLayout {
            _LayoutWidget: typeof _LayoutWidget;
        }
        interface Dijit {
            layout: DijitLayout;
        }
    }
}
export = _LayoutWidget;
//# sourceMappingURL=_LayoutWidget.d.ts.map