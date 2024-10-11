declare global {
    namespace BGA {
        interface AjaxActions {
            "/player/profile/updateCity.html": {
                form_id: "profileinfos";
            };
            "/table/table/updateCity.html": {
                form_id: "profileinfos";
            };
        }
    }
}
declare class PlayerLocation_Template {
    page: InstanceType<BGA.CorePage> | null;
    board_div: HTMLElement | null;
    board_div_id: string | null;
    board_uid: string;
    template: string;
    teasing: string;
    googleApiLoaded: boolean;
    jtpl_citychoice: string;
    locationDialog: any;
    cityChoiceResult: any;
    callback_url: string;
    create(t: InstanceType<BGA.CorePage>, i: string, n: string, o: boolean, a: string): void;
    onModifyCity(t: Event): void;
    onSaveCity(t: Event): void;
    onCityChoiceConfirm(t: Event): void;
}
declare let PlayerLocation: DojoJS.DojoClass<PlayerLocation_Template, []>;
export = PlayerLocation;
declare global {
    namespace BGA {
        type PlayerLocation = typeof PlayerLocation;
        interface EBG {
            playerlocation: PlayerLocation;
        }
    }
    var ebg: BGA.EBG;
    var initGoogleApi: () => void;
    var geocoder: {
        geocode: (t: {
            address: string;
            language: string;
            region: string;
        }, i: (t: any, i: any) => void) => void;
    };
}
//# sourceMappingURL=playerlocation.d.ts.map