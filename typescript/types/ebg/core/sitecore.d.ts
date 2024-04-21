import "dojo";
import "dojo/_base/declare";
import "svelte/index";
import "dojo/has";
import CoreCore = require("ebg/core/core");
import "ebg/core/soundManager";
import "dijit/form/Select";
import "dijit/TooltipDialog";
import "dojox/dtl/filter/htmlstrings";
import GameNotif = require("ebg/gamenotif");
import ChatInput = require("ebg/chatinput");
import "ebg/thumb";

/** Partial: This has been partially typed based on a subset of the BGA source code. */
declare class SiteCore extends CoreCore
{
	/** The component used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
	notifqueue: GameNotif;

	/** Represents if the devices is a touch device. This is true if this devices has an 'ontouchstart' event on the window, or the navigator has a positive 'maxTouchPoints' value. */
	isTouchDevice: boolean;

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
	 * showMessage: function (msg, type) {
	 * 	if (type == "error" && msg && msg.includes("!!!club!!!")) {
	 * 		msg = msg.replace("!!!club!!!", this.getTokenDiv("club")); 
	 * 		//return; // suppress red banner and gamelog message
	 * 	}
	 * 	this.inherited(arguments);
	 * },
	 */
	showMessage(message: string, type: 'info' | 'error' | 'only_to_log' | string): void;


	//#region Internal

	/** Internal. An internal count to track the number of ajax calls made. */
	ajaxcall_running: number;
	/** Internal. The current active menu label type. This is updated by using that {@link changeActiveMenuItem} function. This is used to remember the previous pick for cleanup before changing. */
	active_menu_label: 'welcome' | 'lobby' | 'gamelobby' | 'gamelist' | 'community' | 'premium' | 'shop' | 'shopsupport' | 'competition' | 'doc' | 'headlines' | 'events' | 'controlpanel' | 'projects' | 'halloffame' | '';
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
	chatbarWindows: Record<ChannelInfos['window_id'], ChatWindowMetadata>;
	/** Internal. The js template for a chatwindow. Note that this is left as a string literal for convenience but may have been changed. */
	jstpl_chatwindow: '<div id="chatwindow_${id}" class="chatwindow chatwindowtype_${type}"><div id="chatwindowexpanded_${id}" class="chatwindowexpanded"><div class="dropshadow"></div><div id="chatbarinput_${id}" class="chatbarinput"></div><div id="chatbarbelowinput_${id}" class="chatbarbelowinput"><div id="chatbarinput_stopnotif_${id}" class="chatbarinput_stopnotif"><input type="checkbox" checked="checked" id="chatbarinput_stopnotif_box_${id}" /><span id="chatbarinput_stopnotif_label_${id}">${stop_notif_label}</span></div><div id="chatbarinput_startaudiochat_${id}" class="chatwindow_startaudiochat chatbarbelowinput_item audiovideo_inactive"><i class="fa fa-microphone"></i></div><div id="chatbarinput_startvideochat_${id}" class="chatwindow_startvideochat chatbarbelowinput_item audiovideo_inactive"><i class="fa fa-video-camera"></i></div><div id="chatbarinput_predefined_${id}" class="chatbarbelowinput_item"><div class="chatbarinput_predefined icon20 icon20_meeple_wb"></div></div><div id="chatbarinput_showcursor_${id}" class="chatbarbelowinput_item chatbarbelowinput_item_showcursor"><i class="fa fa-hand-pointer-o"></i></div><div id="chatbar_startchat_${id}" class="chatbar_startchat"><a class="bgabutton bgabutton_blue" id="startchat_accept_${id}">${start_chat}</a><br /><a class="bgabutton bgabutton_red" id="startchat_block_${id}">${block_chat}</a></div></div><div id="chatwindowlogs_${id}" class="chatwindowlogs"><div id="chatwindowlogstitlebar_${id}" class="chatwindowlogstitlebar"><div class="chatwindowlogstitle" id="chatwindowlogstitle_${id}"><span id="is_writing_now_title_${id}" class="is_writing_now"><i class="fa fa-pencil fa-blink"></i>&nbsp;<span id="is_writing_now_expl_title_${id}" class="is_writing_now_expl"></span></span><span id="chatwindowlogstitle_content_${id}">${title}</span></div><div id="chatwindowicon_${id}" class="chatwindowicon"><div class="avatarwrap emblemwrap">${avatar}</div></div><div id="chatwindowcollapse_${id}" class="chatwindowcollapse icon20 icon20_collapse_white"></div><div id="chatwindowremove_${id}" class="chatwindowremove icon20 icon20_remove_white"></div></div><div id="chatwindowlogs_zone_${id}" class="chatwindowlogs_zone"><div id="chatwindowlogs_endzone_${id}" class="chatwindowlogs_endzone"></div></div><div id="chatwindowmorelogs_${id}" class="chatwindowmorelogs roundedbox"><a class="bga-link" id="chatwindowmorelogslink_${id}" href="#">${more_logs_label}</a></div></div></div><div id="chatwindowpreview_${id}" class="chatwindowpreview"></div><div id="chatwindowcollapsed_${id}" class="chatwindowcollapsed"><div class="chatwindowcollapsedtitle"><span id="chatwindownewmsgcount_${id}" class="chatwindownewmsgcount"></span><span id="is_writing_now_${id}" class="is_writing_now"><i class="fa fa-pencil fa-blink"></i>&nbsp;<span id="is_writing_now_expl_${id}" class="is_writing_now_expl"></span></span><span id="chatwindowtitlenolink_${id}">${titlenolink}</span></div><div id="chatwindowremovc_${id}" class="chatwindowremovec icon20 icon20_remove"></div><div class="chatwindowavatar"><div class="avatarwrap emblemwrap emblemwrap_l">${avatar}</div><div id="chatMindownewmsgcount_${id}" class="chatwindownewmsgcount chatMindownewmsgcount"></div><i class="bubblecaret fa fa-caret-up"></i></div></div></div>';

