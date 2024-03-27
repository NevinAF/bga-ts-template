/// <reference path="../index.ts"/>

/**
 * @titlelocking BETA. This module lets you lock the main title banner of the page so that it no longer shows updated. The locked title is always a new element such that the original title can still be updated in the background and restored later. There are several ways to use title locking:
 * - {@link lockTitle} and {@link removeTitleLocks}: Locks and unlocks the current page title. The {@link titleLock_maintainEvents} defines what game specific events need to be maintained when copying the title.
 * - {@link lockTitleWithStatus}/{@link lockTitleWithHTML} and {@link removeTitleLocks}: Lock the main title banner with custom content. This is useful for showing a status or custom content.
 * - {@link pushTitleLock}/{@link pushTitleLockFromStatus}/{@link pushTitleLockFromHTML} and {@link popTitleLock}/{@link removeTitleLocks}: Locks the banner store as a stack. This is useful for nested events where you want to show a status after locking the title but maintain the original lock.
 * 
 * See each function for more information on how to use them and how they interact with one another.
 * 
 * @example
 * // Lock the title with a status
 * this.lockTitleWithStatus('Special sending to server message...');
 * this.ajaxcall('<url>', { ... }, this, () => {}, (is_error) => {
 *    this.removeTitleLocks();
 * });
 */
interface GameguiCookbook
{
	/** The element that is used to display the title when the title banner is locked. This is a sibling of `pagemaintitle_wrap` and `gameaction_status_wrap`, parented to `page-title`. This is readonly. */
	titlelock_element?: HTMLElement;
	/** The events that are maintained when cloning the title banner. If undefined, `['onclick']` will be used instead. */
	titleLock_maintainEvents?: (keyof HTMLElementEventMap)[];

	/**
	 * Returns a deep clone of the given element with all ids removed (maintaining any styling if needed).
	 * @param element The element to clone.
	 * @param maintainEvents The events to maintain when cloning the element. A 'maintained' event is one that is automatically called when the copied element is clicked (so both elements receive the event).
	 * @returns The cloned element.
	 */
	cloneHTMLWithoutIds(element: Element, ...maintainEvents: (keyof HTMLElementEventMap)[]): HTMLElement;

	/** Creates the title lock element if it doesn't exist and returns it. This also creates the 'display_none' class which is used to force override the display property of an element (and prevents it from being updated / interfering with updates). */
	createTitleLock(): HTMLElement;

	/** Returns whether the title is currently locked. */
	isTitleLocked(): boolean;

	/**
	 * Locks the title banner using whatever the current banner title is (by creating a pseudo clone). This does nothing when the banner is already locked.
	 * @param target The target element to lock. If undefined, the first visible element of `pagemaintitle_wrap` or `gameaction_status_wrap` is used.
	 */
	lockTitle(target?: 'pagemaintitle_wrap' | 'gameaction_status_wrap'): void;
	/** Locks the title banner with the given status. This will remove all locks before updating the status. Optimized such that updating the status does not recreate the element. */
	lockTitleWithStatus(status: string): void;
	/** Locks the title banner with the given HTML. This will remove all locks before updating the HTML. */
	lockTitleWithHTML(html: string | HTMLElement): void;

	/**
	 * Pushes a new title lock based on the current title onto the title stack.
	 * @param target The target element to lock. If undefined, the first visible element of `pagemaintitle_wrap` or `gameaction_status_wrap` is used.
	 */
	pushTitleLock(target?: 'pagemaintitle_wrap' | 'gameaction_status_wrap'): void;
	/** Pushes a new title lock based on the given status onto the title stack. */
	pushTitleLockFromStatus(status: string): void;
	/** Pushes a new title lock based on the given HTML onto the title stack. */
	pushTitleLockFromHTML(html: string | HTMLElement): void;
	/** Removes the latest title lock from the stack. If there is only one lock on the stack, this is the same as {@link removeTitleLocks}. */
	popTitleLock(): boolean;
	/** Removes all title locks and restores the title (to whatever content it should have, not necessarily the original). */
	removeTitleLocks(): void;

	/** Internal function for optimization. This pops the latest title lock but does not check if the current title needs to be disabled nor if the latest lock needs to be displayed. */
	popTitleLockWithoutUpdate(): boolean;
}

GameguiCookbook.prototype.cloneHTMLWithoutIds = function(this: GameguiCookbook, element: Element, ...maintainEvents: (keyof HTMLElementEventMap)[]): HTMLElement
{
	const cleanNode = (el: Element) => {

		let id = el.getAttribute('id');
		el.removeAttribute('id');

		if (el instanceof HTMLElement && id)
		{
			let source = $(id);
			if (source)
			{
				let computedStyle = getComputedStyle(source);
				for (let property of ['height', 'top', 'display'])
					el.style[property] = computedStyle.getPropertyValue(property);

				for (const event of maintainEvents)
				{
					el.addEventListener('click', (e) => {
						// @ts-ignore: The event must be the same type as the function call, so it's safe to assume it's the same
						$(id)[event]?.(e);
					});
				}
			}
		}

		for (let child of Array.from(el.children))
			cleanNode(child);
	}

	const clone = element.cloneNode(true) as HTMLElement;
	cleanNode(clone);
	return clone;
}

GameguiCookbook.prototype.isTitleLocked = function(this: GameguiCookbook): boolean
{
	return (this.titlelock_element != undefined) && this.titlelock_element.childElementCount > 0;
}

GameguiCookbook.prototype.createTitleLock = function(this: GameguiCookbook): HTMLElement
{
	if (this.titlelock_element) return this.titlelock_element;

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.display_none { display: none !important; }';
	document.getElementsByTagName('head')[0].appendChild(style);
	
	let titlelockElement = document.createElement('div');
	titlelockElement.id = 'titlelock_wrap';
	titlelockElement.className = 'roundedboxinner';
	titlelockElement.style.display = 'none';
	document.getElementById('page-title')?.appendChild(titlelockElement);

	return this.titlelock_element = titlelockElement;
}


