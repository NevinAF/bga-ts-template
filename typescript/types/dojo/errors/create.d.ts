declare function create<E extends typeof Error = typeof Error, P extends object = {}>(name: string, ctor?: Constructor<any> | null, base?: E | null, props?: P | null): {
    new (...args: Parameters<E>): InstanceType<E> & P;
    prototype: InstanceType<E> & P;
} & E;
export = create;
//# sourceMappingURL=create.d.ts.map