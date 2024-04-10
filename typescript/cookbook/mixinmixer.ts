/// <amd-module name="cookbook/blender" />

function mixinmixer<TBase, TMixin extends (base: TBase) => TBase>(
	base: TBase,
	...mixins: TMixin[]
): AnyOf<ReturnType<TMixin>>
{
	// @ts-ignore
	return mixins.reduce((acc, mixin) => mixin(acc), base);
}

export = mixinmixer;