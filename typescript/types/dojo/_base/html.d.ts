import dojo = require("./kernel");
import dom = require("../dom");
import domStyle = require("../dom-style");
import domAttr = require("../dom-attr");
import domProp = require("../dom-prop");
import domClass = require("../dom-class");
import domConstruct = require("../dom-construct");
import domGeo = require("../dom-geometry");
type DomConstruct = typeof domConstruct;
type Dom = typeof dom;
declare global {
    namespace DojoJS {
        interface Dojo extends DomConstruct, Dom {
            /**
             * Returns true if the requested attribute is specified on the
             * given element, and false otherwise.
             */
            hasAttr: typeof domAttr.has;
            /**
             * Gets an attribute on an HTML element.
             * Because sometimes this uses node.getAttribute, it should be a string,
             * but it can also get any other attribute on a node, therefore it is unsafe
             * to type just a string.
             */
            getAttr: typeof domAttr.get;
            /**
             * Sets an attribute on an HTML element.
             */
            setAttr: typeof domAttr.set;
            /**
             * Removes an attribute from an HTML element.
             */
            removeAttr: typeof domAttr.remove;
            /**
             * Returns an effective value of a property or an attribute.
             */
            getNodeProp: typeof domAttr.getNodeProp;
            /**
             * Gets or sets an attribute on an HTML element.
             */
            attr: typeof domAttr.get & typeof domAttr.set;
            /**
             * Returns whether or not the specified classes are a portion of the
             * class list currently applied to the node.
             */
            hasClass: typeof domClass.contains;
            /**
             * Adds the specified classes to the end of the class list on the
             * passed node. Will not re-apply duplicate classes.
             */
            addClass: typeof domClass.add;
            /**
             * Removes the specified classes from node. No `contains()`
             * check is required.
             */
            removeClass: typeof domClass.remove;
            /**
             * Replaces one or more classes on a node if not present.
             * Operates more quickly than calling dojo.removeClass and dojo.addClass
             */
            replaceClass: typeof domClass.replace;
            /**
             * Adds a class to node if not present, or removes if present.
             * Pass a boolean condition if you want to explicitly add or remove.
             * Returns the condition that was specified directly or indirectly.
             */
            toggleClass: typeof domClass.toggle;
            _toDom: typeof domConstruct.toDom;
            _destroyElement: typeof domConstruct.destroy;
            /**
             * Returns object with special values specifically useful for node
             * fitting.
             */
            getPadExtents: typeof domGeo.getPadExtents;
            _getPadExtents: typeof domGeo.getPadExtents;
            /**
             * returns an object with properties useful for noting the border
             * dimensions.
             */
            getBorderExtents: typeof domGeo.getBorderExtents;
            _getBorderExtents: typeof domGeo.getBorderExtents;
            /**
             * Returns object with properties useful for box fitting with
             * regards to padding.
             */
            getPadBorderExtents: typeof domGeo.getPadBorderExtents;
            _getPadBorderExtents: typeof domGeo.getPadBorderExtents;
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
            getMarginExtents: typeof domGeo.getMarginExtents;
            _getMarginExtents: typeof domGeo.getMarginExtents;
            /**
             * returns an object that encodes the width, height, left and top
             * positions of the node's margin box.
             */
            getMarginBox: typeof domGeo.getMarginBox;
            _getMarginBox: typeof domGeo.getMarginBox;
            /**
             * Returns an object that encodes the width, height, left and top
             * positions of the node's content box, irrespective of the
             * current box model.
             */
            getContentBox: typeof domGeo.getContentBox;
            _getContentBox: typeof domGeo.getContentBox;
            /**
             * Sets the size of the node's contents, irrespective of margins,
             * padding, or borders.
             */
            setContentSize: typeof domGeo.setContentSize;
            /**
             * sets the size of the node's margin box and placement
             * (left/top), irrespective of box model. Think of it as a
             * passthrough to setBox that handles box-model vagaries for
             * you.
             */
            setMarginBox: typeof domGeo.setMarginBox;
            /**
             * Returns true if the current language is left-to-right, and false otherwise.
             */
            isBodyLtr: typeof domGeo.isBodyLtr;
            _isBodyLtr: typeof domGeo.isBodyLtr;
            /**
             * Returns an object with {node, x, y} with corresponding offsets.
             */
            docScroll: typeof domGeo.docScroll;
            _docScroll: typeof domGeo.docScroll;
            /**
             * Deprecated method previously used for IE6-IE7.  Now, just returns `{x:0, y:0}`.
             */
            getIeDocumentElementOffset: typeof domGeo.getIeDocumentElementOffset;
            _getIeDocumentElementOffset: typeof domGeo.getIeDocumentElementOffset;
            /**
             * In RTL direction, scrollLeft should be a negative value, but IE
             * returns a positive one. All codes using documentElement.scrollLeft
             * must call this function to fix this error, otherwise the position
             * will offset to right when there is a horizontal scrollbar.
             */
            fixIeBiDiScrollLeft: typeof domGeo.fixIeBiDiScrollLeft;
            _fixIeBiDiScrollLeft: typeof domGeo.fixIeBiDiScrollLeft;
            /**
             * Gets the position and size of the passed element relative to
             * the viewport (if includeScroll==false), or relative to the
             * document root (if includeScroll==true).
             */
            position: typeof domGeo.position;
            /**
             * returns an object that encodes the width and height of
             * the node's margin box
             */
            getMarginSize: typeof domGeo.getMarginSize;
            _getMarginSize: typeof domGeo.getMarginSize;
            /**
             * Getter/setter for the margin-box of node.
             */
            marginBox: typeof domGeo.getMarginBox & typeof domGeo.setMarginBox;
            /**
             * Getter/setter for the content-box of node.
             */
            contentBox: typeof domGeo.getContentBox & typeof domGeo.setContentSize;
            /**
             * @deprecated Use position() for border-box x/y/w/h or marginBox() for margin-box w/h/l/t.
             */
            coords(node: Node | string, includeScroll?: boolean): {
                w?: number;
                h?: number;
                l?: number;
                t?: number;
                x?: number;
                y?: number;
            };
            /**
             * Gets a property on an HTML element.
             */
            getProp: typeof domProp.get;
            /**
             * Sets a property on an HTML element.
             */
            setProp: typeof domProp.set;
            /**
             * Gets or sets a property on an HTML element.
             */
            prop: typeof domProp.get & typeof domProp.set;
            /**
             * Returns a "computed style" object.
             */
            getComputedStyle: typeof domStyle.getComputedStyle;
            /**
             * Accesses styles on a node.
             */
            getStyle: typeof domStyle.get;
            /**
             * Sets styles on a node.
             */
            setStyle: typeof domStyle.set;
            /**
             * converts style value to pixels on IE or return a numeric value.
             */
            toPixelValue: typeof domStyle.toPixelValue;
            __toPixelValue: typeof domStyle.toPixelValue;
            /**
             * Accesses styles on a node. If 2 arguments are
             * passed, acts as a getter. If 3 arguments are passed, acts
             * as a setter.
             */
            style: typeof domStyle.get & typeof domStyle.set;
        }
    }
}
export = dojo;
//# sourceMappingURL=html.d.ts.map