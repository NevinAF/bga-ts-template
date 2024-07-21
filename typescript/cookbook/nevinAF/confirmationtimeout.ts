/// <amd-module name="cookbook/nevinAF/confirmationtimeout"/>
import 'ebg/core/common';

/**
 * The {@link ConfirmationTimeout} is a support class built on top of {@link setTimeout} to provide a visual representation of a timeout and provide an easy way to cancel it. This manages two visual elements:
 * - A cancel area which describes the space which the user can click to escape the timeout.
 * - An animation element which follows the mouse around to show the status of the timeout (e.g., a loading spinner).
 * 
 * There are several ways to use this class:
 * @example
 * // Using 'add' method to link dom elements (using 'click' event).
 * const confirmationTimeout = new ConfirmationTimeout(document);
 * 
 * confirmationTimeout.add('button', () => {
 * 	console.log('Action confirmed!');
 * });
 * @example
 * // Using 'set' method to link mouse events. This is usually more suitable when you need to check actions before visually confirming them.
 * document.getElementById('button')?.addEventListener('click', evt =>
 * {
 * 	if (!this.checkAction('action'))
 * 		return;
 * 	console.log('Confirmation action...');
 * 	confirmationTimeout.set(evt, () => {
 * 		console.log('Action confirmed!');
 * 	});
 * });
 * @example
 * // Same as 'set', but built for the async/await pattern.
 * document.getElementById('button')?.addEventListener('click', async evt =>
 * {
 * 	console.log('Confirmation action...');
 * 	await confirmationTimeout.promise(evt);
 * 	console.log('Action confirmed!');
 * });
 */
class ConfirmationTimeout
{
	/** The default duration in milliseconds. */
	private _duration!: number;
	/** The timeout for this current interaction. When the timeout completes, it call the callback. This is used to determine if the confirmation timeout is active. */
	private _timeout: number | null = null;
	/** The element created to represent the cancel area. Clicking on this area will cancel the timeout. See {@link off}. */
	private _cancelElement!: HTMLElement;
	/** The element which represents the mouse, usually animated to represent the timeout. */
	private _animationElement!: HTMLElement | null;
	/** The HTML 'click' listeners. This mimic Dojo.Handle, without needing dojo. */
	private _listeners?: Map<HTMLElement, (... args: any[]) => any>;
	/** If true, the animation element will follow the mouse around. Otherwise, it will be placed at the cursor when this timeout is set any will not move until the next {@link set}. */
	private _followMouse!: boolean;

	private static _defaultAnimationCSS = `
#confirmation-timeout-default {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	position: absolute;
	pointer-events: none;
	display: none;
}
#confirmation-timeout-default div {
	width: 100%;
	height: 100%;
	position: absolute;
	border-radius: 50%;
}
#confirmation-timeout-default > div {
	clip: rect(0px, 20px, 20px, 10px);
}
#confirmation-timeout-default > div > div {
	clip: rect(0px, 11px, 20px, 0px);
	background: #08C;
}
#confirmation-timeout-default > div:first-child, #confirmation-timeout-default > div > div {
	animation: confirmation-timeout-anim 1s linear forwards;
}
@keyframes confirmation-timeout-anim {
	0% { transform: rotate(3deg); }
	100% { transform: rotate(180deg); }
}`;
	private static _defaultAnimationCSSAdded = false;

	private static AddDefaultAnimationCSS()
	{
		if (ConfirmationTimeout._defaultAnimationCSSAdded)
			return;

		let style = document.createElement('style');
		style.innerHTML = ConfirmationTimeout._defaultAnimationCSS;
		document.head.appendChild(style);
		ConfirmationTimeout._defaultAnimationCSSAdded = true;
	}

	/** Turns off the confirmation timeout, canceling the callback and hiding all visuals. */
	public off()
	{
		if (this._timeout == null)
			return;

		clearTimeout(this._timeout);
		this._timeout = null;

		this._cancelElement.style.display = 'none';

		if (this._animationElement)
			this._animationElement.style.display = 'none';
	}

	/**
	 * Sets a new timeout based on the mouse position. When the timeout completes, the callback will be called. If a timeout is already active, it will be canceled.
	 * @param evt The mouse event that triggered the timeout.
	 * @param callback The function to call when the timeout completes.
	 * @see promise for an async version of this function.
	 * @example
	 * ```typescript
	 * document.getElementById('button')?.addEventListener('click', async evt =>
	 * {
	 * 	console.log('Confirmation action...');
	 * 	confirmationTimeout.set(evt, () => {
	 * 		console.log('Action confirmed!');
	 * 	});
	 * });
	 * ```
	 */
	public set(evt: MouseEvent, callback: () => void)
	{
		if (this._timeout != null)
			this.off();

		if (this._duration <= 0) {
			callback();
			return;
		}

		this._cancelElement.style.display = "block";

		this._timeout = setTimeout(() => {
			this.off();
			callback();
		}, this._duration);

		if (this._animationElement)
		{
			this._animationElement.style.display = "block";
			this.mouseMoved(evt);
		}
	}

