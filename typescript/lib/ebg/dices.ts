import dojo = require("dojo");
import declare = require("dojo/_base/declare");

class Dices_Template
{
	div_id: string | null = null;
	div: HTMLElement | null = null;
	dice_nbr: number = 2;
	dice_type: number = 6;

	create(t: string, i: number, n: number) {
		this.div_id = t;
		this.div = $(t)!;
		if (this.div === null) {
			console.error("dices::create: " + this.div_id + " associated div is null");
		}
		this.dice_nbr = i;
		this.dice_type = n;
		var o = "dice" + this.dice_nbr + "d" + this.dice_type;
		dojo.addClass(this.div, o);
		for (var a = 0; a < this.dice_nbr; a++)
			dojo.place(
				"<div class='dice_inner_wrap'><div id='" +
					this.div_id +
					"_" +
					a +
					"' class='" +
					o +
					"_inner'></div></div>",
				this.div
			);
	}

	setValue(t: Record<string, number>) {
		var i = Number(dojo.position(this.div!).h);
		for (var n in t) {
			var o = t[n]!,
				a =
					(o * this.dice_nbr +
						parseInt(n) -
						(this.dice_nbr - 1)) *
					i;
			this.dice_nbr, parseInt(n);
			dojo.style(
				$(this.div_id + "_" + n)!,
				"backgroundPosition",
				"0px -" + a + "px"
			);
		}
	}
}

let Dices = declare("ebg.dices", Dices_Template);
export = Dices;

declare global {
	namespace BGA {
		type Dices = typeof Dices;
		interface EBG { dices: Dices; }
	}
	var ebg: BGA.EBG;
}