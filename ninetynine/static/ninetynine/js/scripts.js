var FACES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
var SUITS = ["S", "H", "C", "D"];

function Card(face, suit) {
	this._face = face;
	this._suit = suit;
}

Card.prototype.face = function() {
	return this._face;
};

Card.prototype.suit = function() {
	return this._suit;
}

Card.prototype.value = function() {
	var value = parseInt(this._face);

	if (isNaN(value)) {
		if (this._face === "A") {
			value = 1;
		}
		else {
			value = 10;
		}
	}

	return value;
}

Card.prototype.toString = function() {
	return this._face + this._suit;
};

function Deck() {
	this._cards = [];
}

Deck.createDeck = function(faces, suits) {
	console.log("Create deck...");

	var deck = new Deck();

	for (var i = 0, numFaces = faces.length; i < numFaces; i++) {
		var face = faces[i];

		for (var j = 0, numSuits = suits.length; j < numSuits; j++) {
			var suit = suits[j];
			var card = new Card(face, suit);

			deck.pushCard(card);
		}
	}

	return deck;
};

Deck.prototype.cards = function() {
	return this._cards;
};

Deck.prototype.pushCard = function(card) {
	this._cards.push(card);
};

Deck.prototype.popCard = function() {
	return this._cards.pop();
};

Deck.prototype.size = function() {
	return this._cards.length;
};

Deck.prototype.isEmpty = function() {
	return (this._cards.length == 0);
};

Deck.prototype.shuffle = function() {
	var pile = [];

	while (this._cards.length > 0) {
		var index = Math.floor(Math.random() * this._cards.length);
		var card = this._cards.splice(index, 1)[0];

		pile.push(card);
	}

	this._cards = pile;
};

Deck.prototype.toString = function() {
	var cardStrings = [];

	for (var i = 0, numCards = this._cards.length; i < numCards; i++) {
		cardStrings.push(this._cards[i].toString());
	}

	return cardStrings.join(", ");
};

function Player(name) {
	this._hand = new Deck();
}

Player.prototype.hand = function() {
	return this._hand;
}

Player.prototype.clearHand = function() {
	this._hand = new Deck();
};

Player.prototype.addCardToHand = function(card) {
	this._hand.pushCard(card);
};

function Game() {
	this._playDeck = null;
	this._pullDeck = null;
	this._players = [];

	//Reset the game...
	this.reset();
}

Game.prototype.reset = function() {
	console.log("Reset...");

	//Reset deck...
	this._playDeck = new Deck();
	this._pullDeck = Deck.createDeck(FACES, SUITS);
	this._pullDeck.shuffle();

	//Reset players' hands...
	for (var i = 0, numPlayers = this._players.length; i < numPlayers; i++) {
		var player = this._players[i];

		player.clearHand();
	}
};

Game.prototype.addPlayer = function(player) {
	this._players.push(player);
};

Game.prototype.deal = function(numCards) {
	console.log("Deal...");

	for (var i = 0; i < numCards; i++) {
		var card = this._pullDeck.popCard();

		for (var j = 0, numPlayers = this._players.length; j < numPlayers; j++) {
			var player = this._players[j];
			player.addCardToHand(card);
		}
	}
};

Game.prototype.start = function(callback) {
	console.log("Start...");

	this.reset();
	this.deal(3);

	callback.call(this);
};

var playerName = null;
var game = null;

function updatePlayer(player) {

}

function updateHand(player) {

}

$(function() {
	$("#id-start-button").on("click", function() {
		//Hide the start view...
		$("#id-start-view").hide();

		//Show the play view...
		$("#id-play-view").removeClass("hide");
	});

	$("#id-name-input").on("change keyup", function() {
		var value = $(this).val();
		var isValid = (value && value.length > 0);

		$("#id-play-button").prop("disabled", !isValid);
	});

	$("#id-play-button").on("click", function() {
		//Hide the play view...
		$("#id-play-view").hide();

		playerName = $("#id-name-input").val();

		$("#id-player-media").find(".media-heading").text(playerName);

		var computer = new Player("Computer");
		var player = new Player(playerName);

		game = new Game();
		game.addPlayer(computer);
		game.addPlayer(player);
		game.start(function() {
			var $handTable = $("#id-hand-panel").find("table").find("tbody").empty();

			var html = [];

			console.log(player.hand().cards());

			$.each(player.hand().cards(), function(index, value) {
				html.push("<tr class='card'><td>" + value.toString() + "</td><td>" + value.value() + "</td></tr>");
			});

			$handTable.html(html.join(""));
		});

		//Show the game view...
		$("#id-game-view").removeClass("hide");
	});

	$("body").on("click", ".card", function() {
		//Remove card from hand...
		//Check if card is a valid play...
		//If valid play: adjust score and pull new card from pull deck
		//Add card to play deck...
		//Change turn to opposite player...
	});
});

