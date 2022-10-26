function ReadFile(){
    let oFrame = document.getElementById("initial");
    let strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    let arrLines = strRawContents.split("\n");
    
    console.log(arrLines);
}