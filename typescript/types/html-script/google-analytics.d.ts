/** From Google Analytics */
declare var ga: Function;
/** From Google Analytics */
declare var gaplugins: {
    Linker: Function;
};
/** From Google Analytics */
declare var google_tag_data: GoogleAnalytics.GoogleTagData;
/** From Google Analytics */
declare var google_tag_manager: GoogleAnalytics.GoogleTagManager;
declare namespace GoogleAnalytics {
    interface GoogleTagData {
        glBridge: GlBridge;
        tcBridge: TcBridge;
        tidr: Tidr;
        ics: Ics;
    }
    interface Ics {
        entries: Entries;
        active: boolean;
        usedDeclare: boolean;
        usedDefault: boolean;
        usedUpdate: boolean;
        usedImplicit: boolean;
        accessedDefault: boolean;
        accessedAny: boolean;
        wasFunctionLate: boolean;
        waitPeriodTimedOut: boolean;
        j: any[];
    }
    interface Entries {
        ad_storage: Adstorage;
        analytics_storage: Adstorage;
        ad_user_data: Adstorage;
        ad_personalization: Adstorage;
    }
    interface Adstorage {
        implicit: boolean;
    }
    interface Tidr {
        container: Container;
        destination: Destination;
        canonical: Canonical;
        pending: any[];
        siloed: any[];
    }
    interface Canonical {
        '59612018': _59612018;
    }
    interface _59612018 {
        this_is_an_empty_object: boolean;
    }
    interface Destination {
        'GTM-M8Q8TH8': GTMM8Q8TH82;
    }
    interface GTMM8Q8TH82 {
        canonicalContainerId: string;
        scriptContainerId: string;
        state: number;
        containers: string[];
        destinations: string[];
        scriptSource: string;
        htmlLoadOrder: string;
        loadScriptType: string;
    }
    interface Container {
        'GTM-M8Q8TH8': GTMM8Q8TH8;
    }
    interface GTMM8Q8TH8 {
        canonicalContainerId: string;
        scriptContainerId: string;
        state: number;
        containers: string[];
        destinations: string[];
        scriptElement: ScriptElement;
        scriptSource: string;
        htmlLoadOrder: string;
        loadScriptType: string;
    }
    interface ScriptElement {
    }
    interface TcBridge {
        registerUa: Function;
        setSideload: Function;
    }
    interface GlBridge {
        auto: Function;
        passthrough: Function;
        decorate: Function;
        generate: Function;
        get: Function;
    }
    interface GoogleTagManager {
        tcf: object;
        pscdl: string;
        'GTM-M8Q8TH8': GTMM8Q8TH8;
        dataLayer: DataLayer2;
        mb: Mb;
        r: R;
        sequence: number;
    }
    interface R {
        j: J;
        D: object;
    }
    interface J {
        '59612018': _59612018;
    }
    interface _59612018 {
        _entity: Entity;
        _event: Entity;
    }
    interface Entity {
        internal: Function[];
        external: any[];
    }
    interface Mb {
        messages: any[];
        j: Function[];
    }
    interface DataLayer2 {
        subscribers: number;
        gtmDom: boolean;
        gtmLoad: boolean;
    }
    interface GTMM8Q8TH8 {
        dataLayer: DataLayer;
        callback: Function;
        bootstrap: number;
        _spx: boolean;
    }
    interface DataLayer {
        name: string;
        set: Function;
        get: Function;
        reset: Function;
    }
}
//# sourceMappingURL=google-analytics.d.ts.map