	/** Internal. */
	dockedChat: boolean;
	/** Internal. */
	dockedChatInitialized: boolean;
	/** Internal. */
	groupToCometdSubs: Record<string, `/group/g${number}`>;
	/** Internal. */
	window_visibility: 'visible' | 'hidden';
	/** Internal. Translated string representing the button to send the user to the audio/video call feature. */
	premiumMsgAudioVideo: string;
	/** Internal. List of bad words that should be filtered.*/
	badWordList: ["youporn", "redtube", "pornotube", "pornhub", "xtube", "a-hole", "dumb", "fool", "imbecile", "nutcase", "dipstick", "lunatic", "weirdo", "dork", "dope", "dimwit", "half-wit", "oaf", "bimbo", "jerk", "numskull", "numbskull", "goof", "suck", "moron", "morons", "idiot", "idi0t", "rape", "rapist", "hitler", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck ", "cocksucked ", "cocksucker", "cocksucking", "cocksucks ", "cocksuka", "cocksukka", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick ", "cuntlicker ", "cuntlicking ", "cunts", "cyalis", "cyberfuc", "cyberfuck ", "cyberfucked ", "cyberfucker", "cyberfuckers", "cyberfucking ", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates ", "ejaculating ", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck ", "fingerfucked ", "fingerfucker ", "fingerfuckers", "fingerfucking ", "fingerfucks ", "fistfuck", "fistfucked ", "fistfucker ", "fistfuckers ", "fistfucking ", "fistfuckings ", "fistfucks ", "flange", "fook", "fooker", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckings", "fuckingshitmotherfucker", "fuckme ", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged ", "gangbangs ", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex ", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off ", "jackoff", "jap", "jerk-off ", "jism", "jiz ", "jizm ", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lmfao", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked ", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking ", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers ", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim ", "orgasims ", "orgasm", "orgasms ", "p0rn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses ", "pissflaps", "pissin ", "pissing", "pissoff ", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks ", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys ", "rectum", "retards", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters ", "shitting", "shittings", "shitty ", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "enculé", "baiser", "nique", "niquer", "salope", "pute", "fuck", "f*ck", "f**k", "noob"];
	/** Internal. */
	tutorialHighlightedQueue: {id: number, text: string, optclass: string}[];
	/** Internal. The amount of time in seconds that the user has been inactive on this page. Once this reaches 2 minutes, a message will popup as an infoDialog. */
	browser_inactivity_time: number;
	/** Internal. If {@link browser_inactivity_time} has reached 2 minutes and a message has been displayed. */
	bInactiveBrowser: boolean;
	/** Internal. @deprecated This is not used within the main code file anymore. */
	red_thumbs_given: {};
	/** Internal. @deprecated This is not used within the main code file anymore. */
	red_thumbs_taken: {};
	/** Internal. If truthy, this represents the detached chat for the page. */
	chatDetached?: false | { type: 'table' | 'player' | 'chat' | 'general' | 'group', id: number, chatname: string };
	/** Internal. Set to true when there is currently a detached chat on the page. */
	bChatDetached?: boolean;
	/** Internal. Record of non translated quick chat messages. This is fully listed for convenience, but may not represent updated values. */
	predefinedTextMessages: {
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
	/** Internal. Inverse lookup for the {@link predefinedTextMessages} */
	predefinedTextMessages_untranslated: {
		[P in keyof SiteCore['predefinedTextMessages'] as SiteCore['predefinedTextMessages'][P]]: P
	}
	/** Internal. The translated version of the {@link predefinedTextMessages} */
	predefinedTextMessages_target_translation: Record<keyof SiteCore['predefinedTextMessages'], string>;
	/** Internal. The difference between new Data and 'servivetime'.innerHTML in minutes. This is always a positive number. */
	timezoneDelta: number;
	/** Internal. Partial: This has been partially typed based on a subset of the BGA source code. */
	bgaUniversalModals: any;
	/** Internal. Partial: This has been partially typed based on a subset of the BGA source code. */
	bgaToastHolder: any;
	/** Internal. If 'show', scripting errors passed to {@link onScriptError} will be displayed in a red message on the top part of the bage for 6 seconds. */
	reportJsError?: boolean | 'show';
	/** Internal. WIP */
	discussblock: boolean;
	/** Internal. WIP */
	autoChatWhilePressingKey: boolean;
	/** Internal. WIP */
	groupList: (1 | null)[];
	/** Internal. WIP */
	allGroupList: any;
	/** Internal. WIP */
	allLanguagesList: any;
	/** Internal. WIP */
	pma: any;
	/** Internal. WIP */
	rtc_room: any;

	/** Internal. Initializes functionality and fields related to {@link SiteCore}, such as volume listeners and inactivity timers. This should be called manually by subclasses during there initializer functions (i.e, {@link MainSite.create} and {@link Gamegui.completesetup}). */
	init_core(): void;

	/** Internal. Sets the {@link page_is_unloading} property to true and calls {@link recordMediaStats} with `'stop'`. This is triggered by {@link dojo._base.unload}. */
	unload(): void;

	/** Internal. Sets the 'svelte/index' modules menu states page loading status. This is set to true if there are any {@link ajaxcall_running}. */
	updateAjaxCallStatus(): void;

	/** Internal. Sets the active menu label and page name based on the key given. */
	changeActiveMenuItem(key: 'welcome' | 'playernotif' | 'welcomestudio' | 'start' | 'legal' | 'message' | 'gameinprogress' | 'table' | 'lobby' | 'meetinglobby' | 'availableplayers' | 'createtable' | 'newtable' | 'gamereview' | 'gamelobby' | 'gamelobbyauto' | 'tournament' | 'newtournament' | 'tournamentlist' | 'gamepanel' | 'games' | 'player' | 'playerstat' | 'group' | 'newgroup' | 'community' | 'report' | 'newreport' | 'moderated' | 'translation' | 'translationhq' | 'map' | 'grouplist' | 'contribute' | 'sponsorship' | 'moderator' | 'bug' | 'bugs' | 'faq' | 'gamepublishers' | 'team' | 'troubleshootmainsite' | 'sandbox' | 'penalty' | 'karmalimit' | 'club' | 'premium' | 'contact' | 'reviewer' | 'giftcodes' | 'shop' | 'shopsupport' | 'prestige' | 'gameranking' | 'award' | 'gamestats' | 'leaderboard' | 'page' | 'news' | 'event' | 'eventnew' | 'eventmodify' | 'controlpanel' | 'linkmoderation' | 'moderation' | 'studio' | 'studiogame' | 'administration' | 'banners' | 'projects' | 'startwannaplay' | 'startsteps' | 'halloffame'): SiteCore['active_menu_label'];

	/** Internal. If the current cometd_service is 'socketio', then event is added to the socket using `.emit("join")` and keyed into the {@link cometd_subscriptions}. */
	subscribeCometdChannel(event: string, _1?: any, _2?: any): void;

	/** Internal. If the current cometd_service is 'socketio', then the events are added to the socket using `.emit("join")` and keyed into the {@link cometd_subscriptions}. */
	subscribeCometdChannels(events: string[], _1?: any, _2?: any): void;

	/** Internal. Unsubscribes a single listener to the given event. If there are no more listeners for that event, then the listener is removed from the socket using `.emit("leave")`. */
	unsubscribeCometdChannel(event: string): void;

	/** Internal. For all keys in {@link cometd_subscriptions}, the event will be rejoined if needed using `.emit("join"). */
	reconnectAllSubscriptions(): void;

	/** Internal. Callback for when the socket io connection changes. This updates the connect status and posts notifications if needed. */
	onSocketIoConnectionStatusChanged(status: 'connect' | 'connect_error' | 'connect_timeout' | 'reconnect' | 'reconnect_failed' | 'reconnect_attempt' | string, error: string): void;

	/** Internal. A noop placeholder. */
	onFirstConnectedToComet(): void;

	/** Internal. Preforms an {@link ajaxcall} for leaving a table and shows a confirmation popin if necessary (depending on the game's state). */
	leaveTable(table_id: number, success_callback: () => void): void;

	/** Internal. Increases the logs element max height by 600px. */
	onSeeMoreLogs(event: Event): void;

	/** Internal. A noop placeholder for when {@link onSeeMoreLogs} is called. */
	onIncreaseContentHeight(): void;

	/** Internal. Assuming the pase is not currently unloading, this will print the error, url, and line of a script error to the console and show a message in red on the page labeled `Javascript error: ...`. This is directly hooked into the window.onerror property and called manually within a few catch statements. */
	onScriptError(error: ErrorEvent | string, url: string, line: number): void;

	/** Internal. Initializes the docked chat. This uses {@link jstpl_chatwindow} to create the visible DOM element. */
	initChatDockedSystem(): void;

	/** Internal. Returns a {@link ChannelInfos} object containting channel information of a {@link Notif}. Expects a {@link NotifFrom}<{@link ChatNotifArgs}>, and will return null if the {@link Notif.channelorig} does not match as {@link ChannelInfos.channel} */
	extractChannelInfosFromNotif(notif: Notif): ChannelInfos | null;

	/** Internal. Returns a {@link ChatNotifArgs} with extra information about creating a chat message window. */
	getChatInputArgs(channel: ChannelInfos): ChatInputArgs;

	/** Internal. Passed to the {@link notifqueue}'s {@link GameNotif.onPlaceLogOnChannel}, used for logging messages onto a channel (chat window + extra). */
	onPlaceLogOnChannel(chatnotif: NotifFrom<ChatNotifArgs | 'newRTCMode'>): void;

	/** Internal. Updates the writing bubble status on the given chat window. */
	onUpdateIsWritingStatus(window_id: ChannelInfos['window_id']): void;

	/**
	 * Internal. If the {@link dockedChatInitialized} is false or the window matching the channel infos exists, this will return false. Otherwise, the DOM element matching the channel infos will be created.
	 * @param channel The channel information to create the chat bar window for.
	 * @param subscribe Overrides the {@link ChannelInfos.subscribe} value.
	 * @returns True if the chat bar window was created, false otherwise.
	 */
	createChatBarWindow(channel: ChannelInfos, subscribe?: boolean): boolean;

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
	setAVFrequencyLimitation(): void;;

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
	setNewRTCMode(table_id: number | null, target_player_id: number | null, rtc_id: number | 0, connecting_player_id?: number): void;

	/** Internal. Button Event. Calls {@link loadPreviousMessage} based on the current target's id. */
	onLoadPreviousMessages(event: Event): void;
	onLoadPreviousMessages(args: {type: string, id: number, status?: 'underage' | 'admin' | 'newchat' | 'newchattoconfirm' | string, history: { time: number, mread?: boolean; }[] }): void;

	/** Internal. Gets the chatHistory for a table based on the arguments. The {@link ajaxcall} will callback to {@link onLoadPreviousMessages} */
	loadPreviousMessage(type: string, id: number): void;

	/** Internal. Chat Window Helper. */
	stackOrUnstackIfNeeded(): void;
	/** Internal. Chat Window Helper. */
	onUnstackChatWindow(event: Event): void;
	/** Internal. Chat Window Helper. */
	unstackChatWindow(window_id: ChannelInfos['window_id'], state: ChannelInfos['start'] | 'automatic'): void;
	/** Internal. Chat Window Helper. */
	stackChatWindowsIfNeeded(state: ChannelInfos['start']): void;
	/** Internal. Chat Window Helper. */
	stackOneChatWindow(): void;
	/** Internal. Chat Window Helper. */
	getNeededChatbarWidth(): number;
	/** Internal. Chat Window Helper. */
	adaptChatbarDock(): void;
	/** Internal. Chat Window Helper. */
	countStackedWindows(): number;
	/** Internal. Chat Window Helper. */
	closeChatWindow(window_id: ChannelInfos['window_id']): void;
	/** Internal. Chat Window Helper. */
	onCloseChatWindow(event: Event): void;
	/** Internal. Chat Window Helper. */
	onCollapseChatWindow(event: Event): void;
	/** Internal. Chat Window Helper. */
	collapseChatWindow(window_id: ChannelInfos['window_id'], checkBottom?: any): void;
	/** Internal. Chat Window Helper. */
	onExpandChatWindow(event: Event): void;
	/** Internal. Chat Window Helper. */
	onCollapseAllChatWindow(event: Event): void;
	/** Internal. Chat Window Helper. */
	updateChatBarStatus(): void;
	/** Internal. Chat Window Helper. */
	expandChatWindow(window_id: ChannelInfos['window_id'], autoCollapseAfterMessage?: boolean): void;
	/** Internal. Chat Window Helper. */
	makeSureChatBarIsOnTop(window_id: ChannelInfos['window_id']): void;
	/** Internal. Chat Window Helper. */
	makeSureChatBarIsOnBottom(window_id: ChannelInfos['window_id']): void;
	/** Internal. Chat Window Helper. */
	onScrollDown(event: Event): void;
	/** Internal. Chat Window Helper. */
	onToggleStackMenu(event: Event): void;
	/** Internal. Chat Window Helper. */
	onCallbackBeforeChat(args: any, channel_url: string): void;
	/** Internal. Chat Window Helper. */
	isBadWorkInChat(text?: string): boolean;
	/** Internal. Chat Window Helper. */
	onCallbackAfterChat(_1: any): void;
	/** Internal. Chat Window Helper. */
	callbackAfterChatError(args: any): void;
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
	setGroupList(groupList: SiteCore['groupList'], allGroupList?: SiteCore['allGroupList'], red_thumbs_given?: SiteCore['red_thumbs_given'], red_thumbs_taken?: SiteCore['red_thumbs_taken']): void;
	/** Internal. Updates the {@link allLanguagesList} property with the given value. */
	setAllLanguagesList(allLanguagesList: SiteCore['allLanguagesList']): void;
	/** Internal. Updates the {@link pma} property with the given value. */
	setPma(pma: SiteCore['pma']): void;
	/** Internal. Updates the {@link rtc_mode} and {@link rtc_room} property with the given values. */
	setRtcMode(rtc_mode: SiteCore['rtc_mode'], rtc_room: SiteCore['rtc_room']): void;
	/** Internal. WIP */
	takeIntoAccountAndroidIosRequestDesktopWebsite(): void;
	/** Internal. WIP */
	traceLoadingPerformances(): void;
	/** Returns the current player id. This returns the global {@link current_player_id} if defined, and {@link Gamegui.player_id} otherwise. */
	getCurrentPlayerId(): number;

	/** Internal. WIP */
	tutorialShowOnce(...args: any[]): any;
	/** Internal. WIP */
	highligthElementwaitForPopinToClose(...args: any[]): any;
	/** Internal. WIP */
	highlightElementTutorial(...args: any[]): any;
	/** Internal. WIP */
	onElementTutorialNext(...args: any[]): any;
	/** Internal. WIP */
	websiteWindowVisibilityChange(...args: any[]): any;
	/** Internal. WIP */
	ackUnreadMessage(...args: any[]): any;
	/** Internal. WIP */
	ackMessagesWithPlayer(...args: any[]): any;
	/** Internal. WIP */
	ackMessagesOnTable(...args: any[]): any;
	/** Internal. WIP */
	onAckMsg(...args: any[]): any;
	/** Internal. WIP */
	initMonitoringWindowVisibilityChange(...args: any[]): any;
	/** Internal. WIP */
	playingHoursToLocal(...args: any[]): any;
	/** Internal. WIP */
	showSplashedPlayerNotifications(...args: any[]): any;
	/** Internal. WIP */
	displayNextSplashNotif(...args: any[]): any;
	/** Internal. WIP */
	onNewsRead(...args: any[]): any;
	/** Internal. WIP */
	onDisplayNextSplashNotif(...args: any[]): any;
	/** Internal. WIP */
	inactivityTimerIncrement(...args: any[]): any;
	/** Internal. WIP */
	resetInactivityTimer(...args: any[]): any;
	/** Internal. WIP */
	onForceBrowserReload(...args: any[]): any;
	/** Internal. WIP */
	doForceBrowserReload(...args: any[]): any;
	/** Internal. WIP */
	onDebugPing(...args: any[]): any;
	/** Internal. WIP */
	onNewRequestToken(...args: any[]): any;
	/** Internal. WIP */
	onMuteSound(...args: any[]): any;
	/** Internal. WIP */
	onSetSoundVolume(...args: any[]): any;
	/** Internal. WIP */
	onToggleSound(...args: any[]): any;
	/** Internal. WIP */
	onDisplaySoundControls(...args: any[]): any;
	/** Internal. WIP */
	displaySoundControls(...args: any[]): any;
	/** Internal. WIP */
	onHideSoundControls(...args: any[]): any;
	/** Internal. WIP */
	hideSoundControls(...args: any[]): any;
	/** Internal. WIP */
	onStickSoundControls(...args: any[]): any;
	/** Internal. WIP */
	onUnstickSoundControls(...args: any[]): any;
	/** Internal. WIP */
	onSoundVolumeControl(...args: any[]): any;
	/** Internal. WIP */
	displayRatingContent(...args: any[]): any;
	/** Internal. WIP */
	sendRating(...args: any[]): any;
	/** Internal. WIP */
	onGameRatingEnter(...args: any[]): any;
	/** Internal. WIP */
	onVideoRatingEnter(...args: any[]): any;
	/** Internal. WIP */
	onAudioRatingEnter(...args: any[]): any;
	/** Internal. WIP */
	onSupportRatingEnter(...args: any[]): any;
	/** Internal. WIP */
	processRatingEnter(...args: any[]): any;
	/** Internal. WIP */
	onRatingLeave(...args: any[]): any;
	/** Internal. WIP */
	onVideoRatingClick(...args: any[]): any;
	/** Internal. WIP */
	onAudioRatingClick(...args: any[]): any;
	/** Internal. WIP */
	onGameRatingClick(...args: any[]): any;
	/** Internal. WIP */
	onSupportRatingClick(...args: any[]): any;
	/** Internal. WIP */
	completeRatingClick(...args: any[]): any;
	/** Internal. WIP */
	showRatingDialog_step2(...args: any[]): any;
	/** Internal. WIP */
	onAudioRatingClickIssue(...args: any[]): any;
	/** Internal. WIP */
	onVideoRatingClickIssue(...args: any[]): any;
	/** Internal. WIP */
	onGameRatingClickIssue(...args: any[]): any;
	/** Internal. WIP */
	completeRatingClickIssue(...args: any[]): any;
	/** Internal. WIP */
	showRatingDialog_step3(...args: any[]): any;
	/** Internal. WIP */
	showGameRatingDialog_step4(...args: any[]): any;
	/** Internal. WIP */
	recordMediaStats(...args: any[]): any;

	//#endregion

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<SiteCore>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<SiteCore>['createSubclass'];
}

declare global {
	/**The main site object that is currently running. This is the same as the {@link gameui} object when on a game page. */
	const g_sitecore: typeof SiteCore;

	interface EBG_CORE { sitecore: SiteCore; }
	interface EBG { core: EBG_CORE; }
	interface Window { ebg: EBG; }
}

export = SiteCore;