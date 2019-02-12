// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

// routes
var AccountRoutes = require('./controllers/account_controller');

var port = process.env.PORT || 3000;

// express
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// user security
app.use(session({secret: 'randomstringsessionsecret'}));

app.use('/',AccountRoutes.AccountRoutes);

app.listen(port);

