import ready = require("../ready");
import "./kernel";
import "./connect";
import "./unload";
import "./window";
import "./event";
import "./html";
import "./NodeList";
import "../query";
import "./xhr";
import "./fx";
declare global {
    namespace DojoJS {
        interface Has {
            (name: "config-selectorEngine"): "acme";
        }
    }
}
export = ready;
//# sourceMappingURL=browser.d.ts.map