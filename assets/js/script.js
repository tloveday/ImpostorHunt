// Credit for getting the game running and working: PortExe, https://www.youtube.com/watch?v=3uuQ3g92oPQ&list=PL4q8dcAYPWjTRKitqOzyyAU2jkRblHTFc&index=6&t=1601s
// Credit is given to my mentor Antionio for guidance throughout the document clarifying problems, conflicts.

//variables
let flippedCard = false;
let card1, card2;
var time = 75;
var timer = null;

//cards array
let cardsArray = ["Cyan", "Cyan", "Dead", "Dead", "Ghost", "Ghost", "Pink", "Pink", "Purple", "Purple", "Red", "Red", "Impostor", "White", "White"];

//audio
var flipSound = new Audio("assets/audio/flip.mp3");
var startSound = new Audio("assets/audio/start.mp3");
var defeatSound = new Audio("assets/audio/defeat.mp3");
var victorySound = new Audio ("assets/audio/victory.mp3");
var matchedSound = new Audio ("assets/audio/matched.mp3");

//The Game will wait fo the Dom to complete loading before running
document.addEventListener("DOMContentLoaded", () =>{
    
    let cards = Array.from(document.getElementsByClassName('card'));

    //gameStart function that starts the game
    document.getElementById("start").addEventListener("click", startGame); 

    //reset button that resets the board.
    document.getElementById("reset").addEventListener("click", resetGame);

    //reset function
    function resetGame(){
        clearTimeout(timer);
        time = 75;
        timer = null;
        document.getElementById("time-remaining").innerHTML= 75;
        votes = 0;
        document.getElementById("votes").innerHTML = votes;
        flippedCard = false;
        card1 = null;
        card2 = null;
        cards.forEach(card =>{
            card.classList.remove('visible');
        });
        cards = Array.from(document.getElementsByClassName('card'));
        cardsArray = ["Cyan", "Cyan", "Dead", "Dead", "Ghost", "Ghost", "Pink", "Pink", "Purple", "Purple", "Red", "Red", "Impostor", "White", "White"];
        document.getElementById("start").addEventListener("click", startGame);
    }


    // Game Start Function
    function startGame(){
        startSound.play();
        shuffledcardsArray = shuffle(cardsArray);
        updateCardBoard(cards, shuffledcardsArray);
        startTimer();
        //make the cards clickable with the function 
        cards.forEach(card =>{
            card.addEventListener('click', flipCard);
        });
        this.removeEventListener('click', startGame);
    };

    //Flip Card Function
    function flipCard(){
        if (this.classList.contains('visible')){
            return
        }else{
            this.classList.add('visible');
            flipSound.play();
        //Votes climb with each click
            voteNumber();
        //Cards Identitied made via the data attribute
            clickedCharacter = this.getAttribute('data-char');
            checkImpostor(clickedCharacter);
        //Give clicks identities to be checked
            if(!flippedCard){
                flippedCard = true;
                card1 = this;
            }else{ 
                card2 = this;
                flippedCard = false;
                //Check for match
                if (checkMatch()) {
                    //stop the cards being repicked- once flipped.
                    card1.removeEventListener('click', flipCard, false);
                    card2.removeEventListener('click', flipCard, false);
                    matchedSound.play()
                }else{
                    cardMisMatch();
                }
            } 
        }
    }
    //Check for Impostor- Win Condition.
    function checkImpostor(clickedCharacter){
        return setTimeout(function (){
            if (clickedCharacter === 'Impostor'){
                //Timeout added so that Users can see they have found the Impostor
                setTimeout(()=>{
                    victorySound.play()
                    alert('Victory! You Have Found The Impostor');
                    clearTimeout(timer);
                }, 200);
            }else{
                return
            }
        }, 500);
    }

    //Vote Counter rises with each click
    var votes = 0; 
    function voteNumber() {
        votes ++ ;
        document.getElementById("votes").innerHTML = votes;
        if (votes === 30){
            clearTimeout(timer);
            defeatSound.play();
            alert('Defeat: You did not find the Impostor.');
            return;
        }
    };

    //Timer
    function startTimer() {
        timer = setInterval(countDown, 1000);
    }
    
    // CountDown Timer   
    function countDown(){
        time=time-1;
    
        if (time === 0){
            clearTimeout(timer);
            defeatSound.play();
            alert('Defeat: You did not find the Impostor.');
            return;
        }document.getElementById("time-remaining").innerHTML= time;
    }

    //Check Match
    function checkMatch(){
        if (card1.getAttribute('data-char') === card2.getAttribute('data-char')){
            return true;   
        }else{
            false;
        }
    }
    
    //Mismatch
    function cardMisMatch(){
       //Timeout required so that card reveal of card2 is seen and gives players time to add the card to memory
        setTimeout(()=>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
        }, 500)
    }

    // Shuffle Cards- Fisher-Yates Shuffle Algorithm - Code assisted by Mentor
    function shuffle(cardsArray){
        shuffledArray = [];
        cardArrayLength = cardsArray.length - 1;
        lastIndex = cardArrayLength;
        index = 0; 
        for (index; index <= cardArrayLength; index++) {
            randIndex = Math.floor(Math.random() * lastIndex);
            shuffledArray[index] = cardsArray[randIndex];
            cardsArray.splice(randIndex, 1);
            lastIndex = lastIndex - 1;
        }
        return shuffledArray;
    }

    //update the gameboard
    function updateCardBoard(cardsArray, shuffledArray){
        cardArrayLength = cardsArray.length - 1;
        index = 0; 
        for (index; index <= cardArrayLength; index++) {
            frontCard = cardsArray[index].getElementsByClassName('card-data')[0];
            frontCard.setAttribute('src',  './assets/images/' + shuffledArray [index] + '.png');
            cardsArray[index].setAttribute('data-char', shuffledArray[index]);
        }
    }
})