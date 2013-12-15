/*
 * this system admin will load the config into build_config
 */
if (!cfg) {
	global.cfg = require("./config.js");
}



module.exports.init = function () {
	global.build_config = require(cfg.build_config_path + cfg.build_config_name).config;

	// port specific thing from build_config to cfg
	cfg.build_app_domain = build_config.build_app_domain;
	cfg.build_app_port = build_config.build_app_port;
	cfg.build_file_root_path = build_config.build_file_root_path;
	cfg.build_file_name = build_config.build_file_name;
	cfg.build_admin = build_config.build_admin;
	
	cfg.session_secret = build_config.session_secret;
}


