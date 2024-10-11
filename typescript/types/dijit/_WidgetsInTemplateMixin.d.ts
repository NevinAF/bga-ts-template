declare var _WidgetsInTemplateMixin: DijitJS._WidgetsInTemplateMixinConstructor;
declare global {
    namespace DojoJS {
        interface Dijit {
            _WidgetsInTemplateMixin: typeof _WidgetsInTemplateMixin;
        }
    }
}
export = _WidgetsInTemplateMixin;
//# sourceMappingURL=_WidgetsInTemplateMixin.d.ts.map