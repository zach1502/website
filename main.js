const P = require('bluebird');

let lineList = [];

let stylesElement;
let resumeElement;
let trueStyleElement = document.getElementById("true-style");

document.onreadystatechange = () => {
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

async function StartAnimation(){
    while(lineList.length > 0){
        await WriteLine(lineList.shift(), stylesElement, true, 20);
    }

}

async function WriteLine(line, element, isStyled, delay){
    // for each character in line
    for(let char of line){
        if(isStyled){
            WriteStyledChar(element, char, line);
        }
        else{
            WriteSimpleChar(element, char);
        }
        await P.delay(delay);
    }
    outputBuffer += "\n";
    styledLineStorage += "\n";
    element.innerHTML += "<br>";
}

async function WriteSimpleChar(element, char){
    element.innerHTML += char;
}

let styledLineStorage = ""; // insert into body
let outputBuffer = ""; // insert to style tag

function WriteStyledChar(element, char, line){

    // add char to storages
    styledLineStorage += char;
    outputBuffer += char;

    // update element in body
    styledLineStorage = outputBuffer;
    styledLineStorage = addStylingToStorage(styledLineStorage);
    element.innerHTML = styledLineStorage;

    // as soon as we hit a space, we use regex and surround relevant chunks with span tags
    
    // write into the style tag
    trueStyleElement.innerHTML = outputBuffer;
}

const selectComment = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
const selectNumber = /\d+/g;
const selectCssProperty = /-(\S+):/g;
const selectCssValue = /\s\S+;/g;
const selectCssSelector = /[*.a-zA-Z-]+  /g

let isComment = false;

function addStylingToStorage(styledLineStorage){

    styledLineStorage = styledLineStorage.replace(selectComment, (match) => {
        return `<span class="comment">${match}</span>`;
    });

    styledLineStorage = styledLineStorage.replace(selectNumber, (match) => {
        return `<span class="number">${match}</span>`;
    });

    // styledLineStorage = styledLineStorage.replace(selectCssSelector, (match) => {
    //     return `<span class="selector">${match}</span>`;
    // });

    // styledLineStorage = styledLineStorage.replace(selectCssProperty, (match) => {
    //     return `<span class="property">${match}</span>`;
    // });

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