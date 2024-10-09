import DojoJS = require("dojo");
import declare = require("dojo/_base/declare");
import "ebg/core/core";

class SoundManager_Template
{
	bMuteSound: boolean = false;
	html5: boolean = true;
	initOk: boolean = false;
	soundMode: number = 0;
	sounds?: Record<string, string>;
	useOgg: boolean = true;
	volume: number = 0.8;
	flashMedia?: { doPlay: any };

	init(): boolean
	{
		if (!!document.createElement("audio").canPlayType) {
			this.html5 = true;
			this.initHtml5Audio();
		}
		return this.html5;
	}

	initHtml5Audio(): void
	{
		if (!!document.createElement("audio").canPlayType) {
			var audioElement = document.createElement("audio");
			if (audioElement.canPlayType) {
				if (
					!!audioElement.canPlayType &&
					"" !=
						audioElement.canPlayType(
							'audio/ogg; codecs="vorbis"'
						)
				) {
					this.html5 = true;
					this.useOgg = true;
					this.initOk = true;
				} else {
					this.useOgg = false;
					if (
						!!audioElement.canPlayType &&
						"" != audioElement.canPlayType("audio/mpeg")
					) {
						this.html5 = true;
						this.initOk = true;
					}
				}
			}
		}
	}

	getSoundIdFromEvent(idOrEvent: string): string
	{
		return soundManager.sounds![idOrEvent]
			? soundManager.sounds![idOrEvent]!
			: idOrEvent;
	}

	getSoundTag(id: string): `audiosrc_${string}`
	{
		return this.useOgg
			? `audiosrc_o_${id}`
			: `audiosrc_${id}`;
	}

	doPlay(args: { id: string, volume?: number }): void
	{
		if (!this.bMuteSound) {
			var t = this.getSoundIdFromEvent(args.id);
			this.doPlayFile(t);
		}
	}

	loadSound(id: string): void
	{
		var i = this.getSoundTag(id);
		if (!$(i)) {
			var n = id;
			this.useOgg ? (n += ".ogg") : (n += ".mp3");
			dojo.place(
				dojo.trim(
					dojo.string.substitute(jstpl_audiosrc, {
						id: i,
						file: n,
					})
				),
				"audiosources"
			);
		}
	}

	doPlayFile(soundId: string): void
	{
		var t = this.getSoundTag(soundId);
		this.loadSound(soundId);
		if ($(t)) {
			$<HTMLAudioElement>(t)!.volume = this.volume;
			$<HTMLAudioElement>(t)!.currentTime = 0;
			$<HTMLAudioElement>(t)!.play();
		}
	}

	stop(args: { id: string, volume?: number }): void
	{
		var t = this.getSoundIdFromEvent(args.id);
		var i = this.getSoundTag(t);
		$(i) && $<HTMLAudioElement>(i)!.pause();
	}

	onChangeSound(event: Event & { args: { event: string, file: string } }): void
	{
		this.sounds![event.args.event] = event.args.file;
	}
}

let SoundManager = declare("ebg.soundManager", SoundManager_Template);
export = SoundManager;

declare global {
	namespace BGA {
		type SoundManager = typeof SoundManager;
		interface EBG { core: EBG_CORE; }
		interface EBG_CORE { soundManager: SoundManager; }
	}
	var ebg: BGA.EBG;
}