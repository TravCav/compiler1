const fs = require('fs'); // so we can read and write files
const exec = require('child_process').exec;

var EmitFlags = {
    EmitScreen: 1,
    EmitFile: 2
};

var EmitMethod = EmitFlags.EmitFile | EmitFlags.EmitScreen;

var fileOutput = "";
var variables = [];

var inputFile = "app.til";
var outputFile = "app.il";

function EmitLn(s) {
    if ((EmitMethod & EmitFlags.EmitScreen) === EmitFlags.EmitScreen) {
        console.log(s);
    }

    if ((EmitMethod & EmitFlags.EmitFile) === EmitFlags.EmitFile) {
        fileOutput += s;
    }
}

function Compile(inputLine) {
    let outputLine = inputLine;
    outputLine = outputLine.replace(/\r/g, '');
    outputLine = outputLine.replace(/\n/g, '');
    outputLine = outputLine.replace(/^nuthin/g, 'nop');
    outputLine = outputLine.replace(/^load in/g, 'ldc.i4.s');
    outputLine = outputLine.replace(/^store to/g, 'stloc');
    outputLine = outputLine.replace(/^yodawg /g, '// ');
    outputLine = outputLine.replace(/^nothing to see here: /g, '// ');

    if (outputLine.indexOf(".locals") === 0) {
        const paren1 = outputLine.indexOf("(");
        const locals = outputLine.substring(paren1 + 1, outputLine.length - 1);
        const localsArray = locals.split(",");

        let arrLen = localsArray.length;
        while (arrLen-- > 0) {
            let local = localsArray[arrLen].trim().split(' ');
            variables.push({
                loc: local[0].replace('[', '').replace(']', ''),
                type: local[1],
                name: local[2] || ''
            });
        }
    }

    if (outputLine.indexOf("load") === 0 && outputLine.indexOf("into") > -1) {
        outputLine = outputLine.replace(/load/g, 'ldc.i4.s');
        outputLine = outputLine.replace(/into/g, '\rstloc');
    }

    if (outputLine.indexOf("save") === 0) {
        /*
        // make it do the locals thing
        .locals init ([0] int32 a, [1] int32 q)
        save a into 0 as 34
            */
        const intoIndex = outputLine.indexOf("into");
        const asIndex = outputLine.indexOf("as");
        const varName = outputLine.substring(5, intoIndex - 1);
        const locNum = outputLine.substring(intoIndex + 5, asIndex - 1);
        const valNum = outputLine.substring(asIndex + 3, outputLine.length);

        variables.push({
            loc: locNum,
            type: "int32",
            name: varName
        });
        outputLine = "ldc.i4.s " + valNum + " \rstloc " + locNum + "\r";
    }

    // // TinyNumber <varName> equals <number>
    // if (outputLine.indexOf("TinyNumber ") === 0) {
    //     var equalsIndex = outputLine.indexOf("equals");
    //     var varName = outputLine.substring(11,equalsIndex-1);
    //     // gotta get varNum from .locals and stuff
    //     var valNum = outputLine.substring(equalsIndex+varName.length + 3,outputLine.length);

    //     variables.push({name: varName, loc: valNum});
    //     outputLine = "ldc.i4.s " + valNum + " \rstloc " + locNum + "\r";
    // }

    if (outputLine.indexOf("go get ") === 0) {
        const goGetVarName = outputLine.substring(7, outputLine.length);
        for (let i = variables.length - 1; i >= 0; i--) {
            if (variables[i].name == goGetVarName) {
                outputLine = "ldloc.s " + variables[i].loc + "\r";
            }

        }
    }

    if (outputLine.indexOf("tell the world about ") === 0) {
        const tellVarName = outputLine.substring(21, outputLine.length);
        for (let i = variables.length - 1; i >= 0; i--) {
            if (variables[i].name == tellVarName) {
                outputLine = "ldloc.s " + variables[i].loc + "\rcall void [mscorlib]System.Console::WriteLine(int32)";
            }

        }
    }

    EmitLn(outputLine + "\n");
}

// function CompileIL(filename) {
//     exec(filename, function callback(error, stdout, stderr) {
//         // result
//     });
// }


function ReadFile() {
    console.log("Reading file: " + inputFile);
    const input = fs.createReadStream(inputFile);

    let remaining = '';

    input.on('data', function (data) {
        remaining += data;
        let index = remaining.indexOf('\n');
        let last = 0;
        while (index > -1) {
            let line = remaining.substring(last, index);
            last = index + 1;
            Compile(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', function () {
        if (remaining.length > 0) {
            Compile(remaining);
        }

        console.log('variables: ', variables);
        SaveToFile();
    });

    console.log("File read");
}

function SaveToFile() {
    if ((EmitMethod & EmitFlags.EmitFile) === EmitFlags.EmitFile) {
        console.log("Writing to file: " + outputFile);
        fs.writeFile(outputFile, fileOutput, function (err) {
            if (err) {
                return console.log(err);
            }
        });

        console.log("File Saved");
    }
}

// our jouney begins
console.log('***begin***');
const appName = process.argv[2] || "app";
inputFile = appName + ".til";
outputFile = appName + ".il";
ReadFile();
console.log('***end***');