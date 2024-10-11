/** Utility type which converts a union of object types to an intersection of object types. This allows for all possible properties to be accessible on a type without needing to do any casting. */
type AnyOf<T> = (T extends {} ? (x: T) => any : never) extends (x: infer R) => void ? R : never;
/** Utility type which returns all keys of an object type that have a value type of ValueType. */
type KeysWithType<T, ValueType> = {
    [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T];
/** Utility type that uses the default type, D, when the supplied type, T, is 'never' */
type Default<T, D = any> = [T] extends [never] ? D : T;
type Falsy = false | 0 | "" | null | undefined;
type Constructor<T> = {
    new (...args: any[]): T;
    prototype: T;
};
type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : [];
type Length<T extends any[]> = T['length'];
type Push<T extends any[], E> = [...T, E];
type Skip<T extends any[], N extends number, I extends any[] = []> = Length<I> extends N ? T : Skip<Tail<T>, N, Push<I, any>>;
/**
 * Unions each index of two tuples:
 * A = [string, number, boolean]
 * B = [number, number, object, string]
 * UnionTuple<A, B> = [string | number, number, boolean | object, string]
 */
type UnionTuple<A extends any[], B extends any[]> = [
    ...{
        [K in keyof A]: A[K] | (K extends keyof B ? B[K] : never);
    },
    ...Skip<B, Length<A>>
];
type throws<T extends Error> = never;
type HexChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type InferHexColor<T extends string = string> = T extends `#${HexChar}${HexChar}${HexChar}${infer Rest1}` ? (Rest1 extends `` ? T : (Rest1 extends `${HexChar}${HexChar}${HexChar}` ? T : never)) : never;
type HexString = string;
/** A utility type for defining inline types using the interface or 'typeof' format. */
type Type<T> = T;
/** Defines a fixed length array. */
type Buffer<T, N extends number, Append extends unknown[] = []> = Append['length'] extends N ? Append : Buffer<T, N, [T, ...Append]>;
declare namespace BGA {
    type ID = number | `${number}`;
    type LanguageCode = 'ar' | 'be' | 'bg' | 'br' | 'ca' | 'cs' | 'da' | 'de' | 'el' | 'en' | 'es' | 'et' | 'fa' | 'fi' | 'fr' | 'gl' | 'he' | 'hi' | 'hr' | 'hu' | 'id' | 'it' | 'ja' | 'ko' | 'lt' | 'lv' | 'ms' | 'nb' | 'nl' | 'pt' | 'pl' | 'ro' | 'ru' | 'sk' | 'sl' | 'sr' | 'sv' | 'th' | 'tr' | 'uk' | 'vi' | 'zh-cn' | 'zh';
    /** Partial: This has been partially typed based on a subset of the BGA source code. */
    interface PlayerMetadata {
        user_id: BGA.ID;
        status: 'online' | 'offline' | string;
        device: 'desktop' | 'mobile' | string;
        language: LanguageCode;
        player_name: string;
        grade: BGA.ID;
        rank: BGA.ID;
        karma: BGA.ID;
        country: "US" | string;
        city: string | null;
        avatar: string | "000000";
        tutorial_seen: HexString;
        /** 0 = Female, 1 == Male, other = neutral. */
        gender: '0' | '1' | 'other' | null;
        is_premium: '0' | '1';
        is_beginner: '0' | '1';
        languages: {
            [code in LanguageCode]?: LanguageMetadata<code>;
        };
        country_infos: {
            name: "United States of America" | string;
            cur: "USD" | string;
            code: "US" | string;
            flag_x: number;
            flag_y: number;
        };
    }
    /** Partial: This has been partially typed based on a subset of the BGA source code. */
    interface LanguageMetadata<T = LanguageCode> {
        id: T;
        level: 0 | 1;
    }
    /**
     * An interface representing the base structure of a deck item (usually a card). This matches the structure of the php component `deck` and the `deck` table in the database. Note that all properties will be passed as string from the server but JS is able to automatically convert to the correct type without needing to parse the integer values.
     * @see {@link https://en.doc.boardgamearena.com/Deck | PHP Deck Component} for more information.
     */
    interface DeckItem {
        /** The unique identifier of the deck item. int(10) unsigned NOT NULL, primary key. */
        id: number;
        /** The type of the deck item. The meaning of this is game specific, however, 'deck' is always where the cards are created, and 'hand' is always where card go when drawn, and 'discard' is used for `autoreshuffle`. varchar(16) NOT NULL. */
        location: string;
        /** The location of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
        location_arg: number;
        /** The type of the deck item. The meaning of this is game specific. varchar(16) NOT NULL. */
        type: string;
        /** The type argument of the deck item. The meaning of this is game specific. int(11) NOT NULL. */
        type_arg: number;
    }
}
declare function fbAsyncInit(): void;
declare var FB: facebook.FacebookStatic;
declare namespace facebook {
    type FacebookEventType = "xfbml.render";
    type LoginStatus = "unknown";
    type FacebookEventCallback<TEvent extends FacebookEventType> = TEvent extends "xfbl.render" ? () => void : (response: StatusResponse) => void;
    type UserField = "website";
    type AgeRange = {
        min: 13;
        max: 17;
    } | {
        min: 18;
        max: 20;
    } | {
        min: 21;
        max: undefined;
    };
    type EducationExperience = any;
    type Experience = any;
    type Page = any;
    type PaymentPricepoints = any;
    type User = any;
    type VideoUploadLimits = any;
    interface FacebookStaticEvent {
        subscribe<TEvent extends FacebookEventType>(event: TEvent, callback: FacebookEventCallback<TEvent>): void;
        unsubscribe<TEvent extends FacebookEventType>(event: TEvent, callback: FacebookEventCallback<TEvent>): void;
    }
    interface FacebookStatic {
        api<TResponse>(path: string, callback: (response: TResponse) => void): void;
        api<TParams extends object, TResponse>(): void;
        api<TParam extends UserField>(): void;
        api<TParams extends object, TResponse>(path: string, method: "get" | "post" | "delete", params: TParams, callback: (response: TResponse) => void): void;
        AppEvents: any;
        Canvas: any;
        Event: FacebookStaticEvent;
        /**
         * The method FB.getAuthResponse() is a synchronous accessor for the current authResponse.
         * The synchronous nature of this method is what sets it apart from the other login methods.
         *
         * This method is similar in nature to FB.getLoginStatus(), but it returns just the authResponse object.
         */
        getAuthResponse(): AuthResponse | null;
        /**
         * FB.getLoginStatus() allows you to determine if a user is
         * logged in to Facebook and has authenticated your app.
         *
         * @param callback function to handle the response.
         * @param roundtrip force a roundtrip to Facebook - effectively refreshing the cache of the response object
         */
        getLoginStatus(callback: (response: StatusResponse) => void, roundtrip?: boolean): void;
        /**
         * The method FB.init() is used to initialize and setup the SDK.
         *
         * @param params params for the initialization.
         */
        init(params: InitParams): void;
        /**
         * Use this function to log the user in
         *
         * Calling FB.login() results in the JS SDK attempting to open a popup window.
         * As such, this method should only be called after a user click event, otherwise
         * the popup window will be blocked by most browsers.
         *
         * @param callback function to handle the response.
         * @param options optional ILoginOption to add params such as scope.
         */
        login(callback: (response: StatusResponse) => void, options?: LoginOptions): void;
        /**
         * Use this function to log the user in
         *
         * Calling FB.login() results in the JS SDK attempting to open a popup window.
         * As such, this method should only be called after a user click event, otherwise
         * the popup window will be blocked by most browsers.
         *
         * @param options optional ILoginOption to add params such as scope.
         */
        login(options?: LoginOptions): void;
        /**
         * The method FB.logout() logs the user out of your site and, in some cases, Facebook.
         *
         * @param callback optional function to handle the response
         */
        logout(callback?: (response: StatusResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/sharing/reference/share-dialog
         */
        ui(params: ShareDialogParams, callback?: (response: ShareDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/sharing/reference/share-dialog
         */
        ui(params: ShareOpenGraphDialogParams, callback?: (response: ShareOpenGraphDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/pages/page-tab-dialog
         */
        ui(params: AddPageTabDialogParams, callback?: (response: DialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/games/services/gamerequests
         */
        ui(params: GameRequestDialogParams, callback?: (response: GameRequestDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/payments/reference/paydialog
         */
        ui(params: PayDialogParams, callback?: (response: PayDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/games_payments/payments_lite
         */
        ui(params: PaymentsLiteDialogParams, callback?: (response: PaymentsLiteDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/videos/live-video/exploring-live#golivedialog
         */
        ui(params: LiveDialogParams, callback?: (response: LiveDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/sharing/reference/send-dialog
         */
        ui(params: SendDialogParams, callback?: (response: DialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/marketing-api/guides/offer-ads/#create-offer-dialog
         */
        ui(params: CreateOfferDialogParams, callback?: (response: CreateOfferDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/marketing-api/guides/lead-ads/create#create-leadgen-dialog
         */
        ui(params: LeadgenDialogParams, callback?: (response: LeadgenDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/marketing-api/guides/canvas-ads#canvas-ads-dialog
         */
        ui(params: InstantExperiencesAdsDialogParams, callback?: (response: InstantExperiencesAdsDialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/marketing-api/guides/canvas-ads#canvas-preview-dialog
         */
        ui(params: InstantExperiencesPreviewDialogParams, callback?: (response: DialogResponse) => void): void;
        /**
         * @see https://developers.facebook.com/docs/marketing-api/guides/collection#collection-ads-dialog
         */
        ui(params: CollectionAdsDialogParams, callback?: (response: CollectionAdsDialogResponse) => void): void;
        XFBML: any;
    }
    interface InitParams {
        appId?: string | undefined;
        version: string;
        cookie?: boolean | undefined;
        status?: boolean | undefined;
        xfbml?: boolean | undefined;
        frictionlessRequests?: boolean | undefined;
        hideFlashCallback?: boolean | undefined;
        autoLogAppEvents?: boolean | undefined;
    }
    interface LoginOptions {
        auth_type?: "reauthenticate" | "reauthorize" | "rerequest" | undefined;
        scope?: string | undefined;
        return_scopes?: boolean | undefined;
        enable_profile_selector?: boolean | undefined;
        profile_selector_ids?: string | undefined;
        config_id?: string | undefined;
        response_type?: string | undefined;
        override_default_response_type?: boolean | undefined;
        extras?: object | undefined;
    }
    interface DialogParams {
        app_id?: string | undefined;
        redirect_uri?: string | undefined;
        display?: "page" | "iframe" | "async" | "popup" | undefined;
    }
    interface ShareDialogParams extends DialogParams {
        method: "share";
        href: string;
        hashtag?: string | undefined;
        quote?: string | undefined;
        mobile_iframe?: boolean | undefined;
    }
    interface ShareOpenGraphDialogParams extends DialogParams {
        method: "share_open_graph";
        action_type: string;
        action_properties: {
            [property: string]: any;
        };
        href: string;
        hashtag?: string | undefined;
        quote?: string | undefined;
        mobile_iframe?: false | undefined;
    }
    interface AddPageTabDialogParams extends DialogParams {
        method: "pagetab";
        redirect_uri: string;
    }
    interface GameRequestDialogParams extends DialogParams {
        method: "apprequests";
        message: string;
        action_type?: "send" | "askfor" | "turn" | undefined;
        data?: string | undefined;
        exclude_ids?: string[] | undefined;
        filters?: "app_users" | "app_non_users" | Array<{
            name: string;
            user_ids: string[];
        }> | undefined;
        max_recipients?: number | undefined;
        object_id?: string | undefined;
        suggestions?: string[] | undefined;
        title?: string | undefined;
        to?: string | number | undefined;
    }
    interface SendDialogParams extends DialogParams {
        method: "send";
        to?: string | undefined;
        link: string;
    }
    interface PayDialogParams extends DialogParams {
        method: "pay";
        action: "purchaseitem";
        product: string;
        quantity?: number | undefined;
        quantity_min?: number | undefined;
        quantity_max?: number | undefined;
        pricepoint_id?: string | undefined;
        request_id?: string | undefined;
        test_currency?: string | undefined;
    }
    interface PaymentsLiteDialogParams extends DialogParams {
        method: "pay";
        action: "purchaseiap";
        product_id: string;
        developer_payload?: string | undefined;
        quantity?: number | undefined;
    }
    interface LiveDialogParams extends DialogParams {
        method: "live_broadcast";
        display: "popup" | "iframe";
        phase: "create" | "publish";
        broadcast_data?: LiveDialogResponse | undefined;
    }
    interface CreateOfferDialogParams extends DialogParams {
        account_id: string;
        display: "popup";
        method: "create_offer";
        objective: "APP_INSTALLS" | "CONVERSIONS" | "LINK_CLICKS" | "OFFER_CLAIMS" | "PRODUCT_CATALOG_SALES" | "STORE_VISITS";
        page_id: string;
    }
    interface LeadgenDialogParams extends DialogParams {
        account_id: string;
        display: "popup";
        method: "lead_gen";
        page_id: string;
    }
    interface InstantExperiencesAdsDialogParams extends DialogParams {
        display: "popup";
        method: "canvas_editor";
        business_id: string;
        page_id: string;
        canvas_id?: string | undefined;
    }
    interface InstantExperiencesPreviewDialogParams extends DialogParams {
        display: "popup";
        method: "canvas_preview";
        canvas_id: string;
    }
    interface CollectionAdsDialogParams extends InstantExperiencesAdsDialogParams {
        account_id: string;
        canvas_id?: undefined;
        template_id: string;
        product_catalog_id?: string | undefined;
        product_set_id?: string | undefined;
    }
    interface AuthResponse {
        accessToken?: string | undefined;
        data_access_expiration_time?: number | undefined;
        expiresIn: number;
        signedRequest?: string | undefined;
        userID: string;
        grantedScopes?: string | undefined;
        reauthorize_required_in?: number | undefined;
        code?: string | undefined;
    }
    interface StatusResponse {
        status: LoginStatus;
        authResponse: AuthResponse;
    }
    interface DialogResponse {
        error_code?: number | undefined;
        error_message?: string | undefined;
    }
    interface ShareDialogResponse extends DialogResponse {
        post_id: string;
    }
    interface ShareOpenGraphDialogResponse extends DialogResponse {
        post_id: string;
    }
    interface GameRequestDialogResponse extends DialogResponse {
        request: string;
        to: string[];
    }
    interface PayDialogResponse extends DialogResponse {
        payment_id: string;
        amount: string;
        currency: string;
        quantity: string;
        request_id?: string | undefined;
        status: "completed" | "initiated";
        signed_request: string;
    }
    interface PaymentsLiteDialogResponse extends DialogResponse {
        app_id: number;
        developer_payload?: string | undefined;
        payment_id: number;
        product_id: string;
        purchase_time: number;
        purchase_token: string;
        signed_request: string;
    }
    interface LiveDialogResponse extends DialogResponse {
        id: string;
        stream_url: string;
        secure_stream_url: string;
        status: string;
    }
    interface CreateOfferDialogResponse extends DialogResponse {
        id: string;
        success: boolean;
    }
    interface LeadgenDialogResponse extends DialogResponse {
        formID: string;
        success: boolean;
    }
    interface InstantExperiencesAdsDialogResponse extends DialogResponse {
        id: string;
        success: boolean;
    }
    interface CollectionAdsDialogResponse extends InstantExperiencesAdsDialogResponse {
    }
}
/** From Google GSI Client */
declare var google: GoogleGsiClient.Google;
/** From Google GSI Client */
declare var default_gsi: GoogleGsiClient.GSI;
/** From Google GSI Client */
declare var _F_toggles: Array<number>;
declare namespace GoogleGsiClient {
    interface GSI {
        _F_toggles_initialize: Function;
        u: Function;
        ia: Function;
        na: Function;
        qa: object;
        ra: number[];
        sa: Function;
        xa: Function;
        w: Function;
        ya: Function;
        za: Function;
        Aa: Function;
        Ba: Function;
        Ca: Function;
        Da: Function;
        Ea: Function;
        Ga: Function;
        Fa: Function;
        Ha: Function;
        Ia: Function;
        Ja: Function;
        Ka: Function;
        La: Function;
        Na: Function;
        Oa: Function;
        Ra: Function;
        Sa: Function;
        x: Function;
        y: Function;
        Ua: Function;
        '$a': Function;
        bb: Function;
        cb: Function;
        gb: Function;
        A: Function;
        hb: Function;
        ib: Function;
        wa: Function;
        ta: boolean;
        qb: boolean;
        rb: boolean;
        sb: boolean;
        ua: Ua;
        Ma: Function;
        ub: Function;
        vb: Function;
        wb: Function;
        yb: boolean;
        zb: boolean;
        Ab: boolean;
        Bb: boolean;
        Cb: boolean;
        Ib: string;
        Qa: string;
        Ta: Function;
        Za: Za;
        Jb: object;
        Kb: Function;
        Lb: Function;
        Nb: Function;
        Ob: Function;
        Pb: Function;
        Qb: Function;
        Rb: Function;
        Vb: string;
        Wb: Function;
        Zb: Function;
        '$b': Function;
        bc: Function;
        B: Function;
        fc: Function;
        mc: Function;
        ic: Function;
        gc: Function;
        oc: Oc;
        qc: Function;
        rc: Function;
        sc: Function;
        tc: Function;
        Fc: Function;
        wc: Function;
        l: L;
        Kc: Function;
        C: Function;
        Lc: boolean;
        Mc: boolean;
        Nc: boolean;
        Oc: boolean;
        Pc: boolean;
        Qc: boolean;
        Rc: Function;
        Sc: Function;
        bd: Function;
        dd: Function;
        ed: Function;
        qd: Function;
        rd: Function;
        td: Function;
        vd: Function;
        yd: Function;
        G: Function;
        Ad: Function;
        Gd: Function;
        Id: Function;
        Kd: Function;
        Nd: Function;
        Pd: Function;
        Rd: Function;
        Ud: Function;
        Xd: Function;
        ae: Function;
        be: Function;
        ce: Function;
        J: Function;
        cd: Function;
        de: boolean;
        ee: boolean;
        fe: boolean;
        Uc: Function;
        ke: object;
        zd: Function;
        Od: Function;
        me: boolean;
        Hd: Function;
        qe: Function;
        md: Function;
        H: Function;
        gd: Function;
        re: any[];
        te: object;
        ue: object;
        ve: boolean;
        K: Function;
        Ld: Function;
        we: Function;
        L: Function;
        F: Function;
        E: Function;
        M: Function;
        I: Function;
        Sd: Function;
        Ae: Ae;
        Be: Ae;
        N: Function;
        Ce: Function;
        De: Function;
        Ee: Function;
        Ge: Function;
        He: Function;
        Ie: Function;
        O: Function;
        P: Function;
        Je: Function;
        Ke: Function;
        Le: Function;
        Me: Function;
        Di: Function;
        Ei: Function;
        Fi: Function;
        Gi: Function;
        Hi: Function;
        Ii: Function;
        Ji: Function;
        Ki: Function;
        Li: Ae;
        Oi: (null | number)[];
        Pi: Function;
        Qi: ((null | number)[] | Ae | null | number)[];
        Si: Function;
        Yi: Function;
        Zi: Function;
        ij: Function;
        jj: Function;
        lj: Function;
        mj: Function;
        U: Function;
        V: Function;
        Ri: Ri;
        nj: object;
        oj: object;
        pj: object;
        sj: Function;
        X: Function;
        W: Function;
        Y: Function;
        Dj: Function;
        tj: Function;
        Cj: Function;
        Bj: Oc;
        yj: Function;
        zj: Function;
        Hj: number;
        Ij: Oc;
        Jj: Oc;
        Kj: Function;
        Lj: Function;
        Pj: Function;
        Zj: Function;
        Q: Function;
        Re: Function;
        Ue: Function;
        Qe: Function;
        Ve: Function;
        We: Function;
        Ye: Function;
        Pe: Function;
        rf: Function;
        sf: Function;
        yf: Function;
        Hf: Function;
        R: Function;
        Jf: Function;
        Kf: Function;
        Lf: Function;
        Mf: Function;
        Of: Of;
        yk: Function;
        zk: Function;
        Ak: Function;
        Dk: Function;
        Fk: Function;
        Ek: Function;
        Bk: Function;
        Ck: Function;
        Ik: Ik;
        en: Function;
        fn: Function;
        Hn: Function;
        Jn: Function;
        Po: Function;
        Qo: Function;
        Ro: (null | number)[];
        cp: Function;
        dp: Function;
        ep: Function;
        gp: Function;
        ip: string;
        jp: Function;
        kp: Function;
        mp: Function;
        tp: Function;
        Bp: Function;
        Cp: Function;
        Dp: Function;
    }
    interface Ik {
        test_list: string[];
        cross_origin_iframe_rps: string[];
        csp_rps: string[];
    }
    interface Of {
        g: G3;
    }
    interface G3 {
        location: Location;
        closure_lm_9194: Closurelm9194;
    }
    interface Closurelm9194 {
        g: G2;
        h: number;
    }
    interface G2 {
        DOMContentLoaded: DOMContentLoaded[];
    }
    interface DOMContentLoaded {
        listener: Function;
        proxy: Function;
        type: string;
        capture: boolean;
        key: number;
        mb: boolean;
        Ya: boolean;
    }
    interface Location {
        ancestorOrigins: Oc;
        href: string;
        origin: string;
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        hash: string;
        assign: Function;
        reload: Function;
        replace: Function;
        toString: Function;
    }
    interface Ri {
        g: G;
    }
    interface G {
        cancelable_auto_select: boolean;
        enable_fedcm_beta_launch: boolean;
        enable_fedcm_auto_reauthn: boolean;
        enable_fedcm_csp_and_iframe_logs: boolean;
        enable_intermediate_iframe: boolean;
        enable_manual_fedcm_launch: boolean;
    }
    interface Ae {
        g: Function;
        h: Function;
        i: boolean;
        Sc: boolean;
    }
    interface L {
        constructor: Function;
        set: Function;
        get: Function;
        remove: Function;
        Ha: Function;
        clear: Function;
        key: Function;
    }
    interface Oc {
    }
    interface Za {
        g: string;
    }
    interface Ua {
        brands: Brand[];
        mobile: boolean;
        platform: string;
    }
    interface Brand {
        brand: string;
        version: string;
    }
    interface Google {
        accounts: Accounts;
        maps: any;
    }
    interface Accounts {
        id: Id;
        oauth2: Oauth2;
    }
    interface Oauth2 {
        GoogleIdentityServicesError: Function;
        GoogleIdentityServicesErrorType: GoogleIdentityServicesErrorType;
        initCodeClient: Function;
        CodeClient: Function;
        initTokenClient: Function;
        TokenClient: Function;
        hasGrantedAllScopes: Function;
        hasGrantedAnyScope: Function;
        revoke: Function;
    }
    interface GoogleIdentityServicesErrorType {
        ye: string;
        re: string;
        ue: string;
        te: string;
    }
    interface Id {
        intermediate: Intermediate;
        cancel: Function;
        disableAutoSelect: Function;
        initialize: Function;
        prompt: Function;
        PromptMomentNotification: Function;
        renderButton: Function;
        revoke: Function;
        storeCredential: Function;
        setLogLevel: Function;
    }
    interface Intermediate {
        verifyParentOrigin: Function;
        notifyParentResize: Function;
        notifyParentClose: Function;
        notifyParentDone: Function;
        notifyParentTapOutsideMode: Function;
    }
}
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
/** The pages name using the {@link location} global. */
declare var pagename: string;
/**
 * The data layer for Google Tag Manager. See {@link gtag}/{@link analyticsPush} for modification, and {@link https://developers.google.com/tag-manager/devguide} for purpose.
 */
declare var dataLayer: any[];
/**
 * gtag is a global function that is used to send data to Google Analytics. See {@link https://developers.google.com/analytics/devguides/collection/gtagjs} for more information on how this data is used.
 * @param args The arguments to pass to the dataLayer. Same as {@link dataLayer.push}.
 */
declare function gtag(...args: any[]): void;
/** If cookie consent is still needed for the specific browser user. */
declare var bConsentNeeded: boolean;
/** A callback function for when the user grants their consent with their cookie banner */
declare function setCookies(): void;
/** Resets the document.cookie object for this domain. */
declare function resetCookieConsent(): void;
/** The dojoConfig object sets options and default behavior for various aspects of the dojo toolkit. This is the same object as {@link DojoJS.config}, but loaded before. */
declare var dojoConfig: DojoJS._base.Config;
/**
 * The configuration object for bga
 */
declare var bgaConfig: {
    webrtcEnabled: boolean;
    facebookAppId: string;
    googleAppId: string;
    requestToken: string;
    genderRegexps: {
        [local: string]: {
            'forMasculine': Record<string, string>;
            'forFeminine': Record<string, string>;
            'forNeutral'?: Record<string, string>;
        };
    };
};
declare var webrtcConfig: {
    pcConfig: RTCConfiguration;
    pcConstraints: object;
    audioSendCodec: string;
    audioReceiveCodec: string;
    iceTricklingEnabled: boolean;
};
/** If true, the browser has at least one extension that is incompatible with the BGA site. */
declare var bAtLeastOneIncompatibility: boolean;
/** A helper object used to build html string for several uses within the script tags on the html page. */
declare var html: string;
declare var testArray: string[];
declare var testObject: {};
/** Defined by the Socket.IO library. */
declare var io: socket.IO.SocketIO;
declare namespace socket.IO {
    interface SocketIO {
        (uri: string, options: any): Socket;
        connect(uri: string, options: any): Socket;
        io: SocketIO;
        Socket: SocketConstructor;
        Manager: {
            new (...args: any[]): any;
        };
    }
    /** Defined by the Socket.IO library. */
    interface SocketConstructor {
        new: (...args: any[]) => Socket;
    }
    /** Defined by the Socket.IO library. */
    interface Socket {
        io: Socket;
        on(event: string, callback: (...args: any[]) => void): void;
        off(event: string, callback: (...args: any[]) => void): void;
        emit(event: string, ...args: any[]): void;
        close(): void;
    }
}
declare var globalUserInfos: any;
declare namespace DojoJS {
    interface Handle {
        remove(): void;
    }
    interface Require {
        (config: Record<string, any>, dependencies?: string | string[], callback?: (...args: any[]) => void): Require;
        (dependencies: string | string[], callback: (...args: any[]) => void): Require;
        async: number | boolean;
        has: DojoJS.Has;
        isXdurl(url: string): boolean;
        initSyncLoader(dojoRequirePlugin: any, checkDojoRequirePlugin: any, transformToAmd: any): Record<string, any>;
        getXhr(): XMLHttpRequest | /* ActiveXObject */ any;
        getText(url: string, async?: boolean, onLoad?: (responseText: string, async?: boolean) => void): string;
        eval(text: string, hint?: string): any;
        signal(type: string, args: any[]): void;
        on(type: string, listener: (...args: any[]) => void): Handle;
        map: {
            [id: string]: any;
        };
        waitms?: number;
        legacyMode: boolean;
        rawConfig: DojoJS._base.Config;
        baseUrl: string;
        combo?: {
            add: () => void;
            done(callback: (mids: string[], url?: string) => void, req: Require): void;
            plugins?: Record<string, any>;
        };
        idle(): boolean;
        toAbsMid(mid: string, referenceModule?: string): string;
        toUrl(name: string, referenceModule?: string): string;
        undef(moduleId: string, referenceModule?: string): void;
        pageLoaded: number | boolean;
        injectUrl(url: string, callback?: () => void, owner?: HTMLScriptElement): HTMLScriptElement;
        log(...args: any[]): void;
        trace: {
            (group: string, args: any[]): void;
            on: boolean | number;
            group: Record<string, any>;
            set(group: string | Record<string, any>, value: any): void;
        };
        boot?: [string[], Function] | number;
    }
    interface Define {
        (mid: string, dependencies?: string[], factory?: any): void;
        (dependencies: string[], factory?: any): void;
        amd: string;
    }
    interface Dojo {
    }
    interface Dojox {
    }
    interface Dijit {
    }
}
declare var require: DojoJS.Require;
declare var define: DojoJS.Define;
declare var dojo: DojoJS.Dojo;
declare var dijit: DojoJS.Dijit;
declare var dojox: DojoJS.Dojox;
declare module "require" {
    export = require;
}
declare module "module" {
    var module: any;
    export = module;
}
declare module "exports" {
    var exports: any;
    export = exports;
}
declare module "dojo" {
    export = dojo;
}
declare module "dijit" {
    export = dijit;
}
declare module "dojox" {
    export = dojox;
}
declare module "dojo/global" {
    var global_result: Window & typeof globalThis;
    export = global_result;
    global {
        namespace DojoJS {
            type Global = typeof global_result;
        }
        /**
         * The global object used for dojo. If undefined, dojo will use try to use 'window', then 'self', then the global 'this'.
         */
        var global: (Window & typeof globalThis) | undefined | Function;
    }
}
declare module "dojo/has" {
    global {
        namespace DojoJS {
            interface Has {
                /**
                 * Return the current value of the named feature.
                 * @param {string | number} name The name (if a string) or identifier (if an integer) of the feature to test.
                 */
                (name: string | number): any;
                (name: 'host-browser'): boolean;
                (name: 'host-node'): any;
                (name: 'host-rhino'): boolean;
                (name: 'dom'): boolean;
                (name: 'dojo-dom-ready-api'): 1;
                (name: 'dojo-sniff'): 1;
                (name: 'dom-addeventlistener'): void | boolean;
                (name: 'touch'): void | boolean;
                (name: 'touch-events'): void | boolean;
                (name: 'pointer-events'): void | boolean;
                (name: 'MSPointer'): void | boolean;
                (name: 'device-width'): void | number;
                (name: 'dom-attributes-explicit'): void | boolean;
                (name: 'dom-attributes-specified-flag'): void | boolean;
                (name: 'config-selectorEngine'): string;
                cache: Record<string, any>;
                /**
                 * Register a new feature test for some named feature.
                 */
                add(name: string | number, test: (global: Window & typeof globalThis, doc?: Document, element?: Element) => any, now?: boolean, force?: boolean): any;
                add<T extends (Object | string | number | boolean | null | void)>(name: string | number, test: T, now?: boolean, force?: boolean): any;
                /**
                 * Deletes the contents of the element passed to test functions.
                 */
                clearElement(element: HTMLElement): HTMLElement;
                /**
                 * Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
                 */
                normalize(id: string, toAbsMid: Function): string;
                /**
                 * Conditional loading of AMD modules based on a has feature test value.
                 */
                load(id: string, parentRequire: Function, loaded: Function): void;
            }
        }
    }
    var r: DojoJS.Has;
    export = r;
}
declare module "dojo/_base/config" {
    global {
        namespace DojoJS._base {
            interface Config {
                /** Defaults to `false`. If set to `true`, ensures that Dojo provides
                 * extended debugging feedback via Firebug. If Firebug is not available
                 * on your platform, setting `isDebug` to `true` will force Dojo to
                 * pull in (and display) the version of Firebug Lite which is
                 * integrated into the Dojo distribution, thereby always providing a
                 * debugging/logging console when `isDebug` is enabled. Note that
                 * Firebug's `console.*` methods are ALWAYS defined by Dojo. If
                 * `isDebug` is false and you are on a platform without Firebug, these
                 * methods will be defined as no-ops.
                 */
                isDebug: boolean;
                /**
                 * The locale to assume for loading localized resources in this page,
                 * specified according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt).
                 * Must be specified entirely in lowercase, e.g. `en-us` and `zh-cn`.
                 * See the documentation for `dojo.i18n` and `dojo.requireLocalization`
                 * for details on loading localized resources. If no locale is specified,
                 * Dojo assumes the locale of the user agent, according to `navigator.userLanguage`
                 * or `navigator.language` properties.
                 */
                locale: string;
                /**
                 * No default value. Specifies additional locales whose
                 * resources should also be loaded alongside the default locale when
                 * calls to `dojo.requireLocalization()` are processed.
                 */
                extraLocale: string[];
                /**
                 * The directory in which `dojo.js` is located. Under normal
                 * conditions, Dojo auto-detects the correct location from which it
                 * was loaded. You may need to manually configure `baseUrl` in cases
                 * where you have renamed `dojo.js` or in which `<base>` tags confuse
                 * some browsers (e.g. IE 6). The variable `dojo.baseUrl` is assigned
                 * either the value of `djConfig.baseUrl` if one is provided or the
                 * auto-detected root if not. Other modules are located relative to
                 * this path. The path should end in a slash.
                 */
                baseUrl: string;
                /**
                 * A map of module names to paths relative to `dojo.baseUrl`. The
                 * key/value pairs correspond directly to the arguments which
                 * `dojo.registerModulePath` accepts. Specifying
                 * `djConfig.modulePaths = { "foo": "../../bar" }` is the equivalent
                 * of calling `dojo.registerModulePath("foo", "../../bar");`. Multiple
                 * modules may be configured via `djConfig.modulePaths`.
                 */
                modulePaths: {
                    [mid: string]: string;
                };
                /**
                 * Adds a callback via dojo/ready. Useful when Dojo is added after
                 * the page loads and djConfig.afterOnLoad is true. Supports the same
                 * arguments as dojo/ready. When using a function reference, use
                 * `djConfig.addOnLoad = function(){};`. For object with function name use
                 * `djConfig.addOnLoad = [myObject, "functionName"];` and for object with
                 * function reference use
                 * `djConfig.addOnLoad = [myObject, function(){}];`
                 */
                addOnLoad: () => void | [any, string];
                /**
                 * Run the parser after the page is loaded
                 */
                parseOnLoad: boolean;
                /**
                 * An array of module names to be loaded immediately after dojo.js has been included
                 * in a page.
                 */
                require: string[];
                /**
                 * Default duration, in milliseconds, for wipe and fade animations within dijits.
                 * Assigned to dijit.defaultDuration.
                 */
                defaultDuration: number;
                /**
                 * Used by some modules to configure an empty iframe. Used by dojo/io/iframe and
                 * dojo/back, and dijit/popup support in IE where an iframe is needed to make sure native
                 * controls do not bleed through the popups. Normally this configuration variable
                 * does not need to be set, except when using cross-domain/CDN Dojo builds.
                 * Save dojo/resources/blank.html to your domain and set `djConfig.dojoBlankHtmlUrl`
                 * to the path on your domain your copy of blank.html.
                 */
                dojoBlankHtmlUrl: string;
                /**
                 * Set this to true to enable publishing of topics for the different phases of
                 * IO operations. Publishing is done via dojo/topic.publish(). See dojo/main.__IoPublish for a list
                 * of topics that are published.
                 */
                ioPublish: boolean;
                /**
                 * If set to a value that evaluates to true such as a string or array and
                 * isDebug is true and Firebug is not available or running, then it bypasses
                 * the creation of Firebug Lite allowing you to define your own console object.
                 */
                useCustomLogger: any;
                /**
                 * Array containing the r, g, b components used as transparent color in dojo.Color;
                 * if undefined, ColorValue (white) will be used.
                 */
                transparentColor: [number, number, number] | [number, number, number, number];
                /**
                 * Defines dependencies to be used before the loader has been loaded.
                 * When provided, they cause the loader to execute require(deps, callback)
                 * once it has finished loading. Should be used with callback.
                 */
                deps: () => string[] | string[];
                /**
                 * Defines the cached has API variables
                 */
                hasCache: Record<string, any>;
                /**
                 * Defines a callback to be used when dependencies are defined before
                 * the loader has been loaded. When provided, they cause the loader to
                 * execute require(deps, callback) once it has finished loading.
                 */
                callback: (...args: any[]) => void;
                /**
                 * Whether deferred instrumentation should be loaded or included
                 * in builds.
                 */
                deferredInstrumentation: boolean;
                /**
                 * Whether the deferred instrumentation should be used.
                 *
                 *   * `"report-rejections"`: report each rejection as it occurs.
                 *   * `true` or `1` or `"report-unhandled-rejections"`: wait 1 second
                 *     in an attempt to detect unhandled rejections.
                 */
                useDeferredInstrumentation: string | boolean | number;
                afterOnLoad: boolean;
            }
        }
    }
    const _default: DojoJS._base.Config;
    export = _default;
}
declare module "dojo/_base/kernel" {
    global {
        namespace DojoJS {
            interface Dojo {
                config: typeof import("dojo/_base/config");
                global: typeof import("dojo/global");
                dijit: DojoJS.Dijit;
                dojox: DojoxJS.DojoX;
                /**
                 * a map from a name used in a legacy module to the (global variable name, object addressed by that name)
                 * always map dojo, dijit, and dojox
                 */
                scopeMap: {
                    [scope: string]: [string, any];
                    dojo: [string, Dojo];
                    dijit: [string, DojoJS.Dijit];
                    dojox: [string, DojoxJS.DojoX];
                };
                baseUrl: string;
                isAsync: boolean;
                locale: string;
                version: {
                    major: number;
                    minor: number;
                    patch: number;
                    flag: string;
                    revision: number;
                    toString(): string;
                };
                /**
                 * A legacy method created for use exclusively by internal Dojo methods. Do not use this method
                 * directly unless you understand its possibly-different implications on the platforms your are targeting.
                 */
                eval(scriptText: string): any;
                exit(exitcode?: number): void;
                /**
                 * Log a debug message to indicate that a behavior has been
                 * deprecated.
                 */
                deprecated(behaviour: string, extra?: string, removal?: string): void;
                /**
                 * Marks code as experimental.
                 */
                experimental(moduleName: string, extra?: string): void;
                /**
                 * Returns a URL relative to a module.
                 */
                moduleUrl(module: string, url?: string): any;
                /**
                 * for backward compatibility with layers built with 1.6 tooling
                 */
                _hasResource: any;
                _scopeName: "dojo";
            }
        }
        namespace DijitJS {
            interface Dijit {
            }
        }
        namespace DojoxJS {
            interface DojoX {
            }
        }
    }
    const _default_1: DojoJS.Dojo;
    export = _default_1;
}
declare module "dojo/sniff" {
    global {
        namespace DojoJS {
            interface Has {
                (name: 'air'): boolean;
                (name: 'wp'): undefined | number;
                (name: 'msapp'): undefined | number;
                (name: 'khtml'): undefined | number;
                (name: 'edge'): undefined | number;
                (name: 'opr'): undefined | number;
                (name: 'webkit'): undefined | number;
                (name: 'chrome'): undefined | number;
                (name: 'android'): undefined | number;
                (name: 'safari'): undefined | number;
                (name: 'mac'): boolean;
                (name: 'quirks'): boolean;
                (name: 'iphone'): undefined | number;
                (name: 'ipod'): undefined | number;
                (name: 'ipad'): undefined | number;
                (name: 'ios'): undefined | number;
                (name: 'bb'): undefined | number | boolean;
                (name: 'trident'): undefined | number;
                (name: 'svg'): boolean;
                (name: 'opera'): undefined | number;
                (name: 'mozilla'): undefined | number;
                (name: 'ff'): undefined | number;
                (name: 'ie'): undefined | number;
                (name: 'wii'): boolean | any;
            }
        }
    }
    import has = require("dojo/has");
    export = has;
}
declare module "dojo/_base/lang" {
    import dojo = require("dojo/_base/kernel");
    import "dojo/sniff";
    class Lang {
        /**
         * Lists property names that must be explicitly processed during for-in iteration
         * in environments that have has("bug-for-in-skips-shadowed") true.
         */
        _extraNames: string[];
        /**
         * Copies/adds all properties of one or more sources to dest; returns dest.
         */
        _mixin<T extends Record<string, any>, U extends Record<string, any>>(dest: T, source: U, copyFunc?: (s: any) => any): typeof copyFunc extends Falsy ? T & U : Record<keyof T, any> & U;
        /**
         * Copies/adds all properties of one or more sources to dest; returns dest.
         */
        mixin<T extends Record<string, any>, const U extends Record<string, any>[]>(dest: T | Falsy, ...sources: U): T & AnyOf<U[number]>;
        /**
         * Set a property of a context object from a dot-separated string, such as "A.B.C": context.A.B.C = value.
         * @param name
         * @param value
         * @param context
         * @returns If the value was successfully set, the value is returned. Otherwise, undefined is returned.
         */
        setObject<T>(name: string, value: T, context?: Record<string, any>): T | undefined;
        /**
         * Get a property from a dot-separated string, such as "A.B.C"
         */
        getObject<P extends string | Falsy, C extends Record<string, any>>(name: P, create?: boolean, context?: C): P extends Falsy ? C : any;
        /**
         * determine if an object supports a given method
         */
        exists(name: string, obj?: Record<string, any>): boolean;
        /**
         * Return true if it is a String
         */
        isString(it: any): it is string;
        /**
         * Return true if it is an Array.
         */
        isArray(it: any): it is any[];
        /**
         * Return true if it is a Function
         */
        isFunction(it: any): it is Function;
        /**
         * Returns true if it is a JavaScript object (or an Array, a Function
         * or null)
         */
        isObject(it: any): it is (null | object | any[] | Function);
        /**
         * similar to isArray() but more permissive
         */
        isArrayLike(it: any): boolean;
        /**
         * Returns true if it is a built-in function or some other kind of
         * oddball that *should* report as a function but doesn't
         */
        isAlien(it: any): boolean;
        /**
         * Adds all properties and methods of props to constructor's
         * prototype, making them available to all instances created with
         * constructor.
         */
        extend<T extends DojoJS.DojoClass, const U>(ctor: T, ...props: DojoJS.DeclareProps<U, [T]>[]): DojoJS._DeclareSubclass<T, U>;
        _hitchArgs<S, M extends string, Args extends any[]>(...[scope, method, ...args]: [...DojoJS.HitchedPair<S, M, Args>, ...Args]): DojoJS.HitchResult<S, M, Args>;
        /**
         * Returns a function that will only ever execute in the given scope.
         * This allows for easy use of object member functions
         * in callbacks and other places in which the "this" keyword may
         * otherwise not reference the expected scope.
         * Any number of default positional arguments may be passed as parameters
         * beyond "method".
         * Each of these values will be used to "placehold" (similar to curry)
         * for the hitched function.
         */
        /**
         * Returns a function that will only ever execute in the given scope ('this' is always the scope).
         * @param scope The 'this' context which should be used when method executes.
         * @param method The property name which is a function that should be executed in scope.
         * @returns The 'method' property on 'scope', bound to 'scope'.
        */
        hitch<M extends keyof DojoJS.Global, Args extends any[]>(method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never, buffer?: any, // scope will be null, but this is not used for hitching the first x params.
        ...args: Args): DojoJS.HitchResult<null, M, Args>;
        hitch<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[]>(method: M, buffer?: any, // scope will be null, but this is not used for hitching the first x params.
        ...args: Args): DojoJS.HitchResult<null, M, Args>;
        hitch<S, M extends keyof any, Args extends any[]>(...[scope, method, ...args]: [...DojoJS.HitchedPair<S, M, Args>, ...Args]): DojoJS.HitchResult<S, M, Args>;
        hitch<S, const M extends DojoJS.BoundFunc<S, Args>, Args extends any[]>(scope: S, method: M, ...args: Args): DojoJS.HitchResult<S, M, Args>;
        /**
         * Returns a new object which "looks" to obj for properties which it
         * does not have a value for. Optionally takes a bag of properties to
         * seed the returned object with initially.
         */
        delegate<T, U>(obj: T, props?: U): T & U;
        /**
         * Converts an array-like object (i.e. arguments, DOMCollection) to an
         * array. Returns a new Array with the elements of obj.
         */
        _toArray(obj: any, offset?: number, startWith?: any[]): any[];
        /**
         * similar to hitch() except that the scope object is left to be
         * whatever the execution context eventually becomes.
         */
        partial<U extends Function>(method: Function | string, ...args: any[]): U;
        /**
         * Clones objects (including DOM nodes) and all children.
         * Warning: do not clone cyclic structures.
         */
        clone<T>(src: T): T;
        /**
         * Trims whitespace from both sides of the string
         */
        trim(str: string): string;
        /**
         * Performs parameterized substitutions on a string. Throws an
         * exception if any parameter is unmatched.
         */
        replace(tmpl: string, map: Record<string, any> | ((match: string, name: string, offset: number, tmpl: string) => string), pattern?: RegExp): string;
    }
    global {
        namespace DojoJS {
            interface Dojo extends Lang {
            }
            type HitchMethod<Scope, Args extends any[] = any[], Rtn extends any = any> = BoundFunc<Scope, Args, Rtn> | (Scope extends DojoJS.WithFunc<Scope, infer X, Args> ? X : never) | KeysWithType<Scope, BoundFunc<Scope, Args, Rtn>>;
            type Hitched<T, U, P extends any[] = []> = U extends BoundFunc<T, infer Args, infer R> ? ((...args: Skip<Args, Length<P>>) => R) : U extends keyof FalsyAsGlobal<T> ? (FalsyAsGlobal<T>[U] extends BoundFunc<T, infer Args, infer R> ? ((...args: Skip<Args, Length<P>>) => R) : never) : never;
            type FalsyAsGlobal<T> = T extends Falsy ? DojoJS.Global : T;
            /**
             * A function that is bound to a given scope.
             * @template Scope The scope to bind to. This is the 'this' context that the function will execute in. If null, the global scope is used.
             * @template Args The required first arguments for the function. The function can have any number of additional arguments (optional or not).
             * @template R The return type of the function.
             */
            type BoundFunc<Scope, Args extends any[] = [], R extends any = any> = (this: FalsyAsGlobal<Scope>, ...args: [...Args, ...any[]]) => R;
            type WithFunc<S, M extends keyof any, Args extends any[]> = {
                [k in M]: BoundFunc<S, Args> | null;
            };
            type HitchedPair<S, M extends keyof any, Args extends any[]> = [
                /** When the second parameter is a string, the first param must be a object with the matching func, OR... */
                scope: DojoJS.WithFunc<S, M, Args> | 
                /** the first param must be null and the matching func exists on the global this. */
                (typeof import("dojo/global") extends DojoJS.WithFunc<null, M, Args> ? null : never),
                method: M
            ] | [
                scope: S,
                method: KeysWithType<S, DojoJS.BoundFunc<S, Args>>
            ];
            type GlobalHitchedFunc<M, Args extends any[]> = M extends BoundFunc<null, Args> ? M : M extends string ? (typeof import("dojo/global") extends WithFunc<null, M, Args> ? M : never) : never;
            type HitchResult<Scope, Method, Args extends any[] = []> = Method extends BoundFunc<Scope, Args, infer R> ? ((...args: Skip<Parameters<Method>, Length<Args>>) => R) : Method extends string ? (FalsyAsGlobal<Scope> extends {
                [k in Method]: (infer F extends BoundFunc<Scope, Args>) | null;
            } ? ((...args: Skip<Parameters<F>, Length<Args>>) => ReturnType<F>) : never) : never;
        }
    }
    export = dojo;
}
declare module "dojo/_base/array" {
    import dojo = require("dojo/_base/kernel");
    /**
     * This contains functions similar to Array.prototype, but also caches the functions for performance. Modern code should not be used over standard Array.prototype functions.
     */
    class DojoArray {
        private static cache;
        private static pushCache;
        /**
         * Determines whether or not every item in arr satisfies the condition implemented by callback.
         * @param {T[] | string} arr the array to iterate on. If a string, operates on individual characters.
         * @param {Function | string} callback a  function is invoked with three arguments: item, index, and
         *                                     array and returns true if the condition is met.
         * @param {object} thisObj may be used to scope the call to callback
         */
        every<T, U extends ((item: T, idx: number, arr: T[]) => boolean) | string, V extends (U extends keyof V ? {
            [k in U]: ((item: T, idx: number, arr: T[]) => boolean);
        } : never)>(arr: T[] | string, callback: U, thisObj?: V): boolean;
        /**
         * Determines whether or not any item in arr satisfies the condition implemented by callback.
         */
        some<T, U extends ((item: T, idx: number, arr: T[]) => boolean) | string, V extends (U extends keyof V ? {
            [k in U]: ((item: T, idx: number, arr: T[]) => boolean);
        } : never)>(arr: T[] | string, callback: U, thisObj?: V): boolean;
        /**
         * locates the last index of the provided value in the passed array. If the value is not found, -1
         * is returned.
         * @param {boolean} findLast Makes indexOf() work like lastIndexOf().  Used internally; not meant
         *                           for external usage.
         */
        indexOf<T>(arr: T[] | string, value: T, fromIndex?: number, findLast?: boolean): number;
        /**
         * locates the first index of the provided value in the passed array. If the value is not found,
         * -1 is returned.
         */
        lastIndexOf<T>(arr: T[] | string, value: T, fromIndex?: number): number;
        /**
         * locates the last index of the provided value in the passed array. If the value is not found,
         * -1 is returned.
         */
        forEach<T>(arr: ArrayLike<T>, callback: string | ((item: T, idx: number, arr: ArrayLike<T>) => void), thisObj?: Object): void;
        /**
         * for every item in arr, callback is invoked. Return values are ignored. If you want to break
         * out of the loop, consider using array.every() or array.some().
         */
        map<T, U>(arr: T[] | string, callback: string | ((item: T, idx: number, arr: T[]) => U), thisObj?: Object, Ctr?: Constructor<U[]>): U[];
        /**
         * Returns a new Array with those items from arr that match the condition implemented by
         * callback.
         */
        filter<T>(arr: T[] | string, callback: string | ((item: T, idx: number, arr: T[]) => boolean), thisObj?: Object): T[];
        clearCache(): void;
    }
    global {
        namespace DojoJS {
            interface Dojo extends DojoArray {
            }
        }
    }
    /**
     * Adds the array API to the base dojo object.
     */
    export = dojo;
}
declare module "dojo/domReady" {
    interface DomReady {
        /**
         * Plugin to delay require()/define() callback from firing until the DOM has finished
         */
        (callback: (doc: Document) => any): void;
        load(id: string, parentRequire: Function, loaded: Function): void;
        _Q: Function[];
        _onEmpty(): void;
        _onQEmpty(): void;
    }
    var domReady: DomReady;
    export = domReady;
}
declare module "dojo/ready" {
    /**
     * Add a function to execute on DOM content loaded and all requested modules have arrived and been evaluated.
     * In most cases, the `domReady` plug-in should suffice and this method should not be needed.
     *
     * When called in a non-browser environment, just checks that all requested modules have arrived and been
     * evaluated.
     */
    function ready(callback: Function): any;
    function ready(context: Object, callback: Function | string): void;
    function ready(priority: number, callback: Function): void;
    function ready(priority: number, context: Object, callback: Function | string): void;
    global {
        namespace DojoJS {
            interface Dojo {
                ready: typeof ready;
                addOnLoad: typeof ready;
                _postLoad: boolean;
            }
        }
    }
    export = ready;
}
declare module "dojo/_base/declare" {
    var declare: DojoJS.Declare;
    global {
        namespace DojoJS {
            type InheritedMethod<T> = HitchMethod<Omit<T, 'inherited' | 'getInherited' | '__inherited'>>;
            /**
             * dojo/_base/declare() returns a constructor `C`.   `new C()` returns an Object with the following
             * methods, in addition to the methods and properties specified via the arguments passed to declare().
             */
            interface DojoClassObject {
                declaredClass: string;
                /**
                 * Calls a super method.
                 *
                 * This method is used inside method of classes produced with
                 * declare() to call a super method (next in the chain). It is
                 * used for manually controlled chaining. Consider using the regular
                 * chaining, because it is faster. Use "this.inherited()" only in
                 * complex cases.
                 *
                 * This method cannot me called from automatically chained
                 * constructors including the case of a special (legacy)
                 * constructor chaining. It cannot be called from chained methods.
                 *
                 * If "this.inherited()" cannot find the next-in-chain method, it
                 * does nothing and returns "undefined". The last method in chain
                 * can be a default method implemented in Object, which will be
                 * called last.
                 *
                 * If "name" is specified, it is assumed that the method that
                 * received "args" is the parent method for this call. It is looked
                 * up in the chain list and if it is found the next-in-chain method
                 * is called. If it is not found, the first-in-chain method is
                 * called.
                 *
                 * If "name" is not specified, it will be derived from the calling
                 * method (using a methoid property "nom").
                 */
                inherited<U>(args: IArguments): U;
                inherited<U>(args: IArguments, newArgs: any[]): U;
                inherited(args: IArguments, get: true): Function | void;
                inherited<T extends InheritedMethod<this>>(method: T, args: IArguments, newArgs?: Parameters<Hitched<this, T>>): ReturnType<Hitched<this, T>>;
                inherited<T extends InheritedMethod<this>>(method: T, args: IArguments, get: true): Hitched<this, T>;
                /** Same as {@link inherited}, but always does not have debugging */
                __inherited: this['inherited'];
                /**
                 * Returns a super method.
                 *
                 * This method is a convenience method for "this.inherited()".
                 * It uses the same algorithm but instead of executing a super
                 * method, it returns it, or "undefined" if not found.
                 */
                getInherited(args: IArguments): Function | void;
                getInherited<T extends InheritedMethod<this>>(method: T, args: IArguments): Hitched<this, T>;
                /**
                 * Checks the inheritance chain to see if it is inherited from this class.
                 *
                 * This method is used with instances of classes produced with
                 * declare() to determine of they support a certain interface or
                 * not. It models "instanceof" operator.
                 */
                isInstanceOf(cls: any): boolean;
            }
            interface DojoClass<T = any, Args extends any[] = any[]> {
                new (...args: Args): T & DojoClassObject;
                prototype: T;
                /**
                 * Adds all properties and methods of source to constructor's
                 * prototype, making them available to all instances created with
                 * constructor. This method is specific to constructors created with
                 * declare().
                 *
                 * Adds source properties to the constructor's prototype. It can
                 * override existing properties.
                 *
                 * This method is similar to dojo.extend function, but it is specific
                 * to constructors produced by declare(). It is implemented
                 * using dojo.safeMixin, and it skips a constructor property,
                 * and properly decorates copied functions.
                 */
                extend<U>(source: U): DojoClass<T & U>;
                /**
                 * Create a subclass of the declared class from a list of base classes.
                 *
                 * Create a constructor using a compact notation for inheritance and
                 * prototype extension.
                 *
                 * Mixin ancestors provide a type of multiple inheritance.
                 * Prototypes of mixin ancestors are copied to the new class:
                 * changes to mixin prototypes will not affect classes to which
                 * they have been mixed in.
                 */
                createSubclass<U, V, X>(mixins: [DojoClass<U>, DojoClass<V>], props: X & ThisType<T & U & V & X>): DojoClass<T & U & V & X>;
                createSubclass<U, V>(mixins: [DojoClass<U>], props: V & ThisType<T & U & V>): DojoClass<T & U & V>;
                createSubclass<U, V>(mixins: DojoClass<U>, props: V & ThisType<T & U & V>): DojoClass<T & U & V>;
                createSubclass<U>(mixins: [DojoClass<U>]): DojoClass<T & U>;
                createSubclass<U>(mixins: DojoClass<U>): DojoClass<T & U>;
                createSubclass<U>(mixins: any, props: U & ThisType<T & U>): DojoClass<T & U>;
                _meta: {
                    bases: Constructor<any>[];
                    hidden: object;
                    chains: Record<string, 'after' | 'before'>;
                    parents: Constructor<any>[];
                    ctor: Constructor<any>;
                };
                superclass: object;
            }
            type PropsCtorArgs<T> = T extends {
                constructor: (...args: infer A) => any;
            } ? A : [];
            type VanillaClass<Proto = any, Args extends any[] = any[]> = {
                new (...args: Args): Proto;
                prototype: Proto;
            };
            type _DeclareSubclass<T, P> = P extends DojoClass<infer PA, infer PB> ? (T extends DojoClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : T extends VanillaClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : never) : P extends VanillaClass<infer PA, infer PB> ? (T extends DojoClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : T extends VanillaClass<infer A, infer B> ? DojoClass<A & PA, UnionTuple<B, PB>> : never) : T extends DojoClass<infer A, infer B> ? DojoClass<A & P, UnionTuple<B, PropsCtorArgs<P>>> : T extends VanillaClass<infer A, infer B> ? DojoClass<A & P, UnionTuple<B, PropsCtorArgs<P>>> : never;
            type DojoClassFrom<T> = T extends [infer A extends (DojoClass | VanillaClass), infer B, ...infer Rest extends any[]] ? DojoClassFrom<[_DeclareSubclass<A, B>, ...Rest]> : T extends [infer A extends DojoClass] ? A : T extends object ? DojoClass<T, PropsCtorArgs<T>> : never;
            type DeclareProps<T, C = null> = C extends any[] ? T & ThisType<InstanceType<DojoClassFrom<[...C, T]>>> : T & ThisType<T & DojoClassObject>;
            /**
             * Create a feature-rich constructor from compact notation.
             */
            interface Declare {
                <P>(superClass: null, props: DeclareProps<P>): DojoClassFrom<P>;
                <P>(setGlobalName: string, superClass: null, props: DeclareProps<P>): DojoClassFrom<P>;
                <T extends DojoClass | VanillaClass>(superClass: T): DojoClassFrom<[T, {}]>;
                <T extends DojoClass | VanillaClass>(setGlobalName: string, superClass: T): DojoClassFrom<[T, {}]>;
                <T extends DojoClass | VanillaClass, P>(superClass: T, props: DeclareProps<P, [T]>): DojoClassFrom<[T, P]>;
                <T extends DojoClass | VanillaClass, P>(setGlobalName: string, superClass: T, props: DeclareProps<P, [T]>): DojoClassFrom<[T, P]>;
                <const T extends (DojoClass | VanillaClass)[]>(superClasses: T): DojoClassFrom<[...T, {}]>;
                <const T extends (DojoClass | VanillaClass)[]>(setGlobalName: string, superClasses: T): DojoClassFrom<[...T, {}]>;
                <const T extends (DojoClass | VanillaClass)[], P>(superClasses: T, props: DeclareProps<P, T>): DojoClassFrom<[...T, P]>;
                <const T extends (DojoClass | VanillaClass)[], P>(setGlobalName: string, superClasses: T, props: DeclareProps<P, T>): DojoClassFrom<[...T, P]>;
                /**
                 * Mix in properties skipping a constructor and decorating functions
                 * like it is done by declare().
                 */
                safeMixin<A, B>(target: A, source: B): A & B;
            }
            interface Dojo {
                declare: Declare;
                safeMixin: Declare['safeMixin'];
            }
        }
    }
    export = declare;
}
declare module "dojo/on" {
    var on: DojoJS.On;
    global {
        namespace DojoJS {
            interface ExtensionEvent {
                (target: Element | Record<string, any>, listener: EventListener): Handle;
            }
            interface PauseHandle extends Handle {
                pause(): void;
                resume(): void;
            }
            interface MatchesTarget {
                matches(node: Element, selector: string, context?: any): any[];
                [id: string]: any;
            }
            interface On {
                /**
                 * A function that provides core event listening functionality. With this function
                 * you can provide a target, event type, and listener to be notified of
                 * future matching events that are fired.
                 */
                (target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): Handle;
                /**
                 * This function acts the same as on(), but with pausable functionality. The
                 * returned signal object has pause() and resume() functions. Calling the
                 * pause() method will cause the listener to not be called for future events.
                 */
                pausable(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): PauseHandle;
                /**
                 * This function acts the same as on(), but will only call the listener once. The
                 * listener will be called for the first
                 * event that takes place and then listener will automatically be removed.
                 */
                once(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix?: boolean): Handle;
                parse(target: Element | Record<string, any>, type: string | ExtensionEvent, listener: EventListener | Function, dontFix: boolean, matchesTarget: Element | Record<string, any>): Handle;
                /**
                 * Check if a node match the current selector within the constraint of a context
                 */
                matches(node: Element, selector: string, context: Element, children: boolean, matchesTarget?: MatchesTarget): Element | boolean;
                /**
                 * Creates a new extension event with event delegation. This is based on
                 * the provided event type (can be extension event) that
                 * only calls the listener when the CSS selector matches the target of the event.
                 *
                 * The application must require() an appropriate level of dojo/query to handle the selector.
                 */
                selector(selector: string, type: string | ExtensionEvent, children?: boolean): ExtensionEvent;
                /**
                 * Fires an event on the target object.
                 */
                emit(target: Element | Record<string, any>, type: string | ExtensionEvent, event?: any): boolean;
                /**
                 * normalizes properties on the event object including event
                 * bubbling methods, keystroke normalization, and x/y positions
                 */
                _fixEvent(evt: any, sender: any): any;
                /**  */
                _preventDefault(): void;
            }
        }
    }
    export = on;
}
declare module "dojo/aspect" {
    global {
        namespace DojoJS {
            interface AfterAdvice<T> {
                (result: T, ...args: any[]): T;
            }
            interface AroundAdvice<T> {
                (origFn: (...args: any[]) => T): (...args: any[]) => T;
            }
            interface BeforeAdvice {
                (...args: any[]): any[] | void;
            }
            interface AspectWrapper {
                (...args: any[]): any;
                target: Record<string, any>;
                nextId: number;
            }
            interface Aspect {
                /**
                 * The "before" export of the aspect module is a function that can be used to attach
                 * "before" advice to a method. This function will be executed before the original attach
                 * is executed. This function will be called with the arguments used to call the mattach
                 * This function may optionally return an array as the new arguments to use tattach
                 * the original method (or the previous, next-to-execute before advice, if one exattach
                 * If the before method doesn't return anything (returns undefined) the original argattach
                 * will be presattach
                 * If there are multiple "before" advisors, they are executed in the reverse order they were registered.
                 */
                before<T extends object & {
                    [K in U]?: AspectWrapper | ((...args: any[]) => any);
                }, U extends string>(target: T, methodName: U, advice: T[U] extends (...a: any[]) => any ? (...args: Parameters<T[U]>) => Parameters<T[U]> | void : <V extends any[]>(...args: V) => V | void): Handle;
                /**
                 * The "around" export of the aspect module is a function that can be used to attach
                 * "around" advice to a method. The advisor function is immediately executeattach
                 * the around() is called, is passed a single argument that is a function that attach
                 * called to continue execution of the original method (or the next around advattach
                 * The advisor function should return a function, and this function will be called whattach
                 * the method is called. It will be called with the arguments used to call the mattach
                 * Whatever this function returns will be returned as the result of the method call (unless after advise changes it).
                 */
                around<T extends object & {
                    [K in U]?: AspectWrapper | ((...args: any[]) => any);
                }, U extends string>(target: T, methodName: U, advice: T[U] extends (...a: any[]) => any ? (origFn: T[U]) => T[U] : Function): Handle;
                /**
                 * The "after" export of the aspect module is a function that can be used to attach
                 * "after" advice to a method. This function will be executed after the original method
                 * is executed. By default the function will be called with a single argument, the return
                 * value of the original method, or the the return value of the last executed advice (if a previous one exists).
                 * The fourth (optional) argument can be set to true to so the function receives the original
                 * arguments (from when the original method was called) rather than the return value.
                 * If there are multiple "after" advisors, they are executed in the order they were registered.
                 */
                after<T extends object & {
                    [K in U]?: AspectWrapper | ((...args: any[]) => any);
                }, U extends string, RA extends boolean = false>(target: T, methodName: U, advice: T[U] extends (...a: any[]) => any ? (RA extends Falsy ? (prevResult: any | void) => any : (...sourceArgs: Parameters<T[U]>) => any) : (RA extends Falsy ? (prevResult: any | void) => any : (...publishArgs: any) => any), receiveArguments?: RA): Handle;
            }
        }
    }
    const _default_2: DojoJS.Aspect;
    export = _default_2;
}
declare module "dojo/Evented" {
    class Evented {
        private static n;
        constructor();
        on(type: string | DojoJS.ExtensionEvent, listener: EventListener | Function): DojoJS.Handle;
        emit(type: string | DojoJS.ExtensionEvent, events: any[]): boolean;
    }
    export = Evented;
}
declare module "dojo/topic" {
    class Topic {
        private static t;
        /**
         * Publishes a message to a topic on the pub/sub hub. All arguments after
         * the first will be passed to the subscribers, so any number of arguments
         * can be provided (not just event).
         */
        publish(topic: string | DojoJS.ExtensionEvent, eventArgs: any[]): boolean;
        /**
         * Subscribes to a topic on the pub/sub hub
         */
        subscribe(topic: string | DojoJS.ExtensionEvent, listener: EventListener | Function): DojoJS.Handle;
    }
    const _default_3: Topic;
    export = _default_3;
}
declare module "dojo/_base/window" {
    import dojo = require("dojo/_base/kernel");
    global {
        namespace DojoJS {
            interface Dojo {
                /**
                 * Alias for the current document. 'doc' can be modified
                 * for temporary context shifting. See also withDoc().
                 */
                doc: Document;
                /**
                 * Return the body element of the specified document or of dojo/_base/window::doc.
                 */
                body(doc?: Document): HTMLBodyElement;
                /**
                 * changes the behavior of many core Dojo functions that deal with
                 * namespace and DOM lookup, changing them to work in a new global
                 * context (e.g., an iframe). The varibles dojo.global and dojo.doc
                 * are modified as a result of calling this function and the result of
                 * `dojo.body()` likewise differs.
                 */
                setContext(globalObject: Record<string, any>, globalDocument: Document): void;
                /**
                 * Invoke callback with globalObject as dojo.global and
                 * globalObject.document as dojo.doc.
                 */
                withGlobal<T>(globalObject: Record<string, any>, callback: (...args: any[]) => T, thisObject?: Object, cbArguments?: any[]): T;
                /**
                 * Invoke callback with documentObject as dojo/_base/window::doc.
                 */
                withDoc<T>(documentObject: Document, callback: (...args: any[]) => T, thisObject?: Object, cbArguments?: any[]): T;
            }
        }
    }
    export = dojo;
}
declare module "dojo/dom" {
    interface Dom {
        /**
         * Returns DOM node with matching `id` attribute or falsy value (ex: null or undefined)
         * if not found. Internally if `id` is not a string then `id` returned.
         */
        byId(falsy: Falsy, _?: any): null;
        byId<E extends HTMLElement>(id: string, doc?: Document): E | null;
        byId<T>(passthrough: Exclude<T, string>, _?: any): T;
        byId<E extends HTMLElement>(id: string | E, doc?: Document): E | null;
        byId<T, E extends HTMLElement>(id_or_any: T, doc?: Document): T extends string ? (E | null) : T extends Falsy ? null : T;
        /**
         * Returns true if node is a descendant of ancestor
         */
        isDescendant(node: Node | string, ancestor: Node | string): boolean;
        /**
         * Enable or disable selection on a node
         */
        setSelectable(node: Element | string, selectable?: boolean): void;
    }
    const _default_4: Dom;
    export = _default_4;
}
declare module "dojo/dom-style" {
    global {
        namespace DojoJS {
            interface DomStyle {
                /**
                 * Returns a "computed style" object.
                 */
                getComputedStyle(node: Node): CSSStyleDeclaration;
                /**
                 * Accesses styles on a node.
                 */
                get(node: Element | string): CSSStyleDeclaration;
                get<T extends keyof CSSStyleDeclaration>(node: Element | string, name: T): CSSStyleDeclaration[T];
                /**
                 * Sets styles on a node.
                 */
                set(node: Element | string, props: Partial<CSSStyleDeclaration>): CSSStyleDeclaration;
                set(node: Element | string, name: 'opacity', value: number): number;
                set<T extends keyof CSSStyleDeclaration>(node: Element | string, name: T, value: CSSStyleDeclaration[T]): CSSStyleDeclaration[T];
                /**
                 * converts style value to pixels on IE or return a numeric value.
                 */
                toPixelValue(element: Element, value: string): number;
            }
        }
    }
    const _default_5: DojoJS.DomStyle;
    export = _default_5;
}
declare module "dojo/dom-geometry" {
    global {
        namespace DojoJS {
            interface DomGeometryWidthHeight {
                w?: number;
                h?: number;
            }
            interface DomGeometryBox extends DomGeometryWidthHeight {
                l?: number;
                t?: number;
            }
            interface DomGeometryBoxExtents extends DomGeometryBox {
                r?: number;
                b?: number;
            }
            interface Point {
                x: number;
                y: number;
            }
            interface DomGeometryXYBox extends DomGeometryWidthHeight, Point {
            }
            interface DomGeometry {
                boxModel: 'border-box' | 'content-box';
                /**
                 * Returns object with special values specifically useful for node
                 * fitting.
                 */
                getPadExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
                /**
                 * returns an object with properties useful for noting the border
                 * dimensions.
                 */
                getBorderExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
                /**
                 * Returns object with properties useful for box fitting with
                 * regards to padding.
                 */
                getPadBorderExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
                /**
                 * returns object with properties useful for box fitting with
                 * regards to box margins (i.e., the outer-box).
                 * - l/t = marginLeft, marginTop, respectively
                 * - w = total width, margin inclusive
                 * - h = total height, margin inclusive
                 * The w/h are used for calculating boxes.
                 * Normally application code will not need to invoke this
                 * directly, and will use the ...box... functions instead.
                 */
                getMarginExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
                /**
                 * returns an object that encodes the width, height, left and top
                 * positions of the node's margin box.
                 */
                getMarginBox(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBox | throws<TypeError>;
                /**
                 * Returns an object that encodes the width, height, left and top
                 * positions of the node's content box, irrespective of the
                 * current box model.
                 */
                getContentBox(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBox | throws<TypeError>;
                /**
                 * Sets the size of the node's contents, irrespective of margins,
                 * padding, or borders.
                 */
                setContentSize(node: Element | string, box: DomGeometryWidthHeight, computedStyle?: CSSStyleDeclaration): void | throws<TypeError>;
                /**
                 * sets the size of the node's margin box and placement
                 * (left/top), irrespective of box model. Think of it as a
                 * passthrough to setBox that handles box-model vagaries for
                 * you.
                 */
                setMarginBox(node: Element | string, box: DomGeometryBox, computedStyle?: CSSStyleDeclaration): void | throws<TypeError>;
                /**
                 * Returns true if the current language is left-to-right, and false otherwise.
                 */
                isBodyLtr(doc?: Document): boolean;
                /**
                 * Returns an object with {node, x, y} with corresponding offsets.
                 */
                docScroll(doc?: Document): Point;
                /**
                 * Deprecated method previously used for IE6-IE7.  Now, just returns `{x:0, y:0}`.
                 */
                getIeDocumentElementOffset(doc: Document): Point;
                /**
                 * In RTL direction, scrollLeft should be a negative value, but IE
                 * returns a positive one. All codes using documentElement.scrollLeft
                 * must call this function to fix this error, otherwise the position
                 * will offset to right when there is a horizontal scrollbar.
                 */
                fixIeBiDiScrollLeft(scrollLeft: number, doc?: Document): number;
                /**
                 * Gets the position and size of the passed element relative to
                 * the viewport (if includeScroll==false), or relative to the
                 * document root (if includeScroll==true).
                 */
                position(node: Element | string, includeScroll?: boolean): DomGeometryXYBox | throws<TypeError>;
                /**
                 * returns an object that encodes the width and height of
                 * the node's margin box
                 */
                getMarginSize(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryWidthHeight | throws<TypeError>;
                /**
                 * Normalizes the geometry of a DOM event, normalizing the pageX, pageY,
                 * offsetX, offsetY, layerX, and layerX properties
                 */
                normalizeEvent(event: Event | string): void | throws<TypeError>;
            }
        }
    }
    const _default_6: DojoJS.DomGeometry;
    export = _default_6;
}
declare module "dojo/_base/event" {
    import dojo = require("dojo/_base/kernel");
    class EventModule {
        /**
         * normalizes properties on the event object including event
         * bubbling methods, keystroke normalization, and x/y positions
         */
        fixEvent(evt: Event, sender: Element): Event;
        /**
         * prevents propagation and clobbers the default action of the
         * passed event
         */
        stopEvent(evt: Event): void;
    }
    global {
        namespace DojoJS {
            interface Dojo extends EventModule {
            }
        }
    }
    export = dojo;
}
declare module "dojo/mouse" {
    function s(e: any, n: any): (o: any, i: any) => DojoJS.Handle;
    global {
        namespace DojoJS {
            interface MouseButtons {
                LEFT: 1;
                MIDDLE: 2;
                RIGHT: 4;
                /**
                 * Test an event object (from a mousedown event) to see if the left button was pressed.
                 */
                isLeft(e: MouseEvent): boolean;
                /**
                 * Test an event object (from a mousedown event) to see if the middle button was pressed.
                 */
                isMiddle(e: MouseEvent): boolean;
                /**
                 * Test an event object (from a mousedown event) to see if the right button was pressed.
                 */
                isRight(e: MouseEvent): boolean;
            }
            interface Mouse extends MouseButtons {
                _eventHandler(type: string, selectHandler?: (evt: MouseEvent, listener: EventListener) => void): MouseEvent;
                /**
                 * This is an extension event for the mouseenter that IE provides, emulating the
                 * behavior on other browsers.
                 */
                enter: MouseEvent;
                /**
                 * This is an extension event for the mouseleave that IE provides, emulating the
                 * behavior on other browsers.
                 */
                leave: MouseEvent;
                /**
                 * This is an extension event for the mousewheel that non-Mozilla browsers provide,
                 * emulating the behavior on Mozilla based browsers.
                 */
                wheel: string | ExtensionEvent;
            }
            interface Dojo {
                mouseButtons: MouseButtons;
            }
        }
    }
    const _default_7: {
        _eventHandler: typeof s;
        enter: (o: any, i: any) => DojoJS.Handle;
        leave: (o: any, i: any) => DojoJS.Handle;
        wheel: string | ((e: any, n: any) => DojoJS.Handle);
        isLeft: ((e: any) => number) | ((e: any) => boolean);
        isMiddle: ((e: any) => number) | ((e: any) => boolean);
        isRight: ((e: any) => number) | ((e: any) => boolean);
    };
    export = _default_7;
}
declare module "dojo/_base/sniff" {
    import has = require("dojo/sniff");
    global {
        namespace DojoJS {
            interface Dojo {
                _name: "browser";
                /**
                 * True if the client is a web-browser
                 */
                isBrowser: boolean;
                /**
                 * Version as a Number if client is FireFox. undefined otherwise. Corresponds to
                 * major detected FireFox version (1.5, 2, 3, etc.)
                 */
                isFF?: number;
                /**
                 * Version as a Number if client is MSIE(PC). undefined otherwise. Corresponds to
                 * major detected IE version (6, 7, 8, etc.)
                 */
                isIE?: number;
                /**
                 * Version as a Number if client is a KHTML browser. undefined otherwise. Corresponds to major
                 * detected version.
                 */
                isKhtml?: number;
                /**
                 * Version as a Number if client is a WebKit-derived browser (Konqueror,
                 * Safari, Chrome, etc.). undefined otherwise.
                 */
                isWebKit?: number;
                /**
                 * Version as a Number if client is a Mozilla-based browser (Firefox,
                 * SeaMonkey). undefined otherwise. Corresponds to major detected version.
                 */
                isMozilla?: number;
                /**
                 * Version as a Number if client is a Mozilla-based browser (Firefox,
                 * SeaMonkey). undefined otherwise. Corresponds to major detected version.
                 */
                isMoz?: number;
                /**
                 * Version as a Number if client is Opera. undefined otherwise. Corresponds to
                 * major detected version.
                 */
                isOpera?: number;
                /**
                 * Version as a Number if client is Safari or iPhone. undefined otherwise.
                 */
                isSafari?: number;
                /**
                 * Version as a Number if client is Chrome browser. undefined otherwise.
                 */
                isChrome?: number;
                /**
                 * True if the client runs on Mac
                 */
                isMac: boolean;
                /**
                 * Version as a Number if client is iPhone, iPod, or iPad. undefined otherwise.
                 */
                isIos?: number;
                /**
                 * Version as a Number if client is android browser. undefined otherwise.
                 */
                isAndroid?: number;
                /**
                 * True if client is Wii
                 */
                isWii: boolean | any;
                /**
                 * Page is in quirks mode.
                 */
                isQuirks: boolean;
                /**
                 * True if client is Adobe Air
                 */
                isAir: boolean;
            }
        }
    }
    export = has;
}
declare module "dojo/keys" {
    class Keys {
        BACKSPACE: number;
        TAB: number;
        CLEAR: number;
        ENTER: number;
        SHIFT: number;
        CTRL: number;
        ALT: number;
        META: number;
        PAUSE: number;
        CAPS_LOCK: number;
        ESCAPE: number;
        SPACE: number;
        PAGE_UP: number;
        PAGE_DOWN: number;
        END: number;
        HOME: number;
        LEFT_ARROW: number;
        UP_ARROW: number;
        RIGHT_ARROW: number;
        DOWN_ARROW: number;
        INSERT: number;
        DELETE: number;
        HELP: number;
        LEFT_WINDOW: number;
        RIGHT_WINDOW: number;
        SELECT: number;
        NUMPAD_0: number;
        NUMPAD_1: number;
        NUMPAD_2: number;
        NUMPAD_3: number;
        NUMPAD_4: number;
        NUMPAD_5: number;
        NUMPAD_6: number;
        NUMPAD_7: number;
        NUMPAD_8: number;
        NUMPAD_9: number;
        NUMPAD_MULTIPLY: number;
        NUMPAD_PLUS: number;
        NUMPAD_ENTER: number;
        NUMPAD_MINUS: number;
        NUMPAD_PERIOD: number;
        NUMPAD_DIVIDE: number;
        F1: number;
        F2: number;
        F3: number;
        F4: number;
        F5: number;
        F6: number;
        F7: number;
        F8: number;
        F9: number;
        F10: number;
        F11: number;
        F12: number;
        F13: number;
        F14: number;
        F15: number;
        NUM_LOCK: number;
        SCROLL_LOCK: number;
        UP_DPAD: number;
        DOWN_DPAD: number;
        LEFT_DPAD: number;
        RIGHT_DPAD: number;
        copyKey: number;
    }
    global {
        namespace DojoJS {
            interface Dojo {
                keys: Keys;
            }
        }
    }
    const _default_8: Keys;
    export = _default_8;
}
declare module "dojo/_base/connect" {
    import "dojo/keys";
    class Connect {
        /**
         * WIP: Type this better
         */
        _keypress: (object: any, listener: EventListener) => DojoJS.Handle;
        /**
         * `dojo.connect` is a deprecated event handling and delegation method in
         * Dojo. It allows one function to "listen in" on the execution of
         * any other, triggering the second whenever the first is called. Many
         * listeners may be attached to a function, and source functions may
         * be either regular function calls or DOM events.
         */
        connect<U extends keyof any, M extends keyof DojoJS.Global>(event: DojoJS.ConnectGlobalEvent<U>, method: DojoJS.Global extends DojoJS.WithFunc<null, M, DojoJS.ConnectGlobalEventParams<U>> ? M : never, dontFix?: boolean): DojoJS.Handle;
        connect<U extends keyof any, const M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<U>>>(event: DojoJS.ConnectGlobalEvent<U>, method: M, dontFix?: boolean): DojoJS.Handle;
        connect<U extends keyof any, S, M extends keyof any>(...[event, scope, method, dontFix]: [
            DojoJS.ConnectGlobalEvent<U>,
            ...DojoJS.HitchedPair<S, M, DojoJS.ConnectGlobalEventParams<U>>,
            boolean?
        ]): DojoJS.Handle;
        connect<U extends keyof any, S, const M extends DojoJS.BoundFunc<S, DojoJS.ConnectGlobalEventParams<U>>>(event: DojoJS.ConnectGlobalEvent<U>, scope: S, method: M, dontFix?: boolean): DojoJS.Handle;
        connect<K extends keyof DojoJS.AllEvents, M extends keyof DojoJS.Global>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: DojoJS.Global extends DojoJS.WithFunc<null, M, [DojoJS.AllEvents[K]]> ? M : never, dontFix?: boolean): DojoJS.Handle;
        connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<K>>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): DojoJS.Handle;
        connect<K extends keyof DojoJS.AllEvents, S, M extends keyof any>(...[targetObject, event, scope, method, dontFix]: [
            DojoJS.ConnectListenerTarget<K>,
            K | `on${K}`,
            ...DojoJS.HitchedPair<S, M, [DojoJS.AllEvents[K]]>,
            boolean?
        ]): DojoJS.Handle;
        connect<K extends keyof DojoJS.AllEvents, S, M extends DojoJS.BoundFunc<S, [DojoJS.AllEvents[K]]>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, scope: S, method: M, dontFix?: boolean): DojoJS.Handle;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, M extends keyof DojoJS.Global>(targetObject: T, event: U, method: DojoJS.Global extends DojoJS.WithFunc<null, M, DojoJS.ConnectMethodParams<T, U>> ? M : never, dontFix?: boolean): DojoJS.Handle;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, M extends DojoJS.BoundFunc<null, DojoJS.ConnectMethodParams<T, U>>>(targetObject: T, event: U, method: M, dontFix?: boolean): DojoJS.Handle;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends keyof any>(...[targetObject, event, scope, method, dontFix]: [
            T,
            U,
            ...DojoJS.HitchedPair<S, M, DojoJS.ConnectMethodParams<T, U>>,
            boolean?
        ]): DojoJS.Handle;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>>>(targetObject: T, event: U, scope: S, method: M, dontFix?: boolean): DojoJS.Handle;
        /**
         * Remove a link created by dojo.connect.
         */
        disconnect(handle: DojoJS.Handle | Falsy): void;
        /**
         * Attach a listener to a named topic. The listener function is invoked whenever the
         * named topic is published (see: dojo.publish).
         * Returns a handle which is needed to unsubscribe this listener.
         */
        subscribe<M extends keyof DojoJS.Global, Args extends any[] = any[]>(topic: string, method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never): DojoJS.Handle;
        subscribe<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[] = any[]>(topic: string, method: M): DojoJS.Handle;
        subscribe<S, M extends keyof any, Args extends any[] = any[]>(...[topic, scope, method]: [string, ...DojoJS.HitchedPair<S, M, Args>]): DojoJS.Handle;
        subscribe<S, const M extends DojoJS.BoundFunc<S, Args>, Args extends any[] = any[]>(topic: string, scope: S, method: M): DojoJS.Handle;
        unsubscribe(handle: DojoJS.Handle | null): void;
        /**
         * Invoke all listener method subscribed to topic.
         */
        publish(topic: string, args?: any[] | null): boolean;
        /**
         * Ensure that every time obj.event() is called, a message is published
         * on the topic. Returns a handle which can be passed to
         * dojo.disconnect() to disable subsequent automatic publication on
         * the topic.
         */
        connectPublisher<M extends keyof DojoJS.Global, Args extends any[] = any[]>(topic: string, event: any, method: DojoJS.Global extends DojoJS.WithFunc<null, M, Args> ? M : never): DojoJS.Handle;
        connectPublisher<const M extends DojoJS.BoundFunc<null, Args>, Args extends any[] = any[]>(topic: string, event: any, method: M): DojoJS.Handle;
        /**
         * Checks an event for the copy key (meta on Mac, and ctrl anywhere else)
         */
        isCopyKey(e: Event): boolean;
    }
    global {
        namespace DojoJS {
            interface Dojo extends Connect {
            }
            type AllEvents = WindowEventMap & GlobalEventHandlersEventMap & WindowEventHandlersEventMap & DocumentEventMap & ElementEventMap;
            type ConnectGlobalEvent<U extends keyof any> = keyof WindowEventMap | ((Window & typeof globalThis) extends {
                [K in U]: (((...args: any[]) => any) | Event);
            } ? U : never);
            type ConnectGlobalEventParams<U extends keyof any> = U extends keyof WindowEventMap ? [WindowEventMap[U]] : (Window & typeof globalThis) extends {
                [K in U]: infer F extends (((...args: any[]) => any) | Event);
            } ? F extends (...args: any[]) => any ? Parameters<F> : [Element] : never;
            type ConnectListenerTarget<K extends keyof AllEvents> = {
                addEventListener(e: keyof AllEvents, l: (evt: AllEvents[K]) => any): void;
            };
            type ConnectMethodTarget<U extends keyof any> = object & {
                [K in U]: ((...args: any[]) => any) | Event | null;
            };
            type ConnectMethodParams<T extends ConnectMethodTarget<U>, U extends keyof any> = Exclude<T[U], null> extends infer F extends (...args: any[]) => any ? Parameters<F> : [Element];
        }
    }
    var connect: Connect;
    export = connect;
}
declare module "dojo/errors/create" {
    function create<E extends typeof Error = typeof Error, P extends object = {}>(name: string, ctor?: Constructor<any> | null, base?: E | null, props?: P | null): {
        new (...args: Parameters<E>): InstanceType<E> & P;
        prototype: InstanceType<E> & P;
    } & E;
    export = create;
}
declare module "dojo/errors/CancelError" {
    const _default_9: {
        new (message?: string | undefined, options?: ErrorOptions | undefined): Error & {
            dojoType: string;
            log: boolean;
        };
        prototype: Error & {
            dojoType: string;
            log: boolean;
        };
    } & ErrorConstructor;
    export = _default_9;
}
declare module "dojo/promise/Promise" {
    class Promise<T> implements DojoJS.Thenable<T> {
        /**
         * Add new callbacks to the promise.
         */
        then<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null, progback?: ((progress: any) => void) | null): Promise<U>;
        /**
         * Inform the deferred it may cancel its asynchronous operation.
         */
        cancel(reason?: any, strict?: boolean): any;
        /**
         * Checks whether the promise has been resolved.
         */
        isResolved(): boolean;
        /**
         * Checks whether the promise has been rejected.
         */
        isRejected(): boolean;
        /**
         * Checks whether the promise has been resolved or rejected.
         */
        isFulfilled(): boolean;
        /**
         * Checks whether the promise has been canceled.
         */
        isCanceled(): boolean;
        /**
         * Add a callback to be invoked when the promise is resolved
         * or rejected.
         */
        always<U>(callbackOrErrback: (result: T) => U | DojoJS.Thenable<U> | void): Promise<U | void>;
        /**
         * Add new errbacks to the promise. Follows ECMA specification naming.
         */
        catch<U>(errback: (error: any) => U | DojoJS.Thenable<U>): Promise<U>;
        /**
         * Add new errbacks to the promise.
         */
        otherwise<U>(errback: (error: any) => U | DojoJS.Thenable<U>): Promise<U>;
        trace(): this;
        traceRejected(): this;
        toString(): string;
    }
    global {
        namespace DojoJS {
            interface Thenable<T> {
                /**
                 * Add new callbacks to the promise.
                 */
                then<U>(callback?: ((result: T) => U | Thenable<U>) | null, errback?: ((error: any) => U | Thenable<U> | void) | null, progback?: ((progress: any) => void) | null): Promise<U>;
            }
            type Promise<T> = InstanceType<typeof Promise<T>>;
        }
    }
    export = Promise;
}
declare module "dojo/promise/tracer" {
    let tracer: {
        on(type: 'resolved' | 'rejected' | 'progress'): DojoJS.Handle;
        emit: null;
    };
    global {
        namespace DojoJS {
        }
    }
    export = tracer;
}
declare module "dojo/promise/instrumentation" {
    function instrumentation(deferred: typeof import("dojo/Deferred")): void;
    global {
        namespace DojoJS {
        }
    }
    export = instrumentation;
}
declare module "dojo/Deferred" {
    import Promise = require("dojo/promise/Promise");
    type Deferred<T> = {
        /**
         * The public promise object that clients can add callbacks to.
         */
        promise: Promise<T>;
        /**
         * Checks whether the deferred has been resolved.
         */
        isResolved(): boolean;
        /**
         * Checks whether the deferred has been rejected.
         */
        isRejected(): boolean;
        /**
         * Checks whether the deferred has been resolved or rejected.
         */
        isFulfilled(): boolean;
        /**
         * Checks whether the deferred has been canceled.
         */
        isCanceled(): boolean;
        /**
         * Emit a progress update on the deferred.
         */
        progress(update: any, strict?: boolean): Promise<T>;
        /**
         * Resolve the deferred.
         */
        resolve(value?: T, strict?: boolean): Promise<T>;
        /**
         * Reject the deferred.
         */
        reject(error?: any, strict?: boolean): Promise<T>;
        /**
         * Inform the deferred it may cancel its asynchronous operation.
         */
        cancel(reason?: any, strict?: boolean): any;
        /**
         * Returns `[object Deferred]`.
         */
        toString(): string;
    } & Promise<T>['then'];
    interface DeferredConstructor {
        /**
         * Creates a new deferred. This API is preferred over
         * `dojo/_base/Deferred`.
         */
        new <T>(canceller?: (reason: any) => void): Deferred<T>;
        prototype: Deferred<any>;
        instrumentRejected: any;
    }
    type _Deferred<T> = Deferred<T>;
    const _Deferred: DeferredConstructor;
    export = _Deferred;
}
declare module "dojo/when" {
    import Promise = require("dojo/promise/Promise");
    function when<T, U = T>(value: T | Promise<T>, callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null, progback?: ((progress: any) => void) | null): U | Promise<U>;
    export = when;
}
declare module "dojo/_base/Deferred" {
    import when = require("dojo/when");
    global {
        namespace DojoJS {
            interface Deferred<T> extends Thenable<T> {
                promise: Promise<T>;
                /**
                 * Checks whether the deferred has been resolved.
                 */
                isResolved(): boolean;
                /**
                 * Checks whether the deferred has been rejected.
                 */
                isRejected(): boolean;
                /**
                 * Checks whether the deferred has been resolved or rejected.
                 */
                isFulfilled(): boolean;
                /**
                 * Checks whether the deferred has been canceled.
                 */
                isCanceled(): boolean;
                /**
                 * Emit a progress update on the deferred.
                 */
                progress(update: any, strict?: boolean): Promise<T>;
                /**
                 * Resolve the deferred.
                 */
                resolve(value?: T, strict?: boolean): Promise<T>;
                /**
                 * Reject the deferred.
                 */
                reject(error?: any, strict?: boolean): Promise<T>;
                /**
                 * The results of the Defereed
                 */
                results: [T, any];
                /**
                 * Adds callback and error callback for this deferred instance.
                 */
                addCallbacks<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;
                /**
                 * Cancels the asynchronous operation
                 */
                cancel(): void;
                /**
                 * Adds successful callback for this deferred instance.
                 */
                addCallback<U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null): Deferred<U>;
                /**
                 * Adds error callback for this deferred instance.
                 */
                addErrback<U>(errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;
                /**
                 * Add handler as both successful callback and error callback for this deferred instance.
                 */
                addBoth<U>(errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null): Deferred<U>;
                fired: number;
            }
            interface DeferredConstructor {
                /**
                 * Deprecated.   This module defines the legacy dojo/_base/Deferred API.
                 * New code should use dojo/Deferred instead.
                 */
                new <T>(canceller?: (reason: any) => void): Deferred<T>;
                prototype: Deferred<any>;
                /** See {@link when} for more information. */
                when: typeof when;
            }
            interface Dojo {
                Deferred: typeof import("dojo/_base/Deferred");
            }
        }
    }
    type Deferred<T> = DojoJS.Deferred<T>;
    const Deferred: DojoJS.DeferredConstructor;
    export = Deferred;
}
declare module "dojo/json" {
    class DojoJSON {
        /**
         * Parses a [JSON](http://json.org) string to return a JavaScript object.
         */
        parse: ((text: string, reviver?: (this: any, key: string, value: any) => any) => any) | ((str: string, strict?: boolean) => any);
        /**
         * Returns a [JSON](http://json.org) serialization of an object.
         */
        stringify(e: any, t: any, n: any): string;
    }
    const _default_10: JSON | DojoJSON;
    export = _default_10;
}
declare module "dojo/_base/json" {
    import dojo = require("dojo/_base/kernel");
    global {
        namespace DojoJS {
            interface Dojo {
                fromJson<T>(js: string): T;
                _escapeString: (arg0: any, arg1: any, arg2: any) => string;
                toJsonIndentStr: string;
                toJson(e: any, t?: any): string;
            }
        }
    }
    export = dojo;
}
declare module "dojo/_base/Color" {
    var _baseColorNames: {
        black: number[];
        silver: number[];
        gray: number[];
        white: number[];
        maroon: number[];
        red: number[];
        purple: number[];
        fuchsia: number[];
        green: number[];
        lime: number[];
        olive: number[];
        yellow: number[];
        navy: number[];
        blue: number[];
        teal: number[];
        aqua: number[];
        transparent: [number, number, number] | [number, number, number, number];
    };
    class Color {
        /** The red component of the color as an RGBA value. Always between 0-255. */
        r: number;
        /** The green component of the color as an RGBA value. Always between 0-255. */
        g: number;
        /** The blue component of the color as an RGBA value. Always between 0-255. */
        b: number;
        /** The alpha component of the color as an RGBA value. Always between 0-1. */
        a: number;
        /** Creates a new color object using the {@link setColor} method. */
        constructor(color?: any[] | string | {
            r: number;
            g: number;
            b: number;
            a: number;
        });
        /** Takes a named string, hex string, array of rgb or rgba values,
         * an object with r, g, b, and a properties, or another `Color` object
         * and sets this color instance to that value.
         */
        setColor(color?: any[] | string | {
            r: number;
            g: number;
            b: number;
            a: number;
        }): Color;
        /**
         * Ensures the object has correct attributes and all values are within the required ranges.
         */
        sanitize(): Color;
        /**
         * Returns 3 component array of rgb values
         */
        toRgb(): [number, number, number];
        /**
         * Returns a 4 component array of rgba values from the color represented by
         * this object.
         */
        toRgba(): [number, number, number, number];
        /**
         * Returns a CSS color string in hexadecimal representation
         */
        toHex(): string;
        /**
         * Returns a css color string in rgb(a) representation
         */
        toCss(includeAlpha?: boolean): string;
        /**
         * Returns the css color string representation with alpha
         */
        toString(): string;
        /**
         * Sets the properties of the color object matching the given arguments.
         */
        _set(r: number, g: number, b: number, a: number): void;
        /**
         * Dictionary list of all CSS named colors, by name. Values are 3-item arrays with corresponding RG and B values.
         */
        static named: DojoJS.ColorNames;
        /**
         * Blend colors end and start with weight from 0 to 1, 0.5 being a 50/50 blend,
         * can reuse a previously allocated Color object for the result
         */
        static blendColors(start: Color, end: Color, weight: number, obj?: Color): Color;
        /**
         * Returns a `Color` instance from a string of the form
         * "rgb(...)" or "rgba(...)". Optionally accepts a `Color`
         * object to update with the parsed value and return instead of
         * creating a new object.
         */
        static fromRgb(color: string, obj?: Color): Color | null;
        /**
         * Converts a hex string with a '#' prefix to a color object.
         * Supports 12-bit #rgb shorthand. Optionally accepts a
         * `Color` object to update with the parsed value.
         */
        static fromHex<T extends string>(color: T, obj?: Color): T extends InferHexColor<T> ? Color : (Color | null);
        /**
         * Builds a `Color` from a 3 or 4 element array, mapping each
         * element in sequence to the rgb(a) values of the color.
         */
        static fromArray(color: any[], obj?: Color): Color;
        /**
         * Parses `str` for a color value. Accepts named color, hex, rgb, and rgba
         * style color values.
         */
        static fromString<T extends string>(str: T, obj?: Color): T extends keyof DojoJS.ColorNames ? Color : (T extends InferHexColor<T> ? Color : (Color | null));
        /**
         * Returns a new `Color` instance based on the provided value (brightness) of a grayscale color.
         * @throws {Error} "dojo/colors" has not been loaded and is needed to use this function
         */
        static makeGrey(value: string | number, alpha: string | number): Color;
    }
    type BaseColorNames = typeof _baseColorNames;
    global {
        namespace DojoJS {
            interface Dojo {
                /**
                 * The `Color` object provides various utility functions for creating and manipulating colors.
                 */
                Color: typeof Color;
                blendColors: typeof Color.blendColors;
                colorFromRgb: typeof Color.fromRgb;
                colorFromHex: typeof Color.fromHex;
                colorFromArray: typeof Color.fromArray;
                colorFromString: typeof Color.fromString;
            }
            interface ColorNames extends BaseColorNames {
            }
        }
    }
    export = Color;
}
declare module "dojo/_base/unload" {
    class Unload {
        private static r;
        /**
         * Registers a function to be triggered when window.onunload fires.
         * @deprecated use on(window, "unload", lang.hitch(obj, functionName)) instead.
         */
        addOnWindowUnload(obj: Record<string, any> | Function, functionName?: string | Function): void;
        /**
         * Registers a function to be triggered when the page unloads.
         * @deprecated use on(window, "beforeunload", lang.hitch(obj, functionName))
         */
        addOnUnload(obj: Record<string, any> | Function, functionName?: string | Function): void;
    }
    global {
        namespace DojoJS {
            type Unload = typeof Unload;
            interface Dojo {
                /**
                 * Registers a function to be triggered when window.onunload fires.
                 * @deprecated use on(window, "unload", lang.hitch(obj, functionName)) instead.
                 */
                addOnWindowUnload: InstanceType<Unload>["addOnWindowUnload"];
                /**
                 * Registers a function to be triggered when the page unloads.
                 * @deprecated use on(window, "beforeunload", lang.hitch(obj, functionName))
                 */
                addOnUnload: InstanceType<Unload>["addOnUnload"];
                windowUnloaded?: () => void;
            }
        }
    }
    var unload: Unload;
    export = unload;
}
declare module "dojo/dom-construct" {
    import "exports";
    interface DomConstruct {
        /**
         * instantiates an HTML fragment returning the corresponding DOM.
         */
        toDom(frag: string, doc?: Document): DocumentFragment | Node;
        /**
         * Attempt to insert node into the DOM, choosing from various positioning options.
         * Returns the first argument resolved to a DOM node.
         */
        place(node: Node | string | DocumentFragment, refNode: Node | string, position?: DojoJS.PlacePosition): HTMLElement;
        /**
         * Create an element, allowing for optional attribute decoration
         * and placement.
         */
        create(tag: Node | string, attrs?: Record<string, any>, refNode?: Node | string, pos?: DojoJS.PlacePosition): HTMLElement;
        /**
         * safely removes all children of the node.
         */
        empty(node: Node | string): void;
        /**
         * Removes a node from its parent, clobbering it and all of its
         * children.
         */
        destroy(node: Node | string): void;
    }
    global {
        namespace DojoJS {
            type PlacePosition = 'first' | 'after' | 'before' | 'last' | 'replace' | 'only' | number;
        }
    }
    const _default_11: DomConstruct;
    export = _default_11;
}
declare module "dojo/dom-prop" {
    import "exports";
    class Props {
        private static u;
        private static c;
        private static l;
        private static f;
        names: Record<string, string>;
        /**
         * Gets a property on an HTML element.
         * @throws {TypeError} if node is not resolved to an element
         */
        get<T extends Element, U extends string>(node: T, name: U): U extends keyof T ? T[U] : undefined;
        get(node: string | Element, name: 'textContent' | 'textcontent'): (string | "") | throws<TypeError>;
        /**
         * Sets a property on an HTML element.
         * @throws {TypeError} if node is not resolved to an element
         */
        set<T extends Element, U extends keyof T>(node: T, name: U, value: T[U]): T;
        set<T extends Element, U extends {
            [K in keyof T]?: T[K];
        }>(node: T, name: U): T;
    }
    const _default_12: Props;
    export = _default_12;
}
declare module "dojo/dom-attr" {
    class Attr {
        private static a;
        private static s;
        private static u;
        /**
         * Returns true if the requested attribute is specified on the given element, and false otherwise.
         * @throws {TypeError} if node is not resolved to an element
         */
        has(node: Element | string, name: string): boolean | throws<TypeError>;
        /**
         * Gets the value of the named property from the provided element.
         * @throws {TypeError} if node is not resolved to an element
         */
        get<T extends Element, U extends string>(node: T, name: U): U extends keyof T ? T[U] : unknown;
        get(node: string | Element, name: 'textContent' | 'textcontent'): (string | "") | throws<TypeError>;
        /**
         * Sets the value of a property on an HTML element.
         * @throws {TypeError} if node is not resolved to an element
         */
        set<T extends Element, U extends keyof T>(node: T, name: U, value: T[U]): T;
        set<T extends Element, U extends {
            [K in keyof T]?: T[K];
        }>(node: T, name: U): T;
        /**
         * Removes an attribute from an HTML element.
         * @throws {TypeError} if node is not resolved to an element
         */
        remove(node: Element | string, name: string): void | throws<TypeError>;
        /**
         * Returns the value of a property on an HTML element.
         * @throws {TypeError} if node is not resolved to an element
         */
        getNodeProp(node: Element | string, name: string): any | throws<TypeError>;
    }
    const _default_13: Attr;
    export = _default_13;
}
declare module "dojo/dom-class" {
    var r: DojoJS.DomClass;
    global {
        namespace DojoJS {
            interface DomClass {
                /**
                 * Returns whether or not the specified classes are a portion of the
                 * class list currently applied to the node.
                 */
                contains(node: Node | string, classStr: string): boolean;
                /**
                 * Adds the specified classes to the end of the class list on the
                 * passed node. Will not re-apply duplicate classes.
                 */
                add(node: Node | string, classStr: string | string[]): void;
                /**
                 * Removes the specified classes from node. No `contains()`
                 * check is required.
                 */
                remove(node: Node | string, classStr?: string | string[]): void;
                /**
                 * Replaces one or more classes on a node if not present.
                 * Operates more quickly than calling dojo.removeClass and dojo.addClass
                 */
                replace(node: Node | string, addClassStr: string | string[], removeClassStr?: string | string[]): void;
                /**
                 * Adds a class to node if not present, or removes if present.
                 * Pass a boolean condition if you want to explicitly add or remove.
                 * Returns the condition that was specified directly or indirectly.
                 */
                toggle(node: Node | string, classStr: string | string[], condition?: boolean): boolean;
            }
        }
    }
    export = r;
}
declare module "dojo/_base/html" {
    import dojo = require("dojo/_base/kernel");
    import dom = require("dojo/dom");
    import domStyle = require("dojo/dom-style");
    import domAttr = require("dojo/dom-attr");
    import domProp = require("dojo/dom-prop");
    import domClass = require("dojo/dom-class");
    import domConstruct = require("dojo/dom-construct");
    import domGeo = require("dojo/dom-geometry");
    type DomConstruct = typeof domConstruct;
    type Dom = typeof dom;
    global {
        namespace DojoJS {
            interface Dojo extends DomConstruct, Dom {
                /**
                 * Returns true if the requested attribute is specified on the
                 * given element, and false otherwise.
                 */
                hasAttr: typeof domAttr.has;
                /**
                 * Gets an attribute on an HTML element.
                 * Because sometimes this uses node.getAttribute, it should be a string,
                 * but it can also get any other attribute on a node, therefore it is unsafe
                 * to type just a string.
                 */
                getAttr: typeof domAttr.get;
                /**
                 * Sets an attribute on an HTML element.
                 */
                setAttr: typeof domAttr.set;
                /**
                 * Removes an attribute from an HTML element.
                 */
                removeAttr: typeof domAttr.remove;
                /**
                 * Returns an effective value of a property or an attribute.
                 */
                getNodeProp: typeof domAttr.getNodeProp;
                /**
                 * Gets or sets an attribute on an HTML element.
                 */
                attr: typeof domAttr.get & typeof domAttr.set;
                /**
                 * Returns whether or not the specified classes are a portion of the
                 * class list currently applied to the node.
                 */
                hasClass: typeof domClass.contains;
                /**
                 * Adds the specified classes to the end of the class list on the
                 * passed node. Will not re-apply duplicate classes.
                 */
                addClass: typeof domClass.add;
                /**
                 * Removes the specified classes from node. No `contains()`
                 * check is required.
                 */
                removeClass: typeof domClass.remove;
                /**
                 * Replaces one or more classes on a node if not present.
                 * Operates more quickly than calling dojo.removeClass and dojo.addClass
                 */
                replaceClass: typeof domClass.replace;
                /**
                 * Adds a class to node if not present, or removes if present.
                 * Pass a boolean condition if you want to explicitly add or remove.
                 * Returns the condition that was specified directly or indirectly.
                 */
                toggleClass: typeof domClass.toggle;
                _toDom: typeof domConstruct.toDom;
                _destroyElement: typeof domConstruct.destroy;
                /**
                 * Returns object with special values specifically useful for node
                 * fitting.
                 */
                getPadExtents: typeof domGeo.getPadExtents;
                _getPadExtents: typeof domGeo.getPadExtents;
                /**
                 * returns an object with properties useful for noting the border
                 * dimensions.
                 */
                getBorderExtents: typeof domGeo.getBorderExtents;
                _getBorderExtents: typeof domGeo.getBorderExtents;
                /**
                 * Returns object with properties useful for box fitting with
                 * regards to padding.
                 */
                getPadBorderExtents: typeof domGeo.getPadBorderExtents;
                _getPadBorderExtents: typeof domGeo.getPadBorderExtents;
                /**
                 * returns object with properties useful for box fitting with
                 * regards to box margins (i.e., the outer-box).
                 * - l/t = marginLeft, marginTop, respectively
                 * - w = total width, margin inclusive
                 * - h = total height, margin inclusive
                 * The w/h are used for calculating boxes.
                 * Normally application code will not need to invoke this
                 * directly, and will use the ...box... functions instead.
                 */
                getMarginExtents: typeof domGeo.getMarginExtents;
                _getMarginExtents: typeof domGeo.getMarginExtents;
                /**
                 * returns an object that encodes the width, height, left and top
                 * positions of the node's margin box.
                 */
                getMarginBox: typeof domGeo.getMarginBox;
                _getMarginBox: typeof domGeo.getMarginBox;
                /**
                 * Returns an object that encodes the width, height, left and top
                 * positions of the node's content box, irrespective of the
                 * current box model.
                 */
                getContentBox: typeof domGeo.getContentBox;
                _getContentBox: typeof domGeo.getContentBox;
                /**
                 * Sets the size of the node's contents, irrespective of margins,
                 * padding, or borders.
                 */
                setContentSize: typeof domGeo.setContentSize;
                /**
                 * sets the size of the node's margin box and placement
                 * (left/top), irrespective of box model. Think of it as a
                 * passthrough to setBox that handles box-model vagaries for
                 * you.
                 */
                setMarginBox: typeof domGeo.setMarginBox;
                /**
                 * Returns true if the current language is left-to-right, and false otherwise.
                 */
                isBodyLtr: typeof domGeo.isBodyLtr;
                _isBodyLtr: typeof domGeo.isBodyLtr;
                /**
                 * Returns an object with {node, x, y} with corresponding offsets.
                 */
                docScroll: typeof domGeo.docScroll;
                _docScroll: typeof domGeo.docScroll;
                /**
                 * Deprecated method previously used for IE6-IE7.  Now, just returns `{x:0, y:0}`.
                 */
                getIeDocumentElementOffset: typeof domGeo.getIeDocumentElementOffset;
                _getIeDocumentElementOffset: typeof domGeo.getIeDocumentElementOffset;
                /**
                 * In RTL direction, scrollLeft should be a negative value, but IE
                 * returns a positive one. All codes using documentElement.scrollLeft
                 * must call this function to fix this error, otherwise the position
                 * will offset to right when there is a horizontal scrollbar.
                 */
                fixIeBiDiScrollLeft: typeof domGeo.fixIeBiDiScrollLeft;
                _fixIeBiDiScrollLeft: typeof domGeo.fixIeBiDiScrollLeft;
                /**
                 * Gets the position and size of the passed element relative to
                 * the viewport (if includeScroll==false), or relative to the
                 * document root (if includeScroll==true).
                 */
                position: typeof domGeo.position;
                /**
                 * returns an object that encodes the width and height of
                 * the node's margin box
                 */
                getMarginSize: typeof domGeo.getMarginSize;
                _getMarginSize: typeof domGeo.getMarginSize;
                /**
                 * Getter/setter for the margin-box of node.
                 */
                marginBox: typeof domGeo.getMarginBox & typeof domGeo.setMarginBox;
                /**
                 * Getter/setter for the content-box of node.
                 */
                contentBox: typeof domGeo.getContentBox & typeof domGeo.setContentSize;
                /**
                 * @deprecated Use position() for border-box x/y/w/h or marginBox() for margin-box w/h/l/t.
                 */
                coords(node: Node | string, includeScroll?: boolean): {
                    w?: number;
                    h?: number;
                    l?: number;
                    t?: number;
                    x?: number;
                    y?: number;
                };
                /**
                 * Gets a property on an HTML element.
                 */
                getProp: typeof domProp.get;
                /**
                 * Sets a property on an HTML element.
                 */
                setProp: typeof domProp.set;
                /**
                 * Gets or sets a property on an HTML element.
                 */
                prop: typeof domProp.get & typeof domProp.set;
                /**
                 * Returns a "computed style" object.
                 */
                getComputedStyle: typeof domStyle.getComputedStyle;
                /**
                 * Accesses styles on a node.
                 */
                getStyle: typeof domStyle.get;
                /**
                 * Sets styles on a node.
                 */
                setStyle: typeof domStyle.set;
                /**
                 * converts style value to pixels on IE or return a numeric value.
                 */
                toPixelValue: typeof domStyle.toPixelValue;
                __toPixelValue: typeof domStyle.toPixelValue;
                /**
                 * Accesses styles on a node. If 2 arguments are
                 * passed, acts as a getter. If 3 arguments are passed, acts
                 * as a setter.
                 */
                style: typeof domStyle.get & typeof domStyle.set;
            }
        }
    }
    export = dojo;
}
declare module "dojo/selector/_loader" {
    class Loader {
        private static r;
        private static o;
        private static i;
        load(n: string, a: any, s: Function, u: any): any;
    }
    const _default_14: Loader;
    export = _default_14;
}
declare module "dojo/query" {
    interface NodeListFilterCallback<T extends Node> {
        (item: T, idx: number, nodeList: this): boolean;
    }
    type NodeListFilter<T extends Node> = string | NodeListFilterCallback<T>;
    global {
        namespace DojoJS {
            interface Dojo {
                /**
                 * Provides a mechanism to filter a NodeList based on a selector or filtering function.
                 */
                query: Query;
            }
            interface NodeListConstructor {
                new <T extends Node>(array: number | Array<T>): DojoJS.NodeList<T>;
                new <T extends Node>(...args: T[]): DojoJS.NodeList<T>;
                <T extends Node>(array: number | Array<T>): DojoJS.NodeList<T>;
                <T extends Node>(...args: T[]): DojoJS.NodeList<T>;
                prototype: NodeList<any>;
                /**
                 * decorate an array to make it look like a `dojo/NodeList`.
                 */
                _wrap<U extends Node, V extends Node>(a: U[], parent?: DojoJS.NodeList<V>, NodeListCtor?: NodeListConstructor): DojoJS.NodeList<U>;
                /**
                 * adapts a single node function to be used in the map-type
                 * actions. The return is a new array of values, as via `dojo/_base/array.map`
                 */
                _adaptAsMap<T extends Node, U extends Node>(f: (node: T) => U, o?: Object): DojoJS.NodeList<U>;
                /**
                 * adapts a single node function to be used in the forEach-type
                 * actions. The initial object is returned from the specialized
                 * function.
                 */
                _adaptAsForEach<T extends Node>(f: (node: T) => void, o?: Object): this;
                /**
                 * adapts a single node function to be used in the filter-type actions
                 */
                _adaptAsFilter<T extends Node>(f: (node: T) => boolean, o?: Object): this;
                /**
                 * adapts a single node function to be used in the map-type
                 * actions, behaves like forEach() or map() depending on arguments
                 */
                _adaptWithCondition<T extends Node, U extends Node>(f: (node: T) => U | void, g: (...args: any[]) => boolean, o?: Object): DojoJS.NodeList<U> | this;
            }
            interface Query {
                /**
                 * Returns nodes which match the given CSS selector, searching the
                 * entire document by default but optionally taking a node to scope
                 * the search by. Returns an instance of NodeList.
                 */
                <T extends Node>(query: string, root?: Node | string): DojoJS.NodeList<T>;
                /**
                 * Test to see if a node matches a selector
                 */
                matches(node: Node, selector: string, root?: Node | string): boolean;
                /**
                 * Filters an array of nodes. Note that this does not guarantee to return a NodeList, just an array.
                 */
                filter<T extends Node>(nodes: DojoJS.NodeList<T> | T[], select: string, root?: Node | string): T[] | DojoJS.NodeList<T>;
                /**
                 * can be used as AMD plugin to conditionally load new query engine
                 */
                load(id: string, parentRequire: Function, loaded: Function): void;
                NodeList: NodeListConstructor;
            }
            interface NodeList<T extends Node> extends ArrayLike<T> {
                /**
                 * decorate an array to make it look like a `dojo/NodeList`.
                 */
                _wrap<U extends Node, V extends Node>(a: U[], parent?: NodeList<V>, NodeListCtor?: NodeListConstructor): NodeList<U>;
                _NodeListCtor: NodeListConstructor;
                toString(): string;
                /**
                 * private function to hold to a parent NodeList. end() to return the parent NodeList.
                 */
                _stash(parent: Node): this;
                /**
                 * Listen for events on the nodes in the NodeList.
                 */
                on(eventName: string, listener: EventListener): Handle[];
                /**
                 * Ends use of the current `NodeList` by returning the previous NodeList
                 * that generated the current NodeList.
                 */
                end<U extends Node>(): NodeList<U>;
                /**
                 * Returns a new NodeList, maintaining this one in place
                 */
                slice(begin: number, end?: number): this;
                /**
                 * Returns a new NodeList, manipulating this NodeList based on
                 * the arguments passed, potentially splicing in new elements
                 * at an offset, optionally deleting elements
                 */
                splice(index: number, howmany?: number, ...items: T[]): this;
                /**
                 * see `dojo/_base/array.indexOf()`. The primary difference is that the acted-on
                 * array is implicitly this NodeList
                 */
                indexOf(value: T, fromIndex?: number, findLast?: boolean): number;
                /**
                 * see `dojo/_base/array.lastIndexOf()`. The primary difference is that the
                 * acted-on array is implicitly this NodeList
                 */
                lastIndexOf(value: T, fromIndex?: number): number;
                /**
                 * see `dojo/_base/array.every()` and the [Array.every
                 * docs](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every).
                 * Takes the same structure of arguments and returns as
                 * dojo/_base/array.every() with the caveat that the passed array is
                 * implicitly this NodeList
                 */
                every(callback: (item: T, idx: number, nodeList: this) => boolean | string, thisObj?: Object): boolean;
                /**
                 * Takes the same structure of arguments and returns as
                 * `dojo/_base/array.some()` with the caveat that the passed array as
                 * implicitly this NodeList.  See `dojo/_base/array.some()` and Mozillaas
                 * [Array.soas
                 * documentation](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some).
                 */
                some(callback: (item: T, idx: number, nodeList: this) => boolean | string, thisObj?: Object): boolean;
                /**
                 * Returns a new NodeList comprised of items in this NodeList
                 * as well as items passed in as parameters
                 */
                concat(...items: T[]): this;
                /**
                 * see `dojo/_base/array.map()`. The primary difference is that the acted-on
                 * array is implicitly this NodeList and the return is a
                 * NodeList (a subclass of Array)
                 */
                map<U extends Node>(func: (item: T, idx: number, nodeList: this) => U, obj?: Object): NodeList<U>;
                /**
                 * see `dojo/_base/array.forEach()`. The primary difference is that the acted-on
                 * array is implicitly this NodeList. If you want the option to break out
                 * of the forEach loop, use every() or some() instead.
                 */
                forEach(callback: (item: T, idx: number, nodeList: this) => void, thisObj?: Object): this;
                /**
                 * "masks" the built-in javascript filter() method (supported
                 * in Dojo via `dojo/_base/array.filter`) to support passing a simple
                 * string filter in addition to supporting filtering function
                 * objects.
                 */
                filter<U extends Node>(filter: NodeListFilter<T>, thisObj?: Object): NodeList<U>;
                /**
                 * Create a new instance of a specified class, using the
                 * specified properties and each node in the NodeList as a
                 * srcNodeRef.
                 */
                instantiate(declaredClass: string | Constructor<any>, properties?: Object): this;
                /**
                 * Returns a new NodeList comprised of items in this NodeList
                 * at the given index or indices.
                 */
                at(...indices: number[]): this;
            }
        }
    }
    const _default_15: DojoJS.Query;
    export = _default_15;
}
declare module "dojo/NodeList-dom" {
    import t = require("dojo/query");
    var f: typeof t.NodeList;
    global {
        namespace DojoJS {
            interface NodeList<T extends Node> extends ArrayLike<T> {
                _normalize(e: any, doc: Document): any;
                _cloneNode(e: Node): Node;
                _place(t: Node[], n: Node, r: string, o: boolean): void;
                /**
                 * Gets the position and size of the passed element relative to
                 * the viewport (if includeScroll==false), or relative to the
                 * document root (if includeScroll==true).
                 */
                position(includeScroll?: boolean): ArrayLike<DomGeometryXYBox> | throws<TypeError>;
                /**
                 * Gets or sets an attribute on an HTML element.
                 */
                attr<U extends string>(name: U): ArrayLike<U extends keyof T ? T[U] : unknown>;
                attr(name: 'textContent' | 'textcontent'): ArrayLike<(string | "")>;
                attr<U extends keyof T>(name: U, value: T[U]): this;
                attr<U extends {
                    [K in keyof T]?: T[K];
                }>(name: U): this;
                attr(name: string | Record<string, any>, value?: any): this;
                /**
                 * Gets or sets the style of an HTML element.
                 */
                style(): this;
                style<U extends keyof CSSStyleDeclaration>(name: U): ArrayLike<CSSStyleDeclaration[U]>;
                style(props: Partial<CSSStyleDeclaration>): this;
                style(name: 'opacity', value: number): this;
                style<U extends keyof CSSStyleDeclaration>(name: U, value: CSSStyleDeclaration[U]): this;
                /**
                 * Adds the specified class to every node in the list.
                 * @param className The class to add.
                 * @returns This NodeList instance.
                 */
                addClass(className: string | string[]): this;
                /**
                 * Removes the specified class from every node in the list.
                 * @param className The class to remove.
                 * @returns This NodeList instance.
                 */
                removeClass(className: string | string[]): this;
                /**
                 * Toggles the specified class on every node in the list.
                 * @param className The class to toggle.
                 * @returns This NodeList instance.
                 */
                toggleClass(classStr: string | string[], condition?: boolean): this;
                /**
                 * Replaces the specified class on every node in the list.
                 * @param addClass The class to add.
                 * @param removeClass The class to remove.
                 * @returns This NodeList instance.
                 */
                replaceClass(addClassStr: string | string[], removeClassStr?: string | string[]): this;
                /**
                 * Empties every node in the list.
                 * @returns This NodeList instance.
                 */
                empty(): this;
                /**
                 * Removes the specified attribute from every node in the list.
                 * @param name The attribute to remove.
                 * @returns This NodeList instance.
                 */
                removeAttr(name: string): this;
                /**
                 * returns an object that encodes the width, height, left and top
                 * positions of the node's margin box.
                 */
                getMarginBox(node: Element | string, computedStyle?: CSSStyleDeclaration): ArrayLike<DomGeometryBox>;
                /**
                 * Places every node in the list relative to the first node in the list.
                 * @param position The position to place the nodes.
                 * @returns This NodeList instance.
                 */
                place(position: string): this;
                /**
                 * Removes every node in the list from the DOM.
                 * @returns This NodeList instance.
                 */
                orphan(): this;
                /**
                 * Appends every node in the list to the specified node.
                 * @param node The node to append to.
                 * @param position The position to place the nodes.
                 * @returns This NodeList instance.
                 */
                adopt(node: Node, position?: string): this;
                /**
                 * Filters the list of nodes in the NodeList.
                 * @param filter The filter to apply.
                 * @returns This NodeList instance.
                 */
                filter(filter: string | ((node: T, index: number, array: T[]) => boolean), thisArg?: any): this;
                /**
                 * Adds the specified content to every node in the list.
                 * @param content The content to add.
                 * @param position The position to place the content.
                 * @returns This NodeList instance.
                 */
                addContent(content: string | Node, position?: string): this;
                addContent(content: NodeList<Node>, position?: string): this;
                addContent(content: NodeList<Node>[], position?: string): this;
            }
        }
    }
    export = f;
}
declare module "dojo/_base/NodeList" {
    import "dojo/_base/html";
    import "dojo/NodeList-dom";
    var r: DojoJS.NodeListConstructor;
    global {
        namespace DojoJS {
            interface Dojo {
                NodeList: typeof r;
            }
            interface NodeList<T extends Node> extends ArrayLike<T> {
                connect<K extends keyof DojoJS.AllEvents, M extends keyof DojoJS.Global>(event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never, method: DojoJS.Global extends DojoJS.WithFunc<null, M, [DojoJS.AllEvents[K]]> ? M : never, dontFix?: boolean): this;
                connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<null, DojoJS.ConnectGlobalEventParams<K>>>(event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never, method: M, dontFix?: boolean): this;
                connect<K extends keyof DojoJS.AllEvents, S, M extends keyof any>(...[event, scope, method, dontFix]: [
                    T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never,
                    ...DojoJS.HitchedPair<S, M, [DojoJS.AllEvents[K]]>,
                    boolean?
                ]): this;
                connect<K extends keyof DojoJS.AllEvents, S, M extends DojoJS.BoundFunc<S, [DojoJS.AllEvents[K]]>>(event: T extends DojoJS.ConnectListenerTarget<K> ? (K | `on${K}`) : never, scope: S, method: M, dontFix?: boolean): this;
                connect<U extends string, M extends keyof DojoJS.Global>(event: T extends DojoJS.ConnectMethodTarget<U> ? U : never, method: DojoJS.Global extends DojoJS.WithFunc<null, M, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]> ? M : never, dontFix?: boolean): this;
                connect<U extends string>(event: T extends DojoJS.ConnectMethodTarget<U> ? U : never, method: DojoJS.BoundFunc<null, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]>, dontFix?: boolean): this;
                connect<U extends string, S, M extends keyof any>(...[event, scope, method, dontFix]: [
                    T extends DojoJS.ConnectMethodTarget<U> ? U : never,
                    ...DojoJS.HitchedPair<S, M, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]>,
                    boolean?
                ]): this;
                connect<U extends string, S>(event: T extends DojoJS.ConnectMethodTarget<U> ? U : never, scope: S, method: DojoJS.BoundFunc<S, T extends DojoJS.ConnectMethodTarget<U> ? DojoJS.ConnectMethodParams<T, U> : any[]>, dontFix?: boolean): this;
                coords(includeScroll?: boolean): ArrayLike<{
                    w?: number;
                    h?: number;
                    l?: number;
                    t?: number;
                    x?: number;
                    y?: number;
                }>;
                events: string[];
            }
        }
    }
    export = r;
}
declare module "dojo/io-query" {
    class IoQuery {
        private static t;
        /**
         * takes a name/value mapping object and returns a string representing
         * a URL-encoded version of that object.
         */
        objectToQuery(n: Record<string, any>): string;
        /**
         * Create an object representing a de-serialized query section of a URL.
         */
        queryToObject(t: string): Record<string, any>;
    }
    const _default_16: IoQuery;
    export = _default_16;
}
declare module "dojo/dom-form" {
    class DomForm {
        private static o;
        /**
         * Serialize a form field to a JavaScript object.
         */
        fieldToObject(e: HTMLInputElement | string): any[] | string | null;
        /**
         * Serialize a form node to a JavaScript object.
         */
        toObject(formOrID: HTMLFormElement | string): Record<string, any>;
        /**
         * Returns a URL-encoded string representing the form passed as either a
         * node or string ID identifying the form to serialize
         */
        toQuery(formOrId: HTMLFormElement | string): string;
        /**
         * Create a serialized JSON string from a form node or string
         * ID identifying the form to serialize
         */
        toJson(formOrId: HTMLFormElement | string, prettyPrint?: boolean): string;
    }
    const _default_17: DomForm;
    export = _default_17;
}
declare module "dojo/errors/RequestError" {
    const _default_18: {
        new (message?: string | undefined, options?: ErrorOptions | undefined): Error;
        prototype: Error;
    } & ErrorConstructor;
    export = _default_18;
}
declare module "dojo/request/util" {
    import "exports";
    import Deferred = require("dojo/Deferred");
    class Util {
        private static c;
        private static l;
        private static f;
        deepCopy<T extends Record<string, any>, S extends Record<string, any>>(target: T, source: S): T & S;
        deepCopyArray<T>(t: T[]): T[];
        deepCreate<T extends Record<string, any>, P extends Record<string, any>>(source: T, properties?: P): T & P;
        deferred<T>(response: DojoJS.Response<T>, cancel: (def: Deferred<DojoJS.Response<T>>, response: DojoJS.Response<T>) => void, isValid: (response: DojoJS.Response<T>) => boolean, isReady: (response: DojoJS.Response<T>) => boolean, last?: boolean): DojoJS.RequestDeferred<DojoJS.Response<T>>;
        addCommonMethods<T extends Object>(provider: T, methods: string[]): T;
        parseArgs(url: string, options: DojoJS.BaseOptions, skipData?: boolean): ParsedArgs;
        checkStatus(): boolean;
    }
    interface ParsedArgs {
        url: string;
        options: DojoJS.RequestOptions;
        getHeader(headerName: string): string;
    }
    global {
        namespace DojoJS {
            interface Response<T> extends ParsedArgs {
                xhr?: XMLHttpRequest;
                requestOptions?: DojoJS.BaseOptions & {
                    socketPath?: string;
                    headers?: {
                        [header: string]: string;
                    };
                    agent?: string;
                    pfx?: any;
                    key?: string;
                    passphrase?: string;
                    cert?: any;
                    ca?: any;
                    ciphers?: string;
                    rejectUnauthorized?: boolean;
                    path?: string;
                    auth?: string;
                    username?: string;
                    password?: string;
                    socketOptions?: {
                        timeout: number;
                        noDelay: number;
                        keepAlive: number;
                    };
                };
                clientRequest?: any;
                hasSocket?: boolean;
                clientResponse?: any;
                status?: number;
                text?: string;
                data?: T;
            }
            interface BaseOptions {
                /**
                 * Query parameters to append to the URL.
                 */
                query?: string | {
                    [name: string]: any;
                };
                /**
                 * Data to transfer.  This is ignored for GET and DELETE
                 * requests.
                 */
                data?: string | {
                    [name: string]: any;
                };
                /**
                 * Whether to append a cache-busting parameter to the URL.
                 */
                preventCache?: boolean;
                /**
                 * Milliseconds to wait for the response.  If this time
                 * passes, the then the promise is rejected.
                 */
                timeout?: number;
                /**
                 * How to handle the response from the server.  Default is
                 * 'text'.  Other values are 'json', 'javascript', and 'xml'.
                 */
                handleAs?: string;
            }
            interface MethodOptions {
                /**
                 * The HTTP method to use to make the request.  Must be
                 * uppercase.
                 */
                method?: string;
            }
            interface RequestOptions extends BaseOptions, MethodOptions {
            }
            interface Request {
                /**
                 * Send a request using the default transport for the current platform.
                 */
                <T>(url: string, options?: RequestOptions): Promise<T>;
                /**
                 * Send an HTTP GET request using the default transport for the current platform.
                 */
                get<T>(url: string, options?: BaseOptions): Promise<T>;
                /**
                 * Send an HTTP POST request using the default transport for the current platform.
                 */
                post<T>(url: string, options?: BaseOptions): Promise<T>;
                /**
                 * Send an HTTP PUT request using the default transport for the current platform.
                 */
                put<T>(url: string, options?: BaseOptions): Promise<T>;
                /**
                 * Send an HTTP DELETE request using the default transport for the current platform.
                 */
                del<T>(url: string, options?: BaseOptions): Promise<T>;
            }
        }
    }
    const _default_19: Util;
    export = _default_19;
}
declare module "dojo/errors/RequestTimeoutError" {
    const _default_20: {
        new (message?: string | undefined, options?: ErrorOptions | undefined): Error & {
            dojoType: string;
        };
        prototype: Error & {
            dojoType: string;
        };
    } & {
        new (message?: string | undefined, options?: ErrorOptions | undefined): Error;
        prototype: Error;
    } & ErrorConstructor;
    export = _default_20;
}
declare module "dojo/request/watch" {
    const _default_21: {
        /**
         * Watches the io request represented by dfd to see if it completes.
         */
        <T>(dfd: Promise<T>): void;
        /**
         * Cancels all pending IO requests, regardless of IO type
         */
        cancelAll(): void;
    };
    export = _default_21;
}
declare module "dojo/request/handlers" {
    import "dojo/selector/_loader";
    const _default_22: {
        <T>(response: DojoJS.Response<any>): DojoJS.Response<T>;
        register(name: string, handler: (response: DojoJS.Response<any>) => DojoJS.Response<any>): void;
    };
    export = _default_22;
}
declare module "dojo/request/xhr" {
    global {
        namespace DojoJS {
            namespace request {
                interface XhrBaseOptions extends DojoJS.BaseOptions {
                    /**
                     * Whether to make a synchronous request or not. Default
                     * is `false` (asynchronous).
                     */
                    sync?: boolean;
                    /**
                     * Data to transfer. This is ignored for GET and DELETE
                     * requests.
                     */
                    data?: string | Record<string, any> | FormData;
                    /**
                     * Headers to use for the request.
                     */
                    headers?: {
                        [header: string]: string;
                    };
                    /**
                     * Username to use during the request.
                     */
                    user?: string;
                    /**
                     * Password to use during the request.
                     */
                    password?: string;
                    /**
                     * For cross-site requests, whether to send credentials
                     * or not.
                     */
                    withCredentials?: boolean;
                }
                interface XhrOptions extends XhrBaseOptions, DojoJS.MethodOptions {
                }
                interface Xhr {
                    /**
                     * Sends a request using XMLHttpRequest with the given URL and options.
                     */
                    <T>(url: string, options?: XhrOptions): Promise<T>;
                    /**
                     * Send an HTTP GET request using XMLHttpRequest with the given URL and options.
                     */
                    get<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
                    /**
                     * Send an HTTP POST request using XMLHttpRequest with the given URL and options.
                     */
                    post<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
                    /**
                     * Send an HTTP PUT request using XMLHttpRequest with the given URL and options.
                     */
                    put<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
                    /**
                     * Send an HTTP DELETE request using XMLHttpRequest with the given URL and options.
                     */
                    del<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
                    /**
                     * does the work of portably generating a new XMLHTTPRequest object.
                     */
                    _create(): XMLHttpRequest | /* ActiveXObject */ any;
                }
            }
        }
    }
    const _default_23: DojoJS.request.Xhr;
    export = _default_23;
}
declare module "dojo/_base/xhr" {
    interface IoCallbackArgs {
        /**
         * the original object argument to the IO call.
         */
        args: Record<string, any>;
        /**
         * For XMLHttpRequest calls only, the
         * XMLHttpRequest object that was used for the
         * request.
         */
        xhr: XMLHttpRequest;
        /**
         * The final URL used for the call. Many times it
         * will be different than the original args.url
         * value.
         */
        url: string;
        /**
         * For non-GET requests, the
         * name1=value1&name2=value2 parameters sent up in
         * the request.
         */
        query: string;
        /**
         * The final indicator on how the response will be
         * handled.
         */
        handleAs: string;
        /**
         * For dojo/io/script calls only, the internal
         * script ID used for the request.
         */
        id?: string;
        /**
         * For dojo/io/script calls only, indicates
         * whether the script tag that represents the
         * request can be deleted after callbacks have
         * been called. Used internally to know when
         * cleanup can happen on JSONP-type requests.
         */
        canDelete?: boolean;
        /**
         * For dojo/io/script calls only: holds the JSON
         * response for JSONP-type requests. Used
         * internally to hold on to the JSON responses.
         * You should not need to access it directly --
         * the same object should be passed to the success
         * callbacks directly.
         */
        json?: Record<string, any>;
    }
    interface XhrArgs extends DojoJS.IoArgs {
        /**
         * Acceptable values are: text (default), json, json-comment-optional,
         * json-comment-filtered, javascript, xml. See `dojo/_base/xhr.contentHandlers`
         */
        handleAs?: string;
        /**
         * false is default. Indicates whether the request should
         * be a synchronous (blocking) request.
         */
        sync?: boolean;
        /**
         * Additional HTTP headers to send in the request.
         */
        headers?: Record<string, any>;
        /**
         * false is default. Indicates whether a request should be
         * allowed to fail (and therefore no console error message in
         * the event of a failure)
         */
        failOk?: boolean;
        /**
         * "application/x-www-form-urlencoded" is default. Set to false to
         * prevent a Content-Type header from being sent, or to a string
         * to send a different Content-Type.
         */
        contentType: boolean | string;
    }
    interface ContentHandlers {
        [type: string]: (xhr: {
            responseText?: string;
            responseXML?: string;
        }) => any;
        'text': (xhr: {
            responseText?: string;
        }) => string;
        'json': (xhr: {
            responseText?: string;
        }) => Record<string, any>;
        'json-comment-filtered': (xhr: {
            responseText?: string;
        }) => Record<string, any>;
        'javascript': (xhr: {
            responseText?: string;
        }) => any;
        'xml': (xhr: {
            responseXML?: string;
        }) => Document;
        'json-comment-optional': (xhr: {
            responseText?: string;
        }) => Record<string, any>;
    }
    interface Xhr {
        (method: string, args: XhrArgs, hasBody?: boolean): DojoJS.Deferred<any>;
        /**
         * does the work of portably generating a new XMLHTTPRequest object.
         */
        _xhrObj(): XMLHttpRequest | any;
        /**
         * Serialize a form field to a JavaScript object.
         */
        fieldToObject(inputNode: HTMLElement | string): Record<string, any>;
        /**
         * Serialize a form node to a JavaScript object.
         */
        formToObject(fromNode: HTMLFormElement | string): Record<string, any>;
        /**
         * takes a name/value mapping object and returns a string representing
         * a URL-encoded version of that object.
         */
        objectToQuery(map: Record<string, any>): string;
        /**
         * Returns a URL-encoded string representing the form passed as either a
         * node or string ID identifying the form to serialize
         */
        formToQuery(fromNode: HTMLFormElement | string): string;
        /**
         * Create a serialized JSON string from a form node or string
         * ID identifying the form to serialize
         */
        formToJson(formNode: HTMLFormElement | string): string;
        /**
         * Create an object representing a de-serialized query section of a
         * URL. Query keys with multiple values are returned in an array.
         */
        queryToObject(str: string): Record<string, any>;
        /**
         * A map of available XHR transport handle types. Name matches the
         * `handleAs` attribute passed to XHR calls.
         */
        contentHandlers: ContentHandlers;
        _ioCancelAll(): void;
        /**
         * If dojo.publish is available, publish topics
         * about the start of a request queue and/or the
         * the beginning of request.
         *
         * Used by IO transports. An IO transport should
         * call this method before making the network connection.
         */
        _ioNotifyStart<T>(dfd: DojoJS.Promise<T>): void;
        /**
         * Watches the io request represented by dfd to see if it completes.
         */
        _ioWatch<T>(dfd: DojoJS.Promise<T>, validCheck: Function, ioCheck: Function, resHandle: Function): void;
        /**
         * Adds query params discovered by the io deferred construction to the URL.
         * Only use this for operations which are fundamentally GET-type operations.
         */
        _ioAddQueryToUrl(ioArgs: IoCallbackArgs): void;
        /**
         * sets up the Deferred and ioArgs property on the Deferred so it
         * can be used in an io call.
         */
        _ioSetArgs(args: DojoJS.IoArgs, canceller: Function, okHandler: Function, errHandler: Function): DojoJS.Deferred<any>;
        _isDocumentOk(x: Document): boolean;
        _getText(url: string): string;
        /**
         * Send an HTTP GET request using the default transport for the current platform.
         */
        get<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
        /**
         * Send an HTTP POST request using the default transport for the current platform.
         */
        post<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
        /**
         * Send an HTTP PUT request using the default transport for the current platform.
         */
        put<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
        /**
         * Send an HTTP DELETE request using the default transport for the current platform.
         */
        del<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
    }
    type DojoXhr = Omit<Xhr, 'get' | 'post' | 'put' | 'del'> & {
        _blockAsync: boolean;
        _contentHandlers: Xhr['contentHandlers'];
        xhrDelete: Xhr["del"];
        xhrGet: Xhr["get"];
        xhrPost: Xhr["post"];
        xhrPut: Xhr["put"];
        rawXhrPost: Xhr["post"];
        rawXhrPut: Xhr["put"];
        xhr: Xhr;
    };
    global {
        namespace DojoJS {
            interface Dojo extends DojoXhr {
            }
            interface IoArgs {
                /**
                 * URL to server endpoint.
                 */
                url: string;
                /**
                 * Contains properties with string values. These
                 * properties will be serialized as name1=value2 and
                 * passed in the request.
                 */
                content?: Record<string, any>;
                /**
                 * Milliseconds to wait for the response. If this time
                 * passes, the then error callbacks are called.
                 */
                timeout?: number;
                /**
                 * DOM node for a form. Used to extract the form values
                 * and send to the server.
                 */
                form?: HTMLFormElement;
                /**
                 * Default is false. If true, then a
                 * "dojo.preventCache" parameter is sent in the requesa
                 * with a value that changes with each requesa
                 * (timestamp). Useful only with GET-type requests.
                 */
                preventCache?: boolean;
                /**
                 * Acceptable values depend on the type of IO
                 * transport (see specific IO calls for more information).
                 */
                handleAs?: string;
                /**
                 * Sets the raw body for an HTTP request. If this is used, then the content
                 * property is ignored. This is mostly useful for HTTP methods that have
                 * a body to their requests, like PUT or POST. This property can be used instead
                 * of postData and putData for dojo/_base/xhr.rawXhrPost and dojo/_base/xhr.rawXhrPut respectively.
                 */
                rawBody?: string;
                /**
                 * Set this explicitly to false to prevent publishing of topics related to
                 * IO operations. Otherwise, if djConfig.ioPublish is set to true, topics
                 * will be published via dojo/topic.publish() for different phases of an IO operation.
                 * See dojo/main.__IoPublish for a list of topics that are published.
                 */
                ioPublish?: boolean;
                /**
                 * This function will be
                 * called on a successful HTTP response code.
                 */
                load?: (response: any, ioArgs: IoCallbackArgs) => void;
                /**
                 * This function will
                 * be called when the request fails due to a network or server error, the url
                 * is invalid, etc. It will also be called if the load or handle callback throws an
                 * exception, unless djConfig.debugAtAllCosts is true.	 This allows deployed applications
                 * to continue to run even when a logic error happens in the callback, while making
                 * it easier to troubleshoot while in debug mode.
                 */
                error?: (response: any, ioArgs: IoCallbackArgs) => void;
                /**
                 * This function will
                 * be called at the end of every request, whether or not an error occurs.
                 */
                handle?: (loadOrError: string, response: any, ioArgs: IoCallbackArgs) => void;
            }
        }
    }
    const _default_24: Xhr;
    export = _default_24;
}
declare module "dojo/_base/fx" {
    import Evented = require("dojo/Evented");
    var fx: DojoJS.Fx;
    interface Line {
        /**
         * Returns the point on the line
         * @param {number} n a floating point number greater than 0 and less than 1
         */
        getValue(n: number): number;
    }
    /**
     * Object used to generate values from a start value to an end value
     */
    interface LineConstructor {
        new (start: number, end: number): Line;
    }
    interface EasingFunction {
        (n: number): number;
    }
    /**
     * A generic animation class that fires callbacks into its handlers
     * object at various states.
     */
    interface AnimationConstructor {
        new (args: any): DojoJS.Animation;
        prototype: DojoJS.Animation;
    }
    interface AnimationCallback {
        (node: HTMLElement): void;
    }
    interface FadeArguments {
        node: HTMLElement | string;
        duration?: number;
        easing?: EasingFunction;
        start?: Function;
        end?: Function;
        delay?: number;
    }
    interface AnimationArgumentsProperties extends Partial<AnimationArguments> {
        [name: string]: any;
    }
    interface AnimationArguments extends FadeArguments {
        properties?: AnimationArgumentsProperties;
        onEnd?: AnimationCallback;
        onAnimate?: AnimationCallback;
    }
    global {
        namespace DojoJS {
            interface Dojo extends Fx {
                _Animation: AnimationConstructor;
            }
            interface Fx {
                _Line: LineConstructor;
                Animation: AnimationConstructor;
                _fade(args: any): DojoJS.Animation;
                /**
                 * Returns an animation that will fade node defined in 'args' from
                 * its current opacity to fully opaque.
                 */
                fadeIn(args: AnimationArguments): DojoJS.Animation;
                /**
                 * Returns an animation that will fade node defined in 'args'
                 * from its current opacity to fully transparent.
                 */
                fadeOut(args: AnimationArguments): DojoJS.Animation;
                _defaultEasing(n?: number): number;
                /**
                 * Returns an animation that will transition the properties of
                 * node defined in `args` depending how they are defined in
                 * `args.properties`
                 */
                animateProperty(args: AnimationArguments): DojoJS.Animation;
                /**
                 * A simpler interface to `animateProperty()`, also returns
                 * an instance of `Animation` but begins the animation
                 * immediately, unlike nearly every other Dojo animation API.
                 */
                anim(node: HTMLElement | string, properties: {
                    [name: string]: any;
                }, duration?: number, easing?: Function, onEnd?: AnimationCallback, delay?: number): DojoJS.Animation;
                /**
                 * Chain a list of `dojo/_base/fx.Animation`s to run in sequence
                 */
                chain(animations: DojoJS.Animation[]): DojoJS.Animation;
                chain(...animations: DojoJS.Animation[]): DojoJS.Animation;
                /**
                 * Combine a list of `dojo/_base/fx.Animation`s to run in parallel
                 */
                combine(animations: DojoJS.Animation[]): DojoJS.Animation;
                combine(...animations: DojoJS.Animation[]): DojoJS.Animation;
                /**
                 * Expand a node to it's natural height.
                 */
                wipeIn(args: AnimationArguments): DojoJS.Animation;
                /**
                 * Shrink a node to nothing and hide it.
                 */
                wipeOut(args: AnimationArguments): DojoJS.Animation;
                /**
                 * Slide a node to a new top/left position
                 */
                slideTo(args: AnimationArguments & {
                    left?: number | string;
                    top?: number | string;
                }): DojoJS.Animation;
            }
            interface Animation extends Evented {
                /**
                 * The time in milliseconds the animation will take to run
                 */
                duration: number;
                /**
                 * A two element array of start and end values, or a `_Line` instance to be
                 * used in the Animation.
                 */
                curve: Line | [number, number];
                /**
                 * A Function to adjust the acceleration (or deceleration) of the progress
                 * across a _Line
                 */
                easing?: EasingFunction;
                /**
                 * The number of times to loop the animation
                 */
                repeat: number;
                /**
                 * the time in milliseconds to wait before advancing to next frame
                 * (used as a fps timer: 1000/rate = fps)
                 */
                rate: number;
                /**
                 * The time in milliseconds to wait before starting animation after it
                 * has been .play()'ed
                 */
                delay?: number;
                /**
                 * Synthetic event fired before a Animation begins playing (synchronous)
                 */
                beforeBegin: Event;
                /**
                 * Synthetic event fired as a Animation begins playing (useful?)
                 */
                onBegin: Event;
                /**
                 * Synthetic event fired at each interval of the Animation
                 */
                onAnimate: Event;
                /**
                 * Synthetic event fired after the final frame of the Animation
                 */
                onEnd: Event;
                /**
                 * Synthetic event fired any time the Animation is play()'ed
                 */
                onPlay: Event;
                /**
                 * Synthetic event fired when the Animation is paused
                 */
                onPause: Event;
                /**
                 * Synthetic event fires when the Animation is stopped
                 */
                onStop: Event;
                _precent: number;
                _startRepeatCount: number;
                _getStep(): number;
                /**
                 * Convenience function.  Fire event "evt" and pass it the
                 * arguments specified in "args".
                 */
                _fire(evt: Event, args?: any[]): this;
                /**
                 * Start the animation.
                 */
                play(delay?: number, gotoStart?: boolean): this;
                _play(gotoStart?: boolean): this;
                /**
                 * Pauses a running animation.
                 */
                pause(): this;
                /**
                 * Sets the progress of the animation.
                 */
                gotoPercent(precent: number, andPlay?: boolean): this;
                /**
                 * Stops a running animation.
                 */
                stop(gotoEnd?: boolean): DojoJS.Animation;
                /**
                 * cleanup the animation
                 */
                destroy(): void;
                /**
                 * Returns a string token representation of the status of
                 * the animation, one of: "paused", "playing", "stopped"
                 */
                status(): string;
                _cycle(): DojoJS.Animation;
                _clearTimer(): void;
                _startTimer(): void;
                _stopTimer(): void;
            }
        }
    }
    export = fx;
}
declare module "dojo/_base/browser" {
    import ready = require("dojo/ready");
    import "dojo/_base/kernel";
    import "dojo/_base/connect";
    import "dojo/_base/unload";
    import "dojo/_base/window";
    import "dojo/_base/event";
    import "dojo/_base/html";
    import "dojo/_base/NodeList";
    import "dojo/query";
    import "dojo/_base/xhr";
    import "dojo/_base/fx";
    global {
        namespace DojoJS {
            interface Has {
                (name: "config-selectorEngine"): "acme";
            }
        }
    }
    export = ready;
}
declare module "dojo/_base/loader" {
    import dojo = require("dojo/_base/kernel");
    global {
        namespace DojoJS {
            interface Dojo {
                provide(moduleName: string): any;
                require(e: string, t?: boolean): any;
                loadInit(e: () => void): void;
                registerModulePath(path: string, obj: any): void;
                platformRequire(e: {
                    common?: string[];
                    [dojo._name]?: string[];
                    default?: string[];
                }): void;
                requireIf(condition: boolean, mid: string, require: any): void;
                requireAfterIf(condition: boolean, mid: string, require: any): void;
                requireLocalization(moduleName: string, bundleName: string, locale?: string): any;
            }
        }
    }
    const _default_25: {
        extractLegacyApiApplications(text: string, noCommentText?: string): any;
        require(mid: string, require: any, loaded: (...modules: any[]) => void): void;
        loadInit(mid: string, require: any, loaded: (...modules: any[]) => void): void;
    };
    export = _default_25;
}
declare module "dojo/main" {
    import config = require("dojo/_base/config");
    import "dojo/_base/declare";
    import "dojo/_base/connect";
    import "dojo/_base/Deferred";
    import "dojo/_base/json";
    import "dojo/_base/Color";
    import "dojo/_base/browser";
    import "dojo/_base/loader";
    export = config;
}
declare module "dojo/_base/url" {
    var n: UrlConstructor;
    interface Url {
        uri: string;
        scheme: string;
        authority: string;
        path: string;
        query: string;
        fragment: string;
        user?: string;
        password?: string;
        host?: string;
        port?: string;
        toString(): string;
    }
    interface UrlConstructor {
        new (...args: any[]): Url;
        prototype: Url;
    }
    global {
        namespace DojoJS {
            interface Dojo {
                _Url: typeof n;
            }
        }
    }
    export = n;
}
declare module "dojo/promise/all" {
    type Promise<T> = typeof import("dojo/promise/Promise")<T>;
    /**
     * Takes multiple promises and returns a new promise that is fulfilled
     * when all promises have been resolved or one has been rejected.
     * @param objectOrArray The promise will be fulfilled with a list of results if invoked with an
     * 						array, or an object of results when passed an object (using the same
     * 						keys). If passed neither an object or array it is resolved with an
     * 						undefined value.
     */
    function all<T>(array: DojoJS.Thenable<T>[]): Promise<T[]>;
    function all<T>(object: {
        [name: string]: DojoJS.Thenable<T>;
    }): Promise<{
        [name: string]: T;
    }>;
    function all(array: DojoJS.Thenable<any>[]): Promise<any[]>;
    function all(object: {
        [name: string]: DojoJS.Thenable<any>;
    }): Promise<{
        [name: string]: any;
    }>;
    export = all;
}
declare module "dojo/date/stamp" {
    var stamp: Stamp;
    interface StampFormatOptions {
        /**
         * "date" or "time" for partial formatting of the Date object.
         * Both date and time will be formatted by default.
         */
        selector?: 'time' | 'date';
        /**
         * if true, UTC/GMT is used for a timezone
         */
        zulu?: boolean;
        /**
         * if true, output milliseconds
         */
        milliseconds?: boolean;
    }
    interface Stamp {
        /**
         * Returns a Date object given a string formatted according to a subset of the ISO-8601 standard.
         */
        fromISOString(formattedString: string, defaultTime?: number): Date;
        /**
         * Format a Date object as a string according a subset of the ISO-8601 standard
         */
        toISOString(dateObject: Date, options?: StampFormatOptions): string;
    }
    global {
        namespace DojoJS {
            interface DojoDate {
                stamp: typeof stamp;
            }
            interface Dojo {
                date: DojoDate;
            }
        }
    }
    export = stamp;
}
declare module "dojo/parser" {
    var parser: DojoJS.Parser;
    global {
        namespace DojoJS {
            interface ParserOptions {
            }
            interface ParserObjects {
                ctor?: Constructor<any>;
                types?: string[];
                node: Node;
                scripts?: HTMLScriptElement[];
                inherited?: {
                    [prop: string]: any;
                };
            }
            interface InstancesArray extends Array<any>, Promise<any> {
            }
            interface Parser {
                /**
                 * Clear cached data.   Used mainly for benchmarking.
                 */
                _clearCache(): void;
                /**
                 * Convert a `<script type="dojo/method" args="a, b, c"> ... </script>`
                 * into a function
                 */
                _functionFromScript(node: HTMLScriptElement, attrData: string): Function;
                /**
                 * Takes array of nodes, and turns them into class instances and
                 * potentially calls a startup method to allow them to connect with
                 * any children.
                 */
                instantiate(nodes: Node[], mixin?: Object, options?: ParserOptions): any[];
                /**
                 * Takes array of objects representing nodes, and turns them into class instances and
                 * potentially calls a startup method to allow them to connect with
                 * any children.
                 */
                _instantiate(nodes: ParserObjects[], mixin?: Object, options?: ParserOptions, returnPromise?: boolean): any[] | Promise<any[]>;
                /**
                 * Calls new ctor(params, node), where params is the hash of parameters specified on the node,
                 * excluding data-dojo-type and data-dojo-mixins.   Does not call startup().
                 */
                construct<T>(ctor: Constructor<T>, node: Node, mixin?: Object, options?: ParserOptions, scripts?: HTMLScriptElement[], inherited?: {
                    [prop: string]: any;
                }): Promise<T> | T;
                /**
                 * Scan a DOM tree and return an array of objects representing the DOMNodes
                 * that need to be turned into widgets.
                 */
                scan(root?: Node, options?: ParserOptions): Promise<ParserObjects[]>;
                /**
                 * Helper for _scanAMD().  Takes a `<script type=dojo/require>bar: "acme/bar", ...</script>` node,
                 * calls require() to load the specified modules and (asynchronously) assign them to the specified global
                 * variables, and returns a Promise for when that operation completes.
                 *
                 * In the example above, it is effectively doing a require(["acme/bar", ...], function(a){ bar = a; }).
                 */
                _require(script: HTMLScriptElement, options: ParserOptions): Promise<any>;
                /**
                 * Scans the DOM for any declarative requires and returns their values.
                 */
                _scanAmd(root?: Node, options?: ParserOptions): Promise<boolean>;
                /**
                 * Scan the DOM for class instances, and instantiate them.
                 */
                parse(rootNode?: Node, options?: ParserOptions): InstancesArray;
            }
            interface Dojo {
                parser: Parser;
            }
        }
    }
    export = parser;
}
declare var jstpl_token: string;
declare var eventMethod: string;
declare var eventer: {
    <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
} & typeof addEventListener;
declare var messageEvent: string;
/**
 * The global jQuery-like selector function included in all BGA pages, used to resolve an id to an element if not already an element.
 *
 * This is an alias for {@link DojoJS.byId}.
 * ```js
 * return ("string" == typeof idOrElement ? (n || document).getElementById(idOrElement) : idOrElement) || null
 * ```
 *
 * Usage of this function can cause some issues with type safety. Commonly:
 * ```ts
 * $('myElement').parent; // Error! $ may return null
 * ```
 * - With the typescript config 'strictNullChecks' enabled, the result of this function must be checked for null before using it. Fix by:
 * 	- Adding `strictNullChecks: false` to the compiler options in the tsconfig.json file. OR
 * 	- Redeclaring the function: `declare function $<E extends Element>(id: string | E): E;`
 * ```ts
 * $('myElement')?.style; // Error! `Element` does not have a `style` property
 * ```
 * - Without giving the template parameter, the result of this function will be typed as `Element` which means that common properties of HTMLElements will not be available. Fix by redeclaring the function:
 * 	- `declare function $(id: string | HTMLElement): HTMLElement;` OR
 * 	- `declare function $<E extends HTMLElement>(id: string | E): E;`
 * @template E The type of the element expected to be returned. Note that there are no runtime checks on this type.
 * @param id The id of the element to get.
 * @returns The element with the given id, or null if no element is found.
 * @example
 * // Get the element with the id 'myElement'
 * const element: Element = $('myElement');
 * $('myElement')?.style.display = 'none';
*/
declare var $: typeof dojo.byId;
/**
 * The js template html for creating an action button.
 */
declare var jstpl_action_button: string;
/**
 * The js template html for creating a score entry. See {@link jstpl_score_entry_specific} for overriding this template.
 */
declare var jstpl_score_entry: string;
/**
 * The images that should be preloaded when the page loads.
 */
declare var g_img_preload: string[];
/**
 * The non-game specific theme url. This should be used just like {@link g_gamethemeurl} but for assets that are not specific to the game, that is shared assets.
 * @example
 * const image = "<img class='imgtext' src='" + g_themeurl + "img/layout/help_click.png' alt='action' /> <span class='tooltiptext'>" + text + "</span>""
 */
declare var g_themeurl: string;
/**
 * The url to the game source folder. This should be used for loading images and sounds.
 * @example
 * // Player hand
 * this.playerHand = new ebg.stock();
 * this.playerHand.create( this, $('myhand'), this.cardwidth, this.cardheight );
 * // Create cards types:
 * for (var color = 1; color <= 4; color++) {
 * 	for (var value = 2; value <= 14; value++) {
 * 		// Build card type id
 * 		var card_type_id = this.getCardUniqueId(color, value);
 * 		this.playerHand.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/cards.jpg', card_type_id);
 * 	}
 * }
 */
declare var g_gamethemeurl: string;
/** Defined as null after loading the page. This seems to have no use and is likely misspelled version of {@link gameui}. */
declare var gamegui: null;
/** Global counter for tracking the uid for the msg that are dispatched. */
declare var g_last_msg_dispatched_uid: BGA.ID | HexString;
/** The static assets for the current page. This is only used with {@link getStateAssetUrl} to help load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file). */
declare var g_staticassets: {
    file: string;
    version: string;
}[];
/** The dojo handle used for catching errors when loading modules. */
declare var handle: DojoJS.Handle;
/** The global game object that is currently running. */
declare var gameui: InstanceType<BGA.Gamegui>;
/** The global translation module. For usage, the aliases {@line _} and {@link __} should normally be used instead. */
declare var g_i18n: InstanceType<BGA.I18n>;
/** The global {@link SoundManager} for the game. */
declare var soundManager: InstanceType<BGA.SoundManager>;
/** True if the game is in archive mode after the game (the game has ended). */
declare var g_archive_mode: boolean;
/**
 * The replay number in live game. It is set to undefined (i.e. not set) when it is not a replay mode, so the good check is `typeof g_replayFrom != 'undefined'` which returns true if the game is in replay mode during the game (the game is ongoing but the user clicked "reply from this move" in the log).
 * This is never declared when the game is not in replay mode.
 */
declare var g_replayFrom: number | undefined;
/**
 * An object if the game is in tutorial mode, or undefined otherwise. Tutorial mode is a special case of archive mode where comments have been added to a previous game to teach new players the rules.
 * This is never declared when the game tutorials are not loaded/active/existing.
 */
declare var g_tutorialwritten: {
    author: string;
    id: number;
    mode: string;
    status: string;
    version_override: string | null;
    viewer_id: string;
    top_game: boolean;
    old_game: boolean;
    stats: {
        viewed: BGA.ID;
        recentviewed: BGA.ID;
        rating: number;
        duration: null | BGA.ID;
        rating5: string;
        rating4: string;
        rating3: string;
        rating2: string;
        rating1: string;
        steps: Record<BGA.ID, number>;
    };
} | undefined;
declare var gotourl: (relative_url: string) => void | undefined;
/**
 * A record of all game specific classes. Usually, this will only only be defined when on a game page, and the record will only contain one entry for the current game.
 *
 * This value should be updated by game specific code by using one of the following expressions:
 * ```js
 * // Using BGA style dojo.declare:
 * declare("bgagame.___yourgamename___", [Gamegui, ___YourGameName___]);
 * // Using Dojo with Typescript extended class:
 * dojo.setObject( "bgagame.___yourgamename___", ___YourGameName___ );
 * // Manually with Typescript extended class (less abstracted, but possibly less clear)
 * (window.bgagame ??= {}).___yourgamename___ = ___YourGameName___;
 * ```
 */
declare var bgagame: Record<string, BGA.Gamegui> | undefined;
declare var head_errmsg: string;
declare var head_infomsg: string;
declare var jstpl_audiosrc: string;
declare function publishFBReady(): void;
declare var saveHashForLater: string;
declare function publishGPOReady(): void;
declare var ___gcfg: {
    lang: string;
    parsetags: string;
};
declare var onGoogleLibraryLoad: () => void;
declare module "dijit/main" {
    const _default_26: DojoJS.Dijit;
    export = _default_26;
}
declare module "dijit/BackgroundIframe" {
    global {
        namespace DojoJS {
            interface Dijit {
                BackgroundIframe: Constructor<{
                    pop: (...args: any[]) => any;
                    push: (...args: any[]) => any;
                    resize: (...args: any[]) => any;
                    destroy: () => void;
                }>;
            }
        }
    }
    const _default_27: Constructor<{
        pop: (...args: any[]) => any;
        push: (...args: any[]) => any;
        resize: (...args: any[]) => any;
        destroy: () => void;
    }>;
    export = _default_27;
}
declare namespace DijitJS {
    interface Dijit {
    }
    interface WatchHandle extends DojoJS.Handle {
        unwatch(): void;
    }
    type Stateful = DojoJS.Dojo["Stateful"];
    interface _WidgetBase extends Stateful, Destroyable {
        dojoAttachEvent: string;
        dojoAttachPoint: string;
    }
    interface _AttachMixin {
        /**
         * List of widget attribute names associated with data-dojo-attach-point=... in the template, ex: ["containerNode", "labelNode"]
         */
        _attachPoints: string[];
        /**
         * List of connections associated with data-dojo-attach-event=... in the template
         */
        _attachEvents: DojoJS.Handle[];
        /**
         * Object to which attach points and events will be scoped.  Defaults to 'this'.
         */
        attachScope: any;
        /**
         * Search descendants of this.containerNode for data-dojo-attach-point and data-dojo-attach-event.
         *
         * Should generally be left false (the default value) both for performance and to avoid failures when this.containerNode holds other _AttachMixin instances with their own attach points and events.
         */
        searchContainerNode: boolean;
        /**
         * Attach to DOM nodes marked with special attributes.
         */
        buildRendering(): void;
        /**
         * hook for _WidgetsInTemplateMixin
         */
        _beforeFillContent(): void;
        /**
         * Iterate through the dom nodes and attach functions and nodes accordingly.
         *
         * Map widget properties and functions to the handlers specified in the dom node and it's descendants. This function iterates over all nodes and looks for these properties:
         * - dojoAttachPoint/data-dojo-attach-point
         * - dojoAttachEvent/data-dojo-attach-event
         */
        _attachTemplateNodes(rootNode: Element | Node): void;
        /**
         * Process data-dojo-attach-point and data-dojo-attach-event for given node or widget.
         *
         * Returns true if caller should process baseNode's children too.
         */
        _processTemplateNode<T extends (Element | Node | _WidgetBase)>(baseNode: T, getAttrFunc: (baseNode: T, attr: string) => string, attachFunc: (node: T, type: string, func?: Function) => DojoJS.Handle): boolean;
        /**
         * Roughly corresponding to dojo/on, this is the default function for processing a data-dojo-attach-event.  Meant to attach to DOMNodes, not to widgets.
         */
        _attach(node: Element | Node, type: string, func?: Function): DojoJS.Handle;
        /**
         * Detach and clean up the attachments made in _attachtempalteNodes.
         */
        _detachTemplateNodes(): void;
        destroyRendering(preserveDom?: boolean): void;
    }
    interface _AttachMixinConstructor extends DojoJS.DojoClass<_AttachMixin> {
    }
    interface _WidgetBase extends InstanceType<typeof dojo.Stateful>, Destroyable {
        /**
         * Gets the right direction of text.
         */
        getTextDir(text: string): string;
        /**
         * Set element.dir according to this.textDir, assuming this.textDir has a value.
         */
        applyTextDir(element: HTMLElement, text?: string): void;
        /**
         * Wraps by UCC (Unicode control characters) option's text according to this.textDir
         */
        enforceTextDirWithUcc(option: HTMLOptionElement, text: string): string;
        /**
         * Restores the text of origObj, if needed, after enforceTextDirWithUcc, e.g. set("textDir", textDir).
         */
        restoreOriginalText(origObj: HTMLOptionElement): HTMLOptionElement;
    }
    interface _ConfirmDialogMixin extends _WidgetsInTemplateMixin {
        /**
         * HTML snippet for action bar, overrides _DialogMixin.actionBarTemplate
         */
        actionBarTemplate: string;
        /**
         * Label of OK button.
         */
        buttonOk: string;
        /**
         * Label of cancel button.
         */
        buttonCancel: string;
    }
    interface _Contained {
        /**
         * Returns the previous child of the parent or null if this is the
         * first child of the parent.
         */
        getPreviousSibling<T extends _WidgetBase>(): T;
        /**
         * Returns the next child of the parent or null if this is the last
         * child of the parent.
         */
        getNextSibling<T extends _WidgetBase>(): T;
        /**
         * Returns the index of this widget within its container parent.
         * It returns -1 if the parent does not exist or if the parent is
         * not a dijit/_Container.
         */
        getIndexInParent(): number;
    }
    interface _ContainedConstructor extends DojoJS.DojoClass<_Contained> {
    }
    interface _Container {
        buildRendering(): void;
        /**
         * Makes the given widget a child of this widget.
         */
        addChild<T extends _WidgetBase>(widget: T, insertIndex?: number): void;
        /**
         * Removes the passed widget instance from this widget but does
         * not destroy it.  You can also pass in an integer indicating
         * the index within the container to remove (ie, removeChild(5) removes the sixth widget)
         */
        removeChild<T extends _WidgetBase>(widget: T): void;
        removeChild<T extends number>(widget: number): void;
        /**
         * Returns true if widget has child widgets, i.e. if this.containerNode contains widgets.
         */
        hasChildren(): boolean;
        /**
         * Gets the index of the child in this container or -1 if not found
         */
        getIndexOfChild<T extends _WidgetBase>(widget: T): number;
    }
    interface _ContainerConstructor extends DojoJS.DojoClass<_Container> {
    }
    interface CSSStateNodes {
        [node: string]: string;
    }
    interface _CssStateMixin {
        /**
         * True if cursor is over this widget
         */
        hovering: boolean;
        /**
         * True if mouse was pressed while over this widget, and hasn't been released yet
         */
        active: boolean;
    }
    interface _CssStateMixinConstructor extends DojoJS.DojoClass<_CssStateMixin> {
    }
    interface _DialogMixin {
        /**
         * HTML snippet to show the action bar (gray bar with OK/cancel buttons).
         * Blank by default, but used by ConfirmDialog/ConfirmTooltipDialog subclasses.
         */
        actionBarTemplate: string;
        /**
         * Callback when the user hits the submit button.
         * Override this method to handle Dialog execution.
         */
        execute(formContents?: any): void;
        /**
         * Called when user has pressed the Dialog's cancel button, to notify container.
         */
        onCancel(): void;
        /**
         * Called when user has pressed the dialog's OK button, to notify container.
         */
        onExecute(): void;
    }
    interface _FocusMixin {
    }
    interface _WidgetBase extends InstanceType<typeof dojo.Stateful>, Destroyable {
        /**
         * Called when the widget becomes "active" because
         * it or a widget inside of it either has focus, or has recently
         * been clicked.
         */
        onFocus(): void;
        /**
         * Called when the widget stops being "active" because
         * focus moved to something outside of it, or the user
         * clicked somewhere outside of it, or the widget was
         * hidden.
         */
        onBlur(): void;
    }
    interface _HasDropDown<T extends _WidgetBase> extends _FocusMixin {
        /**
         * The button/icon/node to click to display the drop down.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then either focusNode or domNode (if focusNode is also missing) will be used.
         */
        _buttonNode: HTMLElement;
        /**
         * Will set CSS class dijitUpArrow, dijitDownArrow, dijitRightArrow etc. on this node depending
         * on where the drop down is set to be positioned.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then _buttonNode will be used.
         */
        _arrowWrapperNode: HTMLElement;
        /**
         * The node to set the aria-expanded class on.
         * Also sets popupActive class but that will be removed in 2.0.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then focusNode or _buttonNode (if focusNode is missing) will be used.
         */
        _popupStateNode: HTMLElement;
        /**
         * The node to display the popup around.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then domNode will be used.
         */
        _aroundNode: HTMLElement;
        /**
         * The widget to display as a popup.  This widget *must* be
         * defined before the startup function is called.
         */
        dropDown: T;
        /**
         * Set to true to make the drop down at least as wide as this
         * widget.  Set to false if the drop down should just be its
         * default width.
         */
        autoWidth: boolean;
        /**
         * Set to true to make the drop down exactly as wide as this
         * widget.  Overrides autoWidth.
         */
        forceWidth: boolean;
        /**
         * The max height for our dropdown.
         * Any dropdown taller than this will have scrollbars.
         * Set to 0 for no max height, or -1 to limit height to available space in viewport
         */
        maxHeight: number;
        /**
         * This variable controls the position of the drop down.
         * It's an array of strings
         */
        dropDownPosition: ('before' | 'after' | 'above' | 'below')[];
        /**
         * When set to false, the click events will not be stopped, in
         * case you want to use them in your subclass
         */
        _stopClickEvents: boolean;
        /**
         * Callback when the user mousedown/touchstart on the arrow icon.
         */
        _onDropDownMouseDown(e: MouseEvent): void;
        /**
         * Callback on mouseup/touchend after mousedown/touchstart on the arrow icon.
         * Note that this function is called regardless of what node the event occurred on (but only after
         * a mousedown/touchstart on the arrow).
         */
        _onDropDownMouseUp(e?: MouseEvent): void;
        /**
         * The drop down was already opened on mousedown/keydown; just need to stop the event
         */
        _onDropDownClick(e: MouseEvent): void;
        buildRendering(): void;
        postCreate(): void;
        destroy(preserveDom?: boolean): void;
        /**
         * Returns true if the dropdown exists and it's data is loaded.  This can
         * be overridden in order to force a call to loadDropDown().
         */
        isLoaded(): boolean;
        /**
         * Creates the drop down if it doesn't exist, loads the data
         * if there's an href and it hasn't been loaded yet, and then calls
         * the given callback.
         */
        loadDropDown(loadCallback: () => void): void;
        /**
         * Creates the drop down if it doesn't exist, loads the data
         * if there's an href and it hasn't been loaded yet, and
         * then opens the drop down.  This is basically a callback when the
         * user presses the down arrow button to open the drop down.
         */
        loadAndOpenDropDown(): DojoJS.Deferred<T>;
        /**
         * Callback when the user presses the down arrow button or presses
         * the down arrow key to open/close the drop down.
         * Toggle the drop-down widget; if it is up, close it, if not, open it
         */
        toggleDropDown(): void;
        /**
         * Opens the dropdown for this widget.   To be called only when this.dropDown
         * has been created and is ready to display (ie, it's data is loaded).
         */
        openDropDown(): PlaceLocation;
        /**
         * Closes the drop down on this widget
         */
        closeDropDown(focus?: boolean): void;
    }
    interface _OnDijitClickMixin {
        /**
         * override _WidgetBase.connect() to make this.connect(node, "ondijitclick", ...) work
         */
        connect(obj: any, event: string | DojoJS.ExtensionEvent, method: string | EventListener): WatchHandle;
    }
    interface _OnDijitClickMixinConstructor {
        /**
         * Deprecated.   New code should access the dijit/a11yclick event directly, ex:
         * |	this.own(on(node, a11yclick, function(){ ... }));
         *
         * Mixing in this class will make _WidgetBase.connect(node, "ondijitclick", ...) work.
         * It also used to be necessary to make templates with ondijitclick work, but now you can just require
         * dijit/a11yclick.
         */
        new (): _OnDijitClickMixin;
        a11yclick: A11yClick;
    }
    interface _TemplatedMixin extends _AttachMixin {
        /**
         * A string that represents the widget template.
         * Use in conjunction with dojo.cache() to load from a file.
         */
        templateString: string;
        /**
         * Path to template (HTML file) for this widget relative to dojo.baseUrl.
         * Deprecated: use templateString with require([... "dojo/text!..."], ...) instead
         */
        templatePath: string;
        /**
         * Set _AttachMixin.searchContainerNode to true for back-compat for widgets that have data-dojo-attach-point's
         * and events inside this.containerNode.   Remove for 2.0.
         */
        searchContainerNode: boolean;
        /**
         * Construct the UI for this widget from a template, setting this.domNode.
         */
        buildRendering(): void;
    }
    interface _TemplatedMixinConstructor extends _WidgetBaseConstructor<_TemplatedMixin> {
        /**
         * Static method to get a template based on the templatePath or
         * templateString key
         */
        getCachedTemplate(templateString: string, alwaysUseString: string, doc?: Document): string | HTMLElement;
    }
    interface _Widget extends _WidgetBase, _OnDijitClickMixin, _FocusMixin {
        /**
         * Connect to this function to receive notifications of mouse click events.
         */
        onClick(event: Event): void;
        /**
         * Connect to this function to receive notifications of mouse double click events.
         */
        onDblClick(event: Event): void;
        /**
         * Connect to this function to receive notifications of keys being pressed down.
         */
        onKeyDown(event: Event): void;
        /**
         * Connect to this function to receive notifications of printable keys being typed.
         */
        onKeyPress(event: Event): void;
        /**
         * Connect to this function to receive notifications of keys being released.
         */
        onKeyUp(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse button is pressed down.
         */
        onMouseDown(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves over nodes contained within this widget.
         */
        onMouseMove(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves off of nodes contained within this widget.
         */
        onMouseOut(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves onto nodes contained within this widget.
         */
        onMouseOver(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves off of this widget.
         */
        onMouseLeave(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves onto this widget.
         */
        onMouseEnter(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse button is released.
         */
        onMouseUp(event: Event): void;
        postCreate(): void;
        /**
         * Deprecated.  Use set() instead.
         */
        setAttribute(attr: string, value: any): void;
        /**
         * This method is deprecated, use get() or set() directly.
         */
        attr(name: string | {
            [attr: string]: any;
        }, value?: any): any;
        /**
         * Returns all the widgets contained by this, i.e., all widgets underneath this.containerNode.
         */
        getDescendants(): _Widget[];
        /**
         * Called when this widget becomes the selected pane in a
         * `dijit/layout/TabContainer`, `dijit/layout/StackContainer`,
         * `dijit/layout/AccordionContainer`, etc.
         *
         * Also called to indicate display of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
         */
        onShow: () => void;
        /**
         * Called when another widget becomes the selected pane in a
         * `dijit/layout/TabContainer`, `dijit/layout/StackContainer`,
         * `dijit/layout/AccordionContainer`, etc.
         *
         * Also called to indicate hide of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
         */
        onHide: () => void;
        /**
         * Called when this widget is being displayed as a popup (ex: a Calendar popped
         * up from a DateTextBox), and it is hidden.
         * This is called from the dijit.popup code, and should not be called directly.
         *
         * Also used as a parameter for children of `dijit/layout/StackContainer` or subclasses.
         * Callback if a user tries to close the child.   Child will be closed if this function returns true.
         */
        onClose: () => boolean;
    }
    interface _WidgetBase extends InstanceType<typeof dojo.Stateful>, Destroyable {
        /**
         * A unique, opaque ID string that can be assigned by users or by the
         * system. If the developer passes an ID which is known not to be
         * unique, the specified ID is ignored and the system-generated ID is
         * used instead.
         */
        id: string;
        /**
         * Rarely used.  Overrides the default Dojo locale used to render this widget,
         * as defined by the [HTML LANG](http://www.w3.org/TR/html401/struct/dirlang.html#adef-lang) attribute.
         * Value must be among the list of locales specified during by the Dojo bootstrap,
         * formatted according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt) (like en-us).
         */
        lang: string;
        /**
         * Bi-directional support, as defined by the [HTML DIR](http://www.w3.org/TR/html401/struct/dirlang.html#adef-dir)
         * attribute. Either left-to-right "ltr" or right-to-left "rtl".  If undefined, widgets renders in page's
         * default direction.
         */
        dir: string;
        /**
         * HTML class attribute
         */
        class: string;
        /**
         * HTML style attributes as cssText string or name/value hash
         */
        style: string;
        /**
         * HTML title attribute.
         *
         * For form widgets this specifies a tooltip to display when hovering over
         * the widget (just like the native HTML title attribute).
         *
         * For TitlePane or for when this widget is a child of a TabContainer, AccordionContainer,
         * etc., it's used to specify the tab label, accordion pane title, etc.  In this case it's
         * interpreted as HTML.
         */
        title: string;
        /**
         * When this widget's title attribute is used to for a tab label, accordion pane title, etc.,
         * this specifies the tooltip to appear when the mouse is hovered over that text.
         */
        tooltip: string;
        /**
         * Root CSS class of the widget (ex: dijitTextBox), used to construct CSS classes to indicate
         * widget state.
         */
        baseClass: string;
        /**
         * pointer to original DOM node
         */
        srcNodeRef: HTMLElement;
        /**
         * This is our visible representation of the widget! Other DOM
         * Nodes may by assigned to other properties, usually through the
         * template system's data-dojo-attach-point syntax, but the domNode
         * property is the canonical "top level" node in widget UI.
         */
        domNode: HTMLElement;
        /**
         * Designates where children of the source DOM node will be placed.
         * "Children" in this case refers to both DOM nodes and widgets.
         */
        containerNode: HTMLElement;
        /**
         * The document this widget belongs to.  If not specified to constructor, will default to
         * srcNodeRef.ownerDocument, or if no sourceRef specified, then to the document global
         */
        ownerDocument: HTMLElement;
        /**
         * Deprecated.	Instead of attributeMap, widget should have a _setXXXAttr attribute
         * for each XXX attribute to be mapped to the DOM.
         */
        attributeMap: {
            [attribute: string]: any;
        };
        /**
         * Bi-directional support,	the main variable which is responsible for the direction of the text.
         * The text direction can be different than the GUI direction by using this parameter in creation
         * of a widget.
         */
        textDir: string;
        /**
         * Kicks off widget instantiation.  See create() for details.
         */
        postscript(params?: any, srcNodeRef?: HTMLElement): void;
        /**
         * Kick off the life-cycle of a widget
         */
        create(params?: any, srcNodeRef?: HTMLElement): void;
        /**
         * Called after the parameters to the widget have been read-in,
         * but before the widget template is instantiated. Especially
         * useful to set properties that are referenced in the widget
         * template.
         */
        postMixInProperties(): void;
        /**
         * Construct the UI for this widget, setting this.domNode.
         * Most widgets will mixin `dijit._TemplatedMixin`, which implements this method.
         */
        buildRendering(): void;
        /**
         * Processing after the DOM fragment is created
         */
        postCreate(): void;
        /**
         * Processing after the DOM fragment is added to the document
         */
        startup(): void;
        /**
         * Destroy this widget and its descendants
         */
        destroyRecursive(preserveDom?: boolean): void;
        /**
         * Destroys the DOM nodes associated with this widget.
         */
        destroyRendering(preserveDom?: boolean): void;
        /**
         * Recursively destroy the children of this widget and their
         * descendants.
         */
        destroyDescendants(preserveDom?: boolean): void;
        /**
         * Deprecated. Override destroy() instead to implement custom widget tear-down
         * behavior.
         */
        uninitialize(): boolean;
        /**
         * Used by widgets to signal that a synthetic event occurred, ex:
         * |	myWidget.emit("attrmodified-selectedChildWidget", {}).
         */
        emit(type: string, eventObj?: any, callbackArgs?: any[]): any;
        /**
         * Call specified function when event occurs, ex: myWidget.on("click", function(){ ... }).
         */
        on(type: string | DojoJS.ExtensionEvent, func: EventListener | Function): WatchHandle;
        /**
         * Returns a string that represents the widget.
         */
        toString(): string;
        /**
         * Returns all direct children of this widget, i.e. all widgets underneath this.containerNode whose parent
         * is this widget.   Note that it does not return all descendants, but rather just direct children.
         */
        getChildren<T extends _WidgetBase>(): T[];
        /**
         * Returns the parent widget of this widget.
         */
        getParent<T extends _WidgetBase>(): T;
        /**
         * Deprecated, will be removed in 2.0, use this.own(on(...)) or this.own(aspect.after(...)) instead.
         */
        connect(obj: any, event: string | DojoJS.ExtensionEvent, method: string | EventListener): WatchHandle;
        /**
         * Deprecated, will be removed in 2.0, use handle.remove() instead.
         */
        disconnect(handle: WatchHandle): void;
        /**
         * Deprecated, will be removed in 2.0, use this.own(topic.subscribe()) instead.
         */
        subscribe(t: string, method: EventListener): WatchHandle;
        /**
         * Deprecated, will be removed in 2.0, use handle.remove() instead.
         */
        unsubscribe(handle: WatchHandle): void;
        /**
         * Return this widget's explicit or implicit orientation (true for LTR, false for RTL)
         */
        isLeftToRight(): boolean;
        /**
         * Return true if this widget can currently be focused
         * and false if not
         */
        isFocusable(): boolean;
        /**
         * Place this widget somewhere in the DOM based
         * on standard domConstruct.place() conventions.
         */
        placeAt<T extends _WidgetBase>(reference: Node | string | DocumentFragment | T, position?: string | number): this;
        /**
         * Wrapper to setTimeout to avoid deferred functions executing
         * after the originating widget has been destroyed.
         * Returns an object handle with a remove method (that returns null) (replaces clearTimeout).
         */
        defer(fcn: Function, delay?: number): DojoJS.Handle;
    }
    interface _WidgetBaseConstructor<W> extends Pick<DojoJS.DojoClass<W>, Exclude<keyof DojoJS.DojoClass<W>, 'new'>> {
        new (params?: Partial<W> & ThisType<W>, srcNodeRef?: Node | string): W & DojoJS.DojoClassObject;
    }
    interface _WidgetsInTemplateMixin {
        /**
         * Used to provide a context require to dojo/parser in order to be
         * able to use relative MIDs (e.g. `./Widget`) in the widget's template.
         */
        contextRequire: Function;
        startup(): void;
    }
    interface _WidgetsInTemplateMixinConstructor extends DojoJS.DojoClass<_WidgetsInTemplateMixin> {
        new (params: Object, srcNodeRef: Node | string): _WidgetsInTemplateMixin;
    }
    interface A11yClick {
        /**
         * Custom press, release, and click synthetic events
         * which trigger on a left mouse click, touch, or space/enter keyup.
         */
        (node: HTMLElement, listener: Function): DojoJS.Handle;
        /**
         * Mousedown (left button), touchstart, or keydown (space or enter) corresponding to logical click operation.
         */
        press: DojoJS.ExtensionEvent;
        /**
         * Mouseup (left button), touchend, or keyup (space or enter) corresponding to logical click operation.
         */
        release: DojoJS.ExtensionEvent;
        /**
         * Mouse cursor or a finger is dragged over the given node.
         */
        move: DojoJS.ExtensionEvent;
    }
    interface _MonthDropDownButton extends form.DropDownButton<_MonthDropDown> {
        onMonthSelect(): void;
        postCreate(): void;
        set(name: 'month', value: number): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface _MonthDropDownButtonConstructor extends _WidgetBaseConstructor<_MonthDropDownButton> {
    }
    interface _MonthDropDown extends _Widget, _TemplatedMixin, _CssStateMixin {
        months: string[];
        baseClass: string;
        templateString: string;
        /**
         * Callback when month is selected from drop down
         */
        onChange(month: number): void;
        set(name: 'months', value: string[]): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface _MonthDropDownConstructor extends _WidgetBaseConstructor<_MonthDropDown> {
    }
    interface Calendar extends CalendarLite, Omit<_Widget, "_changeAttrValue" | "placeAt" | keyof DojoJS.DojoClassObject>, _CssStateMixin {
        baseClass: string;
        /**
         * Set node classes for various mouse events, see dijit._CssStateMixin for more details
         */
        cssStateNodes: CSSStateNodes;
        /**
         * Creates the drop down button that displays the current month and lets user pick a new one
         */
        _createMonthWidget(): _MonthDropDownButton;
        postCreate(): void;
        /**
         * Handler for when user selects a month from the drop down list
         */
        _onMonthSelect(newMonth: number): void;
        /**
         * Handler for mouse over events on days, sets hovered style
         */
        _onDayMouseOver(evt: MouseEvent): void;
        /**
         * Handler for mouse out events on days, clears hovered style
         */
        _onDayMouseOut(evt: MouseEvent): void;
        _onDayMouseDown(evt: MouseEvent): void;
        _onDayMouseUp(evt: MouseEvent): void;
        /**
         * Provides keyboard navigation of calendar.
         */
        handleKey(evt: KeyboardEvent): void;
        /**
         * For handling keydown events on a stand alone calendar
         */
        _onKeyDown(evt: KeyboardEvent): void;
        /**
         * Deprecated.   Notification that a date cell was selected.  It may be the same as the previous value.
         */
        onValueSelected(date: Date): void;
        onChange(date: Date): void;
        /**
         * May be overridden to return CSS classes to associate with the date entry for the given dateObject
         * for example to indicate a holiday in specified locale.
         */
        getClassForDate(dateObject: Date, locale?: string): string;
        get(name: 'value'): Date;
        get(name: string): any;
        set(name: 'value', value: number | Date): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface CalendarConstructor extends _WidgetBaseConstructor<Calendar> {
        _MonthWidget: _MonthWidgetConstructor;
        _MonthDropDown: _MonthDropDownButtonConstructor;
        _MonthDropDownButton: _MonthDropDownButtonConstructor;
    }
    interface _MonthWidget extends _WidgetBase {
        set(name: 'month', value: Date): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface _MonthWidgetConstructor extends _WidgetBaseConstructor<_MonthWidget> {
    }
    interface CalendarLite extends _WidgetBase, _TemplatedMixin {
        /**
         * Template for main calendar
         */
        templateString: string;
        /**
         * Template for cell for a day of the week (ex: M)
         */
        dowTemplateString: string;
        dateTemplateString: string;
        weekTemplateString: string;
        /**
         * The currently selected Date, initially set to invalid date to indicate no selection.
         */
        value: Date;
        /**
         * JavaScript namespace to find calendar routines.	 If unspecified, uses Gregorian calendar routines
         * at dojo/date and dojo/date/locale.
         */
        datePackage: string;
        /**
         * How to represent the days of the week in the calendar header. See locale
         */
        dayWidth: string;
        /**
         * Order fields are traversed when user hits the tab key
         */
        tabIndex: string;
        /**
         * (Optional) The first day of week override. By default the first day of week is determined
         * for the current locale (extracted from the CLDR).
         * Special value -1 (default value), means use locale dependent value.
         */
        dayOffset: number;
        /**
         * Date object containing the currently focused date, or the date which would be focused
         * if the calendar itself was focused.   Also indicates which year and month to display,
         * i.e. the current "page" the calendar is on.
         */
        currentFocus: Date;
        /**
         * Put the summary to the node with role=grid
         */
        _setSummaryAttr: string;
        baseClass: string;
        /**
         * Runs various tests on the value, checking that it's a valid date, rather
         * than blank or NaN.
         */
        _isValidDate(value: Date): boolean;
        /**
         * Convert Number into Date, or copy Date object.   Then, round to nearest day,
         * setting to 1am to avoid issues when DST shift occurs at midnight, see #8521, #9366)
         */
        _patchDate(value: number | Date): Date;
        /**
         * This just sets the content of node to the specified text.
         * Can't do "node.innerHTML=text" because of an IE bug w/tables, see #3434.
         */
        _setText(node: HTMLElement, text?: string): void;
        /**
         * Fills in the calendar grid with each day (1-31).
         * Call this on creation, when moving to a new month.
         */
        _populateGrid(): void;
        /**
         * Fill in localized month, and prev/current/next years
         */
        _populateControls(): void;
        /**
         * Sets calendar's value to today's date
         */
        goToToday(): void;
        /**
         * Creates the drop down button that displays the current month and lets user pick a new one
         */
        _createMonthWidget(): void;
        buildRendering(): void;
        postCreate(): void;
        /**
         * Set up connects for increment/decrement of months/years
         */
        _connectControls(): void;
        /**
         * If the calendar currently has focus, then focuses specified date,
         * changing the currently displayed month/year if necessary.
         * If the calendar doesn't have focus, updates currently
         * displayed month/year, and sets the cell that will get focus
         * when Calendar is focused.
         */
        _setCurrentFocusAttr(date: Date, forceFocus?: boolean): void;
        /**
         * Focus the calendar by focusing one of the calendar cells
         */
        focus(): void;
        /**
         * Handler for day clicks, selects the date if appropriate
         */
        _onDayClick(evt: MouseEvent): void;
        /**
         * Returns the cell corresponding to the date, or null if the date is not within the currently
         * displayed month.
         */
        _getNodeByDate(value: Date): HTMLElement;
        /**
         * Marks the specified cells as selected, and clears cells previously marked as selected.
         * For CalendarLite at most one cell is selected at any point, but this allows an array
         * for easy subclassing.
         */
        _markSelectedDates(dates: Date[]): void;
        /**
         * Called only when the selected date has changed
         */
        onChange(date: Date): void;
        /**
         * May be overridden to disable certain dates in the calendar e.g. `isDisabledDate=dojo.date.locale.isWeekend`
         */
        isDisabledDate(dateObject: Date, locale?: string): boolean;
        /**
         * May be overridden to return CSS classes to associate with the date entry for the given dateObject,
         * for example to indicate a holiday in specified locale.
         */
        getClassForDate(dateObject: Date, locale?: string): string;
        get(name: 'value'): Date;
        get(name: string): any;
        set(name: 'value', value: number | Date): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface CalendarLiteConstructor extends _WidgetBaseConstructor<CalendarLite> {
        _MonthWidget: _MonthWidgetConstructor;
    }
    interface Destroyable {
        _destroyed?: true;
        /**
         * Destroy this class, releasing any resources registered via own().
         */
        destroy(preserveDom?: boolean): void;
        /**
         * Track specified handles and remove/destroy them when this instance is destroyed, unless they were
         * already removed/destroyed manually.
         */
        own(...args: any[]): any[];
    }
    /**
     * Mixin to track handles and release them when instance is destroyed.
     */
    interface DestroyableConstructor extends DojoJS.DojoClass<Destroyable> {
    }
    /** dijit/_KeyNavMixin */
    /**
     * A mixin to allow arrow key and letter key navigation of child or descendant widgets.
     * It can be used by dijit/_Container based widgets with a flat list of children, or more complex widgets like dijit/Tree.
     *
     * To use this mixin, the subclass must:
     *
     * 	- Implement  _getNext(), _getFirst(), _getLast(), _onLeftArrow(), _onRightArrow() _onDownArrow(), _onUpArrow() methods to handle home/end/left/right/up/down keystrokes. Next and previous in this context refer to a linear ordering of the descendants used by letter key search.
     * 	- Set all descendants' initial tabIndex to "-1"; both initial descendants and any descendants added later, by for example addChild()
     * 	- Define childSelector to a function or string that identifies focusable descendant widgets
     *
     * Also, child widgets must implement a focus() method.
     */
    interface _KeyNavMixin extends _FocusMixin {
        /**
         * Tab index of the container; same as HTML tabIndex attribute.
         * Note then when user tabs into the container, focus is immediately moved to the first item in the container.
         */
        tabIndex: string;
        /**
         * Selector (passed to on.selector()) used to identify what to treat as a child widget.   Used to monitor focus events and set this.focusedChild.   Must be set by implementing class.   If this is a string (ex: "> *") then the implementing class must require dojo/query.
         */
        childSelector: string | Function | null;
        /**
         * Called on left arrow key, or right arrow key if widget is in RTL mode.
         * Should go back to the previous child in horizontal container widgets like Toolbar.
         */
        _onLeftArrow(evt?: KeyboardEvent): void;
        /**
         * Called on right arrow key, or left arrow key if widget is in RTL mode.
         * Should go to the next child in horizontal container widgets like Toolbar.
         */
        _onRightArrow(evt?: KeyboardEvent): void;
        /**
         * Called on up arrow key. Should go to the previous child in vertical container widgets like Menu.
         */
        _onUpArrow(evt?: KeyboardEvent): void;
        /**
         * Called on down arrow key. Should go to the next child in vertical container widgets like Menu.
         */
        _onDownArrow(evt?: KeyboardEvent): void;
        /**
         * Default focus() implementation: focus the first child.
         */
        focus(): void;
        /**
         * Returns first child that can be focused.
         */
        _getFirstFocusableChild(): _WidgetBase;
        /**
         * Returns last child that can be focused.
         */
        _getLastFocusableChild(): _WidgetBase;
        /**
         * Focus the first focusable child in the container.
         */
        focusFirstChild(): void;
        /**
         * Focus the last focusable child in the container.
         */
        focusLastChild(): void;
        /**
         * Focus specified child widget.
         *
         * @param widget Reference to container's child widget
         * @param last If true and if widget has multiple focusable nodes, focus the last one instead of the first one
         */
        focusChild(widget: _WidgetBase, last?: boolean): void;
        /**
         * Handler for when the container itself gets focus.
         *
         * Initially the container itself has a tabIndex, but when it gets focus, switch focus to first child.
         */
        _onContainerFocus(evt: Event): void;
        /**
         * Called when a child widget gets focus, either by user clicking it, or programatically by arrow key handling code.
         *
         * It marks that the current node is the selected one, and the previously selected node no longer is.
         */
        _onChildFocus(child?: _WidgetBase): void;
        _searchString: string;
        multiCharSearchDuration: number;
        /**
         * When a key is pressed that matches a child item, this method is called so that a widget can take appropriate action is necessary.
         */
        onKeyboardSearch(tem: _WidgetBase, evt: Event, searchString: string, numMatches: number): void;
        /**
         * Compares the searchString to the widget's text label, returning:
         *
         * 	* -1: a high priority match  and stop searching
         * 	* 0: not a match
         * 	* 1: a match but keep looking for a higher priority match
         */
        _keyboardSearchCompare(item: _WidgetBase, searchString: string): -1 | 0 | 1;
        /**
         * When a key is pressed, if it's an arrow key etc. then it's handled here.
         */
        _onContainerKeydown(evt: Event): void;
        /**
         * When a printable key is pressed, it's handled here, searching by letter.
         */
        _onContainerKeypress(evt: Event): void;
        /**
         * Perform a search of the widget's options based on the user's keyboard activity
         *
         * Called on keypress (and sometimes keydown), searches through this widget's children looking for items that match the user's typed search string.  Multiple characters typed within 1 sec of each other are combined for multicharacter searching.
         */
        _keyboardSearch(evt: Event, keyChar: string): void;
        /**
         * Called when focus leaves a child widget to go to a sibling widget.
         */
        _onChildBlur(widget: _WidgetBase): void;
        /**
         * Returns the next or previous focusable descendant, compared to "child".
         * Implements and extends _KeyNavMixin._getNextFocusableChild() for a _Container.
         */
        _getNextFocusableChild(child: _WidgetBase, dir: 1 | -1): _WidgetBase | null;
        /**
         * Returns the first child.
         */
        _getFirst(): _WidgetBase | null;
        /**
         * Returns the last descendant.
         */
        _getLast(): _WidgetBase | null;
        /**
         * Returns the next descendant, compared to "child".
         */
        _getNext(child: _WidgetBase, dir: 1 | -1): _WidgetBase | null;
    }
    interface _KeyNavMixinConstructor extends DojoJS.DojoClass<_KeyNavMixin> {
    }
    /**
     * A _Container with keyboard navigation of its children.
     *
     * Provides normalized keyboard and focusing code for Container widgets.
     * To use this mixin, call connectKeyNavHandlers() in postCreate().
     * Also, child widgets must implement a focus() method.
     */
    interface _KeyNavContainer extends _FocusMixin, _KeyNavMixin, _Container {
        /**
         * Deprecated.  You can call this in postCreate() to attach the keyboard handlers to the container, but the preferred method is to override _onLeftArrow() and _onRightArrow(), or _onUpArrow() and _onDownArrow(), to call focusPrev() and focusNext().
         *
         * @param prevKeyCodes Key codes for navigating to the previous child.
         * @param nextKeyCodes Key codes for navigating to the next child.
         */
        connectKeyNavHandlers(prevKeyCodes: number[], nextKeyCodes: number[]): void;
        /**
         * @deprecated
         */
        startupKeyNavChildren(): void;
        /**
         * Setup for each child widget.
         *
         * Sets tabIndex=-1 on each child, so that the tab key will leave the container rather than visiting each child.
         *
         * Note: if you add children by a different method than addChild(), then need to call this manually or at least make sure the child's tabIndex is -1.
         *
         * Note: see also _LayoutWidget.setupChild(), which is also called for each child widget.
         */
        _startupChild(widget: _WidgetBase): void;
        /**
         * Returns the first child.
         */
        _getFirst(): _Widget | null;
        /**
         * Returns the last descendant.
         */
        _getLast(): _Widget | null;
        /**
         * Focus the next widget
         */
        focusNext(): void;
        /**
         * Focus the last focusable node in the previous widget
         *
         * (ex: go to the ComboButton icon section rather than button section)
         */
        focusPrev(): void;
        /**
         * Implement _KeyNavMixin.childSelector, to identify focusable child nodes.
         *
         * If we allowed a dojo/query dependency from this module this could more simply be a string "> *" instead of this function.
         */
        childSelector(node: Element | Node): boolean | void | any;
    }
    interface _KeyNavContainerConstructor extends DojoJS.DojoClass<_KeyNavContainer> {
    }
    /**
     * Abstract base class for Menu and MenuBar.
     * Subclass should implement _onUpArrow(), _onDownArrow(), _onLeftArrow(), and _onRightArrow().
     */
    interface _MenuBase extends _Widget, _TemplatedMixin, _KeyNavContainer, _CssStateMixin {
        selected: MenuItem | null;
        _setSelectedAttr(item?: MenuItem | null): void;
        /**
         * This Menu has been clicked (mouse or via space/arrow key) or opened as a submenu, so mere mouseover will open submenus.  Focusing a menu via TAB does NOT automatically make it active since TAB is a navigation operation and not a selection one.
         *
         * For Windows apps, pressing the ALT key focuses the menubar menus (similar to TAB navigation) but the menu is not active (ie no dropdown) until an item is clicked.
         */
        activated: boolean;
        _setActivatedAttr(val: boolean): void;
        /**
         * pointer to menu that displayed me
         */
        parentMenu: _Widget | null;
        /**
         * After a menu has been activated (by clicking on it etc.), number of milliseconds before hovering (without clicking) another MenuItem causes that MenuItem's popup to automatically open.
         */
        popupDelay: number;
        /**
         * For a passive (unclicked) Menu, number of milliseconds before hovering (without clicking) will cause the popup to open.  Default is Infinity, meaning you need to click the menu to open it.
         */
        passivePopupDelay: number;
        /**
         * A toggle to control whether or not a Menu gets focused when opened as a drop down from a MenuBar or DropDownButton/ComboButton.   Note though that it always get focused when opened via the keyboard.
         */
        autoFocus: boolean;
        /**
         * Selector (passed to on.selector()) used to identify MenuItem child widgets, but exclude inert children like MenuSeparator.  If subclass overrides to a string (ex: "> *"), the subclass must require dojo/query.
         */
        childSelector(node: Element | Node): boolean | void | Function;
        /**
         * Attach point for notification about when a menu item has been executed. This is an internal mechanism used for Menus to signal to their parent to close them, because they are about to execute the onClick handler.  In general developers should not attach to or override this method.
         */
        onExecute(): void;
        /**
         * Attach point for notification about when the user cancels the current menu
         * This is an internal mechanism used for Menus to signal to their parent to close them.  In general developers should not attach to or override this method.
         */
        onCancel(): void;
        /**
         * This handles the right arrow key (left arrow key on RTL systems), which will either open a submenu, or move to the next item in the ancestor MenuBar
         */
        _moveToPopup(evt: Event): void;
        /**
         * This handler is called when the mouse moves over the popup.
         */
        _onPopupHover(evt?: MouseEvent): void;
        /**
         * Called when cursor is over a MenuItem.
         */
        onItemHover(item: MenuItem): void;
        /**
         * Called when a child MenuItem becomes deselected.   Setup timer to close its popup.
         */
        _onChildDeselect(item: MenuItem): void;
        /**
         * Callback fires when mouse exits a MenuItem
         */
        onItemUnhover(item: MenuItem): void;
        /**
         * Cancels the popup timer because the user has stop hovering on the MenuItem, etc.
         */
        _stopPopupTimer(): void;
        /**
         * Cancels the pending-close timer because the close has been preempted
         */
        _stopPendingCloseTimer(): void;
        /**
         * Returns the top menu in this chain of Menus
         */
        _getTopMenu(): void;
        /**
         * Handle clicks on an item.
         */
        onItemClick(item: _WidgetBase, evt: Event): void;
        /**
         * Open the popup to the side of/underneath the current menu item, and optionally focus first item
         */
        _openItemPopup(fromItem: MenuItem, focus: boolean): void;
        /**
         * Callback when this menu is opened.
         * This is called by the popup manager as notification that the menu was opened.
         */
        onOpen(evt?: Event): void;
        /**
         * Callback when this menu is closed.
         * This is called by the popup manager as notification that the menu was closed.
         */
        onClose(): boolean;
        /**
         * Called when submenu is clicked or focus is lost.  Close hierarchy of menus.
         */
        _closeChild(): void;
        /**
         * Called when child of this Menu gets focus from:
         *
         *  1. clicking it
         *  2. tabbing into it
         *  3. being opened by a parent menu.
         *
         * This is not called just from mouse hover.
         */
        _onItemFocus(item: MenuItem): void;
        /**
         * Called when focus is moved away from this Menu and it's submenus.
         */
        _onBlur(): void;
        /**
         * Called when the user is done with this menu.  Closes hierarchy of menus.
         */
        _cleanUp(clearSelectedItem?: boolean): void;
    }
    interface _MenuBaseConstructor extends _WidgetBaseConstructor<_MenuBase> {
    }
    interface _DialogBase extends _TemplatedMixin, form._FormMixin, _DialogMixin, _CssStateMixin {
        _relativePosition?: {
            x: number;
            y: number;
        };
        templateString: string;
        baseClass: string;
        cssStateNodes: CSSStateNodes;
        /**
         * True if Dialog is currently displayed on screen.
         */
        open: boolean;
        /**
         * The time in milliseconds it takes the dialog to fade in and out
         */
        duration: number;
        /**
         * A Toggle to modify the default focus behavior of a Dialog, which
         * is to re-focus the element which had focus before being opened.
         * False will disable refocusing. Default: true
         */
        refocus: boolean;
        /**
         * A Toggle to modify the default focus behavior of a Dialog, which
         * is to focus on the first dialog element after opening the dialog.
         * False will disable autofocusing. Default: true
         */
        autofocus: boolean;
        /**
         * Toggles the movable aspect of the Dialog. If true, Dialog
         * can be dragged by it's title. If false it will remain centered
         * in the viewport.
         */
        draggable: boolean;
        /**
         * Maximum size to allow the dialog to expand to, relative to viewport size
         */
        maxRatio: number;
        /**
         * Dialog show [x] icon to close itself, and ESC key will close the dialog.
         */
        closable: boolean;
        postMixInProperties(): void;
        postCreate(): void;
        /**
         * Called when data has been loaded from an href.
         * Unlike most other callbacks, this function can be connected to (via `dojo.connect`)
         * but should *not* be overridden.
         */
        onLoad(data?: any): void;
        focus(): void;
        /**
         * Display the dialog
         */
        show(): Promise<any>;
        /**
         * Hide the dialog
         */
        hide(): Promise<any>;
        /**
         * Called with no argument when viewport scrolled or viewport size changed.  Adjusts Dialog as
         * necessary to keep it visible.
         *
         * Can also be called with an argument (by dojox/layout/ResizeHandle etc.) to explicitly set the
         * size of the dialog.
         */
        resize(dim?: {
            l: number;
            r: number;
            w: number;
            h: number;
        }): void;
        destroy(preserveDom?: boolean): void;
    }
    interface _DialogBaseConstructor extends _WidgetBaseConstructor<_DialogBase> {
    }
    interface Dialog extends layout.ContentPane, _DialogBase {
        resize(dim?: {
            l: number;
            r: number;
            w: number;
            h: number;
        }): void;
    }
    interface DialogLevelManager {
        _beginZIndex: number;
        /**
         * Call right before fade-in animation for new dialog.
         *
         * Saves current focus, displays/adjusts underlay for new dialog,
         * and sets the z-index of the dialog itself.
         *
         * New dialog will be displayed on top of all currently displayed dialogs.
         * Caller is responsible for setting focus in new dialog after the fade-in
         * animation completes.
         */
        show(dialog: _WidgetBase, underlayAttrs: Object): void;
        /**
         * Called when the specified dialog is hidden/destroyed, after the fade-out
         * animation ends, in order to reset page focus, fix the underlay, etc.
         * If the specified dialog isn't open then does nothing.
         *
         * Caller is responsible for either setting display:none on the dialog domNode,
         * or calling dijit/popup.hide(), or removing it from the page DOM.
         */
        hide(dialog: _WidgetBase): void;
        /**
         * Returns true if specified Dialog is the top in the task
         */
        isTop(dialog: _WidgetBase): boolean;
    }
    interface DialogConstructor extends _WidgetBaseConstructor<Dialog> {
        /**
         * for monkey patching and dojox/widget/DialogSimple
         */
        _DialogBase: _DialogBaseConstructor;
        _DialogLevelManager: DialogLevelManager;
        _dialogStack: {
            dialog: _WidgetBase;
            focus: any;
            underlayAttrs: any;
        }[];
    }
    interface ConfirmDialog extends _ConfirmDialogMixin {
    }
    interface ConfirmDialogConstructor extends DialogConstructor {
    }
    /**
     * A menu, without features for context menu (Meaning, drop down menu)
     */
    interface DropDownMenu extends _MenuBase {
    }
    interface DropDownMenuConstructor extends _WidgetBaseConstructor<DropDownMenu> {
    }
    /**
     * An accessible fieldset that can be expanded or collapsed via
     * its legend.  Fieldset extends `dijit.TitlePane`.
     */
    interface Fieldset extends TitlePane {
        open: boolean;
    }
    interface FieldsetConstructor extends _WidgetBaseConstructor<Fieldset> {
    }
    /**
     * A context menu you can assign to multiple elements
     */
    interface Menu extends DijitJS.DropDownMenu {
        /**
         * Array of dom node ids of nodes to attach to.
         * Fill this with nodeIds upon widget creation and it becomes context menu for those nodes.
         */
        targetNodeIds: string[];
        /**
         * CSS expression to apply this Menu to descendants of targetNodeIds, rather than to
         * the nodes specified by targetNodeIds themselves.  Useful for applying a Menu to
         * a range of rows in a table, tree, etc.
         *
         * The application must require() an appropriate level of dojo/query to handle the selector.
         */
        selector: string;
        /**
         * If true, right clicking anywhere on the window will cause this context menu to open.
         * If false, must specify targetNodeIds.
         */
        contextMenuForWindow: boolean;
        /**
         * If true, menu will open on left click instead of right click, similar to a file menu.
         */
        leftClickToOpen: boolean;
        /**
         * When this menu closes, re-focus the element which had focus before it was opened.
         */
        refocus: boolean;
        /**
         * Attach menu to given node
         */
        bindDomNode(node: string | Node): void;
        /**
         * Detach menu from given node
         */
        unBindDomNode(nodeName: string | Node): void;
    }
    interface MenuConstructor extends _WidgetBaseConstructor<Menu> {
    }
    interface MenuBar extends _MenuBase {
        baseClass: 'dijitMenuBar';
        popupDelay: number;
        _isMenuBar: true;
        _orient: string[];
        _moveToPopup(evt: Event): void;
        focusChild(item: _WidgetBase): void;
        _onChildDeselect(item: _WidgetBase): void;
        _onLeftArrow(): void;
        _onRightArrow(): void;
        _onDownArrow(): void;
        _onUpArrow(): void;
        onItemClick(item: _WidgetBase, evt: Event): void;
    }
    interface MenuBarConstructor extends _WidgetBaseConstructor<MenuBar> {
    }
    interface MenuBarItem extends MenuItem {
    }
    interface MenuBarItemConstructor extends _WidgetBaseConstructor<MenuBarItem> {
    }
    interface MenuItem extends _Widget, _TemplatedMixin, _Contained, _CssStateMixin {
        /**
         * Text for the accelerator (shortcut) key combination, a control, alt, etc. modified keystroke meant to execute the menu item regardless of where the focus is on the page.
         *
         * Note that although Menu can display accelerator keys, there is no infrastructure to actually catch and execute those accelerators.
         */
        accelKey: string;
        /**
         * If true, the menu item is disabled.
         * If false, the menu item is enabled.
         */
        disabled: boolean;
        /** Menu text as HTML */
        label: string;
        /**
         * Class to apply to DOMNode to make it display an icon.
         */
        iconClass: string;
        /**
         * Hook for attr('accelKey', ...) to work.
         * Set accelKey on this menu item.
         */
        _setAccelKeyAttr(value: string): void;
        /**
         * Hook for attr('disabled', ...) to work.
         * Enable or disable this menu item.
         */
        _setDisabledAttr(value: boolean): void;
        _setLabelAttr(val: string): void;
        _setIconClassAttr(val: string): void;
        _fillContent(source: Element): void;
        /**
         * Indicate that this node is the currently selected one
         */
        _setSelected(selected: boolean): void;
        focus(): void;
        /**
         * Deprecated.
         * Use set('disabled', bool) instead.
         */
        setDisabled(disabled: boolean): void;
        /**
         * Deprecated.
         * Use set('label', ...) instead.
         */
        setLabel(content: string): void;
    }
    interface MenuItemConstructor extends _WidgetBaseConstructor<MenuItem> {
    }
    interface MenuSeparator extends _WidgetBase, _TemplatedMixin, _Contained {
    }
    interface MenuSeparatorConstructor extends _WidgetBaseConstructor<MenuSeparator> {
    }
    interface PlacePosition {
        x: number;
        y: number;
    }
    interface PlaceWidthHeight {
        w: number;
        h: number;
    }
    interface PlaceRectangle extends PlacePosition, PlaceWidthHeight {
    }
    type PlaceCorner = 'BL' | 'TR' | 'BR' | 'TL';
    type PlacePositions = 'before' | 'after' | 'before-centered' | 'after-centered' | 'above-centered' | 'above' | 'above-alt' | 'below-centered' | 'below' | 'below-alt';
    interface PlaceChoice {
        corner: PlaceCorner;
        pos: PlacePosition;
        aroundCorner?: PlaceCorner;
    }
    interface PlaceLocation extends PlaceRectangle {
        corner: PlaceCorner;
        aroundCorner: PlaceCorner;
        overflow: number;
        spaceAvailable: PlaceWidthHeight;
    }
    interface LayoutNodeFunction {
        (node: HTMLElement, aroundCorner: string, corner: string, spaceAvailable: PlaceWidthHeight, aroundNodeCoords: PlaceWidthHeight): number;
    }
    interface Place {
        /**
         * Positions node kitty-corner to the rectangle centered at (pos.x, pos.y) with width and height of
         * padding.x * 2 and padding.y * 2, or zero if padding not specified.  Picks first corner in corners[]
         * where node is fully visible, or the corner where it's most visible.
         *
         * Node is assumed to be absolutely or relatively positioned.
         */
        at(node: Element, pos?: PlacePosition, corners?: PlaceCorner[], padding?: PlacePosition, layoutNode?: LayoutNodeFunction): PlaceLocation;
        /**
         * Position node adjacent or kitty-corner to anchor
         * such that it's fully visible in viewport.
         */
        around(node: Element, anchor: Element | PlaceRectangle, positions: PlacePositions[], leftToRight?: boolean, layoutNode?: LayoutNodeFunction): PlaceLocation;
    }
    interface PopupOpenArgs {
        /**
         * widget to display
         */
        popup?: _WidgetBase;
        /**
         * the button etc. that is displaying this popup
         */
        parent?: _WidgetBase;
        /**
         * DOM node (typically a button); place popup relative to this node.  (Specify this *or* "x" and "y" parameters.)
         */
        around?: HTMLElement;
        /**
         * Absolute horizontal position (in pixels) to place node at.  (Specify this *or* "around" parameter.)
         */
        x?: number;
        /**
         * Absolute vertical position (in pixels) to place node at.  (Specify this *or* "around" parameter.)
         */
        y?: number;
        /**
         * When the around parameter is specified, orient should be a list of positions to try
         */
        orient?: string | string[] | {
            BL?: string;
            TR?: string;
            TL?: string;
            BR?: string;
        };
        /**
         * callback when user has canceled the popup by:
         *
         * 1. hitting ESC or
         * 2. by using the popup widget's proprietary cancel mechanism (like a cancel button in a dialog);
         *    i.e. whenever popupWidget.onCancel() is called, args.onCancel is called
         */
        onCancel?: () => void;
        /**
         * callback whenever this popup is closed
         */
        onClose?: () => void;
        /**
         * callback when user "executed" on the popup/sub-popup by selecting a menu choice, etc. (top menu only)
         */
        onExecute?: () => void;
        /**
         * adding a buffer around the opening position. This is only useful when around is not set.
         */
        padding?: PlacePosition;
        /**
         * The max height for the popup.  Any popup taller than this will have scrollbars.
         * Set to Infinity for no max height.  Default is to limit height to available space in viewport,
         * above or below the aroundNode or specified x/y position.
         */
        maxHeight?: number;
    }
    interface PopupManager {
        /**
         * Stack of currently popped up widgets.
         * (someone opened _stack[0], and then it opened _stack[1], etc.)
         */
        _stack: _WidgetBase[];
        /**
         * Z-index of the first popup.   (If first popup opens other
         * popups they get a higher z-index.)
         */
        _beginZIndex: number;
        _idGen: number;
        /**
         * If screen has been scrolled, reposition all the popups in the stack.
         * Then set timer to check again later.
         */
        _repositionAll(): void;
        /**
         * Initialization for widgets that will be used as popups.
         * Puts widget inside a wrapper DIV (if not already in one),
         * and returns pointer to that wrapper DIV.
         */
        _createWrapper(widget: _WidgetBase): HTMLDivElement;
        /**
         * Moves the popup widget off-screen.
         * Do not use this method to hide popups when not in use, because
         * that will create an accessibility issue: the offscreen popup is
         * still in the tabbing order.
         */
        moveOffScreen(widget: _WidgetBase): HTMLDivElement;
        /**
         * Hide this popup widget (until it is ready to be shown).
         * Initialization for widgets that will be used as popups
         *
         * Also puts widget inside a wrapper DIV (if not already in one)
         *
         * If popup widget needs to layout it should
         * do so when it is made visible, and popup._onShow() is called.
         */
        hide(widget: _WidgetBase): void;
        /**
         * Compute the closest ancestor popup that's *not* a child of another popup.
         * Ex: For a TooltipDialog with a button that spawns a tree of menus, find the popup of the button.
         */
        getTopPopup(): _WidgetBase;
        /**
         * Popup the widget at the specified position
         */
        open(args: PopupOpenArgs): PlaceLocation;
        /**
         * Close specified popup and any popups that it parented.
         * If no popup is specified, closes all popups.
         */
        close(popup?: boolean | _WidgetBase): void;
    }
    interface PopupMenuBarItem extends PopupMenuItem {
    }
    interface PopupMenuBarItemConstructor extends _WidgetBaseConstructor<PopupMenuBarItem> {
    }
    /** dijit/PopupMenuItem */
    /**
     * An item in a Menu that spawn a drop down (usually a drop down menu)
     */
    interface PopupMenuItem extends MenuItem {
        /**
         * When Menu is declared in markup, this code gets the menu label and the popup widget from the srcNodeRef.
         *
         * srcNodeRef.innerHTML contains both the menu item text and a popup widget
         * The first part holds the menu item text and the second part is the popup
         */
        _fillContent(source: Element): void;
        /**
         * Open the popup to the side of/underneath this MenuItem, and optionally focus first item
         */
        _openPopup(params: {
            around?: Element;
            popup?: Function;
        }, focus?: boolean): void;
        _closePopup(): void;
    }
    interface PopupMenuItemConstructor extends _WidgetBaseConstructor<PopupMenuItem> {
    }
    interface Registry {
        /**
         * Number of registered widgets
         */
        length: number;
        /**
         * Add a widget to the registry. If a duplicate ID is detected, a error is thrown.
         */
        add(widget: _WidgetBase): void;
        /**
         * Remove a widget from the registry. Does not destroy the widget; simply
         * removes the reference.
         */
        remove(id: string): void;
        /**
         * Find a widget by it's id.
         * If passed a widget then just returns the widget.
         */
        byId<T extends _WidgetBase>(id: string | T): T;
        /**
         * Returns the widget corresponding to the given DOMNode
         */
        byNode<T extends _WidgetBase>(node: Element | Node): T;
        /**
         * Convert registry into a true Array
         */
        toArray(): _WidgetBase[];
        /**
         * Generates a unique id for a given widgetType
         */
        getUniqueId(widgetType: string): string;
        /**
         * Search subtree under root returning widgets found.
         * Doesn't search for nested widgets (ie, widgets inside other widgets).
         */
        findWidgets(root: Node, skipNode?: Node): _WidgetBase[];
        /**
         * Returns the widget whose DOM tree contains the specified DOMNode, or null if
         * the node is not contained within the DOM tree of any widget
         */
        getEnclosingWidget(node: Element | Node): _WidgetBase;
    }
    interface TitlePane extends DijitJS.layout.ContentPane, _TemplatedMixin, _CssStateMixin {
        /**
         * Whether pane can be opened or closed by clicking the title bar.
         */
        toggleable: boolean;
        /**
         * Tabindex setting for the title (so users can tab to the title then use space/enter to open/close the title pane)
         */
        tabIndex: string;
        /**
         * Time in milliseconds to fade in/fade out
         */
        duration: number;
        /**
         * Don't change this parameter from the default value.
         *
         * This ContentPane parameter doesn't make sense for TitlePane, since TitlePane is never a child of a layout container, nor should TitlePane try to control the size of an inner widget.
         */
        doLayout: boolean;
        /**
         * Switches between opened and closed state
         */
        toggle(): void;
        /**
         * Set the open/close css state for the TitlePane
         */
        _setCss(): void;
        /**
         * Handler for when user hits a key
         */
        _onTitleKey(e: Event): void;
        /**
         * Handler when user clicks the title bar
         */
        _onTitleClick(): void;
        /**
         * Deprecated. Use set('title', ...) instead.
         */
        setTitle(): void;
    }
    interface TitlePaneConstructor extends _WidgetBaseConstructor<TitlePane> {
    }
    interface Toolbar extends DijitJS._Widget, DijitJS._TemplatedMixin, DijitJS._KeyNavContainer {
    }
    interface ToolbarConstructor extends _WidgetBaseConstructor<Toolbar> {
    }
    interface ToolbarSeparator extends DijitJS._Widget, DijitJS._TemplatedMixin {
    }
    interface ToolbarSeparatorConstructor extends _WidgetBaseConstructor<ToolbarSeparator> {
    }
    interface Tooltip extends Omit<_Widget, 'onShow'> {
        /**
         * HTML to display in the tooltip.
         * Specified as innerHTML when creating the widget from markup.
         */
        label: string;
        /**
         * Number of milliseconds to wait after hovering over/focusing on the object, before
         * the tooltip is displayed.
         */
        showDelay: number;
        /**
         * Number of milliseconds to wait after unhovering the object, before
         * the tooltip is hidden.  Note that blurring an object hides the tooltip immediately.
         */
        hideDelay: number;
        /**
         * Id of domNode(s) to attach the tooltip to.
         * When user hovers over specified dom node(s), the tooltip will appear.
         */
        connectId: Node | string | Node | string[];
        /**
         * See description of `dijit/Tooltip.defaultPosition` for details on position parameter.
         */
        position: DijitJS.PlacePositions[];
        /**
         * CSS expression to apply this Tooltip to descendants of connectIds, rather than to
         * the nodes specified by connectIds themselves.    Useful for applying a Tooltip to
         * a range of rows in a table, tree, etc.   Use in conjunction with getContent() parameter.
         * Ex: connectId: myTable, selector: "tr", getContent: function(node){ return ...; }
         *
         * The application must require() an appropriate level of dojo/query to handle the selector.
         */
        selector: string;
        /**
         * Attach tooltip to specified node if it's not already connected
         */
        addTarget(node: Node | string): void;
        /**
         * Detach tooltip from specified node
         */
        removeTarget(node: Node | string): void;
        /**
         * User overridable function that return the text to display in the tooltip.
         */
        getContent(node: Node): Node;
        /**
         * Display the tooltip; usually not called directly.
         */
        open(target: Node): void;
        /**
         * Hide the tooltip or cancel timer for show of tooltip
         */
        close(): void;
        /**
         * Called when the tooltip is shown
         */
        onShow: (connectNode: any, position: DijitJS.PlacePositions[]) => void;
        /**
         * Called when the tooltip is hidden
         */
        onHide: () => void;
        _onHover(_connectNode: any): void;
        _onUnHover(_?: any): void;
    }
    interface TooltipConstructor extends _WidgetBaseConstructor<Tooltip> {
        /**
         * 	This variable controls the position of tooltips, if the position is not specified to
         * 	the Tooltip widget or *TextBox widget itself.  It's an array of strings with the values
         * 	possible for `dijit/place.around()`.   The recommended values are:
         *
         * 	- before-centered: centers tooltip to the left of the anchor node/widget, or to the right
         * 	  in the case of RTL scripts like Hebrew and Arabic
         * 	- after-centered: centers tooltip to the right of the anchor node/widget, or to the left
         * 	  in the case of RTL scripts like Hebrew and Arabic
         * 	- above-centered: tooltip is centered above anchor node
         * 	- below-centered: tooltip is centered above anchor node
         *
         * 	The list is positions is tried, in order, until a position is found where the tooltip fits
         * 	within the viewport.
         *
         * 	Be careful setting this parameter.  A value of "above-centered" may work fine until the user scrolls
         * 	the screen so that there's no room above the target node.   Nodes with drop downs, like
         * 	DropDownButton or FilteringSelect, are especially problematic, in that you need to be sure
         * 	that the drop down and tooltip don't overlap, even when the viewport is scrolled so that there
         * 	is only room below (or above) the target node, but not both.
         */
        defaultPosition: DijitJS.PlacePositions[];
        _MasterTooltip: any;
        /**
         * Static method to display tooltip w/specified contents in specified position.
         * See description of dijit/Tooltip.defaultPosition for details on position parameter.
         * If position is not specified then dijit/Tooltip.defaultPosition is used.
         */
        show(innerHTML: string, aroundNode: PlaceRectangle, position?: DijitJS.PlacePositions[], rtl?: boolean, textDir?: string, onMouseEnter?: Function, onMouseLeave?: Function): void;
        /**
         * Hide the tooltip
         */
        hide(aroundNode: PlaceRectangle): void;
    }
    interface TooltipDialog extends layout.ContentPane, _TemplatedMixin, form._FormMixin, _DialogMixin {
        /**
         * Description of tooltip dialog (required for a11y)
         */
        title: string;
        closable: boolean;
        /**
         * Don't change this parameter from the default value.
         * This ContentPane parameter doesn't make sense for TooltipDialog, since TooltipDialog
         * is never a child of a layout container, nor can you specify the size of
         * TooltipDialog in order to control the size of an inner widget.
         */
        doLayout: boolean;
        /**
         * A Toggle to modify the default focus behavior of a Dialog, which
         * is to focus on the first dialog element after opening the dialog.
         * False will disable autofocusing.  Default: true.
         */
        autofocus: boolean;
        /**
         * The pointer to the first focusable node in the dialog.
         */
        _firstFocusItem: any;
        /**
         * The pointer to which node has focus prior to our dialog.
         */
        _lastFocusItem: any;
        /**
         * Configure widget to be displayed in given position relative to the button.
         *
         * This is called from the dijit.popup code, and should not be called directly.
         */
        orient(node: Node | HTMLElement, aroundCorner: PlaceCorner, tooltipCorner: PlaceCorner): void;
        /**
         * Focus on first field
         */
        focus(): void;
        /**
         * Called when dialog is displayed.
         *
         * This is called from the dijit.popup code, and should not be called directly.
         */
        onOpen(pos: {
            aroundCorner: PlaceCorner;
            aroundNodePos: PlacePosition;
            corner: PlaceCorner;
            x: number;
            y: number;
        }): void;
        /**
         * Handler for keydown events
         *
         * Keep keyboard focus in dialog; close dialog on escape key
         */
        _onKey(evt: KeyboardEvent): void;
    }
    interface TooltipDialogConstructor extends _WidgetBaseConstructor<TooltipDialog> {
    }
}
declare module "dijit/Destroyable" {
    var Destroyable: DojoJS.DojoClass<{
        destroy: (e: any) => void;
        own: () => IArguments;
    }, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                Destroyable: typeof Destroyable;
            }
        }
    }
    export = Destroyable;
}
declare module "dojo/i18n" {
    global {
        namespace DojoJS {
            interface I18n {
                getLocalization(moduleName: string, bundleName: string, locale?: string): any;
                dynamic: boolean;
                /**
                 * Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
                 */
                normalize(id: string, toAbsMid: Function): string;
                normalizeLocale(locale?: string): string;
                /**
                 * Conditional loading of AMD modules based on a has feature test value.
                 */
                load(id: string, parentRequire: Function, loaded: Function): void;
                cache: {
                    [bundle: string]: any;
                };
                getL10nName(moduleName: string, bundleName: string, locale?: string): string;
            }
            interface Dojo {
                i18n: I18n;
                getL10nName: I18n["getL10nName"];
            }
        }
    }
    const _default_28: DojoJS.I18n;
    export = _default_28;
}
declare module "dojo/touch" {
    interface Touch {
        press: DojoJS.ExtensionEvent;
        move: DojoJS.ExtensionEvent;
        release: DojoJS.ExtensionEvent;
        cancel: DojoJS.ExtensionEvent;
        over: DojoJS.ExtensionEvent;
        out: DojoJS.ExtensionEvent;
        enter: DojoJS.ExtensionEvent;
        leave: DojoJS.ExtensionEvent;
    }
    global {
        namespace DojoJS {
            interface Dojo {
                touch: Touch;
            }
        }
    }
    const _default_29: Touch;
    export = _default_29;
}
declare module "dojo/window" {
    var _window: WindowModule;
    interface WindowModule {
        /**
         * Returns the dimensions and scroll position of the viewable area of a browser window
         */
        getBox(doc?: Document): {
            l: number;
            t: number;
            w: number;
            h: number;
        };
        /**
         * Get window object associated with document doc.
         */
        get(doc?: Document): Window;
        /**
         * Scroll the passed node into view using minimal movement, if it is not already.
         */
        scrollIntoView(node: Element, pos?: {
            x: number;
            y: number;
            w: number;
            h: number;
        }): void;
    }
    global {
        namespace DojoJS {
            interface Dojo {
                window: WindowModule;
            }
        }
    }
    export = _window;
}
declare namespace DojoJS {
    namespace dnd {
        interface DndLocation {
            t: number;
            l: number;
        }
        interface AutoScroll {
            getViewport(doc?: Document): DomGeometryBox;
            V_TRIGGER_AUTOSCROLL: number;
            H_TRIGGER_AUTOSCROLL: number;
            V_AUTOSCROLL_VALUE: number;
            H_AUTOSCROLL_VALUE: number;
            /**
             * Called at the start of a drag.
             */
            autoScrollStart(d: Document): void;
            /**
             * a handler for mousemove and touchmove events, which scrolls the window, if
             * necessary
             */
            autoScroll(e: Event): void;
            _validNodes: {
                div: number;
                p: number;
                td: number;
            };
            _validOverflow: {
                auto: number;
                scroll: number;
            };
            /**
             * a handler for mousemove and touchmove events, which scrolls the first available
             * Dom element, it falls back to exports.autoScroll()
             */
            autoScrollNodes(e: Event): void;
        }
        interface AutoSource extends Source {
        }
        interface AutoSourceConstructor {
            new (node: Node | string, params?: SourceArgs): AutoSource;
            prototype: AutoSource;
        }
        interface Avatar {
            /**
             * constructor function;
             * it is separate so it can be (dynamically) overwritten in case of need
             */
            construct(): void;
            /**
             * destructor for the avatar; called to remove all references so it can be garbage-collected
             */
            destroy(): void;
            /**
             * updates the avatar to reflect the current DnD state
             */
            update(): void;
            /**
             * generates a proper text to reflect copying or moving of items
             */
            _generateText(): string;
        }
        interface AvatarConstructor {
            new (manager: Manager): Avatar;
            prototype: Avatar;
        }
        interface Common {
            getCopyKeyState(evt: Event): boolean;
            _uniqueId: number;
            /**
             * returns a unique string for use with any DOM element
             */
            getUniqueId(): string;
            _empty: {};
            /**
             * returns true if user clicked on a form element
             */
            isFormElement(e: Event): boolean;
        }
        interface ContainerItem<T extends Record<string, any>> {
            type?: string[];
            data?: T;
        }
        interface ContainerArgs {
            /**
             * a creator function, which takes a data item, and returns an object like that:
             * {node: newNode, data: usedData, type: arrayOfStrings}
             */
            creator<T extends Record<string, any>>(data?: ContainerItem<T>): {
                node: Element;
                data: T;
                type: string[];
            };
            /**
             * don't start the drag operation, if clicked on form elements
             */
            skipForm: boolean;
            /**
             * node or node's id to use as the parent node for dropped items
             * (must be underneath the 'node' parameter in the DOM)
             */
            dropParent: Node | string;
            /**
             * skip startup(), which collects children, for deferred initialization
             * (this is used in the markup mode)
             */
            _skipStartup: boolean;
        }
        interface Container extends Type<typeof import("dojo/Evented")> {
            /**
             * Indicates whether to allow dnd item nodes to be nested within other elements.
             * By default this is false, indicating that only direct children of the container can
             * be draggable dnd item nodes
             */
            skipForm: boolean;
            /**
             * Indicates whether to allow dnd item nodes to be nested within other elements.
             * By default this is false, indicating that only direct children of the container can
             * be draggable dnd item nodes
             */
            allowNested: boolean;
            /**
             * The DOM node the mouse is currently hovered over
             */
            current: HTMLElement;
            /**
             * Map from an item's id (which is also the DOMNode's id) to
             * the dojo/dnd/Container.Item itself.
             */
            map: {
                [name: string]: ContainerItem<any>;
            };
            /**
             * creator function, dummy at the moment
             */
            creator<T extends Record<string, any>>(data?: ContainerItem<T>): {
                node: Element;
                data: T;
                type: string[];
            };
            /**
             * returns a data item by its key (id)
             */
            getItem<T extends Record<string, any>>(key: string): ContainerItem<T>;
            /**
             * associates a data item with its key (id)
             */
            setITem<T extends Record<string, any>>(key: string, data: ContainerItem<T>): void;
            /**
             * removes a data item from the map by its key (id)
             */
            delItem(key: string): void;
            /**
             * iterates over a data map skipping members that
             * are present in the empty object (IE and/or 3rd-party libraries).
             */
            forInItems<T extends Record<string, any>, U>(f: (i: ContainerItem<T>, idx?: number, container?: Container) => void, o?: U): U;
            /**
             * removes all data items from the map
             */
            clearItems(): void;
            /**
             * returns a list (an array) of all valid child nodes
             */
            getAllNodes(): NodeList<Node>;
            /**
             * sync up the node list with the data map
             */
            sync(): this;
            /**
             * inserts an array of new nodes before/after an anchor node
             */
            insertNodes(data: ContainerItem<any>[], before?: boolean, anchor?: Element): this;
            /**
             * prepares this object to be garbage-collected
             */
            destroy(): void;
            markupFactory<T>(params: ContainerArgs, node: Element, Ctor: Constructor<T>): T;
            /**
             * collects valid child items and populate the map
             */
            startup(): void;
            /**
             * event processor for onmouseover or touch, to mark that element as the current element
             */
            onMouseOver(e: Event): void;
            /**
             * event processor for onmouseout
             */
            onMouseOut(e: Event): void;
            /**
             * event processor for onselectevent and ondragevent
             */
            onSelectStart(e: Event): void;
            /**
             * this function is called once, when mouse is over our container
             */
            onOverEvent(e: Event): void;
            /**
             * this function is called once, when mouse is out of our container
             */
            onOutEvent(e: Event): void;
            /**
             * changes a named state to new state value
             */
            _changeState(type: string, newState: string): void;
            /**
             * adds a class with prefix "dojoDndItem"
             */
            _addItemClass(node: Element, type: string): void;
            /**
             * removes a class with prefix "dojoDndItem"
             */
            _removeItemClass(node: Element, type: string): void;
            /**
             * gets a child, which is under the mouse at the moment, or null
             */
            _getChildByEvent(e: Event): void;
            /**
             * adds all necessary data to the output of the user-supplied creator function
             */
            _normalizedCreator<T extends Record<string, any>>(item: ContainerItem<T>, hint: string): this;
        }
        interface ContainerConstructor {
            /**
             * a constructor of the Container
             */
            new (node: Node | string, params?: ContainerArgs): Container;
            prototype: Container;
        }
        interface Common {
            /**
             * returns a function, which creates an element of given tag
             * (SPAN by default) and sets its innerHTML to given text
             */
            _createNode(tag: string): (text: string) => HTMLElement;
            /**
             * creates a TR/TD structure with given text as an innerHTML of TD
             */
            _createTrTd(text: string): HTMLTableRowElement;
            /**
             * creates a SPAN element with given text as its innerHTML
             */
            _createSpan(text: string): HTMLSpanElement;
            /**
             * a dictionary that maps container tag names to child tag names
             */
            _defaultCreatorNodes: {
                ul: string;
                ol: string;
                div: string;
                p: string;
            };
            /**
             * takes a parent node, and returns an appropriate creator function
             */
            _defaultCreator<T>(node: HTMLElement): {
                node: HTMLElement;
                data: T;
                type: string;
            };
        }
        interface Manager extends Type<typeof import("dojo/Evented")> {
            OFFSET_X: number;
            OFFSET_Y: number;
            overSource(source: Source): void;
            outSource(source: Source): void;
            startDrag(source: Source, nodes: HTMLElement[], copy?: boolean): void;
            canDrop(flag: boolean): void;
            stopDrag(): void;
            makeAvatar(): Avatar;
            updateAvatar(): void;
            onMouseMove(e: MouseEvent): void;
            onMouseUp(e: MouseEvent): void;
            onKeyDown(e: KeyboardEvent): void;
            onKeyUp(e: KeyboardEvent): void;
            _setCopyStatus(copy?: boolean): void;
        }
        interface ManagerConstructor {
            /**
             * the manager of DnD operations (usually a singleton)
             */
            new (): Manager;
            prototype: Manager;
            /**
             * Returns the current DnD manager.  Creates one if it is not created yet.
             */
            manager(): Manager;
        }
        interface Common {
            _manager: Manager;
        }
        interface Move {
            constrainedMoveable: ConstrainedMoveableConstructor;
            boxConstrainedMoveable: BoxConstrainedMoveableConstructor;
            parentConstrainedMoveable: ParentConstrainedMoveableConstructor;
        }
        interface ConstrainedMoveableArgs extends MoveableArgs {
            /**
             * Calculates a constraint box.
             * It is called in a context of the moveable object.
             */
            constraints?: () => DomGeometryBox;
            /**
             * restrict move within boundaries.
             */
            within?: boolean;
        }
        interface ConstrainedMoveable extends Moveable {
            /**
             * Calculates a constraint box.
             * It is called in a context of the moveable object.
             */
            constraints: () => DomGeometryBox;
            /**
             * restrict move within boundaries.
             */
            within: boolean;
        }
        interface ConstrainedMoveableConstructor {
            /**
             * an object that makes a node moveable
             */
            new (node: Node | string, params?: ConstrainedMoveableArgs): ConstrainedMoveable;
        }
        interface BoxConstrainedMoveableArgs extends ConstrainedMoveableArgs {
            /**
             * a constraint box
             */
            box?: DomGeometryBox;
        }
        interface BoxConstrainedMoveable extends ConstrainedMoveable {
            /**
             * a constraint box
             */
            box: DomGeometryBox;
        }
        interface BoxConstrainedMoveableConstructor {
            /**
             * an object, which makes a node moveable
             */
            new (node: Node | string, params?: BoxConstrainedMoveableArgs): BoxConstrainedMoveable;
        }
        type ConstraintArea = 'border' | 'content' | 'margin' | 'padding';
        interface ParentConstrainedMoveableArgs extends ConstrainedMoveableArgs {
            /**
             * A parent's area to restrict the move.
             * Can be "margin", "border", "padding", or "content".
             */
            area?: ConstraintArea;
        }
        interface ParentConstrainedMoveable extends ConstrainedMoveable {
            /**
             * A parent's area to restrict the move.
             * Can be "margin", "border", "padding", or "content".
             */
            area: ConstraintArea;
        }
        interface ParentConstrainedMoveableConstructor {
            /**
             * an object, which makes a node moveable
             */
            new (node: Node | string, params?: ParentConstrainedMoveableArgs): ParentConstrainedMoveable;
        }
        interface MoveableArgs {
            /**
             * A node (or node's id), which is used as a mouse handle.
             * If omitted, the node itself is used as a handle.
             */
            handle?: Node | string;
            /**
             * delay move by this number of pixels
             */
            delay?: number;
            /**
             * skip move of form elements
             */
            skip?: boolean;
            /**
             * a constructor of custom Mover
             */
            mover?: MoverConstructor;
        }
        interface Moveable {
            /**
             * markup methods
             */
            markupFactory<T>(params: MoveableArgs, node: HTMLElement, Ctor: Constructor<T>): T;
            /**
             * stops watching for possible move, deletes all references, so the object can be garbage-collected
             */
            destroy(): void;
            /**
             * event processor for onmousedown/ontouchstart, creates a Mover for the node
             */
            onMouseDown(e: MouseEvent): void;
            /**
             * event processor for onmousemove/ontouchmove, used only for delayed drags
             */
            onMouseMove(e: MouseEvent): void;
            /**
             * event processor for onmouseup, used only for delayed drags
             */
            onMouseUp(e: MouseEvent): void;
            /**
             * called when the drag is detected;
             * responsible for creation of the mover
             */
            onDragDetected(e: Event): void;
            /**
             * called before every move operation
             */
            onMoveStart(mover: Mover): void;
            /**
             * called after every move operation
             */
            onMoveStop(mover: Mover): void;
            /**
             * called during the very first move notification;
             * can be used to initialize coordinates, can be overwritten.
             */
            onFirstMove(mover: Mover, e: Event): void;
            /**
             * called during every move notification;
             * should actually move the node; can be overwritten.
             */
            onMove(mover: Mover, leftTop: DndLocation, e?: Event): void;
            /**
             * called before every incremental move; can be overwritten.
             */
            onMoving(mover: Mover, leftTop: DndLocation): void;
            /**
             * called after every incremental move; can be overwritten.
             */
            onMoved(mover: Mover, leftTop: DndLocation): void;
        }
        interface MoveableConstructor {
            new (node: Node | string, params?: MoveableArgs): Moveable;
            prototype: Moveable;
        }
        interface MoverHost extends Record<string, any> {
            onMoveStart(mover: Mover): void;
            onMoveStop(mover: Mover): void;
        }
        interface Mover extends Type<typeof import("dojo/Evented")> {
            /**
             * event processor for onmousemove/ontouchmove
             */
            onMouseMove(e: MouseEvent): void;
            onMouseUp(e: MouseEvent): void;
            /**
             * makes the node absolute; it is meant to be called only once.
             * relative and absolutely positioned nodes are assumed to use pixel units
             */
            onFirstMove(e: Event): void;
            /**
             * stops the move, deletes all references, so the object can be garbage-collected
             */
            destroy(): void;
        }
        interface MoverConstructor {
            /**
             * an object which makes a node follow the mouse, or touch-drag on touch devices.
             * Used as a default mover, and as a base class for custom movers.
             */
            new (node: HTMLElement, e: MouseEvent, host: MoverHost): Mover;
            prototype: Mover;
        }
        interface Selector extends Container {
            /**
             * The set of id's that are currently selected, such that this.selection[id] == 1
             * if the node w/that id is selected.  Can iterate over selected node's id's like:
             *     for(var id in this.selection)
             */
            selection: {
                [id: string]: number;
            };
            /**
             * is singular property
             */
            singular: boolean;
            /**
             * returns a list (an array) of selected nodes
             */
            getSelectedNodes(): NodeList<Node>;
            /**
             * unselects all items
             */
            selectNone(): this;
            /**
             * selects all items
             */
            selectAll(): this;
            /**
             * deletes all selected items
             */
            deleteSelectedNodes(): this;
            /**
             * iterates over selected items;
             * see `dojo/dnd/Container.forInItems()` for details
             */
            forInSelectedItems<T extends Record<string, any>>(f: (i: ContainerItem<T>, idx?: number, container?: Container) => void, o?: Record<string, any>): void;
            /**
             * event processor for onmousemove
             */
            onMouseMove(e: Event): void;
            /**
             * this function is called once, when mouse is over our container
             */
            onOverEvent(): void;
            /**
             * this function is called once, when mouse is out of our container
             */
            onOutEvent(): void;
            /**
             * unselects all items
             */
            _removeSelection(): this;
            _removeAnchor(): this;
        }
        interface SelectorConstructor {
            /**
             * constructor of the Selector
             */
            new (node: Node | string, params?: ContainerArgs): Selector;
            prototype: Selector;
        }
        /**
         * a dict of parameters for DnD Source configuration. Note that any
         * property on Source elements may be configured, but this is the
         * short-list
         */
        interface SourceArgs {
            [arg: string]: any;
            /**
             * can be used as a DnD source. Defaults to true.
             */
            isSource?: boolean;
            /**
             * list of accepted types (text strings) for a target; defaults to
             * ["text"]
             */
            accept?: string[];
            /**
             * if true refreshes the node list on every operation; false by default
             */
            autoSync?: boolean;
            /**
             * copy items, if true, use a state of Ctrl key otherwisto
             * see selfCopy and selfAccept for more details
             */
            copyOnly?: boolean;
            /**
             * the move delay in pixels before detecting a drag; 0 by default
             */
            delay?: number;
            /**
             * a horizontal container, if true, vertical otherwise or when omitted
             */
            horizontal?: boolean;
            /**
             * copy items by default when dropping on itself,
             * false by default, works only if copyOnly is true
             */
            selfCopy?: boolean;
            /**
             * accept its own items when copyOnly is true,
             * true by default, works only if copyOnly is true
             */
            selfAccept?: boolean;
            /**
             * allows dragging only by handles, false by default
             */
            withHandles?: boolean;
            /**
             * generate text node for drag and drop, true by default
             */
            generateText?: boolean;
        }
        interface Source extends Selector {
            /**
             * checks if the target can accept nodes from this source
             */
            checkAcceptance(source: Container, nodes: HTMLElement[]): boolean;
            /**
             * Returns true if we need to copy items, false to move.
             * It is separated to be overwritten dynamically, if needed.
             */
            copyState(keyPressed: boolean, self?: boolean): boolean;
            /**
             * topic event processor for /dnd/source/over, called when detected a current source
             */
            onDndSourceOver(source: Container): void;
            /**
             * topic event processor for /dnd/start, called to initiate the DnD operation
             */
            onDndStart(source: Container, nodes: HTMLElement[], copy?: boolean): void;
            /**
             * topic event processor for /dnd/drop, called to finish the DnD operation
             */
            onDndDrop(source: Container, nodes: HTMLElement[], copy: boolean, target: Container): void;
            /**
             * topic event processor for /dnd/cancel, called to cancel the DnD operation
             */
            onDndCancel(): void;
            /**
             * called only on the current target, when drop is performed
             */
            onDrop(source: Container, nodes: HTMLElement[], copy?: boolean): void;
            /**
             * called only on the current target, when drop is performed
             * from an external source
             */
            onDropExternal(source: Container, nodes: HTMLElement[], copy?: boolean): void;
            /**
             * called only on the current target, when drop is performed
             * from the same target/source
             */
            onDropInternal(nodes: HTMLElement[], copy?: boolean): void;
            /**
             * called during the active DnD operation, when items
             * are dragged over this target, and it is not disabled
             */
            onDraggingOver(): void;
            /**
             * called during the active DnD operation, when items
             * are dragged away from this target, and it is not disabled
             */
            onDraggingOut(): void;
            /**
             * this function is called once, when mouse is over our container
             */
            onOverEvent(): void;
            /**
             * this function is called once, when mouse is out of our container
             */
            onOutEvent(): void;
            /**
             * assigns a class to the current target anchor based on "before" status
             */
            _markTargetAnchor(before?: boolean): void;
            /**
             * removes a class of the current target anchor based on "before" status
             */
            _unmarkTargetAnchor(): void;
            /**
             * changes source's state based on "copy" status
             */
            _markDndStatus(copy?: boolean): void;
            /**
             * checks if user clicked on "approved" items
             */
            _legalMouseDown(e?: Event): boolean;
        }
        interface SourceConstructor {
            new (node: Node | string, params?: SourceArgs): Source;
            prototype: Source;
        }
        interface Target extends Source {
        }
        interface TargetConstructor {
            new (node: HTMLElement, params: SourceArgs): Target;
            prototype: Target;
        }
        interface TimedMoveableArgs extends MoveableArgs {
            timeout?: number;
        }
        interface TimedMoveable extends Moveable {
            onMoveStop(mover: Mover): void;
            onMove(mover: Mover, leftTop: DndLocation): void;
        }
        interface TimedMoveableConstructor {
            new (node: HTMLElement, params?: TimedMoveableArgs): TimedMoveable;
            prototype: TimedMoveable;
        }
    }
}
declare module "dojo/dnd/common" {
    var o: DojoJS.dnd.Common;
    global {
        namespace DojoJS {
            interface DojoDND extends DojoJS.dnd.Common {
            }
            interface Dojo {
                dnd: DojoDND;
            }
        }
    }
    export = o;
}
declare module "dojo/dnd/autoscroll" {
    var autoscroll: DojoJS.dnd.AutoScroll;
    global {
        namespace DojoJS {
            interface DojoDND {
                autoscroll: typeof autoscroll;
            }
            interface Dojo {
                dnd: DojoDND;
            }
        }
    }
    export = autoscroll;
}
declare module "dojo/dnd/Mover" {
    import Evented = require("dojo/Evented");
    var Mover: DojoJS.DojoClass<Evented, []>;
    global {
        namespace DojoJS {
            interface DojoDND {
                Mover: typeof Mover;
            }
            interface Dojo {
                dnd: DojoDND;
            }
        }
    }
    export = Mover;
}
declare module "dojo/dnd/Moveable" {
    import Evented = require("dojo/Evented");
    var Moveable: DojoJS.DojoClass<Evented & DojoJS.dnd.Moveable, []>;
    global {
        namespace DojoJS {
            interface DojoDND {
                Moveable: typeof Moveable;
            }
            interface Dojo {
                dnd: DojoDND;
            }
        }
    }
    export = Moveable;
}
declare module "dojo/dnd/TimedMoveable" {
    var TimedMoveable: DojoJS.DojoClass<import("dojo/Evented") & DojoJS.dnd.Moveable & DojoJS.dnd.TimedMoveable, []>;
    global {
        namespace DojoJS {
            interface DojoDND {
                TimedMoveable: typeof TimedMoveable;
            }
            interface Dojo {
                dnd: DojoDND;
            }
        }
    }
    export = TimedMoveable;
}
declare module "dojo/Stateful" {
    var Stateful: DojoJS.DojoClass<DojoJS.Stateful, []>;
    global {
        namespace DojoJS {
            interface WatchHandle extends Handle {
                unwatch(): void;
            }
            interface Stateful {
                /**
                 * Used across all instances a hash to cache attribute names and their getter
                 * and setter names.
                 */
                _attrPairNames: {
                    [attr: string]: string;
                };
                /**
                 * Helper function for get() and set().
                 * Caches attribute name values so we don't do the string ops every time.
                 */
                _getAttrNames(name: string): string;
                /**
                 * Automatic setting of params during construction
                 */
                postscript(params?: Object): void;
                /**
                 * Get a property on a Stateful instance.
                 */
                get(name: string): any;
                /**
                 * Set a property on a Stateful instance
                 */
                set(name: string, value: any): this;
                set(name: string, ...values: any[]): this;
                set(name: Object): this;
                /**
                 * Internal helper for directly changing an attribute value.
                 */
                _changeAttrValue(name: string, value: any): this;
                /**
                 * Watches a property for changes
                 */
                watch(callback: (prop: string, oldValue: any, newValue: any) => void): WatchHandle;
                watch(name: string, callback: (prop: string, oldValue: any, newValue: any) => void): WatchHandle;
            }
            interface Dojo {
                Stateful: typeof Stateful;
            }
        }
    }
    export = Stateful;
}
declare module "dijit/a11y" {
    var a11y: {
        _isElementShown: (e: any) => boolean;
        hasDefaultTabStop: (e: any) => any;
        effectiveTabIndex: (e: any) => any;
        isTabNavigable: (e: any) => boolean;
        isFocusable: (e: any) => boolean;
        _getTabNavigable: (e: any) => {
            first: any;
            last: any;
            lowest: any;
            highest: any;
        };
        getFirstInTabbingOrder: (e: any, i: any) => any;
        getLastInTabbingOrder: (e: any, i: any) => any;
    };
    type A11y = typeof a11y;
    global {
        namespace DojoJS {
            interface Dijit extends A11y {
            }
        }
    }
    export = a11y;
}
declare module "dijit/registry" {
    var registry: DijitJS.Registry;
    global {
        namespace DojoJS {
            interface Registry extends DijitJS.Registry {
            }
        }
    }
    export = registry;
}
declare module "dijit/focus" {
    import Evented = require("dojo/Evented");
    var focus: DojoJS.Stateful & Evented & DijitJS.Focus & DojoJS.DojoClassObject;
    global {
        namespace DojoJS {
            interface Dijit {
                focus: typeof focus;
            }
        }
    }
    export = focus;
}
declare module "dijit/_base/manager" {
    import dijit = require("dijit/main");
    var manager: {
        byId: <T extends DijitJS._WidgetBase>(id: string | T) => T;
        getUniqueId: (widgetType: string) => string;
        findWidgets: (root: Node, skipNode?: Node) => DijitJS._WidgetBase[];
        _destroyAll: any;
        byNode: <T extends DijitJS._WidgetBase>(node: Element | Node) => T;
        getEnclosingWidget: (node: Element | Node) => DijitJS._WidgetBase;
        defaultDuration: number;
    };
    type Manager = typeof manager;
    global {
        namespace DojoJS {
            interface Dijit extends Manager {
            }
        }
    }
    export = dijit;
}
declare module "dijit/_WidgetBase" {
    var _WidgetBase: DojoJS.DojoClass<DojoJS.Stateful & {
        destroy: (e: any) => void;
        own: () => IArguments;
    }, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                _WidgetBase: typeof _WidgetBase;
            }
        }
    }
    export = _WidgetBase;
}
declare module "dijit/a11yclick" {
    var a11yclick: DijitJS.A11yClick;
    export = a11yclick;
}
declare module "dijit/_OnDijitClickMixin" {
    var _OnDijitClickMixin: DijitJS._OnDijitClickMixinConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _OnDijitClickMixin: typeof _OnDijitClickMixin;
            }
        }
    }
    export = _OnDijitClickMixin;
}
declare module "dijit/_FocusMixin" {
    var _FocusMixin: DojoJS.DojoClass<{
        _focusManager: DojoJS.Stateful & import("dojo/Evented") & DijitJS.Focus & DojoJS.DojoClassObject;
    }, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                _FocusMixin: typeof _FocusMixin;
            }
        }
    }
    export = _FocusMixin;
}
declare module "dojo/uacss" {
    import has = require("dojo/sniff");
    export = has;
}
declare module "dojo/hccss" {
    import has = require("dojo/has");
    global {
        namespace DojoJS {
            interface Has {
                (name: 'highcontrast'): void | boolean;
            }
        }
    }
    export = has;
}
declare module "dijit/hccss" {
    import has = require("dojo/hccss");
    export = has;
}
declare module "dijit/_Widget" {
    import "dojo/uacss";
    import "dijit/hccss";
    var _Widget: DojoJS.DojoClass<DijitJS._Widget>;
    global {
        namespace DojoJS {
            interface Dijit {
                _Widget: typeof _Widget;
            }
        }
    }
    export = _Widget;
}
declare module "dojo/request/default" {
    const _default_30: {
        getPlatformDefaultId: () => "./xhr" | "./node";
        load: (id: string, _: any, loaded: Function) => void;
    };
    export = _default_30;
}
declare module "dojo/request" {
    import def = require("dojo/request/default");
    export = def;
}
declare module "dojo/text" {
    const _default_31: {
        /**
         * the dojo/text caches it's own resources because of dojo.cache
         */
        dynamic: boolean;
        normalize: (e: any, t: any) => string;
        load: (e: any, t: any, i: any) => void;
    };
    export = _default_31;
    global {
        namespace DojoJS {
            interface Dojo {
                /**
                 * A getter and setter for storing the string content associated with the
                 * module and url arguments.
                 */
                cache: (module: string | Record<string, any>, url: string, value?: string | {
                    value: string;
                    sanitize?: boolean;
                }) => string;
            }
        }
    }
}
declare module "dojo/cache" {
    import "dojo/text";
    const _default_32: (module: string | Record<string, any>, url: string, value?: string | {
        value: string;
        sanitize?: boolean;
    } | undefined) => string;
    export = _default_32;
}
declare module "dojo/string" {
    interface DojoString {
        /**
         * Efficiently escape a string for insertion into HTML (innerHTML or attributes), replacing &, <, >, ", ', and / characters.
         */
        escape(str: string): string;
        /**
         * Efficiently replicate a string `n` times.
         */
        rep(str: string, num: number): string;
        /**
         * Pad a string to guarantee that it is at least `size` length by
         * filling with the character `ch` at either the start or end of the
         * string. Pads at the start, by default.
         */
        pad(text: string, size: number, ch?: string, end?: boolean): string;
        /**
         * Performs parameterized substitutions on a string. Throws an
         * exception if any parameter is unmatched.
         */
        substitute(template: string, map: Object | any[], transform?: (value: any, key: string) => any, thisObject?: Object): string;
        /**
         * Trims whitespace from both sides of the string
         */
        trim(str: string): string;
    }
    var string: DojoString;
    global {
        namespace DojoJS {
            interface Dojo {
                string: typeof string;
            }
        }
    }
    export = string;
}
declare module "dijit/_AttachMixin" {
    var _AttachMixin: DojoJS.DojoClass<DijitJS._AttachMixin, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                _AttachMixin: typeof _AttachMixin;
            }
        }
    }
    export = _AttachMixin;
}
declare module "dijit/_TemplatedMixin" {
    var _TemplatedMixin: DijitJS._TemplatedMixinConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _TemplatedMixin: typeof _TemplatedMixin;
            }
        }
    }
    export = _TemplatedMixin;
}
declare module "dijit/_CssStateMixin" {
    var _CssStateMixin: DojoJS.DojoClass<[DijitJS._CssStateMixin], []>;
    global {
        namespace DojoJS {
            interface Dijit {
                _CssStateMixin: typeof _CssStateMixin;
            }
        }
    }
    export = _CssStateMixin;
}
declare module "dojo/store/util/QueryResults" {
    var QueryResults: QueryResultsFunction;
    interface QueryResultsFunction {
        /**
         * A function that wraps the results of a store query with additional
         * methods.
         */
        <T extends Object>(results: T[]): DojoJS.QueryResults<T>;
    }
    global {
        namespace DojoJS {
            interface QueryResults<T extends Object> extends ArrayLike<T> {
                /**
                 * Iterates over the query results, based on
                 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach.
                 * Note that this may executed asynchronously. The callback may be called
                 * after this function returns.
                 */
                forEach(callback: (item: T, id: string | number, results: this) => void, thisObject?: Object): void | this;
                /**
                 * Filters the query results, based on
                 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter.
                 * Note that this may executed asynchronously. The callback may be called
                 * after this function returns.
                 */
                filter(callback: (item: T, id: string | number, results: this) => boolean, thisObject?: Object): this;
                /**
                 * Maps the query results, based on
                 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map.
                 * Note that this may executed asynchronously. The callback may be called
                 * after this function returns.
                 */
                map<U extends object>(callback: (item: T, id: string | number, results: this) => U, thisObject?: Object): QueryResults<U>;
                /**
                 * This registers a callback for when the query is complete, if the query is asynchronous.
                 * This is an optional method, and may not be present for synchronous queries.
                 */
                then?: <U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null) => Promise<U>;
                /**
                 * This registers a callback for notification of when data is modified in the query results.
                 * This is an optional method, and is usually provided by dojo/store/Observable.
                 */
                total: number | Promise<number>;
            }
            interface QueryOptions {
                /**
                 * A list of attributes to sort on, as well as direction
                 * For example:
                 * | [{attribute:"price", descending: true}].
                 * If the sort parameter is omitted, then the natural order of the store may be
                 * applied if there is a natural order.
                 */
                sort?: {
                    /**
                     * The name of the attribute to sort on.
                     */
                    attribute: string;
                    /**
                     * The direction of the sort.  Default is false.
                     */
                    descending?: boolean;
                }[];
                /**
                 * The first result to begin iteration on
                 */
                start?: number;
                /**
                 * The number of how many results should be returned.
                 */
                count?: number;
            }
            interface DojoStoreUtil {
                QueryResults: QueryResultsFunction;
            }
            interface DojoStore {
                util: DojoStoreUtil;
            }
            interface Dojo {
                store: DojoStore;
            }
        }
    }
    export = QueryResults;
}
declare module "dojo/store/util/SimpleQueryEngine" {
    function SimpleQueryEngine<O extends DojoJS.QueryOptions>(query: string | Object | Function, options?: O): {
        (array: Object[]): Object[];
        matches(object: Object): boolean;
    };
    global {
        namespace DojoJS {
            interface DojoStoreUtil {
                SimpleQueryEngine: typeof SimpleQueryEngine;
            }
            interface DojoStore {
                util: DojoStoreUtil;
            }
            interface Dojo {
                store: DojoStore;
            }
        }
    }
    export = SimpleQueryEngine;
}
declare module "dojo/store/Memory" {
    interface MemoryOptions<T extends Object> {
        data?: T[];
        idProperty?: string;
        queryEngine?: typeof import("dojo/store/util/SimpleQueryEngine");
        setData?: (data: T[]) => void;
    }
    interface PutDirectives<T extends Object> {
        /**
         * Indicates the identity of the object if a new object is created
         */
        id?: string | number;
        /**
         * If the collection of objects in the store has a natural ordering,
         * this indicates that the created or updated object should be placed before the
         * object specified by the value of this property. A value of null indicates that the
         * object should be last.
         */
        before?: T;
        /**
         * If the store is hierarchical (with single parenting) this property indicates the
         * new parent of the created or updated object.
         */
        parent?: T;
        /**
         * If this is provided as a boolean it indicates that the object should or should not
         * overwrite an existing object. A value of true indicates that a new object
         * should not be created, the operation should update an existing object. A
         * value of false indicates that an existing object should not be updated, a new
         * object should be created (which is the same as an add() operation). When
         * this property is not provided, either an update or creation is acceptable.
         */
        overwrite?: boolean;
    }
    interface Memory<T extends Object> {
        /**
         * If the store has a single primary key, this indicates the property to use as the
         * identity property. The values of this property should be unique.
         */
        idProperty: string;
        /**
         * If the store can be queried locally (on the client side in JS), this defines
         * the query engine to use for querying the data store.
         * This takes a query and query options and returns a function that can execute
         * the provided query on a JavaScript array. The queryEngine may be replace to
         * provide more sophisticated querying capabilities. For example:
         * | var query = store.queryEngine({foo:"bar"}, {count:10});
         * | query(someArray) -> filtered array
         * The returned query function may have a "matches" property that can be
         * used to determine if an object matches the query. For example:
         * | query.matches({id:"some-object", foo:"bar"}) -> true
         * | query.matches({id:"some-object", foo:"something else"}) -> false
         */
        queryEngine: typeof import("dojo/store/util/SimpleQueryEngine");
        /**
         * Retrieves an object by its identity
         */
        get(id: string | number): T;
        /**
         * Returns an object's identity
         */
        getIdentity(object: T): string | number;
        /**
         * Stores an object
         */
        put<D extends PutDirectives<T>>(object: T, directives?: D): string | number;
        /**
         * Creates an object, throws an error if the object already exists
         */
        add<D extends PutDirectives<T>>(object: T, directives?: D): string | number;
        /**
         * Deletes an object by its identity
         */
        remove(id: string | number): void;
        /**
         * Queries the store for objects. This does not alter the store, but returns a
         * set of data from the store.
         */
        query(query: string | Object | Function, options?: DojoJS.QueryOptions): DojoJS.QueryResults<T>;
        /**
         * Starts a new transaction.
         * Note that a store user might not call transaction() prior to using put,
         * delete, etc. in which case these operations effectively could be thought of
         * as "auto-commit" style actions.
         */
        transaction(): Transaction;
        /**
         * Retrieves the children of an object.
         */
        getChildren(parent: T, options?: DojoJS.QueryOptions): DojoJS.QueryResults<T>;
        /**
         * Returns any metadata about the object. This may include attribution,
         * cache directives, history, or version information.
         */
        getMetadata(object: T): Object;
        /**
         * The array of all the objects in the memory store
         */
        data: T[];
        /**
         * An index of data indices into the data array by id
         */
        index: {
            [id: string]: number;
        };
        /**
         * Sets the given data as the source for this store, and indexes it
         */
        setData(data: T[]): void;
    }
    interface Transaction {
        /**
         * Commits the transaction. This may throw an error if it fails. Of if the operation
         * is asynchronous, it may return a promise that represents the eventual success
         * or failure of the commit.
         */
        commit(): void;
        /**
         * Aborts the transaction. This may throw an error if it fails. Of if the operation
         * is asynchronous, it may return a promise that represents the eventual success
         * or failure of the abort.
         */
        abort(): void;
    }
    interface MemoryConstructor extends DojoJS.DojoClass<Memory<Object>> {
        /**
         * This is a basic in-memory object store. It implements dojo/store/api/Store.
         */
        new <T extends Object>(options?: MemoryOptions<T>): Memory<T>;
    }
    global {
        namespace DojoJS {
            interface DojoStore {
                Memory: MemoryConstructor;
            }
            interface Dojo {
                store: DojoStore;
            }
        }
    }
    const _default_33: MemoryConstructor;
    export = _default_33;
}
declare namespace DijitJS {
    namespace form {
        interface Constraints {
            [prop: string]: any;
        }
        interface ConstrainedValueFunction<V, C extends Constraints, T> {
            /**
             * Returns a value that has been constrained by the constraints
             * @param   value       The value to constrain
             * @param   constraints The constraints to use
             * @returns             The constrained value
             */
            (value: V, constraints: C): T;
        }
        interface ConstrainedValidFunction<C extends Constraints> {
            /**
             * Returns true if the value is valid based on the constraints, otherwise
             * returns false.
             * @param   value       The value to check
             * @param   constraints The constraints to use
             * @returns             true if valid, otherwise false
             */
            (value: any, constraints: C): boolean;
        }
        interface ConstraintsToRegExpString<C extends Constraints> {
            /**
             * Takes a set of constraints and returns a RegExpString that can be used
             * to match values against
             * @param   constraints The constraints to use
             * @returns             The RegExpString that represents the constraints
             */
            (constraints: C): string;
        }
        interface SerializationFunction {
            (val: any, options?: Object): string;
        }
        interface _AutoCompleterMixin<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends _SearchMixin<T, Q, O> {
            /**
             * This is the item returned by the dojo/store/api/Store implementation that
             * provides the data for this ComboBox, it's the currently selected item.
             */
            item: T;
            /**
             * If user types in a partial string, and then tab out of the `<input>` box,
             * automatically copy the first entry displayed in the drop down list to
             * the `<input>` field
             */
            autoComplete: boolean;
            /**
             * One of: "first", "all" or "none".
             */
            highlightMatch: 'first' | 'all' | 'none';
            /**
             * The entries in the drop down list come from this attribute in the
             * dojo.data items.
             * If not specified, the searchAttr attribute is used instead.
             */
            labelAttr: string;
            /**
             * Specifies how to interpret the labelAttr in the data store items.
             * Can be "html" or "text".
             */
            labelType: string;
            /**
             * Flags to _HasDropDown to limit height of drop down to make it fit in viewport
             */
            maxHeight: number;
            /**
             * For backwards compatibility let onClick events propagate, even clicks on the down arrow button
             */
            _stopClickEvents: boolean;
            _getCaretPos(element: HTMLElement): number;
            _setCaretPos(element: HTMLElement, location: number): void;
            /**
             * Overrides _HasDropDown.loadDropDown().
             */
            loadDropDown(loadCallback: () => void): void;
            /**
             * signal to _HasDropDown that it needs to call loadDropDown() to load the
             * drop down asynchronously before displaying it
             */
            isLoaded(): boolean;
            /**
             * Overrides _HasDropDown.closeDropDown().  Closes the drop down (assuming that it's open).
             * This method is the callback when the user types ESC or clicking
             * the button icon while the drop down is open.  It's also called by other code.
             */
            closeDropDown(focus?: boolean): void;
            postMixInProperties(): void;
            postCreate(): void;
            /**
             * Highlights the string entered by the user in the menu.  By default this
             * highlights the first occurrence found. Override this method
             * to implement your custom highlighting.
             */
            doHighlight(label: string, find: string): string;
            reset(): void;
            labelFunc(item: T, store: any): string;
            set(name: 'value', value: string): this;
            set(name: 'item', value: T): this;
            set(name: 'disabled', value: boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ButtonMixin {
            /**
             * A mixin to add a thin standard API wrapper to a normal HTML button
             */
            label: string;
            /**
             * Type of button (submit, reset, button, checkbox, radio)
             */
            type: string;
            postCreate(): void;
            /**
             * Callback for when button is clicked.
             * If type="submit", return true to perform submit, or false to cancel it.
             */
            onClick(e: Event): boolean;
            onSetLabel(e: Event): void;
        }
        interface _CheckBoxMixin {
            /**
             * type attribute on `<input>` node.
             * Overrides `dijit/form/Button.type`.  Users should not change this value.
             */
            type: string;
            /**
             * As an initialization parameter, equivalent to value field on normal checkbox
             * (if checked, the value is passed as the value when form is submitted).
             */
            value: string;
            /**
             * Should this widget respond to user input?
             * In markup, this is specified as "readOnly".
             * Similar to disabled except readOnly form values are submitted.
             */
            readOnly: boolean;
            reset: () => void;
        }
        interface _ComboBoxMenu<T> extends _WidgetBase, _TemplatedMixin, _ListMouseMixin, _ComboBoxMenuMixin<T> {
            templateString: string;
            baseClass: string;
            /**
             * Add hover CSS
             */
            onHover(node: HTMLElement): void;
            /**
             * Remove hover CSS
             */
            onUnhover(node: HTMLElement): void;
            /**
             * Add selected CSS
             */
            onSelect(node: HTMLElement): void;
            /**
             * Remove selected CSS
             */
            onDeselect(node: HTMLElement): void;
            /**
             * Handles page-up and page-down keypresses
             */
            _page(up?: boolean): void;
            /**
             * Handle keystroke event forwarded from ComboBox, returning false if it's
             * a keystroke I recognize and process, true otherwise.
             */
            handleKey(evt: KeyboardEvent): boolean;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ComboBoxMenuConstructor extends _WidgetBaseConstructor<_ComboBoxMenu<any>> {
            new <T>(params: Object, srcNodeRef: Node | string): _ComboBoxMenu<T>;
        }
        interface _ComboBoxMenuMixin<T> {
            /**
             * Holds "next" and "previous" text for paging buttons on drop down
             */
            _messages: {
                next: string;
                previous: string;
            };
            onClick(node: HTMLElement): void;
            /**
             * Notifies ComboBox/FilteringSelect that user selected an option.
             */
            onChange(direction: number): void;
            /**
             * Notifies ComboBox/FilteringSelect that user clicked to advance to next/previous page.
             */
            onPage(direction: number): void;
            /**
             * Callback from dijit.popup code to this widget, notifying it that it closed
             */
            onClose(): void;
            /**
             * Fills in the items in the drop down list
             */
            createOptions(results: T[], options: DojoJS.QueryOptions, labelFunc: (item: T) => {
                html: boolean;
                label: string;
            }): void;
            /**
             * Clears the entries in the drop down list, but of course keeps the previous and next buttons.
             */
            clearResultList(): void;
            /**
             * Highlight the first real item in the list (not Previous Choices).
             */
            highlightFirstOption(): void;
            /**
             * Highlight the last real item in the list (not More Choices).
             */
            highlightLastOption(): void;
            selectFirstNode(): void;
            selectLastNode(): void;
            getHighlightedOption(): HTMLElement;
            set(name: 'value', value: Object): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface DateLocaleFormatOptions {
            /**
             * choice of 'time','date' (default: date and time)
             */
            selector?: 'time' | 'date';
            /**
             * choice of long, short, medium or full (plus any custom additions).  Defaults to 'short'
             */
            formatLength?: 'long' | 'short' | 'medium' | 'full';
            /**
             * override pattern with this string
             */
            datePattern?: string;
            /**
             * override strings for am in times
             */
            timePattern?: string;
            /**
             * override strings for pm in times
             */
            am?: string;
            /**
             * override strings for pm in times
             */
            pm?: string;
            /**
             * override the locale used to determine formatting rules
             */
            locale?: string;
            /**
             * (format only) use 4 digit years whenever 2 digit years are called for
             */
            fullYear?: boolean;
            /**
             * (parse only) strict parsing, off by default
             */
            strict?: boolean;
        }
        interface DateTimeConstraints extends Constraints, DateLocaleFormatOptions {
        }
        interface _DateTimeTextBox<T extends _WidgetBase> extends RangeBoundTextBox, _HasDropDown<T> {
            templateString: string;
            /**
             * Set this textbox to display a down arrow button, to open the drop down list.
             */
            hasDownArrow: boolean;
            cssStateNodes: CSSStateNodes;
            /**
             * Despite the name, this parameter specifies both constraints on the input
             * (including starting/ending dates/times allowed) as well as
             * formatting options like whether the date is displayed in long (ex: December 25, 2005)
             * or short (ex: 12/25/2005) format.  See `dijit/form/_DateTimeTextBox.__Constraints` for details.
             */
            constraints: DateTimeConstraints;
            /**
             * The constraints without the min/max properties. Used by the compare() method
             */
            _unboundedConstraints: DateTimeConstraints;
            pattern: (options?: DateLocaleFormatOptions | RangeBoundTextBoxConstraints) => string;
            /**
             * JavaScript namespace to find calendar routines.	 If unspecified, uses Gregorian calendar routines
             * at dojo/date and dojo/date/locale.
             */
            datePackage: string;
            postMixInProperties(): void;
            compare(val1: Date, val2: Date): number;
            autoWidth: boolean;
            /**
             * Formats the value as a Date, according to specified locale (second argument)
             */
            format: ConstrainedValueFunction<Date, DateTimeConstraints, string>;
            /**
             * Parses as string as a Date, according to constraints
             */
            parse: ConstrainedValueFunction<string, DateTimeConstraints, Date>;
            serialize(val: any, options?: {
                /**
                 * "date" or "time" for partial formatting of the Date object.
                 * Both date and time will be formatted by default.
                 */
                selector?: 'time' | 'date';
                /**
                 * if true, UTC/GMT is used for a timezone
                 */
                zulu?: boolean;
                /**
                 * if true, output milliseconds
                 */
                milliseconds?: boolean;
            }): string;
            /**
             * The default value to focus in the popupClass widget when the textbox value is empty.
             */
            dropDownDefaultValue: Date;
            /**
             * The value of this widget as a JavaScript Date object.  Use get("value") / set("value", val) to manipulate.
             * When passed to the parser in markup, must be specified according to `dojo/date/stamp.fromISOString()`
             */
            value: Date;
            _blankValue: string;
            /**
             * Name of the popup widget class used to select a date/time.
             * Subclasses should specify this.
             */
            popupClass: string | _WidgetBaseConstructor<T>;
            /**
             * Specifies constraints.selector passed to dojo.date functions, should be either
             * "date" or "time".
             * Subclass must specify this.
             */
            _selector: 'data' | 'time';
            buildRendering(): void;
            /**
             * Runs various tests on the value, checking for invalid conditions
             */
            _isInvalidDate(value: Date): boolean;
            get(name: 'displayedValue'): string;
            get(name: string): any;
            set(name: 'displayedValue', value: string): this;
            set(name: 'dropDownDefaultValue', value: Date): this;
            set(name: 'value', value: Date | string): this;
            set(name: 'constraints', value: DateTimeConstraints): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _DateTimeTextBoxConstructor<T extends _WidgetBase> extends _WidgetBaseConstructor<_DateTimeTextBox<T>> {
        }
        interface _ExpandingTextAreaMixin {
            postCreate(): void;
            startup(): void;
            resize(): void;
        }
        interface OnValidStateChange {
            (isValid?: boolean): void;
        }
        interface _FormMixin {
            /**
             * Will be "Error" if one or more of the child widgets has an invalid value,
             * "Incomplete" if not all of the required child widgets are filled in.  Otherwise, "",
             * which indicates that the form is ready to be submitted.
             */
            state: '' | 'Error' | 'Incomplete';
            /**
             * Returns all form widget descendants, searching through non-form child widgets like BorderContainer
             */
            _getDescendantFormWidgets(children?: _WidgetBase[]): _FormWidget[];
            reset(): void;
            /**
             * returns if the form is valid - same as isValid - but
             * provides a few additional (ui-specific) features:
             *
             * 1. it will highlight any sub-widgets that are not valid
             * 2. it will call focus() on the first invalid sub-widget
             */
            validate(): boolean;
            setValues(val: any): _FormMixin;
            getValues(): any;
            /**
             * Returns true if all of the widgets are valid.
             * Deprecated, will be removed in 2.0.  Use get("state") instead.
             */
            isValid(): boolean;
            /**
             * Stub function to connect to if you want to do something
             * (like disable/enable a submit button) when the valid
             * state changes on the form as a whole.
             *
             * Deprecated.  Will be removed in 2.0.  Use watch("state", ...) instead.
             */
            onValidStateChange: OnValidStateChange;
            /**
             * Compute what this.state should be based on state of children
             */
            _getState(): '' | 'Error' | 'Incomplete';
            /**
             * Deprecated method.   Applications no longer need to call this.   Remove for 2.0.
             */
            disconnectChildren(): void;
            /**
             * You can call this function directly, ex. in the event that you
             * programmatically add a widget to the form *after* the form has been
             * initialized.
             */
            connectChildren(inStartup?: boolean): void;
            /**
             * Called when child's value or disabled state changes
             */
            _onChildChange(attr?: string): void;
            startup(): void;
            destroy(preserveDom?: boolean): void;
        }
        interface _FormMixinConstructor extends DojoJS.DojoClass<_FormMixin> {
        }
        interface SelectOption {
            value?: string;
            label: string;
            selected?: boolean;
            disabled?: boolean;
        }
        interface _FormSelectWidget<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends _FormValueWidget {
            /**
             * Whether or not we are multi-valued
             */
            multiple: boolean;
            /**
             * The set of options for our select item.  Roughly corresponds to
             * the html `<option>` tag.
             */
            options: SelectOption[];
            /**
             * A store to use for getting our list of options - rather than reading them
             * from the `<option>` html tags.   Should support getIdentity().
             * For back-compat store can also be a dojo/data/api/Identity.
             */
            store: any;
            /**
             * A query to use when fetching items from our store
             */
            query: Q;
            /**
             * Query options to use when fetching from the store
             */
            queryOptions: O;
            /**
             * The entries in the drop down list come from this attribute in the dojo.store items.
             * If ``store`` is set, labelAttr must be set too, unless store is an old-style
             * dojo.data store rather than a new dojo/store.
             */
            labelAttr: string;
            /**
             * A callback to do with an onFetch - but before any items are actually
             * iterated over (i.e. to filter even further what you want to add)
             */
            onFetch: (items: T[]) => void;
            /**
             * Flag to sort the options returned from a store by the label of
             * the store.
             */
            sortByLabel: boolean;
            /**
             * By default loadChildren is called when the items are fetched from the
             * store.  This property allows delaying loadChildren (and the creation
             * of the options/menuitems) until the user clicks the button to open the
             * dropdown.
             */
            loadChildrenOnOpen: boolean;
            /**
             * This is the `dojo.Deferred` returned by setStore().
             * Calling onLoadDeferred.then() registers your
             * callback to be called only once, when the prior setStore completes.
             */
            onLoadDeferred: DojoJS.Deferred<void>;
            /**
             * Returns a given option (or options).
             */
            getOptions(valueOrIdx: string): SelectOption;
            getOptions(valueOrIdx: number): SelectOption;
            getOptions(valueOrIdx: SelectOption): SelectOption;
            getOptions(valueOrIdx: (string | number | SelectOption)[]): SelectOption[];
            getOptions(): SelectOption[];
            /**
             * Adds an option or options to the end of the select.  If value
             * of the option is empty or missing, a separator is created instead.
             * Passing in an array of options will yield slightly better performance
             * since the children are only loaded once.
             */
            addOption(option: SelectOption | SelectOption[]): void;
            /**
             * Removes the given option or options.  You can remove by string
             * (in which case the value is removed), number (in which case the
             * index in the options array is removed), or select option (in
             * which case, the select option with a matching value is removed).
             * You can also pass in an array of those values for a slightly
             * better performance since the children are only loaded once.
             * For numeric option values, specify {value: number} as the argument.
             */
            removeOption(option: string | number | SelectOption | (string | number | SelectOption)[]): void;
            /**
             * Updates the values of the given option.  The option to update
             * is matched based on the value of the entered option.  Passing
             * in an array of new options will yield better performance since
             * the children will only be loaded once.
             */
            updateOption(newOption: SelectOption | SelectOption[]): void;
            /**
             * Deprecated!
             */
            setStore(store: any, selectedValue?: T, fetchArgs?: {
                query: Q;
                queryOptions: O;
                onFetch: (items: T[], fetchArgs?: any) => void;
            }): any;
            /**
             * Sets the store you would like to use with this select widget.
             * The selected value is the value of the new store to set.  This
             * function returns the original store, in case you want to reuse
             * it or something.
             */
            _deprecatedSetStore(store: any, selectedValue?: T, fetchArgs?: {
                query: Q;
                queryOptions: O;
                onFetch: (items: T[], fetchArgs?: any) => void;
            }): any;
            /**
             * Loads the children represented by this widget's options.
             * reset the menu to make it populatable on the next click
             */
            _loadChildren(): void;
            /**
             * Sets the "selected" class on the item for styling purposes
             */
            _updateSelection(): void;
            /**
             * Returns the value of the widget by reading the options for
             * the selected flag
             */
            _getValueFromOpts(): string;
            buildRendering(): void;
            /**
             * Loads our options and sets up our dropdown correctly.  We
             * don't want any content, so we don't call any inherit chain
             * function.
             */
            _fillContent(): void;
            /**
             * sets up our event handling that we need for functioning
             * as a select
             */
            postCreate(): void;
            startup(): void;
            /**
             * Clean up our connections
             */
            destroy(preserveDom?: boolean): void;
            /**
             * User-overridable function which, for the given option, adds an
             * item to the select.  If the option doesn't have a value, then a
             * separator is added in that place.  Make sure to store the option
             * in the created option widget.
             */
            _addOptionItem(option: SelectOption): void;
            /**
             * User-overridable function which, for the given option, removes
             * its item from the select.
             */
            _removeOptionItem(option: SelectOption): void;
            /**
             * Overridable function which will set the display for the
             * widget.  newDisplay is either a string (in the case of
             * single selects) or array of strings (in the case of multi-selects)
             */
            _setDisplay(newDisplay: string | string[]): void;
            /**
             * Overridable function to return the children that this widget contains.
             */
            _getChildren(): any[];
            /**
             * hooks into this.attr to provide a mechanism for getting the
             * option items for the current value of the widget.
             */
            _getSelectedOptionsAttr(): SelectOption[];
            /**
             * a function that will "fake" loading children, if needed, and
             * if we have set to not load children until the widget opens.
             */
            _pseudoLoadChildren(items: T[]): void;
            /**
             * a function that can be connected to in order to receive a
             * notification that the store has finished loading and all options
             * from that store are available
             */
            onSetStore(): void;
        }
        interface _FormValueMixin extends _FormWidgetMixin {
            /**
             * Should this widget respond to user input?
             * In markup, this is specified as "readOnly".
             * Similar to disabled except readOnly form values are submitted.
             */
            readOnly: boolean;
            postCreate(): void;
            /**
             * Restore the value to the last value passed to onChange
             */
            undo(): void;
            /**
             * Reset the widget's value to what it was at initialization time
             */
            reset(): void;
            _hasBeenBlurred?: boolean;
        }
        interface _FormValueWidget extends _FormWidget, _FormValueMixin {
            /**
             * Work around table sizing bugs on IE7 by forcing redraw
             */
            _layoutHackIE7(): void;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _FormValueWidgetConstructor extends _WidgetBaseConstructor<_FormValueWidget> {
        }
        interface _FormWidget extends _Widget, _TemplatedMixin, _CssStateMixin, _FormWidgetMixin {
            setDisabled(disabled: boolean): void;
            setValue(value: string): void;
            postMixInProperties(): void;
            set(name: 'value', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _FormWidgetConstructor extends _WidgetBaseConstructor<_FormWidget> {
        }
        interface _FormWidgetMixin {
            /**
             * Name used when submitting form; same as "name" attribute or plain HTML elements
             */
            name: string;
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             */
            alt: string;
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             */
            value: any;
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             */
            type: string;
            /**
             * Apply aria-label in markup to the widget's focusNode
             */
            'aria-label': string;
            /**
             * Order fields are traversed when user hits the tab key
             */
            tabIndex: number;
            /**
             * Should this widget respond to user input?
             * In markup, this is specified as "disabled='disabled'", or just "disabled".
             */
            disabled: boolean;
            /**
             * Fires onChange for each value change or only on demand
             */
            intermediateChanges: boolean;
            /**
             * On focus, should this widget scroll into view?
             */
            scrollOnFocus: boolean;
            /**
             * Tells if this widget is focusable or not.  Used internally by dijit.
             */
            isFocusable(): boolean;
            /**
             * Put focus on this widget
             */
            focus(): void;
            /**
             * Compare 2 values (as returned by get('value') for this widget).
             */
            compare(val1: any, val2: any): number;
            /**
             * Callback when this widget's value is changed.
             */
            onChange(value: string): void;
            /**
             * Overrides _Widget.create()
             */
            create(params?: any, srcNodeRef?: HTMLElement): void;
            destroy(preserveDom?: boolean): void;
            set(name: 'disabled', value: boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ListBase {
            /**
             * currently selected node
             */
            selected: HTMLElement;
            /**
             * Select the first displayed item in the list.
             */
            selectFirstNode(): void;
            /**
             * Select the last displayed item in the list
             */
            selectLastNode(): void;
            /**
             * Select the item just below the current selection.
             * If nothing selected, select first node.
             */
            selectNextNode(): void;
            /**
             * Select the item just above the current selection.
             * If nothing selected, select last node (if
             * you select Previous and try to keep scrolling up the list).
             */
            selectPreviousNode(): void;
            set(name: 'selected', value: HTMLElement): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ListMouseMixin extends _ListBase {
            postCreate(): void;
        }
        interface _RadioButtonMixin {
            /**
             * type attribute on `<input>` node.
             * Users should not change this value.
             */
            type: string;
        }
        interface _SearchMixin<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> {
            /**
             * Argument to data provider.
             * Specifies maximum number of search results to return per query
             */
            pageSize: number;
            /**
             * Reference to data provider object used by this ComboBox.
             * The store must accept an object hash of properties for its query. See `query` and `queryExpr` for details.
             */
            store: any;
            /**
             * Mixin to the store's fetch.
             * For example, to set the sort order of the ComboBox menu, pass:
             * { sort: [{attribute:"name",descending: true}] }
             * To override the default queryOptions so that deep=false, do:
             * { queryOptions: {ignoreCase: true, deep: false} }
             */
            fetchProperties: {
                [property: string]: any;
            };
            /**
             * A query that can be passed to `store` to initially filter the items.
             * ComboBox overwrites any reference to the `searchAttr` and sets it to the `queryExpr` with the user's input substituted.
             */
            query: Q;
            /**
             * Alternate to specifying a store.  Id of a dijit/form/DataList widget.
             */
            list: string;
            /**
             * Delay in milliseconds between when user types something and we start
             * searching based on that value
             */
            searchDelay: number;
            /**
             * Search for items in the data store where this attribute (in the item)
             * matches what the user typed
             */
            searchAttr: string;
            /**
             * This specifies what query is sent to the data store,
             * based on what the user has typed.  Changing this expression will modify
             * whether the results are only exact matches, a "starting with" match,
             * etc.
             * `${0}` will be substituted for the user text.
             * `*` is used for wildcards.
             * `${0}*` means "starts with", `*${0}*` means "contains", `${0}` means "is"
             */
            queryExpr: string;
            /**
             * Set true if the query should ignore case when matching possible items
             */
            ignoreCase: boolean;
            /**
             * Helper function to convert a simple pattern to a regular expression for matching.
             */
            _patternToRegExp(pattern: string): RegExp;
            _abortQuery(): void;
            /**
             * Handles input (keyboard/paste) events
             */
            _processInput(e: KeyboardEvent): void;
            /**
             * Callback when a search completes.
             */
            onSearch(results: T[], query: Q, options: O): void;
            _startSearchFromInput(): void;
            /**
             * Starts a search for elements matching text (text=="" means to return all items
             * and calls onSearch(...) when the search completes, to display the results.
             */
            _startSearch(text: string): void;
            postMixInProperties(): void;
            set(name: 'list', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface AdjustFunction {
            (val: any, delta: number): any;
        }
        interface _Spinner extends RangeBoundTextBox {
            /**
             * Number of milliseconds before a held arrow key or up/down button becomes typematic
             */
            defaultTimeout: number;
            /**
             * minimum number of milliseconds that typematic event fires when held key or button is held
             */
            minimumTimeout: number;
            /**
             * Fraction of time used to change the typematic timer between events.
             * 1.0 means that each typematic event fires at defaultTimeout intervals.
             * Less than 1.0 means that each typematic event fires at an increasing faster rate.
             */
            timeoutChangeRate: number;
            /**
             * Adjust the value by this much when spinning using the arrow keys/buttons
             */
            smallDelta: number;
            /**
             * Adjust the value by this much when spinning using the PgUp/Dn keys
             */
            largeDelta: number;
            templateString: string;
            baseClass: string;
            cssStateNodes: CSSStateNodes;
            /**
             * Overridable function used to adjust a primitive value(Number/Date/...) by the delta amount specified.
             * The val is adjusted in a way that makes sense to the object type.
             */
            adjust: AdjustFunction;
            postCreate(): void;
        }
        interface _SpinnerConstrctor extends _WidgetBaseConstructor<_Spinner> {
        }
        interface _TextBoxMixin<C extends Constraints> {
            /**
             * Removes leading and trailing whitespace if true.  Default is false.
             */
            trim: boolean;
            /**
             * Converts all characters to uppercase if true.  Default is false.
             */
            uppercase: boolean;
            /**
             * Converts all characters to lowercase if true.  Default is false.
             */
            lowercase: boolean;
            /**
             * Converts the first character of each word to uppercase if true.
             */
            propercase: boolean;
            /**
             * HTML INPUT tag maxLength declaration.
             */
            maxLength: string;
            /**
             * If true, all text will be selected when focused with mouse
             */
            selectOnClick: boolean;
            /**
             * Defines a hint to help users fill out the input field (as defined in HTML 5).
             * This should only contain plain text (no html markup).
             */
            placeHolder: string;
            /**
             * For subclasses like ComboBox where the displayed value
             * (ex: Kentucky) and the serialized value (ex: KY) are different,
             * this represents the displayed value.
             *
             * Setting 'displayedValue' through set('displayedValue', ...)
             * updates 'value', and vice-versa.  Otherwise 'value' is updated
             * from 'displayedValue' periodically, like onBlur etc.
             */
            displayedValue: string;
            /**
             * Replaceable function to convert a value to a properly formatted string.
             */
            format: ConstrainedValueFunction<any, C, any>;
            /**
             * Replaceable function to convert a formatted string to a value
             */
            parse: ConstrainedValueFunction<any, C, any>;
            /**
             * Connect to this function to receive notifications of various user data-input events.
             * Return false to cancel the event and prevent it from being processed.
             * Note that although for historical reasons this method is called `onInput()`, it doesn't
             * correspond to the standard DOM "input" event, because it occurs before the input has been processed.
             */
            onInput(e: Event): void;
            postCreate(): void;
            /**
             * if the textbox is blank, what value should be reported
             */
            _blankValue: string;
            /**
             * Auto-corrections (such as trimming) that are applied to textbox
             * value on blur or form submit.
             */
            filter<T>(val: T): T;
            filter<T extends number>(value: T): T;
            _setBlurValue(): void;
            reset(): void;
        }
        interface _ToggleButtonMixin {
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             * In markup, specified as "checked='checked'" or just "checked".
             * True if the button is depressed, or the checkbox is checked,
             * or the radio button is selected, etc.
             */
            checked: boolean;
            postCreate(): void;
            /**
             * Reset the widget's value to what it was at initialization time
             */
            reset(): void;
            _hasBeenBlurred?: boolean;
        }
        interface Button extends _FormWidget, _ButtonMixin {
            /**
             * Set this to true to hide the label text and display only the icon.
             * (If showLabel=false then iconClass must be specified.)
             * Especially useful for toolbars.
             * If showLabel=true, the label will become the title (a.k.a. tooltip/hint)
             */
            showLabel: boolean;
            /**
             * Class to apply to DOMNode in button to make it display an icon
             */
            iconClass: string;
            baseClass: string;
            templateString: string;
            postCreate(): void;
            setLabel(content: string): void;
            onLabelSet(e: Event): void;
            onClick(e: Event): boolean;
            set(name: 'showLabel', value: boolean): this;
            set(name: 'value', value: string): this;
            set(name: 'name', value: string): this;
            set(name: 'label', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface ButtonConstructor extends _WidgetBaseConstructor<Button> {
        }
        interface CheckBox extends ToggleButton, _CheckBoxMixin {
            templateString: string;
            baseClass: string;
            postMixInProperties(): void;
            value: string;
            set(name: 'value', value: string | boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface CheckBoxConstructor extends _WidgetBaseConstructor<CheckBox> {
        }
        interface ComboBox<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions, C extends Constraints> extends ValidationTextBox<C>, ComboBoxMixin<T, Q, O> {
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface ComboBoxConstructor extends _WidgetBaseConstructor<ComboBox<any, any, any, any>> {
            new <T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions, C extends Constraints>(params: Object, srcNodeRef: Node | string): ComboBox<T, Q, O, C>;
        }
        interface ComboBoxMixin<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends _HasDropDown<_ComboBoxMenu<T>>, _AutoCompleterMixin<T, Q, O> {
            /**
             * Dropdown widget class used to select a date/time.
             * Subclasses should specify this.
             */
            dropDownClass: _ComboBoxMenu<T>;
            /**
             * Set this textbox to have a down arrow button, to display the drop down list.
             * Defaults to true.
             */
            hasDownArrow: boolean;
            templateString: string;
            baseClass: string;
            /**
             * Reference to data provider object used by this ComboBox.
             *
             * Should be dojo/store/api/Store, but dojo/data/api/Read supported
             * for backwards compatibility.
             */
            store: any;
            cssStateNodes: CSSStateNodes;
            postMixInProperties(): void;
            buildRendering(): void;
        }
        interface ComboBoxMixinConstructor<T extends object, U extends Function, V extends DojoJS.QueryOptions> extends _WidgetBaseConstructor<ComboBoxMixin<T, U, V>> {
        }
        interface NumberFormatOptions {
            /**
             * override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
             * with this string.  Default value is based on locale.  Overriding this property will defeat
             * localization.  Literal characters in patterns are not supported.
             */
            pattern?: string;
            /**
             * choose a format type based on the locale from the following:
             * decimal, scientific (not yet supported), percent, currency. decimal by default.
             */
            type?: string;
            /**
             * fixed number of decimal places to show.  This overrides any
             * information in the provided pattern.
             */
            places?: number;
            /**
             * 5 rounds to nearest .5; 0 rounds to nearest whole (default). -1
             * means do not round.
             */
            round?: number;
            /**
             * override the locale used to determine formatting rules
             */
            locale?: string;
            /**
             * If false, show no decimal places, overriding places and pattern settings.
             */
            fractional?: boolean | [boolean, boolean];
        }
        interface CurrencyFormatOptions extends NumberFormatOptions {
            /**
             * Should not be set.  Value is assumed to be "currency".
             */
            type?: string;
            /**
             * localized currency symbol. The default will be looked up in table of supported currencies in `dojo.cldr`
             * A [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code will be used if not found.
             */
            symbol?: string;
            /**
             * an [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code, a three letter sequence like "USD".
             * For use with dojo.currency only.
             */
            currency?: string;
            /**
             * number of decimal places to show.  Default is defined based on which currency is used.
             */
            places?: number;
        }
        interface NumberParseOptions {
            /**
             * override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
             * with this string.  Default value is based on locale.  Overriding this property will defeat
             * localization.  Literal characters in patterns are not supported.
             */
            pattern?: string;
            /**
             * choose a format type based on the locale from the following:
             * decimal, scientific (not yet supported), percent, currency. decimal by default.
             */
            type?: string;
            /**
             * override the locale used to determine formatting rules
             */
            locale?: string;
            /**
             * strict parsing, false by default.  Strict parsing requires input as produced by the format() method.
             * Non-strict is more permissive, e.g. flexible on white space, omitting thousands separators
             */
            strict?: boolean;
            /**
             * Whether to include the fractional portion, where the number of decimal places are implied by pattern
             * or explicit 'places' parameter.  The value [true,false] makes the fractional portion optional.
             */
            fractional?: boolean | [boolean, boolean];
        }
        interface CurrencyParseOptions extends NumberParseOptions {
            /**
             * Should not be set.  Value is assumed to be "currency".
             */
            type?: string;
            /**
             * localized currency symbol. The default will be looked up in table of supported currencies in `dojo.cldr`
             * A [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code will be used if not found.
             */
            symbol?: string;
            /**
             * an [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code, a three letter sequence like "USD".
             * For use with dojo.currency only.
             */
            currency?: string;
            /**
             * number of decimal places to show.  Default is defined based on which currency is used.
             */
            places?: number;
            /**
             * Whether to include the fractional portion, where the number of decimal places are implied by the currency
             * or explicit 'places' parameter.  The value [true,false] makes the fractional portion optional.
             * By default for currencies, it the fractional portion is optional.
             */
            fractional?: boolean | [boolean, boolean];
        }
        interface NumberRegexpOptions {
            /**
             * override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
             * with this string.  Default value is based on locale.  Overriding this property will defeat
             * localization.
             */
            pattern?: string;
            /**
             * choose a format type based on the locale from the following:
             * decimal, scientific (not yet supported), percent, currency. decimal by default.
             */
            type?: string;
            /**
             * override the locale used to determine formatting rules
             */
            locacle?: string;
            /**
             * strict parsing, false by default.  Strict parsing requires input as produced by the format() method.
             * Non-strict is more permissive, e.g. flexible on white space, omitting thousands separators
             */
            strict?: boolean;
            /**
             * number of decimal places to accept: Infinity, a positive number, or
             * a range "n,m".  Defined by pattern or Infinity if pattern not provided.
             */
            places?: number | string;
        }
        interface CurrencyTextBoxConstraints extends NumberTextBoxConstraints, CurrencyFormatOptions, CurrencyParseOptions {
        }
        interface CurrencyTextBox extends NumberTextBox {
            /**
             * the [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code, a three letter sequence like "USD"
             */
            currency: string;
            /**
             * Despite the name, this parameter specifies both constraints on the input
             * (including minimum/maximum allowed values) as well as
             * formatting options.  See `dijit/form/CurrencyTextBox.__Constraints` for details.
             */
            constraints: CurrencyTextBoxConstraints;
            baseClass: string;
            _formatter: (value: number, options?: CurrencyFormatOptions) => string;
            _parser: (expression: string, options?: CurrencyParseOptions) => number;
            _regExpGenerator: (options?: NumberRegexpOptions) => string;
            /**
             * Parses string value as a Currency, according to the constraints object
             */
            parse(value: string, constraints: CurrencyTextBoxConstraints): string;
        }
        interface CurrencyTextBoxConstructor extends _WidgetBaseConstructor<CurrencyTextBox> {
        }
        interface DataList<T extends Object> extends Type<typeof import("dojo/store/Memory")> {
            /**
             * Get the option marked as selected, like `<option selected>`.
             * Not part of dojo.data API.
             */
            fetchSelectedItem(): T;
        }
        interface DataListConstructor {
            new <T extends Object>(params: Object, srcNodeRef: Node | string): DataList<T>;
        }
        interface DateTextBox extends _DateTimeTextBox<Calendar> {
            baseClass: string;
            popupClass: CalendarConstructor;
            _selector: "time" | "data";
            maxHeight: number;
            /**
             * The value of this widget as a JavaScript Date object, with only year/month/day specified.`
             */
            value: Date;
        }
        interface DateTextBoxConstructor extends _WidgetBaseConstructor<DateTextBox> {
        }
        interface DropDownButton<T extends _WidgetBase> extends Button, _Container, _HasDropDown<T> {
            baseClass: string;
            templateString: string;
            /**
             * Overrides _TemplatedMixin#_fillContent().
             * My inner HTML possibly contains both the button label and/or a drop down widget, like
             * <DropDownButton>  <span>push me</span>  <Menu> ... </Menu> </DropDownButton>
             */
            _fillContent(): void;
            startup(): void;
            /**
             * Returns whether or not we are loaded - if our dropdown has an href,
             * then we want to check that.
             */
            isLoaded(): boolean;
            /**
             * Default implementation assumes that drop down already exists,
             * but hasn't loaded it's data (ex: ContentPane w/href).
             * App must override if the drop down is lazy-created.
             */
            loadDropDown(callback: () => void): void;
            /**
             * Overridden so that focus is handled by the _HasDropDown mixin, not by
             * the _FormWidget mixin.
             */
            isFocusable(): boolean;
        }
        interface DropDownButtonConstructor extends _WidgetBaseConstructor<DropDownButton<any>> {
            new <T extends _WidgetBase>(params: Object, srcNodeRef: Node | string): DropDownButton<T>;
        }
        interface FilteringSelect<C extends Constraints, T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends MappedTextBox<C>, ComboBoxMixin<T, Q, O> {
            /**
             * True (default) if user is required to enter a value into this field.
             */
            required: boolean;
            _lastDisplayedValue: string;
            _isValidSubset(): boolean;
            isValid(): boolean;
            _refreshState(): void;
            /**
             * Callback from dojo.store after lookup of user entered value finishes
             */
            _callbackSetLabel(result: T[], query: Q, options: O, priorityChange?: boolean): void;
            _openResultList(results: T[], query: Q, options: O): void;
            undo(): void;
            set(name: 'displayedValue', value: string): this;
            set(name: 'item', value: T): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface FilteringSelectConstructor extends _WidgetBaseConstructor<FilteringSelect<any, any, any, any>> {
            new <C extends Constraints, T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions>(params: Object, srcNodeRef: Node | string): FilteringSelect<C, T, Q, O>;
        }
        interface Form extends _Widget, _TemplatedMixin, _FormMixin, layout._ContentPaneResizeMixin {
            name?: string;
            action?: string;
            method?: string;
            encType?: string;
            'accept-charset'?: string;
            accept?: string;
            target?: string;
            templateString: string;
            /**
             * Deprecated: use submit()
             */
            execute(formContents: Object): void;
            /**
             * Deprecated: use onSubmit()
             */
            onExecute(): void;
            /**
             * restores all widget values back to their init values,
             * calls onReset() which can cancel the reset by returning false
             */
            reset(e?: Event): void;
            /**
             * Callback when user resets the form. This method is intended
             * to be over-ridden. When the `reset` method is called
             * programmatically, the return value from `onReset` is used
             * to compute whether or not resetting should proceed
             */
            onReset(e?: Event): boolean;
            /**
             * Callback when user submits the form.
             */
            onSubmit(e?: Event): boolean;
            /**
             * programmatically submit form if and only if the `onSubmit` returns true
             */
            submit(): void;
        }
        interface FormConstructor extends _WidgetBaseConstructor<Form> {
        }
        /**
         * Hash marks for `dijit/form/HorizontalSlider`
         */
        interface HorizontalRule extends _Widget, _TemplatedMixin {
            /**
             * Number of hash marks to generate
             */
            count: number;
            /**
             * For HorizontalSlider, this is either "topDecoration" or "bottomDecoration", and indicates whether this rule goes above or below the slider.
             */
            container: string;
            /**
             * CSS style to apply to individual hash marks
             */
            ruleStyle: string;
            _positionPrefix: string;
            _positionSuffix: string;
            _suffix: string;
            _genHTML(pos: number): string;
            /**
             * VerticalRule will override this...
             */
            _isHorizontal: boolean;
        }
        interface HorizontalRuleConstructor extends _WidgetBaseConstructor<HorizontalRule> {
        }
        /**
         * Labels for `dijit/form/HorizontalSlider`
         */
        interface HorizontalRuleLabels extends HorizontalRule {
            /**
             * CSS style to apply to individual text labels
             */
            labelStyle: string;
            /**
             * Array of text labels to render - evenly spaced from left-to-right or bottom-to-top.
             * Alternately, minimum and maximum can be specified, to get numeric labels.
             */
            labels: string[];
            /**
             * Number of generated numeric labels that should be rendered as '' on the ends when labels[] are not specified
             */
            numericMargin: number;
            /**
             * Leftmost label value for generated numeric labels when labels[] are not specified
             */
            minimum: number;
            /**
             * Rightmost label value for generated numeric labels when labels[] are not specified
             */
            maximum: number;
            /**
             * pattern, places, lang, et al (see dojo.number) for generated numeric labels when labels[] are not specified
             */
            constraints: {
                pattern: string;
            };
            /**
             * Returns the value to be used in HTML for the label as part of the left: attribute
             */
            _calcPosition(pos: number): number;
            _genHTML(pos: number, ndx?: number): string;
            /**
             * extension point for bidi code
             */
            _genDirectionHTML(label: string): string;
            /**
             * Overridable function to return array of labels to use for this slider.
             * Can specify a getLabels() method instead of a labels[] array, or min/max attributes.
             */
            getLabels(): string[];
        }
        interface HorizontalRuleLabelsConstructor extends _WidgetBaseConstructor<HorizontalRuleLabels> {
        }
        interface _SliderMover extends DojoJS.dnd.Mover {
        }
        /**
         * A form widget that allows one to select a value with a horizontally draggable handle
         */
        interface HorizontalSlider extends _FormValueWidget, _Container {
            /**
             * Show increment/decrement buttons at the ends of the slider?
             */
            showButtons: boolean;
            /**
             * The minimum value the slider can be set to.
             */
            minimum: number;
            /**
             * The maximum value the slider can be set to.
             */
            maximum: number;
            /**
             * If specified, indicates that the slider handle has only 'discreteValues' possible positions, and that after dragging the handle, it will snap to the nearest possible position.
             * Thus, the slider has only 'discreteValues' possible values.
             *
             * For example, if minimum=10, maxiumum=30, and discreteValues=3, then the slider handle has three possible positions, representing values 10, 20, or 30.
             *
             * If discreteValues is not specified or if it's value is higher than the number of pixels in the slider bar, then the slider handle can be moved freely, and the slider's value will be computed/reported based on pixel position (in this case it will likely be fractional, such as 123.456789).
             */
            discreteValues: number;
            /**
             * If discreteValues is also specified, this indicates the amount of clicks (ie, snap positions) that the slider handle is moved via pageup/pagedown keys.
             * If discreteValues is not specified, it indicates the number of pixels.
             */
            pageIncrement: number;
            /**
             * If clicking the slider bar changes the value or not
             */
            clickSelect: boolean;
            /**
             * The time in ms to take to animate the slider handle from 0% to 100%, when clicking the slider bar to make the handle move.
             */
            slideDuration: number;
            _mousePixelCoord: string;
            _pixelCount: string;
            _startingPixelCoord: string;
            _handleOffsetCoord: string;
            _progressPixelSize: string;
            _onKeyUp(e: Event): void;
            _onKeyDown(e: Event): void;
            _onHandleClick(e: Event): void;
            /**
             * Returns true if direction is from right to left
             */
            _isReversed(): boolean;
            _onBarClick(e: Event): void;
            _setPixelValue(pixelValue: number, maxPixels: number, priorityChange?: boolean): void;
            _setValueAttr(value: number, priorityChange?: boolean): void;
            _bumpValue(signedChange: number, priorityChange: boolean): void;
            _onClkBumper(val: any): void;
            _onClkIncBumper(): void;
            _onClkDecBumper(): void;
            decrement(e: Event): void;
            increment(e: Event): void;
            _mouseWheeled(evt: Event): void;
            _typematicCallback(count: number, button: Element, e: Event): void;
        }
        interface HorizontalSliderConstructor extends _WidgetBaseConstructor<HorizontalSlider> {
            /**
             * for monkey patching
             */
            _Mover: _SliderMover;
        }
        interface MappedTextBox<C extends Constraints> extends ValidationTextBox<C> {
            postMixInProperties(): void;
            serialize: SerializationFunction;
            toString(): string;
            validate(isFocused?: boolean): boolean;
            buildRendering(): void;
            reset(): void;
        }
        interface MappedTextBoxConstructor extends _WidgetBaseConstructor<MappedTextBox<Constraints>> {
            new <C extends Constraints>(params: Object, srcNodeRef: Node | string): MappedTextBox<C>;
        }
        interface NumberSpinner extends _Spinner, NumberTextBoxMixin {
            constraints: NumberTextBoxConstraints;
            baseClass: string;
            adjust(val: any, delta: number): any;
            pattern: ConstraintsToRegExpString<NumberTextBoxConstraints>;
            parse(value: string, constraints: NumberTextBoxConstraints): string;
            format(value: number, constraints: NumberTextBoxConstraints): string;
            filter(value: number): number;
            value: number;
        }
        interface NumberSpinnerConstructor extends _WidgetBaseConstructor<NumberSpinner> {
        }
        interface NumberTextBoxConstraints extends RangeBoundTextBoxConstraints, NumberFormatOptions, NumberParseOptions {
        }
        interface NumberTextBoxMixin {
            pattern: ConstraintsToRegExpString<NumberTextBoxConstraints>;
            constraints: NumberTextBoxConstraints;
            value: number;
            editOptions: {
                pattern: string;
            };
            _formatter: (value: number, options?: NumberFormatOptions) => string;
            _regExpGenerator: (options?: NumberRegexpOptions) => string;
            _decimalInfo: (constraints: Constraints) => {
                sep: string;
                places: number;
            };
            postMixInProperties(): void;
            format(value: number, constraints: NumberTextBoxConstraints): string;
            _parser: (expression: string, options?: NumberParseOptions) => number;
            parse(value: string, constraints: NumberParseOptions): string;
            filter(value: number): number;
            serialize: SerializationFunction;
            isValid(isFocused?: boolean): boolean;
        }
        interface NumberTextBoxMixinConstructor extends _WidgetBaseConstructor<NumberTextBoxMixin> {
        }
        interface NumberTextBox extends RangeBoundTextBox, NumberTextBoxMixin {
            constraints: NumberTextBoxConstraints;
            pattern: ConstraintsToRegExpString<NumberTextBoxConstraints>;
            parse(value: string, constraints: NumberParseOptions): string;
            format(value: number, constraints: NumberFormatOptions): string;
            value: number;
            filter(value: number): number;
        }
        interface NumberTextBoxConstructor extends _WidgetBaseConstructor<NumberTextBox> {
            Mixin: NumberTextBoxMixinConstructor;
        }
        interface RadioButton extends CheckBox, _RadioButtonMixin {
            baseClass: string;
        }
        interface RadioButtonConstructor extends _WidgetBaseConstructor<RadioButton> {
        }
        interface RangeBoundTextBoxConstraints extends Constraints {
            min?: number;
            max?: number;
        }
        interface RangeBoundTextBox extends MappedTextBox<RangeBoundTextBoxConstraints> {
            /**
             * The message to display if value is out-of-range
             */
            rangeMessage: string;
            /**
             * Overridable function used to validate the range of the numeric input value.
             */
            rangeCheck(primative: number, constraints: RangeBoundTextBoxConstraints): boolean;
            /**
             * Tests if the value is in the min/max range specified in constraints
             */
            isInRange(isFocused: boolean): boolean;
            /**
             * Returns true if the value is out of range and will remain
             * out of range even if the user types more characters
             */
            _isDefinitelyOutOfRange(): boolean;
            isValid(isFocused?: boolean): boolean;
            getErrorMessage(isFocused: boolean): string;
            postMixInProperties(): void;
        }
        interface RangeBoundTextBoxConstructor extends _WidgetBaseConstructor<RangeBoundTextBox> {
        }
        interface Select<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions, U extends DijitJS._WidgetBase> extends _FormSelectWidget<T, Q, O>, _HasDropDown<U>, _KeyNavMixin {
            baseClass: string;
            /**
             * What to display in an "empty" drop down.
             */
            emptyLabel: string;
            /**
             * Specifies how to interpret the labelAttr in the data store items.
             */
            labelType: string;
            /**
             * Currently displayed error/prompt message
             */
            message: string;
            /**
             * Can be true or false, default is false.
             */
            required: boolean;
            /**
             * "Incomplete" if this select is required but unset (i.e. blank value), "" otherwise
             */
            state: string;
            /**
             * Order fields are traversed when user hits the tab key
             */
            tabIndex: any;
            templateString: any;
            /**
             * See the description of dijit/Tooltip.defaultPosition for details on this parameter.
             */
            tooltipPosition: any;
            childSelector(node: Element | Node): boolean;
            destroy(preserveDom: boolean): void;
            focus(): void;
            /**
             * Sets the value to the given option, used during search by letter.
             * @param widget Reference to option's widget
             */
            focusChild(widget: DijitJS._WidgetBase): void;
            isLoaded(): boolean;
            /**
             * Whether or not this is a valid value.
             * @param isFocused
             */
            isValid(isFocused: boolean): boolean;
            /**
             * populates the menu
             * @param loadCallback
             */
            loadDropDown(loadCallback: () => any): void;
            postCreate(): void;
            /**
             * set the missing message
             */
            postMixInProperties(): void;
            /**
             * Overridden so that the state will be cleared.
             */
            reset(): void;
            startup(): void;
            /**
             * Called by oninit, onblur, and onkeypress, and whenever required/disabled state changes
             * @param isFocused
             */
            validate(isFocused: boolean): boolean;
            /**
             * When a key is pressed that matches a child item,
             * this method is called so that a widget can take
             * appropriate action is necessary.
             * @param item
             * @param evt
             * @param searchString
             * @param numMatches
             */
            onKeyboardSearch(item: DijitJS._WidgetBase, evt: Event, searchString: string, numMatches: number): void;
        }
        interface SelectConstructor extends _WidgetBaseConstructor<Select<any, any, any, any>> {
        }
        interface SimpleTextarea extends TextBox {
            baseClass: string;
            rows: string;
            cols: string;
            templateString: string;
            postMixInProperties(): void;
            buildRendering(): void;
            filter(value: string): string;
        }
        interface SimpleTextareaConstructor extends _WidgetBaseConstructor<SimpleTextarea> {
            new (params: Object, srcNodeRef: Node | string): SimpleTextarea;
        }
        interface Textarea extends SimpleTextarea, _ExpandingTextAreaMixin {
            baseClass: string;
            cols: string;
            buildRendering(): void;
        }
        interface TextareaConstructor extends _WidgetBaseConstructor<Textarea> {
        }
        interface TextBox extends _FormValueWidget, _TextBoxMixin<Constraints> {
            set(name: 'displayedValue', value: string): this;
            set(name: 'disabled', value: boolean): this;
            set(name: 'value', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
            get(name: 'displayedValue'): string;
            get(name: 'value'): string;
            get(name: string): any;
        }
        interface TextBoxConstructor extends _WidgetBaseConstructor<TextBox> {
        }
        interface ToggleButton extends Button, _ToggleButtonMixin {
            baseClass: string;
            setChecked(checked: boolean): void;
            set(name: 'checked', value: boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface ToggleButtonConstructor extends _WidgetBaseConstructor<ToggleButton> {
        }
        interface IsValidFunction {
            (isFocused?: boolean): boolean;
        }
        interface ValidationTextBox<C extends Constraints> extends TextBox {
            templateString: string;
            required: boolean;
            promptMessage: string;
            invalidMessage: string;
            missingMessage: string;
            message: string;
            constraints: C;
            pattern: string | ConstraintsToRegExpString<C>;
            regExp: string;
            regExpGen(constraints: C): void;
            state: string;
            tooltipPosition: string[];
            validator: ConstrainedValidFunction<C>;
            isValid: IsValidFunction;
            getErrorMessage(isFocused: boolean): string;
            getPromptMessage(isFocused: boolean): string;
            validate(isFocused: boolean): boolean;
            displayMessage(message: string): void;
            startup(): void;
            postMixInProperties(): void;
            reset(): void;
            destroy(preserveDom?: boolean): void;
            set(name: 'constraints', value: Constraints): this;
            set(name: 'disabled', value: boolean): this;
            set(name: 'message', value: string): this;
            set(name: 'pattern', value: string | ConstraintsToRegExpString<C>): this;
            set(name: 'regExp', value: string): this;
            set(name: 'regExpGen', value: Constraints): this;
            set(name: 'required', value: boolean): this;
            set(name: 'value', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
            get(name: 'pattern'): string | ConstraintsToRegExpString<C>;
            get(name: string): any;
        }
        interface ValidationTextBoxConstructor extends _WidgetBaseConstructor<ValidationTextBox<Constraints>> {
            new <C extends Constraints>(params: Object, srcNodeRef: Node | string): ValidationTextBox<C>;
        }
    }
    type Bookmark = {
        isCollapsed: boolean;
        mark?: Range;
    };
    type FocusNode = Element | null;
    type RemoveHandle = {
        remove(): void;
    };
    /**
     * Deprecated module to monitor currently focused node and stack of currently focused widgets.
     *
     * New code should access dijit/focus directly.
     */
    interface Focus {
        /**
         * Currently focused item on screen
         */
        _curFocus: FocusNode;
        /**
         * Previously focused item on screen
         */
        _prevFocus: FocusNode;
        /**
         * Returns true if there is no text selected
         */
        isCollapsed(): boolean;
        /**
         * Retrieves a bookmark that can be used with moveToBookmark to return to the same range
         */
        getBookmark(): Bookmark;
        /**
         * Moves current selection to a bookmark
         */
        moveToBookmark(bookmark: Bookmark): void;
        /**
         * Called as getFocus(), this returns an Object showing the current focus and selected text.
         *
         * Called as getFocus(widget), where widget is a (widget representing) a button that was just pressed, it returns where focus was before that button was pressed.   (Pressing the button may have either shifted focus to the button, or removed focus altogether.)   In this case the selected text is not returned, since it can't be accurately determined.
         */
        getFocus(menu: DijitJS._WidgetBase, openedForWindow?: Window): {
            node: FocusNode;
            bookmark: any;
            openedForWindow?: Window;
        };
        /**
         * List of currently active widgets (focused widget and it's ancestors)
         */
        _activeStack: DijitJS._WidgetBase[];
        /**
         * Registers listeners on the specified iframe so that any click or focus event on that iframe (or anything in it) is reported as a focus/click event on the `<iframe>` itself.
         *
         * Currently only used by editor.
         */
        registerIframe(iframe: HTMLIFrameElement): RemoveHandle;
        /**
         * Unregisters listeners on the specified iframe created by registerIframe.
         * After calling be sure to delete or null out the handle itself.
         */
        unregisterIframe(handle?: RemoveHandle): void;
        /**
         * Registers listeners on the specified window (either the main window or an iframe's window) to detect when the user has clicked somewhere or focused somewhere.
         *
         * Users should call registerIframe() instead of this method.
         */
        registerWin(targetWindow: Window, effectiveNode: Element): RemoveHandle;
        /**
         * Unregisters listeners on the specified window (either the main window or an iframe's window) according to handle returned from registerWin().
         * After calling be sure to delete or null out the handle itself.
         */
        unregisterWin(handle?: RemoveHandle): void;
    }
    /**
     * Deprecated.  Shim to methods on registry, plus a few other declarations.
     *
     * New code should access dijit/registry directly when possible.
     */
    interface Manager {
        byId(id: string | _WidgetBase): _WidgetBase;
        getUniqueId(widgetType: string): string;
        findWidgets(root: Node, skipNode?: Node): _WidgetBase[];
        byNode(node: Node): _WidgetBase;
        getEnclosingWidgets(node: Node): _WidgetBase;
        defaultDuration: number;
    }
    type placeOnScreenAround = (node: Element, aroundNode: Element, aroundCorners: Object | any[], layoutNode?: DijitJS.LayoutNodeFunction) => void;
    /**
     * Deprecated back compatibility module, new code should use dijit/place directly instead of using this module.
     */
    interface Place {
        /**
         * Deprecated method to return the dimensions and scroll position of the viewable area of a browser window.
         *
         * New code should use windowUtils.getBox()
         */
        getViewport(): {
            l?: number;
            t?: number;
            w?: number;
            h?: number;
        };
        placeOnScreen(node: Element, pos?: DijitJS.PlacePosition, corners?: DijitJS.PlaceCorner[], padding?: DijitJS.PlacePosition, layoutNode?: DijitJS.LayoutNodeFunction): PlaceLocation;
        /**
         * Like dijit.placeOnScreenAroundNode(), except it accepts an arbitrary object for the "around" argument and finds a proper processor to place a node.
         *
         * Deprecated, new code should use dijit/place.around() instead.
         */
        placeOnScreenAroundElement: placeOnScreenAround;
        /**
         * Position node adjacent or kitty-corner to aroundNode such that it's fully visible in viewport.
         *
         * Deprecated, new code should use dijit/place.around() instead.
         */
        placeOnScreenAroundNode: placeOnScreenAround;
        /**
         * Like dijit.placeOnScreenAroundNode(), except that the "around" parameter is an arbitrary rectangle on the screen (x, y, width, height) instead of a dom node.
         *
         * Deprecated, new code should use dijit/place.around() instead.
         */
        placeOnScreenAroundRectangle: placeOnScreenAround;
        /**
         * Deprecated method, unneeded when using dijit/place directly.
         *
         * Transforms the passed array of preferred positions into a format suitable for passing as the aroundCorners argument to dijit/place.placeOnScreenAroundElement.
         */
        getPopupAroundAlignment(position: string[], leftToRight?: boolean): {
            [s: string]: DijitJS.PlaceCorner;
        };
    }
    /**
     * Deprecated.   Old module for popups, new code should use dijit/popup directly.
     */
    interface Popup extends DijitJS.PopupManager {
    }
    /**
     * Back compatibility module, new code should use windowUtils directly instead of using this module.
     */
    interface Scroll {
    }
    /**
     * Deprecated, back compatibility module, new code should require dojo/uacss directly instead of this module.
     */
    interface Sniff {
    }
    /**
     * Deprecated, for back-compat, just loads top level module
     */
    interface Typematic {
        addKeyListener: Function;
        addListener: Function;
        addMouseListener: Function;
        stop: Function;
        trigger: Function;
        _fireEventAndReload: Function;
    }
    /**
     * Deprecated methods for setting/getting wai roles and states.
     * New code should call setAttribute()/getAttribute() directly.
     *
     * Also loads hccss to apply dj_a11y class to root node if machine is in high-contrast mode.
     */
    interface Wai {
        /**
         * Determines if an element has a particular role.
         */
        hasWaiRole(elem: Element, role: string): boolean;
        /**
         * Gets the role for an element (which should be a wai role).
         */
        getWaiRole(elem: Element): string;
        /**
         * Sets the role on an element.
         */
        setWaiRole(elem: Element, role: string): void;
        /**
         * Removes the specified role from an element.
         * Removes role attribute if no specific role provided (for backwards compat.)
         */
        removeWaiRole(elem: Element, role: string): void;
        /**
         * Determines if an element has a given state.
         *
         * Checks for an attribute called "aria-"+state.
         */
        hasWaiState(elem: Element, state: string): boolean;
        /**
         * Gets the value of a state on an element.
         *
         * Checks for an attribute called "aria-"+state.
         */
        getWaiState(elem: Element, state: string): string;
        /**
         * Sets a state on an element.
         *
         * Sets an attribute called "aria-"+state.
         */
        setWaiState(elem: Element, state: string, value: string): void;
        /**
         * Removes a state from an element.
         *
         * Sets an attribute called "aria-"+state.
         */
        removeWaiState(elem: Element, state: string): void;
    }
    /**
     * Back compatibility module, new code should use windowUtils directly instead of using this module.
     */
    interface Window {
        getDocumentWindow: Function;
    }
}
declare module "dijit/form/_FormMixin" {
    var _FormMixin: DojoJS.DojoClass<DijitJS.form._FormMixin, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                _FormMixin: typeof _FormMixin;
            }
        }
    }
    export = _FormMixin;
}
declare module "dijit/_DialogMixin" {
    var _DialogMixin: DojoJS.DojoClass<DijitJS._DialogMixin, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                _DialogMixin: typeof _DialogMixin;
            }
        }
    }
    export = _DialogMixin;
}
declare module "dijit/Viewport" {
    import Evented = require("dojo/Evented");
    var s: Evented & {
        _rlh: any;
        getEffectiveBox: (e: any) => any;
    };
    global {
        namespace DojoJS {
        }
    }
    export = s;
}
declare module "dijit/DialogUnderlay" {
    import _Widget = require("dijit/_Widget");
    import _TemplatedMixin = require("dijit/_TemplatedMixin");
    import d = require("dijit/BackgroundIframe");
    interface DialogUnderlay_Template extends InstanceType<typeof _Widget>, InstanceType<typeof _TemplatedMixin> {
    }
    class DialogUnderlay_Template {
        node: HTMLElement;
        templateString: string;
        dialogId: string;
        class: string;
        open?: boolean;
        _modalConnects: any[];
        bgIframe?: typeof d;
        _setDialogIdAttr(e: string): void;
        _setClassAttr(e: string): void;
        postCreate(): void;
        layout(): void;
        show(): void;
        hide(): void;
        destroy(): void;
        _onKeyDown(): void;
        static _singleton: DialogUnderlay_Template;
        static show(e: any, t: any): void;
        static hide(): void;
    }
    let DialogUnderlay: DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin & DialogUnderlay_Template, []>;
    export = DialogUnderlay;
    global {
        namespace DojoJS {
            interface Dijit {
                DialogUnderlay: typeof DialogUnderlay;
                _underlay: typeof DialogUnderlay_Template._singleton;
            }
        }
    }
}
declare namespace DijitJS {
    namespace layout {
        interface _LayoutWidget extends _Widget, _Container, _Contained {
            /**
             * Base class for a _Container widget which is responsible for laying
             * out its children. Widgets which mixin this code must define layout()
             * to manage placement and sizing of the children.
             */
            baseClass: string;
            /**
             * Indicates that this widget is going to call resize() on its
             * children widgets, setting their size, when they become visible.
             */
            isLayoutContainer: boolean;
            /**
             * Call this to resize a widget, or after its size has changed.
             *
             * ####Change size mode:
             *
             * When changeSize is specified, changes the marginBox of this widget
             * and forces it to re-layout its contents accordingly.
             * changeSize may specify height, width, or both.
             *
             * If resultSize is specified it indicates the size the widget will
             * become after changeSize has been applied.
             *
             * ####Notification mode:
             *
             * When changeSize is null, indicates that the caller has already changed
             * the size of the widget, or perhaps it changed because the browser
             * window was resized. Tells widget to re-layout its contents accordingly.
             *
             * If resultSize is also specified it indicates the size the widget has
             * become.
             *
             * In either mode, this method also:
             *
             * 1. Sets this._borderBox and this._contentBox to the new size of
             * 	the widget. Queries the current domNode size if necessary.
             * 2. Calls layout() to resize contents (and maybe adjust child widgets).
             */
            resize(changeSize?: {
                l?: number;
                t?: number;
                w?: number;
                h?: number;
            }, resultSize?: DojoJS.DomGeometryWidthHeight): void;
            /**
             * Widgets override this method to size and position their contents/children.
             * When this is called, this._contentBox is guaranteed to be set (see resize()).
             *
             * This is called after startup(), and also when the widget's size has been
             * changed.
             */
            layout(): void;
        }
        interface _LayoutWidgetConstructor extends _WidgetBaseConstructor<_LayoutWidget> {
        }
        interface _TabContainerBase extends StackContainer, _TemplatedMixin {
            /**
             * Defines where tabs go relative to tab content.
             * "top", "bottom", "left-h", "right-h"
             */
            tabPosition: string;
            /**
             * Defines whether the tablist gets an extra class for layouting, putting a border/shading
             * around the set of tabs.   Not supported by claro theme.
             */
            tabStrip: boolean;
            /**
             * If true, use styling for a TabContainer nested inside another TabContainer.
             * For tundra etc., makes tabs look like links, and hides the outer
             * border since the outer TabContainer already has a border.
             */
            nested: boolean;
        }
        interface LayoutContainer extends _LayoutWidget {
            /**
             * Which design is used for the layout:
             *
             * - "headline" (default) where the top and bottom extend the full width of the container
             * - "sidebar" where the left and right sides extend from top to bottom.
             *
             * However, a `layoutPriority` setting on child panes overrides the `design` attribute on the parent.
             * In other words, if the top and bottom sections have a lower `layoutPriority` than the left and right
             * panes, the top and bottom panes will extend the entire width of the box.
             */
            design: string;
            addChild<T extends _WidgetBase>(child: T, insertIndex?: number): void;
            removeChild<T extends _WidgetBase>(child: T): void;
        }
        interface LayoutContainerConstructor extends _WidgetBaseConstructor<LayoutContainer> {
        }
        interface _AccordionButton extends _WidgetBase, _TemplatedMixin, _CssStateMixin {
            /**
             * Title of the pane.
             */
            label: string;
            /**
             * Tooltip that appears on hover.
             */
            title: string;
            /**
             * CSS class for icon to left of label.
             */
            iconClassAttr: string;
            /**
             * Returns the height of the title dom node.
             */
            getTitleHeight(): number;
        }
        interface _AccordionButtonConstructor extends _WidgetBaseConstructor<_AccordionButton> {
        }
        interface AccordionContainer extends StackContainer {
            /**
             * Amount of time (in ms) it takes to slide panes.
             */
            duration: number;
            /**
             * The name of the widget used to display the title of each pane.
             */
            buttonWidget: _AccordionButtonConstructor;
        }
        interface AccordionContainerConstructor extends _WidgetBaseConstructor<AccordionContainer> {
        }
        interface AccordionPane extends ContentPane {
            /**
             * Called when this pane is selected.
             */
            onSelected(): void;
        }
        interface AccordionPaneConstructor extends _WidgetBaseConstructor<AccordionPane> {
        }
        interface BorderContainer extends LayoutContainer {
            /**
             * Give each pane a border and margin.
             * Margin determined by domNode.paddingLeft.
             * When false, only resizable panes have a gutter (i.e. draggable splitter) for resizing.
             */
            gutters: boolean;
            /**
             * Specifies whether splitters resize as you drag (true) or only upon mouseup (false)
             */
            liveSplitters: boolean;
            /**
             * Save splitter positions in a cookie.
             */
            persist: boolean;
            /**
             * Returns the widget responsible for rendering the splitter associated with region.with
             */
            getSplitter(region: string): any;
            destroyRecursive(): void;
        }
        interface BorderContainerConstructor extends _WidgetBaseConstructor<BorderContainer> {
        }
        interface ContentPane extends _Widget, _Container, _ContentPaneResizeMixin {
            /**
             * The href of the content that displays now
             * Set this at construction if you want to load data externally when th
             * pane is shown.  (Set preload=true to load it immediately.
             * Changing href after creation doesn't have any effect; Use set('href', ...);
             */
            href: string;
            /**
             * The innerHTML of the ContentPane
             * Note that the initialization parameter / argument to set("content", ...
             * can be a String, DomNode, Nodelist, or _Widget.
             */
            content: string | Node | ArrayLike<Node> | DijitJS._Widget;
            /**
             * Extract visible content from inside of `<body> .... </body>`
             * I.e., strip `<html>` and `<head>` (and it's contents) from the href
             */
            extractContent: boolean;
            /**
             * Parse content and create the widgets, if any.
             */
            parseOnLoad: boolean;
            /**
             * Flag passed to parser.  Root for attribute names to search for.   If scopeName is dojo
             * will search for data-dojo-type (or dojoType).  For backwards compatibilit
             * reasons defaults to dojo._scopeName (which is "dojo" except whe
             * multi-version support is used, when it will be something like dojo16, dojo20, etc.)
             */
            parserScope: string;
            /**
             * Prevent caching of data from href's by appending a timestamp to the href.
             */
            preventCache: boolean;
            /**
             * Force load of data on initialization even if pane is hidden.
             */
            preload: boolean;
            /**
             * Refresh (re-download) content when pane goes from hidden to shown
             */
            refreshOnShow: boolean;
            /**
             * Message that shows while downloading
             */
            loadingMessage: string;
            /**
             * Message that shows if an error occurs
             */
            errorMessage: string;
            /**
             * True if the ContentPane has data in it, either specifie
             * during initialization (via href or inline content), or se
             * via set('content', ...) / set('href', ...
             * False if it doesn't have any content, or if ContentPane i
             * still in the process of downloading href.
             */
            isLoaded: boolean;
            baseClass: string;
            /**
             * Function that should grab the content specified via href.
             */
            ioMethod<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
            /**
             * Parameters to pass to xhrGet() request, for example:
             * |	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="href: './bar', ioArgs: {timeout: 500}">
             */
            ioArgs: {
                [arg: string]: string | number;
            };
            /**
             * This is the `dojo.Deferred` returned by set('href', ...) and refresh()
             * Calling onLoadDeferred.then() registers you
             * callback to be called only once, when the prior set('href', ...) call o
             * the initial href parameter to the constructor finishes loading
             * This is different than an onLoad() handler which gets called any time any hre
             * or content is loaded.
             */
            onLoadDeferred: DojoJS.Deferred<any>;
            /**
             * Flag to parser that I'll parse my contents, so it shouldn't.
             */
            stopParser: boolean;
            /**
             * Flag from the parser that this ContentPane is inside a templat
             * so the contents are pre-parsed.
             */
            template: boolean;
            markupFactory<T>(params: any, node: HTMLElement, ctor: Constructor<T>): T;
            postMixInProperties(): void;
            buildRendering(): void;
            /**
             * Call startup() on all children including non _Widget ones like dojo/dnd/Source objects
             */
            startup(): void;
            /**
             * Deprecated.   Use set('href', ...) instead.
             */
            setHref(href: string | URL): ContentPane;
            /**
             * Deprecated.   Use set('content', ...) instead.
             */
            setContent(data: string | Node | ArrayLike<Node>): ContentPane;
            /**
             * Cancels an in-flight download of content
             */
            cancel(): void;
            /**
             * [Re]download contents of href and display
             */
            refresh(): DojoJS.Deferred<any>;
            /**
             * Destroy all the widgets inside the ContentPane and empty containerNode
             */
            destroyDescendants(preserveDom?: boolean): void;
            /**
             * Event hook, is called after everything is loaded and widgetified
             */
            onLoad(data?: any): void;
            /**
             * Event hook, is called before old content is cleared
             */
            onUnload(): void;
            /**
             * Called before download starts.
             */
            onDownloadStart(): string;
            /**
             * Called on DOM faults, require faults etc. in content.
             * In order to display an error message in the pane, return
             * the error message from this method, as an HTML string.
             * By default (if this method is not overriden), it returns
             * nothing, so the error message is just printed to the console.
             */
            onContentError(error: Error): void;
            /**
             * Called when download error occurs.
             * In order to display an error message in the pane, return
             * the error message from this method, as an HTML string.
             * Default behavior (if this method is not overriden) is to display
             * the error message inside the pane.
             */
            onDownloadError(error: Error): void;
            /**
             * Called when download is finished.
             */
            onDownloadEnd(): void;
        }
        interface ContentPaneConstructor extends _WidgetBaseConstructor<ContentPane> {
        }
        interface _ContentPaneResizeMixin {
            /**
             * - false - don't adjust size of children
             * - true - if there is a single visible child widget, set it's size to however big the ContentPane is
             */
            doLayout: boolean;
            /**
             * Indicates that this widget will call resize() on it's child widgets
             * when they become visible.
             */
            isLayoutContainer: boolean;
            /**
             * See `dijit/layout/_LayoutWidget.startup()` for description.
             * Although ContentPane doesn't extend _LayoutWidget, it does implement
             * the same API.
             */
            startup(): void;
            /**
             * See `dijit/layout/_LayoutWidget.resize()` for description.
             * Although ContentPane doesn't extend _LayoutWidget, it does implement
             * the same API.
             */
            resize(changeSize?: {
                l?: number;
                t?: number;
                w?: number;
                h?: number;
            }, resultSize?: DojoJS.DomGeometryWidthHeight): void;
        }
        interface _ContentPaneResizeMixinConstructor extends _WidgetBaseConstructor<_ContentPaneResizeMixin> {
        }
        interface LinkPane extends ContentPane, _TemplatedMixin {
        }
        interface LinkPaneConstructor extends _WidgetBaseConstructor<LinkPane> {
        }
        interface ScrollingTabController extends TabController, _WidgetsInTemplateMixin {
            /**
             * True if a menu should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useMenu: boolean;
            /**
             * True if a slider should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useSlider: boolean;
            /**
             * The css class to apply to the tab strip, if it is visible.
             */
            tabStripClass: string;
            /**
             * Creates an Animation object that smoothly scrolls the tab list
             * either to a fixed horizontal pixel value, or to the selected tab.
             */
            createSmoothScroll(pixels?: number): DojoJS.Animation;
            /**
             * Scrolls the menu to the right.
             */
            doSlideRight(e: MouseEvent): void;
            /**
             * Scrolls the menu to the left.
             */
            doSlideLeft(e: MouseEvent): void;
            /**
             * Scrolls the tab list to the left or right by 75% of the widget
             * width.
             */
            doSlide(direction: number, node: HTMLElement): void;
        }
        interface ScrollingTabControllerConstructor extends _WidgetBaseConstructor<ScrollingTabController> {
        }
        interface StackContainer extends _LayoutWidget {
            /**
             * If true, change the size of my currently displayed child to match my size.
             */
            doLayout: boolean;
            /**
             * Remembers the selected child across sessions.
             */
            persist: boolean;
            /**
             * References the currently selected child widget, if any.
             * Adjust selected child with selectChild() method.
             */
            selectedChildWidget: _Widget;
            selectChild<T extends _WidgetBase>(page: T | string, animate: boolean): DojoJS.Promise<any>;
            forward(): DojoJS.Promise<any>;
            back(): DojoJS.Promise<any>;
            closeChild<T extends _WidgetBase>(page: T): void;
            /**
             * Destroy all the widgets inside the StackContainer and empty containerNode
             */
            destroyDescendants(preserveDom?: boolean): void;
        }
        interface StackContainerConstructor extends _WidgetBaseConstructor<StackContainer> {
        }
        interface StackContainerChildWidget extends _WidgetBase {
            /**
             * Specifies that this widget should be the initially displayed pane.
             * Note: to change the selected child use `dijit/layout/StackContainer.selectChild`
             */
            selected: boolean;
            /**
             * Specifies that the button to select this pane should be disabled.
             * Doesn't affect programmatic selection of the pane, nor does it deselect the pane if it is currently selected.
             */
            disabled: boolean;
            /**
             * True if user can close (destroy) this child, such as (for example) clicking the X on the tab.
             */
            closable: boolean;
            /**
             * CSS class specifying icon to use in label associated with this pane.
             */
            iconClass: string;
            /**
             * When true, display title of this widget as tab label etc., rather than just using
             * icon specified in iconClass.
             */
            showTitle: boolean;
        }
        interface _StackButton extends DijitJS.form.ToggleButton {
            /**
             * When true, display close button for this tab.
             */
            closeButton: boolean;
        }
        interface _StackButtonConstructor extends _WidgetBaseConstructor<_StackButton> {
        }
        interface StackControllerBase extends _Widget, _TemplatedMixin, _Container {
            /**
             * The id of the page container I point to.
             */
            containerId: string;
            /**
             * CSS class of [x] close icon used by event delegation code to tell when
             * the close button was clicked.
             */
            buttonWidgetCloseClass: string;
            /**
             * Returns the button corresponding to the pane with the given id.
             */
            pane2button<T extends _WidgetBase>(id: string): T;
            /**
             * Called after the StackContainer has finished initializing.
             */
            onStartup(info: Object): void;
            /**
             * Called whenever a page is added to the container. Create button
             * corresponding to the page.
             */
            onAddChild<T extends _WidgetBase>(page: T, insertIndex?: number): void;
            /**
             * Called whenever a page is removed from the container. Remove the
             * button corresponding to the page.
             */
            onRemoveChild<T extends _WidgetBase>(page: T): void;
            /**
             * Called when a page has been selected in the StackContainer, either
             * by me or by another StackController.
             */
            onSelectChild<T extends _WidgetBase>(page: T): void;
            /**
             * Called whenever one of my child buttons is pressed in an attempt to
             * select a page.
             */
            onButtonClick<T extends _WidgetBase>(page: T): void;
            /**
             * Called whenever one of my child buttons [X] is pressed in an attempt
             * to close a page.
             */
            onCloseButtonClick<T extends _WidgetBase>(page: T): void;
            /**
             * Helper for onkeydown to find next/previous button.
             */
            adjacent(forward: boolean): _WidgetBase;
            /**
             * Handle keystrokes on the page list, for advancing to next/previous
             * button and closing the page in the page is closable.
             */
            onkeydown(e: Event, fromContainer?: boolean): void;
            /**
             * Called when there was a keydown on the container.
             */
            onContainerKeyDown(info: Object): void;
        }
        interface StackController extends StackControllerBase {
            /**
             * The button widget to create to correspond to each page.
             */
            buttonWidget: _StackButtonConstructor;
        }
        interface StackControllerConstructor extends _WidgetBaseConstructor<StackController> {
        }
        interface TabContainer extends _TabContainerBase {
            /**
             * True if a menu should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useMenu: boolean;
            /**
             * True if a slider should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useSlider: boolean;
            /**
             * An optional parameter to override the widget used to display the tab labels.
             */
            controllerWidget: string;
        }
        interface TabContainerConstructor extends _WidgetBaseConstructor<TabContainer> {
        }
        interface _TabButton extends _StackButton {
        }
        interface _TabButtonConstructor extends _WidgetBaseConstructor<_TabButton> {
        }
        interface TabController extends StackControllerBase {
            /**
             * Defines where tabs go relative to the content.
             * "top", "bottom", "left-h", "right-h"
             */
            tabPosition: string;
            /**
             * The tab widget to create to correspond to each page.
             */
            buttonWidget: _TabButtonConstructor;
            /**
             * Class of [x] close icon, used by event delegation code to tell
             * when close button was clicked.
             */
            buttonWidgetCloseClass: string;
        }
        interface TabControllerConstructor extends _WidgetBaseConstructor<TabController> {
            TabButton: _TabButton;
        }
    }
}
declare module "dijit/_Container" {
    var _Container: DijitJS._ContainerConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _Container: typeof _Container;
            }
        }
    }
    export = _Container;
}
declare module "dijit/layout/utils" {
    var s: {
        marginBox2contentBox: (e: any, t: any) => {
            l: number;
            t: number;
            w: number;
            h: number;
        };
        layoutChildren: (i: any, n: any, s: any, r: any, l: any) => void;
    };
    global {
        namespace DojoJS {
            interface _ContentPaneResizeMixin extends Type<typeof s> {
            }
            interface DijitLayout {
                _ContentPaneResizeMixin: _ContentPaneResizeMixin;
            }
            interface Dijit {
                layout: DijitLayout;
            }
        }
    }
    export = s;
}
declare module "dijit/layout/_ContentPaneResizeMixin" {
    var _ContentPaneResizeMixin: DijitJS.layout._ContentPaneResizeMixinConstructor;
    global {
        namespace DojoJS {
            interface _ContentPaneResizeMixin extends Type<typeof _ContentPaneResizeMixin> {
            }
            interface DijitLayout {
                _ContentPaneResizeMixin: _ContentPaneResizeMixin;
            }
            interface Dijit {
                layout: DijitLayout;
            }
        }
    }
    export = _ContentPaneResizeMixin;
}
declare module "dojo/html" {
    type Promise<T> = typeof import("dojo/promise/Promise")<T>;
    var html: Html;
    type ContentSetterContent = string | Node | ArrayLike<Node>;
    interface ContentSetterParams {
        node?: Node | string;
        content?: ContentSetterContent;
        id?: string;
        cleanContent?: boolean;
        extractContent?: boolean;
        parseContent?: boolean;
        parserScope?: boolean;
        startup?: boolean;
        onBegin?: Function;
        onEnd?: Function;
        tearDown?: Function;
        onContentError?: Function;
        onExecError?: Function;
    }
    interface ContentSetter {
        /**
         * An node which will be the parent element that we set content into
         */
        node: Node | string;
        /**
         * The content to be placed in the node. Can be an HTML string, a node reference, or a enumerable list of nodes
         */
        content: ContentSetterContent;
        /**
         * Usually only used internally, and auto-generated with each instance
         */
        id: string;
        /**
         * Should the content be treated as a full html document,
         * and the real content stripped of <html>, <body> wrapper before injection
         */
        cleanContent: boolean;
        /**
         * Should the content be treated as a full html document,
         * and the real content stripped of `<html> <body>` wrapper before injection
         */
        extractContent: boolean;
        /**
         * Should the node by passed to the parser after the new content is set
         */
        parseContent: boolean;
        /**
         * Flag passed to parser.	Root for attribute names to search for.	  If scopeName is dojo,
         * will search for data-dojo-type (or dojoType).  For backwards compatibility
         * reasons defaults to dojo._scopeName (which is "dojo" except when
         * multi-version support is used, when it will be something like dojo16, dojo20, etc.)
         */
        parserScope: string;
        /**
         * Start the child widgets after parsing them.	  Only obeyed if parseContent is true.
         */
        startup: boolean;
        /**
         * front-end to the set-content sequence
         */
        set(cont?: ContentSetterContent, params?: ContentSetterParams): Promise<Node> | Node;
        /**
         * sets the content on the node
         */
        setContent(): void;
        /**
         * cleanly empty out existing content
         */
        empty(): void;
        /**
         * Called after instantiation, but before set();
         * It allows modification of any of the object properties -
         * including the node and content provided - before the set operation actually takes place
         */
        onBegin(): Node;
        /**
         * Called after set(), when the new content has been pushed into the node
         * It provides an opportunity for post-processing before handing back the node to the caller
         * This default implementation checks a parseContent flag to optionally run the dojo parser over the new content
         */
        onEnd(): Node;
        /**
         * manually reset the Setter instance if its being re-used for example for another set()
         */
        tearDown(): void;
        onContentError(): string;
        onExecError(): string;
        _mixin(params: ContentSetterParams): void;
        parseDeferred: DojoJS.Deferred<any[]>;
        /**
         * runs the dojo parser over the node contents, storing any results in this.parseResults
         */
        _parse(): void;
        /**
         * shows user the string that is returned by on[type]Error
         * override/implement on[type]Error and return your own string to customize
         */
        _onError(type: string, err: Error, consoleText?: string): void;
    }
    interface ContentSetterConstructor extends DojoJS.DojoClass<ContentSetter> {
        new (params?: ContentSetterParams, node?: Node | string): ContentSetter;
    }
    interface Html {
        /**
         * removes !DOCTYPE and title elements from the html string.
         *
         * khtml is picky about dom faults, you can't attach a style or `<title>` node as child of body
         * must go into head, so we need to cut out those tags
         */
        _secureForInnerHtml(cont: string): string;
        /**
         * Deprecated, should use dojo/dom-constuct.empty() directly, remove in 2.0.
         */
        _emptyNode(node: Node | string): void;
        /**
         * inserts the given content into the given node
         */
        _setNodeContent<T extends Node>(node: Node, cont: string | Node | ArrayLike<T> | number): Node;
        _ContentSetter: ContentSetterConstructor;
        /**
         * inserts (replaces) the given content into the given node. dojo/dom-construct.place(cont, node, "only")
         * may be a better choice for simple HTML insertion.
         */
        set(node: Node, cont?: ContentSetterContent, params?: ContentSetterParams): Promise<Node> | Node;
    }
    global {
        namespace DojoJS {
            interface DojoHTML extends Type<typeof html> {
            }
            interface Dojo {
                html: DojoHTML;
            }
        }
    }
    export = html;
}
declare module "dijit/layout/ContentPane" {
    import "dojo/i18n";
    var ContentPane: DijitJS.layout.ContentPaneConstructor;
    global {
        namespace DojoJS {
            interface DijitLayout {
                ContentPane: typeof ContentPane;
            }
            interface Dijit {
                layout: DijitLayout;
            }
        }
    }
    export = ContentPane;
}
declare module "dijit/Dialog" {
    import "dijit/a11yclick";
    var DialogBase: DojoJS.DojoClass<DijitJS._TemplatedMixin & DijitJS.form._FormMixin & DijitJS._DialogMixin & [DijitJS._CssStateMixin] & {
        templateString: string;
        baseClass: string;
        cssStateNodes: {
            closeButtonNode: string;
        };
        _setTitleAttr: {
            node: string;
            type: string;
        };
        open: boolean;
        duration: number;
        refocus: boolean;
        autofocus: boolean;
        _firstFocusItem: null;
        _lastFocusItem: null;
        draggable: boolean;
        _setDraggableAttr: (e: any) => void;
        maxRatio: number;
        closable: boolean;
        _setClosableAttr: (e: any) => void;
        postMixInProperties: () => void;
        postCreate: () => void;
        onLoad: () => void;
        focus: () => void;
        _endDrag: () => void;
        _setup: () => void;
        _size: () => void;
        _position: () => void;
        _onKey: (e: any) => void;
        show: () => any;
        hide: () => any;
        resize: (e: any) => void;
        _layoutChildren: () => void;
        destroy: () => void;
    }, [params?: (Partial<DijitJS._TemplatedMixin> & ThisType<DijitJS._TemplatedMixin>) | undefined, srcNodeRef?: string | Node | undefined]>;
    var Dialog: DijitJS.DialogConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _DialogBase: typeof DialogBase;
                Dialog: typeof Dialog;
            }
        }
    }
    export = Dialog;
}
declare module "dijit/_KeyNavMixin" {
    var _KeyNavMixin: DijitJS._KeyNavMixinConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _KeyNavMixin: typeof _KeyNavMixin;
            }
        }
    }
    export = _KeyNavMixin;
}
declare module "dijit/_KeyNavContainer" {
    var _KeyNavContainer: DijitJS._KeyNavContainerConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _KeyNavContainer: typeof _KeyNavContainer;
            }
        }
    }
    export = _KeyNavContainer;
}
declare module "dijit/_MenuBase" {
    var _MenuBase: DijitJS._MenuBaseConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _MenuBase: typeof _MenuBase;
            }
        }
    }
    export = _MenuBase;
}
declare module "dijit/DropDownMenu" {
    var DropDownMenu: DijitJS.DropDownMenuConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                DropDownMenu: typeof DropDownMenu;
            }
        }
    }
    export = DropDownMenu;
}
declare module "dijit/Toolbar" {
    var Toolbar: DijitJS.ToolbarConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                Toolbar: typeof Toolbar;
            }
        }
    }
    export = Toolbar;
}
declare module "dijit/ToolbarSeparator" {
    var ToolbarSeparator: DijitJS.ToolbarSeparatorConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                ToolbarSeparator: typeof ToolbarSeparator;
            }
        }
    }
    export = ToolbarSeparator;
}
declare module "dijit/_Contained" {
    var _Contained: DijitJS._ContainedConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _Contained: typeof _Contained;
            }
        }
    }
    export = _Contained;
}
declare module "dijit/layout/_LayoutWidget" {
    var _LayoutWidget: DijitJS.layout._LayoutWidgetConstructor;
    global {
        namespace DojoJS {
            interface DijitLayout {
                _LayoutWidget: typeof _LayoutWidget;
            }
            interface Dijit {
                layout: DijitLayout;
            }
        }
    }
    export = _LayoutWidget;
}
declare module "dijit/form/_FormWidgetMixin" {
    var _FormWidgetMixin: DojoJS.DojoClass<DijitJS.form._FormWidgetMixin, []>;
    global {
        namespace DojoJS {
            interface DijitForm {
                _FormWidgetMixin: typeof _FormWidgetMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _FormWidgetMixin;
}
declare module "dijit/form/_FormWidget" {
    var _FormWidgetConstructor: DijitJS.form._FormWidgetConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                _FormWidgetConstructor: typeof _FormWidgetConstructor;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _FormWidgetConstructor;
}
declare module "dijit/form/_ButtonMixin" {
    var _ButtonMixin: DojoJS.DojoClass<DijitJS.form._ButtonMixin, []>;
    global {
        namespace DojoJS {
            interface DijitForm {
                _ButtonMixin: typeof _ButtonMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _ButtonMixin;
}
declare module "dijit/form/Button" {
    import "dijit/a11yclick";
    var Button: DijitJS.form.ButtonConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                Button: typeof Button;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = Button;
}
declare module "dijit/form/_ToggleButtonMixin" {
    var _ToggleButtonMixin: DojoJS.DojoClass<DijitJS.form._ToggleButtonMixin, []>;
    global {
        namespace DojoJS {
            interface DijitForm {
                _ToggleButtonMixin: typeof _ToggleButtonMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _ToggleButtonMixin;
}
declare module "dijit/form/ToggleButton" {
    var ToggleButton: DijitJS.form.ToggleButtonConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                ToggleButton: typeof ToggleButton;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = ToggleButton;
}
declare module "dijit/_editor/_Plugin" {
    var a: DojoJS.DojoClass<{
        destroy: (e: any) => void;
        own: () => IArguments;
    } & {
        constructor: (e: any) => void;
        editor: null;
        iconClassPrefix: string;
        button: null;
        command: string;
        useDefaultCommand: boolean;
        buttonClass: DijitJS.form.ButtonConstructor;
        disabled: boolean;
        getLabel: (e: any) => any;
        _initButton: () => void;
        destroy: () => void;
        connect: (t: any, i: any, n: any) => void;
        updateState: () => void;
        setEditor: (e: any) => void;
        setToolbar: (e: any) => void;
        set: (e: any, t: any) => any;
        get: (e: any) => any;
        _setDisabledAttr: (e: any) => void;
        _getAttrNames: (e: any) => any;
        _set: (e: any, t: any) => void;
    }, [e: any]>;
    global {
        namespace DojoJS {
            interface Dijit_editor {
                _Plugin: typeof a;
            }
        }
    }
    export = a;
}
declare module "dijit/selection" {
    interface SelectionConstructor {
        new (s: Window): Selection;
        getType(): string;
        getSelectedText(): string;
        getSelectedHtml(): string;
        getSelectedElement(): Element;
        getParentElement(): Element;
        hasAncestorElement(e: string): boolean;
        getAncestorElement(e: string): Element;
        isTag(e: Element, t: string[]): string;
        getParentOfType(e: Element, t: string[]): Element;
        collapse(e: boolean): void;
        remove(): void;
        selectElementChildren(e: string, i: boolean): void;
        selectElement(e: string, i: boolean): void;
        inSelection(e: Element): boolean;
        getBookmark(): {
            isCollapsed: boolean;
            mark: any;
        };
        moveToBookmark(t: {
            isCollapsed: boolean;
            mark: any;
        }): void;
        isCollapsed(): boolean;
    }
    var selection: InstanceType<SelectionConstructor> & {
        SelectionManager: SelectionConstructor;
    };
    global {
        namespace DojoJS {
            interface Dijit {
                selection: typeof selection;
            }
        }
    }
    export = selection;
}
declare module "dijit/_editor/range" {
    var range: {
        getIndex: (e: any, t: any) => {
            o: number[];
            r: number[];
        };
        getNode: (t: any, n: any) => any;
        getCommonAncestor: (e: any, t: any, i: any) => any;
        getAncestor: (e: any, t: any, i: any) => any;
        BlockTagNames: RegExp;
        getBlockAncestor: (e: any, t: any, i: any) => {
            blockNode: any;
            blockContainer: any;
        };
        atBeginningOfContainer: (e: any, t: any, i: any) => boolean;
        atEndOfContainer: (e: any, t: any, i: any) => boolean;
        adjacentNoneTextNode: (e: any, t: any) => any[];
        create: (e: any) => any;
        getSelection: (e: any, t: any) => any;
    };
    global {
        namespace DojoJS {
            interface Dijit {
                range: typeof range;
            }
        }
    }
    export = range;
}
declare module "dijit/_editor/html" {
    var html: {};
    global {
        namespace DojoJS {
            interface Dijit_editor {
                html: typeof html;
            }
            interface Dijit {
                _editor: Dijit_editor;
            }
        }
    }
    export = html;
}
declare module "dijit/_editor/RichText" {
    var RichText: DojoJS.DojoClass<DijitJS._Widget & [DijitJS._CssStateMixin] & {
        constructor: (e: any) => void;
        baseClass: string;
        inheritWidth: boolean;
        focusOnLoad: boolean;
        name: string;
        styleSheets: string;
        height: string;
        minHeight: string;
        isClosed: boolean;
        isLoaded: boolean;
        _SEPARATOR: string;
        _NAME_CONTENT_SEP: string;
        onLoadDeferred: null;
        isTabIndent: boolean;
        disableSpellCheck: boolean;
        postCreate: () => void;
        startup: () => void;
        setupDefaultShortcuts: () => void;
        events: string[];
        captureEvents: never[];
        _editorCommandsLocalized: boolean;
        _localizeEditorCommands: () => void;
        open: (e: any) => void;
        _local2NativeFormatNames: {};
        _native2LocalFormatNames: {};
        _getIframeDocTxt: () => string;
        _applyEditingAreaStyleSheets: () => string;
        addStyleSheet: (t: any) => void;
        removeStyleSheet: (t: any) => void;
        disabled: boolean;
        _mozSettingProps: {
            styleWithCSS: boolean;
        };
        _setDisabledAttr: (e: any) => void;
        onLoad: (t: any) => void;
        onKeyDown: (t: any) => true;
        onKeyUp: () => void;
        setDisabled: (e: any) => void;
        _setValueAttr: (e: any) => void;
        _setDisableSpellCheckAttr: (e: any) => void;
        addKeyHandler: (e: any, t: any, i: any, n: any) => void;
        onKeyPressed: () => void;
        onClick: (e: any) => void;
        _onIEMouseDown: () => void;
        _onBlur: (e: any) => void;
        _onFocus: (e: any) => void;
        blur: () => void;
        focus: () => void;
        updateInterval: number;
        _updateTimer: null;
        onDisplayChanged: () => void;
        onNormalizedDisplayChanged: () => void;
        onChange: () => void;
        _normalizeCommand: (e: any, t: any) => any;
        _implCommand: (e: any) => string;
        _qcaCache: {};
        queryCommandAvailable: (e: any) => any;
        _queryCommandAvailable: (e: any) => number | boolean | undefined;
        execCommand: (e: any, t: any) => any;
        queryCommandEnabled: (e: any) => any;
        queryCommandState: (e: any) => any;
        queryCommandValue: (e: any) => any;
        _sCall: (e: any, t: any) => any;
        placeCursorAtStart: () => void;
        placeCursorAtEnd: () => void;
        getValue: (e: any) => any;
        _getValueAttr: () => any;
        setValue: (e: any) => void;
        replaceValue: (e: any) => void;
        _preFilterContent: (t: any) => any;
        _preDomFilterContent: (t: any) => void;
        _postFilterContent: (t: any, i: any) => any;
        _saveContent: () => void;
        escapeXml: (e: any, t: any) => any;
        getNodeHtml: (e: any) => any;
        getNodeChildrenHtml: (e: any) => any;
        close: (e: any) => void;
        destroy: () => void;
        _removeMozBogus: (e: any) => any;
        _removeWebkitBogus: (e: any) => any;
        _normalizeFontStyle: (e: any) => any;
        _preFixUrlAttributes: (e: any) => any;
        _browserQueryCommandEnabled: (e: any) => any;
        _createlinkEnabledImpl: () => boolean;
        _unlinkEnabledImpl: () => any;
        _inserttableEnabledImpl: () => any;
        _cutEnabledImpl: () => boolean;
        _copyEnabledImpl: () => boolean;
        _pasteEnabledImpl: () => any;
        _inserthorizontalruleImpl: (e: any) => any;
        _unlinkImpl: (e: any) => any;
        _hilitecolorImpl: (e: any) => any;
        _backcolorImpl: (e: any) => boolean;
        _forecolorImpl: (e: any) => boolean;
        _inserthtmlImpl: (e: any) => boolean;
        _boldImpl: (e: any) => boolean;
        _italicImpl: (e: any) => boolean;
        _underlineImpl: (e: any) => boolean;
        _strikethroughImpl: (e: any) => boolean;
        _superscriptImpl: (e: any) => boolean;
        _subscriptImpl: (e: any) => boolean;
        _fontnameImpl: (e: any) => any;
        _fontsizeImpl: (e: any) => any;
        _insertorderedlistImpl: (e: any) => boolean;
        _insertunorderedlistImpl: (e: any) => boolean;
        getHeaderHeight: () => number;
        getFooterHeight: () => number;
        _getNodeChildrenHeight: (e: any) => number;
        _isNodeEmpty: (e: any, t: any) => any;
        _removeStartingRangeFromRange: (e: any, t: any) => any;
        _adaptIESelection: () => void;
        _adaptIEFormatAreaAndExec: (t: any) => boolean | undefined;
        _adaptIEList: (e: any) => boolean;
        _handleTextColorOrProperties: (e: any, t: any) => boolean;
        _adjustNodeAndOffset: (e: any, t: any) => {
            node: any;
            offset: any;
        };
        _tagNamesForCommand: (e: any) => string[];
        _stripBreakerNodes: (e: any) => any;
        _stripTrailingEmptyNodes: (e: any) => any;
        _setTextDirAttr: (e: any) => void;
    }, [...any[], e: any]>;
    global {
        namespace DojoJS {
            interface Dijit_editor {
                RichText: typeof RichText;
            }
            interface Dijit {
                _editor: Dijit_editor;
            }
        }
    }
    export = RichText;
}
declare module "dijit/_editor/plugins/EnterKeyHandling" {
    var EnterKeyHandling: DojoJS.DojoClass<{
        destroy: (e: any) => void;
        own: () => IArguments;
    } & {
        constructor: (e: any) => void;
        editor: null;
        iconClassPrefix: string;
        button: null;
        command: string;
        useDefaultCommand: boolean;
        buttonClass: DijitJS.form.ButtonConstructor;
        disabled: boolean;
        getLabel: (e: any) => any;
        _initButton: () => void;
        destroy: () => void;
        connect: (t: any, i: any, n: any) => void;
        updateState: () => void;
        setEditor: (e: any) => void;
        setToolbar: (e: any) => void;
        set: (e: any, t: any) => any;
        get: (e: any) => any;
        _setDisabledAttr: (e: any) => void;
        _getAttrNames: (e: any) => any;
        _set: (e: any, t: any) => void;
    } & {
        blockNodeForEnter: string;
        constructor: (e: any) => void;
        setEditor: (e: any) => void;
        onKeyPressed: () => void;
        bogusHtmlContent: string;
        blockNodes: RegExp;
        handleEnterKey: (e: any) => boolean;
        _adjustNodeAndOffset: (e: any, t: any) => {
            node: any;
            offset: any;
        };
        removeTrailingBr: (e: any) => void;
    }, [e: any]>;
    global {
        namespace DojoJS {
            interface Dijit_editorPlugins {
                EnterKeyHandling: typeof EnterKeyHandling;
            }
            interface Dijit_editor {
                plugins: Dijit_editorPlugins;
            }
            interface Dijit {
                _editor: Dijit_editor;
            }
        }
    }
    export = EnterKeyHandling;
}
declare module "dijit/Editor" {
    import "dojo/i18n";
    var Editor: DojoJS.DojoClass<DijitJS._Widget & [DijitJS._CssStateMixin] & {
        constructor: (e: any) => void;
        baseClass: string;
        inheritWidth: boolean;
        focusOnLoad: boolean;
        name: string;
        styleSheets: string;
        height: string;
        minHeight: string;
        isClosed: boolean;
        isLoaded: boolean;
        _SEPARATOR: string;
        _NAME_CONTENT_SEP: string;
        onLoadDeferred: null;
        isTabIndent: boolean;
        disableSpellCheck: boolean;
        postCreate: () => void;
        startup: () => void;
        setupDefaultShortcuts: () => void;
        events: string[];
        captureEvents: never[];
        _editorCommandsLocalized: boolean;
        _localizeEditorCommands: () => void;
        open: (e: any) => void;
        _local2NativeFormatNames: {};
        _native2LocalFormatNames: {};
        _getIframeDocTxt: () => string;
        _applyEditingAreaStyleSheets: () => string;
        addStyleSheet: (t: any) => void;
        removeStyleSheet: (t: any) => void;
        disabled: boolean;
        _mozSettingProps: {
            styleWithCSS: boolean;
        };
        _setDisabledAttr: (e: any) => void;
        onLoad: (t: any) => void;
        onKeyDown: (t: any) => true;
        onKeyUp: () => void;
        setDisabled: (e: any) => void;
        _setValueAttr: (e: any) => void;
        _setDisableSpellCheckAttr: (e: any) => void;
        addKeyHandler: (e: any, t: any, i: any, n: any) => void;
        onKeyPressed: () => void;
        onClick: (e: any) => void;
        _onIEMouseDown: () => void;
        _onBlur: (e: any) => void;
        _onFocus: (e: any) => void;
        blur: () => void;
        focus: () => void;
        updateInterval: number;
        _updateTimer: null;
        onDisplayChanged: () => void;
        onNormalizedDisplayChanged: () => void;
        onChange: () => void;
        _normalizeCommand: (e: any, t: any) => any;
        _implCommand: (e: any) => string;
        _qcaCache: {};
        queryCommandAvailable: (e: any) => any;
        _queryCommandAvailable: (e: any) => number | boolean | undefined;
        execCommand: (e: any, t: any) => any;
        queryCommandEnabled: (e: any) => any;
        queryCommandState: (e: any) => any;
        queryCommandValue: (e: any) => any;
        _sCall: (e: any, t: any) => any;
        placeCursorAtStart: () => void;
        placeCursorAtEnd: () => void;
        getValue: (e: any) => any;
        _getValueAttr: () => any;
        setValue: (e: any) => void;
        replaceValue: (e: any) => void;
        _preFilterContent: (t: any) => any;
        _preDomFilterContent: (t: any) => void;
        _postFilterContent: (t: any, i: any) => any;
        _saveContent: () => void;
        escapeXml: (e: any, t: any) => any;
        getNodeHtml: (e: any) => any;
        getNodeChildrenHtml: (e: any) => any;
        close: (e: any) => void;
        destroy: () => void;
        _removeMozBogus: (e: any) => any;
        _removeWebkitBogus: (e: any) => any;
        _normalizeFontStyle: (e: any) => any;
        _preFixUrlAttributes: (e: any) => any;
        _browserQueryCommandEnabled: (e: any) => any;
        _createlinkEnabledImpl: () => boolean;
        _unlinkEnabledImpl: () => any;
        _inserttableEnabledImpl: () => any;
        _cutEnabledImpl: () => boolean;
        _copyEnabledImpl: () => boolean;
        _pasteEnabledImpl: () => any;
        _inserthorizontalruleImpl: (e: any) => any;
        _unlinkImpl: (e: any) => any;
        _hilitecolorImpl: (e: any) => any;
        _backcolorImpl: (e: any) => boolean;
        _forecolorImpl: (e: any) => boolean;
        _inserthtmlImpl: (e: any) => boolean;
        _boldImpl: (e: any) => boolean;
        _italicImpl: (e: any) => boolean;
        _underlineImpl: (e: any) => boolean;
        _strikethroughImpl: (e: any) => boolean;
        _superscriptImpl: (e: any) => boolean;
        _subscriptImpl: (e: any) => boolean;
        _fontnameImpl: (e: any) => any;
        _fontsizeImpl: (e: any) => any;
        _insertorderedlistImpl: (e: any) => boolean;
        _insertunorderedlistImpl: (e: any) => boolean;
        getHeaderHeight: () => number;
        getFooterHeight: () => number;
        _getNodeChildrenHeight: (e: any) => number;
        _isNodeEmpty: (e: any, t: any) => any;
        _removeStartingRangeFromRange: (e: any, t: any) => any;
        _adaptIESelection: () => void;
        _adaptIEFormatAreaAndExec: (t: any) => boolean | undefined;
        _adaptIEList: (e: any) => boolean;
        _handleTextColorOrProperties: (e: any, t: any) => boolean;
        _adjustNodeAndOffset: (e: any, t: any) => {
            node: any;
            offset: any;
        };
        _tagNamesForCommand: (e: any) => string[];
        _stripBreakerNodes: (e: any) => any;
        _stripTrailingEmptyNodes: (e: any) => any;
        _setTextDirAttr: (e: any) => void;
    } & {
        plugins: null;
        extraPlugins: null;
        constructor: () => void;
        postMixInProperties: () => void;
        postCreate: () => void;
        startup: () => void;
        destroy: () => void;
        addPlugin: (t: any, i: any) => void;
        resize: (e: any) => void;
        layout: () => void;
        _onIEMouseDown: (e: any) => void;
        onBeforeActivate: () => void;
        onBeforeDeactivate: (e: any) => void;
        customUndo: boolean;
        editActionInterval: number;
        beginEditing: (e: any) => void;
        _steps: never[];
        _undoedSteps: never[];
        execCommand: (e: any) => any;
        _pasteImpl: () => any;
        _cutImpl: () => any;
        _copyImpl: () => any;
        _clipboardCommand: (e: any) => any;
        queryCommandEnabled: (e: any) => unknown;
        _moveToBookmark: (e: any) => void;
        _changeToStep: (e: any, t: any) => void;
        undo: () => boolean;
        redo: () => boolean;
        endEditing: (e: any) => void;
        _getBookmark: () => any;
        _beginEditing: () => void;
        _endEditing: () => void;
        onKeyDown: (e: any) => void;
        _onBlur: () => void;
        _saveSelection: () => void;
        _restoreSelection: () => void;
        onClick: () => void;
        replaceValue: (e: any) => void;
        _setDisabledAttr: (e: any) => void;
        _setStateClass: () => void;
    }, [...any[], e: any]>;
    global {
        namespace DojoJS {
            interface DojoDijit {
                Editor: typeof Editor;
            }
        }
    }
    export = Editor;
}
declare module "dijit/MenuItem" {
    var MenuItem: DijitJS.MenuItemConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                MenuItem: typeof MenuItem;
            }
        }
    }
    export = MenuItem;
}
declare module "dijit/MenuSeparator" {
    var MenuSeparator: DijitJS.MenuSeparatorConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                MenuSeparator: typeof MenuSeparator;
            }
        }
    }
    export = MenuSeparator;
}
declare module "dijit/place" {
    var place: DijitJS.Place;
    global {
        namespace DojoJS {
            interface Dijit {
                place: typeof place;
            }
        }
    }
    export = place;
}
declare module "dijit/Tooltip" {
    var v: DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin & {
        duration: number;
        templateString: {
            dynamic: boolean;
            normalize: (e: any, t: any) => string;
            load: (e: any, t: any, i: any) => void;
        };
        postCreate: () => void;
        show: (e: any, t: any, i: any, n: any, o: any, a: any, l: any) => void;
        orient: (e: any, t: any, i: any, n: any, o: any) => number;
        _onShow: () => void;
        hide: (e: any) => void;
        _onHide: () => void;
    }, any[]>;
    var x: DijitJS.TooltipConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                Tooltip: typeof x;
                _MasterTooltip: typeof v;
                showTooltip: (innerHTML: string, aroundNode: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                }, position?: DijitJS.PlacePositions[], rtl?: boolean, textDir?: string, onMouseEnter?: Function, onMouseLeave?: Function) => void;
                hideTooltip: (aroundNode: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                }) => void;
            }
        }
    }
    export = x;
}
declare module "dijit/TooltipDialog" {
    var TooltipDialog: DijitJS.TooltipDialogConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                TooltipDialog: typeof TooltipDialog;
            }
        }
    }
    export = TooltipDialog;
}
declare module "dijit/popup" {
    import "dojo/touch";
    var popup: DojoJS.DojoClass<DijitJS.Popup, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                popup: InstanceType<typeof popup>;
            }
        }
    }
    const _default_34: DijitJS.Popup & DojoJS.DojoClassObject;
    export = _default_34;
}
declare module "dijit/_HasDropDown" {
    var _HasDropDown: DojoJS.DojoClass<{
        _focusManager: DojoJS.Stateful & import("dojo/Evented") & DijitJS.Focus & DojoJS.DojoClassObject;
    } & DijitJS._HasDropDown<any>, []>;
    global {
        namespace DojoJS {
            interface Dijit {
                _HasDropDown: typeof _HasDropDown;
            }
        }
    }
    export = _HasDropDown;
}
declare module "dijit/_WidgetsInTemplateMixin" {
    var _WidgetsInTemplateMixin: DijitJS._WidgetsInTemplateMixinConstructor;
    global {
        namespace DojoJS {
            interface Dijit {
                _WidgetsInTemplateMixin: typeof _WidgetsInTemplateMixin;
            }
        }
    }
    export = _WidgetsInTemplateMixin;
}
declare module "dijit/form/_FormValueMixin" {
    var _FormValueMixin: DojoJS.DojoClass<DijitJS.form._FormWidgetMixin & DijitJS.form._FormValueMixin, []>;
    global {
        namespace DojoJS {
            interface DijitForm {
                _FormValueMixin: typeof _FormValueMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _FormValueMixin;
}
declare module "dijit/form/_FormValueWidget" {
    var _FormValueWidgetConstructor: DijitJS.form._FormValueWidgetConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                _FormValueWidgetConstructor: typeof _FormValueWidgetConstructor;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _FormValueWidgetConstructor;
}
declare module "dijit/form/_TextBoxMixin" {
    var _TextBoxMixin: DojoJS.DojoClass<DijitJS.form._TextBoxMixin<any>> & {
        _setSelectionRange: (e: HTMLInputElement, t: number, i: number) => void;
        selectInputText: (e: string | HTMLElement, t?: number, n?: number) => void;
    };
    global {
        namespace DojoJS {
            interface DijitForm {
                _TextBoxMixin: typeof _TextBoxMixin;
            }
            interface Dijit {
                form: DijitForm;
                _setSelectionRange: typeof _TextBoxMixin._setSelectionRange;
                selectInputText: typeof _TextBoxMixin.selectInputText;
            }
        }
    }
    export = _TextBoxMixin;
}
declare module "dijit/form/TextBox" {
    var TextBox: DijitJS.form.TextBoxConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                TextBox: typeof TextBox;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = TextBox;
}
declare module "dijit/form/ValidationTextBox" {
    import "dojo/i18n";
    var ValidationTextBox: DijitJS.form.ValidationTextBoxConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                ValidationTextBox: typeof ValidationTextBox;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = ValidationTextBox;
}
declare module "dijit/form/MappedTextBox" {
    var MappedTextBox: DijitJS.form.MappedTextBoxConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                MappedTextBox: typeof MappedTextBox;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = MappedTextBox;
}
declare module "dojo/regexp" {
    var regexp: DojoJS.RegExpModule;
    global {
        namespace DojoJS {
            interface RegExpModule {
                /**
                 * Adds escape sequences for special characters in regular expressions
                 */
                escapeString(str: string, except?: string): string;
                /**
                 * Builds a regular expression that groups subexpressions
                 */
                buildGroupRE(arr: any[] | Object, re: (item: any) => string, nonCapture?: boolean): string;
                /**
                 * adds group match to expression
                 */
                group(expression: string, nonCapture?: boolean): string;
            }
            interface Dojo {
                regexp: typeof regexp;
            }
        }
    }
    export = regexp;
}
declare module "dijit/form/DataList" {
    var DataList: DijitJS.form.DataListConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                DataList: typeof DataList;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = DataList;
}
declare module "dijit/form/_SearchMixin" {
    var _SearchMixin: DojoJS.DojoClass<DijitJS.form._SearchMixin<any, any, any>, []>;
    global {
        namespace DojoJS {
            interface DijitForm {
                _SearchMixin: typeof _SearchMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _SearchMixin;
}
declare module "dijit/form/_AutoCompleterMixin" {
    var _AutoCompleterMixin: any;
    global {
        namespace DojoJS {
            interface DijitForm {
                _AutoCompleterMixin: typeof _AutoCompleterMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _AutoCompleterMixin;
}
declare module "dijit/form/_ComboBoxMenuMixin" {
    var _ComboBoxMenuMixin: any;
    global {
        namespace DojoJS {
            interface DijitForm {
                _ComboBoxMenuMixin: typeof _ComboBoxMenuMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _ComboBoxMenuMixin;
}
declare module "dijit/form/_ListBase" {
    var _ListBase: DojoJS.DojoClass<DijitJS.form._ListBase, []>;
    global {
        namespace DojoJS {
            interface DijitForm {
                _ListBase: typeof _ListBase;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _ListBase;
}
declare module "dijit/form/_ListMouseMixin" {
    var _ListMouseMixin: DojoJS.DojoClass<DijitJS.form._ListBase & DijitJS.form._ListMouseMixin, []>;
    global {
        namespace DojoJS {
            interface DijitForm {
                _ListMouseMixin: typeof _ListMouseMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _ListMouseMixin;
}
declare module "dijit/form/_ComboBoxMenu" {
    var _ComboBoxMenu: any;
    global {
        namespace DojoJS {
            interface DijitForm {
                _ComboBoxMenu: typeof _ComboBoxMenu;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _ComboBoxMenu;
}
declare module "dijit/form/ComboBoxMixin" {
    var ComboBoxMixin: DijitJS.form.ComboBoxMixinConstructor<any, any, any>;
    global {
        namespace DojoJS {
            interface DijitForm {
                ComboBoxMixin: typeof ComboBoxMixin;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = ComboBoxMixin;
}
declare module "dijit/form/FilteringSelect" {
    var FilteringSelect: DijitJS.form.FilteringSelectConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                FilteringSelect: typeof FilteringSelect;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = FilteringSelect;
}
declare module "dijit/_editor/plugins/FontChoice" {
    var _FontDropDown: any, _FontNameDropDown: any, _FontSizeDropDown: any, _FormatBlockDropDown: any, FontChoice: any;
    global {
        namespace DojoJS {
            interface Dijit_editorPlugins {
                _FontDropDown: typeof _FontDropDown;
                _FontNameDropDown: typeof _FontNameDropDown;
                _FontSizeDropDown: typeof _FontSizeDropDown;
                _FormatBlockDropDown: typeof _FormatBlockDropDown;
            }
            interface Dijit_editor {
                plugins: Dijit_editorPlugins;
            }
            interface Dijit {
                _editor: Dijit_editor;
            }
        }
    }
    export = FontChoice;
}
declare module "dijit/form/DropDownButton" {
    import "dijit/a11yclick";
    var DropDownButton: DijitJS.form.DropDownButtonConstructor;
    global {
        namespace DojoJS {
            interface DijitForm {
                DropDownButton: typeof DropDownButton;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = DropDownButton;
}
declare module "dijit/_editor/plugins/LinkDialog" {
    var LinkDialog: any, ImgLinkDialog: any;
    global {
        namespace DojoJS {
            interface Dijit_editorPlugins {
                LinkDialog: typeof LinkDialog;
                ImgLinkDialog: typeof ImgLinkDialog;
            }
            interface Dijit_editor {
                plugins: Dijit_editorPlugins;
            }
            interface Dijit {
                _editor: Dijit_editor;
            }
        }
    }
    export = LinkDialog;
}
declare module "dojo/colors" {
    import Color = require("dojo/_base/Color");
    var colors: {
        makeGrey: (value: string | number, alpha: string | number) => Color;
    };
    var _extendedColorNames: {
        aliceblue: number[];
        antiquewhite: number[];
        aquamarine: number[];
        azure: number[];
        beige: number[];
        bisque: number[];
        blanchedalmond: number[];
        blueviolet: number[];
        brown: number[];
        burlywood: number[];
        cadetblue: number[];
        chartreuse: number[];
        chocolate: number[];
        coral: number[];
        cornflowerblue: number[];
        cornsilk: number[];
        crimson: number[];
        cyan: number[];
        darkblue: number[];
        darkcyan: number[];
        darkgoldenrod: number[];
        darkgray: number[];
        darkgreen: number[];
        darkgrey: number[];
        darkkhaki: number[];
        darkmagenta: number[];
        darkolivegreen: number[];
        darkorange: number[];
        darkorchid: number[];
        darkred: number[];
        darksalmon: number[];
        darkseagreen: number[];
        darkslateblue: number[];
        darkslategray: number[];
        darkslategrey: number[];
        darkturquoise: number[];
        darkviolet: number[];
        deeppink: number[];
        deepskyblue: number[];
        dimgray: number[];
        dimgrey: number[];
        dodgerblue: number[];
        firebrick: number[];
        floralwhite: number[];
        forestgreen: number[];
        gainsboro: number[];
        ghostwhite: number[];
        gold: number[];
        goldenrod: number[];
        greenyellow: number[];
        grey: number[];
        honeydew: number[];
        hotpink: number[];
        indianred: number[];
        indigo: number[];
        ivory: number[];
        khaki: number[];
        lavender: number[];
        lavenderblush: number[];
        lawngreen: number[];
        lemonchiffon: number[];
        lightblue: number[];
        lightcoral: number[];
        lightcyan: number[];
        lightgoldenrodyellow: number[];
        lightgray: number[];
        lightgreen: number[];
        lightgrey: number[];
        lightpink: number[];
        lightsalmon: number[];
        lightseagreen: number[];
        lightskyblue: number[];
        lightslategray: number[];
        lightslategrey: number[];
        lightsteelblue: number[];
        lightyellow: number[];
        limegreen: number[];
        linen: number[];
        magenta: number[];
        mediumaquamarine: number[];
        mediumblue: number[];
        mediumorchid: number[];
        mediumpurple: number[];
        mediumseagreen: number[];
        mediumslateblue: number[];
        mediumspringgreen: number[];
        mediumturquoise: number[];
        mediumvioletred: number[];
        midnightblue: number[];
        mintcream: number[];
        mistyrose: number[];
        moccasin: number[];
        navajowhite: number[];
        oldlace: number[];
        olivedrab: number[];
        orange: number[];
        orangered: number[];
        orchid: number[];
        palegoldenrod: number[];
        palegreen: number[];
        paleturquoise: number[];
        palevioletred: number[];
        papayawhip: number[];
        peachpuff: number[];
        peru: number[];
        pink: number[];
        plum: number[];
        powderblue: number[];
        rosybrown: number[];
        royalblue: number[];
        saddlebrown: number[];
        salmon: number[];
        sandybrown: number[];
        seagreen: number[];
        seashell: number[];
        sienna: number[];
        skyblue: number[];
        slateblue: number[];
        slategray: number[];
        slategrey: number[];
        snow: number[];
        springgreen: number[];
        steelblue: number[];
        tan: number[];
        thistle: number[];
        tomato: number[];
        turquoise: number[];
        violet: number[];
        wheat: number[];
        whitesmoke: number[];
        yellowgreen: number[];
    };
    type ExtendedColorNames = typeof _extendedColorNames;
    global {
        namespace DojoJS {
            interface Dojo {
                colors: typeof colors;
            }
            interface ColorNames extends ExtendedColorNames {
            }
        }
    }
    export = Color;
}
declare module "dijit/_editor/plugins/TextColor" {
    var TextColor: DojoJS.DojoClass<{
        destroy: (e: any) => void;
        own: () => IArguments;
    } & {
        constructor: (e: any) => void;
        editor: null;
        iconClassPrefix: string;
        button: null;
        command: string;
        useDefaultCommand: boolean;
        buttonClass: DijitJS.form.ButtonConstructor;
        disabled: boolean;
        getLabel: (e: any) => any;
        _initButton: () => void;
        destroy: () => void;
        connect: (t: any, i: any, n: any) => void;
        updateState: () => void;
        setEditor: (e: any) => void;
        setToolbar: (e: any) => void;
        set: (e: any, t: any) => any;
        get: (e: any) => any;
        _setDisabledAttr: (e: any) => void;
        _getAttrNames: (e: any) => any;
        _set: (e: any, t: any) => void;
    } & {
        buttonClass: DijitJS.form.DropDownButtonConstructor;
        colorPicker: string;
        useDefaultCommand: boolean;
        _initButton: () => void;
        updateState: () => void;
    }, [e: any]>;
    global {
        namespace DojoJS {
            interface Dijit_editorPlugins {
                TextColor: typeof TextColor;
            }
            interface Dijit_editor {
                plugins: Dijit_editorPlugins;
            }
            interface Dijit {
                _editor: Dijit_editor;
            }
        }
    }
    export = TextColor;
}
declare module "dijit/_editor/plugins/ViewSource" {
    import "dojo/i18n";
    var ViewSource: DojoJS.DojoClass<{
        destroy: (e: any) => void;
        own: () => IArguments;
    } & {
        constructor: (e: any) => void;
        editor: null;
        iconClassPrefix: string;
        button: null;
        command: string;
        useDefaultCommand: boolean;
        buttonClass: DijitJS.form.ButtonConstructor;
        disabled: boolean;
        getLabel: (e: any) => any;
        _initButton: () => void;
        destroy: () => void;
        connect: (t: any, i: any, n: any) => void;
        updateState: () => void;
        setEditor: (e: any) => void;
        setToolbar: (e: any) => void;
        set: (e: any, t: any) => any;
        get: (e: any) => any;
        _setDisabledAttr: (e: any) => void;
        _getAttrNames: (e: any) => any;
        _set: (e: any, t: any) => void;
    } & {
        stripScripts: boolean;
        stripComments: boolean;
        stripIFrames: boolean;
        stripEventHandlers: boolean;
        readOnly: boolean;
        _fsPlugin: null;
        toggle: () => void;
        _initButton: () => void;
        setEditor: (e: any) => void;
        _showSource: (i: any) => void;
        updateState: () => void;
        _resize: () => void;
        _createSourceView: () => void;
        _stripScripts: (e: any) => any;
        _stripComments: (e: any) => any;
        _stripIFrames: (e: any) => any;
        _stripEventHandlers: (e: any) => any;
        _filter: (e: any) => any;
        setSourceAreaCaret: () => void;
        destroy: () => void;
    }, [e: any]>;
    global {
        namespace DojoJS {
            interface Dijit_editorPlugins {
                ViewSource: typeof ViewSource;
            }
            interface Dijit_editor {
                plugins: Dijit_editorPlugins;
            }
            interface Dijit {
                _editor: Dijit_editor;
            }
        }
    }
    export = ViewSource;
}
declare module "dojo/data/util/sorter" {
    var sorter: Sorter;
    interface SortFunction<T> {
        (a: T, b: T): number;
    }
    interface SortArg {
        attribute: string;
        descending?: boolean;
    }
    interface LoadItemArgs<T extends Record<string, any>> {
        item?: T;
        onItem?: (item: T) => void;
        onError?: (err: Error) => void;
        scope?: Object;
    }
    interface FetchArgs<T extends Record<string, any>> {
        query?: Object | string;
        queryOptions?: Object;
        onBegin?: (size: number, request: Request) => void;
        onItem?: (item: T, request: Request) => void;
        onComplete?: (items: T[], request: Request) => void;
        onError?: (errorData: Error, request: Request) => void;
        scope?: Object;
        start?: number;
        count?: number;
        sort?: SortArg[];
    }
    interface Read<T extends Record<string, any>> {
        /**
         * Returns a single attribute value.
         * Returns defaultValue if and only if *item* does not have a value for *attribute*.
         * Returns null if and only if null was explicitly set as the attribute value.
         * Returns undefined if and only if the item does not have a value for the
         * given attribute (which is the same as saying the item does not have the attribute).
         */
        getValue<U>(item: T, attribute: string, defaultValue?: U): U;
        /**
         * This getValues() method works just like the getValue() method, but getValues()
         * always returns an array rather than a single attribute value.  The array
         * may be empty, may contain a single attribute value, or may contain
         * many attribute values.
         * If the item does not have a value for the given attribute, then getValues()
         * will return an empty array: [].  (So, if store.hasAttribute(item, attribute)
         * has a return of false, then store.getValues(item, attribute) will return [].)
         */
        getValues<U>(item: T, attribute: string): U[];
        /**
         * Returns an array with all the attributes that this item has.  This
         * method will always return an array; if the item has no attributes
         * at all, getAttributes() will return an empty array: [].
         */
        getAttributes(item: T): string[];
        /**
         * Returns true if the given *item* has a value for the given *attribute*.
         */
        hasAttribute(item: T, attribute: string): boolean;
        /**
         * Returns true if the given *value* is one of the values that getValues()
         * would return.
         */
        containsValue(item: T, attribute: string, value: any): boolean;
        /**
         * Returns true if *something* is an item and came from the store instance.
         * Returns false if *something* is a literal, an item from another store instance,
         * or is any object other than an item.
         */
        isItem(something: any): something is T;
        /**
         * Returns false if isItem(something) is false.  Returns false if
         * if isItem(something) is true but the the item is not yet loaded
         * in local memory (for example, if the item has not yet been read
         * from the server).
         */
        isItemLoaded(something: any): boolean;
        /**
         * Given an item, this method loads the item so that a subsequent call
         * to store.isItemLoaded(item) will return true.  If a call to
         * isItemLoaded() returns true before loadItem() is even called,
         * then loadItem() need not do any work at all and will not even invoke
         * the callback handlers.  So, before invoking this method, check that
         * the item has not already been loaded.
         */
        loadItem(keywordArgs: LoadItemArgs<T>): T;
        /**
         * Given a query and set of defined options, such as a start and count of items to return,
         * this method executes the query and makes the results available as data items.
         * The format and expectations of stores is that they operate in a generally asynchronous
         * manner, therefore callbacks are always used to return items located by the fetch parameters.
         */
        fetch(keywordArgs: FetchArgs<T>): Request;
        /**
         * The getFeatures() method returns an simple keyword values object
         * that specifies what interface features the datastore implements.
         * A simple CsvStore may be read-only, and the only feature it
         * implements will be the 'dojo/data/api/Read' interface, so the
         * getFeatures() method will return an object like this one:
         * {'dojo.data.api.Read': true}.
         * A more sophisticated datastore might implement a variety of
         * interface features, like 'dojo.data.api.Read', 'dojo/data/api/Write',
         * 'dojo.data.api.Identity', and 'dojo/data/api/Attribution'.
         */
        getFeatures(): {
            'dojo.data.api.Read'?: boolean;
        };
        /**
         * The close() method is intended for instructing the store to 'close' out
         * any information associated with a particular request.
         */
        close(request?: Request): void;
        /**
         * Method to inspect the item and return a user-readable 'label' for the item
         * that provides a general/adequate description of what the item is.
         */
        getLabel(item: T): string;
        /**
         * Method to inspect the item and return an array of what attributes of the item were used
         * to generate its label, if any.
         */
        getLabelAttributes(item: T): string[];
    }
    interface Sorter {
        /**
         * Basic comparison function that compares if an item is greater or less than another item
         */
        basicComparator: SortFunction<any>;
        /**
         * Helper function to generate the sorting function based off the list of sort attributes.
         */
        createSortFunction<T extends Record<string, any>>(attributes: SortArg[], store: Read<T>): SortFunction<T>;
    }
    global {
        namespace DojoJS {
            interface DojoDataUtil {
                sorter: typeof sorter;
            }
            interface DojoData {
                util: DojoDataUtil;
            }
            interface Dojo {
                data: DojoData;
            }
        }
    }
    export = sorter;
}
declare module "dijit/form/_FormSelectWidget" {
    var _FormSelectWidget: any;
    global {
        namespace DojoJS {
            interface DijitForm {
                _FormSelectWidget: typeof _FormSelectWidget;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = _FormSelectWidget;
}
declare module "dijit/form/Select" {
    import "dojo/i18n";
    var _SelectMenu: DojoJS.DojoClass<DijitJS.DropDownMenu & {
        autoFocus: boolean;
        buildRendering: () => void;
        postCreate: () => void;
        focus: () => void;
    }>, Select: DijitJS.form.SelectConstructor & {
        _Menu: typeof _SelectMenu;
    };
    global {
        namespace DojoJS {
            interface DijitForm {
                _SelectMenu: typeof _SelectMenu;
                Select: typeof Select;
            }
            interface Dijit {
                form: DijitForm;
            }
        }
    }
    export = Select;
}
declare module "dojo/NodeList-manipulate" {
    import "dojo/NodeList-dom";
    global {
        namespace DojoJS {
            interface NodeList<T extends Node> {
                /**
                 * private method for inserting queried nodes into all nodes in this NodeList
                 * at different positions. Differs from NodeList.place because it will clone
                 * the nodes in this NodeList if the query matches more than one element.
                 */
                _placeMultiple(query: string | Node | ArrayLike<Node>, position?: PlacePosition): this;
                /**
                 * allows setting the innerHTML of each node in the NodeList,
                 * if there is a value passed in, otherwise, reads the innerHTML value of the first node.
                 */
                innerHTML(): string;
                innerHTML(value: string | Node | ArrayLike<Node>): this;
                /**
                 * Allows setting the text value of each node in the NodeList,
                 * if there is a value passed in.  Otherwise, returns the text value for all the
                 * nodes in the NodeList in one string.
                 */
                text(): string;
                text(value: string): this;
                /**
                 * If a value is passed, allows setting the value property of form elements in this
                 * NodeList, or properly selecting/checking the right value for radio/checkbox/select
                 * elements. If no value is passed, the value of the first node in this NodeList
                 * is returned.
                 */
                val(): string | string[];
                val(value: string | string[]): this;
                /**
                 * appends the content to every node in the NodeList.
                 */
                append(content: string | Node | ArrayLike<Node>): this;
                /**
                 * appends nodes in this NodeList to the nodes matched by
                 * the query passed to appendTo.
                 */
                appendTo(query: string): this;
                /**
                 * prepends the content to every node in the NodeList.
                 */
                prepend(content: string | Node | ArrayLike<Node>): this;
                /**
                 * prepends nodes in this NodeList to the nodes matched by
                 * the query passed to prependTo.
                 */
                prependTo(query: string): this;
                /**
                 * Places the content after every node in the NodeList.
                 */
                after(content: string | Node | ArrayLike<Node>): this;
                /**
                 * The nodes in this NodeList will be placed after the nodes
                 * matched by the query passed to insertAfter.
                 */
                insertAfter(query: string): this;
                /**
                 * Places the content before every node in the NodeList.
                 */
                before(content: string | Node | ArrayLike<Node>): this;
                /**
                 * The nodes in this NodeList will be placed after the nodes
                 * matched by the query passed to insertAfter.
                 */
                insertBefore(query: string): this;
                /**
                 * alias for dojo/NodeList's orphan method. Removes elements
                 * in this list that match the simple filter from their parents
                 * and returns them as a new NodeList.
                 */
                remove(filter?: string | ((item: T, idx: number, nodeList: this) => boolean)): this;
                /**
                 * Wrap each node in the NodeList with html passed to wrap.
                 */
                wrap(html: Node | string): this;
                /**
                 * Insert html where the first node in this NodeList lives, then place all
                 * nodes in this NodeList as the child of the html.
                 */
                wrapAll(html: Node | string): this;
                /**
                 * For each node in the NodeList, wrap all its children with the passed in html.
                 */
                wrapInner(html: Node | string): this;
                /**
                 * Replaces each node in ths NodeList with the content passed to replaceWith.
                 */
                replaceWith<T extends Node>(content: string | Node | ArrayLike<Node>): NodeList<T>;
                /**
                 * replaces nodes matched by the query passed to replaceAll with the nodes
                 * in this NodeList.
                 */
                replaceAll(query: string): this;
                /**
                 * Clones all the nodes in this NodeList and returns them as a new NodeList.
                 */
                clone(): this;
            }
        }
    }
    const _default_35: DojoJS.NodeListConstructor;
    export = _default_35;
}
declare module "dojo/back" {
    var back: DojoJS.Back;
    global {
        namespace DojoJS {
            interface BackArgs {
                back?: (...args: any[]) => void;
                forward?: (...args: any[]) => void;
                changeUrl?: boolean | string;
            }
            interface Back {
                getHash(): string;
                setHash(h: string): void;
                /**
                 * private method. Do not call this directly.
                 */
                goBack(): void;
                /**
                 * private method. Do not call this directly.
                 */
                goForward(): void;
                /**
                 * Initializes the undo stack. This must be called from a <script>
                 * block that lives inside the `<body>` tag to prevent bugs on IE.
                 * Only call this method before the page's DOM is finished loading. Otherwise
                 * it will not work. Be careful with xdomain loading or djConfig.debugAtAllCosts scenarios,
                 * in order for this method to work, dojo/back will need to be part of a build layer.
                 */
                init(): void;
                /**
                 * Sets the state object and back callback for the very first page
                 * that is loaded.
                 * It is recommended that you call this method as part of an event
                 * listener that is registered via dojo/ready.
                 */
                setInitialState(args: BackArgs): void;
                /**
                 * adds a state object (args) to the history list.
                 */
                addToHistory(args: BackArgs): void;
                /**
                 * private method. Do not call this directly.
                 */
                _iframeLoaded(evt: Event, ifrLoc: Location): void;
            }
        }
    }
    export = back;
}
declare module "dojo/date" {
    var date: DateBase;
    type DatePortion = 'date' | 'time' | 'datetime';
    type DateInterval = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' | 'quarter' | 'week' | 'weekday';
    interface DateBase {
        /**
         * Returns the number of days in the month used by dateObject
         */
        getDaysInMonth(dateObject: Date): number;
        /**
         * Determines if the year of the dateObject is a leap year
         */
        isLeapYear(dateObject: Date): boolean;
        /**
         * Get the user's time zone as provided by the browser
         */
        getTimezoneName(dateObject: Date): string;
        /**
         * Compare two date objects by date, time, or both.
         *
         */
        compare(date1: Date, date2: Date, portion?: DatePortion): number;
        /**
         * Add to a Date in intervals of different size, from milliseconds to years
         */
        add(date: Date, interval: DateInterval, amount: number): Date;
        /**
         * Get the difference in a specific unit of time (e.g., number of
         * months, weeks, days, etc.) between two dates, rounded to the
         * nearest integer.
         */
        difference(date1: Date, date2?: Date, interval?: DateInterval): number;
    }
    global {
        namespace DojoJS {
            interface DojoDate extends Type<typeof date> {
            }
            interface Dojo {
                date: DojoDate;
            }
        }
    }
    export = date;
}
declare module "dojo/fx" {
    var dfx: DojoJS.DojoFx;
    global {
        namespace DojoJS {
            interface DojoFx extends Type<typeof import("dojo/_base/fx")> {
            }
            interface Dojo {
                fx: DojoFx;
            }
        }
    }
    export = dfx;
}
declare module "dojo/hash" {
    global {
        namespace DojoJS {
            interface Dojo {
                hash: (hash?: string, replace?: boolean) => string;
            }
        }
    }
    const _default_36: (hash?: string, replace?: boolean) => string;
    export = _default_36;
}
declare module "dojo/fx/easing" {
    interface Easing {
        linear(n: number): number;
        quadIn(n: number): number;
        quadOut(n: number): number;
        quadInOut(n: number): number;
        cubicIn(n: number): number;
        cubicOut(n: number): number;
        cubicInOut(n: number): number;
        quartIn(n: number): number;
        quartOut(n: number): number;
        quartInOut(n: number): number;
        quintIn(n: number): number;
        quintOut(n: number): number;
        quintInOut(n: number): number;
        sineIn(n: number): number;
        sineOut(n: number): number;
        sineInOut(n: number): number;
        expoIn(n: number): number;
        expoOut(n: number): number;
        expoInOut(n: number): number;
        circIn(n: number): number;
        circOut(n: number): number;
        circInOut(n: number): number;
        /**
         * An easing function that starts away from the target,
         * and quickly accelerates towards the end value.
         *
         * Use caution when the easing will cause values to become
         * negative as some properties cannot be set to negative values.
         */
        backIn(n: number): number;
        /**
         * An easing function that pops past the range briefly, and slowly comes back.
         */
        backOut(n: number): number;
        /**
         * An easing function combining the effects of `backIn` and `backOut`
         */
        backInOut(n: number): number;
        /**
         * An easing function the elastically snaps from the start value
         */
        elasticIn(n: number): number;
        /**
         * An easing function that elasticly snaps around the target value,
         * near the end of the Animation
         */
        elasticOut(n: number): number;
        /**
         * An easing function that elasticly snaps around the value, near
         * the beginning and end of the Animation.
         */
        elasticInOut(n: number): number;
        /**
         * An easing function that 'bounces' near the beginning of an Animation
         */
        bounceIn(n: number): number;
        /**
         * An easing function that 'bounces' near the end of an Animation
         */
        bounceOut(n: number): number;
        /**
         * An easing function that 'bounces' at the beginning and end of the Animation
         */
        bounceInOut(n: number): number;
    }
    global {
        namespace DojoJS {
            interface DojoFx {
                easing: Easing;
            }
            interface Dojo {
                fx: DojoFx;
            }
        }
    }
    const _default_37: {};
    export = _default_37;
}
declare module "dojo/request/iframe" {
    import "dojo/NodeList-dom";
    import "dojo/NodeList-manipulate";
    global {
        namespace DojoJS {
            interface IFrameBaseOptions extends DojoJS.BaseOptions {
                form?: HTMLFormElement;
                data?: string | Object;
            }
            interface RequestDeferred<T> extends DojoJS.Deferred<T> {
                response: DojoJS.Response<T>;
                isValid(response: DojoJS.Response<T>): boolean;
                isReady(response: DojoJS.Response<T>): boolean;
                handleResponse(response: DojoJS.Response<T>): DojoJS.Response<T>;
            }
            interface IFrameOptions extends IFrameBaseOptions, DojoJS.MethodOptions {
            }
            interface IFrame {
                <T>(url: string, options: IFrameOptions, returnDeferred: boolean): RequestDeferred<T>;
                <T>(url: string, options?: IFrameOptions): Promise<T>;
                create(name: string, onloadstr?: string, uri?: string): HTMLIFrameElement;
                doc(iframenode: HTMLIFrameElement): Document;
                setSrc(_iframe: HTMLIFrameElement, src: string, replace?: boolean): void;
                _iframeName: string;
                _notifyStart: Function;
                _dfdQueue: RequestDeferred<any>[];
                _currentDfd: RequestDeferred<any>;
                _fireNextRequest(): void;
                /**
                 * Send an HTTP GET request using the default transport for the current platform.
                 */
                get<T>(url: string, options?: IFrameBaseOptions): Promise<T>;
                /**
                 * Send an HTTP POST request using the default transport for the current platform.
                 */
                post<T>(url: string, options?: IFrameBaseOptions): Promise<T>;
            }
        }
    }
    const _default_38: DojoJS.IFrame;
    export = _default_38;
}
declare module "dojo/io/iframe" {
    var iframe: IFrame;
    interface IFrameIoArgs extends DojoJS.IoArgs {
        /**
         * The HTTP method to use. "GET" or "POST" are the only supported
         * values.  It will try to read the value from the form node's
         * method, then try this argument. If neither one exists, then it
         * defaults to POST.
         */
        method?: string;
        /**
         * Specifies what format the result data should be given to the
         * load/handle callback. Valid values are: text, html, xml, json,
         * javascript. IMPORTANT: For all values EXCEPT html and xml, The
         * server response should be an HTML file with a textarea element.
         * The response data should be inside the textarea element. Using an
         * HTML document the only reliable, cross-browser way this
         * transport can know when the response has loaded. For the html
         * handleAs value, just return a normal HTML document.  NOTE: xml
         * is now supported with this transport (as of 1.1+); a known issue
         * is if the XML document in question is malformed, Internet Explorer
         * will throw an uncatchable error.
         */
        handleAs?: string;
        /**
         * If "form" is one of the other args properties, then the content
         * object properties become hidden form form elements. For
         * instance, a content object of {name1 : "value1"} is converted
         * to a hidden form element with a name of "name1" and a value of
         * "value1". If there is not a "form" property, then the content
         * object is converted into a name=value&name=value string, by
         * using xhr.objectToQuery().
         */
        content?: Object;
    }
    interface IFrame {
        /**
         * Creates a hidden iframe in the page. Used mostly for IO
         * transports.  You do not need to call this to start a
         * dojo/io/iframe request. Just call send().
         */
        create(fname: string, onloadstr: string, uri: string): HTMLIFrameElement;
        /**
         * Sets the URL that is loaded in an IFrame. The replace parameter
         * indicates whether location.replace() should be used when
         * changing the location of the iframe.
         */
        setSrc(iframe: HTMLIFrameElement, src: string, replace?: boolean): void;
        /**
         * Returns the document object associated with the iframe DOM Node argument.
         */
        doc(iframeNode: HTMLIFrameElement): Document;
        /**
         * Function that sends the request to the server.
         * This transport can only process one send() request at a time, so if send() is called
         * multiple times, it will queue up the calls and only process one at a time.
         */
        send<T>(args: IFrameIoArgs): DojoJS.Deferred<T>;
        _iframeOnload: any;
    }
    global {
        namespace DojoJS {
            interface DojoIo {
                iframe: typeof iframe;
            }
            interface Dojo {
                io: DojoIo;
            }
        }
    }
    export = iframe;
}
declare module "dojo/selector/acme" {
    interface AcmeQueryEngine {
        <T extends Node>(query: string, root?: Node | string): T[];
        filter<T extends Node>(nodeList: T[], filter: string, root?: Node | string): T[];
    }
    const _default_39: AcmeQueryEngine;
    export = _default_39;
}
declare module "dojox/fx/_base" {
    import i = require("dojo/_base/fx");
    import dojoFx = require("dojo/fx");
    var dojoxFx: {
        anim: typeof i.anim;
        animateProperty: typeof i.animateProperty;
        fadeTo: typeof i._fade;
        fadeIn: typeof i.fadeIn;
        fadeOut: typeof i.fadeOut;
        combine: typeof dojoFx.combine;
        chain: typeof dojoFx.chain;
        slideTo: typeof dojoFx.slideTo;
        wipeIn: typeof dojoFx.wipeIn;
        wipeOut: typeof dojoFx.wipeOut;
        sizeTo: (e: {
            node: string | HTMLElement;
            method?: string;
            duration?: number;
            width?: number;
            height?: number;
        }) => typeof dojoFx.Animation;
        slideBy: (e: {
            node: string | HTMLElement;
            top?: number;
            left?: number;
        }) => typeof dojoFx.Animation;
        crossFade: (e: {
            nodes: (string | HTMLElement)[];
            duration?: number;
            color?: string;
        }) => typeof dojoFx.Animation;
        highlight: (e: {
            node: string | HTMLElement;
            duration?: number;
            color?: string;
        }) => typeof dojoFx.Animation;
        wipeTo: (e: {
            node: string | HTMLElement;
            width?: number;
            height?: number;
            duration?: number;
        }) => typeof dojoFx.Animation;
    };
    global {
        namespace DojoJS {
            interface Dojox {
                fx: typeof dojoxFx;
            }
        }
    }
    export = dojoxFx;
}
declare module "dojox/fx" {
    import fx = require("dojox/fx/_base");
    export = fx;
}
declare module "dojox/main" {
    const _default_40: DojoxJS.DojoX;
    export = _default_40;
}
declare module "dojox/data/QueryReadStore" {
    var QueryReadStore: DojoJS.DojoClass<{
        url: string;
        requestMethod: string;
        _className: string;
        _items: never[];
        _lastServerQuery: null;
        _numRows: number;
        lastRequestHash: null;
        doClientPaging: boolean;
        doClientSorting: boolean;
        _itemsByIdentity: null;
        _identifier: null;
        _features: {
            "dojo.data.api.Read": boolean;
            "dojo.data.api.Identity": boolean;
        };
        _labelAttr: string;
        constructor: (t: any) => void;
        getValue: (t: any, i: any, n: any) => any;
        getValues: (e: any, t: any) => any[];
        getAttributes: (e: any) => string[];
        hasAttribute: (e: any, t: any) => boolean;
        containsValue: (e: any, t: any, i: any) => boolean;
        isItem: (e: any) => boolean;
        isItemLoaded: (e: any) => boolean;
        loadItem: (e: any) => void;
        fetch: (t: any) => any;
        getFeatures: () => {
            "dojo.data.api.Read": boolean;
            "dojo.data.api.Identity": boolean;
        };
        close: (e: any) => void;
        getLabel: (e: any) => any;
        getLabelAttributes: (e: any) => string[] | null;
        _xhrFetchHandler: (t: any, i: any, n: any, o: any) => void;
        _fetchItems: (t: any, i: any, n: any) => void;
        _filterResponse: (e: any) => any;
        _assertIsItem: (e: any) => void;
        _assertIsAttribute: (e: any) => void;
        fetchItemByIdentity: (t: any) => void;
        getIdentity: (e: any) => any;
        getIdentityAttributes: (e: any) => null[];
    }, [t: any]>;
    global {
        namespace DojoJS {
            interface Dojox {
                data: {
                    QueryReadStore: typeof QueryReadStore;
                };
            }
        }
    }
    export = QueryReadStore;
}
declare module "dojox/string/tokenize" {
    function tokenize(e: any, i: any, n: any, o: any): any;
    global {
        namespace DojoJS {
            interface Dojox_String {
            }
            interface Dojox {
                string: Dojox_String;
            }
            var dojox: Dojox;
        }
    }
    export = tokenize;
}
declare module "dojox/string/Builder" {
    var Builder: DojoJS.StringBuilder;
    global {
        namespace DojoJS {
            interface StringBuilder {
                length: number;
                append: (...args: any[]) => this;
                concat: (...args: any[]) => this;
                appendArray: (e: any[]) => this;
                clear: () => this;
                replace: (e: any, i: any) => this;
                remove: (e: number, i?: number) => this;
                insert: (e: number, i: string) => this;
                toString: () => string;
            }
            interface Dojox_String {
                Builder: {
                    new (e: string): StringBuilder;
                };
            }
            interface Dojox {
                string: Dojox_String;
            }
            var dojox: Dojox;
        }
    }
    export = Builder;
}
declare module "dojox/dtl/_base" {
    var dtl: any;
    global {
        namespace DojoJS {
            interface Dojox {
                dtl: Dojox_DTL;
            }
            interface Dojox_DTL {
                _base: any;
                TOKEN_BLOCK: -1;
                TOKEN_VAR: -2;
                TOKEN_COMMENT: -3;
                TOKEN_TEXT: 3;
                _Context: Constructor<any>;
                Token: Constructor<any>;
                text: any;
                Template: Constructor<any>;
                quickFilter: (e: string) => any;
                _QuickNodeList: Constructor<any>;
                _Filter: Constructor<any>;
                _NodeList: Constructor<any>;
                _VarNode: Constructor<any>;
                _noOpNode: any;
                _Parser: Constructor<any>;
                register: {
                    _registry: {
                        attributes: any[];
                        tags: any[];
                        filters: any[];
                    };
                    get: (e: string, t: string) => any;
                    getAttributeTags: () => any[];
                    _any: (e: string, i: string, n: any) => void;
                    tags: (e: string, t: any) => void;
                    filters: (e: string, t: any) => void;
                };
                escape: (e: string) => any;
                safe: (e: any) => any;
                mark_safe: (e: any) => any;
            }
            var dojox: Dojox;
        }
    }
    export = dtl;
}
declare module "dojox/dtl/filter/htmlstrings" {
    global {
        namespace DojoJS {
            interface Dojox_DTL_Filter {
                htmlstrings: {
                    _linebreaksrn: RegExp;
                    _linebreaksn: RegExp;
                    _linebreakss: RegExp;
                    _linebreaksbr: RegExp;
                    _removetagsfind: RegExp;
                    _striptags: RegExp;
                    linebreaks(e: string): string;
                    linebreaksbr(e: string): string;
                    removetags(e: string, t: string): string;
                    striptags(e: string): string;
                };
            }
            interface Dojox_DTL {
                filter: Dojox_DTL_Filter;
            }
        }
    }
    const _default_41: DojoJS.Dojox_DTL_Filter["htmlstrings"];
    export = _default_41;
}
declare module "dojox/string/sprintf" {
    global {
        namespace DojoJS {
            interface Dojox_String {
                sprintf: {
                    (e: string, t: any): string;
                    Formatter: {
                        new (e: string): {
                            _mapped: boolean;
                            _format: string;
                            _tokens: any[];
                            _re: RegExp;
                            _parseDelim: (e: any, t: any, i: any, n: any, o: any, a: any, s: any) => {
                                mapping: any;
                                intmapping: any;
                                flags: any;
                                _minWidth: any;
                                period: any;
                                _precision: any;
                                specifier: any;
                            };
                            _specifiers: {
                                b: {
                                    base: number;
                                    isInt: boolean;
                                };
                                o: {
                                    base: number;
                                    isInt: boolean;
                                };
                                x: {
                                    base: number;
                                    isInt: boolean;
                                };
                                X: {
                                    extend: string[];
                                    toUpper: boolean;
                                };
                                d: {
                                    base: number;
                                    isInt: boolean;
                                };
                                i: {
                                    extend: string[];
                                };
                                u: {
                                    extend: string[];
                                    isUnsigned: boolean;
                                };
                                c: {
                                    setArg: (e: any) => void;
                                };
                                s: {
                                    setMaxWidth: (e: any) => void;
                                };
                                e: {
                                    isDouble: boolean;
                                    doubleNotation: string;
                                };
                                E: {
                                    extend: string[];
                                    toUpper: boolean;
                                };
                                f: {
                                    isDouble: boolean;
                                    doubleNotation: string;
                                };
                                F: {
                                    extend: string[];
                                };
                                g: {
                                    isDouble: boolean;
                                    doubleNotation: string;
                                };
                                G: {
                                    extend: string[];
                                    toUpper: boolean;
                                };
                            };
                            format: (e: any) => string;
                            _zeros10: string;
                            _spaces10: string;
                            formatInt: (e: any) => void;
                            formatDouble: (e: any) => void;
                            zeroPad: (e: any, t: any) => void;
                            fitField: (e: any) => string;
                            spacePad: (e: any, t: any) => void;
                        };
                    };
                };
            }
            interface Dojox {
                string: Dojox_String;
            }
            var dojox: Dojox;
        }
    }
    const _default_42: {
        (e: string, t: any): string;
        Formatter: {
            new (e: string): {
                _mapped: boolean;
                _format: string;
                _tokens: any[];
                _re: RegExp;
                _parseDelim: (e: any, t: any, i: any, n: any, o: any, a: any, s: any) => {
                    mapping: any;
                    intmapping: any;
                    flags: any;
                    _minWidth: any;
                    period: any;
                    _precision: any;
                    specifier: any;
                };
                _specifiers: {
                    b: {
                        base: number;
                        isInt: boolean;
                    };
                    o: {
                        base: number;
                        isInt: boolean;
                    };
                    x: {
                        base: number;
                        isInt: boolean;
                    };
                    X: {
                        extend: string[];
                        toUpper: boolean;
                    };
                    d: {
                        base: number;
                        isInt: boolean;
                    };
                    i: {
                        extend: string[];
                    };
                    u: {
                        extend: string[];
                        isUnsigned: boolean;
                    };
                    c: {
                        setArg: (e: any) => void;
                    };
                    s: {
                        setMaxWidth: (e: any) => void;
                    };
                    e: {
                        isDouble: boolean;
                        doubleNotation: string;
                    };
                    E: {
                        extend: string[];
                        toUpper: boolean;
                    };
                    f: {
                        isDouble: boolean;
                        doubleNotation: string;
                    };
                    F: {
                        extend: string[];
                    };
                    g: {
                        isDouble: boolean;
                        doubleNotation: string;
                    };
                    G: {
                        extend: string[];
                        toUpper: boolean;
                    };
                };
                format: (e: any) => string;
                _zeros10: string;
                _spaces10: string;
                formatInt: (e: any) => void;
                formatDouble: (e: any) => void;
                zeroPad: (e: any, t: any) => void;
                fitField: (e: any) => string;
                spacePad: (e: any, t: any) => void;
            };
        };
    };
    export = _default_42;
}
declare module "dojox/dtl/filter/strings" {
    var filter: any;
    global {
        namespace DojoJS {
            interface Dojox_DTL_Filter {
                strings: {
                    _urlquote: (e: string, t?: string) => string;
                    addslashes: (e: string) => string;
                    capfirst: (e: string) => string;
                    center: (e: string, t?: number) => string;
                    cut: (e: string, t: string) => string;
                    fix_ampersands: (e: string) => string;
                    floatformat: (e: string, t: number) => string;
                    iriencode: (e: string) => string;
                    linenumbers: (e: string) => string;
                    ljust: (e: string, t: number) => string;
                    lower: (e: string) => string;
                    make_list: (e: any) => any[];
                    rjust: (e: string, t: number) => string;
                    slugify: (e: string) => string;
                    stringformat: (e: string, t: string) => string;
                    title: (e: string) => string;
                    truncatewords: (e: string, t: number) => string;
                    truncatewords_html: (e: string, t: number) => string;
                    upper: (e: string) => string;
                    urlencode: (e: string) => string;
                    urlize: (e: string) => string;
                    urlizetrunc: (e: string, t: number) => string;
                    wordcount: (t: string) => number;
                    wordwrap: (e: string, t: number) => string;
                    _strings: any;
                };
            }
            interface Dojox_DTL {
                filter: Dojox_DTL_Filter;
            }
        }
    }
    export = filter;
}
declare module "dojox/html/entities" {
    var entities: {
        encode: (e: string, t?: any) => string;
        decode: (e: string, t?: any) => string;
        html: string[][];
        latin: string[][];
    };
    global {
        namespace DojoJS {
            interface DojoHTML {
                entities: typeof entities;
            }
            interface Dojo {
                html: DojoHTML;
            }
        }
    }
    export = entities;
}
declare module "dojox/uuid/_base" {
    import "dojo/_base/lang";
    global {
        namespace DojoJS {
            interface Dojox_UUID {
                NIL_UUID: "00000000-0000-0000-0000-000000000000";
                version: {
                    UNKNOWN: 0;
                    TIME_BASED: 1;
                    DCE_SECURITY: 2;
                    NAME_BASED_MD5: 3;
                    RANDOM: 4;
                    NAME_BASED_SHA1: 5;
                };
                variant: {
                    NCS: "0";
                    DCE: "10";
                    MICROSOFT: "110";
                    UNKNOWN: "111";
                };
                _ourVariantLookupTable: Buffer<Dojox_UUID["variant"][keyof Dojox_UUID["variant"]], 16>;
                assert: (condition: boolean, error?: any) => void | throws<Error>;
                generateNilUuid: () => "00000000-0000-0000-0000-000000000000";
                isValid: (uuid: string) => boolean;
                getVariant: (uuid: string) => "0" | "10" | "110" | "111" | throws<Error>;
                getVersion: (uuid: string) => number | throws<Error>;
                getNode: (uuid: string) => string | throws<Error>;
                getTimestamp: <T extends 'string' | 'hex' | 'date' | DateConstructor | StringConstructor | null = null>(uuid: string, type?: T | null) => (T extends Falsy ? Date : T extends ('string' | StringConstructor | 'hex') ? string : Date) | throws<Error>;
            }
            interface Dojox {
                uuid: Dojox_UUID;
            }
        }
        var dojox: DojoJS.Dojox;
    }
    const _default_43: DojoJS.Dojox_UUID;
    export = _default_43;
}
declare module "dojox/uuid/generateRandomUuid" {
    import "dojox/uuid/_base";
    global {
        namespace DojoJS {
            type UUID = `${string}-${string}-4${string}-8${string}-${string}`;
            interface Dojox_UUID {
                /**
                 * @returns A random UUID in the format xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx
                 */
                generateRandomUuid: () => UUID;
            }
            interface Dojox {
                uuid: Dojox_UUID;
            }
        }
    }
    const _default_44: () => DojoJS.UUID;
    export = _default_44;
}
declare module "ebg/chatinput" {
    global {
        namespace BGA {
            type ChatAjaxURLs = `/${string}/${string}/say.html` | '/table/table/say_private.html';
            interface ChatInputBaseParams {
                to?: BGA.ID;
                table?: BGA.ID;
            }
            interface ChatInputAjaxArgs extends ChatInputBaseParams {
                msg: string;
                no_notif?: 1;
            }
            interface AjaxActions extends Type<{
                [url in ChatAjaxURLs]: ChatInputAjaxArgs;
            }> {
            }
        }
    }
    class ChatInput_Template {
        page: null | InstanceType<BGA.SiteCore>;
        container_id: null | string;
        post_url: BGA.ChatAjaxURLs | "";
        default_content: string;
        input_div: null | HTMLInputElement;
        baseparams: BGA.ChatInputBaseParams;
        detachType: null | string;
        detachId: null | BGA.ID;
        detachTypeGame: null | string;
        callbackBeforeChat: null | ((t: Record<string, any>, n: string) => boolean);
        callbackAfterChat: null | ((t: Record<string, any>) => void);
        callbackAfterChatError: null | ((t: Record<string, any>) => void);
        writingNowChannel: null | string;
        bWritingNow: boolean;
        writingNowTimeout: null | number;
        writingNowTimeoutDelay: number;
        lastTimeStartWriting: null | number;
        max_height: number;
        bIncreaseHeightToTop: boolean;
        post_url_bis?: BGA.ChatAjaxURLs;
        create(page: InstanceType<BGA.SiteCore>, container_id: string, post_url: BGA.ChatAjaxURLs, default_content: string): false | undefined;
        destroy(): void;
        sendMessage(): void;
        onChatInputKeyPress(t: KeyboardEvent): void | throws<TypeError>;
        onChatInputKeyUp(t: KeyboardEvent): boolean | throws<TypeError>;
        readaptChatHeight(): void | throws<TypeError>;
        onChatInputFocus(e: FocusEvent): void;
        onChatInputBlur(e: FocusEvent): void;
        addContentToInput(e: string): void | throws<TypeError>;
    }
    let ChatInput: DojoJS.DojoClass<ChatInput_Template, []>;
    export = ChatInput;
    global {
        namespace BGA {
            type ChatInput = typeof ChatInput;
            interface EBG {
                chatinput: ChatInput;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/comboajax" {
    import "dijit/form/FilteringSelect";
    import "dojox/data/QueryReadStore";
    interface HTMLValueElement extends HTMLElement {
        value?: string;
    }
    type FilteringSelectInstance = InstanceType<typeof dijit.form.FilteringSelect>;
    class ComboAjax_Template {
        div_id: string | null;
        div: HTMLValueElement | null;
        query_url: string;
        stateStore: InstanceType<typeof dojox.data.QueryReadStore> | null;
        filteringSelect: FilteringSelectInstance | null;
        currentSelection: string | null;
        disableNextOnChange: boolean;
        onChange: (e: string) => void;
        create(t: string, i: string, n: string | undefined, o: string | undefined): void;
        onKeyUp(e: KeyboardEvent): void;
        setValue(e: string): void;
        destroy(e: any): void;
        getSelection(): any;
    }
    let ComboAjax: DojoJS.DojoClass<ComboAjax_Template, []>;
    export = ComboAjax;
    global {
        namespace BGA {
            type ComboAjax = typeof ComboAjax;
            interface EBG {
                comboajax: ComboAjax;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/counter" {
    /**
     * A simple control that allow to set/get numeric value from inner html of div/span, and provides an ease-out animation on from/to value.
     * @see {@link https://en.boardgamearena.com/doc/Counter|Documentation}
     * @example
     * // Create the template for counter
     * var jstpl_player_board = '\<div class="cp_board">\
     * 	<div id="stoneicon_p${id}" class="gmk_stoneicon gmk_stoneicon_${color}"></div><span id="stonecount_p${id}">0</span>\
     * </div>';
     *
     * // Setting up player boards
     * this.stone_counters={};
     * for( var player_id in gamedatas.players ) {
     * 	var player = gamedatas.players[player_id];
     *
     * 	// Setting up players boards if needed
     * 	var player_board_div = $('player_board_'+player_id);
     * 	dojo.place( this.format_block('jstpl_player_board', player ), player_board_div );
     * 	// create counter per player
     * 	this.stone_counters[player_id]=new ebg.counter();
     * 	this.stone_counters[player_id].create('stonecount_p'+player_id);
     * }
     */
    class Counter_Template {
        span: Element | null;
        current_value: BGA.ID | typeof NaN;
        target_value: BGA.ID | null | typeof NaN;
        /** Duration of the animation, default is 100ms. */
        speed: number;
        /**
         * Associates this counter with an existing target DOM element.
         *
         * @throws {TypeError} if the target is not found.
         */
        create(elementOrSelectors: string | Element | null): void | throws<TypeError>;
        /**
         * Getter for the property {@link Counter_Template.target_value}.
         */
        getValue(): BGA.ID | null | typeof NaN;
        /**
         * Sets the value of the counter to the specified amount by immediately updating {@link current_value}, {@link target_value}, and the html of {@link span}. Use {@link toValue} to animate the change over time.
         * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
         */
        setValue(value: BGA.ID): void | throws<TypeError>;
        /**
         * Sets the value of the counter to the specified amount by setting {@link target_value} and dynamically updating {@link current_value} over time. The animation ticks every {@link speed} milliseconds, moving 20% closer to the target value each time (minimum 1, resulting in an ease-out like update).
         * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
         */
        toValue(value: BGA.ID): void | throws<TypeError>;
        /**
         * Wrapper for {@link toValue} that increments the target value by the specified amount through an ease-out animation.
         * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
         * @returns The new target value of the counter.
         */
        incValue(by: number | string): number | typeof NaN | throws<TypeError>;
        /**
         * Sets the display of the {@link span} to '-' to indicate that the counter is disabled. The internal values of the counter are not changed and can be re-enabled by using {@link setValue}, {@link toValue}, or {@link incValue}.
         * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
         */
        disable(): void | throws<TypeError>;
        /** Moves the counter towards the target value by 20% of the difference. */
        protected makeCounterProgress(): void | throws<TypeError>;
        /** Removes the "counter_in_progress" class from the {@link span} to indicate that the counter has finished animating. */
        protected finishCounterMove(): void | throws<TypeError>;
    }
    let Counter: DojoJS.DojoClass<Counter_Template, []>;
    export = Counter;
    global {
        namespace BGA {
            type Counter = typeof Counter;
            interface EBG {
                counter: Counter;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/dices" {
    class Dices_Template {
        div_id: string | null;
        div: HTMLElement | null;
        dice_nbr: number;
        dice_type: number;
        create(t: string, i: number, n: number): void;
        setValue(t: Record<string, number>): void;
    }
    let Dices: DojoJS.DojoClass<Dices_Template, []>;
    export = Dices;
    global {
        namespace BGA {
            type Dices = typeof Dices;
            interface EBG {
                dices: Dices;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "svelte/index" {
    const svelte: any;
    export = svelte;
}
declare module "ebg/core/common" {
    import "dojo/date";
    global {
        /**
         * Returns a formatted url for the specified file. This is used to load assets that are not versioned with the game (updates the version number in the game theme url with the version of the matching file).
         * @param file The file to get the url for. This does not include the game theme url. For example, 'img/cards.jpg'.
         * @returns The formatted url for the specified file in the following format: `{game theme name}{file version}/{file path}`. If the file is not included in the static assets, the {@link g_gamethemeurl} + {file} is returned instead.
         */
        var getStaticAssetUrl: (file: string) => string;
    }
    global {
        /**
         * Publishes the `notifEnd` event which ends the current asynchronous notification. This should only be called when wanting to interrupt a notification that has been marked as synchronous with {@link GameNotif.setSynchronous}.
         * ```js
         * dojo.publish('notifEnd', null);
         * ```
         */
        var endnotif: () => void;
    }
    global {
        /**
         * Formats the given bga string format with the given arguments. There are a few special formatting options, but this mostly just adds classes to bits of text based on the syntax of the format.
         * @example
         * bga_format("Hello, [world]!", {
         * 	"[": "highlight"
         * });
         * // Returns: "Hello, <span class='highlight'>world</span>!"
         */
        var bga_format: (format: string, classes: Record<string, string | ((t: string) => string)>) => string;
    }
    global {
        /**
         * Formats the given duration in minutes to human readable format.
         * @example
         * time_format(17); // Returns: "17mn"
         * time_format(65); // Returns: "1h"
         * time_format(233); // Returns: "4h"
         */
        var time_format: (minutes: number) => string;
    }
    global {
        /**
         * Same as {@link time_format}, but with more features and always makes the time negative (x ago).
         */
        var time_ago_format: (minutes: number) => string;
    }
    global {
        /**
         * Formats a given timestamp into a human-readable date/time string.
         * @param timestamp A timestamp in seconds.
         * @param minFlag If true and the time differences is less than 4 hours, the time will include the minutes.
         * @param dateFormat If true, the date will be formatted as a date given the current locale. Either `${Y}-${M}-${D}` or `${M}/${D}/${Y}`
         * @param includeTimezone If true, the timezone will be included in the date string. If this is true, there may be an error if the {@link mainsite} object is not defined or does not have a timezone property.
         * @returns The formatted date string.
         */
        var date_format: (timestamp: number, minFlag?: boolean, dateFormat?: boolean, includeTimezone?: boolean) => string;
    }
    global {
        /**
         * Formats a given timestamp into a human-readable date/time string.
         *
         * @param timestamp The timestamp in seconds.
         * @returns The formatted date/time string.
         *
         * @example
         * // returns "01/01/1970 at 00:00" or "1970-01-01 at 00:00" depending on user's preference
         * date_format_simple(0);
         */
        var date_format_simple: (timestamp: number) => string;
    }
    global {
        /**
         * Formats a given timestamp into a human-readable time string.
         *
         * @param timestamp - The timestamp in seconds.
         * @returns The formatted time string in the format "HH:mm".
         *
         * @example
         * // returns "00:00"
         * daytime_format(0);
         */
        var daytime_format: (timestamp: number) => string;
    }
    global {
        /**
         * Checks if the given value is undefined.
         * @param value The value to check.
         * @returns True if the value is undefined, false otherwise.
         */
        var isset: <T>(value: T) => value is T & ({} | null);
    }
    global {
        /**
         * Converts the given value (base 10) to a number. If the value is null, it is returned as null.
         * This is simply a wrapper for the `parseInt` function, but with a null check.
         * @param value The value to convert to a number.
         * @returns The value as a number, or null if the value is null.
         */
        var toint: {
            (value: null): null;
            (value: number): number;
            (value: string | number | undefined): number | typeof NaN;
            (value: string | number | null | undefined): number | typeof NaN | null;
        };
    }
    global {
        /**
         * Converts the given value to a floating point number. If the value is null, it is returned as null.
         * This is simply a wrapper for the `parseFloat` function, but with a null check.
         * @param value The value to convert to a number.
         * @returns The value as a number, or null if the value is null.
         */
        var tofloat: {
            (value: null): null;
            (value: number): number;
            (value: string | number | undefined): number | typeof NaN;
            (value: string | number | null | undefined): number | typeof NaN | null;
        };
    }
    global {
        /**
         * Pads the start of the string with zeros until it reaches the given length.
         * This is the equivalent of the {@link String.prototype.padStart} function, using {length} and '0' as the arguments.
         * @param str The string to pad with zeros
         * @param width The width to pad the number to.
         * @returns The new string with the padded zeros. The length of the string will be at least the width. (if it was already longer, it will not be shortened)
         */
        var zeroFill: (str: any, width: number) => string;
    }
    global {
        /**
         * Capitalizes the first letter of the given string.
         * @param str The string to capitalize.
         * @returns The string with the first letter capitalized.
         */
        var ucFirst: (str: string) => string;
    }
    global {
        /**
         * Formats the given number with the given number by adding spaces after every 3 digits.
         * @param number The number to format.
         * @returns The formatted number.
         */
        var format_number: (number: number) => string;
    }
    global {
        /**
         * Play a sound file. This file must have both a .mp3 and a .ogg file with the names <gamename>_<soundname>[.ogg][.mp3] amd must be defined in the .tpl file:
         *
         * `<audio id="audiosrc_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.mp3" preload="none" autobuffer></audio>
         * `<audio id="audiosrc_o_<gamename>_<yoursoundname>" src="{GAMETHEMEURL}img/<gamename>_<yoursoundname>.ogg" preload="none" autobuffer></audio>`
         *
         * This is an alias for {@link SoundManager.doPlay}.
         * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
         * @example
         * playSound('yourgamename_yoursoundname');
         */
        var playSound: (sound: string) => void;
    }
    global {
        /**
         * Called from {@link playSound} to actually play the sound. Unlike using {@link playSound}, this function does not check for the muted status, does not catch errors, and does not use {@link SoundManager.getSoundIdFromEvent} to update sound aliases.
         *
         * This is an alias for {@link SoundManager.doPlayFile}.
         *
         * @param sound The name of the sound file to play in the form '<gamename>_<soundname>'.
         */
        var playSoundFile: (sound: string) => void;
    }
    global {
        /**
         * Stops the sound with the given name. This is done by pausing the audio element with the given id.
         *
         * This is an alias for {@link SoundManager.stop}.
         *
         * @param sound The name of the sound file to stop in the form '<gamename>_<soundname>'.
         * @example
         * stopSound('yourgamename_yoursoundname');
         */
        var stopSound: (sound: string) => void;
    }
    global {
        /**
         * The global translation function for page specific elements, used to translate a key (usually English string).
         * @param key The key to get the translation for.
         * @returns The translation for the given key.
         *
         * This is an alias for {@link g_i18n.getSimpleTranslation}, with checks to ensure the translation is not undefined.
         */
        var _: (key: string) => string;
    }
    global {
        /**
         * The global translation dictionary, where the first key is the bundle to pull translations from, and the second is the key in that bundle.
         * @param bundle The bundle to pull translations from.
         * @param key The key to get the translation for.
         * @returns The translation for the given key.
         *
         * This is an alias for {@link g_i18n.getTranslation}, with checks to ensure the translation is not undefined.
         */
        var __: (bundle: string, key: string) => string;
    }
    global {
        /**
         * Gets the location description from the given result. This is done by concatenating the long names of each address component.
         * @param result The result to get the location description from.
         * @returns The location description.
         * WIP: The arg type is based on the Google Maps API, but the API type is not fully implemented.
         */
        var getLocationDescriptionFromResult: (result: {
            address_components: {
                long_name: string;
            }[];
        }) => string;
    }
    global {
        /**
         * Analyzes the location description from the given result. This is done by extracting the city, area1, area2, and country from the address components.
         * @param result The result to analyze the location description from.
         * @returns The analyzed location description.
         * WIP: The arg type is based on the Google Maps API, but the API type is not fully implemented.
         */
        var analyseLocationDescriptionFromResult: (result: {
            address_components: {
                long_name: string;
                short_name: string;
                types: string[];
            }[];
        }) => {
            city: string;
            area1: string;
            area2: string;
            country: string;
        };
    }
    global {
        /**
         * Converts the given id to a path in the form `x/y/z`, where z is the last 3 digits of the id, y is the next 3 digits, and x is the remaining digits.
         * @param id The id to convert to a path.
         * @returns The path in the form `x/y/z`.
         */
        var id_to_path: (id: number) => string;
    }
    global {
        /**
         * Converts the given player device to an icon name. This is done by returning 'circle' for desktop, 'tablet' for tablet, and 'mobile' for mobile.
         * @param device The device to convert to an icon name.
         * @returns The icon name for the given device.
         */
        var playerDeviceToIcon: (device: 'desktop' | 'tablet' | 'mobile') => string;
    }
    class TimeZone {
        utc_offset: string;
        olson_tz: string;
        uses_dst: boolean;
        constructor(utc_offset: string, olson_tz: string, uses_dst: boolean);
        display(): string;
        ambiguity_check(): void;
    }
    global {
        /**
         * Helper object for detecting the timezone of the user, and relevant timezone information.
         */
        var jzTimezoneDetector: {
            HEMISPHERE_SOUTH: "SOUTH";
            HEMISPHERE_NORTH: "NORTH";
            HEMISPHERE_UNKNOWN: "N/A";
            olson: {
                ambiguity_list: Record<string, string[]>;
                dst_start_dates: Record<string, Date>;
                timezones: Record<`${"-" | ""}${number},${0 | 1}${",s" | ""}`, TimeZone>;
            };
            TimeZone: typeof TimeZone;
            date_is_dst: (date: Date) => boolean;
            get_date_offset: (date: Date) => number;
            get_timezone_info: () => {
                utc_offset: number;
                dst: number;
                hemisphere: "SOUTH" | "NORTH" | "N/A";
            };
            get_january_offset: () => number;
            get_june_offset: () => number;
            determine_timezone: () => {
                timezone: TimeZone;
                key: string;
            };
        };
    }
    global {
        /**
         * Focuses and sets the selection range for the given input element using {@link HTMLInputElement.setSelectionRange}.
         * This has a fallback for older browsers using `createTextRange`.
         * @param element The input element to set the selection range for.
         * @param position The position to set the caret to.
         */
        var setCaretPosition: (element: HTMLInputElement | {
            createTextRange: () => object;
        }, position: number) => void;
    }
    global {
        /**
         * Replaces all instances of the given substring in the given string with the new substring. This is the same as using the {@link String.prototype.replace} function, but escapes punctuation in the find string.
         * @param str The string to replace the substrings in.
         * @param find The substring to find.
         * @param replace The substring to replace the found substrings with.
         * @returns The string with all instances of the find substring replaced with the replace substring.
         */
        var replaceAll: (str: string, find: string, replace: string) => string;
    }
    global {
        /**
         * Removes all duplicate elements from the given array.
         * @param array The array to remove duplicates from.
         * @returns The array with all duplicate elements removed.
         */
        var array_unique: <T extends keyof any>(array: T[]) => T[];
    }
    global {
        /**
         * Extracts the domain from the given url. This is done by returning the protocol and domain of the url.
         * @param url The url to extract the domain from.
         * @returns The domain of the url.
         * @example
         * extractDomain('https://www.example.com/path/to/file.html'); // Returns: 'https://www.example.com'
         */
        var extractDomain: (url: string) => string | undefined;
    }
    class CookieConsentUtils {
        escapeRegExp(e: string): string;
        hasClass(e: HTMLElement, t: string): boolean;
        addClass(e: HTMLElement, t: string): void;
        removeClass(e: HTMLElement, t: string): void;
        interpolateString(e: string, t: Function): string;
        getCookie(e: string): string | undefined;
        setCookie(e: string, t: string, i: number, n: string, o: string): void;
        deepExtend(e: Record<string, any>, t: Record<string, any>): Record<string, any>;
        throttle(e: Function, t: number): Function;
        hash(e: string): number;
        normaliseHex(e: string): string;
        getContrast(e: string): string;
        getLuminance(e: string): string;
        isMobile(): boolean;
        isPlainObject(e: any): boolean;
    }
    class CookieConsent {
        hasInitialised: boolean;
        status: {
            deny: string;
            allow: string;
            dismiss: string;
        };
        /**
         * The css property used on this browser for ending transitions.
         */
        transitionEnd: string;
        hasTransition: boolean;
        customStyles: Record<string, {
            references: number;
            element: CSSStyleSheet | null;
        } | null>;
        Popup: typeof CookieConsentPopup;
        Location: typeof CookieConsentLocation;
        Law: typeof CookieConsentLaw;
        initialise(t: any, i?: ((popup: CookieConsentPopup) => void) | (() => void) | null, n?: ((error: Error, popup: CookieConsentPopup) => void) | (() => void)): void;
        getCountryCode(t: any, i: Function, errorCallback: (t: any) => void): void;
        utils: CookieConsentUtils;
    }
    class CookieConsentPopup {
        private openingTimeout;
        private afterTransition;
        private onButtonClick;
        private customStyleSelector;
        private element;
        private revokeBtn;
        private dismissTimeout;
        private onWindowScroll;
        private onMouseMove;
        private options;
        private n;
        private o;
        private a;
        private s;
        private r;
        private l;
        private d;
        private c;
        private h;
        private u;
        private p;
        private m;
        private g;
        private _;
        private f;
        private static v;
        initialise(e: Record<string, any>): void;
        destroy(): void;
        open(_?: any): this | undefined;
        close(t: boolean): this | undefined;
        fadeIn(): void;
        fadeOut(): void;
        isOpen(): boolean | null;
        toggleRevokeButton(e?: boolean): void;
        revokeChoice(e?: any): void;
        hasAnswered(_?: any): boolean;
        hasConsented(_?: any): boolean;
        autoOpen(_?: any): void;
        setStatus(i: string): void;
        getStatus(): string | undefined;
        clearStatus(): void;
    }
    interface CookieConsentLocationServiceContext {
        url: string;
        callback?: (e: any, t: string) => any;
        isScript?: boolean;
        data?: Document | XMLHttpRequestBodyInit | null;
        headers?: string[];
        __JSONP_DATA?: string;
    }
    class CookieConsentLocation {
        options: Record<string, any> & {
            timeout?: number;
            services?: (string | Function | {
                name: string;
            })[];
            serviceDefinitions?: Record<string, any>;
        };
        currentServiceIndex: number;
        callbackComplete?: ((e: any) => void) | null;
        callbackError?: ((e: any) => void) | null;
        constructor(e: Record<string, any>);
        private i;
        private n;
        private o;
        private static a;
        getNextService(): any;
        getServiceByIdx(e: number): any;
        locate(succussCallback: (e: any) => void, errorCallback: (t: any) => void): undefined;
        setupUrl(e: CookieConsentLocationServiceContext): string;
        runService(e: CookieConsentLocationServiceContext, t: (e: any, t: any) => void): void;
        runServiceCallback(callback: (succuss_data: any, error_data?: any) => void, t: CookieConsentLocationServiceContext, i: string): void;
        onServiceResult(callback: (succuss_data: any, error_data?: any) => void, callbackArg?: any): void;
        runNextServiceOnError(data: any, callbackArg?: any): void;
        getCurrentServiceOpts(): any;
        completeService(callback?: ((succuss_data: any, error_data?: any) => void) | null, callbackArg?: any): void;
        logError(data: any): void;
    }
    class CookieConsentLaw {
        constructor(e: any);
        private static i;
        options: typeof CookieConsentLaw.i;
        initialise(e: any): void;
        get(e: string): {
            hasLaw: boolean;
            revokable: boolean;
            explicitAction: boolean;
        };
        applyLaw(e: {
            enabled: boolean;
            revokable: boolean;
            dismissOnScroll: boolean;
            dismissOnTimeout: boolean;
        }, t: string): {
            enabled: boolean;
            revokable: boolean;
            dismissOnScroll: boolean;
            dismissOnTimeout: boolean;
        };
    }
    global {
        /**
         * Initializes the {@link cookieconsent} object by creating a new object.
         */
        var cookieConsentInit: () => void;
        /** If the Cookies have been okayed on the window. */
        var CookiesOK: boolean;
        interface Window {
            /** The cookieconsent callback object based on the Date.now() value. */
            [callback_number: `callback${number}`]: (arg: any) => void;
        }
        /**
         * The cookieconsent object that is used to manage the cookie consent popup.
         */
        var cookieconsent: CookieConsent;
    }
    global {
        /**
         * Returns the given string with all accent characters replaced with their non-accented counterparts.
         * @param str The string to remove accents from.
         * @returns The string with all accent characters replaced with their non-accented counterparts.
         */
        var removeAccents: (str: string) => string;
    }
    global {
        /**
         * Returns a URL for the player avatar image. If the avatar for the player id is not found (element with id `avatar_${playerId}`), then the default avatar picture will be returned.
         * @param playerId The player id for the avatar. If this the string representation of this value is not an integer, then playerId = 0.
         * @param avatar The avatar for the player.
         * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
         * @returns The URL for the player avatar image.
         */
        var getPlayerAvatar: (playerId?: number | any, avatar?: string, size?: 32 | 50 | 92 | 184 | '32' | '50' | '92' | '184') => string;
    }
    global {
        /**
         * Returns a URL for the group avatar image. If the avatar for the group is not found, then the default avatar picture will be returned.
         * @param groupId The group id for the avatar. If this the string representation of this value is not an integer, then groupId = 0.
         * @param avatar The avatar for the player.
         * @param avatar The avatar for the player.
         * @param type The type of group. Either 'tournament' or 'group'. Defaults to 'group'.
         * @param size The size of the avatar. Either 32, 50, 92, or 184. Defaults to 50.
         * @returns The URL for the player avatar image.
         */
        var getGroupAvatar: (groupId?: number | any, avatar?: string, type?: 'tournament' | 'group', size?: 32 | 50 | 92 | 184 | '32' | '50' | '92' | '184') => string;
    }
    global {
        /**
         * Returns a URL for the media image (game meta data image).
         * @param gameName The name of the game.
         * @param type The type of media.
         * @param subscript The subscript for the media image, usually '280' for the box, '2000' for the title, and undefined otherwise.
         * @param variation The variation of the media image. 'banner', 'box', and 'title' will usually use 'default' or a language code. 'display' and 'publisher' will usually use a number to represent the index of the image as it was uploaded.
         * @param hParam (not sure) Some id/key for the image request, put in the URL as a query parameter. Seems to not change how the image is returned (possibly used to force a cache refresh).
         * @returns The URL for the media image.
         */
        var getMediaUrl: (gameName: string, type: 'banner' | 'display' | 'box' | 'publisher' | 'title' | 'icon', subscript?: number | string | null, variation?: 'default' | string | number | null, hParam?: number | null) => string;
    }
    global {
        /**
         * Pushes the given data to the data layer for analytics. See {@link https://developers.google.com/tag-manager/devguide#datalayer} for more information on how this data is used. This function is the same as {@link gtag} and {@link dataLayer.push}.
         * @param data The data to push to the data layer.
         */
        var analyticsPush: (data: any) => void;
    }
}
declare module "ebg/core/i18n" {
    import "dojo/i18n";
    /**
     * Internal. A wrapper for {@link DojoJS.i18n} that is used to handle translations in BGA pages. This is used to define the bundles which can be used to
    find translations for a given key. This is used to create the global translation functions {@link _} and {@link __}.
     */
    class I18n_Template {
        /** The record bundles that holds a record of translations based on the client local settings. */
        nlsStrings: Record<string, Record<string, string>>;
        /** The active bundle that is currently being used for translations. This is usually used for page specific translations. */
        activeBundle: string;
        /** The version of the js bundle. */
        jsbundlesversion: string;
        /**
         * Loads all translations from the given bundle from the dojo i18n.
         * @param bundle The name of the bundle to load.
         * ```js
         * this.nlsStrings[t] = dojo.i18n.getLocalization("ebg", t)
         * ```
         */
        loadBundle(bundle: string): void;
        /**
         * Gets the translation for the given key from the active bundle.
         * @param bundle The name of the bundle to load.
         * @param key The key to get the translation for.
         * @returns The translation for the given key.
         * @throws {TypeError} if the bundle has not been loaded.
         */
        getTranslation(bundle: string, key: string): string | throws<TypeError>;
        /**
         * Sets the active bundle to the given bundle. This is used as a default for when using the getSimpleTranslation function.
         * @param bundle The name of the bundle to set as active.
         */
        setActiveBundle(bundle: string): void;
        /**
         * Gets the translation for the given key from the active bundle.
         * @param key The key to get the translation for.
         * @returns The translation for the given key.
         * @throws {TypeError} if the {@link activeBundle} has not been loaded.
         */
        getSimpleTranslation(key: string, failWithError?: boolean): string | throws<TypeError>;
    }
    let I18n: DojoJS.DojoClass<I18n_Template, []>;
    export = I18n;
    global {
        namespace BGA {
            type I18n = typeof I18n;
            interface EBG {
                core: EBG_CORE;
            }
            interface EBG_CORE {
                i18n: I18n;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/scriptlogger" {
    /**
     * Script Logger is a class that logs messages to the server.
     */
    class ScriptLogger_Template {
        logName: string;
        logBuffer: string | null;
        identifier: string;
        ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
        constructor(e: string, t: InstanceType<BGA.CorePage>["ajaxcall"], i: string);
        log(e: string): void;
        flush(): void;
    }
    let ScriptLogger: DojoJS.DojoClass<ScriptLogger_Template, [e: string, t: <Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "iframe" | "get" | "post" | undefined) => void, i: string]>;
    export = ScriptLogger;
    global {
        namespace BGA {
            type ScriptLogger = typeof ScriptLogger;
            interface EBG {
                scriptlogger: ScriptLogger;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/peerconnect" {
    type ScriptLogger = InstanceType<typeof import("ebg/scriptlogger")>;
    class PeerConnect_Template {
        peerId: BGA.ID;
        localStream: MediaStream;
        remoteVideo: HTMLVideoElement | null;
        remoteStream: MediaStream | null;
        pc: RTCPeerConnection | null;
        started: boolean;
        logger: ScriptLogger;
        sendPlayerMessage_callback: unknown;
        pcConfig: RTCConfiguration;
        pcConstraints: RTCConfiguration;
        mediaConstraints: MediaStreamConstraints;
        stereo: boolean;
        offerConstraints: RTCOfferOptions;
        sdpConstraints: RTCOfferOptions;
        constructor(peerId: BGA.ID, pcConfig: RTCConfiguration, pcConstraints: any, mediaConstraints: MediaStreamConstraints, stereo: boolean, localStream: MediaStream, logger: ScriptLogger, sendPlayerMessage_callback: any);
        maybeStart(): void;
        requestCall(): void;
        doCall(): void;
        mergeConstraints(e: RTCOfferOptions, t: RTCOfferOptions): RTCOfferOptions;
        handleCreateOfferError(e: any): void;
        doAnswer(): void;
        onCreateAnswerError(e: any): void;
        stop(): void;
        handleMessage(t: any): void;
        onSetLocalSessionDescriptionSuccess(): void;
        onSetLocalSessionDescriptionError(e: any): void;
        onSetRemoteSessionDescriptionSuccess(): void;
        onSetRemoteSessionDescriptionError(e: any): void;
        onAddIceCandidateSuccess(): void;
        onAddIceCandidateError(e: any): void;
        createPeerConnection(): RTCPeerConnection | null;
        handleIceCandidate(e: RTCPeerConnectionIceEvent): void;
        handleRemoteStreamAdded(e: RTCTrackEvent): void;
        handleRemoteStreamRemoved(e: RTCTrackEvent): void;
        onSignalingStateChanged(e: Event): void;
        onIceConnectionStateChanged(e: Event): void;
        getConnectionDetails(e: RTCPeerConnection): Promise<any>;
        setLocalSessionDescription(t: RTCSessionDescriptionInit): void;
        sendLocalSessionDescription(): void;
    }
    let PeerConnect: DojoJS.DojoClass<PeerConnect_Template, [peerId: BGA.ID, pcConfig: RTCConfiguration, pcConstraints: any, mediaConstraints: MediaStreamConstraints, stereo: boolean, localStream: MediaStream, logger: {
        logName: string;
        logBuffer: string | null;
        identifier: string;
        ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
        log(e: string): void;
        flush(): void;
    } & DojoJS.DojoClassObject, sendPlayerMessage_callback: any]>;
    export = PeerConnect;
    global {
        namespace BGA {
            type PeerConnect = typeof PeerConnect;
            interface EBG {
                peerconnect: PeerConnect;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/webrtc" {
    import "ebg/peerconnect";
    import "ebg/scriptlogger";
    type PeerConnect = InstanceType<typeof import("ebg/peerconnect")>;
    type ScriptLogger = InstanceType<typeof import("ebg/scriptlogger")>;
    global {
        namespace BGA {
            type RoomId = `T${number}` | `P${number}_${number}`;
            interface AjaxActions {
                "/videochat/videochat/relayPlayerMessage.html": {
                    player_id: BGA.ID;
                    room: BGA.RoomId;
                    message: string;
                };
                "/videochat/videochat/relayRoomMessage.html": {
                    room: BGA.RoomId;
                    message: string;
                };
            }
            /** This is an extension of the {@link MediaStreamConstraints} interface that adds more properties to the video property. */
            interface WebRTCMediaConstraints {
                audio: boolean | MediaTrackConstraints;
                peerIdentity?: string;
                preferCurrentTab?: boolean;
                video: boolean | MediaTrackConstraints & {
                    mandatory: {
                        minAspectRatio: number;
                        maxAspectRatio: number;
                        maxWidth: number;
                        maxFrameRate: number;
                    };
                    optional: any[];
                };
            }
        }
    }
    class WebRTC_Template {
        player_id: BGA.ID;
        room: BGA.RoomId;
        in_room: BGA.ID[];
        logger: ScriptLogger;
        connections: Record<BGA.ID, PeerConnect>;
        pcConfig: RTCConfiguration;
        pcConstraints: RTCOfferOptions;
        mediaConstraints: BGA.WebRTCMediaConstraints;
        stereo: boolean;
        ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];
        getUserMediaSuccess_callback: () => void;
        getUserMediaError_callback: () => void;
        onJoinRoom_callback: (player_id: BGA.ID, is_new: boolean) => void;
        onLeaveRoom_callback: (player_id: BGA.ID) => void;
        localVideo: HTMLVideoElement | null;
        localStream: MediaStream & {
            stop: Function;
        } | null;
        isAudioMuted: boolean;
        isVideoMuted: boolean;
        sdpConstraints: {
            mandatory: {
                OfferToReceiveAudio: boolean;
                OfferToReceiveVideo: boolean;
            };
        };
        constructor(player_id: BGA.ID, room: BGA.RoomId, pcConfig: RTCConfiguration, pcConstraints: RTCOfferOptions, mediaConstraints: BGA.WebRTCMediaConstraints, _: any, ajaxCall: InstanceType<BGA.CorePage>["ajaxcall"], r: () => void, l: () => void, d: (player_id: BGA.ID, is_new: boolean) => void, c: (player_id: BGA.ID) => void);
        isInRoom(player_id: BGA.ID): boolean;
        addToRoom(player_id: BGA.ID): void;
        removeFromRoom(player_id: BGA.ID): boolean;
        setMediaConstraints(mediaConstraints: BGA.WebRTCMediaConstraints): void;
        setLocalFeed(localVideo: HTMLVideoElement): void;
        doGetUserMedia(): void;
        onUserMediaSuccess(stream: MediaStream & {
            stop: Function;
        }): void;
        onUserMediaError(error: Error): void;
        maybeConnect(player_id: BGA.ID, is_new: boolean): void;
        hangup(): void;
        handleRemoteHangup(player_id: BGA.ID): void;
        toggleVideoMute(player_id: BGA.ID): boolean;
        toggleAudioMute(player_id?: BGA.ID): boolean;
        sendPlayerMessage(player_id: number, message: any): void;
        sendRoomMessage(message: any): void;
        onMessageReceived(message: {
            from: BGA.ID;
            to: BGA.ID;
            message: any;
        }): void;
    }
    let WebRTC: DojoJS.DojoClass<WebRTC_Template, [player_id: BGA.ID, room: BGA.RoomId, pcConfig: RTCConfiguration, pcConstraints: RTCOfferOptions, mediaConstraints: BGA.WebRTCMediaConstraints, _: any, ajaxCall: <Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "iframe" | "get" | "post" | undefined) => void, r: () => void, l: () => void, d: (player_id: BGA.ID, is_new: boolean) => void, c: (player_id: BGA.ID) => void]>;
    export = WebRTC;
    global {
        namespace BGA {
            type WebRTC = typeof WebRTC;
            interface EBG {
                webrtc: WebRTC;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/webpush" {
    type ExtendedPushSubscription = PushSubscription & {
        keys: {
            auth: string;
            p256dh: string;
        };
    };
    global {
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
    class WebPush_Template {
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
    let WebPush: DojoJS.DojoClass<WebPush_Template, [callback: <Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "iframe" | "get" | "post" | undefined) => void]>;
    export = WebPush;
    global {
        namespace BGA {
            type WebPush = typeof WebPush;
            interface EBG {
                webpush: WebPush;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/resizable" {
    type Core = InstanceType<typeof import("ebg/core/core")>;
    class Resizable_Template {
        page: Core | null;
        item_id: string | null;
        item_div: HTMLElement | null;
        mouse_x_origin: number | null;
        mouse_y_origin: number | null;
        element_x_origin: number | null;
        element_y_origin: number | null;
        is_dragging: boolean;
        is_disabled: boolean;
        element_w_origin: number | null;
        element_h_origin: number | null;
        dragging_handler: any;
        width_resize: boolean;
        height_resize: boolean;
        resize_parent: boolean;
        automatic_z_index: boolean;
        onStartDragging: (e: string, t: number, i: number) => any;
        onEndDragging: (e: string, t: number, i: number) => any;
        onDragging: (e: string, t: number, i: number) => any;
        create(page: Core, item_id: string, interact_element?: HTMLElement | string | null, width_resize?: boolean, height_resize?: boolean, resize_parent?: boolean): void;
        onMouseDown(t: MouseEvent): void;
        onMouseUp(t: MouseEvent): void;
        onMouseMove(t: MouseEvent): void;
        disable(t: string): void;
        enable(): void;
    }
    let Resizable: DojoJS.DojoClass<Resizable_Template, []>;
    export = Resizable;
    global {
        namespace BGA {
            type Resizable = typeof Resizable;
            interface EBG {
                resizable: Resizable;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/popindialog" {
    type Core = InstanceType<typeof import("ebg/core/core")>;
    /**
     * A helper class for creating and managing pop-in dialogs. See {@link https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js#Generic_Dialogs | yourgamename.js: Generic Dialogs} for more information.
     */
    class PopinDialog_Template {
        id: string | null;
        target_id: string | null;
        container_id: string;
        resizeHandle: DojoJS.Handle | null;
        closeHandle: DojoJS.Handle | null;
        bCloseIsHiding: boolean;
        onShow: (() => any) | null;
        onHide: (() => any) | null;
        jstpl_standard_popin: string;
        tableModule?: Core;
        /**
         * Creates the dialog div in a hidden state. This should only be called once and used as an initializer for the dialog.
         * @param id The unique id of the dialog.
         * @param container_div where this dialog should be created. This will block all input and add a lighten the entire container. If this value is not set, the dialog will be created on the 'main-content' if it exists, or the 'left-side' otherwise.
         */
        create(id: string, container_div?: string | HTMLElement): void;
        /**
         * Destroys all components created for the dialog and removes the dialog from the DOM.
         * @param animate If true, the dialog will fade out before being removed.
         */
        destroy(animate?: boolean): void;
        /**
         * Replaces the 'onclick' event for the dialog's close button with the provided function. This will not have any impact if the close button was hidden using {@link hideCloseIcon}.
         * @param callback The function to call when the close button is clicked.
         */
        setCloseCallback(callback: (event: MouseEvent) => any): void;
        /**
         * Hides the close icon. This dialog will not be closable except through game specific code. It is always recommended to provide buttons or other methods to close the dialog so the user isn't completely stuck in a dialog.
         */
        hideCloseIcon(): void;
        /**
         * Sets the inner html of the title on the dialog.
         * @param title The html to set the title to.
         */
        setTitle(title?: string): void;
        /**
         * Sets the maximum width of the dialog by setting the 'maxWidth' css property.
         * @param maxWidth The maximum width of the dialog in pixels.
         */
        setMaxWidth(maxWidth: number): void;
        /**
         * Sets the help link for this dialog. This will also show the help icon if it was previously not set. This will set the 'href' attribute of the help icon to the provided link.
         * @param link The link to the help page for this dialog.
         */
        setHelpLink(link: string): void;
        /**
         * Sets the inner html of the dialog.
         * @param content The html to set the dialog to.
         */
        setContent(content: string | Node): void;
        /**
         * Shows the dialog. If the dialog was not created, this will create the dialog and show it.
         * @param animate If true, the dialog will fade in when shown.
         */
        show(animate?: boolean): void;
        /**
         * Hides the dialog. If the dialog was not created, this will do nothing.
         * @param animate If true, the dialog will fade out when hidden.
         */
        hide(animate?: boolean): void;
    }
    let PopinDialog: DojoJS.DojoClass<PopinDialog_Template, []>;
    export = PopinDialog;
    global {
        namespace BGA {
            type PopinDialog = typeof PopinDialog;
            interface EBG {
                popindialog: PopinDialog;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/core/core" {
    import dojo = require("dojo");
    import "ebg/core/common";
    import "dojo/string";
    import "dojo/fx";
    import "dojo/fx/easing";
    import "dojo/parser";
    import "dojo/io/iframe";
    import "dijit/Tooltip";
    import "dojox/uuid/generateRandomUuid";
    import "dijit/Dialog";
    import "ebg/core/i18n";
    import "ebg/webrtc";
    import "ebg/webpush";
    import "ebg/draggable";
    import "ebg/resizable";
    import "ebg/popindialog";
    global {
        namespace DijitJS {
            interface Dialog {
                thisDlg?: InstanceType<BGA.PopinDialog>;
            }
        }
    }
    global {
        namespace BGA {
            /**
             * Specifies game specific literal to help reduce spelling or expected values errors. Supported properties:
             * - CounterNames: The keys for {@link Gamedatas.counters}, used with for several of the {@link BGA.CorePage} helper methods.
             */
            interface GameSpecificIdentifiers {
            }
            type CounterNames = "CounterNames" extends infer K extends keyof GameSpecificIdentifiers ? GameSpecificIdentifiers[K] extends string ? GameSpecificIdentifiers[K] : string : string;
            /**
             * An JSON like type that is a represents all possible game states. This is the exact type of the {@link Gamedatas#gamestates} and used to infer the exact information about a gamestate using typescript intellisense. For example, using an if statement when checking for a specific state name, all information inside the if statement will pertain to that exact state.
             *
             * All entries should follow the format as {@link BGA.ID} => {@link IDefinedGameState}. The see the {@link IDefinedGameState} interface for the specific fields, but this matches the exact information that is defined within the state machine (states.inc.php).
             *
             * All invalid key/value pairs will be ignored. The {@link ValidateGameStates} type can wrap the type to ensure that all keys/values are typed correctly.
             *
             * @example
             * // Default (without specific state information)
             * interface DefinedGameStates extends ValidateGameStates<{
             * 	[id: BGA.ID]: IDefinedGameState;
             * 	"1": {
             * 		"name": "gameSetup",
             * 		"description": "",
             * 		"type": "manager",
             * 		"action": "stGameSetup",
             * 		"transitions": { "": BGA.ID }
             * 	};
             * 	"99": {
             * 		"name": "gameEnd",
             * 		"description": "End of game",
             * 		"type": "manager",
             * 		"action": "stGameEnd",
             * 		"args": "argGameEnd"
             * 	};
             * }> {}
             * @example
             * // Example from Reversi Tutorial
             * interface GameState {
             * 	10: { name: 'playerTurn', args: {
             * 		possibleMoves: {
             * 			[x: number]: {
             * 				[y: number]: boolean;
             * 			};
             * 		}
             * 	} };
             * 	11: 'nextPlayer';
             * }
             */
            interface DefinedGameStates {
            }
            /**
             * A record for looking up the state specific argument types passed by the server. Each property name represents the server side 'args' function name and the property value is the typescript type returned by that function. When using the {@link BGA.Gamegui#onEnteringState} and {@link BGA.Gamegui#onUpdateActionButtons} methods, the args can be inferred to the respective state's argument type through the state's name.
             * @example
             * interface GameStateArgs {
             * 	[funcName: string]: any;
             * 	"argGameEnd": {
             * 		result: Record<BGA.ID, {
             * 			rank: BGA.ID;
             * 			name: string;
             * 			score: BGA.ID;
             * 			score_aux: BGA.ID;
             * 			color: HexString;
             * 			color_back: HexString;
             * 			player: BGA.ID;
             * 		}>;
             * 	};
             * }
             */
            interface GameStateArgs {
                "argGameEnd": {
                    result: Record<BGA.ID, {
                        rank: BGA.ID;
                        name: string;
                        score: BGA.ID;
                        score_aux: BGA.ID;
                        color: HexString;
                        color_back: HexString;
                        player: BGA.ID;
                    }>;
                };
            }
            /**
             * An interface type that represents all possible player actions. This is only used as a type for internal validation, ensuring the all player action string literal names and arguments are typed correctly.
             *
             * All entries should follow the format as follows: `[action: string]: object;`. This format is omitted so coding intellisense can restrict parameters/types. At runtime, this may not accurately represent the possible actions for a player depending on if this matches the state machine (states.inc.php).
             *
             * Any player actions can be added by expanding (not extending) this interface.
             * @example
             * // Example from the Hearts Tutorial.
             * interface GameStateArgs {
             * 	'giveCards': { cards: number[] };
             * 	'playCard': { id: number };
             * }
             */
            interface GameStatePossibleActions {
            }
            /**
             * The actual interface for a defined game state. This differs from {@link DefinedGameState} because all properties are generalized type rather than being a union of all of the defined types. For example, {@link IDefinedGameState.name} is any string but {@link DefinedGameState.name} must be one of the defined game state names (like 'gameSetup' | 'gameEnd' | ...).
             */
            interface IDefinedGameState {
                /** The name of this game state. */
                name: string;
                /** The type of game state. See {@link GameStateType} for more information on game state types. */
                type: "activeplayer" | "multipleactiveplayer" | "private" | "game" | "manager";
                /** The description that is automatically set on the title banner at the top of the board game area. This message is displayed for all used except active players when `descriptionmytrun` is defined. */
                description?: string;
                /** The description that is automatically set on the title banner at the top of the board game area when this client is an active player. */
                descriptionmyturn?: string;
                /** The server side function that should be run when entering this state. If the state `type` is game, this is the only function called before waiting for the next state to be started. */
                action?: string;
                /** The transitions that can be made from the current state. The action key in this dictionary is purely server side and is used of clarity. The name signifies the type of action/transition that should be made which pairs with the less readable ID of the target game state. */
                transitions?: {
                    [action: string]: Default<keyof DefinedGameStates, BGA.ID>;
                };
                /** The list of possible actions that the active player clients can call using the ajax method. See {@link Gamegui.ajaxcall} and {@link Gamegui.checkAction}. */
                possibleactions?: Default<keyof GameStatePossibleActions, string>[];
                /** The server side function used to generate the arguments for this state. If undefined, this state will always pass 'null' for the arguments, unless it is a client state. */
                args?: keyof GameStateArgs;
                /** If defined and true, this state will call the server side `getGameProgression` progression and update the `CurrentStateArgs` with this value. */
                updateGameProgression?: boolean;
                initialprivate?: Default<keyof DefinedGameStates, string>;
            }
            /** The function {@link BGA.Gamegui#updatePageTitle}.updatePageTitle reuses the {@link IActiveGameState.args} to populate additional properties for formatting the title. This interface represents these additional properties that can be added/used when calling that function. */
            interface AdditionalGameStateArgs extends Type<{
                [titlearg: `titlearg${number}`]: string;
            }> {
                /** An HTML span representing the first active player in the list of active players. Updated when a new state is entered or when {@link Gamegui}.updatePageTitle is called. */
                actplayer?: "" | `<span style="font-weight:bold;color:#'${string}';${string}">${string}</span>`;
                /** An HTML span representing the client player when the client is active and there is no descriptionmyturn defined. Updated when a new state is entered or when {@link BGA.Gamegui}.updatePageTitle is called. */
                you?: `<span style="font-weight:bold;color:#'${string}';${string}">${string}</span>`;
                /** An HTML span representing the 'otherplayer'. Updated when a new state is entered or when {@link BGA.Gamegui}.updatePageTitle is called. */
                otherplayer?: `<span style="font-weight:bold;color:#'${string}';${string}">${string}</span>`;
                /** The id of the 'otherplayer' used to populate the {@link otherplayer} HTML span field. */
                otherplayer_id?: BGA.ID;
                titlearg?: string;
                _private?: IActiveGameState['args'];
            }
            interface IActiveGameState extends Omit<IDefinedGameState, 'args' | 'updateGameProgression'> {
                /** Id of the current state. The type of args will always match the type of `GameStateArgs<id>` */
                id: ValidDefinedGameStateKeys;
                args: null | (AdditionalGameStateArgs & GameStateArgs[keyof GameStateArgs]);
                updateGameProgression?: BGA.ID;
                /** The id of the single active player for an activeplayer state. If this `type` is not activeplayer, this value will be 0 */
                active_player: BGA.ID | 0;
                /** When the state is a multipleactiveplayer state, this will be an array of player ids that are active. */
                multiactive?: BGA.ID[];
                /** The timers foreach player in the game. This include the `initial` time in ms, the `initial_ts` timestamp in UNIX format, and the `total` time in ms. */
                reflexion: {
                    initial: {
                        [playerId: BGA.ID]: number;
                    };
                    initial_ts: {
                        [playerId: BGA.ID]: number;
                    };
                    total: {
                        [playerId: BGA.ID]: number;
                    };
                };
            }
            /**
             * A helper type used to make sure that the {@link DefinedGameStates} type is set up correctly.
             * @example
             * interface DefinedGameStates extends ValidateGameStates<{
             * 	[id: BGA.ID]: GameState_Interface;
             * 	"1": {
             * 		"name": "gameSetup",
             * 		"description": "",
             * 		"type": "manager",
             * 		"action": "stGameSetup",
             * 		"transitions": { "": 2 }
             * 	};
             * 	"99": {
             * 		"name": "gameEnd",
             * 		"description": "End of game",
             * 		"type": "manager",
             * 		"action": "stGameEnd",
             * 		"args": "argGameEnd"
             * 	};
             * }> {};
             */
            type ValidateGameStates<T extends {
                [P in keyof DefinedGameStates]: P extends BGA.ID ? IDefinedGameState : never;
            }> = T;
            /** Used in place of 'keyof DefinedGameState' to ensure that all keys point to values extending {@link IDefinedGameState}. */
            type ValidDefinedGameStateKeys = {
                [P in keyof DefinedGameStates]: P extends BGA.ID ? DefinedGameStates[P] extends IDefinedGameState ? P : never : never;
            }[keyof DefinedGameStates];
            type ActiveGameStates = number extends Default<ValidDefinedGameStateKeys, number> ? {
                [K in BGA.ID]: IActiveGameState;
            } : `${number}` extends ValidDefinedGameStateKeys ? {
                [K in BGA.ID]: IActiveGameState;
            } : {
                [K in ValidDefinedGameStateKeys]: {
                    /** A {@link IActiveGameState.id} but typed for a specific game state. */
                    id: K;
                    /** A {@link IActiveGameState.name} but typed for a specific game state. */
                    name: DefinedGameStates[K]['name'];
                    /** A {@link IActiveGameState.type} but typed for a specific game state. */
                    type: DefinedGameStates[K]['type'];
                    /** A {@link IActiveGameState.args} but typed for a specific game state. */
                    args: ('args' extends keyof DefinedGameStates[K] ? (DefinedGameStates[K]['args'] extends keyof GameStateArgs ? (GameStateArgs[DefinedGameStates[K]['args']] & AdditionalGameStateArgs) : null) : null);
                    active_player: DefinedGameStates[K]['type'] extends "activeplayer" ? BGA.ID : 0;
                    /** The timers foreach player in the game. This include the `initial` time in ms, the `initial_ts` timestamp in UNIX format, and the `total` time in ms. */
                    reflexion: {
                        initial: {
                            [playerId: BGA.ID]: number;
                        };
                        initial_ts: {
                            [playerId: BGA.ID]: number;
                        };
                        total: {
                            [playerId: BGA.ID]: number;
                        };
                    };
                } & ('description' extends keyof DefinedGameStates[K] ? {
                    description: DefinedGameStates[K]['description'] | string;
                } : {
                    description?: string;
                }) & ('descriptionmyturn' extends keyof DefinedGameStates[K] ? {
                    descriptionmyturn: DefinedGameStates[K]['descriptionmyturn'] | string;
                } : {
                    descriptionmyturn?: string;
                }) & ('action' extends keyof DefinedGameStates[K] ? {
                    action: DefinedGameStates[K]['action'];
                } : {
                    action?: never;
                }) & ('transitions' extends keyof DefinedGameStates[K] ? {
                    transitions: DefinedGameStates[K]['transitions'];
                } : {
                    transitions?: never;
                }) & ('possibleactions' extends keyof DefinedGameStates[K] ? {
                    possibleactions: DefinedGameStates[K]['possibleactions'];
                } : {
                    possibleactions?: never;
                }) & ('initialprivate' extends keyof DefinedGameStates[K] ? {
                    initialprivate: DefinedGameStates[K]['initialprivate'];
                } : {
                    initialprivate?: never;
                }) & ('updateGameProgression' extends keyof DefinedGameStates[K] ? {
                    updateGameProgression: number;
                } : {
                    updateGameProgression?: never;
                }) & (DefinedGameStates[K]['type'] extends "multipleactiveplayer" ? {
                    multiactive: BGA.ID[];
                } : {
                    multiactive?: never;
                });
            };
            /** A helper type to generating the tuple portion of the {@link GameStateTuple} */
            type _GameStateTupleReducer<K extends keyof ActiveGameStates, Ks> = Ks extends [infer F, ...infer R] ? [F extends keyof ActiveGameStates[K] ? ActiveGameStates[K][F] : ActiveGameStates[K], ..._GameStateTupleReducer<K, R>] : [];
            /** Used to create a tuple type where each index is the property of an ActiveGameState. This tuple is strongly coupled allowing types to be infer based on uses of other tuple elements, i.e, a switch statement on a state name will let cases to infer all of that specific state's types. */
            type GameStateTuple<Ks extends ((keyof ActiveGameStates[keyof ActiveGameStates]) | 'state')[]> = {
                [K in keyof ActiveGameStates]: _GameStateTupleReducer<K, Ks>;
            }[keyof ActiveGameStates];
            /**
             * The data structure for the current game state. This contains the base data from source {@link ValidateGameStates} and additional data that is passed to the client whenever the state changes.
             */
            type ActiveGameState = ActiveGameStates[keyof ActiveGameStates];
            /**
             * The game data structure that is passed to the client when the page is first loaded, and partially update when new game states are entered. All properties that are not game specific are originally populated by the framework. All other properties, are populated by the game specific code in the `.game.php` file, under the Table::getAllDatas method.
             *
             * All entries are in the form `[key: string | number]: object;` and custom properties can be added by expanding (not extending) this interface.
             * @example
             * // Example from the Reversi Tutorial
             * interface Gamedatas {
             * 	board: { x: number, y: number, player: number }[];
             * }
             */
            interface Gamedatas {
                /** A dictionary of all player information. See {@link Player} for more information. */
                players: {
                    [playerId: BGA.ID]: GamePlayer;
                };
                /** The current game state data. This is the same data that is passed to the `onEnteringState` method. */
                gamestate: ActiveGameState & {
                    private_state?: ActiveGameState;
                };
                /** Not documented. */
                tablespeed: BGA.ID;
                /** Not documented. Likely has something to do with players leaving the game, thus making the game results neutralized. The may be a boolean. */
                game_result_neutralized?: BGA.ID | '0';
                /** Not documented. Possibly something to do with players leaving the game. This looks to be a global php variable stored in the database. */
                neutralized_player_id: BGA.ID | '0';
                /** An ordered array of player ids which signify the current player order. */
                playerorder: BGA.ID[];
                /**
                 * A dictionary of all game states defined in the states.inc.php file. This should be the same as {@link DefinedGameStates} but possibly contain additional information based on what was included in the game specific interface.
                 */
                gamestates: [ValidDefinedGameStateKeys] extends [never] ? Record<BGA.ID, IDefinedGameState> : {
                    [K in ValidDefinedGameStateKeys]: DefinedGameStates[K];
                };
                /** The notification pointers used for evaluating notifications. */
                notifications: {
                    last_packet_id: BGA.ID;
                    move_nbr: BGA.ID;
                    table_next_notification_no?: BGA.ID;
                };
                /** Not documented. */
                decision?: NotifTypes['tableDecision'];
                /** The custom counters that are currently added to the game in the html by using the following format:
                 * ```html
                 * <div class="counter" id="bread"></div>
                 * <div class="counter" id="coin"></div>
                 * ```
                 * The keys of this record are the id of the element, and the value is the current state of the counter.
                 */
                counters?: {
                    [K in CounterNames]: {
                        counter_value: BGA.ID;
                        counter_name: K;
                    };
                };
            }
            interface GamePlayer {
                /** The unique identifier for the player. */
                id: BGA.ID;
                /** This players current score. This is the score updated by game specific code in the `.game.php` file */
                score: BGA.ID;
                /** The color of the player as defined in `gameinfos.inc.php` assigned by the `.game.php` file. This should always be a hex string in RGB format: `RRGGBB`. */
                color: HexString;
                /** Not documented. This should always be a hex string in RGB format: `RRGGBB`. */
                color_back: HexString | null;
                /** The username of the player. */
                name: string;
                /** Not documented. */
                avatar: string | '000000';
                /** Not documented. Presumably represents if the player has disconnected and has begun taking 'zombie' actions. This is likely a boolean. */
                zombie: '0' | '1' | 0 | 1;
                /** Not documented. */
                eliminated: '0' | '1' | 0 | 1;
                /** Not documented. Presumably represents if the player is a bot. This is likely a boolean. */
                is_ai: '0' | '1' | 0 | 1;
                /** Not documented. This could represent a beginner to BGA or the game, and unsure how this is calculated. */
                beginner: boolean;
                /** Not documented. */
                ack?: string | 'ack';
                /** Not documented. */
                no?: string;
            }
            interface AjaxActions extends Type<{
                [K in keyof GameStatePossibleActions as `/${string}/${string}/${K}.html`]: GameStatePossibleActions[K];
            }> {
            }
            interface AjaxActions {
                "/videochat/videochat/getRTCConfig.html": {
                    _successargs: [
                        {
                            static_turn?: {
                                urls?: string | "";
                            };
                            dynamic_iceservers?: string;
                        }
                    ];
                };
                "/videochat/videochat/joinRoom.html": {
                    _successargs: [
                        {
                            videochat_terms_accepted: 0 | 1;
                            already_in: boolean;
                            joined: boolean;
                            in_room: BGA.ID[];
                        }
                    ];
                    room: BGA.RoomId | null;
                    audio: boolean;
                    video: boolean;
                    accept?: boolean;
                };
                "/table/table/startStopVideo.html": {
                    _successargs: [
                        {
                            room_id: BGA.RoomId;
                        }
                    ];
                    target_table: BGA.ID | null | undefined;
                    target_player: BGA.ID | null | undefined;
                };
                "/table/table/startStopAudio.html": {
                    _successargs: [
                        {
                            room_id: BGA.RoomId;
                        }
                    ];
                    target_table: BGA.ID | null | undefined;
                    target_player: BGA.ID | null | undefined;
                };
                "/videochat/videochat/leaveRoom.html": {
                    room: BGA.RoomId | null;
                };
            }
            type AjaxCallbackArgsMap = {
                [K in keyof AjaxActions]: '_successargs' extends keyof AjaxActions[K] ? (AjaxActions[K]['_successargs'] extends any[] ? AjaxActions[K]['_successargs'] : unknown[]) : unknown[];
            };
            interface AjaxAdditionalArgs {
                lock?: boolean | "table" | "player" | number;
                action?: undefined;
                module?: undefined;
                class?: undefined;
                noerrortracking?: boolean;
                form_id?: string;
                table?: BGA.ID | null;
            }
            type AjaxParams<Action extends keyof AjaxActions, Scope> = [
                url: Action,
                args: NoInfer<Omit<AjaxActions[Action], '_successargs'> & AjaxAdditionalArgs>,
                scope: Scope,
                onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, AjaxCallbackArgsMap[Action]>>,
                callback?: NoInfer<DojoJS.HitchMethod<Scope, [
                    error: boolean,
                    errorMessage?: string,
                    errorCode?: number
                ]>>,
                ajax_method?: "post" | "get" | "iframe"
            ];
        }
    }
    interface CorePage_Template extends DojoJS.DojoClassObject {
    }
    /**
     * The core for all bga web pages. This is interchangeable with {@link SiteCore} as this uses many functions/properties from {@link SiteCore}, and {@link SiteCore} is a direct extension of this class.
     *
     * All {@link Gamegui} objects are extensions of this.
     */
    class CorePage_Template {
        /**
         * The data from the server that is used to initialize the game client. This is the same as `gamedatas` in the `setup` method and is untouched after the `setup` method is called.
         *
         * This is defined in CorePage because the property is used when available, but is only set when this is also a {@link BGA.Gamegui} object.
         * @example
         * for (var player_id in this.gamedatas.players) {
         * 	var playerInfo = this.gamedatas.players [player_id];
         * 	var c = playerInfo.color;
         * 	var name = playerInfo.name;
         * 	// do something
         * }
         */
        gamedatas?: BGA.Gamedatas | null;
        /** The list of subscriptions managed by {@link register_subs} and {@link unsubscribe_all}. */
        subscriptions: DojoJS.Handle[];
        /** Record of the tooltips added by using functions of same flavor of {@link addTooltip} and {@link removeTooltip}. The key is the element id for the tooltip. */
        tooltips: Record<string, DijitJS.Tooltip>;
        /** If true, all tooltips (existing and future) stored in {@link tooltips} will be closed as soon as it tries to open. See {@link switchDiplaytooltips} for modifying this value. */
        bHideTooltips: boolean;
        /** The minimum width of the game as defined by game_infos>game_interface_width */
        screenMinWidth: number;
        /** Percentage to zoom to make all game components fit within the min {@link screenMinWidth}. */
        currentZoom: number;
        /** All dojo handles that are managed by {@link connect} and {@link disconnect} and their other flavors. */
        connections: {
            element: any;
            event: string;
            handle: DojoJS.Handle;
        }[];
        /** True during replay/archive mode if animations should be skipped. Only needed if you are doing custom animations. (The BGA-provided animation functions like this.slideToObject() automatically handle instantaneous mode.) */
        instantaneousMode: boolean | 0 | 1;
        /** The real-time communications object for the game room. See {@link BGA.WebRTC} for more information. */
        webrtc: InstanceType<BGA.WebRTC> | null;
        /** Handle for the rtc notification. Used if/when the rtc is disconnected. */
        webrtcmsg_ntf_handle: DojoJS.Handle | null;
        /** An enumeration representing the real-time communications type: 0 = disabled, 1 = voice only?, 2 = video? */
        rtc_mode: 0 | 1 | 2;
        /** An object stating which media devices can be accessed. */
        mediaConstraints: BGA.WebRTCMediaConstraints;
        /** The list of player that have marked themselves as this gender. */
        gameMasculinePlayers: string[];
        /** The list of player that have marked themselves as this gender. */
        gameFemininePlayers: string[];
        /** The list of player that have marked themselves as this gender (or have it default). */
        gameNeutralPlayers: string[];
        /** The of emoticons usable with BGA chat windows. This is fully defined for convenience, but this may not match actual source if it changes. */
        emoticons: {
            readonly ":)": "smile";
            readonly ":-)": "smile";
            readonly ":D": "bigsmile";
            readonly ":-D": "bigsmile";
            readonly ":(": "unsmile";
            readonly ":-(": "unsmile";
            readonly ";)": "blink";
            readonly ";-)": "blink";
            readonly ":/": "bad";
            readonly ":-/": "bad";
            readonly ":s": "bad";
            readonly ":-s": "bad";
            readonly ":P": "mischievous";
            readonly ":-P": "mischievous";
            readonly ":p": "mischievous";
            readonly ":-p": "mischievous";
            readonly ":$": "blushing";
            readonly ":-$": "blushing";
            readonly ":o": "surprised";
            readonly ":-o": "surprised";
            readonly ":O": "shocked";
            readonly ":-O": "shocked";
            readonly o_o: "shocked";
            readonly O_O: "shocked";
            readonly "8)": "sunglass";
            readonly "8-)": "sunglass";
        };
        /** The default order to try to position tooltips. */
        defaultTooltipPosition: DijitJS.PlacePositions[];
        /** The url for BGA, used to create urls for players, upgrading to premium, creating a new account, and more.  */
        metasiteurl?: string;
        /**
         * Sends a client side notification to the server in the form of a player action. This should be used only in reaction to a user action in the interface to prevent race conditions or breaking replay game and tutorial features.
         * @param url The relative URL of the action to perform. Usually, it must be: "/<mygame>/<mygame>/myAction.html"
         * @param args An array of parameter to send to the game server. Note that `lock` must always be specified when calling player actions. Though not a required parameter, `lock` has been added here to prevent errors: Player actions must always be accompanied by a uuid lock parameter else the server will respond with a lock error. NOTE: If you are seeing an error here, it is likely that you are using a reserved args property (e.g. action/module/class). Make sure no player action arguments have these properties.
         * @param scope (non-optional) The object that triggered the action. This is usually `this`.
         * @param onSuccess (non-optional but rarely used) A function to trigger when the server returns result and everything went fine (not used, as all data handling is done via notifications).
         * @param callback (optional) A function to trigger when the server returns ok OR error. If no error this function is called with parameter value false. If an error occurred, the first parameter will be set to true, the second will contain the error message sent by the PHP back-end, and the third will contain an error code.
         * @param ajax_method (optional and rarely used) If you need to send large amounts of data (over 2048 bytes), you can set this parameter to 'post' (all lower-case) to send a POST request as opposed to the default GET. This works, but was not officially documented, so only use if you really need to.
         * @example
         * this.ajaxcall( '/mygame/mygame/myaction.html', { lock: true,
         * 	arg1: myarg1,
         * 	arg2: myarg2
         * }, this, (result) => {} );
         */
        ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(...[url, args, scope, onSuccess, callback, ajax_method]: BGA.AjaxParams<Action, Scope>): void;
        /**
         * Formats the global string variable named `var_template` with the values from `args` using ${key} syntax. This is a simple templating system that is generally used to format HTML blocks. The `var_template` is a string that contains ${key} placeholders, and `args` is an object that contains the values to replace the placeholders with. The method returns the formatted string. Note: result is trimmed.
         * This should be used when templates are defined in the .tpl file, i.e. they are hydrated by the server in some way.
         * @param template The template string to format.
         * @param args The values to replace the placeholders with.
         * @returns The formatted string.
         * @example
         * var player = gamedatas.players[this.player_id];
         * var div = this.format_block('jstpl_player_board', player ); // var jstpl_player_board = ... is defined in .tpl file
         */
        format_block(template: string, args: Record<string, any>): string;
        /**
         * Formats the string with the values from `args` using ${key} syntax. This is a simple templating system that is generally used to format HTML blocks. The `format` is a string that contains ${key} placeholders, and `args` is an object that contains the values to replace the placeholders with. The method returns the formatted string. Note: result is trimmed.
         * This should be used when templates are defined in the .tpl file, i.e. they are hydrated by the server in some way.
         * @param template The template string to format.
         * @param args The values to replace the placeholders with.
         * @returns The formatted string.
         * @example var div = this.format_string('<div color="${player_color}"></div>', {player_color: '#ff0000'} );
         */
        format_string(template: string, args: Record<string, any>): string;
        /**
         * Same as `format_string` but recursively formats until no more placeholders are found. This is useful for nested templates, like with server notifications.
         * @param template The template string to format.
         * @param args The values to replace the placeholders with.
         * @returns The formatted string.
         */
        format_string_recursive(template: string, args: Record<string, any> & {
            /** Works just like args entries, but translates the strings before inserting strings. */
            i18n?: Record<string, any>;
            type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
            message?: string;
            text?: string;
        }): string;
        /**
         * Translates a string. This is a simple function that tries to use the current page translations, {@link _}, and if that fails, it uses the global translations, {@link __}.
         * @param text The text to translate.
         * @returns The translated text.
         * @example
         * let text = 'Hello world';
         * // The following two lines have equivalent results.
         * this.clienttranslate(text)
         * text == _(text) ? __('lang_mainsite', text) : _(text);
         */
        clienttranslate_string(text: string): string;
        /**
         * Translates ALL elements with the 'clienttranslatetarget' class.
         * @param args The translation keys to translate. The key is the element id, and the value is the translation key.
         * @param translationFrom The translation source to use. This will use the game translations if not specified.
         */
        translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
        /** Registers a dojo.Handle to this object, under the {@link subscriptions} array. This will unsubscribe this listener when using the {@link unsubscribe_all} function. */
        register_subs(...handles: DojoJS.Handle[]): void;
        /** Unsubscribes all listeners registered with {@link register_subs}. */
        unsubscribe_all(): void;
        /** Registers a cometd subscription to the given comet id. This will unsubscribe this listener when using the {@link unsubscribe_all} function. */
        register_cometd_subs(...comet_ids: string[]): string | string[];
        /** Although this function is defined on core, it is a wrapper for the {@link SiteCore.showMessage} function and always overridden. */
        showMessage(message: string, type: "info" | "error" | "only_to_log" | string): void;
        /**
         * Moves an element such that the visual position of the `target` element is located at the top-left of the `location` element. This is not really an animation, but placeOnObject is frequently used to set up the initial position of an element before an animation is performed.
         * @param target The element to move.
         * @param location The element to move the target to.
         * @example this.placeOnObject('my_element', 'my_location');
         */
        placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
        /**
         * Moves an element such that the visual position of the `target` element is located at the top-left of the `location` element, with an offset. This is not really an animation, but placeOnObject is frequently used to set up the initial position of an element before an animation is performed.
         * @param target The element to move.
         * @param location The element to move the target to.
         * @param relativeX The x offset from the top-left of the location element.
         * @param relativeY The y offset from the top-left of the location element.
         * @example this.placeOnObjectPos('my_element', 'my_location', 10, 10);
         * @throws TypeError if target or location is null.
         */
        placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
        /** If 3D is enabled (that is, the 'ebd-body' element has the 'mode_3d' class), disable the 3d and return the previous transform value. This is useful for translating DOM elements in 2d space, then re-enabling using {@link enable3dIfNeeded}. */
        disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
        /** Adds the  'mode_3d' class to the 'ebd-body' element if needed, and sets the transform style. If the transform is undefined/null, then this will have no effect. */
        enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
        /** Gets the Z position of an element by using window.getComputedStyle() and pulling it from the view matrix. */
        getComputedTranslateZ(element: Element): number;
        /**
         * Slides an element to a target element on the z axis.
         */
        transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, // TODO: see getComputedTranslateZ
        duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation>;
        /**
         * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
         * @param target The element to move. This object must be "relative" or "absolute" positioned.
         * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
         * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
         * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
         * @returns The animation object that can be played.
         * @throws TypeError if target/destination is not a valid element.
         * @example this.slideToObject( "some_token", "some_place_on_board" ).play();
         */
        slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        /**
         * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
         * @param target The element to move. This object must be "relative" or "absolute" positioned.
         * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
         * @param x Defines the x offset in pixels to apply to the target position.
         * @param y Defines the y offset in pixels to apply to the target position.
         * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
         * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
         * @returns The animation object that can be played.
         * @throws TypeError if target/destination is not a valid element, x/y is not a number, or the 'left'/'top' style properties are not numbers.
         * @example this.slideToObjectPos( "some_token", "some_place_on_board", x, y ).play();
         */
        slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        /**
         * Slides an element to a target position. Sliding element on the game area is the recommended and the most used way to animate your game interface. Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
         * @param target The element to move. This object must be "relative" or "absolute" positioned.
         * @param destination The element to move the target to. This object must be "relative" or "absolute" positioned. Note that it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
         * @param xpercent Defines the x offset in percent to apply to the target position.
         * @param ypercent Defines the y offset in percent to apply to the target position.
         * @param duration (optional) defines the duration in millisecond of the slide. The default is 500 milliseconds.
         * @param delay (optional). If you defines a delay, the slide will start only after this delay. This is particularly useful when you want to slide several object from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
         * @returns The animation object that can be played.
         * @throws TypeError if target/destination is not a valid element or the 'left'/'top' style properties are not numbers.
         * @example this.slideToObjectPos( "some_token", "some_place_on_board", 50, 50 ).play();
         */
        slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        /** Converts the given angle in degrees to radians. Same as `angle * Math.PI / 180`. */
        toRadians(angle: number): number;
        /** Rotates the vector by the given angle in degrees. */
        vector_rotate(vector: {
            x: number;
            y: number;
        }, angle: number): {
            x: number;
            y: number;
        };
        /**
         * This destroys the `target` element and all its connectors (onClick, etc), then places a clone positioned at the original location but attached to the `newParent` element. This is useful for moving elements between different containers. See {@link GameguiCookbook.attachToNewParentNoDestroy} for a version that does not destroy the target element.
         * Changing the HTML parent of an element can be useful for the following reasons:
         * - When the HTML parent moves, all its child are moving with them. If some game elements is no more linked with a parent HTML object, you may want to attach it to another place.
         * - The z_order (vertical order of display) depends on the position in the DOM, so you may need to change the parent of some game elements when they are moving in your game area.
         * @param target The element to move.
         * @param newParent The new parent element to attach the target to. Note that the position of the target will remain visually the same.
         * @param position The child index which this should be inserted at. If a string, it will be inserted matching the type, otherwise it will be inserted at the given index.
         * @returns The new element that was created.
         * @throws TypeError if target or newParent is not a valid element id.
         */
        attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        /**
         * This destroys the `target` element and all its connectors (onClick, etc), then places a clone positioned and attached to the `newParent` element.
         * Changing the HTML parent of an element can be useful for the following reasons:
         * - When the HTML parent moves, all its child are moving with them. If some game elements is no more linked with a parent HTML object, you may want to attach it to another place.
         * - The z_order (vertical order of display) depends on the position in the DOM, so you may need to change the parent of some game elements when they are moving in your game area.
         * @param target The element to move.
         * @param newParent The new parent element to attach the target to. Note that the position of the target will remain visually the same.
         * @param position The child index which this should be inserted at. If a string, it will be inserted matching the type, otherwise it will be inserted at the given index.
         * @returns The new element that was created.
         * @throws TypeError if target or newParent is not a valid element id.
         */
        attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        /**
         * Slides a new element from a source location to a destination location. The temporary object created from an html string. This is useful when you want to slide a temporary HTML object from one place to another. As this object does not exists before the animation and won't remain after, it could be complex to create this object (with dojo.place), to place it at its origin (with placeOnObject) to slide it (with slideToObject) and to make it disappear at the end.
         * @param temporaryHTML HTML string or a node that represents the object to slide. This will be destroyed after the animation ends.
         * @param parent The ID of an HTML element of your interface that will be the parent of this temporary HTML object.
         * @param from The element representing the origin of the slide.
         * @param to The element representing the target of the slide.
         * @param duration (optional) The duration in milliseconds of the slide. The default is 500 milliseconds.
         * @param delay (optional) If you define a delay, the slide will start only after this delay. This is particularly useful when you want to slide several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
         * @returns The animation object that can be played.
         * @example this.slideTemporaryObject('<div class="token_icon"></div>', 'tokens', 'my_origin_div', 'my_target_div').play();
         */
        slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
        /**
         * Slides an existing html element to some destination and destroys it upon arrival. This is a handy shortcut to slide an existing HTML object to some place then destroy it upon arrival. It can be used for example to move a victory token or a card from the board to the player panel to show that the player earns it, then destroy it when we don't need to keep it visible on the player panel.
         * This works the same as `slideToObject` and takes the same arguments, however, it plays the animation immediately and destroys the object upon arrival.
         * CAREFUL: Make sure nothing is creating the same object at the same time the animation is running, because this will cause some random disappearing effects.
         * @param target The element to move.
         * @param destination The element to move the target to.
         * @param duration (optional) The duration in milliseconds of the slide. The default is 500 milliseconds.
         * @param delay (optional) If you define a delay, the slide will start only after this delay. This is particularly useful when you want to slide several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the slide.
         * @example this.slideToObjectAndDestroy( "some_token", "some_place_on_board", 1000, 0 );
         */
        slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
        /**
         * Fades out the target node, then destroys it. This call starts the animation.
         * CAREFUL: the HTML node still exists until during few milliseconds, until the fadeOut has been completed. Make sure nothing is creating same object at the same time as animation is running, because you will be some random disappearing effects.
         * @param target The element to fade out and destroy.
         * @param duration (optional) The duration in milliseconds of the fade out. The default is 500 milliseconds.
         * @param delay (optional) If you define a delay, the fade out will start only after this delay. This is particularly useful when you want to fade out several objects from the same position to the same position: you can give a 0ms delay to the first object, a 100ms delay to the second one, a 200ms delay to the third one, ... this way they won't be superposed during the fade out.
         * @example this.fadeOutAndDestroy( "a_card_that_must_disappear" );
         */
        fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
        /**
         * Rotates an element to a target degree without using an animation.
         * @param target The element to rotate.
         * @param degree The degree to rotate the element to.
         * @example this.rotateInstantTo( "a_card_that_must_rotate", 90 );
         */
        rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        /**
         * Rotates an element by a delta degree using an animation. It starts the animation, and stored the rotation degree in the class, so next time you rotate object - it is additive. There is no animation hooks in this one.
         * @param target The element to rotate.
         * @param delta The degree to rotate the element by.
         * @example this.rotateDelta( "a_card_that_must_rotate", 90 );
         */
        rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
        /**
         * Rotates an element to a target degree using an animation. It starts the animation, and stored the rotation degree in the class, so next time you rotate object - it is additive. There is no animation hooks in this one.
         * @param target The element to rotate.
         * @param degree The degree to rotate the element to.
         * @example this.rotateTo( "a_card_that_must_rotate", 90 );
         *
         * // Same as follows:
         * var animation = new dojo.Animation({
         * 	curve: [fromDegree, toDegree],
         * 	onAnimate: (v) => {
         * 		target.style.transform = 'rotate(' + v + 'deg)';
         * 	}
         * });
            
        * animation.play();
        */
        rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        /**
         * Returns the rotation angle of the given element as it is stored in the {@link rotateToPosition} record. If the object does not have a stored rotation it will default to 0. This recursively sum the rotation of all parent elements.
         * @param target The element to get the rotation of.
         * @returns The rotation angle of the element.
         */
        getAbsRotationAngle(target: string | Element | null): number;
        /**
         * Adds the given style to all elements with the given class. This uses the dojo.query and dojo.style functions to apply the style to all elements with the given class.
         * @param className The class name of the
         * @param property The style property to apply.
         * @param value The value to apply to the style property.
         * @example this.addClassToClass( 'my_class', 'color', 'red' );
         */
        addClassToClass<T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]): void;
        /**
         * A wrapper for dojo.connect which maintains a list of all connections for easier cleanup and disconnecting. This is the recommended way to connect events in BGA when connecting permanent objects - if you just want to connect the temp object you should probably not use this method but use dojo.connect which won't require any clean-up. If you plan to destroy the element you connected, you must call this.disconnect() to prevent memory leaks.
         *
         * Note: dynamic connect/disconnect is for advanced cases ONLY, you should always connect elements statically if possible, i.e. in setup() method.
         * @param target The element to connect the event to.
         * @param event The event to connect to.
         * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
         * @example this.connect( $('my_element'), 'onclick', 'onClickOnMyElement' );
         * @example this.connect( $('my_element'), 'onclick', (e) => { console.log('boo'); } );
         */
        connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof this): void;
        connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U, method: keyof this): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>>>(targetObject: T, event: U, method: M, dontFix?: boolean): void;
        /**
         * Disconnects any event handler previously registered with `connect` or `connectClass` that matches the element and event.
         * @param target The element to disconnect the event from.
         * @param event The event to disconnect.
         * @example this.disconnect( $('my_element'), 'onclick');
        */
        disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
        disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U): void;
        /**
         * Same as `connect` but for all the nodes set with the specified css className.
         * @param className The class name of the elements to connect the event to.
         * @param event The event to connect to.
         * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
         * @example this.connectClass('pet', 'onclick', 'onPet');
         */
        connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof this): void;
        connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(className: string, event: K | `on${K}`, method: M): void;
        /**
         * Connects an event to a query selector. This is a wrapper for dojo.connect that uses dojo.query to find the elements to connect the event to. This is useful for connecting events to elements that are created dynamically.
         * @param selector The query selector to find the elements to connect the event to.
         * @param event The event to connect to.
         * @param method The method to call when the event is triggered. If this is a string, it will call the method with the same name on this object.
         */
        connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof this): void;
        connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(selector: string, event: K | `on${K}`, method: M): void;
        /** Alias for {@link connectClass}. See {@link connectClass} for more information. */
        addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof this): void;
        addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<this, [DojoJS.AllEvents[K]]>>(className: string, event: K | `on${K}`, method: M): void;
        /**
         * Disconnects all previously registed event handlers (registered via `connect` or `connectClass`).
         * @example this.disconnectAll();
         */
        disconnectAll(): void;
        /**
         * Updates the global `this.gamedatas.counters` and sets the element `counter_name` to the new value.
         * @param counter_name The counter to update.
         * @param new_value The new value of the counter.
         * @throws TypeError if the counter does not exist in `this.gamedatas.counters` or if the `counter_name` does not refer to a valid element.
         */
        setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
        /**
         * Increments the global `this.gamedatas.counters` and the value of the element `counter_name` by `delta`.
         * @param counter_name The counter to increment.
         * @param delta The amount to increment the counter by.
         * @throws TypeError if the counter does not exist in `this.gamedatas.counters` or if the `counter_name` does not refer to a valid element.
         */
        incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        /**
         * Decrements the global `this.gamedatas.counters` and the value of the element `counter_name` by `delta`. Unlike {@link incCounter}, this will not allow the counter to go below 0.
         * @param counter_name The counter to decrement.
         * @param delta The amount to decrement the counter by.
         * @throws TypeError if the counter does not exist in `this.gamedatas.counters` or if the `counter_name` does not refer to a valid element.
         */
        decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        /**
         * Updates game counters in the player panel (such as resources). The `counters` argument is a map of counters (the key must match counter_name).
         * @param counters A map of counters to update.
         */
        updateCounters(counters?: Partial<BGA.Gamedatas["counters"]>): void;
        /**
         * Creates the HTML used for {@link addTooltip} from the given content.
         * @param helpStringTranslated The information about "what is this game element?".
         * @param actionStringTranslated The information about "what happens when I click on this element?".
         * @returns The HTML content of the tooltip.
         */
        getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
        /**
         * Adds a tooltip to the DOM element. This is a simple text tooltip to display some information about "what is this game element?" and "what happens when I click on this element?". You must specify both of the strings. You can only use one and specify an empty string for the other one. When you pass text directly function _() must be used for the text to be marked for translation! Except for empty string. Parameter "delay" is optional. It is primarily used to specify a zero delay for some game element when the tooltip gives really important information for the game - but remember: no essential information must be placed in tooltips as they won't be displayed in some browsers (see Guidelines).
         * @param target The id of the DOM element to add the tooltip to. This id is used for a dictionary lookup and using an id that already has a tooltip will overwrite the previous tooltip.
         * @param helpStringTranslated The information about "what is this game element?".
         * @param actionStringTranslated The information about "what happens when I click on this element?".
         * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
         * @example this.addTooltip( 'cardcount', _('Number of cards in hand'), '' );
         */
        addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        /**
         * Adds an HTML tooltip to the DOM element. This is for more elaborate content such as presenting a bigger version of a card.
         * @param target The id of the DOM element to add the tooltip to. This id is used for a dictionary lookup and using an id that already has a tooltip will overwrite the previous tooltip.
         * @param html The HTML content of the tooltip.
         * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
         * @example this.addTooltipHtml( 'cardcount', '<div>Number of cards in hand</div>' );
         */
        addTooltipHtml(target: string, html: string, delay?: number): void;
        /**
         * Adds a simple text tooltip to all the DOM elements set with the specified css class. This is for more elaborate content such as presenting a bigger version of a card.
         * @param className The class name of the elements to add the tooltip to.
         * @param helpStringTranslated The information about "what is this game element?".
         * @param actionStringTranslated The information about "what happens when I click on this element?".
         * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
         * @example this.addTooltipToClass( 'meeple', _('This is A Meeple'), _('Click to tickle') );
         */
        addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        /**
         * Adds an HTML tooltip to all the DOM elements set with the specified css class. This is for more elaborate content such as presenting a bigger version of a card.
         * @param className The class name of the elements to add the tooltip to.
         * @param html The HTML content of the tooltip.
         * @param delay (optional) The delay in milliseconds to wait before showing the tooltip. The default is 500 milliseconds.
         * @example this.addTooltipHtmlToClass( 'meeple', '<div>This is A Meeple</div>' );
         */
        addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
        /**
         * Removes a tooltip from the DOM element.
         * @param target The DOM element to remove the tooltip from.
         * @example this.removeTooltip('cardcount');
         */
        removeTooltip(target: string): void;
        /**
         * Changes the {@link bHideTooltips} property and overrides all tooltips 'onShow' event to either block or unblock all tooltips from showing.
         * @param displayType The type of display to set. 0 = unblock, 1 = block.
         *
         * Specific tooltips can be hidden by either calling {@link removeTooltip} or by setting the 'onShow' event to a noop function. This will be reverted whenever this function is called:
         * @example this.tooltips['some_id'].onShow = () => {};
         */
        switchDisplayTooltips(displayType: 0 | 1): void;
        /**
         * Replaces a pseudo markup text with a proper html string, designed for comments. This function replaces the following:
         * - `*<text>*`: bold
         * - `---`: horizontal line
         * - `[<color>]<text>[/color]`: Colored text, supporting red, green, and blue.
         * - `!!!`: Warning icon from fa icons.
         * - `[tip]`: A lightbulb icon from fa icons.
         * @param text The text to apply the markup to.
         * @returns The HTML string with the markup applied.
         */
        applyCommentMarkup(text: string): string;
        /**
         * Shows a confirmation dialog to the user, with a yes and no button.
         *
         * CAREFUL: the general guideline of BGA is to AVOID the use of confirmation dialogs. Confirmation dialogs slow down the game and bother players. The players know that they have to pay attention to each move when they are playing online. The situations where you should use a confirmation dialog are the following:
         * - It must not happen very often during a game.
         * - It must be linked to an action that can really "kill a game" if the player does not pay attention.
         * - It must be something that can be done by mistake (ex: a link on the action status bar).
         * @param message The message to show to the user. Use _() to translate.
         * @param yesHandler The handler to be called on yes.
         * @param noHandler (optional) The handler to be called on no.
         * @param param (optional) If specified, it will be passed to both handlers. If param is not defined, null will be passed instead.
         * @example
         * this.confirmationDialog(_("Are you sure you want to bake the pie?"), () => {
         * 	this.bakeThePie();
         * });
         * return; // nothing should be called or done after calling this, all action must be done in the handler
         */
        confirmationDialog<T = null>(message: string, yesHandler: (param: T) => any, noHandler?: (param: T) => any, param?: T): void;
        /**
         * Shows a warning dialog single 'duly noted' button. The di
         *
         */
        warningDialog(message: string, callback: () => any): void;
        /**
         * Creates a dialog with the message and title, and a single button that says "Ok".
         * (TODO This may be incorrect based on source ->) The dialog can only be closed by clicking the "Ok" button and will call the callback if it is provided. This is useful for displaying information to the user before preforming a possibly confusing action like reloading the page.
         *
         * {@link warningDialog} is similar but has difference styling.
         * @param message The message to display in the dialog.
         * @param title The title of the dialog.
         * @param callback The callback to call when the "Ok" button is clicked.
         * @param useSiteDialog (optional) If true, the dialog will be presented using the bgaConfirm function from the sites index.js file. Otherwise, a popup dialog with the id 'info_dialog' will be created.
         * @returns The dialog that was created.
         * @example
         * this.infoDialog(_("You need to reload the page because the game is out of sync."), _("Out of Sync"), () => window.location.reload());
         */
        infoDialog(message: string, title: string, callback?: () => any, useSiteDialog?: boolean): void;
        /**
         * Shows a multiple choice dialog to the user. Note: there is no cancel handler, so make sure you gave user a choice to get out of it.
         * @param message The message to show to the user. Use _() to translate.
         * @param choices An array of choices.
         * @param callback The handler to be called on choice made. The choice parameter is the INDEX of the choice from the array of choices.
         * @example
         * const keys = ["0", "1", "5", "10"];
         * this.multipleChoiceDialog(_("How many bugs to fix?"), keys, (choice) => {
         * 	if (choice==0) return; // cancel operation, do not call server action
         * 	var bugchoice = keys[choice]; // choice will be 0,1,2,3 here
         * 	this.ajaxcallwrapper("fixBugs", { number: bugchoice });
         * });
         * return; // must return here
         */
        multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
        /**
         * Shows a info dialog that also has a text field. See {@link infoDialog} for more information.
         * @param title The title of the dialog.
         * @param callback The callback to call when the "Ok" button is clicked. This is passed the unmodified value of the text field.
         * @param message The message to display in the dialog. If omitted, the dialog will not have a message.
         */
        askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
        /**
         * Displays a score value over an element to make the scoring easier to follow for the players. This is particularly useful for final scoring or other important scoring events.
         * @param anchor The html element to place the animated score onto.
         * @param color The hexadecimal RGB representation of the color (should be the color of the scoring player), but without a leading '#'. For instance, 'ff0000' for red.
         * @param score The numeric score to display, prefixed by a '+' or '-'.
         * @param duration (optional) The animation duration in milliseconds. The default is 1000.
         * @param offset_x (optional) The x offset in pixels to apply to the scoring animation.
         * @param offset_y (optional) The y offset in pixels to apply to the scoring animation.
         * @example this.displayScoring('my_element', 'ff0000', '+5', 1000, 10, 10);
         * @example
         * // If you want to display successively each score, you can use this.notifqueue.setSynchronous() function.
         * setupNotifications: function()   {
         * 	dojo.subscribe( 'displayScoring', this, "notif_displayScoring" );
         * 	...
         * },
         * notif_displayScoring: function(notif) {
         * 	const duration = notif.args.duration ?? 1000;
         * 	this.notifqueue.setSynchronous('displayScoring', duration );
         * 	this.displayScoring( notif.args.target, notif.args.color, notif.args.score, duration);
         * },
         */
        displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
        /**
         * Shows a bubble with a message in it. This is a comic book style speech bubble to express the players voices.
         * Warning: if your bubble could overlap other active elements of the interface (buttons in particular), as it stays in place even after disappearing, you should use a custom class to give it the style "pointer-events: none;" in order to intercept click events.
         * Note: If you want this visually, but want to take complete control over this bubble and its animation (for example to make it permanent) you can just use div with 'discussion_bubble' class on it, and content of div is what will be shown.
         * @param anchor The id of the element to attach the bubble to.
         * @param message The text to put in the bubble. It can be HTML.
         * @param delay (optional) The delay in milliseconds. The default is 0.
         * @param duration (optional) The duration of the animation in milliseconds. The default is 3000.
         * @param custom_class (optional) An extra class to add to the bubble. If you need to override the default bubble style.
         * @example this.showBubble('meeple_2', _('Hello'), 0, 1000, 'pink_bubble');
         * @example
         * // If you want to display successively each bubble, you can use this.notifqueue.setSynchronous() function.
         * setupNotifications: function()   {
         * 	dojo.subscribe( 'showBubble', this, "notif_showBubble" );
         * 	...
         * },
         * notif_showBubble: function(notif) {
         * 	const duration = notif.args.duration ?? 3000;
         * 	this.notifqueue.setSynchronous('showBubble', duration );
         * 	this.showBubble( notif.args.target, notif.args.text, notif.args.delay ?? 0, duration, notif.args.custom_class );
         * },
         */
        showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
        /**
         * Creates an concentric circles animated effect at the specified location relative to the anchor. This is useful for showing a point of interest or a special event, usually use to represent a mouse click of a player.
         * @param anchor The id of the element to attach the effect to. The left and top are relative to this element.
         * @param left The left offset.
         * @param top The top offset.
         * @param backgroundColor (optional) The background color of the circles. The default is 'red'.
         */
        showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
        /**
         * Returns a translated string representing the `rank` of the given placement.
         * @param player_rank A number representing the placement of the player: 1 = 1st, 2 = 2nd, etc.
         * @param dontOrderLosers If true, all players will be marked in the 1st, 2nd, 3rd, etc. order. If false, 1 = Winner and 2+ = Loser.
         * @returns The translated string representing the rank.
         */
        getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
        /** Turns the number 0-100 into a translated karma label. If the number is out of range, undefined is returned. */
        getKarmaLabel(karma: number | string): {
            label: 'Perfect' | string;
            css: 'exceptional';
        } | {
            label: 'Excellent' | string;
            css: 'perfect';
        } | {
            label: 'Very good' | string;
            css: 'verygood';
        } | {
            label: 'Good' | string;
            css: 'good';
        } | {
            label: 'Average' | string;
            css: 'average';
        } | {
            label: 'Not good' | string;
            css: 'notgood';
        } | {
            label: 'Bad' | string;
            css: 'bad';
        } | {
            label: 'Very bad' | string;
            css: 'verybad';
        } | undefined;
        /**
         * Returns the number of keys in an object by iteratively counting.
         * @deprecated You should use Object.keys(obj).length instead.
         */
        getObjectLength(obj: object): number;
        /** Internal. The list of comet subscriptions managed by {@link register_cometd_subs} and {@link unsubscribe_all}. The key is the comet id used for emits, and the number is the amount of subscriptions to that id. */
        comet_subscriptions: string[];
        /** Internal. @deprecated This is not used within the main code file anymore. */
        unload_in_progress: boolean;
        /** Internal. See {@link cancelAjaxCall} form more information. Looks like this prevent callbacks on ajax calls. */
        bCancelAllAjax: boolean;
        /** Internal. Extra info about tooltips, used for events. */
        tooltipsInfos: Record<string, {
            hideOnHoverEvt: DojoJS.Handle | null;
        }>;
        /** Internal. */
        mozScale: number;
        /** Internal. Saved states for rotate functions (so preform quick translations). See {@link rotateTo}, {@link rotateInstantDelta}, and other flavors for more info. */
        rotateToPosition: Record<string, number>;
        /** Internal. The type and identifier for the room (T{table_id} = table, P{player_id}_{player_id} = private). */
        room: BGA.RoomId | null;
        /** Internal. The room that has been accepted by the player. Used for keeping the current room up to date. */
        already_accepted_room: BGA.RoomId | null;
        /** Internal. The {@link WebPush} object for this. This is initialized within {@link setupWebPush} */
        webpush: InstanceType<BGA.WebPush> | null;
        /** Internal. The currently set min width for this interface. This is different then {@link screenMinWidth} which is constant. */
        interface_min_width?: number;
        /** Internal. A counter used to create unique ids for confirmation dialogs that open at the same time (to maintain functionality). If undefined, no confirmation dialogs have been created. See {@link confirmationDialog} for more information. */
        confirmationDialogUid?: number;
        /** Internal. The uid for the last dialog that was confirmed, used to prevent double calling functions. If undefined, no confirmation dialogs have been created. See {@link confirmationDialog} for more information. */
        confirmationDialogUid_called?: number;
        /** Internal. Used to managed the state of bubbles from {@link showBubble} and {@link doShowBubble}. The keys of this record represent all active bubbles, and the value is the timeout that is currently running on that bubble. */
        discussionTimeout?: Record<string, number>;
        /** A counter representing the number of times {@link showClick} has been called. Used to create custom element id's for maintaining callbacks. */
        showclick_circles_no?: number;
        /** Internal. */
        number_of_tb_table_its_your_turn?: number;
        /** Internal. */
        prevent_error_rentry?: number;
        transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
        onresizePlayerAwardsEvent?: DojoJS.Handle;
        /** Internal. Automatic zoom factor applied to displays. This is usually used to scale down elements on smaller displays, like mobile. 1 == 100% normal scale. */
        gameinterface_zoomFactor?: number;
        /** Internal. Makes an ajax page request and loads the content into the given part of the DOM. The {@param loadTo} will be emptied before any new elements are added. */
        ajaxpageload<Scope>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope, callback: DojoJS.HitchMethod<Scope, [data: any]>): typeof import("dojo/promise/Promise")<any>;
        /** Internal. Helper function for ajax calls used to present HTTP errors. This calls the {@link showMessage} function with a custom translated error matching the error code. */
        displayUserHttpError(error_code: string | number | null): void;
        /** Internal. Enables the {@link bCancelAllAjax} property which modifies how ajax callbacks are attached to the ajax requests. */
        cancelAjaxCall(): void;
        /** Internal. Apply gender regex to some text. */
        applyGenderRegexps(t: string, i?: null | 0 | 1 | '0' | '1'): string;
        /** Internal. Sets the {@link interface_min_width}. */
        adaptScreenToMinWidth(min_width: number): void;
        /** Internal. Preforms screen resizing by styling the body element with a zoom equal to a newly computed {@link currentZoom}. */
        adaptScreenToMinWidthWorker(): void;
        /** @deprecated This looks like it is using an old version of dojo position, and not called withing the source code. */
        getObjPosition(obj: HTMLElement | string): {
            x: number;
            y: number;
        };
        /** Internal. A purely helper function for {@link showBubble}. This is used like a local function would be to prevent duplication. Always used {@link showBubble} instead. */
        doShowBubble(anchor: string, message: string, custom_class?: string): void;
        /** Internal. Returns the translated <text>_displayed string. */
        getGameNameDisplayed(text: string): string;
        formatReflexionTime(time: number): {
            string: string;
            mn: number;
            s: (string | number);
            h: number;
            positive: boolean;
        };
        strip_tags(e: string, t?: string): string;
        validURL(e: any): boolean;
        nl2br(e: any, t: any): string;
        htmlentities(e: string, t: any, i: any, n: any): string | false;
        html_entity_decode(e: any, t: any): string | false;
        get_html_translation_table(e: any, t: any): Record<string, string>;
        ucFirst(e: any): any;
        setupWebPush(): Promise<void>;
        refreshWebPushWorker(): void;
        getRTCTemplate(e: any, t: any, i: any): string;
        setupRTCEvents(t: string): void;
        getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
            mandatory: {
                minAspectRatio: number;
                maxAspectRatio: number;
                maxWidth: number;
                maxFrameRate: number;
            };
            optional: never[];
        };
        startRTC(): void;
        doStartRTC(): void;
        onGetUserMediaSuccess(): void;
        onGetUserMediaError(): void;
        onJoinRoom(t: any, i: any): void;
        onClickRTCVideoMax(t: Event): void;
        maximizeRTCVideo(t: any, i: any): void;
        onClickRTCVideoMin(t: any): void;
        onClickRTCVideoSize(t: any): void;
        onClickRTCVideoMic(t: any): void;
        onClickRTCVideoSpk(t: any): void;
        onClickRTCVideoCam(t: any): void;
        onLeaveRoom(t: any, i: any): void;
        onLeaveRoomImmediate(e: any): void;
        doLeaveRoom(e?: any): void;
        clearRTC(): void;
        ntf_webrtcmsg(e: any): void;
        addSmileyToText(e: string): string;
        getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
        makeClickableLinks(e: any, t: any): any;
        makeBgaLinksLocalLinks(e: any): any;
        ensureEbgObjectReinit(e: any): void;
        getRankClassFromElo(e: any): string;
        getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
        getRankClassFromEloUntranslated(e: any): "good" | "average" | "beginner" | "apprentice" | "strong" | "expert" | "master";
        eloToBarPercentage(e: any, t?: boolean): number;
        formatElo(e: string): number;
        formatEloDecimal(e: any): number;
        getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
        getArenaLabel(e: any, t?: any): string;
        insertParamIntoCurrentURL(e: any, t: any): void;
        playerawardsCollapsedAlignement(): void;
        playerawardCollapsedAlignement(t: any): void;
        arenaPointsDetails(e: any, t?: any): {
            league: 0 | 2 | 1 | 3 | 4 | 5;
            league_name: string;
            league_shortname: string;
            league_promotion_shortname: string;
            points: number;
            arelo: number;
        };
        arenaPointsHtml(t: {
            league_name: string;
            league: 0 | 1 | 2 | 3 | 4 | 5;
            arelo: number;
            points: number | null;
            league_promotion_shortname?: string | null;
        }): {
            bar_content: string;
            bottom_infos: string;
            bar_pcent: string;
            bar_pcent_number: string | number;
        };
    }
    let CorePage: DojoJS.DojoClass<CorePage_Template, []>;
    export = CorePage;
    global {
        namespace BGA {
            type CorePage = typeof CorePage;
            interface EBG_CORE {
                core: CorePage;
            }
            interface EBG {
                core: EBG_CORE;
            }
        }
        var ebg: BGA.EBG;
        /** A global variable caused by bad code in ebg/core/core:unsubscribe_all. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var sub_id: string;
        /** A global variable caused by bad code in ebg/core/core:unsubscribe_all. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var dynamicConfig: any;
        var current_player_id: number | undefined;
    }
}
declare module "ebg/draggable" {
    type Core = InstanceType<typeof import("ebg/core/core")>;
    /**
     * Draggable it was created long time ago when HTML5 did not have such support, it probably best to use direct html5 spec now.
     */
    class Draggable_Template {
        page: Core | null;
        item_id: string | null;
        item_div: HTMLElement | null;
        mouse_x_origin: number | null;
        mouse_y_origin: number | null;
        element_x_origin: string | null;
        element_y_origin: string | null;
        is_dragging: boolean;
        is_disabled: boolean;
        dragging_handler: any;
        dragging_handler_touch: any;
        bUseAutomaticZIndex: boolean;
        automatic_z_index: boolean;
        bGrid: boolean;
        bSnap: boolean;
        gridSize: number;
        draggedThisTime: boolean;
        zoomFactorOriginalElement: number;
        parentRotation: number;
        event_handlers: DojoJS.Handle[];
        snapCallback: ((x: number, y: number) => {
            x: number;
            y: number;
        }) | null;
        onStartDragging: (e: string, t: string, i: string) => any;
        onEndDragging: (e: string, t: number, i: number, n: boolean) => any;
        onDragging: (e: string, t: number, i: number, n: number, o: number) => any;
        create(page: Core, item_id: string, interact_element?: HTMLElement | string | null): void;
        /**
         * Clears all event handlers from this draggable object. To reuse it, you need to call {@link create} again.
         * Note, this does not destroy any elements, simply disconnects all event handlers.
         */
        destroy(): void;
        changeDraggableItem(item_id: string): void;
        onMouseDown(t: MouseEvent | TouchEvent): void;
        onMouseUp(t: MouseEvent | TouchEvent): void;
        onMouseMove(t: MouseEvent | TouchEvent): void;
        disable(t: string): void;
        enable(): void;
    }
    let Draggable: DojoJS.DojoClass<Draggable_Template, []>;
    export = Draggable;
    global {
        namespace BGA {
            type Draggable = typeof Draggable;
            interface EBG {
                draggable: Draggable;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/expandablesection" {
    class ExpandableSection_Template {
        page: any;
        div_id: string | null;
        create(t: any, i: string): void;
        destroy(): void;
        toggle(t: Event): void;
        expand(): void;
        collapse(): void;
    }
    let ExpandableSection: DojoJS.DojoClass<ExpandableSection_Template, []>;
    export = ExpandableSection;
    global {
        namespace BGA {
            type ExpandableSection = typeof ExpandableSection;
            interface EBG {
                expandablesection: ExpandableSection;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/gamenotif" {
    global {
        namespace BGA {
            interface IntrinsicGameAjaxActions {
                notificationHistory: {
                    _successargs: [
                        {
                            data: any[];
                        }
                    ];
                    table: BGA.ID;
                    from: number;
                    privateinc: 1;
                    history: 0 | 1;
                };
            }
            interface AjaxActions extends Type<{
                [scriptlogger: `/web/scriptlogger/${string}.html`]: {
                    log: string;
                };
            }> {
            }
            /**
             * An interface type that represents all possible notification types. This is only used as a type for internal validation, ensuring the all notification string literal names and arguments are typed correctly.
             *
             * All entries should follow the format as follows: `[name: string]: object | null;`. For notifications without arguments, use null and not an empty object. This format is omitted so coding intellisense can restrict parameters/types. At runtime, this may not accurately represent all possible notifications depending on if this matches the notify functions used with server code (<yourgame>.game.php).
             *
             * Any notifications types can be added by expanding (not extending) this interface.
             *
             * The built-in notifications are added here to prevent reuse of an existing notification name. There are very few situation where you will want to add listeners for the built-in notifications, as they are handled by the game engine.
             * @example
             * interface NotifTypes {
             * 	'newHand': { cards: Card[] };
             * 	'playCard': { player_id: number, color: number, value: number, card_id: number };
             * 	'trickWin': { };
             * 	'giveAllCardsToPlayer': { player_id: number };
             * 	'newScores': { newScores: { [player_id: number]: number } };
             * }
             */
            interface NotifTypes {
                /** All other args on this object are later copied from {@link CurrentStateArgs} */
                "gameStateChange": BGA.IActiveGameState;
                "gameStateChangePrivateArg": BGA.IActiveGameState['args'];
                "gameStateMultipleActiveUpdate": BGA.ID[];
                "newActivePlayer": BGA.ID;
                "playerstatus": {
                    player_id: BGA.ID;
                    player_status: 'online' | 'offline' | 'inactive';
                };
                "yourturnack": {
                    player: BGA.ID;
                };
                "clockalert": null;
                /** Sent to update a player's zombie or eliminated status. */
                "tableInfosChanged": {
                    reload_reason: 'playerQuitGame' | 'playerElimination';
                    who_quits: BGA.ID;
                };
                /** Sent whenever a player is eliminated. This calls the {@link Gamequi.showEliminated}. */
                "playerEliminated": {
                    who_quits: BGA.ID;
                };
                "tableDecision": {
                    decision_type: 'none' | 'abandon' | 'switch_tb' | string;
                    decision_taken?: boolean | 'true';
                    decision_refused?: boolean | 'true';
                    players?: Record<BGA.ID, string>;
                };
                /** Logs the 'log' of the notifications, substituting any args in the log. */
                "infomsg": Record<keyof any, string> & {
                    player: BGA.ID;
                };
                "archivewaitingdelay": null;
                "end_archivewaitingdelay": null;
                "replaywaitingdelay": null;
                "end_replaywaitingdelay": null;
                "replayinitialwaitingdelay": null;
                "end_replayinitialwaitingdelay": null;
                /** Normally a noop function, used with {@link GameNotif.setSynchronous} to automatically create a 'delay' notification. */
                "aiPlayerWaitingDelay": null;
                "replay_has_ended": null;
                "updateSpectatorList": Record<BGA.ID, string>;
                /** Creates a {@link PopInDialog} with the given parameters. */
                "tableWindow": {
                    id: BGA.ID;
                    title: string;
                    table: Record<string, Record<string, Record<keyof any, any> | string>>;
                    header?: string;
                    footer?: string;
                    closing?: string;
                };
                /** Sets {@link Gamegui.lastWouldLikeThinkBlinking}, kicking off the blinking animation. */
                "wouldlikethink": null;
                "updateReflexionTime": {
                    player_id: BGA.ID;
                    delta: number;
                    max: number;
                };
                /** Only affects {@link g_archive_mode}. */
                "undoRestorePoint": null;
                "resetInterfaceWithAllDatas": BGA.Gamedatas;
                "zombieModeFail": null;
                "zombieModeFailWarning": null;
                "aiError": {
                    error: string;
                };
                "skipTurnOfPlayer": {
                    player_id: BGA.ID;
                    zombie: boolean;
                };
                "zombieBack": {
                    player_id: BGA.ID;
                };
                "allPlayersAreZombie": null;
                "gameResultNeutralized": {
                    progression: number;
                    player_id: BGA.ID;
                };
                "playerConcedeGame": {
                    player_name: string;
                } & Record<keyof any, any>;
                "showTutorial": {
                    delay?: number;
                    id: BGA.ID;
                    text: string;
                    calltoaction: string;
                    attachement: string;
                };
                "showCursor": {
                    player_id: BGA.ID;
                    path: Record<keyof any, {
                        id: string;
                        x: number;
                        y: number;
                    }>;
                };
                "showCursorClick": {
                    player_id: BGA.ID;
                    path: Record<keyof any, {
                        id: string;
                        x: number;
                        y: number;
                    }>;
                };
                "skipTurnOfPlayerWarning": {
                    player_id: BGA.ID;
                    delay: number;
                };
                "simplePause": {
                    time: number;
                };
                "banFromTable": {
                    from: number;
                };
                "resultsAvailable": null;
                "switchToTurnbased": null;
                /** All other args on this object are later copied from {@link CurrentStateArgs} */
                "newPrivateState": BGA.IActiveGameState;
                "chat": ChatNotifArgs;
                "groupchat": ChatNotifArgs & {
                    gamesession?: string;
                    gamesessionadmin?: string;
                    group_id: BGA.ID;
                    group_avatar: string;
                    group_type: "group" | "tournament";
                    group_name: string;
                    seemore?: string;
                };
                "chatmessage": ChatNotifArgs;
                "tablechat": ChatNotifArgs & {
                    game_name_ori?: string;
                    game_name?: string;
                };
                "privatechat": ChatNotifArgs & {
                    target_id: BGA.ID;
                    target_name: string;
                    target_avatar: string;
                    player_id: BGA.ID;
                    player_name: string;
                    avatar: string;
                };
                "stopWriting": ChatNotifArgs;
                "startWriting": ChatNotifArgs;
                "newRTCMode": {
                    rtc_mode: 0 | 1 | 2;
                    player_id: BGA.ID;
                    target_id: BGA.ID;
                    room_creator: BGA.ID;
                    table_id: BGA.ID;
                };
                "history_history": {};
            }
            /** Partial: This has been partially typed based on a subset of the BGA source code. */
            interface ChatNotifArgs {
                /** The text for this chat message. This is null if the chat message type does not log an actual message (like 'startWriting'). */
                text?: string;
                player_id?: BGA.ID;
                player_name?: string;
                /** Populated after receiving notif, represents the unique identifier for this message, used for linking html events and getting message elements. */
                id?: BGA.ID;
                /** Populated after receiving notif, represents the html version of text? */
                message?: string | {
                    log?: boolean;
                };
                /** Populated after receiving notif, represents if message has been read. */
                mread?: boolean | null;
                was_expected?: boolean;
                players?: Record<BGA.ID, PlayerMetadata>;
                reload_reason?: "playerElimination" | "playerQuitGame" | "cancelGameStart";
                is_new?: boolean | 1 | 0;
                logaction?: LogAction;
                type?: string;
                time?: number;
            }
            interface LogAction<T extends keyof AjaxActions = keyof AjaxActions> {
                log: string;
                args: {
                    player_name: string;
                    player_id: BGA.ID;
                    i18n?: string;
                    [key: string]: any;
                };
                action_analytics?: any;
                action: T;
                action_arg: AjaxActions[T];
            }
            /**
             * A loosely typed structure that represents all possible arguments for a notification. This is an intersection of all possible arguments, which prevents the need to cast the args to a specific type. Use {@link NotifFrom} to represent a specific arguments rather then the specific notif type(s).
             *
             * Because this is one big intersection, it can suffer from a {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#intersections-reduced-by-discriminant-properties | intersections reduced by discriminant properties} issue. If this is the case, you should either change argument properties so they don't share names with differing types (T1 & T2 == never), or add them here as an omitted type, and manually intersect like with 'id' below.
             */
            /** A loosely typed structure that represents the data of a network message. This is used to represent any notification type, where the args is an intersection of all possible args. */
            interface Notif<T extends keyof NotifTypes = keyof NotifTypes> {
                /** The type of the notification (as passed by php function). */
                type: T;
                /** The arguments passed from the server for this notification. This type should always match the notif.type. */
                args: keyof NotifTypes extends T ? (Record<keyof any, any> & BGA.ID) | null : AnyOf<NotifTypes[T]>;
                /** The message string passed from php notification. */
                log: string;
                /** True when NotifyAllPlayers method is used (false otherwise), i.e. if all player are receiving this notification. */
                bIsTableMsg?: boolean;
                /** Information about channel which this notification was sent from, formatted as : "/<type>/<prefix>[ID]". */
                channelorig?: ChannelInfos['channel'];
                /** Name of the game which this notification is coming from. Undefined when this is not associated with a game. */
                gamenameorig?: string;
                /** UNIX GMT timestamp. */
                time: number;
                /** Unique identifier of the notification in hex */
                uid: HexString | 0;
                /** Unknown in hex. */
                h?: HexString;
                /** Unknown as well. */
                lock_uuid: string;
                /** Unknown. Probably something to do with synchronizing notifications. */
                synchro?: number;
                /** ID of the move associated with the notification, if any. */
                move_id?: BGA.ID;
                /** ID of the table (comes as string), if any. */
                table_id?: BGA.ID;
            }
            /**
             * Internal. A group of notifications which are sent to the client. This is almost always a network message of several notifications.
             *
             * Partial: This has been partially typed based on a subset of the BGA source code.
             */
            interface NotifsPacket {
                /** The type of the packet which is used for determining how these notif should be dispatched (mainly timing). */
                packet_type: 'single' | 'sequence' | 'resend' | 'history';
                /** The notifications that are sent to the client. */
                data: Notif[];
                /** The channel that this notification targets. */
                channel: ChannelInfos['channel'];
                /** The unique id of the move that these notifications represent. Note that when receiving a new notifs packet, this is immediately copied to each notif entry in {@link data}. */
                move_id?: BGA.ID;
                /** The unique id of the table that these notifications represent. Note that when receiving a new notifs packet, this is immediately copied to each notif entry in {@link data}. */
                table_id?: BGA.ID;
                packet_id: BGA.ID;
                prevpacket?: Record<BGA.ID, BGA.ID>;
                chatmessage?: boolean;
                time?: number;
            }
            interface ChatNotif extends Notif<"chat" | "groupchat" | "chatmessage" | "tablechat" | "privatechat" | "startWriting" | "stopWriting" | "newRTCMode" | "history_history"> {
                channel?: ChannelInfos['channel'];
                loadprevious?: boolean;
                mread?: boolean | null | undefined;
                donotpreview?: any;
            }
        }
    }
    /** The class used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
    class GameNotif_Template {
        /** Record of notification types that should be evaluated synchronously (one after the other). The value of each key represents the duration that should be waited before processing the next notification. */
        synchronous_notifs: {
            [K in keyof BGA.NotifTypes]?: number;
        };
        /** Record of notification predicates which defining when a notification should be suppressed (prevent synchronous behaviour and prevent callbacks). */
        ignoreNotificationChecks: {
            [T in keyof BGA.NotifTypes]?: ((notif: BGA.Notif<T>) => boolean);
        };
        /**
         * This method will set a check whether any of notifications of specific type should be ignored.
         *
         * IMPORTANT: Remember that this notification is ignored on the client side, but was still received by the client. Therefore it shouldn't contain any private information as cheaters can get it. In other words this is not a way to hide information.
         * IMPORTANT: When a game is reloaded with F5 or when opening a turn based game, old notifications are replayed as history notification. They are used just to update the game log and are stripped of all arguments except player_id, i18n and any argument present in message. If you use and other argument in your predicate you should preserve it as explained here.
         * @param notif_type The type of the notification.
         * @param predicate A function that will receive notif object and will return true if this specific notification should be ignored.
         * @example this.notifqueue.setIgnoreNotificationCheck( 'dealCard', (notif) => (notif.args.player_id == this.player_id) );
         */
        setIgnoreNotificationCheck<T extends keyof BGA.NotifTypes>(notif_type: T, predicate: ((notif: BGA.Notif<T>) => boolean)): void;
        /**
         * This method will set a check whether any of notifications of specific type should be ignored.
         * @param notif_type The type of the notification.
         * @param duration The duration in milliseconds to wait after executing the notification handler.
         * @example
         * // Here's how we do this, right after our subscription:
         * dojo.subscribe( 'playDisc', this, "notif_playDisc" );
         * this.notifqueue.setSynchronous( 'playDisc', 500 );   // Wait 500 milliseconds after executing the playDisc handler
         * @example
         * // For this case, use setSynchronous without specifying the duration and use setSynchronousDuration within the notification callback.
         * // NOTE: If you forget to invoke setSynchronousDuration, the game will remain paused forever!
         * setupNotifications() {
         * 	dojo.subscribe( 'cardPlayed', this, 'notif_cardPlayed' );
         * 	this.notifqueue.setSynchronous( 'cardPlayed' ); // wait time is dynamic
         * 	...
         * },
         * notif_cardPlayed(notif) {
         * 	// MUST call setSynchronousDuration
         * 	// Example 1: From notification args (PHP)
         * 	this.notifqueue.setSynchronousDuration(notif.args.duration);
         * 	...
         * 	// Or, example 2: Match the duration to a Dojo animation
         * 	var anim = dojo.fx.combine([
         * 	...
         * 	]);
         * 	anim.play();
         * 	this.notifqueue.setSynchronousDuration(anim.duration);
         * },
         */
        setSynchronous(notif_type: keyof BGA.NotifTypes, duration?: number): void;
        /**
         * This method will set a check whether any of notifications of specific type should be ignored.
         * @param duration The duration in milliseconds to wait after executing the notification handler.
         * @see {@link setSynchronous}
         */
        setSynchronousDuration(duration: number): void;
        /** Internal. Contains all notifications received that have not yet been dispatched, excluding all player moves which are held until a table move with the same move id is sent. */
        queue: BGA.Notif[];
        /** Internal. The id of the next log message. */
        next_log_id: number;
        /** Internal. The reference to the game that manages this. Usually this is for validation, filtering (like players), or checking if the game is in {@link BGA.SiteCore.instantaneousMode}. */
        game: InstanceType<BGA.SiteCore> | null;
        /** Internal. Ordered list of hex uids for notifications that have been dispatched. This is automatically truncated to the last 50 dispatched notifications. */
        dispatchedNotificationUids: string[];
        /** Internal. If true, 'sequence' packets will be resynchronized when queued if needed. */
        checkSequence: boolean;
        /** Internal. The id of the last packet which is marked as 'sequence' or 'resend'. Helper used for sequencing notifications. */
        last_packet_id: BGA.ID;
        /** Internal. If true, the notifications are currently being resynchronized. */
        notificationResendInProgress: boolean;
        /** Internal. The current synchronous notification that is being processed. Used to prevent group dispatching any further notification (and dispatching single synchronous notifications). */
        waiting_from_notifend: null | BGA.Notif;
        /** Internal. A record of non-table moves ids paired with their notifications. This is similar to */
        playerBufferQueue: Record<string, {
            notifs: BGA.NotifsPacket;
            counter: number;
        }>;
        /** Internal. Like {@link next_log_id}, is a counter for specifically debugging notifications. */
        debugnotif_i: number;
        /** Internal. */
        currentNotifCallback: keyof BGA.NotifTypes | null;
        /** Internal. This is a reference to the {@link BGA.SiteCore.onPlaceLogOnChannel} method. */
        onPlaceLogOnChannel: ((chatnotif: BGA.ChatNotif) => void) | null;
        /** Internal. The last time that {@link addToLog} was called with valid parameters. */
        lastMsgTime: number;
        logs_to_load?: BGA.NotifsPacket[];
        logs_to_load_sortedNotifsKeys?: string[];
        logs_to_load_loadhistory?: number;
        bStopAfterOneNotif?: boolean;
        cometd_service?: "keep_existing_gamedatas_limited" | "socketio" | string;
        constructor();
        /** Internal. Handles getting a new packet of notifications. */
        onNotification(notifs_or_json: BGA.NotifsPacket | string): void;
        /** Internal. Resynchronizes the network packets, usually used for replaying events. */
        resynchronizeNotifications(isHistory: boolean): void;
        /** Internal. Asynchronously tries to pull logs from history to display. Keeps trying until it succeeds. */
        pullResynchronizeLogsToDisplay(): void;
        /** Internal. Dispatches all queued notifications. */
        dispatchNotifications(): boolean;
        /** Internal. Formats and prints the given log message. */
        formatLog(message: string, args: {
            player_name: string;
            player_id: BGA.ID;
            i18n?: string;
            [key: string]: any;
        }): string;
        /**
         * Internal. Dispatches a single notification.
         * @returns True if a sound was played.
         */
        dispatchNotification(notif: BGA.Notif, disableSound?: boolean): boolean;
        /** Adds the given message to the game chat based on the parameters given. */
        addChatToLog(message: string, seeMore?: boolean, translateIcon?: boolean, extraClasses?: string): void;
        /** Internal. Translates the inner html of the target element for the event. This opens a new window on google translate with the source text? */
        onTranslateLog(event: Event): void;
        /** Adds the given message to the game log based on the parameters given. */
        addToLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): number;
        /** Changed the player name to an HTML string with a link to the player account, and red style if the player is an admin. */
        playerNameFilter(args: {
            player_name?: string;
            player_id?: BGA.ID;
            is_admin?: boolean;
        }): typeof args;
        /** Changes the properties on this object to strings tha tare formatted to match the player color. */
        playerNameFilterGame(args: undefined): void;
        /** Internal. Check if there is a notification currently being processed. This is the same as {@link waiting_from_notifend} !== null. */
        isSynchronousNotifProcessed(): boolean;
        /** Internal. Callback for the internal timeout when the {@link waiting_from_notifend} has finished (the time has elapsed). This dispatches the next notification if needed. */
        onSynchronousNotificationEnd(): void;
        /** Internal. A callback for replaying the game from a specific state (based on the id of the target element). */
        debugReplayNotif(event: Event): void;
    }
    let GameNotif: DojoJS.DojoClass<GameNotif_Template, []>;
    export = GameNotif;
    global {
        namespace BGA {
            type GameNotif = typeof GameNotif;
            interface EBG {
                gamenotif: GameNotif;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/pageheader" {
    global {
        namespace BGA {
            interface PageHeaderButton {
                btn: string;
                section: string | string[];
                defaults?: boolean;
                onShow?: () => void;
                onHide?: () => void;
            }
        }
    }
    class PageHeader_Template {
        page: any;
        div_id: string | null;
        adaptsubtrigger: DojoJS.Handle | null;
        bDisableAdaptMenu: boolean;
        bUpdateQueryString: boolean;
        buttons?: Record<string, BGA.PageHeaderButton>;
        bAllByDefault: boolean;
        onSectionChanged: () => void;
        create(page: any, id: string, buttons: Record<string, BGA.PageHeaderButton>, allByDefault: boolean, updateQueryString?: boolean): void;
        destroy(): void;
        adaptSubmenu(): void;
        getSelected(): string | null;
        getNumberSelected(): number;
        hideAllSections(): void;
        showDefault(): void;
        showSection(t: string | string[], i: string): void;
        onClickButton(t: Event): void;
        showSectionFromButton(e: string): void;
        onClickHeader(e: Event): void;
        updateQueryString(t: string): void;
    }
    let PageHeader: DojoJS.DojoClass<PageHeader_Template, []>;
    export = PageHeader;
    global {
        namespace BGA {
            type PageHeader = typeof PageHeader;
            interface EBG {
                pageheader: PageHeader;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/paymentbuttons" {
    import "ebg/expandablesection";
    import "ebg/paymentbuttons";
    global {
        namespace BGA {
            interface AjaxActions {
                "/premium/premium/createPaypalOrder.html": {
                    _successargs: [
                        {
                            id: BGA.ID;
                        }
                    ];
                    months: BGA.ID;
                    quantity: BGA.ID;
                    offer: boolean;
                    currency: string;
                };
                "/premium/premium/capturePaypalOrder.html": {
                    order_id: BGA.ID;
                };
                "/premium/premium/paymentTrack.html": {
                    track: string;
                };
                "/premium/premium/paymentIntent.html": {
                    _successargs: [
                        {
                            client_secret: any;
                        }
                    ];
                    plan: string | 0;
                    currency: string;
                    email: string;
                    target: string;
                    paymentMethod: string;
                    nbr: number;
                    type: number;
                };
                "/premium/premium/doPayment.html": {
                    _successargs: [
                        {
                            requires_action?: boolean;
                            client_secret: any;
                            transaction_id?: BGA.ID;
                        }
                    ];
                    paymentToken: BGA.ID;
                    paymentMethod: string;
                    email: string;
                    target: string;
                    plan: string | 0;
                    currency: string;
                    tos_agreed?: boolean;
                };
                "/premium/premium/cancelSubscription.html": {};
            }
        }
    }
    type CorePage = InstanceType<typeof import("ebg/core/core")>;
    class PaymentButtons_Template {
        page: CorePage | null;
        div_id: string | null;
        sections: Record<string, any>;
        rollGameBoxesTimeout: number | null;
        constructor();
        create(t: CorePage): void;
        destroy(): void;
        offerUpdatePrice(): void;
        getBasePrice(e: string): string;
        onPaypalBtnClick(e: Event): void;
        rollGameBoxes(): void;
        loadPaypalButtons(): void;
        initStripe(): void;
        stripePaymentResultHandler(t: Event): void;
        setBrandIcon(t: string): void;
        onClickWechatButton(t: string, i: HTMLElement): void;
        onWeChatPaymentSucceeded(): void;
        onClickPaymentButton(t: string, i: string): void;
        stripeTokenHandler(t: Element): void;
        payWithStripe(e: Element): void;
        onCancelSubscription(t: Event): void;
        showConfirmPayment(e: boolean): void;
        onPaymentMethodChange(t: Event): void;
        shakePaymentWindow(): void;
    }
    let PaymentButtons: DojoJS.DojoClass<PaymentButtons_Template, []>;
    export = PaymentButtons;
    global {
        namespace BGA {
            type PaymentButtons = typeof PaymentButtons;
            interface EBG {
                paymentbuttons: PaymentButtons;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/playerlocation" {
    global {
        namespace BGA {
            interface AjaxActions {
                "/player/profile/updateCity.html": {
                    form_id: "profileinfos";
                };
                "/table/table/updateCity.html": {
                    form_id: "profileinfos";
                };
            }
        }
    }
    class PlayerLocation_Template {
        page: InstanceType<BGA.CorePage> | null;
        board_div: HTMLElement | null;
        board_div_id: string | null;
        board_uid: string;
        template: string;
        teasing: string;
        googleApiLoaded: boolean;
        jtpl_citychoice: string;
        locationDialog: any;
        cityChoiceResult: any;
        callback_url: string;
        create(t: InstanceType<BGA.CorePage>, i: string, n: string, o: boolean, a: string): void;
        onModifyCity(t: Event): void;
        onSaveCity(t: Event): void;
        onCityChoiceConfirm(t: Event): void;
    }
    let PlayerLocation: DojoJS.DojoClass<PlayerLocation_Template, []>;
    export = PlayerLocation;
    global {
        namespace BGA {
            type PlayerLocation = typeof PlayerLocation;
            interface EBG {
                playerlocation: PlayerLocation;
            }
        }
        var ebg: BGA.EBG;
        var initGoogleApi: () => void;
        var geocoder: {
            geocode: (t: {
                address: string;
                language: string;
                region: string;
            }, i: (t: any, i: any) => void) => void;
        };
    }
}
declare module "ebg/premiumpanel" {
    import "dojox/fx";
    class PremiumPanel_Template {
        page: InstanceType<BGA.SiteCore> | null;
        currentpanel: BGA.ID | null;
        create(page: InstanceType<BGA.SiteCore>): void;
        panel_id_to_name(panel_id: BGA.ID): 'premiumtime' | 'premiumconfig' | `premiumplayer_${number}`;
        switchToPanel(panel_id: BGA.ID): void;
        onMenuItemClick(e: Event): void;
        seePlayerStats(e: Event): void;
    }
    let PremiumPanel: DojoJS.DojoClass<PremiumPanel_Template, []>;
    export = PremiumPanel;
    global {
        namespace BGA {
            type PremiumPanel = typeof PremiumPanel;
            interface EBG {
                premiumpanel: PremiumPanel;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/scrollmap" {
    /**
     * Scrollmap is a BGA client side component to display an infinite game area. It supports Scrolling and Panning. Scrolling - allows user to scroll area inside the view port using the buttons drawn on the top/bottom/left/right. Panning - allows user to drag the surface area (using mouse).
     *
     * Examples of game that use Scrollmap (try on BGA or watch):
     * - Carcassonn
     * - Saboteu
     * - Takenok
     * - Taluva
     *
     * @see {@link https://en.doc.boardgamearena.com/Scrollmap for more information}
     *
     * @example
     * // Add this to the .tpl file or anywhere using html js.
     * <div id="map_container">
     * 	<div id="map_scrollable"></div>
     * 	<div id="map_surface"></div>
     * 	<div id="map_scrollable_oversurface"></div>
     * 	<div class="movetop"></div>
     * 	<div class="movedown"></div>
     * 	<div class="moveleft"></div>
     * 	<div class="moveright"></div>
     * </div>
     *
     * // Add something like this to the .css file
     * // Scrollable area
     *
     * #map_container {
     * 	position: relative;
     * 	overflow: hidden;
     *
     * 	width: 100%;
     * 	height: 400px;
     * }
     * #map_scrollable, #map_scrollable_oversurface {
     * 	position: absolute;
     * }
     * #map_surface {
     * 	position: absolute;
     * 	top: 0px;
     * 	left: 0px;
     * 	width: 100%;
     * 	height: 100%;
     * 	cursor: move;
     * }
     *
     * // This is some extra stuff to extend the container/
     *
     * #map_footer {
     *     text-align: center;
     * }
     *
     * // Move arrows
     *
     * .movetop,.moveleft,.moveright,.movedown {
     * 	display: block;
     * 	position: absolute;
     * 	background-image: url('../../../img/common/arrows.png');
     * 	width: 32px;
     * 	height: 32px;
     * }
     *
     * .movetop {
     * 	top: 0px;
     * 	left: 50%;
     * 	background-position: 0px 32px;
     * }
     * .moveleft {
     * 	top: 50%;
     * 	left: 0px;
     * 	background-position: 32px 0px;
     * }
     * .moveright {
     * 	top: 50%;
     * 	right: 0px;
     * 	background-position: 0px 0px;
     * }
     * .movedown {
     * 	bottom: 0px;
     * 	left: 50%;
     * 	background-position: 32px 32px;
     * }
     *
     * // Add this to the define function as a dependency
     * define([
     * 	"dojo","dojo/_base/declare",
     * 	"ebg/core/gamegui",
     * 	"ebg/counter",
     * 	"ebg/scrollmap"     /// <==== HERE
     * ], ...
     *
     * // Finally, to link your HTML code with your Javascript, place this in your Javascript "Setup" method:
     * this.scrollmap = new ebg.scrollmap(); // declare an object (this can also go in constructor)
     * // Make map scrollable
     * this.scrollmap.create( $('map_container'),$('map_scrollable'),$('map_surface'),$('map_scrollable_oversurface') ); // use ids from template
     * this.scrollmap.setupOnScreenArrows( 150 ); // this will hook buttons to onclick functions with 150px scroll step
     * Partial: This has been partially typed based on a subset of the BGA source code.
     */
    class ScrollMap_Template {
        container_div: HTMLElement | null;
        scrollable_div: HTMLElement | null;
        surface_div: HTMLElement | null;
        onsurface_div: HTMLElement | null;
        isdragging: boolean;
        dragging_offset_x: number;
        dragging_offset_y: number;
        dragging_handler: DojoJS.Handle | null;
        dragging_handler_touch: DojoJS.Handle | null;
        board_x: number;
        board_y: number;
        bEnableScrolling: boolean;
        options: {
            disableVerticalScrolling: boolean;
            onsurfaceDragEnabled: boolean;
        };
        scrollDelta?: number;
        /** Creates event handlers for all divs for handling. */
        create(container_div: HTMLElement, scrollable_div: HTMLElement, surface_div: HTMLElement, onsurface_div: HTMLElement, options?: {
            disableVerticalScrolling?: boolean;
            onsurfaceDragEnabled?: boolean;
        }): void;
        /** Handles the mouse down event. */
        onMouseDown(t: MouseEvent | TouchEvent): void;
        /** Handles the mouse up event. */
        onMouseUp(t: MouseEvent | TouchEvent): void;
        /** Handles the mouse move event. */
        onMouseMove(t: MouseEvent | TouchEvent): void;
        /**
         * Scrolls to the specified position. This is animated unless duration is 0.
         * @param xpos The x position to scroll to.
         * @param ypos The y position to scroll to.
         * @param duration The duration of the animation in milliseconds. Default is 350ms.
         * @param delay The delay before the animation starts in milliseconds. Default is 0ms.
         */
        scrollto(xpos: number, ypos: number, duration?: number, delay?: number): void;
        /**
         * Offsets the scroll position by the specified amount. This is animated unless duration is 0.
         * @param xoffset The amount to offset the x position by.
         * @param yoffset The amount to offset the y position by.
         * @param duration The duration of the animation in milliseconds. Default is 350ms.
         * @param delay The delay before the animation starts in milliseconds. Default is 0ms.
         */
        scroll(xoffset: number, yoffset: number, duration?: number, delay?: number): void;
        /**
         * Scrolls the the center of all elements matching the querySelector. The center is the center of the bounds these object occupy, not the average center. This is always animated with the default duration of 350ms.
         * @param querySelector The query selector to match elements to scroll to. If undefined, this will find the center of all elements in the scrollable div.
        */
        scrollToCenter(querySelector?: string): void;
        /**
         * Adds clickable NWSE controls this scrollmap.
         * @param scrollDelta The amount to scroll when any control is clicked. This value is in pixels.
        */
        setupOnScreenArrows(scrollDelta: number): void;
        onMoveTop(e: MouseEvent): void;
        onMoveLeft(e: MouseEvent): void;
        onMoveRight(e: MouseEvent): void;
        onMoveDown(e: MouseEvent): void;
        /**
         * Checks if the specified position is visible on the screen.
         * @param x The x position to check.
         * @param y The y position to check.
        */
        isVisible(x: number, y: number): boolean;
        /** Enables all scrolling functionality.{@link disableScrolling} for more info. */
        enableScrolling(): void;
        /** Disables all scrolling functionality. This will prevent all interaction with the scrollmap and hide all scroll controls. */
        disableScrolling(): void;
    }
    let ScrollMap: DojoJS.DojoClass<ScrollMap_Template, []>;
    export = ScrollMap;
    global {
        namespace BGA {
            type ScrollMap = typeof ScrollMap;
            interface EBG {
                scrollmap: ScrollMap;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/core/soundManager" {
    import "ebg/core/core";
    class SoundManager_Template {
        bMuteSound: boolean;
        html5: boolean;
        initOk: boolean;
        soundMode: number;
        sounds?: Record<string, string>;
        useOgg: boolean;
        volume: number;
        flashMedia?: {
            doPlay: any;
        };
        init(): boolean;
        initHtml5Audio(): void;
        getSoundIdFromEvent(idOrEvent: string): string;
        getSoundTag(id: string): `audiosrc_${string}`;
        doPlay(args: {
            id: string;
            volume?: number;
        }): void;
        loadSound(id: string): void;
        doPlayFile(soundId: string): void;
        stop(args: {
            id: string;
            volume?: number;
        }): void;
        onChangeSound(event: Event & {
            args: {
                event: string;
                file: string;
            };
        }): void;
    }
    let SoundManager: DojoJS.DojoClass<SoundManager_Template, []>;
    export = SoundManager;
    global {
        namespace BGA {
            type SoundManager = typeof SoundManager;
            interface EBG {
                core: EBG_CORE;
            }
            interface EBG_CORE {
                soundManager: SoundManager;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/thumb" {
    type CorePage = InstanceType<typeof import("ebg/core/core")>;
    type PopinDialog = InstanceType<typeof import("ebg/popindialog")>;
    global {
        namespace BGA {
            interface AjaxActions {
                "/table/table/changeReputation.html": {
                    player: BGA.ID;
                    value: number;
                    category?: string | "personal";
                    f?: 1;
                };
            }
        }
    }
    /**
     * The Thumb class represents a thumbs-up/thumbs-down control for player reputation in a game.
     */
    class Thumb_Template {
        page: CorePage | null;
        div_id: string | null;
        div: HTMLElement | null;
        value: number;
        target_player: BGA.ID | null;
        staticControl: boolean;
        bForceThumbDown: boolean;
        thumbdownDlg: PopinDialog | null;
        /**
         * Initializes the Thumb control.
         * @param page - The game GUI page.
         * @param div_id - The ID of the div element where the control will be placed.
         * @param target_player - The target player for the thumb control.
         * @param value - The initial value of the thumb control (as a string).
         */
        create(page: CorePage, div_id: string, target_player: BGA.ID, value: BGA.ID): void;
        updateControl(): void;
        onCancelOpinion(event: Event): void;
        onGiveThumbUp(e: Event): void;
        onGiveThumbDown(t: Event): void;
        onGiveThumbDownStep2(t: Event): void;
        onGiveThumbDownStep3(t: Event): void;
        onGiveThumbDownFinal(): void;
    }
    let Thumb: DojoJS.DojoClass<Thumb_Template, []>;
    export = Thumb;
    global {
        namespace BGA {
            type Thumb = typeof Thumb;
            interface EBG {
                thumb: Thumb;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/core/sitecore" {
    import dojo = require("dojo");
    import "dojo/has";
    import "ebg/core/core";
    import "ebg/core/soundManager";
    import "dijit/form/Select";
    import "dijit/TooltipDialog";
    import "dojox/dtl/filter/htmlstrings";
    import "ebg/gamenotif";
    import "ebg/chatinput";
    import "ebg/thumb";
    global {
        namespace BGA {
            interface SiteCorePlayerRating {
                table?: BGA.ID | null;
                room_id?: string | null;
                media?: string | null;
                rating: BGA.ID | null;
                issue: string | null;
                text: string | null;
            }
            interface AjaxActions {
                "/player/player/pilink.html": {};
                "/table/table/quitgame.html": {
                    table: BGA.ID;
                    neutralized?: boolean;
                    s: "table_quitgame" | "table_quitdlg" | "gameui_neutralized";
                };
                "/web/scripterror": {
                    log: string;
                };
                "/community/community/quitGroup.html": {
                    id: BGA.ID;
                };
                "/player/profile/setNotificationPreference.html": {
                    type: "notifyGeneralChat";
                    value: 0 | 1;
                };
                "/table/table/chatHistory.html": {
                    _successargs: [
                        {
                            type: BGA.ChannelInfos["type"];
                            id: number;
                            status?: 'underage' | 'admin' | 'newchat' | 'newchattoconfirm' | string;
                            history: BGA.ChatNotifArgs[];
                        }
                    ];
                    type: BGA.ChannelInfos["type"];
                    id: BGA.ID;
                    before: number | null;
                };
                "/table/table/perfs.html": {
                    perfs: string;
                };
                "/table/table/markTutorialAsSeen.html": {
                    id: number;
                };
                "/table/table/chatack.html": {
                    player?: BGA.ID;
                    table?: BGA.ID;
                    list: string;
                    bUnsub?: boolean;
                };
                "/lobby/lobby/getPlayerWorldRanking.html": {
                    game: string;
                    isArena: true;
                };
                "/message/board/markread.html": {
                    id: BGA.ID;
                };
                "/message/board/markreads.html": {
                    ids: string;
                };
                "/table/table/debugPing.html": {
                    bgaversion: string;
                };
                "/table/table/rateGame.html": SiteCorePlayerRating;
                "/videochat/videochat/rateChat.html": SiteCorePlayerRating;
                "/support/support/rateSupport.html": SiteCorePlayerRating;
                "/videochat/videochat/recordStat.html": {
                    player: BGA.ID;
                    room: BGA.RoomId;
                    startStop: "start" | "stop";
                    media: "video" | "audio";
                };
            }
            interface SiteCoreMenuLabelMappings {
                preferences: "welcome";
                playernotif: "welcome";
                welcomestudio: "welcome";
                start: "welcome";
                legal: "welcome";
                message: "welcome";
                gameinprogress: "welcome";
                table: "lobby";
                lobby: "gamelobby";
                meetinglobby: "gamelobby";
                availableplayers: "gamelobby";
                createtable: "gamelobby";
                newtable: "gamelobby";
                gamereview: "gamelobby";
                gamelobby: "gamelobby";
                gamelobbyauto: "gamelobby";
                tournament: "gamelobby";
                newtournament: "gamelobby";
                tournamentlist: "gamelobby";
                gamepanel: "gamelist";
                games: "gamelist";
                player: "community";
                playerstat: "community";
                group: "community";
                newgroup: "community";
                community: "community";
                report: "community";
                newreport: "community";
                moderated: "community";
                translation: "community";
                translationhq: "community";
                map: "community";
                grouplist: "community";
                contribute: "community";
                sponsorship: "community";
                moderator: "community";
                bug: "community";
                bugs: "community";
                faq: "community";
                gamepublishers: "community";
                team: "community";
                troubleshootmainsite: "community";
                sandbox: "community";
                penalty: "community";
                karmalimit: "community";
                club: "premium";
                premium: "premium";
                contact: "community";
                reviewer: "community";
                giftcodes: "premium";
                shop: "shop";
                shopsupport: "shopsupport";
                prestige: "competition";
                gameranking: "competition";
                award: "competition";
                gamestats: "competition";
                leaderboard: "competition";
                page: "doc";
                news: "headlines";
                controlpanel: "controlpanel";
                linkmoderation: "controlpanel";
                moderation: "controlpanel";
                studio: "controlpanel";
                studiogame: "controlpanel";
                administration: "controlpanel";
                banners: "controlpanel";
                projects: "projects";
                startwannaplay: "welcome";
                startsteps: "welcome";
                halloffame: "halloffame";
            }
            interface SiteCorePredefinedTextMessages {
                tbleave: "Sorry I will continue to play later.";
                goodmove: "Sorry I have an emergency: I'm back in few seconds...";
                gm: "Good move!";
                think: "I would like to think a little, thank you";
                stillthinkin: "Yeah, still there, just thinking.";
                stillthere: "Hey, are you still there?";
                gg: "Good Game!";
                glhf: "Good luck, have fun!";
                hf: "Have fun!";
                tftg: "Thanks for the game!";
            }
            /** Partial: This has been partially typed based on a subset of the BGA source code. */
            interface ChatWindowMetadata {
                status: ChannelInfos['start'];
                title: string;
                input: InstanceType<BGA.ChatInput>;
                subscription: null | ChannelInfos['channel'];
                notifymethod: ChannelInfos['notifymethod'];
                autoShowOnKeyPress: boolean;
                lastMsgTime: number;
                lastMsgAuthor: BGA.ID | null;
                is_writing_now: Record<string, number>;
                first_msg_timestamp?: number;
                autoCollapseAfterMessage?: boolean;
                predefinedMessages?: DijitJS.TooltipDialog;
                predefinedMessagesOpen?: boolean;
            }
            /** The interface used to represent the information of a channel. This generated by {@link SiteCore.extractChannelInfosFromNotif} from a {@link Notif} object. */
            interface ChannelInfos {
                /** The type of the channel. */
                type: 'table' | 'tablelog' | 'group' | 'privatechat' | 'general' | 'emergency' | "playtable";
                /** The unique identifier for the channel. This is 0 for channels without an identifier. */
                id: BGA.ID;
                /** The name of the game that this channel is on. */
                game_name?: string;
                /** The human readable label for the channel. For example, "Game Log", "Important notice", "General messages"... */
                label: string;
                /** The src url for the group avatar. */
                avatar_src?: string;
                /** If this is a group channel, this is the avatar for the group. */
                group_avatar?: string;
                /** If this is a group channel, this is the type of group. */
                group_type?: "group" | "tournament";
                /** If this is a private chat, this is the avatar for other player. */
                avatar?: string;
                /** Truncated url representing the representing the chat. */
                url: `/table?table=${number}` | string | '' | null | `player?id=${number}` | '#';
                /** The channel from the notification. */
                channel: `/table/t${number}` | `/group/g${number}` | `/player/p${number}` | `/chat/general` | `/general/emergency`;
                /** The DOM id that is/should be used for the specific channel. */
                window_id: `${ChannelInfos["type"]}_${number}` | 'general' | 'emergency';
                /** If true, the chat window created by this channel should subscribe to cometd notifications (based on {@link channel}) */
                subscription?: boolean;
                /** Determines where this notification should appear. Title is a banner at the top of the page, normal is a bubble above the chat window. */
                notifymethod?: 'title' | 'normal';
                /** If the channel window is not created, this defines it's CSS class when it is loaded. */
                start: 'normal' | 'collapsed' | 'expanded' | 'stacked';
                autoShowOnKeyPress?: boolean;
                subscribe?: boolean;
            }
            /** Partial: This has been partially typed based on a subset of the BGA source code. */
            interface ChatInputArgs {
                type: 'global' | 'table' | 'group' | 'player';
                id: BGA.ID;
                action: BGA.ChatAjaxURLs;
                doubleaction?: BGA.ChatAjaxURLs | "";
                label: string;
                param: {
                    to?: BGA.ID;
                    table?: BGA.ID;
                };
                channel: ChannelInfos['channel'] | null;
                avatar: string;
            }
            interface SplashNotifsToDisplay {
                id: BGA.ID;
                news_type: BGA.ID;
                args: Record<number, string>;
                base_img: string;
                addimg: string;
                trophy_name: string;
                game_name: string;
                jargs: {
                    championship_name: string;
                    tournament_name: string;
                    game_name?: string;
                    league_nbr: number;
                    alert?: string;
                    award_id_id: BGA.ID;
                };
                trophy_name_arg: string;
                trophy_descr: string;
                continuelbl: string;
                prestige: string;
                skiplbl: string;
                shadow_img: string;
                league_name: string;
                league_id: 0 | 1 | 2 | 3 | 4 | 5;
                arena_points_html: string;
                arena_bottom_infos: string;
                arenabarpcent: string;
            }
        }
    }
    interface SiteCore_Template extends InstanceType<typeof ebg.core.core> {
    }
    /** Partial: This has been partially typed based on a subset of the BGA source code. */
    class SiteCore_Template {
        /** The name of the game currently being played. This will always be the lowercase and spaceless version: 'yourgamename'. */
        game_name?: string;
        /** The component used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
        notifqueue: InstanceType<BGA.GameNotif> & {
            log_notification_name?: boolean;
        };
        /** Represents if the devices is a touch device. This is true if this devices has an 'ontouchstart' event on the window, or the navigator has a positive 'maxTouchPoints' value. */
        isTouchDevice?: boolean;
        /**
         * The id of the player using the current client. The player may not be playing the game, but instead a spectator! This is null only when accessing from within the constructor.
         * @example if (notif.args.player_id == this.player_id) { ... }
         */
        player_id?: BGA.ID | null;
        current_player_id?: number;
        /**
         * If the current player is a spectator. Note: If you want to hide an element from spectators, you should use CSS 'spectatorMode' class. This property is included on sitecore because it is used for a few checks like with rtc, but is not set unless this object is also a {@link BGA.Gamegui} object.
         * @example
         * if (this.isSpectator) {
         * 	this.player_color = 'ffffff';
         * } else {
         * 	this.player_color = gamedatas.players[this.player_id].color;
         * }
         */
        isSpectator?: boolean;
        /** The id for the current game's table. This is null only when accessing from within the constructor. This property is included on sitecore because it is used for a few checks like with rtc, but is not set unless this object is also a {@link BGA.Gamegui} object. */
        table_id?: BGA.ID | null;
        /**
         * Shows a message in a big rectangular area on the top of the screen of the current player, and it disappears after few seconds (also it will be in the log in some cases).
         * Important: the normal way to inform players about the progression of the game is the game log. The "showMessage" is intrusive and should not be used often.
         *
         * Override this method to customize the message display, usually only used for handling specific custom messages.
         * @param message The string to display. It should be translated.
         * @param type The type of message to display. If set to "info", the message will be an informative message on a white background. If set to "error", the message will be an error message on a red background and it will be added to log. If set to "only_to_log", the message will be added to the game log but will not popup at the top of the screen. If set to custom string, it will be transparent, to use custom type define "head_xxx" in css, where xxx is the type. For example if you want yellow warning, use "warning" as type and add this to css: `.head_warning { background-color: #e6c66e; }`
         * @example this.showMessage('This is a message', 'info');
         * @example
         * // Show message could be used on the client side to prevent user wrong moves before it is send to server. Example from 'battleship':
         * onGrid: function(event) {
         * 	if (checkIfPlayerTriesToFireOnThemselves(event)) {
         * 		this.showMessage(_('This is your own board silly!'), 'error');
         * 		return;
         * 	}
         * 	...
         * },
         * @example
         * // This is an override example, presented by anewcar on discord.
         * showMessage(msg, type) {
         * 	if (type == "error" && msg && msg.includes("!!!club!!!")) {
         * 		msg = msg.replace("!!!club!!!", this.getTokenDiv("club"));
         * 		//return; // suppress red banner and gamelog message
         * 	}
         * 	this.inherited(arguments);
         * },
         */
        showMessage(message: string, type: 'info' | 'error' | 'only_to_log' | string): void;
        /** Internal. An internal count to track the number of ajax calls made. */
        ajaxcall_running: number;
        /** Internal. The current active menu label type. This is updated by using that {@link changeActiveMenuItem} function. This is used to remember the previous pick for cleanup before changing. */
        active_menu_label: BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings] | '';
        /** Internal. Counter used by {@link showMessage} function to create a unique identifier for the DOM element. */
        next_headmsg_id: number;
        /** Internal. If CometD (web messaging service) has been set up. */
        cometd_is_connected: boolean;
        /** Internal. Once {@link unload} is called, this is set to true, and used to help tear everything down without issues. */
        page_is_unloading: boolean;
        /** Internal. @deprecated This is not used within the main code file anymore. */
        cometd_first_connect: boolean;
        /** Internal. The list of cometd subscriptions managed by {@link subscribeCometdChannel} and {@link unsubscribeCometdChannel}. The key is the comet id used for emits, and the number is the amount of subscriptions to that id. */
        cometd_subscriptions: Record<string, number>;
        /** Internal. True when a timeout is set to help with scripting errors. */
        reportErrorTimeout: boolean;
        /** Internal. Counter representing the id of the next log statement. This is used to create a unique DOM id for callback events when expanding log statements. */
        next_log_id: number;
        /** Internal. A record of the chat bar windows, stored by their element id. */
        chatbarWindows: Record<BGA.ChannelInfos["window_id"], BGA.ChatWindowMetadata>;
        /** Internal. The js template for a chatwindow. Note that this is left as a string literal for convenience but may have been changed. */
        jstpl_chatwindow: string;
        /** Internal. This is set by the html scripts depending on the webpage type. */
        dockedChat?: boolean;
        /** Internal. */
        dockedChatInitialized: boolean;
        /** Internal. */
        groupToCometdSubs: Record<string, `/group/g${number}`>;
        /** Internal. */
        window_visibility: 'visible' | 'hidden';
        /** Internal. Translated string representing the button to send the user to the audio/video call feature. */
        premiumMsgAudioVideo: string | null;
        /** Internal. List of bad words that should be filtered.*/
        badWordList: readonly ["youporn", "redtube", "pornotube", "pornhub", "xtube", "a-hole", "dumb", "fool", "imbecile", "nutcase", "dipstick", "lunatic", "weirdo", "dork", "dope", "dimwit", "half-wit", "oaf", "bimbo", "jerk", "numskull", "numbskull", "goof", "suck", "moron", "morons", "idiot", "idi0t", "rape", "rapist", "hitler", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck ", "cocksucked ", "cocksucker", "cocksucking", "cocksucks ", "cocksuka", "cocksukka", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick ", "cuntlicker ", "cuntlicking ", "cunts", "cyalis", "cyberfuc", "cyberfuck ", "cyberfucked ", "cyberfucker", "cyberfuckers", "cyberfucking ", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates ", "ejaculating ", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck ", "fingerfucked ", "fingerfucker ", "fingerfuckers", "fingerfucking ", "fingerfucks ", "fistfuck", "fistfucked ", "fistfucker ", "fistfuckers ", "fistfucking ", "fistfuckings ", "fistfucks ", "flange", "fook", "fooker", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckings", "fuckingshitmotherfucker", "fuckme ", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged ", "gangbangs ", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex ", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off ", "jackoff", "jap", "jerk-off ", "jism", "jiz ", "jizm ", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lmfao", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked ", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking ", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers ", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim ", "orgasims ", "orgasm", "orgasms ", "p0rn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses ", "pissflaps", "pissin ", "pissing", "pissoff ", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks ", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys ", "rectum", "retards", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters ", "shitting", "shittings", "shitty ", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "enculé", "baiser", "nique", "niquer", "salope", "pute", "fuck", "f*ck", "f**k", "noob"];
        /** Internal. */
        tutorialHighlightedQueue: {
            id: string;
            text: string;
            optclass: string;
        }[];
        /** Internal. The amount of time in seconds that the user has been inactive on this page. Once this reaches 2 minutes, a message will popup as an infoDialog. */
        browser_inactivity_time: number;
        /** Internal. If {@link browser_inactivity_time} has reached 2 minutes and a message has been displayed. */
        bInactiveBrowser: boolean;
        /** Internal. @deprecated This is not used within the main code file anymore. */
        red_thumbs_given: {};
        /** Internal. @deprecated This is not used within the main code file anymore. */
        red_thumbs_taken: {};
        /** Internal. If truthy, this represents the detached chat for the page. */
        chatDetached?: false | {
            type: 'table' | 'player' | 'chat' | 'general' | 'group' | null;
            id: number;
            chatname: string;
        };
        /** Internal. Set to true when there is currently a detached chat on the page. */
        bChatDetached?: boolean;
        /** Internal. Record of non translated quick chat messages. This is fully listed for convenience, but may not represent updated values. */
        predefinedTextMessages?: BGA.SiteCorePredefinedTextMessages & Record<string, string>;
        /** Internal. Inverse lookup for the {@link predefinedTextMessages} */
        predefinedTextMessages_untranslated?: {
            [P in keyof BGA.SiteCorePredefinedTextMessages as BGA.SiteCorePredefinedTextMessages[P]]: P;
        } & Record<string, string>;
        /** Internal. The translated version of the {@link predefinedTextMessages} */
        predefinedTextMessages_target_translation?: Record<keyof BGA.SiteCorePredefinedTextMessages, string>;
        /** Internal. The difference between new Data and 'servivetime'.innerHTML in minutes. This is always a positive number. */
        timezoneDelta?: number;
        splashNotifToDisplay?: BGA.SplashNotifsToDisplay[];
        splashNotifRead?: Record<string, any>;
        /** Internal. Partial: This has been partially typed based on a subset of the BGA source code. */
        bgaUniversalModals?: any;
        /** Internal. Partial: This has been partially typed based on a subset of the BGA source code. */
        bgaToastHolder?: any;
        /** Internal. If 'show', scripting errors passed to {@link onScriptError} will be displayed in a red message on the top part of the bage for 6 seconds. */
        reportJsError?: boolean | 'show';
        /** Internal. WIP */
        discussblock?: boolean;
        /** Internal. WIP */
        autoChatWhilePressingKey?: DijitJS.TooltipDialog;
        /** Internal. WIP */
        groupList?: (1 | null)[];
        /** Internal. WIP */
        allGroupList?: any;
        /** Internal. WIP */
        allLanguagesList?: any;
        /** Internal. WIP */
        pma?: any;
        /** Internal. WIP */
        rtc_room?: any;
        /** Internal. WIP */
        domain?: string;
        /** Internal. The cometd_service to be used with the gamenotif. See {@link BGA.GameNotif} for more information. */
        cometd_service?: "socketio" | string;
        /** Internal. The socket used for this game. This looks like a Socket.IO type, but not work npm this type that will never be used in a game. */
        socket?: socket.IO.Socket;
        /** Internal. Represents if a video/audio chat is in progress */
        mediaChatRating?: boolean;
        /** Internal. Used with {@link displayRatingContent}. */
        /** Internal. WIP */
        rating_step1?: InstanceType<BGA.PopinDialog>;
        /** Internal. WIP */
        rating_step2?: InstanceType<BGA.PopinDialog>;
        /** Internal. WIP */
        rating_step3?: InstanceType<BGA.PopinDialog>;
        /** Internal. WIP */
        rating_step4?: InstanceType<BGA.PopinDialog>;
        /** Internal. WIP */
        playerRating?: BGA.SiteCorePlayerRating;
        /** Internal. WIP */
        gamecanapprove?: boolean;
        /** Internal. WIP */
        gameisalpha?: boolean;
        /** Internal. WIP */
        hideSoundControlsTimer?: number;
        game_group?: string;
        displaySoundControlsTimer?: number;
        tutorial?: Record<number, number>;
        metasite_tutorial?: Record<number, number>;
        bHighlightPopinTimeoutInProgress?: boolean;
        highlightFadeInInProgress?: boolean;
        currentTutorialDialog?: DijitJS.TooltipDialog | null;
        current_hightlighted_additional_class?: string;
        constructor();
        /** Internal. Initializes functionality and fields related to {@link BGA.SiteCore}, such as volume listeners and inactivity timers. This should be called manually by subclasses during there initializer functions (i.e, {@link MainSite.create} and {@link BGA.Gamegui.completesetup}). */
        init_core(): void;
        /** Internal. Sets the {@link page_is_unloading} property to true and calls {@link recordMediaStats} with `'stop'`. This is triggered by {@link DojoJS._base.unload}. */
        unload(): void;
        /** Internal. Sets the 'svelte/index' modules menu states page loading status. This is set to true if there are any {@link ajaxcall_running}. */
        updateAjaxCallStatus(): void;
        /** Internal. Sets the active menu label and page name based on the key given. */
        changeActiveMenuItem(key: ""): "";
        changeActiveMenuItem<T extends BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings]>(key: T): T;
        /** Internal. If the current cometd_service is 'socketio', then event is added to the socket using `.emit("join")` and keyed into the {@link cometd_subscriptions}. */
        subscribeCometdChannel<T extends string>(event: T, _1?: any, _2?: any): T | void;
        /** Internal. If the current cometd_service is 'socketio', then the events are added to the socket using `.emit("join")` and keyed into the {@link cometd_subscriptions}. */
        subscribeCometdChannels<const T extends Record<string, string>>(events: T, _1?: any, _2?: any): T | {};
        /** Internal. Unsubscribes a single listener to the given event. If there are no more listeners for that event, then the listener is removed from the socket using `.emit("leave")`. */
        unsubscribeCometdChannel(event: string): void;
        /** Internal. For all keys in {@link cometd_subscriptions}, the event will be rejoined if needed using `.emit("join"). */
        reconnectAllSubscriptions(): void;
        /** Internal. Callback for when the socket io connection changes. This updates the connect status and posts notifications if needed. */
        onSocketIoConnectionStatusChanged(status: 'connect' | 'connect_error' | 'connect_timeout' | 'reconnect' | 'reconnect_failed' | 'reconnect_attempt' | string, error?: string): void;
        /** Internal. A noop placeholder. */
        onFirstConnectedToComet(): void;
        /** Internal. Preforms an {@link ajaxcall} for leaving a table and shows a confirmation popin if necessary (depending on the game's state). */
        leaveTable(table_id: BGA.ID, success_callback: () => void): void;
        /** Internal. Increases the logs element max height by 600px. */
        onSeeMoreLogs(event: Event): void;
        /** Internal. A noop placeholder for when {@link onSeeMoreLogs} is called. */
        onIncreaseContentHeight(heightIncrease: number): void;
        /** Internal. Assuming the pase is not currently unloading, this will print the error, url, and line of a script error to the console and show a message in red on the page labeled `Javascript error: ...`. This is directly hooked into the window.onerror property and called manually within a few catch statements. */
        onScriptError(error: ErrorEvent | string | Event, url: string, line?: number | string): void;
        /** Internal. Initializes the docked chat. This uses {@link jstpl_chatwindow} to create the visible DOM element. */
        initChatDockedSystem(): void;
        /** Internal. Returns a {@link ChannelInfos} object containting channel information of a {@link BGA.Notif}. Expects a ChatNotif, and will return null if the {@link BGA.Notif.channelorig} does not match as {@link ChannelInfos.channel} */
        extractChannelInfosFromNotif(notif: BGA.ChatNotif): BGA.ChannelInfos | null;
        /** Internal. Returns a {@link ChatNotifArgs} with extra information about creating a chat message window. */
        getChatInputArgs(channel: BGA.ChannelInfos): BGA.ChatInputArgs | null;
        /** Internal. Passed to the {@link notifqueue}'s {@link GameNotif.onPlaceLogOnChannel}, used for logging messages onto a channel (chat window + extra). */
        onPlaceLogOnChannel(chatnotif: BGA.ChatNotif): boolean;
        /** Internal. Updates the writing bubble status on the given chat window. */
        onUpdateIsWritingStatus(window_id: BGA.ChannelInfos['window_id']): void;
        /**
         * Internal. If the {@link dockedChatInitialized} is false or the window matching the channel infos exists, this will return false. Otherwise, the DOM element matching the channel infos will be created.
         * @param channel The channel information to create the chat bar window for.
         * @param subscribe Overrides the {@link ChannelInfos.subscribe} value.
         * @returns True if the chat bar window was created, false otherwise.
         */
        createChatBarWindow(channel: BGA.ChannelInfos, subscribe?: boolean): boolean;
        /** Internal. Button Event. Removes the 'startchat_toconfirm' class from the chat window corresponding to the id of the current target. */
        onStartChatAccept(event: Event): void;
        /** Internal. Button Event. Blocks and closes the chat window corresponding to the id of the current target. */
        onStartChatBlock(event: Event): void;
        /** Internal. Toggle Button Event. Updates preference for if the general notifications should be ignored (hidden + no notifications). */
        onChangeStopNotifGeneralBox(event: Event): void;
        /** Internal. Button Event. Toggles preference for if the general notifications should be ignored. Directly calls {@link onChangeStopNotifGeneralBox} after changing. */
        onChangeStopNotifGeneralLabel(event: Event): void;
        /** Internal. Checks if launching audio/video is currently on a cooldown (max 120s) due to entering and leaving a chat. This uses {@link sessionStorage} to store the state of this cooldown (timeToWaitNextAV, AVAttemptNumber, lastAVAttemptTimestamp). @see setAVFrequencyLimitation */
        checkAVFrequencyLimitation(): boolean;
        /** Internal. Increments the attempt account and resets the timeout based on attempts (10s per attempt, max 60s). This uses {@link sessionStorage} to store the state of this cooldown (timeToWaitNextAV, AVAttemptNumber, lastAVAttemptTimestamp). @see checkAVFrequencyLimitation */
        setAVFrequencyLimitation(): void;
        /** Internal. Button Event. Toggles the audio chat feature, showing loading messages and making ajax calls. */
        onStartStopAudioChat(event: Event): void;
        /** Internal. Button Event. Toggles the video chat feature, showing loading messages and making ajax calls. */
        onStartStopVideoChat(event: Event): void;
        /**
         * Internal. Sets the new rtc mode for the current client.
         * @param table_id The table id to set the rtc mode for. If not null, this defines the room for the player and the DOM elements will be created if needed.
         * @param target_player_id The player id to set the rtc mode for. . If not null, this defines the room for the player and the DOM elements will be created if needed. Only valid if the table_id is null.
         * @param rtc_id The rtc id to set the mode to. If this is 0, the rtc will be disconnected and all other params are ignored.
         * @param connecting_player_id The player id to connect to.
         */
        setNewRTCMode(table_id: BGA.ID | null, target_player_id: BGA.ID | null, rtc_id: 0 | 1 | 2, connecting_player_id?: BGA.ID): void;
        /** Internal. Button Event. Calls {@link loadPreviousMessage} based on the current target's id. */
        onLoadPreviousMessages(event: Event): void;
        /** Internal. Gets the chatHistory for a table based on the arguments. The {@link ajaxcall} will callback to {@link onLoadPreviousMessages} */
        loadPreviousMessage(type: BGA.ChannelInfos["type"], id: BGA.ID): void;
        loadPreviousMessageCallback(...[args]: BGA.AjaxCallbackArgsMap['/table/table/chatHistory.html']): void;
        /** Internal. Chat Window Helper. */
        stackOrUnstackIfNeeded(): void;
        /** Internal. Chat Window Helper. */
        onUnstackChatWindow(event: Event): void;
        /** Internal. Chat Window Helper. */
        unstackChatWindow(window_id: BGA.ChannelInfos['window_id'], state?: BGA.ChannelInfos['start'] | 'automatic'): void;
        /** Internal. Chat Window Helper. */
        stackChatWindowsIfNeeded(state?: BGA.ChannelInfos['start']): void;
        /** Internal. Chat Window Helper. */
        stackOneChatWindow(): void;
        /** Internal. Chat Window Helper. */
        getNeededChatbarWidth(): number;
        /** Internal. Chat Window Helper. */
        adaptChatbarDock(): void;
        /** Internal. Chat Window Helper. */
        countStackedWindows(): number;
        /** Internal. Chat Window Helper. */
        closeChatWindow(window_id: BGA.ChannelInfos['window_id']): void;
        /** Internal. Chat Window Helper. */
        onCloseChatWindow(event: Event): void;
        /** Internal. Chat Window Helper. */
        onCollapseChatWindow(event: Event): void | true;
        /** Internal. Chat Window Helper. */
        collapseChatWindow(window_id: BGA.ChannelInfos['window_id'], checkBottom?: any): void;
        /** Internal. Chat Window Helper. */
        onExpandChatWindow(event: Event): void;
        /** Internal. Chat Window Helper. */
        onCollapseAllChatWindow(event: Event): void;
        /** Internal. Chat Window Helper. */
        updateChatBarStatus(): void;
        /** Internal. Chat Window Helper. */
        expandChatWindow(window_id: BGA.ChannelInfos['window_id'], autoCollapseAfterMessage?: boolean): void;
        /** Internal. Chat Window Helper. */
        makeSureChatBarIsOnTop(window_id: BGA.ChannelInfos['window_id']): void;
        /** Internal. Chat Window Helper. */
        makeSureChatBarIsOnBottom(window_id: BGA.ChannelInfos['window_id']): void;
        /** Internal. Chat Window Helper. */
        onScrollDown(event: Event): void;
        /** Internal. Chat Window Helper. */
        onToggleStackMenu(event: Event): void;
        /** Internal. Chat Window Helper. */
        onCallbackBeforeChat(args: any & {
            table?: number;
        }, channel_url: string): boolean;
        /** Internal. Chat Window Helper. */
        isBadWorkInChat(text: string | null): boolean;
        /** Internal. Chat Window Helper. */
        onCallbackAfterChat(_1?: any): void;
        /** Internal. Chat Window Helper. */
        callbackAfterChatError(args: {
            table?: number;
        }): void;
        /** Internal. Chat Window Helper. */
        onDockedChatFocus(event: Event): void;
        /** Internal. Chat Window Helper. */
        onDockedChatInputKey(event: KeyboardEvent): void;
        /** Internal. Chat Window Helper. */
        onShowPredefined(event: Event): void;
        /** Internal. Chat Window Helper. */
        onInsertPredefinedMessage(event: Event): void;
        /** Internal. Chat Window Helper. */
        onInsertPredefinedTextMessage(event: Event): void;
        /** Internal. Sets the given parameters with their matching property (if defined). */
        setGroupList(groupList: SiteCore_Template['groupList'], allGroupList?: SiteCore_Template['allGroupList'], red_thumbs_given?: SiteCore_Template['red_thumbs_given'], red_thumbs_taken?: SiteCore_Template['red_thumbs_taken']): void;
        /** Internal. Updates the {@link allLanguagesList} property with the given value. */
        setLanguagesList(allLanguagesList: SiteCore_Template['allLanguagesList']): void;
        /** Internal. Updates the {@link pma} property with the given value. */
        setPma(pma: SiteCore_Template['pma']): void;
        /** Internal. Updates the {@link rtc_mode} and {@link rtc_room} property with the given values. */
        setRtcMode(rtc_mode: SiteCore_Template['rtc_mode'], rtc_room: SiteCore_Template['rtc_room']): void;
        /** Internal. WIP */
        takeIntoAccountAndroidIosRequestDesktopWebsite(e: Document): void;
        /** Internal. WIP */
        traceLoadingPerformances(): void;
        /** Returns the current player id. This returns the global {@link current_player_id} if defined, and {@link Gamegui.player_id} otherwise. */
        getCurrentPlayerId(): BGA.ID | undefined;
        /** Internal. WIP */
        tutorialShowOnce(e: number, t?: boolean): boolean;
        highligthElementwaitForPopinToClose(): void;
        highlightElementTutorial(id: string, text: string, optClass?: string): void;
        onElementTutorialNext(t?: Event): void;
        websiteWindowVisibilityChange(e?: {
            type: string;
        }): void;
        ackUnreadMessage(t: BGA.ChannelInfos["window_id"], i?: 'unsub' | string): void;
        ackMessagesWithPlayer(e: BGA.ID, t: string[]): void;
        ackMessagesOnTable(table: BGA.ID, list: string[], unsub: boolean): void;
        onAckMsg(t: BGA.Notif): void;
        initMonitoringWindowVisibilityChange(): void;
        playingHoursToLocal(e: string, t?: false): string;
        playingHoursToLocal(e: string, t: true): string | {
            start_hour: string;
            end_hour: string;
        };
        showSplashedPlayerNotifications(t: any): void;
        displayNextSplashNotif(): void;
        onNewsRead(t: string): void;
        onDisplayNextSplashNotif(t: Event): void;
        onSkipAllSplashNotifs(t: Event): void;
        markSplashNotifAsRead(t: BGA.ID, i: boolean): void;
        inactivityTimerIncrement(): void;
        resetInactivityTimer(): void;
        onForceBrowserReload(t: BGA.Notif): void;
        doForceBrowserReload(e?: boolean): void;
        onDebugPing(): void;
        onNewRequestToken(e: BGA.Notif): void;
        onDisplayDebugFunctions(e: Event): void;
        showDebugParamsPopin(e: string, t: any[]): void;
        triggerDebug(e: string, t: string[]): void;
        onMuteSound(t?: boolean): void;
        onSetSoundVolume(e?: boolean): void;
        onToggleSound(e: Event): void;
        onDisplaySoundControls(_: Event): void;
        displaySoundControls(_: Event): void;
        onHideSoundControls(_: Event): void;
        hideSoundControls(): void;
        onStickSoundControls(_: Event): void;
        onUnstickSoundControls(event: Event): void;
        onSoundVolumeControl(_: Event): void;
        displayRatingContent(t: 'video' | 'audio' | 'support' | 'game', i: this['playerRating']): void;
        sendRating(e: 'video' | 'audio' | 'support' | 'game'): void;
        onGameRatingEnter(e: Event): void;
        onVideoRatingEnter(e: Event): void;
        onAudioRatingEnter(e: Event): void;
        onSupportRatingEnter(e: Event): void;
        processRatingEnter(rating: BGA.ID, type: 'video' | 'audio' | 'support' | 'game'): void;
        onRatingLeave(t: Event): void;
        onVideoRatingClick(e: Event): void;
        onAudioRatingClick(e: Event): void;
        onGameRatingClick(e: Event): void;
        onSupportRatingClick(e: Event): void;
        completeRatingClick(e: Event, t: 'video' | 'audio' | 'support' | 'game'): void;
        showRatingDialog_step2(t: 'video' | 'audio' | 'support' | 'game'): void;
        onAudioRatingClickIssue(e: Event): void;
        onVideoRatingClickIssue(e: Event): void;
        onGameRatingClickIssue(e: Event): void;
        completeRatingClickIssue(e: Event, t: 'video' | 'audio' | 'support' | 'game'): void;
        showRatingDialog_step3(t: 'video' | 'audio' | 'support' | 'game'): void;
        showGameRatingDialog_step4(): void;
        recordMediaStats(e: BGA.ID, t: "start" | "stop"): void;
    }
    let SiteCore: DojoJS.DojoClass<{
        gamedatas?: BGA.Gamedatas | null;
        subscriptions: DojoJS.Handle[];
        tooltips: Record<string, DijitJS.Tooltip>;
        bHideTooltips: boolean;
        screenMinWidth: number;
        currentZoom: number;
        connections: {
            element: any;
            event: string;
            handle: DojoJS.Handle;
        }[];
        instantaneousMode: boolean | 0 | 1;
        webrtc: InstanceType<BGA.WebRTC> | null;
        webrtcmsg_ntf_handle: DojoJS.Handle | null;
        rtc_mode: 0 | 1 | 2;
        mediaConstraints: BGA.WebRTCMediaConstraints;
        gameMasculinePlayers: string[];
        gameFemininePlayers: string[];
        gameNeutralPlayers: string[];
        emoticons: {
            readonly ":)": "smile";
            readonly ":-)": "smile";
            readonly ":D": "bigsmile";
            readonly ":-D": "bigsmile";
            readonly ":(": "unsmile";
            readonly ":-(": "unsmile";
            readonly ";)": "blink";
            readonly ";-)": "blink";
            readonly ":/": "bad";
            readonly ":-/": "bad";
            readonly ":s": "bad";
            readonly ":-s": "bad";
            readonly ":P": "mischievous";
            readonly ":-P": "mischievous";
            readonly ":p": "mischievous";
            readonly ":-p": "mischievous";
            readonly ":$": "blushing";
            readonly ":-$": "blushing";
            readonly ":o": "surprised";
            readonly ":-o": "surprised";
            readonly ":O": "shocked";
            readonly ":-O": "shocked";
            readonly o_o: "shocked";
            readonly O_O: "shocked";
            readonly "8)": "sunglass";
            readonly "8-)": "sunglass";
        };
        defaultTooltipPosition: DijitJS.PlacePositions[];
        metasiteurl?: string;
        ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "iframe" | "get" | "post" | undefined): void;
        format_block(template: string, args: Record<string, any>): string;
        format_string(template: string, args: Record<string, any>): string;
        format_string_recursive(template: string, args: Record<string, any> & {
            i18n?: Record<string, any>;
            type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
            message?: string;
            text?: string;
        }): string;
        clienttranslate_string(text: string): string;
        translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
        register_subs(...handles: DojoJS.Handle[]): void;
        unsubscribe_all(): void;
        register_cometd_subs(...comet_ids: string[]): string | string[];
        showMessage(message: string, type: "info" | "error" | "only_to_log" | string): void;
        placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
        placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
        disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
        enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
        getComputedTranslateZ(element: Element): number;
        transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.
        /** Internal. Returns a {@link ChannelInfos} object containting channel information of a {@link BGA.Notif}. Expects a ChatNotif, and will return null if the {@link BGA.Notif.channelorig} does not match as {@link ChannelInfos.channel} */
        Animation>;
        slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        toRadians(angle: number): number;
        vector_rotate(vector: {
            x: number;
            y: number;
        }, angle: number): {
            x: number;
            y: number;
        };
        attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
        slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
        fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
        rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
        rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        getAbsRotationAngle(target: string | Element | null): number;
        addClassToClass<T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]): void;
        connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
        connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U, method: keyof any): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>, any>>(targetObject: T, event: U, method: M, dontFix?: boolean): void;
        disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
        disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U): void;
        connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
        connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
        connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
        connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M): void;
        addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
        addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
        disconnectAll(): void;
        setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
        incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        updateCounters(counters?: Partial<{
            [x: string]: {
                counter_value: BGA.ID;
                counter_name: string;
            };
        } | undefined>): void;
        getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
        addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        addTooltipHtml(target: string, html: string, delay?: number): void;
        addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
        removeTooltip(target: string): void;
        switchDisplayTooltips(displayType: 0 | 1): void;
        applyCommentMarkup(text: string): string;
        confirmationDialog<T = null>(message: string, yesHandler: (param: T) => any, noHandler?: ((param: T) => any) | undefined, param?: T | undefined): void;
        warningDialog(message: string, callback: () => any): void;
        infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
        multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
        askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
        displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
        showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
        showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
        getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
        getKarmaLabel(karma: number | string): {
            label: "Perfect" | string;
            css: "exceptional";
        } | {
            label: "Excellent" | string;
            css: "perfect";
        } | {
            label: "Very good" | string;
            css: "verygood";
        } | {
            label: "Good" | string;
            css: "good";
        } | {
            label: "Average" | string;
            css: "average";
        } | {
            label: "Not good" | string;
            css: "notgood";
        } | {
            label: "Bad" | string;
            css: "bad";
        } | {
            label: "Very bad" | string;
            css: "verybad";
        } | undefined;
        getObjectLength(obj: object): number;
        comet_subscriptions: string[];
        unload_in_progress: boolean;
        bCancelAllAjax: boolean;
        tooltipsInfos: Record<string, {
            hideOnHoverEvt: DojoJS.Handle | null;
        }>;
        mozScale: number;
        rotateToPosition: Record<string, number>;
        room: BGA.RoomId | null;
        already_accepted_room: BGA.RoomId | null;
        webpush: InstanceType<BGA.WebPush> | null;
        interface_min_width?: number;
        confirmationDialogUid?: number;
        confirmationDialogUid_called?: number;
        discussionTimeout?: Record<string, number>;
        showclick_circles_no?: number;
        number_of_tb_table_its_your_turn?: number;
        prevent_error_rentry?: number;
        transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
        onresizePlayerAwardsEvent?: DojoJS.Handle;
        gameinterface_zoomFactor?: number;
        ajaxpageload<Scope>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope, callback: DojoJS.HitchMethod<Scope, [data: any], any>): {
            new (): import("dojo/promise/Promise")<any>;
        };
        displayUserHttpError(error_code: string | number | null): void;
        cancelAjaxCall(): void;
        applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
        adaptScreenToMinWidth(min_width: number): void;
        adaptScreenToMinWidthWorker(): void;
        getObjPosition(obj: HTMLElement | string): {
            x: number;
            y: number;
        };
        doShowBubble(anchor: string, message: string, custom_class?: string): void;
        getGameNameDisplayed(text: string): string;
        formatReflexionTime(time: number): {
            string: string;
            mn: number;
            s: (string | number);
            h: number;
            positive: boolean;
        };
        strip_tags(e: string, t?: string): string;
        validURL(e: any): boolean;
        nl2br(e: any, t: any): string;
        htmlentities(e: string, t: any, i: any, n: any): string | false;
        html_entity_decode(e: any, t: any): string | false;
        get_html_translation_table(e: any, t: any): Record<string, string>;
        ucFirst(e: any): any;
        setupWebPush(): Promise<void>;
        refreshWebPushWorker(): void;
        getRTCTemplate(e: any, t: any, i: any): string;
        setupRTCEvents(t: string): void;
        getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
            mandatory: {
                minAspectRatio: number;
                maxAspectRatio: number;
                maxWidth: number;
                maxFrameRate: number;
            };
            optional: never[];
        };
        startRTC(): void;
        doStartRTC(): void;
        onGetUserMediaSuccess(): void;
        onGetUserMediaError(): void;
        onJoinRoom(t: any, i: any): void;
        onClickRTCVideoMax(t: Event): void;
        maximizeRTCVideo(t: any, i: any): void;
        onClickRTCVideoMin(t: any): void;
        onClickRTCVideoSize(t: any): void;
        onClickRTCVideoMic(t: any): void;
        onClickRTCVideoSpk(t: any): void;
        onClickRTCVideoCam(t: any): void;
        onLeaveRoom(t: any, i: any): void;
        onLeaveRoomImmediate(e: any): void;
        doLeaveRoom(e?: any): void;
        clearRTC(): void;
        ntf_webrtcmsg(e: any): void;
        addSmileyToText(e: string): string;
        getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
        makeClickableLinks(e: any, t: any): any;
        makeBgaLinksLocalLinks(e: any): any;
        ensureEbgObjectReinit(e: any): void;
        getRankClassFromElo(e: any): string;
        getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
        getRankClassFromEloUntranslated(e: any): "good" | "average" | "beginner" | "apprentice" | "strong" | "expert" | "master";
        eloToBarPercentage(e: any, t?: boolean): number;
        formatElo(e: string): number;
        formatEloDecimal(e: any): number;
        getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
        getArenaLabel(e: any, t?: any): string;
        insertParamIntoCurrentURL(e: any, t: any): void;
        playerawardsCollapsedAlignement(): void;
        playerawardCollapsedAlignement(t: any): void;
        arenaPointsDetails(e: any, t?: any): {
            league: 0 | 2 | 1 | 3 | 4 | 5;
            league_name: string;
            league_shortname: string;
            league_promotion_shortname: string;
            points: number;
            arelo: number;
        };
        arenaPointsHtml(t: {
            league_name: string;
            league: 0 | 1 | 2 | 3 | 4 | 5;
            arelo: number;
            points: number | null;
            league_promotion_shortname?: string | null;
        }): {
            bar_content: string;
            bottom_infos: string;
            bar_pcent: string;
            bar_pcent_number: string | number;
        };
        declaredClass: string;
        inherited<U>(args: IArguments): U;
        inherited<U>(args: IArguments, newArgs: any[]): U;
        inherited(args: IArguments, get: true): Function | void;
        inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
        inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
        __inherited: {
            <U>(args: IArguments): U;
            <U>(args: IArguments, newArgs: any[]): U;
            (args: IArguments, get: true): Function | void;
            <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
            <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
        };
        getInherited(args: IArguments): Function | void;
        getInherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments): DojoJS.Hitched<any, T, []>;
        isInstanceOf(cls: any): boolean;
    } & SiteCore_Template, []>;
    export = SiteCore;
    global {
        namespace BGA {
            type SiteCore = typeof SiteCore;
            interface EBG_CORE {
                sitecore: SiteCore;
            }
            interface EBG {
                core: EBG_CORE;
            }
        }
        var ebg: BGA.EBG;
        /**The main site object that is currently running. This is the same as the {@link gameui} object when on a game page. */
        var g_sitecore: InstanceType<BGA.SiteCore>;
        var mainsite: InstanceType<BGA.SiteCore> & {
            gotourl_forcereload: Function;
            disableNextHashChange: boolean;
            timezone: string;
            notifyOnGeneralChat: number;
            bUnderage: boolean;
        };
        /** A global variable caused by bad code in ebg/core/sitecore:changeActiveMenuItem. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var menu_label_mappings: BGA.SiteCoreMenuLabelMappings;
        /** A global variable caused by bad code in ebg/core/sitecore:createChatBarWindow. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var bDisplayPreview: boolean;
        /** A global variable caused by bad code in ebg/core/sitecore:stackChatWindowsIfNeeded. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var save_spaces_nbr: null;
        var splashedNotifications_overlay: undefined | string | Node;
    }
}
declare module "ebg/tableresults" {
    import "ebg/thumb";
    import "ebg/core/core";
    global {
        namespace BGA {
            interface AjaxActions {
                "/table/table/tableratingsupdate.html": {
                    _successargs: [TableResultsData];
                    id: BGA.ID;
                };
                "/table/table/loadStickyNote.html": {
                    _successargs: [
                        {
                            player: BGA.ID;
                            note: string;
                        }
                    ];
                    player: BGA.ID;
                };
                "/table/table/updateText.html": {
                    type: "stickynote";
                    id: BGA.ID;
                    text: string;
                };
            }
            interface TableResultsData {
                status: 'finished' | 'archive' | string;
                progression: number;
                result: {
                    endgame_reason: 'normal_end' | 'normal_concede_end' | 'neutralized_after_skipturn' | 'neutralized_after_skipturn_error' | string;
                    trophies?: Record<BGA.ID, Record<BGA.ID, TableResultTrophies>>;
                };
                tableinfos: {
                    id: BGA.ID;
                    result: {
                        ratings_update: {
                            players_current_ratings: Record<BGA.ID, {
                                elo: BGA.ID;
                            }>;
                            players_elo_rating_update: Record<BGA.ID, {
                                duels: any;
                                real_elo_delta: number;
                                global_modifiers: boolean;
                                elo_delta_adjust_desc: string;
                                new_elo_rating: number;
                            }>;
                        };
                        stats: {
                            table: Record<BGA.ID, {
                                id: BGA.ID;
                                valuelabel: string;
                                value: string;
                                type: "int" | "float" | "boolean";
                                unit: string;
                            }>;
                            player: Record<BGA.ID, {
                                id: BGA.ID;
                                valuelabel: string;
                                value: string;
                                type: "int" | "float" | "boolean";
                                unit: string;
                            }>;
                        };
                        time_duration: number;
                        is_solo: boolean;
                        table_level: number;
                        player: Record<BGA.ID, {
                            player_id: BGA.ID;
                            name: string;
                            gamerank: number;
                            score: number;
                        }>;
                    };
                    game_name: string;
                    game_status: string;
                };
                game_hide_ranking: boolean;
            }
            interface TableResultTrophies {
                id: BGA.ID;
            }
        }
    }
    class TableResults_Template {
        page: InstanceType<BGA.CorePage> | null;
        div: HTMLElement | null;
        jstpl_template: string;
        jstpl_score_entry: string;
        jstpl_trophy: string;
        jstpl_statistics: string;
        jstpl_table_stat: string;
        jstpl_playerstatheader: string;
        jstpl_playerstat: string;
        tableinfos: BGA.TableResultsData | null;
        pma: boolean;
        stats_div?: HTMLElement;
        playeropinion?: any;
        create(t: InstanceType<BGA.CorePage>, i: HTMLElement | string, n: HTMLElement | string, o: BGA.TableResultsData, a: boolean): void;
        destroy(): void;
        update(): void;
        onEditSticky(t: Event): void;
        updateStats(): void;
        insertTableStat(statename: string, value: string, unit?: string): void;
        onPublishResult(t: Event): void;
        addPlayerEloTooltipNew(e: string): void;
    }
    let TableResults: DojoJS.DojoClass<TableResults_Template, []>;
    export = TableResults;
    global {
        namespace BGA {
            type TableResults = typeof TableResults;
            interface EBG {
                tableresults: TableResults;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/core/gamegui" {
    import e = require("dojo");
    import "dijit/DialogUnderlay";
    import "dijit/TooltipDialog";
    import "ebg/core/sitecore";
    import "ebg/gamenotif";
    import "ebg/chatinput";
    import "dijit/Dialog";
    import "ebg/playerlocation";
    import "ebg/pageheader";
    import "ebg/draggable";
    import "ebg/tableresults";
    import "ebg/paymentbuttons";
    global {
        namespace BGA {
            interface UserPreference {
                /** The name of the preference, automatically translated. */
                name: string;
                /** Whether the preference requires a reload to take effect. If true, the interface will auto reload when changed. */
                needReload: boolean;
                /** If the preference is a generic preference that applies to all game pages. For example, "Display Tooltips" (200) is a generic preference. */
                generic?: boolean;
                /** The array (map) of values with additional parameters per value. This acts like an enum where the key is the value and the 'name' is the value name. */
                values: Record<BGA.ID, {
                    name: string;
                    cssPref?: string;
                    description?: string;
                }>;
                value: BGA.ID;
                default?: number;
            }
            interface UserPreferences {
                "200": {
                    name: "Display tooltips";
                    needReload: false;
                    generic: true;
                    values: [{
                        name: "Enabled";
                    }, {
                        name: "Disabled";
                    }];
                    value: 0;
                };
            }
            interface IntrinsicGameAjaxActions {
                showCursorClick: {
                    path: string;
                };
                startgame: {};
                wakeup: {
                    myturnack: true;
                    table: BGA.ID;
                };
                wakeupPlayers: {};
                aiNotPlaying: {
                    table: BGA.ID;
                };
                skipPlayersOutOfTime: {
                    _successargs: [
                        {
                            data: {
                                names: string[];
                                delay: number;
                            };
                        }
                    ];
                    warn?: boolean;
                };
                zombieBack: {};
                gamedatas: {};
                activeTutorial: {
                    active: 0 | 1;
                };
                seenTutorial: {
                    id: BGA.ID;
                };
                endLockScreen: {};
                onGameUserPreferenceChanged: {
                    id: BGA.ID;
                    value: BGA.ID;
                };
            }
            interface AjaxActions extends Type<{
                [K in keyof IntrinsicGameAjaxActions as `/${string}/${string}/${K}.html`]: IntrinsicGameAjaxActions[K];
            }> {
                "/table/table/checkNextMove.html": {
                    _successargs: [status: 'ok' | string];
                };
                "/table/table/concede.html?src=menu": {
                    table: BGA.ID;
                };
                "/table/table/concede.html?src=alt": {
                    table: BGA.ID;
                };
                "/table/table/concede.html?src=top": {
                    table: BGA.ID;
                };
                "/table/table/decide.html": {
                    type: 'none' | "abandon" | "switch_tb" | null;
                    decision: 0 | 1;
                    table: BGA.ID;
                };
                "/table/table/decide.html?src=menu": {
                    type: 'none' | "abandon" | "switch_tb" | null;
                    decision: 0 | 1;
                    table: BGA.ID;
                };
                "/archive/archive/fastRegistration.html": {
                    email: string;
                };
                "/table/table/expressGameStopTable.html": {
                    table: BGA.ID;
                };
                "/table/table/tableinfos.html": {
                    _successargs: [TableResultsData];
                    id: BGA.ID;
                    nosuggest: true;
                };
                "/playernotif/playernotif/getNotificationsToBeSplashDisplayed.html": {
                    _successargs: [Record<string, SplashNotifsToDisplay>];
                };
                "/table/table/createnew.html": {
                    game: BGA.ID;
                    rematch: BGA.ID;
                    src: "R";
                };
                "/table/table/wouldlikethink.html": {};
                "/archive/archive/rateTutorial.html": {
                    id: BGA.ID;
                    rating: BGA.ID;
                    move: number;
                };
                "/archive/archive/addArchiveComment.html": {
                    table: BGA.ID;
                    viewpoint: BGA.ID;
                    move: number;
                    text: string;
                    anchor: string | "archivecontrol_editmode_centercomment" | "page-title";
                    aftercomment: BGA.ID;
                    afteruid: BGA.ID | HexString;
                    continuemode: string;
                    displaymode: string;
                    pointers: string;
                };
                "/archive/archive/updateArchiveComment.html": {
                    comment_id: BGA.ID;
                    text: string;
                    anchor: string | "archivecontrol_editmode_centercomment" | "page-title";
                    continuemode?: string;
                    displaymode?: string;
                    pointers?: string;
                };
                "/archive/archive/deleteArchiveComment.html": {
                    id: BGA.ID;
                };
                "/archive/archive/publishTutorial.html": {
                    id: BGA.ID;
                    intro: "";
                    lang: BGA.LanguageCode;
                    viewpoint: BGA.ID;
                };
                "/table/table/debugSaveState.html": {
                    table: BGA.ID;
                    state: BGA.ID | string;
                };
                "/table/table/loadSaveState.html": {
                    table: BGA.ID;
                    state: BGA.ID | string;
                };
                "/table/table/loadBugReport.html": {
                    table: BGA.ID;
                    bugReportId: BGA.ID;
                };
                "/table/table/updateTurnBasedNotes.html": {
                    value: string;
                    table: BGA.ID;
                };
                "/table/table/thumbUpLink.html": {
                    id: BGA.ID;
                };
                "/table/table/changeGlobalPreference.html": {
                    id: BGA.ID;
                    value: string;
                };
                "/table/table/changePreference.html": {
                    id: BGA.ID;
                    value: number;
                    game: string;
                };
                "/gamepanel/gamepanel/getRanking.html": {
                    game: BGA.ID;
                    start: number;
                    mode: "arena" | "elo";
                };
                "/table/table/judgegivevictory.html": {
                    id: BGA.ID;
                    winner: BGA.ID;
                };
                "/gamepanel/gamepanel/getWikiHelp.html": {
                    gamename: string;
                    section: "help" | "tips";
                };
                "/table/table/quitgame.html?src=panel": {
                    table: BGA.ID;
                    neutralized: boolean;
                    s: "gameui_neutralized";
                };
            }
            interface TopicArgs {
                "lockInterface": [
                    {
                        status: "outgoing" | "queued" | "dispatched" | "updated" | "recorded";
                        uuid: string;
                        bIsTableMsg?: boolean;
                        type?: "player" | "table" | null;
                    }
                ];
            }
            interface AjaxAdditionalArgs {
                __action__?: string;
                __move_id__?: number;
                __player_id__?: BGA.ID;
                h?: HexString | undefined;
                testuser?: BGA.ID;
            }
        }
    }
    interface Gamegui_Template extends InstanceType<typeof ebg.core.sitecore> {
    }
    /**
     * The main class for a game interface. This should always define:
     * - How to setup user interface.
     * - Which actions on the page will generate calls to the server.
     * - What happens when you get a notification for a change from the server and how it will show in the browser.
     *
     * In a bit more detail, it should include the following methods and sections:
     * - `constructor`: here you can define global variables for your whole interface.
     * - `setup`: this method is called when the page is refreshed, and sets up the game interface.
     * - `onEnteringState`: this method is called when entering a new game state. You can use it to customize the view for each game state.
     * - `onLeavingState`: this method is called when leaving a game state.
     * - `onUpdateActionButtons`: called on state changes, in order to add action buttons to the status bar. Note: in a multipleactiveplayer state, it will be called when another player has become inactive.
     * - (utility methods): this is where you can define your utility methods.
     * - (player's actions): this is where you can write your handlers for player actions on the interface (example: click on an item).
     * - `setupNotifications`: this method associates notifications with notification handlers. For each game notification, you can trigger a javascript method to handle it and update the game interface.
     * - (notification handlers): this is where you define the notifications handlers associated with notifications in setupNotifications, above.
     *
     * All clients automatically load the Dojo framework, so all games can use the functions to do more coimplex things more easily. The BGA framework uses Dojo extensively. See {@link http://dojotoolkit.org/ | Dojo Javascript framework} for more information. In addition, the BGA framework defines a jQuery-like function $ that you can use to access the DOM. This function is available in all BGA pages and is the standard way to access the DOM in BGA. You can use getElementById but a longer to type and less handy as it does not do some checks.
     *
     * For performance reasons, when deploying a game the javascript code is minimized using {@link https://github.com/terser/terser | terser}. This minifier works with modern javascript syntax. From your project "Manage game" page, you can now test a minified version of your javascript on the studio (and revert to the original).
     *
     * Partial: This has been partially typed based on a subset of the BGA source code.
     *
     * Using the built-in dojo define method, you should usually define and initialize prototype variables using the constructor method; however, when using classes, any global variables should be added to the class as fields with initializers, like normal for typescript.
     * @example
     * // Dojo + Define
     * define(Gamegui, {
     * 	constructor(){
     * 		console.log('yourgamename constructor');
     * 		this.myGlobalValue = 0;
     * 	},
     * 	...
     * });
     *
     * // TS Class
     * class YourGameName extends Gamegui {
     * 	myGlobalValue = 0;
     * 	constructor(){
     * 		super();
     * 		console.log('yourgamename constructor');
     * 	}
     * 	...
     * }
    */
    class Gamegui_Template {
        /** The human readable name which should be displayed to the user. (Looks like it is already translated, but could wrong) */
        game_name_displayed: string;
        /** The channel for this game's table. This will always match `table/t${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
        channel: `/table/t${number}` | null;
        /** The channel for the current player. This will always match `player/p${private_channel_id}`. This is null only when accessing from within the constructor. */
        privatechannel: `/player/p${HexString}` | null;
        /** The channel for this game's table spectators. This will always match `table/ts${table_id}` where number is the id of the table. This is null only when accessing from within the constructor. */
        tablechannelSpectators: `/table/ts${number}` | null;
        /** Unmodified clone of the gamedatas gamestate. See {@link restoreServerGameState} for more information. This is null only when accessing from within the constructor. */
        last_server_state: BGA.IActiveGameState | null;
        /** Boolean indicating that the current game state is a client state, i.e. we have called {@link setClientState} and have not yet sent anything to the server. */
        on_client_state: boolean;
        /** How the log is currently layed out within the DOM. */
        log_mode: 'normal' | '2cols';
        /** The current status, almost entirely used for managing the interface lock. */
        interface_status: 'updated' | 'outgoing' | 'recorded' | 'queued' | 'dispatched';
        /** If the interface lock should lock the table or the player. */
        interface_locking_type: null | 'table' | 'player';
        /** True if an element with the id 'notifwindow_beacon' exits. Used for game setup. */
        isNotifWindow: boolean;
        /** When not null, this is a counter used to blink the current active player based on the 'wouldlikethink_button'. */
        lastWouldLikeThinkBlinking: number | null;
        /** Buy Link Id. The url for the buy link. */
        blinkid: string | null;
        /** The human readable target for the {@link blinkid}. */
        blinkdomain?: string;
        /** Boolean for if this game is currently in developermode. This is the game as checking if element id 'debug_output' exists. */
        developermode: boolean;
        /** If true, this is a sandbox game. Sandbox games are mostly non-scripted and act like a table top simulator rather than a traditional BGA game. */
        is_sandbox: boolean;
        /** The id for this game, mostly used for generating the table results and loading game statistics. */
        game_id?: number;
        /** If the current game that is being played is a coop game. This is different than if the game can be played coop. */
        is_coop?: boolean;
        /** If the current game that is being played is a solo game. This is different than if the game can be played solo. */
        is_solo?: boolean;
        /**
         * The user preferences for the specific client.
         * @example
         * // If display tooltips is Enabled
         * if (this.prefs[200].value == 0)
         * 	...
         */
        prefs?: Record<BGA.ID, BGA.UserPreference>;
        /** The description for tiebreakers as found in the gameinfos file. This is in english and is translated when needed by the {@link BGA.TableResults} component. */
        tiebreaker?: string;
        /** If defined and true, the table results will show the tie breaker scores as needed. Otherwise, no tiebreaker content is added. */
        tiebreaker_split?: boolean;
        /** If losers should not be ranked, as defined in the gameinfos file. If in the game, all losers are equal (no score to rank them or explicit in the rules that losers are not ranked between them), set this to true  The game end result will display 'Winner' for the 1st player and 'Loser' for all other players. Your can view core.core getRankString() (CoreCore) for more information. */
        losers_not_ranked?: boolean;
        /** Defines if this page represents a tutorial version of the game. */
        bTutorial?: boolean;
        /** The id for the display tooltips preference. */
        GAMEPREFERENCE_DISPLAYTOOLTIPS: 200;
        current_player_name?: string;
        /** Truthy if the game is in realtime. Note that having a distinct behavior in realtime and turn-based should be exceptional. */
        bRealtime?: boolean | 0 | 1;
        /**
         * A record of {@link Counter_Template} objects which show on the built-in player cards. The record key is the player id. This is initialized by the framework but manually needs to be updated when a player's score changes.
         *
         * These counters will always have the id `player_score_` + player_id.
         * @example
         * // Increase a player score (with a positive or negative number).
         * this.scoreCtrl[ player_id ].incValue( score_delta );
         * @example
         * // Set a player score to a specific value:
         * this.scoreCtrl[ player_id ].setValue( new_score );
         * @example
         * // Set a player score to a specific value with animation:
         * this.scoreCtrl[ player_id ].toValue( new_score );
         * @example
         * // Typical usage would be (that will process 'score' notification):
         * setupNotifications : function() {
         * 	...
         * 	dojo.subscribe('score', this, "notif_score");
         * },
         * notif_score: function(notif) {
         * 	this.scoreCtrl[notif.args.player_id].setValue(notif.args.player_score);
         * },
         */
        scoreCtrl: Record<BGA.ID, InstanceType<BGA.Counter>>;
        /** The html loaded into the 'game_play_area' element on completesetup. */
        original_game_area_html?: string;
        players_metadata?: Record<BGA.ID, BGA.PlayerMetadata>;
        /**
         * Called once as soon as the page is loaded and base fields have been defined. This method must set up the game user interface according to current game situation specified in parameters.
         * - When the game starts.
         * - When a player opens the game in the browser (or returns to the game after a refresh).
         * - When player does a server side undo.
         * @param gamedatas The data from the server that is used to initialize the game client. This is the same as `this.gamedatas`.
         * @example
         * setup(gamedatas: Gamedatas): void {
         * 	console.log( "Starting game setup", gamedatas );
         *
         * 	// Setting up player boards
         * 	for( var player_id in gamedatas.players )
         * 	{
         * 		var player = gamedatas.players[player_id];
         * 		// Setting up players boards if needed
         * 	}
         *
         * 	// Set up your game interface here, according to "gamedatas"
         *
         * 	// Setup game notifications to handle (see "setupNotifications" method below)
         * 	this.setupNotifications();
         * }
         */
        setup(gamedatas: BGA.Gamedatas, keep_existing_gamedatas_limited: boolean): void;
        /**
         * This method is called each time we enter a new game state. You can use this method to perform some user interface changes at this moment. To access state arguments passed via calling php arg* method use args?.args. Typically you would do something only for active player, using this.isCurrentPlayerActive() check. It is also called (for the current game state only) when doing a browser refresh (after the setup method is called).
         *
         * Warning: for multipleactiveplayer states: the active players are NOT active yet so you must use onUpdateActionButtons to perform the client side operation which depends on a player active/inactive status. If you are doing initialization of some structures which do not depend on the active player, you can just replace (this.isCurrentPlayerActive()) with (!this.isSpectator) for the main switch in that method.
         * @param stateName The name of the state we are entering.
         * @param args The arguments passed from the server for this state, or from this client if this is a client state.
         * @see {@link https://en.doc.boardgamearena.com/Your_game_state_machine:_states.inc.php#Difference_between_Single_active_and_Multi_active_states|Difference between Single active and Multi active states}
         * @example
         * onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void
         * {
         * 	console.log( 'Entering state: ' + stateName, args );
         * 	switch( stateName )
         * 	{
         * 	case 'myGameState':
         * 		// Show some HTML block at this game state
         * 		dojo.style( 'my_html_block_id', 'display', 'block' );
         * 		break;
         * 	case 'dummmy':
         * 		break;
         * 	}
         * }
         */
        onEnteringState(...[stateName, state]: BGA.GameStateTuple<['name', 'state']>): void;
        /**
         * This method is called each time we leave a game state. You can use this method to perform some user interface changes at this point (i.e. cleanup).
         * @param stateName The name of the state we are leaving.
         * @example
         * onLeavingState(stateName: GameStateName): void
         * {
         * 	console.log( 'Leaving state: ' + stateName );
         * 	switch( stateName )
         * 	{
         * 	case 'myGameState':
         * 		// Hide the HTML block we are displaying only during this game state
         * 		dojo.style( 'my_html_block_id', 'display', 'none' );
         * 		break;
         * 	case 'dummmy':
         * 		break;
         * 	}
         * }
         */
        onLeavingState(stateName: BGA.ActiveGameState["name"]): void;
        /**
         * In this method you, can manage "action buttons" that are displayed in the action status bar and highlight active UI elements. To access state arguments passed via calling php arg* method use args parameter. Note: args can be null! For game states and when you don't supply state args function - it is null. This method is called when the active or multiactive player changes. In a classic "activePlayer" state this method is called before the onEnteringState state. In multipleactiveplayer state it is a mess. The sequencing of calls depends on whether you get into that state from transitions OR from reloading the whole game (i.e. F5).
         * @param stateName The name of the state we are updating the button actions for.
         * @param args The arguments passed from the server for this state, or from this client if this is a client state.
         * @see {@link https://en.doc.boardgamearena.com/Your_game_state_machine:_states.inc.php#Difference_between_Single_active_and_Multi_active_states|Difference between Single active and Multi active states}
         * @example
         * onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
         * {
         * 	console.log( 'onUpdateActionButtons: ' + stateName, args );
         * 	if( this.isCurrentPlayerActive() )
         * 	{
         * 		switch( stateName )
         * 		{
         * 		case 'myGameState':
         * 			// Add 3 action buttons in the action status bar:
         * 			this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
         * 			this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
         * 			this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
         * 			break;
         * 		}
         * 	}
         * }
         */
        onUpdateActionButtons(...[stateName, args]: BGA.GameStateTuple<['name', 'args']>): void;
        /**
         * This method associates notifications with notification handlers. For each game notification, you can trigger a javascript method to handle it and update the game interface. This method should be manually invoked during the `setup` function.
         *
         * This method is overridden as need by the framework to prevent oddities in specific situation, like when viewing the game in {@link g_archive_mode}.
         *
         * Again, this function is not automatically called by the framework, but instead deleted in specific situations to avoid re-subscribing to notifications.
         * @example
         * setupNotifications()
         * {
         * 	console.log( 'notifications subscriptions setup' );
         *
         * 	// Example 1: standard notification handling
         * 	dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
         *
         * 	// Example 2: standard notification handling + tell the user interface to wait during 3 seconds after calling the method in order to let the players see what is happening in the game.
         * 	dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
         * 	this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
         * }
         */
        setupNotifications?: () => void;
        /**
         * Returns true if the player on whose browser the code is running is currently active (it's his turn to play). Note: see remarks above about usage of this function inside onEnteringState method.
         * @returns true if the player on whose browser the code is running is currently active (it's his turn to play).
         * @example if (this.isCurrentPlayerActive()) { ... }
         */
        isCurrentPlayerActive(): boolean;
        /**
         * Returns the id of the active player. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
         * @returns The id of the active player.
         */
        getActivePlayerId(): BGA.ID | null;
        /**
         * Returns the ids of the active players. Note: this function is only useful in multiple active player states. In single active player states, the active player is always the current player.
         * @returns The ids of the active players.
         */
        getActivePlayers(): BGA.ID[];
        /**
         * Checks if the player can do the specified action by taking into account:
         * - If the interface is locked it will return false and show message "An action is already in progress", unless nomessage set to true.
         * - If the player is not active it will return false and show message "This is not your turn", unless nomessage set to true.
         * - If action is not in list in possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
         * - Otherwise returns true.
         * @param action The action to check if the player can do.
         * @param nomessage (optional) If true, it will not show any error messages.
         * @returns true if the player can do the specified action.
         * @example
         * function onClickOnGameElement( evt )  {
         * 	if( this.checkAction( "my_action" ) ) {
         * 		// Do the action
         * 	}
         * }
         */
        checkAction(e: keyof BGA.GameStatePossibleActions, nomessage?: true): boolean;
        /**
         * Similar to `checkAction` but only checks if the action is a valid player action given the current state. This is particularly useful for multiplayer states when the player is not active in a 'player may like to change their mind' scenario. Unlike `checkAction`, this function does NOT take interface locking into account.
         * @param action The action to check if any player can do.
         * @returns true if any player can do the specified action.
         * @example
         * function onChangeMyMind( evt )  {
         * 	if( this.checkPossibleActions( "my_action" ) ) {
         * 		// Do the action
         * 	}
         * }
         */
        checkPossibleActions(action: keyof BGA.GameStatePossibleActions): boolean;
        /**
         * Checks if the interface is in lock state. This check can be used to block some other interactions which do not result in ajaxcall or if you want to suppress errors. Note: normally you only need to use `checkAction(...)`, this is for advanced cases.
         * @param nomessage (optional) If true, it will not show any error messages.
         * @returns true if the interface is in lock state.
         * @example
         * function onChangeMyMind( evt )  {
         * 	if( this.checkLock() ) {
         * 		// Do the action
         * 	}
         * }
         */
        checkLock(nomessage?: true): boolean;
        /**
         * Shows predefined user error that move is unauthorized now.
         * @example
         * onPet: function(event) {
         * 	if (checkPet(event)==false) {
         * 		this.showMoveUnauthorized();
         * 		return;
         * 	}
         * 	...
         * },
         */
        showMoveUnauthorized(): void;
        /**
         * Adds an action button to the main action status bar (or other places).
         * @param id The id of the created button, which should be unique in your HTML DOM document.
         * @param label The text of the button. Should be translatable (use _() function). Note: this can also be any html, such as "<img src='img.png'>", see example below on how to make image action buttons.
         * @param method The name of your method that must be triggered when the player clicks on this button (can be name of the method on game class or handler).
         * @param destination (optional) The id of the parent on where to add the button, ONLY use in rare cases if location is not action bar. Use null as value if you need to specify other arguments.
         * @param blinking (optional) If set to true, the button is going blink to catch player's attention. Please DO NOT abuse blinking button. If you need button to blink after some time passed add class 'blinking' to the button later.
         * @param color (optional) The color of the button. Could be blue (default), red, gray or none.
         * @example
         * this.addActionButton( 'giveCards_button', _('Give selected cards'), 'onGiveCards' );
         * @example
         * this.addActionButton( 'pass_button', _('Pass'), () => this.ajaxcallwrapper('pass') );
         * @example
         * // You should only use this method in your "onUpdateActionButtons" method. Usually, you use it like this:
         * onUpdateActionButtons: function( stateName, args ) {
         * 	if (this.isCurrentPlayerActive()) {
         * 		switch( stateName ) {
         * 		case 'giveCards':
         * 			this.addActionButton( 'giveCards_button', _('Give selected cards'), 'onGiveCards' );
         * 			this.addActionButton( 'pass_button', _('Pass'), () => this.ajaxcallwrapper('pass') );
         * 			break;
         * 		}
         * 	}
         * },
         * // In the example above, we are adding a "Give selected cards" button in the case we are on game state "giveCards". When player clicks on this button, it triggers our "onGiveCards" method.
         * @example
         * // Example using blinking red button:
         * this.addActionButton( 'button_confirm', _('Confirm?'), 'onConfirm', null, true, 'red');
         * @example
         * // If you want to call the handled with arguments, you can use arrow functions, like this:
         * this.addActionButton( 'commit_button', _('Confirm'), () => this.onConfirm(this.selectedCardId), null, false, 'red');
         */
        addActionButton(id: string, label: string, method: keyof this | DojoJS.BoundFunc<this, [GlobalEventHandlersEventMap['click']]>, destination?: string, blinking?: boolean, color?: 'blue' | 'red' | 'gray' | 'none'): void;
        /** Removes all buttons from the title bar. */
        removeActionButtons(): void;
        /**
         * Updates the current page title and turn description according to the game state arguments. If the current game state description `this.gamedatas.gamestate.descriptionmyturn` is modified before calling this function it allows to update the turn description without changing state. This will handle arguments substitutions properly.
         * Note: this functional also will calls `this.onUpdateActionButtons`, if you want different buttons then state defaults, use method in example to replace them, if it becomes too clumsy use client states (see above).
         * @example
         * onClickFavorTile: function( evt ) {
         * 	...
         * 	if ( ... ) {
         * 		this.gamedatas.gamestate.descriptionmyturn = _('Special action: ') + _('Advance 1 space on a Cult track');
         * 		this.updatePageTitle();
         * 		this.removeActionButtons();
         * 		this.addActionButton( ... );
         * 		...
         * 		return;
         * 	}
         * 	...
         * }
         */
        updatePageTitle(stateArgs?: BGA.IActiveGameState | null): void;
        /**
         * Disables the player panel for a given player. Usually, this is used to signal that this player passes, or will be inactive during a while. Note that the only effect of this is visual. There are no consequences on the behaviour of the panel itself.
         * @param player_id The id of the player to disable the panel for.
         */
        disablePlayerPanel(player_id: number): void;
        /**
         * Enables a player panel that has been {@link disablePlayerPanel | disabled} before.
         * @param player_id The id of the player to enable the panel for.
         */
        enablePlayerPanel(player_id: number): void;
        /**
         * Enables all player panels that have been {@link disablePlayerPanel | disabled} before.
         */
        enableAllPlayerPanels(): void;
        /**
         * Updates the player ordering in the player's panel to match the current player order. This is normally called by the framework, but you can call it yourself if you change `this.gamedatas.playerorder` from a notification. Also you can override this function to change defaults OR insert a non-player panel.
         */
        updatePlayerOrdering(): void;
        /**
         * Sets an image to not be preloaded in the game. This is particularly useful if for example you have 2 different themes for a game. To accelerate the loading of the game, you can specify to not preload images corresponding to the other theme.
         * @param image_file_name The name of the image file to not preload.
         * @example
         * this.dontPreloadImage( 'cards.png' );
         * @example
         * // By default, do not preload anything
         * this.dontPreloadImage( 'cards.png' );
         * this.dontPreloadImage( 'clan1.png' );
         * this.dontPreloadImage( 'clan2.png' );
         * this.dontPreloadImage( 'clan3.png' );
         * this.dontPreloadImage( 'clan4.png' );
         * this.dontPreloadImage( 'clan5.png' );
         * this.dontPreloadImage( 'clan6.png' );
         * this.dontPreloadImage( 'clan7.png' );
         * this.dontPreloadImage( 'clan8.png' );
         * this.dontPreloadImage( 'clan9.png' );
         * this.dontPreloadImage( 'clan10.png' );
         * var to_preload = [];
         * for( i in this.gamedatas.clans )
         * {
         * 	var clan_id = this.gamedatas.clans[i];
         * 	to_preload.push( 'clan'+clan_id+'.png' );
         * }
         *
         * this.ensureSpecificGameImageLoading( to_preload );
         */
        dontPreloadImage(image_file_name: string): void;
        /**
         * Ensures specific images are loaded. This is the opposite of {@link dontPreloadImage | dontPreloadImage} - it ensures specific images are loaded. Note: only makes sense if preload list is empty, otherwise everything is loaded anyway.
         * @param list The list of images to ensure are loaded.
         * @example
         * this.ensureSpecificGameImageLoading( to_preload );
         */
        ensureSpecificGameImageLoading(list: string[]): void;
        /** Disables the standard "move" sound or this move (so it can be replaced with a custom sound). This only disables the sound for the next move. */
        disableNextMoveSound(): void;
        /**
         * Changes the current client state without sending anything to the server. Client states is a way to simulate the state transition but without actually going to server. It is useful when you need to ask user multiple questions before you send things to server.
         * @param newState The new state to transition to.
         * @param args The arguments to pass to the new state.
         * @example
         * this.setClientState("client_playerPicksLocation", {
         * 	descriptionmyturn: _("${you} must select location"),
         * });
         * @see {@link https://en.doc.boardgamearena.com/BGA_Studio_Cookbook#Multi_Step_Interactions:_Select_Worker.2FPlace_Worker_-_Using_Client_States | Multi Step Interactions: Select Worker/Place Worker - Using Client States}
         */
        setClientState(newState: BGA.IActiveGameState['name'], args: BGA.IActiveGameState['args']): void;
        /** If you are in client state it will restore the current server state (cheap undo). */
        restoreServerGameState(): void;
        /** A function that can be overridden to manage some resizing on the client side when the browser window is resized. This function is also triggered at load time, so it can be used to adapt to the viewport size at the start of the game too. */
        onScreenWidthChange(): void;
        /** Returns "studio" for studio and "prod" for production environment (i.e. where games current runs). Only useful for debbugging hooks. Note: alpha server is also "prod" */
        getBgaEnvironment(): 'studio' | 'prod';
        /** Not officially documented! Forces all resize events to activate. */
        sendResizeEvent(): void;
        /** Not officially documented! Gets the html element for the replay log. */
        getReplayLogNode(): HTMLElement | undefined | null;
        onGameUserPreferenceChanged?: (pref_id: number, value: number) => void;
        /** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
        currentPlayerReflexionTime: {
            positive: boolean;
            mn: number;
            s: number;
        };
        /** Internal. @deprecated Use {@link CurrentStateArgs.reflexion | this.gamedatas.gamestate.reflexion} */
        activePlayerReflexionTime: {
            positive: boolean;
            mn: number;
            s: number;
        };
        /** Internal. The `setTimeout` used for updating the reflexion time. This is called every 100ms whenever a timer is running. */
        clock_timeout: number | null;
        /** Internal. @deprecated This has been joined with {@link clock_timeout}. */
        clock_opponent_timeout: null;
        /** Internal. Timout for automatically calling {@link sendWakeUpSignal}. See {@link sendWakeupInTenSeconds} for more information. */
        wakeup_timeout: number | null;
        /** Internal. @deprecated This is not used within the main code file anymore. */
        wakupchek_timeout: null;
        /** Internal. This is the user id that is appended as a ajax argument to replay from messages. */
        forceTestUser: BGA.ID | null;
        /** Internal. When about to switch to a private game state, this will be populated with the arguments for that state. Next time the game state is changed, this will be consumed. */
        next_private_args: BGA.ActiveGameState['args'];
        /** Internal. Counter for the index of archived log messages. Used to populating notifications that have passed any don't need to be processed like normal. */
        next_archive_index: number;
        /** Internal. When in archive mode, this is used to manage the state of the archive playback. */
        archive_playmode: 'stop' | 'goto' | 'nextlog' | 'nextturn' | 'play' | 'nextcomment';
        /** Internal. The move id that should be used when starting archive playback. */
        archive_gotomove: number | null;
        /** Internal. The previous active player, use for updating the archive playback correctly. */
        archive_previous_player: BGA.ID | null;
        /** Internal. Special UID counter used for archive messages. */
        archive_uuid: number;
        /** Internal. Used to manage archive comments. */
        archiveCommentNew: DijitJS.TooltipDialog | null;
        /** Internal. Used to manage archive comments. */
        archiveCommentNewAnchor: string | "archivecontrol_editmode_centercomment" | "page-title";
        /** Internal. Used to manage archive comments. */
        archiveCommentNo: number;
        /** Internal. Used to manage archive comments. */
        archiveCommentNbrFromStart: number;
        /** Internal. Used to manage archive comments. */
        archiveCommentLastDisplayedNo: BGA.ID;
        /** Internal. Used to manage archive comments. */
        archiveCommentLastDisplayedId: string | number;
        /** Internal. Used to manage archive comments. */
        archiveCommentMobile: {
            id: string | number;
            anchor: string | "archivecontrol_editmode_centercomment" | "page-title";
            bCenter: boolean;
            lastX: number;
            lastY: number;
            timeout?: number;
        };
        /** Internal. Used to manage archive comments. */
        archiveCommentPosition: string[];
        /** Internal. Used to manage archive comments. */
        bJumpToNextArchiveOnUnlock: boolean;
        /** Internal. Used to manage archive comments. */
        archiveCommentAlreadyDisplayed: Record<string, boolean>;
        /** Internal. Used to manage tutorial elements. */
        tuto_pointers_types_nbr: 20;
        /** Internal. Used to manage tutorial elements. */
        tuto_textarea_maxlength: 400;
        /** Internal. The chat component for the table. */
        tablechat: InstanceType<BGA.ChatInput> | null;
        /** Internal. Used to pass video/audio chat between links. */
        mediaRatingParams: string;
        /** Internal. @deprecated This is not used within the main code file anymore. */
        quitDlg: null;
        /** Internal. Random like number representing the index of the inactiveplayermessage. This may be deprecated? */
        nextPubbanner: null | number;
        /** Internal. If not null, then the interface is locked and this represent the id of the lock (some unique key). The interface can only be unlocked by this same id. See {@link isInterfaceLocked}, {@link isInterfaceUnlocked}, {@link unlockInterface}, {@link lockInterface}. */
        interface_locked_by_id: number | string | object | null | undefined;
        /** Internal. @deprecated This is not used within the main code file anymore. I believe this was replaced by ajax calls and the newer way to check preferences. */
        gamepreferences_control: {};
        /** Internal. The last notification containing the spectator list. This is used when re-updating the list. */
        last_visitorlist: BGA.NotifTypes['updateSpectatorList'] | null;
        /** Internal. The js template for player tooltips. Note that this is left as a string literal for convenience but may have been changed. */
        jstpl_player_tooltip: string;
        /** Internal. This is not set anywhere in the source code, but looks like it should be a playerlocation component. */
        playerlocation: null;
        /** Internal. A record for looking up replay points. When the user click on a replay button, this is used to find the id to replay from. */
        log_to_move_id: Record<number, BGA.ID>;
        /** Internal. A record of tutorial dialogs. This is used for managing dialogs by id rather than reference. */
        tutorialItem: Record<string, DijitJS.Dialog | DijitJS.TooltipDialog>;
        /** Internal. True if this was previously the current active player. Updated whenever a notification packet is successfully dispatched. */
        current_player_was_active: boolean;
        /** Internal. Represents if this game client is *visually* the active player. This is only updated after {@link updateActivePlayerAnimation}. */
        current_player_is_active: boolean;
        /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
        showOpponentCursorMouveOver: DojoJS.Handle | null;
        /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
        showOpponentCursorClickHook: DojoJS.Handle | null;
        /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
        showOpponentCursorClickCounter: number;
        /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
        showOpponentCursorClickCooldown: number | null;
        /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
        showOpponentCursorClickNumberSinceCooldown: number;
        /** Internal. Used for managing the opponent mouse state when we should show their cursor. */
        showOpponentCursorTimeout?: number | null;
        /** Internal. Used purely for {@link registerEbgControl} and {@link destroyAllEbgControls}. */
        ebgControls: {
            destroy?(): any;
        }[];
        /** Internal. @deprecated This is not used within the main code file anymore. */
        bThisGameSupportFastReplay: boolean;
        /** Internal. Record for the loading status for an image url, where false is not loaded and true is loaded. */
        images_loading_status: Record<string, boolean>;
        /** Internal. Used for presentation when resynchronizing notifications (re-downloading). */
        log_history_loading_status: {
            downloaded: number;
            total: number;
            loaded: number;
        };
        /** Internal. The js template for player ranking. Note that this is left as a string literal for convenience but may have been changed. */
        jstpl_player_ranking: string;
        /** Internal. The js template for a hotseat player. Note that this is left as a string literal for convenience but may have been changed. */
        jstpl_hotseat_interface: string;
        /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
        control3dxaxis: number;
        /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
        control3dzaxis: number;
        /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
        control3dxpos: number;
        /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
        control3dypos: number;
        /** Internal. When the 3d view is enabled, this represents the camera state. See {@link control3dmode3d} and {@link init3d}. */
        control3dscale: number;
        /** Internal. If 3d controls are enabled. See {@link init3d}. */
        control3dmode3d: boolean | 0 | 1;
        /** Internal. This looks like a Socket.IO type, but not work npm this type that will never be used in a game. */
        gs_socket?: socket.IO.Socket;
        /** Internal. */
        gs_socketio_url?: string;
        /** Internal. */
        gs_socketio_path?: 'r' | string;
        /** Internal. */
        debug_from_chat?: boolean;
        /** Internal. */
        chat_on_gs_side?: boolean;
        /** Internal. WIP. */
        decision?: BGA.Gamedatas['decision'];
        /** Internal. The current server number this game is being played on. */
        gameserver?: BGA.ID;
        /** Internal. The bundle version for js. */
        jsbundlesversion?: string;
        /** Internal. @deprecated This is not used anywhere in the game code. */
        bActiveEvents?: boolean;
        /** Internal. Helper for where to send the user when on quick game ends. */
        quickGameEnd?: boolean;
        /** Internal. Helper for where to send the user when on quick game ends. */
        quickGameEndUrl?: string;
        /** Internal. WIP */
        bTimerCommon?: boolean;
        /** Internal. WIP */
        turnBasedNotes?: string;
        /** Internal. WIP */
        gameeval?: boolean;
        /** Internal. WIP */
        gamecanapprove?: boolean;
        /** Internal. WIP */
        bUseWebStockets?: boolean;
        /** Internal. WIP */
        metasite_tutorial?: number[];
        /** Internal. WIP */
        tournament_id?: null | number;
        /** Internal. WIP */
        lockts?: number;
        /** Internal. WIP */
        mslobby?: 'lobby';
        /** Internal. WIP */
        game_status?: 'public' | 'beta_restricted' | 'beta' | 'private';
        /** Internal. WIP */
        game_group?: `${number}` | "";
        /** Internal. WIP */
        emergencymsg?: BGA.NotifTypes['chat'][];
        /** Internal. WIP */
        hotseat_interface?: 'normal' | 'hotseataccount' | 'single_screen';
        /** Internal. WIP */
        hotseatplayers?: number[];
        bDisableNextMoveOnNextSound?: boolean;
        lockScreenTimeout?: number;
        turnBasedNotesPopupIncent?: DijitJS.TooltipDialog;
        /** If the game/table being viewed is an outdated version of the game. */
        gameUpgraded?: boolean;
        paymentbuttons?: InstanceType<BGA.PaymentButtons>;
        playingHours?: {
            0: boolean;
            1: boolean;
            2: boolean;
            3: boolean;
            4: boolean;
            5: boolean;
            6: boolean;
            7: boolean;
            8: boolean;
            9: boolean;
            10: boolean;
            11: boolean;
            12: boolean;
            13: boolean;
            14: boolean;
            15: boolean;
            16: boolean;
            17: boolean;
            18: boolean;
            19: boolean;
            20: boolean;
            21: boolean;
            22: boolean;
            23: boolean;
        };
        bEnabledArchiveAdvancedFeatures?: boolean;
        archiveGotoMenu?: DijitJS.TooltipDialog;
        default_viewport?: string;
        bDisableSoundOnMove?: boolean;
        pageheader?: InstanceType<BGA.PageHeader>;
        pageheaderfooter?: InstanceType<BGA.PageHeader>;
        savePlayAreaXScroll?: number;
        bForceMobileHorizontalScroll?: boolean;
        showOpponentCursorLastEvent?: (MouseEvent & {
            path?: Node[];
        }) | null;
        showOpponentCursorLastInfosSendMark?: string | null;
        eloEndOfGameAnimationDatas?: Record<BGA.ID, {
            player_id: BGA.ID;
            from: number;
            to: number;
            current: number;
        }>;
        eloEndOfGameAnimationFrameCurrentDuration?: number;
        tableresults?: InstanceType<BGA.TableResults>;
        tableresults_datas?: BGA.TableResultsData;
        closeRankMenu?: DojoJS.Handle;
        bGameEndJustHappened?: boolean;
        end_of_game_timestamp?: number;
        archiveCommentImageToAnchor?: string;
        updatedReflexionTime?: {
            initial: {
                [playerId: BGA.ID]: number;
            };
            initial_ts: {
                [playerId: BGA.ID]: number;
            };
            total: {
                [playerId: BGA.ID]: number;
            };
        };
        currentPlayerReflexionStartAt?: number;
        wakeupcheck_timeout?: number | null;
        fireDlg?: InstanceType<BGA.PopinDialog> & {
            telParentPage: Gamegui_Template;
        };
        fireDlgStatus?: string;
        list_of_players_to_expel?: string[];
        savedSynchronousNotif?: {
            [K in keyof BGA.NotifTypes]?: number;
        };
        archiveCommentPointElementMouseEnterEvt?: DojoJS.Handle | null;
        tutoratingDone?: boolean;
        bTutorialRatingStep?: boolean;
        archiveCommentDraggingInProgress?: boolean;
        archiveCommentPointElementMouseEnterItem?: string;
        bMustRemoveArchiveCommentImage?: boolean;
        addCommentDragMouseUpLink?: DojoJS.Handle;
        addCommentDragMouseOverLink?: DojoJS.Handle;
        publishTuto?: InstanceType<BGA.PopinDialog>;
        archiveCursorPos?: BGA.ID;
        expelledDlg?: InstanceType<BGA.PopinDialog>;
        tutorialActiveDlg?: InstanceType<BGA.PopinDialog>;
        turnBasedNotesIsOpen?: boolean;
        turnBasedNotesPopup?: DijitJS.TooltipDialog;
        last_rank_displayed?: number;
        ranking_mode_displayed?: 'arena' | 'elo';
        hotseat_focus?: BGA.ID | null;
        hotseat?: Record<BGA.ID, 0 | 1>;
        save?: HTMLElement;
        control3ddraggable?: InstanceType<BGA.Draggable>;
        completesetup(game_name: string, game_name_displayed: string, table_id: BGA.ID, player_id: BGA.ID, credentials: HexString | null, privatechannel_id: HexString | null, cometd_service: "keep_existing_gamedatas_limited" | "socketio" | string, gamedatas: BGA.Gamedatas, players_metadata: Record<BGA.ID, BGA.PlayerMetadata> | null, socket_uri: `https://${string}:${number}` | null, socket_path?: 'r' | string): void;
        onReconnect(): void;
        onGsSocketIoConnectionStatusChanged(statusType: 'connect' | 'connect_error' | 'connect_timeout' | 'reconnect' | 'reconnect_attempt' | 'reconnect_error' | 'reconnect_failed', errorMessage?: any): void;
        updatePremiumEmblemLinks(): void;
        onGameUiWidthChange(): void;
        onZoomToggle(t: Event): void;
        adaptStatusBar(): void;
        adaptPlayersPanels(): void;
        activeShowOpponentCursor(): void;
        showOpponentCursorClick(t: MouseEvent): void;
        unactiveShowOpponentCursor(): void;
        onShowMyCursor(t: MouseEvent): void;
        onHideCursor(t: MouseEvent): void;
        getCursorInfos(e: boolean): {
            id: string;
            x: number;
            y: number;
        }[] | null;
        showOpponentCursorSendInfos(): void;
        onShowOpponentCursorMouseOver(e: MouseEvent): void;
        getGameStandardUrl(): string;
        showIngameMenu(): void;
        hideIngameMenu(): void;
        toggleIngameMenu(t: MouseEvent): void;
        getPlayerTooltip(player_metadata: BGA.PlayerMetadata): string;
        onStartGame(): void;
        onNotificationPacketDispatched(): void;
        updateActivePlayerAnimation(): boolean;
        isPlayerActive(playerId: BGA.ID | null | undefined): boolean;
        updateVisitors(t: Record<BGA.ID, string>): void;
        onBanSpectator(t: MouseEvent): void;
        switchToGameResults(): void;
        eloEndOfGameAnimation(): void;
        eloEndOfGameAnimationWorker(): void;
        updateResultPage(): void;
        loadTrophyToSplash(e: Record<BGA.ID, BGA.TableResultTrophies>): void;
        displayScores(): void;
        buildScoreDlgHtmlContent(t: BGA.GameStateArgs['argGameEnd']['result']): {
            html: string;
            title: string | null;
            result_for_current_player: string;
            tied_scores: (string | number)[];
        };
        onFBReady(): void;
        onShowGameResults(): void;
        onGameEnd(): void;
        prepareMediaRatingParams(): void;
        getMediaRatingParams(firstParam?: boolean): string;
        redirectToTablePage(): void;
        redirectToTournamentPage(): void;
        redirectToLobby(): void;
        redirectToMainsite(): void;
        redirectToGamePage(): void;
        doRedirectToMetasite(): void;
        onBackToMetasite(event: Event): void;
        onCreateNewTable(): void;
        onProposeRematch(): void;
        onBuyThisGame(): void;
        ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(...[url, args, scope, onSuccess, callback, ajax_method]: BGA.AjaxParams<Action, Scope>): unknown;
        onGlobalActionPause(e: MouseEvent): void;
        onGlobalActionFullscreen(t: MouseEvent): boolean;
        switchLogModeTo(t: 0 | 1 | boolean): void;
        onGlobalActionPreferences(): void;
        onGlobalActionHelp(): void;
        onGlobalActionBack(t: MouseEvent): void;
        onGlobalActionQuit(t: MouseEvent): void;
        onNewLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): void;
        addMoveToLog(t: number, i: BGA.ID): void;
        onChangeContentHeight(): void;
        onReplayFromPoint(t: MouseEvent): void;
        updateDecisionPanel(t: BGA.NotifTypes['tableDecision']): void;
        onPlayerDecide(e: MouseEvent): void;
        updateReflexionTimeDisplay(): void;
        updateReflexionTime(t: boolean): void;
        shouldDisplayClockAlert(player_id: BGA.ID): boolean;
        updateFirePlayerLink(): void;
        onWouldLikeToThink(e: MouseEvent): void;
        sendWakeupInTenSeconds(): void;
        sendWakeUpSignal(): void;
        cancelPlannedWakeUp(): void;
        checkWakupUpInFourteenSeconds(): void;
        checkWakups(): void;
        cancelPlannedWakeUpCheck(): void;
        isInterfaceLocked(): boolean;
        isInterfaceUnlocked(): boolean;
        lockInterface(lock?: Gamegui_Template["interface_locked_by_id"]): void;
        unlockInterface(lock?: Gamegui_Template["interface_locked_by_id"]): void;
        onLockInterface(...[t]: BGA.TopicArgs['lockInterface']): void;
        onAiNotPlaying(t: MouseEvent): void;
        onNotPlayingHelp(e: MouseEvent): void;
        onSkipPlayersOutOfTime(e: MouseEvent): void;
        onWouldFirePlayer(t: MouseEvent): void;
        onDecreaseExpelTime(t: number): void;
        onMove(): void;
        onNextMove(e: BGA.ID): void;
        initArchiveIndex(): void;
        sendNextArchive(): boolean;
        onArchiveNext(e: MouseEvent): void;
        onArchiveNextLog(e: MouseEvent): void;
        doArchiveNextLog(): void;
        onArchiveNextTurn(e: MouseEvent): void;
        onArchiveHistory(t: MouseEvent): void;
        setModeInstataneous(): void;
        unsetModeInstantaneous(): void;
        onLastArchivePlayed(): void;
        onArchiveToEnd(e: MouseEvent): void;
        onArchiveToEndSlow(e: MouseEvent): void;
        onArchiveGoTo(t: MouseEvent): void;
        onEndDisplayLastArchive(): void;
        onArchiveGoToMoveDisplay(): void;
        archiveGoToMove(e: BGA.ID, t: boolean): void;
        showArchiveComment(t: 'saved' | 'edit' | any, i?: number): boolean | {
            notif_uid: string;
        };
        getCommentsViewedFromStart(): number;
        onArchiveCommentMinimize(t: MouseEvent): void;
        onArchiveCommentMaximize(t: MouseEvent): void;
        applyArchiveCommentMarkup(e: string): string;
        onArchiveCommentPointElementOnMouseEnter(t: MouseEvent): void;
        removeArchiveCommentPointElement(): void;
        archiveCommentAttachImageToElement(t: HTMLElement, i?: string, n?: string): void;
        onArchiveCommentPointElementClick(t: MouseEvent): void;
        onArchiveCommentContinueModeChange(t?: Event): void;
        onArchiveCommentDisplayModeChange(e: Event): void;
        onTutoRatingEnter(t: MouseEvent): void;
        onTutoRatingLeave(t: MouseEvent): void;
        onTutoRatingClick(t: MouseEvent): void;
        onRepositionPopop(): void;
        clearArchiveCommentTooltip(): void;
        removeArchiveCommentAssociatedElements(): void;
        onArchiveAddComment(e: MouseEvent): void;
        onNewArchiveCommentCancel(t: MouseEvent): void;
        onNewArchiveCommentSave(t: MouseEvent): void;
        newArchiveCommentSave(): void;
        onNewArchiveCommentSaveModify(t: MouseEvent): void;
        newArchiveCommentSaveModify(t: BGA.ID): void;
        getArchiveCommentsPointers(): string;
        onKeyPressTutorial(t: KeyboardEvent): false | void;
        onKeyUpTutorial(t: KeyboardEvent): false | void;
        onNewArchiveCommentNext(t: MouseEvent): void;
        doNewArchiveCommentNext(): void;
        onNewArchiveCommentDelete(t: MouseEvent): void;
        onNewArchiveCommentModify(t: MouseEvent): void;
        onNewArchiveCommentStartDrag(t: MouseEvent): void;
        onNewArchiveCommentEndDrag(t: MouseEvent): void;
        onNewArchiveCommentDrag(t: MouseEvent): void;
        initCommentsForMove(e: BGA.ID): void;
        onEndOfNotificationDispatch(): void;
        checkIfArchiveCommentMustBeDisplayed(): boolean;
        onHowToTutorial(t: MouseEvent): void;
        onTutoPointerClick(t: MouseEvent): void;
        onPublishTutorial(t: MouseEvent): void;
        onQuitTutorial(t: MouseEvent): void;
        loadReplayLogs(): void;
        replaceArchiveCursor(): void;
        onEditReplayLogsComment(t: MouseEvent): void;
        onRemoveReplayLogsComment(t: MouseEvent): void;
        onEditReplayLogsCommentSave(t: MouseEvent): void;
        onReplayLogClick(t: MouseEvent): void;
        ensureImageLoading(): void;
        ensureSpecificImageLoading(t: string[]): void;
        onLoadImageOk(e: Event): void;
        onLoadImageNok(e: Event): void;
        updateLoaderPercentage(): void;
        displayTableWindow(t: BGA.ID, i: string, n: any, o: any, a: string, s: string): {
            id: string | null;
            target_id: string | null;
            container_id: string;
            resizeHandle: DojoJS.Handle | null;
            closeHandle: DojoJS.Handle | null;
            bCloseIsHiding: boolean;
            onShow: (() => any) | null;
            onHide: (() => any) | null;
            jstpl_standard_popin: string;
            tableModule?: {
                gamedatas?: BGA.Gamedatas | null;
                subscriptions: DojoJS.Handle[];
                tooltips: Record<string, DijitJS.Tooltip>;
                bHideTooltips: boolean;
                screenMinWidth: number;
                currentZoom: number;
                connections: {
                    element: any;
                    event: string;
                    handle: DojoJS.Handle;
                }[];
                instantaneousMode: boolean | 0 | 1;
                webrtc: InstanceType<BGA.WebRTC> | null;
                webrtcmsg_ntf_handle: DojoJS.
                /**
                 * Checks if the player can do the specified action by taking into account:
                 * - If the interface is locked it will return false and show message "An action is already in progress", unless nomessage set to true.
                 * - If the player is not active it will return false and show message "This is not your turn", unless nomessage set to true.
                 * - If action is not in list in possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
                 * - Otherwise returns true.
                 * @param action The action to check if the player can do.
                 * @param nomessage (optional) If true, it will not show any error messages.
                 * @returns true if the player can do the specified action.
                 * @example
                 * function onClickOnGameElement( evt )  {
                 * 	if( this.checkAction( "my_action" ) ) {
                 * 		// Do the action
                 * 	}
                 * }
                 */
                Handle | null;
                rtc_mode: 0 | 1 | 2;
                mediaConstraints: BGA.WebRTCMediaConstraints;
                gameMasculinePlayers: string[];
                gameFemininePlayers: string[];
                gameNeutralPlayers: string[];
                emoticons: {
                    readonly ":)": "smile";
                    readonly ":-)": "smile";
                    readonly ":D": "bigsmile";
                    readonly ":-D": "bigsmile";
                    readonly ":(": "unsmile";
                    readonly ":-(": "unsmile";
                    readonly ";)": "blink";
                    readonly ";-)": "blink";
                    readonly ":/": "bad";
                    readonly ":-/": "bad";
                    readonly ":s": "bad";
                    readonly ":-s": "bad";
                    readonly ":P": "mischievous";
                    readonly ":-P": "mischievous";
                    readonly ":p": "mischievous";
                    readonly ":-p": "mischievous";
                    readonly ":$": "blushing";
                    readonly ":-$": "blushing";
                    readonly ":o": "surprised";
                    readonly ":-o": "surprised";
                    readonly ":O": "shocked";
                    readonly ":-O": "shocked";
                    readonly o_o: "shocked";
                    readonly O_O: "shocked";
                    readonly "8)": "sunglass";
                    readonly "8-)": "sunglass";
                };
                defaultTooltipPosition: DijitJS.PlacePositions[];
                metasiteurl?: string;
                ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "iframe" | "get" | "post" | undefined): void;
                format_block(template: string, args: Record<string, any>): string;
                format_string(template: string, args: Record<string, any>): string;
                format_string_recursive(template: string, args: Record<string, any> & {
                    i18n?: Record<string, any>;
                    type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
                    message?: string;
                    text?: string;
                }): string;
                clienttranslate_string(text: string): string;
                translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
                register_subs(...handles: DojoJS.Handle[]): void;
                unsubscribe_all(): void;
                register_cometd_subs(...comet_ids: string[]): string | string[];
                showMessage(message: string, type: "info" | "error" | "only_to_log" | string): void;
                placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
                placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
                disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
                enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
                getComputedTranslateZ(element: Element): number;
                transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation>;
                slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
                slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
                slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
                toRadians(angle: number): number;
                vector_rotate(vector: {
                    x: number;
                    y: number;
                }, angle: number): {
                    x: number;
                    y: number;
                };
                attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
                attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
                slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
                slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
                fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
                rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
                rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
                rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
                getAbsRotationAngle(target: string | Element | null): number;
                addClassToClass<T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]): void;
                connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
                connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
                connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U, method: keyof any): void;
                connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>, any>>(targetObject: T, event: U, method: M, dontFix?: boolean): void;
                disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
                disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U): void;
                connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
                connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
                connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
                connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M): void;
                addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
                addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
                disconnectAll(): void;
                setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
                incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
                decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
                updateCounters(counters?: Partial<{
                    [x: string]: {
                        counter_value: BGA.ID;
                        counter_name: string;
                    };
                } | undefined>): void;
                getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
                addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
                addTooltipHtml(target: string, html: string, delay?: number): void;
                addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
                addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
                removeTooltip(target: string): void;
                switchDisplayTooltips(displayType: 0 | 1): void;
                applyCommentMarkup(text: string): string;
                confirmationDialog<T = null>(message: string, yesHandler: (param: T) => any, noHandler?: ((param: T) => any) | undefined, param?: T | undefined): void;
                warningDialog(message: string, callback: () => any): void;
                infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
                multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
                askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
                displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
                showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
                showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
                getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
                getKarmaLabel(karma: number | string): {
                    label: "Perfect" | string;
                    css: "exceptional";
                } | {
                    label: "Excellent" | string;
                    css: "perfect";
                } | {
                    label: "Very good" | string;
                    css: "verygood";
                } | {
                    label: "Good" | string;
                    css: "good";
                } | {
                    label: "Average" | string;
                    css: "average";
                } | {
                    label: "Not good" | string;
                    css: "notgood";
                } | {
                    label: "Bad" | string;
                    css: "bad";
                } | {
                    label: "Very bad" | string;
                    css: "verybad";
                } | undefined;
                getObjectLength(obj: object): number;
                comet_subscriptions: string[];
                unload_in_progress: boolean;
                bCancelAllAjax: boolean;
                tooltipsInfos: Record<string, {
                    hideOnHoverEvt: DojoJS.Handle | null;
                }>;
                mozScale: number;
                rotateToPosition: Record<string, number>;
                room: BGA.RoomId | null;
                already_accepted_room: BGA.RoomId | null;
                webpush: InstanceType<BGA.WebPush> | null;
                interface_min_width?: number;
                confirmationDialogUid?: number;
                confirmationDialogUid_called?: number;
                discussionTimeout?: Record<string, number>;
                showclick_circles_no?: number;
                number_of_tb_table_its_your_turn?: number;
                prevent_error_rentry?: number;
                transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
                onresizePlayerAwardsEvent?: DojoJS.Handle;
                gameinterface_zoomFactor?: number;
                ajaxpageload<Scope>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope, callback: DojoJS.HitchMethod<Scope, [data: any], any>): {
                    new (): import("dojo/promise/Promise")<any>;
                };
                displayUserHttpError(error_code: string | number | null): void;
                cancelAjaxCall(): void;
                applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
                adaptScreenToMinWidth(min_width: number): void;
                adaptScreenToMinWidthWorker(): void;
                getObjPosition(obj: HTMLElement | string): {
                    x: number;
                    y: number;
                };
                doShowBubble(anchor: string, message: string, custom_class?: string): void;
                getGameNameDisplayed(text: string): string;
                formatReflexionTime(time: number): {
                    string: string;
                    mn: number;
                    s: (string | number);
                    h: number;
                    positive: boolean;
                };
                strip_tags(e: string, t?: string): string;
                validURL(e: any): boolean;
                nl2br(e: any, t: any): string;
                htmlentities(e: string, t: any, i: any, n: any): string | false;
                html_entity_decode(e: any, t: any): string | false;
                get_html_translation_table(e: any, t: any): Record<string, string>;
                ucFirst(e: any): any;
                setupWebPush(): Promise<void>;
                refreshWebPushWorker(): void;
                getRTCTemplate(e: any, t: any, i: any): string;
                setupRTCEvents(t: string): void;
                getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
                    mandatory: {
                        minAspectRatio: number;
                        maxAspectRatio: number;
                        maxWidth: number;
                        maxFrameRate: number;
                    };
                    optional: never[];
                };
                startRTC(): void;
                doStartRTC(): void;
                onGetUserMediaSuccess(): void;
                onGetUserMediaError(): void;
                onJoinRoom(t: any, i: any): void;
                onClickRTCVideoMax(t: Event): void;
                maximizeRTCVideo(t: any, i: any): void;
                onClickRTCVideoMin(t: any): void;
                onClickRTCVideoSize(t: any): void;
                onClickRTCVideoMic(t: any): void;
                onClickRTCVideoSpk(t: any): void;
                onClickRTCVideoCam(t: any): void;
                onLeaveRoom(t: any, i: any): void;
                onLeaveRoomImmediate(e: any): void;
                doLeaveRoom(e?: any): void;
                clearRTC(): void;
                ntf_webrtcmsg(e: any): void;
                addSmileyToText(e: string): string;
                getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
                makeClickableLinks(e: any, t: any): any;
                makeBgaLinksLocalLinks(e: any): any;
                ensureEbgObjectReinit(e: any): void;
                getRankClassFromElo(e: any): string;
                getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
                getRankClassFromEloUntranslated(e: any): "good" | "average" | "beginner" | "apprentice" | "strong" | "expert" | "master";
                eloToBarPercentage(e: any, t?: boolean): number;
                formatElo(e: string): number;
                formatEloDecimal(e: any): number;
                getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
                getArenaLabel(e: any, t?: any): string;
                insertParamIntoCurrentURL(e: any, t: any): void;
                playerawardsCollapsedAlignement(): void;
                playerawardCollapsedAlignement(t: any): void;
                arenaPointsDetails(e: any, t?: any): {
                    league: 0 | 2 | 1 | 3 | 4 | 5;
                    league_name: string;
                    league_shortname: string;
                    league_promotion_shortname: string;
                    points: number;
                    arelo: number;
                };
                arenaPointsHtml(t: {
                    league_name: string;
                    league: 0 | 1 | 2 | 3 | 4 | 5;
                    arelo: number;
                    points: number | null;
                    league_promotion_shortname?: string | null;
                }): {
                    bar_content: string;
                    bottom_infos: string;
                    bar_pcent: string;
                    bar_pcent_number: string | number;
                };
                declaredClass: string;
                inherited<U>(args: IArguments): U;
                inherited<U>(args: IArguments, newArgs: any[]): U;
                inherited(args: IArguments, get: true): Function | void;
                inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
                inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
                __inherited: {
                    <U>(args: IArguments): U;
                    <U>(args: IArguments, newArgs: any[]): U;
                    (args: IArguments, get: true): Function | void;
                    <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
                    <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
                };
                getInherited(args: IArguments): Function | void;
                getInherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments): DojoJS.Hitched<any, T, []>;
                isInstanceOf(cls: any): boolean;
            } & DojoJS.DojoClassObject;
            create(id: string, container_div?: string | HTMLElement): void;
            destroy(animate?: boolean): void;
            setCloseCallback(callback: (event: MouseEvent) => any): void;
            hideCloseIcon(): void;
            setTitle(title?: string): void;
            setMaxWidth(maxWidth: number): void;
            setHelpLink(link: string): void;
            setContent(content: string | Node): void;
            show(animate?: boolean): void;
            hide(animate?: boolean): void;
        } & DojoJS.DojoClassObject;
        updatePubBanner(): void;
        onSaveState(e: MouseEvent): void;
        onLoadState(e: MouseEvent): void;
        onLoadBugReport(e: MouseEvent): void;
        onReloadCss(e: MouseEvent): void;
        getScriptErrorModuleInfos(): string;
        showTutorial(): void;
        onCloseTutorial(t: MouseEvent): void;
        onBeforeChatInput(t: any): boolean;
        showEliminated(): void;
        setLoader(t: number, i: number): void;
        displayZombieBack(): void;
        onZombieBack(t: MouseEvent): void;
        showNeutralizedGamePanel(t: BGA.ID, i: BGA.ID): void;
        setupCoreNotifications(): void;
        ntf_gameStateChange(t: BGA.Notif<'gameStateChange'>): void;
        ntf_gameStateChangePrivateArgs(e: BGA.Notif<'gameStateChangePrivateArg'>): void;
        ntf_gameStateMultipleActiveUpdate(e: BGA.Notif<'gameStateMultipleActiveUpdate'>): void;
        ntf_newActivePlayer(e: BGA.Notif<'newActivePlayer'>): void;
        ntf_playerStatusChanged(t: BGA.Notif<'playerstatus'>): void;
        ntf_yourTurnAck(e: BGA.Notif<'yourturnack'>): void;
        ntf_clockalert(e: BGA.Notif<'clockalert'>): void;
        ntf_tableInfosChanged(e: BGA.Notif<'tableInfosChanged'>): void;
        ntf_playerEliminated(e: BGA.Notif<'playerEliminated'>): void;
        ntf_tableDecision(e: BGA.Notif<'tableDecision'>): void;
        ntf_infomsg(t: BGA.Notif<'infomsg'>): void;
        ntf_archivewaitingdelay(e: BGA.Notif<'archivewaitingdelay'>): void;
        ntf_end_archivewaitingdelay(e: BGA.Notif<'end_archivewaitingdelay'>): void;
        ntf_replaywaitingdelay(e: BGA.Notif<'replaywaitingdelay'>): void;
        ntf_end_replaywaitingdelay(e: BGA.Notif<'end_replaywaitingdelay'>): void;
        ntf_replayinitialwaitingdelay(e: BGA.Notif<'replayinitialwaitingdelay'>): void;
        ntf_end_replayinitialwaitingdelay(e: BGA.Notif<'end_replayinitialwaitingdelay'>): void;
        ntf_replay_has_ended(e: BGA.Notif<'replay_has_ended'>): void;
        onEndOfReplay(): void;
        ntf_updateSpectatorList(e: BGA.Notif<'updateSpectatorList'>): void;
        ntf_tableWindow(e: BGA.Notif<'tableWindow'>): void;
        ntf_wouldlikethink(e: BGA.Notif<'wouldlikethink'>): void;
        ntf_updateReflexionTime(e: BGA.Notif<'updateReflexionTime'>): void;
        ntf_undoRestorePoint(t: BGA.Notif<'undoRestorePoint'>): void;
        ntf_resetInterfaceWithAllDatas(t: BGA.Notif<'resetInterfaceWithAllDatas'>): void;
        ntf_zombieModeFailWarning(e: BGA.Notif<'zombieModeFailWarning'>): void;
        ntf_zombieModeFail(e: BGA.Notif<'zombieModeFail'>): void;
        ntf_aiError(t: BGA.Notif<'aiError'>): void;
        ntf_skipTurnOfPlayer(e: BGA.Notif<'skipTurnOfPlayer'>): void;
        ntf_zombieBack(t: BGA.Notif<'zombieBack'>): void;
        ntf_gameResultNeutralized(e: BGA.Notif<'gameResultNeutralized'>): void;
        ntf_allPlayersAreZombie(t: BGA.Notif<'allPlayersAreZombie'>): void;
        ntf_simplePause(e: BGA.Notif<'simplePause'>): void;
        ntf_showTutorial(t: BGA.Notif<'showTutorial'>): void;
        showTutorialActivationDlg(): void;
        showTutorialItem(t: BGA.Notif<'showTutorial'>): void;
        onTutorialClose(e: MouseEvent): void;
        onTutorialDlgClose(e: MouseEvent): void;
        markTutorialAsSeen(t: BGA.ID): void;
        toggleTurnBasedNotes(): void;
        closeTurnBasedNotes(): void;
        openTurnBasedNotes(t?: string): void;
        onSaveNotes(t: MouseEvent): void;
        onClearNotes(e: MouseEvent): void;
        onSeeMoreLink(t: MouseEvent): void;
        onThumbUpLink(t: MouseEvent): void;
        onChangePreference(e: Event): void;
        handleGameUserPreferenceChangeEvent(pref_id: number, newValue: number): void;
        getGameUserPreference(e: BGA.ID): number;
        setGameUserPreference(e: number, t: number): void;
        getRanking(): void;
        insert_rankings(t: any): void;
        onSeeMoreRanking(t: MouseEvent): void;
        onChangeRankMode(t: MouseEvent): void;
        ntf_aiPlayerWaitingDelay(_: BGA.Notif<'aiPlayerWaitingDelay'>): void;
        ntf_playerConcedeGame(t: BGA.Notif<'playerConcedeGame'>): void;
        ntf_skipTurnOfPlayerWarning(t: BGA.Notif<'skipTurnOfPlayerWarning'>): void;
        ntf_showCursorClick(e: BGA.Notif<'showCursorClick'>): void;
        ntf_showCursor(t: BGA.Notif<'showCursor'>): void;
        onChatKeyDown(t: KeyboardEvent): void;
        onChatInputBlur(e: Event): void;
        onJudgeDecision(e: Event): void;
        registerEbgControl(e: {
            destroy?: () => void;
        }): void;
        destroyAllEbgControls(): void;
        playMusic(_?: unknown): void;
        onShowGameHelp(): void;
        onShowStrategyHelp(): void;
        onShowCompetition(): void;
        onShowTournament(): void;
        lockScreenCounter(): void;
        bgaPerformAction<K extends keyof BGA.GameStatePossibleActions>(e: K, t: BGA.AjaxParams<`/${string}/${string}/${K}.html`, this>[1], i?: {
            lock?: boolean;
            checkAction?: boolean;
            checkPossibleActions?: boolean;
        }): Promise<void> | void;
        initHotseat(): void;
        onHotseatPlayButton(t: MouseEvent): void;
        checkHotseatFocus(): void;
        giveHotseatFocusTo(t: BGA.ID): void;
        init3d(): void;
        change3d(t: number, i: number, n: number, o: number, a: number, s: 0 | 1 | boolean, r: 0 | 1 | boolean): void;
        enter3dButton(e: MouseEvent): void;
        leave3dButton(e: MouseEvent): void;
        ntf_banFromTable(e: BGA.Notif<'banFromTable'>): void;
        ntf_resultsAvailable(_: BGA.Notif<'resultsAvailable'>): void;
        ntf_switchToTurnbased(_: BGA.Notif<'switchToTurnbased'>): void;
        ntf_newPrivateState(t: BGA.Notif<'newPrivateState'>): void;
        saveclient(): void;
        restoreClient(): void;
        decodeHtmlEntities(e: string): string;
        applyTranslationsOnLoad(): void;
        showGameRatingDialog(): void;
    }
    let Gamegui: DojoJS.DojoClass<{
        gamedatas?: BGA.Gamedatas | null;
        subscriptions: DojoJS.Handle[];
        tooltips: Record<string, DijitJS.Tooltip>;
        bHideTooltips: boolean;
        screenMinWidth: number;
        currentZoom: number;
        connections: {
            element: any;
            event: string;
            handle: DojoJS.Handle;
        }[];
        instantaneousMode: boolean | 0 | 1;
        webrtc: InstanceType<BGA.WebRTC> | null;
        webrtcmsg_ntf_handle: DojoJS.
        /**
         * Checks if the player can do the specified action by taking into account:
         * - If the interface is locked it will return false and show message "An action is already in progress", unless nomessage set to true.
         * - If the player is not active it will return false and show message "This is not your turn", unless nomessage set to true.
         * - If action is not in list in possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
         * - Otherwise returns true.
         * @param action The action to check if the player can do.
         * @param nomessage (optional) If true, it will not show any error messages.
         * @returns true if the player can do the specified action.
         * @example
         * function onClickOnGameElement( evt )  {
         * 	if( this.checkAction( "my_action" ) ) {
         * 		// Do the action
         * 	}
         * }
         */
        Handle | null;
        rtc_mode: 0 | 1 | 2;
        mediaConstraints: BGA.WebRTCMediaConstraints;
        gameMasculinePlayers: string[];
        gameFemininePlayers: string[];
        gameNeutralPlayers: string[];
        emoticons: {
            readonly ":)": "smile";
            readonly ":-)": "smile";
            readonly ":D": "bigsmile";
            readonly ":-D": "bigsmile";
            readonly ":(": "unsmile";
            readonly ":-(": "unsmile";
            readonly ";)": "blink";
            readonly ";-)": "blink";
            readonly ":/": "bad";
            readonly ":-/": "bad";
            readonly ":s": "bad";
            readonly ":-s": "bad";
            readonly ":P": "mischievous";
            readonly ":-P": "mischievous";
            readonly ":p": "mischievous";
            readonly ":-p": "mischievous";
            readonly ":$": "blushing";
            readonly ":-$": "blushing";
            readonly ":o": "surprised";
            readonly ":-o": "surprised";
            readonly ":O": "shocked";
            readonly ":-O": "shocked";
            readonly o_o: "shocked";
            readonly O_O: "shocked";
            readonly "8)": "sunglass";
            readonly "8-)": "sunglass";
        };
        defaultTooltipPosition: DijitJS.PlacePositions[];
        metasiteurl?: string;
        ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "iframe" | "get" | "post" | undefined): void;
        format_block(template: string, args: Record<string, any>): string;
        format_string(template: string, args: Record<string, any>): string;
        format_string_recursive(template: string, args: Record<string, any> & {
            i18n?: Record<string, any>;
            type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
            message?: string;
            text?: string;
        }): string;
        clienttranslate_string(text: string): string;
        translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
        register_subs(...handles: DojoJS.Handle[]): void;
        unsubscribe_all(): void;
        register_cometd_subs(...comet_ids: string[]): string | string[];
        showMessage(message: string, type: "info" | "error" | "only_to_log" | string): void;
        placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
        placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
        disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
        enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
        getComputedTranslateZ(element: Element): number;
        transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation>;
        slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        toRadians(angle: number): number;
        vector_rotate(vector: {
            x: number;
            y: number;
        }, angle: number): {
            x: number;
            y: number;
        };
        attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
        slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
        fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
        rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
        rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        getAbsRotationAngle(target: string | Element | null): number;
        addClassToClass<T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]): void;
        connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
        connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U, method: keyof any): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>, any>>(targetObject: T, event: U, method: M, dontFix?: boolean): void;
        disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
        disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U): void;
        connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
        connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
        connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
        connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M): void;
        addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
        addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
        disconnectAll(): void;
        setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
        incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        updateCounters(counters?: Partial<{
            [x: string]: {
                counter_value: BGA.ID;
                counter_name: string;
            };
        } | undefined>): void;
        getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
        addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        addTooltipHtml(target: string, html: string, delay?: number): void;
        addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
        removeTooltip(target: string): void;
        switchDisplayTooltips(displayType: 0 | 1): void;
        applyCommentMarkup(text: string): string;
        confirmationDialog<T = null>(message: string, yesHandler: (param: T) => any, noHandler?: ((param: T) => any) | undefined, param?: T | undefined): void;
        warningDialog(message: string, callback: () => any): void;
        infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
        multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
        askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
        displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
        showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
        showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
        getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
        getKarmaLabel(karma: number | string): {
            label: "Perfect" | string;
            css: "exceptional";
        } | {
            label: "Excellent" | string;
            css: "perfect";
        } | {
            label: "Very good" | string;
            css: "verygood";
        } | {
            label: "Good" | string;
            css: "good";
        } | {
            label: "Average" | string;
            css: "average";
        } | {
            label: "Not good" | string;
            css: "notgood";
        } | {
            label: "Bad" | string;
            css: "bad";
        } | {
            label: "Very bad" | string;
            css: "verybad";
        } | undefined;
        getObjectLength(obj: object): number;
        comet_subscriptions: string[];
        unload_in_progress: boolean;
        bCancelAllAjax: boolean;
        tooltipsInfos: Record<string, {
            hideOnHoverEvt: DojoJS.Handle | null;
        }>;
        mozScale: number;
        rotateToPosition: Record<string, number>;
        room: BGA.RoomId | null;
        already_accepted_room: BGA.RoomId | null;
        webpush: InstanceType<BGA.WebPush> | null;
        interface_min_width?: number;
        confirmationDialogUid?: number;
        confirmationDialogUid_called?: number;
        discussionTimeout?: Record<string, number>;
        showclick_circles_no?: number;
        number_of_tb_table_its_your_turn?: number;
        prevent_error_rentry?: number;
        transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
        onresizePlayerAwardsEvent?: DojoJS.Handle;
        gameinterface_zoomFactor?: number;
        ajaxpageload<Scope>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope, callback: DojoJS.HitchMethod<Scope, [data: any], any>): {
            new (): import("dojo/promise/Promise")<any>;
        };
        displayUserHttpError(error_code: string | number | null): void;
        cancelAjaxCall(): void;
        applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
        adaptScreenToMinWidth(min_width: number): void;
        adaptScreenToMinWidthWorker(): void;
        getObjPosition(obj: HTMLElement | string): {
            x: number;
            y: number;
        };
        doShowBubble(anchor: string, message: string, custom_class?: string): void;
        getGameNameDisplayed(text: string): string;
        formatReflexionTime(time: number): {
            string: string;
            mn: number;
            s: (string | number);
            h: number;
            positive: boolean;
        };
        strip_tags(e: string, t?: string): string;
        validURL(e: any): boolean;
        nl2br(e: any, t: any): string;
        htmlentities(e: string, t: any, i: any, n: any): string | false;
        html_entity_decode(e: any, t: any): string | false;
        get_html_translation_table(e: any, t: any): Record<string, string>;
        ucFirst(e: any): any;
        setupWebPush(): Promise<void>;
        refreshWebPushWorker(): void;
        getRTCTemplate(e: any, t: any, i: any): string;
        setupRTCEvents(t: string): void;
        getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
            mandatory: {
                minAspectRatio: number;
                maxAspectRatio: number;
                maxWidth: number;
                maxFrameRate: number;
            };
            optional: never[];
        };
        startRTC(): void;
        doStartRTC(): void;
        onGetUserMediaSuccess(): void;
        onGetUserMediaError(): void;
        onJoinRoom(t: any, i: any): void;
        onClickRTCVideoMax(t: Event): void;
        maximizeRTCVideo(t: any, i: any): void;
        onClickRTCVideoMin(t: any): void;
        onClickRTCVideoSize(t: any): void;
        onClickRTCVideoMic(t: any): void;
        onClickRTCVideoSpk(t: any): void;
        onClickRTCVideoCam(t: any): void;
        onLeaveRoom(t: any, i: any): void;
        onLeaveRoomImmediate(e: any): void;
        doLeaveRoom(e?: any): void;
        clearRTC(): void;
        ntf_webrtcmsg(e: any): void;
        addSmileyToText(e: string): string;
        getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
        makeClickableLinks(e: any, t: any): any;
        makeBgaLinksLocalLinks(e: any): any;
        ensureEbgObjectReinit(e: any): void;
        getRankClassFromElo(e: any): string;
        getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
        getRankClassFromEloUntranslated(e: any): "good" | "average" | "beginner" | "apprentice" | "strong" | "expert" | "master";
        eloToBarPercentage(e: any, t?: boolean): number;
        formatElo(e: string): number;
        formatEloDecimal(e: any): number;
        getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
        getArenaLabel(e: any, t?: any): string;
        insertParamIntoCurrentURL(e: any, t: any): void;
        playerawardsCollapsedAlignement(): void;
        playerawardCollapsedAlignement(t: any): void;
        arenaPointsDetails(e: any, t?: any): {
            league: 0 | 2 | 1 | 3 | 4 | 5;
            league_name: string;
            league_shortname: string;
            league_promotion_shortname: string;
            points: number;
            arelo: number;
        };
        arenaPointsHtml(t: {
            league_name: string;
            league: 0 | 1 | 2 | 3 | 4 | 5;
            arelo: number;
            points: number | null;
            league_promotion_shortname?: string | null;
        }): {
            bar_content: string;
            bottom_infos: string;
            bar_pcent: string;
            bar_pcent_number: string | number;
        };
        declaredClass: string;
        inherited<U>(args: IArguments): U;
        inherited<U>(args: IArguments, newArgs: any[]): U;
        inherited(args: IArguments, get: true): Function | void;
        inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
        inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
        __inherited: {
            <U>(args: IArguments): U;
            <U>(args: IArguments, newArgs: any[]): U;
            (args: IArguments, get: true): Function | void;
            <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
            <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
        };
        getInherited(args: IArguments): Function | void;
        getInherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments): DojoJS.Hitched<any, T, []>;
        isInstanceOf(cls: any): boolean;
    } & {
        game_name?: string;
        notifqueue: {
            synchronous_notifs: { [K in keyof BGA.NotifTypes]?: number; };
            ignoreNotificationChecks: { [T in keyof BGA.NotifTypes]?: ((notif: BGA.Notif<T>) => boolean); };
            setIgnoreNotificationCheck<T extends keyof BGA.NotifTypes>(notif_type: T, predicate: ((notif: BGA.Notif<T>) => boolean)): void;
            setSynchronous(notif_type: keyof BGA.NotifTypes, duration?: number): void;
            setSynchronousDuration(duration: number): void;
            queue: BGA.Notif[];
            next_log_id: number;
            game: InstanceType<BGA.SiteCore> | null;
            dispatchedNotificationUids: string[];
            checkSequence: boolean;
            last_packet_id: BGA.ID;
            notificationResendInProgress: boolean;
            waiting_from_notifend: null | BGA.Notif;
            playerBufferQueue: Record<string, {
                notifs: BGA.NotifsPacket;
                counter: number;
            }>;
            debugnotif_i: number;
            currentNotifCallback: keyof BGA.NotifTypes | null;
            onPlaceLogOnChannel: ((chatnotif: BGA.ChatNotif) => void) | null;
            lastMsgTime: number;
            logs_to_load?: BGA.NotifsPacket[];
            logs_to_load_sortedNotifsKeys?: string[];
            logs_to_load_loadhistory?: number;
            bStopAfterOneNotif?: boolean;
            cometd_service?: "keep_existing_gamedatas_limited" | "socketio" | string;
            onNotification(notifs_or_json: BGA.NotifsPacket | string): void;
            resynchronizeNotifications(isHistory: boolean): void;
            pullResynchronizeLogsToDisplay(): void;
            dispatchNotifications(): boolean;
            formatLog(message: string, args: {
                player_name: string;
                player_id: BGA.ID;
                i18n?: string;
                [key: string]: any;
            }): string;
            dispatchNotification(notif: BGA.Notif, disableSound?: boolean): boolean;
            addChatToLog(message: string, seeMore?: boolean, translateIcon?: boolean, extraClasses?: string): void;
            onTranslateLog(event: Event): void;
            addToLog(message: string, seeMore?: boolean, notif?: BGA.Notif | Falsy, translateIcon?: boolean, isSpectator?: boolean, instantaneous?: boolean, timestamp?: number): number;
            playerNameFilter(args: {
                player_name?: string;
                player_id?: BGA.ID;
                is_admin?: boolean;
            }): {
                player_name?: string;
                player_id?: BGA.ID;
                is_admin?: boolean;
            };
            playerNameFilterGame(args: undefined): void;
            isSynchronousNotifProcessed(): boolean;
            onSynchronousNotificationEnd(): void;
            debugReplayNotif(event: Event): void;
        } & DojoJS.DojoClassObject & {
            log_notification_name?: boolean;
        };
        isTouchDevice?: boolean;
        player_id?: BGA.ID | null;
        current_player_id?: number;
        isSpectator?: boolean;
        table_id?: BGA.ID | null;
        showMessage(message: string, type: "info" | "error" | "only_to_log" | string): void;
        ajaxcall_running: number;
        active_menu_label: BGA.
        /** The description for tiebreakers as found in the gameinfos file. This is in english and is translated when needed by the {@link BGA.TableResults} component. */
        SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings] | "";
        next_headmsg_id: number;
        cometd_is_connected: boolean;
        page_is_unloading: boolean;
        cometd_first_connect: boolean;
        cometd_subscriptions: Record<string, number>;
        reportErrorTimeout: boolean;
        next_log_id: number;
        chatbarWindows: Record<BGA.ChannelInfos["window_id"], BGA.ChatWindowMetadata>;
        jstpl_chatwindow: string;
        dockedChat?: boolean;
        dockedChatInitialized: boolean;
        groupToCometdSubs: Record<string, `/group/g${number}`>;
        window_visibility: "visible" | "hidden";
        premiumMsgAudioVideo: string | null;
        badWordList: readonly ["youporn", "redtube", "pornotube", "pornhub", "xtube", "a-hole", "dumb", "fool", "imbecile", "nutcase", "dipstick", "lunatic", "weirdo", "dork", "dope", "dimwit", "half-wit", "oaf", "bimbo", "jerk", "numskull", "numbskull", "goof", "suck", "moron", "morons", "idiot", "idi0t", "rape", "rapist", "hitler", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck ", "cocksucked ", "cocksucker", "cocksucking", "cocksucks ", "cocksuka", "cocksukka", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick ", "cuntlicker ", "cuntlicking ", "cunts", "cyalis", "cyberfuc", "cyberfuck ", "cyberfucked ", "cyberfucker", "cyberfuckers", "cyberfucking ", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates ", "ejaculating ", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck ", "fingerfucked ", "fingerfucker ", "fingerfuckers", "fingerfucking ", "fingerfucks ", "fistfuck", "fistfucked ", "fistfucker ", "fistfuckers ", "fistfucking ", "fistfuckings ", "fistfucks ", "flange", "fook", "fooker", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckings", "fuckingshitmotherfucker", "fuckme ", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged ", "gangbangs ", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex ", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off ", "jackoff", "jap", "jerk-off ", "jism", "jiz ", "jizm ", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lmfao", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked ", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking ", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers ", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim ", "orgasims ", "orgasm", "orgasms ", "p0rn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses ", "pissflaps", "pissin ", "pissing", "pissoff ", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks ", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys ", "rectum", "retards", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters ", "shitting", "shittings", "shitty ", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "enculé", "baiser", "nique", "niquer", "salope", "pute", "fuck", "f*ck", "f**k", "noob"];
        tutorialHighlightedQueue: {
            id: string;
            text: string;
            optclass: string;
        }[];
        browser_inactivity_time: number;
        bInactiveBrowser: boolean;
        red_thumbs_given: {};
        red_thumbs_taken: {};
        chatDetached?: false | {
            type: "table" | "player" | "chat" | "general" | "group" | null;
            id: number;
            chatname: string;
        };
        bChatDetached?: boolean;
        predefinedTextMessages?: BGA.SiteCorePredefinedTextMessages & Record<string, string>;
        predefinedTextMessages_untranslated?: {
            "Sorry I will continue to play later.": "tbleave";
            "Sorry I have an emergency: I'm back in few seconds...": "goodmove";
            "Good move!": "gm";
            "I would like to think a little, thank you": "think";
            "Yeah, still there, just thinking.": "stillthinkin";
            "Hey, are you still there?": "stillthere";
            "Good Game!": "gg";
            "Good luck, have fun!": "glhf";
            "Have fun!": "hf";
            "Thanks for the game!": "tftg";
        } & Record<string, string>;
        predefinedTextMessages_target_translation?: Record<keyof BGA.SiteCorePredefinedTextMessages, string>;
        timezoneDelta?: number;
        splashNotifToDisplay?: BGA.SplashNotifsToDisplay[];
        splashNotifRead?: Record<string, any>;
        bgaUniversalModals?: any;
        bgaToastHolder?: any;
        reportJsError?: boolean | "show";
        discussblock?: boolean;
        autoChatWhilePressingKey?: DijitJS.TooltipDialog;
        groupList?: (1 | null)[];
        allGroupList?: any;
        allLanguagesList?: any;
        pma?: any;
        rtc_room?: any;
        domain?: string;
        cometd_service?: "socketio" | string;
        socket?: socket.IO.Socket;
        mediaChatRating?: boolean;
        rating_step1?: InstanceType<BGA.PopinDialog>;
        rating_step2?: InstanceType<BGA.PopinDialog>;
        rating_step3?: InstanceType<BGA.
        /**
         * Checks if the interface is in lock state. This check can be used to block some other interactions which do not result in ajaxcall or if you want to suppress errors. Note: normally you only need to use `checkAction(...)`, this is for advanced cases.
         * @param nomessage (optional) If true, it will not show any error messages.
         * @returns true if the interface is in lock state.
         * @example
         * function onChangeMyMind( evt )  {
         * 	if( this.checkLock() ) {
         * 		// Do the action
         * 	}
         * }
         */
        PopinDialog>;
        rating_step4?: InstanceType<BGA.PopinDialog>;
        playerRating?: BGA.SiteCorePlayerRating;
        gamecanapprove?: boolean;
        gameisalpha?: boolean;
        hideSoundControlsTimer?: number;
        game_group?: string;
        displaySoundControlsTimer?: number;
        tutorial?: Record<number, number>;
        metasite_tutorial?: Record<number, number>;
        bHighlightPopinTimeoutInProgress?: boolean;
        highlightFadeInInProgress?: boolean;
        currentTutorialDialog?: DijitJS.TooltipDialog | null;
        current_hightlighted_additional_class?: string;
        init_core(): void;
        unload(): void;
        updateAjaxCallStatus(): void;
        changeActiveMenuItem(key: ""): "";
        changeActiveMenuItem<T extends BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings]>(key: T): T;
        subscribeCometdChannel<T extends string>(event: T, _1?: any, _2?: any): void | T;
        subscribeCometdChannels<const T extends Record<string, string>>(events: T, _1?: any, _2?: any): {} | T;
        unsubscribeCometdChannel(event: string): void;
        reconnectAllSubscriptions(): void;
        onSocketIoConnectionStatusChanged(status: "connect" | "connect_error" | "connect_timeout" | "reconnect" | "reconnect_failed" | "reconnect_attempt" | string, error?: string): void;
        onFirstConnectedToComet(): void;
        leaveTable(table_id: BGA.ID, success_callback: () => void): void;
        onSeeMoreLogs(event: Event): void;
        onIncreaseContentHeight(heightIncrease: number): void;
        onScriptError(error: ErrorEvent | string | Event, url: string, line?: number | string): void;
        initChatDockedSystem(): void;
        extractChannelInfosFromNotif(notif: BGA.ChatNotif): BGA.ChannelInfos | null;
        getChatInputArgs(channel: BGA.ChannelInfos): BGA.ChatInputArgs | null;
        onPlaceLogOnChannel(chatnotif: BGA.ChatNotif): boolean;
        onUpdateIsWritingStatus(window_id: BGA.ChannelInfos["window_id"]): void;
        createChatBarWindow(channel: BGA.ChannelInfos, subscribe?: boolean): boolean;
        onStartChatAccept(event: Event): void;
        onStartChatBlock(event: Event): void;
        onChangeStopNotifGeneralBox(event: Event): void;
        onChangeStopNotifGeneralLabel(event: Event): void;
        checkAVFrequencyLimitation(): boolean;
        setAVFrequencyLimitation(): void;
        onStartStopAudioChat(event: Event): void;
        onStartStopVideoChat(event: Event): void;
        setNewRTCMode(table_id: BGA.ID | null, target_player_id: BGA.ID | null, rtc_id: 0 | 1 | 2, connecting_player_id?: BGA.ID): void;
        onLoadPreviousMessages(event: Event): void;
        loadPreviousMessage(type: BGA.ChannelInfos["type"], id: BGA.ID): void;
        loadPreviousMessageCallback(args: {
            type: BGA.ChannelInfos["type"];
            id: number;
            status?: "underage" | "admin" | "newchat" | "newchattoconfirm" | string;
            history: BGA.ChatNotifArgs[];
        }): void;
        stackOrUnstackIfNeeded(): void;
        onUnstackChatWindow(event: Event): void;
        unstackChatWindow(window_id: BGA.ChannelInfos["window_id"], state?: BGA.ChannelInfos["start"] | "automatic"): void;
        stackChatWindowsIfNeeded(state?: BGA.ChannelInfos["start"]): void;
        stackOneChatWindow(): void;
        getNeededChatbarWidth(): number;
        adaptChatbarDock(): void;
        countStackedWindows(): number;
        closeChatWindow(window_id: BGA.ChannelInfos["window_id"]): void;
        onCloseChatWindow(event: Event): void;
        onCollapseChatWindow(event: Event): void | true;
        collapseChatWindow(window_id: BGA.ChannelInfos["window_id"], checkBottom?: any): void;
        onExpandChatWindow(event: Event): void;
        onCollapseAllChatWindow(event: Event): void;
        updateChatBarStatus(): void;
        expandChatWindow(window_id: BGA.ChannelInfos["window_id"], autoCollapseAfterMessage?: boolean): void;
        makeSureChatBarIsOnTop(window_id: BGA.ChannelInfos["window_id"]): void;
        makeSureChatBarIsOnBottom(window_id: BGA.ChannelInfos["window_id"]): void;
        onScrollDown(event: Event): void;
        onToggleStackMenu(event: Event): void;
        onCallbackBeforeChat(args: any & {
            table?: number;
        }, channel_url: string): boolean;
        isBadWorkInChat(text: string | null): boolean;
        onCallbackAfterChat(_1?: any): void;
        callbackAfterChatError(args: {
            table?: number;
        }): void;
        onDockedChatFocus(event: Event): void;
        onDockedChatInputKey(event: KeyboardEvent): void;
        onShowPredefined(event: Event): void;
        onInsertPredefinedMessage(event: Event): void;
        onInsertPredefinedTextMessage(event: Event): void;
        setGroupList(groupList: (1 | null)[] | undefined, allGroupList?: any, red_thumbs_given?: {}, red_thumbs_taken?: {}): void;
        setLanguagesList(allLanguagesList: any): void;
        setPma(pma: any): void;
        setRtcMode(rtc_mode: 0 | 2 | 1, rtc_room: any): void;
        takeIntoAccountAndroidIosRequestDesktopWebsite(e: Document): void;
        traceLoadingPerformances(): void;
        getCurrentPlayerId(): BGA.ID | undefined;
        tutorialShowOnce(e: number, t?: boolean): boolean;
        highligthElementwaitForPopinToClose(): void;
        highlightElementTutorial(id: string, text: string, optClass?: string): void;
        onElementTutorialNext(t?: Event): void;
        websiteWindowVisibilityChange(e?: {
            type: string;
        } | undefined): void;
        ackUnreadMessage(t: BGA.ChannelInfos["window_id"], i?: "unsub" | string): void;
        ackMessagesWithPlayer(e: BGA.ID, t: string[]): void;
        ackMessagesOnTable(table: BGA.ID, list: string[], unsub: boolean): void;
        onAckMsg(t: BGA.Notif): void;
        initMonitoringWindowVisibilityChange(): void;
        playingHoursToLocal(e: string, t?: false): string;
        playingHoursToLocal(e: string, t: true): string | {
            start_hour: string;
            end_hour: string;
        };
        showSplashedPlayerNotifications(t: any): void;
        displayNextSplashNotif(): void;
        onNewsRead(t: string): void;
        onDisplayNextSplashNotif(t: Event): void;
        onSkipAllSplashNotifs(t: Event): void;
        markSplashNotifAsRead(t: BGA.ID, i: boolean): void;
        inactivityTimerIncrement(): void;
        resetInactivityTimer(): void;
        onForceBrowserReload(t: BGA.Notif): void;
        doForceBrowserReload(e?: boolean): void;
        onDebugPing(): void;
        onNewRequestToken(e: BGA.Notif): void;
        onDisplayDebugFunctions(e: Event): void;
        showDebugParamsPopin(e: string, t: any[]): void;
        triggerDebug(e: string, t: string[]): void;
        onMuteSound(t?: boolean): void;
        onSetSoundVolume(e?: boolean): void;
        onToggleSound(e: Event): void;
        onDisplaySoundControls(_: Event): void;
        displaySoundControls(_: Event): void;
        onHideSoundControls(_: Event): void;
        hideSoundControls(): void;
        onStickSoundControls(_: Event): void;
        onUnstickSoundControls(event: Event): void;
        onSoundVolumeControl(_: Event): void;
        displayRatingContent(t: "video" | "audio" | "support" | "game", i: BGA.SiteCorePlayerRating | undefined): void;
        sendRating(e: "video" | "audio" | "support" | "game"): void;
        onGameRatingEnter(e: Event): void;
        onVideoRatingEnter(e: Event): void;
        onAudioRatingEnter(e: Event): void;
        onSupportRatingEnter(e: Event): void;
        processRatingEnter(rating: BGA.ID, type: "video" | "audio" | "support" | "game"): void;
        onRatingLeave(t: Event): void;
        onVideoRatingClick(e: Event): void;
        onAudioRatingClick(e: Event): void;
        onGameRatingClick(e: Event): void;
        onSupportRatingClick(e: Event): void;
        completeRatingClick(e: Event, t: "video" | "audio" | "support" | "game"): void;
        showRatingDialog_step2(t: "video" | "audio" | "support" | "game"): void;
        onAudioRatingClickIssue(e: Event): void;
        onVideoRatingClickIssue(e: Event): void;
        onGameRatingClickIssue(e: Event): void;
        completeRatingClickIssue(e: Event, t: "video" | "audio" | "support" | "game"): void;
        showRatingDialog_step3(t: "video" | "audio" | "support" | "game"): void;
        showGameRatingDialog_step4(): void;
        recordMediaStats(e: BGA.ID, t: "start" | "stop"): void;
        gamedatas?: BGA.Gamedatas | null;
        subscriptions: DojoJS.Handle[];
        tooltips: Record<string, DijitJS.Tooltip>;
        bHideTooltips: boolean;
        screenMinWidth: number;
        currentZoom: number;
        connections: {
            element: any;
            event: string;
            handle: DojoJS.Handle;
        }[];
        instantaneousMode: boolean | 0 | 1;
        webrtc: InstanceType<BGA.WebRTC> | null;
        webrtcmsg_ntf_handle: DojoJS.
        /**
         * Checks if the player can do the specified action by taking into account:
         * - If the interface is locked it will return false and show message "An action is already in progress", unless nomessage set to true.
         * - If the player is not active it will return false and show message "This is not your turn", unless nomessage set to true.
         * - If action is not in list in possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
         * - Otherwise returns true.
         * @param action The action to check if the player can do.
         * @param nomessage (optional) If true, it will not show any error messages.
         * @returns true if the player can do the specified action.
         * @example
         * function onClickOnGameElement( evt )  {
         * 	if( this.checkAction( "my_action" ) ) {
         * 		// Do the action
         * 	}
         * }
         */
        Handle | null;
        rtc_mode: 0 | 1 | 2;
        mediaConstraints: BGA.WebRTCMediaConstraints;
        gameMasculinePlayers: string[];
        gameFemininePlayers: string[];
        gameNeutralPlayers: string[];
        emoticons: {
            readonly ":)": "smile";
            readonly ":-)": "smile";
            readonly ":D": "bigsmile";
            readonly ":-D": "bigsmile";
            readonly ":(": "unsmile";
            readonly ":-(": "unsmile";
            readonly ";)": "blink";
            readonly ";-)": "blink";
            readonly ":/": "bad";
            readonly ":-/": "bad";
            readonly ":s": "bad";
            readonly ":-s": "bad";
            readonly ":P": "mischievous";
            readonly ":-P": "mischievous";
            readonly ":p": "mischievous";
            readonly ":-p": "mischievous";
            readonly ":$": "blushing";
            readonly ":-$": "blushing";
            readonly ":o": "surprised";
            readonly ":-o": "surprised";
            readonly ":O": "shocked";
            readonly ":-O": "shocked";
            readonly o_o: "shocked";
            readonly O_O: "shocked";
            readonly "8)": "sunglass";
            readonly "8-)": "sunglass";
        };
        defaultTooltipPosition: DijitJS.PlacePositions[];
        metasiteurl?: string;
        ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "iframe" | "get" | "post" | undefined): void;
        format_block(template: string, args: Record<string, any>): string;
        format_string(template: string, args: Record<string, any>): string;
        format_string_recursive(template: string, args: Record<string, any> & {
            i18n?: Record<string, any>;
            type?: string | "chatmessage" | "tablechat" | "privatechat" | "groupchat";
            message?: string;
            text?: string;
        }): string;
        clienttranslate_string(text: string): string;
        translate_client_targets(args: Record<string, any>, translationFrom?: string): void;
        register_subs(...handles: DojoJS.Handle[]): void;
        unsubscribe_all(): void;
        register_cometd_subs(...comet_ids: string[]): string | string[];
        placeOnObject(target: string | HTMLElement, location: string | HTMLElement): void;
        placeOnObjectPos(target: string | HTMLElement, location: string | HTMLElement, relativeX: number, relativeY: number): void | throws<TypeError>;
        disable3dIfNeeded(): CSSStyleDeclaration["transform"] | null;
        enable3dIfNeeded(transform: CSSStyleDeclaration["transform"] | null): void;
        getComputedTranslateZ(element: Element): number;
        transformSlideAnimTo3d(baseAnimation: InstanceType<typeof dojo.Animation>, target: HTMLElement, duration: number, delay: number, x?: number, y?: number): InstanceType<typeof dojo.Animation>;
        slideToObject(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        slideToObjectPos(target: string | HTMLElement, destination: string | HTMLElement, x: Parameters<typeof toint>[0], y: Parameters<typeof toint>[0], duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        slideToObjectPctPos(target: string | HTMLElement, destination: string | HTMLElement, xpercent: number, ypercent: number, duration?: number, delay?: number): InstanceType<typeof dojo.Animation> | throws<TypeError>;
        toRadians(angle: number): number;
        vector_rotate(vector: {
            x: number;
            y: number;
        }, angle: number): {
            x: number;
            y: number;
        };
        attachToNewParent(target: string | HTMLElement, newParent: string | HTMLElement, position?: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        attachToNewParentNoReplace(target: string | HTMLElement, newParent: string | HTMLElement, position: DojoJS.PlacePosition): HTMLElement | throws<TypeError>;
        slideTemporaryObject(temporaryHTML: Node | string | DocumentFragment, parent: string | HTMLElement, from: string | HTMLElement, to: string | HTMLElement, duration?: number, delay?: number): InstanceType<typeof dojo.Animation>;
        slideToObjectAndDestroy(target: string | HTMLElement, destination: string | HTMLElement, duration?: number, delay?: number): void;
        fadeOutAndDestroy(target: string | HTMLElement, duration?: number, delay?: number): void;
        rotateInstantTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        rotateInstantDelta(target: string | HTMLElement, delta: Parameters<typeof tofloat>[0]): void;
        rotateTo(target: string | HTMLElement, degree: Parameters<typeof tofloat>[0]): void;
        getAbsRotationAngle(target: string | Element | null): number;
        addClassToClass<T extends keyof CSSStyleDeclaration>(className: string, property: T, value: CSSStyleDeclaration[T]): void;
        connect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: keyof any): void;
        connect<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`, method: M, dontFix?: boolean): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U, method: keyof any): void;
        connect<T extends DojoJS.ConnectMethodTarget<U>, U extends string, S, M extends DojoJS.BoundFunc<S, DojoJS.ConnectMethodParams<T, U>, any>>(targetObject: T, event: U, method: M, dontFix?: boolean): void;
        disconnect<K extends keyof DojoJS.AllEvents>(targetObject: DojoJS.ConnectListenerTarget<K>, event: K | `on${K}`): void;
        disconnect<T extends DojoJS.ConnectMethodTarget<U>, U extends string>(targetObject: T, event: U): void;
        connectClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
        connectClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
        connectQuery<K extends keyof DojoJS.AllEvents>(selector: string, event: K | `on${K}`, method: keyof any): void;
        connectQuery<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(selector: string, event: K | `on${K}`, method: M): void;
        addEventToClass<K extends keyof DojoJS.AllEvents>(className: string, event: K | `on${K}`, method: keyof any): void;
        addEventToClass<K extends keyof DojoJS.AllEvents, M extends DojoJS.BoundFunc<any, [DojoJS.AllEvents[K]], any>>(className: string, event: K | `on${K}`, method: M): void;
        disconnectAll(): void;
        setCounter(counter_name: BGA.CounterNames, new_value: BGA.ID): void | throws<TypeError>;
        incCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        decrCounter(counter_name: BGA.CounterNames, delta: BGA.ID): void;
        updateCounters(counters?: Partial<{
            [x: string]: {
                counter_value: BGA.ID;
                counter_name: string;
            };
        } | undefined>): void;
        getHtmlFromTooltipinfos(helpStringTranslated: string, actionStringTranslated: string): string;
        addTooltip(target: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        addTooltipHtml(target: string, html: string, delay?: number): void;
        addTooltipToClass(className: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
        addTooltipHtmlToClass(className: string, html: string, delay?: number): void;
        removeTooltip(target: string): void;
        switchDisplayTooltips(displayType: 0 | 1): void;
        applyCommentMarkup(text: string): string;
        confirmationDialog<T = null>(message: string, yesHandler: (param: T) => any, noHandler?: ((param: T) => any) | undefined, param?: T | undefined): void;
        warningDialog(message: string, callback: () => any): void;
        infoDialog(message: string, title: string, callback?: (() => any) | undefined, useSiteDialog?: boolean): void;
        multipleChoiceDialog(message: string, choices: string[], callback: (choice: string) => void): void;
        askForValueDialog(title: string, callback: (value: string) => void, message?: string): void;
        displayScoring(anchor: string | HTMLElement, color: string, score: number, duration?: number, offset_x?: number, offset_y?: number): void;
        showBubble(anchor: string, message: string, delay?: number, duration?: number, custom_class?: string): void;
        showClick(anchor: string, left: CSSStyleDeclaration["left"] | number, top: CSSStyleDeclaration["top"] | number, backgroundColor?: CSSStyleDeclaration["backgroundColor"]): void;
        getRankString(player_rank: string | number, dontOrderLosers?: boolean | any): (typeof dontOrderLosers extends Falsy ? "1st" | "2nd" | "3rd" | `${number}th` : "Winner" | "Loser") | "not ranked" | string;
        getKarmaLabel(karma: number | string): {
            label: "Perfect" | string;
            css: "exceptional";
        } | {
            label: "Excellent" | string;
            css: "perfect";
        } | {
            label: "Very good" | string;
            css: "verygood";
        } | {
            label: "Good" | string;
            css: "good";
        } | {
            label: "Average" | string;
            css: "average";
        } | {
            label: "Not good" | string;
            css: "notgood";
        } | {
            label: "Bad" | string;
            css: "bad";
        } | {
            label: "Very bad" | string;
            css: "verybad";
        } | undefined;
        getObjectLength(obj: object): number;
        comet_subscriptions: string[];
        unload_in_progress: boolean;
        bCancelAllAjax: boolean;
        tooltipsInfos: Record<string, {
            hideOnHoverEvt: DojoJS.Handle | null;
        }>;
        mozScale: number;
        rotateToPosition: Record<string, number>;
        room: BGA.RoomId | null;
        already_accepted_room: BGA.RoomId | null;
        webpush: InstanceType<BGA.WebPush> | null;
        interface_min_width?: number;
        confirmationDialogUid?: number;
        confirmationDialogUid_called?: number;
        discussionTimeout?: Record<string, number>;
        showclick_circles_no?: number;
        number_of_tb_table_its_your_turn?: number;
        prevent_error_rentry?: number;
        transform?: keyof CSSStyleDeclaration & ("transform" | "WebkitTransform" | "msTransform" | "MozTransform" | "OTransform");
        onresizePlayerAwardsEvent?: DojoJS.Handle;
        gameinterface_zoomFactor?: number;
        ajaxpageload<Scope>(requestUrl: string, requestData: object | string, loadOnto: string | HTMLElement, callbackScope: Scope, callback: DojoJS.HitchMethod<Scope, [data: any], any>): {
            new (): import("dojo/promise/Promise")<any>;
        };
        displayUserHttpError(error_code: string | number | null): void;
        cancelAjaxCall(): void;
        applyGenderRegexps(t: string, i?: null | 0 | 1 | "0" | "1"): string;
        adaptScreenToMinWidth(min_width: number): void;
        adaptScreenToMinWidthWorker(): void;
        getObjPosition(obj: HTMLElement | string): {
            x: number;
            y: number;
        };
        doShowBubble(anchor: string, message: string, custom_class?: string): void;
        getGameNameDisplayed(text: string): string;
        formatReflexionTime(time: number): {
            string: string;
            mn: number;
            s: (string | number);
            h: number;
            positive: boolean;
        };
        strip_tags(e: string, t?: string): string;
        validURL(e: any): boolean;
        nl2br(e: any, t: any): string;
        htmlentities(e: string, t: any, i: any, n: any): string | false;
        html_entity_decode(e: any, t: any): string | false;
        get_html_translation_table(e: any, t: any): Record<string, string>;
        ucFirst(e: any): any;
        setupWebPush(): Promise<void>;
        refreshWebPushWorker(): void;
        getRTCTemplate(e: any, t: any, i: any): string;
        setupRTCEvents(t: string): void;
        getRtcVideoConstraints(rtc_id: 0 | 1 | 2): false | {
            mandatory: {
                minAspectRatio: number;
                maxAspectRatio: number;
                maxWidth: number;
                maxFrameRate: number;
            };
            optional: never[];
        };
        startRTC(): void;
        doStartRTC(): void;
        onGetUserMediaSuccess(): void;
        onGetUserMediaError(): void;
        onJoinRoom(t: any, i: any): void;
        onClickRTCVideoMax(t: Event): void;
        maximizeRTCVideo(t: any, i: any): void;
        onClickRTCVideoMin(t: any): void;
        onClickRTCVideoSize(t: any): void;
        onClickRTCVideoMic(t: any): void;
        onClickRTCVideoSpk(t: any): void;
        onClickRTCVideoCam(t: any): void;
        onLeaveRoom(t: any, i: any): void;
        onLeaveRoomImmediate(e: any): void;
        doLeaveRoom(e?: any): void;
        clearRTC(): void;
        ntf_webrtcmsg(e: any): void;
        addSmileyToText(e: string): string;
        getSmileyClassToCodeTable(): Record<string, ":)" | ":-)" | ":D" | ":-D" | ":(" | ":-(" | ";)" | ";-)" | ":/" | ":-/" | ":s" | ":-s" | ":P" | ":-P" | ":p" | ":-p" | ":$" | ":-$" | ":o" | ":-o" | ":O" | ":-O" | "o_o" | "O_O" | "8)" | "8-)">;
        makeClickableLinks(e: any, t: any): any;
        makeBgaLinksLocalLinks(e: any): any;
        ensureEbgObjectReinit(e: any): void;
        getRankClassFromElo(e: any): string;
        getColorFromElo(e: any): "#74bed1" | "#84b8de" | "#94acd6" | "#9ba5d0" | "#a99bc9" | "#b593c4";
        getRankClassFromEloUntranslated(e: any): "good" | "average" | "beginner" | "apprentice" | "strong" | "expert" | "master";
        eloToBarPercentage(e: any, t?: boolean): number;
        formatElo(e: string): number;
        formatEloDecimal(e: any): number;
        getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
        getArenaLabel(e: any, t?: any): string;
        insertParamIntoCurrentURL(e: any, t: any): void;
        playerawardsCollapsedAlignement(): void;
        playerawardCollapsedAlignement(t: any): void;
        arenaPointsDetails(e: any, t?: any): {
            league: 0 | 2 | 1 | 3 | 4 | 5;
            league_name: string;
            league_shortname: string;
            league_promotion_shortname: string;
            points: number;
            arelo: number;
        };
        arenaPointsHtml(t: {
            league_name: string;
            league: 0 | 1 | 2 | 3 | 4 | 5;
            arelo: number;
            points: number | null;
            league_promotion_shortname?: string | null;
        }): {
            bar_content: string;
            bottom_infos: string;
            bar_pcent: string;
            bar_pcent_number: string | number;
        };
        declaredClass: string;
        inherited<U>(args: IArguments): U;
        inherited<U>(args: IArguments, newArgs: any[]): U;
        inherited(args: IArguments, get: true): Function | void;
        inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
        inherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
        __inherited: {
            <U>(args: IArguments): U;
            <U>(args: IArguments, newArgs: any[]): U;
            (args: IArguments, get: true): Function | void;
            <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, newArgs?: Parameters<DojoJS.Hitched<any, T, []>> | undefined): ReturnType<DojoJS.Hitched<any, T, []>>;
            <T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments, get: true): DojoJS.Hitched<any, T, []>;
        };
        getInherited(args: IArguments): Function | void;
        getInherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments): DojoJS.Hitched<any, T, []>;
        isInstanceOf(cls: any): boolean;
    } & Gamegui_Template, []>;
    export = Gamegui;
    global {
        namespace BGA {
            type Gamegui = typeof Gamegui;
            interface EBG {
                core: EBG_CORE;
            }
            interface EBG_CORE {
                gamegui: Gamegui;
            }
        }
        var ebg: BGA.EBG;
        /** A global variable caused by bad code in ebg/core/gamegui:addActionButton. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var tpl: {
            id: string;
            label: string;
            addclass: string;
        } | undefined;
        /** A global variable caused by bad code in ebg/core/gamegui:switchToGameResults. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var countVisibleDialog: number | undefined;
        /** A global variable caused by bad code in ebg/core/gamegui:buildScoreDlgHtmlContent. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var rank: BGA.ID;
        /** A global variable representing the html score template. See {@link jstpl_score_entry} for the default score template. */
        var jstpl_score_entry_specific: string | undefined;
        var g_gamelogs: Record<BGA.ID, BGA.NotifsPacket> | {
            data: {
                data: Record<BGA.ID, BGA.NotifsPacket>;
            };
        };
        /** A global variable caused by bad code in ebg/core/gamegui:displayTableWindow. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var col_id: string | undefined;
        interface Window extends Type<{
            [hotseat_iframe: `hotseat_iframe_${number}`]: HTMLIFrameElement;
        }> {
        }
    }
}
declare module "ebg/stock" {
    type GamePage = InstanceType<typeof import("ebg/core/gamegui")>;
    global {
        namespace BGA {
            interface StockItem {
                id: BGA.ID;
                type: BGA.ID;
                loc?: string | HTMLElement;
            }
            interface StockItemType {
                /** The sort priority when arranging items to be displayed within a stock. Lower values are displayed first. If two items have the same weight, the are sorted by the order by which they were added to the stock. */
                weight: number;
                /** The sprite sheet URL for this `BGA.StockItemType`. This image should contain a grid of images matching the `itemWidth` and `itemHeight` used for the `Stock.create(..)` method. If this sprite sheet is not a single row of images, the `Stock.image_items_per_row` property is used to specify the number of sprites per row in this image. */
                image: string;
                /** The sprite sheet position for this `BGA.StockItemType`. This is a zero indexed number defined by the following formula: `row * Stock.image_items_per_row + col`. This number should never exceed the number of sprites in the sprite sheet. */
                image_position: number;
            }
            /** For each stock control, you can specify a selection mode. The selection mode determines how the user can interact with the items in the stock. */
            interface StockSelectionMode {
                /** No item can be selected by the player. */
                NONE: 0;
                /** A maximum of one item can be selected by the player at a time. */
                SINGLE: 1;
                /** Default. Multiple items can be selected by the player at the same time. */
                MULTI: 2;
            }
            /**
             * For each stock control, you can specify a selection highlighting type:
             * - 'border': there will be a red border around selected items (this is the default). The attribute 'apparenceBorderWidth' can be used to manage the width of the border (in pixels)
             * - 'disappear': the selected item will fade out and disappear. This is useful when the selection has the effect of destroying the item
             * - 'class': there will be an extra stockitem_selected css class added to the element when it is selected (and removed when unselected). The name of the class can be changed by using the selectionClass attribute. You can also override the default class in the css file for your game but beware of the !important keyword.
             *
             * By default this class definition is:
             *
             * .stockitem_selected {
             * 	border: 2px solid red ! important;
             * }
             *
             * If you want to override it (for example, to change the border color) add this in your <game>.css file:
             *
             * .stockitem_selected {
             * 	border: 2px solid orange ! important;
             * }
             */
            type StockSelectionAppearance = 'border' | 'disappear' | 'class';
        }
    }
    /**
     * A component that you can use in your game interface to display a set of elements of the same size that need to be arranged in single or multiple lines. Usually used for displaying cards and tokens in a flexible way. This component can be used to:
     * - Display a set of cards, typically hands (examples: Hearts, Seasons, The Boss, Race for the Galaxy).
     * - Display items in player panels (examples: Takenoko, Amyitis, ...)
     * - Black dice and cubes on cards in Troyes are displayed with stock components.
     * @see {@link https://en.boardgamearena.com/doc/Stock|Documentation}
     *
     *
     * Most cases will be one of the following situations:
     *
     * Situation A:
     *
     * When you add a card to a stock item, and this card is not coming from another stock:
     * Use addToStockWithId with a "from" argument set to the element of your interface where the card should come from (i.e. div id). For example if you want to "reveal" card from player hand and it is not an interface element you can set from to be 'player_board_'+activePlayerId (where activePlayerId is player who played that card).
     *
     * Situation B:
     *
     * When you add a card to a stock item, and this card is coming from another stock:
     * On the destination Stock, use addToStockWithId with a "from" argument which is the HTML id of the corresponding item in the source Stock. For example, if the source stock id is "myHand", then the HTML id of card 48 is "myHand_item_48".
     * Then, remove the source item with removeFromStockById. Note: do NOT set the 'to' argument in this call, otherwise you'll get two animations.
     * (Note that it's important to do things in this order, because the source item must still exist when you use it as the origin of the slide.)
     *
     * Situation C:
     *
     * When you move a card from a stock item to something that is not a stock item:
     * Insert the card as a classic HTML template (dojo.place / this.format_block).
     * Place it on the Stock item with this.placeOnObject, using the Stock item HTML id (see above).
     * Slide it to its new position with this.slideToObject.
     * Remove the card from the Stock item with removeFromStockById.
     *
     * Using the methods above, your cards should slide to, from, and between your Stock controls smoothly.
     */
    class Stock_Template {
        page: GamePage | null;
        /** The div element to attach all of the stock items to. */
        container_div: Element | string | null;
        item_height: number | null;
        item_width: number | null;
        backgroundSize: string | null;
        /** A dictionary of all defined item types, listed by type id. */
        item_type: Record<BGA.ID, BGA.StockItemType>;
        items: BGA.StockItem[];
        item_selected: Record<number, number>;
        next_item_id: number;
        /** The id of the container_div. */
        control_name: string | null;
        selectable: BGA.StockSelectionMode[keyof BGA.StockSelectionMode];
        selectionApparance: BGA.StockSelectionAppearance;
        apparenceBorderWidth: CSSStyleDeclaration["borderWidth"];
        selectionClass: string;
        /** Defines the extra classes that should be added to the stock items, joined as a space separated string. */
        extraClasses: string;
        /**
         * Center the stock items in the middle of the stock container.
         * @example this.myStock.centerItems = true;
         */
        centerItems: boolean;
        /** Margin between items of a stock. Default is 5 pixels. */
        item_margin: number;
        /**
         * Stock does not play well if you attempt to inline-block it with other blocks, to fix that you have to set this flag which will calculate width properly
         * @example mystock.autowidth = true;
         */
        autowidth: boolean;
        /** If true, the items will be ordered based on the weights given. */
        order_items: boolean;
        /**
         * Make items of the stock control "overlap" each other, to save space. By default, horizontal_overlap is 0 (but there is also item_margin which affects spacing).
         * When horizontal_overlap=20, it means that a stock item will overlap to only show 20% of the width of all the previous items. horizontal_overlap can't be greater than 100.
         */
        horizontal_overlap: number;
        /** There is two modes, in one mode it used to adjust every 2nd item (See the games "Jaipur" or "Koryŏ"), second mode when setting use_vertical_overlap_as_offset=false is more/less normal overlap with vertical layout except its perentage of overlap (opposite of horizontal_overlap). */
        vertical_overlap: number;
        /** If set to true, the vertical overlap will instead be applied to every other element creating a staggered effect. */
        use_vertical_overlap_as_offset: boolean;
        /**
         * Using onItemCreate, you can trigger a method each time a new item is added to the Stock, in order to customize it.
         * @param item_div The div element of the item that was created.
         * @param typeId The type id of the item that was created. This must be a type id that was previously defined with `addItemType`.
         * @param item_div_id The unique name of the stock item.
         * @returns {void}
         * @example
         * // During "setup" phase, we associate our method "setupNewCard" with the creation  of a new stock item:
         * this.myBGA.StockItem.onItemCreate = dojo.hitch( this, 'setupNewCard' );
         *
         * // And here is our "setupNewCard":
         * setupNewCard: function( card_div, card_type_id, card_id )
         * {
         * 	// Add a special tooltip on the card:
         * 	this.addTooltip( card_div.id, _("Some nice tooltip for this item"), '' );
         * 	// Note that "card_type_id" contains the type of the item, so you can do special actions depending on the item type
         * 	// Add some custom HTML content INSIDE the Stock item:
         * 	dojo.place( this.format_block( 'jstpl_my_card_content', {
         * 		....
         * 	} ), card_div.id );
         * }
         */
        onItemCreate: ((item_div: HTMLElement, typeId: BGA.ID, item_div_id: `${string}_item_${number}`) => void) | null;
        /**
        * Function handler called when div is removed. This is useful to clean up any event handlers or other data associated with the div.
        * @param itemDiv The div element of the item that is being deleted.
        * @param typeId The type id of the item that is being deleted. This will be a type id that was previously defined with `addItemType`.
        * @param itemId The unique id of the item that is being deleted. This id will be unique within the stock and is used to identify the item when removing it from the stock.
        * @returns {void}
        * @example
        * this.myStock.onItemDelete = (itemDiv, typeId, itemId) => { console.log("card deleted from myStock: "+itemId); };
        */
        onItemDelete: ((item_div_id: string, typeId: BGA.ID, itemId: BGA.ID) => void) | null;
        /**
         * The template used to crete the item divs. This template can (and likely should) include the following variables in the form of ${variableName}: id, extra_classes, top, left, width, height, position, image, additional_style.
         * @example
         * // This is the default template
         * mystock.jstpl_stock_item ='<div id="${id}" class="stockitem ${extra_classes}" style="top:${top}px;left:${left}px;width:${width}px;height:${height}px;${position};background-image:url(\'${image}\');${additional_style}"></div>';
         */
        jstpl_stock_item: string;
        image_items_per_row: number | null;
        image_in_vertical_row: boolean;
        hResize: DojoJS.Handle | null;
        /** The duration of all animations in milliseconds. Default is 1000ms. */
        duration: number;
        /**
         * Initializes the stock component for the specified `game` on a specified `target`
         * @param {Gamegui} game The game object
         * @param {HTMLElement} container_div The div element to attach the stock to. This element should be empty and normally should be directly defined within the .tpl file.
         * @param {number} itemWidth The width of a single item in pixels. This used for displaying the item and for cropping the sprite sheet image of all items when `addItemType`.
         * @param {number} itemHeight The height of a single item in pixels. This used for displaying the item and for cropping the sprite sheet image of all items when `addItemType`.
         * @returns {void}
         * @example
         * // Create player hand from inside the game class
         * this.playerHand = new ebg.stock();
         * this.playerHand.create( this, $('myhand'), this.cardwidth, this.cardheight );
         */
        create(page: GamePage, container_div: Element | string, itemWidth: number, itemHeight: number): void;
        /**
         * Un-sets all state properties of the stock (including current items) and disconnects the resize handle. This has no external effect and does not destroy any html elements.
         */
        destroy(): void;
        /**
         * Define a new type of item, `BGA.StockItemType`, and add it to the stock with given type id. It is mandatory to define a new item type before adding it to the stock. The list of defined item types are always available in `item_type` property.
         * @param typeId
         * @param weight {@link BGA.StockItemType.weight} The sort priority when arranging items to be displayed within a stock. Lower values are displayed first. If two items have the same weight, the are sorted by the order by which they were added to the stock.
         * @param image {@link BGA.StockItemType.image} The sprite sheet URL for this `BGA.StockItemType`. This image should contain a grid of images matching the `itemWidth` and `itemHeight` used for the `Stock.create(..)` method. If this sprite sheet is not a single row of images, the `Stock.image_items_per_row` property is used to specify the number of sprites per row in this image.
         * @param image_pos {@link BGA.StockItemType.image_position} The sprite sheet position for this `BGA.StockItemType`. This is a zero indexed number defined by the following formula: `row * Stock.image_items_per_row + col`. This number should never exceed the number of sprites in the sprite sheet.
         * @returns {void}
         */
        addItemType(typeId: BGA.ID, weight: number, image: string, image_pos?: number | Falsy): void;
        /**
         * Add an item to the stock, with the specified type, but without a unique ID. This is useful when items of the same type don't need to be uniquely identified. For example, a pile of money tokens in a game. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
         * @param typeId The type id of the item to add to the stock. This must be a type id that was previously defined with `addItemType`.
         * @param from The element to animate the item from. When the `from` parameter is specified, the item will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the item will be created and placed immediately inside the stock.
         * @returns {void}
         */
        addToStock(typeId: BGA.ID, from?: string | HTMLElement): void;
        /**
         * Add an item to the stock, with the specified type and unique ID. This is useful when items of the same type need to be uniquely identified. For example, if there are two of the same cards but in different orders (like a draw area), the position of the card within the stock is important. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
         * @param typeId The type id of the item to add to the stock. This must be a type id that was previously defined with `addItemType`.
         * @param itemId The unique id of the item to add to the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @param from The element to animate the item from. When the `from` parameter is specified, the item will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the item will be created and placed immediately inside the stock.
         * @param loc The target location for this specific stock item.
         * @returns {void}
         */
        addToStockWithId(typeId: BGA.ID, itemId: BGA.ID, from?: string | HTMLElement, loc?: string | HTMLElement): void;
        /**
         * Remove an item of the specific type from the stock. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
         * @param typeId The type id of the item to be removed from the stock. This must be a type id that was previously defined with `addItemType`, and the item must have been added to the stock with `addToStock`.
         * @param to The element to animate the item to. When the `to` parameter is specified, the item will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the item to a specific location on the page. Either way, the item is destroyed after the animation is complete.
         * @param noupdate Default is false. If set to "true" it will prevent the Stock display from changing. This is useful when multiple (but not all) items are removed at the same time, to avoid ghost items appearing briefly. If you pass noupdate you have to call updateDisplay() after all items are removed.
         * @returns {boolean}
         */
        removeFromStock(typeId: BGA.ID, to?: string | HTMLElement, noupdate?: boolean): boolean;
        /**
         * Remove an item of the specific type from the stock. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
         * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @param to The element to animate the item to. When the `to` parameter is specified, the item will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the item to a specific location on the page. Either way, the item is destroyed after the animation is complete.
         * @param noupdate Default is false. If set to "true" it will prevent the Stock display from changing. This is useful when multiple (but not all) items are removed at the same time, to avoid ghost items appearing briefly. If you pass noupdate you have to call updateDisplay() after all items are removed.
         * @returns {boolean}
         */
        removeFromStockById(itemId: BGA.ID, to?: string | HTMLElement, noupdate?: boolean): boolean;
        _removeFromStockItemInPosition(index: BGA.ID, to?: string | HTMLElement, noupdate?: boolean): void | throws<TypeError>;
        /** Removes all items from the stock. */
        removeAll(): void;
        /**
         * Removes all items from the stock.
         * @param to The element to animate the items to. When the `to` parameter is specified, the items will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the items to a specific location on the page. Either way, the items are destroyed after the animation is complete.
         * @returns {void}
        */
        removeAllTo(to?: string | HTMLElement): void;
        /**
         * Return an array with all the types of items present in the stock right now.
         * @returns Key-value pairs of the type id and the number of items of that type in the stock.
         * @example
         * this.myStockControl.removeAll();
         * this.myStockControl.addToStock( 65 );
         * this.myStockControl.addToStock( 34 );
         * this.myStockControl.addToStock( 89 );
         * this.myStockControl.addToStock( 65 );
         *
         * // The following returns: { 34:1,  65:1,  89:1  }
         * var item_types = this.myStockControl.getPresentTypeList();
         */
        getPresentTypeList(): Record<BGA.ID, 1>;
        /**
         * A pure function that returns the id for an item given it's id. Same as `{container_div.id}`_item_{itemId}`.
         * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @returns Returns `{container_div.id}`_item_{itemId}`.
         */
        getItemDivId(itemId: BGA.ID): `${string}_item_${number}`;
        /**
         * Returns the total number of items in the stock.
         * @returns The total number of items in the stock.
         */
        count(): number;
        /** Same as {@link count} */
        getItemNumber(): number;
        /**
         * Returns the array of items in the stock. The array is a shallow copy of the internal array of items.
         * @returns An array of items in the stock.
         */
        getAllItems(): BGA.StockItem[];
        getItemsByType(typeId: BGA.ID): BGA.StockItem[];
        getFirstItemOfType(typeId: BGA.ID): BGA.StockItem | null;
        getItemsByWeight(weight: number): BGA.StockItem[];
        getFirstItemWithWeight(weight: number): BGA.StockItem | null;
        /**
         * Returns the item with the specified unique id. Only useful for obtaining the item's type id.
         * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @returns The item with the specified unique id.
         */
        getItemById(itemId: BGA.ID): BGA.StockItem | null;
        getItemTypeById(itemId: BGA.ID): BGA.ID | null;
        /**
         * Returns the type id of the item with the specified unique id. If you want the weight of an item using the type, use item_type[typeId].weight.
         * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @returns The type id of the item with the specified unique id
         */
        getItemWeightById(itemId: BGA.ID): number | null;
        /**
         * Sets the selection mode for the stock. The selection mode determines how the user can interact with the items in the stock.
         * @param mode The selection mode to set for the stock.
         * @returns {void}
         */
        setSelectionMode<T extends keyof BGA.StockSelectionMode>(mode: BGA.StockSelectionMode[T]): void;
        /** Sets the selection appearance for the stock. @see BGA.StockSelectionAppearance */
        setSelectionAppearance(appearanceType: BGA.StockSelectionAppearance): void;
        /**
         * Predicate function that returns true if the item with the specified unique id is selected.
         * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @returns True if the item with the specified unique id is selected.
         */
        isSelected(itemId: BGA.ID): boolean;
        /**
         * Selects the item with the specified unique id.
         * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @returns {void}
         */
        selectItem(itemId: BGA.ID): void;
        selectAll(): void;
        /**
         * Deselects the item with the specified unique id.
         * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @returns {void}
         */
        unselectItem(itemId: BGA.ID): void;
        /** Deselects all items in the stock. */
        unselectAll(): void;
        onClickOnItem(event: Event): void;
        /**
         * Selects all items in the stock matching the specified type id.
         * @param typeId The type id of the items to be selected. This must be a type id that was previously defined with `addItemType`.
         * @returns {void}
         */
        selectItemsByType(typeId: BGA.ID): void;
        /**
         * Deselects all items in the stock matching the specified type id.
         * @param typeId The type id of the items to be deselected. This must be a type id that was previously defined with `addItemType`.
         * @returns {void}
         */
        unselectItemsByType(typeId: BGA.ID): void;
        /**
         * A callback function that should be overridden when listening for changes in a stocks selection. This callback method is called when the player selects/unselects an item of the stock.
         * @param control_name The name of the stocks control. Same as Stick.container_div.id.
         * @param item_id The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
         * @returns {void}
         * @example
         * dojo.connect( this.myStockControl, 'onChangeSelection', this, 'onMyMethodToCall' );
         * (...)
         * onMyMethodToCall: function( control_name, item_id )
         * {
         *     // This method is called when myStockControl selected items changed
         *     var items = this.myStockControl.getSelectedItems();
         *
         *     // (do something)
         * },
         *  */
        onChangeSelection: (control_name: string, item_id?: BGA.ID) => void;
        /**
         * Returns an array of all the items in the stock that are currently selected.
         * @returns An array of all the items in the stock that are currently selected.
         * @example
         * [
         * 	{ type:1,  id:  1001 },
         * 	{ type:1,  id:  1002 },
         * 	{ type:3,  id:  1003 }
         * 	...
         * ]
         */
        getSelectedItems(): BGA.StockItem[];
        /**
         * Returns an array of all the items in the stock that are currently unselected.
         * @returns An array of all the items in the stock that are currently unselected.
         * @example
         * [
         * 	{ type:1,  id:  1001 },
         * 	{ type:1,  id:  1002 },
         * 	{ type:3,  id:  1003 }
         * 	...
         * ]
         */
        getUnselectedItems(): BGA.StockItem[];
        /** If you moved an item from the stock control manually (ex: after a drag'n'drop) and want to reset their positions to their original ones, you can call this method. Note: it is the same as updateDisplay() without arugment, not sure why there are two methods. */
        resetItemsPosition(): void;
        /**
         * Update the display completely.
         * @param from The element to animate the item from. When the `from` parameter is specified, all new items will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the items will be created and placed immediately inside the stock.
         * @example this.myStockControl.updateDisplay();
         */
        updateDisplay(from?: string | HTMLElement): void;
        /**
         * With this method you can change dynamically the weight of the item types in a stock control. Items are immediately re-sorted with the new weight.
         * @param weightDictionary A dictionary of item type ids and their new weights. The key is the type id and the value is the new weight. If a type id is not present in the dictionary, it is not changed.
         * @example
         * // Item type 1 gets a new weight of 10, 2 a new weight of 20, 3 a new weight of 30.
         * this.myStockControl.changeItemsWeight( { 1: 10, 2: 20, 3: 30 } );
         * @example
         * // Be careful with object initialisers with variables, use the bracket notation.
         * // Item type 1 gets a new weight of 10
         * var card_type = 1;
         * this.myStockControl.changeItemsWeight( { [card_type]: 10 } );
         */
        changeItemsWeight(weightDictionary: Record<BGA.ID, number>): void;
        sortItems(): void;
        /**
         * This functions sents stock `horizontal_overlap` and `vertical_overlap`, the calls `updateDisplay()`.
         * @param horizontal_percent Make items of the stock control "overlap" each other, to save space. By default, horizontal_overlap is 0 (but there is also item_margin which affects spacing). When horizontal_overlap=20, it means that a stock item will overlap to only show 20% of the width of all the previous items. horizontal_overlap can't be greater than 100.
         * @param vertical_percent There is two modes, in one mode it used to adjust every 2nd item (See the games "Jaipur" or "Koryŏ"), second mode when setting use_vertical_overlap_as_offset=false is more/less normal overlap with vertical layout except its perentage of overlap (opposite of horizontal_overlap).
         */
        setOverlap(horizontal_percent: number, vertical_percent?: number): void;
        /**
         * Resets the controls item width and height.
         * @param width
         * @param height
         * @param background_width
         * @param background_height
         * @returns {void}
         * @example stock.resizeItems(100, 120, 150, 170);
        */
        resizeItems(width: number, height: number, background_width?: number, background_height?: number): void;
    }
    let Stock: DojoJS.DojoClass<Stock_Template, []>;
    export = Stock;
    global {
        namespace BGA {
            type Stock = typeof Stock;
            interface EBG {
                stock: Stock;
            }
        }
        var ebg: BGA.EBG;
        /** A global variable caused by bad code in ebg/stock:updateDisplay. Don't use a global variable with this name or it may unexpectedly be overriden. */
        var additional_style: string;
    }
}
declare module "ebg/wrapper" {
    class Wrapper_Template {
        page: any;
        container_div: HTMLElement | null;
        container_id: string | null;
        container_inner_div: HTMLElement | null;
        container_inner_id: string | null;
        item_size: number;
        create(page: any, id: string, inner: HTMLElement): void;
        rewrap(): void;
    }
    let Wrapper: DojoJS.DojoClass<Wrapper_Template, []>;
    export = Wrapper;
    global {
        namespace BGA {
            type Wrapper = typeof Wrapper;
            interface EBG {
                wrapper: Wrapper;
            }
        }
        var ebg: BGA.EBG;
    }
}
declare module "ebg/zone" {
    type CorePage = InstanceType<typeof import("ebg/core/core")>;
    interface XYWH {
        x: number;
        y: number;
        w: number;
        h: number;
    }
    /**
     * The Zone component is meant to organise items of the same type inside a predefined space.
     *
     * Zones are not great at responsive design and are intended for fixed-size spaces. If you want a responsive zone-like structure, you should use the {@link Stock} component instead.
     * @example
     * // Zone's always target an existing HTML element. In your template file, define the area you want to use as a zone. This should be styled to have a fixed size, or us should use the 'SetFluidWidth' method to make it responsive.
     * <div id="my_zone" style="width: 100px;"></div>
     *
     * // Then create the zone and set the pattern you want to use to organize the items.
     * this.my_zone = new ebg.zone();
     * this.my_zone.create(this, $('my_zone'), <item_width>, <item_height>);
     * this.my_zone.setPattern( <mode> ); // See 'setPattern' for available modes.
     *
     * // Then you can add and remove items using their DOM ids:
     * this.my_zone.placeInZone( <item_id> );
     * this.my_zone.removeFromZone( <item_id> );
    * The interface for the `ebg/zone` module.
    * Partial: This has been partially typed based on a subset of the BGA source code.
    */
    class Zone_Template {
        page: CorePage | null;
        container_div: HTMLElement | null;
        item_height: number | null;
        item_width: number | null;
        instantaneous: boolean;
        items: {
            id: string;
            weight: number;
        }[];
        control_name: string | null;
        item_margin: number;
        autowidth: boolean;
        autoheight: boolean;
        item_pattern: 'grid' | 'diagonal' | 'verticalfit' | 'horizontalfit' | 'ellipticalfit' | 'custom';
        /**
         * Initializes the field values for this zone, and updates the container_div position type if needed.
         * @param page The game which this zone is a part of.
         * @param container_div The div that will contain the items in this zone.
         * @param item_width An integer for the width of the objects you want to organize in this zone.
         * @param item_height An integer for the height of the objects you want to organize in this zone.
         */
        create(page: CorePage, container_div: HTMLElement, item_width: number, item_height: number): void;
        /** Connects an `onresize` event to the window which will update this zone's display. */
        setFluidWidth(): void;
        /**
         * Sets what pattern the zone uses to position and arrange elements. The zone package comes with many positioning patterns pre-coded; these allow your items to take on a variety of arrangements.
         * @param pattern The pattern to use for this zone. The following patterns are available:
         * - 'grid' (which is the default, if you never actually call setPattern)
         * - 'diagonal'
         * - 'verticalfit'
         * - 'horizontalfit'
         * - 'ellipticalfit'
         * - 'custom'
        */
        setPattern(pattern: typeof this.item_pattern): void;
        /** Checks if this zone contains an item with the matching DOM id. */
        isInZone(id: string): boolean;
        /**
         * After creating an object that you want to add to the zone as a classic HTML template (dojo.place / this.format_block), this is used to add and position the object in the zone.
         * @param target_id The DOM id of the object to add to the zone.
         * @param weight The weight of the object to add to the zone. This is used to determine the order of the items in the zone. Whenever a new item is added, all elements in the items array is sorted by weight, in ascending order with ties broken by the order they were added.
         */
        placeInZone(target_id: string, weight?: number): void;
        /**
         * Removes the object with the matching DOM id from the zone.
         * @param target The DOM id of the object to remove from the zone.
         * @param destroy If true, the object will be removed from the DOM entirely. If false, the object will be removed from the zone but remain in the DOM.
         * @param animateTo If set, the object will animate to the specified DOM element (using {@link Gamegui.slideToObject}). This happens before the object is destroyed if destroy is true.
         */
        removeFromZone(target: string | HTMLElement, destroy: boolean, animateTo: string | HTMLElement): void;
        /**
         * Removes and destroys all objects from the zone.
         */
        removeAll(): void;
        /**
         * Repositions all objects in the zone. This is useful if the zone's size has changed, or if the pattern has changed.
         */
        updateDisplay(): void;
        /**
         * Determines the position of an item based on the zone's pattern.
         * @param index The index of the item in the zone.
         * @param width The width of the zone.
         * @param height The height of the zone.
         * @param count The number of items in the zone.
         */
        itemIdToCoords(index: number, width: number, height: number, count: number): XYWH;
        itemIdToCoordsGrid(index: number, width: number): XYWH;
        itemIdToCoordsDiagonal(index: number, width: number): XYWH;
        itemIdToCoordsVerticalFit(index: number, width: number, height: number, count: number): XYWH;
        itemIdToCoordsHorizontalFit(index: number, width: number, height: number, count: number): XYWH;
        itemIdToCoordsEllipticalFit(index: number, width: number, height: number, count: number): XYWH;
        /** Returns the count of items within this zone. */
        getItemNumber(): number;
        /**
         * Returns the DOM id for all elements in the zone, in order of how they are displayed (weight and order added).
        */
        getItems(): string[];
    }
    let Zone: DojoJS.DojoClass<Zone_Template, []>;
    export = Zone;
    global {
        namespace BGA {
            type Zone = typeof Zone;
            interface EBG {
                zone: Zone;
            }
        }
        var ebg: BGA.EBG;
    }
}
/// <amd-module name="ebg/layer/nls/ly_studio_ROOT" />
declare module "ebg/layer/nls/ly_studio_ROOT" {
    const _default_45: {
        "dijit/nls/loading": {
            loadingState: string;
            errorState: string;
            _localized: {
                al: number;
                ar: number;
                az: number;
                bg: number;
                bs: number;
                ca: number;
                cs: number;
                da: number;
                de: number;
                el: number;
                es: number;
                eu: number;
                fi: number;
                fr: number;
                he: number;
                hr: number;
                hu: number;
                id: number;
                it: number;
                ja: number;
                kk: number;
                ko: number;
                mk: number;
                nb: number;
                nl: number;
                pl: number;
                pt: number;
                "pt-pt": number;
                ro: number;
                ru: number;
                sk: number;
                sl: number;
                sr: number;
                sv: number;
                th: number;
                tr: number;
                uk: number;
                zh: number;
                "zh-tw": number;
            };
        };
        "dijit/nls/common": {
            buttonOk: string;
            buttonCancel: string;
            buttonSave: string;
            itemClose: string;
            _localized: {
                al: number;
                ar: number;
                az: number;
                bg: number;
                bs: number;
                ca: number;
                cs: number;
                da: number;
                de: number;
                el: number;
                es: number;
                eu: number;
                fi: number;
                fr: number;
                he: number;
                hr: number;
                hu: number;
                id: number;
                it: number;
                ja: number;
                kk: number;
                ko: number;
                mk: number;
                nb: number;
                nl: number;
                pl: number;
                pt: number;
                "pt-pt": number;
                ro: number;
                ru: number;
                sk: number;
                sl: number;
                sr: number;
                sv: number;
                th: number;
                tr: number;
                uk: number;
                zh: number;
                "zh-tw": number;
            };
        };
        "dijit/form/nls/validate": {
            invalidMessage: string;
            missingMessage: string;
            rangeMessage: string;
            _localized: {
                al: number;
                ar: number;
                az: number;
                bg: number;
                bs: number;
                ca: number;
                cs: number;
                da: number;
                de: number;
                el: number;
                es: number;
                eu: number;
                fi: number;
                fr: number;
                he: number;
                hr: number;
                hu: number;
                id: number;
                it: number;
                ja: number;
                kk: number;
                ko: number;
                mk: number;
                nb: number;
                nl: number;
                pl: number;
                pt: number;
                "pt-pt": number;
                ro: number;
                ru: number;
                sk: number;
                sl: number;
                sr: number;
                sv: number;
                th: number;
                tr: number;
                uk: number;
                zh: number;
                "zh-tw": number;
            };
        };
        "dijit/form/nls/ComboBox": {
            previousMessage: string;
            nextMessage: string;
            _localized: {
                al: number;
                ar: number;
                az: number;
                bg: number;
                bs: number;
                ca: number;
                cs: number;
                da: number;
                de: number;
                el: number;
                es: number;
                eu: number;
                fi: number;
                fr: number;
                he: number;
                hr: number;
                hu: number;
                id: number;
                it: number;
                ja: number;
                kk: number;
                ko: number;
                mk: number;
                nb: number;
                nl: number;
                pl: number;
                pt: number;
                "pt-pt": number;
                ro: number;
                ru: number;
                sk: number;
                sl: number;
                sr: number;
                sv: number;
                th: number;
                tr: number;
                uk: number;
                zh: number;
                "zh-tw": number;
            };
        };
        "dijit/_editor/nls/commands": {
            bold: string;
            copy: string;
            cut: string;
            delete: string;
            indent: string;
            insertHorizontalRule: string;
            insertOrderedList: string;
            insertUnorderedList: string;
            italic: string;
            justifyCenter: string;
            justifyFull: string;
            justifyLeft: string;
            justifyRight: string;
            outdent: string;
            paste: string;
            redo: string;
            removeFormat: string;
            selectAll: string;
            strikethrough: string;
            subscript: string;
            superscript: string;
            underline: string;
            undo: string;
            unlink: string;
            createLink: string;
            toggleDir: string;
            insertImage: string;
            insertTable: string;
            toggleTableBorder: string;
            deleteTable: string;
            tableProp: string;
            htmlToggle: string;
            foreColor: string;
            hiliteColor: string;
            plainFormatBlock: string;
            formatBlock: string;
            fontSize: string;
            fontName: string;
            tabIndent: string;
            fullScreen: string;
            viewSource: string;
            print: string;
            newPage: string;
            systemShortcut: string;
            ctrlKey: string;
            appleKey: string;
            _localized: {
                al: number;
                ar: number;
                az: number;
                bg: number;
                bs: number;
                ca: number;
                cs: number;
                da: number;
                de: number;
                el: number;
                es: number;
                eu: number;
                fi: number;
                fr: number;
                he: number;
                hr: number;
                hu: number;
                id: number;
                it: number;
                ja: number;
                kk: number;
                ko: number;
                mk: number;
                nb: number;
                nl: number;
                pl: number;
                pt: number;
                "pt-pt": number;
                ro: number;
                ru: number;
                sk: number;
                sl: number;
                sr: number;
                sv: number;
                th: number;
                tr: number;
                uk: number;
                zh: number;
                "zh-tw": number;
            };
        };
        "dijit/_editor/nls/FontChoice": {
            "1": string;
            "2": string;
            "3": string;
            "4": string;
            "5": string;
            "6": string;
            "7": string;
            fontSize: string;
            fontName: string;
            formatBlock: string;
            serif: string;
            "sans-serif": string;
            monospace: string;
            cursive: string;
            fantasy: string;
            noFormat: string;
            p: string;
            h1: string;
            h2: string;
            h3: string;
            pre: string;
            _localized: {
                al: number;
                ar: number;
                az: number;
                bg: number;
                bs: number;
                ca: number;
                cs: number;
                da: number;
                de: number;
                el: number;
                es: number;
                eu: number;
                fi: number;
                fr: number;
                he: number;
                hr: number;
                hu: number;
                id: number;
                it: number;
                ja: number;
                kk: number;
                ko: number;
                mk: number;
                nb: number;
                nl: number;
                pl: number;
                pt: number;
                "pt-pt": number;
                ro: number;
                ru: number;
                sk: number;
                sl: number;
                sr: number;
                sv: number;
                th: number;
                tr: number;
                uk: number;
                zh: number;
                "zh-tw": number;
            };
        };
    };
    export = _default_45;
}
//# sourceMappingURL=types.d.ts.map