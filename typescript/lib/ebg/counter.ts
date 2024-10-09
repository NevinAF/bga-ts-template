import dojo = require("dojo");
import declare = require("dojo/_base/declare");

/**
 * A simple control that allow to set/get numeric value from inner html of div/span, and provides an ease-out animation on from/to value.
 * @see {@link https://en.boardgamearena.com/doc/Counter|Documentation}
 * @example
 * // Create the template for counter
 * var jstpl_player_board = '\<div class="cp_board">\
 * 	<div id="stoneicon_p${id}" class="gmk_stoneicon gmk_stoneicon_${color}"></div><span id="stonecount_p${id}">0</span>\
 * </div>';
 * 
 * // Setting up player boards
 * this.stone_counters={};
 * for( var player_id in gamedatas.players ) {
 * 	var player = gamedatas.players[player_id];
 * 
 * 	// Setting up players boards if needed
 * 	var player_board_div = $('player_board_'+player_id);
 * 	dojo.place( this.format_block('jstpl_player_board', player ), player_board_div );
 * 	// create counter per player
 * 	this.stone_counters[player_id]=new ebg.counter();
 * 	this.stone_counters[player_id].create('stonecount_p'+player_id);
 * }
 */
class Counter_Template {

	span: Element | null = null;
	current_value: BGA.ID | typeof NaN = 0;
	target_value: BGA.ID | null | typeof NaN = 0;
	/** Duration of the animation, default is 100ms. */
	speed: number = 100;

	/**
	 * Associates this counter with an existing target DOM element.
	 * 
	 * @throws {TypeError} if the target is not found.
	 */
	create(elementOrSelectors: string | Element | null): void | throws<TypeError>
	{
		this.span = (typeof elementOrSelectors === 'string') ? document.querySelector(elementOrSelectors) : elementOrSelectors;
		this.span!.innerHTML = this.current_value as string;
	}

	/**
	 * Getter for the property {@link Counter_Template.target_value}.
	 */
	getValue(): BGA.ID | null | typeof NaN { return this.target_value; }

	/**
	 * Sets the value of the counter to the specified amount by immediately updating {@link current_value}, {@link target_value}, and the html of {@link span}. Use {@link toValue} to animate the change over time.
	 * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
	 */
	setValue(value: BGA.ID): void | throws<TypeError>
	{
		this.current_value = value;
		this.target_value = value;
		this.span!.innerHTML = this.current_value as string;
	}

	/**
	 * Sets the value of the counter to the specified amount by setting {@link target_value} and dynamically updating {@link current_value} over time. The animation ticks every {@link speed} milliseconds, moving 20% closer to the target value each time (minimum 1, resulting in an ease-out like update).
	 * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
	 */
	toValue(value: BGA.ID): void | throws<TypeError>
	{
		this.target_value = toint(value);
		if (this.current_value != this.target_value)
			dojo.addClass(this.span!, "counter_in_progress");

		setTimeout(dojo.hitch(this, this.makeCounterProgress), this.speed);
	}

	/**
	 * Wrapper for {@link toValue} that increments the target value by the specified amount through an ease-out animation.
	 * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
	 * @returns The new target value of the counter.
	 */
	incValue(by: number | string): number | typeof NaN | throws<TypeError>
	{
		this.toValue(
			parseInt(this.target_value as string, 10) + parseInt(String(toint(by)), 10)
		);
		return this.target_value as number | typeof NaN;
	}

	/**
	 * Sets the display of the {@link span} to '-' to indicate that the counter is disabled. The internal values of the counter are not changed and can be re-enabled by using {@link setValue}, {@link toValue}, or {@link incValue}.
	 * @throws {TypeError} if {@link create} has not been called with a valid element/id and {@link span} has not been manually set.
	 */
	disable(): void | throws<TypeError>
	{
		// @ts-ignore - Throws null TypeError if span is invalid.
		this.span.innerHTML = "-";
	}

	/** Moves the counter towards the target value by 20% of the difference. */
	protected makeCounterProgress(): void | throws<TypeError>
	{
		if (this.current_value != this.target_value) {
			var increment = Math.ceil(
				// @ts-ignore - Results in NaN for current value.
				Math.abs(this.target_value - this.current_value) / 5
			);
			// @ts-ignore - Results in NaN for current value.
			this.current_value < this.target_value
				// @ts-ignore - Implicit cast to number
				? (this.current_value += increment)
				// @ts-ignore - Implicit cast to number
				: (this.current_value -= increment);
			this.span!.innerHTML = this.current_value as string;
			setTimeout(dojo.hitch(this, this.makeCounterProgress), this.speed);
		}
		else setTimeout(dojo.hitch(this, this.finishCounterMove), 1000);
	}

	/** Removes the "counter_in_progress" class from the {@link span} to indicate that the counter has finished animating. */
	protected finishCounterMove(): void | throws<TypeError>
	{
		this.current_value == this.target_value &&
			dojo.removeClass(this.span!, "counter_in_progress");
	}
}

let Counter = declare("ebg.counter", Counter_Template);
export = Counter;

declare global {
	namespace BGA {
		type Counter = typeof Counter;
		interface EBG { counter: Counter; }
	}
	var ebg: BGA.EBG;
}