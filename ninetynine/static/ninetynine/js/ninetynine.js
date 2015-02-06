//TODO: Placeholder for empty play pile...
//TODO: Ability for winning player to add a rule after each game...
//TODO: Increment wins for players...
//TODO: Play limit to 9 total plays...
//TODO: Start button...
//TODO: Ability to sign in with Google/Facebook/Twitter to use profile name/photo...
//TODO: Start screen where user can enter name and upload a photo...

$(function() {
	var game = createGame();

	function getRandomPlayer(isComputer) {
		var players = [{
			name: "Austin Spencer",
			url: "/static/strangedeck/img/austin_spencer.jpg"
		}, {
			name: "Krin Alvarez",
			url: "/static/strangedeck/img/krin_alvarez.jpg"
		}, {
			name: "Nina Craig",
			url: "/static/strangedeck/img/nina_craig.jpg"
		}, {
			name: "Randy Adams",
			url: "/static/strangedeck/img/randy_adams.jpg"
		}, {
			name: "Tina Thomas",
			url: "/static/strangedeck/img/tina_thomas.jpg"
		}, {
			name: "Vincent Ellis",
			url: "/static/strangedeck/img/vincent_ellis.jpg"
		}];

		var player = players[Math.floor(Math.random() * players.length)];

		return new Player(player.name, player.url, isComputer);
	}

	function getAnonymousPlayer() {
		var players = [{
			name: "Anonymous",
			url: "/static/strangedeck/img/anonymous_male.jpg"
		}, {
			name: "Anonymous",
			url: "/static/strangedeck/img/anonymous_female.jpg"
		}];

		var player = players[Math.floor(Math.random() * players.length)];

		return new Player(player.name, player.url, false);
	}

	function findElementsByData(selector, data) {
		return $(selector).filter(function() {
			var $this = $(this), hasData = true;

			$.each(data, function(key, value) {
				hasData = (hasData && $this.data(key) == value);
			});

			return hasData;
		});
	}

	function initializePlayer(selector, player) {
		var $panel = $(selector);
		$panel.find(".media-heading").text(player.name());
		$panel.find(".panel-image").attr("src", player.photo());
		$panel.data({
			playerName: player.name(),
			isComputer: player.isComputer()
		});

		return player;
	}

	function createGame() {
		var game = new Game();
		game.addPlayer(initializePlayer("#player1-panel", getRandomPlayer(true)));
		game.addPlayer(initializePlayer("#player2-panel", getAnonymousPlayer()));

		return game;
	}

	function restartGame() {
		game.reset(Game.getStandardRules());

		updateScore();
		updatePlayPile();

		for (var i = 0, numPlayers = game.numPlayers(); i < numPlayers; i++) {
			var player = game.getPlayer(i);

			updatePlayerHand(player);
		}

		updateTurn(game.getDealer());
	}

	function endGame(winner) {
		$("#winner-img").attr("src", winner.photo());
		$("#winner-name").text(winner.name() + " wins!");
		$("#game-over-modal").modal("show");
	}

	function updatePlayerHand(player) {
		var $hand = findElementsByData(".player-panel", {
			playerName: player.name()
		}).find(".hand").empty();

		for (var i = 0, numCards = player.handSize(); i < numCards; i++) {
			var card = player.getCardInHand(i);
			var cardClass = "card card-front card-" + card.toString();

			if (player.isComputer()) {
				cardClass = "card card-back card-blue";
			}

			$("<div></div>").addClass(cardClass).data({
				index: i,
				face: card.face(),
				suit: card.suit()
			}).appendTo($hand);
		}
	}

	function updateTurn(player) {
		//Reset all panels...
		$(".player-panel").removeClass("panel-primary").data("isCurrent", false);

		//Set current player panel...
		var panel = findElementsByData(".player-panel", {
			playerName: player.name()
		}).addClass("panel-primary").data("isCurrent", true);

		var currentPlayer = game.getCurrentPlayer();

		if (game.hasLegalPlay(currentPlayer)) {
			if (currentPlayer.isComputer()) {
				var card = game.getBestPlay(currentPlayer);

				setTimeout(function() {
					findElementsByData(".card", {
						face: card.face(), 
						suit: card.suit()
					}).trigger("click");
				}, 500);
			}
		}
		else {
			endGame(game.getNextPlayer());
		}
	}

	function updateScore() {
		$("#score-text").text(game.score());
	}

	function updatePlayPile(cardString) {
		var $topCard = $("#top-card");
		var $bottomCard = $("#bottom-card");

		if (!cardString) {
			$topCard.attr("class", "card").removeData("cardClass");
			$bottomCard.attr("class", "card");
		}
		else {
			var cardClass = "card-" + cardString;

			if ($topCard.data("cardClass")) {
				$bottomCard.attr("class", "card card-front").addClass($topCard.data("cardClass"));
			}

			var action = (game.getCurrentPlayer().isComputer()) ? "slideLeftRetourn" : "slideRightRetourn";

			$topCard
				.attr("class", "card card-front magictime")
				.addClass(action)
				.addClass(cardClass).data("cardClass", cardClass)
				.one("animationend webkitAnimationEnd", function() {
					$(this).removeClass("magictime").removeClass(action);
				});
		}
	}
	
	restartGame();

	$("body").on("click", ".card", function() {
		var $card = $(this);

		if ($card.parents(".player-panel").eq(0).data("isCurrent")) {
			var currentPlayer = game.getCurrentPlayer();
			var index = $card.data("index");

			if (!game.isLegalPlay(currentPlayer.getCardInHand(index))) {
				return;
			}

			var face = $card.data("face");
			var suit = $card.data("suit");
			
			updatePlayPile(face + suit);

			var isGameOver = game.playCard(currentPlayer, index);

			if (isGameOver) {
				endGame(currentPlayer);

				return;
			}

			updateScore(game);
			updatePlayerHand(currentPlayer);
			updateTurn(game.getCurrentPlayer());
		}
	});

	$("#game-over-modal").on("hide.bs.modal", function() {
		restartGame();
	});
});