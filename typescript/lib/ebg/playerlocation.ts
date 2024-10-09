import dojo = require("dojo");
import declare = require("dojo/_base/declare");

declare global {
	namespace BGA {
		interface AjaxActions {
			"/player/profile/updateCity.html": {
				form_id: "profileinfos"
			};
			"/table/table/updateCity.html": {
				form_id: "profileinfos"
			};
		}
	}
}

class PlayerLocation_Template
{
	page: InstanceType<BGA.CorePage> | null = null;
	board_div: HTMLElement | null = null;
	board_div_id: string | null = null;
	board_uid: string = "_";
	template: string = '<div id="current_localization" style="display:${my_position_visibility}">${my_city}: ${position} <a href="#" id="modifycity" class="smalltext">[${LB_CHANGE}]</a></div><div id="current_localization_teasing" style="display:${MY_POSITION_TEASING}"><div>${POSITION_TEASING}</div>${MY_CITY}: <input type="text" id="cityinput"  size="30" value="${INITIAL_CITY}"></input> <a href="#" class="bgabutton bgabutton_blue" id="savecity"><span>${LB_OK}</span></a></div><form id="profileinfos" name="profileinfos" method="post"><input type="hidden" name="city" id="city" value=""></input><input type="hidden" name="lat" id="lat" value="0"></input><input type="hidden" name="lon" id="lon" value="0"></input><input type="hidden" name="loc_city" id="loc_city" value=""></input><input type="hidden" name="loc_area1" id="loc_area1" value=""></input><input type="hidden" name="loc_area2" id="loc_area2" value=""></input><input type="hidden" name="loc_country" id="loc_country" value=""></input><input type="hidden" name="loc_cityprivacy" id="loc_cityprivacy" value=""></input></form>';
	teasing: string = "";
	googleApiLoaded: boolean = true;
	jtpl_citychoice: string = "<input type='radio' name='cityChoice' id='cityChoiceLink_${id}' class='cityChoiceLink' ${checked}>${description}</input><br/>";
	locationDialog: any = null;
	cityChoiceResult: any = null;
	callback_url: string = "";

	create(t: InstanceType<BGA.CorePage>, i: string, n: string, o: boolean, a: string) {
		this.page = t;
		this.board_div = dojo.byId(i);
		this.board_div_id = i;
		this.teasing = n;
		this.callback_url = a;
		var s = {
			my_city: _("My city"),
			my_position_visibility: "" != $("initial_position")!.innerHTML ? "block" : "none",
			position: $("initial_position")!.innerHTML,
			LB_CHANGE: _("LB_CHANGE"),
			POSITION_TEASING: this.teasing,
			MY_POSITION_TEASING: "" != $("initial_position")!.innerHTML ? "none" : "block",
			MY_CITY: _("My city"),
			INITIAL_CITY: $("initial_city")!.innerHTML,
			LB_OK: _("LB_OK"),
		};
		var r = true;
		if ($("upperrightmenu_loggedin")
			? "none" != dojo.style("upperrightmenu_loggedin", "display") && (r = true)
			// @ts-ignore - This looks like a typo. style should be requesting the display of the element.
			: $("disconnected_player_menu") && "none" != dojo.style("disconnected_player_menu") && (r = true), r
		) {
			dojo.place(dojo.string.substitute(this.template, s), this.board_div!);
			dojo.connect($("savecity")!, "onclick", this as PlayerLocation_Template, "onSaveCity");
			dojo.connect($("modifycity")!, "onclick", this as PlayerLocation_Template, "onModifyCity");
			if (o) {
				var l = document.createElement("script");
				l.type = "text/javascript";
				var d = dojoConfig.locale.substr(0, 2);
				l.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrPx3aUElpdWAGTyxd-t9w92er94Nfxjk&sensor=false&callback=initGoogleApi&language=" + d;
				initGoogleApi = dojo.hitch(this, function () {
					this.googleApiLoaded = true;
				});
				document.body.appendChild(l);
			}
		}
	}

	onModifyCity(t: Event) {
		dojo.stopEvent(t);
		dojo.style("current_localization", "display", "none");
		dojo.style("current_localization_teasing", "display", "block");
	}

