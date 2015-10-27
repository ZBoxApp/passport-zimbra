# Passport-Zimbra

[Passport](http://passportjs.org/) strategy for authenticating with a zimbra token.

This module lets you authenticate using a token against a Zimbra server in your Node.js
applications.

By plugging into Passport, Zimbra token authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install git+https://git@github.com:ZBoxApp/passport-zimbra.git

## Usage

#### Configure Strategy

The zimbra token authentication strategy authenticates users using an email an a token issued by Zimbra.
The strategy requires a `url` to `POST` and verify against and a `verify` callback, which accepts these
credentials and calls `done` providing a user.

    passport.use(new ZimbraStrategy( { url: http://<zimbra_host>/<token validation>
      function(email, done) {
        User.findOne({ email: email }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'zimbra'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/api/authenticate',
      passport.authenticate('zimbra', { session: false,failureRedirect: '/api/unauthorized' }),
      function(req, res) {
        res.json({ message: "Authenticated" })
      });

## Examples

    curl -v -d "email=user@example.com&token=asdasjsdgfjkjhg" http://127.0.0.1:3000/api/authenticate

The token & email can be either in the request body, querystring or header

## Tests

    $ npm install --dev
    $ make test


## License

(The MIT License)

Copyright (c) 2012 Sudhakar Mani

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.