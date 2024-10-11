/**
 * Scrollmap is a BGA client side component to display an infinite game area. It supports Scrolling and Panning. Scrolling - allows user to scroll area inside the view port using the buttons drawn on the top/bottom/left/right. Panning - allows user to drag the surface area (using mouse).
 *
 * Examples of game that use Scrollmap (try on BGA or watch):
 * - Carcassonn
 * - Saboteu
 * - Takenok
 * - Taluva
 *
 * @see {@link https://en.doc.boardgamearena.com/Scrollmap for more information}
 *
 * @example
 * // Add this to the .tpl file or anywhere using html js.
 * <div id="map_container">
 * 	<div id="map_scrollable"></div>
 * 	<div id="map_surface"></div>
 * 	<div id="map_scrollable_oversurface"></div>
 * 	<div class="movetop"></div>
 * 	<div class="movedown"></div>
 * 	<div class="moveleft"></div>
 * 	<div class="moveright"></div>
 * </div>
 *
 * // Add something like this to the .css file
 * // Scrollable area
 *
 * #map_container {
 * 	position: relative;
 * 	overflow: hidden;
 *
 * 	width: 100%;
 * 	height: 400px;
 * }
 * #map_scrollable, #map_scrollable_oversurface {
 * 	position: absolute;
 * }
 * #map_surface {
 * 	position: absolute;
 * 	top: 0px;
 * 	left: 0px;
 * 	width: 100%;
 * 	height: 100%;
 * 	cursor: move;
 * }
 *
 * // This is some extra stuff to extend the container/
 *
 * #map_footer {
 *     text-align: center;
 * }
 *
 * // Move arrows
 *
 * .movetop,.moveleft,.moveright,.movedown {
 * 	display: block;
 * 	position: absolute;
 * 	background-image: url('../../../img/common/arrows.png');
 * 	width: 32px;
 * 	height: 32px;
 * }
 *
 * .movetop {
 * 	top: 0px;
 * 	left: 50%;
 * 	background-position: 0px 32px;
 * }
 * .moveleft {
 * 	top: 50%;
 * 	left: 0px;
 * 	background-position: 32px 0px;
 * }
 * .moveright {
 * 	top: 50%;
 * 	right: 0px;
 * 	background-position: 0px 0px;
 * }
 * .movedown {
 * 	bottom: 0px;
 * 	left: 50%;
 * 	background-position: 32px 32px;
 * }
 *
 * // Add this to the define function as a dependency
 * define([
 * 	"dojo","dojo/_base/declare",
 * 	"ebg/core/gamegui",
 * 	"ebg/counter",
 * 	"ebg/scrollmap"     /// <==== HERE
 * ], ...
 *
 * // Finally, to link your HTML code with your Javascript, place this in your Javascript "Setup" method:
 * this.scrollmap = new ebg.scrollmap(); // declare an object (this can also go in constructor)
 * // Make map scrollable
 * this.scrollmap.create( $('map_container'),$('map_scrollable'),$('map_surface'),$('map_scrollable_oversurface') ); // use ids from template
 * this.scrollmap.setupOnScreenArrows( 150 ); // this will hook buttons to onclick functions with 150px scroll step
 * Partial: This has been partially typed based on a subset of the BGA source code.
 */
declare class ScrollMap_Template {
    container_div: HTMLElement | null;
    scrollable_div: HTMLElement | null;
    surface_div: HTMLElement | null;
    onsurface_div: HTMLElement | null;
    isdragging: boolean;
    dragging_offset_x: number;
    dragging_offset_y: number;
    dragging_handler: DojoJS.Handle | null;
    dragging_handler_touch: DojoJS.Handle | null;
    board_x: number;
    board_y: number;
    bEnableScrolling: boolean;
    options: {
        disableVerticalScrolling: boolean;
        onsurfaceDragEnabled: boolean;
    };
    scrollDelta?: number;
    /** Creates event handlers for all divs for handling. */
    create(container_div: HTMLElement, scrollable_div: HTMLElement, surface_div: HTMLElement, onsurface_div: HTMLElement, options?: {
        disableVerticalScrolling?: boolean;
        onsurfaceDragEnabled?: boolean;
    }): void;
    /** Handles the mouse down event. */
    onMouseDown(t: MouseEvent | TouchEvent): void;
    /** Handles the mouse up event. */
    onMouseUp(t: MouseEvent | TouchEvent): void;
    /** Handles the mouse move event. */
    onMouseMove(t: MouseEvent | TouchEvent): void;
    /**
     * Scrolls to the specified position. This is animated unless duration is 0.
     * @param xpos The x position to scroll to.
     * @param ypos The y position to scroll to.
     * @param duration The duration of the animation in milliseconds. Default is 350ms.
     * @param delay The delay before the animation starts in milliseconds. Default is 0ms.
     */
    scrollto(xpos: number, ypos: number, duration?: number, delay?: number): void;
    /**
     * Offsets the scroll position by the specified amount. This is animated unless duration is 0.
     * @param xoffset The amount to offset the x position by.
     * @param yoffset The amount to offset the y position by.
     * @param duration The duration of the animation in milliseconds. Default is 350ms.
     * @param delay The delay before the animation starts in milliseconds. Default is 0ms.
     */
    scroll(xoffset: number, yoffset: number, duration?: number, delay?: number): void;
    /**
     * Scrolls the the center of all elements matching the querySelector. The center is the center of the bounds these object occupy, not the average center. This is always animated with the default duration of 350ms.
     * @param querySelector The query selector to match elements to scroll to. If undefined, this will find the center of all elements in the scrollable div.
    */
    scrollToCenter(querySelector?: string): void;
    /**
     * Adds clickable NWSE controls this scrollmap.
     * @param scrollDelta The amount to scroll when any control is clicked. This value is in pixels.
    */
    setupOnScreenArrows(scrollDelta: number): void;
    onMoveTop(e: MouseEvent): void;
    onMoveLeft(e: MouseEvent): void;
    onMoveRight(e: MouseEvent): void;
    onMoveDown(e: MouseEvent): void;
    /**
     * Checks if the specified position is visible on the screen.
     * @param x The x position to check.
     * @param y The y position to check.
    */
    isVisible(x: number, y: number): boolean;
    /** Enables all scrolling functionality.{@link disableScrolling} for more info. */
    enableScrolling(): void;
    /** Disables all scrolling functionality. This will prevent all interaction with the scrollmap and hide all scroll controls. */
    disableScrolling(): void;
}
declare let ScrollMap: DojoJS.DojoClass<ScrollMap_Template, []>;
export = ScrollMap;
declare global {
    namespace BGA {
        type ScrollMap = typeof ScrollMap;
        interface EBG {
            scrollmap: ScrollMap;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=scrollmap.d.ts.map