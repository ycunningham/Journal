var express = require('express');

var bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');

var Sequelize = require('sequelize');


/**
 *  DATABASE CONNECTION
 */
var sequelize = new Sequelize('mysql://root@localhost/journal_db');

var sessions = require("client-sessions");


//first define the model
var User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: {
            msg: 'Account is already registered'
        },
        validate: {
            isEmail: {
                msg: "Please enter a valid email address"
            }
        }
    },
    password: Sequelize.STRING
}, {
    timestamps: false
});

/*
//Test
var user = User.build({
    firstName: 'Yuliana',
    lastName: 'Cunningham',
    email: 'user@email.com',
    password: 'pass'
});

user.save();
*/

var app = express();
app.set('view engine', 'jade');

//middleware
app.use(express.static(__dirname + '/css')); //make our css dir available for public requests
app.use(express.static(__dirname + '/client')); //Angular client application
app.use(express.static(__dirname + '/client/src')); //Angular client application

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(sessions({
    cookieName: 'session',
    secret: 'dfjeifakjgkejlksafoubakjd0953io9adfj',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app.get('/', function (req, res) {
    res.redirect('/dashboard');
});

app.get('/register', function (req, res) {
    res.render('register.jade');
});

app.post('/register', function (req, res) {
    var errors = [];

    //some simple validation
    if (req.body.password.length < 6) {
        errors.push('Password must contain 6 or more characters');
    }
    if (req.body.password !== req.body.password_dup) {
        errors.push('Passwords do not match');
    }
    if (errors.length !== 0) {
        res.render('register.jade', {
            error: errors
        });

    } else { //passed the simple validation
        // res.json(req.body);

        // generate the bcrypt hash
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        var user = User.build({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash //storing password hash in database, not in plain text
        });

        user.save().then(function () {
            req.session.user = user;
            res.redirect('/dashboard'); //GET /dashboard

        }).catch(function (result) { //catch validation errors
            result.errors.forEach(function (errorObj) {
                errors.push(errorObj.message);
            });
            res.render('register.jade', {
                error: errors
            });
        });
    }
});

// var user = User.build({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password

// });

// user.save().then(function () {
// res.redirect('/dashboard');
// }).catch(function (err) {
// //todo, handle errors
// console.log(err);
// });
// });

app.get('/login', function (req, res) {
    res.render('login.jade');
});

app.post('/login', function (req, res) {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (!user) {
            res.render('login.jade', {
                error: 'Invalid email or password.'
            });
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;
                res.redirect('/dashboard');

            } else {
                res.render('login.jade', {
                    errror: 'Invalid email or password'
                });
            }
        }
    }).catch(function (err) {
        console.log(err);
    });
});

app.get('/dashboard', function (req, res) {
    if (req.session && req.session.user) {
        User.findOne({
            where: {
                email: req.session.user.email
            }
        }).then(function (user) {
            if (!user) {
                req.session.reset();
                res.redirect('/login');

            } else {
                res.locals.user = user;
                res.render('dashboard.jade');
            }
        }).catch(function (err) {
            console.log(err);
        });
    } else {
        res.redirect('/login');
    }

});

app.get('/logout', function (req, res) {
    req.session.reset();
    res.redirect('/');
});
app.listen(3000);