import dojo = require("dojo");
import declare = require("dojo/_base/declare");
import svelte = require("svelte/index");
import "dojo/has";
import "ebg/core/core";
import "ebg/core/soundManager";
import "dijit/form/Select";
import "dijit/TooltipDialog";
import "dojox/dtl/filter/htmlstrings";
import "ebg/gamenotif";
import "ebg/chatinput";
import "ebg/thumb";

declare global {
	namespace BGA {

		interface SiteCorePlayerRating {
			table?: BGA.ID | null;
			room_id?: string | null,
			media?: string | null,
			rating: BGA.ID | null;
			issue: string | null;
			text: string | null;
		}

		interface AjaxActions {
			"/player/player/pilink.html": {};
			"/table/table/quitgame.html": {
				table: BGA.ID,
				neutralized?: boolean,
				s: "table_quitgame" | "table_quitdlg" | "gameui_neutralized"
			};
			"/web/scripterror": { log: string };
			"/community/community/quitGroup.html": { id: BGA.ID };
			"/player/profile/setNotificationPreference.html": {
				type: "notifyGeneralChat",
				value: 0 | 1
			};
			"/table/table/chatHistory.html": {
				_successargs: [{
					type: BGA.ChannelInfos["type"],
					id: number,
					status?: 'underage' | 'admin' | 'newchat' | 'newchattoconfirm' | string,
					history: BGA.ChatNotifArgs[]
				}],
				type: BGA.ChannelInfos["type"],
				id: BGA.ID,
				before: number | null
			};
			"/table/table/perfs.html": { perfs: string };
			"/table/table/markTutorialAsSeen.html": { id: number };
			"/table/table/chatack.html": {
				player?: BGA.ID
				table?: BGA.ID
				list: string,
				bUnsub?: boolean
			};
			"/lobby/lobby/getPlayerWorldRanking.html": {
				game: string,
				isArena: true
			};
			"/message/board/markread.html": { id: BGA.ID };
			"/message/board/markreads.html": { ids: string };
			"/table/table/debugPing.html": { bgaversion: string };
			"/table/table/rateGame.html": SiteCorePlayerRating;
			"/videochat/videochat/rateChat.html": SiteCorePlayerRating;
			"/support/support/rateSupport.html": SiteCorePlayerRating;
			"/videochat/videochat/recordStat.html": {
				player: BGA.ID,
				room: BGA.RoomId,
				startStop:  "start" | "stop",
				media: "video" | "audio",
			};
		}

		interface SiteCoreMenuLabelMappings {
			preferences: "welcome",
			playernotif: "welcome",
			welcomestudio: "welcome",
			start: "welcome",
			legal: "welcome",
			message: "welcome",
			gameinprogress: "welcome",
			table: "lobby",
			lobby: "gamelobby",
			meetinglobby: "gamelobby",
			availableplayers: "gamelobby",
			createtable: "gamelobby",
			newtable: "gamelobby",
			gamereview: "gamelobby",
			gamelobby: "gamelobby",
			gamelobbyauto: "gamelobby",
			tournament: "gamelobby",
			newtournament: "gamelobby",
			tournamentlist: "gamelobby",
			gamepanel: "gamelist",
			games: "gamelist",
			player: "community",
			playerstat: "community",
			group: "community",
			newgroup: "community",
			community: "community",
			report: "community",
			newreport: "community",
			moderated: "community",
			translation: "community",
			translationhq: "community",
			map: "community",
			grouplist: "community",
			contribute: "community",
			sponsorship: "community",
			moderator: "community",
			bug: "community",
			bugs: "community",
			faq: "community",
			gamepublishers: "community",
			team: "community",
			troubleshootmainsite: "community",
			sandbox: "community",
			penalty: "community",
			karmalimit: "community",
			club: "premium",
			premium: "premium",
			contact: "community",
			reviewer: "community",
			giftcodes: "premium",
			shop: "shop",
			shopsupport: "shopsupport",
			prestige: "competition",
			gameranking: "competition",
			award: "competition",
			gamestats: "competition",
			leaderboard: "competition",
			page: "doc",
			news: "headlines",
			controlpanel: "controlpanel",
			linkmoderation: "controlpanel",
			moderation: "controlpanel",
			studio: "controlpanel",
			studiogame: "controlpanel",
			administration: "controlpanel",
			banners: "controlpanel",
			projects: "projects",
			startwannaplay: "welcome",
			startsteps: "welcome",
			halloffame: "halloffame",
		}
	
		interface SiteCorePredefinedTextMessages {
			tbleave: "Sorry I will continue to play later.",
			goodmove: "Sorry I have an emergency: I'm back in few seconds...",
			gm: "Good move!",
			think: "I would like to think a little, thank you",
			stillthinkin: "Yeah, still there, just thinking.",
			stillthere: "Hey, are you still there?",
			gg: "Good Game!",
			glhf: "Good luck, have fun!",
			hf: "Have fun!",
			tftg: "Thanks for the game!"
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
			is_writing_now: Record<string /* player name */, number>;
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
			param: { to?: BGA.ID;  table?: BGA.ID; };
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

interface SiteCore_Template extends InstanceType<typeof ebg.core.core> {}

/** Partial: This has been partially typed based on a subset of the BGA source code. */
class SiteCore_Template
{
	/** The name of the game currently being played. This will always be the lowercase and spaceless version: 'yourgamename'. */
	game_name?: string;

	/** The component used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
	notifqueue: InstanceType<BGA.GameNotif> & {
		log_notification_name?: boolean;
	} = new ebg.gamenotif()

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
	showMessage(message: string, type?: 'info' | 'error' | 'only_to_log' | string): void {
		this.next_headmsg_id;
		if ("only_to_log" != type) {
			var n = "head_infomsg_" + this.next_headmsg_id,
				o =
					"<div class='bga-link-inside head_" +
					type +
					"' id='" +
					n +
					"' style='display:none;'><div class='head_infomsg_close' id='close_" +
					n +
					"'><i class='fa fa-close' aria-hidden='true'></i></div><div class='head_infomsg_item'>" +
					message +
					"</div></div>";
			this.next_headmsg_id++;
			dojo.place(o, "head_infomsg");
			dojo.connect(
				$("close_" + n) as HTMLElement,
				"onclick",
				this,
				function (t) {
					dojo.style(
						((t.currentTarget as HTMLElement).parentElement as HTMLElement).id,
						"display",
						"none"
					);
				}
			);
			dojo.fx
				.chain([
					dojo.fx.wipeIn({ node: n, duration: 500 }),
					dojo.fx.wipeOut({
						node: n,
						delay: 5e3,
						duration: 500,
					}),
				])
				.play();
		}
		("error" != type && "only_to_log" != type) ||
			g_sitecore.notifqueue.addToLog(message);
	}


	//#region Internal

	/** Internal. An internal count to track the number of ajax calls made. */
	ajaxcall_running: number = 0;
	/** Internal. The current active menu label type. This is updated by using that {@link changeActiveMenuItem} function. This is used to remember the previous pick for cleanup before changing. */
	active_menu_label: BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings] | '' = "";
	/** Internal. Counter used by {@link showMessage} function to create a unique identifier for the DOM element. */
	next_headmsg_id: number = 1;
	/** Internal. If CometD (web messaging service) has been set up. */
	cometd_is_connected: boolean = false;
	/** Internal. Once {@link unload} is called, this is set to true, and used to help tear everything down without issues. */
	page_is_unloading: boolean = false;
	/** Internal. @deprecated This is not used within the main code file anymore. */
	cometd_first_connect: boolean = true;
	/** Internal. The list of cometd subscriptions managed by {@link subscribeCometdChannel} and {@link unsubscribeCometdChannel}. The key is the comet id used for emits, and the number is the amount of subscriptions to that id. */
	cometd_subscriptions = {} as Record<string, number>;
	/** Internal. True when a timeout is set to help with scripting errors. */
	reportErrorTimeout: boolean = false;
	/** Internal. Counter representing the id of the next log statement. This is used to create a unique DOM id for callback events when expanding log statements. */
	next_log_id: number = 0;
	/** Internal. A record of the chat bar windows, stored by their element id. */
	chatbarWindows = {} as Record<BGA.ChannelInfos['window_id'], BGA.ChatWindowMetadata>;
	/** Internal. The js template for a chatwindow. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_chatwindow = '<div id="chatwindow_${id}" class="chatwindow chatwindowtype_${type}"><div id="chatwindowexpanded_${id}" class="chatwindowexpanded"><div class="dropshadow"></div><div id="chatbarinput_${id}" class="chatbarinput"></div><div id="chatbarbelowinput_${id}" class="chatbarbelowinput"><div id="chatbarinput_stopnotif_${id}" class="chatbarinput_stopnotif"><input type="checkbox" checked="checked" id="chatbarinput_stopnotif_box_${id}" /><span id="chatbarinput_stopnotif_label_${id}">${stop_notif_label}</span></div><div id="chatbarinput_startaudiochat_${id}" class="chatwindow_startaudiochat chatbarbelowinput_item audiovideo_inactive"><i class="fa fa-microphone"></i></div><div id="chatbarinput_startvideochat_${id}" class="chatwindow_startvideochat chatbarbelowinput_item audiovideo_inactive"><i class="fa fa-video-camera"></i></div><div id="chatbarinput_predefined_${id}" class="chatbarbelowinput_item"><div class="chatbarinput_predefined icon20 icon20_meeple_wb"></div></div><div id="chatbarinput_showcursor_${id}" class="chatbarbelowinput_item chatbarbelowinput_item_showcursor"><i class="fa fa-hand-pointer-o"></i></div><div id="chatbar_startchat_${id}" class="chatbar_startchat"><a class="bgabutton bgabutton_blue" id="startchat_accept_${id}">${start_chat}</a><br /><a class="bgabutton bgabutton_red" id="startchat_block_${id}">${block_chat}</a></div></div><div id="chatwindowlogs_${id}" class="chatwindowlogs"><div id="chatwindowlogstitlebar_${id}" class="chatwindowlogstitlebar"><div class="chatwindowlogstitle" id="chatwindowlogstitle_${id}"><span id="is_writing_now_title_${id}" class="is_writing_now"><i class="fa fa-pencil fa-blink"></i>&nbsp;<span id="is_writing_now_expl_title_${id}" class="is_writing_now_expl"></span></span><span id="chatwindowlogstitle_content_${id}">${title}</span></div><div id="chatwindowicon_${id}" class="chatwindowicon"><div class="avatarwrap emblemwrap">${avatar}</div></div><div id="chatwindowcollapse_${id}" class="chatwindowcollapse icon20 icon20_collapse_white"></div><div id="chatwindowremove_${id}" class="chatwindowremove icon20 icon20_remove_white"></div></div><div id="chatwindowlogs_zone_${id}" class="chatwindowlogs_zone"><div id="chatwindowlogs_endzone_${id}" class="chatwindowlogs_endzone"></div></div><div id="chatwindowmorelogs_${id}" class="chatwindowmorelogs roundedbox"><a class="bga-link" id="chatwindowmorelogslink_${id}" href="#">${more_logs_label}</a></div></div></div><div id="chatwindowpreview_${id}" class="chatwindowpreview"></div><div id="chatwindowcollapsed_${id}" class="chatwindowcollapsed"><div class="chatwindowcollapsedtitle"><span id="chatwindownewmsgcount_${id}" class="chatwindownewmsgcount"></span><span id="is_writing_now_${id}" class="is_writing_now"><i class="fa fa-pencil fa-blink"></i>&nbsp;<span id="is_writing_now_expl_${id}" class="is_writing_now_expl"></span></span><span id="chatwindowtitlenolink_${id}">${titlenolink}</span></div><div id="chatwindowremovc_${id}" class="chatwindowremovec icon20 icon20_remove"></div><div class="chatwindowavatar"><div class="avatarwrap emblemwrap emblemwrap_l">${avatar}</div><div id="chatMindownewmsgcount_${id}" class="chatwindownewmsgcount chatMindownewmsgcount"></div><i class="bubblecaret fa fa-caret-up"></i></div></div></div>';

	/** Internal. This is set by the html scripts depending on the webpage type. */
	dockedChat?: boolean;
	/** Internal. */
	dockedChatInitialized: boolean = false;
	/** Internal. */
	groupToCometdSubs = {} as Record<string, `/group/g${number}`>;
	/** Internal. */
	window_visibility: 'visible' | 'hidden' = "visible";
	/** Internal. Translated string representing the button to send the user to the audio/video call feature. */
	premiumMsgAudioVideo: string | null = null;
	/** Internal. List of bad words that should be filtered.*/
	badWordList = ["youporn", "redtube", "pornotube", "pornhub", "xtube", "a-hole", "dumb", "fool", "imbecile", "nutcase", "dipstick", "lunatic", "weirdo", "dork", "dope", "dimwit", "half-wit", "oaf", "bimbo", "jerk", "numskull", "numbskull", "goof", "suck", "moron", "morons", "idiot", "idi0t", "rape", "rapist", "hitler", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck ", "cocksucked ", "cocksucker", "cocksucking", "cocksucks ", "cocksuka", "cocksukka", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick ", "cuntlicker ", "cuntlicking ", "cunts", "cyalis", "cyberfuc", "cyberfuck ", "cyberfucked ", "cyberfucker", "cyberfuckers", "cyberfucking ", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates ", "ejaculating ", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck ", "fingerfucked ", "fingerfucker ", "fingerfuckers", "fingerfucking ", "fingerfucks ", "fistfuck", "fistfucked ", "fistfucker ", "fistfuckers ", "fistfucking ", "fistfuckings ", "fistfucks ", "flange", "fook", "fooker", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckings", "fuckingshitmotherfucker", "fuckme ", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged ", "gangbangs ", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex ", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off ", "jackoff", "jap", "jerk-off ", "jism", "jiz ", "jizm ", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lmfao", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked ", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking ", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers ", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim ", "orgasims ", "orgasm", "orgasms ", "p0rn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses ", "pissflaps", "pissin ", "pissing", "pissoff ", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks ", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys ", "rectum", "retards", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters ", "shitting", "shittings", "shitty ", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "enculé", "baiser", "nique", "niquer", "salope", "pute", "fuck", "f*ck", "f**k", "noob"] as const;
	/** Internal. */
	tutorialHighlightedQueue: {
		id: string,
		text: string,
		optclass: string
	}[] = []
	/** Internal. The amount of time in seconds that the user has been inactive on this page. Once this reaches 2 minutes, a message will popup as an infoDialog. */
	browser_inactivity_time: number = 0;
	/** Internal. If {@link browser_inactivity_time} has reached 2 minutes and a message has been displayed. */
	bInactiveBrowser: boolean = false;
	/** Internal. @deprecated This is not used within the main code file anymore. */
	red_thumbs_given = {};
	/** Internal. @deprecated This is not used within the main code file anymore. */
	red_thumbs_taken = {};
	/** Internal. If truthy, this represents the detached chat for the page. */
	chatDetached?: false | { type: 'table' | 'player' | 'chat' | 'general' | 'group' | null, id: number, chatname: string };
	/** Internal. Set to true when there is currently a detached chat on the page. */
	bChatDetached?: boolean;
	/** Internal. Record of non translated quick chat messages. This is fully listed for convenience, but may not represent updated values. */
	predefinedTextMessages?: BGA.SiteCorePredefinedTextMessages & Record<string, string>;
	/** Internal. Inverse lookup for the {@link predefinedTextMessages} */
	predefinedTextMessages_untranslated?: {
		[P in keyof BGA.SiteCorePredefinedTextMessages as BGA.SiteCorePredefinedTextMessages[P]]: P
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

	constructor() {
		g_sitecore = this;
		var e = new URLSearchParams(window.location.search);
		if (e.has("media_rating") && e.has("room")) {
			var t = e.get("media_rating"),
				i = e.get("room");
			("video" != t && "audio" != t) ||
				g_sitecore.displayRatingContent(t, {
					room_id: i,
					media: t,
					rating: null,
					issue: null,
					text: null,
				});
		}
	}
	

	/** Internal. Initializes functionality and fields related to {@link BGA.SiteCore}, such as volume listeners and inactivity timers. This should be called manually by subclasses during there initializer functions (i.e, {@link MainSite.create} and {@link BGA.Gamegui.completesetup}). */
	init_core(): void {
		dojo.version.toString();
		this.premiumMsgAudioVideo =
			__(
				"lang_mainsite",
				"Premium feature: audio or video calls can be started by Premium players."
			) +
			'<br /><a href="/premium?src=avchat">' +
			__(
				"lang_mainsite",
				"To be able to start a live chat with fellow players, go Premium!"
			) +
			"</a><br />" +
			__(
				"lang_mainsite",
				"(browser compatibility: %s)"
			).replace("%s", "Chrome, Firefox, Opera");
		dojo.removeClass("ebd-body", "page_is_loading");
		$("head_infomsg") && dojo.empty("head_infomsg");
		this.takeIntoAccountAndroidIosRequestDesktopWebsite(
			document
		);
		if (
			"undefined" != typeof mainsite &&
			mainsite.dockedChat &&
			(undefined === this.chatDetached ||
				null === (this.chatDetached as any).type)
		) {
			this.notifqueue.onPlaceLogOnChannel = dojo.hitch(
				this,
				"onPlaceLogOnChannel"
			);
			this.initChatDockedSystem();
		}
		if ("undefined" != typeof gameui && gameui.dockedChat) {
			this.notifqueue.onPlaceLogOnChannel = dojo.hitch(
				this,
				"onPlaceLogOnChannel"
			);
			this.initChatDockedSystem();
		}
		this.isTouchDevice =
			"ontouchstart" in window ||
			// @ts-ignore - this is a bad check? or is it a custom property?
			navigator.msMaxTouchPoints > 0;
		this.isTouchDevice
			? dojo.addClass("ebd-body", "touch-device")
			: dojo.addClass("ebd-body", "notouch-device");
		this.predefinedTextMessages = {
			tbleave: "Sorry I will continue to play later.",
			goodmove:
				"Sorry I have an emergency: I'm back in few seconds...",
			gm: "Good move!",
			think: "I would like to think a little, thank you",
			stillthinkin: "Yeah, still there, just thinking.",
			stillthere: "Hey, are you still there?",
			gg: "Good Game!",
			glhf: "Good luck, have fun!",
			hf: "Have fun!",
			tftg: "Thanks for the game!",
		};
		this.predefinedTextMessages_untranslated = {
			"Sorry I will continue to play later.": "tbleave",
			"Sorry I have an emergency: I'm back in few seconds...":
				"goodmove",
			"Good move!": "gm",
			"Yeah, still there, just thinking.": "stillthinkin",
			"Hey, are you still there?": "stillthere",
			"I would like to think a little, thank you":
				"think",
			"Good Game!": "gg",
			"Good luck, have fun!": "glhf",
			"Have fun!": "hf",
			"Thanks for the game!": "tftg",
		};
		this.predefinedTextMessages_target_translation = {
			tbleave: __(
				"lang_mainsite",
				"Sorry I will continue to play later."
			),
			goodmove: __(
				"lang_mainsite",
				"Sorry I have an emergency: I'm back in few seconds..."
			),
			gm: __("lang_mainsite", "Good move!"),
			think: __(
				"lang_mainsite",
				"I would like to think a little, thank you"
			),
			stillthinkin: __(
				"lang_mainsite",
				"Yeah, still there, just thinking."
			),
			stillthere: __(
				"lang_mainsite",
				"Hey, are you still there?"
			),
			gg: __("lang_mainsite", "Good Game!"),
			glhf: __("lang_mainsite", "Good luck, have fun!"),
			// @ts-ignore - this is a test case that shouldn't really be here.
			test: __(
				"lang_mainsite",
				"We detect an insult in your chat input."
			),
			hf: __("lang_mainsite", "Have fun!"),
			tftg: __("lang_mainsite", "Thanks for the game!"),
		};
		$("seemorelogs_btn") &&
			dojo.connect(
				$("seemorelogs_btn") as HTMLElement,
				"onclick",
				this,
				"onSeeMoreLogs"
			);
		this.initMonitoringWindowVisibilityChange();
		var t: number = ($("servicetime") as HTMLElement).innerHTML as any,
			n = new Date(),
			o = 60 * n.getHours() + n.getMinutes();
		this.timezoneDelta = Math.round((o - t) / 60);
		this.timezoneDelta < 0 && (this.timezoneDelta += 24);
		this.register_subs(
			dojo.subscribe("ackmsg", this, "onAckMsg")
		);
		this.register_subs(
			dojo.subscribe(
				"force_browser_reload",
				this,
				"onForceBrowserReload"
			)
		);
		this.register_subs(
			dojo.subscribe("debugPing", this, "onDebugPing")
		);
		this.register_subs(
			dojo.subscribe(
				"newRequestToken",
				this,
				"onNewRequestToken"
			)
		);
		$("toggleDebugFunctions") &&
			dojo.connect(
				$("toggleDebugFunctions") as HTMLElement,
				"onclick",
				this,
				"onDisplayDebugFunctions"
			);
		if (
			// @ts-ignore - this is a bad check? MuteSound is definately set to a boolean.
			1 == soundManager.bMuteSound &&
			null !== $("toggleSound_icon")
		) {
			dojo.removeClass("toggleSound_icon", "fa-volume-up");
			dojo.addClass("toggleSound_icon", "fa-volume-off");
		}
		if ($("toggleSound")) {
			dojo.connect(
				$("toggleSound") as HTMLElement,
				"onclick",
				this,
				"onToggleSound"
			);
			dojo.connect(
				$("toggleSound") as HTMLElement,
				"onmouseover",
				this,
				"onDisplaySoundControls"
			);
			dojo.connect(
				$("toggleSound") as HTMLElement,
				"onmouseout",
				this,
				"onHideSoundControls"
			);
		}
		if ($("soundVolumeControl")) {
			dojo.connect(
				$("soundVolumeControl") as HTMLElement,
				"onmouseup",
				this,
				"onSoundVolumeControl"
			);
			dojo.connect(
				$("soundVolumeControl") as HTMLElement,
				"ontouchend",
				this,
				"onSoundVolumeControl"
			);
		}
		if ($("soundControls")) {
			dojo.connect(
				$("soundControls") as HTMLElement,
				"onmouseover",
				this,
				"onStickSoundControls"
			);
			dojo.connect(
				$("soundControls") as HTMLElement,
				"onmouseout",
				this,
				"onUnstickSoundControls"
			);
		}
		{
			let e = true;
			svelte.stores.userVolume.subscribe((t: any) => {
				t.volume, t.volumeMuted;
				localStorage.setItem(
					"sound_muted",
					t.volumeMuted ? "1" : "0"
				);
				localStorage.setItem("sound_volume", t.volume);
				this.onSetSoundVolume(!e);
				e = false;
			});
		}
		this.bgaUniversalModals =
			new svelte.ms.universalmodals.BgaUniversalModals({
				target: document.body,
			});
		this.bgaToastHolder = new svelte.ms.toasts.BgaToastHolder({
			target: document.body,
		});
		setInterval(
			dojo.hitch(this, "inactivityTimerIncrement"),
			6e4
		);
		document.onmousemove = dojo.hitch(
			this,
			"resetInactivityTimer"
		);
		document.onkeypress = dojo.hitch(
			this,
			"resetInactivityTimer"
		);
		$("pilink") &&
			dojo.connect(
				$("pilink") as HTMLElement,
				"onclick",
				this,
				function (t) {
					dojo.stopEvent(t);
					this.ajaxcall(
						"/player/player/pilink.html",
						{},
						this,
						function (e) {}
					);
				}
			);
	}

	/** Internal. Sets the {@link page_is_unloading} property to true and calls {@link recordMediaStats} with `'stop'`. This is triggered by {@link DojoJS._base.unload}. */
	unload(): void {
		var e =
			undefined !== this.current_player_id
				? this.current_player_id
				: this.player_id;
		this.recordMediaStats(e!, "stop");
		this.page_is_unloading = true;
	}

	/** Internal. Sets the 'svelte/index' modules menu states page loading status. This is set to true if there are any {@link ajaxcall_running}. */
	updateAjaxCallStatus(): void {
		svelte.stores.menuStates.setIsPageLoading(
			this.ajaxcall_running > 0
		);
	}

	/** Internal. Sets the active menu label and page name based on the key given. */
	changeActiveMenuItem(key: ""): "";
	changeActiveMenuItem<T extends BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings]>(key: T): T;
	changeActiveMenuItem<T extends keyof BGA.SiteCoreMenuLabelMappings>(key: T): BGA.SiteCoreMenuLabelMappings[T] {
		svelte.stores.menuStates.setActivePageName(key);
		menu_label_mappings = {
			preferences: "welcome",
			playernotif: "welcome",
			welcomestudio: "welcome",
			start: "welcome",
			legal: "welcome",
			message: "welcome",
			gameinprogress: "welcome",
			table: "lobby",
			lobby: "gamelobby",
			meetinglobby: "gamelobby",
			availableplayers: "gamelobby",
			createtable: "gamelobby",
			newtable: "gamelobby",
			gamereview: "gamelobby",
			gamelobby: "gamelobby",
			gamelobbyauto: "gamelobby",
			tournament: "gamelobby",
			newtournament: "gamelobby",
			tournamentlist: "gamelobby",
			gamepanel: "gamelist",
			games: "gamelist",
			player: "community",
			playerstat: "community",
			group: "community",
			newgroup: "community",
			community: "community",
			report: "community",
			newreport: "community",
			moderated: "community",
			translation: "community",
			translationhq: "community",
			map: "community",
			grouplist: "community",
			contribute: "community",
			sponsorship: "community",
			moderator: "community",
			bug: "community",
			bugs: "community",
			faq: "community",
			gamepublishers: "community",
			team: "community",
			troubleshootmainsite: "community",
			sandbox: "community",
			penalty: "community",
			karmalimit: "community",
			club: "premium",
			premium: "premium",
			contact: "community",
			reviewer: "community",
			giftcodes: "premium",
			shop: "shop",
			shopsupport: "shopsupport",
			prestige: "competition",
			gameranking: "competition",
			award: "competition",
			gamestats: "competition",
			leaderboard: "competition",
			page: "doc",
			news: "headlines",
			controlpanel: "controlpanel",
			linkmoderation: "controlpanel",
			moderation: "controlpanel",
			studio: "controlpanel",
			studiogame: "controlpanel",
			administration: "controlpanel",
			banners: "controlpanel",
			projects: "projects",
			startwannaplay: "welcome",
			startsteps: "welcome",
			halloffame: "halloffame",
		};
		let mappedKey: BGA.SiteCoreMenuLabelMappings[keyof BGA.SiteCoreMenuLabelMappings];
		if (menu_label_mappings[key])
			mappedKey = menu_label_mappings[key];
		else mappedKey = key as any; // Overload fix

		if ("" != this.active_menu_label) {
			this.active_menu_label;
			$("navbutton_" + this.active_menu_label) &&
				dojo.removeClass(
					"navbutton_" + this.active_menu_label,
					"navigation-button-active"
				);
			svelte.stores.menuStates.setActiveMenuItem(null);
		}
		this.active_menu_label = mappedKey;
		// @ts-ignore - no overlap based on method overload.
		if ("" != mappedKey) {
			$("navbutton_" + mappedKey) &&
				dojo.addClass(
					"navbutton_" + mappedKey,
					"navigation-button-active"
				);
			svelte.stores.menuStates.setActiveMenuItem(key);
		}
		return key as any
	}

	/** Internal. If the current cometd_service is 'socketio', then event is added to the socket using `.emit("join")` and keyed into the {@link cometd_subscriptions}. */
	subscribeCometdChannel<T extends string>(event: T, _1?: any, _2?: any): T | void {
		if ("socketio" == this.cometd_service) {
			if (undefined === this.cometd_subscriptions[event]) {
				this.socket!.emit("join", event);
				this.cometd_subscriptions[event] = 1;
			} else {
				this.cometd_subscriptions[event]++;
				this.cometd_subscriptions[event];
			}
			return event;
		}
	}

	/** Internal. If the current cometd_service is 'socketio', then the events are added to the socket using `.emit("join")` and keyed into the {@link cometd_subscriptions}. */
	subscribeCometdChannels<const T extends Record<string, string>>(events: T, _1?: any, _2?: any): T | {} {
		var n = {};
		if ("socketio" == this.cometd_service) {
			var o = [];
			for (var a in events) {
				var s = events[a]!;
				if (undefined === this.cometd_subscriptions[s]) {
					o.push(s);
					this.cometd_subscriptions[s] = 1;
				} else {
					this.cometd_subscriptions[s]!++;
					this.cometd_subscriptions[s];
				}
			}
			o.length > 0 && this.socket!.emit("join", o);
			n = events;
		}
		return n;
	}

	/** Internal. Unsubscribes a single listener to the given event. If there are no more listeners for that event, then the listener is removed from the socket using `.emit("leave")`. */
	unsubscribeCometdChannel(event: string): void {
		if (undefined !== this.cometd_subscriptions[event]) {
			this.cometd_subscriptions[event]--;
			if (0 == this.cometd_subscriptions[event]) {
				this.socket!.emit("leave", event);
				delete this.cometd_subscriptions[event];
			} else this.cometd_subscriptions[event];
		}
	}

	/** Internal. For all keys in {@link cometd_subscriptions}, the event will be rejoined if needed using `.emit("join"). */
	reconnectAllSubscriptions(): void {
		this.cometd_subscriptions;
		var e = [];
		for (var t in this.cometd_subscriptions) e.push(t);
		e.length > 0 && this.socket!.emit("join", e);
	}

	/** Internal. Callback for when the socket io connection changes. This updates the connect status and posts notifications if needed. */
	onSocketIoConnectionStatusChanged(status: 'connect' | 'connect_error' | 'connect_timeout' | 'reconnect' | 'reconnect_failed' | 'reconnect_attempt' | string, error?: string): void {
		let connect_status = $("connect_status_text") as HTMLElement;
		if (this.page_is_unloading)
			dojo.style("connect_status", "display", "none");
		else if ("connect" == status) {
			dojo.style("connect_status", "display", "none");
			this.cometd_is_connected = true;
		} else if ("connect_error" == status) {
			dojo.style("connect_status", "display", "block");
			this.cometd_is_connected = false;
			connect_status.innerHTML = __(
				"lang_mainsite",
				"Disconnected from game server !"
			);
			console.error(
				"Disconnected from game server : " + error
			);
			g_sitecore.notifqueue.addToLog(
				connect_status.innerHTML
			);
		} else if ("connect_timeout" == status) {
			dojo.style("connect_status", "display", "block");
			this.cometd_is_connected = false;
			connect_status.innerHTML = __(
				"lang_mainsite",
				"Disconnected from game server !"
			);
			connect_status.innerHTML += " (timeout)";
			g_sitecore.notifqueue.addToLog(
				connect_status.innerHTML
			);
		} else if ("reconnect" == status) {
			dojo.style("connect_status", "display", "none");
			this.cometd_is_connected = true;
			g_sitecore.notifqueue.addToLog(
				__("lang_mainsite", "You are connected again.")
			);
			this.reconnectAllSubscriptions();
		} else if ("reconnect_error" == status) {
			dojo.style("connect_status", "display", "block");
			this.cometd_is_connected = false;
			connect_status.innerHTML = __(
				"lang_mainsite",
				"Disconnected from game server !"
			);
			console.error(
				"Disconnected from game server : " + error
			);
			g_sitecore.notifqueue.addToLog(
				connect_status.innerHTML
			);
		} else if ("reconnect_failed" == status) {
			dojo.style("connect_status", "display", "block");
			this.cometd_is_connected = false;
			connect_status.innerHTML = __(
				"lang_mainsite",
				"Disconnected from game server !"
			);
			connect_status.innerHTML +=
				" (reconnect failed)";
			g_sitecore.notifqueue.addToLog(
				connect_status.innerHTML
			);
		}
	}

	/** Internal. A noop placeholder. */
	onFirstConnectedToComet() {}

	/** Internal. Preforms an {@link ajaxcall} for leaving a table and shows a confirmation popin if necessary (depending on the game's state). */
	leaveTable(table_id: BGA.ID, success_callback: () => void): void {
		this.ajaxcall(
			"/table/table/quitgame.html",
			{ table: table_id, neutralized: true, s: "table_quitgame" },
			this,
			function (e) {
				success_callback();
			},
			function (n, o, a) {
				if (n && (803 == a || 804 == a)) {
					var s = new ebg.popindialog();
					s.create("quitConfirmContent");
					s.setTitle(
						__(
							"lang_mainsite",
							"Quit game in progress"
						)
					);
					s.tableModule = this;
					var r = '<div id="quitConfirmContent">';
					if (803 == a) {
						r +=
							__(
								"lang_mainsite",
								"You are about to quit a game in progress."
							) + "<br/>";
						r += __(
							"lang_mainsite",
							"This will cost you some <img src='theme/img/common/rank.png' class='imgtext'/> for this game, and 1 <div class='icon20 icon20_penaltyleave'></div> for your reputation.<br/><br/>"
						);
						r +=
							'<b style="color:red">' +
							__(
								"lang_mainsite",
								"A bad reputation may prevent you to chat or to join some games!"
							) +
							"</b><br/><br/>";
						r += `\n                                    <span>${__(
							"lang_mainsite",
							"Before deciding to quit a game in progess, especially if your opponent is not playing, please consider the following alternatives"
						)}:</span>\n                                    <ul>\n                                        <li class="list-disc ml-6"">${__(
							"lang_mainsite",
							"You can vote to abandon/concede the game collectively to avoid losing ELO or Karma points"
						)}</li>\n                                        <li class="list-disc ml-6"">${__(
							"lang_mainsite",
							"You can vote to change the game to turn-based mode to allow out-of-time players to return to the table later and continue playing"
						)}</li>\n                                        <li class="list-disc ml-6"">${__(
							"lang_mainsite",
							"You can choose to eject out-of-time players from the game (causing them to lose ELO and Karma)"
						)}</li>\n                                    </ul>\n                                <br/>`;
					} else {
						r +=
							__(
								"lang_mainsite",
								"You are about to quit a Training game in progress."
							) + "<br/>";
						r += __(
							"lang_mainsite",
							"Because this is a Training game, this will have no consequence (no penalty whatsoever)."
						);
					}
					r +=
						"<p><a class='bgabutton bgabutton_blue' id='quitgame_cancel' href='#'>" +
						__("lang_mainsite", "Cancel") +
						"</a>&nbsp;&nbsp;&nbsp;<a class='bgabutton bgabutton_gray' id='quitgame_confirm' href='#'>" +
						__("lang_mainsite", "Leave game") +
						"</a></p>";
					r += "</div>";
					s.setContent(r);
					s.show();
					dojo.connect(
						$("quitgame_cancel") as HTMLElement,
						"onclick",
						dojo.hitch(s, function (e) {
							e.preventDefault();
							this.destroy();
						})
					);
					dojo.connect(
						$("quitgame_confirm") as HTMLElement,
						"onclick",
						dojo.hitch(s, function (e) {
							e.preventDefault();
							this.destroy();
							this.tableModule!.ajaxcall(
								"/table/table/quitgame.html",
								{
									table: table_id,
									s: "table_quitdlg",
								},
								this,
								function (e) {
									success_callback();
								}
							);
						})
					);
				}
			}
		);
	}

	/** Internal. Increases the logs element max height by 600px. */
	onSeeMoreLogs(event: Event): void {
		event.preventDefault();
		var i = toint(dojo.style($("logs") as HTMLElement, "maxHeight")),
			n = i + 600;
		dojo.style($("logs") as HTMLElement, "maxHeight", n + "px");
		dojo.style($("seemorelogs") as HTMLElement, "top", n - 24 + "px");
		this.onIncreaseContentHeight(600);
	}

	/** Internal. A noop placeholder for when {@link onSeeMoreLogs} is called. */
	onIncreaseContentHeight(heightIncrease: number) {}

	/** Internal. Assuming the pase is not currently unloading, this will print the error, url, and line of a script error to the console and show a message in red on the page labeled `Javascript error: ...`. This is directly hooked into the window.onerror property and called manually within a few catch statements. */
	onScriptError(error: ErrorEvent | string | Event, url: string, line?: number | string): void {
		if (!this.page_is_unloading) {
			console.error(error);
			console.error("url=" + url);
			console.error("line=" + line);
			// @ts-ignore - TODO: fix this conversion better...
			"function" == typeof (this as typeof gameui).setLoader &&
				// @ts-ignore - TODO: fix this conversion better...
				(this as typeof gameui).setLoader(100, 100);
			if (
				false !== this.reportJsError &&
				-1 == url.search("telwa/cometd?") &&
				-1 == url.search("cloudfront.net") &&
				"ResizeObserver loop limit exceeded" !== error &&
				"ResizeObserver loop completed with undelivered notifications." !==
					error &&
				"Script error." !== error
			) {
				var o =
					error +
					"\nScript: " +
					url +
					"\nUrl: " +
					window.location +
					"\n";
				$("bga_release_id") &&
					(o +=
						"BGA version " +
						($("bga_release_id") as HTMLElement).innerHTML +
						"\n");
				// @ts-ignore - TODO: fix this conversion better...
				o += (this as typeof gameui).getScriptErrorModuleInfos() + "\n";
				o += navigator.userAgent + "\n";
				if ("show" == this.reportJsError) {
					var a = this.nl2br(o, false);
					this.showMessage(
						"Javascript error:<br/>" + a,
						"error"
					);
				}
				if (!this.reportErrorTimeout) {
					this.reportErrorTimeout = true;
					setTimeout(
						dojo.hitch(this, function () {
							this.reportErrorTimeout = false;
						}),
						6e4
					);
					this.ajaxcall(
						"/web/scripterror",
						{ log: o },
						this,
						function (e) {}
					);
				}
			}
		}
	}

	/** Internal. Initializes the docked chat. This uses {@link jstpl_chatwindow} to create the visible DOM element. */
	initChatDockedSystem(): void {
		var t = {
			id: "stacked",
			type: "stacked",
			title: '<div class="icon20 icon20_speak"></div>',
			titlenolink:
				'<span style="font-size:120%">+</span>',
			avatar: '<i class="fa fa-ellipsis-h" aria-hidden="true"></i>',
			more_logs_label: __(
				"lang_mainsite",
				"Scroll down to see new messages"
			),
			stop_notif_label: __(
				"lang_mainsite",
				"Notify chat messages"
			),
			start_chat: __("lang_mainsite", "Accept chat"),
			block_chat: __("lang_mainsite", "Block player"),
		};
		dojo.place(
			this.format_string(this.jstpl_chatwindow, t),
			"chatbarstackedmenu",
			"first"
		);
		dojo.place(
			'<div id="stackedmenu"></div>',
			"chatwindowcollapsed_stacked"
		);
		dojo.connect(
			$("chatwindowcollapsed_stacked") as HTMLElement,
			"onclick",
			this,
			"onToggleStackMenu"
		);
		this.adaptChatbarDock();
		dojo.connect(
			window,
			"onresize",
			this,
			dojo.hitch(this, function (e) {
				this.stackOrUnstackIfNeeded();
			})
		);
		this.dockedChatInitialized = true;
	}

	/** Internal. Returns a {@link ChannelInfos} object containting channel information of a {@link BGA.Notif}. Expects a ChatNotif, and will return null if the {@link BGA.Notif.channelorig} does not match as {@link ChannelInfos.channel} */
	extractChannelInfosFromNotif(notif: BGA.ChatNotif): BGA.ChannelInfos | null {
		var i = notif.channelorig!,
			n = dojo.hasClass("ebd-body", "mobile_version");
		if ("/table/t" == i.substr(0, 8)) {
			var o = i.substr(8) as BGA.ID,
				a = "";
			if (undefined !== notif.gamenameorig) {
				var s =
					this.getGameNameDisplayed(notif.gamenameorig) +
					" #" +
					o;
				a = notif.gamenameorig;
			} else if (undefined !== notif.args.game_name_ori) {
				s =
					this.getGameNameDisplayed(
						notif.args.game_name_ori
					) +
					" #" +
					o;
				a = notif.args.game_name_ori;
			} else if (undefined !== notif.args.game_name) {
				s =
					this.getGameNameDisplayed(
						notif.args.game_name
					) +
					" #" +
					o;
				a = notif.args.game_name;
			} else s = "Table #" + o;
			return "chat" == notif.type ||
				"groupchat" == notif.type ||
				"chatmessage" == notif.type ||
				"tablechat" == notif.type ||
				"privatechat" == notif.type ||
				"startWriting" == notif.type ||
				"stopWriting" == notif.type ||
				"newRTCMode" == notif.type ||
				"undefined" == typeof gameui
				? {
						type: "table",
						id: o,
						game_name: a,
						label: s,
						url: `/table?table=${o}`,
						channel: i,
						window_id: `table_${o}`,
						subscription: true,
						start: "collapsed",
					}
				: {
						type: "tablelog",
						id: o,
						game_name: a,
						label: __("lang_mainsite", "Game log"),
						url: "#",
						channel: i,
						window_id: `tablelog_${o}`,
						subscription: true,
						notifymethod: "title",
						start: "collapsed",
					};
		}
		if ("/group/g" == i.substr(0, 8)) {
			var r = i.substr(8) as BGA.ID;
			return {
				type: "group",
				id: r,
				group_avatar: notif.args.group_avatar,
				group_type: notif.args.group_type,
				label:
					undefined === notif.args.group_name
						? ""
						: notif.args.group_name,
				url:
					undefined === notif.args.seemore
						? ""
						: "/" + notif.args.seemore,
				channel: `/group/g${r}`,
				window_id: `group_${r}`,
				start: "collapsed",
			};
		}
		if ("/chat/general" == i.substr(0, 13))
			return {
				type: "general",
				id: 0 as any,
				label: __("lang_mainsite", "General messages"),
				url: null,
				channel: "/chat/general",
				window_id: "general",
				start: "collapsed",
			};
		if ("/player/p" == i.substr(0, 9)) {
			if (
				"privatechat" == notif.type ||
				"startWriting" == notif.type ||
				"stopWriting" == notif.type ||
				"newRTCMode" == notif.type
			) {
				let l: BGA.ID, d: string, c: string;
				if ("undefined" != typeof current_player_id)
					if (current_player_id == notif.args.player_id)
						(l = notif.args.target_id),
							d = notif.args.target_name,
							c = notif.args.target_avatar;
					else
						(l = notif.args.player_id),
							(d = notif.args.player_name),
							(c = notif.args.avatar);
				else if (this.player_id)
					if (this.player_id == notif.args.player_id)
						(l = notif.args.target_id),
							(d = notif.args.target_name),
							(c = notif.args.target_avatar);
					else
						(l = notif.args.player_id),
							(d = notif.args.player_name),
							(c = notif.args.avatar);
				else
					(l = notif.args.player_id),
						(d = notif.args.player_name),
						(c = notif.args.avatar);
				return {
					type: "privatechat",
					id: l,
					label: d,
					avatar: c,
					url: `/player?id=${l}`,
					channel: `/player/p${l}`,
					window_id: `privatechat_${l}`,
					subscription: false,
					start: "collapsed",
				};
			}
			if (
				undefined !== notif.gamenameorig &&
				"undefined" != typeof gameui
			) {
				return {
					type: "tablelog",
					id: (o = gameui.table_id!),
					label: __("lang_mainsite", "Game log"),
					url: "#",
					channel: `/table/t${o}`,
					window_id: `tablelog_${o}`,
					subscription: true,
					notifymethod: "title",
					start: "collapsed",
				};
			}
		} else if ("/general/emergency" == i.substr(0, 18))
			return {
				type: "emergency",
				id: 0,
				label: __("lang_mainsite", "Important notice"),
				url: null,
				channel: "/general/emergency",
				window_id: "emergency",
				start: n ? "collapsed" : "expanded",
			};
		return "startWriting" == notif.type ||
			"stopWriting" == notif.type
			? null
			: {
					type: "general",
					id: 0,
					label: __(
						"lang_mainsite",
						"General messages"
					),
					url: null,
					channel: "/chat/general",
					window_id: "general",
					start: "collapsed",
				};
	}

	/** Internal. Returns a {@link ChatNotifArgs} with extra information about creating a chat message window. */
	getChatInputArgs(channel: BGA.ChannelInfos): BGA.ChatInputArgs | null {
		if ("table" == channel.type) {
			var t = "";
			undefined !== channel.game_name &&
				(t =
					'<img src="' +
					getMediaUrl(channel.game_name, "icon") +
					'" alt="" class="game_icon emblem" />');
			var dobuleAction: BGA.ChatInputArgs["doubleaction"] = "";
			"undefined" != typeof gameui &&
				undefined !== gameui.debug_from_chat &&
				gameui.debug_from_chat &&
				undefined !== channel.game_name &&
				(dobuleAction = `/${channel.game_name}/${channel.game_name}/say.html`);
			"undefined" != typeof gameui &&
				undefined !== gameui.chat_on_gs_side &&
				gameui.chat_on_gs_side &&
				undefined !== channel.game_name &&
				(dobuleAction = `/${channel.game_name}/${channel.game_name}/say.html`);
			return {
				type: "table",
				id: channel.id,
				action: "/table/table/say.html",
				doubleaction: dobuleAction,
				label: __(
					"lang_mainsite",
					"Discuss at this table"
				),
				param: { table: channel.id },
				channel: `/table/t${channel.id}`,
				avatar: t,
			};
		}
		if ("tablelog" == channel.type) return null;
		if ("general" == channel.type)
			return {
				type: "global",
				id: 0,
				action: "/chat/chat/say.html",
				label: __(
					"lang_mainsite",
					"Discuss with everyone"
				),
				param: {},
				channel: null,
				avatar: '<i class="fa fa-comments" aria-hidden="true"></i>',
			};
		if ("privatechat" == channel.type)
			return {
				type: "player",
				id: channel.id,
				action: "/table/table/say_private.html",
				label:
					__("lang_mainsite", "Discuss with") +
					" " +
					channel.label,
				param: { to: channel.id },
				channel: `/player/p${channel.id}`,
				avatar:
					'<img src="' +
					getPlayerAvatar(channel.id, channel.avatar, 50) +
					'" alt="" class="emblem" />',
			};
		if ("emergency" == channel.type) return null;
		if ("group" == channel.type) {
			Math.floor((channel.id as number) / 1e3);
			var n = channel.avatar_src
				? channel.avatar_src
				: getGroupAvatar(
						channel.id,
						channel.group_avatar,
						channel.group_type,
						50
					);
			return {
				type: "group",
				id: channel.id,
				action: "/group/group/say.html",
				label: __(
					"lang_mainsite",
					"Discuss with the group"
				),
				param: { to: channel.id },
				channel: `/group/g${channel.id}`,
				avatar:
					'<img src="' +
					n +
					'" alt="" class="emblem" />',
			};
		}
		return null;
	}

	/** Internal. Passed to the {@link notifqueue}'s {@link GameNotif.onPlaceLogOnChannel}, used for logging messages onto a channel (chat window + extra). */
	onPlaceLogOnChannel(chatnotif: BGA.ChatNotif): boolean {
		if (!this.dockedChatInitialized)
			return false;

		let channelInfos: BGA.ChannelInfos;
		{
			let _channelInfos = this.extractChannelInfosFromNotif(chatnotif);
			if (null === _channelInfos)
				return true;
			channelInfos = _channelInfos;
		}

		var n = channelInfos.window_id,
			o = dojo.hasClass("ebd-body", "mobile_version"),
			a = true;
		if (
			"playerQuitGame" == chatnotif.args.reload_reason &&
			// @ts-ignore - undefines will just return false
			!(this.current_player_id in chatnotif.args.players) &&
			chatnotif.args.was_expected
		) {
			this.closeChatWindow(n);
			return true;
		}
		if (null !== this.notifqueue.game)
			if (
				"playtable" == channelInfos.type ||
				"table" == channelInfos.type ||
				"tablelog" == channelInfos.type
			) {}
			else if (
				"privatechat" != chatnotif.type &&
				"newRTCMode" != chatnotif.type &&
				"startWriting" != chatnotif.type &&
				"emergency" != channelInfos.type
			)
				return false;
		var s = null !== this.notifqueue.game,
			r =
				"chat" == chatnotif.type ||
				"groupchat" == chatnotif.type ||
				"chatmessage" == chatnotif.type ||
				"tablechat" == chatnotif.type ||
				"privatechat" == chatnotif.type ||
				"stopWriting" == chatnotif.type ||
				"startWriting" == chatnotif.type,
			l = false,
			d = false;
		if (
			r &&
			undefined !== chatnotif.args.text &&
			null === chatnotif.args.text
		) {
			chatnotif.log =
				"~ " +
				__(
					"lang_mainsite",
					"${player_name} left the chat"
				) +
				" ~";
			l = true;
			d = true;
		}
		var c = true;
		if (
			"history_history" == chatnotif.type ||
			undefined !== chatnotif.loadprevious
		) {
			c = false;
			if (
				undefined !== chatnotif.loadprevious &&
				chatnotif.loadprevious &&
				r &&
				undefined !== chatnotif.args.is_new &&
				1 == chatnotif.args.is_new
			) {
				c = true;
				chatnotif.args.mread = null;
			}
		}
		undefined !== chatnotif.donotpreview && (c = false);
		"chat" == chatnotif.type &&
			"/chat/general" == chatnotif.channelorig &&
			"undefined" != typeof mainsite &&
			0 == mainsite.notifyOnGeneralChat &&
			(c = false);
		s && (r || (a = false));
		if (
			r &&
			"chatmessage" == chatnotif.type &&
			undefined !== chatnotif.args.message &&
			undefined !== chatnotif.gamenameorig &&
			undefined === (chatnotif.args.message as any).log &&
			"werewolves" == chatnotif.gamenameorig &&
			-1 != (chatnotif.args.message as string).indexOf("$$$")
		)
			return true;
		if (undefined !== this.chatbarWindows[n]) {
			if ("startWriting" == chatnotif.type) {
				undefined !==
					this.chatbarWindows[n]!.is_writing_now[
						chatnotif.args.player_name
					] &&
					clearTimeout(
						this.chatbarWindows[n]!.is_writing_now[
							chatnotif.args.player_name
						]
					);
				this.chatbarWindows[n]!.is_writing_now[
					chatnotif.args.player_name
				] = setTimeout(
					dojo.hitch(this, function () {
						if (undefined !== this.chatbarWindows[n]) {
							delete this.chatbarWindows[n]!
								.is_writing_now[
								chatnotif.args.player_name
							];
							this.onUpdateIsWritingStatus(n);
						}
					}),
					8e3
				);
				this.onUpdateIsWritingStatus(n);
				return true;
			}
			if (r && undefined !== chatnotif.args.player_id) {
				this.chatbarWindows[n]!.is_writing_now[
					chatnotif.args.player_name
				];
				clearTimeout(
					this.chatbarWindows[n]!.is_writing_now[
						chatnotif.args.player_name
					]
				);
				delete this.chatbarWindows[n]!.is_writing_now[
					chatnotif.args.player_name
				];
				this.onUpdateIsWritingStatus(n);
			}
		} else if (
			"startWriting" == chatnotif.type ||
			"stopWriting" == chatnotif.type
		)
			return true;
		var h = this.next_log_id;
		this.next_log_id++;
		var u = false;
		undefined !== channelInfos.subscription &&
			channelInfos.subscription &&
			channelInfos.subscription &&
			(u = true);
		if (undefined === this.chatbarWindows[channelInfos.window_id] && l)
			return true;
		var p = this.createChatBarWindow(channelInfos, u);
		if (
			"newRTCMode" == chatnotif.type &&
			undefined !== chatnotif.args.table_id
		)
			if (
				chatnotif.args.rtc_mode > 0 &&
				null !== this.room &&
				this.room.indexOf("P") >= 0
			) {
				var m = '<div  class="rtc_dialog"><br />';
				m +=
					'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
					(false !== this.mediaConstraints.video
						? __(
								"lang_mainsite",
								"A Premium user has set up a video chat session for this table!"
							)
						: __(
								"lang_mainsite",
								"A Premium user has set up an audio chat session for this table!"
							)) +
					"</i></div><br /><br />";
				m +=
					'<div style="text-align: center; font-weight: bold;">' +
					__(
						"lang_mainsite",
						"But you are already taking part in another live chat session!"
					) +
					"<br /><br /> " +
					__(
						"lang_mainsite",
						"Do you want to join the call?"
					) +
					" (" +
					__(
						"lang_mainsite",
						"you will be disconnected from your current live chat session to join the new one"
					) +
					")</div><br /><br />";
				m += "</div>";
				this.confirmationDialog(
					m,
					dojo.hitch(this, function () {
						var i = this.room!.substr(1).split("_") as [BGA.ID, BGA.ID],
							n = i[0] == M ? i[1] : i[0];
						this.mediaConstraints.video
							? this.ajaxcall(
									"/table/table/startStopVideo.html",
									{
										target_table: null,
										target_player: n,
									},
									this,
									dojo.hitch(this, function (e) {
										this.already_accepted_room = `T${chatnotif.args.table_id}`;
										this.setNewRTCMode(
											chatnotif.args.table_id,
											null,
											chatnotif.args.rtc_mode,
											chatnotif.args.room_creator
										);
									})
								)
							: this.mediaConstraints.audio &&
								this.ajaxcall(
									"/table/table/startStopAudio.html",
									{
										target_table: null,
										target_player: n,
									},
									this,
									dojo.hitch(this, function (e) {
										this.already_accepted_room = `T${chatnotif.args.table_id}`;
										this.setNewRTCMode(
											chatnotif.args.table_id,
											null,
											chatnotif.args.rtc_mode,
											chatnotif.args.room_creator
										);
									})
								);
					}),
					dojo.hitch(this, function () {})
				);
			} else
				(null === this.room ||
					this.room.indexOf("T") >= 0) &&
					this.setNewRTCMode(
						chatnotif.args.table_id,
						null,
						chatnotif.args.rtc_mode,
						chatnotif.args.room_creator
					);
		if (
			"newRTCMode" == chatnotif.type &&
			undefined !== chatnotif.args.player_id
		)
			if (
				chatnotif.args.rtc_mode > 0 &&
				null !== this.room &&
				this.room.indexOf("T") >= 0
			) {
				m = '<div  class="rtc_dialog"><br />';
				m +=
					'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
					(false !== this.mediaConstraints.video
						? __(
								"lang_mainsite",
								"A Premium user has set up a video chat session with you!"
							)
						: __(
								"lang_mainsite",
								"A Premium user has set up an audio chat session with you!"
							)) +
					"</i></div><br /><br />";
				m +=
					'<div style="text-align: center; font-weight: bold;">' +
					__(
						"lang_mainsite",
						"But you are already taking part in another live chat session!"
					) +
					"<br /><br /> " +
					__(
						"lang_mainsite",
						"Do you want to join the call?"
					) +
					" (" +
					__(
						"lang_mainsite",
						"you will be disconnected from your current live chat session to join the new one"
					) +
					")</div><br /><br />";
				m += "</div>";
				this.confirmationDialog(
					m,
					dojo.hitch(this, function () {
						this.room!.substr(1);
						this.doLeaveRoom(
							dojo.hitch(this, function () {
								this.already_accepted_room = `P${Math.min(
										chatnotif.args.player_id as number,
										chatnotif.args.target_id as number
									)}_${Math.max(
										chatnotif.args.player_id as number,
										chatnotif.args.target_id as number
									)}`;
								this.expandChatWindow(
									channelInfos.window_id
								);
								this.setNewRTCMode(
									null,
									chatnotif.args.target_id,
									chatnotif.args.rtc_mode,
									chatnotif.args.room_creator
								);
							})
						);
					}),
					dojo.hitch(this, function () {
						this.mediaConstraints.video
							? this.ajaxcall(
									"/table/table/startStopVideo.html",
									{
										target_table: null,
										target_player:
											chatnotif.args.target_id,
									},
									this,
									function (e) {
										this.mediaChatRating =
											false;
									}
								)
							: this.mediaConstraints.audio &&
								this.ajaxcall(
									"/table/table/startStopAudio.html",
									{
										target_table: null,
										target_player:
											chatnotif.args.target_id,
									},
									this,
									function (e) {
										this.mediaChatRating =
											false;
									}
								);
					})
				);
			} else if (
				null === this.room ||
				this.room.indexOf("P") >= 0
			) {
				this.expandChatWindow(channelInfos.window_id);
				this.setNewRTCMode(
					null,
					chatnotif.args.target_id,
					chatnotif.args.rtc_mode,
					chatnotif.args.room_creator
				);
			}
		if (
			p &&
			"groupchat" == chatnotif.type &&
			undefined !== chatnotif.args.gamesession &&
			(chatnotif.args.gamesessionadmin as any) != this.getCurrentPlayerId()
		) {
			var g = dojo.clone(chatnotif);
			g.log =
				'<p style="text-align:center"><a id="quit_playingsession_' +
				chatnotif.args.group_id +
				'" href="#" class="bgabutton bgabutton_gray">' +
				__(
					"lang_mainsite",
					"Quit this playing session"
				) +
				"</a></p>";
			g.donotpreview = true;
			this.onPlaceLogOnChannel(g);
			dojo.connect(
				$("quit_playingsession_" + chatnotif.args.group_id)!,
				"onclick",
				this,
				dojo.hitch(this, function (t) {
					dojo.stopEvent(t);
					var i = (t.currentTarget as Element).id.substr(20) as BGA.ID;
					this.ajaxcall(
						"/community/community/quitGroup.html",
						{ id: i },
						this,
						function () {},
						function (e) {}
					);
					this.closeChatWindow(`group_${i}`);
				})
			);
		}
		var logAction = chatnotif.args.logaction;
		if (
			r &&
			undefined !== chatnotif.args.text &&
			// @ts-ignore - this is a key check.
			undefined !== this.predefinedTextMessages_untranslated[chatnotif.args.text]
		) {
			chatnotif.args.text = __("lang_mainsite", chatnotif.args.text);
			d = true;
		}
		if (r) {
			var _ = false;
			"/chat/general" == chatnotif.channelorig && (_ = true);
			r && undefined !== chatnotif.args.text && null != chatnotif.args.text
				? (chatnotif.args.text = this.makeClickableLinks(
						chatnotif.args.text,
						_
					))
				: r &&
					undefined !== chatnotif.args.message &&
					undefined === (chatnotif.args.message as any).log &&
					(chatnotif.args.message = this.makeClickableLinks(
						chatnotif.args.message,
						_
					));
		}
		m = this.notifqueue.formatLog(chatnotif.log, chatnotif.args);
		var v = "",
			b = "";
		if (null == this.notifqueue.game) {
			if (logAction) {
				var y = this.notifqueue.formatLog(
					logAction.log,
					logAction.args
				);
				v =
					'<div class="logaction"><a href="#" id="logaction_' +
					h +
					'">[' +
					y +
					"]</a></div>";
				b =
					'<div class="logaction"><a href="#" id="logactionp_' +
					h +
					'">[' +
					y +
					"]</a></div>";
			}
		} else
			r ||
				(m =
					this.notifqueue.game.applyGenderRegexps(m));
		r &&
			undefined !== chatnotif.args.text &&
			this.isBadWorkInChat(chatnotif.args.text!) &&
			(v +=
				'<div  class="logaction">' +
				__(
					"lang_mainsite",
					"Insult? Aggressive attitude? Please do not respond or you will be moderated too."
				) +
				" " +
				__(
					"lang_mainsite",
					"Block this player (thumb down) and report him/her to moderators."
				) +
				"</div>");
		var w,
			C = "",
			k = this.chatbarWindows[n]!.lastMsgTime,
			x = chatnotif.time,
			T = new Date(1e3 * x);
		w = T.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
		var A = new Date(1e3 * k),
			j = x - k;
		if (Math.floor(k / 60) != Math.floor(x / 60)) {
			if (
				A.toLocaleDateString() != T.toLocaleDateString()
			) {
				C +=
					'<div class="timestamp">' +
					T.toLocaleDateString() +
					"</div>";
			}
			this.chatbarWindows[n]!.lastMsgTime = x;
		}
		var S = "",
			E = false,
			N = "";
		if (r) {
			S += " chatlog";
			var M =
				undefined !== this.current_player_id
					? this.current_player_id
					: this.player_id;
			if (
				undefined !== chatnotif.args.player_id &&
				chatnotif.args.player_id == M
			) {
				S += " ownchatlog";
				E = true;
			}
			if (
				undefined !==
					this.chatbarWindows[n]!.lastMsgAuthor &&
				this.chatbarWindows[n]!.lastMsgAuthor ==
					chatnotif.args.player_id &&
				j < 60
			) {
				true;
				S += " sameauthor";
			}
			this.chatbarWindows[n]!.lastMsgAuthor =
				chatnotif.args.player_id;
			if (undefined !== chatnotif.args.mread && !E)
				if (chatnotif.args.mread) {}
				else {
					S += " newmessage";
					undefined !== chatnotif.args.id &&
						(N =
							' id="newmessage_' +
							n.substr(0, 1) +
							"_" +
							chatnotif.args.id +
							'"');
				}
			l
				? (S += " leavechat")
				: d && (S += " predefinedchat");
		}
		C +=
			'<div class="roundedbox log bga-link-inside' +
			S +
			'" id="dockedlog_' +
			h +
			'"><div class="roundedboxinner"' +
			N +
			">";
		r &&
			(m = this.addSmileyToText(m).replace(
				/(?:\r\n|\r|\n)/g,
				"<br>"
			));
		var D = m;
		if ("" != w) {
			var I =
					"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
				L = "";
			if (
				"privatechat" == chatnotif.type &&
				undefined !== chatnotif.args.mread &&
				E
			)
				if (chatnotif.args.mread) {
					L =
						'<i class="fa fa-check message_read" aria-hidden="true"></i>';
					I += "&nbsp;&nbsp;";
				} else {
					L =
						'<i class="fa fa-check message_unread" id="privmsg_read_' +
						chatnotif.args.id +
						'" aria-hidden="true"></i>';
					I += "&nbsp;&nbsp;";
				}
			r || (I += "&nbsp;&nbsp;");
			m +=
				I +
				'<div class="msgtime">' +
				w +
				" " +
				L +
				"</div>";
		}
		C += m + v;
		!r ||
			E ||
			d ||
			(C +=
				'<div class="translate_icon " id="logtr_' +
				n +
				"_" +
				h +
				'" title="' +
				__("lang_mainsite", "Translate with Google") +
				'"></div>');
		r &&
			d &&
			!l &&
			(C +=
				'<div class="predefinedchat_icon " title="' +
				__(
					"lang_mainsite",
					"Predefined message translated in each player's language"
				) +
				'"></div>');
		C += "</div></div>";
		var windowZoneHeight: number = dojo.style("chatwindowlogs_zone_" + n, "height") as any,
			R =
			($("chatwindowlogs_zone_" + n)!.scrollTop + windowZoneHeight) >=
			$("chatwindowlogs_zone_" + n)!.scrollHeight - 10;
		undefined !== chatnotif.loadprevious &&
		$("load_previous_message_wrap_" + n)
			? dojo.place(
					C,
					"load_previous_message_wrap_" + n,
					"before"
				)
			: dojo.place(
					C,
					"chatwindowlogs_endzone_" + n,
					"before"
				);
		this.addTooltipToClass(
			"message_read",
			__("lang_mainsite", "This message has been read"),
			""
		);
		this.addTooltipToClass(
			"message_unread",
			__(
				"lang_mainsite",
				"This message has not been read yet"
			),
			""
		);
		null == this.notifqueue.game
			? logAction &&
				$("logaction_" + h) &&
				dojo.connect(
					$("logaction_" + h)!,
					"onclick",
					this,
					function (t) {
						dojo.stopEvent(t);
						logAction!.action_analytics &&
							analyticsPush(logAction!.action_analytics);
						mainsite.ajaxcall(
							logAction!.action,
							logAction!.action_arg,
							this,
							function () {}
						);
					}
				)
			: r &&
				undefined !== chatnotif.args.player_id &&
				$("ban_spectator_" + chatnotif.args.player_id) &&
				dojo.style(
					"ban_spectator_" + chatnotif.args.player_id,
					"display",
					"inline"
				);
		undefined === chatnotif.loadprevious &&
			(R
				? ($("chatwindowlogs_zone_" + n)!.scrollTop = $(
						"chatwindowlogs_zone_" + n
					)!.scrollHeight)
				: dojo.style(
						"chatwindowmorelogs_" + n,
						"display",
						"block"
					));
		r &&
			$("logtr_" + n + "_" + h) &&
			dojo.connect(
				$("logtr_" + n + "_" + h)!,
				"onclick",
				this.notifqueue,
				"onTranslateLog"
			);
		var O = "dockedlog_" + h;
		if (undefined === chatnotif.loadprevious) {
			dojo.style(O, "display", "none");
			dojo.fx
				.chain([
					dojo.fx.wipeIn({
						node: O,
						onAnimate(e) {
							R &&
								($(
									"chatwindowlogs_zone_" + n
								)!.scrollTop = $(
									"chatwindowlogs_zone_" + n
								)!.scrollHeight);
						},
						onEnd(e) {
							R &&
								($(
									"chatwindowlogs_zone_" + n
								)!.scrollTop = $(
									"chatwindowlogs_zone_" + n
								)!.scrollHeight);
						},
					}),
					dojo.animateProperty({
						node: O,
						delay: 5e3,
						properties: {
							color: { end: "#000000" },
							onEnd(t) {
								dojo.style(t, "display", "block");
							},
						},
					}),
				])
				.play();
		} else $(O) && dojo.style(O, "color", "#000000");
		if ("title" == this.chatbarWindows[n]!.notifymethod) {
			var B = D.split("\x3c!--"),
				H = "",
				F = true;
			for (var z in B) {
				var q = B[z]!;
				if ("PNS--\x3e" == q.substr(0, 6))
					H += F ? q : "\x3c!--" + q;
				else {
					F || (q = "\x3c!--" + q);
					H +=
						dojox.dtl.filter.htmlstrings.striptags(
							q
						);
				}
				F && (F = false);
			}
			$("chatwindowtitlenolink_" + n)!.innerHTML = H;
		}
		var W = this.chatbarWindows[n]!.status;
		if (c && ("collapsed" == W || "stacked" == W)) {
			if ("collapsed" == W) {
				if ("general" == n) {}
				else if (
					"normal" ==
						this.chatbarWindows[n]!.notifymethod ||
					(o && "tablechat" == chatnotif.type)
				) {
					dojo.addClass("chatwindow_" + n, "newmessage");
					var U = $(
						"chatwindownewmsgcount_" + n
					)!.innerHTML;
					if ("" == U) {
						$(
							"chatwindownewmsgcount_" + n
						)!.innerHTML = String(1);
						$(
							"chatMindownewmsgcount_" + n
						)!.innerHTML = String(1);
					} else if (toint(U) <= 8) {
						$(
							"chatwindownewmsgcount_" + n
						)!.innerHTML = String(toint(U) + 1);
						$(
							"chatMindownewmsgcount_" + n
						)!.innerHTML = String(toint(U) + 1);
					} else {
						$(
							"chatwindownewmsgcount_" + n
						)!.innerHTML = "9+";
						$(
							"chatMindownewmsgcount_" + n
						)!.innerHTML = "9+";
					}
				}
				if (!o) {
					dojo.place(
						'<div><div id="logprev_' +
							h +
							'" class="chatwindowpreviewmsg bga-link-inside">' +
							D +
							b +
							"</div></div>",
						"chatwindowpreview_" + n
					);
					var V = dojo.query(
						"#chatwindowpreview_" +
							n +
							" .chatwindowpreviewmsg"
					);
					if (V.length > 5) {
						var G = V.length;
						for (var z in V) {
							if (G <= 5) break;
							dojo.destroy(V[z]!);
							G--;
						}
					}
				}
			} else
				"stacked" == W &&
					(o ||
						dojo.place(
							'<div id="logprev_' +
								h +
								'" class="chatwindowpreviewmsg bga-link-inside">' +
								m +
								b +
								"</div>",
							"chatwindowpreview_stacked"
						));
			if (!o) {
				O = "logprev_" + h;
				dojo.style(O, "display", "none");
				dojo.fx.wipeIn({ node: O }).play();
				this.fadeOutAndDestroy(O, 500, 5e3);
			}
			null == this.notifqueue.game &&
				logAction &&
				$("logactionp_" + h) &&
				dojo.connect(
					$("logactionp_" + h)!,
					"onclick",
					this,
					function (t) {
						dojo.stopEvent(t);
						logAction!.action_analytics &&
							analyticsPush(logAction!.action_analytics);
						mainsite.ajaxcall(
							logAction!.action,
							logAction!.action_arg,
							this,
							function () {}
						);
					}
				);
		}
		["privatechat", "tablechat", "groupchat"].includes(
			chatnotif.type
		) &&
			(undefined ===
			this.chatbarWindows[n]!.first_msg_timestamp
				? (this.chatbarWindows[n]!.first_msg_timestamp =
						toint(chatnotif.time)!)
				: (this.chatbarWindows[n]!.first_msg_timestamp =
						Math.min(
							chatnotif.time,
							this.chatbarWindows[n]!
								.first_msg_timestamp!
						)));
		if (l && "leavelast" == chatnotif.args.type) {
			$<HTMLInputElement>("chatbarinput_" + n + "_input")!.disabled = true;
			$<HTMLInputElement>("chatbarinput_" + n + "_input")!.placeholder = __(
				"lang_mainsite",
				"There is no one left in this chat"
			);
		}
		return a;
	}

	/** Internal. Updates the writing bubble status on the given chat window. */
	onUpdateIsWritingStatus(window_id: BGA.ChannelInfos['window_id']): void {
		var i = 0,
			n = "";
		for (var o in this.chatbarWindows[window_id]!.is_writing_now)
			if (o != (this as any).current_player_name) {
				"" == n ? (n = o) : (n += ", " + o);
				i++;
			}
		if (0 == i) {
			dojo.style(
				"chatwindowtitlenolink_" + window_id,
				"display",
				"inline"
			);
			dojo.style("is_writing_now_" + window_id, "display", "none");
			dojo.style(
				"chatwindowlogstitle_content_" + window_id,
				"display",
				"inline"
			);
			dojo.style(
				"is_writing_now_title_" + window_id,
				"display",
				"none"
			);
		} else {
			$("is_writing_now_expl_" + window_id)!.innerHTML =
				dojo.string.substitute(
					__(
						"lang_mainsite",
						"${player} is writing something ..."
					),
					{ player: n }
				);
			$("is_writing_now_expl_title_" + window_id)!.innerHTML =
				dojo.string.substitute(
					__(
						"lang_mainsite",
						"${player} is writing something ..."
					),
					{ player: n }
				);
			dojo.style(
				"chatwindowtitlenolink_" + window_id,
				"display",
				"none"
			);
			dojo.style("is_writing_now_" + window_id, "display", "inline");
			dojo.style(
				"chatwindowlogstitle_content_" + window_id,
				"display",
				"none"
			);
			dojo.style(
				"is_writing_now_title_" + window_id,
				"display",
				"inline"
			);
		}
	}

	/**
	 * Internal. If the {@link dockedChatInitialized} is false or the window matching the channel infos exists, this will return false. Otherwise, the DOM element matching the channel infos will be created.
	 * @param channel The channel information to create the chat bar window for.
	 * @param subscribe Overrides the {@link ChannelInfos.subscribe} value.
	 * @returns True if the chat bar window was created, false otherwise.
	 */
	createChatBarWindow(channel: BGA.ChannelInfos, subscribe?: boolean): boolean {
		if (!this.dockedChatInitialized) return false;
		var n = dojo.hasClass("ebd-body", "mobile_version"),
			o = channel.window_id,
			a = channel.label;
		if (undefined !== this.chatbarWindows[o]) {
			if ("collapsed" == this.chatbarWindows[o]!.status)
				return false;
			if ("expanded" == this.chatbarWindows[o]!.status)
				return false;
			if ("stacked" == this.chatbarWindows[o]!.status)
				return false;
		}
		this.stackChatWindowsIfNeeded(channel.start);
		null !== channel.url &&
			(a =
				'<a href="' +
				channel.url +
				'" class="chatwindowtitlelink no-underline" id="chatwindowtitlelink_' +
				o +
				'"">' +
				a +
				"</a>");
		var s: BGA.ChatWindowMetadata['notifymethod'] = "normal";
		undefined !== channel.notifymethod && (s = channel.notifymethod);
		var r = false;
		undefined !== channel.autoShowOnKeyPress &&
			(r = channel.autoShowOnKeyPress);
		this.chatbarWindows[o] = {
			status: channel.start,
			title: a,
			input: new ebg.chatinput(),
			subscription: null,
			notifymethod: s,
			autoShowOnKeyPress: r,
			lastMsgTime: 0,
			lastMsgAuthor: 0,
			is_writing_now: {},
		};
		this.chatbarWindows[o]!.input.callbackBeforeChat =
			dojo.hitch(this, "onCallbackBeforeChat");
		this.chatbarWindows[o]!.input.callbackAfterChat =
			dojo.hitch(this, "onCallbackAfterChat");
		this.chatbarWindows[o]!.input.callbackAfterChatError =
			dojo.hitch(this, "callbackAfterChatError");
		this.adaptChatbarDock();
		var l = this.getChatInputArgs(channel),
			d = o.split("_")[0]!,
			c = "";
		if (
			null == l ||
			undefined === l.avatar ||
			"" == l.avatar
		) {
			c =
				'<i class="fa fa-comment" aria-hidden="true"></i>';
			null === l &&
				"tablelog" == channel.type &&
				(c =
					'<i class="fa fa-history" aria-hidden="true"></i>');
		} else c = l.avatar;
		"undefined" != typeof gameui &&
			"table" == channel.type &&
			channel.id == gameui.table_id &&
			(c =
				'<i class="fa fa-comment" aria-hidden="true"></i>');
		"emergency" == channel.type &&
			(c =
				'<img src="' +
				getStaticAssetUrl("img/logo/logo.png") +
				'" alt="" class="bga_logo emblem" />');
		var h = {
			id: o,
			title: a,
			type: d,
			titlenolink: channel.label,
			more_logs_label: __(
				"lang_mainsite",
				"Scroll down to see new messages"
			),
			stop_notif_label: __(
				"lang_mainsite",
				"Notify chat messages"
			),
			avatar: c,
			start_chat: __("lang_mainsite", "Accept chat"),
			block_chat: __("lang_mainsite", "Block player"),
		};
		dojo.place(
			this.format_string(this.jstpl_chatwindow, h),
			"chatbardock",
			"first"
		);
		dojo.addClass("chatwindow_" + o, channel.start);
		if ("expanded" == channel.start) {
			dojo.style(
				"chatwindowexpanded_" + o,
				"display",
				"block"
			);
			n ||
				dojo.style(
					"chatwindowcollapsed_" + o,
					"display",
					"none"
				);
			dojo.style(
				"chatwindowpreview_" + o,
				"display",
				"none"
			);
			n && this.makeSureChatBarIsOnTop(o);
		}
		if ($("chatbarinput_stopnotif_general")) {
			this.addTooltip(
				"chatbarinput_stopnotif_general",
				"",
				__(
					"lang_mainsite",
					"Uncheck this box if you don't want to be notified when there is a new message in the global chat."
				)
			);
			dojo.connect(
				$("chatbarinput_stopnotif_box_general")!,
				"onclick",
				this,
				"onChangeStopNotifGeneralBox"
			);
			dojo.connect(
				$("chatbarinput_stopnotif_label_general")!,
				"onclick",
				this,
				"onChangeStopNotifGeneralLabel"
			);
			if (
				"undefined" != typeof mainsite &&
				(0 == mainsite.notifyOnGeneralChat ||
					mainsite.bUnderage)
			) {
				bDisplayPreview = false;
				$<HTMLInputElement>(
					"chatbarinput_stopnotif_box_general"
				)!.checked = Boolean("");
			}
		}
		dojo.connect(
			$("startchat_accept_" + o)!,
			"onclick",
			this,
			"onStartChatAccept"
		);
		dojo.connect(
			$("startchat_block_" + o)!,
			"onclick",
			this,
			"onStartChatBlock"
		);
		if (null !== l) {
			this.chatbarWindows[o]!.input.create(
				this,
				"chatbarinput_" + o,
				l.action,
				l.label
			);
			this.chatbarWindows[o]!.input.writingNowChannel =
				l.channel;
			this.chatbarWindows[o]!.input.baseparams = l.param;
			undefined !== l.doubleaction &&
				"" != l.doubleaction &&
				(this.chatbarWindows[o]!.input.post_url_bis =
					l.doubleaction);
			dojo.connect(
				$("chatbarinput_predefined_" + o)!,
				"onclick",
				this,
				"onShowPredefined"
			);
		} else
			dojo.addClass(
				"chatwindowlogs_zone_" + o,
				"chatwindowlogs_zone_big"
			);
		if (["privatechat", "table", "group"].includes(d)) {
			var u =
				'<div id="load_previous_message_wrap_' +
				o +
				'" class="load_previous_message">                                <a class="bga-link" href="#" id="load_previous_message_' +
				o +
				'">' +
				__("lang_mainsite", "Load previous messages") +
				"</a>                            </div>";
			dojo.place(u, "chatwindowlogs_endzone_" + o, "before");
			dojo.connect(
				$("load_previous_message_" + o)!,
				"onclick",
				this,
				"onLoadPreviousMessages"
			);
		}
		dojo.connect(
			$("chatwindowremove_" + o)!,
			"onclick",
			this,
			"onCloseChatWindow"
		);
		dojo.connect(
			$("chatwindowcollapse_" + o)!,
			"onclick",
			this,
			"onCollapseChatWindow"
		);
		dojo.connect(
			$("chatwindowlogstitlebar_" + o)!,
			"onclick",
			this,
			"onCollapseChatWindow"
		);
		dojo.connect(
			$("chatwindowcollapsed_" + o)!,
			"onclick",
			this,
			"onExpandChatWindow"
		);
		dojo.connect(
			$("chatwindowremovc_" + o)!,
			"onclick",
			this,
			"onCloseChatWindow"
		);
		dojo.connect(
			$("chatwindowmorelogslink_" + o)!,
			"onclick",
			this,
			"onScrollDown"
		);
		dojo.connect(
			$("chatbar_inner")!,
			"onclick",
			this,
			"onCollapseAllChatWindow"
		);
		dojo.connect(
			this.chatbarWindows[o]!.input,
			"onChatInputKeyUp",
			this,
			"onDockedChatInputKey"
		);
		dojo.connect(
			$("chatbarinput_" + o + "_input")!,
			"onclick",
			this,
			"onDockedChatFocus"
		);
		subscribe &&
			(this.chatbarWindows[o]!.subscription =
				this.subscribeCometdChannel(
					channel.channel,
					this.notifqueue,
					"onNotification"
				)!);
		if ("table" == d || "privatechat" == d) {
			if (
				("undefined" != typeof mainsite &&
					mainsite.pma) ||
				("undefined" != typeof gameui && gameui.pma)
			) {
				dojo.query<HTMLElement>(
					"#chatbarinput_startaudiochat_" + o
				).connect(
					"onclick",
					this,
					"onStartStopAudioChat"
				);
				this.addTooltip(
					"chatbarinput_startaudiochat_" + o,
					"",
					__("lang_mainsite", "Audio call")
				);
				dojo.query<HTMLElement>(
					"#chatbarinput_startvideochat_" + o
				).connect(
					"onclick",
					this,
					"onStartStopVideoChat"
				);
				this.addTooltip(
					"chatbarinput_startvideochat_" + o,
					"",
					__("lang_mainsite", "Video call")
				);
			} else {
				this.addTooltip(
					"chatbarinput_startaudiochat_" + o,
					this.premiumMsgAudioVideo!,
					""
				);
				dojo.query<HTMLElement>(
					"#chatbarinput_startaudiochat_" + o
				).connect("onclick", this, function (t) {
					dojo.stopEvent(t);
					this.showMessage(
						_(this.premiumMsgAudioVideo!),
						"info"
					);
				});
				this.addTooltip(
					"chatbarinput_startvideochat_" + o,
					this.premiumMsgAudioVideo!,
					""
				);
				dojo.query<HTMLElement>(
					"#chatbarinput_startvideochat_" + o
				).connect("onclick", this, function (t) {
					dojo.stopEvent(t);
					this.showMessage(
						_(this.premiumMsgAudioVideo!),
						"info"
					);
				});
			}
			this.mediaConstraints.video
				? dojo
						.query(
							"#chatbarinput_startvideochat_" + o
						)
						.removeClass("audiovideo_inactive")
						.addClass("audiovideo_active")
				: this.mediaConstraints.audio &&
					dojo
						.query(
							"#chatbarinput_startaudiochat_" + o
						)
						.removeClass("audiovideo_inactive")
						.addClass("audiovideo_active");
		}
		return true;
	}

	/** Internal. Button Event. Removes the 'startchat_toconfirm' class from the chat window corresponding to the id of the current target. */
	onStartChatAccept(event: Event): void {
		dojo.stopEvent(event);
		var i = (event.currentTarget as Element).id.substr(17);
		dojo.removeClass("chatwindow_" + i, "startchat_toconfirm");
	}

	/** Internal. Button Event. Blocks and closes the chat window corresponding to the id of the current target. */
	onStartChatBlock(event: Event): void {
		dojo.stopEvent(event);
		var i = (event.currentTarget as Element).id.substr(16) as BGA.ChannelInfos['window_id'],
			n = (event.currentTarget as Element).id.substr(28) as BGA.ID,
			o = new ebg.thumb();
		o.create(this, (event.currentTarget as Element).id, n, 0);
		o.bForceThumbDown = true;
		o.onGiveThumbDown(event);
		this.closeChatWindow(i);
	}

	/** Internal. Toggle Button Event. Updates preference for if the general notifications should be ignored (hidden + no notifications). */
	onChangeStopNotifGeneralBox(event: Event): void {
		var t: 0 | 1 = $<HTMLInputElement>("chatbarinput_stopnotif_box_general")!.checked
			? 1
			: 0;
		this.ajaxcall(
			"/player/profile/setNotificationPreference.html",
			{ type: "notifyGeneralChat", value: t },
			this,
			function () {
				this.showMessage(
					__("lang_mainsite", "Preference updated!"),
					"info"
				);
			}
		);
		"undefined" != typeof mainsite &&
			(mainsite.notifyOnGeneralChat = t);
	}

	/** Internal. Button Event. Toggles preference for if the general notifications should be ignored. Directly calls {@link onChangeStopNotifGeneralBox} after changing. */
	onChangeStopNotifGeneralLabel(event: Event): void {
		dojo.stopEvent(event);
		$<HTMLInputElement>("chatbarinput_stopnotif_box_general")!.checked
			? ($<HTMLInputElement>("chatbarinput_stopnotif_box_general")!.checked =
					Boolean(""))
			: ($<HTMLInputElement>("chatbarinput_stopnotif_box_general")!.checked =
					Boolean("checked"));
		this.onChangeStopNotifGeneralBox(event);
	}

	/** Internal. Checks if launching audio/video is currently on a cooldown (max 120s) due to entering and leaving a chat. This uses {@link sessionStorage} to store the state of this cooldown (timeToWaitNextAV, AVAttemptNumber, lastAVAttemptTimestamp). @see setAVFrequencyLimitation */
	checkAVFrequencyLimitation(): boolean {
		var e = sessionStorage.getItem("timeToWaitNextAV"),
			t = sessionStorage.getItem(
				"lastAVAttemptTimestamp"
			);
		if (!e || !t) return false;
		var i = Date.now(),
			n = Math.round((i - Number(t)) / 1e3);
		if (n >= 120) {
			sessionStorage.removeItem("timeToWaitNextAV");
			sessionStorage.removeItem("AVAttemptNumber");
			sessionStorage.removeItem("lastAVAttemptTimestamp");
			return false;
		}
		var o = Number(e) - n;
		if (o > 0) {
			this.showMessage(
				__(
					"lang_mainsite",
					"You need to wait %s seconds before launching an audio/video chat again."
				).replace("%s", String(o)),
				"info"
			);
			return true;
		}
		return false;
	}

	/** Internal. Increments the attempt account and resets the timeout based on attempts (10s per attempt, max 60s). This uses {@link sessionStorage} to store the state of this cooldown (timeToWaitNextAV, AVAttemptNumber, lastAVAttemptTimestamp). @see checkAVFrequencyLimitation */
	setAVFrequencyLimitation(): void {
		var e = Number(sessionStorage.getItem("AVAttemptNumber")
			? sessionStorage.getItem("AVAttemptNumber")
			: 0);
		e++;
		sessionStorage.setItem("AVAttemptNumber", String(e));
		var t = Date.now();
		sessionStorage.setItem("lastAVAttemptTimestamp", String(t));
		var i = Math.min(10 * e, 60);
		sessionStorage.setItem("timeToWaitNextAV", String(i));
	}

	/** Internal. Button Event. Toggles the audio chat feature, showing loading messages and making ajax calls. */
	onStartStopAudioChat(event: Event): void {
		dojo.stopEvent(event);
		if (
			null !== this.room ||
			!this.checkAVFrequencyLimitation()
		) {
			var i = (event.target as Element).id.split("_")[2];
			undefined === i &&
				(i = ((event.target as Node).parentNode as Element).id.split("_")[2]);
			if ("table" == i) {
				if (
					null !== this.room &&
					this.room.indexOf("T") < 0
				) {
					this.showMessage(
						__(
							"lang_mainsite",
							"You must end your other live chat sessions before starting a new one."
						),
						"error"
					);
					return;
				}
				var n: BGA.ID | undefined =
					"undefined" != typeof current_player_id
						? current_player_id
						: this.player_id!;
				if (
					"undefined" != typeof mainsite &&
					null === $("active_player_" + n)
				) {
					this.showMessage(
						__(
							"lang_mainsite",
							"You are not currently playing at this table (you haven't joined yet, you have quit or the game has ended)."
						),
						"error"
					);
					return;
				}
				var o = (event.target as Element).id.split("_")[3];
				undefined === o &&
					(o = ((event.target as Node).parentNode as Element).id.split("_")[3]);
				if (null === this.room) {
					var a = '<div  class="rtc_dialog"><br />';
					a +=
						'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
						__(
							"lang_mainsite",
							"You are launching an audio chat session for this table!"
						) +
						"</i></div>";
					a += "</div>";
					this.confirmationDialog(
						a,
						dojo.hitch(this, function () {
							this.ajaxcall(
								"/table/table/startStopAudio.html",
								{
									target_table: o as BGA.ID | undefined,
									target_player: null,
								},
								this,
								function (e) {}
							);
						}),
						dojo.hitch(this, function () {})
					);
				} else {
					this.setAVFrequencyLimitation();
					this.ajaxcall(
						"/table/table/startStopAudio.html",
						{
							target_table: o as BGA.ID | undefined,
							target_player: null,
						},
						this,
						function (e) {
							this.mediaChatRating &&
								g_sitecore.displayRatingContent(
									"audio",
									{
										room_id: e.room_id,
										media: "audio",
										rating: null,
										issue: null,
										text: null,
									}
								);
						}
					);
				}
			}
			if ("privatechat" == i) {
				if (
					null !== this.room &&
					this.room.indexOf("P") < 0
				) {
					this.showMessage(
						__(
							"lang_mainsite",
							"You must end your other live chat sessions before starting a new one."
						),
						"error"
					);
					return;
				}
				undefined === (n = (event.target as Element).id.split("_")[3] as BGA.ID) &&
					(n = ((event.target as Node).parentNode as Element).id.split("_")[3] as BGA.ID);
				if (null === this.room) {
					a = '<div  class="rtc_dialog"><br />';
					a +=
						'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
						__(
							"lang_mainsite",
							"You are launching an audio chat session with another player!"
						) +
						"</i></div>";
					a += "</div>";
					this.confirmationDialog(
						a,
						dojo.hitch(this, function () {
							this.ajaxcall(
								"/table/table/startStopAudio.html",
								{
									target_table: null,
									target_player: n as BGA.ID | undefined,
								},
								this,
								function (e) {}
							);
						}),
						dojo.hitch(this, function () {})
					);
				} else {
					this.setAVFrequencyLimitation();
					this.ajaxcall(
						"/table/table/startStopAudio.html",
						{
							target_table: null,
							target_player: n as BGA.ID | undefined,
						},
						this,
						function (e) {
							this.mediaChatRating &&
								g_sitecore.displayRatingContent(
									"audio",
									{
										room_id: e.room_id,
										media: "audio",
										rating: null,
										issue: null,
										text: null,
									}
								);
						}
					);
				}
			}
		}
	}

	/** Internal. Button Event. Toggles the video chat feature, showing loading messages and making ajax calls. */
	onStartStopVideoChat(event: Event): void {
		dojo.stopEvent(event);
		var i = (event.target as Element).id.split("_")[2];
		undefined === i &&
			(i = ((event.target as Node).parentNode as Element).id.split("_")[2]);
		if ("table" == i) {
			if (
				null !== this.room &&
				this.room.indexOf("T") < 0
			) {
				this.showMessage(
					__(
						"lang_mainsite",
						"You must end your other live chat sessions before starting a new one."
					),
					"error"
				);
				return;
			}
			var n: BGA.ID | undefined =
				"undefined" != typeof current_player_id
					? current_player_id
					: this.player_id!;
			if (
				"undefined" != typeof mainsite &&
				null === $("active_player_" + n)
			) {
				this.showMessage(
					__(
						"lang_mainsite",
						"You are not currently playing at this table (you haven't joined yet, you have quit or the game has ended)."
					),
					"error"
				);
				return;
			}
			var o = (event.target as Element).id.split("_")[3];
			undefined === o &&
				(o = ((event.target as Node).parentNode as Element).id.split("_")[3]);
			var a = '<div  class="rtc_dialog"><br />';
			a +=
				'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
				__(
					"lang_mainsite",
					"You are launching a video chat session for this table!"
				) +
				"</i></div>";
			a += "</div>";
			null === this.room
				? this.confirmationDialog(
						a,
						dojo.hitch(this, function () {
							this.ajaxcall(
								"/table/table/startStopVideo.html",
								{
									target_table: o as BGA.ID | undefined,
									target_player: null,
								},
								this,
								function (e) {}
							);
						}),
						dojo.hitch(this, function () {})
					)
				: this.ajaxcall(
						"/table/table/startStopVideo.html",
						{
							target_table: o as BGA.ID | undefined,
							target_player: null,
						},
						this,
						function (e) {
							this.mediaChatRating &&
								g_sitecore.displayRatingContent(
									"video",
									{
										room_id: e.room_id,
										media: "video",
										rating: null,
										issue: null,
										text: null,
									}
								);
						}
					);
		}
		if ("privatechat" == i) {
			if (
				null !== this.room &&
				this.room.indexOf("P") < 0
			) {
				this.showMessage(
					__(
						"lang_mainsite",
						"You must end your other live chat sessions before starting a new one."
					),
					"error"
				);
				return;
			}
			undefined === (n = (event.target as Element).id.split("_")[3] as BGA.ID) &&
				(n = ((event.target as Node).parentNode as Element).id.split("_")[3] as BGA.ID);
			a = '<div  class="rtc_dialog"><br />';
			a +=
				'<div style="text-align: center; border-bottom: 1px solid black; border-top: 1px solid black; padding: 5px 5px 5px 5px;"><i>' +
				__(
					"lang_mainsite",
					"You are launching a video chat session with another player!"
				) +
				"</i></div>";
			a += "</div>";
			null === this.room
				? this.confirmationDialog(
						a,
						dojo.hitch(this, function () {
							this.ajaxcall(
								"/table/table/startStopVideo.html",
								{
									target_table: null,
									target_player: n,
								},
								this,
								function (e) {}
							);
						}),
						dojo.hitch(this, function () {})
					)
				: this.ajaxcall(
						"/table/table/startStopVideo.html",
						{
							target_table: null,
							target_player: n,
						},
						this,
						function (e) {
							this.mediaChatRating &&
								g_sitecore.displayRatingContent(
									"video",
									{
										room_id: e.room_id,
										media: "video",
										rating: null,
										issue: null,
										text: null,
									}
								);
						}
					);
		}
	}

	/**
	 * Internal. Sets the new rtc mode for the current client.
	 * @param table_id The table id to set the rtc mode for. If not null, this defines the room for the player and the DOM elements will be created if needed.
	 * @param target_player_id The player id to set the rtc mode for. . If not null, this defines the room for the player and the DOM elements will be created if needed. Only valid if the table_id is null.
	 * @param rtc_id The rtc id to set the mode to. If this is 0, the rtc will be disconnected and all other params are ignored.
	 * @param connecting_player_id The player id to connect to.
	 */
	setNewRTCMode(table_id: BGA.ID | null, target_player_id: BGA.ID | null, rtc_id: 0 | 1 | 2, connecting_player_id?: BGA.ID): void {
		if (null !== rtc_id) {
			this.rtc_mode = rtc_id;
			if (
				"undefined" != typeof bgaConfig &&
				bgaConfig.webrtcEnabled &&
				!this.isSpectator
			) {
				var a = String("undefined" != typeof current_player_id
						? current_player_id
						: this.player_id),
					s = false,
					r = 0 != rtc_id;
				if (this.mediaConstraints.audio != r) {
					this.mediaConstraints.audio = r;
					s = true;
				}
				var l = this.getRtcVideoConstraints(rtc_id);
				if (
					JSON.stringify(
						this.mediaConstraints.video
					) != JSON.stringify(l)
				) {
					this.mediaConstraints.video = l;
					s = true;
				}
				if (s && null !== this.webrtc) {
					this.clearRTC();
					this.room = null;
				}
				if (
					null === this.room &&
					(this.mediaConstraints.audio ||
						this.mediaConstraints.video)
				) {
					if (null !== table_id) {
						this.room = `T${table_id}`;
						if (
							"undefined" != typeof gameui &&
							null == $("rtc_container_" + a)
						) {
							dojo.place(
								this.format_string(
									this.getRTCTemplate(
										this.mediaConstraints
											.audio,
										this.mediaConstraints
											.video,
										false
									),
									{
										player_id: a,
										muted: "muted",
									}
								),
								$("rtc_placeholder_" + a)!
							);
							this.setupRTCEvents(a);
						}
						if (
							"undefined" != typeof mainsite &&
							null != $("active_player_" + a) &&
							null != $("emblem_" + a) &&
							null == $("rtc_container_" + a)
						) {
							dojo.place(
								this.format_string(
									this.getRTCTemplate(
										this.mediaConstraints
											.audio,
										this.mediaConstraints
											.video,
										false
									),
									{
										player_id: a,
										muted: "muted",
									}
								),
								$("table_rtc_placeholder")!
							);
							this.placeOnObject(
								$("rtc_container_" + a)!,
								$("emblem_" + a)!
							);
							this.setupRTCEvents(a);
						}
					} else if (null !== target_player_id) {
						this.room = `P${Math.min(Number(a), Number(target_player_id))}_${Math.max(Number(target_player_id), Number(a))}`;
						if (
							null !==
								$(
									"chatwindowlogs_privatechat_" +
										target_player_id
								) &&
							null == $("rtc_container_" + a)
						) {
							dojo.place(
								this.format_string(
									this.getRTCTemplate(
										this.mediaConstraints
											.audio,
										this.mediaConstraints
											.video,
										false
									),
									{
										player_id: a,
										muted: "muted",
									}
								),
								$(
									"chatwindowlogs_privatechat_" +
										target_player_id
								)!
							);
							if (this.mediaConstraints.video) {
								dojo.style(
									$("rtc_container_" + a)!,
									"top",
									"-6px"
								);
								dojo.style(
									$("rtc_container_" + a)!,
									"left",
									"115px"
								);
								dojo.style(
									$("rtc_container_" + a)!,
									"zIndex",
									"496"
								);
							} else if (
								this.mediaConstraints.audio
							) {
								dojo.style(
									$("rtc_container_" + a)!,
									"top",
									"-13px"
								);
								dojo.style(
									$("rtc_container_" + a)!,
									"left",
									"135px"
								);
							}
							this.setupRTCEvents(a);
						}
					}
					connecting_player_id == a &&
						(this.already_accepted_room =
							this.room);
					var d =
						null !== table_id
							? "table_" + table_id
							: "privatechat_" + target_player_id;
					if (this.mediaConstraints.video) {
						dojo.query(
							"#chatbarinput_startvideochat_" + d
						)
							.removeClass("audiovideo_inactive")
							.addClass("audiovideo_active");
						dojo.query(
							"#playersaroundtable_startvideochat_" +
								d
						)
							.removeClass("audiovideo_inactive")
							.addClass("audiovideo_active");
					} else if (this.mediaConstraints.audio) {
						dojo.query(
							"#chatbarinput_startaudiochat_" + d
						)
							.removeClass("audiovideo_inactive")
							.addClass("audiovideo_active");
						dojo.query(
							"#playersaroundtable_startaudiochat_" +
								d
						)
							.removeClass("audiovideo_inactive")
							.addClass("audiovideo_active");
					}
					this.startRTC();
				}
			}
		}
	}

	/** Internal. Button Event. Calls {@link loadPreviousMessage} based on the current target's id. */
	onLoadPreviousMessages(event: Event) {
		dojo.stopEvent(event);
		var i = (event.currentTarget as Element).id.substr(22),
			n = i.split("_")[0] as BGA.ChannelInfos["type"],
			o = i.split("_")[1] as BGA.ID;
		this.loadPreviousMessage(n, o);
	}

	/** Internal. Gets the chatHistory for a table based on the arguments. The {@link ajaxcall} will callback to {@link onLoadPreviousMessages} */
	loadPreviousMessage(type: BGA.ChannelInfos["type"], id: BGA.ID): void {
		var n: number | null = null;
		undefined !== this.chatbarWindows[`${type}_${id}`]!.first_msg_timestamp &&
			(n = this.chatbarWindows[`${type}_${id}`]!.first_msg_timestamp!);
		this.ajaxcall(
			"/table/table/chatHistory.html",
			{ type: type, id: id, before: n },
			this as SiteCore_Template,
			"loadPreviousMessageCallback",
			function (e) {},
			"get"
		);
	}
	loadPreviousMessageCallback(...[args]: BGA.AjaxCallbackArgsMap['/table/table/chatHistory.html']): void {
		let player_id = this.player_id!;
		var type = args.type,
			id = args.id;
		if (args.status) {
			if ("underage" == args.status) {
				this.showMessage(
					_(
						"Sorry, you are not authorized to discuss with this player"
					),
					"error"
				);
				this.closeChatWindow(`${type}_${id}`);
				return;
			}
			if ("admin" == args.status) {
				var a = __(
					"lang_mainsite",
					"Our ${contact_page} is the best way to get in touch with us :)"
				);
				a = a.replace(
					"${contact_page}",
					__("lang_mainsite", "Contact page")
				);
				this.showMessage(a, "error");
				this.closeChatWindow(`${type}_${id}`);
				gotourl("support");
				return;
			}
			args.status;
			"newchat" == args.status &&
				dojo.place(
					'<div class="whiteblock"><i class="fa fa-exclamation-triangle"></i> ' +
						_(
							"Unsollicited messages may lead to be blocked and affect your reputation."
						) +
						"</div>",
					"chatwindowlogs_endzone_" + type + "_" + id,
					"before"
				);
			"newchattoconfirm" == args.status &&
				dojo.addClass(
					"chatwindow_" + type + "_" + id,
					"startchat_toconfirm"
				);
		}
		this.chatbarWindows[`${type}_${id}`]!.lastMsgAuthor = null;
		var s = $(
				"chatwindowlogs_zone_" + type + "_" + id
			)!.scrollHeight,
			r = false;
		for (var l in args.history) {
			r = true;
			var d: BGA.ChatNotif;
			if ("privatechat" == type) {
				d = {
					channel: `/player/p${player_id}`,
					channelorig: `/player/p${player_id}`,
					args: args.history[l] as any,
					bIsTableMsg: false,
					lock_uuid: "dummy",
					log: "${player_name} ${text}",
					type: "privatechat",
					time: args.history[l]!.time!,
					mread: args.history[l]!.mread,
					loadprevious: true,
					uid: 0,
				};
				this.onPlaceLogOnChannel(d);
			} else if ("table" == type) {
				d = {
					channel: `/table/t${player_id}`,
					channelorig: `/table/t${player_id}`,
					args: args.history[l] as any,
					bIsTableMsg: true,
					lock_uuid: "dummy",
					log: "${player_name} ${text}",
					type: "tablechat",
					time: args.history[l]!.time!,
					loadprevious: true,
					uid: 0,
				};
				this.onPlaceLogOnChannel(d);
			} else if ("group" == type) {
				d = {
					channel: `/group/g${id}`,
					channelorig: `/group/g${id}`,
					args: args.history[l] as any,
					lock_uuid: "dummy",
					log: "${player_name} ${text}",
					type: "groupchat",
					time: args.history[l]!.time!,
					loadprevious: true,
					uid: 0,
				};
				this.onPlaceLogOnChannel(d);
			} else
				console.error(
					"unknow previous message type: " + type
				);
		}
		dojo.place(
			"load_previous_message_wrap_" + type + "_" + id,
			"chatwindowlogs_zone_" + type + "_" + id,
			"first"
		);
		r || dojo.destroy("load_previous_message_" + type + "_" + id);
		var c = $(
			"chatwindowlogs_zone_" + type + "_" + id
		)!.scrollHeight;
		c > s &&
			($(
				"chatwindowlogs_zone_" + type + "_" + id
			)!.scrollTop += toint(c - s));
	}

	/** Internal. Chat Window Helper. */
	stackOrUnstackIfNeeded(): void {
		var t = this.countStackedWindows(),
			i = dojo.hasClass("ebd-body", "mobile_version");
		if (t > 0) {
			if (
				this.getNeededChatbarWidth() + (i ? 80 : 300) <=
				dojo.position("chatbar").w! - 50
			)
				for (var n in this.chatbarWindows)
					if (
						"stacked" ==
						this.chatbarWindows[n as any]!.status
					) {
						this.unstackChatWindow(n as any, "automatic");
						return;
					}
		}
		this.stackChatWindowsIfNeeded();
		i &&
			dojo
				.query<Element>(
					"#chatbar .expanded .chatwindowlogs_zone"
				)
				.forEach(function (e) {
					setTimeout(function () {
						e.scrollTop = e.scrollHeight;
					}, 1);
				});
	}

	/** Internal. Chat Window Helper. */
	onUnstackChatWindow(event: Event): void {
		dojo.stopEvent(event);
		var i = (event.currentTarget as Element).id.substr(15) as BGA.ChannelInfos['window_id'];
		this.unstackChatWindow(i);
		dojo.style("stackedmenu", "display", "none");
	}

	/** Internal. Chat Window Helper. */
	unstackChatWindow(window_id: BGA.ChannelInfos['window_id'], state?: BGA.ChannelInfos['start'] | 'automatic'): void {
		undefined === state && (state = "normal");
		this.stackChatWindowsIfNeeded("expanded");
		this.expandChatWindow(window_id);
		"automatic" == state && this.collapseChatWindow(window_id);
		$("stackmenu_item_" + window_id) &&
			dojo.destroy("stackmenu_item_" + window_id);
	}

	/** Internal. Chat Window Helper. */
	stackChatWindowsIfNeeded(state?: BGA.ChannelInfos['start']): void {
		var i = dojo.hasClass("ebd-body", "mobile_version");
		if ("none" != dojo.style("chatbar", "display")) {
			"undefined" == typeof save_spaces_nbr &&
				(save_spaces_nbr = null);
			var n = dojo.position("chatbar").w! - 50,
				o = this.getNeededChatbarWidth();
			"collapsed" == state && (o += i ? 64 : 176);
			"expanded" == state && (o += i ? 64 : 220);
			if (o > n) {
				this.stackOneChatWindow();
				this.stackChatWindowsIfNeeded(state);
			}
		}
	}

	/** Internal. Chat Window Helper. */
	stackOneChatWindow(): void {
		var t = null;
		for (var i in this.chatbarWindows) {
			"collapsed" == this.chatbarWindows[i as any]!.status &&
				(t = i);
		}
		if (null === t)
			for (var i in this.chatbarWindows) {
				"expanded" == this.chatbarWindows[i as any]!.status &&
					(t = i);
			}
		null === t &&
			console.error(
				"Cannot find any chatwindow to stack!!!"
			);
		this.chatbarWindows[t as any]!.status = "stacked";
		dojo.removeClass("chatwindow_" + t, [
			"collapsed",
			"expanded",
			"stacked",
		]);
		dojo.addClass("chatwindow_" + t, "stacked");
		this.updateChatBarStatus();
		dojo.style("chatwindowexpanded_" + t, "display", "none");
		dojo.style("chatwindowcollapsed_" + t, "display", "none");
		dojo.style("chatwindowpreview_" + t, "display", "none");
		var n = $("chatwindowtitlenolink_" + t)!.innerHTML;
		dojo.place(
			'<div class="stackmenu_item" id="stackmenu_item_' +
				t +
				'">' +
				n +
				"</div>",
			"stackedmenu"
		);
		dojo.connect(
			$("stackmenu_item_" + t)!,
			"onclick",
			this,
			"onUnstackChatWindow"
		);
		this.adaptChatbarDock();
	}

	/** Internal. Chat Window Helper. */
	getNeededChatbarWidth(): number {
		var t = dojo.hasClass("ebd-body", "mobile_version"),
			i = 0,
			n = 0,
			o = t ? 64 : 280,
			a = t ? 64 : 176,
			s = 0;
		for (var r in this.chatbarWindows) {
			("tablelog" == r.substr(0, 8) &&
				dojo.hasClass("ebd-body", "desktop_version") &&
				!dojo.hasClass("ebd-body", "new_gameux")) ||
				("expanded" == this.chatbarWindows[r as any]!.status
					? i++
					: "collapsed" ==
							this.chatbarWindows[r as any]!.status &&
						n++);
			"table_" == r.substr(0, 6) &&
				dojo.hasClass("ebd-body", "desktop_version") &&
				"undefined" != typeof gameui &&
				("expanded" == this.chatbarWindows[r as any]!.status
					? (s += 412 - o)
					: "collapsed" ==
							this.chatbarWindows[r as any]!.status &&
						(s += 312 - a));
		}
		return 2 + i * o + n * a + s;
	}

	/** Internal. Chat Window Helper. */
	adaptChatbarDock(): void {
		if ($("chatwindowcollapsed_stacked")) {
			var t = this.getNeededChatbarWidth();
			if (t > 0) {
				dojo.addClass(
					"chatbardock",
					"chatbardock_visible"
				);
				dojo.style("chatbardock", "width", t + "px");
			} else
				dojo.removeClass(
					"chatbardock",
					"chatbardock_visible"
				);
			this.countStackedWindows() > 0
				? dojo.style(
						"chatwindowcollapsed_stacked",
						"display",
						"block"
					)
				: dojo.style(
						"chatwindowcollapsed_stacked",
						"display",
						"none"
					);
		}
	}

	/** Internal. Chat Window Helper. */
	countStackedWindows(): number {
		var e = 0;
		for (var t in this.chatbarWindows)
			"stacked" == this.chatbarWindows[t as any]!.status && e++;
		return e;
	}

	/** Internal. Chat Window Helper. */
	closeChatWindow(window_id: BGA.ChannelInfos['window_id']): void {
		if (this.chatbarWindows[window_id]) {
			this.makeSureChatBarIsOnBottom(window_id);
			null !== this.chatbarWindows[window_id]!.subscription &&
				g_sitecore.unsubscribeCometdChannel(
					this.chatbarWindows[window_id]!.subscription!
				);
			dojo.destroy("chatwindow_" + window_id);
			delete this.chatbarWindows[window_id];
			this.updateChatBarStatus();
			this.stackOrUnstackIfNeeded();
			this.adaptChatbarDock();
		}
	}

	/** Internal. Chat Window Helper. */
	onCloseChatWindow(event: Event): void {
		dojo.stopEvent(event);
		var i = (event.currentTarget as Element).id.substr(17) as BGA.ChannelInfos["window_id"],
			n = i.split("_")[0],
			o = i.split("_")[1];
		this.ackUnreadMessage(i, "unsub");
		if (null !== this.room && this.room.indexOf("P") >= 0) {
			var a =
				"undefined" != typeof current_player_id
					? current_player_id
					: this.player_id;
			if ("table" == n && this.room == "T" + o) {
				this.doLeaveRoom();
				this.closeChatWindow(i);
			} else
				("privatechat" == n &&
					this.room == "P" + o + "_" + a) ||
				("privatechat" == n &&
					this.room == "P" + a + "_" + o)
					? this.mediaConstraints.video
						? this.ajaxcall(
								"/table/table/startStopVideo.html",
								{
									target_table: null,
									target_player: o as BGA.ID | undefined,
								},
								this,
								function (e) {
									this.closeChatWindow(i);
								}
							)
						: this.mediaConstraints.audio &&
							this.ajaxcall(
								"/table/table/startStopAudio.html",
								{
									target_table: null,
									target_player: o as BGA.ID | undefined,
								},
								this,
								function (e) {
									this.closeChatWindow(i);
								}
							)
					: this.closeChatWindow(i);
		} else this.closeChatWindow(i);
	}

	/** Internal. Chat Window Helper. */
	onCollapseChatWindow(event: Event): void | true {
		if ("chatwindowtitlelink" == (event.target as Element).id.substr(0, 19))
			return true;
		dojo.stopEvent(event);
		var i: BGA.ChannelInfos["window_id"];
		if (
			"chatwindowcollapse" ==
			(event.currentTarget as Element).id.substr(0, 18)
		)
			var i = (event.currentTarget as Element).id.substr(19) as BGA.ChannelInfos["window_id"];
		else i = (event.currentTarget as Element).id.substr(23) as BGA.ChannelInfos["window_id"];
		this.collapseChatWindow(i);
	}

	/** Internal. Chat Window Helper. */
	collapseChatWindow(window_id: BGA.ChannelInfos['window_id'], checkBottom?: any): void {
		this.chatbarWindows[window_id]!.status = "collapsed";
		dojo.removeClass("chatwindow_" + window_id, [
			"collapsed",
			"expanded",
			"stacked",
		]);
		dojo.addClass("chatwindow_" + window_id, "collapsed");
		this.updateChatBarStatus();
		dojo.style("chatwindowexpanded_" + window_id, "display", "none");
		dojo.style("chatwindowcollapsed_" + window_id, "display", "block");
		dojo.style("chatwindowpreview_" + window_id, "display", "block");
		this.stackOrUnstackIfNeeded();
		this.adaptChatbarDock();
		undefined !== this.autoChatWhilePressingKey &&
			dijit.popup.close(this.autoChatWhilePressingKey);
		(undefined !== checkBottom && checkBottom) ||
			this.makeSureChatBarIsOnBottom(window_id);
	}

	/** Internal. Chat Window Helper. */
	onExpandChatWindow(event: Event): void {
		var t = (event.currentTarget as Element).id.substr(20) as BGA.ChannelInfos["window_id"];
		if ("expanded" != this.chatbarWindows[t]!.status) {
			this.expandChatWindow(t);
			this.ackUnreadMessage(t);
		} else this.collapseChatWindow(t);
	}

	/** Internal. Chat Window Helper. */
	onCollapseAllChatWindow(event: Event): void {
		if ("chatbar_inner" == (event.target as Element).id) {
			dojo.stopEvent(event);
			for (var i in this.chatbarWindows)
				"expanded" == this.chatbarWindows[i as any]!.status &&
					this.collapseChatWindow(i as BGA.ChannelInfos["window_id"]);
		}
	}

	/** Internal. Chat Window Helper. */
	updateChatBarStatus(): void {
		dojo.query(".chatwindow.expanded").length > 0
			? dojo.addClass("chatbar", "at_least_one_expanded")
			: dojo.removeClass("chatbar", "at_least_one_expanded");
	}

	/** Internal. Chat Window Helper. */
	expandChatWindow(window_id: BGA.ChannelInfos['window_id'], autoCollapseAfterMessage?: boolean): void {
		var n = dojo.hasClass("ebd-body", "mobile_version");
		if ("expanded" == this.chatbarWindows[window_id]!.status) {}
		else {
			if (n)
				for (var o in this.chatbarWindows)
					"expanded" ==
						this.chatbarWindows[o as BGA.ChannelInfos["window_id"]]!.status &&
						this.collapseChatWindow(o as BGA.ChannelInfos["window_id"], true);
			this.chatbarWindows[window_id]!.autoCollapseAfterMessage = !(
				undefined === autoCollapseAfterMessage || !autoCollapseAfterMessage
			);
			this.chatbarWindows[window_id]!.status = "expanded";
			dojo.removeClass("chatwindow_" + window_id, [
				"collapsed",
				"expanded",
				"stacked",
			]);
			dojo.addClass("chatwindow_" + window_id, "expanded");
			this.updateChatBarStatus();
			dojo.style(
				"chatwindowexpanded_" + window_id,
				"display",
				"block"
			);
			n
				? dojo.style(
						"chatwindowcollapsed_" + window_id,
						"display",
						"block"
					)
				: dojo.style(
						"chatwindowcollapsed_" + window_id,
						"display",
						"none"
					);
			dojo.style(
				"chatwindowpreview_" + window_id,
				"display",
				"none"
			);
			dojo.removeClass("chatwindow_" + window_id, "newmessage");
			$("chatwindownewmsgcount_" + window_id)!.innerHTML = "";
			$("chatwindowlogs_zone_" + window_id)!.scrollTop = $(
				"chatwindowlogs_zone_" + window_id
			)!.scrollHeight;
			this.stackOrUnstackIfNeeded();
			this.adaptChatbarDock();
			n && this.makeSureChatBarIsOnTop(window_id);
		}
		$("chatbarinput_" + window_id + "_input") &&
			$("chatbarinput_" + window_id + "_input")!.focus();
	}

	/** Internal. Chat Window Helper. */
	makeSureChatBarIsOnTop(window_id: BGA.ChannelInfos['window_id']): void {
		if (!dojo.hasClass("ebd-body", "chatbar_ontop")) {
			var i = dojo.position("chatbar");
			dojo.addClass("ebd-body", "chatbar_ontop");
			var n = dojo.position("chatbar");
			dojo.style("chatbar", "top", i.y + "px");
			dojo.style("chatbar", "bottom", "auto");
			var o = dojo.fx.slideTo({
				node: "chatbar",
				top: n.y,
				left: 0,
				delay: 0,
				duration: 200,
				// @ts-ignore - not support in this version of DOJO
				unit: "px",
			});
			dojo.connect(o, "onEnd", function () {
				dojo.style("chatbar", "bottom", "");
				dojo.style("chatbar", "top", "");
				dojo.style("chatbar", "position", "");
			});
			o.play();
			if (i.y == n.y)
				dojo.style(
					"chatwindowexpanded_" + window_id,
					"opacity",
					1
				);
			else {
				dojo.style(
					"chatwindowexpanded_" + window_id,
					"opacity",
					0
				);
				dojo.fadeIn({
					node: "chatwindowexpanded_" + window_id,
					duration: 200,
					delay: 180,
					onEnd(t) {
						dojo.style(t, "opacity", "");
					},
				}).play();
			}
		}
	}

	/** Internal. Chat Window Helper. */
	makeSureChatBarIsOnBottom(window_id: BGA.ChannelInfos['window_id']): void {
		if (dojo.hasClass("ebd-body", "chatbar_ontop")) {
			var i = dojo.position("chatbar");
			dojo.removeClass("ebd-body", "chatbar_ontop");
			var n = dojo.position("chatbar");
			dojo.style("chatbar", "top", "auto");
			dojo.style("chatbar", "bottom", n.y - i.y + "px");
			dojo.animateProperty({
				node: "chatbar",
				delay: 0,
				properties: {
					bottom: { end: "0", unit: "px" },
				},
				onEnd(t) {
					dojo.style("chatbar", "top", "");
					dojo.style("chatbar", "bottom", "");
					dojo.style("chatbar", "position", "");
				},
			}).play();
			dojo.style("chatwindowexpanded_" + window_id, "opacity", 1);
		}
	}

	/** Internal. Chat Window Helper. */
	onScrollDown(event: Event): void {
		dojo.stopEvent(event);
		var i = (event.currentTarget as Element).id.substr(23);
		dojo.style("chatwindowmorelogs_" + i, "display", "none");
		$("chatwindowlogs_zone_" + i)!.scrollTop = $(
			"chatwindowlogs_zone_" + i
		)!.scrollHeight;
	}

	/** Internal. Chat Window Helper. */
	onToggleStackMenu(event: Event): void {
		dojo.stopEvent(event);
		"block" == dojo.style("stackedmenu", "display")
			? dojo.style("stackedmenu", "display", "none")
			: dojo.style("stackedmenu", "display", "block");
	}

	/** Internal. Chat Window Helper. */
	onCallbackBeforeChat(args: any & { table?: number }, channel_url: string): boolean {
		if (
			undefined !== args.table &&
			// @ts-ignore - This is a bad check. this should have "typeof" in front of the chatbarWindows
			"undefined" != this.chatbarWindows[`table_${args.table}`]
		) {
			// @ts-ignore - This is a bad check. this should have "typeof" in front of the chatbarWindows
			"undefined" != this.chatbarWindows[`table_${args.table}`]
					.autoCollapseAfterMessage &&
				this.chatbarWindows[`table_${args.table}`]!
					.autoCollapseAfterMessage &&
				this.collapseChatWindow(`table_${args.table}`);
			if (undefined !== this.discussblock) {
				this.showMessage(
					_("A player at thie table blocked you."),
					"error"
				);
				return false;
			}
		}
		if (this.isBadWorkInChat(args.msg)) {
			var i =
				__(
					"lang_mainsite",
					"We detect a word in your chat input that may be considered as an insult/profanity/aggressive attitude by others."
				) + "\n\n";
			i +=
				__(
					"lang_mainsite",
					"BGA has a zero-tolerance policy about insults and aggressive attitudes, whatever the reason."
				) + "\n\n";
			i +=
				__(
					"lang_mainsite",
					"If another player reports you, you will be ban from BGA."
				) + "\n\n";
			i +=
				__(
					"lang_mainsite",
					"If someone is provoking you, DO NOT RESPOND, block this player (thumb down on his/her profile) and report this players to moderators."
				) + "\n\n";
			i +=
				__(
					"lang_mainsite",
					"Insults on both side = Moderation of both side."
				) + "\n\n";
			i += __(
				"lang_mainsite",
				"Do you really want to send your message and risk a moderation?"
			);
			return confirm(i);
		}
		if (
			"/chat/chat/say.html" == channel_url &&
			"undefined" != typeof mainsite &&
			mainsite.tutorialShowOnce(21)
		) {
			i =
				__(
					"lang_mainsite",
					"You are using Board Game Arena global chat: your message will be visible by all players"
				) + "\n\n";
			i +=
				__(
					"lang_mainsite",
					"There is a zero-tolerance policy on this chat for insults, advertising, or any content that may not be appropriate for all audience, or may be interpreted as an aggression."
				) + "\n\n";
			i +=
				__(
					"lang_mainsite",
					"Players who do not respect these rules will be banned immediately with no warning."
				) + "\n\n";
			i += __(
				"lang_mainsite",
				"Do you confirm you want to send this message?"
			);
			return confirm(i);
		}
		return true;
	}

	/** Internal. Chat Window Helper. */
	isBadWorkInChat(text: string | null): boolean {
		if (null === text) return false;
		var t = " " + text.toLowerCase() + " ";
		for (var i in this.badWordList)
			if (
				-1 !=
				t.indexOf(
					" " +
						this.badWordList[i]!.replace("-", " ") +
						" "
				)
			)
				return true;
		return false;
	}

	/** Internal. Chat Window Helper. */
	onCallbackAfterChat(_1?: any): void {
		undefined !== this.autoChatWhilePressingKey &&
			dijit.popup.close(this.autoChatWhilePressingKey);
	}

	/** Internal. Chat Window Helper. */
	callbackAfterChatError(args: { table?: number }): void {
		undefined !== args.table &&
			// @ts-ignore - This is a bad check. this should have "typeof" in front of the chatbarWindows

			"undefined" != this.chatbarWindows[`table_${args.table}`] &&
			// @ts-ignore - This is a bad check. this should have "typeof" in front of the chatbarWindows
			"undefined" !=this.chatbarWindows[`table_${args.table}`]
					.autoCollapseAfterMessage &&
			this.chatbarWindows[`table_${args.table}`]!.autoCollapseAfterMessage &&
			this.expandChatWindow(`table_${args.table}`, true);
	}

	/** Internal. Chat Window Helper. */
	onDockedChatFocus(event: Event): void {
		var t = (event.target as Element).id.substr(13).slice(0, -6) as BGA.ChannelInfos["window_id"];
		this.ackUnreadMessage(t);
	}

	/** Internal. Chat Window Helper. */
	onDockedChatInputKey(event: KeyboardEvent): void {
		var i = (event.target as Element).id.substr(13).slice(0, -6) as BGA.ChannelInfos["window_id"];
		this.ackUnreadMessage(i);
		if (
			this.chatbarWindows[i]!.autoShowOnKeyPress &&
			!this.chatbarWindows[i]!.autoCollapseAfterMessage &&
			undefined === this.autoChatWhilePressingKey &&
			dojo.hasClass("ebd-body", "desktop_version")
		) {
			var n =
				'<div class="icon20 icon20_suggestion"></div> ';
			n +=
				"<b>" +
				__("lang_mainsite", "Did you know?") +
				"</b>";
			n += "<hr/><div style='max-width:200px'>";
			n += __(
				"lang_mainsite",
				"You can type messages anytime during a game to start chatting without opening this chat window manually."
			);
			n += "</div>";
			this.autoChatWhilePressingKey =
				new dijit.TooltipDialog({
					id: "autoChatWhilePressingKey",
					content: n,
					// @ts-ignore - Bad prop?
					closable: true,
				});
			var o = event.target as HTMLElement;
			dijit.popup.open({
				popup: this.autoChatWhilePressingKey,
				around: $(o),
				orient: [
					"before-centered",
					"before",
					"below",
					"below-alt",
					"above",
					"above-alt",
				],
			});
		}
	}

	/** Internal. Chat Window Helper. */
	onShowPredefined(event: Event): void {
		var i = (event.currentTarget as Element).id.substr(24) as BGA.ChannelInfos["window_id"],
			n = (event.currentTarget as Element).id,
			o = false;
		if (
			undefined === this.chatbarWindows[i]!.predefinedMessages
		) {
			o = true;
			var a = this.getSmileyClassToCodeTable(),
				s = "";
			s += "<div style='width:300px'>";
			if (
				null !== this.notifqueue.game &&
				"table_" == i.substr(0, 6)
			) {
				for (var r in this.predefinedTextMessages)
					("tbleave" == r &&
						dojo.hasClass(
							"ebd-body",
							"playmode_realtime"
						)) ||
						(s +=
							"<p class='predefined_textmessage' id='predefined_textmessage_" +
							i +
							"-" +
							r +
							"'>" +
							__(
								"lang_mainsite",
								this.predefinedTextMessages[r as 'tbleave']
							) +
							"</p>");
				s += "<hr/>";
			}
			for (var l in a) {
				s +=
					"<div class='predefined_message' id='predefined_message_" +
					i +
					"-" +
					l +
					"'>";
				s += this.addSmileyToText(a[l]!);
				s += "</div>";
			}
			s += "</div>";
			this.chatbarWindows[i]!.predefinedMessages =
				new dijit.TooltipDialog({
					id: "predefinedMessages_" + i,
					content: s,
					// @ts-ignore - Bad prop?
					closable: true,
				});
			this.chatbarWindows[i]!.predefinedMessagesOpen = false;
		}
		if (
			Boolean(0) == this.chatbarWindows[i]!.predefinedMessagesOpen
		) {
			this.chatbarWindows[i]!.predefinedMessagesOpen = true;
			dijit.popup.open({
				popup: this.chatbarWindows[i]!
					.predefinedMessages!,
				around: $(n)!,
				orient: [
					"after-centered",
					"after",
					"below",
					"below-alt",
					"above",
					"above-alt",
				],
			});
		} else {
			this.chatbarWindows[i]!.predefinedMessagesOpen = false;
			dijit.popup.close(
				this.chatbarWindows[i]!.predefinedMessages
			);
		}
		var d = dojo.hasClass("ebd-body", "mobile_version");
		dojo.style(
			"chatbarinput_predefined_" + i + "_dropdown",
			"zIndex",
			String(d ? 10510 : 1051)
		);
		if (o) {
			dojo.query<HTMLElement>(
				"#chatbarinput_predefined_" +
					i +
					"_dropdown .predefined_message"
			).connect(
				"onclick",
				this,
				"onInsertPredefinedMessage"
			);
			dojo.query<HTMLElement>(
				"#chatbarinput_predefined_" +
					i +
					"_dropdown .predefined_textmessage"
			).connect(
				"onclick",
				this,
				"onInsertPredefinedTextMessage"
			);
		}
	}

	/** Internal. Chat Window Helper. */
	onInsertPredefinedMessage(event: Event): void {
		var t = (event.currentTarget as Element).id.substr(19).split("-"),
			i = t[0] as BGA.ChannelInfos["window_id"],
			n = t[1]!,
			o = this.getSmileyClassToCodeTable();
		this.chatbarWindows[i]!.input.addContentToInput(o[n]!);
		$("chatbarinput_" + i + "_input")!.focus();
		this.chatbarWindows[i]!.predefinedMessagesOpen = false;
		dijit.popup.close(
			this.chatbarWindows[i]!.predefinedMessages
		);
	}

	/** Internal. Chat Window Helper. */
	onInsertPredefinedTextMessage(event: Event): void {
		var t = (event.currentTarget as Element).id.substr(23).split("-"),
			i = t[0] as BGA.ChannelInfos["window_id"],
			n = t[1]!,
			o = this.predefinedTextMessages![n]!;
		this.chatbarWindows[i]!.input.addContentToInput(o);
		$("chatbarinput_" + i + "_input")!.focus();
		this.chatbarWindows[i]!.input.input_div!.value == o &&
			this.chatbarWindows[i]!.input.sendMessage();
		this.chatbarWindows[i]!.predefinedMessagesOpen = false;
		dijit.popup.close(
			this.chatbarWindows[i]!.predefinedMessages
		);
	}

	/** Internal. Sets the given parameters with their matching property (if defined). */
	setGroupList(groupList: SiteCore_Template['groupList'], allGroupList?: SiteCore_Template['allGroupList'], red_thumbs_given?: SiteCore_Template['red_thumbs_given'], red_thumbs_taken?: SiteCore_Template['red_thumbs_taken']): void {
		this.groupList = groupList!;
		this.red_thumbs_given = {};
		this.red_thumbs_taken = {};
		undefined !== allGroupList && (this.allGroupList = allGroupList);
		this.red_thumbs_given =
			undefined !== red_thumbs_given && "object" == typeof red_thumbs_given ? red_thumbs_given : {};
		this.red_thumbs_taken =
			undefined !== red_thumbs_taken && "object" == typeof red_thumbs_taken ? red_thumbs_taken : {};
		if (!this.bChatDetached) {
			var o: Record<string, `/group/g${number}`> = {};
			for (var a in groupList) o[a] = `/group/g${Number(a)}`;
			this.groupToCometdSubs =
				this.subscribeCometdChannels(
					o,
					this.notifqueue,
					"onNotification"
				);
		}
	}

	/** Internal. Updates the {@link allLanguagesList} property with the given value. */
	setLanguagesList(allLanguagesList: SiteCore_Template['allLanguagesList']): void {
		this.allLanguagesList = allLanguagesList;
	}

	/** Internal. Updates the {@link pma} property with the given value. */
	setPma(pma: SiteCore_Template['pma']): void {
		this.pma = pma;
	}

	/** Internal. Updates the {@link rtc_mode} and {@link rtc_room} property with the given values. */
	setRtcMode(rtc_mode: SiteCore_Template['rtc_mode'], rtc_room: SiteCore_Template['rtc_room']): void {
		this.rtc_mode = rtc_mode;
		this.rtc_room = rtc_room;
	}

	/** Internal. WIP */
	takeIntoAccountAndroidIosRequestDesktopWebsite(e: Document): void {
		var t,
			i,
			n = navigator.userAgent,
			o = / mobile/i.test(n),
			a = !(!/ gecko/i.test(n) || !/ firefox\//i.test(n)),
			s =
				"was" ===
				((i = "wasmobile"),
				(e.cookie.match("(^|; )" + i + "=([^;]*)") ||
					String(0))[2]),
			r = "user-scalable=yes, maximum-scale=2";
		if (o && !s) e.cookie = "wasmobile=was";
		else if (!o && s)
			if (a) {
				(t = e.createElement("meta")).setAttribute(
					"content",
					r
				);
				t.setAttribute("name", "viewport");
				e.getElementsByTagName("head")[0]!.appendChild(
					t
				);
			} else
				undefined === e.getElementsByName("viewport")[0] ||
					e.getElementsByName("viewport")[0]!
						.setAttribute("content", r);
	}

	/** Internal. WIP */
	traceLoadingPerformances(): void {
		if (
			window.performance &&
			window.performance.getEntries
		) {
			var t = window.performance.getEntries(),
				i: Record<string, {
					nb: number;
					max: number;
					total: number;
					avg?: number;
				}> = {};
			for (var n in t) {
				var o = t[n]!,
					a = extractDomain(o.name)!;
				if (undefined === i[a])
					i[a] = {
						nb: 1,
						max: o.duration,
						total: o.duration,
					};
				else {
					i[a]!.nb++;
					i[a]!.max = Math.max(i[a]!.max, o.duration);
					i[a]!.total += o.duration;
				}
			}
			for (var n in i) {
				i[n]!.avg = Math.round(i[n]!.total / i[n]!.nb);
				i[n]!.total = Math.round(i[n]!.total);
				i[n]!.max = Math.round(i[n]!.max);
			}
			this.ajaxcall(
				"/table/table/perfs.html",
				{ perfs: dojo.toJson(i) },
				this,
				function (e) {},
				function (e) {},
				"post"
			);
		}
	}

	/** Returns the current player id. This returns the global {@link current_player_id} if defined, and {@link Gamegui.player_id} otherwise. */
	getCurrentPlayerId(): BGA.ID | undefined {
		return "undefined" != typeof current_player_id
			? current_player_id
			: this.player_id!;
	}

	/** Internal. WIP */
	tutorialShowOnce(e: number, t?: boolean): boolean {
		undefined === t && (t = true);
		if ("undefined" != typeof current_player_id) {
			if (toint(current_player_id)! < 0) return false;
		} else if (this.isSpectator) return false;
		if (e < 0 || e >= 256) {
			console.error("Invalid tutorial id: " + e);
			return false;
		}
		var i = Math.floor(e / 64),
			n = 1 << e % 64;
		if (undefined !== this.tutorial) var o = this.tutorial;
		else o = this.metasite_tutorial!;
		if (o[i]! & n) {
			if (t) {
				o[i] = o[i]! & ~n;
				this.ajaxcall(
					"/table/table/markTutorialAsSeen.html",
					{ id: e },
					this,
					function (e) {}
				);
			}
			return true;
		}
		return false;
	}

	highligthElementwaitForPopinToClose() {
		if (dojo.query(".standard_popin").length > 0)
			setTimeout(
				dojo.hitch(
					this,
					"highligthElementwaitForPopinToClose"
				),
				1e3
			);
		else {
			this.bHighlightPopinTimeoutInProgress = false;
			this.onElementTutorialNext();
		}
	}
	highlightElementTutorial(id: string, text: string, optClass?: string) {
		undefined === optClass && (optClass = "");
		if ($("tutorial-overlay"))
			this.tutorialHighlightedQueue.push({
				id: id,
				text: text,
				optclass: optClass,
			});
		else if (dojo.query(".standard_popin").length > 0) {
			this.tutorialHighlightedQueue.push({
				id: id,
				text: text,
				optclass: optClass,
			});
			if (
				undefined ===
					this.bHighlightPopinTimeoutInProgress ||
				Boolean(0) == this.bHighlightPopinTimeoutInProgress
			) {
				this.highligthElementwaitForPopinToClose();
				this.bHighlightPopinTimeoutInProgress = true;
			}
		} else {
			dojo.place(
				'<div id="tutorial-overlay" class="tutorial-overlay"></div>',
				"ebd-body",
				"first"
			);
			dojo.connect(
				$("tutorial-overlay")!,
				"onclick",
				this,
				"onElementTutorialNext"
			);
			var o = { node: "tutorial-overlay", duration: 1e3 } as Parameters<DojoJS.Fx['fadeIn']>[0],
				a = this;
			this.highlightFadeInInProgress = true;
			o.onEnd = dojo.hitch(this, function () {
				this.highlightFadeInInProgress = false;
				$("newArchiveComment") &&
					dojo.destroy("newArchiveComment");
				dijit.byId("currentTutorialDialog") &&
					dijit
						.byId("currentTutorialDialog")
						.destroy();
				var n =
					"<div id='newArchiveComment' class='newArchiveComment'>                                    <div class='archiveComment_before'><p class='archiveComment_before_inner'><i class='fa fa-graduation-cap'></i></p></div>                                    <div id='newArchiveCommentTextDisplay'>" +
					this.applyCommentMarkup(text) +
					"</div>                                    <div id='newArchiveCommentDisplayControls'><a href='#' id='newArchiveCommentNext' class='bgabutton bgabutton_blue'>" +
					__("lang_mainsite", "Continue") +
					"</a>                                    </div>                                </div>";
				this.currentTutorialDialog =
					new dijit.TooltipDialog({
						id: "currentTutorialDialog",
						content: n,
						// @ts-ignore - Bad prop?
						closable: true,
					});
				if (null !== id && $(id))
					dijit.popup.open({
						popup: this.currentTutorialDialog,
						around: $(id)!,
						orient: [
							"below",
							"above",
							"after",
							"before",
						],
					});
				else {
					var o = dojo.position("ebd-body").w! / 2 - 215;
					dijit.popup.open({
						popup: this.currentTutorialDialog,
						x: o,
						y: 180,
						orient: [
							"below",
							"above",
							"after",
							"before",
						],
					});
					dojo.query(".dijitTooltipConnector").style(
						"display",
						"none"
					);
				}
				$("newArchiveCommentNext") &&
					dojo.connect(
						$("newArchiveCommentNext")!,
						"onclick",
						a,
						"onElementTutorialNext"
					);
			});
			if (null != id) {
				var s = dojo.window.getBox(),
					r = dojo.position(id),
					l = false;
				(r.y < 0 || r.y + r.h! > s.h) && (l = true);
				l &&
					window.scrollBy({
						top: r.y - 200,
						behavior: "smooth",
					});
				dojo.addClass(id, "above-overlay");
				this.current_hightlighted_additional_class = optClass;
				"" != optClass && dojo.addClass(id, optClass);
				"static" == dojo.style(id, "position") &&
					dojo.addClass(id, "above-overlay-relative");
			}
			dojo.fadeIn(o).play();
		}
	}
	onElementTutorialNext(t?: Event) {
		undefined !== t && dojo.stopEvent(t);
		if (
			undefined === this.highlightFadeInInProgress ||
			!this.highlightFadeInInProgress
		) {
			if (null !== this.currentTutorialDialog) {
				dijit.popup.close(this.currentTutorialDialog);
				this.currentTutorialDialog = null;
			}
			if ($("tutorial-overlay")) {
				var i = {
					node: "tutorial-overlay",
					duration: 500,
				} as Parameters<DojoJS.Fx['fadeOut']>[0];
				this.highlightFadeInInProgress = true;
				i.onEnd = dojo.hitch(this, function () {
					this.highlightFadeInInProgress = false;
					dojo.destroy("tutorial-overlay");
					"" !=
						this
							.current_hightlighted_additional_class &&
						dojo
							.query(".above-overlay")
							.removeClass(
								this.current_hightlighted_additional_class!
							);
					dojo.query(".above-overlay").removeClass(
						"above-overlay"
					);
					dojo.query(
						".above-overlay-relative"
					).removeClass("above-overlay-relative");
					if (
						this.tutorialHighlightedQueue.length > 0
					) {
						var t =
							this.tutorialHighlightedQueue.shift()!;
						this.highlightElementTutorial(
							t.id,
							t.text,
							t.optclass
						);
					}
				});
				dojo.fadeOut(i).play();
			} else if (
				this.tutorialHighlightedQueue.length > 0
			) {
				var n = this.tutorialHighlightedQueue.shift()!;
				this.highlightElementTutorial(
					n.id,
					n.text,
					n.optclass
				);
			}
		}
	}
	websiteWindowVisibilityChange(e?: { type: string }) {
		var t = "visible" as const,
			i = "hidden" as const,
			n = {
				focus: t,
				focusin: t,
				pageshow: t,
				blur: i,
				focusout: i,
				pagehide: i,
			} as const;
		(e = e || window.event!).type in n
			? (this.window_visibility = n[e.type as keyof typeof n])
			: (this.window_visibility = document.hidden
					? "hidden"
					: "visible");
	}
	ackUnreadMessage(t: BGA.ChannelInfos["window_id"], i?: 'unsub' | string) {
		var n = t.split("_")[0],
			o = t.split("_")[1] as BGA.ID,
			a = false;
		undefined !== i &&
			"unsub" == i &&
			"table" == n &&
			(a = true);
		if (
			("privatechat" == n || "table" == n) &&
			(dojo.query(
				"#chatwindowlogs_zone_" + t + " .newmessage"
			).length > 0 ||
				a)
		) {
			var s: string[] = [];
			dojo.query<Element>(
				"#chatwindowlogs_zone_" +
					t +
					" .newmessage .roundedboxinner"
			).forEach(function (e) {
				s.push(e.id.substr(13));
			});
			if ("privatechat" == n) {
				var r = o;
				this.ackMessagesWithPlayer(r, s);
			} else if ("table" == n) {
				var l = o;
				this.ackMessagesOnTable(l, s, a);
			}
			dojo.query(
				"#chatwindowlogs_zone_" + t + " .newmessage"
			).removeClass("newmessage");
		}
	}
	ackMessagesWithPlayer(e: BGA.ID, t: string[]) {
		this.ajaxcall(
			"/table/table/chatack.html",
			{ player: e, list: t.join(";") },
			this,
			function (t) {
				svelte.stores.discussions.ackMessagesWithPlayer(e);
			},
			function (e) {},
			"get"
		);
	}
	ackMessagesOnTable(table: BGA.ID, list: string[], unsub: boolean) {
		var n: {
			table: BGA.ID;
			list: string;
			bUnsub?: boolean;
		} = { table: table, list: list.join(";") };
		unsub && (n.bUnsub = unsub);
		this.ajaxcall(
			"/table/table/chatack.html",
			n,
			this,
			function (e) {},
			function (e) {},
			"get"
		);
	}
	onAckMsg(t: BGA.Notif) {
		for (var i in t.args!['msgs']) {
			var n = t.args!['msgs'];
			if ($("privmsg_read_" + n)) {
				dojo.removeClass(
					"privmsg_read_" + n,
					"message_unread"
				);
				dojo.addClass("privmsg_read_" + n, "message_read");
			}
		}
	}
	initMonitoringWindowVisibilityChange() {
		var t = "hidden";

		if (t in document)
			dojo.connect(
				document,
				"visibilitychange",
				this,
				"websiteWindowVisibilityChange"
			);
		else if ((t = "mozHidden") in document)
			dojo.connect(
				// @ts-ignore - This is not a valid event in the MS spec.
				document,
				"mozvisibilitychange",
				this,
				"websiteWindowVisibilityChange"
			);
		else if ((t = "webkitHidden") in document)
			dojo.connect(
				// @ts-ignore - This is not a valid event in the MS spec.
				document,
				"webkitvisibilitychange",
				this,
				"websiteWindowVisibilityChange"
			);
		else if ((t = "msHidden") in document)
			dojo.connect(
				// @ts-ignore - This is not a valid event in the MS spec.
				document,
				"msvisibilitychange",
				this,
				"websiteWindowVisibilityChange"
			);
		else if ("onfocusin" in document) {
			dojo.connect(
				document,
				"onfocusin",
				this,
				"websiteWindowVisibilityChange"
			);
			dojo.connect(
				document,
				"onfocusout",
				this,
				"websiteWindowVisibilityChange"
			);
		} else {
			dojo.connect(
				window,
				"onpageshow",
				this,
				"websiteWindowVisibilityChange"
			);
			dojo.connect(
				window,
				"onpagehide",
				this,
				"websiteWindowVisibilityChange"
			);
			dojo.connect(
				window,
				"onfocus",
				this,
				"websiteWindowVisibilityChange"
			);
			dojo.connect(
				window,
				"onblur",
				this,
				"websiteWindowVisibilityChange"
			);
		}
		// @ts-ignore - This is a key check which will never result in error.
		undefined !== document[t] &&
			this.websiteWindowVisibilityChange({
				// @ts-ignore - This is a key check which will never result in error.
				type: document[t] ? "blur" : "focus",
			});
	}
	playingHoursToLocal(e: string, t?: false): string;
	playingHoursToLocal(e: string, t: true): string | { start_hour: string, end_hour: string };
	playingHoursToLocal(e: string, t?: boolean): string | { start_hour: string, end_hour: string } {
		if (-1 == e.indexOf(":00")) return e;
		var i =
			toint(e.substr(0, e.indexOf(":")))! +
			this.timezoneDelta!;
		return undefined !== t && t
			? {
					start_hour: (i % 24) + ":00",
					end_hour: ((i + 12) % 24) + ":00",
				}
			: (i % 24) +
					":00 &rarr; " +
					((i + 12) % 24) +
					":00";
	}
	showSplashedPlayerNotifications(t: any) {
		undefined === this.splashNotifToDisplay &&
			(this.splashNotifToDisplay = []);
		for (var i in t) {
			var n = t[i];
			$("splash_trophy_" + n.id) ||
				this.splashNotifToDisplay.push(n);
		}
		"none" ==
			dojo.style(
				"splashedNotifications_overlay",
				"display"
			) && this.displayNextSplashNotif();
	}
	displayNextSplashNotif() {
		try {
			var t = this.splashNotifToDisplay!.shift(),
				i = this.splashNotifToDisplay!.length;
			if (undefined === t) {
				dojo.fadeOut({
					node: "splashedNotifications_overlay",
					duration: 500,
					onEnd() {
						dojo.style(
							"splashedNotifications_overlay",
							"display",
							"none"
						);
					},
				}).play();
				return;
			}
			if (
				this.splashNotifRead &&
				this.splashNotifRead[t.id]
			) {
				this.displayNextSplashNotif();
				return;
			}
			var n = 500;
			if (
				"none" ==
				dojo.style(
					"splashedNotifications_overlay",
					"display"
				)
			) {
				dojo.style(
					"splashedNotifications_overlay",
					"display",
					"block"
				);
				dojo.fadeIn({
					node: "splashedNotifications_overlay",
					duration: 1e3,
				}).play();
				n = 1e3;
			}
			if (
				16 == toint(t.news_type) ||
				21 == toint(t.news_type) ||
				17 == toint(t.news_type) ||
				30 == toint(t.news_type)
			) {
				if (dojo.byId("splash_trophy_" + t.id))
					throw new Error(
						"Splash notification already exists"
					);
				var o = t.args[3]!;
				if (toint(o)! > 1e3) {
					var a = t.args[17]!,
						s = t.args[18]!;
					t.base_img = getStaticAssetUrl(
						"img/awards/" + o + "_" + s + ".png"
					);
					var r = Math.floor(Number(a) / 1e3);
					t.addimg =
						'<img src="' +
						g_themeurl +
						"../../data/grouparms/" +
						r +
						"/group_" +
						a +
						'.png?h=t"/>';
					t.trophy_name =
						t.jargs.championship_name +
						" " +
						t.jargs.tournament_name +
						": " +
						__("lang_mainsite", t.trophy_name);
				} else {
					t.base_img = getStaticAssetUrl(
						"img/awards/" + o + ".png"
					);
					t.addimg = "";
					t.trophy_name = __(
						"lang_mainsite",
						t.trophy_name
					);
					t.trophy_name = t.trophy_name.replace(
						"%s",
						format_number(Number(t.trophy_name_arg))
					);
					t.trophy_descr = __(
						"lang_mainsite",
						t.trophy_descr
					);
					t.trophy_descr = t.trophy_descr.replace(
						"%s",
						format_number(Number(t.trophy_name_arg))
					);
				}
				t.shadow_img = getStaticAssetUrl(
					"img/awards/award_shadow.png"
				);
				t.game_name = "";
				if (undefined !== t.jargs.game_name) {
					t.game_name = __(
						"lang_mainsite",
						t.jargs.game_name + "_displayed"
					);
					t.trophy_descr = "";
				}
				t.continuelbl = __("lang_mainsite", "Continue");
				t.prestige = format_number(Number(t.args[16]));
				t.skiplbl =
					i > 0
						? dojo.string.substitute(
								_("Skip ${nbr} more"),
								{ nbr: i }
							)
						: "";
				var l =
					'<div id="splash_trophy_${id}" class="splash_block">                        <div id="splash_background_${id}" class="splash_background"></div>                        <div id="splash_central_${id}" class="splash_central">                            <div class="trophyimg_wrap">                                <div id="splash_trophy_imgwrap_${id}" class="trophyimg_image">                                    <img class="trophyimg_shadow"  src=\'${shadow_img}\'"></img>                                    <div id="splash_trophyimg_${id}" class="trophyimg trophyimg_xlarge" style="background-image: url(\'${base_img}\')">${addimg}</div>                                </div>                                <div id="trophy_prestige_${id}" class="trophy_prestige"><div class="xp_container" style="font-size:14px;">+${prestige} XP<div class="arrowback"></div><div class="arrow"></div><div class="arrowbackl"></div><div class="arrowl"></div></div></div>                            </div>                            <div class="splash_intro">' +
					__(
						"lang_mainsite",
						"You get a new trophy"
					) +
					'</div>                            <div class="splash_gamename gamename">${game_name}</div>                            <div class="splash_trophyname">${trophy_name}</div>                            <div class="splash_descr">${trophy_descr}</div>                        </div>                        <div id="continue_btn_${id}" class="bgabutton bgabutton_always_big bgabutton_blue">${continuelbl}</div>                        <a id="skip_wrap_${id}" class="skip_wrap no-underline" href="#">${skiplbl}</a>                    </div>';
				dojo.place(
					dojo.string.substitute(l, t),
					splashedNotifications_overlay!
				);
				dojo.style("splash_central_" + t.id, "opacity", 0);
				dojo.style("continue_btn_" + t.id, "opacity", 0);
				dojo.style("skip_wrap_" + t.id, "opacity", 0);
				dojo.style(
					"splash_background_" + t.id,
					"left",
					"100%"
				);
				dojo.style(
					"trophy_prestige_" + t.id,
					"opacity",
					0
				);
				dojo.fx
					.chain([
						dojo.animateProperty({
							delay: n,
							node: "splash_background_" + t.id,
							properties: { left: 0, unit: "%" },
							onEnd() {
								playSound("new_trophy");
							},
						}),
						dojo.fadeIn({
							node: "splash_central_" + t.id,
							duration: 700,
						}),
						dojo.fadeIn({
							node: "trophy_prestige_" + t.id,
							duration: 700,
						}),
						dojo.fx.combine([
							dojo.fadeIn({
								node: "continue_btn_" + t.id,
								duration: 700,
							}),
							dojo.fadeIn({
								node: "skip_wrap_" + t.id,
								duration: 700,
							}),
						]),
					])
					.play();
				dojo.connect(
					$("continue_btn_" + t.id)!,
					"onclick",
					this,
					"onDisplayNextSplashNotif"
				);
				dojo.connect(
					$("skip_wrap_" + t.id)!,
					"onclick",
					this,
					"onSkipAllSplashNotifs"
				);
			} else if (28 == toint(t.news_type)) {
				var d = t.args[1];
				t.game_name = __(
					"lang_mainsite",
					t.jargs.game_name + "_displayed"
				);
				t.continuelbl = __("lang_mainsite", "Continue");
				var c = Number(t.args[10]),
					h = Number(t.args[11]),
					u = this.arenaPointsDetails(
						c / 1e4,
						t.jargs.league_nbr
					),
					p = this.arenaPointsDetails(
						h / 1e4,
						t.jargs.league_nbr
					);
				l =
					'<div id="splash_trophy_${id}" class="splash_block splash_arena_points"><div id="splash_background_arena" class="splash_background"></div><div id="splash_central_arena" class="splash_central"><div id="splash_trophy_imgwrap_arena" class="leagueimg_image"><img class="trophyimg_shadow"  src=\'${shadow_img}\'"></img><div id="splash_trophyimg_arena" class="trophyimg trophyimg_xlarge" style="background-image: url(\'${base_img}\')"></div></div><div id="splash_arena_bar"></div><div class="splash_intro">${game_name}  ${league_name}</div><div class="progressbar progressbar_arena arena_${league_id} progressbar_nolabel"><div id="arena_bar" class="progressbar_bar"><div id="progressbar_arena_width" class="progressbar_content"  style="${arenabarpcent}"><div id="arena_bar_container" class="arena_container">${arena_points_html}</div></div></div></div><div id="arena_bar_bottom_infos" class="progressbar_bottom_infos">${arena_bottom_infos}</div><div id="arena_world_rank_wrap" style="display:none;">' +
					__("lang_mainsite", "World rank") +
					': <span id="arena_world_rank"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span></div></div><div id="continue_btn_${id}" class="bgabutton bgabutton_always_big bgabutton_blue">${continuelbl}</div></div>';
				t.shadow_img = getStaticAssetUrl(
					"img/awards/award_shadow.png"
				);
				t.base_img = getStaticAssetUrl(
					"img/awards/" + (100 + u.league) + ".png"
				);
				t.league_name = u.league_name;
				t.league_id = u.league;
				var m: typeof this.transform,
					g = this.arenaPointsHtml(u);
				t.arena_points_html = g.bar_content;
				t.arena_bottom_infos = g.bottom_infos;
				t.arenabarpcent = g.bar_pcent;
				if (toint(h)! <= toint(c)!)
					var f = p.points!,
						v = u.points!;
				else {
					(f = p.points!), (v = u.points!);
					p.league > u.league && (f = 10);
				}
				dojo.place(
					dojo.string.substitute(l, t),
					splashedNotifications_overlay!
				);
				dojo.style("splash_central_arena", "opacity", 0);
				dojo.style("continue_btn_" + t.id, "opacity", 0);
				dojo.style(
					"splash_background_arena",
					"left",
					"100%"
				);
				dojo.forEach(
					[
						"transform",
						"WebkitTransform",
						"msTransform",
						"MozTransform",
						"OTransform",
					],
					function (t) {
						// @ts-ignore - This is testing if the style property exists.
						undefined !== dojo.body().style[t] && (m = t);
					}
				);
				this.transform = m!;
				var b = [
					dojo.animateProperty({
						delay: n,
						node: "splash_background_arena",
						properties: { left: 0, unit: "%" },
					}),
					dojo.fadeIn({
						node: "splash_central_arena",
						duration: 700,
					}),
				];
				if (5 == u.league) {
					var y = this.arenaPointsHtml(p);
					if (p.arelo != u.arelo) {
						var w = "";
						if (p.arelo > u.arelo) {
							var C = p.arelo - u.arelo;
							w =
								"+" +
								Math.round(C) +
								" " +
								__("lang_mainsite", "points");
						} else {
							C = p.arelo - u.arelo;
							w =
								Math.round(C) +
								" " +
								__("lang_mainsite", "points");
						}
						var k = new dojo.Animation({
							curve: [u.arelo, p.arelo],
							duration: 1e3,
							onBegin() {
								playSound("elochange");
							},
							onAnimate: dojo.hitch(
								this,
								function (e) {
									$(
										"arena_bar_container"
									)!.innerHTML =
										Math.round(e) +
										" " +
										__(
											"lang_mainsite",
											"points"
										);
									var t =
										Number(g.bar_pcent_number) +
										((Number(y.bar_pcent_number) -
											Number(g.bar_pcent_number)) *
											(e - u.arelo)) /
											(p.arelo - u.arelo);
									$(
										"progressbar_arena_width"
									)!.style.width = t + "%";
								}
							),
							onEnd() {
								$("arena_bar")!.innerHTML +=
									'<div class="arena_container_bar_details">' +
									w +
									"</div>";
							},
						});
						b.push(k);
					}
					var x = {
						transform: m,
						node: $("arena_world_rank_wrap")!,
					};
					k = new dojo.Animation({
						curve: [20, 1],
						delay: 300,
						onBegin: dojo.hitch(x, function () {
							dojo.style(
								"arena_world_rank_wrap",
								"display",
								"block"
							);
						}),
						onAnimate: dojo.hitch(x, function (e) {
							this.node.style[this.transform!] =
								"scale(" + e + ")";
						}),
						onEnd() {
							playSound("gain_arena");
						},
						duration: 500,
					});
					b.push(k);
					this.ajaxcall(
						"/lobby/lobby/getPlayerWorldRanking.html",
						{ game: d!, isArena: true },
						this,
						dojo.hitch(this, function (e) {
							$("arena_world_rank")!.innerHTML =
								this.getRankString(e.rank);
						})
					);
				}
				if (f > v) {
					soundManager.loadSound &&
						soundManager.loadSound("gain_arena");
					for (var T = v; T < f; T++) {
						dojo.query(
							".arena_point_wrap_" +
								T +
								" .arena_shadow"
						).style("opacity", 1);
						var A = dojo.query<HTMLElement>(
							".arena_point_wrap_" +
								T +
								" .arena_colored"
						)[0]!;
						(x = { transform: m, node: A }),
							(k = new dojo.Animation({
								curve: [20, 1],
								onBegin: dojo.hitch(
									x,
									function () {
										this.node.style.opacity = String(1);
									}
								),
								onAnimate: dojo.hitch(
									x,
									function (e) {
										this.node.style[
											this.transform!
										] = "scale(" + e + ")";
									}
								),
								onEnd() {
									playSound("gain_arena");
									var t = dojo.query<Element>(
										".splash_block .remain_arena_points"
									)[0];
									if (t) {
										t.innerHTML = String(toint(t.innerHTML)! - 1);
										0 ==
											toint(t.innerHTML) &&
											(dojo.query<Element>(
												".progressbar_bottom_infos"
											)[0]!.innerHTML =
												'<i class="fa fa-check"></i> ' +
												__(
													"lang_mainsite",
													"Completed!"
												));
									}
								},
								duration: 500,
							}));
						b.push(k);
					}
				} else if (f < v) {
					soundManager.loadSound &&
						soundManager.loadSound("lose_arena");
					for (T = v; T > f; T--) {
						dojo.query(
							".arena_point_wrap_" +
								(T - 1) +
								" .arena_white"
						).style("opacity", 1);
						dojo.query(
							".arena_point_wrap_" +
								(T - 1) +
								" .arena_shadow"
						).style("opacity", 0);
						(A = dojo.query<HTMLElement>(
							".arena_point_wrap_" +
								(T - 1) +
								" .arena_colored"
						)[0]!),
							(k = this.slideToObjectPos(
								A,
								A.parentNode as HTMLElement,
								0,
								500
							));
						dojo.connect(k, "onEnd", function (t) {
							dojo.destroy(t);
							playSound("lose_arena");
							var i = dojo.query<Element>(
								".splash_block .remain_arena_points"
							)[0]!;
							i &&
								(i.innerHTML = String(toint(i.innerHTML)! + 1));
						});
						b.push(k);
					}
				}
				b.push(
					dojo.fadeIn({
						node: "continue_btn_" + t.id,
						duration: 700,
					})
				);
				dojo.fx.chain(b).play();
				dojo.connect(
					$("continue_btn_" + t.id)!,
					"onclick",
					this,
					"onDisplayNextSplashNotif"
				);
			} else if (31 == toint(t.news_type)) {
				dojo.style(
					"splashedNotifications_overlay",
					"display",
					"none"
				);
				var j = t.args[20];
				setTimeout(function () {
					gotourl("penalty?id=" + j + "&n=" + t!.id);
				}, 500);
			} else if (32 == toint(t.news_type)) {
				dojo.style(
					"splashedNotifications_overlay",
					"display",
					"none"
				);
				var S = t.args[21];
				setTimeout(function () {
					gotourl(
						"karmalimit?limit=" + S + "&n=" + t!.id
					);
				}, 500);
			} else if (50 == toint(t.news_type)) {
				dojo.style(
					"splashedNotifications_overlay",
					"display",
					"none"
				);
				var E = t.jargs.alert;
				setTimeout(function () {
					gotourl(
						"redthumbwarning?alert=" +
							E +
							"&n=" +
							t!.id
					);
				}, 500);
			} else {
				console.error(
					"Unknow notification to splashed reveived: " +
						t.news_type
				);
				this.displayNextSplashNotif();
			}
		} catch (N) {
			if (t) {
				this.ajaxcall(
					"/message/board/markread.html",
					{ id: t.id },
					this,
					function () {}
				);
				dojo.addClass(
					"splash_trophy_" + t.id,
					"to_be_destroyed"
				);
				this.fadeOutAndDestroy("splash_trophy_" + t.id);
			}
			this.displayNextSplashNotif();
		}
	}
	onNewsRead(t: string) {
		if ($("splash_trophy_" + t))
			if (
				dojo.hasClass(
					"splash_trophy_" + t,
					"to_be_destroyed"
				)
			) {}
			else {
				this.fadeOutAndDestroy("splash_trophy_" + t);
				this.displayNextSplashNotif();
			}
		else {
			this.splashNotifRead || (this.splashNotifRead = {});
			this.splashNotifRead[t] = true;
		}
	}
	onDisplayNextSplashNotif(t: Event) {
		dojo.stopEvent(t);
		var i = (t.currentTarget as Element).id.split("_")[2] as BGA.ID;
		this.markSplashNotifAsRead(i, false);
	}
	onSkipAllSplashNotifs(t: Event) {
		dojo.stopEvent(t);
		var i = (t.currentTarget as Element).id.split("_")[2] as BGA.ID;
		this.markSplashNotifAsRead(i, true);
	}
	markSplashNotifAsRead(t: BGA.ID, i: boolean) {
		if (i) {
			var n = t + ";";
			for (var o in this.splashNotifToDisplay)
				n += this.splashNotifToDisplay[Number(o)]!.id + ";";
			this.ajaxcall(
				"/message/board/markreads.html",
				{ ids: n },
				this,
				function () {}
			);
			this.splashNotifToDisplay = [];
		} else
			this.ajaxcall(
				"/message/board/markread.html",
				{ id: t },
				this,
				function () {}
			);
		dojo.addClass("splash_trophy_" + t, "to_be_destroyed");
		this.fadeOutAndDestroy("splash_trophy_" + t);
		this.displayNextSplashNotif();
	}
	inactivityTimerIncrement() {
		this.browser_inactivity_time += 1;
		if (
			this.browser_inactivity_time > 120 &&
			Boolean(0) == this.bInactiveBrowser
		) {
			this.bInactiveBrowser = true;
			"undefined" != typeof bgaConfig &&
				bgaConfig.webrtcEnabled &&
				null !== this.room &&
				this.doLeaveRoom();
			if (this.socket) {
				this.socket.close();
				this.infoDialog(
					__(
						"lang_mainsite",
						"Please click the button below to continue."
					),
					__("lang_mainsite", "Are you still there?"),
					function () {
						window.location.reload();
					},
					true
				);
			}
		}
	}
	resetInactivityTimer() {
		this.browser_inactivity_time = 0;
	}
	onForceBrowserReload(t: BGA.Notif) {
		var i = Math.floor(Math.random() * t.args!['spread']);
		t.args!['immediate']
			? this.doForceBrowserReload(true)
			: setTimeout(
					dojo.hitch(this, "doForceBrowserReload"),
					1e3 * i
				);
	}
	doForceBrowserReload(e = false) {
		if (this.socket) {
			this.socket.close();
			if (e) {
				window.location.reload();
				return;
			}
			this.warningDialog(
				__(
					"lang_mainsite",
					"Due to a BGA upgrade, we have to ask you to reload this page to continue."
				),
				function () {
					window.location.reload();
				}
			);
		}
	}
	onDebugPing() {
		var e = "_";
		$("bga_release_id") &&
			(e = $("bga_release_id")!.innerHTML);
		this.ajaxcall(
			"/table/table/debugPing.html",
			{ bgaversion: e },
			this,
			function (e) {}
		);
	}
	onNewRequestToken(e: BGA.Notif) {
		undefined !== e.args!['request_token'] &&
			undefined !== bgaConfig.requestToken &&
			(bgaConfig.requestToken = e.args!['request_token']);
	}
	onDisplayDebugFunctions(e: Event) {
		e.preventDefault();
		document
			.getElementById("toggleDebugFunctionsPanel")!
			.classList.toggle("hidden");
		document
			.querySelectorAll<HTMLButtonElement>(
				".debug_function_button[data-parameters]"
			)
			.forEach((e) => {
				const t = e.dataset['name']!,
					i = JSON.parse(e.dataset['parameters']!);
				e.addEventListener("click", () => {
					i.length
						? this.showDebugParamsPopin(t, i)
						: this.triggerDebug(t, []);
				});
				e.removeAttribute("data-parameters");
			});
	}
	showDebugParamsPopin(e: string, t: any[]) {
		const i = new ebg.popindialog();
		i.create("debugParamDlg");
		i.setTitle(`${e} parameters`);
		var n =
			'<div style="display: grid; grid-template-columns: repeat(2, auto); gap: 10px;">';
		t.forEach((e) => {
			n += `<div>\n                        ${e.name}${
				e.type ? ` (${e.type})` : ""
			}\n                    </div>\n                    <div>\n                        <input type="${
				"bool" == e.type
					? "checkbox"
					: "int" == e.type
					? "number"
					: "text"
			}" id="debugParamDlg-parameter-${
				e.name
			}-input" value="${
				null !== e.defaultValue &&
				undefined !== e.defaultValue
					? e.defaultValue
					: ""
			}"${
				"bool" == e.type && e.defaultValue
					? ' checked="checked"'
					: ""
			} class="debugParamDlgParameter">`;
			if (
				"bool" != e.type &&
				e.name.toLowerCase().includes("player")
			) {
				n += "<div>";
				Object.values(this.gamedatas!.players).forEach(
					(t) =>
						(n += `<a href="#" onclick="document.getElementById('debugParamDlg-parameter-${e.name}-input').value = '${t.id}'; return false;">${t.name}</a> `)
				);
				n += "</div>";
			}
			n += "</div>";
		});
		n +=
			'</div><button type="button" id="debugParamDlgApply" class="bgabutton bgabutton_blue" style="width: auto;">Apply</button>';
		i.setContent(n);
		i.show();
		document.querySelector<HTMLElement>(".debugParamDlgParameter")!
			.focus();
		document.getElementById("debugParamDlgApply")!
			.addEventListener("click", (t) => {
				t.preventDefault();
				i.destroy();
				this.triggerDebug(
					e,
					Array.from(
						document.querySelectorAll<HTMLInputElement>(
							".debugParamDlgParameter"
						)
					).map((e) =>
						"checkbox" == e.type
							? e.checked
								? "1"
								: "0"
							: e.value
					)
				);
			});
	}
	triggerDebug(e: string, t: string[]) {
		const i = document.querySelector<HTMLInputElement>(".chatinput")!;
		i.value = `debug_${e}(${t.join(",")})`;
		i.dispatchEvent(
			new KeyboardEvent("keyup", { keyCode: 13 })
		);
	}
	onMuteSound(t = true) {
		if (String(1) == localStorage.getItem("sound_muted")) {
			soundManager.bMuteSound = true;
			if (null !== $("toggleSound_icon")) {
				dojo.removeClass(
					"toggleSound_icon",
					"fa-volume-up"
				);
				dojo.addClass("toggleSound_icon", "fa-volume-off");
			}
			null !== $("soundVolumeControl") &&
				($<HTMLInputElement>("soundVolumeControl")!.value = String(0));
		} else {
			soundManager.bMuteSound = false;
			if (null !== $("toggleSound_icon")) {
				dojo.addClass("toggleSound_icon", "fa-volume-up");
				dojo.removeClass(
					"toggleSound_icon",
					"fa-volume-off"
				);
			}
			null !== $("soundVolumeControl") &&
				($<HTMLInputElement>("soundVolumeControl")!.value =
					String(100 * soundManager.volume));
			t && playSound("tac");
		}
	}
	onSetSoundVolume(e = true) {
		var t = localStorage.getItem("sound_volume");
		soundManager.volume = Number(t) / 100;
		this.onMuteSound(e);
	}
	onToggleSound(e: Event) {
		e.preventDefault();
		svelte.stores.userVolume.update((e: any) => {
			e.volumeMuted = !e.volumeMuted;
			return e;
		});
	}
	onDisplaySoundControls(_: Event) {
		clearTimeout(this.hideSoundControlsTimer);
		this.displaySoundControlsTimer = setTimeout(
			dojo.hitch(this, "displaySoundControls"),
			200
		);
	}
	displaySoundControls(_: Event) {
		dojo.hasClass("soundControls", "soundControlsHidden") &&
			dojo.removeClass(
				"soundControls",
				"soundControlsHidden"
			);
	}
	onHideSoundControls(_: Event) {
		clearTimeout(this.displaySoundControlsTimer);
		this.hideSoundControlsTimer = setTimeout(
			dojo.hitch(this, "hideSoundControls"),
			200
		);
	}
	hideSoundControls() {
		null === $("soundControls") ||
			dojo.hasClass(
				"soundControls",
				"stickySoundControls"
			) ||
			dojo.hasClass(
				"soundControls",
				"soundControlsHidden"
			) ||
			dojo.addClass("soundControls", "soundControlsHidden");
	}
	onStickSoundControls(_: Event) {
		clearTimeout(this.hideSoundControlsTimer);
	}
	onUnstickSoundControls(event: Event) {
		this.onHideSoundControls(event);
	}
	onSoundVolumeControl(_: Event) {
		if (null !== $("soundVolumeControl")) {
			var t = $<HTMLInputElement>("soundVolumeControl")!.value;
			$<HTMLInputElement>("soundVolumeControl")!.blur();
			svelte.stores.userVolume.update((e: any) => {
				e.volume = +t;
				return e;
			});
		}
	}
	displayRatingContent(t: 'video' | 'audio' | 'support' | 'game', i: this['playerRating']) {
		this.rating_step1 = new ebg.popindialog();
		this.rating_step1.create("rating_step1");
		"video" == t
			? this.rating_step1.setTitle(
					__(
						"lang_mainsite",
						"Rate this BGA video chat"
					)
				)
			: "audio" == t
			? this.rating_step1.setTitle(
					__(
						"lang_mainsite",
						"Rate this BGA audio chat"
					)
				)
			: "support" == t
			? this.rating_step1.setTitle(
					__(
						"lang_mainsite",
						"Rate your conversation with BGA"
					)
				)
			: this.rating_step1.setTitle(
					__(
						"lang_mainsite",
						"Rate this BGA game adaptation"
					)
				);
		this.playerRating = i!;
		var n = "<div id='rating_step1'>";
		n += '<div class="stars_list">';
		if ("support" == t) {
			n +=
				'<a href="#" id="rating_1" class="fa fa-5x rating_star">&#128544;</a> ';
			n +=
				'<a href="#" id="rating_2" class="fa fa-5x rating_star">&#128577;</a> ';
			n +=
				'<a href="#" id="rating_3" class="fa fa-5x rating_star">&#128528;</a> ';
			n +=
				'<a href="#" id="rating_4" class="fa fa-5x rating_star">&#128515;</a> ';
			n +=
				'<a href="#" id="rating_5" class="fa fa-5x rating_star">&#129321;</a> ';
		} else
			for (var o = 1; o <= 5; o++)
				n +=
					'<i id="rating_' +
					o +
					'" class="fa fa-star-o fa-5x rating_star"></i>';
		n += "</div>";
		n += '<div id="rating_explanation">&nbsp;</div>';
		n += "<div id='rating_skip'>";
		n +=
			"support" == t
				? "<a href='#' class='bgabutton bgabutton_blue' id='confirm_rating'>" +
					__("lang_mainsite", "Confirm") +
					"</a>"
				: "<a href='#' class='bgabutton bgabutton_gray' id='skip_rating'>" +
					__("lang_mainsite", "Skip") +
					"</a>";
		n += "</div>";
		n += "</div>";
		this.rating_step1.setContent(n);
		this.rating_step1.show();
		var a: `on${'Video' | 'Audio' | 'Support' | 'Game'}RatingEnter` =
			"video" === t ? "onVideoRatingEnter"
			: "audio" === t ? "onAudioRatingEnter"
			: "support" === t ? "onSupportRatingEnter"
			: "onGameRatingEnter";
		if ("support" !== t) {
			dojo.query<HTMLElement>(".rating_star").connect(
				"onmouseenter",
				this,
				a
			);
			dojo.query<HTMLElement>(".rating_star").connect(
				"onmouseleave",
				this,
				"onRatingLeave"
			);
		}
		var s: `on${'Video' | 'Audio' | 'Support' | 'Game'}RatingClick` = "onGameRatingClick";
		"audio" === t
			? (s = "onAudioRatingClick")
			: "video" === t
			? (s = "onVideoRatingClick")
			: "support" === t && (s = "onSupportRatingClick");
		dojo.query<HTMLElement>(".rating_star").connect("onclick", this, s);
		if ("support" == t) {
			this.processRatingEnter(
				this.playerRating!.rating!,
				"support"
			);
			dojo.connect(
				$("confirm_rating")!,
				"onclick",
				this,
				function () {
					this.rating_step1!.hide();
					this.sendRating(t);
					this.showMessage(
						_(
							"Thanks for your feeback! Let's go back to games!"
						),
						"info"
					);
					gotourl("welcome");
				}
			);
		} else
			dojo.connect(
				$("skip_rating")!,
				"onclick",
				this,
				function () {
					this.rating_step1!.hide();
					this.sendRating(t);
				}
			);
	}
	sendRating(e: 'video' | 'audio' | 'support' | 'game') {
		var t: '/table/table/rateGame.html' | '/videochat/videochat/rateChat.html' | '/support/support/rateSupport.html'
			= "/table/table/rateGame.html";
		if ("audio" == e || "video" == e) {
			this.mediaChatRating = false;
			t = "/videochat/videochat/rateChat.html";
		}
		"support" == e &&
			(t = "/support/support/rateSupport.html");
		this.ajaxcall(
			t,
			this.playerRating!,
			this,
			function (e) {}
		);
	}
	onGameRatingEnter(e: Event) {
		var t = (e.currentTarget as Element).id.substr(7) as BGA.ID;
		this.processRatingEnter(t, "game");
	}
	onVideoRatingEnter(e: Event) {
		var t = (e.currentTarget as Element).id.substr(7) as BGA.ID;
		this.processRatingEnter(t, "video");
	}
	onAudioRatingEnter(e: Event) {
		var t = (e.currentTarget as Element).id.substr(7) as BGA.ID;
		this.processRatingEnter(t, "audio");
	}
	onSupportRatingEnter(e: Event) {
		var t = (e.currentTarget as Element).id.substr(7) as BGA.ID;
		this.processRatingEnter(t, "support");
	}
	processRatingEnter(rating: BGA.ID, type: 'video' | 'audio' | 'support' | 'game') {
		if ("support" == type) {
			dojo.query(".rating_star").style("opacity", "0.5");
			dojo.style("rating_" + rating, "opacity", "1");
		} else {
			for (var n = 1; n <= Number(rating); n++) {
				dojo.removeClass("rating_" + n, "fa-star-o");
				dojo.addClass("rating_" + n, "fa-star");
			}
			for (; n <= 5; n++) {
				dojo.removeClass("rating_" + n, "fa-star");
				dojo.addClass("rating_" + n, "fa-star-o");
			}
		}
		if (1 == toint(rating)) {
			"game" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The game adaptation is unplayable"
				));
			"video" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The video chat is unusable"
				));
			"audio" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The audio chat is unusable"
				));
			"support" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"My experience has been bad. BGA should do better."
				));
		} else if (2 == toint(rating)) {
			"game" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"I can play but there are some major problems"
				));
			"video" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"I can use the video chat but there are some major problems"
				));
			"audio" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"I can use the audio chat but there are some major problems"
				));
			"support" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"I am disappointed, I expected a better support."
				));
		} else if (3 == toint(rating)) {
			"game" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"Acceptable but could be way better"
				));
			"video" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"Acceptable but could be way better"
				));
			"audio" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"Acceptable but could be way better"
				));
			"support" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"My experience has been standard. Nothing special."
				));
		} else if (4 == toint(rating)) {
			"game" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The game adaptation is good, but some details must be fixed"
				));
			"video" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The video chat is good, but some minor issues should be fixed"
				));
			"audio" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The audio chat is good, but some minor issues should be fixed"
				));
			"support" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"Really good experience, thank you!"
				));
		} else if (5 == toint(rating)) {
			"game" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The game adaptation is PERFECT"
				));
			"video" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The video chat is EXCELLENT"
				));
			"audio" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"The audio chat is EXCELLENT"
				));
			"support" == type &&
				($("rating_explanation")!.innerHTML = __(
					"lang_mainsite",
					"My experience has been stellar! A big hug to the team!"
				));
		}
	}
	onRatingLeave(t: Event) {
		(t.currentTarget as Element).id.substr(11);
		for (var i = 1; i <= 5; i++) {
			dojo.removeClass("rating_" + i, "fa-star");
			dojo.addClass("rating_" + i, "fa-star-o");
		}
		$("rating_explanation")!.innerHTML = "&nbsp;";
	}
	onVideoRatingClick(e: Event) {
		this.completeRatingClick(e, "video");
	}
	onAudioRatingClick(e: Event) {
		this.completeRatingClick(e, "audio");
	}
	onGameRatingClick(e: Event) {
		this.completeRatingClick(e, "game");
	}
	onSupportRatingClick(e: Event) {
		var t = (e.currentTarget as Element).id.substr(7) as BGA.ID;
		this.playerRating!.rating = t;
		this.processRatingEnter(t, "support");
	}
	completeRatingClick(e: Event, t: 'video' | 'audio' | 'support' | 'game') {
		(e.currentTarget as Element).id.substr(7);
		var i = (e.currentTarget as Element).id.substr(7) as BGA.ID;
		this.playerRating!.rating = i;
		this.sendRating(t);
		this.rating_step1!.hide();
		5 == i
			? "game" === t
				? this.gamecanapprove
					? this.showGameRatingDialog_step4()
					: this.gameisalpha
					? this.showMessage(
							_("Thanks for your feedback!"),
							"info"
						)
					: this.showRatingDialog_step3(t)
				: this.showMessage(
						_("Thanks for your feedback!"),
						"info"
					)
			: this.showRatingDialog_step2(t);
	}
	showRatingDialog_step2(t: 'video' | 'audio' | 'support' | 'game') {
		this.rating_step2 = new ebg.popindialog();
		this.rating_step2.create("rating_step2");
		this.rating_step2.setTitle(
			__(
				"lang_mainsite",
				"What is the main thing we must improve?"
			)
		);
		var i = "<div id='rating_step2'>";
		if ("game" == t) {
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_bugs'><i class='fa fa-bug'></i> " +
				__("lang_mainsite", "Fix the bugs!") +
				"</a></p>";
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_ux'><i class='fa fa fa-hand-o-up'></i> " +
				__("lang_mainsite", "Improve the interface") +
				"</a></p>";
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_expansion'><i class='fa fa fa-puzzle-piece'></i> " +
				__("lang_mainsite", "Add game expansions") +
				"</a></p>";
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_dislike'><i class='fa fa fa-meh-o'></i> " +
				__(
					"lang_mainsite",
					"Nothing: I just dislike the game itself"
				) +
				"</a></p>";
		}
		if ("audio" == t || "video" == t) {
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_quality'><i class='fa fa-bar-chart'></i> " +
				__(
					"lang_mainsite",
					"Audio or video quality could be better"
				) +
				"</a></p>";
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_ux'><i class='fa fa fa-hand-o-up'></i> " +
				__("lang_mainsite", "Improve the interface") +
				"</a></p>";
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_someonemissing'><i class='fa fa-user-times'></i> " +
				__(
					"lang_mainsite",
					"It worked but someone was missing"
				) +
				"</a></p>";
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_didntwork'><i class='fa fa fa-bug'></i> " +
				__(
					"lang_mainsite",
					"Sorry, it didn't work at all"
				) +
				"</a></p>";
			i +=
				"<p class='issue_wrap'><a href='#' class='rating_issue bgabutton bgabutton_gray' id='issue_dislike'><i class='fa fa fa-meh-o'></i> " +
				__(
					"lang_mainsite",
					"Nothing: I just disliked the experience"
				) +
				"</a></p>";
		}
		i += "<div id='rating_skip'>";
		i +=
			"<a href='#' class='bgabutton bgabutton_gray' id='skip_rating_2'>" +
			__("lang_mainsite", "Skip") +
			"</a>";
		i += "</div>";
		i += "</div>";
		this.rating_step2.setContent(i);
		this.rating_step2.show();
		var n: `on${'Video' | 'Audio' | 'Support' | 'Game'}RatingClickIssue`
		 = "onGameRatingClickIssue";
		"audio" === t
			? (n = "onAudioRatingClickIssue")
			: "video" === t && (n = "onVideoRatingClickIssue");
		dojo.query<HTMLElement>(".rating_issue").connect("onclick", this, n);
		dojo.connect(
			$("skip_rating_2")!,
			"onclick",
			this,
			function () {
				this.rating_step2!.hide();
				this.sendRating(t);
				"game" === t
					? this.showMessage(
							_(
								"Thanks for helping us to make this game adaptation better!"
							),
							"info"
						)
					: this.showMessage(
							_(
								"Thanks for helping us to make the audio/video chat better!"
							),
							"info"
						);
			}
		);
	}
	onAudioRatingClickIssue(e: Event) {
		this.completeRatingClickIssue(e, "audio");
	}
	onVideoRatingClickIssue(e: Event) {
		this.completeRatingClickIssue(e, "video");
	}
	onGameRatingClickIssue(e: Event) {
		this.completeRatingClickIssue(e, "game");
	}
	completeRatingClickIssue(e: Event, t: 'video' | 'audio' | 'support' | 'game') {
		var i = (e.currentTarget as Element).id.substr(6);
		this.playerRating!.issue = i;
		this.sendRating(t);
		this.rating_step2!.hide();
		"game" == t
			? this.showRatingDialog_step3(t)
			: this.showMessage(
					_("Thanks for your feedback!"),
					"info"
				);
	}
	showRatingDialog_step3(t: 'video' | 'audio' | 'support' | 'game') {
		this.rating_step3 = new ebg.popindialog();
		this.rating_step3.create("rating_step3");
		"support" === t
			? this.rating_step3.setTitle(
					__(
						"lang_mainsite",
						"One last thing: any message for our team?"
					)
				)
			: "game" == t && this.gameisalpha
			? this.rating_step3.setTitle(
					__(
						"lang_mainsite",
						"Do you have any other feedback to give?"
					)
				)
			: this.rating_step3.setTitle(
					__(
						"lang_mainsite",
						"One last thing: any message for the developer?"
					)
				);
		var i = "<div id='rating_step3'>";
		if ("game" == t && this.gameisalpha) {
			i += "<div style='text-align:center'>";
			i += "<br />";
			i += __(
				"lang_mainsite",
				"Did you run into an issue while playing?"
			);
			i += "<br />";
			i +=
				"<a href='/bug?id=0&table=" +
				this.table_id +
				"' class='bgabutton bgabutton_blue'>" +
				__("lang_mainsite", "Report a bug") +
				"</a>";
			i += "<br />";
			i += __(
				"lang_mainsite",
				"Do you have an idea to improve the adaptation?"
			);
			i += "<br />";
			i +=
				"<a href='/bug?id=0&table=" +
				this.table_id +
				"&suggest' class='bgabutton bgabutton_blue'>" +
				__("lang_mainsite", "Make a suggestion") +
				"</a>";
			i += "<br />";
			if ("" != this.game_group) {
				i += __(
					"lang_mainsite",
					"Or you would like to discuss something with the community?"
				);
				i += "<br />";
				i +=
					"<a href='/group?id=" +
					this.game_group +
					"' class='bgabutton bgabutton_blue'>" +
					__(
						"lang_mainsite",
						"Discuss with the group"
					) +
					"</a>";
				i += "<br />";
			}
			i += "</div>";
		} else {
			i +=
				"<p><textarea id='rating_comment'></textarea></p>";
			i += "<div style='text-align:center'>";
			i +=
				"<a href='#' class='bgabutton bgabutton_blue' id='rating_post_comment'>" +
				__("lang_mainsite", "Send message") +
				"</a>";
			i += "</div>";
		}
		i += "<div id='rating_skip'>";
		i +=
			"<a href='#' class='bgabutton bgabutton_gray' id='skip_rating_3'>" +
			__("lang_mainsite", "Skip") +
			"</a>";
		i += "</div>";
		if ("game" == t && !this.gameisalpha) {
			i += "<div id='rating_alternative'>";
			i += __(
				"lang_mainsite",
				"You may alternatively want to <a href='%s'>report a bug</a>"
			).replace("%s", "/bug?id=0&table=" + this.table_id);
			i += "</div>";
		}
		i += "</div>";
		this.rating_step3.setContent(i);
		this.rating_step3.show();
		var n = __(
			"lang_mainsite",
			"Thanks for helping us to make this game adaptation better!"
		);
		("audio" != t && "video" != t) ||
			(n = __(
				"lang_mainsite",
				"Thanks for helping us to make the audio/video chat better!"
			));
		"support" == t &&
			(n = __(
				"lang_mainsite",
				"Thanks for helping us to improve our player support!"
			));
		null !== $("rating_post_comment") &&
			dojo.connect(
				$("rating_post_comment")!,
				"onclick",
				this,
				function () {
					this.playerRating!.text = $<HTMLInputElement>("rating_comment")!.value;
					this.rating_step3!.hide();
					this.sendRating(t);
					this.showMessage(_(n), "info");
				}
			);
		null !== $("skip_rating_3") &&
			dojo.connect(
				$("skip_rating_3")!,
				"onclick",
				this,
				function () {
					this.rating_step3!.hide();
					this.sendRating(t);
					this.showMessage(_(n), "info");
				}
			);
	}
	showGameRatingDialog_step4() {
		this.rating_step4 = new ebg.popindialog();
		this.rating_step4.create("rating_step4");
		this.rating_step4.setTitle(
			__("lang_mainsite", "You are a reviewer!")
		);
		var t = "<div id='rating_step4'>";
		t +=
			"<p>" +
			__(
				"lang_mainsite",
				"You have given a 5 star rating. Do you want to approve this game for beta?"
			) +
			"</p>";
		t += "<div style='text-align:center'>";
		t +=
			"<a href='#' class='bgabutton bgabutton_blue' id='rating_go_approve'>" +
			__("lang_mainsite", "Ok, let's go!") +
			"</a>";
		t += "</div>";
		t += "<div id='rating_skip'>";
		t +=
			"<a href='#' class='bgabutton bgabutton_gray' id='skip_rating_4'>" +
			__("lang_mainsite", "Skip") +
			"</a>";
		t += "</div>";
		t += "</div>";
		this.rating_step4.setContent(t);
		this.rating_step4.show();
		dojo.connect(
			$("rating_go_approve")!,
			"onclick",
			this,
			function () {
				this.rating_step4!.hide();
				window.location = "/reviewer?game=" + this.game_name + "&approve" as any;
			}
		);
		dojo.connect(
			$("skip_rating_4")!,
			"onclick",
			this,
			function () {
				this.rating_step4!.hide();
				this.showRatingDialog_step3("game");
			}
		);
	}
	recordMediaStats(e: BGA.ID, t: "start" | "stop") {
		this.room &&
			this.ajaxcall(
				"/videochat/videochat/recordStat.html",
				{
					player: e,
					room: this.room,
					startStop: t,
					media: this.mediaConstraints.video
						? "video"
						: "audio",
				},
				this,
				function (e) {},
				function (e) {}
			);
	}
}

let SiteCore = declare("ebg.core.sitecore", [ebg.core.core, SiteCore_Template]);
export = SiteCore;

declare global {
	
	namespace BGA {
		type SiteCore = typeof SiteCore;
		interface EBG_CORE { sitecore: SiteCore; }
		interface EBG { core: EBG_CORE; }
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
	}

	/** A global variable caused by bad code in ebg/core/sitecore:changeActiveMenuItem. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var menu_label_mappings: BGA.SiteCoreMenuLabelMappings;

	/** A global variable caused by bad code in ebg/core/sitecore:createChatBarWindow. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var bDisplayPreview: boolean;

	/** A global variable caused by bad code in ebg/core/sitecore:stackChatWindowsIfNeeded. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var save_spaces_nbr: null;

	var splashedNotifications_overlay: undefined | string | Node;
}