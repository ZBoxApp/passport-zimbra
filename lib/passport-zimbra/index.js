/**
 * Created by enahum on 10/26/15.
 */

var Strategy = require('./strategy'),
    BadRequestError = require('./errors/badrequest');


/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Strategy = Strategy;

exports.BadRequestError = BadRequestError;