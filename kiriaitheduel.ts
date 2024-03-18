/// <reference path="kiriaitheduel.d.ts" />
/// <reference path="cookbook/common.ts" />
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * KiriaiTheDuel implementation : © Nevin Foster - nevin.foster2@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
class KiriaiTheDuel extends GameguiCookbook
{
	constructor() {
		super();
		console.log('kiriaitheduel:', this);
	}

	setup(gamedatas: Gamedatas)
	{
		console.log( "Starting game setup", gamedatas );

		// Setup game notifications to handle (see "setupNotifications" method below)
		this.setupNotifications();

		for (let i = 1; i < 14; i++) {
			dojo.connect($('cardontable_' + i), 'onclick', this, 'onCardClick');
		}

		dojo.connect($('confirmSelectionButton'), 'onclick', this, 'confirmPlayedCards');

		this.updateAll();

		console.log( "Ending game setup" );
	}

	///////////////////////////////////////////////////
	//// Game & client states

	onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void
	{
		console.log( 'Entering state: '+ stateName, args );
		
		switch( stateName )
		{
		
		/* Example:
		
		case 'myGameState':
		
			// Show some HTML block at this game state
			dojo.style( 'my_html_block_id', 'display', 'block' );
			
			break;
		*/
		
		
		default:
			break;
		}
	}

	onLeavingState(stateName: GameStateName): void
	{
		console.log( 'Leaving state: '+ stateName );
		
		switch( stateName )
		{
		default:
			break;
		}
	}

	onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
	{
		console.log( 'onUpdateActionButtons: '+stateName, args );

		if( this.isCurrentPlayerActive() )
		{
			switch( stateName )
			{
			}
		}
	}

	///////////////////////////////////////////////////
	//// Utility methods

	getCardUniqueId = (isRed: boolean, card_type: number): number =>
	{
		if (card_type == -1) return 12;
		else if (isRed) return (card_type < 5) ? card_type : card_type + 5
		else return card_type + 5;
	}

	revealCard = (back_card_id: number, new_card_id: number) =>
	{

		this.placeOnObject('cardontable_' + new_card_id, 'cardontable_' + back_card_id);

		dojo.destroy('cardontable_' + back_card_id);
			// Maybe return this to a hidden area?
	}

	moveCard = (card_id: number, to: string | HTMLElement) =>
	{
		console.log('Moving card ' + card_id + ' to ' + to + '.');

		if (card_id == -1) return;

		let target = $('cardontable_' + card_id);
		let divTo = $(to);

		if (target == null)
		{
			console.log('Div "' + 'cardontable_' + card_id + '" does not exist.');
			return;
		}

		if (divTo == null)
		{
			console.log('Div "' + to + '" does not exist.');
			return;
		}

		// Calculate the position of the target relative to divTo
		let targetPosition = target.getBoundingClientRect();
		let divToPosition = divTo.getBoundingClientRect();

		let relativePosition = {
			top: targetPosition.top - divToPosition.top,
			left: targetPosition.left - divToPosition.left
		};

		dojo.place(target, divTo);

		dojo.style(target, 'top', relativePosition.top + 'px');
		dojo.style(target, 'left', relativePosition.left + 'px');

		this.slideToObject('cardontable_' + card_id, to).play();
	}

	updateAll = () =>
	{
		this.placeAllCards();
		this.updateFlippedStatus();
		this.updateStance();
		this.updatePosition();

		for (let id in this.gamedatas.state.damage)
		{
			$(id + "_damage").innerHTML = this.gamedatas.state.damage[id];
		}
	}

	placeAllCards = () =>
	{
		const cards = this.gamedatas.state.cards;
		for (let i in cards) // i = 'redHand', 'blueHand', 'redPlayed'...
			for (let j in cards[i]) // j = 0, 1 [, 2, 3, 4, 5]
				this.moveCard(cards[i][j], i + "_" + j);
	}

