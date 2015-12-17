(function() {
var fs = require('fs');	// so we can read and write files
function SaveToFile() {
	console.log("Writing to file.");
	fs.writeFile("cp1.il", output, function(err) {
		if(err) {
			return console.log(err);
		}
	}); 
	console.log("File Saved");
};

var exec = require('child_process').exec;
function CompileIL() { 
	exec('C:\Windows\Microsoft.NET\Framework\v4.0.30319\ilasm.exe cp1.il', function callback(error, stdout, stderr){
    // result
	});
};


console.log('***begin***');
var input = "4+6";	// this is the program i'm compiling
console.log("input: " + input);
var output = "";		// compiled code 

// Gets the next character each time
function Reader(){
	var readIndex = 0;	// because scoping and stuff

	return function(){
		return input[readIndex++];
	}	
};


var look = ''; // current character we're looking at
var read = Reader();	// now we can just call read() and get the next character

function Expected(s){
	throw (s + " Expected");
};

function GetName(){
	if (!IsAlpha(look)) {
		Expected('Name');
	}
	
	GetChar();
}

function GetNum(){
	var tempLook = look;
	if (!IsDigit(tempLook)) {
		Expected('Integer');
	}
	
	GetChar();
	return tempLook;
}

function Expression(){
	console.log('MOVE #' + GetNum() + ',D0');
};

function GetChar(){
	look = read();
	return look;
};

function Init(){
	GetChar();
};

function IsAlpha(c){
	c = c.toLowerCase();
	return (c >= 'a' && c <= 'z');
}

function IsDigit(c){
	c = parseInt(c);
	return (c >= 0 && c <= 9);
}

function Match(x){
	if (look == x){
		GetChar();
	} else {
		Expected('\'' + x + '\'');
	}
};

// our jouney begins here
Init();
Expression();

console.log("output: " + output);
console.log('***end***');

////SaveToFile();
////CompileIL();

})();