let player1Name = prompt("Enter Player 1's name:") || "Player 1";
let player2Name = prompt("Enter Player 2's name:") || "Player 2";

document.getElementById('name--0').textContent = player1Name;
document.getElementById('name--1').textContent = player2Name;

const player0Section = document.querySelector('.player--0');
const player1Section = document.querySelector('.player--1');

const totalScore0 = document.querySelector('#score--0');
const totalScore1 = document.querySelector('#score--1');

const currentScore0 = document.getElementById('current--0');
const currentScore1 = document.getElementById('current--1');

const dice = document.querySelector('.dice');

const resetGameBtn = document.querySelector('.btn--reset');
const rollBtn = document.querySelector('.btn--roll');
const SaveBtn = document.querySelector('.btn--save_score');

const winnerCard =  document.querySelector('.winner-container');
const winnerPara = document.querySelector('winner-para');

let scores, currentScore, activePlayer, playing;

const initialState = function(){
    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    totalScore0.textContent = 0;
    totalScore1.textContent = 0;

    currentScore0.textContent = 0;
    currentScore1.textContent = 0;

    dice.classList.add('hidden');

    player0Section.classList.remove('player--winner');
    player1Section.classList.remove('player--winner');
    
    player0Section.classList.add('player--active');
    player1Section.classList.remove('player--active');

    winnerCard.classList.add('hidden');
}

initialState();

const switchPlayer = function(){
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    currentScore = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;

    player0Section.classList.toggle('player--active');
    player1Section.classList.toggle('player--active');

};

rollBtn.addEventListener("click", function(){
    if(playing){
        const diceNum = Math.trunc(Math.random()*6)+1;
        dice.classList.remove('hidden');
        dice.src = `images/dice-${diceNum}.png`;

        if (diceNum != 1){
            currentScore += diceNum;
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;

        }else{
            switchPlayer();
        }
    }
});
SaveBtn.addEventListener('click', function(){
    if(playing){
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent= scores[activePlayer];
        
        if (scores[activePlayer] >= 100){
            playing = false;
            dice.classList.add('hidden');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            winnerCard.classList.remove('hidden');
            winnerPara.textContent = `Player ${activePlayer+1} wins with the Score of ${scores[activePlayer]}`;


        }else{
            switchPlayer();
        }
    }
});

resetGameBtn.addEventListener('click', initialState);
