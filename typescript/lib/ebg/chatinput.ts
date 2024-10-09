import e = require("dojo");
import declare = require("dojo/_base/declare");

declare global {
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
			[url in ChatAjaxURLs]: ChatInputAjaxArgs}
		> {}
	}
}

class ChatInput_Template
{
	page: null | InstanceType<BGA.SiteCore> = null;
	container_id: null | string = null;
	post_url: BGA.ChatAjaxURLs | "" = "";
	default_content: string = "";
	input_div: null | HTMLInputElement = null;
	baseparams: BGA.ChatInputBaseParams = {};
	detachType: null | string = null;
	detachId: null | BGA.ID = null;
	detachTypeGame: null | string = null;
	callbackBeforeChat: null | ((t: Record<string, any>, n: string) => boolean) = null;
	callbackAfterChat: null | ((t: Record<string, any>) => void) = null;
	callbackAfterChatError: null | ((t: Record<string, any>) => void) = null;
	writingNowChannel: null | string = null;
	bWritingNow: boolean = false;
	writingNowTimeout: null | number = null;
	writingNowTimeoutDelay: number = 8e3;
	lastTimeStartWriting: null | number = null;
	max_height: number = 100;
	bIncreaseHeightToTop: boolean = true;

	post_url_bis?: BGA.ChatAjaxURLs;

	create(page: InstanceType<BGA.SiteCore>, container_id: string, post_url: BGA.ChatAjaxURLs, default_content: string) {
		this.page = page;
		this.container_id = container_id;
		this.post_url = post_url;
		this.default_content = default_content;
		if (!$(this.container_id)) return false;
		e.empty(this.container_id);
		var a = this.container_id + "_input";
		this.detachType,
			this.detachId,
			this.detachType,
			this.detachId;
		"playtable" == this.detachType &&
			"onclick='window.open(\"/" +
				this.detachTypeGame +
				"?detachChatType=" +
				this.detachType +
				"&table=" +
				this.detachId +
				'", "notif' +
				this.detachType +
				this.detachId +
				'", "scrollbars=yes,width=280px,height=500px" );return false;\'';
		e.place(
			"<div class='chatinputctrl'><textarea id='" +
				a +
				"' class='chatinput' value='' style='overflow:hidden;resize: none;' rows='1' maxlength='300'  style='resize:none'></textarea></div>",
			$(this.container_id) as HTMLElement
		);
		this.input_div = $<HTMLInputElement>(a)!;
		// const self: this = this;
		e.connect(
			this.input_div,
			"onkeyup",
			this as ChatInput_Template,
			"onChatInputKeyUp"
		);
		e.connect(
			this.input_div,
			"onkeypress",
			this as ChatInput_Template,
			"onChatInputKeyPress"
		);
		e.connect(
			this.input_div,
			"onfocus",
			this as ChatInput_Template,
			"onChatInputFocus"
		);
		this.input_div.placeholder = default_content;
		return undefined;
	}

	destroy() {
		if ($(this.container_id))
			e.empty(this.container_id!);
	}

	sendMessage() {
		var t = e.clone(this.baseparams) as BGA.ChatInputAjaxArgs;
		t.msg = this.input_div!.value;
		if (
			null === this.callbackBeforeChat ||
			this.callbackBeforeChat(t, this.post_url)
		) {
			undefined !== this.post_url_bis && (t.no_notif = 1);
			this.page!.ajaxcall(
				this.post_url as BGA.ChatAjaxURLs, // assume not empty
				t,
				this,
				function (e) {
					this.input_div!.value = "";
					this.readaptChatHeight();
					null !== this.callbackAfterChat &&
						this.callbackAfterChat(t);
				},
				function (e) {
					e &&
						null !== this.callbackAfterChatError &&
						this.callbackAfterChatError(t);
				},
				"post"
			);
			if (undefined !== this.post_url_bis) {
				delete t.no_notif;
				this.page!.ajaxcall(
					this.post_url_bis!,
					t,
					this,
					function (e) {},
					function (e) {},
					"post"
				);
			}
		}
	}

	onChatInputKeyPress(t: KeyboardEvent): void | throws<TypeError> {
		if (t.keyCode == e.keys.ENTER) e.stopEvent(t);
	}

	onChatInputKeyUp(t: KeyboardEvent): boolean | throws<TypeError>  {
		if (t.keyCode == e.keys.ENTER) {
			e.stopEvent(t);
			this.input_div!.value = this.input_div!.value.replace(
				/(\r\n|\n|\r)/gm,
				""
			);
			this.sendMessage();
			this.lastTimeStartWriting = null;
			return true;
		}
		var i = Math.floor(Date.now() / 1e3);
		if (
			null === this.lastTimeStartWriting ||
			i >= this.lastTimeStartWriting + 5
		) {
			undefined !== this.page!.socket &&
				this.page!.socket!.emit(
					"startWriting",
					this.writingNowChannel
				);
			this.lastTimeStartWriting = i;
		}
		this.readaptChatHeight();
		return false;
	}

	readaptChatHeight(): void | throws<TypeError> {
		var t = e.style(this.input_div!, "top"),
			i = e.style(this.input_div!, "height");
		e.style(this.input_div!, "height", "0px");
		var n = Math.max(
			20,
			Math.min(
				this.input_div!.scrollHeight + 1,
				this.max_height
			)
		);
		e.style(this.input_div!, "height", n + "px");
		if (this.bIncreaseHeightToTop) {
			var o = Number(t) - (n - Number(i));
			e.style(this.input_div!, "top", o + "px");
		}
	}

	onChatInputFocus(e: FocusEvent) {}
	onChatInputBlur(e: FocusEvent) {}
	addContentToInput(e: string): void | throws<TypeError> {
		this.input_div!.value += e;
	}
}

let ChatInput = declare("ebg.chatinput", ChatInput_Template);
export = ChatInput;

declare global {
	namespace BGA {
		type ChatInput = typeof ChatInput;
		interface EBG { chatinput: ChatInput; }
	}
	var ebg: BGA.EBG;
}
