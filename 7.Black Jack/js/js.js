let game = {
    'you': {
        'scoreSpan': '#yscore',
        'div': '#you-box',
        'score': 0
    },
    'bot': {
        'scoreSpan': '#bscore',
        'div': '#bot-box',
        'score': 0
    },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'],
    'cardsMap': {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'A': [1, 11],
        'J': 10,
        'Q': 10,
        'K': 10
    },
    'win': 0,
    'lose': 0,
    'draw': 0,
    'win2': 0,
    'lose2': 0,
    'draw2': 0,
    'nextGame': false,
    'stand' : false,
    'player' : { 'single' : '#sp', 'multi':'mp'},
    'multi' : false,
};

const YOU = game['you'];
const BOT = game['bot'];
const SCORE_LIMIT = 21;
const hitSound = new Audio('./audio/swish.m4a');
const lossSound = new Audio('./audio/aww.mp3');
const winSound = new Audio('./audio/cash.mp3');


document.querySelector('#yturn').addEventListener('click', yourTurn);
document.querySelector('#reset').addEventListener('click', nextGame);
document.querySelector('#ystand').addEventListener('click', youTurnFinished);
document.querySelector('#p2').addEventListener('click', BotTurn);
document.querySelector('#mp').addEventListener('click', multiMode);
document.querySelector('#sp').addEventListener('click', singleMode);

function singleMode(){
    resetScore();

    game['multi'] = false;
    document.getElementById('p2').hidden = true;
    document.getElementById('yturn').innerHTML = 'Your Turn';

    document.getElementById('pl1').innerHTML = 'You';
    document.getElementById('pl2').innerHTML = 'Bot';

    document.getElementById('p2s').hidden = true;

}

document.getElementById('p2').hidden = true;
document.getElementById('p2s').hidden = true;

function multiMode(){
    resetScore();

    game['multi'] = true;
    document.getElementById('p2').hidden = false;
    document.getElementById('yturn').innerHTML = 1;

    document.getElementById('pl1').innerHTML = '1';
    document.getElementById('pl2').innerHTML = '2';

    document.getElementById('p2s').hidden = false;

}

