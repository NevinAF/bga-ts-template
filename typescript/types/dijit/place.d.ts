declare var place: DijitJS.Place;
declare global {
    namespace DojoJS {
        interface Dijit {
            place: typeof place;
        }
    }
}
export = place;
//# sourceMappingURL=place.d.ts.map