const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//const usercontroller = require('../controllers/usercontroller');

//router.get('/getusers', usercontroller.getusers);


const apiurl = "http://localhost:3000/users";

// Register
router.get('/register', (req, res) => {
    res.render('register')
})


// Login
router.get('/login', (req, res) => {
    res.render('login')
})



router.post('/register', (req, res) => {
    let data = req.body;

    let name = data.name;
    let email = data.email;
    let password = data.password;
    let confirmpassword = data.confirmpassword;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();



    let errors = req.validationErrors();
    setTimeout(function () {
        if (errors) {
            res.status(400).json({
                success: false,
                errors: errors
            })
        } else {
            axios.get(apiurl)
                .then((result) => {
                    axios.post(apiurl, {
                        id: (result.data.length + 1),
                        name: name,
                        email: email,
                        password: password
                    }).then(function (result) {
                        let status = result.status;
                        if (status == 201) {
                            //req.flash('success_msg', 'Registration success, login now..')
                            //res.redirect('/users/login')
                            res.status(200).json({ success: true, message: result.data });
                        } else {
                            //res.render('register')
                            res.status(400).json({ success: false, errors: "Invalid data." })
                        }
                    })
                })
        }
    }, 5000)

})


async function getUserName(name) {
    try {
        const response = await axios.get(apiurl, {
            params: {
                name: name
            }
        });
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}


async function comparePassword(name, password, callback) {
    try {
        const response = await axios.get(apiurl, {
            params: {
                name: name,
                password: password
            }
        });
        console.log("response");
        callback(response);
        console.log("response-1");
        console.log(response);
    } catch (error) {
        console.error(error);
        callback(error);
    }
}

passport.use(new LocalStrategy(
    function (username, password, done) {
        getUserName(username).then((resu => {
            return done(null, false, { message: "Unknown user" })
        })).catch((error) => {
            console.log(error)
            throw error;
        })

        comparePassword(username, password, callback).then((resu => {
            console.log(resu)
            callback({ message: "Invalid name and password" });
            return done(null, false, { message: "Invalid name and password" })
        })).catch((error) => {
            console.log(error)
            callback({ message: error });
            throw error;
        })
    }
));

router.get('/getusername/:name/:password', (req, res) => {
    // getUserName(req.params.name).then((resu) => {
    //     res.json({ data: resu });
    // })

    comparePassword(req.params.name, req.params.password, function (data) {
        console.log(data);
        console.log("response-2");
    })
})


router.post('/login', (req, res) => {

    let data = req.body;
    axios.get(apiurl, {
        params: {
            email: data.email
        }
    }).then(function (result) {
        if (result.data.length == 0) return res.status(404).send('No user found.');
        return res.status(200).send({ auth: true, token: result.data });
    }).catch(function (error) {
        console.log(error);
        res.status(500).send('Error on the server.');
    });;

    // User.findOne({ email: req.body.email }, function (err, user) {
    //     if (err) return res.status(500).send('Error on the server.');
    //     if (!user) return res.status(404).send('No user found.');
    //     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    //     if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    //     var token = jwt.sign({ id: user._id }, config.secret, {
    //       expiresIn: 86400 // expires in 24 hours
    //     });
    //     res.status(200).send({ auth: true, token: token });
    //   });
});
module.exports = router;