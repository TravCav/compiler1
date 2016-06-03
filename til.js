(function () {
    var fs = require('fs');	// so we can read and write files
    var exec = require('child_process').exec;

    var EmitFlags = {
        EmitScreen: 1,
        EmitFile: 2
    };

    var EmitMethod = EmitFlags.EmitFile | EmitFlags.EmitScreen;

    var fileOutput = "-";


    // this will abstract where the output goes
    function EmitLn(s) {
        if ((EmitMethod & EmitFlags.EmitScreen) === EmitFlags.EmitScreen) {
            console.log(s);
        }

        if ((EmitMethod & EmitFlags.EmitFile) === EmitFlags.EmitFile) {
            this.fileOutput += s + "\r\n";
        }
    }

    function Compile(inputLine) {
        var ouputLine = inputLine;
        ouputLine = ouputLine.replace(/nuthin/g, 'nop');
        EmitLn(ouputLine);
    }

    function CompileIL(filename) {
        exec(filename, function callback(error, stdout, stderr) {
            // result
        });
    }


    function ReadFile(filename) {
        console.log("Reading file: " + filename);
        var input = fs.createReadStream(filename);

        var remaining = '';

        input.on('data', function (data) {
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

        input.on('end', function () {
            if (remaining.length > 0) {
                Compile(remaining);
            }
        });

        console.log("File read");
    }

    function SaveToFile(filename) {
        if ((EmitMethod & EmitFlags.EmitFile) === EmitFlags.EmitFile) {
            console.log("Writing to file.");
            fs.writeFile(filename, fileOutput, function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            console.log("File Saved");
        }
    }

    // our jouney begins
    console.log('***begin***');
    ReadFile(process.argv[2]);
    SaveToFile(process.argv[3]);
    ////CompileIL();
    console.log('***end***');



})();