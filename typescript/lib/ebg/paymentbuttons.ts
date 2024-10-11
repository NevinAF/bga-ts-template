// @ts-nocheck

import e = require("dojo");
import declare = require("dojo/_base/declare");
import i = require("svelte/index");
import "ebg/expandablesection";
import "ebg/paymentbuttons";

declare global {
	namespace BGA {
		interface AjaxActions {
			"/premium/premium/createPaypalOrder.html": {
				_successargs: [{
					id: BGA.ID
				}],
				months: BGA.ID,
				quantity: BGA.ID,
				offer: boolean,
				currency: string
			};
			"/premium/premium/capturePaypalOrder.html": {
				order_id: BGA.ID
			};
			"/premium/premium/paymentTrack.html": {
				track: string
			};
			"/premium/premium/paymentIntent.html": {
				_successargs: [{
					client_secret: any
				}],
				plan: string | 0,
				currency: string,
				email: string,
				target: string,
				paymentMethod: string,
				nbr: number,
				type: number
			}
			"/premium/premium/doPayment.html": {
				_successargs: [{
					requires_action?: boolean,
					client_secret: any,
					transaction_id?: BGA.ID
				}],
				paymentToken: BGA.ID,
				paymentMethod: string,
				email: string,
				target: string,
				plan: string | 0,
				currency: string,
				tos_agreed?: boolean
			};
			"/premium/premium/cancelSubscription.html": {};
		}
	}
}

class PaymentButtons_Template
{
	page: InstanceType<BGA.CorePage> | null = null;
	div_id: string | null = null;
	sections: Record<string, any> = {};
	rollGameBoxesTimeout: number | null = null;

	constructor() {}

