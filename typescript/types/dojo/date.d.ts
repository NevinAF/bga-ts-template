declare var date: DateBase;
type DatePortion = 'date' | 'time' | 'datetime';
type DateInterval = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' | 'quarter' | 'week' | 'weekday';
interface DateBase {
    /**
     * Returns the number of days in the month used by dateObject
     */
    getDaysInMonth(dateObject: Date): number;
    /**
     * Determines if the year of the dateObject is a leap year
     */
    isLeapYear(dateObject: Date): boolean;
    /**
     * Get the user's time zone as provided by the browser
     */
    getTimezoneName(dateObject: Date): string;
    /**
     * Compare two date objects by date, time, or both.
     *
     */
    compare(date1: Date, date2: Date, portion?: DatePortion): number;
    /**
     * Add to a Date in intervals of different size, from milliseconds to years
     */
    add(date: Date, interval: DateInterval, amount: number): Date;
    /**
     * Get the difference in a specific unit of time (e.g., number of
     * months, weeks, days, etc.) between two dates, rounded to the
     * nearest integer.
     */
    difference(date1: Date, date2?: Date, interval?: DateInterval): number;
}
declare global {
    namespace DojoJS {
        interface DojoDate extends Type<typeof date> {
        }
        interface Dojo {
            date: DojoDate;
        }
    }
}
export = date;
//# sourceMappingURL=date.d.ts.map