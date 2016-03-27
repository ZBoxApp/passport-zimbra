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
            return new ZimbraStrategy({url: 'https://localhost:7443/service/soap/AuthRequest', test: true}, function(){});
        },

        'should be named session': function (strategy) {
            assert.equal(strategy.name, 'zimbra');
        }
    },

    'strategy handling a request': {
        topic: function() {
            var strategy = new ZimbraStrategy({url: 'https://localhost:7443/service/soap/AuthRequest', test: true}, function(){});
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
                    email: 'elias@zboxapp.dev',
                    token: '0_af3a639338d5ef7a98f233d88d3743a9947c2dd8_69643d33363a34636235313566352d323635632d346230332d623433632d3131336635643637333331353b6578703d31333a313434363133323931363739333b747970653d363a7a696d6272613b7469643d31303a313035333537323436303b76657273696f6e3d31333a382e362e305f47415f313135333b'
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
            var strategy = new ZimbraStrategy({url: 'https://localhost:7443/service/soap/AuthRequest', test: true}, function(){});
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
                    token: '0_af3a639338d5ef7a98f233d88d3743a9947c2dd8_69643d33363a34636235313566352d323635632d346230332d623433632d3131336635643637333331353b6578703d31333a313434363133323931363739333b747970653d363a7a696d6272613b7469643d31303a313035333537323436303b76657273696f6e3d31333a382e362e305f47415f313135333b',
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
            var strategy = new ZimbraStrategy({url: 'https://localhost:7443/service/soap/AuthRequest', test: true}, function(){});
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
                    token: '0_af3a639338d5ef7a98f233d88d3743a9947c2dd8_69643d33363a34636235313566352d323635632d346230332d623433632d3131336635643637333331353b6578703d31333a313434363133323931363739333b747970653d363a7a696d6272613b7469643d31303a313035333537323436303b76657273696f6e3d31333a382e362e305f47415f313135333b',
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
                    url: 'https://localhost:7443/service/soap/AuthRequest',
                    passReqToCallback: true,
                    test: true
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
                    token: '0_af3a639338d5ef7a98f233d88d3743a9947c2dd8_69643d33363a34636235313566352d323635632d346230332d623433632d3131336635643637333331353b6578703d31333a313434363133323931363739333b747970653d363a7a696d6272613b7469643d31303a313035333537323436303b76657273696f6e3d31333a382e362e305f47415f313135333b',
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
                url: 'https://localhost:7443/service/soap/AuthRequest',
                email: 'correo',
                token: 'password',
                test: true
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
                    password: '0_af3a639338d5ef7a98f233d88d3743a9947c2dd8_69643d33363a34636235313566352d323635632d346230332d623433632d3131336635643637333331353b6578703d31333a313434363133323931363739333b747970653d363a7a696d6272613b7469643d31303a313035333537323436303b76657273696f6e3d31333a382e362e305f47415f313135333b'
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
            var strategy = new ZimbraStrategy({url: 'https://localhost:7443/service/soap/AuthRequest', test: true}, function(){});
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
            var strategy = new ZimbraStrategy({url: 'https://localhost:7443/service/soap/AuthRequest', test: true}, function(){});
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
            var strategy = new ZimbraStrategy({ url: 'https://localhost:7443/service/soap/AuthRequest', test:true}, function(){});
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
                req.body.token = '0_af3a639338d5ef7a98f233d88d3743a9947c2dd8_69643d33363a34636235313566352d323635632d346230332d623433632d3131336635643637333331353b6578703d31333a313434363133323931363739333b747970653d363a7a696d6272613b7469643d31303a313035333537323436303b76657273696f6e3d31333a382e362e305f47415f313135333b';

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