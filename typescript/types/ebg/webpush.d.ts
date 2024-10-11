type ExtendedPushSubscription = PushSubscription & {
    keys: {
        auth: string;
        p256dh: string;
    };
};
declare global {
    namespace BGA {
        interface AjaxActions {
            "/player/profile/savePushSubscription.html": {
                isnewbrowser: boolean;
                browser: string;
                endpoint: ExtendedPushSubscription['endpoint'];
                auth: string;
                p256dh: string;
            };
        }
    }
}
declare class WebPush_Template {
    ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
    serviceWorkerRegistered: boolean;
    permissionAlreadyGranted: boolean;
    permissionGranted: boolean;
    pushSubscription: ExtendedPushSubscription | null;
    l_serviceworker_url: string;
    browser: string;
    constructor(callback: InstanceType<BGA.CorePage>["ajaxcall"]);
    init(): Promise<void>;
    refresh(): Promise<never> | void;
    revoke(): void;
    isSupported(): boolean;
    isAuthorized(): boolean;
    registerServiceWorker(): Promise<void | ServiceWorkerRegistration>;
    askPermission(): Promise<void>;
    subscribeUserToPush(): Promise<PushSubscription>;
    savePushSubscription(e: any): void;
}
declare let WebPush: DojoJS.DojoClass<WebPush_Template, [callback: <Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined) => void]>;
export = WebPush;
declare global {
    namespace BGA {
        type WebPush = typeof WebPush;
        interface EBG {
            webpush: WebPush;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=webpush.d.ts.map