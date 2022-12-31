/*Rendre Greyling
ODP6c6
Web Programming Assignment 1*/

let selectSection = document.querySelector('#mapSelector');
let gameSection = document.querySelector('#gameArea');
let editorSection = document.querySelector('#mapEditor');
let nameSection = document.querySelector('#enterName');
let descriptionSection = document.querySelector('#description');
let homeSection = document.querySelector('#homeSection');
let mapEditorInnerDiv = document.querySelector('#mapEditorInner');
let createNewMapDiv = document.querySelector('#createNewMap');
let loadEditMapDiv = document.querySelector('#loadEditMap');
let loadSavedGameDiv = document.querySelector('#loadSavedSection');
let previousResultsDiv = document.querySelector('#resultSection');

let selectTable = document.querySelector('#selectorTable');
let gameTable = document.querySelector('#gameTable');
let editorTable = document.querySelector('#editorTable');
let loadSavedGameTable = document.querySelector('#savedGameTable');
let resultsTable = document.querySelector('#resultTable');

let beginGame = document.querySelector('#beginGame');
let mapSelectorButton = document.querySelector('#mapSelectButton');
let mapEditorButton = document.querySelector('#mapEditorButton');
let loadSavedButton = document.querySelector('#loadSavedButton');
let startButton = document.querySelector('#startGame');
let restartButton = document.querySelector('#restartGame');
let saveGameButton = document.querySelector('#saveGame');
let createEmptyTable = document.querySelector('#generateTable');
let loadEditMapButton = document.querySelector('#loadMapEditButton');
let saveMapButton = document.querySelector('#saveMap');
let createNewMapButton = document.querySelector('#createNewMapButton');
let continueGameButton = document.querySelector('#continueGame');
let resultsButton = document.querySelector('#resultButton');

let player = document.querySelector('#playerName');
let welcomeMessage = document.querySelector('#welcomeMessage');
let selector = document.querySelector('#selector');
let editSavedSelector = document.querySelector('#editorSelector');
let loadSavedGameSelector = document.querySelector('#loadSavedGameSelector');
let tableInputSize = document.querySelector('#tableSize');
let winMessage = document.querySelector('#winMessage');
let noSavedGamesMessage = document.querySelector('#noSavedGames');

let minuteElem = document.querySelector('#minute');
let secondElem = document.querySelector('#second');
let minute = 0;
let second = 0;
let timerElem;

let playerName;
let lights = [];
let map;
let maps = [];
let win = false;
let editorSize = 0;
let customMaps = [];
let savedGames = [];
let playerSavedGames = [];
let results = [];

window.onload = function() {
    let storage = JSON.parse(localStorage.getItem('customMaps'));
    if (storage !== null) {
        customMaps = storage;
    } else {
        customMaps = [];
    }

    let saveStorage = JSON.parse(localStorage.getItem('saveGames'));
    if (saveStorage !== null) {
        savedGames = saveStorage;
    } else {
        savedGames = [];
    }

    let resultStorage = JSON.parse(localStorage.getItem('latestResults'));
    if (resultStorage !== null) {
        results = resultStorage;
    } else {
        results = [];
    }

    maps = mainMaps.concat(customMaps); 
    generateMapSelector(maps, selector);
}

function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}

beginGame.addEventListener('click', function() {
    playerName = player.value;
    nameSection.hidden = true;
    descriptionSection.hidden = false;
    welcomeMessage.innerHTML = `Welcome ${playerName}!`;
    homeSection.hidden = false;
});

mapSelectorButton.addEventListener('click', function() {
    map = maps[selector.value]
    generateMap(selectTable);
    selectSection.hidden = false;
    gameSection.hidden = true;
    editorSection.hidden = true;
    loadSavedGameDiv.hidden = true;
    previousResultsDiv.hidden = true;
    noSavedGamesMessage.hidden = true;
});

