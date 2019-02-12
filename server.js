// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

// routes
var AccountRoutes = require('./controllers/account_controller');

var HomeRoutes = require('./controllers/home_controller');

var port = process.env.PORT || 3000;

// express
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// session options
app.use(session({
    secret: 'some secret here',
    resave: false,
    saveUninitialized: false
}));

// user security
app.use(session({
    secret: 'randomstringsessionsecret'
}));

app.use('/', AccountRoutes.AccountRoutes);

app.use(function(req,res,next){
    if(req.session.email == null || req.session.email.length ==0 ){
        res.redirect('/login'); 
    }
    else{
      next();
    }
  });
  app.use('/',HomeRoutes.HomeRoutes);

app.listen(port);