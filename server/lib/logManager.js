var fs = require('fs');
var _ = require('underscore');

if(_.isUndefined(buildNumber)){
	global.buildNumber = null;;
}

// LOG convention:
// <cfg.log_file_root_path>/<cfg.log_file_name_prefix>_YYYYMMDD_HHNNSS_<build_number>

var zeroPad = function(num, numZeros) {
	var n = Math.abs(num);
	var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
	var zeroString = Math.pow(10,zeros).toString().substr(1);
	if( num < 0 ) {
		zeroString = '-' + zeroString;
	}

	return zeroString+n;
}

var getBuildNumber = function() {
	console.log("getBuildNumber " + getBuildNumber);
	if (buildNumber) {
		return buildNumber;
	} else {
		var files = fs.readdirSync(cfg.log_file_root_path);
		var validLogFiles = _.filter(files, function(fileName){ return fileName.indexOf(cfg.log_file_name_prefix) >= 0; });
		if (validLogFiles.length == 0) {
			buildNumber = 0;
			return buildNumber;
		}
		validLogFiles.sort();
		var latest = validLogFiles[validLogFiles.length-1];
		var latestArray = latest.split("_");
		buildNumber = latestArray[latestArray.length-1];
		return buildNumber;
	}
}

var getNextLogName = function() {
	var d = new Date(); // local time. not utc
	return cfg.log_file_name_prefix + "_" + d.getFullYear() + zeroPad(d.getMonth +1, 2) + zeroPad(d.getDate, 2) + 
			"_" + zeroPad(d.getHours(), 2) + zeroPad(d.getMinutes(), 2) + zeroPad(d.getSeconds(), 2) + (getBuildNumber() + 1);
}

var advanceBuildNumber = function () {
	buildNumber = getBuildNumber(); 
	buildNumber++;
}


module.exports.getLatestLog = function(next) {
	fs.readdir(cfg.log_file_root_path, function(err, files) {
		if (err) {
			next(err);
		} else {
			var validLogFiles = _.filter(files, function(fileName){ return fileName.indexOf(cfg.log_file_name_prefix) >= 0; });
			if (validLogFiles.length == 0) {
				next({id:1, message:"No log file"});
			} else {
				validLogFiles.sort();
				var latest = validLogFiles[validLogFiles.length-1];
				next(null, {status:true, log:latest});
			}
		}
	});
		
}

module.exports.getAllLog = function(next) {
	fs.readdir(cfg.log_file_root_path, function(err, files) {
		if (err) {
			next(err);
		} else {
			var validLogFiles = _.filter(files, function(fileName){ return fileName.indexOf(cfg.log_file_name_prefix) >= 0; });
			if (validLogFiles.length == 0) {
				next({id:1, message:"No log file"});
			} else {
				validLogFiles.sort();
				next(null, {status:true, logs:validLogFiles});
			}
		}
	});
}

module.exports.getLogContent = function(data, next) {
	// data.name is the log name
	if (!data.name) {
		next({status:false, err: "File name is empty"});
	} else {
		var fileFullPath = cfg.log_file_root_path + data.name;
		fs.readFile(fileFullPath, function(err, data) {
			if (err) {
				next(err);
			} else {
				next(null, {status:true, data:data});
			}
		});
	}
}

module.exports.saveLog = function(data, next) {
	// data.name is the log name
	// data.content is the log content
	if (!data.content) {
		next({status:false, err: "File content is empty"});
	} else {
		if (data.name) {
			var fileFullPath = cfg.log_file_root_path + data.name;
		} else {
			// if no name specify, then use the getNextLogName
			var fileFullPath = cfg.log_file_root_path + getNextLogName();
			advanceBuildNumber();
		}
		
		var fileFullPath = cfg.log_file_root_path + data.name;
		fs.writeFile(fileFullPath, data.content, function(err) {
			if (err) {
				next(err);
			} else {
				next(null, {status:true});
			}
		});
	}
}
