import array = require("dojo/_base/array");
import config = require("dojo/_base/config");
import lang = require("dojo/_base/lang");
import registry = require("../registry");
import dijit = require("../main");

var manager = {
	"byId": registry.byId,
	"getUniqueId": registry.getUniqueId,
	"findWidgets": registry.findWidgets,
	// @ts-ignore
	"_destroyAll": registry._destroyAll,
	"byNode": registry.byNode,
	"getEnclosingWidget": registry.getEnclosingWidget,
	defaultDuration: config.defaultDuration || 200
};

type Manager = typeof manager;

declare global {
	namespace DojoJS
	{
		interface Dijit extends Manager {}
	}
}

lang.mixin(dijit, manager);
export = dijit;