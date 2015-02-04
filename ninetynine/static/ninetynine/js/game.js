function Player(name, photo, isComputer) {
	this._name = name;
	this._photo = photo;
	this._isComputer = isComputer;
	this._hand = new Hand();
}

Player.prototype.name = function() {
	return this._name;
};

Player.prototype.photo = function() {
	return this._photo;
};

Player.prototype.isComputer = function() {
	return this._isComputer;
};

Player.prototype.handSize = function() {
	return this._hand.size();
};

Player.prototype.isHandEmpty = function() {
	return this._hand.isEmpty();
};

Player.prototype.getCardInHand = function(index) {
	return this._hand.getCard(index);
};

Player.prototype.setCardInHand = function(index, card) {
	this._hand.setCard(index, card);
};

Player.prototype.addCardToHand = function(card) {
	this._hand.addLastCard(card);
};

Player.prototype.removeCardFromHand = function(index) {
	return this._hand.removeCard(index);
};

Player.prototype.clearHand = function() {
	while (!this._hand.isEmpty()) {
		this._hand.removeLastCard();
	}
};

function Game(rules) {
	this._score = 0;
	this._drawPile = new Pile();
	this._playPile = new Pile();
	this._players = [];
	this._currentPlayer = null;
	this._dealer = null;
	this._rules = rules || [];
}

Game.MAX_NUM_PLAYERS = 4;
Game.STARTING_HAND_SIZE = 3;

Game.getStandardRules = function() {
	return [
		function(card) {
			var face = card.face();
			var suit = card.suit();

			if (face == "K" && (suit == "H" || suit == "D")) {
				return null;
			}
			else {
				return {
					"2": 2,
					"3": 3,
					"4": 4,
					"5": 5,
					"6": 6,
					"7": 7,
					"8": 8,
					"9": 9,
					"T": 10,
					"J": 10,
					"Q": 10,
					"K": 10,
					"A": 1
				}[face];
			}
		},
		function(card) {
			var face = card.face();
			var suit = card.suit();

			if (face == "K" && (suit == "H" || suit == "D")) {
				return -10;
			}
			else {
				return null;
			}
		}
	];
};

Game.prototype.score = function() {
	return this._score;
};

Game.prototype.numPlayers = function() {
	return this._players.length;
};

Game.prototype.hasPlayers = function() {
	return this._players.length > 0;
};

Game.prototype.getPlayer = function(index) {
	return this._players[index];
};

Game.prototype.setPlayer = function(index, player) {
	this._players[index] = player;
};

Game.prototype.addPlayer = function(player) {
	if (Game.hasOwnProperty("MAX_NUM_PLAYERS") && 
		this._players.length == Game.MAX_NUM_PLAYERS) 
	{
		throw new RangeError("This game has the maximum number of players.");
	}
	else {
		this._players.push(player);
	}
};

Game.prototype.removePlayer = function(index) {
	return this._players.splice(index, 1)[0];
};

Game.prototype.getCurrentPlayer = function() {
	return this._currentPlayer;
};

Game.prototype.setCurrentPlayer = function(value) {
	this._currentPlayer = value;
};

Game.prototype.getNextPlayer = function() {
	var currentPlayerIndex = this._players.indexOf(this._currentPlayer);

	if (currentPlayerIndex < this._players.length - 1) {
		return this._players[currentPlayerIndex + 1];
	}
	else {
		return this._players[0];
	}
};

Game.prototype.getDealer = function() {
	return this._dealer;
};

Game.prototype.setDealer = function(value) {
	this._dealer = value;
};

Game.prototype.addRule = function(rule) {
	this._rules.push(rule);
};

Game.prototype.removeRule = function(index) {
	return this._rules.splice(index, 1)[0];
};

Game.prototype.reset = function(rules) {
	this._score = 0;

	//Clear draw pile...
	while (!this._drawPile.isEmpty()) {
		this._drawPile.removeLastCard();
	}

	//Clear play pile...
	while (!this._playPile.isEmpty()) {
		this._playPile.removeLastCard();
	}

	//Clear players' hands...
	$.each(this._players, function(index, player) {
		player.clearHand();
	});

	var deck = Deck.createStandardDeck();
	deck.shuffle();

	if (this._currentPlayer == null) {
		this._dealer = this._players[Math.floor(Math.random() * this._players.length)];
	}
	else {
		this._dealer = this.getNextPlayer();
	}

	this._currentPlayer = this._dealer;

	//Deal cards to players...
	var numCardsToDeal = this._players.length * Game.STARTING_HAND_SIZE;

	while (numCardsToDeal > 0) {
		this._currentPlayer = this.getNextPlayer();
		this._currentPlayer.addCardToHand(deck.removeLastCard());

		numCardsToDeal--;
	}

	//Add remaining cards in deck to draw pile...
	while (!deck.isEmpty()) {
		this._drawPile.addLastCard(deck.removeFirstCard());
	}

	//Reset rules...
	this._rules = rules || [];
};

Game.prototype.getCardValue = function(card) {
	for (var i = 0, numRules = this._rules.length; i < numRules; i++) {
		var rule = this._rules[i];
		var value = rule.call(this, card);

		if (value) {
			return value;
		}
	}

	return 0;
};

Game.prototype.hasLegalPlay = function(player) {
	for (var i = 0, numCards = player.handSize(); i < numCards; i++) {
		var card = player.getCardInHand(i);
		var value = this.getCardValue(card);

		if (this._score + value <= 99) {
			return true;
		}
	}

	return false;
};

Game.prototype.isLegalPlay = function(card) {
	return (this._score + this.getCardValue(card) <= 99);
};

Game.prototype.getBestPlay = function(player) {
	var cardValues = [];
	var numCards = player.handSize();

	for (var i = 0; i < numCards; i++) {
		var card = player.getCardInHand(i);
		var value = this.getCardValue(card);

		cardValues.push({
			card: card,
			value: value
		});
	}

	//Best play is the card that gets the score to 99...
	for (var j = 0; j < numCards; j++) {
		var card = cardValues[j];
		var value = card.value;

		if (this._score + value === 99) {
			return card.card;
		}
	}

	//Next best play is the highest card if it will bring the score below 99...
	cardValues.sort(function(a, b) {
		if (a.value < b.value) {
			return -1;
		}

		if (a.value > b.value) {
			return 1;
		}

		return 0;
	});

	cardValues.reverse();

	for (var k = 0; k < numCards; k++) {
		var card = cardValues[k];
		var value = card.value;

		if (this._score + value < 99) {
			return card.card;
		}
	}

	//Return a random card...
	return cardValues[Math.floor(Math.random() * cardValues.length)].card;
};

Game.prototype.playCard = function(player, index) {
	var card = player.getCardInHand(index);

	player.removeCardFromHand(index);

	this._playPile.addLastCard(card);

	//Evaluate play...
	var value = this.getCardValue(card);

	var isLegalPlay = (this._score + value <= 99);

	if (isLegalPlay) {
		this._score += value;

		if (this._score === 99) {
			return true;
		}
		else {
			//Draw a card...
			player.addCardToHand(this._drawPile.removeLastCard());

			//Switch players...
			this._currentPlayer = this.getNextPlayer();
		}
	}

	return false;
};