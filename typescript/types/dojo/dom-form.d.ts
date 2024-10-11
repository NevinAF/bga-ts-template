declare class DomForm {
    private static o;
    /**
     * Serialize a form field to a JavaScript object.
     */
    fieldToObject(e: HTMLInputElement | string): any[] | string | null;
    /**
     * Serialize a form node to a JavaScript object.
     */
    toObject(formOrID: HTMLFormElement | string): Record<string, any>;
    /**
     * Returns a URL-encoded string representing the form passed as either a
     * node or string ID identifying the form to serialize
     */
    toQuery(formOrId: HTMLFormElement | string): string;
    /**
     * Create a serialized JSON string from a form node or string
     * ID identifying the form to serialize
     */
    toJson(formOrId: HTMLFormElement | string, prettyPrint?: boolean): string;
}
declare const _default: DomForm;
export = _default;
//# sourceMappingURL=dom-form.d.ts.map