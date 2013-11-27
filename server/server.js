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
	qs = require('querystring'),
	MongoStore = require('connect-mongo')(express);
	//cluster = require('cluster'),
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
var cfg = require('./lib/config'),
	error = require('./lib/errorCode'),
	SITES = require('./model/site'),
	systemInit = require('./lib/systemInit'),
	webApp = require('./apps/webApp').app,
	adminApp = require('./apps/adminApp').app
	;

			
/* handle uncaught exception */
process.on('uncaughtException', function (ex) {
	console.error(ex + "\n" + ex.stack);
	console.log("UncaughtException: " + ex);
	console.log("Stack: " + ex.stack);
	process.nextTick(function() { console.log("After uncaughtException")} );
});



global.port = cfg.http_server_listen_port;
var sites = new SITES._class();

/* get parameters */
if (argv.port !== false) {
	port = parseInt(argv.port, 10);
}

if (argv.workers !== 0) {
	workers = parseInt(argv.workers, 10);
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
server.use(express.bodyParser());
server.use(helmet.xframe());
server.use(helmet.iexss());
server.use(helmet.contentTypeOptions());
server.use(helmet.cacheControl());
server.use(express.session({
	secret: cfg.session_secret,
	cookie: { domain: cfg.domainPrefix + cfg.domainName, httpOnly: true },
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({	
		    		db: cfg.db_session_name,
		    		host: cfg.db_ip,
		    		port: cfg.db_port,
		    		username: cfg.db_username,
		    		password: cfg.db_password
	})
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

/* Add apps */
/*
server.use('/rest/', bmRestApiApp).
		use('/', bmWebApp);
*/
global.domainList = cfg.domains;
global.normalizedDomainList = [];	// [{name:<subdomain>, fullname:<>}]  the subdomain is independent of environment. i.e. in dev, it is still "vancouver", not "dev.vancouver"

/*
 * 
 * Explicitly add davidhostetter.ca
 */
console.log("ADD SITE: DH");
var dhApp = express();
dhApp.all('/', function (req, res) {
	res.redirect('/home.html');
});
dhApp.use(express.static(__dirname + '/apps/davidhostetter.ca/public'));
server.use(express.vhost('davidhostetter.ca', dhApp));
server.use(express.vhost('*.davidhostetter.ca', dhApp));

// other apps
console.log("ADD SITE: dynamic");
server.addSubDomain = function(subDomain, fullName) {
	var canAdd = true;
	for (var i=0; i<normalizedDomainList.length;i++) {
		if (normalizedDomainList[i].name == subDomain) {
			canAdd = false;
			break;
		}	
	}
	if (canAdd) {
		server.use(express.vhost(cfg.domainPrefix + subDomain + "." + cfg.domainName, webApp));
		normalizedDomainList.push({name:subDomain, fullName:fullName});
	}
};

sites.find({active:true}, function (err, data) {
	if (err) {
		console.log("Unable to load sites");
	} else {
		for (var i=0; i<data.data.length; i++) {
			
			domainList.push(data.data[i].name + "." );	// [ 'vancvouer.', 'toronoto.', 'dev.vancouver.']
			if (data.data[i].name != 'default') {
				normalizedDomainList.push({name:data.data[i].name, fullName:data.data[i].fullName});
			}
		}	
		for (var i=0; i<domainList.length; i++ ) {
			var addHost = domainList[i] + cfg.domainPrefix + cfg.domainName;
			console.log("ADD Host: " + addHost);
			server.use(express.vhost(addHost, webApp));
		}
		console.log("Finish add host ");		
	}
});

// call system INit. 
console.log("System Init is called for dynamic sites");
systemInit.init();

console.log("ADD SITE: Admin: " + cfg.adminDomain + cfg.domainPrefix + cfg.domainName);
server.use(express.vhost(cfg.adminDomain + cfg.domainPrefix + cfg.domainName, adminApp));


/*
server.
		use(express.vhost('vancouver.approvedlendingcentres.com', webApp)).
		
		use(express.vhost('toronto.approvedlendingcentres.com', webApp)).
		use(express.vhost('www.approvedlendingcentres.com', webApp));
*/
server.get('/testRest', function(req, res) {
	//webApp.testRest();
	res.send('<div>good</div>');
});

/* Start Server */

server.listen(port);

console.log("Server Running on Port: " + port );
console.log("Security Mode: " + JSON.stringify(appSystem));
