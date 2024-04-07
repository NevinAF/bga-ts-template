/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/core/soundManager must be included in the define as a dependency.
 */
interface SoundManager {
	bMuteSound: boolean;
	html5: boolean;
	initOk: boolean;
	soundMode: number;
	sounds: Record<string, string>;
	useOgg: boolean;
	volume: number;

	init: () => void;
	initHtml5Audio: () => void;
	getSoundIdFromEvent: (event: string) => string;
	getSoundTag: (idOrEvent: string) => `audiosrc_${string}`;
	doPlay: (idOrEvent: string) => void;
	loadSound: (idOrEvent: string) => void;
	doPlayFile: (soundId: string) => void;
	stop: (idOrEvent: string) => void;
	onChangeSound: (event: Event) => void;
}

declare module "ebg/core/soundManager" {
	const SoundManager: new () => SoundManager;
	export = SoundManager;
}