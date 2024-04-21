import "dojo";
import "dojo/_base/declare";
import "ebg/core/core";

/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class SoundManager {
	bMuteSound: boolean;
	html5: boolean;
	initOk: boolean;
	soundMode: number;
	sounds: Record<string, string>;
	useOgg: boolean;
	volume: number;

	init(): void;
	initHtml5Audio(): void;
	getSoundIdFromEvent(event: string): string;
	getSoundTag(idOrEvent: string): `audiosrc_${string}`;
	doPlay(idOrEvent: string): void;
	loadSound(idOrEvent: string): void;
	doPlayFile(soundId: string): void;
	stop(idOrEvent: string): void;
	onChangeSound(event: Event): void;

	/** See definition from {@link dojo._base.DeclareConstructor.extend} for more information. */
	static extend: dojo._base.DeclareConstructor<SoundManager>['extend'];
	/** See definition from {@link dojo._base.DeclareConstructor.createSubclass} for more information. */
	static createSubclass: dojo._base.DeclareConstructor<SoundManager>['createSubclass'];
}

interface SoundManager extends dojo._base.DeclareCreatedObject {}

declare global {
	/** The global sound manager object for playing/stopping sounds. */
	const soundManager: SoundManager;

	interface EBG_CORE { soundManager: typeof SoundManager; }
	interface EBG { core: EBG_CORE; }
	interface Window { ebg: EBG; }
}

export = SoundManager;