	create(t: InstanceType<BGA.CorePage>) {
		this.page = t;
		"#paymentcomplete" == location.hash &&
			i.bgaMessage({
				description: window._(
					"Thanks for supporting this service!"
				),
			});
		e.query<HTMLImageElement>(".payment_image").forEach(function (t) {
			e.attr(t, "src", e.attr(t, "data-src") as string);
		});
		("stripe" != $("payment_method")!.innerHTML &&
			"wechat" != $("payment_method")!.innerHTML &&
			"ideal" != $("payment_method")!.innerHTML) ||
			this.initStripe();
		if ("wechat" == $("payment_method")!.innerHTML) {
			this.page.register_subs(
				e.subscribe(
					"weChatPaymentSuccess",
					this as PaymentButtons_Template,
					"onWeChatPaymentSucceeded"
				)
			);
			jQuery(document).ready(function (e) {
				require([
					g_themeurl + "js/qrcode.min.js",
				], function () {});
			});
		}
		if ("paypal" == $("payment_method")!.innerHTML)
			if (window.paypal) this.loadPaypalButtons();
			else {
				let e = $("paypal_client_id").innerHTML;
				if (e) {
					for (let e of [2, 12])
						$(
							"paypal_btn_holder_" + e + "months"
						) &&
							($(
								"paypal_btn_holder_" +
									e +
									"months"
							).innerHTML =
								window._("Loading..."));
					$("paypal_btn_holder_offer") &&
						($(
							"paypal_btn_holder_offer"
						).innerHTML = window._("Loading..."));
					let t = $("currency").innerHTML,
						i = document.createElement("script"),
						n = this;
					i.onload = function () {
						n.loadPaypalButtons();
					};
					i.src =
						"https://www.paypal.com/sdk/js?client-id=" +
						e +
						"&components=buttons&currency=" +
						t.toUpperCase();
					document.head.appendChild(i);
				}
			}
		if (
			$("payment_buttons_section") &&
			"none" !=
				e.style("payment_buttons_section", "display")
		) {
			analyticsPush({ ecommerce: null });
			analyticsPush({
				event: "view_item_list",
				ecommerce: {
					payment_type: $("payment_method")!.innerHTML,
					items: [
						{
							item_id:
								$("plan_12months").innerHTML,
							item_name: "12months",
							item_category: "membership",
							coupon: $("payment_coupon")
								? $("payment_coupon").innerHTML
								: "",
							currency: $("currency").innerHTML,
							price: this.getBasePrice(
								"12months"
							),
							quantity: "1",
						},
						{
							item_id: $("plan_1month").innerHTML,
							item_name: "1month",
							item_category: "membership",
							coupon: $("payment_coupon")
								? $("payment_coupon").innerHTML
								: "",
							currency: $("currency").innerHTML,
							price: this.getBasePrice("1month"),
							quantity: "1",
						},
					],
				},
			});
		}
		e.connect(
			$("premium_btn_12months"),
			"onclick",
			this,
			function (t) {
				if (toint($("target_player").innerHTML) < 0)
					this.page.showMessage(
						_(
							"Please logged in or create an account to purchase or offer a membership."
						),
						"error"
					);
				else if (
					e.query(".didnreceive_link_to_follow")
						.length > 0
				)
					this.page.showMessage(
						_(
							"Please finish your registration before purchasing a membership."
						),
						"error"
					);
				else if (
					$("confirmEmail") &&
					"block" ==
						e.style("confirmEmail", "display")
				)
					this.page.showMessage(
						_(
							"Please finish your registration before purchasing a membership."
						),
						"error"
					);
				else if (
					"paypal" == $("payment_method")!.innerHTML
				) {
					$("premium_btn_12months").innerHTML =
						_("Please wait...");
					$("paypal_btn_12months").click();
				} else
					"wechat" == $("payment_method")!.innerHTML
						? this.onClickWechatButton(
								$("plan_12months").innerHTML,
								t.currentTarget
							)
						: this.onClickPaymentButton(
								$("plan_12months").innerHTML,
								"12months"
							);
			}
		);
		e.connect(
			$("premium_btn_2months"),
			"onclick",
			this,
			function (t) {
				if (toint($("target_player").innerHTML) < 0)
					this.page.showMessage(
						_(
							"Please logged in or create an account to purchase or offer a membership."
						),
						"error"
					);
				else if (
					e.query(".didnreceive_link_to_follow")
						.length > 0
				)
					this.page.showMessage(
						_(
							"Please finish your registration before purchasing a membership."
						),
						"error"
					);
				else if (
					$("confirmEmail") &&
					"block" ==
						e.style("confirmEmail", "display")
				)
					this.page.showMessage(
						_(
							"Please finish your registration before purchasing a membership."
						),
						"error"
					);
				else if (
					"paypal" == $("payment_method")!.innerHTML
				) {
					$("premium_btn_2months").innerHTML =
						_("Please wait...");
					$("paypal_btn_2months").click();
				} else
					"wechat" == $("payment_method")!.innerHTML
						? this.onClickWechatButton(
								$("plan_1month").innerHTML,
								t.currentTarget
							)
						: ($("payment_method")!.innerHTML,
							this.onClickPaymentButton(
								$("plan_1month").innerHTML,
								"1month"
							));
			}
		);
		e.connect(
			$("offer_submit"),
			"onclick",
			this,
			function (e) {
				"paypal" == $("payment_method")!.innerHTML
					? this.page.showMessage(
							_(
								"Sorry, Paypal is not supported to offer membership. Please choose another payment option below."
							),
							"error"
						)
					: this.onClickPaymentButton(
							"offer",
							12 == $("offer_type").value
								? "12months"
								: "1month"
						);
			}
		);
		e.connect(
			$("more_payment_option_btn"),
			"onclick",
			this,
			function (t) {
				e.stopEvent(t);
				if ("undefined" != typeof mainsite) {
					e.style(
						"more_payment_option_btn",
						"display",
						"none"
					);
					e.style(
						"more_payment_option",
						"display",
						"block"
					);
				} else
					window.open(
						this.page.metasiteurl +
							"/premium?options&src=morepaymentoptionsbtn",
						"_blank"
					);
			}
		);
		if (
			"paypal" == $("payment_method")!.innerHTML ||
			"ideal" == $("payment_method")!.innerHTML
		) {
			e.style(
				"more_payment_option_btn",
				"display",
				"none"
			);
			e.style("more_payment_option", "display", "block");
		}
		this.currentGameBox = 0;
		this.rollGameBoxesTimeout = setTimeout(
			e.hitch(this, "rollGameBoxes"),
			2e3
		);
		$("automatic_renewal") &&
			e.connect(
				$("automatic_renewal"),
				"onclick",
				this,
				function (t) {
					e.stopEvent(t);
					this.page.infoDialog(
						_(
							"Note: you won't pay anything until the end of your current Premium period."
						),
						_("Please choose a subscription.")
					);
					e.query(".payment_buttons_block").style(
						"display",
						"block"
					);
				}
			);
		$("switch_to_annual") &&
			e.connect(
				$("switch_to_annual"),
				"onclick",
				this,
				function (t) {
					e.stopEvent(t);
					this.page.infoDialog(
						_(
							"You won't pay anything until the end of your current monthly Premium period."
						) +
							"<br/>" +
							_(
								"After that, your membership will be extended by 1 year every year."
							),
						_("Upgrade to yearly subscription")
					);
					e.query(".payment_buttons_block").style(
						"display",
						"block"
					);
					e.style("monthly_block", "display", "none");
					e.removeClass("yearly_block", "col-md-6");
					e.addClass("yearly_block", "col-md-12");
					$("premium_btn_12months").innerHTML = _(
						"Upgrade to yearly subscription"
					);
					e.style(
						"more_payment_options_holder",
						"display",
						"none"
					);
				}
			);
		this.sections.offer = new ebg.expandablesection();
		this.sections.offer.create(this, "expandable_offer");
		if (toint($("target_player").innerHTML) < 0) {
			e.query(".player_notlogged_button").style(
				"display",
				"inline"
			);
			e.query(".player_logged_button").style(
				"display",
				"none"
			);
		}
		e.query(".paypal_payment_button").connect(
			"onclick",
			this,
			"onPaypalBtnClick"
		);
		$("cancel_stripe_subscription") &&
			e.connect(
				$("cancel_stripe_subscription"),
				"onclick",
				this,
				"onCancelSubscription"
			);
		$("cancel_stripe_subscription_trial") &&
			e.connect(
				$("cancel_stripe_subscription_trial"),
				"onclick",
				this,
				"onCancelSubscription"
			);
		"paypal" == $("payment_method")!.innerHTML
			? e.addClass(
					"paymentmethod_paypal",
					"current_selection"
				)
			: "wechat" == $("payment_method")!.innerHTML
			? e.addClass(
					"paymentmethod_wechat",
					"current_selection"
				)
			: "ideal" == $("payment_method")!.innerHTML
			? e.addClass(
					"paymentmethod_ideal",
					"current_selection"
				)
			: e.addClass(
					"paymentmethod_" + $("currency").innerHTML,
					"current_selection"
				);
		e.query(".paymentmethod").connect(
			"onclick",
			this,
			"onPaymentMethodChange"
		);
		this.offerUpdatePrice();
		e.connect(
			$("offer_nbr"),
			"onchange",
			this,
			"offerUpdatePrice"
		);
		e.connect(
			$("offer_nbr"),
			"oninput",
			this,
			"offerUpdatePrice"
		);
		e.connect(
			$("offer_type"),
			"onchange",
			this,
			"offerUpdatePrice"
		);
		this.bOffer = 1 == $("offer_membership").innerHTML;
		if (location.hash) {
			let e = location.hash.match(/:(.+):(.+)$/);
			if (e) {
				history.replaceState(
					{},
					document.title,
					window.location.href.split("#")[0]
				);
				this.onClickPaymentButton(e[1], e[2]);
			}
		}
	}

