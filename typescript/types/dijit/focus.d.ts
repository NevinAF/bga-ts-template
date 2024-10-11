import Evented = require("dojo/Evented");
declare var focus: DojoJS.Stateful & Evented & DijitJS.Focus & DojoJS.DojoClassObject<DojoJS.Stateful & Evented & DijitJS.Focus>;
declare global {
    namespace DojoJS {
        interface Dijit {
            focus: typeof focus;
        }
    }
}
export = focus;
//# sourceMappingURL=focus.d.ts.map