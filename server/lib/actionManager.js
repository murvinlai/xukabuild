var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var logManager = require('./logManager');

module.exports.scriptExec = function(data, next) {
	console.log("Script Exec");
	
	var otherParamsStr = data.buildNumber || 0;
	var script = path.resolve(cfg.build_file_root_path + cfg.build_file_name + " " + otherParamsStr);
	
	console.log("running script " + script);
	

	exec(script, function(err, stdout, stderr){
		console.log("Script is executed");
		console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        console.log('err: ' + err);
        var result = {
            stdout:stdout,
            stderr:stderr,
            error:err
        }
        
        logManager.saveLog({content:stdout}, function(err, data){
        	if (err) {
        		next(err);
        	} else {
        		next(null, result);
        	}
        } );
	});
}


