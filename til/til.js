const fs = require('fs'); // so we can read and write files
let char = '';
let token = '';
let tempToken = '';
var data = fs.readFileSync('app.til', { encoding: 'utf8' });

console.log("---Start File---");
console.log(data);
console.log("---End File---");

function Reader(){
    let readIndex = 0;
    return function () {
        return data[readIndex++];
    };
}

let read = Reader();

function GetChar(){
    char = read();
    return char;
}

function FindToken() {
    GetChar();
    tempToken += char;
     if (tempToken == '.assembly ') {
         console.log('found assembly');
         tempToken = '';
         const nameToken = FindToken();
         return { type: 'assembly', name: nameToken };
     } else 
    if (char == ' ') {
        return tempToken.trim();
    } else {
        console.log('still just: ' + tempToken);
        return FindToken();
    }
}

console.log(FindToken());