/// <amd-module name="cookbook/mixinmixer" />

function mixinmixer<TBase, TMixin extends (base: TBase) => TBase>(
	base: TBase,
	...mixins: TMixin[]
): AnyOf<ReturnType<TMixin>>
{
	// @ts-ignore
	return mixins.reduce((acc, mixin) => mixin(acc), base);
}

export = mixinmixer;