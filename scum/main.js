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
    usedCards = [];
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
        players.push(player);
        console.log(player);
    }
}

function createGui()
{
    var playing_area = document.getElementById("playing-area");
    var zone_offset = 0;
    for(var p = 1; p < numPlayers; p++)
    {
        let player_zone = document.createElement("div");
        player_zone.classList.add("player-zone");
        player_zone.id = "player-zone".concat(p);
        player_zone.style.left = zone_offset.toString().concat("px");

        playing_area.appendChild(player_zone);
        let header = document.createElement("h4");
        header.innerHTML = "player ".concat(p);
        player_zone.appendChild(header);

        var card_layer_offset = 50;
        for(var c = 0; c < (numCards/numPlayers); c++)
        {
            let card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("card-back");
            card.id = "player ".concat(p).concat("card-layer".concat(c));
            card.style.top = card_layer_offset.toString().concat("px");
            card.style.zIndex = c;
            player_zone.appendChild(card);
            card_layer_offset = card_layer_offset + 20;
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
    var card = new Object;

    card.value = Math.floor(Math.random() * 13) + 2;
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
    
    card.suite = Math.floor(Math.random() * 4) + 1;
    switch(card.suite)
    {
        case 1:
            card.str = card.str + " of hearts";
            break;
        case 2:
            card.str = card.str + " of clubs";
            break;
        case 3:
            card.str = card.str + " of diamonds";
            break;
        case 4:
            card.str = card.str + " of spades";
            break;
    }
    if(usedCards.includes(card.str))
        card = getCard();
    usedCards.push(card.str);
    return card;
}