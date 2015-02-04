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

Pile.prototype.get = function(index) {
    return this._cards[index];
};

Pile.prototype.getFirst = function() {
    return this._cards[0];
};

Pile.prototype.getLast = function() {
    return this._cards[this._cards.length - 1];
};

Pile.prototype.set = function(index, card) {
    this._cards[index] = card;
};

Pile.prototype.add = function(index, card) {
    this._cards.push(card);
};

Pile.prototype.addFirst = function(card) {
    this._cards.unshift(card);
};

Pile.prototype.addLast = function(card) {
    this._cards.push(card);
};

Pile.prototype.remove = function(index) {
    return this._cards.splice(index, 1)[0];
};

Pile.prototype.removeFirst = function() {
    return this._cards.splice(0, 1)[0];
};

Pile.prototype.removeLast = function() {
    return this._cards.splice(this._cards.length - 1, 1)[0];
};

Pile.prototype.find = function(face, suit) {
    $.each(this._cards, function(index, card) {
        if (card.face() === face && card.suit() === suit) {
            return card;
        }
    });
    
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

function Hand() {
    this._cards = [];
}

Hand.prototype = Pile.prototype;

function Deck() {
    this._cards = [];
}

Deck.createStandardDeck = function() {
    var deck = new Deck();
    
    //Standard 52-card deck has 13 faces and 4 suits...
    var faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
    var suits = ["S", "H", "C", "D"];
    
    $.each(faces, function(index, face) {
        $.each(suits, function(index, suit) {
            deck.add(new Card(face, suit));
        });
    });

    return deck;    
}

Deck.prototype = Pile.prototype;