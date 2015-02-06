var NinetynineController = function($scope) {
    $scope.data = {
        game: {
            score: 0,
            drawPile: {},
            playPile: {},
            players: [],
            currentPlayer: {},
            dealer: {},
            winner: {},
            rules: []
        },
        maxNumPlayers: 4,
        startingHandSize: 3,
        standardRules: function() {
            return [
                function(card) {
                    if (card.face == "K" && (card.suit == "H" || card.suit == "D")) {
                        return -10;
                    }
                    else {
                        return null;
                    }
                },
                function(card) {
                    if (card.face == "K" ||
                        card.face == "Q" ||
                        card.face == "J")
                    {
                        return 10;
                    }
                    else if (card.face == "A") {
                        return 1;
                    }
                    else {
                        return parseInt(card.face);
                    }
                }
            ]
        }
    };

    $scope.getRandomPlayer = function(isCommputer) {
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

		return {
            name: player.name,
            photo: player.url,
            isComputer: isCommputer,
            hand: {}
        }
    };

    $scope.getAnonymousPlayer = function() {
        var players = [{
			name: "Anonymous",
			url: "/static/strangedeck/img/anonymous_male.jpg"
		}, {
			name: "Anonymous",
			url: "/static/strangedeck/img/anonymous_female.jpg"
		}];

		var player = players[Math.floor(Math.random() * players.length)];

		return {
            name: player.name,
            photo: player.url,
            isComputer: false,
            hand: {}
        }
    };

    $scope.createGame = function() {
        $scope.data.game.players = [$scope.getRandomPlayer(true), $scope.getAnonymousPlayer()];
    };

    $scope.startGame = function() {
        $scope.gameReset($scope.data.standardRules());
    };

    $scope.gameReset = function(rules) {
        $scope.data.game.score = 0;
        $scope.data.game.drawPile.cards = [];
        $scope.data.game.playPile.cards = [];

        angular.forEach($scope.data.game.players, function(value) {
            value.hand = [];
        });

        var deck = $scope.deckCreateStandardDeck();
        deck.shuffle();
    };

    $scope.deckCreateStandardDeck = function() {

    };

    $scope.deckShuffle = function() {

    };

    function init() {
        $scope.createGame();
        $scope.startGame();
    }

    init();
};

NinetynineController.$inject = ["$scope"];

angular.module("ninetynine", [])
    .controller("NinetynineController", NinetynineController);