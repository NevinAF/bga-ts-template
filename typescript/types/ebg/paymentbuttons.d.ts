import "ebg/expandablesection";
import "ebg/paymentbuttons";
declare global {
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
declare class PaymentButtons_Template {
    page: InstanceType<BGA.CorePage> | null;
    div_id: string | null;
    sections: Record<string, any>;
    rollGameBoxesTimeout: number | null;
    constructor();
    create(t: InstanceType<BGA.CorePage>): void;
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
declare let PaymentButtons: DojoJS.DojoClass<PaymentButtons_Template, []>;
export = PaymentButtons;
declare global {
    namespace BGA {
        type PaymentButtons = typeof PaymentButtons;
        interface EBG {
            paymentbuttons: PaymentButtons;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=paymentbuttons.d.ts.map