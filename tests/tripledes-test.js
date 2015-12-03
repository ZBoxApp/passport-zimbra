/**
 * Created by enahum on 12/2/15.
 */

var vows = require('vows');
var assert = require('assert');
var util = require('util');
var CryptoJS = require("crypto-js");
var TripleDesStrategy = require('passport-zimbra').TripleDesStrategy;
var BadRequestError = require('passport-zimbra').BadRequestError;

var _passphrase = 'thisisasecretk3y';
var encrypted = CryptoJS.TripleDES.encrypt('elias@zboxapp.dev', _passphrase).toString();

vows.describe('TripleDesStrategy').addBatch({

    'strategy': {
        topic: function() {
            return new TripleDesStrategy({passphrase: _passphrase}, function(){});
        },

        'should be named session': function (strategy) {
            assert.equal(strategy.name, 'crypto');
        }
    },

    'strategy handling a request': {
        topic: function() {
            var strategy = new TripleDesStrategy({passphrase: _passphrase}, function(){});
            return strategy;
        },

        'after augmenting with actions': {
            topic: function(strategy) {
                var self = this;
                var req = {};
                strategy.success = function(user, info) {
                    self.callback(null, user, info);
                };
                strategy.fail = function(err) {
                    console.log(err);
                    self.callback(new Error('should-not-be-called'));
                };

                strategy._verify = function(email, done) {
                    done(null, { email: email });
                };

                req.body = {
                    email: encrypted
                };

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error' : function(err, user) {
                assert.isNull(err);
            },
            'should authenticate' : function(err, user, info) {
                assert.equal(user.email, 'elias@zboxapp.dev');
            }
        }
    },

    'strategy handling a request with credentials in query': {
        topic: function() {
            var strategy = new TripleDesStrategy({passphrase: _passphrase}, function(){});
            return strategy;
        },

        'after augmenting with actions': {
            topic: function(strategy) {
                var self = this;
                var req = {};
                strategy.success = function(user, info) {
                    self.callback(null, user, info);
                };
                strategy.fail = function() {
                    self.callback(new Error('should-not-be-called'));
                };

                strategy._verify = function(email, done) {
                    done(null, { email: email });
                };

                req.query = {
                    email: encrypted
                };

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error' : function(err, user) {
                assert.isNull(err);
            },
            'should authenticate' : function(err, user, info) {
                assert.equal(user.email, 'elias@zboxapp.dev');
            }
        }
    },

    'strategy handling a request with credentials in header': {
        topic: function() {
            var strategy = new TripleDesStrategy({passphrase: _passphrase}, function(){});
            return strategy;
        },

        'after augmenting with actions': {
            topic: function(strategy) {
                var self = this;
                var req = {};
                strategy.success = function(user, info) {
                    self.callback(null, user, info);
                };
                strategy.fail = function() {
                    self.callback(new Error('should-not-be-called'));
                };

                strategy._verify = function(email, done) {
                    done(null, { email: email });
                };

                req.headers = {
                    email: encrypted
                };

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error' : function(err, user) {
                assert.isNull(err);
            },
            'should authenticate' : function(err, user, info) {
                assert.equal(user.email, 'elias@zboxapp.dev');
            }
        }
    },

    'strategy handling a request with req argument to callback': {
        topic: function() {
            var strategy = new TripleDesStrategy({passphrase: _passphrase, passReqToCallback: true}, function(){});
            return strategy;
        },

        'after augmenting with actions': {
            topic: function(strategy) {
                var self = this;
                var req = {};
                req.foo = 'bar';
                strategy.success = function(user, info) {
                    self.callback(null, user, info);
                };
                strategy.fail = function() {
                    self.callback(new Error('should-not-be-called'));
                };

                strategy._verify = function(req, email, done) {
                    done(null, { foo: req.foo, email: email });
                };

                req.body = {
                    email: encrypted
                };

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error' : function(err, user) {
                assert.isNull(err);
            },
            'should authenticate' : function(err, user, info) {
                assert.equal(user.email, 'elias@zboxapp.dev');
            },
            'should have request details' : function(err, user) {
                assert.equal(user.foo, 'bar');
            }
        }
    },

    'strategy handling a request with parameter options set to plain string': {
        topic: function() {
            var strategy = new TripleDesStrategy({
                passphrase: _passphrase,
                email: 'correo'
            }, function(){});
            return strategy;
        },

        'after augmenting with actions': {
            topic: function(strategy) {
                var self = this;
                var req = {};
                strategy.success = function(user) {
                    self.callback(null, user);
                };
                strategy.fail = function() {
                    self.callback(new Error('should-not-be-called'));
                };

                strategy._verify = function(email, done) {
                    done(null, { email: email });
                };

                req.body = {
                    correo: encrypted
                };

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error' : function(err, user) {
                assert.isNull(err);
            },
            'should authenticate' : function(err, user) {
                assert.equal(user.email, 'elias@zboxapp.dev');
            }
        }
    },

    'strategy handling a request that is not verified': {
        topic: function() {
            var strategy = new TripleDesStrategy({passphrase: _passphrase}, function(){});
            return strategy;
        },

        'after augmenting with actions': {
            topic: function(strategy) {
                var self = this;
                var req = {};
                strategy.success = function(user) {
                    self.callback(new Error('should-not-be-called'));
                };
                strategy.fail = function() {
                    self.callback();
                };

                strategy._verify = function(email, done) {
                    done(null, false);
                };

                req.body = {};
                req.body.email = 'elias@zboxapp.dev';

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication' : function(err, user) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
            }
        }
    },

    'strategy handling a request that is not verified with additional info': {
        topic: function() {
            var strategy = new TripleDesStrategy({passphrase: _passphrase}, function(){});
            return strategy;
        },

        'after augmenting with actions': {
            topic: function(strategy) {
                var self = this;
                var req = {};
                strategy.success = function(user) {
                    self.callback(new Error('should-not-be-called'));
                };
                strategy.fail = function(info) {
                    self.callback(null, info);
                };

                strategy._verify = function(email, done) {
                    done(null, false);
                };

                req.body = {};

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication' : function(err, info) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
            },
            'should pass additional info' : function(err, info) {
                assert.equal(info.message, 'Missing Email');
            }
        }
    },

    'strategy constructed without a verify callback': {
        'should throw an error': function (strategy) {
            assert.throws(function() { new TripleDesStrategy() });
        }
    }

}).export(module);