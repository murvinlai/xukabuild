/*
 * this system admin will load the config into build_config
 */
if (!cfg) {
	global.cfg = require("./config.js");
}



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

