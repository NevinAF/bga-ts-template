/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/webpush must be included in the define as a dependency.
 */
interface WebPush {
}

declare module "ebg/webpush" {
	const WebPush: new () => WebPush;
	export = WebPush;
}