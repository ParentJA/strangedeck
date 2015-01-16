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