declare class Wrapper_Template {
    page: any;
    container_div: HTMLElement | null;
    container_id: string | null;
    container_inner_div: HTMLElement | null;
    container_inner_id: string | null;
    item_size: number;
    create(page: any, id: string, inner: HTMLElement): void;
    rewrap(): void;
}
declare let Wrapper: DojoJS.DojoClass<Wrapper_Template, []>;
export = Wrapper;
declare global {
    namespace BGA {
        type Wrapper = typeof Wrapper;
        interface EBG {
            wrapper: Wrapper;
        }
    }
    var ebg: BGA.EBG;
}
//# sourceMappingURL=wrapper.d.ts.map