// @ts-nocheck
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * ___YourGameName___ implementation : © ___developer-names___ ___developer-emails___
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

/**
 * In this file, you are describing the logic of your user interface, in Typescript language.
 * 
 * @file Including any *.ts files will import all defined variables and classes (*.d.ts file can only have declared types which are omitted). This will include any game specific files or cookbook modules here.
 * 
 * If you are unsure about what code is being added to the output file, you can always check the output after running the typescript compiler. If you are referencing functions/variables that are not included by reference tags, you will always get a typescript error (so don't worry about missing imports).
 * @example
 * /// <reference path="../template/client/cookbook/common.ts" />
 * /// <reference path="actions/yourgamename_actions.d.ts" />
*/
/// <reference path="___yourgamename___.d.ts" />

/**
 * Creates an alias for your game name. Not necessary but helps for clarity.
 * In addition, this lets you create a pseudo partial class using interfaces and prototype overriding. See below or {@link GameguiCookbook} for more information.
 * 
 * Extend the {@link GameguiCookbook} to have access to several {@link https://en.doc.boardgamearena.com/BGA_Studio_Cookbook: Cookbook} methods.
 * @example
 * // yourgamename_actions.ts
 * interface YourGameName {
 * 	exampleAction(evt: any): void;
 * }
 * 
 * YourGameName.prototype.exampleAction = function(this: YourGameName, evt: Event) {
 * 	evt.preventDefault();
 * 	console.log('exampleAction');
 * }
 * 
 * // This file:
 * /// <reference path="yourgamename_actions.d.ts" />
 * 
 * class YourGameName {
 * 	onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
 * 		this.addActionButton( 'button_1_id', _('Example Action'), this.exampleAction);
 * 	}
 * }
 */
interface ___YourGameName___ extends Gamegui {}

/** The root for all of your game code. */
class ___YourGameName___
{
	/** @gameSpecific See {@link Gamegui} for more information. */
	constructor(){
		console.log('___yourgamename___ constructor');
		// this.myGlobalValue = 0;
	}

	/** @gameSpecific See {@link Gamegui.setup} for more information. */
	setup(gamedatas: Gamedatas): void
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
	onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void
	{
		console.log( 'Entering state: '+stateName );
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
	onLeavingState(stateName: GameStateName): void
	{
		console.log( 'Leaving state: '+stateName );
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
	onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
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
	setupNotifications()
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