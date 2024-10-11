import "ebg/core/core";
declare class SoundManager_Template {
    bMuteSound: boolean;
    html5: boolean;
    initOk: boolean;
    soundMode: number;
    sounds?: Record<string, string>;
    useOgg: boolean;
    volume: number;
    flashMedia?: {
        doPlay: any;
    };
    init(): boolean;
    initHtml5Audio(): void;
    getSoundIdFromEvent(idOrEvent: string): string;
    getSoundTag(id: string): `audiosrc_${string}`;
    doPlay(args: {
        id: string;
        volume?: number;
    }): void;
    loadSound(id: string): void;
    doPlayFile(soundId: string): void;
    stop(args: {
        id: string;
        volume?: number;
    }): void;
    onChangeSound(event: Event & {
        args: {
            event: string;
            file: string;
        };
    }): void;
}
declare let SoundManager: DojoJS.DojoClass<SoundManager_Template, []>;
export = SoundManager;
declare global {
    namespace BGA {
        type SoundManager = typeof SoundManager;
        interface EBG {
            core: EBG_CORE;
        }
        interface EBG_CORE {
            soundManager: SoundManager;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=soundManager.d.ts.map