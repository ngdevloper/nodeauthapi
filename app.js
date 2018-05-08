const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors')

const routes = require('./routes/index');
const users = require('./routes/users');



// Init app
const app = express();

// Routes Init
//const routes = require('./routes/user');
//app.use('/api', routes);

//Enable Cors
app.use(cors())

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

//Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    'secret': 'secret',
    saveUninitialized: true,
    resave: true
}))

// Passport Init
app.use(passport.initialize());
app.use(passport.session()); 

// express validator
app.use(expressValidator());

// Connect Flash
app.use(flash());

// Global Variable Flash
app.use((req, res, next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// app.get('/api', (req, res) => {
//     axios.get("http://localhost:3000/users").then((result) => {
//         res.json(result.data)
//     })
// })


app.use('/', routes);
app.use('/users', users);

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), () => console.log(`app listen on port ${app.get('port')}`))