// @ts-nocheck
/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * ___YourGameName___ implementation : © ___developers___
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
/// <amd-module name="bgagame/___yourgamename___"/>

import Gamegui = require('ebg/core/gamegui');
import "ebg/counter";

/** The root for all of your game code. */
class ___YourGameName___ extends Gamegui
{
	// myGlobalValue: number = 0;
	// myGlobalArray: string[] = [];

	/** @gameSpecific See {@link Gamegui} for more information. */
	constructor(){
		super();
		console.log('___yourgamename___ constructor');
	}

	/** @gameSpecific See {@link Gamegui.setup} for more information. */
	override setup(gamedatas: Gamedatas): void
	{
		console.log( "Starting game setup" );
		
		// Setting up player boards
		for( var player_id in gamedatas.players )
		{
			var player = gamedatas.players[player_id];
			// TODO: Setting up players boards if needed
		}
		
		// TODO: Set up your game interface here, according to "gamedatas"

		// Setup game notifications to handle (see "setupNotifications" method below)
		this.setupNotifications();

		console.log( "Ending game setup" );
	}

	///////////////////////////////////////////////////
	//// Game & client states
	
	/** @gameSpecific See {@link Gamegui.onEnteringState} for more information. */
	override onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void
	{
		console.log( 'Entering state: '+stateName );
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
	override onLeavingState(stateName: GameStateName): void
	{
		console.log( 'Leaving state: '+stateName );
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
	override onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
	{
		console.log( 'onUpdateActionButtons: ' + stateName, args );

		if(!this.isCurrentPlayerActive())
			return;

		switch( stateName )
		{
		case 'dummmy':
			// Add buttons if needed
			break;
		}
	}

	///////////////////////////////////////////////////
	//// Utility methods
	
	/*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/


	///////////////////////////////////////////////////
	//// Player's action
	
	/*
		Here, you are defining methods to handle player's action (ex: results of mouse click on game objects).
		
		Most of the time, these methods:
		- check the action is possible at this game state.
		- make a call to the game server
	*/
	
	/*
	Example:
	onMyMethodToCall1( evt: Event )
	{
		console.log( 'onMyMethodToCall1' );

		// Preventing default browser reaction
		evt.preventDefault();

		//	With base Gamegui class...

		// Check that this action is possible (see "possibleactions" in states.inc.php)
		if(!this.checkAction( 'myAction' ))
			return;

		this.ajaxcall( "/yourgamename/yourgamename/myAction.html", { 
			lock: true, 
			myArgument1: arg1,
			myArgument2: arg2,
		}, this, function( result ) {
			// What to do after the server call if it succeeded
			// (most of the time: nothing)
		}, function( is_error) {

			// What to do after the server call in anyway (success or failure)
			// (most of the time: nothing)
		} );


		//	With GameguiCookbook::Common...
		this.ajaxAction( 'myAction', { myArgument1: arg1, myArgument2: arg2 }, (is_error) => {} );
	}
	*/

	///////////////////////////////////////////////////
	//// Reaction to cometD notifications

	/** @gameSpecific See {@link Gamegui.setupNotifications} for more information. */
	override setupNotifications()
	{
		console.log( 'notifications subscriptions setup' );
		
		// TODO: here, associate your game notifications with local methods
		
		// With base Gamegui class...
		// dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

		// With GameguiCookbook::Common class...
		// this.subscribeNotif( 'cardPlayed', this.notif_cardPlayed ); // Adds type safety to the subscription
	}

	/*
	Example:
	
	// The argument here should be one of there things:
	// - `Notif`: A notification with all possible arguments defined by the NotifTypes interface. See {@link Notif}.
	// - `NotifFrom<'cardPlayed'>`: A notification matching any other notification with the same arguments as 'cardPlayed' (A type can be used here instead). See {@link NotifFrom}.
	// - `NotifAs<'cardPlayed'>`: A notification that is explicitly a 'cardPlayed' Notif. See {@link NotifAs}.
	notif_cardPlayed( notif: NotifFrom<'cardPlayed'> )
	{
		console.log( 'notif_cardPlayed', notif );
		// Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
	}
	*/
}


// The global 'bgagame.___yourgamename___' class is instantiated when the page is loaded. The following code sets this variable to your game class.
dojo.setObject( "bgagame.___yourgamename___", ___YourGameName___ );
// Same as: (window.bgagame ??= {}).___yourgamename___ = ___YourGameName___;