	updateFlippedStatus = () =>
	{
		// There are only 4 cards that have a flipped state, so we can manually check the specific cards rather than the played cards. The prevents having to
		const flippedState = this.gamedatas.state.flippedState;
		let cardIds = [1, 2, 6, 7];
		for (let i in cardIds)
		{
			let cardId = cardIds[i];
			let cardDiv = $('cardontable_' + cardId);
			let state = flippedState[(cardDiv.parentNode as Element).id + '_Flipped'];

			// If undefined or not 0/1, remove the topPicked/bottomPicked class. If 0, add topPicked. If 1, add bottomPicked.

			if (state == undefined || (state != 0 && state != 1)) {
				dojo.removeClass(cardDiv, 'topPicked');
				dojo.removeClass(cardDiv, 'bottomPicked');
			}
			else if (state == 0) {
				dojo.addClass(cardDiv, 'topPicked');
				dojo.removeClass(cardDiv, 'bottomPicked');
			}
			else {
				dojo.addClass(cardDiv, 'bottomPicked');
				dojo.removeClass(cardDiv, 'topPicked');
			}
		}
	}

	updateStance = () =>
	{
		const stances = this.gamedatas.state.stances;
		for (let id in stances)
		{
			let div = $(id);
			if (div == null)
			{
				console.log('Div "' + id + '" does not exist.');
				continue;
			}

			if (stances[id] == 0)
			{
				dojo.addClass(div, 'heaven_stance');
				dojo.removeClass(div, 'earth_stance');
			}
			else
			{
				dojo.addClass(div, 'earth_stance');
				dojo.removeClass(div, 'heaven_stance');
			}
		}
	}

	updatePosition = () =>
	{
		const positions = this.gamedatas.state.positions;
		for (let id in positions)
		{
			let div = $(id);
			let divFrom = div.parentNode as HTMLElement;
			let divTo = $(id + "_field_position_" + positions[id]);

			dojo.place(div, divTo);

			this.placeOnObject(div, divFrom);
			this.slideToObject(div, divTo).play();
		}
	}

	///////////////////////////////////////////////////
	//// Player's action

	onCardClick = ( evt: MouseEvent ) =>
	{
		let target = evt.target as Element;
		let parent = target.parentNode as Element;

		let card_id = +target.id.split('_')[1];

		// If parent contains 'hand' text, then playCardFromHand
		if (parent.id.includes('Hand')) {
			// we need to know if the top half or bottom half was clicked
			let rect = target.getBoundingClientRect();
			let y = evt.clientY - rect.top;
			let clickedTopHalf = y < rect.height / 2;
			this.playCardFromHand(card_id, clickedTopHalf);
		}
		else if (parent.id.includes('Played')) {
			this.returnCardToHand(card_id);
		}
		else {
			console.log('Card is not in the hand or played cards.', evt);
		}
	}

	playCardFromHand = ( card_id: number, clickedTopHalf: boolean ) =>
	{
		if (!this.checkAction('pickedCards')) {
			console.log('It is not time to play cards.');
			return;
		}

		let playerType = this.player_id == this.gamedatas.redPlayer ? 'red' : 'blue';
		let card_div = $('cardontable_' + card_id);

		// Make sure the parent is one of the hand slots
		if (!(card_div.parentNode as Element).id.startsWith(playerType + "Hand"))
		{
			console.log('Card is not in the hand.');
			return;
		}

		// Check if the <playerType>FirstCard div is empty
		let isFirstOpen = $(playerType + 'Played_0').childNodes.length == 0;
		let isSecondOpen = $(playerType + 'Played_1').childNodes.length == 0;

		if (!isFirstOpen && !isSecondOpen) {
			console.log('Both cards are already played! Must choose one to return before playing another.');
			return;
		}

		let flippableCards = [1, 2, 6, 7];
		if (flippableCards.includes(card_id)) {
			if (clickedTopHalf) {
				dojo.addClass(card_div, 'topPicked');
				dojo.removeClass(card_div, 'bottomPicked');
			}
			else {
				dojo.addClass(card_div, 'bottomPicked');
				dojo.removeClass(card_div, 'topPicked');
			}
		}
		
		if (isFirstOpen) {
			this.moveCard(card_id, playerType + 'Played_0');
			return;
		}

		if (isSecondOpen) {
			this.moveCard(card_id, playerType + 'Played_1');
			return;
		}
	}

