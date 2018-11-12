var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    StrategyMock = require('./strategy-mock'),
    passportJWT = require("passport-jwt"),
    userController = require('../controllers').user,
    env = process.env.NODE_ENV || 'development',
    config = require(__dirname + '/../config/config.js')[env];

const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

function mockCallback(accessToken, refreshToken, profile, done) {
    if(accessToken !== undefined){
        let user = {
            id: 1,
            username: 'TestUser',
            name: 'Test User',
            password: 'nasdasdasd',
            email: 'email@email.com',
            type: 'moderator'
        };
        
        done(null, user);
    }
    else {
        done("Error", null);
    }
  }

module.exports = () => {

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        return userController.logIn(email, password, done);
    }
    ));

    if (env === 'test') {
        
        passport.use(new StrategyMock('jwt', mockCallback));
    }
    else {
        passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecret
        }, (jwtPayload, done) => {

            return userController.findUserById(jwtPayload.sub)
                .then(user => {
                    return done(null, user);
                })
                .catch(err => {
                    return done(err);
                });
        }
        ));
    }

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        userController.findUserById(id)
            .then((user) => done(null, user))
            .catch((err) => done(err, null));
    })

}

