/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/pageheader must be included in the define as a dependency.
 */
interface PageHeader {
	create: Function;
}

declare module "ebg/pageheader" {
	const PageHeader: new () => PageHeader;
	export = PageHeader;
}