	destroy() {
		clearTimeout(this.rollGameBoxesTimeout);
	}

	offerUpdatePrice() {
		var e = toint($("offer_nbr").value);
		if (12 == $("offer_type").value) {
			var t = $("raw_price_12months").innerHTML;
			t *= 12;
			t = Math.round(100 * t) / 100;
		} else {
			t = tofloat($("raw_price_1month").innerHTML);
			t = Math.round(100 * t) / 100;
		}
		var i = t * e;
		i = Math.round(100 * i) / 100;
		isNaN(i) || ($("total_price").innerHTML = i);
	}

	getBasePrice(e: string) {
		"offer" == e &&
			(e =
				12 == $("offer_type").value
					? "12months"
					: "1month");
		if ("12months" == e) {
			var t = $("raw_price_12months").innerHTML;
			t *= 12;
			t = Math.round(100 * t) / 100;
		} else if ("2months" == e) {
			t = tofloat($("raw_price_1month").innerHTML);
			t = (2 * Math.round(100 * t)) / 100;
		} else {
			t = tofloat($("raw_price_1month").innerHTML);
			t = Math.round(100 * t) / 100;
		}
		return t;
	}

	onPaypalBtnClick(e: Event) {}

	rollGameBoxes() {
		if ($("whypremium_catalog")) {
			var t = true,
				i = document.querySelectorAll(":hover"),
				n = e.query(
					"#whypremium_catalog_list .game_box"
				).length;
			for (var o in i)
				"whypremium_catalog" == i[o].id && (t = true);
			if (!t) {
				if (this.currentGameBox >= n - 1) {
					this.currentGameBox = 0;
					e.style(
						"whypremium_catalog_list",
						"left",
						"0px"
					);
				}
				this.currentGameBox++;
				var a = e.style("whypremium_catalog", "width");
				this.page
					.slideToObjectPos(
						"whypremium_catalog_list",
						"whypremium_catalog",
						-a * this.currentGameBox,
						0
					)
					.play();
			}
			clearTimeout(this.rollGameBoxesTimeout);
			this.rollGameBoxesTimeout = setTimeout(
				e.hitch(this, "rollGameBoxes"),
				2e3
			);
		}
	}

	loadPaypalButtons() {
		let e = [
			{
				itemId: 0,
				itemName: "offer",
				holderId: "paypal_btn_holder_offer",
			},
			{
				itemId: 2,
				itemName: "2months",
				holderId: "paypal_btn_holder_2months",
				months: 2,
			},
			{
				itemId: 12,
				itemName: "12months",
				holderId: "paypal_btn_holder_12months",
				months: 12,
			},
		];
		for (let t of e) {
			let e = this,
				n = $(t.holderId);
			if (n) {
				n.innerHTML = "";
				paypal
					.Buttons({
						fundingSource: paypal.FUNDING.PAYPAL,
						style: {
							tagline: true,
							layout: "horizontal",
						},
						createOrder: function (n, o) {
							let a =
									"offer" == t.itemName
										? $("offer_nbr").value
										: 1,
								s =
									"offer" == t.itemName
										? toint(
												$("offer_type")
													.value
											)
										: t.months;
							analyticsPush({ ecommerce: null });
							analyticsPush({
								event: "add_to_cart",
								ecommerce: {
									payment_type: "paypal",
									items: [
										{
											item_id: t.itemId,
											item_name:
												t.itemName,
											item_category:
												"membership",
											coupon: $(
												"payment_coupon"
											)
												? $(
														"payment_coupon"
													).innerHTML
												: "",
											currency:
												$("currency")
													.innerHTML,
											price: e.getBasePrice(
												t.itemName
											),
											quantity: a + "",
										},
									],
								},
							});
							return new Promise(function (n, o) {
								try {
									e.page.ajaxcall(
										"/premium/premium/createPaypalOrder.html",
										{
											months: s,
											quantity: a,
											offer:
												"offer" ==
												t.itemName,
											currency: $("currency").innerHTML,
											lock: true,
										},
										e,
										function (e) {
											n(e.id);
										},
										function (e) {
											o(e);
										}
									);
								} catch (r) {
									i.bgaMessage({
										type: "error",
										description: window._(
											"Unable to create PayPal order"
										),
									});
									o(
										"Unable to create PayPal order"
									);
								}
							});
						},
						onApprove: function (i, n) {
							analyticsPush({ ecommerce: null });
							analyticsPush({
								event: "purchase",
								ecommerce: {
									currency:
										$("currency").innerHTML,
									transaction_id: i.orderID,
									value: e.getBasePrice(
										t.itemName
									),
									coupon: $("payment_coupon")
										? $("payment_coupon")
												.innerHTML
										: "",
									payment_type: "paypal",
									items: [
										{
											item_id: t.itemId,
											item_name:
												t.itemName,
											item_category:
												"membership",
											coupon: $(
												"payment_coupon"
											)
												? $(
														"payment_coupon"
													).innerHTML
												: "",
											currency:
												$("currency")
													.innerHTML,
											price: e.getBasePrice(
												t.itemName
											),
											quantity:
												"offer" ==
												t.itemName
													? $(
															"offer_nbr"
														).value
													: "1",
										},
									],
								},
							});
							return new Promise(function (n, o) {
								e.page.ajaxcall(
									"/premium/premium/capturePaypalOrder.html",
									{ order_id: i.orderID },
									e,
									function () {
										n();
										if (
											"offer" ==
											t.itemName
										)
											location.href =
												"premium?confirmpayment&offer";
										else {
											location.hash =
												"#paymentcomplete";
											location.reload();
										}
									},
									o
								);
							});
						},
						onCancel: function (e) {},
						onError: function (e) {
							i.bgaMessage({
								type: "error",
								description:
									window._(
										"Unable to complete PayPal order"
									) +
									" (" +
									e +
									")",
							});
						},
					})
					.render("#" + t.holderId);
			}
		}
	}

