import "dijit/form/FilteringSelect";
import "dojox/data/QueryReadStore";
interface HTMLValueElement extends HTMLElement {
    value?: string;
}
type FilteringSelectInstance = InstanceType<typeof dijit.form.FilteringSelect>;
declare class ComboAjax_Template {
    div_id: string | null;
    div: HTMLValueElement | null;
    query_url: string;
    stateStore: InstanceType<typeof dojox.data.QueryReadStore> | null;
    filteringSelect: FilteringSelectInstance | null;
    currentSelection: string | null;
    disableNextOnChange: boolean;
    onChange: (e: string) => void;
    create(t: string, i: string, n: string | undefined, o: string | undefined): void;
    onKeyUp(e: KeyboardEvent): void;
    setValue(e: string): void;
    destroy(e: any): void;
    getSelection(): any;
}
declare let ComboAjax: DojoJS.DojoClass<ComboAjax_Template, []>;
export = ComboAjax;
declare global {
    namespace BGA {
        type ComboAjax = typeof ComboAjax;
        interface EBG {
            comboajax: ComboAjax;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=comboajax.d.ts.map