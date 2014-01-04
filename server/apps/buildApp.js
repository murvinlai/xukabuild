
var express = require('express'),	
	app = express(),
	_ = require('underscore-x'),
	url = require('url'),
	fs = require('fs'),
	//ejs =  require('ejs'),
	ejsEngine = require('ejs-locals'),
	qs = require("querystring"),
	async = require('async'),
	parse = require('url').parse,
	adminSecurity = require('../lib/adminSecurity'),
	actionManager = require('../lib/actionManager'),
	logManager = require('../lib/logManager');
	
app.engine('ejs', ejsEngine);	
app.set('view engine', 'ejs');
app.set('views', rootPath + '/views');

app.use(express.favicon());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
//server.use(express.multipart());
app.use(express.static(rootPath+'/public'));
app.use(app.router);
	

app.get('/test', function(req, res){
	var temp = "Subdomain: " + req.subdomains[0] + "<br>";
	temp += "Url: " + JSON.stringify(req.url) + "<br>";
	temp += "UserAgent: " + req.headers['user-agent'] + "<br>";
	res.send('<div>Output '+temp+'</div>');	
});

app.get('/login', function(req, res){
	if (req.session.adminUser) {
		// already login
		res.redirect('/home');
	} else {
		console.log("not login");
		
		res.render('login', {layout:false, error:'', csrftoken:res.locals.csrftoken, cfg:cfg});
	}
});

app.post('/login', adminSecurity.login);

app.get('/logout', adminSecurity.logout);

app.post('/logout', adminSecurity.logout);

app.post('/build', adminSecurity.restrict, function (req, res) {
	var passback = { status:false};
	async.waterfall([
		function(callback) {
			console.log("STEP 1");
			updateBuildProcess(1);
			actionManager.scriptExec(null, callback);
		},
		function(data, callback) {
			console.log("STEP 2 data: " + JSON.stringify(data));
			updateBuildProcess(2);
			passback.build_process = build_process;
			passback.status = true;
			res.json(passback);
		}
		
	], function(err, result){
		console.log("STEP ERROR");
		updateBuildProcess(4);
		passback.build_process = build_process;
		passback.err = err;
		res.json(passback);
	});
});

app.post('/log', adminSecurity.restrict, function(req, res){
	var passback = { status:false};
	async.waterfall([
		function(callback) {
			console.log("STEP 1");
			logManager.getLogContent({name:req.body.fileName}, callback);
		},
		function(data, callback) {
			console.log("STEP 2 data: " + JSON.stringify(data));
			passback.logContent = data.data;
			passback.status = true;
			res.json(passback);
		}
		
	], function(err, result){
		console.log("STEP ERROR");
		passback.err = err;
		res.json(passback);
	});
});

app.get('/', adminSecurity.restrict, function (req, res) {
	res.render('dashboard', { error:'', csrftoken:res.locals.csrftoken, cfg:cfg, data:{} });
});

app.get('/*', adminSecurity.restrict, function (req, res) {
	var reqUrl = (req.url.length >0)?req.url:'/home';
	var urlObject = url.parse(reqUrl);
	var page = urlObject.pathname.substring(1);
	console.log("req url: " + reqUrl + " Page: "  + page);
	
	var passback = { error:'', csrftoken:res.locals.csrftoken, cfg:cfg, data:{} };
	
	if (page == 'build') {
		passback.build_process = build_process;
	}
	
	if (page == 'view_config') {
		passback.data.script_content = fs.readFileSync(cfg.build_file_root_path + cfg.build_file_name);
	}
	
	if (page == 'view_log') {
		logManager.getAllLog(function(err, data){
			if (err) {
				if (err.id == 1) {
					passback.data.allLogs = [];
					res.render(page, passback);
				} else {
					res.render('error', err);
				}
			} else {
				passback.data.allLogs = data.logs;
				res.render(page, passback);
			}
		});
		
	} else {
		res.render(page, passback);
	}
});

// standard output
var output = function(req, res, data) {
	
	if (req.query.callback) {
		req.query.format = 'jsonp';
		req.body.format = 'jsonp';
	}
	
	if (req.query.format == 'json' || req.body.format == 'json') {
		res.json(data);
	} else if (req.query.format == 'jsonp' || req.body.format == 'jsonp') {
		res.jsonp(data);
	} else if (req.query.format == 'text' || req.body.format == 'text') {
		res.send(data);
	} else {
		res.send('<div>'+data+'</div>');
	}
}

module.exports.app = app;