	initStripe() {
		if (undefined === this.bStripeIsLoading) {
			this.bStripeIsLoading = true;
			var t = document.createElement("script");
			t.setAttribute("src", "https://js.stripe.com/v3/");
			$("stripe_script").appendChild(t);
		}
		if ("undefined" == typeof Stripe)
			setTimeout(e.hitch(this, "initStripe"), 100);
		else {
			this.stripe = Stripe($("stripe_key").innerHTML);
			if ("ideal" == $("payment_method")!.innerHTML) {
				this.stripeElements = this.stripe.elements({
					clientSecret: this.paymentIntent_secret,
					mode: "payment",
					currency: $("currency").innerHTML,
					amount: 1,
					paymentMethodTypes: ["ideal"],
				});
				this.stripePaymentElement =
					this.stripeElements.create("payment");
				this.stripePaymentElement.mount(
					"#stripe-elements-holder"
				);
			} else {
				var i = {
					base: {
						fontSize: "14px",
						fontWeight: 500,
						color: "black",
						"::placeholder": { color: "#a1a1a7" },
					},
				};
				this.stripeElements = this.stripe.elements();
				this.card = this.stripeElements.create(
					"cardNumber",
					{ style: i, placeholder: _("Card number") }
				);
				this.card.mount(
					"#bga_payment_card_placeholder"
				);
				this.card.addEventListener(
					"change",
					e.hitch(this, function (e) {
						var t =
							document.getElementById(
								"card-errors"
							);
						if (e.error) {
							t.textContent = e.error.message;
							this.shakePaymentWindow();
						} else t.textContent = "";
						e.brand && this.setBrandIcon(e.brand);
					})
				);
				this.cardExpire = this.stripeElements.create(
					"cardExpiry",
					{ style: i }
				);
				this.cardExpire.mount("#bga_payment_expire");
				this.cardCVV = this.stripeElements.create(
					"cardCvc",
					{ style: i }
				);
				this.cardCVV.mount("#bga_payment_cvv");
				e.connect(
					this.card,
					"focus",
					e.hitch(this, function (t) {
						e.addClass(
							"bga_card_field",
							"Fieldset-child--focused"
						);
					})
				);
				e.connect(
					this.card,
					"blur",
					e.hitch(this, function (t) {
						e.removeClass(
							"bga_card_field",
							"Fieldset-child--focused"
						);
					})
				);
				e.connect(
					this.cardExpire,
					"focus",
					e.hitch(this, function (t) {
						e.addClass(
							"bga_cardexpiry_field",
							"Fieldset-child--focused"
						);
					})
				);
				e.connect(
					this.cardExpire,
					"blur",
					e.hitch(this, function (t) {
						e.removeClass(
							"bga_cardexpiry_field",
							"Fieldset-child--focused"
						);
					})
				);
				e.connect(
					this.cardCVV,
					"focus",
					e.hitch(this, function (t) {
						e.addClass(
							"bga_cardcvc_field",
							"Fieldset-child--focused"
						);
					})
				);
				e.connect(
					this.cardCVV,
					"blur",
					e.hitch(this, function (t) {
						e.removeClass(
							"bga_cardcvc_field",
							"Fieldset-child--focused"
						);
					})
				);
			}
			document
				.getElementById("payment-form")
				.addEventListener(
					"submit",
					e.hitch(this, function (t) {
						t.preventDefault();
						bOneTimePayment = true;
						(("undefined" !=
							typeof current_player_id &&
							$("target_player").innerHTML !=
								current_player_id) ||
							"ideal" ==
								$("payment_method")!
									.innerHTML) &&
							(bOneTimePayment = true);
						this.bOffer && (bOneTimePayment = true);
						if (
							e.hasClass(
								"bga_payment_button_wrap",
								"Button--disableClick"
							) ||
							e.hasClass(
								"bga_payment_button_wrap",
								"Button--success"
							)
						)
							this.page.showMessage(
								_(
									"Please wait, a payment is already in progress..."
								),
								"error"
							);
						else if (
							0 != $("accept_tos").innerHTML &&
							1 != $("agree_tos").checked
						) {
							$("card-errors").textContent = _(
								"You must agree with Term of Sales"
							);
							this.shakePaymentWindow();
						} else {
							analyticsPush({ ecommerce: null });
							analyticsPush({
								event: "add_payment_info",
								ecommerce: {
									currency:
										$("currency").innerHTML,
									value: this.getBasePrice(
										this
											.currentPaymentPlanName
									),
									coupon: $("payment_coupon")
										? $("payment_coupon")
												.innerHTML
										: "",
									payment_type: "stripe",
									items: [
										{
											item_id:
												"offer" ==
												this
													.currentPaymentPlan
													? 0
													: this
															.currentPaymentPlan,
											item_name:
												this
													.currentPaymentPlanName,
											item_category:
												"offer" ==
												this
													.currentPaymentPlan
													? "gift"
													: "membership",
											coupon: $(
												"payment_coupon"
											)
												? $(
														"payment_coupon"
													).innerHTML
												: "",
											currency:
												$("currency")
													.innerHTML,
											price: this.getBasePrice(
												this
													.currentPaymentPlanName
											),
											quantity:
												"offer" ==
												this
													.currentPaymentPlan
													? $(
															"offer_nbr"
														).value
													: "1",
										},
									],
								},
							});
							e.addClass(
								"bga_payment_button_wrap",
								"Button--disableClick"
							);
							this.latest_bga_button_label =
								$(
									"bga_payment_button"
								).innerHTML;
							$("bga_payment_button").innerHTML =
								'<i class="fa fa-spinner fa-pulse fa-lg" aria-hidden="true" style="position:relative;top:8px;"></i>';
							if (bOneTimePayment) {
								if (
									null ===
									this.paymentIntent_secret
								) {
									this.page.showMessage(
										"Error during payment initialization",
										"Error"
									);
									return;
								}
								"ideal" ==
								$("payment_method")!.innerHTML
									? this.stripeElements
											.submit()
											.then(
												e.hitch(
													this,
													function (
														t
													) {
														t.error
															? this.page.showMessage(
																	_(
																		"Sorry, the payment have failed :("
																	) +
																		" " +
																		t
																			.error
																			.message,
																	"error"
																)
															: this.stripe
																	.confirmPayment(
																		{
																			elements:
																				this
																					.stripeElements,
																			clientSecret:
																				this
																					.paymentIntent_secret,
																			confirmParams:
																				{
																					return_url:
																						location.origin +
																						"/premium?confirmpayment" +
																						(this
																							.bOffer
																							? "&offer"
																							: ""),
																				},
																		}
																	)
																	.then(
																		e.hitch(
																			this,
																			"stripePaymentResultHandler"
																		)
																	);
													}
												)
											)
									: this.stripe
											.handleCardPayment(
												this
													.paymentIntent_secret,
												this.card
											)
											.then(
												e.hitch(
													this,
													"stripePaymentResultHandler"
												)
											);
							} else
								this.stripe
									.createToken(this.card)
									.then(
										e.hitch(
											this,
											"stripePaymentResultHandler"
										)
									);
						}
					})
				);
			e.connect(
				$("bga_payment_close"),
				"onclick",
				this,
				function () {
					e.style(
						"bga_payment_layout",
						"display",
						"none"
					);
				}
			);
			e.connect(
				$("security_infos"),
				"onclick",
				this,
				e.hitch(this, function () {
					alert(
						_(
							"Your payment data are NEVER collected, transmitted or stored by Board Game Arena."
						) +
							"\n" +
							_(
								"Your infos are collected and processed exclusively by our payment service Stripe.com."
							) +
							"\n" +
							_(
								"We are going to redirect you to Stripe.com privacy policy."
							)
					);
				})
			);
		}
	}