mapEditorButton.addEventListener('click', function() {
    selectSection.hidden = true;
    gameSection.hidden = true;
    editorSection.hidden = false;
    mapEditorInnerDiv.hidden = true;
    loadSavedGameDiv.hidden = true;
    previousResultsDiv.hidden = true;
    noSavedGamesMessage.hidden = true;
    editorTable.innerHTML = '';
    gameTable.innerHTML = '';
});

loadSavedButton.addEventListener('click', function() {
    selectSection.hidden = true;
    gameSection.hidden = true;
    editorSection.hidden = true;
    noSavedGamesMessage.hidden = true;
    previousResultsDiv.hidden = true;
    noSavedGamesMessage.hidden = true;
    loadSavedGameTable.innerHTML = '';
    gameTable.innerHTML = '';
    selectTable.innerHTML = '';

    playerSavedGames = savedGames.filter(object => object.player == playerName)
    if (playerSavedGames.map(object => object.mapObj).length === 0) {
        noSavedGamesMessage.hidden = false;
        loadSavedGameDiv.hidden = true;
    } else {
        loadSavedGameDiv.hidden = false;
        generateMapSelector(playerSavedGames.map(object => object.mapObj), loadSavedGameSelector);
        map = playerSavedGames.map(object => object.mapObj)[loadSavedGameSelector.value];
        generateTable(loadSavedGameTable, map.size);
        generateAllBlackSquares(loadSavedGameTable);
        lights = playerSavedGames[loadSavedGameSelector.value].lightArr;
        calcLighting(loadSavedGameTable);
        minute = playerSavedGames[loadSavedGameSelector.value].tMin;
        second = playerSavedGames[loadSavedGameSelector.value].tSec;
    }
}); 

resultsButton.addEventListener('click', function() {
    previousResultsDiv.hidden = false;
    selectSection.hidden = true;
    gameSection.hidden = true;
    editorSection.hidden = true;
    loadSavedGameDiv.hidden = true;
    noSavedGamesMessage.hidden = true;
    loadSavedGameTable.innerHTML = '';
    gameTable.innerHTML = '';
    resultsTable.innerHTML = '<tr><th>Player Name:</th><th>Map Name:</th><th>Time:</th></tr>';
    createResultTable();
});

continueGameButton.addEventListener('click', function() {
    selectSection.hidden = true;
    selectTable.innerHTML = '';
    editorTable.innerHTML = '';
    loadSavedGameTable.innerHTML = '';
    gameTable.innerHTML = '';
    gameSection.hidden = false;
    loadSavedGameDiv.hidden = true;
    win = false;
    winMessage.hidden = true;
    generateTable(gameTable, map.size);
    generateAllBlackSquares(gameTable);
    calcLighting(gameTable);

    clearInterval(timerElem);
    timerElem = setInterval(() => {timer();}, 1000); 
});

startButton.addEventListener('click', function() {
    selectSection.hidden = true;
    selectTable.innerHTML = '';
    editorTable.innerHTML = '';
    loadSavedGameTable.innerHTML = '';
    gameSection.hidden = false;
    loadSavedGameDiv.hidden = true;
    win = false;
    winMessage.hidden = true;
    generateMap(gameTable);

    minute = 0;
    second = 0;
    secondElem.innerHTML = '00';
    minuteElem.innerHTML = '00';
    clearInterval(timerElem);
    timerElem = setInterval(() => {timer();}, 1000);  
});

createEmptyTable.addEventListener('click', function() {
    editorTable.innerHTML = '';
    generateTable(editorTable, tableInputSize.value);
    editorSize = tableInputSize.value;
});

saveMapButton.addEventListener('click', function() {
    let ob;
    if (createNewMapDiv.hidden == false) {
        ob = getNewMap(editorSize);
        customMaps.push(ob);
    } else {
        ob = getNewMap(customMaps[editSavedSelector.value].size);
        customMaps[editSavedSelector.value] = ob;
    }
    maps = mainMaps.concat(customMaps); 
    generateMapSelector(maps, selector);
    generateMapSelector(customMaps, editSavedSelector);
    localStorage.setItem('customMaps', JSON.stringify(customMaps));
});

