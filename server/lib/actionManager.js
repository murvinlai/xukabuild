var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

module.exports.scriptExec = function(data, next) {
	console.log("Script Exec");
	
	var otherParamsStr = ""; // write to log??
	var script = path.resolve(cfg.build_file_root_path + cfg.build_file_name + " " + otherParamsStr);
	
	console.log("running script " + script);
	

	exec(script, function(err, stdout, stderr){
		console.log("Script is executed");
		console.log(stdout);
        console.log(stderr);
        console.log(err);
        var result = {
            stdout:stdout,
            stderr:stderr,
            error:err
        }
        next(null, result);
	});
}



module.exports.publish = function (data, next) {
    var output = {};

    var fromfile = workspaceRoot + "/" + fileName;
    var tofile = repoRoot + "/data/stl/" + fileName;

    var fs = require('fs');

    fs.createReadStream(fromfile).pipe(fs.createWriteStream(tofile));

    var path = require("path");
    var script = path.resolve(__dirname + "/../scripts/push.sh " + repoRoot);

    console.log("running script " + script);

    var exec = require('child_process').exec

    exec(script, function(error, stdout, stderr){
		
        console.log(stdout);
        console.log(stderr);
        console.log(error);
        var result = {
            stdout:stdout,
            stderr:stderr,
            error:error
        }
        next(null, result)
        g_io.sockets.emit('publish', {status:true, data:output});   // annouce to whole world
        console.log("Emit Publish");
    })
}

