declare var _FocusMixin: DojoJS.DojoClass<{
    _focusManager: DojoJS.Stateful & import("../dojo/Evented") & DijitJS.Focus & DojoJS.DojoClassObject<DojoJS.Stateful & import("../dojo/Evented") & DijitJS.Focus>;
}, []>;
declare global {
    namespace DojoJS {
        interface Dijit {
            _FocusMixin: typeof _FocusMixin;
        }
    }
}
export = _FocusMixin;
//# sourceMappingURL=_FocusMixin.d.ts.map