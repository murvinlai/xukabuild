


module.exports.restrict = function (req, res, next) {

	if (req.session.adminUser) {
		next();
	} else {
		console.log("Access Denied.  Require Login");
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
}


var authenticate = function (data, next) {
	var user = data.name;
	var password = data.password;
	  
	if (cfg.build_admin.username == user && cfg.build_admin.password == password ) {
		next(null, {
			status:true,
			user:user
		});
	  	
	} else {
		next({error:'Login Fail'});	
	}
}

module.exports.logout = function(req, res){
	// destroy the user's session to log them out
	// will be re-created next request
	req.session.destroy(function(){
		res.redirect('/');
	});
};

module.exports.directlogout = function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.render('directlogout_close');
    });
};

module.exports.login = function (req, res) {

	authenticate({
					name:req.body.name, 
					password:req.body.password		
			}, 
			function(err, data){
				console.log("Hmmm  " + JSON.stringify(data));
				console.log("Hmmm  ERR " + JSON.stringify(err));
				if (data && data.status && data.user) {
					// Regenerate session when signing in
					// to prevent fixation 
					req.session.regenerate(function(){
						// Store the user's primary key 
						// in the session store to be retrieved,
						// or in this case the entire user object
						req.session.adminUser = data.user;
						console.log("post login");
						res.redirect('/');
					});
				} else {
					req.session.error = 'Authentication failed, please check your '
						+ ' username and password.';
					console.log("post BACK");
					res.render('login', {layout:false, error:"Login Name and Password do not match. "});
		    }
	});
	
}

module.exports.directlogin = function (req, res) {

    authenticate({
                    name:req.query.username || req.body.username, 
                    password:req.query.password || req.body.password      
            }, 
            function(err, data){
                console.log("Hmmm  " + JSON.stringify(data));
                console.log("Hmmm  ERR " + JSON.stringify(err));
                if (data && data.status && data.user) {
                    // Regenerate session when signing in
                    // to prevent fixation 
                    req.session.regenerate(function(){
                        // Store the user's primary key 
                        // in the session store to be retrieved,
                        // or in this case the entire user object
                        req.session.adminUser = data.user;
                        console.log("post login");
                        res.render('directlogin_close');
                    });
                } else {
                    req.session.error = 'Authentication failed, please check your '
                        + ' username and password.';
                    console.log("post BACK");
                    res.render('login', {layout:false, error:"Login Name and Password do not match. "});
                }
    });
}





