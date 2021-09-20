async function rps(HumanChoise){

   
    var humanChoise = HumanChoise.id;
    var botChoise = botNumToChoice();
    var winResult = win(humanChoise,botChoise);
    endGameDisplay(humanChoise,botChoise,winResult);
    await new Promise(resolve => setTimeout(resolve, 1800));
    location.reload();
}



function randomNum(){
    return Math.floor(Math.random() * 3);
}

function botNumToChoice(){
    let choise = ["Rock","Paper","Scissors"];
    return choise[randomNum()];
}

function win(humanChoise,botChoise){
    var winDB = {
        "Rock"      : {"Paper"     : 0, "Rock"     : 0.5 , "Scissors" : 1},
        "Paper"     : {"Scissors"  : 0, "Paper"    : 0.5 , "Rock"     : 1},
        "Scissors"  : {"Rock"      : 0, "Scissors" : 0.5 , "Paper"    : 1},
    };
    return [winDB[humanChoise][botChoise],winDB[botChoise][humanChoise]];
}

function message(winResult){
    if(winResult[0]==1){
        return {"Message":"You Won!", "color":"green"};
    }else if(winResult[0] == 0.5){
        return {"Message":"Tie!", "color":"yellow"};
    }else{
        return {"Message":"You Lost!", "color":"red"};
    }
}

 function endGameDisplay(humanChoise,botChoise,winResult){
    var imgDB = {
        "Rock" : document.getElementById('Rock').src,
        "Paper" : document.getElementById('Paper').src,
        "Scissors" : document.getElementById('Scissors').src,
    };

    document.getElementById("Rock").remove();
    document.getElementById("Paper").remove();
    document.getElementById("Scissors").remove();

    var humanDiv = document.createElement('div');    
    var messageDiv = document.createElement('div');    
    var botDiv = document.createElement('div');

    humanDiv.innerHTML = "<img class='winPage' style='box-shadow: 0 10px 50px blue;' src='"+imgDB[humanChoise]+ "'>";
    messageDiv.innerHTML = "<h1 style='color:"+message(winResult)['color']+" ' > "+message(winResult)['Message']+" </h1>";
    botDiv.innerHTML = "<img class='winPage' style='box-shadow: 0 10px 50px red;' src='"+imgDB[botChoise]+ "'>";

    document.getElementById('flex-box-div').append(humanDiv);
    document.getElementById('flex-box-div').append(messageDiv);
    document.getElementById('flex-box-div').append(botDiv);

}