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
            [url in ChatAjaxURLs]: ChatInputAjaxArgs;
        }> {
        }
    }
}
declare class ChatInput_Template {
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
declare let ChatInput: DojoJS.DojoClass<ChatInput_Template, []>;
export = ChatInput;
declare global {
    namespace BGA {
        type ChatInput = typeof ChatInput;
        interface EBG {
            chatinput: ChatInput;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=chatinput.d.ts.map