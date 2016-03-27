/**
 * Created by enahum on 10/26/15.
 */
var passport = require('passport'),
    request = require('request'),
    util = require('util'),
    fs = require('fs'),
    path = require('path'),
    BadRequestError = require('./errors/badrequest');


/**
 * `Strategy` constructor.
 *
 * The Zimbra token authentication strategy authenticates requests based on the
 * email and zimbra_token for an already logged in user in a Zimbra server.
 *
 * Applications must supply a `verify` callback which accepts `email` and
 * `redirect_uri`, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `url`                required URL to post against the zimbra server
 *   - `email`              field name where the email is found, defaults to 'email'
 *   - `token`              field name where the token is found, defaults to 'token'
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`) (optional)
 *
 * Examples:
 *
 *     passport.use(new ZimbraStrategy(
 *       function(email, redirect_uri, done) {
 *         User.findOne({ email: email }, function (err, user) {
 *           done(err, user, redirect_uri); //
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    if (typeof options == 'function') {
        throw new Error('zimbra authentication strategy requires a url to POST to');
    }
    if(!options.url) throw new Error('zimbra authentication strategy requires a url to POST to');
    if (!verify) throw new Error('zimbra authentication strategy requires a verify function');

    this._url = options.url;
    this._test = options.test;
    this._email = options.email || 'email';
    this._token = options.token || 'token';

    passport.Strategy.call(this);
    this.name = 'zimbra';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on zimbra.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
    options = options || {};

    var email = lookup(req.body, this._email)
        || lookup(req.query, this._email)
        || lookup(req.headers, this._email);

    var token = lookup(req.body, this._token)
        || lookup(req.query, this._token)
        || lookup(req.headers, this._token);

    if (!email) {
        return this.fail(new BadRequestError('Missing Email'));
    }
    else if(!token) {
        return this.fail(new BadRequestError('Missing Token'));
    }

    var self = this;

    function verified(err, user, info) {
        if (err) { return self.error(err); }
        if (!user) { return self.fail(info); }
        self.success(user, info);
    }

    // Read the xml file and set the values
    var xml = fs.readFileSync(path.join(__dirname, 'auth.xml'), {encoding: 'utf-8'})
        .replace("@account", email)
        .replace("@auth_token", token);

    request.post({
        url: self._url,
        headers: { 'Content-Type': 'text/xml' },
        body: xml,
        strictSSL: false
    }, function(err, response, body) {
        if(err) {
            if (self._test) {
                if (self._passReqToCallback) {
                    return self._verify(req, email, verified);
                } else {
                    return self._verify(email, verified);
                }
            }
            return self.fail(err);
        }
        else if(response.statusCode != 200) {
            return self.fail("Authentication failed");
        }

        if (self._passReqToCallback) {
            self._verify(req, email, verified);
        } else {
            self._verify(email, verified);
        }
    });

    function lookup(obj, field) {
        if (!obj) { return null; }
        var chain = field.split(']').join('').split('[');
        for (var i = 0, len = chain.length; i < len; i++) {
            var prop = obj[chain[i]];
            if (typeof(prop) === 'undefined') { return null; }
            if (typeof(prop) !== 'object') { return prop; }
            obj = prop;
        }
        return null;
    }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;