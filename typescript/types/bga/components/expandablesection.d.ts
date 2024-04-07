/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/expandablesection must be included in the define as a dependency.
 */
interface ExpandableSection {
}

declare module "ebg/expandablesection" {
	const ExpandableSection: new () => ExpandableSection;
	export = ExpandableSection;
}