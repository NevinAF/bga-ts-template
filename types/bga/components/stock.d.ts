interface StockItem {
	id: number;
	type: number;
}

interface StockItemType {
	/** The sort priority when arranging items to be displayed within a stock. Lower values are displayed first. If two items have the same weight, the are sorted by the order by which they were added to the stock. */
	weight: number;
	/** The sprite sheet URL for this `StockItemType`. This image should contain a grid of images matching the `itemWidth` and `itemHeight` used for the `Stock.create(..)` method. If this sprite sheet is not a single row of images, the `Stock.image_items_per_row` property is used to specify the number of sprites per row in this image. */
	image: string;
	/** The sprite sheet position for this `StockItemType`. This is a zero indexed number defined by the following formula: `row * Stock.image_items_per_row + col`. This number should never exceed the number of sprites in the sprite sheet. */
	image_position: number;
}

/** For each stock control, you can specify a selection mode. The selection mode determines how the user can interact with the items in the stock. */
declare enum StockSelectionMode {
	/** No item can be selected by the player. */
	NONE = 0,
	/** A maximum of one item can be selected by the player at a time. */
	SINGLE = 1,
	/** Default. Multiple items can be selected by the player at the same time. */
	MULTI = 2
}

/**
 * For each stock control, you can specify a selection highlighting type:
 * - 'border': there will be a red border around selected items (this is the default). The attribute 'apparenceBorderWidth' can be used to manage the width of the border (in pixels)
 * - 'disappear': the selected item will fade out and disappear. This is useful when the selection has the effect of destroying the item
 * - 'class': there will be an extra stockitem_selected css class added to the element when it is selected (and removed when unselected). The name of the class can be changed by using the selectionClass attribute. You can also override the default class in the css file for your game but beware of the !important keyword.
 * 
 * By default this class definition is:
 * 
 * .stockitem_selected {
 * 	border: 2px solid red ! important;
 * }
 * 
 * If you want to override it (for example, to change the border color) add this in your <game>.css file:
 * 
 * .stockitem_selected {
 * 	border: 2px solid orange ! important;
 * }
 */
type StockSelectionAppearance = 'border' | 'disappear' | 'class';

/**
 * A component that you can use in your game interface to display a set of elements of the same size that need to be arranged in single or multiple lines. Usually used for displaying cards and tokens in a flexible way. This component can be used to:
 * - Display a set of cards, typically hands (examples: Hearts, Seasons, The Boss, Race for the Galaxy).
 * - Display items in player panels (examples: Takenoko, Amyitis, ...)
 * - Black dice and cubes on cards in Troyes are displayed with stock components.
 * @requires ebg/stock must be included in the define as a dependency.
 * @see {@link https://en.boardgamearena.com/doc/Stock|Documentation}
 * 
 * 
 * Most cases will be one of the following situations:
 * 
 * Situation A:
 * 
 * When you add a card to a stock item, and this card is not coming from another stock:
 * Use addToStockWithId with a "from" argument set to the element of your interface where the card should come from (i.e. div id). For example if you want to "reveal" card from player hand and it is not an interface element you can set from to be 'player_board_'+activePlayerId (where activePlayerId is player who played that card).
 * 
 * Situation B:
 * 
 * When you add a card to a stock item, and this card is coming from another stock:
 * On the destination Stock, use addToStockWithId with a "from" argument which is the HTML id of the corresponding item in the source Stock. For example, if the source stock id is "myHand", then the HTML id of card 48 is "myHand_item_48".
 * Then, remove the source item with removeFromStockById. Note: do NOT set the 'to' argument in this call, otherwise you'll get two animations.
 * (Note that it's important to do things in this order, because the source item must still exist when you use it as the origin of the slide.)
 * 
 * Situation C:
 * 
 * When you move a card from a stock item to something that is not a stock item:
 * Insert the card as a classic HTML template (dojo.place / this.format_block).
 * Place it on the Stock item with this.placeOnObject, using the Stock item HTML id (see above).
 * Slide it to its new position with this.slideToObject.
 * Remove the card from the Stock item with removeFromStockById.
 * 
 * Using the methods above, your cards should slide to, from, and between your Stock controls smoothly.
 *  */
