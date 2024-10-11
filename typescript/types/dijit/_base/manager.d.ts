import dijit = require("../main");
declare var manager: {
    byId: <T extends DijitJS._WidgetBase>(id: string | T) => T;
    getUniqueId: (widgetType: string) => string;
    findWidgets: (root: Node, skipNode?: Node) => DijitJS._WidgetBase[];
    _destroyAll: any;
    byNode: <T extends DijitJS._WidgetBase>(node: Element | Node) => T;
    getEnclosingWidget: (node: Element | Node) => DijitJS._WidgetBase;
    defaultDuration: number;
};
type Manager = typeof manager;
declare global {
    namespace DojoJS {
        interface Dijit extends Manager {
        }
    }
}
export = dijit;
//# sourceMappingURL=manager.d.ts.map