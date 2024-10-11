declare var a11y: {
    _isElementShown: (e: any) => boolean;
    hasDefaultTabStop: (e: any) => any;
    effectiveTabIndex: (e: any) => any;
    isTabNavigable: (e: any) => boolean;
    isFocusable: (e: any) => boolean;
    _getTabNavigable: (e: any) => {
        first: any;
        last: any;
        lowest: any;
        highest: any;
    };
    getFirstInTabbingOrder: (e: any, i: any) => any;
    getLastInTabbingOrder: (e: any, i: any) => any;
};
type A11y = typeof a11y;
declare global {
    namespace DojoJS {
        interface Dijit extends A11y {
        }
    }
}
export = a11y;
//# sourceMappingURL=a11y.d.ts.map