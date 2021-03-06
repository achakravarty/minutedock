var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var uuid = require('node-uuid');

var config = require('../config.json');
var authTokenRepository = require('../repositories/authTokenRepository');
var userRepository = require('../repositories/userRepository');

passport.use(new GoogleStrategy(
	{
	    returnURL: config["host.url"] + ":" + config["https.port"] + '/auth/callback',
    	realm: config["host.url"] + ":" + config["https.port"] + '/'
  	},
  	function(identifier, profile, done) {
  		var authToken = uuid.v4();
  		var id = identifier.match(/^.*?id=(.*?)$/)[1];
      authTokenRepository.addAuthToken(authToken, id);
  		done(null, authToken);	
  	}
));

passport.serializeUser(function(authToken, done) {
  done(null, authToken);
});

passport.deserializeUser(function(authToken, done) {
  authTokenRepository.findIdentifier(authToken)
  .then(function(identifier) {
    done(null, {authToken : authToken, identifier:identifier});
  })
  .fail(function() {
    done(null, false, 'User session expired');  
  });
});

exports.login = function(req,res) {
	res.render('login.html');
};

exports.logout = function(req,res) {
  authTokenRepository.removeAuthToken(req.user.authToken);
  req.logout();  
  res.redirect('/');
};

exports.authLogin = passport.authenticate('google');

exports.callback = passport.authenticate('google', { successRedirect: '/auth/checkApiKey',
                                    failureRedirect: '/login' });

exports.checkApiKey = function(req,res) {
	userRepository.findUser(req.user.identifier)
  .then(function(user) {
    res.redirect('/#/');
  })
  .fail(function() {
    res.redirect('/#/register')
  });
};