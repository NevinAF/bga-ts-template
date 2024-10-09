import dojo = require("dojo");
import declare = require("dojo/_base/declare");

/**
 * Script Logger is a class that logs messages to the server.
 */
class ScriptLogger_Template {
	logName: string;
	logBuffer: string | null = null;
	identifier: string;
	ajaxcall_callback: InstanceType<BGA.CorePage>["ajaxcall"];

	constructor(e: string, t: InstanceType<BGA.CorePage>["ajaxcall"], i: string) {
		this.logName = e;
		this.identifier = i;
		this.ajaxcall_callback = t;
		this.log(
			"Client side " + this.logName + " log follows."
		);
	}

	log(e: string) {
		if (null === this.logBuffer)
			this.logBuffer = e;
		else {
			const t = new Date(),
				i =
					(undefined === this.identifier
						? ""
						: this.identifier + " ") +
					t.getUTCFullYear() +
					("0" + (t.getUTCMonth() + 1)).slice(-2) +
					("0" + t.getUTCDate()).slice(-2) +
					"-" +
					("0" + t.getUTCHours()).slice(-2) +
					":" +
					("0" + t.getUTCMinutes()).slice(-2) +
					":" +
					("0" + t.getUTCSeconds()).slice(-2) +
					":" +
					("00" + t.getUTCMilliseconds()).slice(-3) +
					"-UTC";
			this.logBuffer += "   " + i + " " + e;
		}
		this.logBuffer += "\n";
	}

	flush() {
		this.ajaxcall_callback(
			`/web/scriptlogger/${this.logName}.html`,
			{ log: this.logBuffer!, lock: false },
			this,
			function (e) {},
			function (e) {
				// @ts-ignore - this does nothing and is bad code anyway.
				this.logName;
			},
			"post"
		);
		this.logBuffer = null;
		this.log(
			"Client side " + this.logName + " log follows."
		);
	}
}

let ScriptLogger = declare("ebg.scriptlogger", ScriptLogger_Template);
export = ScriptLogger;

declare global {
	namespace BGA {
		type ScriptLogger = typeof ScriptLogger;
		interface EBG { scriptlogger: ScriptLogger; }
	}
	var ebg: BGA.EBG;
}