
// @ts-nocheck

import e = require("dojo/_base/array");
import t = require("dojo/_base/declare");
import i = require("dojo/_base/fx");
import n = require("dojo/dom");
import o = require("dojo/dom-class");
import a = require("dojo/dom-geometry");
import s = require("dojo/dom-style");
import r = require("dojo/_base/lang");
import l = require("dojo/mouse");
import d = require("dojo/on");
import c = require("dojo/sniff");
import h = require("./_base/manager");
import u = require("./place");
import p = require("./_Widget");
import m = require("./_TemplatedMixin");
import g = require("./BackgroundIframe");
import f = require("dojo/text"); // import f = require("dojo/text!./templates/Tooltip.html");
import dijit = require("./main");

// TODO: This does not output with "DojoClass" when not forcibly typed.
var v: DojoJS.DojoClass<DijitJS._Widget & DijitJS._TemplatedMixin & {
	duration: number;
	templateString: {
		dynamic: boolean;
		normalize: (e: any, t: any) => string;
		load: (e: any, t: any, i: any) => void;
	};
	postCreate: () => void;
	show: (e: any, t: any, i: any, n: any, o: any, a: any, l: any) => void;
	orient: (e: any, t: any, i: any, n: any, o: any) => number;
	_onShow: () => void;
	hide: (e: any) => void;
	_onHide: () => void;
}, any[]> = t("dijit._MasterTooltip", [p, m], {
	duration: h.defaultDuration,
	templateString: f,
	postCreate: function () {
		this.ownerDocumentBody.appendChild(this.domNode);
		this.bgIframe = new g(this.domNode);
		this.fadeIn = i.fadeIn({
			node: this.domNode,
			duration: this.duration,
			onEnd: r.hitch(this, "_onShow"),
		});
		this.fadeOut = i.fadeOut({
			node: this.domNode,
			duration: this.duration,
			onEnd: r.hitch(this, "_onHide"),
		});
	},
	show: function (e, t, i, n, o, a, l) {
		if (
			!this.aroundNode ||
			this.aroundNode !== t ||
			this.containerNode.innerHTML != e
		)
			if ("playing" != this.fadeOut.status()) {
				this.containerNode.innerHTML = e;
				o && this.set("textDir", o);
				this.containerNode.align = n ? "right" : "left";
				var d = u.around(
						this.domNode,
						t,
						i && i.length ? i : x.defaultPosition,
						!n,
						r.hitch(this, "orient")
					),
					c = d.aroundNodePos;
				if (
					"M" == d.corner.charAt(0) &&
					"M" == d.aroundCorner.charAt(0)
				) {
					this.connectorNode.style.top =
						c.y +
						((c.h -
							this.connectorNode.offsetHeight) >>
							1) -
						d.y +
						"px";
					this.connectorNode.style.left = "";
				} else if (
					"M" == d.corner.charAt(1) &&
					"M" == d.aroundCorner.charAt(1)
				)
					this.connectorNode.style.left =
						c.x +
						((c.w -
							this.connectorNode.offsetWidth) >>
							1) -
						d.x +
						"px";
				else {
					this.connectorNode.style.left = "";
					this.connectorNode.style.top = "";
				}
				s.set(this.domNode, "opacity", 0);
				this.fadeIn.play();
				this.isShowingNow = true;
				this.aroundNode = t;
				this.onMouseEnter = a || k;
				this.onMouseLeave = l || k;
			} else this._onDeck = arguments;
	},
	orient: function (e, t, i, n, o) {
		this.connectorNode.style.top = "";
		var s = n.h,
			r = n.w;
		e.className =
			"dijitTooltip " +
			{
				"MR-ML": "dijitTooltipRight",
				"ML-MR": "dijitTooltipLeft",
				"TM-BM": "dijitTooltipAbove",
				"BM-TM": "dijitTooltipBelow",
				"BL-TL": "dijitTooltipBelow dijitTooltipABLeft",
				"TL-BL": "dijitTooltipAbove dijitTooltipABLeft",
				"BR-TR":
					"dijitTooltipBelow dijitTooltipABRight",
				"TR-BR":
					"dijitTooltipAbove dijitTooltipABRight",
				"BR-BL": "dijitTooltipRight",
				"BL-BR": "dijitTooltipLeft",
			}[t + "-" + i];
		this.domNode.style.width = "auto";
		var l = a.position(this.domNode);
		(c("ie") || c("trident")) && (l.w += 2);
		var d = Math.min(Math.max(r, 1), l.w);
		a.setMarginBox(this.domNode, { w: d });
		if ("B" == i.charAt(0) && "B" == t.charAt(0)) {
			var h = a.position(e),
				u = this.connectorNode.offsetHeight;
			if (h.h > s) {
				var p = s - ((o.h + u) >> 1);
				this.connectorNode.style.top = p + "px";
				this.connectorNode.style.bottom = "";
			} else {
				this.connectorNode.style.bottom =
					Math.min(
						Math.max(o.h / 2 - u / 2, 0),
						h.h - u
					) + "px";
				this.connectorNode.style.top = "";
			}
		} else {
			this.connectorNode.style.top = "";
			this.connectorNode.style.bottom = "";
		}
		return Math.max(0, l.w - r);
	},
	_onShow: function () {
		c("ie") && (this.domNode.style.filter = "");
	},
	hide: function (e) {
		if (this._onDeck && this._onDeck[1] == e)
			this._onDeck = null;
		else if (this.aroundNode === e) {
			this.fadeIn.stop();
			this.isShowingNow = false;
			this.aroundNode = null;
			this.fadeOut.play();
		}
		this.onMouseEnter = this.onMouseLeave = k;
	},
	_onHide: function () {
		this.domNode.style.cssText = "";
		this.containerNode.innerHTML = "";
		if (this._onDeck) {
			this.show.apply(this, this._onDeck);
			this._onDeck = null;
		}
	},
});
c("dojo-bidi") &&
	v.extend({
		_setAutoTextDir: function (t) {
			this.applyTextDir(t);
			e.forEach(
				t.children,
				function (e) {
					this._setAutoTextDir(e);
				},
				this
			);
		},
		_setTextDirAttr: function (e) {
			this._set("textDir", e);
			"auto" == e
				? this._setAutoTextDir(this.containerNode)
				: (this.containerNode.dir = this.textDir);
		},
	});
