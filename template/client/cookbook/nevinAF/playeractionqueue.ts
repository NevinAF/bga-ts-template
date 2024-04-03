/// <reference path="../index.ts" />

type AjaxResponseDelegate = (error: boolean, errorMessage?: string, errorCode?: number) => any;

/**
 * @playeractionqueue BETA. The Player Action Queue module is intended to make user side actions more responsive by queueing actions while the player is locked out of making further actions. This should be used when the player is making actions that we want to share with other clients but we aren't planing on removing the player from the active state. This is purely for responsiveness and requires a lot of setup to work properly:
 * - The server must have actions for all actions the player can make, rather than using a client side state to manage the player's actions.
 * - The other clients must be able to update based on any possible player's actions.
 * - If you plan on having the player be able to undo their actions, you must have a way to undo the action on the server side because the server is updated with each partial action.
 * 
 * @example
 * // Only the enqueueAjaxAction method is needed to implement this module; however, there are some additional properties and methods that can be used to help manage the behaviour and contents of the queue.
 * this.enqueueAjaxAction({ action: 'playCard', args: { card: 1 } });
 */
interface GameguiCookbook
{
	/**
	 * The error codes used when an action fails to post (i.e. cannot be sent to the server).
	 */
	actionErrorCodes: {
		/** The action was filtered out of the queue. */
		FILTERED_OUT: number,
		/** The action took too long to post. */
		TIMEOUT: number,
		/** The player is no longer active, and the action would've failed to post. */
		PLAYER_NOT_ACTIVE: number,
		/** One of the action dependencies failed to post or returned with an error. */
		DEPENDENCY_FAILED: number,
		/** The action was not possible from the current game state after all dependencies were evaluated. */
		ACTION_NOT_POSSIBLE: number,
	}

	/**
	 * The action that is currently being posted or waiting to be posted to the server. This will only ever contain items with the status of 'inProgress' or 'queued'.
	 * @example
	 * // Prevents adding actions to the queue while a specific action is in progress. Otherwise, the action will be filtered out.:
	 * if (this.actionQueue?.some((a) => a.action === 'confirmChoices' && a.state === 'inProgress')) return;
	 * this.filterActionQueue('confirmChoices'); // Ensures callbacks are called for any actions that were filtered out.
	 * this.enqueueAjaxAction({ action: 'playCard', args: { ... } });
	 */
	actionQueue?: PlayerActionQueueItem[];

	/**
	 * The maximum time, in milliseconds, that an action can be queued before it is sent. If the action is queued for longer than this time, it will be dropped and the callback will be called with an error code of '-513'. Default is 10 seconds (10000).
	 */
	actionPostTimeout?: number;

	/**
	 * The 'titleLocking' module is required for any of the strategies to work. This defines how queueing an action will lock/unlock the title when awaiting/receiving the response of action when an action is queue. This will prevent flickering in the title due to queued actions being sent and updating the title.
	 * 
	 * If defined and not 'none', the title will always be unlocked as soon as there are no actions in the {@link actionQueue} (waiting or inprogress).
	 * - `current`: When an action is enqueued and the title is not already locked, the title will be locked as is (i.e. the title will not change, and will not show changes).
	 * - `sending`: When an action is enqueued and the title is not already locked, the title will be changed to "Sending move to server...".
	 * - `actionbar`: When an action is enqueued and the title is not already locked, the title will be locked based on the current description and action buttons.
	 * - `unlockOnly`: Never automatically lock the title, but unlock as normal.
	 * @example
	 * // In setup or other:
	 * this.actionTitleLockingStrategy = 'sending';
	 * 
	 * // The following is a timeline of when events occur:
	 * // First button click. Title locked to "Sending move to server..."
	 * this.enqueueAjaxAction({ action: 'playCard', args: { ... } });
	 * // Second button click, before the first action has a response.
	 * this.enqueueAjaxAction({ action: 'playCard', args: { ... } });
	 * 
	 * // First action sends a notification. Hidden title is set to "Updating game situation ..."
	 * // First action completes which automatically posts the second action. Hidden title is set to "Sending move to server..."
	 * // First action calls onEnteringState and onUpdateActionButtons. Hidden title set to `descriptionyourturn` with some buttons.
	 * // Second action sends a notification. Hidden title is set to "Updating game situation ..."
	 * // Second action completes.
	 * // Second action calls onEnteringState and onUpdateActionButtons. Hidden title set to `descriptionyourturn` with some buttons.
	 * 
	 * // Title is unlocked, automatically restoring the title to the current game state.
	 * 
	 * // At ANY point above, the title can be manually unlocked/locked with titlelocking functions to update the title as needed. This is useful when using the 'actionbar' strategy and you want to show the updated button actions in the title.
	*/
	actionTitleLockingStrategy?: 'none' | 'current' | 'sending' | 'actionbar' | 'unlockOnly';

