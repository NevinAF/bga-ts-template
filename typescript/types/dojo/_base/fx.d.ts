import Evented = require("../Evented");
declare var fx: DojoJS.Fx;
interface Line {
    /**
     * Returns the point on the line
     * @param {number} n a floating point number greater than 0 and less than 1
     */
    getValue(n: number): number;
}
/**
 * Object used to generate values from a start value to an end value
 */
interface LineConstructor {
    new (start: number, end: number): Line;
}
interface EasingFunction {
    (n: number): number;
}
/**
 * A generic animation class that fires callbacks into its handlers
 * object at various states.
 */
interface AnimationConstructor {
    new (args: any): DojoJS.Animation;
    prototype: DojoJS.Animation;
}
interface AnimationCallback {
    (node: HTMLElement): void;
}
interface FadeArguments {
    node: HTMLElement | string;
    duration?: number;
    easing?: EasingFunction;
    start?: Function;
    end?: Function;
    delay?: number;
}
interface AnimationArgumentsProperties extends Partial<AnimationArguments> {
    [name: string]: any;
}
interface AnimationArguments extends FadeArguments {
    properties?: AnimationArgumentsProperties;
    onEnd?: AnimationCallback;
    onAnimate?: AnimationCallback;
}
declare global {
    namespace DojoJS {
        interface Dojo extends Fx {
            _Animation: AnimationConstructor;
        }
        interface Fx {
            _Line: LineConstructor;
            Animation: AnimationConstructor;
            _fade(args: any): DojoJS.Animation;
            /**
             * Returns an animation that will fade node defined in 'args' from
             * its current opacity to fully opaque.
             */
            fadeIn(args: AnimationArguments): DojoJS.Animation;
            /**
             * Returns an animation that will fade node defined in 'args'
             * from its current opacity to fully transparent.
             */
            fadeOut(args: AnimationArguments): DojoJS.Animation;
            _defaultEasing(n?: number): number;
            /**
             * Returns an animation that will transition the properties of
             * node defined in `args` depending how they are defined in
             * `args.properties`
             */
            animateProperty(args: AnimationArguments): DojoJS.Animation;
            /**
             * A simpler interface to `animateProperty()`, also returns
             * an instance of `Animation` but begins the animation
             * immediately, unlike nearly every other Dojo animation API.
             */
            anim(node: HTMLElement | string, properties: {
                [name: string]: any;
            }, duration?: number, easing?: Function, onEnd?: AnimationCallback, delay?: number): DojoJS.Animation;
            /**
             * Chain a list of `dojo/_base/fx.Animation`s to run in sequence
             */
            chain(animations: DojoJS.Animation[]): DojoJS.Animation;
            chain(...animations: DojoJS.Animation[]): DojoJS.Animation;
            /**
             * Combine a list of `dojo/_base/fx.Animation`s to run in parallel
             */
            combine(animations: DojoJS.Animation[]): DojoJS.Animation;
            combine(...animations: DojoJS.Animation[]): DojoJS.Animation;
            /**
             * Expand a node to it's natural height.
             */
            wipeIn(args: AnimationArguments): DojoJS.Animation;
            /**
             * Shrink a node to nothing and hide it.
             */
            wipeOut(args: AnimationArguments): DojoJS.Animation;
            /**
             * Slide a node to a new top/left position
             */
            slideTo(args: AnimationArguments & {
                left?: number | string;
                top?: number | string;
            }): DojoJS.Animation;
        }
        interface Animation extends Evented {
            /**
             * The time in milliseconds the animation will take to run
             */
            duration: number;
            /**
             * A two element array of start and end values, or a `_Line` instance to be
             * used in the Animation.
             */
            curve: Line | [number, number];
            /**
             * A Function to adjust the acceleration (or deceleration) of the progress
             * across a _Line
             */
            easing?: EasingFunction;
            /**
             * The number of times to loop the animation
             */
            repeat: number;
            /**
             * the time in milliseconds to wait before advancing to next frame
             * (used as a fps timer: 1000/rate = fps)
             */
            rate: number;
            /**
             * The time in milliseconds to wait before starting animation after it
             * has been .play()'ed
             */
            delay?: number;
            /**
             * Synthetic event fired before a Animation begins playing (synchronous)
             */
            beforeBegin: Event;
            /**
             * Synthetic event fired as a Animation begins playing (useful?)
             */
            onBegin: Event;
            /**
             * Synthetic event fired at each interval of the Animation
             */
            onAnimate: Event;
            /**
             * Synthetic event fired after the final frame of the Animation
             */
            onEnd: Event;
            /**
             * Synthetic event fired any time the Animation is play()'ed
             */
            onPlay: Event;
            /**
             * Synthetic event fired when the Animation is paused
             */
            onPause: Event;
            /**
             * Synthetic event fires when the Animation is stopped
             */
            onStop: Event;
            _precent: number;
            _startRepeatCount: number;
            _getStep(): number;
            /**
             * Convenience function.  Fire event "evt" and pass it the
             * arguments specified in "args".
             */
            _fire(evt: Event, args?: any[]): this;
            /**
             * Start the animation.
             */
            play(delay?: number, gotoStart?: boolean): this;
            _play(gotoStart?: boolean): this;
            /**
             * Pauses a running animation.
             */
            pause(): this;
            /**
             * Sets the progress of the animation.
             */
            gotoPercent(precent: number, andPlay?: boolean): this;
            /**
             * Stops a running animation.
             */
            stop(gotoEnd?: boolean): DojoJS.Animation;
            /**
             * cleanup the animation
             */
            destroy(): void;
            /**
             * Returns a string token representation of the status of
             * the animation, one of: "paused", "playing", "stopped"
             */
            status(): string;
            _cycle(): DojoJS.Animation;
            _clearTimer(): void;
            _startTimer(): void;
            _stopTimer(): void;
        }
    }
}
export = fx;
//# sourceMappingURL=fx.d.ts.map