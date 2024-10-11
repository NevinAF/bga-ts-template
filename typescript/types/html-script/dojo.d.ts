declare namespace DojoJS {
    interface Handle {
        remove(): void;
    }
    interface Require {
        (config: Record<string, any>, dependencies?: string | string[], callback?: (...args: any[]) => void): Require;
        (dependencies: string | string[], callback: (...args: any[]) => void): Require;
        async: number | boolean;
        has: DojoJS.Has;
        isXdurl(url: string): boolean;
        initSyncLoader(dojoRequirePlugin: any, checkDojoRequirePlugin: any, transformToAmd: any): Record<string, any>;
        getXhr(): XMLHttpRequest | /* ActiveXObject */ any;
        getText(url: string, async?: boolean, onLoad?: (responseText: string, async?: boolean) => void): string;
        eval(text: string, hint?: string): any;
        signal(type: string, args: any[]): void;
        on(type: string, listener: (...args: any[]) => void): Handle;
        map: {
            [id: string]: any;
        };
        waitms?: number;
        legacyMode: boolean;
        rawConfig: DojoJS._base.Config;
        baseUrl: string;
        combo?: {
            add: () => void;
            done(callback: (mids: string[], url?: string) => void, req: Require): void;
            plugins?: Record<string, any>;
        };
        idle(): boolean;
        toAbsMid(mid: string, referenceModule?: string): string;
        toUrl(name: string, referenceModule?: string): string;
        undef(moduleId: string, referenceModule?: string): void;
        pageLoaded: number | boolean;
        injectUrl(url: string, callback?: () => void, owner?: HTMLScriptElement): HTMLScriptElement;
        log(...args: any[]): void;
        trace: {
            (group: string, args: any[]): void;
            on: boolean | number;
            group: Record<string, any>;
            set(group: string | Record<string, any>, value: any): void;
        };
        boot?: [string[], Function] | number;
    }
    interface Define {
        (mid: string, dependencies?: string[], factory?: any): void;
        (dependencies: string[], factory?: any): void;
        amd: string;
    }
    interface Dojo {
    }
    interface Dojox {
    }
    interface Dijit {
    }
}
declare var require: DojoJS.Require;
declare var define: DojoJS.Define;
declare var dojo: DojoJS.Dojo;
declare var dijit: DojoJS.Dijit;
declare var dojox: DojoJS.Dojox;
declare module "require" {
    export = require;
}
declare module "module" {
    var module: any;
    export = module;
}
declare module "exports" {
    var exports: any;
    export = exports;
}
declare module "dojo" {
    export = dojo;
}
declare module "dijit" {
    export = dijit;
}
declare module "dojox" {
    export = dojox;
}
declare namespace DojoJS {
    namespace dnd {
        interface DndLocation {
            t: number;
            l: number;
        }
        interface AutoScroll {
            getViewport(doc?: Document): DomGeometryBox;
            V_TRIGGER_AUTOSCROLL: number;
            H_TRIGGER_AUTOSCROLL: number;
            V_AUTOSCROLL_VALUE: number;
            H_AUTOSCROLL_VALUE: number;
            /**
             * Called at the start of a drag.
             */
            autoScrollStart(d: Document): void;
            /**
             * a handler for mousemove and touchmove events, which scrolls the window, if
             * necessary
             */
            autoScroll(e: Event): void;
            _validNodes: {
                div: number;
                p: number;
                td: number;
            };
            _validOverflow: {
                auto: number;
                scroll: number;
            };
            /**
             * a handler for mousemove and touchmove events, which scrolls the first available
             * Dom element, it falls back to exports.autoScroll()
             */
            autoScrollNodes(e: Event): void;
        }
        interface AutoSource extends Source {
        }
        interface AutoSourceConstructor {
            new (node: Node | string, params?: SourceArgs): AutoSource;
            prototype: AutoSource;
        }
        interface Avatar {
            /**
             * constructor function;
             * it is separate so it can be (dynamically) overwritten in case of need
             */
            construct(): void;
            /**
             * destructor for the avatar; called to remove all references so it can be garbage-collected
             */
            destroy(): void;
            /**
             * updates the avatar to reflect the current DnD state
             */
            update(): void;
            /**
             * generates a proper text to reflect copying or moving of items
             */
            _generateText(): string;
        }
        interface AvatarConstructor {
            new (manager: Manager): Avatar;
            prototype: Avatar;
        }
        interface Common {
            getCopyKeyState(evt: Event): boolean;
            _uniqueId: number;
            /**
             * returns a unique string for use with any DOM element
             */
            getUniqueId(): string;
            _empty: {};
            /**
             * returns true if user clicked on a form element
             */
            isFormElement(e: Event): boolean;
        }
        interface ContainerItem<T extends Record<string, any>> {
            type?: string[];
            data?: T;
        }
        interface ContainerArgs {
            /**
             * a creator function, which takes a data item, and returns an object like that:
             * {node: newNode, data: usedData, type: arrayOfStrings}
             */
            creator<T extends Record<string, any>>(data?: ContainerItem<T>): {
                node: Element;
                data: T;
                type: string[];
            };
            /**
             * don't start the drag operation, if clicked on form elements
             */
            skipForm: boolean;
            /**
             * node or node's id to use as the parent node for dropped items
             * (must be underneath the 'node' parameter in the DOM)
             */
            dropParent: Node | string;
            /**
             * skip startup(), which collects children, for deferred initialization
             * (this is used in the markup mode)
             */
            _skipStartup: boolean;
        }
        interface Container extends Type<typeof import("dojo/Evented")> {
            /**
             * Indicates whether to allow dnd item nodes to be nested within other elements.
             * By default this is false, indicating that only direct children of the container can
             * be draggable dnd item nodes
             */
            skipForm: boolean;
            /**
             * Indicates whether to allow dnd item nodes to be nested within other elements.
             * By default this is false, indicating that only direct children of the container can
             * be draggable dnd item nodes
             */
            allowNested: boolean;
            /**
             * The DOM node the mouse is currently hovered over
             */
            current: HTMLElement;
            /**
             * Map from an item's id (which is also the DOMNode's id) to
             * the dojo/dnd/Container.Item itself.
             */
            map: {
                [name: string]: ContainerItem<any>;
            };
            /**
             * creator function, dummy at the moment
             */
            creator<T extends Record<string, any>>(data?: ContainerItem<T>): {
                node: Element;
                data: T;
                type: string[];
            };
            /**
             * returns a data item by its key (id)
             */
            getItem<T extends Record<string, any>>(key: string): ContainerItem<T>;
            /**
             * associates a data item with its key (id)
             */
            setITem<T extends Record<string, any>>(key: string, data: ContainerItem<T>): void;
            /**
             * removes a data item from the map by its key (id)
             */
            delItem(key: string): void;
            /**
             * iterates over a data map skipping members that
             * are present in the empty object (IE and/or 3rd-party libraries).
             */
            forInItems<T extends Record<string, any>, U>(f: (i: ContainerItem<T>, idx?: number, container?: Container) => void, o?: U): U;
            /**
             * removes all data items from the map
             */
            clearItems(): void;
            /**
             * returns a list (an array) of all valid child nodes
             */
            getAllNodes(): NodeList<Node>;
            /**
             * sync up the node list with the data map
             */
            sync(): this;
            /**
             * inserts an array of new nodes before/after an anchor node
             */
            insertNodes(data: ContainerItem<any>[], before?: boolean, anchor?: Element): this;
            /**
             * prepares this object to be garbage-collected
             */
            destroy(): void;
            markupFactory<T>(params: ContainerArgs, node: Element, Ctor: Constructor<T>): T;
            /**
             * collects valid child items and populate the map
             */
            startup(): void;
            /**
             * event processor for onmouseover or touch, to mark that element as the current element
             */
            onMouseOver(e: Event): void;
            /**
             * event processor for onmouseout
             */
            onMouseOut(e: Event): void;
            /**
             * event processor for onselectevent and ondragevent
             */
            onSelectStart(e: Event): void;
            /**
             * this function is called once, when mouse is over our container
             */
            onOverEvent(e: Event): void;
            /**
             * this function is called once, when mouse is out of our container
             */
            onOutEvent(e: Event): void;
            /**
             * changes a named state to new state value
             */
            _changeState(type: string, newState: string): void;
            /**
             * adds a class with prefix "dojoDndItem"
             */
            _addItemClass(node: Element, type: string): void;
            /**
             * removes a class with prefix "dojoDndItem"
             */
            _removeItemClass(node: Element, type: string): void;
            /**
             * gets a child, which is under the mouse at the moment, or null
             */
            _getChildByEvent(e: Event): void;
            /**
             * adds all necessary data to the output of the user-supplied creator function
             */
            _normalizedCreator<T extends Record<string, any>>(item: ContainerItem<T>, hint: string): this;
        }
        interface ContainerConstructor {
            /**
             * a constructor of the Container
             */
            new (node: Node | string, params?: ContainerArgs): Container;
            prototype: Container;
        }
        interface Common {
            /**
             * returns a function, which creates an element of given tag
             * (SPAN by default) and sets its innerHTML to given text
             */
            _createNode(tag: string): (text: string) => HTMLElement;
            /**
             * creates a TR/TD structure with given text as an innerHTML of TD
             */
            _createTrTd(text: string): HTMLTableRowElement;
            /**
             * creates a SPAN element with given text as its innerHTML
             */
            _createSpan(text: string): HTMLSpanElement;
            /**
             * a dictionary that maps container tag names to child tag names
             */
            _defaultCreatorNodes: {
                ul: string;
                ol: string;
                div: string;
                p: string;
            };
            /**
             * takes a parent node, and returns an appropriate creator function
             */
            _defaultCreator<T>(node: HTMLElement): {
                node: HTMLElement;
                data: T;
                type: string;
            };
        }
        interface Manager extends Type<typeof import("dojo/Evented")> {
            OFFSET_X: number;
            OFFSET_Y: number;
            overSource(source: Source): void;
            outSource(source: Source): void;
            startDrag(source: Source, nodes: HTMLElement[], copy?: boolean): void;
            canDrop(flag: boolean): void;
            stopDrag(): void;
            makeAvatar(): Avatar;
            updateAvatar(): void;
            onMouseMove(e: MouseEvent): void;
            onMouseUp(e: MouseEvent): void;
            onKeyDown(e: KeyboardEvent): void;
            onKeyUp(e: KeyboardEvent): void;
            _setCopyStatus(copy?: boolean): void;
        }
        interface ManagerConstructor {
            /**
             * the manager of DnD operations (usually a singleton)
             */
            new (): Manager;
            prototype: Manager;
            /**
             * Returns the current DnD manager.  Creates one if it is not created yet.
             */
            manager(): Manager;
        }
        interface Common {
            _manager: Manager;
        }
        interface Move {
            constrainedMoveable: ConstrainedMoveableConstructor;
            boxConstrainedMoveable: BoxConstrainedMoveableConstructor;
            parentConstrainedMoveable: ParentConstrainedMoveableConstructor;
        }
        interface ConstrainedMoveableArgs extends MoveableArgs {
            /**
             * Calculates a constraint box.
             * It is called in a context of the moveable object.
             */
            constraints?: () => DomGeometryBox;
            /**
             * restrict move within boundaries.
             */
            within?: boolean;
        }
        interface ConstrainedMoveable extends Moveable {
            /**
             * Calculates a constraint box.
             * It is called in a context of the moveable object.
             */
            constraints: () => DomGeometryBox;
            /**
             * restrict move within boundaries.
             */
            within: boolean;
        }
        interface ConstrainedMoveableConstructor {
            /**
             * an object that makes a node moveable
             */
            new (node: Node | string, params?: ConstrainedMoveableArgs): ConstrainedMoveable;
        }
        interface BoxConstrainedMoveableArgs extends ConstrainedMoveableArgs {
            /**
             * a constraint box
             */
            box?: DomGeometryBox;
        }
        interface BoxConstrainedMoveable extends ConstrainedMoveable {
            /**
             * a constraint box
             */
            box: DomGeometryBox;
        }
        interface BoxConstrainedMoveableConstructor {
            /**
             * an object, which makes a node moveable
             */
            new (node: Node | string, params?: BoxConstrainedMoveableArgs): BoxConstrainedMoveable;
        }
        type ConstraintArea = 'border' | 'content' | 'margin' | 'padding';
        interface ParentConstrainedMoveableArgs extends ConstrainedMoveableArgs {
            /**
             * A parent's area to restrict the move.
             * Can be "margin", "border", "padding", or "content".
             */
            area?: ConstraintArea;
        }
        interface ParentConstrainedMoveable extends ConstrainedMoveable {
            /**
             * A parent's area to restrict the move.
             * Can be "margin", "border", "padding", or "content".
             */
            area: ConstraintArea;
        }
        interface ParentConstrainedMoveableConstructor {
            /**
             * an object, which makes a node moveable
             */
            new (node: Node | string, params?: ParentConstrainedMoveableArgs): ParentConstrainedMoveable;
        }
        interface MoveableArgs {
            /**
             * A node (or node's id), which is used as a mouse handle.
             * If omitted, the node itself is used as a handle.
             */
            handle?: Node | string;
            /**
             * delay move by this number of pixels
             */
            delay?: number;
            /**
             * skip move of form elements
             */
            skip?: boolean;
            /**
             * a constructor of custom Mover
             */
            mover?: MoverConstructor;
        }
        interface Moveable {
            /**
             * markup methods
             */
            markupFactory<T>(params: MoveableArgs, node: HTMLElement, Ctor: Constructor<T>): T;
            /**
             * stops watching for possible move, deletes all references, so the object can be garbage-collected
             */
            destroy(): void;
            /**
             * event processor for onmousedown/ontouchstart, creates a Mover for the node
             */
            onMouseDown(e: MouseEvent): void;
            /**
             * event processor for onmousemove/ontouchmove, used only for delayed drags
             */
            onMouseMove(e: MouseEvent): void;
            /**
             * event processor for onmouseup, used only for delayed drags
             */
            onMouseUp(e: MouseEvent): void;
            /**
             * called when the drag is detected;
             * responsible for creation of the mover
             */
            onDragDetected(e: Event): void;
            /**
             * called before every move operation
             */
            onMoveStart(mover: Mover): void;
            /**
             * called after every move operation
             */
            onMoveStop(mover: Mover): void;
            /**
             * called during the very first move notification;
             * can be used to initialize coordinates, can be overwritten.
             */
            onFirstMove(mover: Mover, e: Event): void;
            /**
             * called during every move notification;
             * should actually move the node; can be overwritten.
             */
            onMove(mover: Mover, leftTop: DndLocation, e?: Event): void;
            /**
             * called before every incremental move; can be overwritten.
             */
            onMoving(mover: Mover, leftTop: DndLocation): void;
            /**
             * called after every incremental move; can be overwritten.
             */
            onMoved(mover: Mover, leftTop: DndLocation): void;
        }
        interface MoveableConstructor {
            new (node: Node | string, params?: MoveableArgs): Moveable;
            prototype: Moveable;
        }
        interface MoverHost extends Record<string, any> {
            onMoveStart(mover: Mover): void;
            onMoveStop(mover: Mover): void;
        }
        interface Mover extends Type<typeof import("dojo/Evented")> {
            /**
             * event processor for onmousemove/ontouchmove
             */
            onMouseMove(e: MouseEvent): void;
            onMouseUp(e: MouseEvent): void;
            /**
             * makes the node absolute; it is meant to be called only once.
             * relative and absolutely positioned nodes are assumed to use pixel units
             */
            onFirstMove(e: Event): void;
            /**
             * stops the move, deletes all references, so the object can be garbage-collected
             */
            destroy(): void;
        }
        interface MoverConstructor {
            /**
             * an object which makes a node follow the mouse, or touch-drag on touch devices.
             * Used as a default mover, and as a base class for custom movers.
             */
            new (node: HTMLElement, e: MouseEvent, host: MoverHost): Mover;
            prototype: Mover;
        }
        interface Selector extends Container {
            /**
             * The set of id's that are currently selected, such that this.selection[id] == 1
             * if the node w/that id is selected.  Can iterate over selected node's id's like:
             *     for(var id in this.selection)
             */
            selection: {
                [id: string]: number;
            };
            /**
             * is singular property
             */
            singular: boolean;
            /**
             * returns a list (an array) of selected nodes
             */
            getSelectedNodes(): NodeList<Node>;
            /**
             * unselects all items
             */
            selectNone(): this;
            /**
             * selects all items
             */
            selectAll(): this;
            /**
             * deletes all selected items
             */
            deleteSelectedNodes(): this;
            /**
             * iterates over selected items;
             * see `dojo/dnd/Container.forInItems()` for details
             */
            forInSelectedItems<T extends Record<string, any>>(f: (i: ContainerItem<T>, idx?: number, container?: Container) => void, o?: Record<string, any>): void;
            /**
             * event processor for onmousemove
             */
            onMouseMove(e: Event): void;
            /**
             * this function is called once, when mouse is over our container
             */
            onOverEvent(): void;
            /**
             * this function is called once, when mouse is out of our container
             */
            onOutEvent(): void;
            /**
             * unselects all items
             */
            _removeSelection(): this;
            _removeAnchor(): this;
        }
        interface SelectorConstructor {
            /**
             * constructor of the Selector
             */
            new (node: Node | string, params?: ContainerArgs): Selector;
            prototype: Selector;
        }
        /**
         * a dict of parameters for DnD Source configuration. Note that any
         * property on Source elements may be configured, but this is the
         * short-list
         */
        interface SourceArgs {
            [arg: string]: any;
            /**
             * can be used as a DnD source. Defaults to true.
             */
            isSource?: boolean;
            /**
             * list of accepted types (text strings) for a target; defaults to
             * ["text"]
             */
            accept?: string[];
            /**
             * if true refreshes the node list on every operation; false by default
             */
            autoSync?: boolean;
            /**
             * copy items, if true, use a state of Ctrl key otherwisto
             * see selfCopy and selfAccept for more details
             */
            copyOnly?: boolean;
            /**
             * the move delay in pixels before detecting a drag; 0 by default
             */
            delay?: number;
            /**
             * a horizontal container, if true, vertical otherwise or when omitted
             */
            horizontal?: boolean;
            /**
             * copy items by default when dropping on itself,
             * false by default, works only if copyOnly is true
             */
            selfCopy?: boolean;
            /**
             * accept its own items when copyOnly is true,
             * true by default, works only if copyOnly is true
             */
            selfAccept?: boolean;
            /**
             * allows dragging only by handles, false by default
             */
            withHandles?: boolean;
            /**
             * generate text node for drag and drop, true by default
             */
            generateText?: boolean;
        }
        interface Source extends Selector {
            /**
             * checks if the target can accept nodes from this source
             */
            checkAcceptance(source: Container, nodes: HTMLElement[]): boolean;
            /**
             * Returns true if we need to copy items, false to move.
             * It is separated to be overwritten dynamically, if needed.
             */
            copyState(keyPressed: boolean, self?: boolean): boolean;
            /**
             * topic event processor for /dnd/source/over, called when detected a current source
             */
            onDndSourceOver(source: Container): void;
            /**
             * topic event processor for /dnd/start, called to initiate the DnD operation
             */
            onDndStart(source: Container, nodes: HTMLElement[], copy?: boolean): void;
            /**
             * topic event processor for /dnd/drop, called to finish the DnD operation
             */
            onDndDrop(source: Container, nodes: HTMLElement[], copy: boolean, target: Container): void;
            /**
             * topic event processor for /dnd/cancel, called to cancel the DnD operation
             */
            onDndCancel(): void;
            /**
             * called only on the current target, when drop is performed
             */
            onDrop(source: Container, nodes: HTMLElement[], copy?: boolean): void;
            /**
             * called only on the current target, when drop is performed
             * from an external source
             */
            onDropExternal(source: Container, nodes: HTMLElement[], copy?: boolean): void;
            /**
             * called only on the current target, when drop is performed
             * from the same target/source
             */
            onDropInternal(nodes: HTMLElement[], copy?: boolean): void;
            /**
             * called during the active DnD operation, when items
             * are dragged over this target, and it is not disabled
             */
            onDraggingOver(): void;
            /**
             * called during the active DnD operation, when items
             * are dragged away from this target, and it is not disabled
             */
            onDraggingOut(): void;
            /**
             * this function is called once, when mouse is over our container
             */
            onOverEvent(): void;
            /**
             * this function is called once, when mouse is out of our container
             */
            onOutEvent(): void;
            /**
             * assigns a class to the current target anchor based on "before" status
             */
            _markTargetAnchor(before?: boolean): void;
            /**
             * removes a class of the current target anchor based on "before" status
             */
            _unmarkTargetAnchor(): void;
            /**
             * changes source's state based on "copy" status
             */
            _markDndStatus(copy?: boolean): void;
            /**
             * checks if user clicked on "approved" items
             */
            _legalMouseDown(e?: Event): boolean;
        }
        interface SourceConstructor {
            new (node: Node | string, params?: SourceArgs): Source;
            prototype: Source;
        }
        interface Target extends Source {
        }
        interface TargetConstructor {
            new (node: HTMLElement, params: SourceArgs): Target;
            prototype: Target;
        }
        interface TimedMoveableArgs extends MoveableArgs {
            timeout?: number;
        }
        interface TimedMoveable extends Moveable {
            onMoveStop(mover: Mover): void;
            onMove(mover: Mover, leftTop: DndLocation): void;
        }
        interface TimedMoveableConstructor {
            new (node: HTMLElement, params?: TimedMoveableArgs): TimedMoveable;
            prototype: TimedMoveable;
        }
    }
}
declare namespace DojoJS {
    interface BaseOptions {
        /**
         * Query parameters to append to the URL.
         */
        query?: string | {
            [name: string]: any;
        };
        /**
         * Data to transfer.  This is ignored for GET and DELETE
         * requests.
         */
        data?: string | {
            [name: string]: any;
        };
        /**
         * Whether to append a cache-busting parameter to the URL.
         */
        preventCache?: boolean;
        /**
         * Milliseconds to wait for the response.  If this time
         * passes, the then the promise is rejected.
         */
        timeout?: number;
        /**
         * How to handle the response from the server.  Default is
         * 'text'.  Other values are 'json', 'javascript', and 'xml'.
         */
        handleAs?: string;
    }
    interface MethodOptions {
        /**
         * The HTTP method to use to make the request.  Must be
         * uppercase.
         */
        method?: string;
    }
    namespace request {
        interface XhrBaseOptions extends DojoJS.BaseOptions {
            /**
             * Whether to make a synchronous request or not. Default
             * is `false` (asynchronous).
             */
            sync?: boolean;
            /**
             * Data to transfer. This is ignored for GET and DELETE
             * requests.
             */
            data?: string | Record<string, any> | FormData;
            /**
             * Headers to use for the request.
             */
            headers?: {
                [header: string]: string;
            };
            /**
             * Username to use during the request.
             */
            user?: string;
            /**
             * Password to use during the request.
             */
            password?: string;
            /**
             * For cross-site requests, whether to send credentials
             * or not.
             */
            withCredentials?: boolean;
        }
        interface XhrOptions extends XhrBaseOptions, DojoJS.MethodOptions {
        }
        interface Xhr {
            /**
             * Sends a request using XMLHttpRequest with the given URL and options.
             */
            <T>(url: string, options?: XhrOptions): Promise<T>;
            /**
             * Send an HTTP GET request using XMLHttpRequest with the given URL and options.
             */
            get<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
            /**
             * Send an HTTP POST request using XMLHttpRequest with the given URL and options.
             */
            post<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
            /**
             * Send an HTTP PUT request using XMLHttpRequest with the given URL and options.
             */
            put<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
            /**
             * Send an HTTP DELETE request using XMLHttpRequest with the given URL and options.
             */
            del<T>(url: string, options?: DojoJS.request.XhrBaseOptions): Promise<T>;
            /**
             * does the work of portably generating a new XMLHTTPRequest object.
             */
            _create(): XMLHttpRequest | /* ActiveXObject */ any;
        }
    }
}
declare namespace DojoJS {
    interface ExtensionEvent {
        (target: Element | Record<string, any>, listener: EventListener): Handle;
    }
    interface QueryResults<T extends Object> extends ArrayLike<T> {
        /**
         * Iterates over the query results, based on
         * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach.
         * Note that this may executed asynchronously. The callback may be called
         * after this function returns.
         */
        forEach(callback: (item: T, id: string | number, results: this) => void, thisObject?: Object): void | this;
        /**
         * Filters the query results, based on
         * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter.
         * Note that this may executed asynchronously. The callback may be called
         * after this function returns.
         */
        filter(callback: (item: T, id: string | number, results: this) => boolean, thisObject?: Object): this;
        /**
         * Maps the query results, based on
         * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map.
         * Note that this may executed asynchronously. The callback may be called
         * after this function returns.
         */
        map<U extends object>(callback: (item: T, id: string | number, results: this) => U, thisObject?: Object): QueryResults<U>;
        /**
         * This registers a callback for when the query is complete, if the query is asynchronous.
         * This is an optional method, and may not be present for synchronous queries.
         */
        then?: <U>(callback?: ((result: T) => U | DojoJS.Thenable<U>) | null, errback?: ((error: any) => U | DojoJS.Thenable<U> | void) | null) => Promise<U>;
        /**
         * This registers a callback for notification of when data is modified in the query results.
         * This is an optional method, and is usually provided by dojo/store/Observable.
         */
        total: number | Promise<number>;
    }
    interface QueryOptions {
        /**
         * A list of attributes to sort on, as well as direction
         * For example:
         * | [{attribute:"price", descending: true}].
         * If the sort parameter is omitted, then the natural order of the store may be
         * applied if there is a natural order.
         */
        sort?: {
            /**
             * The name of the attribute to sort on.
             */
            attribute: string;
            /**
             * The direction of the sort.  Default is false.
             */
            descending?: boolean;
        }[];
        /**
         * The first result to begin iteration on
         */
        start?: number;
        /**
         * The number of how many results should be returned.
         */
        count?: number;
    }
    interface DojoStoreUtil {
        QueryResults: <T extends Object>(results: T[]) => DojoJS.QueryResults<T>;
    }
    interface DojoStore {
        util: DojoStoreUtil;
    }
    interface Dojo {
        store: DojoStore;
    }
}
declare namespace DojoJS {
    interface WatchHandle extends Handle {
        unwatch(): void;
    }
    interface Stateful {
        /**
         * Used across all instances a hash to cache attribute names and their getter
         * and setter names.
         */
        _attrPairNames: {
            [attr: string]: string;
        };
        /**
         * Helper function for get() and set().
         * Caches attribute name values so we don't do the string ops every time.
         */
        _getAttrNames(name: string): string;
        /**
         * Automatic setting of params during construction
         */
        postscript(params?: Object): void;
        /**
         * Get a property on a Stateful instance.
         */
        get(name: string): any;
        /**
         * Set a property on a Stateful instance
         */
        set(name: string, value: any): this;
        set(name: string, ...values: any[]): this;
        set(name: Object): this;
        /**
         * Internal helper for directly changing an attribute value.
         */
        _changeAttrValue(name: string, value: any): this;
        /**
         * Watches a property for changes
         */
        watch(callback: (prop: string, oldValue: any, newValue: any) => void): WatchHandle;
        watch(name: string, callback: (prop: string, oldValue: any, newValue: any) => void): WatchHandle;
    }
    interface Dojo {
        Stateful: DojoJS.DojoClass<Stateful, []>;
    }
}
declare namespace DijitJS {
    interface Dijit {
    }
    interface WatchHandle extends DojoJS.Handle {
        unwatch(): void;
    }
    type Stateful = DojoJS.Dojo["Stateful"];
    interface _WidgetBase extends Stateful, Destroyable {
        dojoAttachEvent: string;
        dojoAttachPoint: string;
    }
    interface _AttachMixin {
        /**
         * List of widget attribute names associated with data-dojo-attach-point=... in the template, ex: ["containerNode", "labelNode"]
         */
        _attachPoints: string[];
        /**
         * List of connections associated with data-dojo-attach-event=... in the template
         */
        _attachEvents: DojoJS.Handle[];
        /**
         * Object to which attach points and events will be scoped.  Defaults to 'this'.
         */
        attachScope: any;
        /**
         * Search descendants of this.containerNode for data-dojo-attach-point and data-dojo-attach-event.
         *
         * Should generally be left false (the default value) both for performance and to avoid failures when this.containerNode holds other _AttachMixin instances with their own attach points and events.
         */
        searchContainerNode: boolean;
        /**
         * Attach to DOM nodes marked with special attributes.
         */
        buildRendering(): void;
        /**
         * hook for _WidgetsInTemplateMixin
         */
        _beforeFillContent(): void;
        /**
         * Iterate through the dom nodes and attach functions and nodes accordingly.
         *
         * Map widget properties and functions to the handlers specified in the dom node and it's descendants. This function iterates over all nodes and looks for these properties:
         * - dojoAttachPoint/data-dojo-attach-point
         * - dojoAttachEvent/data-dojo-attach-event
         */
        _attachTemplateNodes(rootNode: Element | Node): void;
        /**
         * Process data-dojo-attach-point and data-dojo-attach-event for given node or widget.
         *
         * Returns true if caller should process baseNode's children too.
         */
        _processTemplateNode<T extends (Element | Node | _WidgetBase)>(baseNode: T, getAttrFunc: (baseNode: T, attr: string) => string, attachFunc: (node: T, type: string, func?: Function) => DojoJS.Handle): boolean;
        /**
         * Roughly corresponding to dojo/on, this is the default function for processing a data-dojo-attach-event.  Meant to attach to DOMNodes, not to widgets.
         */
        _attach(node: Element | Node, type: string, func?: Function): DojoJS.Handle;
        /**
         * Detach and clean up the attachments made in _attachtempalteNodes.
         */
        _detachTemplateNodes(): void;
        destroyRendering(preserveDom?: boolean): void;
    }
    interface _AttachMixinConstructor extends DojoJS.DojoClass<_AttachMixin> {
    }
    interface _WidgetBase extends InstanceType<typeof dojo.Stateful>, Destroyable {
        /**
         * Gets the right direction of text.
         */
        getTextDir(text: string): string;
        /**
         * Set element.dir according to this.textDir, assuming this.textDir has a value.
         */
        applyTextDir(element: HTMLElement, text?: string): void;
        /**
         * Wraps by UCC (Unicode control characters) option's text according to this.textDir
         */
        enforceTextDirWithUcc(option: HTMLOptionElement, text: string): string;
        /**
         * Restores the text of origObj, if needed, after enforceTextDirWithUcc, e.g. set("textDir", textDir).
         */
        restoreOriginalText(origObj: HTMLOptionElement): HTMLOptionElement;
    }
    interface _ConfirmDialogMixin extends _WidgetsInTemplateMixin {
        /**
         * HTML snippet for action bar, overrides _DialogMixin.actionBarTemplate
         */
        actionBarTemplate: string;
        /**
         * Label of OK button.
         */
        buttonOk: string;
        /**
         * Label of cancel button.
         */
        buttonCancel: string;
    }
    interface _Contained {
        /**
         * Returns the previous child of the parent or null if this is the
         * first child of the parent.
         */
        getPreviousSibling<T extends _WidgetBase>(): T;
        /**
         * Returns the next child of the parent or null if this is the last
         * child of the parent.
         */
        getNextSibling<T extends _WidgetBase>(): T;
        /**
         * Returns the index of this widget within its container parent.
         * It returns -1 if the parent does not exist or if the parent is
         * not a dijit/_Container.
         */
        getIndexInParent(): number;
    }
    interface _ContainedConstructor extends DojoJS.DojoClass<_Contained> {
    }
    interface _Container {
        buildRendering(): void;
        /**
         * Makes the given widget a child of this widget.
         */
        addChild<T extends _WidgetBase>(widget: T, insertIndex?: number): void;
        /**
         * Removes the passed widget instance from this widget but does
         * not destroy it.  You can also pass in an integer indicating
         * the index within the container to remove (ie, removeChild(5) removes the sixth widget)
         */
        removeChild<T extends _WidgetBase>(widget: T): void;
        removeChild<T extends number>(widget: number): void;
        /**
         * Returns true if widget has child widgets, i.e. if this.containerNode contains widgets.
         */
        hasChildren(): boolean;
        /**
         * Gets the index of the child in this container or -1 if not found
         */
        getIndexOfChild<T extends _WidgetBase>(widget: T): number;
    }
    interface _ContainerConstructor extends DojoJS.DojoClass<_Container> {
    }
    interface CSSStateNodes {
        [node: string]: string;
    }
    interface _CssStateMixin {
        /**
         * True if cursor is over this widget
         */
        hovering: boolean;
        /**
         * True if mouse was pressed while over this widget, and hasn't been released yet
         */
        active: boolean;
    }
    interface _CssStateMixinConstructor extends DojoJS.DojoClass<_CssStateMixin> {
    }
    interface _DialogMixin {
        /**
         * HTML snippet to show the action bar (gray bar with OK/cancel buttons).
         * Blank by default, but used by ConfirmDialog/ConfirmTooltipDialog subclasses.
         */
        actionBarTemplate: string;
        /**
         * Callback when the user hits the submit button.
         * Override this method to handle Dialog execution.
         */
        execute(formContents?: any): void;
        /**
         * Called when user has pressed the Dialog's cancel button, to notify container.
         */
        onCancel(): void;
        /**
         * Called when user has pressed the dialog's OK button, to notify container.
         */
        onExecute(): void;
    }
    interface _FocusMixin {
    }
    interface _WidgetBase extends InstanceType<typeof dojo.Stateful>, Destroyable {
        /**
         * Called when the widget becomes "active" because
         * it or a widget inside of it either has focus, or has recently
         * been clicked.
         */
        onFocus(): void;
        /**
         * Called when the widget stops being "active" because
         * focus moved to something outside of it, or the user
         * clicked somewhere outside of it, or the widget was
         * hidden.
         */
        onBlur(): void;
    }
    interface _HasDropDown<T extends _WidgetBase> extends _FocusMixin {
        /**
         * The button/icon/node to click to display the drop down.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then either focusNode or domNode (if focusNode is also missing) will be used.
         */
        _buttonNode: HTMLElement;
        /**
         * Will set CSS class dijitUpArrow, dijitDownArrow, dijitRightArrow etc. on this node depending
         * on where the drop down is set to be positioned.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then _buttonNode will be used.
         */
        _arrowWrapperNode: HTMLElement;
        /**
         * The node to set the aria-expanded class on.
         * Also sets popupActive class but that will be removed in 2.0.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then focusNode or _buttonNode (if focusNode is missing) will be used.
         */
        _popupStateNode: HTMLElement;
        /**
         * The node to display the popup around.
         * Can be set via a data-dojo-attach-point assignment.
         * If missing, then domNode will be used.
         */
        _aroundNode: HTMLElement;
        /**
         * The widget to display as a popup.  This widget *must* be
         * defined before the startup function is called.
         */
        dropDown: T;
        /**
         * Set to true to make the drop down at least as wide as this
         * widget.  Set to false if the drop down should just be its
         * default width.
         */
        autoWidth: boolean;
        /**
         * Set to true to make the drop down exactly as wide as this
         * widget.  Overrides autoWidth.
         */
        forceWidth: boolean;
        /**
         * The max height for our dropdown.
         * Any dropdown taller than this will have scrollbars.
         * Set to 0 for no max height, or -1 to limit height to available space in viewport
         */
        maxHeight: number;
        /**
         * This variable controls the position of the drop down.
         * It's an array of strings
         */
        dropDownPosition: ('before' | 'after' | 'above' | 'below')[];
        /**
         * When set to false, the click events will not be stopped, in
         * case you want to use them in your subclass
         */
        _stopClickEvents: boolean;
        /**
         * Callback when the user mousedown/touchstart on the arrow icon.
         */
        _onDropDownMouseDown(e: MouseEvent): void;
        /**
         * Callback on mouseup/touchend after mousedown/touchstart on the arrow icon.
         * Note that this function is called regardless of what node the event occurred on (but only after
         * a mousedown/touchstart on the arrow).
         */
        _onDropDownMouseUp(e?: MouseEvent): void;
        /**
         * The drop down was already opened on mousedown/keydown; just need to stop the event
         */
        _onDropDownClick(e: MouseEvent): void;
        buildRendering(): void;
        postCreate(): void;
        destroy(preserveDom?: boolean): void;
        /**
         * Returns true if the dropdown exists and it's data is loaded.  This can
         * be overridden in order to force a call to loadDropDown().
         */
        isLoaded(): boolean;
        /**
         * Creates the drop down if it doesn't exist, loads the data
         * if there's an href and it hasn't been loaded yet, and then calls
         * the given callback.
         */
        loadDropDown(loadCallback: () => void): void;
        /**
         * Creates the drop down if it doesn't exist, loads the data
         * if there's an href and it hasn't been loaded yet, and
         * then opens the drop down.  This is basically a callback when the
         * user presses the down arrow button to open the drop down.
         */
        loadAndOpenDropDown(): DojoJS.Deferred<T>;
        /**
         * Callback when the user presses the down arrow button or presses
         * the down arrow key to open/close the drop down.
         * Toggle the drop-down widget; if it is up, close it, if not, open it
         */
        toggleDropDown(): void;
        /**
         * Opens the dropdown for this widget.   To be called only when this.dropDown
         * has been created and is ready to display (ie, it's data is loaded).
         */
        openDropDown(): PlaceLocation;
        /**
         * Closes the drop down on this widget
         */
        closeDropDown(focus?: boolean): void;
    }
    interface _OnDijitClickMixin {
        /**
         * override _WidgetBase.connect() to make this.connect(node, "ondijitclick", ...) work
         */
        connect(obj: any, event: string | DojoJS.ExtensionEvent, method: string | EventListener): WatchHandle;
    }
    interface _OnDijitClickMixinConstructor {
        /**
         * Deprecated.   New code should access the dijit/a11yclick event directly, ex:
         * |	this.own(on(node, a11yclick, function(){ ... }));
         *
         * Mixing in this class will make _WidgetBase.connect(node, "ondijitclick", ...) work.
         * It also used to be necessary to make templates with ondijitclick work, but now you can just require
         * dijit/a11yclick.
         */
        new (): _OnDijitClickMixin;
        a11yclick: A11yClick;
    }
    interface _TemplatedMixin extends _AttachMixin {
        /**
         * A string that represents the widget template.
         * Use in conjunction with dojo.cache() to load from a file.
         */
        templateString: string;
        /**
         * Path to template (HTML file) for this widget relative to dojo.baseUrl.
         * Deprecated: use templateString with require([... "dojo/text!..."], ...) instead
         */
        templatePath: string;
        /**
         * Set _AttachMixin.searchContainerNode to true for back-compat for widgets that have data-dojo-attach-point's
         * and events inside this.containerNode.   Remove for 2.0.
         */
        searchContainerNode: boolean;
        /**
         * Construct the UI for this widget from a template, setting this.domNode.
         */
        buildRendering(): void;
    }
    interface _TemplatedMixinConstructor extends _WidgetBaseConstructor<_TemplatedMixin> {
        /**
         * Static method to get a template based on the templatePath or
         * templateString key
         */
        getCachedTemplate(templateString: string, alwaysUseString: string, doc?: Document): string | HTMLElement;
    }
    interface _Widget extends _WidgetBase, _OnDijitClickMixin, _FocusMixin {
        /**
         * Connect to this function to receive notifications of mouse click events.
         */
        onClick(event: Event): void;
        /**
         * Connect to this function to receive notifications of mouse double click events.
         */
        onDblClick(event: Event): void;
        /**
         * Connect to this function to receive notifications of keys being pressed down.
         */
        onKeyDown(event: Event): void;
        /**
         * Connect to this function to receive notifications of printable keys being typed.
         */
        onKeyPress(event: Event): void;
        /**
         * Connect to this function to receive notifications of keys being released.
         */
        onKeyUp(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse button is pressed down.
         */
        onMouseDown(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves over nodes contained within this widget.
         */
        onMouseMove(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves off of nodes contained within this widget.
         */
        onMouseOut(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves onto nodes contained within this widget.
         */
        onMouseOver(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves off of this widget.
         */
        onMouseLeave(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse moves onto this widget.
         */
        onMouseEnter(event: Event): void;
        /**
         * Connect to this function to receive notifications of when the mouse button is released.
         */
        onMouseUp(event: Event): void;
        postCreate(): void;
        /**
         * Deprecated.  Use set() instead.
         */
        setAttribute(attr: string, value: any): void;
        /**
         * This method is deprecated, use get() or set() directly.
         */
        attr(name: string | {
            [attr: string]: any;
        }, value?: any): any;
        /**
         * Returns all the widgets contained by this, i.e., all widgets underneath this.containerNode.
         */
        getDescendants(): _Widget[];
        /**
         * Called when this widget becomes the selected pane in a
         * `dijit/layout/TabContainer`, `dijit/layout/StackContainer`,
         * `dijit/layout/AccordionContainer`, etc.
         *
         * Also called to indicate display of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
         */
        onShow: () => void;
        /**
         * Called when another widget becomes the selected pane in a
         * `dijit/layout/TabContainer`, `dijit/layout/StackContainer`,
         * `dijit/layout/AccordionContainer`, etc.
         *
         * Also called to indicate hide of a `dijit.Dialog`, `dijit.TooltipDialog`, or `dijit.TitlePane`.
         */
        onHide: () => void;
        /**
         * Called when this widget is being displayed as a popup (ex: a Calendar popped
         * up from a DateTextBox), and it is hidden.
         * This is called from the dijit.popup code, and should not be called directly.
         *
         * Also used as a parameter for children of `dijit/layout/StackContainer` or subclasses.
         * Callback if a user tries to close the child.   Child will be closed if this function returns true.
         */
        onClose: () => boolean;
    }
    interface _WidgetBase extends InstanceType<typeof dojo.Stateful>, Destroyable {
        /**
         * A unique, opaque ID string that can be assigned by users or by the
         * system. If the developer passes an ID which is known not to be
         * unique, the specified ID is ignored and the system-generated ID is
         * used instead.
         */
        id: string;
        /**
         * Rarely used.  Overrides the default Dojo locale used to render this widget,
         * as defined by the [HTML LANG](http://www.w3.org/TR/html401/struct/dirlang.html#adef-lang) attribute.
         * Value must be among the list of locales specified during by the Dojo bootstrap,
         * formatted according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt) (like en-us).
         */
        lang: string;
        /**
         * Bi-directional support, as defined by the [HTML DIR](http://www.w3.org/TR/html401/struct/dirlang.html#adef-dir)
         * attribute. Either left-to-right "ltr" or right-to-left "rtl".  If undefined, widgets renders in page's
         * default direction.
         */
        dir: string;
        /**
         * HTML class attribute
         */
        class: string;
        /**
         * HTML style attributes as cssText string or name/value hash
         */
        style: string;
        /**
         * HTML title attribute.
         *
         * For form widgets this specifies a tooltip to display when hovering over
         * the widget (just like the native HTML title attribute).
         *
         * For TitlePane or for when this widget is a child of a TabContainer, AccordionContainer,
         * etc., it's used to specify the tab label, accordion pane title, etc.  In this case it's
         * interpreted as HTML.
         */
        title: string;
        /**
         * When this widget's title attribute is used to for a tab label, accordion pane title, etc.,
         * this specifies the tooltip to appear when the mouse is hovered over that text.
         */
        tooltip: string;
        /**
         * Root CSS class of the widget (ex: dijitTextBox), used to construct CSS classes to indicate
         * widget state.
         */
        baseClass: string;
        /**
         * pointer to original DOM node
         */
        srcNodeRef: HTMLElement;
        /**
         * This is our visible representation of the widget! Other DOM
         * Nodes may by assigned to other properties, usually through the
         * template system's data-dojo-attach-point syntax, but the domNode
         * property is the canonical "top level" node in widget UI.
         */
        domNode: HTMLElement;
        /**
         * Designates where children of the source DOM node will be placed.
         * "Children" in this case refers to both DOM nodes and widgets.
         */
        containerNode: HTMLElement;
        /**
         * The document this widget belongs to.  If not specified to constructor, will default to
         * srcNodeRef.ownerDocument, or if no sourceRef specified, then to the document global
         */
        ownerDocument: HTMLElement;
        /**
         * Deprecated.	Instead of attributeMap, widget should have a _setXXXAttr attribute
         * for each XXX attribute to be mapped to the DOM.
         */
        attributeMap: {
            [attribute: string]: any;
        };
        /**
         * Bi-directional support,	the main variable which is responsible for the direction of the text.
         * The text direction can be different than the GUI direction by using this parameter in creation
         * of a widget.
         */
        textDir: string;
        /**
         * Kicks off widget instantiation.  See create() for details.
         */
        postscript(params?: any, srcNodeRef?: HTMLElement): void;
        /**
         * Kick off the life-cycle of a widget
         */
        create(params?: any, srcNodeRef?: HTMLElement): void;
        /**
         * Called after the parameters to the widget have been read-in,
         * but before the widget template is instantiated. Especially
         * useful to set properties that are referenced in the widget
         * template.
         */
        postMixInProperties(): void;
        /**
         * Construct the UI for this widget, setting this.domNode.
         * Most widgets will mixin `dijit._TemplatedMixin`, which implements this method.
         */
        buildRendering(): void;
        /**
         * Processing after the DOM fragment is created
         */
        postCreate(): void;
        /**
         * Processing after the DOM fragment is added to the document
         */
        startup(): void;
        /**
         * Destroy this widget and its descendants
         */
        destroyRecursive(preserveDom?: boolean): void;
        /**
         * Destroys the DOM nodes associated with this widget.
         */
        destroyRendering(preserveDom?: boolean): void;
        /**
         * Recursively destroy the children of this widget and their
         * descendants.
         */
        destroyDescendants(preserveDom?: boolean): void;
        /**
         * Deprecated. Override destroy() instead to implement custom widget tear-down
         * behavior.
         */
        uninitialize(): boolean;
        /**
         * Used by widgets to signal that a synthetic event occurred, ex:
         * |	myWidget.emit("attrmodified-selectedChildWidget", {}).
         */
        emit(type: string, eventObj?: any, callbackArgs?: any[]): any;
        /**
         * Call specified function when event occurs, ex: myWidget.on("click", function(){ ... }).
         */
        on(type: string | DojoJS.ExtensionEvent, func: EventListener | Function): WatchHandle;
        /**
         * Returns a string that represents the widget.
         */
        toString(): string;
        /**
         * Returns all direct children of this widget, i.e. all widgets underneath this.containerNode whose parent
         * is this widget.   Note that it does not return all descendants, but rather just direct children.
         */
        getChildren<T extends _WidgetBase>(): T[];
        /**
         * Returns the parent widget of this widget.
         */
        getParent<T extends _WidgetBase>(): T;
        /**
         * Deprecated, will be removed in 2.0, use this.own(on(...)) or this.own(aspect.after(...)) instead.
         */
        connect(obj: any, event: string | DojoJS.ExtensionEvent, method: string | EventListener): WatchHandle;
        /**
         * Deprecated, will be removed in 2.0, use handle.remove() instead.
         */
        disconnect(handle: WatchHandle): void;
        /**
         * Deprecated, will be removed in 2.0, use this.own(topic.subscribe()) instead.
         */
        subscribe(t: string, method: EventListener): WatchHandle;
        /**
         * Deprecated, will be removed in 2.0, use handle.remove() instead.
         */
        unsubscribe(handle: WatchHandle): void;
        /**
         * Return this widget's explicit or implicit orientation (true for LTR, false for RTL)
         */
        isLeftToRight(): boolean;
        /**
         * Return true if this widget can currently be focused
         * and false if not
         */
        isFocusable(): boolean;
        /**
         * Place this widget somewhere in the DOM based
         * on standard domConstruct.place() conventions.
         */
        placeAt<T extends _WidgetBase>(reference: Node | string | DocumentFragment | T, position?: string | number): this;
        /**
         * Wrapper to setTimeout to avoid deferred functions executing
         * after the originating widget has been destroyed.
         * Returns an object handle with a remove method (that returns null) (replaces clearTimeout).
         */
        defer(fcn: Function, delay?: number): DojoJS.Handle;
    }
    interface _WidgetBaseConstructor<W> extends Pick<DojoJS.DojoClass<W>, Exclude<keyof DojoJS.DojoClass<W>, 'new'>> {
        new (params?: Partial<W> & ThisType<W>, srcNodeRef?: Node | string): W & DojoJS.DojoClassObject;
    }
    interface _WidgetsInTemplateMixin {
        /**
         * Used to provide a context require to dojo/parser in order to be
         * able to use relative MIDs (e.g. `./Widget`) in the widget's template.
         */
        contextRequire: Function;
        startup(): void;
    }
    interface _WidgetsInTemplateMixinConstructor extends DojoJS.DojoClass<_WidgetsInTemplateMixin> {
        new (params: Object, srcNodeRef: Node | string): _WidgetsInTemplateMixin;
    }
    interface A11yClick {
        /**
         * Custom press, release, and click synthetic events
         * which trigger on a left mouse click, touch, or space/enter keyup.
         */
        (node: HTMLElement, listener: Function): DojoJS.Handle;
        /**
         * Mousedown (left button), touchstart, or keydown (space or enter) corresponding to logical click operation.
         */
        press: DojoJS.ExtensionEvent;
        /**
         * Mouseup (left button), touchend, or keyup (space or enter) corresponding to logical click operation.
         */
        release: DojoJS.ExtensionEvent;
        /**
         * Mouse cursor or a finger is dragged over the given node.
         */
        move: DojoJS.ExtensionEvent;
    }
    interface _MonthDropDownButton extends form.DropDownButton<_MonthDropDown> {
        onMonthSelect(): void;
        postCreate(): void;
        set(name: 'month', value: number): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface _MonthDropDownButtonConstructor extends _WidgetBaseConstructor<_MonthDropDownButton> {
    }
    interface _MonthDropDown extends _Widget, _TemplatedMixin, _CssStateMixin {
        months: string[];
        baseClass: string;
        templateString: string;
        /**
         * Callback when month is selected from drop down
         */
        onChange(month: number): void;
        set(name: 'months', value: string[]): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface _MonthDropDownConstructor extends _WidgetBaseConstructor<_MonthDropDown> {
    }
    interface Calendar extends CalendarLite, Omit<_Widget, "_changeAttrValue" | "placeAt" | keyof DojoJS.DojoClassObject>, _CssStateMixin {
        baseClass: string;
        /**
         * Set node classes for various mouse events, see dijit._CssStateMixin for more details
         */
        cssStateNodes: CSSStateNodes;
        /**
         * Creates the drop down button that displays the current month and lets user pick a new one
         */
        _createMonthWidget(): _MonthDropDownButton;
        postCreate(): void;
        /**
         * Handler for when user selects a month from the drop down list
         */
        _onMonthSelect(newMonth: number): void;
        /**
         * Handler for mouse over events on days, sets hovered style
         */
        _onDayMouseOver(evt: MouseEvent): void;
        /**
         * Handler for mouse out events on days, clears hovered style
         */
        _onDayMouseOut(evt: MouseEvent): void;
        _onDayMouseDown(evt: MouseEvent): void;
        _onDayMouseUp(evt: MouseEvent): void;
        /**
         * Provides keyboard navigation of calendar.
         */
        handleKey(evt: KeyboardEvent): void;
        /**
         * For handling keydown events on a stand alone calendar
         */
        _onKeyDown(evt: KeyboardEvent): void;
        /**
         * Deprecated.   Notification that a date cell was selected.  It may be the same as the previous value.
         */
        onValueSelected(date: Date): void;
        onChange(date: Date): void;
        /**
         * May be overridden to return CSS classes to associate with the date entry for the given dateObject
         * for example to indicate a holiday in specified locale.
         */
        getClassForDate(dateObject: Date, locale?: string): string;
        get(name: 'value'): Date;
        get(name: string): any;
        set(name: 'value', value: number | Date): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface CalendarConstructor extends _WidgetBaseConstructor<Calendar> {
        _MonthWidget: _MonthWidgetConstructor;
        _MonthDropDown: _MonthDropDownButtonConstructor;
        _MonthDropDownButton: _MonthDropDownButtonConstructor;
    }
    interface _MonthWidget extends _WidgetBase {
        set(name: 'month', value: Date): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface _MonthWidgetConstructor extends _WidgetBaseConstructor<_MonthWidget> {
    }
    interface CalendarLite extends _WidgetBase, _TemplatedMixin {
        /**
         * Template for main calendar
         */
        templateString: string;
        /**
         * Template for cell for a day of the week (ex: M)
         */
        dowTemplateString: string;
        dateTemplateString: string;
        weekTemplateString: string;
        /**
         * The currently selected Date, initially set to invalid date to indicate no selection.
         */
        value: Date;
        /**
         * JavaScript namespace to find calendar routines.	 If unspecified, uses Gregorian calendar routines
         * at dojo/date and dojo/date/locale.
         */
        datePackage: string;
        /**
         * How to represent the days of the week in the calendar header. See locale
         */
        dayWidth: string;
        /**
         * Order fields are traversed when user hits the tab key
         */
        tabIndex: string;
        /**
         * (Optional) The first day of week override. By default the first day of week is determined
         * for the current locale (extracted from the CLDR).
         * Special value -1 (default value), means use locale dependent value.
         */
        dayOffset: number;
        /**
         * Date object containing the currently focused date, or the date which would be focused
         * if the calendar itself was focused.   Also indicates which year and month to display,
         * i.e. the current "page" the calendar is on.
         */
        currentFocus: Date;
        /**
         * Put the summary to the node with role=grid
         */
        _setSummaryAttr: string;
        baseClass: string;
        /**
         * Runs various tests on the value, checking that it's a valid date, rather
         * than blank or NaN.
         */
        _isValidDate(value: Date): boolean;
        /**
         * Convert Number into Date, or copy Date object.   Then, round to nearest day,
         * setting to 1am to avoid issues when DST shift occurs at midnight, see #8521, #9366)
         */
        _patchDate(value: number | Date): Date;
        /**
         * This just sets the content of node to the specified text.
         * Can't do "node.innerHTML=text" because of an IE bug w/tables, see #3434.
         */
        _setText(node: HTMLElement, text?: string): void;
        /**
         * Fills in the calendar grid with each day (1-31).
         * Call this on creation, when moving to a new month.
         */
        _populateGrid(): void;
        /**
         * Fill in localized month, and prev/current/next years
         */
        _populateControls(): void;
        /**
         * Sets calendar's value to today's date
         */
        goToToday(): void;
        /**
         * Creates the drop down button that displays the current month and lets user pick a new one
         */
        _createMonthWidget(): void;
        buildRendering(): void;
        postCreate(): void;
        /**
         * Set up connects for increment/decrement of months/years
         */
        _connectControls(): void;
        /**
         * If the calendar currently has focus, then focuses specified date,
         * changing the currently displayed month/year if necessary.
         * If the calendar doesn't have focus, updates currently
         * displayed month/year, and sets the cell that will get focus
         * when Calendar is focused.
         */
        _setCurrentFocusAttr(date: Date, forceFocus?: boolean): void;
        /**
         * Focus the calendar by focusing one of the calendar cells
         */
        focus(): void;
        /**
         * Handler for day clicks, selects the date if appropriate
         */
        _onDayClick(evt: MouseEvent): void;
        /**
         * Returns the cell corresponding to the date, or null if the date is not within the currently
         * displayed month.
         */
        _getNodeByDate(value: Date): HTMLElement;
        /**
         * Marks the specified cells as selected, and clears cells previously marked as selected.
         * For CalendarLite at most one cell is selected at any point, but this allows an array
         * for easy subclassing.
         */
        _markSelectedDates(dates: Date[]): void;
        /**
         * Called only when the selected date has changed
         */
        onChange(date: Date): void;
        /**
         * May be overridden to disable certain dates in the calendar e.g. `isDisabledDate=dojo.date.locale.isWeekend`
         */
        isDisabledDate(dateObject: Date, locale?: string): boolean;
        /**
         * May be overridden to return CSS classes to associate with the date entry for the given dateObject,
         * for example to indicate a holiday in specified locale.
         */
        getClassForDate(dateObject: Date, locale?: string): string;
        get(name: 'value'): Date;
        get(name: string): any;
        set(name: 'value', value: number | Date): this;
        set(name: string, value: any): this;
        set(values: Object): this;
    }
    interface CalendarLiteConstructor extends _WidgetBaseConstructor<CalendarLite> {
        _MonthWidget: _MonthWidgetConstructor;
    }
    interface Destroyable {
        _destroyed?: true;
        /**
         * Destroy this class, releasing any resources registered via own().
         */
        destroy(preserveDom?: boolean): void;
        /**
         * Track specified handles and remove/destroy them when this instance is destroyed, unless they were
         * already removed/destroyed manually.
         */
        own(...args: any[]): any[];
    }
    /**
     * Mixin to track handles and release them when instance is destroyed.
     */
    interface DestroyableConstructor extends DojoJS.DojoClass<Destroyable> {
    }
    /** dijit/_KeyNavMixin */
    /**
     * A mixin to allow arrow key and letter key navigation of child or descendant widgets.
     * It can be used by dijit/_Container based widgets with a flat list of children, or more complex widgets like dijit/Tree.
     *
     * To use this mixin, the subclass must:
     *
     * 	- Implement  _getNext(), _getFirst(), _getLast(), _onLeftArrow(), _onRightArrow() _onDownArrow(), _onUpArrow() methods to handle home/end/left/right/up/down keystrokes. Next and previous in this context refer to a linear ordering of the descendants used by letter key search.
     * 	- Set all descendants' initial tabIndex to "-1"; both initial descendants and any descendants added later, by for example addChild()
     * 	- Define childSelector to a function or string that identifies focusable descendant widgets
     *
     * Also, child widgets must implement a focus() method.
     */
    interface _KeyNavMixin extends _FocusMixin {
        /**
         * Tab index of the container; same as HTML tabIndex attribute.
         * Note then when user tabs into the container, focus is immediately moved to the first item in the container.
         */
        tabIndex: string;
        /**
         * Selector (passed to on.selector()) used to identify what to treat as a child widget.   Used to monitor focus events and set this.focusedChild.   Must be set by implementing class.   If this is a string (ex: "> *") then the implementing class must require dojo/query.
         */
        childSelector: string | Function | null;
        /**
         * Called on left arrow key, or right arrow key if widget is in RTL mode.
         * Should go back to the previous child in horizontal container widgets like Toolbar.
         */
        _onLeftArrow(evt?: KeyboardEvent): void;
        /**
         * Called on right arrow key, or left arrow key if widget is in RTL mode.
         * Should go to the next child in horizontal container widgets like Toolbar.
         */
        _onRightArrow(evt?: KeyboardEvent): void;
        /**
         * Called on up arrow key. Should go to the previous child in vertical container widgets like Menu.
         */
        _onUpArrow(evt?: KeyboardEvent): void;
        /**
         * Called on down arrow key. Should go to the next child in vertical container widgets like Menu.
         */
        _onDownArrow(evt?: KeyboardEvent): void;
        /**
         * Default focus() implementation: focus the first child.
         */
        focus(): void;
        /**
         * Returns first child that can be focused.
         */
        _getFirstFocusableChild(): _WidgetBase;
        /**
         * Returns last child that can be focused.
         */
        _getLastFocusableChild(): _WidgetBase;
        /**
         * Focus the first focusable child in the container.
         */
        focusFirstChild(): void;
        /**
         * Focus the last focusable child in the container.
         */
        focusLastChild(): void;
        /**
         * Focus specified child widget.
         *
         * @param widget Reference to container's child widget
         * @param last If true and if widget has multiple focusable nodes, focus the last one instead of the first one
         */
        focusChild(widget: _WidgetBase, last?: boolean): void;
        /**
         * Handler for when the container itself gets focus.
         *
         * Initially the container itself has a tabIndex, but when it gets focus, switch focus to first child.
         */
        _onContainerFocus(evt: Event): void;
        /**
         * Called when a child widget gets focus, either by user clicking it, or programatically by arrow key handling code.
         *
         * It marks that the current node is the selected one, and the previously selected node no longer is.
         */
        _onChildFocus(child?: _WidgetBase): void;
        _searchString: string;
        multiCharSearchDuration: number;
        /**
         * When a key is pressed that matches a child item, this method is called so that a widget can take appropriate action is necessary.
         */
        onKeyboardSearch(tem: _WidgetBase, evt: Event, searchString: string, numMatches: number): void;
        /**
         * Compares the searchString to the widget's text label, returning:
         *
         * 	* -1: a high priority match  and stop searching
         * 	* 0: not a match
         * 	* 1: a match but keep looking for a higher priority match
         */
        _keyboardSearchCompare(item: _WidgetBase, searchString: string): -1 | 0 | 1;
        /**
         * When a key is pressed, if it's an arrow key etc. then it's handled here.
         */
        _onContainerKeydown(evt: Event): void;
        /**
         * When a printable key is pressed, it's handled here, searching by letter.
         */
        _onContainerKeypress(evt: Event): void;
        /**
         * Perform a search of the widget's options based on the user's keyboard activity
         *
         * Called on keypress (and sometimes keydown), searches through this widget's children looking for items that match the user's typed search string.  Multiple characters typed within 1 sec of each other are combined for multicharacter searching.
         */
        _keyboardSearch(evt: Event, keyChar: string): void;
        /**
         * Called when focus leaves a child widget to go to a sibling widget.
         */
        _onChildBlur(widget: _WidgetBase): void;
        /**
         * Returns the next or previous focusable descendant, compared to "child".
         * Implements and extends _KeyNavMixin._getNextFocusableChild() for a _Container.
         */
        _getNextFocusableChild(child: _WidgetBase, dir: 1 | -1): _WidgetBase | null;
        /**
         * Returns the first child.
         */
        _getFirst(): _WidgetBase | null;
        /**
         * Returns the last descendant.
         */
        _getLast(): _WidgetBase | null;
        /**
         * Returns the next descendant, compared to "child".
         */
        _getNext(child: _WidgetBase, dir: 1 | -1): _WidgetBase | null;
    }
    interface _KeyNavMixinConstructor extends DojoJS.DojoClass<_KeyNavMixin> {
    }
    /**
     * A _Container with keyboard navigation of its children.
     *
     * Provides normalized keyboard and focusing code for Container widgets.
     * To use this mixin, call connectKeyNavHandlers() in postCreate().
     * Also, child widgets must implement a focus() method.
     */
    interface _KeyNavContainer extends _FocusMixin, _KeyNavMixin, _Container {
        /**
         * Deprecated.  You can call this in postCreate() to attach the keyboard handlers to the container, but the preferred method is to override _onLeftArrow() and _onRightArrow(), or _onUpArrow() and _onDownArrow(), to call focusPrev() and focusNext().
         *
         * @param prevKeyCodes Key codes for navigating to the previous child.
         * @param nextKeyCodes Key codes for navigating to the next child.
         */
        connectKeyNavHandlers(prevKeyCodes: number[], nextKeyCodes: number[]): void;
        /**
         * @deprecated
         */
        startupKeyNavChildren(): void;
        /**
         * Setup for each child widget.
         *
         * Sets tabIndex=-1 on each child, so that the tab key will leave the container rather than visiting each child.
         *
         * Note: if you add children by a different method than addChild(), then need to call this manually or at least make sure the child's tabIndex is -1.
         *
         * Note: see also _LayoutWidget.setupChild(), which is also called for each child widget.
         */
        _startupChild(widget: _WidgetBase): void;
        /**
         * Returns the first child.
         */
        _getFirst(): _Widget | null;
        /**
         * Returns the last descendant.
         */
        _getLast(): _Widget | null;
        /**
         * Focus the next widget
         */
        focusNext(): void;
        /**
         * Focus the last focusable node in the previous widget
         *
         * (ex: go to the ComboButton icon section rather than button section)
         */
        focusPrev(): void;
        /**
         * Implement _KeyNavMixin.childSelector, to identify focusable child nodes.
         *
         * If we allowed a dojo/query dependency from this module this could more simply be a string "> *" instead of this function.
         */
        childSelector(node: Element | Node): boolean | void | any;
    }
    interface _KeyNavContainerConstructor extends DojoJS.DojoClass<_KeyNavContainer> {
    }
    /**
     * Abstract base class for Menu and MenuBar.
     * Subclass should implement _onUpArrow(), _onDownArrow(), _onLeftArrow(), and _onRightArrow().
     */
    interface _MenuBase extends _Widget, _TemplatedMixin, _KeyNavContainer, _CssStateMixin {
        selected: MenuItem | null;
        _setSelectedAttr(item?: MenuItem | null): void;
        /**
         * This Menu has been clicked (mouse or via space/arrow key) or opened as a submenu, so mere mouseover will open submenus.  Focusing a menu via TAB does NOT automatically make it active since TAB is a navigation operation and not a selection one.
         *
         * For Windows apps, pressing the ALT key focuses the menubar menus (similar to TAB navigation) but the menu is not active (ie no dropdown) until an item is clicked.
         */
        activated: boolean;
        _setActivatedAttr(val: boolean): void;
        /**
         * pointer to menu that displayed me
         */
        parentMenu: _Widget | null;
        /**
         * After a menu has been activated (by clicking on it etc.), number of milliseconds before hovering (without clicking) another MenuItem causes that MenuItem's popup to automatically open.
         */
        popupDelay: number;
        /**
         * For a passive (unclicked) Menu, number of milliseconds before hovering (without clicking) will cause the popup to open.  Default is Infinity, meaning you need to click the menu to open it.
         */
        passivePopupDelay: number;
        /**
         * A toggle to control whether or not a Menu gets focused when opened as a drop down from a MenuBar or DropDownButton/ComboButton.   Note though that it always get focused when opened via the keyboard.
         */
        autoFocus: boolean;
        /**
         * Selector (passed to on.selector()) used to identify MenuItem child widgets, but exclude inert children like MenuSeparator.  If subclass overrides to a string (ex: "> *"), the subclass must require dojo/query.
         */
        childSelector(node: Element | Node): boolean | void | Function;
        /**
         * Attach point for notification about when a menu item has been executed. This is an internal mechanism used for Menus to signal to their parent to close them, because they are about to execute the onClick handler.  In general developers should not attach to or override this method.
         */
        onExecute(): void;
        /**
         * Attach point for notification about when the user cancels the current menu
         * This is an internal mechanism used for Menus to signal to their parent to close them.  In general developers should not attach to or override this method.
         */
        onCancel(): void;
        /**
         * This handles the right arrow key (left arrow key on RTL systems), which will either open a submenu, or move to the next item in the ancestor MenuBar
         */
        _moveToPopup(evt: Event): void;
        /**
         * This handler is called when the mouse moves over the popup.
         */
        _onPopupHover(evt?: MouseEvent): void;
        /**
         * Called when cursor is over a MenuItem.
         */
        onItemHover(item: MenuItem): void;
        /**
         * Called when a child MenuItem becomes deselected.   Setup timer to close its popup.
         */
        _onChildDeselect(item: MenuItem): void;
        /**
         * Callback fires when mouse exits a MenuItem
         */
        onItemUnhover(item: MenuItem): void;
        /**
         * Cancels the popup timer because the user has stop hovering on the MenuItem, etc.
         */
        _stopPopupTimer(): void;
        /**
         * Cancels the pending-close timer because the close has been preempted
         */
        _stopPendingCloseTimer(): void;
        /**
         * Returns the top menu in this chain of Menus
         */
        _getTopMenu(): void;
        /**
         * Handle clicks on an item.
         */
        onItemClick(item: _WidgetBase, evt: Event): void;
        /**
         * Open the popup to the side of/underneath the current menu item, and optionally focus first item
         */
        _openItemPopup(fromItem: MenuItem, focus: boolean): void;
        /**
         * Callback when this menu is opened.
         * This is called by the popup manager as notification that the menu was opened.
         */
        onOpen(evt?: Event): void;
        /**
         * Callback when this menu is closed.
         * This is called by the popup manager as notification that the menu was closed.
         */
        onClose(): boolean;
        /**
         * Called when submenu is clicked or focus is lost.  Close hierarchy of menus.
         */
        _closeChild(): void;
        /**
         * Called when child of this Menu gets focus from:
         *
         *  1. clicking it
         *  2. tabbing into it
         *  3. being opened by a parent menu.
         *
         * This is not called just from mouse hover.
         */
        _onItemFocus(item: MenuItem): void;
        /**
         * Called when focus is moved away from this Menu and it's submenus.
         */
        _onBlur(): void;
        /**
         * Called when the user is done with this menu.  Closes hierarchy of menus.
         */
        _cleanUp(clearSelectedItem?: boolean): void;
    }
    interface _MenuBaseConstructor extends _WidgetBaseConstructor<_MenuBase> {
    }
    interface _DialogBase extends _TemplatedMixin, form._FormMixin, _DialogMixin, _CssStateMixin {
        _relativePosition?: {
            x: number;
            y: number;
        };
        templateString: string;
        baseClass: string;
        cssStateNodes: CSSStateNodes;
        /**
         * True if Dialog is currently displayed on screen.
         */
        open: boolean;
        /**
         * The time in milliseconds it takes the dialog to fade in and out
         */
        duration: number;
        /**
         * A Toggle to modify the default focus behavior of a Dialog, which
         * is to re-focus the element which had focus before being opened.
         * False will disable refocusing. Default: true
         */
        refocus: boolean;
        /**
         * A Toggle to modify the default focus behavior of a Dialog, which
         * is to focus on the first dialog element after opening the dialog.
         * False will disable autofocusing. Default: true
         */
        autofocus: boolean;
        /**
         * Toggles the movable aspect of the Dialog. If true, Dialog
         * can be dragged by it's title. If false it will remain centered
         * in the viewport.
         */
        draggable: boolean;
        /**
         * Maximum size to allow the dialog to expand to, relative to viewport size
         */
        maxRatio: number;
        /**
         * Dialog show [x] icon to close itself, and ESC key will close the dialog.
         */
        closable: boolean;
        postMixInProperties(): void;
        postCreate(): void;
        /**
         * Called when data has been loaded from an href.
         * Unlike most other callbacks, this function can be connected to (via `dojo.connect`)
         * but should *not* be overridden.
         */
        onLoad(data?: any): void;
        focus(): void;
        /**
         * Display the dialog
         */
        show(): Promise<any>;
        /**
         * Hide the dialog
         */
        hide(): Promise<any>;
        /**
         * Called with no argument when viewport scrolled or viewport size changed.  Adjusts Dialog as
         * necessary to keep it visible.
         *
         * Can also be called with an argument (by dojox/layout/ResizeHandle etc.) to explicitly set the
         * size of the dialog.
         */
        resize(dim?: {
            l: number;
            r: number;
            w: number;
            h: number;
        }): void;
        destroy(preserveDom?: boolean): void;
    }
    interface _DialogBaseConstructor extends _WidgetBaseConstructor<_DialogBase> {
    }
    interface Dialog extends layout.ContentPane, _DialogBase {
        resize(dim?: {
            l: number;
            r: number;
            w: number;
            h: number;
        }): void;
    }
    interface DialogLevelManager {
        _beginZIndex: number;
        /**
         * Call right before fade-in animation for new dialog.
         *
         * Saves current focus, displays/adjusts underlay for new dialog,
         * and sets the z-index of the dialog itself.
         *
         * New dialog will be displayed on top of all currently displayed dialogs.
         * Caller is responsible for setting focus in new dialog after the fade-in
         * animation completes.
         */
        show(dialog: _WidgetBase, underlayAttrs: Object): void;
        /**
         * Called when the specified dialog is hidden/destroyed, after the fade-out
         * animation ends, in order to reset page focus, fix the underlay, etc.
         * If the specified dialog isn't open then does nothing.
         *
         * Caller is responsible for either setting display:none on the dialog domNode,
         * or calling dijit/popup.hide(), or removing it from the page DOM.
         */
        hide(dialog: _WidgetBase): void;
        /**
         * Returns true if specified Dialog is the top in the task
         */
        isTop(dialog: _WidgetBase): boolean;
    }
    interface DialogConstructor extends _WidgetBaseConstructor<Dialog> {
        /**
         * for monkey patching and dojox/widget/DialogSimple
         */
        _DialogBase: _DialogBaseConstructor;
        _DialogLevelManager: DialogLevelManager;
        _dialogStack: {
            dialog: _WidgetBase;
            focus: any;
            underlayAttrs: any;
        }[];
    }
    interface ConfirmDialog extends _ConfirmDialogMixin {
    }
    interface ConfirmDialogConstructor extends DialogConstructor {
    }
    /**
     * A menu, without features for context menu (Meaning, drop down menu)
     */
    interface DropDownMenu extends _MenuBase {
    }
    interface DropDownMenuConstructor extends _WidgetBaseConstructor<DropDownMenu> {
    }
    /**
     * An accessible fieldset that can be expanded or collapsed via
     * its legend.  Fieldset extends `dijit.TitlePane`.
     */
    interface Fieldset extends TitlePane {
        open: boolean;
    }
    interface FieldsetConstructor extends _WidgetBaseConstructor<Fieldset> {
    }
    /**
     * A context menu you can assign to multiple elements
     */
    interface Menu extends DijitJS.DropDownMenu {
        /**
         * Array of dom node ids of nodes to attach to.
         * Fill this with nodeIds upon widget creation and it becomes context menu for those nodes.
         */
        targetNodeIds: string[];
        /**
         * CSS expression to apply this Menu to descendants of targetNodeIds, rather than to
         * the nodes specified by targetNodeIds themselves.  Useful for applying a Menu to
         * a range of rows in a table, tree, etc.
         *
         * The application must require() an appropriate level of dojo/query to handle the selector.
         */
        selector: string;
        /**
         * If true, right clicking anywhere on the window will cause this context menu to open.
         * If false, must specify targetNodeIds.
         */
        contextMenuForWindow: boolean;
        /**
         * If true, menu will open on left click instead of right click, similar to a file menu.
         */
        leftClickToOpen: boolean;
        /**
         * When this menu closes, re-focus the element which had focus before it was opened.
         */
        refocus: boolean;
        /**
         * Attach menu to given node
         */
        bindDomNode(node: string | Node): void;
        /**
         * Detach menu from given node
         */
        unBindDomNode(nodeName: string | Node): void;
    }
    interface MenuConstructor extends _WidgetBaseConstructor<Menu> {
    }
    interface MenuBar extends _MenuBase {
        baseClass: 'dijitMenuBar';
        popupDelay: number;
        _isMenuBar: true;
        _orient: string[];
        _moveToPopup(evt: Event): void;
        focusChild(item: _WidgetBase): void;
        _onChildDeselect(item: _WidgetBase): void;
        _onLeftArrow(): void;
        _onRightArrow(): void;
        _onDownArrow(): void;
        _onUpArrow(): void;
        onItemClick(item: _WidgetBase, evt: Event): void;
    }
    interface MenuBarConstructor extends _WidgetBaseConstructor<MenuBar> {
    }
    interface MenuBarItem extends MenuItem {
    }
    interface MenuBarItemConstructor extends _WidgetBaseConstructor<MenuBarItem> {
    }
    interface MenuItem extends _Widget, _TemplatedMixin, _Contained, _CssStateMixin {
        /**
         * Text for the accelerator (shortcut) key combination, a control, alt, etc. modified keystroke meant to execute the menu item regardless of where the focus is on the page.
         *
         * Note that although Menu can display accelerator keys, there is no infrastructure to actually catch and execute those accelerators.
         */
        accelKey: string;
        /**
         * If true, the menu item is disabled.
         * If false, the menu item is enabled.
         */
        disabled: boolean;
        /** Menu text as HTML */
        label: string;
        /**
         * Class to apply to DOMNode to make it display an icon.
         */
        iconClass: string;
        /**
         * Hook for attr('accelKey', ...) to work.
         * Set accelKey on this menu item.
         */
        _setAccelKeyAttr(value: string): void;
        /**
         * Hook for attr('disabled', ...) to work.
         * Enable or disable this menu item.
         */
        _setDisabledAttr(value: boolean): void;
        _setLabelAttr(val: string): void;
        _setIconClassAttr(val: string): void;
        _fillContent(source: Element): void;
        /**
         * Indicate that this node is the currently selected one
         */
        _setSelected(selected: boolean): void;
        focus(): void;
        /**
         * Deprecated.
         * Use set('disabled', bool) instead.
         */
        setDisabled(disabled: boolean): void;
        /**
         * Deprecated.
         * Use set('label', ...) instead.
         */
        setLabel(content: string): void;
    }
    interface MenuItemConstructor extends _WidgetBaseConstructor<MenuItem> {
    }
    interface MenuSeparator extends _WidgetBase, _TemplatedMixin, _Contained {
    }
    interface MenuSeparatorConstructor extends _WidgetBaseConstructor<MenuSeparator> {
    }
    interface PlacePosition {
        x: number;
        y: number;
    }
    interface PlaceWidthHeight {
        w: number;
        h: number;
    }
    interface PlaceRectangle extends PlacePosition, PlaceWidthHeight {
    }
    type PlaceCorner = 'BL' | 'TR' | 'BR' | 'TL';
    type PlacePositions = 'before' | 'after' | 'before-centered' | 'after-centered' | 'above-centered' | 'above' | 'above-alt' | 'below-centered' | 'below' | 'below-alt';
    interface PlaceChoice {
        corner: PlaceCorner;
        pos: PlacePosition;
        aroundCorner?: PlaceCorner;
    }
    interface PlaceLocation extends PlaceRectangle {
        corner: PlaceCorner;
        aroundCorner: PlaceCorner;
        overflow: number;
        spaceAvailable: PlaceWidthHeight;
    }
    interface LayoutNodeFunction {
        (node: HTMLElement, aroundCorner: string, corner: string, spaceAvailable: PlaceWidthHeight, aroundNodeCoords: PlaceWidthHeight): number;
    }
    interface Place {
        /**
         * Positions node kitty-corner to the rectangle centered at (pos.x, pos.y) with width and height of
         * padding.x * 2 and padding.y * 2, or zero if padding not specified.  Picks first corner in corners[]
         * where node is fully visible, or the corner where it's most visible.
         *
         * Node is assumed to be absolutely or relatively positioned.
         */
        at(node: Element, pos?: PlacePosition, corners?: PlaceCorner[], padding?: PlacePosition, layoutNode?: LayoutNodeFunction): PlaceLocation;
        /**
         * Position node adjacent or kitty-corner to anchor
         * such that it's fully visible in viewport.
         */
        around(node: Element, anchor: Element | PlaceRectangle, positions: PlacePositions[], leftToRight?: boolean, layoutNode?: LayoutNodeFunction): PlaceLocation;
    }
    interface PopupOpenArgs {
        /**
         * widget to display
         */
        popup?: _WidgetBase;
        /**
         * the button etc. that is displaying this popup
         */
        parent?: _WidgetBase;
        /**
         * DOM node (typically a button); place popup relative to this node.  (Specify this *or* "x" and "y" parameters.)
         */
        around?: HTMLElement;
        /**
         * Absolute horizontal position (in pixels) to place node at.  (Specify this *or* "around" parameter.)
         */
        x?: number;
        /**
         * Absolute vertical position (in pixels) to place node at.  (Specify this *or* "around" parameter.)
         */
        y?: number;
        /**
         * When the around parameter is specified, orient should be a list of positions to try
         */
        orient?: string | string[] | {
            BL?: string;
            TR?: string;
            TL?: string;
            BR?: string;
        };
        /**
         * callback when user has canceled the popup by:
         *
         * 1. hitting ESC or
         * 2. by using the popup widget's proprietary cancel mechanism (like a cancel button in a dialog);
         *    i.e. whenever popupWidget.onCancel() is called, args.onCancel is called
         */
        onCancel?: () => void;
        /**
         * callback whenever this popup is closed
         */
        onClose?: () => void;
        /**
         * callback when user "executed" on the popup/sub-popup by selecting a menu choice, etc. (top menu only)
         */
        onExecute?: () => void;
        /**
         * adding a buffer around the opening position. This is only useful when around is not set.
         */
        padding?: PlacePosition;
        /**
         * The max height for the popup.  Any popup taller than this will have scrollbars.
         * Set to Infinity for no max height.  Default is to limit height to available space in viewport,
         * above or below the aroundNode or specified x/y position.
         */
        maxHeight?: number;
    }
    interface PopupManager {
        /**
         * Stack of currently popped up widgets.
         * (someone opened _stack[0], and then it opened _stack[1], etc.)
         */
        _stack: _WidgetBase[];
        /**
         * Z-index of the first popup.   (If first popup opens other
         * popups they get a higher z-index.)
         */
        _beginZIndex: number;
        _idGen: number;
        /**
         * If screen has been scrolled, reposition all the popups in the stack.
         * Then set timer to check again later.
         */
        _repositionAll(): void;
        /**
         * Initialization for widgets that will be used as popups.
         * Puts widget inside a wrapper DIV (if not already in one),
         * and returns pointer to that wrapper DIV.
         */
        _createWrapper(widget: _WidgetBase): HTMLDivElement;
        /**
         * Moves the popup widget off-screen.
         * Do not use this method to hide popups when not in use, because
         * that will create an accessibility issue: the offscreen popup is
         * still in the tabbing order.
         */
        moveOffScreen(widget: _WidgetBase): HTMLDivElement;
        /**
         * Hide this popup widget (until it is ready to be shown).
         * Initialization for widgets that will be used as popups
         *
         * Also puts widget inside a wrapper DIV (if not already in one)
         *
         * If popup widget needs to layout it should
         * do so when it is made visible, and popup._onShow() is called.
         */
        hide(widget: _WidgetBase): void;
        /**
         * Compute the closest ancestor popup that's *not* a child of another popup.
         * Ex: For a TooltipDialog with a button that spawns a tree of menus, find the popup of the button.
         */
        getTopPopup(): _WidgetBase;
        /**
         * Popup the widget at the specified position
         */
        open(args: PopupOpenArgs): PlaceLocation;
        /**
         * Close specified popup and any popups that it parented.
         * If no popup is specified, closes all popups.
         */
        close(popup?: boolean | _WidgetBase): void;
    }
    interface PopupMenuBarItem extends PopupMenuItem {
    }
    interface PopupMenuBarItemConstructor extends _WidgetBaseConstructor<PopupMenuBarItem> {
    }
    /** dijit/PopupMenuItem */
    /**
     * An item in a Menu that spawn a drop down (usually a drop down menu)
     */
    interface PopupMenuItem extends MenuItem {
        /**
         * When Menu is declared in markup, this code gets the menu label and the popup widget from the srcNodeRef.
         *
         * srcNodeRef.innerHTML contains both the menu item text and a popup widget
         * The first part holds the menu item text and the second part is the popup
         */
        _fillContent(source: Element): void;
        /**
         * Open the popup to the side of/underneath this MenuItem, and optionally focus first item
         */
        _openPopup(params: {
            around?: Element;
            popup?: Function;
        }, focus?: boolean): void;
        _closePopup(): void;
    }
    interface PopupMenuItemConstructor extends _WidgetBaseConstructor<PopupMenuItem> {
    }
    interface Registry {
        /**
         * Number of registered widgets
         */
        length: number;
        /**
         * Add a widget to the registry. If a duplicate ID is detected, a error is thrown.
         */
        add(widget: _WidgetBase): void;
        /**
         * Remove a widget from the registry. Does not destroy the widget; simply
         * removes the reference.
         */
        remove(id: string): void;
        /**
         * Find a widget by it's id.
         * If passed a widget then just returns the widget.
         */
        byId<T extends _WidgetBase>(id: string | T): T;
        /**
         * Returns the widget corresponding to the given DOMNode
         */
        byNode<T extends _WidgetBase>(node: Element | Node): T;
        /**
         * Convert registry into a true Array
         */
        toArray(): _WidgetBase[];
        /**
         * Generates a unique id for a given widgetType
         */
        getUniqueId(widgetType: string): string;
        /**
         * Search subtree under root returning widgets found.
         * Doesn't search for nested widgets (ie, widgets inside other widgets).
         */
        findWidgets(root: Node, skipNode?: Node): _WidgetBase[];
        /**
         * Returns the widget whose DOM tree contains the specified DOMNode, or null if
         * the node is not contained within the DOM tree of any widget
         */
        getEnclosingWidget(node: Element | Node): _WidgetBase;
    }
    interface TitlePane extends DijitJS.layout.ContentPane, _TemplatedMixin, _CssStateMixin {
        /**
         * Whether pane can be opened or closed by clicking the title bar.
         */
        toggleable: boolean;
        /**
         * Tabindex setting for the title (so users can tab to the title then use space/enter to open/close the title pane)
         */
        tabIndex: string;
        /**
         * Time in milliseconds to fade in/fade out
         */
        duration: number;
        /**
         * Don't change this parameter from the default value.
         *
         * This ContentPane parameter doesn't make sense for TitlePane, since TitlePane is never a child of a layout container, nor should TitlePane try to control the size of an inner widget.
         */
        doLayout: boolean;
        /**
         * Switches between opened and closed state
         */
        toggle(): void;
        /**
         * Set the open/close css state for the TitlePane
         */
        _setCss(): void;
        /**
         * Handler for when user hits a key
         */
        _onTitleKey(e: Event): void;
        /**
         * Handler when user clicks the title bar
         */
        _onTitleClick(): void;
        /**
         * Deprecated. Use set('title', ...) instead.
         */
        setTitle(): void;
    }
    interface TitlePaneConstructor extends _WidgetBaseConstructor<TitlePane> {
    }
    interface Toolbar extends DijitJS._Widget, DijitJS._TemplatedMixin, DijitJS._KeyNavContainer {
    }
    interface ToolbarConstructor extends _WidgetBaseConstructor<Toolbar> {
    }
    interface ToolbarSeparator extends DijitJS._Widget, DijitJS._TemplatedMixin {
    }
    interface ToolbarSeparatorConstructor extends _WidgetBaseConstructor<ToolbarSeparator> {
    }
    interface Tooltip extends Omit<_Widget, 'onShow'> {
        /**
         * HTML to display in the tooltip.
         * Specified as innerHTML when creating the widget from markup.
         */
        label: string;
        /**
         * Number of milliseconds to wait after hovering over/focusing on the object, before
         * the tooltip is displayed.
         */
        showDelay: number;
        /**
         * Number of milliseconds to wait after unhovering the object, before
         * the tooltip is hidden.  Note that blurring an object hides the tooltip immediately.
         */
        hideDelay: number;
        /**
         * Id of domNode(s) to attach the tooltip to.
         * When user hovers over specified dom node(s), the tooltip will appear.
         */
        connectId: Node | string | Node | string[];
        /**
         * See description of `dijit/Tooltip.defaultPosition` for details on position parameter.
         */
        position: DijitJS.PlacePositions[];
        /**
         * CSS expression to apply this Tooltip to descendants of connectIds, rather than to
         * the nodes specified by connectIds themselves.    Useful for applying a Tooltip to
         * a range of rows in a table, tree, etc.   Use in conjunction with getContent() parameter.
         * Ex: connectId: myTable, selector: "tr", getContent: function(node){ return ...; }
         *
         * The application must require() an appropriate level of dojo/query to handle the selector.
         */
        selector: string;
        /**
         * Attach tooltip to specified node if it's not already connected
         */
        addTarget(node: Node | string): void;
        /**
         * Detach tooltip from specified node
         */
        removeTarget(node: Node | string): void;
        /**
         * User overridable function that return the text to display in the tooltip.
         */
        getContent(node: Node): Node;
        /**
         * Display the tooltip; usually not called directly.
         */
        open(target: Node): void;
        /**
         * Hide the tooltip or cancel timer for show of tooltip
         */
        close(): void;
        /**
         * Called when the tooltip is shown
         */
        onShow: (connectNode: any, position: DijitJS.PlacePositions[]) => void;
        /**
         * Called when the tooltip is hidden
         */
        onHide: () => void;
        _onHover(_connectNode: any): void;
        _onUnHover(_?: any): void;
    }
    interface TooltipConstructor extends _WidgetBaseConstructor<Tooltip> {
        /**
         * 	This variable controls the position of tooltips, if the position is not specified to
         * 	the Tooltip widget or *TextBox widget itself.  It's an array of strings with the values
         * 	possible for `dijit/place.around()`.   The recommended values are:
         *
         * 	- before-centered: centers tooltip to the left of the anchor node/widget, or to the right
         * 	  in the case of RTL scripts like Hebrew and Arabic
         * 	- after-centered: centers tooltip to the right of the anchor node/widget, or to the left
         * 	  in the case of RTL scripts like Hebrew and Arabic
         * 	- above-centered: tooltip is centered above anchor node
         * 	- below-centered: tooltip is centered above anchor node
         *
         * 	The list is positions is tried, in order, until a position is found where the tooltip fits
         * 	within the viewport.
         *
         * 	Be careful setting this parameter.  A value of "above-centered" may work fine until the user scrolls
         * 	the screen so that there's no room above the target node.   Nodes with drop downs, like
         * 	DropDownButton or FilteringSelect, are especially problematic, in that you need to be sure
         * 	that the drop down and tooltip don't overlap, even when the viewport is scrolled so that there
         * 	is only room below (or above) the target node, but not both.
         */
        defaultPosition: DijitJS.PlacePositions[];
        _MasterTooltip: any;
        /**
         * Static method to display tooltip w/specified contents in specified position.
         * See description of dijit/Tooltip.defaultPosition for details on position parameter.
         * If position is not specified then dijit/Tooltip.defaultPosition is used.
         */
        show(innerHTML: string, aroundNode: PlaceRectangle, position?: DijitJS.PlacePositions[], rtl?: boolean, textDir?: string, onMouseEnter?: Function, onMouseLeave?: Function): void;
        /**
         * Hide the tooltip
         */
        hide(aroundNode: PlaceRectangle): void;
    }
    interface TooltipDialog extends layout.ContentPane, _TemplatedMixin, form._FormMixin, _DialogMixin {
        /**
         * Description of tooltip dialog (required for a11y)
         */
        title: string;
        closable: boolean;
        /**
         * Don't change this parameter from the default value.
         * This ContentPane parameter doesn't make sense for TooltipDialog, since TooltipDialog
         * is never a child of a layout container, nor can you specify the size of
         * TooltipDialog in order to control the size of an inner widget.
         */
        doLayout: boolean;
        /**
         * A Toggle to modify the default focus behavior of a Dialog, which
         * is to focus on the first dialog element after opening the dialog.
         * False will disable autofocusing.  Default: true.
         */
        autofocus: boolean;
        /**
         * The pointer to the first focusable node in the dialog.
         */
        _firstFocusItem: any;
        /**
         * The pointer to which node has focus prior to our dialog.
         */
        _lastFocusItem: any;
        /**
         * Configure widget to be displayed in given position relative to the button.
         *
         * This is called from the dijit.popup code, and should not be called directly.
         */
        orient(node: Node | HTMLElement, aroundCorner: PlaceCorner, tooltipCorner: PlaceCorner): void;
        /**
         * Focus on first field
         */
        focus(): void;
        /**
         * Called when dialog is displayed.
         *
         * This is called from the dijit.popup code, and should not be called directly.
         */
        onOpen(pos: {
            aroundCorner: PlaceCorner;
            aroundNodePos: PlacePosition;
            corner: PlaceCorner;
            x: number;
            y: number;
        }): void;
        /**
         * Handler for keydown events
         *
         * Keep keyboard focus in dialog; close dialog on escape key
         */
        _onKey(evt: KeyboardEvent): void;
    }
    interface TooltipDialogConstructor extends _WidgetBaseConstructor<TooltipDialog> {
    }
}
declare namespace DijitJS {
    namespace layout {
        interface _LayoutWidget extends _Widget, _Container, _Contained {
            /**
             * Base class for a _Container widget which is responsible for laying
             * out its children. Widgets which mixin this code must define layout()
             * to manage placement and sizing of the children.
             */
            baseClass: string;
            /**
             * Indicates that this widget is going to call resize() on its
             * children widgets, setting their size, when they become visible.
             */
            isLayoutContainer: boolean;
            /**
             * Call this to resize a widget, or after its size has changed.
             *
             * ####Change size mode:
             *
             * When changeSize is specified, changes the marginBox of this widget
             * and forces it to re-layout its contents accordingly.
             * changeSize may specify height, width, or both.
             *
             * If resultSize is specified it indicates the size the widget will
             * become after changeSize has been applied.
             *
             * ####Notification mode:
             *
             * When changeSize is null, indicates that the caller has already changed
             * the size of the widget, or perhaps it changed because the browser
             * window was resized. Tells widget to re-layout its contents accordingly.
             *
             * If resultSize is also specified it indicates the size the widget has
             * become.
             *
             * In either mode, this method also:
             *
             * 1. Sets this._borderBox and this._contentBox to the new size of
             * 	the widget. Queries the current domNode size if necessary.
             * 2. Calls layout() to resize contents (and maybe adjust child widgets).
             */
            resize(changeSize?: {
                l?: number;
                t?: number;
                w?: number;
                h?: number;
            }, resultSize?: DojoJS.DomGeometryWidthHeight): void;
            /**
             * Widgets override this method to size and position their contents/children.
             * When this is called, this._contentBox is guaranteed to be set (see resize()).
             *
             * This is called after startup(), and also when the widget's size has been
             * changed.
             */
            layout(): void;
        }
        interface _LayoutWidgetConstructor extends _WidgetBaseConstructor<_LayoutWidget> {
        }
        interface _TabContainerBase extends StackContainer, _TemplatedMixin {
            /**
             * Defines where tabs go relative to tab content.
             * "top", "bottom", "left-h", "right-h"
             */
            tabPosition: string;
            /**
             * Defines whether the tablist gets an extra class for layouting, putting a border/shading
             * around the set of tabs.   Not supported by claro theme.
             */
            tabStrip: boolean;
            /**
             * If true, use styling for a TabContainer nested inside another TabContainer.
             * For tundra etc., makes tabs look like links, and hides the outer
             * border since the outer TabContainer already has a border.
             */
            nested: boolean;
        }
        interface LayoutContainer extends _LayoutWidget {
            /**
             * Which design is used for the layout:
             *
             * - "headline" (default) where the top and bottom extend the full width of the container
             * - "sidebar" where the left and right sides extend from top to bottom.
             *
             * However, a `layoutPriority` setting on child panes overrides the `design` attribute on the parent.
             * In other words, if the top and bottom sections have a lower `layoutPriority` than the left and right
             * panes, the top and bottom panes will extend the entire width of the box.
             */
            design: string;
            addChild<T extends _WidgetBase>(child: T, insertIndex?: number): void;
            removeChild<T extends _WidgetBase>(child: T): void;
        }
        interface LayoutContainerConstructor extends _WidgetBaseConstructor<LayoutContainer> {
        }
        interface _AccordionButton extends _WidgetBase, _TemplatedMixin, _CssStateMixin {
            /**
             * Title of the pane.
             */
            label: string;
            /**
             * Tooltip that appears on hover.
             */
            title: string;
            /**
             * CSS class for icon to left of label.
             */
            iconClassAttr: string;
            /**
             * Returns the height of the title dom node.
             */
            getTitleHeight(): number;
        }
        interface _AccordionButtonConstructor extends _WidgetBaseConstructor<_AccordionButton> {
        }
        interface AccordionContainer extends StackContainer {
            /**
             * Amount of time (in ms) it takes to slide panes.
             */
            duration: number;
            /**
             * The name of the widget used to display the title of each pane.
             */
            buttonWidget: _AccordionButtonConstructor;
        }
        interface AccordionContainerConstructor extends _WidgetBaseConstructor<AccordionContainer> {
        }
        interface AccordionPane extends ContentPane {
            /**
             * Called when this pane is selected.
             */
            onSelected(): void;
        }
        interface AccordionPaneConstructor extends _WidgetBaseConstructor<AccordionPane> {
        }
        interface BorderContainer extends LayoutContainer {
            /**
             * Give each pane a border and margin.
             * Margin determined by domNode.paddingLeft.
             * When false, only resizable panes have a gutter (i.e. draggable splitter) for resizing.
             */
            gutters: boolean;
            /**
             * Specifies whether splitters resize as you drag (true) or only upon mouseup (false)
             */
            liveSplitters: boolean;
            /**
             * Save splitter positions in a cookie.
             */
            persist: boolean;
            /**
             * Returns the widget responsible for rendering the splitter associated with region.with
             */
            getSplitter(region: string): any;
            destroyRecursive(): void;
        }
        interface BorderContainerConstructor extends _WidgetBaseConstructor<BorderContainer> {
        }
        interface ContentPane extends _Widget, _Container, _ContentPaneResizeMixin {
            /**
             * The href of the content that displays now
             * Set this at construction if you want to load data externally when th
             * pane is shown.  (Set preload=true to load it immediately.
             * Changing href after creation doesn't have any effect; Use set('href', ...);
             */
            href: string;
            /**
             * The innerHTML of the ContentPane
             * Note that the initialization parameter / argument to set("content", ...
             * can be a String, DomNode, Nodelist, or _Widget.
             */
            content: string | Node | ArrayLike<Node> | DijitJS._Widget;
            /**
             * Extract visible content from inside of `<body> .... </body>`
             * I.e., strip `<html>` and `<head>` (and it's contents) from the href
             */
            extractContent: boolean;
            /**
             * Parse content and create the widgets, if any.
             */
            parseOnLoad: boolean;
            /**
             * Flag passed to parser.  Root for attribute names to search for.   If scopeName is dojo
             * will search for data-dojo-type (or dojoType).  For backwards compatibilit
             * reasons defaults to dojo._scopeName (which is "dojo" except whe
             * multi-version support is used, when it will be something like dojo16, dojo20, etc.)
             */
            parserScope: string;
            /**
             * Prevent caching of data from href's by appending a timestamp to the href.
             */
            preventCache: boolean;
            /**
             * Force load of data on initialization even if pane is hidden.
             */
            preload: boolean;
            /**
             * Refresh (re-download) content when pane goes from hidden to shown
             */
            refreshOnShow: boolean;
            /**
             * Message that shows while downloading
             */
            loadingMessage: string;
            /**
             * Message that shows if an error occurs
             */
            errorMessage: string;
            /**
             * True if the ContentPane has data in it, either specifie
             * during initialization (via href or inline content), or se
             * via set('content', ...) / set('href', ...
             * False if it doesn't have any content, or if ContentPane i
             * still in the process of downloading href.
             */
            isLoaded: boolean;
            baseClass: string;
            /**
             * Function that should grab the content specified via href.
             */
            ioMethod<T>(url: string, options?: DojoJS.request.XhrBaseOptions): DojoJS.Promise<T>;
            /**
             * Parameters to pass to xhrGet() request, for example:
             * |	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="href: './bar', ioArgs: {timeout: 500}">
             */
            ioArgs: {
                [arg: string]: string | number;
            };
            /**
             * This is the `dojo.Deferred` returned by set('href', ...) and refresh()
             * Calling onLoadDeferred.then() registers you
             * callback to be called only once, when the prior set('href', ...) call o
             * the initial href parameter to the constructor finishes loading
             * This is different than an onLoad() handler which gets called any time any hre
             * or content is loaded.
             */
            onLoadDeferred: DojoJS.Deferred<any>;
            /**
             * Flag to parser that I'll parse my contents, so it shouldn't.
             */
            stopParser: boolean;
            /**
             * Flag from the parser that this ContentPane is inside a templat
             * so the contents are pre-parsed.
             */
            template: boolean;
            markupFactory<T>(params: any, node: HTMLElement, ctor: Constructor<T>): T;
            postMixInProperties(): void;
            buildRendering(): void;
            /**
             * Call startup() on all children including non _Widget ones like dojo/dnd/Source objects
             */
            startup(): void;
            /**
             * Deprecated.   Use set('href', ...) instead.
             */
            setHref(href: string | URL): ContentPane;
            /**
             * Deprecated.   Use set('content', ...) instead.
             */
            setContent(data: string | Node | ArrayLike<Node>): ContentPane;
            /**
             * Cancels an in-flight download of content
             */
            cancel(): void;
            /**
             * [Re]download contents of href and display
             */
            refresh(): DojoJS.Deferred<any>;
            /**
             * Destroy all the widgets inside the ContentPane and empty containerNode
             */
            destroyDescendants(preserveDom?: boolean): void;
            /**
             * Event hook, is called after everything is loaded and widgetified
             */
            onLoad(data?: any): void;
            /**
             * Event hook, is called before old content is cleared
             */
            onUnload(): void;
            /**
             * Called before download starts.
             */
            onDownloadStart(): string;
            /**
             * Called on DOM faults, require faults etc. in content.
             * In order to display an error message in the pane, return
             * the error message from this method, as an HTML string.
             * By default (if this method is not overriden), it returns
             * nothing, so the error message is just printed to the console.
             */
            onContentError(error: Error): void;
            /**
             * Called when download error occurs.
             * In order to display an error message in the pane, return
             * the error message from this method, as an HTML string.
             * Default behavior (if this method is not overriden) is to display
             * the error message inside the pane.
             */
            onDownloadError(error: Error): void;
            /**
             * Called when download is finished.
             */
            onDownloadEnd(): void;
        }
        interface ContentPaneConstructor extends _WidgetBaseConstructor<ContentPane> {
        }
        interface _ContentPaneResizeMixin {
            /**
             * - false - don't adjust size of children
             * - true - if there is a single visible child widget, set it's size to however big the ContentPane is
             */
            doLayout: boolean;
            /**
             * Indicates that this widget will call resize() on it's child widgets
             * when they become visible.
             */
            isLayoutContainer: boolean;
            /**
             * See `dijit/layout/_LayoutWidget.startup()` for description.
             * Although ContentPane doesn't extend _LayoutWidget, it does implement
             * the same API.
             */
            startup(): void;
            /**
             * See `dijit/layout/_LayoutWidget.resize()` for description.
             * Although ContentPane doesn't extend _LayoutWidget, it does implement
             * the same API.
             */
            resize(changeSize?: {
                l?: number;
                t?: number;
                w?: number;
                h?: number;
            }, resultSize?: DojoJS.DomGeometryWidthHeight): void;
        }
        interface _ContentPaneResizeMixinConstructor extends _WidgetBaseConstructor<_ContentPaneResizeMixin> {
        }
        interface LinkPane extends ContentPane, _TemplatedMixin {
        }
        interface LinkPaneConstructor extends _WidgetBaseConstructor<LinkPane> {
        }
        interface ScrollingTabController extends TabController, _WidgetsInTemplateMixin {
            /**
             * True if a menu should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useMenu: boolean;
            /**
             * True if a slider should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useSlider: boolean;
            /**
             * The css class to apply to the tab strip, if it is visible.
             */
            tabStripClass: string;
            /**
             * Creates an Animation object that smoothly scrolls the tab list
             * either to a fixed horizontal pixel value, or to the selected tab.
             */
            createSmoothScroll(pixels?: number): DojoJS.Animation;
            /**
             * Scrolls the menu to the right.
             */
            doSlideRight(e: MouseEvent): void;
            /**
             * Scrolls the menu to the left.
             */
            doSlideLeft(e: MouseEvent): void;
            /**
             * Scrolls the tab list to the left or right by 75% of the widget
             * width.
             */
            doSlide(direction: number, node: HTMLElement): void;
        }
        interface ScrollingTabControllerConstructor extends _WidgetBaseConstructor<ScrollingTabController> {
        }
        interface StackContainer extends _LayoutWidget {
            /**
             * If true, change the size of my currently displayed child to match my size.
             */
            doLayout: boolean;
            /**
             * Remembers the selected child across sessions.
             */
            persist: boolean;
            /**
             * References the currently selected child widget, if any.
             * Adjust selected child with selectChild() method.
             */
            selectedChildWidget: _Widget;
            selectChild<T extends _WidgetBase>(page: T | string, animate: boolean): DojoJS.Promise<any>;
            forward(): DojoJS.Promise<any>;
            back(): DojoJS.Promise<any>;
            closeChild<T extends _WidgetBase>(page: T): void;
            /**
             * Destroy all the widgets inside the StackContainer and empty containerNode
             */
            destroyDescendants(preserveDom?: boolean): void;
        }
        interface StackContainerConstructor extends _WidgetBaseConstructor<StackContainer> {
        }
        interface StackContainerChildWidget extends _WidgetBase {
            /**
             * Specifies that this widget should be the initially displayed pane.
             * Note: to change the selected child use `dijit/layout/StackContainer.selectChild`
             */
            selected: boolean;
            /**
             * Specifies that the button to select this pane should be disabled.
             * Doesn't affect programmatic selection of the pane, nor does it deselect the pane if it is currently selected.
             */
            disabled: boolean;
            /**
             * True if user can close (destroy) this child, such as (for example) clicking the X on the tab.
             */
            closable: boolean;
            /**
             * CSS class specifying icon to use in label associated with this pane.
             */
            iconClass: string;
            /**
             * When true, display title of this widget as tab label etc., rather than just using
             * icon specified in iconClass.
             */
            showTitle: boolean;
        }
        interface _StackButton extends DijitJS.form.ToggleButton {
            /**
             * When true, display close button for this tab.
             */
            closeButton: boolean;
        }
        interface _StackButtonConstructor extends _WidgetBaseConstructor<_StackButton> {
        }
        interface StackControllerBase extends _Widget, _TemplatedMixin, _Container {
            /**
             * The id of the page container I point to.
             */
            containerId: string;
            /**
             * CSS class of [x] close icon used by event delegation code to tell when
             * the close button was clicked.
             */
            buttonWidgetCloseClass: string;
            /**
             * Returns the button corresponding to the pane with the given id.
             */
            pane2button<T extends _WidgetBase>(id: string): T;
            /**
             * Called after the StackContainer has finished initializing.
             */
            onStartup(info: Object): void;
            /**
             * Called whenever a page is added to the container. Create button
             * corresponding to the page.
             */
            onAddChild<T extends _WidgetBase>(page: T, insertIndex?: number): void;
            /**
             * Called whenever a page is removed from the container. Remove the
             * button corresponding to the page.
             */
            onRemoveChild<T extends _WidgetBase>(page: T): void;
            /**
             * Called when a page has been selected in the StackContainer, either
             * by me or by another StackController.
             */
            onSelectChild<T extends _WidgetBase>(page: T): void;
            /**
             * Called whenever one of my child buttons is pressed in an attempt to
             * select a page.
             */
            onButtonClick<T extends _WidgetBase>(page: T): void;
            /**
             * Called whenever one of my child buttons [X] is pressed in an attempt
             * to close a page.
             */
            onCloseButtonClick<T extends _WidgetBase>(page: T): void;
            /**
             * Helper for onkeydown to find next/previous button.
             */
            adjacent(forward: boolean): _WidgetBase;
            /**
             * Handle keystrokes on the page list, for advancing to next/previous
             * button and closing the page in the page is closable.
             */
            onkeydown(e: Event, fromContainer?: boolean): void;
            /**
             * Called when there was a keydown on the container.
             */
            onContainerKeyDown(info: Object): void;
        }
        interface StackController extends StackControllerBase {
            /**
             * The button widget to create to correspond to each page.
             */
            buttonWidget: _StackButtonConstructor;
        }
        interface StackControllerConstructor extends _WidgetBaseConstructor<StackController> {
        }
        interface TabContainer extends _TabContainerBase {
            /**
             * True if a menu should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useMenu: boolean;
            /**
             * True if a slider should be used to select tabs when they are too
             * wide to fit the TabContainer, false otherwise.
             */
            useSlider: boolean;
            /**
             * An optional parameter to override the widget used to display the tab labels.
             */
            controllerWidget: string;
        }
        interface TabContainerConstructor extends _WidgetBaseConstructor<TabContainer> {
        }
        interface _TabButton extends _StackButton {
        }
        interface _TabButtonConstructor extends _WidgetBaseConstructor<_TabButton> {
        }
        interface TabController extends StackControllerBase {
            /**
             * Defines where tabs go relative to the content.
             * "top", "bottom", "left-h", "right-h"
             */
            tabPosition: string;
            /**
             * The tab widget to create to correspond to each page.
             */
            buttonWidget: _TabButtonConstructor;
            /**
             * Class of [x] close icon, used by event delegation code to tell
             * when close button was clicked.
             */
            buttonWidgetCloseClass: string;
        }
        interface TabControllerConstructor extends _WidgetBaseConstructor<TabController> {
            TabButton: _TabButton;
        }
    }
}
declare namespace DijitJS {
    namespace form {
        interface Constraints {
            [prop: string]: any;
        }
        interface ConstrainedValueFunction<V, C extends Constraints, T> {
            /**
             * Returns a value that has been constrained by the constraints
             * @param   value       The value to constrain
             * @param   constraints The constraints to use
             * @returns             The constrained value
             */
            (value: V, constraints: C): T;
        }
        interface ConstrainedValidFunction<C extends Constraints> {
            /**
             * Returns true if the value is valid based on the constraints, otherwise
             * returns false.
             * @param   value       The value to check
             * @param   constraints The constraints to use
             * @returns             true if valid, otherwise false
             */
            (value: any, constraints: C): boolean;
        }
        interface ConstraintsToRegExpString<C extends Constraints> {
            /**
             * Takes a set of constraints and returns a RegExpString that can be used
             * to match values against
             * @param   constraints The constraints to use
             * @returns             The RegExpString that represents the constraints
             */
            (constraints: C): string;
        }
        interface SerializationFunction {
            (val: any, options?: Object): string;
        }
        interface _AutoCompleterMixin<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends _SearchMixin<T, Q, O> {
            /**
             * This is the item returned by the dojo/store/api/Store implementation that
             * provides the data for this ComboBox, it's the currently selected item.
             */
            item: T;
            /**
             * If user types in a partial string, and then tab out of the `<input>` box,
             * automatically copy the first entry displayed in the drop down list to
             * the `<input>` field
             */
            autoComplete: boolean;
            /**
             * One of: "first", "all" or "none".
             */
            highlightMatch: 'first' | 'all' | 'none';
            /**
             * The entries in the drop down list come from this attribute in the
             * dojo.data items.
             * If not specified, the searchAttr attribute is used instead.
             */
            labelAttr: string;
            /**
             * Specifies how to interpret the labelAttr in the data store items.
             * Can be "html" or "text".
             */
            labelType: string;
            /**
             * Flags to _HasDropDown to limit height of drop down to make it fit in viewport
             */
            maxHeight: number;
            /**
             * For backwards compatibility let onClick events propagate, even clicks on the down arrow button
             */
            _stopClickEvents: boolean;
            _getCaretPos(element: HTMLElement): number;
            _setCaretPos(element: HTMLElement, location: number): void;
            /**
             * Overrides _HasDropDown.loadDropDown().
             */
            loadDropDown(loadCallback: () => void): void;
            /**
             * signal to _HasDropDown that it needs to call loadDropDown() to load the
             * drop down asynchronously before displaying it
             */
            isLoaded(): boolean;
            /**
             * Overrides _HasDropDown.closeDropDown().  Closes the drop down (assuming that it's open).
             * This method is the callback when the user types ESC or clicking
             * the button icon while the drop down is open.  It's also called by other code.
             */
            closeDropDown(focus?: boolean): void;
            postMixInProperties(): void;
            postCreate(): void;
            /**
             * Highlights the string entered by the user in the menu.  By default this
             * highlights the first occurrence found. Override this method
             * to implement your custom highlighting.
             */
            doHighlight(label: string, find: string): string;
            reset(): void;
            labelFunc(item: T, store: any): string;
            set(name: 'value', value: string): this;
            set(name: 'item', value: T): this;
            set(name: 'disabled', value: boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ButtonMixin {
            /**
             * A mixin to add a thin standard API wrapper to a normal HTML button
             */
            label: string;
            /**
             * Type of button (submit, reset, button, checkbox, radio)
             */
            type: string;
            postCreate(): void;
            /**
             * Callback for when button is clicked.
             * If type="submit", return true to perform submit, or false to cancel it.
             */
            onClick(e: Event): boolean;
            onSetLabel(e: Event): void;
        }
        interface _CheckBoxMixin {
            /**
             * type attribute on `<input>` node.
             * Overrides `dijit/form/Button.type`.  Users should not change this value.
             */
            type: string;
            /**
             * As an initialization parameter, equivalent to value field on normal checkbox
             * (if checked, the value is passed as the value when form is submitted).
             */
            value: string;
            /**
             * Should this widget respond to user input?
             * In markup, this is specified as "readOnly".
             * Similar to disabled except readOnly form values are submitted.
             */
            readOnly: boolean;
            reset: () => void;
        }
        interface _ComboBoxMenu<T> extends _WidgetBase, _TemplatedMixin, _ListMouseMixin, _ComboBoxMenuMixin<T> {
            templateString: string;
            baseClass: string;
            /**
             * Add hover CSS
             */
            onHover(node: HTMLElement): void;
            /**
             * Remove hover CSS
             */
            onUnhover(node: HTMLElement): void;
            /**
             * Add selected CSS
             */
            onSelect(node: HTMLElement): void;
            /**
             * Remove selected CSS
             */
            onDeselect(node: HTMLElement): void;
            /**
             * Handles page-up and page-down keypresses
             */
            _page(up?: boolean): void;
            /**
             * Handle keystroke event forwarded from ComboBox, returning false if it's
             * a keystroke I recognize and process, true otherwise.
             */
            handleKey(evt: KeyboardEvent): boolean;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ComboBoxMenuConstructor extends _WidgetBaseConstructor<_ComboBoxMenu<any>> {
            new <T>(params: Object, srcNodeRef: Node | string): _ComboBoxMenu<T>;
        }
        interface _ComboBoxMenuMixin<T> {
            /**
             * Holds "next" and "previous" text for paging buttons on drop down
             */
            _messages: {
                next: string;
                previous: string;
            };
            onClick(node: HTMLElement): void;
            /**
             * Notifies ComboBox/FilteringSelect that user selected an option.
             */
            onChange(direction: number): void;
            /**
             * Notifies ComboBox/FilteringSelect that user clicked to advance to next/previous page.
             */
            onPage(direction: number): void;
            /**
             * Callback from dijit.popup code to this widget, notifying it that it closed
             */
            onClose(): void;
            /**
             * Fills in the items in the drop down list
             */
            createOptions(results: T[], options: DojoJS.QueryOptions, labelFunc: (item: T) => {
                html: boolean;
                label: string;
            }): void;
            /**
             * Clears the entries in the drop down list, but of course keeps the previous and next buttons.
             */
            clearResultList(): void;
            /**
             * Highlight the first real item in the list (not Previous Choices).
             */
            highlightFirstOption(): void;
            /**
             * Highlight the last real item in the list (not More Choices).
             */
            highlightLastOption(): void;
            selectFirstNode(): void;
            selectLastNode(): void;
            getHighlightedOption(): HTMLElement;
            set(name: 'value', value: Object): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface DateLocaleFormatOptions {
            /**
             * choice of 'time','date' (default: date and time)
             */
            selector?: 'time' | 'date';
            /**
             * choice of long, short, medium or full (plus any custom additions).  Defaults to 'short'
             */
            formatLength?: 'long' | 'short' | 'medium' | 'full';
            /**
             * override pattern with this string
             */
            datePattern?: string;
            /**
             * override strings for am in times
             */
            timePattern?: string;
            /**
             * override strings for pm in times
             */
            am?: string;
            /**
             * override strings for pm in times
             */
            pm?: string;
            /**
             * override the locale used to determine formatting rules
             */
            locale?: string;
            /**
             * (format only) use 4 digit years whenever 2 digit years are called for
             */
            fullYear?: boolean;
            /**
             * (parse only) strict parsing, off by default
             */
            strict?: boolean;
        }
        interface DateTimeConstraints extends Constraints, DateLocaleFormatOptions {
        }
        interface _DateTimeTextBox<T extends _WidgetBase> extends RangeBoundTextBox, _HasDropDown<T> {
            templateString: string;
            /**
             * Set this textbox to display a down arrow button, to open the drop down list.
             */
            hasDownArrow: boolean;
            cssStateNodes: CSSStateNodes;
            /**
             * Despite the name, this parameter specifies both constraints on the input
             * (including starting/ending dates/times allowed) as well as
             * formatting options like whether the date is displayed in long (ex: December 25, 2005)
             * or short (ex: 12/25/2005) format.  See `dijit/form/_DateTimeTextBox.__Constraints` for details.
             */
            constraints: DateTimeConstraints;
            /**
             * The constraints without the min/max properties. Used by the compare() method
             */
            _unboundedConstraints: DateTimeConstraints;
            pattern: (options?: DateLocaleFormatOptions | RangeBoundTextBoxConstraints) => string;
            /**
             * JavaScript namespace to find calendar routines.	 If unspecified, uses Gregorian calendar routines
             * at dojo/date and dojo/date/locale.
             */
            datePackage: string;
            postMixInProperties(): void;
            compare(val1: Date, val2: Date): number;
            autoWidth: boolean;
            /**
             * Formats the value as a Date, according to specified locale (second argument)
             */
            format: ConstrainedValueFunction<Date, DateTimeConstraints, string>;
            /**
             * Parses as string as a Date, according to constraints
             */
            parse: ConstrainedValueFunction<string, DateTimeConstraints, Date>;
            serialize(val: any, options?: {
                /**
                 * "date" or "time" for partial formatting of the Date object.
                 * Both date and time will be formatted by default.
                 */
                selector?: 'time' | 'date';
                /**
                 * if true, UTC/GMT is used for a timezone
                 */
                zulu?: boolean;
                /**
                 * if true, output milliseconds
                 */
                milliseconds?: boolean;
            }): string;
            /**
             * The default value to focus in the popupClass widget when the textbox value is empty.
             */
            dropDownDefaultValue: Date;
            /**
             * The value of this widget as a JavaScript Date object.  Use get("value") / set("value", val) to manipulate.
             * When passed to the parser in markup, must be specified according to `dojo/date/stamp.fromISOString()`
             */
            value: Date;
            _blankValue: string;
            /**
             * Name of the popup widget class used to select a date/time.
             * Subclasses should specify this.
             */
            popupClass: string | _WidgetBaseConstructor<T>;
            /**
             * Specifies constraints.selector passed to dojo.date functions, should be either
             * "date" or "time".
             * Subclass must specify this.
             */
            _selector: 'data' | 'time';
            buildRendering(): void;
            /**
             * Runs various tests on the value, checking for invalid conditions
             */
            _isInvalidDate(value: Date): boolean;
            get(name: 'displayedValue'): string;
            get(name: string): any;
            set(name: 'displayedValue', value: string): this;
            set(name: 'dropDownDefaultValue', value: Date): this;
            set(name: 'value', value: Date | string): this;
            set(name: 'constraints', value: DateTimeConstraints): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _DateTimeTextBoxConstructor<T extends _WidgetBase> extends _WidgetBaseConstructor<_DateTimeTextBox<T>> {
        }
        interface _ExpandingTextAreaMixin {
            postCreate(): void;
            startup(): void;
            resize(): void;
        }
        interface OnValidStateChange {
            (isValid?: boolean): void;
        }
        interface _FormMixin {
            /**
             * Will be "Error" if one or more of the child widgets has an invalid value,
             * "Incomplete" if not all of the required child widgets are filled in.  Otherwise, "",
             * which indicates that the form is ready to be submitted.
             */
            state: '' | 'Error' | 'Incomplete';
            /**
             * Returns all form widget descendants, searching through non-form child widgets like BorderContainer
             */
            _getDescendantFormWidgets(children?: _WidgetBase[]): _FormWidget[];
            reset(): void;
            /**
             * returns if the form is valid - same as isValid - but
             * provides a few additional (ui-specific) features:
             *
             * 1. it will highlight any sub-widgets that are not valid
             * 2. it will call focus() on the first invalid sub-widget
             */
            validate(): boolean;
            setValues(val: any): _FormMixin;
            getValues(): any;
            /**
             * Returns true if all of the widgets are valid.
             * Deprecated, will be removed in 2.0.  Use get("state") instead.
             */
            isValid(): boolean;
            /**
             * Stub function to connect to if you want to do something
             * (like disable/enable a submit button) when the valid
             * state changes on the form as a whole.
             *
             * Deprecated.  Will be removed in 2.0.  Use watch("state", ...) instead.
             */
            onValidStateChange: OnValidStateChange;
            /**
             * Compute what this.state should be based on state of children
             */
            _getState(): '' | 'Error' | 'Incomplete';
            /**
             * Deprecated method.   Applications no longer need to call this.   Remove for 2.0.
             */
            disconnectChildren(): void;
            /**
             * You can call this function directly, ex. in the event that you
             * programmatically add a widget to the form *after* the form has been
             * initialized.
             */
            connectChildren(inStartup?: boolean): void;
            /**
             * Called when child's value or disabled state changes
             */
            _onChildChange(attr?: string): void;
            startup(): void;
            destroy(preserveDom?: boolean): void;
        }
        interface _FormMixinConstructor extends DojoJS.DojoClass<_FormMixin> {
        }
        interface SelectOption {
            value?: string;
            label: string;
            selected?: boolean;
            disabled?: boolean;
        }
        interface _FormSelectWidget<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends _FormValueWidget {
            /**
             * Whether or not we are multi-valued
             */
            multiple: boolean;
            /**
             * The set of options for our select item.  Roughly corresponds to
             * the html `<option>` tag.
             */
            options: SelectOption[];
            /**
             * A store to use for getting our list of options - rather than reading them
             * from the `<option>` html tags.   Should support getIdentity().
             * For back-compat store can also be a dojo/data/api/Identity.
             */
            store: any;
            /**
             * A query to use when fetching items from our store
             */
            query: Q;
            /**
             * Query options to use when fetching from the store
             */
            queryOptions: O;
            /**
             * The entries in the drop down list come from this attribute in the dojo.store items.
             * If ``store`` is set, labelAttr must be set too, unless store is an old-style
             * dojo.data store rather than a new dojo/store.
             */
            labelAttr: string;
            /**
             * A callback to do with an onFetch - but before any items are actually
             * iterated over (i.e. to filter even further what you want to add)
             */
            onFetch: (items: T[]) => void;
            /**
             * Flag to sort the options returned from a store by the label of
             * the store.
             */
            sortByLabel: boolean;
            /**
             * By default loadChildren is called when the items are fetched from the
             * store.  This property allows delaying loadChildren (and the creation
             * of the options/menuitems) until the user clicks the button to open the
             * dropdown.
             */
            loadChildrenOnOpen: boolean;
            /**
             * This is the `dojo.Deferred` returned by setStore().
             * Calling onLoadDeferred.then() registers your
             * callback to be called only once, when the prior setStore completes.
             */
            onLoadDeferred: DojoJS.Deferred<void>;
            /**
             * Returns a given option (or options).
             */
            getOptions(valueOrIdx: string): SelectOption;
            getOptions(valueOrIdx: number): SelectOption;
            getOptions(valueOrIdx: SelectOption): SelectOption;
            getOptions(valueOrIdx: (string | number | SelectOption)[]): SelectOption[];
            getOptions(): SelectOption[];
            /**
             * Adds an option or options to the end of the select.  If value
             * of the option is empty or missing, a separator is created instead.
             * Passing in an array of options will yield slightly better performance
             * since the children are only loaded once.
             */
            addOption(option: SelectOption | SelectOption[]): void;
            /**
             * Removes the given option or options.  You can remove by string
             * (in which case the value is removed), number (in which case the
             * index in the options array is removed), or select option (in
             * which case, the select option with a matching value is removed).
             * You can also pass in an array of those values for a slightly
             * better performance since the children are only loaded once.
             * For numeric option values, specify {value: number} as the argument.
             */
            removeOption(option: string | number | SelectOption | (string | number | SelectOption)[]): void;
            /**
             * Updates the values of the given option.  The option to update
             * is matched based on the value of the entered option.  Passing
             * in an array of new options will yield better performance since
             * the children will only be loaded once.
             */
            updateOption(newOption: SelectOption | SelectOption[]): void;
            /**
             * Deprecated!
             */
            setStore(store: any, selectedValue?: T, fetchArgs?: {
                query: Q;
                queryOptions: O;
                onFetch: (items: T[], fetchArgs?: any) => void;
            }): any;
            /**
             * Sets the store you would like to use with this select widget.
             * The selected value is the value of the new store to set.  This
             * function returns the original store, in case you want to reuse
             * it or something.
             */
            _deprecatedSetStore(store: any, selectedValue?: T, fetchArgs?: {
                query: Q;
                queryOptions: O;
                onFetch: (items: T[], fetchArgs?: any) => void;
            }): any;
            /**
             * Loads the children represented by this widget's options.
             * reset the menu to make it populatable on the next click
             */
            _loadChildren(): void;
            /**
             * Sets the "selected" class on the item for styling purposes
             */
            _updateSelection(): void;
            /**
             * Returns the value of the widget by reading the options for
             * the selected flag
             */
            _getValueFromOpts(): string;
            buildRendering(): void;
            /**
             * Loads our options and sets up our dropdown correctly.  We
             * don't want any content, so we don't call any inherit chain
             * function.
             */
            _fillContent(): void;
            /**
             * sets up our event handling that we need for functioning
             * as a select
             */
            postCreate(): void;
            startup(): void;
            /**
             * Clean up our connections
             */
            destroy(preserveDom?: boolean): void;
            /**
             * User-overridable function which, for the given option, adds an
             * item to the select.  If the option doesn't have a value, then a
             * separator is added in that place.  Make sure to store the option
             * in the created option widget.
             */
            _addOptionItem(option: SelectOption): void;
            /**
             * User-overridable function which, for the given option, removes
             * its item from the select.
             */
            _removeOptionItem(option: SelectOption): void;
            /**
             * Overridable function which will set the display for the
             * widget.  newDisplay is either a string (in the case of
             * single selects) or array of strings (in the case of multi-selects)
             */
            _setDisplay(newDisplay: string | string[]): void;
            /**
             * Overridable function to return the children that this widget contains.
             */
            _getChildren(): any[];
            /**
             * hooks into this.attr to provide a mechanism for getting the
             * option items for the current value of the widget.
             */
            _getSelectedOptionsAttr(): SelectOption[];
            /**
             * a function that will "fake" loading children, if needed, and
             * if we have set to not load children until the widget opens.
             */
            _pseudoLoadChildren(items: T[]): void;
            /**
             * a function that can be connected to in order to receive a
             * notification that the store has finished loading and all options
             * from that store are available
             */
            onSetStore(): void;
        }
        interface _FormValueMixin extends _FormWidgetMixin {
            /**
             * Should this widget respond to user input?
             * In markup, this is specified as "readOnly".
             * Similar to disabled except readOnly form values are submitted.
             */
            readOnly: boolean;
            postCreate(): void;
            /**
             * Restore the value to the last value passed to onChange
             */
            undo(): void;
            /**
             * Reset the widget's value to what it was at initialization time
             */
            reset(): void;
            _hasBeenBlurred?: boolean;
        }
        interface _FormValueWidget extends _FormWidget, _FormValueMixin {
            /**
             * Work around table sizing bugs on IE7 by forcing redraw
             */
            _layoutHackIE7(): void;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _FormValueWidgetConstructor extends _WidgetBaseConstructor<_FormValueWidget> {
        }
        interface _FormWidget extends _Widget, _TemplatedMixin, _CssStateMixin, _FormWidgetMixin {
            setDisabled(disabled: boolean): void;
            setValue(value: string): void;
            postMixInProperties(): void;
            set(name: 'value', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _FormWidgetConstructor extends _WidgetBaseConstructor<_FormWidget> {
        }
        interface _FormWidgetMixin {
            /**
             * Name used when submitting form; same as "name" attribute or plain HTML elements
             */
            name: string;
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             */
            alt: string;
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             */
            value: any;
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             */
            type: string;
            /**
             * Apply aria-label in markup to the widget's focusNode
             */
            'aria-label': string;
            /**
             * Order fields are traversed when user hits the tab key
             */
            tabIndex: number;
            /**
             * Should this widget respond to user input?
             * In markup, this is specified as "disabled='disabled'", or just "disabled".
             */
            disabled: boolean;
            /**
             * Fires onChange for each value change or only on demand
             */
            intermediateChanges: boolean;
            /**
             * On focus, should this widget scroll into view?
             */
            scrollOnFocus: boolean;
            /**
             * Tells if this widget is focusable or not.  Used internally by dijit.
             */
            isFocusable(): boolean;
            /**
             * Put focus on this widget
             */
            focus(): void;
            /**
             * Compare 2 values (as returned by get('value') for this widget).
             */
            compare(val1: any, val2: any): number;
            /**
             * Callback when this widget's value is changed.
             */
            onChange(value: string): void;
            /**
             * Overrides _Widget.create()
             */
            create(params?: any, srcNodeRef?: HTMLElement): void;
            destroy(preserveDom?: boolean): void;
            set(name: 'disabled', value: boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ListBase {
            /**
             * currently selected node
             */
            selected: HTMLElement;
            /**
             * Select the first displayed item in the list.
             */
            selectFirstNode(): void;
            /**
             * Select the last displayed item in the list
             */
            selectLastNode(): void;
            /**
             * Select the item just below the current selection.
             * If nothing selected, select first node.
             */
            selectNextNode(): void;
            /**
             * Select the item just above the current selection.
             * If nothing selected, select last node (if
             * you select Previous and try to keep scrolling up the list).
             */
            selectPreviousNode(): void;
            set(name: 'selected', value: HTMLElement): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface _ListMouseMixin extends _ListBase {
            postCreate(): void;
        }
        interface _RadioButtonMixin {
            /**
             * type attribute on `<input>` node.
             * Users should not change this value.
             */
            type: string;
        }
        interface _SearchMixin<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> {
            /**
             * Argument to data provider.
             * Specifies maximum number of search results to return per query
             */
            pageSize: number;
            /**
             * Reference to data provider object used by this ComboBox.
             * The store must accept an object hash of properties for its query. See `query` and `queryExpr` for details.
             */
            store: any;
            /**
             * Mixin to the store's fetch.
             * For example, to set the sort order of the ComboBox menu, pass:
             * { sort: [{attribute:"name",descending: true}] }
             * To override the default queryOptions so that deep=false, do:
             * { queryOptions: {ignoreCase: true, deep: false} }
             */
            fetchProperties: {
                [property: string]: any;
            };
            /**
             * A query that can be passed to `store` to initially filter the items.
             * ComboBox overwrites any reference to the `searchAttr` and sets it to the `queryExpr` with the user's input substituted.
             */
            query: Q;
            /**
             * Alternate to specifying a store.  Id of a dijit/form/DataList widget.
             */
            list: string;
            /**
             * Delay in milliseconds between when user types something and we start
             * searching based on that value
             */
            searchDelay: number;
            /**
             * Search for items in the data store where this attribute (in the item)
             * matches what the user typed
             */
            searchAttr: string;
            /**
             * This specifies what query is sent to the data store,
             * based on what the user has typed.  Changing this expression will modify
             * whether the results are only exact matches, a "starting with" match,
             * etc.
             * `${0}` will be substituted for the user text.
             * `*` is used for wildcards.
             * `${0}*` means "starts with", `*${0}*` means "contains", `${0}` means "is"
             */
            queryExpr: string;
            /**
             * Set true if the query should ignore case when matching possible items
             */
            ignoreCase: boolean;
            /**
             * Helper function to convert a simple pattern to a regular expression for matching.
             */
            _patternToRegExp(pattern: string): RegExp;
            _abortQuery(): void;
            /**
             * Handles input (keyboard/paste) events
             */
            _processInput(e: KeyboardEvent): void;
            /**
             * Callback when a search completes.
             */
            onSearch(results: T[], query: Q, options: O): void;
            _startSearchFromInput(): void;
            /**
             * Starts a search for elements matching text (text=="" means to return all items
             * and calls onSearch(...) when the search completes, to display the results.
             */
            _startSearch(text: string): void;
            postMixInProperties(): void;
            set(name: 'list', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface AdjustFunction {
            (val: any, delta: number): any;
        }
        interface _Spinner extends RangeBoundTextBox {
            /**
             * Number of milliseconds before a held arrow key or up/down button becomes typematic
             */
            defaultTimeout: number;
            /**
             * minimum number of milliseconds that typematic event fires when held key or button is held
             */
            minimumTimeout: number;
            /**
             * Fraction of time used to change the typematic timer between events.
             * 1.0 means that each typematic event fires at defaultTimeout intervals.
             * Less than 1.0 means that each typematic event fires at an increasing faster rate.
             */
            timeoutChangeRate: number;
            /**
             * Adjust the value by this much when spinning using the arrow keys/buttons
             */
            smallDelta: number;
            /**
             * Adjust the value by this much when spinning using the PgUp/Dn keys
             */
            largeDelta: number;
            templateString: string;
            baseClass: string;
            cssStateNodes: CSSStateNodes;
            /**
             * Overridable function used to adjust a primitive value(Number/Date/...) by the delta amount specified.
             * The val is adjusted in a way that makes sense to the object type.
             */
            adjust: AdjustFunction;
            postCreate(): void;
        }
        interface _SpinnerConstrctor extends _WidgetBaseConstructor<_Spinner> {
        }
        interface _TextBoxMixin<C extends Constraints> {
            /**
             * Removes leading and trailing whitespace if true.  Default is false.
             */
            trim: boolean;
            /**
             * Converts all characters to uppercase if true.  Default is false.
             */
            uppercase: boolean;
            /**
             * Converts all characters to lowercase if true.  Default is false.
             */
            lowercase: boolean;
            /**
             * Converts the first character of each word to uppercase if true.
             */
            propercase: boolean;
            /**
             * HTML INPUT tag maxLength declaration.
             */
            maxLength: string;
            /**
             * If true, all text will be selected when focused with mouse
             */
            selectOnClick: boolean;
            /**
             * Defines a hint to help users fill out the input field (as defined in HTML 5).
             * This should only contain plain text (no html markup).
             */
            placeHolder: string;
            /**
             * For subclasses like ComboBox where the displayed value
             * (ex: Kentucky) and the serialized value (ex: KY) are different,
             * this represents the displayed value.
             *
             * Setting 'displayedValue' through set('displayedValue', ...)
             * updates 'value', and vice-versa.  Otherwise 'value' is updated
             * from 'displayedValue' periodically, like onBlur etc.
             */
            displayedValue: string;
            /**
             * Replaceable function to convert a value to a properly formatted string.
             */
            format: ConstrainedValueFunction<any, C, any>;
            /**
             * Replaceable function to convert a formatted string to a value
             */
            parse: ConstrainedValueFunction<any, C, any>;
            /**
             * Connect to this function to receive notifications of various user data-input events.
             * Return false to cancel the event and prevent it from being processed.
             * Note that although for historical reasons this method is called `onInput()`, it doesn't
             * correspond to the standard DOM "input" event, because it occurs before the input has been processed.
             */
            onInput(e: Event): void;
            postCreate(): void;
            /**
             * if the textbox is blank, what value should be reported
             */
            _blankValue: string;
            /**
             * Auto-corrections (such as trimming) that are applied to textbox
             * value on blur or form submit.
             */
            filter<T>(val: T): T;
            filter<T extends number>(value: T): T;
            _setBlurValue(): void;
            reset(): void;
        }
        interface _ToggleButtonMixin {
            /**
             * Corresponds to the native HTML `<input>` element's attribute.
             * In markup, specified as "checked='checked'" or just "checked".
             * True if the button is depressed, or the checkbox is checked,
             * or the radio button is selected, etc.
             */
            checked: boolean;
            postCreate(): void;
            /**
             * Reset the widget's value to what it was at initialization time
             */
            reset(): void;
            _hasBeenBlurred?: boolean;
        }
        interface Button extends _FormWidget, _ButtonMixin {
            /**
             * Set this to true to hide the label text and display only the icon.
             * (If showLabel=false then iconClass must be specified.)
             * Especially useful for toolbars.
             * If showLabel=true, the label will become the title (a.k.a. tooltip/hint)
             */
            showLabel: boolean;
            /**
             * Class to apply to DOMNode in button to make it display an icon
             */
            iconClass: string;
            baseClass: string;
            templateString: string;
            postCreate(): void;
            setLabel(content: string): void;
            onLabelSet(e: Event): void;
            onClick(e: Event): boolean;
            set(name: 'showLabel', value: boolean): this;
            set(name: 'value', value: string): this;
            set(name: 'name', value: string): this;
            set(name: 'label', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface ButtonConstructor extends _WidgetBaseConstructor<Button> {
        }
        interface CheckBox extends ToggleButton, _CheckBoxMixin {
            templateString: string;
            baseClass: string;
            postMixInProperties(): void;
            value: string;
            set(name: 'value', value: string | boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface CheckBoxConstructor extends _WidgetBaseConstructor<CheckBox> {
        }
        interface ComboBox<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions, C extends Constraints> extends ValidationTextBox<C>, ComboBoxMixin<T, Q, O> {
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface ComboBoxConstructor extends _WidgetBaseConstructor<ComboBox<any, any, any, any>> {
            new <T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions, C extends Constraints>(params: Object, srcNodeRef: Node | string): ComboBox<T, Q, O, C>;
        }
        interface ComboBoxMixin<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends _HasDropDown<_ComboBoxMenu<T>>, _AutoCompleterMixin<T, Q, O> {
            /**
             * Dropdown widget class used to select a date/time.
             * Subclasses should specify this.
             */
            dropDownClass: _ComboBoxMenu<T>;
            /**
             * Set this textbox to have a down arrow button, to display the drop down list.
             * Defaults to true.
             */
            hasDownArrow: boolean;
            templateString: string;
            baseClass: string;
            /**
             * Reference to data provider object used by this ComboBox.
             *
             * Should be dojo/store/api/Store, but dojo/data/api/Read supported
             * for backwards compatibility.
             */
            store: any;
            cssStateNodes: CSSStateNodes;
            postMixInProperties(): void;
            buildRendering(): void;
        }
        interface ComboBoxMixinConstructor<T extends object, U extends Function, V extends DojoJS.QueryOptions> extends _WidgetBaseConstructor<ComboBoxMixin<T, U, V>> {
        }
        interface NumberFormatOptions {
            /**
             * override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
             * with this string.  Default value is based on locale.  Overriding this property will defeat
             * localization.  Literal characters in patterns are not supported.
             */
            pattern?: string;
            /**
             * choose a format type based on the locale from the following:
             * decimal, scientific (not yet supported), percent, currency. decimal by default.
             */
            type?: string;
            /**
             * fixed number of decimal places to show.  This overrides any
             * information in the provided pattern.
             */
            places?: number;
            /**
             * 5 rounds to nearest .5; 0 rounds to nearest whole (default). -1
             * means do not round.
             */
            round?: number;
            /**
             * override the locale used to determine formatting rules
             */
            locale?: string;
            /**
             * If false, show no decimal places, overriding places and pattern settings.
             */
            fractional?: boolean | [boolean, boolean];
        }
        interface CurrencyFormatOptions extends NumberFormatOptions {
            /**
             * Should not be set.  Value is assumed to be "currency".
             */
            type?: string;
            /**
             * localized currency symbol. The default will be looked up in table of supported currencies in `dojo.cldr`
             * A [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code will be used if not found.
             */
            symbol?: string;
            /**
             * an [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code, a three letter sequence like "USD".
             * For use with dojo.currency only.
             */
            currency?: string;
            /**
             * number of decimal places to show.  Default is defined based on which currency is used.
             */
            places?: number;
        }
        interface NumberParseOptions {
            /**
             * override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
             * with this string.  Default value is based on locale.  Overriding this property will defeat
             * localization.  Literal characters in patterns are not supported.
             */
            pattern?: string;
            /**
             * choose a format type based on the locale from the following:
             * decimal, scientific (not yet supported), percent, currency. decimal by default.
             */
            type?: string;
            /**
             * override the locale used to determine formatting rules
             */
            locale?: string;
            /**
             * strict parsing, false by default.  Strict parsing requires input as produced by the format() method.
             * Non-strict is more permissive, e.g. flexible on white space, omitting thousands separators
             */
            strict?: boolean;
            /**
             * Whether to include the fractional portion, where the number of decimal places are implied by pattern
             * or explicit 'places' parameter.  The value [true,false] makes the fractional portion optional.
             */
            fractional?: boolean | [boolean, boolean];
        }
        interface CurrencyParseOptions extends NumberParseOptions {
            /**
             * Should not be set.  Value is assumed to be "currency".
             */
            type?: string;
            /**
             * localized currency symbol. The default will be looked up in table of supported currencies in `dojo.cldr`
             * A [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code will be used if not found.
             */
            symbol?: string;
            /**
             * an [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code, a three letter sequence like "USD".
             * For use with dojo.currency only.
             */
            currency?: string;
            /**
             * number of decimal places to show.  Default is defined based on which currency is used.
             */
            places?: number;
            /**
             * Whether to include the fractional portion, where the number of decimal places are implied by the currency
             * or explicit 'places' parameter.  The value [true,false] makes the fractional portion optional.
             * By default for currencies, it the fractional portion is optional.
             */
            fractional?: boolean | [boolean, boolean];
        }
        interface NumberRegexpOptions {
            /**
             * override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
             * with this string.  Default value is based on locale.  Overriding this property will defeat
             * localization.
             */
            pattern?: string;
            /**
             * choose a format type based on the locale from the following:
             * decimal, scientific (not yet supported), percent, currency. decimal by default.
             */
            type?: string;
            /**
             * override the locale used to determine formatting rules
             */
            locacle?: string;
            /**
             * strict parsing, false by default.  Strict parsing requires input as produced by the format() method.
             * Non-strict is more permissive, e.g. flexible on white space, omitting thousands separators
             */
            strict?: boolean;
            /**
             * number of decimal places to accept: Infinity, a positive number, or
             * a range "n,m".  Defined by pattern or Infinity if pattern not provided.
             */
            places?: number | string;
        }
        interface CurrencyTextBoxConstraints extends NumberTextBoxConstraints, CurrencyFormatOptions, CurrencyParseOptions {
        }
        interface CurrencyTextBox extends NumberTextBox {
            /**
             * the [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code, a three letter sequence like "USD"
             */
            currency: string;
            /**
             * Despite the name, this parameter specifies both constraints on the input
             * (including minimum/maximum allowed values) as well as
             * formatting options.  See `dijit/form/CurrencyTextBox.__Constraints` for details.
             */
            constraints: CurrencyTextBoxConstraints;
            baseClass: string;
            _formatter: (value: number, options?: CurrencyFormatOptions) => string;
            _parser: (expression: string, options?: CurrencyParseOptions) => number;
            _regExpGenerator: (options?: NumberRegexpOptions) => string;
            /**
             * Parses string value as a Currency, according to the constraints object
             */
            parse(value: string, constraints: CurrencyTextBoxConstraints): string;
        }
        interface CurrencyTextBoxConstructor extends _WidgetBaseConstructor<CurrencyTextBox> {
        }
        interface DataList<T extends Object> extends Type<typeof import("dojo/store/Memory")> {
            /**
             * Get the option marked as selected, like `<option selected>`.
             * Not part of dojo.data API.
             */
            fetchSelectedItem(): T;
        }
        interface DataListConstructor {
            new <T extends Object>(params: Object, srcNodeRef: Node | string): DataList<T>;
        }
        interface DateTextBox extends _DateTimeTextBox<Calendar> {
            baseClass: string;
            popupClass: CalendarConstructor;
            _selector: "time" | "data";
            maxHeight: number;
            /**
             * The value of this widget as a JavaScript Date object, with only year/month/day specified.`
             */
            value: Date;
        }
        interface DateTextBoxConstructor extends _WidgetBaseConstructor<DateTextBox> {
        }
        interface DropDownButton<T extends _WidgetBase> extends Button, _Container, _HasDropDown<T> {
            baseClass: string;
            templateString: string;
            /**
             * Overrides _TemplatedMixin#_fillContent().
             * My inner HTML possibly contains both the button label and/or a drop down widget, like
             * <DropDownButton>  <span>push me</span>  <Menu> ... </Menu> </DropDownButton>
             */
            _fillContent(): void;
            startup(): void;
            /**
             * Returns whether or not we are loaded - if our dropdown has an href,
             * then we want to check that.
             */
            isLoaded(): boolean;
            /**
             * Default implementation assumes that drop down already exists,
             * but hasn't loaded it's data (ex: ContentPane w/href).
             * App must override if the drop down is lazy-created.
             */
            loadDropDown(callback: () => void): void;
            /**
             * Overridden so that focus is handled by the _HasDropDown mixin, not by
             * the _FormWidget mixin.
             */
            isFocusable(): boolean;
        }
        interface DropDownButtonConstructor extends _WidgetBaseConstructor<DropDownButton<any>> {
            new <T extends _WidgetBase>(params: Object, srcNodeRef: Node | string): DropDownButton<T>;
        }
        interface FilteringSelect<C extends Constraints, T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions> extends MappedTextBox<C>, ComboBoxMixin<T, Q, O> {
            /**
             * True (default) if user is required to enter a value into this field.
             */
            required: boolean;
            _lastDisplayedValue: string;
            _isValidSubset(): boolean;
            isValid(): boolean;
            _refreshState(): void;
            /**
             * Callback from dojo.store after lookup of user entered value finishes
             */
            _callbackSetLabel(result: T[], query: Q, options: O, priorityChange?: boolean): void;
            _openResultList(results: T[], query: Q, options: O): void;
            undo(): void;
            set(name: 'displayedValue', value: string): this;
            set(name: 'item', value: T): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface FilteringSelectConstructor extends _WidgetBaseConstructor<FilteringSelect<any, any, any, any>> {
            new <C extends Constraints, T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions>(params: Object, srcNodeRef: Node | string): FilteringSelect<C, T, Q, O>;
        }
        interface Form extends _Widget, _TemplatedMixin, _FormMixin, layout._ContentPaneResizeMixin {
            name?: string;
            action?: string;
            method?: string;
            encType?: string;
            'accept-charset'?: string;
            accept?: string;
            target?: string;
            templateString: string;
            /**
             * Deprecated: use submit()
             */
            execute(formContents: Object): void;
            /**
             * Deprecated: use onSubmit()
             */
            onExecute(): void;
            /**
             * restores all widget values back to their init values,
             * calls onReset() which can cancel the reset by returning false
             */
            reset(e?: Event): void;
            /**
             * Callback when user resets the form. This method is intended
             * to be over-ridden. When the `reset` method is called
             * programmatically, the return value from `onReset` is used
             * to compute whether or not resetting should proceed
             */
            onReset(e?: Event): boolean;
            /**
             * Callback when user submits the form.
             */
            onSubmit(e?: Event): boolean;
            /**
             * programmatically submit form if and only if the `onSubmit` returns true
             */
            submit(): void;
        }
        interface FormConstructor extends _WidgetBaseConstructor<Form> {
        }
        /**
         * Hash marks for `dijit/form/HorizontalSlider`
         */
        interface HorizontalRule extends _Widget, _TemplatedMixin {
            /**
             * Number of hash marks to generate
             */
            count: number;
            /**
             * For HorizontalSlider, this is either "topDecoration" or "bottomDecoration", and indicates whether this rule goes above or below the slider.
             */
            container: string;
            /**
             * CSS style to apply to individual hash marks
             */
            ruleStyle: string;
            _positionPrefix: string;
            _positionSuffix: string;
            _suffix: string;
            _genHTML(pos: number): string;
            /**
             * VerticalRule will override this...
             */
            _isHorizontal: boolean;
        }
        interface HorizontalRuleConstructor extends _WidgetBaseConstructor<HorizontalRule> {
        }
        /**
         * Labels for `dijit/form/HorizontalSlider`
         */
        interface HorizontalRuleLabels extends HorizontalRule {
            /**
             * CSS style to apply to individual text labels
             */
            labelStyle: string;
            /**
             * Array of text labels to render - evenly spaced from left-to-right or bottom-to-top.
             * Alternately, minimum and maximum can be specified, to get numeric labels.
             */
            labels: string[];
            /**
             * Number of generated numeric labels that should be rendered as '' on the ends when labels[] are not specified
             */
            numericMargin: number;
            /**
             * Leftmost label value for generated numeric labels when labels[] are not specified
             */
            minimum: number;
            /**
             * Rightmost label value for generated numeric labels when labels[] are not specified
             */
            maximum: number;
            /**
             * pattern, places, lang, et al (see dojo.number) for generated numeric labels when labels[] are not specified
             */
            constraints: {
                pattern: string;
            };
            /**
             * Returns the value to be used in HTML for the label as part of the left: attribute
             */
            _calcPosition(pos: number): number;
            _genHTML(pos: number, ndx?: number): string;
            /**
             * extension point for bidi code
             */
            _genDirectionHTML(label: string): string;
            /**
             * Overridable function to return array of labels to use for this slider.
             * Can specify a getLabels() method instead of a labels[] array, or min/max attributes.
             */
            getLabels(): string[];
        }
        interface HorizontalRuleLabelsConstructor extends _WidgetBaseConstructor<HorizontalRuleLabels> {
        }
        interface _SliderMover extends DojoJS.dnd.Mover {
        }
        /**
         * A form widget that allows one to select a value with a horizontally draggable handle
         */
        interface HorizontalSlider extends _FormValueWidget, _Container {
            /**
             * Show increment/decrement buttons at the ends of the slider?
             */
            showButtons: boolean;
            /**
             * The minimum value the slider can be set to.
             */
            minimum: number;
            /**
             * The maximum value the slider can be set to.
             */
            maximum: number;
            /**
             * If specified, indicates that the slider handle has only 'discreteValues' possible positions, and that after dragging the handle, it will snap to the nearest possible position.
             * Thus, the slider has only 'discreteValues' possible values.
             *
             * For example, if minimum=10, maxiumum=30, and discreteValues=3, then the slider handle has three possible positions, representing values 10, 20, or 30.
             *
             * If discreteValues is not specified or if it's value is higher than the number of pixels in the slider bar, then the slider handle can be moved freely, and the slider's value will be computed/reported based on pixel position (in this case it will likely be fractional, such as 123.456789).
             */
            discreteValues: number;
            /**
             * If discreteValues is also specified, this indicates the amount of clicks (ie, snap positions) that the slider handle is moved via pageup/pagedown keys.
             * If discreteValues is not specified, it indicates the number of pixels.
             */
            pageIncrement: number;
            /**
             * If clicking the slider bar changes the value or not
             */
            clickSelect: boolean;
            /**
             * The time in ms to take to animate the slider handle from 0% to 100%, when clicking the slider bar to make the handle move.
             */
            slideDuration: number;
            _mousePixelCoord: string;
            _pixelCount: string;
            _startingPixelCoord: string;
            _handleOffsetCoord: string;
            _progressPixelSize: string;
            _onKeyUp(e: Event): void;
            _onKeyDown(e: Event): void;
            _onHandleClick(e: Event): void;
            /**
             * Returns true if direction is from right to left
             */
            _isReversed(): boolean;
            _onBarClick(e: Event): void;
            _setPixelValue(pixelValue: number, maxPixels: number, priorityChange?: boolean): void;
            _setValueAttr(value: number, priorityChange?: boolean): void;
            _bumpValue(signedChange: number, priorityChange: boolean): void;
            _onClkBumper(val: any): void;
            _onClkIncBumper(): void;
            _onClkDecBumper(): void;
            decrement(e: Event): void;
            increment(e: Event): void;
            _mouseWheeled(evt: Event): void;
            _typematicCallback(count: number, button: Element, e: Event): void;
        }
        interface HorizontalSliderConstructor extends _WidgetBaseConstructor<HorizontalSlider> {
            /**
             * for monkey patching
             */
            _Mover: _SliderMover;
        }
        interface MappedTextBox<C extends Constraints> extends ValidationTextBox<C> {
            postMixInProperties(): void;
            serialize: SerializationFunction;
            toString(): string;
            validate(isFocused?: boolean): boolean;
            buildRendering(): void;
            reset(): void;
        }
        interface MappedTextBoxConstructor extends _WidgetBaseConstructor<MappedTextBox<Constraints>> {
            new <C extends Constraints>(params: Object, srcNodeRef: Node | string): MappedTextBox<C>;
        }
        interface NumberSpinner extends _Spinner, NumberTextBoxMixin {
            constraints: NumberTextBoxConstraints;
            baseClass: string;
            adjust(val: any, delta: number): any;
            pattern: ConstraintsToRegExpString<NumberTextBoxConstraints>;
            parse(value: string, constraints: NumberTextBoxConstraints): string;
            format(value: number, constraints: NumberTextBoxConstraints): string;
            filter(value: number): number;
            value: number;
        }
        interface NumberSpinnerConstructor extends _WidgetBaseConstructor<NumberSpinner> {
        }
        interface NumberTextBoxConstraints extends RangeBoundTextBoxConstraints, NumberFormatOptions, NumberParseOptions {
        }
        interface NumberTextBoxMixin {
            pattern: ConstraintsToRegExpString<NumberTextBoxConstraints>;
            constraints: NumberTextBoxConstraints;
            value: number;
            editOptions: {
                pattern: string;
            };
            _formatter: (value: number, options?: NumberFormatOptions) => string;
            _regExpGenerator: (options?: NumberRegexpOptions) => string;
            _decimalInfo: (constraints: Constraints) => {
                sep: string;
                places: number;
            };
            postMixInProperties(): void;
            format(value: number, constraints: NumberTextBoxConstraints): string;
            _parser: (expression: string, options?: NumberParseOptions) => number;
            parse(value: string, constraints: NumberParseOptions): string;
            filter(value: number): number;
            serialize: SerializationFunction;
            isValid(isFocused?: boolean): boolean;
        }
        interface NumberTextBoxMixinConstructor extends _WidgetBaseConstructor<NumberTextBoxMixin> {
        }
        interface NumberTextBox extends RangeBoundTextBox, NumberTextBoxMixin {
            constraints: NumberTextBoxConstraints;
            pattern: ConstraintsToRegExpString<NumberTextBoxConstraints>;
            parse(value: string, constraints: NumberParseOptions): string;
            format(value: number, constraints: NumberFormatOptions): string;
            value: number;
            filter(value: number): number;
        }
        interface NumberTextBoxConstructor extends _WidgetBaseConstructor<NumberTextBox> {
            Mixin: NumberTextBoxMixinConstructor;
        }
        interface RadioButton extends CheckBox, _RadioButtonMixin {
            baseClass: string;
        }
        interface RadioButtonConstructor extends _WidgetBaseConstructor<RadioButton> {
        }
        interface RangeBoundTextBoxConstraints extends Constraints {
            min?: number;
            max?: number;
        }
        interface RangeBoundTextBox extends MappedTextBox<RangeBoundTextBoxConstraints> {
            /**
             * The message to display if value is out-of-range
             */
            rangeMessage: string;
            /**
             * Overridable function used to validate the range of the numeric input value.
             */
            rangeCheck(primative: number, constraints: RangeBoundTextBoxConstraints): boolean;
            /**
             * Tests if the value is in the min/max range specified in constraints
             */
            isInRange(isFocused: boolean): boolean;
            /**
             * Returns true if the value is out of range and will remain
             * out of range even if the user types more characters
             */
            _isDefinitelyOutOfRange(): boolean;
            isValid(isFocused?: boolean): boolean;
            getErrorMessage(isFocused: boolean): string;
            postMixInProperties(): void;
        }
        interface RangeBoundTextBoxConstructor extends _WidgetBaseConstructor<RangeBoundTextBox> {
        }
        interface Select<T extends Object, Q extends string | Object | Function, O extends DojoJS.QueryOptions, U extends DijitJS._WidgetBase> extends _FormSelectWidget<T, Q, O>, _HasDropDown<U>, _KeyNavMixin {
            baseClass: string;
            /**
             * What to display in an "empty" drop down.
             */
            emptyLabel: string;
            /**
             * Specifies how to interpret the labelAttr in the data store items.
             */
            labelType: string;
            /**
             * Currently displayed error/prompt message
             */
            message: string;
            /**
             * Can be true or false, default is false.
             */
            required: boolean;
            /**
             * "Incomplete" if this select is required but unset (i.e. blank value), "" otherwise
             */
            state: string;
            /**
             * Order fields are traversed when user hits the tab key
             */
            tabIndex: any;
            templateString: any;
            /**
             * See the description of dijit/Tooltip.defaultPosition for details on this parameter.
             */
            tooltipPosition: any;
            childSelector(node: Element | Node): boolean;
            destroy(preserveDom: boolean): void;
            focus(): void;
            /**
             * Sets the value to the given option, used during search by letter.
             * @param widget Reference to option's widget
             */
            focusChild(widget: DijitJS._WidgetBase): void;
            isLoaded(): boolean;
            /**
             * Whether or not this is a valid value.
             * @param isFocused
             */
            isValid(isFocused: boolean): boolean;
            /**
             * populates the menu
             * @param loadCallback
             */
            loadDropDown(loadCallback: () => any): void;
            postCreate(): void;
            /**
             * set the missing message
             */
            postMixInProperties(): void;
            /**
             * Overridden so that the state will be cleared.
             */
            reset(): void;
            startup(): void;
            /**
             * Called by oninit, onblur, and onkeypress, and whenever required/disabled state changes
             * @param isFocused
             */
            validate(isFocused: boolean): boolean;
            /**
             * When a key is pressed that matches a child item,
             * this method is called so that a widget can take
             * appropriate action is necessary.
             * @param item
             * @param evt
             * @param searchString
             * @param numMatches
             */
            onKeyboardSearch(item: DijitJS._WidgetBase, evt: Event, searchString: string, numMatches: number): void;
        }
        interface SelectConstructor extends _WidgetBaseConstructor<Select<any, any, any, any>> {
        }
        interface SimpleTextarea extends TextBox {
            baseClass: string;
            rows: string;
            cols: string;
            templateString: string;
            postMixInProperties(): void;
            buildRendering(): void;
            filter(value: string): string;
        }
        interface SimpleTextareaConstructor extends _WidgetBaseConstructor<SimpleTextarea> {
            new (params: Object, srcNodeRef: Node | string): SimpleTextarea;
        }
        interface Textarea extends SimpleTextarea, _ExpandingTextAreaMixin {
            baseClass: string;
            cols: string;
            buildRendering(): void;
        }
        interface TextareaConstructor extends _WidgetBaseConstructor<Textarea> {
        }
        interface TextBox extends _FormValueWidget, _TextBoxMixin<Constraints> {
            set(name: 'displayedValue', value: string): this;
            set(name: 'disabled', value: boolean): this;
            set(name: 'value', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
            get(name: 'displayedValue'): string;
            get(name: 'value'): string;
            get(name: string): any;
        }
        interface TextBoxConstructor extends _WidgetBaseConstructor<TextBox> {
        }
        interface ToggleButton extends Button, _ToggleButtonMixin {
            baseClass: string;
            setChecked(checked: boolean): void;
            set(name: 'checked', value: boolean): this;
            set(name: string, value: any): this;
            set(values: Object): this;
        }
        interface ToggleButtonConstructor extends _WidgetBaseConstructor<ToggleButton> {
        }
        interface IsValidFunction {
            (isFocused?: boolean): boolean;
        }
        interface ValidationTextBox<C extends Constraints> extends TextBox {
            templateString: string;
            required: boolean;
            promptMessage: string;
            invalidMessage: string;
            missingMessage: string;
            message: string;
            constraints: C;
            pattern: string | ConstraintsToRegExpString<C>;
            regExp: string;
            regExpGen(constraints: C): void;
            state: string;
            tooltipPosition: string[];
            validator: ConstrainedValidFunction<C>;
            isValid: IsValidFunction;
            getErrorMessage(isFocused: boolean): string;
            getPromptMessage(isFocused: boolean): string;
            validate(isFocused: boolean): boolean;
            displayMessage(message: string): void;
            startup(): void;
            postMixInProperties(): void;
            reset(): void;
            destroy(preserveDom?: boolean): void;
            set(name: 'constraints', value: Constraints): this;
            set(name: 'disabled', value: boolean): this;
            set(name: 'message', value: string): this;
            set(name: 'pattern', value: string | ConstraintsToRegExpString<C>): this;
            set(name: 'regExp', value: string): this;
            set(name: 'regExpGen', value: Constraints): this;
            set(name: 'required', value: boolean): this;
            set(name: 'value', value: string): this;
            set(name: string, value: any): this;
            set(values: Object): this;
            get(name: 'pattern'): string | ConstraintsToRegExpString<C>;
            get(name: string): any;
        }
        interface ValidationTextBoxConstructor extends _WidgetBaseConstructor<ValidationTextBox<Constraints>> {
            new <C extends Constraints>(params: Object, srcNodeRef: Node | string): ValidationTextBox<C>;
        }
    }
    type Bookmark = {
        isCollapsed: boolean;
        mark?: Range;
    };
    type FocusNode = Element | null;
    type RemoveHandle = {
        remove(): void;
    };
    /**
     * Deprecated module to monitor currently focused node and stack of currently focused widgets.
     *
     * New code should access dijit/focus directly.
     */
    interface Focus {
        /**
         * Currently focused item on screen
         */
        _curFocus: FocusNode;
        /**
         * Previously focused item on screen
         */
        _prevFocus: FocusNode;
        /**
         * Returns true if there is no text selected
         */
        isCollapsed(): boolean;
        /**
         * Retrieves a bookmark that can be used with moveToBookmark to return to the same range
         */
        getBookmark(): Bookmark;
        /**
         * Moves current selection to a bookmark
         */
        moveToBookmark(bookmark: Bookmark): void;
        /**
         * Called as getFocus(), this returns an Object showing the current focus and selected text.
         *
         * Called as getFocus(widget), where widget is a (widget representing) a button that was just pressed, it returns where focus was before that button was pressed.   (Pressing the button may have either shifted focus to the button, or removed focus altogether.)   In this case the selected text is not returned, since it can't be accurately determined.
         */
        getFocus(menu: DijitJS._WidgetBase, openedForWindow?: Window): {
            node: FocusNode;
            bookmark: any;
            openedForWindow?: Window;
        };
        /**
         * List of currently active widgets (focused widget and it's ancestors)
         */
        _activeStack: DijitJS._WidgetBase[];
        /**
         * Registers listeners on the specified iframe so that any click or focus event on that iframe (or anything in it) is reported as a focus/click event on the `<iframe>` itself.
         *
         * Currently only used by editor.
         */
        registerIframe(iframe: HTMLIFrameElement): RemoveHandle;
        /**
         * Unregisters listeners on the specified iframe created by registerIframe.
         * After calling be sure to delete or null out the handle itself.
         */
        unregisterIframe(handle?: RemoveHandle): void;
        /**
         * Registers listeners on the specified window (either the main window or an iframe's window) to detect when the user has clicked somewhere or focused somewhere.
         *
         * Users should call registerIframe() instead of this method.
         */
        registerWin(targetWindow: Window, effectiveNode: Element): RemoveHandle;
        /**
         * Unregisters listeners on the specified window (either the main window or an iframe's window) according to handle returned from registerWin().
         * After calling be sure to delete or null out the handle itself.
         */
        unregisterWin(handle?: RemoveHandle): void;
    }
    /**
     * Deprecated.  Shim to methods on registry, plus a few other declarations.
     *
     * New code should access dijit/registry directly when possible.
     */
    interface Manager {
        byId(id: string | _WidgetBase): _WidgetBase;
        getUniqueId(widgetType: string): string;
        findWidgets(root: Node, skipNode?: Node): _WidgetBase[];
        byNode(node: Node): _WidgetBase;
        getEnclosingWidgets(node: Node): _WidgetBase;
        defaultDuration: number;
    }
    type placeOnScreenAround = (node: Element, aroundNode: Element, aroundCorners: Object | any[], layoutNode?: DijitJS.LayoutNodeFunction) => void;
    /**
     * Deprecated back compatibility module, new code should use dijit/place directly instead of using this module.
     */
    interface Place {
        /**
         * Deprecated method to return the dimensions and scroll position of the viewable area of a browser window.
         *
         * New code should use windowUtils.getBox()
         */
        getViewport(): {
            l?: number;
            t?: number;
            w?: number;
            h?: number;
        };
        placeOnScreen(node: Element, pos?: DijitJS.PlacePosition, corners?: DijitJS.PlaceCorner[], padding?: DijitJS.PlacePosition, layoutNode?: DijitJS.LayoutNodeFunction): PlaceLocation;
        /**
         * Like dijit.placeOnScreenAroundNode(), except it accepts an arbitrary object for the "around" argument and finds a proper processor to place a node.
         *
         * Deprecated, new code should use dijit/place.around() instead.
         */
        placeOnScreenAroundElement: placeOnScreenAround;
        /**
         * Position node adjacent or kitty-corner to aroundNode such that it's fully visible in viewport.
         *
         * Deprecated, new code should use dijit/place.around() instead.
         */
        placeOnScreenAroundNode: placeOnScreenAround;
        /**
         * Like dijit.placeOnScreenAroundNode(), except that the "around" parameter is an arbitrary rectangle on the screen (x, y, width, height) instead of a dom node.
         *
         * Deprecated, new code should use dijit/place.around() instead.
         */
        placeOnScreenAroundRectangle: placeOnScreenAround;
        /**
         * Deprecated method, unneeded when using dijit/place directly.
         *
         * Transforms the passed array of preferred positions into a format suitable for passing as the aroundCorners argument to dijit/place.placeOnScreenAroundElement.
         */
        getPopupAroundAlignment(position: string[], leftToRight?: boolean): {
            [s: string]: DijitJS.PlaceCorner;
        };
    }
    /**
     * Deprecated.   Old module for popups, new code should use dijit/popup directly.
     */
    interface Popup extends DijitJS.PopupManager {
    }
    /**
     * Back compatibility module, new code should use windowUtils directly instead of using this module.
     */
    interface Scroll {
    }
    /**
     * Deprecated, back compatibility module, new code should require dojo/uacss directly instead of this module.
     */
    interface Sniff {
    }
    /**
     * Deprecated, for back-compat, just loads top level module
     */
    interface Typematic {
        addKeyListener: Function;
        addListener: Function;
        addMouseListener: Function;
        stop: Function;
        trigger: Function;
        _fireEventAndReload: Function;
    }
    /**
     * Deprecated methods for setting/getting wai roles and states.
     * New code should call setAttribute()/getAttribute() directly.
     *
     * Also loads hccss to apply dj_a11y class to root node if machine is in high-contrast mode.
     */
    interface Wai {
        /**
         * Determines if an element has a particular role.
         */
        hasWaiRole(elem: Element, role: string): boolean;
        /**
         * Gets the role for an element (which should be a wai role).
         */
        getWaiRole(elem: Element): string;
        /**
         * Sets the role on an element.
         */
        setWaiRole(elem: Element, role: string): void;
        /**
         * Removes the specified role from an element.
         * Removes role attribute if no specific role provided (for backwards compat.)
         */
        removeWaiRole(elem: Element, role: string): void;
        /**
         * Determines if an element has a given state.
         *
         * Checks for an attribute called "aria-"+state.
         */
        hasWaiState(elem: Element, state: string): boolean;
        /**
         * Gets the value of a state on an element.
         *
         * Checks for an attribute called "aria-"+state.
         */
        getWaiState(elem: Element, state: string): string;
        /**
         * Sets a state on an element.
         *
         * Sets an attribute called "aria-"+state.
         */
        setWaiState(elem: Element, state: string, value: string): void;
        /**
         * Removes a state from an element.
         *
         * Sets an attribute called "aria-"+state.
         */
        removeWaiState(elem: Element, state: string): void;
    }
    /**
     * Back compatibility module, new code should use windowUtils directly instead of using this module.
     */
    interface Window {
        getDocumentWindow: Function;
    }
}
//# sourceMappingURL=dojo.d.ts.map