const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User').Model;

passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

        User.findOne({ email }) //Check if user exists
            .then(user => {
                if(!user) return done(null, false);

                //Check password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) console.error(err);

                    if(isMatch){
                        return done(null, user);
                    }
                    
                    return done(null, false); 
                });

            });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
