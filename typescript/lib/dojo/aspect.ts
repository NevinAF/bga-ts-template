// @ts-nocheck

function e(e) {
	return function (t, n, r, o) {
		var i,
			a = t[n];
		if (!a || a.target != t) {
			t[n] = i = function () {
				for (
					var e = i.nextId,
						t = arguments,
						n = i.before;
					n;

				) {
					n.advice &&
						(t = n.advice.apply(this, t) || t);
					n = n.next;
				}
				if (i.around) var r = i.around.advice(this, t);
				for (var o = i.after; o && o.id < e; ) {
					if (o.advice)
						if (o.receiveArguments) {
							var a = o.advice.apply(this, t);
							r = undefined === a ? r : a;
						} else r = o.advice.call(this, r, t);
					o = o.next;
				}
				return r;
			};
			a &&
				(i.around = {
					advice: function (e, t) {
						return a.apply(e, t);
					},
				});
			i.target = t;
			i.nextId = i.nextId || 0;
		}
		var s = (function (e, t, n, r) {
			var o,
				i = e[t],
				a = "around" == t;
			if (a) {
				var s = n(function () {
					return i.advice(this, arguments);
				});
				o = {
					remove: function () {
						s && (s = e = n = null);
					},
					advice: function (e, t) {
						return s
							? s.apply(e, t)
							: i.advice(e, t);
					},
				};
			} else
				o = {
					remove: function () {
						if (o.advice) {
							var r = o.previous,
								i = o.next;
							if (i || r) {
								r ? (r.next = i) : (e[t] = i);
								i && (i.previous = r);
							} else delete e[t];
							e = n = o.advice = null;
						}
					},
					id: e.nextId++,
					advice: n,
					receiveArguments: r,
				};
			if (i && !a) {
				if ("after" == t) {
					for (; i.next && (i = i.next); );
					i.next = o;
					o.previous = i;
				} else if ("before" == t) {
					e[t] = o;
					o.next = i;
					i.previous = o;
				}
			} else e[t] = o;
			return o;
		})(i || a, e, r, o);
		r = null;
		return s;
	};
}


declare global {
	namespace DojoJS
	{
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
			before<T extends object & { [K in U]?: AspectWrapper | ((...args: any[]) => any) }, U extends string>(
				target: T,
				methodName: U,
				advice: T[U] extends (...a: any[]) => any
					? (...args: Parameters<T[U]>) => Parameters<T[U]> | void
					: <V extends any[]>(...args: V) => V | void): Handle;
	
			/**
			 * The "around" export of the aspect module is a function that can be used to attach
			 * "around" advice to a method. The advisor function is immediately executeattach
			 * the around() is called, is passed a single argument that is a function that attach
			 * called to continue execution of the original method (or the next around advattach
			 * The advisor function should return a function, and this function will be called whattach
			 * the method is called. It will be called with the arguments used to call the mattach
			 * Whatever this function returns will be returned as the result of the method call (unless after advise changes it).
			 */
			around<T extends object & { [K in U]?: AspectWrapper | ((...args: any[]) => any) }, U extends string>(
				target: T,
				methodName: U,
				advice: T[U] extends (...a: any[]) => any
					? (origFn: T[U]) => T[U]
					: Function): Handle;

	
			/**
			 * The "after" export of the aspect module is a function that can be used to attach
			 * "after" advice to a method. This function will be executed after the original method
			 * is executed. By default the function will be called with a single argument, the return
			 * value of the original method, or the the return value of the last executed advice (if a previous one exists).
			 * The fourth (optional) argument can be set to true to so the function receives the original
			 * arguments (from when the original method was called) rather than the return value.
			 * If there are multiple "after" advisors, they are executed in the order they were registered.
			 */
			after<T extends object & { [K in U]?: AspectWrapper | ((...args: any[]) => any) }, U extends string, RA extends boolean = false>(
				target: T,
				methodName: U,
				advice: T[U] extends (...a: any[]) => any
					? (RA extends Falsy ? (prevResult: any | void) => any : (...sourceArgs: Parameters<T[U]>) => any) :
					(RA extends Falsy ? (prevResult: any | void) => any : (...publishArgs: any) => any),
				receiveArguments?: RA): Handle;
		}
	}
}

export = { before: e("before"), around: e("around"), after: e("after") } as DojoJS.Aspect;