declare class Stock {
	// #region Modifiers

	/**
	 * Initializes the stock component for the specified `game` on a specified `target`
	 * @param {Gamegui} game The game object
	 * @param {HTMLElement} container_div The div element to attach the stock to. This element should be empty and normally should be directly defined within the .tpl file.
	 * @param {number} itemWidth The width of a single item in pixels. This used for displaying the item and for cropping the sprite sheet image of all items when `addItemType`.
	 * @param {number} itemHeight The height of a single item in pixels. This used for displaying the item and for cropping the sprite sheet image of all items when `addItemType`.
	 * @returns {void}
	 * @example
	 * // Create player hand from inside the game class
	 * this.playerHand = new ebg.stock();
	 * this.playerHand.create( this, $('myhand'), this.cardwidth, this.cardheight );
	 */
	create: (game: Gamegui, container_div: any, itemWidth: number, itemHeight: number) => void;
	
	/**
	 * Define a new type of item, `StockItemType`, and add it to the stock with given type id. It is mandatory to define a new item type before adding it to the stock. The list of defined item types are always available in `item_type` property.
	 * @param typeId 
	 * @param weight {@link StockItemType.weight} The sort priority when arranging items to be displayed within a stock. Lower values are displayed first. If two items have the same weight, the are sorted by the order by which they were added to the stock.
	 * @param image {@link StockItemType.image} The sprite sheet URL for this `StockItemType`. This image should contain a grid of images matching the `itemWidth` and `itemHeight` used for the `Stock.create(..)` method. If this sprite sheet is not a single row of images, the `Stock.image_items_per_row` property is used to specify the number of sprites per row in this image.
	 * @param image_position {@link StockItemType.image_position} The sprite sheet position for this `StockItemType`. This is a zero indexed number defined by the following formula: `row * Stock.image_items_per_row + col`. This number should never exceed the number of sprites in the sprite sheet.
	 * @returns {void}
	 */
	addItemType: (typeId: number, weight: number, image: string, image_position: number) => void;

	/**
	 * Add an item to the stock, with the specified type, but without a unique ID. This is useful when items of the same type don't need to be uniquely identified. For example, a pile of money tokens in a game. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param typeId The type id of the item to add to the stock. This must be a type id that was previously defined with `addItemType`.
	 * @param from The element to animate the item from. When the `from` parameter is specified, the item will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the item will be created and placed immediately inside the stock.
	 * @returns {void}
	 */
	addToStock( typeId: number, from?: string | HTMLElement ): void;
	/**
	 * Add an item to the stock, with the specified type and unique ID. This is useful when items of the same type need to be uniquely identified. For example, if there are two of the same cards but in different orders (like a draw area), the position of the card within the stock is important. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param typeId The type id of the item to add to the stock. This must be a type id that was previously defined with `addItemType`.
	 * @param itemId The unique id of the item to add to the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @param from The element to animate the item from. When the `from` parameter is specified, the item will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the item will be created and placed immediately inside the stock.
	 * @returns {void}
	 */
	addToStockWithId: (typeId: number, itemId: number, from?: string | HTMLElement) => void;

	/**
	 * Remove an item of the specific type from the stock. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param typeId The type id of the item to be removed from the stock. This must be a type id that was previously defined with `addItemType`, and the item must have been added to the stock with `addToStock`.
	 * @param to The element to animate the item to. When the `to` parameter is specified, the item will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the item to a specific location on the page. Either way, the item is destroyed after the animation is complete.
	 * @param noupdate Default is false. If set to "true" it will prevent the Stock display from changing. This is useful when multiple (but not all) items are removed at the same time, to avoid ghost items appearing briefly. If you pass noupdate you have to call updateDisplay() after all items are removed.
	 * @returns {void}
	 */
	removeFromStock: (typeId: string, to?: string | HTMLElement, noupdate?: boolean) => void;

