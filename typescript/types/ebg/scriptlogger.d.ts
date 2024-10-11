/**
 * Script Logger is a class that logs messages to the server.
 */
declare class ScriptLogger_Template {
    logName: string;
    logBuffer: string | null;
    identifier: string;
    ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
    constructor(e: string, t: InstanceType<BGA.CorePage>["ajaxcall"], i: string);
    log(e: string): void;
    flush(): void;
}
declare let ScriptLogger: DojoJS.DojoClass<ScriptLogger_Template, [e: string, t: <Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined) => void, i: string]>;
export = ScriptLogger;
declare global {
    namespace BGA {
        type ScriptLogger = typeof ScriptLogger;
        interface EBG {
            scriptlogger: ScriptLogger;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=scriptlogger.d.ts.map