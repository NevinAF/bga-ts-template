/** The dojoConfig object sets options and default behavior for various aspects of the dojo toolkit. This is the same object as {@link DojoJS.config}, but loaded before. */
var dojoConfig: DojoJS._base.Config = {
	parseOnLoad: false,
	// @ts-ignore
	async: true,
	useXDomain: false,
	baseUrl:
		"https://studio.boardgamearena.com:8084/data/themereleases/240409-1000/js/dojoroot/dojo/",
	packages: [
		{
			name: "ebg",
			location:
				"https://studio.boardgamearena.com:8084/data/themereleases/240409-1000/js/modules",
		},
		{
			name: "svelte",
			location:
				"https://studio.boardgamearena.com:8084/data/themereleases/240409-1000/js/sveltec/dist",
			main: "index",
		},
		{
			name: "jquery",
			location:
				"https://studio.boardgamearena.com:8084/data/themereleases/240409-1000/js/jquery",
			main: "jquery-3.4.1_noconflict.min",
		},
		{
			name: "bgagame",
			location:
				"https://studio.boardgamearena.com:8084/data/themereleases/current/games/tstemplatereversi/999999-9999/",
		},
	],
	dojoBlankHtmlUrl: "/blank.html",
	cacheBust: true,
	locale: "en",
	isDebug: true,
};

/**
 * The configuration object for bga
 */
var bgaConfig: {
	webrtcEnabled: boolean;
	facebookAppId: string;
	googleAppId: string;
	requestToken: string;
	genderRegexps: { [local: string]: {
		'forMasculine': Record<string, string>,
		'forFeminine': Record<string, string>
		'forNeutral'?: Record<string, string>
	} };
} = {
	webrtcEnabled: true,
	facebookAppId: "replace_with_real_id",
	googleAppId: "replace_with_real_id",
	requestToken: "replace_with_real_token",
	genderRegexps: {
		en: {
			forMasculine: { "~ his/her ~": " his " },
			forFeminine: { "~ his | his/her ~": " her " },
			forNeutral: { "~ his | his/her ~": " their " },
		},
		fr: {
			forMasculine: { "~\u00b7e|\u00b7es|\u00b7e\u00b7s~": "" },
			forFeminine: { "~\u00b7~": "" },
		},
		nl: {
			forMasculine: { "~ zijn/haar ~": " zijn " },
			forFeminine: { "~ zijn/haar ~": " haar " },
		},
	},
};

var webrtcConfig: {
	pcConfig: RTCConfiguration,
	pcConstraints: object,
	audioSendCodec: string,
	audioReceiveCodec: string,
	iceTricklingEnabled: boolean,
} = {
	pcConfig: {
		iceServers: [{ urls: "" }, { urls: "" }],
	},
	pcConstraints: { optional: [{ DtlsSrtpKeyAgreement: true }] },
	audioSendCodec: "",
	audioReceiveCodec: "",
	iceTricklingEnabled: true,
};

/** If true, the browser has at least one extension that is incompatible with the BGA site. */
var bAtLeastOneIncompatibility: boolean = false;

/** A helper object used to build html string for several uses within the script tags on the html page. */
var html: string =
	'<div style="background-color: white;" id="incompatibility_warning">';

var testArray: string[] = [];
for (let i in testArray) {
	// There should be nothing here !
	html += '<div style="padding:20px;position:relative">';
	html +=
		'<a style="position:absolute;top:5px;right:10px;cursor:pointer;font-size:200%;" href="#" onclick="document.getElementById(\'incompatibility_warning\').innerHTML=\'\'">X</a>';

	html +=
		"IMPORTANT WARNING : we detect that your browser is using some extension/plugin that is incompatible with this service and may break it.<br/><br/>";
	html +=
		'To solve this, please disable your extensions/plugins (or use your browser "Private mode") to find the one that is causing this issue.<br/><br/>';
	html +=
		"If you find the extension/plugin that caused this error, please copy/paste this whole message to contact@boardgamearena.com so we can help players that will get this message in the future.<br/><br/>";
	html +=
		"Technical details : this extension has modified the default prototype of JS Array, which should be avoided by extension/plugin developers .<br/>";
	// @ts-ignore - The array will have this property.
	html += i + " => " + testArray[i] + "<br/><br/>";
	html += "</div>";
	bAtLeastOneIncompatibility = true;
}

var testObject = {};
for (let i in testObject) {
	// There should be nothing here !
	html += '<div style="padding:20px;position:relative">';
	html +=
		'<a style="position:absolute;top:5px;right:10px;cursor:pointer;font-size:200%;" href="#" onclick="document.getElementById(\'incompatibility_warning\').innerHTML=\'\'">X</a>';

	html +=
		"IMPORTANT WARNING : we detect that your browser is using some extension/plugin that is incompatible with this service and may break it.<br/><br/>";
	html +=
		'To solve this, please disable your extensions/plugins (or use your browser "Private mode") to find the one that is causing this issue.<br/><br/>';
	html +=
		"If you find the extension/plugin that caused this error, please copy/paste this whole message to contact@boardgamearena.com so we can help players that will get this message in the future.<br/><br/>";
	html +=
		"Technical details : this extension has modified the default prototype of JS Object, which should be avoided by extension/plugin developers .<br/>";
	// @ts-ignore - The object will have this property.
	html += i + " => " + testObject[i] + "<br/><br/>";
	html += "</div>";
	bAtLeastOneIncompatibility = true;
}

html += "</div>";
if (bAtLeastOneIncompatibility) {
	document.write(html);
}