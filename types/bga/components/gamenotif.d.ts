/** The interface used for modifying how notifications are synchronized/sequenced or if they should be filtered/ignored. */
interface GameNotif {
	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * 
	 * IMPORTANT: Remember that this notification is ignored on the client side, but was still received by the client. Therefore it shouldn't contain any private information as cheaters can get it. In other words this is not a way to hide information.
	 * IMPORTANT: When a game is reloaded with F5 or when opening a turn based game, old notifications are replayed as history notification. They are used just to update the game log and are stripped of all arguments except player_id, i18n and any argument present in message. If you use and other argument in your predicate you should preserve it as explained here.
	 * @param notif_type The type of the notification.
	 * @param predicate A function that will receive notif object and will return true if this specific notification should be ignored.
	 * @example this.notifqueue.setIgnoreNotificationCheck( 'dealCard', (notif) => (notif.args.player_id == this.player_id) );
	 */
	setIgnoreNotificationCheck: <T extends keyof NotifTypes>(notif_type: T, predicate: ((notif: Notif<NotifTypes[T]>) => boolean)) => void;

	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * @param notif_type The type of the notification.
	 * @param duration The duration in milliseconds to wait after executing the notification handler.
	 * @example
	 * // Here's how we do this, right after our subscription:
	 * dojo.subscribe( 'playDisc', this, "notif_playDisc" );
	 * this.notifqueue.setSynchronous( 'playDisc', 500 );   // Wait 500 milliseconds after executing the playDisc handler
	 * @example
	 * // For this case, use setSynchronous without specifying the duration and use setSynchronousDuration within the notification callback.
	 * // NOTE: If you forget to invoke setSynchronousDuration, the game will remain paused forever!
	 * setupNotifications: function () {
	 * 	dojo.subscribe( 'cardPlayed', this, 'notif_cardPlayed' );
	 * 	this.notifqueue.setSynchronous( 'cardPlayed' ); // wait time is dynamic
	 * 	...
	 * },
	 * notif_cardPlayed: function (notif) {
	 * 	// MUST call setSynchronousDuration
	 * 	// Example 1: From notification args (PHP)
	 * 	this.notifqueue.setSynchronousDuration(notif.args.duration);
	 * 	...
	 * 	// Or, example 2: Match the duration to a Dojo animation
	 * 	var anim = dojo.fx.combine([
	 * 	...
	 * 	]);
	 * 	anim.play();
	 * 	this.notifqueue.setSynchronousDuration(anim.duration);
	 * },
	 */
	setSynchronous: (notif_type: keyof NotifTypes, duration?: number) => void;

	/**
	 * This method will set a check whether any of notifications of specific type should be ignored.
	 * @param duration The duration in milliseconds to wait after executing the notification handler.
	 * @see {@link setSynchronous}
	 */
	setSynchronousDuration: (duration: number) => void;
}