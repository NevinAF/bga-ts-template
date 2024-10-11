declare var back: DojoJS.Back;
declare global {
    namespace DojoJS {
        interface BackArgs {
            back?: (...args: any[]) => void;
            forward?: (...args: any[]) => void;
            changeUrl?: boolean | string;
        }
        interface Back {
            getHash(): string;
            setHash(h: string): void;
            /**
             * private method. Do not call this directly.
             */
            goBack(): void;
            /**
             * private method. Do not call this directly.
             */
            goForward(): void;
            /**
             * Initializes the undo stack. This must be called from a <script>
             * block that lives inside the `<body>` tag to prevent bugs on IE.
             * Only call this method before the page's DOM is finished loading. Otherwise
             * it will not work. Be careful with xdomain loading or djConfig.debugAtAllCosts scenarios,
             * in order for this method to work, dojo/back will need to be part of a build layer.
             */
            init(): void;
            /**
             * Sets the state object and back callback for the very first page
             * that is loaded.
             * It is recommended that you call this method as part of an event
             * listener that is registered via dojo/ready.
             */
            setInitialState(args: BackArgs): void;
            /**
             * adds a state object (args) to the history list.
             */
            addToHistory(args: BackArgs): void;
            /**
             * private method. Do not call this directly.
             */
            _iframeLoaded(evt: Event, ifrLoc: Location): void;
        }
    }
}
export = back;
//# sourceMappingURL=back.d.ts.map