import e = require("exports");
import t = require("require");
import i = require("../has");

var n: './xhr' | './node',
	o = i("config-requestProvider");
n = "./xhr";
o || (o = n);

export = {
	getPlatformDefaultId: function () {
		return n;
	},
	load: function (id: string, _: any, loaded: Function) {
		t(["platform" == id ? n : o], function (e) {
			loaded(e);
		});
	}
};