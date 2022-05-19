var operators = ['+', '-', '*', '/', '='];
var elementsInInput = [];
var operator = false;
var totalScore = 0;
var allOperators = false;

var nonPrimeNum = function(){
    let anyNum = Math.floor(Math.random * (99-10)) + 10;
    let anyArr = [];
    for(let i=2; i<=Math.round(Math.sqrt(anyNum)); i++){
        if(anyNum%i == 0){
            anyArr.push(i);
        }
    }
    if(anyArr.length == 0){
        return nonPrimeNum();
    }
    return anyNum;
}

var getLastNumber = function(col, row){
    var x = document.querySelector(`[col='${col}'][row='${row}']`);
    return x.getAttribute('value').length;
}

var generateField = function(){
    var randomNum = Math.floor(Math.random()*6);
    if(randomNum<3){
        return Math.floor(Math.random()*(10-1))+1;
    }
    else if(randomNum == 5){
        return Math.floor(Math.random() * (30-20)) + 10;
    }
    else{
        return Math.floor(Math.random() * (20-10)) + 20;
    }
}

var isOperator = function(str){
    if(operators.includes(str)){
        return true;
    }
    return false;
}

var elements = document.querySelectorAll('.numbers');

for(element of elements){
    var fieldValue = generateField();
    element.value = fieldValue;
    element.innerHTML = `<h3>${fieldValue}</h3>`;
    element.addEventListener('click', function(event){
        event.preventDefault();
        var input = document.querySelector('input');
        var col = parseInt(this.getAttribute('col'));
        var row = parseInt(this.getAttribute('row'));

        if(!elementsInInput.length){
            input.value += this.value;
            elementsInInput.push([col, row]);
            operator = false;
        }
        else if(Math.abs(col-elementsInInput.at(-1)[0]) <= 1 && Math.abs(row-elementsInInput.at(-1)[1]) <= 1){
            console.log([col, row], elementsInInput.at(-1));
            if(col == elementsInInput.at(-1)[0] && row == elementsInInput.at(-1)[1]){
                const d = getLastNumber(col, row);
                input.value = input.value.slice(0,-d);
                elementsInInput.pop();
                operator = true;
            }
            else if(operator){
                input.value += this.value;
                elementsInInput.push([col, row]);
                operator = false;
            }
            
        }
    })
}

var operatorElement = document.getElementsByClassName('operators');
for(op of operatorElement){
    op.addEventListener('click', function(e){
        e.preventDefault();
        var input = document.querySelector('input');
        if(!operator){
            input.value = input.value + this.value;
            operator = true;
        }
        else{
            let ch = input.value.slice(-1);
            input.value = input.value.slice(0, -1);
            if(ch == this.value){
                operator = false;
            }
            else{
                input.value += this.value;
                operator = true;
            }
        }
    })
}

var evaluateElement = document.getElementById('evaluate');
evaluateElement.addEventListener('click', function(event){
    event.preventDefault();
    var input = document.querySelector('input');
    let i=-1;
    while(-i<= input.value.length && input.value.at(i) !== '='){
        i--;
    }
    var evaluatingString = input.value.slice(0, i);
    var ansString = input.value.slice(i+1);
    console.log(eval(evaluatingString), ansString);
    if(eval(evaluatingString) == ansString){
        var operatorArr = [false, false, false, false];
        var scoreElement = document.getElementById('score');
        for(s of evaluatingString){
            if(isOperator(s)){
                if(s == '+'){
                    operatorArr[0] = true;
                    totalScore++;
                }
                else if(s == '-'){
                    operatorArr[1] = true;
                    totalScore += 1;
                }
                else if(s == '*'){
                    operatorArr[2] = true;
                    totalScore += 2;
                }
                else if(s == '/'){
                    operatorArr[3] = true;
                    totalScore += 3;
                }
            }
        }
        if(operatorArr.every(el => el==true)){
            totalScore += 2;
            allOperators = true;
        }
        scoreElement.innerText = totalScore;
        editMatrix();
        input.value = '';
        elementsInInput.length = 0;
    }
})

var editMatrix = function(){
    for(let i=1; i<=6; i++){
        let col_arr = [];
        elementsInInput.forEach(el => {
            if(el[1] == i){
                col_arr.push(el[0]);
            }
        })
        if(col_arr.length){
            col_arr.sort();
            console.log(col_arr);
            let k = col_arr.at(-1);
            let j = k-1;
            while(j!=0){
                if(col_arr.includes(j)){
                    j--;
                }
                else{
                    let prevCol = document.querySelector(`[col='${j}'][row='${i}']`);
                    let currCol = document.querySelector(`[col='${k}'][row='${i}']`);

                    currCol.value = prevCol.value;
                    currCol.innerHTML = `<h3>${currCol.value}</h3>`
                    j--;
                    k--;
                }
            }
            while(k!=0){
                let currCol = document.querySelector(`[col='${k}'][row='${i}']`);
                let newField = Math.floor(Math.random()*10);
                currCol.value = newField;
                currCol.innerHTML = `<h3>${newField}</h3>`;
                k--;
            }
        }

    }
    
}

var timer = document.getElementById('timer');
var stopwatch = setInterval(function(){
    timer.innerText = parseInt(timer.innerText) - 1;
    if(timer.innerText == 0){
        clearInterval(stopwatch);
        if(allOperators && totalScore>=10){
            if(alert(`Your Score: ${totalScore}`, 'ACED THE LEVEL!')){}
            else{window.location.reload()}; 
        }
        else{
            if(alert(`Your Score: ${totalScore}`)){}
            else{window.location.reload()}; 
        }
        
        
    }
}, 1000)


var clearElement = document.getElementById('clear');
clearElement.addEventListener('click', function(event){
    event.preventDefault();
    var input = document.querySelector('input');
    input.value = '';
    elementsInInput.length = 0;
})

// var scrapegoat = document.querySelector('#scrapegoat');

// scrapegoat.addEventListener('click', function(event){
//     event.preventDefault();
//     var input = document.querySelector('input');
//     var d = getLastNumber(input.value);
//     input.value += this.value;
// })