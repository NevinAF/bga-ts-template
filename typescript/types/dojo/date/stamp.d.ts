declare var stamp: Stamp;
interface StampFormatOptions {
    /**
     * "date" or "time" for partial formatting of the Date object.
     * Both date and time will be formatted by default.
     */
    selector?: 'time' | 'date';
    /**
     * if true, UTC/GMT is used for a timezone
     */
    zulu?: boolean;
    /**
     * if true, output milliseconds
     */
    milliseconds?: boolean;
}
interface Stamp {
    /**
     * Returns a Date object given a string formatted according to a subset of the ISO-8601 standard.
     */
    fromISOString(formattedString: string, defaultTime?: number): Date;
    /**
     * Format a Date object as a string according a subset of the ISO-8601 standard
     */
    toISOString(dateObject: Date, options?: StampFormatOptions): string;
}
declare global {
    namespace DojoJS {
        interface DojoDate {
            stamp: typeof stamp;
        }
        interface Dojo {
            date: DojoDate;
        }
    }
}
export = stamp;
//# sourceMappingURL=stamp.d.ts.map