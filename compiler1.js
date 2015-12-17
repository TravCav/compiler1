(function() {
console.log('begin');
var input = "4+6";	// this is the program i'm compiling
console.log(input);
var output = "";		// compiled code 

// Gets the next character 
function Reader(){
	var readIndex = 0;	// because scoping and stuff

	return function(){
		return input[readIndex++];
	}	
}

var read = Reader();
var look = ''; // current character we're looking at

function GetChar(){
	look = read();
	output += look;
	return look;
}

GetChar();
GetChar();


console.log(output);
console.log('end');
})();