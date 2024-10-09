import dojo = require("./_base/kernel");
import has = require("./sniff");

class Keys {
	BACKSPACE: number = 8;
	TAB: number = 9;
	CLEAR: number = 12;
	ENTER: number = 13;
	SHIFT: number = 16;
	CTRL: number = 17;
	ALT: number = 18;
	META: number = has("webkit") ? 91 : 224;
	PAUSE: number = 19;
	CAPS_LOCK: number = 20;
	ESCAPE: number = 27;
	SPACE: number = 32;
	PAGE_UP: number = 33;
	PAGE_DOWN: number = 34;
	END: number = 35;
	HOME: number = 36;
	LEFT_ARROW: number = 37;
	UP_ARROW: number = 38;
	RIGHT_ARROW: number = 39;
	DOWN_ARROW: number = 40;
	INSERT: number = 45;
	DELETE: number = 46;
	HELP: number = 47;
	LEFT_WINDOW: number = 91;
	RIGHT_WINDOW: number = 92;
	SELECT: number = 93;
	NUMPAD_0: number = 96;
	NUMPAD_1: number = 97;
	NUMPAD_2: number = 98;
	NUMPAD_3: number = 99;
	NUMPAD_4: number = 100;
	NUMPAD_5: number = 101;
	NUMPAD_6: number = 102;
	NUMPAD_7: number = 103;
	NUMPAD_8: number = 104;
	NUMPAD_9: number = 105;
	NUMPAD_MULTIPLY: number = 106;
	NUMPAD_PLUS: number = 107;
	NUMPAD_ENTER: number = 108;
	NUMPAD_MINUS: number = 109;
	NUMPAD_PERIOD: number = 110;
	NUMPAD_DIVIDE: number = 111;
	F1: number = 112;
	F2: number = 113;
	F3: number = 114;
	F4: number = 115;
	F5: number = 116;
	F6: number = 117;
	F7: number = 118;
	F8: number = 119;
	F9: number = 120;
	F10: number = 121;
	F11: number = 122;
	F12: number = 123;
	F13: number = 124;
	F14: number = 125;
	F15: number = 126;
	NUM_LOCK: number = 144;
	SCROLL_LOCK: number = 145;
	UP_DPAD: number = 175;
	DOWN_DPAD: number = 176;
	LEFT_DPAD: number = 177;
	RIGHT_DPAD: number = 178;
	copyKey: number = has("mac") && !has("air") ? (has("safari") ? 91 : 224) : 17
}

declare global {
	namespace DojoJS
	{
		interface Dojo {
			keys: Keys;
		}
	}
}

export = dojo.keys = new Keys();