	stripePaymentResultHandler(t: Event) {
		bOneTimePayment = true;
		"undefined" != typeof current_player_id &&
			$("target_player").innerHTML != current_player_id &&
			(bOneTimePayment = true);
		this.bOffer && (bOneTimePayment = true);
		if (t.error) {
			document.getElementById("card-errors").textContent =
				t.error.message;
			this.shakePaymentWindow();
			e.removeClass(
				"bga_payment_button_wrap",
				"Button--disableClick"
			);
			$("bga_payment_button").innerHTML =
				this.latest_bga_button_label;
		} else {
			e.removeClass(
				"bga_payment_button_wrap",
				"Button--disableClick"
			);
			e.addClass(
				"bga_payment_button_wrap",
				"Button--success"
			);
			$("bga_payment_button").innerHTML =
				'<i class="fa fa-check-circle-o fa-lg" aria-hidden="true" style="position:relative;top:8px;"></i>';
			this.bOffer
				? this.showConfirmPayment(true)
				: bOneTimePayment
				? this.showConfirmPayment(true)
				: this.stripeTokenHandler(t.token);
		}
	}

	setBrandIcon(t: string) {
		document.getElementById("brand-icon");
		if (
			t in
			{
				visa: "fa-cc-visa",
				mastercard: "fa-cc-mastercard",
				amex: "fa-cc-amex",
				discover: "fa-cc-discover",
				diners: "fa-cc-dinners-club",
				jcb: "fa-cc-jcb",
			}
		) {
			$("brand-icon").src = getStaticAssetUrl(
				"img/common/cc_" + t + ".png"
			);
			e.style("brand-icon", "display", "block");
		} else e.style("brand-icon", "display", "none");
	}

