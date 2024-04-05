/// <reference path="dojo/dijit/index.d.ts" />
/// <reference path="dojo/doh/index.d.ts" />
/// <reference path="dojo/dojo/index.d.ts" />
/// <reference path="dojo/dojox/index.d.ts" />

/// <reference path="bga/components/chatinput.d.ts" />
/// <reference path="bga/components/counter.d.ts" />
/// <reference path="bga/components/draggable.d.ts" />
/// <reference path="bga/components/core.core.d.ts" />
/// <reference path="bga/components/core.gamegui.d.ts" />
/// <reference path="bga/components/core.sitecore.d.ts" />
/// <reference path="bga/components/gamenotif.d.ts" />
/// <reference path="bga/components/pageheader.d.ts" />
/// <reference path="bga/components/paymentbuttons.d.ts" />
/// <reference path="bga/components/popindialog.d.ts" />
/// <reference path="bga/components/resizable.d.ts" />
/// <reference path="bga/components/scrollmap.d.ts" />
/// <reference path="bga/components/stock.d.ts" />
/// <reference path="bga/components/tableresults.d.ts" />
/// <reference path="bga/components/thumb.d.ts" />
/// <reference path="bga/components/webpush.d.ts" />
/// <reference path="bga/components/webrtc.d.ts" />
/// <reference path="bga/components/zone.d.ts" />

/// <reference path="bga/components/core.sitecore.d.ts" />

/// <reference path="bga/notifications.d.ts" />
/// <reference path="bga/utilitytypes.d.ts" />
/// <reference path="bga/gamestate.d.ts" />
/// <reference path="bga/framework.d.ts" />
/// <reference path="bga/globals.d.ts" />
/// <reference path="bga/dependencies.d.ts" />
/// <reference path="bga/ebg.d.ts" />

type BGA_DIJI_IMPORTS = dijit.Dijit & { BackgroundIframe: new () => { pop: Function, push: Function, resize: Function, destroy: () => void }, Destroyable: dijit.DestroyableConstructor, Dialog: dijit.DialogConstructor, DialogUnderlay: new () => any, DropDownMenu: dijit.DropDownMenuConstructor, MenuItem: dijit.MenuBarItemConstructor, MenuSeparator: dijit.MenuSeparatorConstructor, Tooltip: dijit.TooltipConstructor, TooltipDialog: dijit.TooltipDialogConstructor, WigitSet: new () => any } & dijit.Registry & { _isElementShown: Function, hasDefaultTabStop: Function, effectiveTabIndex: Function, isTabNavigable: Function, isFocusable: Function, _getTabNavigable: Function, getFirstInTabbingOrder: Function, getLastInTabbingOrder: Function } & dijit._base.Focus & dijit._base.Window & dijit._base.Place & dijit._base.Wai & { showTooltip: Function, hideTooltip: Function } & { layout: { ContentPane: dijit.layout.ContentPaneConstructor, utils: { layoutChildren: Function, marginBox2contentBox: Function } } } & { popup: dijit.PopupManager } & { registry: any } & { scrollIntoView: Function, selectInputText: Function } & { typematic: dijit._base.Typematic } & { _AttachMixin: dijit._AttachMixinConstructor, _Contained: dijit._ContainedConstructor, _Containter: dijit._ContainerConstructor, _CssStateMixin: dijit._CssStateMixinConstructor, _DialogBase: dijit._DialogBaseConstructor, _DialogMixin: dijit._DialogMixin, _FocusMixin: dijit._FocusMixin, _HasDropDown: dijit._HasDropDown<dijit._WidgetBase>, _KeyNavContainer: dijit._KeyNavContainerConstructor, _KeyNavMixin: dijit._KeyNavMixinConstructor, _TemplatedMixin: dijit._TemplatedMixinConstructor, _WidgetsInTemplateMixin: dijit._WidgetsInTemplateMixinConstructor, _MasterTooltip: new () => any }

type BGA_DOJO_IMPORTS = Omit<dojo._base.Dojo, 'digit'> & dojo._base.Lang & dojo._base.Array & { ready: dojo.Ready } & { declare: dojo._base.Declare, safeMixin: dojo._base.Declare["safeMixin"] } & dojo._base.Connect & dojo.Topic & { mouseButtons: dojo.Mouse } & { keys: dojo.Keys } & { Deferred: dojo._base.DeferredConstructor } & { fromJson: (js: string) => any, toJsonIndentStr: string, toJson: (obj: any, prettyPrint?: boolean) => string } & { Color: dojo._base.ColorConstructor, blendColors: dojo._base.ColorConstructor["blendColors"], colorFromRgb: dojo._base.ColorConstructor["fromRgb"], colorFromHex: dojo._base.ColorConstructor["fromHex"], colorFromArray: dojo._base.ColorConstructor["fromArray"], colorFromString: dojo._base.ColorConstructor["fromString"] } & dojo._base.Unload & dojo.DomConstruct & { NodeList: dojo.NodeListConstructor } & Omit<dojo._base.Xhr, 'get' | 'post' | 'put' | 'del'> & { _blockAsync: boolean, _contentHandlers: dojo._base.Xhr['contentHandlers'], xhrDelete: dojo._base.Xhr["del"], xhrGet: dojo._base.Xhr["get"], xhrPost: dojo._base.Xhr["post"], xhrPut: dojo._base.Xhr["put"], rawXhrPost: dojo._base.Xhr["post"], rawXhrPut: dojo._base.Xhr["put"], xhr: dojo._base.Xhr } & dojo.IoQuery & { RequestTimeoutError: dojo.errors.RequestTimeoutErrorConstructor } & dojo._base.Fx & dojo._base.Loader & { _Animation: dojo._base.AnimationConstructor } & { _Url: dojo._base.UrlConstructor } & {_name: "browser", _postLoad: boolean, _scopeName: "dojo" } & dojo._base.Window & { date: dojo.date.DateBase } & { provide: (moduleName: string) => any, registerModulePath: (path: string, obj: any) => void, platformRequire: (e: any) => void, requireIf: (condition: boolean, mid: string, require: any) => void, requireAfterIf: (condition: boolean, mid: string, require: any) => void, requireLocalization: (moduleName: string, bundleName: string, locale?: string) => any } & { fixEvent: dojo._base.EventModule["fix"], stopEvent: dojo._base.EventModule["stop"] } & { hash : dojo.Hash } & { parser: dojo.Parser } & { query: dojo.Query } & { regexp: dojo.RegExpModule } & { store: { Memory: dojo.store.MemoryConstructor, util: { QueryResults: dojo.store.util.QueryResultsFunction } } } & { string: dojo.String } & { when: dojo.When } & { dnd: { Moveable: dojo.dnd.MoveableConstructor, Mover: dojo.dnd.MoverConstructor, TimedMoveable: dojo.dnd.TimedMoveableConstructor, autoScroll: dojo.dnd.AutoScroll } & dojo.dnd.Common } & { i18n: dojo.I18n, getL10nName: dojo.I18n["getL10nName"] } & { touch: dojo.Touch } & { window: dojo.WindowModule } & { Stateful: dojo.StatefulConstructor } & { dijit: BGA_DIJI_IMPORTS};

declare const dojo: BGA_DOJO_IMPORTS;
declare const dijit: BGA_DIJI_IMPORTS;

declare module "dojo" {
	export = dojo;
}

declare module "dijit/main" {
	export = dijit;
}