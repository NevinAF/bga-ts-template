declare class Keys {
    BACKSPACE: number;
    TAB: number;
    CLEAR: number;
    ENTER: number;
    SHIFT: number;
    CTRL: number;
    ALT: number;
    META: number;
    PAUSE: number;
    CAPS_LOCK: number;
    ESCAPE: number;
    SPACE: number;
    PAGE_UP: number;
    PAGE_DOWN: number;
    END: number;
    HOME: number;
    LEFT_ARROW: number;
    UP_ARROW: number;
    RIGHT_ARROW: number;
    DOWN_ARROW: number;
    INSERT: number;
    DELETE: number;
    HELP: number;
    LEFT_WINDOW: number;
    RIGHT_WINDOW: number;
    SELECT: number;
    NUMPAD_0: number;
    NUMPAD_1: number;
    NUMPAD_2: number;
    NUMPAD_3: number;
    NUMPAD_4: number;
    NUMPAD_5: number;
    NUMPAD_6: number;
    NUMPAD_7: number;
    NUMPAD_8: number;
    NUMPAD_9: number;
    NUMPAD_MULTIPLY: number;
    NUMPAD_PLUS: number;
    NUMPAD_ENTER: number;
    NUMPAD_MINUS: number;
    NUMPAD_PERIOD: number;
    NUMPAD_DIVIDE: number;
    F1: number;
    F2: number;
    F3: number;
    F4: number;
    F5: number;
    F6: number;
    F7: number;
    F8: number;
    F9: number;
    F10: number;
    F11: number;
    F12: number;
    F13: number;
    F14: number;
    F15: number;
    NUM_LOCK: number;
    SCROLL_LOCK: number;
    UP_DPAD: number;
    DOWN_DPAD: number;
    LEFT_DPAD: number;
    RIGHT_DPAD: number;
    copyKey: number;
}
declare global {
    namespace DojoJS {
        interface Dojo {
            keys: Keys;
        }
    }
}
declare const _default: Keys;
export = _default;
//# sourceMappingURL=keys.d.ts.map