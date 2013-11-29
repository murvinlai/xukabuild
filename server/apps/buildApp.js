
var express = require('express'),	
	_ = require('underscore-x'),
	url = require('url'),
	//ejs =  require('ejs'),
	ejsEngine = require('ejs-locals'),
	qs = require("querystring"),
	parse = require('url').parse,
	cfg = require('../lib/config'),
	Seq = require('seq'),
	adminSecurity = require('../lib/adminSecurity'),
	app = express();
	
app.engine('ejs', ejsEngine);	
app.set('view engine', 'ejs');
app.set('views', rootPath + '/views');

app.use(express.favicon());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.static(rootPath+'/public'));
app.use(app.router);
	

app.get('/test', function(req, res){
	var temp = "Subdomain: " + req.subdomains[0] + "<br>";
	temp += "Url: " + JSON.stringify(req.url) + "<br>";
	temp += "UserAgent: " + req.headers['user-agent'] + "<br>";
	res.send('<div>Output '+temp+'</div>');	
});



