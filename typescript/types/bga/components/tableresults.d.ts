/**
 * Partial: This has been partially typed based on a subset of the BGA source code.
 * @requires ebg/tableresults must be included in the define as a dependency.
 */
interface TableResults {
	create: Function;
}

declare module "ebg/tableresults" {
	const TableResults: new () => TableResults;
	export = TableResults;
}