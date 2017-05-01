var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var express = require('express');
var Sequelize = require('sequelize');
var sessions = require('client-sessions');

var sequelize = new Sequelize('mysql://root@localhost/journal_db', { logging: false });

// first define the model 
var User = sequelize.define('users', {
    user_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: { msg: 'Account is already registered' },
        validate: {
            isEmail: { msg: "Please enter a valid email address" }
        }
    },
    password: Sequelize.STRING,
    role: Sequelize.INTEGER,
},
    {
        timestamps: false,

    });



var app = express();
app.set('view engine', 'jade');

//middleware
app.use(express.static(__dirname + '/css')); // make our css dir available for public requests
app.use(express.static(__dirname + '/client')); // Angular client application
app.use(express.static(__dirname + '/client/src')); // Angular client application

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(sessions({
    cookieName: 'session',
    secret: 'iekdxosld32929skd85432323cvmbbzm3e', // any random string
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
        errors.push('Password must contain at least 6 letters');
    }

    if (req.body.password !== req.body.password_dup) {
        errors.push('Passwords don\'t match');
    }

    if (errors.length !== 0) {

        res.render('register.jade', {
            error: errors
        });

    } else { // passed the simple validation

        //generate the bcrypt hash.
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        var user = User.build({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email, //validate using sequelize
            password: hash // Storing password hash in database, not in plain text!
        });

        user.save().then(function () {

            req.session.user = user;

            res.redirect('/dashboard'); // GET /dashboard

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

                req.session.user = user; //store the user

                res.redirect('/dashboard');
            } else {
                res.render('login.jade', {
                    error: 'Invalid email or password.'
                });
            }
        }
    }).catch(function (err) {

    });
});



// non Angular2 redirect for clever user
app.get('/topic/:id', function (req, res) {
    res.redirect('/dashboard')
    //res.redirect('/dashboard/topic/' + req.params.id)
});



//get all users
app.get('/api/allusers', function (req, res) {

    User.findAll({}).then(function (users) {

        container = []
        users.forEach(function (user) { // so we can remove password from result
            var dummy = {} //empty object

            dummy.user_id = user.user_id
            dummy.firstName = user.firstName
            dummy.lastName = user.lastName
            dummy.email = user.email
            dummy.role = user.role

            container.push(dummy);
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(container));

    });
});

//get user by id
app.get('/api/getuser/:user_id', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var user_id = req.params.user_id

    User.findOne({
        where: { user_id: user_id }
    }).then(function (user) {

        if (user) {
            var dummy = {}

            dummy.firstName = user.firstName
            dummy.lastName = user.lastName
            res.send(JSON.stringify(dummy))
        }
    });
});

var Class = sequelize.define('classes', {
    class_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: Sequelize.INTEGER,
    title: Sequelize.STRING,
    description: Sequelize.STRING,
}, {
        timestamps: false,
    });

//get classes
app.get('/api/classes', function (req, res) {
    Class.findAll({}).then(function (classes) {
        if (classes) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(classes));
        }
    });
});

app.get('/api/classesbycreator', function (req, res) {

    //Get all classes created by the current user, only teachers can create classes so user must be a teacher
    Class.findAll({ where: { user_id: req.session.user.user_id } }).then(function (classes) {
        if (classes) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(classes));
        }
    });

});

// get role of user
app.get('/api/role', function (req, res) {

    dummy = {}

    if (req.session.user.role == 1) {
        dummy.role = "Administrator"
    } else if (req.session.user.role == 2) {
        dummy.role = "Teacher"
    } else if (req.session.user.role == 3) {
        dummy.role = "Student"
    }

    dummy.firstName = req.session.user.firstName
    dummy.lastName = req.session.user.lastName
    dummy.user_id = req.session.user.user_id


    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify( req.session.user.role ));
    res.send(JSON.stringify(dummy));

});

//get enrolled
var Enroll = sequelize.define('enrolls', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: Sequelize.INTEGER,
    class_id: Sequelize.INTEGER,
    enrolled: Sequelize.BOOLEAN
}, {
        timestamps: false,
    }
);

// Am I enrolled in this class?
app.get('/api/enrolled/:class_id', function (req, res) {

    if (req.session.user.role == 3) { // is a student

        Enroll.findOne({
            where: {
                user_id: req.session.user.user_id,
                class_id: req.params.class_id
            }
        }).then(function (enroll) {

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(enroll));

        });


    } else {
        res.send('200');
    }

});