	/**
	 * Remove an item of the specific type from the stock. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @param to The element to animate the item to. When the `to` parameter is specified, the item will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the item to a specific location on the page. Either way, the item is destroyed after the animation is complete.
	 * @param noupdate Default is false. If set to "true" it will prevent the Stock display from changing. This is useful when multiple (but not all) items are removed at the same time, to avoid ghost items appearing briefly. If you pass noupdate you have to call updateDisplay() after all items are removed.
	 * @returns {void}
	 */
	removeFromStockById: (itemId: number, to?: string | HTMLElement, noupdate?: boolean) => void;

	/** Removes all items from the stock. */
	removeAll: () => void;

	/**
	 * Removes all items from the stock.
	 * @param to The element to animate the items to. When the `to` parameter is specified, the items will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the items to a specific location on the page. Either way, the items are destroyed after the animation is complete.
	 * @returns {void}
	*/
	removeAllTo: (to?: string | HTMLElement) => void;

	//#endregion

	//#region Getters

	/** The div element to attach all of the stock items to. */
	container_div: HTMLElement;

	/** The id of the container_div. */
	control_name: string;

	/** A dictionary of all defined item types, listed by type id. */
	item_type: { [typeId: number]: StockItemType };

	/**
	 * Return an array with all the types of items present in the stock right now.
	 * @returns Key-value pairs of the type id and the number of items of that type in the stock.
	 * @example
	 * this.myStockControl.removeAll();
	 * this.myStockControl.addToStock( 65 );
	 * this.myStockControl.addToStock( 34 );
	 * this.myStockControl.addToStock( 89 );
	 * this.myStockControl.addToStock( 65 );
	 * 
	 * // The following returns: { 34:1,  65:1,  89:1  }
	 * var item_types = this.myStockControl.getPresentTypeList();
	 */
	getPresentTypeList: () => { [typeId: number]: number };

	/**
	 * Returns the total number of items in the stock.
	 * @returns The total number of items in the stock.
	 */
	count: () => number;

	/**
	 * Returns the array of items in the stock.
	 * @returns An array of items in the stock.
	 */
	getAllItems: () => StockItem[];

	/**
	 * A constant function that returns the id for an item given it's id. Same as `{container_div.id}`_item_{itemId}`.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns Returns `{container_div.id}`_item_{itemId}`.
	 */
	getItemDivId: (itemId: string) => string;

	/**
	 * Returns the item with the specified unique id. Only useful for obtaining the item's type id.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns The item with the specified unique id.
	 */
	getItemById: (itemId: number) => StockItem;

	/**
	 * Returns the type id of the item with the specified unique id. If you want the weight of an item using the type, use item_type[typeId].weight.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns The type id of the item with the specified unique id
	 */
	getItemWeightById: (itemId: number) => number | null;

	//#endregion

	//#region Selection

	/**
	 * Sets the selection mode for the stock. The selection mode determines how the user can interact with the items in the stock.
	 * @param mode The selection mode to set for the stock.
	 * @returns {void}
	 */
	setSelectionMode: (mode: StockSelectionMode) => void;

	/** Sets the selection appearance for the stock. @see StockSelectionAppearance */
	setSelectionAppearance: (appearanceType: StockSelectionAppearance) => void;

	/**
	 * Predicate function that returns true if the item with the specified unique id is selected.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns True if the item with the specified unique id is selected.
	 */
	isSelected(itemId: number): boolean;

	/**
	 * Selects the item with the specified unique id.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns {void}
	 */
	selectItem(itemId: number): void;

	/**
	 * Deselects the item with the specified unique id.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns {void}
	 */
	unselectItem(itemId: number): void;

	/** Deselects all items in the stock. */
	unselectAll: () => void;

	/**
	 * Selects all items in the stock matching the specified type id.
	 * @param typeId The type id of the items to be selected. This must be a type id that was previously defined with `addItemType`.
	 * @returns {void}
	 */
	selectItemsByType: (typeId: number) => void;

