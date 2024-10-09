import create = require("./create");
import RequestError = require("./RequestError");

export = create("RequestTimeoutError", null, RequestError, {
	dojoType: "timeout",
});