createNewMapButton.addEventListener('click', function() {
    mapEditorInnerDiv.hidden = false;
    loadEditMapDiv.hidden = true;
    createNewMapDiv.hidden = false;
    editorTable.innerHTML = '';
});

loadMapEditButton.addEventListener('click', function() {
    mapEditorInnerDiv.hidden = false;
    loadEditMapDiv.hidden = false;
    createNewMapDiv.hidden = true;
    editorTable.innerHTML = '';
    generateMapSelector(customMaps, editSavedSelector);
    generateTable(editorTable, customMaps[editSavedSelector.value].size);
    generateEditableBlackSquares(customMaps[editSavedSelector.value]);
});

editSavedSelector.addEventListener('change', function() {
    editorTable.innerHTML = '';
    generateTable(editorTable, customMaps[editSavedSelector.value].size);
    generateEditableBlackSquares(customMaps[editSavedSelector.value]);
});

saveGameButton.addEventListener('click', function() {
    let saveGame = {player: playerName, tMin: minute, tSec: second, mapObj: map, lightArr: lights}
    savedGames.push(saveGame);
    localStorage.setItem('saveGames', JSON.stringify(savedGames));
});

selector.addEventListener('change', function(e) {
    map = maps[e.target.value];
    generateMap(selectTable);
});

loadSavedGameSelector.addEventListener('change', function(e) {
    map = playerSavedGames.map(object => object.mapObj)[e.target.value];
    loadSavedGameTable.innerHTML = '';
    generateTable(loadSavedGameTable, map.size);
    generateAllBlackSquares(loadSavedGameTable);
    lights = playerSavedGames[e.target.value].lightArr;
    calcLighting(loadSavedGameTable);
    minute = playerSavedGames[e.target.value].tMin;
    second = playerSavedGames[e.target.value].tSec;
});

delegate(gameTable, 'click', 'td', function() {
    if (win != true && !this.classList.contains('black')) {
        if (this.innerHTML == '') {
            lights.push({x: this.cellIndex, y: this.parentElement.rowIndex});
            renderSingleLight(gameTable, {x: this.cellIndex, y: this.parentElement.rowIndex}, 1)
        } else {
            this.innerHTML = '';
            let arrIndex = lights.findIndex(light => {
                return light.x == this.cellIndex && light.y == this.parentElement.rowIndex;
            });
            lights.splice(arrIndex, 1);
            calcLighting(gameTable);
        }
        setTimeout(function() {
            if (checkWin()) {
                winMessage.hidden = false;
                clearInterval(timerElem);
                addResult();
                
            }
        }, map.size * 150);
    }
});

delegate(editorTable, 'click', 'td', function() {
    if (this.classList == 'white') {
        this.classList.replace('white', 'black');
        let x = this.cellIndex;
        let y = this.parentElement.rowIndex;
        let tSize = this.parentElement.childNodes.length - 1;
        if ((x === 0 && y === 0) || (x === tSize && y === 0) || (x === 0 && y === tSize) || (x === tSize && y===tSize)) {
            createSelector(this, selctorNumOptions(3,x,y,tSize));
        } else {
            if (x === 0 || x === tSize || y === 0 || y === tSize) {
                createSelector(this, selctorNumOptions(4,x,y,tSize));
            } else {
                createSelector(this, selctorNumOptions(5,x,y,tSize));
            }
        }
        
    }
});

delegate(editorTable, 'contextmenu', 'td', function(event) {
    event.preventDefault();
    if (this.classList == 'black') {
        this.innerHTML = '';
        this.classList.replace('black', 'white');
    }
});

restartButton.addEventListener('click', function() {
    restartGame();
});