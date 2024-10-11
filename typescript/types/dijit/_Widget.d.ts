import "dojo/uacss";
import "./hccss";
declare var _Widget: DojoJS.DojoClass<DijitJS._Widget>;
declare global {
    namespace DojoJS {
        interface Dijit {
            _Widget: typeof _Widget;
        }
    }
}
export = _Widget;
//# sourceMappingURL=_Widget.d.ts.map