dijit.showTooltip = function (t, i, n, o, a, s, r) {
	n &&
		(n = e.map(n, function (e) {
			return (
				{
					after: "after-centered",
					before: "before-centered",
				}[e] || e
			);
		}));
	x._masterTT || (dijit._masterTT = x._masterTT = new v());
	return x._masterTT.show(t, i, n, o, a, s, r);
};
dijit.hideTooltip = function (e) {
	return x._masterTT && x._masterTT.hide(e);
};
var b = "DORMANT",
	y = "SHOW TIMER",
	w = "SHOWING",
	C = "HIDE TIMER";
function k() {}
var x = t("dijit.Tooltip", p, {
	label: "",
	showDelay: 400,
	hideDelay: 400,
	connectId: [],
	position: [],
	selector: "",
	_setConnectIdAttr: function (t) {
		e.forEach(
			this._connections || [],
			function (t) {
				e.forEach(t, function (e) {
					e.remove();
				});
			},
			this
		);
		this._connectIds = e.filter(
			r.isArrayLike(t) ? t : t ? [t] : [],
			function (e) {
				return n.byId(e, this.ownerDocument);
			},
			this
		);
		this._connections = e.map(
			this._connectIds,
			function (e) {
				var t = n.byId(e, this.ownerDocument),
					i = this.selector,
					o = i
						? function (e) {
								return d.selector(i, e);
							}
						: function (e) {
								return e;
							},
					a = this;
				return [
					d(t, o(l.enter), function () {
						a._onHover(this);
					}),
					d(t, o("focusin"), function () {
						a._onHover(this);
					}),
					d(t, o(l.leave), r.hitch(a, "_onUnHover")),
					d(
						t,
						o("focusout"),
						r.hitch(a, "set", "state", b)
					),
				];
			},
			this
		);
		this._set("connectId", t);
	},
	addTarget: function (t) {
		var i = t.id || t;
		-1 == e.indexOf(this._connectIds, i) &&
			this.set("connectId", this._connectIds.concat(i));
	},
	removeTarget: function (t) {
		var i = t.id || t,
			n = e.indexOf(this._connectIds, i);
		if (n >= 0) {
			this._connectIds.splice(n, 1);
			this.set("connectId", this._connectIds);
		}
	},
	buildRendering: function () {
		this.inherited(arguments);
		o.add(this.domNode, "dijitTooltipData");
	},
	startup: function () {
		this.inherited(arguments);
		var t = this.connectId;
		e.forEach(
			r.isArrayLike(t) ? t : [t],
			this.addTarget,
			this
		);
	},
	getContent: function (e) {
		return this.label || this.domNode.innerHTML;
	},
	state: b,
	_setStateAttr: function (e) {
		if (
			!(
				this.state == e ||
				(e == y && this.state == w) ||
				(e == C && this.state == b)
			)
		) {
			if (this._hideTimer) {
				this._hideTimer.remove();
				delete this._hideTimer;
			}
			if (this._showTimer) {
				this._showTimer.remove();
				delete this._showTimer;
			}
			switch (e) {
				case b:
					if (this._connectNode) {
						x.hide(this._connectNode);
						delete this._connectNode;
						this.onHide();
					}
					break;
				case y:
					this.state != w &&
						(this._showTimer = this.defer(
							function () {
								this.set("state", w);
							},
							this.showDelay
						));
					break;
				case w:
					var t = this.getContent(this._connectNode);
					if (!t) {
						this.set("state", b);
						return;
					}
					x.show(
						t,
						this._connectNode,
						this.position,
						!this.isLeftToRight(),
						this.textDir,
						r.hitch(this, "set", "state", w),
						r.hitch(this, "set", "state", C)
					);
					this.onShow(
						this._connectNode,
						this.position
					);
					break;
				case C:
					this._hideTimer = this.defer(function () {
						this.set("state", b);
					}, this.hideDelay);
			}
			this._set("state", e);
		}
	},
	_onHover: function (e) {
		this._connectNode &&
			e != this._connectNode &&
			this.set("state", b);
		this._connectNode = e;
		this.set("state", y);
	},
	_onUnHover: function (e) {
		this.set("state", C);
	},
	open: function (e) {
		this.set("state", b);
		this._connectNode = e;
		this.set("state", w);
	},
	close: function () {
		this.set("state", b);
	},
	onShow: function () {},
	onHide: function () {},
	destroy: function () {
		this.set("state", b);
		e.forEach(
			this._connections || [],
			function (t) {
				e.forEach(t, function (e) {
					e.remove();
				});
			},
			this
		);
		this.inherited(arguments);
	},
}) as DijitJS.TooltipConstructor;
x._MasterTooltip = v;
x.show = dijit.showTooltip;
x.hide = dijit.hideTooltip;
x.defaultPosition = ["after-centered", "before-centered"];

declare global {
	namespace DojoJS
	{
		interface Dijit {
			Tooltip: typeof x;
			_MasterTooltip: typeof v;

			showTooltip: (innerHTML: string, aroundNode: { x: number; y: number; w: number; h: number; }, position?: DijitJS.PlacePositions[], rtl?: boolean, textDir?: string, onMouseEnter?: Function, onMouseLeave?: Function) => void;
			hideTooltip: (aroundNode: { x: number; y: number; w: number; h: number; }) => void;
		}
	}
}

export = x;