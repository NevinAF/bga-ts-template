interface DomReady {
    /**
     * Plugin to delay require()/define() callback from firing until the DOM has finished
     */
    (callback: (doc: Document) => any): void;
    load(id: string, parentRequire: Function, loaded: Function): void;
    _Q: Function[];
    _onEmpty(): void;
    _onQEmpty(): void;
}
declare var domReady: DomReady;
export = domReady;
//# sourceMappingURL=domReady.d.ts.map