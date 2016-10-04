(function() {
    var fs = require('fs');	// so we can read and write files
    var exec = require('child_process').exec;
    
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
        var outputLine = inputLine;
        outputLine = outputLine.replace(/\r/g,'');
        outputLine = outputLine.replace(/\n/g,'');
        outputLine = outputLine.replace(/nuthin/g, 'nop');
        outputLine = outputLine.replace(/load in/g, 'ldc.i4.s');
        outputLine = outputLine.replace(/store to/g, 'stloc');
        
        if (outputLine.indexOf("load") > -1 && outputLine.indexOf("into") > -1){
            outputLine = outputLine.replace(/load/g, 'ldc.i4.s');
            outputLine = outputLine.replace(/into/g,'\rstloc');
        }
        
        if (outputLine.indexOf("save") > -1){
            /*
            // make it do the locals thing
            .locals init ([0] int32 a)
            save a into 0 as 34
             */
            var intoIndex = outputLine.indexOf("into");
            var asIndex = outputLine.indexOf("as");
            var varName =outputLine.substring(5,intoIndex-1);
            var locNum = outputLine.substring(intoIndex+5,asIndex-1);
            var valNum = outputLine.substring(asIndex+3,outputLine.length);
            
            variables.push({name: varName, loc: locNum});
            outputLine = "ldc.i4.s " + valNum + " \rstloc " + locNum + "\r";
        }
        
        if (outputLine.indexOf("go get ") > -1) {
            varName = outputLine.substring(7,outputLine.length);
            for(var i = variables.length-1; i >=0; i--){
                if (variables[i].name == varName){
                    outputLine = "ldloc.s " + variables[i].loc + "\r";
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
        var input = fs.createReadStream(inputFile);

        var remaining = '';

        input.on('data', function(data) {
            remaining += data;
            var index = remaining.indexOf('\n');
            var last = 0;
            while (index > -1) {
                var line = remaining.substring(last, index);
                last = index + 1;
                Compile(line);
                index = remaining.indexOf('\n', last);
            }

            remaining = remaining.substring(last);
        });

        input.on('end', function() {
            if (remaining.length > 0) {
                Compile(remaining);
            }
            
            SaveToFile();
        });

        console.log("File read");
    }

    function SaveToFile() {
        if ((EmitMethod & EmitFlags.EmitFile) === EmitFlags.EmitFile) {
            console.log("Writing to file.");
            fs.writeFile(outputFile, fileOutput, function(err) {
                if (err) {
                    return console.log(err);
                }
            });

            console.log("File Saved");
        }
    }

    // our jouney begins
    console.log('***begin***');
    var appName = process.argv[2] || "app";
    inputFile = appName + ".til";
    outputFile = appName + ".il";
    ReadFile();
    console.log('***end***');



})();