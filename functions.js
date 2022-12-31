/*Rendre Greyling
ODP6c6
Web Programming Assignment 1*/

function generateMapSelector(arrMap, select) {
    select.innerHTML = '';
    for (let i = 0; i < arrMap.length; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = `${arrMap[i].difficulty} ${arrMap[i].size}x${arrMap[i].size} map`;
        select.appendChild(option);
    }
}

function createSelector(td, numOptions) {
    let selector = document.createElement('select');
    selector.classList.add('editorSelector')
    let none = document.createElement('option');
    none.value = -1;
    none.innerHTML = 'none';
    selector.appendChild(none);
    for (let i = 0; i < numOptions; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = i;
        selector.appendChild(option);
    }
    td.appendChild(selector);
}

function selctorNumOptions(numOptions, x, y, size) {
    if (x-1 >= 0 && editorTable.childNodes[y].childNodes[x-1].classList.contains('black')) {numOptions--;}
    if (x+1 <= size && editorTable.childNodes[y].childNodes[x+1].classList.contains('black')) {numOptions--;}
    if (y-1 >= 0 && editorTable.childNodes[y-1].childNodes[x].classList.contains('black')) {numOptions--;}
    if (y+1 <= size && editorTable.childNodes[y+1].childNodes[x].classList.contains('black')) {numOptions--;}
    return numOptions;
}

function generateMap(table)
{
    lights = [];
    table.innerHTML = '';

    generateTable(table, map.size);
    generateAllBlackSquares(table);
}

function generateTable(table, size) {
    for (let i = 0; i < size; i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for (let j = 0; j < size; j++) {
            let td = document.createElement('td');
            td.classList.add('white');
            tr.appendChild(td);
        }
    }
}

function generateAllBlackSquares(table) {
    map.blackSquares.forEach(element => {
        let blackSquare = table.childNodes[element[1]].childNodes[element[0]];
        blackSquare.classList.replace('white', 'black');
        if (element[2] != -1) {
            blackSquare.innerHTML = element[2];
        }
    });
}

function calcLighting(table) {
    clearMap(table);

    lights.forEach(light => {
        renderSingleLight(table, light, 0);
    });
}

function renderSingleLight(table, light, animate) {
    paintTiles(table, light.x, light.y, light.x, light.y)
    table.childNodes[light.y].childNodes[light.x].innerHTML = '💡';
    
    animateRight(light.x + 1, light, table, false, animate);
    animateLeft(light.x - 1, light, table, false, animate);
    animateDown(light.y + 1, light, table, false, animate);
    animateUp(light.y - 1, light, table, false, animate);
}

function animateRight(i, light, table, stop, animate) {
    if (i < map.size && !stop) {
        stop = paintTiles(table, i, light.y, light.x, light.y)
        setTimeout(() => animateRight(i+1, light, table, stop, animate), animate * 150);
    }
}

function animateLeft(i, light, table, stop, animate) {
    if (i >= 0 && !stop) {
        stop = paintTiles(table, i, light.y, light.x, light.y)
        setTimeout(() => animateLeft(i-1, light, table, stop, animate), animate * 150);
    }
}

function animateDown(i, light, table, stop, animate) {
    if (i < map.size && !stop) {
        stop = paintTiles(table, light.x, i, light.x, light.y)
        setTimeout(() => animateDown(i+1, light, table, stop, animate), animate * 150);
    }
}

function animateUp(i, light, table, stop, animate) {
    if (i >= 0 && !stop) {
        stop = paintTiles(table, light.x, i, light.x, light.y)
        setTimeout(() => animateUp(i-1, light, table, stop, animate), animate * 150);
    }
}

