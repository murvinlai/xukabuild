
var express = require('express'),	
	_ = require('underscore-x'),
	url = require('url'),
	//ejs =  require('ejs'),
	ejsEngine = require('ejs-locals'),
	qs = require("querystring"),
	parse = require('url').parse,
	adminSecurity = require('../lib/adminSecurity'),
	app = express();
	
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

app.get('/', adminSecurity.restrict, function (req, res) {
	res.render('dashboard', { error:'', csrftoken:res.locals.csrftoken, cfg:cfg});
});

app.get('/*', adminSecurity.restrict, function (req, res) {
	var reqUrl = (req.url.length >0)?req.url:'/home';
	var urlObject = url.parse(reqUrl);
	var page = urlObject.pathname.substring(1);
	console.log("req url: " + reqUrl + " Page: "  + page);
	res.render(page, { error:'', csrftoken:res.locals.csrftoken, cfg:cfg});
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