	returnCardToHand = (card_id: number) =>
	{
		if (!this.checkAction('pickedCards')) {
			console.log('It is not time to return cards.');
			return;
		}

		let playerType = this.player_id == this.gamedatas.redPlayer ? 'red' : 'blue';
		let card_div = $('cardontable_' + card_id);

		// Make sure the parent is one of the hand slots
		if (!(card_div.parentNode as Element).id.startsWith(playerType + "Played_"))
		{
			console.log('Card is not in the played cards.');
			return;
		}

		// Remove the topPicked/bottomPicked classes
		dojo.removeClass(card_div, 'topPicked');
		dojo.removeClass(card_div, 'bottomPicked');

		// Now, find the first empty hand slot and move the card there (_0, _1, _2, _3)

		let handSlotId = playerType + 'Hand_';
		for (let i = 0; i < 6; i++) {
			if ($(handSlotId + i).childNodes.length == 0) {
				this.moveCard(card_id, handSlotId + i);
				return;
			}
		}

		console.log('No empty hand slots!');
	}

	confirmPlayedCards = () =>
	{
		if (!this.checkAction('pickedCards')) {
			console.log('It is not time to confirm cards.');
			return;
		}

		let playerType = this.player_id == this.gamedatas.redPlayer ? 'red' : 'blue';
		let firstCard = $(playerType + 'Played_0').children[0];
		let secondCard = $(playerType + 'Played_1').children[0];

		if (firstCard == null || secondCard == null) {
			console.log('Both cards must be played before confirming.');
			return;
		}

		let firstCardId = +firstCard.id.split('_')[1];
		let secondCardId = +secondCard.id.split('_')[1];

		// If the first card or second card has the bottomPicked class, negate the card id
		if (dojo.hasClass(firstCard, 'bottomPicked'))
			firstCardId = -firstCardId;
		if (dojo.hasClass(secondCard, 'bottomPicked'))
			secondCardId = -secondCardId;

		this.ajaxAction('pickedCards', {
			firstCard : firstCardId,
			secondCard : secondCardId,
		});
	}

	
	///////////////////////////////////////////////////
	//// Reaction to cometD notifications

	setupNotifications()
	{
		console.log( 'notifications subscriptions setup' );

		this.subscribeNotif('playCards',       this.notif_placeAllCards);
		this.subscribeNotif('cardsResolved',   this.notif_placeAllCards);
		this.subscribeNotif('drawSpecialCard', this.notif_placeAllCards);
		this.subscribeNotif('cardsPlayed',     this.notif_cardsPlayed);
		this.subscribeNotif('cardFlipped',     this.notif_cardFlipped);

		this.notifqueue.setSynchronous( 'playCards', 3000 );
		this.notifqueue.setSynchronous( 'cardsResolved', 3000 );
		this.notifqueue.setSynchronous( 'drawSpecialCard', 3000 );
		this.notifqueue.setSynchronous( 'cardFlipped', 1000 );
	}
	// TODO: from this point and below, you can write your game notifications handling methods

	notif_placeAllCards = (notif: Notif<{ state: StateData}>) =>
	{
		console.log('notif_placeAllCards', notif);
		this.gamedatas.state = notif.args.state;
		this.updateAll();
	}
	
	notif_cardsPlayed = function(notif) {
		// Show placeholder for the played cards?
	}

	notif_cardFlipped = (notif: Notif<{ back_card_id: number; card_id: number }>) => {
		this.revealCard(notif.args.back_card_id, notif.args.card_id);
	}
}
