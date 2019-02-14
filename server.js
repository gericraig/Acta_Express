var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var Sequelize = require('sequelize');
// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://postgres@localhost:5432/auth-system');
var User = require('./models/user');
var Entree = require('./models/entree');

// invoke an instance of express application.
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// set our application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


app.get('/dashboard', function(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        Entree.findAll({
            where: {userid: req.session.user.id}
        })
            .then(function (entrees) {
            res.render('dashboard', {title: 'Dashboard', heading: 'Dashboard', entrees: entrees});
        });
    }
    else { res.redirect('/login'); }
});

// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login', { title: 'Login', heading: 'Login' });
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            }
        });
    });

app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('signup', { title: 'ACTA - Signup', heading: 'Signup' });
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
            .then(user => {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            })
            .catch(error => {
                res.redirect('/signup');
            });
    });


app.get('/add', function(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('add', {title: 'Add', heading: 'Add'});
    }
    else { res.redirect('/login'); }
});

app.post('/add', function(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        Entree.create({
            userid: req.session.user.id,
            content: req.body.content
        })
            .then(user => {
                res.redirect('/dashboard');
            })
            .catch(error => {
                console.warn(error);
                res.redirect('/signup');
            });
    }
    else { res.redirect('/login'); }
});

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
