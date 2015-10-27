/**
 * Created by enahum on 10/26/15.
 */
var vows = require('vows');
var assert = require('assert');
var util = require('util');
var ZimbraStrategy = require('passport-zimbra').Strategy;
var BadRequestError = require('passport-zimbra').BadRequestError;


vows.describe('ZimbraStrategy').addBatch({

    'strategy': {
        topic: function() {
            return new ZimbraStrategy({url: 'http://192.168.99.100:9292/login'}, function(){});
        },

        'should be named session': function (strategy) {
            assert.equal(strategy.name, 'zimbra');
        }
    },

    'strategy handling a request': {
        topic: function() {
            var strategy = new ZimbraStrategy({url: 'http://192.168.99.100:9292/login'}, function(){});
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
                    self.callback(new Error('should-not-be-called'));
                };

                strategy._verify = function(email, done) {
                    done(null, { email: email });
                };

                req.body = {
                    email: 'elias@zboxapp.dev',
                    token: 'zboxadmin'
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
            var strategy = new ZimbraStrategy({url: 'http://192.168.99.100:9292/login'}, function(){});
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
                    email: 'elias@zboxapp.dev',
                    token: 'zboxadmin',
                    redirect_uri: 'http://localhost:8065/zimbra' // Esto quizas no haga falta si hago la consulta por POST
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
            var strategy = new ZimbraStrategy({url: 'http://192.168.99.100:9292/login'}, function(){});
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
                    email: 'elias@zboxapp.dev',
                    token: 'zboxadmin',
                    redirect_uri: 'http://localhost:8065/zimbra' // Esto quizas no haga falta si hago la consulta por POST
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
            var strategy = new ZimbraStrategy(
                {
                    url: 'http://192.168.99.100:9292/login',
                    passReqToCallback: true
                }, function(){});
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
                    email: 'elias@zboxapp.dev',
                    token: 'zboxadmin',
                    redirect_uri: 'http://localhost:8065/zimbra' // Esto quizas no haga falta si hago la consulta por POST
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
            var strategy = new ZimbraStrategy({
                url: 'http://192.168.99.100:9292/login',
                email: 'correo',
                token: 'password'
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
                    correo: 'elias@zboxapp.dev',
                    password: 'zboxadmin'
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
            var strategy = new ZimbraStrategy({url: 'http://192.168.99.100:9292/login'}, function(){});
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
            var strategy = new ZimbraStrategy({url: 'http://192.168.99.100:9292/login'}, function(){});
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
                req.body.email = 'elias@zboxapp.dev';

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication' : function(err, info) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
            },
            'should pass additional info' : function(err, info) {
                assert.equal(info.message, 'Missing Token');
            }
        }
    },

    'strategy handling a request that encounters an error during verification': {
        topic: function() {
            var strategy = new ZimbraStrategy({ url: 'http://192.168.99.100:9292/login' }, function(){});
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
                    self.callback(new Error('should-not-be-called'));
                };
                strategy.error = function(err) {
                    self.callback(null, err);
                };

                strategy._verify = function(email, done) {
                    done(new Error('something-went-wrong'));
                };

                req.body = {};
                req.body.email = 'elias@zboxapp.dev';
                req.body.token = 'zboxadmin';

                process.nextTick(function () {
                    strategy.authenticate(req);
                });
            },

            'should not call success or fail' : function(err, e) {
                assert.isNull(err);
            },
            'should call error' : function(err, e) {
                assert.instanceOf(e, Error);
            }
        }
    },

    'strategy handling a request without an url': {
        'should throw an error': function (strategy) {
            assert.throws(function() { new ZimbraStrategy(function(){}); });
        }
    },
    'strategy constructed without a verify callback': {
        'should throw an error': function (strategy) {
            assert.throws(function() { new ZimbraStrategy() });
        }
    }

}).export(module);