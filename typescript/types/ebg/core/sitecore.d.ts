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
declare global {
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
declare class SiteCore_Template {
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
    showMessage(message: string, type?: 'info' | 'error' | 'only_to_log' | string): void;
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
declare let SiteCore: DojoJS.DojoClass<{
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
    ajaxcall<Action extends keyof BGA.AjaxActions, Scope>(url: Action, args: NoInfer<Omit<BGA.AjaxActions[Action], "_successargs"> & BGA.AjaxAdditionalArgs>, scope: Scope, onSuccess?: NoInfer<DojoJS.HitchMethod<Scope, BGA.AjaxCallbackArgsMap[Action], any>> | undefined, callback?: NoInfer<DojoJS.HitchMethod<Scope, [error: boolean, errorMessage?: string, errorCode?: number], any>> | undefined, ajax_method?: "get" | "post" | "iframe" | undefined): void;
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
    showMessage(message: string, type?: "info" | "error" | "only_to_log" | string): void;
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
        new (): import("../../dojo/promise/Promise")<any>;
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
    getRankClassFromEloUntranslated(e: any): "beginner" | "apprentice" | "average" | "good" | "strong" | "expert" | "master";
    eloToBarPercentage(e: any, t?: boolean): number;
    formatElo(e: string): number;
    formatEloDecimal(e: any): number;
    getEloLabel(e: any, t?: any, i?: any, n?: boolean, o?: boolean): string;
    getArenaLabel(e: any, t?: any): string;
    insertParamIntoCurrentURL(e: any, t: any): void;
    playerawardsCollapsedAlignement(): void;
    playerawardCollapsedAlignement(t: any): void;
    arenaPointsDetails(e: any, t?: any): {
        league: 0 | 1 | 2 | 3 | 4 | 5;
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
    __inherited: DojoJS.DojoClassObject["inherited"];
    getInherited(args: IArguments): Function | void;
    getInherited<T extends DojoJS.InheritedMethod<any>>(method: T, args: IArguments): DojoJS.Hitched<any, T, []>;
    isInstanceOf(cls: any): boolean;
} & SiteCore_Template, []>;
export = SiteCore;
declare global {
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
//# sourceMappingURL=sitecore.d.ts.map