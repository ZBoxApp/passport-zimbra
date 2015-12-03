/**
 * Created by enahum on 10/26/15.
 */

var Strategy = require('./strategy'),
    TripleDesStrategy = require('./tripledes'),
    BadRequestError = require('./errors/badrequest');


/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Strategy = Strategy;
exports.TripleDesStrategy = TripleDesStrategy;
exports.BadRequestError = BadRequestError;