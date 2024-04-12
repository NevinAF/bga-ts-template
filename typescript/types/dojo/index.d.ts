/// <reference path="dijit/modules.d.ts" />
/// <reference path="doh/modules.d.ts" />
/// <reference path="dojo/modules.d.ts" />
/// <reference path="dojox/modules.d.ts" />

/**
 * The types that are automatically loaded onto the globally available `dijit` object, including most of the dojo functions that are used in BGA games.
 * This has been pulled directly from the first loaded page of a game after a cache clear and the source code. The may possibly not represent the full set of types, and may define types that are conditionally loaded.
 * 
 * Partial: This has been partially typed based on a subset of the BGA source code. (some dojo properties/sub-properties have not been typed)
 */
type BGA_DIJIT_IMPORTS = dijit.Dijit & { BackgroundIframe: new () => { pop: (...args: any[]) => any, push: (...args: any[]) => any, resize: (...args: any[]) => any, destroy: () => void }, Destroyable: dijit.DestroyableConstructor, Dialog: dijit.DialogConstructor, DialogUnderlay: new () => any, DropDownMenu: dijit.DropDownMenuConstructor, MenuItem: dijit.MenuBarItemConstructor, MenuSeparator: dijit.MenuSeparatorConstructor, Tooltip: dijit.TooltipConstructor, TooltipDialog: dijit.TooltipDialogConstructor, WigitSet: new () => any } & dijit.Registry & { _isElementShown: (...args: any[]) => any, hasDefaultTabStop: (...args: any[]) => any, effectiveTabIndex: (...args: any[]) => any, isTabNavigable: (...args: any[]) => any, isFocusable: (...args: any[]) => any, _getTabNavigable: (...args: any[]) => any, getFirstInTabbingOrder: (...args: any[]) => any, getLastInTabbingOrder: (...args: any[]) => any } & dijit._base.Focus & dijit._base.Window & dijit._base.Place & dijit._base.Wai & { showTooltip: (...args: any[]) => any, hideTooltip: (...args: any[]) => any } & { layout: { ContentPane: dijit.layout.ContentPaneConstructor, utils: { layoutChildren: (...args: any[]) => any, marginBox2contentBox: (...args: any[]) => any } } } & { popup: dijit.PopupManager } & { registry: any } & { scrollIntoView: (...args: any[]) => any, selectInputText: (...args: any[]) => any } & { typematic: dijit._base.Typematic } & { _AttachMixin: dijit._AttachMixinConstructor, _Contained: dijit._ContainedConstructor, _Containter: dijit._ContainerConstructor, _CssStateMixin: dijit._CssStateMixinConstructor, _DialogBase: dijit._DialogBaseConstructor, _DialogMixin: dijit._DialogMixin, _FocusMixin: dijit._FocusMixin, _HasDropDown: dijit._HasDropDown<dijit._WidgetBase>, _KeyNavContainer: dijit._KeyNavContainerConstructor, _KeyNavMixin: dijit._KeyNavMixinConstructor, _TemplatedMixin: dijit._TemplatedMixinConstructor, _WidgetsInTemplateMixin: dijit._WidgetsInTemplateMixinConstructor, _MasterTooltip: new () => any }

type BGA_DOJOX_IMPORTS = dojox.DojoX & { string: { Buffer: new () => { length: number, append: (...args: any[]) => any, concat: (...args: any[]) => any, appendArray: (...args: any[]) => any, clear: (...args: any[]) => any, replace: (...args: any[]) => any, remove: (...args: any[]) => any, insert: (...args: any[]) => any, toString: () => string }}} & { _scopeName: "dojox" } & { uuid: { NIL_UUID: "00000000-0000-0000-0000-000000000000", version: { UNKNOWN: 0, TIME_BASED: 1, DCE_SECURITY: 2, NAME_BASED_MD5: 3, RANDOM: 4, NAME_BASED_SHA1: 5 }, variant: { NCS: "0", DCE: "10", MICROSOFT: "110", UNKNOWN: "111" }, assert: (condition: boolean, error: any) => void, generateNilUuid: () => "00000000-0000-0000-0000-000000000000", isValid: (uuid: string) => boolean, getVariant: (uuid: string) => "0" | "10" | "110" | "111", getVersion: (uuid: string) => 0 | 1 | 2 | 3 | 4 | 5, getNode: (uuid: string) => string, getTimestamp: (uuid: string) => number }} & { data: { QueryReadStore: new () => any }} & { extend: BGA_DOJO_IMPORTS['safeMixin'], dtl: any };