	onClickWechatButton(t: string, i: HTMLElement) {
		var n = 2400;
		n = t % 100 == 12 ? 2400 : 800;
		this.saveWeChatButtonContent = i.innerHTML;
		i.innerHTML =
			'<i class="fa fa-spinner fa-spin fa-fw"></i>';
		this.stripe
			.createSource({
				type: "wechat",
				amount: n,
				currency: "eur",
				statement_descriptor:
					"Player " + $("target_player").innerHTML,
			})
			.then(
				e.hitch(this, function (e) {
					i.innerHTML = this.saveWeChatButtonContent;
					if (e.source) {
						this.wechatDlg = new ebg.popindialog();
						this.wechatDlg.create("wechatDlg");
						this.wechatDlg.setTitle(
							__(
								"lang_mainsite",
								"Please use your WeChat app to confirm the payment"
							)
						);
						var t = '<div id="wechatContent">';
						t +=
							"<p>" +
							_(
								"Note: because WeChat is doing its own currency conversion, the amount displayed below may be slightly different that our price. Sorry about this."
							) +
							"</p>";
						t +=
							'<div id="qrcode" style="margin:auto;width:256px;height:256px;margin-top: 50px;margin-bottom: 50px;"></div>';
						t +=
							"<p style='text-align:center'><a href='" +
							e.source.wechat.qr_code_url +
							"' target='_blank'>" +
							_(
								"... or click here to open your WeChap app"
							) +
							"</a></p>";
						t += "</div>";
						this.wechatDlg.setContent(t);
						this.wechatDlg.show();
						new QRCode(
							document.getElementById("qrcode"),
							{
								text: e.source.wechat
									.qr_code_url,
								width: 256,
								height: 256,
								colorDark: "#000000",
								colorLight: "#ffffff",
								correctLevel:
									QRCode.CorrectLevel.H,
							}
						);
					} else {
						this.page.showMessage(
							"Error during wechat source creation",
							"error"
						);
						console.error(e.error);
					}
				})
			);
	}

	onWeChatPaymentSucceeded() {
		if (this.wechatDlg) {
			this.wechatDlg.destroy();
			"undefined" != typeof gotourl
				? this.showConfirmPayment(true)
				: this.page.showMessage(
						_(
							"You are awesome! Starting next game you'll enjoy your Premium membership!"
						),
						"info"
					);
		}
	}

	onClickPaymentButton(t: string, i: string) {
		if ("undefined" != typeof mainsite) {
			var n = "",
				o = "",
				a = true,
				s = 1;
			"offer" == t
				? (s = $("offer_nbr").value)
				: "ideal" === $("payment_method")!.innerHTML &&
					t % 100 == 2 &&
					(s = 2);
			var r = _("Subscribe");
			if ("stripe" === $("payment_method")!.innerHTML)
				e.style("payment-form", "display", "block");
			else if (
				"ideal" === $("payment_method")!.innerHTML
			) {
				e.style("payment-form", "display", "block");
				e.style(
					"stripe-card-elements-holder",
					"display",
					"none"
				);
				e.style(
					"stripe-elements-holder",
					"display",
					"block"
				);
			}
			1 == $("accept_tos").innerHTML &&
				(t % 100 == 2
					? (r = e.string.substitute(
							_("Subscribe for ${price}"),
							{
								price: $("price_1month")
									.innerHTML,
							}
						))
					: t % 100 == 12 &&
						(r = e.string.substitute(
							_("Subscribe for ${price}"),
							{
								price: $("price_12months")
									.innerHTML,
							}
						)));
			if ("ideal" == $("payment_method")!.innerHTML) {
				a = true;
				r = _("Buy Premium");
			}
			if (
				"undefined" != typeof current_player_id &&
				$("target_player").innerHTML !=
					current_player_id
			) {
				r = _("Offer membership");
				a = true;
			}
			if ("offer" == t) {
				r = _("Buy Premium codes");
				a = true;
			}
			this.page.ajaxcall(
				"/premium/premium/paymentTrack.html",
				{
					track:
						"CLICKED " +
						t +
						" " +
						$("currency").innerHTML +
						" " +
						$("payment_method")!.innerHTML,
				},
				this,
				e.hitch(this, function (e) {})
			);
			analyticsPush({ ecommerce: null });
			analyticsPush({
				event: "add_to_cart",
				ecommerce: {
					payment_type: $("payment_method")!.innerHTML,
					items: [
						{
							item_id: "offer" == t ? 0 : t,
							item_name: i,
							item_category:
								"offer" == t
									? "gift"
									: "membership",
							coupon: $("payment_coupon")
								? $("payment_coupon").innerHTML
								: "",
							currency: $("currency").innerHTML,
							price: this.getBasePrice(i),
							quantity: s,
						},
					],
				},
			});
			if (a) {
				this.paymentIntent_secret = null;
				var l = {
					plan: t,
					currency: $("currency").innerHTML,
					email: $("target_player_email").innerHTML,
					target: $("target_player").innerHTML,
					paymentMethod:
						$("payment_method")!.innerHTML,
					nbr: s,
				};
				if ("offer" == t) {
					l.plan = 0;
					l.nbr = toint($("offer_nbr").value);
					l.type = toint($("offer_type").value);
				}
				this.page.ajaxcall(
					"/premium/premium/paymentIntent.html",
					l,
					this,
					e.hitch(this, function (e) {
						this.paymentIntent_secret =
							e.client_secret;
					})
				);
			}
			if (t % 100 == 2) {
				n = _("Monthly membership");
				o = $("price_1month").innerHTML;
				a &&
					(n =
						1 == s
							? _("1 month membership")
							: _(
									"${num} months' membership"
								).replace("${num}", s));
			} else if (t % 100 == 6) {
				n = _("6 month membership");
				o = $("price_6months").innerHTML;
			} else if (t % 100 == 12) {
				n = _("Yearly membership");
				o =
					$("price_12months").innerHTML +
					" " +
					$("premium_save_12_months").innerHTML;
				a && (n = _("1 year membership"));
			} else if ("offer" == t) {
				12 == $("offer_type").value
					? (n = _("1 year membership"))
					: 1 == $("offer_type").value &&
						(n = _("1 month membership"));
				n += " x" + toint($("offer_nbr").value);
				o =
					_("Total price") +
					": " +
					$("total_price_currency").innerHTML;
			}
			$("bga_payment_name").innerHTML = n;
			$("bga_payment_descr").innerHTML = o;
			$("bga_payment_email").innerHTML =
				_("Account") +
				": " +
				$("target_player_username").innerHTML;
			$("bga_payment_email").title = $(
				"target_player_email"
			).innerHTML;
			$("bga_payment_button").innerHTML = r;
			e.removeClass(
				"bga_payment_button_wrap",
				"Button--success"
			);
			0 == $("accept_tos").innerHTML
				? e.style("accept_tos_block", "display", "none")
				: e.style(
						"accept_tos_block",
						"display",
						"block"
					);
			"offer" == t &&
				($("bga_payment_email").innerHTML =
					_("BGA Premium codes"));
			e.style("bga_payment_layout", "display", "block");
			undefined !== this.card && this.card.focus();
			this.currentPaymentPlan = t;
			this.currentPaymentPlanName = i;
		} else
			window.open(
				this.page.metasiteurl +
					"/premium#c:" +
					t +
					":" +
					i,
				"_blank"
			);
	}

