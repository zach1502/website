const P = require('bluebird');

let lineList = [];

let stylesElement;
let resumeElement;
let trueStyleElement = document.getElementById("true-style");

document.onreadystatechange = () => {
    // Need to wait for iframes to load
    if (document.readyState === 'complete') {
      ReadFile("initial");
      GetElements();
      StartAnimation();
    }
};

function ReadFile(fileId){
    let oFrame = document.getElementById(fileId);
    let strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    let arrLines = strRawContents.split("\n");
    
    lineList = lineList.concat(arrLines);
    console.log(lineList);
}

function GetElements(){
    stylesElement = document.getElementById("styles");
    resumeElement = document.getElementById("resume");
    trueStyleElement = document.getElementById("true-style");
}

const normal = 30;
const fast = 1;

async function StartAnimation(){
    let lineCount = 1;
    while(lineCount <= 33){
        await WriteLine(lineList.shift(), stylesElement, true, normal);
        lineCount++;
    }

    while(lineCount <= 49){
        await WriteLine(lineList.shift(), stylesElement, true, fast);
        lineCount++;
    }

    while(lineCount <= 56){
        await WriteLine(lineList.shift(), stylesElement, true, normal);
        lineCount++;
    }

    while(lineCount <= 74){
        await WriteLine(lineList.shift(), stylesElement, true, fast);
        lineCount++;
    }

    while(lineCount <= 80){
        await WriteLine(lineList.shift(), stylesElement, true, normal);
        lineCount++;
    }

    while(lineCount <= 101){
        await WriteLine(lineList.shift(), stylesElement, true, fast);
        lineCount++;
    }

    while(lineCount <= 112){
        await WriteLine(lineList.shift(), stylesElement, true, normal);
        lineCount++;
    }

    // Entering into resume section
    while(lineCount <= 160){
        await WriteLine(lineList.shift(), resumeElement, false, fast);
        lineCount++;
    }

    while(lineList.length > 0){
        await WriteLine(lineList.shift(), resumeElement, false, fast);
    }
}

async function WriteLine(line, element, isStyled, delay){
    // for each character in line
    for(let char of line){
        if(isStyled){
            WriteStyledChar(element, char, line);
            if(char === '.' || char === '!'){
                await P.delay(500);
            }
            else{
                await P.delay(delay);
            }
        }
        else{
            WriteSimpleChar(element, char);
            await P.delay(delay);
        }
    }
    window.scrollTo(0, document.body.scrollHeight);

    element.scrollTop = element.scrollHeight;

    outputBuffer += "\n";
    styledLineStorage += "\n";
    element.innerHTML += "<br>";
}

function WriteSimpleChar(element, char){
    element.innerHTML += char;
}


let styledLineStorage = ""; // insert into body
let outputBuffer = ""; // insert to style tag

async function WriteStyledChar(element, char, line){

    // add char to storages
    styledLineStorage += char;
    outputBuffer += char;

    // update element in body
    styledLineStorage = outputBuffer;
    styledLineStorage = addStylingToStorage(styledLineStorage);
    
    // update what the user sees
    element.innerHTML = styledLineStorage;

    // when char is not alphanumeric, update the style tag
    // (Avoids flickers)
    if(!char.match(/[a-zA-Z0-9]/)){
        trueStyleElement.innerHTML = outputBuffer;
        element.innerHTML = styledLineStorage;
    }

}

const selectComment = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
const selectNumber = /\d+/g;
const selectCssProperty = / {4}[a-zA-Z-]+:/g;
const selectCssValue = / .+;/g;
const selectCssSelector = /[*.a-zA-Z-]+  /g

function addStylingToStorage(styledLineStorage){

    styledLineStorage = styledLineStorage.replace(selectComment, (match) => {
        return `<span class="comment">${match}</span>`;
    });

    styledLineStorage = styledLineStorage.replace(selectNumber, (match) => {
        return `<span class="number">${match}</span>`;
    });

    // styledLineStorage = styledLineStorage.replace(selectCssValue, (match) => {
    //     return `<span class="value">${match}</span>`;
    // });

    styledLineStorage = styledLineStorage.replace(selectCssProperty, (match) => {
        return `<span class="property">${match}</span>`;
    });

    styledLineStorage = styledLineStorage.replace(selectCssSelector, (match) => {
        return `<span class="selector">${match}</span>`;
    });

    return styledLineStorage;
}

/*
    selector {
        property: value;
    }
*/