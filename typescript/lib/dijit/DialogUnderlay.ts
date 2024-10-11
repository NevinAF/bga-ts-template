// @ts-nocheck

import declare = require("dojo/_base/declare");
import t = require("dojo/_base/lang");
import i = require("dojo/aspect");
import n = require("dojo/dom-attr");
import o = require("dojo/dom-style");
import a = require("dojo/on");
import s = require("dojo/window");
import _Widget = require("./_Widget");
import _TemplatedMixin = require("./_TemplatedMixin");
import d = require("./BackgroundIframe");
import c = require("./Viewport");
import dijit = require("./main");

interface DialogUnderlay_Template extends DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin, []> {}

class DialogUnderlay_Template {
	node: HTMLElement;
	templateString: string = "<div class='dijitDialogUnderlayWrapper'><div class='dijitDialogUnderlay' tabIndex='-1' data-dojo-attach-point='node'></div></div>";
	dialogId: string = "";
	class: string = "";
	open?: boolean;
	_modalConnects: any[] = [];
	bgIframe?: typeof d;
	_setDialogIdAttr(e: string) {
		n.set(this.node, "id", e + "_underlay");
		this._set("dialogId", e);
	}
	_setClassAttr(e: string) {
		this.node.className = "dijitDialogUnderlay " + e;
		this._set("class", e);
	}
	postCreate() {
		this.ownerDocumentBody.appendChild(this.domNode);
		this.own(
			a(
				this.domNode,
				"keydown",
				t.hitch(this, "_onKeyDown")
			)
		);
		this.inherited(arguments);
	}
	layout() {
		var e = this.node.style,
			t = this.domNode.style;
		t.display = "none";
		var i = s.getBox(this.ownerDocument);
		t.top = i.t + "px";
		t.left = i.l + "px";
		e.width = i.w + "px";
		e.height = i.h + "px";
		t.display = "block";
	}
	show() {
		this.domNode.style.display = "block";
		this.open = true;
		this.layout();
		this.bgIframe = new d(this.domNode);
		var e = s.get(this.ownerDocument);
		this._modalConnects = [
			c.on("resize", t.hitch(this, "layout")),
			a(e, "scroll", t.hitch(this, "layout")),
		];
	}
	hide() {
		this.bgIframe.destroy();
		delete this.bgIframe;
		this.domNode.style.display = "none";
		for (; this._modalConnects.length; )
			this._modalConnects.pop().remove();
		this.open = false;
	}
	destroy() {
		for (; this._modalConnects.length; )
			this._modalConnects.pop().remove();
		this.inherited(arguments);
	}
	_onKeyDown() {}

	static _singleton: DialogUnderlay_Template;

	static show(e: any, t: any) {
		var i = DialogUnderlay_Template._singleton;
		!i || i._destroyed
			? (i = dijit._underlay = DialogUnderlay_Template._singleton = new DialogUnderlay_Template(e))
			: e && i.set(e);
		o.set(i.domNode, "zIndex", t);
		i.open || i.show();
	}

	static hide() {
		var e = DialogUnderlay_Template._singleton;
		e && !e._destroyed && e.hide();
	}
}

let DialogUnderlay = declare("dijit.DialogUnderlay", [ _Widget, _TemplatedMixin, DialogUnderlay_Template ]) as DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin & DialogUnderlay_Template, []>;
export = DialogUnderlay;

declare global {
	namespace DojoJS
	{
		interface Dijit {
			DialogUnderlay: typeof DialogUnderlay;
			_underlay: typeof DialogUnderlay_Template._singleton;
		}
	}
}

