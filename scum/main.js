var numCards = 0;
var numPlayers = 0;
var players = [];
var usedCards = [];

/**called to begin a new round of scum */
function startGame()
{
    numCards = 0;
    numPlayers = 0;
    players = [];
    deck = [];
    usedCards = [];
    document.getElementById("playing-area").innerHTML="";
    while(true)
    {
        numPlayers = (prompt("how many players? (between 2-6)"));
        if(numPlayers === null) break;
        else if(isNaN(numPlayers)) alert("you have to enter a number");
        else if(numPlayers < 2 || numPlayers > 6) alert("enter a number between 2-6");
        else break;
    }
    numCards = Math.floor(52/numPlayers) * numPlayers;
    dealCards();
    createGui();
    document.getElementById('play-button').innerHTML = "start over";
}

/**
 * Divides the entire deck evenly among players
 */
function dealCards()
{
    for(var p = 0; p < numPlayers; p++)
    {
        let player = new Object;
        player.name = "player".concat(p);
        //the user is always player0
        player.hand = [];
        for(var c = 0; c < (numCards/numPlayers); c++)
        {
            player.hand.push(getCard());
        }
        player.hand.sort(function(a,b){return b.value - a.value;})
        players.push(player);
        console.log(player);
    }
}

function createGui()
{
    var playing_area = document.getElementById("playing-area");
    var zone_offset = 20;
    for(var p = 0; p < numPlayers; p++)
    {
        let player_zone = document.createElement("div");
        player_zone.classList.add("player-zone");
        player_zone.id = "player-zone".concat(p);
        player_zone.style.left = zone_offset.toString().concat("px");

        playing_area.appendChild(player_zone);
        let header = document.createElement("h4");
        if(p==0) header.innerHTML = "your cards";
        else header.innerHTML = "player ".concat(p);
        player_zone.appendChild(header);

        var card_layer_offset = 50;
        for(var c = 0; c < (numCards/numPlayers); c++)
        {
            let card = document.createElement("div");
            card.classList.add("card");
            if(p==0)
            {
                card.classList.add("card-front");
                let cardStr = '<div class="card-text">' + players[0].hand[c].str + '</div><img src="img/' + players[0].hand[c].suite + '.svg" class="suite-icon">';
                console.log(cardStr);
                card.innerHTML = cardStr;
            }
            else {card.classList.add("card-back");}
            card.id = "player ".concat(p).concat("card-layer".concat(c));
            card.style.top = card_layer_offset.toString().concat("px");
            card.style.zIndex = c;
            player_zone.appendChild(card);
            card_layer_offset = card_layer_offset + 23;
        }
        zone_offset = zone_offset + 150;
    }
}

/**
 * used to pull 1 new card from a deck of 52.
 * Each card has a numerical value and a str value.
 */
function getCard()
{
    let cardVal = 14 - Math.floor(Math.random() * 13);
    let cardSuite = Math.floor(Math.random() * 4) + 1;
    let cardStr = cardVal + " of " + cardSuite;
    while(usedCards.includes(cardStr))
    {
        cardVal = 14 - Math.floor(Math.random() * 13);
        cardSuite = Math.floor(Math.random() * 4) + 1;
        cardStr = cardVal + " of " + cardSuite;
    }
    usedCards.push(cardStr);
    return translateCard(cardVal, cardSuite);
}

function translateCard(cardVal, cardSuite)
{
    var card = new Object;

    card.value = cardVal;
    switch(card.value)
    {
        case 11:
            card.str = "jack";
            break;
        case 12:
            card.str = "queen";
            break;
        case 13:
            card.str = "king";
            break;
        case 14:
            card.str = "ace";
            break;
        default:
            card.str = card.value;
            break;
    }
    switch(cardSuite)
    {
        case 1:
            card.suite = "hearts";
            break;
        case 2:
            card.suite = "clubs";
            break;
        case 3:
            card.suite = "diamonds";
            break;
        case 4:
            card.suite = "spades";
            break;
    }

    return card;
}