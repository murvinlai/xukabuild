/*
 * HTTP Server to run the express app server on multiple domains. 
 * 
 */
/* global variable */

global.rootPath = __dirname;
global.appSystem = {};	
global.async = require('async');
global.argv = require('optimist')
			.default('port', false)
			.default('apps', false)
			.default('env', false)
			.argv;

// modules. 
var express = require('express'),
	qs = require('querystring');
var helmet = require('helmet');

// server create
global.server = express();

// determine environment
if (argv.env !== false) {
	if (server.get('env') == 'production' && argv.env != 'production') {
		console.log("Conflict with setting environment.  NODE_ENV and --env not agree with each other. Please use only one. ");
		process.exit(1);
	} else if (server.get('env') == 'production' && argv.env == 'production') {
		// do nothing. in production
		console.log("In Production Mode.");
	} else {
		console.log("NODE_ENV is set to: " + server.get('env'));
		console.log("You are running as " + argv.env  + " because you explicitly passing in env variable for " + argv.env);
		server.set('env', argv.env);
	}
} else {
	if (server.get('env') == 'production'){
		console.log("In Production Mode.");
	}
}

// load local modules.
global.cfg = require('./lib/config');

var	systemInit = require('./lib/systemInit'),
	buildApp = require('./apps/buildApp').app
	;
systemInit.init();	// run system admin to read config file and put that into build_config  or cfg
			
/* handle uncaught exception */
process.on('uncaughtException', function (ex) {
	console.error(ex + "\n" + ex.stack);
	console.log("UncaughtException: " + ex);
	console.log("Stack: " + ex.stack);
	process.nextTick(function() { console.log("After uncaughtException")} );
});



global.port = cfg.build_app_port;

/* get parameters */
if (argv.port !== false) {
	port = parseInt(argv.port, 10);
}


var bodyDefault = function() {
	
	return function(req, res, next) {
		if (! req.body) req.body = {};
		next();
	};
}

/* Server Set up & config*/
server.use(express.favicon());
server.use(express.methodOverride());
server.use(express.cookieParser());
server.use(express.json());
server.use(express.urlencoded());
//server.use(express.multipart());
server.use(helmet.xframe());
server.use(helmet.iexss());
server.use(helmet.contentTypeOptions());
server.use(helmet.cacheControl());
server.use(express.session({
	secret: cfg.session_secret,
	cookie: { domain: cfg.build_app_domain, httpOnly: true },
    maxAge: new Date(Date.now() + 3600000)

}));

server.use(express.csrf());
server.use(function (req, res, next) {
	res.locals.csrftoken = req.csrfToken();
    next();
});
server.use(server.router);  

server.use(bodyDefault());
 

console.log(" Check Production / Dev");
/* environment specific setting */
server.configure('production',function() {
		// app.use(express.errorHandler());
		server.use(express.errorHandler({
			dumpException: true,
			showStack: true
		}));
});


// debug inspection. 
server.on('request', function(req, res) {
	console.log("OK.. data ");
});

console.log("Config: " + JSON.stringify(cfg));

server.use(express.vhost(cfg.build_app_domain, buildApp));



server.get('/health', function(req, res) {
	//webApp.testRest();
	var ts = Date.now();
	res.send('<div>health is good.  TS: '+ts+ '</div>');
});

/* Start Server */

server.listen(port);

console.log("Server Running on Port: " + port );
