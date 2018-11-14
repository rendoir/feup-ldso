const env = process.env.NODE_ENV || 'development';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var config = require(__dirname + '/../config/config.js')[env];
const User = require('../models').users;

module.exports = {

    logIn(email, password, done) {
        let user;

        return this.findUser(email)
            .then(foundUser => {
                user = foundUser;
                return this.checkPassword(password, foundUser);
            })
            .then((res) => {
                if (res) {
                    user.password = "";
                    const payload = {
                        sub: user.id
                    };

                    const token = jwt.sign(payload, config.jwtSecret);
                    return done(null, token, user);
                }
                return done(null, false, { errors: 'Email or Password is invalid' });

            })
            .catch(() => {
                return done(null, false, { errors: 'Email or Password is invalid' });
            });
    },

    appLogIn(userBody) {

        return this.findUser(userBody.email)
            .then(foundUser => {
                if (foundUser != null){
                    return this.updateToken(foundUser, userBody.accessToken)
                        .then(() => {
                            return foundUser.id;
                        })
                        .catch((error) => {
                            return error;
                        });
                } else {
                    return this.addAppUser(userBody)
                        .then((user) => {
                            return user.id;
                        })
                        .catch((error) => {
                            return error;
                        });
                }

            })
            .catch((err) => {
                return err;
            });

    },

    addAppUser(user) {
        return User.create(
            {
                name: user.name,
                email: user.email,
                token: user.accessToken,
                username: user.email,
                password: '123',
                type: 'mobile'
            }
        );
    },

    updateToken(user, token) {
        return User.update(
            {
                token: token
            },
            {
                where: { id: user.id }
            }
        );
    },

    findUser(email) {

        return User.findOne({
            where: {
                email: email
            }
        });

    },

    findUserById(id) {
        return User.findById(id);
    },

    checkPassword(password, user) {
        return bcrypt.compare(password, user.password);
    },

    tokenMatches(token, user) {
        return User.findAll( {
            where: {
                id: user,
                token: token
            }
        })
            .then((users) => { return users.length == 1; })
            .catch(() => { return false; });
    }

};
