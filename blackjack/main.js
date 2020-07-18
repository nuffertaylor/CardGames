var usedCards = [];
var dealersHand = [];
var usersHand = [];
var bust = false;
var houseBust = false;
var showDealersHand = false;
var wallet = 20;
var pot = 0;

/**
 * called at the start of every round
 */
function dealCards()
{
    dealersHand.push(getCard());
    usersHand.push(getCard());
    dealersHand.push(getCard());
    usersHand.push(getCard());
    updateGui();
}

/**
 * called when the users presses the "hit me" button
 */
function hitMe()
{
    if(bust) alert("you already lost");
    else if(showDealersHand) alert("this round is over");
    else
    {
        usersHand.push(getCard());
        if(handSum(usersHand) > 21) bust = true;
        updateGui();
    }
}

/**
 * called when the user presses the "stay" button
 * finishes the round
 */
function stay()
{
    if(bust) alert("you already lost");
    else if(showDealersHand) alert("this round is already over");
    else
    {
        runDealer();
        updateVictoryGui();
        updateGui();
    }
}

/**
 * called when the user tries to place a bet
 * in real blackjack you're only allowed to bet before you get any cards
 */
function bet()
{
    if(bust) alert("you already lost");
    else if(showDealersHand) alert("this round is already over");
    else if(wallet == 0) alert("you're broke.");
    else
    {
        do
        {
            var betAmount = parseInt(prompt("how much would you like to bet?"));
            if(betAmount > wallet) alert("you cannot bet more than you have in your wallet");
            if(betAmount < 0) alert("you cannot bet less than 0");
            if(isNaN(betAmount)) alert("you must input a number for us to bet");
        } while(betAmount > wallet || betAmount < 0 || isNaN(betAmount))
        pot = (parseInt(betAmount) * 2) + parseInt(pot);
        wallet = parseInt(wallet) - parseInt(betAmount);
        updateGui();
    }   
}

/**
 * resets all the variables to begin a new round
 */
function startOver()
{
    usedCards = [];
    dealersHand = [];
    usersHand = [];
    bust = false;
    houseBust = false;
    showDealersHand = false;
    document.getElementById("victoryIndicator").className = '';
    document.getElementById("victoryIndicator").innerHTML = '';
    document.getElementById("houseBustIndicator").innerHTML = '';
    document.getElementById("bustIndicator").innerHTML = '';
    document.getElementById("houseTotal").innerHTML = '';
    pot = 0;
    dealCards();
}

/**
 * pulls a new card from the deck (will not pull a card that is already taken)
 * only allows for a 52 card deck
 */
function getCard()
{
    var card = new Object;

    card.value = Math.floor(Math.random() * 13) + 1;
    switch(card.value)
    {
        case 1:
            card.value = "ace";
            break;
        case 11:
            card.value = "jack";
            break;
        case 12:
            card.value = "queen";
            break;
        case 13:
            card.value = "king";
            break;
        default:
            break;
    }
    
    card.suite = Math.floor(Math.random() * 4) + 1;
    switch(card.suite)
    {
        case 1:
            card.str = card.value + " of hearts";
            break;
        case 2:
            card.str = card.value + " of clubs";
            break;
        case 3:
            card.str = card.value + " of diamonds";
            break;
        case 4:
            card.str = card.value + " of spades";
            break;
    }
    if(usedCards.includes(card.str))
        card = getCard();
    usedCards.push(card.str);
    return card;
}

/**
 * calculates the blackjack hand value of a given hand
 * aces aren't handled exactly right, but it works okay
 * @param {} hand which players hand you wish to calculate
 */
function handSum(hand)
{
    var total = 0;
    var numAces = 0;
    for(let i = 0; i < hand.length; i++)
    {
        switch(hand[i].value)
        {
            case "jack":
            case "queen":
            case "king":
                total += 10;
                break;
            case "ace":
                numAces++;
                break;
            default:
                total += hand[i].value;
        }
    }
    for(let i = 0; i <numAces; i++)
    {
        if(total < 11) total+=11;
        else total+=1;
    }
    return total;
}

/**
 * updates the dom to reflect the happenings of the game
 */
function updateGui()
{
    //update dealers hand
    var houseCards = document.getElementById("houseCards");
    houseCards.innerHTML = "";
    for(var i = 0; i < dealersHand.length; i++)
    {
        let card = document.createElement("li");
        if(i==0 || showDealersHand) card.innerHTML = dealersHand[i].str;
        else card.innerHTML = "hidden";
        houseCards.appendChild(card);
    }
    if(showDealersHand) document.getElementById("houseTotal").innerHTML = "total: " + handSum(dealersHand);
    if(houseBust) document.getElementById("houseBustIndicator").innerHTML = "house busted";

    //update players hand
    var playerCards = document.getElementById("playerCards");
    playerCards.innerHTML = "";
    for(var i = 0; i < usersHand.length; i++)
    {
        let card = document.createElement("li");
        card.innerHTML = usersHand[i].str;
        playerCards.appendChild(card);
    }
    document.getElementById("playerTotal").innerHTML = "total: " + handSum(usersHand);
    if(bust) document.getElementById("bustIndicator").innerHTML = "busted";

    document.getElementById("pot").innerHTML = "pot: $" + pot;
    document.getElementById("wallet").innerHTML = "wallet: $" + wallet;
}


/**
 * only called after the user presses "stay" to show if they won
 * could also be called after the user busts, but I think that makes the screen too busy
 */
function updateVictoryGui()
{
    let victoryIndicator = document.getElementById("victoryIndicator");
    victoryIndicator.innerHTML=checkVictory();
    switch(victoryIndicator.innerHTML)
    {
        case "you win!":
            victoryIndicator.classList.add("win");
            wallet = parseInt(wallet) + parseInt(pot);
            break;
        case "you lose.":
            victoryIndicator.classList.add("loss");
            break;
        default:
            victoryIndicator.classList.add("neutral");
            wallet = parseInt(wallet) + parseInt(pot/2);
    }
}

/**
 * runs the dealer's side after the user desides to "stay"
 */
function runDealer()
{
    while(handSum(dealersHand) < 16)
        dealersHand.push(getCard());
    if(handSum(dealersHand) > 21)
        houseBust = true;
    showDealersHand = true;
}

/**
 * checks who won
 */
function checkVictory()
{
    //a busted player will never get to this function, but we'll verify they aren't busted anyways.
    if(!bust)
    {
        //if the house busted, you win
        if(houseBust) return "you win!";
        //otherwise, see who's cards are worth more.
        if(handSum(usersHand) > handSum(dealersHand)) return "you win!";
        //or they could be equal
        if(handSum(usersHand) == handSum(dealersHand)) return "draw";
        //or you lose
    }
    return "you lose.";
}