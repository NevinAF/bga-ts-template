/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/thumb must be included in the define as a dependency.
 */
interface Thumb {
	create: Function;
}

declare module "ebg/thumb" {
	const Thumb: new () => Thumb;
	export = Thumb;
}