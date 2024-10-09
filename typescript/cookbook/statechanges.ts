import "ebg/core/gamegui";

type OnStateChangeHandlers =
	{ [K in keyof BGA.GameStateMap as `onEnteringState_${BGA.GameStateMap[K]['name']}`]:
		(args: BGA.GameStateMap[K]['args']) => void } &
	{ [K in keyof BGA.GameStateMap as `onUpdateActionButtons_${BGA.GameStateMap[K]['name']}`]:
		(args: BGA.GameStateMap[K]['args']) => void } &
	{ [K in keyof BGA.GameStateMap as `onLeavingState_${BGA.GameStateMap[K]['name']}`]:
		() => void };

/**
 * Mixin for Gamegui classes that adds state change handlers and ensures that {@link Gamegui.onUpdateActionButtons} is always called after {@link Gamegui.onEnteringState} when the state changes. When using this mixin, there is no need to override the {@link Gamegui.onEnteringState}, {@link Gamegui.onLeavingState}, or {@link Gamegui.onUpdateActionButtons} methods. Instead, create methods with the following naming convention: `onEnteringState_{stateName}`, `onLeavingState_{stateName}`, and `onUpdateActionButtons_{stateName}` where `{stateName}` is the name of the state. Typescript will automatically enforce that these methods have the right signature arguments for the state they are handling.
 * In addition, there is a {@link StateChangeMixin.afterUpdateActionButtons} method that is called after {@link Gamegui.onUpdateActionButtons} and can be used to perform additional/generalized actions.
 * @see README.md for more information on using cookbook mixins.
 * @example
 * class MyGame extends StateChangeMixin(Gamegui) {
 * 	onEnteringState_playCard(args: GameStateArgs<'playCard'>) {}
 * 	onUpdateActionButtons_playCard(args: GameStateArgs<'playCard'>) {}
 * }
 * @example
 * class MyGame extends StateChangeMixin(Gamegui) {
 * 	override onEnteringState(stateName: GameStateName, args: CurrentStateArgs) {
 * 		// Before...
 * 		super.onEnteringState(stateName, args);
 * 		// After...
 * 	}
 */
function StateChangeMixin <TBase extends new (...args: any[]) => InstanceType<BGA.Gamegui>>(Base: TBase)
{
	interface StateChange extends Partial<OnStateChangeHandlers> {}

	class StateChange extends Base
	{
		private _stateEntered?: string;
		private _pendingUpdate: boolean = false;

		onEnteringState_gameEnd(args: BGA.AdditionalGameStateArgs | null)
		{
			console.log("onEnteringState_gameEnd", args);
		}

		onEnteringState_gameSetup(args: BGA.AdditionalGameStateArgs | null)
		{
			console.log("onEnteringState_gameSetup", args);
		}

		override onEnteringState(...[stateName, state]: BGA.GameStateTuple_NameState)
		{
			this._stateEntered = stateName;
			
			console.log("onEnteringState: " + stateName, state, this.debugStateInfo());
			super.onEnteringState(...[stateName, state] as BGA.GameStateTuple_NameState);
			this[`onEnteringState_${stateName}`]?.(state.args);

			if (this._pendingUpdate)
				this.onUpdateActionButtons(...[stateName, state.args] as BGA.GameStateTuple_NameArgs);
		}

		override onLeavingState(stateName: BGA.GameState["name"])
		{
			this._pendingUpdate = false;

			console.log("onLeavingState: " + stateName, this.debugStateInfo());
			super.onLeavingState(stateName);
			this[`onLeavingState_${stateName}`]?.();
		}

		override onUpdateActionButtons(...[stateName, args]: BGA.GameStateTuple_NameArgs)
		{
			this._pendingUpdate = this._stateEntered != stateName;
			if (!this._pendingUpdate && this.isCurrentPlayerActive())
			{
				console.log("onUpdateActionButtons: " + stateName, args, this.debugStateInfo());
				super.onUpdateActionButtons(...[stateName, args] as BGA.GameStateTuple_NameArgs);
				this[`onUpdateActionButtons_${stateName}`]?.(args as any);
				this.afterUpdateActionButtons(...[stateName, args] as BGA.GameStateTuple_NameArgs);
				return;
			}
		}

		afterUpdateActionButtons(...[stateName, args]: BGA.GameStateTuple_NameArgs) {}

		/**
		 * Returns a record of debuggable information which is automatically logged when entering, leaving, or updating a state. Override this method to add any information wanted.
		 * @example
		 * override debugStateInfo() {
		 * 	let info = super.debugStateInfo();
		 * 	info['myCustomInfo'] = this.myCustomInfo;
		 * 	return info;
		 * }
		 */
		debugStateInfo(): Record<keyof any, any> {
			return {
				isCurrentPlayerActive: this.isCurrentPlayerActive(),
				instantaneousMode: this.instantaneousMode,
				replayMode: typeof g_replayFrom !== "undefined"
			};
		}
	}

	return StateChange;
};

export = StateChangeMixin;