interface XYWH {
    x: number;
    y: number;
    w: number;
    h: number;
}
/**
 * The Zone component is meant to organise items of the same type inside a predefined space.
 *
 * Zones are not great at responsive design and are intended for fixed-size spaces. If you want a responsive zone-like structure, you should use the {@link Stock} component instead.
 * @example
 * // Zone's always target an existing HTML element. In your template file, define the area you want to use as a zone. This should be styled to have a fixed size, or us should use the 'SetFluidWidth' method to make it responsive.
 * <div id="my_zone" style="width: 100px;"></div>
 *
 * // Then create the zone and set the pattern you want to use to organize the items.
 * this.my_zone = new ebg.zone();
 * this.my_zone.create(this, $('my_zone'), <item_width>, <item_height>);
 * this.my_zone.setPattern( <mode> ); // See 'setPattern' for available modes.
 *
 * // Then you can add and remove items using their DOM ids:
 * this.my_zone.placeInZone( <item_id> );
 * this.my_zone.removeFromZone( <item_id> );
* The interface for the `ebg/zone` module.
* Partial: This has been partially typed based on a subset of the BGA source code.
*/
declare class Zone_Template {
    page: InstanceType<BGA.CorePage> | null;
    container_div: HTMLElement | null;
    item_height: number | null;
    item_width: number | null;
    instantaneous: boolean;
    items: {
        id: string;
        weight: number;
    }[];
    control_name: string | null;
    item_margin: number;
    autowidth: boolean;
    autoheight: boolean;
    item_pattern: 'grid' | 'diagonal' | 'verticalfit' | 'horizontalfit' | 'ellipticalfit' | 'custom';
    /**
     * Initializes the field values for this zone, and updates the container_div position type if needed.
     * @param page The game which this zone is a part of.
     * @param container_div The div that will contain the items in this zone.
     * @param item_width An integer for the width of the objects you want to organize in this zone.
     * @param item_height An integer for the height of the objects you want to organize in this zone.
     */
    create(page: InstanceType<BGA.CorePage>, container_div: HTMLElement, item_width: number, item_height: number): void;
    /** Connects an `onresize` event to the window which will update this zone's display. */
    setFluidWidth(): void;
    /**
     * Sets what pattern the zone uses to position and arrange elements. The zone package comes with many positioning patterns pre-coded; these allow your items to take on a variety of arrangements.
     * @param pattern The pattern to use for this zone. The following patterns are available:
     * - 'grid' (which is the default, if you never actually call setPattern)
     * - 'diagonal'
     * - 'verticalfit'
     * - 'horizontalfit'
     * - 'ellipticalfit'
     * - 'custom'
    */
    setPattern(pattern: typeof this.item_pattern): void;
    /** Checks if this zone contains an item with the matching DOM id. */
    isInZone(id: string): boolean;
    /**
     * After creating an object that you want to add to the zone as a classic HTML template (dojo.place / this.format_block), this is used to add and position the object in the zone.
     * @param target_id The DOM id of the object to add to the zone.
     * @param weight The weight of the object to add to the zone. This is used to determine the order of the items in the zone. Whenever a new item is added, all elements in the items array is sorted by weight, in ascending order with ties broken by the order they were added.
     */
    placeInZone(target_id: string, weight?: number): void;
    /**
     * Removes the object with the matching DOM id from the zone.
     * @param target The DOM id of the object to remove from the zone.
     * @param destroy If true, the object will be removed from the DOM entirely. If false, the object will be removed from the zone but remain in the DOM.
     * @param animateTo If set, the object will animate to the specified DOM element (using {@link Gamegui.slideToObject}). This happens before the object is destroyed if destroy is true.
     */
    removeFromZone(target: string | HTMLElement, destroy: boolean, animateTo: string | HTMLElement): void;
    /**
     * Removes and destroys all objects from the zone.
     */
    removeAll(): void;
    /**
     * Repositions all objects in the zone. This is useful if the zone's size has changed, or if the pattern has changed.
     */
    updateDisplay(): void;
    /**
     * Determines the position of an item based on the zone's pattern.
     * @param index The index of the item in the zone.
     * @param width The width of the zone.
     * @param height The height of the zone.
     * @param count The number of items in the zone.
     */
    itemIdToCoords(index: number, width: number, height: number, count: number): XYWH;
    itemIdToCoordsGrid(index: number, width: number): XYWH;
    itemIdToCoordsDiagonal(index: number, width: number): XYWH;
    itemIdToCoordsVerticalFit(index: number, width: number, height: number, count: number): XYWH;
    itemIdToCoordsHorizontalFit(index: number, width: number, height: number, count: number): XYWH;
    itemIdToCoordsEllipticalFit(index: number, width: number, height: number, count: number): XYWH;
    /** Returns the count of items within this zone. */
    getItemNumber(): number;
    /**
     * Returns the DOM id for all elements in the zone, in order of how they are displayed (weight and order added).
    */
    getItems(): string[];
}
declare let Zone: DojoJS.DojoClass<Zone_Template, []>;
export = Zone;
declare global {
    namespace BGA {
        type Zone = typeof Zone;
        interface EBG {
            zone: Zone;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=zone.d.ts.map