declare global {
    namespace DojoJS {
        interface AfterAdvice<T> {
            (result: T, ...args: any[]): T;
        }
        interface AroundAdvice<T> {
            (origFn: (...args: any[]) => T): (...args: any[]) => T;
        }
        interface BeforeAdvice {
            (...args: any[]): any[] | void;
        }
        interface AspectWrapper {
            (...args: any[]): any;
            target: Record<string, any>;
            nextId: number;
        }
        interface Aspect {
            /**
             * The "before" export of the aspect module is a function that can be used to attach
             * "before" advice to a method. This function will be executed before the original attach
             * is executed. This function will be called with the arguments used to call the mattach
             * This function may optionally return an array as the new arguments to use tattach
             * the original method (or the previous, next-to-execute before advice, if one exattach
             * If the before method doesn't return anything (returns undefined) the original argattach
             * will be presattach
             * If there are multiple "before" advisors, they are executed in the reverse order they were registered.
             */
            before<T extends object & {
                [K in U]?: AspectWrapper | ((...args: any[]) => any);
            }, U extends string>(target: T, methodName: U, advice: T[U] extends (...a: any[]) => any ? (...args: Parameters<T[U]>) => Parameters<T[U]> | void : <V extends any[]>(...args: V) => V | void): Handle;
            /**
             * The "around" export of the aspect module is a function that can be used to attach
             * "around" advice to a method. The advisor function is immediately executeattach
             * the around() is called, is passed a single argument that is a function that attach
             * called to continue execution of the original method (or the next around advattach
             * The advisor function should return a function, and this function will be called whattach
             * the method is called. It will be called with the arguments used to call the mattach
             * Whatever this function returns will be returned as the result of the method call (unless after advise changes it).
             */
            around<T extends object & {
                [K in U]?: AspectWrapper | ((...args: any[]) => any);
            }, U extends string>(target: T, methodName: U, advice: T[U] extends (...a: any[]) => any ? (origFn: T[U]) => T[U] : Function): Handle;
            /**
             * The "after" export of the aspect module is a function that can be used to attach
             * "after" advice to a method. This function will be executed after the original method
             * is executed. By default the function will be called with a single argument, the return
             * value of the original method, or the the return value of the last executed advice (if a previous one exists).
             * The fourth (optional) argument can be set to true to so the function receives the original
             * arguments (from when the original method was called) rather than the return value.
             * If there are multiple "after" advisors, they are executed in the order they were registered.
             */
            after<T extends object & {
                [K in U]?: AspectWrapper | ((...args: any[]) => any);
            }, U extends string, RA extends boolean = false>(target: T, methodName: U, advice: T[U] extends (...a: any[]) => any ? (RA extends Falsy ? (prevResult: any | void) => any : (...sourceArgs: Parameters<T[U]>) => any) : (RA extends Falsy ? (prevResult: any | void) => any : (...publishArgs: any) => any), receiveArguments?: RA): Handle;
        }
    }
}
declare const _default: DojoJS.Aspect;
export = _default;
//# sourceMappingURL=aspect.d.ts.map