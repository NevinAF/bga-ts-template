/// <reference path="dojo/dijit/1.11/index.d.ts" />
/// <reference path="dojo/doh/1.11/index.d.ts" />
/// <reference path="dojo/dojo/1.11/index.d.ts" />
/// <reference path="dojo/dojox/1.11/index.d.ts" />

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

/**
 * The type of the global {@link dojo} object. This type is a subset of the actual `dojo` object. Any {@link https://dojotoolkit.org/: Dojo Toolkit} modules that are added as a dependency in the {@link define} function will need to be intersected into the DojoDependencies interface to enable typescript type checking and intellisense. `dojo._base.Connect`, `dojo.DomGeometry`, `dojo._base.Dojo`, and `dojo._base.Lang` are added by default.
 * 
 * Any dojo types can be added by expanding (not extending) this interface. If you don't know the namespace path for a specific module, you can do a project wide search for the module name and that will take you directly to all module definitions with that name.
 * @example
 * // Use the 'extends <module> [, <module>]..' format to include dojo modules into the dependencies type.
 * interface DojoDependencies extends dojo._base.Fx, dojo._base.EventModule {}
 */
interface DojoDependencies extends dojo._base.Connect, dojo.DomGeometry, dojo._base.Dojo, dojo._base.Lang {}

/**
 * The global `dojo` object included in all BGA pages. This object is already defined with a TON of properties and methods, even without including many of the dojo modules as a dependency in the {@link define} function. This object type is a subset of the actual `dojo` object, and should be expanded using {@link DojoDependencies} as needed based on what dojo modules are being used.
 * 
 * @see {@link https://dojotoolkit.org/: Dojo Toolkit}
 */
declare const dojo: DojoDependencies;