	stripeTokenHandler(t: Element) {
		this.bOffer
			? this.page.showMessage(
					_(
						"Please wait few seconds while we checking your payment ..."
					),
					"info"
				)
			: this.page.showMessage(
					_(
						"Please wait few seconds while we are upgrading up your account ..."
					),
					"info"
				);
		var i = {
			paymentToken: t.id,
			paymentMethod: $("payment_method")!.innerHTML,
			email: $("target_player_email").innerHTML,
			target: $("target_player").innerHTML,
			plan: this.currentPaymentPlan,
			currency: $("currency").innerHTML,
		};
		$("agree_tos").checked && (i.tos_agreed = true);
		this.page.ajaxcall(
			"/premium/premium/paymentTrack.html",
			{
				track:
					"ATTEMPT " +
					this.currentPaymentPlan +
					" " +
					$("currency").innerHTML +
					" " +
					$("payment_method")!.innerHTML,
			},
			this,
			e.hitch(this, function (e) {})
		);
		this.page.ajaxcall(
			"/premium/premium/doPayment.html",
			i,
			this,
			e.hitch(this, function (t) {
				if (
					undefined !== t.requires_action &&
					t.requires_action
				) {
					var i = t.client_secret;
					this.page.showMessage(
						_(
							"We are redirecting you to your bank to confirm the payment..."
						),
						"info"
					);
					e.style(
						"bga_payment_layout",
						"display",
						"none"
					);
					this.stripe.handleCardPayment(i).then(
						e.hitch(this, function (e) {
							if (e.error)
								this.page.showMessage(
									_(
										"Sorry, the payment have failed :("
									) +
										" " +
										e.error.message,
									"error"
								);
							else {
								analyticsPush({
									ecommerce: null,
								});
								var t = "";
								e.paymentIntent &&
									e.paymentIntent.invoice &&
									(t =
										e.paymentIntent
											.invoice);
								analyticsPush({
									event: "purchase",
									ecommerce: {
										currency:
											$("currency")
												.innerHTML,
										transaction_id: t,
										value: this.getBasePrice(
											this
												.currentPaymentPlanName
										),
										coupon: $(
											"payment_coupon"
										)
											? $(
													"payment_coupon"
												).innerHTML
											: "",
										payment_type: "stripe",
										items: [
											{
												item_id:
													"offer" ==
													this
														.currentPaymentPlan
														? 0
														: this
																.currentPaymentPlan,
												item_name:
													this
														.currentPaymentPlanName,
												item_category:
													"offer" ==
													this
														.currentPaymentPlan
														? "gift"
														: "membership",
												coupon: $(
													"payment_coupon"
												)
													? $(
															"payment_coupon"
														)
															.innerHTML
													: "",
												currency:
													$(
														"currency"
													).innerHTML,
												price: this.getBasePrice(
													this
														.currentPaymentPlanName
												),
												quantity:
													"offer" ==
													this
														.currentPaymentPlan
														? $(
																"offer_nbr"
															)
																.value
														: "1",
											},
										],
									},
								});
								"undefined" != typeof gotourl
									? this.showConfirmPayment(
											true
										)
									: this.page.showMessage(
											_(
												"You are awesome! Starting next game you'll enjoy your Premium membership!"
											),
											"info"
										);
							}
						})
					);
				} else {
					analyticsPush({ ecommerce: null });
					analyticsPush({
						event: "purchase",
						ecommerce: {
							currency: $("currency").innerHTML,
							transaction_id: t.transaction_id
								? t.transaction_id
								: "",
							value: this.getBasePrice(
								this.currentPaymentPlanName
							),
							coupon: $("payment_coupon")
								? $("payment_coupon").innerHTML
								: "",
							payment_type: "stripe",
							items: [
								{
									item_id:
										"offer" ==
										this.currentPaymentPlan
											? 0
											: this
													.currentPaymentPlan,
									item_name:
										this
											.currentPaymentPlanName,
									item_category:
										"offer" ==
										this.currentPaymentPlan
											? "gift"
											: "membership",
									coupon: $("payment_coupon")
										? $("payment_coupon")
												.innerHTML
										: "",
									currency:
										$("currency").innerHTML,
									price: this.getBasePrice(
										this
											.currentPaymentPlanName
									),
									quantity:
										"offer" ==
										this.currentPaymentPlan
											? $("offer_nbr")
													.value
											: "1",
								},
							],
						},
					});
					if ("undefined" != typeof gotourl)
						this.showConfirmPayment(true);
					else {
						this.page.showMessage(
							_(
								"You are awesome! Starting next game you'll enjoy your Premium membership!"
							),
							"info"
						);
						e.style(
							"bga_payment_layout",
							"display",
							"none"
						);
					}
				}
			}),
			function (t) {
				setTimeout(function () {
					$("bga_payment_layout") &&
						e.style(
							"bga_payment_layout",
							"display",
							"none"
						);
				}, 1e3);
			}
		);
	}