function Game() {
	this._players = [];
	this._currentPlayer = null;
	this._score = 0;
	this._drawPile = new Pile();
	this._playPile = new Pile();
	this._dealer = null;
}

Game.MAX_NUM_PLAYERS = 6;
Game.STARTING_HAND_SIZE = 3;

-- CREATE GAME --

Game.prototype.create = function() {

};

// Create Game...

// Add Player...
Game.prototype.addPlayer = function(player) {
	if (this._players.length < Game.MAX_NUM_PLAYERS) {
		this._players.push(player);
	}
	else {
		throw new Error("This game already has the maximum number of players.");
	}
};

-- RESET GAME --

Game.prototype.reset = function() {
	//Reset score...
	this._score = 0;

	//Clear draw pile...
	this._drawPile.clearCards();

	//Clear play pile...
	this._playPile.clearCards();

	//Clear player hands...
	$.each(this._players, function(index, player) {
		player.clearHand();
	});

	//Assign dealer randomly...
	this._dealer = this._players[Math.round(Math.random() * this._players.length)];

	//Create deck...
	var deck = Deck.createStandardDeck();

	//Shuffle deck...
	deck.shuffle();

	//Deal cards to players one at a time, dealing the dealer last...
	this.setCurrentPlayer(this._dealer);

	var numCardsToDeal = this._players.length * Game.STARTING_HAND_SIZE;

	while (numCardsToDeal > 0) {
		this._currentPlayer = this.getNextPlayer();
		this._currentPlayer.addCardToHand(deck.removeLastCard());
	}

	//Add cards to draw pile...
	while (!deck.isEmpty()) {
		this._drawPile.addLastCard(deck.removeFirstCard());
	}
};

//TODO: Do we need this?
Game.prototype.getCurrentPlayer = function() {
	return this._currentPlayer;
};

//TODO: Do we need this?
Game.prototype.setCurrentPlayer = function(value) {
	this._currentPlayer = value;
};

Game.prototype.getNextPlayer = function() {
	var currentPlayerIndex = this._players.indexOf(this._currentPlayer);

	if (currentPlayerIndex < this._players.length - 1) {
		return this._players[currentPlayerIndex + 1];
	}
	else {
		return 0;
	}
};

// Set Current Player as Player after Dealer...

-- START GAME --

Game.prototype.start = function() {

};

// Select 'best' Card from Player's Hand...
player = getCurrentPlayer()
player.getBestCard(currentScore)

// Calculate value of each card...
cardValues = []

for each card in player.getHand():
	// Evaluate card value according to rules...
	value = game.getCardValue(card)
	cardValues.push({card: card, value: value}})

// Check if any value gets the score to 99...
valueNeededToWin = 99 - currentScore

for value in cardValues:
	if value == valueNeededToWin:
		return card

// Reverse sort cards by value, lowest value last...
cardValues.sortOn(value, DESCENDING)

// Return highest value valid card (revisit this logic to account for next player's move)...
for each card in cardValues:
	if card.value <= valueNeededToWin:
		return card

return null

// Remove card from player's hand...

// Add to play pile...

// Play Card...
isLegalPlay = game.playCard(card)

// Evaluate card value according to rules...

// Evaluate legal play (legal play adjusts the score, illegal play does nothing to the score but player cannot draw a card)...
if isLegalPlay:
	// Update score...
	game.updateScore()

	// Check to see if game has ended...
	if game.isEnded():
		// Add win to current player...
		// Exit game and go to win screen...
		return

	else:
		player.addCardToHand(drawPile.removeLastCard())

		// Set next player as current player...
		game.setCurrentPlayer(game.getNextPlayer())

		// Goto top (-- START GAME --)...