	onSaveCity(t: Event) {
		dojo.stopEvent(t);
		var i = $<HTMLInputElement>("cityinput")!.value,
			n = $<HTMLInputElement>("country")!.value;
		if ("" != i)
			if (
				"undefined" != typeof google &&
				undefined !== google.maps &&
				undefined !== google.maps.Geocoder
			) {
				geocoder = new google.maps.Geocoder();
				geocoder.geocode(
					{
						address: i,
						language: dojoConfig.locale.substr(
							0,
							2
						),
						region: n,
					},
					dojo.hitch(this as PlayerLocation_Template, function (t, i) {
						if (
							i == google.maps.GeocoderStatus.OK
						) {
							this.cityChoiceResult = t;
							$("locationDialog_content") &&
								dojo.destroy(
									"locationDialog_content"
								);
							this.locationDialog =
								new ebg.popindialog();
							this.locationDialog.create(
								"locationDialog"
							);
							this.locationDialog.setTitle(
								_("Please confirm your city")
							);
							this.locationDialog.setMaxWidth(
								500
							);
							var n =
								"<div id='locationDialog_content'>";
							for (var o in t) {
								var a = t[o],
									s =
										getLocationDescriptionFromResult(
											a
										);
								n += dojo.string.substitute(
									this.jtpl_citychoice,
									{
										id: o,
										description: s,
										checked:
											0 == toint(o)
												? "checked='checked'"
												: "",
									}
								);
							}
							n += "<br/>";
							n +=
								"<input type='checkbox' id='cityprivacy' checked='checked'></input> " +
								_(
									"Show my city to other players"
								) +
								' ("' +
								$<HTMLInputElement>("cityinput")!.value +
								'")';
							n += "<br/>";
							n +=
								"<br/><div style='text-align:center'><a id='validCityChoice' class='button'><span>" +
								_("Ok") +
								"</span></a></div>";
							n += "</div>";
							this.locationDialog.setContent(n);
							this.locationDialog.show();
							dojo.connect(
								$("validCityChoice")!,
								"onclick",
								this as PlayerLocation_Template,
								"onCityChoiceConfirm"
							);
						}
						// @ts-ignore - Are these "showMessage" calls supposed to be "page.showMessage"?
						else i == google.maps.GeocoderStatus.ZERO_RESULTS ? this.showMessage("Sorry, we couldn't found your city", "error") : this.showMessage("Google Maps error: " + i, "error");
					})
				);
			} else
				this.page!.showMessage(
					_("Failed to load Google Maps"),
					"error"
				);
	}

	onCityChoiceConfirm(t: Event) {
		dojo.stopEvent(t);
		var i: string = String(0);
		dojo.query<HTMLInputElement>(".cityChoiceLink").forEach(function (e) {
			e.checked && (i = e.id.substr(15));
		});
		var n = this.cityChoiceResult[i],
			o = parseFloat(n.geometry.location.lat()),
			a = parseFloat(n.geometry.location.lng());
		$<HTMLInputElement>("lon")!.value = String(a);
		$<HTMLInputElement>("lat")!.value = String(o);
		var s = analyseLocationDescriptionFromResult(n);
		$<HTMLInputElement>("loc_city")!.value = s.city;
		$<HTMLInputElement>("loc_area1")!.value = s.area1;
		$<HTMLInputElement>("loc_area2")!.value = s.area2;
		$<HTMLInputElement>("loc_country")!.value = s.country;
		$<HTMLInputElement>("city")!.value = $<HTMLInputElement>("cityinput")!.value;
		$<HTMLInputElement>("loc_cityprivacy")!.value = $<HTMLInputElement>("cityprivacy")!.checked
			? String(0)
			: String(1);
		this.locationDialog.destroy();
		"undefined" != typeof mainsite
			? this.page!.ajaxcall(
					"/player/profile/updateCity.html",
					{ form_id: "profileinfos" },
					this,
					function () {
						this.page!.showMessage(
							__(
								"lang_mainsite",
								"Profile informations updated !"
							),
							"info"
						);
						mainsite.gotourl_forcereload(
							this.callback_url
						);
					},
					function (e) {},
					"post"
				)
			: this.page!.ajaxcall(
					"/table/table/updateCity.html",
					{ form_id: "profileinfos" },
					this,
					function () {
						this.page!.showMessage(
							__(
								"lang_mainsite",
								"Profile informations updated !"
							),
							"info"
						);
						location.reload();
					},
					function (e) {},
					"post"
				);
	}
}

let PlayerLocation = declare("ebg.playerlocation", PlayerLocation_Template);
export = PlayerLocation;


declare global {
	namespace BGA {
		type PlayerLocation = typeof PlayerLocation;
		interface EBG { playerlocation: PlayerLocation; }
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