declare global {
    namespace DojoJS {
        interface DomGeometryWidthHeight {
            w?: number;
            h?: number;
        }
        interface DomGeometryBox extends DomGeometryWidthHeight {
            l?: number;
            t?: number;
        }
        interface DomGeometryBoxExtents extends DomGeometryBox {
            r?: number;
            b?: number;
        }
        interface Point {
            x: number;
            y: number;
        }
        interface DomGeometryXYBox extends DomGeometryWidthHeight, Point {
        }
        interface DomGeometry {
            boxModel: 'border-box' | 'content-box';
            /**
             * Returns object with special values specifically useful for node
             * fitting.
             */
            getPadExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
            /**
             * returns an object with properties useful for noting the border
             * dimensions.
             */
            getBorderExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
            /**
             * Returns object with properties useful for box fitting with
             * regards to padding.
             */
            getPadBorderExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
            /**
             * returns object with properties useful for box fitting with
             * regards to box margins (i.e., the outer-box).
             * - l/t = marginLeft, marginTop, respectively
             * - w = total width, margin inclusive
             * - h = total height, margin inclusive
             * The w/h are used for calculating boxes.
             * Normally application code will not need to invoke this
             * directly, and will use the ...box... functions instead.
             */
            getMarginExtents(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBoxExtents | throws<TypeError>;
            /**
             * returns an object that encodes the width, height, left and top
             * positions of the node's margin box.
             */
            getMarginBox(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBox | throws<TypeError>;
            /**
             * Returns an object that encodes the width, height, left and top
             * positions of the node's content box, irrespective of the
             * current box model.
             */
            getContentBox(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryBox | throws<TypeError>;
            /**
             * Sets the size of the node's contents, irrespective of margins,
             * padding, or borders.
             */
            setContentSize(node: Element | string, box: DomGeometryWidthHeight, computedStyle?: CSSStyleDeclaration): void | throws<TypeError>;
            /**
             * sets the size of the node's margin box and placement
             * (left/top), irrespective of box model. Think of it as a
             * passthrough to setBox that handles box-model vagaries for
             * you.
             */
            setMarginBox(node: Element | string, box: DomGeometryBox, computedStyle?: CSSStyleDeclaration): void | throws<TypeError>;
            /**
             * Returns true if the current language is left-to-right, and false otherwise.
             */
            isBodyLtr(doc?: Document): boolean;
            /**
             * Returns an object with {node, x, y} with corresponding offsets.
             */
            docScroll(doc?: Document): Point;
            /**
             * Deprecated method previously used for IE6-IE7.  Now, just returns `{x:0, y:0}`.
             */
            getIeDocumentElementOffset(doc: Document): Point;
            /**
             * In RTL direction, scrollLeft should be a negative value, but IE
             * returns a positive one. All codes using documentElement.scrollLeft
             * must call this function to fix this error, otherwise the position
             * will offset to right when there is a horizontal scrollbar.
             */
            fixIeBiDiScrollLeft(scrollLeft: number, doc?: Document): number;
            /**
             * Gets the position and size of the passed element relative to
             * the viewport (if includeScroll==false), or relative to the
             * document root (if includeScroll==true).
             */
            position(node: Element | string, includeScroll?: boolean): DomGeometryXYBox | throws<TypeError>;
            /**
             * returns an object that encodes the width and height of
             * the node's margin box
             */
            getMarginSize(node: Element | string, computedStyle?: CSSStyleDeclaration): DomGeometryWidthHeight | throws<TypeError>;
            /**
             * Normalizes the geometry of a DOM event, normalizing the pageX, pageY,
             * offsetX, offsetY, layerX, and layerX properties
             */
            normalizeEvent(event: Event | string): void | throws<TypeError>;
        }
    }
}
declare const _default: DojoJS.DomGeometry;
export = _default;
//# sourceMappingURL=dom-geometry.d.ts.map