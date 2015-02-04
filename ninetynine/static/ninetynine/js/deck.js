function Card(face, suit) {
    this._face = face;
    this._suit = suit;
}

Card.prototype.face = function() {
    return this._face;
};

Card.prototype.suit = function() {
    return this._suit;
};

Card.prototype.toString = function() {
    return this._face + this._suit;
};

function Pile(cards) {
    this._cards = cards || [];    
}

Pile.prototype.size = function() {
    return this._cards.length;
};

Pile.prototype.isEmpty = function() {
    return this._cards.length === 0;
};

Pile.prototype.getCard = function(index) {
    return this._cards[index];
};

Pile.prototype.getFirstCard = function() {
    return this._cards[0];
};

Pile.prototype.getLastCard = function() {
    return this._cards[this._cards.length - 1];
};

Pile.prototype.setCard = function(index, card) {
    this._cards[index] = card;
};

Pile.prototype.addCard = function(index, card) {
    this._cards.splice(index, 0, card);
};

Pile.prototype.addFirstCard = function(card) {
    this._cards.unshift(card);
};

Pile.prototype.addLastCard = function(card) {
    this._cards.push(card);
};

Pile.prototype.removeCard = function(index) {
    return this._cards.splice(index, 1)[0];
};

Pile.prototype.removeFirstCard = function() {
    return this._cards.shift();
};

Pile.prototype.removeLastCard = function() {
    return this._cards.pop();
};

Pile.prototype.findCard = function(face, suit) {
    for (var i = 0, numCards = this._cards.length; i < numCards; i++) {
        var card = this._cards[i];
        
        if (card.face() === face && card.suit() === suit) {
            return card;
        }
    }
    
    return null;
};

Pile.prototype.shuffle = function() {
    var temp = [];
    
    while (this._cards.length > 0) {
        var index = Math.floor(Math.random() * this._cards.length);
        var card = this._cards.splice(index, 1)[0];
        
        temp.push(card);
    }
    
    this._cards = temp;
};

Pile.prototype.toString = function() {
    var cards = [];
    
    $.each(this._cards, function(index, card) {
        cards.push(card.toString());
    });
    
    return cards.join(",");
};

function Hand(cards) {
    this._cards = cards || [];  
}

Hand.prototype = Pile.prototype;

function Deck(cards) {
    this._cards = cards || [];  
}

Deck.createStandardDeck = function() {
    var cards = [];
    
    //Standard 52-card deck has 13 faces and 4 suits...
    var faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
    var suits = ["S", "H", "C", "D"];
    
    $.each(faces, function(index, face) {
        $.each(suits, function(index, suit) {
            cards.push(new Card(face, suit));
        });
    });

    return new Deck(cards);    
};

Deck.prototype = Pile.prototype;