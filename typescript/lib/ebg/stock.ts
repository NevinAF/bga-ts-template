import e = require("dojo");
import declare = require("dojo/_base/declare");

declare global {
	namespace BGA {
		interface StockItem {
			id: BGA.ID;
			type: BGA.ID;
			loc?: string | HTMLElement;
		}
		
		interface StockItemType {
			/** The sort priority when arranging items to be displayed within a stock. Lower values are displayed first. If two items have the same weight, the are sorted by the order by which they were added to the stock. */
			weight: number;
			/** The sprite sheet URL for this `BGA.StockItemType`. This image should contain a grid of images matching the `itemWidth` and `itemHeight` used for the `Stock.create(..)` method. If this sprite sheet is not a single row of images, the `Stock.image_items_per_row` property is used to specify the number of sprites per row in this image. */
			image: string;
			/** The sprite sheet position for this `BGA.StockItemType`. This is a zero indexed number defined by the following formula: `row * Stock.image_items_per_row + col`. This number should never exceed the number of sprites in the sprite sheet. */
			image_position: number;
		}
		
		/** For each stock control, you can specify a selection mode. The selection mode determines how the user can interact with the items in the stock. */
		interface StockSelectionMode {
			/** No item can be selected by the player. */
			NONE: 0,
			/** A maximum of one item can be selected by the player at a time. */
			SINGLE: 1,
			/** Default. Multiple items can be selected by the player at the same time. */
			MULTI: 2
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
	}
}

/**
 * A component that you can use in your game interface to display a set of elements of the same size that need to be arranged in single or multiple lines. Usually used for displaying cards and tokens in a flexible way. This component can be used to:
 * - Display a set of cards, typically hands (examples: Hearts, Seasons, The Boss, Race for the Galaxy).
 * - Display items in player panels (examples: Takenoko, Amyitis, ...)
 * - Black dice and cubes on cards in Troyes are displayed with stock components.
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
 */
class Stock_Template {
	// #region Properties

	page: InstanceType<BGA.Gamegui> | null = null;
	/** The div element to attach all of the stock items to. */
	container_div: Element | string | null = null;
	item_height: number | null = null;
	item_width: number | null = null;
	backgroundSize: string | null = null;
	/** A dictionary of all defined item types, listed by type id. */
	item_type: Record<BGA.ID, BGA.StockItemType> = {};
	items: BGA.StockItem[] = [];
	item_selected: Record<number, number> = {};
	next_item_id = 1;
	/** The id of the container_div. */
	control_name: string | null = null;
	selectable: BGA.StockSelectionMode[keyof BGA.StockSelectionMode] = 2;
	selectionApparance: BGA.StockSelectionAppearance = "border";
	apparenceBorderWidth: CSSStyleDeclaration["borderWidth"] = "1px";
	selectionClass = "stockitem_selected";
	/** Defines the extra classes that should be added to the stock items, joined as a space separated string. */
	extraClasses = "";
	/**
	 * Center the stock items in the middle of the stock container.
	 * @example this.myStock.centerItems = true;
	 */
	centerItems = false;
	/** Margin between items of a stock. Default is 5 pixels. */
	item_margin = 5;
	/**
	 * Stock does not play well if you attempt to inline-block it with other blocks, to fix that you have to set this flag which will calculate width properly
	 * @example mystock.autowidth = true;
	 */
	autowidth = false;
	/** If true, the items will be ordered based on the weights given. */
	order_items = true;
	/** 
	 * Make items of the stock control "overlap" each other, to save space. By default, horizontal_overlap is 0 (but there is also item_margin which affects spacing).
	 * When horizontal_overlap=20, it means that a stock item will overlap to only show 20% of the width of all the previous items. horizontal_overlap can't be greater than 100.
	 */
	horizontal_overlap = 0;
	/** There is two modes, in one mode it used to adjust every 2nd item (See the games "Jaipur" or "Koryŏ"), second mode when setting use_vertical_overlap_as_offset=false is more/less normal overlap with vertical layout except its perentage of overlap (opposite of horizontal_overlap). */
	vertical_overlap = 0;
	/** If set to true, the vertical overlap will instead be applied to every other element creating a staggered effect. */
	use_vertical_overlap_as_offset = true;

	/**
	 * Using onItemCreate, you can trigger a method each time a new item is added to the Stock, in order to customize it.
	 * @param item_div The div element of the item that was created.
	 * @param typeId The type id of the item that was created. This must be a type id that was previously defined with `addItemType`.
	 * @param item_div_id The unique name of the stock item.
	 * @returns {void}
	 * @example
	 * // During "setup" phase, we associate our method "setupNewCard" with the creation  of a new stock item:
	 * this.myBGA.StockItem.onItemCreate = dojo.hitch( this, 'setupNewCard' );
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
	onItemCreate: ((item_div: HTMLElement, typeId: BGA.ID, item_div_id: `${string}_item_${number}`) => void) | null = null;

	/**
	* Function handler called when div is removed. This is useful to clean up any event handlers or other data associated with the div.
	* @param itemDiv The div element of the item that is being deleted.
	* @param typeId The type id of the item that is being deleted. This will be a type id that was previously defined with `addItemType`.
	* @param itemId The unique id of the item that is being deleted. This id will be unique within the stock and is used to identify the item when removing it from the stock.
	* @returns {void}
	* @example
	* this.myStock.onItemDelete = (itemDiv, typeId, itemId) => { console.log("card deleted from myStock: "+itemId); };
	*/
	onItemDelete: ((item_div_id: string, typeId: BGA.ID, itemId: BGA.ID) => void) | null = null;

	/**
	 * The template used to crete the item divs. This template can (and likely should) include the following variables in the form of ${variableName}: id, extra_classes, top, left, width, height, position, image, additional_style.
	 * @example
	 * // This is the default template
	 * mystock.jstpl_stock_item ='<div id="${id}" class="stockitem ${extra_classes}" style="top:${top}px;left:${left}px;width:${width}px;height:${height}px;${position};background-image:url(\'${image}\');${additional_style}"></div>';
	 */
	jstpl_stock_item = '<div id="${id}" class="stockitem ${extra_classes}" style="top:${top}px;left:${left}px;width:${width}px;height:${height}px;${position};background-image:url(\'${image}\');${additional_style}"></div>';
	image_items_per_row: number | null = null;
	image_in_vertical_row = false;
	hResize: DojoJS.Handle | null = null;
	/** The duration of all animations in milliseconds. Default is 1000ms. */
	duration = 1000;

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
	create(page: InstanceType<BGA.Gamegui>, container_div: Element | string, itemWidth: number, itemHeight: number): void
	{
		if (typeof container_div === 'string') {
			console.error("stock::create: second argument must be a HTML object and not a string");
		}
		if (itemWidth === undefined) {
			console.error("stock::create: item_width is undefined");
		}
		if (itemHeight === undefined) {
			console.error("stock::create: item_height is undefined");
		}
		this.page = page;
		this.container_div = container_div;
		this.item_width = itemWidth;
		this.item_height = itemHeight;
		if (e.style(this.container_div, "position") !== "absolute") {
			e.style(this.container_div, "position", "relative");
		}
		this.hResize = e.connect(window, "onresize", this, e.hitch(this, function (e) {
			this.updateDisplay();
		}));
		page.registerEbgControl(this);
	}

	/**
	 * Un-sets all state properties of the stock (including current items) and disconnects the resize handle. This has no external effect and does not destroy any html elements.
	 */
	destroy(): void
	{
		if (this.hResize !== null)
			e.disconnect(this.hResize);
		// @ts-ignore - this is a type bug.
		this.items = {};
		this.page = null;
		this.container_div = null;
		this.control_name = null;
	}
	
	/**
	 * Define a new type of item, `BGA.StockItemType`, and add it to the stock with given type id. It is mandatory to define a new item type before adding it to the stock. The list of defined item types are always available in `item_type` property.
	 * @param typeId 
	 * @param weight {@link BGA.StockItemType.weight} The sort priority when arranging items to be displayed within a stock. Lower values are displayed first. If two items have the same weight, the are sorted by the order by which they were added to the stock.
	 * @param image {@link BGA.StockItemType.image} The sprite sheet URL for this `BGA.StockItemType`. This image should contain a grid of images matching the `itemWidth` and `itemHeight` used for the `Stock.create(..)` method. If this sprite sheet is not a single row of images, the `Stock.image_items_per_row` property is used to specify the number of sprites per row in this image.
	 * @param image_pos {@link BGA.StockItemType.image_position} The sprite sheet position for this `BGA.StockItemType`. This is a zero indexed number defined by the following formula: `row * Stock.image_items_per_row + col`. This number should never exceed the number of sprites in the sprite sheet.
	 * @returns {void}
	 */
	addItemType(typeId: BGA.ID, weight: number, image: string, image_pos?: number | Falsy): void
	{
		this.item_type[typeId] = {
			weight: toint(weight)!,
			image,
			image_position: image_pos || 0
		};
	}

	/**
	 * Add an item to the stock, with the specified type, but without a unique ID. This is useful when items of the same type don't need to be uniquely identified. For example, a pile of money tokens in a game. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param typeId The type id of the item to add to the stock. This must be a type id that was previously defined with `addItemType`.
	 * @param from The element to animate the item from. When the `from` parameter is specified, the item will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the item will be created and placed immediately inside the stock.
	 * @returns {void}
	 */
	addToStock(typeId: BGA.ID, from?: string | HTMLElement ): void
	{
		var id = this.next_item_id;
		this.next_item_id++;
		this.addToStockWithId(typeId, id, from);
	}

	/**
	 * Add an item to the stock, with the specified type and unique ID. This is useful when items of the same type need to be uniquely identified. For example, if there are two of the same cards but in different orders (like a draw area), the position of the card within the stock is important. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param typeId The type id of the item to add to the stock. This must be a type id that was previously defined with `addItemType`.
	 * @param itemId The unique id of the item to add to the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @param from The element to animate the item from. When the `from` parameter is specified, the item will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the item will be created and placed immediately inside the stock.
	 * @param loc The target location for this specific stock item.
	 * @returns {void}
	 */
	addToStockWithId(typeId: BGA.ID, itemId: BGA.ID, from?: string | HTMLElement, loc?: string | HTMLElement): void
	{
		let item: BGA.StockItem = { id: itemId, type: typeId };
		let animate = true;
		if (loc !== undefined) {
			if (loc === ":first") {
				animate = false;
			} else {
				item.loc = loc;
			}
		}
		if (document.getElementById(this.getItemDivId(itemId))) {
			for (let i in this.items) {
				if (this.items[i]!.id === itemId) {
					this._removeFromStockItemInPosition(i as BGA.ID);
				}
			}
			e.destroy(this.getItemDivId(itemId));
		}
		animate ? this.items.push(item) : this.items.unshift(item);
		if (this.order_items) {
			this.sortItems();
		}
		this.updateDisplay();
	}

	/**
	 * Remove an item of the specific type from the stock. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param typeId The type id of the item to be removed from the stock. This must be a type id that was previously defined with `addItemType`, and the item must have been added to the stock with `addToStock`.
	 * @param to The element to animate the item to. When the `to` parameter is specified, the item will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the item to a specific location on the page. Either way, the item is destroyed after the animation is complete.
	 * @param noupdate Default is false. If set to "true" it will prevent the Stock display from changing. This is useful when multiple (but not all) items are removed at the same time, to avoid ghost items appearing briefly. If you pass noupdate you have to call updateDisplay() after all items are removed.
	 * @returns {boolean}
	 */
	removeFromStock(typeId: BGA.ID, to?: string | HTMLElement, noupdate?: boolean): boolean
	{
		for (let index in this.items) {
			if (this.items[index]!.type === typeId) {
				this._removeFromStockItemInPosition(index as BGA.ID, to, noupdate);
				return true;
			}
		}
		return false;
	}

	/**
	 * Remove an item of the specific type from the stock. Only use `addToStock` and `removeFromStock` OR `addToStockWithId` and `removeFromStockById` for a given stock, not both.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @param to The element to animate the item to. When the `to` parameter is specified, the item will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the item to a specific location on the page. Either way, the item is destroyed after the animation is complete.
	 * @param noupdate Default is false. If set to "true" it will prevent the Stock display from changing. This is useful when multiple (but not all) items are removed at the same time, to avoid ghost items appearing briefly. If you pass noupdate you have to call updateDisplay() after all items are removed.
	 * @returns {boolean}
	 */
	removeFromStockById(itemId: BGA.ID, to?: string | HTMLElement, noupdate?: boolean): boolean
	{
		for (let index in this.items) {
			if (this.items[index]!.id === itemId) {
				this._removeFromStockItemInPosition(index as BGA.ID, to, noupdate);
				return true;
			}
		}

		return false;
	}

	_removeFromStockItemInPosition(index: BGA.ID, to?: string | HTMLElement, noupdate?: boolean): void | throws<TypeError>
	{
		let item = this.items[index]!;
		let itemDivId = this.getItemDivId(item.id);
		if (this.onItemDelete)
			this.onItemDelete(itemDivId, item.type, item.id);
		this.items.splice(parseInt(String(index)), 1);
		this.unselectItem(item.id);
		let itemDiv = document.getElementById(itemDivId);
		if (to !== undefined) {
			let toElement = typeof to === "string" ? document.getElementById(to) : to;
			let slide = this.page!.slideToObject(itemDiv!, toElement!);
			let fade = e.fadeOut({ node: itemDiv! });
			let chain = e.fx.chain([slide, fade]);
			chain.play();
		} else {
			let fade = e.fadeOut({ node: itemDiv! });
			fade.play();
		}
		e.addClass(itemDiv!, "to_be_destroyed");
		if (!noupdate) {
			this.updateDisplay();
		}
	}

	/** Removes all items from the stock. */
	removeAll(): void
	{
		for (let index in this.items) {
			let item = this.items[index]!;
			if (this.onItemDelete)
				this.onItemDelete(this.getItemDivId(item.id), item.type, item.id);
		}
		this.items = [];
		this.item_selected = {};
		this.next_item_id = 1;
		e.empty(this.control_name!);
	}

	/**
	 * Removes all items from the stock.
	 * @param to The element to animate the items to. When the `to` parameter is specified, the items will be animated from the stock to the location of the to element. The location moved to is always an absolute position at the top left of the to div. This is optional and can be used to animate the items to a specific location on the page. Either way, the items are destroyed after the animation is complete.
	 * @returns {void}
	*/
	removeAllTo(to?: string | HTMLElement): void
	{
		var ids: BGA.ID[] = [];
		for (var i in this.items)
			ids.push(this.items[i]!.id);
		for (var i in ids)
			this.removeFromStockById(ids[i]!, to, true);
		this.updateDisplay();
	}

	//#endregion

	//#region Getters

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
	getPresentTypeList(): Record<BGA.ID, 1>
	{
		let result: Record<BGA.ID, 1> = {};
		for (let i in this.items)
			result[this.items[i]!.type] = 1;
		return result;
	}

	/**
	 * A pure function that returns the id for an item given it's id. Same as `{container_div.id}`_item_{itemId}`.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns Returns `{container_div.id}`_item_{itemId}`.
	 */
	getItemDivId(itemId: BGA.ID): `${string}_item_${number}`
	{
		return `${this.control_name}_item_${itemId}`;
	}

	/**
	 * Returns the total number of items in the stock.
	 * @returns The total number of items in the stock.
	 */
	count(): number
	{
		return this.items.length;
	}

	/** Same as {@link count} */
	getItemNumber(): number
	{
		return this.items.length;
	}

	/**
	 * Returns the array of items in the stock. The array is a shallow copy of the internal array of items.
	 * @returns An array of items in the stock.
	 */
	getAllItems(): BGA.StockItem[]
	{
		let result: BGA.StockItem[] = [];
		for (let i in this.items)
			result.push(this.items[i]!);
		return result;
	}

	getItemsByType(typeId: BGA.ID): BGA.StockItem[]
	{
		let result: BGA.StockItem[] = [];
		for (let i in this.items)
			if (this.items[i]!.type === typeId)
				result.push(this.items[i]!);
		return result;
	}

	getFirstItemOfType(typeId: BGA.ID): BGA.StockItem | null
	{
		for (let i in this.items)
			if (this.items[i]!.type === typeId)
				return this.items[i]!;
		return null;
	}

	getItemsByWeight(weight: number): BGA.StockItem[]
	{
		let result: BGA.StockItem[] = [];
		for (let i in this.items)
			if (this.item_type[this.items[i]!.type]!.weight === weight)
				result.push(this.items[i]!);
		return result;
	}

	getFirstItemWithWeight(weight: number): BGA.StockItem | null
	{
		for (let i in this.items)
			if (this.item_type[this.items[i]!.type]!.weight === weight)
				return this.items[i]!;
		return null;
	}

	/**
	 * Returns the item with the specified unique id. Only useful for obtaining the item's type id.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns The item with the specified unique id.
	 */
	getItemById(itemId: BGA.ID): BGA.StockItem | null
	{
		for (let i in this.items)
			if (this.items[i]!.id === itemId)
				return this.items[i]!;
		return null;
	}

	getItemTypeById(itemId: BGA.ID): BGA.ID | null
	{
		for (let i in this.items)
			if (this.items[i]!.id === itemId)
				return this.items[i]!.type;
		return null;
	}

	/**
	 * Returns the type id of the item with the specified unique id. If you want the weight of an item using the type, use item_type[typeId].weight.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns The type id of the item with the specified unique id
	 */
	getItemWeightById(itemId: BGA.ID): number | null
	{
		for (let i in this.items)
			if (this.items[i]!.id === itemId)
				return this.item_type[this.items[i]!.type]!.weight;
		return null;
	}

	//#endregion

	//#region Selection

	/**
	 * Sets the selection mode for the stock. The selection mode determines how the user can interact with the items in the stock.
	 * @param mode The selection mode to set for the stock.
	 * @returns {void}
	 */
	setSelectionMode<T extends keyof BGA.StockSelectionMode>(mode: BGA.StockSelectionMode[T]): void
	{
		if (mode != this.selectable) {
			this.unselectAll();
			this.selectable = mode;
			if (0 == mode)
				e.query("#" + this.control_name + " .stockitem")
					.addClass("stockitem_unselectable");
			else e.query("#" + this.control_name + " .stockitem_unselectable")
				.removeClass("stockitem_unselectable");
		}
	}

	/** Sets the selection appearance for the stock. @see BGA.StockSelectionAppearance */
	setSelectionAppearance(appearanceType: BGA.StockSelectionAppearance): void	{
		this.unselectAll();
		this.selectionApparance = appearanceType;
	}

	/**
	 * Predicate function that returns true if the item with the specified unique id is selected.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns True if the item with the specified unique id is selected.
	 */
	isSelected(itemId: BGA.ID): boolean{
		return !(
			!this.item_selected[itemId] || 1 != this.item_selected[itemId]
		)
	}

	/**
	 * Selects the item with the specified unique id.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns {void}
	 */
	selectItem(itemId: BGA.ID): void
	{
		var i = $(this.getItemDivId(itemId))!;
		"border" == this.selectionApparance
			? e.style(i, "borderWidth", this.apparenceBorderWidth)
			: "disappear" == this.selectionApparance
			? e.fadeOut({ node: i }).play()
			: "class" == this.selectionApparance &&
				e.addClass(i, this.selectionClass);
		this.item_selected[itemId] = 1;
	}

	selectAll()
	{
		var hasAny = false;
		for (var t in this.items)
			if (!this.isSelected(this.items[t]!.id)) {
				this.selectItem(this.items[t]!.id);
				hasAny = true;
			}
		hasAny && this.onChangeSelection(this.control_name!);
	}

	/**
	 * Deselects the item with the specified unique id.
	 * @param itemId The unique id of the item to be removed from the stock. This id must be unique within the stock and is used to identify the item when removing it from the stock.
	 * @returns {void}
	 */
	unselectItem(itemId: BGA.ID): void
	{
		var i = $(this.getItemDivId(itemId))!;
		"border" == this.selectionApparance
			? e.style(i, "borderWidth", "0px")
			: "disappear" == this.selectionApparance
			? e.fadeIn({ node: i }).play()
			: "class" == this.selectionApparance &&
			  e.removeClass(i, this.selectionClass);
		this.item_selected[itemId] = 0;
	}

	/** Deselects all items in the stock. */
	unselectAll(): void
	{
		var hasAny = false;
		for (var t in this.items)
			if (this.isSelected(this.items[t]!.id)) {
				this.unselectItem(this.items[t]!.id);
				hasAny = true;
			}
		hasAny && this.onChangeSelection(this.control_name!);
	}

	onClickOnItem(event: Event): void
	{
		event.stopPropagation();
		if (0 !== this.selectable) {
			var t = (this.control_name + "_item_").length,
				id = (event.currentTarget as Element).id.substr(t) as BGA.ID;
			if (this.isSelected(id)) this.unselectItem(id);
			else {
				1 === this.selectable && this.unselectAll();
				this.selectItem(id);
			}
			this.onChangeSelection(this.control_name!, id);
		}
	}

	/**
	 * Selects all items in the stock matching the specified type id.
	 * @param typeId The type id of the items to be selected. This must be a type id that was previously defined with `addItemType`.
	 * @returns {void}
	 */
	selectItemsByType(typeId: BGA.ID): void
	{
		for (var t in this.items)
			if (this.items[t]!.type === typeId && !this.isSelected(this.items[t]!.id))
				this.selectItem(this.items[t]!.id);
	}

	/**
	 * Deselects all items in the stock matching the specified type id.
	 * @param typeId The type id of the items to be deselected. This must be a type id that was previously defined with `addItemType`.
	 * @returns {void}
	 */
	unselectItemsByType(typeId: BGA.ID): void
	{
		for (var t in this.items)
			if (this.items[t]!.type === typeId && this.isSelected(this.items[t]!.id))
				this.unselectItem(this.items[t]!.id);
	}

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
	onChangeSelection = (control_name: string, item_id?: BGA.ID): void => {};

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
	getSelectedItems(): BGA.StockItem[]
	{
		var result: BGA.StockItem[] = [];
		for (var t in this.items) {
			var i = this.items[t]!;
			this.isSelected(i.id) && result.push(i);
		}
		return result;
	}

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
	getUnselectedItems(): BGA.StockItem[]
	{
		var result: BGA.StockItem[] = [];
		for (var t in this.items) {
			var i = this.items[t]!;
			this.isSelected(i.id) || result.push(i);
		}
		return result;
	}

	//#endregion

	//#region Layout and Visuals

	/** If you moved an item from the stock control manually (ex: after a drag'n'drop) and want to reset their positions to their original ones, you can call this method. Note: it is the same as updateDisplay() without arugment, not sure why there are two methods. */
	resetItemsPosition(): void
	{
		this.updateDisplay();
	}

	/**
	 * Update the display completely.
	 * @param from The element to animate the item from. When the `from` parameter is specified, all new items will be created at the location of the from element and animate to the stock. The location create is always an absolute position at the top left of the from div. This is optional and can be used to animate the item from a specific location on the page. If this is not specified, the items will be created and placed immediately inside the stock.
	 * @example this.myStockControl.updateDisplay();
	 */
	updateDisplay(from?: string | HTMLElement): void
	{
		var a: number | string;
		if ($(this.control_name)) {
			var i = e.marginBox(this.control_name!),
				n = this.item_width!,
				o = 0;
			a = "auto";
			if (0 != this.horizontal_overlap) {
				n = Math.round(
					(this.item_width! *
						this.horizontal_overlap) /
						100
				);
				o = this.item_width! - n;
				a = 1;
			}
			var s = 0;
			0 != this.vertical_overlap &&
				(s =
					Math.round(
						(this.item_height! *
							this.vertical_overlap) /
							100
					) *
					(this.use_vertical_overlap_as_offset
						? 1
						: -1));
			var r = i.w!;
			if (this.autowidth) {
				r = e.marginBox($("page-content")!).w!;
			}
			var l = 0,
				d = 0,
				c = Math.max(
					1,
					Math.floor((r - o) / (n + this.item_margin))
				),
				h = 0,
				u = 0,
				p = 0;
			for (var m in this.items) {
				var g = this.items[m]!,
					f = this.getItemDivId(g.id);
				"auto" != a && (a as number)++;
				if (undefined === g.loc) {
					var _ = Math.floor(p / c);
					l =
						(h = Math.max(h, _)) *
						(this.item_height! +
							s +
							this.item_margin);
					d = (p - h * c) * (n + this.item_margin);
					u = Math.max(u, d + n);
					0 != this.vertical_overlap &&
						p % 2 == 0 &&
						this.use_vertical_overlap_as_offset &&
						(l += s);
					if (this.centerItems) {
						d +=
							(r -
								(_ ==
								Math.floor(this.count() / c)
									? this.count() % c
									: c) *
									(n + this.item_margin)) /
							2;
					}
					p++;
				}
				var v = $(f)!;
				if (v) {
					undefined === g.loc
						? e.fx
								.slideTo({
									node: v,
									top: l,
									left: d,
									duration: this.duration,
									// @ts-ignore
									unit: "px",
								})
								.play()
						: this.page!.slideToObject(
									v,
									g.loc,
									this.duration
								).play();
					"auto" != a && e.style(v, "zIndex", a as string);
				} else {
					var b = this.item_type[g.type]!;
					b ||
						console.error(
							"Stock control: Unknow type: " + b
						);
					if (undefined === f)
						console.error(
							"Stock control: Undefined item id"
						);
					else if ("object" == typeof f) {
						console.error(
							"Stock control: Item id with 'object' type"
						);
						console.error(f);
					}
					additional_style = "";
					null !== this.backgroundSize &&
						(additional_style +=
							"background-size:" +
							this.backgroundSize);
					var y = e.trim(
						e.string.substitute(
							this.jstpl_stock_item,
							{
								id: f,
								width: this.item_width,
								height: this.item_height,
								top: l,
								left: d,
								image: b.image,
								position:
									"auto" == a
										? ""
										: "z-index:" + a,
								extra_classes:
									this.extraClasses,
								additional_style:
									additional_style,
							}
						)
					);
					e.place(y, this.control_name!);
					v = $(f)!;
					undefined !== g.loc &&
						this.page!.placeOnObject(v, g.loc);
					0 == this.selectable &&
						e.addClass(v, "stockitem_unselectable");
					e.connect(v, "onclick", this as Stock_Template, "onClickOnItem");
					if (0 !== toint(b.image_position)) {
						var w = 0,
							C = 0;
						if (this.image_items_per_row) {
							var k = Math.floor(
								b.image_position /
									this.image_items_per_row
							);
							if (this.image_in_vertical_row) {
								C =
									100 *
									(b.image_position -
										k *
											this
												.image_items_per_row);
								w = 100 * k;
							} else {
								w =
									100 *
									(b.image_position -
										k *
											this
												.image_items_per_row);
								C = 100 * k;
							}
							e.style(
								v,
								"backgroundPosition",
								"-" + w + "% -" + C + "%"
							);
						} else {
							w = 100 * b.image_position;
							e.style(
								v,
								"backgroundPosition",
								"-" + w + "% 0%"
							);
						}
					}
					this.onItemCreate &&
						this.onItemCreate(v, g.type, f);
					if (undefined !== from) {
						this.page!.placeOnObject(v, from);
						if (undefined === g.loc) {
							var x = e.fx.slideTo({
								node: v,
								top: l,
								left: d,
								duration: this.duration,
								// @ts-ignore
								unit: "px",
							});
							(x =
								this.page!.transformSlideAnimTo3d(
									x,
									v,
									this.duration,
									Number(null)
								)).play();
						} else
							this.page!.slideToObject(
									v,
									g.loc,
									this.duration
								)
								.play();
					} else {
						e.style(v, "opacity", 0);
						e.fadeIn({ node: v }).play();
					}
				}
			}
			var T =
				(h + 1) *
				(this.item_height! + s + this.item_margin);
			e.style(this.control_name!, "height", T + "px");
			if (this.autowidth) {
				u > 0 && (u += this.item_width! - n);
				e.style(this.control_name!, "width", u + "px");
			}
		}
	}

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
	changeItemsWeight(weightDictionary: Record<BGA.ID, number>): void
	{
		for (var t in weightDictionary) {
			var i = weightDictionary[t as BGA.ID]!;
			this.item_type[t as BGA.ID]
				? (this.item_type[t as BGA.ID]!.weight = i)
				: console.error("unknow item type" + t);
		}
		this.sortItems();
		this.updateDisplay();
	}

	sortItems()
	{
		var t = e.hitch(this, function(e: BGA.StockItem, t: BGA.StockItem) {
			return this.item_type[e.type]!.weight >
				this.item_type[t.type]!.weight
				? 1
				: this.item_type[e.type]!.weight <
				  this.item_type[t.type]!.weight
				? -1
				: 0;
		});
		this.items.sort(t);
	}

	/**
	 * This functions sents stock `horizontal_overlap` and `vertical_overlap`, the calls `updateDisplay()`.
	 * @param horizontal_percent Make items of the stock control "overlap" each other, to save space. By default, horizontal_overlap is 0 (but there is also item_margin which affects spacing). When horizontal_overlap=20, it means that a stock item will overlap to only show 20% of the width of all the previous items. horizontal_overlap can't be greater than 100.
	 * @param vertical_percent There is two modes, in one mode it used to adjust every 2nd item (See the games "Jaipur" or "Koryŏ"), second mode when setting use_vertical_overlap_as_offset=false is more/less normal overlap with vertical layout except its perentage of overlap (opposite of horizontal_overlap).
	 */
	setOverlap(horizontal_percent: number, vertical_percent?: number): void
	{
		this.horizontal_overlap = horizontal_percent;
		this.vertical_overlap = vertical_percent || 0;
		this.updateDisplay();
	}

	/**
	 * Resets the controls item width and height.
	 * @param width
	 * @param height 
	 * @param background_width 
	 * @param background_height 
	 * @returns {void}
	 * @example stock.resizeItems(100, 120, 150, 170);
	*/
	resizeItems(width: number, height: number, background_width?: number, background_height?: number): void
	{
		this.item_height = height;
		this.item_width = width;
		e.query(`#${this.control_name} .stockitem`).style("width", `${width}px`);
		e.query(`#${this.control_name} .stockitem`).style("height", `${height}px`);
		if (background_width !== undefined && background_height !== undefined) {
			e.query(`#${this.control_name} .stockitem`).style("backgroundSize", `${background_width}px ${background_height}px`);
			this.backgroundSize = `${background_width}px ${background_height}px`;
		}
		this.updateDisplay();
	}

	//#endregion
}

let Stock = declare("ebg.stock", Stock_Template);
export = Stock;

declare global {
	namespace BGA {
		type Stock = typeof Stock;
		interface EBG { stock: Stock; }
	}
	var ebg: BGA.EBG;

	/** A global variable caused by bad code in ebg/stock:updateDisplay. Don't use a global variable with this name or it may unexpectedly be overriden. */
	var additional_style: string;
}