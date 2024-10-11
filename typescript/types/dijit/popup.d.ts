import "dojo/touch";
declare var popup: DojoJS.DojoClass<DijitJS.Popup, []>;
declare global {
    namespace DojoJS {
        interface Dijit {
            popup: InstanceType<typeof popup>;
        }
    }
}
declare const _default: DijitJS.Popup & DojoJS.DojoClassObject<DijitJS.Popup>;
export = _default;
//# sourceMappingURL=popup.d.ts.map