async function youTurnFinished(){
    game['stand'] = true;
    if(game['nextGame'] === false){
        if(document.getElementById('ystand').className == 'btn-lg btn-secondary mr-2'){
            game['nextGame'] = true;
            showWinnerMulti(computeWinner());
        }

        while((game['nextGame'] === false) && (game['multi'] == false)){
            BotTurn();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
async function yourTurn() {
   
    if((game['nextGame'] === false) && (game['stand'] === false)){
            if(game['multi'] == true){
                 document.getElementById('ystand').className = 'btn-lg btn-primary mr-2';
            }

            let card = randomCard();
            showCard(YOU, card);
            updateScore(YOU, card);
            showScore(YOU);

    }  
}

function BotTurn() {
    if(game['nextGame'] === false){
        if(game['multi'] == false){
            let card = randomCard();
            showCard(BOT, card);
            updateScore(BOT, card);
            showScore(BOT);
            if (BOT['score'] > (SCORE_LIMIT - 6)) {
                game['nextGame'] = true;
                showWinner(computeWinner());
            }
        }else{
            if(game['stand'] == true){
            
                document.getElementById('ystand').className = 'btn-lg btn-secondary mr-2';
                let card = randomCard();
                showCard(BOT, card);
                updateScore(BOT, card);
                showScore(BOT);
            }
        }
    }
}

function randomCard() {
    let randomNum = Math.floor(Math.random() * 13);
    return game['cards'][randomNum];
}

function showCard(activePlayer, card) {
    if (activePlayer['score'] <= SCORE_LIMIT) {
        let cardImage = document.createElement('img');
        cardImage.src = `./images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function nextGame() {
    if (game['nextGame'] === true) {
        let yourImages = document.querySelector(YOU['div']).querySelectorAll('img');
        let BotImages = document.querySelector(BOT['div']).querySelectorAll('img');

        for (const iterator of yourImages) {
            iterator.remove();
        }
        for (const iterator of BotImages) {
            iterator.remove();
        }

        YOU['score'] = 0;
        BOT['score'] = 0;
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(BOT['scoreSpan']).textContent = 0;

        document.querySelector(YOU['scoreSpan']).style.color = 'transparent';
        document.querySelector(BOT['scoreSpan']).style.color = 'transparent';

        document.querySelector('#result').textContent = '';
        game['nextGame'] = false;
        game['stand'] = false;

        document.getElementById('ystand').className = 'btn-lg btn-warning mr-2';
    }
}

function updateScore(activePlayer, card) {
    if (card === 'A') {
        if (activePlayer['score'] + game["cardsMap"][card][1] <= 21) {
            activePlayer['score'] += game["cardsMap"][card][1];
        } else {
            activePlayer['score'] += game["cardsMap"][card][0];
        }
    } else {
        activePlayer['score'] += game["cardsMap"][card];
    }

}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BURN';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'Red';

    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function computeWinner() {
    let winner;

    if (YOU['score'] <= SCORE_LIMIT) {
        if ((YOU['score'] > BOT['score']) || (BOT['score'] > SCORE_LIMIT)) {
            game['win']++;
            game['lose2']++;
            winner = YOU;
        } else if (YOU['score'] < BOT['score']) {
            winner = BOT;
            game['lose']++;
            game['win2']++;
        } else {
            game['draw']++;
            game['draw2']++;
        }
    } else if ((YOU['score'] > SCORE_LIMIT) && (BOT['score'] <= SCORE_LIMIT)) {
        winner = BOT;
        game['lose']++;
        game['win2']++;
    } else {
        game['draw']++;
        game['draw2']++;
    }

    return winner;
}

function showWinner(winner) {
    let message, messageColor;

    if (winner === YOU) {
        message = "You Won!";
        messageColor = 'rgb(0, 255, 0)';
        document.querySelector('#win').textContent = game['win'];
        document.querySelector('#lose2').textContent = game['lose2'];
        winSound.play();
    } else if (winner === BOT) {
        message = "You Lost!";
        messageColor = 'Red';
        document.querySelector('#lose').textContent = game['lose'];
        document.querySelector('#win2').textContent = game['win2'];
        lossSound.play();
    } else {
        message = "Draw!";
        messageColor = 'orange';
        document.querySelector('#draw').textContent = game['draw'];
        document.querySelector('#draw2').textContent = game['draw2'];
        lossSound.play();
    }

    document.querySelector('#result').textContent = message;
    document.querySelector('#result').style.color = messageColor;
}

function showWinnerMulti(winner) {
    let message, messageColor;

    if (winner === YOU) {
        message = "1 Won!";
        messageColor = 'rgb(0, 255, 0)';
        document.querySelector('#win').textContent = game['win'];
        document.querySelector('#lose2').textContent = game['lose2'];
        winSound.play();
    } else if (winner === BOT) {
        message = "2 won!";
        messageColor = 'rgb(0, 255, 0)';
        document.querySelector('#lose').textContent = game['lose'];
        document.querySelector('#win2').textContent = game['win2'];
        winSound.play();
    } else {
        message = "Draw!";
        messageColor = 'orange';
        document.querySelector('#draw').textContent = game['draw'];
        document.querySelector('#draw2').textContent = game['draw2'];
        lossSound.play();
    }

    document.querySelector('#result').textContent = message;
    document.querySelector('#result').style.color = messageColor;
}

function resetScore(){
    game['nextGame'] = true;
    nextGame();
    game['nextGame'] = false;

    document.querySelector('#win').textContent = 0;
    game['win'] = 0;
    document.querySelector('#lose').textContent = 0;
    game['lose'] = 0;
    document.querySelector('#draw').textContent = 0;
    game['draw'] =0;

    document.querySelector('#win2').textContent = 0;
    game['win2'] = 0;
    document.querySelector('#lose2').textContent = 0;
    game['lose2'] = 0;
    document.querySelector('#draw2').textContent = 0;
    game['draw2'] =0;
}