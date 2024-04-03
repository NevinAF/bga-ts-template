/**
 * A simple control that allow to set/get numeric value from inner html of div/span, and provides animation on from/to value.
 * @requires ebg/counter must be included in the define as a dependency.
 * @see {@link https://en.boardgamearena.com/doc/Counter|Documentation}
 * @example
 * // Create the template for counter
 * var jstpl_player_board = '\<div class="cp_board">\
 * 	<div id="stoneicon_p${id}" class="gmk_stoneicon gmk_stoneicon_${color}"></div><span id="stonecount_p${id}">0</span>\
 * </div>';

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
declare class Counter {
	/** Duration of the animation, default is 100ms. */
	speed: number;
	/** Associates this counter with an existing target DOM element. */
	create(target: string | HTMLElement): void;
	/** Returns the current value of the counter. */
	getValue(): number;
	/** Increments the value of the counter by the specified amount. Can be negative. */
	incValue(by: number): number;
	/** Sets the value of the counter to the specified amount. Use toValue to animate the change. */
	setValue(value: number): void;
	/** Sets the value of the counter to the specified amount with an animation. */
	toValue(value: number): void;
	/** Disables the counter, setting the visible value to '-'. The counter can be enabled again by setting the value again. */
	disable(): void;
}