	payWithStripe(e: Element) {
		this.page.showMessage(
			_(
				"Please wait few seconds while we are upgrading up your account ..."
			),
			"info"
		);
		this.page.ajaxcall(
			"/premium/premium/doPayment.html",
			{
				paymentToken: e.id,
				paymentMethod: $("payment_method")!.innerHTML,
				email: $("target_player_email").innerHTML,
				target: $("target_player").innerHTML,
				plan: this.currentPaymentPlan,
				currency: $("currency").innerHTML,
			},
			this,
			function (e) {
				"undefined" != typeof gotourl
					? this.showConfirmPayment(true)
					: this.page.showMessage(
							_(
								"You are awesome! Starting next game you'll enjoy your Premium membership!"
							),
							"info"
						);
			}
		);
	}

	onCancelSubscription(t: Event) {
		e.stopEvent(t);
		"cancel_stripe_subscription_trial" == t.currentTarget.id
			? this.page.confirmationDialog(
					_(
						"If you end your Premium trial, your account will imediately be downgraded to Standard. The automatic membership renewal for your account will be cancelled, and you will not be charged."
					),
					e.hitch(this, function () {
						this.page.ajaxcall(
							"/premium/premium/cancelSubscription.html",
							{},
							this,
							function (e) {
								mainsite.gotourl_forcereload(
									"premium"
								);
								this.page.showMessage(
									_(
										"Done! The automatic membership renewal has been removed, and your account is not Premium anymore."
									),
									"info"
								);
							}
						);
					})
				)
			: this.page.confirmationDialog(
					_(
						"Your account will remains Premium until the end of the current period, then there will be no automatic renewal."
					),
					e.hitch(this, function () {
						this.page.ajaxcall(
							"/premium/premium/cancelSubscription.html",
							{},
							this,
							function (e) {
								mainsite.gotourl_forcereload(
									"premium"
								);
								this.page.showMessage(
									_(
										"Done! The automatic membership renewal has been removed. Your account will be downgraded to Standard at the end of the current period."
									),
									"info"
								);
							}
						);
					})
				);
	}

	showConfirmPayment(e: boolean) {
		let t = "premium?confirmpayment" + (e ? "&offer" : "");
		location.href = t;
	}

	onPaymentMethodChange(t: Event) {
		e.stopEvent(t);
		var i = t.currentTarget.id.substr(14),
			n = "premium?";
		this.bOffer && (n += "offer&");
		if ("paypal" == i) {
			mainsite.gotourl_forcereload(
				n + "paymentmethod=paypal"
			);
			this.page.showMessage(
				_("Done! Please choose a payment button."),
				"info"
			);
		} else if ("wechat" == i) {
			mainsite.gotourl_forcereload(
				n + "paymentmethod=wechat"
			);
			this.page.showMessage(
				_("Done! Please choose a payment button."),
				"info"
			);
		} else if ("ideal" == i) {
			mainsite.gotourl_forcereload(
				n + "paymentmethod=ideal"
			);
			this.page.showMessage(
				_("Done! Please choose a payment button."),
				"info"
			);
		} else
			"eur" == i
				? mainsite.gotourl_forcereload(n + "country=DE")
				: "usd" == i
				? mainsite.gotourl_forcereload(n + "country=US")
				: "gbp" == i
				? mainsite.gotourl_forcereload(n + "country=GB")
				: "cad" == i
				? mainsite.gotourl_forcereload(n + "country=CA")
				: "jpy" == i &&
					mainsite.gotourl_forcereload(
						n + "country=JP"
					);
	}

	shakePaymentWindow() {
		e.addClass(
			"bga_payment_window",
			"ModalContainer--animating"
		);
		e.addClass(
			"bga_payment_window_content",
			"Modal-animationWrapper Modal-animationWrapper--shake"
		);
		setTimeout(
			e.hitch(this, function () {
				e.removeClass(
					"bga_payment_window",
					"ModalContainer--animating"
				);
				e.removeClass(
					"bga_payment_window_content",
					"Modal-animationWrapper Modal-animationWrapper--shake"
				);
			}),
			500
		);
	}
}

let PaymentButtons = declare("ebg.paymentbuttons", PaymentButtons_Template);
export = PaymentButtons;

declare global {
	namespace BGA {
		type PaymentButtons = typeof PaymentButtons;
		interface EBG { paymentbuttons: PaymentButtons; }
	}
	var ebg: BGA.EBG;
}