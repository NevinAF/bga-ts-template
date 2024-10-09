import create = require("./create");

class RequestError {
	response: any;

	constructor(message: string, t: any) {
		this.response = t;
	}
}

export = create("RequestError", RequestError);