const fs = require('fs'); // so we can read and write files
let tempToken = '';
let readIndex = 0;
let program = {
    variables: [],
    tokens: []
};

var data = fs.readFileSync('app.til', {
    encoding: 'utf8'
}) + "\r\n";

console.log("---Start File---");
console.log(data);
console.log("---End File---");

function CheckForToken(possibleToken) {
    let foundToken = {};
    switch (possibleToken) {
        case "yodawg":
            let comment = TheRestofTheLine();
            foundToken = {
                tokenType: 'comment',
                value: comment
            };
            break;
        case "wordstuff":
            foundToken = MakeVariable('string');
            break;
        case "mathstuff":
            foundToken = MakeVariable('number');
            break;
        case "peepthis":
            foundToken = OutputStuff();
            break;
        default:
            foundToken = {
                tokenType: 'unknown',
                value: possibleToken
            };
            break;
    }

    console.log(foundToken);
    return foundToken;
}

function GetVariable(varName) {
    let foundVar = null;
    for (let index = 0; index < program.variables.length; index++) {
        let element = program.variables[index];
        if (element.name === varName ) {
            return element;
        }
    }

    return foundVar;
}

function MakeVariable(variableType) {
    let varName = NextWord();
    let varValue = TheRestofTheLine();
    const varObject = {
        tokenType: 'variable',
        varType: variableType,
        name: varName,
        value: varValue
    };

    let varFound = false;
    for (let index = 0; index < program.variables.length; index++) {
        let element = program.variables[index];
        if (element.name === varName ) {
            program.variables[index] = varObject;
            varFound = true;
        }
    }

    if(!varFound) {
        program.variables.push(varObject);
    }
  
    return varObject;
}


function NextWord() {
    let scanChar = "";
    let word = "";
    do {
        word += scanChar;
        scanChar = Read();
    } while (scanChar != " " && scanChar != "\r" && scanChar != "\n");

    return word;
}

function OutputStuff() {
    const varName = TheRestofTheLine();
    const outputVariable = GetVariable(varName);

    outputToken = { type: 'output', outVar: outputVariable };

    return outputToken;
}

function Read() {
    return data[readIndex++];
}

function TheRestofTheLine() {
    let scanChar = "";
    let lineContents = "";
    while (scanChar != "\r" && scanChar != "\n") {
        lineContents += scanChar;
        scanChar = Read();
    }

    return lineContents;
}

while (readIndex < data.length) {
    let token = "";
    let currentChar = Read();
    //console.log(currentChar);
    switch (currentChar) {
        case " ":
        case "\r":
        case "\n":
            if (tempToken > '') {
                token = CheckForToken(tempToken);
                program.tokens.push(token);
                tempToken = "";
            }
            break;
        default:
            tempToken += currentChar;
            break;
    }
}

console.log(program);