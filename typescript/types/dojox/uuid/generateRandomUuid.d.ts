import "./_base";
declare global {
    namespace DojoJS {
        type UUID = `${string}-${string}-4${string}-8${string}-${string}`;
        interface Dojox_UUID {
            /**
             * @returns A random UUID in the format xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx
             */
            generateRandomUuid: () => UUID;
        }
        interface Dojox {
            uuid: Dojox_UUID;
        }
    }
}
declare const _default: () => DojoJS.UUID;
export = _default;
//# sourceMappingURL=generateRandomUuid.d.ts.map