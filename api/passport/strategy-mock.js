"use strict";

var passport = require('passport'),
    util = require('util');

function StrategyMock(name, mockCallback) {
    this.name = name;
    this._cb = mockCallback;
}

util.inherits(StrategyMock, passport.Strategy);

StrategyMock.prototype.authenticate = function(req) {

    this._cb(req.headers.authorization, null, null, (error, user) => {
        if (error) {
            this.fail(error);
        }
        this.success(user);
    });

};

module.exports = StrategyMock;