	/**
	 * Same as {@link set}, but returns a promise that resolves when the timeout completes.
	 * @param evt The mouse event that triggered the timeout.
	 * @returns A promise that resolves when the timeout completes.
	 * @example
	 * ```typescript
	 * document.getElementById('button')?.addEventListener('click', async evt =>
	 * {
	 * 	console.log('Confirmation action...');
	 * 	await confirmationTimeout.promise(evt);
	 * 	console.log('Action confirmed!');
	 * });
	 * ```
	 */
	public promise(evt: MouseEvent): Promise<void>
	{
		return new Promise((resolve, reject) => {
			this.set(evt, resolve);
		});
	}

	/**
	 * Adds a click listener to the element which will trigger the confirmation timeout.
	 * @param element The element to add the listener to. If a string, it will be used as an id to find the element. If falsy or not found, nothing will happen.
	 * @param callback The function to call when the timeout completes. This is not the same as the callback used when the event is triggered (i.e., it will be 'duration' milliseconds after the event is triggered).
	 * @returns True if the listener was added, false if the element was not found.
	 * @example
	 * ```typescript
	 * confirmationTimeout.add('button', () => {
	 * 	console.log('Action confirmed!');
	 * });
	 */
	public add(element: string | HTMLElement | null, callback: () => void): boolean
	{
		if (!this._listeners)
			this._listeners = new Map();

		const listener = (evt: MouseEvent) => {
			this.set(evt, callback);
		}

		if (typeof element == 'string')
			element = document.getElementById(element);

		if (element)
		{
			this._listeners.set(element, listener);
			element.addEventListener('click', listener);
			return true;
		}

		return false;
	}

	/**
	 * Removes the click listener from the element (all listeners if multiple are set on this element).
	 * @param element The element to remove the listener from. If a string, it will be used as an id to find the element. If falsy or not found, nothing will happen.
	 * @returns True if the listener was removed, false if the element was not found or no listener was set.
	 * @example
	 * ```typescript
	 * confirmationTimeout.remove('button');
	 */
	public remove(element: string | HTMLElement | null): boolean
	{
		if (!this._listeners)
			return false;

		if (typeof element == 'string')
			element = document.getElementById(element);

		if (element)
		{
			let listener = this._listeners.get(element);
			if (listener)
			{
				do
				{
					element.removeEventListener('click', listener);
					this._listeners.delete(element);
				} while (listener = this._listeners.get(element));

				return true;
			}
		}

		return false;
	}

	/** Moves the animation element to the mouse position. */
	private mouseMoved(evt: MouseEvent)
	{
		if (!this._followMouse && evt.target == this._cancelElement)
			return;

		if (this._animationElement)
		{
			let size = this._animationElement.getBoundingClientRect();
			this._animationElement.style.left = evt.clientX - size.width / 2 + 'px';
			this._animationElement.style.top = evt.clientY - size.height / 2 + 'px';
		}
	}

	/**
	 * Creates a new confirmation timeout.
	 * @param cancel_area_classes The classes to add to the created cancel area element. This is already always scaled and positioned to cover the entire cancel area and disables user selection.
	 * @param options The options for this confirmation timeout. See {@link setCancelArea}, {@link setAnimation}, {@link setDuration}, {@link setFollowMouse}, and {@link setCancelAreaClasses} for more information.
	 * @example
	 * ```typescript
	 * const confirmationTimeout = new ConfirmationTimeout('leftright_page_wrapper');
	 * 
	 * confirmationTimeout.add('button', () => {
	 * 	console.log('Action confirmed!');
	 * });
	 * ```
	 */
	constructor(cancel_area: string | Node | null, options: { animation?: string | HTMLElement | null, duration?: number, followMouse?: boolean, cancel_area_classes?: string, durationPref?: number } = {})
	{
		this.setCancelArea(cancel_area);
		this.setAnimation(options.animation);
		if (options.durationPref !== undefined)
			this.setDurationPreference(options.durationPref);
		else this.setDuration(options.duration ?? 1000);

		this.setFollowMouse(options.followMouse ?? true);
		this.setCancelAreaClasses(options.cancel_area_classes ?? '');
	}