/**
 * The types that are automatically loaded onto the globally available `dojo` object, including most of the dojo functions that are used in BGA games.
 * This has been pulled directly from the first loaded page of a game after a cache clear and the source code. The may possibly not represent the full set of types, and may define types that are conditionally loaded.
 * 
 * Partial: This has been partially typed based on a subset of the BGA source code. (some dojo properties/sub-properties have not been typed)
 */
type BGA_DOJO_IMPORTS = Omit<dojo._base.Dojo, 'digit' | 'dojox'> & dojo._base.Lang & dojo._base.Array & { ready: dojo.Ready } & { declare: dojo._base.Declare, safeMixin: dojo._base.Declare["safeMixin"] } & dojo._base.Connect & dojo.Topic & { mouseButtons: dojo.Mouse } & { keys: dojo.Keys } & { Deferred: dojo._base.DeferredConstructor } & { fromJson: (js: string) => any, toJsonIndentStr: string, toJson: (obj: any, prettyPrint?: boolean) => string } & { Color: dojo._base.ColorConstructor, blendColors: dojo._base.ColorConstructor["blendColors"], colorFromRgb: dojo._base.ColorConstructor["fromRgb"], colorFromHex: dojo._base.ColorConstructor["fromHex"], colorFromArray: dojo._base.ColorConstructor["fromArray"], colorFromString: dojo._base.ColorConstructor["fromString"] } & dojo._base.Unload & dojo.DomConstruct & { NodeList: dojo.NodeListConstructor } & Omit<dojo._base.Xhr, 'get' | 'post' | 'put' | 'del'> & { _blockAsync: boolean, _contentHandlers: dojo._base.Xhr['contentHandlers'], xhrDelete: dojo._base.Xhr["del"], xhrGet: dojo._base.Xhr["get"], xhrPost: dojo._base.Xhr["post"], xhrPut: dojo._base.Xhr["put"], rawXhrPost: dojo._base.Xhr["post"], rawXhrPut: dojo._base.Xhr["put"], xhr: dojo._base.Xhr } & dojo.IoQuery & { RequestTimeoutError: dojo.errors.RequestTimeoutErrorConstructor } & dojo._base.Fx & dojo._base.Loader & { _Animation: dojo._base.AnimationConstructor } & { _Url: dojo._base.UrlConstructor } & {_name: "browser", _postLoad: boolean, _scopeName: "dojo" } & dojo._base.Window & { date: dojo.date.DateBase } & { provide: (moduleName: string) => any, registerModulePath: (path: string, obj: any) => void, platformRequire: (e: any) => void, requireIf: (condition: boolean, mid: string, require: any) => void, requireAfterIf: (condition: boolean, mid: string, require: any) => void, requireLocalization: (moduleName: string, bundleName: string, locale?: string) => any } & { fixEvent: dojo._base.EventModule["fix"], stopEvent: dojo._base.EventModule["stop"] } & { hash : dojo.Hash } & { parser: dojo.Parser } & { query: dojo.Query } & { regexp: dojo.RegExpModule } & { store: { Memory: dojo.store.MemoryConstructor, util: { QueryResults: dojo.store.util.QueryResultsFunction } } } & { string: dojo.String } & { when: dojo.When } & { dnd: { Moveable: dojo.dnd.MoveableConstructor, Mover: dojo.dnd.MoverConstructor, TimedMoveable: dojo.dnd.TimedMoveableConstructor, autoScroll: dojo.dnd.AutoScroll } & dojo.dnd.Common } & { i18n: dojo.I18n, getL10nName: dojo.I18n["getL10nName"] } & { touch: dojo.Touch } & { window: dojo.WindowModule } & { Stateful: dojo.StatefulConstructor } & { dijit: BGA_DIJIT_IMPORTS, dojox: BGA_DOJOX_IMPORTS };

declare module "dojo" {
	global {
		const dojo: BGA_DOJO_IMPORTS;
	}
	export = dojo;
}

declare module "dijit/main" {
	global {
		const dijit: BGA_DIJIT_IMPORTS;
	}
	export = dijit;
}

declare module "dojox" {
	global {
		// @ts-ignore
		const dojox: BGA_DOJOX_IMPORTS;
	}
	export = dojox;
}