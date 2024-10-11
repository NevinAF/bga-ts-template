declare var QueryResults: QueryResultsFunction;
interface QueryResultsFunction {
    /**
     * A function that wraps the results of a store query with additional
     * methods.
     */
    <T extends Object>(results: T[]): DojoJS.QueryResults<T>;
}
export = QueryResults;
//# sourceMappingURL=QueryResults.d.ts.map