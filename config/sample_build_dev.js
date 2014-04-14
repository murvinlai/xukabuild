module.exports.config = {
	build_project_title : "Test Build",
	build_app_domain_protocol : "http://",
	build_app_domain	: "build.xukabuild.ca",
	build_app_port		: 	3030,
	build_file_root_path:	"/home/ubuntu/scripts/",
	build_file_name:		"dev_to_prod_build.sh",
	build_admin: {
		username:"xxx",
		password:"xxx"
	},
	target_app_domain   : "xukabuild.ca",
	session_secret: "xxxx",
	log_file_root_path : "/var/log/",
	log_file_name_prefix: "xukalog_"
}
