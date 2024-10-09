var global_result = "undefined" != typeof global &&
	"function" != typeof global
	? global
	: "undefined" != typeof window
	? window
	: "undefined" != typeof self
	? self
	: this as unknown as (Window & typeof globalThis);

export = global_result;

declare global {
	namespace DojoJS {
		type Global = typeof global_result;
	}

	/**
	 * The global object used for dojo. If undefined, dojo will use try to use 'window', then 'self', then the global 'this'.
	 */
	var global: (Window & typeof globalThis) | undefined | Function;
}