	/**
	 * Updates the cancel area for this object.
	 * @param cancel_area The element to add the cancel area to. If a string, it will be used as an id to find the element. If falsy or not found, the cancel area will be added to the body.
	 */
	public setCancelArea(cancel_area?: string | Node | null)
	{
		if (this._cancelElement)
			this._cancelElement.remove();

		if (typeof cancel_area == 'string')
			cancel_area = document.getElementById(cancel_area);

		if (!cancel_area || cancel_area == document)
			cancel_area = document.body;

		let cancelElement = cancel_area.ownerDocument!.createElement('div');
		cancelElement.style.width = '100%';
		cancelElement.style.height = '100%';
		cancelElement.style.position = 'absolute';
		cancelElement.style.top = '0px';
		cancelElement.style.left = '0px';
		cancelElement.style.display = 'none';
		cancelElement.style.userSelect = 'none';

		cancel_area.appendChild(cancelElement);

		cancelElement.addEventListener('click', () => {
			this.off();
		});

		this._cancelElement = cancelElement;
		this._cancelElement.addEventListener('mousemove', this.mouseMoved.bind(this));
	}

	/**
	 * Updates the animation for this object.
	 * @param animation The element to use as the animation. If a string, it will be used as an id to find the element. If falsy or not found, a default animation will be created.
	 */
	public setAnimation(animation?: string | HTMLElement | null)
	{
		if (animation === undefined)
		{
			animation = document.createElement('div');
			animation.id = 'confirmation-timeout-default';
			animation.style.display = 'none';

			for (let i = 0; i < 2; i++) {
				const div = document.createElement('div');
				const inner = document.createElement('div');
				div.appendChild(inner);
				animation.appendChild(div);
			}

			ConfirmationTimeout.AddDefaultAnimationCSS();
			this._cancelElement.appendChild(animation);
		}
		else if (typeof animation == 'string')
			animation = document.getElementById(animation);

		if (animation)
		{
			this._animationElement = animation;
			this._animationElement.style.position = 'absolute';
			this._animationElement.style.userSelect = 'none';
			this._cancelElement.style.cursor = null!;

			if (this._duration)
				this.setDuration(this._duration);
		}
		else {
			this._animationElement = null;
			this._cancelElement.style.cursor = 'wait';
		}
	}

	/**
	 * Updates the duration for this object.
	 * @param duration The duration of the timeout in milliseconds.
	*/
	public setDuration(duration: number)
	{
		this._duration = duration;

		if (this._animationElement)
		{
			this._animationElement.style.animationDuration = this._duration + 'ms';
			this._animationElement.querySelectorAll<HTMLElement>('*').forEach(element => {
				element.style.animationDuration = this._duration + 'ms';
			});
		}

	}

	/**
	 * Updates the duration for this object. This will pull directly from the gameui preferences data, which can be pasted into any project with the following code:
	 * ```json
	 * "150": {
	 * 	"name": "Confirmation Time",
	 * 	"needReload": true, // This can differ you manually update the preference.
	 * 	"values": {
	 * 		"1": { "name": "No Confirmations" },
	 * 		"2": { "name": "Very Short: 300ms" },
	 * 		"3": { "name": "Short: 600ms" },
	 * 		"4": { "name": "Default: 1 Second" },
	 * 		"5": { "name": "Long: 1.5 Seconds" },
	 * 		"6": { "name": "Very Long: 2 Seconds" }
	 * 	},
	 * 	"default": 4
	 * }
	 * ```
	 * @param durationPref The index of the selected duration preference. This will always map to the following values: [0, 300, 600, 1000, 1500, 2000].
	*/
	setDurationPreference(durationPref: number)
	{
		if (gameui === undefined)
		{
			console.error('Cannot use duration preferences before the games "setup" function!');
			this.setDuration(1000);
			return;
		}

		// @ts-ignore
		let pref = gameui.prefs[durationPref];
		if (pref === undefined)
		{
			console.error('Invalid duration preference id: ' + durationPref);
			durationPref = 4;
		}
		else durationPref = toint(pref.value)!;

		let duration = [0, 300, 600, 1000, 1500, 2000][durationPref - 1];
		if (duration === undefined || isNaN(duration))
		{
			console.error('Invalid duration preference value: ' + durationPref);
			duration = 1000;
		}

		this.setDuration(duration);
	}

	/**
	 * Updates if the animation element should follow the mouse around.
	 *  If true, the animation element will follow the mouse around. Otherwise, it will be placed at the cursor when this timeout is set any will not move until the next {@link set}.
	 */
	public setFollowMouse(followMouse: boolean)
	{
		this._followMouse = followMouse;
	}

	/** Updates the classes for the cancel area. */
	public setCancelAreaClasses(classes: string)
	{
		this._cancelElement.className = classes;
	}

	/** Destroys this object, removing all listeners and elements. You should not use this object after calling destroy. */
	public destroy()
	{
		this.off();
		this._listeners?.forEach((listener, element) => {
			element.removeEventListener('click', listener);
		});
		this._listeners?.clear();
		this._animationElement?.remove();
		this._cancelElement?.remove();
	}
}

export = ConfirmationTimeout;