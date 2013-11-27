/*
 * this system admin will load the config into build_config
 */
if (!cfg) {
	global.cfg = require("./config.js");
}

global.build_config = require(cfg.build_config_path + cfg.build_config_name).config;





