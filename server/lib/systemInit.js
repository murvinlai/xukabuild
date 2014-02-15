/*
 * this system admin will load the config into build_config
 */
var util = require('../lib/util');
if (!cfg) {
	global.cfg = require("./config.js");
}

global.appSystem.setCsrf = util.bool(global.argv.csrf);

module.exports.init = function () {
	global.build_config = require(cfg.build_config_path + cfg.build_config_name).config;

	// port specific thing from build_config to cfg
	for (key in build_config) {
		if (build_config.hasOwnProperty(key)) {
			cfg[key] = build_config[key];
		}
	}
	
	cfg.session_secret = build_config.session_secret;
}

global.build_process_message = [
	/* 0 */ "No current process running",
	/* 1 */ "Process is running",
	/* 2 */ "Process is completed",
	/* 3 */ "Error"
];

global.build_process = {
	status: 0, 
	message: build_process_message[0]
}

global.updateBuildProcess = function(status){
	console.log("updateBuildProcess is called with status: " + status);
	build_process.status = status;
	build_process.message = build_process_message[status];
	console.log("build process: " + JSON.stringify(build_process));
}