	/**
	 * Enqueues an ajax call for a player action. This will queue the action to the {@link actionQueue} and post the action asynchronously when there are no actions currently in progress. This is used to provide a responsive UI when the player is making multiple server action in a row.
	 * @param refItem The action to enqueue.
	 * @param dependencies The actions that need to be completed before this action can be posted. If any of these actions fail, this action will also fail. If any of these actions are not completed, this action will be queued until they are complete. If undefined, all previous actions in the queue act as a dependency. If defined, ALL possible non-dependency actions must not have race conditions when posted at the same time as this action (usually WAW). That is, any concurrent actions must not write to the same data else the server may rollback an action without warning. IN ADDITION, if this is a multiplayeractive state, the server must be able to handle all possible actions of any player at any time, usually resolved by having each players choices saved under separate data.
	 * @returns The item that was added to the queue. This can be used to filter out the action from the queue if needed.
	 * @example
	 * // Enqueues an action to play a card. The action will be posted when there are no actions in progress and all previous actions are complete, meaning that the user can queue up multiple actions without waiting for the server to respond.
	 * this.enqueueAjaxAction({ action: 'playCard', args: { card: 1 } });
	 * @example
	 * // Example of setting dependencies so multiple actions can run in parallel:
	 * playCard = (slot: number, cardId: number) {
	 * 	const filter = (item: PlayerActionQueueItem) => item.action === 'playCard' && item.args.slot === slot;
	 * 
	 * 	// If playing a card in the same slot replaces the card, you can also prevent all unsent actions to prevent a queue buildup:
	 * 	// this.filterActionQueue(filter);
	 * 
	 * 	// All previous actions are a dependency, UNLESS it is also playing a card and the slot is the same.
	 * 	const dependencies = this.actionQueue.filter(filter);
	 * 	this.enqueueAjaxAction({ action: 'playCard', args: { slot, cardId } }, dependencies);
	 * }
	 * 
	 * playCard( 1, 37 ); // Posts immediately.
	 * playCard( 2, 42 ); // Posts immediately.
	 * playCard( 1, 05 ); // This will wait for the first playCard(1, 37) to complete before posting.
	 */
	enqueueAjaxAction<T extends keyof PlayerActions>(refItem: PlayerActionQueueArgs<T>, dependencies?: (keyof PlayerActions | PlayerActionQueueItem)[]): PlayerActionQueueItem;

	/**
	 * Filters out any action with the matching action name from the queue. All actions that are removed will have their callback called with an error code matching {@link actionErrorCodes.FILTERED_OUT}.
	 * @param action The action to filter out of the queue.
	 * @returns True if any action was filtered out, false otherwise.
	 */
	filterActionQueue(filter: keyof PlayerActions | ((item: PlayerActionQueueItem) => boolean)): boolean;

	/**
	 * Tries to post the next action in the queue and creates an async function to if the next action is blocked in any way. Posting an action will remove that action from the queue and set it as the {@link actionInProgress}.
	 * 
	 * All actions use a callback to recursively call this function to post the next action in the queue. That is, calling this function once will force the queue to empty over time. Whenever you enqueue an action, this function is automatically called.
	 */
	asyncPostActions(): void;
}

interface PlayerActionQueueItem extends PlayerActionQueueArgs<keyof PlayerActions>
{
	/** The actions that need to be completed before this action item is posted. If any of these dependencies  */
	dependencies: PlayerActionQueueItem[] | null;
	timestamp: number;
	state: 'queued' | 'inProgress' | 'complete' | 'failed';
}

interface PlayerActionQueueArgs<T extends keyof PlayerActions> {
	/** The name of the action to enqueue */
	action: T;
	/** The arguments for the action. If action can be multiple types, this will include all possible combinations, but only the correct arguments should really be populated and sent. */
	args: ExcludeEmpty<PlayerActions[T]> extends never ? {} : ExcludeEmpty<PlayerActions[T]>;
	/** The callback to call when the action is removed from the action queue, either because of a server response (not necessarily successful), or an action error (see {@link GameguiCookbook.actionErrorCodes}) */
	callback?: AjaxResponseDelegate;
	onSent?: () => any;
};

GameguiCookbook.prototype.actionErrorCodes = {
	FILTERED_OUT: -512,
	TIMEOUT: -513,
	PLAYER_NOT_ACTIVE: -514,
	DEPENDENCY_FAILED: -515,
	ACTION_NOT_POSSIBLE: -516,
};