	/**
	 * Deselects all items in the stock matching the specified type id.
	 * @param typeId The type id of the items to be deselected. This must be a type id that was previously defined with `addItemType`.
	 * @returns {void}
	 */
	unselectItemsByType: (typeId: number) => void;

	/**
	 * A callback function that should be overridden when listening for changes in a stocks selection. This callback method is called when the player selects/unselects an item of the stock.
	 * @param control_name The name of the stocks control. Same as Stick.container_div.id.
	 * @param item_id The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns {void}
	 * @example
	 * dojo.connect( this.myStockControl, 'onChangeSelection', this, 'onMyMethodToCall' );
	 * (...)
	 * onMyMethodToCall: function( control_name, item_id )
	 * {
	 *     // This method is called when myStockControl selected items changed
	 *     var items = this.myStockControl.getSelectedItems();
	 *     
	 *     // (do something)
	 * },
	 *  */
	onChangeSelection: (control_name: string, item_id: number) => void;

	/**
	 * Returns an array of all the items in the stock that are currently selected.
	 * @returns An array of all the items in the stock that are currently selected.
	 * @example
	 * [
	 * 	{ type:1,  id:  1001 },
	 * 	{ type:1,  id:  1002 },
	 * 	{ type:3,  id:  1003 }
	 * 	...
	 * ]
	 */
	getSelectedItems(): StockItem[];

	/**
	 * Returns an array of all the items in the stock that are currently unselected.
	 * @returns An array of all the items in the stock that are currently unselected.
	 * @example
	 * [
	 * 	{ type:1,  id:  1001 },
	 * 	{ type:1,  id:  1002 },
	 * 	{ type:3,  id:  1003 }
	 * 	...
	 * ]
	 */
	getUnselectedItems(): StockItem[];

	//#endregion

	//#region Layout and Visuals

	/** If you moved an item from the stock control manually (ex: after a drag'n'drop) and want to reset their positions to their original ones, you can call this method. Note: it is the same as updateDisplay() without arugment, not sure why there are two methods. */
	resetItemsPosition(): void;

	/**
	 * Update the display completely.
	 * @param from The element to animate the item from. When the `from` parameter is specified, all new items will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the items will be created and placed immediately inside the stock.
	 * @example this.myStockControl.updateDisplay();
	 */
	updateDisplay(from: string | HTMLElement): void;

	/** Margin between items of a stock. Default is 5 pixels. */
	item_margin: number;

	/**
	 * With this method you can change dynamically the weight of the item types in a stock control. Items are immediately re-sorted with the new weight.
	 * @param weightDictionary A dictionary of item type ids and their new weights. The key is the type id and the value is the new weight. If a type id is not present in the dictionary, it is not changed.
	 * @example
	 * // Item type 1 gets a new weight of 10, 2 a new weight of 20, 3 a new weight of 30.
	 * this.myStockControl.changeItemsWeight( { 1: 10, 2: 20, 3: 30 } );
	 * @example
	 * // Be careful with object initialisers with variables, use the bracket notation.
	 * // Item type 1 gets a new weight of 10
	 * var card_type = 1;
	 * this.myStockControl.changeItemsWeight( { [card_type]: 10 } );
	 */
	changeItemsWeight(weightDictionary: { [typeId: number]: number }): void;

	/**
	 * Center the stock items in the middle of the stock container.
	 * @example this.myStock.centerItems = true;
	 */
	centerItems: boolean;

	/**
	 * This functions sents stock `horizontal_overlap` and `vertical_overlap`, the calls `updateDisplay()`.
	 * @param horizontal_percent Make items of the stock control "overlap" each other, to save space. By default, horizontal_overlap is 0 (but there is also item_margin which affects spacing). When horizontal_overlap=20, it means that a stock item will overlap to only show 20% of the width of all the previous items. horizontal_overlap can't be greater than 100.
	 * @param vertical_percent There is two modes, in one mode it used to adjust every 2nd item (See the games "Jaipur" or "Koryŏ"), second mode when setting use_vertical_overlap_as_offset=false is more/less normal overlap with vertical layout except its perentage of overlap (opposite of horizontal_overlap).
	 */
	setOverlap(horizontal_percent: number, vertical_percent: number): void;

