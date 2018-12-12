var fs = require('fs'); // so we can read and write files
function SaveToFile() {
	if ((EmitMethod & EmitFlags.EmitFile) === EmitFlags.EmitFile) {
		console.log("Writing to file.");
		fs.writeFile("cp1.il", fileOutput, function (err) {
			if (err) {
				return console.log(err);
			}
		});
		console.log("File Saved");
	}
}

var exec = require('child_process').exec;

function CompileIL() {
	exec(' cp1.il', function callback(error, stdout, stderr) {
		// result
	});
}

var EmitFlags = {
	EmitScreen: 1,
	EmitFile: 2
};

var EmitMethod = EmitFlags.EmitScreen | EmitFlags.EmitFile;


console.log('***begin***');
var input = "4+5-(2*3)"; // this is the program i'm compiling
console.log("input: " + input);
var fileOutput = "";

// Gets the next character each time
function Reader() {
	var readIndex = 0; // because scoping and stuff

	return function () {
		return input[readIndex++];
	};
}


var look = ''; // current character we're looking at
var read = Reader(); // now we can just call read() and get the next character

function Add() {
	Match('+');
	Term();
	EmitLn('ADD (SP)+,DO');
}

function Divide() {
	Match('/');
	Factor();
	EmitLn('MOVE (SP)+,D1');
	EmitLn('DIVS D1, D0');
}

// this will abstract where the output goes
function EmitLn(s) {
	if ((EmitMethod & EmitFlags.EmitScreen) === EmitFlags.EmitScreen) {
		console.log(s);
	}

	if ((EmitMethod & EmitFlags.EmitFile) === EmitFlags.EmitFile) {
		fileOutput += s + "\r\n";
	}
}

function Expected(s) {
	throw (s + " Expected");
}

function Expression() {
	Term();
	while (look === '+' || look === '-') {
		EmitLn('MOVE D0,-(SP)');
		switch (look) {
			case '+':
				Add();
				break;
			case '-':
				Subtract();
				break;
			default:
				Expected('Addop');
				break;
		}
	}
}

function Factor() {
	if (look === '(') {
		Match('(');
		Expression();
		Match(')');
	} else {
		EmitLn('MOVE #' + GetNum() + ',D0');
	}
}

function GetName() {
	var tempLook = look;
	if (!IsAlpha(tempLook)) {
		Expected('Name');
	}

	GetChar();
	return tempLook;
}

function GetNum() {
	var tempLook = look;
	if (!IsDigit(tempLook)) {
		Expected('Integer');
	}

	GetChar();
	return tempLook;
}

function GetChar() {
	look = read();
	return look;
}

function Init() {
	GetChar();
}

function IsAlpha(c) {
	c = c.toLowerCase();
	return (c >= 'a' && c <= 'z');
}

function IsDigit(c) {
	c = parseInt(c);
	return (c >= 0 && c <= 9);
}

function Match(x) {
	if (look === x) {
		GetChar();
	} else {
		Expected('\'' + x + '\'');
	}
}

function Multiply() {
	Match('*');
	Factor();
	EmitLn('MULS (SP)+,D0');
}

function Subtract() {
	Match('-');
	Term();
	EmitLn('SUB (SP)+,D0');
	EmitLn('NEG D0');
}

function Term() {
	Factor();
	while (look === '*' || look === '/') {
		EmitLn('MOVE D0,-(SP)');
		switch (look) {
			case '*':
				Multiply();
				break;
			case '/':
				Divide();
				break;
			default:
				Expected('Mulop');
				break;
		}
	}
}

// our jouney begins here
Init();
Expression();

console.log('***end***');

SaveToFile();
////CompileIL();