//who is enrolled
app.get('/api/allenrolled/:class_id', function (req, res) {


    if (req.session.user.role == 2) { // is a teacher

        //
        User.hasMany(Enroll, { foreignKey: 'user_id', foreignKeyConstraint: true });
        Enroll.belongsTo(User, { foreignKey: 'user_id', foreignKeyConstraint: true })

        Enroll.findAll({
            where: {
                class_id: req.params.class_id
            }, include: [User]
        }).then(function (enroll) { //an array
            container = []

            enroll.forEach(function (result) { // so we can remove password from result
                var dummy = {} //empty object

                dummy.id = result.id
                dummy.user_id = result.user_id
                dummy.class_id = result.class_id
                dummy.enrolled = result.enrolled
                dummy.firstName = result.user.firstName
                dummy.lastName = result.user.lastName

                container.push(dummy);
            });

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(container));

        });

    } else {
        res.send('200');
    }

});

//delete enrolled
app.post('/api/deleteenrolled', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var class_id = req.body.class_id;
    var user_id = req.body.user_id;

    Enroll.destroy({ // delete all posts under this topic
        where: {
            user_id: user_id,
            class_id: class_id
        }
    }).then(function () { // if that was successful
        res.send("200"); // topic and posts under it deleted
    });
});

//toggle role
app.post('/api/setrole', function (req, res) {

    if (req.session.user.role === 1) { // Administrator is taking this action

        res.setHeader('Content-Type', 'application/json');

        var user_id = req.body.user_id

        User.findOne({
            where: { user_id: user_id }
        }).then(function (user) {

            if (user) {
                if (user.role != 1) { //not trying to change administrator account

                    var role = 3; //default student

                    if (user.role == 2) { //toggle between student and teacher
                        role = 3;
                    } else if (user.role == 3) {
                        role = 2;
                    }

                    //update role
                    user.updateAttributes({ role: role }).then(function () { });
                }
            }
            res.send("200");
        });
    }
});

//confim enroll
app.post('/api/confirmenroll', function (req, res) {

    if (req.session.user.role === 2) { // Teacher is taking this action

        res.setHeader('Content-Type', 'application/json');

        var class_id = req.body.class_id
        var user_id = req.body.user_id

        Enroll.findOne({
            where: { class_id: class_id, user_id: user_id }
        }).then(function (enroll) {

            if (enroll) {
                enroll.updateAttributes({ enrolled: 1 }).then(function () { });
            }

            res.send("200");
        });
    }
});



//enrollment requests
app.post('/api/enroll', function (req, res) {

    if (req.session.user.role === 3) { // a student
        res.setHeader('Content-Type', 'application/json');

        var enroll = Enroll.build({
            user_id: req.session.user.user_id,
            class_id: req.body.class_id
        });

        enroll.save().then(function () {
            res.send("200");
        }).catch(function (err) {
            // print the error details
            console.log(err);
        });
    }

});

//post classes
app.post('/api/classes', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var _class = Class.build({
        user_id: req.session.user.user_id,
        title: req.body.title,
        description: req.body.description,
    });

    _class.save().then(function () {
        res.send("200");
    });

});

/* POSTS Table*/
var Post = sequelize.define('posts', {
    post_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    topic_id: Sequelize.INTEGER,
    user_id: Sequelize.INTEGER,
    created: Sequelize.DATE,
    content: Sequelize.STRING,
}, {
        timestamps: false,
    }
);

