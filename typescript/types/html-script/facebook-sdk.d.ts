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
//# sourceMappingURL=facebook-sdk.d.ts.map