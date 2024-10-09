import lang = require("../_base/lang");
import Promise = require("./Promise");
import Evented = require("../Evented");

var _tracer = new Evented();
var originalEmit = _tracer.emit;

// @ts-ignore
let tracer: { on(type: 'resolved' | 'rejected' | 'progress'): DojoJS.Handle; emit: null } = _tracer;
tracer.emit = null;

function timeoutEmit(e: any) {
	setTimeout(function () {
		originalEmit.apply(tracer, e);
	}, 0);
}

Promise.prototype.trace = function () {
	var t = lang._toArray(arguments);
	this.then(
		function (e) {
			timeoutEmit(["resolved", e].concat(t));
		},
		function (e) {
			timeoutEmit(["rejected", e].concat(t));
		},
		function (e) {
			timeoutEmit(["progress", e].concat(t));
		}
	);
	return this;
};

Promise.prototype.traceRejected = function () {
	var t = lang._toArray(arguments);
	this.otherwise(function (e) {
		timeoutEmit(["rejected", e].concat(t));
	});
	return this;
};

declare global {
	namespace DojoJS
	{
	}
}

export = tracer;