//posts by topic id
app.get('/api/posts/:id', function (req, res) {

    User.hasMany(Post, { foreignKey: 'user_id', foreignKeyConstraint: true });
    Post.belongsTo(User, { foreignKey: 'user_id', foreignKeyConstraint: true })

    Post.findAll({ where: { topic_id: req.params.id }, include: [User] }).then(function (posts) { //an array

        container = []

        if (posts) {


            posts.forEach(function (post) { // so we can remove password from result

                if (post.user) {
                    var dummy = {} //empty object

                    dummy.id = post.post_id
                    dummy.topic_id = post.topic_id
                    dummy.user_id = post.user_id
                    dummy.content = post.content
                    dummy.user = post.user.firstName + " " + post.user.lastName
                    //dummy.lastName = post.user.lastName

                    container.push(dummy);
                }
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(container));

    });


    /*Post.findAll({ where: { topic_id: req.params.id } }).then(function (post) {

        if (post) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(post));
        }
    }).catch(function (err) {

    });*/
});

app.post('/api/posts/:id', function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    
    var post = Post.build({
        topic_id: req.params.id,
        user_id: req.session.user.user_id,
        created: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
        content: req.body.content,
    });

    post.save().then(function () {

        res.send("200");

    });

});

/*
app.get('/*', function (req, res) {
    res.render('dashboard.jade');
});*/

//app.get('*', function (req, res) {
app.get('/dashboard', function (req, res) {
    if (req.session && req.session.user) {
        User.findOne({
            where: {
                email: req.session.user.email
            }
        }).then(function (user) {
            if (!user) { // did not return a record of user
                req.session.reset();
                res.redirect('/login');
            } else {

                res.locals.user = user; // make user object available to template

                res.render('dashboard.jade');
            }
        }).catch(function (err) {

        });
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function (req, res) {
    req.session.reset();
    res.redirect('/')
});



/**/
var Topic = sequelize.define('topics', {
    topic_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    class_id: Sequelize.INTEGER,
    user_id: Sequelize.INTEGER,
    created: Sequelize.DATE,
    heading: Sequelize.STRING,
}, {
        timestamps: false,
    }
);

/*Used during devlopment*/
/*
app.get('/topics', function (req, res) {

    Topic.findAll({}).then(function (topics) {
        if (topics) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(topics));
        }
    }).catch(function (err) {

    });

});*/

//topics by class_id
app.get('/api/topics/:class_id', function (req, res) {
    Topic.findAll({ where: { class_id: req.params.class_id } }).then(function (topics) {

        if (topics) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(topics));
        }
    }).catch(function (err) {

    });
});


//hasClasses
app.get('/api/hasclass/:user_id', function (req, res) {

    let dummy = {
            hasClass: false
    }

    Class.findOne({ where: { user_id: req.params.user_id } })
    .then(  function ( _class ) {

        res.setHeader('Content-Type', 'application/json');

        if (_class) { // there is a class with this user/creator id
            dummy.hasClass = true
        }
        
        res.send( JSON.stringify( dummy ) );

    }).catch(function (err) {

    });
});

//delete user
app.delete('/api/user/:user_id', function  (req, res) {
    if (req.session.user.role == 1) { // is an administrator

        Class.findOne({ where: { user_id: req.params.user_id } })
        .then(function (_class) {

            if (!_class) { // user doesn't have classes
                User.destroy({
                    where: {
                        user_id: user_id // delete the topic
                    }

                })
                .then(function () {
                    res.send("200"); // delete successful
                });
            }

        });
    }
});

//delete class
app.delete('/api/class/:class_id', function  (req, res) {
    if ((req.session.user.role == 1) || (req.session.user.role == 2) ) { // is an administrator or teacher
     
        Class.findOne({ where: { class_id: req.params.class_id } })
        .then(function (_class) {

            if (_class) { // found it

                //may have mutiple Topics
                Topic.findAll( { where: { class_id: _class.class_id } } )
                .then( function ( topics ) {

                    if ( topics ) {
                        topics.forEach( function ( topic) {

                           //single post
                           Post.findOne({ where: { topic_id: topic.topic_id } })
                           .then( function ( post ) {
                               if ( post ) {
                                   post.destroy()
                               }
                               res.send("200"); // delete successful
                           }) 

                         topic.destroy()
                        })  
                    }
                })
             _class.destroy()
            }
        });
    }
});

//delete topic
app.delete('/api/topic/:id', function (req, res) {

    if (req.session.user.role == 2) { // is a teacher

        res.setHeader('Content-Type', 'application/json');

        var topic_id = req.params.id;

        Post.destroy({ // delete all posts under this topic

            where: {
                topic_id: topic_id
            }

        }).then(function () { // if that was successful

            Topic.destroy({

                where: {
                    topic_id: topic_id // delete the topic
                }

            }).then(function () {

                res.send("200"); // topic and posts under it deleted

            });

        });
    }
});


app.post('/topics', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var topic = Topic.build({
        class_id: req.body.class_id,
        user_id: req.session.user.user_id,
        created: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
        heading: req.body.heading,
    });

    topic.save().then(function () {

        res.send("200");

    });

});

app.listen(3000);
