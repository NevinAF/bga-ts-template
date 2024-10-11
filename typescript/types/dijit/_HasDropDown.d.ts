declare var _HasDropDown: DojoJS.DojoClass<{
    _focusManager: DojoJS.Stateful & import("../dojo/Evented") & DijitJS.Focus & DojoJS.DojoClassObject<DojoJS.Stateful & import("../dojo/Evented") & DijitJS.Focus>;
} & DijitJS._HasDropDown<any>, []>;
declare global {
    namespace DojoJS {
        interface Dijit {
            _HasDropDown: typeof _HasDropDown;
        }
    }
}
export = _HasDropDown;
//# sourceMappingURL=_HasDropDown.d.ts.map