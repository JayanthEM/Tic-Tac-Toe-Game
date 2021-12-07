window.onload = function(){
//Initial State
    var num; // box index
    var box; // hold canvas element
    var ctx; // holds context
    var turn = 1; //current turn
    var filled = new Array();
    var symbol = new Array();
    var winConditions = [[0,1,2], [3,4,5], [6,7,8],
                     [0,3,6], [1,4,7], [2,5,8],
                     [0,4,8], [2,4,6]];
    var gameOver = false;
    var human ='X';
    var AI = 'O';
    var result = {}; //Minimax algorithm game tree result

    for(var i = 0; i < 9; ++i){
        filled[i] = false;
        symbol[i] = '';
    }


    //Newgame event, function
    var buttonElement = document.getElementById("button");
    buttonElement.addEventListener("click",newGame);

    //Reload Page
    function newGame(){
        document.location.reload();
    }

    //Instead of checking for each canvas, get the tic element which is high in hirerchary compared to canvas,
    // by using that we can get the event and its id(canvas which is clicked)
    document.getElementById("tic").addEventListener("click", function(event){
        boxClick(event.target.id);
    });


    
    //BoxClick function (human player)
    function boxClick(numId)
    {
        box = document.getElementById(numId);
        ctx = box.getContext("2d");
        switch(numId)
        {      
            case "canvas1":
                    num = 0;
                    break;
            case "canvas2":
                    num = 1;
                    break;
            case "canvas3":
                    num = 2;
                    break;
            case "canvas4":
                    num = 3;
                    break;
            case "canvas5":
                    num = 4;
                    break;
            case "canvas6":
                    num = 5;
                    break;
            case "canvas7":
                    num = 6;
                    break;
            case "canvas8":
                    num = 7;
                    break;
            case "canvas9":
                    num = 8;
                    break;
        }
        if(filled[num] === false && gameOver === false && turn%2 !== 0 ){
            drawX();
            ++turn;
            filled[num] = true;
            
            if(winnerCheck(symbol, symbol[num]) === true)
            {
                document.getElementById("result").innerText = "Player Won" ;
                gameOver = true;
                return;
            }
            
            if(turn >9 && gameOver !== true)
            {
                document.getElementById("result").innerText = "DRAW";
                gameOver = true;
                return;
            }
            
            if(turn%2 === 0)
                playAI();
            return;
        }
        
        
        if(turn%2 === 1 && filled[num] === true)
            alert("Box is already filled. Click another one");
        
        if(gameOver)
            alert("Game over!!! Click NewGame");
            
    }
    
    //Draw X and O
    function drawX(){
        //box.style.background = "#fb5181";
        
        ctx.beginPath();
        
        ctx.moveTo(15,15);
        ctx.lineTo(85,85);
        ctx.moveTo(85,15);
        ctx.lineTo(15,85);
        ctx.lineWidth = 15;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red";
        ctx.stroke();
        
        ctx.closePath();
        
        symbol[num] = human;
    }
    
    function drawO(index)
    {
       // box.style.background = "#93f237";
        
        ctx.beginPath();
        
        ctx.arc(50,50,35,0,2*Math.PI,false);
        ctx.lineWidth = 20;
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        ctx.closePath();
        
        symbol[index] = AI;
    }
   
    //Winner Check function
    function winnerCheck(symbol,player)
    {
        for(var i =0; i < winConditions.length; ++i)
        {
            if(symbol[winConditions[i][0]] == player && symbol[winConditions[i][1]] == player && 
               symbol[winConditions[i][2]] == player)
                return true;
        }
        return false;
    }
    
    //Check for empty box
    function getEmptyBoxIndex(newSymbol)
    {
        var index = 0;
        var emptyIndex = [];
        for(var i=0; i< newSymbol.length; ++i)
        {
            if(newSymbol[i] !== 'X' && newSymbol[i] !== 'O')
            {
                emptyIndex[index] =i;
                ++index;
            }
                
        }
        return emptyIndex;
    }
    
    //AI and Minimax algorithm
    function playAI()
    {
        var nextMove = miniMax(symbol,AI); //return object it hold id of the canvans box element and score
        var index = nextMove.index;
        var nextId ="canvas"+ (index + 1);
        box = document.getElementById(nextId);
        ctx = box.getContext("2d");
        
        if(gameOver === false && turn%2 === 0 )
        {
            drawO(index);
            ++turn;
            filled[index] = true;
            
            if(winnerCheck(symbol,AI) === true)
            {
                document.getElementById("result").innerText = "AI Won" ;
                gameOver = true;
                return;
            }
            
            if(turn >9 && gameOver !== true)
            {
                document.getElementById("result").innerText = "DRAW";
                gameOver = true;
            }
            return;
        }
        
        if(gameOver)
            alert("Game over!!! Click NewGame");
        
    }
    
    //Minimax function
    //Reccuring function, scores deep through multiple level. 
    function miniMax(newSymbol,player)
    {
        var emptyBox = [];
        emptyBox = getEmptyBoxIndex(newSymbol);
        
        if(winnerCheck(newSymbol,human))
        {
            return {score : -10 };
        }
        else if(winnerCheck(newSymbol, AI))
        {
            return {score : 10 };
        }
        else if(emptyBox.length === 0)
        {
            return {score : 0};
        }
        // Possible moves. Index and score
        var possibleMoves =[];
        
        for(var i = 0; i < emptyBox.length; ++i)
        {
            //Current move. Index and score  
            var currentMove = {};
            
            currentMove.index = emptyBox[i];
            newSymbol[emptyBox[i]] = player;
            
            if(player === human)
            {
                result = miniMax(newSymbol,AI);
                currentMove.score = result.score;
            }
            else
            {
                result = miniMax(newSymbol,human);
                currentMove.score = result.score;
            }
            
            newSymbol[emptyBox[i]] = '';
            possibleMoves.push(currentMove);  //[{index : 1, score }]
        }
        
        //calculate score for intermediate state - Best move + score with respect to the player
        //return the score and best move
        var bestMove;
        //AI - max value, Human - min value
        if(player === AI)
        {
            var highestScore = -1000;
            for(var i = 0; i < possibleMoves.length; ++i)
            {
                if(highestScore < possibleMoves[i].score)
                {
                    highestScore = possibleMoves[i].score;
                    bestMove = i;
                }
            }
        }
        else
        {
            var lowestScore = 1000;
            for(var i = 0; i < possibleMoves.length; ++i)
            {
                if(lowestScore > possibleMoves[i].score)
                {
                    lowestScore = possibleMoves[i].score;
                    bestMove = i;
                }
            }
        }
        return possibleMoves[bestMove]; 
        
    }

};