	/** 
	 * Make items of the stock control "overlap" each other, to save space. By default, horizontal_overlap is 0 (but there is also item_margin which affects spacing).
	 * When horizontal_overlap=20, it means that a stock item will overlap to only show 20% of the width of all the previous items. horizontal_overlap can't be greater than 100.
	 */
	horizontal_overlap: number;
	/** There is two modes, in one mode it used to adjust every 2nd item (See the games "Jaipur" or "Koryŏ"), second mode when setting use_vertical_overlap_as_offset=false is more/less normal overlap with vertical layout except its perentage of overlap (opposite of horizontal_overlap). */
	vertical_overlap: number;

	/** If set to true, the vertical overlap will instead be applied to every other element creating a staggered effect. */
	use_vertical_overlap_as_offset: boolean;

	/**
	 * Stock does not play well if you attempt to inline-block it with other blocks, to fix that you have to set this flag which will calculate width properly
	 * @example mystock.autowidth = true;
	 */
	autowidth: boolean;

	/** If true, the items will be ordered based on the weights given. */
	order_items: boolean;

	/**
	 * Resets the controls item width and height.
	 * @param width
	 * @param height 
	 * @param background_width 
	 * @param background_height 
	 * @returns {void}
	 * @example stock.resizeItems(100, 120, 150, 170);
	*/
	resizeItems: (width: number, height: number, background_width?: number, background_height?: number) => void;

	/** The duration of all animations in milliseconds. Default is 1000ms. */
	duration: number;
	/** Defines the extra classes that should be added to the stock items, joined as a space separated string. */
	extraClasses: string;

	/**
	 * The template used to crete the item divs. This template can (and likely should) include the following variables in the form of ${variableName}: id, extra_classes, top, left, width, height, position, image, additional_style.
	 * @example
	 * // This is the default template
	 * mystock.jstpl_stock_item ='<div id="${id}" class="stockitem ${extra_classes}" style="top:${top}px;left:${left}px;width:${width}px;height:${height}px;${position};background-image:url(\'${image}\');${additional_style}"></div>';
	 */
	jstpl_stock_item: string;
	//#endregion

	/**
	 * Using onItemCreate, you can trigger a method each time a new item is added to the Stock, in order to customize it.
	 * @param itemDiv The div element of the item that was created.
	 * @param typeId The type id of the item that was created. This must be a type id that was previously defined with `addItemType`.
	 * @param itemId The unique id of the item that was created. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns {void}
	 * @example
	 * // During "setup" phase, we associate our method "setupNewCard" with the creation of a new stock item:
	 * this.myStockItem.onItemCreate = dojo.hitch( this, 'setupNewCard' );
	 * 
	 * // And here is our "setupNewCard":
	 * setupNewCard: function( card_div, card_type_id, card_id )
	 * {
	 * 	// Add a special tooltip on the card:
	 * 	this.addTooltip( card_div.id, _("Some nice tooltip for this item"), '' );
	 * 	// Note that "card_type_id" contains the type of the item, so you can do special actions depending on the item type
	 * 	// Add some custom HTML content INSIDE the Stock item:
	 * 	dojo.place( this.format_block( 'jstpl_my_card_content', {
	 * 		....
	 * 	} ), card_div.id );
	 * }
	 */
	onItemCreate: (itemDiv: HTMLElement, typeId: number, itemId: number) => void;

	/**
	 * Function handler called when div is removed. This is useful to clean up any event handlers or other data associated with the div.
	 * @param itemDiv The div element of the item that is being deleted.
	 * @param typeId The type id of the item that is being deleted. This will be a type id that was previously defined with `addItemType`.
	 * @param itemId The unique id of the item that is being deleted. This id will be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns {void}
	 * @example
	 * this.myStock.onItemDelete = (itemDiv, typeId, itemId) => { console.log("card deleted from myStock: "+itemId); };
	 */
	onItemDelete: (itemDiv: HTMLElement, typeId: number, itemId: number) => void;
}