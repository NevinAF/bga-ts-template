interface Easing {
    linear(n: number): number;
    quadIn(n: number): number;
    quadOut(n: number): number;
    quadInOut(n: number): number;
    cubicIn(n: number): number;
    cubicOut(n: number): number;
    cubicInOut(n: number): number;
    quartIn(n: number): number;
    quartOut(n: number): number;
    quartInOut(n: number): number;
    quintIn(n: number): number;
    quintOut(n: number): number;
    quintInOut(n: number): number;
    sineIn(n: number): number;
    sineOut(n: number): number;
    sineInOut(n: number): number;
    expoIn(n: number): number;
    expoOut(n: number): number;
    expoInOut(n: number): number;
    circIn(n: number): number;
    circOut(n: number): number;
    circInOut(n: number): number;
    /**
     * An easing function that starts away from the target,
     * and quickly accelerates towards the end value.
     *
     * Use caution when the easing will cause values to become
     * negative as some properties cannot be set to negative values.
     */
    backIn(n: number): number;
    /**
     * An easing function that pops past the range briefly, and slowly comes back.
     */
    backOut(n: number): number;
    /**
     * An easing function combining the effects of `backIn` and `backOut`
     */
    backInOut(n: number): number;
    /**
     * An easing function the elastically snaps from the start value
     */
    elasticIn(n: number): number;
    /**
     * An easing function that elasticly snaps around the target value,
     * near the end of the Animation
     */
    elasticOut(n: number): number;
    /**
     * An easing function that elasticly snaps around the value, near
     * the beginning and end of the Animation.
     */
    elasticInOut(n: number): number;
    /**
     * An easing function that 'bounces' near the beginning of an Animation
     */
    bounceIn(n: number): number;
    /**
     * An easing function that 'bounces' near the end of an Animation
     */
    bounceOut(n: number): number;
    /**
     * An easing function that 'bounces' at the beginning and end of the Animation
     */
    bounceInOut(n: number): number;
}
declare global {
    namespace DojoJS {
        interface DojoFx {
            easing: Easing;
        }
        interface Dojo {
            fx: DojoFx;
        }
    }
}
declare const _default: {};
export = _default;
//# sourceMappingURL=easing.d.ts.map