GameguiCookbook.prototype.lockTitleWithStatus = function(this: GameguiCookbook, status: string): void
{
	this.titlelock_element ??= this.createTitleLock();

	let statusElement = document.getElementById('titlelock_status_text');

	if (this.titlelock_element.childElementCount === 1 && statusElement) {
		statusElement.innerHTML = status;
		return;
	}

	this.titlelock_element.innerHTML = 
		'<div style="display:inline-block; padding-left: 22px; position:relative;">\
			<img src="https://studio.boardgamearena.com:8084/data/themereleases/240320-1000/img/logo/waiting.gif" style="width:22px; height: 22px; position:absolute; left:-22px;" class="imgtext">\
			<span id="titlelock_status_text">' + status + '</span>\
		</div>';
}

GameguiCookbook.prototype.lockTitleWithHTML = function(this: GameguiCookbook, html: string | HTMLElement): void
{
	this.titlelock_element ??= this.createTitleLock();

	if (html instanceof HTMLElement) {
		this.titlelock_element.innerHTML = '';
		this.titlelock_element.appendChild(html);
	}
	else {
		this.titlelock_element.innerHTML = html;
	}

	$('pagemaintitle_wrap').classList.add('display_none');
	$('gameaction_status_wrap').classList.add('display_none');
	this.titlelock_element.style.display = 'block';
}

GameguiCookbook.prototype.lockTitle = function(this: GameguiCookbook, target?: 'pagemaintitle_wrap' | 'gameaction_status_wrap'): void
{
	if (this.isTitleLocked()) return;
	console.log('Locking title');
	
	this.pushTitleLock(target);
}

GameguiCookbook.prototype.pushTitleLockFromStatus = function(this: GameguiCookbook, status: string): void
{
	this.titlelock_element ??= this.createTitleLock();

	this.pushTitleLockFromHTML(
		'<div><div style="display:inline-block; padding-left: 22px; position:relative;">\
			<img src="https://studio.boardgamearena.com:8084/data/themereleases/240320-1000/img/logo/waiting.gif" style="width:22px; height: 22px; position:absolute; left:-22px;" class="imgtext">\
			<span>' + status + '</span>\
		</div></div>');
}

GameguiCookbook.prototype.pushTitleLockFromHTML = function(this: GameguiCookbook, html: string | HTMLElement): void
{
	this.titlelock_element ??= this.createTitleLock();

	if (this.titlelock_element.childElementCount == 0)
	{
		$('pagemaintitle_wrap').classList.add('display_none');
		$('gameaction_status_wrap').classList.add('display_none');
		this.titlelock_element.style.display = 'block';
	}
	else {
		const lastChild = this.titlelock_element.lastElementChild as HTMLElement;
		lastChild.style.display = 'none';
	}

	dojo.place(html, this.titlelock_element);
}

GameguiCookbook.prototype.pushTitleLock = function(this: GameguiCookbook, target?: 'pagemaintitle_wrap' | 'gameaction_status_wrap'): void
{
	this.titlelock_element ??= this.createTitleLock();

	let elementCount = this.titlelock_element.childElementCount;
	if (elementCount != 0)
	{
		// Get the last child element and add a 'copycount' attribute to it
		const lastChild = this.titlelock_element.lastElementChild as HTMLElement;
		lastChild.setAttribute('copycount', (parseInt(lastChild.getAttribute('copycount') || '0') + 1).toString());
		return;
	}

	let element: HTMLElement | null;

	if (target) {
		element = document.getElementById(target);
	}
	else {
		element = document.getElementById('pagemaintitle_wrap');
		if (!element || element.style.display === 'none')
			element = document.getElementById('gameaction_status_wrap');
	}



	if (element && element.style.display !== 'none')
	{
		const containter = document.createElement('div');
		for (let child of Array.from(element.children))
			containter.appendChild(this.cloneHTMLWithoutIds(child, ...this.titleLock_maintainEvents || ['click']));

		this.pushTitleLockFromHTML(containter);
		return;
	}
}

GameguiCookbook.prototype.popTitleLockWithoutUpdate = function(this: GameguiCookbook): boolean
{
	if (!this.titlelock_element) return false;

	const lastChild = this.titlelock_element.lastElementChild;
	if (!lastChild) return false;

	const copyCount = parseInt(lastChild.getAttribute('copycount') || '0');

	if (copyCount > 0)
	{
		lastChild.setAttribute('copycount', (copyCount - 1).toString());
		return true;
	}

	lastChild.remove();
	return true;
}

GameguiCookbook.prototype.popTitleLock = function(this: GameguiCookbook): boolean
{
	if (!this.titlelock_element) return false;
	if (this.popTitleLockWithoutUpdate() == false) return false;

	if (this.titlelock_element.childElementCount == 0)
	{
		$('pagemaintitle_wrap').classList.remove('display_none');
		$('gameaction_status_wrap').classList.remove('display_none');
		this.titlelock_element.style.display = 'none';
	}
	else {
		const lastChild = this.titlelock_element.lastElementChild as HTMLElement;
		lastChild.style.display = 'block';
	}

	return true;
}

GameguiCookbook.prototype.removeTitleLocks = function(this: GameguiCookbook): void
{
	if (!this.titlelock_element) return;

	this.titlelock_element.innerHTML = '';
	$('pagemaintitle_wrap').classList.remove('display_none');
	$('gameaction_status_wrap').classList.remove('display_none');
	this.titlelock_element.style.display = 'none';
}