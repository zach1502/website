const P = require('bluebird');

let lineList = [];

// Element references
let stylesElement;
let resumeElement;
let trueStyleElement = document.getElementById("true-style");

// Writing Delays in ms
const isDev = window.location.hostname === '127.0.0.1';
const normal = (isDev) ? 0 : 40;
const fast = (isDev) ? 0 : 5;
const ultra = 0;
const speechPause = 500;
let ignorePause = false;

// Storages
let styledLineStorage = ""; // insert into body
let outputBuffer = ""; // insert to style tag

// REGEX Matches
const selectComment = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
const selectNumber = /\d+/g;
const selectCssProperty = / {4}[a-zA-Z-]+:/g;
const selectCssValue = / .+;/g;
const selectCssSelector = /[*#:\(\).a-zA-Z-]+  /g

// State
let state;

document.onreadystatechange = () => {
    // Need to wait for iframes to load
    if (document.readyState === 'complete') {
      ReadFile("initial");
      GetElements();
      AddEventListeners();
      InitializeState();
      StartAnimation();
    }
};

function AddEventListeners(){
    stylesElement.addEventListener('input', function() {
        trueStyleElement.textContent = stylesElement.textContent;
    });
}

function ReadFile(fileId){
    let oFrame = document.getElementById(fileId);
    let strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    let arrLines = strRawContents.split("\n");
    
    lineList = lineList.concat(arrLines);
    // console.log(lineList);
}

function GetElements(){
    stylesElement = document.getElementById("styles");
    resumeElement = document.getElementById("resume");
    trueStyleElement = document.getElementById("true-style");
}

function InitializeState(){
    state = {
        element: stylesElement,
        isStyled: true,
        delay: normal,
    }
}

// Terrible way to do this, but it works
async function StartAnimation(){
    while(lineList.length > 0){
        await WriteLine(lineList.shift());
    }
}

async function WriteLine(line){
    if(CheckIfSpecialCommand(line)){
        return;
    }

    // for each character in line
    for(let char of line){
        if(state.isStyled){
            WriteStyledChar(char);
            if(!ignorePause && (char === '.' || char === '!' || char === '?')){
                await P.delay(speechPause);
            }
            else{
                await P.delay(state.delay);
            }
        }
        else{
            WriteSimpleChar(char);
            await P.delay(state.delay);
        }
    }
    window.scrollTo(0, document.body.scrollHeight);

    state.element.scrollTop = state.element.scrollHeight;

    if(state.isStyled){
        outputBuffer += '\n';
        styledLineStorage += '\n';
    }
    state.element.innerHTML += "<br>";
}

function CheckIfSpecialCommand(line){
    // checks if a line starts with ;
    if(line[0]==';'){
        // change the state
        let lineParts = line.split(" ");
        
        if(CheckIfDelayCommand(lineParts[1])){
            HandleDelayCommand(parseInt(lineParts[2]));
        }
        else if(CheckIfTogglePause(lineParts[1])){
            HandleTogglePauseCommand();
        }
        else{
            // styling command
            HandleStylingCommand(lineParts);
        }

        return true;
    }

    return false;
}

function CheckIfTogglePause(command) {
    return command === "TOGGLE_PAUSE";
}

function CheckIfDelayCommand(command){
    return command === "DELAY";
}

function HandleTogglePauseCommand() {
    ignorePause = !ignorePause;
}

async function HandleDelayCommand(delayDuration) {
    P.delay(parseInt(delayDuration));
}

function HandleStylingCommand(lineParts) {
    state.element = document.getElementById(lineParts[1]);
    state.isStyled = (lineParts[2] === "true" || lineParts[2] === "t");

    switch(parseInt(lineParts[3])){
        case 0:
            state.delay = ultra;
            break;
        case 1:
            state.delay = fast;
            break;
        case 2:
            state.delay = normal;
            break;
        default:
            state.delay = normal;
            break;
    }
}

function WriteSimpleChar(char){
    state.element.innerHTML += char;
}

async function WriteStyledChar(char){

    // add char to storages
    styledLineStorage += char;
    outputBuffer += char;

    // update element in body
    styledLineStorage = outputBuffer;
    styledLineStorage = addStylingToStorage(styledLineStorage);
    
    // update what the user sees
    state.element.innerHTML = styledLineStorage;

    // when char is not alphanumeric, update the style tag
    // (Avoids flickers)
    if(!char.match(/[a-zA-Z0-9]/)){
        trueStyleElement.innerHTML = outputBuffer;
        state.element.innerHTML = styledLineStorage;
    }

}

function addStylingToStorage(lineStorage){

    lineStorage = lineStorage.replace(selectComment, (match) => {
        return `<span class="comment">${match}</span>`;
    });

    lineStorage = lineStorage.replace(selectNumber, (match) => {
        return `<span class="number">${match}</span>`;
    });

    // lineStorage = lineStorage.replace(selectCssValue, (match) => {
    //     return `<span class="value">${match}</span>`;
    // });

    lineStorage = lineStorage.replace(selectCssProperty, (match) => {
        return `<span class="property">${match}</span>`;
    });

    lineStorage = lineStorage.replace(selectCssSelector, (match) => {
        return `<span class="selector">${match}</span>`;
    });

    return lineStorage;
}

/*
    selector {
        property: value;
    }
*/