function paintTiles(table, x, y, oirginX, oirginY) {
    let stop = false
    let td = table.childNodes[y].childNodes[x];
    if (!td.classList.contains('black')) {
        if (td.classList.contains('white')) {
            td.classList.replace('white', 'yellow');
        } else { 
            if (td.classList.contains('yellow')) {
                if (td.innerHTML == '💡') {
                    td.classList.replace('yellow', 'red');
                    let tdOrigin = table.childNodes[oirginY].childNodes[oirginX];
                    tdOrigin.classList.replace('yellow', 'red');
                }
            }
        }
    } else {
        stop = true;
    }
    return stop;
}

function checkWin() {
    win = true;
    
    for (let i = 0; i < map.size; i++) {
        for (let j = 0; j < map.size; j++) {
            let td = gameTable.childNodes[i].childNodes[j];
            if (!td.classList.contains('black')) {
                if (td.classList.contains('white') || td.classList.contains('red')) {
                    win = false;
                }
            } else {
                if (td.innerHTML != '') {
                    let val = parseInt(td.innerHTML);
                    let numLights = 0;
                    let top, bottom, left, right;

                    i == 0 ? top = td : top = gameTable.childNodes[i-1].childNodes[j];
                    i == map.size - 1 ? bottom = td : bottom = gameTable.childNodes[i+1].childNodes[j];
                    j == 0 ? left = td : left = gameTable.childNodes[i].childNodes[j-1];
                    j == map.size - 1 ? right = td: right = gameTable.childNodes[i].childNodes[j+1];
                    if (top.innerHTML == '💡') {numLights++;}
                    if (bottom.innerHTML == '💡') {numLights++};
                    if (left.innerHTML == '💡') {numLights++};
                    if (right.innerHTML == '💡') {numLights++};

                    if (val == numLights) {
                        td.style.color = '#4ed43f';
                        td.style.borderColor = '#4ed43f';
                    } else {
                        win = false;
                        td.style.color = '#f54242';
                        td.style.borderColor = '#f54242';
                    }
                }
            }
        }
    }
    console.log('test')
    return win;
}

function addResult() {
    let timeStr = `${returnNum(minute)}:${returnNum(second)}`;
    let result = {player: playerName, mapName:`${map.difficulty} ${map.size}x${map.size} map`, time: timeStr};
    results.push(result);
    localStorage.setItem('latestResults', JSON.stringify(results));
}

function createResultTable() {
    results.forEach(result => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        td1.innerHTML = result.player;
        td2.innerHTML = result.mapName;
        td3.innerHTML = result.time;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        resultsTable.appendChild(tr);
    });
}

function clearMap(table) {
    for (let i = 0; i < map.size; i++) {
        for (let j = 0; j < map.size; j++) {
            let td = table.childNodes[i].childNodes[j];
            if (!td.classList.contains('black')) {
                td.classList.remove('red', 'yellow');
                td.classList.add('white');
            }
        }
    }
}

function restartGame() {
    winMessage.hidden = true;
    win = false;
    generateMap(gameTable); 

    minute = 0;
    second = 0;
    secondElem.innerHTML = '00';
    minuteElem.innerHTML = '00';
    clearInterval(timerElem);
    timerElem = setInterval(() => {timer();}, 1000);   
}

function timer() {
    if ((second+=1) == 60) {
        second = 0;
        minute++;
    }
    secondElem.innerHTML = returnNum(second);
    minuteElem.innerHTML = returnNum(minute);
}

function returnNum(input) {
    return input >= 10 ? input : `0${input}`;
}

function getNewMap(size) {
    let ob = {difficulty: 'Custom', size: parseInt(size)}
    let arrBSquares = [];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let td = editorTable.childNodes[y].childNodes[x];
            if (td.classList.contains('black')) {
                arrBSquares.push([x, y, parseInt(td.childNodes[0].value)]);
            }
        }
    }    
    ob.blackSquares = arrBSquares;
    return ob;
}

function generateEditableBlackSquares(customMap) {
    customMap.blackSquares.forEach(element => {
        let blackSquare = editorTable.childNodes[element[1]].childNodes[element[0]];
        blackSquare.classList.replace('white', 'black');
        createSelector(blackSquare, 5);
    });
}