GameguiCookbook.prototype.enqueueAjaxAction = function<T extends keyof PlayerActions>(this: GameguiCookbook, refItem: PlayerActionQueueArgs<T>, dependencies?: (keyof PlayerActions | PlayerActionQueueItem)[]): PlayerActionQueueItem
{
	if (this.actionQueue === undefined)
		this.actionQueue = [];

	// @ts-ignore - this prevents copying the item, while not adding ignores to all the statements.
	let item = refItem as PlayerActionQueueItem;

	item.dependencies = dependencies ?
		// Map the action names to the existing objects, and keep the objects as is.
		dependencies.flatMap((dep) => (typeof dep === 'string') ?
			this.actionQueue!.filter((a) => a.action === dep) : dep) :
		// Default, all actions previously added in the queue must be completed before this action can be sent.
		null;

	item.timestamp = Date.now();
	item.state = 'queued';

	this.actionQueue.push(item);

	// @ts-ignore - Only works if the titlelocking module is added.
	if (this.isTitleLocked && !this.isTitleLocked()) {
		if (this.actionTitleLockingStrategy === 'sending')
			// @ts-ignore - Only works if the titlelocking module is added.
			this.lockTitleWithStatus?.('Sending move to server...');
		else if (this.actionTitleLockingStrategy === 'actionbar')
			// @ts-ignore - Only works if the titlelocking module is added.
			this.lockTitle?.('pagemaintitle_wrap');
		else if (this.actionTitleLockingStrategy === 'current')
			// @ts-ignore - Only works if the titlelocking module is added.
			this.lockTitle?.();
	}

	this.asyncPostActions();

	return item;
}

GameguiCookbook.prototype.filterActionQueue = function(this: GameguiCookbook, filter: keyof PlayerActions | ((item: PlayerActionQueueItem) => boolean)): boolean
{
	if (!this.actionQueue) return false;

	const count = this.actionQueue.length;

	for (let i = count - 1; i >= 0; i--)
	{
		const item = this.actionQueue[i];
		if (item.state === 'inProgress') continue;
		if (typeof filter === 'string' ? item.action !== filter : !filter(item)) continue;

		item.callback?.(true, 'Action was filtered out', this.actionErrorCodes.FILTERED_OUT);
		this.actionQueue.splice(i, 1);
	}

	return count !== this.actionQueue.length
}

GameguiCookbook.prototype.asyncPostActions = function (this: GameguiCookbook)
{
	if (this.actionQueue === undefined) return;

	if (this.actionPostTimeout)
	{
		clearTimeout(this.actionPostTimeout);
		this.actionPostTimeout = undefined;
	}
	
	if (!this.isCurrentPlayerActive())
	{
		for (const item of this.actionQueue)
		{
			item.state = 'failed';
			item.callback?.(true, 'Player is no longer active', this.actionErrorCodes.PLAYER_NOT_ACTIVE);
		}
		this.actionQueue = [];
	}

	const now = Date.now();
	
	// Try to push all actions that do not have awaiting dependencies.
	for (let i = 0; i < this.actionQueue.length; i++)
	{
		const item = this.actionQueue[i];

		if (item.state === 'inProgress')
		{
		}

		// else state is 'queued'. Items are removed when they are complete or failed.

		else if (
			(item.dependencies === null && i == 0) ||
			item.dependencies?.every((dep) => dep.state === 'complete')
		) {
			item.state = 'inProgress';

			this.ajaxcall(
				`/${this.game_name}/${this.game_name}/${item.action}.html`,
				// @ts-ignore - Prevents error when no PlayerActions are defined and stating that 'lock' might not be defined.
				item.args,
				this,
				() => { },
				(error: boolean, errorMessage?: string, errorCode?: number) =>
				{
					item.state = error ? 'failed' : 'complete';
					item.callback?.(error, errorMessage, errorCode);

					// Filter this item AND all 'null' dependencies if this item failed.
					this.actionQueue = this.actionQueue?.filter(x =>
					{
						// Make all queued actions with all dependencies (i.e. null) fail and remove them.
						if (x.state === 'queued' && x.dependencies === null && error) {
							x.state = 'failed';
							x.callback?.(true, 'Dependency failed', this.actionErrorCodes.DEPENDENCY_FAILED);
							return false;
						}

						// Also remove this
						return x !== item;
					});

					this.asyncPostActions();
				}
			);

			item.onSent?.();
		}

		else if (item.dependencies?.some((dep) => dep.state === 'failed'))
		{
			item.state = 'failed';
			item.callback?.(true, 'Dependency failed', this.actionErrorCodes.DEPENDENCY_FAILED);
			this.actionQueue.splice(i, 1);
			i = 0; // Restarts the loop in case this was a dependency for a previous item.
		}

		else if (item.timestamp + (this.actionPostTimeout ?? 10_000) < now)
		{
			item.state = 'failed';
			item.callback?.(true, 'Action took too long to post', this.actionErrorCodes.TIMEOUT);
			this.actionQueue.splice(i, 1);
			i = 0; // Restarts the loop in case this was a dependency for a previous item.
		}
	}

	if (this.actionQueue.length === 0)
	{
		if (this.actionTitleLockingStrategy && this.actionTitleLockingStrategy !== 'none')
			// @ts-ignore - Only works if the titlelocking module is added.
			this.removeTitleLocks?.();
		return;
	}
	else if (this.actionQueue.every(i => i.state != 'inProgress')) {
		// There are no actions in progress, but somehow there are still actions that cannot be sent!
		console.error("There is likely a circular dependency in the action queue. None of the actions can be sent: ", this.actionQueue);
		for (const item of this.actionQueue) {
			item.state = 'failed';
			item.callback?.(true, 'Circular dependency', this.actionErrorCodes.DEPENDENCY_FAILED);
		}
		this.actionQueue = [];
	}
}