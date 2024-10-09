import lang = require("../_base/lang");

function create<E extends typeof Error = typeof Error, P extends object = {}>(name: string, ctor?: Constructor<any> | null, base?: E | null, props?: P | null): {
	new(...args: Parameters<E>): InstanceType<E> & P;
	prototype: InstanceType<E> & P;
} & E {
	base = (base || Error) as E;
	function result(this: any, ...args: Parameters<E>) {
		if (base === Error) {
			// @ts-ignore
			Error.captureStackTrace && Error.captureStackTrace(this, result);
			var _super = Error.call(this, args[0]);
			for (let key in _super)
				_super.hasOwnProperty(key) && (this[key] = (_super as Record<string, any>)[key]);
			this.message = args[0];
			this.stack = _super.stack;
		}
		else base!.apply(this, args);
		ctor && ctor.apply(this, args);
	};
	result.prototype = lang.delegate(base.prototype, props);
	result.prototype.name = name;
	result.prototype.constructor = result;
	// @ts-ignore
	return result;
}

export = create;